"""Tests for THE HIDDEN WORLD: Case Files (true-crime episodes) and the engine features they added:
per-episode narrator voice, caption emphasis, documentary SFX, loudness normalisation, map data, claims/sources discipline."""
import json, re, subprocess, sys, tempfile, unittest, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from pipeline.schema import load_episode  # noqa: E402
from pipeline import audio  # noqa: E402

SERIES = ROOT / "series" / "true-crime"
CFG = json.loads((SERIES / "series.json").read_text())
EPS = [e["id"] for e in CFG["episodes"]]


class CaseFileEpisodes(unittest.TestCase):
    def test_episode_data_is_generated_from_the_source_script(self):
        # episode.json must match what make_episodes.py produces (no hand edits drifting from the reviewed script)
        sys.path.insert(0, str(SERIES))
        import make_episodes
        for build in (make_episodes.chamberlain, make_episodes.unabomber):
            ep = build()
            on_disk = json.loads((ROOT / "episodes" / ep["id"] / "episode.json").read_text())
            self.assertEqual(on_disk, json.loads(json.dumps(ep)), f"{ep['id']}: run python series/true-crime/make_episodes.py")

    def test_validates_and_every_scene_is_sourced(self):
        for eid in EPS:
            ep = load_episode(eid)
            self.assertEqual(ep["template"], "true-crime")
            claims = {c["id"]: c for c in ep["claims"]}
            for s in ep["scenes"]:
                self.assertTrue(s["claims"], f"{eid}/{s['id']}: narrated scene cites no claim")
                for line in s["lines"]:
                    self.assertEqual(line["who"], "narrator")
                    self.assertLessEqual(len(line["text"]), 90)
            for c in claims.values():
                self.assertEqual(c["type"], "established", f"{eid}/{c['id']}: only established facts are narrated")
                self.assertGreaterEqual(len(c["sources"]), 2, f"{eid}/{c['id']}: needs two independent sources")
            for src in ep["sources"]:
                self.assertTrue(src["url"].startswith("https://"))

    def test_emphasis_words_exist_in_the_scene_narration(self):
        key = lambda w: re.sub(r"^'+|'+$", "", re.sub(r"[^a-z0-9'-]", "", w.lower()))
        for eid in EPS:
            for s in load_episode(eid)["scenes"]:
                words = {key(w) for line in s["lines"] for w in line["text"].split()}
                for e in s.get("emphasis", []):
                    self.assertIn(key(e), words, f"{eid}/{s['id']}: emphasis '{e}' is not in the narration")

    def test_no_disputed_or_avoided_wording_on_screen_or_in_narration(self):
        # wording the research dossiers flagged as unverified or inaccurate
        banned = {
            "tc01-chamberlain-jacket": ["dingo ate my baby", "declared innocent", "innocent", "faked", "cardigan", "David Brett"],
            "tc02-unabomber-words": ["typewriter matched", "original manifesto", "suicide", "never seen", "23 injured", "24 injured"],
        }
        for eid, words in banned.items():
            ep = load_episode(eid)
            text = " ".join(l["text"] for s in ep["scenes"] for l in s["lines"]).lower()
            js = (ROOT / "renderer" / "scenes" / f"{eid}.js").read_text()
            js = re.sub(r"/\*.*?\*/|//[^\n]*", "", js, flags=re.S).lower()   # comments are not on screen
            for w in words:
                self.assertFalse(w.lower() in text, f"{eid}: narration uses flagged wording '{w}'")
                self.assertFalse(w.lower() in js, f"{eid}: on-screen text uses flagged wording '{w}'")

    def test_reconstructions_are_labelled(self):
        for eid in EPS:
            js = (ROOT / "renderer" / "scenes" / f"{eid}.js").read_text()
            # every drawn reconstruction of a real place/object is tagged; pure text cards and illegible generic paper are not
            self.assertGreaterEqual(js.count("D.tag("), 5, f"{eid}: illustrated scenes must carry an ILLUSTRATION tag")
            self.assertNotIn("Washington Post</text>", js)   # no real masthead is drawn

    def test_runtime_within_shorts_window(self):
        lo, hi = CFG["duration_limits_s"]
        for eid in EPS:
            a, b = load_episode(eid)["target_duration_seconds"]
            self.assertTrue(lo <= a and b <= hi and hi <= 180)

    def test_maps_use_real_coordinates(self):
        aus = json.loads((SERIES / "geo" / "australia.json").read_text())
        usa = json.loads((SERIES / "geo" / "usa.json").read_text())
        for g, (x0, y0, x1, y1) in ((aus, (112, -45, 155, -9)), (usa, (-126, 23, -65, 51))):
            pts = [p for line in g["lines"] + g.get("borders", []) for p in line]
            self.assertGreater(len(pts), 200)
            self.assertTrue(all(x0 <= x <= x1 and y0 <= y <= y1 for x, y in pts))
        # Uluru (131.04E, 25.34S) sits inside the Northern Territory (129E-138E, south border 26S)
        self.assertTrue(129 < 131.0369 < 138 and -26 < -25.3444)
        ep = load_episode("tc01-chamberlain-jacket")
        pin = ep["scenes"][1]["shot"]["map"]["pins"][0]["ll"]
        self.assertAlmostEqual(pin[0], 131.0369, 3); self.assertAlmostEqual(pin[1], -25.3444, 3)


class EngineAdditions(unittest.TestCase):
    def test_new_sfx_finite_and_bounded(self):
        for n in ("typing", "wind", "gavel", "hit"):
            x = audio.sfx(n, 1)
            self.assertTrue(np.isfinite(x).all()); self.assertGreater(len(x), 1000); self.assertLessEqual(float(np.abs(x).max()), 0.951)

    def test_loudnorm_reaches_target(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "x.wav"; t = np.arange(audio.SR * 6) / audio.SR
            x = (0.05 * np.sin(2 * np.pi * 220 * t) * (1 + 0.5 * np.sin(2 * np.pi * 0.5 * t))).astype(np.float32)
            audio.write_wav(p, x)
            audio.loudnorm(p, -14.0)
            r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(p), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
            i = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", r)[-1])
            self.assertAlmostEqual(i, -14.0, delta=1.0)

    def test_narrator_profile_overrides_voice_and_cache_key(self):
        try:
            import piper  # noqa: F401
        except ImportError:
            self.skipTest("piper not installed")
        from pipeline.narrate import narrate_dialogue
        sc = {"lines": [{"who": "narrator", "text": "Case file test."}]}
        a = narrate_dialogue(sc)
        b = narrate_dialogue(sc, {"model": "en_US-libritts_r-medium", "speaker": 666, "length_scale": 1.1})
        self.assertNotEqual(a["path"], b["path"])
        with wave.open(a["path"]) as wa, wave.open(b["path"]) as wb:
            self.assertNotEqual(wa.getnframes(), wb.getnframes())

    def test_caption_emphasis_matching_ignores_punctuation(self):
        js = (ROOT / "renderer" / "engine.js").read_text()
        self.assertIn("const capKey", js)
        out = subprocess.run(["node", "-e", re.search(r"const capKey = [^;]+;", js).group(0) + " console.log(JSON.stringify(['Blood.', '\"desist', 'terrorism.\"', \"blood'\"].map(capKey)))"],
                             capture_output=True, text=True, check=True).stdout
        self.assertEqual(json.loads(out), ["blood", "desist", "terrorism", "blood"])


class Deliverables(unittest.TestCase):
    def test_outputs_verified_if_present(self):
        m = SERIES / "production_manifest.json"
        if not m.exists():
            self.skipTest("no manifest yet")
        man = json.loads(m.read_text())
        from pipeline.series import sha256
        for key, rec in man["videos"].items():
            f = SERIES / "output" / rec["file"]
            if rec.get("status", "").startswith("verified") and f.exists():
                self.assertEqual(sha256(f), rec["sha256"], f"{rec['file']} changed since verification")
                self.assertEqual((rec["media"]["width"], rec["media"]["height"]), (1080, 1920))
                self.assertTrue(45 <= rec["media"]["duration"] <= 90)


if __name__ == "__main__":
    unittest.main()
