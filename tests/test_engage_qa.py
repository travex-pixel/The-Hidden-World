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
