"""Research dossier + persistent knowledge vault.

Research itself is done by pluggable providers (this run: a web-search research agent whose raw, per-claim findings are
checkpointed in vault/<universe>/research_raw.json). This module turns raw findings + a small curation file into the
ResearchDossier contract, stamps it with a content hash and retrieval date, and caches it in the vault so later videos
in the same universe reuse it at zero research cost. It never invents a citation: a claim that no retrieved source
supports is kept, but marked `verification: "unverified_model_memory"` with an empty source list so QA can surface it.
"""
from __future__ import annotations
import hashlib, json, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VAULT = ROOT / "copycat" / "vault"
TTL_DAYS = 120
CONF = {"confirmed": 0.9, "partly": 0.65, "unverified": 0.35, "wrong": 0.0}
RELIABILITY = {"primary": 0.95, "official_wiki": 0.8, "news": 0.6, "other": 0.5}


def build(project: dict) -> dict:
    vdir = VAULT / project["universe"]
    raw = json.loads((vdir / "research_raw.json").read_text()); cur = json.loads((vdir / "curation.json").read_text())
    used_sources, claims = set(), []
    byn = {c["n"]: c for c in raw["claims"]}
    for cid, spec in cur["claims"].items():
        if "n" in spec:
            rc = byn[spec["n"]]; sids = [s for s in rc.get("sourceIds", [])]
            used_sources.update(sids)
            claims.append({"claimId": cid, "statement": rc["statement"], "category": "canon_lore", "confidence": CONF.get(rc["verdict"], 0.3), "supportingSourceIds": sids,
                           "temporalAnchor": rc.get("anchor", ""), "researchVerdict": rc["verdict"], "verification": "source_backed" if sids and rc["verdict"] in ("confirmed", "partly") else "unverified_model_memory",
                           "canonTag": "CANON_ESTABLISHED", "notes": rc.get("notes", ""), "scriptUse": spec.get("use", "")})
        else:
            claims.append({"claimId": cid, "statement": spec["statement"], "category": "canon_lore", "confidence": 0.5, "supportingSourceIds": [], "temporalAnchor": spec.get("anchor", ""),
                           "verification": "unverified_model_memory", "canonTag": spec.get("canonTag", "CANON_ESTABLISHED"), "notes": spec.get("notes", "Not confirmed by any source retrieved in this run; stated from the writing model's knowledge of the manga. Verify against the official release before treating as fact."), "scriptUse": spec.get("use", "")})
    sources = [{"sourceId": s["sourceId"], "urlOrPath": s["url"], "title": s.get("title", ""), "authorOrPublisher": s.get("publisher", ""), "retrievedAt": raw["retrievedAt"],
                "sourceType": s.get("sourceType", "other") if s.get("sourceType") in ("primary", "official_wiki", "news", "academic") else "news", "reliabilityScore": RELIABILITY.get(s.get("sourceType"), 0.5), "accessLayer": s.get("how", "search_snippet")}
               for s in raw["sources"] if s["sourceId"] in used_sources]
    d = {"dossierId": f"{project['universe']}-{time.strftime('%Y%m%d')}", "projectId": project["id"], "topic": project["title"], "domain": project["domain"], "depthTier": project.get("depthTier", "standard_youtube"),
         "executiveSummary": cur["executiveSummary"], "sources": sources, "claims": claims, "entities": cur.get("entities", []), "chronologicalTimeline": cur.get("timeline", []),
         "contradictionsAndNuances": cur.get("contradictions", []), "unansweredQuestions": cur.get("unanswered", []),
         "providerLog": raw.get("provider_log", []), "referenceVideo": raw.get("reference_video"), "retrievedAt": raw["retrievedAt"]}
    d["contentHash"] = hashlib.sha256(json.dumps(d, sort_keys=True).encode()).hexdigest()[:16]
    return d


def load_or_build(project: dict) -> dict:
    vdir = VAULT / project["universe"]; f = vdir / "dossier.json"
    src_m = max((vdir / n).stat().st_mtime for n in ("research_raw.json", "curation.json"))
    if f.exists() and f.stat().st_mtime >= src_m and (time.time() - f.stat().st_mtime) < TTL_DAYS * 86400:
        d = json.loads(f.read_text()); d["_vault"] = "hit"; return d
    d = build(project); f.write_text(json.dumps(d, indent=1, ensure_ascii=False)); d["_vault"] = "built"; return d
