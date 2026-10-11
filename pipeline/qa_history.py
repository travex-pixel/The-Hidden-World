"""Automated QA for history-profile episodes. Writes qa/qa_report.{json,md}, storyboard.png, transitions.png.

Checks (each PASS/WARN/FAIL with the measured number):
  model   - foot slip of planted feet (exact, from the rig), camera acceleration spikes, proportion drift
  video   - black frames, frozen stretches, unplanned hard jumps, motion present in every scene
  text    - subtitle durations / reading speed / overlap, subtitle-to-voice alignment in the final mix
  story   - dead air between spoken lines, claims that still need human verification
Visual quality is NOT judged here: storyboard.png and transitions.png exist so a person can look.
usage: python -m pipeline.qa_history out/<id>  (run after pipeline.build)
"""
from __future__ import annotations
import json, re, subprocess, sys, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent


def frames_gray(mp4: Path, w=192, h=108):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(mp4), "-vf", f"scale={w}:{h}", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.float32)


def read_mix(path: Path):
    with wave.open(str(path)) as w:
        sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
        if w.getnchannels() == 2: x = x.reshape(-1, 2).mean(1)
    return x, sr


def parse_srt(p: Path):
    cues = []
    for block in p.read_text().strip().split("\n\n"):
        ln = block.strip().split("\n")
        m = re.match(r"(\d+):(\d+):(\d+),(\d+) --> (\d+):(\d+):(\d+),(\d+)", ln[1])
        a = [int(v) for v in m.groups()]
        cues.append({"start": a[0] * 3600 + a[1] * 60 + a[2] + a[3] / 1000, "end": a[4] * 3600 + a[5] * 60 + a[6] + a[7] / 1000, "text": " ".join(ln[2:])})
    return cues


def check(name, status, value, detail=""):
    return {"check": name, "status": status, "value": value, "detail": detail}


def run(out_dir: Path) -> dict:
    plan = json.loads((out_dir / "plan.json").read_text()); ep = plan["episode"]; tl = plan["timeline"]; fps = plan["fps"]
    mp4 = out_dir / f"{ep['id']}.mp4"; res = []
    total = tl[-1]["end"]
    from pipeline.history import sequences
    seqs = sequences(ep, tl); bounds = [q["start"] for q in seqs[1:]]

    # ---------------- model probes (exact)
    probe = out_dir / "probe.json"
    subprocess.run(["node", str(ROOT / "pipeline" / "probe.mjs"), str(out_dir / "plan.json"), str(probe), "30"], check=True, cwd=ROOT)
    P = json.loads(probe.read_text()); S = P["samples"]
    slip, n_planted = 0.0, 0
    for a, b in zip(S, S[1:]):
        if a["cam"]["seq"] != b["cam"]["seq"]: continue
        A = {x["id"]: x for x in a["actors"]}
        for y in b["actors"]:
            x = A.get(y["id"])
            if not x or not x["feet"] or not y["feet"]: continue
            for i in (0, 1):
                if x["lift"][i] == 0 and y["lift"][i] == 0:
                    n_planted += 1; slip = max(slip, abs(y["feet"][i] - x["feet"][i]) * (y["h"] or 420) / 1000 * (1000 / 1000))
    res.append(check("foot_slip_planted_px", "PASS" if slip < 0.5 else "FAIL", round(slip, 3), f"max displacement of a planted foot between frames over {n_planted} samples (screen px at rest)"))
    # camera acceleration in screen pixels per frame^2 (pan + dolly), excluding sequence cuts and intentional shakes
    shake_windows = []
    for s, sc in zip(tl, ep["scenes"]):
        from pipeline.history import resolve_at
        for sh in (sc.get("shot") or {}).get("shake", []):
            a = s["start"] + resolve_at(sh["t"], s); shake_windows.append((a - 0.05, a + sh["dur"] + 0.05))
    xs = np.array([c["cam"]["x"] for c in S]); ys = np.array([c["cam"]["y"] for c in S]); ds = np.array([c["cam"]["dolly"] for c in S]); sq = np.array([c["cam"]["seq"] for c in S]); ts = np.array([c["t"] for c in S])
    k = 1000 / np.maximum(200, 1000 - ds)
    sx, sy = xs * k, ys * k
    acc = np.hypot(np.diff(sx, 2), np.diff(sy, 2))
    ok = (sq[2:] == sq[:-2]) & np.array([not any(a <= t <= b for a, b in shake_windows) for t in ts[2:]])
    worst = float(acc[ok].max()) if ok.any() else 0.0
    t_worst = float(ts[2:][ok][np.argmax(acc[ok])]) if ok.any() else 0
    res.append(check("camera_accel_px_per_frame2", "PASS" if worst < 2.5 else "WARN" if worst < 5 else "FAIL", round(worst, 2), f"peak at t={t_worst:.2f}s (excl. cuts/shakes); <2.5 reads as smooth"))
    zoom_rate = float(np.abs(np.diff(k)[sq[1:] == sq[:-1]]).max())
    res.append(check("dolly_scale_rate_per_frame", "PASS" if zoom_rate < 0.02 else "WARN", round(zoom_rate, 4), "max change of acting-plane scale per frame (fast punch-ins > 0.02)"))
    hs = {}
    for c in S:
        for a in c["actors"]:
            if a["char"]: hs.setdefault(a["char"], set()).add(a["h"])
    drift = {ch: round((max(v) - min(v)) / max(v), 3) for ch, v in hs.items()}
    res.append(check("character_scale_consistency", "PASS" if all(v <= 0.06 for v in drift.values()) else "WARN", drift, "relative spread of each character's authored height across shots (same rig spec everywhere)"))

    # ---------------- video analysis
    F = frames_gray(mp4); n = len(F); t_f = np.arange(n) / fps
    mean = F.mean(axis=(1, 2)); mad = np.abs(np.diff(F, axis=0)).mean(axis=(1, 2))
    fade = (t_f < 0.7) | (t_f > total - 1.3)
    black = int(((mean < 16) & ~fade).sum())
    res.append(check("black_frames", "PASS" if black == 0 else "FAIL", black, "frames with mean luma < 16 outside the opening/closing fades"))
    # frozen stretches
    still = mad < 0.12; run_len, worst_run, t_run = 0, 0, 0.0
    for i, v in enumerate(still):
        run_len = run_len + 1 if v else 0
        if run_len > worst_run: worst_run, t_run = run_len, i / fps
    res.append(check("longest_frozen_stretch_s", "PASS" if worst_run / fps < 1.0 else "WARN" if worst_run / fps < 2.0 else "FAIL", round(worst_run / fps, 2), f"near-identical consecutive frames, ending t={t_run:.2f}s"))
    # unplanned jumps: spikes not near sequence boundaries
    near = lambda t: any(abs(t - b) < 1.0 for b in bounds)
    thr = max(18.0, float(np.percentile(mad, 99.5)) * 1.5)
    jumps = [round((i + 1) / fps, 2) for i, v in enumerate(mad) if v > thr and not near((i + 1) / fps)]
    res.append(check("unplanned_jumps", "PASS" if not jumps else "WARN", jumps[:10], f"frame differences > {thr:.1f} away from planned transitions"))
    per_scene = []
    for s in tl:
        a, b = int(s["start"] * fps), max(int(s["start"] * fps) + 2, int(s["end"] * fps) - 1)
        per_scene.append(round(float(mad[a:b].mean()), 2))
    res.append(check("motion_in_every_scene", "PASS" if min(per_scene) > 0.25 else "FAIL", dict(zip([s["id"] for s in tl], per_scene)), "mean frame difference per scene (0 = static image)"))

    # ---------------- subtitles + audio alignment
    cues = parse_srt(out_dir / f"{ep['id']}.srt")
    short = [c["text"][:30] for c in cues if c["end"] - c["start"] < 0.9]
    cps = max(len(c["text"]) / max(0.1, c["end"] - c["start"]) for c in cues)
    overlap = sum(1 for a, b in zip(cues, cues[1:]) if a["end"] > b["start"])
    res.append(check("subtitle_timing", "PASS" if not short and cps <= 22 and not overlap else "WARN", {"cues": len(cues), "max_chars_per_s": round(cps, 1), "too_short": short, "overlaps": overlap}, "reading speed <= 22 chars/s, every cue >= 0.9 s"))
    x, sr = read_mix(out_dir / "mix.wav")
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / sr); X[(f < 250) | (f > 3500)] = 0; v = np.fft.irfft(X, n=len(x))
    hop = sr // 20; env = np.sqrt((v[: len(v) // hop * hop].reshape(-1, hop) ** 2).mean(1)); te = np.arange(len(env)) / 20
    inside = np.zeros(len(env), bool)
    for c in cues: inside |= (te >= c["start"] + 0.1) & (te <= c["end"] - 0.25)
    ratio = float(env[inside].mean() / max(1e-9, env[~inside].mean()))
    res.append(check("subtitle_voice_alignment", "PASS" if ratio > 1.6 else "WARN", round(ratio, 2), "speech-band energy inside subtitle cues vs outside (higher = voice sits under its subtitle)"))
    gaps = [round(b["start"] - a["end"], 2) for a, b in zip(cues, cues[1:])]
    lead, tail = round(cues[0]["start"], 2), round(total - cues[-1]["end"], 2)
    worst_gap = max(gaps + [lead])
    res.append(check("dead_air_s", "PASS" if worst_gap <= 3.0 else "WARN" if worst_gap <= 4.5 else "FAIL", {"longest_gap": worst_gap, "opening_silence": lead, "outro_after_last_line": tail}, "gaps without speech (music/SFX and motion continue)"))

    # ---------------- historical claims
    review = [{"id": c["id"], "type": c["type"], "text": c["text"][:120]} for c in ep["claims"] if c["type"] in ("estimate", "disputed", "plausible")]
    snippet_only = [s["id"] for s in ep["sources"] if "snippet" in s.get("note", "")]
    res.append(check("claims_flagged_for_review", "WARN" if review or snippet_only else "PASS", {"non_established_claims": review, "sources_verified_by_snippet_only": snippet_only}, "a historian/editor must confirm these before publishing"))

    # ---------------- storyboard + transition strips (for human review)
    qa = out_dir / "qa"; qa.mkdir(exist_ok=True)
    from PIL import Image, ImageDraw, ImageFont
    font = ImageFont.truetype(str(ROOT / "assets/fonts/Nunito-Bold.ttf"), 16)
    def grab(t, w=384):
        raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", str(mp4), "-frames:v", "1", "-vf", f"scale={w}:-2", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True, check=True).stdout
        import io; return Image.open(io.BytesIO(raw)).convert("RGB")
    def label(im, txt):
        d = ImageDraw.Draw(im); d.rectangle([0, 0, im.width, 22], fill=(20, 12, 8)); d.text((6, 2), txt, fill=(255, 230, 180), font=font); return im
    times = np.linspace(0.8, total - 0.8, 24)
    sid = lambda t: next(s["id"] for s in tl if t < s["end"]) if t < total else tl[-1]["id"]
    tiles = [label(grab(t), f"{t:6.2f}s  {sid(t)}") for t in times]
    W, H = tiles[0].size; sb = Image.new("RGB", (W * 4, H * 6), (0, 0, 0))
    for i, im in enumerate(tiles): sb.paste(im, ((i % 4) * W, (i // 4) * H))
    sb.save(qa / "storyboard.png")
    rows = []
    for b in bounds:
        rows.append([label(grab(max(0, b + d), 320), f"{b + d:6.2f}s") for d in (-0.4, -0.15, 0.0, 0.2, 0.5)])
    if rows:
        W, H = rows[0][0].size; tr = Image.new("RGB", (W * 5, H * len(rows)))
        for r, row in enumerate(rows):
            for c, im in enumerate(row): tr.paste(im, (c * W, r * H))
        tr.save(qa / "transitions.png")
    report = {"episode": ep["id"], "file": str(mp4), "duration": total, "checks": res,
              "summary": {k: sum(1 for r in res if r["status"] == k) for k in ("PASS", "WARN", "FAIL")},
              "visual_review": "storyboard.png and transitions.png must be inspected by a person; automated checks do not judge beauty."}
    (qa / "qa_report.json").write_text(json.dumps(report, indent=2))
    md = [f"# QA — {ep['title']}\n", f"File: `{mp4.name}` · {total:.1f}s · {plan['width']}x{plan['height']} @ {fps}fps\n", "| Check | Status | Value | Notes |", "|---|---|---|---|"]
    md += [f"| {r['check']} | {r['status']} | `{json.dumps(r['value'])[:160]}` | {r['detail']} |" for r in res]
    md += ["", f"Summary: {report['summary']}", "", "Visual review: see `storyboard.png` (24 evenly spaced frames) and `transitions.png` (frames around every sequence change)."]
    (qa / "qa_report.md").write_text("\n".join(md))
    return report


if __name__ == "__main__":
    r = run(Path(sys.argv[1]))
    for c in r["checks"]:
        print(f"{c['status']:5} {c['check']}: {json.dumps(c['value'])[:140]}")
    print(r["summary"])
    sys.exit(1 if r["summary"]["FAIL"] else 0)
