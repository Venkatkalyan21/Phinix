from fastapi import APIRouter
from pydantic import BaseModel
from agents.ai_helper import ask_gemini

router = APIRouter()

# Role-specific cohort averages for realistic benchmarking
COHORT_DATA = {
    "default": {"skills_count": 8, "experience_years": 1.5, "projects_count": 4, "certifications": 1},
    "ml engineer": {"skills_count": 12, "experience_years": 2.0, "projects_count": 5, "certifications": 2},
    "data scientist": {"skills_count": 11, "experience_years": 1.8, "projects_count": 5, "certifications": 2},
    "full stack developer": {"skills_count": 10, "experience_years": 1.5, "projects_count": 6, "certifications": 1},
    "devops engineer": {"skills_count": 9, "experience_years": 2.0, "projects_count": 4, "certifications": 3},
    "cloud architect": {"skills_count": 10, "experience_years": 3.0, "projects_count": 4, "certifications": 4},
    "frontend developer": {"skills_count": 8, "experience_years": 1.2, "projects_count": 7, "certifications": 1},
    "backend developer": {"skills_count": 9, "experience_years": 1.5, "projects_count": 5, "certifications": 1},
    "cybersecurity analyst": {"skills_count": 8, "experience_years": 2.0, "projects_count": 3, "certifications": 3},
}

class BenchmarkRequest(BaseModel):
    role: str
    skills: str
    experience_years: float
    education: str
    projects_count: int
    certifications: int
    skills_count: int
    branch: str = "CSE"  # CSE / ECE / IT / MCA / Other

@router.post("/compare")
def peer_benchmark(req: BenchmarkRequest):
    # Get role-specific cohort or default
    role_key = req.role.lower().strip()
    cohort_averages = COHORT_DATA.get(role_key, COHORT_DATA["default"])

    your_scores = {
        "skills_count": req.skills_count,
        "experience_years": req.experience_years,
        "projects_count": req.projects_count,
        "certifications": req.certifications,
    }

    # Calculate percentiles per dimension
    percentiles = {}
    for key in cohort_averages:
        ratio = your_scores[key] / max(cohort_averages[key], 0.1)
        # Sigmoid-like mapping for more realistic percentiles
        import math
        percentile = int(50 * (1 + math.tanh(ratio - 1)))
        percentile = min(max(percentile, 5), 99)
        percentiles[key] = percentile

    overall_percentile = int(sum(percentiles.values()) / len(percentiles))

    # Radar chart data (normalized 0-100)
    radar_data = [
        {"dimension": "Skills", "you": min(int(req.skills_count / cohort_averages["skills_count"] * 50), 100), "peer_avg": 50},
        {"dimension": "Experience", "you": min(int(req.experience_years / cohort_averages["experience_years"] * 50), 100), "peer_avg": 50},
        {"dimension": "Projects", "you": min(int(req.projects_count / cohort_averages["projects_count"] * 50), 100), "peer_avg": 50},
        {"dimension": "Certifications", "you": min(int((req.certifications + 0.5) / (cohort_averages["certifications"] + 0.5) * 50), 100), "peer_avg": 50},
    ]

    prompt = f"""You are a career benchmarking expert specializing in {req.branch} students targeting {req.role}.

A {req.branch} student targeting {req.role} has these stats:
- Skills: {req.skills}
- Experience: {req.experience_years} years
- Projects: {req.projects_count}
- Certifications: {req.certifications}
- Education: {req.education}
- Branch: {req.branch}

They are in the {overall_percentile}th percentile among peers targeting {req.role}.

Provide:
1. Competitive Analysis (how they compare to {req.branch} peers targeting {req.role})
2. Top 3 areas where they lead peers
3. Top 3 areas where peers outperform them
4. Specific actions to reach 80th percentile
5. What top 10% candidates in {req.role} typically have

Keep it motivating, specific, and relevant to {req.branch} students."""

    ai_insights = ask_gemini(prompt)

    return {
        "overall_percentile": overall_percentile,
        "dimension_percentiles": percentiles,
        "cohort_averages": cohort_averages,
        "your_stats": your_scores,
        "radar_data": radar_data,
        "ai_insights": ai_insights,
        "cohort_type": role_key if role_key in COHORT_DATA else "general",
    }
