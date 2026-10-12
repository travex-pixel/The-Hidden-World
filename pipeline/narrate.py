"""Per-scene narration with Piper TTS, cached by (voice, text) hash."""
from __future__ import annotations
import hashlib, json, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / ".cache" / "narration"
SR = 22050


def _key(voice: str, text: str, length_scale: float, speaker=None) -> str:
    sp = "" if speaker is None else f"|spk{speaker}"
    return hashlib.sha1(f"{voice}|{length_scale}|{text}{sp}".encode()).hexdigest()[:16]


def read_wav(path: Path) -> tuple[np.ndarray, int]:
    with wave.open(str(path)) as w:
        sr = w.getframerate()
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
        if w.getnchannels() == 2:
            data = data.reshape(-1, 2).mean(axis=1)
    return data, sr


def trim_silence(x: np.ndarray, sr: int, thresh: float = 0.01, keep: float = 0.08) -> np.ndarray:
    idx = np.where(np.abs(x) > thresh)[0]
    if len(idx) == 0:
        return x
    a = max(0, idx[0] - int(keep * sr))
    b = min(len(x), idx[-1] + int(keep * sr))
    return x[a:b]


_VOICES = {}


def narrate_scene(voice_name: str, text: str, length_scale: float = 1.0, speaker=None) -> Path:
    CACHE.mkdir(parents=True, exist_ok=True)
    out = CACHE / f"{_key(voice_name, text, length_scale, speaker)}.wav"
    if out.exists():
        return out
    from piper import PiperVoice
    from piper.config import SynthesisConfig
    from pipeline.voices import voice_path
    if voice_name not in _VOICES:
        _VOICES[voice_name] = PiperVoice.load(str(voice_path(voice_name)))
    voice = _VOICES[voice_name]
    cfg = SynthesisConfig(length_scale=length_scale, speaker_id=speaker)
    tmp = out.with_suffix(".tmp.wav")
    with wave.open(str(tmp), "wb") as w:
        voice.synthesize_wav(text, w, syn_config=cfg)
    x, sr = read_wav(tmp)
    x = trim_silence(x, sr)
    peak = float(np.max(np.abs(x))) or 1.0
    x = x / peak * 0.89
    with wave.open(str(out), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
    tmp.unlink(missing_ok=True)
    return out


# ---------------------------------------------------------------- Kokoro (voice engine v2)
# Kokoro-82M (Apache-2.0 weights) via kokoro-onnx: far more natural prosody than Piper medium voices.
# Episodes opt in with "voice_engine": "kokoro"; each character then uses its "voice_kokoro" spec.
# Post-processing is tuned for smooth dialogue: gentle trims with fades (no clipped onsets), loudness-matched
# lines (no level jumps between speakers) and, for characters, a faint shared room so voices sit in one space.
KOKORO_DIR = ROOT / ".cache" / "models"
KSR = 24000
_KOKORO = None


def _kokoro():
    global _KOKORO
    if _KOKORO is None:
        from kokoro_onnx import Kokoro
        model, voices = KOKORO_DIR / "kokoro-v1.0.onnx", KOKORO_DIR / "voices-v1.0.bin"
        if not model.exists() or not voices.exists():
            raise SystemExit("Kokoro models missing: run  bash scripts/setup-kokoro.sh")
        _KOKORO = Kokoro(str(model), str(voices))
    return _KOKORO


def smooth_clip(x: np.ndarray, sr: int, target_db: float = -19.0) -> np.ndarray:
    """Trim leading/trailing silence without eating soft consonants, fade the edges, match loudness."""
    peak = float(np.max(np.abs(x))) or 1.0
    idx = np.where(np.abs(x) > 0.02 * peak)[0]
    if len(idx):
        x = x[max(0, idx[0] - int(0.06 * sr)): min(len(x), idx[-1] + int(0.09 * sr))]
    fi, fo = int(0.008 * sr), int(0.025 * sr)
    x = x.astype(np.float64).copy(); x[:fi] *= np.linspace(0, 1, fi); x[-fo:] *= np.linspace(1, 0, fo)
    fr = int(0.02 * sr); n = len(x) // fr
    frames = np.sqrt((x[: n * fr].reshape(n, fr) ** 2).mean(axis=1)) if n else np.array([np.sqrt((x ** 2).mean())])
    voiced = frames[frames > 0.1 * frames.max()] if frames.max() > 0 else frames
    rms = float(np.sqrt((voiced ** 2).mean())) or 1e-6
    x *= 10 ** (target_db / 20) / rms
    pk = float(np.max(np.abs(x)))
    if pk > 0.89:
        x *= 0.89 / pk
    return x


def room(x: np.ndarray, sr: int, wet_db: float = -20.0) -> np.ndarray:
    """A small, soft room (deterministic synthetic impulse response) so dry TTS lines don't sound pasted on."""
    rng = np.random.default_rng(7)
    n = int(0.32 * sr); t = np.arange(n) / sr
    ir = rng.standard_normal(n) * np.exp(-t / 0.075)
    ir[: int(0.012 * sr)] = 0
    k = np.ones(6) / 6; ir = np.convolve(ir, k, mode="same")          # soften highs
    ir /= np.sqrt((ir ** 2).sum()) or 1
    out = np.zeros(len(x) + n); out[: len(x)] = x
    wet = np.convolve(x, ir)                      # length len(x) + n - 1
    out[: len(wet)] += wet * 10 ** (wet_db / 20)
    return out


def narrate_kokoro(spec: dict, text: str, speed_mult: float = 1.0, roomy: bool = False) -> Path:
    CACHE.mkdir(parents=True, exist_ok=True)
    key = hashlib.sha1(f"kokoro|{spec['id']}|{spec.get('lang','en-gb')}|{spec.get('speed',1.0)}|{spec.get('pitch',1.0)}|{speed_mult}|{roomy}|v2|{text}".encode()).hexdigest()[:16]
    out = CACHE / f"k_{key}.wav"
    if out.exists():
        return out
    pitch = float(spec.get("pitch", 1.0)); speed = float(spec.get("speed", 1.0)) / speed_mult
    a, sr = _kokoro().create(text, voice=spec["id"], speed=speed / pitch, lang=spec.get("lang", "en-gb"))
    a = np.asarray(a, dtype=np.float64)
    if abs(pitch - 1.0) > 1e-3:   # pitch by resampling, duration preserved via the speed compensation above
        n = int(round(len(a) / pitch)); a = np.interp(np.arange(n) * pitch, np.arange(len(a)), a)
    if not np.any(np.abs(a) > 1e-4):
        raise SystemExit(f"Kokoro produced silence for {text!r}")
    a = smooth_clip(a, sr)
    if roomy:
        a = room(a, sr)
    tmp = out.with_suffix(".tmp.wav")
    with wave.open(str(tmp), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(a, -1, 1) * 32767).astype(np.int16).tobytes())
    tmp.replace(out)
    return out


def load_character(cid: str) -> dict:
    import json
    f = ROOT / "characters" / f"{cid}.json"
    if not f.exists():
        raise ValueError(f"unknown character '{cid}' (no characters/{cid}.json)")
    return json.loads(f.read_text())


def lip_envelope(x: np.ndarray, sr: int, fps: int = 30) -> list:
    hop = sr // fps
    n = len(x) // hop
    if n == 0:
        return []
    r = np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(axis=1))
    ref = np.percentile(r, 95) or 1.0
    return [round(float(v), 3) for v in np.clip(r / ref, 0, 1)]


def narrate_dialogue(scene: dict, engine: str = "piper") -> dict:
    """Synthesise each line with its character's voice, join them with pauses into one scene clip,
    and return per-line timing plus a 30 fps mouth-openness envelope for lip sync."""
    parts, lines, t, sr = [], [], 0.0, None
    for ln in scene["lines"]:
        ch = load_character(ln["who"])
        if engine == "kokoro":
            if "voice_kokoro" not in ch:
                raise ValueError(f"characters/{ln['who']}.json has no voice_kokoro spec")
            p = narrate_kokoro(ch["voice_kokoro"], ln["text"], 1.0 / ln.get("speed", 1.0), roomy=ln["who"] != "narrator")
        else:
            v = ch["voice"]
            p = narrate_scene(v["model"], ln["text"], v.get("length_scale", 1.0) * ln.get("speed", 1.0), v.get("speaker"))
        x, sr_ = read_wav(p); sr = sr or sr_
        if ln.get("fx") == "phone":   # small phone speaker: band-limited and slightly crunchy
            X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / sr_)
            X *= ((f > 320) & (f < 3400)).astype(float)
            x = np.tanh(np.fft.irfft(X, n=len(x)) * 2.2) * 0.6
        if sr_ != sr:
            x = np.interp(np.linspace(0, len(x) - 1, int(len(x) * sr / sr_)), np.arange(len(x)), x)
        pre = int(ln.get("pause_before", 0.0) * sr)
        # Kokoro character lines carry a short room tail; it overlaps the following pause instead of lengthening it
        tail = int(0.32 * sr) if engine == "kokoro" and ln["who"] != "narrator" else 0
        dry = len(x) - tail
        if pre:
            parts.append((t, np.zeros(pre, np.float32))); t += pre / sr
        lines.append({"who": ln["who"], "text": ln["text"], "start": round(t, 3), "end": round(t + dry / sr, 3), "env": lip_envelope(x[:dry], sr)})
        parts.append((t, x.astype(np.float32))); t += dry / sr
        gap = int(ln.get("pause_after", 0.3) * sr)
        parts.append((t, np.zeros(gap, np.float32))); t += gap / sr
    if engine == "kokoro":
        body = parts[:-1] if len(parts) > 1 else parts           # drop the trailing pause, as the Piper path does
        clip = np.zeros(max(int(round(at * sr)) + len(seg) for at, seg in body), np.float32)
        for at, seg in body:
            i = int(round(at * sr)); clip[i:i + len(seg)] += seg
    else:
        segs = [seg for _, seg in parts]
        clip = np.concatenate(segs[:-1]) if len(segs) > 1 else segs[0]
    key = hashlib.sha1(repr([engine] + [(l["who"], l["text"]) for l in scene["lines"]] + [ln.get("pause_after", 0.3) for ln in scene["lines"]] + [ln.get("pause_before", 0) for ln in scene["lines"]] + [ln.get("speed", 1.0) for ln in scene["lines"]] + [ln.get("fx", "") for ln in scene["lines"]]).encode()).hexdigest()[:16]
    out = CACHE / f"dlg_{key}.wav"
    with wave.open(str(out), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(clip, -1, 1) * 32767).astype(np.int16).tobytes())
    return {"path": str(out), "duration": round(len(clip) / sr, 3), "lines": lines}


def narrate_episode(ep: dict, length_scale: float = 1.0) -> list[dict]:
    """Returns [{scene_id, path, duration, lines?}] in scene order."""
    res = []
    for s in ep["scenes"]:
        if s.get("silent"):
            out = CACHE / "silence_0.1s.wav"
            CACHE.mkdir(parents=True, exist_ok=True)
            if not out.exists():
                with wave.open(str(out), "wb") as w:
                    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(b"\x00\x00" * int(SR * 0.1))
            res.append({"scene_id": s["id"], "path": str(out), "duration": 0.0, "lines": []})
            continue
        if s.get("lines"):
            d = narrate_dialogue(s, ep.get("voice_engine", "piper"))
            res.append({"scene_id": s["id"], **d})
            continue
        p = narrate_scene(ep["narrator_voice"], s["narration"], length_scale)
        x, sr = read_wav(p)
        res.append({"scene_id": s["id"], "path": str(p), "duration": round(len(x) / sr, 3)})
    return res
