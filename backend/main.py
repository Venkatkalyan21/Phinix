import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routers import resume, career, skills, roadmap, jobmarket, interview, growth, benchmarking, matcher, pipeline

app = FastAPI(
    title="VidyaGuide AI API",
    description="Agentic AI backend for career planning, resume evaluation, and interview coaching — Multi-Agent Architecture",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://vidyaguide-frontend.onrender.com",  # Render frontend URL
        "https://*.onrender.com",                    # any Render subdomain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/api/resume", tags=["Resume Agent"])
app.include_router(career.router, prefix="/api/career", tags=["Career Intelligence"])
app.include_router(skills.router, prefix="/api/skills", tags=["Skill Gap Agent"])
app.include_router(roadmap.router, prefix="/api/roadmap", tags=["Roadmap Planner"])
app.include_router(jobmarket.router, prefix="/api/jobmarket", tags=["Job Market"])
app.include_router(interview.router, prefix="/api/interview", tags=["Interview Coach"])
app.include_router(growth.router, prefix="/api/growth", tags=["Career Growth"])
app.include_router(benchmarking.router, prefix="/api/benchmarking", tags=["Peer Benchmarking"])
app.include_router(matcher.router, prefix="/api/matcher", tags=["Resume Matcher"])
app.include_router(pipeline.router, prefix="/api/pipeline", tags=["Multi-Agent Pipeline"])

@app.get("/")
def root():
    return {
        "message": "VidyaGuide AI API v2.0 is running 🚀",
        "docs": "/docs",
        "agents": ["Resume Agent", "Career Intelligence Agent", "Skill Gap Agent", "Roadmap Planner Agent", "Interview Coach Agent"],
        "features": 10
    }

@app.get("/debug/key")
def debug_key():
    key = os.getenv("GEMINI_API_KEY", "NOT_SET")
    return {"key_length": len(key), "key_prefix": key[:8] if key != "NOT_SET" else "NOT_SET", "key_suffix": key[-4:] if key != "NOT_SET" else "NOT_SET"}
