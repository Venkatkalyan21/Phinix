import { Link } from 'react-router-dom'

const features = [
    { path: '/resume', icon: '📄', title: 'Resume Evaluator', desc: 'AI-powered resume analysis with ATS optimization and improvement tips', badge: 'Resume Agent' },
    { path: '/career', icon: '🧭', title: 'Career Guidance', desc: 'Personalized career path recommendations based on your profile and goals', badge: 'Career Agent' },
    { path: '/skills', icon: '🎯', title: 'Skill Gap Analyzer', desc: 'Identify missing skills for your target role and get a priority learning plan', badge: 'Skill Agent' },
    { path: '/roadmap', icon: '🗺️', title: 'Learning Roadmap', desc: 'Week-by-week personalized learning plan to reach your target role', badge: 'Roadmap Agent' },
    { path: '/jobmarket', icon: '📊', title: 'Job Market Intel', desc: 'Real-time job market trends, salary data, and top hiring companies', badge: 'Market Intel' },
    { path: '/interview', icon: '🎤', title: 'Mock Interview', desc: 'AI-powered mock interview with voice support and detailed evaluation', badge: 'Interview Coach' },
    { path: '/growth', icon: '📈', title: 'Career Growth Prediction', desc: 'ANN-based salary and promotion prediction based on your profile', badge: 'AI Prediction' },
    { path: '/benchmark', icon: '🏆', title: 'Peer Benchmarking', desc: 'Compare your profile against peers and see where you stand', badge: 'Benchmarking' },
    { path: '/matcher', icon: '🔗', title: 'Resume vs JD Matcher', desc: 'Match your resume against any job description and get a fit score', badge: 'ATS Tool' },
]

export default function Dashboard() {
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">
                    Welcome to <span className="gradient-text">VidyaGuide AI</span>
                </h1>
                <p className="page-subtitle">Your AI-powered career planning & resume mentor platform</p>
            </div>

            <div className="stats-row">
                <div className="stat-card"><div className="stat-val">5</div><div className="stat-label">AI Agents</div></div>
                <div className="stat-card"><div className="stat-val">9</div><div className="stat-label">Features</div></div>
                <div className="stat-card"><div className="stat-val">∞</div><div className="stat-label">Career Paths</div></div>
                <div className="stat-card"><div className="stat-val">AI</div><div className="stat-label">Powered by Gemini</div></div>
            </div>

            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)' }}>
                    🤖 AI Agent Suite
                </h2>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
                    {['Resume Agent', 'Career Intelligence Agent', 'Skill Gap Agent', 'Roadmap Planner Agent', 'Interview Coach Agent'].map(a => (
                        <span key={a} className="chip chip-purple">⚡ {a}</span>
                    ))}
                </div>
            </div>

            <div className="feature-grid">
                {features.map(f => (
                    <Link key={f.path} to={f.path} className="feature-card">
                        <div className="feature-icon">{f.icon}</div>
                        <div className="feature-title">{f.title}</div>
                        <div className="feature-desc">{f.desc}</div>
                        <span className="feature-badge">{f.badge}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
