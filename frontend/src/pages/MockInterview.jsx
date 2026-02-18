export default function MockInterview() {
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🎤 <span className="gradient-text">AI Mock Interview</span></h1>
                <p className="page-subtitle">Practice with an AI interviewer — text + voice, real-time evaluation</p>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>🎤</span>
                    <div>
                        <div style={{ fontWeight: 600 }}>VidyaGuide AI Mock Interviewer</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Full interview simulator with voice support and STAR evaluation</div>
                    </div>
                </div>
                <iframe
                    src="/interview/index.html"
                    style={{ width: '100%', height: '85vh', border: 'none', background: '#0a0a0f' }}
                    title="VidyaGuide Mock Interview Simulator"
                />
            </div>
        </div>
    )
}
