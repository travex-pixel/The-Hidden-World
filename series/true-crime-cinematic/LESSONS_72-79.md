# Lessons from Case Files 72–79 (Insights read 20 Oct 2026, 00:40 local)

Seven engine-v5 reels, 2.5 h to 2 days old. Retention points are saved in `retention/<id>.json`
(`tools/retention.py --compare`).

| # | Reel | Age | Views | Skip | Like | Shares | Saves | Len | 4 s | 10 s | end |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 73 | Fake Border Patrol truck | 2 d | **4,054** | **22.6%** ↓ | 1.2% ↑ | 0 | 4 | 33 s | 80% | 50% | 35% |
| 72 | Drug tunnel under a KFC | 2 d | 2,823 | 27.9% ↓ | **1.6%** ↑ | 0 | 3 | 34 s | 68% | 52% | 40% |
| 75 | Cocaine bunkers under containers | 1 d | 2,607 | 27.7% ↓ | 0.4% ↓ | 0 | 0 | 37 s | 65% | 43% | 28% |
| 74 | 30,000-bottle wine heist | 2 d | 2,386 | **33.9%** ↑ | 0.8% ↓ | 1 | 0 | 37 s | 65% | 45% | **5%** |
| 76 | Border tunnel with an elevator | 9 h | 1,859 | 26.7% ↓ | 0.7% ↓ | 0 | 1 | 38 s | 75% | 42% | 25% |
| 77 | Tunnel into a Paris wine cellar | 9 h | 1,830 | 31.7% ↑ | 0.5% ↓ | 0 | 1 | 34 s | 72% | 46% | 35% |
| 79 | 200 lizards in socks | 2.5 h | 1,074 | **20.5%** ↓ | 0.4% ↓ | 0 | – | 34 s | 78% | 44% | 25% |

92–93 % of views come from the Reels tab on every reel; profile and followers contribute under 1 %. Every reel is a
cold start, and distribution stops at 6–9 h. Comments are 2–3 per reel (the seed plus one). Shares are 0.

## What the curves say

1. **The leak is seconds 4–10, on every reel, and it is the same line every time.** Loss per second in that window:
   76 7.5 %/s, 73 6.7, 79 6.6, 77 5.8, 72 5.0, 75 3.4, 74 3.3. The line playing there is always the pivot away from
   the headline case: "But first, a truck full of carrots", "First: two vans dressed as FedEx", "But first,
   Copenhagen", "In Delhi, gold chains". The frame-1 picture promises the KFC tunnel / fake truck / lizards; at 4.5 s
   the reel cuts to a different, smaller case, and a third of the people who stopped for the promise leave. The
   payoff of the headline case lands at 22–29 s (72: 22.6 s, 73: 26.5 s, 75: 24.8 s, 76: 29.0 s, 79: 23.0 s).
   After 10 s the middles are flat (0.5–0.9 %/s): the escalating list holds whoever survives the pivot.
2. **Skip rate (Instagram's #1 lever) tracks how readable the absurd object is at frame 0.** The two lowest skips are
   a lizard in an open suitcase (79) and a Border Patrol truck behind bars (73). The two highest are the wine reels:
   a dark rack with a glowing bottle (74) and a small dark hole in a cellar wall (77). "Wine Heists" has now
   under-indexed twice (33.9 %, 31.7 %); the picture is a number, not a thing.
3. **Length: 33–34 s reels end at 35–40 %; 37–38 s reels end at 25–28 %.** Three against three, no overlap.
4. **74's cliff:** 30 % → 5 % in the last 2 s. The last line ("Antinori's bottles? Still missing.") starts at 33.8 s
   and the picture holds to 36.95 s: 1.4 s of tail after the last word plus a soft, inconclusive last line.
5. **Likes happen at the hook (20–33 % of all likes in the first 2 s) and at the end card; almost none mid-video.**
   The one mid-video like spike is 73 at ~12 s: "A cloned Border Patrol K-9 truck" — the gotcha, not the haul size.
   The 25 s "biggest reveal" with the music drop produces no like spike on any reel: numbers (2.7 tonnes, 4,309 ft)
   are not reaction moments; a human being caught is.
6. **Like rate splits by subject, not by craft.** Dumb-criminal absurdity (KFC 1.6 %, fake truck 1.2 %) is "Higher";
   big-number busts (75 0.4 %), wine (0.8, 0.5) and animal suffering (79 0.4 %) are "Lower". Lizards stop the scroll
   but people do not want to like an animal being hurt.
7. **Sequels score below their originals** (76 < 73, 77 < 74) and no view comes from the profile, so "PART 5" at the
   top of frame 1 can only cost a scroll ("I missed four parts"); it earns nothing.
8. **Shares are 0 on 7 reels** with a "tag the mate" line on every end card. The end card asks for a share after the
   viewer has already got the whole story; there is nothing left to send.

## Engine v6 (proposed)

- **Promise → proof → escalate → callback.** The headline case is paid off inside the first 9 s (two lines: the
  absurd thing, then how it was caught), then "and that was not even the strangest" escalates through two more, and
  the last line is a callback twist on the headline case (the detail held back: the other end under a bed, the
  bananas' cardboard flaps). QA: no scene change to a different case before 9 s; the headline case's reveal-tone line
  starts before 9 s; the last line's scene carries the headline case tag.
- **Gotcha beat per case:** each case gets one "how they got caught" line (tone reveal, impact SFX, 0.3 s pause
  before it). QA: ≥ 1 reveal line per case tag.
- **32 s cap, end scene ≤ 3 s, tail after the last word ≤ 0.8 s, and the closing line is a hard fact, not a
  "still missing?" shrug.**
- **Frame-0 object rule:** one absurd object ≥ 25 % of frame width in the upper-middle, already moving at t = 0
  (push-in or a drop), tested at 108 × 192 px. QA: motion between frames 0.0 and 0.5 s above the beat threshold,
  and a cover squint check (largest saturated blob area ≥ 6 % of the frame).
- **No "PART N" in the frame-1 header;** series tag only on the end card.
- **Subject rules:** headline with a human dumb act, not a tonnage. No animal-suffering headliners. Retire Wine
  Heists unless a case has an absurd object (the rod through the wall was it, and it was buried at 18 s).
- **Share mechanic:** move the fun fact to the last 2.5 s as the final card ("the thing you send"), and make the
  end line a "which mate would try this" persona rather than "tag your mate".
