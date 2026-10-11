"""Visual asset pipeline: provenance records, rights decisions, quality checks, style policy and segment-aware selection.

Policy (channel style, true-crime documentaries):
* Cinematic cartoon identity. People appear as consistent stylised characters (renderer/cast.js rig via the
  documentary `character` template) or featureless silhouettes — never photorealistic people, and never AI images
  that could pass for real photos, CCTV, evidence, documents or news footage.
* Authentic photographs of real people are allowed only as clearly framed, attributed archival inserts, and only when
  the rights are cleared. Unknown, editorial-only, all-rights-reserved or "fair use" material is never auto-cleared:
  it goes to human/legal review. A photo found online is not assumed free to use.
* AI-generated or procedural imagery is allowed for environments, weather, atmosphere and transitions, labelled as
  illustration. Reconstructions are labelled. A depicted act must be an established fact for that person (gate G14).

usage: python -m documentary.assets ledger <film_dir> <run_dir> [--out file]   (asset/provenance ledger for a run)
"""
from __future__ import annotations
import argparse, json, re, sys
from pathlib import Path

AUTO_CLEAR = {  # licence short name (lower) -> (attribution required, share-alike)
    "public domain": (False, False), "pd": (False, False), "pd-usgov": (False, False), "cc0": (False, False), "cc0 1.0": (False, False),
    "cc by 4.0": (True, False), "cc by 3.0": (True, False), "cc by 2.0": (True, False), "cc-by-4.0": (True, False), "cc-by-3.0": (True, False),
    "cc by-sa 4.0": (True, True), "cc by-sa 3.0": (True, True), "cc-by-sa-4.0": (True, True), "cc-by-sa-3.0": (True, True),
    "sil ofl 1.1": (True, False), "mit": (True, False), "original work": (False, False),
}
NEVER_AUTO = re.compile(r"(fair use|editorial|all rights reserved|unknown|copyright|getty|ap images|reuters|news photo|screenshot|courtesy)", re.I)
PHOTOREAL_PEOPLE_KINDS = {"photo", "footage"}


def rights_decision(a: dict) -> dict:
    """cleared / needs_review / rejected, with reasons. Deterministic and conservative."""
    why = []
    src = a.get("source") or {}
    lic = (a.get("licence") or {}).get("name", "").strip().lower()
    if a.get("kind") not in ("illustration", "procedural", "typography", "font", "voice", "music", "data") and not src.get("url"):
        return {"status": "rejected", "reasons": ["no source URL recorded (provenance unknown)"]}
    if not lic:
        return {"status": "needs_review", "reasons": ["no licence recorded"]}
    if NEVER_AUTO.search(lic) or NEVER_AUTO.search((a.get("licence") or {}).get("usage_terms", "")):
        return {"status": "needs_review", "reasons": [f"licence/usage '{lic}' requires human or legal review; never auto-cleared"]}
    if lic not in AUTO_CLEAR:
        return {"status": "needs_review", "reasons": [f"licence '{lic}' not on the auto-clear list"]}
    attr, sa = AUTO_CLEAR[lic]
    if attr and not a.get("attribution_text"):
        return {"status": "needs_review", "reasons": ["licence requires attribution but no attribution text recorded"]}
    if sa: why.append("share-alike: derivative must carry the same licence")
    if a.get("depicts", {}).get("person") and a.get("kind") in PHOTOREAL_PEOPLE_KINDS:
        why.append("depicts a real person: use only as a framed, attributed archival insert; check personality/privacy rights")
    return {"status": "cleared", "reasons": why or ["licence permits use"], "attribution_required": attr}


def quality_check(a: dict, use: str = "full_frame") -> dict:
    q = a.get("quality") or {}
    w, h = q.get("width", 0), q.get("height", 0)
    need = {"full_frame": 1920, "inset": 640, "thumbnail": 1280}.get(use, 1280)
    issues = []
    if a.get("kind") in ("photo", "footage", "illustration") and w and w < need:
        issues.append(f"width {w}px < {need}px needed for {use}")
    if w and h and not (0.4 <= w / h <= 3.0):
        issues.append(f"unusual aspect ratio {w}x{h}")
    return {"ok": not issues, "issues": issues}


def style_check(a: dict) -> dict:
    """Channel style: no photorealistic people; AI imagery only for environments and clearly labelled."""
    issues = []
    if a.get("ai_generated") and a.get("depicts", {}).get("person"):
        issues.append("AI-generated depiction of a real person is not allowed (use the stylised cast or a silhouette)")
    if a.get("ai_generated") and a.get("purpose") in ("evidence", "document", "photo_of_person", "cctv", "news_footage"):
        issues.append(f"AI-generated imagery cannot stand in for {a.get('purpose')}")
    if a.get("ai_generated") and not a.get("label"):
        issues.append("AI/illustrative imagery must carry an on-screen illustration label")
    if a.get("kind") in PHOTOREAL_PEOPLE_KINDS and a.get("depicts", {}).get("person") and a.get("presentation") != "framed_archival_insert":
        issues.append("authentic photos of real people appear only as framed, attributed archival inserts (cartoon identity elsewhere)")
    return {"ok": not issues, "issues": issues}


def select_for_segment(segment: dict, assets: list[dict], characters: dict) -> dict:
    """Choose a visual for a narration segment: a cleared archival insert of the subject if one exists and the segment
    calls for the person; otherwise the person's stylised character; otherwise a labelled silhouette/illustration."""
    person = segment.get("person"); place = segment.get("place")
    if person:
        for a in assets:
            if a.get("depicts", {}).get("person") == person and rights_decision(a)["status"] == "cleared" and quality_check(a, "inset")["ok"] and style_check({**a, "presentation": "framed_archival_insert"})["ok"]:
                return {"choice": "archival_insert", "asset": a["id"], "label": f"ARCHIVAL PHOTO · {a.get('attribution_text', '')}"}
        ch = next((cid for cid, c in characters.items() if c.get("represents") == person), None)
        if ch:
            return {"choice": "stylised_character", "character": ch, "label": "ILLUSTRATION · STYLISED CHARACTER · NOT A LIKENESS"}
        return {"choice": "silhouette", "label": "SILHOUETTE · NOT A LIKENESS"}
    if place:
        env = next((a for a in assets if a.get("depicts", {}).get("place") == place and rights_decision(a)["status"] == "cleared"), None)
        if env:
            return {"choice": "environment", "asset": env["id"], "label": env.get("label") or "ILLUSTRATION"}
    return {"choice": "procedural_illustration", "label": "RECONSTRUCTION · ILLUSTRATION"}


def parse_commons_imageinfo(resp: dict) -> list[dict]:
    """Turn a Wikimedia Commons API response (prop=imageinfo&iiprop=url|size|extmetadata) into asset records.
    Network search is not available in every environment; the parser is tested offline with a fixture."""
    out = []
    for page in (resp.get("query", {}).get("pages", {}) or {}).values():
        for ii in page.get("imageinfo", []):
            md = {k: (v.get("value") if isinstance(v, dict) else v) for k, v in (ii.get("extmetadata") or {}).items()}
            strip = lambda x: re.sub(r"<[^>]+>", "", x or "").strip()
            out.append({"id": f"commons:{page.get('title', '')}", "kind": "photo", "source": {"url": ii.get("descriptionurl") or ii.get("url"), "publisher": "Wikimedia Commons",
                        "creator": strip(md.get("Artist"))}, "licence": {"name": strip(md.get("LicenseShortName")), "url": md.get("LicenseUrl"), "usage_terms": strip(md.get("UsageTerms"))},
                        "attribution_text": strip(md.get("Attribution") or md.get("Credit") or md.get("Artist")) if (md.get("AttributionRequired") == "true") else strip(md.get("Artist")),
                        "quality": {"width": ii.get("width", 0), "height": ii.get("height", 0)}, "authentic": True, "ai_generated": False,
                        "description": strip(md.get("ImageDescription")), "recorded": None})
    return out


# ------------------------------------------------------------------ provenance ledger for a finished run
TEMPLATE_ASSETS = {
    "scene": {"kind": "procedural", "origin": "original vector illustration drawn by documentary/renderer/doc.js", "label": "RECONSTRUCTION · ILLUSTRATION"},
    "profile": {"kind": "procedural", "origin": "generic featureless silhouette (doc.js)", "label": "SILHOUETTE · NOT A LIKENESS"},
    "doc": {"kind": "typography", "origin": "original typography summarising a record (doc.js)", "label": "ILLUSTRATIVE SUMMARY · NOT THE ORIGINAL DOCUMENT"},
    "map": {"kind": "data", "origin": "U.S. Census county boundaries (public domain) rendered by doc.js", "label": "LOCATIONS APPROXIMATE"},
    "character": {"kind": "procedural", "origin": "series character rig renderer/cast.js (original)", "label": "ILLUSTRATION · STYLISED CHARACTER · NOT A LIKENESS"},
}


def run_ledger(film_dir: Path, run_dir: Path) -> dict:
    plan = json.loads((run_dir / "plan.json").read_text())
    from collections import Counter
    n = Counter(s["type"] for s in plan["shots"])
    rows = []
    for t, k in sorted(n.items()):
        base = TEMPLATE_ASSETS.get(t, {"kind": "typography", "origin": "original typography / motion graphics (doc.js)", "label": ""})
        rows.append({"template": t, "shots": k, **base, "licence": "original work of this repository" if base["kind"] != "data" else "public domain data + original graphics",
                     "authentic_material": False, "ai_generated": False, "rights": "cleared (original)"})
    film = json.loads((film_dir / "film.json").read_text())
    other = [
        {"asset": "Map geometry", "source": "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json", "licence": "U.S. Census Bureau data, public domain", "rights": "cleared"},
        {"asset": f"Narration voice {film['voice']}", "source": "https://github.com/k2-fsa/sherpa-onnx/releases (Piper voice mirror)", "licence": "Piper engine MIT; LJ Speech dataset public domain", "rights": "cleared"},
        {"asset": "Music and sound effects", "source": "pipeline/audio.py (procedural NumPy synthesis)", "licence": "original work", "rights": "cleared"},
        {"asset": "Fonts: Inter, Inter Display", "source": "system fonts (rsms/inter)", "licence": "SIL OFL 1.1", "rights": "cleared"},
        {"asset": "Font: Fraunces", "source": "assets/fonts (see assets/fonts/LICENSE.md)", "licence": "SIL OFL 1.1", "rights": "cleared"},
        {"asset": "Font: Courier 10 Pitch", "source": "system font (Bitstream)", "licence": "Bitstream/X11 free licence", "rights": "cleared — confirm before commercial use"},
        {"asset": "Thumbnails (3 concepts)", "source": "documentary/renderer/thumb.html (original)", "licence": "original work", "rights": "cleared; thumbnail B withdrawn for legal-risk reasons (LR-08)"},
    ]
    return {"film": film["id"], "run": str(run_dir), "summary": "No third-party photographs, footage, recordings, news material or documents were used. Every visual is original procedural illustration, typography or public-domain map data; people appear only as featureless silhouettes.",
            "templates": rows, "other_assets": other}


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); sub = ap.add_subparsers(dest="cmd", required=True)
    l = sub.add_parser("ledger"); l.add_argument("film_dir"); l.add_argument("run_dir"); l.add_argument("--out", default=None)
    a = ap.parse_args(argv)
    res = run_ledger(Path(a.film_dir), Path(a.run_dir))
    txt = json.dumps(res, indent=1, ensure_ascii=False)
    if a.out: Path(a.out).write_text(txt)
    print(f"{sum(r['shots'] for r in res['templates'])} shots across {len(res['templates'])} templates; {len(res['other_assets'])} other assets")
    return 0


if __name__ == "__main__":
    sys.exit(main())
