from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

# --- Enums matching Models ---
class ParticipantRole(str, Enum):
    ADMIN = "ADMIN"
    PRODUCER = "PRODUCER"
    BUYER = "BUYER"
    LOGISTICS = "LOGISTICS"
    REGULATOR = "REGULATOR"

class FuelType(str, Enum):
    GREEN_HYDROGEN = "GREEN_HYDROGEN"
    BLUE_HYDROGEN = "BLUE_HYDROGEN"
    GREY_HYDROGEN = "GREY_HYDROGEN"
    CBG = "CBG"
    BIO_ETHANOL = "BIO_ETHANOL"
    METHANOL = "METHANOL"
    AMMONIA = "AMMONIA"
    SAF = "SAF" 
    TURQUOISE_HYDROGEN = "TURQUOISE_HYDROGEN"
    PINK_HYDROGEN = "PINK_HYDROGEN"

# --- Participant Schemas ---
class ParticipantBase(BaseModel):
    name: str
    email: str
    role: ParticipantRole
    company_name: Optional[str] = None
    industry_type: Optional[str] = None
    region: Optional[str] = None

class ParticipantCreate(ParticipantBase):
    password: str
    role: str # Frontend sends 'role', we map to 'type'
    industry_type: Optional[str] = None
    country: Optional[str] = None
    registration_number: Optional[str] = None
    company_website: Optional[str] = None
    contact_number: Optional[str] = None
    terms_accepted: bool

class Participant(ParticipantBase):
    id: int
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Participant

# --- Facility Schemas ---
class FacilityBase(BaseModel):
    name: str
    type: str
    location_address: Optional[str] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    capacity_total: Optional[float] = None

class FacilityCreate(FacilityBase):
    pass

class Facility(FacilityBase):
    id: int
    owner_id: int
    class Config:
        orm_mode = True

# --- Listing Schemas ---
class ProductListingBase(BaseModel):
    fuel_type: FuelType
    purity_percentage: Optional[float] = None
    pressure_bar: Optional[float] = None
    carbon_intensity: Optional[float] = None
    color_classification: Optional[str] = None
    price_per_unit: float
    currency: str = "USD"
    unit: str = "kg"
    available_quantity: float
    min_order_quantity: float = 0
    delivery_terms: Optional[str] = None
    is_active: bool = True

class ProductListingCreate(ProductListingBase):
    facility_id: int

class ProductListing(ProductListingBase):
    id: int
    seller_id: int
    facility_id: int
    created_at: datetime
    facility: Optional[Facility] = None # Nested object
    class Config:
        orm_mode = True

# --- Order Schemas ---
class OrderBase(BaseModel):
    listing_id: int
    quantity: float
    shipping_address: Optional[str] = None

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    buyer_id: int
    seller_id: int
    total_price: float
    status: str
    created_at: datetime
    class Config:
        orm_mode = True

class PasswordResetRequest(BaseModel):
    email: str

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class LoginHistoryBase(BaseModel):
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class LoginHistory(LoginHistoryBase):
    id: int
    user_id: int
    login_at: datetime
    class Config:
        orm_mode = True
