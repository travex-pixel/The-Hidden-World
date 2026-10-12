# Narration QA: Tupac Murder Trial: Why Keffe D Was Convicted in Under 3 Hours (run1)

**I cannot hear audio.** Everything below is a measurement: pitch tracking, timing, spectra, levels and offline speech recognition. None of it is listening. The listening checks at the end are for a human; the owner has the final say on the voice.

## Set-up (the house standard from CLAUDE.md)

- Narrator: Kokoro v1.0 `bm_fable` (free, offline, Apache-2.0), the same voice as The Widower v2.
- Every narrated line has a tone (hook, curious, confident, tense, reveal, reflective, resolve), which sets its speed and pauses.
- Sentence-by-sentence synthesis; voice chain: high-pass, low-mid cut, presence lift, de-esser (0.45), 2.2:1 compression, sentence level matching.
- Music bed at -22 dB, ducked -12 dB under speech, and a further 3 dB lower for the first minute.
- Three opening concepts were written and one chosen: `documentary/films/tupac-keffe-d/opening-concepts.md`. The hook rests only on CORROBORATED claims.

## Measurements

| Measure | Value | Aim / note |
|---|---|---|
| Pitch movement within a line (median SD) | 4.5 st | Widower v2: 4.47 st; v1 (Piper): 2.63 st |
| Pitch range within a line (median) | 14.9 st | |
| Speaking rate while talking (median) | 2.62 words/s | varies by tone (CV 0.2) |
| Pauses between sentences | SD 0.08 s | set by tone; never one fixed gap |
| Voice-to-music under speech, whole film | 19.5 dB | aim 20 dB or more |
| Voice-to-music under speech, opening minute | 21.4 dB | aim higher than the rest |
| Speech recognition on the final MP4 (corpus WER) | 3.8% | 0 lines over 20%; 0 of them only number formatting |

## The opening

| Time | Tone | Line |
|---|---|---|
| 0:00.5 | hook | For twenty-seven years, nobody was charged with killing Tupac Shakur. |
| 0:05.2 | hook | This summer, it took a jury less than three hours to convict. |
| 0:09.2 | confident | The man they convicted is Duane Davis, known as Keffe D. |
| 0:13.8 | reveal | Prosecutors never said he pulled the trigger. They said he planned the shooting, and supplied the gun. |
| 0:21.2 | tense | And the heart of the case, prosecutors said, was his own words. |
| 0:25.7 | tense | A police interview in 2008. Television. Even a memoir, in which he told the story himself. |
| 0:34.6 | reveal | Now he says he only told those stories because he was paid. |
| 0:39.1 | tense | On the thirteenth of October, he's due to be sentenced. He faces up to life in prison, without parole. |
| 0:46.8 | curious | This is how a thirty-year-old case finally reached a verdict, and what the record still can't tell us. |
| 0:53.2 | confident | Las Vegas. The seventh of September, 1996. |
| 0:58.3 | confident | Tupac Shakur had been at a boxing match at the MGM Grand. |
| 1:03.0 | tense | Prosecutors later told the jury that earlier that night, Tupac, Suge Knight and their group had beaten up Davis's nephew in the hotel. |
| 1:11.7 | reveal | His name was Orlando Anderson. |

## Speech-recognition differences that are not number formatting

- None.

## Listening checklist (human)

- **0:00–1:10, the opening.** Does '27 years ... less than three hours' stop the scroll? Does the voice sound told rather than read? Is the music under the voice?
- **Names.** 'Keffe D' (said Keefy D), 'Tupac Shakur' (Too-pock Sha-koor), 'Greg Kading', 'Carli Kierny', 'Binu Palal', 'Sekyiwa Shakur', 'Koval Lane'.
- **The night (tense).** The intersection and the black screen at 'Someone inside it opened fire': is the pause long enough without feeling like a glitch?
- **His own words.** Do Davis's accounts sound clearly like his claims, not narration of fact?
- **The verdict and his denial (reflective).**
- **The ending.** Does the last line land, and is the legal record clear?
- **Overall.** Odd emphasis, swallowed consonants, or a sentence that changes level at a join.

Short MP3s of the opening, a names section, a tense section, a reflective section and the ending were sent to the owner in chat. Kokoro has no emotion or SSML controls; delivery is shaped through wording, punctuation, sentence-by-sentence synthesis and per-tone speed and pauses. If the voice still sounds synthetic to the owner, the next step up is a paid voice service or a human narrator, which needs the owner's approval.
