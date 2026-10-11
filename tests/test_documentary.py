"""Long-form documentary module: film data, captions, spoken-text rules and editorial guardrails.
No TTS or rendering here, so this runs in CI alongside the Shorts tests (numpy only)."""
import json, re, unittest
from pathlib import Path

from documentary.build import load_film, tts_text, chunk_caption, build_captions, TEMPLATES

ROOT = Path(__file__).resolve().parent.parent
FILM = ROOT / "documentary" / "films" / "betsy-faria"


class FilmData(unittest.TestCase):
    def setUp(self):
        self.film = load_film(FILM)
        self.says = [l["say"] for l in self.film["lines"] if l.get("say")]

    def test_every_shot_uses_a_known_template(self):
        for ln in self.film["lines"]:
            for s in ln["shots"]:
                self.assertIn(s["type"], TEMPLATES)

    def test_beat_density_supports_target(self):
        shots = sum(len(l["shots"]) for l in self.film["lines"])
        self.assertGreaterEqual(shots, 120)
        self.assertLessEqual(shots, 200)

    def test_spoken_text_has_no_symbols_the_voice_would_misread(self):
        for ln in self.film["lines"]:
            if ln.get("say"):
                t = re.sub(r"\[\[.*?\]\]", "", tts_text(self.film, ln))
                self.assertNotIn("$", t, ln["say"])
                self.assertNotRegex(t, r"\b911\b", ln["say"])

    def test_pronunciation_override_applied(self):
        ln = next(l for l in self.film["lines"] if "Faria" in l.get("say", ""))
        self.assertIn("[[", tts_text(self.film, ln))


class EditorialGuardrails(unittest.TestCase):
    """Pam Hupp is charged, not convicted, in Betsy Faria's death. The script must say so and never imply otherwise."""

    def setUp(self):
        film = load_film(FILM)
        self.text = " ".join(l["say"] for l in film["lines"] if l.get("say"))
        self.screen = json.dumps([s for l in film["lines"] for s in l["shots"]])

    def test_no_claim_of_conviction_for_betsys_murder(self):
        for pat in [r"Hupp (was )?convicted of (murdering )?Betsy", r"Hupp killed Betsy", r"Hupp murdered Betsy", r"convicted of Betsy"]:
            self.assertIsNone(re.search(pat, self.text, re.I), pat)
            self.assertIsNone(re.search(pat, self.screen, re.I), pat)

    def test_presumption_of_innocence_stated(self):
        self.assertIn("pleaded not guilty", self.text)
        self.assertIn("presumed innocent", self.text)
        self.assertIn("charged, not convicted", self.text)

    def test_allegations_are_attributed(self):
        for phrase in ["planted", "frame Russ"]:
            sentence = next(s for s in re.split(r"(?<=[.!?])\s+", self.text) if phrase in s)
            self.assertRegex(sentence, r"Prosecutors|prosecutors|alleged|said", sentence)

    def test_every_illustrated_scene_and_document_is_labelled(self):
        film = load_film(FILM)
        for ln in film["lines"]:
            for s in ln["shots"]:
                if s["type"] in ("scene", "doc") and "label" in s:
                    self.assertTrue(s["label"], f"{s['type']} shot has an empty label: {ln.get('say', '')[:40]}")


class Captions(unittest.TestCase):
    def test_chunks_respect_line_limits(self):
        film = load_film(FILM)
        for l in film["lines"]:
            for cue in chunk_caption(l.get("say", "") or "x"):
                lines = cue.split("\n")
                self.assertLessEqual(len(lines), 2, cue)
                for x in lines:
                    self.assertLessEqual(len(x), 42, cue)

    def test_caption_text_reassembles_to_narration(self):
        say = "Phone records showed her making a call at 7:04 p.m. from near the Faria home, and those records would become a key point of dispute."
        self.assertEqual(" ".join(c.replace("\n", " ") for c in chunk_caption(say)), say)

    def test_cues_are_ordered_and_inside_their_line(self):
        tl = [{"say": "Two years later, a judge found him not guilty.", "narration_at": 1.0, "narration_end": 3.4},
              {"say": "She pleaded not guilty.", "narration_at": 4.0, "narration_end": 5.1}]
        cues = build_captions(tl)
        self.assertEqual(cues[0]["start"], 1.0)
        for a, b in zip(cues, cues[1:]):
            self.assertLessEqual(a["end"], b["start"] + 1e-6)
        self.assertGreaterEqual(min(c["end"] - c["start"] for c in cues), 0.9)


if __name__ == "__main__":
    unittest.main()
