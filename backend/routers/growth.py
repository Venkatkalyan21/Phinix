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
    market_demand_score: int = 70  # 0-100, user-set or auto

def advanced_growth_model(req: GrowthRequest) -> dict:
    """Enhanced ANN-like model with market demand integration."""
    edu_map = {"Diploma": 0.5, "BTech": 0.7, "MTech": 0.85, "MBA": 0.8, "PhD": 1.0}
    edu_score = edu_map.get(req.education_level, 0.7)

    # Normalized feature vector
    features = np.array([
        min(req.skills_count / 20, 1.0),
        min(req.experience_years / 10, 1.0),
        edu_score,
        min(req.certifications / 5, 1.0),
        min(req.projects_count / 10, 1.0),
        1.0 if req.github_active else 0.4,
        req.market_demand_score / 100,
    ])

    # Layer 1 weights (simulated ANN)
    w1 = np.array([0.18, 0.22, 0.15, 0.12, 0.13, 0.10, 0.10])
    score = float(np.dot(features, w1)) * 100
    score = min(max(score, 20), 97)

    # Salary calculation
    base = 3.5 + (req.experience_years * 1.8) + (req.skills_count * 0.35) + (req.certifications * 0.6)
    demand_multiplier = 1 + (req.market_demand_score / 500)
    current = base * demand_multiplier

    # 5-year trajectory
    trajectory = []
    for yr in range(6):
        growth_rate = 0.12 + (score / 1000)
        salary = current * ((1 + growth_rate) ** yr)
        trajectory.append({"year": f"Year {yr}", "salary": round(salary, 1)})

    # Risk level
    risk = "Low" if score > 70 else "Medium" if score > 45 else "High"

    return {
        "growth_score": round(score / 10, 1),  # 0-10 scale
        "growth_score_100": round(score, 1),
        "current_salary_estimate": f"₹{round(current, 1)} LPA",
        "projected_salary_1yr": f"₹{round(current * 1.15, 1)} LPA",
        "projected_salary_3yr": f"₹{round(current * 1.48, 1)} LPA",
        "projected_salary_5yr": f"₹{round(current * 1.85, 1)} LPA",
        "promotion_probability": f"{round(score * 0.82, 1)}%",
        "readiness_level": "High" if score > 70 else "Medium" if score > 45 else "Low",
        "risk_level": risk,
        "salary_trajectory": trajectory,
    }

@router.post("/predict")
def predict_growth(req: GrowthRequest):
    prediction = advanced_growth_model(req)

    tips = []
    if req.certifications < 2:
        tips.append("Get 1-2 industry certifications (AWS, Google Cloud, etc.) — boosts salary by 15-20%")
    if req.skills_count < 10:
        tips.append(f"Add {10 - req.skills_count} more in-demand skills to your profile")
    if not req.github_active:
        tips.append("Maintain an active GitHub profile with regular commits (3-5/week)")
    if req.projects_count < 5:
        tips.append("Build more portfolio projects — aim for 5+ with live demos")
    if req.market_demand_score < 60:
        tips.append("Consider pivoting to higher-demand adjacent roles for better growth")
    if req.experience_years < 2:
        tips.append("Focus on internships and freelance projects to build real-world experience")

    return {
        "prediction": prediction,
        "growth_tips": tips,
        "target_role": req.target_role,
        "market_demand_score": req.market_demand_score,
    }
