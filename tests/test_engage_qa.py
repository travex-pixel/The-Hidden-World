"""The version-2 engagement checks (pipeline/engage_qa.py): hook length, save card before the last beat, a short
single-punchline ending. They apply only to episodes that set "engagement_version": 2."""
import sys, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from pipeline import engage_qa  # noqa: E402


def timeline(ids, ends, hook_end=2.4):
    tl, t0 = [], 0.0
    for i, (sid, e) in enumerate(zip(ids, ends)):
        line = {"start": t0 + 0.25, "end": (hook_end if i == 0 else e - 0.3), "text": "word", "words": [{"start": 0.0, "w": "word"}]}
        tl.append({"id": sid, "start": t0, "end": e, "lines": [line]}); t0 = e
    return tl


class VersionTwoChecks(unittest.TestCase):
    def run_checks(self, ids, ends, version=2, hook_end=2.4):
        plan = {"episode": {"engagement_version": version, "scenes": [{}]}}
        return engage_qa.analyse(plan, timeline(ids, ends, hook_end), None)["checks"]

    def test_breakout_shape_passes(self):   # Case File 45: the save card, then the statistic, then a 4 s ending
        c = self.run_checks(["s01_hook", "s02", "s07_lesson", "s08_stat", "s09_end"], [5, 20, 26, 31, 35])
        self.assertTrue(c["hook_line_done_by_2_6s"] and c["save_card_before_last_beat"] and c["single_punchline_ending"])

    def test_save_card_just_before_the_ending_fails(self):   # Case File 59: the tail leaked through the save card
        c = self.run_checks(["s01_hook", "s02", "s06_stat", "s07_lesson", "s08_end"], [5, 20, 25, 29, 33])
        self.assertFalse(c["save_card_before_last_beat"])

    def test_long_ending_and_slow_hook_fail(self):
        c = self.run_checks(["s01_hook", "s05_lesson", "s06", "s07", "s08_end"], [5, 15, 22, 28, 35], hook_end=3.1)
        self.assertFalse(c["single_punchline_ending"]); self.assertFalse(c["hook_line_done_by_2_6s"])

    def test_earlier_episodes_are_not_rejudged(self):
        c = self.run_checks(["s01_hook", "s02", "s07_lesson", "s08_end"], [5, 20, 29, 37], version=1)
        self.assertNotIn("save_card_before_last_beat", c)


if __name__ == "__main__":
    unittest.main()


class VersionThreeSearch(unittest.TestCase):
    def test_search_term_must_be_in_headline_and_said_early(self):
        tl = [{"id": "s01_hook", "start": 0.0, "end": 5.0, "lines": [{"start": 0.25, "end": 2.4, "text": "x",
               "words": [{"start": 0.0, "w": "Louvre"}, {"start": 0.4, "w": "heist"}]}]}]
        ep = {"engagement_version": 3, "id": "none", "search_terms": ["louvre heist"], "scenes": [{}],
              "hook_title": {"lines": [{"text": "THE LOUVRE HEIST"}, {"text": "ONE YEAR LATER"}]}}
        c = engage_qa.analyse({"episode": ep}, tl, None)["checks"]
        self.assertTrue(c["search_term_in_headline_and_first_4s"]); self.assertFalse(c["post_file_ready"])   # no post.md
        ep["hook_title"] = {"lines": [{"text": "ONE YEAR LATER"}]}
        self.assertFalse(engage_qa.analyse({"episode": ep}, tl, None)["checks"]["search_term_in_headline_and_first_4s"])


class VersionFour(unittest.TestCase):
    def test_no_save_card_scene_and_lesson_optional(self):
        tl = timeline(["s01_hook", "s02", "s03", "s04_end"], [5, 15, 30, 34])
        ep = {"engagement_version": 4, "id": "none", "search_terms": [], "scenes": [{}]}
        c = engage_qa.analyse({"episode": ep}, tl, None)["checks"]
        self.assertTrue(c["no_save_card_scene"]); self.assertNotIn("save_card_before_last_beat", c)
        tl2 = timeline(["s01_hook", "s02", "s03_lesson", "s04_end"], [5, 15, 30, 34])
        self.assertFalse(engage_qa.analyse({"episode": ep}, tl2, None)["checks"]["no_save_card_scene"])


class KokoroDeliveryAndMix(unittest.TestCase):
    def test_energy_speeds_up_and_tightens_pauses(self):
        from pipeline import narrate
        calm, hype = narrate.kokoro_delivery("reveal", 0.0), narrate.kokoro_delivery("reveal", 1.0)
        self.assertGreater(hype["speed"], calm["speed"]); self.assertLess(hype["pre"], calm["pre"]); self.assertLess(hype["after"], calm["after"])
        self.assertEqual(narrate.kokoro_text("It got stuck.", "hook", 1.0), "It got stuck!")
        self.assertEqual(narrate.kokoro_text("It got stuck.", "tense", 1.0), "It got stuck.")   # only push tones
        self.assertEqual(narrate.kokoro_text("Whose finger?", "hook", 1.0), "Whose finger?")

    def test_duck_hold_fills_short_gaps_only(self):
        import numpy as np
        from pipeline.mixdown import hold_gaps
        on = np.array([1, 1, 0, 0, 0, 1, 1] + [0] * 60 + [1], float)   # a 60 ms gap, then a 1.2 s gap
        h = hold_gaps(on, 0.8)
        self.assertTrue((h[2:5] == 0.5).all()); self.assertTrue((h[10:60] == 0).all())


class VersionFourEnding(unittest.TestCase):
    def test_v4_wants_one_closing_line(self):
        tl = timeline(["s01_hook", "s02", "s03", "s04_end"], [5, 15, 30, 33.5])
        tl[-1]["lines"].append(dict(tl[-1]["lines"][0]))   # two lines in the last scene
        ep = {"engagement_version": 4, "id": "none", "search_terms": [], "scenes": [{}]}
        self.assertFalse(engage_qa.analyse({"episode": ep}, tl, None)["checks"]["single_punchline_ending"])
        ep["engagement_version"] = 2
        self.assertTrue(engage_qa.analyse({"episode": ep}, tl, None)["checks"]["single_punchline_ending"])


class SoundV5(unittest.TestCase):
    def test_phone_ready_moves_bass_energy_into_the_phone_band(self):
        import numpy as np
        from pipeline.mixdown import phone_ready, band_rms_db, SR
        t = np.arange(int(2 * SR)) / SR; x = (0.3 * np.sin(2 * np.pi * 55 * t)).astype(np.float32)   # a pure sub-bass note
        before, after = band_rms_db(x), band_rms_db(phone_ready(x))
        self.assertGreater(after - before, 15.0)   # what a phone speaker plays rises by far more than 15 dB

    def test_voice_guard_keeps_the_bed_under_the_voice(self):
        import numpy as np
        from pipeline.mixdown import voice_guard, band_rms_db, SR
        r = np.random.default_rng(1); n = int(2 * SR)
        voice = (0.1 * r.standard_normal(n)).astype(np.float32); bed = (0.1 * r.standard_normal(n)).astype(np.float32)   # same level
        g = voice_guard(voice, bed, 12.5)
        self.assertGreater(band_rms_db(voice) - band_rms_db(bed * g), 11.5)


class VersionSix(unittest.TestCase):
    """v6 (Case Files 72-79): the headline case fills the first 9 s with its gotcha inside them, every case has a gotcha,
    the last line calls back to the headline case, 32 s cap, a 3 s end scene, no PART on frame 1."""
    IDS = ["s01_hook", "s02_got", "s03", "s04", "s05_end"]

    def ep(self):
        return {"engagement_version": 6, "id": "none", "search_terms": [],
                "hook_title": {"lines": [{"text": "THE FAKE"}, {"text": "AMBULANCE"}]},
                "scenes": [{"id": "s01_hook", "case": "amb"}, {"id": "s02_got", "case": "amb"}, {"id": "s03", "case": "hearse"},
                           {"id": "s04", "case": "van"}, {"id": "s05_end", "case": "amb"}]}

    def tl(self, ends=(4.5, 9.2, 18, 28.5, 31.2), reveals=(1, 2, 3)):
        tl = timeline(self.IDS, list(ends))
        for i in reveals:
            tl[i]["lines"][0]["tone"] = "reveal"
        tl[-1]["lines"][0]["start"] = ends[-1] - 1.0   # the last word 1 s before the end
        return tl

    def test_payoff_first_shape_passes(self):
        c = engage_qa.analyse({"episode": self.ep()}, self.tl(), None)["checks"]
        for k in ("headline_case_first_9s", "headline_gotcha_by_9s", "gotcha_per_case", "callback_ending", "under_32s",
                  "no_part_on_frame_1", "single_punchline_ending", "ends_within_1s_of_last_word"):
            self.assertTrue(c[k], k)

    def test_but_first_pivot_at_4s_fails(self):   # the leak on every v5 reel: a different case before 9 s
        ep = self.ep(); ep["scenes"][1]["case"] = "hearse"
        c = engage_qa.analyse({"episode": ep}, self.tl(), None)["checks"]
        self.assertFalse(c["headline_case_first_9s"]); self.assertFalse(c["headline_gotcha_by_9s"])

    def test_missing_gotcha_long_cut_part_tag_and_slow_end_fail(self):
        ep = self.ep(); ep["hook_title"]["lines"].append({"text": "DISGUISE FAILS · PART 2"})
        c = engage_qa.analyse({"episode": ep}, self.tl(ends=(4.5, 9.2, 18, 28.5, 33.5), reveals=(1, 2)), None)["checks"]
        self.assertFalse(c["gotcha_per_case"]); self.assertFalse(c["under_32s"]); self.assertFalse(c["no_part_on_frame_1"])
        self.assertFalse(c["single_punchline_ending"])   # a 5 s end scene
        ep["scenes"][-1]["case"] = "van"
        self.assertFalse(engage_qa.analyse({"episode": ep}, self.tl(), None)["checks"]["callback_ending"])

    def test_v5_episodes_are_not_rejudged(self):
        ep = self.ep(); ep["engagement_version"] = 5
        self.assertNotIn("headline_case_first_9s", engage_qa.analyse({"episode": ep}, self.tl(), None)["checks"])


class VersionSeven(VersionSix):
    """v7: the headline leads with the object, not "POLICE SAY"; 29.5 s cap (the 28-second cut)."""
    def ep(self):
        e = super().ep(); e["engagement_version"] = 7; return e

    def test_object_first_headline_and_28s_cut_pass(self):
        c = engage_qa.analyse({"episode": self.ep()}, self.tl(ends=(4.5, 9.2, 17, 25.5, 28.2)), None)["checks"]
        self.assertTrue(c["headline_leads_with_object"]); self.assertTrue(c["under_29_5s"]); self.assertTrue(c["under_32s"])

    def test_police_say_first_and_31s_fail(self):
        ep = self.ep(); ep["hook_title"]["lines"][0]["text"] = "POLICE SAY HE ROBBED"
        c = engage_qa.analyse({"episode": ep}, self.tl(), None)["checks"]   # 31.2 s
        self.assertFalse(c["headline_leads_with_object"]); self.assertFalse(c["under_29_5s"])
        ep["hook_title"]["lines"][0]["text"] = "ACCUSED OF ROBBING"
        self.assertFalse(engage_qa.analyse({"episode": ep}, self.tl(), None)["checks"]["headline_leads_with_object"])

    def test_v6_episodes_are_not_rejudged_by_v7(self):
        ep = self.ep(); ep["engagement_version"] = 6
        self.assertNotIn("headline_leads_with_object", engage_qa.analyse({"episode": ep}, self.tl(), None)["checks"])


class VersionEight(VersionSeven):
    """v8: the spoken hook is an agent-first statement with a lane word; the episode declares a proven lane."""
    def ep(self):
        e = super().ep(); e["engagement_version"] = 8; e["lane"] = "border"; return e

    def tl8(self, hook):
        tl = self.tl(ends=(4.5, 9.2, 17, 25.5, 28.2)); tl[0]["lines"][0]["text"] = hook; return tl

    def test_smugglers_built_passes(self):
        c = engage_qa.analyse({"episode": self.ep()}, self.tl8("Smugglers built a cannon to fire weed over the border."), None)["checks"]
        self.assertTrue(c["hook_agent_first"]); self.assertTrue(c["hook_in_lane"]); self.assertTrue(c["lane_locked"])

    def test_police_say_question_and_pronoun_hooks_fail(self):
        for hook in ("Police say two brothers stole a bridge.", "His getaway vehicle? A donkey.", "Their plan was a tunnel.", "In 2011, smugglers built a tunnel."):
            c = engage_qa.analyse({"episode": self.ep()}, self.tl8(hook), None)["checks"]
            self.assertFalse(c["hook_agent_first"], hook)

    def test_off_lane_hook_and_lane_fail(self):
        ep = self.ep(); ep["lane"] = "getaways"
        c = engage_qa.analyse({"episode": ep}, self.tl8("A burglar fell asleep in a stranger's bed."), None)["checks"]
        self.assertTrue(c["hook_agent_first"]); self.assertFalse(c["hook_in_lane"]); self.assertFalse(c["lane_locked"])

    def test_v7_episodes_are_not_rejudged_by_v8(self):
        ep = self.ep(); ep["engagement_version"] = 7
        self.assertNotIn("hook_agent_first", engage_qa.analyse({"episode": ep}, self.tl8("Police say x."), None)["checks"])


class VersionNine(VersionEight):
    """v9: the first sentence is what the smugglers made: <= 8 words, a making verb, no number (batch 5: 17.0 / 28.6 / 30.4 % skip)."""
    def ep(self):
        e = super().ep(); e["engagement_version"] = 9; e["lane"] = "smuggling"; return e

    def test_making_verb_hooks_pass(self):
        for hook in ("Drug smugglers turned cocaine into a jacket. Seized in Nepal.", "Smugglers built a drone sub run by Starlink.",
                     "Smugglers dressed meth up as watermelons.", "Smugglers drove their Jeep up the border fence."):
            c = engage_qa.analyse({"episode": self.ep()}, self.tl8(hook), None)["checks"]
            self.assertTrue(c["hook_making_verb"], hook); self.assertTrue(c["hook_agent_first"], hook)

    def test_quantity_long_and_verbless_hooks_fail(self):
        for hook in ("Smugglers loaded a ship with a billion in cocaine.", "Smugglers built a cannon to fire 1,800 pounds of weed.",
                     "Smugglers built a cannon into a van and fired it over the fence.", "A fake ambulance. Full of cocaine."):
            c = engage_qa.analyse({"episode": self.ep()}, self.tl8(hook), None)["checks"]
            self.assertFalse(c["hook_making_verb"], hook)

    def test_v8_episodes_are_not_rejudged_by_v9(self):
        ep = self.ep(); ep["engagement_version"] = 8
        self.assertNotIn("hook_making_verb", engage_qa.analyse({"episode": ep}, self.tl8("Smugglers loaded a ship with a billion in cocaine."), None)["checks"])


class VersionTen(VersionNine):
    """v10 (ONE SMUGGLER): the person turn by 12 s, a NEXT FILE sign-off, <= 35.5 s."""
    def ep(self):
        e = super().ep(); e["engagement_version"] = 10
        e["end_title"] = {"lines": [{"text": "DUPED OR GUILTY?"}, {"text": "NEXT FILE: THE JUNGLE PILOT"}]}
        for sc in e["scenes"]:
            sc.pop("beat", None)
        e["scenes"][2]["beat"] = "person"
        return e

    def test_v10_passes_when_person_turn_early_and_signoff_named(self):
        c = engage_qa.analyse({"episode": self.ep()}, self.tl8("A smuggler taped cocaine under his wig."), None)["checks"]
        self.assertTrue(c["person_turn_by_12s"]); self.assertTrue(c["next_file_signoff"]); self.assertTrue(c["under_35_5s"])

    def test_v10_fails_without_person_beat_or_signoff(self):
        ep = self.ep(); ep["scenes"][2].pop("beat"); ep["end_title"]["lines"][1]["text"] = "FOLLOW FOR MORE"
        c = engage_qa.analyse({"episode": ep}, self.tl8("A smuggler taped cocaine under his wig."), None)["checks"]
        self.assertFalse(c["person_turn_by_12s"]); self.assertFalse(c["next_file_signoff"])

    def test_v10_allows_34s_cuts(self):
        c = engage_qa.analyse({"episode": self.ep()}, self.tl(ends=(4.5, 9.2, 18, 28.5, 34.0)), None)["checks"]
        self.assertTrue(c["under_29_5s"]); self.assertTrue(c["under_32s"]); self.assertTrue(c["under_35_5s"])

    def test_missing_gotcha_long_cut_part_tag_and_slow_end_fail(self):
        # v10: the v6/v7 caps are replaced by under_35_5s; everything else from v6 still applies
        ep = self.ep(); ep["hook_title"]["lines"].append({"text": "DISGUISE FAILS · PART 2"})
        c = engage_qa.analyse({"episode": ep}, self.tl(ends=(4.5, 9.2, 18, 28.5, 36.0), reveals=(1, 2)), None)["checks"]
        self.assertFalse(c["gotcha_per_case"]); self.assertTrue(c["under_32s"]); self.assertFalse(c["under_35_5s"]); self.assertFalse(c["no_part_on_frame_1"])

    def test_police_say_first_and_31s_fail(self):
        ep = self.ep(); ep["hook_title"]["lines"][0]["text"] = "POLICE SAY HE ROBBED"
        c = engage_qa.analyse({"episode": ep}, self.tl(), None)["checks"]   # 31.2 s is fine on v10
        self.assertFalse(c["headline_leads_with_object"]); self.assertTrue(c["under_29_5s"]); self.assertTrue(c["under_35_5s"])



class VersionEleven(VersionTen):
    """v11: a turn (reveal/tense/curious line) every 7 s, and a three-line end card."""
    def ep(self):
        e = super().ep(); e["engagement_version"] = 11
        e["end_title"] = {"lines": [{"text": "DUPED OR GUILTY?"}, {"text": "SEND TO THE MATE WHO'D RUN"}, {"text": "NEXT FILE: THE JUNGLE PILOT"}]}
        return e

    def tl11(self, hook, turn_starts):
        tl = self.tl8(hook)
        for sc in tl:
            for ln in sc["lines"]:
                ln["tone"] = "confident"
        # place turn lines at the requested seconds inside whichever scene holds them
        for t in turn_starts:
            sc = next(s for s in tl if s["start"] <= t < s["end"])
            sc["lines"].append({"text": "Then it turned.", "start": t, "end": t + 1.0, "tone": "reveal"})
        return tl

    def test_turn_every_7s_passes_and_biography_gap_fails(self):
        ok = engage_qa.analyse({"episode": self.ep()}, self.tl11("A smuggler taped cocaine under his wig.", [6.0, 12.0, 18.0, 24.0]), None)["checks"]
        self.assertTrue(ok["reveal_every_7s"]); self.assertTrue(ok["end_card_3_lines"])
        bad = engage_qa.analyse({"episode": self.ep()}, self.tl11("A smuggler taped cocaine under his wig.", [6.0, 24.0]), None)["checks"]
        self.assertFalse(bad["reveal_every_7s"])

    def test_four_line_end_card_fails(self):
        ep = self.ep(); ep["end_title"]["lines"].append({"text": "THE HIDDEN WORLD · CASE FILE 1"})
        self.assertFalse(engage_qa.analyse({"episode": ep}, self.tl11("A smuggler taped cocaine under his wig.", [6.0, 12.0, 18.0, 24.0]), None)["checks"]["end_card_3_lines"])

    def test_v10_fails_without_person_beat_or_signoff(self):
        ep = self.ep(); ep["scenes"][2].pop("beat"); ep["end_title"]["lines"][2]["text"] = "FOLLOW FOR MORE"
        c = engage_qa.analyse({"episode": ep}, self.tl8("A smuggler taped cocaine under his wig."), None)["checks"]
        self.assertFalse(c["person_turn_by_12s"]); self.assertFalse(c["next_file_signoff"])
