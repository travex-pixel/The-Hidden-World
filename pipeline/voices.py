"""Download and cache Piper voices from the sherpa-onnx GitHub release mirror.

Hugging Face is not reachable from some build environments; the k2-fsa/sherpa-onnx
"tts-models" release re-hosts the official Piper voices with their MODEL_CARD.
"""
from __future__ import annotations
import os, sys, tarfile, urllib.request, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / ".cache" / "voices"
RELEASE = "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-{name}.tar.bz2"

# Voices whose dataset licences permit commercial use (checked from MODEL_CARD files).
APPROVED = {
    "en_GB-alba-medium": "Dataset CC BY 4.0 (Edinburgh DataShare); Piper MIT",
    "en_US-ljspeech-high": "Dataset public domain (LJ Speech); Piper MIT",
    "en_GB-aru-medium": "Dataset CC BY 4.0 (Liverpool ARU); Piper MIT",
    "en_US-libritts_r-medium": "Dataset CC BY 4.0 (LibriTTS-R); Piper MIT",
}


def voice_path(name: str) -> Path:
    if name not in APPROVED:
        raise SystemExit(f"Voice {name!r} is not in the approved (commercially usable) list: {sorted(APPROVED)}")
    d = CACHE / f"vits-piper-{name}"
    onnx = d / f"{name}.onnx"
    if onnx.exists() and (d / f"{name}.onnx.json").exists():
        return onnx
    CACHE.mkdir(parents=True, exist_ok=True)
    url = RELEASE.format(name=name)
    tmp = CACHE / f"{name}.tar.bz2"
    print(f"[voices] downloading {url}")
    urllib.request.urlretrieve(url, tmp)
    with tarfile.open(tmp, "r:bz2") as tf:
        tf.extractall(CACHE, filter="data")
    tmp.unlink(missing_ok=True)
    if not onnx.exists():
        raise SystemExit(f"[voices] archive did not contain {onnx}")
    return onnx


if __name__ == "__main__":
    print(voice_path(sys.argv[1] if len(sys.argv) > 1 else "en_GB-alba-medium"))
