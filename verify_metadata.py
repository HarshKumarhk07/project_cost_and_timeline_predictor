import requests
import json
import time

def verify_metadata():
    url = 'http://localhost:5000/api/predict'
    
    # Payload with metadata + ML inputs
    payload = {
        "projectName": "Metadata Test Project",
        "startDate": "2025-01-01",
        "endDate": "2025-06-01",
        "teamMembers": 5,
        
        "hoursSpent": 100,
        "taskCount": 10,
        "budget": 5000,
        "priority": "High"
    }
    
    print(f"Testing Payload: {json.dumps(payload, indent=2)}")
    
    try:
        # Note: Auth is temporarily disabled for this test
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            data = response.json()
            print("SUCCESS: Response Received")
            print(json.dumps(data, indent=2))
            
            # Additional check:
            # We can't easily check MongoDB content from here without a GET endpoint that returns metadata.
            # But success implies the controller processed it without crashing on the schema save.
            print("Verification successful if predictionId is returned.")
        else:
            print(f"FAILED: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    time.sleep(2) # Wait for server
    verify_metadata()
