"""Offline speech-recognition check for narration intelligibility (free; no API).

Setup (one time, ~100 MB, not committed):
  pip install sherpa-onnx
  curl -L -o w.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-tiny.en.tar.bz2
  tar xjf w.tar.bz2 && cp sherpa-onnx-whisper-tiny.en/tiny.en-{encoder,decoder}.onnx sherpa-onnx-whisper-tiny.en/tiny.en-tokens.txt series/true-crime/tools/asr_model/
tiny.en is deliberately small: it under-reports proper names (Azaria, Kaczynski), so a word error rate <= 0.25 is the pass bar."""
from __future__ import annotations
import re, wave
from pathlib import Path
import numpy as np


def _load(p: Path):
    with wave.open(str(p)) as w:
        sr, ch = w.getframerate(), w.getnchannels()
        x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    return (x.reshape(-1, 2).mean(1) if ch == 2 else x), sr


def windows(dur: float, bounds=None, size: float = 25.0) -> list[tuple[float, float]]:
    """Whisper works on <= 30 s windows. Without bounds, fixed 25 s windows; with bounds (scene starts, which sit in
    pauses), windows are packed up to `size` seconds and cut only at those times, so no sentence is split mid-word
    (a fixed cut at 25.0 s made tiny.en drop a whole sentence on Case File 18)."""
    if not bounds:
        return [(a, min(dur, a + size)) for a in np.arange(0, dur, size)]
    edges = sorted({0.0, dur, *[b for b in bounds if 0 < b < dur]}); out = []; a = prev = edges[0]
    for e in edges[1:]:
        if e - a > size and prev > a:
            out.append((a, prev)); a = prev
        prev = e
    out.append((a, prev))
    return [w for a, b in out for w in ([(a, b)] if b - a <= 29 else [(t, min(b, t + size)) for t in np.arange(a, b, size)])]


def transcribe_file(wav: Path, model_dir: Path, bounds=None) -> str:
    import sherpa_onnx
    rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=str(model_dir / "tiny.en-encoder.onnx"), decoder=str(model_dir / "tiny.en-decoder.onnx"),
                                                    tokens=str(model_dir / "tiny.en-tokens.txt"), num_threads=4)
    x, sr = _load(wav); out = []
    for a, b in windows(len(x) / sr, bounds):
        s = rec.create_stream(); s.accept_waveform(sr, x[int(a * sr):int(b * sr)]); rec.decode_stream(s); out.append(s.result.text.strip())
    return " ".join(out)


def norm(t: str) -> list[str]:
    return re.sub(r"[^a-z0-9 ]", " ", t.lower().replace("-", " ")).split()


def wer(ref: str, hyp: str) -> float:
    r, h = norm(ref), norm(hyp); d = list(range(len(h) + 1))
    for i in range(1, len(r) + 1):
        p = d[:]; d[0] = i
        for j in range(1, len(h) + 1):
            d[j] = min(p[j] + 1, d[j - 1] + 1, p[j - 1] + (r[i - 1] != h[j - 1]))
    return d[len(h)] / max(1, len(r))
