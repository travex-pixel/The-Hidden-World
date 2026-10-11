"""Claim-aware editing manifest and change-impact analysis.

manifest: joins a finished run's timing (edit-manifest.json, captions.srt) with the script's claim references, the
ledger (status, risk, sources) and visual provenance, so every scene, narration segment, on-screen statement and
caption cue carries its claim IDs, evidence and legal-risk flags.
impact: for a claim ID, lists every narration line, shot, caption cue, timeline event, thumbnail, description
passage and Short that depends on it, so a changed claim is re-checked everywhere it appears.

usage: python -m documentary.claims manifest <film_dir> <run_dir> [--out file]
       python -m documentary.claims impact <film_dir> <run_dir> <claim_id> [<claim_id> ...]
"""
from __future__ import annotations
import argparse, json, re, sys
from pathlib import Path

from documentary.gate import load_bundle, run_gate, shot_strings
import datetime as dt

# Where each template's pixels come from. All of the Betsy Faria film is generated in this repository.
ORIGIN = {
    "scene": ("illustrative reconstruction", "original procedural vector illustration (documentary/renderer/doc.js)", "RECONSTRUCTION · ILLUSTRATION label on screen"),
    "map": ("data visualisation", "U.S. Census county boundaries (public domain) + original graphics", "locations approximate"),
    "profile": ("illustrative character", "generic featureless silhouette (original); not a likeness", "SILHOUETTE · NOT A LIKENESS label on screen"),
    "doc": ("illustrative document", "original typography summarising a record; not the original document", "ILLUSTRATIVE SUMMARY label on screen"),
    "verdict": ("evidence graphic", "original typography over an illustrated courtroom", ""),
    "board": ("relationship diagram", "original graphics", ""),
    "timeline": ("data visualisation", "original graphics from ledger events", ""),
    "clock": ("evidence graphic", "original graphics", ""),
}
DEFAULT_ORIGIN = ("typography / motion graphics", "original", "")


def parse_srt(text: str) -> list[dict]:
    def ts(x):
        h, m, r = x.split(":"); s, ms = r.split(","); return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000
    out = []
    for i, blk in enumerate(text.strip().split("\n\n")):
        L = blk.split("\n")
        a, b = L[1].split(" --> ")
        out.append({"cue": i + 1, "start": ts(a), "end": ts(b), "text": " ".join(L[2:])})
    return out


def build_manifest(film_dir: Path, run_dir: Path, as_of: dt.date | None = None) -> dict:
    b = load_bundle(film_dir, run_dir)
    film, man = b["film"], b["run"]["manifest"]
    claims = {c["id"]: c for c in b["claims"]}; src = {s["id"]: s for s in b["sources"]}
    gate = run_gate(b, as_of or dt.date.today())
    eff = gate["effective_status"]
    cues = parse_srt(b["run"]["captions"]) if b["run"].get("captions") else []
    flat = [s for ln in film["lines"] for s in ln["shots"]]
    open_find = [f for f in b["findings"] if f.get("state", "open") == "open"]
    def claim_view(ids):
        return [{"id": i, "status": eff.get(i, claims[i]["status"]), "risk": claims[i]["risk"], "assertion": claims[i]["assertion"],
                 "sources": sorted({f"{src[e['source']]['publisher']} [{e['source']}]" for e in claims[i]["evidence"] if e["source"] in src})} for i in sorted(ids) if i in claims]
    scenes = []
    for tl in man["lines"]:
        i = tl["i"]; ln = film["lines"][i]
        ids = set(ln.get("claims", []))
        seg = {"scene": f"S{i:02d}", "chapter": tl.get("chapter"), "start": tl["start"], "end": tl["end"], "narration": ln.get("say"),
               "claims": claim_view(ids), "caption_cues": [c for c in cues if c["start"] < tl["end"] and c["end"] > tl["start"]] if ln.get("say") else [],
               "risk_flags": [{"id": f["id"], "severity": f["severity"], "stage": f["stage"], "problem": f["problem"][:200]} for f in open_find if i in (f.get("lines") or [])],
               "shots": []}
        for s in [x for x in man["shots"] if x["line"] == i]:
            spec = flat[s["i"]]; kind, origin, label = ORIGIN.get(spec["type"], DEFAULT_ORIGIN)
            sids = ids | set(spec.get("claims", []))
            seg["shots"].append({"shot": s["i"], "start": s["start"], "end": s["end"], "template": spec["type"], "variant": spec.get("variant"),
                                 "on_screen_text": [t for t in shot_strings(spec) if t.strip()], "source_tag": spec.get("source"),
                                 "asset": {"kind": kind, "origin": origin, "authentic_material": False, "licence": "original work of this repository" if kind != "data visualisation" else "U.S. Census data: public domain; graphics original",
                                           "on_screen_disclosure": label or spec.get("label") or ""},
                                 "claims": [c["id"] for c in claim_view(sids)]})
        scenes.append(seg)
    return {"film": film["id"], "title": film["title"], "run": str(run_dir), "as_of": gate["as_of"], "release_decision": gate["decision"],
            "notes": "No photographs, footage, recordings or documents of the real case appear in this film. Every visual is original illustration, typography or public-domain map data.",
            "timeline_events": [{**e, "claims": claim_view(e.get("claims", []))} for e in film.get("timeline", [])],
            "packaging": {"title": b["packaging"].get("title"), "thumbnails": b["packaging"].get("thumbnails"), "shorts": b["packaging"].get("shorts")},
            "scenes": scenes}


def impact(film_dir: Path, run_dir: Path, ids: list[str]) -> dict:
    b = load_bundle(film_dir, run_dir)
    film, man = b["film"], b["run"]["manifest"]; claims = {c["id"]: c for c in b["claims"]}
    cues = parse_srt(b["run"]["captions"]) if b["run"].get("captions") else []
    flat = [s for ln in film["lines"] for s in ln["shots"]]
    out = {}
    for cid in ids:
        c = claims.get(cid)
        if not c:
            out[cid] = {"error": "unknown claim"}; continue
        lines = sorted({i for i, ln in enumerate(film["lines"]) if cid in ln.get("claims", [])} | set(c.get("lines", [])))
        spans = [(t["start"], t["end"]) for t in man["lines"] if t["i"] in lines]
        shots = [s["i"] for s in man["shots"] if s["line"] in lines or cid in flat[s["i"]].get("claims", [])]
        facts = [f for f in c.get("facts", []) if len(f) >= 3]
        desc = b["packaging"].get("description_text", "")
        out[cid] = {"proposition": c["proposition"],
                    "narration_lines": lines,
                    "shots": shots,
                    "caption_cues": [q["cue"] for q in cues if any(q["start"] < e and q["end"] > s for s, e in spans)],
                    "timeline_events": [j for j, e in enumerate(film.get("timeline", [])) if cid in e.get("claims", [])],
                    "derived_claims": [d["id"] for d in claims.values() if cid in d.get("derived_from", [])],
                    "thumbnails": [t["concept"] for t in b["packaging"].get("thumbnails", []) if cid in t.get("claims", [])],
                    "description_mentions": sorted({f for f in facts if f.lower() in desc.lower()}),
                    "shorts": [sh["slug"] for sh in b["packaging"].get("shorts", []) if any(sh["in"] < e and sh["out"] > s for s, e in spans)],
                    "action": "Re-verify the claim, then re-check every item above; narration or on-screen changes need a new render (new version, with approval)."}
    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); sub = ap.add_subparsers(dest="cmd", required=True)
    m = sub.add_parser("manifest"); m.add_argument("film_dir"); m.add_argument("run_dir"); m.add_argument("--out", default=None); m.add_argument("--as-of", default=None)
    i = sub.add_parser("impact"); i.add_argument("film_dir"); i.add_argument("run_dir"); i.add_argument("ids", nargs="+")
    a = ap.parse_args(argv)
    if a.cmd == "manifest":
        res = build_manifest(Path(a.film_dir), Path(a.run_dir), dt.date.fromisoformat(a.as_of) if a.as_of else None)
        txt = json.dumps(res, indent=1, ensure_ascii=False)
        if a.out: Path(a.out).write_text(txt)
        print(f"{len(res['scenes'])} scenes, {sum(len(s['shots']) for s in res['scenes'])} shots, decision: {res['release_decision']}")
    else:
        print(json.dumps(impact(Path(a.film_dir), Path(a.run_dir), a.ids), indent=1, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
