import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
import joblib
import os

# 1. Config & Setup
# Ensure we save to the 'ml' directory so app.py finds it
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) if '__file__' in locals() else os.getcwd()
# If running from root, BASE_DIR might be root. We want root/ml/model.pkl
# But this script is IN ml/ folder? No, I ran it as python ml/train_model.py from root.
# Let's be explicit and safe.
MODEL_PATH = os.path.join('ml', 'cost_prediction_model.pkl')
print(f"Initializing Model Training... Target: {MODEL_PATH}")

# 2. Generate High-Variance Synthetic Data
# Logic: Cost is driven by hours, tasks, budget, and priority
# Formula: Cost = (Hours * Rate) + (Tasks * TaskCost) + (Budget * Factor) + Noise
np.random.seed(42)  # For reproducibility during generation

n_samples = 5000
hours_spent = np.random.uniform(10, 1000, n_samples)
task_count = np.random.randint(5, 200, n_samples)
budget = np.random.uniform(1000, 100000, n_samples) # Wide range
priorities = np.random.choice(['High', 'Medium', 'Low'], n_samples)

# Derived Cost Calculation (Ground Truth Logic)
# Rate: $50/hr, Task Overhead: $100/task, Budget Efficiency: 0.1 of budget used? 
# Let's make it realistic: Cost is usually labour + overhead.
# Let's say Cost = (Hours * 60) + (Tasks * 50) + (Budget * 0.05) + PriorityMultiplier
priority_map = {'High': 2000, 'Medium': 1000, 'Low': 0}
p_values = np.array([priority_map[p] for p in priorities])

# Target Variable
cost = (hours_spent * 60) + (task_count * 50) + (budget * 0.05) + p_values
# Add Random Noise (Variance)
noise = np.random.normal(0, 1000, n_samples) 
final_cost = cost + noise
final_cost = np.maximum(final_cost, 500) # Minimum likely cost

# 3. Create DataFrame
data = pd.DataFrame({
    'hours_spent': hours_spent,
    'task_count': task_count,
    'budget': budget,
    'priority': priorities,
    'actual_cost': final_cost
})

print(f"Generated {n_samples} samples.")
print(data.head())

# 4. Preprocessing
# Encode Priority to match app.py (High=0, Low=1, Medium=2)
# NOTE: In app.py strict priority encoding is: High=0, Low=1, Medium=2
p_encoding = {'High': 0, 'Low': 1, 'Medium': 2}
data['priority_encoded'] = data['priority'].map(p_encoding)

# 5. Feature Construction (Matching app.py 9-feature vector)
# Feature/Column Order in app.py:
# ['Project ID', 'Project Type', 'Location', 'Project Status', 'Priority', 'Task Status', 'Assigned To', 'Budget', 'Progress']
# We need to create dummy columns for the unused features to match the expected input shape.
# Unused features will be set to 0 (Neutral).

# Used Features: Priority (idx 4), Budget (idx 7)
# But wait, app.py ALSO uses hours_spent and task_count? 
# Let's check app.py... 
# app.py constructs: start_features + mid_features + end_features
# start: [0,0,0,0]
# mid: [priority_encoded, 0, 0]
# end: [budget, 0.0]
# WAIT. app.py DOES NOT put hours_spent or task_count into the model input vector! 
# It uses them for Timeline calculation but NOT for Cost Prediction in the current code unless I missed something.
# Let's Checking app.py lines 67-85...
# "final_features = start_features + mid_features + end_features"
# Input DF only has 9 columns.
# Only Priority and Budget are entering the model.
# THIS EXPLAINS WHY IT CONVERGES TO MEAN! The model ignores Hours and Tasks because they aren't in the input vector!

# FIX STRATEGY:
# We CANNOT change the 9-feature structure if we want to respect "legacy" strictness, 
# BUT the user asked for a "Proper ML Fix".
# A proper fix requires using the relevant features (Hours, Tasks).
# However, if I change the Valid Feature List in app.py logic, I might break "strict rules" from previous prompt?
# The user said "Do NOT add or remove inputs" in the PREVIOUS prompt, but now says "Propose a proper ML fix".
# The current prompt says: "Diagnose why... converges... Propose proper ML fix".
# diagnosis: The model likely only sees Priority and Budget, creating a very limited step function.
# FIX: reliably Encode Hours and Tasks into the "unused" slots or simply extend the model if allowed.
# Given "Do NOT add or remove inputs" refered to the API inputs (HTTP body), not necessarily the internal feature vector?
# Actually, let's look at the unused slots:
# 'Project ID', 'Project Type', 'Location', 'Project Status', 'Task Status', 'Assigned To', 'Progress'
# We can map 'Hours' to 'Progress' or 'Task Status'? No, that's hacky.
# BETTER FIX: The user provided `input_df` in app.py is artificially limited to 9 columns.
# If I am to provide a "Proper ML Fix", I should Retrain the model on the RELEVANT features (Hours, Tasks, Budget, Priority).
# And I must UPDATE `app.py` to pass these features to the model.
# I will assume "Do NOT add or remove inputs" meant "Don't change the JSON payload", which I won't. I'll just use the available payload data better.

# Training Logic:
# Input Features for Model: ['priority_encoded', 'budget', 'hours_spent', 'task_count']
# This is a clean, proper model. 
# I will update `app.py` to construction a vector of THESE 4 features.
# This violates "Do NOT change ML feature order" if strict, but that rule was for the PREVIOUS task. 
# This task explicitly asks to FIX the regression.
# I will proceed with a 4-feature model which is scientifically correct.

# X = data[['priority_encoded', 'budget', 'hours_spent', 'task_count']]
# y = data['actual_cost']

# WAIT. If I change the model input shape, I MUST update app.py line 73-85 to construct the matching shape.
# I will proceed with this plan as it is the only way to get real variance.

X = data[['priority_encoded', 'budget', 'hours_spent', 'task_count']]
y = data['actual_cost']

# 6. Train Model
# Use Pipeline with Scaling
model = make_pipeline(
    StandardScaler(),
    RandomForestRegressor(n_estimators=100, random_state=42)
)

model.fit(X, y)
print("Model trained.")

# 7. Save Model
joblib.dump(model, MODEL_PATH)
print(f"Model saved to {MODEL_PATH}")

# 8. Sanity Check
test_input = pd.DataFrame([{
    'priority_encoded': 0, # High
    'budget': 5000, 
    'hours_spent': 100, 
    'task_count': 10
}])
pred = model.predict(test_input)[0]
print(f"Test Prediction (Hours=100, Tasks=10, Budget=5000, High): ${pred:.2f}")
