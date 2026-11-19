"""Season-1 engine generalisation: prop pack (inserts_s1), held documents, whitelist vocabulary of Episodes 2-4, speaker
fallbacks, the mist grade, derived clone-grid faces, starter project configs and the packaging / shorts / qa --plan paths."""
import json
import random
import tempfile
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

from copycat import clone_grid as cg
from copycat import inserts as I
from copycat import inserts_s1 as S1
from copycat import mapper, packaging, shorts, whitelist as W
from copycat.vfx import GRADES, grade_vignette

ROOT = Path(__file__).resolve().parent.parent
NEW_TYPES = ("patrol_report", "incident_file", "team_report", "notebook_dates", "regulation", "bingo_appendix", "mission_board", "box_label",
             "price_sheet", "work_schedule", "ledger", "registration_form", "info_card", "cheater_report", "scout_map", "hospital_report",
             "signature_compare", "postponement_form", "leave_slip")


class PropPack(unittest.TestCase):
    def test_every_type_registered_everywhere(self):
        for t in NEW_TYPES + ("signed_doodle",):
            self.assertIn(t, S1.BUILDERS)
            self.assertIn(t, S1.DEFAULT_VIEWS)
            self.assertIn(t, S1.BG_SUBJECTS)
            self.assertIn(t, S1.DOCS)
            if t != "signed_doodle":
                self.assertIn(t, W.BG_SCENES)
        self.assertEqual(set(I.all_types()) - set(I.TYPES), set(S1.BUILDERS))

    def test_wrap_and_slices(self):
        lines = S1.wrap("Mission complete. Zero casualties. Zero damage to client property.", "type", 30, 400)
        self.assertGreater(len(lines), 2)
        self.assertEqual(" ".join(lines), "Mission complete. Zero casualties. Zero damage to client property.")
        kind, a, b = S1.sub(("t", 0.0, 3.0), 1, 3)
        self.assertEqual(kind, "t")
        self.assertAlmostEqual(a, 1.0)
        self.assertAlmostEqual(b, 2.0)
        self.assertIs(S1.sub(False, 0, 2), False)

    def test_builds_and_text_is_data_driven(self):
        with tempfile.TemporaryDirectory() as d:
            bg = Path(d) / "bg.png"
            Image.fromarray((np.random.default_rng(2).random((90, 160, 3)) * 255).astype("uint8")).save(bg)
            for spec in (dict(type="incident_file", rows=[dict(item="Broken gate", cause="temper", cost="10")], final="Paid."),
                         dict(type="mission_board", variant="empty"),
                         dict(type="signature_compare"), dict(type="mission_report", variant="signed_doodle")):
                I._DOC_CACHE.clear()
                D = I.build_doc(dict(spec, beat_text="x", beat_start=0.0, beat_end=5.0), bg)
                self.assertGreater(D.canvas.shape[0], 1000)
            fr = I.render_still(dict(type="mission_board", ticked=3, beat_text="x", beat_start=0.0, beat_end=5.0), bg, 9.0, Path(d) / "o.png", p=0.5)
            self.assertTrue((Path(d) / "o.png").exists())

    def test_old_signature_is_the_episode_1_one(self):
        src = (ROOT / "copycat/inserts.py").read_text()
        for pts in ("[(1010, 984), (1000, 1070), (966, 1190), (924, 1308)]", "[(584, 1030), (566, 1100), (540, 1190), (512, 1276)]"):
            self.assertIn(pts, src)
            self.assertIn(pts, str(S1._letter_sig()))


class Holds(unittest.TestCase):
    def test_resolve_holds(self):
        script = dict(chapters=[dict(beats=[dict(id="b1", insert=dict(type="ledger", hold="k", reveal=["r1", "r2"])),
                                            dict(id="b2"),
                                            dict(id="b3", insert=dict(type="ledger", hold="k", reveal=["r3"])),
                                            dict(id="b4", insert=dict(type="ledger", hold="k", reveal="rest"))])])
        out = I.resolve_holds(script)
        self.assertEqual(out["b1"]["present"], [])
        self.assertEqual(out["b3"]["present"], ["r1", "r2"])
        self.assertEqual(out["b3"]["animate"], ["r3"])
        self.assertEqual(out["b4"]["present"], ["r1", "r2", "r3"])
        self.assertTrue(out["b4"]["hold_rest"])
        self.assertNotIn("b2", out)


class Vocabulary(unittest.TestCase):
    def test_whitelists_of_ep2_to_4_load_with_their_keys(self):
        for ep in ("02", "03", "04"):
            pid = f"naruto-whatif-ep{ep}"
            labels = {k: v for k, v in json.loads((ROOT / "copycat/projects" / pid / "whitelist.json").read_text()).items() if not k.startswith("_")}
            script = json.loads((ROOT / "copycat/projects" / pid / "script.json").read_text())
            cfg = json.loads((ROOT / "copycat/projects" / pid / "shot_overrides.json").read_text())["_config"]["wl"]
            wl = W.WL(ROOT / "copycat/projects" / pid, cfg, script)
            used = {k for L in labels.values() for k in L["who"]}
            self.assertTrue(used - {"team7", "villagers", "naruto_clones"} <= wl.char_keys, used - wl.char_keys)
            for sp in script["cast"]:
                if sp not in ("NARRATOR", "CLONE"):
                    self.assertIn(sp, wl.speaker_who, sp)

    def test_starter_configs_dry_run(self):
        for ep in ("02", "03", "04"):
            edit, rep = mapper.run(f"naruto-whatif-ep{ep}", False, write=False)
            self.assertEqual(rep["non_whitelisted_stills"], [])
            self.assertEqual(rep["repetition_violations"], 0)
            self.assertEqual(rep["repeated_asset_crop"], 0)
            self.assertAlmostEqual(edit["shots"][-1]["end"], edit["duration"], places=2)

    def test_speaker_fallback_and_mist(self):
        labels = {"a": dict(scene="hokage_office", time="interior", who=["anbu"], expression="neutral", scale="medium", ok_as_night=False, w=1920, h=1080),
                  "b": dict(scene="hokage_office", time="interior", who=[], expression="neutral", scale="wide", ok_as_night=False, w=1920, h=1080)}
        with tempfile.TemporaryDirectory() as d:
            proj = Path(d)
            (proj / "whitelist.json").write_text(json.dumps(labels))
            script = dict(chapters=[dict(id="c", beats=[dict(id="b1")])])
            cfg = dict(chapters={"c": dict(scenes=["hokage_office"], time="mist", who=["naruto"])},
                       speaker_fallback={"DANZO": dict(who=["anbu"], scenes=["hokage_office"], min_frames=3, allow_empty=True)})
            wl = W.WL(proj, cfg, script)
            self.assertIsNotNone(wl.fallback_for("DANZO"))
            self.assertIsNone(wl.fallback_for("NARUTO"))
            slot = dict(beat=dict(speaker="DANZO", text="A form is paper.", emotion="flat"), chapter="c", beat_id="b1", spec=dict(subjects=[], shot=None, mood=None),
                        first=True)
            a = dict(id="a", wl=labels["a"], quality=0.5, width=1920, height=1080)
            b = dict(id="b", wl=labels["b"], quality=0.5, width=1920, height=1080)
            self.assertGreater(wl.score(slot, a)[0], 4.0)                 # the mask stands in for Danzo
            self.assertGreater(wl.score(dict(slot, _wl=None), b)[0], 4.0)  # and so does the empty office
            self.assertEqual(wl.grade_for(slot, a), "mist")
            self.assertEqual(W.bg_scenes("ledger")[1], "day")

    def test_mist_grade(self):
        im = (np.random.default_rng(3).random((48, 64, 3)) * 255).astype("uint8")
        out = GRADES["mist"](im)
        self.assertEqual(out.shape, im.shape)
        self.assertLess(out.astype(float).std(axis=2).mean(), im.astype(float).std(axis=2).mean())      # desaturated
        self.assertEqual(grade_vignette(64, 48, "mist").shape, (48, 64, 3))

    def test_clone_grid_derives_faces_from_any_whitelist(self):
        labels = json.loads((ROOT / "copycat/projects/naruto-whatif-ep03/whitelist.json").read_text())
        labels = {k: v for k, v in labels.items() if not k.startswith("_")}
        v = cg.derive_variants(labels)
        self.assertGreater(len([x for x in v if x["kind"] == "face"]), 3)
        pl = cg.plan(4, "grid", "day", labels, lambda L: True, random.Random(1), {}, variants=v)
        self.assertEqual(len(pl["panels"]), 4)
        self.assertTrue(all(p["asset_id"] in labels for p in pl["panels"]))


class Packaging(unittest.TestCase):
    def test_derived_packaging_and_shorts_plan(self):
        p = packaging.build("naruto-whatif-ep04")
        self.assertTrue(all(len(t) <= packaging.MAX_TITLE for t in p["titles"]))
        self.assertTrue(p["timestamps_filled"])
        self.assertTrue(any("The Signature" in c["title"] or "SIGNATURE" in c["title"].upper() for c in p["chapters"]))
        spec = shorts.auto_spec("naruto-whatif-ep03")
        timing = json.loads((ROOT / "build/copycat/naruto-whatif-ep03/audio/timing.json").read_text())
        self.assertGreaterEqual(len(spec["shorts"]), 2)
        for sh in spec["shorts"]:
            self.assertTrue(40.0 <= shorts.plan_short(timing["beats"], sh)["total"] <= 58.0)


if __name__ == "__main__":
    unittest.main()
