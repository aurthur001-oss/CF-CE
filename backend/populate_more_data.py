
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from datetime import datetime, timedelta
import random

def populate_market_data():
    db = SessionLocal()
    try:
        # 1. Ensure we have a producer and a facility
        producer = db.query(models.Participant).filter_by(role="PRODUCER").first()
        if not producer:
            print("Creating dummy producer...")
            producer = models.Participant(
                name="Global Energy Corp",
                email="producer@example.com",
                hashed_password="hashed_password_placeholder", # Not used for browsing
                role="PRODUCER",
                company_name="Global Energy Corp",
                industry_type="Energy",
                country="India",
                region="Gujarat",
                terms_accepted=True,
                is_active=True,
                is_approved=True
            )
            db.add(producer)
            db.commit()
            db.refresh(producer)

        facility = db.query(models.Facility).filter_by(owner_id=producer.id).first()
        if not facility:
            print("Creating dummy facility...")
            facility = models.Facility(
                owner_id=producer.id,
                name="Gujarat Green Tech Hub",
                type="Production",
                location_address="Mundra, Gujarat",
                capacity_total=1000000.0
            )
            db.add(facility)
            db.commit()
            db.refresh(facility)

        # 2. Add diverse Hydrogen listings
        hydrogen_types = [
            ("GREEN_HYDROGEN", 5.50, 6.50, "Electrolysis (Renewable)"),
            ("BLUE_HYDROGEN", 3.20, 4.00, "SMR + CCS"),
            ("GREY_HYDROGEN", 1.50, 2.20, "SWS/SMR (Fossil)"),
            ("TURQUOISE_HYDROGEN", 2.80, 3.50, "Methane Pyrolysis"),
            ("PINK_HYDROGEN", 4.50, 5.20, "Nuclear Electrolysis"),
            ("CBG", 0.80, 1.20, "Bio-Gas Purification"),
            ("AMMONIA", 0.60, 0.90, "Green Ammonia Synthesis")
        ]

        regions = ["Gujarat", "Rajasthan", "Maharashtra", "Tamil Nadu", "Karnataka"]
        
        print("Adding market listings...")
        for h_type, p_min, p_max, desc in hydrogen_types:
            for i in range(2): # Create 2 listings for each type
                price = round(random.uniform(p_min, p_max), 2)
                region = random.choice(regions)
                qty = random.randint(500, 5000)
                
                listing = models.ProductListing(
                    facility_id=facility.id,
                    seller_id=producer.id,
                    listing_type="SELL_OFFER",
                    fuel_type=h_type,
                    purity_percentage=99.9,
                    pressure_bar=random.choice([350, 700]),
                    carbon_intensity=round(random.uniform(0.1, 10.0), 2),
                    price_per_unit=price,
                    currency="USD",
                    unit="kg",
                    available_quantity=qty,
                    min_order_quantity=50,
                    delivery_terms="EXW",
                    is_active=True
                )
                db.add(listing)

        db.commit()
        print("Market data populated successfully!")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    populate_market_data()
