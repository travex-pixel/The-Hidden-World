import sys, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from copycat.domain_gate import AssetDomainGate, DomainViolation  # noqa: E402
from pipeline.build import check_anime_domain  # noqa: E402


class Gate(unittest.TestCase):
    def setUp(self):
        self.g = AssetDomainGate("anime_black_clover")

    def test_true_crime_rejected(self):
        self.assertFalse(self.g.allows({"id": "x", "domain": "true_crime"}))
        with self.assertRaises(DomainViolation) as c:
            self.g.require({"id": "x", "domain": "true_crime"})
        self.assertIn("x", str(c.exception)); self.assertIn("true_crime", str(c.exception)); self.assertIn("anime_black_clover", str(c.exception))

    def test_untagged_rejected(self):
        self.assertFalse(self.g.allows({"id": "y"}))

    def test_anime_allowed_and_audit(self):
        a = [{"id": "a", "domain": "anime_black_clover"}, {"id": "b", "domain": "anime_fantasy"}, {"id": "c", "domain": "documentary"}, {"id": "d"}]
        self.assertEqual(self.g.audit(a), {"allowed": 2, "rejected": 2, "rejected_ids": ["c", "d"]})
        self.assertEqual(len(self.g.filter(a)), 2)

    def test_audio_domains_audio_only(self):
        s = {"id": "s", "domain": "general_sfx"}
        self.assertTrue(self.g.allows(s, kind="audio"))
        self.assertFalse(self.g.allows(s))


class Hook(unittest.TestCase):
    def test_svg_refused_for_anime(self):
        with self.assertRaisesRegex(DomainViolation, "no generic cartoon fallback"):
            check_anime_domain({"domain": "anime_black_clover"}, "svg")

    def test_untagged_panel_refused(self):
        with self.assertRaises(DomainViolation):
            check_anime_domain({"domain": "anime_black_clover"}, "art", {"panels": {"p1": {"src": "x.jpg"}}})
        check_anime_domain({"domain": "anime_black_clover"}, "art", {"panels": {"p1": {"src": "x.jpg", "domain": "anime_black_clover"}}})

    def test_legacy_unaffected(self):
        check_anime_domain({}, "svg")
        check_anime_domain({}, "art", {"panels": {"p1": {"src": "x"}}})


if __name__ == "__main__":
    unittest.main()
