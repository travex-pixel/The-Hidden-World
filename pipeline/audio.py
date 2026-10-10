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
        if cue.get("pulse"):   # heartbeat-like low pulse: lub-dub on beat 1
            for off, a in ((0.0, 0.22), (0.28, 0.14)):
                add(bass, tone(55, 0.35, "bass", a), t + off)
        inst = cue.get("inst", "pluck")
        # melody: seeded steps on the pentatonic scale, 8th-note grid, density-controlled
        for step in range(8 if inst != "none" else 0):
            if rng.random() < cue["density"] * (1.0 if step % 2 == 0 else 0.55):
                move = int(rng.integers(-2, 3))
                last_mel = int(np.clip(last_mel + move, 0, len(PENTA) * 2 - 1))
                semi = PENTA[last_mel % len(PENTA)] + 12 * (last_mel // len(PENTA)) + 12
                if cue["tense"] > 0.5 and semi % 12 == 4:
                    semi -= 1  # flatten the third in tense cues
                amp = 0.12 * (0.7 + 0.6 * cue["bright"]) * (1.0 if step % 4 == 0 else 0.75)
                if inst == "bell":
                    add(mel, tone(note(semi, root), beat * 2.2, "bell", amp * 0.55), t + step * beat / 2)
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
    raise KeyError(name)


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
