# Final QA report: evidence, legal-risk and engine upgrade (11 Oct 2026)

**Release decision: DRAFT — NOT CLEARED FOR PUBLICATION.** The existing MP4 is technically sound and preserved. It is **not** cleared, for three reasons:

1. High-risk claims are supported only at search-excerpt level; no source could be opened in this environment.
2. There are open HIGH legal-risk and fairness findings that need a new render to fix.
3. There is no human fact-check sign-off and no qualified legal review.

Details: `release-decision.md` and `human-review-items.md`.

## 1. Preservation of completed work

| Question | Answer |
|---|---|
| Did an MP4 already exist? | Yes, two:<br>• v1 `betsy-faria-20261011-run1/documentary.mp4`, 266,441,872 bytes (superseded)<br>• **v2 (final cut) `betsy-faria-20261011-run2/documentary.mp4`**, 261,452,223 bytes, modified 2026-10-11 12:18:14 UTC, SHA-256 `efed7ddcded0526fe062d12792fe467a61ded6b9baa5973856e08606237ff6fc` |
| Was it preserved? | Yes. It was not re-rendered, re-encoded, renamed, moved, overwritten or deleted. |
| Integrity check | Baseline recorded before any work (`../../audit/preservation-baseline.json`), re-checked at the end (`../../audit/preservation-check.json`). **All 13 media files have identical SHA-256, size and mtime.** Two runs, previews, Shorts and intermediates; no new media in the output tree. |
| Delivered to you byte-identical? | Yes, in 11 parts of 24 MiB plus `SHA256SUMS.txt` and `REASSEMBLE.txt`. Another session on this branch relayed that request. The reassembled hash was verified equal to the original before sending. |
| Was any new video generated or rendered? | **No.** Only analysis renders were made, all in scratch: still frames for pixel-regression and character-template tests. They are not deliverables. |
| Competing processes | A separate session ("Large MP4 video export") works on the same branch in its own container. I left it alone, started no render, and fetch and merge before every push. |

## 2. Review A — Investigative editor

**Accurate.** All 71 narration lines and every on-screen figure map to 61 claim records (gate G5 and G6: 0 unbound). The core chronology and legal outcomes are corroborated by at least two independent outlets at excerpt level. No narrated claim is contradicted by the evidence except one: C19, "Hupp insisted on giving her the ride", is now **DISPUTED**. A contemporaneous text reads "she offered and I accepted".

**Coherent.** The structure is sound: hook, chronology, trial, money, retrial, 2016, reckoning, status.

**Fair: not yet.**

- The prosecution's theories about Russ and his friends are aired without the retrial rebuttal (FC-05).
- The cold open frames motive and opportunity for a charged person before narrating her not-guilty plea (FC-03).
- The Shirley Neumann segment implies involvement in a death where nobody was charged (FC-06).

**Outdated.** A September 2026 defense motion is missing from the "where it stands" section (FC-14); the description now covers it.

**Unverified.** These are narrated but rest on a single or weak source:

- the serial-number detail (C43)
- the chemotherapy timing (C24)
- the 7:04 p.m. framing (FC-08)
- "Terminal cancer" (C23)
- "No one has been charged" in the Neumann case (C50, a negative claim)

## 3. Review B — Legal-risk reviewer

**Outcomes stated correctly.** Legal outcomes are represented correctly in the narration. Russ is described as convicted in 2013, then acquitted. Hupp is described as charged, pleading not guilty and presumed innocent in Betsy's death, and as convicted by Alford plea in the Gumpenberger case. Gate G8 found **no** guilt language about a charged, uncharged or acquitted person on any surface (narration, on-screen text, captions, titles, thumbnails, description). Every prosecution allegation is attributed (G7: 0).

**Risk through implication.** The risk lies in implication rather than in explicit statements:

| Finding | Severity | Issue |
|---|---|---|
| LR-02 / FC-03 | HIGH | Cold open, and a question presupposing guilt |
| LR-04 / FC-06 | HIGH | Neumann segment |
| AUD-01 | HIGH | Sentence boundary misheard by ASR in the key status line |
| LR-03 / FC-02 | HIGH | "for murdering his wife" without "convicted" |
| LR-09 | HIGH | Shorts with no status context |
| LR-06 | MEDIUM | Askey's denial without context |
| LR-01 | MEDIUM | "Wrong man" title characterisation |

**Requires qualified legal review:** the pending prosecution (bench trial January 2028; motion pending), statements about two officials, the title, and every standalone surface (Shorts, thumbnails). **No lawyer has reviewed this film, and nothing here claims legal clearance.**

## 4. Review C — Senior video engineer

**Plays correctly.** Full decode with no errors; 13,111 of 13,111 frames.

| Check | Result |
|---|---|
| Format | H.264 High 1920×1080, 16:9, SAR 1:1, 30 fps; AAC 48 kHz stereo |
| Duration | 7:17.03; audio and video lengths match |
| Loudness | −16.0 LUFS, −1.3 dBTP |
| Black or frozen segments | None |
| Sync | Stamps on their cues |
| Captions | 107 cues, text identical to the script |
| Thumbnails | 1280×720, under 2 MB |
| Shorts | Five vertical 1080×1920 files, all decode |

**Narration vs script.** The offline ASR word-error rate is 9%, almost all on proper names and number formatting. The one real risk is AUD-01 above.

**Engine safety.**

- **Byte-exact.** The upgraded engine reproduces v2's captions, transcript and audio mix byte for byte.
- **Pixel-identical.** Fourteen sampled frames match pixel for pixel.

So the upgrade did not silently change anything that ships.

## 5. Engine improvements implemented (all additive; Shorts pipeline untouched)

| Module | What it does |
|---|---|
| `documentary/films/betsy-faria/evidence/` | Claim ledger: 61 claims, each with narration wording, passages, support type, contradictions, status, confidence, qualifications, risk and review fingerprint. Plus a bibliography of 54 sources with access level and date, a per-person/per-matter legal-status registry with dated history, the packaging inventory, approvals, and 38 review findings. |
| `documentary/gate.py` | Deterministic release gate with rules G1–G15 (detailed below). Draft vs cleared decision with separate technical, factual and legal tracks. |
| `documentary/claims.py` | Claim-aware editing manifest (scene, segment, claims, sources, asset origin, on-screen text, caption cues, risk flags) and change-impact analysis. |
| `documentary/audit_asr.py` | Stage F: transcribes the MP4's own audio offline and compares it with the script. |
| `documentary/assets.py` | Asset provenance and rights pipeline (detailed below). |
| Renderer `character` template | The series' cartoon cast rig (read-only) inside the documentary renderer, labelled "STYLISED CHARACTER · NOT A LIKENESS". Async prepare step. Pixel-identical for existing shot types. |
| `documentary/build.py` | Per-sentence narration with real pauses (fixes the AUD-01 class), exact sentence-level caption timing, and Stage G gate run after every render. |
| `documentary/reports.py` | Evidence ledger, bibliography, human-review checklist and release decision, generated from the data. |

**Gate rules (G1–G15):**

- **Sources:** fabricated or unknown citations; status above what the evidence supports (no VERIFIED without a full-text read).
- **Evidence content:** passages must contain the claim's figures; conflicts and DISPUTED status.
- **Coverage:** every line evidenced; on-screen figures and timeline events tied to claims; source credits matching cited publishers.
- **Language:** allegations attributed; legal-status language per person and matter; presupposition questions.
- **Packaging:** implied accusations in thumbnails and titles; Shorts without status or outcome.
- **Change control:** script changes invalidate verification; render, captions and ASR drift.
- **Visuals:** unlabelled reconstructions; unregistered assets; depicted acts that aren't established.
- **Description:** bibliography completeness.

**Asset pipeline rules:**

- **Licences:** only clearly free licences auto-clear. News, editorial, unknown and "fair use" material always goes to human review.
- **Quality:** checks on resolution and aspect for each use.
- **Style:** cinematic cartoon identity, no photoreal people, AI imagery for environments only and always labelled.
- **Selection:** a cleared archival insert first, then the stylised character, then a silhouette.
- **Search:** Commons metadata parser.

## 6. Tests actually executed (`test-results.txt`)

`python3 -m unittest discover -s tests -v`: **114 tests, all pass.**

- 54 pre-existing Shorts tests, unchanged
- 11 documentary
- 33 gate
- 16 asset

`pipeline.schema` validates all 9 Shorts episodes.

A **mutation check** confirmed the gate tests actually detect failures. Disabling each of four key rules makes 1–4 tests fail:

- guilt-language detection
- full-text gating
- the attribution check
- change fingerprints

**Synthetic cases cover:**

- a material claim with no evidence
- an inaccessible source marked verified
- an unsupported source link
- conflicting sources
- an acquittal turned into a conviction
- an overturned conviction shown as current
- a pending charge called a conviction
- an accusation in a matter with no charge
- a disputed allegation rewritten as fact
- a script change invalidating verification
- caption drift
- an unsupported on-screen figure
- a mismatched source credit
- a misleading thumbnail
- an accusatory title
- a Short without status
- an unproven depicted act
- an open critical finding blocking clearance
- actionable messages
- a fabricated citation
- outdated status

## 7. What remains unverified, or needs a human

See `human-review-items.md` (checklist). The main items:

1. **Read in full**, to raise status from excerpt level: the high- and medium-risk sources. Court records first: the 8th Circuit opinion, the E.D. Mo. docket, the Missouri appellate opinion in the insurance case. Then the Post-Dispatch 2014 article, NRE, the NBC and KSDK pieces, and the April and September 2026 reports.
2. **Decide on a v3**, which needs your approval. It would cut or qualify L13, add the cold-open plea and fix L07, fix L00 and L76, add the retrial rebuttal, cut or qualify the Neumann segment, and fix the Askey, DNA and serial-number lines and the on-screen credits. It would be output as a new versioned file; v2 stays as is.
3. **Re-cut the Shorts** with status and outcome cards (needs your approval).
4. **Qualified legal review**, and a re-check of the case status on the publication day.
5. **Watch the film end to end** at normal volume, especially 0:00–0:38, 5:15–5:37 and 6:54–7:02.

## 8. Limitations, stated plainly

- **No full-text access.** No news or court page could be opened (network policy), so nothing is VERIFIED. Excerpts are not a substitute for reading sources.
- **Independence.** No separate AI model was available. The independent check used a separate agent context with an adversarial brief.
- **Not legal advice.** The deterministic rules are a screen; they cannot judge every implication. The semantic findings came from the human-style reviews recorded in `review-findings.json`.
- **No authentic photos.** No image search, image generator or licensed photo library was available. The hybrid "authentic photos of real people" path is implemented and tested offline but was not exercised.
