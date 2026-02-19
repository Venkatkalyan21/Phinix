import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000/api'

const ROLES = ['ML Engineer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'Frontend Developer', 'Backend Developer', 'Cloud Architect']

export default function MockInterview() {
    const [phase, setPhase] = useState('setup') // setup | interview | report
    const [config, setConfig] = useState({ role: 'ML Engineer', experience_level: 'Fresher', interview_type: 'Mixed' })
    const [history, setHistory] = useState([])
    const [currentQ, setCurrentQ] = useState('')
    const [qNum, setQNum] = useState(1)
    const [answer, setAnswer] = useState('')
    const [evaluation, setEvaluation] = useState(null)
    const [report, setReport] = useState('')
    const [loading, setLoading] = useState(false)
    const [listening, setListening] = useState(false)
    const [scores, setScores] = useState([])
    const recognitionRef = useRef(null)
    const bottomRef = useRef(null)

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [history, evaluation])

    const startInterview = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post(`${API}/interview/start`, config)
            setCurrentQ(data.question)
            setQNum(1); setHistory([]); setScores([]); setEvaluation(null)
            setPhase('interview')
        } catch { alert('Backend not running!') }
        setLoading(false)
    }

    const submitAnswer = async () => {
        if (!answer.trim()) return
        setLoading(true)
        const newEntry = { question: currentQ, answer }
        try {
            const evalRes = await axios.post(`${API}/interview/evaluate-answer`, {
                role: config.role, question: currentQ, answer
            })
            setEvaluation(evalRes.data.evaluation)

            // Extract overall score from evaluation text
            const scoreMatch = evalRes.data.evaluation.match(/OVERALL SCORE:\s*(\d+(?:\.\d+)?)/i)
            const score = scoreMatch ? parseFloat(scoreMatch[1]) : 7
            setScores(s => [...s, score])

            const updatedHistory = [...history, newEntry]
            setHistory(updatedHistory)
            setAnswer('')

            if (qNum >= 5) {
                // Get final report
                const reportRes = await axios.post(`${API}/interview/final-report`, {
                    role: config.role, history: updatedHistory, question_number: qNum
                })
                setReport(reportRes.data.report)
                setPhase('report')
            } else {
                // Get next question
                const nextRes = await axios.post(`${API}/interview/next-question`, {
                    role: config.role, history: updatedHistory, question_number: qNum + 1
                })
                setCurrentQ(nextRes.data.question)
                setQNum(n => n + 1)
                setEvaluation(null)
            }
        } catch { alert('Error communicating with backend.') }
        setLoading(false)
    }

    // Web Speech API voice input
    const startVoice = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) { alert('Voice not supported in this browser. Use Chrome or Edge.'); return }
        const recognition = new SpeechRecognition()
        recognition.lang = 'en-US'; recognition.continuous = false; recognition.interimResults = false
        recognition.onstart = () => setListening(true)
        recognition.onresult = (e) => { setAnswer(prev => prev + ' ' + e.results[0][0].transcript); setListening(false) }
        recognition.onerror = () => setListening(false)
        recognition.onend = () => setListening(false)
        recognition.start()
        recognitionRef.current = recognition
    }

    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null

    if (phase === 'setup') return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🎤 <span className="gradient-text">AI Mock Interview</span></h1>
                <p className="page-subtitle">Practice with an AI interviewer — text + voice input, real-time evaluation after each answer</p>
            </div>
            <div className="card" style={{ maxWidth: 560 }}>
                <div className="form-group">
                    <label className="form-label">Target Role</label>
                    <select className="form-select" value={config.role} onChange={e => setConfig(c => ({ ...c, role: e.target.value }))}>
                        {ROLES.map(r => <option key={r}>{r}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Experience Level</label>
                    <select className="form-select" value={config.experience_level} onChange={e => setConfig(c => ({ ...c, experience_level: e.target.value }))}>
                        <option>Fresher</option><option>Junior (1-3 yrs)</option><option>Mid-level (3-5 yrs)</option><option>Senior (5+ yrs)</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Interview Type</label>
                    <select className="form-select" value={config.interview_type} onChange={e => setConfig(c => ({ ...c, interview_type: e.target.value }))}>
                        <option>Technical</option><option>Behavioral</option><option>Mixed</option>
                    </select>
                </div>
                <div style={{ padding: '12px 16px', background: 'rgba(62,207,207,0.08)', borderRadius: 10, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                    🎤 <strong>Voice Mode:</strong> Click the mic button to speak your answer (Chrome/Edge only)<br />
                    📝 <strong>Text Mode:</strong> Type your answer in the text box<br />
                    📊 <strong>5 Questions</strong> with real-time AI scoring after each answer
                </div>
                <button className="btn btn-primary" onClick={startInterview} disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                    {loading ? '⏳ Starting...' : '🚀 Start Interview'}
                </button>
            </div>
        </div>
    )

    if (phase === 'report') return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📊 <span className="gradient-text">Interview Report</span></h1>
                <p className="page-subtitle">Your complete performance analysis for {config.role}</p>
            </div>
            <div className="stats-row" style={{ marginBottom: 24 }}>
                <div className="stat-card"><div className="stat-val">{avgScore}/10</div><div className="stat-label">Avg Score</div></div>
                <div className="stat-card"><div className="stat-val">{scores.length}</div><div className="stat-label">Questions Answered</div></div>
                <div className="stat-card"><div className="stat-val" style={{ fontSize: 18 }}>{config.role}</div><div className="stat-label">Role</div></div>
            </div>
            <div className="result-box" style={{ marginBottom: 20 }}>{report}</div>
            <button className="btn btn-primary" onClick={() => { setPhase('setup'); setHistory([]); setScores([]) }}>
                🔄 Start New Interview
            </button>
        </div>
    )

    return (
        <div>
            <div className="page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 className="page-title">🎤 <span className="gradient-text">Mock Interview</span></h1>
                        <p className="page-subtitle">{config.role} · {config.interview_type} · Question {qNum}/5</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {scores.map((s, i) => (
                            <div key={i} style={{
                                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                                background: s >= 7 ? 'rgba(34,197,94,0.2)' : s >= 5 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                                color: s >= 7 ? 'var(--success)' : s >= 5 ? 'var(--warning)' : 'var(--danger)',
                                border: `1px solid ${s >= 7 ? 'rgba(34,197,94,0.4)' : s >= 5 ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)'}`
                            }}>
                                {s}
                            </div>
                        ))}
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{qNum - 1}/5 done</div>
                    </div>
                </div>
                {/* Progress bar */}
                <div className="progress-bar" style={{ marginTop: 12 }}>
                    <div className="progress-fill" style={{ width: `${((qNum - 1) / 5) * 100}%` }} />
                </div>
            </div>

            {/* Current Question */}
            <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(124,111,255,0.3)' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🤖</div>
                    <div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>AI Interviewer · Question {qNum}</div>
                        <div style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-primary)', fontWeight: 500 }}>{currentQ}</div>
                    </div>
                </div>
            </div>

            {/* Previous Q&A */}
            {history.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                    {history.map((h, i) => (
                        <div key={i} style={{ marginBottom: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 13 }}>
                            <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Q{i + 1}: {h.question}</div>
                            <div style={{ color: 'var(--text-secondary)' }}>→ {h.answer}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Evaluation of last answer */}
            {evaluation && (
                <div style={{ marginBottom: 20, padding: 20, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                    <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--success)' }}>✅ AI Evaluation</div>
                    {evaluation}
                </div>
            )}

            {/* Answer Input */}
            {!evaluation && (
                <div className="card">
                    <div className="form-group">
                        <label className="form-label">Your Answer</label>
                        <textarea className="form-textarea" rows={5} placeholder="Type your answer here, or use the mic button to speak..."
                            value={answer} onChange={e => setAnswer(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn btn-primary" onClick={submitAnswer} disabled={loading || !answer.trim()} style={{ flex: 1, justifyContent: 'center' }}>
                            {loading ? '⏳ Evaluating...' : qNum >= 5 ? '✅ Submit Final Answer' : '➡️ Submit Answer'}
                        </button>
                        <button className="btn btn-ghost" onClick={startVoice} disabled={listening}
                            style={{ padding: '12px 20px', borderColor: listening ? 'var(--danger)' : 'var(--border)', color: listening ? 'var(--danger)' : 'var(--text-primary)' }}>
                            {listening ? '🔴 Listening...' : '🎤 Voice'}
                        </button>
                    </div>
                </div>
            )}
            {evaluation && qNum < 5 && (
                <button className="btn btn-primary" onClick={() => setEvaluation(null)} style={{ marginTop: 16 }}>
                    ➡️ Next Question
                </button>
            )}
            <div ref={bottomRef} />
        </div>
    )
}
