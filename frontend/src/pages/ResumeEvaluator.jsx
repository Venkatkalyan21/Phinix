import { useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000/api'

export default function ResumeEvaluator() {
    const [resumeText, setResumeText] = useState('')
    const [targetRole, setTargetRole] = useState('')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)

    const evaluate = async () => {
        if (!resumeText.trim()) return
        setLoading(true); setResult('')
        try {
            const { data } = await axios.post(`${API}/resume/evaluate`, { resume_text: resumeText, target_role: targetRole })
            setResult(data.evaluation)
        } catch (e) {
            setResult('❌ Error: Make sure the backend is running at http://localhost:8000')
        }
        setLoading(false)
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📄 <span className="gradient-text">Resume Evaluator</span></h1>
                <p className="page-subtitle">AI-powered resume analysis with ATS optimization and actionable feedback</p>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
                <div className="form-group">
                    <label className="form-label">Target Role (optional)</label>
                    <input className="form-input" placeholder="e.g. Full Stack Developer, Data Scientist" value={targetRole} onChange={e => setTargetRole(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Paste Your Resume Text *</label>
                    <textarea className="form-textarea" rows={10} placeholder="Paste your complete resume content here..." value={resumeText} onChange={e => setResumeText(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={evaluate} disabled={loading || !resumeText.trim()}>
                    {loading ? '⏳ Analyzing...' : '🔍 Evaluate Resume'}
                </button>
            </div>

            {loading && <div className="loading-wrap"><div className="spinner" /><p>AI is analyzing your resume...</p></div>}
            {result && <div className="result-box">{result}</div>}
        </div>
    )
}
