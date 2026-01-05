
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from database import Base

# --- Dimension Tables ---

class EmFuel(Base):
    __tablename__ = "em_fuel_master"
    fuel_id = Column(String, primary_key=True)
    fuel_name = Column(String)
    unit = Column(String)
    color_applicable = Column(String)

class EmRegion(Base):
    __tablename__ = "em_region_master"
    region_id = Column(String, primary_key=True)
    country = Column(String)
    state = Column(String)
    market_zone = Column(String)

class EmUserMaster(Base):
    __tablename__ = "em_user_master"
    user_id = Column(String, primary_key=True)
    user_role = Column(String)
    company_name = Column(String)
    industry = Column(String)

# --- Market Data ---

class EmMarketPrice(Base):
    __tablename__ = "em_market_price"
    price_id = Column(String, primary_key=True)
    fuel_id = Column(String, ForeignKey("em_fuel_master.fuel_id"))
    region_id = Column(String, ForeignKey("em_region_master.region_id"))
    price_value = Column(Float)
    currency = Column(String)
    price_type = Column(String)
    timestamp = Column(DateTime)

    fuel = relationship("EmFuel")
    region = relationship("EmRegion")

class EmKpiSnapshot(Base):
    __tablename__ = "em_kpi_snapshot"
    kpi_id = Column(String, primary_key=True)
    kpi_name = Column(String)
    value = Column(String)
    region_id = Column(String, ForeignKey("em_region_master.region_id"))
    period = Column(String)

    region = relationship("EmRegion")

class EmExternalData(Base):
    __tablename__ = "em_external_data"
    external_id = Column(String, primary_key=True)
    data_type = Column(String)
    source = Column(String)
    region_id = Column(String, ForeignKey("em_region_master.region_id"))
    last_updated = Column(Date)

    region = relationship("EmRegion")

# --- Profiles ---

class EmProducer(Base):
    __tablename__ = "em_producer"
    producer_id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("em_user_master.user_id"))
    ownership_type = Column(String)
    location_region_id = Column(String, ForeignKey("em_region_master.region_id"))
    commissioned_year = Column(Integer)

    user = relationship("EmUserMaster")
    region = relationship("EmRegion")

class EmProducerCapacity(Base):
    __tablename__ = "em_producer_capacity"
    capacity_id = Column(String, primary_key=True)
    producer_id = Column(String, ForeignKey("em_producer.producer_id"))
    fuel_id = Column(String, ForeignKey("em_fuel_master.fuel_id"))
    capacity_value = Column(Float)
    unit = Column(String)

    producer = relationship("EmProducer")
    fuel = relationship("EmFuel")

class EmBuyerProfile(Base):
    __tablename__ = "em_buyer_profile"
    buyer_id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("em_user_master.user_id"))
    industry = Column(String)
    price_sensitivity = Column(String)

    user = relationship("EmUserMaster")

class EmBuyerDemand(Base):
    __tablename__ = "em_buyer_demand"
    demand_id = Column(String, primary_key=True)
    buyer_id = Column(String, ForeignKey("em_buyer_profile.buyer_id"))
    fuel_id = Column(String, ForeignKey("em_fuel_master.fuel_id"))
    demand_volume = Column(Float)
    contract_duration = Column(String)
    preferred_delivery = Column(String)

    buyer = relationship("EmBuyerProfile")
    fuel = relationship("EmFuel")

class EmLogisticsPartner(Base):
    __tablename__ = "em_logistics_partner"
    logistics_id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("em_user_master.user_id"))
    transport_mode = Column(String)

    user = relationship("EmUserMaster")

# --- Operations ---

class EmLogisticsRoute(Base):
    __tablename__ = "em_logistics_route"
    route_id = Column(String, primary_key=True)
    origin_region_id = Column(String, ForeignKey("em_region_master.region_id"))
    destination_region_id = Column(String, ForeignKey("em_region_master.region_id"))
    transit_time_days = Column(Integer)

    origin_region = relationship("EmRegion", foreign_keys=[origin_region_id])
    destination_region = relationship("EmRegion", foreign_keys=[destination_region_id])

class EmSustainabilityRecord(Base):
    __tablename__ = "em_sustainability_record"
    sustainability_id = Column(String, primary_key=True)
    producer_id = Column(String, ForeignKey("em_producer.producer_id"))
    fuel_id = Column(String, ForeignKey("em_fuel_master.fuel_id"))
    carbon_intensity = Column(Float)
    hydrogen_color = Column(String)
    certification_id = Column(String)
    valid_till = Column(Integer) # Year as int or string

    producer = relationship("EmProducer")
    fuel = relationship("EmFuel")

class EmContract(Base):
    __tablename__ = "em_contract"
    contract_id = Column(String, primary_key=True)
    buyer_id = Column(String, ForeignKey("em_buyer_profile.buyer_id"))
    producer_id = Column(String, ForeignKey("em_producer.producer_id"))
    fuel_id = Column(String, ForeignKey("em_fuel_master.fuel_id"))
    agreed_price = Column(Float)
    volume = Column(Float)
    start_date = Column(DateTime)
    end_date = Column(DateTime)

    buyer = relationship("EmBuyerProfile")
    producer = relationship("EmProducer")
    fuel = relationship("EmFuel")

class EmDelivery(Base):
    __tablename__ = "em_delivery"
    delivery_id = Column(String, primary_key=True)
    contract_id = Column(String, ForeignKey("em_contract.contract_id"))
    route_id = Column(String, ForeignKey("em_logistics_route.route_id"))
    logistics_id = Column(String, ForeignKey("em_logistics_partner.logistics_id"))
    delivery_status = Column(String)
    actual_delivery_date = Column(DateTime, nullable=True)

    contract = relationship("EmContract")
    route = relationship("EmLogisticsRoute")
    logistics = relationship("EmLogisticsPartner")

class EmUserActivity(Base):
    __tablename__ = "em_user_activity"
    activity_id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("em_user_master.user_id"))
    event_type = Column(String)
    timestamp = Column(DateTime)

    user = relationship("EmUserMaster")
