import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000/api'

export default function JobMarket() {
    const [role, setRole] = useState('')
    const [location, setLocation] = useState('India')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const [trending, setTrending] = useState([])

    useEffect(() => {
        axios.get(`${API}/jobmarket/trending-roles`).then(r => setTrending(r.data.trending_roles)).catch(() => { })
    }, [])

    const submit = async () => {
        setLoading(true); setResult('')
        try {
            const { data } = await axios.post(`${API}/jobmarket/insights`, { role, location })
            setResult(data.insights)
        } catch { setResult('❌ Error: Make sure the backend is running.') }
        setLoading(false)
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📊 <span className="gradient-text">Job Market Intelligence</span></h1>
                <p className="page-subtitle">Real-time job market trends, salary data, and hiring insights</p>
            </div>

            {trending.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: 'var(--text-secondary)' }}>🔥 Trending Roles</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                        {trending.map(t => (
                            <div key={t.role} className="card" style={{ padding: 16, cursor: 'pointer' }} onClick={() => setRole(t.role)}>
                                <div style={{ fontWeight: 600, marginBottom: 6 }}>{t.role}</div>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    <span className="chip chip-green">📈 {t.growth}</span>
                                    <span className="chip chip-purple">{t.demand}</span>
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>{t.avg_salary}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                        <label className="form-label">Role / Job Title *</label>
                        <input className="form-input" placeholder="e.g. Data Scientist" value={role} onChange={e => setRole(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Location</label>
                        <input className="form-input" placeholder="e.g. India, Bangalore, USA" value={location} onChange={e => setLocation(e.target.value)} />
                    </div>
                </div>
                <button className="btn btn-primary" onClick={submit} disabled={loading || !role}>
                    {loading ? '⏳ Fetching...' : '📊 Get Market Insights'}
                </button>
            </div>
            {loading && <div className="loading-wrap"><div className="spinner" /><p>Fetching market intelligence...</p></div>}
            {result && <div className="result-box">{result}</div>}
        </div>
    )
}
