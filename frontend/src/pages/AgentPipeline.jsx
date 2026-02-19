import { useState, useRef } from 'react'
import axios from 'axios'

import API_BASE from '../api.js'
const API = API_BASE + '/api'

const AGENTS = [
    { key: 'resume_agent', name: 'Resume Agent', icon: '📄', desc: 'Analyzing resume quality & ATS score' },
    { key: 'career_agent', name: 'Career Intelligence Agent', icon: '🧭', desc: 'Mapping career paths & market demand' },
    { key: 'skill_gap_agent', name: 'Skill Gap Agent', icon: '🎯', desc: 'Identifying missing skills & priorities' },
    { key: 'roadmap_agent', name: 'Roadmap Planner Agent', icon: '🗺️', desc: 'Building your 12-week learning plan' },
    { key: 'interview_agent', name: 'Interview Coach Agent', icon: '🎤', desc: 'Preparing interview questions & tips' },
]

export default function AgentPipeline() {
    const [form, setForm] = useState({ resume_text: '', target_role: '' })
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)
    const [activeAgent, setActiveAgent] = useState(-1)
    const [expanded, setExpanded] = useState({})

    const run = async () => {
        if (!form.resume_text.trim() || !form.target_role.trim()) return
        setLoading(true); setResults(null); setActiveAgent(0)

        // Animate agents firing one by one (visual only, actual call is one request)
        const timer = setInterval(() => {
            setActiveAgent(prev => {
                if (prev >= AGENTS.length - 1) { clearInterval(timer); return prev }
                return prev + 1
            })
        }, 2000)

        try {
            const { data } = await axios.post(`${API}/pipeline/run`, form)
            clearInterval(timer)
            setActiveAgent(AGENTS.length)
            setResults(data)
        } catch {
            clearInterval(timer)
            setResults({ error: '❌ Error: Make sure the backend is running.' })
        }
        setLoading(false)
    }

    const toggle = (key) => setExpanded(e => ({ ...e, [key]: !e[key] }))

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🤖 <span className="gradient-text">Multi-Agent AI Pipeline</span></h1>
                <p className="page-subtitle">5 specialized AI agents analyze your profile in sequence — each building on the previous</p>
            </div>

            {/* Agent Flow Diagram */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {AGENTS.map((agent, i) => (
                        <div key={agent.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                                padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                                background: results && results.agents ? 'rgba(34,197,94,0.15)' :
                                    loading && activeAgent >= i ? 'rgba(124,111,255,0.2)' : 'var(--bg-card)',
                                border: `1px solid ${results && results.agents ? 'rgba(34,197,94,0.4)' :
                                    loading && activeAgent >= i ? 'rgba(124,111,255,0.4)' : 'var(--border)'}`,
                                color: results && results.agents ? 'var(--success)' :
                                    loading && activeAgent >= i ? 'var(--accent)' : 'var(--text-secondary)',
                                transition: 'all 0.4s ease',
                                textAlign: 'center', minWidth: 120
                            }}>
                                <div style={{ fontSize: 20, marginBottom: 4 }}>{agent.icon}</div>
                                <div>{agent.name}</div>
                                {loading && activeAgent === i && <div style={{ fontSize: 10, marginTop: 4, color: 'var(--accent)' }}>⚡ Running...</div>}
                                {(results && results.agents) && <div style={{ fontSize: 10, marginTop: 4 }}>✅ Done</div>}
                            </div>
                            {i < AGENTS.length - 1 && (
                                <div style={{ color: 'var(--text-muted)', fontSize: 18, fontWeight: 700 }}>→</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Input Form */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div className="form-group">
                    <label className="form-label">Target Role *</label>
                    <input className="form-input" placeholder="e.g. ML Engineer, Full Stack Developer"
                        value={form.target_role} onChange={e => setForm(f => ({ ...f, target_role: e.target.value }))} />
                </div>
                <div className="form-group">
                    <label className="form-label">Your Resume / Profile Summary *</label>
                    <textarea className="form-textarea" rows={8}
                        placeholder="Paste your resume text or describe your skills, experience, projects, education..."
                        value={form.resume_text} onChange={e => setForm(f => ({ ...f, resume_text: e.target.value }))} />
                </div>
                <button className="btn btn-primary" onClick={run}
                    disabled={loading || !form.resume_text.trim() || !form.target_role.trim()}
                    style={{ fontSize: 15, padding: '14px 32px' }}>
                    {loading ? '⚡ Agents Running...' : '🚀 Run Full Agent Pipeline'}
                </button>
                {loading && (
                    <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(124,111,255,0.08)', borderRadius: 10, fontSize: 13, color: 'var(--accent)' }}>
                        ⚡ {AGENTS[Math.min(activeAgent, AGENTS.length - 1)]?.desc}...
                    </div>
                )}
            </div>

            {/* Results */}
            {results && !results.error && results.agents && (
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: 'var(--text-secondary)' }}>
                        ✅ Pipeline Complete — {results.target_role}
                    </h2>
                    {results.agents.map((agent, i) => (
                        <div key={i} className="card" style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                onClick={() => toggle(agent.name)}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontSize: 24 }}>{agent.icon}</span>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 15 }}>{agent.name}</div>
                                        <div style={{ fontSize: 12, color: 'var(--success)' }}>✅ Analysis Complete</div>
                                    </div>
                                </div>
                                <span style={{ color: 'var(--text-muted)', fontSize: 20 }}>{expanded[agent.name] ? '▲' : '▼'}</span>
                            </div>
                            {expanded[agent.name] && (
                                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: 'var(--text-primary)' }}>
                                    {agent.output}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {results?.error && <div className="result-box">{results.error}</div>}
        </div>
    )
}
