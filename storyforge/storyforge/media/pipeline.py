"""The media stage: spec.images -> painted files + a manifest the renderer reads.

Manifest entry (keyed by image id):
  ok, path, width, height, alt, treatment, fallback,
  credit (caption line), license, author, page_url, desc, where (which sections use it), error
Runs are cached: raw downloads and candidate metadata live under <workdir>/raw,
so re-running only paints what changed.
"""
from __future__ import annotations

import json
import os
import re
import urllib.request

from . import commons
from .treat import treat, wash

VERB = {"ink": "Ink & watercolor after", "watercolor": "Watercolor after", "duotone": "Watercolor after", "photo": ""}


def _usage(spec: dict) -> dict[str, list[str]]:
    used: dict[str, list[str]] = {}
    noun = spec["theme"].get("section_noun") or "Section"

    def mark(img, where):
        if img:
            used.setdefault(img, [])
            if where not in used[img]:
                used[img].append(where)

    mark(spec["hero"].get("image"), "Hero")
    for s in spec["sections"]:
        where = f"{noun} {s['number']}"
        for b in s["blocks"]:
            if b["type"] == "figure":
                mark(b["image"], where)
            elif b["type"] in ("figures", "gallery", "people"):
                for it in b["items"]:
                    mark(it.get("image"), where)
    return used


def credit_line(treatment: str, author: str, lic: str) -> str:
    author = re.sub(r"\s+from\s+.*$", "", author or "").strip()
    if treatment == "photo":
        return ", ".join(x for x in (author, lic) if x)
    verb = VERB.get(treatment, "After")
    return f"{verb} {author}, {lic}" if author else f"{verb} a {lic} photograph"


def _fetch_url(url: str, dst: str) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": commons.UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    with open(dst, "wb") as f:
        f.write(data)


def run(spec: dict, workdir: str, *, accent: str | None = None, log=print, offline: bool = False,
        allow_source_images: bool = False) -> dict:
    """Find, download and paint every image in spec['images']. Returns the manifest (also saved to workdir)."""
    raw_dir, out_dir = os.path.join(workdir, "raw"), os.path.join(workdir, "painted")
    os.makedirs(raw_dir, exist_ok=True)
    os.makedirs(out_dir, exist_ok=True)
    manifest_path = os.path.join(workdir, "media.json")
    old = json.load(open(manifest_path)) if os.path.exists(manifest_path) else {}
    accent = accent or spec["theme"].get("accent") or "#ee6a1f"
    used = _usage(spec)
    manifest: dict = {}

    for im in spec["images"]:
        key, role = im["id"], im["role"]
        if key not in used:
            continue
        entry = {"ok": False, "alt": im["alt"], "where": ", ".join(used[key]), "desc": im["alt"], "fallback": False}
        prev = old.get(key)
        painted = os.path.join(out_dir, f"{key}.webp")
        if prev and prev.get("ok") and prev.get("query") == im["query"] and prev.get("treatment_req") == im["treatment"] \
                and os.path.exists(painted):
            manifest[key] = prev
            log(f"  = {key}: cached")
            continue
        raw = os.path.join(raw_dir, f"{key}.img")
        meta = None
        try:
            if im.get("source_url") and allow_source_images:  # rights unknown: opt-in only
                if not os.path.exists(raw):
                    _fetch_url(im["source_url"], raw)
                meta = {"license": "image from the source page", "artist": "", "page_url": im["source_url"], "description": im["alt"]}
            elif not offline:
                cands, used_q = commons.find_relaxed(im["query"], role)
                if used_q != im["query"]:
                    log(f"    {key}: no match for “{im['query']}”, used “{used_q}”")
                if not cands:
                    raise LookupError("no freely licensed match on Wikimedia Commons")
                c = cands[0]
                if not os.path.exists(raw) or (prev or {}).get("title") != c.title:
                    commons.download(c, raw)
                meta = {"license": c.license, "artist": c.artist, "page_url": c.page_url,
                        "description": c.description, "title": c.title, "score": c.score}
            else:
                raise LookupError("offline")
            info = treat(raw, painted, key=key, role=role, treatment=im["treatment"], accent=accent)
            entry.update(ok=True, path=painted, width=info["width"], height=info["height"], treatment=info["treatment"],
                         license=meta["license"], author=meta["artist"], page_url=meta["page_url"], title=meta.get("title"),
                         credit=credit_line(info["treatment"], meta["artist"], meta["license"]))
            log(f"  + {key}: {meta.get('title') or im.get('source_url')} -> {info['treatment']}")
        except Exception as e:  # never fail the build on one image
            entry["error"] = f"{type(e).__name__}: {e}"
            if role == "portrait":
                info = wash(painted, key=key, accent=accent)
                entry.update(ok=True, path=painted, width=info["width"], height=info["height"], treatment="wash",
                             fallback=True, credit="")
                log(f"  ~ {key}: no portrait found ({entry['error']}); using an initials wash")
            else:
                log(f"  - {key}: {entry['error']}; figure will be omitted")
        entry.update(query=im["query"], treatment_req=im["treatment"])
        manifest[key] = entry

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=1, ensure_ascii=False)
    contact_sheet(manifest, os.path.join(workdir, "contact.png"))
    return manifest


def contact_sheet(manifest: dict, path: str, tile: int = 260) -> None:
    """One image with every painted plate and its id + source title, for a quick human (or Claude) review."""
    import cv2
    import numpy as np
    tiles = []
    for key, m in manifest.items():
        if not m.get("ok"):
            continue
        im = cv2.imread(m["path"])
        if im is None:
            continue
        h, w = im.shape[:2]
        s = tile / max(h, w)
        im = cv2.resize(im, (int(w * s), int(h * s)))
        canvas = np.full((tile + 46, tile, 3), 255, np.uint8)
        canvas[:im.shape[0], :im.shape[1]] = im
        label = (m.get("title") or ("initials wash" if m.get("fallback") else ""))[5:42] if m.get("title") else ("initials wash" if m.get("fallback") else "")
        cv2.putText(canvas, key[:28], (4, tile + 18), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (20, 20, 20), 1, cv2.LINE_AA)
        cv2.putText(canvas, label, (4, tile + 38), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (90, 90, 90), 1, cv2.LINE_AA)
        tiles.append(canvas)
    if not tiles:
        return
    cols = 4
    while len(tiles) % cols:
        tiles.append(np.full_like(tiles[0], 255))
    rows = [np.hstack(tiles[i:i + cols]) for i in range(0, len(tiles), cols)]
    cv2.imwrite(path, np.vstack(rows))
