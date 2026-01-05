import httpx
import json

def test_signup():
    url = "http://127.0.0.1:8000/users/"
    payload = {
        "name": "Test User",
        "email": "testuser_unique@example.com",
        "password": "password123",
        "role": "BUYER",
        "company_name": "Test Corp",
        "industry_type": "Energy",
        "country": "India",
        "region": "Karnataka",
        "registration_number": "123456",
        "company_website": "https://test.com",
        "contact_number": "9876543210",
        "terms_accepted": True
    }
    
    try:
        response = httpx.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.json()}")
        
        if response.status_code == 200:
            print("Signup successful! Now testing login with same credentials...")
            login_url = "http://127.0.0.1:8000/token"
            login_payload = {"username": "testuser_unique@example.com", "password": "password123"}
            login_res = httpx.post(login_url, data=login_payload)
            print(f"Login Status Code: {login_res.status_code}")
            print(f"Login Response: {login_res.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_signup()
