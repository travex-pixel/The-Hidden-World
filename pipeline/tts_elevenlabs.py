"""Optional ElevenLabs Text-to-Speech provider (premium narration).

Off by default: nothing here runs unless an episode's narrator profile says `"provider": "elevenlabs"` or the build is
started with `--tts elevenlabs`. The key is read from the ELEVENLABS_API_KEY environment variable only, is sent only
as the `xi-api-key` request header, and is never logged, stored in a manifest or written to disk.

API (verified 2026-10-12 against the official Python SDK source, elevenlabs/elevenlabs-python, and the API reference):
  POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps?output_format=pcm_22050
  headers: xi-api-key, content-type: application/json
  body:    {"text", "model_id", "voice_settings": {stability, similarity_boost, style, use_speaker_boost, speed}, ...}
  200:     {"audio_base64": <str>, "alignment": {"characters": [...], "character_start_times_seconds": [...],
            "character_end_times_seconds": [...]}, "normalized_alignment": {...}}
  401:     bad key, or {"detail": {"status": "quota_exceeded", ...}} when the account has no credits left
  422:     validation error (bad voice/model id, text too long);  429: {"detail": {"status": "too_many_concurrent_requests"
           | "system_busy"}};  5xx: server error.
`alignment` is per CHARACTER of the text we sent; words are derived here by grouping characters (see words_from_alignment).
pcm_22050 is signed 16-bit little-endian mono at 22050 Hz, the same rate Piper produces, so the mixer needs no resampling.
"""
from __future__ import annotations
import base64, json, os, re, time, urllib.error, urllib.parse, urllib.request
import numpy as np

API_BASE = "https://api.elevenlabs.io"
KEY_ENV = "ELEVENLABS_API_KEY"
DEFAULT_MODEL = "eleven_multilingual_v2"   # 10,000 chars per request; 1 credit per character (verify on your plan)
OUTPUT_FORMAT = "pcm_22050"
SR = 22050
MAX_CHARS = {"eleven_multilingual_v2": 10000, "eleven_flash_v2_5": 40000, "eleven_turbo_v2_5": 40000, "eleven_v3": 5000}
# the same separators pipeline/narrate.map_words uses to count spoken words, so counts and spans always agree
_SEP = re.compile(r"[ \t\n,.:;?!\"'()—…-]+")


class TTSProviderError(RuntimeError):
    """A clearly reported provider failure. `kind` is one of: config, auth, quota, rate_limit, validation, network, api."""

    def __init__(self, kind: str, message: str):
        super().__init__(message); self.kind = kind


def api_key() -> str:
    k = os.environ.get(KEY_ENV, "").strip()
    if not k:
        raise TTSProviderError("config", f"{KEY_ENV} is not set. Export it in your shell (never commit it) or add it as a "
                                         "GitHub Actions secret; see docs/TTS_PROVIDERS.md.")
    return k


def tokens(text: str) -> list[str]:
    """Spoken-word tokens of a text, split on the separator set shared with narrate.map_words."""
    return [t for t in _SEP.split(text) if t]


def words_from_alignment(chars: list[str], starts: list[float], ends: list[float]) -> list[tuple[float, float]]:
    """Group character timings into word spans [(start_s, end_s)]. A word is a run of characters that are not in the
    separator set; punctuation and spaces fall between words. The grouping uses the same separators as tokens(), so
    len(words_from_alignment(...)) == len(tokens(text)) for the text that was sent."""
    out, cur = [], None
    for c, a, b in zip(chars, starts, ends):
        if _SEP.fullmatch(c):
            if cur: out.append(cur); cur = None
        else:
            cur = (a, b) if cur is None else (cur[0], b)
    if cur: out.append(cur)
    return out


def _parse_error(status: int, body: str) -> TTSProviderError:
    detail, st = {}, ""
    try:
        j = json.loads(body); detail = j.get("detail", j) if isinstance(j, dict) else {}
        st = str(detail.get("status", "") if isinstance(detail, dict) else "")
        msg = str(detail.get("message", "") if isinstance(detail, dict) else detail)[:300]
    except Exception:
        msg = body[:300]
    if status in (401, 402) and ("quota" in st or "credit" in msg.lower() or status == 402):
        return TTSProviderError("quota", f"ElevenLabs refused the request: insufficient credits ({st or status}). {msg} "
                                         "Top up or enable usage-based billing, or build with Piper instead.")
    if status == 401:
        return TTSProviderError("auth", f"ElevenLabs rejected the API key (401 {st}). Check {KEY_ENV}.")
    if status == 429:
        return TTSProviderError("rate_limit", f"ElevenLabs rate limit (429 {st}). {msg}")
    if status in (400, 422):
        return TTSProviderError("validation", f"ElevenLabs rejected the request ({status}): {msg}")
    if status >= 500:
        return TTSProviderError("api", f"ElevenLabs server error ({status}). {msg}")
    return TTSProviderError("api", f"ElevenLabs error {status} {st}: {msg}")


def synthesize(text: str, voice_id: str, model_id: str = DEFAULT_MODEL, voice_settings: dict | None = None, *,
               timeout: float = 90.0, retries: int = 3, sleep=time.sleep, extra: dict | None = None) -> dict:
    """One request to the with-timestamps endpoint. Returns {"audio": float32 mono at SR, "sr", "words": [(s, e)],
    "chars": int}. Retries transient failures (timeouts, connection errors, 5xx, 429) with exponential backoff and
    raises TTSProviderError for everything else. Never falls back to another provider."""
    if not voice_id:
        raise TTSProviderError("config", "no ElevenLabs voice_id: set narrator_profile.voice_id or ELEVENLABS_VOICE_ID.")
    limit = MAX_CHARS.get(model_id, 5000)
    if len(text) > limit:
        raise TTSProviderError("validation", f"text is {len(text)} characters; {model_id} accepts at most {limit} per request.")
    key = api_key()
    body = {"text": text, "model_id": model_id}
    if voice_settings: body["voice_settings"] = {k: v for k, v in voice_settings.items() if v is not None}
    if extra: body.update(extra)
    url = f"{API_BASE}/v1/text-to-speech/{urllib.parse.quote(voice_id)}/with-timestamps?output_format={OUTPUT_FORMAT}"
    req = urllib.request.Request(url, data=json.dumps(body).encode(), method="POST",
                                 headers={"xi-api-key": key, "content-type": "application/json", "accept": "application/json"})
    last: TTSProviderError | None = None
    for attempt in range(retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                raw = r.read()
            break
        except urllib.error.HTTPError as e:
            err = _parse_error(e.code, e.read().decode("utf-8", "replace"))
            retry_after = e.headers.get("Retry-After") if e.headers else None
            if err.kind in ("rate_limit", "api") and e.code != 404 and attempt < retries:
                last = err; sleep(float(retry_after) if retry_after and retry_after.isdigit() else 2.0 * 2 ** attempt); continue
            raise err from None
        except (urllib.error.URLError, TimeoutError, OSError) as e:
            last = TTSProviderError("network", f"could not reach {API_BASE}: {getattr(e, 'reason', e)}")
            if attempt < retries:
                sleep(2.0 * 2 ** attempt); continue
            raise last from None
    else:   # pragma: no cover
        raise last or TTSProviderError("api", "unknown failure")
    try:
        j = json.loads(raw)
        pcm = base64.b64decode(j["audio_base64"])
        al = j.get("alignment") or j.get("normalized_alignment") or {}
        chars, st, en = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
    except (KeyError, ValueError, TypeError) as e:
        raise TTSProviderError("api", f"unexpected ElevenLabs response (no audio or alignment): {e}") from None
    audio = np.frombuffer(pcm, dtype="<i2").astype(np.float32) / 32768.0
    return {"audio": audio, "sr": SR, "words": words_from_alignment(chars, st, en), "chars": len(text)}


def estimate(texts: list[str], model_id: str = DEFAULT_MODEL, usd_per_1k: float = 0.30) -> dict:
    """Character and credit estimate for a list of spoken texts. Flash/Turbo models bill 0.5 credits per character,
    the others 1; the dollar figure is `usd_per_1k` per 1,000 characters (an estimate: set it to your plan's rate)."""
    chars = sum(len(t) for t in texts)
    per_char = 0.5 if model_id in ("eleven_flash_v2_5", "eleven_turbo_v2_5") else 1.0
    return {"lines": len(texts), "characters": chars, "credits": int(round(chars * per_char)), "usd_estimate": round(chars / 1000 * usd_per_1k, 3), "model_id": model_id}
