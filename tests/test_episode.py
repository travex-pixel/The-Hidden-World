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
        # the code-drawn fallback must stay renderable even when the episode defaults to illustrated art
        js = (ROOT / "renderer" / "scenes" / f"{EP}.js").read_text()
        for s in self.ep["scenes"]:
            self.assertIn(s["scene"] + "(", js, f"no renderer for scene type {s['scene']}")

    def test_art_panels_exist_and_cover_every_scene(self):
        self.assertEqual(self.ep.get("visual_mode"), "art")
        man = json.loads((ROOT / self.ep["art_manifest"]).read_text())
        for sc in self.ep["scenes"]:
            for sh in sc["art"]["shots"]:
                pan = man["panels"][sh["panel"]]
                self.assertTrue((ROOT / pan["src"]).exists(), pan["src"])
                self.assertGreaterEqual(min(sh["zoom"]), 1.0)
                for f in sh.get("focus", []):
                    self.assertTrue(0 <= f[0] <= pan["w"] and 0 <= f[1] <= pan["h"], f"{sc['id']}: focus outside panel")

    def test_art_text_corrections_match_episode_numbers(self):
        # garbled text in the supplied art is patched; patched numbers must agree with the episode data
        f = self.ep["financials"]
        man = json.loads((ROOT / self.ep["art_manifest"]).read_text())
        texts = " ".join(pt["text"] for p in man["panels"].values() for pt in p["patches"])
        self.assertIn(f"${f['cash_now']//1000}k", texts)
        self.assertIn(f"${f['receivables']//1000}k", texts)
        self.assertIn(f"${f['profit']:,}", texts)
        self.assertIn("52%", texts)

    def test_art_mode_rejects_bad_shots(self):
        bad = json.loads(json.dumps(self.ep)); bad["scenes"][0]["art"]["shots"][0]["zoom"] = [0.8, 1.0]
        with self.assertRaises(EpisodeError): validate(bad)
        bad = json.loads(json.dumps(self.ep)); bad["scenes"][0]["art"]["shots"][0]["panel"] = "p99"
        with self.assertRaises(EpisodeError): validate(bad)

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

    def test_sfx_reproducible_across_processes(self):
        import subprocess, numpy as np
        code = "from pipeline import audio; import sys; sys.stdout.write(str(round(float(abs(audio.sfx('tick',1)).sum()),4)))"
        outs = {subprocess.run([sys.executable, "-c", code], cwd=ROOT, capture_output=True, text=True, env={"PYTHONHASHSEED": str(i), "PATH": "/usr/bin:/bin"}).stdout for i in (1, 2, 3)}
        self.assertEqual(len(outs), 1, f"sound effects differ between runs: {outs}")

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


class AllEpisodes(unittest.TestCase):
    def episodes(self):
        return sorted(p.name for p in (ROOT / "episodes").iterdir() if (p / "episode.json").exists())

    def test_every_episode_validates_and_has_renderers(self):
        self.assertGreaterEqual(len(self.episodes()), 2)
        for eid in self.episodes():
            ep = load_episode(eid)
            js = (ROOT / "renderer" / "scenes" / f"{eid}.js").read_text() + (ROOT / "renderer" / "cast.js").read_text() + (ROOT / "renderer" / "doc.js").read_text()
            for s in ep["scenes"]:
                self.assertIn(s["scene"] + "(", js, f"{eid}: no renderer for {s['scene']}")
            self.assertTrue((ROOT / "episodes" / eid / "research.md").exists())


class Episode002(unittest.TestCase):
    def setUp(self):
        self.ep = load_episode("ep002-mars-units")

    def test_conversion_maths(self):
        ph = self.ep["physics"]
        self.assertAlmostEqual(ph["newtons_per_pound_force"], 4.448, places=3)   # NIST: 4.448 222
        self.assertAlmostEqual(ph["undercount_fraction"], 1 / 4.448222, places=3)
        self.assertLess(ph["undercount_fraction"], 0.25)   # "less than a quarter"

    def test_on_screen_numbers_match_research(self):
        ph = self.ep["physics"]; caps = " ".join(s["caption"] + " " + s.get("subcaption", "") for s in self.ep["scenes"])
        self.assertIn(f"{ph['planned_altitude_km'][0]} km", caps)
        self.assertIn(f"{ph['actual_altitude_km']} km", caps)
        self.assertIn("4.45", caps)
        self.assertIn("23 September 1999", caps)

    def test_quote_is_verbatim_and_attributed(self):
        c8 = next(c for c in self.ep["claims"] if c["id"] == "C8")
        twist = next(s for s in self.ep["scenes"] if s["id"] == "s08_twist")
        quote = twist["caption"].strip("“”\"")
        self.assertIn(quote.rstrip("."), c8["text"])
        self.assertIn("Weiler", twist["subcaption"])

    def test_auto_mode_falls_back_to_code_art_without_sheet(self):
        self.assertEqual(self.ep["visual_mode"], "auto")
        for s in self.ep["scenes"]:
            self.assertTrue(s["art"]["shots"], s["id"])


class PanelGrid(unittest.TestCase):
    def test_even_grid_matches_hand_measured_boxes(self):
        # the 4x3 auto-grid should land within a few pixels of the boxes measured by hand for episode 001
        spec = json.loads((ROOT / "assets/episodes/ep001/panels.json").read_text())
        from PIL import Image
        sheet = Image.open(ROOT / spec["source"])
        cw, ch = sheet.width / 4, sheet.height / 3
        for i, p in enumerate(spec["panels"].values()):
            c, r = i % 4, i // 4
            auto = [c * cw + 4, r * ch + 4, (c + 1) * cw - 4, (r + 1) * ch - 4]
            for a, b in zip(auto, p["box"]):
                self.assertLess(abs(a - b), 12)


class Episode003(unittest.TestCase):
    def setUp(self):
        self.ep = load_episode("ep003-metronome-bridge")

    def test_bridge_facts_on_screen_match_data(self):
        b = self.ep["bridge"]; caps = " ".join(s["caption"] + " " + s.get("subcaption", "") for s in self.ep["scenes"])
        self.assertIn(f"about {b['critical_walkers']}", caps)
        self.assertIn("10 June 2000", caps)
        self.assertIn("80,000", caps)
        total = b["viscous_dampers"] + b["tuned_mass_dampers"]
        self.assertTrue(85 <= total <= 95, "narration says 'around ninety' dampers")
        from datetime import date
        days = (date.fromisoformat(b["closed"]) - date.fromisoformat(b["opened"])).days
        self.assertEqual(days, 2, "narration says 'two days after opening'")
        months = (date.fromisoformat(b["reopened"]) - date.fromisoformat(b["closed"])).days / 30.4
        self.assertTrue(18 <= months < 24, "narration says 'almost two years'")

    def test_debate_is_flagged_as_disputed(self):
        c8 = next(c for c in self.ep["claims"] if c["id"] == "C8")
        self.assertEqual(c8["type"], "disputed")
        self.assertGreaterEqual(len(c8["sources"]), 2)

    def test_metronomes_actually_synchronise_in_the_soundtrack(self):
        from pipeline.build import metronome_model, metronome_ticks
        m = metronome_model(self.ep["metronomes"])
        ev = metronome_ticks(m, 0, 8.0, "chaos_to_sync", 1.0)
        early = {round(e[0], 2) for e in ev if e[0] < 1.0}
        late = {round(e[0], 2) for e in ev if e[0] > m["sync_end"] + 0.2}
        self.assertGreater(len(early), 20, "ticks should be scattered before sync")
        self.assertLessEqual(len(late), 5, "after sync all metronomes tick together")
        self.assertEqual(metronome_model(self.ep["metronomes"])["phases"], m["phases"], "phases are reproducible")


class ThrillerCast(unittest.TestCase):
    """Character continuity and the attractive-cast standard: every thriller episode draws from characters/*.json."""
    REQUIRED = ["id", "name", "age", "personality", "signature", "look", "voice", "expressions"]

    def cast_files(self):
        return [p for p in (ROOT / "characters").glob("*.json") if p.stem != "narrator"]

    def test_character_specs_complete_and_adult(self):
        self.assertGreaterEqual(len(self.cast_files()), 2)
        for p in self.cast_files():
            c = json.loads(p.read_text())
            for k in self.REQUIRED:
                self.assertIn(k, c, f"{p.name}: missing {k}")
            self.assertGreaterEqual(c["age"], 21, f"{p.name}: cast must be adults")
            for k in ("skin", "skin_shadow", "skin_light", "hair", "hair_light", "hair_style", "eyes", "brows", "lips", "build", "outfit"):
                self.assertIn(k, c["look"], f"{p.name}: look.{k}")
            self.assertIn("colour", c["signature"])

    def test_expressions_used_exist_in_rig(self):
        import re
        rig = (ROOT / "renderer" / "cast.js").read_text()
        known = set(re.findall(r"^\s{4}(\w+):\s+\{ smile", rig, re.M))
        self.assertIn("charm", known)
        for c in self.cast_files():
            for e in json.loads(c.read_text())["expressions"]:
                self.assertIn(e, known, f"{c.name}: expression {e} not implemented in renderer/cast.js")
        ep = load_episode("ep004-compliment-deadline")
        for sc in ep["scenes"]:
            for a in sc.get("shot", {}).get("actors", []):
                for k in a.get("acting", []):
                    if "expr" in k:
                        self.assertIn(k["expr"], known, f"{sc['id']}: unknown expression {k['expr']}")

    def test_captions_never_cover_a_face(self):
        ep = load_episode("ep004-compliment-deadline")
        for sc in ep["scenes"]:
            cy = sc.get("caption_y", 1640)
            cap = (cy - 130, cy + 90)
            for a in sc.get("shot", {}).get("actors", []):
                if a["view"] != "front":
                    continue
                ys = [k.get("y", a["y"]) for k in a.get("acting", [])] + [a["y"]]
                for y in ys:
                    face = (y - 190 * a["scale"], y + 160 * a["scale"])
                    self.assertTrue(face[1] < cap[0] or face[0] > cap[1], f"{sc['id']}: caption overlaps {a['who']}'s face {face} vs {cap}")

    def test_dialogue_only_uses_cast_with_voices(self):
        ep = load_episode("ep004-compliment-deadline")
        for sc in ep["scenes"]:
            for ln in sc.get("lines", []):
                c = json.loads((ROOT / "characters" / f"{ln['who']}.json").read_text())
                self.assertIn("model", c["voice"])
                self.assertLessEqual(len(ln["text"]), 90)

    def test_runtime_in_shorts_range(self):
        ep = load_episode("ep004-compliment-deadline")
        lo, hi = ep["target_duration_seconds"]
        self.assertTrue(30 <= lo and hi <= 60)

    def test_lip_sync_and_line_timing(self):
        try:
            import piper  # noqa: F401
        except ImportError:
            self.skipTest("piper not installed (render workflow installs it)")
        from pipeline.narrate import narrate_episode
        ep = load_episode("ep004-compliment-deadline")
        for sc, n in zip(ep["scenes"], narrate_episode(ep)):
            for ln in n.get("lines", []):
                self.assertGreater(len(ln["env"]), 5, f"{sc['id']}: no lip-sync envelope")
                self.assertGreater(max(ln["env"]), 0.5, f"{sc['id']}: mouth never opens")
                self.assertLessEqual(ln["end"], n["duration"] + 1e-6)
