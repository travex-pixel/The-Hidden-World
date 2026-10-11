"""Narration delivery and caption timing (documentary engine). Pure functions only: no voice model is loaded."""
import unittest

from documentary.build import DELIVERY, _jitter, build_captions, chunk_caption, delivery


class DeliveryTests(unittest.TestCase):
    def test_every_tone_has_all_controls_and_sane_ranges(self):
        for tone, d in DELIVERY.items():
            self.assertEqual(set(d), {"speed", "gap", "pre", "after"}, tone)
            self.assertTrue(0.85 <= d["speed"] <= 1.05, tone)
            self.assertTrue(0.2 <= d["gap"] <= 0.6 and 0 <= d["pre"] <= 0.6 and 0.25 <= d["after"] <= 0.8, tone)

    def test_reveal_and_reflective_breathe_more_than_confident(self):
        self.assertGreater(DELIVERY["reveal"]["pre"], DELIVERY["confident"]["pre"])
        self.assertGreater(DELIVERY["reflective"]["after"], DELIVERY["confident"]["after"])
        self.assertLess(DELIVERY["reflective"]["speed"], DELIVERY["confident"]["speed"])

    def test_line_pace_and_film_speed_combine(self):
        d = delivery({"speed": 1.02}, {"tone": "tense"})
        self.assertAlmostEqual(d["speed"], 1.02 * DELIVERY["tense"]["speed"])
        self.assertAlmostEqual(delivery({}, {"tone": "tense", "pace": 0.9})["speed"], 0.9)
        self.assertEqual(delivery({}, {})["gap"], DELIVERY["confident"]["gap"])   # no tone: confident

    def test_jitter_is_deterministic_and_bounded(self):
        vals = [_jitter(f"sentence {i}", 0.05) for i in range(200)]
        self.assertEqual(vals, [_jitter(f"sentence {i}", 0.05) for i in range(200)])
        self.assertTrue(all(-0.05 <= v <= 0.05 for v in vals))
        self.assertGreater(len({round(v, 3) for v in vals}), 50)   # pauses do not repeat to the millisecond


class CaptionTests(unittest.TestCase):
    def test_no_one_word_stub_at_the_end_of_a_sentence(self):
        parts = chunk_caption("That wife is still alive, and she later testified against him at one of his trials.")
        self.assertGreater(len(parts[-1].replace("\n", " ")), 15)
        self.assertEqual(" ".join(p.replace("\n", " ") for p in parts), "That wife is still alive, and she later testified against him at one of his trials.")

    def test_fast_cues_borrow_the_following_silence_but_never_overlap(self):
        tl = [{"say": "x", "sentences": [{"text": "Randolph told police Miller was wearing a mask.", "start": 0.0, "end": 1.9}]},
              {"say": "y", "sentences": [{"text": "Then.", "start": 3.0, "end": 3.4}]}]
        cues = build_captions(tl)
        self.assertGreater(cues[0]["end"], 1.9)                     # extended into the pause
        self.assertLessEqual(cues[0]["end"], cues[1]["start"] - 0.05)
        self.assertGreaterEqual(cues[1]["end"] - cues[1]["start"], 1.0)


if __name__ == "__main__":
    unittest.main()
