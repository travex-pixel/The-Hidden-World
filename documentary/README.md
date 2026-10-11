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
python -m documentary.deliver <run>/documentary.mp4 --out <scratch>/dl   # phone delivery page + chunks (see CLAUDE.md)
```

## Delivery to the owner's phone

Masters are far over the ~30 MiB chat-attachment limit. `documentary/deliver.py` prepares a private claude.ai download page, which is published with the Artifact tool. The page saves the master as **one MP4** through the `downloads` capability. The full procedure is in `CLAUDE.md`.

## Cinematic shots (`"type": "cine"`)

`cine` shots use the Case Files sets and full-body figures, with walking, poses, expressions, blinking and depth parallax. They are vendored read-only in `documentary/renderer/cine/` (see `SOURCE.md`), with figure specs in `documentary/cast/figures/`. List the figure ids a film uses in `film.json` → `"figures"`.

A shot has these fields:

| Field | Meaning |
|---|---|
| `set` | Environment name, e.g. `lb8_kitchen`, `lb8_house`, `lb8_parlour`, `courtroom`, `press_hall`, `office_day` |
| `setOpts` | Set options. `{"anim": [a, b], "p0": .., "p1": ..}` animates a number over the shot. |
| `view`, `view_to` | 16:9 window into the portrait world: `{cx, cy, w}`. Use it to frame, push in or pan. |
| `cam` | Parallax camera `{from, to, handheld}` or `keys` |
| `figures` | `[{id, x, y, scale, dir, turn, pose, expr, gaze, depth, keys:[{p, pose, expr, ...}], walk:{from, to, p0, p1, cadence}}]` |
| `grade` | `warm`, `cold`, `night`, `dawn` or `sepia` |
| `mirror` | Flip the whole world horizontally |

Overlays drawn on top: `lower` (lower third), `cards` (typed summary cards), `funfacts` (yellow FUN FACT pop-ups), `stamps`.

Timing in a cine shot can be given in seconds from the shot start (`at`) or as a fraction of the shot (`p`). Fractions keep the action on the words even when the narration is re-timed.

Each shot is labelled "ILLUSTRATION · NOT A LIKENESS" unless the shot sets `label`.

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

## Release stages (A–G) and the publication gate

| Stage | What | Where |
|---|---|---|
| A Research | sources with access records, chronology, claim ledger, legal status per person | `films/<id>/evidence/{sources,claims,people}.json` |
| B Script | narration lines and on-screen shots reference claim IDs (`claims`) | `films/<id>/film.json` |
| C Independent fact-check | separate-context adversarial review; findings recorded with claim/line IDs | `evidence/review-findings.json` (stage C) |
| D Legal-risk review | per-person status, implication/juxtaposition review, packaging and Shorts | `evidence/review-findings.json` (stage D), gate rules G7–G9, G14 |
| E Production | narration (per-sentence pauses), visuals, captions, audio, render | `python -m documentary.build` |
| F Post-production audit | ASR transcript vs script, captions vs script, render vs approved shots, technical QA | `documentary.audit_asr`, `documentary.qa`, gate G12 |
| G Release decision | technical / factual / legal-risk tracks reported separately; CLEARED only with no open CRITICAL/HIGH and recorded human sign-offs | `python -m documentary.gate <film> --run <run>` → `audit/release-decision.md` |

A draft can always render. It is labelled **DRAFT — NOT CLEARED FOR PUBLICATION** until every blocking finding is resolved and a human fact-checker and a qualified legal reviewer have signed off in `evidence/approvals.json` (`signoffs: [{"stage": "factual", "human": true, ...}, {"stage": "legal", "human": true, ...}]`). Nothing in this pipeline uploads or publishes.

Statuses: `VERIFIED` and `DIRECTLY SUPPORTED` need a source that was read in full (`access.level = full_text`). Excerpt-only evidence tops out at `CORROBORATED` (two independent outlets) or `REQUIRES REVIEW` (one). Repeats of one wire story or outlet share an `independence_group` and count once. Each claim's review fingerprint covers its narration text, so any script change invalidates its verification (G10).

Change impact: `python -m documentary.claims impact <film> <run> C14` lists every line, shot, caption cue, timeline event, thumbnail, description mention and Short that depends on a claim.

## Visual policy (all true-crime documentaries)

Cinematic cartoon identity:
- **People** are stylised characters from the series rig (`character` template) or featureless silhouettes. Real people are never photorealistic, and their characters are labelled "NOT A LIKENESS".
- **Authentic photos** appear only as framed, attributed archival inserts, and only once their rights are cleared.
- **AI or procedural imagery** is for environments and atmosphere only, and is labelled.

The asset rules live in `documentary/assets.py`: provenance records, rights decisions (news, editorial, unknown and "fair use" material always goes to human review), quality checks, a style check and segment-aware selection.
