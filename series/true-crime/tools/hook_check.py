"""Check, before the long video render, that the speech recogniser hears the hook line as written.

usage: python series/true-crime/tools/hook_check.py <episode-id> [--max-wer 0.2]

Reads out/<id>/timeline.json and out/<id>/mix.wav (both written by `pipeline.build <id> --plan-only`), cuts the first
spoken line out of the mix (narration over music, as the viewer hears it), transcribes it with the offline recogniser
and compares it with the script. The hook decides the skip rate, so a misheard hook (Case File 57: "A boxer sailed"
heard as "At Boxer's sale") should be reworded before 40 minutes of rendering, not after. Exit 1 if the word error
rate is above --max-wer. A respelled word in the pronunciation table (e.g. "Smuggglers") is compared as written in
the script, so a recogniser that cannot spell a proper noun can fail a hook a person hears clearly: listen, then
decide.
"""
from __future__ import annotations
import argparse, json, subprocess, sys, tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
sys.path.insert(0, str(HERE))


def hear(out: Path, line: dict, td: Path) -> tuple[float, str]:
    """Transcribe one narration line from the plan mix (with 0.3 s of room after it) and score it against the script."""
    from asr import transcribe_file, wer, norm
    wav = td / f"line_{line['start']:.2f}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{max(0.0, line['start'] - 0.05):.2f}", "-t", f"{line['end'] - line['start'] + 0.35:.2f}",
                    "-i", str(out / "mix.wav"), "-ac", "1", "-ar", "16000", str(wav)], check=True)
    heard = transcribe_file(wav, HERE / "asr_model")
    # "ex-narcotics" heard as "exnarcotics" is the same sound: compare with word breaks removed before scoring
    w = 0.0 if "".join(norm(line["text"])) == "".join(norm(heard)) else wer(line["text"], heard)
    return w, heard


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("episode"); ap.add_argument("--max-wer", type=float, default=0.2)
    ap.add_argument("--all", action="store_true", help="check every line, not only the hook (Case File 85: 'Oklahoma.' was heard as 'Oakley Home'); "
                                                          "a line fails above --line-wer")
    ap.add_argument("--line-wer", type=float, default=0.34)
    a = ap.parse_args(argv)
    out = ROOT / "out" / a.episode
    tl = json.loads((out / "timeline.json").read_text())
    lines = [ln for sc in tl for ln in sc.get("lines", [])]
    with tempfile.TemporaryDirectory() as td:
        w, heard = hear(out, lines[0], Path(td))
        print(f"{a.episode}: hook {'OK' if w <= a.max_wer else 'MISHEARD'} (WER {w:.2f}, ends {lines[0]['end']:.2f} s)\n  script: {lines[0]['text']}\n  heard:  {heard}")
        bad = w > a.max_wer
        if a.all:
            for ln in lines[1:]:
                lw, lh = hear(out, ln, Path(td))
                flag = "MISHEARD" if lw > a.line_wer else "ok"
                if flag == "MISHEARD":
                    bad = True
                print(f"  [{ln['start']:5.2f}s] {flag:<8} WER {lw:.2f}  script: {ln['text']}" + (f"\n                     heard:  {lh}" if flag == "MISHEARD" else ""))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
