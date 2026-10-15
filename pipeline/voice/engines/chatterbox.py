"""Resemble AI Chatterbox-Turbo (350M, MIT) — the optional quality tier. EXPERIMENTAL: not exercised by CI yet.

Requires `pip install git+https://github.com/resemble-ai/chatterbox` (PyTorch; weights from Hugging Face,
which some environments cannot reach) and is 5-15x slower than real time on a 4-vCPU runner (estimate),
i.e. minutes per 60-second episode. Every output carries Resemble's Perth watermark.
"""
from __future__ import annotations
import numpy as np


class Engine:
    def __init__(self, profile: dict):
        from pipeline.voice.profiles import reference_path
        try:
            from chatterbox.tts_turbo import ChatterboxTurboTTS
        except ImportError as e:
            raise SystemExit("[voice] chatterbox engine needs: pip install git+https://github.com/resemble-ai/chatterbox") from e
        p = profile.get("params", {})
        self.model = ChatterboxTurboTTS.from_pretrained(device=p.get("device", "cpu"), nano=bool(p.get("nano", False)))
        self.ref = str(reference_path(profile))

    def generate(self, text: str, speed: float = 1.0):
        wav = self.model.generate(text, audio_prompt_path=self.ref)
        x = wav.squeeze().cpu().numpy().astype(np.float32)
        if abs(speed - 1.0) > 0.02:
            from pipeline.voice.engines.pocket import _atempo
            x = _atempo(x, self.model.sr, speed)
        return x, self.model.sr
