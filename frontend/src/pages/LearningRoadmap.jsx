import { useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000/api'

export default function LearningRoadmap() {
    const [form, setForm] = useState({ target_role: '', current_skills: '', duration_weeks: 12, experience_level: 'Fresher' })
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const submit = async () => {
        setLoading(true); setResult('')
        try {
            const { data } = await axios.post(`${API}/roadmap/generate`, form)
            setResult(data.roadmap)
        } catch { setResult('❌ Error: Make sure the backend is running.') }
        setLoading(false)
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🗺️ <span className="gradient-text">Learning Roadmap</span></h1>
                <p className="page-subtitle">Get a personalized week-by-week learning plan to reach your target role</p>
            </div>
            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                        <label className="form-label">Target Role *</label>
                        <input className="form-input" placeholder="e.g. Full Stack Developer" value={form.target_role} onChange={e => set('target_role', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Duration (weeks)</label>
                        <select className="form-select" value={form.duration_weeks} onChange={e => set('duration_weeks', +e.target.value)}>
                            <option value={4}>4 weeks (Crash Course)</option>
                            <option value={8}>8 weeks (Fast Track)</option>
                            <option value={12}>12 weeks (Standard)</option>
                            <option value={24}>24 weeks (Comprehensive)</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Current Skills</label>
                    <input className="form-input" placeholder="e.g. HTML, CSS, basic Python" value={form.current_skills} onChange={e => set('current_skills', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Experience Level</label>
                    <select className="form-select" value={form.experience_level} onChange={e => set('experience_level', e.target.value)}>
                        <option>Fresher</option><option>Junior (1-3 yrs)</option>
                        <option>Mid-level (3-5 yrs)</option><option>Senior (5+ yrs)</option>
                    </select>
                </div>
                <button className="btn btn-primary" onClick={submit} disabled={loading || !form.target_role}>
                    {loading ? '⏳ Generating...' : '🗺️ Generate Roadmap'}
                </button>
            </div>
            {loading && <div className="loading-wrap"><div className="spinner" /><p>AI is building your personalized roadmap...</p></div>}
            {result && <div className="result-box">{result}</div>}
        </div>
    )
}
