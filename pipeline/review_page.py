"""Assemble the v10 review page: old vs new openings side by side, the blinded voice clips, the three covers per reel,
and a phone-sized sound-off strip for each new reel. Also packs releases/.

  python3 -m pipeline.review_page tcv101-soap-grandad tcv102-young-mule tcv103-jungle-pilot --old tcv98-cocaine-wig
  python3 -m pipeline.review_page ... --release          # also copy MP4 + cover + caption into releases/

Writes out/review_v10/index.html plus the images it references (frame strips, covers), and lists the audio and video
files to publish alongside it. Frame strips are taken from the final MP4 in series/true-crime-cinematic/output/ (or
out/<id>/<id>.mp4) at 0, 0.5, 1, 2, 4, 8 s, scaled to phone width so the strip shows what a thumb-scroll shows.
"""
from __future__ import annotations
import argparse, html, io, json, shutil, subprocess, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "out" / "review_v10"
SERIES = json.loads((ROOT / "series/true-crime-cinematic/series.json").read_text())["episodes"]


def ep_of(eid): return next(e for e in SERIES if e["id"] == eid)


def mp4_of(eid) -> Path:
    e = ep_of(eid)
    for p in (ROOT / "series/true-crime-cinematic/output" / e["file"], ROOT / "out" / eid / f"{eid}.mp4"):
        if p.exists(): return p
    raise SystemExit(f"no render for {eid}")


def frame(mp4: Path, t: float, w: int = 270) -> Image.Image:
    r = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", str(mp4), "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True, check=True)
    im = Image.open(io.BytesIO(r.stdout)).convert("RGB"); return im.resize((w, int(w * im.height / im.width)))


def duration(mp4: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp4)], capture_output=True, text=True)
    try: return float(r.stdout.strip())
    except ValueError: return 30.0


def strip(eid: str, times, w=200, name="strip") -> str:
    mp4 = mp4_of(eid); d = duration(mp4); tiles = [frame(mp4, min(t, d - 0.15), w) for t in times if t <= d]
    sheet = Image.new("RGB", (w * len(tiles) + 6 * (len(tiles) - 1), tiles[0].height), (14, 15, 18))
    for i, t in enumerate(tiles): sheet.paste(t, (i * (w + 6), 0))
    p = OUT / f"{name}_{eid}.jpg"; sheet.save(p, quality=88); return p.name


def post_of(eid) -> dict:
    p = ROOT / "episodes" / eid / "post.md"; d = {}
    if p.exists():
        for line in p.read_text().splitlines():
            if ":" in line and line.split(":")[0].isupper():
                k, v = line.split(":", 1); d[k.strip()] = v.strip()
    return d


def hook_of(eid) -> str:
    tl = ROOT / "out" / eid / "timeline.json"
    try: return json.loads(tl.read_text())[0]["lines"][0]["text"]
    except Exception: return ""


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("new", nargs="+"); ap.add_argument("--old", default="tcv98-cocaine-wig"); ap.add_argument("--release", action="store_true")
    a = ap.parse_args(argv); OUT.mkdir(parents=True, exist_ok=True)
    files = {}
    T_OPEN = [0, 0.5, 1, 2, 4, 8]; T_PHONE = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
    old_strip = strip(a.old, T_OPEN, name="open"); files[old_strip] = OUT / old_strip
    sections = []
    for eid in a.new:
        e = ep_of(eid); post = post_of(eid)
        s_open = strip(eid, T_OPEN, name="open"); s_phone = strip(eid, T_PHONE, w=120, name="phone")
        files[s_open] = OUT / s_open; files[s_phone] = OUT / s_phone
        covers = []
        for i in (1, 2, 3):
            c = ROOT / "episodes" / eid / "covers" / f"cover_{i}.jpg"
            if c.exists():
                im = Image.open(c); im.thumbnail((360, 640)); n = f"cover_{eid}_{i}.jpg"; im.save(OUT / n, quality=88); files[n] = OUT / n; covers.append(n)
        mp4 = mp4_of(eid); vname = e["file"]; files[vname] = mp4
        verify = ROOT / "series/true-crime-cinematic/qa" / f"true_crime_{e['n']}" / "verify.json"
        qa = json.loads(verify.read_text()) if verify.exists() else {}
        asr = (qa.get("asr") or {}).get("word_error_rate"); dur = (qa.get("media") or {}).get("duration")
        sections.append({"eid": eid, "n": e["n"], "title": e["youtube_title"].replace(" #Shorts", ""), "hook": hook_of(eid), "open": s_open, "phone": s_phone, "covers": covers,
                         "video": vname, "post": post, "asr": asr, "dur": dur, "openings": (ROOT / "episodes" / eid / "openings.md").read_text() if (ROOT / "episodes" / eid / "openings.md").exists() else ""})
        if a.release:
            rel = ROOT / "releases"; rel.mkdir(exist_ok=True); stem = e["file"][:-4]
            shutil.copy2(mp4, rel / e["file"])
            for i in (1, 2, 3):
                c = ROOT / "episodes" / eid / "covers" / f"cover_{i}.jpg"
                if c.exists(): shutil.copy2(c, rel / f"{stem}_cover_{i}.jpg")
            (rel / f"{stem}_caption.txt").write_text((ROOT / "episodes" / eid / "post.md").read_text())
    # voice clips
    vt = ROOT / "out" / "voice_test"; clips = sorted(p.name for p in vt.glob("clip_*.mp3")) if vt.exists() else []
    for c in clips: files[c] = vt / c
    stats = json.loads((vt / "stats.json").read_text()) if (vt / "stats.json").exists() else {}
    H = html.escape
    page = [f"""<title>Case Files 101–103 Review</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
/* layout: one column of review stations, each a dark slab with an amber rule; the reel is the hero of each station */
:root{{--bg:#f3efe6;--fg:#1b1a17;--muted:#6a645a;--slab:#ffffff;--line:#d9d2c3;--amber:#b8761a;--ink:#0e0f12;--font-display:"Fraunces",Georgia,serif;--font-body:"Nunito",system-ui,sans-serif;--font-mono:"Courier Prime","Courier New",monospace}}
@media (prefers-color-scheme: dark){{:root:not([data-theme="light"]){{--bg:#0e0f12;--fg:#f2efe8;--muted:#a39d91;--slab:#17191e;--line:#2a2d35;--amber:#e8a33a;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#0e0f12;--fg:#f2efe8;--muted:#a39d91;--slab:#17191e;--line:#2a2d35;--amber:#e8a33a;color-scheme:dark}}
body{{background:var(--bg);color:var(--fg);font-family:var(--font-body);font-size:16px;line-height:1.5;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:24px}}
main{{max-width:960px;margin:auto}}h1,h2,h3{{font-family:var(--font-display);text-wrap:balance;margin:0 0 8px}}h1{{font-size:34px}}h2{{font-size:24px;margin-top:40px}}h3{{font-size:18px}}
.eyebrow{{font-family:var(--font-mono);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--amber)}}
.slab{{background:var(--slab);border-top:3px solid var(--amber);padding:18px;margin:18px 0}}
.row{{display:flex;flex-wrap:wrap;gap:16px}}.row>*{{min-width:0;flex:1 1 280px}}
img{{max-width:100%;height:auto;display:block}}.strip{{overflow-x:auto}}.strip img{{max-width:none;height:200px}}
video{{width:100%;max-width:360px;aspect-ratio:9/16;background:#000;border-radius:6px}}audio{{width:100%}}
.covers{{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}}.covers figure{{margin:0}}.covers figcaption{{font-family:var(--font-mono);font-size:12px;color:var(--muted);margin-top:6px}}
pre{{font-family:var(--font-mono);font-size:13px;white-space:pre-wrap;background:var(--bg);border:1px solid var(--line);padding:12px;overflow-x:auto}}
table{{border-collapse:collapse;width:100%;font-size:14px;font-variant-numeric:tabular-nums}}td,th{{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left}}
.muted{{color:var(--muted)}}label{{display:block;margin:6px 0}}button{{background:var(--amber);color:var(--ink);border:0;border-radius:6px;padding:10px 14px;font-weight:800;font-family:var(--font-body)}}button:focus-visible{{outline:3px solid var(--fg)}}
textarea{{width:100%;min-height:90px;font-family:var(--font-body)}}
</style>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:wght@800&family=Nunito:wght@500;800&family=Courier+Prime&display=swap">
<main>
<p class="eyebrow">The Hidden World · engine v10 · one smuggler per reel</p>
<h1>Case Files 101–103: the review</h1>
<p>Three stations per reel: the opening against the last engine's, the reel on a phone with the sound off, and the covers. Then the narrator blind test. Nothing posts until you say so.</p>
"""]
    for s in sections:
        page.append(f"""<section class="slab" id="cf{s['n']}"><p class="eyebrow">Case File {s['n']}</p><h2>{H(s['title'])}</h2>
<p><b>Spoken hook:</b> {H(s['hook'])} <span class="muted">· {s['dur'] or '?'} s · recogniser word error {f"{s['asr']:.0%}" if s['asr'] is not None else '?'}</span></p>
<div class="row"><div><h3>The reel</h3><video controls preload="metadata" src="{H(s['video'])}" playsinline></video><p class="muted">Watch once with the sound off (the captions must carry it), then on.</p></div>
<div><h3>Old opening (Case File {H(a.old.split('-')[0][3:])}) vs new</h3><p class="muted">Frames at 0, 0.5, 1, 2, 4 and 8 s.</p><div class="strip"><img src="{old_strip}" alt="old opening frames"></div><div class="strip" style="margin-top:8px"><img src="{s['open']}" alt="new opening frames"></div></div></div>
<h3 style="margin-top:18px">Sound off, phone size</h3><div class="strip"><img src="{s['phone']}" alt="phone-size frames every 3 seconds" style="height:214px"></div>
<h3 style="margin-top:18px">Covers (pick one)</h3><div class="covers">{''.join(f'<figure><img src="{c}" alt="cover option {i}"><figcaption>cover {i}</figcaption></figure>' for i, c in enumerate(s['covers'], 1))}</div>
<h3 style="margin-top:18px">Caption</h3><pre>{H(s['post'].get('CAPTION', ''))}

{H(s['post'].get('HASHTAGS', ''))}</pre><p><b>Seed comment:</b> {H(s['post'].get('SEED COMMENT', ''))}<br><b>Pinned:</b> {H(s['post'].get('PINNED', ''))}</p>
<details><summary>The three openings the engine proposed</summary><pre>{H(s['openings'])}</pre></details>
</section>""")
    page.append("""<section class="slab" id="voice"><p class="eyebrow">Narrator blind test</p><h2>Seven voices, one passage</h2>
<p>The same 56 seconds (Case Files 98 and 97) in each narrator, same mix chain. Clips are in random order and the key is not on this page. Phone speaker first, then earphones. Which one could you not clock as synthetic in five seconds?</p>""")
    for c in clips:
        L = c[5]
        page.append(f"<div style='margin:10px 0'><b>Clip {L}</b><audio controls preload='none' src='{c}'></audio><label><input type='checkbox' id='syn{L}'> Obviously synthetic in 5 s</label><label>Sounds like a person: <select id='hum{L}'><option>-</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></label></div>")
    page.append("""<h3>Measured, not listened</h3><table><tr><th>clip</th><th>pitch spread (semitones)</th><th>rhythm variation</th><th>pauses</th></tr>""")
    key = json.loads((vt / "KEY.json").read_text()) if (vt / "KEY.json").exists() else {}
    for c in clips:
        L = c[5]; st = stats.get(key.get(L, ""), {})
        page.append(f"<tr><td>{L}</td><td>{st.get('f0_spread_semitones_p10_p90', '')}</td><td>{st.get('rate_cv', '')}</td><td>{st.get('pauses', '')}</td></tr>")
    page.append("""</table><p class="muted">Pitch spread is the 10th–90th percentile range of the voice's pitch: flat machine reads sit near 6–7, conversational speech 10–14. The engine's recommendation and the paid option's cost are in docs/VOICE_TEST_2026-10-26.md.</p>
<textarea id="notes" placeholder="Your verdict: which clip, which cover per reel, anything to change"></textarea><p><button id="copy">Copy my answers</button> <span id="copied" class="muted"></span></p></section>
<script>
document.getElementById('copy').addEventListener('click',()=>{const o={};document.querySelectorAll('input[type=checkbox],select').forEach(e=>{o[e.id]=e.type==='checkbox'?e.checked:e.value});o.notes=document.getElementById('notes').value;const t=JSON.stringify(o);
navigator.clipboard.writeText(t).then(()=>{document.getElementById('copied').textContent='Copied. Paste it to me.'}).catch(()=>{const ta=document.getElementById('notes');ta.value=t;ta.select();document.getElementById('copied').textContent='Select-all and copy the box.'})});
</script></main>""")
    (OUT / "index.html").write_text("\n".join(page))
    (OUT / "files.json").write_text(json.dumps({k: str(v) for k, v in files.items()}, indent=1))
    print(f"wrote {OUT}/index.html with {len(files)} supporting files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
