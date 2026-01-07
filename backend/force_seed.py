from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import models, auth

DATABASE_URL = "sqlite:///./marketplace_v4.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

print("FORCING CLEAR AND SEED...")
# Clear
try:
    db.query(models.Participant).delete()
    db.commit()
    print("Deleted all participants.")
except Exception as e:
    print(f"Delete failed: {e}")

# Add L&T
try:
    hashed = auth.get_password_hash("password123")
    user = models.Participant(
        name="L&T Green Energy",
        email="lt_green@example.com",
        hashed_password=hashed,
        role="PRODUCER",
        company_name="L&T",
        region="Gujarat",
        country="India",
        kyc_verified=True,
        terms_accepted=True
    )
    db.add(user)
    db.commit()
    print(f"Added user: lt_green@example.com")
except Exception as e:
    print(f"Add failed: {e}")
finally:
    db.close()
