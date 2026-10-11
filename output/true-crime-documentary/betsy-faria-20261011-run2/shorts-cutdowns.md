# Shorts repurposing package

> **Revised 11 Oct 2026 after the evidence and legal-risk audit.** The original is in `audit/superseded/` and git commit f422b30. Release status: **DRAFT — NOT CLEARED FOR PUBLICATION** (see `audit/release-decision.md`). Do not upload until the open items in `audit/human-review-items.md` are resolved.

**Audit result: none of the five rendered Shorts is cleared.** Re-cutting them is a cheap ffmpeg job (no documentary re-render), but it waits for your approval.

| Short | Blocking issue | Needed |
|---|---|---|
| 01 | Opens on "Life without parole, for murdering his wife" without "convicted" (FC-02 / LR-03); cold-open juxtaposition (LR-02) | Revised opening line requires a new voice line; or start the clip at 0:03.6 and add a status card |
| 02 | Lays out the case against an untried defendant with no legal-status statement (FC-01 / LR-09, gate G9) | Burned-in card for the whole clip: "Pam Hupp has pleaded not guilty in Betsy Faria's death and is presumed innocent"; corrected title |
| 03 | Prosecution allegations with no outcome (FC-15 / gate G9) | Extend to 5:15.0 (Alford plea + sentence) or add an outcome card |
| 04 | Mentions Hupp with no legal-status context (gate G9) | Status card |
| 05 | Contains L76, where the short pause can be misheard (AUD-01) | Needs the re-voiced line (new render) |

All timestamps refer to `documentary.mp4` (7:17, v2). Each cut-down is a self-contained clip with its own payoff, and each ends on the same note so the long-form link can carry it.

**Vertical 9:16 reframing plan (all five).** The documentary's graphics are composed for 16:9, and a centre crop would cut off headline text. So each Short is framed like this:
1. **Middle:** the 16:9 frame, scaled to the full 1080 px width (1080×608).
2. **Background:** the same frame, scaled to fill 1080×1920, blurred heavily and darkened 45%. No black bars.
3. **Top zone (y ≈ 180–420):** a hook headline, Inter Display Black, 2 lines at most.
4. **Lower zone (y ≈ 1290–1560):** burned-in captions, 2 lines at most, taken from `captions.srt` for that range.

This keeps every evidence graphic legible and puts nothing over the source tags or reconstruction labels. These are produced by `documentary/shorts.py`, which is separate from the existing Shorts engine and does not touch it.

| # | Short | Source in → out | Length |
|---|---|---|---|
| 1 | Guilty, then not guilty | 0:00.0 → 0:25.7 | 25.7 s |
| 2 | The argument the jury never heard | 1:57.2 → 2:52.4 | 55.2 s |
| 3 | The $900 note | 4:08.4 → 5:02.8 | 54.4 s |
| 4 | He walked free | 3:38.4 → 4:06.1 | 27.7 s |
| 5 | Where it stands | 6:46.9 → 7:17.0 | 30.1 s |

---

### 1. "Guilty, then not guilty"
- **Range:** 0:00.0 → 0:25.7 (the cold open, through the title card)
- **Hook (on screen):** SAME MAN. TWO VERDICTS.
- **Opening line (narration):** "Life without parole, for murdering his wife." NOT GUILTY lands at 0:03.6.
- **Payoff:** He is acquitted. Then comes the twist: prosecutors charged the friend who drove Betsy home, the same person named beneficiary of the $150,000 policy days earlier.
- **Captions:** from the SRT, burned in for this range.
- **Suggested Short title:** "Guilty in 2013. Not guilty in 2015. #truecrime"

### 2. "The argument the jury never heard"
- **Range:** 1:57.2 → 2:52.4
- **Hook:** THE ARGUMENT THE JURY NEVER HEARD
- **Opening line:** "But the jury never heard the defense's case about someone else."
- **Payoff:** It escalates through the beneficiary change, the changing account and the phone records. It lands on the judge barring the defense from arguing another suspect under the "direct connection" rule.
- **Fairness note:** The on-screen "as reported" labels stay visible. Hupp is presumed innocent in this case.
- **Suggested Short title (corrected):** "Why the first jury never heard the defense's theory". The earlier title was false: Hupp testified at that trial (FC-01).

### 3. "The $900 note"
- **Range:** 4:08.4 → 5:02.8 (Part 5, from the 911 call to "frame Russ Faria all over again")
- **Hook:** "RUSS'S MONEY"?
- **Opening line:** "Nine months later, in August 2016, Pam Hupp called 911 from her home in O'Fallon, Missouri."
- **Payoff:** The prosecution's allegation that it was staged to frame Russ again.
- **Fairness note:** The scene is labelled with the prosecution's framing throughout. Hupp's later Alford plea (5:02.8 → 5:15.0) can be added if the Short runs past 60 s.
- **Suggested Short title:** "The note in his pocket said 'Russ's money'"

### 4. "He walked free"
- **Range:** 3:38.4 → 4:06.1
- **Hook:** 3½ YEARS LATER
- **Opening line:** "Days later, Russ walked out of jail on bond, after about three and a half years behind bars."
- **Payoff:** "NOT GUILTY," followed by the judge criticizing the investigation.
- **Suggested Short title:** "After 3½ years locked up, a judge said: not guilty"

### 5. "Where it stands"
- **Range:** 6:46.9 → 7:17.0 (the closing, through the end card)
- **Hook:** STILL NO VERDICT
- **Opening line:** "Russ Faria spent about three and a half years locked up for a murder he was ultimately acquitted of."
- **Payoff:** "Nearly fifteen years after her death, no court has decided who killed her."
- **Suggested Short title:** "15 years later, no court has decided who killed Betsy Faria"

---

**Status of the actual files:** see `qa-report.md` for which vertical MP4s were rendered and validated.
