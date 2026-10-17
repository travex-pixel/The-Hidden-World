# War room — Episode 005: *The Speed Camera That Never Measures Your Speed*

Topic picked from "Google Maps **or** speed cameras": **average speed cameras**. The reference video already covers Google Maps, the Sceptic's line ("I'd just brake") is built for this topic, and the mechanism fits in one sentence.

## 1. CTO — the one true mechanism
1. Two cameras sit a measured distance apart. Each one reads your number plate (ANPR, using infrared it lights the plate with) and stamps the exact time.
2. The system matches the two reads of the same plate and does one division: distance ÷ time = your average speed.
3. Your speed at either camera is never used. Only the two timestamps matter, so slowing down at the end can't remove time you already saved.

Rejected second mechanism: lane-changing (cameras cover every lane). True, but it's a second idea, so it's cut.

## 2. CEO — five hooks that open on a false belief
1. **"Everyone brakes for the speed camera. But this one never measures your speed."** ← picked
2. "You slowed down for the camera. It didn't care."
3. "That yellow camera doesn't know how fast you're going."
4. "Braking at the speed camera is a waste of your brake pads."
5. "There's a speed camera that only owns a stopwatch."

**Why #1:** it describes something almost every driver has done (the viewer's own life in the first second). It breaks the belief in the next line ("never measures your speed") and promises the mechanism in line 3 ("It checks a clock. Twice."). That gives three lines in the order belief, break, promise, every sentence is under 12 words, and the first words land at 0.25 s.

## 3. Sceptic — the objection
> "So I'll just brake at the camera."

It is spoken by the narrator at 26.8 s (the middle third of a 51.6 s video), then destroyed **visually**. A live speed trace draws 70 mph most of the way, then the drop to 40. The speedo turns green at 40. The stopwatch still reads 2:00, the dotted average line lands at 60, and an "AVERAGE: STILL 60" stamp hits. A red ring circles the brake lights with "brakes: never recorded".

Worked maths (also checked in `tests/test_episode.py`): 70 mph for 14/9 mi (80 s) + 40 mph for 4/9 mi (40 s) = 2.0 mi in 120 s = 60 mph.

## 4. Retention specialist — beat timeline (final render, seed 1)
| Time | Beat | Payoff / open loop | Re-hook |
|------|------|--------------------|---------|
| 0.00–6.46 | **Hook.** Your red car brakes from 70 to 48 under a gantry. | Speedo reads 48 then gets struck through: **NOT MEASURED** (3.1 s). | **3 s:** "But this one never measures your speed." Open loop: *then what does it measure?* "It checks a clock. Twice." (clock + ×2 badges) |
| 6.46–14.57 | **Camera 1**, two miles back, slowed down. | Infrared beam shown in colour; the plate glows and bounces it back; plate card + **08:14:03**. | **8 s:** "It fires an infrared flash you can't see." |
| 14.57–21.28 | **The gap.** Aerial: the 2-mile zone fills blue, stopwatch running. | **At 50 mph: at least 2:24**; red/green zones on the stopwatch. | **15 s:** "Now the clock runs." Open loop: *when will you arrive?* |
| 21.28–26.78 | **Camera 2.** Second read, **08:16:03**. Cards merge into an equation. | **2.0 miles ÷ 2:00 = 60 mph average.** | — |
| 26.78–35.81 | **Sceptic.** "So I'll just brake at the camera." Watch. | Speed graph + stopwatch + **AVERAGE: STILL 60** + brakes "never recorded". | **25–28 s:** the objection itself is the re-hook. |
| 35.81–42.90 | **Escalate to everyone.** Pins over every car. | Legal cars: green tick, **deleted**. You: two photos, **EVIDENCE**. | — |
| 42.90–48.90 | **Escalate to the country.** Crane up into a glowing network. | **25,000,000 plate reads a day**, **kept for up to 12 months**. | Different network: the door opens. |
| 48.90–51.64 | **Threshold.** Frozen glowing map, one amber dot with a "?". | "So where was your car last Tuesday?" (last 2 s) | Next episode: national ANPR. |

Payoff moments (from the estimated word timings): 3.1 NOT MEASURED → 5.3 clock ×2 → 8.7 infrared beam → 12.9 plate + time → 16.0 2.0-mile zone → 18.6 2:24 minimum → 22.0 second read → 23.3 equation → 25.9 = 60 → 30.8 the 40 mph drop → 33.1 STILL 60 → 34.4 brakes never recorded → 39.6 deleted → 42.1 EVIDENCE → 46.0 25 million → 48.2 12 months → 50.4 question. The longest gap is 4.6 s.

## 5. Visual director — shots (Hidden Worlds language)
- **World:** low-poly 3D motorway in hazy daylight (UK, left-hand traffic). Boxy white/grey/black traffic, **your car is the only red one**, beige ground, flat-shaded trees, a city of boxes in fog, lamp posts, an overpass, yellow ANPR cameras on gantries, and an "Average speed" sign.
- **Invisible things get bodies.** Infrared is a pink-magenta beam labelled "INFRARED · shown in colour". A timestamp is a clock badge and a record card. The zone is a glowing blue ribbon on the tarmac. Time is a physical stopwatch with a red "too fast" arc. Deleted data shows as green ticks that fade. The national database is a glowing network of points.
- **Shot list:**
  - S1: low chase cranes up to a high follow, gantry ahead.
  - S2: slow-motion three-quarter view down onto the gantry as the car approaches.
  - S3: high aerial along the zone.
  - S4: the same angle at gantry 2, then a dark scrim and data cards.
  - S5: chase rig again, with a speed graph over it.
  - S6: tracking aerial over traffic with pins.
  - S7: crane up into the night network.
  - S8: frozen glowing frame.
- **Captions:** karaoke pill as in the reference: spoken words white, upcoming words grey, up to 4 words per chunk. The HUD speed pill sits bottom-left. Everything stays clear of the right-hand action column and the bottom username/caption band.

## 6. Retention audit (score 1–5, rewrite anything under 4)
| Check | Score | Notes / fixes made |
|-------|-------|--------------------|
| First 0.8 s is a swipe-stopper | 4 | Motion from frame 1 (a car at 70 in traffic, "YOU" pin, whoosh), words on screen at 0.25 s, and a brake sound at 0.9 s. Not a 5, because the most surprising image (the struck-out speedo) lands at 3 s. |
| Viewer's own life in first 5 s | 5 | "Everyone brakes for the speed camera" over *your* car, with a "YOU" pin and your speedo. |
| Reveal / confirm / reversal every 6–8 s | 5 | Longest gap between payoffs is 4.6 s (see timeline). |
| Mechanism concrete enough to explain to a friend | 5 | "Two cameras, two timestamps, distance ÷ time." Shown as an actual division with real-looking numbers. |
| Sceptic beaten on screen | 5 | Graph, stopwatch, stamp and brake-light ring, not just a spoken rebuttal. |
| Ending opens a door | 5 | It moves from your car to the whole country and closes on a question it does not answer, over a frozen frame. |

**Fixes made during the audit:** moved the sceptic label and stamp so they never cover the HUD or the graph. Kept the car mid-frame so captions never cover it. Changed the closing line from a karaoke pill to a two-line glowing title so the full question stays on the frozen frame. Raised narration pace from ×1.22 to ×1.32, which cut the runtime from 55.3 s to 51.6 s.
