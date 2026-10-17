"""The version-2 engagement checks (pipeline/engage_qa.py): hook length, save card before the last beat, a short
single-punchline ending. They apply only to episodes that set "engagement_version": 2."""
import sys, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from pipeline import engage_qa  # noqa: E402


def timeline(ids, ends, hook_end=2.4):
    tl, t0 = [], 0.0
    for i, (sid, e) in enumerate(zip(ids, ends)):
        line = {"start": t0 + 0.25, "end": (hook_end if i == 0 else e - 0.3), "text": "word", "words": [{"start": 0.0, "w": "word"}]}
        tl.append({"id": sid, "start": t0, "end": e, "lines": [line]}); t0 = e
    return tl


class VersionTwoChecks(unittest.TestCase):
    def run_checks(self, ids, ends, version=2, hook_end=2.4):
        plan = {"episode": {"engagement_version": version, "scenes": [{}]}}
        return engage_qa.analyse(plan, timeline(ids, ends, hook_end), None)["checks"]

    def test_breakout_shape_passes(self):   # Case File 45: the save card, then the statistic, then a 4 s ending
        c = self.run_checks(["s01_hook", "s02", "s07_lesson", "s08_stat", "s09_end"], [5, 20, 26, 31, 35])
        self.assertTrue(c["hook_line_done_by_2_6s"] and c["save_card_before_last_beat"] and c["single_punchline_ending"])

    def test_save_card_just_before_the_ending_fails(self):   # Case File 59: the tail leaked through the save card
        c = self.run_checks(["s01_hook", "s02", "s06_stat", "s07_lesson", "s08_end"], [5, 20, 25, 29, 33])
        self.assertFalse(c["save_card_before_last_beat"])

    def test_long_ending_and_slow_hook_fail(self):
        c = self.run_checks(["s01_hook", "s05_lesson", "s06", "s07", "s08_end"], [5, 15, 22, 28, 35], hook_end=3.1)
        self.assertFalse(c["single_punchline_ending"]); self.assertFalse(c["hook_line_done_by_2_6s"])

    def test_earlier_episodes_are_not_rejudged(self):
        c = self.run_checks(["s01_hook", "s02", "s07_lesson", "s08_end"], [5, 20, 29, 37], version=1)
        self.assertNotIn("save_card_before_last_beat", c)


if __name__ == "__main__":
    unittest.main()


class VersionThreeSearch(unittest.TestCase):
    def test_search_term_must_be_in_headline_and_said_early(self):
        tl = [{"id": "s01_hook", "start": 0.0, "end": 5.0, "lines": [{"start": 0.25, "end": 2.4, "text": "x",
               "words": [{"start": 0.0, "w": "Louvre"}, {"start": 0.4, "w": "heist"}]}]}]
        ep = {"engagement_version": 3, "id": "none", "search_terms": ["louvre heist"], "scenes": [{}],
              "hook_title": {"lines": [{"text": "THE LOUVRE HEIST"}, {"text": "ONE YEAR LATER"}]}}
        c = engage_qa.analyse({"episode": ep}, tl, None)["checks"]
        self.assertTrue(c["search_term_in_headline_and_first_4s"]); self.assertFalse(c["post_file_ready"])   # no post.md
        ep["hook_title"] = {"lines": [{"text": "ONE YEAR LATER"}]}
        self.assertFalse(engage_qa.analyse({"episode": ep}, tl, None)["checks"]["search_term_in_headline_and_first_4s"])


class VersionFour(unittest.TestCase):
    def test_no_save_card_scene_and_lesson_optional(self):
        tl = timeline(["s01_hook", "s02", "s03", "s04_end"], [5, 15, 30, 34])
        ep = {"engagement_version": 4, "id": "none", "search_terms": [], "scenes": [{}]}
        c = engage_qa.analyse({"episode": ep}, tl, None)["checks"]
        self.assertTrue(c["no_save_card_scene"]); self.assertNotIn("save_card_before_last_beat", c)
        tl2 = timeline(["s01_hook", "s02", "s03_lesson", "s04_end"], [5, 15, 30, 34])
        self.assertFalse(engage_qa.analyse({"episode": ep}, tl2, None)["checks"]["no_save_card_scene"])


class KokoroDeliveryAndMix(unittest.TestCase):
    def test_energy_speeds_up_and_tightens_pauses(self):
        from pipeline import narrate
        calm, hype = narrate.kokoro_delivery("reveal", 0.0), narrate.kokoro_delivery("reveal", 1.0)
        self.assertGreater(hype["speed"], calm["speed"]); self.assertLess(hype["pre"], calm["pre"]); self.assertLess(hype["after"], calm["after"])
        self.assertEqual(narrate.kokoro_text("It got stuck.", "hook", 1.0), "It got stuck!")
        self.assertEqual(narrate.kokoro_text("It got stuck.", "tense", 1.0), "It got stuck.")   # only push tones
        self.assertEqual(narrate.kokoro_text("Whose finger?", "hook", 1.0), "Whose finger?")

    def test_duck_hold_fills_short_gaps_only(self):
        import numpy as np
        from pipeline.mixdown import hold_gaps
        on = np.array([1, 1, 0, 0, 0, 1, 1] + [0] * 60 + [1], float)   # a 60 ms gap, then a 1.2 s gap
        h = hold_gaps(on, 0.8)
        self.assertTrue((h[2:5] == 0.5).all()); self.assertTrue((h[10:60] == 0).all())


class VersionFourEnding(unittest.TestCase):
    def test_v4_wants_one_closing_line(self):
        tl = timeline(["s01_hook", "s02", "s03", "s04_end"], [5, 15, 30, 33.5])
        tl[-1]["lines"].append(dict(tl[-1]["lines"][0]))   # two lines in the last scene
        ep = {"engagement_version": 4, "id": "none", "search_terms": [], "scenes": [{}]}
        self.assertFalse(engage_qa.analyse({"episode": ep}, tl, None)["checks"]["single_punchline_ending"])
        ep["engagement_version"] = 2
        self.assertTrue(engage_qa.analyse({"episode": ep}, tl, None)["checks"]["single_punchline_ending"])
