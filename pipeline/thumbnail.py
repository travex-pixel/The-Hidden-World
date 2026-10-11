"""Render an episode's YouTube thumbnail with the same character rig as the episode.

usage: python -m pipeline.thumbnail <episode_id> <out.png> [--size 1280x720]
The composition lives in episode.json under "thumbnail" (scene type ws_thumb in renderer/widescreen.js).
Also writes <out>_preview_small.png: the thumbnail at the size a phone shows it, for a readability check.
"""
from __future__ import annotations
import argparse, json, subprocess, tempfile
from pathlib import Path
from PIL import Image

from pipeline.schema import load_episode
from pipeline.narrate import load_character

ROOT = Path(__file__).resolve().parent.parent


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("episode"); ap.add_argument("out"); ap.add_argument("--size", default="1280x720")
    a = ap.parse_args(argv)
    ep = load_episode(a.episode); th = ep.get("thumbnail")
    if not th:
        raise SystemExit(f"{a.episode}: no 'thumbnail' block in episode.json")
    w, h = (int(v) for v in a.size.split("x"))
    who = sorted({x["who"] for x in th["actors"]})
    scene = {"id": "thumbnail", "scene": "ws_thumb", "shot": th, "caption": "", "caption_mode": "none", "transition": "cut"}
    plan = {"width": w, "height": h, "canvas": [1920, 1080], "seed": 1, "visual": "svg", "art": {"panels": {}},
            "cast": {c: load_character(c) for c in who}, "episode": {**ep, "scenes": [scene]},
            "timeline": [{"id": "thumbnail", "start": 0, "end": 1, "narration_at": 0, "narration_end": 0, "music_cue": "hush", "decisions": {}}],
            "scenes_js": f"renderer/scenes/{ep['id']}.js"}
    out = Path(a.out).resolve(); out.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        pp = Path(td) / "plan.json"; pp.write_text(json.dumps(plan))
        r = subprocess.run(["node", str(ROOT / "pipeline" / "stills.mjs"), str(pp), td, "0.5"], cwd=ROOT, capture_output=True, text=True)
        if r.returncode != 0 or "error" in r.stderr.lower():
            raise SystemExit(f"thumbnail render failed: {r.stderr[-1200:]}")
        Image.open(Path(td) / "t0.50.png").convert("RGB").save(out, optimize=True)
    small = out.with_name(out.stem + "_preview_small.png")
    Image.open(out).resize((320, 180), Image.LANCZOS).save(small)
    print(out, Image.open(out).size, small)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
