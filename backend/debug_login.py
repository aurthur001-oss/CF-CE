import requests

URL = "http://localhost:8000/token"

credentials = {
    "username": "lt_green@example.com",
    "password": "password123"
}

print("--- Testing application/x-www-form-urlencoded ---")
try:
    response = requests.post(URL, data=credentials) # requests sends form-urlencoded by default for dict data
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")

print("\n--- Testing multipart/form-data ---")
try:
    # requests sends multipart if file is present, or we can force it?
    # Actually requests 'data' param sends urlencoded. 'files' sends multipart.
    # To simulate what axios does with FormData, we might need to send it as files or prepare it.
    # But usually axios FormData -> multipart/form-data.
    
    # Let's try to mimic multipart
    from requests_toolbelt.multipart.encoder import MultipartEncoder
    m = MultipartEncoder(fields=credentials)
    headers = {'Content-Type': m.content_type}
    response = requests.post(URL, data=m, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
