"""psychology-shorts mode: config validation, orbit schedule, narration fit logic, package writers, workflow wiring.
Runs without Piper or Chromium so it can gate every push in the Tests workflow."""
import json, math, sys, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from pipeline.psych import load_short, validate_short, ShortError, orbit_schedule, footsteps, make_srt, srt_time, MAX_NARRATION_WORDS  # noqa: E402
from pipeline import audio  # noqa: E402

EP = "overthinking-vs-action"


class Config(unittest.TestCase):
    def setUp(self):
        self.ep = load_short(EP)

    def test_loads_and_is_isolated_from_documentary_schema(self):
        self.assertEqual(self.ep["mode"], "psychology-shorts")
        self.assertFalse((ROOT / "episodes" / EP).exists(), "psychology shorts must not live under episodes/ (documentary schema)")

    def test_every_short_validates(self):
        for d in sorted((ROOT / "shorts" / "psychology").iterdir()):
            if (d / "episode.json").exists():
                load_short(d.name)

    def test_narration_budget(self):
        words = sum(len(l["text"].split()) for l in self.ep["narration"])
        self.assertLessEqual(words, MAX_NARRATION_WORDS)
        for l in self.ep["narration"]:
            self.assertLessEqual(len(l["text"].split()), 16, "one idea per line keeps subtitles short")

    def test_captions_short_ordered_and_inside_runtime(self):
        tgt = self.ep["runtime"]["target_seconds"]; prev = -1
        for c in self.ep["captions"]:
            self.assertLessEqual(len(c["text"]), 44); self.assertGreaterEqual(c["at"], prev); self.assertLess(c["at"], c["until"]); self.assertLessEqual(c["until"], tgt + 0.5)
            prev = c["until"]

    def test_hook_variants_three_with_one_selected(self):
        hv = self.ep["hook_variants"]
        self.assertEqual(len(hv), 3); self.assertEqual(sum(1 for h in hv if h["selected"]), 1)
        self.assertEqual(self.ep["hook"]["lines"], ["YOU'RE NOT", "MOVING."])

    def test_metadata_fields_for_future_episodes(self):
        for k in ("topic", "core_message", "hook_variants", "visual_metaphor", "runtime", "narration_style", "caption_density", "loop_design", "output", "publication", "performance"):
            self.assertIn(k, self.ep)
        for k in ("views", "average_watch_seconds", "completion_rate", "shares", "saves", "comments", "follows_gained"):
            self.assertIn(k, self.ep["performance"]); self.assertIsNone(self.ep["performance"][k], "performance data must never be fabricated")
        self.assertIsNone(self.ep["publication"]["date"])

    def test_validation_rejects_bad_configs(self):
        bad = json.loads(json.dumps(self.ep)); bad["narration"].append({"at": 19, "text": " ".join(["word"] * 40)})
        with self.assertRaises(ShortError): validate_short(bad)
        bad = json.loads(json.dumps(self.ep)); bad["sfx"][0]["name"] = "laser"
        with self.assertRaises(ShortError): validate_short(bad)
        bad = json.loads(json.dumps(self.ep)); bad["performance"]["views"] = "lots"
        with self.assertRaises(ShortError): validate_short(bad)
        bad = json.loads(json.dumps(self.ep)); bad["metaphor"] = "missing-story"
        with self.assertRaises(ShortError): validate_short(bad)

    def test_story_and_renderer_files_exist(self):
        js = (ROOT / "renderer" / "psych" / "stories" / f"{self.ep['metaphor']}.js").read_text()
        self.assertIn(f"registerStory('{self.ep['metaphor']}'", js)
        for f in ("renderer/psych/index.html", "renderer/psych/engine.js", "pipeline/psych_render.mjs"):
            self.assertTrue((ROOT / f).exists(), f)

    def test_publishing_package_complete(self):
        pub = self.ep["publishing"]
        for k in ("instagram", "tiktok", "youtube_title", "youtube_description", "hashtags"):
            self.assertTrue(pub[k])
        self.assertLessEqual(len(pub["youtube_title"]), 100)
        self.assertLessEqual(len(pub["hashtags"]), 8)
        for bad in ("guaranteed", "viral", "studies show", "scientists"):
            self.assertNotIn(bad, (pub["instagram"] + pub["tiktok"] + pub["youtube_description"]).lower())


class Orbit(unittest.TestCase):
    def setUp(self):
        self.ep = load_short(EP); self.o = orbit_schedule(self.ep["animation"], 20.8)

    def test_monotonic_and_frozen_during_study_pauses(self):
        a = self.o["angles"]; hz = self.o["hz"]
        self.assertTrue(all(b >= x - 1e-9 for x, b in zip(a, a[1:])))
        for p0, p1 in self.ep["animation"]["study_pauses"]:
            i0, i1 = int((p0 + 0.3) * hz), int((p1 - 0.3) * hz)
            self.assertLess(a[i1] - a[i0], 0.02, "figure must stand still while studying")

    def test_stops_at_left_point_and_holds(self):
        a = self.o["angles"]; hz = self.o["hz"]; stop = self.ep["animation"]["stop_time"]
        d = (self.o["stop_angle"] - math.pi) % (2 * math.pi)
        self.assertLess(min(d, 2 * math.pi - d), 1e-3, "must stop at the left-hand point of the ring")
        self.assertEqual(a[int(stop * hz) + 2], a[-1])

    def test_footsteps_only_inside_windows(self):
        ev = footsteps(self.ep, self.o); lo, hi = self.ep["footsteps"]["escalation_window"]; an = self.ep["animation"]
        self.assertGreater(len(ev), 10)
        for t, name, g in ev:
            self.assertEqual(name, "step")
            self.assertTrue(lo <= t <= hi or an["b_enter"] <= t <= an["b_arrive"] or an["a_walk"][0] <= t <= an["a_walk"][1], t)


class Episode02Door(unittest.TestCase):
    """You Don't Need More Time: one character, one door, one approach, one touch, one opening, under 18 s."""
    def setUp(self):
        self.ep = load_short("you-dont-need-more-time"); self.a = self.ep["animation"]

    def test_runtime_at_most_18s_and_end_card_inside(self):
        self.assertLessEqual(self.ep["runtime"]["target_seconds"], 18.0); self.assertLessEqual(self.ep["runtime"]["range"][1], 18)
        self.assertLess(self.ep["end_card"]["at"], self.ep["runtime"]["target_seconds"]); self.assertEqual(self.ep["end_card"]["title"], "THE HIDDEN PATTERN")

    def test_single_straight_approach_few_slow_steps(self):
        from pipeline.psych import walk_schedule
        w = self.a["walk"]; self.assertTrue(2 <= w["steps"] <= 5, "a few steps, not a walk cycle loop")
        self.assertGreaterEqual((w["end"] - w["start"]) / w["steps"], 0.75, "a slow approach: at least 0.75 s per step")
        ws = walk_schedule(self.a, self.ep["runtime"]["target_seconds"])
        self.assertLess(ws["peak_speed_px_s"], 120, "deliberate pace")
        xs = ws["x"]; self.assertTrue(all(b >= a - 1e-6 for a, b in zip(xs, xs[1:])), "straight line toward the door, never backwards")
        self.assertLess(ws["start_x"], self.a["door"]["x"]); self.assertLess(w["end_x"], self.a["door"]["x"])
        # one smooth motion: the body never stops inside the walk window
        hz = ws["hz"]; v = [(b - a) * hz for a, b in zip(xs, xs[1:])]
        inner = v[int((w["start"] + 0.5) * hz):int((w["end"] - 0.5) * hz)]
        self.assertGreater(min(inner), 15, "no lurching: body keeps moving between the start and the stop")
        self.assertEqual(len(ws["footfalls"]), w["steps"] + 1)
        self.assertNotIn("orbit", self.a, "no circling")

    def test_sequence_order_hesitate_walk_touch_open_endcard(self):
        a = self.a; h = a["hesitation"]; w = a["walk"]
        self.assertLess(h["lean_at"], h["tilt_at"]); self.assertLess(h["tilt_at"] + 1.2, w["start"])
        self.assertLessEqual(w["end"], a["reach"][0] + 0.2); self.assertLess(a["reach"][1], a["open"][0])
        self.assertLess(a["open"][1], self.ep["end_card"]["at"])
        self.assertLess(self.ep["narration"][-1]["at"], a["open"][1], "the last line lands on the reveal, not the end card")
        self.assertLessEqual(a["door"]["h"] / (a["figure_scale"] * 396), 3.6, "door reads as large, not absurd")

    def test_budget_one_touch_one_reveal_sound(self):
        names = [s["name"] for s in self.ep["sfx"]]
        self.assertLessEqual(len(names), 3); self.assertNotIn("rise", names); self.assertNotIn("thump", names)
        self.assertEqual(self.ep["metaphor"], "door"); self.assertTrue((ROOT / "renderer" / "psych" / "stories" / "door.js").exists())
        self.assertEqual(len(self.ep["narration"]), 4); self.assertLessEqual(sum(len(l["text"].split()) for l in self.ep["narration"]), 30)

    def test_brand_palette(self):
        self.assertEqual(self.ep["palette"]["bg"].lower(), "#080808"); self.assertEqual(self.ep["palette"]["gold"].lower(), "#d8a84e"); self.assertEqual(self.ep["palette"]["white"].lower(), "#f3efe6")


class Package(unittest.TestCase):
    def test_srt_format(self):
        self.assertEqual(srt_time(61.5), "00:01:01,500")
        s = make_srt([{"at": 0.9, "end": 2.8, "text": "Hello."}, {"at": 5.4, "end": 8.8, "text": "Second line."}])
        self.assertIn("1\n00:00:00,900 --> 00:00:02,800\nHello.\n", s); self.assertIn("\n2\n", s)

    def test_rise_sfx_is_clean(self):
        import numpy as np
        x = audio.sfx("rise", 1); self.assertTrue(np.isfinite(x).all()); self.assertLessEqual(float(np.abs(x).max()), 1.0)


class Workflow(unittest.TestCase):
    def test_workflow_isolated_and_uploads_artifact(self):
        wf = (ROOT / ".github" / "workflows" / "render-psychology-short.yml").read_text()
        self.assertIn("pipeline.psych", wf); self.assertIn("upload-artifact", wf); self.assertIn("workflow_dispatch", wf)
        self.assertNotIn("pipeline.build", wf, "the shorts workflow must not touch the documentary build")
        for other in ("render-episode.yml", "render-series.yml", "tests.yml"):
            self.assertNotIn("psych", (ROOT / ".github" / "workflows" / other).read_text())


if __name__ == "__main__":
    unittest.main()
