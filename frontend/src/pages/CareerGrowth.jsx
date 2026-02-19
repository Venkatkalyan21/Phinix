import { useState } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

import API_BASE from '../api.js'
const API = API_BASE + '/api'

export default function CareerGrowth() {
    const [form, setForm] = useState({
        current_role: '', target_role: '', skills_count: 8, experience_years: 1,
        education_level: 'BTech', certifications: 0, projects_count: 3,
        github_active: true, market_demand_score: 70
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

    const scoreColor = (s) => s > 7 ? 'var(--success)' : s > 4.5 ? 'var(--warning)' : 'var(--danger)'
    const riskColor = (r) => r === 'Low' ? 'var(--success)' : r === 'Medium' ? 'var(--warning)' : 'var(--danger)'

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📈 <span className="gradient-text">Career Growth Prediction</span></h1>
                <p className="page-subtitle">ANN-based salary and career growth prediction with 5-year trajectory</p>
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

                {/* Market Demand Score Slider */}
                <div className="form-group">
                    <label className="form-label">
                        Market Demand Score: <strong style={{ color: 'var(--accent)' }}>{form.market_demand_score}/100</strong>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>
                            ({form.market_demand_score >= 75 ? '🔥 Very High' : form.market_demand_score >= 55 ? '📈 High' : form.market_demand_score >= 35 ? '📊 Medium' : '📉 Low'})
                        </span>
                    </label>
                    <input type="range" min={10} max={100} step={5} value={form.market_demand_score}
                        onChange={e => set('market_demand_score', +e.target.value)}
                        style={{ width: '100%', accentColor: 'var(--accent)', marginTop: 8 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                        <span>10 (Declining)</span><span>55 (Stable)</span><span>100 (Booming)</span>
                    </div>
                </div>

                <button className="btn btn-primary" onClick={submit} disabled={loading}>
                    {loading ? '⏳ Predicting...' : '📈 Predict Career Growth'}
                </button>
            </div>

            {loading && <div className="loading-wrap"><div className="spinner" /><p>Running ANN growth prediction model...</p></div>}

            {result && !result.error && (
                <div>
                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="stat-val" style={{ color: scoreColor(result.prediction.growth_score) }}>
                                {result.prediction.growth_score}/10
                            </div>
                            <div className="stat-label">Growth Score</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-val" style={{ fontSize: 18 }}>{result.prediction.current_salary_estimate}</div>
                            <div className="stat-label">Current Estimate</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-val" style={{ fontSize: 18, color: 'var(--success)' }}>{result.prediction.projected_salary_3yr}</div>
                            <div className="stat-label">3 Year Projection</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-val" style={{ fontSize: 18, color: 'var(--accent)' }}>{result.prediction.projected_salary_5yr}</div>
                            <div className="stat-label">5 Year Projection</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-val" style={{ fontSize: 20, color: riskColor(result.prediction.risk_level) }}>
                                {result.prediction.risk_level}
                            </div>
                            <div className="stat-label">Risk Level</div>
                        </div>
                    </div>

                    {/* 5-Year Salary Trajectory Chart */}
                    {result.prediction.salary_trajectory && (
                        <div className="card" style={{ marginBottom: 20 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📈 5-Year Salary Trajectory (LPA)</h3>
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={result.prediction.salary_trajectory}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="year" tick={{ fill: '#8888aa', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#8888aa', fontSize: 11 }} tickFormatter={v => `₹${v}`} />
                                    <Tooltip contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                                        formatter={(v) => [`₹${v} LPA`, 'Salary']} />
                                    <Line type="monotone" dataKey="salary" stroke="#7C6FFF" strokeWidth={3}
                                        dot={{ fill: '#7C6FFF', r: 5 }} activeDot={{ r: 7 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    <div className="card" style={{ marginBottom: 20 }}>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ fontWeight: 600 }}>Growth Score</span>
                                <span style={{ color: scoreColor(result.prediction.growth_score) }}>
                                    {result.prediction.readiness_level} Readiness · {result.prediction.promotion_probability} Promotion Probability
                                </span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${result.prediction.growth_score_100}%` }} />
                            </div>
                        </div>
                    </div>

                    {result.growth_tips.length > 0 && (
                        <div className="card">
                            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>💡 Growth Tips</h3>
                            {result.growth_tips.map((tip, i) => (
                                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, padding: '10px 14px', background: 'rgba(124,111,255,0.06)', borderRadius: 8, fontSize: 14 }}>
                                    <span>→</span><span>{tip}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            {result?.error && <div className="result-box">{result.error}</div>}
        </div>
    )
}
