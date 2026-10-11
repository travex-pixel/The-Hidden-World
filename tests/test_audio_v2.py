"""Regression tests for the opening-audio problem and the structured score/mix (pipeline/score.py, mixdown.py, audio_qa.py).

Root causes found (measured on Case Files 01/02, cinematic):
  1. 93 % of the opening score energy was below 300 Hz, which phone speakers do not reproduce, so the short
     narration gaps of the hook (three scene cuts in 10 s) played as near silence on a phone ("audio cuts out").
  2. ffmpeg loudnorm, asked for linear mode, silently fell back to *dynamic* gain riding because the soft-clipped
     mix peaked above the true-peak target (measured on the real Case File 01 mix: I -14.51, TP -0.44 ->
     normalization_type "dynamic"). The replacement applies one static gain plus a peak limiter, checked here.
"""
import json, subprocess, sys, tempfile, unittest
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from pipeline import audio, score, mixdown, audio_qa  # noqa: E402

SR = audio.SR


def speechlike(dur, seed=1):
    """Band-limited noise with syllable-rate amplitude modulation: a stand-in for narration in the voice band."""
    r = np.random.default_rng(seed); n = int(dur * SR); t = np.arange(n) / SR
    x = score.bandpass(r.standard_normal(n).astype(np.float32), 150, 4000)
    return (x * (0.55 + 0.45 * np.sin(2 * np.pi * 4.2 * t) ** 2) * 0.25).astype(np.float32)


def short_scene_episode():
    # a hook like the real ones: three short scenes with ~0.9 s narration gaps, then a longer scene
    spans = [(0.0, 3.6, 0.25, 2.7), (3.6, 6.4, 3.85, 6.0), (6.4, 10.0, 6.65, 9.2), (10.0, 16.0, 10.25, 15.0)]
    tl = [{"id": f"s{i}", "start": a, "end": b, "narration_at": na, "narration_end": ne,
           "lines": [{"text": "x", "start": na, "end": ne, "words": []}]} for i, (a, b, na, ne) in enumerate(spans)]
    ep = {"scenes": [{"id": s["id"]} for s in tl], "score": {"root_hz": 146.83, "bpm": 72}}
    clips = [(s["narration_at"], speechlike(s["narration_end"] - s["narration_at"], i), SR) for i, s in enumerate(tl)]
    return ep, tl, clips


class OpeningAudio(unittest.TestCase):
    def test_linear_normaliser_never_rides_gain(self):
        ep, tl, clips = short_scene_episode()
        x = np.zeros(int(16 * SR), np.float32)
        for at, c, _ in clips:
            audio.add(x, c, at)
        x = x / np.max(np.abs(x)) * 0.95   # peaks close to full scale, like the soft-clipped mixes
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "m.wav"; audio.write_wav(p, x)
            r = mixdown.normalise_linear(p, -14.0, -1.5)
            self.assertEqual(r["mode"], "linear+limiter")
            self.assertLessEqual(abs(r["after"]["I"] + 14.0), 0.5, r)
            self.assertLessEqual(r["after"]["TP"], -1.5, r)

    def test_score_bed_is_audible_on_phones_in_gaps_and_never_masks_speech(self):
        ep, tl, clips = short_scene_episode()
        sc = score.compose_score(ep, tl, 16.0, 1)
        with tempfile.TemporaryDirectory() as d:   # the exact stems the mixer used
            mixdown.mixdown(16.0, [(a, c * 0.3, sr) for a, c, sr in clips], sc["stems"], [], tl, ep, 1, Path(d))   # a quiet narrator is levelled up
            nar = audio_qa.decode(Path(d) / "stems" / "narration.wav", mono=True); mus = audio_qa.decode(Path(d) / "stems" / "music.wav", mono=True)
        ln, lm = audio_qa.levels(audio_qa.phone(nar)), audio_qa.levels(audio_qa.phone(mus)); tw = (np.arange(len(ln)) + 0.5) * 0.25
        lines = [(s["narration_at"], s["narration_end"]) for s in tl]
        sp = np.array([any(a + 0.2 <= t <= b - 0.2 for a, b in lines) for t in tw]); gap = np.array([not any(a - 0.2 <= t <= b + 0.2 for a, b in lines) for t in tw]) & (tw > 0.3) & (tw < 14.0)   # the final fade is intentional
        med = float(np.median(ln[sp]))
        self.assertGreaterEqual(float(lm[gap].min()), med - 24, "a narration gap goes (near) silent on a phone speaker")
        self.assertGreaterEqual(float(np.percentile(ln[sp] - lm[sp], 5)), 10.0, "the score masks the narration")

    def test_score_is_phone_audible_not_just_bass(self):
        ep, tl, _ = short_scene_episode()
        share = lambda x: (lambda X, f: X[(f >= 300) & (f < 4000)].sum() / X.sum())(np.abs(np.fft.rfft(x)) ** 2, np.fft.rfftfreq(len(x), 1 / SR))
        st = score.compose_score(ep, tl, 16.0, 1)["stems"]; new = share((st["ambience"] + st["motif"] + st["metal"])[: 15 * SR])
        old = share(audio.compose([{**s, "music_cue": "cold"} for s in tl], 16.0, 1, bpm=84)[: 15 * SR])   # the cue that opened Case File 01
        self.assertGreaterEqual(new, 2 * old, (new, old))

    def test_score_ends_with_a_fade_not_a_cut(self):
        ep, tl, _ = short_scene_episode()
        for k, x in score.compose_score(ep, tl, 16.0, 1)["stems"].items():
            self.assertLess(float(np.max(np.abs(x[-int(0.02 * SR):]))), 1e-3, k)
            self.assertLess(float(np.max(np.abs(x[: int(0.002 * SR)]))), 0.05, k)   # 60 ms de-click, no slow fade-in

    def test_smooth_is_exact_and_fast(self):
        x = np.random.default_rng(3).random(20001).astype(np.float32)
        for k in (1, 2, 7, 100, 4000):
            self.assertTrue(np.allclose(score.smooth(x, k), np.convolve(x, np.ones(k) / k, "same"), atol=1e-5), k)

    def test_audio_qa_flags_a_dropout(self):
        ep, tl, clips = short_scene_episode()
        n = int(16 * SR); nar = np.zeros(n, np.float32)
        for at, c, _ in clips:
            audio.add(nar, c, at)
        with tempfile.TemporaryDirectory() as d:
            d = Path(d); (d / "timeline.json").write_text(json.dumps(tl))
            audio.write_wav(d / "dry.wav", nar)   # narration with nothing in the gaps = the reported problem
            r = audio_qa.analyse(d / "dry.wav", d, ep)
            self.assertFalse(r["opening_no_holes"], r)


if __name__ == "__main__":
    unittest.main()
