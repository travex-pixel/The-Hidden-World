# Research and story notes: The Quiet Game, Episode 1, "The Favour"

**Format:** fictional long-form (about 8 minutes, 16:9) animated psychological drama. Characters, companies (Halvern Logistics, Ostrel Foods) and events are invented. The behavioural science is real and cited below.

The full reference list with verified summaries, caveats and narration wording is in [`series/the-quiet-game/the-favour/references.md`](../../series/the-quiet-game/the-favour/references.md).

## Claims made on screen and how they are supported
| Claim (as narrated) | Source | Wording safeguards |
|---|---|---|
| Reciprocity is a near-universal norm: when someone helps us, we feel we owe them | Gouldner (1960) | Described as a norm and a tendency |
| In a 1971 study, people given a free soft drink later bought about twice as many raffle tickets | Regan (1971) | "One classic study"; mechanism (obligation vs liking) not over-claimed |
| Cognitive dissonance: discomfort of acting against your values, often eased by changing the story | Festinger (1957); Festinger & Carlsmith (1959) | Followed immediately by the replication caveat (Vaidis et al., 2024): "a tendency, not a law" |
| Pluralistic ignorance; Princeton students thought they were more uneasy about campus drinking than peers | Prentice & Miller (1993); Morrison & Milliken (2000) | "Most people... each assumes" (tendency) |
| Foot in the door: after agreeing to something small, the next request feels smaller | Freedman & Fraser (1966); Welsh et al. (2015) | Named as a pattern, not a guarantee |

## Story invariants (tested in tests/test_quiet_game.py)
- Dashboard figures: 93.4% with Northfield excluded, 92.6% included, contract target 93.0%. Northfield 81.1% on 6.5% of volume; the other depots (Ashby 95.0%/30%, Barrow 93.0%/30%, Carlton 92.5%/40%) average 93.4%.
- 09:03 Daniel finds the filter. 09:07 the favour. 09:58 the report goes out. Tuesday 14:20 the client query. Thursday 21:14 the bigger ask. Friday 10:00 the correction.
- Graham's intent stays ambiguous: nothing he says is provably false, and the narrator says Daniel never found out for certain.
- Not every favour is manipulation: the closing advice says so explicitly.

## Agency check
Daniel makes the decisive choice himself, and he admits his own part ("We agreed not to flag it"). The fix is ordinary and ethical: notes, a written confirmation, a neutral question, a correction to the record. Nobody rescues him.

## Licences
Original characters and art drawn by code. Voices: Piper TTS. Narrator: Alba (CC BY 4.0). Cast: the ARU speakers 1, 6, 7 and 11 (CC BY 4.0). Music and effects are synthesised by pipeline/audio.py.
