import { useState, useRef } from 'react'
import axios from 'axios'

import API_BASE from '../api.js'
const API = API_BASE + '/api'

export default function ResumeEvaluator() {
    const [resumeText, setResumeText] = useState('')
    const [targetRole, setTargetRole] = useState('')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const [uploadStatus, setUploadStatus] = useState('')
    const fileRef = useRef()

    const evaluate = async () => {
        if (!resumeText.trim()) return
        setLoading(true); setResult('')
        try {
            const { data } = await axios.post(`${API}/resume/evaluate`, { resume_text: resumeText, target_role: targetRole })
            setResult(data.evaluation)
        } catch {
            setResult('❌ Error: Unable to reach the server. Please try again.')
        }
        setLoading(false)
    }

    const handleFile = async (file) => {
        if (!file || !file.name.endsWith('.pdf')) {
            setUploadStatus('❌ Please upload a PDF file.')
            return
        }
        setUploadStatus('⏳ Extracting text from PDF...')
        const formData = new FormData()
        formData.append('file', file)
        formData.append('target_role', targetRole)
        try {
            const { data } = await axios.post(`${API}/resume/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            if (data.error) {
                setUploadStatus(`❌ ${data.error}`)
            } else {
                setResumeText(data.extracted_text?.replace('...', '') || '')
                setUploadStatus(`✅ PDF extracted successfully! ${data.pages || ''} page(s) processed.`)
                if (data.evaluation) setResult(data.evaluation)
            }
        } catch {
            setUploadStatus('❌ Upload failed. Make sure PyMuPDF is installed.')
        }
    }

    const onDrop = (e) => {
        e.preventDefault(); setDragOver(false)
        const file = e.dataTransfer.files[0]
        handleFile(file)
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📄 <span className="gradient-text">Resume Evaluator</span></h1>
                <p className="page-subtitle">AI-powered resume analysis with ATS optimization and actionable feedback</p>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
                <div className="form-group">
                    <label className="form-label">Target Role (optional)</label>
                    <input className="form-input" placeholder="e.g. Full Stack Developer, Data Scientist"
                        value={targetRole} onChange={e => setTargetRole(e.target.value)} />
                </div>

                {/* PDF Upload Zone */}
                <div className="form-group">
                    <label className="form-label">Upload PDF Resume</label>
                    <div
                        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={onDrop}
                        onClick={() => fileRef.current.click()}
                        style={{
                            border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border)'}`,
                            borderRadius: 12, padding: '24px', textAlign: 'center', cursor: 'pointer',
                            background: dragOver ? 'rgba(124,111,255,0.08)' : 'rgba(255,255,255,0.02)',
                            transition: 'all 0.2s ease', marginBottom: 8
                        }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📎</div>
                        <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                            Drag & drop your PDF resume here, or <span style={{ color: 'var(--accent)', fontWeight: 600 }}>click to browse</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>PDF files only</div>
                    </div>
                    <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }}
                        onChange={e => handleFile(e.target.files[0])} />
                    {uploadStatus && (
                        <div style={{
                            fontSize: 13, padding: '8px 12px', borderRadius: 8, marginTop: 8,
                            background: uploadStatus.startsWith('✅') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                            color: uploadStatus.startsWith('✅') ? 'var(--success)' : 'var(--danger)'
                        }}>
                            {uploadStatus}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Or Paste Resume Text *</label>
                    <textarea className="form-textarea" rows={10}
                        placeholder="Paste your complete resume content here..."
                        value={resumeText} onChange={e => setResumeText(e.target.value)} />
                </div>

                <button className="btn btn-primary" onClick={evaluate} disabled={loading || !resumeText.trim()}>
                    {loading ? '⏳ Analyzing...' : '🔍 Evaluate Resume'}
                </button>
            </div>

            {loading && <div className="loading-wrap"><div className="spinner" /><p>AI is analyzing your resume...</p></div>}
            {result && <div className="result-box">{result}</div>}
        </div>
    )
}
