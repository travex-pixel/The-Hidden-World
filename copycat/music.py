"""Procedural dark-fantasy anime underscore (D minor family), numpy only.

    render_score(sections, total_s, seed) -> (n, 2) float32 stereo @ 48 kHz, RMS-normalised to ~ -26 dBFS

sections = [{"cue": "tension_pulse", "start": 0.0, "end": 41.2}, ...]  (contiguous; times in seconds).
Cues: tension_pulse, pastoral_melancholy, dark_mystery, rising_heroic, ominous_grand.
Layers: low saw/triangle drones, slow detuned pads (low-passed, slow attack), felt-piano/koto plucks on chord
tones, taiko/sub hits on bar lines, formant "choir" pad for the grand cue, long dark reverb.
Neighbouring cues are crossfaded (equal power, XFADE_S) around each section boundary.
"""
from __future__ import annotations
import math
import numpy as np
from scipy import signal as sg
from copycat import sfx as D
from copycat.sfx import SR

XFADE_S = 2.0
D_MIN = {"D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "Bb": 10, "C": 0, "C#": 1, "Eb": 3}
# semitones from C; MIDI helper
def midi(note: str, octave: int) -> int:
    return 12 * (octave + 1) + D_MIN[note]
def hz(m: float) -> float:
    return 440.0 * 2 ** ((m - 69) / 12)

CHORDS = {  # root-position triads/extended, as semitone offsets from root midi
    "Dm": ("D", [0, 7, 12, 15, 19]), "Bb": ("Bb", [0, 7, 12, 14, 19]), "Gm": ("G", [0, 7, 12, 15, 19]),
    "A": ("A", [0, 7, 12, 16, 19]), "F": ("F", [0, 7, 12, 16, 19]), "C": ("C", [0, 7, 12, 16, 19]),
    "Am": ("A", [0, 7, 12, 15, 19]), "Dm9": ("D", [0, 7, 12, 14, 17]), "Eb": ("Eb", [0, 7, 12, 16, 19]),
}

CUES = {
    "tension_pulse":       {"bpm": 84, "prog": [("Dm", 2), ("Dm", 2), ("Bb", 2), ("A", 2)], "oct": 2, "drone": 1.0, "pad": 0.45, "pluck": 0.25, "pluck_pat": "sparse", "hit": ("sub", [0], 0.9), "choir": 0.0, "bright": 900, "ramp": 0.0},
    "pastoral_melancholy": {"bpm": 66, "prog": [("Dm", 2), ("Bb", 2), ("F", 2), ("C", 2)], "oct": 2, "drone": 0.35, "pad": 0.75, "pluck": 0.8, "pluck_pat": "arp", "hit": None, "choir": 0.0, "bright": 2200, "ramp": 0.0},
    "dark_mystery":        {"bpm": 58, "prog": [("Dm", 2), ("Eb", 1), ("Dm9", 1), ("Gm", 2), ("A", 2)], "oct": 1, "drone": 1.0, "pad": 0.5, "pluck": 0.55, "pluck_pat": "koto", "hit": ("sub", [0], 0.5), "choir": 0.0, "bright": 1100, "ramp": 0.0},
    "rising_heroic":       {"bpm": 96, "prog": [("Bb", 2), ("F", 2), ("Gm", 2), ("Dm", 2)], "oct": 2, "drone": 0.5, "pad": 0.9, "pluck": 0.55, "pluck_pat": "arp8", "hit": ("taiko", [0, 2], 0.8), "choir": 0.35, "bright": 2600, "ramp": 0.55},
    "ominous_grand":       {"bpm": 54, "prog": [("Dm", 2), ("Bb", 2), ("Gm", 2), ("A", 2)], "oct": 1, "drone": 1.0, "pad": 0.8, "pluck": 0.2, "pluck_pat": "sparse", "hit": ("taiko", [0], 1.0), "choir": 1.0, "bright": 1800, "ramp": 0.25},
}
ALIASES = {"tense": "tension_pulse", "mystery": "dark_mystery", "heroic": "rising_heroic", "grand": "ominous_grand", "pastoral": "pastoral_melancholy"}


def _saw(f: float, n: int, phase0: float = 0.0) -> np.ndarray:
    ph = (phase0 + f * np.arange(n) / SR) % 1.0
    return (2 * ph - 1).astype(np.float32)


def _tri(f: float, n: int, phase0: float = 0.0) -> np.ndarray:
    ph = (phase0 + f * np.arange(n) / SR) % 1.0
    return (4 * np.abs(ph - 0.5) - 1).astype(np.float32)


def _adsr(n: int, a: float, r: float) -> np.ndarray:
    e = np.ones(n, np.float32)
    na, nr = min(int(a * SR), n), min(int(r * SR), n)
    if na: e[:na] = np.sin(np.linspace(0, np.pi / 2, na)) ** 2
    if nr: e[n - nr:] *= np.cos(np.linspace(0, np.pi / 2, nr)) ** 2
    return e


def _drone(m: float, dur: float, rng) -> np.ndarray:
    n = int(dur * SR)
    y = np.zeros((n, 2), np.float32)
    for k, cents in enumerate((-9, 0, 8)):
        f = hz(m) * 2 ** (cents / 1200)
        s = _saw(f, n, rng.random()) * 0.5 + _tri(f * 2, n, rng.random()) * 0.15
        pan_l = 0.5 + (k - 1) * 0.3
        y[:, 0] += s * (1 - pan_l); y[:, 1] += s * pan_l
    sub = np.sin(2 * np.pi * hz(m - 12) * np.arange(n) / SR).astype(np.float32) * 0.6
    y += sub[:, None]
    y = D.lp(y, 320 + 120 * rng.random(), 2)
    # slow breathing
    t = np.arange(n) / SR
    y *= (0.8 + 0.2 * np.sin(2 * np.pi * (0.07 + 0.04 * rng.random()) * t + rng.random() * 6.28))[:, None].astype(np.float32)
    return y * _adsr(n, 3.0, 3.0)[:, None]


def _pad(ms: list[int], dur: float, cutoff: float, rng, vib: bool = False) -> np.ndarray:
    n = int(dur * SR)
    y = np.zeros((n, 2), np.float32)
    for i, m in enumerate(ms):
        for side, cents in ((0, -11), (1, 11), (0, 4), (1, -4)):
            f = hz(m) * 2 ** (cents / 1200)
            s = _saw(f, n, rng.random()) * 0.22 + _tri(f, n, rng.random()) * 0.22
            y[:, side] += s * (0.85 if i else 1.0)
    # moving low-pass: blend a dark and a brighter version with a slow LFO
    dark = D.lp(y, cutoff * 0.55, 2); light = D.lp(y, cutoff, 2)
    t = np.arange(n) / SR
    lfo = (0.5 + 0.5 * np.sin(2 * np.pi * 0.09 * t + rng.random() * 6.28))[:, None].astype(np.float32)
    y = dark * (1 - lfo) + light * lfo
    return y * _adsr(n, 1.4, 1.8)[:, None] * 0.5


def _choir(ms: list[int], dur: float, rng, vowel_a: bool = True) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    formants = [(800, 1150, 2900), (450, 800, 2830)][0 if vowel_a else 1]
    y = np.zeros((n, 2), np.float32)
    for i, m in enumerate(ms):
        for side, cents in ((0, -14), (1, 14), (0, 6), (1, -6)):
            vib = 1 + 0.0035 * np.sin(2 * np.pi * (4.6 + 0.4 * rng.random()) * t + rng.random() * 6)
            f = hz(m) * 2 ** (cents / 1200)
            ph = np.cumsum(f * vib) / SR
            s = ((2 * (ph % 1.0) - 1) * 0.5).astype(np.float32)
            y[:, side] += s * 0.25
    out = np.zeros_like(y)
    for fc, g in zip(formants, (1.0, 0.55, 0.2)):
        out += D.bp(y, fc * 0.92, fc * 1.08, 2) * g * 6
    out = D.lp(out, 4200)
    return out * _adsr(n, 2.4, 2.4)[:, None] * 0.55


def _pluck(m: float, vel: float, rng, koto: bool = False, dur: float = 2.8) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = hz(m)
    y = np.zeros(n, np.float32)
    for h in range(1, 9):
        amp = (1.0 / h ** (1.3 if not koto else 1.0)) * (1 if h % 2 or not koto else 0.7)
        det = 1 + 0.0004 * h * h
        decay = (1.6 if not koto else 1.0) / (0.6 + 0.4 * h)
        y += (amp * np.sin(2 * np.pi * f * h * det * t) * np.exp(-t / decay)).astype(np.float32)
    if koto:  # pitch-bend into the note, bright pick
        bend = np.exp(-t / 0.03) * 0.006
        y = np.sin(2 * np.pi * f * np.cumsum(1 + bend) / SR).astype(np.float32) * np.exp(-t / 1.0) * 0.9 + y * 0.3
    click = D.hp(rng.standard_normal(int(0.012 * SR)).astype(np.float32), 1500) * 0.15
    y[: len(click)] += click * np.exp(-np.arange(len(click)) / (0.003 * SR)).astype(np.float32)
    y = D.lp(y, 3200 if not koto else 4800, 2)
    y[:96] *= np.linspace(0, 1, 96)
    y *= vel / (np.max(np.abs(y)) + 1e-9)
    return D.haas(y, rng.uniform(4, 13)) if rng.random() < 0.5 else D.pan(y, rng.uniform(-0.6, 0.6))


def _hit(kind: str, vel: float, rng) -> np.ndarray:
    dur = 1.6 if kind == "taiko" else 1.1
    n = int(dur * SR); t = np.arange(n) / SR
    f = (48 + 50 * np.exp(-t / 0.05)) if kind == "taiko" else (38 + 45 * np.exp(-t / 0.04))
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * np.exp(-t / (0.45 if kind == "taiko" else 0.3))
    skin = D.bp(rng.standard_normal(n).astype(np.float32), 120, 900) * np.exp(-t / 0.06) * (0.5 if kind == "taiko" else 0.2)
    y = (y + skin).astype(np.float32)
    y[:48] *= np.linspace(0, 1, 48)
    y *= vel / (np.max(np.abs(y)) + 1e-9)
    return D.to_stereo(y)


def _place(buf: np.ndarray, x: np.ndarray, at: float):
    s = int(round(at * SR))
    if s >= len(buf): return
    seg = x[: len(buf) - s]
    buf[s:s + len(seg)] += seg[: len(buf) - s]


def render_cue(cue: str, dur: float, seed: int = 0) -> np.ndarray:
    """Dry+reverb stereo bed of exactly `dur` seconds for one cue."""
    cue = ALIASES.get(cue, cue)
    if cue not in CUES:
        cue = "dark_mystery"
    c = CUES[cue]
    rng = np.random.default_rng(seed * 101 + sum(map(ord, cue)))
    n = int(dur * SR)
    tail = int(3.5 * SR)
    dry = np.zeros((n + tail, 2), np.float32)       # reverb-free low end (drones, subs)
    send = np.zeros((n + tail, 2), np.float32)      # goes through reverb
    spb = 60.0 / c["bpm"]; bar = 4 * spb
    # chord timeline (loop the progression)
    t = 0.0; idx = 0; chord_times = []
    while t < dur:
        name, bars = c["prog"][idx % len(c["prog"])]
        chord_times.append((t, name, bars * bar)); t += bars * bar; idx += 1
    base_oct = c["oct"]
    for (t0, name, cdur) in chord_times:
        root, offs = CHORDS[name]
        rm = midi(root, base_oct)
        seg = min(cdur + 1.6, dur - t0 + 2.5)
        if c["drone"] > 0:
            _place(dry, _drone(rm, seg, rng) * (0.22 * c["drone"]), t0)
        if c["pad"] > 0:
            pm = [rm + 12 + o for o in offs[:4]]
            _place(send, _pad(pm, seg, c["bright"], rng) * (0.34 * c["pad"]), t0)
        if c["choir"] > 0:
            cm = [rm + 12 + offs[0], rm + 12 + offs[1], rm + 24 + offs[2] - 12 + 12]
            _place(send, _choir(cm, seg, rng, vowel_a=(rng.random() < 0.6)) * (0.30 * c["choir"]), t0)
        # plucks on chord tones
        pat = c["pluck_pat"]
        tones = [rm + 24 + o for o in (offs[0], offs[2], offs[3], offs[1], offs[4])]  # chord tones, upper register
        if c["pluck"] > 0:
            koto = pat == "koto"
            if pat in ("arp", "arp8"):
                step = spb * (0.5 if pat == "arp8" else 1.0)
                k, tt = 0, t0 + step
                order = [0, 2, 1, 3, 2, 4, 3, 1]
                while tt < t0 + cdur - 0.1:
                    v = 0.18 * c["pluck"] * (0.7 + 0.3 * rng.random())
                    _place(send, _pluck(tones[order[k % len(order)]], v, rng, koto), tt)
                    k += 1; tt += step
            else:
                # sparse: 2-3 plucked tones per chord at irregular beats, rests between
                cnt = 2 if pat == "sparse" else 3
                for _ in range(cnt):
                    tt = t0 + spb * rng.choice([1.0, 1.5, 2.0, 3.0, 4.5, 5.0, 6.0, 7.0]) * (1 + (cdur > 4 * bar) * 0.5)
                    if tt < t0 + cdur - 0.3:
                        _place(send, _pluck(tones[int(rng.integers(len(tones)))], 0.16 * c["pluck"], rng, koto), tt)
        # bar-line hits
        if c["hit"]:
            kind, beats, vel = c["hit"]
            nb = int(round(cdur / bar))
            for b in range(nb):
                for bt in beats:
                    at = t0 + b * bar + bt * spb
                    if at < dur + 0.5:
                        dd = 0.34 * vel * (0.55 if (kind == "taiko" and b % 2) else 1.0)
                        _place(dry, _hit(kind, dd, rng), at)
                if kind == "sub":   # tension: ghost pulse on beat 3
                    at = t0 + b * bar + 2.5 * spb
                    if at < dur + 0.5: _place(dry, _hit("sub", 0.14 * vel, rng), at)
    wet = D.add_reverb(send, decay_s=4.0, wet_db=-5, dry_db=-2, predelay_ms=25, damp_hz=4200, seed=seed + 3, send_hp=120, dark=1.0)
    bed = wet[: n + tail].copy()
    bed[: len(dry)] += dry
    bed = bed[: n + tail]
    if c["ramp"]:
        r = np.linspace(1 - c["ramp"] * 0.5, 1 + c["ramp"] * 0.25, len(bed))[:, None].astype(np.float32)
        bed *= r
    bed = D.hp(bed, 28)
    # stereo width: gentle mid/side boost
    m, s = (bed[:, 0] + bed[:, 1]) / 2, (bed[:, 0] - bed[:, 1]) / 2
    bed = np.stack([m + s * 1.25, m - s * 1.25], axis=1)
    return bed.astype(np.float32)            # includes `tail` extra samples for the crossfade/ending


def render_score(sections: list[dict], total: float, seed: int = 0, xfade: float = XFADE_S, target_rms_db: float = -26.0) -> np.ndarray:
    """Continuous score for [0,total]. Same-cue neighbours are merged (no crossfade); different cues crossfade."""
    merged: list[dict] = []
    for s in sections:
        cue = ALIASES.get(s.get("cue"), s.get("cue")) or "dark_mystery"
        if merged and merged[-1]["cue"] == cue:
            merged[-1]["end"] = s["end"]
        else:
            merged.append({"cue": cue, "start": s["start"], "end": s["end"]})
    if not merged:
        merged = [{"cue": "dark_mystery", "start": 0.0, "end": total}]
    merged[0]["start"] = 0.0; merged[-1]["end"] = total
    out = np.zeros((int(total * SR) + 1, 2), np.float32)
    for i, s in enumerate(merged):
        h = xfade / 2
        a = 0.0 if i == 0 else s["start"] - h
        b = total if i == len(merged) - 1 else s["end"] + h
        dur = b - a
        bed = render_cue(s["cue"], dur, seed + i)
        # normalise each cue to the same loudness so cues sit consistently
        rms = math.sqrt(float((bed[: int(dur * SR)] ** 2).mean())) + 1e-9
        bed *= D.db(target_rms_db) / rms
        env = np.ones(len(bed), np.float32)
        nin = int(xfade * SR) if i > 0 else int(1.2 * SR)
        env[:nin] = np.sin(np.linspace(0, np.pi / 2, nin)) ** 1 if i > 0 else np.sin(np.linspace(0, np.pi / 2, nin)) ** 2
        if i < len(merged) - 1:
            nout = int(xfade * SR); keep = int(dur * SR)
            env[keep - nout:keep] = np.cos(np.linspace(0, np.pi / 2, nout))
            env[keep:] = 0
            # let the reverb tail of the previous cue ring a little under the crossfade
            tailn = len(bed) - keep
            if tailn > 0:
                env[keep:] = np.cos(np.linspace(np.pi / 2, np.pi / 2, tailn)) * 0
        else:
            end_n = int(min(2.4, dur) * SR)
            env[int(dur * SR) - end_n:int(dur * SR)] *= np.cos(np.linspace(0, np.pi / 2, end_n)) ** 2
            env[int(dur * SR):] = 0
        s0 = int(round(a * SR))
        seg = bed * env[:, None]
        e0 = min(len(out), s0 + len(seg))
        out[s0:e0] += seg[: e0 - s0]
    return out


if __name__ == "__main__":
    import sys, time, soundfile as sf
    t = time.time()
    secs = []; cur = 0.0
    for cue in CUES:
        secs.append({"cue": cue, "start": cur, "end": cur + 16.0}); cur += 16.0
    x = render_score(secs, cur, 1)
    print(f"{cur}s rendered in {time.time()-t:.1f}s peak={np.abs(x).max():.2f} rms={20*np.log10(np.sqrt((x**2).mean())):.1f}")
    if len(sys.argv) > 1: sf.write(sys.argv[1], x, SR)
