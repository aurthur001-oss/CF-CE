from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import models, schemas
import dependencies

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    responses={404: {"description": "Not found"}},
)

# Dependency to check if user is admin
def get_current_admin(current_user: schemas.Participant = Depends(dependencies.get_current_active_user)):
    if current_user.role != models.ParticipantRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@router.get("/users", response_model=List[schemas.Participant])
def get_all_users(
    skip: int = 0, 
    limit: int = 100, 
    role_filter: str = None,
    db: Session = Depends(dependencies.get_db),
    admin: schemas.Participant = Depends(get_current_admin)
):
    query = db.query(models.Participant)
    if role_filter and role_filter != "ALL":
        query = query.filter(models.Participant.role == role_filter)
    
    return query.offset(skip).limit(limit).all()

@router.patch("/users/{user_id}/status", response_model=schemas.Participant)
def update_user_status(
    user_id: int, 
    status_update: schemas.UserStatusUpdate,
    db: Session = Depends(dependencies.get_db),
    admin: schemas.Participant = Depends(get_current_admin)
):
    user = db.query(models.Participant).filter(models.Participant.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if status_update.is_active is not None:
        user.is_active = status_update.is_active
    if status_update.is_approved is not None:
        user.is_approved = status_update.is_approved
        
    db.commit()
    db.refresh(user)
    return user

@router.get("/analytics", response_model=schemas.AdminAnalytics)
def get_analytics(
    db: Session = Depends(dependencies.get_db),
    admin: schemas.Participant = Depends(get_current_admin)
):
    total_users = db.query(models.Participant).count()
    total_producers = db.query(models.Participant).filter(models.Participant.role == models.ParticipantRole.PRODUCER).count()
    total_buyers = db.query(models.Participant).filter(models.Participant.role == models.ParticipantRole.BUYER).count()
    
    total_listings = db.query(models.ProductListing).count() + db.query(models.MarketplaceItem).count()
    
    # Calculate approx trade volume from completed orders
    trade_volume = db.query(func.sum(models.Order.total_price)).scalar() or 0.0
    
    pending_approvals = db.query(models.Participant).filter(models.Participant.is_approved == False).count()
    
    return {
        "total_users": total_users,
        "total_producers": total_producers,
        "total_buyers": total_buyers,
        "total_listings": total_listings,
        "total_trades_volume": trade_volume,
        "pending_approvals": pending_approvals
    }
