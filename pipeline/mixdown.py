"""Mix v2 for the history profile (opt-in: episodes with "voice_engine": "kokoro" or "mix": "v2").

Follows the standard set for the true-crime documentary series: speech must stay intelligible on a phone
speaker, with the score and beds at least 20 dB under the voice while someone is speaking, and the master
loudness-normalised in two passes. On top of that it gives the soundtrack space:

- voice: dry and centred (characters already carry a small room from pipeline/narrate.py), resampled with an
  FFT resampler rather than linear interpolation so the top end stays clean;
- score: centred dry signal plus a decorrelated stereo hall (two different decaying-noise impulse responses,
  low end removed from the reverb so it never muddies the voice);
- ambience: centred plus a short, wide diffuse tail, so the world surrounds the voice instead of sitting on it;
- effects: each one panned a little left or right (deterministic per event) with a small room;
- ducking: the bed follows the voice. Whenever the narrator speaks, the bed drops by `duck_db`, and further if
  needed so the voice-to-bed ratio never falls under `ratio_db` (measured on 50 ms windows). Short gaps between
  lines are held, so the music only swells back in pauses longer than about 0.8 s (no pumping).

Returns the stereo mix and the stems used by the QA (voice, bed after ducking, effects)."""
from __future__ import annotations

import zlib

import numpy as np

from pipeline import audio

SR = audio.SR


def fft_resample(x: np.ndarray, sr_in: int, sr_out: int = SR) -> np.ndarray:
    if sr_in == sr_out:
        return x.astype(np.float32)
    pad = int(0.05 * sr_in)
    xp = np.concatenate([np.zeros(pad, np.float32), x.astype(np.float32), np.zeros(pad, np.float32)])
    n_out = int(round(len(xp) * sr_out / sr_in))
    X = np.fft.rfft(xp); Y = np.zeros(n_out // 2 + 1, complex); k = min(len(X), len(Y)); Y[:k] = X[:k]
    y = np.fft.irfft(Y, n_out) * (n_out / len(xp))
    p_out = int(round(pad * sr_out / sr_in))
    return y[p_out: p_out + int(round(len(x) * sr_out / sr_in))].astype(np.float32)


def fft_convolve(x: np.ndarray, ir: np.ndarray) -> np.ndarray:
    n = len(x) + len(ir) - 1; size = 1 << (n - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return y.astype(np.float32)


def highpass(x: np.ndarray, hz: float) -> np.ndarray:
    return (x - audio.lowpass_fast(x, hz)).astype(np.float32)


def stereo_ir(rt60: float, seed: int, predelay: float = 0.02, damp_hz: float = 5500) -> tuple[np.ndarray, np.ndarray]:
    """Two decorrelated decaying-noise impulse responses (left, right), unit energy, darkened over time."""
    n = int((rt60 + predelay) * SR); t = np.arange(n) / SR; tau = rt60 / 6.91
    out = []
    for k in range(2):
        rng = np.random.default_rng(seed * 7 + k)
        ir = rng.standard_normal(n).astype(np.float32) * np.exp(-np.maximum(0, t - predelay) / tau)
        ir[: int(predelay * SR)] = 0
        ir = audio.lowpass_fast(ir, damp_hz)
        out.append((ir / (np.sqrt((ir ** 2).sum()) or 1)).astype(np.float32))
    return out[0], out[1]


def widen(x: np.ndarray, rt60: float, wet_db: float, seed: int, low_cut: float = 220, damp_hz: float = 5500) -> np.ndarray:
    """Mono -> stereo: the dry signal centred plus a decorrelated reverb (no low end in the reverb)."""
    irl, irr = stereo_ir(rt60, seed, damp_hz=damp_hz)
    src = highpass(x, low_cut); g = 10 ** (wet_db / 20)
    return np.stack([x + fft_convolve(src, irl) * g, x + fft_convolve(src, irr) * g], axis=1).astype(np.float32)


def rms_frames(x: np.ndarray, win: float = 0.05) -> np.ndarray:
    hop = int(win * SR); n = len(x) // hop
    return np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(axis=1) + 1e-12)


def smooth_db(g_db: np.ndarray, hop_s: float, attack: float, release: float) -> np.ndarray:
    """One-pole smoothing of a gain curve in dB: falls with `attack`, recovers with `release`."""
    out = np.empty_like(g_db); acc = 0.0
    ra, rr = np.exp(-hop_s / attack), np.exp(-hop_s / release)
    for i, v in enumerate(g_db):
        acc = v + (acc - v) * (ra if v < acc else rr); out[i] = acc
    return out


def master_mix(total: float, clips: list, music: np.ndarray, amb: np.ndarray, sfx_events: list, seed: int,
               music_db: float = -9.0, amb_db: float = 3.0, sfx_db: float = -8.0, duck_db: float = -8.0,
               ratio_db: float = 21.0) -> tuple[np.ndarray, dict]:
    n = int(total * SR)
    voice = np.zeros(n, np.float32)
    for at, x, sr in clips:
        audio.add(voice, fft_resample(x, sr), at)

    def fit(x):
        x = x[:n]; return np.pad(x, (0, n - len(x))).astype(np.float32)
    mus = highpass(fit(music), 35) * 10 ** (music_db / 20)
    am = highpass(fit(amb), 40) * 10 ** (amb_db / 20)

    # ducking gain on 50 ms frames
    hop = int(0.05 * SR); hop_s = hop / SR
    v = rms_frames(voice); b = rms_frames(mus + am)
    act = v > 10 ** (-38 / 20)                        # narrator speaking in this window
    hold = int(0.4 / hop_s); held = act.copy()
    for k in range(1, hold + 1):                      # bridge short gaps between words and lines
        held[k:] |= act[:-k]; held[:-k] |= act[k:]
    need = np.where(act, 20 * np.log10(v) - ratio_db - 20 * np.log10(b), 0.0)   # gain that leaves ratio_db of room
    g_db = np.minimum(np.where(held, duck_db, 0.0), np.minimum(need, 0.0))
    g_db = np.maximum(g_db, -30.0)
    g_db = smooth_db(g_db, hop_s, attack=0.06, release=0.45)
    gain = np.repeat(10 ** (g_db / 20), hop); gain = np.pad(gain, (0, n - len(gain)), mode="edge").astype(np.float32)

    bed = (mus + am) * gain
    bed_st = widen(mus * gain, rt60=2.0, wet_db=-8.0, seed=seed) + widen(am * gain, rt60=0.6, wet_db=-3.0, seed=seed + 50, low_cut=150)

    fx_st = np.zeros((n, 2), np.float32); fx_mono = np.zeros(n, np.float32); cache = {}
    for ev in sfx_events:
        at, name = ev[0], ev[1]; g = ev[2] if len(ev) > 2 else 1.0
        if name not in cache:
            cache[name] = audio.sfx(name, seed)
        x = cache[name] * g * 10 ** (sfx_db / 20)
        i = int(at * SR)
        if i >= n:
            continue
        x = x[: n - i]
        duck = 0.7 + 0.3 * gain[i: i + len(x)]          # effects step back a little under speech
        x = x * duck
        pan = ((zlib.crc32(f"{name}|{at:.2f}".encode()) % 1000) / 1000 - 0.5) * 0.6
        fx_st[i: i + len(x), 0] += x * np.sqrt(0.5 - pan / 2) * 1.414
        fx_st[i: i + len(x), 1] += x * np.sqrt(0.5 + pan / 2) * 1.414
        fx_mono[i: i + len(x)] += x
    room_l, room_r = stereo_ir(0.35, seed + 99, predelay=0.008, damp_hz=4000)
    fx_st[:, 0] += fft_convolve(fx_st[:, 0], room_l) * 10 ** (-13 / 20)
    fx_st[:, 1] += fft_convolve(fx_st[:, 1], room_r) * 10 ** (-13 / 20)

    out = bed_st + fx_st + voice[:, None]
    peak = float(np.max(np.abs(out))) or 1.0
    if peak > 0.98:                                   # safety only; loudness is set by the two-pass loudnorm at mux
        out = out * (0.98 / peak)
    stems = {"voice": voice, "bed": bed.astype(np.float32), "sfx": fx_mono, "gain_db": g_db, "hop_s": hop_s}
    return out.astype(np.float32), stems


def voice_to_bed(voice: np.ndarray, bed: np.ndarray) -> dict:
    """Voice-to-bed ratio under speech (dB) on 50 ms windows where the voice is active."""
    v, b = rms_frames(voice), rms_frames(bed)
    m = min(len(v), len(b)); v, b = v[:m], b[:m]
    act = v > 10 ** (-38 / 20)
    if not act.any():
        return {"median_db": None, "p5_db": None, "windows": 0}
    r = 20 * np.log10(v[act]) - 20 * np.log10(np.maximum(b[act], 1e-6))
    return {"median_db": round(float(np.median(r)), 1), "p5_db": round(float(np.percentile(r, 5)), 1), "windows": int(act.sum())}
