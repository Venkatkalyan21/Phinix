# VidyaGuide AI 🎓
### AI-Powered Career Planning & Resume Mentor Platform

> **Category:** Generative AI | **Tech Stack:** React + FastAPI + Gemini AI + ANN

---

## 🚀 Features

| # | Feature | Status |
|---|---------|--------|
| 1 | Multi-Agent AI System (Resume, Career, Skill Gap, Roadmap, Interview) | ✅ |
| 2 | Real-Time Job Market Intelligence | ✅ |
| 3 | Personalized Learning Path Generator | ✅ |
| 4 | AI Mock Interview Simulator (text + voice) | ✅ |
| 5 | AI Career Growth Prediction (ANN) | ✅ |
| 6 | LLM Fine-Tuning | 🟡 Optional |
| 7 | Peer Benchmarking | ✅ |
| 8 | Resume vs Job Description Matcher | ✅ |

---

## 📁 Project Structure

```
Phinix/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── pages/     # 10 feature pages
│   │   ├── App.jsx    # Router + Sidebar
│   │   └── index.css  # Design system
│   └── public/
│       └── interview/ # Standalone mock interview simulator
│
├── backend/           # FastAPI Python backend
│   ├── main.py        # App entry point
│   ├── routers/       # 9 AI-powered endpoints
│   ├── agents/        # Gemini AI helper
│   └── .env           # API keys
│
├── index.html         # Standalone mock interview (original)
├── app.js
└── style.css
```

---

## ⚡ Quick Start

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Add your Gemini API key to .env
# GEMINI_API_KEY=your_key_here

uvicorn main:app --reload
# API runs at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

### 3. Get Gemini API Key (Free)
1. Go to [aistudio.google.com](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Paste it in `backend/.env`

---

## 🤖 AI Agents

- **Resume Agent** — Evaluates resumes, ATS optimization
- **Career Intelligence Agent** — Personalized career path recommendations
- **Skill Gap Agent** — Identifies missing skills for target roles
- **Roadmap Planner Agent** — Week-by-week learning plans
- **Interview Coach Agent** — Mock interviews with STAR evaluation

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router |
| Backend | FastAPI, Python 3.10+ |
| AI | Google Gemini 1.5 Flash |
| ML | ANN (sklearn) for growth prediction |
| Styling | Vanilla CSS (dark theme) |
