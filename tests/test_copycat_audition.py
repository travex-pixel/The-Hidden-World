"""Casting audition: no network, no credit."""
import json
import numpy as np

from copycat import audition as AU, cast_director as CD


def _item(**kw):
    d = {"_id": "x" * 32, "title": "Raspy Young Voice", "description": "a raspy young male voice", "state": "trained", "visibility": "public",
         "languages": ["en"], "tags": ["male", "young", "raspy"], "licensed": False, "dmca_taken_down": False}
    d.update(kw)
    return d


def test_filter_blocks_clones_and_keeps_archetypes():
    assert CD.is_original_voice(_item())[0]
    for bad in (dict(title="Naruto Uzumaki"), dict(title="Kakashi Hatake English Dub"), dict(title="Goku"), dict(title="Sakura Haruno"),
                dict(title="Kurama"), dict(description="Voice of Naruto from the anime"), dict(description="sounds like a famous streamer"),
                dict(title="Donald Trump"), dict(description="clone of a celebrity"), dict(licensed=True), dict(state="draft"),
                dict(dmca_taken_down=True), dict(visibility="private"), dict(languages=["ja"]), dict(title="xX_Voice_Xx"),
                dict(tags=["male", "naruto-fan"])):
        assert not CD.is_original_voice(_item(**bad))[0], bad


def synth_voice(f0, n=36000, sr=24000, noise=0.0):
    t = np.arange(n) / sr
    x = sum(np.sin(2 * np.pi * f0 * k * t) / k for k in range(1, 12)) * 0.2
    return (x + np.random.RandomState(0).randn(n) * noise).astype(np.float32)


def test_f0_tracker_and_rasp_proxy():
    for f in (90, 140, 250):
        m = AU.aggregate([AU.analyze(synth_voice(f), "one two three")])
        assert abs(m["f0_hz"] - f) / f < 0.03
    clean = AU.aggregate([AU.analyze(synth_voice(140), "one two three")])
    rough = AU.aggregate([AU.analyze(synth_voice(140, noise=0.12), "one two three")])
    assert AU.rasp_raw(rough) > AU.rasp_raw(clean)


def test_artefacts_flagged():
    x = np.clip(synth_voice(150) * 8, -1, 1)
    assert "clipping" in AU.aggregate([AU.analyze(x, "a b c")])["artefacts"]
    gap = np.concatenate([synth_voice(150, 12000), np.zeros(24000 * 2, np.float32), synth_voice(150, 12000)])
    assert "long_internal_silence" in AU.aggregate([AU.analyze(gap, "a b c d")])["artefacts"]


def test_distance_prefers_in_band_voice_and_penalises_artefacts():
    role = AU.ROLES["HIRUZEN"]
    good = {"f0_hz": 110, "wpm": 120, "artefacts": [], "centroid_hz": 1500, "f0_range_st": 5, "hnr_db": 5, "hf_ratio": 0.02, "jitter": 0.01}
    off = dict(good, f0_hz=220)
    art = dict(good, artefacts=["clipping"])
    d = lambda m: AU.distance(role, m, None)[0]
    assert d(good) < d(off) and d(good) < d(art)


def test_separation_and_assignment():
    a = {"f0_hz": 120, "centroid_hz": 1500}
    assert not AU.separated(a, {"f0_hz": 125, "centroid_hz": 1550})
    assert AU.separated(a, {"f0_hz": 140, "centroid_hz": 1550})
    assert AU.separated(a, {"f0_hz": 122, "centroid_hz": 2200})

    def c(i, f0, cen, dist):
        return {"_id": i, "title": i, "measured": {"f0_hz": f0, "centroid_hz": cen}, "dist": dist}
    opts = {"A": [c("v1", 120, 1500, 0.0), c("v2", 150, 1500, 1.0)], "B": [c("v3", 122, 1520, 0.0), c("v4", 170, 1500, 0.5)]}
    pick, warns = AU.assign(opts)
    assert separated_ok(pick) and not warns
    assert pick["A"]["_id"] != pick["B"]["_id"]


def separated_ok(pick):
    return AU.separated(pick["A"]["measured"], pick["B"]["measured"])


def test_pick_pins_by_letter_and_id(tmp_path):
    def opt(i, t):
        return {"_id": i, "title": t, "tags": [], "speed": 1.0, "temperature": 0.7, "post_fx": "", "measured": {"f0_hz": 1}}
    ent = dict(opt("a1", "A voice"), pinned=False, options={"A": opt("a1", "A voice"), "B": dict(opt("b1", "B voice"), speed=1.1, post_fx="volume=1dB")}, chosen="A")
    f = tmp_path / "cast.json"
    f.write_text(json.dumps({"cast": {"NARUTO": ent, "CLONE": {"_id": "a1"}, "KAKASHI": dict(ent)}}))
    AU.apply_picks(f, ["NARUTO=B", "KAKASHI=a1"])
    c = json.loads(f.read_text())["cast"]
    assert c["NARUTO"]["_id"] == "b1" and c["NARUTO"]["pinned"] and c["NARUTO"]["speed"] == 1.1 and c["NARUTO"]["chosen"] == "B"
    assert c["CLONE"]["_id"] == "b1" and c["CLONE"]["clone_of"] == "NARUTO" and "pitch=1.03" in c["CLONE"]["post_fx"]
    assert c["KAKASHI"]["_id"] == "a1" and c["KAKASHI"]["pinned"]
    AU.apply_picks(f, ["KAKASHI=ffff"])
    assert json.loads(f.read_text())["cast"]["KAKASHI"]["_id"] == "ffff"


def test_shortlist_prefers_matching_voices_and_is_deterministic():
    pool = [_item(_id=f"{i:032d}", title=f"Voice {i}", tags=["male"], description="calm slow") for i in range(40)]
    pool.append(_item(_id="r" * 32, title="Raspy Boy", description="raspy energetic boy", tags=["male", "young"]))
    s1 = AU.shortlist(pool, "NARUTO", AU.ROLES["NARUTO"], n=5)
    assert s1[0]["_id"] == "r" * 32 and s1 == AU.shortlist(pool, "NARUTO", AU.ROLES["NARUTO"], n=5)


def test_franchise_default_unchanged():
    import copycat.cast_director as cd
    assert cd.CAST_FILE.name == "black-clover-cast.json"
