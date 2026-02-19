from fastapi import APIRouter
from pydantic import BaseModel
from agents.ai_helper import ask_gemini
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

router = APIRouter()

class MatchRequest(BaseModel):
    resume_text: str
    job_description: str

def extract_keywords(text: str) -> list:
    """Extract meaningful keywords from text."""
    # Common tech keywords pattern
    words = re.findall(r'\b[A-Za-z][A-Za-z0-9+#.]*\b', text)
    # Filter short words and common stopwords
    stopwords = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
                 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
                 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
                 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
                 'we', 'you', 'they', 'he', 'she', 'it', 'this', 'that', 'these', 'those'}
    keywords = [w.lower() for w in words if len(w) > 2 and w.lower() not in stopwords]
    return list(set(keywords))

@router.post("/match")
def match_resume_jd(req: MatchRequest):
    # TF-IDF Cosine Similarity
    try:
        vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
        tfidf_matrix = vectorizer.fit_transform([req.resume_text, req.job_description])
        cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        numeric_score = round(float(cosine_sim) * 100, 1)
    except Exception:
        numeric_score = 0.0

    # Keyword analysis
    resume_keywords = set(extract_keywords(req.resume_text))
    jd_keywords = set(extract_keywords(req.job_description))
    matched = sorted(list(resume_keywords & jd_keywords))
    missing = sorted(list(jd_keywords - resume_keywords))

    # Filter to meaningful keywords (length > 3)
    matched = [k for k in matched if len(k) > 3][:20]
    missing = [k for k in missing if len(k) > 3][:20]

    # AI analysis for qualitative insights
    prompt = f"""You are an expert ATS (Applicant Tracking System) and resume matching specialist.

Job Description:
{req.job_description}

Resume:
{req.resume_text}

The TF-IDF cosine similarity match score is: {numeric_score}%

Provide a structured analysis:
1. Match Assessment (what this score means for this candidate)
2. Top 5 Strengths for this role
3. Top 5 Critical Gaps to Address
4. Specific Resume Edits (3 actionable changes)
5. Cover Letter Key Points to Highlight
6. Application Recommendation: Apply Now / Needs Work / Not a Fit

Be precise and reference specific keywords from the JD."""

    ai_analysis = ask_gemini(prompt)

    return {
        "match_score": numeric_score,
        "match_grade": "Excellent" if numeric_score >= 75 else "Good" if numeric_score >= 55 else "Fair" if numeric_score >= 35 else "Poor",
        "matched_keywords": matched,
        "missing_keywords": missing,
        "matched_count": len(matched),
        "missing_count": len(missing),
        "ai_analysis": ai_analysis,
    }
