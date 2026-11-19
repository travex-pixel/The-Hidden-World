"""Franchise-aware audio engine + script validator (Naruto series). Fast, no synthesis."""
import json
import numpy as np
import pytest

from copycat import audio_drama as AD, audio_profile as AP, pronunciation as PR, sfx as SFX, music as MUSIC, script_tools as ST, voicecast as VC

SR = AD.SR
NP = AP.profile_for("naruto")


def _beat(i, sp="CLONE", pc="banter", **kw):
    return {"id": f"b{i}", "speaker": sp, "text": f"line {i}", "pause_class": pc, "sfx": [], **kw}


def _chapters():
    return [{"id": "ch1", "numeral": "I", "title": "X", "card_seconds": 3.2, "music": "iruka_warm",
             "music_changes": [{"beat": "b3", "cue": "archive_hushed"}],
             "beats": [_beat(1), _beat(2), _beat(3, "NARRATOR", "turn", stamp={"label": "CANON", "note": "n"}), _beat(4, "NARUTO", "reveal")]}]


def test_black_clover_profile_is_unchanged():
    bc = AP.profile_for("black-clover")
    for pc, rng in AD.PAUSE_CLASSES.items():
        for i in range(30):
            b = {"id": f"x{i}", "pause_class": pc}
            assert AD.pause_for(b) == AD.pause_for(b, bc)
    assert AD.pause_for({"id": "q", "pause_after_ms": 10}, bc) == AD.clamp_pause_ms(10)
    assert AP.profile_for(None)["id"] == "black-clover" and AP.profile_for("unknown")["id"] == "black-clover"


def test_naruto_pause_ranges_are_tight():
    for pc, (lo, hi) in {"banter": (110, 160), "turn": (200, 260), "reveal": (450, 600)}.items():
        for i in range(60):
            assert lo <= AD.pause_for({"id": f"x{i}", "pause_class": pc}, NP) <= hi


def test_clone_runs_overlap_and_card_gap_and_music_changes_and_stamps():
    durs = {f"b{i}": SR for i in (1, 2, 3, 4)}
    tl = AD.build_timeline(_chapters(), durs, prof=NP)
    b = {x["id"]: x for x in tl["beats"]}
    assert b["b1"]["pause_ms"] == -70 and b["b2"]["start"] == pytest.approx(b["b1"]["end"] - 0.07)   # clone vs clone overlap
    assert b["b2"]["pause_ms"] >= 100                       # CLONE -> NARRATOR is a normal banter pause
    assert tl["cards"][0]["end"] - tl["cards"][0]["start"] == pytest.approx(0.9)
    assert [(s["cue"]) for s in tl["sections"]] == ["iruka_warm", "archive_hushed"]
    assert tl["sections"][1]["start"] == pytest.approx(b["b3"]["start"])
    assert b["b3"]["stamp"]["label"] == "CANON" and "stamp" not in b["b1"]
    assert tl["beats"][0]["start"] == pytest.approx(NP["lead_in_s"] + 0.9)
    gaps = AD.dialogue_gaps(tl)
    assert max(gaps) <= AD.MAX_DIALOGUE_GAP_S


def test_black_clover_timeline_unchanged_without_profile():
    ch = [{"id": "c", "numeral": None, "title": None, "card_seconds": 0, "music": "tension_pulse", "beats": [_beat(1), _beat(2)]}]
    tl = AD.build_timeline(ch, {"b1": SR, "b2": SR})
    assert tl["beats"][0]["start"] == 0.35 and tl["beats"][0]["pause_ms"] >= 160     # no overlap for BC


def test_stamp_event_and_thunk_length():
    ev = SFX.plan_events([{"start": 10.0, "end": 12.0, "sfx": [], "stamp": {"label": "CANON"}}, {"start": 20.0, "end": 21.0, "sfx": []}], [])
    st = [e for e in ev if e["name"] == "stamp_thunk"]
    assert len(st) == 1 and st[0]["start"] == pytest.approx(10.25)
    x = SFX.render("stamp_thunk")
    assert len(x) / SR <= 0.35 and np.isfinite(x).all() and np.abs(x).max() == pytest.approx(1.0)


def test_naruto_music_palette_renders():
    for cue in ("clone_comedy", "iruka_warm", "archive_hushed", "bell_test_taut", "kurama_cavernous"):
        x = MUSIC.render_cue(cue, 5.0, seed=1)
        assert x.shape[1] == 2 and np.isfinite(x).all() and np.abs(x).max() > 0.01


def test_naruto_pronunciation_spoken_only():
    f = PR.apply_anime_pronunciation_map
    assert f("Naruto Uzumaki met Kakashi Hatake.", "naruto") == "Nah-roo-toh Oo-zoo-mah-kee met Kah-kah-shee Hah-tah-keh."
    assert f("Mizuki-sensei? Hokage jutsu.", "naruto") == "Mee-zoo-kee-sen-say? Hoh-kah-geh joot-soo."
    assert f("Liebe") == "Lee-beh"                            # default set unchanged
    assert PR.build_spoken({"text": "Naruto!", "direction": "[loud]"}, "naruto") == "[loud] Nah-roo-toh!"


def test_role_fallback_clone_uses_naruto_voice():
    cast = {"NARUTO": {"_id": "n"}, "NARRATOR": {"_id": "x"}}
    assert VC.fish_entry(cast, "CLONE", None, NP["role_fallback"])[0] == "NARUTO"
    assert VC.missing_roles(cast, ["CLONE", "KAKASHI"], NP["role_fallback"]) == ["KAKASHI"]
    assert VC.fish_cast_path("naruto").name == "naruto-cast.json" and VC.fish_cast_path(None).name == "black-clover-cast.json"


# ---- script validator

def _script(**kw):
    s = json.loads((AD.ROOT / "copycat" / "projects" / "naruto-whatif-ep01" / "script.json").read_text())
    s.update(kw)
    return s


def test_naruto_script_validates_and_has_canon_stamps():
    s = _script()
    assert ST.validate(s) == []
    assert 6 <= sum("stamp" in b for c in s["chapters"] for b in c["beats"]) <= 9


def test_validator_targets_override_and_later_speakers():
    s = _script()
    s["targets"] = {"words": [100, 200], "beats": [1, 5], "stamps": [0, 1]}
    P = ST.profile(s)
    assert P["words"] == (100, 200) and P["beats"] == (1, 5)
    assert {"DANZO", "ZABUZA", "HAKU", "KABUTO", "OROCHIMARU", "JIRAIYA"} <= set(P["speaker_subjects"]) | P["speakers"]
    assert "ZABUZA" in P["speaker_subjects"]
    with pytest.raises(ValueError):
        ST.profile(_script(targets={"nonsense": 1}))


def test_validator_rejects_bad_stamp_and_unknown_speaker():
    s = _script()
    b = s["chapters"][0]["beats"][3]
    b["stamp"] = {"label": "FAKE", "note": "x" * 61}
    assert any("bad stamp" in e for e in ST.validate(s))
    s = _script()
    s["chapters"][0]["beats"][1]["speaker"] = "BOB"
    assert any("BOB" in e for e in ST.validate(s))


def test_black_clover_script_still_validates():
    s = json.loads((AD.ROOT / "copycat" / "projects" / "bc-whatif-ep01" / "script.json").read_text())
    assert ST.validate(s) == []
