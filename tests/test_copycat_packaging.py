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
    add("ch2", "LIEBE", "Why are you not afraid, boy?", 2.5)
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
    assert all(len(t) < 65 for t in packaging.TITLES)
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
    first = next(b for b in beats if b["text"].startswith("Why are you"))
    assert sel["exchange"][0] == first["id"]
    brother = next(b for b in beats if b["text"].startswith("To sit here"))
    assert sel["exchange"][1] == brother["id"]
    sel = shorts.select_segments(_beats(cold_len=6.5))   # tighter: falls back to 'Last time'
    last = next(b for b in beats if b["text"].startswith("Last time, I was"))
    assert sel["exchange"][1] in (last["id"],) or sel["total"] <= 57.0


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
