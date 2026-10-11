# Post-production audit (Stage F): existing v2 MP4

**Audited file:** `output/true-crime-documentary/betsy-faria-20261011-run2/documentary.mp4`. It is preserved, not modified, and its SHA-256 is unchanged (see `final-qa-report.md` §1).

**Method:** every check below read the existing artifacts. Nothing was re-rendered, re-voiced or re-encoded.

## 1. Narration actually in the MP4 vs the approved script

The audio track was decoded from the MP4 itself (not the pre-mux mix) and transcribed line by line with an offline speech recogniser: sherpa-onnx Moonshine base, MIT licence. The transcripts were compared with `film.json`. Full results: `asr-audit.json`.

| Measure | Result |
|---|---|
| Lines compared | 71 of 71 narrated lines |
| Corpus word-error rate | **9.0%** |
| Lines above 20% WER | 10 (L09, L10, L16, L18, L33, L42, L46, L49, L52, L73) |

Almost all differences fall into three groups:

- **Proper names the recogniser does not know:** Hupp → "Hup/Hut/Hop", Faria → "Fourier/Ferrier/for a", Ohmer → "Omer", Gumpenberger → "dumpinberger".
- **Number formatting:** "December twenty seven, twenty eleven", "nine one one", "twenty twenty eight".
- **One word at L18:** "stabbed" → "stared".

No line shows missing or extra content.

**Finding AUD-01 (HIGH).** In L76 the pause between "…for killing Louis Gumpenberger." and "In Betsy's case, she is charged…" measures **~0.12 s**, both in the isolated narration clip and in the final mix. The recogniser fused the two sentences: "…killing Louis dumpinberger in Betsy's case. She discharged, not convicted…". This is the film's most legally sensitive line, so a human should listen to it.

- **Root cause:** Piper inserts almost no pause between sentences.
- **Engine fix (done):** narration is now voiced per sentence, with a 0.38 s default pause.
- **Effect on v2:** none. The Betsy Faria film pins `sentence_gap: 0` so v2 stays reproducible.
- **Correcting the MP4:** needs a re-voiced line, i.e. a new render, which needs your approval.

## 2. Captions vs narration

| Check | Result |
|---|---|
| SRT and VTT | 107 cues each |
| Text vs approved narration | Matches word for word (gate G12 and `qa.py`) |
| Lines and characters per cue | ≤2 lines, ≤42 characters per line |
| Minimum cue duration | 1.0 s |
| Maximum reading speed | 19.4 characters/s |
| Cue timing | Proportional within each line (the v2 engine had no word timestamps), so drift of a few hundred ms is possible inside long lines. Future renders time each sentence exactly. |

## 3. On-screen text and graphics vs the evidence ledger

**Rendered shots match the script.** The run's `plan.json` was compared with the approved `film.json`: all 135 shots are identical (gate G12-onscreen-drift: none).

**Every on-screen figure is backed by a claim.** Every number and date on screen (chapter cards, timeline events, maps, lists, document cards, stats) resolves to a claim's facts (gate G6: 0 unsupported). This holds after these were bound to claims:

- the chapter cards
- the timeline events
- board labels
- one list item

The gate's first run had flagged them as unbound.

**On-screen source credits.** Two credits are not backed by a source we actually hold:

- **AUD-04:** "St. Louis Post-Dispatch" on the changing-account cards.
- **FC-13:** "St. Louis Post-Dispatch (2024)" on the DNA card.

**Other on-screen wording issues** (FC-20, FC-24, AUD-03):

- "verdict was upheld" (jury vs judge unconfirmed)
- "Terminal cancer." (single source)
- "12 jurors decide" (general knowledge, unsourced)

**Visual provenance** (`asset-provenance.json`):

- **People:** all 10 person cards are featureless silhouettes labelled "SILHOUETTE · NOT A LIKENESS".
- **Documents:** all 11 document cards are labelled "ILLUSTRATIVE SUMMARY · NOT THE ORIGINAL DOCUMENT".
- **Scenes:** all 27 scenes are labelled "RECONSTRUCTION · ILLUSTRATION".
- **No authentic or AI imagery:** there are no photographs, footage, recordings, news material or AI-generated images.
- **Maps:** U.S. Census public-domain data.

**Unlabelled courtroom backdrop.** The six verdict stamps sit over an unlabelled stylised courtroom. It is plainly an illustration; LOW.

## 4. Technical integrity (from the earlier run plus a fresh re-check)

`verify.json` and `qa-checks.json` (re-run today):

| Check | Result |
|---|---|
| Container | MP4 |
| Video | H.264 High, yuv420p, 1920×1080, 16:9, SAR 1:1, 30 fps |
| Audio | AAC 48 kHz stereo, 191 kb/s |
| Duration | 437.03 s; audio and video lengths match |
| Frames | 13,111 decoded = 13,111 expected |
| Decode | Full decode, no errors |
| Black segments >0.6 s | 0 |
| Frozen video >4 s | 0 |
| Loudness | −16.0 LUFS, −1.3 dBTP |
| Long silences / clipping | None |
| Sync | Stamp frames on their cues (`sync_check.png`) |

**Reproducibility.** The upgraded engine reproduces v2's captions, transcript and audio mix **byte-for-byte**, and its plan shots exactly. Fourteen sampled v2 frames are **pixel-identical** between the committed renderer and the upgraded one.

## 5. Packaging audit

| Item | Result |
|---|---|
| Title | Flagged MEDIUM for legal review (LR-01) |
| Thumbnail A (selected, "GUILTY 2013 / NOT GUILTY 2015") | No issues |
| Thumbnail B | Withdrawn (LR-08) |
| Description | All 49 sources added; legal-status note updated with the September 2026 motion; pinned comment reworded |
| Shorts | All five blocked: no status card in 02 and 04; no outcome in 03; the opening line in 01; L76 in 05. Re-cut on approval. |

Superseded originals: `audit/superseded/` and commit f422b30.
