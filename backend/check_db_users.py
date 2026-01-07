from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./marketplace_v4.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

print(f"Connecting to: {DATABASE_URL}")
try:
    result = db.execute(text("SELECT * FROM participants WHERE email = 'lt_green@example.com'"))
    user = result.fetchone()
    if user:
        print(f"User FOUND: {user}")
    else:
        print("User lt_green@example.com NOT FOUND")
        
    # List all emails to be sure
    print("\nAll emails in DB:")
    all_users = db.execute(text("SELECT email FROM participants")).fetchall()
    for u in all_users:
        print(u)
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
