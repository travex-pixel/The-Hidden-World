"""Orchestrator: validate -> narrate -> timeline -> music/sfx -> render -> mix -> mux -> verify.

usage: python -m pipeline.build <episode_id> [--seed N|random] [--quality preview|final] [--target-duration S]
Produces out/<episode>/<episode>.mp4 plus inspectable intermediates and a verify report.
"""
from __future__ import annotations
import argparse, json, random, shutil, subprocess, sys, time
from pathlib import Path
import numpy as np

from pipeline.schema import load_episode, EpisodeError
from pipeline import audio
from pipeline.narrate import narrate_episode, read_wav
from pipeline.verify import verify

ROOT = Path(__file__).resolve().parent.parent
QUALITY = {"preview": {"width": 540, "height": 960, "fps": 15, "crf": 26, "preset": "veryfast"},
           "final": {"width": 1080, "height": 1920, "fps": 30, "crf": 20, "preset": "medium"}}


def log(msg: str) -> None:
    print(f"[build {time.strftime('%H:%M:%S')}] {msg}", flush=True)


def metronome_model(m: dict) -> dict:
    """Deterministic metronome phases shared by the animation (via plan.json) and the tick soundtrack."""
    rng = random.Random(m.get("seed", 7))
    m = dict(m)
    m["phases"] = [round(rng.uniform(0, 2 * np.pi), 4) for _ in range(m["n"])]
    return m


def metronome_ticks(m: dict, start: float, dur: float, mode: str, gain: float) -> list:
    """Tick whenever a pendulum passes centre. Phase_i(t) = w*t + phi_i*(1 - s(t)); s eases 0->1 between sync_start and sync_end."""
    w = np.pi / m["tick_period"]
    t = np.arange(0, dur, 0.002)
    if mode == "sync":
        sync = np.ones_like(t)
    else:
        u = np.clip((t - m["sync_start"]) / (m["sync_end"] - m["sync_start"]), 0, 1)
        sync = u * u * (3 - 2 * u)
    events = []
    per = gain / np.sqrt(m["n"]) * 1.4
    for phi in m["phases"]:
        ph = w * t + phi * (1 - sync)
        k = np.floor(ph / np.pi)
        for i in np.nonzero(np.diff(k) > 0)[0]:
            events.append((round(start + t[i + 1], 4), "tick", per))
    return events


def make_decisions(ep: dict, seed: int) -> dict:
    """Seed-controlled creative choices. Never touches facts, numbers, sources or narration text."""
    rng = random.Random(seed)
    d = {"seed": seed, "scenes": {}}
    for s in ep["scenes"]:
        d["scenes"][s["id"]] = {
            "cloud_drift": rng.choice(["slow", "medium"]),
            "sparkle_density": rng.choice([0.8, 1.0, 1.2]),
            "idle_gesture": rng.choice(["bob", "sway"]),
        }
    d["music_key_offset"] = rng.choice([-5, -3, -2, 0, 2])
    return d


def build_timeline(ep: dict, narr: list[dict], target: float | None) -> list[dict]:
    tl, t = [], 0.0
    for s, n in zip(ep["scenes"], narr):
        lead = 0.25  # small breath before narration starts in each scene
        dur = max(float(s["min_duration"]), lead + n["duration"] + float(s["pad_after"]))
        tl.append({"id": s["id"], "start": round(t, 3), "end": round(t + dur, 3), "narration_at": round(t + lead, 3),
                   "narration_end": round(t + lead + n["duration"], 3), "music_cue": s["music_cue"]})
        t += dur
    if target:
        lo, hi = ep["target_duration_seconds"]
        if not (lo - 5 <= target <= hi + 5):
            log(f"warning: requested target {target}s is outside the episode's range {lo}-{hi}s; using it anyway")
    return tl


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("episode")
    ap.add_argument("--seed", default="1")
    ap.add_argument("--quality", choices=QUALITY, default="final")
    ap.add_argument("--target-duration", type=float, default=None, help="optional; narration speed is nudged toward it")
    ap.add_argument("--out", default=None)
    ap.add_argument("--visual", choices=["art", "svg"], default=None, help="art = illustrated panels (episode default); svg = code-drawn scenes")
    ap.add_argument("--plan-only", action="store_true", help="stop after writing plan.json (for quick stills with pipeline/stills.mjs)")
    ap.add_argument("--reuse-video", action="store_true", help="skip frame rendering and reuse out/<id>/video_silent.mp4 (audio-only iteration)")
    args = ap.parse_args(argv)

    try:
        ep = load_episode(args.episode)
    except EpisodeError as e:
        log(f"ERROR {e}"); return 2
    seed = random.randrange(1, 10**6) if args.seed == "random" else int(args.seed)
    q = QUALITY[args.quality]
    out_dir = Path(args.out) if args.out else ROOT / "out" / ep["id"]
    out_dir.mkdir(parents=True, exist_ok=True)
    log(f"episode={ep['id']} seed={seed} quality={args.quality} -> {out_dir}")

    decisions = make_decisions(ep, seed)
    (out_dir / "decisions.json").write_text(json.dumps(decisions, indent=2))

    # 1. narration (cached)
    log("narration: synthesising with Piper (cached per line)")
    length_scale = round(1.0 / float(ep.get("narration_speed", 1.0)), 3)
    narr = narrate_episode(ep, length_scale)
    tl = build_timeline(ep, narr, args.target_duration)
    total = tl[-1]["end"]
    if args.target_duration and abs(total - args.target_duration) > 2:
        length_scale = float(np.clip(length_scale * args.target_duration / total, 0.8, 1.2))
        log(f"adjusting narration speed x{length_scale:.3f} toward target {args.target_duration}s")
        narr = narrate_episode(ep, length_scale)
        tl = build_timeline(ep, narr, args.target_duration); total = tl[-1]["end"]
    lo, hi = ep["target_duration_seconds"]
    log(f"timeline: {len(tl)} scenes, {total:.2f}s (target {lo}-{hi}s)")
    if not (lo <= total <= hi):
        log(f"ERROR: total duration {total:.2f}s outside target range {lo}-{hi}s. Edit narration/min_duration or pass --target-duration.")
        return 3
    # dialogue: absolute line timings (captions + lip sync) and the cast's character specs
    for s_, n_ in zip(tl, narr):
        if n_.get("lines") is not None:
            s_["lines"] = [{**l, "start": round(s_["narration_at"] + l["start"], 3), "end": round(s_["narration_at"] + l["end"], 3)} for l in n_["lines"]]
    cast_ids = sorted({l["who"] for s_ in tl for l in s_.get("lines", [])} | set(ep.get("cast", [])))
    from pipeline.narrate import load_character
    cast = {cid: load_character(cid) for cid in cast_ids}
    (out_dir / "timeline.json").write_text(json.dumps([{k: v for k, v in s_.items() if k != "lines"} | ({"lines": [{k: v for k, v in l.items() if k != "env"} for l in s_["lines"]]} if s_.get("lines") else {}) for s_ in tl], indent=2))
    def _script(s, sc):
        if s.get("lines"):
            body = "\n".join(f"  {l['who'].upper()} [{l['start']:.2f}s]: {l['text']}" for l in s["lines"])
            return f"[{s['start']:6.2f}s – {s['end']:6.2f}s] {s['id']}\n{body}\n"
        return f"[{s['start']:6.2f}s – {s['end']:6.2f}s] {s['id']}\n  VO: {sc.get('narration') or '(silent)'}\n  CAPTION: {sc['caption']}\n"
    script_lines = ["# Script\n"] + [_script(s, sc) for s, sc in zip(tl, ep["scenes"])]
    (out_dir / "script.md").write_text("\n".join(script_lines))

    # 2. music + sfx + mix
    log("audio: composing soundtrack and effects")
    music = audio.compose(tl, total, seed, bpm=ep.get("music", {}).get("bpm", 96), key_semi=decisions["music_key_offset"])
    clips = [(s["narration_at"], *read_wav(Path(n["path"]))) for s, n in zip(tl, narr)]
    clips = [(at, x, sr) for at, (x, sr) in [(c[0], (c[1], c[2])) for c in clips]]
    sfx_events = [(s["start"] + fx["at"], fx["name"], fx.get("gain", 1.0)) for s, sc in zip(tl, ep["scenes"]) for fx in sc["sfx"] if s["start"] + fx["at"] < s["end"]]
    if "metronomes" in ep:
        ep["metronomes"] = metronome_model(ep["metronomes"])
        for s, sc in zip(tl, ep["scenes"]):
            if sc.get("tick_track"):
                ticks = metronome_ticks(ep["metronomes"], s["start"], s["end"] - s["start"], sc["tick_track"], sc.get("tick_gain", 1.0))
                # keep the voice clearly on top: ticks drop 6 dB while the narrator is speaking
                sfx_events += [(at, n, g * (0.5 if s["narration_at"] - 0.1 <= at <= s["narration_end"] + 0.1 else 1.0)) for at, n, g in ticks]
        log(f"metronome ticks: {sum(1 for e in sfx_events if e[1] == 'tick')}")
    # per-scene music level (e.g. duck the score so a sound effect can carry a scene)
    if any("music_gain_db" in sc for sc in ep["scenes"]):
        env = np.ones(len(music), np.float32); fade = int(0.4 * audio.SR)
        for s, sc in zip(tl, ep["scenes"]):
            g = 10 ** (sc.get("music_gain_db", 0) / 20)
            a, b = int(s["start"] * audio.SR), min(len(music), int(s["end"] * audio.SR))
            env[a:b] = g
        k = np.ones(fade, np.float32) / fade
        music = (music * np.convolve(env, k, mode="same")).astype(np.float32)
    mixed = audio.mix(total, clips, music, sfx_events, seed)
    audio.write_wav(out_dir / "mix.wav", mixed)
    if ep.get("loudness_lufs"):   # optional: normalise the final mix (YouTube plays back at about -14 LUFS)
        audio.loudnorm(out_dir / "mix.wav", float(ep["loudness_lufs"]))
        log(f"audio: loudness normalised to {ep['loudness_lufs']} LUFS")
    audio.write_wav(out_dir / "music_only.wav", music)

    # 3. render frames
    visual = args.visual or ep.get("visual_mode", "svg")
    if visual == "auto":
        visual = "art" if ep.get("art_manifest") and (ROOT / ep["art_manifest"]).exists() else "svg"
    art = {"panels": {}}
    if visual == "art":
        man = ROOT / ep.get("art_manifest", "")
        if not ep.get("art_manifest") or not man.exists():
            log(f"ERROR: visual mode 'art' needs {ep.get('art_manifest')}. Run: python -m pipeline.import_panels <ep>"); return 4
        art = json.loads(man.read_text())
        missing = [p["src"] for p in art["panels"].values() if not (ROOT / p["src"]).exists()]
        if missing:
            log(f"ERROR: missing art files {missing}"); return 4
    log(f"visual mode: {visual}")
    plan = {"visual": visual, "art": art, "cast": cast, "width": q["width"], "height": q["height"], "fps": q["fps"], "crf": q["crf"], "preset": q["preset"], "seed": seed,
            "timeline": [{**s, "decisions": decisions["scenes"][s["id"]]} for s in tl], "episode": ep,
            "scenes_js": f"renderer/scenes/{ep['id']}.js"}
    if not (ROOT / plan["scenes_js"]).exists():
        log(f"ERROR: scene renderer {plan['scenes_js']} not found"); return 4
    (out_dir / "plan.json").write_text(json.dumps(plan))
    if args.plan_only:
        log(f"plan written: {out_dir / 'plan.json'}"); return 0
    silent = out_dir / "video_silent.mp4"
    if args.reuse_video and silent.exists():
        log("render: skipped (--reuse-video)")
    else:
        log(f"render: {q['width']}x{q['height']} @ {q['fps']}fps, {round(total * q['fps'])} frames")
        r = subprocess.run(["node", str(ROOT / "pipeline" / "render.mjs"), str(out_dir / "plan.json"), str(silent)], cwd=ROOT)
        if r.returncode != 0:
            log("ERROR: frame rendering failed (see messages above)"); return 5

    # 4. mux
    final = out_dir / f"{ep['id']}.mp4"
    log("mux: combining video and audio")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(silent), "-i", str(out_dir / "mix.wav"), "-c:v", "copy", "-c:a", "aac", "-b:a", "160k",
                    "-movflags", "+faststart", "-shortest", str(final)], check=True)

    # 5. verify
    log("verify: probing, decoding, contact sheet")
    rep = verify(final, expected_duration=total, width=q["width"], height=q["height"], fps=q["fps"], contact_sheet=out_dir / "contact_sheet.png")
    (out_dir / "verify.json").write_text(json.dumps(rep, indent=2))
    for k, v in rep["checks"].items():
        log(f"  {'PASS' if v else 'FAIL'} {k}")
    log(f"{'OK' if rep['all_passed'] else 'FAILED CHECKS'}: {final} ({rep['size_bytes']/1e6:.1f} MB, {rep['duration']}s)")
    return 0 if rep["all_passed"] else 6


if __name__ == "__main__":
    sys.exit(main())
