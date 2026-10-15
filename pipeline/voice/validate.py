"""Audio validation for generated narration: intelligibility (Whisper round-trip) and voice consistency
(speaker-embedding similarity to the profile's reference). Both models run on CPU via sherpa-onnx and
are downloaded from the GitHub release mirror on first use. Thresholds live in the profile's
"validation" block so they can be tuned per voice.

Calibration (CAM++ on 24 kHz synthetic clips, measured): same natural speaker, two halves of one
recording = 0.96; a *different* female Piper voice vs the reference = 0.53; Pocket TTS clips of the
reference = 0.46-0.63 each, 0.72 for all of them concatenated. So speaker_sim vs the reference is a
drift detector, not a fidelity score; listening decides fidelity, and the episode-level
"consistency_vs_centroid" in voice_report.json is the number that matters for a finished video."""
from __future__ import annotations
import json
from pathlib import Path
import numpy as np

_ASR = None
_SPK = None
_REF_EMB: dict = {}


def _to16k(x: np.ndarray, sr: int) -> np.ndarray:
    if sr == 16000:
        return x
    n = int(len(x) * 16000 / sr)
    return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)


def transcribe(x: np.ndarray, sr: int) -> str:
    global _ASR
    import sherpa_onnx
    from pipeline.voice.models import model_dir
    if _ASR is None:
        d = model_dir("whisper-tiny-en")
        _ASR = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=str(d / "tiny.en-encoder.int8.onnx"), decoder=str(d / "tiny.en-decoder.int8.onnx"),
                                                         tokens=str(d / "tiny.en-tokens.txt"), num_threads=2)
    text = []
    x16 = _to16k(x, sr)
    for i in range(0, len(x16), 16000 * 28):   # whisper window is 30 s
        st = _ASR.create_stream(); st.accept_waveform(16000, x16[i:i + 16000 * 28]); _ASR.decode_stream(st)
        text.append(st.result.text)
    return " ".join(text)


def speaker_embedding(x: np.ndarray, sr: int) -> np.ndarray:
    global _SPK
    import sherpa_onnx
    from pipeline.voice.models import model_dir
    if _SPK is None:
        cfg = sherpa_onnx.SpeakerEmbeddingExtractorConfig(model=str(model_dir("speaker-campplus-en")), num_threads=2, provider="cpu")
        _SPK = sherpa_onnx.SpeakerEmbeddingExtractor(cfg)
    st = _SPK.create_stream(); st.accept_waveform(16000, _to16k(x, sr)); st.input_finished()
    e = np.array(_SPK.compute(st), np.float32)
    return e / (np.linalg.norm(e) or 1.0)


def reference_embedding(profile: dict) -> np.ndarray:
    key = profile["_dir"] + profile["reference"]
    if key not in _REF_EMB:
        import soundfile as sf
        from pipeline.voice.profiles import reference_path
        a, sr = sf.read(str(reference_path(profile)), dtype="float32")
        if a.ndim > 1:
            a = a[:, 0]
        _REF_EMB[key] = speaker_embedding(a, sr)
    return _REF_EMB[key]


def check(x: np.ndarray, sr: int, text: str, profile: dict, val: dict) -> dict:
    from pipeline.voice.text import normalize_for_wer, wer
    rep: dict = {"ok": True, "score": 0.0}
    if val.get("asr", True):
        hyp = transcribe(x, sr)
        w = wer(normalize_for_wer(text), normalize_for_wer(hyp))
        rep.update({"wer": round(w, 3), "asr": hyp})
        rep["ok"] &= w <= float(val.get("max_wer", 0.08))
        rep["score"] -= w
    if val.get("speaker", True):
        emb = speaker_embedding(x, sr)
        sim = float(np.dot(emb, reference_embedding(profile)))
        rep["speaker_sim"] = round(sim, 3)
        rep["embedding"] = [round(float(v), 5) for v in emb]
        rep["ok"] &= sim >= float(val.get("min_speaker_sim", 0.55))
        rep["score"] += 0.5 * sim
    rep["ok"] = bool(rep["ok"])
    return rep
