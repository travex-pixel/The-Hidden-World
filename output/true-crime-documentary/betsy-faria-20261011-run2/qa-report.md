# QA report: *The Murder That Sent the Wrong Man to Prison* (v2, final)

**Run:** `output/true-crime-documentary/betsy-faria-20261011-run2/`
**Date:** 11 Oct 2026
**Machine-readable results:**
- `verify.json` (core media checks)
- `qa-checks.json` (extended checks)
- `shorts/shorts-verify.json` (vertical cut-downs)

Every result below was measured in this session. Nothing is estimated.

## 1. Isolation of the active Shorts production

| Check | Result |
|---|---|
| Working copy | Its own cloud container with a fresh clone. Only this session's processes were running in it, so it shared no working directory with the Shorts instance. |
| Branch | Dedicated branch `claude/true-crime-documentary-vwz6m8`. No pushes to any other branch, no PR, no deploy. |
| Pre-existing files changed | Only `.gitignore`: 6 lines added so heavy documentary media stay out of git. `git diff --stat bebf9f3 HEAD` shows no other pre-existing file. |
| Shorts code, episodes, workflows, `releases/`, `series/` | Untouched. The documentary imports `pipeline/narrate.py`, `pipeline/audio.py` and `pipeline/verify.py` read-only, with explicit parameters, and changes no defaults. |
| Shorts regression tests | Baseline before any change: **54/54 pass**. Final: **65/65 pass** (the 54 originals plus 11 new documentary tests). `pipeline.schema` validates all 9 existing episodes. |
| Output location | `output/true-crime-documentary/<film>-<date>-runN/`. The suffix is unique per run, so no run overwrites another. |

## 2. Review pass A: investigative editor

**Method:**
- Each of the 71 narrated sentences was checked against `source-ledger.md`.
- Allegations were checked for attribution.
- Hupp's legal status was checked in every place it appears.
- Automated guardrails in `tests/test_documentary.py` fail the build if the script claims or implies that Hupp was convicted of Betsy's murder, if "presumed innocent" or "pleaded not guilty" is missing, or if "planted" and "frame Russ" are not attributed to prosecutors.

| Finding | Severity | Action |
|---|---|---|
| v1 said "a different set of facts never reached that jury". Hupp actually testified at the 2013 trial (AP), so the jury heard from her. What was barred was the defense's alternative-suspect argument. | Material | **Fixed in v2.** The line now reads "the jury never heard the defense's case about someone else", and a new line says she testified for the prosecution. |
| The changing-account claim relies on Post-Dispatch reporting. | Attribution | **Fixed.** The narration now says "according to the Post-Dispatch". |
| v1 phone-records line said "stayed in the area longer than she said". Its only support was a forum post quoting the Post-Dispatch. | Unsupported | **Fixed before v1 rendered.** The line now says only that the records became "a key point of dispute". |
| The "$100,000 trust withdrawn" detail and the Neumann insurance figures failed verification. | Unsupported | **Omitted.** |
| Judge Ohmer's exact words and the appeals-court sentence were seen only in search excerpts. | Quote risk | **Paraphrased**, with no quote cards. |
| The 2026 status (jury waived, death penalty dropped, bench trial January 2028) is new and could change. | Currency | Confirmed in KSDK, FOX 2, KMOV and Biography (Oct 2026). The description says "current as of Oct 11, 2026", and the upload checklist says to re-check on the day you publish. |

Limitation: the network policy blocked opening full pages, so claims were verified against search-result excerpts tied to cited URLs. The ledger marks the ⚠ items for a human to open before publishing.

## 3. Review pass B: retention editor

| Metric (v2) | Value | Target |
|---|---|---|
| First visual | GUILTY stamp at 0.0–0.4 s | Immediate |
| Contradiction (GUILTY → NOT GUILTY) | NOT GUILTY at **3.6 s**; it was 8.5 s in v1 | Within the first 5 s |
| Stakes and central question | Stakes by 0:23: the friend is now charged, and she was the $150,000 beneficiary. Central question asked at 0:25.7; the second question ends at 0:38. | Within 30 s |
| Cuts in the first 30 s | 10 (at 0.0, 2.3, 3.6, 6.5, 8.3, 11.5, 15.3, 19.9, 23.1, 25.7, 29.5) | One every 2–5 s |
| Meaningful visual beats | **135** (18.5 per minute; mean 3.24 s; median 3.17 s) | 120–200 |
| Shots longer than 5 s | 4: an explainer document (5.2 s), a TV scene (5.1 s), the closing status split (5.6 s), the final line (6.2 s) | Deliberate holds |
| Template mix | scene 27, kinetic 25, doc 11, profile 10, list 10, title 8, date 7, verdict 6, stat 6, timeline 6, split 6, board 4, question 3, map 3, clock 2, endcard 1 | Varied |

Changes made in this pass:
- Rebuilt the cold open as "Life without parole… Two years later: not guilty. His name is Russ Faria."
- Removed repeated visuals: a third "files" shot became an evidence-board money flow, and the appeal shot became a defense-attorney card.
- Replaced a duplicated "Charged. Not convicted." with "Case pending."
- Split eight holds of 6 to 8.6 seconds into purposeful beats.

Every cut lands on a new fact, date, name or place, and illustrations sit under sentences that describe them. There are no random zooms; camera moves are slow push-ins.

## 4. Review pass C: production QA engineer

### Final master: `documentary.mp4`

| Check | Result |
|---|---|
| Container / video / audio | MP4 · H.264 High, yuv420p · AAC-LC 48 kHz stereo, 191 kb/s |
| Resolution / aspect | **1920×1080**, DAR 16:9, SAR 1:1 (no letterboxing, no stretching) |
| Frame rate / duration | **30 fps** · **7:17.03** (437.03 s); the audio and video durations match |
| Frame count | 13,111 decoded = 13,111 expected (no missing frames) |
| Full decode | Clean: no errors across the whole file |
| Black frames > 0.6 s | **0**. v1 had a near-black opening of 0.87 s, found by this check and fixed in v2. |
| Frozen video > 4 s | 0 |
| Loudness | **−16.0 LUFS** integrated; true peak **−1.3 dBTP**. The first v2 mux measured −0.7 dBTP, so the mux was switched to two-pass linear loudnorm and the file re-muxed. |
| Voice-to-music balance (measured on v1's mix, same mix settings) | Speech −17 dBFS RMS against −32 to −35 dBFS for the music-only bed, so the voice sits about 15–18 dB above the music. |
| A/V sync | `sync_check.png`: the GUILTY, NOT GUILTY, GUILTY and NOT GUILTY stamps are on screen at their cue times (0.7 s, 4.3 s, 175.7 s, 239.2 s). The impact SFX are scheduled from the same timeline. |
| Captions | 107 cues in both SRT and VTT. They are ordered and stay inside the film. All cues have 2 lines or fewer and 42 characters or fewer per line. The shortest cue lasts 1.0 s and the fastest reads at 19.4 characters per second. Caption text matches the narration script **word-for-word**. |
| Pronunciation | "Faria" is forced to /fəˈɹiːə/ with raw phonemes, which the phonemizer output confirms. Numbers, "911" and years are read as natural spoken forms. |
| Thumbnails | `thumbnail.png` plus 3 concepts, each **1280×720 PNG**, 1.4–1.6 MB, under YouTube's 2 MB limit. |
| Vertical cut-downs | 5 of 5 pass: 1080×1920, H.264 + AAC, clean decode, durations 25.7 / 55.2 / 54.4 / 27.7 / 30.1 s. A test render found the captions re-wrapping to 4 lines at vertical width, so they are now re-chunked to ≤28 characters × 2 lines. |
| Render performance | 13,111 frames in 730 s with 4 Chromium workers (about 18 fps). |

## 5. Known limitations (stated plainly)

- **Source access:** full pages could not be opened from this environment, only search excerpts. The ⚠ links in the ledger need a human read before publishing.
- **Playback:** "successful playback" was verified mechanically (full decode, frame count, black-frame and freeze detection, sync stills). No person has watched the film end to end. Please watch it before publishing.
- **Captions:** generated from the exact script and timed to each narration clip, with proportional timing inside each sentence. They were not cross-checked by speech recognition, because no ASR model is available offline here. Timing inside long sentences can drift a few hundred milliseconds.
- **Narration:** a synthetic voice (Piper `en_US-ljspeech-high`, public-domain dataset). It is clear, but less expressive than a human narrator.
- **Visuals:** there is no archival or licensed imagery. Everything is original vector illustration, labelled on screen. This is the safe choice, but less immersive than authentic footage would be.
- **Music:** procedural and original (NumPy). It is functional, not a composed score.
- **Length:** 7:17 sits inside the 6–10 minute range but is shorter than the roughly 8-minute target. The script was kept to what the sources support rather than padded.
