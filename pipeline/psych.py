"""psychology-shorts production mode: config -> narration -> orbit schedule -> music/sfx mix -> frames -> MP4 -> QA -> package.

usage: python -m pipeline.psych <episode_id> [--seed N] [--quality preview|final] [--out DIR] [--reuse-video]
Episodes live in shorts/psychology/<id>/episode.json. Output goes to output/psychology-shorts/<id>/ (video.mp4,
thumbnail.png, subtitles.srt, transcript.txt, platform captions, episode.json copy, production-report.txt, qa/).
Isolated from the documentary engine: it only imports the shared narration, audio, and verify helpers.
"""
from __future__ import annotations
import argparse, json, math, shutil, subprocess, sys, time
from pathlib import Path
import numpy as np

from pipeline import audio
from pipeline.narrate import narrate_scene, read_wav
from pipeline.verify import verify

ROOT = Path(__file__).resolve().parent.parent
SHORTS = ROOT / "shorts" / "psychology"
QUALITY = {"preview": {"width": 540, "height": 960, "fps": 15, "crf": 26, "preset": "veryfast"},
           "final": {"width": 1080, "height": 1920, "fps": 30, "crf": 19, "preset": "medium"}}
PLATFORM_FILES = {"instagram": "instagram-caption.txt", "tiktok": "tiktok-caption.txt", "youtube_title": "youtube-title.txt", "youtube_description": "youtube-description.txt"}
MAX_NARRATION_WORDS = 45
MAX_CAPTION_CHARS = 44


class ShortError(ValueError):
    pass


def log(msg: str) -> None:
    print(f"[psych {time.strftime('%H:%M:%S')}] {msg}", flush=True)


# ---------------------------------------------------------------- config
def load_short(ep_id: str) -> dict:
    f = SHORTS / ep_id / "episode.json"
    if not f.exists():
        avail = sorted(p.name for p in SHORTS.iterdir() if (p / "episode.json").exists()) if SHORTS.exists() else []
        raise ShortError(f"No psychology short '{ep_id}'. Available: {avail}")
    ep = json.loads(f.read_text())
    validate_short(ep)
    return ep


def validate_short(ep: dict) -> None:
    errs = []
    for k in ("id", "mode", "title", "topic", "core_message", "metaphor", "runtime", "narration", "captions", "beats", "animation", "music", "sfx", "output", "publishing", "publication", "performance"):
        if k not in ep:
            errs.append(f"missing top-level field '{k}'")
    if errs:
        raise ShortError("; ".join(errs))
    if ep["mode"] != "psychology-shorts":
        errs.append("mode must be 'psychology-shorts'")
    if ep.get("clip"):
        for k in ("src", "at"):
            if k not in ep["clip"]:
                errs.append(f"clip needs '{k}'")
    if not (ROOT / "renderer" / "psych" / "stories" / f"{ep['metaphor']}.js").exists():
        errs.append(f"no choreography renderer/psych/stories/{ep['metaphor']}.js for metaphor '{ep['metaphor']}'")
    lo, hi = ep["runtime"]["range"]
    tgt = ep["runtime"]["target_seconds"]
    if not (0 < lo <= tgt <= hi):
        errs.append("runtime.target_seconds must lie inside runtime.range")
    if hi > 30:
        errs.append("runtime.range upper bound must be <= 30 s")
    words = sum(len(l["text"].split()) for l in ep["narration"])
    if words > MAX_NARRATION_WORDS:
        errs.append(f"narration has {words} words; keep it under {MAX_NARRATION_WORDS} so the visuals carry the story")
    prev = -1.0
    for i, l in enumerate(ep["narration"]):
        if not l.get("text", "").strip():
            errs.append(f"narration line {i} is empty")
        if l["at"] < prev:
            errs.append("narration lines must be in time order")
        prev = l["at"]
    prev_until = -1.0
    for c in ep["captions"]:
        if len(c["text"]) > MAX_CAPTION_CHARS:
            errs.append(f"caption '{c['text']}' is longer than {MAX_CAPTION_CHARS} chars (phone readability)")
        if not (0 <= c["at"] < c["until"] <= tgt + 0.5):
            errs.append(f"caption '{c['text']}' has a bad time window")
        if c["at"] < prev_until:
            errs.append(f"caption '{c['text']}' overlaps the previous caption")
        prev_until = c["until"]
    if ep.get("hook") and (not ep["hook"].get("lines") or any(len(x) > 16 for x in ep["hook"]["lines"])):
        errs.append("hook.lines must be 1-2 short lines (<= 16 chars each) so they fit at 128 px")
    if ep.get("end_card") and not (0 < ep["end_card"].get("at", 0) < tgt):
        errs.append("end_card.at must lie inside the runtime")
    for s in ep["sfx"]:
        try:
            audio.sfx(s["name"], 1)
        except KeyError:
            errs.append(f"unknown sfx '{s['name']}'")
    from pipeline.audio import CUES
    for c in ep["music"]["cues"]:
        if c["cue"] not in CUES:
            errs.append(f"unknown music cue '{c['cue']}' (choose from {sorted(CUES)})")
    if any(not isinstance(v, (int, float, type(None))) for k, v in ep["performance"].items() if k != "notes"):
        errs.append("performance fields must be numbers or null (never text, never estimates)")
    if "hook_variants" in ep and sum(1 for h in ep["hook_variants"] if h.get("selected")) != 1:
        errs.append("exactly one hook_variants entry must be selected")
    if errs:
        raise ShortError("Episode validation failed:\n  - " + "\n  - ".join(errs))


# ---------------------------------------------------------------- orbit schedule (single source of truth for picture and footsteps)
def orbit_schedule(anim: dict, total: float, hz: int = 60) -> dict:
    """Angle of figure A around the sphere over time. Speeds up in the escalation beat, freezes during study
    pauses, decelerates to a stop at the left-hand point (angle == pi mod 2pi) at stop_time, then holds."""
    pauses = anim.get("study_pauses", [])
    w1, w2 = 2 * math.pi / 2.8, 2 * math.pi / 1.9
    fast_at = anim.get("escalation_start", 4.6)
    stop = anim["stop_time"]; decel0 = stop - 1.3
    dt = 1 / 480
    a = 0.3; t = 0.0; angles = []; next_sample = 0.0
    a_decel = None; a_target = None

    def smooth(u):
        u = min(max(u, 0.0), 1.0); return u * u * (3 - 2 * u)

    while t <= total + 1e-9:
        if t >= next_sample - 1e-9:
            angles.append(round(a, 5)); next_sample += 1 / hz
        if t < decel0:
            w = w1 + (w2 - w1) * smooth((t - fast_at) / 0.6)
            for p0, p1 in pauses:
                w *= 1 - smooth((t - p0) / 0.25) * (1 - smooth((t - p1 + 0.25) / 0.25))
            a += w * dt
        elif t < stop:
            if a_decel is None:
                a_decel = a
                k = math.ceil((a_decel + 0.9 - math.pi) / (2 * math.pi))
                a_target = math.pi + 2 * math.pi * k
            u = (t - decel0) / (stop - decel0)
            a = a_decel + (a_target - a_decel) * (1 - (1 - u) ** 2)
        else:
            a = a_target if a_target is not None else a
        t += dt
    return {"hz": hz, "angles": angles, "stop_angle": a_target}


def _foot_x(phase: float, stride: float, side: int) -> float:
    """Leg forward kinematics, figure-local x of a foot (mirrors renderer/psych/engine.js leg())."""
    ph = phase + (0.0 if side > 0 else math.pi)
    th = math.radians(32 * stride * math.sin(ph))
    bend = math.radians(56 * stride * max(0.0, math.cos(ph)))
    return side * 4 + math.sin(th) * 84 + math.sin(th - bend) * 82


def walk_schedule(anim: dict, total: float, hz: int = 60) -> dict:
    """A straight approach as ONE smooth motion. The body eases in once and out once over the whole walk; the leg
    phase is solved from distance travelled so the stance foot stays planted (no sliding, no per-step lurch).
    Returns 60 Hz samples of body x and phase, the computed start x, and the footfall times for the soundtrack."""
    w = anim["walk"]; S = anim["figure_scale"]; stride = w["stride"]; n = int(w["steps"])
    # distance(phase): advance the body while the stance leg (the straight one) stays planted
    dp = 0.002; ph = 0.0; x = 0.0
    stance = 1 if math.cos(0.0) <= 0 else -1          # left leg swings first (cos > 0 => left bent), right is stance
    planted = x + S * _foot_x(0.0, stride, stance)
    table_ph, table_x, handovers = [0.0], [0.0], []
    while ph < n * math.pi - 1e-9:
        nxt = ph + dp
        k_old = math.floor((ph + math.pi / 2) / math.pi); k_new = math.floor((nxt + math.pi / 2) / math.pi)
        if k_new != k_old:                              # stance change at phase = pi/2 + k*pi: plant the other foot
            x = planted - S * _foot_x(nxt, stride, stance)
            stance = -stance; planted = x + S * _foot_x(nxt, stride, stance); handovers.append(nxt)
        else:
            x = planted - S * _foot_x(nxt, stride, stance)
        ph = nxt; table_ph.append(ph); table_x.append(x)
    D = table_x[-1]
    t0, t1 = w["start"], w["end"]
    start_x = w["end_x"] - D
    def ease(u):
        u = min(max(u, 0.0), 1.0); return u * u * (3 - 2 * u)
    xs, phs, footfalls = [], [], []
    hand_i = 0; t = 0.0
    n_samples = int(total * hz) + 2
    for i in range(n_samples):
        t = i / hz
        d = D * ease((t - t0) / (t1 - t0))
        j = int(np.searchsorted(table_x, d)); j = min(max(j, 0), len(table_ph) - 1)
        phase = table_ph[j]
        xs.append(round(start_x + d, 3)); phs.append(round(phase, 5))
        while hand_i < len(handovers) and phase >= handovers[hand_i]:
            footfalls.append(round(t, 3)); hand_i += 1
    footfalls.append(round(t1, 3))                      # the last foot closes up at the stop
    return {"hz": hz, "x": xs, "phase": phs, "start_x": round(start_x, 2), "distance": round(D, 2), "footfalls": footfalls,
            "peak_speed_px_s": round(1.5 * D / (t1 - t0), 1)}


def bounce_track(b: dict, total: float, g: float, hz: int = 120) -> dict:
    """Exact ballistic bounce. A ball starts at b['start'] from height b['h0'] (px above the floor), falls under g,
    and on each impact leaves with speed e * v_in, plus an optional push so that the next apex is multiplied by
    b['push'] (capped at b['cap']). Returns height samples, vertical velocity samples, and impact times/speeds."""
    e = float(b.get("restitution", 1.0)); push = float(b.get("push", 1.0)); cap = float(b.get("cap", 1e9)); rest_v = float(b.get("rest_speed", 60.0))
    t, h, v = float(b["start"]), float(b["h0"]), 0.0      # v is upward velocity (px/s)
    events = []                                           # (t, v_impact)
    segs = []                                             # (t0, h0, v0, t1) ballistic segments
    resting_from = None
    while t < total:
        # time to hit the floor from height h with upward velocity v: h + v*T - g*T^2/2 = 0
        T = (v + math.sqrt(v * v + 2 * g * h)) / g
        segs.append((t, h, v, t + T)); t += T
        v_in = v - g * T                                  # negative (downward)
        events.append((round(t, 4), round(-v_in, 1)))
        apex_prev = (v_in * v_in) / (2 * g)
        if push != 1.0:
            apex = min(cap, apex_prev * push) if push > 1 else apex_prev * push
            v = math.sqrt(2 * g * apex)
        else:
            v = -v_in * e
        h = 0.0
        if v < rest_v:
            resting_from = t; break
    ys, vs = [], []
    for i in range(int(total * hz) + 2):
        tt = i / hz
        if tt < b["start"]:
            ys.append(float(b["h0"])); vs.append(0.0); continue
        seg = next((sg for sg in segs if sg[0] <= tt < sg[3]), None)
        if seg is None:
            ys.append(0.0); vs.append(0.0); continue
        dt = tt - seg[0]
        ys.append(round(max(0.0, seg[1] + seg[2] * dt - 0.5 * g * dt * dt), 3)); vs.append(round(seg[2] - g * dt, 2))
    return {"hz": hz, "h": ys, "v": vs, "impacts": events, "rest_at": resting_from}


def physics_tracks(ep: dict, total: float) -> dict | None:
    balls = ep["animation"].get("balls")
    if not balls:
        return None
    g = float(ep["animation"].get("gravity", 2600.0))
    return {name: bounce_track(b, total, g) for name, b in balls.items()}


def footsteps(ep: dict, orbit: dict) -> list[tuple[float, str, float]]:
    """Soft footfalls: orbit footfalls inside the escalation window, plus B's entrance walk and A's final walk."""
    fs = ep.get("footsteps") or {}
    ev = []
    anim = ep["animation"]
    for i, ft in enumerate(anim.get("_walk", {}).get("footfalls", [])):
        ev.append((ft, "step", float(fs.get("gain", 0.3)) * (0.85 if i % 2 else 1.0)))
    if not fs or orbit is None or "escalation_window" not in fs:
        return ev
    hz = orbit["hz"]; ang = orbit["angles"]; a0 = ang[0]
    lo, hi = fs["escalation_window"]; g = fs["gain"]
    last = math.floor((ang[0] - a0) * 7 / math.pi)
    for i in range(1, len(ang)):
        k = math.floor((ang[i] - a0) * 7 / math.pi)
        if k != last:
            t = i / hz
            if lo <= t <= hi:
                ev.append((round(t, 3), "step", g * (1.0 if k % 2 else 0.8)))
            last = k
    for (t0, t1) in ((anim["b_enter"], anim["b_arrive"]), tuple(anim["a_walk"])):
        t = t0 + 0.05
        while t < t1 - 0.05:
            ev.append((round(t, 3), "step", g * 1.1)); t += 0.33
    return ev


# ---------------------------------------------------------------- video clips (e.g. a generated Kling shot)
GRADES = {
    "none": "",
    # obsidian/gold brand grade: crushed blacks, slightly desaturated, warm gold in the mids/highs, fine grain, soft vignette
    "brand": "eq=contrast=1.08:brightness=-0.035:saturation=0.82,curves=all='0/0 0.12/0.06 0.5/0.47 1/0.98',"
             "colorbalance=rm=0.06:gm=0.02:bm=-0.07:rh=0.05:gh=0.02:bh=-0.06:rs=0.0:gs=0.0:bs=-0.03,noise=alls=5:allf=t+u,vignette=PI/4.6",
}


def prepare_clip(ep: dict, work: Path, width: int, height: int, fps: int) -> dict | None:
    """Conform the episode's clip to the output size (crop to fill), grade it, and write it as JPEG frames at the
    render fps. Returns the plan entry the renderer uses. Fails loudly if the file is missing."""
    c = ep.get("clip")
    if not c:
        return None
    src = ROOT / c["src"]
    if not src.exists():
        raise ShortError(f"clip not found: {c['src']} (commit the file at that path, e.g. assets/clips/<name>.mp4)")
    meta = json.loads(subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(src)], capture_output=True, text=True, check=True).stdout)
    v = next(st for st in meta["streams"] if st["codec_type"] == "video")
    src_dur = float(meta["format"]["duration"])
    trim = float(c.get("trim_start", 0.0))
    dur = float(c.get("duration") or (src_dur - trim))
    dur = min(dur, src_dur - trim)
    out = work / "clip"; shutil.rmtree(out, ignore_errors=True); out.mkdir(parents=True)
    grade = GRADES[c.get("grade", "brand")]
    # frame rate: motion-interpolate (e.g. Kling's 24 fps -> 30 fps) instead of duplicating every 4th frame, which judders
    from fractions import Fraction
    src_fps = float(Fraction(v.get("r_frame_rate") or f"{fps}/1"))
    smooth = c.get("smooth", "interpolate")
    rate = (f"minterpolate=fps={fps}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" if smooth == "interpolate" and abs(src_fps - fps) > 0.01 else f"fps={fps}")
    vf = f"{rate},scale={width}:{height}:force_original_aspect_ratio=increase:flags=lanczos,crop={width}:{height}" + (("," + grade) if grade else "")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(trim), "-t", str(dur), "-i", str(src), "-vf", vf, "-q:v", "3", str(out / "%05d.jpg")], check=True)
    n = len(list(out.glob("*.jpg")))
    if n < 2:
        raise ShortError("clip produced no frames")
    log(f"clip: {src.name} {v['width']}x{v['height']} -> {n} graded frames at {fps} fps ({dur:.2f}s from {trim:.2f}s)")
    return {"frames_dir": str(out.resolve()), "n_frames": n, "fps": fps, "at": float(c["at"]), "duration": round(n / fps, 3),
            "hold_zoom": float(c.get("hold_zoom", 0.06)), "pre_dim": float(c.get("pre_dim", 0.55)), "fade_in": float(c.get("fade_in", 0.0)),
            "source": {"file": c["src"], "width": v["width"], "height": v["height"], "fps": v.get("r_frame_rate"), "duration": round(src_dur, 3)}}


# ---------------------------------------------------------------- narration
def narrate(ep: dict, length_scale: float) -> list[dict]:
    out = []
    for l in ep["narration"]:
        p = narrate_scene(ep.get("narrator_voice", "en_GB-alba-medium"), l["text"], length_scale)
        x, sr = read_wav(p)
        out.append({"text": l["text"], "at": float(l["at"]), "path": str(p), "duration": round(len(x) / sr, 3)})
    return out


def fit_narration(ep: dict) -> tuple[list[dict], float, list[str]]:
    """Synthesise lines; if a line would run into the next line's start, slow nothing down: speed that line up (<=15%)."""
    warnings = []
    base = round(1.0 / float(ep.get("narration_speed", 1.0)), 3)
    lines = narrate(ep, base)
    total = float(ep["runtime"]["target_seconds"])
    for i, l in enumerate(lines):
        limit = (lines[i + 1]["at"] - 0.25) if i + 1 < len(lines) else total - 0.5
        avail = limit - l["at"]
        if l["duration"] > avail:
            scale = max(0.85, avail / l["duration"])
            p = narrate_scene(ep.get("narrator_voice", "en_GB-alba-medium"), l["text"], round(base * scale, 3))
            x, sr = read_wav(p); l.update(path=str(p), duration=round(len(x) / sr, 3))
            if l["duration"] > avail + 0.05:
                warnings.append(f"line {i + 1} ('{l['text'][:30]}…') still runs {l['duration'] - avail:.2f}s past its slot; shorten it or move the next line")
            elif scale < 0.98:
                warnings.append(f"line {i + 1} sped up x{1 / scale:.2f} to fit its slot")
        l["end"] = round(l["at"] + l["duration"], 3)
    last_end = lines[-1]["end"] if lines else 0
    if last_end + 0.6 > total:
        total = round(last_end + 0.6, 2)
        warnings.append(f"runtime extended to {total}s so the narration is not cut off")
    return lines, total, warnings


# ---------------------------------------------------------------- package files
def srt_time(s: float) -> str:
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{sec:02d},{ms:03d}"


def make_srt(lines: list[dict]) -> str:
    out = []
    for i, l in enumerate(lines, 1):
        out.append(f"{i}\n{srt_time(l['at'])} --> {srt_time(l['end'])}\n{l['text']}\n")
    return "\n".join(out)


def write_package(ep: dict, out: Path, lines: list[dict], total: float) -> list[Path]:
    files = []
    pub = ep["publishing"]; tags = " ".join(pub.get("hashtags", []))
    texts = {
        "instagram-caption.txt": pub["instagram"].rstrip() + ("\n\n" + tags if tags else "") + "\n",
        "tiktok-caption.txt": pub["tiktok"].rstrip() + ("\n\n" + tags if tags else "") + "\n",
        "youtube-title.txt": pub["youtube_title"].strip() + "\n",
        "youtube-description.txt": pub["youtube_description"].rstrip() + ("\n\n" + tags if tags else "") + "\n",
        "hashtags.txt": "\n".join(pub.get("hashtags", [])) + "\n",
        "subtitles.srt": make_srt(lines),
    }
    if lines:
        texts["transcript.txt"] = "\n".join(f"[{l['at']:5.2f}s] {l['text']}" for l in lines) + "\n"
    bar = "=" * 40
    texts["CAPTIONS.txt"] = "\n".join([
        f"{ep.get('brand', 'THE HIDDEN PATTERN')} — {ep['title']}", "", bar, "INSTAGRAM / REELS", bar, texts["instagram-caption.txt"].rstrip(), "",
        bar, "TIKTOK", bar, texts["tiktok-caption.txt"].rstrip(), "",
        bar, "YOUTUBE TITLE", bar, texts["youtube-title.txt"].rstrip(), "",
        bar, "YOUTUBE DESCRIPTION", bar, texts["youtube-description.txt"].rstrip(), ""]) + "\n"
    for name, body in texts.items():
        (out / name).write_text(body, encoding="utf-8"); files.append(out / name)
    (out / "episode.json").write_text(json.dumps(ep, indent=2, ensure_ascii=False) + "\n"); files.append(out / "episode.json")
    return files


# ---------------------------------------------------------------- QA beyond pipeline.verify
def luma_stats(png: Path) -> dict:
    from PIL import Image
    im = Image.open(png).convert("L"); a = np.asarray(im, dtype=np.float32)
    return {"mean": round(float(a.mean()), 2), "bright_fraction": round(float((a > 110).mean()), 4), "mid_fraction": round(float((a > 60).mean()), 4)}


def qa_frames(ep: dict, mp4: Path, qa_dir: Path, total: float, fps: int) -> dict:
    qa_dir.mkdir(parents=True, exist_ok=True)
    marks = {"opening_first_frame": 0.0}
    for b in ep["beats"]:
        marks[f"beat_{b['id']}"] = round(min(total - 0.1, (b["start"] + b["end"]) / 2), 2)
    marks["ending_last_frame"] = None   # taken relative to the end of the file so it is always the final frame
    res = {"frames": {}}
    for name, t in marks.items():
        f = qa_dir / f"{name}.png"
        seek = ["-sseof", "-0.12"] if t is None else ["-ss", str(t)]
        subprocess.run(["ffmpeg", "-v", "error", "-y", *seek, "-i", str(mp4), "-frames:v", "1", str(f)], check=True)
        res["frames"][name] = {"t": t if t is not None else "end", "file": str(f), **luma_stats(f)}
    # every frame: mean luma (blank-frame detection on a deliberately dark palette: a blank frame is ~ background level)
    r = subprocess.run(["ffmpeg", "-v", "info", "-i", str(mp4), "-vf", "signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-an", "-f", "null", "-"], capture_output=True, text=True)
    ys = [float(x.split("=")[1]) for x in r.stderr.split() if x.startswith("lavfi.signalstats.YAVG=")]
    res["frames_checked"] = len(ys)
    res["min_yavg"] = round(min(ys), 2) if ys else None
    f0 = res["frames"]["opening_first_frame"]   # a visual = either bright marks (figure, text) or a drawn object (mid-luma shapes on the black field)
    res["first_frame_has_visual"] = bool(f0["bright_fraction"] > 0.002 or f0["mid_fraction"] > 0.01)
    res["no_blank_frames"] = bool(ys) and min(ys) > 16.5     # pure background measures ~14.6; any figure/text/sphere lifts it
    res["animation_changes_throughout"] = True
    if ys:
        step = max(1, int(fps * 0.5)); chunks = [np.mean(ys[i:i + step]) for i in range(0, len(ys), step)]
        res["animation_changes_throughout"] = bool(np.std(ys[:len(ys) // 2]) > 0.05 and np.std(ys[len(ys) // 2:]) > 0.05)
    res["all_passed"] = all(v for k, v in res.items() if isinstance(v, bool))
    return res


def audio_qa(mix_path: Path, lines: list[dict], music_only: Path) -> dict:
    import wave
    with wave.open(str(mix_path)) as w:
        sr = w.getframerate(); d = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).reshape(-1, 2).mean(axis=1) / 32768
    def rms(a, b):
        x = d[int(a * sr):int(b * sr)]; return 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-9) if len(x) else -120
    res = {"speech_rms_db": [round(rms(l["at"], l["end"]), 1) for l in lines]}
    gaps = []
    for i, l in enumerate(lines):
        g0 = l["end"] + 0.1; g1 = lines[i + 1]["at"] - 0.1 if i + 1 < len(lines) else len(d) / sr
        if g1 - g0 > 0.4:
            gaps.append(round(rms(g0, g1), 1))
    res["bed_rms_db_between_lines"] = gaps
    res["narration_above_bed"] = bool((not lines) or (min(res["speech_rms_db"]) - max(gaps or [-60]) >= 6))
    res["narration_audible"] = bool((not lines) or min(res["speech_rms_db"]) > -24)
    tail = d[int((len(d) / sr - 0.3) * sr):]
    res["ending_tail_db"] = round(20 * np.log10(np.sqrt((tail ** 2).mean()) + 1e-9), 1)
    res["ending_not_abrupt"] = bool(res["ending_tail_db"] < -20)
    res["peak"] = round(float(np.abs(d).max()), 3)
    res["no_clipping"] = bool(res["peak"] < 0.999)
    res["all_passed"] = all(v for k, v in res.items() if isinstance(v, bool))
    return res


# ---------------------------------------------------------------- main
def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("episode"); ap.add_argument("--seed", default="1"); ap.add_argument("--quality", choices=QUALITY, default="final")
    ap.add_argument("--out", default=None); ap.add_argument("--reuse-video", action="store_true")
    args = ap.parse_args(argv)
    try:
        ep = load_short(args.episode)
    except ShortError as e:
        log(f"ERROR {e}"); return 2
    seed = int(args.seed); q = QUALITY[args.quality]
    out = Path(args.out) if args.out else ROOT / ep["output"]["dir"]
    work = out / "work"; work.mkdir(parents=True, exist_ok=True)
    video_name = ep["output"].get("video", "video.mp4")
    final = out / video_name
    # never overwrite a previous successful render silently
    if final.exists() and (out / "production-report.txt").exists() and not args.reuse_video:
        stamp = time.strftime("%Y%m%d-%H%M%S", time.gmtime(final.stat().st_mtime))
        arch = out / "archive" / stamp; arch.mkdir(parents=True, exist_ok=True)
        for f in (final, out / "production-report.txt", out / "thumbnail.png"):
            if f.exists():
                shutil.move(str(f), arch / f.name)
        log(f"previous render preserved in {arch}")
    log(f"episode={ep['id']} seed={seed} quality={args.quality} -> {out}")

    # 1. narration
    log("narration: Piper (cached per line)")
    lines, total, warns = fit_narration(ep)
    for w in warns:
        log(f"warning: {w}")
    lo, hi = ep["runtime"]["range"]
    log(f"runtime {total:.2f}s (range {lo}-{hi}s); narration {sum(len(l['text'].split()) for l in lines)} words in {len(lines)} lines")
    if not (lo <= total <= hi):
        log(f"ERROR: runtime {total:.2f}s outside {lo}-{hi}s"); return 3

    # 2. orbit schedule + audio
    orbit = orbit_schedule(ep["animation"], total) if "orbit" in ep["animation"] else None
    walk = walk_schedule(ep["animation"], total) if "walk" in ep["animation"] else None
    tracks = physics_tracks(ep, total)
    if tracks:
        for name, tr in tracks.items():
            b = ep["animation"]["balls"][name]; vmax = max(v for _, v in tr["impacts"]) if tr["impacts"] else 1
            for at, v in tr["impacts"]:
                g_ = float(b.get("sound_gain", 0.6)) * (0.25 + 0.75 * (v / vmax))
                if at < total - 0.2:
                    ep.setdefault("_physics_sfx", []).append((round(at, 3), b.get("sound", "bounce"), round(g_, 3)))
            log(f"physics: {name} {len(tr['impacts'])} impacts" + (f", rests at {tr['rest_at']:.2f}s" if tr["rest_at"] else ", still moving at the end"))
    if walk:
        ep["animation"]["_walk"] = {"footfalls": walk["footfalls"], "start_x": walk["start_x"], "distance": walk["distance"], "peak_speed_px_s": walk["peak_speed_px_s"]}
        log(f"walk: {walk['distance']}px in {len(walk['footfalls'])} footfalls, peak {walk['peak_speed_px_s']} px/s, starts at x={walk['start_x']}")
    cues = ep["music"]["cues"]
    tl = [{"start": c["start"], "end": (cues[i + 1]["start"] if i + 1 < len(cues) else total), "music_cue": c["cue"]} for i, c in enumerate(cues)]
    log("audio: composing music bed and effects")
    music = audio.compose(tl, total, seed, bpm=ep["music"].get("bpm", 80), key_semi=ep["music"].get("key_offset", -3))
    sfx_events = []
    for s in ep["sfx"]:
        for k in range(int(s.get("repeat", 1))):
            at = s["at"] + k * float(s.get("every", 0))
            if at < total:
                sfx_events.append((round(at, 3), s["name"], float(s.get("gain", 1.0))))
    sfx_events += footsteps(ep, orbit)
    sfx_events += ep.pop("_physics_sfx", [])
    clips = [(l["at"], *read_wav(Path(l["path"]))) for l in lines]
    mixed = audio.mix(total, clips, music, sfx_events, seed, music_db=float(ep["music"].get("level_db", -12)), sfx_db=float(ep.get("sfx_level_db", -9)))
    audio.write_wav(work / "mix.wav", mixed); audio.write_wav(work / "music_only.wav", music)

    # 3. plan + render
    try:
        clip = prepare_clip(ep, work, q["width"], q["height"], q["fps"])
    except ShortError as e:
        log(f"ERROR {e}"); return 4
    plan = {"width": q["width"], "height": q["height"], "fps": q["fps"], "crf": q["crf"], "preset": q["preset"], "seed": seed, "total": total,
            "episode": ep, "orbit": orbit, "walk": walk, "clip": clip, "tracks": tracks,
            "subframes": (4 if ep.get("motion_blur") is True else int(ep.get("motion_blur") or 1)), "story_js": f"renderer/psych/stories/{ep['metaphor']}.js",
            "narration": [{k: v for k, v in l.items() if k != "path"} for l in lines], "sfx_events": sfx_events}
    (work / "plan.json").write_text(json.dumps(plan))
    silent = work / "video_silent.mp4"
    if args.reuse_video and silent.exists():
        log("render: skipped (--reuse-video)")
    else:
        log(f"render: {q['width']}x{q['height']} @ {q['fps']}fps, {round(total * q['fps'])} frames")
        r = subprocess.run(["node", str(ROOT / "pipeline" / "psych_render.mjs"), "video", str(work / "plan.json"), str(silent)], cwd=ROOT)
        if r.returncode != 0:
            log("ERROR: frame rendering failed"); return 5
    log("mux: H.264 + AAC")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(silent), "-i", str(work / "mix.wav"), "-c:v", "copy", "-c:a", "aac", "-b:a", "160k",
                    "-movflags", "+faststart", "-shortest", str(final)], check=True)

    # 4. thumbnail + package
    log("thumbnail: rendering cover")
    r = subprocess.run(["node", str(ROOT / "pipeline" / "psych_render.mjs"), "cover", str(work / "plan.json"), str(out / ep["output"].get("thumbnail", "thumbnail.png"))], cwd=ROOT)
    if r.returncode != 0:
        log("ERROR: cover rendering failed"); return 5
    pkg = write_package(ep, out, lines, total)

    # 5. verify + QA
    log("verify: ffprobe, full decode, loudness, contact sheet")
    rep = verify(final, expected_duration=total, width=q["width"], height=q["height"], fps=q["fps"], contact_sheet=out / "contact_sheet.png")
    rep["qa_visual"] = qa_frames(ep, final, out / "qa", total, q["fps"])
    rep["qa_audio"] = audio_qa(work / "mix.wav", lines, work / "music_only.wav")
    rep["narration_warnings"] = warns
    (out / "verify.json").write_text(json.dumps(rep, indent=2))
    checks = {**rep["checks"], **{f"visual.{k}": v for k, v in rep["qa_visual"].items() if isinstance(v, bool) and k != "all_passed"},
              **{f"audio.{k}": v for k, v in rep["qa_audio"].items() if isinstance(v, bool) and k != "all_passed"}}
    all_ok = all(checks.values())
    for k, v in checks.items():
        log(f"  {'PASS' if v else 'FAIL'} {k}")
    report = [f"PSYCHOLOGY SHORTS — production report", f"episode: {ep['id']}  ({ep['title']})", f"rendered: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}",
              f"seed: {seed}  quality: {args.quality}", "",
              f"video: {final}", f"  {rep['width']}x{rep['height']} @ {rep['fps']} fps, {rep['duration']} s, {rep['video_codec']} + {rep['audio_codec']}, {rep['size_bytes'] / 1e6:.2f} MB",
              f"  mean volume {rep['mean_volume_db']} dB, peak {rep['max_volume_db']} dB", "",
              "hook selected: " + next((f"{h['id']} — {h['text']}" for h in ep.get("hook_variants", []) if h.get("selected")), "n/a"),
              f"narration: {sum(len(l['text'].split()) for l in lines)} words / {len(lines)} lines", *[f"  [{l['at']:5.2f}–{l['end']:5.2f}] {l['text']}" for l in lines], "",
              "checks:", *[f"  {'PASS' if v else 'FAIL'} {k}" for k, v in checks.items()],
              *(["warnings:"] + [f"  {w}" for w in warns] if warns else []), "",
              "files:", f"  {final.name}", f"  {ep['output'].get('thumbnail', 'thumbnail.png')}", "  contact_sheet.png", "  verify.json", *[f"  {p.name}" for p in pkg],
              "  qa/ (opening, beat and ending frames)", "", f"result: {'ALL CHECKS PASSED' if all_ok else 'FAILED CHECKS — see above'}"]
    (out / "production-report.txt").write_text("\n".join(report) + "\n")
    log(f"{'OK' if all_ok else 'FAILED CHECKS'}: {final} ({rep['size_bytes'] / 1e6:.1f} MB, {rep['duration']}s)")
    return 0 if all_ok else 6


if __name__ == "__main__":
    sys.exit(main())
