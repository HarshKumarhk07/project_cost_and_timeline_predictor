import requests
import json
import time

def verify():
    url = 'http://127.0.0.1:5001/predict'
    # Test Case: Hours=100, Tasks=10, Budget=5000, Priority=High
    # Formula: (100 * 10) / (Weight(High=3) * 8) = 1000 / 24 = 41.666...
    # App Logic: round(41.666..., 1) -> 41.7
    
    payload = {
        "hours_spent": 100,
        "task_count": 10,
        "budget": 5000,
        "priority": "High"
    }
    
    print(f"Testing Payload: {payload}")
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code != 200:
            print(f"FAILED: Status Code {response.status_code}")
            print(response.text)
            return

        data = response.json()
        print("Response Data:")
        print(json.dumps(data, indent=2))
        
        timeline = data.get('estimated_timeline_days')
        expected = 41.7
        
        if timeline == expected:
            print(f"SUCCESS: Timeline {timeline} matches expected {expected}.")
        else:
            print(f"FAILURE: Timeline {timeline} does not match expected {expected}.")
            
    except Exception as e:
        print(f"Error connecting to service: {e}")

if __name__ == "__main__":
    # Wait a moment for service to ensure it's up if called immediately after start
    time.sleep(2)
    verify()
