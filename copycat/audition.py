"""Casting audition for the Naruto What-If audio drama.

    FISH_API_KEY=proxy-injected python -m copycat.cast_director --franchise naruto [--top 10] [--refresh]
    python -m copycat.cast_director --franchise naruto --pick NARUTO=B KAKASHI=A      # pin after listening

Pipeline: harvest the Fish model list (cast_director.harvest_pool) -> eligibility filter (original archetype voices only)
-> per-role text shortlist -> synthesize the SAME two audition lines per candidate (cached) -> measure every clip
(F0, pace, brightness, rasp proxy, expressiveness, artefacts) -> transparent weighted distance to the role profile ->
tune the top 3 (Fish speed/temperature/cue variants + a subtle ffmpeg post-FX nudge, re-measured) -> cast-separation
assignment -> config/naruto-cast.json + audition reel (build/copycat/naruto-auditions/reel/) + ensemble scene.

Metadata (tags/descriptions) only builds the shortlist; the measurements and the owner's ears decide.
"""
from __future__ import annotations
import json, math, random, re, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import numpy as np
from scipy import signal as sg

from copycat import fish_audio as FA

ROOT = Path(__file__).resolve().parent.parent
BUILD = ROOT / "build" / "copycat" / "naruto-auditions"
API_DIR = BUILD / "api"
REEL_DIR = BUILD / "reel"
MEASURE_FILE = BUILD / "measurements.json"
BC_NARRATOR_ID = "e686ae649ee44f219a108aacba206c1a"        # Black Clover narrator ("calm storyteller male"): continuity candidate
MAIN_ROLES = ["NARUTO", "IRUKA", "MIZUKI", "HIRUZEN", "KAKASHI", "SASUKE", "SAKURA", "KURAMA", "NARRATOR"]
LIGHT_ROLES = ["DANZO", "TAZUNA", "ZABUZA", "HAKU", "INARI", "GATO", "KABUTO", "IBIKI", "ANKO", "OROCHIMARU", "GAARA", "JIRAIYA", "DEFAULT"]
LETTERS = "ABC"
F_SR = 16000          # analysis rate for pitch
M_SR = 24000          # analysis rate for brightness

# ----------------------------------------------------------------------------- role profiles
# f0: median-F0 band (Hz); wpm: words/min band of the audition text; rasp/bright/expr: wanted percentile band (0-100) of
# that metric across ALL auditioned clips (so the targets self-calibrate to what the synthesizer actually produces);
# g: gender prior used only as a weak tie-break (+penalty when the listing's own tag contradicts it).
# kw: shortlist keywords {regex: weight} matched on title+description+tags; no: negative keywords.
P = dict
ROLES: dict[str, dict] = {
    "NARUTO": P(f0=(210, 270), wpm=(175, 240), rasp=(65, 100), bright=(55, 100), expr=(60, 100), g="m", speed=1.08, temp=0.75,
                look="boyish, bright, raspy, loud, fast, cocky-but-warm",
                kw={r"raspy|rasp|scratchy|hoarse|husky": 5, r"energetic|excited|loud|shout|spirited|lively|hyper": 3, r"boy|teen|youth|young|kid": 3,
                    r"male|man": 1, r"cocky|confident|bold|brash|cheerful|anime|cartoon": 2, r"character": 1},
                no={r"female|woman|girl|baby|toddler|calm|sleep|whisper|elder|old man|narrat": 4, r"asmr": 4},
                line1="[shouting] Ow — wait. I didn't fall. [excited] ...I can be in two classes at once. I can be in ALL of them!",
                line2="[shouting] Filing?! I'm a ninja now! [indignant] You can't make a ninja do paperwork, old man!"),
    "IRUKA": P(f0=(125, 160), wpm=(135, 180), rasp=(0, 55), bright=(30, 75), expr=(35, 75), g="m", speed=1.0, temp=0.65,
               look="warm, earnest young-adult tenor, teacherly",
               kw={r"warm|kind|friendly|gentle|earnest|sincere|caring|teacher|soft": 4, r"young|adult|tenor|male|man": 2, r"conversational|clear|natural": 2, r"narrat": 1},
               no={r"female|woman|girl|child|kid|old man|elder|raspy|villain|demon|growl|deep growl|baby": 4},
               line1="[firm, protective] He's not the demon fox. [warmly] He's Naruto Uzumaki, of the Hidden Leaf.",
               line2="[softly, warm] Naruto. Close your eyes for a second. [gently smiling] ...Congratulations. You graduate."),
    "MIZUKI": P(f0=(130, 170), wpm=(140, 190), rasp=(0, 40), bright=(45, 90), expr=(30, 80), g="m", speed=1.0, temp=0.65,
                look="smooth tenor that can sneer; lighter than Iruka, cold",
                kw={r"smooth|silky|sly|cold|sneer|smug|arrogant|sarcastic|cunning|calculating|villain": 4, r"young|tenor|male|man|adult": 2, r"clear|bright|light": 2},
                no={r"female|woman|girl|child|kid|old man|elder|growl|deep|baby|warm grandfather": 4},
                line1="[cold, mocking] Nobody ever told you, did they? [sneering] Twelve years ago, the fox was sealed inside you.",
                line2="[coldly, impatient] Hand over the scroll, Naruto."),
    "HIRUZEN": P(f0=(95, 125), wpm=(100, 140), rasp=(60, 100), bright=(0, 45), expr=(0, 55), g="m", speed=0.92, temp=0.65,
                 look="elderly, gentle, gravelly, unhurried, a dry twinkle",
                 kw={r"old|elder|elderly|aged|grandfather|grandpa|senior|wise|ancient": 5, r"gravel|raspy|rough|husky|weathered": 4, r"gentle|warm|calm|kind|slow|wise|soft": 3, r"male|man": 1},
                 no={r"female|woman|girl|child|kid|boy|teen|young|energetic|shout|baby": 5},
                 line1="[stern, calm] Stealing the Scroll of Seals is a crime, Naruto. [dryly] The sentence is one month of filing duty.",
                 line2="[dry, amused] Then file like one."),
    "KAKASHI": P(f0=(105, 135), wpm=(120, 165), rasp=(0, 60), bright=(25, 70), expr=(0, 40), g="m", speed=0.96, temp=0.6,
                 look="relaxed, dry, slightly bored light baritone; lazy, never shouty",
                 kw={r"relaxed|lazy|bored|tired|sleepy|dry|deadpan|casual|laid.?back|chill|calm|cool|monoton": 5, r"baritone|male|man|adult|young": 2, r"conversational|natural|smooth": 2},
                 no={r"female|woman|girl|child|kid|boy|energetic|shout|excited|loud|old man|elder|growl|villain": 4},
                 line1="[lazily, bored] Hm. My first impression of you three? [flatly] ...I don't like you.",
                 line2="[dry, curious] Who taught you that?"),
    "SASUKE": P(f0=(140, 185), wpm=(130, 170), rasp=(0, 55), bright=(30, 80), expr=(0, 35), g="m", speed=0.97, temp=0.6,
                look="cool, clipped, quiet, low-for-his-age teen; flat affect",
                kw={r"cool|cold|stoic|serious|flat|monoton|deadpan|quiet|clipped|reserved|aloof|emotionless": 5, r"teen|young|youth|boy": 3, r"male|man": 1, r"anime": 1},
                no={r"female|woman|girl|child|toddler|baby|old man|elder|energetic|cheerful|excited|loud|growl": 4},
                line1="[cold, flat] You expect me to believe the dead last?",
                line2="[quietly, curt] ...Fine. Once. [flat] Don't slow me down."),
    "SAKURA": P(f0=(230, 290), wpm=(150, 205), rasp=(0, 40), bright=(60, 100), expr=(45, 100), g="f", speed=1.04, temp=0.7,
                look="bright, clear teen girl; can be sharp",
                kw={r"female|girl|woman|teen": 4, r"bright|clear|sharp|crisp|young|youth|high": 3, r"energetic|confident|expressive|sassy|spunky|lively": 2, r"anime": 1},
                no={r"\bmale\b|man\b|boy|old|elder|deep|raspy|growl|baby|child|toddler|whisper|asmr": 4},
                line1="[exasperated] Naruto, that's the dumbest plan I've ever — [surprised] wait. He's actually right?",
                line2="[flustered] Sasuke, I'm with you. [quickly] I mean — with the team."),
    "KURAMA": P(f0=(65, 95), f0_fx=(55, 85), wpm=(90, 135), rasp=(60, 100), bright=(0, 30), expr=(15, 70), g="m", speed=0.88, temp=0.7,
                look="very deep, slow, cavernous growl, contemptuous",
                kw={r"deep|bass|low|growl|demon|monster|beast|devil|dark|cavern|villain|evil|giant": 5, r"slow|menac|sinister|contempt|rough|raspy|gravel": 3, r"male|man|old": 1},
                no={r"female|woman|girl|child|kid|boy|young|cheerful|bright|energetic|baby|teen": 4},
                line1="[slow, contemptuous growl] A thousand of you, brat. And every one carries a piece of me. [mocking] Did you think I wasn't reading too?",
                line2="[low, slow] Her name was Kushina. I should know. [dark] I lived in her before I lived in you."),
    "NARRATOR": P(f0=(100, 135), wpm=(150, 180), rasp=(0, 45), bright=(35, 70), expr=(35, 80), g="m", speed=1.0, temp=0.62,
                  look="confident cinematic storyteller, clear diction ~165 wpm, neutral-warm adult male",
                  kw={r"narrat|storytell|documentary|audiobook|cinematic|trailer|story": 4, r"warm|confident|clear|professional|smooth|authoritative|engaging": 3, r"male|man|adult|middle": 2, r"calm|measured": 1},
                  no={r"female|woman|girl|child|kid|boy|teen|baby|raspy|growl|demon|asmr|whisper": 4},
                  line1="Six days after graduating dead last, Naruto Uzumaki is sitting in the Hokage's archive with two hundred copies of himself.",
                  line2="He doesn't get stronger. He gets to read first."),
}
LIGHT = {  # one line, 4 candidates; f0 only (+ gender prior)
    "DANZO": P(f0=(95, 125), wpm=(100, 150), g="m", kw={r"old|elder|cold|dry|stern|cruel|villain|gravel|slow": 4, r"male|man": 1}, no={r"female|girl|child|boy|young|cheer": 4},
               line="[cold, dry] The village comes first. Always. Even before the Hokage."),
    "TAZUNA": P(f0=(100, 140), wpm=(130, 180), g="m", kw={r"gruff|old|grumpy|drunk|rough|raspy|gravel|grandpa": 4, r"male|man": 1}, no={r"female|girl|child|boy|young|asmr": 4},
                line="[gruff, tipsy] Hic — the bridge isn't going to build itself, kid. Hand me that bottle."),
    "ZABUZA": P(f0=(75, 105), wpm=(110, 150), g="m", kw={r"deep|menac|villain|growl|dark|bass|muffled|killer|assassin|demon": 4, r"male|man": 1}, no={r"female|girl|child|boy|young|cheer|asmr": 4},
                line="[low, menacing] Heh. Kids playing at ninja. Step aside, or I'll cut you in two."),
    "HAKU": P(f0=(190, 260), wpm=(130, 175), g="f", kw={r"soft|gentle|androgyn|kind|calm|young|teen|quiet|boy|girl": 4, r"neutral": 2}, no={r"deep|growl|old|raspy|loud|aggressive": 4},
              line="[softly, gentle] Please, don't struggle. [sadly] I don't want to hurt you."),
    "INARI": P(f0=(240, 330), wpm=(150, 210), g="m", kw={r"child|kid|little|small|boy|young|toddler": 5, r"male|boy": 2}, no={r"female|girl|old|deep|raspy|elder|man\b": 4},
               line="[crying, shouting] Heroes don't exist! Mom is just going to cry again!"),
    "GATO": P(f0=(110, 160), wpm=(130, 180), g="m", kw={r"nasal|greedy|villain|sleazy|arrogant|smug|sneer|boss|rich|whiny": 4, r"male|man|middle": 1}, no={r"female|girl|child|boy|young|asmr": 4},
              line="[nasal, arrogant] Hmph! Money buys everything, even ninja. Kill them all!"),
    "KABUTO": P(f0=(115, 155), wpm=(130, 175), g="m", kw={r"polite|soft|smooth|gentle|sinister|quiet|calm|intellectual|young|sly": 4, r"male|man": 1}, no={r"female|girl|child|boy|growl|loud|old|asmr": 4},
                line="[polite, soft, quietly sinister] Oh, you're early. That's alright. I'll be sure to remember your name."),
    "IBIKI": P(f0=(80, 115), wpm=(110, 150), g="m", kw={r"hard|deep|stern|cold|authoritative|menac|growl|interrogat|serious|bass|gruff": 4, r"male|man": 1}, no={r"female|girl|child|boy|young|cheer|asmr": 4},
               line="[hard, low] Talk. Or I'll find out which part of you wants to talk first."),
    "ANKO": P(f0=(190, 250), wpm=(170, 230), g="f", kw={r"brash|energetic|sassy|confident|aggressive|loud|bold|young|female|woman": 4}, no={r"\bmale\b|man\b|old|deep|whisper|asmr|child|baby": 4},
              line="[loud, brash] Alright, maggots! Listen up, because I'm not repeating myself!"),
    "OROCHIMARU": P(f0=(130, 180), wpm=(100, 150), g="m", kw={r"silky|hiss|sinister|creepy|slimy|seduct|smooth|villain|snake|sly|whisper": 4, r"male|man": 1}, no={r"female|girl|child|boy|cheer|loud|asmr": 4},
                    line="[silky, hissing] Kukuku... such lovely eyes. [softly] I do so want to see them up close."),
    "GAARA": P(f0=(95, 140), wpm=(100, 150), g="m", kw={r"flat|deadpan|monoton|calm|cold|quiet|emotionless|stoic|dark|low": 4, r"boy|young|teen": 3, r"male": 1}, no={r"female|girl|child|cheer|energetic|loud|asmr": 4},
              line="[flat, dead calm] I fight only for myself. Don't speak to me again."),
    "JIRAIYA": P(f0=(95, 135), wpm=(155, 205), g="m", kw={r"boisterous|big|jolly|loud|hearty|energetic|bold|confident|middle|deep|laugh": 4, r"male|man": 1}, no={r"female|girl|child|boy|whisper|asmr": 4},
                 line="[booming, laughing] Ha! The great Toad Sage is here! Now where are the pretty girls?"),
    "DEFAULT": P(f0=(100, 160), wpm=(140, 180), g="m", kw={r"narrat|clear|calm|neutral|conversational|professional": 3}, no={r"asmr|child|growl": 4},
                 line="The leaves kept falling, and for a long while no one in the village noticed the quiet."),
}
for _r, _p in LIGHT.items():
    _p.update(speed=1.0, temp=0.7, look=_p.get("look", ""), rasp=None, bright=None, expr=None, light=True)

# role -> subtle post-FX presets tried during tuning (free: ffmpeg only). {pitch} -> rubberband nudge is added separately.
FX_PRESETS = {
    "NARUTO": "volume=4dB,asoftclip=type=tanh,volume=-3.5dB,equalizer=f=3200:t=q:w=1.2:g=2",                  # a touch of drive = rasp + bite
    "HIRUZEN": "lowpass=f=6500,equalizer=f=220:t=q:w=1.0:g=2,equalizer=f=3500:t=q:w=1.5:g=-2",                 # age: dark top end, chesty low-mid
    "KURAMA": "bass=g=6:f=110:w=0.7,volume=3dB,asoftclip=type=tanh,aecho=0.8:0.7:45|90:0.28|0.16,lowpass=f=4800",   # shelf + saturation + short dark echo
    "ZABUZA": "lowpass=f=4200,equalizer=f=160:t=q:w=1.0:g=2",                                                    # muffled (mask)
    "MIZUKI": "equalizer=f=4500:t=q:w=1.2:g=1.5",
}
KURAMA_PITCH = 2 ** (-2.0 / 12)       # slight pitch-down, part of the stored post-FX chain
SCENE_PAN = {"NARRATOR": 0.0, "NARUTO": -0.18, "HIRUZEN": 0.22, "KAKASHI": 0.15, "SASUKE": 0.25, "SAKURA": -0.3, "KURAMA": 0.0, "CLONE": -0.1}

SCENE = [
    ("HIRUZEN", "[stern, calm] Stealing the Scroll of Seals is a crime, Naruto. [dryly] The sentence is one month of filing duty."),
    ("NARUTO", "[shouting] Filing?! I'm a ninja now! [indignant] You can't make a ninja do paperwork, old man!"),
    ("HIRUZEN", "[dry, amused] Then file like one."),
    ("NARRATOR", "Training ground seven. Three genin, one late teacher, two bells."),
    ("KAKASHI", "[lazily, bored] Hm. My first impression of you three? [flatly] ...I don't like you."),
    ("NARUTO", "[whispering, excited] Listen. It's a teamwork test. Two bells, three of us. He wants us to cooperate!"),
    ("SASUKE", "[cold, flat] You expect me to believe the dead last?"),
    ("SAKURA", "[exasperated] That's the dumbest plan I've ever — [surprised] wait. He's actually right?"),
    ("KAKASHI", "[dry, curious] Who taught you that?"),
    ("NARUTO", "[grinning, proud] A lot of me."),
    ("NARRATOR", "He doesn't get stronger. He gets to read first."),
    ("KURAMA", "[slow, contemptuous growl] A thousand of you, brat. And every one carries a piece of me."),
    ("KURAMA", "[low, slow] Her name was Kushina. I should know. [dark] I lived in her before I lived in you."),
]


# ----------------------------------------------------------------------------- measurement

def syllables(text: str) -> int:
    n = 0
    for w in re.findall(r"[a-z']+", FA.strip_cues(text).lower()):
        g = len(re.findall(r"[aeiouy]+", w))
        if w.endswith("e") and g > 1 and not w.endswith(("le", "ee")):
            g -= 1
        n += max(g, 1)
    return n


def n_words(text: str) -> int:
    return len(re.findall(r"[A-Za-z0-9']+", FA.strip_cues(text)))


def resample(x: np.ndarray, sr_from: int, sr_to: int) -> np.ndarray:
    if sr_from == sr_to:
        return x
    g = math.gcd(sr_from, sr_to)
    return sg.resample_poly(x, sr_to // g, sr_from // g).astype(np.float32)


def _frames(x: np.ndarray, n: int, h: int) -> np.ndarray:
    if len(x) < n:
        x = np.pad(x, (0, n - len(x)))
    k = 1 + (len(x) - n) // h
    return np.lib.stride_tricks.as_strided(x, (k, n), (x.strides[0] * h, x.strides[0]), writeable=False)


def f0_track(x: np.ndarray, sr: int = F_SR, fmin: float = 60.0, fmax: float = 450.0, frame_s: float = 0.048, hop_s: float = 0.010,
             vthresh: float = 0.45) -> dict:
    """Normalised-autocorrelation pitch tracker. Returns per-frame arrays: f0 (nan = unvoiced), r (peak periodicity), rms."""
    n, h = int(frame_s * sr), int(hop_s * sr)
    fr = _frames(x.astype(np.float64), n, h)
    w = np.hanning(n)
    xw = fr * w
    nfft = 1 << (2 * n - 1).bit_length()
    ac = np.fft.irfft(np.abs(np.fft.rfft(xw, nfft, axis=1)) ** 2, axis=1)[:, : int(sr / fmin) + 2]
    aw = np.fft.irfft(np.abs(np.fft.rfft(w, nfft)) ** 2)[: ac.shape[1]]
    r = (ac / (aw + 1e-12)) / (ac[:, :1] / (aw[0] + 1e-12) + 1e-12)           # unbiased normalised autocorrelation
    rms = np.sqrt((fr ** 2).mean(axis=1))
    lo, hi = int(sr / fmax), int(sr / fmin)
    f0 = np.full(len(fr), np.nan)
    rp = np.zeros(len(fr))
    gate = max(np.percentile(rms, 95) * 0.06, 1e-4)
    for i in range(len(fr)):
        if rms[i] < gate:
            continue
        seg = r[i, lo - 1: hi + 2]
        pk = np.where((seg[1:-1] > seg[:-2]) & (seg[1:-1] >= seg[2:]))[0] + 1
        if not len(pk):
            continue
        best = seg[pk].max()
        if best < vthresh:
            continue
        lag = pk[np.argmax(seg[pk] >= 0.9 * best)]            # shortest strong peak: avoids sub-harmonic (octave-down) errors
        y0, y1, y2 = seg[lag - 1], seg[lag], seg[lag + 1]
        d = y0 - 2 * y1 + y2
        off = 0.5 * (y0 - y2) / d if abs(d) > 1e-12 else 0.0
        f0[i] = sr / (lo - 1 + lag + off)
        rp[i] = min(max(seg[lag], 0.0), 0.999)
    # octave-jump / outlier cleanup against a running median
    ok = ~np.isnan(f0)
    if ok.sum() > 6:
        med = np.where(ok, f0, np.nan)
        sm = np.array([np.nanmedian(med[max(0, i - 5): i + 6]) if ok[max(0, i - 5): i + 6].any() else np.nan for i in range(len(f0))])
        bad = ok & (np.abs(f0 / sm - 1) > 0.28)
        f0[bad] = np.nan
        rp[bad] = 0
    return {"f0": f0, "r": rp, "rms": rms, "hop": hop_s}


def analyze(x24: np.ndarray, text: str) -> dict:
    """Raw per-clip data (arrays) -> used by aggregate()."""
    x16 = resample(x24, M_SR, F_SR)
    t = f0_track(x16)
    f0, rms = t["f0"], t["rms"]
    voiced = ~np.isnan(f0)
    p95 = np.percentile(rms, 95) if len(rms) else 0.0
    active = rms > max(p95 * 0.05, 1e-4)
    idx = np.where(active)[0]
    first, last = (idx[0], idx[-1]) if len(idx) else (0, 0)
    inner = ~active[first: last + 1]
    longest = run = 0
    for v in inner:
        run = run + 1 if v else 0
        longest = max(longest, run)
    # brightness: spectral centroid of voiced frames (100 Hz-8 kHz), power weighted
    n = 1024
    fr = _frames(x24.astype(np.float64), n, int(0.010 * M_SR))
    sp = np.abs(np.fft.rfft(fr * np.hanning(n), axis=1))
    fq = np.fft.rfftfreq(n, 1 / M_SR)
    band = (fq >= 100) & (fq <= 8000)
    cen = (sp[:, band] * fq[band]).sum(axis=1) / (sp[:, band].sum(axis=1) + 1e-9)
    k = min(len(cen), len(voiced))
    vk = voiced[:k]
    # jitter proxy: median |dF0|/F0 between adjacent voiced frames (intonation-free enough on 10 ms hops when < 6 %)
    d = np.abs(np.diff(f0)) / f0[:-1]
    d = d[~np.isnan(d)]
    d = d[d < 0.06]
    hf = (sp[:, (fq >= 4000) & (fq <= 8000)] ** 2).sum(axis=1) / ((sp[:, band] ** 2).sum(axis=1) + 1e-12)
    dur = len(x24) / M_SR
    act_dur = max((last - first + 1) * t["hop"], 0.1)
    return {"dur": dur, "act_dur": act_dur, "words": n_words(text), "f0": f0[voiced], "r": t["r"][voiced],
            "cen": cen[:k][vk], "hf": hf[:k][vk], "jit": d, "longest_gap": longest * t["hop"],
            "peak": float(np.abs(x24).max()) if len(x24) else 0.0, "clip_frac": float((np.abs(x24) > 0.985).mean()) if len(x24) else 0.0,
            "p95": float(p95), "voiced_frac": float(voiced.mean()) if len(voiced) else 0.0,
            "rms_db": [float(20 * np.log10(v + 1e-9)) for v in np.percentile(rms[active], [10, 90])] if active.any() else [-99, -99]}


def aggregate(parts: list[dict]) -> dict:
    """Pool the clips of one candidate (both audition lines) into the measurement record."""
    f0 = np.concatenate([p["f0"] for p in parts]) if parts else np.array([])
    if len(f0) < 5:
        return {"f0_hz": 0.0, "artefacts": ["no_voice"], "dur_s": round(sum(p["dur"] for p in parts), 2)}
    r = np.concatenate([p["r"] for p in parts])
    cen = np.concatenate([p["cen"] for p in parts])
    hf = np.concatenate([p["hf"] for p in parts])
    jit = np.concatenate([p["jit"] for p in parts]) if any(len(p["jit"]) for p in parts) else np.array([0.01])
    hnr = 10 * np.log10(np.clip(r, 0.02, 0.999) / (1 - np.clip(r, 0.02, 0.999)))
    p10, p90 = np.percentile(f0, [10, 90])
    words = sum(p["words"] for p in parts)
    act = sum(p["act_dur"] for p in parts)
    wpm = words / act * 60
    art = []
    if max(p["clip_frac"] for p in parts) > 1e-4 or max(p["peak"] for p in parts) >= 0.999:
        art.append("clipping")
    if max(p["longest_gap"] for p in parts) > 1.5:
        art.append("long_internal_silence")
    if wpm < 65 or wpm > 330:
        art.append("duration_off(hallucination_or_truncation)")
    if max(p["p95"] for p in parts) < 0.003:
        art.append("near_silent")
    if np.mean([p["voiced_frac"] for p in parts]) < 0.18:
        art.append("barely_voiced")
    rms_lo = np.mean([p["rms_db"][0] for p in parts])
    rms_hi = np.mean([p["rms_db"][1] for p in parts])
    return {"f0_hz": round(float(np.median(f0)), 1), "f0_range_st": round(float(12 * np.log2(p90 / p10)), 2), "wpm": round(float(wpm), 1),
            "centroid_hz": round(float(np.median(cen))), "hnr_db": round(float(np.median(hnr)), 2), "jitter": round(float(np.median(jit)), 4),
            "hf_ratio": round(float(np.median(hf)), 4), "dyn_db": round(float(rms_hi - rms_lo), 1), "loud_db": round(float(rms_hi), 1),
            "dur_s": round(sum(p["dur"] for p in parts), 2), "peak": round(max(p["peak"] for p in parts), 3), "artefacts": art}


def rasp_raw(m: dict) -> float:
    """Roughness proxy: low harmonics-to-noise ratio + high-frequency noise share + cycle jitter (higher = raspier)."""
    return (-m.get("hnr_db", 10) / 4.0) + 12.0 * m.get("hf_ratio", 0.0) + 40.0 * m.get("jitter", 0.0)


def bright_raw(m: dict) -> float:
    return float(m.get("centroid_hz", 0))


def expr_raw(m: dict) -> float:
    return float(m.get("f0_range_st", 0))


class Pop:
    """Population percentile ranks of rasp/bright/expr over every measured clip-set."""

    def __init__(self, ms: list[dict]):
        ms = [m for m in ms if m.get("f0_hz")]
        self.v = {"rasp": np.sort([rasp_raw(m) for m in ms]), "bright": np.sort([bright_raw(m) for m in ms]), "expr": np.sort([expr_raw(m) for m in ms])}

    def pct(self, key: str, m: dict) -> float:
        a = self.v[key]
        if not len(a):
            return 50.0
        val = {"rasp": rasp_raw, "bright": bright_raw, "expr": expr_raw}[key](m)
        return float(100.0 * np.searchsorted(a, val) / len(a))


def semitones(a: float, b: float) -> float:
    return 12 * math.log2(max(a, 1e-6) / max(b, 1e-6))


def distance(role: dict, m: dict, pop: Pop | None, meta_gender: str | None = None) -> tuple[float, dict]:
    """Transparent weighted distance of a measured candidate to a role profile (lower = closer). Returns (dist, terms)."""
    if not m.get("f0_hz"):
        return 99.0, {"no_voice": 99.0}
    lo, hi = role["f0"]
    f0 = m["f0_hz"]
    out_st = 0.0 if lo <= f0 <= hi else abs(semitones(f0, lo if f0 < lo else hi))
    centre_st = abs(semitones(f0, math.sqrt(lo * hi)))
    t = {"f0": 1.0 * out_st + 0.25 * centre_st}
    wl, wh = role["wpm"]
    w = m["wpm"]
    t["pace"] = 0.0 if wl <= w <= wh else 4.0 * (max(wl / w, w / wh) - 1)
    if pop is not None:
        for key, wt in (("rasp", 1.5), ("bright", 1.0), ("expr", 0.7)):
            band = role.get(key)
            if band:
                p = pop.pct(key, m)
                t[key] = wt * (0.0 if band[0] <= p <= band[1] else (band[0] - p if p < band[0] else p - band[1]) / 25.0)
    if meta_gender and role.get("g") and meta_gender != role["g"] and meta_gender in "mf":
        t["meta_gender"] = 1.0
    t["artefacts"] = 6.0 * len(m.get("artefacts", []))
    return round(sum(t.values()), 3), {k: round(v, 2) for k, v in t.items()}


# ----------------------------------------------------------------------------- shortlist

def meta_gender(item: dict) -> str | None:
    tg = [str(x).lower() for x in item.get("tags") or []]
    if "female" in tg and "male" not in tg:
        return "f"
    if "male" in tg and "female" not in tg:
        return "m"
    return None


def shortlist_score(item: dict, role: dict) -> float:
    txt = " ".join([item.get("title") or "", item.get("description") or "", " ".join(str(t) for t in item.get("tags") or [])]).lower()
    s = sum(w for rx, w in role["kw"].items() if re.search(rx, txt))
    s -= sum(w for rx, w in role.get("no", {}).items() if re.search(rx, txt))
    if len(item.get("tags") or []) > 20:
        s *= 0.4                                   # tag-stuffed listings say nothing
    mg, g = meta_gender(item), role.get("g")
    if mg and g and mg != g:
        s -= 3
    return s + 0.6 * math.log10(max(int(item.get("task_count") or 1), 1))


def shortlist(pool: list[dict], rname: str, role: dict, n: int = 10, explore: int | None = None, seed: int = 7) -> list[dict]:
    """Top (n-explore) by text score + `explore` seeded picks from the next 80 (metadata lies, so some blind picks)."""
    seen_txt, uniq = set(), []
    for it in sorted(pool, key=lambda i: -shortlist_score(i, role)):
        key = ((it.get("title") or "").strip().lower(), (it.get("description") or "")[:80].lower())
        if key in seen_txt:
            continue
        seen_txt.add(key)
        uniq.append(it)
    explore = max(2, n // 4) if explore is None else explore
    top = uniq[: n - explore]
    rest = uniq[n - explore: n - explore + 150]
    rng = random.Random(f"{seed}{rname}")
    pick = rng.sample(rest, min(explore, len(rest)))
    out = top + pick
    if rname == "NARRATOR":
        bc = next((i for i in pool if i["_id"] == BC_NARRATOR_ID), None)
        if bc and all(i["_id"] != BC_NARRATOR_ID for i in out):
            out = out[:-1] + [bc]
    return out


# ----------------------------------------------------------------------------- synthesis + measuring (cached)

class Measurer:
    def __init__(self, client: FA.FishClient):
        self.client = client
        self.cache = json.loads(MEASURE_FILE.read_text()) if MEASURE_FILE.exists() else {}

    def save(self):
        MEASURE_FILE.parent.mkdir(parents=True, exist_ok=True)
        MEASURE_FILE.write_text(json.dumps(self.cache))

    def synth(self, tag: str, text: str, vid: str, speed: float, temp: float, label: str) -> Path:
        return self.client.synth(tag, text, vid, speed, temp, voice_label=label, validate=False)

    def measure(self, paths: list[Path], texts: list[str], fx: str = "") -> dict:
        key = "|".join(p.name for p in paths) + "|" + fx
        if key in self.cache:
            return self.cache[key]
        parts = [analyze(FA.decode_pcm(p, M_SR, fx or None), t) for p, t in zip(paths, texts)]
        m = aggregate(parts)
        self.cache[key] = m
        return m


def audition_role(M: Measurer, rname: str, role: dict, cands: list[dict], log) -> list[dict]:
    lines = [role[k] for k in ("line1", "line2") if k in role] or [role["line"]]

    def one(it):
        tag = f"aud-naruto-{rname}"
        try:
            paths = [M.synth(f"{tag}-L{i + 1}", ln, it["_id"], role["speed"], role["temp"], it["title"]) for i, ln in enumerate(lines)]
        except FA.FishError as e:
            log(f"  synth failed {rname}/{it['title']}: {e.status}")
            return None
        m = M.measure(paths, lines)
        return {"_id": it["_id"], "title": it["title"], "tags": [str(t) for t in (it.get("tags") or [])][:8], "task_count": it.get("task_count"),
                "gender_meta": meta_gender(it), "paths": [str(p) for p in paths], "lines": lines, "speed": role["speed"], "temperature": role["temp"],
                "post_fx": "", "measured": m}
    with ThreadPoolExecutor(2) as ex:
        res = [r for r in ex.map(one, cands) if r]
    M.save()
    return res


# ----------------------------------------------------------------------------- tuning

def nudge_fx(semi: float) -> str:
    return f"rubberband=pitch={2 ** (semi / 12):.4f}" if abs(semi) >= 0.05 else ""


def join_fx(*parts: str) -> str:
    return ",".join(p for p in parts if p)


def tune_candidate(M: Measurer, rname: str, role: dict, c: dict, pop: Pop, log, fish_variants: bool = True) -> dict:
    """Try Fish parameter variants, then post-FX nudges; keep whichever measures closest to the profile."""
    lines = c["lines"]
    base_m = c["measured"]
    best = dict(c)
    fx0 = ""
    if rname == "KURAMA":            # the growl chain is part of the character: every variant is judged THROUGH it (band shifts by the pitch-down)
        fx0 = join_fx(f"rubberband=pitch={KURAMA_PITCH:.4f}", FX_PRESETS["KURAMA"])
        role = dict(role, f0=role["f0_fx"])
        best["post_fx"] = fx0
        best["measured"] = M.measure([Path(p) for p in c["paths"]], lines, fx0)
    best["dist"], best["terms"] = distance(role, best["measured"], pop, c["gender_meta"])
    best["variant"] = "base"
    wmid = sum(role["wpm"]) / 2
    sp = round(min(1.25, max(0.85, c["speed"] * wmid / max(base_m["wpm"], 1))), 2) if base_m.get("wpm") else c["speed"]
    variants = [("pace", sp, c["temperature"], lines)]
    variants.append(("pace+temp.5", sp, 0.5, lines))
    if not role.get("light"):
        alt = [re.sub(r"\[[^\]]*\]", "", ln).strip() if i == 0 else ln for i, ln in enumerate(lines)]       # variant: first line without cues
        variants.append(("pace+nocue1", sp, c["temperature"], alt))
    for name, speed, temp, ls in (variants if fish_variants else []):
        if (speed, temp, ls) == (c["speed"], c["temperature"], lines):
            continue
        try:
            paths = [M.synth(f"aud-naruto-{rname}-{'V' if ls is not lines else 'L'}{i + 1}", ln, c["_id"], speed, temp, c["title"]) for i, ln in enumerate(ls)]
        except FA.FishError:
            continue
        m = M.measure(paths, ls, fx0)
        d, t = distance(role, m, pop, c["gender_meta"])
        if d < best["dist"] - 0.05:
            best = dict(c, paths=[str(p) for p in paths], lines=ls, speed=speed, temperature=temp, measured=m, dist=d, terms=t, variant=name, post_fx=fx0)
    # post-FX nudges on the winning raw clips (measured through the same filter the episode build will apply)
    paths = [Path(p) for p in best["paths"]]
    lo, hi = role["f0"]
    f0 = best["measured"].get("f0_hz") or 0
    centre = math.sqrt(lo * hi)
    st = 0.0
    if rname == "KURAMA":
        M.save()
        return best
    if f0 and not (lo <= f0 <= hi):
        st = max(-2.0, min(2.0, semitones(lo if f0 < lo else hi, f0) + (0.3 if f0 < lo else -0.3)))
    elif f0:
        st = max(-1.0, min(1.0, 0.5 * semitones(centre, f0)))
    preset = FX_PRESETS.get(rname, "")
    kur = f"rubberband=pitch={KURAMA_PITCH:.4f}" if rname == "KURAMA" else ""
    options = [("nudge", nudge_fx(st)), ("preset", join_fx(kur, preset)), ("nudge+preset", join_fx(kur or nudge_fx(st), preset))]
    for name, fx in options:
        if not fx or fx == best.get("post_fx"):
            continue
        try:
            m = M.measure(paths, best["lines"], fx)
        except Exception as e:
            log(f"  fx failed {rname} {name}: {e}")
            continue
        d, t = distance(role, m, pop, c["gender_meta"])
        if d < best["dist"] - 0.05:
            best = dict(best, post_fx=fx, measured=m, dist=d, terms=t, variant=f"{best['variant']}+fx:{name}")
    M.save()
    return best


# ----------------------------------------------------------------------------- assignment with cast separation

def separated(a: dict, b: dict, f0_frac: float = 0.12, cen_frac: float = 0.18) -> bool:
    fa, fb = a["f0_hz"], b["f0_hz"]
    if min(fa, fb) <= 0:
        return False
    if abs(fa - fb) / min(fa, fb) >= f0_frac:
        return True
    ca, cb = a["centroid_hz"], b["centroid_hz"]
    return abs(ca - cb) / max(min(ca, cb), 1) >= cen_frac


def assign(options: dict[str, list[dict]], fixed: dict[str, dict] | None = None, k: int = 5) -> tuple[dict[str, dict], list[str]]:
    """Branch-and-bound: minimise summed distance; a pair of roles that fails `separated` or reuses a voice costs +4."""
    fixed = fixed or {}
    roles = [r for r in options if r not in fixed]
    cand = {r: sorted(options[r], key=lambda c: c["dist"])[:k] for r in roles}
    roles.sort(key=lambda r: len(cand[r]))
    PEN = 4.0
    best = {"cost": 1e9, "pick": None}

    def pen(c, others):
        p = 0.0
        for o in others:
            if c["_id"] == o["_id"]:
                p += 20.0
            elif not separated(c["measured"], o["measured"]):
                p += PEN
        return p

    def rec(i, pick, cost):
        if cost >= best["cost"]:
            return
        if i == len(roles):
            best["cost"], best["pick"] = cost, dict(pick)
            return
        r = roles[i]
        for c in cand[r]:
            rec(i + 1, {**pick, r: c}, cost + c["dist"] + pen(c, list(pick.values()) + list(fixed.values())))
    rec(0, {}, 0.0)
    pick = {**fixed, **(best["pick"] or {})}
    warns = []
    names = list(pick)
    for i, a in enumerate(names):
        for b in names[i + 1:]:
            if pick[a]["_id"] == pick[b]["_id"]:
                warns.append(f"{a} and {b} share a voice")
            elif not separated(pick[a]["measured"], pick[b]["measured"]):
                warns.append(f"{a}/{b}: median F0 within 12% and similar brightness (F0 {pick[a]['measured']['f0_hz']}/{pick[b]['measured']['f0_hz']}, centroid {pick[a]['measured']['centroid_hz']}/{pick[b]['measured']['centroid_hz']})")
    return pick, warns


# ----------------------------------------------------------------------------- cast file

def entry_from(c: dict, rname: str, role: dict, letter: str = "A") -> dict:
    return {"_id": c["_id"], "title": c["title"], "tags": c["tags"], "speed": c["speed"], "temperature": c["temperature"],
            "post_fx": c.get("post_fx", ""), "variant": c.get("variant", "base"), "measured": c["measured"], "dist": c.get("dist"), "letter": letter}


def role_entry(rname: str, role: dict, opts: list[dict], pop: Pop, existing: dict | None) -> dict:
    """opts = [A, B, C] (A = pick). Returns the cast-file entry."""
    a = opts[0]
    m = a["measured"]
    tgt = {"f0_hz": list(role["f0"]), "wpm": list(role["wpm"]), "look": role.get("look", "")}
    for key in ("rasp", "bright", "expr"):
        if role.get(key):
            tgt[f"{key}_pctile"] = list(role[key])
    meas = dict(m)
    if pop is not None and not role.get("light"):
        meas.update({"rasp_pctile": round(pop.pct("rasp", m)), "bright_pctile": round(pop.pct("bright", m)), "expr_pctile": round(pop.pct("expr", m)), "rasp_proxy": round(rasp_raw(m), 2)})
    why = f"{a['title']}: median F0 {m.get('f0_hz')} Hz (target {role['f0'][0]}-{role['f0'][1]}), {m.get('wpm')} wpm (target {role['wpm'][0]}-{role['wpm'][1]}); distance {a.get('dist')} via {a.get('variant', 'base')}"
    ent = entry_from(a, rname, role, "A")
    ent.update({"pinned": False, "measured": meas, "target": tgt, "rationale": why,
                "options": {LETTERS[i]: entry_from(o, rname, role, LETTERS[i]) for i, o in enumerate(opts)}, "chosen": "A",
                "alternates": [{"_id": o["_id"], "title": o["title"], "letter": LETTERS[i + 1], "f0_hz": o["measured"].get("f0_hz"), "dist": o.get("dist")} for i, o in enumerate(opts[1:])]})
    if existing and existing.get("pinned"):
        return existing
    return ent


def clone_entry(n: dict) -> dict:
    ent = {k: v for k, v in n.items() if k in ("_id", "title", "tags")}
    ent.update({"speed": round(min(2.0, n["speed"] * 1.06), 2), "temperature": n["temperature"],
                "post_fx": join_fx(n.get("post_fx", ""), "rubberband=pitch=1.03"), "pinned": n.get("pinned", False),
                "rationale": "Same voice id as NARUTO; +6% rate and +3% pitch so crowds of clones read as him.", "clone_of": "NARUTO"})
    return ent


def apply_picks(cast_path: Path, picks: list[str]) -> list[str]:
    d = json.loads(cast_path.read_text())
    cast = d["cast"]
    out = []
    for p in picks:
        role, _, x = p.partition("=")
        role, x = role.strip().upper(), x.strip()
        if role not in cast or not x:
            out.append(f"SKIP {p}: unknown role or empty choice")
            continue
        ent = cast[role]
        opts = ent.get("options") or {}
        sel = None
        if x.upper() in opts:
            sel = opts[x.upper()]
            letter = x.upper()
        else:
            for l, o in opts.items():
                if o["_id"] == x:
                    sel, letter = o, l
        if sel:
            for k in ("_id", "title", "tags", "speed", "temperature", "post_fx", "variant", "measured"):
                if k in sel:
                    ent[k] = sel[k]
            ent["chosen"] = letter
            ent["rationale"] = f"pinned by the owner: reel option {letter} ({sel['title']})"
        else:
            ent["_id"], ent["title"], ent["chosen"] = x, f"voice {x[:8]}", "custom"
            ent["rationale"] = "pinned by the owner by voice id (settings kept from the previous pick)"
        ent["pinned"] = True
        out.append(f"{role} -> {ent['title']} ({ent['_id']}) pinned")
        if role == "NARUTO" and "CLONE" in cast:
            cast["CLONE"] = clone_entry(ent)
            out.append("CLONE follows NARUTO")
    cast_path.write_text(json.dumps(d, indent=1, ensure_ascii=False))
    return out


# ----------------------------------------------------------------------------- audio assembly (reel + scene)

def ffmpeg(args: list[str]):
    p = subprocess.run(["ffmpeg", "-y", "-v", "error"] + args, capture_output=True, text=True)
    if p.returncode != 0:
        raise RuntimeError(p.stderr[-400:])


def lufs(path: Path) -> float:
    p = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
    m = re.findall(r"I:\s+(-?[\d.]+) LUFS", p.stderr)
    return float(m[-1]) if m else -70.0


def lufs_arr(x: np.ndarray, sr: int) -> float:
    import soundfile as sf
    t = BUILD / "_tmp_lufs.wav"
    sf.write(t, x, sr, subtype="FLOAT")
    v = lufs(t)
    t.unlink()
    return v


def normalize_to(x: np.ndarray, sr: int, target: float = -15.75, tmp: Path | None = None) -> np.ndarray:
    """Gain to `target` LUFS with ffmpeg's look-ahead peak limiter (ceiling 0.95), re-measured and corrected twice."""
    import soundfile as sf
    src, dst = BUILD / "_n_src.wav", BUILD / "_n_dst.wav"
    sf.write(src, x, sr, subtype="FLOAT")
    gain = target - lufs(src)
    y = x
    for _ in range(3):
        ffmpeg(["-i", str(src), "-af", f"volume={gain:.3f}dB,alimiter=limit=0.95:attack=5:release=60:level=0", "-c:a", "pcm_f32le", str(dst)])
        y, _sr = sf.read(dst, dtype="float32")
        err = target - lufs(dst)
        if abs(err) < 0.1:
            break
        gain += err
    src.unlink(); dst.unlink()
    return y.astype(np.float32)


def write_mp3(x: np.ndarray, sr: int, path: Path):
    import soundfile as sf
    tmp = path.with_suffix(".wav")
    sf.write(tmp, x, sr, subtype="PCM_16")
    ffmpeg(["-i", str(tmp), "-codec:a", "libmp3lame", "-b:a", "192k", str(path)])
    tmp.unlink()


def clip_audio(path: str, fx: str, sr: int = 44100) -> np.ndarray:
    x = FA.decode_pcm(Path(path), sr, join_fx(fx) or None)
    # trim digital silence at both edges (the echo tail of FX chains is kept up to -55 dB)
    a = np.abs(x)
    idx = np.where(a > 10 ** (-55 / 20))[0]
    return x[max(idx[0] - int(0.03 * sr), 0): idx[-1] + int(0.05 * sr)] if len(idx) else x


def level_rms(x: np.ndarray, db: float = -21.0) -> np.ndarray:
    act = x[np.abs(x) > 0.01]
    rms = float(np.sqrt((act ** 2).mean())) if len(act) else 0.1
    return (x * (10 ** (db / 20) / max(rms, 1e-4))).astype(np.float32)


def build_reel(cast_opts: dict[str, list[dict]], log) -> dict[str, Path]:
    REEL_DIR.mkdir(parents=True, exist_ok=True)
    sr = 44100
    out = {}
    for rname in MAIN_ROLES:
        segs = []
        for i, c in enumerate([c for c in cast_opts[rname][:3] if c.get("paths")]):
            if i:
                segs.append(np.zeros(int(0.8 * sr), np.float32))
            cs = []
            for j, p in enumerate(c["paths"]):
                if j:
                    cs.append(np.zeros(int(0.35 * sr), np.float32))
                cs.append(clip_audio(p, c.get("post_fx", ""), sr))
            segs.append(level_rms(np.concatenate(cs)))          # every candidate at the same speech level: no loudness bias
        # each candidate is leveled on its own so a quiet voice is not unfairly disadvantaged
        x = normalize_to(np.concatenate(segs), sr)
        f = REEL_DIR / f"{rname.lower()}.mp3"
        write_mp3(x, sr, f)
        out[rname] = f
    return out


def pan(x: np.ndarray, p: float) -> np.ndarray:
    th = (p + 1) * math.pi / 4
    return np.stack([x * math.cos(th), x * math.sin(th)], axis=1)


def build_scene(cast: dict, client: FA.FishClient, log) -> Path:
    sr = 44100
    clips = []
    for spk, text in SCENE:
        e = cast[spk]
        p = client.synth(f"scene-naruto-{spk}", text, e["_id"], e["speed"], e["temperature"], voice_label=e["title"], validate=False)
        x = clip_audio(str(p), e.get("post_fx", ""), sr)
        # level-match speech before the final mix: -23 dBFS RMS on active frames
        act = x[np.abs(x) > 0.01]
        rms = float(np.sqrt((act ** 2).mean())) if len(act) else 0.1
        x = x * (10 ** (-21 / 20) / max(rms, 1e-4))
        clips.append((spk, x.astype(np.float32)))
    gaps = {"NARRATOR": 0.55}
    total = sum(len(x) for _, x in clips) + int(sr * 0.4 * len(clips)) + sr
    mix = np.zeros((total, 2), np.float32)
    t = int(0.25 * sr)
    for i, (spk, x) in enumerate(clips):
        st = pan(x, SCENE_PAN.get(spk, 0.0))
        mix[t: t + len(x)] += st
        gap = 0.45 if spk == "NARRATOR" or (i + 1 < len(clips) and clips[i + 1][0] == "NARRATOR") else (0.12 if spk == "NARUTO" else 0.22)
        t += len(x) + int(gap * sr)
    mix = mix[: t + int(0.4 * sr)]
    pk = float(np.abs(mix).max())
    if pk > 0.97:
        mix *= 0.97 / pk
    import soundfile as sf
    tmp = REEL_DIR / "_scene.wav"
    sf.write(tmp, mix, sr, subtype="FLOAT")
    y = normalize_to(mix, sr)
    f = REEL_DIR / "cast_scene.mp3"
    tmp2 = REEL_DIR / "_scene2.wav"
    sf.write(tmp2, y, sr, subtype="PCM_16")
    ffmpeg(["-i", str(tmp2), "-codec:a", "libmp3lame", "-b:a", "192k", str(f)])
    tmp.unlink(); tmp2.unlink()
    return f


def write_index(cast: dict, reel: dict, scene: Path | None, pop_n: int, stats: dict):
    rows = ["# Naruto cast audition reel", "",
            "Each role MP3 plays candidates **A, B, C** (each reads the same two lines; 0.8 s gap between candidates), normalised to -16 LUFS. "
            "A is the current pick. Answer like: `Naruto B, Kakashi A ...` then pin with:", "",
            "```", "python -m copycat.cast_director --franchise naruto --pick NARUTO=B KAKASHI=A", "```", "",
            "| Role | File | A (current pick) | B | C | target |", "|---|---|---|---|---|---|"]
    for r in MAIN_ROLES:
        o = cast[r]["options"]
        cell = lambda L: f"{o[L]['title']} `{o[L]['_id']}` ({o[L]['measured'].get('f0_hz')} Hz)" if L in o else "-"
        tg = cast[r]["target"]
        rows.append(f"| {r} | `reel/{r.lower()}.mp3` | {cell('A')} | {cell('B')} | {cell('C')} | {tg['f0_hz'][0]}-{tg['f0_hz'][1]} Hz, {tg['look']} |")
    if scene:
        rows += ["", "Ensemble: `reel/cast_scene.mp3` (the A picks acting together; Kurama has his growl FX)."]
    rows += ["", "## Later-episode roles (pick + alternate; not in the reel)", "", "| Role | Pick | Alternate |", "|---|---|---|"]
    for r in LIGHT_ROLES:
        e = cast.get(r)
        if e:
            alt = e["alternates"][0] if e.get("alternates") else None
            rows.append(f"| {r} | {e['title']} `{e['_id']}` ({e['measured'].get('f0_hz')} Hz) | {alt['title'] + ' `' + alt['_id'] + '`' if alt else '-'} |")
    (BUILD / "reel_index.md").write_text("\n".join(rows) + "\n")


# ----------------------------------------------------------------------------- orchestration

def run(franchise: str, cast_path: Path, top: int = 10, refresh: bool = False) -> int:
    from copycat import cast_director as CD
    log = lambda *a: print(*a, flush=True)
    BUILD.mkdir(parents=True, exist_ok=True)
    t0 = time.time()
    credit0 = FA.credit_balance()
    pool = CD.harvest_pool(API_DIR)
    ok = CD.eligible(pool)
    # keep the Black Clover narrator as a candidate when it passes the same filter
    log(f"pool {len(pool)} voices, {len(ok)} eligible original archetype voices")
    existing = {}
    if cast_path.exists():
        existing = json.loads(cast_path.read_text()).get("cast", {})
    client = FA.FishClient()
    M = Measurer(client)
    # ---- stage 1: auditions
    aud: dict[str, list[dict]] = {}
    sl_sizes = {}
    for rname in MAIN_ROLES:
        cands = shortlist(ok, rname, ROLES[rname], n=top)
        sl_sizes[rname] = len(cands)
        aud[rname] = audition_role(M, rname, ROLES[rname], cands, log)
        log(f"audition {rname}: {len(aud[rname])} candidates measured ({time.time() - t0:.0f}s) {FA.STATS.as_dict()['api_calls']} calls")
    light_aud = {}
    for rname in LIGHT_ROLES:
        cands = shortlist(ok, rname, LIGHT[rname], n=12, explore=3)
        light_aud[rname] = audition_role(M, rname, LIGHT[rname], cands, log)
    pop = Pop([c["measured"] for r in aud.values() for c in r] + [c["measured"] for r in light_aud.values() for c in r])
    # ---- stage 2: rank + tune the top 3 per role
    options: dict[str, list[dict]] = {}
    for rname in MAIN_ROLES:
        role = ROLES[rname]
        for c in aud[rname]:
            c["dist"], c["terms"] = distance(role, c["measured"], pop, c["gender_meta"])
            c["variant"] = "base"
        ranked = sorted(aud[rname], key=lambda c: c["dist"])
        tuned = [tune_candidate(M, rname, role, c, pop, log) for c in ranked[:3]]
        options[rname] = sorted(tuned + ranked[3:], key=lambda c: c["dist"])
        log(f"tuned {rname}: best {options[rname][0]['title']!r} dist {options[rname][0]['dist']} ({options[rname][0]['variant']})")
    fixed = {r: existing[r] and {"_id": existing[r]["_id"], "title": existing[r]["title"], "measured": existing[r]["measured"], "dist": 0.0,
                                  "speed": existing[r]["speed"], "temperature": existing[r]["temperature"], "tags": existing[r].get("tags", []),
                                  "post_fx": existing[r].get("post_fx", ""), "paths": [], "variant": "pinned"}
             for r in MAIN_ROLES if existing.get(r, {}).get("pinned")}
    pick, warns = assign(options, fixed)
    # ---- stage 3: light roles (1 pick + 1 alternate), distinct from main picks
    used = {c["_id"] for c in pick.values()}
    light_opts = {}
    for rname in LIGHT_ROLES:
        role = LIGHT[rname]
        for c in light_aud[rname]:
            c["dist"], c["terms"] = distance(role, c["measured"], pop, c["gender_meta"])
            c["variant"] = "base"
        rk = sorted(light_aud[rname], key=lambda c: c["dist"])
        rk = sorted([tune_candidate(M, rname, role, c, pop, log, fish_variants=False) for c in rk[:3]] + rk[3:], key=lambda c: c["dist"])
        free = [c for c in rk if c["_id"] not in used] or rk
        light_opts[rname] = free[:2]
        if free:
            used.add(free[0]["_id"])
    # ---- cast file
    cast = {}
    for rname in MAIN_ROLES:
        a = pick[rname]
        rest = [c for c in options[rname] if c["_id"] != a["_id"] and c["_id"] not in {p["_id"] for r, p in pick.items() if r != rname}]
        rest += [c for c in options[rname] if c["_id"] != a["_id"] and c not in rest]
        opts3 = [a] + rest[:2]
        if rname == "NARRATOR" and all(o["_id"] != BC_NARRATOR_ID for o in opts3):
            bc = next((c for c in options[rname] if c["_id"] == BC_NARRATOR_ID), None)
            if bc:
                opts3[2] = bc                      # channel continuity: the Black Clover narrator always gets a hearing
        cast[rname] = role_entry(rname, ROLES[rname], opts3, pop, existing.get(rname))
        if rname == "NARUTO":
            cast["CLONE"] = clone_entry(cast["NARUTO"])
    for rname in LIGHT_ROLES:
        if light_opts[rname]:
            cast[rname] = role_entry(rname, LIGHT[rname], light_opts[rname], pop, existing.get(rname))
    stats = FA.STATS.as_dict()
    credit1 = FA.credit_balance()
    d = {"_comment": "Fish Audio cast for Naruto What-If. Pin after listening to build/copycat/naruto-auditions/reel/: "
                     "python -m copycat.cast_director --franchise naruto --pick NARUTO=B KAKASHI=A  (or a voice id). Pinned entries survive --refresh. "
                     "Each role: top-level fields are the chosen settings; options A/B/C are the reel candidates with their tuned settings.",
         "model_default": FA.FREE_MODEL, "franchise": franchise, "cast": cast, "warnings": warns,
         "pool": {"harvested": len(pool), "eligible": len(ok), "shortlist_per_role": sl_sizes, "queries": len(CD.harvest_queries())},
         "run": {"api_calls": stats["api_calls"], "cache_hits": stats["cache_hits"], "http_429": stats["http_429"], "http_5xx": stats["http_5xx"],
                 "retries": stats["retries"], "credit_before": credit0, "credit_after": credit1}}
    cast_path.parent.mkdir(parents=True, exist_ok=True)
    cast_path.write_text(json.dumps(d, indent=1, ensure_ascii=False))
    (BUILD / "audition_full.json").write_text(json.dumps({r: [{k: v for k, v in c.items() if k != "lines"} for c in cs] for r, cs in options.items()}, indent=1))
    # ---- reel + scene
    reel = build_reel({r: [dict(cast[r]["options"][L], paths=next((c["paths"] for c in options[r] if c["_id"] == cast[r]["options"][L]["_id"]), [])) for L in cast[r]["options"]] for r in MAIN_ROLES}, log)
    scene = build_scene(cast, client, log)
    write_index(cast, reel, scene, len(ok), stats)
    for w in warns:
        log("WARN", w)
    log(f"done in {time.time() - t0:.0f}s; api {json.dumps(FA.STATS.as_dict())[:300]}; credit {credit0} -> {credit1}")
    return 0


if __name__ == "__main__":
    from copycat import cast_director as CD
    sys.exit(CD.main(["--franchise", "naruto"] + sys.argv[1:]))
