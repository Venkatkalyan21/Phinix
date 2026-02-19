import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const API = 'http://localhost:8000/api'

const COLORS = ['#7C6FFF', '#3ECFCF', '#FF6B9D', '#22c55e', '#f59e0b', '#ef4444']

export default function JobMarket() {
    const [form, setForm] = useState({ role: '', location: 'India' })
    const [result, setResult] = useState(null)
    const [trending, setTrending] = useState([])
    const [loading, setLoading] = useState(false)
    const [tab, setTab] = useState('insights')

    useEffect(() => {
        axios.get(`${API}/jobmarket/trending-roles`)
            .then(r => setTrending(r.data.trending_roles))
            .catch(() => { })
    }, [])

    const submit = async () => {
        if (!form.role.trim()) return
        setLoading(true); setResult(null)
        try {
            const { data } = await axios.post(`${API}/jobmarket/structured`, form)
            setResult(data)
        } catch {
            setResult({ error: '❌ Error: Make sure the backend is running.' })
        }
        setLoading(false)
    }

    const demandColor = (level) => {
        if (!level) return 'var(--accent)'
        const l = level.toLowerCase()
        if (l.includes('very high')) return 'var(--success)'
        if (l.includes('high')) return '#22c55e'
        if (l.includes('medium')) return 'var(--warning)'
        return 'var(--danger)'
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📊 <span className="gradient-text">Job Market Intelligence</span></h1>
                <p className="page-subtitle">Real-time job market trends, salary data, and in-demand skills with visual charts</p>
            </div>

            {/* Trending Roles */}
            {trending.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>🔥 Trending Roles Right Now</h2>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {trending.map(r => (
                            <div key={r.role} className="card" style={{ padding: '14px 18px', cursor: 'pointer', flex: '1 1 180px' }}
                                onClick={() => setForm(f => ({ ...f, role: r.role }))}>
                                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{r.role}</div>
                                <div style={{ fontSize: 12, color: demandColor(r.demand), marginBottom: 2 }}>● {r.demand}</div>
                                <div style={{ fontSize: 12, color: 'var(--success)' }}>{r.growth} growth</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{r.avg_salary}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Search Form */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                    <div className="form-group">
                        <label className="form-label">Job Role *</label>
                        <input className="form-input" placeholder="e.g. Data Scientist, ML Engineer"
                            value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && submit()} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Location</label>
                        <select className="form-select" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}>
                            <option>India</option><option>USA</option><option>UK</option>
                            <option>Bangalore</option><option>Hyderabad</option><option>Mumbai</option>
                            <option>Remote</option>
                        </select>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={submit} disabled={loading || !form.role.trim()}>
                    {loading ? '⏳ Analyzing Market...' : '📊 Analyze Job Market'}
                </button>
            </div>

            {loading && <div className="loading-wrap"><div className="spinner" /><p>Fetching real-time market data...</p></div>}

            {result && !result.error && result.structured && (
                <div>
                    {/* Stats Row */}
                    <div className="stats-row" style={{ marginBottom: 24 }}>
                        <div className="stat-card">
                            <div className="stat-val" style={{ color: demandColor(result.structured.demand_level), fontSize: 18 }}>
                                {result.structured.demand_level}
                            </div>
                            <div className="stat-label">Market Demand</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-val">{result.structured.demand_score}</div>
                            <div className="stat-label">Demand Score / 100</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-val" style={{ fontSize: 20, color: 'var(--success)' }}>{result.structured.growth_trend}</div>
                            <div className="stat-label">2-Year Growth</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-val" style={{ fontSize: 18 }}>{result.structured.remote_pct}%</div>
                            <div className="stat-label">Remote Jobs</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-val" style={{ fontSize: 16 }}>{result.structured.openings_estimate}</div>
                            <div className="stat-label">Est. Openings</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                        {/* Skills Demand Chart */}
                        <div className="card">
                            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🔥 Most Demanded Skills</h3>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={result.structured.top_skills} layout="vertical" margin={{ left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis type="number" domain={[0, 100]} tick={{ fill: '#8888aa', fontSize: 11 }} />
                                    <YAxis type="category" dataKey="skill" tick={{ fill: '#f0f0f8', fontSize: 12 }} width={90} />
                                    <Tooltip contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                                        formatter={(v) => [`${v}%`, 'Demand']} />
                                    <Bar dataKey="demand_pct" radius={[0, 6, 6, 0]}>
                                        {result.structured.top_skills.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Salary Ranges Chart */}
                        <div className="card">
                            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>💰 Salary Ranges ({result.structured.salary_ranges?.entry?.unit || 'LPA'})</h3>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={[
                                    { level: 'Entry', min: result.structured.salary_ranges?.entry?.min, max: result.structured.salary_ranges?.entry?.max },
                                    { level: 'Mid', min: result.structured.salary_ranges?.mid?.min, max: result.structured.salary_ranges?.mid?.max },
                                    { level: 'Senior', min: result.structured.salary_ranges?.senior?.min, max: result.structured.salary_ranges?.senior?.max },
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="level" tick={{ fill: '#f0f0f8', fontSize: 13 }} />
                                    <YAxis tick={{ fill: '#8888aa', fontSize: 11 }} />
                                    <Tooltip contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                                        formatter={(v, n) => [`₹${v} LPA`, n]} />
                                    <Bar dataKey="min" fill="#3ECFCF" radius={[4, 4, 0, 0]} name="Min" />
                                    <Bar dataKey="max" fill="#7C6FFF" radius={[4, 4, 0, 0]} name="Max" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Companies & Portals */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div className="card">
                            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>🏢 Top Hiring Companies</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {result.structured.top_companies?.map(c => (
                                    <span key={c} className="chip chip-purple">{c}</span>
                                ))}
                            </div>
                        </div>
                        <div className="card">
                            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>🔗 Top Job Portals</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {result.structured.job_portals?.map(p => (
                                    <span key={p} className="chip chip-green">{p}</span>
                                ))}
                            </div>
                            <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                                <span className="chip chip-yellow">⚡ Interview: {result.structured.interview_difficulty}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {result?.error && <div className="result-box">{result.error}</div>}
        </div>
    )
}
