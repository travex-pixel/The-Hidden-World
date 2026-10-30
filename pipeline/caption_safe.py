"""Check that "punch" captions stay inside the YouTube Shorts safe area.

Mirrors renderer/engine.js punchChunks/punchCaption (chunking, 92 px Nunito ExtraBold, two-row split, row scaling to
caption_max_w) and measures every word with the real font file, so the result describes what the frames actually show.
Safe area at 1080x1920 (Shorts UI): keep clear of the top bar, the right-hand action buttons and the bottom title block.

usage: python -m pipeline.caption_safe out/<episode_id>/plan.json
"""
from __future__ import annotations
import json, re, sys
from pathlib import Path
from PIL import ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONT = ROOT / "assets" / "fonts" / "Nunito-ExtraBold.ttf"
SAFE = {"left": 100, "right": 980, "top": 260, "bottom": 1510}
FS, GAP, POP, STROKE = 92, 56, 1.07, 7


def chunks(lines: list) -> list[list[dict]]:
    words = [{"w": w["w"], "s": l["start"] + w["start"], "e": l["start"] + w["end"]} for l in lines for w in l.get("words", [])]
    out, cur = [], []
    for w in words:
        prev = cur[-1] if cur else None
        brk = prev and (len(cur) >= 3 or len(" ".join(x["w"] for x in cur) + " " + w["w"]) > 15
                        or re.search(r"[.,:;?!\"]$", prev["w"]) or w["s"] - prev["e"] > 0.35)
        if brk:
            out.append(cur); cur = []
        cur.append(w)
    if cur:
        out.append(cur)
    return out


def check(plan: dict) -> dict:
    ep = plan["episode"]; font = ImageFont.truetype(str(FONT), FS); max_w = ep.get("caption_max_w", 920)
    worst = {"left": 1e9, "right": -1e9, "top": 1e9, "bottom": -1e9}; scaled = []; n = 0
    for s, sc in zip(plan["timeline"], ep["scenes"]):
        y0 = sc.get("caption_y", 1380)
        for c in chunks(s.get("lines", [])):
            n += 1; ws = [font.getlength(w["w"].upper()) for w in c]
            total = sum(ws) + GAP * (len(ws) - 1)
            rows = [ws[:(len(ws) + 1) // 2], ws[(len(ws) + 1) // 2:]] if total > max_w and len(ws) > 1 else [ws]
            for ri, row in enumerate(rows):
                rw0 = sum(row) + GAP * (len(row) - 1); k = min(1.0, max_w / rw0); rw = rw0 * k
                if k < 1:
                    scaled.append(" ".join(w["w"] for w in c))
                pop = (POP - 1) * max(row) * k / 2   # an active edge word grows 7 % about its own centre
                base = y0 + (ri - (len(rows) - 1) / 2) * FS * 1.08 + FS * 0.34
                worst["left"] = min(worst["left"], 540 - rw / 2 - pop - STROKE); worst["right"] = max(worst["right"], 540 + rw / 2 + pop + STROKE)
                worst["top"] = min(worst["top"], base - 0.75 * FS * k * POP - STROKE); worst["bottom"] = max(worst["bottom"], base + 0.16 * FS * k + STROKE)
    ok = worst["left"] >= SAFE["left"] and worst["right"] <= SAFE["right"] and worst["top"] >= SAFE["top"] and worst["bottom"] <= SAFE["bottom"]
    return {"ok": ok, "chunks": n, "extent": {k: round(v, 1) for k, v in worst.items()}, "safe_area": SAFE, "rows_scaled_to_fit": scaled}


if __name__ == "__main__":
    r = check(json.loads(Path(sys.argv[1]).read_text()))
    print(json.dumps(r, indent=2)); sys.exit(0 if r["ok"] else 1)
