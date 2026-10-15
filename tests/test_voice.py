"""Voice engine: text preparation, profiles, cache keys and (when the model is cached) one real synthesis."""
import json, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class TextPrep(unittest.TestCase):
    def test_sentence_split_merges_short_fragments(self):
        from pipeline.voice.text import split_sentences
        s = split_sentences("She read it twice. Then nothing. Outside, the rain had started again and nobody noticed.", min_words=4)
        self.assertEqual(len(s), 2)
        self.assertTrue(s[0].startswith("She read it twice. Then nothing."))
        self.assertEqual(len(split_sentences("Short one. Short two. Short three.", min_words=8)), 1)
        long = " ".join(["Seven words are in this sentence here."] * 12)
        self.assertEqual(len(split_sentences(long, min_words=8, max_words=20)), 6)

    def test_sentence_split_keeps_abbreviations(self):
        from pipeline.voice.text import split_sentences
        s = split_sentences("Dr. Raman checked the figure twice. It was wrong by a factor of four point four five.", min_words=4)
        self.assertEqual(len(s), 2)
        self.assertTrue(s[0].startswith("Dr. Raman"))

    def test_lexicon_respelling_is_whole_word(self):
        from pipeline.voice.text import apply_lexicon
        self.assertEqual(apply_lexicon("Worcester and Worcestershire.", {"Worcester": "Wooster"}), "Wooster and Worcestershire.")

    def test_numbers_normalise_to_words_for_wer(self):
        from pipeline.voice.text import normalize_for_wer, wer
        a = normalize_for_wer("Customers owe $600,000 and a bill for 120,000 is due. That is 42%.")
        b = normalize_for_wer("Customers owe six hundred thousand dollars and a bill for one hundred and twenty thousand is due. That is forty-two per cent.")
        self.assertEqual(wer(a, b), 0.0)

    def test_years_normalise_like_speech(self):
        from pipeline.voice.text import normalize_for_wer, wer
        self.assertEqual(wer(normalize_for_wer("In 1999 and again in 2024, but 2008 and 2000."), normalize_for_wer("In nineteen ninety-nine and again in twenty twenty-four, but two thousand and eight and two thousand.")), 0.0)

    def test_wer_counts_substitutions(self):
        from pipeline.voice.text import wer
        self.assertAlmostEqual(wer("profit is an opinion".split(), "foffet is an opinion".split()), 0.25)


class Profiles(unittest.TestCase):
    def test_sample_profile_loads_and_piper_names_are_not_profiles(self):
        from pipeline.voice.profiles import load_profile, profile_exists
        self.assertTrue(profile_exists("sample-bria"))
        self.assertFalse(profile_exists("en_GB-alba-medium"))
        p = load_profile("sample-bria")
        self.assertEqual(p["engine"], "pocket")
        self.assertIn("validation", p)

    def test_cache_key_changes_with_version_text_and_speed(self):
        from pipeline.voice import cache_key
        from pipeline.voice.profiles import load_profile
        p = dict(load_profile("sample-bria"))
        k1 = cache_key(p, "hello", 1.0)
        self.assertEqual(k1, cache_key(p, "hello", 1.0))
        self.assertNotEqual(k1, cache_key(p, "hello", 1.1))
        self.assertNotEqual(k1, cache_key(p, "hello there", 1.0))
        p2 = dict(p); p2["version"] = p["version"] + 1
        self.assertNotEqual(k1, cache_key(p2, "hello", 1.0))

    def test_no_audio_is_committed_under_voices(self):
        bad = [p for p in (ROOT / "voices").rglob("*") if p.suffix.lower() in (".wav", ".flac", ".mp3", ".m4a") and "private" not in p.parts]
        self.assertEqual(bad, [])


class Derive(unittest.TestCase):
    def test_derive_runs_with_ffmpeg_and_keeps_duration(self):
        import shutil, subprocess, tempfile, wave
        if not shutil.which("ffmpeg"):
            self.skipTest("ffmpeg not installed")
        from pipeline.voice.derive import derive
        with tempfile.TemporaryDirectory() as d:
            src, dst = Path(d) / "src.wav", Path(d) / "dst.wav"
            subprocess.run(["ffmpeg", "-v", "error", "-f", "lavfi", "-i", "sine=frequency=180:duration=3", "-ar", "24000", str(src)], check=True)
            derive(src, dst, pitch_semitones=-3, formant_ratio=1.06)
            with wave.open(str(dst)) as w:
                self.assertAlmostEqual(w.getnframes() / w.getframerate(), 3.0, delta=0.3)
                self.assertEqual(w.getnchannels(), 1)


class RealSynthesis(unittest.TestCase):
    def test_sample_voice_synthesises_and_validates(self):
        from pipeline.voice.models import CACHE, PACKAGES
        if not all((CACHE / (PACKAGES[n][2] or PACKAGES[n][1])).exists() for n in PACKAGES):
            self.skipTest("voice models not cached (render workflow downloads them)")
        from pipeline.voice import synthesize
        p = synthesize("sample-bria", "Profit is an opinion. Cash is a fact. Nothing in the numbers is false; the problem is time.")
        rep = json.loads(p.with_suffix(".json").read_text())
        self.assertTrue(p.exists())
        self.assertGreater(rep["duration"], 3.0)
        self.assertLess(rep["wer"], 0.2)
        self.assertGreater(rep["speaker_sim"], 0.4)


if __name__ == "__main__":
    unittest.main()
