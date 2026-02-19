"""
ai_helper.py – Multi-provider AI helper for VidyaGuide AI
Priority order: Gemini → OpenAI → Groq (xAI)
Falls back to the next provider on rate-limit, quota, or invalid-key errors.
"""

import requests as req
from pathlib import Path

# ── Endpoints ──────────────────────────────────────────────────────────────
GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models"
OPENAI_BASE = "https://api.openai.com/v1/chat/completions"
GROK_BASE   = "https://api.groq.com/openai/v1/chat/completions"

GEMINI_MODELS = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
]
OPENAI_MODEL = "gpt-4o-mini"
GROK_MODEL   = "llama-3.1-8b-instant"  # llama3-8b-8192 is decommissioned

# Status codes / error strings that mean "try next provider"
_SKIP_CODES   = {400, 401, 403, 429}
_SKIP_REASONS = {"API_KEY_INVALID", "INVALID_ARGUMENT", "PERMISSION_DENIED"}


# ── Key reader ─────────────────────────────────────────────────────────────
def _read_env() -> dict:
    """Parse backend/.env and return key→value dict (always fresh from disk)."""
    env_path = Path(__file__).parent.parent / ".env"
    keys: dict = {}
    try:
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if "=" in line and not line.startswith("#"):
                k, v = line.split("=", 1)
                keys[k.strip()] = v.strip()
    except Exception:
        pass
    return keys


def _should_fallback(status_code: int, data: dict) -> bool:
    """Return True if we should skip to the next provider."""
    if status_code in _SKIP_CODES:
        return True
    # Check for known skip reasons in the error payload
    reason = data.get("error", {}).get("reason", "")
    status = data.get("error", {}).get("status", "")
    if reason in _SKIP_REASONS or status in _SKIP_REASONS:
        return True
    return False


# ── Provider helpers ────────────────────────────────────────────────────────
def _try_gemini(prompt: str, api_key: str) -> str | None:
    """Try all Gemini models. Returns answer text, or None to fall through."""
    for model in GEMINI_MODELS:
        try:
            url = f"{GEMINI_BASE}/{model}:generateContent?key={api_key}"
            payload = {"contents": [{"parts": [{"text": prompt}]}]}
            r = req.post(url, json=payload, timeout=8)  # fail fast on bad key
            data = r.json()

            if r.status_code == 200:
                return data["candidates"][0]["content"]["parts"][0]["text"]

            if _should_fallback(r.status_code, data):
                # Same key will fail on all models → bail out entirely
                return None

        except Exception:
            pass  # network error → try next provider

    return None  # all models exhausted / skipped


def _try_openai_compat(
    prompt: str,
    api_key: str,
    base_url: str,
    model: str,
    provider_name: str,
) -> str | None:
    """Try an OpenAI-compatible endpoint. Returns answer text, or None to fall through."""
    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
        }
        timeout = 25 if "groq" in base_url else 10
        r = req.post(base_url, headers=headers, json=payload, timeout=timeout)
        data = r.json()

        if r.status_code == 200:
            return data["choices"][0]["message"]["content"]

        if _should_fallback(r.status_code, data):
            return None  # try next provider

        # Unexpected error — surface it
        msg = data.get("error", {}).get("message", str(data))
        return f"AI Error ({provider_name}): {msg}"

    except Exception as e:
        return None  # network issue → try next provider


# ── Public API ──────────────────────────────────────────────────────────────
def ask_gemini(prompt: str) -> str:
    """
    Send a prompt through the AI provider chain:
        Gemini 2.0/1.5 → OpenAI GPT-4o-mini → Groq Llama3
    Returns the first successful response, or a user-friendly error.
    """
    env = _read_env()

    # 1️⃣  Gemini
    gemini_key = env.get("GEMINI_API_KEY", "").strip()
    if gemini_key:
        result = _try_gemini(prompt, gemini_key)
        if result is not None:
            return result

    # 2️⃣  OpenAI
    openai_key = env.get("OPENAI_API_KEY", "").strip()
    if openai_key:
        result = _try_openai_compat(prompt, openai_key, OPENAI_BASE, OPENAI_MODEL, "OpenAI")
        if result is not None:
            return result

    # 3️⃣  Groq (your gsk_ key)
    grok_key = env.get("GROK_API_KEY", "").strip()
    if grok_key:
        result = _try_openai_compat(prompt, grok_key, GROK_BASE, GROK_MODEL, "Groq")
        if result is not None:
            return result

    return (
        "AI Error: All AI providers failed or are rate-limited. "
        "Please check your API keys in backend/.env and try again."
    )
