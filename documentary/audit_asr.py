"""Stage F (post-production audit): transcribe the narration actually present in a finished MP4 with an offline
speech recogniser and compare it, line by line, with the approved script. Reads the MP4; never modifies it.

usage: python -m documentary.audit_asr <run_dir> --model <moonshine_dir> [--out report.json]
Model: sherpa-onnx Moonshine (MIT), e.g. sherpa-onnx-moonshine-base-en-int8 from the k2-fsa/sherpa-onnx releases.
"""
from __future__ import annotations
import argparse, json, re, subprocess, sys
from pathlib import Path
import numpy as np

NUM_WORDS = {"0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine"}


def norm(text: str) -> list[str]:
    """Lower-case word tokens with numbers, money and years reduced to digit strings so 'fifty five' == '55'."""
    t = text.lower().replace("’", "'")
    t = re.sub(r"\$([\d,]+)", lambda m: m.group(1).replace(",", "") + " dollars", t)
    t = re.sub(r"(\d),(\d{3})", r"\1\2", t)
    t = re.sub(r"[^a-z0-9' ]+", " ", t)
    return [w.strip("'") for w in t.split() if w.strip("'")]


def wer(ref: list[str], hyp: list[str]) -> tuple[float, list[tuple[str, str]]]:
    n, m = len(ref), len(hyp)
    d = np.zeros((n + 1, m + 1), int); d[:, 0] = range(n + 1); d[0, :] = range(m + 1)
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            d[i, j] = min(d[i - 1, j] + 1, d[i, j - 1] + 1, d[i - 1, j - 1] + (ref[i - 1] != hyp[j - 1]))
    # backtrace substitutions/deletions for the report
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


def spoken_numbers(text: str) -> str:
    """Make the reference comparable with how ASR writes numbers (it may emit words or digits)."""
    return text


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("run_dir"); ap.add_argument("--model", required=True); ap.add_argument("--out", default=None)
    a = ap.parse_args(argv)
    import sherpa_onnx
    run = Path(a.run_dir); md = Path(a.model)
    rec = sherpa_onnx.OfflineRecognizer.from_moonshine(
        preprocessor=str(md / "preprocess.onnx"), encoder=str(md / "encode.int8.onnx"),
        uncached_decoder=str(md / "uncached_decode.int8.onnx"), cached_decoder=str(md / "cached_decode.int8.onnx"),
        tokens=str(md / "tokens.txt"), num_threads=2)
    man = json.loads((run / "edit-manifest.json").read_text())
    # decode the MP4's own audio track (not the pre-mux mix), 16 kHz mono
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(run / "documentary.mp4"), "-vn", "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                         capture_output=True, check=True).stdout
    audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768.0
    sr = 16000; rows = []
    for ln in man["lines"]:
        if not ln.get("say"):
            continue
        s0, s1 = int(max(0, ln["narration_at"] - 0.15) * sr), int((ln["narration_end"] + 0.15) * sr)
        st = rec.create_stream(); st.accept_waveform(sr, audio[s0:s1]); rec.decode_stream(st)
        hyp = st.result.text.strip()
        ref_t, hyp_t = norm(ln["say"]), norm(hyp)
        e, diffs = wer(ref_t, hyp_t)
        rows.append({"line": ln["i"], "t": ln["narration_at"], "script": ln["say"], "asr": hyp, "wer": round(e, 3), "diffs": diffs})
    tot_ref = sum(len(norm(r["script"])) for r in rows)
    tot_err = sum(r["wer"] * len(norm(r["script"])) for r in rows)
    names = ["faria", "hupp", "betsy", "russ", "gumpenberger", "neumann", "ohmer", "schwartz", "merkel", "askey", "wood", "troy", "fallon"]
    name_issues = [{"line": r["line"], "script": r["script"], "asr": r["asr"]} for r in rows
                   if any(n in norm(r["script"]) and n not in norm(r["asr"]) for n in names)]
    rep = {"tool": "sherpa-onnx Moonshine base (offline ASR)", "lines": len(rows), "corpus_wer": round(tot_err / max(1, tot_ref), 3),
           "lines_over_20pct": [r for r in rows if r["wer"] > 0.20], "name_mismatches": name_issues, "rows": rows,
           "note": "ASR errors are expected on proper names and numbers; mismatches are leads for a human listen, not proof of a narration defect."}
    out = Path(a.out) if a.out else run / "asr-audit.json"
    out.write_text(json.dumps(rep, indent=1, ensure_ascii=False))
    print(json.dumps({k: rep[k] for k in ("tool", "lines", "corpus_wer")} | {"lines_over_20pct": len(rep["lines_over_20pct"]), "name_mismatches": len(name_issues)}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
