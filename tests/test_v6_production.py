"""Production fixes from the v6 review of Case Files 83-85 (19 Oct 2026): the loop end scene passes the characters-act
rule on its keyed camera; the disk guard reclaims only finished episodes' intermediates and never a kept one."""
import json, sys, tempfile, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "series" / "true-crime" / "tools"))
from pipeline import shot_manifest  # noqa: E402
import disk_guard  # noqa: E402


class CharactersAct(unittest.TestCase):
    still = {"figures": [{"id": "a", "actions": [], "walk": False}], "camera": {"keys": [{"at": 0}, {"at": 0.1}]}}

    def test_pose_key_or_walk_counts_as_action(self):
        self.assertTrue(shot_manifest.characters_act({"figures": [{"id": "a", "actions": [{"pose": "point"}]}], "camera": {}}))
        self.assertTrue(shot_manifest.characters_act({"figures": [{"id": "a", "actions": [], "walk": True}], "camera": {}}))
        self.assertTrue(shot_manifest.characters_act({"figures": [], "camera": {}}))   # no figures: nothing to act

    def test_still_figure_fails_except_on_the_v6_loop_end_scene(self):
        self.assertFalse(shot_manifest.characters_act(self.still))                       # mid-video: a slideshow moment
        self.assertTrue(shot_manifest.characters_act(self.still, loop_end=True))         # the keyed camera is the action
        pushpull = dict(self.still, camera={"from": {"z": 1}, "to": {"z": 1.1}})
        self.assertFalse(shot_manifest.characters_act(pushpull, loop_end=True))          # only a keyed (loop) camera counts


class DiskGuard(unittest.TestCase):
    def test_reclaims_finished_intermediates_only_and_respects_keep(self):
        with tempfile.TemporaryDirectory() as td:
            out = Path(td) / "out"
            for eid in ("done", "kept", "unfinished"):
                (out / eid / "stems").mkdir(parents=True); (out / eid / "stems" / "a.wav").write_bytes(b"x" * 1000)
                (out / eid / "video_silent.mp4").write_bytes(b"y" * 500); (out / eid / "plan.json").write_text("{}")
            would = disk_guard.reclaim(out, {"done", "kept"}, {"kept"}, dry_run=True)
            self.assertEqual(would, 1500); self.assertTrue((out / "done" / "stems").exists())
            freed = disk_guard.reclaim(out, {"done", "kept"}, {"kept"})
            self.assertEqual(freed, 1500)
            self.assertFalse((out / "done" / "stems").exists()); self.assertFalse((out / "done" / "video_silent.mp4").exists())
            self.assertTrue((out / "done" / "plan.json").exists())                       # the plan is never touched
            self.assertTrue((out / "kept" / "stems").exists()); self.assertTrue((out / "unfinished" / "stems").exists())

    def test_finished_means_the_output_mp4_exists(self):
        with tempfile.TemporaryDirectory() as td:
            s = Path(td); (s / "output").mkdir()
            (s / "series.json").write_text(json.dumps({"episodes": [{"id": "a", "file": "a.mp4"}, {"id": "b", "file": "b.mp4"}]}))
            (s / "output" / "a.mp4").write_bytes(b"m")
            self.assertEqual(disk_guard.finished_ids(s), {"a"})


if __name__ == "__main__":
    unittest.main()
