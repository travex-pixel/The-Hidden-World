# Final QA report: "Lizzie Borden Was Acquitted. So Who Killed the Bordens?" (11 Oct 2026)

**Release decision: DRAFT — NOT CLEARED FOR PUBLICATION.**

The gate's technical, factual and legal-risk tracks all pass, with 0 critical, 0 high and 0 medium findings. The film is still a draft because no human fact-check sign-off and no qualified legal review have been recorded. Details are in `audit/release-decision.md` and `audit/human-review-items.md`.

## The master file

| Item | Value |
|---|---|
| File | `documentary.mp4` |
| Size | 192,454,587 bytes |
| SHA-256 | `6bafaad2219689da751558bc54a80e79184a61116a3417106fc2fa5cd0ecbebb` |
| Video | H.264, 1920×1080, 30 fps (15,629 frames) |
| Audio | AAC, 48 kHz stereo; loudness normalised (two-pass, target −16 LUFS) |
| Duration | 8:40.97 |
| Media checks | All 12 pass (`verify.json`): streams, codecs, dimensions, fps, A/V duration, duration vs timeline, full decode, not silent, no long silences, no clipping |
| Extra QA | `qa-checks.json`: all OK, including the 1280×720 thumbnail under 2 MB |
| Delivery | Private claude.ai download page (`documentary/deliver.py`). The served bytes re-hashed identical to the master. |

## What is new in this film

- **Character animation throughout.** 73 of the 111 shots are cinematic scenes made with the Case Files rig: full-body characters that walk, act, blink and turn, in painted sets with depth parallax and camera moves.
- **Reused sets.** The house, kitchen and parlour sets are reused read-only from Case File 08.
- **Six new sets:** barn loft, drugstore, front hall with stairs, mill city, cemetery and jail cell.
- **Six new generic figures:** Bridget, Emma, Morse, the doctor, the drugstore clerk and the defence lawyer.
- **Overlay style from the Shorts:** FUN FACT pop-ups, lower thirds, typed summary cards and stamps.

## Review A — Investigative editor

| Area | Result |
|---|---|
| Accuracy | All 91 narration lines map to 71 claims (gate G5: 0 unbound). |
| Corroboration | 57 claims are CORROBORATED by two or more independent publishers. A+E sites (HISTORY.com, aetv.com, Biography.com) count as one publisher. |
| Single-source details | 14 low-risk details rest on one publisher and are marked REQUIRES REVIEW (finding FC-01). |
| Sources that disagree | Each conflict is handled explicitly: jury deliberation length, Andrew's return time, Lizzie's exact words, Russell's warning, Andrew's age. Every claim records how the script handles it (`conflict_handling`). |
| Corrections from research | 10:45 became "shortly before eleven". The "sealskin cape" detail was cut (fan-blog only). The cold open no longer says Russell saw the dress go into the stove; her own testimony says she did not. |
| Fairness | Prosecution points are attributed. The defence answers are given: Bridget's "no quarrels", Lubinsky, Emma's account of the dress, Russell's "no blood". Theories about other people are labelled "theories, not findings", next to their limits. |

## Review B — Legal-risk reviewer

| Area | Result |
|---|---|
| Lizzie Borden | ACQUITTED, 20 June 1893. Gate G8 found no guilt language about her on any surface. Thumbnail and title state the verdict. |
| Bridget Sullivan, John Morse, Emma Borden | NOT_CHARGED. They are named only as subjects of later theories, framed as unproven. |
| Everyone involved | All died long ago; no living person is accused. |
| Andrew and Abby Borden | Never depicted. No blood, wounds or weapon is drawn. The hatchet head appears only as typed text. |
| The poison allegation | The customer is an anonymous silhouette, labelled as Bence's account. |
| Open LOW findings | LR-01: the historians' line could be heard as implying guilt; it is balanced in the next line. LR-02: the thumbnail pairs an illustrated Lizzie with the question; the alternative thumbnail shows no person. |

## Review C — Senior video engineer

| Area | Result |
|---|---|
| Media checks | All pass. |
| Narration vs script | Offline speech recognition on the MP4's own audio: corpus word-error rate **4%** (the Betsy Faria film was 9%). Five lines are over 20%, mostly names (AUD-01). |
| Listen-checks | 7:51 ("an unknown intruder") and 2:19 ("John Morse went out"). |
| Renderer safety | The changes add to the renderer without altering existing output: 18 sampled Betsy Faria v2 frames are pixel-identical before and after. The vendored Case Files modules are byte-copies (`documentary/renderer/cine/SOURCE.md`). |
| Size | CRF 22 with lighter grain on cinematic shots keeps the master at 184 MiB. That is under the artifact limit, and under the Claude Android app's 200 MiB save limit. |

## Still needed from a human

1. Read the key transcripts in full on Famous Trials (Russell, Sullivan, Emma Borden, Lubinsky, the inquest), and the Smithsonian and Britannica pages.
2. Listen at 2:19 and 7:51.
3. Choose the thumbnail (LR-02).
4. Sign off on the facts, and the legal review if wanted.
5. Approve publication. Nothing has been uploaded or published anywhere.
