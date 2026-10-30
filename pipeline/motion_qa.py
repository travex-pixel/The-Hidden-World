"""Visual pacing QA from the rendered frames (not from the code): is something actually moving on screen?

Decodes the video at 10 fps and 108x192 grey, masks the header and the caption band (captions always change, so they
must not count as picture motion), and measures the mean absolute difference between consecutive frames. It reports:
  - the longest span where the picture is effectively still (a "slideshow" moment)
  - narration lines whose start has no visual change within +-1 s (a beat the picture does not react to)
usage: python -m pipeline.motion_qa <video.mp4> <timeline.json>
"""
from __future__ import annotations
import json, subprocess, sys
from pathlib import Path
import numpy as np

FPS, W, H = 10, 108, 192
STILL = 0.35          # mean abs diff (0-255) below which a 0.1 s step counts as still (film grain alone is ~0.2)
MAX_STILL_S = 2.5     # longest acceptable still span, outside the final fade
BEAT_CHANGE = 1.0     # a narration beat needs at least this much change somewhere within +-1 s


def motion(mp4: Path) -> np.ndarray:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(mp4), "-vf", f"fps={FPS},scale={W}:{H},format=gray", "-f", "rawvideo", "-"],
                         capture_output=True, check=True).stdout
    f = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
    mask = np.ones((H, W), bool); mask[: int(H * 0.17)] = False; mask[int(H * 0.66): int(H * 0.82)] = False
    return np.array([np.abs(f[i] - f[i - 1])[mask].mean() for i in range(1, len(f))])


def analyse(mp4: Path, timeline: list, tail_s: float = 3.0) -> dict:
    d = motion(mp4); n = len(d); end = n - int(tail_s * FPS)
    spans, run0 = [], None
    for i in range(end):
        if d[i] < STILL:
            run0 = i if run0 is None else run0
        elif run0 is not None:
            spans.append((run0, i)); run0 = None
    if run0 is not None:
        spans.append((run0, end))
    longest = max(((b - a) / FPS for a, b in spans), default=0.0)
    still = [{"from": round(a / FPS, 1), "to": round(b / FPS, 1)} for a, b in spans if (b - a) / FPS > MAX_STILL_S]
    dead = []
    for s in timeline:
        for l in s.get("lines", []):
            i0, i1 = max(0, int((l["start"] - 1.0) * FPS)), min(n, int((l["start"] + 1.0) * FPS))
            if i1 > i0 and d[i0:i1].max() < BEAT_CHANGE:
                dead.append({"scene": s["id"], "at": round(l["start"], 1), "text": l["text"][:40]})
    # engine v6: something must already be moving in the first half second (the Reels tab autoplays frame 0; the two
    # lowest skip rates of Case Files 72-79 had a moving object in frame 1). Reported here, enforced by the v6 gate.
    opening = float(d[:FPS // 2].max()) if n else 0.0
    return {"ok": not still and not dead, "longest_still_s": round(longest, 1), "still_spans_over_limit": still,
            "beats_without_visual_change": dead, "median_motion": round(float(np.median(d)), 2), "frames": n + 1,
            "opening_motion": round(opening, 2), "opening_motion_ok": opening >= BEAT_CHANGE}


LOOP_MAX = 2.0   # Case File 80 (end card on frame 1's set and camera) measures 0.4, 73 1.2; a different set reads 5-8


def loop_match(mp4: Path) -> float:
    """How far the last frame is from the first (mean abs grey difference at 108x192) in the picture bands: rows 40-66 %
    and 82-100 %, outside the headline/end-card area and the caption band. The owner's rule from Case Files 83 on: the
    reel loops, so the end scene returns to frame 1's set, poses and camera."""
    def grab(args):
        raw = subprocess.run(["ffmpeg", "-v", "error", *args, "-frames:v", "1", "-vf", f"scale={W}:{H},format=gray", "-f", "rawvideo", "-"],
                             capture_output=True, check=True).stdout
        return np.frombuffer(raw[-W * H:], np.uint8).reshape(H, W).astype(np.float32)
    a = grab(["-ss", "0.0", "-i", str(mp4)]); b = grab(["-sseof", "-0.08", "-i", str(mp4)])
    mask = np.zeros((H, W), bool); mask[int(H * 0.40): int(H * 0.66)] = True; mask[int(H * 0.82):] = True
    return round(float(np.abs(a - b)[mask].mean()), 2)


if __name__ == "__main__":
    r = analyse(Path(sys.argv[1]), json.loads(Path(sys.argv[2]).read_text()))
    print(json.dumps(r, indent=2)); sys.exit(0 if r["ok"] else 1)
