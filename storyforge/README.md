# storyforge

Turn any podcast, video, article or file into an illustrated, interactive story page: a narrated walk through the source, section by section, with watercolor and ink plates, live charts and small interactive models, and a takeaway card per section that the reader collects into a receipt or notebook at the end.

Two pages made with it live in `examples/`:

| Example | Source | Theme |
|---|---|---|
| `home-depot/` | Acquired’s Home Depot episode (3 h 35 min podcast) | signage · Aisle · receipt |
| `moon-speech/` | JFK’s 1962 Rice University speech (Commons subtitles) | lab · Stage · notebook |

## How it works

```
SOURCE ──ingest──► source.json ──analyze──► spec.json ──verify──► (repair) ──media──► painted plates ──render──► site/ ──qa──► report + screenshots
 URL or file        segments, chapters,      sections made of        quotes,         Commons search,         themed HTML,       headless Chromium,
                    timestamps, speakers     typed blocks            numbers, times  license filter, paint   runtime JS         light/dark, phone
```

- **ingest** reads YouTube and anything else yt-dlp supports (captions, else audio + Whisper), podcast RSS feeds and Apple Podcasts links (Podcasting 2.0 transcripts and chapters, else the audio), web articles, and local `.vtt .srt .txt .md .json .html .pdf` and audio/video files. Everything becomes one `Source`: timestamped segments, chapters, speakers, provenance notes.
- **analyze** writes the `Spec`, a typed story document (see `storyforge/schema.py`). In **API mode** Claude does this in one streaming call with the Spec as a structured-output schema. In **agent mode** a Claude Code session does it by following `brief.md`.
- **verify** is what makes the output trustworthy. Every quotation, in quote blocks and inside prose, must match the transcript word for word (near misses are replaced with the exact words). Every headline number must be stated in the source, and other numbers are traced and reported. Section times must exist in the source and snap to its chapters. Blocking problems go back to Claude for repair (API mode) or to the agent.
- **media** searches Wikimedia Commons for each image the spec requests. It keeps only free licenses, rejects weak matches (a wrong picture with a confident caption is worse than none), relaxes queries that find nothing, and downloads standard-size thumbnails politely. It then paints each image: ink-and-wash portraits framed by face detection, watercolor scenes, duotone washes for black-and-white photographs, and documents kept as photos. People without a free portrait get an initials wash. It writes `contact.png` for a one-look review.
- **render** builds the page from five theme presets with automatic contrast correction (signage, editorial, lab, field, noir), three chapter styles (hanging sign, book plate, folder tab) and two collectors (receipt, notebook). The interactive blocks are compounding growth, bars, lines, slope, scenario donut, what-if calculator, flywheel, flip-pyramid, sorter quiz, scorecard, equation, cast and gallery. The output is a claude.ai artifact fragment by default, or `--standalone` for any static host.
- **qa** loads the page in Chromium at 1280 px and 400 px, in light and dark. It fails on sideways scrolling, broken images, figures that did not draw, and console errors, and saves screenshots.

## Use

```bash
pip install -e ".[dev]"            # plus ".[audio]" for local transcription
npm i playwright                   # for qa (Chromium)

# everything, cached per stage (re-running only redoes what changed)
python3 -m storyforge build "https://www.youtube.com/watch?v=..." -o runs/my-talk --lens business
python3 -m storyforge build feed.xml --episode "Home Depot" -o runs/hd --lens business
python3 -m storyforge build article.html -o runs/essay --lens history --brief "focus on the founders"
```

With `ANTHROPIC_API_KEY` set, `build` runs the analysis itself (Claude Opus 5.5, adaptive thinking, server-side refusal fallbacks enabled). Without credentials it stops after writing `brief.md`. Have Claude Code write `spec.json` from it (the `storyforge` skill in this repo explains how), then run the same command again.

Stages can be run one at a time:

```bash
python3 -m storyforge ingest SOURCE -o source.json [--episode TITLE] [--language en]
python3 -m storyforge brief source.json -o brief.md --lens history
python3 -m storyforge analyze source.json -o spec.json --lens business [--brief "..."]
python3 -m storyforge verify spec.json --source source.json --write
python3 -m storyforge media spec.json -o media
python3 -m storyforge render spec.json --media media/media.json -o site
python3 -m storyforge qa site
```

Lenses (`--lens`) set what the takeaway cards are about: `business`, `science`, `history`, `craft`, `life`, `general`, or any free text ("persuasion techniques").

## Honest limits

- Image search depends on what Wikimedia Commons holds. Obscure people often have no free portrait, and some figures will be dropped. Check `media/contact.png` before publishing.
- Numbers the analyst derives by arithmetic (a household cost from a per-person cost) are reported as warnings, not errors. Read the warnings.
- Spotify episodes are DRM-protected; give the show’s RSS feed instead.
- Transcription quality bounds everything downstream. Auto-captions are de-duplicated, but names may be misspelled in the source, and quotes are checked against the source as written.

## Tests

```bash
python3 -m pytest -q        # ingest adapters, verifier, numbers, themes, ranking, rendering, API-mode analyst (offline)
```
