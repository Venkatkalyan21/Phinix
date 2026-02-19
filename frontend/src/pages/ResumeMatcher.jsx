import { useState } from 'react'
import axios from 'axios'

import API_BASE from '../api.js'
const API = API_BASE + '/api'

export default function ResumeMatcher() {
    const [resumeText, setResumeText] = useState('')
    const [jobDesc, setJobDesc] = useState('')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)

    const submit = async () => {
        setLoading(true); setResult('')
        try {
            const { data } = await axios.post(`${API}/matcher/match`, { resume_text: resumeText, job_description: jobDesc })
            setResult(data.match_analysis)
        } catch { setResult('❌ Error: Make sure the backend is running.') }
        setLoading(false)
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🔗 <span className="gradient-text">Resume vs JD Matcher</span></h1>
                <p className="page-subtitle">Paste a job description and your resume to get an ATS match score and gap analysis</p>
            </div>
            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">📋 Job Description *</label>
                        <textarea className="form-textarea" rows={12} placeholder="Paste the full job description here..." value={jobDesc} onChange={e => setJobDesc(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">📄 Your Resume *</label>
                        <textarea className="form-textarea" rows={12} placeholder="Paste your complete resume text here..." value={resumeText} onChange={e => setResumeText(e.target.value)} />
                    </div>
                </div>
                <div style={{ marginTop: 20 }}>
                    <button className="btn btn-primary" onClick={submit} disabled={loading || !resumeText || !jobDesc}>
                        {loading ? '⏳ Matching...' : '🔗 Match Resume to JD'}
                    </button>
                </div>
            </div>
            {loading && <div className="loading-wrap"><div className="spinner" /><p>AI is analyzing the match...</p></div>}
            {result && <div className="result-box">{result}</div>}
        </div>
    )
}
