"""Original procedural soundtrack, sound effects and final mix. Pure NumPy, no external audio services.

Music is a small composed system: a chord progression per cue, a soft pad, a sub bass, and a seeded
music-box melody on a pentatonic scale. The seed varies ornamentation only, never the cue structure.
"""
from __future__ import annotations
import math, wave
from pathlib import Path
import numpy as np

SR = 44100
A4 = 440.0

# Cue definitions: chords as semitone offsets from the key root, [chord list per bar], mood params.
CUES = {
    "curious":      {"chords": [[0, 4, 7, 11], [5, 9, 12, 16], [2, 5, 9, 12], [7, 11, 14, 17]], "density": 0.55, "bright": 0.6, "tense": 0.0},
    "playful":      {"chords": [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]], "density": 0.8, "bright": 0.8, "tense": 0.0},
    "tension-rise": {"chords": [[0, 3, 7], [8, 12, 15], [5, 8, 12], [7, 10, 14]], "density": 0.5, "bright": 0.4, "tense": 0.35},
    "tension":      {"chords": [[0, 3, 7, 10], [0, 3, 7, 10], [1, 5, 8], [7, 10, 14]], "density": 0.4, "bright": 0.3, "tense": 0.6},
    "tension-peak": {"chords": [[0, 3, 6], [0, 3, 6, 10], [1, 4, 7], [1, 4, 7, 11]], "density": 0.3, "bright": 0.2, "tense": 0.9},
    "revelation":   {"chords": [[0, 4, 7, 11], [5, 9, 12, 16], [9, 12, 16], [7, 11, 14, 17]], "density": 0.6, "bright": 0.9, "tense": 0.0},
    "warm":         {"chords": [[0, 4, 7], [5, 9, 12], [0, 4, 7], [7, 11, 14]], "density": 0.75, "bright": 0.85, "tense": 0.0},
    "outro":        {"chords": [[5, 9, 12, 16], [7, 11, 14], [0, 4, 7, 11], [0, 4, 7, 11]], "density": 0.45, "bright": 0.7, "tense": 0.0},
    # psychological-thriller palette: sparse electric-piano bells, minor colour, optional heartbeat pulse
    "intimate":     {"chords": [[0, 3, 7, 10, 14], [5, 8, 12, 15], [-2, 2, 5, 9], [3, 7, 10, 14]], "density": 0.28, "bright": 0.55, "tense": 0.0, "inst": "bell"},
    "unease":       {"chords": [[0, 3, 7], [1, 4, 8], [0, 3, 7], [-1, 3, 6]], "density": 0.14, "bright": 0.35, "tense": 0.35, "inst": "bell", "pulse": True},
    "cold":         {"chords": [[0, 3, 6], [0, 3, 6, 9], [-1, 2, 6], [0, 3, 6]], "density": 0.08, "bright": 0.2, "tense": 0.7, "inst": "bell", "pulse": True},
    "hush":         {"chords": [[0, 7], [0, 7], [-1, 6], [0, 7]], "density": 0.0, "bright": 0.2, "tense": 0.15, "inst": "none"},
    "power":        {"chords": [[0, 4, 7, 11], [5, 9, 12, 16], [7, 11, 14, 17], [9, 12, 16, 19]], "density": 0.32, "bright": 0.8, "tense": 0.0, "inst": "bell", "pulse": True},
    "aftermath":    {"chords": [[0, 3, 7, 10], [5, 8, 12], [3, 7, 10], [-2, 2, 5, 9]], "density": 0.18, "bright": 0.4, "tense": 0.1, "inst": "bell"},
    # history palette: modal harmony over a drone, plucked lute and a breathy recorder-like lead
    "dawn":         {"chords": [[0, 7, 14], [-2, 5, 12], [0, 7, 14], [3, 10, 15]], "density": 0.22, "bright": 0.55, "tense": 0.0, "inst": "recorder", "drone": True, "scale": [0, 2, 3, 5, 7, 9, 10]},
    "village":      {"chords": [[0, 4, 7], [-2, 2, 5], [0, 4, 7], [5, 9, 12]], "density": 0.62, "bright": 0.8, "tense": 0.0, "inst": "lute", "drone": True, "scale": [0, 2, 4, 5, 7, 9, 10]},
    "market":       {"chords": [[0, 4, 7], [5, 9, 12], [-2, 2, 5], [0, 4, 7]], "density": 0.78, "bright": 0.85, "tense": 0.0, "inst": "lute", "drone": True, "scale": [0, 2, 4, 5, 7, 9, 10], "tabor": True},
    "problem":      {"chords": [[0, 3, 7], [-2, 3, 7], [-4, 0, 3], [-5, -1, 2]], "density": 0.2, "bright": 0.3, "tense": 0.45, "inst": "lute", "drone": True, "scale": [0, 2, 3, 5, 7, 8, 10]},
    "reveal":       {"chords": [[0, 4, 7, 11], [5, 9, 12], [2, 5, 9], [7, 11, 14]], "density": 0.42, "bright": 0.9, "tense": 0.0, "inst": "recorder", "drone": True, "scale": [0, 2, 4, 7, 9]},
    "resolve":      {"chords": [[0, 4, 7], [5, 9, 12], [-3, 0, 4], [-5, -1, 2]], "density": 0.55, "bright": 0.85, "tense": 0.0, "inst": "lute", "drone": True, "scale": [0, 2, 4, 5, 7, 9, 11]},
    "tease":        {"chords": [[0, 3, 7], [-4, 0, 3], [-2, 2, 5], [-5, -1, 2, 5]], "density": 0.25, "bright": 0.45, "tense": 0.25, "inst": "recorder", "drone": True, "scale": [0, 2, 3, 5, 7, 8, 10]},
    # history thriller palette (H03): dread under a drone, a driving brawl, a chase, a numb aftermath
    "dread":        {"chords": [[0, 3, 7], [1, 5, 8], [0, 3, 7], [-1, 3, 6]], "density": 0.12, "bright": 0.3, "tense": 0.55, "inst": "recorder", "drone": True, "pulse": True, "scale": [0, 1, 3, 5, 7, 8, 10]},
    "brawl":        {"chords": [[0, 3, 7], [1, 4, 8], [0, 3, 7], [-2, 2, 5]], "density": 0.7, "bright": 0.35, "tense": 0.8, "inst": "lute", "drone": True, "tabor": True, "pulse": True, "scale": [0, 1, 3, 5, 7, 8, 10]},
    "chase":        {"chords": [[0, 3, 7], [-2, 2, 5], [-4, 0, 3], [-5, -1, 2]], "density": 0.55, "bright": 0.4, "tense": 0.65, "inst": "lute", "drone": True, "tabor": True, "pulse": True, "scale": [0, 2, 3, 5, 7, 8, 10]},
    "numb":         {"chords": [[0, 7], [0, 7], [-1, 6], [0, 7]], "density": 0.06, "bright": 0.25, "tense": 0.3, "inst": "recorder", "drone": True, "scale": [0, 2, 3, 5, 7, 8, 10]},
    "pub":          {"chords": [[0, 4, 7], [5, 9, 12], [-2, 2, 5], [0, 4, 7]], "density": 0.7, "bright": 0.75, "tense": 0.05, "inst": "lute", "drone": True, "tabor": True, "scale": [0, 2, 4, 5, 7, 9, 10]},
}
PENTA = [0, 2, 4, 7, 9]


def note(semi: float, root_hz: float = 261.63) -> float:
    return root_hz * 2 ** (semi / 12)


def env(n: int, a: float, d: float, s: float, r: float, sr: int = SR) -> np.ndarray:
    a_n, d_n, r_n = int(a * sr), int(d * sr), int(r * sr)
    s_n = max(0, n - a_n - d_n - r_n)
    parts = [np.linspace(0, 1, max(a_n, 1)), np.linspace(1, s, max(d_n, 1)), np.full(s_n, s), np.linspace(s, 0, max(r_n, 1))]
    e = np.concatenate(parts)
    return e[:n] if len(e) >= n else np.pad(e, (0, n - len(e)))


def tone(freq: float, dur: float, kind: str = "pluck", amp: float = 0.3, sr: int = SR) -> np.ndarray:
    n = int(dur * sr)
    t = np.arange(n) / sr
    if kind == "pluck":   # music-box / kalimba
        x = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t * 9) + 0.12 * np.sin(2 * np.pi * freq * 3.01 * t) * np.exp(-t * 14)
        x *= np.exp(-t * 3.2) * (1 - np.exp(-t * 400))
    elif kind == "pad":
        vib = 1 + 0.004 * np.sin(2 * np.pi * 5.1 * t)
        x = (np.sin(2 * np.pi * freq * t * vib) + 0.5 * np.sin(2 * np.pi * freq * 2.0 * t + 0.3) * 0.4
             + 0.25 * np.sign(np.sin(2 * np.pi * freq * 0.5 * t)) * 0.2)
        x *= env(n, min(0.9, dur * 0.3), 0.2, 0.75, min(0.8, dur * 0.3))
    elif kind == "bass":
        x = np.sin(2 * np.pi * freq * t) + 0.2 * np.sin(2 * np.pi * freq * 2 * t)
        x *= env(n, 0.02, 0.3, 0.6, min(0.5, dur * 0.4))
    elif kind == "bell":
        x = sum(a * np.sin(2 * np.pi * freq * r * t) * np.exp(-t * dcy) for a, r, dcy in [(1, 1, 2.5), (0.6, 2.76, 4), (0.4, 5.4, 6), (0.25, 8.9, 9)])
        x *= (1 - np.exp(-t * 600))
    elif kind == "lute":   # gut-string pluck: bright attack, quick decay of upper partials
        x = sum(a * np.sin(2 * np.pi * freq * k * t) * np.exp(-t * (2.6 + k * 2.2)) for k, a in [(1, 1), (2, 0.55), (3, 0.32), (4, 0.18), (5, 0.1)])
        x *= (1 - np.exp(-t * 900))
    elif kind == "recorder":   # breathy wooden flute: soft attack, gentle vibrato, a little breath noise
        vib = 1 + 0.005 * np.sin(2 * np.pi * 5.3 * t) * np.clip(t / 0.4, 0, 1)
        ph = 2 * np.pi * freq * np.cumsum(vib) / sr
        x = np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph)
        br = np.random.default_rng(int(freq)).standard_normal(n) * 0.05
        x = (x + br) * env(n, 0.06, 0.1, 0.8, min(0.25, dur * 0.3))
    elif kind == "drone":
        x = np.sin(2 * np.pi * freq * t) + 0.5 * np.sin(2 * np.pi * freq * 1.5 * t) + 0.25 * np.sin(2 * np.pi * freq * 2 * t)
        x *= env(n, min(1.0, dur * 0.3), 0.2, 0.85, min(1.0, dur * 0.3))
    else:
        x = np.sin(2 * np.pi * freq * t) * env(n, 0.01, 0.1, 0.7, 0.1)
    return (amp * x).astype(np.float32)


def lowpass(x: np.ndarray, cutoff: float, sr: int = SR) -> np.ndarray:
    rc = 1 / (2 * math.pi * cutoff); dt = 1 / sr; a = dt / (rc + dt)
    y = np.empty_like(x); acc = 0.0
    # vectorised one-pole via lfilter-free loop in chunks (fast enough for short sfx)
    for i in range(len(x)):
        acc += a * (x[i] - acc); y[i] = acc
    return y


def lowpass_fast(x: np.ndarray, cutoff: float, sr: int = SR) -> np.ndarray:
    """FFT brick-wall-ish lowpass with soft edge, for long signals."""
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / sr)
    X *= 1 / (1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, n=len(x)).astype(np.float32)


def add(buf: np.ndarray, x: np.ndarray, at: float, sr: int = SR) -> None:
    i = int(at * sr)
    if i >= len(buf):
        return
    x = x[: len(buf) - i]
    buf[i:i + len(x)] += x


# ---------------------------------------------------------------- music
def compose(timeline: list[dict], total: float, seed: int, bpm: int = 96, key_semi: int = -3) -> np.ndarray:
    """timeline: [{start, end, music_cue}] in seconds. Returns mono float32."""
    rng = np.random.default_rng(seed)
    n = int(total * SR) + SR
    pad_buf = np.zeros(n, np.float32); mel = np.zeros(n, np.float32); bass = np.zeros(n, np.float32); tex = np.zeros(n, np.float32)
    beat = 60 / bpm; bar = beat * 4
    root = note(key_semi)
    t = 0.0; bar_i = 0
    last_mel = 4
    while t < total:
        seg = next((s for s in timeline if s["start"] <= t < s["end"]), timeline[-1])
        cue = CUES[seg["music_cue"]]
        chord = cue["chords"][bar_i % len(cue["chords"])]
        bar_len = min(bar, total - t + 0.5)
        # pad
        for k, semi in enumerate(chord):
            add(pad_buf, tone(note(semi - 12 * (k == 0), root), bar_len + 0.6, "pad", 0.07 * (1.15 if cue["bright"] > 0.5 else 0.9)), t)
        # bass every bar, plus a passing note on beat 3 for playful/warm
        add(bass, tone(note(chord[0] - 24, root), bar_len * 0.95, "bass", 0.16), t)
        if cue["density"] > 0.7:
            add(bass, tone(note(chord[0] - 24 + 7, root), beat * 0.9, "bass", 0.10), t + beat * 2.5)
        if cue.get("drone"):   # bourdon on root + fifth under the whole bar
            add(pad_buf, tone(note(-12, root), bar_len + 0.6, "drone", 0.05), t)
        if cue.get("tabor"):   # small frame drum: a light dance rhythm
            for off, a in ((0.0, 0.16), (beat * 1.5, 0.08), (beat * 2, 0.12), (beat * 3, 0.08), (beat * 3.5, 0.06)):
                m = int(0.12 * SR); nz = rng.standard_normal(m).astype(np.float32)
                hit = lowpass_fast(nz, 1400) * np.exp(-np.arange(m) / SR * 40) + np.sin(2 * np.pi * 110 * np.arange(m) / SR) * np.exp(-np.arange(m) / SR * 30)
                add(tex, (hit * a).astype(np.float32), t + off)
        if cue.get("pulse"):   # heartbeat-like low pulse: lub-dub on beat 1
            for off, a in ((0.0, 0.22), (0.28, 0.14)):
                add(bass, tone(55, 0.35, "bass", a), t + off)
        inst = cue.get("inst", "pluck")
        # melody: seeded steps on the pentatonic scale, 8th-note grid, density-controlled
        for step in range(8 if inst != "none" else 0):
            if rng.random() < cue["density"] * (1.0 if step % 2 == 0 else 0.55):
                move = int(rng.integers(-2, 3))
                sc = cue.get("scale", PENTA)
                last_mel = int(np.clip(last_mel + move, 0, len(sc) * 2 - 1))
                semi = sc[last_mel % len(sc)] + 12 * (last_mel // len(sc)) + 12
                if cue["tense"] > 0.5 and semi % 12 == 4:
                    semi -= 1  # flatten the third in tense cues
                amp = 0.12 * (0.7 + 0.6 * cue["bright"]) * (1.0 if step % 4 == 0 else 0.75)
                if inst == "bell":
                    add(mel, tone(note(semi, root), beat * 2.2, "bell", amp * 0.55), t + step * beat / 2)
                elif inst == "lute":
                    add(mel, tone(note(semi, root), beat * 1.4, "lute", amp * 0.8), t + step * beat / 2)
                elif inst == "recorder":
                    if step % 2 == 0:
                        add(mel, tone(note(semi + 12, root), beat * 0.95, "recorder", amp * 0.5), t + step * beat / 2)
                else:
                    add(mel, tone(note(semi, root), beat * 1.6, "pluck", amp), t + step * beat / 2)
        # tension texture: slow tremolo noise swell
        if cue["tense"] > 0:
            m = int(bar_len * SR)
            noise = rng.standard_normal(m).astype(np.float32)
            noise = lowpass_fast(noise, 400 + 900 * cue["tense"])
            trem = 0.5 + 0.5 * np.sin(2 * np.pi * (5 + 6 * cue["tense"]) * np.arange(m) / SR)
            add(tex, (noise * trem * env(m, 0.4, 0.1, 0.8, 0.3) * 0.05 * cue["tense"]).astype(np.float32), t)
        t += bar; bar_i += 1
    mix = pad_buf + mel + bass + tex
    mix = lowpass_fast(mix, 7000)
    # gentle fade in/out
    fade = int(1.2 * SR)
    mix[:fade] *= np.linspace(0, 1, fade)
    end = int(total * SR)
    mix[end - int(2.0 * SR):end] *= np.linspace(1, 0, int(2.0 * SR))
    mix[end:] = 0
    return mix[:end]


# ---------------------------------------------------------------- sfx
def sfx(name: str, seed: int = 0) -> np.ndarray:
    x = _sfx(name, seed)
    peak = float(np.max(np.abs(x))) if len(x) else 0.0
    return (x * (0.95 / peak) if peak > 0.95 else x).astype(np.float32)


def _sfx(name: str, seed: int = 0) -> np.ndarray:
    import zlib
    rng = np.random.default_rng(seed + zlib.crc32(name.encode()) % 1000)  # stable across processes (str hash is randomised)
    def noise(d): return rng.standard_normal(int(d * SR)).astype(np.float32)
    def tt(d): return np.arange(int(d * SR)) / SR
    if name == "sparkle":
        out = np.zeros(int(0.9 * SR), np.float32)
        for i in range(7):
            add(out, tone(note(rng.choice([12, 16, 19, 24, 28]) , 1046.5), 0.35, "bell", 0.12), i * 0.06)
        return out
    if name == "flutter":
        x = noise(0.6) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 17 * tt(0.6))))
        return lowpass_fast(x, 1800) * env(len(x), 0.05, 0.1, 0.6, 0.2) * 0.25
    if name == "paper":
        x = lowpass_fast(noise(0.35), 3500) * env(int(0.35 * SR), 0.02, 0.08, 0.35, 0.2)
        return x * 0.28
    if name == "thud":
        t = tt(0.4)
        return (np.sin(2 * np.pi * (70 + 40 * np.exp(-t * 30)) * t) * np.exp(-t * 11) * 0.8 + lowpass_fast(noise(0.4), 900) * np.exp(-t * 60) * 0.3).astype(np.float32)
    if name == "stamp":
        t = tt(0.35)
        click = lowpass_fast(noise(0.35), 4000) * np.exp(-t * 90) * 0.5
        return (click + np.sin(2 * np.pi * 120 * t) * np.exp(-t * 25) * 0.6).astype(np.float32)
    if name == "coins":
        out = np.zeros(int(1.0 * SR), np.float32)
        for i in range(9):
            add(out, tone(2600 + rng.uniform(-400, 900), 0.22, "bell", 0.09), i * 0.07 + rng.uniform(0, 0.03))
        return out
    if name == "drain":
        t = tt(0.9)
        x = lowpass_fast(noise(0.9), 1200) * (0.6 + 0.4 * np.sin(2 * np.pi * (28 - 18 * t) * t))
        return (x * env(len(x), 0.05, 0.2, 0.6, 0.4) * 0.3).astype(np.float32)
    if name == "water":
        x = lowpass_fast(noise(1.6), 700) * (0.7 + 0.3 * np.sin(2 * np.pi * 3 * tt(1.6)))
        return (x * env(len(x), 0.4, 0.3, 0.7, 0.6) * 0.3).astype(np.float32)
    if name == "gate":
        t = tt(0.6)
        x = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, d in [(310, 6), (523, 9), (1270, 14), (2100, 20)])
        return (x * 0.18 + lowpass_fast(noise(0.6), 2500) * np.exp(-t * 50) * 0.3).astype(np.float32)
    if name == "brake":
        t = tt(0.7)
        f = 1800 - 900 * t
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.6 + 0.4 * np.sin(2 * np.pi * 40 * t))
        return (x * env(len(x), 0.05, 0.1, 0.7, 0.3) * 0.16).astype(np.float32)
    if name == "sting":
        t = tt(1.4)
        x = sum(np.sin(2 * np.pi * f * t) for f in [note(-15), note(-9), note(-3), note(2)])
        return (x * np.exp(-t * 2.2) * 0.14 + np.sin(2 * np.pi * 55 * t) * np.exp(-t * 4) * 0.3).astype(np.float32)
    if name == "chime":
        out = np.zeros(int(1.4 * SR), np.float32)
        for i, s in enumerate([0, 7, 12]):
            add(out, tone(note(s, 1046.5), 1.2, "bell", 0.12), i * 0.12)
        return out
    if name == "ping":
        out = np.zeros(int(0.7 * SR), np.float32)
        add(out, tone(1318.5, 0.45, "bell", 0.16), 0); add(out, tone(1760, 0.5, "bell", 0.14), 0.11)
        return out
    if name == "rumble":
        t = tt(1.3)
        x = lowpass_fast(noise(1.3), 160) * (1 + 0.5 * np.sin(2 * np.pi * 7 * t))
        return (x * env(len(x), 0.3, 0.2, 0.8, 0.4) * 0.9).astype(np.float32)
    if name == "rain":   # 4 s of steady rain on glass and pavement
        t = tt(4.0)
        x = lowpass_fast(noise(4.0), 6000) - lowpass_fast(noise(4.0), 900) * 0.3
        drops = (rng.random(len(t)) > 0.9993).astype(np.float32)
        x = x * 0.18 + lowpass_fast(drops, 3000) * 2.5
        f = int(0.3 * SR); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
        return x.astype(np.float32)
    if name == "buzz":   # phone vibrating on a desk: two pulses
        out = np.zeros(int(0.9 * SR), np.float32)
        for k in (0.0, 0.45):
            t = tt(0.3)
            x = np.sign(np.sin(2 * np.pi * 175 * t)) * 0.5 + np.sin(2 * np.pi * 350 * t) * 0.3
            x = lowpass_fast(x.astype(np.float32), 900) * env(len(t), 0.01, 0.05, 0.9, 0.05)
            add(out, (x * 0.35).astype(np.float32), k)
        return out
    if name == "thump":  # heartbeat
        out = np.zeros(int(0.8 * SR), np.float32)
        for k, a in ((0.0, 0.9), (0.24, 0.6)):
            t = tt(0.25)
            add(out, (np.sin(2 * np.pi * (48 + 30 * np.exp(-t * 40)) * t) * np.exp(-t * 16) * a).astype(np.float32), k)
        return out
    if name == "step":   # one footstep on a hard floor
        t = tt(0.25)
        x = np.sin(2 * np.pi * 90 * t) * np.exp(-t * 35) * 0.6 + lowpass_fast(noise(0.25), 3000) * np.exp(-t * 60) * 0.4
        return x.astype(np.float32)
    if name == "pen":    # ballpoint click-click
        out = np.zeros(int(0.3 * SR), np.float32)
        for k in (0.0, 0.11):
            t = tt(0.03); add(out, (lowpass_fast(noise(0.03), 7000) * np.exp(-t * 400) * 0.5).astype(np.float32), k)
        return out
    if name == "door":   # glass door closing: soft thud then latch click
        t = tt(0.6)
        x = np.sin(2 * np.pi * 70 * t) * np.exp(-t * 14) * 0.6
        c = np.zeros_like(x); i = int(0.18 * SR); m = int(0.03 * SR)
        c[i:i + m] = lowpass_fast(noise(0.03), 6000)[:m] * np.exp(-np.arange(m) / SR * 300) * 0.5
        return (x + c).astype(np.float32)
    if name == "swell":  # rising air before a reveal
        t = tt(1.4)
        x = lowpass_fast(noise(1.4), 2500) * (t / 1.4) ** 2.2
        x[-int(0.04 * SR):] *= np.linspace(1, 0, int(0.04 * SR))
        return (x * 0.5).astype(np.float32)
    if name == "tick":
        t = tt(0.06)
        x = np.sin(2 * np.pi * 2300 * t) * np.exp(-t * 120) + 0.6 * np.sin(2 * np.pi * 1150 * t) * np.exp(-t * 90)
        x += lowpass_fast(noise(0.06), 6000) * np.exp(-t * 300) * 0.5
        return (x * 0.6).astype(np.float32)
    if name == "puff":
        t = tt(0.45)
        x = lowpass_fast(noise(0.45), 2600) * np.exp(-t * 9) * (1 - np.exp(-t * 300))
        return (x * 0.45).astype(np.float32)
    if name == "beep":
        t = tt(0.22)
        return (np.sin(2 * np.pi * 1320 * t) * env(len(t), 0.005, 0.05, 0.6, 0.08) * 0.22).astype(np.float32)
    if name == "static":
        t = tt(1.4)
        x = noise(1.4) * (0.5 + 0.5 * (rng.random(len(t)) > 0.97))
        x = lowpass_fast(x, 5000) - lowpass_fast(x, 600)
        return (x * env(len(t), 0.05, 0.2, 0.7, 0.6) * 0.32).astype(np.float32)
    if name == "whoosh":
        t = tt(0.5)
        return (lowpass_fast(noise(0.5), 1500) * env(len(t), 0.15, 0.1, 0.5, 0.2) * 0.3).astype(np.float32)
    # ---- history palette
    if name == "hen":     # a few clucks: pitched pulses with a noisy, nasal attack
        out = np.zeros(int(1.1 * SR), np.float32)
        for k, (f0, d) in enumerate([(520, 0.09), (560, 0.08), (480, 0.16)]):
            t = tt(d); f = f0 * (1 + 0.25 * np.exp(-t * 30))
            x = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.5 * np.sin(4 * np.pi * np.cumsum(f) / SR) + lowpass_fast(noise(d), 3000) * 0.4
            add(out, (x * env(len(t), 0.005, 0.03, 0.6, d * 0.5) * 0.3).astype(np.float32), k * 0.17 + (0.2 if k == 2 else 0))
        return out
    if name == "creak":   # wooden door on leather hinges: slow stick-slip friction
        t = tt(1.0); f = 140 + 220 * np.sin(np.pi * t) + 30 * np.sin(2 * np.pi * 3 * t)
        pulses = (np.sin(2 * np.pi * np.cumsum(f) / SR) > 0.85).astype(np.float32)
        x = lowpass_fast(pulses, 2500) - lowpass_fast(pulses, 300)
        return (x * env(len(t), 0.1, 0.2, 0.8, 0.3) * 0.9).astype(np.float32)
    if name == "chink":   # small silver coin on wood
        out = np.zeros(int(0.6 * SR), np.float32)
        for k, f in enumerate([3200, 4100]):
            t = tt(0.4); add(out, (sum(np.sin(2 * np.pi * f * r * t) * np.exp(-t * d) for r, d in [(1, 18), (1.47, 26), (2.09, 34)]) * 0.12).astype(np.float32), k * 0.09)
        return out
    if name == "chop":    # blade through soft silver into the board
        t = tt(0.4)
        x = np.sin(2 * np.pi * (180 + 300 * np.exp(-t * 40)) * t) * np.exp(-t * 22) * 0.7 + lowpass_fast(noise(0.4), 5000) * np.exp(-t * 70) * 0.5
        x += sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 30) for f in (2900, 4300)) * 0.06
        return x.astype(np.float32)
    if name == "churchbell":   # bronze bell: hum, prime, minor tierce, quint, nominal (inharmonic partials)
        t = tt(4.0); f0 = 220
        x = sum(a * np.sin(2 * np.pi * f0 * r * t) * np.exp(-t * d) for r, a, d in [(0.5, 0.5, 0.5), (1, 0.8, 0.8), (1.19, 0.5, 1.0), (1.5, 0.3, 1.3), (2, 0.55, 1.5), (2.5, 0.2, 2.2), (2.66, 0.18, 2.6)])
        return (x * (1 - np.exp(-t * 300)) * 0.28).astype(np.float32)
    if name == "anvil":   # distant hammer on iron
        t = tt(0.5)
        x = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, d in [(1180, 9), (2650, 14), (3900, 20)]) * 0.2 + lowpass_fast(noise(0.5), 4000) * np.exp(-t * 120) * 0.3
        return x.astype(np.float32)
    if name == "rustle":  # straw and wool shifting
        t = tt(0.9)
        x = (lowpass_fast(noise(0.9), 5000) - lowpass_fast(noise(0.9), 1200)) * (0.4 + 0.6 * (rng.random(len(t)) > 0.6))
        return (lowpass_fast(x.astype(np.float32), 6000) * env(len(t), 0.1, 0.2, 0.6, 0.3) * 0.35).astype(np.float32)
    if name == "mudstep":  # a footstep in soft mud
        t = tt(0.3)
        x = np.sin(2 * np.pi * 70 * t) * np.exp(-t * 25) * 0.5 + lowpass_fast(noise(0.3), 700) * np.exp(-t * 18) * 0.5
        return x.astype(np.float32)
    if name == "gasp":    # a small crowd "ooh": band-limited noise swell with a vowel-ish resonance
        t = tt(1.0)
        x = lowpass_fast(noise(1.0), 1100) - lowpass_fast(noise(1.0), 250)
        x = x * np.sin(np.pi * np.clip(t / 1.0, 0, 1)) ** 1.5
        return (x * 0.6).astype(np.float32)
    # ---- H03: the brawl and the hue and cry
    if name == "smash":   # a fired-clay jug bursting: sharp crack, a spray of high fragments, pieces skittering
        t = tt(1.2)
        crack = (noise(1.2) - lowpass_fast(noise(1.2), 2500)) * np.exp(-t * 30)
        ring = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * np.exp(-t * d) for f, d in [(1730, 22), (2910, 28), (4170, 34), (5230, 40)]) * 0.25
        x = crack * 0.9 + ring
        for k in range(14):   # bits of jug landing on the floor
            at = 0.08 + rng.uniform(0, 0.7); m = int(0.05 * SR); tk = np.arange(m) / SR
            bit = (rng.standard_normal(m) - lowpass_fast(rng.standard_normal(m).astype(np.float32), 3000)) * np.exp(-tk * 90) * rng.uniform(0.1, 0.35)
            add(x, bit.astype(np.float32), at)
        return (x * 0.8).astype(np.float32)
    if name == "punch":   # a blow landing: low body thump and a dull slap
        t = tt(0.45)
        x = np.sin(2 * np.pi * (70 + 60 * np.exp(-t * 30)) * t) * np.exp(-t * 14) * 0.9 + lowpass_fast(noise(0.45), 1800) * np.exp(-t * 45) * 0.6
        return x.astype(np.float32)
    if name == "horn":   # a cow-horn blown to raise the hue and cry: rough, wavering, two calls
        out = np.zeros(int(2.6 * SR), np.float32)
        for k, d in ((0.0, 1.0), (1.25, 1.2)):
            t = tt(d); f = 196 * (1 + 0.012 * np.sin(2 * np.pi * 5.5 * t)) * (1 + 0.02 * np.minimum(t / 0.15, 1))
            ph = 2 * np.pi * np.cumsum(f) / SR
            x = sum(a * np.sin(n * ph) for n, a in [(1, 1), (2, 0.6), (3, 0.42), (4, 0.25), (5, 0.12)]) + lowpass_fast(noise(d), 2400) * 0.08
            add(out, (np.tanh(x * 1.6) * env(len(t), 0.08, 0.1, 0.85, 0.25) * 0.28).astype(np.float32), k)
        return out
    if name == "roar":    # the alehouse erupts: many voices shouting at once, a bench scraping
        t = tt(1.6)
        x = np.zeros(len(t), np.float32)
        for v in range(10):
            band = lowpass_fast(noise(1.6), rng.uniform(900, 2200)) - lowpass_fast(noise(1.6), rng.uniform(180, 320))
            syl = np.clip(np.sin(2 * np.pi * rng.uniform(4, 7) * t + rng.uniform(0, 6)), 0, None) ** 0.6
            x += (band * syl * rng.uniform(0.15, 0.3)).astype(np.float32)
        return (x * env(len(t), 0.05, 0.3, 0.7, 0.6) * 0.7).astype(np.float32)
    if name == "doorslam":   # a heavy oak door banging shut in a stone porch
        t = tt(1.4)
        x = np.sin(2 * np.pi * (58 + 40 * np.exp(-t * 25)) * t) * np.exp(-t * 9) + lowpass_fast(noise(1.4), 1500) * np.exp(-t * 22) * 0.7
        tail = lowpass_fast(noise(1.4), 900) * np.exp(-t * 3.2) * 0.12   # the porch answering
        return ((x + tail) * 0.7).astype(np.float32)
    if name == "run":   # several feet running on packed earth, passing
        out = np.zeros(int(2.4 * SR), np.float32); k = 0.0
        while k < 2.2:
            m = int(0.12 * SR); tk = np.arange(m) / SR
            step = np.sin(2 * np.pi * rng.uniform(60, 90) * tk) * np.exp(-tk * 30) * 0.5 + lowpass_fast(rng.standard_normal(m).astype(np.float32), 900) * np.exp(-tk * 26) * 0.4
            add(out, (step * np.sin(np.pi * min(1, k / 2.2)) ** 0.7).astype(np.float32), k); k += rng.uniform(0.07, 0.15)
        return out
    # ---- What If? (1340): the workshop, the ledger, the well
    if name == "hiss":    # steam escaping from a bad joint, building up
        t = tt(2.0)
        x = (noise(2.0) - lowpass_fast(noise(2.0), 3500)) * np.clip(t / 1.6, 0, 1) ** 1.5
        return (x * env(len(t), 0.3, 0.2, 0.9, 0.2) * 0.45).astype(np.float32)
    if name == "burst":   # the boiler lid blows: a bang, a roar of steam, metal clattering down
        t = tt(2.6)
        bang = np.sin(2 * np.pi * (60 + 50 * np.exp(-t * 30)) * t) * np.exp(-t * 10) + lowpass_fast(noise(2.6), 2500) * np.exp(-t * 20) * 0.8
        roar = (noise(2.6) - lowpass_fast(noise(2.6), 1800)) * np.exp(-t * 1.2) * 0.45
        x = bang + roar
        for k, a in ((1.1, 0.4), (1.45, 0.25), (1.7, 0.15)):
            m = int(0.25 * SR); tk = np.arange(m) / SR
            add(x, (sum(np.sin(2 * np.pi * f * tk) * np.exp(-tk * d) for f, d in [(1450, 16), (2380, 22), (3460, 30)]) * a * 0.3).astype(np.float32), k)
        return (x * 0.75).astype(np.float32)
    if name == "quill":   # a quill scratching across parchment: a few strokes
        out = np.zeros(int(1.4 * SR), np.float32); k = 0.05
        while k < 1.25:
            d = rng.uniform(0.08, 0.22); m = int(d * SR); tk = np.arange(m) / SR
            stroke = (rng.standard_normal(m) - lowpass_fast(rng.standard_normal(m).astype(np.float32), 2500)) * np.sin(np.pi * tk / d) ** 0.8
            add(out, (stroke * 0.18).astype(np.float32), k); k += d + rng.uniform(0.04, 0.12)
        return out
    if name == "splash":  # a bucket of water tipped out
        t = tt(1.2)
        x = lowpass_fast(noise(1.2), 2600) * np.exp(-t * 4) * np.clip(t / 0.05, 0, 1)
        for k in range(10):
            at = 0.05 + rng.uniform(0, 0.8); m = int(0.04 * SR); tk = np.arange(m) / SR
            add(x, (np.sin(2 * np.pi * rng.uniform(600, 1400) * tk * (1 + tk * 8)) * np.exp(-tk * 80) * 0.15).astype(np.float32), at)
        return (x * 0.6).astype(np.float32)
    if name == "clang":   # a giant hollow copper foot coming down: deep thump with a long metallic ring
        t = tt(2.2)
        body = np.sin(2 * np.pi * (48 + 30 * np.exp(-t * 20)) * t) * np.exp(-t * 6) * 0.8
        ring = sum(np.sin(2 * np.pi * f * t + i) * np.exp(-t * d) * a for i, (f, d, a) in enumerate([(211, 2.2, 0.16), (347, 2.8, 0.1), (529, 3.5, 0.07), (811, 4.5, 0.04)]))
        return (body + ring + lowpass_fast(noise(2.2), 600) * np.exp(-t * 25) * 0.3).astype(np.float32)
    if name == "foghorn":   # a ship's horn across the water: two low notes, a slow attack
        t = tt(2.4)
        x = (np.sign(np.sin(2 * np.pi * 98 * t)) + 0.6 * np.sign(np.sin(2 * np.pi * 147 * t))) * np.minimum(1, t * 3) * np.exp(-np.maximum(0, t - 1.9) * 9)
        return (lowpass_fast(x.astype(np.float32), 700) * 0.35).astype(np.float32)
    if name == "baa":   # a sheep: a bleating vowel with a fast tremolo
        t = tt(0.8)
        f = 330 + 50 * np.sin(np.pi * t / 0.8); x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * (0.6 + 0.4 * np.sin(2 * np.pi * 26 * t)) * np.sin(np.pi * t / 0.8)
        return (lowpass_fast(x.astype(np.float32), 1800) * 0.4).astype(np.float32)
    if name == "whale":   # a humpback's rising, then falling moan
        t = tt(2.6)
        f = 160 + 220 * np.sin(np.pi * t / 2.6) + 18 * np.sin(2 * np.pi * 4 * t); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 2.6) ** 1.2
        return (lowpass_fast(x.astype(np.float32), 1200) * 0.5).astype(np.float32)
    raise KeyError(name)


# ---------------------------------------------------------------- ambience beds (history mode)
def ambience(kind: str, dur: float, seed: int = 0) -> np.ndarray:
    """Continuous background for a stretch of the episode. kinds: interior, village, market, alehouse, night, forge, hall, city, space, polar."""
    import zlib
    rng = np.random.default_rng(seed + zlib.crc32(kind.encode()) % 1000)
    n = int(dur * SR); t = np.arange(n) / SR
    def nz(): return rng.standard_normal(n).astype(np.float32)
    out = np.zeros(n, np.float32)
    if kind in ("interior", "village", "market"):   # wind / room tone
        w = lowpass_fast(nz(), 350 if kind == "interior" else 600) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * t + rng.uniform(0, 6)))
        out += w * (0.10 if kind == "interior" else 0.07)
    if kind in ("village", "interior"):   # birdsong: short FM chirps in phrases (muffled indoors)
        k = 0.0
        while k < dur:
            k += rng.uniform(0.6, 2.4)
            for j in range(int(rng.integers(2, 6))):
                d = rng.uniform(0.05, 0.12); m = int(d * SR); tt_ = np.arange(m) / SR
                f = rng.uniform(2600, 4200) + rng.uniform(-900, 900) * tt_ / d
                ch = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt_ / d) ** 2
                add(out, (ch * (0.03 if kind == "village" else 0.008)).astype(np.float32), k + j * rng.uniform(0.08, 0.16))
    if kind == "alehouse":   # low talk around the boards, the fire crackling, now and then a cup set down
        for v in range(7):
            x = lowpass_fast(nz(), rng.uniform(600, 1200)) - lowpass_fast(nz(), 200)
            syl = np.clip(np.sin(2 * np.pi * rng.uniform(2.5, 4.5) * t + rng.uniform(0, 6)) + 0.5 * np.sin(2 * np.pi * 0.21 * t + v), 0, None)
            out += (x * syl * 0.03).astype(np.float32)
        k = 0.0
        while k < dur:   # fire: crackles and pops
            k += rng.exponential(0.12); m = int(0.02 * SR)
            if k * SR + m < n: out[int(k * SR): int(k * SR) + m] += (rng.standard_normal(m) * np.exp(-np.arange(m) / SR * 300) * rng.uniform(0.02, 0.09)).astype(np.float32)
        k = 1.0
        while k < dur:   # wooden cups on boards
            k += rng.uniform(2.5, 6.0); m = int(0.08 * SR); tk = np.arange(m) / SR
            if k * SR + m < n: out[int(k * SR): int(k * SR) + m] += (np.sin(2 * np.pi * rng.uniform(380, 520) * tk) * np.exp(-tk * 60) * 0.05).astype(np.float32)
        out += lowpass_fast(nz(), 220) * 0.05
    if kind == "night":   # still night air: a breath of wind, crickets in the grass, a dog far off
        out += lowpass_fast(nz(), 400) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.05 * t + rng.uniform(0, 6))) * 0.06
        chirp = np.sin(2 * np.pi * 4400 * t) * (np.sin(2 * np.pi * 28 * t) > 0.3) * (np.sin(2 * np.pi * 1.3 * t) > -0.2)
        out += (chirp * 0.008).astype(np.float32)
        k = 3.0
        while k < dur:   # a distant dog
            k += rng.uniform(5, 10)
            for j in range(int(rng.integers(1, 3))):
                m = int(0.16 * SR); tk = np.arange(m) / SR
                bark = np.sin(2 * np.pi * (520 - 300 * tk / 0.16) * tk) * np.exp(-tk * 18)
                if (k + j * 0.3) * SR + m < n: out[int((k + j * 0.3) * SR): int((k + j * 0.3) * SR) + m] += lowpass_fast(bark.astype(np.float32), 1400) * 0.02
    if kind == "forge":   # the forge breathing under the bellows, the odd ring of iron
        breath = 0.6 + 0.4 * np.sin(2 * np.pi * t / 2.6)
        out += (lowpass_fast(nz(), 500) * breath * 0.08).astype(np.float32)
        k = 0.0
        while k < dur:
            k += rng.exponential(0.15); m = int(0.02 * SR)
            if k * SR + m < n: out[int(k * SR): int(k * SR) + m] += (rng.standard_normal(m) * np.exp(-np.arange(m) / SR * 300) * rng.uniform(0.01, 0.05)).astype(np.float32)
    if kind == "hall":   # a big stone room at night: low air, a fire across the hall
        out += lowpass_fast(nz(), 260) * 0.05
        k = 0.0
        while k < dur:
            k += rng.exponential(0.25); m = int(0.02 * SR)
            if k * SR + m < n: out[int(k * SR): int(k * SR) + m] += (rng.standard_normal(m) * np.exp(-np.arange(m) / SR * 200) * rng.uniform(0.005, 0.03)).astype(np.float32)
    if kind == "market":   # crowd murmur: several syllabic noise "voices" in the speech band
        for v in range(6):
            x = lowpass_fast(nz(), rng.uniform(700, 1400)) - lowpass_fast(nz(), 180)
            syl = np.clip(np.sin(2 * np.pi * rng.uniform(3, 5) * t + rng.uniform(0, 6)) + 0.4 * np.sin(2 * np.pi * 0.3 * t + v), 0, None)
            out += (x * syl * 0.045).astype(np.float32)
    if kind == "city":   # a modern street: traffic hum, cars passing now and then, a far-off horn
        out += lowpass_fast(nz(), 180) * 0.09 + lowpass_fast(nz(), 900) * 0.025
        k = 0.5
        while k < dur:
            k += rng.uniform(1.6, 4.0); d = rng.uniform(1.6, 2.6); m = int(d * SR); tk = np.arange(m) / SR
            env = np.exp(-((tk - d / 2) / (d / 5)) ** 2)
            car = lowpass_fast(rng.standard_normal(m).astype(np.float32), rng.uniform(500, 900)) * env * rng.uniform(0.06, 0.12)
            if k * SR + m < n: out[int(k * SR): int(k * SR) + m] += car
        k = 4.0
        while k < dur:
            k += rng.uniform(7, 14); m = int(0.35 * SR); tk = np.arange(m) / SR
            horn = (np.sign(np.sin(2 * np.pi * 410 * tk)) + 0.6 * np.sign(np.sin(2 * np.pi * 520 * tk))) * np.minimum(1, tk * 40) * np.exp(-np.maximum(0, tk - 0.25) * 30)
            if k * SR + m < n: out[int(k * SR): int(k * SR) + m] += lowpass_fast(horn.astype(np.float32), 1500) * 0.012
    if kind == "space":   # no sound in space: a low, slow drone so the cut is not dead air
        out += (np.sin(2 * np.pi * 55 * t) * 0.02 + np.sin(2 * np.pi * 82.4 * t + 1) * 0.012) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.05 * t))
        out += lowpass_fast(nz(), 120) * 0.03
    if kind == "harbour":   # water lapping, gulls, a distant ferry horn
        out += (lowpass_fast(nz(), 500) - lowpass_fast(nz(), 120)) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.23 * t)) * 0.07
        k = 1.0
        while k < dur:   # gulls: a falling two-note cry
            k += rng.uniform(2.0, 5.0); m = int(0.5 * SR); tk = np.arange(m) / SR
            cry = np.sin(2 * np.pi * np.cumsum(1600 - 700 * np.minimum(1, tk / 0.5)) / SR) * np.sin(np.pi * tk / 0.5) * (np.sin(2 * np.pi * 9 * tk) > -0.4)
            if k * SR + m < n: out[int(k * SR): int(k * SR) + m] += lowpass_fast(cry.astype(np.float32), 3000) * rng.uniform(0.01, 0.025)
        k = 6.0
        while k < dur:   # a ferry horn far off
            k += rng.uniform(14, 22); m = int(1.2 * SR); tk = np.arange(m) / SR
            horn = (np.sign(np.sin(2 * np.pi * 110 * tk)) + 0.5 * np.sign(np.sin(2 * np.pi * 165 * tk))) * np.minimum(1, tk * 6) * np.exp(-np.maximum(0, tk - 0.9) * 8)
            if k * SR + m < n: out[int(k * SR): int(k * SR) + m] += lowpass_fast(horn.astype(np.float32), 600) * 0.012
    if kind == "outback":   # dry wind over spinifex, cicadas, a crow
        out += (lowpass_fast(nz(), 900) - lowpass_fast(nz(), 250)) * (0.4 + 0.6 * np.sin(2 * np.pi * 0.07 * t + 1) ** 2) * 0.05
        out += (np.sin(2 * np.pi * 5200 * t) * (np.sin(2 * np.pi * 60 * t) > 0.2) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.3 * t)) * 0.006).astype(np.float32)
        k = 3.0
        while k < dur:
            k += rng.uniform(6, 12); m = int(0.7 * SR); tk = np.arange(m) / SR
            caw = np.sin(2 * np.pi * np.cumsum(520 - 180 * tk / 0.7) / SR) * np.sin(np.pi * tk / 0.7) ** 0.5 * (np.sin(2 * np.pi * 14 * tk) > -0.2)
            if k * SR + m < n: out[int(k * SR): int(k * SR) + m] += lowpass_fast(caw.astype(np.float32), 1600) * 0.02
    if kind in ("underwater", "deep"):   # muffled sea: a low swell, bubbles; whale song in the shallows, creaks in the deep
        out += lowpass_fast(nz(), 140 if kind == "underwater" else 70) * (0.10 if kind == "underwater" else 0.08) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.05 * t))
        k = 0.5
        while k < dur:   # bubble trains: short rising blips
            k += rng.uniform(0.8, 2.5) if kind == "underwater" else rng.uniform(2.5, 6.0)
            for j in range(int(rng.integers(2, 6))):
                m = int(0.06 * SR); tk = np.arange(m) / SR; f0 = rng.uniform(500, 1100)
                b = np.sin(2 * np.pi * np.cumsum(f0 + 2500 * tk) / SR) * np.exp(-tk * 50)
                add(out, (lowpass_fast(b.astype(np.float32), 2200) * 0.02).astype(np.float32), k + j * rng.uniform(0.05, 0.12))
        if kind == "underwater":
            k = 2.0
            while k < dur:   # humpback song: long, slow, sliding moans
                k += rng.uniform(5, 9); d = rng.uniform(1.6, 2.8); m = int(d * SR); tk = np.arange(m) / SR
                f = rng.uniform(180, 320) + rng.uniform(-120, 160) * np.sin(np.pi * tk / d) + 30 * np.sin(2 * np.pi * 3 * tk)
                moan = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tk / d) ** 1.5
                add(out, (lowpass_fast(moan.astype(np.float32), 900) * 0.035).astype(np.float32), k)
        else:
            out += (np.sin(2 * np.pi * 41 * t) * 0.02 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.04 * t))).astype(np.float32)
            k = 3.0
            while k < dur:   # the wreck groaning: a slow, low creak
                k += rng.uniform(7, 13); d = rng.uniform(0.8, 1.5); m = int(d * SR); tk = np.arange(m) / SR
                cr = np.sign(np.sin(2 * np.pi * np.cumsum(60 + 25 * np.sin(np.pi * tk / d)) / SR)) * np.sin(np.pi * tk / d) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * tk))
                add(out, (lowpass_fast(cr.astype(np.float32), 400) * 0.02).astype(np.float32), k)
    if kind == "meadow":   # an open bay at dawn: soft wind, distant surf, now and then a sheep
        out += (lowpass_fast(nz(), 700) - lowpass_fast(nz(), 200)) * 0.04 + lowpass_fast(nz(), 300) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.12 * t)) * 0.05
        k = 2.0
        while k < dur:
            k += rng.uniform(4, 9); d = 0.6; m = int(d * SR); tk = np.arange(m) / SR
            f = 340 + 40 * np.sin(np.pi * tk / d); baa = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * (0.6 + 0.4 * np.sin(2 * np.pi * 28 * tk)) * np.sin(np.pi * tk / d)
            add(out, (lowpass_fast(baa.astype(np.float32), 1800) * 0.015).astype(np.float32), k)
    if kind == "polar":   # the high plateau: wind gusting over packed snow
        gust = 0.5 + 0.5 * np.sin(2 * np.pi * 0.09 * t + rng.uniform(0, 6)) * np.sin(2 * np.pi * 0.023 * t)
        out += (lowpass_fast(nz(), 700) - lowpass_fast(nz(), 150)) * gust * 0.12
    f = int(0.8 * SR)
    if n > 2 * f:
        out[:f] *= np.linspace(0, 1, f); out[-f:] *= np.linspace(1, 0, f)
    return out.astype(np.float32)


# ---------------------------------------------------------------- mix
def write_wav(path: Path, x: np.ndarray, sr: int = SR) -> None:
    x = np.clip(x, -1, 1)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def resample(x: np.ndarray, sr_in: int, sr_out: int = SR) -> np.ndarray:
    if sr_in == sr_out:
        return x.astype(np.float32)
    n_out = int(round(len(x) * sr_out / sr_in))
    return np.interp(np.linspace(0, len(x) - 1, n_out), np.arange(len(x)), x).astype(np.float32)


def envelope_follower(x: np.ndarray, attack: float = 0.01, release: float = 0.35, sr: int = SR) -> np.ndarray:
    hop = 256
    frames = np.abs(x[: len(x) // hop * hop]).reshape(-1, hop).max(axis=1)
    out = np.zeros_like(frames); acc = 0.0
    ra, rr = math.exp(-hop / (attack * sr)), math.exp(-hop / (release * sr))
    for i, f in enumerate(frames):
        acc = f + (acc - f) * (ra if f > acc else rr); out[i] = acc
    e = np.repeat(out, hop)
    return np.pad(e, (0, len(x) - len(e)), mode="edge")


def mix(total: float, narration_clips: list[tuple[float, np.ndarray, int]], music: np.ndarray, sfx_events: list[tuple[float, str]],
        seed: int, music_db: float = -10.0, sfx_db: float = -9.0, duck_db: float = -7.0) -> np.ndarray:
    n = int(total * SR)
    nar = np.zeros(n, np.float32)
    for at, x, sr in narration_clips:
        add(nar, resample(x, sr), at)
    fx = np.zeros(n, np.float32)
    cache = {}
    for ev in sfx_events:
        at, name = ev[0], ev[1]; gain = ev[2] if len(ev) > 2 else 1.0
        if name not in cache:
            cache[name] = sfx(name, seed)
        add(fx, cache[name] * gain, at)
    mus = np.zeros(n, np.float32); add(mus, music, 0)
    # duck music under narration
    e = envelope_follower(nar)
    duck = 10 ** (duck_db / 20)
    gain = 1 - (1 - duck) * np.clip(e / 0.25, 0, 1)
    mus = mus * gain * 10 ** (music_db / 20)
    fx = fx * 10 ** (sfx_db / 20) * (0.6 + 0.4 * gain)
    out = nar * 0.95 + mus + fx
    # soft limiter
    out = np.tanh(out * 1.15) / np.tanh(1.15)
    peak = float(np.max(np.abs(out))) or 1.0
    out = out * min(1.0, 0.95 / peak)
    # subtle stereo: music slightly wide, narration centred
    left = out + 0.03 * mus; right = out - 0.03 * mus
    return np.stack([left, right], axis=1).astype(np.float32)
