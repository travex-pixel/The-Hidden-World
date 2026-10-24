"""Core engine tests: schema, grounding verifier, numbers, themes, Commons ranking, rendering, prompts."""
import copy
import json
import os
import re

import pytest

from storyforge.analyze import numbers
from storyforge.analyze.prompt import agent_brief, format_source, system_prompt
from storyforge.analyze.verify import verify
from storyforge.media import commons
from storyforge.render.build import md, render
from storyforge.render.themes import PRESETS, build_theme, contrast
from storyforge.schema import Source, validate_spec

ROOT = os.path.dirname(os.path.dirname(__file__))
EX = os.path.join(ROOT, "examples")


def load(*p):
    with open(os.path.join(EX, *p), encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture
def moon():
    return load("moon-speech", "spec.json"), Source.load(os.path.join(EX, "moon-speech", "source.json"))


# ---------------------------------------------------------------- schema

@pytest.mark.parametrize("name", ["home-depot", "moon-speech", "knicks-speech"])
def test_examples_validate(name):
    assert validate_spec(load(name, "spec.json")) == []


def test_semantic_checks_catch_bad_refs(moon):
    spec = copy.deepcopy(moon[0])
    spec["sections"][0]["blocks"].append({"type": "figure", "image": "nope", "layout": "wide", "caption": ""})
    calc = next(b for s in spec["sections"] for b in s["blocks"] if b["type"] == "calculator")
    calc["outputs"][0]["expr"] = "y * missing"
    errs = validate_spec(spec)
    assert any("unknown image 'nope'" in e for e in errs)
    assert any("unknown name 'missing'" in e for e in errs)


def test_schema_errors_are_reported():
    assert any(e.startswith("schema") for e in validate_spec({"meta": {}}))


# ---------------------------------------------------------------- verifier

def test_real_source_passes(moon):
    spec, src = moon
    rep = verify(copy.deepcopy(spec), src)
    assert rep.ok, rep.errors
    assert all(q["status"] != "missing" for q in rep.quotes)
    assert rep.numbers_checked > 20 and rep.numbers_supported == rep.numbers_checked


def test_invented_quote_is_blocking(moon):
    spec, src = copy.deepcopy(moon[0]), moon[1]
    spec["sections"][4]["blocks"].insert(0, {"type": "quote", "text": "We will build a city on the moon by 1965 and charge rent.",
                                             "who": "Kennedy", "segment_id": None, "style": "pull"})
    rep = verify(spec, src)
    assert not rep.ok and any("not found in the source" in e for e in rep.errors)


def test_near_verbatim_quote_is_repaired(moon):
    spec, src = copy.deepcopy(moon[0]), moon[1]
    q = next(b for s in spec["sections"] for b in s["blocks"] if b["type"] == "quote" and b["segment_id"] == "s0019")
    q["text"] = "We choose to go to the moon in this decade and do other things, not because they are easy, but because they're hard"
    q["segment_id"] = None
    rep = verify(spec, src)
    assert rep.ok, rep.errors
    assert q["segment_id"] == "s0019"
    assert "because they are hard" in q["text"]
    assert any("exact source words" in f for f in rep.fixes)


def test_invented_inline_quote_is_blocking(moon):
    spec, src = copy.deepcopy(moon[0]), moon[1]
    spec["sections"][0]["blocks"][0]["text"] += " He added, “the moon belongs to Texas now.”"
    rep = verify(spec, src)
    assert any("quoted words not found" in e for e in rep.errors)


def test_unsupported_hero_number_is_blocking(moon):
    spec, src = copy.deepcopy(moon[0]), moon[1]
    spec["hero"]["stats"][0]["value"] = "$9.9B"
    rep = verify(spec, src)
    assert any("hero stat" in e for e in rep.errors)


def test_unsupported_prose_number_is_a_warning(moon):
    spec, src = copy.deepcopy(moon[0]), moon[1]
    spec["sections"][0]["blocks"][0]["text"] += " About 35,000 people were in the stands."
    rep = verify(spec, src)
    assert rep.ok
    assert any("35000" in w for w in rep.warnings)


def test_section_times_snap_to_chapters():
    src = Source(kind="podcast", title="t", segments=[], duration_s=1000)
    from storyforge.schema import Chapter, Segment
    src.segments = [Segment(id="s0001", text="hello world", start_s=0)]
    src.chapters = [Chapter("A", 0), Chapter("B", 300)]
    spec = load("moon-speech", "spec.json")
    spec["sections"] = spec["sections"][:2]
    spec["sections"][0]["time_s"], spec["sections"][1]["time_s"] = 2, 310
    for s in spec["sections"]:
        s["blocks"] = [b for b in s["blocks"] if b["type"] in ("takeaway",)]
    spec["hero"]["stats"] = []
    verify(spec, src)
    assert [s["time_s"] for s in spec["sections"]] == [0, 300]


# ---------------------------------------------------------------- numbers

@pytest.mark.parametrize("text,expected", [
    ("five billion, four hundred million dollars", 5.4e9),
    ("a hundred and seventy thousand", 170000),
    ("$17M", 17e6), ("17 million", 17e6), ("$1,000", 1000), ("24%", 24), ("$5.4B", 5.4e9), ("240,000 miles", 240000),
])
def test_number_parsing(text, expected):
    assert expected in numbers.values(text)


def test_no_double_count_of_scale_words():
    assert numbers.values("17 million") == [17e6]


# ---------------------------------------------------------------- themes

@pytest.mark.parametrize("preset", list(PRESETS))
@pytest.mark.parametrize("accent", [None, "#ffd400", "#ee6a1f", "#0b3d91"])
def test_theme_contrast_guard(preset, accent):
    t = build_theme({"preset": preset, "accent": accent})
    for pal in (t["light"], t["dark"]):
        assert contrast(pal["accent_ink"], pal["paper"]) >= 4.5
        assert contrast(pal["on_accent"], pal["accent"]) >= 3.0
        assert contrast(pal["ink"], pal["paper"]) >= 7


# ---------------------------------------------------------------- media ranking (offline)

def cand(name, lic="CC BY-SA 4.0", w=1200, h=1500, desc=""):
    return commons.Candidate(title="File:" + name, width=w, height=h, mime="image/jpeg", license=lic,
                             artist="x", page_url="", description=desc, date="")


def test_portrait_ranking_prefers_the_person():
    cs = [cand("John F Kennedy memorial 001.jpeg"), cand("John F Kennedy Official Portrait.jpg"),
          cand("Bernard van Orley - Kennedy John F scene.jpg", lic="Public domain")]
    ranked = commons.rank(cs, "John F. Kennedy", "portrait")
    assert ranked[0].name == "John F Kennedy Official Portrait.jpg"


def test_licenses_filtered():
    cs = [cand("Moon.jpg", lic="CC BY-NC 2.0"), cand("Moon 2.jpg", lic="All rights reserved"), cand("Moon 3.jpg", lic="CC0")]
    assert [c.name for c in commons.rank(cs, "Moon", "object")] == ["Moon 3.jpg"]


def test_description_cannot_carry_a_wrong_picture():
    cs = [cand("Alan Shepard Mission Control.jpg", desc="chief of NASA's Manned Spacecraft Center in Houston, seated at Kennedy Space Center")]
    ranked = commons.rank(cs, "Manned Spacecraft Center Houston", "place")
    assert ranked[0].overlap < 0.6


def test_query_relaxation():
    assert commons.relaxations("Manned Spacecraft Center Houston 1960s")[:3] == [
        "Manned Spacecraft Center Houston 1960s", "Manned Spacecraft Center Houston", "Manned Spacecraft Center"]


# ---------------------------------------------------------------- rendering

def test_inline_markup_is_escaped_and_linked():
    out = str(md("a <b> **bold** *it* [x](https://e.com) [bad](javascript:alert(1))"))
    assert "&lt;b&gt;" in out and "<strong>bold</strong>" in out and "<em>it</em>" in out
    assert 'href="https://e.com"' in out and "javascript:" not in out.split("[bad]")[0] and 'href="javascript' not in out


@pytest.mark.parametrize("name", ["home-depot", "moon-speech", "knicks-speech"])
def test_render_example(name, tmp_path):
    spec, media = load(name, "spec.json"), load(name, "media.json")
    page = render(spec, media, str(tmp_path), media_base=os.path.join(EX, name))
    html = open(page, encoding="utf-8").read()
    n_take = sum(b["type"] == "takeaway" for s in spec["sections"] for b in s["blocks"])
    assert html.count('class="tag"') == n_take
    assert html.count('<section class="sec" id="s-') == len(spec["sections"])
    assert "<title>" in html and "*" not in re.search(r"<title>(.*?)</title>", html).group(1)
    data = json.loads(re.search(r'<script type="application/json" id="sf-data">(.*?)</script>', html, re.S).group(1))
    assert len(data["sections"]) == len(spec["sections"])
    for src in re.findall(r'src="(img/[^"]+)"', html):
        assert os.path.exists(tmp_path / src), src
    assert os.path.exists(tmp_path / "app.js")
    assert "<script>" not in html.split('id="sf-data"')[0]  # no inline script before the data island


def test_missing_images_are_dropped_not_broken(tmp_path):
    spec = load("moon-speech", "spec.json")
    page = render(spec, {}, str(tmp_path))
    html = open(page, encoding="utf-8").read()
    assert 'src="img/' not in html
    assert "class=\"ini\"" in html  # people fall back to initials


def test_standalone_document(tmp_path):
    page = render(load("moon-speech", "spec.json"), {}, str(tmp_path), standalone=True)
    assert open(page, encoding="utf-8").read().lstrip().lower().startswith("<!doctype html>")


# ---------------------------------------------------------------- prompts

def test_prompt_contains_source_and_rules(moon):
    spec, src = moon
    sp = system_prompt(src, "history")
    assert "verbatim" in sp and "historical understanding" in sp
    fs = format_source(src)
    assert "[s0019 00:09:03]" in fs and "We choose to go to the moon." in fs
    brief = agent_brief(src, "history")
    assert "storyforge verify" in brief and '"sections"' in brief
