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

# ---------- engine v5: phone-ready sound (docs/SOUND_UPGRADE_RESEARCH.md). Measured on Case Files 63 and 71: 73-84 % of
# the score's energy and 95-98 % of the effects' sat below 150 Hz, where phone speakers produce almost nothing, so on the
# device most viewers use only the voice came through. v5 gives the bed and the effects harmonics a phone can play
# (a waveshaper on the lows, so the ear infers the fundamental), a midrange presence lift, a quiet rhythmic top layer,
# and levels the bed against the voice IN THE PHONE BAND (300 Hz-8 kHz) instead of full-band.
DUCK_DB_V5 = {"ambience": -9.0, "pulse": -5.0, "motif": -12.0, "metal": -12.0, "impacts": -3.0}
PHONE_LO, PHONE_HI = 300.0, 8000.0
MUSIC_UNDER_VOICE_DB = 11.0     # bed under the voice while he speaks, phone band (research: 10-14 dB); voice_guard keeps every voiced 50 ms window >= 12.5 dB clear
SFX_UNDER_VOICE_DB = 4.0        # effects' active level vs the voice, phone band: a hit you hear, not a wall


def _fft_eq(x: np.ndarray, bells: list[tuple[float, float, float]], hp: float = 0.0) -> np.ndarray:
    """Zero-phase EQ in one FFT: bells = [(centre Hz, gain dB, width in octaves)], optional 4th-order-ish high-pass."""
    X = np.fft.rfft(x); f = np.maximum(np.fft.rfftfreq(len(x), 1 / SR), 1.0); g = np.ones_like(f)
    for fc, db, w in bells:
        g *= 10 ** (db / 20 * np.exp(-0.5 * (np.log2(f / fc) / (w / 2)) ** 2))
    if hp:
        g *= 1 / (1 + (hp / f) ** 4)
    return np.fft.irfft(X * g, len(x)).astype(np.float32)


def phone_ready(x: np.ndarray, drive: float = 3.0, harm_db: float = -4.0, presence: tuple = ((900, 4.0, 1.4), (2600, 5.0, 1.2), (6500, 2.0, 1.5))) -> np.ndarray:
    """Harmonics from the lows (tanh waveshaper on the < 220 Hz band, keeping only what it adds above 250 Hz), sub
    high-pass at 40 Hz, and a presence lift. Output level is matched to the input's full-band RMS."""
    if not np.any(x):
        return x
    low = bandpass(x, 30, 220)
    pk = float(np.max(np.abs(low))) or 1.0
    harm = np.tanh(drive * low / pk) * pk / drive
    harm = _fft_eq(harm, [], hp=250.0) * 10 ** (harm_db / 20) * drive
    y = _fft_eq(x + harm, list(presence), hp=40.0)
    return (y * (np.sqrt(np.mean(x ** 2)) / (np.sqrt(np.mean(y ** 2)) or 1.0))).astype(np.float32)


def band_rms_db(x: np.ndarray, mask: np.ndarray | None = None, lo: float = PHONE_LO, hi: float = PHONE_HI) -> float:
    y = bandpass(x, lo, hi)
    y = y[mask] if mask is not None and mask.any() else y
    return float(20 * np.log10(np.sqrt(np.mean(y ** 2)) + 1e-9))


def voice_guard(nar: np.ndarray, music: np.ndarray, margin_db: float = 12.5, win: float = 0.05) -> np.ndarray:
    """A phone-band sidechain: wherever the narration is voiced, pull the bed down just enough to keep it margin_db
    under the voice in that 50 ms window (fast attack, 250 ms release), so a louder bed never covers a word."""
    hop = int(win * SR); m = len(nar) // hop
    if m < 2:
        return np.ones(len(nar), np.float32)
    lv = lambda x: 20 * np.log10(np.sqrt(np.mean(bandpass(x, PHONE_LO, PHONE_HI)[: m * hop].reshape(m, hop) ** 2, axis=1)) + 1e-9)
    ln, lm = lv(nar), lv(music)
    voiced = ln >= (np.median(ln[ln > -60]) - 12 if np.any(ln > -60) else 0)
    cut = np.where(voiced, np.maximum(0.0, lm - (ln - margin_db)), 0.0)
    cut = np.maximum(cut, np.concatenate([[0.0], cut[:-1]]))                  # look one window ahead/behind
    cut = np.maximum(cut, np.concatenate([cut[1:], [0.0]]))
    out = np.zeros(m); acc = 0.0; kr = np.exp(-win / 0.25)
    for i, c in enumerate(cut):
        acc = c if c > acc else c + (acc - c) * kr; out[i] = acc
    g = np.repeat(10 ** (-out / 20), hop)
    return np.pad(g, (0, len(nar) - len(g)), mode="edge").astype(np.float32)


def top_layer(n: int, ep: dict, seed: int) -> np.ndarray:
    """A quiet hi-hat/shaker pulse on the score's tempo (8ths, accents on the beat): rhythm a phone speaker can play."""
    bpm = float((ep.get("score") or {}).get("bpm") or 90); step = 60.0 / bpm / 2
    r = np.random.default_rng(seed + 77); out = np.zeros(n, np.float32); L = int(0.06 * SR)
    burst = bandpass(r.standard_normal(L).astype(np.float32), 5000, 11000) * np.exp(-np.arange(L) / (0.012 * SR)).astype(np.float32)
    t = 0.0; k = 0
    while t < n / SR:
        a = int(t * SR); m = min(L, n - a)
        out[a:a + m] += burst[:m] * (1.0 if k % 2 == 0 else 0.55); t += step; k += 1
    return out / (np.max(np.abs(out)) or 1.0)


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
    v5 = (ep.get("engagement_version") or 1) >= 5
    sp = speech_envelope(nar, hold=0.8 if (ep.get("engagement_version") or 1) >= 4 else 0.0); drop = drop_curve(n, tl, ep)
    L = nar.copy(); R = nar.copy(); music = np.zeros(n, np.float32); ducked = {}; v5_report = {}
    duck = DUCK_DB_V5 if v5 else DUCK_DB
    for k, x in stems.items():
        x = x[:n] if len(x) >= n else np.pad(x, (0, n - len(x)))
        if v5:
            x = phone_ready(x, drive=4.0 if k in ("pulse", "impacts", "ambience") else 2.5)
        g = 10 ** (STEM_DB[k] / 20) * (1 - (1 - 10 ** (duck[k] / 20)) * sp) * drop
        y = (x * g).astype(np.float32); ducked[k] = y; music += y
    if v5:
        top = top_layer(n, ep, seed) * (1 - 0.6 * sp) * drop
        top = 0.25 * top * (np.sqrt(np.mean(music ** 2)) or 1e-3) / (np.sqrt(np.mean(top ** 2)) or 1.0)
        ducked["top"] = top; bus = music + top; talk = sp > 0.5
        gain_db = float(np.clip((band_rms_db(nar, talk) - MUSIC_UNDER_VOICE_DB) - band_rms_db(bus, talk), -6.0, 18.0))
        gm = 10 ** (gain_db / 20); music = bus * gm
        for k in ducked:
            ducked[k] = ducked[k] * gm
        guard = voice_guard(nar, music, 12.5)
        music = music * guard
        for k in ducked:
            ducked[k] = ducked[k] * guard
        L += music; R += music
        v5_report = {"music_bus_gain_db": round(gain_db, 2), "guard_max_cut_db": round(float(-20 * np.log10(guard.min() + 1e-9)), 1)}
    else:
        for k, y in ducked.items():
            L += y * (1 - PAN[k]); R += y * (1 + PAN[k])
    if v5 and np.any(fx):
        fx = phone_ready(fx, drive=5.0, harm_db=-2.0, presence=((1200, 3.0, 1.5), (3000, 6.0, 1.2), (7000, 3.0, 1.5)))
        act = np.abs(fx) > 0.02 * (np.max(np.abs(fx)) or 1)
        sfx_db = float(np.clip((band_rms_db(nar, sp > 0.5) - SFX_UNDER_VOICE_DB) - band_rms_db(fx, act), -12.0, 18.0))
        fxg = fx * 10 ** (sfx_db / 20) * (1 - 0.35 * sp); v5_report["sfx_gain_db"] = round(sfx_db, 2)
    else:
        fxg = fx * 10 ** (-9 / 20) * (1 - 0.35 * sp)
    L += fxg; R += fxg
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
    return out.astype(np.float32), {"duck_db": duck, "stem_db": STEM_DB, "voice_rms_db": VOICE_RMS_DB, "line_gain_db": line_gains, "sound_v5": v5_report,
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
