import { useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000/api'

export default function PeerBenchmark() {
    const [form, setForm] = useState({
        role: '', skills: '', experience_years: 1, education: 'BTech',
        projects_count: 3, certifications: 0, skills_count: 8
    })
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const submit = async () => {
        setLoading(true); setResult(null)
        try {
            const { data } = await axios.post(`${API}/benchmarking/compare`, form)
            setResult(data)
        } catch { setResult({ error: '❌ Error: Make sure the backend is running.' }) }
        setLoading(false)
    }

    const pColor = (p) => p >= 70 ? 'var(--success)' : p >= 40 ? 'var(--warning)' : 'var(--danger)'

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🏆 <span className="gradient-text">Peer Benchmarking</span></h1>
                <p className="page-subtitle">See how you compare to peers targeting the same role</p>
            </div>
            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                        <label className="form-label">Target Role *</label>
                        <input className="form-input" placeholder="e.g. Data Scientist" value={form.role} onChange={e => set('role', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Education</label>
                        <select className="form-select" value={form.education} onChange={e => set('education', e.target.value)}>
                            <option>Diploma</option><option>BTech</option><option>MTech</option><option>MBA</option><option>PhD</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Skills Count</label>
                        <input className="form-input" type="number" min={1} value={form.skills_count} onChange={e => set('skills_count', +e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Experience (years)</label>
                        <input className="form-input" type="number" min={0} step={0.5} value={form.experience_years} onChange={e => set('experience_years', +e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Projects Count</label>
                        <input className="form-input" type="number" min={0} value={form.projects_count} onChange={e => set('projects_count', +e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Certifications</label>
                        <input className="form-input" type="number" min={0} value={form.certifications} onChange={e => set('certifications', +e.target.value)} />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Your Skills</label>
                    <input className="form-input" placeholder="e.g. Python, TensorFlow, SQL, Docker" value={form.skills} onChange={e => set('skills', e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={submit} disabled={loading || !form.role}>
                    {loading ? '⏳ Comparing...' : '🏆 Compare with Peers'}
                </button>
            </div>

            {loading && <div className="loading-wrap"><div className="spinner" /><p>Benchmarking your profile...</p></div>}

            {result && !result.error && (
                <div>
                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="stat-val" style={{ color: pColor(result.overall_percentile) }}>{result.overall_percentile}th</div>
                            <div className="stat-label">Overall Percentile</div>
                        </div>
                        {Object.entries(result.dimension_percentiles).map(([k, v]) => (
                            <div key={k} className="stat-card">
                                <div className="stat-val" style={{ fontSize: 24, color: pColor(v) }}>{v}th</div>
                                <div className="stat-label">{k.replace('_', ' ')}</div>
                            </div>
                        ))}
                    </div>
                    <div className="card" style={{ marginBottom: 20 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>📊 You vs Peer Average</h3>
                        {Object.entries(result.your_stats).map(([k, v]) => {
                            const avg = result.cohort_averages[k]
                            const pct = Math.min((v / Math.max(avg * 2, 1)) * 100, 100)
                            return (
                                <div key={k} style={{ marginBottom: 14 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                                        <span style={{ textTransform: 'capitalize' }}>{k.replace('_', ' ')}</span>
                                        <span>You: <strong>{v}</strong> | Avg: {avg}</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="result-box">{result.ai_insights}</div>
                </div>
            )}
            {result?.error && <div className="result-box">{result.error}</div>}
        </div>
    )
}
