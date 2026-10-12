"""Independent speech check: Whisper tiny.en (sherpa-onnx, MIT/Apache-2.0) listens to every spoken line in the
final mix and reports how much of the script it heard. Adapted from the Fruit Fortunes verifier.

usage: python -m pipeline.asr_check out/<episode>      -> writes out/<episode>/asr.json and prints a summary
A line "passes" when at least 60% of its words (two letters or more) are recognised. Whisper tiny is small and
mishears invented names, so the bar is about intelligibility, not perfection.
"""
from __future__ import annotations
import json, re, sys, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
ASR_DIR = ROOT / ".cache" / "models" / "sherpa-onnx-whisper-tiny.en"
SPELL = {"favour": "favor", "colour": "color", "realised": "realized", "organisation": "organization", "behaviour": "behavior", "mr": "mister"}


def words(s: str) -> list[str]:
    s = s.lower().replace("’", "").replace("'", "").replace("%", " percent")
    return [SPELL.get(w, w) for w in re.sub(r"[^a-z0-9 ]+", " ", s).split()]


def recall(script: str, heard: str) -> float:
    want = [w for w in words(script) if len(w) > 1 or w.isdigit()]
    got = set(words(heard)); joined = "".join(words(heard))
    has = lambda w: w in got or w in joined or (w.endswith("s") and w[:-1] in got) or f"{w}s" in got
    return sum(map(has, want)) / len(want) if want else 1.0


def check(out_dir: Path, wav: Path | None = None) -> dict:
    import sherpa_onnx
    d = str(ASR_DIR / "tiny.en-")
    rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=d + "encoder.int8.onnx", decoder=d + "decoder.int8.onnx",
                                                    tokens=d + "tokens.txt", language="en", task="transcribe", num_threads=4)
    with wave.open(str(wav or out_dir / "mix.wav")) as w:
        sr, ch = w.getframerate(), w.getnchannels()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    x = x.reshape(-1, ch).mean(axis=1) if ch > 1 else x
    x16 = np.interp(np.arange(0, len(x), sr / 16000), np.arange(len(x)), x).astype(np.float32)
    tl = json.loads((out_dir / "timeline.json").read_text())
    rows = []
    for s in tl:
        for ln in s.get("lines", []):
            a, b = max(0, ln["start"] - 0.15), ln["end"] + 0.3
            st = rec.create_stream(); st.accept_waveform(16000, x16[int(a * 16000): int(b * 16000)]); rec.decode_stream(st)
            heard = st.result.text.strip()
            rows.append({"scene": s["id"], "who": ln["who"], "text": ln["text"], "heard": heard, "recall": round(recall(ln["text"], heard), 3)})
    r = np.array([row["recall"] for row in rows]) if rows else np.array([1.0])
    by = {}
    for row in rows:
        by.setdefault(row["who"], []).append(row["recall"])
    rep = {"lines": len(rows), "mean_recall": round(float(r.mean()), 3), "median_recall": round(float(np.median(r)), 3),
           "lines_below_0_6": int((r < 0.6).sum()), "by_speaker": {k: round(float(np.mean(v)), 3) for k, v in by.items()},
           "worst": sorted(rows, key=lambda q: q["recall"])[:5], "rows": rows}
    rep["passed"] = rep["mean_recall"] >= 0.85 and rep["lines_below_0_6"] <= max(1, len(rows) // 25)
    (out_dir / "asr.json").write_text(json.dumps(rep, indent=1, ensure_ascii=False))
    return rep


if __name__ == "__main__":
    rep = check(Path(sys.argv[1]))
    print(json.dumps({k: v for k, v in rep.items() if k not in ("rows",)}, indent=1, ensure_ascii=False))
