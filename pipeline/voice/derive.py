"""Derive a distinct-identity reference clip from a recording: pitch shift and independent formant warp,
done with ffmpeg's rubberband filter (no Python audio dependencies, nothing leaves the machine).

usage: python -m pipeline.voice.derive IN.wav OUT.wav [--pitch -3] [--formant 1.06] [--tempo 0.97] [--start 0] [--length 15] [--report]

The result is meant to be *conditioned on* by a zero-shot engine, which regenerates prosody from text:
the output narrator is therefore "a synthetic voice derived from you", not a processed recording of you.
Limits (see docs): timbre changes are weak against an informed verifier; accent and rhythm survive.
`--report` prints speaker-embedding similarity between source and derived clip (lower = more distinct;
same speaker ≈ 0.9+, unrelated speakers ≈ 0.2-0.5 with the CAM++ model).
"""
from __future__ import annotations
import argparse, subprocess, sys
from pathlib import Path


def derive(src: Path, dst: Path, pitch_semitones: float = -3.0, formant_ratio: float = 1.06, tempo: float = 1.0,
           start: float = 0.0, length: float | None = None, sr: int = 24000) -> Path:
    """formant_ratio > 1 shortens the vocal tract (brighter), < 1 lengthens it (darker). Pitch is shifted
    with formants preserved, then the formants are warped independently via resample + pitch-correct."""
    pitch = 2 ** (pitch_semitones / 12)
    chain = ["highpass=f=60", "afftdn=nf=-30", f"rubberband=pitch={pitch}:formant=preserved:pitchq=quality"]
    if abs(formant_ratio - 1.0) > 1e-3:
        # resampling scales pitch AND formants by the ratio; rubberband then puts the pitch (only) back.
        chain += [f"asetrate={sr * formant_ratio}", f"aresample={sr}", f"atempo={1 / formant_ratio}", f"rubberband=pitch={1 / formant_ratio}:formant=preserved:pitchq=quality"]
    if abs(tempo - 1.0) > 1e-3:
        chain.append(f"rubberband=tempo={tempo}")
    chain += ["loudnorm=I=-20:TP=-2:LRA=9", "aformat=sample_fmts=s16:channel_layouts=mono"]
    cmd = ["ffmpeg", "-v", "error", "-y", "-ss", str(start)] + (["-t", str(length)] if length else []) + ["-i", str(src), "-ar", str(sr), "-ac", "1", "-filter:a", ",".join(chain), str(dst)]
    subprocess.run(cmd, check=True)
    return dst


def similarity(a: Path, b: Path) -> float:
    import numpy as np, soundfile as sf
    from pipeline.voice.validate import speaker_embedding
    embs = []
    for p in (a, b):
        x, sr = sf.read(str(p), dtype="float32")
        if x.ndim > 1:
            x = x[:, 0]
        embs.append(speaker_embedding(x, sr))
    return float(np.dot(embs[0], embs[1]))


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("src"); ap.add_argument("dst")
    ap.add_argument("--pitch", type=float, default=-3.0, help="semitones (negative = lower)")
    ap.add_argument("--formant", type=float, default=1.06, help="formant ratio (1.06 = 6%% brighter, 0.94 = darker)")
    ap.add_argument("--tempo", type=float, default=1.0)
    ap.add_argument("--start", type=float, default=0.0); ap.add_argument("--length", type=float, default=None)
    ap.add_argument("--report", action="store_true", help="print speaker similarity source vs derived")
    a = ap.parse_args(argv)
    out = derive(Path(a.src), Path(a.dst), a.pitch, a.formant, a.tempo, a.start, a.length)
    print(f"[derive] wrote {out.name} (pitch {a.pitch:+.1f} st, formant x{a.formant}, tempo x{a.tempo})")   # never prints the source path
    if a.report:
        print(f"[derive] speaker similarity source vs derived: {similarity(Path(a.src), out):.3f}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
