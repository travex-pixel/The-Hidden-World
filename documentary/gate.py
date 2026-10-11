"""Evidence-backed release gate for long-form documentaries (stages C/D/F/G of the pipeline).

Deterministic checks over: the script (film.json), the claim ledger (evidence/claims.json), the bibliography
(evidence/sources.json), legal status per person (evidence/people.json), packaging (evidence/packaging.json),
review records (evidence/approvals.json, evidence/review-findings.json) and, when given, a finished run folder.

It is a risk screen, not legal advice and not a guarantee: rules catch known failure patterns (pending charge
called a conviction, inaccessible source marked verified, allegation stated as fact, unsupported on-screen
numbers, Shorts without legal-status context...). Semantic issues still need human and independent review;
those findings are recorded in review-findings.json and count toward the decision.

usage: python -m documentary.gate <film_dir> [--run <run_dir>] [--as-of YYYY-MM-DD] [--out report.json] [--md report.md]
exit code: 0 = no open CRITICAL/HIGH findings (still requires human sign-off to be CLEARED), 1 = blocked.
"""
from __future__ import annotations
import argparse, datetime as dt, hashlib, json, re, sys
from pathlib import Path

STATUS_ORDER = ["UNVERIFIED", "REQUIRES REVIEW", "OUTDATED", "DISPUTED", "CORROBORATED", "DIRECTLY SUPPORTED", "VERIFIED"]
RANK = {s: i for i, s in enumerate(STATUS_ORDER)}
REQUIRED = {"high": "DIRECTLY SUPPORTED", "medium": "CORROBORATED", "low": "REQUIRES REVIEW"}   # minimum status to clear, per risk tier
FULL = "full_text"
PRIMARY = {"court_record", "official_statement", "government_record", "public_domain_data"}
ATTRIBUTION = re.compile(r"\b(prosecutors?|prosecution|alleg\w*|said|says|according to|argu\w+|contend\w*|told|claim\w*|report\w*|testif\w+|den(y|ied|ies)|point\w*|accus\w*|as reported|what [A-Z]?\w+ said|theory|suggest\w*)\b", re.I)
GUILT = re.compile(r"\b(convicted|guilty|killer|murderer|murdered|killed|killing|stabbed|did it|responsible for|framed)\b", re.I)
QUALIFIER = re.compile(r"\b(not convicted|not guilty|pleaded not guilty|presumed innocent|charged|accused|alleg\w*|acquitted|overturned|vacated|new trial|retrial|denie[sd]|suspect\w*|charges?)\b", re.I)
PRESENT_GUILT = re.compile(r"\b(is (a |the )?(killer|murderer|guilty)|remains convicted|convicted murderer)\b", re.I)
CHARACTERIZATION = re.compile(r"\b(wrong man|innocent man|exonerat\w+|framed|evil|monster|psycho\w*|cold[- ]blooded)\b", re.I)
MOTIVE_CUE = re.compile(r"(\$|insurance|beneficiar|days before|policy|money|friend|\?)", re.I)
NUM = re.compile(r"\$?\d[\d,]*(?:\.\d+)?(?::\d\d)?(?:\s?(?:PM|AM|p\.m\.|a\.m\.))?|~\d+(?:\.\d+)?")
SEV = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]


def sha(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()[:16]


def load_bundle(film_dir: Path, run_dir: Path | None = None) -> dict:
    ev = film_dir / "evidence"
    rd = lambda p, d=None: json.loads(p.read_text()) if p.exists() else d
    b = {"film": rd(film_dir / "film.json"), "claims": rd(ev / "claims.json", {"claims": []})["claims"],
         "sources": rd(ev / "sources.json", {"sources": []})["sources"], "people": rd(ev / "people.json", {"people": [], "matters": {}}),
         "packaging": rd(ev / "packaging.json", {}), "approvals": rd(ev / "approvals.json", {"claims": {}, "signoffs": []}),
         "findings": rd(ev / "review-findings.json", {"findings": []})["findings"], "run": None}
    if run_dir:
        b["run"] = {"dir": str(run_dir), "captions": (run_dir / "captions.srt").read_text() if (run_dir / "captions.srt").exists() else None,
                    "manifest": rd(run_dir / "edit-manifest.json"), "plan": rd(run_dir / "plan.json"), "verify": rd(run_dir / "verify.json"),
                    "qa": rd(run_dir / "qa-checks.json"), "asr": rd(run_dir / "audit" / "asr-audit.json")}
        desc = b["packaging"].get("description_file")
        if desc and Path(desc).exists():
            b["packaging"]["description_text"] = Path(desc).read_text()
    return b


# ------------------------------------------------------------------ helpers
def line_text(ln: dict) -> str:
    return ln.get("say", "") or ""


def shot_strings(s: dict) -> list[str]:
    """Every piece of on-screen text a shot can show (not the corner label / source tag)."""
    out = []
    for k, v in s.items():
        if k in ("type", "variant", "label", "source", "in", "out", "color", "tagColor", "kind", "rim", "emColor", "tint", "colors", "bigColor", "claims", "chapterTag", "w", "box",
                 "together", "hl", "time", "fromMins", "from", "view", "focus", "zoom", "z0", "z1", "fx", "fy", "dx", "at", "size", "bigSize", "rot", "tally", "dim", "lit", "porch"):
            continue
        if isinstance(v, str):
            out.append(v)
        elif isinstance(v, list):
            for x in v:
                if isinstance(x, str) and not x.startswith("#"): out.append(x)
                elif isinstance(x, list): out += [y for y in x if isinstance(y, str) and not y.startswith("#") and len(y) > 1]
                elif isinstance(x, dict): out += [y for kk, y in x.items() if kk in ("label", "sub", "date", "kicker", "text") and isinstance(y, str)]
    return out


def sentences(text: str) -> list[str]:
    text = re.sub(r"https?://\S+", " ", text).replace("National Registry of Exonerations", "the registry")
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+|\n+", text) if s.strip()]


def numbers(text: str) -> set[str]:
    return {n.replace(",", "").replace("~", "").strip().lower() for n in NUM.findall(text)}


def computed_status(claim: dict, src: dict, as_of: dt.date) -> tuple[str, list[str]]:
    """Strongest status the evidence can justify. Never VERIFIED/DIRECTLY SUPPORTED without full-text access."""
    why = []
    if claim.get("assertion") == "derived":
        return "CORROBORATED", ["derived from other claims (see derived_from)"]
    ev = claim.get("evidence", [])
    if claim.get("time_sensitive"):
        checked = dt.date.fromisoformat(claim.get("checked", "1970-01-01"))
        if (as_of - checked).days > 14:
            return "OUTDATED", [f"time-sensitive claim last checked {checked}, more than 14 days before {as_of}"]
    if any(e.get("supports") == "contradicts" for e in ev) and claim.get("assertion") == "fact":
        return "DISPUTED", ["a cited source contradicts this factual claim"]
    supp = [e for e in ev if e.get("supports") in ("direct", "reports_allegation")]
    if not supp:
        return "UNVERIFIED", ["no source directly supports the proposition (only partial/mention links)"] if ev else ["no evidence recorded"]
    full = [e for e in supp if src.get(e["source"], {}).get("access", {}).get("level") == FULL and e.get("passage")]
    groups_full = {src[e["source"]]["independence_group"] for e in full if e["source"] in src}
    groups = {src[e["source"]]["independence_group"] for e in supp if e["source"] in src}
    if full and (any(src[e["source"]]["source_type"] in PRIMARY for e in full) or len(groups_full) >= 2):
        return "VERIFIED", why
    if full:
        return "DIRECTLY SUPPORTED", why
    if len(groups) >= 2:
        return "CORROBORATED", ["supported by >=2 independent outlets, but only at search-excerpt level (pages not read in full)"]
    return "REQUIRES REVIEW", ["single excerpt-level source"]


class Report:
    def __init__(self): self.items = []
    def add(self, sev, rule, msg, fix, **loc):
        self.items.append({"severity": sev, "rule": rule, "message": msg, "fix": fix, **loc})


# ------------------------------------------------------------------ the gate
def run_gate(b: dict, as_of: dt.date) -> dict:
    R = Report()
    film, claims, people = b["film"], {c["id"]: c for c in b["claims"]}, b["people"]
    src = {s["id"]: s for s in b["sources"]}
    lines = film["lines"]

    # G1 ledger integrity / fabricated citations
    for c in claims.values():
        for e in c.get("evidence", []):
            if e["source"] not in src:
                R.add("CRITICAL", "G1-unknown-source", f"{c['id']} cites source '{e['source']}' that is not in the bibliography (possible fabricated citation).",
                      "Add the real source with URL and access record, or remove the citation.", claim=c["id"])
            elif not src[e["source"]].get("url"):
                R.add("HIGH", "G1-no-url", f"Source {e['source']} has no URL.", "Record the URL (or the court/case identifier).", claim=c["id"])
        for d in c.get("derived_from", []):
            if d not in claims:
                R.add("HIGH", "G1-bad-derivation", f"{c['id']} derives from unknown claim {d}.", "Fix derived_from.", claim=c["id"])
    for s in src.values():
        lvl = s.get("access", {}).get("level")
        if lvl not in ("full_text", "search_excerpt", "not_accessed"):
            R.add("HIGH", "G1-access", f"Source {s['id']} has no valid access record ({lvl}).", "Record how (and whether) the source was read.", source=s["id"])

    # G2 status ceiling + G13 status vs risk tier
    eff = {}
    for c in claims.values():
        st, why = computed_status(c, src, as_of)
        declared = c.get("status", "UNVERIFIED")
        if declared in ("VERIFIED", "DIRECTLY SUPPORTED") and RANK[declared] > RANK[st]:
            R.add("CRITICAL", "G2-overstated-status", f"{c['id']} is marked {declared} but the evidence only supports {st} ({'; '.join(why)}).",
                  "Read the source in full and record the passage, or lower the status.", claim=c["id"])
        elif declared in RANK and RANK[declared] > RANK[st]:
            R.add("MEDIUM", "G2-declared-above-evidence", f"{c['id']} is declared {declared} but the evidence supports {st} ({'; '.join(why)}).",
                  "Lower the declared status or add independent support.", claim=c["id"])
        if declared not in RANK:
            R.add("HIGH", "G2-unknown-status", f"{c['id']} has unknown status '{declared}'.", "Use the status vocabulary.", claim=c["id"])
        e = min([x for x in (declared, st) if x in RANK], key=lambda x: RANK[x])
        # change invalidation (G10)
        appr = b["approvals"].get("claims", {}).get(c["id"])
        cur = claim_fingerprint(c, lines)
        if appr is None:
            R.add("MEDIUM", "G10-not-reviewed", f"{c['id']} has no review record.", "Review the claim and record its fingerprint in approvals.json.", claim=c["id"])
        elif appr.get("fingerprint") != cur:
            e = "REQUIRES REVIEW"
            R.add("HIGH", "G10-changed-since-review", f"{c['id']}: the script text or claim changed after review ({appr.get('fingerprint')} -> {cur}); verification invalidated.",
                  "Re-check the claim against its sources and re-approve.", claim=c["id"], lines=c.get("lines"))
        eff[c["id"]] = e
        need = REQUIRED.get(c.get("risk", "medium"), "CORROBORATED")
        if c.get("lines") or c.get("assertion") == "characterization":
            if RANK.get(e, 0) < RANK[need]:
                sev = "HIGH" if c.get("risk") in ("high", "medium") else "MEDIUM"
                R.add(sev, "G13-insufficient-status", f"{c['id']} ({c.get('risk')} risk) is {e}; clearing requires at least {need}.",
                      "Strengthen the evidence (read primary/full-text sources) or qualify/remove the claim.", claim=c["id"], lines=c.get("lines"))
        if c.get("contradictions"):
            R.add("MEDIUM" if c.get("assertion") != "fact" else "MEDIUM", "G4-conflict", f"{c['id']}: conflicting accounts recorded: " + " | ".join(c["contradictions"]),
                  "Make sure the script states the uncertainty or uses only the uncontested part.", claim=c["id"], lines=c.get("lines"))
        # G3 passage must contain the claim's figures
        if c.get("assertion") not in ("derived", "characterization", "context", "negative"):
            prop_nums = {n for n in numbers(c["proposition"]) if len(n) >= 2}
            pas = " ".join(e.get("passage", "") + " " + str(src.get(e["source"], {}).get("published") or "") for e in c.get("evidence", []) if e.get("supports") in ("direct", "reports_allegation"))
            missing = sorted(n for n in prop_nums if n not in numbers(pas) and n not in pas.lower())
            if missing:
                R.add("MEDIUM", "G3-passage-mismatch", f"{c['id']}: figures {missing} in the proposition do not appear in any supporting passage.",
                      "Quote the passage that states these figures, or mark the link 'partial' and review.", claim=c["id"])

    # G5 coverage: every narration line maps to claims (both directions)
    by_line = {}
    for c in claims.values():
        for i in c.get("lines", []):
            by_line.setdefault(i, set()).add(c["id"])
    for i, ln in enumerate(lines):
        if not ln.get("say"):
            continue
        refs = set(ln.get("claims", []))
        if not refs and not ln.get("nonfactual"):
            R.add("CRITICAL", "G5-no-evidence", f"Narration line L{i:02d} has no claim record: \"{ln['say'][:80]}\"",
                  "Add claim IDs (with evidence) or mark the line nonfactual if it asserts nothing.", line=i)
        for r in refs:
            if r not in claims:
                R.add("CRITICAL", "G5-unknown-claim", f"L{i:02d} references unknown claim {r}.", "Fix the reference.", line=i)
        if refs and by_line.get(i, set()) != refs:
            R.add("LOW", "G5-ref-mismatch", f"L{i:02d} refs {sorted(refs)} differ from ledger mapping {sorted(by_line.get(i, set()))}.", "Sync film.json claims with claims.json lines.", line=i)

    # G7 attribution: allegations and reported statements must be attributed in the line that carries them
    for c in claims.values():
        if c.get("assertion") in ("attributed_allegation", "attributed_statement"):
            for i in c.get("lines", []):
                if i < len(lines) and lines[i].get("say") and not ATTRIBUTION.search(lines[i]["say"]) and not lines[i].get("attribution_context"):
                    R.add("HIGH", "G7-unattributed", f"L{i:02d} carries {c['id']} ({c['assertion']}) without attribution: \"{lines[i]['say'][:90]}\"",
                          "Attribute it ('prosecutors said', 'according to ...') or mark attribution_context if the previous sentence attributes it.", line=i, claim=c["id"])

    # G6 on-screen facts must be backed by the claims of the shot/line
    for i, ln in enumerate(lines):
        line_claims = set(ln.get("claims", []))
        for k, s in enumerate(ln.get("shots", [])):
            cl = line_claims | set(s.get("claims", []))
            allowed = " ".join(" ".join(claims[c].get("facts", [])) + " " + claims[c]["proposition"] for c in cl if c in claims).lower()
            allowed_nums = numbers(allowed)
            for txt in shot_strings(s):
                for n in numbers(txt):
                    if len(n.strip("$")) < 2 and not n.startswith("$"):
                        continue
                    if n not in allowed_nums and n not in allowed:
                        R.add("HIGH", "G6-unsupported-onscreen", f"L{i:02d} shot {k} ({s['type']}) shows '{n}' in \"{txt[:60]}\" which no referenced claim supports.",
                              "Add the supporting claim to the shot (shot.claims) or remove the figure.", line=i, shot=k)
            if s.get("source"):
                cited = {claims[c]["evidence"][j]["source"] for c in cl if c in claims for j in range(len(claims[c].get("evidence", [])))}
                pubs = " ".join(src[x]["publisher"] for x in cited if x in src).lower()
                for tag in [t.strip() for t in re.split(r"·|,", s["source"]) if t.strip()]:
                    key = re.sub(r"\(.*?\)", "", tag).strip().lower()
                    alias = {"ap": "associated press", "kmov first alert 4": "kmov", "nbc news": "nbc news", "fox 2": "fox 2", "cbs news": "cbs"}.get(key, key)
                    if alias not in pubs:
                        R.add("MEDIUM", "G6-source-tag", f"L{i:02d} shot {k} credits '{tag}' but none of its claims cite that publisher.",
                              "Cite the publisher in the claim evidence or change the on-screen source tag.", line=i, shot=k)
            if s["type"] == "scene" and s.get("label", None) == "":
                R.add("HIGH", "G14-unlabelled-reconstruction", f"L{i:02d} shot {k}: reconstruction shown without its label.", "Restore the RECONSTRUCTION label.", line=i, shot=k)
            if s["type"] in ("photo", "footage", "asset"):
                if not s.get("asset_id"):
                    R.add("CRITICAL", "G14-unregistered-asset", f"L{i:02d} shot {k}: external asset without a provenance record.", "Register the asset with source, licence and rights status.", line=i, shot=k)
            if s.get("depicts"):
                d = s["depicts"]
                ok = any(claims[c].get("assertion") == "fact" and d.get("person") in claims[c].get("subjects", []) and RANK.get(eff.get(c, "UNVERIFIED"), 0) >= RANK["CORROBORATED"]
                         for c in cl if c in claims)
                if not ok:
                    R.add("CRITICAL", "G14-depicted-act-unproven", f"L{i:02d} shot {k} depicts {d.get('person')} doing '{d.get('act')}' without an established factual claim.",
                          "Remove the depiction or show only what is established.", line=i, shot=k)

    # G6b timeline events (drawn by every timeline shot) need their own claims
    for j, evt in enumerate(film.get("timeline", [])):
        cl = set(evt.get("claims", []))
        if not cl:
            R.add("HIGH", "G6-timeline-unsourced", f"Timeline event {j} '{evt.get('date')} {evt.get('label')}' has no claim.", "Add claims to the event.", where=f"timeline {j}")
            continue
        allowed = " ".join(" ".join(claims[c].get("facts", [])) + " " + claims[c]["proposition"] for c in cl if c in claims).lower()
        for n in numbers(evt.get("date", "") + " " + evt.get("label", "")):
            if len(n.strip("$")) >= 2 and n not in numbers(allowed) and n not in allowed:
                R.add("HIGH", "G6-unsupported-onscreen", f"Timeline event {j} shows '{n}' that its claims do not support.", "Fix the event or its claims.", where=f"timeline {j}")

    # G8 legal-status language across every text surface
    surfaces = [(f"L{i:02d}", line_text(ln)) for i, ln in enumerate(lines) if ln.get("say")]
    surfaces += [(f"L{i:02d} shot {k}", " ".join(shot_strings(s))) for i, ln in enumerate(lines) for k, s in enumerate(ln.get("shots", []))]
    surfaces += [(f"timeline {j}", f"{e.get('date', '')}. {e.get('label', '')}.") for j, e in enumerate(film.get("timeline", []))]
    pk = b.get("packaging", {})
    surfaces += [("title", pk.get("title", ""))] + [(f"alt title {j}", t) for j, t in enumerate(pk.get("alt_titles", []))]
    surfaces += [(f"thumbnail {t.get('concept')}", " ".join(t.get("text", []))) for t in pk.get("thumbnails", [])]
    surfaces += [(f"short {s['slug']} hook", s.get("hook", "")) for s in pk.get("shorts", [])]
    if pk.get("description_text"):
        surfaces += [("description", pk["description_text"])]
    status_of = {}
    for p in people.get("people", []):
        for m in p.get("matters", []):
            status_of[(p["name"], m["matter"])] = m["status"]
    matter_kw = people.get("matters", {})
    for where, text in surfaces:
        for sent in sentences(text):
            for p in people.get("people", []):
                if not any(re.search(rf"\b{re.escape(a)}\b", sent, re.I) for a in p["aliases"]):
                    continue
                for matter, kws in matter_kw.items():
                    if not any(k.lower() in sent.lower() for k in kws):
                        continue
                    st = status_of.get((p["name"], matter))
                    if st is None:
                        continue
                    event_free = re.sub(r"\b(the|her|his|this|that|a|Betsy's|wife's)\s+(killing|murder|death|stabbing)\b", " ", sent, flags=re.I)
                    guilt = GUILT.search(event_free); qual = QUALIFIER.search(sent)
                    if st in ("CHARGED_PENDING", "NOT_CHARGED", "SUSPECTED", "INVESTIGATED", "ARRESTED") and guilt and not qual:
                        R.add("CRITICAL", "G8-guilt-language", f"{where}: '{sent[:120]}' uses '{guilt.group(0)}' about {p['name']} in the {matter} matter, where status is {st}.",
                              "State the legal status ('charged', 'pleaded not guilty', 'not charged') and remove guilt language.", where=where)
                    if st == "ACQUITTED" and PRESENT_GUILT.search(sent):
                        R.add("CRITICAL", "G8-acquittal-as-guilt", f"{where}: '{sent[:120]}' presents {p['name']} as guilty although acquitted.", "Rewrite: he was acquitted.", where=where)
                    if st == "ACQUITTED" and re.search(r"\b(convicted|guilty)\b", sent, re.I) and not re.search(r"\b(not guilty|acquitt\w+|overturned|vacated|new trial|retrial|20(0\d|1[0-4]))\b", sent, re.I):
                        R.add("HIGH", "G8-unqualified-past-conviction", f"{where}: '{sent[:120]}' mentions {p['name']}'s conviction without dating it or noting it was overturned.",
                              "Date it (e.g., 'in 2013') and keep the acquittal adjacent.", where=where)
            if CHARACTERIZATION.search(sent) and (where in ("title", "description") or where.startswith("alt title")):
                R.add("MEDIUM", "G9-characterization", f"{where}: characterisation '{CHARACTERIZATION.search(sent).group(0)}' in '{sent[:100]}'.",
                      "Acquittal is not a finding of innocence; make sure the film and description state the legal outcome precisely.", where=where)
    # G8b questions that presuppose a charged/uncharged person's guilt ("why did it take so long to charge X?")
    for where, text in surfaces:
        for sent in sentences(text):
            if not sent.rstrip().endswith("?"):
                continue
            for p in people.get("people", []):
                if any(m["status"] in ("CHARGED_PENDING", "NOT_CHARGED") for m in p.get("matters", [])) and \
                   any(re.search(rf"\b{re.escape(a_)}\b", sent, re.I) for a_ in p["aliases"]) and \
                   re.search(r"\b(charge|arrest|catch|caught|justice|get away|took so long|take so long|nearly ten years)\b", sent, re.I):
                    R.add("HIGH", "G8b-presupposition", f"{where}: question '{sent[:120]}' presupposes that {p['name']} should have been charged/caught.",
                          "Reword so the question does not assume guilt, or answer it with the legal status.", where=where)
    # G15 'sources for every claim are in the description' must be true
    promise = any(re.search(r"sources for every claim", " ".join(shot_strings(s_)), re.I) for ln in lines for s_ in ln.get("shots", []))
    if promise and pk.get("description_text") is not None:
        used = {e["source"] for c in claims.values() if c.get("lines") for e in c.get("evidence", []) if e.get("supports") != "contradicts"}
        missing = sorted(x for x in used if x in src and src[x]["url"] not in pk["description_text"] and src[x]["source_type"] != "public_domain_data")
        if missing:
            R.add("MEDIUM", "G15-bibliography", f"The film promises 'sources for every claim' in the description, but {len(missing)} cited sources are not listed: {missing[:8]}...",
                  "Add every cited source (URL) to the description, or change the on-screen promise.", where="description")

    # G9 implication in thumbnails/titles about people who are only charged / not charged
    for t in pk.get("thumbnails", []) + [{"concept": "title", "text": [pk.get("title", "")], "depicts": []}]:
        txt = " ".join(t.get("text", []))
        for p in people.get("people", []):
            charged_only = [m for m in p.get("matters", []) if m["status"] in ("CHARGED_PENDING", "NOT_CHARGED")]
            if not charged_only:
                continue
            named = any(re.search(rf"\b{re.escape(a)}\b", txt, re.I) for a in p["aliases"]) or any(d.get("person") == p["name"] for d in t.get("depicts", []))
            if named and re.search(r"murder|killing|kill|death|stab", txt, re.I) and MOTIVE_CUE.search(txt):
                sev = "HIGH" if t.get("selected", True) else "MEDIUM"
                R.add(sev, "G9-implied-accusation", f"Packaging '{t.get('concept')}' pairs {p['name']} (charged/not charged) with the killing and a motive cue: \"{txt[:90]}\".",
                      "Do not use without legal review; prefer packaging about established outcomes.", where=f"thumbnail {t.get('concept')}")
    # G9 Shorts: a standalone clip that involves a charged-only person must carry legal-status context inside its range
    man = (b.get("run") or {}).get("manifest")
    if man:
        tl = {l["i"]: l for l in man["lines"]}
        for sh in pk.get("shorts", []):
            in_range = [l for l in man["lines"] if l.get("say") and l["start"] < sh["out"] and l["end"] > sh["in"]]
            shots_in = [s for s in man["shots"] if s["start"] < sh["out"] and s["end"] > sh["in"]]
            ids = {c for l in in_range for c in lines[l["i"]].get("claims", [])}
            charged_people = {p["name"] for p in people.get("people", []) for m in p.get("matters", []) if m["status"] in ("CHARGED_PENDING", "NOT_CHARGED")}
            involved = {s for c in ids if c in claims for s in claims[c].get("subjects", []) if s in charged_people and claims[c].get("matter") != "death of Louis Gumpenberger"}
            flat = [s for ln in lines for s in ln["shots"]]
            text = " ".join(l["say"] for l in in_range) + " " + " ".join(" ".join(shot_strings(flat[s["i"]])) for s in shots_in if s["i"] < len(flat))
            if involved and not re.search(r"not convicted|pleaded not guilty|presumed innocent|charged", text, re.I):
                R.add("HIGH", "G9-short-without-status", f"Short '{sh['slug']}' ({sh['in']}-{sh['out']}s) involves {sorted(involved)} but never states their legal status in the clip.",
                      "Add an on-screen status card (e.g., 'Pam Hupp: charged, pleaded not guilty, presumed innocent') or change the range.", where=f"short {sh['slug']}")
            alleg = [c for c in ids if c in claims and claims[c]["assertion"] == "attributed_allegation" and claims[c].get("matter") == "death of Louis Gumpenberger"]
            if alleg and not re.search(r"Alford|life without parole|sentenced", text, re.I):
                R.add("MEDIUM", "G9-short-missing-outcome", f"Short '{sh['slug']}' carries prosecution allegations ({sorted(alleg)}) without the case outcome.",
                      "Extend the clip to include the plea/sentence, or add a closing status card.", where=f"short {sh['slug']}")

    # G12 rendered output matches the approved script
    run = b.get("run")
    if run:
        if run.get("captions") and man:
            caps = " ".join(" ".join(blk.split("\n")[2:]) for blk in run["captions"].strip().split("\n\n"))
            approved = " ".join(l["say"] for l in lines if l.get("say"))
            if re.sub(r"\s+", " ", caps).strip() != re.sub(r"\s+", " ", approved).strip():
                R.add("HIGH", "G12-captions-drift", "Captions differ from the approved script.", "Regenerate captions from the approved script.", where="captions")
        if man:
            rendered = [l.get("say") for l in man["lines"]]
            approved = [l.get("say") for l in lines]
            if rendered != approved:
                diff = [i for i, (x, y) in enumerate(zip(rendered, approved)) if x != y]
                R.add("HIGH", "G12-render-drift", f"Rendered narration differs from approved script at lines {diff[:8]} (or line count {len(rendered)} vs {len(approved)}).",
                      "Re-audit the render against the current script; a material change needs a new version.", where="render")
        if run.get("plan"):
            rshots = [{k: v for k, v in s.items() if k not in ("i", "line", "start", "end", "chapterTag")} for s in run["plan"]["shots"]]
            ashots = [{k: v for k, v in s.items() if k not in ("claims", "depicts", "chapterTag", "w")} for ln in lines for s in ln["shots"]]
            rshots = [{k: v for k, v in s.items() if k != "w"} for s in rshots]
            if len(rshots) != len(ashots) or any(x != y for x, y in zip(rshots, ashots)):
                bad = [j for j, (x, y) in enumerate(zip(rshots, ashots)) if x != y]
                R.add("HIGH", "G12-onscreen-drift", f"Rendered on-screen content differs from the approved shots (first differing shots: {bad[:6]}).",
                      "Re-audit on-screen text against the approved script.", where="render")
        asr = run.get("asr")
        if asr is not None and asr.get("corpus_wer", 0) > 0.2:
            R.add("HIGH", "G12-asr", f"Speech recognition of the render differs from the script (WER {asr['corpus_wer']}).", "Listen and compare.", where="audio")

    # manual / independent review findings (stage C, D, F)
    for f in b.get("findings", []):
        if f.get("state", "open") == "open":
            R.add(f["severity"], f"REVIEW-{f['stage']}", f"{f['id']}: {f['problem']}", f.get("recommendation", ""), finding=f["id"], claim=f.get("claims"), lines=f.get("lines"))

    # ------------------------------------------------------------------ decision
    items = sorted(R.items, key=lambda x: SEV.index(x["severity"]))
    open_blocking = [x for x in items if x["severity"] in ("CRITICAL", "HIGH")]
    tech = None
    if run and run.get("verify"):
        tech = bool(run["verify"].get("all_passed")) and (run.get("qa") or {}).get("all_ok", True)
    statuses = {}
    for cid, st in eff.items():
        statuses[st] = statuses.get(st, 0) + 1
    signoffs = b["approvals"].get("signoffs", [])
    human_fact = any(s.get("stage") == "factual" and s.get("human") for s in signoffs)
    human_legal = any(s.get("stage") == "legal" and s.get("human") for s in signoffs)
    factual_ok = not [x for x in open_blocking if x["rule"].startswith(("G1", "G2", "G3", "G5", "G6", "G10", "G12", "G13")) or x["rule"] in ("REVIEW-C", "REVIEW-F")]
    legal_ok = not [x for x in open_blocking if x["rule"].startswith(("G7", "G8", "G9", "G14")) or x["rule"] == "REVIEW-D"]
    cleared = bool(tech) and factual_ok and legal_ok and human_fact and human_legal and not open_blocking
    reasons = []
    if not tech: reasons.append("technical checks missing or failed" if tech is False else "no technical verification supplied")
    if not factual_ok: reasons.append("open factual/verification findings")
    if not legal_ok: reasons.append("open legal-risk findings")
    if not human_fact: reasons.append("no human fact-check sign-off recorded")
    if not human_legal: reasons.append("no qualified legal review recorded")
    return {"as_of": str(as_of), "decision": "CLEARED FOR PUBLICATION" if cleared else "DRAFT — NOT CLEARED FOR PUBLICATION",
            "reasons": reasons, "technical_ok": tech, "factual_ok": factual_ok, "legal_risk_ok": legal_ok,
            "human_signoff": {"factual": human_fact, "legal": human_legal}, "claim_status_counts": statuses, "effective_status": eff,
            "counts": {s: sum(1 for x in items if x["severity"] == s) for s in SEV}, "findings": items}


def claim_fingerprint(c: dict, lines: list) -> str:
    """Hash of what was reviewed: the proposition, its facts, its evidence and the exact narration it supports."""
    say = " | ".join(lines[i].get("say", "") for i in c.get("lines", []) if i < len(lines))
    ev = json.dumps([(e["source"], e.get("supports"), e.get("passage")) for e in c.get("evidence", [])], sort_keys=True)
    return sha(c["proposition"] + "||" + "|".join(c.get("facts", [])) + "||" + ev + "||" + say)


def to_markdown(rep: dict, title: str) -> str:
    L = [f"# Release gate: {title}", "", f"**Decision: {rep['decision']}**", "", f"Checked: {rep['as_of']}", ""]
    if rep["reasons"]:
        L += ["Why not cleared:"] + [f"- {r}" for r in rep["reasons"]] + [""]
    L += ["| Track | Result |", "|---|---|", f"| Technical | {'PASS' if rep['technical_ok'] else ('FAIL' if rep['technical_ok'] is False else 'not supplied')} |",
          f"| Factual verification | {'no blocking findings' if rep['factual_ok'] else 'BLOCKED'} |", f"| Legal-risk screen | {'no blocking findings' if rep['legal_risk_ok'] else 'BLOCKED'} |",
          f"| Human fact-check sign-off | {'recorded' if rep['human_signoff']['factual'] else 'NOT recorded'} |", f"| Qualified legal review | {'recorded' if rep['human_signoff']['legal'] else 'NOT recorded'} |", "",
          "Claim status (effective): " + ", ".join(f"{k} {v}" for k, v in sorted(rep["claim_status_counts"].items())), "",
          "Findings: " + ", ".join(f"{k} {v}" for k, v in rep["counts"].items() if v), "", "| Sev | Rule | Where | Problem | Fix |", "|---|---|---|---|---|"]
    for f in rep["findings"]:
        where = f.get("where") or (f"L{f['line']:02d}" if isinstance(f.get("line"), int) else "") or (f.get("claim") if isinstance(f.get("claim"), str) else ", ".join(f.get("claim") or []))
        L.append(f"| {f['severity']} | {f['rule']} | {where} | {f['message'].replace('|', '/')} | {f['fix'].replace('|', '/')} |")
    return "\n".join(L) + "\n"


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("film_dir"); ap.add_argument("--run", default=None); ap.add_argument("--as-of", default=None)
    ap.add_argument("--out", default=None); ap.add_argument("--md", default=None)
    a = ap.parse_args(argv)
    b = load_bundle(Path(a.film_dir), Path(a.run) if a.run else None)
    as_of = dt.date.fromisoformat(a.as_of) if a.as_of else dt.date.today()
    rep = run_gate(b, as_of)
    if a.out: Path(a.out).write_text(json.dumps(rep, indent=1, ensure_ascii=False))
    if a.md: Path(a.md).write_text(to_markdown(rep, b["film"]["title"]))
    print(json.dumps({k: rep[k] for k in ("decision", "reasons", "technical_ok", "factual_ok", "legal_risk_ok", "counts", "claim_status_counts")}, indent=1, ensure_ascii=False))
    return 0 if not [f for f in rep["findings"] if f["severity"] in ("CRITICAL", "HIGH")] else 1


if __name__ == "__main__":
    sys.exit(main())
