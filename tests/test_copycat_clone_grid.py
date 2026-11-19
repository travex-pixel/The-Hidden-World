import json
import random
import unittest
from pathlib import Path

import numpy as np

from copycat import clone_grid as cg
from copycat import mapper

ROOT = Path(__file__).resolve().parent.parent
PID = "naruto-whatif-ep01"


def _labels():
    w = json.loads((ROOT / f"copycat/projects/{PID}/whitelist.json").read_text())
    return {k: v for k, v in w.items() if not k.startswith("_")}


def _vault():
    return {a["id"]: a["path"] for a in json.loads((ROOT / "assets/cache/naruto/vault.json").read_text())["assets"]}


class Layouts(unittest.TestCase):
    def test_rects_inside_safe_area_and_disjoint(self):
        x0, y0, w, h = cg.SAFE
        for n in (1, 2, 3, 4, 6, 9):
            rs = cg.layout(n)
            self.assertEqual(len(rs), n)
            for (x, y, rw, rh) in rs:
                self.assertGreaterEqual(x, x0 - 0.2)
                self.assertGreaterEqual(y, y0 - 0.2)
                self.assertLessEqual(x + rw, x0 + w + 0.2)
                self.assertLessEqual(y + rh, y0 + h + 0.2)
            for i, a in enumerate(rs):
                for b in rs[i + 1:]:
                    ox = min(a[0] + a[2], b[0] + b[2]) - max(a[0], b[0])
                    oy = min(a[1] + a[3], b[1] + b[3]) - max(a[1], b[1])
                    self.assertFalse(ox > 0.5 and oy > 0.5, (n, a, b))
        # captions start below the safe area even after tilt/drift
        self.assertLess(y0 + h + 30, 800)

    def test_mosaic_has_sixteen_centre_tiles_and_a_ring(self):
        centre, ring, dist = cg.mosaic_layout()
        self.assertEqual(len(centre), 16)
        self.assertGreater(len(ring), 100)
        self.assertEqual(dist, sorted(dist))


class Planning(unittest.TestCase):
    def test_panels_differ_and_respect_time_of_day(self):
        labels = _labels()
        for tctx in ("day", "night", "lamp"):
            used = {}
            pl = cg.plan(9, "grid", tctx, labels, lambda L: True, random.Random(3), used)
            ps = pl["panels"]
            self.assertEqual(len(ps), 9)
            self.assertEqual(len({(p["asset_id"], p["variant"]) for p in ps}), 9)
            for p in ps:
                self.assertIn(p["asset_id"], labels)
                self.assertTrue(cg.admissible(labels[p["asset_id"]], tctx))
                self.assertLessEqual(abs(p["hue"]), 12)
                self.assertLessEqual(abs(p["bright"]), 0.06)
                self.assertTrue(p["crop"]["hf"] >= 0.3)
            self.assertEqual(ps[pl["naruto"]]["kind"], "face")
            if tctx == "night":
                self.assertTrue(all(p["grade"] in (None, "night") for p in ps))
            if tctx == "lamp":
                self.assertTrue(all(p["grade"] == "interior_lamp" for p in ps))

    def test_pop_schedule_staggers_within_half_the_shot(self):
        labels = _labels()
        rng = random.Random(5)
        pl = cg.plan(6, "grid", "day", labels, lambda L: True, rng, {})
        cg.schedule_pops(pl["panels"], pl["naruto"], 6.0, rng)
        pops = sorted(p["pop"] for p in pl["panels"])
        self.assertEqual(pops[0], pl["panels"][pl["naruto"]]["pop"])
        self.assertLessEqual(pops[-1] + cg.POP, 0.61 * 6.0)
        self.assertGreater(len(set(pops)), 4)

    def test_window_limited_frames_stay_out_of_other_beats(self):
        labels = _labels()
        pl = cg.plan(6, "grid", "night", labels, lambda L: not L.get("only"), random.Random(1), {})
        self.assertTrue(all("only" not in labels[p["asset_id"]] for p in pl["panels"]))


class Rendering(unittest.TestCase):
    def _scene(self, n, mode, t, grade=None, W=480, H=270, D=3.0, hl=True):
        from copycat.compositor import make_vignette
        labels, vault = _labels(), _vault()
        rng = random.Random(7)
        if mode == "mosaic":
            pl = cg.plan_mosaic(t, labels, lambda L: True, rng, {}, D)
        else:
            pl = cg.plan(n, mode, t, labels, lambda L: True, rng, {})
            cg.schedule_pops(pl["panels"], pl["naruto"], D, rng)
        for p in pl["panels"]:
            p["_abs_path"] = str(ROOT / vault[p["asset_id"]])
        grid = dict(mode=mode, n=n, grade=grade, hl=[dict(t0=0.5, t1=1.2, panel=pl["naruto"])] if hl else [])
        shot = dict(id="s900", start=0.0, end=D, grid=grid, panels=pl["panels"])
        return cg.CloneGridScene(shot, W, H, 30, make_vignette(W, H)), pl

    def test_frames_are_valid_pop_in_and_never_freeze(self):
        sc, pl = self._scene(6, "grid", "day")
        n = 90
        f0, f1, f_end = sc.frame(0, n), sc.frame(int(0.3 * 30), n), sc.frame(n - 1, n)
        self.assertEqual(f0.shape, (270, 480, 3))
        self.assertEqual(f0.dtype, np.uint8)
        self.assertGreater(float(np.abs(f_end.astype(int) - f1.astype(int)).mean()), 1.0)    # more panels have popped
        # consecutive frames late in the shot (all panels in) still change: inner push + page drift
        a, b = sc.frame(70, n).astype(int), sc.frame(71, n).astype(int)
        self.assertGreater(float(np.abs(a - b).mean()), 0.02)
        self.assertGreater(float(f_end.mean()), 20)

    def test_caption_zone_stays_clear(self):
        sc, _ = self._scene(9, "grid", "day", W=960, H=540)
        fr = sc.frame(80, 90)
        bottom = fr[int(540 * 0.78):]                       # caption zone: only the dark page + halftone dots
        self.assertLess(float(bottom.mean()), 30)

    def test_night_grade_darkens(self):
        day, _ = self._scene(4, "grid", "day")
        night, _ = self._scene(4, "grid", "night", grade="night")
        self.assertLess(float(night.frame(80, 90).mean()), float(day.frame(80, 90).mean()))

    def test_mosaic_zooms_out_and_fills_the_frame(self):
        sc, pl = self._scene(16, "mosaic", "night", grade="night", D=4.0)
        a, z = sc.frame(5, 120), sc.frame(119, 120)
        lit_a, lit_z = float((a.mean(axis=2) > 25).mean()), float((z.mean(axis=2) > 25).mean())
        self.assertGreater(lit_z, lit_a)
        self.assertGreater(lit_z, 0.6)

    def test_highlight_uses_the_given_colour(self):
        from copycat.compositor import make_vignette
        sc, pl = self._scene(2, "split", "day")
        sc.hl_rgb = (255, 0, 0)
        with_hl, without = sc.frame(24, 90), None
        sc.hl = []
        without = sc.frame(24, 90)
        self.assertGreater(int(np.abs(with_hl.astype(int) - without.astype(int)).max()), 40)


class MapperIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.edit, cls.rep = mapper.run(PID, False, write=False)

    def test_grids_share_and_whitelist(self):
        self.assertTrue(5.5 <= self.rep["pct_runtime_clone_grid"] <= 10.0, self.rep["pct_runtime_clone_grid"])
        self.assertEqual(self.rep["non_whitelisted_grid_panels"], [])
        sizes = set(self.rep["clone_grid_seconds_by_size"])
        self.assertTrue({"2split", "mosaic16", "9"} <= sizes, sizes)
        labels = _labels()
        for s in self.edit["shots"]:
            if s["type"] == "clone_grid":
                self.assertTrue(all(p["asset_id"] in labels for p in s["panels"]))
                self.assertFalse(s.get("stamp"))

    def test_reuse_rules_hold_again(self):
        self.assertLessEqual(self.rep["max_uses_of_one_asset"], 4)
        self.assertEqual(self.rep["repetition_violations"], 0)
        self.assertEqual(self.rep["repeated_asset_crop"], 0)
        self.assertEqual(self.rep["unmatched_cuts"], [])

    def test_introduction_windows_still_apply(self):
        order = [b["id"] for ch in json.loads((ROOT / f"copycat/projects/{PID}/script.json").read_text())["chapters"] for b in ch["beats"]]
        labels = _labels()
        for s in self.edit["shots"]:
            ids = [s.get("asset_id")] if s.get("asset_id") else [p["asset_id"] for p in s.get("panels", [])]
            for aid in filter(None, ids):
                who = set(labels[aid]["who"])
                if s["type"] == "clone_grid":
                    self.assertTrue(who <= {"naruto", "naruto_clones"}, (s["id"], aid, who))
                if who & {"sasuke", "sakura", "team7"}:
                    self.assertGreaterEqual(order.index(s["beat_id"]), order.index("b168"), (s["id"], aid))
                if "mizuki" in who:
                    self.assertLessEqual(order.index(s["beat_id"]), order.index("b046"))

    def test_shots_tile_the_timeline(self):
        sh = self.edit["shots"]
        for a, b in zip(sh, sh[1:]):
            self.assertAlmostEqual(a["end"], b["start"], places=3)
        self.assertAlmostEqual(sh[-1]["end"], self.edit["duration"], places=2)

    def test_iruka_run_is_all_iruka_without_shuriken_frames(self):
        run = [s for s in self.edit["shots"] if s.get("beat_id") in ("b035", "b036", "b037", "b038")]
        self.assertGreaterEqual(len(run), 6)
        self.assertTrue(all(s.get("asset_id") in {"nr_0949", "nr_1818", "nr_0846", "nr_1042", "nr_0888"} for s in run))
        self.assertGreaterEqual(len({(s["asset_id"], s["crop"]["x"], s["crop"]["y"], s["crop"]["zoom"]) for s in run}), len(run))


if __name__ == "__main__":
    unittest.main()
