from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas, auth
from datetime import timedelta

router = APIRouter(
    prefix="/auth-flow",
    tags=["Auth Flow"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Simulated OTP Store (In-memory for prototype)
OTP_STORE = {} 

@router.post("/step1-identity", response_model=schemas.SignupStep1Response)
def step1_identity(request: schemas.SignupStep1Request, db: Session = Depends(get_db)):
    # 1. Check if user already exists
    user = db.query(models.Participant).filter(models.Participant.email == request.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 2. Generate Simulated OTP
    simulated_otp = "123456"  # Static for demo
    OTP_STORE[request.email] = {"otp": simulated_otp, "phone": request.phone}
    
    print(f" [SIMULATION] OTP for {request.email}: {simulated_otp}")
    
    return {
        "email": request.email,
        "phone": request.phone,
        "message": "OTP Sent Successfully (Demo OTP: 123456)"
    }

@router.post("/step2-verify-otp", response_model=schemas.VerifyOTPResponse)
def step2_verify_otp(request: schemas.VerifyOTPRequest, db: Session = Depends(get_db)):
    stored_data = OTP_STORE.get(request.email)
    
    if not stored_data or stored_data["otp"] != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Generate a temp token
    temp_token = auth.create_access_token(
        data={"sub": request.email, "phone": stored_data["phone"], "scope": "kyc_pending"}, 
        expires_delta=timedelta(minutes=15)
    )
    
    return {
        "verified": True,
        "temp_token": temp_token
    }

@router.post("/step3-kyc-complete", response_model=schemas.SignupCompleteResponse)
def step3_kyc_complete(request: schemas.KYCComplaintRequest, db: Session = Depends(get_db)):
    # 1. Decode temp token to get email
    email = auth.decode_token(request.temp_token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token. Please restart signup.")
    
    # 2. Check if user already exists (edge case)
    existing_user = db.query(models.Participant).filter(models.Participant.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Account already exists. Please login instead.")
    
    # 3. Create User
    hashed_password = auth.get_password_hash(request.password)
    
    db_user = models.Participant(
        email=email,
        hashed_password=hashed_password,
        name=request.full_name,
        role=request.role,
        company_name=request.company_name,
        registration_number=request.document_id,
        is_active=True,
        is_approved=True,
        terms_accepted=request.terms_accepted,
        kyc_verified=True  # Auto-verify for demo
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # 4. Generate Final Auth Token
    access_token = auth.create_access_token(data={"sub": db_user.email})
    
    return {
        "user": db_user,
        "access_token": access_token,
        "token_type": "bearer"
    }
