import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ResumeEvaluator from './pages/ResumeEvaluator'
import CareerGuidance from './pages/CareerGuidance'
import SkillGapAnalyzer from './pages/SkillGapAnalyzer'
import LearningRoadmap from './pages/LearningRoadmap'
import JobMarket from './pages/JobMarket'
import MockInterview from './pages/MockInterview'
import CareerGrowth from './pages/CareerGrowth'
import PeerBenchmark from './pages/PeerBenchmark'
import ResumeMatcher from './pages/ResumeMatcher'

const navItems = [
  { path: '/', label: 'Dashboard', icon: '🏠', section: 'Main' },
  { path: '/resume', label: 'Resume Evaluator', icon: '📄', section: 'AI Agents' },
  { path: '/career', label: 'Career Guidance', icon: '🧭', section: 'AI Agents' },
  { path: '/skills', label: 'Skill Gap Analyzer', icon: '🎯', section: 'AI Agents' },
  { path: '/roadmap', label: 'Learning Roadmap', icon: '🗺️', section: 'AI Agents' },
  { path: '/jobmarket', label: 'Job Market Intel', icon: '📊', section: 'Intelligence' },
  { path: '/interview', label: 'Mock Interview', icon: '🎤', section: 'Intelligence' },
  { path: '/growth', label: 'Career Growth', icon: '📈', section: 'Intelligence' },
  { path: '/benchmark', label: 'Peer Benchmarking', icon: '🏆', section: 'Intelligence' },
  { path: '/matcher', label: 'Resume Matcher', icon: '🔗', section: 'Tools' },
]

function Sidebar() {
  const location = useLocation()
  const sections = [...new Set(navItems.map(i => i.section))]

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">🎓</div>
        <div>
          <div className="brand-name">VidyaGuide</div>
          <div className="brand-sub">AI Career Mentor</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {sections.map(section => (
          <div key={section}>
            <div className="nav-section-label">{section}</div>
            {navItems.filter(i => i.section === section).map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div style={{ marginBottom: 4 }}>⚡ Powered by Gemini AI</div>
        <div>VidyaGuide v1.0 · 2025</div>
      </div>
    </aside>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/resume" element={<ResumeEvaluator />} />
            <Route path="/career" element={<CareerGuidance />} />
            <Route path="/skills" element={<SkillGapAnalyzer />} />
            <Route path="/roadmap" element={<LearningRoadmap />} />
            <Route path="/jobmarket" element={<JobMarket />} />
            <Route path="/interview" element={<MockInterview />} />
            <Route path="/growth" element={<CareerGrowth />} />
            <Route path="/benchmark" element={<PeerBenchmark />} />
            <Route path="/matcher" element={<ResumeMatcher />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
