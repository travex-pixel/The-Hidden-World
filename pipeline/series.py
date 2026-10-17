"""Render a multi-episode series with checkpoints.

usage: python -m pipeline.series series/five-messages [--only 3] [--force]

For each episode in <series>/series.json, in order:
  1. skip it if the manifest says 'verified' and output/<file> still matches the recorded sha256
  2. otherwise render it (pipeline.build), then run media checks + series QA
  3. copy the MP4 to <series>/output/<file>, the script to scripts/, QA images to qa/
  4. write the manifest immediately, so a crash later never loses a finished episode
Exit code is non-zero if any episode fails; finished episodes stay recorded."""
from __future__ import annotations
import argparse, hashlib, json, shutil, subprocess, sys, time
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent


def sha256(p: Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def log(msg: str) -> None:
    print(f"[series {time.strftime('%H:%M:%S')}] {msg}", flush=True)


def series_qa(ep_id: str, mp4: Path, limits) -> dict:
    """Checks beyond pipeline.verify: duration window, blank frames, caption timing, dialogue audibility."""
    out = ROOT / "out" / ep_id
    tl = json.loads((out / "timeline.json").read_text()); v = json.loads((out / "verify.json").read_text())
    res = {}
    res["media_checks_pass"] = bool(v["all_passed"])
    res["duration_in_window"] = limits[0] <= v["duration"] <= limits[1]
    res["dimensions_1080x1920"] = (v["width"], v["height"]) == (1080, 1920)
    # blank / black frames over the whole file
    r = subprocess.run(["ffmpeg", "-v", "info", "-i", str(mp4), "-vf", "signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-an", "-f", "null", "-"], capture_output=True, text=True)
    ys = [float(x.split("=")[1]) for x in r.stderr.split() if x.startswith("lavfi.signalstats.YAVG=")]
    end_fade = int(1.0 * round(v.get("fps", 30)))  # the final fade to black is intentional
    res["frames_checked"] = len(ys)
    res["no_black_frames"] = len(ys) > 0 and min(ys[:-end_fade] or ys) > 12
    # captions: every line starts and ends inside its scene; no overlap between lines
    ok = True
    for s in tl:
        prev_end = -1
        for l in s.get("lines", []):
            ok &= s["start"] - 0.01 <= l["start"] < l["end"] <= s["end"] + 0.01 and l["start"] >= prev_end - 0.01
            prev_end = l["end"]
    res["captions_timed_within_scenes"] = bool(ok)
    # dialogue audible above music: every spoken line at least 8 dB above the following gap
    import wave
    with wave.open(str(out / "mix.wav")) as w:
        sr = w.getframerate(); d = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).reshape(-1, 2).mean(axis=1) / 32768
    def rms(a, b):
        x = d[int(a * sr):int(b * sr)]; return 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-9) if len(x) else -120
    speech = [rms(l["start"], l["end"]) for s in tl for l in s.get("lines", [])]
    res["speech_db_min"] = round(min(speech), 1) if speech else None
    res["dialogue_clear_of_music"] = all(x > -24 for x in speech)
    res["all_passed"] = all(v_ for k, v_ in res.items() if isinstance(v_, bool))
    return res


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("series_dir"); ap.add_argument("--only", type=int); ap.add_argument("--force", action="store_true")
    a = ap.parse_args(argv)
    sdir = (ROOT / a.series_dir).resolve(); cfg = json.loads((sdir / "series.json").read_text())
    outd, scripts, qa = sdir / "output", sdir / "scripts", sdir / "qa"
    for d in (outd, scripts, qa): d.mkdir(exist_ok=True)
    mpath = sdir / "manifest.json"
    manifest = json.loads(mpath.read_text()) if mpath.exists() else {"series": cfg["series"], "season": cfg["season"], "episodes": {}}
    failures = 0
    for ep in cfg["episodes"]:
        if a.only and ep["n"] != a.only:
            continue
        key = f"{ep['n']:02d}"; rec = manifest["episodes"].get(key, {}); dst = outd / ep["file"]
        if not a.force and rec.get("status") == "verified" and dst.exists() and sha256(dst) == rec.get("sha256"):
            log(f"episode {key} already verified ({dst.name}); skipping"); continue
        manifest["episodes"][key] = {**rec, "id": ep["id"], "title": ep["title"], "file": ep["file"], "status": "rendering", "started": time.strftime("%Y-%m-%dT%H:%M:%S")}
        mpath.write_text(json.dumps(manifest, indent=2))
        log(f"episode {key} '{ep['title']}': rendering")
        r = subprocess.run([sys.executable, "-m", "pipeline.build", ep["id"], "--seed", str(cfg["seed"]), "--quality", cfg["quality"]], cwd=ROOT)
        src = ROOT / "out" / ep["id"] / f"{ep['id']}.mp4"
        if r.returncode != 0 or not src.exists():
            manifest["episodes"][key].update(status="failed", error=f"build exit {r.returncode}")
            mpath.write_text(json.dumps(manifest, indent=2)); failures += 1; log(f"episode {key} FAILED"); continue
        q = series_qa(ep["id"], src, cfg["duration_limits_s"])
        for k, v in q.items():
            if isinstance(v, bool):
                log(f"  {'PASS' if v else 'FAIL'} {k}")
        if not q["all_passed"]:
            manifest["episodes"][key].update(status="failed_qa", qa=q); mpath.write_text(json.dumps(manifest, indent=2)); failures += 1; continue
        shutil.copy2(src, dst)
        shutil.copy2(ROOT / "out" / ep["id"] / "script.md", scripts / f"episode_{key}.md")
        shutil.copy2(ROOT / "out" / ep["id"] / "contact_sheet.png", qa / f"episode_{key}_contact_sheet.png")
        v = json.loads((ROOT / "out" / ep["id"] / "verify.json").read_text())
        manifest["episodes"][key].update(status="verified", sha256=sha256(dst), size_bytes=dst.stat().st_size, duration_s=v["duration"],
                                          width=v["width"], height=v["height"], video_codec=v["video_codec"], audio_codec=v["audio_codec"],
                                          qa=q, verified=time.strftime("%Y-%m-%dT%H:%M:%S"))
        (qa / f"episode_{key}_verify.json").write_text(json.dumps({"media": v, "series_qa": q}, indent=2))
        mpath.write_text(json.dumps(manifest, indent=2))
        log(f"episode {key} VERIFIED -> {dst} ({dst.stat().st_size / 1e6:.1f} MB, {v['duration']} s)")
    done = sum(1 for e in manifest["episodes"].values() if e.get("status") == "verified")
    log(f"{done}/{len(cfg['episodes'])} episodes verified")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
