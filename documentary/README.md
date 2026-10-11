# Long-form documentary pipeline (16:9)

This pipeline produces landscape YouTube documentaries. It is separate from the vertical Shorts pipeline in `pipeline/`. It reuses the Shorts helpers read-only:
- Piper narration cache: `pipeline/narrate.py`
- score, SFX and mix: `pipeline/audio.py`
- media verification: `pipeline/verify.py`

It does not change any Shorts defaults, episodes, workflows or outputs.

```
documentary/films/<id>/film.json ─► narration per line (Piper, cached; pronunciation + spoken-number rules)
                                  ─► timeline from real clip lengths ─► shots split per line by weight
                                  ─► captions.srt / captions.vtt / transcript.md
                                  ─► score + drone + SFX, voice-ducked mix
                                  ─► 1920×1080 canvas renderer (documentary/renderer) in N parallel Chromium workers
                                  ─► segments joined losslessly ─► mux AAC + loudnorm (−16 LUFS, −1.5 dBTP)
                                  ─► verify (streams, codecs, 1920×1080, 30 fps, duration, full decode, loudness)
```

## Commands

```bash
pip install -r requirements.txt && npm install           # Piper, NumPy, Pillow, Playwright (Chromium)
python -m documentary.build documentary/films/betsy-faria                # full render → output/true-crime-documentary/<id>-<date>-runN/
python -m documentary.build documentary/films/betsy-faria --plan-only    # narration, captions, mix, plan; no frames
python -m documentary.qa output/true-crime-documentary/<run>             # extra QA → qa-checks.json, sync_check.png
python -m documentary.shorts output/true-crime-documentary/<run>         # five vertical 9:16 cut-downs with burned captions
node documentary/thumbnail.mjs <outdir>                                  # thumbnail concepts, 1280×720 PNG
python -m unittest tests.test_documentary                                # data, captions, editorial guardrails
```

Output folders get a unique run suffix, so an existing run is never overwritten.

A full 7.5-minute render takes about 13 minutes with 4 workers on 4 vCPUs (roughly 17–19 frames per second in total).

## film.json

- **Top level:**
  - `voice`, `length_scale`
  - `pronounce`: raw phonemes for names, e.g. `"Faria": "[[fəɹˈiːə]]"`
  - `spoken`: caption text → spoken text, e.g. `"$150,000"`, `"911"`, years
  - `timeline`: events for the timeline template
- **`lines[]`:**
  - `say`: the caption-exact narration. Use `silence` (seconds) instead for a title card.
  - `chapter` / `chapter_title` / `tag`: chapter markers and the top-left tag
  - `cue`: music cue
  - `pause`
  - `sfx[]`
  - `shots[]`
- **`shots[]`:**
  - `type`: one of `title`, `date`, `kinetic`, `stat`, `quote`, `doc`, `split`, `profile`, `verdict`, `question`, `list`, `timeline`, `clock`, `board`, `map`, `scene`, `endcard`
  - `w`: share of the line's duration
  - `in` (`cut`/`flash`/`redflash`/`fade`/`glitch`) and `out` (`dip`)
  - `source`: lower-left source tag
  - `label`: lower-right label

## Editorial rules the renderer enforces by default

- `scene` shots carry **"RECONSTRUCTION · ILLUSTRATION"**.
- `doc` shots carry **"ILLUSTRATIVE SUMMARY · NOT THE ORIGINAL DOCUMENT"**.
- `profile` shots use a featureless silhouette labelled **"SILHOUETTE · NOT A LIKENESS"**.
- Maps use public-domain U.S. Census county boundaries (`assets/mo_region_counties.json`) and are labelled "locations approximate".
- `tests/test_documentary.py` fails if the Betsy Faria script ever claims or implies that Pam Hupp was convicted of Betsy's murder. It also fails if the presumption of innocence is missing, or if the prosecution's allegations are not attributed.
