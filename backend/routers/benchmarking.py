from fastapi import APIRouter
from pydantic import BaseModel
from agents.ai_helper import ask_gemini

router = APIRouter()

class BenchmarkRequest(BaseModel):
    role: str
    skills: str
    experience_years: float
    education: str
    projects_count: int
    certifications: int
    skills_count: int

@router.post("/compare")
def peer_benchmark(req: BenchmarkRequest):
    # Simulated peer cohort data
    cohort_averages = {
        "skills_count": 8,
        "experience_years": 1.5,
        "projects_count": 4,
        "certifications": 1,
    }
    
    your_scores = {
        "skills_count": req.skills_count,
        "experience_years": req.experience_years,
        "projects_count": req.projects_count,
        "certifications": req.certifications,
    }
    
    percentiles = {}
    for key in cohort_averages:
        ratio = your_scores[key] / max(cohort_averages[key], 0.1)
        percentile = min(int(ratio * 50), 99)
        percentiles[key] = percentile
    
    overall_percentile = int(sum(percentiles.values()) / len(percentiles))
    
    prompt = f"""You are a career benchmarking expert.

A student targeting {req.role} has these stats:
- Skills: {req.skills}
- Experience: {req.experience_years} years
- Projects: {req.projects_count}
- Certifications: {req.certifications}
- Education: {req.education}

They are in the {overall_percentile}th percentile among peers.

Provide:
1. Competitive Analysis (how they compare to peers)
2. Top 3 areas where they lead peers
3. Top 3 areas where peers outperform them
4. Specific actions to reach 80th percentile
5. What top 10% candidates in this role typically have

Keep it motivating and specific."""
    
    ai_insights = ask_gemini(prompt)
    
    return {
        "overall_percentile": overall_percentile,
        "dimension_percentiles": percentiles,
        "cohort_averages": cohort_averages,
        "your_stats": your_scores,
        "ai_insights": ai_insights
    }
