"""Render one labelled still per scene (at ~60% through it) into a review sheet, before or after a full render.

usage: python -m pipeline.review_sheet <out_dir_with_plan.json> [--at 0.6] [--cols 5]
Writes <out_dir>/review_sheet.png. Cheap: a few seconds per episode."""
from __future__ import annotations
import argparse, json, subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent


def main() -> None:
    ap = argparse.ArgumentParser(); ap.add_argument("out_dir"); ap.add_argument("--at", type=float, default=0.6); ap.add_argument("--cols", type=int, default=5)
    a = ap.parse_args(); out = Path(a.out_dir); plan = json.loads((out / "plan.json").read_text())
    times = [round(s["start"] + (s["end"] - s["start"]) * a.at, 2) for s in plan["timeline"]]
    sd = out / "review_stills"; sd.mkdir(exist_ok=True)
    r = subprocess.run(["node", str(ROOT / "pipeline" / "stills.mjs"), str(out / "plan.json"), str(sd)] + [str(t) for t in times], capture_output=True, text=True, cwd=ROOT)
    if r.returncode != 0 or "error" in r.stderr.lower():
        raise SystemExit(f"stills failed: {r.stderr[-800:]}")
    w, h = 360, 640; cols = a.cols; rows = (len(times) + cols - 1) // cols
    sheet = Image.new("RGB", (w * cols, (h + 40) * rows), "white"); d = ImageDraw.Draw(sheet)
    font = ImageFont.truetype(str(ROOT / "assets/fonts/Nunito-Bold.ttf"), 22)
    for i, (t, s) in enumerate(zip(times, plan["timeline"])):
        im = Image.open(sd / f"t{t:.2f}.png").resize((w, h)); x, y = (i % cols) * w, (i // cols) * (h + 40)
        sheet.paste(im, (x, y + 40)); d.text((x + 8, y + 8), f"{s['id']}  {t:.1f}s", fill="black", font=font)
    sheet.save(out / "review_sheet.png"); print(out / "review_sheet.png")


if __name__ == "__main__":
    main()
