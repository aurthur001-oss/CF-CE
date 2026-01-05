from fastapi.testclient import TestClient
from main import app
import sys

client = TestClient(app)

try:
    response = client.post("/token", data={"username": "buyer@example.com", "password": "password123"})
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.json()}")
except Exception as e:
    import traceback
    print("An error occurred:")
    traceback.print_exc()
