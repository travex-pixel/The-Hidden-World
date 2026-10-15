"""Per-scene narration with Piper TTS (default, offline) or the optional ElevenLabs provider, cached by content hash.

Provider selection (pipeline/tts_elevenlabs.py is only imported when ElevenLabs is chosen):
  - a voice profile may say `"provider": "elevenlabs"` with `voice_id`, `model_id` and `voice_settings`;
  - the HW_TTS_PROVIDER environment variable (set by `--tts` on build.py / produce.py) overrides every profile;
  - anything else is Piper, exactly as before. Piper cache keys are unchanged; ElevenLabs clips live under `el_<hash>`
    with the provider, voice id, model id, settings and text in the hash, so the two can never collide.
"""
from __future__ import annotations
import hashlib, json, os, re, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / ".cache" / "narration"
SR = 22050
PROVIDER_ENV = "HW_TTS_PROVIDER"
PROVIDERS = ("piper", "elevenlabs", "recorded")   # recorded = the owner's own voice, imported by pipeline/voice_import.py


def provider_of(v: dict | None) -> str:
    """'piper' unless the profile asks for ElevenLabs or HW_TTS_PROVIDER overrides it."""
    p = (os.environ.get(PROVIDER_ENV, "").strip().lower() or (v or {}).get("provider") or "piper")
    if p not in PROVIDERS:
        raise ValueError(f"unknown TTS provider {p!r}; choose one of {PROVIDERS}")
    return p


def elevenlabs_config(v: dict | None) -> dict:
    """Voice/model for an ElevenLabs profile; the environment fills gaps so `--tts elevenlabs` works on any episode."""
    from pipeline.tts_elevenlabs import DEFAULT_MODEL
    v = v or {}
    return {"voice_id": v.get("voice_id") or os.environ.get("ELEVENLABS_VOICE_ID", ""),
            "model_id": v.get("model_id") or os.environ.get("ELEVENLABS_MODEL_ID") or DEFAULT_MODEL,
            "voice_settings": dict(v.get("voice_settings") or {})}


def _key(voice: str, text: str, length_scale: float, speaker=None) -> str:
    sp = "" if speaker is None else f"|spk{speaker}"
    return hashlib.sha1(f"{voice}|{length_scale}|{text}{sp}".encode()).hexdigest()[:16]


def _el_key(cfg: dict, text: str) -> str:
    from pipeline.tts_elevenlabs import OUTPUT_FORMAT
    s = json.dumps(cfg["voice_settings"], sort_keys=True)
    return "el_" + hashlib.sha1(f"elevenlabs|{cfg['voice_id']}|{cfg['model_id']}|{s}|{OUTPUT_FORMAT}|{text}".encode()).hexdigest()[:16]


def read_wav(path: Path) -> tuple[np.ndarray, int]:
    with wave.open(str(path)) as w:
        sr = w.getframerate()
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
        if w.getnchannels() == 2:
            data = data.reshape(-1, 2).mean(axis=1)
    return data, sr


def trim_silence(x: np.ndarray, sr: int, thresh: float = 0.01, keep: float = 0.08) -> np.ndarray:
    idx = np.where(np.abs(x) > thresh)[0]
    if len(idx) == 0:
        return x
    a = max(0, idx[0] - int(keep * sr))
    b = min(len(x), idx[-1] + int(keep * sr))
    return x[a:b]


_VOICES = {}

_ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
_TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()


def _two(n: int) -> str:
    # a space, not a hyphen: Piper stresses "eighty-two" as one odd word, and listeners/ASR hear "1980, two"
    return _ONES[n] if n < 20 else _TENS[n // 10] + ("" if n % 10 == 0 else " " + _ONES[n % 10])


def speak_years(text: str) -> str:
    """Spell four-digit years the way a narrator says them. Piper's phonemiser reads '1978' as
    'nineteen hundred seventy eight'; this gives 'nineteen seventy eight', 'two thousand five', 'twenty twelve'.
    Only standalone 1100-2099 numbers are touched (not '35,000', not '1978s')."""
    import re

    def year(m):
        y = int(m.group(0)); hi, lo = divmod(y, 100)
        if 2000 <= y <= 2009:
            return "two thousand" + ("" if lo == 0 else " " + _ONES[lo])
        if lo == 0:
            return _two(hi) + " hundred"
        return _two(hi) + " " + ("oh " + _ONES[lo] if lo < 10 else _two(lo))
    return re.sub(r"(?<![\d,.])(1[1-9]\d\d|20\d\d)(?!\d|,\d|s\b)", year, text)


_PUNCT = set(" ,.:;?!\"'()-—…^$_")


def _phoneme_words(alignments, sr: int) -> list[tuple[float, float]]:
    """Group Piper phoneme alignments into spoken words: [(start_s, end_s)] (pauses fall between words)."""
    out, pos, start, cur = [], 0, None, False
    for a in alignments:
        n = int(a.num_samples)
        if a.phoneme in _PUNCT:
            if cur:
                out.append((start / sr, pos / sr)); cur = False
        else:
            if not cur:
                start, cur = pos, True
        pos += n
    if cur:
        out.append((start / sr, pos / sr))
    return out


def narrate_scene(voice_name: str, text: str, length_scale: float = 1.0, speaker=None, align: bool = False,
                  profile: dict | None = None, speed_mult: float = 1.0) -> Path:
    """Synthesise one clip (cached). align=True also writes <clip>.words.json: spoken-word timings from Piper's
    phoneme alignments, relative to the trimmed clip (needs the free `onnx` package).
    With an ElevenLabs profile (or HW_TTS_PROVIDER=elevenlabs) the clip comes from the API instead; `length_scale`
    is Piper-only there, and `speed_mult` scales the profile's voice_settings.speed."""
    CACHE.mkdir(parents=True, exist_ok=True)
    if provider_of(profile) == "elevenlabs":
        return _narrate_elevenlabs(profile, text, speed_mult)
    out = CACHE / f"{_key(voice_name, text, length_scale, speaker)}.wav"
    words_json = out.with_suffix(".words.json")
    if out.exists() and (not align or words_json.exists()):
        return out
    if align:
        return _narrate_aligned(voice_name, text, length_scale, speaker, out, words_json)
    from piper import PiperVoice
    from piper.config import SynthesisConfig
    from pipeline.voices import voice_path
    if voice_name not in _VOICES:
        _VOICES[voice_name] = PiperVoice.load(str(voice_path(voice_name)))
    voice = _VOICES[voice_name]
    cfg = SynthesisConfig(length_scale=length_scale, speaker_id=speaker)
    tmp = out.with_suffix(".tmp.wav")
    with wave.open(str(tmp), "wb") as w:
        voice.synthesize_wav(text, w, syn_config=cfg)
    x, sr = read_wav(tmp)
    x = trim_silence(x, sr)
    peak = float(np.max(np.abs(x))) or 1.0
    x = x / peak * 0.89
    with wave.open(str(out), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
    tmp.unlink(missing_ok=True)
    return out


def _narrate_aligned(voice_name, text, length_scale, speaker, out: Path, words_json: Path) -> Path:
    import json
    from piper import PiperVoice
    from piper.config import SynthesisConfig
    from pipeline.voices import voice_path
    k = voice_name + "|align"
    if k not in _VOICES:
        _VOICES[k] = PiperVoice.load(str(voice_path(voice_name)), include_alignments=True)
    voice = _VOICES[k]
    cfg = SynthesisConfig(length_scale=length_scale, speaker_id=speaker)
    audio, words, off, sr = [], [], 0.0, None
    for ch in voice.synthesize(text, syn_config=cfg, include_alignments=True):
        sr = ch.sample_rate
        if not ch.phoneme_alignments:
            raise RuntimeError("voice returned no phoneme alignments (pip install onnx)")
        words += [(a + off, b + off) for a, b in _phoneme_words(ch.phoneme_alignments, sr)]
        audio.append(ch.audio_float_array); off += len(ch.audio_float_array) / sr
    x = np.concatenate(audio).astype(np.float32)
    idx = np.where(np.abs(x) > 0.01)[0]
    cut = max(0, idx[0] - int(0.08 * sr)) if len(idx) else 0
    x = trim_silence(x, sr)
    peak = float(np.max(np.abs(x))) or 1.0
    x = x / peak * 0.89
    with wave.open(str(out), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
    dur = len(x) / sr
    words_json.write_text(json.dumps([[round(max(0.0, a - cut / sr), 3), round(min(dur, b - cut / sr), 3)] for a, b in words]))
    return out


def _narrate_elevenlabs(profile: dict | None, text: str, speed_mult: float = 1.0) -> Path:
    """One ElevenLabs clip, cached as el_<hash>.wav + .words.json (word spans from the API's character alignment,
    relative to the trimmed clip). Same trim and peak normalisation as the Piper path. Raises TTSProviderError on
    any failure; it never falls back to Piper."""
    from pipeline import tts_elevenlabs as tts
    cfg = elevenlabs_config(profile)
    if speed_mult != 1.0:
        cfg["voice_settings"]["speed"] = round(float(cfg["voice_settings"].get("speed", 1.0)) * speed_mult, 3)
    out = CACHE / f"{_el_key(cfg, text)}.wav"; words_json = out.with_suffix(".words.json")
    if out.exists() and words_json.exists():
        return out
    res = tts.synthesize(text, cfg["voice_id"], cfg["model_id"], cfg["voice_settings"])
    x, sr = res["audio"], res["sr"]
    idx = np.where(np.abs(x) > 0.01)[0]
    cut = max(0, idx[0] - int(0.08 * sr)) if len(idx) else 0
    x = trim_silence(x, sr)
    peak = float(np.max(np.abs(x))) or 1.0
    x = x / peak * 0.89
    with wave.open(str(out), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
    dur = len(x) / sr
    words_json.write_text(json.dumps([[round(max(0.0, a - cut / sr), 3), round(min(dur, b - cut / sr), 3)] for a, b in res["words"]]))
    return out


def pronounce(text: str, table: dict | None) -> str:
    """Whole-word spoken substitutions ({"D4vd": "David"}), case-insensitive, punctuation kept. Captions keep the
    written form; each written word maps to its spoken replacement, so word timings stay aligned."""
    if not table:
        return text
    def sub(m):
        w = m.group(0); core = w.strip(".,:;?!\"'()")
        rep = next((v for k, v in table.items() if k.lower() == core.lower()), None)
        return w.replace(core, rep) if rep else w
    return re.sub(r"\S+", sub, text)


_WORD_SEP = r"[ ,.:;?!\"'()—…-]+"


def map_counts(display: str, counts: list[int], spans: list) -> tuple[list[dict], bool]:
    """Assign spoken-word spans to the caption's words given how many spoken words each caption word becomes.
    Returns (words, exact). exact=False means the counts and spans disagreed and the timing is PROPORTIONAL to
    word length between the first and last span: callers must flag that, never present it as measured timing."""
    disp = display.split()
    if sum(counts) == len(spans) and spans:
        out, i = [], 0
        for w, c in zip(disp, counts):
            out.append({"w": w, "start": spans[i][0], "end": spans[i + c - 1][1]}); i += c
        return out, True
    a, b = (spans[0][0], spans[-1][1]) if spans else (0.0, 0.0)
    tot = sum(len(w) for w in disp) or 1; t, out = a, []
    for w in disp:
        d = (b - a) * len(w) / tot; out.append({"w": w, "start": round(t, 3), "end": round(t + d, 3)}); t += d
    return out, False


def map_words(display: str, spoken: str, spans: list, voice_name: str, table: dict | None = None) -> tuple[list[dict], bool]:
    """Piper: a caption word can be several spoken words ('1978' -> 'nineteen seventy eight'); the counts come from
    the phonemiser. Returns (words, exact) as map_counts does."""
    from piper import PiperVoice  # noqa: F401  (voice already loaded by the caller)
    v = _VOICES.get(voice_name + "|align")
    counts = []
    for w in display.split():
        sw = pronounce(speak_years(w), table) if spoken != display else w
        ph = v.phonemize(sw) if v else [list(sw)]
        groups = "".join("".join(p) for p in ph)
        counts.append(max(1, len([g for g in re.split(_WORD_SEP, groups) if g])))
    return map_counts(display, counts, spans)


def map_words_elevenlabs(display: str, spoken: str, spans: list, table: dict | None = None) -> tuple[list[dict], bool]:
    """ElevenLabs: spans come from the API's character alignment grouped on the same separators tokens() uses, so a
    caption word's spoken-word count is simply the token count of its spoken form. No phonemiser needed."""
    from pipeline.tts_elevenlabs import tokens
    counts = [max(1, len(tokens(pronounce(speak_years(w), table) if spoken != display else w))) for w in display.split()]
    return map_counts(display, counts, spans)


def load_character(cid: str) -> dict:
    import json
    f = ROOT / "characters" / f"{cid}.json"
    if not f.exists():
        raise ValueError(f"unknown character '{cid}' (no characters/{cid}.json)")
    return json.loads(f.read_text())


def lip_envelope(x: np.ndarray, sr: int, fps: int = 30) -> list:
    hop = sr // fps
    n = len(x) // hop
    if n == 0:
        return []
    r = np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(axis=1))
    ref = np.percentile(r, 95) or 1.0
    return [round(float(v), 3) for v in np.clip(r / ref, 0, 1)]


def _recorded_manifest() -> dict:
    """The owner's imported narration for this build (HW_VOICE_DIR, set by build.py --tts recorded): line text -> clip."""
    import json as _json
    d = Path(os.environ.get("HW_VOICE_DIR", ""))
    f = d / "manifest.json"
    if not f.exists():
        raise RuntimeError(f"--tts recorded: no {f}; run python -m pipeline.voice_import <episode> <recording> first")
    m = _json.loads(f.read_text()); return {"dir": d, "lines": {l["text"]: l for l in m["lines"]}, "raw": f.read_bytes()}


def estimate_words(x: np.ndarray, sr: int, display: str) -> list[dict]:
    """Word timings for a recorded line: the clip's voiced stretches (10 ms RMS above -40 dB, gaps < 60 ms bridged) are
    laid end to end and the caption's words are spread over that voiced time by length. Estimated, not measured."""
    hop = int(0.01 * sr); n = max(1, len(x) // hop)
    db = 20 * np.log10(np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12))
    on = db > -40
    for i in range(1, n - 6):   # bridge gaps shorter than 60 ms
        if not on[i] and on[i - 1] and on[i:i + 6].any():
            j = i
            while j < n and not on[j]:
                j += 1
            if j - i < 6:
                on[i:j] = True
    t_on = np.where(on)[0] / 100.0
    words = display.split()
    if not len(t_on) or not words:
        return [{"w": w, "start": 0.0, "end": round(len(x) / sr, 3)} for w in words]
    wts = np.array([len(re.sub(r"[^A-Za-z0-9]", "", w)) + 1.5 for w in words], float); cum = np.concatenate([[0], np.cumsum(wts)]) / wts.sum()
    idx = lambda f: t_on[min(len(t_on) - 1, int(f * (len(t_on) - 1)))]
    return [{"w": w, "start": round(float(idx(cum[k])), 3), "end": round(float(idx(cum[k + 1])) + 0.01, 3)} for k, w in enumerate(words)]


def _narrate_recorded(text: str) -> tuple[np.ndarray, int]:
    m = _recorded_manifest(); ln = m["lines"].get(text)
    if not ln:
        raise RuntimeError(f"--tts recorded: no recorded take for line {text!r}; re-record it or re-run pipeline.voice_import")
    x, sr = read_wav(m["dir"] / ln["file"])
    x = trim_silence(x, sr, thresh=0.02)
    # a dramatic pause inside a line ("How? ... He phoned staff") is kept but held to 0.35 s: long gaps read as dead air
    hop = int(0.01 * sr); n = len(x) // hop
    if n > 10:
        quiet = 20 * np.log10(np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1)) + 1e-12) < -42
        keep, i = np.ones(len(x), bool), 0
        while i < n:
            if quiet[i]:
                j = i
                while j < n and quiet[j]:
                    j += 1
                if j - i > 45 and i > 0 and j < n:
                    a0 = (i + 17) * hop; a1 = (j - 18) * hop; keep[a0:a1] = False
                i = j
            else:
                i += 1
        x = x[keep]
    peak = float(np.max(np.abs(x))) or 1.0
    return (x / peak * 0.89).astype(np.float32), sr


def narrate_dialogue(scene: dict, narrator_voice: dict | None = None) -> dict:
    """Synthesise each line with its character's voice, join them with pauses into one scene clip,
    and return per-line timing plus a 30 fps mouth-openness envelope for lip sync.
    narrator_voice (episode field 'narrator_profile') replaces the default voice for lines spoken by 'narrator'."""
    parts, lines, t, sr = [], [], 0.0, None
    for ln in scene["lines"]:
        v = narrator_voice if (narrator_voice and ln["who"] == "narrator") else load_character(ln["who"])["voice"]
        spoken = speak_years(ln["text"]) if v.get("year_words") else ln["text"]   # captions keep the digits
        spoken = pronounce(spoken, v.get("pronounce"))                              # and the written names
        prov = provider_of(v)
        if prov == "recorded" and ln["who"] == "narrator":   # the owner's own voice: no synthesis
            x, sr_ = _narrate_recorded(ln["text"]); sr = sr or sr_
            words, exact = estimate_words(x, sr_, ln["text"]), True
            if sr_ != sr:
                x = np.interp(np.linspace(0, len(x) - 1, int(len(x) * sr / sr_)), np.arange(len(x)), x)
            pre = int(ln.get("pause_before", 0.0) * sr)
            if pre:
                parts.append(np.zeros(pre, np.float32)); t += pre / sr
            lines.append({"who": ln["who"], "text": ln["text"], "start": round(t, 3), "end": round(t + len(x) / sr, 3), "env": lip_envelope(x, sr), "words": words, "timing": "estimated_from_recording"})
            parts.append(x.astype(np.float32)); t += len(x) / sr
            gap = int(ln.get("pause_after", 0.3) * sr)
            parts.append(np.zeros(gap, np.float32)); t += gap / sr
            continue
        align = bool(v.get("word_timing")) or prov == "elevenlabs"   # ElevenLabs timings come free with the audio
        p = narrate_scene(v.get("model", ""), spoken, v.get("length_scale", 1.0) * ln.get("speed", 1.0), v.get("speaker"),
                          align=align, profile=v, speed_mult=ln.get("speed", 1.0))
        x, sr_ = read_wav(p); sr = sr or sr_
        words, exact = None, True
        if align:
            import json as _json
            spans = _json.loads(p.with_suffix(".words.json").read_text())
            if prov == "elevenlabs":
                words, exact = map_words_elevenlabs(ln["text"], spoken, spans, v.get("pronounce"))
            else:
                if (v["model"] + "|align") not in _VOICES:   # phonemiser needed for mapping even on a cache hit
                    from piper import PiperVoice
                    from pipeline.voices import voice_path
                    _VOICES[v["model"] + "|align"] = PiperVoice.load(str(voice_path(v["model"])), include_alignments=True)
                words, exact = map_words(ln["text"], spoken, spans, v["model"], v.get("pronounce"))
            if not exact:
                print(f"[narrate] WARNING: word timings for {ln['who']!r} line {ln['text'][:50]!r} are proportional "
                      f"(spoken-word count did not match the {prov} alignment); captions may drift inside this line")
        if ln.get("fx") == "phone":   # small phone speaker: band-limited and slightly crunchy
            X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / sr_)
            X *= ((f > 320) & (f < 3400)).astype(float)
            x = np.tanh(np.fft.irfft(X, n=len(x)) * 2.2) * 0.6
        if sr_ != sr:
            x = np.interp(np.linspace(0, len(x) - 1, int(len(x) * sr / sr_)), np.arange(len(x)), x)
        pre = int(ln.get("pause_before", 0.0) * sr)
        if pre:
            parts.append(np.zeros(pre, np.float32)); t += pre / sr
        lines.append({"who": ln["who"], "text": ln["text"], "start": round(t, 3), "end": round(t + len(x) / sr, 3), "env": lip_envelope(x, sr)}
                     | ({"words": words} if words else {}) | ({} if exact else {"timing": "proportional"}))   # word times are relative to the line start
        parts.append(x.astype(np.float32)); t += len(x) / sr
        gap = int(ln.get("pause_after", 0.3) * sr)
        parts.append(np.zeros(gap, np.float32)); t += gap / sr
    clip = np.concatenate(parts[:-1]) if len(parts) > 1 else parts[0]
    prov = provider_of(narrator_voice)   # the resolved provider (and its voice/model) must separate the joined-clip keys too
    prov_key = [prov] + ([sorted(elevenlabs_config(narrator_voice).items())] if prov == "elevenlabs" else []) + ([hashlib.sha1(_recorded_manifest()["raw"]).hexdigest()] if prov == "recorded" else [])
    key = hashlib.sha1(repr([(l["who"], l["text"]) for l in scene["lines"]] + ([sorted(narrator_voice.items())] if narrator_voice else []) + [ln.get("pause_after", 0.3) for ln in scene["lines"]] + [ln.get("pause_before", 0) for ln in scene["lines"]] + [ln.get("speed", 1.0) for ln in scene["lines"]] + [ln.get("fx", "") for ln in scene["lines"]] + prov_key).encode()).hexdigest()[:16]
    out = CACHE / f"dlg_{key}.wav"
    with wave.open(str(out), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(clip, -1, 1) * 32767).astype(np.int16).tobytes())
    return {"path": str(out), "duration": round(len(clip) / sr, 3), "lines": lines}


def narrate_episode(ep: dict, length_scale: float = 1.0) -> list[dict]:
    """Returns [{scene_id, path, duration, lines?}] in scene order."""
    res = []
    for s in ep["scenes"]:
        if s.get("silent"):
            out = CACHE / "silence_0.1s.wav"
            CACHE.mkdir(parents=True, exist_ok=True)
            if not out.exists():
                with wave.open(str(out), "wb") as w:
                    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(b"\x00\x00" * int(SR * 0.1))
            res.append({"scene_id": s["id"], "path": str(out), "duration": 0.0, "lines": []})
            continue
        if s.get("lines"):
            d = narrate_dialogue(s, ep.get("narrator_profile"))
            res.append({"scene_id": s["id"], **d})
            continue
        p = narrate_scene(ep["narrator_voice"], s["narration"], length_scale, profile={"model": ep["narrator_voice"]})
        x, sr = read_wav(p)
        res.append({"scene_id": s["id"], "path": str(p), "duration": round(len(x) / sr, 3)})
    return res
