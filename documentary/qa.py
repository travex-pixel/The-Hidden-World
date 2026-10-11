"""Extra production QA on a finished run, beyond pipeline.verify: frame count vs timeline, unintended black,
frozen video, caption timing vs narration, sync spot-check frames, thumbnail specs.

usage: python -m documentary.qa <run_dir>   -> writes <run_dir>/qa-checks.json and sync_check.png
"""
from __future__ import annotations
import json, re, subprocess, sys
from pathlib import Path


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def main(argv=None) -> int:
    run_dir = Path((argv or sys.argv[1:])[0]); mp4 = run_dir / "documentary.mp4"
    man = json.loads((run_dir / "edit-manifest.json").read_text())
    res = {}
    p = json.loads(run(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries",
                        "stream=nb_read_frames,width,height,r_frame_rate,pix_fmt,profile,display_aspect_ratio,sample_aspect_ratio", "-of", "json", str(mp4)]).stdout)["streams"][0]
    expected = round(man["duration_s"] * 30)
    res["frames"] = {"decoded": int(p["nb_read_frames"]), "expected": expected, "ok": abs(int(p["nb_read_frames"]) - expected) <= 2}
    res["format"] = {"pix_fmt": p["pix_fmt"], "profile": p.get("profile"), "dar": p.get("display_aspect_ratio"), "sar": p.get("sample_aspect_ratio"),
                     "ok": p["pix_fmt"] == "yuv420p" and p.get("display_aspect_ratio") in ("16:9", None) and p.get("sample_aspect_ratio") in ("1:1", None)}
    a = json.loads(run(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries", "stream=codec_name,sample_rate,channels,bit_rate", "-of", "json", str(mp4)]).stdout)["streams"][0]
    res["audio_stream"] = {**a, "ok": a["codec_name"] == "aac" and int(a["channels"]) == 2}
    # black segments longer than 0.6 s (intentional dips to black are <= 0.45 s)
    bd = run(["ffmpeg", "-v", "info", "-i", str(mp4), "-vf", "blackdetect=d=0.6:pic_th=0.97:pix_th=0.06", "-an", "-f", "null", "-"]).stderr
    blacks = re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", bd)
    res["black_segments_over_0.6s"] = {"segments": blacks, "ok": len(blacks) == 0}
    # frozen video longer than 4 s (every shot has camera motion or reveals)
    fz = run(["ffmpeg", "-v", "info", "-i", str(mp4), "-vf", "freezedetect=n=0.0008:d=4", "-an", "-f", "null", "-"]).stderr
    freezes = re.findall(r"freeze_start: ([\d.]+)", fz)
    res["frozen_over_4s"] = {"starts": freezes, "ok": len(freezes) == 0}
    # integrated loudness of the final file
    ln = run(["ffmpeg", "-v", "info", "-i", str(mp4), "-vn", "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr
    I = re.findall(r"I:\s+(-?[\d.]+) LUFS", ln); TP = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", ln)
    res["loudness"] = {"integrated_lufs": float(I[-1]) if I else None, "true_peak_dbfs": float(TP[-1]) if TP else None}
    res["loudness"]["ok"] = res["loudness"]["integrated_lufs"] is not None and -18 <= res["loudness"]["integrated_lufs"] <= -13 and (res["loudness"]["true_peak_dbfs"] or 0) <= -1.0
    # captions: every cue inside the film, ordered, readable, and the text equals the narration word-for-word
    srt = (run_dir / "captions.srt").read_text().strip().split("\n\n")
    def ts(x):
        h, m, r = x.split(":"); s, ms = r.split(","); return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000
    cues = [(ts(b.split("\n")[1].split(" --> ")[0]), ts(b.split("\n")[1].split(" --> ")[1]), " ".join(b.split("\n")[2:])) for b in srt]
    narration = " ".join(l["say"] for l in man["lines"] if l.get("say"))
    res["captions"] = {"cues": len(cues), "ordered": all(cues[i][1] <= cues[i + 1][0] + 1e-3 for i in range(len(cues) - 1)),
                       "within_film": cues[-1][1] <= man["duration_s"], "min_duration_s": round(min(c[1] - c[0] for c in cues), 2),
                       "max_chars_per_s": round(max(len(c[2]) / (c[1] - c[0]) for c in cues), 1),
                       "text_matches_narration": " ".join(c[2] for c in cues) == narration}
    vtt = (run_dir / "captions.vtt").read_text()
    res["captions"]["vtt_cues"] = vtt.count(" --> ")
    res["captions"]["ok"] = all([res["captions"]["ordered"], res["captions"]["within_film"], res["captions"]["min_duration_s"] >= 0.9,
                                 res["captions"]["max_chars_per_s"] <= 22, res["captions"]["text_matches_narration"], res["captions"]["vtt_cues"] == len(cues)])
    # sync spot-check: frames 0.5 s after the first three verdict stamps (thud SFX are timed to the stamp)
    stamps = [s for s in man["shots"] if s["type"] == "verdict"][:4]
    times = [round(s["start"] + 0.7, 2) for s in stamps]
    sel = "+".join(f"eq(n\\,{round(t * 30)})" for t in times)
    run(["ffmpeg", "-v", "error", "-y", "-i", str(mp4), "-vf", f"select='{sel}',scale=640:360,tile={len(times)}x1", "-frames:v", "1", str(run_dir / "sync_check.png")])
    res["sync_spot_check"] = {"times": times, "expected": [s.get("text") for s in stamps], "image": "sync_check.png"}
    # thumbnails
    from PIL import Image
    th = {}
    for f in [run_dir / "thumbnail.png", *sorted((run_dir / "thumbnails").glob("*.png"))]:
        im = Image.open(f); th[f.name] = {"size": list(im.size), "bytes": f.stat().st_size, "ok": im.size == (1280, 720) and f.stat().st_size < 2_000_000}
    res["thumbnails"] = th
    res["all_ok"] = all(v.get("ok", True) for v in res.values() if isinstance(v, dict)) and all(t["ok"] for t in th.values())
    (run_dir / "qa-checks.json").write_text(json.dumps(res, indent=2))
    print(json.dumps(res, indent=2))
    return 0 if res["all_ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
