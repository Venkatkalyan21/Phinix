from fastapi import APIRouter, UploadFile, File
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

@router.post("/upload")
async def upload_resume_pdf(file: UploadFile = File(...), target_role: str = ""):
    """Extract text from uploaded PDF and evaluate it."""
    try:
        import fitz  # PyMuPDF
        contents = await file.read()
        doc = fitz.open(stream=contents, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()

        if not text.strip():
            return {"error": "Could not extract text from PDF. Try a text-based PDF."}

        # Run evaluation on extracted text
        prompt = f"""You are an expert resume reviewer and career coach.
Analyze the following resume for the target role: "{target_role}".

Resume:
{text}

Provide a structured evaluation with:
1. Overall Score (out of 100)
2. Key Strengths (3-5 bullet points)
3. Critical Weaknesses (3-5 bullet points)
4. ATS Optimization Tips (3 tips)
5. Missing Keywords for the target role
6. Recommended Improvements (actionable, specific)

Format your response as clear sections with headers."""
        evaluation = ask_gemini(prompt)
        return {"extracted_text": text[:500] + "..." if len(text) > 500 else text,
                "evaluation": evaluation,
                "pages": len(doc) if not doc.is_closed else "N/A"}
    except ImportError:
        return {"error": "PyMuPDF not installed. Run: pip install PyMuPDF"}
    except Exception as e:
        return {"error": f"Failed to process PDF: {str(e)}"}
