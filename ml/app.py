import os
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILENAME = 'cost_prediction_model.pkl'
MODEL_PATH = os.path.join(BASE_DIR, MODEL_FILENAME)

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# --- MODEL LOADING ---
cost_model = None
try:
    if os.path.exists(MODEL_PATH):
        cost_model = joblib.load(MODEL_PATH)
        print(f"SUCCESS: Model loaded (Path: {MODEL_PATH})")
    else:
        print(f"ERROR: Model file not found at {MODEL_PATH}")
except Exception as e:
    print(f"CRITICAL ERROR: Failed to load model: {e}")

# --- TIMELINE LOGIC ---
PRIORITY_MAP = {'High': 0, 'Low': 1, 'Medium': 2}
PRIORITY_WEIGHTS = {'High': 3, 'Medium': 2, 'Low': 1}

# --- ROUTES ---

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for Render/Deployment monitoring."""
    return jsonify({
        "status": "healthy",
        "model_loaded": cost_model is not None,
        "service": "ml-prediction-service"
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Empty payload"}), 400

        # 1. Validation
        required_fields = ['priority', 'budget', 'hours_spent', 'task_count']
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({"error": f"Missing fields: {missing}"}), 400

        priority = data.get('priority')
        if priority not in PRIORITY_MAP:
            return jsonify({"error": f"Invalid priority '{priority}'. Must be High, Medium, or Low"}), 400

        # 2. Prepare Feature Vector
        # Ensure fields match training schema EXACTLY
        # Features: [priority_encoded, budget, hours_spent, task_count]
        features = pd.DataFrame([{
            'priority_encoded': PRIORITY_MAP[priority],
            'budget': float(data['budget']),
            'hours_spent': float(data['hours_spent']),
            'task_count': float(data['task_count'])
        }])

        # 3. Model Prediction (Cost)
        predicted_cost = 0.0
        if cost_model:
            try:
                predicted_cost = float(cost_model.predict(features)[0])
                predicted_cost = max(0, round(predicted_cost, 2))
            except Exception as e:
                print(f"Prediction logic error: {e}")
                # Don't crash, return 0 with error log
                predicted_cost = 0.0
        else:
            print("Warning: Prediction requested but model is not loaded.")

        # 4. Rule-based Prediction (Timeline)
        # Formula: (Hours * Tasks) / (Weight * 8)
        weight = PRIORITY_WEIGHTS.get(priority, 1)
        raw_days = (float(data['hours_spent']) * float(data['task_count'])) / (weight * 8)
        estimated_days = max(1, round(raw_days, 1))

        return jsonify({
            "predicted_cost": predicted_cost,
            "estimated_timeline_days": estimated_days
        })

    except Exception as e:
        print(f"Server Error during prediction: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    # Render provides PORT env var. default to 5001 for local dev.
    port = int(os.environ.get('PORT', 5001))
    # 0.0.0.0 is crucial for Docker/Render
    app.run(host='0.0.0.0', port=port)
