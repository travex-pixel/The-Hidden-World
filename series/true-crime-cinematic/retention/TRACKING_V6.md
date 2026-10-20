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
