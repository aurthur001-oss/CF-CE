
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, date

# --- Base Schemas ---

class EmFuelBase(BaseModel):
    fuel_id: str
    fuel_name: str
    unit: str
    color_applicable: str

class EmFuel(EmFuelBase):
    class Config:
        from_attributes = True

class EmRegionBase(BaseModel):
    region_id: str
    country: str
    state: str
    market_zone: str

class EmRegion(EmRegionBase):
    class Config:
        from_attributes = True

class EmUserMasterBase(BaseModel):
    user_id: str
    user_role: str
    company_name: str
    industry: str

class EmUserMaster(EmUserMasterBase):
    class Config:
        from_attributes = True

# --- Market Data ---

class EmMarketPriceBase(BaseModel):
    price_id: str
    fuel_id: str
    region_id: str
    price_value: float
    currency: str
    price_type: str
    timestamp: datetime

class EmMarketPrice(EmMarketPriceBase):
    class Config:
        from_attributes = True

# --- Operations ---

class EmContractBase(BaseModel):
    contract_id: str
    buyer_id: str
    producer_id: str
    fuel_id: str
    agreed_price: float
    volume: float
    start_date: datetime
    end_date: datetime

class EmContract(EmContractBase):
    class Config:
        from_attributes = True
