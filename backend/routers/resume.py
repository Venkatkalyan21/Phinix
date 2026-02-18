from fastapi import APIRouter
from pydantic import BaseModel
from agents.ai_helper import ask_gemini

router = APIRouter()

class ResumeRequest(BaseModel):
    resume_text: str
    target_role: str = ""

@router.post("/evaluate")
def evaluate_resume(req: ResumeRequest):
    prompt = f"""You are an expert resume reviewer and career coach.
Analyze the following resume for the target role: "{req.target_role}".

Resume:
{req.resume_text}

Provide a structured evaluation with:
1. Overall Score (out of 100)
2. Key Strengths (3-5 bullet points)
3. Critical Weaknesses (3-5 bullet points)
4. ATS Optimization Tips (3 tips)
5. Missing Keywords for the target role
6. Recommended Improvements (actionable, specific)

Format your response as clear sections with headers."""
    result = ask_gemini(prompt)
    return {"evaluation": result}
