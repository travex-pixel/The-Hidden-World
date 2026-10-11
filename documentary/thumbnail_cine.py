"""Render thumbnail concepts that use the documentary's own `cine` art (sets + illustrated figures).
usage: python -m documentary.thumbnail_cine <film_dir> <out_dir>
Reads <film_dir>/thumbnails.json: {"figures": [ids], "concepts": [{"name", "shot": {cine shot spec}}]}.
Each concept is rendered at 1920x1080 with the documentary renderer, then saved as a 1280x720 PNG (under 2 MB,
YouTube's thumbnail limit). Thumbnails carry a small ILLUSTRATION tag at the top right, away from the duration badge."""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]


def main(argv=None) -> int:
    argv = argv or sys.argv[1:]
    film_dir, out = Path(argv[0]), Path(argv[1]); out.mkdir(parents=True, exist_ok=True)
    spec = json.loads((film_dir / "thumbnails.json").read_text())
    figs = {f: json.loads((ROOT / "documentary" / "cast" / "figures" / f"{f}.json").read_text()) for f in spec["figures"]}
    shots, times = [], []
    for i, c in enumerate(spec["concepts"]):
        s = {"type": "cine", "label": "", "chapterTag": "", "tagTop": "Illustration · not a likeness", **c["shot"], "i": i, "line": 0, "start": i * 4.0, "end": i * 4.0 + 4.0}
        shots.append(s); times.append(i * 4.0 + c.get("at", 3.5))
    plan = {"fps": 30, "width": 1920, "height": 1080, "crf": 18, "shots": shots, "timeline": [], "cast": {}, "figures": figs, "seed": 7}
    with tempfile.TemporaryDirectory() as td:
        pp = Path(td) / "plan.json"; pp.write_text(json.dumps(plan))
        subprocess.run(["node", str(ROOT / "documentary" / "render.mjs"), str(pp), "--stills", td, ",".join(f"{t:.2f}" for t in times)], check=True, cwd=ROOT)
        stills = sorted(Path(td).glob("still_*.png"))
        for c, f in zip(spec["concepts"], stills):
            im = Image.open(f).convert("RGB").resize((1280, 720), Image.LANCZOS)
            dst = out / f"thumbnail-{c['name']}.png"; im.save(dst, optimize=True)
            if dst.stat().st_size > 2_000_000:
                dst = dst.with_suffix(".jpg"); im.save(dst, quality=92)
            print(f"[thumb] {dst} ({dst.stat().st_size / 1e6:.2f} MB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
