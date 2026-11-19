"""Contact sheets: python -m copycat.visuals.sheets [--franchise naruto] [--era part1] [--list] [subject ...]
-> build/copycat/vault_sheets[/<franchise>]/<subject>.jpg   (black-clover keeps the legacy flat folder)"""
import argparse
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from .. import franchise as franchise_mod

ROOT = Path(__file__).resolve().parents[2]


def _font(sz):
    for p in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf"):
        if Path(p).exists():
            return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def sheet(subject, assets, cols=4, tw=380, th=None):
    th = th or int(tw * 9 / 16)
    rows = (len(assets) + cols - 1) // cols
    im = Image.new("RGB", (cols * tw, rows * (th + 34)), (20, 20, 24))
    d = ImageDraw.Draw(im)
    f1, f2 = _font(15), _font(11)
    for i, a in enumerate(assets):
        x, y = (i % cols) * tw, (i // cols) * (th + 34)
        t = Image.open(ROOT / a["path"]).convert("RGB"); t.thumbnail((tw - 6, th - 2))
        im.paste(t, (x + 3 + (tw - 6 - t.width) // 2, y + 1))
        era = a["tags"].get("era")
        d.text((x + 4, y + th + 1), f"{a['id']} {a['width']}x{a['height']}" + (f" {era}" if era else ""), fill=(255, 220, 120), font=f1)
        d.text((x + 4, y + th + 18), a["file_title"].replace("File:", "")[:62], fill=(200, 200, 200), font=f2)
    return im


def main(argv):
    ap = argparse.ArgumentParser()
    ap.add_argument("subjects", nargs="*")
    ap.add_argument("--franchise", default="black-clover")
    ap.add_argument("--era", help="only assets with this era tag (naruto)")
    ap.add_argument("--per", type=int, default=16, help="thumbnails per sheet")
    ap.add_argument("--cols", type=int, default=4)
    ap.add_argument("--tw", type=int, default=380, help="thumbnail width (height = 9/16)")
    ap.add_argument("--ids", help="comma list of asset ids instead of subjects (one sheet, any subject)")
    ap.add_argument("--idfile", help="JSON list of asset ids -> numbered sheets (--per per sheet) named <prefix>_NN.jpg")
    ap.add_argument("--prefix", default="pool")
    ap.add_argument("--outdir", help="output directory (default build/copycat/vault_sheets/<franchise>)")
    a = ap.parse_args(argv)
    fr = franchise_mod.load(a.franchise)
    out = ROOT / "build/copycat/vault_sheets" / ("" if a.franchise == "black-clover" else a.franchise)
    out.mkdir(parents=True, exist_ok=True)
    if a.outdir:
        out = Path(a.outdir); out.mkdir(parents=True, exist_ok=True)
    assets = json.loads((ROOT / fr["vault_dir"] / "vault.json").read_text())["assets"]
    if a.idfile:
        want = json.loads(Path(a.idfile).read_text())
        byid = {x["id"]: x for x in assets}
        sel = [byid[i] for i in want if i in byid]
        for n, i in enumerate(range(0, len(sel), a.per)):
            sheet("pool", sel[i:i + a.per], cols=a.cols, tw=a.tw).save(out / f"{a.prefix}_{n + 1:02d}.jpg", quality=86)
        print(a.prefix, len(sel), "frames", (len(sel) + a.per - 1) // a.per, "sheets ->", out); return
    if a.era: assets = [x for x in assets if x["tags"].get("era") == a.era]
    if a.ids:
        want = set(a.ids.split(","))
        sel = [x for x in assets if x["id"] in want]
        sheet("ids", sel, cols=a.cols, tw=a.tw).save(out / "ids.jpg", quality=85); print("ids", len(sel)); return
    subs = a.subjects or sorted({s for x in assets for s in x["tags"]["subjects"]})
    for s in subs:
        sel = [x for x in assets if s in x["tags"]["subjects"]]
        if not sel: continue
        for n, i in enumerate(range(0, len(sel), a.per)):
            sheet(s, sel[i:i + a.per], cols=a.cols, tw=a.tw).save(out / (f"{s}.jpg" if n == 0 else f"{s}_{n + 1}.jpg"), quality=85)
        print(s, len(sel))


if __name__ == "__main__":
    main(sys.argv[1:])
