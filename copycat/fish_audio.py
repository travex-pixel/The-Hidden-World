"""Zero-dependency Fish Audio REST client (requests only).

    FISH_API_KEY=... [FISH_MODEL=s2.1-pro-free] python -m copycat.fish_audio "line of text" [reference_id]

POST https://api.fish.audio/v1/tts  ->  MP3 bytes.  Content-addressed cache in assets/cache/fish-audio/.
Never logs the key.  Missing key => `available()` is False and the pipeline falls back to local Piper.
"""
from __future__ import annotations
import hashlib, json, os, random, re, subprocess, sys, threading, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE_DIR = ROOT / "assets" / "cache" / "fish-audio"
API = "https://api.fish.audio"
FREE_MODEL = "s2.1-pro-free"
MISSING_KEY_NOTICE = "Add FISH_API_KEY=<your key> to .env to enable Fish Audio"
BACKOFF_S = [1.5, 3.0, 6.0, 12.0, 24.0]
MAX_RETRIES = 5
MIN_CLIP_S = 0.2
# Fields of the request body, in the order the client spec lists them. `DROP_FIELDS` is filled at runtime if the
# live API rejects one (see _post).
DROP_FIELDS: set[str] = set()
_log = lambda *a: print(*a, file=sys.stderr, flush=True)


# ----------------------------------------------------------------------------- env / config

def _read_dotenv() -> dict:
    p = ROOT / ".env"
    out = {}
    if p.exists():
        for ln in p.read_text().splitlines():
            m = re.match(r"\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$", ln)
            if m and not ln.lstrip().startswith("#"):
                out[m.group(1)] = m.group(2).strip().strip("'\"")
    return out


def env(name: str, default: str | None = None) -> str | None:
    return os.environ.get(name) or _read_dotenv().get(name) or default


def api_key() -> str | None:
    return env("FISH_API_KEY")


_notice_done = False


def available(announce: bool = True) -> bool:
    global _notice_done
    if api_key():
        return True
    if announce and not _notice_done:
        _log(MISSING_KEY_NOTICE)
        _notice_done = True
    return False


def model_name() -> str:
    return env("FISH_MODEL", FREE_MODEL) or FREE_MODEL


def is_free(model: str) -> bool:
    return model.endswith("-free")


def concurrency_for(model: str) -> int:
    return 2 if is_free(model) else 4


def backoff_delay(attempt: int, jitter: bool = True, rnd=random.random) -> float:
    """attempt 0.. -> 1.5, 3, 6, 12, 24 s (+ up to 25 % jitter)."""
    base = BACKOFF_S[min(attempt, len(BACKOFF_S) - 1)]
    return base * (1 + 0.25 * rnd()) if jitter else base


# ----------------------------------------------------------------------------- cache key / validation helpers

def cache_key(model: str, reference_id: str, spoken_text: str, speed: float, temperature: float) -> str:
    blob = f"{model}{reference_id}{spoken_text}{speed}{temperature}"
    return hashlib.sha256(blob.encode("utf-8")).hexdigest()


def cache_path(beat_id: str, key: str) -> Path:
    return CACHE_DIR / f"{beat_id}_{key[:12]}.mp3"


def ffprobe_duration(path: Path) -> float:
    try:
        p = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(path)],
                           capture_output=True, text=True, timeout=30)
        return float(p.stdout.strip())
    except Exception:
        return 0.0


def strip_cues(text: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"\[[^\]]*\]", " ", text)).strip()


def audio_levels(path: Path) -> tuple[float, float]:
    """(mean_volume_db, max_volume_db) via ffmpeg volumedetect."""
    p = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "volumedetect", "-f", "null", "-"],
                       capture_output=True, text=True, timeout=60)
    m1 = re.search(r"mean_volume:\s*(-?[\d.]+|-inf)", p.stderr)
    m2 = re.search(r"max_volume:\s*(-?[\d.]+|-inf)", p.stderr)
    f = lambda m: -99.0 if not m or m.group(1) == "-inf" else float(m.group(1))
    return f(m1), f(m2)


def validate_clip(path: Path, spoken_text: str) -> list[str]:
    """Problems found (empty list = OK)."""
    probs = []
    dur = ffprobe_duration(path)
    if dur <= MIN_CLIP_S:
        return [f"too_short({dur:.2f}s)"]
    chars = len(strip_cues(spoken_text))
    if chars >= 12:
        cps = chars / dur
        if cps < 9 * 0.8 or cps > 24 * 1.15:     # 9-24 chars/s with a small tolerance for pauses in short lines
            probs.append(f"chars_per_sec({cps:.1f})")
    mean_db, max_db = audio_levels(path)
    if mean_db < -50:
        probs.append(f"near_silent({mean_db:.0f}dB)")
    if max_db >= -0.05:
        probs.append(f"clipping({max_db:.2f}dB)")
    return probs


# ----------------------------------------------------------------------------- client

class Stats:
    def __init__(self):
        self.lock = threading.Lock()
        self.reset()

    def reset(self):
        self.api_calls = self.cache_hits = self.retries = self.n429 = self.n5xx = 0
        self.bytes_sent = 0
        self.voice_lines: dict[str, int] = {}
        self.flagged: list[dict] = []
        self.model_used: str | None = None
        self.fallbacks: list[str] = []

    def add(self, **kw):
        with self.lock:
            for k, v in kw.items():
                setattr(self, k, getattr(self, k) + v)

    def as_dict(self) -> dict:
        return {"api_calls": self.api_calls, "cache_hits": self.cache_hits, "retries": self.retries, "http_429": self.n429,
                "http_5xx": self.n5xx, "utf8_bytes_sent": self.bytes_sent, "per_voice_lines": dict(self.voice_lines),
                "model_used": self.model_used, "fallbacks": list(self.fallbacks), "flagged": list(self.flagged)}


STATS = Stats()


class FishError(RuntimeError):
    def __init__(self, status: int, msg: str):
        super().__init__(f"Fish API {status}: {msg}")
        self.status = status
        self.msg = msg


class FishClient:
    def __init__(self, model: str | None = None, session=None, sleep=time.sleep, stats: Stats | None = None, cache_dir: Path | None = None):
        import requests
        self.model = model or model_name()
        self.session = session or requests.Session()
        self.sleep = sleep
        self.stats = stats or STATS
        self.cache_dir = Path(cache_dir) if cache_dir else CACHE_DIR
        self.sem = threading.Semaphore(concurrency_for(self.model))
        self.stats.model_used = self.model

    # -- request
    def body(self, text: str, reference_id: str, speed: float, temperature: float) -> dict:
        b = {"text": text, "reference_id": reference_id, "format": "mp3", "mp3_bitrate": 192, "sample_rate": 44100,
             "latency": "normal", "temperature": temperature, "top_p": 0.7, "repetition_penalty": 1.2, "normalize": True,
             "language": "en", "prosody": {"speed": speed, "volume": 0}}
        return {k: v for k, v in b.items() if k not in DROP_FIELDS}

    def _post(self, body: dict) -> bytes:
        headers = {"Authorization": f"Bearer {api_key()}", "Content-Type": "application/json", "model": self.model}
        attempt = 0
        while True:
            with self.sem:
                self.stats.add(api_calls=1, bytes_sent=len(body["text"].encode("utf-8")))
                r = self.session.post(f"{API}/v1/tts", json=body, headers=headers, timeout=180)
            st = r.status_code
            if st == 200 and r.content:
                return r.content
            if st == 429 or st >= 500:
                self.stats.add(**{"n429" if st == 429 else "n5xx": 1})
                if attempt >= MAX_RETRIES:
                    raise FishError(st, "retries exhausted")
                self.stats.add(retries=1)
                self.sleep(backoff_delay(attempt))
                attempt += 1
                continue
            raise FishError(st, (r.text or "")[:300])

    def tts_bytes(self, body: dict) -> bytes:
        try:
            return self._post(body)
        except FishError as e:
            if e.status == 402 and not is_free(self.model):
                _log(f"Fish model {self.model!r} needs paid credit (402); falling back to {FREE_MODEL!r}")
                self.stats.fallbacks.append(f"402:{self.model}->{FREE_MODEL}")
                self.model = FREE_MODEL
                self.sem = threading.Semaphore(concurrency_for(self.model))
                self.stats.model_used = self.model
                return self._post(body)
            raise

    # -- cached synthesis
    def synth(self, beat_id: str, spoken_text: str, reference_id: str, speed: float = 1.0, temperature: float = 0.7,
              voice_label: str | None = None, use_cache: bool = True) -> Path:
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        key = cache_key(self.model, reference_id, spoken_text, speed, temperature)
        path = self.cache_dir / f"{beat_id}_{key[:12]}.mp3"
        label = voice_label or reference_id
        with self.stats.lock:
            self.stats.voice_lines[label] = self.stats.voice_lines.get(label, 0) + 1
        if use_cache and path.exists() and ffprobe_duration(path) > MIN_CLIP_S:
            self.stats.add(cache_hits=1)
            return path
        temp = temperature
        for attempt in (0, 1):
            path.write_bytes(self.tts_bytes(self.body(spoken_text, reference_id, speed, temp)))
            probs = validate_clip(path, spoken_text)
            if not probs:
                return path
            if attempt == 0:
                temp = round(max(0.1, temp - 0.1), 2)
        with self.stats.lock:
            self.stats.flagged.append({"beat": beat_id, "voice": label, "problems": probs, "file": path.name})
        return path


def decode_pcm(path: Path, sr: int = 48000, filt: str | None = None):
    """MP3 -> mono float32 numpy at `sr` through ffmpeg, optional ffmpeg audio filter chain."""
    import numpy as np
    cmd = ["ffmpeg", "-v", "error", "-i", str(path)] + (["-af", filt] if filt else []) + ["-f", "f32le", "-ac", "1", "-ar", str(sr), "-"]
    p = subprocess.run(cmd, capture_output=True, timeout=120)
    if p.returncode != 0:
        raise RuntimeError("ffmpeg decode failed: " + p.stderr.decode(errors="replace")[-300:])
    return np.frombuffer(p.stdout, np.float32).copy()


# ----------------------------------------------------------------------------- CLI probe

def main(argv=None):
    argv = argv if argv is not None else sys.argv[1:]
    if not available():
        return 0
    text = argv[0] if argv else "The wind comes down off the hill, and nobody thinks about it twice."
    ref = argv[1] if len(argv) > 1 else "933563" + "0" * 0
    c = FishClient()
    try:
        p = c.synth("probe", text, ref)
        print(p, round(ffprobe_duration(p), 2), "s", json.dumps(STATS.as_dict()))
    except FishError as e:
        print(e)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
