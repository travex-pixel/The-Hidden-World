import json
from pathlib import Path

from copycat import packaging, shorts

ROOT = Path(__file__).resolve().parent.parent


def _beats(cold=6, cold_len=6.5):
    t, out = 0.0, []

    def add(ch, sp, text, d):
        nonlocal t
        out.append(dict(id=f"b{len(out)}", chapter=ch, speaker=sp, text=text, start=t, end=t + d))
        t += d + 0.3
    for i in range(cold):
        add("cold_open", "NARRATOR", "one two three four five six", cold_len)
    add("ch1", "NARRATOR", "filler words here", 20)
    add("ch2", "LIEBE", "Why aren't you scared, boy?", 2.5)
    add("ch2", "ASTA", "Your name is Liebe.", 1.2)
    for i in range(6):
        add("ch2", "LIEBE" if i % 2 else "ASTA", f"line {i} words here", 3)
    add("ch2", "ASTA", "Last time, I was fifteen years late.", 3)
    add("ch2", "LIEBE", "Last time? What does that mean?", 2.4)
    add("ch2", "ASTA", "To sit here for a minute. With my brother.", 3)
    add("ch2", "LIEBE", "You are the stupidest human.", 2.5)
    return out


def test_titles_length_and_count():
    assert len(packaging.TITLES) == 3
    assert all(len(t) <= packaging.MAX_TITLE for t in packaging.TITLES)
    assert 12 <= len(packaging.TAGS) <= 18 and len(packaging.HASHTAGS) == 3


def test_selection_window_any_cold_length():
    for cold_len in (3.0, 4.5, 6.5, 8.0):
        sel = shorts.select_segments(_beats(cold_len=cold_len))
        assert 45 <= sel["total"] <= 60, (cold_len, sel)
        assert sel["total"] <= 57.0 + 1e-6 or sel["total"] < 60
        (a0, a1), (b0, b1) = sel["segments"]
        assert a0 == 0 and b0 >= a1


def test_selection_starts_at_why_and_ends_on_preferred_beat():
    beats = _beats(cold_len=3.0)   # short cold open: everything fits
    sel = shorts.select_segments(beats)
    first = next(b for b in beats if b["text"].startswith("Why aren't you"))
    assert sel["exchange"][0] == first["id"]          # fallback by text only because the synthetic ids differ
    last = next(b for b in beats if b["text"].startswith("Last time, I was"))
    assert sel["exchange"][1] == last["id"]
    # selection by beat id (the live script's ids), independent of the text
    for b in beats:
        if b["id"] == first["id"]:
            b["text"] = "totally different words"
    sel = shorts.select_segments(beats, start_id=first["id"], end_id=last["id"])
    assert sel["exchange"] == (first["id"], last["id"])


def test_selection_never_ends_beyond_budget():
    sel = shorts.select_segments(_beats(cold_len=7.0))
    assert sel["total"] <= 57.0 + 1e-6


def test_chunking():
    for n in range(1, 30):
        ch = shorts.chunk_words(list("w" * n))
        assert sum(map(len, ch)) == n
        assert all(len(c) <= 4 for c in ch)
        if n > 1:
            assert all(len(c) >= 2 for c in ch)


def test_caption_sentence_boundaries_and_char_timing():
    text = "Wait now. Last time, I was fifteen years late. Go!"
    chunks = shorts.beat_chunks(text)
    sents = ["Wait now.", "Last time, I was fifteen years late.", "Go!"]
    for c in chunks:
        assert sum(c in s for s in sents) >= 1 and 1 <= len(c.split()) <= 4
    assert "".join(chunks).replace(" ", "") == text.replace(" ", "")
    b = [dict(id="x", chapter="c", speaker="ASTA", text=text, start=10.0, end=20.0)]
    ev = shorts.caption_events(b, 9.0, 21.0)
    assert abs(ev[0]["start"] - 1.0) < 1e-6 and abs(ev[-1]["end"] - 11.0) < 1e-6
    d = [e["end"] - e["start"] for e in ev]
    ratios = [x / len(e["text"]) for x, e in zip(d, ev)]
    assert max(ratios) - min(ratios) < 1e-6


def test_real_timing_if_present():
    p = ROOT / "build/copycat/bc-whatif-ep01/audio/timing.json"
    if p.exists():
        sel = shorts.select_segments(json.load(open(p))["beats"])
        assert 45 <= sel["total"] <= 60


# ---------------------------------------------------------------- project-aware packaging / spec shorts
def test_black_clover_packaging_unchanged():
    p = packaging.build("bc-whatif-ep01")
    assert p["titles"] == packaging.TITLES and p["tags"] == packaging.TAGS
    assert "Yūki Tabata" in p["description"] and "upload_checklist" not in p


def test_naruto_packaging_contract():
    p = packaging.build("naruto-whatif-ep01")
    t = p["titles"]
    assert t[0] == "What If Naruto Read ONE More Line Of The Forbidden Scroll? — Part 1" and len(t[0]) <= 100
    assert len(t) == 3 and all(len(x) <= 70 for x in t[1:])
    assert 15 <= len(p["tags"]) <= 20 and len(p["hashtags"]) == 3
    d = p["description"]
    assert "canon" in d[:150].lower() and "Masashi Kishimoto" in d and "Part 1 of 4" in d
    assert "mother" in d and "AI-generated" in d
    assert p["upload_checklist"] and any("synthetic" in x.lower() for x in p["upload_checklist"])
    assert p["chapters"][0]["time"] == "0:00"
    secs = [int(m) * 60 + int(s) for m, s in (c["time"].split(":") for c in p["chapters"])]
    assert secs == sorted(secs) and all(b - a >= 10 for a, b in zip(secs, secs[1:]))


def _spec_beats():
    return [dict(id=f"b{i:03d}", chapter="c", speaker="NARRATOR", text="words here now", start=i * 5.0, end=i * 5.0 + 4.6)
            for i in range(30)]


def test_plan_short_ranges_merge_and_bounds():
    pl = shorts.plan_short(_spec_beats(), dict(name="x", ranges=[["b001", "b004"], ["b005", "b008"], ["b012", "b014"]]))
    assert len(pl["segments"]) == 2                      # b004/b005 are adjacent -> merged
    assert 40 <= pl["total"] <= 58
    (a0, a1), (b0, b1) = pl["segments"]
    assert a1 <= b0 and a0 >= 5.0 - shorts.PRE - 1e-6


def test_plan_short_rejects_out_of_range_duration():
    for rng in ([["b001", "b002"]], [["b004", "b001"]]):
        try:
            shorts.plan_short(_spec_beats(), dict(name="x", ranges=rng))
        except ValueError:
            continue
        raise AssertionError(f"{rng} should be rejected")


def test_naruto_shorts_spec_fits_real_timing():
    p = ROOT / "build/copycat/naruto-whatif-ep01/audio/timing.json"
    spec = shorts.load_spec("naruto-whatif-ep01")
    assert [s["name"] for s in spec["shorts"]] and len(spec["shorts"]) == 3
    if p.exists():
        beats = json.load(open(p))["beats"]
        for s in spec["shorts"]:
            assert 40 <= shorts.plan_short(beats, s)["total"] <= 58, s["name"]


def test_naruto_thumbnails_if_rendered():
    from PIL import Image
    d = ROOT / "releases/copycat/naruto-whatif-ep01"
    for n in ("thumbnail.png", "thumbnail_b.png", "thumbnail_c.png"):
        if (d / n).exists():
            assert Image.open(d / n).size == (1280, 720) and (d / n).stat().st_size < 2_000_000


import unittest  # noqa: E402  (the repo runs `unittest discover`; expose the module-level checks to it)


class PackagingChecks(unittest.TestCase):
    def test_all(self):
        for name, fn in sorted(globals().items()):
            if name.startswith("test_") and callable(fn):
                fn()
