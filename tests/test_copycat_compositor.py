import random

import numpy as np

from copycat.compositor import (CAMERAS, camera_path, caption_pages, expand_captions, fill_window,
                                resolve_layout, shot_frames, wrap_caption)


def path(name, n=90, fps=30):
    return [camera_path(name, i, n, fps, seed=5) for i in range(n)]


def test_push_pull_endpoints_monotone():
    p = path("slow_push_in")
    z = [c["z"] for c in p]
    assert abs(z[0] - 1.0) < 1e-9 and abs(z[-1] - 1.10) < 1e-9
    assert all(b >= a for a, b in zip(z, z[1:]))
    z = [c["z"] for c in path("slow_pull_out")]
    assert abs(z[0] - 1.10) < 1e-9 and abs(z[-1] - 1.0) < 1e-9
    assert all(b <= a for a, b in zip(z, z[1:]))


def test_pan_and_drift_constant_zoom_monotone_travel():
    for name, key, sign in (("pan_lr", "px", 1), ("pan_rl", "px", -1), ("drift_up", "py", -1)):
        p = path(name)
        assert all(abs(c["z"] - p[0]["z"]) < 1e-9 for c in p)
        v = [sign * c[key] for c in p]
        assert all(b >= a - 1e-12 for a, b in zip(v, v[1:]))
        assert abs(abs(v[-1] - v[0]) - 1.0) < 1e-9


def test_punch_zoom_shape():
    p = path("impact_punch_zoom", n=150)
    assert abs(p[0]["z"] - 1.0) < 1e-9
    assert abs(p[round(0.25 * 30)]["z"] - 1.15) < 0.01          # 250 ms
    assert p[-1]["z"] <= 1.18 + 1e-9 and p[-1]["z"] > 1.17
    z = [c["z"] for c in p]
    assert all(b >= a - 1e-12 for a, b in zip(z, z[1:]))
    assert max(abs(c["sx"]) for c in p[:5]) > 1.0               # shake present early
    assert all(c["sx"] == 0 and c["sy"] == 0 for c in p[11:])    # none after 350 ms
    assert max(abs(c["sx"]) for c in p) <= 10.0


def test_window_clamped_and_subpixel_smooth():
    for aspect in (1.78, 2.4, 1.5):
        for name in CAMERAS:
            prev = None
            for c in path(name, n=120):
                l, t, ww, wh = fill_window(aspect, 16 / 9, (0.95, 0.05), c, name, (0.01, -0.01))
                assert -1e-9 <= l <= 1 - ww + 1e-9 and -1e-9 <= t <= 1 - wh + 1e-9
                if prev and name != "impact_punch_zoom":
                    # per-frame move in output pixels stays small and smooth (< 8 px at 1080p)
                    assert abs(l - prev[0]) * 1920 / ww < 12 and abs(t - prev[1]) * 1080 / wh < 12
                prev = (l, t)


def test_zoom_keeps_focus_on_screen():
    c0, c1 = camera_path("slow_push_in", 0, 60, 30), camera_path("slow_push_in", 59, 60, 30)
    f = (0.45, 0.5)
    pos = []
    for c in (c0, c1):
        l, t, ww, wh = fill_window(16 / 9, 16 / 9, f, c, "slow_push_in")
        pos.append((f[0] - l) / ww)
    assert abs(pos[0] - pos[1]) < 1e-9


def test_frame_counts_exact_over_30_shots():
    random.seed(3)
    t, shots = 0.0, []
    for k in range(30):
        d = random.uniform(0.7, 6.3)
        shots.append(dict(start=t, end=t + d))
        t += d
    shots[-1]["end"] = 90.0
    fr = shot_frames(shots, 30)
    assert fr[0][0] == 0 and fr[-1][1] == 2700
    assert all(a[1] == b[0] for a, b in zip(fr, fr[1:]))
    assert sum(b - a for a, b in fr) == 2700


def test_caption_wrapping():
    for text in ("Short.", "x " * 80, "A" * 100, "In a village at the edge of the kingdom, a boy was born with nothing."):
        for page in caption_pages(text):
            assert 1 <= len(page) <= 2 and all(len(l) <= 42 for l in page)
    assert len(wrap_caption("word " * 30)) > 2
    caps = expand_captions([dict(start=1.0, end=7.0, text="word " * 40, speaker="ASTA")])
    assert len(caps) > 1 and abs(caps[0]["start"] - 1.0) < 1e-9 and abs(caps[-1]["end"] - 7.0) < 1e-9
    assert all(a["end"] <= b["start"] + 1e-9 for a, b in zip(caps, caps[1:]))


def test_layout_auto_switch():
    assert resolve_layout("fill", 1920, 1080) == "fill"
    assert resolve_layout("fill", 1600, 1200) == "depth_frame"      # 4:3
    assert resolve_layout("fill", 900, 1350) == "depth_frame"       # portrait
    assert resolve_layout("fill", 1000, 500) == "depth_frame"       # low-res
    assert resolve_layout("depth_frame", 1920, 1080) == "depth_frame"
