"""Publishing pack for a history-profile episode: titles, description with chapters and source ledger,
subtitles, thumbnail, QA summary and production log. Nothing is uploaded.

usage: python -m pipeline.publish_history out/<id>   (after pipeline.build and pipeline.qa_history)
"""
from __future__ import annotations
import json, os, shutil, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "assets" / "fonts"


def ts(x: float) -> str:
    m, s = divmod(int(x), 60); return f"{m}:{s:02d}"


def chapters(ep, tl):
    out = []
    for s, sc in zip(tl, ep["scenes"]):
        if sc.get("chapter"):
            out.append((s["start"], sc["chapter"]))
    if out and out[0][0] > 0:
        out[0] = (0.0, out[0][1])
    return out


def source_ledger(ep) -> str:
    src = {s["id"]: s for s in ep["sources"]}
    lines = [f"# Source ledger — {ep['title']}\n", "Claim types: **established** (documented), **estimate**, **plausible** (reasonable reconstruction), **disputed**, **illustrative** (fiction/dramatisation).\n",
             "> Verification status: sources were identified through web search on the access date; the build environment could not open the pages themselves (network policy). Every source must be opened and checked by a person before publication.\n"]
    for c in ep["claims"]:
        lines.append(f"## {c['id']} · {c['type']}\n{c['text']}\n")
        for sid in c.get("sources", []):
            s = src[sid]; lines.append(f"- [{s['title']}]({s['url']}) — {s['publisher']} (accessed {s['accessed']}; {s.get('note', '')})")
        if not c.get("sources"):
            lines.append("- No source: this is fiction, labelled on screen as DRAMATISED.")
        lines.append("")
    return "\n".join(lines)


def thumbnail(out_dir: Path, plan: dict, spec: dict, dest: Path):
    """Composite of two clean renderer frames + short text. Spec: face_t, coin_t, text, sub."""
    st = out_dir / "thumb_src"; env = {**os.environ, "CLEAN": "1"}
    hp = json.loads((out_dir / "plan.json").read_text()); hp.update({"width": 1920, "height": 1080})
    (st).mkdir(exist_ok=True); (st / "plan.json").write_text(json.dumps(hp))
    subprocess.run(["node", str(ROOT / "pipeline" / "stills.mjs"), str(st / "plan.json"), str(st), str(spec["face_t"]), str(spec["coin_t"])], check=True, cwd=ROOT, env=env)
    face = Image.open(st / f"t{spec['face_t']:.2f}.png").convert("RGB"); coin = Image.open(st / f"t{spec['coin_t']:.2f}.png").convert("RGB")
    W, H = 1280, 720
    bg = face.resize((W, H)).filter(ImageFilter.GaussianBlur(6)); bg = ImageEnhance.Brightness(bg).enhance(0.75)
    fx, fy, fw = spec.get("face_crop", [700, 120, 760])
    hero = face.crop((fx, fy, fx + fw, fy + int(fw * 1.0))).resize((700, 700))
    hero = ImageEnhance.Color(hero).enhance(1.25); hero = ImageEnhance.Contrast(hero).enhance(1.08)
    fm = Image.new("L", (700, 700), 0); ImageDraw.Draw(fm).rounded_rectangle([40, 40, 640, 660], 80, fill=255); fm = fm.filter(ImageFilter.GaussianBlur(28))
    bg.paste(hero, (-30, 20), fm)
    # coin medallion on the right with a warm rim
    cx, cy, cw = spec.get("coin_crop", [560, 160, 800])
    cc = coin.crop((cx, cy, cx + cw, cy + cw)).resize((520, 520)); cc = ImageEnhance.Contrast(cc).enhance(1.15)
    mask = Image.new("L", (520, 520), 0); ImageDraw.Draw(mask).ellipse([0, 0, 519, 519], fill=255)
    ring = Image.new("RGBA", (560, 560), (0, 0, 0, 0)); ImageDraw.Draw(ring).ellipse([0, 0, 559, 559], fill=(233, 184, 96, 255))
    bg.paste(ring, (700, 70), ring); bg.paste(cc, (720, 90), mask)
    d = ImageDraw.Draw(bg)
    big = ImageFont.truetype(str(FONTS / "Fraunces-ExtraBold.ttf"), 112); small = ImageFont.truetype(str(FONTS / "Nunito-ExtraBold.ttf"), 44)
    txt = spec["text"]; tw = d.textlength(txt, font=big); x = W - tw - 40; y = H - 170
    for dx in range(-6, 7, 3):
        for dy in range(-6, 7, 3):
            d.text((x + dx, y + dy), txt, font=big, fill=(26, 14, 8))
    d.text((x, y), txt, font=big, fill=(255, 238, 200))
    if spec.get("sub"):
        sw = d.textlength(spec["sub"], font=small); d.rounded_rectangle([W - sw - 70, 24, W - 24, 92], 20, fill=(168, 50, 42)); d.text((W - sw - 48, 30), spec["sub"], font=small, fill=(255, 244, 228))
    bg.save(dest, quality=92)
    shutil.rmtree(st, ignore_errors=True)


def run(out_dir: Path) -> Path:
    plan = json.loads((out_dir / "plan.json").read_text()); ep = plan["episode"]; tl = plan["timeline"]; pub = ep.get("publishing", {})
    dest = out_dir / "publish"; dest.mkdir(exist_ok=True)
    total = tl[-1]["end"]
    ch = chapters(ep, tl)
    titles = pub.get("titles", [ep["title"]])
    (dest / "titles.md").write_text("# Title options\n\n" + "\n".join(f"{i}. {t}" for i, t in enumerate(titles, 1)) + "\n\nRecommended: option 1 (matches the thumbnail promise and the first ten seconds).\n")
    desc = [pub.get("description", ep["central_question"]), ""]
    if len(ch) >= 3 and total >= 60:
        desc += ["Chapters"] + [f"{ts(a)} {name}" for a, name in ch] + [""]
    desc += ["What's real: the coins, the law and the houses are documented history (sources below). You, the baker, the hen and the dialogue are fiction, and labelled on screen.", "",
             "Sources"] + [f"- {s['title']} — {s['publisher']}: {s['url']}" for s in ep["sources"]] + ["", "Narration: Piper TTS (en_GB-aru-medium, CC BY 4.0 dataset). Music and sound: original, generated in code."]
    (dest / "description.txt").write_text("\n".join(desc))
    (dest / "sources.md").write_text(source_ledger(ep))
    shutil.copy(out_dir / f"{ep['id']}.srt", dest / f"{ep['id']}.en.srt")
    if (out_dir / "qa" / "qa_report.md").exists():
        shutil.copy(out_dir / "qa" / "qa_report.md", dest / "qa_report.md")
    if pub.get("thumbnail"):
        thumbnail(out_dir, plan, pub["thumbnail"], dest / "thumbnail.jpg")
        (dest / "thumbnail_concept.md").write_text(pub["thumbnail"].get("concept", ""))
    timings = json.loads((out_dir / "timings.json").read_text()) if (out_dir / "timings.json").exists() else {}
    prod = ["# Production log\n", f"- Duration: {total:.1f} s, {plan['width']}x{plan['height']} @ {plan['fps']} fps, seed {plan['seed']}",
            f"- Wall-clock build: {timings.get('total_s', '?')} s (render {timings.get('render_s', '?')} s with {plan.get('workers', 1)} parallel pages; narration {timings.get('narration_s', '?')} s; audio {timings.get('audio_s', '?')} s)",
            f"- Machine: {timings.get('cpus', '?')} CPU cores, software rasteriser (no GPU)",
            "- Paid services: none. Narration Piper TTS (local), music/SFX NumPy, art procedural Canvas 2D, render headless Chromium + ffmpeg.",
            "- Marginal cost per episode: $0 on owned hardware. On GitHub Actions' standard 4-core runners the build fits easily in the free minutes of a public repository; on a private repo it uses roughly the wall-clock minutes above from the monthly allowance.",
            "- Human time still required: script and fact-check review, visual review of storyboard.png / transitions.png, listening pass."]
    (dest / "production.md").write_text("\n".join(prod))
    return dest


if __name__ == "__main__":
    print(run(Path(sys.argv[1])))
