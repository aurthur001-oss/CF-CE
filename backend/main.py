from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional
import pandas as pd
import os
import models, schemas, crud, auth, em_models, em_schemas # Added em_models
from database import SessionLocal, engine
import logging
from routers import trading, storage, marketplace, auth_flow, admin

# Create tables for both MVP and EM Data
models.Base.metadata.create_all(bind=engine)
em_models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CF-EnergX - H2 & CBG Marketplace")

# Include Routers
app.include_router(trading.router)
app.include_router(storage.router)
app.include_router(marketplace.router)
app.include_router(auth_flow.router)
app.include_router(admin.router)

# Enable CORS for frontend
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Auth Routes ---
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    logging.info(f"Login attempt for: {form_data.username}")
    user = crud.get_participant_by_email(db, email=form_data.username)
    if not user:
        logging.warning(f"User not found: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not auth.verify_password(form_data.password, user.hashed_password):
        logging.warning(f"Invalid password for: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Record Login History
    history = models.LoginHistory(
        user_id=user.id,
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent")
    )
    db.add(history)
    db.commit()

    logging.info(f"Successful login for: {form_data.username}")
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@app.post("/auth/forgot-password")
def forgot_password(request: schemas.PasswordResetRequest, db: Session = Depends(get_db)):
    user = crud.get_participant_by_email(db, email=request.email)
    if not user:
        # Avoid user enumeration by returning 200 even if user not found
        return {"message": "If an account exists for this email, a reset link has been sent."}
    
    token = auth.create_password_reset_token(user.email)
    
    # Store token in DB
    reset_token = models.PasswordResetToken(
        email=user.email,
        token=token,
        expires_at=datetime.utcnow() + timedelta(hours=1)
    )
    db.add(reset_token)
    db.commit()
    
    # Simulate sending email
    reset_link = f"http://localhost:8000/reset-password.html?token={token}"
    logging.info(f"PASSWORD RESET LINK for {user.email}: {reset_link}")
    print(f"\n--- SIMULATED EMAIL ---")
    print(f"To: {user.email}")
    print(f"Subject: Reset your password")
    print(f"Link: {reset_link}")
    print(f"-----------------------\n")
    
    return {"message": "Instructions to reset your password have been sent to your email."}

@app.post("/auth/reset-password")
def reset_password(request: schemas.PasswordResetConfirm, db: Session = Depends(get_db)):
    try:
        payload = auth.jwt.decode(request.token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        purpose: str = payload.get("purpose")
        if email is None or purpose != "password_reset":
            raise HTTPException(status_code=400, detail="Invalid reset token")
    except auth.JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    # Check if token exists in DB and is not used/expired
    db_token = db.query(models.PasswordResetToken).filter_by(token=request.token, is_used=False).first()
    if not db_token or db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token invalid, used, or expired")
    
    user = crud.get_participant_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update password
    user.hashed_password = auth.get_password_hash(request.new_password)
    db_token.is_used = True
    db.commit()
    
    return {"message": "Password updated successfully"}

@app.post("/users/", response_model=schemas.Token)
def register_user(participant: schemas.ParticipantCreate, db: Session = Depends(get_db)):
    db_user = crud.get_participant_by_email(db, email=participant.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = crud.create_participant(db=db, participant=participant)
    
    # Auto-login
    access_token = auth.create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": new_user}

# --- Dependencies ---
async def get_current_user(token: str = Depends(OAuth2PasswordBearer(tokenUrl="token")), db: Session = Depends(get_db)):
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except auth.JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = crud.get_participant_by_email(db, email=email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/users/me", response_model=schemas.ParticipantDetail)
async def read_users_me(current_user: schemas.Participant = Depends(get_current_user)):
    return current_user

# --- Marketplace Routes ---

@app.get("/listings/", response_model=List[schemas.ProductListing])
def read_listings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_listings(db, skip=skip, limit=limit)

@app.post("/listings/", response_model=schemas.ProductListing)
def create_listing(listing: schemas.ProductListingCreate, current_user: schemas.Participant = Depends(get_current_user), db: Session = Depends(get_db)):
    # Automatically assign seller_id
    listing.seller_id = current_user.id
    return crud.create_listing(db=db, listing=listing)

@app.post("/orders/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, current_user: schemas.Participant = Depends(get_current_user), db: Session = Depends(get_db)):
    # Ignore buyer_id from request if any, use current_user.id
    return crud.create_order(db=db, order=order, buyer_id=current_user.id)

@app.get("/users/{user_id}/orders", response_model=List[schemas.Order])
def get_user_orders(user_id: int, db: Session = Depends(get_db), current_user: schemas.Participant = Depends(get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view these orders")
    return crud.get_orders_by_buyer(db=db, buyer_id=user_id)

@app.get("/api/em-data")
def get_em_data(
    region: Optional[str] = None,
    fuel: Optional[str] = None,
    start: Optional[str] = None,
    end: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Build base query
    query = db.query(em_models.EmMarketPrice)
    if region:
        query = query.join(em_models.EmRegion, em_models.EmRegion.region_id == em_models.EmMarketPrice.region_id).filter(em_models.EmRegion.state == region)
    if fuel:
        query = query.join(em_models.EmFuel, em_models.EmFuel.fuel_id == em_models.EmMarketPrice.fuel_id).filter(em_models.EmFuel.fuel_name == fuel)
    if start:
        query = query.filter(em_models.EmMarketPrice.timestamp >= start)
    if end:
        query = query.filter(em_models.EmMarketPrice.timestamp <= end)
    results = query.all()
    if not results:
        return []
    data = []
    for price in results:
        fuel_obj = db.query(em_models.EmFuel).filter(em_models.EmFuel.fuel_id == price.fuel_id).first()
        region_obj = db.query(em_models.EmRegion).filter(em_models.EmRegion.region_id == price.region_id).first()
        data.append({
            "Fuel": fuel_obj.fuel_name if fuel_obj else price.fuel_id,
            "Region": region_obj.state if region_obj else price.region_id,
            "Country": region_obj.country if region_obj else "",
            "Price": f"{price.price_value} {price.currency}",
            "Type": price.price_type,
            "Date": price.timestamp.strftime('%Y-%m-%d') if price.timestamp else "",
        })
    return data

@app.post("/api/em/seed")
def seed_em_data():
    import import_em_data
    try:
        import_em_data.import_data()
        return {"message": "Data imported successfully"}
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))

# --- Frontend Serving ---
# Mount frontend directory
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")

@app.get("/")
def read_root():
    return FileResponse(os.path.join(frontend_path, "index.html"))

@app.get("/login.html")
def read_login():
    return FileResponse(os.path.join(frontend_path, "login.html"))

@app.get("/signup.html")
def read_signup():
    return FileResponse(os.path.join(frontend_path, "signup.html"))

@app.get("/dashboard.html")
def read_dashboard():
    return FileResponse(os.path.join(frontend_path, "dashboard.html"))

@app.get("/market.html")
def read_market():
    return FileResponse(os.path.join(frontend_path, "market.html"))

app.mount("/static", StaticFiles(directory=frontend_path), name="static")

# Catch-all for other HTML files if needed, or rely on static mounting if they are referenced relatively
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
