# Research record — Episode 002

**Episode:** ep002-mars-units — *The Homework Mistake That Lost a Mars Spacecraft*
**Central question:** How did NASA lose a working spacecraft at Mars without anything on board breaking?
**Why it matters:** It is the most famous units error in history, and the real lesson is subtler than "use metric": the error was ordinary, the failure was that the checks around it did not catch it. That applies to every spreadsheet, recipe and invoice.
**Proposed answer:** Ground software supplied thruster-impulse data in pound-force seconds; navigation software treated it as newton-seconds. Each small push was undercounted by a factor of about 4.45. Over a nine-month cruise with far more thruster firings than planned, the trajectory estimate drifted until the orbiter arrived about 57 km above Mars instead of about 140–150 km.

## Research-access note (honest)
Direct downloads of the NASA report PDFs and fetches of nasa.gov pages were blocked by this environment's network policy. Research used the web-search tool, which returns indexed excerpts and real URLs. Every source below is a URL returned by those searches; claims cite the excerpts returned. Open the Phase I report (S4) and the NASA safety case study (S5) on your phone before publishing to confirm the altitude figures.

## Sources actually consulted
| ID | Source | Publisher / date | Supports |
|----|--------|------------------|----------|
| S1 | [Mars Climate Orbiter mission page](https://www.jpl.nasa.gov/missions/mars-climate-orbiter/) | NASA JPL | Last contact 23 Sep 1999, about 9 months after launch; navigation error from failure to translate English units to metric; spacecraft too close to Mars. |
| S2 | [Mars Climate Orbiter Team Finds Likely Cause of Loss](https://www.jpl.nasa.gov/news/mars-climate-orbiter-team-finds-likely-cause-of-loss/) | NASA JPL, 30 Sep 1999 | Spacecraft team in Colorado and navigation team in California; one used English units, the other metric. Weiler quote verbatim: "The problem here was not the error, it was the failure of NASA's systems engineering, and the checks and balances in our processes to detect the error." |
| S3 | [1998 Mars Missions Press Kit](https://mars.nasa.gov/internal_resources/818/) | NASA, Dec 1998 | Launch on Delta II from Cape Canaveral; 286-day cruise; arrival 23 Sep 1999. Launch date 11 Dec 1998 confirmed by NASA/KSC sources (press kit originally listed 10 Dec; launch slipped a day). |
| S4 | [MCO Mishap Investigation Board Phase I Report](https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf) | NASA, 10 Nov 1999 | Root cause: failure to use metric units in the coding of a ground software file, "Small Forces", used in trajectory models. Contributing causes include incomplete end-to-end verification of navigation software. |
| S5 | [System Failure Case Study: The Mars Climate Orbiter Mishap](https://sma.nasa.gov/docs/default-source/safety-messages/safetymessage-2009-08-01-themarsclimateorbitermishap.pdf) | NASA OSMA, Aug 2009 | AMD thruster firings kept reaction wheels unsaturated; AMD events 10–14× more frequent than expected because of the asymmetric solar array; interface spec required metric; small errors over the 9-month journey; intended 140–150 km, entered at about 57 km. |
| S6 | [NIST Guide to the SI, Appendix B.8](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8) | NIST | 1 lbf = 4.448 222 N. |

Not relied on: Guinness World Records (its description of which side used which units is muddled); popular articles quoting "$125 million" (the spacecraft figure, per Nature 1999) versus "$327.6 million" (the whole mission). The script avoids dollar figures because the two are often confused.

## Claim-level fact check
| Claim | Script wording | Status | Evidence |
|-------|----------------|--------|----------|
| C1 | "In 1999, NASA flew a spacecraft all the way to Mars" | Established | S1, S3 |
| C2 | "swings behind Mars, and is never heard from again" | Established | S1, S2. Narration avoids claiming exactly how it was destroyed (burned up vs skipped out); S1 says it burned up. |
| C3 | "tiny thruster puffs kept it steady… every one was logged and sent to the navigators" | Established, simplified | S4, S5. "Puffs" = angular momentum desaturation firings; "kept it steady" simplifies "kept reaction wheels in range". |
| C4 | "Colorado logged… pound-force seconds. The navigators in California read them as newton-seconds" | Established | S2 (Colorado/California, English/metric), S5 (spec required metric; modellers assumed metric). |
| C5 | "One pound-force is about four point four five newtons… counted at less than a quarter" | Established | S6: 1/4.448 = 22.5% < 25%. |
| C6 | "for nine months… thrusters fired far more often than anyone had planned" | Established | S5: 10–14× more often than expected. |
| C7 | "about a hundred and forty kilometres… roughly fifty-seven" | Established (minor source variation) | S5: intended 140–150 km, ~57 km. A day-of NSSDC note said ~60 km; some secondary sources cite 226 km as an earlier target. Narration uses the NASA case-study figures. |
| C8 | Narration paraphrase; caption verbatim quote | Established | S2. Paraphrase "the problem wasn't the error. It was failing to catch it" keeps the meaning of the full quote. |
| C9 | On-screen push sizes such as "10 lbf·s" | Illustrative | Labelled as example values in the visuals. |
| — | "A mistake you could make in your maths homework" | Interpretation | Fair characterisation: a unit-conversion mistake. The story then explains it was a process failure, not just carelessness. |
| — | "A guess in a lab coat" | Opinion/joke | Clearly the narrator's line, not attributed to anyone. |

## Uncertainties and limitations
- The exact fate of the spacecraft (destroyed in the atmosphere vs passing through and leaving Mars) is not known; the script says "never heard from again".
- The units error is the root cause, but NASA's board listed several contributing process failures. The twist scene covers that.
- No individual is blamed. The quote is NASA's own statement about its processes.

## Misconceptions to avoid
- "NASA forgot to convert to metric": NASA's navigation software was metric; the ground file from the spacecraft contractor was in English units.
- "The spacecraft's onboard software was wrong": the error was in ground software data used for trajectory modelling.
- "One mistake instantly doomed it": it was many small undercounts over nine months.

## Visual opportunities
Vanishing behind Mars; puffs logged as paper slips; two offices with mountains and palms; a balance scale showing 1 lbf vs 4.45 N; two diverging trajectories; an altitude ladder with the atmosphere glowing; a number wearing a lab coat.

## Fact-checking outcome
Pass, with a publish-time check of S4/S5 for the altitude figures.

## Licences and attribution
Narration: Piper TTS, Alba voice (CC BY 4.0). All artwork, music and sound effects generated by this repository's code. No NASA imagery used.
