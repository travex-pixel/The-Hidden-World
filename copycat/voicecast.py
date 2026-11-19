"""Voice cast for the full-cast radio drama: Piper TTS per speaker + post-TTS character processing.

    python -m copycat.voicecast audition [--project ID] [--out DIR]   # same line in every voice + metrics
    python -m copycat.voicecast calibrate [--speaker NARRATOR]        # words/min on a 60-word sample

Each cast entry (voicecast.json):
  {model, speaker, length_scale, noise_scale, noise_w, pitch_semitones, formant, fx: [...], gain_db}
fx items are dicts applied in order after pitch shift (see apply_fx); items with "only_final": true are
applied only to a speaker's final lines (e.g. JULIUS shimmer).
"""
from __future__ import annotations
import hashlib, json, re, subprocess, sys, time
from pathlib import Path
import numpy as np
from scipy import signal as sg

from copycat import sfx as D
from copycat.sfx import SR

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_PROJECT = "bc-whatif-ep01"
CACHE = ROOT / ".cache" / "copycat_voice"
CODE_VERSION = "v3"
TARGET_RMS_DB = -20.0     # speech-frame RMS of every line before per-character gain_db
EDGE_KEEP_S = 0.030       # silence left at each end after trimming (<= 40 ms)
EDGE_FADE_S = 0.005

# ----------------------------------------------------------------------------- pronunciation
# respell: plain-text spelling (also what the unit tests check); ipa: exact phonemes used at synthesis
# (espeak guesses wrongly for these names, e.g. "Liebe" -> "leeb", "Hage" -> "hayj").
PRONUNCIATIONS = {
    "Liebe": {"respell": "Lee-beh", "ipa": "l ˈ i ː b ɛ"},
    "Licita": {"respell": "Lih-chee-ta", "ipa": "l ɪ t ʃ ˈ i ː t ə"},
    "Yuno": {"respell": "Yoo-no", "ipa": "j ˈ u ː n ˌ o ʊ"},
    "Hage": {"respell": "Hah-geh", "ipa": "h ˈ ɑ ː ɡ ˌ ɛ"},
    "Asta": {"respell": "Ah-sta", "ipa": "ˈ ɑ ː s t ə"},
    "Revchi": {"respell": "Rev-chee", "ipa": None},
    "Novachrono": {"respell": "Nova-krono", "ipa": None},
    "Vangeance": {"respell": "Van-jance", "ipa": None},
    "Ki": {"respell": "Key", "ipa": None},
    "grimoire": {"respell": "grim-wahr", "ipa": None},
    "grimoires": {"respell": "grim-wahrs", "ipa": None},
    "Noelle": {"respell": "No-el", "ipa": None},
    "Nacht": {"respell": "Nakt", "ipa": None},
    "Lichtenberg": {"respell": "Lick-ten-berg", "ipa": None},
    "Zenon": {"respell": "Zeh-non", "ipa": None},
    "Vetto": {"respell": "Veh-toe", "ipa": None},
    "Sylph": {"respell": "Silf", "ipa": None},
}
_PRON_RE = re.compile(r"\b(" + "|".join(sorted(map(re.escape, PRONUNCIATIONS), key=len, reverse=True)) + r")(?=\b|['’])")

_ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
_TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()


def number_words(n: int) -> str:
    if n < 20: return _ONES[n]
    if n < 100: return _TENS[n // 10] + ("" if n % 10 == 0 else "-" + _ONES[n % 10])
    if n < 1000: return _ONES[n // 100] + " hundred" + ("" if n % 100 == 0 else " " + number_words(n % 100))
    if n < 1_000_000: return number_words(n // 1000) + " thousand" + ("" if n % 1000 == 0 else " " + number_words(n % 1000))
    return str(n)


def clean_text(text: str) -> str:
    """Generic TTS clean-up (no name respelling)."""
    t = text.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    t = re.sub(r"\[[^\]]*\]|\*[^*]*\*", " ", t)                    # stage directions
    t = t.replace("—", ", ").replace("–", ", ").replace(" - ", ", ").replace("…", "...")
    t = re.sub(r"(\d+)%", lambda m: number_words(int(m.group(1))) + " percent", t)
    t = re.sub(r"\b\d{1,6}\b", lambda m: number_words(int(m.group(0))), t)
    t = re.sub(r"\s+", " ", t)
    t = re.sub(r"\s+([,.;:!?])", r"\1", t).strip()
    return t


def normalize_text(text: str) -> str:
    """Text with names respelled for TTS: 'Liebe' -> 'Lee-beh', 'Ki' -> 'Key', digits -> words."""
    return _PRON_RE.sub(lambda m: PRONUNCIATIONS[m.group(1)]["respell"], clean_text(text))


def pron_segments(text: str) -> list[tuple[str, str]]:
    """Split cleaned text into ('text', str) and ('ipa', 'p h o n e m e s') pieces for synthesis."""
    t = clean_text(text)
    out, pos = [], 0
    for m in _PRON_RE.finditer(t):
        ent = PRONUNCIATIONS[m.group(1)]
        out.append(("text", t[pos:m.start()]))
        out.append(("ipa", ent["ipa"]) if ent["ipa"] else ("text", ent["respell"]))
        pos = m.end()
    out.append(("text", t[pos:]))
    merged: list[tuple[str, str]] = []
    for k, s in out:
        if k == "text" and merged and merged[-1][0] == "text":
            merged[-1] = ("text", merged[-1][1] + s)
        else:
            merged.append((k, s))
    return [(k, s) for k, s in merged if s.strip()]


# ----------------------------------------------------------------------------- cast file

def cast_path(project: str = DEFAULT_PROJECT) -> Path:
    p = ROOT / "copycat" / "projects" / project / "voicecast.json"
    return p if p.exists() else ROOT / "copycat" / "projects" / DEFAULT_PROJECT / "voicecast.json"


def load_cast(path: Path | str | None = None) -> dict:
    p = Path(path) if path else cast_path()
    data = json.loads(p.read_text())
    return data.get("cast", data)


def entry_for(cast: dict, speaker: str) -> dict:
    return cast.get(speaker) or cast["DEFAULT"]


# ----------------------------------------------------------------------------- Piper

_VOICES: dict = {}


def _voice(model: str):
    if model not in _VOICES:
        from piper import PiperVoice
        from pipeline.voices import voice_path
        _VOICES[model] = PiperVoice.load(str(voice_path(model)))
    return _VOICES[model]


def piper_available() -> bool:
    try:
        import piper  # noqa: F401
        return True
    except Exception:
        return False


def _tts_raw(text: str, entry: dict) -> tuple[np.ndarray, int]:
    from piper.config import SynthesisConfig
    v = _voice(entry["model"])
    cfg = SynthesisConfig(speaker_id=entry.get("speaker"), length_scale=entry.get("length_scale", 1.0),
                          noise_scale=entry.get("noise_scale", 0.667), noise_w_scale=entry.get("noise_w", 0.8),
                          normalize_audio=True)
    sr = v.config.sample_rate
    pieces = []
    # phonemise piecewise so names can carry exact IPA, then synthesise sentence by sentence
    phon: list[str] = []
    for kind, s in pron_segments(text):
        if kind == "ipa":
            phon += [" "] + s.split() + [" "]
        else:
            for sent in v.phonemize(s):
                phon += sent + [" "]
    # chunk at sentence-final punctuation to keep each VITS call short and natural
    chunks, cur = [], []
    for p in phon:
        cur.append(p)
        if p in (".", "!", "?") :
            chunks.append(cur); cur = []
    if cur: chunks.append(cur)
    chunks = [[p for p in c] for c in chunks if any(p.strip() for p in c)]
    gap = np.zeros(int(0.03 * sr), np.float32)
    for i, c in enumerate(chunks):
        c = [x for x in c]
        while c and c[0] == " ": c = c[1:]
        while c and c[-1] == " ": c = c[:-1]
        ids = v.phonemes_to_ids(c)
        a = v.phoneme_ids_to_audio(ids, cfg)
        pieces.append(np.asarray(a, np.float32).reshape(-1))
        if i < len(chunks) - 1:
            pieces.append(gap)
    return np.concatenate(pieces) if pieces else np.zeros(100, np.float32), sr


# ----------------------------------------------------------------------------- DSP on a mono voice

def _frame_rms(x: np.ndarray, win: int) -> np.ndarray:
    n = len(x) // win
    if n == 0: return np.array([0.0])
    return np.sqrt((x[: n * win].reshape(n, win).astype(np.float64) ** 2).mean(axis=1))


def compress_silences(x: np.ndarray, sr: int = SR, long_ms: float = 260.0, to_ms: float = 230.0, xf_ms: float = 8.0) -> np.ndarray:
    """Shorten every internal silence longer than long_ms to to_ms (short crossfades), keeping staccato lines punchy."""
    win = int(0.005 * sr)
    n = len(x) // win
    if n < 4: return x
    r = np.sqrt((x[: n * win].reshape(n, win).astype(np.float64) ** 2).mean(axis=1))
    sil = r < max(r.max() * 0.015, 1e-4)
    half = int(to_ms / 2000 * sr)
    cuts, i = [], 0
    while i < n:
        if not sil[i]:
            i += 1; continue
        j = i
        while j < n and sil[j]: j += 1
        if i > 0 and j < n and (j - i) * win > long_ms / 1000 * sr:
            cuts.append((i * win + half, j * win - half))
        i = j
    if not cuts: return x
    segs, pos = [], 0
    for a, b in cuts:
        segs.append(x[pos:a]); pos = b
    segs.append(x[pos:])
    f = xf_ms / 1000
    segs = [D.fade(sg_, f if k else 0, f if k < len(segs) - 1 else 0, sr, "lin") for k, sg_ in enumerate(segs)]
    return np.concatenate(segs).astype(np.float32)


def trim_edges(x: np.ndarray, sr: int = SR, keep: float = EDGE_KEEP_S, fade_s: float = EDGE_FADE_S) -> np.ndarray:
    win = int(0.005 * sr)
    r = _frame_rms(x, win)
    thr = max(r.max() * 0.012, 1e-4)      # about -38 dB under the loudest frame
    idx = np.where(r > thr)[0]
    if len(idx) == 0: return x
    a = max(0, idx[0] * win - int(keep * sr)); b = min(len(x), (idx[-1] + 1) * win + int(keep * sr))
    return D.fade(x[a:b], fade_s, fade_s, sr, curve="lin")


def speech_rms_db(x: np.ndarray, sr: int = SR) -> float:
    """RMS (dBFS) over active speech frames (frames within 30 dB of the loudest 400 ms-ish region)."""
    r = _frame_rms(x, int(0.02 * sr))
    act = r[r > r.max() * 0.03]
    return float(20 * np.log10(np.sqrt((act ** 2).mean()) + 1e-9))


def pitch_shift(x: np.ndarray, st: float, sr: int = SR, formant: str = "preserved") -> np.ndarray:
    """Duration-preserving pitch shift through ffmpeg's rubberband (-> numpy fallback via resample+stretch)."""
    if abs(st) < 1e-3: return x
    ratio = 2 ** (st / 12.0)
    cmd = ["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(sr), "-ac", "1", "-i", "-", "-af",
           f"rubberband=pitch={ratio:.5f}:formant={formant}:pitchq=quality:transients=smooth", "-f", "f32le", "-ar", str(sr), "-ac", "1", "-"]
    try:
        p = subprocess.run(cmd, input=x.astype(np.float32).tobytes(), capture_output=True, check=True)
        y = np.frombuffer(p.stdout, np.float32).copy()
        if len(y) > 0:
            return y
    except Exception:
        pass
    # fallback: resample (pitch+speed change) then restore length with a phase-vocoder-free OLA stretch
    y = sg.resample(x, int(len(x) / ratio))
    return sg.resample_poly(y, len(x), len(y)).astype(np.float32)


def compress(x: np.ndarray, thr_db=-22.0, ratio=2.5, attack_ms=8.0, release_ms=120.0, makeup_db=0.0, sr: int = SR) -> np.ndarray:
    blk = int(0.002 * sr)
    n = len(x) // blk
    if n == 0: return x
    lev = np.sqrt((x[: n * blk].reshape(n, blk).astype(np.float64) ** 2).mean(axis=1)) + 1e-9
    ldb = 20 * np.log10(lev)
    over = np.clip(ldb - thr_db, 0, None)
    target = -over * (1 - 1 / ratio)
    ca, cr = np.exp(-blk / (attack_ms * 1e-3 * sr)), np.exp(-blk / (release_ms * 1e-3 * sr))
    g = np.zeros(n); cur = 0.0
    for i in range(n):
        c = ca if target[i] < cur else cr
        cur = c * cur + (1 - c) * target[i]
        g[i] = cur
    gain = 10 ** ((g + makeup_db) / 20)
    full = np.interp(np.arange(len(x)), (np.arange(n) + 0.5) * blk, gain)
    return (x * full).astype(np.float32)


def saturate(x: np.ndarray, drive: float = 2.0, mix: float = 0.3) -> np.ndarray:
    y = np.tanh(x * drive) / np.tanh(drive)
    # a touch of asymmetry gives even harmonics (growl) without harshness
    y = y + 0.08 * drive * (x ** 2 - np.mean(x ** 2))
    y = D.lp(y.astype(np.float32), 9000)
    return ((1 - mix) * x + mix * y).astype(np.float32)


def delay_mix(x: np.ndarray, taps: list[tuple[float, float]], lp_hz: float = 6000, hp_hz: float = 0.0, sr: int = SR) -> np.ndarray:
    """x mono -> mono with extra length for echo tails; taps = [(delay_s, gain_db)]."""
    mx = max(d for d, _ in taps)
    out = np.zeros(len(x) + int(mx * sr) + 1, np.float32)
    out[: len(x)] += x
    for d, g in taps:
        e = D.lp(x, lp_hz)
        if hp_hz: e = D.hp(e, hp_hz)
        s = int(d * sr); out[s:s + len(x)] += e * D.db(g)
    return out


def apply_fx(x: np.ndarray, fx: list[dict], final: bool, sr: int = SR) -> np.ndarray:
    """Apply the cast entry's fx chain. Returns mono (stays mono; tails may extend length)."""
    for f in fx:
        if f.get("only_final") and not final:
            continue
        t = f["type"]
        if t in ("lowshelf", "highshelf", "peak", "lp", "hp", "bp"):
            x = D.biquad(x, t, f["hz"], f.get("db", 0.0), f.get("q", 0.707), sr)
        elif t == "compress":
            x = compress(x, f.get("threshold_db", -22), f.get("ratio", 2.5), f.get("attack_ms", 8), f.get("release_ms", 120), f.get("makeup_db", 0.0), sr)
        elif t == "saturate":
            x = saturate(x, f.get("drive", 2.0), f.get("mix", 0.3))
        elif t == "octave_down":
            low = D.lp(pitch_shift(x, -12, sr, "shifted"), f.get("lp_hz", 700))
            n = min(len(low), len(x)); x = x.copy(); x[:n] += low[:n] * D.db(f.get("gain_db", -18))
        elif t == "slapback":
            x = delay_mix(x, [(f.get("delay_ms", 90) / 1000, f.get("gain_db", -14)), (f.get("delay_ms", 90) * 1.9 / 1000, f.get("gain_db", -14) - 6)],
                          f.get("lp_hz", 2800))
        elif t == "reverb":   # mono in -> mono-compatible out (L+R fold) so cast stays mono until the pan stage
            wet = D.add_reverb(x, f.get("decay_s", 1.2), f.get("wet_db", -14), 0.0, f.get("predelay_ms", 12), f.get("damp_hz", 2500), 7,
                               send_hp=f.get("send_hp", 200), dark=f.get("dark", 1.0))
            x = wet.mean(axis=1).astype(np.float32)
        elif t == "shimmer":
            up = pitch_shift(x, 12, sr, "preserved")
            n = min(len(up), len(x))
            x = _shimmer(x, D.hp(D.lp(up[:n], 8000), 700), f.get("gain_db", -16), sr)
        elif t == "tremolo":
            tt = np.arange(len(x)) / sr
            x = (x * (1 - f.get("depth", 0.05) + f.get("depth", 0.05) * np.sin(2 * np.pi * f.get("rate_hz", 5.5) * tt))).astype(np.float32)
        else:
            raise ValueError(f"unknown fx {t}")
    return x.astype(np.float32)


def _shimmer(x: np.ndarray, echo: np.ndarray, gain_db: float, sr: int) -> np.ndarray:
    tail = int(0.9 * sr)
    out = np.zeros(len(x) + tail, np.float32)
    out[: len(x)] += x
    for k, (d, g) in enumerate(((0.17, gain_db), (0.34, gain_db - 5), (0.51, gain_db - 10))):
        s = int(d * sr); out[s:s + len(echo)] += echo[: len(out) - s] * D.db(g)
    return out


# ----------------------------------------------------------------------------- one line

WPM_RETRY_LOW, WPM_RETRY_HIGH, WPM_AIM_LOW, WPM_AIM_HIGH = 120.0, 220.0, 135.0, 200.0


def _raw48(text: str, entry: dict) -> np.ndarray:
    """TTS -> 48 kHz, silences compressed, edges trimmed. Re-synthesises with an adjusted length_scale when the line's
    speed is an outlier (Piper's duration sampling can make a short line unnaturally fast or slow)."""
    words = len(clean_text(text).split())
    best, best_err = None, 1e9
    e = dict(entry)
    for attempt in range(4):
        x, sr = _tts_raw(text, e)
        x = sg.resample_poly(x, SR // np.gcd(SR, sr), sr // np.gcd(SR, sr)).astype(np.float32) if sr != SR else x
        x = trim_edges(compress_silences(x))
        wpm = words / (len(x) / SR) * 60 if len(x) else 999
        err = 0.0 if WPM_RETRY_LOW <= wpm <= WPM_RETRY_HIGH else abs(np.log(wpm / 165))
        if best is None or err < best_err:
            best, best_err = x, err
        if err == 0.0 or words < 3:
            break
        aim = WPM_AIM_LOW if wpm < WPM_RETRY_LOW else WPM_AIM_HIGH
        e["length_scale"] = float(np.clip(e["length_scale"] * wpm / aim, 0.7, 2.2))
    return best


def _key(text: str, entry: dict, final: bool) -> str:
    blob = json.dumps({"t": clean_text(text), "e": {k: v for k, v in entry.items() if k != "pan"}, "f": final, "v": CODE_VERSION}, sort_keys=True)
    return hashlib.sha1(blob.encode()).hexdigest()[:20]


def synth_line(text: str, entry: dict, final: bool = False, use_cache: bool = True) -> tuple[np.ndarray, int]:
    """-> (mono float32 @48 kHz incl. FX tail, dry_len_samples). Level-matched to TARGET_RMS_DB + gain_db."""
    CACHE.mkdir(parents=True, exist_ok=True)
    f = CACHE / f"{_key(text, entry, final)}.npz"
    if use_cache and f.exists():
        z = np.load(f)
        return z["x"], int(z["dry"])
    x = _raw48(text, entry)
    x = pitch_shift(x, entry.get("pitch_semitones", 0.0), SR, entry.get("formant", "preserved"))
    dry_fx = [f_ for f_ in entry.get("fx", []) if f_["type"] not in ("octave_down", "slapback", "reverb", "shimmer")]
    tail_fx = [f_ for f_ in entry.get("fx", []) if f_["type"] in ("octave_down", "slapback", "reverb", "shimmer")]
    x = apply_fx(x, dry_fx, final)
    x = trim_edges(x)
    dry = len(x)
    # level match before the spatial effects so tails follow the dry level
    x = x * D.db(TARGET_RMS_DB - speech_rms_db(x) + entry.get("gain_db", 0.0))
    x = apply_fx(x, tail_fx, final)
    pk = float(np.max(np.abs(x)))
    if pk > 0.9:                       # soft ceiling, no hard clipping
        x = (np.tanh(x / pk * 1.2) / np.tanh(1.2) * 0.9).astype(np.float32)
    # trim the tail where it has decayed to -55 dBFS, fade out
    if len(x) > dry:
        win = int(0.01 * SR)
        r = _frame_rms(x[dry:], win)
        keep = np.where(r > 10 ** (-55 / 20))[0]
        end = dry + ((keep[-1] + 1) * win if len(keep) else 0)
        x = D.fade(x[: max(end, dry)], 0, 0.03 if end > dry else 0, SR, curve="lin")
    x = x.astype(np.float32)
    np.savez(f, x=x, dry=dry)
    return x, dry


# ----------------------------------------------------------------------------- audition + measurements

def median_f0(x: np.ndarray, sr: int = SR, lo=65, hi=420) -> float:
    d = 2  # decimate to ~12 kHz for speed
    y = sg.decimate(x, 4, zero_phase=False); s = sr // 4
    fr, hop = int(0.045 * s), int(0.02 * s)
    out = []
    for i in range(0, len(y) - fr, hop):
        seg = y[i:i + fr]
        if np.sqrt((seg ** 2).mean()) < 0.03: continue
        seg = seg - seg.mean()
        ac = np.correlate(seg, seg, "full")[fr - 1:]
        a, b = int(s / hi), int(s / lo)
        k = a + int(np.argmax(ac[a:b]))
        if ac[k] / (ac[0] + 1e-9) > 0.55: out.append(s / k)
    return float(np.median(out)) if out else 0.0


def spectral_centroid(x: np.ndarray, sr: int = SR) -> float:
    f, p = sg.welch(x, sr, nperseg=4096)
    m = (f > 80) & (f < 8000)
    return float((f[m] * p[m]).sum() / (p[m].sum() + 1e-12))


def measure(x: np.ndarray, dry: int, text: str) -> dict:
    d = dry / SR
    return {"duration_s": round(len(x) / SR, 3), "dry_s": round(d, 3), "wpm": round(len(text.split()) / d * 60, 1),
            "rms_db": round(speech_rms_db(x[:dry]), 2), "peak": round(float(np.max(np.abs(x))), 3),
            "centroid_hz": round(spectral_centroid(x[:dry])), "f0_hz": round(median_f0(x[:dry]), 1)}


AUDITION_LINE = ("I never asked for this power, but it chose me anyway. Now the book is open, "
                 "and Liebe is listening to every word that we say.")
SAMPLE_60 = ("The village of Hage sat at the edge of the kingdom, where the road gave out and the fields began. "
             "Nobody there had magic, and nobody expected any. Yet on the night the church bells rang without a hand "
             "to pull them, two boys were left on the steps, wrapped in the same grey cloth, and a book waited nearby.")
MAIN = ["NARRATOR", "ASTA", "LIEBE", "YUNO", "YAMI", "REVCHI", "JULIUS"]


def audition(cast: dict, out_dir: Path) -> dict:
    import soundfile as sf
    out_dir.mkdir(parents=True, exist_ok=True)
    res = {}
    for sp in [k for k in cast if k != "DEFAULT"] + ["DEFAULT"]:
        x, dry = synth_line(AUDITION_LINE, cast[sp], final=(sp == "JULIUS"), use_cache=False)
        sf.write(out_dir / f"{sp}.wav", x, SR, subtype="PCM_16")
        res[sp] = measure(x, dry, AUDITION_LINE)
    # distinctness: any two main speakers must differ in median F0 (>= 7 %) or centroid (>= 12 %)
    bad = []
    for i, a in enumerate(MAIN):
        for b in MAIN[i + 1:]:
            if a not in res or b not in res: continue
            fd = abs(res[a]["f0_hz"] - res[b]["f0_hz"]) / max(res[a]["f0_hz"], 1)
            cd = abs(res[a]["centroid_hz"] - res[b]["centroid_hz"]) / max(res[a]["centroid_hz"], 1)
            if fd < 0.07 and cd < 0.12: bad.append((a, b, round(fd, 3), round(cd, 3)))
    res["_not_distinct"] = bad
    res["_clipping"] = [k for k, v in res.items() if not k.startswith("_") and v["peak"] >= 0.99]
    (out_dir / "audition.json").write_text(json.dumps(res, indent=1))
    return res


def main(argv=None):
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["audition", "calibrate"])
    ap.add_argument("--project", default=DEFAULT_PROJECT)
    ap.add_argument("--out")
    ap.add_argument("--speaker", default="NARRATOR")
    a = ap.parse_args(argv)
    cast = load_cast(cast_path(a.project))
    if a.cmd == "audition":
        out = Path(a.out) if a.out else ROOT / "build" / "copycat" / a.project / "audio" / "audition"
        res = audition(cast, out)
        print(f"{'speaker':14s} {'dur':>6s} {'wpm':>6s} {'rmsdB':>7s} {'peak':>6s} {'centroid':>8s} {'f0':>6s}")
        for k, v in res.items():
            if not k.startswith("_"):
                print(f"{k:14s} {v['duration_s']:6.2f} {v['wpm']:6.1f} {v['rms_db']:7.2f} {v['peak']:6.3f} {v['centroid_hz']:8d} {v['f0_hz']:6.1f}")
        print("not distinct:", res["_not_distinct"], "clipping:", res["_clipping"])
    else:
        e = entry_for(cast, a.speaker)
        x, dry = synth_line(SAMPLE_60, e, use_cache=False)
        print(a.speaker, "words", len(SAMPLE_60.split()), measure(x, dry, SAMPLE_60))


if __name__ == "__main__":
    main()
