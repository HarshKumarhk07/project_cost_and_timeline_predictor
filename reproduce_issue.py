import requests
import json
import time

BASE_URL = 'http://localhost:5000'

def reproduce():
    # 1. Register/Login
    email = f"reproduce.test.{int(time.time())}@gmail.com"
    password = "Password@123"
    
    print(f"Registering user: {email}")
    reg_res = requests.post(f"{BASE_URL}/auth/signup", json={
        "name": "tester",
        "email": email,
        "password": password
    })
    
    print(f"Registration Status: {reg_res.status_code}")
    print(f"Registration Response: {reg_res.text}")

    token = None
    if reg_res.status_code in [200, 201]:
        token = reg_res.json().get('token')
        print("Registration success, token obtained.")
    else:
        # Try login
        print("Register failed (maybe exists), logging in...")
        login_res = requests.post(f"{BASE_URL}/auth/login", json={
            "email": email,
            "password": password
        })
        if login_res.status_code == 200:
            token = login_res.json().get('token')
            print("Login success, token obtained.")
        else:
            print(f"Login failed: {login_res.text}")
            return
 
    if not token:
        print("Could not get token.")
        return

    # 2. Make Prediction Request
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    payload = {
        "projectName": "Reproduction Project",
        "startDate": "2025-01-01",
        "endDate": "2025-06-01",
        "teamMembers": 5,
        "hoursSpent": 100,
        "taskCount": 10,
        "budget": 5000,
        "priority": "High"
    }
    
    print("\nSending Authenticated Prediction Request A (Hours=100)...")
    try:
        res = requests.post(f"{BASE_URL}/api/predict", json=payload, headers=headers)
        print(f"Status Code A: {res.status_code}")
        print("Response A:", res.text)
    except Exception as e:
        print(f"Request A failed: {e}")

    # 3. Second Request (Variance Check)
    payload_b = payload.copy()
    payload_b["hoursSpent"] = 500 # Increase hours significantly
    payload_b["projectName"] = "Variance Test Project"

    print("\nSending Authenticated Prediction Request B (Hours=500)...")
    try:
        res_b = requests.post(f"{BASE_URL}/api/predict", json=payload_b, headers=headers)
        print(f"Status Code B: {res_b.status_code}")
        print("Response B:", res_b.text)
    except Exception as e:
        print(f"Request B failed: {e}")

if __name__ == "__main__":
    reproduce()
