# Narration QA: The Pet Cemetery Murders: The Real Case Behind HBO's Ghost Story (run1)

**I cannot hear audio.** Everything below is a measurement: pitch tracking, timing, spectra, levels and offline speech recognition. None of it is listening. The listening checks at the end are for a human; the owner has the final say on the voice.

## Set-up (the house standard from CLAUDE.md)

- Narrator: Kokoro v1.0 `bm_fable` (free, offline, Apache-2.0), the same voice as The Widower v2.
- Every narrated line has a tone (hook, curious, confident, tense, reveal, reflective, resolve), which sets its speed and pauses.
- Sentence-by-sentence synthesis; voice chain: high-pass, low-mid cut, presence lift, de-esser (0.45), 2.2:1 compression, sentence level matching.
- Music bed at -22 dB, ducked -12 dB under speech, and a further 3 dB lower for the first minute.
- Three opening concepts were written and one chosen: `documentary/films/pet-cemetery-murders/opening-concepts.md`. The hook rests only on CORROBORATED claims.

## Measurements

| Measure | Value | Aim / note |
|---|---|---|
| Pitch movement within a line (median SD) | 4.6 st | Widower v2: 4.47 st; v1 (Piper): 2.63 st |
| Pitch range within a line (median) | 14.8 st | |
| Speaking rate while talking (median) | 2.5 words/s | varies by tone (CV 0.173) |
| Pauses between sentences | SD 0.086 s | set by tone; never one fixed gap |
| Voice-to-music under speech, whole film | 19.4 dB | aim 20 dB or more |
| Voice-to-music under speech, opening minute | 21.7 dB | aim higher than the rest |
| Speech recognition on the final MP4 (corpus WER) | 7.7% | 8 lines over 20%; 2 of them only number formatting |

## The opening

| Time | Tone | Line |
|---|---|---|
| 0:00.5 | hook | In April 1985, the woman who ran a pet cemetery in south Louisiana disappeared. |
| 0:06.7 | hook | She was due in court within days, in a lawsuit over her land. |
| 0:11.3 | reveal | Less than a month later, fishermen found her in the Mississippi River, weighted down with steel chains. |
| 0:17.8 | tense | The sheriff said police had a prime suspect from the very start: her own groundskeeper. |
| 0:23.7 | reflective | But there was no physical evidence. No arrest. And the case went cold. |
| 0:31.4 | tense | In 2009, a man went to the police. He said the groundskeeper had confessed to him. |
| 0:39.2 | reveal | And he said something else. Her ghost was haunting his dreams. |
| 0:45.1 | tense | Three years later, a prison inmate came forward. He said he was there when she was killed. |
| 0:52.4 | reveal | The case rested almost entirely on that one witness. And in 2014, the groundskeeper pleaded guilty. Not to murder. To manslaughter. |
| 1:04.7 | curious | This is the real case behind HBO's The Pet Cemetery Murders. What the record shows, and what it doesn't. |
| 1:12.6 | confident | Dorothy Thompson was sixty-one. |

## Speech-recognition differences that are not number formatting

- **1:25.8** (line 13). Script: "And at the centre of this story is her land: fourteen acres in Toca." Heard: "And at the center of this story is her land, 14 acres in Toka."
- **1:30.6** (line 14). Script: "Brandon Nodier worked at the cemetery, as its groundskeeper and handyman." Heard: "Brandon NoDI worked at the cemetery as its ground skipper and handyman."
- **3:23.6** (line 34). Script: "He said he'd been Nodier's assistant groundskeeper. And he said he was there when Dorothy Thompson was killed." Heard: "He said he'd been no D.I.'s assistant groundskeeper. And he said he was there when Dorothy Thompson was killed."
- **4:05.9** (line 40). Script: "In April 2012, a St. Bernard Parish grand jury indicted Brandon Nodier, then fifty-eight, for second-degree murder." Heard: "In April 2012, a Saint Bernard Parish Grand jury indicted Brandon No D.I. then 58 for second-degree murder."
- **5:22.2** (line 51). Script: "It's a Lightbox production, written and directed by Philip Cairney. Parts two and three air on the eighteenth and twenty-fifth of October." Heard: "It's a light box production, written and directed by Philip Kairney. Parts 2 and 3 air on the 18th and 25th of October."
- **6:17.0** (line 58). Script: "Brandon Nodier, her groundskeeper, pleaded guilty to manslaughter in 2014, twenty-nine years after her death. He was sentenced to ten years." Heard: "Brandon No D.I. her groundskeeper pleaded guilty to manslaughter in 2014, 29 years after her death. He was sentenced to 10 years."

## Listening checklist (human)

- **0:00–1:13, the opening.** Does the first line stop the scroll? Does the voice sound told rather than read? Is the music clearly under the voice?
- **1:12–1:49, names.** 'Toca' (said Toe-ka), 'Azalea', 'Brandon Nodier' (said No-dee-ay; the local pronunciation is not verified), 'Chalmette' (Shal-met).
- **2:52–3:43, the witnesses (tense).** 'Doran', the ghost lines: do they sound like reported claims, not spooky narration?
- **4:37–5:14, the plea (reflective).** Judge Nicosia's 'truest sense of the word', the parole line, Sheriff Pohlmann, Doran's quote.
- **5:55–6:39, the ending.** Does the last line land?
- **Other names.** 'Plaquemines' (Plack-a-mins), 'Slidell' (Sly-dell), 'Pohlmann', 'Nicosia', 'Philip Cairney' (Kair-nee), 'Lightbox'.
- **Overall.** Odd emphasis, swallowed consonants, or a sentence that changes level at a join.

Short MP3s of the opening, a names section, a tense section, a reflective section and the ending were sent to the owner in chat. Kokoro has no emotion or SSML controls; delivery is shaped through wording, punctuation, sentence-by-sentence synthesis and per-tone speed and pauses. If the voice still sounds synthetic to the owner, the next step up is a paid voice service or a human narrator, which needs the owner's approval.
