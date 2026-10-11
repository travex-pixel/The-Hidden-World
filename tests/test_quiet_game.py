"""The Quiet Game (long-form, 16:9): story invariants, staging rules, engine upgrades and delivered files."""
import json, re, subprocess, sys, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from pipeline.schema import load_episode  # noqa: E402
from pipeline import captions  # noqa: E402

EP = "qg01-the-favour"
WS = (ROOT / "renderer" / "widescreen.js").read_text()
DST = ROOT / "series" / "the-quiet-game" / "the-favour"


def ep():
    return load_episode(EP)


class StoryInvariants(unittest.TestCase):
    def test_generator_is_source_of_truth(self):
        """episode.json must be exactly what make_the_favour.py writes (no hand edits that drift)."""
        sys.path.insert(0, str(ROOT / "series" / "the-quiet-game"))
        import importlib
        mod = importlib.import_module("make_the_favour")
        on_disk = json.loads((ROOT / "episodes" / EP / "episode.json").read_text())
        self.assertEqual(json.loads(json.dumps(mod.EPISODE)), on_disk)

    def test_long_form_widescreen(self):
        e = ep()
        self.assertEqual(e["format"], "landscape")
        lo, hi = e["target_duration_seconds"]
        self.assertTrue(420 <= lo and hi <= 570, "7 to 9.5 minutes")

    def test_company_figures_are_internally_consistent(self):
        f = ep()["figures"]
        others = f["others"]
        self.assertAlmostEqual(sum(w for _, w in others.values()), 1.0, places=6)
        excl = sum(r * w for r, w in others.values())
        self.assertAlmostEqual(excl, f["with_filter"], delta=0.05)
        incl = (1 - f["northfield_share"]) * excl + f["northfield_share"] * f["northfield"]
        self.assertAlmostEqual(incl, f["without_filter"], delta=0.05)
        self.assertGreater(f["with_filter"], f["target"]); self.assertLess(f["without_filter"], f["target"])

    def test_numbers_on_screen_match_figures(self):
        e = ep(); f = e["figures"]; text = json.dumps(e["scenes"], ensure_ascii=False)
        dash = next(s for s in e["scenes"] if s["id"] == "c12_dashboard")["shot"]["ui"]
        self.assertEqual((dash["with_filter"], dash["without_filter"], dash["target"]), (f["with_filter"], f["without_filter"], f["target"]))
        depots = dict(dash["depots"])
        self.assertEqual(depots["Northfield"], f["northfield"])
        for k, (rate, _) in f["others"].items():
            self.assertEqual(depots[k], rate)
        for n in ("92.6", "93.4"):
            self.assertIn(n, text)

    def test_timeline_of_the_week(self):
        chips = [s["shot"].get("chip") for s in ep()["scenes"] if s["shot"].get("chip")]
        order = ["THURSDAY · 16:42", "MONDAY · 08:52", "MONDAY · 09:03", "09:07", "09:58", "TUESDAY · 14:20", "WEDNESDAY · 09:15",
                 "THURSDAY · 09:30", "THURSDAY · 16:40", "THURSDAY · 21:14", "FRIDAY · 08:12", "FRIDAY · 10:00", "FRIDAY · 16:30"]
        self.assertEqual([c for c in chips if c in order], order)

    def test_ambiguity_and_balance_are_explicit(self):
        lines = " ".join(l["text"] for s in ep()["scenes"] for l in s.get("lines", []))
        self.assertIn("never found out for certain", lines)
        self.assertIn("Most favours are just kindness", lines)
        self.assertIn("tendency, not a law", lines)          # dissonance replication caveat is spoken
        self.assertIn("I knew I could trust you.", lines)
        self.assertIn("He only needed everyone to distrust each other.", lines)

    def test_psychology_scenes_cite_sources(self):
        e = ep(); claims = {c["id"]: c for c in e["claims"]}
        for s in e["scenes"]:
            if s["scene"] == "ws_explainer" and s["shot"]["ex"]["kind"] in ("ledger", "regan", "dissonance", "plural", "foot"):
                self.assertTrue(s["claims"], s["id"])
                for c in s["claims"]:
                    self.assertTrue(claims[c]["sources"], f"{s['id']}: claim {c} has no source")

    def test_chapters_meet_youtube_rules(self):
        e = ep(); chs = [s for s in e["scenes"] if s.get("chapter")]
        self.assertGreaterEqual(len(chs), 3)
        self.assertTrue(e["scenes"][0].get("chapter"), "first scene must open a chapter (0:00)")


class Staging(unittest.TestCase):
    def test_every_ws_scene_type_is_registered(self):
        for s in ep()["scenes"]:
            self.assertRegex(WS, rf"\b{s['scene']}\s*[:(]", s["scene"])

    def test_expressions_and_arm_poses_exist(self):
        rig = (ROOT / "renderer" / "cast.js").read_text()
        exprs = set(re.findall(r"^\s{4}(\w+):\s+\{ smile", rig, re.M))
        arm_block = WS[WS.index("const ARM = {"):WS.index("};", WS.index("const ARM = {"))]
        poses = set(re.findall(r"(\w+): \{ e:", arm_block))
        e = ep(); actors = [a for s in e["scenes"] for a in s["shot"].get("actors", [])] + e["thumbnail"]["actors"]
        for a in actors:
            for k in a.get("acting", []):
                if "expr" in k:
                    self.assertIn(k["expr"], exprs, a["who"])
            for k in a.get("arms", []):
                for side in ("l", "r"):
                    if side in k:
                        self.assertIn(k[side], poses, f"{a['who']}: arm pose {k[side]}")

    def test_line_relative_times_point_at_real_lines(self):
        """A cue that names a missing line silently fires at t=0, so every reference must exist."""
        for s in ep()["scenes"]:
            n = len(s.get("lines", []))
            refs = [int(a or b) for a, b in re.findall(r'"L(\d+)[+-][\d.]+"|"L(\d+)"', json.dumps(s["shot"]))]
            for a in s["shot"].get("actors", []):
                for k in a.get("acting", []) + a.get("arms", []) + a.get("glasses_off", []):
                    if "line" in k:
                        refs.append(k["line"])
            for r in refs:
                self.assertLess(r, n, f"{s['id']} references line {r} but has {n} lines")

    def test_captions_never_cover_a_face(self):
        # widescreen caption band starts around y=925 (two lines centred on 978)
        for s in ep()["scenes"]:
            if s["scene"] != "ws_stage" or s.get("caption_mode") in ("card", "none") or not s.get("lines"):
                continue
            for a in s["shot"].get("actors", []):
                if a["view"] != "front":
                    continue
                for y in [a["y"]] + [k["y"] for k in a.get("acting", []) if "y" in k]:
                    self.assertLess(y + 160 * a["scale"], 925, f"{s['id']}: {a['who']}'s chin would sit under the captions")

    def test_cast_is_distinct(self):
        cast = [json.loads((ROOT / "characters" / f"{c}.json").read_text()) for c in ("daniel", "graham", "leah", "ruth")]
        others = [json.loads(p.read_text()) for p in (ROOT / "characters").glob("*.json") if p.stem not in ("daniel", "graham", "leah", "ruth", "narrator")]
        allc = cast + others
        self.assertEqual(len({c["signature"]["colour"] for c in allc}), len(allc), "signature colours must be unique")
        self.assertEqual(len({(c["voice"]["model"], c["voice"].get("speaker")) for c in allc}), len(allc), "voices must be unique")
        self.assertEqual(len({c["look"]["hair_style"] for c in cast}), 4, "each new lead has a distinct silhouette")
        for c in cast:
            self.assertIn(c["look"]["hair_style"], (ROOT / "renderer" / "cast.js").read_text())
            self.assertIn(c["look"]["outfit"]["style"], (ROOT / "renderer" / "cast.js").read_text())

    def test_dialogue_readable(self):
        for s in ep()["scenes"]:
            for l in s.get("lines", []):
                self.assertLessEqual(len(l["text"]), 90, s["id"])


class EngineUpgrades(unittest.TestCase):
    def test_shorts_defaults_unchanged(self):
        eng = (ROOT / "renderer" / "engine.js").read_text()
        self.assertIn("+Q.get('w') || 1080, H = +Q.get('h') || 1920", eng)
        from pipeline.build import QUALITY
        self.assertEqual((QUALITY["final"]["width"], QUALITY["final"]["height"], QUALITY["final"]["fps"]), (1080, 1920, 30))

    def test_landscape_preset(self):
        from pipeline.build import QUALITY_LANDSCAPE
        self.assertEqual((QUALITY_LANDSCAPE["final"]["width"], QUALITY_LANDSCAPE["final"]["height"], QUALITY_LANDSCAPE["final"]["fps"]), (1920, 1080, 30))

    def test_parallel_renderer_concats_without_reencode(self):
        js = (ROOT / "pipeline" / "render.mjs").read_text()
        self.assertIn("--workers", js); self.assertIn("'-f', 'concat'", js); self.assertIn("'-c', 'copy'", js)

    def test_caption_writers(self):
        e = {"scenes": [{"id": "a", "narration": "Hello there."}, {"id": "b", "chapter": "Two", "lines": []}]}
        tl = [{"id": "a", "start": 0, "end": 3, "narration_at": 0.25, "narration_end": 2.0},
              {"id": "b", "start": 3, "end": 7, "lines": [{"who": "daniel", "text": "One line of dialogue that is long enough to wrap onto a second row.", "start": 3.2, "end": 6.5}]}]
        e["scenes"][0]["chapter"] = "One"
        cs = captions.cues(e, tl)
        self.assertEqual(len(cs), 2)
        srt = captions.srt(cs, {"daniel": "Daniel"})
        self.assertIn("00:00:00,250 --> 00:00:02,000", srt); self.assertIn("Daniel: One line", srt)
        self.assertTrue(all(len(r) <= 42 for r in srt.splitlines()))
        self.assertTrue(captions.vtt(cs, {"daniel": "Daniel"}).startswith("WEBVTT"))
        self.assertEqual(captions.chapters(e, tl), [(0.0, "One"), (3, "Two")])
        self.assertEqual(captions.clock(546), "9:06")


class Delivered(unittest.TestCase):
    """Runs against the packaged deliverables when they are present (they are produced by package.py)."""
    def test_text_deliverables(self):
        for f in ("title-options.md", "references.md"):
            self.assertTrue((DST / f).exists(), f)
        if not (DST / "description.md").exists():
            self.skipTest("not packaged yet")
        for f in ("captions.srt", "captions.vtt", "transcript.txt", "chapters.txt", "description.md", "promo.md", "thumbnail.png", "delivery/index.html"):
            self.assertTrue((DST / f).exists(), f)
        chap = (DST / "chapters.txt").read_text().splitlines()
        self.assertTrue(chap[0].startswith("0:00 "))
        self.assertIn(chap[1], (DST / "description.md").read_text())

    def test_thumbnail(self):
        p = DST / "thumbnail.png"
        if not p.exists():
            self.skipTest("not packaged yet")
        from PIL import Image
        self.assertEqual(Image.open(p).size, (1280, 720))
        self.assertLess(p.stat().st_size, 2 * 1024 * 1024, "YouTube thumbnails must be under 2 MB")

    def test_delivery_page_paths_resolve(self):
        page = DST / "delivery" / "index.html"
        if not page.exists():
            self.skipTest("not packaged yet")
        html = page.read_text()
        data = json.loads(re.search(r"const DATA = (\{.*?\});\n", html, re.S).group(1))
        self.assertEqual(data["mode"], "local")
        for key in ("src", "vtt", "poster"):
            target = (page.parent / data[key]).resolve()
            if key == "src" and not target.exists():
                continue   # the MP4 is git-ignored; the page shows a clear "missing" status instead
            self.assertTrue(target.exists(), f"{key} -> {target}")
        self.assertIn("addEventListener('error'", html)

    def test_rendered_master_if_present(self):
        mp4 = DST / "final.mp4"
        if not mp4.exists():
            self.skipTest("final.mp4 not present (git-ignored)")
        p = json.loads(subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(mp4)], capture_output=True, text=True).stdout)
        v = next(s for s in p["streams"] if s["codec_type"] == "video"); a = [s for s in p["streams"] if s["codec_type"] == "audio"]
        self.assertEqual((v["width"], v["height"], v["codec_name"], v["r_frame_rate"]), (1920, 1080, "h264", "30/1"))
        self.assertEqual(a[0]["codec_name"], "aac")
        self.assertTrue(420 <= float(p["format"]["duration"]) <= 560)


if __name__ == "__main__":
    unittest.main()
