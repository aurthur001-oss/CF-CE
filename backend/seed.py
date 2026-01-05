from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas, crud, auth
import bcrypt

# Ensure tables exist
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Removed local get_password_hash to use auth.get_password_hash for consistency

def seed_data():
    print("Clearing old data...")
    db.query(models.Order).delete()
    db.query(models.ProductListing).delete()
    db.query(models.Facility).delete()
    db.query(models.Participant).delete()
    db.commit()

    print("Seeding Realistic Market Data...")
    
    # --- PRODUCERS ---
    producers = [
        {"name": "L&T Green Energy", "email": "lt_green@example.com", "region": "Gujarat", "company": "L&T Green Energy Kandla Pvt Ltd"},
        {"name": "GAIL India Ltd", "email": "gail_renewables@example.com", "region": "Madhya Pradesh", "company": "GAIL (India) Limited"},
        {"name": "ACME Solar", "email": "acme_sales@example.com", "region": "Rajasthan", "company": "ACME Cleantech Solutions"},
        {"name": "Adani New Industries", "email": "adani_new@example.com", "region": "Gujarat", "company": "Adani New Industries Ltd"},
        {"name": "Oil India Ltd", "email": "oilindia_ops@example.com", "region": "Assam", "company": "Oil India Limited"}
    ]

    db_producers = []
    for p in producers:
        user_data = schemas.ParticipantCreate(
            name=p["name"],
            email=p["email"],
            password="password123",
            role=models.ParticipantRole.PRODUCER,
            company_name=p["company"],
            region=p["region"],
            country="India",
            terms_accepted=True
        )
        hashed_pw = auth.get_password_hash(user_data.password)
        db_user = models.Participant(
            name=user_data.name,
            email=user_data.email,
            hashed_password=hashed_pw,
            role=user_data.role, # Changed to role
            company_name=user_data.company_name,
            region=user_data.region,
            country="India",
            kyc_verified=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        db_producers.append(db_user)

    # --- BUYERS & LOGISTICS ---
    buyer = models.Participant(
        name="Jindal Stainless",
        email="buyer@example.com",
        hashed_password=auth.get_password_hash("password123"),
        role=models.ParticipantRole.BUYER, # Changed to role
        company_name="Jindal Stainless Ltd",
        region="Haryana",
        country="India",
        kyc_verified=True,
        terms_accepted=True
    )
    db.add(buyer)

    logistics = models.Participant(
        name="InoxCVA Logistics",
        email="logistics@example.com",
        hashed_password=auth.get_password_hash("password123"),
        role=models.ParticipantRole.LOGISTICS, # Changed to role
        company_name="InoxCVA",
        region="Gujarat",
        country="India",
        kyc_verified=True,
        terms_accepted=True
    )
    db.add(logistics)
    db.commit()

    # --- FACILITIES ---
    facilities_data = [
        {"owner": db_producers[0], "name": "L&T Hazira Green H2 Plant", "loc": "Hazira, Gujarat", "lat": 21.17, "lng": 72.81, "cap": 16000}, # 45kg/day approx 16T/year scaled up
        {"owner": db_producers[1], "name": "Vijaipur Green Hydrogen Unit", "loc": "Vijaipur, MP", "lat": 24.03, "lng": 77.16, "cap": 1500}, # 4.3 TPD
        {"owner": db_producers[2], "name": "Bikaner Green Ammonia Plant", "loc": "Bikaner, Rajasthan", "lat": 28.02, "lng": 73.31, "cap": 17000},
        {"owner": db_producers[3], "name": "Mundra Solar-H2 Park", "loc": "Mundra, Gujarat", "lat": 22.84, "lng": 69.71, "cap": 25000},
        {"owner": db_producers[4], "name": "Jorhat Green Hydrogen Pilot", "loc": "Jorhat, Assam", "lat": 26.75, "lng": 94.20, "cap": 365} # 10kg/day
    ]

    db_facilities = []
    for f in facilities_data:
        fac = models.Facility(
            owner_id=f["owner"].id,
            name=f["name"],
            type="PRODUCTION",
            location_address=f["loc"],
            location_lat=f["lat"],
            location_lng=f["lng"],
            capacity_total=f["cap"]
        )
        db.add(fac)
        db.commit()
        db.refresh(fac)
        db_facilities.append(fac)

    # --- REALISTIC LISTINGS ---
    # Prices based on search: Green H2 ~$4.5/kg, CBG ~₹77/kg ($0.92)
    listings = [
        {
            "facility": db_facilities[0],
            "fuel": models.FuelType.GREEN_HYDROGEN,
            "purity": 99.99,
            "pressure": 700,
            "ci": 0.5,
            "price": 4.50, # USD
            "qty": 500,
            "term": "EXW"
        },
        {
            "facility": db_facilities[1],
            "fuel": models.FuelType.GREEN_HYDROGEN,
            "purity": 99.9,
            "pressure": 350,
            "ci": 0.8,
            "price": 4.35,
            "qty": 4300, 
            "term": "FOB"
        },
        {
            "facility": db_facilities[2], 
            "fuel": models.FuelType.GREEN_HYDROGEN, # Selling H2 carrier or Ammonia
            "purity": 98.0,
            "pressure": 200,
            "ci": 1.2,
            "price": 3.90, # Cheaper due to scale
            "qty": 10000,
            "term": "CIF"
        },
         {
            "facility": db_facilities[3],
            "fuel": models.FuelType.BLUE_HYDROGEN,
            "purity": 99.5,
            "pressure": 500,
            "ci": 4.2,
            "price": 2.10, # Generic Blue H2 price reference
            "qty": 5000,
            "term": "EXW"
        },
        {
            "facility": db_facilities[3],
            "fuel": models.FuelType.CBG,
            "purity": 96.0, # Bio-methane
            "pressure": 250,
            "ci": 15.0,
            "price": 0.92, # Approx 77 INR
            "qty": 25000,
            "term": "FOB"
        },
        {
            "facility": db_facilities[2],
            "fuel": models.FuelType.AMMONIA,
            "purity": 99.5,
            "pressure": 18,
            "ci": 0.1,
            "price": 0.65, # Approx €650/ton
            "qty": 50000,
            "term": "CIF"
        },
        {
            "facility": db_facilities[4],
            "fuel": models.FuelType.METHANOL,
            "purity": 99.85,
            "pressure": 1,
            "ci": 0.3,
            "price": 0.45, # ~$450/ton
            "qty": 10000,
            "term": "EXW"
        }
    ]

    for l in listings:
        listing = models.ProductListing(
            facility_id=l["facility"].id,
            seller_id=l["facility"].owner_id,
            fuel_type=l["fuel"],
            purity_percentage=l["purity"],
            pressure_bar=l["pressure"],
            carbon_intensity=l["ci"],
            price_per_unit=l["price"],
            currency="USD",
            unit="kg",
            available_quantity=l["qty"],
            min_order_quantity=100.0, # Default min order
            delivery_terms=l["term"],
            is_active=True
        )
        db.add(listing)
    
    db.commit()
    print("Seeding Complete: 5 Producers, 5 Facilities, Real Market Pricing Loaded.")
    db.close()

if __name__ == "__main__":
    seed_data()
