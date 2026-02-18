from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np

router = APIRouter()

class GrowthRequest(BaseModel):
    current_role: str
    skills_count: int
    experience_years: float
    education_level: str  # "BTech", "MTech", "MBA", "PhD", "Diploma"
    certifications: int
    projects_count: int
    github_active: bool
    target_role: str

def simple_growth_model(features: list) -> dict:
    """Simple ANN-like prediction using weighted scoring"""
    weights = [0.15, 0.20, 0.25, 0.10, 0.10, 0.10, 0.10]
    edu_map = {"Diploma": 0.5, "BTech": 0.7, "MTech": 0.85, "MBA": 0.8, "PhD": 1.0}
    
    edu_score = edu_map.get(features[3], 0.7)
    
    normalized = [
        min(features[0] / 20, 1.0),   # skills_count / 20
        min(features[1] / 10, 1.0),   # experience / 10
        edu_score,
        min(features[4] / 5, 1.0),    # certifications / 5
        min(features[5] / 10, 1.0),   # projects / 10
        1.0 if features[6] else 0.5,  # github active
        0.7,                           # baseline
    ]
    
    score = sum(w * v for w, v in zip(weights, normalized)) * 100
    score = min(max(score, 20), 95)
    
    salary_base = 4 + (features[1] * 1.5) + (features[0] * 0.3) + (features[4] * 0.5)
    salary_growth = salary_base * (1 + score / 200)
    
    return {
        "growth_score": round(score, 1),
        "current_salary_estimate": f"₹{round(salary_base, 1)} LPA",
        "projected_salary_1yr": f"₹{round(salary_growth * 1.15, 1)} LPA",
        "projected_salary_3yr": f"₹{round(salary_growth * 1.45, 1)} LPA",
        "promotion_probability": f"{round(score * 0.8, 1)}%",
        "readiness_level": "High" if score > 70 else "Medium" if score > 45 else "Low"
    }

@router.post("/predict")
def predict_growth(req: GrowthRequest):
    features = [
        req.skills_count,
        req.experience_years,
        req.education_level,
        req.certifications,
        req.projects_count,
        req.github_active,
        0
    ]
    prediction = simple_growth_model(features)
    
    tips = []
    if req.certifications < 2:
        tips.append("Get 1-2 industry certifications (AWS, Google Cloud, etc.) to boost salary by 15-20%")
    if req.skills_count < 10:
        tips.append(f"Add {10 - req.skills_count} more in-demand skills to your profile")
    if not req.github_active:
        tips.append("Maintain an active GitHub profile with regular commits")
    if req.projects_count < 5:
        tips.append("Build more portfolio projects to demonstrate practical skills")
    
    return {
        "prediction": prediction,
        "growth_tips": tips,
        "target_role": req.target_role
    }
