from fastapi import APIRouter
from pydantic import BaseModel
from agents.ai_helper import ask_gemini

router = APIRouter()

class RoadmapRequest(BaseModel):
    target_role: str
    current_skills: str = ""
    duration_weeks: int = 12
    experience_level: str = "Fresher"
    daily_hours: float = 2.0
    timeline: str = "3 months"

@router.post("/generate")
def generate_roadmap(req: RoadmapRequest):
    total_hours = int(req.daily_hours * 7 * req.duration_weeks)
    prompt = f"""You are an expert learning roadmap planner and career coach.

Create a personalized {req.duration_weeks}-week learning roadmap for:
- Target Role: {req.target_role}
- Current Skills: {req.current_skills or "None specified"}
- Experience Level: {req.experience_level}
- Daily Study Time: {req.daily_hours} hours/day
- Timeline: {req.timeline}
- Total Study Hours Available: ~{total_hours} hours

Generate a detailed week-by-week plan. For EACH week/phase include:
📅 Week X-Y: [Phase Name]
🎯 Topics: [specific topics to learn]
🛠️ Mini Project: [hands-on project idea]
📚 Resources: [free resource name + link type]
⏱️ Hours: [estimated hours for this phase]

Make it realistic for {req.daily_hours} hours/day.
Start from basics if Fresher, skip basics if Senior.
End with a capstone portfolio project in the final 2 weeks.
Be specific with technology names, not generic."""
    result = ask_gemini(prompt)
    return {"roadmap": result, "total_hours": total_hours, "daily_hours": req.daily_hours}
