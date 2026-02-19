import { useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000/api'

function parseWeeks(text) {
    // Try to split roadmap text into week blocks
    const blocks = []
    const lines = text.split('\n')
    let current = null
    for (const line of lines) {
        const weekMatch = line.match(/📅\s*Week\s*(\d+[-–]\d+|\d+)/i) ||
            line.match(/^Week\s*(\d+[-–]\d+|\d+)/i) ||
            line.match(/\*\*Week\s*(\d+[-–]\d+|\d+)/i)
        if (weekMatch) {
            if (current) blocks.push(current)
            current = { title: line.replace(/\*\*/g, '').trim(), content: [] }
        } else if (current && line.trim()) {
            current.content.push(line)
        }
    }
    if (current) blocks.push(current)
    return blocks
}

export default function LearningRoadmap() {
    const [form, setForm] = useState({
        target_role: '', current_skills: '', duration_weeks: 12,
        experience_level: 'Fresher', daily_hours: 2, timeline: '3 months'
    })
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const submit = async () => {
        setLoading(true); setResult(null)
        try {
            const { data } = await axios.post(`${API}/roadmap/generate`, form)
            setResult(data)
        } catch { setResult({ error: '❌ Error: Make sure the backend is running.' }) }
        setLoading(false)
    }

    const weeks = result?.roadmap ? parseWeeks(result.roadmap) : []

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🗺️ <span className="gradient-text">Learning Roadmap</span></h1>
                <p className="page-subtitle">Personalized week-by-week learning plan tailored to your schedule and goals</p>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                        <label className="form-label">Target Role *</label>
                        <input className="form-input" placeholder="e.g. Full Stack Developer"
                            value={form.target_role} onChange={e => set('target_role', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Experience Level</label>
                        <select className="form-select" value={form.experience_level} onChange={e => set('experience_level', e.target.value)}>
                            <option>Fresher</option><option>Junior (1-3 yrs)</option>
                            <option>Mid-level (3-5 yrs)</option><option>Senior (5+ yrs)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Timeline</label>
                        <select className="form-select" value={form.timeline} onChange={e => {
                            const weeks = e.target.value === '3 months' ? 12 : e.target.value === '6 months' ? 24 : 52
                            set('timeline', e.target.value); set('duration_weeks', weeks)
                        }}>
                            <option value="3 months">3 Months (12 weeks)</option>
                            <option value="6 months">6 Months (24 weeks)</option>
                            <option value="1 year">1 Year (52 weeks)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Daily Study Hours: <strong style={{ color: 'var(--accent)' }}>{form.daily_hours}h</strong></label>
                        <input type="range" min={1} max={8} step={0.5} value={form.daily_hours}
                            onChange={e => set('daily_hours', +e.target.value)}
                            style={{ width: '100%', accentColor: 'var(--accent)', marginTop: 8 }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                            <span>1h (Casual)</span><span>4h (Dedicated)</span><span>8h (Intensive)</span>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Current Skills</label>
                    <input className="form-input" placeholder="e.g. HTML, CSS, basic Python"
                        value={form.current_skills} onChange={e => set('current_skills', e.target.value)} />
                </div>

                {/* Summary */}
                <div style={{ padding: '12px 16px', background: 'rgba(124,111,255,0.08)', borderRadius: 10, marginBottom: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                    📅 Plan: <strong style={{ color: 'var(--text-primary)' }}>{form.timeline}</strong> ·
                    ⏱️ <strong style={{ color: 'var(--text-primary)' }}>{form.daily_hours}h/day</strong> ·
                    📚 Total: <strong style={{ color: 'var(--accent)' }}>~{Math.round(form.daily_hours * 7 * form.duration_weeks)} hours</strong>
                </div>

                <button className="btn btn-primary" onClick={submit} disabled={loading || !form.target_role}>
                    {loading ? '⏳ Generating...' : '🗺️ Generate My Roadmap'}
                </button>
            </div>

            {loading && <div className="loading-wrap"><div className="spinner" /><p>AI is building your personalized roadmap...</p></div>}

            {result && !result.error && (
                <div>
                    {weeks.length > 0 ? (
                        <div>
                            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, color: 'var(--text-secondary)' }}>
                                📅 Your {form.timeline} Roadmap — {form.daily_hours}h/day
                            </h2>
                            <div style={{ position: 'relative' }}>
                                {/* Timeline line */}
                                <div style={{ position: 'absolute', left: 20, top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg, var(--accent), var(--accent2))', borderRadius: 2 }} />
                                {weeks.map((week, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 20, paddingLeft: 52, position: 'relative' }}>
                                        {/* Dot */}
                                        <div style={{
                                            position: 'absolute', left: 12, top: 16, width: 18, height: 18,
                                            borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                                            border: '3px solid var(--bg-primary)', zIndex: 1
                                        }} />
                                        <div className="card" style={{ flex: 1, padding: '16px 20px' }}>
                                            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent)', marginBottom: 10 }}>
                                                {week.title}
                                            </div>
                                            <div style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                                                {week.content.join('\n')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="result-box">{result.roadmap}</div>
                    )}
                </div>
            )}
            {result?.error && <div className="result-box">{result.error}</div>}
        </div>
    )
}
