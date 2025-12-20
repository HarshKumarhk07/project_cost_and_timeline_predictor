import pickle
import numpy as np

# Load trained cost model
with open("cost_prediction_model.pkl", "rb") as f:
    cost_model = pickle.load(f)

def predict_cost(features):
    """
    features: list of numerical values in same order used during training
    returns: predicted project cost
    """
    X = np.array([features])
    prediction = cost_model.predict(X)[0]
    return round(float(prediction), 2)
