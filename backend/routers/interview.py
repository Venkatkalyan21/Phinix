from fastapi import APIRouter
from pydantic import BaseModel
from agents.ai_helper import ask_gemini

router = APIRouter()

class InterviewStartRequest(BaseModel):
    role: str
    experience_level: str = "Fresher"
    interview_type: str = "Technical"  # Technical / Behavioral / Mixed

class EvaluateAnswerRequest(BaseModel):
    role: str
    question: str
    answer: str

class NextQuestionRequest(BaseModel):
    role: str
    history: list = []  # list of {"question": ..., "answer": ...}
    question_number: int = 1

@router.post("/start")
def start_interview(req: InterviewStartRequest):
    """Generate the first interview question."""
    prompt = f"""You are a professional technical interviewer at a top tech company.

You are interviewing a {req.experience_level} candidate for the role of: {req.role}
Interview Type: {req.interview_type}

Ask the FIRST interview question. Make it appropriate for {req.experience_level} level.
- If Technical: ask a core concept or problem-solving question
- If Behavioral: ask a STAR-format situational question
- If Mixed: start with a warm-up technical question

Return ONLY the question text. No preamble, no "Question 1:", just the question itself."""
    question = ask_gemini(prompt)
    return {"question": question.strip(), "question_number": 1}

@router.post("/next-question")
def next_question(req: NextQuestionRequest):
    """Generate the next interview question based on conversation history."""
    history_text = "\n".join([
        f"Q{i+1}: {h['question']}\nA: {h['answer']}"
        for i, h in enumerate(req.history)
    ])
    prompt = f"""You are a professional technical interviewer for {req.role}.

Previous Q&A:
{history_text}

Ask question #{req.question_number}. 
- Build on previous answers if relevant
- Progressively increase difficulty
- Mix technical and behavioral questions
- After 5 questions, ask a final "Do you have any questions for us?" type closing

Return ONLY the question text. No preamble."""
    question = ask_gemini(prompt)
    return {"question": question.strip(), "question_number": req.question_number}

@router.post("/evaluate-answer")
def evaluate_answer(req: EvaluateAnswerRequest):
    """Evaluate a single interview answer with detailed scoring."""
    prompt = f"""You are an expert interview evaluator for {req.role} positions.

Question: {req.question}
Candidate's Answer: {req.answer}

Evaluate this answer and return a JSON-like structured response with:

SCORES (0-10):
- Technical Accuracy: X/10 — [brief reason]
- Clarity & Communication: X/10 — [brief reason]  
- Depth of Knowledge: X/10 — [brief reason]
- Confidence Level: X/10 — [brief reason]
- STAR Method (if behavioral): X/10 — [brief reason]

OVERALL SCORE: X/10

FEEDBACK:
✅ What was good: [2-3 points]
❌ What was missing: [2-3 points]
💡 Ideal answer would include: [key points]
🎯 Tip to improve: [one actionable tip]"""
    evaluation = ask_gemini(prompt)
    return {"evaluation": evaluation, "question": req.question}

@router.post("/final-report")
def final_report(req: NextQuestionRequest):
    """Generate a final interview performance report."""
    history_text = "\n".join([
        f"Q{i+1}: {h['question']}\nA: {h['answer']}"
        for i, h in enumerate(req.history)
    ])
    prompt = f"""You are an expert interview coach evaluating a complete mock interview for {req.role}.

Full Interview Transcript:
{history_text}

Generate a comprehensive final report:

## 🎯 Overall Performance
- Overall Score: X/10
- Hire Recommendation: Strong Yes / Yes / Maybe / No

## 📊 Dimension Scores
- Technical Knowledge: X/10
- Communication Skills: X/10
- Problem-Solving: X/10
- Confidence: X/10
- Cultural Fit: X/10

## ✅ Top Strengths (3 points)
## ❌ Areas to Improve (3 points)
## 📚 Study Recommendations (top 5 topics to revise)
## 🚀 Next Steps to Get Interview-Ready"""
    report = ask_gemini(prompt)
    return {"report": report, "role": req.role}
