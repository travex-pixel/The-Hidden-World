import json, subprocess, sys, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from pipeline.schema import load_episode, validate, EpisodeError  # noqa: E402
from pipeline.build import make_decisions, build_timeline  # noqa: E402

EP = "ep001-cash-vs-profit"


class EpisodeConfig(unittest.TestCase):
    def setUp(self):
        self.ep = load_episode(EP)

    def test_valid(self):
        self.assertEqual(self.ep["id"], EP)
        self.assertGreaterEqual(len(self.ep["scenes"]), 7)

    def test_required_scene_fields_enforced(self):
        bad = json.loads(json.dumps(self.ep)); del bad["scenes"][0]["caption"]
        with self.assertRaises(EpisodeError): validate(bad)

    def test_unknown_claim_reference_rejected(self):
        bad = json.loads(json.dumps(self.ep)); bad["scenes"][0]["claims"] = ["C999"]
        with self.assertRaises(EpisodeError): validate(bad)

    def test_established_claims_cite_real_sources(self):
        src = {s["id"]: s for s in self.ep["sources"]}
        for c in self.ep["claims"]:
            if c["type"] == "established":
                self.assertTrue(c["sources"], c["id"])
                for sid in c["sources"]:
                    self.assertTrue(src[sid]["url"].startswith("https://"), sid)

    def test_minimum_three_sources_with_valid_urls(self):
        self.assertGreaterEqual(len(self.ep["sources"]), 3)
        for s in self.ep["sources"]:
            self.assertRegex(s["url"], r"^https://[\w.-]+/")

    def test_every_scene_with_a_factual_claim_is_covered(self):
        claims = {c["id"]: c for c in self.ep["claims"]}
        for s in self.ep["scenes"]:
            for cid in s["claims"]:
                self.assertIn(cid, claims)

    def test_captions_readable_on_phone(self):
        for s in self.ep["scenes"]:
            self.assertLessEqual(len(s["caption"]), 90, s["id"])
            self.assertTrue(s["caption"].strip())

    def test_caption_matches_narration_vocabulary(self):
        # every caption must share at least one meaningful word with its narration (captions summarise the spoken line)
        stop = {"the", "a", "is", "in", "and", "of", "to", "it", "on", "up", "now", "today", "one", "can't"}
        for s in self.ep["scenes"]:
            nar = {w.strip(".,:;!?'").lower() for w in s["narration"].split()} - stop
            cap = {w.strip(".,:;!?'").lower() for w in s["caption"].split()} - stop
            self.assertTrue(nar & cap, f"{s['id']}: caption shares no words with narration")

    def test_financials_internally_consistent(self):
        f = self.ep["financials"]
        self.assertEqual(f["revenue"] - f["expenses"], f["profit"])
        self.assertEqual(f["revenue"] - f["collected_from_customers"], f["receivables"])
        self.assertEqual(f["starting_cash"] + f["collected_from_customers"] - f["cash_paid_out"], f["cash_now"])
        self.assertLess(f["cash_now"], f["bill_due_today"], "the story requires the bill to exceed cash on hand")
        self.assertGreater(f["profit"], 0)
        self.assertGreater(f["cash_now"] + f["big_customer_payment"], f["bill_due_today"])
        self.assertGreater(f["new_invoice"], f["big_customer_payment"] + f["cash_now"] - f["bill_due_today"], "the final invoice should exceed what is left after paying today's bill")

    def test_financial_caption_numbers_match_data(self):
        f = self.ep["financials"]; caps = " ".join(s["caption"] for s in self.ep["scenes"])
        self.assertIn(f"${f['profit']//1000}k", caps)
        self.assertIn(f"${f['cash_now']//1000}k", caps)
        self.assertIn(f"${f['bill_due_today']//1000}k", caps)

    def test_fixed_seed_reproducible_decisions(self):
        self.assertEqual(make_decisions(self.ep, 42), make_decisions(self.ep, 42))
        self.assertNotEqual(make_decisions(self.ep, 42), make_decisions(self.ep, 43))

    def test_seed_never_touches_facts(self):
        d = json.dumps(make_decisions(self.ep, 7))
        for key in ("narration", "sources", "claims", "financials", "caption"):
            self.assertNotIn(key, d)

    def test_timeline_duration_logic(self):
        narr = [{"scene_id": s["id"], "path": "", "duration": 3.0} for s in self.ep["scenes"]]
        tl = build_timeline(self.ep, narr, None)
        self.assertEqual(len(tl), len(self.ep["scenes"]))
        for s, sc in zip(tl, self.ep["scenes"]):
            self.assertGreaterEqual(s["end"] - s["start"], sc["min_duration"] - 1e-9)
            self.assertGreaterEqual(s["end"], s["narration_end"] + sc["pad_after"] - 1e-9)
        for a, b in zip(tl, tl[1:]):
            self.assertEqual(a["end"], b["start"])

    def test_scene_renderer_exists_for_every_scene(self):
        js = (ROOT / "renderer" / "scenes" / f"{EP}.js").read_text()
        for s in self.ep["scenes"]:
            self.assertIn(s["scene"] + "(", js, f"no renderer for scene type {s['scene']}")

    def test_assets_present(self):
        for f in ["Fraunces-ExtraBold.ttf", "Nunito-ExtraBold.ttf", "LICENSE.md"]:
            self.assertTrue((ROOT / "assets" / "fonts" / f).exists(), f)
        self.assertTrue((ROOT / "episodes" / EP / "research.md").exists())

    def test_missing_episode_gives_clear_error(self):
        with self.assertRaises(EpisodeError) as cm: load_episode("ep999-nope")
        self.assertIn("Available", str(cm.exception))


class AudioSynthesis(unittest.TestCase):
    def test_sfx_and_music_are_finite_and_bounded(self):
        import numpy as np
        from pipeline import audio
        for n in sorted(__import__("pipeline.schema", fromlist=["SFX_NAMES"]).SFX_NAMES):
            x = audio.sfx(n, 1); self.assertTrue(np.isfinite(x).all(), n); self.assertLessEqual(float(np.abs(x).max()), 1.0, n)
        m = audio.compose([{"start": 0, "end": 6, "music_cue": "curious"}, {"start": 6, "end": 12, "music_cue": "revelation"}], 12, 3)
        self.assertEqual(len(m), 12 * audio.SR); self.assertTrue(np.isfinite(m).all()); self.assertGreater(float(np.abs(m).max()), 0.05)

    def test_music_reproducible_for_seed(self):
        import numpy as np
        from pipeline import audio
        tl = [{"start": 0, "end": 5, "music_cue": "warm"}]
        self.assertTrue(np.array_equal(audio.compose(tl, 5, 11), audio.compose(tl, 5, 11)))
        self.assertFalse(np.array_equal(audio.compose(tl, 5, 11), audio.compose(tl, 5, 12)))

    def test_mix_ducks_music_under_narration(self):
        import numpy as np
        from pipeline import audio
        sr = audio.SR; total = 4.0
        music = np.sin(2 * np.pi * 220 * np.arange(int(total * sr)) / sr).astype(np.float32) * 0.5
        voice = (np.sin(2 * np.pi * 300 * np.arange(int(1.0 * sr)) / sr) * 0.8).astype(np.float32)
        out = audio.mix(total, [(1.0, voice, sr)], music, [], 1, music_db=-6, duck_db=-12)
        mono = out.mean(axis=1)
        before = float(np.abs(mono[int(0.2 * sr):int(0.8 * sr)]).mean())
        during = float(np.abs(mono[int(1.2 * sr):int(1.8 * sr)]).mean())
        self.assertLess(before, during)  # voice dominates during speech
        after = float(np.abs(mono[int(3.2 * sr):int(3.8 * sr)]).mean())
        self.assertAlmostEqual(before, after, delta=0.05)
        self.assertLessEqual(float(np.abs(out).max()), 1.0)


class RenderedOutput(unittest.TestCase):
    """Runs only when an actual MP4 exists (local build or CI artifact)."""
    def test_mp4_if_present(self):
        candidates = list((ROOT / "out").glob(f"{EP}/*.mp4")) + list((ROOT / "releases").glob("*.mp4"))
        candidates = [c for c in candidates if "silent" not in c.name]
        if not candidates:
            self.skipTest("no rendered MP4 present")
        from pipeline.verify import probe
        for c in candidates:
            p = probe(c)
            kinds = sorted(s["codec_type"] for s in p["streams"])
            self.assertEqual(kinds, ["audio", "video"], c)
            v = next(s for s in p["streams"] if s["codec_type"] == "video")
            self.assertEqual(v["width"] * 16, v["height"] * 9, "must be 9:16")
            self.assertGreater(float(p["format"]["duration"]), 50)


if __name__ == "__main__":
    unittest.main()
