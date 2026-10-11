"""Documentary narrator voices (documentary-only; the Shorts keep using pipeline/narrate.py unchanged).

Engine 'kokoro': Kokoro-82M v1.0 through sherpa-onnx, offline, no account or API key. Weights Apache-2.0 (LICENSE in
the k2-fsa/sherpa-onnx 'tts-models' release archive). Fetch once with `python -m documentary.voice fetch`.
Every sentence is synthesised separately (cached by a hash of model, voice, speed and text) so sentence timings are
exact for captions, and each one goes through the same voice chain so loudness and tone stay consistent across
chunks: high-pass, low-mid cut, gentle presence lift, de-esser, light compression, then level matching."""
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
CACHE = ROOT / ".cache" / "narration-v2"
LICENCES = {"kokoro-v1.0": "Kokoro-82M v1.0 weights: Apache-2.0 (LICENSE in the sherpa-onnx release archive)"}
SPEAKERS = ("af_alloy,af_aoede,af_bella,af_heart,af_jessica,af_kore,af_nicole,af_nova,af_river,af_sarah,af_sky,am_adam,am_echo,am_eric,"
            "am_fenrir,am_liam,am_michael,am_onyx,am_puck,am_santa,bf_alice,bf_emma,bf_isabella,bf_lily,bm_daniel,bm_fable,bm_george,bm_lewis").split(",")

# the voice chain (ffmpeg filters): applied to every sentence identically. De-esser strength is per voice, tuned so the
# 5-9 kHz band of normal narration sits near -17 to -20 dB of the voice's energy (bm_fable is naturally bright).
DEESS = {"bm_fable": 0.45}


def chain(voice: str) -> str:
    return ("highpass=f=75,equalizer=f=260:t=q:w=1.1:g=-2.5,equalizer=f=3600:t=q:w=1.2:g=1.5,"
            f"deesser=i={DEESS.get(voice, 0.35)}:m=0.5:f=0.5,acompressor=threshold=-20dB:ratio=2.2:attack=10:release=140:makeup=1")
TARGET_RMS_DB = -20.0   # speech-active RMS each sentence is matched to (before the final two-pass loudnorm of the mix)

_TTS = {}


def fetch() -> Path:
    if (KOKORO / "model.onnx").exists():
        return KOKORO
    dl = KOKORO.parent; dl.mkdir(parents=True, exist_ok=True)
    tmp = dl / "kokoro.tar.bz2"
    print(f"[voice] downloading {KOKORO_URL}")
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
    return (y * min(1.0, 0.7 / peak)).astype(np.float32)   # headroom so the mix limiter never touches the voice


def say(text: str, voice: str, speed: float = 1.0) -> Path:
    """One sentence in the narrator voice, processed; cached."""
    CACHE.mkdir(parents=True, exist_ok=True)
    key = hashlib.sha1(f"kokoro-v1.0|{voice}|{speed:.3f}|{chain(voice)}|{TARGET_RMS_DB}|{text}".encode()).hexdigest()[:16]
    out = CACHE / f"k_{key}.wav"
    if out.exists():
        return out
    sid = SPEAKERS.index(voice)
    tts = _tts("lexicon-gb-en.txt" if voice.startswith("b") else "lexicon-us-en.txt")
    a = tts.generate(text, sid=sid, speed=speed)
    x = trim(np.array(a.samples, dtype=np.float32), a.sample_rate)
    write_wav(out, process(x, a.sample_rate, voice), a.sample_rate)
    return out


if __name__ == "__main__":
    if sys.argv[1:2] == ["fetch"]:
        print(fetch())
    else:
        print(say(" ".join(sys.argv[3:]) or "This is a test of the documentary narrator.", sys.argv[1] if len(sys.argv) > 1 else "am_michael",
                  float(sys.argv[2]) if len(sys.argv) > 2 else 1.0))
