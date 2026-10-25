# Tracking the engine-v6 reels (83, 84, 85) against the v5 baseline

Read Insights at the same ages for every reel: **1 h, 6 h, 24 h, 72 h** (set phone reminders when you post). Log each
reading with the retention tool so the curve is pinned to the lines playing at each second:

    python series/true-crime/tools/retention.py <episode-id> 0:100 4:<pct> 10:<pct> 20:<pct> 30:<pct> --views <n> --save

Record in the table below (per 1,000 views = count ÷ views × 1000). Judge nothing before 6 h; compare only readings
of the same age. Instagram distribution is noisy: one reel proves nothing, three in the same direction is a signal.

| # | age | views | skip % | kept @4 s | kept @10 s | end % | avg watch s | shares/1k | saves/1k | follows/1k | likes/1k | comments |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 83 | 1 h | | | | | | | | | | | |
| 83 | 6 h | | | | | | | | | | | |
| 83 | 24 h | | | | | | | | | | | |
| 83 | 72 h | | | | | | | | | | | |
| 84 | 1 h | | | | | | | | | | | |
| 84 | 6 h | | | | | | | | | | | |
| 84 | 24 h | | | | | | | | | | | |
| 84 | 72 h | | | | | | | | | | | |
| 85 | 1 h | | | | | | | | | | | |
| 85 | 6 h | | | | | | | | | | | |
| 85 | 24 h | | | | | | | | | | | |
| 85 | 72 h | | | | | | | | | | | |

**v5 baseline (72–79, mixed ages 2.5 h–2 d):** skip 20.5–33.9 % (median 27.7), kept @4 s 65–80 %, kept @10 s 42–52 %,
end 5–40 %, shares 0 on all seven, saves 0–4, likes 0.4–1.6 %.

**What v6 is supposed to move:** kept @10 s (the "but first" leak is gone, so ≥ 60 % would confirm it), end % (31 s
cuts: ≥ 40 %), and shares (the explainable revelation + the persona send line: anything above 0 is new). Skip rate is
the frame-0 test: 85 (bed + torch) should skip lowest, 84 (phone on a sofa) highest, if the frame-0 hypothesis holds.

**Replays and the loop:** Instagram does not show replays directly. If average watch time ÷ reel length is above 1.0,
people are watching past the end into the loop; log it as the loop's only real measure.

**Batch 2 (posted together ~15:45 local on 20 Oct, read at 7 h):**

| # | age | views | skip % | kept @4 s | kept @10 s | end % | avg watch s | shares/1k | saves/1k | follows/1k | likes/1k | comments |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 86 (frame-0 A) | 7 h | 1,950 | 21.3 | 65 | 48 | 30 | – | 0 | 0 | – | 8.0 | 2 |
| 87 (frame-0 B) | 7 h | 157 | 39.5 | 55 | 35 | 15 | – | 0 | 0 | 0 | 0 | 3 |
| 88 (28 s) | 7 h | 2,214 | 24.3 | 70 | 55 | 38 | 16 (57 % of length) | 0 | 0 | 0 | 10.0 | 3 |

Reading (20 Oct, 22:48): every reel seeds to 150–250 viewers in hour 1; the ones under ~30 % skip were pushed on
(86 continuously, 88 at 4 h, 83 at 12 h), the ones above ~35 % never left the seed (84, 85, 87 flat from hour 1).
The three that passed all have something visibly wrong in frame 0 without reading (watermelon on a head, cocaine in an
ambulance, 911 calling from a pocket); the three that failed show an ordinary picture whose wrongness is only in the
text (man on a phone, sleeper in a bed, taxi outside a bank). The 86/87 frame-0 pair is confounded by this.
v6 did lift the middle: kept @10 s 45–55 % on the pushed reels (v5: 42–52 %), with like spikes on the gotchas.
Shares 0 on all six, follows 0.

**Batch 4: engine v8 (lane-locked, agent-first spoken hook), posted 22 Oct, read 23 Oct 00:07:**

| # | views | skip % | kept @4 s | kept @10 s | end % | shares | reposts | likes % | comments | hook |
|---|---|---|---|---|---|---|---|---|---|---|
| 92 drug cannon | 2,980 | 23.1 | ~80 | ~55 | ~40 | **1** | 1 | 0.9 | 4 | Smugglers built a drug cannon into a van. |
| 93 cocaine ship | 1,534 (still climbing) | 32.7 | ~85 | ~55 | ~35 | 0 | 1 | 1.0 | 2 | Smugglers loaded a ship with a billion in cocaine. |
| 94 meth watermelons | 2,462 | 23.1 | ~80 | ~55 | ~35 | 0 | 0 | 0.7 | 2 | Smugglers dressed meth up as watermelons. |

v8 confirmed 3 of 3 pushed (after 2 of 12 in the previous three batches); 92 is the first reel with a share. The weakest
of the three (93, 32.7 %) is the only quantity hook ("a billion in cocaine", a pile of bricks); the two at 23 % are a
DEVICE (a cannon built into a van) and a DISGUISE (meth dressed as watermelons). Same split as before: 75 bunkers 27.7,
74 30,000 bottles 33.9 vs 63 Jeep on the fence 16.0, 59 catapult 20.4, 73 fake Border Patrol truck 22.6.


**Batch 5: engine v8 + the making-verb hook, posted together 23 Oct, read 24 Oct 10:44 (~18 h):**

| # | views | skip % | kept @10 s | end % | shares | saves | likes % | comments | curve | hook |
|---|---|---|---|---|---|---|---|---|---|---|
| 95 Haaland bricks | 1,103 (climbing) | 28.6 | ~50 | ~45 | 0 | 0 | 1.2 (higher) | 4 | steady, above typical from 4 h | Smugglers branded their cocaine with Haaland. |
| 96 Starlink sub | 2,777 (climbing) | 30.4 | ~50 | ~45 | 0 | 0 | 1.2 (higher) | 2 | steady push all day | Smugglers built a drone sub run by Starlink. |
| 97 cocaine jacket | 2,630 (flat since 4 h) | **17.0** | **~75** | ~45 | 0 | 0 | 0.9 (lower) | 2 | burst to 2.3k by 4 h, then flat | Drug smugglers turned cocaine into a jacket. |

Pushed 3 of 3 (6 of 6 on v8). 97 is the second-lowest skip the account has had (63 Jeep: 16.0) and the only reel ever to
hold 75 % at 10 s (everything else 42–55 %). What 97 did that 95 and 96 did not: frame 0 is a CLOSE shot of hands cutting the
object open with the inside still hidden, and the cut finishes on the gotcha line. 95 opened on bricks already spilling
(nothing left to reveal: 50 % by 8 s), 96 on a sub sitting in the water, wide (50 % by 7 s). Same split as batch 4
(94 melon being peeled 23.1 vs 93 pile of bricks 32.7). The famous name (95) was not a shortcut: slowest ramp, most comments.

The ceiling is not skip: 97 (17 %) went flat at 2.3k while 96 (30 %) kept climbing; 97 had the lowest like rate and
shares/saves are 0 on all three (1 share in the last 9 reels). Likes land at the hook, the first gotcha, and the END CARD
(25 % of 97's likes in its last second): the vote line earns likes, the "send to the mate" line earns no sends.

**Batch 6: engine v9 (half-reveal opening), 98 posted 25 Oct ~16:00 AEDT, read at 1 h (17:06):**

| # | age | views | viewers | avg watch | kept @10 s | end % | shares | saves | follows | comments | curve |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 98 cocaine wig | 1 h | 1,723 | 1,091 | 16 s (57 % of 28.4 s) | ~62 | ~45 | 0 | 0 | 0 | 2 (0.2 %, "higher") | near-vertical from 40 min: 1,723 at 1 h vs ~300 typical |

The fastest hour 1 on the account (97 took 4 h to reach 2.3k). 1.58 views per viewer: the first clear replay signal (the loop).
Skip rate not captured in this reading. Shares, saves and follows still 0 at 1 h.

**Batch 7: engine v10 "ONE SMUGGLER" (101 scooter pensioner, 102 missing teenager's suitcase, 103 the captain who left), to post one a day at 4 pm AEDT from Mon 26 Oct. Read at 48 h and 7 d with the five-screenshot recipe (analytics/README.md), then `python3 analytics/compile_reels.py` and `python3 analytics/postmortem.py <n>`.**

| # | age | views | viewers | avg watch | skip % | kept @10 s | end % | shares | saves | follows | comments | like % |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 101 | 48 h | | | | | | | | | | | |
| 102 | 48 h | | | | | | | | | | | |
| 103 | 48 h | | | | | | | | | | | |

Targets (docs/CHANNEL_BRIEF_2026-10-26.md): skip ≤ 23 %, ≥ 65 % at 10 s, average watch > 50 % of length, and the first non-zero shares since 92.
