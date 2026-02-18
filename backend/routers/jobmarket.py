from fastapi import APIRouter
from pydantic import BaseModel
from agents.ai_helper import ask_gemini

router = APIRouter()

class JobMarketRequest(BaseModel):
    role: str
    location: str = "India"

@router.post("/insights")
def job_market_insights(req: JobMarketRequest):
    prompt = f"""You are a real-time job market analyst with deep knowledge of the tech industry.

Analyze the current job market for: {req.role} in {req.location}

Provide:
1. Market Demand (High/Medium/Low with reasoning)
2. Top Hiring Companies (10 companies)
3. Average Salary Range (entry/mid/senior in INR/USD)
4. Most In-Demand Skills for this role
5. Emerging Technologies in this domain
6. Remote Work Availability (%)
7. Job Growth Trend (next 2 years)
8. Top Job Portals for this role
9. Interview Difficulty Level
10. Quick Tips to Stand Out

Use current 2024-2025 market data."""
    result = ask_gemini(prompt)
    return {"insights": result}

@router.get("/trending-roles")
def trending_roles():
    roles = [
        {"role": "AI/ML Engineer", "demand": "Very High", "growth": "+45%", "avg_salary": "₹12-25 LPA"},
        {"role": "Full Stack Developer", "demand": "High", "growth": "+30%", "avg_salary": "₹8-20 LPA"},
        {"role": "DevOps Engineer", "demand": "High", "growth": "+35%", "avg_salary": "₹10-22 LPA"},
        {"role": "Data Scientist", "demand": "High", "growth": "+28%", "avg_salary": "₹10-24 LPA"},
        {"role": "Cloud Architect", "demand": "Very High", "growth": "+40%", "avg_salary": "₹15-35 LPA"},
        {"role": "Cybersecurity Analyst", "demand": "High", "growth": "+38%", "avg_salary": "₹8-18 LPA"},
    ]
    return {"trending_roles": roles}
