"""The two contracts every stage shares.

``Source``  what ingest produces: one normalized document for any podcast,
            video, article or file, with timestamped segments and chapters.
``Spec``    what analysis produces and the renderer consumes: a typed story
            (sections made of blocks, image requests, theme, collector).

The Spec schema is written to be accepted by Claude structured outputs
(every object closed, every property required, optional values nullable),
and the same dict is used for local validation with ``jsonschema``.
"""
from __future__ import annotations

import json
import re
from dataclasses import asdict, dataclass, field
from typing import Any

# --------------------------------------------------------------------------- Source


@dataclass
class Segment:
    id: str
    text: str
    start_s: float | None = None
    end_s: float | None = None
    speaker: str | None = None


@dataclass
class Chapter:
    title: str
    start_s: float


@dataclass
class SourceImage:
    url: str
    caption: str = ""
    credit: str = ""


@dataclass
class Source:
    kind: str                      # podcast | video | article | document | audio
    title: str
    segments: list[Segment]
    creator: str = ""
    url: str | None = None
    published: str | None = None   # ISO date
    duration_s: float | None = None
    description: str = ""
    language: str = "en"
    chapters: list[Chapter] = field(default_factory=list)
    images: list[SourceImage] = field(default_factory=list)
    notes: list[str] = field(default_factory=list)  # provenance, e.g. "auto-generated captions"

    # ---- helpers
    @property
    def text(self) -> str:
        return "\n".join(s.text for s in self.segments)

    @property
    def timed(self) -> bool:
        return any(s.start_s is not None for s in self.segments)

    def to_json(self) -> str:
        return json.dumps(asdict(self), ensure_ascii=False, indent=1)

    def save(self, path: str) -> None:
        with open(path, "w", encoding="utf-8") as f:
            f.write(self.to_json())

    @classmethod
    def from_dict(cls, d: dict) -> "Source":
        d = dict(d)
        d["segments"] = [Segment(**s) for s in d.get("segments", [])]
        d["chapters"] = [Chapter(**c) for c in d.get("chapters", [])]
        d["images"] = [SourceImage(**i) for i in d.get("images", [])]
        known = set(cls.__dataclass_fields__)
        return cls(**{k: v for k, v in d.items() if k in known})

    @classmethod
    def load(cls, path: str) -> "Source":
        with open(path, encoding="utf-8") as f:
            return cls.from_dict(json.load(f))


def renumber(segments: list[Segment]) -> list[Segment]:
    """Give segments stable ids s0001.. in order."""
    for i, s in enumerate(segments, 1):
        s.id = f"s{i:04d}"
    return segments


# --------------------------------------------------------------------------- Spec schema helpers

STR = {"type": "string"}
NUM = {"type": "number"}
INT = {"type": "integer"}
BOOL = {"type": "boolean"}


def nullable(s: dict) -> dict:
    return {"anyOf": [s, {"type": "null"}]}


def arr(items: dict, desc: str = "") -> dict:
    d = {"type": "array", "items": items}
    if desc:
        d["description"] = desc
    return d


def obj(props: dict, desc: str = "") -> dict:
    d = {"type": "object", "properties": props, "required": list(props), "additionalProperties": False}
    if desc:
        d["description"] = desc
    return d


def enum(*vals: str, desc: str = "") -> dict:
    d = {"type": "string", "enum": list(vals)}
    if desc:
        d["description"] = desc
    return d


TONE = enum("accent", "accent2", "ink", "muted", "good", "bad",
            desc="Semantic color. accent = the page's main color, accent2 = its contrast color.")
STAT = obj({"value": STR, "label": STR, "tone": TONE})
NUMFMT = obj({"prefix": STR, "suffix": STR, "decimals": INT},
             "How to print a number, e.g. prefix '$', suffix 'B', decimals 1.")


def block(name: str, props: dict, desc: str) -> dict:
    return obj({"type": {"type": "string", "const": name}, **props}, desc)


def _chart_head() -> dict:
    return {"title": STR, "subtitle": STR, "note": STR}


BLOCKS: list[dict] = [
    block("p", {
        "text": {"type": "string", "description": "One paragraph. Inline markup: **bold**, *italic*, [text](url)."},
        "note": nullable(obj({"term": STR, "definition": STR})),
    }, "A paragraph of narration, optionally with a margin glossary note for one term."),
    block("h3", {"text": STR}, "A small run-in subhead inside a section."),
    block("quote", {
        "text": {"type": "string", "description": "VERBATIM words from the source transcript. Never paraphrase inside a quote."},
        "who": STR,
        "segment_id": nullable({"type": "string", "description": "Segment id the quote comes from, e.g. s0412."}),
        "style": enum("inline", "pull"),
    }, "A verbatim quotation."),
    block("figure", {
        "image": {"type": "string", "description": "id of an entry in images[]"},
        "layout": enum("wide", "float-right", "float-left", "column"),
        "caption": STR,
    }, "One illustration or photograph."),
    block("figures", {
        "items": arr(obj({"image": STR, "caption": STR}), "Two images shown side by side."),
        "layout": enum("even", "narrow-left"),
    }, "A pair of images."),
    block("stats", {"items": arr(STAT), "layout": enum("row", "grid")},
          "Big numbers with labels (a ledger). Every number must come from the source."),
    block("takeaway", {
        "title": {"type": "string", "description": "The lesson as one short declarative sentence."},
        "body": {"type": "string", "description": "2-3 sentences: why it is true here, grounded in this story."},
        "sku": {"type": "string", "description": "A tiny factual tag line, e.g. '45% -> 30% GROSS MARGIN'."},
    }, "A lesson card. These are collected into the reader's cart and printed at the end."),
    block("bars", {
        **_chart_head(), "format": NUMFMT,
        "points": arr(obj({"x": STR, "y": NUM})),
        "highlight": arr(STR, "x values to color with the accent"),
        "annotations": arr(obj({"x": STR, "text": STR})),
    }, "Bar chart over categories or years."),
    block("lines", {
        **_chart_head(), "format": NUMFMT, "area": BOOL,
        "series": arr(obj({"label": STR, "tone": TONE, "points": arr(obj({"x": NUM, "y": NUM}))})),
        "bands": arr(obj({"from": NUM, "to": NUM, "label": STR})),
        "annotations": arr(obj({"x": NUM, "text": STR})),
    }, "Line or area chart over a numeric x (usually years)."),
    block("slope", {
        **_chart_head(), "start_label": STR, "end_label": STR,
        "rows": arr(obj({"label": STR, "start": NUM, "end": NUM, "detail": STR, "tone": TONE})),
    }, "Before/after slope chart, typically indexed to 100."),
    block("growth", {
        **_chart_head(), "start_year": NUM, "end_year": NUM, "start_value": NUM, "end_value": NUM,
        "label": STR, "compare_label": nullable(STR), "compare_end_value": nullable(NUM),
        "prefix": STR,
        "bands": arr(obj({"from": NUM, "to": NUM, "label": STR})),
    }, "Interactive compounding chart with a year slider, linear/log toggle."),
    block("scenarios", {
        **_chart_head(),
        "scenarios": arr(obj({"label": STR, "center": STR, "center_sub": STR, "text": STR,
                              "parts": arr(obj({"label": STR, "value": NUM, "tone": TONE}))})),
    }, "Donut chart with a toggle between 2-3 scenarios (e.g. a deal that happened vs one that didn't)."),
    block("split", {"caption": STR, "parts": arr(obj({"label": STR, "value": NUM, "tone": TONE}))},
          "A single 100% split bar."),
    block("calculator", {
        **_chart_head(),
        "inputs": arr(obj({"id": {"type": "string", "description": "identifier usable in expressions"},
                           "label": STR, "min": NUM, "max": NUM, "step": NUM, "value": NUM, "unit": STR})),
        "outputs": arr(obj({"label": STR, "expr": {"type": "string", "description": "Arithmetic over input ids: + - * / ^ ( ) min max abs round"},
                            "format": NUMFMT, "tone": TONE})),
        "bars": arr(obj({"label": STR, "sub": STR,
                         "segments": arr(obj({"label": STR, "expr": STR, "tone": TONE}))}),
                    "Optional stacked bars whose segment widths are expressions."),
    }, "A small what-if model with sliders. Use only when the source gives the inputs."),
    block("cycle", {**_chart_head(), "center": STR, "center_sub": STR,
                    "steps": arr(obj({"label": STR, "text": STR}))},
          "A reinforcing loop (flywheel) of 3-6 steps."),
    block("layers", {**_chart_head(), "layers": arr(obj({"label": STR}), "Top to bottom."),
                     "text": STR, "flipped_text": STR, "button": STR, "flipped_button": STR},
          "A stacked pyramid the reader can flip to compare two orderings."),
    block("sorter", {
        **_chart_head(), "options": arr(STR, "2-3 answer buttons, e.g. ['Kept', 'Changed']"),
        "items": arr(obj({"text": STR, "answer": STR, "explanation": STR})),
    }, "A short quiz: the reader sorts each item, then sees what happened."),
    block("scorecard", {
        **_chart_head(),
        "items": arr(obj({"name": STR, "score": nullable({"type": "integer", "description": "0-3, null = not argued"}),
                          "definition": STR, "verdict": STR})),
    }, "Rated tiles (e.g. a strategy framework)."),
    block("equation", {**_chart_head(), "terms": arr(obj({"label": STR, "text": STR})), "result": STR},
          "Terms multiplied into a result; tapping a term explains it."),
    block("gallery", {**_chart_head(), "items": arr(obj({"image": nullable(STR), "title": STR, "caption": STR,
                                                         "lines": arr(STR, "Text lines shown when there is no image")}))},
          "Small multiples of images or text tiles (e.g. competitors that died)."),
    block("people", {"items": arr(obj({"name": STR, "role": STR, "description": STR, "image": nullable(STR)}))},
          "A cast of key people with portraits."),
]

BLOCK_TYPES = [b["properties"]["type"]["const"] for b in BLOCKS]

IMAGE = obj({
    "id": {"type": "string", "description": "short slug, unique"},
    "query": {"type": "string", "description": "Wikimedia Commons search query, e.g. 'Bernard Marcus' or 'Home Depot store exterior'"},
    "alt": STR,
    "role": enum("portrait", "scene", "place", "object", "document", "event"),
    "treatment": enum("auto", "watercolor", "ink", "duotone", "photo",
                      desc="auto = portrait->ink, b/w scene->duotone, else watercolor; photo keeps the photograph (for historical documents)."),
    "source_url": nullable({"type": "string", "description": "A specific image URL from the source, if any"}),
})

THEME = obj({
    "preset": enum("signage", "editorial", "lab", "field", "noir",
                   desc="signage: retail/industry/brands; editorial: culture/biography/general; lab: science/tech; field: nature/history/travel; noir: crime/war/dark history"),
    "accent": nullable({"type": "string", "description": "#rrggbb drawn from the subject's world (a brand, a material). Contrast is corrected automatically."}),
    "section_noun": {"type": "string", "description": "What a section is called in this subject's vernacular: Aisle, Chapter, Act, Round, Leg, Case..."},
    "collection_noun": {"type": "string", "description": "What takeaways are called: lessons, rules, clues, principles"},
    "collector": enum("receipt", "notebook"),
    "chapter_style": enum("sign", "plate", "tab"),
})

SECTION = obj({
    "id": {"type": "string", "description": "slug, unique"},
    "number": {"type": "string", "description": "two digits, e.g. 07"},
    "label": {"type": "string", "description": "The source's own chapter title (or a short topic label)"},
    "time_s": nullable({"type": "number", "description": "Start time in the source, seconds"}),
    "date_label": nullable({"type": "string", "description": "Era shown on the sign, e.g. 1979 or 2000-2007"}),
    "headline": {"type": "string", "description": "An editorial headline for the section"},
    "blocks": arr({"anyOf": BLOCKS}),
})

SPEC_SCHEMA: dict = obj({
    "meta": obj({
        "title": {"type": "string", "description": "Page name, 2-4 words, no subtitle. Wrap one word in *asterisks* to set it in the accent italic."},
        "description": {"type": "string", "description": "One sentence for a gallery card"},
        "kicker": arr(STR, "2-4 short facts: show, episode, length"),
        "dek": STR,
        "byline": STR,
        "source": obj({"kind": STR, "title": STR, "creator": STR, "url": nullable(STR),
                       "published": nullable(STR), "duration_s": nullable(NUM)}),
    }),
    "theme": THEME,
    "hero": obj({"image": nullable(STR), "stats": arr(STAT, "0-3 headline numbers")}),
    "intro": nullable({"type": "string", "description": "How to read this page, 1-2 sentences"}),
    "sections": arr(SECTION),
    "closing": obj({"headline": STR, "text": STR, "cta_label": nullable(STR), "cta_url": nullable(STR)}),
    "collector": obj({"title_lines": arr(STR), "subtitle_lines": arr(STR),
                      "totals": arr(obj({"label": STR, "value": STR})), "footer": arr(STR)}),
    "images": arr(IMAGE),
    "about": STR,
    "sources": arr(obj({"label": STR, "url": nullable(STR)})),
})


# --------------------------------------------------------------------------- validation

def validate_spec(spec: dict) -> list[str]:
    """JSON-schema errors plus the semantic checks a schema can't express."""
    errors: list[str] = []
    try:
        import jsonschema
        v = jsonschema.Draft202012Validator(SPEC_SCHEMA)
        for e in sorted(v.iter_errors(spec), key=lambda e: list(e.path)):
            path = "/".join(str(p) for p in e.path)
            errors.append(f"schema {path}: {e.message[:200]}")
    except ImportError:  # pragma: no cover
        errors.append("jsonschema not installed; schema not checked")
    if errors:
        return errors

    image_ids = [i["id"] for i in spec["images"]]
    if len(set(image_ids)) != len(image_ids):
        errors.append("images: duplicate ids")
    sec_ids = [s["id"] for s in spec["sections"]]
    if len(set(sec_ids)) != len(sec_ids):
        errors.append("sections: duplicate ids")
    known = set(image_ids)

    def need(img, where):
        if img is not None and img not in known:
            errors.append(f"{where}: unknown image '{img}'")

    need(spec["hero"]["image"], "hero")
    last_t = -1.0
    for s in spec["sections"]:
        if s["time_s"] is not None:
            if s["time_s"] < last_t:
                errors.append(f"section {s['id']}: time_s goes backwards")
            last_t = s["time_s"]
        for k, b in enumerate(s["blocks"]):
            where = f"section {s['id']} block {k} ({b['type']})"
            if b["type"] == "figure":
                need(b["image"], where)
            elif b["type"] == "figures":
                for it in b["items"]:
                    need(it["image"], where)
            elif b["type"] in ("gallery", "people"):
                for it in b["items"]:
                    need(it.get("image"), where)
            elif b["type"] == "calculator":
                ids = {i["id"] for i in b["inputs"]}
                for o in b["outputs"] + [seg for bar in b["bars"] for seg in bar["segments"]]:
                    for name in re.findall(r"[A-Za-z_][A-Za-z0-9_]*", o["expr"]):
                        if name not in ids and name not in ("min", "max", "abs", "round"):
                            errors.append(f"{where}: expression uses unknown name '{name}'")
            elif b["type"] == "sorter":
                for it in b["items"]:
                    if it["answer"] not in b["options"]:
                        errors.append(f"{where}: answer '{it['answer']}' not in options")
    if not any(b["type"] == "takeaway" for s in spec["sections"] for b in s["blocks"]):
        errors.append("spec has no takeaway blocks")
    return errors


def load_spec(path: str) -> dict:
    with open(path, encoding="utf-8") as f:
        return json.load(f)
