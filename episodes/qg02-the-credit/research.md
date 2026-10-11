# Research and story notes: The Quiet Game, Episode 2, "The Credit"

**Format:** fictional long-form (about 8 minutes, 16:9) animated psychological drama. It is a sequel to "The Favour", set two weeks later. Characters, companies and events are invented. The psychology is real and cited below. The full reference list with verified summaries and caveats is in [`series/the-quiet-game/the-credit/references.md`](../../series/the-quiet-game/the-credit/references.md).

## Claims made on screen
| Claim (as narrated) | Source | Wording safeguards |
|---|---|---|
| Cryptomnesia: in a 1989 study, people taking turns naming ideas in groups later listed partners' ideas as their own | Brown & Murphy (1989) | "some of them": item rates were modest (about 10% in one experiment) |
| Improving someone else's idea makes you more likely to claim it | Stark, Perfect & Newstead (2005); Perfect & Stark (2012) | Described as "more likely", not certain |
| Memories don't carry a label for who said what; the source is rebuilt and can be wrong | Johnson, Hashtroudi & Lindsay (1993) | Plain-English summary of the source-monitoring framework |
| 1979: most married couples rated their own share above their partner's; together, more than the whole | Ross & Sicoly (1979): 27 of 37 couples | The study used a rating scale; the on-screen percentages are labelled "Illustration" |
| Men offering new ideas were seen as more leader-like; women offering the same kind of ideas were not | McClean et al. (2018) | "In one study" |
| "Amplification" among women on Obama's staff | J. Eilperin, Washington Post, 13 Sept 2016 (verified via republication) | Journalism based on staff accounts, not a controlled study |

## Story invariants (tested in tests/test_quiet_game.py)
- Leah's chat message is timestamped Monday 11:02 and Daniel's reply 11:19 ("seventeen minutes later"). The pitch is Wednesday 10:14. Daniel says "since Monday", which is the fair-play clue.
- The Northfield figures continue from Episode 1: about 250 deliveries a week at 81.1% on time (about 47 late). The Barrow re-route recovers about 40. Week one shows 31 fewer late deliveries (no more than 40).
- Daniel's lapse is a memory error, not a lie, and he corrects the record himself. Graham's intent is left ambiguous ("Maybe he hadn't heard. Maybe he had.").

## Agency check
Leah drives the resolution: she checks the record, raises it privately with curiosity, offers a shared path and later amplifies a colleague. Daniel's correction is his own choice, made against Graham's advice.
