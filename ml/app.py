from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the Cost Prediction Model
# Use absolute path relative to this script to ensure loading from 'ml/' directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'cost_prediction_model.pkl')

if os.path.exists(MODEL_PATH):
    try:
        cost_model = joblib.load(MODEL_PATH)
        print(f"SUCCESS: Model loaded from {MODEL_PATH}")
    except Exception as e:
        print(f"CRITICAL ERROR: Failed to load model from {MODEL_PATH}: {e}")
        cost_model = None
else:
    print(f"CRITICAL ERROR: Model file NOT FOUND at {MODEL_PATH}")
    cost_model = None

# STRICT PRIORITY ENCODING (High=0, Low=1, Medium=2)
# Matches LabelEncoder alphabetical order and requirement
PRIORITY_MAP = {
    'High': 0,
    'Low': 1,
    'Medium': 2
}

# RULE-BASED TIMELINE WEIGHTS
PRIORITY_WEIGHTS = {
    'High': 3,
    'Medium': 2,
    'Low': 1
}

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print(f"Received Payload: {data}")

        # Input Validation
        required_fields = ['priority', 'budget', 'hours_spent', 'task_count']
        if not data or not all(k in data for k in required_fields):
             print("Validation Error: Missing fields")
             return jsonify({"error": "Missing required input fields"}), 400
        
        # 1. Extract Inputs
        priority = data.get('priority')
        budget = float(data.get('budget', 0))
        hours_spent = float(data.get('hours_spent', 0))
        task_count = float(data.get('task_count', 0))

        if not priority or priority not in PRIORITY_MAP:
            print(f"Validation Error: Invalid Priority '{priority}'")
            return jsonify({'error': 'Invalid or missing Priority. Must be High, Medium, or Low.'}), 400

        # 2. Encode Priority
        priority_encoded = PRIORITY_MAP[priority]

        # 3. Construct Feature Vector
        # OLD LEGACY VECTOR (9 items) Caused constant outputs.
        # NEW ROBUST VECTOR (4 items): [priority_encoded, budget, hours_spent, task_count]
        # This matches the new RandomForest model trained in train_model.py
        
        feature_names = ['priority_encoded', 'budget', 'hours_spent', 'task_count']
        input_data = pd.DataFrame([{
            'priority_encoded': priority_encoded,
            'budget': budget,
            'hours_spent': hours_spent,
            'task_count': task_count
        }], columns=feature_names) # Ensure columns wrap in a DataFrame for the Pipeline

        # 4. Predict Cost (ML)
        predicted_cost = 0
        if cost_model:
            try:
                prediction = cost_model.predict(input_data)
                predicted_cost = float(prediction[0])
            except Exception as e:
                print(f"ML Model Prediction Error: {e}")
                # Fallback to 0 or handled basic cost if needed, but returning 0 is safer than crash
                predicted_cost = 0.0
        else:
             # Fallback if model is missing to allow functionality (Cost=0)
             print("Warning: Model not loaded, returning 0 cost.")
             predicted_cost = 0.0

        # 5. Estimate Timeline (Rule-Based)
        # Formula: Estimated Days = (Hours Spent * Task Count) / (Priority_Weight * 8)
        p_weight = PRIORITY_WEIGHTS.get(priority, 1)
        estimated_timeline_days = float((hours_spent * task_count) / (p_weight * 8))
        
        # Ensure positive days
        estimated_timeline_days = max(1, round(estimated_timeline_days, 1))
        predicted_cost = max(0, round(predicted_cost, 2))

        return jsonify({
            'predicted_cost': predicted_cost,
            'estimated_timeline_days': estimated_timeline_days,
            'metadata': {
                'priority_encoded': priority_encoded,
                'input_features_used': feature_names
            }
        })

    except Exception as e:
        print(f"Prediction Error: {e}")
        # Always return JSON on error
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
