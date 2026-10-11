# Narration QA: The Widower v2 (run2)

**I cannot hear audio.** Everything below is a measurement: pitch tracking, timing, spectra, levels and offline speech recognition. None of it is listening. The listening checks at the end are for a human, and the owner has the final say on the voice.

## Why v1 sounded read rather than told (measured causes)

- **Mechanical rhythm.** Every pause between sentences was exactly 0.36 s, and every pause between lines 0.34 s.
- **One speed for the whole film.** A single speed setting (1.3) stretched the VITS voice. Stretching like that tends to drawl.
- **The same melody on every line.** Each line's pitch shape was similar: the spread across lines was 0.37 st.
- **A dull, muddy tone.** 22 kHz audio with nothing above 11 kHz, heavy energy at 150–400 Hz, and no EQ, de-essing or compression.
- **Written for the page.** Long sentences in report wording, the same 'X said' patterns, and an opening that described events instead of telling them.

## v1 vs v2 (measured)

| | v1 (run1) | v2 (run2) |
|---|---|---|
| Engine / voice | Piper VITS, LibriTTS-R speaker 428, 22 kHz | Kokoro v1.0 `bm_fable`, 24 kHz |
| Pitch movement within a line (median SD) | 2.63 st | 4.47 st |
| Pitch range within a line (median, 5th–95th pct) | 8.8 st | 14.8 st |
| Speaking rate while talking (median) | 2.96 words/s | 2.5 words/s |
| Pauses between sentences | all [0.36] s (SD 0.0 s) | 0.25–0.42+ s, set by tone (SD 0.086 s) |
| Voice-to-music ratio under speech | 20.0 dB | 19.4 dB (about 22 dB in the opening minute) |
| Speech recognition on the final audio (corpus WER) | 5.9%, 9 lines over 20% | 2.4%, 0 lines over 20% |
| Voice processing | peak-normalise only | high-pass, low-mid cut, presence lift, de-esser (tuned per voice), 2.2:1 compression, sentence level matching |

## Voice audition (same passage, speed 1.0, same processing)

| Voice | Words/s | F0 (Hz) | Pitch SD within (st) | Between sentences (st) | WER |
|---|---|---|---|---|---|
| am_michael | 3.25 | 117 | 3.05 | 1.1 | 5.5% |
| am_fenrir | 3.42 | 140 | 4.17 | 1.32 | 3.1% |
| am_puck | 3.54 | 119 | 2.99 | 1.21 | 3.1% |
| am_onyx | 3.26 | 88 | 2.32 | 0.62 | 4.3% |
| am_eric | 3.49 | 161 | 3.91 | 0.36 | 9.8% |
| am_adam | 3.53 | 119 | 3.26 | 0.86 | 9.8% |
| bm_george | 2.95 | 144 | 3.76 | 0.43 | 4.2% |
| bm_lewis | 3.27 | 91 | 4.3 | 1.4 | 4.3% |
| bm_fable | 2.77 | 120 | 4.77 | 1.31 | 4.3% |
| bm_daniel | 3.23 | 129 | 2.96 | 0.57 | 4.4% |
| af_heart | 3.55 | 196 | 3.32 | 0.94 | 4.3% |
| af_bella | 3.57 | 199 | 3.43 | 0.46 | 4.3% |

Pitch stability (frames with a jump of more than 2 semitones in 10 ms):
- bm_fable 0.2%, am_puck 0.2%, am_fenrir 0.6%;
- am_michael 2.8%, af_heart 2.1%, bm_lewis 4.8%.

**Chosen: bm_fable.** It has the most pitch movement, both within sentences and between them. It is the most stable, with no warble, and has the most natural pace.
- Its weakness is bright 's' sounds, handled by a stronger de-esser (0.45).
- Alternative: am_fenrir (American, the clearest diction).
- Rejected:
  - bm_lewis: unstable pitch;
  - am_onyx: monotone and dull;
  - am_eric, bm_george, bm_daniel: little melody, or nothing above 10 kHz.

## The opening (v2)

| Time | Line |
|---|---|
| 0:00.5 | In May 2008, a man in Las Vegas called 911. |
| 0:05.0 | His wife had been shot, he said, by a masked intruder. |
| 0:09.0 | And he said something else. He'd wrestled the gun away from the man, and shot him. |
| 0:15.7 | The man he shot wasn't a stranger. |
| 0:19.1 | He was Michael Miller, a thirty-eight-year-old handyman the caller knew. |
| 0:23.5 | The caller was Thomas Randolph. And Sharon, his sixth wife, was dead. |
| 0:29.3 | Prosecutors would later tell a jury a very different story. They alleged Randolph had hired Miller to kill Sharon, then shot Miller to silence a witness. |
| 0:39.6 | Randolph says he's innocent. |
| 0:42.2 | He has now stood trial for murder three times. |
| 0:45.7 | One jury acquitted him. Two juries convicted him. |
| 0:51.1 | And the first of those convictions, with its two death sentences, was thrown out, because the jury had heard about a death he'd already been acquitted of. |
| 1:00.0 | To understand how that happened, we have to go back to Utah, more than twenty years before that 911 call. |
| 1:07.0 | This is the true story behind Netflix's The Widower, and where Thomas Randolph is now. |
| 1:15.0 | Thomas Randolph has been married six times. |

Structure: the hook (0–10 s), the stakes (10–29 s), the escalation (29–51 s), and the reason to stay (51–72 s). The title card follows at about 1:12. Three concepts were considered; see `documentary/films/thomas-randolph/opening-concepts.md`. The hook rests only on CORROBORATED claims.

## Listening checklist (human)

- **0:00–1:16 the opening.** Is the first line gripping? Does the voice sound told, not read? Is the music clearly under the voice?
- **0:29.** 'hired Miller' (ASR heard 'Milo').
- **0:42.** 'He has now stood trial' (ASR heard 'He is now stood').
- **5:41.** 'He appealed.' (ASR heard 'Tia peeled'; a short sentence at the start of a line).
- **About 2:18–2:48, the Utah names.** Tarantino, Becky Gault (said 'Galt').
- **About 3:41–4:21, a tense section.** The ski mask, the 911 call.
- **About 6:52–7:12, a reflective section.** The sentencing and his quote.
- **The last 30 seconds.** Does the ending land, or does it just stop?
- **Overall.** Any odd emphasis, swallowed consonants or a sentence that changes level or tone at a join.

Short MP3s of these sections were sent to the owner in chat. A note on limits: Kokoro has no emotion or SSML controls. Delivery is shaped through wording, punctuation, sentence-by-sentence synthesis, per-tone speed and pauses. If the voice still sounds synthetic to the owner, the next step up is a paid voice service, or recording a human narrator. That needs the owner's approval (cost and credentials).
