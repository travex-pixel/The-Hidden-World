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
