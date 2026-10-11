"""Asset pipeline tests: rights decisions, style policy (cartoon identity, no photoreal people), selection fallback,
Commons metadata parsing (offline fixture), and the narration sentence splitter used for clearer pauses."""
import unittest

from documentary.assets import rights_decision, quality_check, style_check, select_for_segment, parse_commons_imageinfo
from documentary.build import split_sentences


def photo(**kw):
    a = {"id": "p1", "kind": "photo", "source": {"url": "https://commons.example/File:x.jpg"}, "licence": {"name": "CC BY 4.0"},
         "attribution_text": "Photo: J. Smith, CC BY 4.0", "quality": {"width": 2400, "height": 1600}, "depicts": {"person": "Jo Roe"}}
    a.update(kw); return a


class Rights(unittest.TestCase):
    def test_free_licence_with_attribution_clears(self):
        self.assertEqual(rights_decision(photo())["status"], "cleared")

    def test_missing_source_is_rejected(self):
        self.assertEqual(rights_decision(photo(source={}))["status"], "rejected")

    def test_news_and_fair_use_never_auto_clear(self):
        for lic in ("Editorial use only", "All rights reserved", "Fair use", "AP Images", "unknown"):
            self.assertEqual(rights_decision(photo(licence={"name": lic}))["status"], "needs_review", lic)

    def test_attribution_required_but_missing(self):
        self.assertEqual(rights_decision(photo(attribution_text=""))["status"], "needs_review")

    def test_photo_found_online_without_licence_is_not_assumed_free(self):
        self.assertEqual(rights_decision(photo(licence={}))["status"], "needs_review")


class Style(unittest.TestCase):
    def test_ai_image_of_real_person_rejected(self):
        self.assertFalse(style_check({"ai_generated": True, "depicts": {"person": "Jo Roe"}, "label": "ILLUSTRATION"})["ok"])

    def test_ai_image_cannot_pose_as_evidence(self):
        self.assertFalse(style_check({"ai_generated": True, "purpose": "cctv", "label": "ILLUSTRATION"})["ok"])

    def test_ai_environment_must_be_labelled(self):
        self.assertFalse(style_check({"ai_generated": True, "purpose": "environment"})["ok"])
        self.assertTrue(style_check({"ai_generated": True, "purpose": "environment", "label": "ILLUSTRATION"})["ok"])

    def test_real_photo_only_as_framed_insert(self):
        self.assertFalse(style_check(photo())["ok"])
        self.assertTrue(style_check(photo(presentation="framed_archival_insert"))["ok"])

    def test_low_resolution_flagged(self):
        self.assertFalse(quality_check(photo(quality={"width": 800, "height": 600}), "full_frame")["ok"])


class Selection(unittest.TestCase):
    chars = {"roe_char": {"represents": "Jo Roe"}}

    def test_cleared_archival_insert_preferred(self):
        self.assertEqual(select_for_segment({"person": "Jo Roe"}, [photo()], self.chars)["choice"], "archival_insert")

    def test_unclear_rights_fall_back_to_stylised_character(self):
        r = select_for_segment({"person": "Jo Roe"}, [photo(licence={"name": "Editorial use only"})], self.chars)
        self.assertEqual(r["choice"], "stylised_character"); self.assertIn("NOT A LIKENESS", r["label"])

    def test_no_character_falls_back_to_silhouette(self):
        self.assertEqual(select_for_segment({"person": "Al Poe"}, [], self.chars)["choice"], "silhouette")

    def test_place_without_cleared_asset_uses_labelled_illustration(self):
        self.assertIn("ILLUSTRATION", select_for_segment({"place": "Troy"}, [], {})["label"])


class Commons(unittest.TestCase):
    FIXTURE = {"query": {"pages": {"1": {"title": "File:Courthouse.jpg", "imageinfo": [{"url": "https://upload.example/Courthouse.jpg", "descriptionurl": "https://commons.example/File:Courthouse.jpg",
               "width": 3000, "height": 2000, "extmetadata": {"LicenseShortName": {"value": "CC BY-SA 4.0"}, "Artist": {"value": "<a href='x'>A. Photographer</a>"},
               "AttributionRequired": {"value": "true"}, "Attribution": {"value": "A. Photographer / CC BY-SA 4.0"}, "UsageTerms": {"value": "Creative Commons Attribution-Share Alike 4.0"}}}]}}}}

    def test_parse_and_decide(self):
        a = parse_commons_imageinfo(self.FIXTURE)[0]
        self.assertEqual(a["licence"]["name"], "CC BY-SA 4.0"); self.assertEqual(a["source"]["creator"], "A. Photographer")
        d = rights_decision({**a, "kind": "photo"})
        self.assertEqual(d["status"], "cleared"); self.assertTrue(any("share-alike" in r for r in d["reasons"]))


class Sentences(unittest.TestCase):
    def test_split_keeps_abbreviations(self):
        self.assertEqual(len(split_sentences("A St. Louis judge ordered it at 7:04 p.m. from court.")), 1)
        self.assertEqual(split_sentences("He is serving life. In her case, she is charged."), ["He is serving life.", "In her case, she is charged."])


if __name__ == "__main__":
    unittest.main()
