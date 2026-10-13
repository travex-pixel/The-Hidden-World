# Final QA report: "Ed Gein: The Real Story Behind Netflix's Monster" (run1, 13 Oct 2026)

**Release decision: DRAFT — NOT CLEARED FOR PUBLICATION.**

The technical track passes. The gate's legal-language checks pass: no critical findings, and no guilt language beyond the legal record on any surface. The factual track is **not** cleared, by design: 14 high findings remain open. All are historical claims of medium risk (the 1944, 1954 and 1957 events and the 1958 commitment) that rest on one sure outlet group at search-summary level; none concerns a living person. Reading the Wisconsin Historical Society entries, period newspapers and Judge Gollmar's book would clear most. Details are in `audit/release-decision.md` and `audit/human-review-items.md`.

## The master file

| Item | Value |
|---|---|
| File | `documentary.mp4` |
| Size | 148,943,584 bytes (142 MiB) |
| SHA-256 | `328f3f14bbf5ce27064cbeb3101c67bb714edf539289076f8d353d5794747ca1` |
| Video | H264 1920×1080, 30 fps (26001 frames) |
| Audio | AAC, 48 kHz stereo; loudness normalised (two-pass, target −16 LUFS) |
| Duration | 7:13.35 |
| Media checks | All pass (`verify.json`) |
| Extra QA | `qa-checks.json`: all OK, including the 1280×720 thumbnail under 2 MB |
| Delivery | Private claude.ai download page: https://claude.ai/artifact/N7MiRzY3etNQqZRtJvkvXQ; served chunks re-hashed against the master before the link was shared |

## What is in this film

- **Script.** 54 narrated lines, 1033 words, every line tied to claims in `evidence/claims.json`. Opening built on the 0–10 / 10–25 / 25–40 / 40–60 s structure from three written concepts (`opening-concepts.md`).
- **Character animation.** 24 of the 54 shots are cinematic scenes with the Case Files rig; 5 have characters walking. The rest are cards, quotes, stats and stamps.
- **New for this film.** Four 1950s sets (a lonely farmhouse with night search, a fire glow for 1958, a small-town main street with a period car, a hardware store interior, and a plain hospital room) and three period figures (an illustrated Gein, not a likeness, shown only in court and in hospital; a generic sheriff and deputy). Victims appear only as silhouette cards; nothing from the house is drawn. **Rendered at 60 fps from lossless frames.**
- **Narration.** Kokoro `bm_fable`, the house narrator, with a tone on every line. Measurements and the listening checklist are in `audit/narration-qa.md`.

## Review A: investigative editor

| Area | Result |
|---|---|
| Accuracy | All 54 narration lines map to claims (no unbound line). |
| Corroboration | 15 of 45 claims are CORROBORATED by two or more independent publishers (owner groups count once). 30 are REQUIRES REVIEW (one publisher, or best-effort attribution). |
| Myths corrected | Two documented killings (not 'many'; bigger numbers are remains, mostly from graves); cannibalism not documented; Henry's death never charged and unproven; 'serial killer' depends on the definition; Netflix's invented scenes named per fact-checks. |
| Conflicts handled | Verdict wording ('committed first-degree murder' + 'legally insane'); commitment date ('early 1958'); Mendota transfer year (not stated); grave counts (not stated); gravestone's current location (not stated); car showing price (25 cents). |

## Review B: legal-risk reviewer

| Area | Result |
|---|---|
| Ed Gein (died 1984) | Legal record stated exactly (LR-01). Figure shown only in court and in hospital. |
| Victims and families | Bernice Worden and Mary Hogan shown only as silhouette cards; the film refuses to describe the remains. |
| Open findings | FC-01 MEDIUM; LR-01 to LR-03 LOW (LR-03: 'Monster' is the series title). |
| Gate G7/G8/G9/G14 | Pass: no unattributed allegation, no guilt language beyond the legal status, no implied accusation in the packaging, and every depiction backed by a factual claim. |

## Review C: senior video engineer

| Area | Result |
|---|---|
| Media checks | All pass. |
| Narration vs script | Offline speech recognition on the MP4's audio: corpus word-error rate **5.7%**. 3 lines over 20%, of which 0 differ only in number formatting. The rest are names (see `audit/narration-qa.md`). |
| Voice-to-music | 20.8 dB under speech over the whole film; 23.8 dB in the opening minute. |
| Renderer safety | Documentary code only. New: sets and figures for this film. The Shorts code (`pipeline/`) is untouched. |
| Size | 142 MiB. Under the artifact limit and the Claude Android app's 200 MiB save limit. |

## Packaging

- **Title:** Ed Gein: The Real Story Behind Netflix's Monster
- **Alternative titles:** Ed Gein True Story: What Netflix's Monster Got Wrong; Ed Gein: Myth vs Fact, From the Record; The Ed Gein Case: Two Killings, One Trial and a Legend
- **Thumbnail:** `thumbnail.png` (concept `whats-real`). Alternatives: `thumbnail-the-receipt.png`, `thumbnail-legally-insane.png`. `thumbnail-preview.png` shows each at desktop and phone-feed size with the title.
- **Files:** `youtube-description.md` (3513 chars, chapters, sources for every claim), `youtube-tags.txt`, `pinned-comment.md`, `captions.srt`/`.vtt`. The full bibliography is in `bibliography.md`.

## Still needed from a human

1. Read the key historical sources in full (FC-01).
2. Listen to the samples, especially 'Gein'.
3. Choose the thumbnail: WHAT'S REAL? / NOT NETFLIX (recommended), 1 RECEIPT / LED TO HIM, or NO PRISON / LEGALLY INSANE.
4. Sign off on the facts.
5. Approve publication.

Nothing has been uploaded or published anywhere.
