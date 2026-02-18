import { useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000/api'

export default function CareerGrowth() {
    const [form, setForm] = useState({
        current_role: '', target_role: '', skills_count: 8, experience_years: 1,
        education_level: 'BTech', certifications: 0, projects_count: 3, github_active: true
    })
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const submit = async () => {
        setLoading(true); setResult(null)
        try {
            const { data } = await axios.post(`${API}/growth/predict`, form)
            setResult(data)
        } catch { setResult({ error: '❌ Error: Make sure the backend is running.' }) }
        setLoading(false)
    }

    const scoreColor = (s) => s > 70 ? 'var(--success)' : s > 45 ? 'var(--warning)' : 'var(--danger)'

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📈 <span className="gradient-text">Career Growth Prediction</span></h1>
                <p className="page-subtitle">ANN-based salary and career growth prediction based on your profile</p>
            </div>
            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                        <label className="form-label">Current Role</label>
                        <input className="form-input" placeholder="e.g. Junior Developer" value={form.current_role} onChange={e => set('current_role', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Target Role</label>
                        <input className="form-input" placeholder="e.g. Senior ML Engineer" value={form.target_role} onChange={e => set('target_role', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Number of Skills</label>
                        <input className="form-input" type="number" min={1} max={50} value={form.skills_count} onChange={e => set('skills_count', +e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Years of Experience</label>
                        <input className="form-input" type="number" min={0} max={30} step={0.5} value={form.experience_years} onChange={e => set('experience_years', +e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Education Level</label>
                        <select className="form-select" value={form.education_level} onChange={e => set('education_level', e.target.value)}>
                            <option>Diploma</option><option>BTech</option><option>MTech</option><option>MBA</option><option>PhD</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Certifications Count</label>
                        <input className="form-input" type="number" min={0} max={20} value={form.certifications} onChange={e => set('certifications', +e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Projects Count</label>
                        <input className="form-input" type="number" min={0} max={50} value={form.projects_count} onChange={e => set('projects_count', +e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Active GitHub Profile?</label>
                        <select className="form-select" value={form.github_active ? 'yes' : 'no'} onChange={e => set('github_active', e.target.value === 'yes')}>
                            <option value="yes">Yes ✅</option><option value="no">No ❌</option>
                        </select>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={submit} disabled={loading}>
                    {loading ? '⏳ Predicting...' : '📈 Predict Career Growth'}
                </button>
            </div>

            {loading && <div className="loading-wrap"><div className="spinner" /><p>Running growth prediction model...</p></div>}

            {result && !result.error && (
                <div>
                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="stat-val" style={{ color: scoreColor(result.prediction.growth_score) }}>{result.prediction.growth_score}</div>
                            <div className="stat-label">Growth Score / 100</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-val" style={{ fontSize: 20 }}>{result.prediction.current_salary_estimate}</div>
                            <div className="stat-label">Current Estimate</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-val" style={{ fontSize: 20 }}>{result.prediction.projected_salary_1yr}</div>
                            <div className="stat-label">1 Year Projection</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-val" style={{ fontSize: 20 }}>{result.prediction.projected_salary_3yr}</div>
                            <div className="stat-label">3 Year Projection</div>
                        </div>
                    </div>
                    <div className="card">
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ fontWeight: 600 }}>Growth Score</span>
                                <span style={{ color: scoreColor(result.prediction.growth_score) }}>{result.prediction.readiness_level} Readiness</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${result.prediction.growth_score}%` }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <span className="chip chip-green">🎯 Promotion Probability: {result.prediction.promotion_probability}</span>
                        </div>
                        {result.growth_tips.length > 0 && (
                            <div>
                                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>💡 Growth Tips</h3>
                                {result.growth_tips.map((tip, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, padding: '10px 14px', background: 'rgba(124,111,255,0.06)', borderRadius: 8, fontSize: 14 }}>
                                        <span>→</span><span>{tip}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {result?.error && <div className="result-box">{result.error}</div>}
        </div>
    )
}
