"""Review sheets: python -m copycat.storyboard <project_id> [--per 12]

12 shots per sheet (4x3). Each cell shows the asset as it will be framed (fill crop around focus, or an
approximated depth_frame), labelled with shot id / time / beat#cut / asset / speaker / beat text.
Weak matches and unmatched cuts are outlined in red.
"""
from __future__ import annotations

import argparse
import json
import sys
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
CW, CH, LAB, PAD = 480, 270, 58, 4


def _font(sz):
    for p in ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/usr/share/fonts/dejavu/DejaVuSans.ttf"):
        if Path(p).exists():
            return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def frame(img: Image.Image, layout: str, focus, w=CW, h=CH) -> Image.Image:
    img = img.convert("RGB")
    iw, ih = img.size
    fx, fy = focus
    if layout == "fill":
        tr = w / h
        if iw / ih > tr:
            cw, chh = ih * tr, ih
        else:
            cw, chh = iw, iw / tr
        x0 = min(max(fx * iw - cw / 2, 0), iw - cw)
        y0 = min(max(fy * ih - chh / 2, 0), ih - chh)
        return img.crop((int(x0), int(y0), int(x0 + cw), int(y0 + chh))).resize((w, h), Image.LANCZOS)
    bg = img.copy()
    tr = w / h
    if iw / ih > tr:
        cw, chh = ih * tr, ih
    else:
        cw, chh = iw, iw / tr
    x0, y0 = (iw - cw) / 2, (ih - chh) / 2
    bg = bg.crop((int(x0), int(y0), int(x0 + cw), int(y0 + chh))).resize((w, h)).filter(ImageFilter.GaussianBlur(10))
    bg = Image.eval(bg, lambda v: int(v * 0.5))
    fg = img.copy()
    fg.thumbnail((int(w * 0.92), int(h * 0.94)), Image.LANCZOS)
    bg.paste(fg, ((w - fg.width) // 2, (h - fg.height) // 2))
    return bg


def insert_cell(s, w=CW, h=CH):
    """Thumbnail of a designed insert at the end of its shot (all ink revealed), rendered with the real insert engine."""
    try:
        import hashlib
        import numpy as np
        from . import inserts
        from .compositor import make_vignette
        bg = ROOT / s["bg_path"]
        code = "".join(str((ROOT / "copycat" / f).stat().st_mtime_ns) for f in ("inserts.py", "visuals/paper.py"))
        key = hashlib.sha1((json.dumps([s["insert"], s["start"], s["end"], s["bg_path"], w, h], sort_keys=True) + code).encode()).hexdigest()[:16]
        cache = ROOT / "build/copycat/_insert_thumbs"
        cache.mkdir(parents=True, exist_ok=True)
        if (cache / f"{key}.png").exists():
            return Image.open(cache / f"{key}.png").convert("RGB")
        spec = dict(s["insert"])
        spec["shot_start"], spec["shot_end"] = s["start"], s["end"]
        shot = dict(id=s["id"], start=s["start"], end=s["end"], insert=spec, vfx=[], _abs_path=str(bg))
        sc = inserts.InsertScene(shot, w, h, 30, make_vignette(w, h))
        sc.t0 = s["end"] - 0.05
        im = Image.fromarray(_frame_at(sc, 0.92))
        im.save(cache / f"{key}.png")
        return im
    except Exception as e:                              # pragma: no cover
        im = Image.new("RGB", (w, h), (40, 40, 60))
        ImageDraw.Draw(im).text((10, 10), f"insert render failed: {e}"[:60], fill=(255, 120, 120))
        return im


def _frame_at(sc, p):
    """Frame of an InsertScene at shot progress p (ink state taken at that time)."""
    import numpy as np
    from PIL import Image as PI
    from . import inserts
    t = sc.spec["shot_start"] + p * (sc.spec["shot_end"] - sc.spec["shot_start"])
    fr = sc.canvas_at(t)
    cx, cy, z = inserts.view_window(sc.D, sc.view, p, sc.W, sc.H)
    ww, wh = inserts.W0 / z, inserts.H0 / z
    K = inserts.K
    box = ((cx - ww / 2) * K, (cy - wh / 2) * K, (cx + ww / 2) * K, (cy + wh / 2) * K)
    return np.array(PI.fromarray(fr).resize((sc.W, sc.H), PI.BICUBIC, box=box))


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("--per", type=int, default=12)
    a = ap.parse_args(argv)
    proj = ROOT / "copycat/projects" / a.project
    edit = json.loads((proj / "edit.json").read_text())
    script = json.loads((proj / "script.json").read_text())
    rep_p = ROOT / "build/copycat" / a.project / "mapper_report.json"
    rep = json.loads(rep_p.read_text()) if rep_p.exists() else {}
    weak = {w["shot"] for w in rep.get("weak_matches", [])}
    unm = {u["shot"] for u in rep.get("unmatched_cuts", [])}
    texts = {b["id"]: b["text"] for c in script["chapters"] for b in c["beats"]}
    cutidx = {}
    shots = edit["shots"]
    for s in shots:                                    # beat#cut index by order within a beat
        if s["beat_id"]:
            cutidx.setdefault(s["beat_id"], 0)
    seen = {}
    out = ROOT / "build/copycat" / a.project / "storyboard"
    out.mkdir(parents=True, exist_ok=True)
    for f in out.glob("sheet_*.jpg"):
        f.unlink()
    f1, f2 = _font(12), _font(11)
    n_sheets = (len(shots) + a.per - 1) // a.per
    for si in range(n_sheets):
        chunk = shots[si * a.per:(si + 1) * a.per]
        cols = 4
        rows = (len(chunk) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * (CW + PAD), rows * (CH + LAB + PAD)), (16, 16, 20))
        d = ImageDraw.Draw(sheet)
        for k, s in enumerate(chunk):
            x, y = (k % cols) * (CW + PAD), (k // cols) * (CH + LAB + PAD)
            bid = s["beat_id"]
            ci = ""
            if bid:
                ci = f"{bid}#{seen.get(bid, 0)}"
                seen[bid] = seen.get(bid, 0) + 1
            if s["type"] == "card":
                cell = Image.new("RGB", (CW, CH), (30, 10, 14))
                ImageDraw.Draw(cell).text((20, 110), f"CARD {s['card']['numeral']}  {s['card']['title']}", fill=(240, 220, 200), font=f1)
            elif s["type"] == "insert":
                cell = insert_cell(s)
                ImageDraw.Draw(cell).rectangle([0, 0, 150, 16], fill=(20, 20, 20))
                ImageDraw.Draw(cell).text((4, 2), "INSERT " + s["insert"]["type"], fill=(120, 255, 160), font=f2)
            elif s["asset_path"]:
                try:
                    cell = frame(Image.open(ROOT / s["asset_path"]), s["layout"], s["focus"])
                except Exception as e:                  # pragma: no cover
                    cell = Image.new("RGB", (CW, CH), (60, 0, 0))
            else:
                cell = Image.new("RGB", (CW, CH), (90, 0, 0))
                ImageDraw.Draw(cell).text((20, 120), "NO ASSET", fill=(255, 255, 255), font=f1)
            sheet.paste(cell, (x, y))
            if s["id"] in weak or s["id"] in unm:
                d.rectangle([x, y, x + CW - 1, y + CH + LAB - 1], outline=(255, 40, 40), width=3)
            d.text((x + 4, y + CH + 2), f"{s['id']} {s['start']:.1f}-{s['end']:.1f}s {ci} {s['asset_id'] or '-'} "
                   f"{s['speaker'] or ''} {s['layout'][:5]}/{s['camera'][:9]}", fill=(255, 215, 120), font=f2)
            t = textwrap.wrap(texts.get(bid, ""), 62)[:1]
            d.text((x + 4, y + CH + 16), (t[0] if t else "")[:60], fill=(215, 215, 215), font=f1)
            if s["id"] in weak:
                d.text((x + 4, y + CH + 32), "WEAK", fill=(255, 80, 80), font=f1)
        sheet.save(out / f"sheet_{si + 1:02d}.jpg", quality=82)
    print(f"{n_sheets} sheets -> {out}")


if __name__ == "__main__":
    sys.exit(main())
