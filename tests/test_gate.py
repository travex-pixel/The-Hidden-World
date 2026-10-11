"""Release-gate tests: synthetic cases for each failure the gate must catch, positive controls, and a regression
run on the real Betsy Faria ledger. Pure Python (no TTS, no rendering, no network)."""
import copy, datetime as dt, unittest
from pathlib import Path

from documentary.gate import run_gate, claim_fingerprint, computed_status, load_bundle

ROOT = Path(__file__).resolve().parent.parent
TODAY = dt.date(2026, 10, 11)
EX = {"level": "search_excerpt", "accessed": "2026-10-11", "method": "search"}
FULL = {"level": "full_text", "accessed": "2026-10-11", "method": "read in full"}


def base():
    """A tiny, clean film: every line evidenced, attributed, legally precise. Gate should find no CRITICAL/HIGH."""
    sources = [
        {"id": "S1", "title": "Court judgment", "publisher": "Circuit Court", "url": "https://court.example/1", "published": "2015-11-06", "source_type": "court_record", "independence_group": "COURT", "access": dict(FULL)},
        {"id": "S2", "title": "News A", "publisher": "Daily A", "url": "https://a.example/1", "published": "2021-07-12", "source_type": "news", "independence_group": "A", "access": dict(FULL)},
        {"id": "S3", "title": "News B", "publisher": "Daily B", "url": "https://b.example/1", "published": "2021-07-13", "source_type": "news", "independence_group": "B", "access": dict(FULL)},
    ]
    claims = [
        {"id": "K1", "proposition": "Alex Doe was acquitted in 2015 of the death of Sam Doe.", "lines": [0], "facts": ["2015", "NOT GUILTY"], "assertion": "legal_status",
         "subjects": ["Alex Doe"], "matter": "death of Sam Doe", "evidence": [{"source": "S1", "supports": "direct", "passage": "The court finds Alex Doe not guilty (2015).", "passage_type": "full_text"}],
         "contradictions": [], "status": "VERIFIED", "risk": "high", "time_sensitive": False, "checked": "2026-10-11"},
        {"id": "K2", "proposition": "In 2021 prosecutors charged Jo Roe in Sam Doe's death; she pleaded not guilty.", "lines": [1], "facts": ["2021"], "assertion": "legal_status",
         "subjects": ["Jo Roe"], "matter": "death of Sam Doe", "evidence": [{"source": "S2", "supports": "direct", "passage": "Jo Roe was charged in 2021 and pleaded not guilty.", "passage_type": "full_text"},
                                                                             {"source": "S3", "supports": "direct", "passage": "Roe charged (2021); pleads not guilty.", "passage_type": "full_text"}],
         "contradictions": [], "status": "VERIFIED", "risk": "high", "time_sensitive": True, "checked": "2026-10-10"},
        {"id": "K3", "proposition": "Prosecutors alleged Jo Roe staged the scene.", "lines": [2], "facts": [], "assertion": "attributed_allegation", "subjects": ["Jo Roe"], "matter": "death of Sam Doe",
         "evidence": [{"source": "S2", "supports": "reports_allegation", "passage": "Prosecutors allege Roe staged the scene.", "passage_type": "full_text"},
                      {"source": "S3", "supports": "reports_allegation", "passage": "The state says Roe staged it.", "passage_type": "full_text"}],
         "contradictions": [], "status": "VERIFIED", "risk": "medium", "time_sensitive": False, "checked": "2026-10-11"},
    ]
    film = {"title": "Test film", "lines": [
        {"say": "In 2015, a judge found Alex Doe not guilty.", "claims": ["K1"], "shots": [{"type": "verdict", "text": "NOT GUILTY", "lines": ["2015"]}]},
        {"say": "In 2021, prosecutors charged Jo Roe in Sam Doe's death. She pleaded not guilty.", "claims": ["K2"], "shots": [{"type": "kinetic", "lines": ["Charged 2021"]}]},
        {"say": "Prosecutors alleged she staged the scene.", "claims": ["K3"], "shots": [{"type": "kinetic", "lines": ["Alleged"]}]},
    ], "timeline": []}
    people = {"people": [
        {"name": "Alex Doe", "aliases": ["Alex Doe", "Alex"], "matters": [{"matter": "death of Sam Doe", "status": "ACQUITTED"}]},
        {"name": "Jo Roe", "aliases": ["Jo Roe", "Roe", "the neighbour"], "matters": [{"matter": "death of Sam Doe", "status": "CHARGED_PENDING"}, {"matter": "death of Pat Roe", "status": "NOT_CHARGED"}]}],
        "matters": {"death of Sam Doe": ["Sam", "Sam Doe", "the killing"], "death of Pat Roe": ["Pat", "her mother"]}}
    b = {"film": film, "claims": claims, "sources": sources, "people": people, "packaging": {"title": "A Verdict in Two Parts", "alt_titles": [], "thumbnails": [], "shorts": []},
         "approvals": {"claims": {}, "signoffs": []}, "findings": [], "run": None}
    approve(b)
    return b


def approve(b, human=False):
    b["approvals"]["claims"] = {c["id"]: {"fingerprint": claim_fingerprint(c, b["film"]["lines"])} for c in b["claims"]}
    if human:
        b["approvals"]["signoffs"] = [{"stage": "factual", "human": True}, {"stage": "legal", "human": True}]


def rules(rep, sev=("CRITICAL", "HIGH")):
    return {f["rule"] for f in rep["findings"] if f["severity"] in sev}


class PositiveControl(unittest.TestCase):
    def test_clean_film_has_no_blocking_findings(self):
        rep = run_gate(base(), TODAY)
        self.assertEqual(rules(rep), set(), rep["findings"])

    def test_clean_film_with_technical_pass_and_human_signoff_is_cleared(self):
        b = base(); approve(b, human=True)
        b["run"] = {"verify": {"all_passed": True}, "qa": {"all_ok": True}}
        self.assertEqual(run_gate(b, TODAY)["decision"], "CLEARED FOR PUBLICATION")

    def test_without_human_signoff_it_is_never_cleared(self):
        b = base(); b["run"] = {"verify": {"all_passed": True}, "qa": {"all_ok": True}}
        rep = run_gate(b, TODAY)
        self.assertEqual(rep["decision"], "DRAFT — NOT CLEARED FOR PUBLICATION")
        self.assertIn("no qualified legal review recorded", rep["reasons"])


class EvidenceRules(unittest.TestCase):
    def test_material_claim_without_evidence_record_blocks(self):
        b = base(); b["film"]["lines"].append({"say": "Jo Roe was seen at the house at 7 p.m.", "shots": []})
        rep = run_gate(b, TODAY)
        self.assertIn("G5-no-evidence", rules(rep)); self.assertNotEqual(rep["decision"], "CLEARED FOR PUBLICATION")

    def test_inaccessible_source_cannot_be_verified(self):
        b = base()
        for s in b["sources"]: s["access"] = dict(EX)        # pages never read in full
        rep = run_gate(b, TODAY)
        self.assertIn("G2-overstated-status", rules(rep))
        self.assertEqual(computed_status(b["claims"][1], {s["id"]: s for s in b["sources"]}, TODAY)[0], "CORROBORATED")

    def test_unsupported_source_to_claim_relationship_triggers_review(self):
        b = base(); b["claims"][0]["evidence"][0]["supports"] = "mentions_only"; b["claims"][0]["status"] = "REQUIRES REVIEW"; approve(b)
        rep = run_gate(b, TODAY)
        self.assertEqual(rep["effective_status"]["K1"], "UNVERIFIED")
        self.assertIn("G13-insufficient-status", rules(rep))

    def test_fabricated_citation_is_critical(self):
        b = base(); b["claims"][0]["evidence"].append({"source": "S-NOT-REAL", "supports": "direct", "passage": "invented", "passage_type": "full_text"}); approve(b)
        self.assertIn("G1-unknown-source", rules(run_gate(b, TODAY), ("CRITICAL",)))

    def test_conflicting_sources_warn_and_contradicted_facts_become_disputed(self):
        b = base()
        b["claims"][1]["contradictions"] = ["Source C dates the charge to 2022."]
        b["claims"][0]["assertion"] = "fact"
        b["claims"][0]["evidence"].append({"source": "S2", "supports": "contradicts", "passage": "Witness testimony disputes the verdict date.", "passage_type": "full_text"}); approve(b)
        rep = run_gate(b, TODAY)
        self.assertIn("G4-conflict", rules(rep, ("MEDIUM",)))
        self.assertEqual(rep["effective_status"]["K1"], "DISPUTED")
        self.assertIn("G13-insufficient-status", rules(rep))

    def test_passage_must_contain_the_claims_figures(self):
        b = base(); b["claims"][1]["proposition"] = "In 2019 prosecutors charged Jo Roe; she pleaded not guilty."; approve(b)
        self.assertIn("G3-passage-mismatch", rules(run_gate(b, TODAY), ("MEDIUM",)))

    def test_outdated_time_sensitive_status(self):
        b = base(); b["claims"][1]["checked"] = "2026-08-01"; approve(b)
        rep = run_gate(b, TODAY)
        self.assertEqual(rep["effective_status"]["K2"], "OUTDATED")
        self.assertIn("G13-insufficient-status", rules(rep))

    def test_material_script_change_invalidates_verification(self):
        b = base(); b["film"]["lines"][1]["say"] = "In 2021, prosecutors charged Jo Roe in Sam Doe's death."   # denial silently dropped
        rep = run_gate(b, TODAY)
        self.assertIn("G10-changed-since-review", rules(rep))
        self.assertEqual(rep["effective_status"]["K2"], "REQUIRES REVIEW")


class LegalLanguage(unittest.TestCase):
    def run_line(self, text, sev=("CRITICAL",)):
        b = base(); b["film"]["lines"][1]["say"] = text; approve(b)
        return rules(run_gate(b, TODAY), sev)

    def test_pending_charge_described_as_conviction(self):
        self.assertIn("G8-guilt-language", self.run_line("Jo Roe was convicted of killing Sam."))

    def test_false_accusation_against_charged_person(self):
        self.assertIn("G8-guilt-language", self.run_line("The neighbour killed Sam Doe."))

    def test_accusation_in_uncharged_matter(self):
        self.assertIn("G8-guilt-language", self.run_line("Jo Roe murdered her mother, Pat."))

    def test_precise_legal_status_passes(self):
        self.assertNotIn("G8-guilt-language", self.run_line("Jo Roe is charged in Sam Doe's killing and has pleaded not guilty."))

    def test_acquittal_not_turned_into_conviction(self):
        self.assertIn("G8-acquittal-as-guilt", self.run_line("Alex Doe is the killer in Sam's death."))

    def test_overturned_conviction_not_presented_as_current(self):
        self.assertIn("G8-acquittal-as-guilt", self.run_line("Alex Doe remains convicted of Sam Doe's murder."))

    def test_undated_past_conviction_is_flagged(self):
        self.assertIn("G8-unqualified-past-conviction", self.run_line("Alex Doe was convicted of Sam's murder.", ("HIGH",)))
        self.assertNotIn("G8-unqualified-past-conviction", self.run_line("In 2013 Alex Doe was convicted of Sam's murder; he was acquitted in 2015.", ("HIGH",)))

    def test_disputed_allegation_cannot_silently_become_fact(self):
        b = base(); b["film"]["lines"][2]["say"] = "She staged the scene."; approve(b)
        self.assertIn("G7-unattributed", rules(run_gate(b, TODAY)))


class OutputsAndPackaging(unittest.TestCase):
    def test_unsupported_onscreen_fact(self):
        b = base(); b["film"]["lines"][1]["shots"][0]["lines"] = ["Charged 2021", "Seen at 7:27 PM"]
        self.assertIn("G6-unsupported-onscreen", rules(run_gate(b, TODAY)))

    def test_onscreen_source_credit_must_match_cited_publisher(self):
        b = base(); b["sources"].append({"id": "S4", "title": "x", "publisher": "FOX 2 St. Louis", "url": "https://f.example", "published": "2021", "source_type": "news",
                                         "independence_group": "F", "access": dict(FULL)})
        b["claims"][1]["evidence"].append({"source": "S4", "supports": "direct", "passage": "charged 2021", "passage_type": "full_text"}); approve(b)
        b["film"]["lines"][1]["shots"][0]["source"] = "St. Louis Post-Dispatch"        # shares only the words 'St. Louis' with a cited outlet
        self.assertIn("G6-source-tag", rules(run_gate(b, TODAY), ("MEDIUM",)))
        b["film"]["lines"][1]["shots"][0]["source"] = "FOX 2 · Daily A"
        self.assertNotIn("G6-source-tag", rules(run_gate(b, TODAY), ("MEDIUM",)))

    def test_captions_must_match_approved_script(self):
        b = base(); approve(b)
        caps = "1\n00:00:00,000 --> 00:00:02,000\nIn 2015, a judge found Alex Doe guilty.\n"
        b["run"] = {"captions": caps, "manifest": {"lines": [{"i": i, "say": l["say"], "start": i, "end": i + 1} for i, l in enumerate(b["film"]["lines"])], "shots": []}}
        self.assertIn("G12-captions-drift", rules(run_gate(b, TODAY)))

    def test_misleading_thumbnail_is_flagged(self):
        b = base(); b["packaging"]["thumbnails"] = [{"concept": "x", "selected": True, "text": ["$10,000", "DAYS BEFORE", "THE KILLING", "THE NEIGHBOUR"], "depicts": []}]
        self.assertIn("G9-implied-accusation", rules(run_gate(b, TODAY)))

    def test_accusatory_title_is_flagged(self):
        b = base(); b["packaging"]["title"] = "Jo Roe Killed Sam Doe"
        self.assertIn("G8-guilt-language", rules(run_gate(b, TODAY), ("CRITICAL",)))

    def test_short_without_legal_status_context(self):
        b = base(); b["film"]["lines"][2]["say"] = "Prosecutors alleged the neighbour staged the scene."; approve(b)
        man = {"lines": [{"i": i, "say": l["say"], "start": i * 5.0, "end": i * 5.0 + 5} for i, l in enumerate(b["film"]["lines"])],
               "shots": [{"i": i, "line": i, "start": i * 5.0, "end": i * 5.0 + 5} for i in range(3)]}
        b["run"] = {"manifest": man}; b["packaging"]["shorts"] = [{"slug": "clip", "in": 10.0, "out": 15.0, "hook": "WHAT SHE DID"}]
        self.assertIn("G9-short-without-status", rules(run_gate(b, TODAY)))
        b["packaging"]["shorts"] = [{"slug": "clip", "in": 5.0, "out": 15.0, "hook": "THE CASE"}]   # includes the 'pleaded not guilty' line
        self.assertNotIn("G9-short-without-status", rules(run_gate(b, TODAY)))

    def test_unproven_depicted_act_is_critical(self):
        b = base(); b["film"]["lines"][2]["shots"][0]["depicts"] = {"person": "Jo Roe", "act": "staging the scene"}
        self.assertIn("G14-depicted-act-unproven", rules(run_gate(b, TODAY), ("CRITICAL",)))

    def test_open_critical_review_finding_blocks_clearance(self):
        b = base(); approve(b, human=True); b["run"] = {"verify": {"all_passed": True}, "qa": {"all_ok": True}}
        b["findings"] = [{"id": "LR-X", "stage": "D", "severity": "CRITICAL", "problem": "implied accusation", "recommendation": "cut it", "state": "open"}]
        self.assertEqual(run_gate(b, TODAY)["decision"], "DRAFT — NOT CLEARED FOR PUBLICATION")

    def test_every_finding_is_actionable(self):
        b = base(); b["film"]["lines"].append({"say": "Unsourced line with 1999 in it.", "shots": [{"type": "kinetic", "lines": ["1999"]}]})
        for f in run_gate(b, TODAY)["findings"]:
            self.assertTrue(f["message"].strip()); self.assertTrue(f["fix"].strip()); self.assertIn(f["severity"], ("CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"))


class RealLedger(unittest.TestCase):
    """The shipped Betsy Faria ledger: honest statuses, no CRITICAL language findings, not cleared without humans."""
    def setUp(self):
        self.b = load_bundle(ROOT / "documentary" / "films" / "betsy-faria")
        self.rep = run_gate(self.b, TODAY)

    def test_no_claim_marked_verified_without_full_text(self):
        src = {s["id"]: s for s in self.b["sources"]}
        for c in self.b["claims"]:
            if c["status"] in ("VERIFIED", "DIRECTLY SUPPORTED"):
                self.assertTrue(any(src[e["source"]]["access"]["level"] == "full_text" for e in c["evidence"]), c["id"])

    def test_no_critical_legal_language_and_not_cleared(self):
        self.assertEqual([f for f in self.rep["findings"] if f["severity"] == "CRITICAL" and f["rule"].startswith("G8")], [])
        self.assertEqual(self.rep["decision"], "DRAFT — NOT CLEARED FOR PUBLICATION")

    def test_open_review_findings_are_reported(self):
        open_ids = {f["id"] for f in self.b["findings"] if f.get("state", "open") == "open"}
        reported = {f.get("finding") for f in self.rep["findings"] if f["rule"].startswith("REVIEW-")}
        self.assertEqual(open_ids, reported)

    def test_every_narration_line_is_evidenced(self):
        self.assertNotIn("G5-no-evidence", rules(self.rep))

    def test_hupp_status_is_charged_pending_in_betsy_matter(self):
        p = next(p for p in self.b["people"]["people"] if p["name"] == "Pam Hupp")
        self.assertEqual(next(m for m in p["matters"] if m["matter"] == "death of Betsy Faria")["status"], "CHARGED_PENDING")


if __name__ == "__main__":
    unittest.main()
