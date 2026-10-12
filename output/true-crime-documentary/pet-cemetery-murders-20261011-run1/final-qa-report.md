# Final QA report: "The Pet Cemetery Murders: The Real Case Behind HBO's Ghost Story" (run1, 12 Oct 2026)

**Release decision: DRAFT — NOT CLEARED FOR PUBLICATION.**

The technical track passes. The gate's legal-language checks pass: no critical findings, and no guilt language beyond the legal record on any surface. The factual track is **not** cleared, by design: 8 high findings remain open. Seven are high-risk legal claims about a living person (the land allegation, the prime-suspect statement, both witness accounts, the indictment, the plea and the sentence), read only as search excerpts; one is The Advocate's single-source report of a jail-visit threat (FC-03). Two things clear them: reading The Advocate's 2014 story, the Sheriff's Office plea post and FOX 8's reports in full, and a human sign-off. Details are in `audit/release-decision.md` and `audit/human-review-items.md`.

## The master file

| Item | Value |
|---|---|
| File | `documentary.mp4` |
| Size | 142,160,070 bytes (136 MiB) |
| SHA-256 | `8d1df499c499b443bf411a98f1e44d67522770dac03a9d7110b11b91630a57b6` |
| Video | H264 1920×1080, 30 fps (11969 frames) |
| Audio | AAC, 48 kHz stereo; loudness normalised (two-pass, target −16 LUFS) |
| Duration | 6:38.97 |
| Media checks | All pass (`verify.json`) |
| Extra QA | `qa-checks.json`: all OK, including the 1280×720 thumbnail under 2 MB |
| Delivery | Private claude.ai download page: https://claude.ai/artifact/LVr6GpqSMQN2UZaQQupCww; served chunks re-hashed against the master before the link was shared |

## What is in this film

- **Script.** 60 narrated lines, 911 words, every line tied to claims in `evidence/claims.json`. Opening built on the 0–10 / 10–25 / 25–40 / 40–60 s structure from three written concepts (`opening-concepts.md`).
- **Character animation.** 39 of the 60 shots are cinematic scenes with the Case Files rig; 6 have characters walking. The rest are cards, quotes, stats and stamps.
- **New for this film.** Two Louisiana sets (a pet cemetery under live oaks; a bayou/riverbank with search torches) and two illustrated figures for Brandon Nodier (1985 groundskeeper; 2014 in court), both representations, not likenesses. Witnesses are anonymous silhouettes. Dorothy Thompson appears only as a featureless silhouette card. No body, chains, weapon or violence is drawn.
- **Narration.** Kokoro `bm_fable`, the house narrator, with a tone on every line. Measurements and the listening checklist are in `audit/narration-qa.md`.

## Review A: investigative editor

| Area | Result |
|---|---|
| Accuracy | All 60 narration lines map to claims (no unbound line). |
| Corroboration | 23 of 36 claims are CORROBORATED by two or more independent publishers (owner groups count once). 13 are REQUIRES REVIEW (one publisher, or best-effort attribution). |
| Conflicts handled | Age 61 vs 63 (61 used); 'ten days' vs 'days' before trial ('days'); suffocated vs strangled (Sheriff's Office wording, attributed); reopened 2009 vs 2012 (2009 reopening, 2012 second witness); 'witness' vs 'anonymous caller' ('a man came forward'); ghost vs threat as the second witness's reason (both given, each attributed). |
| Left out on purpose | The victim's own past (1970 shooting ruled self-defence; a later husband found shot, no charges): single-source and adverse to her. The 200-pound chains figure, the named second witness, the 1934 family history, Nodier's family, and anything from HBO's own reconstructions. |
| Runtime | 6:39, shorter than The Widower. The public record is thin (RogerEbert.com's reviewer says the same); the film is not padded. |

## Review B: legal-risk reviewer

| Area | Result |
|---|---|
| Brandon Nodier | Indicted for second-degree murder (2012); pleaded guilty to MANSLAUGHTER under a plea deal (2014); sentenced to 10 years. Never called a murderer or killer; 'murder' appears only for the indictment, HBO's title and the reviewer's words. His whereabouts are given as unknown, attributed. |
| The ghost | Always a witness's claim, attributed ('he said', 'according to Doran'). The thumbnail uses a question mark. |
| The second witness | Not named (police did not name him); shown only as a silhouette. His immunity is stated. |
| Dorothy Thompson | Victim. Not depicted. Her own past is not used (LR-03). |
| Open LOW findings | LR-01 (Nodier's illustrated figure), LR-02 (witness not named), LR-03 (victim's past omitted), LR-04 (HBO's 'Murders' title vs the manslaughter plea, stated in the film). |
| Gate G7/G8/G9/G14 | Pass: no unattributed allegation, no guilt language beyond the legal status, no implied accusation in the packaging, and every depiction backed by a factual claim. |

## Review C: senior video engineer

| Area | Result |
|---|---|
| Media checks | All pass. |
| Narration vs script | Offline speech recognition on the MP4's audio: corpus word-error rate **7.7%**. 8 lines over 20%, of which 2 differ only in number formatting. The rest are names (see `audit/narration-qa.md`). |
| Voice-to-music | 19.4 dB under speech over the whole film; 21.7 dB in the opening minute. |
| Renderer safety | Documentary code only. New: sets and figures for this film. The Shorts code (`pipeline/`) is untouched. |
| Size | 136 MiB. Under the artifact limit and the Claude Android app's 200 MiB save limit. |

## Packaging

- **Title:** The Pet Cemetery Murders: The Real Case Behind HBO's Ghost Story
- **Alternative titles:** The Pet Cemetery Murders True Story: A Ghost, Two Witnesses and a Plea Deal; Dorothy Thompson: The 1985 Pet Cemetery Case HBO Calls a Ghost Story; The Pet Cemetery Murders Explained: What the Court Record Shows
- **Thumbnail:** `thumbnail.png` (concept `haunted-witness`). Alternatives: `thumbnail-chained-1985.png`, `thumbnail-not-murder.png`. `thumbnail-preview.png` shows each at desktop and phone-feed size with the title.
- **Files:** `youtube-description.md` (2812 chars, chapters, sources for every claim), `youtube-tags.txt`, `pinned-comment.md`, `captions.srt`/`.vtt`. The full bibliography is in `bibliography.md`.

## Still needed from a human

1. Read in full: The Advocate's 2014 plea story, the Sheriff's Office plea post, FOX 8's 2012 and 2014 reports, and (if reachable) the original Reuters story. Confirm the Doran quotes (FC-02) and the jail-visit threat (FC-03); if either cannot be confirmed, cut it in a new versioned cut.
2. Listen to the five MP3 samples, especially the pronunciation of 'Nodier' (AUD-01).
3. Choose the thumbnail: HAUNTED? / THE WITNESS (recommended), CHAINED 1985, or NOT MURDER / MANSLAUGHTER.
4. Sign off on the facts and, ideally, get a legal review (living subject).
5. Approve publication.

Nothing has been uploaded or published anywhere.
