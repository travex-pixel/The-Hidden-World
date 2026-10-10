"""Per-scene narration with Piper TTS, cached by (voice, text) hash."""
from __future__ import annotations
import hashlib, json, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / ".cache" / "narration"
SR = 22050


def _key(voice: str, text: str, length_scale: float, speaker: int | None = None) -> str:
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


def narrate_scene(voice_name: str, text: str, length_scale: float = 1.0, speaker: int | None = None) -> Path:
    CACHE.mkdir(parents=True, exist_ok=True)
    out = CACHE / f"{_key(voice_name, text, length_scale, speaker)}.wav"
    if out.exists():
        return out
    from piper import PiperVoice
    from piper.config import SynthesisConfig
    from pipeline.voices import voice_path
    voice = PiperVoice.load(str(voice_path(voice_name)))
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


def mouth_envelope(x: np.ndarray, sr: int, fps: int = 30) -> list[float]:
    """Per-frame mouth openness 0..1 from speech loudness (drives lip sync in the renderer)."""
    hop = sr // fps
    n = max(1, len(x) // hop)
    rms = np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1)) if len(x) >= hop else np.zeros(1)
    ref = float(np.percentile(rms, 90)) or 1.0
    return [round(float(v), 2) for v in np.clip(rms / ref, 0, 1)]


def narrate_dialogue(ep: dict, scene: dict, length_scale: float) -> dict:
    """Scene with spoken `lines` (cast voices). Lines are synthesised separately, then laid end to end with
    their `pause` gaps into one scene clip. Returns timings relative to the clip start."""
    cast = ep.get("cast", {})
    parts, lines, t = [], [], 0.0
    for ln in scene["lines"]:
        who = cast.get(ln["who"], {})
        voice = who.get("voice", ep["narrator_voice"])
        speed = float(ln.get("speed", who.get("speed", 1.0)))
        p = narrate_scene(voice, ln["text"], round(length_scale / speed, 3), who.get("speaker"))
        x, sr = read_wav(p)
        x = x * float(who.get("gain", 1.0))
        gap = float(ln.get("pause", 0.0))
        if gap > 0:
            parts.append(np.zeros(int(gap * sr), np.float32)); t += gap
        parts.append(x)
        d = len(x) / sr
        lines.append({"who": ln["who"], "text": ln["text"], "caption": ln.get("caption", ln["text"]), "start": round(t, 3), "end": round(t + d, 3),
                      "mouth": mouth_envelope(x, sr)})
        t += d
    if not parts:
        return {"scene_id": scene["id"], "path": None, "duration": 0.0, "lines": []}
    x = np.concatenate(parts)
    out = CACHE / f"scene_{_key('dialogue', json.dumps([[l['who'], l['text']] for l in lines]) + str([l['start'] for l in lines]), length_scale)}.wav"
    with wave.open(str(out), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
    return {"scene_id": scene["id"], "path": str(out), "duration": round(len(x) / SR, 3), "lines": lines}


def narrate_episode(ep: dict, length_scale: float = 1.0) -> list[dict]:
    """Returns [{scene_id, path, duration[, lines]}] in scene order. path is None for silent scenes."""
    res = []
    for s in ep["scenes"]:
        if "lines" in s:
            res.append(narrate_dialogue(ep, s, length_scale)); continue
        p = narrate_scene(ep["narrator_voice"], s["narration"], length_scale)
        x, sr = read_wav(p)
        res.append({"scene_id": s["id"], "path": str(p), "duration": round(len(x) / sr, 3)})
    return res
