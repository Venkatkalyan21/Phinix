/* ═══════════════════════════════════════════════════════════════
   PHINIX v2 – AI Mock Interviewer | app.js
   Full logic: AI voice, speech-to-text, particle system,
   radar chart, confidence meter, confetti, and more.
═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── UTILS & HELPERS ──────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Sound Effects
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start(); osc.stop(audioCtx.currentTime + 0.15);
    } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.4);
        osc.start(); osc.stop(audioCtx.currentTime + 0.4);
    }
}

document.addEventListener('mouseenter', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') playSound('hover');
}, true);
document.addEventListener('click', () => playSound('click'));

// Toast
function showToast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// ─── PARTICLE SYSTEM ──────────────────────────────────────────
const canvas = $('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? 'rgba(124,111,255,0.3)' : 'rgba(62,207,207,0.3)';
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

for (let i = 0; i < 60; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    // Connect lines
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(255,255,255,${0.1 - dist / 1500})`;
                ctx.stroke();
            }
        });
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ─── QUESTION BANK ──────────────────────────────────────────── (Same bank, condensed)
const QUESTION_BANK = {
    "Frontend Developer": [
        { q: "Differences between CSS Grid and Flexbox?", k: ["grid", "flexbox", "axis", "layout"], d: "Easy" },
        { q: "Explain React's Virtual DOM.", k: ["virtual dom", "diffing", "reconciliation"], d: "Medium" },
        { q: "How to handle state in large apps?", k: ["redux", "context", "state"], d: "Hard" },
        { q: "What is CORS?", k: ["cross-origin", "headers", "security"], d: "Medium" }
    ],
    "Backend Developer": [
        { q: "REST vs GraphQL?", k: ["rest", "graphql", "endpoint", "fetch"], d: "Medium" },
        { q: "Explain ACID properties.", k: ["atomicity", "consistency", "isolation", "durability"], d: "Hard" },
        { q: "How to scale a database?", k: ["sharding", "replication", "indexing"], d: "Hard" },
        { q: "What is a JWT?", k: ["token", "auth", "stateless"], d: "Easy" }
    ],
    "Full Stack Developer": [
        { q: "SSR vs CSR?", k: ["server-side", "client-side", "seo"], d: "Medium" },
        { q: "How does HTTPS work?", k: ["ssl", "tls", "encryption", "handshake"], d: "Hard" },
        { q: "Explain Microservices.", k: ["decoupled", "independently deployable", "services"], d: "Medium" },
        { q: "CI/CD Pipeline steps?", k: ["build", "test", "deploy", "automation"], d: "Medium" }
    ],
    "default": [
        { q: "Tell me about yourself.", k: ["experience", "skills", "background"], d: "Easy" },
        { q: "Start describing your last project.", k: ["project", "role", "tech stack"], d: "Easy" },
        { q: "Greatest technical challenge?", k: ["challenge", "solution", "outcome"], d: "Medium" },
        { q: "Where do you see yourself in 5 years?", k: ["growth", "goals", "career"], d: "Medium" }
    ]
};

const BEHAVIORAL_QS = [
    { q: "Tell me about a conflict you resolved.", k: ["conflict", "resolution", "communication"], d: "Medium", star: true },
    { q: "Describe a time you failed.", k: ["failure", "learning", "growth"], d: "Medium", star: true },
    { q: "How do you handle deadlines?", k: ["priority", "time management", "stress"], d: "Easy", star: true }
];

// ─── STATE ────────────────────────────────────────────────────
let session = {
    role: '', questions: [], idx: 0, results: [], stream: null, timer: null, timeLeft: 120,
    mode: 'text', recognition: null
};

// ─── NAVIGATION ───────────────────────────────────────────────
function showScreen(id) {
    $$('.screen').forEach(s => {
        if (s.id === id) {
            s.classList.add('active', 'slide-in');
            s.classList.remove('slide-out');
        } else if (s.classList.contains('active')) {
            s.classList.add('slide-out');
            setTimeout(() => s.classList.remove('active'), 300);
        }
    });
}

// ─── SETUP ────────────────────────────────────────────────────
$('setup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    session.role = $('target-role').value;
    const qCount = parseInt($('question-count').value);
    session.mode = $('answer-mode').value;

    // Build Questions
    const roleQs = QUESTION_BANK[session.role] || QUESTION_BANK['default'];
    const techQs = roleQs.sort(() => 0.5 - Math.random()).slice(0, Math.ceil(qCount * 0.7));
    const behQs = BEHAVIORAL_QS.sort(() => 0.5 - Math.random()).slice(0, qCount - techQs.length);

    session.questions = [...techQs.map(q => ({ ...q, type: 'Technical' })), ...behQs.map(q => ({ ...q, type: 'Behavioral' }))].sort(() => 0.5 - Math.random());
    session.idx = 0;
    session.results = [];

    // Populate Info
    $('info-role').textContent = session.role;
    $('info-level').textContent = $('experience-level').value;
    $('info-company').textContent = $('company-type').value;
    $('info-mode').textContent = session.mode === 'both' ? 'Hybrid' : session.mode === 'voice' ? 'Voice' : 'Text';

    // Camera
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); // Audio for voice detection
        $('camera-feed').srcObject = stream;
        session.stream = stream;
        $('cam-off-overlay').classList.add('hidden');

        // Emotion Simulation (randomly change emotion badge)
        setInterval(() => {
            const emotions = ['😊 Confident', '😐 Neutral', '🤔 Thinking', '😯 Surprised', '😌 Calm'];
            $('emotion-badge').textContent = emotions[Math.floor(Math.random() * emotions.length)];
        }, 4000);

    } catch (err) {
        console.warn('Camera failed', err);
        $('cam-off-overlay').classList.remove('hidden');
        $('cam-off-overlay').querySelector('.cam-off-text').textContent = 'Camera Blocked';
    }

    // Voice Init
    if (session.mode !== 'text' && 'webkitSpeechRecognition' in window) {
        session.recognition = new webkitSpeechRecognition();
        session.recognition.continuous = true;
        session.recognition.interimResults = true;
        session.recognition.lang = 'en-US';

        session.recognition.onresult = (event) => {
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) final += event.results[i][0].transcript;
            }
            if (final) {
                const input = $('answer-input');
                input.value += (input.value ? ' ' : '') + final;
                input.dispatchEvent(new Event('input')); // Trigger word count
            }
        };

        session.recognition.onstart = () => $('voice-btn').classList.add('recording');
        session.recognition.onend = () => $('voice-btn').classList.remove('recording');
    }

    showScreen('screen-interview');
    startQuestion();
});

// ─── INTERVIEW LOGIC ──────────────────────────────────────────
function startQuestion() {
    const q = session.questions[session.idx];

    // UI Updates
    $('q-counter').textContent = `Q ${session.idx + 1} / ${session.questions.length}`;
    $('progress-fill').style.width = `${((session.idx) / session.questions.length) * 100}%`;
    $('q-number-badge').textContent = `Q${session.idx + 1}`;
    $('q-category').textContent = q.type;
    $('q-topic').textContent = q.k[0] ? q.k[0].toUpperCase() : 'GENERAL';
    $('question-text').textContent = q.q;
    $('q-difficulty-badge').textContent = q.d;
    $('q-difficulty-badge').className = `badge badge-${q.d.toLowerCase()}`;
    $('hint-text').textContent = `Focus on keywords like: ${q.k.join(', ')}. Structure your answer clearly.`;
    $('hint-box').style.display = 'none';

    // Answer Reset
    $('answer-input').value = '';
    $('word-count').textContent = '0 words';
    $('cm-fill').style.width = '0%';
    $('cm-val').textContent = '—';

    // Timer
    session.timeLeft = 120;
    clearInterval(session.timer);
    session.timer = setInterval(() => {
        session.timeLeft--;
        const m = Math.floor(session.timeLeft / 60).toString().padStart(2, '0');
        const s = (session.timeLeft % 60).toString().padStart(2, '0');
        $('timer-display').textContent = `${m}:${s}`;

        // Ring Animation
        const offset = 113.1 - (session.timeLeft / 120) * 113.1;
        $('timer-ring-fill').style.strokeDashoffset = offset;

        if (session.timeLeft <= 0) {
            clearInterval(session.timer);
            submitAnswer();
            showToast('Time\'s up! Auto-submitting...');
        }
    }, 1000);

    // AI Speak
    speak(q.q);
}

// Speaking
function speak(text) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1; u.pitch = 1;
    const avatar = $('ai-avatar');
    const sw = $('soundwave');

    u.onstart = () => {
        avatar.classList.add('speaking');
        sw.classList.add('active');
        $('ai-status').textContent = 'Speaking...';
    };
    u.onend = () => {
        avatar.classList.remove('speaking');
        sw.classList.remove('active');
        $('ai-status').textContent = 'Listening';
    };
    window.speechSynthesis.speak(u);
}

// Input Handling
$('answer-input').addEventListener('input', (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean);
    $('word-count').textContent = `${words.length} words`;

    // Confidence Meter Logic (Simple heuristic: speed + length)
    const conf = Math.min(100, Math.round(words.length * 1.5));
    $('cm-fill').style.width = `${conf}%`;
    $('cm-val').textContent = conf > 80 ? 'High' : conf > 40 ? 'Medium' : 'Low';
});

// Hint
$('hint-btn').addEventListener('click', () => {
    $('hint-box').style.display = 'flex';
});

// Replay
$('replay-btn').addEventListener('click', () => {
    speak(session.questions[session.idx].q);
});

// Voice Input Toggle
$('voice-btn').addEventListener('click', () => {
    if (!session.recognition) {
        showToast('Voice input not supported in this browser.');
        return;
    }
    if ($('voice-btn').classList.contains('recording')) {
        session.recognition.stop();
    } else {
        session.recognition.start();
    }
});

// Submit
$('submit-answer-btn').addEventListener('click', submitAnswer);
$('skip-btn').addEventListener('click', () => {
    $('answer-input').value = '[Skipped]';
    submitAnswer();
});

function submitAnswer() {
    clearInterval(session.timer);
    window.speechSynthesis.cancel();
    if (session.recognition) session.recognition.stop();

    const answer = $('answer-input').value.trim() || '[No Answer]';
    const q = session.questions[session.idx];

    const evalResult = evaluate(q, answer);
    session.results.push({ q, a: answer, res: evalResult });

    showEvaluation(q, answer, evalResult);
    showScreen('screen-evaluation');
}

// ─── EVALUATION LOGIC ───────────────────────────────────────── (Simplified for brevity)
function evaluate(q, ans) {
    const lower = ans.toLowerCase();
    const totalWords = ans.split(/\s+/).length;

    // Scoring
    let tech = 0;
    q.k.forEach(k => { if (lower.includes(k.toLowerCase())) tech += 2.5; });
    tech = Math.min(10, Math.max(2, tech + (totalWords > 20 ? 1 : 0))); // Floor of 2

    let clarity = totalWords > 100 ? 9 : totalWords > 50 ? 7 : totalWords > 20 ? 5 : 3;
    let ps = (lower.includes('because') || lower.includes('step')) ? 8 : 5;
    let conf = (lower.includes('definitely') || lower.includes('confident')) ? 9 : 6;

    // Fillers
    const fillers = ['um', 'uh', 'like'].filter(f => lower.includes(f));

    // Feedback
    const feedback = [];
    if (tech < 5) feedback.push(`Missed keywords: ${q.k.join(', ')}`);
    else feedback.push('Good usage of technical terms.');
    if (clarity < 6) feedback.push('Try to elaborate more.');

    return {
        tech, clarity, ps, conf,
        overall: Math.round((tech + clarity + ps + conf) * 2.5),
        fillers,
        feedback,
        suggestions: ['Use STAR method', 'Be more concise', 'Practice tone'],
        stronger: `A strong answer would address ${q.k[0]} directly with an example from your project.`
    };
}

function showEvaluation(q, ans, res) {
    $('eval-question-text').textContent = q.q;
    $('eval-answer-preview').textContent = ans.substring(0, 100) + (ans.length > 100 ? '...' : '');
    $('overall-score-num').textContent = res.overall;

    setTimeout(() => {
        $('score-tech-fill').style.width = `${res.tech * 10}%`; $('score-tech').textContent = res.tech;
        $('score-clarity-fill').style.width = `${res.clarity * 10}%`; $('score-clarity').textContent = res.clarity;
        $('score-ps-fill').style.width = `${res.ps * 10}%`; $('score-ps').textContent = res.ps;
        $('score-conf-fill').style.width = `${res.conf * 10}%`; $('score-conf').textContent = res.conf;
    }, 100);

    $('feedback-list').innerHTML = res.feedback.map(f => `<li>${f}</li>`).join('');
    $('stronger-answer').textContent = res.stronger;

    if (q.star) $('star-panel').style.display = 'block';
    else $('star-panel').style.display = 'none';

    // Next Button State
    const isLast = session.idx === session.questions.length - 1;
    $('next-btn-label').textContent = isLast ? 'Finish Interview' : 'Next Question';

    speak(`You scored ${res.overall}. ${res.feedback[0]}`);
}

$('next-question-btn').addEventListener('click', () => {
    if (session.idx < session.questions.length - 1) {
        session.idx++;
        showScreen('screen-interview');
        startQuestion();
    } else {
        showSummary();
        showScreen('screen-summary');
    }
});

// ─── SUMMARY ──────────────────────────────────────────────────
function showSummary() {
    if (session.stream) session.stream.getTracks().forEach(t => t.stop());

    const avg = (p) => Math.round(session.results.reduce((a, b) => a + b.res[p], 0) / session.results.length);
    const totalAvg = Math.round(session.results.reduce((a, b) => a + b.res.overall, 0) / session.results.length);

    // Ring
    const offset = 427.3 - (totalAvg / 100) * 427.3;
    setTimeout(() => $('ring-prog').style.strokeDashoffset = offset, 500);
    $('ring-score').textContent = totalAvg;

    // Grade
    let grade = totalAvg >= 90 ? 'A+' : totalAvg >= 80 ? 'A' : totalAvg >= 70 ? 'B' : 'C';
    $('grade-pill').textContent = `Grade: ${grade}`;
    $('grade-msg').textContent = totalAvg > 70 ? 'Excellent work! You are ready.' : 'Keep practicing.';

    // Stats
    $('gs-questions').textContent = session.results.length;
    $('gs-time').textContent = '12m'; // Dummy
    $('gs-best').textContent = Math.max(...session.results.map(r => r.res.overall));

    // Dims
    $('avg-tech').textContent = avg('tech'); $('avg-tech-fill').style.width = `${avg('tech') * 10}%`;
    $('avg-clarity').textContent = avg('clarity'); $('avg-clarity-fill').style.width = `${avg('clarity') * 10}%`;
    $('avg-ps').textContent = avg('ps'); $('avg-ps-fill').style.width = `${avg('ps') * 10}%`;
    $('avg-conf').textContent = avg('conf'); $('avg-conf-fill').style.width = `${avg('conf') * 10}%`;

    // Breakdown
    $('breakdown-list').innerHTML = session.results.map((r, i) => `
    <div class="breakdown-item">
      <div class="breakdown-q-text">Q${i + 1}: ${r.q.q}</div>
      <div class="breakdown-chips">
        <span class="b-chip highlight">Score: ${r.res.overall}</span>
        <span class="b-chip">Tech: ${r.res.tech}/10</span>
      </div>
    </div>
  `).join('');

    // Chart.js Radar
    createRadarChart(avg('tech'), avg('clarity'), avg('ps'), avg('conf'));

    // Confetti
    fireConfetti();
    playSound('success');
    speak('Congratulations! Interview complete.');
}

// Radar Chart (Simple Canvas Implementation since no CDN allowed)
function createRadarChart(t, c, p, co) {
    const cvs = $('radar-canvas');
    const ctx = cvs.getContext('2d');
    const w = cvs.width, h = cvs.height, cx = w / 2, cy = h / 2, r = 100;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
        const a = (Math.PI * 2 * i) / 4 - Math.PI / 2;
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    ctx.closePath(); ctx.stroke();

    // Data
    ctx.fillStyle = 'rgba(124,111,255,0.4)';
    ctx.strokeStyle = '#7C6FFF';
    ctx.beginPath();
    const vals = [t, c, p, co];
    for (let i = 0; i < 4; i++) {
        const a = (Math.PI * 2 * i) / 4 - Math.PI / 2;
        // Normalized 0-10
        const valR = (vals[i] / 10) * r;
        ctx.lineTo(cx + Math.cos(a) * valR, cy + Math.sin(a) * valR);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
}

// Confetti Config
function fireConfetti() {
    const colors = ['#7C6FFF', '#3ECFCF', '#FF6B9D', '#FBBF24'];
    for (let i = 0; i < 100; i++) {
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.width = '8px'; el.style.height = '8px';
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.top = '-10px';
        el.style.animation = `fall ${Math.random() * 2 + 1}s linear forwards`;
        $('confetti-wrap').appendChild(el);
    }
    // Add CSS animation dynamically
    const style = document.createElement('style');
    style.innerHTML = `@keyframes fall { to { transform: translateY(100vh) rotate(720deg); } }`;
    document.head.appendChild(style);
}

// Restart
$('restart-btn').addEventListener('click', () => {
    location.reload();
});

// Download
$('download-report-btn').addEventListener('click', () => {
    const txt = `VIDYAGUIDE REPORT\nRole: ${session.role}\nScore: ${$('ring-score').textContent}/100\n\n` +
        session.results.map((r, i) => `Q${i + 1}: ${r.q.q}\nAns: ${r.a}\nScore: ${r.res.overall}\n`).join('\n');
    const blob = new Blob([txt], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'vidyaguide_report.txt';
    a.click();
});
