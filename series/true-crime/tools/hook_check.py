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


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("episode"); ap.add_argument("--max-wer", type=float, default=0.2)
    a = ap.parse_args(argv)
    out = ROOT / "out" / a.episode
    tl = json.loads((out / "timeline.json").read_text())
    line = next(ln for sc in tl for ln in sc.get("lines", []))
    from asr import transcribe_file, wer
    with tempfile.TemporaryDirectory() as td:
        wav = Path(td) / "hook.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "0", "-t", f"{line['end'] + 0.3:.2f}", "-i", str(out / "mix.wav"),
                        "-ac", "1", "-ar", "16000", str(wav)], check=True)
        heard = transcribe_file(wav, HERE / "asr_model")
    from asr import norm
    # "ex-narcotics" heard as "exnarcotics" is the same sound: compare with word breaks removed before scoring
    w = 0.0 if "".join(norm(line["text"])) == "".join(norm(heard)) else wer(line["text"], heard)
    print(f"{a.episode}: hook {'OK' if w <= a.max_wer else 'MISHEARD'} (WER {w:.2f}, ends {line['end']:.2f} s)\n  script: {line['text']}\n  heard:  {heard}")
    return 0 if w <= a.max_wer else 1


if __name__ == "__main__":
    sys.exit(main())
