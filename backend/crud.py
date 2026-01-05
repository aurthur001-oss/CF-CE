from sqlalchemy.orm import Session
from sqlalchemy import func
import models, schemas, auth


# ---# Participant CRUD
def get_participant(db: Session, participant_id: int):
    return db.query(models.Participant).filter(models.Participant.id == participant_id).first()

def get_participant_by_email(db: Session, email: str):
    return db.query(models.Participant).filter(func.lower(models.Participant.email) == email.lower()).first()

def create_participant(db: Session, participant: schemas.ParticipantCreate):
    # Assuming 'auth' module is available or get_password_hash is directly accessible
    # If 'auth' is a separate module, it needs to be imported.
    # For now, I'll assume get_password_hash is directly accessible or auth is implied.
    # Based on the instruction, it uses `auth.get_password_hash`, so I'll use that.
    # If `auth` is not imported, this will cause an error.
    # Given the context, it's likely `get_password_hash` from this file should be used,
    # but I'm following the instruction faithfully.
    hashed_password = auth.get_password_hash(participant.password)

    # Map schema fields to model fields
    db_participant = models.Participant(
        email=participant.email,
        name=participant.name,
        hashed_password=hashed_password,
        role=participant.role, # Map role to role (consistent now)
        company_name=participant.company_name,
        industry_type=participant.industry_type,
        company_website=participant.company_website,
        registration_number=participant.registration_number,
        region=participant.region,
        country=participant.country,
        contact_number=participant.contact_number,
        terms_accepted=participant.terms_accepted,
        is_active=True, 
        is_approved=True 
    )
    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)
    return db_participant

# --- Facility ---
def create_facility(db: Session, facility: schemas.FacilityCreate):
    db_facility = models.Facility(**facility.dict())
    db.add(db_facility)
    db.commit()
    db.refresh(db_facility)
    return db_facility

def get_facilities_by_owner(db: Session, owner_id: int):
    return db.query(models.Facility).filter(models.Facility.owner_id == owner_id).all()

# --- Listings ---
def create_listing(db: Session, listing: schemas.ProductListingCreate): # Removed seller_id arg if using implicit
     # NOTE: listing must have seller_id set before calling this if it's not in dict
    db_listing = models.ProductListing(**listing.dict())
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing

def get_listings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ProductListing).filter(models.ProductListing.is_active == True).offset(skip).limit(limit).all()

# --- Order CRUD
def create_order(db: Session, order: schemas.OrderCreate, buyer_id: int):
    # Calculate total price
    listing = db.query(models.ProductListing).filter(models.ProductListing.id == order.listing_id).first()
    if not listing:
        return None
    
    total_price = listing.price_per_unit * order.quantity 
    
    db_order = models.Order(
        buyer_id=buyer_id,
        listing_id=order.listing_id,
        seller_id=listing.seller_id, 
        quantity=order.quantity,
        total_price=total_price,
        shipping_address=order.shipping_address,
        status="MATCHED" 
    )
    
    # Update inventory
    listing.available_quantity -= order.quantity
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders_by_buyer(db: Session, buyer_id: int):
    return db.query(models.Order).filter(models.Order.buyer_id == buyer_id).all()
