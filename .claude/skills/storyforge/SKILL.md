---
name: storyforge
description: Turn a podcast episode, video, talk, article, transcript or audio file into an illustrated, interactive story page (narrated section by section, watercolor/ink plates, charts and small interactive models, a collected takeaway per section) and publish it as an artifact. Use when the user asks to narrate, illustrate, visualize or make an interactive companion/explainer for a specific episode, video, speech, article or document.
---

# storyforge: illustrated story pages from any source

The engine lives in `storyforge/` at the repo root (`cd storyforge` for every command below). The README there explains each stage. In this skill **you are the analyst** (agent mode): the engine ingests, verifies, illustrates, renders and checks, and you write `spec.json`. If `ANTHROPIC_API_KEY` is set, `python3 -m storyforge analyze` can write the spec instead, but still do steps 5-8 yourself.

Use a run directory in your scratchpad, e.g. `RUN=<scratchpad>/runs/<slug>`.

## 1. Get the source

```bash
python3 -m storyforge ingest "<url or file>" -o $RUN/source.json [--episode "<title>"] [--language en]
```

- Podcasts: prefer the RSS feed or an Apple Podcasts link; pass `--episode` with part of the title. Spotify links are refused (DRM).
- If the host is blocked by the network policy, say which host. Then look for the same transcript somewhere reachable: an RSS `podcast:transcript`, subtitles on Wikimedia Commons (`TimedText:` pages), a transcript file the user can upload. Save it into a new empty directory and ingest that file. Fill in `title`, `creator`, `url`, `published` and `duration_s` in source.json if the file did not carry them, and add a provenance note.
- Never stand in for a missing source with your own knowledge of it. The page narrates the source.

## 2. Read the brief, then the whole source

```bash
python3 -m storyforge brief $RUN/source.json -o $RUN/brief.md --lens <business|science|history|craft|life|general|free text> [--brief "<user's direction>"]
```

Read `brief.md` completely: instructions, source and schema. For long sources read the transcript in order, in chunks, taking notes per chapter (key facts, numbers, short verbatim quote candidates with segment ids) before writing anything.

## 3. Write `$RUN/spec.json`

Follow the brief exactly. `examples/home-depot/spec.json` (podcast, business) and `examples/moon-speech/spec.json` (speech, history) are worked references for density, tone and block choice. Rules that matter most:
- One section per source chapter (label = chapter title, time_s = its start). Without chapters, cut at real topic shifts.
- Quotes are copied verbatim from one segment and carry their `segment_id`. Any 4+ words in quotation marks inside prose count as a quote.
- Every number comes from the source. Interactive figures use only numbers the source states. Calculators may multiply them, and must say so in the note.
- Title: 2-4 words with one `*word*` in italics. The byline credits the creators as the source of a companion page.

## 4. Verify until it passes

```bash
python3 -m storyforge verify $RUN/spec.json --source $RUN/source.json --write
```

Fix every error: quotes not found, unsupported headline numbers, bad references. Read the warnings too: a warning about a number you computed is fine if the text says it is computed; otherwise remove the number. Re-run until PASS.

## 5. Illustrate, then look at every picture

```bash
python3 -m storyforge media $RUN/spec.json -o $RUN/media
```

Open `$RUN/media/contact.png` and check each plate against its caption:
- A wrong subject, a scan with printed text, or a logo: change that image's `query` in the spec (a more specific Commons file name works best) and re-run media. Cached images are reused.
- An image that shows something slightly different from the caption (a construction site, not the finished building): rewrite the caption to match the picture. `media.json` holds each pick's Commons title.
- A portrait with an initials wash means no free photo exists. That is fine and needs no action.

## 6. Render and QA

```bash
python3 -m storyforge render $RUN/spec.json --media $RUN/media/media.json -o $RUN/site --clean
python3 -m storyforge qa $RUN/site --shots "#s-<first-section-id>,#s-<a-section-with-charts>,#sf-checkout"
```

QA must report `"ok": true`. Then look at the screenshots in `$RUN/qa/` (desktop and phone, light and dark) and fix anything that reads badly: overlong headlines, empty figures, cramped labels. Section anchors are `#s-<section id>`.

## 7. Publish

Publish `$RUN/site/index.html` with the Artifact tool, passing `root: $RUN/site` and a `files` map with `app.js` and every file under `img/` (each mapped to itself). Use `spec.meta.description` as the description and a one-word generic icon.

## 8. Report

Tell the user what the page covers and link it. Give the verification counts (quotes verified, numbers traced). State plainly what you could not do: blocked hosts, images that fell back to initials, figures dropped for lack of a free image, and anything in the narration that comes from summaries rather than the primary source.
