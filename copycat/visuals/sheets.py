"""Contact sheets: python -m copycat.visuals.sheets [subject ...]  ->  build/copycat/vault_sheets/<subject>.jpg"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "build/copycat/vault_sheets"
VAULT = ROOT / "assets/cache/black-clover/vault.json"


def sheet(subject, assets, cols=4, tw=380, th=214):
    rows = (len(assets) + cols - 1) // cols
    im = Image.new("RGB", (cols * tw, rows * (th + 34)), (20, 20, 24))
    d = ImageDraw.Draw(im)
    for i, a in enumerate(assets):
        x, y = (i % cols) * tw, (i // cols) * (th + 34)
        t = Image.open(ROOT / a["path"]).convert("RGB"); t.thumbnail((tw - 6, th - 2))
        im.paste(t, (x + 3 + (tw - 6 - t.width) // 2, y + 1))
        d.text((x + 4, y + th + 1), f"{a['id']} {a['width']}x{a['height']} {a['kind'][:5]}", fill=(255, 220, 120))
        d.text((x + 4, y + th + 13), a["file_title"].replace("File:", "")[:60], fill=(200, 200, 200))
    return im


def main(argv):
    OUT.mkdir(parents=True, exist_ok=True)
    assets = json.loads(VAULT.read_text())["assets"]
    subs = argv or sorted({s for a in assets for s in a["tags"]["subjects"]})
    for s in subs:
        sel = [a for a in assets if s in a["tags"]["subjects"]]
        if not sel: continue
        for n, i in enumerate(range(0, len(sel), 16)):
            sheet(s, sel[i:i + 16]).save(OUT / (f"{s}.jpg" if n == 0 else f"{s}_{n + 1}.jpg"), quality=85)
        print(s, len(sel))


if __name__ == "__main__":
    main(sys.argv[1:])
