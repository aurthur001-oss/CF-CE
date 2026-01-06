from passlib.context import CryptContext

try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hash = pwd_context.hash("password123")
    print(f"Bcrypt hash success: {hash}")
except Exception as e:
    print(f"Bcrypt failed: {e}")

try:
    pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
    hash = pwd_context.hash("password123")
    print(f"PBKDF2 hash success: {hash}")
except Exception as e:
    print(f"PBKDF2 failed: {e}")
