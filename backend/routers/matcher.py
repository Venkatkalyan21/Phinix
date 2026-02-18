from fastapi import APIRouter
from pydantic import BaseModel
from agents.ai_helper import ask_gemini

router = APIRouter()

class MatchRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/match")
def match_resume_jd(req: MatchRequest):
    prompt = f"""You are an expert ATS (Applicant Tracking System) and resume matching specialist.

Job Description:
{req.job_description}

Resume:
{req.resume_text}

Perform a detailed match analysis:
1. Overall Match Score (0-100%)
2. Keyword Match Analysis:
   - Keywords found in resume ✅
   - Missing keywords from JD ❌
3. Skills Match (matched vs required)
4. Experience Match Assessment
5. Education Match
6. Top 5 Strengths for this role
7. Top 5 Gaps to Address
8. Recommended Resume Edits (specific, actionable)
9. Cover Letter Key Points to Highlight
10. Application Recommendation (Apply Now / Needs Work / Not a Fit)

Be precise and use the exact keywords from the JD."""
    result = ask_gemini(prompt)
    return {"match_analysis": result}
