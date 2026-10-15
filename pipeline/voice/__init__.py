"""Shared voice engine: a thin adapter that turns (voice profile, text) into a validated, cached WAV.

Engines are small modules under pipeline/voice/engines/. A *voice profile* is voices/<name>/profile.json
(public, no audio) or voices/private/<name>/profile.json (never committed, fetched from the vault).
Piper is untouched: narrate.py only routes here when the voice name is a profile, so every existing
episode renders exactly as before.
"""
from __future__ import annotations
import hashlib, json, time, wave
from pathlib import Path
import numpy as np

from pipeline.voice.profiles import load_profile, profile_exists, profile_fingerprint  # noqa: F401
from pipeline.voice import text as vtext

ROOT = Path(__file__).resolve().parent.parent.parent
CACHE = ROOT / ".cache" / "narration"
ENGINES = {"pocket": "pipeline.voice.engines.pocket", "chatterbox": "pipeline.voice.engines.chatterbox"}
_LOADED: dict = {}


def _engine(profile: dict):
    name = profile["engine"]
    if name not in ENGINES:
        raise SystemExit(f"[voice] unknown engine {name!r}; known: {sorted(ENGINES)}")
    if name not in _LOADED:
        import importlib
        _LOADED[name] = importlib.import_module(ENGINES[name]).Engine(profile)
    return _LOADED[name]


def cache_key(profile: dict, text_: str, length_scale: float, attempt: int = 0) -> str:
    fp = profile_fingerprint(profile)
    return hashlib.sha1(f"{fp}|{length_scale}|{text_}|{attempt}".encode()).hexdigest()[:16]


def write_wav(path: Path, x: np.ndarray, sr: int) -> None:
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


def synthesize(profile_name: str, text_: str, length_scale: float = 1.0) -> Path:
    """Return a cached, validated, peak-normalised mono WAV for one narration line/scene."""
    profile = load_profile(profile_name)
    CACHE.mkdir(parents=True, exist_ok=True)
    key = cache_key(profile, text_, length_scale)
    out = CACHE / f"v_{key}.wav"
    if out.exists() and out.with_suffix(".json").exists():
        return out
    from pipeline.voice import validate
    eng = _engine(profile)
    spoken = vtext.apply_lexicon(text_, profile.get("lexicon", {}))
    sentences = vtext.split_sentences(spoken, min_words=profile.get("min_words_per_chunk", 8), max_words=profile.get("max_words_per_chunk", 60))
    gap = float(profile.get("sentence_gap", 0.28))
    val = profile.get("validation", {})
    max_attempts = int(val.get("max_attempts", 3))
    best, best_rep = None, None
    for attempt in range(max_attempts):
        t0 = time.time()
        parts, sr = [], None
        for s in sentences:
            x, sr_ = eng.generate(s, speed=1.0 / length_scale)
            sr = sr or sr_
            parts.append(vtext.trim_silence(x, sr))
        sil = np.zeros(int(gap * sr), np.float32)
        x = np.concatenate(sum([[p, sil] for p in parts], [])[:-1]) if parts else np.zeros(1, np.float32)
        synth = time.time() - t0
        peak = float(np.max(np.abs(x))) or 1.0
        x = (x / peak * 0.89).astype(np.float32)
        rep = validate.check(x, sr, text_, profile, val)
        rep.update({"profile": profile_name, "engine": profile["engine"], "attempt": attempt, "words": len(text_.split()),
                    "duration": round(len(x) / sr, 3), "synth_seconds": round(synth, 2), "rtf": round(synth / max(len(x) / sr, 1e-6), 3), "sr": sr})
        if best is None or rep["score"] > best_rep["score"]:
            best, best_rep = x, rep
        if rep["ok"]:
            break
    if not best_rep["ok"] and val.get("strict", False):
        raise SystemExit(f"[voice] validation failed for {profile_name!r}: {best_rep}")
    write_wav(out, best, sr)
    out.with_suffix(".json").write_text(json.dumps(best_rep, indent=1))
    return out


def report_for(paths: list[str | Path]) -> dict:
    """Aggregate the per-clip validation sidecars written by synthesize()."""
    clips = []
    for p in paths:
        j = Path(p).with_suffix(".json")
        if Path(p).name.startswith("v_") and j.exists():
            clips.append(json.loads(j.read_text()))
    if not clips:
        return {"clips": 0}
    def mean(k):
        v = [c[k] for c in clips if c.get(k) is not None]
        return round(float(np.mean(v)), 3) if v else None
    # scene-to-scene consistency: each clip's embedding against the centroid of all clips in this episode
    embs = [np.array(c["embedding"], np.float32) for c in clips if c.get("embedding")]
    consistency = None
    if len(embs) > 1:
        cen = np.mean(embs, axis=0); cen /= (np.linalg.norm(cen) or 1.0)
        sims = [float(e @ cen) for e in embs]
        consistency = {"mean": round(float(np.mean(sims)), 3), "min": round(min(sims), 3)}
    for c in clips:
        c.pop("embedding", None)
    return {"consistency_vs_centroid": consistency,"clips": len(clips), "profile": clips[0].get("profile"), "engine": clips[0].get("engine"),
            "audio_seconds": round(sum(c["duration"] for c in clips), 2), "synth_seconds": round(sum(c["synth_seconds"] for c in clips), 2),
            "rtf": round(sum(c["synth_seconds"] for c in clips) / max(sum(c["duration"] for c in clips), 1e-6), 3),
            "wer_mean": mean("wer"), "wer_max": max((c["wer"] for c in clips if c.get("wer") is not None), default=None),
            "speaker_sim_mean": mean("speaker_sim"), "speaker_sim_min": min((c["speaker_sim"] for c in clips if c.get("speaker_sim") is not None), default=None),
            "retries": sum(c["attempt"] for c in clips), "all_ok": all(c["ok"] for c in clips), "clips_detail": clips}
