from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Enum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from database import Base

# --- Enums ---

class ParticipantRole(str, enum.Enum):
    ADMIN = "ADMIN"
    PRODUCER = "PRODUCER"
    BUYER = "BUYER"
    LOGISTICS = "LOGISTICS"
    REGULATOR = "REGULATOR"

class FuelType(str, enum.Enum):
    GREEN_HYDROGEN = "GREEN_HYDROGEN"
    BLUE_HYDROGEN = "BLUE_HYDROGEN"
    GREY_HYDROGEN = "GREY_HYDROGEN"
    CBG = "CBG"
    BIO_ETHANOL = "BIO_ETHANOL"
    METHANOL = "METHANOL"
    AMMONIA = "AMMONIA" # Green Ammonia
    SAF = "SAF" # Sustainable Aviation Fuel
    TURQUOISE_HYDROGEN = "TURQUOISE_HYDROGEN"
    PINK_HYDROGEN = "PINK_HYDROGEN"

class ListingType(str, enum.Enum):
    SELL_OFFER = "SELL_OFFER"
    BUY_REQUEST = "BUY_REQUEST"
    AUCTION = "AUCTION"

class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"
    DISPUTED = "DISPUTED"

# --- Models ---

class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    # Extended Profile
    role = Column(String) # PRODUCER, BUYER, LOGISTICS, REGULATOR
    company_name = Column(String)
    industry_type = Column(String) # NEW
    
    region = Column(String)
    country = Column(String)
    
    # Status & Compliance
    registration_number = Column(String) # NEW
    company_website = Column(String) # NEW
    contact_number = Column(String) # NEW
    wallet_balance = Column(Float, default=0.0) # Wallet Feature
    kyc_verified = Column(Boolean, default=False)
    terms_accepted = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    is_approved = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    facilities = relationship("Facility", back_populates="owner")
    orders_placed = relationship("Order", back_populates="buyer", foreign_keys="Order.buyer_id")
    orders_received = relationship("Order", back_populates="seller", foreign_keys="Order.seller_id")
    logistics_assets = relationship("LogisticsAsset", back_populates="provider")
    inventory = relationship("Inventory", back_populates="owner")

class Facility(Base):
    """Production Plant, Storage Hub, or Warehouse"""
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("participants.id"))
    name = Column(String)
    type = Column(String) # Production / Storage
    location_address = Column(String)
    location_lat = Column(Float)
    location_lng = Column(Float)
    capacity_total = Column(Float) # Total capacity (tons/year)
    commissioned_date = Column(DateTime)
    
    owner = relationship("Participant", back_populates="facilities")
    listings = relationship("ProductListing", back_populates="facility")

class LogisticsAsset(Base):
    """Trucks, Pipelines, Vessels"""
    __tablename__ = "logistics_assets"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("participants.id"))
    name = Column(String) # e.g., "H2 Tanker Truck 01"
    mode = Column(String) # ROAD, RAIL, PIPELINE, VESSEL
    capacity = Column(Float) # tons
    current_location = Column(String)
    status = Column(String) # IDLE, IN_TRANSIT
    
    provider = relationship("Participant", back_populates="logistics_assets")

class ProductListing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"))
    seller_id = Column(Integer, ForeignKey("participants.id"))
    
    listing_type = Column(String, default=ListingType.SELL_OFFER)
    fuel_type = Column(String) # Enum: FuelType
    
    # Technical Specs
    purity_percentage = Column(Float) # e.g. 99.99
    pressure_bar = Column(Float) # e.g. 350, 700
    certification_standard = Column(String) # ISO, BIS
    
    # Sustainability
    carbon_intensity = Column(Float) # gCO2e/MJ
    color_classification = Column(String) # Green, Blue, Grey
    
    # Commercials
    price_per_unit = Column(Float)
    currency = Column(String, default="USD")
    unit = Column(String, default="kg") # kg, ton, m3
    available_quantity = Column(Float)
    min_order_quantity = Column(Float)
    
    delivery_terms = Column(String) # EXW, CIF, FOB
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    facility = relationship("Facility", back_populates="listings")
    seller = relationship("Participant", foreign_keys=[seller_id])
    orders = relationship("Order", back_populates="listing")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"))
    buyer_id = Column(Integer, ForeignKey("participants.id"))
    seller_id = Column(Integer, ForeignKey("participants.id"))
    logistics_provider_id = Column(Integer, ForeignKey("participants.id"), nullable=True)
    
    quantity = Column(Float)
    total_price = Column(Float)
    currency = Column(String)
    
    status = Column(String, default=OrderStatus.PENDING)
    
    shipping_address = Column(String)
    incoterm = Column(String) # FOB, CIF
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    listing = relationship("ProductListing", back_populates="orders")
    buyer = relationship("Participant", foreign_keys=[buyer_id], back_populates="orders_placed")
    seller = relationship("Participant", foreign_keys=[seller_id], back_populates="orders_received")

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    token = Column(String, index=True)
    expires_at = Column(DateTime)
    is_used = Column(Boolean, default=False)

class LoginHistory(Base):
    __tablename__ = "login_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("participants.id"))
    ip_address = Column(String)
    user_agent = Column(String)
    login_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("Participant")

# --- New Features Models ---

class TradeOrder(Base):
    __tablename__ = "trade_orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("participants.id"))
    anonymous_id = Column(String) # Randomly generated ID for blind trading
    
    order_type = Column(String) # BUY / SELL
    fuel_type = Column(String) # GREEN_HYDROGEN, etc.
    quantity = Column(Float)
    price_per_unit = Column(Float)
    
    status = Column(String, default="OPEN") # OPEN, MATCHED, CACHED
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("Participant")

class TradeTransaction(Base):
    __tablename__ = "trade_transactions"

    id = Column(Integer, primary_key=True, index=True)
    buyer_order_id = Column(Integer, ForeignKey("trade_orders.id"))
    seller_order_id = Column(Integer, ForeignKey("trade_orders.id"))
    
    quantity = Column(Float)
    price_per_unit = Column(Float)
    total_amount = Column(Float)
    
    execution_time = Column(DateTime, default=datetime.utcnow)
    
    buyer_order = relationship("TradeOrder", foreign_keys=[buyer_order_id])
    seller_order = relationship("TradeOrder", foreign_keys=[seller_order_id])

class StorageRentalListing(Base):
    __tablename__ = "storage_listings"

    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"))
    owner_id = Column(Integer, ForeignKey("participants.id"))
    
    capacity_available = Column(Float) # in tons or m3
    price_per_day = Column(Float)
    min_duration_days = Column(Integer, default=1)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    facility = relationship("Facility")
    owner = relationship("Participant")

class StorageBooking(Base):
    __tablename__ = "storage_bookings"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("storage_listings.id"))
    renter_id = Column(Integer, ForeignKey("participants.id"))
    
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    total_price = Column(Float)
    status = Column(String, default="CONFIRMED")
    
    listing = relationship("StorageRentalListing")
    renter = relationship("Participant")

class MarketplaceItem(Base):
    __tablename__ = "marketplace_items"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("participants.id"))
    
    name = Column(String)
    category = Column(String) # Electrolyzer, Compressor, Tank, etc.
    description = Column(String)
    price = Column(Float)
    stock_quantity = Column(Integer)
    image_url = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    seller = relationship("Participant")

class MarketplaceOrder(Base):
    __tablename__ = "marketplace_orders"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("marketplace_items.id"))
    buyer_id = Column(Integer, ForeignKey("participants.id"))
    
    quantity = Column(Integer)
    total_price = Column(Float)
    status = Column(String, default="PENDING") # PENDING, SHIPPED, DELIVERED
    order_date = Column(DateTime, default=datetime.utcnow)
    
    item = relationship("MarketplaceItem")
    buyer = relationship("Participant")

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("participants.id"))
    fuel_type = Column(String) # FuelType Enum
    quantity = Column(Float, default=0.0)
    last_updated = Column(DateTime, default=datetime.utcnow)

    owner = relationship("Participant", back_populates="inventory")
