"""Procedural sound effects + shared DSP primitives for the Copycat audio engine.

All renders are float32 stereo arrays of shape (n, 2) at SR = 48 kHz, peak-normalised to 1.0
(the mixer scales them relative to speech peaks).  The DSP helpers at the top (biquads, reverb,
fades, noise) are also used by copycat.voicecast and copycat.music.
"""
from __future__ import annotations
import math
import numpy as np
from scipy import signal as sg

SR = 48000

# --------------------------------------------------------------------------- DSP primitives

def rng_for(*parts) -> np.random.Generator:
    import zlib
    return np.random.default_rng(zlib.crc32("|".join(map(str, parts)).encode()))


def db(x: float) -> float:
    return 10 ** (x / 20.0)


def to_stereo(x: np.ndarray) -> np.ndarray:
    x = np.asarray(x, dtype=np.float32)
    return np.stack([x, x], axis=1) if x.ndim == 1 else x


def biquad(x, kind: str, hz: float, gain_db: float = 0.0, q: float = 0.707, sr: int = SR):
    """RBJ cookbook biquad. kind: lowshelf|highshelf|peak|lp|hp|bp. Works along axis 0."""
    hz = min(hz, sr * 0.45)
    A = 10 ** (gain_db / 40.0)
    w0 = 2 * math.pi * hz / sr
    cw, sw = math.cos(w0), math.sin(w0)
    al = sw / (2 * q)
    if kind == "peak":
        b = [1 + al * A, -2 * cw, 1 - al * A]; a = [1 + al / A, -2 * cw, 1 - al / A]
    elif kind == "lowshelf":
        s = 2 * math.sqrt(A) * al
        b = [A * ((A + 1) - (A - 1) * cw + s), 2 * A * ((A - 1) - (A + 1) * cw), A * ((A + 1) - (A - 1) * cw - s)]
        a = [(A + 1) + (A - 1) * cw + s, -2 * ((A - 1) + (A + 1) * cw), (A + 1) + (A - 1) * cw - s]
    elif kind == "highshelf":
        s = 2 * math.sqrt(A) * al
        b = [A * ((A + 1) + (A - 1) * cw + s), -2 * A * ((A - 1) + (A + 1) * cw), A * ((A + 1) + (A - 1) * cw - s)]
        a = [(A + 1) - (A - 1) * cw + s, 2 * ((A - 1) - (A + 1) * cw), (A + 1) - (A - 1) * cw - s]
    elif kind == "lp":
        b = [(1 - cw) / 2, 1 - cw, (1 - cw) / 2]; a = [1 + al, -2 * cw, 1 - al]
    elif kind == "hp":
        b = [(1 + cw) / 2, -(1 + cw), (1 + cw) / 2]; a = [1 + al, -2 * cw, 1 - al]
    elif kind == "bp":
        b = [al, 0, -al]; a = [1 + al, -2 * cw, 1 - al]
    else:
        raise ValueError(kind)
    return sg.lfilter(np.array(b) / a[0], np.array(a) / a[0], x, axis=0).astype(np.float32)


def lp(x, hz, order=2, sr=SR):
    return sg.sosfilt(sg.butter(order, min(hz, sr * 0.45), "lp", fs=sr, output="sos"), x, axis=0).astype(np.float32)


def hp(x, hz, order=2, sr=SR):
    return sg.sosfilt(sg.butter(order, hz, "hp", fs=sr, output="sos"), x, axis=0).astype(np.float32)


def bp(x, lo, hi, order=2, sr=SR):
    return sg.sosfilt(sg.butter(order, [lo, min(hi, sr * 0.45)], "bp", fs=sr, output="sos"), x, axis=0).astype(np.float32)


def fade(x: np.ndarray, fin: float = 0.0, fout: float = 0.0, sr: int = SR, curve: str = "cos") -> np.ndarray:
    x = x.copy()
    n = len(x)
    a, b = min(int(fin * sr), n), min(int(fout * sr), n)
    sh = (-1,) + (1,) * (x.ndim - 1)
    if a > 0:
        r = np.linspace(0, 1, a, dtype=np.float32)
        r = (0.5 - 0.5 * np.cos(np.pi * r)) if curve == "cos" else r
        x[:a] *= r.reshape((-1,) + (1,) * (x.ndim - 1))
    if b > 0:
        r = np.linspace(1, 0, b, dtype=np.float32)
        r = (0.5 - 0.5 * np.cos(np.pi * r)) if curve == "cos" else r
        x[n - b:] *= r.reshape((-1,) + (1,) * (x.ndim - 1))
    return x


def tt(dur: float, sr: int = SR) -> np.ndarray:
    return np.arange(int(round(dur * sr)), dtype=np.float64) / sr


def reverb_ir(decay_s: float = 2.5, predelay_ms: float = 15, damp_hz: float = 5000, seed: int = 1, sr: int = SR,
              dark: float = 0.0) -> np.ndarray:
    """Stereo exponential-decay noise impulse response (RT60 = decay_s), damped highs."""
    rng = np.random.default_rng(seed)
    n = int((decay_s * 1.15) * sr)
    t = np.arange(n) / sr
    env = 10 ** (-3.0 * t / decay_s)
    ir = rng.standard_normal((n, 2)).astype(np.float64) * env[:, None]
    # frequency dependent decay: highs die faster
    lo = sg.sosfilt(sg.butter(2, damp_hz * (0.6 if dark else 1.0), "lp", fs=sr, output="sos"), ir, axis=0)
    hi_fast = np.exp(-t / (decay_s * 0.35))[:, None]
    ir = lo * (0.35 + 0.65 * hi_fast) if dark else lo
    pre = int(predelay_ms * sr / 1000)
    ir = np.concatenate([np.zeros((pre, 2)), ir])
    ir[:, 0] *= 1.0; ir[:, 1] *= 1.0
    ir /= math.sqrt((ir ** 2).sum()) + 1e-9
    return ir.astype(np.float32)


def convolve_chunked(x: np.ndarray, ir: np.ndarray, block: int = 1 << 18) -> np.ndarray:
    """FFT overlap-add convolution of x (n,) or (n,2) with stereo IR (m,2) -> (n+m-1, 2)."""
    x = to_stereo(x)
    n, m = len(x), len(ir)
    out = np.zeros((n + m - 1, 2), np.float32)
    for ch in range(2):
        h = ir[:, ch]
        src = x[:, ch] if True else None
        # decorrelate: left input -> left IR, right input -> right IR (keeps width)
        for i in range(0, n, block):
            seg = src[i:i + block]
            out[i:i + len(seg) + m - 1, ch] += sg.fftconvolve(seg, h).astype(np.float32)
    return out


def add_reverb(x: np.ndarray, decay_s=2.5, wet_db=-10.0, dry_db=0.0, predelay_ms=15, damp_hz=5000, seed=1,
               send_hp: float = 0.0, tail: bool = True, dark: float = 0.0) -> np.ndarray:
    """Return dry*d + reverb*w. If tail is False the output is cropped to len(x)."""
    x = to_stereo(x)
    send = hp(x, send_hp) if send_hp else x
    wet = convolve_chunked(send, reverb_ir(decay_s, predelay_ms, damp_hz, seed, dark=dark))
    n = len(wet)
    out = wet * db(wet_db)
    out[:len(x)] += x * db(dry_db)
    return out if tail else out[:len(x)]


def mono_noise(dur: float, seed: int, sr: int = SR) -> np.ndarray:
    return np.random.default_rng(seed).standard_normal(int(round(dur * sr))).astype(np.float32)


def normalise_peak(x: np.ndarray, peak: float = 1.0) -> np.ndarray:
    m = float(np.max(np.abs(x))) or 1.0
    return (x / m * peak).astype(np.float32)


def pan(x: np.ndarray, p: float | np.ndarray) -> np.ndarray:
    """Equal-power pan of mono x; p in [-1,1] (scalar or per-sample)."""
    ang = (np.asarray(p) + 1) * np.pi / 4
    return np.stack([x * np.cos(ang), x * np.sin(ang)], axis=1).astype(np.float32)


def haas(x: np.ndarray, ms: float = 11.0) -> np.ndarray:
    """Cheap stereo widening of a mono-ish signal."""
    d = int(ms * SR / 1000)
    l = np.concatenate([x, np.zeros(d, np.float32)]); r = np.concatenate([np.zeros(d, np.float32), x])
    return np.stack([l, r], axis=1)


# --------------------------------------------------------------------------- effects (mono cores -> stereo)

def _metal(freqs, decays, dur, amps=None, seed=0):
    t = tt(dur)
    rng = np.random.default_rng(seed)
    y = np.zeros(len(t))
    for i, (f, d) in enumerate(zip(freqs, decays)):
        a = 1.0 if amps is None else amps[i]
        y += a * np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) * np.exp(-t / d)
    return y.astype(np.float32)


def whoosh(dur: float = 1.2, seed: int = 1) -> np.ndarray:
    n = mono_noise(dur, seed)
    t = tt(dur)
    prog = t / dur
    fc = 350 * (14 ** np.sin(np.pi * prog * 0.5 + 0.0)) * (1.0)  # 350 -> ~4900
    # time-varying bandpass by blending static bands (cheap, stable)
    bands = [bp(n, f0 / 1.4, f0 * 1.4) for f0 in (400, 900, 1900, 3800)]
    out = np.zeros(len(n), np.float32)
    for i, b in enumerate(bands):
        centre = (i + 0.6) / 4
        w = np.exp(-((prog - centre) ** 2) / (2 * 0.12 ** 2))
        out += b * w.astype(np.float32)
    out *= np.sin(np.pi * np.clip(prog, 0, 1)).astype(np.float32) ** 1.6
    return fade(pan(out, np.linspace(-0.8, 0.8, len(out))), 0.02, 0.2)


def page_flutter(dur: float = 1.3, seed: int = 2) -> np.ndarray:
    rng = np.random.default_rng(seed)
    out = np.zeros((int(round(dur * SR)), 2), np.float32)
    t = 0.04
    while t < dur - 0.1:
        ln = int(rng.uniform(0.012, 0.045) * SR)
        burst = hp(rng.standard_normal(ln).astype(np.float32), 2500) * np.exp(-np.arange(ln) / (ln * 0.3)).astype(np.float32)
        burst = lp(burst, rng.uniform(6000, 11000))
        s = int(t * SR)
        out[s:s + ln] += pan(burst, rng.uniform(-0.6, 0.6))[: len(out[s:s + ln])] * rng.uniform(0.4, 1.0)
        t += rng.uniform(0.03, 0.13) * (1 + t / dur)
    return fade(out, 0.005, 0.15)


def anti_magic_hum(dur: float = 4.0, seed: int = 3) -> np.ndarray:
    t = tt(dur)
    y = np.zeros(len(t))
    for f, a in ((55, 1.0), (110.4, 0.6), (164.6, 0.35), (220.9, 0.2)):
        y += a * np.sin(2 * np.pi * f * t + 0.3 * np.sin(2 * np.pi * 0.2 * t))
    y *= 1 + 0.18 * np.sin(2 * np.pi * 6.7 * t)  # dread flutter
    n = bp(mono_noise(dur, seed), 700, 2200) * 0.05
    whine = 0.04 * np.sin(2 * np.pi * (1320 + 40 * np.sin(2 * np.pi * 0.13 * t)) * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.31 * t))
    s = (y * 0.3 + n + whine).astype(np.float32)
    return fade(haas(s, 9), 0.5, 0.6)


def sword_ring(dur: float = 2.6, seed: int = 4) -> np.ndarray:
    m = _metal([1700, 4690, 9180, 5120, 2450], [1.1, 0.7, 0.35, 0.5, 0.9], dur, [1, 0.6, 0.25, 0.3, 0.4], seed)
    click = np.zeros_like(m)
    cl = hp(mono_noise(0.03, seed + 1), 3000) * np.exp(-np.arange(int(0.03 * SR)) / (0.006 * SR)).astype(np.float32)
    click[: len(cl)] = cl
    y = m * 0.8 + click * 1.2
    out = add_reverb(haas(y, 7), 1.2, -12, 0, 8, 8000, 3, tail=False)
    return fade(out, 0.0, 0.3)


def bass_drop(dur: float = 2.2, seed: int = 5) -> np.ndarray:
    t = tt(dur)
    f = 35 + 75 * np.exp(-t / 0.18)
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * np.exp(-t / 0.75) + 0.35 * np.sin(2 * ph) * np.exp(-t / 0.25)
    th = lp(mono_noise(dur, seed), 220) * np.exp(-t / 0.08)
    y = (y + 0.6 * th).astype(np.float32)
    y[:48] *= np.linspace(0, 1, 48)
    return fade(add_reverb(y, 1.6, -16, 0, 6, 1500, 4, tail=False), 0, 0.5)


def chain_rattle(dur: float = 1.6, seed: int = 6) -> np.ndarray:
    rng = np.random.default_rng(seed)
    out = np.zeros((int(round(dur * SR)), 2), np.float32)
    t = 0.0
    while t < dur - 0.25:
        f = rng.uniform(1800, 5200)
        clink = _metal([f, f * 2.41, f * 3.7], [0.07, 0.04, 0.025], 0.3, [1, 0.5, 0.25], int(rng.integers(1e6)))
        s = int(t * SR)
        seg = pan(clink, rng.uniform(-0.7, 0.7)) * rng.uniform(0.3, 1.0)
        out[s:s + len(seg)] += seg[: len(out) - s]
        t += rng.uniform(0.04, 0.22)
    return fade(add_reverb(out, 0.9, -14, 0, 5, 7000, 5, tail=False), 0.02, 0.25)


def wind(dur: float = 6.0, seed: int = 7) -> np.ndarray:
    outs = []
    for ch in range(2):
        n = mono_noise(dur + 1, seed + ch)
        t = tt(dur + 1)
        # slow gusting modulation of both level and band centre
        g = 0.55 + 0.45 * np.sin(2 * np.pi * 0.13 * t + ch) * np.sin(2 * np.pi * 0.071 * t + 2 * ch + 1)
        a = bp(n, 180, 700, 2) * g.astype(np.float32)
        b = bp(n, 700, 2400, 2) * (0.35 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.19 * t + ch))).astype(np.float32)
        outs.append((a + b)[: int(round(dur * SR))])
    return fade(np.stack(outs, axis=1), 0.8, 1.0)


def heartbeat(dur: float = 6.0, seed: int = 8, bpm: float = 64) -> np.ndarray:
    out = np.zeros(int(round(dur * SR)), np.float32)
    def thump(f0, ln=0.16):
        t = tt(ln); return (np.sin(2 * np.pi * (f0 + 30 * np.exp(-t / 0.03)) * t) * np.exp(-t / 0.045)).astype(np.float32)
    lub, dub = thump(52), thump(60, 0.14) * 0.7
    per = 60.0 / bpm
    t = 0.0
    while t < dur - 0.3:
        s = int(t * SR); out[s:s + len(lub)] += lub[: len(out) - s]
        s2 = int((t + 0.28) * SR)
        if s2 < len(out): out[s2:s2 + len(dub)] += dub[: len(out) - s2]
        t += per
    return fade(to_stereo(out), 0.3, 0.6)


def bell(dur: float = 5.0, seed: int = 9) -> np.ndarray:
    f = 392.0
    ratios = [0.5, 1.0, 1.19, 1.5, 2.0, 2.51, 3.0, 4.07]
    decs = [4.5, 3.8, 3.0, 2.4, 2.0, 1.2, 0.8, 0.5]
    amps = [0.7, 1.0, 0.55, 0.4, 0.45, 0.2, 0.15, 0.08]
    y = _metal([f * r for r in ratios], decs, dur, amps, seed)
    y[: int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))
    return fade(add_reverb(haas(y, 12), 2.2, -9, 0, 18, 6000, 6, tail=False), 0, 1.0)


def crowd_murmur(dur: float = 6.0, seed: int = 10) -> np.ndarray:
    rng = np.random.default_rng(seed)
    out = np.zeros((int(round(dur * SR)), 2), np.float32)
    t = tt(dur)
    for v in range(9):
        n = mono_noise(dur, int(rng.integers(1e6)))
        f0 = rng.uniform(250, 650)
        voice = bp(n, f0, f0 * 3.2, 2)
        syl = np.clip(np.sin(2 * np.pi * rng.uniform(2.5, 5.0) * t + rng.uniform(0, 6)) + 0.4 * np.sin(2 * np.pi * rng.uniform(0.3, 1) * t), 0, None)
        out += pan(voice * syl.astype(np.float32), rng.uniform(-0.8, 0.8)) * 0.4
    out = add_reverb(out, 1.4, -8, 0, 20, 4500, 11, tail=False)
    return fade(out, 0.8, 1.0)


def riser(dur: float = 2.6, seed: int = 11) -> np.ndarray:
    n = mono_noise(dur, seed)
    t = tt(dur); p = t / dur
    bands = [bp(n, f / 1.5, f * 1.5) for f in (300, 800, 2000, 5000)]
    y = np.zeros(len(n), np.float32)
    for i, b in enumerate(bands):
        y += b * np.clip(p * 4 - i, 0, 1).astype(np.float32) * 0.6
    f = 110 * 2 ** (p * 3.0)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25 + np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR) * 0.12
    y = (y + tone) * (p ** 2.2)
    y = y.astype(np.float32)
    y[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))
    return haas(y, 8)


def card_boom(dur: float = 3.6, seed: int = 12) -> np.ndarray:
    t = tt(dur)
    f = 28 + 60 * np.exp(-t / 0.22)
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * np.exp(-t / 1.2) + 0.4 * np.sin(2 * ph + 0.4) * np.exp(-t / 0.5)
    th = lp(mono_noise(dur, seed), 300) * np.exp(-t / 0.12)
    ring = _metal([110, 165.5, 233], [1.6, 1.2, 0.9], dur, [0.25, 0.15, 0.1], seed)
    y = (y + 0.7 * th + ring * 0.6).astype(np.float32)
    y[:96] *= np.linspace(0, 1, 96)
    return fade(add_reverb(y, 3.0, -9, 0, 10, 2500, 12, tail=False, dark=1.0), 0, 1.2)


EFFECTS = {
    "whoosh": whoosh, "page_flutter": page_flutter, "anti_magic_hum": anti_magic_hum, "sword_ring": sword_ring,
    "bass_drop": bass_drop, "chain_rattle": chain_rattle, "wind": wind, "heartbeat": heartbeat, "bell": bell,
    "crowd_murmur": crowd_murmur, "riser": riser, "card_boom": card_boom,
}
BEDS = {"wind", "crowd_murmur", "anti_magic_hum", "heartbeat"}
# peak level relative to the loudest speech peak, dB
REL_DB = {"whoosh": -12, "page_flutter": -14, "sword_ring": -12, "bass_drop": -10, "chain_rattle": -14, "bell": -13,
          "riser": -15, "card_boom": -7, "wind": -16, "crowd_murmur": -16, "anti_magic_hum": -17, "heartbeat": -16}
RISER_DUR = 2.6
WHOOSH_LEAD = 0.35  # seconds of whoosh before the beat start so its peak lands on the beat


def render(name: str, dur: float | None = None, seed: int = 0) -> np.ndarray:
    """Render an effect (stereo float32, peak 1.0). Beds loop-free: just generated at `dur`."""
    if name not in EFFECTS:
        raise KeyError(f"unknown sfx {name!r}")
    fn = EFFECTS[name]
    kw = {"seed": seed + 1} if seed else {}
    if dur is not None and name in (BEDS | {"riser"}):
        kw["dur"] = max(0.5, dur)
    return normalise_peak(fn(**kw))


def plan_events(beats: list[dict], card_starts: list[float]) -> list[dict]:
    """Turn beat sfx cues into placed events [{name,start,dur,rel_db,kind}] (start may be < 0 -> clamp later).

    beats: [{start,end,sfx:[...]}] (seconds). Beds in consecutive beats are merged into one bed.
    """
    ev: list[dict] = []
    open_beds: dict[str, dict] = {}
    for b in beats:
        names = list(dict.fromkeys(b.get("sfx") or []))
        for nm in list(open_beds):
            if nm not in names:
                open_beds.pop(nm)
        for nm in names:
            if nm not in EFFECTS:
                continue
            if nm in BEDS:
                cur = open_beds.get(nm)
                if cur and b["start"] - cur["_end"] < 1.0:
                    cur["dur"] = b["end"] + 0.5 - cur["start"]; cur["_end"] = b["end"]
                else:
                    cur = {"name": nm, "start": b["start"] - 0.4, "dur": b["end"] - b["start"] + 0.9, "_end": b["end"]}
                    open_beds[nm] = cur; ev.append(cur)
            elif nm == "riser":
                ev.append({"name": nm, "start": b["start"] - RISER_DUR, "dur": RISER_DUR})
            elif nm == "whoosh":
                ev.append({"name": nm, "start": b["start"] - WHOOSH_LEAD, "dur": None})
            else:
                ev.append({"name": nm, "start": b["start"], "dur": None})
    for c in card_starts:
        ev.append({"name": "card_boom", "start": c, "dur": None})
    for e in ev:
        e.pop("_end", None)
        e["rel_db"] = REL_DB[e["name"]]
    return sorted(ev, key=lambda e: e["start"])


def render_bus(events: list[dict], total: float, speech_peak: float, seed: int = 0) -> np.ndarray:
    """Mix placed events into a stereo bus of `total` seconds; levels set relative to speech_peak."""
    bus = np.zeros((int(total * SR) + 1, 2), np.float32)
    for i, e in enumerate(events):
        st, dur = e["start"], e["dur"]
        if e["name"] == "riser":
            if st < 0:
                dur = max(0.6, RISER_DUR + st); st = 0.0
        x = render(e["name"], dur, seed=seed + i * 7)
        if e["name"] in BEDS:
            x = fade(x, 0.5, 0.7)
        if st < 0:
            x = x[int(-st * SR):]; st = 0.0
        x = x * (speech_peak * db(e["rel_db"]))
        s = int(round(st * SR))
        if s >= len(bus):
            continue
        seg = x[: len(bus) - s]
        bus[s:s + len(seg)] += seg
    return bus


if __name__ == "__main__":
    import time
    for k in EFFECTS:
        t = time.time(); x = render(k, 4 if k in BEDS else None)
        print(f"{k:16s} {len(x)/SR:5.2f}s peak={np.abs(x).max():.2f} rms={20*np.log10(np.sqrt((x**2).mean())+1e-9):6.1f} dB  {time.time()-t:.2f}s")
