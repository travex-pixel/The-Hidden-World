# Shorts repurposing package

All timestamps refer to `documentary.mp4` (7:26). Each cut-down is a self-contained clip with its own payoff, and each ends on the same note so the long-form link can carry it.

**Vertical 9:16 reframing plan (all five).** The documentary's graphics are composed for 16:9, and a centre crop would cut off headline text. So each Short is framed like this:
1. **Middle:** the 16:9 frame, scaled to the full 1080 px width (1080×608).
2. **Background:** the same frame, scaled to fill 1080×1920, blurred heavily and darkened 45%. No black bars.
3. **Top zone (y ≈ 180–420):** a hook headline, Inter Display Black, 2 lines at most.
4. **Lower zone (y ≈ 1290–1560):** burned-in captions, 2 lines at most, taken from `captions.srt` for that range.

This keeps every evidence graphic legible and puts nothing over the source tags or reconstruction labels. These are produced by `documentary/shorts.py`, which is separate from the existing Shorts engine and does not touch it.

| # | Short | Source in → out | Length |
|---|---|---|---|
| 1 | Guilty, then not guilty | 0:00.0 → 0:31.7 | 31.7 s |
| 2 | What the jury never heard | 1:59.3 → 2:52.5 | 53.2 s |
| 3 | The $900 note | 4:10.7 → 5:05.8 | 55.1 s |
| 4 | He walked free | 3:39.6 → 4:08.4 | 28.8 s |
| 5 | Where it stands | 6:56.1 → 7:26.2 | 30.1 s |

---

### 1. "Guilty, then not guilty"
- **Range:** 0:00.0 → 0:31.7 (the cold open, through the title card)
- **Hook (on screen):** SAME MAN. TWO VERDICTS.
- **Opening line (narration):** "In 2013, a Missouri jury found Russ Faria guilty of murdering his wife."
- **Payoff:** He is acquitted. Then comes the twist: prosecutors charged the friend who drove Betsy home, the same person named beneficiary of the $150,000 policy days earlier.
- **Captions:** from SRT cues 1–12.
- **Suggested Short title:** "Guilty in 2013. Not guilty in 2015. #truecrime"

### 2. "What the jury never heard"
- **Range:** 1:59.3 → 2:52.5
- **Hook:** THE JURY NEVER HEARD THIS
- **Opening line:** "But a different set of facts never reached that jury."
- **Payoff:** It escalates through the beneficiary change, the changing account and the phone records. It lands on the judge barring the defense from arguing another suspect under the "direct connection" rule.
- **Fairness note:** The on-screen "as reported" labels stay visible. Hupp is presumed innocent in this case.
- **Suggested Short title:** "Why the first jury never heard about Pam Hupp"

### 3. "The $900 note"
- **Range:** 4:10.7 → 5:05.8 (Part 5, from the 911 call to "frame Russ Faria all over again")
- **Hook:** "RUSS'S MONEY"?
- **Opening line:** "Nine months later, in August 2016, Pam Hupp called 911 from her home in O'Fallon, Missouri."
- **Payoff:** The prosecution's allegation that it was staged to frame Russ again.
- **Fairness note:** The scene is labelled with the prosecution's framing throughout. Hupp's later Alford plea (5:05.8 → 5:18.9) can be added if the Short runs past 60 s.
- **Suggested Short title:** "The note in his pocket said 'Russ's money'"

### 4. "He walked free"
- **Range:** 3:39.6 → 4:08.4
- **Hook:** 3½ YEARS LATER
- **Opening line:** "Days later, Russ walked out of jail on bond, after about three and a half years behind bars."
- **Payoff:** "NOT GUILTY," followed by the judge criticizing the investigation.
- **Suggested Short title:** "After 3½ years locked up, a judge said: not guilty"

### 5. "Where it stands"
- **Range:** 6:56.1 → 7:26.2 (the closing, through the end card)
- **Hook:** STILL NO VERDICT
- **Opening line:** "Russ Faria spent about three and a half years locked up for a murder he was ultimately acquitted of."
- **Payoff:** "Nearly fifteen years after her death, no court has decided who killed her."
- **Suggested Short title:** "15 years later, no court has decided who killed Betsy Faria"

---

**Status of the actual files:** see `qa-report.md` for which vertical MP4s were rendered and validated.
