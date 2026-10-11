"""Long-form (16:9) documentary builder. Separate from the Shorts pipeline: it imports the shared narration,
audio and verify helpers read-only and never changes their defaults.

film.json -> narration (Piper, cached) -> timeline from real clip lengths -> captions (SRT/VTT/transcript)
          -> score + sfx + mix -> parallel Chromium frame render -> mux (AAC, loudness-normalised) -> verify

usage: python -m documentary.build <film_dir> [--out DIR] [--workers N] [--plan-only] [--stills] [--reuse-video PATH]
Outputs go to output/true-crime-documentary/<run-id>/ unless --out is given; an existing folder is never overwritten.
"""
from __future__ import annotations
import argparse, json, re, subprocess, sys, time
from pathlib import Path
import numpy as np

from pipeline import audio
from pipeline.narrate import narrate_scene, read_wav
from pipeline.verify import verify

ROOT = Path(__file__).resolve().parent.parent
W, H, FPS = 1920, 1080, 30
TEMPLATES = {"title", "date", "kinetic", "stat", "quote", "doc", "split", "profile", "verdict", "question", "list",
             "timeline", "clock", "board", "map", "scene", "endcard", "black"}
SFX = {"sparkle", "flutter", "paper", "thud", "stamp", "coins", "drain", "water", "gate", "brake", "sting", "chime", "ping",
       "rumble", "rain", "buzz", "thump", "step", "pen", "door", "swell", "tick", "puff", "beep", "static", "whoosh"}


def log(msg: str) -> None:
    print(f"[doc {time.strftime('%H:%M:%S')}] {msg}", flush=True)


class FilmError(ValueError):
    pass


def load_film(film_dir: Path) -> dict:
    film = json.loads((film_dir / "film.json").read_text())
    errs = []
    for k in ("id", "title", "voice", "lines"):
        if k not in film:
            errs.append(f"missing key {k}")
    for i, ln in enumerate(film.get("lines", [])):
        if not ln.get("shots"):
            errs.append(f"line {i}: no shots")
        if "say" not in ln and "silence" not in ln:
            errs.append(f"line {i}: needs 'say' or 'silence'")
        for s in ln.get("shots", []):
            if s.get("type") not in TEMPLATES:
                errs.append(f"line {i}: unknown shot type {s.get('type')}")
        for fx in ln.get("sfx", []):
            if fx["name"] not in SFX:
                errs.append(f"line {i}: unknown sfx {fx['name']}")
    if errs:
        raise FilmError("; ".join(errs))
    return film


def tts_text(film: dict, ln: dict) -> str:
    """Spoken form: explicit 'tts' wins; otherwise the caption text with pronunciation/number substitutions."""
    if ln.get("tts"):
        t = ln["tts"]
    else:
        t = ln["say"]
        for a, b in film.get("spoken", {}).items():
            t = t.replace(a, b)
    for word, ph in film.get("pronounce", {}).items():
        t = re.sub(rf"\b{re.escape(word)}\b", ph, t)
    return t


# ------------------------------------------------------------------ captions
def chunk_caption(text: str, max_chars: int = 42, max_lines: int = 2) -> list[str]:
    """Split a sentence into caption cues of <= max_lines lines of <= max_chars, preferring punctuation breaks."""
    words = text.split()
    cues, cur = [], []
    def fits(ws):
        lines, line = [], ""
        for w in ws:
            t = (line + " " + w).strip()
            if len(t) > max_chars and line:
                lines.append(line); line = w
            else:
                line = t
        lines.append(line)
        return len(lines) <= max_lines, lines
    for w in words:
        ok, _ = fits(cur + [w])
        if not ok:
            # back up to the last punctuation inside the cue if it leaves a reasonable remainder
            cut = max((i for i, x in enumerate(cur) if re.search(r"[,;:.?!—]$", x) and i >= len(cur) // 2), default=None)
            if cut is not None and cut < len(cur) - 1:
                cues.append(cur[:cut + 1]); cur = cur[cut + 1:]
            else:
                cues.append(cur); cur = []
        cur.append(w)
    if cur:
        cues.append(cur)
    out = []
    for c in cues:
        out.append("\n".join(balance(c, max_chars)))
    return out


def balance(words: list[str], max_chars: int = 42) -> list[str]:
    """One line if it fits; otherwise the two-line split with the most even lengths (no orphaned last word)."""
    one = " ".join(words)
    if len(one) <= max_chars:
        return [one]
    best = None
    for k in range(1, len(words)):
        a, b = " ".join(words[:k]), " ".join(words[k:])
        if len(a) <= max_chars and len(b) <= max_chars:
            score = abs(len(a) - len(b)) - (6 if re.search(r"[,;:.?!—]$", words[k - 1]) else 0)
            if best is None or score < best[0]:
                best = (score, [a, b])
    return best[1] if best else [one[:max_chars], one[max_chars:]]


def fmt_ts(t: float, sep: str = ",") -> str:
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}{sep}{ms:03d}"


def build_captions(timeline: list[dict]) -> list[dict]:
    cues = []
    for ln in timeline:
        if not ln.get("say"):
            continue
        parts = chunk_caption(ln["say"])
        a, b = ln["narration_at"], ln["narration_end"]
        weights = [len(p.replace("\n", " ")) + 6 for p in parts]
        tot = sum(weights); t = a
        for p, w in zip(parts, weights):
            d = (b - a) * w / tot
            cues.append({"start": round(t, 3), "end": round(t + d, 3), "text": p})
            t += d
    # never let a cue flash: extend short cues into following silence where possible
    for i, c in enumerate(cues):
        nxt = cues[i + 1]["start"] if i + 1 < len(cues) else c["end"] + 2
        if c["end"] - c["start"] < 1.0:
            c["end"] = round(min(nxt - 0.05, c["start"] + 1.0), 3)
    return cues


def write_captions(cues: list[dict], out: Path) -> None:
    srt = [f"{i}\n{fmt_ts(c['start'])} --> {fmt_ts(c['end'])}\n{c['text']}\n" for i, c in enumerate(cues, 1)]
    (out / "captions.srt").write_text("\n".join(srt))
    vtt = ["WEBVTT\n"] + [f"{fmt_ts(c['start'], '.')} --> {fmt_ts(c['end'], '.')}\n{c['text']}\n" for c in cues]
    (out / "captions.vtt").write_text("\n".join(vtt))


# ------------------------------------------------------------------ audio
def drone(total: float, key_hz: float = 55.0, seed: int = 1) -> np.ndarray:
    """Low sustained bed under the whole film: two detuned sines + filtered noise breathing slowly."""
    sr = audio.SR; n = int(total * sr); t = np.arange(n) / sr
    rng = np.random.default_rng(seed)
    lfo = 0.6 + 0.4 * np.sin(2 * np.pi * t / 23.0)
    x = (np.sin(2 * np.pi * key_hz * t) + 0.6 * np.sin(2 * np.pi * key_hz * 1.4983 * t + 0.4) + 0.35 * np.sin(2 * np.pi * key_hz * 2.003 * t)) * lfo
    nz = audio.lowpass_fast(rng.standard_normal(n).astype(np.float32), 300) * (0.5 + 0.5 * np.sin(2 * np.pi * t / 17.0))
    y = (x * 0.05 + nz * 0.08).astype(np.float32)
    f = int(3 * sr); y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f)
    return y


def mux(silent: Path, mix_wav: Path, final: Path, I: float = -16.0, TP: float = -2.0, LRA: float = 11.0) -> dict:
    """Copy the video stream; loudness-normalise the mix in two passes (measure, then linear gain) and encode AAC."""
    meas = subprocess.run(["ffmpeg", "-v", "info", "-i", str(mix_wav), "-af", f"loudnorm=I={I}:TP={TP}:LRA={LRA}:print_format=json", "-f", "null", "-"],
                          capture_output=True, text=True).stderr
    m = json.loads(meas[meas.rindex("{"): meas.rindex("}") + 1])
    af = (f"loudnorm=I={I}:TP={TP}:LRA={LRA}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
          f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(silent), "-i", str(mix_wav), "-map", "0:v:0", "-map", "1:a:0",
                    "-c:v", "copy", "-af", af, "-ar", "48000", "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", "-shortest", str(final)], check=True)
    return m


# ------------------------------------------------------------------ main
def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("film_dir")
    ap.add_argument("--out", default=None)
    ap.add_argument("--workers", type=int, default=4)
    ap.add_argument("--plan-only", action="store_true")
    ap.add_argument("--stills", action="store_true", help="also render one PNG per shot midpoint for review")
    ap.add_argument("--reuse-video", default=None, help="skip frame rendering and mux this silent video instead")
    args = ap.parse_args(argv)
    film_dir = Path(args.film_dir)
    try:
        film = load_film(film_dir)
    except FilmError as e:
        log(f"ERROR {e}"); return 2

    if args.out:
        out = Path(args.out)
    else:
        base = ROOT / "output" / "true-crime-documentary"
        stamp = time.strftime("%Y%m%d"); k = 1
        while (base / f"{film['id']}-{stamp}-run{k}").exists():
            k += 1
        out = base / f"{film['id']}-{stamp}-run{k}"
    out.mkdir(parents=True, exist_ok=True)
    log(f"film={film['id']} -> {out}")

    # 1. narration
    voice, ls = film["voice"], float(film.get("length_scale", 1.0))
    t = float(film.get("lead_in", 0.8)); timeline = []
    log(f"narration: {sum(1 for l in film['lines'] if l.get('say'))} lines with {voice}")
    for i, ln in enumerate(film["lines"]):
        if ln.get("say"):
            p = narrate_scene(voice, tts_text(film, ln), ls * float(ln.get("speed", 1.0)))
            x, sr = read_wav(p); nd = len(x) / sr
            pre = float(ln.get("pre", 0.0))
            dur = max(float(ln.get("min", 0)), pre + nd + float(ln.get("pause", film.get("pause", 0.32))))
            timeline.append({"i": i, "start": round(t, 3), "end": round(t + dur, 3), "narration_at": round(t + pre, 3),
                             "narration_end": round(t + pre + nd, 3), "say": ln["say"], "wav": str(p)})
        else:
            dur = float(ln["silence"])
            timeline.append({"i": i, "start": round(t, 3), "end": round(t + dur, 3)})
        t += dur
    total = round(t + float(film.get("tail", 0.0)), 3)
    timeline[-1]["end"] = total
    log(f"timeline: {len(timeline)} lines, {total:.1f}s ({total / 60:.2f} min)")

    # 2. shots: split each line's span by weights; carry chapter tag and cues
    shots, chapter, cue, chapters = [], "", film.get("cue", "unease"), []
    for tl, ln in zip(timeline, film["lines"]):
        if ln.get("chapter"):
            chapter = ln.get("tag", ln["chapter"]); chapters.append({"t": tl["start"], "title": ln.get("chapter_title", ln["chapter"])})
        cue = ln.get("cue", cue); tl["music_cue"] = cue; tl["chapter"] = chapter
        ws = [float(s.get("w", 1)) for s in ln["shots"]]; span = tl["end"] - tl["start"]; a = tl["start"]
        for s, w in zip(ln["shots"], ws):
            d = span * w / sum(ws)
            shots.append({**s, "i": len(shots), "line": tl["i"], "start": round(a, 4), "end": round(a + d, 4), "chapterTag": s.get("chapterTag", chapter)})
            a += d
    shots[0]["start"] = 0.0  # picture from the very first frame; the lead-in only delays the narration
    shots[-1]["end"] = total
    durs = [s["end"] - s["start"] for s in shots]
    log(f"shots: {len(shots)} visual beats, mean {np.mean(durs):.2f}s, max {max(durs):.2f}s, min {min(durs):.2f}s")

    # 3. captions + transcript
    cues = build_captions(timeline)
    write_captions(cues, out)
    tr = [f"# {film['title']} — transcript\n", f"Narration transcript generated from the final script ({len(cues)} caption cues).\n"]
    cur_ch = None
    for tl in timeline:
        if tl.get("chapter") != cur_ch and tl.get("chapter"):
            cur_ch = tl["chapter"]; tr.append(f"\n## [{fmt_ts(tl['start'])[:8]}] {cur_ch}\n")
        if tl.get("say"):
            tr.append(f"**{fmt_ts(tl['narration_at'])[3:8]}** {tl['say']}\n")
    (out / "transcript.md").write_text("\n".join(tr))

    # 4. audio
    log("audio: score, drone, sfx, mix")
    segs = [{"start": tl["start"], "end": tl["end"], "music_cue": tl["music_cue"]} for tl in timeline]
    music = audio.compose(segs, total, int(film.get("seed", 1)), bpm=int(film.get("bpm", 72)), key_semi=int(film.get("key", -3)))
    bed = drone(total)
    music = (music[: len(bed)] + bed[: len(music)]).astype(np.float32)
    clips = [(tl["narration_at"], *read_wav(Path(tl["wav"]))) for tl in timeline if tl.get("wav")]
    events = []
    for tl, ln in zip(timeline, film["lines"]):
        for fx in ln.get("sfx", []):
            events.append((tl["start"] + float(fx.get("at", 0)), fx["name"], float(fx.get("gain", 1.0))))
    mixed = audio.mix(total, clips, music, events, int(film.get("seed", 1)), music_db=float(film.get("music_db", -14)),
                      sfx_db=float(film.get("sfx_db", -11)), duck_db=float(film.get("duck_db", -9)))
    audio.write_wav(out / "mix.wav", mixed)

    # 5. plan + edit manifest
    plan = {"fps": FPS, "width": W, "height": H, "crf": int(film.get("crf", 20)), "preset": film.get("preset", "medium"), "shots": shots, "timeline": film.get("timeline", [])}
    (out / "plan.json").write_text(json.dumps(plan))
    manifest = {"film": film["id"], "title": film["title"], "duration_s": total, "fps": FPS, "resolution": [W, H],
                "visual_beats": len(shots), "chapters": chapters,
                "lines": [{k: v for k, v in tl.items() if k != "wav"} for tl in timeline],
                "shots": [{k: v for k, v in s.items() if k in ("i", "line", "type", "variant", "start", "end", "chapterTag", "source", "label", "text", "lines", "name", "caption")} for s in shots],
                "sfx": [{"t": round(a, 3), "name": n} for a, n, _ in events]}
    (out / "edit-manifest.json").write_text(json.dumps(manifest, indent=1))
    if args.plan_only:
        log(f"plan written: {out / 'plan.json'}"); return 0
    if args.stills:
        times = ",".join(f"{(s['start'] + s['end']) / 2:.2f}" for s in shots)
        subprocess.run(["node", str(ROOT / "documentary" / "render.mjs"), str(out / "plan.json"), "--stills", str(out / "review_stills"), times], check=True)

    # 6. render
    silent = out / "video_silent.mp4"
    if args.reuse_video:
        silent = Path(args.reuse_video); log(f"render: reusing {silent}")
    else:
        log(f"render: {W}x{H} @ {FPS}fps, {round(total * FPS)} frames, {args.workers} workers")
        r = subprocess.run(["node", str(ROOT / "documentary" / "render.mjs"), str(out / "plan.json"), str(silent), "--workers", str(args.workers)], cwd=ROOT)
        if r.returncode != 0:
            log("ERROR: frame rendering failed"); return 5

    # 7. mux with loudness normalisation (YouTube-friendly ~-16 LUFS integrated, -1.5 dBTP)
    final = out / "documentary.mp4"
    log("mux: H.264 + AAC, two-pass loudnorm (-16 LUFS, -2 dBTP)")
    mux(silent, out / "mix.wav", final)

    # 8. verify
    log("verify: streams, codecs, dimensions, fps, duration, full decode, loudness")
    rep = verify(final, expected_duration=total, width=W, height=H, fps=FPS, contact_sheet=out / "contact_sheet.png")
    rep["visual_beats"] = len(shots); rep["caption_cues"] = len(cues)
    (out / "verify.json").write_text(json.dumps(rep, indent=2))
    for k, v in rep["checks"].items():
        log(f"  {'PASS' if v else 'FAIL'} {k}")
    log(f"{'OK' if rep['all_passed'] else 'FAILED CHECKS'}: {final} ({rep['size_bytes'] / 1e6:.1f} MB, {rep['duration']}s)")
    return 0 if rep["all_passed"] else 6


if __name__ == "__main__":
    sys.exit(main())
