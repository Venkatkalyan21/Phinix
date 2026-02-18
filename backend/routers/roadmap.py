from fastapi import APIRouter
from pydantic import BaseModel
from agents.ai_helper import ask_gemini

router = APIRouter()

class RoadmapRequest(BaseModel):
    target_role: str
    current_skills: str
    duration_weeks: int = 12
    experience_level: str = "Fresher"

@router.post("/generate")
def generate_roadmap(req: RoadmapRequest):
    prompt = f"""You are an expert learning path designer and career coach.

Create a detailed {req.duration_weeks}-week learning roadmap for:
- Target Role: {req.target_role}
- Current Skills: {req.current_skills}
- Experience Level: {req.experience_level}

Format the roadmap as:
Week 1-2: [Foundation Phase]
- Topics to cover
- Resources (free courses, YouTube, docs)
- Projects to build
- Milestone checkpoint

Week 3-4: [Next Phase]
...and so on for all {req.duration_weeks} weeks.

End with:
- Final Project Idea
- Portfolio Checklist
- Job Application Timeline

Make it realistic, specific, and motivating."""
    result = ask_gemini(prompt)
    return {"roadmap": result}
