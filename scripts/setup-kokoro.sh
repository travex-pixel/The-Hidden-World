#!/usr/bin/env bash
# Voice engine v2: installs the free, offline speech tools and downloads the models into .cache/models
# (about 470 MB, downloaded once and git-ignored).
#   Kokoro-82M v1.0 (Apache-2.0 weights), via kokoro-onnx: character voices
#   Whisper tiny.en (MIT), via sherpa-onnx: speech check of the final mix (pipeline/asr_check.py)
set -euo pipefail
cd "$(dirname "$0")/.."
M=.cache/models
mkdir -p "$M"
python3 -m pip install -q -r requirements.txt
get() { [ -s "$M/$2" ] || { echo "downloading $2"; curl -fsSL --retry 3 -o "$M/$2.part" "$1" && mv "$M/$2.part" "$M/$2"; }; }
get https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx kokoro-v1.0.onnx
get https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin voices-v1.0.bin
if [ ! -d "$M/sherpa-onnx-whisper-tiny.en" ]; then
  get https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-tiny.en.tar.bz2 whisper.tar.bz2
  tar xjf "$M/whisper.tar.bz2" -C "$M" && rm "$M/whisper.tar.bz2"
fi
echo "voice engine v2 ready"
