from fastapi import APIRouter
from pydantic import BaseModel
from agents.ai_helper import ask_gemini

router = APIRouter()

class InterviewRequest(BaseModel):
    role: str
    skills: str
    experience_level: str
    company_type: str
    question_count: int = 5

class EvaluateRequest(BaseModel):
    question: str
    answer: str
    role: str
    question_type: str = "technical"

@router.post("/questions")
def generate_questions(req: InterviewRequest):
    prompt = f"""Generate {req.question_count} interview questions for:
Role: {req.role}
Skills: {req.skills}
Level: {req.experience_level}
Company: {req.company_type}

Mix of technical and behavioral questions. For each question provide:
- Question text
- Type (Technical/Behavioral/System Design)
- Difficulty (Easy/Medium/Hard)
- Key points to cover in answer
- Hint

Format as JSON array."""
    result = ask_gemini(prompt)
    return {"questions": result}

@router.post("/evaluate")
def evaluate_answer(req: EvaluateRequest):
    prompt = f"""You are an expert technical interviewer evaluating a candidate's answer.

Question: {req.question}
Question Type: {req.question_type}
Role: {req.role}

Candidate's Answer: {req.answer}

Evaluate and provide:
1. Technical Accuracy Score (0-10)
2. Clarity Score (0-10)
3. Problem-Solving Score (0-10)
4. Confidence Score (0-10)
5. Overall Score (0-100)
6. Detailed Feedback (3-4 sentences)
7. Three Specific Improvements
8. Model Answer (what a great answer looks like)
{"9. STAR Method Breakdown (S/T/A/R scores 0-10 each)" if req.question_type == "behavioral" else ""}

Respond in JSON format."""
    result = ask_gemini(prompt)
    return {"evaluation": result}
