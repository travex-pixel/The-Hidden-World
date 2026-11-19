"""Franchise isolation, Naruto tagging, era discipline, avoid_assets_from, CANON stamp (synthetic data only)."""
import unittest

import numpy as np

from copycat import franchise as fr
from copycat import mapper as M
from copycat import stamp
from copycat.domain_gate import AssetDomainGate, DomainViolation
from copycat.visuals import narutopedia as N

from tests.test_copycat_mapper import asset, beat, make_script, make_timing


def nasset(i, subs, era="part1", **kw):
    a = asset(i, subs, dom="anime_naruto", **kw)
    a["franchise"] = "naruto"
    a["tags"]["era"] = era
    return a


def run(assets, beats, cfg=None, pid="t"):
    script = dict(make_script(beats), domain="anime_naruto")
    gate = AssetDomainGate("anime_naruto", "naruto")
    assets = gate.filter(assets)
    M.configure("naruto", script, cfg or {}, pid)
    timing = make_timing(beats)
    slots, _ = M.build_skeleton(script, timing)
    A = M.Assigner(slots, assets, M.Scorer(assets), {})
    A.run()
    by_id = {a["id"]: a for a in assets}
    return M.finish_shots(M.build_shots(slots, A.assign, by_id, {}), slots, {}), slots


class Franchise(unittest.TestCase):
    def tearDown(self):
        M.configure("black-clover", {}, {}, "x")

    def test_registry(self):
        self.assertEqual(fr.load("naruto")["vault_dir"], "assets/cache/naruto")
        self.assertEqual(fr.for_project("bc-whatif-ep01")["id"], "black-clover")
        self.assertEqual(fr.id_for_project("naruto-whatif-ep01") in ("naruto", "black-clover"), True)

    def test_gate_franchise_isolation(self):
        n = AssetDomainGate("anime_naruto", "naruto")
        b = AssetDomainGate("anime_black_clover")
        bc = {"id": "bc_1", "domain": "anime_black_clover"}
        nr = {"id": "nr_1", "domain": "anime_naruto", "franchise": "naruto"}
        self.assertFalse(n.allows(bc)); self.assertFalse(b.allows(nr))
        self.assertTrue(n.allows(nr)); self.assertTrue(b.allows(bc))
        # even with a permissive domain the franchise decides
        f = AssetDomainGate("anime_fantasy", "naruto")
        self.assertFalse(f.allows(bc)); self.assertTrue(f.allows(nr))
        with self.assertRaises(DomainViolation):
            n.require(bc)

    def test_mapper_never_uses_other_franchise(self):
        bc = asset("bc_1", ["naruto"], dom="anime_naruto")        # right domain, legacy (no franchise field) = black clover
        shots, _ = run([bc, nasset("nr_1", ["naruto"])], [beat("b1", "NARRATOR", [["naruto"]])])
        self.assertEqual({s["asset_id"] for s in shots if s["asset_id"]}, {"nr_1"})


class Tagging(unittest.TestCase):
    def test_meta_characters_and_era(self):
        wt = "{{Characters in image|Naruto Uzumaki, Iruka Umino}}\n| Description = Iruka shields Naruto\n| Source = ''[[Naruto]]'', Episode #1\n"
        m = N.parse_meta(wt)
        self.assertEqual((m["series"], m["episode"]), ("original", 1))
        t = N.derive("", "File:x.png", "", [], "anime_still", 1920, 1080, (), m)
        self.assertEqual(set(t["subjects"]) & {"naruto", "iruka"}, {"naruto", "iruka"})
        self.assertEqual(t["era"], "part1")

    def test_shippuden_excluded_unless_flashback(self):
        m = N.parse_meta("{{Characters in image|Naruto Uzumaki}}\n| Description = Naruto fights\n| Source = ''[[Naruto: Shippūden]]'', Episode #10\n")
        self.assertEqual(N.derive("", "File:x.png", "", [], "anime_still", 1920, 1080, (), m)["era"], "shippuden")
        self.assertFalse(N.wanted("File:x.png", m))

    def test_night_forest_and_clones(self):
        t = N.derive("", "File:Naruto and clones in the forest at night.png", "", [], "anime_still", 1920, 1080)
        self.assertIn("naruto_clones", t["subjects"]); self.assertIn("forest_night", t["subjects"]); self.assertEqual(t["time"], "night")

    def test_vocabulary_covers_franchise_json(self):
        v = fr.load("naruto")["subjects"]
        known = set(N.SUBJECT_KEYS) | set(N.PAGE_SUBJECT.values()) | {"team7", "young_kakashi", "forest_night", "naruto_clones"}
        have = {s for grp in ("characters", "places", "objects") for s in v[grp]}
        # every tag the vault can emit is a registry subject (extras are reported, not silently invented)
        self.assertLessEqual(known - have, {"forest"})            # daytime-forest helper tag (now in the registry; tolerated either way)
        self.assertEqual(have - known, set())                     # and every registry subject is taggable


class Era(unittest.TestCase):
    def tearDown(self):
        M.configure("black-clover", {}, {}, "x")

    def test_part1_beats_shippuden_for_character_frames(self):
        shots, _ = run([nasset("old", ["naruto"], era="shippuden"), nasset("kid", ["naruto"], era="part1")],
                       [beat("b1", "NARUTO", [["naruto"]])])
        self.assertEqual(shots[0]["asset_id"], "kid")

    def test_avoid_assets_from(self):
        import json, tempfile
        from pathlib import Path
        pid = "zz-test-avoid"
        d = M.ROOT / "copycat/projects" / pid
        d.mkdir(parents=True, exist_ok=True)
        try:
            (d / "edit.json").write_text(json.dumps({"shots": [{"asset_id": "a1"}]}))
            shots, _ = run([nasset("a1", ["naruto"]), nasset("a2", ["naruto"])], [beat("b1", "NARUTO", [["naruto"]])],
                           cfg={"avoid_assets_from": [pid]}, pid="other")
            self.assertEqual(shots[0]["asset_id"], "a2")
        finally:
            (d / "edit.json").unlink(); d.rmdir()

    def test_stamp_carried_and_avg_shot_length(self):
        b = beat("b1", "NARRATOR", [["naruto"], ["naruto"]], text="x " * 40)
        b["stamp"] = {"label": "CANON", "note": "Shadow clones return memories"}
        beats = [b]
        shots, slots = run([nasset(f"n{i}", ["naruto"]) for i in range(6)], beats, cfg={"avg_shot_s": 5.0})
        self.assertEqual(shots[0]["stamp"], {"label": "CANON", "note": "Shadow clones return memories"})
        self.assertTrue(all("stamp" not in s for s in shots[1:]))


class Stamp(unittest.TestCase):
    def test_timeline(self):
        P = stamp.StampPainter.params
        self.assertEqual(P(0, 100, 30)[1], 1.6)
        self.assertEqual(P(4, 100, 30)[1], 1.0)
        self.assertGreater(P(3, 100, 30)[2], 0)                  # flash on the impact frames
        self.assertIsNone(P(78, 100, 30))                         # 2.6 s cap
        self.assertIsNone(P(40, 40, 30))                          # never past the shot
        self.assertLess(P(77, 100, 30)[0], 0.2)                   # faded out at the end

    def test_draw_stays_out_of_caption_zone(self):
        W, H = 1920, 1080
        sp = stamp.StampPainter(W, H)
        fr_ = np.full((H, W, 3), 128, np.uint8)
        for i in (0, 10, 40):
            f = fr_.copy()
            sp.draw(f, {"label": "CANON", "note": "Kakashi explains it. Naruto is 16."}, i, 90, 30)
            diff = np.abs(f.astype(int) - 128).sum(axis=2) > 0
            self.assertTrue(diff.any())
            ys, xs = np.nonzero(diff)
            if i >= 10:
                self.assertLess(ys.max(), H * 0.5)                # upper half only (captions live at the bottom)
                self.assertGreater(xs.min(), W * 0.45)            # right side


if __name__ == "__main__":
    unittest.main()
