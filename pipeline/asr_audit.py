"""Transcribe every spoken line in a finished history episode with an offline recogniser and compare it with the
script, line by line (a port of the true-crime series' ASR audit). Reads the MP4; never modifies it.

usage: python -m pipeline.asr_audit out/<episode-id>          (writes out/<id>/qa/asr_audit.json)
Model: sherpa-onnx Moonshine base (MIT), fetched once into .cache/asr. A mismatch is a lead for a human listen,
not proof of a narration defect: recognisers also stumble on old words (quern, reeve) and names."""
from __future__ import annotations

import json
import re
import subprocess
import sys
import tarfile
import urllib.request
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
MODEL = ROOT / ".cache" / "asr" / "sherpa-onnx-moonshine-base-en-int8"
URL = "https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-moonshine-base-en-int8.tar.bz2"


def fetch() -> Path:
    if (MODEL / "tokens.txt").exists():
        return MODEL
    MODEL.parent.mkdir(parents=True, exist_ok=True); tmp = MODEL.parent / "m.tar.bz2"
    urllib.request.urlretrieve(URL, tmp)
    with tarfile.open(tmp, "r:bz2") as tf:
        tf.extractall(MODEL.parent, filter="data")
    tmp.unlink(missing_ok=True)
    return MODEL


def norm(text: str) -> list[str]:
    t = text.lower().replace("’", "'").replace("-", " ")
    t = re.sub(r"[^a-z0-9' ]+", " ", t)
    return [w.strip("'") for w in t.split() if w.strip("'")]


def wer(ref: list[str], hyp: list[str]) -> tuple[float, list[tuple[str, str]]]:
    n, m = len(ref), len(hyp)
    d = np.zeros((n + 1, m + 1), int); d[:, 0] = range(n + 1); d[0, :] = range(m + 1)
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            d[i, j] = min(d[i - 1, j] + 1, d[i, j - 1] + 1, d[i - 1, j - 1] + (ref[i - 1] != hyp[j - 1]))
    i, j, diffs = n, m, []
    while i > 0 or j > 0:
        if i > 0 and j > 0 and d[i, j] == d[i - 1, j - 1] + (ref[i - 1] != hyp[j - 1]):
            if ref[i - 1] != hyp[j - 1]:
                diffs.append((ref[i - 1], hyp[j - 1]))
            i, j = i - 1, j - 1
        elif i > 0 and d[i, j] == d[i - 1, j] + 1:
            diffs.append((ref[i - 1], "∅")); i -= 1
        else:
            diffs.append(("∅", hyp[j - 1])); j -= 1
    return d[n, m] / max(1, n), diffs[::-1]


def audit(out_dir: Path) -> dict:
    import sherpa_onnx
    from pipeline.narrate import tts_text
    md = fetch()
    rec = sherpa_onnx.OfflineRecognizer.from_moonshine(
        preprocessor=str(md / "preprocess.onnx"), encoder=str(md / "encode.int8.onnx"),
        uncached_decoder=str(md / "uncached_decode.int8.onnx"), cached_decoder=str(md / "cached_decode.int8.onnx"),
        tokens=str(md / "tokens.txt"), num_threads=4)
    plan = json.loads((out_dir / "plan.json").read_text()); ep = plan["episode"]
    mp4 = out_dir / f"{ep['id']}.mp4"
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(mp4), "-vn", "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                         capture_output=True, check=True).stdout
    audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768.0
    sr = 16000; rows = []
    for s in plan["timeline"]:
        for ln in s.get("lines", []):
            a, b = int(max(0, ln["start"] - 0.15) * sr), int((ln["end"] + 0.2) * sr)
            st = rec.create_stream(); st.accept_waveform(sr, audio[a:b]); rec.decode_stream(st)
            hyp = st.result.text.strip()
            # the written line and the respelt line the voice actually read; the closer one counts
            (e, diffs), ref = min((wer(norm(r), norm(hyp)), r) for r in {ln["text"], tts_text(ep, ln["text"])})
            rows.append({"scene": s["id"], "who": ln["who"], "t": ln["start"], "script": ln["text"], "asr": hyp, "wer": round(e, 3), "diffs": diffs})
    n_ref = sum(len(norm(r["script"])) for r in rows)
    rep = {"tool": "sherpa-onnx Moonshine base (offline ASR) on the MP4's own audio track", "lines": len(rows),
           "corpus_wer": round(sum(r["wer"] * len(norm(r["script"])) for r in rows) / max(1, n_ref), 3),
           "lines_over_25pct": [r for r in rows if r["wer"] > 0.25], "rows": rows,
           "note": "ASR mistakes are expected on old words and names; a mismatch is a lead for a human listen, not proof of a defect."}
    (out_dir / "qa").mkdir(exist_ok=True)
    (out_dir / "qa" / "asr_audit.json").write_text(json.dumps(rep, indent=1, ensure_ascii=False))
    return rep


if __name__ == "__main__":
    r = audit(Path(sys.argv[1]))
    print(json.dumps({k: r[k] for k in ("lines", "corpus_wer")} | {"lines_over_25pct": [(x["script"], x["asr"]) for x in r["lines_over_25pct"]]}, indent=1))
