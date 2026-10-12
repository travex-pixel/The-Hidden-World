"""Optional ElevenLabs narration provider: selection, cache separation, API failures, and the unchanged Piper default.
All API calls are mocked; nothing here touches the network or needs a key."""
import base64, io, json, os, sys, unittest, urllib.error
from pathlib import Path
from unittest import mock
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from pipeline import narrate, tts_elevenlabs as tts  # noqa: E402

FAKE_KEY = "sk_test_DO_NOT_PRINT_7f3a9c"


def _response(text: str, sr: int = tts.SR):
    """A fake 200 body: 0.1 s of tone per character, with per-character alignment."""
    chars = list(text); n = int(0.1 * sr)
    audio = np.concatenate([np.sin(np.linspace(0, 40, n)) * 0.5 for _ in chars]).astype(np.float32)
    pcm = (audio * 32767).astype("<i2").tobytes()
    starts = [round(i * 0.1, 3) for i in range(len(chars))]; ends = [round((i + 1) * 0.1, 3) for i in range(len(chars))]
    body = {"audio_base64": base64.b64encode(pcm).decode(),
            "alignment": {"characters": chars, "character_start_times_seconds": starts, "character_end_times_seconds": ends}}
    return io.BytesIO(json.dumps(body).encode())


class _Ok:
    def __init__(self, text): self.buf = _response(text)
    def __enter__(self): return self.buf
    def __exit__(self, *a): return False


def _http_error(code, detail):
    return urllib.error.HTTPError("https://api.elevenlabs.io/x", code, "err", {}, io.BytesIO(json.dumps({"detail": detail}).encode()))


class ProviderSelection(unittest.TestCase):
    def setUp(self):
        os.environ.pop("HW_TTS_PROVIDER", None)

    def test_default_is_piper(self):
        self.assertEqual(narrate.provider_of(None), "piper")
        self.assertEqual(narrate.provider_of({"model": "en_US-libritts_r-medium"}), "piper")

    def test_profile_selects_elevenlabs(self):
        self.assertEqual(narrate.provider_of({"provider": "elevenlabs", "voice_id": "v1"}), "elevenlabs")

    def test_env_override_wins_and_unknown_is_rejected(self):
        with mock.patch.dict(os.environ, {"HW_TTS_PROVIDER": "elevenlabs"}):
            self.assertEqual(narrate.provider_of({"model": "x"}), "elevenlabs")
        with mock.patch.dict(os.environ, {"HW_TTS_PROVIDER": "piper"}):
            self.assertEqual(narrate.provider_of({"provider": "elevenlabs"}), "piper")
        with self.assertRaises(ValueError):
            narrate.provider_of({"provider": "polly"})

    def test_build_cli_accepts_tts_flag(self):
        import argparse
        from pipeline import build
        # the parser is built inside main(); a missing episode exits 2 before narration, but the flag must parse
        with mock.patch.object(sys, "argv", ["build", "no-such-episode", "--tts", "elevenlabs"]):
            self.assertEqual(build.main(["no-such-episode", "--tts", "elevenlabs"]), 2)
        os.environ.pop("HW_TTS_PROVIDER", None)


class CacheSeparation(unittest.TestCase):
    def test_piper_key_unchanged_and_elevenlabs_key_distinct(self):
        text = "The tunnel got him out."
        pk = narrate._key("en_US-libritts_r-medium", text, 1.0, 666)
        self.assertEqual(pk, narrate._key("en_US-libritts_r-medium", text, 1.0, 666))   # deterministic, legacy format
        self.assertFalse(pk.startswith("el_")); self.assertEqual(len(pk), 16)
        cfg = {"voice_id": "v1", "model_id": "eleven_multilingual_v2", "voice_settings": {}}
        ek = narrate._el_key(cfg, text)
        self.assertTrue(ek.startswith("el_")); self.assertNotEqual(ek[3:], pk)

    def test_elevenlabs_key_covers_voice_model_settings_and_text(self):
        base = {"voice_id": "v1", "model_id": "eleven_multilingual_v2", "voice_settings": {"stability": 0.5}}
        k0 = narrate._el_key(base, "a")
        self.assertNotEqual(k0, narrate._el_key({**base, "voice_id": "v2"}, "a"))
        self.assertNotEqual(k0, narrate._el_key({**base, "model_id": "eleven_flash_v2_5"}, "a"))
        self.assertNotEqual(k0, narrate._el_key({**base, "voice_settings": {"stability": 0.9}}, "a"))
        self.assertNotEqual(k0, narrate._el_key(base, "b"))
        self.assertEqual(k0, narrate._el_key({**base, "voice_settings": {"stability": 0.5}}, "a"))


class Alignment(unittest.TestCase):
    def test_characters_group_into_words_on_the_shared_separators(self):
        text = "In 1978, he ran — twice."
        chars = list(text); st = [i * 0.1 for i in range(len(chars))]; en = [(i + 1) * 0.1 for i in range(len(chars))]
        spans = tts.words_from_alignment(chars, st, en)
        self.assertEqual(len(spans), len(tts.tokens(text)))
        self.assertEqual(tts.tokens(text), ["In", "1978", "he", "ran", "twice"])
        self.assertAlmostEqual(spans[0][0], 0.0); self.assertAlmostEqual(spans[0][1], 0.2)   # "In" = chars 0-1
        self.assertAlmostEqual(spans[1][0], 0.3); self.assertAlmostEqual(spans[1][1], 0.7)   # "1978" = chars 3-6

    def test_caption_words_map_exactly_through_year_expansion(self):
        display = "In 1978, he ran."
        spoken = narrate.speak_years(display)   # "In nineteen seventy eight, he ran."
        spans = [(i, i + 0.5) for i in range(len(tts.tokens(spoken)))]
        words, exact = narrate.map_words_elevenlabs(display, spoken, spans)
        self.assertTrue(exact)
        self.assertEqual([w["w"] for w in words], ["In", "1978,", "he", "ran."])
        self.assertEqual((words[1]["start"], words[1]["end"]), (1, 3.5))   # 1978 spans three spoken words

    def test_mismatch_falls_back_proportionally_and_is_flagged(self):
        words, exact = narrate.map_counts("one two three", [1, 1, 1], [(0.0, 1.0), (1.0, 2.0)])
        self.assertFalse(exact)
        self.assertEqual(len(words), 3); self.assertAlmostEqual(words[0]["start"], 0.0); self.assertAlmostEqual(words[-1]["end"], 2.0, places=2)


class ApiFailures(unittest.TestCase):
    def setUp(self):
        self.env = mock.patch.dict(os.environ, {tts.KEY_ENV: FAKE_KEY}); self.env.start()
        self.sleeps = []

    def tearDown(self):
        self.env.stop()

    def test_missing_key_is_a_config_error_and_nothing_is_sent(self):
        with mock.patch.dict(os.environ, {tts.KEY_ENV: ""}), mock.patch("urllib.request.urlopen") as u:
            with self.assertRaises(tts.TTSProviderError) as cm:
                tts.synthesize("hi", "v1")
            self.assertEqual(cm.exception.kind, "config"); u.assert_not_called()

    def test_quota_exceeded_is_reported_not_retried(self):
        with mock.patch("urllib.request.urlopen", side_effect=_http_error(401, {"status": "quota_exceeded", "message": "0 credits remaining"})) as u:
            with self.assertRaises(tts.TTSProviderError) as cm:
                tts.synthesize("hi", "v1", sleep=self.sleeps.append)
        self.assertEqual(cm.exception.kind, "quota"); self.assertIn("credits", str(cm.exception)); self.assertEqual(u.call_count, 1)

    def test_bad_key_is_an_auth_error_without_leaking_the_key(self):
        with mock.patch("urllib.request.urlopen", side_effect=_http_error(401, {"status": "invalid_api_key", "message": "bad"})):
            with self.assertRaises(tts.TTSProviderError) as cm:
                tts.synthesize("hi", "v1", sleep=self.sleeps.append)
        self.assertEqual(cm.exception.kind, "auth"); self.assertNotIn(FAKE_KEY, str(cm.exception)); self.assertNotIn("7f3a9c", repr(cm.exception))

    def test_rate_limit_then_success_is_retried_with_backoff(self):
        calls = [_http_error(429, {"status": "system_busy"}), _Ok("hi there")]
        def fake(req, timeout):
            c = calls.pop(0)
            if isinstance(c, Exception): raise c
            self.assertEqual(req.get_header("Xi-api-key"), FAKE_KEY)   # sent as a header only
            self.assertIn("with-timestamps", req.full_url); self.assertIn("output_format=pcm_22050", req.full_url)
            self.assertEqual(json.loads(req.data)["model_id"], "eleven_multilingual_v2")
            return c
        with mock.patch("urllib.request.urlopen", side_effect=fake):
            res = tts.synthesize("hi there", "v1", sleep=self.sleeps.append)
        self.assertEqual(self.sleeps, [2.0]); self.assertEqual(len(res["words"]), 2); self.assertEqual(res["sr"], 22050)
        self.assertAlmostEqual(len(res["audio"]) / res["sr"], 0.8, places=2)

    def test_network_failure_gives_up_after_retries(self):
        with mock.patch("urllib.request.urlopen", side_effect=urllib.error.URLError("dns")):
            with self.assertRaises(tts.TTSProviderError) as cm:
                tts.synthesize("hi", "v1", retries=2, sleep=self.sleeps.append)
        self.assertEqual(cm.exception.kind, "network"); self.assertEqual(self.sleeps, [2.0, 4.0])

    def test_validation_error_is_not_retried(self):
        with mock.patch("urllib.request.urlopen", side_effect=_http_error(422, {"status": "invalid", "message": "voice not found"})) as u:
            with self.assertRaises(tts.TTSProviderError) as cm:
                tts.synthesize("hi", "nope", sleep=self.sleeps.append)
        self.assertEqual(cm.exception.kind, "validation"); self.assertEqual(u.call_count, 1)

    def test_text_over_model_limit_is_refused_before_sending(self):
        with mock.patch("urllib.request.urlopen") as u:
            with self.assertRaises(tts.TTSProviderError):
                tts.synthesize("x" * 5001, "v1", "eleven_v3")
            u.assert_not_called()


class NarrateIntegration(unittest.TestCase):
    """narrate_scene with an ElevenLabs profile: cached under el_, words.json written, Piper never touched; and a
    failure propagates instead of switching to Piper."""

    def test_elevenlabs_clip_is_cached_with_words_and_piper_is_not_called(self):
        prof = {"provider": "elevenlabs", "voice_id": "vtest", "model_id": "eleven_multilingual_v2", "voice_settings": {"stability": 0.4}}
        text = "Agents ran the name."
        out = narrate.CACHE / f"{narrate._el_key(narrate.elevenlabs_config(prof), text)}.wav"
        out.unlink(missing_ok=True); out.with_suffix(".words.json").unlink(missing_ok=True)
        with mock.patch.dict(os.environ, {tts.KEY_ENV: FAKE_KEY}), mock.patch("urllib.request.urlopen", side_effect=lambda req, timeout: _Ok(text)) as u, \
             mock.patch("pipeline.narrate._narrate_aligned", side_effect=AssertionError("Piper must not run")):
            p = narrate.narrate_scene("", text, 1.0, None, align=True, profile=prof)
            self.assertEqual(p, out); self.assertEqual(u.call_count, 1)
            spans = json.loads(p.with_suffix(".words.json").read_text())
            self.assertEqual(len(spans), 4); self.assertTrue(all(0 <= a < b for a, b in spans))
            narrate.narrate_scene("", text, 1.0, None, align=True, profile=prof)   # cache hit: no second request
            self.assertEqual(u.call_count, 1)
        out.unlink(missing_ok=True); out.with_suffix(".words.json").unlink(missing_ok=True)

    def test_explicit_elevenlabs_failure_propagates(self):
        prof = {"provider": "elevenlabs", "voice_id": "vtest"}
        with mock.patch.dict(os.environ, {tts.KEY_ENV: FAKE_KEY}), \
             mock.patch("urllib.request.urlopen", side_effect=_http_error(401, {"status": "quota_exceeded", "message": "0 credits"})), \
             mock.patch("pipeline.narrate._narrate_aligned", side_effect=AssertionError("must not fall back to Piper")):
            with self.assertRaises(tts.TTSProviderError):
                narrate.narrate_scene("", "Never swapped silently.", 1.0, None, align=True, profile=prof)

    def test_piper_workflow_unchanged(self):
        """The existing default path: no provider field, a Piper clip in the legacy cache location with word timings."""
        os.environ.pop("HW_TTS_PROVIDER", None)
        sc = {"lines": [{"who": "narrator", "text": "A short test line."}]}
        prof = {"model": "en_US-libritts_r-medium", "speaker": 666, "length_scale": 1.0, "word_timing": True}
        with mock.patch("urllib.request.urlopen", side_effect=AssertionError("no network for Piper")):
            d = narrate.narrate_dialogue(sc, prof)
        self.assertTrue(Path(d["path"]).name.startswith("dlg_"))
        ln = d["lines"][0]
        self.assertEqual(len(ln["words"]), 4); self.assertNotIn("timing", ln)
        key = narrate._key(prof["model"], "A short test line.", 1.0, 666)
        self.assertTrue((narrate.CACHE / f"{key}.wav").exists())


if __name__ == "__main__":
    unittest.main()
