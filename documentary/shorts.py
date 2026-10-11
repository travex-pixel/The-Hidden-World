"""Vertical 9:16 cut-downs from a finished documentary render (reads documentary.mp4 + captions.srt only).

Each clip: the 16:9 frame scaled to full width in the middle, a blurred/darkened fill of the same frame
behind it (no black bars), a hook headline on top and burned-in captions below. Independent of the
Shorts engine in pipeline/ — nothing there is imported or changed.

usage: python -m documentary.shorts <run_dir> [--only N]
"""
from __future__ import annotations
import argparse, json, re, subprocess, sys
from pathlib import Path

CLIPS = [
    {"slug": "01-guilty-then-not-guilty", "in": 0.0, "out": 31.7, "hook": "SAME MAN.\\NTWO VERDICTS."},
    {"slug": "02-what-the-jury-never-heard", "in": 119.34, "out": 172.5, "hook": "THE JURY NEVER\\NHEARD THIS"},
    {"slug": "03-the-900-dollar-note", "in": 250.68, "out": 305.8, "hook": "“RUSS'S MONEY”"},
    {"slug": "04-he-walked-free", "in": 219.62, "out": 248.38, "hook": "3½ YEARS LATER"},
    {"slug": "05-where-it-stands", "in": 416.1, "out": 446.2, "hook": "STILL NO VERDICT"},
]


def parse_srt(path: Path) -> list[tuple[float, float, str]]:
    def ts(s):
        h, m, rest = s.split(":"); sec, ms = rest.split(",")
        return int(h) * 3600 + int(m) * 60 + int(sec) + int(ms) / 1000
    cues = []
    for block in path.read_text().strip().split("\n\n"):
        lines = block.strip().split("\n")
        if len(lines) >= 3 and "-->" in lines[1]:
            a, b = [x.strip() for x in lines[1].split("-->")]
            cues.append((ts(a), ts(b), "\\N".join(lines[2:])))
    return cues


def ass_time(t: float) -> str:
    t = max(0.0, t); h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f"{h}:{m:02d}:{s:05.2f}"


def write_ass(path: Path, clip: dict, cues) -> None:
    dur = clip["out"] - clip["in"]
    head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Hook,Inter Display Black,96,&H00EAF0F6,&H00000000,&H00000000,&H64000000,1,0,0,0,100,100,0,0,1,0,6,8,60,60,230,1
Style: Cap,Inter,62,&H00FFFFFF,&H00000000,&H00101010,&H96000000,1,0,0,0,100,100,0,0,1,5,2,2,70,70,400,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    ev = [f"Dialogue: 1,{ass_time(0)},{ass_time(dur)},Hook,,0,0,0,,{{\\fad(150,0)}}{clip['hook']}"]
    for a, b, txt in cues:
        if b <= clip["in"] or a >= clip["out"]:
            continue
        ev.append(f"Dialogue: 0,{ass_time(a - clip['in'])},{ass_time(min(b, clip['out']) - clip['in'])},Cap,,0,0,0,,{txt}")
    path.write_text(head + "\n".join(ev) + "\n")


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("run_dir"); ap.add_argument("--only", type=int, default=None)
    args = ap.parse_args(argv)
    run = Path(args.run_dir); src = run / "documentary.mp4"; out = run / "shorts"; out.mkdir(exist_ok=True)
    cues = parse_srt(run / "captions.srt")
    report = []
    for k, clip in enumerate(CLIPS, 1):
        if args.only and k != args.only:
            continue
        ass = out / f"{clip['slug']}.ass"; write_ass(ass, clip, cues)
        dst = out / f"short-{clip['slug']}.mp4"; dur = clip["out"] - clip["in"]
        vf = ("[0:v]split[a][b];[b]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=38,eq=brightness=-0.16[bg];"
              "[a]scale=1080:-2[fg];[bg][fg]overlay=0:(H-h)/2-60,format=yuv420p,"
              f"subtitles=filename='{ass}'[v]")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{clip['in']:.3f}", "-t", f"{dur:.3f}", "-i", str(src), "-filter_complex", vf,
                        "-map", "[v]", "-map", "0:a:0", "-af", f"afade=t=in:d=0.12,afade=t=out:st={dur - 0.25:.3f}:d=0.25",
                        "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-r", "30", "-c:a", "aac", "-b:a", "160k",
                        "-movflags", "+faststart", str(dst)], check=True)
        p = json.loads(subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(dst)],
                                      capture_output=True, text=True, check=True).stdout)
        v = next(s for s in p["streams"] if s["codec_type"] == "video"); a = [s for s in p["streams"] if s["codec_type"] == "audio"]
        dec = subprocess.run(["ffmpeg", "-v", "error", "-i", str(dst), "-f", "null", "-"], capture_output=True, text=True)
        r = {"file": dst.name, "width": v["width"], "height": v["height"], "codec": v["codec_name"], "audio": bool(a),
             "duration": round(float(p["format"]["duration"]), 2), "decodes": dec.returncode == 0 and not dec.stderr.strip()}
        r["ok"] = (r["width"], r["height"]) == (1080, 1920) and r["codec"] == "h264" and r["audio"] and r["decodes"] and abs(r["duration"] - dur) < 0.3
        report.append(r); print(json.dumps(r))
        ass.unlink()
    (out / "shorts-verify.json").write_text(json.dumps(report, indent=2))
    return 0 if all(r["ok"] for r in report) else 1


if __name__ == "__main__":
    sys.exit(main())
