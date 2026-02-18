from fastapi import APIRouter
from pydantic import BaseModel
from agents.ai_helper import ask_gemini

router = APIRouter()

class SkillGapRequest(BaseModel):
    current_skills: str
    target_role: str
    experience_level: str = "Fresher"

@router.post("/analyze")
def analyze_skill_gap(req: SkillGapRequest):
    prompt = f"""You are a technical skills assessment expert.

Candidate Profile:
- Current Skills: {req.current_skills}
- Target Role: {req.target_role}
- Experience Level: {req.experience_level}

Perform a detailed skill gap analysis:
1. Skills You Already Have (matched to role requirements) ✅
2. Critical Missing Skills (must learn immediately) 🔴
3. Nice-to-Have Skills (learn after core skills) 🟡
4. Skill Proficiency Assessment (rate current skills 1-10)
5. Priority Learning Order (numbered list)
6. Estimated Time to Bridge the Gap
7. Free Resources for Each Missing Skill

Be precise and technical."""
    result = ask_gemini(prompt)
    return {"analysis": result}
