# Research and story notes: The Quiet Game, Episode 3, "The Invite"

**Format:** fictional long-form animated psychological drama, about 8 minutes, 16:9. It follows "The Credit": Leah has been promoted. Characters, companies and events are invented. The psychology is real. Full references, caveats and narration wording: [`series/the-quiet-game/the-invite/references.md`](../../series/the-quiet-game/the-invite/references.md).

**Voice engine v2.** This is the first episode voiced with Kokoro-82M (Apache-2.0), using the voice casting in `characters/*.json → voice_kokoro`. Lines are whole sentences, captions page themselves, dialogue sits in a faint shared room, and a room-tone bed runs underneath. Whisper speech recognition checks every line of the final mix (`pipeline/asr_check.py`).

## Claims made on screen
| Claim (as narrated) | Source | Safeguards |
|---|---|---|
| In an online game of catch, people excluded by strangers felt worse and less like they belonged | Williams, Cheung & Choi (2000) | Self-esteem is not claimed for this paper |
| It still stung when people were told the other players were a computer | Zadro, Williams & Richardson (2004) | |
| Ostracism at work is seen as more acceptable than harassment, but is more strongly linked to low belonging and later leaving | O'Reilly et al. (2015) | "linked", correlational |
| Senders expected readers to catch tone about 78% of the time; readers managed about 56% | Kruger, Epley, Parker & Ng (2005), Study 2 | Figures confirmed via secondary sources; the paper calls the result indistinguishable from chance |
| T-shirt wearers guessed about half the room noticed; about a quarter did | Gilovich, Medvec & Savitsky (2000) | "about", since exact figures vary by source |
| People expected to need about twice as many asks as it took | Flynn & Lake (2008) | Requests to strangers |
| Left out deliberately: brain scans, "rejection hurts like pain" | Eisenberger et al. (2003) | Not claimed; later meta-analyses dispute it |

## Story invariants (tested)
- Leah is promoted a week earlier and leads Ostrel. Daniel is removed from the Ostrel weekly at 08:59 on Monday. Graham replies "Thanks." 18 minutes after Daniel's 11:02 message.
- Continuity from Episode 2: Leah spotted the after-six pattern, and Daniel suggested Carlton. The slide's "Late deliveries: down 38" by week 3 is no more than the roughly 40 a week the re-route can recover.
- Graham's intent stays ambiguous ("Graham's answer fitted both"; "Maybe Graham forgot Leah. Maybe he didn't.").
