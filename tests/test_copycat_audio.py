"""Fast unit tests for the Copycat audio engine. Synthesis tests are skipped when piper is missing."""
import json
import numpy as np
import pytest

from copycat import audio_drama as AD, voicecast as VC, sfx as SFX, music as MUSIC

SR = AD.SR


def _chapters():
    def beat(i, pause, sfx=None):
        return {"id": f"b{i}", "speaker": "NARRATOR", "text": f"line {i}", "pause_after_ms": pause, "sfx": sfx or []}
    return [
        {"id": "cold_open", "numeral": None, "title": None, "card_seconds": 0, "music": "tension_pulse", "beats": [beat(1, 240), beat(2, 9999)]},
        {"id": "ch1", "numeral": "I", "title": "Hage", "card_seconds": 4.0, "music": "pastoral_melancholy", "beats": [beat(3, 10, ["bass_drop"]), beat(4, None, ["riser"])]},
    ]


def test_pause_clamping():
    assert AD.clamp_pause_ms(10) == 150
    assert AD.clamp_pause_ms(9999) == 700
    assert AD.clamp_pause_ms(None) == 240
    assert AD.clamp_pause_ms("abc") == 240
    assert AD.clamp_pause_ms(320) == 320


def test_timeline_assembly():
    durs = {"b1": 2 * SR, "b2": SR, "b3": SR // 2, "b4": 3 * SR}
    tl = AD.build_timeline(_chapters(), durs)
    b = {x["id"]: x for x in tl["beats"]}
    assert b["b1"]["start"] == 0.35 and b["b1"]["end"] == 2.35
    assert b["b2"]["start"] == pytest.approx(2.59)           # 240 ms pause
    assert b["b3"]["start"] == pytest.approx(b["b2"]["end"] + 0.7 + 4.0)  # clamped 700 ms + 4 s card
    assert tl["cards"][0]["start"] == pytest.approx(b["b2"]["end"] + 0.7)
    assert tl["cards"][0]["end"] - tl["cards"][0]["start"] == pytest.approx(4.0)
    assert b["b4"]["start"] == pytest.approx(b["b3"]["end"] + 0.15)  # 10 ms -> 150 ms
    assert tl["duration"] == pytest.approx(b["b4"]["end"] + AD.TAIL_S)
    assert [s["cue"] for s in tl["sections"]] == ["tension_pulse", "pastoral_melancholy"]
    assert tl["sections"][1]["start"] == pytest.approx(tl["cards"][0]["start"])
    for x in tl["beats"]:                                      # 1 ms precision
        assert round(x["start"], 3) == x["start"] and round(x["end"], 3) == x["end"]


def test_dialogue_gaps_exclude_cards_and_stay_under_limit():
    durs = {"b1": SR, "b2": SR, "b3": SR, "b4": SR}
    tl = AD.build_timeline(_chapters(), durs)
    gaps = AD.dialogue_gaps(tl)
    assert len(gaps) == len(tl["beats"]) - 1          # first beat follows the lead-in; the carded beat is excluded
    assert max(gaps) <= AD.MAX_DIALOGUE_GAP_S
    assert 4.0 not in gaps


def test_duck_curve_levels():
    durs = {"b1": SR, "b2": SR, "b3": SR, "b4": SR}
    tl = AD.build_timeline(_chapters(), durs)
    c = AD.duck_curve(tl, tl["duration"])
    mid_speech = c[int((tl["beats"][0]["start"] + 0.5) * 100)]
    card_mid = c[int((tl["cards"][0]["start"] + 3.0) * 100)]
    tail = c[int((tl["duration"] - 0.3) * 100)]
    assert card_mid > mid_speech + 6
    assert tail > mid_speech + 5


def test_pronunciation_mapping():
    t = VC.normalize_text("Liebe, Licita and Yuno met Revchi in Hage; Novachrono and Vangeance held the grimoire and Ki.")
    for want in ("Lee-beh", "Lih-chee-ta", "Yoo-no", "Rev-chee", "Hah-geh", "Nova-krono", "Van-jance", "grim-wahr", "Key"):
        assert want in t
    assert "Kicker" in VC.normalize_text("Kicker")       # whole words only
    assert VC.normalize_text("Not a ki word") == "Not a ki word"
    assert VC.normalize_text("In 1500 years, 100%.") == "In one thousand five hundred years, one hundred percent."
    assert VC.normalize_text("He [sighs] left — slowly") == "He left, slowly"
    segs = VC.pron_segments("Liebe spoke to Ki.")
    assert segs[0][0] == "ipa" and any(k == "text" and "Key" in s for k, s in segs)


def test_cast_has_everyone_and_sane_fields():
    cast = VC.load_cast()
    for sp in ("NARRATOR", "ASTA", "LIEBE", "YUNO", "YAMI", "REVCHI", "JULIUS", "FATHER_ORSI", "SISTER_LILY", "DEFAULT"):
        e = cast[sp]
        assert {"model", "speaker", "length_scale", "noise_scale", "noise_w", "pitch_semitones", "fx", "gain_db"} <= set(e)
    assert VC.entry_for(cast, "NOBODY") is cast["DEFAULT"]
    assert cast["LIEBE"]["pitch_semitones"] < 0 and cast["YAMI"]["pitch_semitones"] <= -2 and cast["ASTA"]["pitch_semitones"] > 0


def test_sfx_event_placement():
    beats = [{"start": 10.0, "end": 12.0, "sfx": ["riser", "bass_drop", "wind"]},
             {"start": 12.3, "end": 14.0, "sfx": ["wind", "whoosh"]},
             {"start": 20.0, "end": 21.0, "sfx": ["sword_ring"]}]
    ev = SFX.plan_events(beats, [5.0])
    by = {}
    for e in ev: by.setdefault(e["name"], []).append(e)
    assert by["riser"][0]["start"] + by["riser"][0]["dur"] == pytest.approx(10.0)        # riser ENDS at beat start
    assert by["bass_drop"][0]["start"] == 10.0 and by["sword_ring"][0]["start"] == 20.0
    assert len(by["wind"]) == 1 and by["wind"][0]["start"] < 10.0 and by["wind"][0]["start"] + by["wind"][0]["dur"] > 14.0  # merged bed
    assert by["card_boom"][0]["start"] == 5.0
    assert all(-16 <= e["rel_db"] <= -6 or e["rel_db"] <= -17 for e in ev)


def test_all_sfx_render_finite_and_peak_normalised():
    for name in SFX.EFFECTS:
        x = SFX.render(name, 1.5 if name in SFX.BEDS else None)
        assert x.ndim == 2 and x.shape[1] == 2 and np.isfinite(x).all()
        assert np.abs(x).max() == pytest.approx(1.0, abs=1e-3)


def test_music_renders_continuous_without_silence():
    secs = [{"cue": "tension_pulse", "start": 0, "end": 6}, {"cue": "ominous_grand", "start": 6, "end": 12}]
    x = MUSIC.render_score(secs, 12.0, seed=3)
    assert x.shape == (12 * SR + 1, 2) and np.isfinite(x).all()
    for i in range(1, 11):
        seg = x[i * SR:(i + 1) * SR]
        assert 20 * np.log10(np.sqrt((seg ** 2).mean()) + 1e-12) > -50


needs_piper = pytest.mark.skipif(not VC.piper_available(), reason="piper-tts not installed")


@needs_piper
def test_synth_line_trim_level_and_cache(tmp_path, monkeypatch):
    monkeypatch.setattr(VC, "CACHE", tmp_path)
    cast = VC.load_cast()
    x, dry = VC.synth_line("The book is open.", cast["NARRATOR"], use_cache=False)
    assert 0.5 < dry / SR < 4 and np.abs(x).max() < 0.95
    lead = np.where(np.abs(x) > 0.02 * np.abs(x).max())[0][0]
    assert lead / SR <= 0.045
    assert VC.speech_rms_db(x[:dry]) == pytest.approx(VC.TARGET_RMS_DB + cast["NARRATOR"]["gain_db"], abs=0.5)
    x2, dry2 = VC.synth_line("The book is open.", cast["NARRATOR"])
    x3, dry3 = VC.synth_line("The book is open.", cast["NARRATOR"])
    assert dry2 == dry3 and np.array_equal(x2, x3)
