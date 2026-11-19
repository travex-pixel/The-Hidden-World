"""Cut a vertical (1080x1920) YouTube Short from a range of beats of a rendered COPYCAT film.

usage: python -m copycat.short <project-id> [--from b001] [--to b015] [--title "WHAT IF ASTA|WAS REBORN|WITH ALL HIS MEMORIES?"] [--cta "..."]
Uses rendered-segments/ + mix.wav, so it works as soon as those beats are rendered (no need for the full master).
Layout: blurred, darkened fill of the same footage; a centre crop of the 16:9 film (keeps captions large); title and
call-to-action typeset in the film's own fonts by headless Chromium.
"""
from __future__ import annotations
import argparse, json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

OVERLAY_HTML = """<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Anton;src:url('%(fonts)s/anton-latin-400-normal.woff2')}
@font-face{font-family:Barlow;font-weight:800;src:url('%(fonts)s/barlow-condensed-latin-800-normal.woff2')}
html,body{margin:0;width:1080px;height:1920px;background:transparent;overflow:hidden}
.top{position:absolute;left:0;right:0;top:120px;text-align:center}
.kick{display:inline-block;background:#ff3b4f;color:#0a0507;font:400 64px Anton;letter-spacing:10px;padding:4px 30px 0}
.l{font:400 104px/1.02 Anton;color:#f7f3ea;text-shadow:0 6px 0 #07040a,0 0 30px rgba(0,0,0,.7);margin-top:14px}
.l.g{color:#ffd35c}
.bot{position:absolute;left:0;right:0;bottom:230px;text-align:center;font:800 46px Barlow;letter-spacing:7px;color:#f7f3ea}
.bot b{display:inline-block;background:#ff3b4f;color:#0a0507;padding:6px 26px;margin-top:22px;letter-spacing:9px}
</style></head><body>
<div class="top"><div class="kick">%(kick)s</div>%(lines)s</div>
<div class="bot">%(cta1)s<br><b>%(cta2)s</b></div></body></html>"""


def overlay_png(out: Path, title: str, kick: str, cta1: str, cta2: str) -> Path:
    lines = title.split("|"); body = "".join(f'<div class="l{" g" if i == len(lines) - 1 else ""}">{l}</div>' for i, l in enumerate(lines))
    html = out.with_suffix(".html"); html.write_text(OVERLAY_HTML % {"fonts": (ROOT / "assets/fonts/copycat").as_uri(), "kick": kick, "lines": body, "cta1": cta1, "cta2": cta2})
    js = f"""const {{ chromium }} = require('playwright'); (async () => {{ const b = await chromium.launch(); const p = await b.newPage({{ viewport: {{ width: 1080, height: 1920 }} }});
      await p.goto({json.dumps(html.as_uri())}); await p.evaluate(() => document.fonts.ready); await p.screenshot({{ path: {json.dumps(str(out))}, omitBackground: true }}); await b.close(); }})();"""
    subprocess.run(["node", "-e", js], check=True, cwd=ROOT); return out


def main(argv=None):
    ap = argparse.ArgumentParser(); ap.add_argument("project"); ap.add_argument("--from", dest="a", default="b001"); ap.add_argument("--to", dest="z", default="b015")
    ap.add_argument("--title", default="ASTA WAS REBORN|WITH ALL HIS|MEMORIES?"); ap.add_argument("--kick", default="WHAT IF"); ap.add_argument("--cta1", default="BLACK CLOVER WHAT IF")
    ap.add_argument("--cta2", default="FULL VIDEO ON THE CHANNEL"); ap.add_argument("--crop", type=int, default=1920)  # full 16:9 width: side-anchored text (stamps, name cards) must never be cut
    a = ap.parse_args(argv)
    out = ROOT / "out" / "copycat" / a.project; pk = out / "package"; pk.mkdir(exist_ok=True)
    plan = json.loads((out / "plan.json").read_text()); ids = [b["id"] for b in plan["beats"]]
    beats = plan["beats"][ids.index(a.a): ids.index(a.z) + 1]; t0, t1 = beats[0]["start"], beats[-1]["end"]
    seg = out / "rendered-segments"; files = []
    for b in beats:
        c = sorted(f for f in seg.glob(f"{b['id']}-*.mp4") if not f.name.endswith(".part.mp4"))
        if not c: sys.exit(f"[short] segment for {b['id']} not rendered yet")
        files.append(c[-1])
    lst = pk / "short_segments.txt"; lst.write_text("".join(f"file '{f}'\n" for f in files))
    ov = overlay_png(pk / "short_overlay.png", a.title, a.kick, a.cta1, a.cta2)
    ch = a.crop; fh = round(1080 * 1080 / ch / 2) * 2; y = (1920 - fh) // 2 + 40
    fc = (f"[0:v]split[a][b];[a]scale=-2:1920,crop=1080:1920,boxblur=28:2,eq=brightness=-0.22:saturation=1.15[bg];"
          f"[b]crop={ch}:1080:(iw-{ch})/2:0,scale=1080:{fh}:flags=lanczos[fg];[bg][fg]overlay=0:{y}[v1];[v1][1:v]overlay=0:0,format=yuv420p[v]")
    dst = pk / f"{a.project}_short.mp4"; dur = t1 - t0
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-i", str(ov), "-ss", f"{t0:.3f}", "-t", f"{dur:.3f}", "-i", str(out / "mix.wav"),
                    "-filter_complex", fc, "-map", "[v]", "-map", "2:a", "-af", f"afade=t=out:st={max(0, dur - 0.5):.3f}:d=0.5", "-c:v", "libx264", "-preset", "medium", "-crf", "19",
                    "-c:a", "aac", "-b:a", "192k", "-r", "30", "-movflags", "+faststart", "-t", f"{dur:.3f}", str(dst)], check=True)
    print(f"[short] {dst} ({dur:.1f}s, beats {a.a}..{a.z})"); return 0


if __name__ == "__main__":
    sys.exit(main())
