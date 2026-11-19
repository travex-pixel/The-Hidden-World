"""Designed document inserts (copycat/inserts.py), their mapper wiring, QA provenance and the CANON stamp timing."""
import os
import unittest
from pathlib import Path

import numpy as np

from copycat import inserts as I
from copycat import mapper as M
from copycat import qa_verify
from copycat.domain_gate import AssetDomainGate, is_designed_insert
from copycat.stamp import IMPACT, Sprite, StampPainter
from tests.test_copycat_mapper import asset, beat, make_script, make_timing

ROOT = Path(__file__).resolve().parent.parent
BG = next((p for p in (ROOT / "assets/cache/naruto/images").glob("nr_06*.jpg")), None)


def ins_beat(bid, speaker="NARRATOR", text="Rule one. The knowing comes back. The muscles don't.", **ins):
    b = beat(bid, speaker, [["naruto"]], text=text)
    b["insert"] = dict(type="notebook_rules", **ins)
    return b


class PhraseSync(unittest.TestCase):
    def test_phrase_span_is_punctuation_tolerant(self):
        t = "The last line says, puddle on the road, no rain for a week."
        a, b = I.phrase_span(t, "puddle on the road no rain for a week")
        self.assertTrue(0.3 < a < b <= 1.0)
        self.assertIsNone(I.phrase_span(t, "something else entirely"))

    def test_when_maps_phrases_to_the_beat_window(self):
        spec = dict(type="notebook_rules", beat_text="Rule one. The knowing comes back. The muscles don't.", beat_start=100.0, beat_end=106.0, animate=["r1"])
        D = I.Doc.__new__(I.Doc)
        D.spec, D.beat_text, D.bs, D.be = spec, spec["beat_text"], 100.0, 106.0
        D.present, D.animate = set(), {"r1"}
        w = D.when("r1a", "The knowing comes back", "omit", group="r1")
        self.assertEqual(w[0], "t")
        self.assertTrue(100.0 < w[1] < w[2] < 106.5)
        self.assertIs(D.when("r2a", "x", "omit", group="r2"), False)          # not written yet
        D.present = {"r2"}
        self.assertIsNone(D.when("r2a", "x", "omit", group="r2"))             # already on the page


class MapperInsert(unittest.TestCase):
    def test_full_beat_insert_becomes_one_insert_slot_per_view(self):
        beats = [beat("b1", "NARRATOR", [["naruto"]]), ins_beat("b2", views=[dict(frm="t", to="r1", z=[1, 1.2]), dict(frm="r1", to="r1", z=[1.2, 1.3])])]
        slots, _ = M.build_skeleton(make_script(beats), make_timing(beats))
        kinds = [s["type"] for s in slots]
        self.assertEqual(kinds, ["cut", "insert", "insert"])
        self.assertEqual(slots[1]["insert"]["beat_text"], beats[1]["text"])
        self.assertAlmostEqual(slots[1]["end"], slots[2]["start"])

    def test_partial_insert_keeps_a_real_frame_first(self):
        beats = [ins_beat("b1", at=0.5)]
        slots, _ = M.build_skeleton(make_script(beats), make_timing(beats, step=8.0))
        self.assertEqual([s["type"] for s in slots], ["cut", "insert"])
        self.assertAlmostEqual(slots[0]["end"], slots[1]["start"])
        self.assertGreater(slots[1]["start"], 3.0)

    def test_background_is_a_gate_approved_real_frame_and_provenance_is_designed(self):
        beats = [ins_beat("b1")]
        script = make_script(beats)
        assets = [asset("a1", ["rooftop"], dom="anime_naruto", franchise="naruto"), asset("a2", ["academy"], dom="anime_naruto", franchise="naruto")]
        M.configure("naruto", script, {}, "t")
        slots, _ = M.build_skeleton(script, make_timing(beats))
        bgs = M.pick_backgrounds(slots, {}, assets, {})
        self.assertEqual(bgs[0], "a1")                                       # first-choice place for a notebook page: the roof
        shots = M.build_shots(slots, {}, {a["id"]: a for a in assets}, {}, bgs)
        s = shots[0]
        self.assertEqual((s["type"], s["asset_id"], s["bg_asset_id"], s["provenance"]), ("insert", None, "a1", "designed_insert"))
        self.assertTrue(is_designed_insert(s))
        M.configure("black-clover", script, {}, "t")

    def test_stamp_carries_the_audio_thunk_time(self):
        b = beat("b1", "NARRATOR", [["naruto"]])
        b["stamp"] = dict(label="CANON", note="Test note.")
        script = make_script([b])
        M.STAMP_TIMES.clear()
        M.STAMP_TIMES["b1"] = 0.55
        slots, _ = M.build_skeleton(script, make_timing([b]))
        st = M._stamp(slots[0])
        self.assertEqual(st["stamp"]["time"], 0.55)
        M.STAMP_TIMES.clear()


class QaProvenance(unittest.TestCase):
    def test_designed_insert_is_exempt_and_never_a_fallback(self):
        vault = dict(assets=[asset("a1", ["rooftop"], dom="anime_naruto", franchise="naruto")])
        shots = [dict(id="s1", start=0, end=4, type="insert", asset_id=None, asset_path=None, bg_asset_id="a1", provenance="designed_insert", insert=dict(type="roster")),
                 dict(id="s2", start=4, end=8, type="insert", asset_id=None, asset_path=None, bg_asset_id="a1", provenance="designed_insert", insert=dict(type="roster"))]
        p = qa_verify.provenance(dict(shots=shots, domain="anime_naruto"), vault, "naruto")
        self.assertEqual(p["shots_without_asset"], 0)
        self.assertEqual(p["off_domain_assets"], 0)
        self.assertEqual(p["runtime_share"]["designed_insert"], 1.0)
        self.assertEqual(p["runtime_share"]["generated"], 0.0)
        self.assertEqual(p["anti_repetition_violations"], 0)                 # the blurred backdrop is not a repeated hero frame


class StampTiming(unittest.TestCase):
    def test_slam_impact_lands_on_the_exported_time(self):
        d = StampPainter.delay_frames(25.093, 24.843, 30)                    # thunk = beat start + 0.25 s
        self.assertEqual(d + IMPACT, round(0.25 * 30))
        self.assertEqual(StampPainter.delay_frames(10.0, 10.0, 30), 0)

    def test_note_strip_is_a_separate_unscaled_layer(self):
        sp = Sprite("CANON", "Kakashi explains it. Naruto is 16.", 1080)
        self.assertTrue(sp.na.any() and sp.a.any())
        self.assertEqual(float(sp.a[sp.stamp_h:].max()), 0.0)                # the stamp layer holds nothing below the stamp ...
        self.assertEqual(float(sp.na[:sp.stamp_h - 40].max()), 0.0)          # ... and the note layer nothing over it
        W, H = 1920, 1080
        painter = StampPainter(W, H)
        st = dict(label="CANON", note="Kakashi explains it. Naruto is 16.")
        a = np.zeros((H, W, 3), np.uint8)
        b = np.zeros((H, W, 3), np.uint8)
        painter.draw(a, st, 5, 80, 30)                                       # settled (scale 1.0)
        painter.draw(b, st, 5 + 12, 80, 30, delay=12)                        # same frame reached through a delay
        self.assertTrue(np.array_equal(a, b))
        self.assertEqual(painter.params(IMPACT, 80, 30)[1] < 1.0, True)      # impact frame overshoots below 1.0

    def test_stamp_stays_in_the_upper_right_safe_area(self):
        W, H = 1920, 1080
        painter = StampPainter(W, H)
        fr = np.zeros((H, W, 3), np.uint8)
        painter.draw(fr, dict(label="CANON", note="Every team before Team 7 failed."), 8, 90, 30)
        ys, xs = np.nonzero(fr.max(axis=2))
        self.assertLess(ys.max(), I.STAMP_RECT[3] + 20)
        self.assertGreater(xs.min(), I.STAMP_RECT[0] - 80)


@unittest.skipUnless(BG, "naruto vault images not present")
class RenderedProps(unittest.TestCase):
    TYPES = ("roster", "scroll_note")

    @classmethod
    def setUpClass(cls):
        cls.specs = {
            "roster": dict(type="roster", animate=["hl_oct10"], present=["mk_uzuki", "mk_yakushi", "brk"], beat_text="The leave ends October tenth. That's my birthday.",
                           beat_start=10.0, beat_end=12.6, view=dict(frm="gap_mid", to="gap_mid", z=[1.3, 1.4])),
            "scroll_note": dict(type="scroll_note", mode="read", animate=["note", "ul"], beat_start=10.0, beat_end=20.0,
                                beat_text="The note is six lines long. What the clone learns, the caster keeps. For this reason the technique is forbidden. The mind fails long before the chakra does.",
                                view=dict(frm="note", to="note", z=[1.3, 1.5])),
        }

    def shot(self, name, a=10.0, b=12.6):
        from copycat.compositor import make_vignette
        spec = self.specs[name]
        shot = dict(id="s1", start=spec["beat_start"], end=spec["beat_end"], insert=spec, vfx=[], _abs_path=str(BG))
        return I.InsertScene(shot, 960, 540, 30, make_vignette(960, 540))

    def test_ink_is_revealed_over_the_beat_and_never_before_it(self):
        sc = self.shot("roster")
        sc.t0 = 10.0
        early = sc.frame(0, 78).astype(int)
        late = sc.frame(77, 78).astype(int)
        sc2 = self.shot("roster")
        sc2.t0 = 10.0
        self.assertFalse(np.array_equal(early, late))
        # the OCT 10 highlight (yellow) is absent at the start and present at the end
        yellow = lambda f: int(((f[..., 0] > 200) & (f[..., 1] > 180) & (f[..., 2] < 150)).sum())
        self.assertGreater(yellow(late), yellow(early) + 200)

    def test_critical_ink_clears_the_caption_zone(self):
        for name in self.TYPES:
            spec = self.specs[name]
            self.assertEqual(I.lint(spec, BG), [], name)

    def test_frames_always_move(self):
        sc = self.shot("scroll_note")
        sc.t0 = 10.0
        a, b = sc.frame(10, 300), sc.frame(11, 300)
        self.assertFalse(np.array_equal(a, b))


if __name__ == "__main__":
    unittest.main()
