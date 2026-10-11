"""Human-readable review reports generated from the evidence files and the gate report.

usage: python -m documentary.reports <film_dir> <run_dir> [--as-of YYYY-MM-DD]
writes <run_dir>/audit/{evidence-ledger.md, bibliography.md, human-review-items.md, release-decision.md, gate-report.json}
"""
from __future__ import annotations
import argparse, datetime as dt, json
from pathlib import Path

from documentary.gate import load_bundle, run_gate, to_markdown


def esc(x) -> str:
    return str(x).replace("|", "/").replace("\n", " ")


def write_reports(film_dir: Path, run_dir: Path, as_of: dt.date) -> dict:
    b = load_bundle(film_dir, run_dir); rep = run_gate(b, as_of)
    out = run_dir / "audit"; out.mkdir(exist_ok=True)
    src = {s["id"]: s for s in b["sources"]}; lines = b["film"]["lines"]; eff = rep["effective_status"]
    # ---- evidence ledger
    L = [f"# Evidence ledger: {b['film']['title']}", "", f"Generated {as_of} from `evidence/claims.json`. Effective status = the lower of the declared status and what the evidence can support.",
         "**No source could be read in full in this environment** (network policy), so no claim is VERIFIED. Every passage below is a search excerpt or a summary of one.", "",
         "| ID | Narration (line) | Proposition | Status | Risk | Sources (support) | Qualifications / conflicts |", "|---|---|---|---|---|---|---|"]
    for c in b["claims"]:
        narr = "; ".join(f"L{i:02d} \"{lines[i].get('say', '')[:70]}\"" for i in c.get("lines", []) if i < len(lines)) or "(not narrated)"
        srcs = "; ".join(f"{src[e['source']]['publisher']} ({e['supports']})" for e in c.get("evidence", []) if e["source"] in src) or ("derived from " + ", ".join(c.get("derived_from", [])))
        q = " ".join(c.get("qualifications", []) + c.get("contradictions", []))
        L.append(f"| {c['id']} | {esc(narr)} | {esc(c['proposition'])} | {eff.get(c['id'], c['status'])} | {c['risk']} | {esc(srcs)} | {esc(q)} |")
    L += ["", "## Supporting passages", ""]
    for c in b["claims"]:
        L.append(f"### {c['id']}: {esc(c['proposition'])}")
        for e in c.get("evidence", []):
            s = src.get(e["source"], {})
            L.append(f"- **{e['supports']}**: {s.get('publisher', e['source'])}, *{s.get('title', '')}* ({s.get('published') or 'n.d.'}) <{s.get('url', '')}>. Access: {s.get('access', {}).get('level')}. Passage ({e.get('passage_type')}): \"{e.get('passage', '')}\"")
        if c.get("derived_from"): L.append(f"- derived from {', '.join(c['derived_from'])}")
        L.append("")
    (out / "evidence-ledger.md").write_text("\n".join(L))
    # ---- bibliography
    B = [f"# Source bibliography: {b['film']['title']}", "", f"Access date for every entry: {as_of} unless stated. Access level is recorded honestly: `search_excerpt` means only search-result text was seen; the page itself was not opened.", "",
         "| ID | Publisher | Title | Published | Type | Independence group | Access | URL |", "|---|---|---|---|---|---|---|---|"]
    for s in b["sources"]:
        B.append(f"| {s['id']} | {esc(s['publisher'])} | {esc(s['title'])} | {s.get('published') or 'n.d.'} | {s['source_type']} | {s['independence_group']} | {s['access']['level']} ({s['access']['accessed']}) | {s['url']} |")
    (out / "bibliography.md").write_text("\n".join(B) + "\n")
    # ---- outstanding human review
    H = [f"# Outstanding human-review items: {b['film']['title']}", "", f"Release decision: **{rep['decision']}** (gate run {as_of}).", "",
         "## 1. Read these sources in full and confirm the passages (needed to raise high-risk claims to VERIFIED)", ""]
    need = [c for c in b["claims"] if c.get("lines") and c["risk"] in ("high", "medium")]
    for c in sorted(need, key=lambda c: (c["risk"] != "high", c["id"])):
        H.append(f"- [ ] **{c['id']}** ({c['risk']}, now {eff.get(c['id'])}): {esc(c['proposition'])}. Check: " + ", ".join(sorted({src[e['source']]['url'] for e in c['evidence'] if e['source'] in src and e['supports'] != 'contradicts'})))
    H += ["", "## 2. Open review findings (factual, legal-risk, post-production)", ""]
    for f in sorted([f for f in b["findings"] if f.get("state", "open") == "open"], key=lambda f: ["CRITICAL", "HIGH", "MEDIUM", "LOW"].index(f["severity"])):
        H.append(f"- [ ] **{f['id']}** [{f['severity']}, stage {f['stage']}{', needs a new render (your approval)' if f.get('needs_new_render') else ''}]: {f['problem']} → *{f['recommendation']}*")
    H += ["", "## 3. Sign-offs required before anything is labelled cleared", "", "- [ ] Human fact-check sign-off (record in `evidence/approvals.json` → `signoffs`)",
          "- [ ] Qualified legal review (ongoing prosecution; defamation/contempt considerations). This screen is not legal advice.",
          "- [ ] Re-check case status on the publication day (C13, C50, C53, C55, C61 are time-sensitive).", "- [ ] Watch the full film end to end at normal volume."]
    (out / "human-review-items.md").write_text("\n".join(H) + "\n")
    (out / "gate-report.json").write_text(json.dumps(rep, indent=1, ensure_ascii=False))
    (out / "release-decision.md").write_text(to_markdown(rep, b["film"]["title"]))
    return rep


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("film_dir"); ap.add_argument("run_dir"); ap.add_argument("--as-of", default=None)
    a = ap.parse_args(argv)
    rep = write_reports(Path(a.film_dir), Path(a.run_dir), dt.date.fromisoformat(a.as_of) if a.as_of else dt.date.today())
    print(rep["decision"], {k: v for k, v in rep["counts"].items() if v})
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
