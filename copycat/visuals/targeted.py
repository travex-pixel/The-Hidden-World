"""Targeted Narutopedia top-ups for the vault (uses the existing harvester pipeline, naruto.fandom.com only).

    python -m copycat.visuals.targeted --terms terms.txt [--pages "Iruka Umino" ...] [--max 150] [--all]

Candidates come from File-namespace keyword searches and from the image lists of named wiki pages. Each candidate goes
through the same size/name/era filters and ranking as the main harvest (`harvester.naruto_rank`) unless ``--all`` is given
(then only the size/name filters apply and the manual curation decides). Downloads go to assets/cache/naruto/images and the
registry; the vault is rebuilt afterwards (curation.json is applied by the build).
"""
from __future__ import annotations

import argparse
import sys

from . import harvester as H
from . import imgutil
from . import narutopedia as npd


def candidates(terms, pages, refresh=False):
    titles = {}
    for term in terms:
        try:
            d = H.api({"action": "query", "list": "search", "srsearch": term, "srnamespace": "6", "srlimit": "50"}, refresh)
        except Exception as e:                                   # network hiccup: skip the term
            H.log(f"search {term!r}: {e}")
            continue
        for x in d.get("query", {}).get("search", []):
            titles.setdefault(x["title"], f"search:{term}")
    for pg in pages:
        try:
            d = H.api({"action": "query", "titles": pg, "prop": "images", "imlimit": "500", "redirects": "1"}, refresh)
        except Exception as e:
            H.log(f"page {pg!r}: {e}")
            continue
        for p in d.get("query", {}).get("pages", []):
            for im in p.get("images", []):
                titles.setdefault(im["title"], f"page:{pg}")
    return titles


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--terms", help="text file, one File-namespace search term per line")
    ap.add_argument("--pages", nargs="*", default=[])
    ap.add_argument("--titles", nargs="*", default=[], help="exact File: titles to fetch (no ranking, size/name filters only)")
    ap.add_argument("--max", type=int, default=150)
    ap.add_argument("--all", action="store_true", help="skip the era/subject ranking; size + name filters only")
    ap.add_argument("--dry", action="store_true")
    a = ap.parse_args(argv)
    H.configure("naruto")
    npd_min = npd.MIN_W
    H.RAW.mkdir(parents=True, exist_ok=True)
    reg = H.load_registry()
    terms = [l.strip() for l in open(a.terms)] if a.terms else []
    titles = {t: s for t, s in candidates([t for t in terms if t], a.pages).items() if t not in reg}
    for t in a.titles:
        titles.setdefault(t if t.startswith("File:") else "File:" + t, "title")
    if a.titles:
        a.all = True
    H.log(f"{len(titles)} new file titles")
    cand = {}
    tl = sorted(titles)
    for i in range(0, len(tl), 50):
        for p in H.api_all({"action": "query", "titles": "|".join(tl[i:i + 50]), "prop": "imageinfo|revisions", "iiprop": "url|size|mime",
                            "rvprop": "content", "rvslots": "main"}):
            rec = H.page_record(p, "")
            if not rec or rec["mime"] not in ("image/png", "image/jpeg") or rec["w"] < npd_min:
                continue
            if imgutil.NAME_REJECT.search(rec["title"]) or npd.NAME_REJECT.search(rec["title"]):
                continue
            rv = p.get("revisions")
            meta = npd.parse_meta(rv[0]["slots"]["main"]["content"]) if rv else {}
            meta["targeted"] = titles.get(rec["title"], "")
            rec["meta"] = meta
            cand[rec["title"]] = rec
    H.log(f"{len(cand)} candidates after size/name filter")
    if a.all:
        ranked = [(0, r, None) for r in cand.values() if (r.get("meta") or {}).get("series") != "boruto"
                  and (not a.titles or r["title"] in titles)]
    else:
        ranked = H.naruto_rank(cand)
    H.log(f"{len(ranked)} ranked")
    if a.dry:
        for _, r, _t in ranked[:80]:
            print(r["title"], r["w"], r["meta"].get("series"), r["meta"].get("episode"))
        return 0
    n = 0
    for sc, rec, t in ranked:
        if rec["title"] in reg or n >= a.max:
            continue
        m = rec.get("meta") or {}
        rec = {**rec, "page": f"Episode {m['episode']} ({m['series']})" if m.get("episode") else (m.get("series") or "targeted"),
               "caption": m.get("desc", ""), "min_w": npd_min}
        e = H.fetch_and_register(rec, "anime_still", reg)
        e["meta"] = m
        n += 1
        if n % 25 == 0:
            H.save_registry(reg)
            H.log(f"{n} fetched")
    H.save_registry(reg)
    final, reasons = H.build_vault_naruto()
    H.log(f"vault: {len(final)} assets; fetched {n}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
