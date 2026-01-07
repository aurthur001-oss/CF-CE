from sqlalchemy.orm import Session
from database import SessionLocal
import models, auth

def seed_admin():
    db = SessionLocal()
    
    email = "admin@celestialfuels.com"
    password = "adminpassword123"
    
    # Check if admin exists
    existing = db.query(models.Participant).filter(models.Participant.email == email).first()
    if existing:
        print(f"Admin user {email} already exists.")
        db.close()
        return

    print("Creating Super Admin...")
    admin_user = models.Participant(
        name="Super Admin",
        email=email,
        hashed_password=auth.get_password_hash(password),
        role="ADMIN", # Matches schemas.ParticipantRole.ADMIN
        company_name="Celestial Fuels HQ",
        industry_type="Platform Administration",
        region="Global",
        country="USA",
        is_active=True,
        is_approved=True,
        kyc_verified=True,
        terms_accepted=True,
        wallet_balance=0.0
    )
    
    db.add(admin_user)
    db.commit()
    print(f"Successfully created admin user: {email} / {password}")
    db.close()

if __name__ == "__main__":
    seed_admin()
