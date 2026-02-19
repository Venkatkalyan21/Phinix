import { useState } from 'react'
import axios from 'axios'

import API_BASE from '../api.js'
const API = API_BASE + '/api'

export default function CareerGuidance() {
    const [form, setForm] = useState({ current_role: '', skills: '', experience_years: 0, interests: '', target_company_type: 'Product Startup' })
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const submit = async () => {
        setLoading(true); setResult('')
        try {
            const { data } = await axios.post(`${API}/career/guidance`, form)
            setResult(data.guidance)
        } catch { setResult('❌ Error: Make sure the backend is running.') }
        setLoading(false)
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🧭 <span className="gradient-text">Career Guidance</span></h1>
                <p className="page-subtitle">Personalized career path recommendations powered by AI</p>
            </div>
            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                        <label className="form-label">Current Role / Background</label>
                        <input className="form-input" placeholder="e.g. CS Student, Junior Developer" value={form.current_role} onChange={e => set('current_role', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Years of Experience</label>
                        <input className="form-input" type="number" min={0} max={30} value={form.experience_years} onChange={e => set('experience_years', +e.target.value)} />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Your Skills</label>
                    <input className="form-input" placeholder="e.g. Python, React, Machine Learning, SQL" value={form.skills} onChange={e => set('skills', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Interests & Passions</label>
                    <input className="form-input" placeholder="e.g. AI, Web Development, Product Management" value={form.interests} onChange={e => set('interests', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Target Company Type</label>
                    <select className="form-select" value={form.target_company_type} onChange={e => set('target_company_type', e.target.value)}>
                        <option>FAANG / Big Tech</option>
                        <option>Product Startup</option>
                        <option>Service Company</option>
                        <option>Mid-size Tech Company</option>
                        <option>Government / PSU</option>
                    </select>
                </div>
                <button className="btn btn-primary" onClick={submit} disabled={loading}>
                    {loading ? '⏳ Generating...' : '🧭 Get Career Guidance'}
                </button>
            </div>
            {loading && <div className="loading-wrap"><div className="spinner" /><p>AI is crafting your career plan...</p></div>}
            {result && <div className="result-box">{result}</div>}
        </div>
    )
}
