from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os
import uvicorn

app = FastAPI()

# Allow frontend/backend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # later you can restrict this
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model & encoder
model = joblib.load("crop_model.pkl")
encoder = joblib.load("crop_label_encoder.pkl")

# Request schema
class CropInput(BaseModel):
    nitrogen: float
    phosphorous: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

@app.post("/predict")
def predict_crop(data: CropInput):
    features = np.array([[
        data.nitrogen,
        data.phosphorous,
        data.potassium,
        data.temperature,
        data.humidity,
        data.ph,
        data.rainfall
    ]])

    pred = model.predict(features)
    crop = encoder.inverse_transform(pred)[0]

    probs = model.predict_proba(features)[0]
    top_idx = np.argsort(probs)[::-1][:3]
    top_crops = encoder.inverse_transform(top_idx)

    return {
        "recommended_crop": crop,
        "top_3_crops": top_crops.tolist()
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port)


# python -m pip install -r requirements.txt
#  python -m uvicorn app:app --reload --port 8000