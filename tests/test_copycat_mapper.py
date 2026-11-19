"""Mapper unit tests on a tiny synthetic vault + script (no files on disk are touched)."""
import unittest

from copycat import mapper as M
from copycat.domain_gate import AssetDomainGate


def asset(i, subs, loc=None, mood=("quiet",), shot="medium", dom="anime_black_clover", w=1920, h=1080, **kw):
    d = dict(id=i, path=f"x/{i}.jpg", domain=dom, kind="anime_still", source="fandom", file_title=f"File:{i}",
             caption="", page="", width=w, height=h,
             tags=dict(subjects=list(subs), location=loc, mood=list(mood), shotType=shot, aspectRatio="16:9"),
             focus=[0.5, 0.4], quality=0.8)
    d.update(kw)
    return d


def beat(bid, speaker, subjects_list, text="Hello there.", pause=200, **kw):
    vis = [dict(subjects=s, location=None, mood="quiet", shot="medium", query=" ".join(s), non_canon=False)
           for s in subjects_list]
    return dict(id=bid, speaker=speaker, text=text, emotion="x", pause_after_ms=pause, visuals=vis,
                camera=kw.get("camera", "slow_push_in"), vfx=kw.get("vfx", []), sfx=[])


def make_script(beats, card=0):
    return dict(id="t", domain="anime_black_clover", target_wpm=160,
                chapters=[dict(id="c1", numeral=None, title=None, card_seconds=card, music="", beats=beats)])


def make_timing(beats, step=4.0, dur=None):
    tb = [dict(id=b["id"], speaker=b["speaker"], chapter="c1", start=round(i * step + 0.3, 3),
               end=round(i * step + step - 0.4, 3), text=b["text"]) for i, b in enumerate(beats)]
    return dict(duration=dur or len(beats) * step + 0.3, beats=tb, cards=[])


def run_pipeline(assets, beats, overrides=None, timing=None):
    script = make_script(beats)
    gate = AssetDomainGate("anime_black_clover")
    assets = gate.filter(assets)
    timing = timing or make_timing(beats)
    slots, _ = M.build_skeleton(script, timing)
    sc = M.Scorer(assets)
    by_id = {a["id"]: a for a in assets}
    pinned = {}
    key_slot = {f"{s['beat_id']}#{s['cut_index']}": i for i, s in enumerate(slots) if s["type"] == "cut"}
    A = M.Assigner(slots, assets, sc, {})
    for k, ov in (overrides or {}).items():
        i = key_slot[k]
        A.cand[i] = [ov["asset_id"]] + A.cand[i]
        A.base[i].setdefault(ov["asset_id"], 9.0)
        A.pinned[i] = ov["asset_id"]
        A._set(i, ov["asset_id"])
    A.run()
    shots = M.finish_shots(M.build_shots(slots, A.assign, by_id, overrides or {}), slots, overrides or {})
    return shots, A, slots


class MapperTests(unittest.TestCase):
    def test_gate_rejects_true_crime(self):
        beats = [beat("b1", "NARRATOR", [["asta"]])]
        a = [asset("crime", ["asta"], dom="true_crime"), asset("ok", ["asta"])]
        shots, _, _ = run_pipeline(a, beats)
        self.assertEqual(shots[0]["asset_id"], "ok")
        shots2, A, _ = run_pipeline([asset("crime", ["asta"], dom="true_crime")], beats)
        self.assertIsNone(shots2[0]["asset_id"])           # unmatched, never off-domain

    def test_repetition_lock_and_contiguity(self):
        beats = [beat(f"b{i}", "NARRATOR", [["asta"]]) for i in range(30)]
        a = [asset(f"a{i}", ["asta"]) for i in range(6)]
        timing = make_timing(beats, step=2.0)
        shots, _, _ = run_pipeline(a, beats, timing=timing)
        # with 6 assets the lock must leave shots unmatched rather than repeat
        self.assertEqual(M.violations(shots), [])
        self.assertTrue(any(s["asset_id"] is None for s in shots))
        # plenty of assets -> everything matched, no violation, no asset beyond cap
        a = [asset(f"a{i}", ["asta"]) for i in range(40)]
        shots, _, _ = run_pipeline(a, beats, timing=timing)
        self.assertEqual(M.violations(shots), [])
        self.assertTrue(all(s["asset_id"] for s in shots))
        for x, y in zip(shots, shots[1:]):
            self.assertNotEqual(x["asset_id"], y["asset_id"])
        uses = {}
        for s in shots:
            uses[s["asset_id"]] = uses.get(s["asset_id"], 0) + 1
        self.assertLessEqual(max(uses.values()), M.REUSE_CAP)

    def test_contiguity_and_limits(self):
        beats = [beat("b1", "NARRATOR", [["asta"], ["liebe"], ["yuno"]]), beat("b2", "NARRATOR", [["asta"]])]
        timing = make_timing(beats, step=3.0)
        timing["beats"][1]["start"] = 3.3
        timing["duration"] = 30.0                       # last beat runs 3.3 -> 30 s: must split to <= 7.5 s shots
        a = [asset(f"a{i}", ["asta"]) for i in range(10)] + [asset("l", ["liebe"]), asset("y", ["yuno"])]
        shots, _, _ = run_pipeline(a, beats, timing=timing)
        self.assertEqual(shots[0]["start"], 0.0)
        self.assertEqual(shots[-1]["end"], 30.0)
        for x, y in zip(shots, shots[1:]):
            self.assertAlmostEqual(x["end"], y["start"], places=3)
        for s in shots:
            self.assertGreaterEqual(s["end"] - s["start"], M.MIN_SHOT - 1e-3)
            self.assertLessEqual(s["end"] - s["start"], M.MAX_SHOT + 1e-3)
        for x, y in zip(shots, shots[1:]):
            self.assertNotEqual(x["camera"], y["camera"])

    def test_speaker_rule(self):
        beats = [beat("b1", "YAMI", [["noelle", "yami"]])]
        a = [asset("n", ["noelle"], mood=["quiet"], shot="medium"), asset("y", ["yami"], mood=["quiet"], shot="medium")]
        shots, _, _ = run_pipeline(a, beats)
        self.assertIn(shots[0]["asset_id"], ("y",))

    def test_young_variant_rule(self):
        beats = [beat("b1", "NARRATOR", [["asta_young"]])]
        teen = asset("teen", ["asta"], shot="closeup")
        young = asset("kid", ["asta_young"], shot="medium")
        wide = asset("church", ["hage_church"], shot="wide")
        shots, _, _ = run_pipeline([teen, young, wide], beats)
        self.assertEqual(shots[0]["asset_id"], "kid")
        # no young asset: a teen close-up must not be chosen; the atmosphere shot is
        beats = [beat("b1", "NARRATOR", [["asta_young"]])]
        shots, _, _ = run_pipeline([teen, wide], beats)
        self.assertNotEqual(shots[0]["asset_id"], "teen")
        self.assertEqual(shots[0]["asset_id"], "church")

    def test_override_applied_and_validated(self):
        beats = [beat("b1", "NARRATOR", [["asta"]]), beat("b2", "NARRATOR", [["asta"]])]
        a = [asset("a1", ["asta"]), asset("a2", ["asta"]), asset("a3", ["liebe"])]
        shots, _, _ = run_pipeline(a, beats, overrides={"b1#0": {"asset_id": "a3", "focus": [0.2, 0.3]}})
        self.assertEqual(shots[0]["asset_id"], "a3")
        self.assertEqual(shots[0]["focus"], [0.2, 0.3])
        self.assertEqual(M.violations(shots), [])

    def test_captions_split(self):
        long = "This is a long first sentence that goes on and on. And here is a second sentence that also keeps going."
        parts = M.split_caption(long, 0.0, 10.0)
        self.assertEqual(len(parts), 2)
        self.assertAlmostEqual(parts[0][2], parts[1][1])
        self.assertEqual(parts[1][2], 10.0)


if __name__ == "__main__":
    unittest.main()
