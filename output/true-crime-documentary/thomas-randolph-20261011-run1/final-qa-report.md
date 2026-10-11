# Final QA report: "The Widower True Story: Where Is Thomas Randolph Now?" (11 Oct 2026)

**Release decision: DRAFT — NOT CLEARED FOR PUBLICATION.**

The technical track passes. The gate's legal-language checks pass: no critical findings, and no guilt language beyond the legal record on any surface. The factual track is **not** cleared, by design. 14 high findings remain open, all of one kind: high-risk legal claims about a living person, and three prosecution-evidence details, that were read only as search excerpts. Two things clear them: reading the two Nevada Supreme Court rulings and three news stories in full, and a human sign-off. Details are in `audit/release-decision.md` and `audit/human-review-items.md`.

## The master file

| Item | Value |
|---|---|
| File | `documentary.mp4` |
| Size | 164,002,257 bytes (156 MiB) |
| SHA-256 | `261c7271f95791b96a7beaf82485b06d0e016ce6c2192422caca089beb8a4210` |
| Video | H264 1920×1080, 30 fps (13639 frames) |
| Audio | AAC, 48 kHz stereo; loudness normalised (two-pass, target −16 LUFS) |
| Duration | 7:34.63 |
| Media checks | All pass (`verify.json`) |
| Extra QA | `qa-checks.json`: all OK, including the 1280×720 thumbnail under 2 MB |
| Delivery | Private claude.ai download page (`documentary/deliver.py`); served bytes re-hashed against the master before the link was shared |

## What is in this film

- **Character animation.** 58 of the 87 shots are cinematic scenes made with the Case Files rig. 18 of them have characters walking, as in the Case Files Shorts. The rest are cards, quotes and stamps.
- **New for this film.** Five modern sets (desert-suburb house, neon skyline, wedding chapel, interview room, mountain town) and five generic modern figures. Randolph's figure is an illustrated representation, not a likeness. It is shown only on the phone, at home, with detectives, in custody or in court, and never doing anything from the allegations.
- **Victims are never drawn.** Sharon Causse, Michael Miller and Becky Gault appear only as featureless silhouette cards.
- **Narrator.** A deeper LibriTTS-R voice (speaker 428), at about 160 words a minute.

## Review A: investigative editor

| Area | Result |
|---|---|
| Accuracy | All 78 narration lines map to claims (gate G5: no line is unbound). |
| Corroboration | 44 of 55 claims are CORROBORATED by two or more independent publishers. Owner groups count once: Fox stations as one; KLAS and NewsNation as one; NBC, Oxygen and Dateline as one; the court mirrors as one. |
| Needs review | 11 claims are REQUIRES REVIEW: they rest on one publisher, or on a passage whose publisher was assigned on a best-effort basis. The ones that matter most are the trial-evidence details in FC-02: the clean ski mask, "nearly 300" calls, the CPR exchange on the 911 call, the defence closing and the mimicked gunfire. Each is attributed on screen. |
| Conflicts handled | 2020 vs 2021 reversal (court stamp used); $300k–$400k insurance ("more than $300,000, prosecutors said"); four vs three wives dead; 8 vs 9 May (says "May 2008"); Farmington vs Clearfield (says "Utah"); 31 Aug vs "early September" 2026; 4 vs 5 hours of deliberation ("more than four hours"). |
| Left out on purpose | The "reputed drug dealer" label, Glen Morrison's uncharged allegation about Francis, the "Steve" anecdote, the hospital settlement, insurance totals across marriages, the 24.9M Netflix figure, and Rotten Tomatoes scores. |

## Review B: legal-risk reviewer

| Area | Result |
|---|---|
| Sharon Causse and Michael Miller (2008) | CONVICTED in 2023, affirmed 31 Aug 2026. The 2017 conviction is always paired with its reversal. |
| Becky Gault (1986) | ACQUITTED in 1989. Every Utah allegation is paired with the acquittal. The 2017 jury's hearing of it is described as the reason for the reversal. |
| Witness tampering | Pleaded guilty. The plea is named exactly: never "attempted murder". The underlying offer is attributed to news reports. |
| Francis Randolph, Leona Stapleton | Medical deaths as reported. Never charged, and the film says so. No insinuation (LR-01). |
| Michael Miller | Never charged; he died that night. Appears only as "prosecutors alleged", and the defence's account that he acted alone is given. |
| His position | "Randolph says he is innocent", including his own words at sentencing. The film does not say his appeals are over (LR-04). |
| Gate G7/G8/G9/G14 | Pass: no unattributed allegation, no guilt language beyond the legal status, no implied accusation in the packaging, and every depiction of Randolph backed by a factual claim. |
| Open LOW findings | LR-01 ("four of six wives"), LR-02 (thumbnail pairs his illustration with "THE WIDOWER"; alternatives exist), LR-03 (tampering and Miller wording), LR-04 (post-ruling filings unverified; prison location time-sensitive). |

## Review C: senior video engineer

| Area | Result |
|---|---|
| Media checks | All pass. |
| Narration vs script | Offline speech recognition on the MP4's own audio gives a corpus word-error rate of **6%**. 9 lines are over 20%. |
| Listen-checks | 2:22 "sixth wife", 3:34 "He was fifty-three" and 6:39 "he is innocent" (AUD-01). Cosmetic: two badge labels clip at about 0:05 and 2:40 (AUD-02); the renderer is fixed for future cuts. |
| Renderer safety | Only additions: five sets in `cine-sets.js` and a `speaker` option in `build.py` for multi-speaker voices. Existing films and the Shorts code are untouched. All 123 tests pass. |
| Size | 156 MiB. Under the artifact limit and the Claude Android app's 200 MiB save limit. |

## Packaging

- **Title:** The Widower True Story: Where Is Thomas Randolph Now?
- **Thumbnail:** `thumbnail.png` (concept `widower-chapel`). Alternatives: `thumbnail-two-verdicts.png` and `thumbnail-house-911.png` (no person).
- **Files:** `youtube-description.md` (4908 chars, chapters, sources for every claim), `youtube-tags.txt`, `pinned-comment.md`, `captions.srt`/`.vtt`. The full bibliography is in `bibliography.md`.

## Still needed from a human

1. Read in full: the Nevada Supreme Court opinion of 10 Dec 2020 (No. 73825) and its order of 31 Aug 2026 (No. 88625), Fox News's August 2023 verdict story, the A&E explainer, and the Review-Journal's 2023 retrial story. Confirm the FC-02 details. If any detail cannot be confirmed, reword or cut it; that needs a new render.
2. Before publishing after 25 Oct 2026, re-check the court docket and Randolph's prison location (LR-04).
3. Choose the thumbnail (LR-02).
4. Sign off on the facts and, ideally, get a legal review (living subject).
5. Approve publication. Nothing has been uploaded or published anywhere.
