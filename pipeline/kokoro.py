"""Kokoro narrator and character voices (history profile, opt-in per episode with "voice_engine": "kokoro").

The same engine, voice chain and level matching as the true-crime documentary series (branch
claude/true-crime-documentary-vwz6m8, documentary/voice.py), so the channels share a sound:
Kokoro-82M v1.0 through sherpa-onnx, offline, no account or API key. Weights Apache-2.0 (LICENSE in the
k2-fsa/sherpa-onnx 'tts-models' release archive). Fetch once with `python -m pipeline.kokoro fetch`.

Every sentence is synthesised separately (cached by a hash of voice, speed, chain and text) and goes through the
same chain: high-pass, low-mid cut, gentle presence lift, de-esser, light compression, then level matching to a
speech-active RMS, with headroom so the mix limiter never touches the voice."""
from __future__ import annotations

import hashlib
import subprocess
import sys
import tarfile
import urllib.request
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
KOKORO = ROOT / ".cache" / "voices" / "kokoro-dl" / "kokoro-multi-lang-v1_0"
KOKORO_URL = "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-multi-lang-v1_0.tar.bz2"
CACHE = ROOT / ".cache" / "narration-kokoro"
LICENCE = "Kokoro-82M v1.0 weights: Apache-2.0 (LICENSE in the sherpa-onnx release archive); sherpa-onnx Apache-2.0"
SPEAKERS = ("af_alloy,af_aoede,af_bella,af_heart,af_jessica,af_kore,af_nicole,af_nova,af_river,af_sarah,af_sky,am_adam,am_echo,am_eric,"
            "am_fenrir,am_liam,am_michael,am_onyx,am_puck,am_santa,bf_alice,bf_emma,bf_isabella,bf_lily,bm_daniel,bm_fable,bm_george,bm_lewis").split(",")
DEESS = {"bm_fable": 0.45}   # bm_fable is naturally bright
TARGET_RMS_DB = -20.0

# Delivery presets (same values as the documentary series): speed multiplier, pause between sentences, a beat
# before the line, rest after it. A line picks one with "tone"; explicit pause_before/pause_after still win.
DELIVERY = {
    "hook":       {"speed": 1.00, "gap": 0.30, "pre": 0.00, "after": 0.32},
    "curious":    {"speed": 0.97, "gap": 0.36, "pre": 0.00, "after": 0.38},
    "confident":  {"speed": 1.00, "gap": 0.30, "pre": 0.00, "after": 0.30},
    "tense":      {"speed": 0.95, "gap": 0.40, "pre": 0.05, "after": 0.42},
    "reveal":     {"speed": 0.94, "gap": 0.48, "pre": 0.45, "after": 0.58},
    "reflective": {"speed": 0.91, "gap": 0.50, "pre": 0.10, "after": 0.70},
    "resolve":    {"speed": 0.93, "gap": 0.46, "pre": 0.10, "after": 0.60},
    "playful":    {"speed": 1.02, "gap": 0.28, "pre": 0.00, "after": 0.30},
}
TONES = set(DELIVERY)

_TTS = {}


def chain(voice: str) -> str:
    return ("highpass=f=75,equalizer=f=260:t=q:w=1.1:g=-2.5,equalizer=f=3600:t=q:w=1.2:g=1.5,"
            f"deesser=i={DEESS.get(voice, 0.35)}:m=0.5:f=0.5,acompressor=threshold=-20dB:ratio=2.2:attack=10:release=140:makeup=1")


def fetch() -> Path:
    if (KOKORO / "model.onnx").exists():
        return KOKORO
    dl = KOKORO.parent; dl.mkdir(parents=True, exist_ok=True)
    tmp = dl / "kokoro.tar.bz2"
    print(f"[kokoro] downloading {KOKORO_URL}")
    urllib.request.urlretrieve(KOKORO_URL, tmp)
    with tarfile.open(tmp, "r:bz2") as tf:
        tf.extractall(dl, filter="data")
    tmp.unlink(missing_ok=True)
    return KOKORO


def _tts(lexicon: str):
    if lexicon not in _TTS:
        import sherpa_onnx
        fetch()
        cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
            kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(model=str(KOKORO / "model.onnx"), voices=str(KOKORO / "voices.bin"),
                                                           tokens=str(KOKORO / "tokens.txt"), data_dir=str(KOKORO / "espeak-ng-data"),
                                                           dict_dir=str(KOKORO / "dict"), lexicon=str(KOKORO / lexicon)),
            num_threads=4, provider="cpu"), max_num_sentences=1)
        _TTS[lexicon] = sherpa_onnx.OfflineTts(cfg)
    return _TTS[lexicon]


def read_wav(p: Path) -> tuple[np.ndarray, int]:
    with wave.open(str(p)) as w:
        sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
    return x, sr


def write_wav(p: Path, x: np.ndarray, sr: int) -> None:
    with wave.open(str(p), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


def trim(x: np.ndarray, sr: int, thresh: float = 0.006, keep: float = 0.05) -> np.ndarray:
    idx = np.where(np.abs(x) > thresh)[0]
    if not len(idx):
        return x
    return x[max(0, idx[0] - int(keep * sr)): min(len(x), idx[-1] + int(keep * sr * 2))]


def active_rms_db(x: np.ndarray, sr: int) -> float:
    hop = max(1, int(sr * 0.02)); fr = x[: len(x) // hop * hop].reshape(-1, hop)
    r = np.sqrt((fr ** 2).mean(axis=1)); act = r[r > 0.1 * (np.percentile(r, 95) or 1e-9)]
    return float(20 * np.log10(np.sqrt((act ** 2).mean()) or 1e-9)) if len(act) else -90.0


def process(x: np.ndarray, sr: int, voice: str = "") -> np.ndarray:
    """Voice chain + level match. Pads with silence so the compressor and de-esser settle before the first word."""
    pad = np.zeros(int(0.25 * sr), np.float32)
    raw = np.concatenate([pad, x, pad]).astype(np.float32)
    r = subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(sr), "-ac", "1", "-i", "-", "-af", chain(voice), "-f", "f32le", "-"],
                       input=raw.tobytes(), capture_output=True, check=True)
    y = np.frombuffer(r.stdout, dtype=np.float32)[len(pad): len(pad) + len(x)]
    y = y * 10 ** ((TARGET_RMS_DB - active_rms_db(y, sr)) / 20)
    peak = float(np.max(np.abs(y))) or 1.0
    return (y * min(1.0, 0.7 / peak)).astype(np.float32)


def say(text: str, voice: str, speed: float = 1.0) -> Path:
    """One sentence in a Kokoro voice, processed; cached."""
    if voice not in SPEAKERS:
        raise ValueError(f"unknown Kokoro voice {voice!r}")
    CACHE.mkdir(parents=True, exist_ok=True)
    key = hashlib.sha1(f"kokoro-v1.0|{voice}|{speed:.3f}|{chain(voice)}|{TARGET_RMS_DB}|{text}".encode()).hexdigest()[:16]
    out = CACHE / f"k_{key}.wav"
    if out.exists():
        return out
    tts = _tts("lexicon-gb-en.txt" if voice.startswith("b") else "lexicon-us-en.txt")
    a = tts.generate(text, sid=SPEAKERS.index(voice), speed=speed)
    x = trim(np.array(a.samples, dtype=np.float32), a.sample_rate)
    write_wav(out, process(x, a.sample_rate, voice), a.sample_rate)
    return out


def jitter(key: str, amount: float) -> float:
    """Deterministic +/- variation so pauses never repeat to the millisecond (same text -> same timing)."""
    return (int(hashlib.md5(key.encode()).hexdigest()[:6], 16) / 0xFFFFFF - 0.5) * 2 * amount


if __name__ == "__main__":
    if sys.argv[1:2] == ["fetch"]:
        print(fetch())
    else:
        print(say(" ".join(sys.argv[3:]) or "You wake up in a medieval village.", sys.argv[1] if len(sys.argv) > 1 else "bm_fable",
                  float(sys.argv[2]) if len(sys.argv) > 2 else 1.0))
