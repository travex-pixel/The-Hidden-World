"""Download and cache model packages from the k2-fsa/sherpa-onnx GitHub releases (same mirror as Piper voices).

Hugging Face is not reachable from some build environments; everything the default engine needs
comes from GitHub release assets and is cached under .cache/voices/ (restored by actions/cache).
"""
from __future__ import annotations
import tarfile, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
CACHE = ROOT / ".cache" / "voices"
REL = "https://github.com/k2-fsa/sherpa-onnx/releases/download/{tag}/{asset}"

PACKAGES = {
    # name: (release tag, asset, extracted folder or None for single file, licence note)
    "pocket-tts": ("tts-models", "sherpa-onnx-pocket-tts-int8-2026-01-26.tar.bz2", "sherpa-onnx-pocket-tts-int8-2026-01-26",
                   "Kyutai Pocket TTS, code MIT, weights CC-BY-4.0 (attribution: Kyutai). int8 ONNX export."),
    "whisper-tiny-en": ("asr-models", "sherpa-onnx-whisper-tiny.en.tar.bz2", "sherpa-onnx-whisper-tiny.en",
                        "OpenAI Whisper tiny.en, MIT. Used only to check intelligibility of generated narration."),
    "speaker-campplus-en": ("speaker-recongition-models", "3dspeaker_speech_campplus_sv_en_voxceleb_16k.onnx", None,
                            "3D-Speaker CAM++ speaker embedding, Apache-2.0. Used only to check voice consistency."),
}


def model_dir(name: str) -> Path:
    if name not in PACKAGES:
        raise SystemExit(f"[voice] unknown model package {name!r}; known: {sorted(PACKAGES)}")
    tag, asset, folder, _ = PACKAGES[name]
    CACHE.mkdir(parents=True, exist_ok=True)
    target = CACHE / (folder or asset)
    if target.exists():
        return target
    url = REL.format(tag=tag, asset=asset)
    print(f"[voice] downloading {url}")
    tmp = CACHE / (asset + ".part")
    urllib.request.urlretrieve(url, tmp)
    if folder:
        with tarfile.open(tmp, "r:bz2") as tf:
            tf.extractall(CACHE, filter="data")
        tmp.unlink(missing_ok=True)
    else:
        tmp.rename(target)
    if not target.exists():
        raise SystemExit(f"[voice] {asset} did not produce {target}")
    return target


if __name__ == "__main__":
    import sys
    for n in sys.argv[1:] or ["pocket-tts"]:
        print(model_dir(n))
