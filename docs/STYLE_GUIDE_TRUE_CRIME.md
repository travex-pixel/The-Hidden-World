# Case Files: production style guide (cinematic edition)

A short reference for every new episode. Tools: `series/true-crime-cinematic/produce.py`, `pipeline/score.py`, `pipeline/mixdown.py` and the QA gate (`series/true-crime/qa.py --series series/true-crime-cinematic`).

## Story
- **Open on the most compelling verified detail.** Not a date, a biography or a disclaimer. The first sentence must make a viewer ask "why?".
- **Every scene earns its place.** It raises a question, reveals a verified fact, clarifies the timeline, explains a legal step, corrects a misconception, or deepens an open question. Never restate to pad.
- **Write for the ear.** Use short sentences with varied length. Put pauses before revelations (`pause_before`), and leave space after them. A spoken line is at most about 90 characters.
- **End on a real, current, sourced open question or legal milestone.** Never withhold something the episode could easily explain.
- **Runtime:** the shortest that tells the story properly, at most 90 s for Shorts.

## What our best performer does (BTK "floppy disk", Case File 03)
On the owner's Instagram, this episode has done best so far. That is the owner's report; we cannot see the analytics. What sets it apart from the other episodes:
1. **The hook is the setup and the mystery, not the answer.** It opens "A serial killer asked the police one question. / Could a floppy disk be traced?" The payoff (the deleted file that named him) comes at about 70% of the runtime. Episodes that open with the answer ("A pizza crust helped crack the case") give the payoff away in the first line.
2. **Irony early.** At about 6 s: "They told him it was safe. / They lied." The arrogant killer is outsmarted by the people he taunted.
3. **One hero object,** shown big, centred and readable at thumbnail size in the first and last frames. Here it is the floppy disk, a familiar object, so the cover frame reads instantly in the grid and the ending loops back to the opening.
4. **A chain of concrete micro-reveals,** each a simple object close-up: cereal box, note, newspaper ad, disk, deleted file, church, name. Each one reads in under a second on a phone.
5. **Real words, verified:** short reported quotes on a "wording as reported" card ("Rex, it will be OK").
6. **Fewer words, more air:** 175 words at 136 wpm, against 190–215 words at about 147 wpm in the other episodes. There are 16 short scenes, about 4.8 s each.
7. **A callback ending that echoes the opener:** "31 years of hiding, / ended by one question, one lie, and one deleted file." It ends on the same object it opened with, which invites a rewatch.

Since Case File 10, every episode follows these points. The NEXT CASE tease comes after the callback line.

**Update, 2026-10-12.** Gilgo Beach (Case File 07) became the best performer: 1.6k views, 25 likes, 4 saves and 1 repost in 12 hours, as reported by the owner. It shares the BTK pattern in its first line: an **everyday object meets an infamous killer** ("A pizza crust thrown in a Manhattan trash can helped crack the Gilgo Beach killings"). It names the object and the case but holds back *how* the object worked, and that "how" becomes the payoff. It also has a recent, closed case (2026 plea and sentence), a justice ending, and a respectful memorial line. From Case File 15 onward, episodes lead with that pairing.

**Update, 2026-10-12 (first real analytics).** The owner shared Instagram's Insights for the Boston Strangler (Case File 16, 79 s): 1,558 views in 5 hours, 99.9 % non-followers, skip rate 31.5 % ("lower than typical"), like, share and repost rates "higher than typical", average watch time 23 s, 0 comments, 0 saves, 1 follow. Lined up against the timeline:
- **The hook is a contradiction, not just an object.** "A man confessed to being the Boston Strangler. / For decades, many doubted him. / Then someone threw a water bottle away." Confessed-but-doubted is a question the viewer has to stay for; the bottle is on screen, unexplained. The biggest like spike (about 12 %) is at 0:02–0:05, before anyone has seen the story: a bold, paradoxical first line gets liked on its own.
- **A stakes number by 0:10** ("thirteen women were killed"): second like spike at 0:10–0:15.
- **Retention:** 100 → 50 % in the first 3 s, 30 % by 0:15, then a **flat plateau at 25 % from 0:15 to 1:00**: nobody left mid-story, so the clue chain holds. The leak is the **tail from 1:00 to 1:19 (25 → 8 %)**: the caveat ("links him to her murder only / still debated"), the memorial and the NEXT CASE card are 19 s of after-story. Keep the outcome inside the last 8 s; put caveats on a card, not in narration.
- **Mid-video like spikes at 0:35, 0:48, 0:58** land on the named victim, the familial match and the exhumation: one concrete reveal every 10–12 s, each with `music_drop` or a pause, keeps the plateau flat.
- **Comments 0, saves 0:** the question in the caption did nothing. From Case File 25, the closing question is burned into the picture (`end_title`, the mirror of `hook_title`) as a two-option choice.
- **23 s average watch** on a 79 s video is 29 %. The same 23 s on a 42 s cut is 55 %, which is why the 40-second cuts remain the main format.
- Distribution was flat for 3 hours, then broke out at 3–5 hours: Instagram's staged test. The first 3 seconds decide it; everything else decides whether it keeps going.
The breakout cannot be separated from the topic (a household-name case) with one sample. The rules above are the parts that can be reproduced.

## Facts and fairness
- Every narrated claim maps to a claim in `episode.json` with at least two independent sources. The episode's `research.md` separates established facts, allegations (attributed), defence positions, court procedure and unresolved questions.
- **Ongoing cases:**
  - Say "prosecutors allege", "is charged with" and "has pleaded not guilty".
  - State the presumption of innocence, and say that a holding order or arraignment is not a verdict.
  - Re-verify the legal status and the next court date on the production day, and record the date (`legal_status_verified`).
- Never invent dialogue, quotes, messages, evidence, documents, recordings or motives. Exclude tabloid-only and social-media claims.
- **Victims and families:** no graphic detail, no depiction of the victim or remains, no sensational sign-off. Close with respect.

## Picture
- **Look:** dark graphic novel with a watercolour wash (`overlay: "wash"`), ink outlines, cel shadow, rim light, a grade per scene, grain and vignette.
- **People:**
  - Characters in `characters/figures/` are reused for continuity.
  - Real people in closed cases are illustrated representations ("not a likeness"), labelled on screen.
  - In ongoing cases, everyone appears as an **anonymous rim-lit silhouette** (`silhouette: 'cool' | 'warm'`).
- **Action:** every character shot has someone doing something, keyed to the spoken word (`WT(ctx, line, word)`). There are no static figures under a zoom.
- **Variety:** at least 4 sets; no set or shot size above 50–60 % of shots. The QA gate enforces this.
- **Atmosphere:** rain (`rain`), fog, police lights, reflections (courthouse plaza), handheld drift (`cam.handheld`) for tension, and practical light sources.
- **On-screen text** is selective: dates, names, charges and short verified phrases. Every reconstruction carries an ILLUSTRATION tag, and generic places say so ("GENERIC HOUSE, NOT THE REAL HOME"). No imitation of official documents, police or court material.

## Captions
- Punch captions, 1–3 words, word-synced. The current word is yellow and key words red.
- They sit inside the Shorts safe area (`caption_y` 1380, `caption_max_w` 800, checked with real font metrics).
- Pronunciation fixes go in `narrator_profile.pronounce` (for example `{"D4vd": "David"}`), so captions keep the written name.

## Sound
- **Score:** `episode.score` (`pipeline/score.py`). The sections are:

  | Section | Role | Content |
  |---|---|---|
  | A | hook | held chord and motif |
  | B | investigation | heartbeat pulse and breathing texture |
  | C | questions | minor-second and tritone colour, metal swells |
  | D | cliffhanger | riser, one impact, unresolved cluster |
  | E | exit | incomplete motif, fade with the picture |

  Set them per scene with `"section"`. Anchor the cliffhanger impact to a word with `score.cliff`.
- **Mix:** narration first (`pipeline/mixdown.py`).
  - Lines are levelled to −18 dBFS voiced RMS.
  - Stems duck by their own depth under speech; the mid-range ones duck hardest.
  - Use `music_drop` under a key statement.
  - Loudness is linear at −14 LUFS with true peak at or below −1.5 dBTP; there is no dynamic gain riding.
- **Phone speakers:** the bed must be audible above 300 Hz in every narration gap. Bass-only beds play as silence on phones; that was the cause of the "opening dropout" in Case Files 01/02.
- **Effects** need a reason: rain beds, steps, paper, a gavel on the word. No fake "authentic" recordings.

## QA gate (must all pass before a file reaches `output/`)
- **Media:** codec, size and frame rate, a full decode, no black frames, A/V duration.
- **Audio:** EBU R128 loudness and true peak; speech-recognition word error rate of 0.25 or less; opening speech steady with no holes; narration on time; music never masks speech, and is audible; no clipping; no long silence; an intentional ending; mono-compatible.
- **Captions:** inside the Shorts safe area.
- **Picture:** no frozen picture.
- **Shots:** characters act in every character shot; shot variety; every shot sourced and tagged.

Then the human-style review passes (executive producer, composer, audio engineer, legal-factual, mobile retention) are recorded in `production_manifest.json`.
