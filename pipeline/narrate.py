"""Per-scene narration with Piper TTS, cached by (voice, text) hash."""
from __future__ import annotations
import hashlib, json, re, wave
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


def split_sentences(text: str) -> list[str]:
    parts = [p.strip() for p in re.split(r"(?<=[.!?])\s+(?=[A-Z'\"(.])", text.strip()) if p.strip()]
    return parts or [text]


def tts_text(ep: dict, text: str) -> str:
    """Pronunciation respellings for the synthesiser only (captions keep the written form)."""
    for word, spoken in (ep.get("pronounce") or {}).items():
        text = re.sub(rf"\b{re.escape(word)}\b", spoken, text)
    return text


def room(x: np.ndarray, sr: int, wet_db: float = -17.0, seed: int = 7) -> np.ndarray:
    """A small, dark room around an on-screen speaker (early reflections + a 0.35 s tail), so a character sounds
    like they are in the scene while the narrator stays dry and close."""
    rng = np.random.default_rng(seed); n = int(0.35 * sr); t = np.arange(n) / sr
    ir = rng.standard_normal(n).astype(np.float32) * np.exp(-t / 0.07)
    k = 12; ir = np.convolve(ir, np.ones(k) / k, mode="same")          # darker tail
    for d_ms, g in ((7, 0.5), (13, 0.38), (21, 0.27), (29, 0.2)):        # early reflections
        ir[int(d_ms / 1000 * sr)] += g
    ir /= np.sqrt((ir ** 2).sum()) or 1.0
    wet = np.convolve(x, ir)
    y = np.concatenate([x, np.zeros(len(wet) - len(x), np.float32)])
    return (y + wet * 10 ** (wet_db / 20)).astype(np.float32)[: len(x) + int(0.12 * sr)]


def _kokoro_line(ep: dict, ln: dict, ch: dict) -> tuple[np.ndarray, int, float, float]:
    """One line in the character's Kokoro voice: each sentence synthesised separately and joined with pauses set
    by the line's tone ('?' breathes longer). Returns (audio, sr, pause before, pause after)."""
    from pipeline import kokoro as K
    kv = ch.get("kokoro") or {}
    if not kv.get("voice"):
        raise ValueError(f"character {ch.get('id')!r} has no 'kokoro' voice for an episode with voice_engine=kokoro")
    narrator = ln["who"].startswith("narrator")
    d = dict(K.DELIVERY[ln.get("tone", "confident")])
    ps = float(ep.get("kokoro_pause_scale", 1.0))   # tighter (<1) or looser (>1) breathing for the whole episode
    for k_ in ("gap", "pre", "after"):
        d[k_] *= ps
    speed = float(ep.get("kokoro_speed", 1.0)) * float(kv.get("speed", 1.0)) * d["speed"] * float(ln.get("speed", 1.0))
    sents = split_sentences(ln["text"]); clips, sr = [], 24000
    for k, sent in enumerate(sents):
        x, sr = K.read_wav(K.say(tts_text(ep, sent), kv["voice"], round(speed, 3)))
        if k:
            gap = d["gap"] + (0.12 if sents[k - 1].rstrip().endswith("?") else 0.0) + K.jitter(sent, 0.05)
            clips.append(np.zeros(int(gap * sr), np.float32))
        clips.append(x)
    x = np.concatenate(clips)
    if not narrator and ep.get("dialogue_room", True):
        x = room(x, sr)
    pre = float(ln.get("pause_before", d["pre"])) * (ps if "pause_before" in ln else 1.0)
    after = float(ln.get("pause_after", d["after"] + K.jitter(ln["text"] + "|after", 0.06)))
    return x, sr, pre, after


def lip_round(x: np.ndarray, sr: int, fps: int = 30) -> list:
    """Per-frame vowel roundness for mouth shapes: a low spectral centroid in the speech band (oo, oh, aw) reads
    as a rounded mouth, a high one (ee, s) as a wide one. Normalised within the line; 0 in silence."""
    hop = sr // fps; n = len(x) // hop
    if n == 0:
        return []
    win = np.hanning(2 * hop); f = np.fft.rfftfreq(2 * hop, 1 / sr); band = (f > 250) & (f < 3500)
    xp = np.concatenate([x, np.zeros(2 * hop, np.float32)]); cen, rms = [], []
    for i in range(n):
        fr = xp[i * hop: i * hop + 2 * hop] * win; S = np.abs(np.fft.rfft(fr))[band]
        cen.append(float((S * f[band]).sum() / (S.sum() + 1e-9))); rms.append(float(np.sqrt((fr ** 2).mean())))
    cen, rms = np.array(cen), np.array(rms); voiced = rms > 0.25 * (np.percentile(rms, 90) or 1)
    if voiced.sum() < 3:
        return [0.0] * n
    lo, hi = np.percentile(cen[voiced], 10), np.percentile(cen[voiced], 90)
    r = np.clip((hi - cen) / max(1.0, hi - lo), 0, 1) * voiced
    return [round(float(v), 2) for v in r]


def narrate_dialogue(scene: dict, ep: dict | None = None) -> dict:
    """Synthesise each line with its character's voice, join them with pauses into one scene clip,
    and return per-line timing plus a 30 fps mouth-openness envelope for lip sync."""
    ep = ep or {}
    if ep.get("voice_engine") == "kokoro":
        return _narrate_dialogue_kokoro(scene, ep)
    parts, lines, t, sr = [], [], 0.0, None
    for ln in scene["lines"]:
        ch = load_character(ln["who"])
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
        if pre:
            parts.append(np.zeros(pre, np.float32)); t += pre / sr
        lines.append({"who": ln["who"], "text": ln["text"], "start": round(t, 3), "end": round(t + len(x) / sr, 3), "env": lip_envelope(x, sr)})
        parts.append(x.astype(np.float32)); t += len(x) / sr
        gap = int(ln.get("pause_after", 0.3) * sr)
        parts.append(np.zeros(gap, np.float32)); t += gap / sr
    clip = np.concatenate(parts[:-1]) if len(parts) > 1 else parts[0]
    key = hashlib.sha1(repr([(l["who"], l["text"]) for l in scene["lines"]] + [ln.get("pause_after", 0.3) for ln in scene["lines"]] + [ln.get("pause_before", 0) for ln in scene["lines"]] + [ln.get("speed", 1.0) for ln in scene["lines"]] + [ln.get("fx", "") for ln in scene["lines"]]).encode()).hexdigest()[:16]
    out = CACHE / f"dlg_{key}.wav"
    with wave.open(str(out), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(clip, -1, 1) * 32767).astype(np.int16).tobytes())
    return {"path": str(out), "duration": round(len(clip) / sr, 3), "lines": lines}


def _narrate_dialogue_kokoro(scene: dict, ep: dict) -> dict:
    parts, lines, t, sr = [], [], 0.0, 24000
    for i, ln in enumerate(scene["lines"]):
        x, sr, pre, after = _kokoro_line(ep, ln, load_character(ln["who"]))
        if pre:
            parts.append(np.zeros(int(pre * sr), np.float32)); t += int(pre * sr) / sr
        lines.append({"who": ln["who"], "text": ln["text"], "start": round(t, 3), "end": round(t + len(x) / sr, 3), "env": lip_envelope(x, sr),
                      **({} if ln["who"].startswith("narrator") else {"rnd": lip_round(x, sr)})})
        parts.append(x.astype(np.float32)); t += len(x) / sr
        if i < len(scene["lines"]) - 1:
            gap = int(after * sr); parts.append(np.zeros(gap, np.float32)); t += gap / sr
    clip = np.concatenate(parts)
    key = hashlib.sha1(repr([(l["who"], l["text"], l["start"]) for l in lines]).encode()).hexdigest()[:16]
    CACHE.mkdir(parents=True, exist_ok=True)
    out = CACHE / f"kdlg_{key}.wav"
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
            d = narrate_dialogue(s, ep)
            res.append({"scene_id": s["id"], **d})
            continue
        p = narrate_scene(ep["narrator_voice"], s["narration"], length_scale)
        x, sr = read_wav(p)
        res.append({"scene_id": s["id"], "path": str(p), "duration": round(len(x) / sr, 3)})
    return res
