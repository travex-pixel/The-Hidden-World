"""Narration-first mix of the structured score (pipeline/score.py), sound effects and narration.

- The narration is high-passed at 80 Hz and sits in the foreground.
- Each score stem is ducked by its own depth from a look-ahead narration envelope, so the music recedes
  smoothly just before speech and rises to fill the gaps between lines. That keeps a bed under every gap,
  so there is no "dropout" on phones.
- A scene can set "music_drop": true. The score then falls away under that scene's narration, giving focus
  to an important statement.
- Small-speaker safety: the levels are set and checked in the phone band (above about 300 Hz).
- The mix is mono-compatible: there is no phase-inverted widening, only gentle level panning.
- The final stage is a true-peak-safe linear loudness normalisation. ffmpeg's loudnorm silently falls back
  to dynamic gain riding when its linear mode cannot meet the true-peak target, so it is not used here.
"""
from __future__ import annotations
import json, subprocess
from pathlib import Path
import numpy as np
from .audio import SR, add, sfx as make_sfx
from .score import bandpass, smooth

DUCK_DB = {"ambience": -16.0, "pulse": -6.0, "motif": -24.0, "metal": -22.0, "impacts": -4.0}   # mid-band stems duck hardest: they compete with the voice
STEM_DB = {"ambience": -5.0, "pulse": -9.0, "motif": -3.0, "metal": -8.0, "impacts": -8.0}
PAN = {"ambience": 0.0, "pulse": 0.0, "motif": -0.18, "metal": 0.2, "impacts": 0.0}


def highpass(x: np.ndarray, fc: float) -> np.ndarray:
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / (1 + (fc / np.maximum(f, 1)) ** 4)
    return np.fft.irfft(X, len(x)).astype(np.float32)


def hold_gaps(on: np.ndarray, hold: float, frame: float = 0.02, depth: float = 0.5) -> np.ndarray:
    """Part-fill dips shorter than `hold` seconds between two speech frames (after the what-if engine's mix): in a short
    pause the bed comes back only to `depth` of the way, so it breathes without the full swell-and-drop that reads as
    pumping. A full hold (depth 1) kept short-form beds ducked for the whole video (Case File 71: music in the gaps
    -53 dB, opening holes), because nearly every gap in a fast read is under the hold."""
    if hold <= 0 or not len(on):
        return on
    out = on.copy(); sp = np.where(on > 0.5)[0]
    for a, b in zip(sp[:-1], sp[1:]):
        if 1 < b - a <= hold / frame:
            out[a:b] = np.maximum(out[a:b], depth * min(on[a], on[b]))
    return out


def speech_envelope(nar: np.ndarray, attack: float = 0.04, release: float = 0.3, lookahead: float = 0.15, hold: float = 0.0) -> np.ndarray:
    """0..1 'speech present' curve: RMS in 20 ms frames, gaps shorter than `hold` filled, smoothed attack/release,
    shifted earlier by the look-ahead."""
    hop = int(0.02 * SR); m = len(nar) // hop
    rms = np.sqrt(np.mean(nar[: m * hop].reshape(m, hop) ** 2, axis=1) + 1e-12)
    on = hold_gaps(np.clip((20 * np.log10(rms) + 46) / 10, 0, 1), hold)   # -46 dBFS = silence, -36 dBFS and above = speech
    out = np.zeros(m); acc = 0.0; ka = np.exp(-0.02 / attack); kr = np.exp(-0.02 / release)
    for i, v in enumerate(on):
        acc = v + (acc - v) * (ka if v > acc else kr); out[i] = acc
    sh = int(lookahead / 0.02); out = np.concatenate([out[sh:], np.full(sh, out[-1] if m else 0)])
    e = np.repeat(out, hop); return np.pad(e, (0, len(nar) - len(e)), mode="edge").astype(np.float32)


VOICE_RMS_DB = -18.0


def voiced_gain(y: np.ndarray, target_db: float = VOICE_RMS_DB, limit_db: float = 9.0) -> float:
    """Gain that brings the voiced part of a narration clip (20 ms frames within 30 dB of its loudest) to target RMS."""
    hop = int(0.02 * SR); m = len(y) // hop
    if m == 0:
        return 1.0
    r = np.sqrt(np.mean(y[: m * hop].reshape(m, hop) ** 2, axis=1) + 1e-12); db = 20 * np.log10(r)
    v = r[db >= db.max() - 30]; cur = 20 * np.log10(np.sqrt(np.mean(v ** 2)) + 1e-12)
    return float(10 ** (np.clip(target_db - cur, -limit_db, limit_db) / 20))


def drop_curve(n: int, tl: list, ep: dict) -> np.ndarray:
    """Extra -14 dB on the whole score under scenes marked music_drop (0.6 s ramps)."""
    g = np.ones(n, np.float32)
    for s, sc in zip(tl, ep["scenes"]):
        if sc.get("music_drop"):
            a, b = int(max(0, s["narration_at"] - 0.3) * SR), min(n, int((s["narration_end"] + 0.2) * SR)); g[a:b] = 10 ** (-14 / 20)
    return smooth(g, int(0.6 * SR))


def mixdown(total: float, clips: list, stems: dict, sfx_events: list, tl: list, ep: dict, seed: int, out_dir: Path | None = None) -> tuple[np.ndarray, dict]:
    n = int(total * SR)
    from .audio import resample
    nar = np.zeros(n, np.float32); line_gains = []
    for at, x, sr in clips:   # every line levelled to the same voiced loudness: a consistent narrator, whatever the clip
        y = resample(x, sr); g = voiced_gain(y); line_gains.append(round(20 * np.log10(g), 2)); add(nar, y * g, at)
    nar = highpass(nar, 80) * 0.95
    fx = np.zeros(n, np.float32); cache = {}
    for ev in sfx_events:
        at, name = ev[0], ev[1]; gain = ev[2] if len(ev) > 2 else 1.0
        cache.setdefault(name, make_sfx(name, seed)); add(fx, cache[name] * gain, at)
    sp = speech_envelope(nar, hold=0.8 if (ep.get("engagement_version") or 1) >= 4 else 0.0); drop = drop_curve(n, tl, ep)
    L = nar.copy(); R = nar.copy(); music = np.zeros(n, np.float32); ducked = {}
    for k, x in stems.items():
        x = x[:n] if len(x) >= n else np.pad(x, (0, n - len(x)))
        g = 10 ** (STEM_DB[k] / 20) * (1 - (1 - 10 ** (DUCK_DB[k] / 20)) * sp) * drop
        y = (x * g).astype(np.float32); ducked[k] = y; music += y
        L += y * (1 - PAN[k]); R += y * (1 + PAN[k])
    fxg = fx * 10 ** (-9 / 20) * (1 - 0.35 * sp); L += fxg; R += fxg
    out = np.stack([L, R], axis=1)
    out = np.tanh(out * 1.1) / np.tanh(1.1)                       # gentle soft clip; loudness stage sets the final level
    fl = int(min(1.5, total * 0.05) * SR); out[-fl:] *= (np.linspace(1, 0, fl) ** 1.5)[:, None]   # everything (score, effects) ends with the picture
    dc = int(0.01 * SR); out[:dc] *= np.linspace(0, 1, dc)[:, None]                                # 10 ms de-click only
    if out_dir is not None:                                          # stems for QA and future remixes
        d = out_dir / "stems"; d.mkdir(parents=True, exist_ok=True)
        from .audio import write_wav
        write_wav(d / "narration.wav", nar); write_wav(d / "music.wav", music); write_wav(d / "sfx.wav", fxg)
        for k, y in ducked.items():
            write_wav(d / f"music_{k}.wav", y)
    return out.astype(np.float32), {"duck_db": DUCK_DB, "stem_db": STEM_DB, "voice_rms_db": VOICE_RMS_DB, "line_gain_db": line_gains,
                                    "drops": [sc["id"] for sc in ep["scenes"] if sc.get("music_drop")]}


def measure(path: Path) -> dict:
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    tail = r[r.rfind("Summary:"):]
    import re
    i = re.search(r"I:\s+(-?[\d.]+) LUFS", tail); tp = re.search(r"Peak:\s+(-?[\d.]+) dBFS", tail); lra = re.search(r"LRA:\s+(-?[\d.]+) LU", tail)
    return {"I": float(i.group(1)), "TP": float(tp.group(1)), "LRA": float(lra.group(1)) if lra else None}


def normalise_linear(path: Path, target_lufs: float = -14.0, true_peak: float = -1.5) -> dict:
    """Linear loudness normalisation: one static gain to the target, then a look-ahead peak limiter for the
    true-peak ceiling, then a re-measure (and one small correction if the limiter cost loudness). No dynamic gain riding."""
    before = measure(path); tmp = path.with_suffix(".lin.wav"); gain = target_lufs - before["I"]; steps = []
    for _ in range(3):
        lim = 10 ** ((true_peak - 0.6) / 20)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(path), "-af",
                        f"volume={gain:.3f}dB,alimiter=limit={lim:.4f}:attack=3:release=60:level=disabled:asc=1", "-ar", str(SR), "-c:a", "pcm_s16le", str(tmp)], check=True)
        after = measure(tmp); steps.append({"gain_db": round(gain, 2), **after})
        if abs(after["I"] - target_lufs) <= 0.4 and after["TP"] <= true_peak:
            break
        gain += target_lufs - after["I"]
    tmp.replace(path)
    return {"mode": "linear+limiter", "before": before, "after": steps[-1], "steps": steps}
