from fastapi import APIRouter
from pydantic import BaseModel
from agents.pipeline import AgentPipeline

router = APIRouter()

class PipelineRequest(BaseModel):
    resume_text: str
    target_role: str

@router.post("/run")
def run_pipeline(req: PipelineRequest):
    """
    Run the full multi-agent pipeline:
    Resume Agent → Career Agent → Skill Gap Agent → Roadmap Agent → Interview Coach Agent
    """
    pipeline = AgentPipeline(
        resume_text=req.resume_text,
        target_role=req.target_role
    )
    results = pipeline.run_all()
    return {
        "target_role": req.target_role,
        "agents": [
            {"name": "Resume Agent", "icon": "📄", "output": results["resume_agent"]},
            {"name": "Career Intelligence Agent", "icon": "🧭", "output": results["career_agent"]},
            {"name": "Skill Gap Agent", "icon": "🎯", "output": results["skill_gap_agent"]},
            {"name": "Roadmap Planner Agent", "icon": "🗺️", "output": results["roadmap_agent"]},
            {"name": "Interview Coach Agent", "icon": "🎤", "output": results["interview_agent"]},
        ]
    }
