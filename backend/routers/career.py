from fastapi import APIRouter
from pydantic import BaseModel
from agents.ai_helper import ask_gemini

router = APIRouter()

class CareerRequest(BaseModel):
    current_role: str
    skills: str
    experience_years: int
    interests: str
    target_company_type: str = "Product Startup"

@router.post("/guidance")
def career_guidance(req: CareerRequest):
    prompt = f"""You are an expert career counselor and industry analyst.

Student Profile:
- Current Role/Background: {req.current_role}
- Skills: {req.skills}
- Years of Experience: {req.experience_years}
- Interests: {req.interests}
- Target Company Type: {req.target_company_type}

Provide comprehensive career guidance including:
1. Top 3 Recommended Career Paths (with reasoning)
2. Short-term Goals (next 6 months)
3. Long-term Goals (2-3 years)
4. Key Skills to Develop
5. Industry Trends to Watch
6. Salary Expectations (entry/mid/senior)
7. Networking Strategy

Be specific, actionable, and encouraging."""
    result = ask_gemini(prompt)
    return {"guidance": result}
