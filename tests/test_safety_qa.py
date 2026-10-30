import unittest
from pipeline import safety_qa


def plan(lines, labels=(), music=None, claims=True):
    sc = {"id": "s01", "lines": [{"text": t} for t in lines], "labels": [{"text": l} for l in labels], "claims": ["K_a"] if claims else []}
    return {"episode": {"scenes": [sc], "music": music or {"bpm": 96, "key": "Dm"}}}


POST = "CAPTION: x\nHASHTAGS: #a #b #c\nSEED COMMENT: y\nPINNED: z\nPOST WHEN: now. Switch on Instagram's AI label.\n"


class Names(unittest.TestCase):
    def test_accused_named_as_guilty_fails(self):
        r = safety_qa.analyse(plan(["John Smith smuggled cocaine through Barcelona."]))
        self.assertFalse(r["checks"]["accused_not_named_as_guilty"])

    def test_attributed_or_convicted_passes(self):
        for t in ("Police say John Smith smuggled cocaine.", "John Smith pleaded guilty to smuggling cocaine.", "A smuggler taped cocaine under his wig."):
            self.assertTrue(safety_qa.analyse(plan([t]))["checks"]["accused_not_named_as_guilty"], t)

    def test_agencies_and_famous_labels_are_not_names(self):
        self.assertTrue(safety_qa.analyse(plan(["Smugglers branded their cocaine with Haaland. Border Patrol stole nothing."]))["checks"]["accused_not_named_as_guilty"])


class Content(unittest.TestCase):
    def test_gore_and_victim_jokes_fail(self):
        self.assertFalse(safety_qa.analyse(plan(["Blood everywhere."]))["checks"]["no_graphic_words"])
        self.assertFalse(safety_qa.analyse(plan(["The dumbest victim of the year."]))["checks"]["no_victim_as_joke"])

    def test_claims_and_music(self):
        self.assertFalse(safety_qa.analyse(plan(["x"], claims=False))["checks"]["every_scene_has_claims"])
        self.assertFalse(safety_qa.analyse(plan(["x"], music={"file": "track.mp3"}))["checks"]["music_is_ours"])
        self.assertTrue(safety_qa.analyse(plan(["x"]))["checks"]["music_is_ours"])


class Post(unittest.TestCase):
    def test_post_checks(self):
        r = safety_qa.analyse(plan(["x"]), POST)["checks"]
        self.assertTrue(r["ai_label_reminder"]); self.assertTrue(r["hashtags_at_most_5"]); self.assertTrue(r["no_engagement_bait"])
        bad = POST.replace("#a #b #c", "#a #b #c #d #e #f").replace("AI label", "label") + "Like if you agree!\n"
        r = safety_qa.analyse(plan(["x"]), bad)["checks"]
        self.assertFalse(r["ai_label_reminder"]); self.assertFalse(r["hashtags_at_most_5"]); self.assertFalse(r["no_engagement_bait"])


if __name__ == "__main__":
    unittest.main()
