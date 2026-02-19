from fastapi import APIRouter
from pydantic import BaseModel
from agents.ai_helper import ask_gemini
import json, re

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

@router.post("/structured")
def job_market_structured(req: JobMarketRequest):
    """Returns structured JSON data for chart rendering."""
    prompt = f"""You are a job market data analyst. Return ONLY valid JSON (no markdown, no explanation).

Analyze the job market for: {req.role} in {req.location}

Return this exact JSON structure:
{{
  "demand_level": "Very High",
  "demand_score": 85,
  "top_skills": [
    {{"skill": "Python", "demand_pct": 92}},
    {{"skill": "TensorFlow", "demand_pct": 78}},
    {{"skill": "SQL", "demand_pct": 75}},
    {{"skill": "Docker", "demand_pct": 65}},
    {{"skill": "AWS", "demand_pct": 60}},
    {{"skill": "Spark", "demand_pct": 55}}
  ],
  "salary_ranges": {{
    "entry": {{"min": 4, "max": 8, "unit": "LPA"}},
    "mid": {{"min": 10, "max": 18, "unit": "LPA"}},
    "senior": {{"min": 20, "max": 40, "unit": "LPA"}}
  }},
  "top_companies": ["Google", "Microsoft", "Amazon", "Flipkart", "Swiggy"],
  "remote_pct": 45,
  "growth_trend": "+32%",
  "job_portals": ["LinkedIn", "Naukri", "AngelList", "Instahyre"],
  "interview_difficulty": "Medium-Hard",
  "openings_estimate": "12,000+"
}}

Fill with real data for {req.role} in {req.location}. Return ONLY the JSON object."""
    
    raw = ask_gemini(prompt)
    # Try to parse JSON from response
    try:
        # Strip markdown code blocks if present
        clean = re.sub(r'```json|```', '', raw).strip()
        data = json.loads(clean)
        return {"structured": data, "role": req.role, "location": req.location}
    except Exception:
        # Fallback structured data
        return {
            "structured": {
                "demand_level": "High",
                "demand_score": 75,
                "top_skills": [
                    {"skill": "Python", "demand_pct": 88},
                    {"skill": "Machine Learning", "demand_pct": 82},
                    {"skill": "SQL", "demand_pct": 75},
                    {"skill": "TensorFlow", "demand_pct": 70},
                    {"skill": "AWS", "demand_pct": 65},
                    {"skill": "Docker", "demand_pct": 58}
                ],
                "salary_ranges": {
                    "entry": {"min": 5, "max": 9, "unit": "LPA"},
                    "mid": {"min": 12, "max": 20, "unit": "LPA"},
                    "senior": {"min": 22, "max": 45, "unit": "LPA"}
                },
                "top_companies": ["TCS", "Infosys", "Google", "Amazon", "Flipkart"],
                "remote_pct": 40,
                "growth_trend": "+28%",
                "job_portals": ["LinkedIn", "Naukri", "Indeed"],
                "interview_difficulty": "Medium",
                "openings_estimate": "8,000+"
            },
            "role": req.role,
            "location": req.location,
            "raw_ai": raw
        }

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
