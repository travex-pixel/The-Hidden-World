"""COPYCAT score, sound design and final mix — everything synthesised (NumPy/SciPy), no samples, no network.

Music is a composed system, not a drone generator:
  * one key centre (D minor) and one tempo grid (100 BPM; every event sits on a global 16th-note grid, and
    every section starts on that grid, so mood changes land in time),
  * a recurring 7-note motif (D F A G | F E D) and its answer, re-orchestrated per mood,
  * twelve moods with their own harmony, instrumentation and rhythm, cross-faded on the grid with small risers.

Public contract (used by the COPYCAT orchestrator):
    compose(duration, sections, seed) -> (n, 2) float32
    sfx(name, seed)                   -> (n, 2) float32          (SFX_INFO gives dur / peak_at per effect)
    mix(duration, vo, music, sfx_events, seed) -> (n, 2) float32 master, about -14 LUFS, true peak <= -1 dBFS
    write_wav(path, x)                -> 48 kHz / 16-bit / stereo
    python -m copycat.score --demo <outdir>   renders every mood + effect and prints a numeric QA table
"""
from __future__ import annotations
import functools, math, re, subprocess, sys, time, wave
from pathlib import Path
import numpy as np
from scipy import signal
from scipy.ndimage import maximum_filter1d, minimum_filter1d, uniform_filter1d

SR = 48000
BPM = 100.0
BEAT = 60.0 / BPM
BEATN = int(round(SR * BEAT))        # 28800 samples
BARN = 4 * BEATN                     # 115200 samples (2.4 s)
SIXTEENTH = BEATN // 4
MOODS = ["mystic", "dread", "drive", "wonder", "tension", "emotional", "battle", "heist", "cliff", "playful", "title", "silence"]
SFX = ["swell", "sparkle", "shimmer", "boom", "glitch", "impact", "whoosh", "creak", "reverse", "hit", "wind", "tick", "stamp", "slash",
       "riser", "riser_short", "error", "growl", "shing", "thud", "zip", "punch", "ripple", "rumble", "seal", "roar", "heartbeat", "chain",
       "ping", "shatter", "scan", "flutter", "clock", "door"]
TAU = 2 * np.pi

# ----------------------------------------------------------------------------------------------- dsp helpers

def mtof(m: float) -> float:
    return 440.0 * 2 ** ((m - 69) / 12)


def _tt(n: int) -> np.ndarray:
    return np.arange(n, dtype=np.float64) / SR


@functools.lru_cache(maxsize=512)
def _sos(kind: str, f, order: int = 2):
    if kind == "bp":
        return signal.butter(order, [max(10.0, f[0]), min(SR * 0.49, f[1])], "bandpass", fs=SR, output="sos")
    return signal.butter(order, min(SR * 0.49, f), {"lp": "lowpass", "hp": "highpass"}[kind], fs=SR, output="sos")


def filt(x, kind, f, order=2):
    return signal.sosfilt(_sos(kind, f, order), x, axis=0)


def peaking(f0: float, gain_db: float, q: float) -> np.ndarray:
    """RBJ peaking biquad as a single SOS row."""
    a = 10 ** (gain_db / 40); w0 = TAU * f0 / SR; al = math.sin(w0) / (2 * q); cs = math.cos(w0)
    b0, b1, b2, a0, a1, a2 = 1 + al * a, -2 * cs, 1 - al * a, 1 + al / a, -2 * cs, 1 - al / a
    return np.array([[b0 / a0, b1 / a0, b2 / a0, 1.0, a1 / a0, a2 / a0]])


def high_shelf(f0: float, gain_db: float) -> np.ndarray:
    """RBJ high-shelf biquad (slope 1) as a single SOS row."""
    a = 10 ** (gain_db / 40); w0 = TAU * f0 / SR; cs = math.cos(w0); al = math.sin(w0) / 2 * math.sqrt(2); q = 2 * math.sqrt(a) * al
    b0, b1, b2 = a * ((a + 1) + (a - 1) * cs + q), -2 * a * ((a - 1) + (a + 1) * cs), a * ((a + 1) + (a - 1) * cs - q)
    a0, a1, a2 = (a + 1) - (a - 1) * cs + q, 2 * ((a - 1) - (a + 1) * cs), (a + 1) - (a - 1) * cs - q
    return np.array([[b0 / a0, b1 / a0, b2 / a0, 1.0, a1 / a0, a2 / a0]])


def _music_eq() -> np.ndarray:
    """Music-bus EQ: trim rumble, clear the speech band a little, add air, tame fizz."""
    return np.vstack([_sos("hp", 26.0), peaking(180, -1.0, 0.9), peaking(2300, -2.5, 1.0), high_shelf(5000, 4.5), _sos("lp", 15000.0)])


def _norm(x: np.ndarray, peak: float = 1.0) -> np.ndarray:
    m = float(np.max(np.abs(x))) if len(x) else 0.0
    return x if m < 1e-9 else x * (peak / m)


def _fade(x: np.ndarray, a: float = 0.002, r: float = 0.01) -> np.ndarray:
    n = len(x); an, rn = min(n // 2, max(1, int(a * SR))), min(n // 2, max(1, int(r * SR)))
    x = x.copy(); x[:an] *= np.linspace(0, 1, an); x[-rn:] *= np.linspace(1, 0, rn); return x


def _harm(freq, n, amps, decays=None, ratios=None, seed=0):
    """Additive partials with optional per-partial exponential decay; partials above 17 kHz are skipped."""
    t = _tt(n); out = np.zeros(n); r = np.random.default_rng(seed + 11)
    for k, amp in enumerate(amps):
        f = freq * (ratios[k] if ratios is not None else k + 1)
        if f > 17000 or amp == 0:
            continue
        s = np.sin(TAU * f * t + r.uniform(0, TAU) * (0 if k == 0 else 1))
        if decays is not None:
            s *= np.exp(-t * decays[k])
        out += amp * s
    return out


def _noise(n, seed):
    return np.random.default_rng(seed).standard_normal(n)


def _sweep_noise(n, f0, f1, seed, bands=10, bw=0.7, width=1.4, warp=1.0):
    """Noise whose spectral centre glides f0 -> f1: log-spaced band-passes cross-faded by moving Gaussian windows."""
    x = _noise(n, seed); u = np.linspace(0, 1, n) ** warp; out = np.zeros(n)
    for j in range(bands):
        c = j / (bands - 1); fc = f0 * (f1 / f0) ** c
        w = np.exp(-0.5 * ((u - c) / (width / bands)) ** 2)
        out += filt(x, "bp", (fc / 2 ** (bw / 2), fc * 2 ** (bw / 2))) * w
    return out


def _stereo(x: np.ndarray, width: float = 0.25, seed: int = 0) -> np.ndarray:
    """Mono -> stereo with a short decorrelated side signal (mono-compatible: L + R = 2x)."""
    r = np.random.default_rng(seed + 5); k = int(0.022 * SR)
    ir = r.standard_normal(k) * np.exp(-np.arange(k) / (0.006 * SR)); ir /= np.sqrt(np.sum(ir ** 2))
    side = signal.fftconvolve(x, ir)[: len(x)] * width
    return np.stack([x + side, x - side], axis=1)


def _put(buf: np.ndarray, start: int, x: np.ndarray, gain: float = 1.0, pan: float = 0.0) -> None:
    n = buf.shape[0]
    if start >= n or gain == 0:
        return
    if start < 0:
        x = x[-start:]; start = 0
    e = min(n, start + len(x)); x = x[: e - start]
    if x.ndim == 1:
        a = (pan + 1) * math.pi / 4
        buf[start:e, 0] += x * (gain * math.cos(a) * 1.41421356)
        buf[start:e, 1] += x * (gain * math.sin(a) * 1.41421356)
    else:
        buf[start:e, 0] += x[:, 0] * (gain * min(1.0, 1 - pan)); buf[start:e, 1] += x[:, 1] * (gain * min(1.0, 1 + pan))


# ----------------------------------------------------------------------------------------------- instruments
# Each returns mono float32, peak ~1. dur is the *written* note length in seconds; tails ring past it.

def _i_spic(f, dur):      # short bowed string (spiccato)
    n = int((min(dur, 0.6) + 0.3) * SR); t = _tt(n)
    K = max(8, min(40, int(7000 / f)))
    amps = [1 / k ** 1.05 * math.exp(-k / 16) for k in range(1, K + 1)]
    x = _harm(f, n, amps, seed=int(f)) + 0.5 * _harm(f * 1.004, n, amps[:10], seed=int(f) + 3)
    e = (1 - np.exp(-t / 0.007)) * np.exp(-t / (0.10 + 0.22 * min(dur, 0.6)))
    bow = filt(_noise(n, 7), "bp", (f * 2, min(f * 6, 9000))) * np.exp(-t / 0.02) * 0.25
    return _norm(_fade((x + bow) * e, 0.001, 0.03)).astype(np.float32)


def _i_cello(f, dur):     # sustained low string
    n = int((dur + 0.35) * SR); t = _tt(n)
    vib = 1 + 0.003 * np.sin(TAU * 5.2 * t) * np.clip(t / 0.4, 0, 1)
    ph = TAU * f * np.cumsum(vib) / SR
    x = sum((1 / k ** 1.25) * np.sin(k * ph + k) for k in range(1, 11) if f * k < 9000)
    e = np.clip(t / 0.09, 0, 1) * np.clip((dur + 0.3 - t) / 0.3, 0, 1)
    return _norm(x * e).astype(np.float32)


def _brass(f, dur, bright, atk):
    n = int((dur + 0.25) * SR); t = _tt(n)
    b = ((1 - np.exp(-t / atk)) * (0.55 + 0.45 * np.exp(-t / 0.5))) * bright
    vib = 1 + 0.0035 * np.sin(TAU * 5.4 * t) * np.clip((t - 0.15) / 0.3, 0, 1)
    ph = TAU * f * np.cumsum(vib) / SR; x = np.zeros(n)
    for k in range(1, 15):
        if f * k > 9000:
            break
        x += (1 / k) * np.exp(-k / (1.2 + 9 * b)) * np.sin(k * ph + 0.3 * k)
    e = np.clip(t / atk, 0, 1) ** 0.7 * np.clip((dur + 0.2 - t) / 0.2, 0, 1)
    return _norm(x * e).astype(np.float32)


def _i_horn(f, dur):
    return _brass(f, dur, 0.5, 0.07)


def _i_brass(f, dur):
    return _brass(f, dur, 1.0, 0.035)


def _i_piano(f, dur):
    n = int((min(dur, 4.0) + 1.6) * SR); t = _tt(n); B = 0.0004
    ks = np.arange(1, 13); ratios = ks * np.sqrt(1 + B * ks ** 2)
    amps = (1 / ks ** 1.15) * (1 + 0.5 * np.sin(ks * 1.3))
    decs = (0.9 + 0.55 * ks) * (f / 262) ** 0.35
    x = _harm(f, n, list(amps), list(decs), list(ratios), seed=int(f) + 1)
    x += 0.4 * _harm(f * 1.0015, n, list(amps[:6]), list(decs[:6] * 0.8), list(ratios[:6]), seed=int(f) + 2)
    ham = filt(_noise(n, 3), "lp", 2500) * np.exp(-t / 0.012) * 0.5
    e = (1 - np.exp(-t / 0.003)) * np.clip((min(dur, 4.0) + 1.5 - t) / 1.2, 0, 1)
    return _norm((x + ham) * e).astype(np.float32)


def _i_bell(f, dur):      # celesta-like
    n = int(1.9 * SR)
    x = _harm(f, n, [1, .45, .2, .12, .05], [3.2, 4.5, 6.5, 9, 12], [1, 2, 3, 4.1, 5.3], seed=int(f))
    return _norm(_fade(x, 0.002, 0.2)).astype(np.float32)


def _i_glock(f, dur):
    n = int(1.4 * SR)
    x = _harm(f, n, [1, .4, .18, .08], [4.5, 8, 13, 20], [1, 2.76, 5.40, 8.93], seed=int(f))
    return _norm(_fade(x, 0.001, 0.15)).astype(np.float32)


def _i_mbox(f, dur):      # music box
    n = int(1.5 * SR); t = _tt(n)
    x = _harm(f, n, [1, .22, .3, .1], [3.6, 6, 9, 15], [1, 2.0, 3.01, 5.9], seed=int(f))
    x += filt(_noise(n, 4), "hp", 5000) * np.exp(-t / 0.004) * 0.25
    return _norm(_fade(x, 0.001, 0.15)).astype(np.float32)


def _i_pizz(f, dur):
    n = int(0.75 * SR); t = _tt(n); ks = range(1, 11)
    x = _harm(f, n, [1 / k for k in ks], [6 + 3.5 * k for k in ks], seed=int(f))
    x += filt(_noise(n, 5), "bp", (800, 3000)) * np.exp(-t / 0.006) * 0.3
    return _norm(_fade(x * (1 - np.exp(-t / 0.002)), 0.001, 0.08)).astype(np.float32)


def _i_harp(f, dur):
    n = int(2.0 * SR); t = _tt(n); ks = range(1, 8)
    x = _harm(f, n, [1 / k ** 1.2 for k in ks], [1.8 + 1.3 * k for k in ks], seed=int(f))
    return _norm(_fade(x * (1 - np.exp(-t / 0.003)), 0.001, 0.3)).astype(np.float32)


def _i_dist(f, dur):      # distorted low voice (dread motif)
    n = int((dur + 0.5) * SR); t = _tt(n)
    saw = sum(2 * ((f * d * t) % 1) - 1 for d in (1.0, 1.007, 0.994)) / 3
    x = np.tanh(3.5 * filt(saw, "lp", 700)) + 0.6 * np.sin(TAU * f * 0.5 * t)
    x = filt(x, "lp", 1400)
    e = np.clip(t / 0.18, 0, 1) * np.clip((dur + 0.45 - t) / 0.45, 0, 1)
    return _norm(x * e).astype(np.float32)


def _i_eerie(f, dur):
    n = int((dur + 1.0) * SR); t = _tt(n)
    x = np.sin(TAU * f * t) + np.sin(TAU * (f + 2.7) * t) + 0.4 * np.sin(TAU * f * 1.498 * t + 1)
    e = np.clip(t / 1.4, 0, 1) * np.clip((dur + 0.9 - t) / 0.9, 0, 1)
    return _norm(x * e).astype(np.float32)


def _i_metal(f, dur):     # bowed metal swell
    n = int((dur + 1.6) * SR); t = _tt(n); r = np.random.default_rng(int(f)); x = np.zeros(n)
    for ratio, amp in zip([1, 1.48, 2.09, 2.83, 3.71, 4.9], [1, .8, .6, .5, .35, .2]):
        x += amp * np.sin(TAU * f * ratio * t + r.uniform(0, TAU)) * (0.6 + 0.4 * np.sin(TAU * r.uniform(0.15, 0.6) * t + r.uniform(0, TAU)))
    x += filt(_noise(n, int(f) + 9), "bp", (f * 2.5, f * 6)) * 0.35
    e = np.clip(t / (dur * 0.6), 0, 1) ** 1.6 * np.clip((dur + 1.5 - t) / 1.5, 0, 1)
    return _norm(x * e).astype(np.float32)


def _i_braam(f, dur):
    n = int((dur + 1.2) * SR); t = _tt(n)
    saw = sum(2 * ((f * d * t + i * 0.31) % 1) - 1 for i, d in enumerate((1.0, 1.006, 0.995, 2.003, 1.997))) / 5
    drive = 1.5 + 4.5 * (1 - np.exp(-t / 0.5))
    x = np.tanh(drive * filt(saw, "lp", 1500))
    x = filt(x, "lp", 3400) + 0.5 * np.sin(TAU * f * 0.5 * t) + 0.25 * filt(_noise(n, 2), "bp", (300, 1200)) * np.exp(-t / 0.4)
    e = (1 - np.exp(-t / 0.05)) * (0.75 + 0.25 * np.clip(t / (dur * 0.5), 0, 1)) * np.clip((dur + 1.1 - t) / 1.1, 0, 1) ** 1.5
    return _norm(x * e).astype(np.float32)


def _drum(f0, f1, tau_p, tau_a, click, seed, n_s, drive=1.4, noise_lp=None):
    n = int(n_s * SR); t = _tt(n)
    fr = f1 + (f0 - f1) * np.exp(-t / tau_p); ph = TAU * np.cumsum(fr) / SR
    x = np.sin(ph) * np.exp(-t / tau_a)
    if click:
        x += filt(_noise(n, seed), "bp", (700, 3500)) * np.exp(-t / 0.009) * click
    if noise_lp:
        x += filt(_noise(n, seed + 1), "lp", noise_lp) * np.exp(-t / (tau_a * 0.6)) * 0.35
    return _norm(_fade(np.tanh(drive * x), 0.0005, 0.03)).astype(np.float32)


def _i_bigdrum(f, dur):
    return _drum(98, 41, 0.035, 0.42, 0.35, 21, 1.3, 1.8, 220)


def _i_taiko(f, dur):
    return _drum(150, 72, 0.03, 0.2, 0.45, 22, 0.7, 1.6, 400)


def _i_tom(f, dur):
    return _drum(210, 118, 0.025, 0.12, 0.4, 23, 0.45, 1.3)


def _i_kick(f, dur):
    return _drum(75, 44, 0.03, 0.22, 0.08, 24, 0.7, 1.2)


def _i_hat(f, dur):
    n = int(0.09 * SR); t = _tt(n)
    return _norm(_fade(filt(_noise(n, 25), "hp", 6500) * np.exp(-t / 0.018), 0.0003, 0.01)).astype(np.float32)


def _i_shaker(f, dur):
    n = int(0.14 * SR); t = _tt(n)
    e = np.clip(t / 0.018, 0, 1) * np.exp(-np.clip(t - 0.018, 0, None) / 0.035)
    return _norm(_fade(filt(_noise(n, 26), "bp", (4200, 9500)) * e, 0.001, 0.02)).astype(np.float32)


def _i_rim(f, dur):
    n = int(0.12 * SR); t = _tt(n)
    x = np.sin(TAU * 1750 * t) * np.exp(-t / 0.012) + 0.6 * np.sin(TAU * 820 * t) * np.exp(-t / 0.02) + filt(_noise(n, 27), "hp", 3000) * np.exp(-t / 0.004) * 0.5
    return _norm(_fade(x, 0.0003, 0.02)).astype(np.float32)


def _i_tickp(f, dur):     # clock-like tick for tension
    n = int(0.08 * SR); t = _tt(n)
    x = np.sin(TAU * 2400 * t) * np.exp(-t / 0.006) + filt(_noise(n, 28), "bp", (2500, 7000)) * np.exp(-t / 0.004) * 0.7
    return _norm(_fade(x, 0.0003, 0.01)).astype(np.float32)


INST = {"spic": _i_spic, "cello": _i_cello, "horn": _i_horn, "brass": _i_brass, "piano": _i_piano, "bell": _i_bell, "glock": _i_glock,
        "mbox": _i_mbox, "pizz": _i_pizz, "harp": _i_harp, "dist": _i_dist, "eerie": _i_eerie, "metal": _i_metal, "braam": _i_braam,
        "bigdrum": _i_bigdrum, "taiko": _i_taiko, "tom": _i_tom, "kick": _i_kick, "hat": _i_hat, "shaker": _i_shaker, "rim": _i_rim, "tickp": _i_tickp}
_DRUMS = {"bigdrum", "taiko", "tom", "kick", "hat", "shaker", "rim", "tickp"}


@functools.lru_cache(maxsize=4096)
def _note(inst: str, midi: int, dur_ms: int) -> np.ndarray:
    return INST[inst](mtof(midi), dur_ms / 1000.0)


@functools.lru_cache(maxsize=512)
def _pad(kind: str, midis: tuple, dur_ms: int) -> np.ndarray:
    """Sustained ensemble chord, stereo (two detuned desks). kinds: str | warm | air | trem"""
    dur = dur_ms / 1000.0; rel = 1.1 if kind != "trem" else 0.5; atk = {"str": 0.45, "warm": 0.8, "air": 1.1, "trem": 0.25}[kind]
    n = int((dur + rel) * SR); t = _tt(n); nh = {"str": 16, "warm": 5, "air": 6, "trem": 14}[kind]; roll = {"str": 1.22, "warm": 1.6, "air": 1.45, "trem": 1.15}[kind]
    out = np.zeros((n, 2)); r = np.random.default_rng(sum(midis) * 31 + dur_ms)
    for m in midis:
        f = mtof(m)
        for ch, cents in ((0, -6.0), (1, 6.0), (0, 2.5), (1, -2.5)):
            fd = f * 2 ** (cents / 1200); lfo = 1 + 0.12 * np.sin(TAU * r.uniform(0.1, 0.45) * t + r.uniform(0, TAU))
            v = np.zeros(n)
            for k in range(1, nh + 1):
                if fd * k > 8500:
                    break
                v += (1 / k ** roll) * np.sin(TAU * fd * k * t + r.uniform(0, TAU))
            out[:, ch] += v * lfo
    if kind == "air":
        br = filt(np.random.default_rng(5).standard_normal((n, 2)), "bp", (mtof(midis[0]) * 2, mtof(midis[-1]) * 5))
        out += br * 0.5 * np.max(np.abs(out)) / (np.max(np.abs(br)) + 1e-9)
    if kind == "trem":
        out *= (0.62 + 0.38 * np.sin(TAU * 10.5 * t + 0.4))[:, None]
    e = np.clip(t / atk, 0, 1) ** 1.3 * np.clip((dur + rel - t) / rel, 0, 1) ** 1.5
    out *= e[:, None]
    return (out / (np.max(np.abs(out)) + 1e-9)).astype(np.float32)


# ----------------------------------------------------------------------------------------------- harmony & motif
CH = {  # name: (bass root midi, close-position triad around middle C)
    "Dm": (38, (62, 65, 69)), "Bb": (34, (58, 62, 65)), "F": (41, (60, 65, 69)), "C": (36, (60, 64, 67)),
    "Gm": (43, (58, 62, 67)), "A": (33, (61, 64, 69)), "Dsus": (38, (62, 67, 69)), "Eb": (39, (58, 63, 67)),
}
# (beat offset, midi, length in beats): the motif (2 bars) and its answer (2 bars)
MOTIF = [(0, 62, 1), (1, 65, 1), (2, 69, 1.5), (3.5, 67, .5), (4, 65, 1), (5, 64, 1), (6, 62, 2)]
ANSWER = [(0, 69, 1), (1, 72, 1), (2, 74, 1.5), (3.5, 72, .5), (4, 69, 1), (5, 67, 1), (6, 64, 2)]
ANSWER_SOFT = [(0, 69, 1), (1, 72, 1), (2, 74, 1.5), (3.5, 72, .5), (4, 69, 1), (5, 67, 1), (6, 65, 2)]
MOTIF_F = [(0, 65, 1), (1, 69, 1), (2, 72, 1.5), (3.5, 70, .5), (4, 69, 1), (5, 67, 1), (6, 65, 2)]
CLOSE_C = [(0, 67, 2), (2, 64, 2), (4, 62, 1), (5, 64, 1), (6, 64, 2)]
TITLE_MOTIF = [(0, 62, 2), (2, 65, 2), (4, 69, 3), (7, 67, 1), (8, 65, 2), (10, 62, 2), (12, 64, 4)]


class _Ctx:
    def __init__(self, n, sec_n, inten, rng):
        self.n, self.sec_n, self.inten, self.rng = n, max(1, sec_n), inten, rng
        self.buf = np.zeros((n, 2), np.float32); self.drum = np.zeros((n, 2), np.float32)
        self.nbars = int(math.ceil(n / BARN))

    def prog(self, beat: float) -> float:          # 0..1 progress through the section proper
        return min(1.0, max(0.0, beat * BEATN / self.sec_n))

    def note(self, inst, midi, beats, at, gain=1.0, pan=0.0, human=0.004):
        x = _note(inst, int(midi), int(round(beats * BEAT * 1000)))
        j = int(self.rng.uniform(-human, human) * SR) if human else 0
        g = gain * (1 + self.rng.uniform(-0.08, 0.08))
        _put(self.drum if inst in _DRUMS else self.buf, int(round(at * BEATN)) + j, x, g, pan)

    def pad(self, kind, midis, beats, at, gain=1.0):
        _put(self.buf, int(round(at * BEATN)), _pad(kind, tuple(int(m) for m in midis), int(round(beats * BEAT * 1000))), gain)

    def line(self, inst, notes, at, gain=1.0, pan=0.0, tr=0, stretch=1.0, lenmul=1.0):
        for b, m, ln in notes:
            self.note(inst, m + tr, ln * stretch * lenmul, at + b * stretch, gain, pan)

    def cont(self, x, gain=1.0):                   # continuous stereo/mono layer over the whole stem
        if x.ndim == 1:
            self.buf[:, 0] += (x * gain).astype(np.float32); self.buf[:, 1] += (x * gain).astype(np.float32)
        else:
            self.buf += (x * gain).astype(np.float32)


def _drone(n, f, seed, rough=0.0, sub=0.0):
    t = _tt(n); r = np.random.default_rng(seed)
    x = np.sin(TAU * f * t) * (0.8 + 0.2 * np.sin(TAU * 0.07 * t + r.uniform(0, 6))) + 0.5 * np.sin(TAU * f * 2 * t + 1) * (0.6 + 0.4 * np.sin(TAU * 0.11 * t + r.uniform(0, 6)))
    x += 0.22 * np.sin(TAU * f * 3.01 * t) * (0.5 + 0.5 * np.sin(TAU * 0.05 * t + 2))
    x += 0.12 * np.sin(TAU * f * 4.0 * t + 0.7) * (0.5 + 0.5 * np.sin(TAU * 0.083 * t + 1)) + 0.07 * np.sin(TAU * f * 5.99 * t) * (0.5 + 0.5 * np.sin(TAU * 0.061 * t + 4))
    if sub:
        x += sub * np.sin(TAU * f * 0.5 * t)
    if rough:
        x += rough * filt(_noise(n, seed + 1), "bp", (f * 1.5, f * 5)) * (0.6 + 0.4 * np.sin(TAU * 0.13 * t))
    return x


# ----------------------------------------------------------------------------------------------- mood generators

def _g_mystic(c):
    prog = ["Dm", "Bb", "Gm", "A"]; pat = [0, 1, 2, 1, 3, 2, 1, 2]
    for bar in range(c.nbars):
        root, tri = CH[prog[(bar // 2) % 4]]; b0 = bar * 4
        if bar % 2 == 0:
            c.pad("air", (tri[0] - 12, tri[1], tri[2], tri[0] + 12), 8, b0, 0.55)
            c.note("cello", root, 8, b0, 0.34)
            rot = int(c.rng.integers(0, 8))
        tones = [tri[0] + 12, tri[1] + 12, tri[2] + 12, tri[0] + 24]
        for e in range(8):
            if c.rng.random() < 0.62 + 0.35 * c.inten:
                m = tones[pat[(e + rot) % 8]] + (12 if c.rng.random() < 0.12 else 0)
                c.note("bell", m, 1, b0 + e * 0.5, 0.2 * (1.25 if e % 4 == 0 else 1.0), pan=0.45 * (1 if e % 2 else -1))
        if bar % 8 == 4:
            c.line("bell", MOTIF, b0, 0.34, pan=0.1, tr=12)
        if bar % 8 == 6 and c.inten > 0.5:
            c.line("glock", ANSWER_SOFT, b0, 0.16, pan=-0.2, tr=12)


def _g_dread(c):
    c.cont(_drone(c.n, mtof(38), 3, rough=0.3, sub=0.3), 0.36)
    c.cont(filt(_drone(c.n, mtof(50), 4, rough=0.6), "lp", 900), 0.16)
    t = _tt(c.n); air = filt(np.random.default_rng(41).standard_normal((c.n, 2)), "bp", (1600, 5200))
    c.cont(air * (0.5 + 0.5 * np.sin(TAU * 0.12 * t))[:, None], 0.012)
    for bar in range(c.nbars):
        b0 = bar * 4
        if bar % 2 == 0:
            c.note("metal", int(c.rng.choice([50, 51, 56, 57, 62, 69, 74])), 6, b0 + (0 if bar % 4 == 0 else 1), 0.36, pan=float(c.rng.uniform(-0.6, 0.6)))
        if bar % 4 == 0:
            c.note("bigdrum", 0, 1, b0, 0.95); c.note("kick", 0, 1, b0, 0.6)
            if c.rng.random() < 0.25 + 0.5 * c.inten:
                c.note("bigdrum", 0, 1, b0 + 2.5, 0.5)
        if bar % 8 == 2:
            c.note("eerie", 81, 5, b0, 0.11, pan=0.3); c.note("eerie", 82, 5, b0 + 1, 0.08, pan=-0.3)
        if bar % 8 == 4:   # the motif, slowed and distorted in the bass register
            for i, (b, m, ln) in enumerate(MOTIF[:4]):
                c.note("dist", m - 24, 2, b0 + i * 2, 0.34)
        if bar % 4 == 3 and c.inten > 0.55:
            c.pad("trem", (62, 63), 3, b0 + 1, 0.12)


def _g_drive(c):
    prog = ["Dm", "Bb", "F", "C"]; fast = c.inten > 0.62
    p8 = [0, 1, 2, 1, 0, 1, 3, 1]; p16 = [0, 0, 1, 0, 2, 0, 1, 0, 0, 0, 1, 0, 3, 0, 1, 0]
    for bar in range(c.nbars):
        root, tri = CH[prog[bar % 4]]; b0 = bar * 4; phrase = bar // 4
        c.pad("str", (tri[0] - 12, tri[1], tri[2]), 4, b0, 0.3)
        c.note("cello", root, 4, b0, 0.5); c.note("cello", root + 12, 4, b0, 0.22, pan=0.25)
        ost = [tri[0] - 12, tri[2] - 12, tri[0], tri[1]]
        steps = 16 if fast else 8
        for s in range(steps):
            idx = (p16 if fast else p8)[s]; acc = s % (steps // 4) == 0
            c.note("spic", ost[idx], 0.25 if fast else 0.5, b0 + s * 4 / steps, 0.34 if acc else 0.2, pan=-0.3)
            if s % (steps // 4) == 0:
                c.note("spic", root + 12, 0.5, b0 + s * 4 / steps, 0.3, pan=0.35)
        hits = [(0, 1.0), (1.5, 0.55), (2, 0.8), (3.5, 0.55)] if bar % 4 != 3 else [(0, 1.0), (1.5, 0.55), (2, 0.8), (3, 0.6), (3.25, 0.5), (3.5, 0.7), (3.75, 0.8)]
        for b, g in hits:
            c.note("taiko", 0, 1, b0 + b, 0.6 * g, pan=-0.15 if b % 1 else 0.15)
        if bar % 2 == 0 or c.inten > 0.4:
            c.note("bigdrum", 0, 1, b0, 0.7)
        for e in range(8):
            c.note("hat", 0, 1, b0 + e * 0.5, 0.11 if e % 2 else 0.06, pan=0.4)
        if c.inten > 0.25 and bar % 4 == 0:   # the motif, heroic: horns, then horns + high strings
            hi = phrase % 2 == 1
            c.line("horn", MOTIF, b0, 0.36 if hi else 0.28, pan=0.1); c.line("horn", ANSWER, b0 + 8, 0.36 if hi else 0.28, pan=0.1)
            if hi:
                c.line("spic", MOTIF, b0, 0.26, pan=-0.35, tr=12, lenmul=1.0); c.line("spic", ANSWER, b0 + 8, 0.26, pan=-0.35, tr=12)


def _g_wonder(c):
    prog = ["F", "C", "Dm", "Bb"]
    for bar in range(c.nbars):
        root, tri = CH[prog[(bar // 2) % 4]]; b0 = bar * 4
        if bar % 2 == 0:
            c.pad("warm", (tri[0] - 12, tri[0], tri[1], tri[2]), 8, b0, 0.6); c.note("cello", root + 12, 8, b0, 0.26)
            up = c.rng.random() < 0.6
        tones = [tri[0], tri[1], tri[2], tri[0] + 12, tri[1] + 12, tri[2] + 12]
        seq = [0, 1, 2, 3, 4, 3, 2, 1] if up else [3, 2, 1, 0, 1, 2, 4, 5]
        for e in range(8):
            if c.rng.random() < 0.8 + 0.2 * c.inten:
                c.note("harp", tones[seq[e]], 1, b0 + e * 0.5, 0.26 * (1.2 if e % 4 == 0 else 1), pan=0.5 * math.sin(e * 0.8 + bar))
        if bar % 8 == 4:
            c.line("glock", MOTIF_F, b0, 0.14, pan=0.2, tr=12)
        if bar % 8 == 2 and c.inten > 0.5:
            c.note("bell", tri[2] + 24, 2, b0 + 2, 0.12, pan=-0.4)


def _g_tension(c):
    for bar in range(c.nbars):
        b0 = bar * 4; p = c.prog(b0)
        for e in range(8):
            c.note("tickp", 0, 1, b0 + e * 0.5, (0.2 if e % 4 == 0 else 0.1) * (0.7 + 0.5 * p), pan=0.3 if e % 2 else -0.3)
            c.note("spic", 38, 0.5, b0 + e * 0.5, (0.16 + 0.2 * p) * (1.3 if e % 4 == 0 else 1), pan=0.0)
            if p > 0.5 and e % 2:
                c.note("spic", 50, 0.25, b0 + e * 0.5 + 0.25, 0.1 + 0.12 * p, pan=0.2)
        c.note("kick", 0, 1, b0, 0.4); c.note("kick", 0, 1, b0 + 2, 0.32)
        if p > 0.6:
            c.note("kick", 0, 1, b0 + 3.5, 0.35)
        if bar % 2 == 0:
            step = int(p * 4.99)
            c.pad("trem", (57, 62, 63 + step), 8, b0, 0.2 + 0.26 * p + 0.1 * c.inten)
            c.note("cello", 38, 8, b0, 0.4); c.note("cello", 50, 8, b0, 0.2, pan=0.2)
        if bar % 4 == 2:
            c.note("metal", 62 + int(c.rng.integers(0, 3)), 5, b0, 0.16 + 0.12 * p, pan=float(c.rng.uniform(-0.5, 0.5)))
        if bar % 8 == 6:
            for i, (b, m, ln) in enumerate(MOTIF[:3]):
                c.note("pizz", m - 12, 1, b0 + i * 1.5, 0.3, pan=-0.2)


def _g_emotional(c):
    prog = ["Dm", "Bb", "F", "C"]; mel = [MOTIF, ANSWER_SOFT, MOTIF_F, CLOSE_C]
    for bar in range(c.nbars):
        k = (bar // 2) % 4; root, tri = CH[prog[k]]; b0 = bar * 4; cycle = bar // 8
        if bar % 2 == 0:
            c.pad("warm", (tri[0] - 12, tri[1] - 12, tri[2] - 12, tri[0]), 8, b0, 0.34 + 0.2 * c.inten)
            if cycle % 2 == 1 or c.inten > 0.7:
                c.pad("str", (tri[1], tri[2]), 8, b0, 0.13)
            up = 12 if (cycle % 2 == 1 and c.inten > 0.45) else 0
            c.line("piano", mel[k], b0, 0.62, pan=0.08, tr=up)
            if up:
                c.line("piano", mel[k], b0, 0.2, pan=0.12, tr=0)
        lh = [root + 12, root + 19, tri[1] if tri[1] > root + 19 else tri[1] + 12, root + 19]
        for q in range(4):
            c.note("piano", lh[q], 1, b0 + q, 0.26 * (1.2 if q == 0 else 1), pan=-0.18)
        if bar % 2 == 0:
            c.note("piano", root + 12 if root < 36 else root, 4, b0, 0.3, pan=-0.2)


def _g_battle(c):
    prog = ["Dm", "Dm", "Bb", "C"]; p16 = [0, 0, 2, 0, 1, 0, 2, 0, 0, 0, 3, 0, 1, 0, 2, 1]
    for bar in range(c.nbars):
        root, tri = CH[prog[bar % 4]]; b0 = bar * 4; ost = [tri[0] - 12, tri[2] - 12, tri[1] - 12, tri[0]]
        c.pad("str", (tri[0] - 12, tri[1], tri[2]), 4, b0, 0.22)
        for s in range(16):
            c.note("spic", ost[p16[s]], 0.25, b0 + s * 0.25, 0.36 if s % 4 == 0 else 0.22, pan=-0.3)
            if s % 2 == 0:
                c.note("spic", root + 12, 0.5, b0 + s * 0.25, 0.3 if s % 4 == 0 else 0.2, pan=0.35)
        c.note("cello", root, 4, b0, 0.5)
        fill = bar % 4 == 3
        for b, g in [(0, 1), (0.75, .5), (2, .9), (2.75, .5), (3.5, .6)]:
            c.note("bigdrum", 0, 1, b0 + b, 0.72 * g)
        for b in (1, 3):
            c.note("taiko", 0, 1, b0 + b, 0.6, pan=0.2)
        if fill:
            for i in range(8):
                c.note("tom" if i % 2 else "taiko", 0, 1, b0 + 2 + i * 0.25, 0.4 + 0.05 * i, pan=-0.4 + 0.1 * i)
        for s in range(16):
            c.note("hat", 0, 1, b0 + s * 0.25, 0.11 if s % 4 == 2 else 0.055, pan=0.45)
        st = (tri[0] - 12, tri[2] - 12, tri[0], tri[1])
        for b, ln, g in [(0, 1, 0.3), (2.5, 0.5, 0.24)]:
            for m in st:
                c.note("brass", m, ln, b0 + b, g * 0.5, pan=0.15)
        if bar % 4 == 0:
            c.line("brass", MOTIF, b0, 0.34, pan=0.05)
            c.line("brass", ANSWER, b0 + 8, 0.34, pan=0.05)
            if c.inten > 0.6:
                c.line("horn", MOTIF, b0, 0.22, pan=-0.2, tr=-12); c.line("horn", ANSWER, b0 + 8, 0.22, pan=-0.2, tr=-12)


def _g_heist(c):
    prog = ["Dm", "Dm", "Gm", "A"]
    for bar in range(c.nbars):
        root, tri = CH[prog[bar % 4]]; b0 = bar * 4; r = root + 12 if root < 40 else root
        for b, off in [(0, 0), (1.5, 7), (2, 12), (3, 10), (3.5, 7)]:
            if b != 3.5 or c.rng.random() < 0.7:
                c.note("pizz", r + off, 0.5, b0 + b, 0.5 if b == 0 else 0.38, pan=-0.1)
        for b in ((1, 3) if c.rng.random() < 0.7 else (1, 2.5, 3)):
            for m in tri:
                c.note("pizz", m, 0.5, b0 + b, 0.2, pan=0.3)
        c.note("rim", 0, 1, b0 + 1, 0.22, pan=0.25); c.note("rim", 0, 1, b0 + 3, 0.22, pan=0.25)
        for e in range(8):
            c.note("shaker", 0, 1, b0 + e * 0.5, 0.07 if e % 2 else 0.04, pan=-0.4)
        if bar % 4 == 0:
            c.note("kick", 0, 1, b0, 0.45)
        if bar % 4 == 2:
            for i, (b, m, ln) in enumerate(MOTIF[:4]):
                c.note("glock", m, 0.5, b0 + b, 0.15, pan=0.1)
        if bar % 8 == 7:
            c.pad("trem", (57, 61), 3, b0 + 1, 0.1)


def _g_cliff(c):
    n = c.n; t = _tt(n); p = np.clip(np.arange(n) / c.sec_n, 0, 1.15)
    build = (0.22 + 0.78 * np.clip(p, 0, 1)) ** 1.6
    low = _drone(n, mtof(38), 8, rough=0.4, sub=0.08) * 0.34 + _drone(n, mtof(45), 9, rough=0.25) * 0.25
    clus = np.zeros((n, 2)); r = np.random.default_rng(12)
    for m, g, pn in [(50, .5, -0.3), (57, .45, 0.3), (62, .4, -0.5), (63, .34, 0.5), (69, .22, 0.0)]:
        f = mtof(m); v = sum((1 / k ** 1.3) * np.sin(TAU * f * k * (1 + 0.0009 * np.sin(TAU * 0.21 * t + m)) * t + r.uniform(0, 6)) for k in range(1, 7))
        v *= 0.7 + 0.3 * np.sin(TAU * r.uniform(0.15, 0.4) * t + r.uniform(0, 6))
        if m == 63:
            v *= np.clip((p - 0.25) / 0.4, 0, 1)
        clus[:, 0] += v * g * (1 - pn) / 2; clus[:, 1] += v * g * (1 + pn) / 2
    hi = (np.sin(TAU * mtof(81) * t) + np.sin(TAU * mtof(82) * t)) * (0.6 + 0.4 * np.sin(TAU * 10.5 * t)) * np.clip((p - 0.4) / 0.5, 0, 1) ** 2
    c.cont(low * build, 0.42); c.cont(clus * build[:, None], 0.4); c.cont(hi * build, 0.07)
    nb = c.nbars * 4
    for b in range(nb):
        pb = c.prog(b); div = 1 if pb < 0.55 else 2 if pb < 0.85 else 4
        for s in range(div):
            c.note("taiko", 0, 1, b + s / div, (0.14 + 0.3 * pb) * (1 if s == 0 else 0.7), pan=-0.1)
            if s == 0 and b % 4 == 0:
                c.note("kick", 0, 1, b, 0.2 + 0.3 * pb)
            if pb > 0.5:
                c.note("tom", 0, 1, b + s / div, (pb - 0.4) * 0.4, pan=0.25)
        if pb > 0.3 and b % 2 == 0:
            c.note("tickp", 0, 1, b + 0.5, 0.08 + 0.1 * pb, pan=0.3)


def _g_playful(c):
    prog = ["F", "C", "Dm", "Bb"]
    for bar in range(c.nbars):
        root, tri = CH[prog[bar % 4]]; b0 = bar * 4; r = root + 12 if root < 40 else root
        c.note("pizz", r, 0.5, b0, 0.5, pan=-0.1); c.note("pizz", r + 7, 0.5, b0 + 2, 0.42, pan=-0.1)
        for b in ((1, 3) if c.rng.random() < 0.6 else (1, 1.5, 3)):
            for m in tri:
                c.note("pizz", m, 0.5, b0 + b, 0.22, pan=0.3)
        for e in range(8):
            c.note("shaker", 0, 1, b0 + e * 0.5, 0.05 if e % 2 else 0.025, pan=0.4)
        if bar % 4 == 0:
            c.line("mbox", MOTIF, b0, 0.22, pan=0.15, tr=24); c.line("mbox", ANSWER_SOFT, b0 + 8, 0.22, pan=0.15, tr=24)
        elif c.rng.random() < 0.5:
            c.note("glock", tri[int(c.rng.integers(0, 3))] + 24, 0.5, b0 + 3.5, 0.12, pan=-0.3)


def _g_title(c):
    prog = ["Dm", "F", "Bb", "A"]
    for bar in range(c.nbars):
        root, tri = CH[prog[bar % 4]]; b0 = bar * 4
        if bar % 2 == 0:
            c.note("braam", 38, 4.5, b0, 0.8)
        c.pad("str", (tri[0] - 12, tri[1] - 12, tri[2] - 12, tri[0], tri[2]), 4, b0, 0.34)
        c.pad("trem", (81,) if bar % 4 != 3 else (81, 85), 4, b0, 0.07)
        c.note("cello", root, 4, b0, 0.5)
        for b, g in ([(0, 1.0), (1.5, .6), (3, .75)] if bar % 2 == 0 else [(0, .9), (1.5, .6), (2.5, .6), (3, .7), (3.5, .8)]):
            c.note("bigdrum", 0, 1, b0 + b, 0.95 * g); c.note("taiko", 0, 1, b0 + b, 0.4 * g, pan=0.2)
        if bar >= 1:
            for e in range(8):
                c.note("taiko", 0, 1, b0 + e * 0.5, 0.16 if e % 2 else 0.1, pan=-0.3)
        if bar % 4 == 0:   # the motif, big and slow, in octaves
            c.line("brass", TITLE_MOTIF, b0, 0.42, pan=0.0, tr=-12); c.line("horn", TITLE_MOTIF, b0, 0.34, pan=0.15)
            c.line("spic", TITLE_MOTIF, b0, 0.2, pan=-0.3, tr=12)


def _g_silence(c):
    air = filt(np.random.default_rng(31).standard_normal((c.n, 2)), "bp", (180, 1400)) * 0.5
    t = _tt(c.n); sub = np.sin(TAU * mtof(26) * t) * (0.6 + 0.4 * np.sin(TAU * 0.09 * t))
    c.cont(air, 0.02); c.cont(sub, 0.004)


GEN = {"mystic": _g_mystic, "dread": _g_dread, "drive": _g_drive, "wonder": _g_wonder, "tension": _g_tension, "emotional": _g_emotional,
       "battle": _g_battle, "heist": _g_heist, "cliff": _g_cliff, "playful": _g_playful, "title": _g_title, "silence": _g_silence}
# reverb send (melodic, drums), fade-in s, fade-out s, level trim dB (calibrated so intensity 0.7 hits TARGET_LUFS)
MOOD = {
    "mystic":    dict(rev=(0.34, 0.10), fin=0.35, fout=1.0, trim=0.0, riser=0.0),
    "dread":     dict(rev=(0.34, 0.16), fin=0.05, fout=1.2, trim=0.0, riser=0.6),
    "drive":     dict(rev=(0.18, 0.08), fin=0.03, fout=0.7, trim=0.0, riser=1.0),
    "wonder":    dict(rev=(0.30, 0.10), fin=0.30, fout=1.0, trim=0.0, riser=0.0),
    "tension":   dict(rev=(0.16, 0.07), fin=0.05, fout=0.6, trim=0.0, riser=0.5),
    "emotional": dict(rev=(0.30, 0.10), fin=0.20, fout=1.2, trim=0.0, riser=0.0),
    "battle":    dict(rev=(0.15, 0.08), fin=0.02, fout=0.6, trim=0.0, riser=1.0),
    "heist":     dict(rev=(0.13, 0.08), fin=0.03, fout=0.6, trim=0.0, riser=0.0),
    "cliff":     dict(rev=(0.30, 0.12), fin=0.30, fout=0.18, trim=0.0, riser=0.0),
    "playful":   dict(rev=(0.15, 0.08), fin=0.03, fout=0.6, trim=0.0, riser=0.0),
    "title":     dict(rev=(0.28, 0.14), fin=0.01, fout=1.2, trim=0.0, riser=1.0),
    "silence":   dict(rev=(0.0, 0.0), fin=0.5, fout=0.5, trim=0.0, riser=0.0),
}
# integrated loudness each mood is calibrated to at intensity 0.7 (music bus, before ducking)
TARGET_LUFS = {"title": -17.0, "battle": -18.0, "drive": -19.0, "dread": -21.5, "tension": -21.5, "cliff": -21.0, "emotional": -22.0,
               "heist": -22.5, "mystic": -23.0, "wonder": -23.0, "playful": -23.5, "silence": -44.0}
# measured raw stem loudness at intensity 0.7 (python -m copycat.score --calibrate); trim = target - raw
RAW_LUFS = {"mystic": -9.7, "dread": -10.0, "drive": -5.2, "wonder": -9.9, "tension": -9.3, "emotional": -9.3, "battle": -4.5, "heist": -19.9, "cliff": -13.6, "playful": -19.1, "title": -2.5, "silence": -49.5}


@functools.lru_cache(maxsize=1)
def _reverb_ir() -> np.ndarray:
    r = np.random.default_rng(99); n = int(2.4 * SR); t = _tt(n)
    ir = r.standard_normal((n, 2)) * np.exp(-t / 0.33)[:, None]
    ir = filt(filt(ir, "lp", 5200), "hp", 260); pre = int(0.018 * SR)
    ir[:pre] = 0; ir[pre:pre + 480] *= np.linspace(0, 1, 480)[:, None]
    return (ir / np.sqrt(np.sum(ir ** 2, axis=0))).astype(np.float64)


def _render_mood(mood: str, n: int, sec_n: int, inten: float, rng, calibrated: bool = True) -> np.ndarray:
    c = _Ctx(n, sec_n, inten, rng); GEN[mood](c); cfg = MOOD[mood]
    out = c.buf.astype(np.float64) + c.drum
    if cfg["rev"][0] > 0:
        send = c.buf * cfg["rev"][0] + c.drum * cfg["rev"][1]; ir = _reverb_ir()
        for ch in range(2):
            out[:, ch] += signal.oaconvolve(send[:, ch], ir[:, ch])[:n] * 1.2
    g = 10 ** (((TARGET_LUFS[mood] - RAW_LUFS[mood]) if calibrated else 0.0) / 20)
    return (out * g).astype(np.float32)


def _snap(t: float) -> int:
    return int(round(t * SR / SIXTEENTH)) * SIXTEENTH


def _merge(sections, duration):
    secs = sorted(({"start": float(s["start"]), "end": float(s["end"]), "mood": s.get("mood", "silence") if s.get("mood") in GEN else "silence",
                    "intensity": float(s.get("intensity", 0.7))} for s in sections), key=lambda s: s["start"])
    if not secs:
        secs = [{"start": 0.0, "end": duration, "mood": "silence", "intensity": 0.5}]
    secs[0]["start"] = 0.0; secs[-1]["end"] = max(secs[-1]["end"], duration); out = []
    for s in secs:
        if s["end"] - s["start"] <= 0:
            continue
        if out and out[-1]["mood"] == s["mood"]:
            out[-1]["parts"].append((s["start"], s["end"], s["intensity"])); out[-1]["end"] = s["end"]
        else:
            out.append({"start": s["start"], "end": s["end"], "mood": s["mood"], "parts": [(s["start"], s["end"], s["intensity"])]})
    for i in range(len(out) - 1):
        out[i]["end"] = out[i + 1]["start"]
    return out


def _transition_riser(n_s: float, seed: int) -> np.ndarray:
    n = int(n_s * SR); u = np.linspace(0, 1, n)
    x = _sweep_noise(n, 500, 7000, seed, bands=8, bw=1.0, width=2.2) * u ** 2.5
    x[-int(0.012 * SR):] *= np.linspace(1, 0, int(0.012 * SR))
    return _stereo(_norm(x), 0.35, seed).astype(np.float32)


def compose(duration: float, sections: list[dict], seed: int = 1) -> np.ndarray:
    """Render the score. sections: [{start, end, mood, intensity}] (contiguous). Returns (n, 2) float32, peak < 1."""
    n = int(round(duration * SR)); out = np.zeros((n, 2), np.float32); secs = _merge(sections, duration)
    bounds = [0] + [min(n, _snap(s["start"])) for s in secs[1:]] + [n]
    for i, s in enumerate(secs):
        a, b = bounds[i], bounds[i + 1]
        if b - a < SIXTEENTH:
            continue
        cfg = MOOD[s["mood"]]; tail = int((cfg["fout"] + 0.05) * SR); L = b - a + tail
        dur_w = sum(e - st for st, e, _ in s["parts"]); inten = sum((e - st) * it for st, e, it in s["parts"]) / max(1e-6, dur_w)
        rng = np.random.default_rng([int(seed), i, MOODS.index(s["mood"])])
        stem = _render_mood(s["mood"], L, b - a, inten, rng)
        # intensity -> level (-5 dB .. +2 dB around 0.7), piecewise per original sub-section, smoothed
        env = np.empty(L, np.float32); env[:] = 10 ** ((7 * (inten - 0.7)) / 20)
        for st, e, it in s["parts"]:
            i0, i1 = max(0, int(st * SR) - a), min(L, int(e * SR) - a)
            if i1 > i0:
                env[i0:i1] = 10 ** ((7 * (it - 0.7)) / 20)
        env[b - a:] = env[max(0, b - a - 1)]
        env = uniform_filter1d(env, size=int(0.5 * SR), mode="nearest")
        fin = int(cfg["fin"] * SR) if i > 0 else int(0.01 * SR)
        env[:fin] *= np.linspace(0, 1, fin) ** 1.5
        fo = int(cfg["fout"] * SR); env[b - a:b - a + fo] *= np.cos(np.linspace(0, np.pi / 2, fo)) ** 2; env[b - a + fo:] = 0
        if i == len(secs) - 1:      # end of film: let the last mood breathe out before the hard end
            end_f = min(b - a, int(1.5 * SR)); env[b - a - end_f:b - a] *= np.linspace(1, 0, end_f) ** 1.2
        stem *= env[:, None]
        e_ = min(n, a + L); out[a:e_] += stem[: e_ - a]
        prev = secs[i - 1]["mood"] if i else None
        if i and cfg["riser"] > 0 and prev not in ("silence", "cliff") and a > SR:
            rs = _transition_riser(1.2, seed + i) * (0.05 + 0.07 * inten) * cfg["riser"] * 10 ** ((TARGET_LUFS[s["mood"]] + 19) / 20)
            st = max(0, a - len(rs)); out[st:a] += rs[len(rs) - (a - st):]
    # music-bus EQ, then a safety limiter
    out = signal.sosfilt(_music_eq(), out.astype(np.float64), axis=0)
    return _limit(out, 0.89).astype(np.float32)


# ----------------------------------------------------------------------------------------------- loudness / dynamics

def _limit(x: np.ndarray, thr: float = 0.84, look_ms: float = 5.0) -> np.ndarray:
    """Look-ahead peak limiter (linked stereo). Guarantees |sample| <= thr."""
    pk = np.max(np.abs(x), axis=1) if x.ndim == 2 else np.abs(x)
    if float(pk.max(initial=0.0)) <= thr:
        return x
    g = np.minimum(1.0, thr / np.maximum(pk, 1e-9)); L = int(look_ms * SR / 1000)
    g = minimum_filter1d(g, size=2 * L + 1, mode="nearest"); g = uniform_filter1d(g, size=L, mode="nearest")
    rel = int(0.08 * SR); g2 = minimum_filter1d(g, size=rel, mode="nearest", origin=rel // 2 - 1)   # hold reduction ~80 ms after a peak
    g = np.minimum(g, uniform_filter1d(g2, size=rel // 2, mode="nearest"))
    return x * (g[:, None] if x.ndim == 2 else g)


_K1 = np.array([[1.53512485958697, -2.69169618940638, 1.19839281085285, 1.0, -1.69065929318241, 0.73248077421585]])
_K2 = np.array([[1.0, -2.0, 1.0, 1.0, -1.99004745483398, 0.99007225036621]])


def lufs(x: np.ndarray) -> float:
    """Integrated loudness, ITU-R BS.1770-4 (K-weighting, 400 ms blocks / 75 % overlap, -70 abs & -10 rel gates)."""
    x = np.asarray(x, np.float64); x = x[:, None] if x.ndim == 1 else x
    y = signal.sosfilt(np.vstack([_K1, _K2]), x, axis=0); hop = SR // 10; nb = len(y) // hop
    if nb < 4:
        return -70.0
    ms = (y[: nb * hop] ** 2).reshape(nb, hop, -1).mean(axis=1).sum(axis=1)   # per-100ms power, channels summed
    blk = (ms[:-3] + ms[1:-2] + ms[2:-1] + ms[3:]) / 4
    lk = -0.691 + 10 * np.log10(np.maximum(blk, 1e-12)); keep = lk > -70
    if not keep.any():
        return -70.0
    rel = -0.691 + 10 * np.log10(blk[keep].mean()) - 10; keep &= lk > rel
    return float(-0.691 + 10 * np.log10(blk[keep].mean())) if keep.any() else -70.0


def true_peak_db(x: np.ndarray) -> float:
    """4x-oversampled peak in dBFS (chunked)."""
    x = np.asarray(x); x = x[:, None] if x.ndim == 1 else x; pk = 0.0; ch = 20 * SR; ov = 2048
    for st in range(0, len(x), ch):
        seg = x[max(0, st - ov): st + ch + ov]
        if float(np.max(np.abs(seg), initial=0)) < 0.25 * max(pk, 1e-3):
            continue
        pk = max(pk, float(np.max(np.abs(signal.resample_poly(seg, 4, 1, axis=0)))))
    return 20 * math.log10(max(pk, 1e-9))


def _follow(target: np.ndarray, atk_s: float, rel_s: float, rate: float) -> np.ndarray:
    """One-pole follower at control rate: 'attack' when the target falls (gain reduction), 'release' when it rises."""
    ka, kr = math.exp(-1 / (atk_s * rate)), math.exp(-1 / (rel_s * rate)); out = np.empty_like(target); y = float(target[0])
    for i, v in enumerate(target.tolist()):
        k = ka if v < y else kr; y = v + (y - v) * k; out[i] = y
    return out


CR = 1000                      # control rate for envelopes (Hz)
_CH = SR // CR


def _ctrl_rms(x: np.ndarray) -> np.ndarray:
    m = len(x) // _CH
    return np.sqrt((x[: m * _CH].astype(np.float64) ** 2).reshape(m, _CH).mean(axis=1) + 1e-12)


def _up(ctrl: np.ndarray, n: int) -> np.ndarray:
    return np.interp(np.arange(n), (np.arange(len(ctrl)) + 0.5) * _CH, ctrl).astype(np.float32)


def _vo_bus(duration: float, vo) -> np.ndarray:
    n = int(round(duration * SR)); bus = np.zeros(n, np.float64)
    for start, x, sr in vo:
        x = np.asarray(x, np.float64)
        if x.ndim == 2:
            x = x.mean(axis=1)
        if not len(x):
            continue
        if sr != SR:
            g = math.gcd(SR, int(sr)); x = signal.resample_poly(x, SR // g, int(sr) // g)
        e = _ctrl_rms(x)                                             # level each clip on its speech-active RMS
        act = e[e > max(1e-4, e.max() * 0.06)] if len(e) else e
        if len(act):
            x = x * (10 ** (-21 / 20) / math.sqrt(float(np.mean(act ** 2))))
        x = _fade(x, 0.004, 0.012); s = int(round(start * SR))
        if s < n:
            bus[max(0, s): s + len(x)] += x[max(0, -s): n - s]
    sos = np.vstack([_sos("hp", 75.0), peaking(170, 1.5, 0.7), peaking(3100, 1.2, 0.9), peaking(7200, -2.5, 1.3)])
    bus = signal.sosfilt(sos, bus)
    env = _follow(-_ctrl_rms(bus), 0.008, 0.12, CR) * -1            # fast-attack / slow-release level detector
    db = 20 * np.log10(np.maximum(env, 1e-7)); over = np.maximum(0, db - (-26.0))
    gr = 10 ** ((-over * (1 - 1 / 2.6)) / 20)                        # 2.6:1 above -26 dBFS RMS
    return bus * _up(gr, n) * 10 ** (3.0 / 20)


def duck_envelope(vo_bus: np.ndarray, depth_db: float = 14.0) -> np.ndarray:
    """Music gain (linear, audio rate): depth_db down under speech, ~80 ms attack, ~450 ms release, 60 ms look-ahead."""
    e = _ctrl_rms(vo_bus); present = (e > 10 ** (-44 / 20)).astype(np.float64)
    present = maximum_filter1d(present, size=int(0.18 * CR), mode="nearest")           # bridge gaps between syllables
    present = np.concatenate([present[int(0.06 * CR):], np.zeros(int(0.06 * CR))])     # look-ahead
    tgt = np.where(present > 0, 10 ** (-depth_db / 20), 1.0)
    g = _follow(tgt, 0.08 / 2.2, 0.45 / 2.2, CR)                                       # 10-90 % times ~= 80 / 450 ms
    return _up(g, len(vo_bus))


def mix(duration: float, vo: list, music: np.ndarray, sfx_events: list, seed: int = 1) -> np.ndarray:
    """Final master: VO centre, ducked music, placed SFX, limiter, about -14 LUFS integrated, true peak <= -1 dBFS."""
    n = int(round(duration * SR)); v = _vo_bus(duration, vo)
    mus = np.zeros((n, 2), np.float64); m = np.asarray(music, np.float64)
    if m.ndim == 1:
        m = np.stack([m, m], axis=1)
    mus[: min(n, len(m))] = m[:n]
    duck = duck_envelope(v) if len(vo) else np.ones(n, np.float32)
    out = mus * duck[:, None]
    out[:, 0] += v; out[:, 1] += v
    fx = np.zeros((n, 2), np.float64); r = np.random.default_rng(seed)
    for ev in sfx_events:
        t0, name = float(ev[0]), ev[1]; g = float(ev[2]) if len(ev) > 2 else 1.0
        x = sfx(name, seed); s = int(round(t0 * SR))
        if s >= n or s + len(x) <= 0:
            continue
        pan = float(r.uniform(-0.22, 0.22)); x = x[max(0, -s): n - s]; s = max(0, s)
        fx[s: s + len(x), 0] += x[:, 0] * g * 0.5 * (1 - pan); fx[s: s + len(x), 1] += x[:, 1] * g * 0.5 * (1 + pan)
    out += fx * (0.55 + 0.45 * duck[:, None])                         # effects dip ~4 dB under speech, never vanish
    out = signal.sosfilt(_sos("hp", 24.0), out, axis=0)
    target, ceil = -14.0, 10 ** (-1.6 / 20); cur = out
    for _ in range(3):                                                # limiter changes loudness slightly: iterate
        cur = _limit(cur * 10 ** ((target - lufs(cur)) / 20), ceil)
    tp = true_peak_db(cur)
    if tp > -1.0:
        cur = cur * 10 ** ((-1.05 - tp) / 20)
    return cur.astype(np.float32)


def write_wav(path, x: np.ndarray) -> None:
    x = np.asarray(x)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    pcm = (np.clip(x, -1, 1) * 32767.0).astype("<i2")
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())


# ----------------------------------------------------------------------------------------------- sound effects

def _pitchdrop(n, f0, f1, tau):
    t = _tt(n); return np.sin(TAU * np.cumsum(f1 + (f0 - f1) * np.exp(-t / tau)) / SR)


def _pings(n, count, f_lo, f_hi, decay, seed, t_tau=0.25, t_max=None):
    r = np.random.default_rng(seed); out = np.zeros(n); t_max = t_max or n / SR * 0.8
    for i in range(count):
        st = int(min(t_max, r.exponential(t_tau)) * SR) if i else 0; m = n - st
        if m <= 0:
            continue
        t = _tt(m); f = f_lo * (f_hi / f_lo) ** r.random()
        out[st:] += (0.4 + 0.6 * r.random()) * np.sin(TAU * f * t + r.uniform(0, 6)) * np.exp(-t * decay * (0.6 + r.random())) * (1 - np.exp(-t / 0.0006))
    return out


def _fx_swell(s):
    n = int(2.2 * SR); t = _tt(n); e = np.clip(t / 1.5, 0, 1) ** 2.2 * np.clip((2.2 - t) / 0.7, 0, 1) ** 1.5
    x = sum(np.sin(TAU * mtof(m) * t * (1 + 0.002 * np.sin(TAU * 4.5 * t)) + m) for m in (50, 57, 62, 69, 74)) / 5 + 0.5 * _sweep_noise(n, 600, 5000, s, width=3)
    return x * e, 0.3


def _fx_sparkle(s):
    n = int(1.2 * SR); return _pings(n, 16, 2800, 9000, 9, s + 1, t_tau=0.22, t_max=0.8), 0.6


def _fx_shimmer(s):
    n = int(1.5 * SR); t = _tt(n)
    x = sum(a * np.sin(TAU * mtof(m) * t + m) * (0.6 + 0.4 * np.sin(TAU * (7 + i) * t + i)) for i, (m, a) in enumerate([(86, 1), (93, .8), (98, .7), (102, .5), (105, .35)]))
    return x * (1 - np.exp(-t / 0.03)) * np.exp(-t / 0.42) + 0.3 * _pings(n, 8, 5000, 11000, 12, s + 2), 0.5


def _fx_boom(s):
    n = int(2.2 * SR); t = _tt(n)
    x = _pitchdrop(n, 85, 31, 0.09) * np.exp(-t / 0.5) * 1.2 + 0.4 * np.sin(TAU * 36.7 * t) * np.exp(-t / 0.8) * (1 - np.exp(-t / 0.02))
    x += filt(_noise(n, s + 3), "lp", 900) * np.exp(-t / 0.03) * 2.2 + filt(_noise(n, s + 4), "lp", 110) * np.exp(-t / 0.6) * 0.9
    return np.tanh(1.5 * x), 0.2


def _fx_glitch(s):
    n = int(0.36 * SR); t = _tt(n); r = np.random.default_rng(s + 5); x = np.zeros(n); pos = 0
    while pos < n:
        ln = int(r.uniform(0.012, 0.05) * SR); seg = slice(pos, min(n, pos + ln)); tt = t[seg] - t[pos]
        if r.random() < 0.75:
            f = r.choice([220, 440, 880, 1760, 3520, 147]); x[seg] = np.sign(np.sin(TAU * f * tt)) * r.uniform(0.4, 1)
        else:
            q = max(2, int(r.integers(3, 40))); nz = r.standard_normal(len(tt) // q + 1); x[seg] = np.repeat(nz, q)[: len(tt)] * 0.6
        pos += ln + int(r.uniform(0, 0.02) * SR)
    return filt(x, "lp", 9000) * np.clip((0.36 - t) / 0.08, 0, 1), 0.3


def _fx_impact(s):
    n = int(1.5 * SR); t = _tt(n)
    x = _pitchdrop(n, 110, 36, 0.05) * np.exp(-t / 0.4) * 1.2 + filt(_noise(n, s + 6), "bp", (180, 2400)) * np.exp(-t / 0.045) * 0.9
    x += filt(_noise(n, s + 7), "bp", (300, 4000)) * np.exp(-t / 0.35) * 0.18 + filt(_noise(n, s + 8), "lp", 90) * np.exp(-t / 0.5) * 0.7
    return np.tanh(1.8 * x), 0.25


def _fx_whoosh(s):
    n = int(0.62 * SR); u = np.linspace(0, 1, n)
    return _sweep_noise(n, 350, 5200, s + 9, bands=9, bw=1.1, width=2.4) * np.sin(np.pi * u) ** 1.6, 0.6


def _fx_creak(s):
    n = int(0.75 * SR); t = _tt(n); f = 55 + 40 * np.sin(TAU * 1.1 * t + 0.4) + 25 * t; ph = np.cumsum(f) / SR
    pulses = (1 - (ph % 1)) ** 6
    x = filt(pulses - pulses.mean(), "bp", (420, 2100), 2) + 0.4 * filt(pulses - pulses.mean(), "bp", (2400, 5200))
    return x * np.sin(np.pi * np.clip(t / 0.75, 0, 1)) ** 0.8, 0.25


def _fx_reverse(s):
    n = int(1.2 * SR); t = _tt(n); e = np.exp((t - 1.16) / 0.3) * (t <= 1.16) + np.clip(1 - (t - 1.16) / 0.04, 0, 1) * (t > 1.16)
    x = _sweep_noise(n, 1500, 7000, s + 10, width=4, bw=1.4) + 0.6 * sum(np.sin(TAU * mtof(m) * t + m) for m in (62, 69, 74)) / 3
    return x * e, 0.45


def _fx_hit(s):
    n = int(0.5 * SR); t = _tt(n)
    x = _pitchdrop(n, 130, 48, 0.03) * np.exp(-t / 0.16) * 1.2 + filt(_noise(n, s + 11), "bp", (900, 5000)) * np.exp(-t / 0.012) * 0.7
    return np.tanh(1.6 * x), 0.1


def _fx_wind(s):
    n = int(3.0 * SR); t = _tt(n); nz = _noise(n, s + 12)
    x = filt(nz, "bp", (250, 900)) * (0.6 + 0.4 * np.sin(TAU * 0.4 * t)) + 0.5 * filt(nz, "bp", (900, 2600)) * (0.5 + 0.5 * np.sin(TAU * 0.27 * t + 1.3))
    return x * np.sin(np.pi * t / 3.0) ** 1.2, 0.8


def _fx_tick(s):
    n = int(0.06 * SR); t = _tt(n)
    return np.sin(TAU * 3200 * t) * np.exp(-t / 0.004) + filt(_noise(n, s + 13), "bp", (2000, 8000)) * np.exp(-t / 0.003), 0.08


def _fx_stamp(s):
    n = int(0.38 * SR); t = _tt(n)
    x = _pitchdrop(n, 150, 62, 0.02) * np.exp(-t / 0.07) * 1.3 + filt(_noise(n, s + 14), "bp", (1200, 6000)) * np.exp(-t / 0.018) * 0.8
    return np.tanh(1.5 * x + 0.3 * filt(_noise(n, s + 15), "bp", (300, 900)) * np.exp(-t / 0.09)), 0.1


def _fx_slash(s):
    n = int(0.48 * SR); t = _tt(n); u = np.linspace(0, 1, n)
    x = _sweep_noise(n, 1800, 11000, s + 16, bands=8, bw=1.0, width=2.0, warp=0.6) * np.exp(-((u - 0.18) / 0.16) ** 2)
    return x + 0.35 * _pings(n, 5, 3500, 7500, 14, s + 17, t_tau=0.02, t_max=0.1) * (t > 0.06), 0.4


def _riser(dur, s):
    n = int(dur * SR); t = _tt(n); u = t / dur; end = dur - 0.04
    e = np.clip(t / end, 0, 1) ** 2.6 * (t <= end) + np.clip(1 - (t - end) / 0.04, 0, 1) * (t > end)
    f = 110 * 2 ** (u * 3.0); tone = np.sin(TAU * np.cumsum(f) / SR) + 0.5 * np.sin(TAU * np.cumsum(f * 1.5) / SR)
    x = _sweep_noise(n, 400, 9000, s + 18, bands=10, bw=1.0, width=2.6) + 0.45 * tone * (0.6 + 0.4 * np.sin(TAU * (6 + 14 * u) * t))
    return x * e


def _fx_riser(s):
    return _riser(2.5, s), 0.3


def _fx_riser_short(s):
    return _riser(1.0, s + 40), 0.3


def _fx_error(s):
    n = int(0.42 * SR); t = _tt(n); f = np.where(t < 0.19, 196.0, 147.0)
    x = np.sign(np.sin(TAU * np.cumsum(f) / SR)) * 0.6 + np.sign(np.sin(TAU * np.cumsum(f * 0.5) / SR)) * 0.5
    gate = ((t < 0.16) | ((t > 0.2) & (t < 0.4))).astype(float)
    return filt(x, "lp", 2600) * uniform_filter1d(gate, size=200), 0.15


def _fx_growl(s):
    n = int(1.25 * SR); t = _tt(n); f = 58 * (1 + 0.12 * np.sin(TAU * 2.3 * t)) * (1 - 0.15 * t); ph = np.cumsum(f) / SR
    saw = 2 * (ph % 1) - 1; rough = 0.55 + 0.45 * np.sign(np.sin(TAU * 27 * t)) * np.sin(TAU * 27 * t) ** 2
    x = filt(saw * rough, "bp", (90, 700)) * 1.4 + 0.8 * filt(saw * rough, "bp", (700, 1700)) + 0.3 * filt(_noise(n, s + 19), "bp", (200, 1200)) * rough
    return np.tanh(2.2 * x) * np.clip(t / 0.4, 0, 1) ** 1.4 * np.clip((1.25 - t) / 0.6, 0, 1), 0.3


def _fx_shing(s):
    n = int(0.95 * SR); t = _tt(n); r = np.random.default_rng(s + 20); x = np.zeros(n)
    for f, a in zip([2350, 3120, 4410, 5630, 7200, 9100], [1, .9, .8, .6, .45, .3]):
        x += a * np.sin(TAU * f * (1 + 0.0015 * np.sin(TAU * 31 * t)) * t + r.uniform(0, 6)) * np.exp(-t * r.uniform(4.5, 8))
    scrape = _sweep_noise(n, 2500, 9000, s + 21, bands=6, bw=0.8, width=1.6, warp=0.25) * np.exp(-t / 0.05)
    return x * (1 - np.exp(-t / 0.004)) + 0.8 * scrape, 0.25


def _fx_thud(s):
    n = int(0.5 * SR); t = _tt(n)
    x = _pitchdrop(n, 95, 44, 0.03) * np.exp(-t / 0.13) * 1.3 + filt(_noise(n, s + 22), "lp", 420) * np.exp(-t / 0.05) * 1.2
    return np.tanh(1.5 * x), 0.15


def _fx_zip(s):
    n = int(0.32 * SR); t = _tt(n); u = t / 0.32; f = 70 * (6.5 ** u); ph = np.cumsum(f) / SR
    teeth = ((ph % 1) < 0.25).astype(float)
    x = filt(_noise(n, s + 23), "bp", (1500, 7000)) * teeth + 0.3 * filt(teeth - teeth.mean(), "bp", (500, 3000))
    return x * (0.35 + 0.65 * u) * np.clip((0.32 - t) / 0.03, 0, 1), 0.2


def _fx_punch(s):
    n = int(0.32 * SR); t = _tt(n)
    x = _pitchdrop(n, 170, 58, 0.018) * np.exp(-t / 0.07) * 1.3 + filt(_noise(n, s + 24), "bp", (450, 2800)) * np.exp(-t / 0.022) * 1.0
    return np.tanh(2.0 * x), 0.1


def _fx_ripple(s):
    n = int(1.35 * SR); out = np.zeros(n)
    for i in range(6):
        st = int(i * 0.14 * SR); m = n - st; t = _tt(m); f = 950 * 0.86 ** i
        out[st:] += 0.72 ** i * np.sin(TAU * np.cumsum(f * (1 + 0.5 * np.exp(-t / 0.03))) / SR) * np.exp(-t / 0.12) * (1 - np.exp(-t / 0.002))
    return out, 0.5


def _fx_rumble(s):
    n = int(3.0 * SR); t = _tt(n); nz = _noise(n, s + 25)
    x = filt(nz, "lp", 70, 4) * 3 + filt(nz, "bp", (70, 180)) * (0.5 + 0.5 * np.sin(TAU * 0.7 * t)) + 0.3 * np.sin(TAU * 31 * t)
    return np.tanh(x * 0.9) * np.sin(np.pi * t / 3.0) ** 0.8, 0.15


def _fx_seal(s):
    n = int(1.35 * SR); t = _tt(n); u = t / 0.9
    sweep = _sweep_noise(n, 6000, 300, s + 26, bands=9, bw=0.9, width=2.2) * np.clip(u, 0, 1) ** 1.5 * (t < 0.9)
    tone = np.sin(TAU * np.cumsum(900 * 0.25 ** np.clip(u, 0, 1)) / SR) * np.clip(u, 0, 1) * (t < 0.9) * 0.4
    k = int(0.9 * SR); thunk = np.zeros(n); m = n - k; tk = _tt(m)
    thunk[k:] = np.tanh(2 * (_pitchdrop(m, 140, 50, 0.025) * np.exp(-tk / 0.12) + filt(_noise(m, s + 27), "bp", (800, 4000)) * np.exp(-tk / 0.01) * 0.6))
    bell = np.zeros(n); bell[k:] = _pings(m, 5, 1800, 5200, 7, s + 28, t_tau=0.01, t_max=0.03) * 0.35
    return 0.55 * sweep + tone + 1.4 * thunk + bell, 0.3


def _fx_roar(s):
    n = int(1.7 * SR); t = _tt(n); f = 82 * (1 + 0.25 * np.exp(-((t - 0.35) / 0.25) ** 2)) * (1 - 0.12 * t); ph = np.cumsum(f) / SR
    saw = (2 * (ph % 1) - 1) + 0.7 * (2 * ((ph * 1.493) % 1) - 1); rough = 0.5 + 0.5 * np.abs(np.sin(TAU * 34 * t + 2 * np.sin(TAU * 5 * t)))
    src = saw * rough + 0.7 * _noise(n, s + 29) * rough
    fm = 500 + 500 * np.exp(-((t - 0.4) / 0.3) ** 2)
    x = filt(src, "bp", (80, 400)) * 1.3 + filt(src, "bp", (400, 1200)) * (fm / 1000) * 1.6 + 0.6 * filt(src, "bp", (1500, 3600)) + 0.4 * filt(_noise(n, s + 30), "lp", 80) * 3
    e = np.clip(t / 0.3, 0, 1) ** 1.3 * np.clip((1.7 - t) / 1.0, 0, 1) ** 1.2
    return np.tanh(2.6 * x * e), 0.3


def _fx_heartbeat(s):
    n = int(0.78 * SR); out = np.zeros(n)
    for st_s, g, f0 in [(0.0, 1.0, 78), (0.27, 0.72, 66)]:
        st = int(st_s * SR); m = n - st; t = _tt(m)
        out[st:] += g * (_pitchdrop(m, f0, 40, 0.035) * np.exp(-t / 0.11) + filt(_noise(m, s + 31), "lp", 200) * np.exp(-t / 0.03) * 0.8) * (1 - np.exp(-t / 0.004))
    return np.tanh(1.4 * out), 0.1


def _fx_chain(s):
    n = int(0.95 * SR); r = np.random.default_rng(s + 32); out = np.zeros(n)
    for i in range(26):
        st = int(min(0.8, abs(r.normal(0.14, 0.2))) * SR); m = n - st; t = _tt(m); f = r.uniform(1900, 6500)
        out[st:] += r.uniform(0.3, 1) * (np.sin(TAU * f * t) + 0.6 * np.sin(TAU * f * 1.53 * t)) * np.exp(-t / r.uniform(0.008, 0.03)) * (1 - np.exp(-t / 0.0004))
    return out + 0.25 * filt(_noise(n, s + 33), "bp", (600, 2500)) * np.exp(-_tt(n) / 0.3), 0.35


def _fx_ping(s):
    n = int(0.95 * SR); out = np.zeros(n)
    for st_s, g in [(0, 1), (0.21, 0.32), (0.42, 0.12)]:
        st = int(st_s * SR); m = n - st; t = _tt(m)
        out[st:] += g * (np.sin(TAU * 1240 * t) + 0.3 * np.sin(TAU * 2480 * t)) * np.exp(-t / 0.16) * (1 - np.exp(-t / 0.002))
    return out, 0.5


def _fx_shatter(s):
    n = int(0.95 * SR); t = _tt(n)
    return filt(_noise(n, s + 34), "hp", 2500) * np.exp(-t / 0.035) * 1.2 + _pings(n, 34, 2600, 11000, 16, s + 35, t_tau=0.1, t_max=0.5) * 0.5 + 0.5 * _pitchdrop(n, 300, 120, 0.02) * np.exp(-t / 0.05), 0.5


def _fx_scan(s):
    n = int(1.0 * SR); t = _tt(n); u = t / 1.0; f = 300 * 8 ** u
    x = np.sin(TAU * np.cumsum(f) / SR) * (0.55 + 0.45 * np.sign(np.sin(TAU * 24 * t))) + 0.25 * _sweep_noise(n, 800, 6000, s + 36, bands=6, width=2)
    return x * np.sin(np.pi * u) ** 0.9, 0.5


def _fx_flutter(s):
    n = int(0.62 * SR); t = _tt(n); flap = np.clip(np.sin(TAU * 13 * t), 0, 1) ** 2.5
    x = filt(_noise(n, s + 37), "bp", (180, 1500)) * flap + 0.4 * filt(_noise(n, s + 38), "bp", (1500, 4500)) * flap
    return x * np.sin(np.pi * np.clip(t / 0.62, 0, 1)) ** 0.6 * (1.25 - t), 0.6


def _fx_clock(s):
    n = int(1.0 * SR); out = np.zeros(n)
    for st_s, f in [(0.0, 1850), (0.5, 1450)]:
        st = int(st_s * SR); m = n - st; t = _tt(m)
        out[st:] += (np.sin(TAU * f * t) * np.exp(-t / 0.012) + 0.6 * np.sin(TAU * f * 0.42 * t) * np.exp(-t / 0.03) + filt(_noise(m, s + 39), "bp", (2500, 7000)) * np.exp(-t / 0.004) * 0.7) * (1 - np.exp(-t / 0.0004))
    return out, 0.25


def _fx_door(s):
    n = int(1.7 * SR); t = _tt(n)
    latch = (np.sin(TAU * 900 * t) * np.exp(-t / 0.008) + filt(_noise(n, s + 40), "bp", (1500, 5000)) * np.exp(-t / 0.006)) * 0.9 + np.tanh(2 * _pitchdrop(n, 120, 55, 0.02) * np.exp(-t / 0.09)) * 1.2
    f = 46 + 30 * np.clip((t - 0.15) / 1.1, 0, 1) + 9 * np.sin(TAU * 1.7 * t); ph = np.cumsum(f) / SR; pulses = (1 - (ph % 1)) ** 5
    creak = (filt(pulses - pulses.mean(), "bp", (350, 1500)) + 0.4 * filt(pulses - pulses.mean(), "bp", (1500, 3800))) * np.clip((t - 0.12) / 0.2, 0, 1) * np.clip((1.45 - t) / 0.5, 0, 1)
    low = filt(_noise(n, s + 41), "lp", 90, 4) * 3 * np.clip((t - 0.1) / 0.3, 0, 1) * np.clip((1.7 - t) / 0.8, 0, 1)
    return latch + 0.5 * creak + 0.6 * low, 0.2


_FX = {name: globals()["_fx_" + name] for name in SFX}
# relative level of each effect at gain 1.0 (peak, linear) so quiet details stay quiet next to hits
_FX_LEVEL = {"tick": 0.4, "clock": 0.5, "sparkle": 0.5, "shimmer": 0.55, "wind": 0.5, "rumble": 0.7, "whoosh": 0.7, "creak": 0.55, "flutter": 0.55,
             "ping": 0.6, "scan": 0.55, "ripple": 0.6, "zip": 0.6, "glitch": 0.6, "error": 0.6, "swell": 0.7, "reverse": 0.7, "chain": 0.7,
             "heartbeat": 0.9, "stamp": 0.85, "thud": 0.85, "punch": 0.9, "hit": 0.9, "shing": 0.75, "slash": 0.8, "shatter": 0.8, "seal": 0.8,
             "riser": 0.8, "riser_short": 0.75, "growl": 0.8, "door": 0.85, "roar": 0.95, "impact": 0.97, "boom": 0.97}
# length and transient position of every effect (seconds). Effects are placed by START time: to make a riser
# land on a cut at time T, schedule it at T - SFX_INFO[name]["peak_at"].
SFX_INFO = {"swell": {"dur": 2.2, "peak_at": 1.503}, "sparkle": {"dur": 1.2, "peak_at": 0.0}, "shimmer": {"dur": 1.5, "peak_at": 0.018}, "boom": {"dur": 2.2, "peak_at": 0.0}, "glitch": {"dur": 0.36, "peak_at": 0.0}, "impact": {"dur": 1.5, "peak_at": 0.0}, "whoosh": {"dur": 0.62, "peak_at": 0.366}, "creak": {"dur": 0.75, "peak_at": 0.379}, "reverse": {"dur": 1.2, "peak_at": 1.154}, "hit": {"dur": 0.5, "peak_at": 0.0}, "wind": {"dur": 3.0, "peak_at": 0.955}, "tick": {"dur": 0.06, "peak_at": 0.0}, "stamp": {"dur": 0.38, "peak_at": 0.0}, "slash": {"dur": 0.48, "peak_at": 0.036}, "riser": {"dur": 2.5, "peak_at": 2.452}, "riser_short": {"dur": 1.0, "peak_at": 0.95}, "error": {"dur": 0.42, "peak_at": 0.0}, "growl": {"dur": 1.25, "peak_at": 0.61}, "shing": {"dur": 0.95, "peak_at": 0.0}, "thud": {"dur": 0.5, "peak_at": 0.0}, "zip": {"dur": 0.32, "peak_at": 0.285}, "punch": {"dur": 0.32, "peak_at": 0.0}, "ripple": {"dur": 1.35, "peak_at": 0.0}, "rumble": {"dur": 3.0, "peak_at": 1.411}, "seal": {"dur": 1.35, "peak_at": 0.911}, "roar": {"dur": 1.7, "peak_at": 0.503}, "heartbeat": {"dur": 0.78, "peak_at": 0.0}, "chain": {"dur": 0.95, "peak_at": 0.004}, "ping": {"dur": 0.95, "peak_at": 0.0}, "shatter": {"dur": 0.95, "peak_at": 0.0}, "scan": {"dur": 1.0, "peak_at": 0.428}, "flutter": {"dur": 0.62, "peak_at": 0.251}, "clock": {"dur": 1.0, "peak_at": 0.0}, "door": {"dur": 1.7, "peak_at": 0.0}}


@functools.lru_cache(maxsize=256)
def _sfx_cached(name: str, seed: int) -> np.ndarray:
    x, width = _FX[name](seed * 1000)
    x = _fade(np.asarray(x, np.float64), 0.0008, 0.012)
    x = filt(x, "hp", 22.0)
    st = _stereo(_norm(x), width, seed)
    st = st / (np.max(np.abs(st)) + 1e-9) * _FX_LEVEL.get(name, 0.7)
    st.setflags(write=False)
    return st.astype(np.float32)


def sfx(name: str, seed: int = 0) -> np.ndarray:
    """Designed sound effect, (n, 2) float32, peak <= 1. Unknown names fall back to a soft tick (never raises)."""
    if name not in _FX:
        print(f"[score] warning: unknown sfx {name!r} -> soft tick", file=sys.stderr)
        return (_sfx_cached("tick", 0) * 0.5).copy()
    return _sfx_cached(name, int(seed) % 7).copy()


def _measure_sfx(name: str) -> dict:
    """dur and transient position: onset for impulsive effects (envelope reaches 60 % of max within 50 ms), else the envelope maximum."""
    x = _sfx_cached(name, 0); e = np.sqrt(np.maximum(0.0, uniform_filter1d(np.max(np.abs(x), axis=1).astype(np.float64) ** 2, size=int(0.02 * SR))))
    t_max = int(np.argmax(e)) / SR; t_on = int(np.argmax(e >= 0.6 * e.max())) / SR
    return {"dur": round(len(x) / SR, 3), "peak_at": round(t_on if t_on < 0.05 else t_max, 3)}


# ----------------------------------------------------------------------------------------------- QA / demo

def _bands_db(x: np.ndarray) -> dict:
    m = x.mean(axis=1); f, p = signal.welch(m, SR, nperseg=8192); tot = p.sum() + 1e-20; out = {}
    for nm, lo, hi in [("sub", 0, 60), ("low", 60, 250), ("mid", 250, 2000), ("pres", 2000, 6000), ("high", 6000, 24000)]:
        out[nm] = round(10 * math.log10(p[(f >= lo) & (f < hi)].sum() / tot + 1e-12), 1)
    return out


def _ffmpeg_lufs(path) -> float | None:
    try:
        err = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
        m = re.findall(r"I:\s+(-?[\d.]+) LUFS", err); return float(m[-1]) if m else None
    except Exception:
        return None


def _stats(x: np.ndarray) -> dict:
    return {"finite": bool(np.isfinite(x).all()), "peak": round(float(np.max(np.abs(x))), 3), "dc": round(float(np.abs(x.mean(axis=0)).max()), 5),
            "corr": round(float(np.corrcoef(x[:, 0], x[:, 1])[0, 1]), 2) if np.std(x[:, 0]) > 0 else 1.0,
            "jump": round(float(np.max(np.abs(np.diff(x, axis=0)))), 3)}


def _demo(outdir: Path) -> int:
    outdir.mkdir(parents=True, exist_ok=True); ok = True
    print("== moods (20 s, intensity 0.7) ==")
    for m in MOODS:
        t0 = time.time(); x = compose(20.0, [{"start": 0, "end": 20, "mood": m, "intensity": 0.7}], seed=1); write_wav(outdir / f"mood_{m}.wav", x)
        st = _stats(x); L = lufs(x); Lf = _ffmpeg_lufs(outdir / f"mood_{m}.wav"); b = _bands_db(x)
        bad = (not st["finite"]) or st["peak"] >= 0.999 or st["dc"] > 0.003 or st["corr"] < 0
        ok &= not bad
        print(f"{m:10s} LUFS {L:6.1f} (ffmpeg {Lf}) target {TARGET_LUFS[m]:6.1f} peak {st['peak']:.3f} dc {st['dc']:.5f} corr {st['corr']:+.2f} jump {st['jump']:.3f} bands {b} {time.time() - t0:.1f}s {'FAIL' if bad else 'ok'}")
    print("== section crossfades (12 moods x 6 s) ==")
    secs = [{"start": i * 6.0 + (0.37 if i else 0), "end": (i + 1) * 6.0 + 0.37, "mood": m, "intensity": 0.5 + 0.04 * i} for i, m in enumerate(MOODS)]
    secs[-1]["end"] = 72.0; x = compose(72.0, secs, seed=3); write_wav(outdir / "sections.wav", x); st = _stats(x); d = np.max(np.abs(np.diff(x, axis=0)), axis=1)
    worst = []
    for s in secs[1:]:
        b = _snap(s["start"]); worst.append(round(float(d[max(0, b - 2400): b + 2400].max()), 3))
    print("stats", st, "| max jump within ±50 ms of each boundary:", worst)
    ok &= st["finite"] and st["peak"] < 0.999
    print("== sfx ==")
    for nm in SFX:
        x = sfx(nm); write_wav(outdir / f"sfx_{nm}.wav", x); st = _stats(x); meas = _measure_sfx(nm); info = SFX_INFO.get(nm, {})
        match = info and abs(info["dur"] - meas["dur"]) < 0.02 and abs(info["peak_at"] - meas["peak_at"]) < 0.03
        bad = (not st["finite"]) or st["peak"] > 1.0 or st["dc"] > 0.01 or st["corr"] < 0 or not match
        ok &= not bad
        print(f"{nm:12s} dur {meas['dur']:.3f} peak_at {meas['peak_at']:.3f} info {info} peak {st['peak']:.2f} dc {st['dc']:.4f} corr {st['corr']:+.2f} sub/low {_bands_db(x)['sub']}/{_bands_db(x)['low']} {'FAIL' if bad else 'ok'}")
    u = sfx("no_such_effect"); ok &= u.shape[1] == 2
    print("== mix test (synthetic speech-rhythm VO over drive/emotional/silence/battle) ==")
    dur = 40.0; r = np.random.default_rng(4); vo = []; t = 1.0; spans = []
    while t < dur - 4:
        ln = r.uniform(1.6, 3.4); n = int(ln * 24000); tt = np.arange(n) / 24000
        syl = np.clip(np.sin(TAU * 4.2 * tt + r.uniform(0, 6)), 0, 1) ** 0.6
        v = signal.sosfilt(signal.butter(2, [200, 3400], "bandpass", fs=24000, output="sos"), r.standard_normal(n)) * syl * 0.2
        vo.append((t, v.astype(np.float32), 24000)); spans.append((t, t + ln)); t += ln + r.uniform(0.9, 1.8)
    mus = compose(dur, [{"start": 0, "end": 12, "mood": "drive", "intensity": 0.7}, {"start": 12, "end": 24, "mood": "emotional", "intensity": 0.7},
                        {"start": 24, "end": 28, "mood": "silence", "intensity": 0.5}, {"start": 28, "end": 40, "mood": "battle", "intensity": 0.8}], seed=2)
    ev = [(0.5, "boom", 1.0), (11.2, "riser_short", 0.8), (12.0, "impact", 1.0), (20.0, "whoosh", 0.8), (27.0, "heartbeat", 1.0), (28.0, "slash", 1.0), (35.0, "shing", 0.8)]
    t0 = time.time(); master = mix(dur, vo, mus, ev, seed=1); write_wav(outdir / "mix_test.wav", master); st = _stats(master)
    L = lufs(master); Lf = _ffmpeg_lufs(outdir / "mix_test.wav"); tp = true_peak_db(master)
    duck = duck_envelope(_vo_bus(dur, vo)); in_v = np.zeros(len(duck), bool)
    for a, b in spans:
        in_v[int((a + 0.3) * SR): int((b - 0.1) * SR)] = True
    gaps = np.ones(len(duck), bool)
    for a, b in spans:
        gaps[int((a - 0.2) * SR): int((b + 0.8) * SR)] = False
    dv, dg = 20 * math.log10(float(duck[in_v].mean())), 20 * math.log10(float(duck[gaps].mean()))
    print(f"master LUFS {L:.2f} (ffmpeg {Lf}) true peak {tp:.2f} dBFS stats {st} mix time {time.time() - t0:.1f}s")
    print(f"music gain under speech {dv:.1f} dB, in gaps (>0.8 s after speech) {dg:.1f} dB")
    good = abs(L + 14) <= 1.0 and tp <= -1.0 and dv < -11 and dg > -1.5 and st["finite"]
    ok &= good
    print("ALL OK" if ok else "SOME CHECKS FAILED")
    return 0 if ok else 1


def _calibrate() -> None:
    print("RAW_LUFS = {", end="")
    for m in MOODS:
        n = int(24.0 * SR); x = _render_mood(m, n, n, 0.7, np.random.default_rng([1, 0, MOODS.index(m)]), calibrated=False)
        print(f'"{m}": {lufs(signal.sosfilt(_music_eq(), x.astype(np.float64), axis=0)):.1f}, ', end="", flush=True)
    print("}")
    print("SFX_INFO = {" + ", ".join(f'"{nm}": {_measure_sfx(nm)}' for nm in SFX) + "}")


def _bench(dur: float = 620.0) -> None:
    order = ["mystic", "dread", "title", "dread", "wonder", "drive", "playful", "tension", "emotional", "heist", "silence", "battle", "emotional", "drive", "mystic", "tension", "battle", "silence", "tension", "dread", "drive", "wonder", "cliff", "dread", "cliff", "silence", "title"]
    step = dur / len(order); secs = [{"start": i * step, "end": (i + 1) * step, "mood": m, "intensity": 0.7} for i, m in enumerate(order)]
    t0 = time.time(); x = compose(dur, secs, seed=1); el = time.time() - t0
    print(f"compose({dur:.0f} s, {len(order)} sections) took {el:.1f} s -> shape {x.shape} peak {np.max(np.abs(x)):.3f} LUFS {lufs(x):.1f}")


if __name__ == "__main__":
    a = sys.argv[1:]
    if a[:1] == ["--demo"]:
        sys.exit(_demo(Path(a[1] if len(a) > 1 else "score_demo")))
    elif a[:1] == ["--calibrate"]:
        _calibrate()
    elif a[:1] == ["--bench"]:
        _bench(float(a[1]) if len(a) > 1 else 620.0)
    else:
        print(__doc__)
