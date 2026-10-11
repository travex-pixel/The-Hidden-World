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
        # sound effects must not depend on Python's per-process hash salt
        import subprocess, sys as _sys
        code = "from pipeline import audio; import numpy as np; print(float(np.abs(audio.sfx('stamp', 1)).sum()))"
        runs = {subprocess.run([_sys.executable, "-c", code], cwd=ROOT, capture_output=True, text=True, env={**__import__('os').environ, "PYTHONHASHSEED": h}).stdout for h in ("1", "2")}
        self.assertEqual(len(runs), 1, runs)

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
            self.assertGreater(float(p["format"]["duration"]), 15)   # Round 2 parts are ~20-25 s by design


if __name__ == "__main__":
    unittest.main()


class AllEpisodes(unittest.TestCase):
    def episodes(self):
        return sorted(p.name for p in (ROOT / "episodes").iterdir() if (p / "episode.json").exists())

    def test_every_episode_validates_and_has_renderers(self):
        self.assertGreaterEqual(len(self.episodes()), 2)
        for eid in self.episodes():
            ep = load_episode(eid)
            js = (ROOT / "renderer" / "scenes" / f"{eid}.js").read_text()
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


class QuietGame001(unittest.TestCase):
    """Dialogue-driven story episode (THE QUIET GAME)."""
    def setUp(self):
        self.ep = load_episode("qg001-the-rumour")

    def test_every_line_has_a_cast_voice_from_the_approved_list(self):
        from pipeline.voices import APPROVED
        for who, c in self.ep["cast"].items():
            self.assertIn(c["voice"], APPROVED, who)
        speakers = [c.get("speaker") for c in self.ep["cast"].values() if c.get("speaker") is not None]
        self.assertEqual(len(speakers), len(set(speakers)), "each character needs a distinct voice")

    def test_unknown_speaker_rejected(self):
        bad = json.loads(json.dumps(self.ep)); bad["scenes"][0]["lines"][0]["who"] = "nobody"
        with self.assertRaises(EpisodeError): validate(bad)

    def test_story_opens_on_the_hook_not_an_intro(self):
        first = self.ep["scenes"][0]["lines"][0]["text"]
        self.assertTrue(first.startswith("By lunch"), first)
        self.assertNotIn("welcome", first.lower())

    def test_twist_is_set_up_and_paid_off(self):
        ph = self.ep["phone"]
        self.assertTrue(ph["preview"].endswith("…"), "the preview must be cut off before 'at MY work'")
        self.assertTrue(ph["full"].startswith(ph["preview"].rstrip("…")), "full message must extend the same preview")
        self.assertIn("MY work", ph["full"])
        js = "".join((ROOT / f).read_text() for f in [*self.ep["renderer_includes"], "renderer/scenes/qg001-the-rumour.js"])
        self.assertIn("He got caught stealing at…", js)   # on-screen preview matches the data
        self.assertIn("at MY work.", js)

    def test_spoken_words_and_length_targets(self):
        words = sum(len(l["text"].split()) for s in self.ep["scenes"] for l in s["lines"])
        self.assertLess(words, 110)
        lo, hi = self.ep["target_duration_seconds"]
        self.assertLessEqual(hi, 47)

    def test_no_diagnostic_labels(self):
        text = " ".join(l["text"] for s in self.ep["scenes"] for l in s["lines"]).lower()
        for w in ("narciss", "gaslight", "psychopath", "sociopath", "toxic"):
            self.assertNotIn(w, text)

    def test_timeline_carries_line_timings(self):
        narr = [{"scene_id": s["id"], "path": None, "duration": 2.0,
                 "lines": [{"who": l["who"], "text": l["text"], "caption": l["text"], "start": 0.0, "end": 1.0, "mouth": [0.5]} for l in s["lines"]]} for s in self.ep["scenes"]]
        tl = build_timeline(self.ep, narr, None)
        for s in tl:
            for l in s["lines"]:
                self.assertTrue(s["start"] <= l["start"] < l["end"] <= s["end"], s["id"])

    def test_rumour_meter_escalates_then_truth(self):
        levels = [s["rumour"]["level"] for s in self.ep["scenes"] if "rumour" in s]
        self.assertEqual(levels, sorted(levels)); self.assertEqual(levels[-1], 5)
        reveal = next(s for s in self.ep["scenes"] if "truth" in s)
        self.assertIn("never about Theo", reveal["truth"]["text"])
        for s in self.ep["scenes"]:
            if "rumour" in s:
                self.assertLess(s["rumour"].get("at_line", 0), len(s["lines"]), s["id"])

    def test_time_jumps_are_labelled(self):
        jumps = [s["jump"]["dir"] for s in self.ep["scenes"] if "jump" in s]
        self.assertEqual(jumps, [-1, 1])


class QuietGameSeries(unittest.TestCase):
    """Checks every THE QUIET GAME episode (qg*) for the series rules."""
    def episodes(self):
        return [load_episode(p.name) for p in sorted((ROOT / "episodes").glob("qg*")) if (p / "episode.json").exists()]

    def test_round_one_is_complete(self):
        eps = self.episodes()
        self.assertGreaterEqual(len(eps), 8)
        self.assertEqual([e["number"] for e in eps[:8]], list(range(1, 9)))

    def test_finale_mirrors_episode_one(self):
        fin = load_episode("qg008-the-new-guy"); ep1 = load_episode("qg001-the-rumour")
        self.assertEqual(fin["scenes"][0]["clock"], "MON 9:02 AM")                      # same minute the rumour started
        self.assertEqual(fin["scenes"][-1]["clock"], ep1["scenes"][0]["clock"])         # 12:31 PM, the lunch
        self.assertIn("nobody hated him", fin["scenes"][-1]["lines"][0]["text"])
        js = (ROOT / "renderer" / "scenes" / "qg008-the-new-guy.js").read_text()
        for scene_fn, src in [("hook_lunch", "qg001"), ("mt_tent", "qg002"), ("fv_hook", "qg003"), ("cr_end", "qg004")]:
            self.assertIn(f"'{scene_fn}'", js)                                           # memory flash
            self.assertTrue(any(src in inc for inc in fin["renderer_includes"]), src)

    def test_series_rules(self):
        from pipeline.voices import APPROVED
        for ep in self.episodes():
            with self.subTest(ep=ep["id"]):
                for js in ep.get("renderer_includes", []):
                    self.assertTrue((ROOT / js).exists(), js)
                for who, c in ep["cast"].items():
                    self.assertIn(c["voice"], APPROVED, who)
                spk = [c["speaker"] for c in ep["cast"].values() if "speaker" in c]
                self.assertEqual(len(spk), len(set(spk)), "distinct voice per character")
                first = ep["scenes"][0]
                self.assertTrue(first["lines"], "the hook must speak")
                self.assertFalse(first.get("jump"), "never open on a time jump")
                self.assertLessEqual(ep["target_duration_seconds"][1], 47)
                text = " ".join(l["text"] for s in ep["scenes"] for l in s["lines"]).lower()
                for w in ("narciss", "gaslight", "psychopath", "sociopath", "toxic", "welcome to", "did you know"):
                    self.assertNotIn(w, text)
                self.assertLess(len(text.split()), 120)

    def test_meter_steps_climb_until_the_truth(self):
        for ep in self.episodes():
            with self.subTest(ep=ep["id"]):
                last = 0
                for s in ep["scenes"]:
                    for st in ([s["rumour"]] if isinstance(s.get("rumour"), dict) else s.get("rumour", [])):
                        if "at" not in st:   # silent scenes time steps in seconds instead of by a line
                            self.assertLess(st.get("at_line", 0), len(s["lines"]), s["id"])
                        self.assertGreaterEqual(st["level"], last, f"{s['id']}: meter went down before the truth")
                        last = st["level"]
                    if "truth" in s:
                        self.assertLess(s["truth"].get("at_line", 0), len(s["lines"]), s["id"])
                        last = 0
                    for g in s.get("tags", []):
                        self.assertIn(g["who"], ep["cast"])
                        if "at_line" in g:
                            self.assertLess(g["at_line"], len(s["lines"]), s["id"])

    def test_every_episode_has_a_truth_beat_or_a_cliffhanger(self):
        for ep in self.episodes():
            has_truth = any("truth" in s for s in ep["scenes"])
            cliff = "next" in ep["scenes"][-1]
            self.assertTrue(has_truth or cliff, ep["id"])

    def test_round_two_is_a_six_part_serial(self):
        r2 = [e for e in self.episodes() if e.get("round") == 2]
        self.assertEqual([e["part"] for e in r2], [1, 2, 3, 4, 5, 6])
        last_day = 0
        for i, ep in enumerate(r2):
            with self.subTest(ep=ep["id"]):
                self.assertIn(f"Part {ep['part']}/6", ep["yt_title"])
                self.assertLessEqual(len(ep["yt_title"]), 100)
                self.assertEqual(ep["countdown"]["days"], 6)
                days = [s["day"] for s in ep["scenes"]]
                self.assertEqual(days, sorted(days)); self.assertGreaterEqual(days[0], last_day); last_day = days[-1]
                self.assertTrue(ep["scenes"][0]["lines"], "hook must speak in the first seconds")
                if ep["part"] < 6:   # every part but the last ends on a cliffhanger card that names the next part
                    nxt = ep["scenes"][-1]["next"]
                    self.assertEqual(nxt["part"], ep["part"] + 1)
                    self.assertEqual(nxt["title"].lower(), r2[i + 1]["title"].lower())
                else:
                    self.assertTrue(any("truth" in s for s in ep["scenes"]), "the finale pays off")
        self.assertEqual(last_day, 6)


class YouTubeUpload(unittest.TestCase):
    """The uploader, tested against a fake YouTube (no network, no credentials)."""
    def setUp(self):
        from pipeline import youtube
        self.yt = youtube
        import tempfile
        self.tmp = Path(tempfile.mkdtemp())
        self._ledger = youtube.LEDGER
        youtube.LEDGER = self.tmp / "youtube.json"

    def tearDown(self):
        self.yt.LEDGER = self._ledger

    def test_metadata_for_every_episode(self):
        for ep in self.yt.series_episodes():
            m = self.yt.build_metadata(ep)
            with self.subTest(ep=ep["id"]):
                self.assertLessEqual(len(m["snippet"]["title"]), 100)
                self.assertLessEqual(len(m["snippet"]["description"]), 5000)
                self.assertEqual(m["snippet"]["description"].count("Piper TTS"), 1, "voice credit exactly once (CC BY)")
                self.assertIn("#Shorts", m["snippet"]["description"])
                self.assertIs(m["status"]["selfDeclaredMadeForKids"], False)
                self.assertEqual(m["status"]["privacyStatus"], "private")

    def test_publish_at_needs_private(self):
        ep = self.yt.series_episodes()[0]
        self.assertEqual(self.yt.build_metadata(ep, "private", "2026-10-12T17:00:00Z")["status"]["publishAt"], "2026-10-12T17:00:00Z")
        with self.assertRaises(self.yt.UploadError):
            self.yt.build_metadata(ep, "public", "2026-10-12T17:00:00Z")

    def test_next_skips_already_uploaded(self):
        self.assertEqual(self.yt.pick_episode("next")["id"], "qg001-the-rumour")
        self.yt.write_ledger({"qg001-the-rumour": {"video_id": "x"}, "qg002-the-meeting": {"video_id": "y"}})
        self.assertEqual(self.yt.pick_episode("next")["id"], "qg003-the-favour")

    def test_missing_secrets_fail_clearly(self):
        import os
        saved = {k: os.environ.pop(k, None) for k in ("YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN")}
        try:
            with self.assertRaises(self.yt.UploadError) as cm:
                self.yt.access_token(opener=lambda *a, **k: self.fail("must not call the network"))
            self.assertIn("YT_REFRESH_TOKEN", str(cm.exception))
        finally:
            for k, v in saved.items():
                if v is not None: os.environ[k] = v

    def test_resumable_upload_protocol(self):
        calls = []
        class Resp:
            def __init__(self, body=b"{}", headers=None): self.body, self.headers = body, headers or {}
            def __enter__(self): return self
            def __exit__(self, *a): return False
            def read(self): return self.body
        def fake(req, timeout=None):
            calls.append((req.get_method(), req.full_url, dict(req.header_items()), req.data))
            if "oauth2" in req.full_url:
                return Resp(json.dumps({"access_token": "tok"}).encode())
            if req.get_method() == "POST":
                return Resp(headers={"Location": "https://upload.example/session/1"})
            return Resp(json.dumps({"id": "VID123", "status": {"privacyStatus": "private"}}).encode())
        import os
        os.environ.update(YT_CLIENT_ID="c", YT_CLIENT_SECRET="s", YT_REFRESH_TOKEN="r")
        tok = self.yt.access_token(opener=fake)
        ep = self.yt.series_episodes()[0]
        video = ROOT / "releases" / f"{ep['id']}.mp4"
        res = self.yt.upload(video, self.yt.build_metadata(ep), tok, opener=fake)
        self.assertEqual(res["id"], "VID123")
        (m1, u1, h1, d1), (m2, u2, h2, d2), (m3, u3, h3, d3) = calls
        self.assertEqual((m1, m2, m3), ("POST", "POST", "PUT"))
        self.assertIn(b"grant_type=refresh_token", d1)
        self.assertIn("uploadType=resumable", u2)
        self.assertEqual(json.loads(d2)["snippet"]["title"], self.yt.build_metadata(ep)["snippet"]["title"])
        self.assertEqual(h2["X-upload-content-length"], str(video.stat().st_size))
        self.assertEqual(u3, "https://upload.example/session/1")
        self.assertEqual(len(d3), video.stat().st_size)
        self.assertEqual(h3["Authorization"], "Bearer tok")

    def test_dry_run_touches_nothing(self):
        import io, contextlib
        with contextlib.redirect_stdout(io.StringIO()) as out:
            self.assertEqual(self.yt.main(["next", "--dry-run"]), 0)
        self.assertIn("dry run", out.getvalue())
        self.assertFalse(self.yt.LEDGER.exists())
