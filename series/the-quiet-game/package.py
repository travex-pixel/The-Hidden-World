"""Package a rendered Quiet Game episode into upload-ready deliverables and a delivery page.

usage: python series/the-quiet-game/package.py [--episode qg02-the-credit] [--hosted] [--pages-only]

Reads the verified render in out/qg01-the-favour/ and writes, into series/the-quiet-game/the-favour/:
  final.mp4 (git-ignored), thumbnail.png, captions.srt, captions.vtt, transcript.txt, chapters.txt,
  description.md, promo.md, qa/verify.json, qa/contact_sheet.png, delivery/index.html (plays ../final.mp4)
With --hosted it also builds out/qg01-delivery-hosted/: the same page in "hosted" mode for a private claude.ai
artifact. A 720p phone stream is split into ~1-minute MP4 parts (each plays on its own, with its own captions),
and the full 1080p master is split into base64 text pieces (artifact hosting serves only standard web types)
that the page decodes, reassembles and verifies (SHA-256) before offering the save.
"""
from __future__ import annotations
import argparse, base64, hashlib, json, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from pipeline.captions import clock, chapters as chapter_list  # noqa: E402

# Per-episode settings; configure() points the module-level names at one of them.
EPISODES = {
    "qg01-the-favour": {"folder": "the-favour", "hosted": "qg01-delivery-hosted", "download": "The-Quiet-Game-E01-The-Favour-1080p.mp4",
                        "line": "Episode 1 · The Favour", "teaser": [("start", "c03_cold_graham"), ("c19_trust", "c19_trust"), ("title", "c04_title")]},
    "qg02-the-credit": {"folder": "the-credit", "hosted": "qg02-delivery-hosted", "download": "The-Quiet-Game-E02-The-Credit-1080p.mp4",
                        "line": "Episode 2 · The Credit", "teaser": [("start", "d02_cold_leah"), ("d14_mine", "d15_leah_freezes"), ("title", "d03_title")]},
}
EP = OUT = DST = HOSTED = DOWNLOAD_NAME = CFG = None


def configure(ep_id: str) -> None:
    global EP, OUT, DST, HOSTED, DOWNLOAD_NAME, CFG
    CFG = EPISODES[ep_id]; EP = ep_id; OUT = ROOT / "out" / ep_id
    DST = ROOT / "series" / "the-quiet-game" / CFG["folder"]; HOSTED = ROOT / "out" / CFG["hosted"]; DOWNLOAD_NAME = CFG["download"]
CHUNK = 11 * 1024 * 1024          # raw bytes per piece; base64 text stays under the 16 MB artifact text limit
STREAM_PART_S = 60


def sha256(p: Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


def probe(p: Path) -> dict:
    r = subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(p)], capture_output=True, text=True, check=True)
    return json.loads(r.stdout)


def description(ep: dict, ch: list) -> str:
    if EP == "qg02-the-credit":
        return description_credit(ep, ch)
    chap = "\n".join(f"{clock(t)} {title}" for t, title in ch)
    return f"""# YouTube description (paste everything below the line)

---
His manager asked for one small favour. By Thursday, a colleague was being blamed for a mistake she didn't make.

THE QUIET GAME is an animated psychological drama about the hidden games that shape careers, reputations and power at work. In Episode 1, Daniel, a careful reporting analyst, is asked by a warm, reasonable, well-liked manager to leave a small error out of a client report "until it can be fixed". It doesn't feel like a lie. It feels like returning a favour. Then the client notices, and someone else takes the blame.

In this episode:
• Reciprocity: why a string of small kindnesses can make "no" feel like an unpaid debt
• Cognitive dissonance: how decent people rewrite the story instead of changing what they did (and what recent replications say about it)
• Pluralistic ignorance: why a whole room can stay silent when everyone privately doubts what's happening
• Foot in the door: how a small yes makes the next, bigger request feel smaller
• Four practical moves: write it down, confirm in writing, ask neutral questions, correct the record early

Chapters
{chap}

Most favours at work are just kindness. This episode is about the rare ones that ask you to hide something, and what you can do when it happens to you.

This is a fictional story. Characters, companies and events are invented. The psychology is real; sources are below.

Sources
• Gouldner (1960), The norm of reciprocity, American Sociological Review: https://doi.org/10.2307/2092623
• Regan (1971), Effects of a favor and liking on compliance, J. Experimental Social Psychology: https://doi.org/10.1016/0022-1031(71)90025-4
• Festinger & Carlsmith (1959), Cognitive consequences of forced compliance: https://doi.org/10.1037/h0041593
• Vaidis et al. (2024), multilab replication of induced-compliance dissonance: https://doi.org/10.1177/25152459231213375
• Prentice & Miller (1993), Pluralistic ignorance and alcohol use on campus: https://doi.org/10.1037/0022-3514.64.2.243
• Morrison & Milliken (2000), Organizational silence: https://doi.org/10.2307/259200
• Freedman & Fraser (1966), The foot-in-the-door technique: https://doi.org/10.1037/h0023552

If the story felt familiar, tell us in the comments what you did, or wish you'd done. Subscribe for the next episode of The Quiet Game.

#OfficePolitics #WorkplacePsychology #TheQuietGame
---

**Tags (YouTube Studio → Tags):** office politics, workplace psychology, manipulation at work, toxic manager, reciprocity, cognitive dissonance, pluralistic ignorance, foot in the door, speaking up at work, career advice, animated story, psychology explained

**Category:** Education · **Audience:** not made for kids · **Altered or synthetic content:** this is an animated, clearly fictional story with synthetic (text-to-speech) voices; it does not depict real people or events, so YouTube's "realistic altered content" label is not required, but disclose it if you prefer.
"""


def description_credit(ep: dict, ch: list) -> str:
    chap = "\n".join(f"{clock(t)} {title}" for t, title in ch)
    return f"""# YouTube description (paste everything below the line)

---
He pitched the best idea of his career. It wasn't his. And he genuinely didn't know.

THE QUIET GAME is an animated psychological drama about the hidden games at work. In Episode 2, Leah suggests a fix to Daniel over coffee. Two days later, with a promotion on the line, Daniel pitches it to the director as his own idea, and believes every word. Did he steal it, or did his memory?

In this episode:
• Cryptomnesia: why we can forget where an idea came from and remember it as our own
• Why improving someone's idea makes you more likely to claim it
• The egocentric bias: why everyone on a team thinks they did most of the work
• Why credit for ideas doesn't land equally
• Amplification: the simple meeting tactic that makes credit stick
• Four moves for when someone presents your idea as theirs

Chapters
{chap}

This is a fictional story. Characters, companies and events are invented. The psychology is real; sources are below.

Sources
• Brown & Murphy (1989), Cryptomnesia: Delineating inadvertent plagiarism: https://doi.org/10.1037/0278-7393.15.3.432
• Stark, Perfect & Newstead (2005), When elaboration leads to appropriation: https://researchportal.plymouth.ac.uk/en/publications/when-elaboration-leads-to-appropriation-unconscious-plagiarism-in/
• Johnson, Hashtroudi & Lindsay (1993), Source monitoring: https://doi.org/10.1037/0033-2909.114.1.3
• Ross & Sicoly (1979), Egocentric biases in availability and attribution: https://doi.org/10.1037/0022-3514.37.3.322
• Caruso, Epley & Bazerman (2006), Egocentric responsibility in groups: https://doi.org/10.1037/0022-3514.91.5.857
• McClean et al. (2018), The social consequences of voice: https://doi.org/10.5465/amj.2016.0148
• Eilperin (2016), The Washington Post, on "amplification" (republished): https://www.dailyherald.com/20160918/business/how-female-white-house-staffers-cracked-the-code-of-power/

Has someone ever presented your idea as their own? Do you think they knew? Tell us below. Episode 1, "The Favour", is on the channel.

#OfficePolitics #WorkplacePsychology #TheQuietGame
---

**Tags:** idea stolen at work, coworker took credit, credit stealing, office politics, workplace psychology, cryptomnesia, unconscious plagiarism, egocentric bias, amplification, career advice, animated story, psychology explained

**Category:** Education · **Audience:** not made for kids · **Altered or synthetic content:** animated, clearly fictional, synthetic (text-to-speech) voices; no real people or events depicted.
"""


PROMO_CREDIT = """# Promotion pack: The Quiet Game, Episode 2

## Pinned comment
Most stolen ideas aren't stolen. They're forgotten, by the one person who remembers them as their own.
That doesn't make it fair. It changes what to do next: check the record, then ask, "Can I show you something?"

Has someone presented your idea as theirs? Do you think they knew?
(Leah's four moves are at {moves}.)

## Community post
New episode: THE QUIET GAME, "The Credit" 💡
Leah suggested it on Monday. On Wednesday, Daniel pitched it to the director as his own idea, and he believed it.

Poll: what would you do?
• Call it out in the meeting
• Say nothing
• Raise it privately, with the receipts
• Build on it and credit myself out loud

## Short teaser
VO: "At 10:14 on Wednesday, Daniel Hale pitched the best idea of his career. There was one problem. It wasn't his."
Daniel: "Mine. I've been working on it since Monday."
Card: THE QUIET GAME · The Credit · full episode on the channel
A rendered 16:9 teaser cut from the final episode is in this folder as teaser.mp4 (git-ignored; rebuilt by package.py).
"""


PROMO = """# Promotion pack: The Quiet Game, Episode 1

## Pinned comment
Most favours at work are just kindness. Reciprocity is how good teams work.
The warning sign is a favour that asks you to hide something.

Has that ever happened to you? What did you do, or what do you wish you'd done?
(Daniel's four moves are at {moves}.)

## Community post
New episode: THE QUIET GAME, "The Favour" 🎬
Daniel's manager asked him to leave one small error out of a report, "just until it's fixed".
He said yes. By Thursday, a colleague was being blamed.

Quick poll: would you have said yes?
• Yes, it's only small
• Yes, but I'd put it in writing
• No, I'd flag it straight away
• It depends who's asking

## Short teaser (vertical or square crop of the cold open)
VO: "At 9:07 on Monday morning, Daniel did his manager a favour. By Thursday, a colleague was being blamed for a mistake she hadn't made."
Graham: "I knew I could trust you."
Card: THE QUIET GAME · The Favour · full episode on the channel
A rendered 16:9 teaser cut from the final episode is in this folder as teaser.mp4 (git-ignored; rebuilt by package.py).
"""


def longform_qa(master: Path) -> dict:
    """Series QA (black frames incl. the opening, caption timing, dialogue loudness) at widescreen dimensions."""
    from pipeline.series import series_qa
    q = series_qa(EP, master, (420, 560))
    q.pop("dimensions_1080x1920", None)
    v = json.loads((OUT / "verify.json").read_text())
    q["dimensions_1920x1080"] = (v["width"], v["height"]) == (1920, 1080)
    r = subprocess.run(["ffmpeg", "-v", "info", "-t", "2", "-i", str(master), "-vf", "signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-an", "-f", "null", "-"], capture_output=True, text=True)
    ys = [float(x.split("=")[1]) for x in r.stderr.split() if x.startswith("lavfi.signalstats.YAVG=")]
    q["opening_luma_min"] = round(min(ys), 1) if ys else None
    q["opening_not_black"] = bool(ys) and min(ys) > 12
    q["all_passed"] = all(val for k, val in q.items() if isinstance(val, bool) and k != "all_passed")
    return q


def build_stream(master: Path, dst: Path, ep: dict, tl: list) -> list[dict]:
    """720p phone stream in ~60 s parts, each a standalone MP4 (captions are burned in)."""
    dst.mkdir(parents=True, exist_ok=True)
    for f in dst.glob("part*"):
        f.unlink()
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(master), "-vf", "scale=1280:720:flags=lanczos", "-c:v", "libx264", "-preset", "medium", "-crf", "24",
                    "-maxrate", "1800k", "-bufsize", "3600k", "-pix_fmt", "yuv420p", "-force_key_frames", f"expr:gte(t,n_forced*{STREAM_PART_S})",
                    "-c:a", "aac", "-b:a", "128k", "-f", "segment", "-segment_time", str(STREAM_PART_S), "-reset_timestamps", "1",
                    "-segment_format", "mp4", "-segment_format_options", "movflags=+faststart", str(dst / "part%02d.mp4")], check=True)
    segs = []; start = 0.0
    for p in sorted(dst.glob("part*.mp4")):
        if p.stat().st_size >= 15_000_000:
            raise SystemExit(f"{p.name} is {p.stat().st_size} bytes; lower the stream bitrate")
        dur = float(probe(p)["format"]["duration"])
        segs.append({"src": f"stream/{p.name}", "vtt": None, "start": round(start, 3), "dur": round(dur, 3)})
        start += dur
    return segs


def page(template: str, data: dict, standalone: bool) -> str:
    body = template.replace("/*__DATA__*/null", json.dumps(data, ensure_ascii=False).replace("</", "<\\/"))
    if standalone:   # a local file needs its own document skeleton; the artifact host adds one itself
        return "<!doctype html>\n<html lang=\"en\"><head><meta charset=\"utf-8\"></head><body>\n" + body + "\n</body></html>\n"
    return body


def write_pages(ep: dict, tl: list, v: dict, master: Path, hosted_info: dict | None) -> None:
    ch = chapter_list(ep, tl)
    size = master.stat().st_size; digest = hosted_info["sha256"] if hosted_info else sha256(master)
    specs = {"width": v["width"], "height": v["height"], "fps": v["fps"], "duration": v["duration"], "size": size, "codecs": "H.264 · AAC"}
    kit = [
        {"label": "Title", "text": ep["youtube_title"], "open": True},
        {"label": "Description", "text": (DST / "description.md").read_text().split("---\n")[1].strip(), "save": "description.txt"},
        {"label": "Chapters", "text": (DST / "chapters.txt").read_text().strip()},
        {"label": "Captions (SRT)", "text": (DST / "captions.srt").read_text(), "save": "the-favour-captions.srt.txt", "note": "YouTube Studio → Subtitles → Upload file. If you save it from here, rename the file to end in .srt."},
        {"label": "Transcript", "text": (DST / "transcript.txt").read_text()},
        {"label": "Pinned comment and community post", "text": (DST / "promo.md").read_text().split("## Short teaser")[0].split("\n", 2)[2].strip()},
        {"label": "Sources", "text": (DST / "references.md").read_text()},
    ]
    common = {"youtube_title": ep["youtube_title"], "episode_line": CFG["line"], "specs": specs, "chapters": [{"t": t, "title": title} for t, title in ch],
              "download_name": DOWNLOAD_NAME, "kit": kit,
              "notice": f"A fictional story; the psychology is real. This video has not been uploaded or published anywhere. Master file SHA-256 {digest[:16]}…"}
    tpl = (ROOT / "series" / "the-quiet-game" / "delivery_template.html").read_text()
    local = {**common, "mode": "local", "src": "../final.mp4", "vtt": "../captions.vtt", "poster": "../thumbnail.png"}
    (DST / "delivery" / "index.html").write_text(page(tpl, local, standalone=True))
    print(f"local page -> {DST / 'delivery' / 'index.html'}")
    if hosted_info:
        hosted = {**common, "mode": "hosted", "segments": hosted_info["segments"], "poster": "poster.jpg",
                  "master": {"parts": hosted_info["parts"], "size": size, "sha256": digest, "encoding": "base64"},
                  "download_hint": f"Fetches the 1080p master in {len(hosted_info['parts'])} pieces, checks the SHA-256, then asks you to confirm the save. Use Wi-Fi: about {size / 1e6:.0f} MB."}
        (HOSTED / "index.html").write_text(page(tpl, hosted, standalone=False))
        print(f"hosted page -> {HOSTED / 'index.html'}")


def main() -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("--hosted", action="store_true")
    ap.add_argument("--pages-only", action="store_true", help="rebuild the two delivery pages from already-packaged files")
    ap.add_argument("--episode", default="qg01-the-favour", choices=sorted(EPISODES))
    a = ap.parse_args(); configure(a.episode)
    ep = json.loads((ROOT / "episodes" / EP / "episode.json").read_text())
    master = OUT / f"{EP}.mp4"; v = json.loads((OUT / "verify.json").read_text())
    if not master.exists() or not v["all_passed"]:
        raise SystemExit(f"no verified render in out/; run: python -m pipeline.build {EP} --quality final --workers 5")
    tl = json.loads((OUT / "timeline.json").read_text())
    if a.pages_only:
        write_pages(ep, tl, v, master, json.loads((HOSTED / "manifest.json").read_text()) if (HOSTED / "manifest.json").exists() else None)
        return 0
    q = longform_qa(master)
    for k, val in q.items():
        if isinstance(val, bool):
            print(f"  {'PASS' if val else 'FAIL'} {k}")
    if not q["all_passed"]:
        raise SystemExit("long-form QA failed; not packaging")
    DST.mkdir(parents=True, exist_ok=True); (DST / "qa").mkdir(exist_ok=True); (DST / "delivery").mkdir(exist_ok=True)
    shutil.copy2(master, DST / "final.mp4")
    for f in ("captions.srt", "captions.vtt", "transcript.txt", "chapters.txt"):
        shutil.copy2(OUT / f, DST / f)
    (DST / "qa" / "longform_qa.json").write_text(json.dumps(q, indent=2))
    shutil.copy2(OUT / "verify.json", DST / "qa" / "verify.json"); shutil.copy2(OUT / "contact_sheet.png", DST / "qa" / "contact_sheet.png")
    subprocess.run([sys.executable, "-m", "pipeline.thumbnail", EP, str(DST / "thumbnail.png")], cwd=ROOT, check=True, capture_output=True)
    (DST / "thumbnail_preview_small.png").replace(DST / "qa" / "thumbnail_at_phone_size.png")
    ch = chapter_list(ep, tl)
    (DST / "description.md").write_text(description(ep, ch))
    moves = next(clock(t) for t, title in ch if title == "What to do instead")
    (DST / "promo.md").write_text((PROMO_CREDIT if EP == "qg02-the-credit" else PROMO).format(moves=moves))
    # 16:9 teaser: the cold open, the episode's key line, then the end of the title card
    T = {s["id"]: s for s in tl}
    (a0, a1), (b0, b1), (c0, c1) = CFG["teaser"]
    cuts = [(0, T[a1]["end"]), (T[b0]["start"], T[b1]["end"]), (T[c1]["start"] + 0.6, T[c1]["end"])]
    fc = "".join(f"[0:v]trim={s}:{e},setpts=PTS-STARTPTS[v{i}];[0:a]atrim={s}:{e},asetpts=PTS-STARTPTS[a{i}];" for i, (s, e) in enumerate(cuts))
    fc += "".join(f"[v{i}][a{i}]" for i in range(len(cuts))) + f"concat=n={len(cuts)}:v=1:a=1[v][a]"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(master), "-filter_complex", fc, "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "20", "-preset", "medium",
                    "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", str(DST / "teaser.mp4")], check=True)

    hosted_info = None
    if a.hosted:
        if HOSTED.exists():
            shutil.rmtree(HOSTED)
        HOSTED.mkdir(parents=True)
        segs = build_stream(master, HOSTED / "stream", ep, tl)
        (HOSTED / "master").mkdir()
        parts = []
        with open(master, "rb") as f:
            i = 0
            while True:
                b = f.read(CHUNK)
                if not b:
                    break
                name = f"master/final.part{i:02d}.b64.txt"; (HOSTED / name).write_bytes(base64.b64encode(b)); parts.append(name); i += 1
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(DST / "thumbnail.png"), "-q:v", "3", str(HOSTED / "poster.jpg")], check=True)
        hosted_info = {"sha256": sha256(master), "size": master.stat().st_size, "parts": parts, "segments": segs}
        (HOSTED / "manifest.json").write_text(json.dumps(hosted_info, indent=1))
        print(f"hosted bundle -> {HOSTED} ({len(segs)} stream parts, {len(parts)} master chunks)")
    write_pages(ep, tl, v, master, hosted_info)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
