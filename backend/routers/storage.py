from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import SessionLocal
from datetime import datetime

router = APIRouter(
    prefix="/storage",
    tags=["Storage Rentals"],
    responses={404: {"description": "Not found"}},
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/listings/", response_model=List[schemas.StorageListing])
def read_storage_listings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.StorageRentalListing).filter(models.StorageRentalListing.is_active == True).offset(skip).limit(limit).all()

@router.post("/listings/", response_model=schemas.StorageListing)
def create_storage_listing(listing: schemas.StorageListingCreate, owner_id: int, db: Session = Depends(get_db)):
    db_listing = models.StorageRentalListing(
        facility_id=listing.facility_id,
        owner_id=owner_id,
        capacity_available=listing.capacity_available,
        price_per_day=listing.price_per_day,
        min_duration_days=listing.min_duration_days
    )
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing

@router.post("/bookings/", response_model=schemas.StorageBooking)
def create_storage_booking(booking: schemas.StorageBookingCreate, renter_id: int, db: Session = Depends(get_db)):
    # Calculate total price
    duration = (booking.end_date - booking.start_date).days
    if duration <= 0:
        raise HTTPException(status_code=400, detail="End date must be after start date")
        
    listing = db.query(models.StorageRentalListing).filter(models.StorageRentalListing.id == booking.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
        
    total_price = duration * listing.price_per_day
    
    db_booking = models.StorageBooking(
        listing_id=booking.listing_id,
        renter_id=renter_id,
        start_date=booking.start_date,
        end_date=booking.end_date,
        total_price=total_price,
        status="CONFIRMED" # Auto-confirm for now
    )
    
    # Update availability? For simplified MVP we just assume infinite or shared capacity
    # listing.capacity_available -= ??? (Need booking amount)
    
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking
