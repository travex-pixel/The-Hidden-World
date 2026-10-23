"""Keep the render from starting on a full disk, and reclaim the space finished episodes no longer need.

usage: python series/true-crime/tools/disk_guard.py [--min-gb 3] [--keep <episode-id> ...] [--dry-run]

Chromium reports a full disk as "page.screenshot: Target crashed", which looks like a renderer bug: on 19 Oct 2026 two
40-minute renders (Case Files 84 and 85) died that way with 181 MB free. A finished episode (its MP4 verified in
series/true-crime-cinematic/output/) keeps plan.json, timeline.json, mix.wav and its final MP4 in out/<id>/, but its
stems/, precheck/ and video_silent.mp4 are regenerable intermediates (6-9 GB across the series). This deletes those for
every finished episode not listed in --keep, then exits 1 if the free space is still under --min-gb, so a queue can stop
with a clear message instead of crashing mid-render."""
from __future__ import annotations
import argparse, json, shutil, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
INTERMEDIATES = ("stems", "precheck", "video_silent.mp4")


def finished_ids(series_dir: Path) -> set[str]:
    """Episodes whose final MP4 exists in the series output folder."""
    cfg = json.loads((series_dir / "series.json").read_text()); done = set()
    for e in cfg["episodes"]:
        if (series_dir / "output" / e["file"]).exists():
            done.add(e["id"])
    return done


def reclaim(out_dir: Path, finished: set[str], keep: set[str], dry_run: bool = False) -> int:
    """Delete the intermediates of finished episodes (never those in keep); returns bytes freed (or would free)."""
    freed = 0
    for d in sorted(out_dir.iterdir()) if out_dir.exists() else []:
        if not d.is_dir() or d.name not in finished or d.name in keep:
            continue
        for name in INTERMEDIATES:
            p = d / name
            if not p.exists():
                continue
            size = sum(f.stat().st_size for f in p.rglob("*") if f.is_file()) if p.is_dir() else p.stat().st_size
            freed += size
            if not dry_run:
                shutil.rmtree(p) if p.is_dir() else p.unlink()
    return freed


def free_gb(path: Path) -> float:
    return shutil.disk_usage(path).free / 1e9


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("--min-gb", type=float, default=3.0); ap.add_argument("--keep", nargs="*", default=[])
    ap.add_argument("--dry-run", action="store_true"); ap.add_argument("--series", default="series/true-crime-cinematic")
    a = ap.parse_args(argv)
    series_dir = ROOT / a.series
    before = free_gb(ROOT)
    freed = reclaim(ROOT / "out", finished_ids(series_dir), set(a.keep), a.dry_run)
    after = free_gb(ROOT)
    print(f"free {before:.1f} GB -> {after:.1f} GB ({'would free' if a.dry_run else 'freed'} {freed / 1e9:.1f} GB of intermediates)")
    if after < a.min_gb:
        print(f"DISK LOW: {after:.1f} GB free, need {a.min_gb:.1f} GB before a render"); return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
