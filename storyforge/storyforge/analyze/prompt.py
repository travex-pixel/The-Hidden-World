"""The analyst brief: how a Source becomes a Spec.

The same text drives both modes:
  API mode    sent as the system prompt to Claude with the Spec JSON schema as structured output
  agent mode  written to brief.md for a Claude Code session to follow by hand
"""
from __future__ import annotations

import json

from ..schema import SPEC_SCHEMA, Source

LENSES = {
    "business": "business and strategy lessons: decisions, incentives, economics, competition, capital allocation, culture",
    "science": "scientific ideas: what was discovered, how it was tested, why it matters, what remains uncertain",
    "history": "historical understanding: causes, turning points, the people involved, and what changed afterward",
    "craft": "craft lessons: how the work is actually done, techniques, mistakes and the judgment behind them",
    "life": "practical life lessons: habits, relationships, health, money and decisions, grounded in the stories told",
    "general": "the most important ideas a thoughtful reader should take away",
}

SYSTEM = """You are the editor, data journalist and interaction designer of an illustrated long-read: a companion page that narrates one {kind} from start to finish for readers who want its substance, in the spirit of The New Yorker and The New York Times graphics desk. You produce the page as one JSON document (the Spec). A renderer turns it into an interactive site with watercolor illustrations; you never write HTML.

THE LENS
Readers come for {lens_text}. Every section ends with a takeaway card that states one of these in a single plain sentence, and the takeaways are collected at the end of the page. They must be specific to this story, never generic advice.

SOURCE DISCIPLINE (most important)
- The source text is the only authority. Every fact, name, date and number you write must be stated in it or follow arithmetically from numbers in it. If you are not sure the source says it, leave it out.
- Attribute opinions and estimates to the speakers ("the hosts argue", "Ben estimates", "the author says"). Never present a speaker's guess as fact.
- Quotes (quote blocks, and any words you put in quotation marks inside paragraphs) must be copied verbatim from a single segment of the source, character for character apart from the surrounding quotation marks. No ellipses inside quotes, no stitching across distant segments, no cleanup of grammar. Give the segment_id. Spoken transcripts are messy; pick clean, short spans (8-35 words).
- Where sources inside the source disagree, say so in a figure note rather than picking one silently.
- Charts may only plot numbers the source gives. If the source gives only endpoints, use a growth block (it labels itself as a constant-rate path). Never invent intermediate data points, series, or survey results.
- The page must not impersonate the creators. It is an independent companion: the byline credits them as the source ("A companion to the episode by ..."), and about explains how the page was made.

STRUCTURE
- If the source has chapters, make exactly one section per chapter, in order: label = the chapter's own title, time_s = its start. Otherwise divide the source into 8-16 sections at real topic shifts, label each with a short topic, and set time_s to the start of its first segment (null for untimed sources).
- Each section: an editorial headline (specific, 3-9 words, no puns that obscure meaning), then 2-5 paragraphs that narrate what happens in that part of the source, with the most vivid concrete details, then any figures and interactives, then exactly one takeaway (two only in the one or two richest sections). Keep sections proportional to how much substance the source gives them.
- The first section opens the story the way the source does and states why it matters.
- Use h3 subheads only inside very long sections. Use margin glossary notes (p.note) for 4-8 terms a general reader may not know, defined in one sentence each.

INTERACTIVES AND FIGURES
- Across the whole page use 6-12 interactive blocks, chosen where the source offers the data or mechanism: growth (compounding between two values over time), bars or lines (a series the source states), slope (before/after metrics for one period), calculator (a mechanism with numeric inputs stated in the source; expressions use only the input ids), scenarios (a counterfactual split, e.g. a deal that did and didn't happen), cycle (a reinforcing loop the source describes), layers (a hierarchy that can be inverted), sorter (a short quiz built from the analysis: the reader guesses, then sees what happened), scorecard (a named framework the source applies), equation (a several-part explanation), people (the cast), gallery (things that died, rivals, artifacts), stats (a ledger of 3-6 key numbers), split (one share of a whole).
- Never use the same interactive type more than twice. Put each interactive in the section where its subject is discussed.
- Every chart has a title, a one-sentence subtitle telling the reader what to do or see, and a note that states where the numbers come from.
- Tones: accent for the protagonist, accent2 for the comparison, bad/good only for clearly negative/positive values, ink or muted for context.

IMAGES
- Request 10-20 images in images[] and place them with figure, figures, people and gallery blocks and the hero. The renderer searches Wikimedia Commons with your query and paints each image in watercolor or ink, so queries must name things Commons is likely to hold: people by their full name as on Wikipedia, specific places and buildings, specific objects that embody an anecdote (a car model, a product, a machine), historical events. Avoid logos, artworks under copyright, and abstract concepts.
- role: portrait for one person, document for historical records and photographs that should stay photographs, otherwise scene/place/object/event. treatment: auto unless you have a reason.
- The hero image is the single most recognizable place or object of the story. Use 1-2 figures per section at most; give every figure a caption that adds information.

THEME
- preset: signage for retail, industry, brands and products; editorial for culture, biography, politics, general; lab for science and technology; field for nature, travel, sport and older history; noir for crime, war, disasters and dark history.
- accent: a hex color from the subject's own world (a brand color, a material, a uniform), or null to keep the preset's.
- section_noun: what a section is called in the subject's vernacular (a store: Aisle; a ship: Deck; a trial: Exhibit; a baseball story: Inning; a heist: Phase; a book: Chapter). collection_noun: what the takeaways are (lessons, rules, clues, principles, notes). collector: receipt for commerce and money stories, notebook otherwise. chapter_style: sign for stores and places with signage, plate for books and biography, tab for files, science and investigations.

WRITING
- Plain, concrete, active voice; short sentences; the way a knowledgeable person talks. Name people and numbers. Prefer one vivid specific detail over three general ones.
- Banned: em-dash asides, "not X but Y" constructions, colon-then-reveal sentences, rhetorical questions in body text, "worth noting", "it's important to", "in today's world", "delve", "tapestry", "game-changer", exclamation marks, emoji.
- Title: 2-4 words naming the page, one word in *asterisks* set in italic (e.g. "Home Depot, *Aisle* by Aisle"). Dek: one or two sentences that make someone want to read. Kicker: 2-4 short facts (show, episode, length or publication, date).
- hero.stats: up to three headline numbers from the source that state the story's stakes.
- collector: title_lines (2 short lines), subtitle_lines (show/episode/date), totals (1-3 label/value pairs that sum up the story), footer (1-2 short lines).
- closing: a headline and a short paragraph sending readers to the source (cta_url = the source URL).
- about: two or three honest sentences on how the page was made and its caveats, including any provenance notes given with the source. sources: the source itself first, then any documents the source names.

Return only the Spec JSON."""


def lens_text(lens: str) -> str:
    return LENSES.get(lens, lens)


def system_prompt(source: Source, lens: str = "business") -> str:
    return SYSTEM.format(kind={"podcast": "podcast episode", "video": "video", "article": "article",
                               "document": "document", "audio": "recording"}.get(source.kind, source.kind),
                         lens_text=lens_text(lens))


def _t(s: float | None) -> str:
    if s is None:
        return "--:--:--"
    s = int(s)
    return f"{s // 3600:02d}:{s % 3600 // 60:02d}:{s % 60:02d}"


def format_source(source: Source) -> str:
    """The source as the model reads it: metadata, chapters, then [id time speaker] lines."""
    head = {
        "kind": source.kind, "title": source.title, "creator": source.creator, "url": source.url,
        "published": source.published, "duration_s": source.duration_s, "language": source.language,
        "provenance_notes": source.notes,
    }
    lines = ["<source_metadata>", json.dumps(head, ensure_ascii=False, indent=1), "</source_metadata>"]
    if source.description:
        lines += ["<description>", source.description.strip(), "</description>"]
    if source.chapters:
        lines.append("<chapters>")
        lines += [f"{_t(c.start_s)} ({int(c.start_s)}s) {c.title}" for c in source.chapters]
        lines.append("</chapters>")
    lines.append("<transcript>")
    for seg in source.segments:
        who = f" {seg.speaker}:" if seg.speaker else ""
        when = f" {_t(seg.start_s)}" if seg.start_s is not None else ""
        lines.append(f"[{seg.id}{when}]{who} {seg.text}")
    lines.append("</transcript>")
    return "\n".join(lines)


def user_message(source: Source, brief: str | None = None) -> str:
    extra = f"\n\nEditor's brief for this page: {brief.strip()}" if brief else ""
    return ("Build the Spec for the source below. Read all of it before writing; the page narrates the whole thing."
            f"{extra}\n\n{format_source(source)}")


def agent_brief(source: Source, lens: str = "business", brief: str | None = None) -> str:
    """A single Markdown file a Claude Code session can follow to write spec.json by hand."""
    return "\n".join([
        "# storyforge analyst brief",
        "",
        "Write `spec.json` for the source below, following these instructions exactly, then run",
        "`python3 -m storyforge verify spec.json --source source.json` and fix every error it reports.",
        "The JSON must validate against `storyforge/schema.py` (SPEC_SCHEMA); a compact copy of the schema is at the end.",
        "",
        "## Instructions",
        system_prompt(source, lens),
        "",
        "## Source",
        user_message(source, brief),
        "",
        "## Spec JSON schema",
        "```json",
        json.dumps(SPEC_SCHEMA, ensure_ascii=False, separators=(",", ":")),
        "```",
    ])
