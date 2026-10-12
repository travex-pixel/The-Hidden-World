# Final QA report: "Tupac Murder Trial: Why Keffe D Was Convicted in Under 3 Hours" (run1, 12 Oct 2026)

**Release decision: DRAFT — NOT CLEARED FOR PUBLICATION.**

The technical track passes. The gate's legal-language checks pass: no critical findings, and no guilt language beyond the legal record on any surface. The factual track is **not** cleared, by design: 21 high findings remain open. Most are high-risk legal claims about named people (the verdict, the indictment, the State's theory, Davis's statements, Anderson's status), read only as search-result text. One is time-sensitive: Davis is due to be sentenced on 13 October 2026 (FC-02), so this cut must not be published after that without a new versioned cut. Clearing the rest needs the AP, KLAS and Oxygen stories read in full and a human sign-off. Details are in `audit/release-decision.md` and `audit/human-review-items.md`.

## The master file

| Item | Value |
|---|---|
| File | `documentary.mp4` |
| Size | 153,526,419 bytes (146 MiB) |
| SHA-256 | `86b5b353eb45a3a004f1ff09e451b704bc5c378f929de889f4fa0a6222be6750` |
| Video | H264 1920×1080, 30 fps (13185 frames) |
| Audio | AAC, 48 kHz stereo; loudness normalised (two-pass, target −16 LUFS) |
| Duration | 7:19.50 |
| Media checks | All pass (`verify.json`) |
| Extra QA | `qa-checks.json`: all OK, including the 1280×720 thumbnail under 2 MB |
| Delivery | Private claude.ai download page: https://claude.ai/artifact/A8CHUkgQgHc2Ca6joi6FMM; served chunks re-hashed against the master before the link was shared |

## What is in this film

- **Script.** 63 narrated lines, 1040 words, every line tied to claims in `evidence/claims.json`. Opening built on the 0–10 / 10–25 / 25–40 / 40–60 s structure from three written concepts (`opening-concepts.md`).
- **Character animation.** 38 of the 63 shots are cinematic scenes with the Case Files rig; 4 have characters walking. The rest are cards, quotes, stats and stamps.
- **New for this film.** Four 1990s Las Vegas sets (an intersection with a traffic signal and a car, a casino-hotel lobby with a security-camera look, a hospital, a TV interview studio) and two figures: Duane Davis (illustrated representation, not a likeness) and a generic TV interviewer. Tupac Shakur, Orlando Anderson and Suge Knight appear only as featureless silhouette cards. No shooting, weapon, wound or real footage is shown; the moment of the shooting is a black screen.
- **Narration.** Kokoro `bm_fable`, the house narrator, with a tone on every line. Measurements and the listening checklist are in `audit/narration-qa.md`.

## Review A: investigative editor

| Area | Result |
|---|---|
| Accuracy | All 63 narration lines map to claims (no unbound line). |
| Corroboration | 39 of 52 claims are CORROBORATED by two or more independent publishers (owner groups count once). 13 are REQUIRES REVIEW (one publisher, or best-effort attribution). |
| Conflicts handled | Verdict date 31 Aug (US) vs 1 Sep (time zones): 31 August. Deliberation: 'less than three hours' (AP; Oxygen's 'nearly three hours' agrees; the outlier '90 minutes' not used). Proffer date: 'in 2008'. BET: 'broadcast in 2018'. Wounds: 'hit several times'. Anderson's death: 'in 1998, in an unrelated shooting in Compton'. Gang enhancement (sources conflict): not mentioned. |
| Left out on purpose | Everything on the dossier's do-not-use list (Combs, Knight's shooter claim, bullets, memoir quotes, round counts, sentencing ranges), Davis's cancer claim (one outlet), the jail-fight conviction, the green-light jail call, the Sky documentary, and Tupac's age (not verified). |
| Time-sensitive | Sentencing on 13 October 2026 (FC-02). This cut is accurate as of 12 October 2026 only. |

## Review B: legal-risk reviewer

| Area | Result |
|---|---|
| Duane Davis | CONVICTED on 31 Aug 2026 of first-degree murder with use of a deadly weapon; sentencing set for 13 Oct 2026; says he is innocent and plans to appeal. 'Prosecutors never said he pulled the trigger' is stated in the cold open, chapter 5 and the close. All of his statements are attributed, and his current denial is given. |
| Orlando Anderson | Never charged; denied involvement; died 1998. Named as the shooter only as Davis's claim, always with the denial (LR-02). |
| Suge Knight | A victim of the shooting; never charged in it. Mentioned only as the driver, as surviving, and as never called to testify. |
| Others | Sean Combs, DeAndre Smith, Terry Brown and Eric Martin are not named anywhere (LR-03). The DA's 'not enough evidence to charge anyone else' is included. |
| Open findings | FC-02 HIGH (sentencing is time-sensitive); LR-01 to LR-04 LOW. |
| Gate G7/G8/G9/G14 | Pass: no unattributed allegation, no guilt language beyond the legal status, no implied accusation in the packaging, and every depiction backed by a factual claim. |

## Review C: senior video engineer

| Area | Result |
|---|---|
| Media checks | All pass. |
| Narration vs script | Offline speech recognition on the MP4's audio: corpus word-error rate **3.8%**. 0 lines over 20%, of which 0 differ only in number formatting. The rest are names (see `audit/narration-qa.md`). |
| Voice-to-music | 19.5 dB under speech over the whole film; 21.4 dB in the opening minute. |
| Renderer safety | Documentary code only. New: sets and figures for this film. The Shorts code (`pipeline/`) is untouched. |
| Size | 146 MiB. Under the artifact limit and the Claude Android app's 200 MiB save limit. |

## Packaging

- **Title:** Tupac Murder Trial: Why Keffe D Was Convicted in Under 3 Hours
- **Alternative titles:** The Tupac Shakur Murder Trial Explained: Keffe D's Own Words; Keffe D Verdict: How the Tupac Case Reached a Jury After 27 Years; Tupac Case: What the Jury Heard Before Keffe D's Sentencing
- **Thumbnail:** `thumbnail.png` (concept `own-words`). Alternatives: `thumbnail-27-years.png`, `thumbnail-verdict.png`. `thumbnail-preview.png` shows each at desktop and phone-feed size with the title.
- **Files:** `youtube-description.md` (4724 chars, chapters, sources for every claim), `youtube-tags.txt`, `pinned-comment.md`, `captions.srt`/`.vtt`. The full bibliography is in `bibliography.md`.

## Still needed from a human

1. Before 13 October 2026 only: this cut says sentencing is pending. After the hearing, a new versioned cut is needed (FC-02). I can make it once the sentence is reported.
2. Read in full: AP's verdict, ruling and 'who was there' stories, KLAS's arraignment story and the Oxygen/NBC sentencing preview; confirm the outlets the research inferred (FC-01, FC-03).
3. Listen to the MP3 samples, especially the names (AUD-01).
4. Choose the thumbnail: HIS OWN WORDS / GUILTY (recommended), 27 YEARS / UNDER 3 HOURS, or 30 YEARS LATER / GUILTY.
5. Sign off on the facts and, ideally, get a legal review (living subject, named uncharged people).
6. Approve publication.

Nothing has been uploaded or published anywhere.
