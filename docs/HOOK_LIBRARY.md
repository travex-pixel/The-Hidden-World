# Hook library (from analytics/reels_summary.csv; regenerate with `python3 series/true-crime/tools/openings.py --library`)

The structure of our own best-watched openings, ranked by skip rate (lower is better). Patterns, not words to reuse.

| skip % | views | shape | first spoken words | # |
|---|---|---|---|---|
| 16 | 2920 | agent + making verb + object | Smugglers drove their Jeep up the border fence. | 63 |
| 17 | 2630 | agent + making verb + object | Drug smugglers turned cocaine into a jacket. | 97 |
| 20.4 | 1716 | agent + making verb + object | Smugglers catapulted weed into America. | 59 |
| 20.5 | 1074 | agent + verb | Customs checked his socks. 200 lizards. | 79 |
| 21.3 | 1950 | attribution-first | Police say two men wore watermelon heads. | 86 |
| 22.6 | 4054 | agent + making verb + object | Smugglers made a fake Border Patrol truck. | 73 |
| 23.1 | 2980 | agent + making verb + object | Smugglers built a drug cannon into a van. | 92 |
| 23.1 | 2462 | agent + making verb + object | Smugglers dressed meth up as watermelons. | 94 |
| 24.3 | 2214 | attribution-first | Police say burglars butt-dialed 911. | 88 |
| 24.9 | 2154 | attribution-first | Police say this crashed plane held over 600 kilos of cocaine. | 37 |
| 26.7 | 1859 | agent + making verb + object | Smugglers built a border tunnel with an elevator. | 76 |
| 27.7 | 2607 | question | Australia's record cocaine bust? Buried. | 75 |
| 27.9 | 2823 | agent + making verb + object | Smugglers hid a drug tunnel in a KFC. | 72 |
| 28.6 | 1220 | agent + verb | A fake ambulance. Full of cocaine. | 83 |
| 28.6 | 1103 | agent + making verb + object | Smugglers branded their cocaine with Haaland. | 95 |
| 28.9 | 1445 | quantity-first | At 17, he started stealing planes. | 47 |
| 29.8 | 640 | quantity-first | At 91, he robbed a bank. | 44 |
| 30.4 | 2777 | agent + making verb + object | Smugglers built a drone sub run by Starlink. | 96 |
| 31.5 | 1651 | quantity-first | On the island of Bali, in 2002, bombs took 202 lives. | 42 |
| 31.5 | 1558 | agent + verb | A man confessed to being the Boston Strangler. | 16 |
| 31.7 | 1830 | agent + making verb + object | Thieves tunnelled into a Paris wine cellar. | 77 |
| 32.7 | 1534 | quantity-first | Smugglers loaded a ship with a billion in cocaine. | 93 |
| 33.9 | 2386 | attribution-first | This wine heist took 30,000 bottles. | 74 |
| 35.9 | 1939 | agent + making verb + object | The lottery's own security boss rigged it. | 50 |
| 36.1 | 1463 | quantity-first | Pablo Escobar escaped prison and hid for 16 months. | 35 |
| 36.6 | 195 | attribution-first | Police say a burglar fell asleep in bed. | 85 |
| 39.5 | 157 | attribution-first | Police say he robbed a bank. By Uber. | 87 |
| 48.6 | 184 | attribution-first | Police say he robbed his Instagram friends. | 84 |

## Skip rate by shape

| shape | reels | median skip % | best |
|---|---|---|---|
| agent + making verb + object | 12 | 24.9 | 16 |
| question | 1 | 27.7 | 27.7 |
| agent + verb | 3 | 28.6 | 20.5 |
| quantity-first | 5 | 31.5 | 28.9 |
| attribution-first | 7 | 33.9 | 21.3 |

## The patterns that win (structure only)

1. **Doer + making verb + absurd object**, ≤ 8 words, no number: 'Smugglers turned cocaine into a jacket.' (17.0 %), 'Smugglers drove their Jeep up the border fence.' (16.0 %).
2. **Unlikely person + the deed**: 'At 87, he ran cartel cocaine.' (the most-shared reel), 'At 17, he started stealing planes.'
3. **The catcher's action on the object**: 'Customs checked his socks. 200 lizards.' (20.5 %).
4. **Never**: 'Police say…' first (2 of 8 pushed), a question, a year, or the tonnage before the thing (28–34 %).

Top performers in the niche share the same bones (structure observed, never their words): the object or the person in the first second, the verb before the noun, the number after the picture, the catch inside ten seconds.
