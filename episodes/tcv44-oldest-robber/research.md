# Case File 44: The oldest bank robber (tcv44-oldest-robber)

Research ledger, 2026-10-15 (all accesses on this date).

## Method and limits
- 15 standard web searches. WebFetch and curl are blocked in this environment, so every source below is cited from **search-result extracts only**; no full page was read (including the ACLU report PDF and the Japanese Ministry of Justice White Paper).
- Where the extracts disagree, the narration uses the narrowest wording all of them support, and the disagreement is recorded below.
- No paid APIs. Nature column: **fact** = reported consistently by independent outlets or an official record; **reported** = a person's own account, attributed in narration; **alleged** = not used.

## Case choice
The owner asked for a crime committed by a 100-year-old, or by a 90-year-old if that is too rare. Searches for a verified offender aged 98-102 returned only cases where the centenarian was the **victim** (Encino 2021, Fresno, Derby UK, Carson City NV), which the brief excludes. The best-fitting verified case is **J.L. Hunter "Red" Rountree**, listed by Guinness World Records as the oldest convicted bank robber (91 at the 2003 Abilene robbery).

Scored with `series/true-crime/tools/score_case.py` (candidates file in the session scratchpad, `cands44.json`):

| Candidate | Score /21 | Missing |
|---|---|---|
| Rountree, Abilene TX 2003 (envelope marked "Robbery", plate, stopped 20 miles away) | **17.0** | villain_known, closed_within_years |
| Rountree's first robbery, Biloxi 1998 | 14.0 | villain_known, manhunt, closed_within_years |
| Japan's elderly shoplifters (statistics only, no case) | 11.0 | no outcome |
| A verified 98-102-year-old offender | 2.0 | none found |

## Claims ledger
| # | Claim | Nature | Used as | Sources (accessed 2026-10-15) |
|---|---|---|---|---|
| R_hook | On 12 Aug 2003 J.L. Hunter "Red" Rountree, aged 91 (born Dec 1911), robbed a First American Bank branch in Abilene, Texas, by handing a teller an envelope marked "Robbery". | fact | Hook line ("At 91, he robbed a bank."), headline, hero object | AP via Sun Journal (10 Oct 2003) https://www.sunjournal.com/2003/10/10/91-year-old-man-sorry-robbing-texas-bank/ ; AP via Lawrence Journal-World (12 Oct 2003) https://www2.ljworld.com/news/2003/oct/12/91yearold_enters_guilty/ ; Guinness World Records news (Apr 2023) https://www.guinnessworldrecords.com/news/2023/4/i-decided-i-would-get-even-the-oldest-convicted-bank-robber-was-in-his-90s-744096 ; Wikipedia https://en.wikipedia.org/wiki/J._L._Hunter_%22Red%22_Rountree |
| R_record | Guinness lists him as the oldest convicted bank robber (91 at the robbery, 92 at sentencing). | fact | headline context, research | GWR record page https://www.guinnessworldrecords.com/world-records/oldest-convicted-bank-robber ; GWR news (2023); New York Sun obituary (Oct 2004) https://www.nysun.com/article/obituaries-jl-rountree-92-oldest-bank-robber |
| R_where | The third robbery was in Abilene, Texas, in August 2003. | fact | map pin, s05 line | AP (Sun Journal; LJWorld); GWR news |
| R_motive | He said a Corpus Christi bank he did business with forced him into bankruptcy, that he had never liked banks since, and "I decided I would get even" (Orlando Sentinel interview, 2001, as quoted). | **reported** (his own account) | s03 lines "He blamed a bank for his bankruptcy. He wanted to get even."; card says "HIS OWN ACCOUNT, 2001" | GWR news (2023); Wikipedia; American Banker (2004) https://www.americanbanker.com/issues/169_25/-215487-1.html |
| R_biloxi | Robbery 1: a SouthTrust Bank in Biloxi, Mississippi, 1998; three years' probation, a fine, told to leave Mississippi. | fact | s01 line 2 ("And it was not his first."), s04 line, ROBBERY chip 1 | Wikipedia; GWR news; New York Sun |
| R_pensacola | Robbery 2: a NationsBank in Pensacola, Florida, Oct 1999; sentenced to three years in prison; released 2002 (reported as the oldest inmate in Florida's prison system). | fact | s04 line, ROBBERY chip 2 | GWR news; Wikipedia; New York Sun |
| R_envelope | In Abilene he handed the teller an envelope marked "Robbery" and had her fill a second envelope; he left with about $2,000 (AP: $1,999). | fact | s05 line, hero object, ROBBERY chip 3 | AP (Sun Journal; LJWorld); GWR news |
| R_joking | The teller asked him twice if he was joking (AP: "Twice the teller asked if he was kidding"). AP adds that after the first time he told her to hurry or she would get hurt. | fact | FUN FACT card + s05 line 2; the threat is not depicted or made light of | AP via Sun Journal; AP via LJWorld; GWR news |
| R_plate | A bank employee and customers noted his licence plate as he drove away. | fact | s06 line ("But witnesses took his plate.") | AP (Sun Journal; LJWorld); Wikipedia |
| R_stop | Police stopped him on a highway about 20 miles from Abilene, about 30 minutes after the robbery. | fact | s06 line ("Officers stopped him 20 miles away."), label | AP (Sun Journal; LJWorld); GWR news; Wikipedia |
| R_sentence | Pleaded guilty Oct 2003; on 23 Jan 2004, aged 92, sentenced to 151 months (about 12 1/2 years). | fact | s09 line ("At 92, he got over twelve years."), card, end title "12+ YEARS AT 92." | GWR news; GWR record page; KCBD (2004) https://www.kcbd.com/story/1662829/the-story-of-the-92-year-old-bank-robber/ ; New York Sun; American Banker |
| R_death | He died in federal custody at the U.S. Medical Center for Federal Prisoners, Springfield, Missouri, on 12 Oct 2004, less than a year after sentencing. | fact | last line ("He died in prison within a year."), after the setup "Then, at 92, he got over twelve years." | Wikipedia; New York Sun; NPR Morning Edition (23 Nov 2004) https://www.npr.org/2004/11/23/4184232/morning-edition-returns-elderly-robber-passes |

**Disagreements recorded:**
- **Age at the Biloxi robbery:** Wikipedia 86, Guinness 87. The episode gives no age for it (the chip counts robberies, not ages).
- **Birth date:** Wikipedia 16 Dec 1911; New York Sun 11 Dec 1911. Not used; 91 at the Aug 2003 robbery holds either way.
- **Sentence:** Guinness 151 months; KCBD and the New York Sun "12 1/2 years"; Wikipedia "12 years". Narration says "over twelve years"; the card says "151 MONTHS".
- **Timing of the stop:** "about 30 minutes later" / "within 30 minutes". The label says "ABOUT 30 MINUTES LATER".
- **Amount:** AP $1,999; others "about $2,000". The card says "ABOUT $2,000".

## Statistics
| # | Statistic | Source and year | Used as |
|---|---|---|---|
| R_stat | As of 2022 (latest data), people **aged 55 and over** were nearly **1 in 6** people in American prisons, a **fourfold increase since 2000**. | ACLU and the University of Texas LBJ School's Prison and Jail Innovation Lab, *Trapped in Time: The Silent Crisis of Elderly Incarceration*, 22 Sept 2025 (press release https://www.aclu.org/press-releases/new-aclu-report-reveals-humanitarian-crisis-of-rapidly-aging-prison-population ; report page https://www.aclu.org/publications/trapped-in-time-the-silent-crisis-of-elderly-incarceration); Stateline, 29 Sept 2025 https://stateline.org/2025/09/29/americas-aging-prison-population-is-posing-challenges-for-states/ | The "wait, what?" COUNTER (1x to 4x) with the line "America's prisoners 55 and older have quadrupled since 2000." and a small credit row |

Statistics checked but **not used on screen**:
- Japan, Ministry of Justice White Paper on Crime 2020 (2019 data): 42,463 of 192,607 people arrested (22.0 %) were **65 or older**, a record share; shoplifting was 52.4 % of their offences. Source: nippon.com Japan Data https://www.nippon.com/en/japan-data/h00898/ . Only one English-language extract carried the 2019 figure (a 2017 figure of 20.8 % appeared in other outlets), and no more recent arrest share could be verified from extracts, so it is offered to the owner for the caption only, not on screen.
- FY2025 White Paper (2024 data): 2,049 prison admissions aged 65+, 13.8 % of admissions (Institute for Social Vision Design column, https://isvd.or.jp/en/columns/koreisha-jusho-13-8). One source; not used.
- US federal prisoners 65+: only FY2011 figures (Urban Institute, about 5,000, ~3 %) were found; too old; not used.

## Fun fact (card)
"THE TELLER ASKED HIM TWICE / IF HE WAS JOKING." — AP (via Sun Journal and Lawrence Journal-World, Oct 2003) and Guinness World Records (2023) both report it. It passes SUCCESs (simple, unexpected, concrete, credible, a story). The AP detail that he then said she would get hurt is recorded above; the episode does not show or joke about it.

## Lesson (checklist card with SAVE ribbon, captions off)
Spoken cue: "Grandparent short of money? Save these three signs."
Rows: "BILLS SUDDENLY UNPAID" / "ODD, LARGE WITHDRAWALS" / "A NEW 'HELPER' WITH MONEY"; credit row "WA Dept. of Financial Institutions · GA Bankers Assn."
Each row is a warning sign that an older person may be in money trouble or being exploited, from: Washington State Department of Financial Institutions, "Warning signs of elder financial abuse" https://dfi.wa.gov/financial-education/information/warning-signs-elder-financial-abuse (changes from established financial patterns; large or unexplained withdrawals; unpaid bills and disconnection notices; a caretaker, relative or friend suddenly conducting transactions); Georgia Bankers Association, Safe Banking for Seniors resource sheet https://gabankers.com/docs/Safe%20Banking%20for%20Seniors/Resource%20Sheet%20--%20How%20to%20Recognize%20Warning%20Signs%20of%20Financial%20Abuse.pdf ; Fort Financial Credit Union https://www.fhfcu.org/elder-abuse-awareness . The rows are respectful and practical; nothing mocks old age.

## Quotes
- "I decided I would get even" appears in Guinness (2023) and Wikipedia, both drawing on the same 2001 Orlando Sentinel interview, so the two are **not independent**. No "wording as reported" card is used; the narration paraphrases and attributes it ("He blamed a bank... He wanted to get even.").
- No other quote is used. No dialogue is invented.

## Myths and claims NOT used
- That he "learned to rob banks from TV" or similar: not found in any source; not used.
- The name of the Corpus Christi bank and of the Abilene teller: not used (the teller is never named; no real bank's logo is drawn).
- "Died in prison at 92 of old age": the cause of death was not announced (New York Sun quotes a prison spokesman: "I think he was just getting old"); not used.
- Whether he showed a weapon: no source says he did; no weapon is drawn.

## Ethics decisions
- Rountree (deceased) appears only as a faceless rim-lit silhouette tagged "ILLUSTRATION · NOT A LIKENESS". The teller, witnesses, officers, loan officer, older relative and prisoners are generic figures, never named.
- The tone is remarkable and ironic, never a joke about old age; no dementia, no harm to anyone is depicted; the teller is never shown threatened.
- The end question is about the sentence (an opinion), not about his guilt: "12+ YEARS AT 92. / FAIR OR TOO HARSH? / SEND TO YOUR GRANDAD".
- Banks, streets and the car park are generic illustrations; every card is our own typed graphic.
