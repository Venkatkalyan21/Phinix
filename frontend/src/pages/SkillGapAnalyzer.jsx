import { useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000/api'

export default function SkillGapAnalyzer() {
    const [form, setForm] = useState({ current_skills: '', target_role: '', experience_level: 'Fresher' })
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const submit = async () => {
        setLoading(true); setResult('')
        try {
            const { data } = await axios.post(`${API}/skills/analyze`, form)
            setResult(data.analysis)
        } catch { setResult('❌ Error: Make sure the backend is running.') }
        setLoading(false)
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🎯 <span className="gradient-text">Skill Gap Analyzer</span></h1>
                <p className="page-subtitle">Identify exactly what skills you need to land your target role</p>
            </div>
            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                        <label className="form-label">Target Role *</label>
                        <input className="form-input" placeholder="e.g. Machine Learning Engineer" value={form.target_role} onChange={e => set('target_role', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Experience Level</label>
                        <select className="form-select" value={form.experience_level} onChange={e => set('experience_level', e.target.value)}>
                            <option>Fresher</option><option>Junior (1-3 yrs)</option>
                            <option>Mid-level (3-5 yrs)</option><option>Senior (5+ yrs)</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Your Current Skills *</label>
                    <textarea className="form-textarea" rows={4} placeholder="List all your skills: Python, React, SQL, Docker, Git, etc." value={form.current_skills} onChange={e => set('current_skills', e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={submit} disabled={loading || !form.current_skills || !form.target_role}>
                    {loading ? '⏳ Analyzing...' : '🎯 Analyze Skill Gap'}
                </button>
            </div>
            {loading && <div className="loading-wrap"><div className="spinner" /><p>AI is analyzing your skill gaps...</p></div>}
            {result && <div className="result-box">{result}</div>}
        </div>
    )
}
