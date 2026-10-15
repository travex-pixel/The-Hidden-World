"""Kyutai Pocket TTS (100M) through sherpa-onnx on CPU. Zero-shot: the voice is whatever reference clip the profile points at.

Measured on a 4-vCPU runner-class machine: RTF 0.54 with 2 threads (4 threads was slower). Output 24 kHz mono.
"""
from __future__ import annotations
import numpy as np


class Engine:
    def __init__(self, profile: dict):
        import sherpa_onnx, soundfile as sf
        from pipeline.voice.models import model_dir
        from pipeline.voice.profiles import reference_path
        d = model_dir(profile.get("model", "pocket-tts"))
        p = profile.get("params", {})
        cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
            pocket=sherpa_onnx.OfflineTtsPocketModelConfig(
                lm_flow=str(d / "lm_flow.int8.onnx"), lm_main=str(d / "lm_main.int8.onnx"), encoder=str(d / "encoder.onnx"),
                decoder=str(d / "decoder.int8.onnx"), text_conditioner=str(d / "text_conditioner.onnx"),
                vocab_json=str(d / "vocab.json"), token_scores_json=str(d / "token_scores.json")),
            num_threads=int(p.get("threads", 2)), provider="cpu", debug=False))
        if not cfg.validate():
            raise SystemExit("[voice] pocket-tts model files missing or invalid")
        self.tts = sherpa_onnx.OfflineTts(cfg)
        ref = reference_path(profile)
        if not ref.exists():
            raise SystemExit(f"[voice] reference clip not found for profile {profile['name']!r} (is the vault mounted?)")
        a, sr = sf.read(str(ref), dtype="float32")
        if a.ndim > 1:
            a = a[:, 0]
        max_s = float(p.get("reference_seconds", 15.0))
        self.ref, self.ref_sr = a[: int(max_s * sr)], sr
        self.steps = int(p.get("num_steps", 5))
        self.sherpa = sherpa_onnx

    def generate(self, text: str, speed: float = 1.0):
        gc = self.sherpa.GenerationConfig()
        gc.reference_audio = self.ref; gc.reference_sample_rate = self.ref_sr; gc.num_steps = self.steps
        a = self.tts.generate(text, gc)
        x = np.asarray(a.samples, np.float32)
        if abs(speed - 1.0) > 0.02 and len(x):
            x = _atempo(x, a.sample_rate, speed)   # sherpa-onnx's speed option is ignored by Pocket TTS (measured); time-stretch instead
        return x, a.sample_rate


def _atempo(x: np.ndarray, sr: int, speed: float) -> np.ndarray:
    import subprocess
    raw = (np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes()
    r = subprocess.run(["ffmpeg", "-v", "error", "-f", "s16le", "-ar", str(sr), "-ac", "1", "-i", "pipe:0", "-filter:a", f"atempo={min(max(speed, 0.5), 2.0)}",
                        "-f", "s16le", "pipe:1"], input=raw, capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.int16).astype(np.float32) / 32768.0
