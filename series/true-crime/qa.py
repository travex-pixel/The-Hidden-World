"""Verify a rendered Case Files episode and publish it to series/true-crime/output/ with a persistent manifest.

usage: python series/true-crime/qa.py <n>            (n = 1 or 2; the episode must already be built by pipeline.build)
       python series/true-crime/qa.py <n> --render   (build it first: python -m pipeline.build <id> --quality final --seed 1)
       python series/true-crime/qa.py <n> --series series/true-crime-cinematic   (another series folder with its own
                                                       series.json, production_manifest.json, qa/ and output/)

Checks, in addition to pipeline.verify (codec, 1080x1920, 30 fps, decode, loudness, clipping, silence gaps):
  - pipeline.series.series_qa: duration window, no black frames, caption lines inside scenes, narration above music
  - integrated loudness (EBU R128) near the -14 LUFS target, true peak below -1 dBTP
  - optional speech-recognition round trip (sherpa-onnx Whisper tiny.en if installed; see README) -> word error rate
  - representative frames every ~6 s saved to qa/ for visual inspection
The MP4 is copied to output/true_crime_0N.mp4 only if every check passes; the manifest records sha256, metrics and the
next task, and is written after every step so an interrupted session can resume without re-rendering verified work."""
from __future__ import annotations
import argparse, hashlib, json, re, shutil, subprocess, sys, time
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(ROOT))
from pipeline.series import series_qa, sha256  # noqa: E402
from pipeline import audio_qa, caption_safe, engage_qa, motion_qa, shot_manifest  # noqa: E402

TOOLS = HERE / "tools"   # offline speech recogniser, shared by every series folder
SERIES = HERE            # the series folder being verified (switch with --series)
CFG = json.loads((SERIES / "series.json").read_text())
MANIFEST = SERIES / "production_manifest.json"


def use_series(folder: Path) -> None:
    global SERIES, CFG, MANIFEST
    SERIES = folder.resolve(); CFG = json.loads((SERIES / "series.json").read_text()); MANIFEST = SERIES / "production_manifest.json"


def load_manifest() -> dict:
    return json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {"series": CFG["series"], "videos": {}}


def save(m: dict) -> None:
    m["updated"] = time.strftime("%Y-%m-%dT%H:%M:%S")
    MANIFEST.write_text(json.dumps(m, indent=2) + "\n")


def loudness(mp4: Path) -> dict:
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(mp4), "-vn", "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    tail = r[r.rfind("Summary:"):]
    i = re.search(r"I:\s+(-?[\d.]+) LUFS", tail); tp = re.search(r"Peak:\s+(-?[\d.]+) dBFS", tail)
    return {"integrated_lufs": float(i.group(1)) if i else None, "true_peak_dbtp": float(tp.group(1)) if tp else None}


def asr_check(mp4: Path, tl: list, workdir: Path) -> dict | None:
    """Transcribe the final mix with an offline recogniser and compare with the narration script."""
    asr_dir = TOOLS / "asr_model"
    try:
        import sherpa_onnx  # noqa: F401
    except ImportError:
        return None
    if not (asr_dir / "tiny.en-encoder.onnx").exists():
        return None
    sys.path.insert(0, str(TOOLS))
    from asr import transcribe_file, wer
    wav = workdir / "asr_input.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mp4), "-vn", "-ac", "1", "-ar", "16000", str(wav)], check=True)
    hyp = transcribe_file(wav, asr_dir, bounds=[s["start"] for s in tl])   # cut at scene starts (pauses), never mid-sentence
    ref = " ".join(l["text"] for s in tl for l in s.get("lines", []))
    return {"engine": "sherpa-onnx whisper tiny.en", "word_error_rate": round(wer(ref, hyp), 3), "transcript": hyp}


def frames(mp4: Path, dur: float, outdir: Path, every: float = 6.0) -> list[str]:
    outdir.mkdir(parents=True, exist_ok=True); out = []
    t = 0.4
    while t < dur:
        f = outdir / f"frame_{t:05.1f}s.jpg"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", str(mp4), "-frames:v", "1", "-q:v", "3", str(f)], check=True)
        out.append(f.name); t += every
    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("n", type=int); ap.add_argument("--render", action="store_true")
    ap.add_argument("--series", default=None, help="series folder (default: this folder)")
    a = ap.parse_args(argv)
    if a.series:
        use_series(ROOT / a.series if not Path(a.series).is_absolute() else Path(a.series))
    ep = next(e for e in CFG["episodes"] if e["n"] == a.n)
    key = f"{a.n:02d}"; m = load_manifest(); rec = m["videos"].setdefault(key, {})
    rec.update(id=ep["id"], title=ep["youtube_title"], file=ep["file"])
    if a.render:
        qual = ep.get("quality", CFG["quality"])
        rec.update(status="rendering", next_task=f"python -m pipeline.build {ep['id']} --quality {qual} --seed {CFG['seed']}"); save(m)
        r = subprocess.run([sys.executable, "-m", "pipeline.build", ep["id"], "--quality", qual, "--seed", str(CFG["seed"])], cwd=ROOT)
        if r.returncode != 0:
            rec.update(status="failed", error=f"pipeline.build exit {r.returncode}"); save(m); return 1
    out = ROOT / "out" / ep["id"]; src = out / f"{ep['id']}.mp4"
    if not src.exists():
        rec.update(status="not_rendered", next_task=f"python series/true-crime/qa.py {a.n} --render" + (f" --series {a.series}" if a.series else "")); save(m); return 1
    verify = json.loads((out / "verify.json").read_text()); tl = json.loads((out / "timeline.json").read_text())
    qa = series_qa(ep["id"], src, ep.get("duration_limits_s", CFG["duration_limits_s"]))   # short cuts carry their own window
    ld = loudness(src)
    qa["loudness_near_target"] = ld["integrated_lufs"] is not None and abs(ld["integrated_lufs"] - CFG["loudness_lufs"]) <= 1.5
    qa["true_peak_ok"] = ld["true_peak_dbtp"] is not None and ld["true_peak_dbtp"] <= -0.5
    qadir = SERIES / "qa" / f"true_crime_{key}"
    asr = asr_check(src, tl, qadir if qadir.mkdir(parents=True, exist_ok=True) is None else qadir)
    if asr is not None:
        qa["narration_intelligible_asr"] = asr["word_error_rate"] <= 0.25
    # studio checks: captions inside the Shorts safe area, no frozen picture, and (for character-driven episodes)
    # every shot's staging read from the renderer into a per-shot manifest with slideshow-risk scoring
    plan = json.loads((out / "plan.json").read_text()); studio = {}
    if plan["episode"].get("caption_style") == "punch":
        cs = caption_safe.check(plan); studio["captions"] = cs; qa["captions_in_safe_area"] = cs["ok"]
    mq = motion_qa.analyse(src, tl); studio["motion"] = mq; qa["no_frozen_or_static_picture"] = mq["ok"]
    if (plan["episode"].get("engagement_version") or 1) >= 6:
        # v6: moving at frame 0, and the last frame returns to frame 1 (the reel loops on the owner's instruction)
        qa["moving_at_frame_0"] = mq["opening_motion_ok"]
        lm = motion_qa.loop_match(src); studio["loop_match"] = lm; qa["loops_to_frame_1"] = lm <= motion_qa.LOOP_MAX
    aq = audio_qa.analyse(src, out, plan["episode"]); studio["audio"] = aq   # opening dropout, holes, masking, clipping, ending, mono
    for k, v in aq["checks"].items():
        qa[f"audio_{k}"] = v
    eq = engage_qa.analyse(plan, tl, ROOT / "renderer" / "scenes" / f"{ep['id']}.js"); studio["engagement"] = eq   # hook, open loops, peak-end, lesson, question
    if eq["enforced"]:
        for k, v in eq["checks"].items():
            qa[f"engage_{k}"] = v
    if plan["episode"].get("figures"):
        sm = shot_manifest.build(ep["id"], {"series_manifest": str(MANIFEST.relative_to(ROOT)), "video": ep["file"]})
        studio["slideshow_risk"] = sm["slideshow_risk"]; qa["shot_variety_and_character_action"] = sm["slideshow_risk"]["ok"]
        qa["every_shot_sourced_and_tagged"] = all(r["validation"]["claims_sourced"] and r["validation"]["tagged_as_illustration"] for r in sm["shots"])
    if (plan["episode"].get("engagement_version") or 1) >= 10:   # v10: the safety policy runs as checks before export
        from pipeline import safety_qa
        post = ROOT / "episodes" / ep["id"] / "post.md"
        sq = safety_qa.analyse(plan, post.read_text() if post.exists() else None); studio["safety"] = sq
        for k, v in sq["checks"].items():
            qa[f"safety_{k}"] = v
    sampled = frames(src, verify["duration"], qadir)
    shutil.copy2(out / "contact_sheet.png", qadir / "contact_sheet.png")
    (qadir / "verify.json").write_text(json.dumps({"media": verify, "series_qa": qa, "loudness": ld, "asr": asr, "studio": studio}, indent=2))
    ok = bool(verify["all_passed"]) and all(v for v in qa.values() if isinstance(v, bool))
    rec.update(media={k: verify[k] for k in ("duration", "width", "height", "fps", "video_codec", "audio_codec", "size_bytes", "mean_volume_db", "max_volume_db")},
               media_checks=verify["checks"], series_qa=qa, loudness=ld, asr_word_error_rate=None if asr is None else asr["word_error_rate"],
               frames_sampled=len(sampled), qa_dir=str(qadir.relative_to(ROOT)))
    if not ok:
        rec.update(status="failed_qa", next_task="inspect qa/ and fix; then re-run qa.py"); save(m)
        print(json.dumps(rec, indent=2)); return 1
    dst = SERIES / "output" / ep["file"]; dst.parent.mkdir(exist_ok=True); shutil.copy2(src, dst)
    # the Reels cover: frame 1 with the headline fully drawn (engagement headlines are complete at t = 0), saved next to
    # the MP4 so the grid shows the hook, not a mid-sentence frame
    cover = dst.with_name(dst.stem + "_cover.jpg")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "0.2", "-i", str(dst), "-frames:v", "1", "-q:v", "2", str(cover)], check=True)
    # the ready-to-paste post (caption, alt text, seed and pinned comments) travels with the MP4 when the episode has one
    post = ROOT / "episodes" / ep["id"] / "post.md"
    if post.exists():
        shutil.copy2(post, dst.with_name(dst.stem + "_post.txt"))
    shutil.copy2(out / "script.md", qadir / "timed_script.md")
    rec.update(status="verified_automated", sha256=sha256(dst), output=str(dst.relative_to(ROOT)), verified=time.strftime("%Y-%m-%dT%H:%M:%S"),
               next_task="human-style frame review recorded in production_manifest.json 'editorial_review'")
    save(m); print(json.dumps(rec, indent=2)); return 0


if __name__ == "__main__":
    sys.exit(main())
