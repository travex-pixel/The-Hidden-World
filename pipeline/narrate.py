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


def narrate_dialogue(scene: dict) -> dict:
    """Synthesise each line with its character's voice, join them with pauses into one scene clip,
    and return per-line timing plus a 30 fps mouth-openness envelope for lip sync."""
    parts, lines, t, sr = [], [], 0.0, None
    for ln in scene["lines"]:
        ch = load_character(ln["who"])
        v = ch["voice"]
        p = narrate_scene(v["model"], ln["text"], v.get("length_scale", 1.0) * ln.get("speed", 1.0), v.get("speaker"))
        x, sr_ = read_wav(p); sr = sr or sr_
        if sr_ != sr:
            x = np.interp(np.linspace(0, len(x) - 1, int(len(x) * sr / sr_)), np.arange(len(x)), x)
        pre = int(ln.get("pause_before", 0.0) * sr)
        if pre:
            parts.append(np.zeros(pre, np.float32)); t += pre / sr
        lines.append({"who": ln["who"], "text": ln["text"], "start": round(t, 3), "end": round(t + len(x) / sr, 3), "env": lip_envelope(x, sr)})
        parts.append(x.astype(np.float32)); t += len(x) / sr
        gap = int(ln.get("pause_after", 0.3) * sr)
        parts.append(np.zeros(gap, np.float32)); t += gap / sr
    clip = np.concatenate(parts[:-1]) if len(parts) > 1 else parts[0]
    key = hashlib.sha1(repr([(l["who"], l["text"]) for l in scene["lines"]] + [ln.get("pause_after", 0.3) for ln in scene["lines"]] + [ln.get("pause_before", 0) for ln in scene["lines"]] + [ln.get("speed", 1.0) for ln in scene["lines"]]).encode()).hexdigest()[:16]
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
            d = narrate_dialogue(s)
            res.append({"scene_id": s["id"], **d})
            continue
        p = narrate_scene(ep["narrator_voice"], s["narration"], length_scale)
        x, sr = read_wav(p)
        res.append({"scene_id": s["id"], "path": str(p), "duration": round(len(x) / sr, 3)})
    return res
