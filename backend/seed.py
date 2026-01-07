"""
EnergyX Exchange - Large Scale Seed Data Generator
Generates 5000+ synthetic entries including:
- 2000+ Participants (Producers, Buyers, Logistics, Regulators)
- 500+ Facilities
- 2000+ Trade Orders
- 800+ Storage Listings
- 500+ Marketplace Items
"""

from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, auth
import random
import uuid
from datetime import datetime, timedelta

# Ensure tables exist
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

# ============================================
# DATA POOLS FOR REALISTIC GENERATION
# ============================================

COUNTRIES_REGIONS = {
    "India": ["Gujarat", "Maharashtra", "Tamil Nadu", "Karnataka", "Rajasthan", "Andhra Pradesh", "Haryana", "Madhya Pradesh", "Assam", "Odisha", "Kerala", "Punjab", "Uttar Pradesh", "West Bengal", "Bihar"],
    "UAE": ["Abu Dhabi", "Dubai", "Sharjah", "Fujairah", "Ras Al Khaimah", "Ajman", "Umm Al Quwain"],
    "Germany": ["Bavaria", "North Rhine-Westphalia", "Baden-Württemberg", "Lower Saxony", "Hamburg", "Berlin", "Hesse", "Saxony"],
    "USA": ["Texas", "California", "Louisiana", "Ohio", "Pennsylvania", "New York", "Florida", "Illinois", "Michigan", "Washington"],
    "Japan": ["Tokyo", "Osaka", "Aichi", "Fukuoka", "Hokkaido", "Kanagawa", "Saitama", "Chiba"],
    "Australia": ["Queensland", "Western Australia", "New South Wales", "Victoria", "South Australia", "Tasmania"],
    "Netherlands": ["South Holland", "North Holland", "North Brabant", "Gelderland", "Utrecht"],
    "Saudi Arabia": ["Riyadh", "Eastern Province", "Makkah", "Madinah", "Tabuk", "Asir"],
    "China": ["Shanghai", "Beijing", "Guangdong", "Jiangsu", "Zhejiang", "Shandong", "Henan"],
    "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Gwangju", "Ulsan"],
    "UK": ["England", "Scotland", "Wales", "Northern Ireland"],
    "France": ["Île-de-France", "Provence", "Occitanie", "Nouvelle-Aquitaine"],
    "Canada": ["Alberta", "British Columbia", "Ontario", "Quebec"],
    "Brazil": ["São Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia"],
    "Chile": ["Antofagasta", "Atacama", "Valparaíso", "Metropolitana"],
    "Morocco": ["Casablanca-Settat", "Rabat-Salé-Kénitra", "Tanger-Tétouan"],
    "Egypt": ["Cairo", "Alexandria", "Giza", "Suez"],
    "Oman": ["Muscat", "Dhofar", "Al Batinah"],
    "Norway": ["Oslo", "Vestland", "Rogaland", "Trøndelag"],
    "Spain": ["Catalonia", "Andalusia", "Madrid", "Valencia"],
}

COMPANY_PREFIXES = ["Green", "Solar", "Wind", "Renewable", "Clean", "Eco", "Sustainable", "Net-Zero", "Carbon-Free", "Future", "New", "Advanced", "Global", "Prime", "Elite", "Premium", "Infinity", "Quantum", "NextGen", "Ultra"]
COMPANY_SUFFIXES = ["Energy", "Power", "Industries", "Solutions", "Technologies", "Systems", "Corp", "Holdings", "Group", "Ventures", "Dynamics", "Enterprises", "Partners", "Global", "International"]
PRODUCER_TYPES = ["Hydrogen", "Renewables", "Clean Fuel", "Green Energy", "Ammonia", "Biofuels", "Solar", "Wind", "Nuclear"]
BUYER_INDUSTRIES = ["Steel Manufacturing", "Automotive", "Shipping", "Aviation", "Chemicals", "Railways", "Cement", "Glass Manufacturing", "Food Processing", "Pharmaceuticals", "Oil Refining", "Power Generation", "Mining", "Construction", "Agriculture"]
LOGISTICS_TYPES = ["Transport", "Logistics", "Shipping", "Carriers", "Freight", "Tankers", "Pipeline", "Distribution"]

FUEL_TYPES = ["GREEN_HYDROGEN", "BLUE_HYDROGEN", "GREY_HYDROGEN", "CBG", "BIO_ETHANOL", "METHANOL", "AMMONIA", "SAF", "TURQUOISE_HYDROGEN", "PINK_HYDROGEN"]
FUEL_PRICES = {
    "GREEN_HYDROGEN": (4.0, 5.5), "BLUE_HYDROGEN": (1.8, 2.5), "GREY_HYDROGEN": (1.0, 1.5),
    "CBG": (0.75, 1.2), "BIO_ETHANOL": (0.6, 0.95), "METHANOL": (0.35, 0.55),
    "AMMONIA": (0.55, 0.75), "SAF": (1.5, 2.2), "TURQUOISE_HYDROGEN": (2.5, 3.5), "PINK_HYDROGEN": (3.0, 4.0),
}

EQUIPMENT_ITEMS = [
    ("PEM Electrolyzer Stack 1MW", "Electrolyzer", 850000, 3),
    ("PEM Electrolyzer Stack 5MW", "Electrolyzer", 3800000, 2),
    ("Alkaline Electrolyzer 10MW", "Electrolyzer", 6500000, 1),
    ("SOEC Electrolyzer Unit", "Electrolyzer", 1200000, 2),
    ("AEM Electrolyzer 500kW", "Electrolyzer", 420000, 5),
    ("Diaphragm Compressor 350 bar", "Compressor", 120000, 8),
    ("Ionic Compressor 700 bar", "Compressor", 280000, 4),
    ("Reciprocating Compressor 500 bar", "Compressor", 95000, 12),
    ("Booster Compressor 900 bar", "Compressor", 350000, 3),
    ("Type I Steel Cylinder 50L", "Storage Tank", 450, 500),
    ("Type III Aluminum Cylinder", "Storage Tank", 1200, 300),
    ("Type IV Carbon Fiber Tank 10kg", "Storage Tank", 2200, 150),
    ("Cryogenic LH2 Tank 1000L", "Storage Tank", 45000, 20),
    ("Underground Salt Cavern Lease", "Storage Tank", 500000, 5),
    ("Ammonia Storage Tank 50MT", "Storage Tank", 180000, 15),
    ("PEM Fuel Cell 100kW", "Fuel Cell", 180000, 15),
    ("SOFC Fuel Cell Unit", "Fuel Cell", 220000, 8),
    ("AFC Fuel Cell Stack", "Fuel Cell", 95000, 20),
    ("High-Pressure H2 Valve 700 bar", "Valve & Fitting", 450, 800),
    ("Check Valve SS316 350 bar", "Valve & Fitting", 180, 1200),
    ("Pressure Regulator Kit", "Valve & Fitting", 350, 600),
    ("Quick Connect Coupling", "Valve & Fitting", 85, 2000),
    ("H2 Leak Detection Sensor", "Sensor & Safety", 120, 2000),
    ("Flame Detector Industrial", "Sensor & Safety", 280, 500),
    ("Emergency Shutdown System", "Sensor & Safety", 15000, 50),
    ("Gas Detection Panel", "Sensor & Safety", 8500, 100),
    ("Tube Trailer 500kg", "Transport Container", 180000, 25),
    ("ISO Container LH2 40ft", "Transport Container", 450000, 8),
    ("MEGC Container 1000kg", "Transport Container", 320000, 12),
    ("Ammonia ISO Tank", "Transport Container", 85000, 30),
    ("H2 Dispenser 350 bar", "Dispenser", 85000, 30),
    ("H2 Dispenser 700 bar", "Dispenser", 145000, 20),
    ("Multi-Fuel Dispenser", "Dispenser", 195000, 10),
    ("Marine Bunkering System", "Dispenser", 850000, 3),
    ("Plate Heat Exchanger", "Heat Exchanger", 25000, 40),
    ("Shell & Tube HX Industrial", "Heat Exchanger", 65000, 20),
    ("PLC Control Cabinet", "Control System", 18000, 100),
    ("SCADA System License", "Control System", 45000, 50),
    ("Flow Meter Coriolis", "Meter", 12000, 150),
    ("Pressure Transmitter", "Meter", 850, 500),
]

FACILITY_TYPES = ["Production", "Storage", "Distribution Hub", "Refueling Station", "Export Terminal", "Import Terminal"]
FACILITY_PREFIXES = ["Green", "Solar", "Wind", "Hydro", "Renewable", "Clean", "Sustainable", "Net-Zero", "Carbon-Free", "Eco", "Advanced", "Premium", "Global"]
FACILITY_SUFFIXES = ["Energy Hub", "H2 Plant", "Hydrogen Facility", "Ammonia Complex", "Storage Terminal", "Processing Unit", "Distribution Center", "Export Terminal", "Refueling Station", "Energy Park"]


def get_random_coords(country: str):
    """Get random lat/lng based on country"""
    coords = {
        "India": (8.0, 35.0, 68.0, 97.0),
        "UAE": (22.5, 26.5, 51.0, 56.5),
        "Germany": (47.0, 55.0, 5.5, 15.0),
        "USA": (25.0, 48.0, -125.0, -70.0),
        "Japan": (31.0, 45.0, 129.0, 146.0),
        "Australia": (-38.0, -12.0, 113.0, 154.0),
        "Netherlands": (50.5, 53.5, 3.0, 7.5),
        "Saudi Arabia": (16.0, 32.0, 34.0, 56.0),
        "China": (18.0, 53.0, 73.0, 135.0),
        "South Korea": (33.0, 38.5, 124.0, 132.0),
        "UK": (49.5, 60.0, -8.0, 2.0),
        "France": (41.0, 51.0, -5.0, 10.0),
        "Canada": (42.0, 70.0, -141.0, -52.0),
        "Brazil": (-33.0, 5.0, -73.0, -35.0),
        "Chile": (-55.0, -17.0, -76.0, -66.0),
        "Morocco": (27.0, 36.0, -13.0, -1.0),
        "Egypt": (22.0, 32.0, 25.0, 35.0),
        "Oman": (16.0, 26.0, 52.0, 60.0),
        "Norway": (57.0, 71.0, 4.0, 31.0),
        "Spain": (36.0, 44.0, -9.0, 4.0),
    }
    lat_min, lat_max, lng_min, lng_max = coords.get(country, (20.0, 30.0, 70.0, 80.0))
    return round(random.uniform(lat_min, lat_max), 4), round(random.uniform(lng_min, lng_max), 4)


def generate_company_name(role: str, index: int):
    """Generate unique company name"""
    prefix = random.choice(COMPANY_PREFIXES)
    suffix = random.choice(COMPANY_SUFFIXES)
    if role == "PRODUCER":
        type_name = random.choice(PRODUCER_TYPES)
        return f"{prefix} {type_name} {suffix}"
    elif role == "BUYER":
        industry = random.choice(BUYER_INDUSTRIES).split()[0]
        return f"{prefix}{industry} {suffix}"
    else:
        type_name = random.choice(LOGISTICS_TYPES)
        return f"{prefix} {type_name} {suffix}"


def seed_data():
    print("=" * 70)
    print("ENERGYX EXCHANGE - LARGE SCALE DATA SEEDING (5000+ ENTRIES)")
    print("=" * 70)
    
    print("\n[1/7] Clearing existing data...")
    db.query(models.MarketplaceOrder).delete()
    db.query(models.MarketplaceItem).delete()
    db.query(models.StorageBooking).delete()
    db.query(models.StorageRentalListing).delete()
    db.query(models.TradeTransaction).delete()
    db.query(models.TradeOrder).delete()
    db.query(models.Order).delete()
    db.query(models.ProductListing).delete()
    db.query(models.Facility).delete()
    db.query(models.PasswordResetToken).delete()
    db.query(models.LoginHistory).delete()
    db.query(models.LogisticsAsset).delete()
    db.query(models.Participant).delete()
    db.commit()
    
    # ============================================
    # PARTICIPANTS (2000+)
    # ============================================
    print("\n[2/7] Creating 2000+ Participants...")
    
    all_participants = []
    used_emails = set()
    
    def get_unique_email(prefix: str, index: int):
        base = f"{prefix}_{index}"
        email = f"{base}@energyx.com"
        while email in used_emails:
            email = f"{base}_{random.randint(100,999)}@energyx.com"
        used_emails.add(email)
        return email
    
    # PRODUCERS (800)
    for i in range(800):
        country = random.choice(list(COUNTRIES_REGIONS.keys()))
        region = random.choice(COUNTRIES_REGIONS[country])
        company = generate_company_name("PRODUCER", i)
        user = models.Participant(
            name=f"{company} Operations",
            email=get_unique_email(f"producer", i),
            hashed_password=auth.get_password_hash("password123"),
            role="PRODUCER",
            company_name=company,
            industry_type="Clean Energy Production",
            region=region,
            country=country,
            kyc_verified=random.random() > 0.1,
            terms_accepted=True,
            is_active=True,
            is_approved=random.random() > 0.05,
            wallet_balance=round(random.uniform(5000000, 500000000), 2), # $5M - $500M
        )
        db.add(user)
        if i % 100 == 99:
            db.commit()
            print(f"   ... {i+1} producers created")
    db.commit()
    
    # Get producers for relationships
    producers = db.query(models.Participant).filter(models.Participant.role == "PRODUCER").all()
    all_participants.extend([("PRODUCER", p) for p in producers])
    
    # BUYERS (1000)
    for i in range(1000):
        country = random.choice(list(COUNTRIES_REGIONS.keys()))
        region = random.choice(COUNTRIES_REGIONS[country])
        company = generate_company_name("BUYER", i)
        user = models.Participant(
            name=f"{company} Procurement",
            email=get_unique_email(f"buyer", i),
            hashed_password=auth.get_password_hash("password123"),
            role="BUYER",
            company_name=company,
            industry_type=random.choice(BUYER_INDUSTRIES),
            region=region,
            country=country,
            kyc_verified=random.random() > 0.1,
            terms_accepted=True,
            is_active=True,
            is_approved=random.random() > 0.05,
            wallet_balance=round(random.uniform(10000000, 1000000000), 2), # $10M - $1B
        )
        db.add(user)
        if i % 100 == 99:
            db.commit()
            print(f"   ... {i+1} buyers created")
    db.commit()
    
    buyers = db.query(models.Participant).filter(models.Participant.role == "BUYER").all()
    all_participants.extend([("BUYER", p) for p in buyers])
    
    # LOGISTICS (200)
    for i in range(200):
        country = random.choice(list(COUNTRIES_REGIONS.keys()))
        region = random.choice(COUNTRIES_REGIONS[country])
        company = generate_company_name("LOGISTICS", i)
        user = models.Participant(
            name=f"{company}",
            email=get_unique_email(f"logistics", i),
            hashed_password=auth.get_password_hash("password123"),
            role="LOGISTICS",
            company_name=company,
            industry_type="Energy Logistics & Transport",
            region=region,
            country=country,
            kyc_verified=random.random() > 0.1,
            terms_accepted=True,
            is_active=True,
            is_approved=random.random() > 0.05,
        )
        db.add(user)
    db.commit()
    
    logistics = db.query(models.Participant).filter(models.Participant.role == "LOGISTICS").all()
    all_participants.extend([("LOGISTICS", p) for p in logistics])
    
    print(f"   ✓ Created {len(all_participants)} participants total")
    
    # ============================================
    # FACILITIES (500+)
    # ============================================
    print("\n[3/7] Creating 500+ Facilities...")
    
    all_facilities = []
    facility_count = 0
    
    for producer in producers[:400]:  # Top 400 producers get facilities
        num_facilities = random.randint(1, 3)
        for _ in range(num_facilities):
            lat, lng = get_random_coords(producer.country)
            fac_type = random.choice(FACILITY_TYPES)
            name = f"{random.choice(FACILITY_PREFIXES)} {producer.company_name.split()[0]} {random.choice(FACILITY_SUFFIXES)}"
            
            facility = models.Facility(
                owner_id=producer.id,
                name=name,
                type=fac_type,
                location_address=f"{producer.region}, {producer.country}",
                location_lat=lat,
                location_lng=lng,
                capacity_total=random.randint(500, 100000),
                commissioned_date=datetime.now() - timedelta(days=random.randint(30, 2000)),
            )
            db.add(facility)
            facility_count += 1
            
        if facility_count % 100 == 0:
            db.commit()
            print(f"   ... {facility_count} facilities created")
    
    db.commit()
    all_facilities = db.query(models.Facility).all()
    db.commit()
    all_facilities = db.query(models.Facility).all()
    print(f"   ✓ Created {len(all_facilities)} facilities")

    # ============================================
    # INVENTORY (For Producers/Logistics) - NEW
    # ============================================
    print("\n[-] Creating Inventory Records...")
    inventory_items = 0
    for user_type, user in all_participants:
        if user_type in ["PRODUCER", "LOGISTICS"]:
            # Give them some initial stock
            num_fuels = random.randint(1, 4)
            for _ in range(num_fuels):
                inv = models.Inventory(
                    user_id=user.id,
                    fuel_type=random.choice(FUEL_TYPES[:8]),
                    quantity=random.uniform(1000, 50000), # kg
                    last_updated=datetime.utcnow()
                )
                db.add(inv)
                inventory_items += 1
    db.commit()
    print(f"   ✓ Created {inventory_items} inventory records")
    
    # ============================================
    # PRODUCT LISTINGS (300+)
    # ============================================
    print("\n[4/7] Creating Product Listings...")
    
    listings_created = 0
    for facility in all_facilities[:300]:
        num_listings = random.randint(1, 2)
        for _ in range(num_listings):
            fuel = random.choice(FUEL_TYPES[:8])
            price_range = FUEL_PRICES[fuel]
            
            listing = models.ProductListing(
                facility_id=facility.id,
                seller_id=facility.owner_id,
                listing_type="SELL_OFFER",
                fuel_type=fuel,
                purity_percentage=round(random.uniform(95.0, 99.99), 2),
                pressure_bar=random.choice([200, 350, 500, 700]),
                certification_standard=random.choice(["ISO 14687", "BIS 17314", "SAE J2719", "EN 17124"]),
                carbon_intensity=round(random.uniform(0.1, 5.0), 2),
                price_per_unit=round(random.uniform(*price_range), 2),
                currency="USD",
                unit="kg",
                available_quantity=random.randint(100, 50000),
                min_order_quantity=random.choice([50, 100, 500, 1000]),
                delivery_terms=random.choice(["EXW", "FOB", "CIF", "DAP", "DDP"]),
                is_active=True,
            )
            db.add(listing)
            listings_created += 1
    
    db.commit()
    print(f"   ✓ Created {listings_created} product listings")
    
    # ============================================
    # TRADE ORDERS (2000+)
    # ============================================
    print("\n[5/7] Creating 2000+ Trade Orders...")
    
    trade_orders_created = 0
    
    # SELL orders from producers
    for _ in range(1100):
        producer = random.choice(producers)
        fuel = random.choice(FUEL_TYPES[:8])
        price_range = FUEL_PRICES[fuel]
        base_price = random.uniform(*price_range)
        
        order = models.TradeOrder(
            user_id=producer.id,
            anonymous_id=f"ANON-{uuid.uuid4().hex[:8].upper()}",
            order_type="SELL",
            fuel_type=fuel,
            quantity=random.randint(100, 10000),
            price_per_unit=round(base_price * random.uniform(0.95, 1.08), 2),
            status=random.choice(["OPEN", "OPEN", "OPEN", "OPEN", "MATCHED"]),
            created_at=datetime.now() - timedelta(hours=random.randint(1, 2000)),
        )
        db.add(order)
        trade_orders_created += 1
        
        if trade_orders_created % 500 == 0:
            db.commit()
            print(f"   ... {trade_orders_created} trade orders created")
    
    # BUY orders from buyers
    for _ in range(1100):
        buyer = random.choice(buyers)
        fuel = random.choice(FUEL_TYPES[:8])
        price_range = FUEL_PRICES[fuel]
        base_price = random.uniform(*price_range)
        
        order = models.TradeOrder(
            user_id=buyer.id,
            anonymous_id=f"ANON-{uuid.uuid4().hex[:8].upper()}",
            order_type="BUY",
            fuel_type=fuel,
            quantity=random.randint(100, 10000),
            price_per_unit=round(base_price * random.uniform(0.90, 1.02), 2),
            status=random.choice(["OPEN", "OPEN", "OPEN", "OPEN", "MATCHED"]),
            created_at=datetime.now() - timedelta(hours=random.randint(1, 2000)),
        )
        db.add(order)
        trade_orders_created += 1
        
        if trade_orders_created % 500 == 0:
            db.commit()
            print(f"   ... {trade_orders_created} trade orders created")
    
    db.commit()
    print(f"   ✓ Created {trade_orders_created} trade orders")
    
    # ============================================
    # STORAGE LISTINGS (800+)
    # ============================================
    print("\n[6/7] Creating 800+ Storage Listings...")
    
    storage_created = 0
    for facility in all_facilities:
        if random.random() > 0.2:  # 80% have storage
            num_listings = random.randint(1, 3)
            for _ in range(num_listings):
                listing = models.StorageRentalListing(
                    facility_id=facility.id,
                    owner_id=facility.owner_id,
                    capacity_available=random.randint(100, 25000),
                    price_per_day=round(random.uniform(30, 800), 2),
                    min_duration_days=random.choice([1, 3, 7, 14, 30, 90]),
                    is_active=True,
                )
                db.add(listing)
                storage_created += 1
        
        if storage_created % 200 == 0 and storage_created > 0:
            db.commit()
    
    db.commit()
    print(f"   ✓ Created {storage_created} storage listings")
    
    # ============================================
    # MARKETPLACE ITEMS (500+)
    # ============================================
    print("\n[7/7] Creating 500+ Marketplace Items...")
    
    marketplace_created = 0
    sellers = producers[:200] + logistics[:50]
    
    # Base items
    for name, category, base_price, base_stock in EQUIPMENT_ITEMS:
        for _ in range(random.randint(3, 8)):
            seller = random.choice(sellers)
            variant = random.choice(["", " Pro", " Industrial", " Heavy-Duty", " Compact", " Standard", " Premium", " Plus", " Max"])
            item = models.MarketplaceItem(
                seller_id=seller.id,
                name=f"{name}{variant}".strip(),
                category=category,
                description=f"High-quality {name} from {seller.company_name}. Industry certified, ISO compliant. Immediate availability with global shipping.",
                price=round(base_price * random.uniform(0.75, 1.35), 2),
                stock_quantity=int(base_stock * random.uniform(0.3, 3.0)),
                image_url=f"https://placehold.co/400x300/1e293b/10b981?text={category.replace(' ', '+')}"
            )
            db.add(item)
            marketplace_created += 1
    
    db.commit()
    print(f"   ✓ Created {marketplace_created} marketplace items")
    
    # ============================================
    # SUMMARY
    # ============================================
    total = len(all_participants) + len(all_facilities) + listings_created + trade_orders_created + storage_created + marketplace_created
    
    print("\n" + "=" * 70)
    print("SEEDING COMPLETE!")
    print("=" * 70)
    print(f"""
    📊 DATA SUMMARY:
    ─────────────────────────────────────────
    👥 Participants:        {len(all_participants):,}
       - Producers:         {len(producers):,}
       - Buyers:            {len(buyers):,}
       - Logistics:         {len(logistics):,}
    🏭 Facilities:          {len(all_facilities):,}
    📦 Product Listings:    {listings_created:,}
    📈 Trade Orders:        {trade_orders_created:,}
    🏪 Storage Listings:    {storage_created:,}
    🛒 Marketplace Items:   {marketplace_created:,}
    ─────────────────────────────────────────
    📊 TOTAL ENTRIES:       {total:,}

    🌍 Countries Covered:   {len(COUNTRIES_REGIONS)}

    🔐 LOGIN CREDENTIALS:
    Email: producer_0@energyx.com
    Password: password123
    
    (All accounts use password: password123)
    """)
    
    db.close()


if __name__ == "__main__":
    seed_data()
