
import pandas as pd
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import em_models
from datetime import datetime

def import_data():
    # Create tables
    em_models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    file_path = "EM_1.xlsx"

    try:
        xl = pd.ExcelFile(file_path)
        
        # Helper to read sheet and replace NaN with None
        def read_sheet(sheet_name):
            if sheet_name in xl.sheet_names:
                df = xl.parse(sheet_name)
                return df.where(pd.notnull(df), None)
            return pd.DataFrame()

        print("Importing Dimensions...")
        
        # 1. Fuel Master
        df_fuel = read_sheet('fuel_master')
        for _, row in df_fuel.iterrows():
            if not db.query(em_models.EmFuel).filter_by(fuel_id=row['fuel_id (PK)']).first():
                db.add(em_models.EmFuel(
                    fuel_id=row['fuel_id (PK)'],
                    fuel_name=row['fuel_name'],
                    unit=row['unit'],
                    color_applicable=row['color_applicable']
                ))
        
        # 2. Region Master
        df_region = read_sheet('region_master')
        for _, row in df_region.iterrows():
             if not db.query(em_models.EmRegion).filter_by(region_id=row['region_id (PK)']).first():
                db.add(em_models.EmRegion(
                    region_id=row['region_id (PK)'],
                    country=row['country'],
                    state=row['state'],
                    market_zone=row['market_zone']
                ))

        # 3. User Master
        df_user = read_sheet('user_master')
        for _, row in df_user.iterrows():
            if not db.query(em_models.EmUserMaster).filter_by(user_id=row['user_id (PK)']).first():
                db.add(em_models.EmUserMaster(
                    user_id=row['user_id (PK)'],
                    user_role=row['user_role'],
                    company_name=row['company_name'],
                    industry=row['industry']
                ))
        
        db.commit()
        print("Dimensions Imported.")

        # 4. Market Prices
        print("Importing Market Prices...")
        df_price = read_sheet('market_price')
        for _, row in df_price.iterrows():
            if not db.query(em_models.EmMarketPrice).filter_by(price_id=row['price_id (PK)']).first():
                ts = row['timestamp']
                if isinstance(ts, str):
                    ts = datetime.strptime(ts, '%Y-%m-%d')
                
                db.add(em_models.EmMarketPrice(
                    price_id=row['price_id (PK)'],
                    fuel_id=row['fuel_id (FK)'],
                    region_id=row['region_id (FK)'],
                    price_value=row['price_value'],
                    currency=row['currency'],
                    price_type=row['price_type'],
                    timestamp=ts
                ))
        
        # 5. Producer Profile
        print("Importing Profiles...")
        df_producer = read_sheet('producer')
        for _, row in df_producer.iterrows():
            if not db.query(em_models.EmProducer).filter_by(producer_id=row['producer_id (PK)']).first():
                db.add(em_models.EmProducer(
                    producer_id=row['producer_id (PK)'],
                    user_id=row['user_id (FK)'],
                    ownership_type=row['ownership_type'],
                    location_region_id=row['location_region_id (FK)'],
                    commissioned_year=row['commissioned_year']
                ))

        # 6. Buyer Profile
        df_buyer = read_sheet('buyer_profile')
        for _, row in df_buyer.iterrows():
            if not db.query(em_models.EmBuyerProfile).filter_by(buyer_id=row['buyer_id (PK)']).first():
                db.add(em_models.EmBuyerProfile(
                    buyer_id=row['buyer_id (PK)'],
                    user_id=row['user_id (FK)'],
                    industry=row['industry'],
                    price_sensitivity=row['price_sensitivity']
                ))

         # 7. Logistics Partner
        df_logistics = read_sheet('logistics_partner')
        for _, row in df_logistics.iterrows():
             if not db.query(em_models.EmLogisticsPartner).filter_by(logistics_id=row['logistics_id (PK)']).first():
                db.add(em_models.EmLogisticsPartner(
                    logistics_id=row['logistics_id (PK)'],
                    user_id=row['user_id (FK)'],
                    transport_mode=row['transport_mode']
                ))

        db.commit()

        # 8. Contracts (Example of Operation table)
        print("Importing Contracts...")
        df_contract = read_sheet('contract')
        for _, row in df_contract.iterrows():
            if not db.query(em_models.EmContract).filter_by(contract_id=row['contract_id (PK)']).first():
                start = row['start_date'] if isinstance(row['start_date'], datetime) else datetime.strptime(str(row['start_date']), '%Y-%m-%d')
                end = row['end_date'] if isinstance(row['end_date'], datetime) else datetime.strptime(str(row['end_date']), '%Y-%m-%d')
                
                db.add(em_models.EmContract(
                    contract_id=row['contract_id (PK)'],
                    buyer_id=row['buyer_id (FK)'],
                    producer_id=row['producer_id (FK)'],
                    fuel_id=row['fuel_id (FK)'],
                    agreed_price=row['agreed_price'],
                    volume=row['volume'],
                    start_date=start,
                    end_date=end
                ))

        db.commit()
        print("Import Successful!")

    except Exception as e:
        print(f"Error importing data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import_data()
