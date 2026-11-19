import json
from pathlib import Path

from copycat import packaging, shorts

ROOT = Path(__file__).resolve().parent.parent


def _beats():
    t, out = 0.0, []
    def add(ch, sp, text, d):
        nonlocal t
        out.append(dict(id=f"b{len(out)}", chapter=ch, speaker=sp, text=text, start=t, end=t + d))
        t += d + 0.3
    for i in range(6):
        add("cold_open", "NARRATOR", "one two three four five six", 6.5)
    add("ch1", "NARRATOR", "filler words here", 20)
    add("ch2", "LIEBE", "Why are you not afraid, boy?", 2.5)
    add("ch2", "ASTA", "Your name is Liebe.", 1.2)
    for i in range(6):
        add("ch2", "LIEBE" if i % 2 else "ASTA", f"line {i} words here", 3)
    add("ch2", "ASTA", "Last time, I was fifteen years late.", 3)
    add("ch2", "LIEBE", "Last time? What does that mean?", 2.4)
    return out


def test_titles_length_and_count():
    assert len(packaging.TITLES) == 3
    assert all(len(t) < 65 for t in packaging.TITLES)
    assert 12 <= len(packaging.TAGS) <= 18 and len(packaging.HASHTAGS) == 3


def test_selection_window():
    sel = shorts.select_segments(_beats())
    assert 45 <= sel["total"] <= 60
    (a0, a1), (b0, b1) = sel["segments"]
    assert a0 == 0 and b0 >= a1
    assert sel["exchange"][1].startswith("b")


def test_selection_trims_from_start_and_ends_on_last_time():
    beats = _beats()
    sel = shorts.select_segments(beats)
    last = next(b for b in beats if b["text"].startswith("Last time, I was"))
    assert sel["exchange"][1] == last["id"]
    first = next(b for b in beats if b["text"].startswith("Why are you"))
    assert sel["exchange"][0] != first["id"]  # trimmed


def test_selection_extends_when_short():
    beats = [b for b in _beats() if b["chapter"] != "cold_open" or b["id"] in ("b0", "b1")]
    t0 = 0
    sel = shorts.select_segments(beats, lo=20, hi=60)
    assert sel["total"] >= 20


def test_chunking():
    for n in range(1, 30):
        ch = shorts.chunk_words(list("w" * n))
        assert sum(map(len, ch)) == n
        assert all(len(c) <= 4 for c in ch)
        if n > 1:
            assert all(len(c) >= 2 for c in ch)


def test_caption_events_cover_beat_evenly():
    b = [dict(id="x", chapter="c", speaker="ASTA", text="a b c d e f g h", start=10.0, end=18.0)]
    ev = shorts.caption_events(b, 9.0, 20.0)
    assert len(ev) == 2
    assert abs(ev[0]["start"] - 1.0) < 1e-6 and abs(ev[-1]["end"] - 9.0) < 1e-6
    assert abs(ev[0]["end"] - ev[1]["start"]) < 1e-6


def test_real_timing_if_present():
    p = ROOT / "build/copycat/bc-whatif-ep01/audio/timing.json"
    if p.exists():
        sel = shorts.select_segments(json.load(open(p))["beats"])
        assert 45 <= sel["total"] <= 60
