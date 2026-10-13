# Final QA report: "Faith Hedgepeth Trial: The Note, the DNA and 14 Years of Waiting" (run1, 13 Oct 2026)

**Release decision: DRAFT — NOT CLEARED FOR PUBLICATION.**

The technical track passes. The gate's legal-language checks pass: no critical findings, and no guilt language beyond the legal record on any surface. The factual track is **not** cleared, by design: 19 high findings remain open. Most are high-risk legal claims about a living defendant awaiting verdict, read only as search-result text. One is time-sensitive: the trial is ongoing (FC-02), so this cut is accurate only until the verdict. Details are in `audit/release-decision.md` and `audit/human-review-items.md`.

## The master file

| Item | Value |
|---|---|
| File | `documentary.mp4` |
| Size | 127,102,383 bytes (121 MiB) |
| SHA-256 | `0fe3273d6c47e2372118c64a7272a4cb0dac29bb7c9258628c8b5cbea4fb83ce` |
| Video | H264 1920×1080, 30 fps (21622 frames) |
| Audio | AAC, 48 kHz stereo; loudness normalised (two-pass, target −16 LUFS) |
| Duration | 6:00.37 |
| Media checks | All pass (`verify.json`) |
| Extra QA | `qa-checks.json`: all OK, including the 1280×720 thumbnail under 2 MB |
| Delivery | Private claude.ai download page: https://claude.ai/artifact/SPDC4cQMctVwyLJ4jzDBK9; served chunks re-hashed against the master before the link was shared |

## What is in this film

- **Script.** 51 narrated lines, 847 words, every line tied to claims in `evidence/claims.json`. Opening built on the 0–10 / 10–25 / 25–40 / 40–60 s structure from three written concepts (`opening-concepts.md`).
- **Character animation.** 29 of the 51 shots are cinematic scenes with the Case Files rig; 5 have characters walking. The rest are cards, quotes, stats and stamps.
- **New for this film.** Two North Carolina sets (a generic brick college campus by day, dusk and night; a generic apartment complex with police lights). The defendant and the roommate are never drawn; Faith Hedgepeth appears only as a silhouette card; passers-by are anonymous silhouettes. **Rendered at 60 fps from lossless frames** (smoother camera moves, crisper edges).
- **Narration.** Kokoro `bm_fable`, the house narrator, with a tone on every line. Measurements and the listening checklist are in `audit/narration-qa.md`.

## Review A: investigative editor

| Area | Result |
|---|---|
| Accuracy | All 51 narration lines map to claims (no unbound line). |
| Corroboration | 12 of 35 claims are CORROBORATED by two or more independent publishers (owner groups count once). 23 are REQUIRES REVIEW (one publisher, or best-effort attribution). |
| Conflicts handled | Rum vs wine bottle ('the bottle the State calls the weapon'); three vs four charges (four, as amended in 2024); plea date (not stated); trial week count (not stated); hometown (Warren County); the expletive in the note (not spoken or shown). |
| Left out on purpose | Graphic injury detail, sexual-assault forensics, the smudge exchange, all uncharged people, the DNA composite, the jail warrant, the defence's single-source 'earlier encounter' theory. |

## Review B: legal-risk reviewer

| Area | Result |
|---|---|
| Miguel Salguero-Olivares | CHARGED; pleaded not guilty; presumed innocent; trial ongoing, no verdict. Never drawn. Prosecution points attributed; defence answers given (DNA not on the bottle neck, thumbprints not matched, lost sample, 'Where's the rest of the evidence?'). |
| Karena Rosario | State witness; not named in narration, never drawn, no implication (LR-02). |
| Open findings | FC-02 HIGH (verdict pending); LR-01 to LR-03 LOW. |
| Gate G7/G8/G9/G14 | Pass: no unattributed allegation, no guilt language beyond the legal status, no implied accusation in the packaging, and every depiction backed by a factual claim. |

## Review C: senior video engineer

| Area | Result |
|---|---|
| Media checks | All pass. |
| Narration vs script | Offline speech recognition on the MP4's audio: corpus word-error rate **5.4%**. 4 lines over 20%, of which 1 differ only in number formatting. The rest are names (see `audit/narration-qa.md`). |
| Voice-to-music | 20.1 dB under speech over the whole film; 23.3 dB in the opening minute. |
| Renderer safety | Documentary code only. New: sets and figures for this film. The Shorts code (`pipeline/`) is untouched. |
| Size | 121 MiB. Under the artifact limit and the Claude Android app's 200 MiB save limit. |

## Packaging

- **Title:** Faith Hedgepeth Trial: The Note, the DNA and 14 Years of Waiting
- **Alternative titles:** Faith Hedgepeth Murder Trial: What the Jury Has Heard So Far; The Faith Hedgepeth Case: A Note, a Lost Sample and a DNA Fight in Court; UNC Student Faith Hedgepeth: The 2012 Case Now on Trial
- **Thumbnail:** `thumbnail.png` (concept `jealous-note`). Alternatives: `thumbnail-on-trial.png`, `thumbnail-no-match.png`. `thumbnail-preview.png` shows each at desktop and phone-feed size with the title.
- **Files:** `youtube-description.md` (4243 chars, chapters, sources for every claim), `youtube-tags.txt`, `pinned-comment.md`, `captions.srt`/`.vtt`. The full bibliography is in `bibliography.md`.

## Still needed from a human

1. Do not publish after a verdict without a new cut (FC-02); I can make it as soon as the verdict is reported.
2. Read the key trial stories in full (FC-01).
3. Listen to the samples, especially the names.
4. Choose the thumbnail: "JEALOUS" / THE NOTE (recommended), 14 YEARS / ON TRIAL NOW, or 9 YEARS / NO MATCH.
5. Sign off on the facts and, ideally, get a legal review (pending trial).
6. Approve publication.

Nothing has been uploaded or published anywhere.
