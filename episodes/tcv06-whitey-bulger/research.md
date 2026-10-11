# Case File 06: James "Whitey" Bulger. Research ledger

- **Episode:** `tcv06-whitey-bulger`, "How a Stray Cat Helped End a 16-Year FBI Manhunt".
- **Ledger date:** 2026-10-11 (facts re-checked on this date).
- **Case status:** closed. Bulger was convicted in August 2013 and died in federal prison in October 2018. Catherine Greig finished her sentence in July 2020 (dossier: Boston Globe, Bangor Daily News). The tipster has never been confirmed by the FBI.
- **Builds on:** `series/true-crime/research_next_slate/us_one_clue_cases.md`, section 1 (same date, same method).

## Method and limits

- **Searches:** 10 WebSearch calls in "standard" mode, inside the 12-call budget for this episode. They covered the arrest ruse and the cash and guns; the 16 years and age 81; the tipster and the cat; *The Departed* (two searches); the cash in the walls; the June 2011 TV campaign and the 1999 Top Ten listing; the 2013 verdict; the Connolly conviction; and the Gilgo Beach pizza crust (for the end tease).
- **Only search-result extracts were used.** WebFetch and curl are blocked in this environment, so no full page was opened, including the FBI pages. Quotes and figures are what the extracts reported. Every source in `episode.json` is marked "search-result extract; full page not reachable".
- **The two-source rule.** Every narrated claim cites at least two independent reputable sources (FBI, AP/Reuters, major newspapers or broadcasters, public radio). Wikipedia, blogs and aggregators were used only as pointers.
- **Tipster sources are not fully independent.** The tipster's identity and the cat story trace back to one original report (Boston Globe, October 2011). CBS News, CBS Boston, TIME and PRI repeated it. The episode therefore says "reportedly" and never names her.
- **Not re-verified here:**
  - Gilgo Beach legal status (guilty plea on 8 April 2026, life sentence on 17 June 2026). This comes from `series/true-crime-cinematic/NEXT_SLATE_PLAN.md`. The tease only uses the pizza-crust link reported in 2023.
  - The exact date of Bulger's 1999 Top Ten listing. The FBI release and WBUR extracts say "Top Ten fugitive since 1999".

## Established facts (as narrated)

| Claim | Narrated as | Sources |
|---|---|---|
| W_16years | "He hid from the FBI for sixteen years." The FBI said its task force had sought him for 16 years. He fled in late 1994 (HISTORY.com) or 1995 (the FBI on Greig's flight); on screen this is "1994-95". | FBI story 23 Jun 2011; FBI Boston statement; HISTORY.com |
| W_who | Boston mob boss, secretly an FBI informant. | CBS News; Fox News/AP (2011); NBC News (2008) |
| W_tipoff | His FBI handler, John Connolly, warned him of the coming indictment and he fled. Connolly was convicted of racketeering in 2002. Sources differ on the exact date of the tip (December 1994 or 1995), so the narration gives none. | NBC News 2008; WBUR 2008; CBS News |
| W_list | On the FBI's Ten Most Wanted list from 1999. | FBI release 20 Jun 2011; WBUR; FBI story |
| W_campaign | On 20 June 2011 the FBI announced a 30-second PSA built around Catherine Greig. It ran on daytime shows with many female viewers, about 350 slots in 14 markets. The aim was to reach people who might know her, such as a hair stylist, a dentist or a neighbour. | FBI release; WBUR; Bangor Daily News/AP |
| W_tip | The tip reached the FBI on the evening of 21 June. The FBI called the arrest a direct result of the campaign. The tipster was a former neighbour in Santa Monica. | Boston Globe; NBC News; FBI story; CBS News |
| W_cat | She and Greig "bonded over" a stray cat that the couple fed (Globe reporting). | CBS News; TIME; PRI |
| W_lure | 22 June 2011: agents had the building manager tell Bulger that his storage locker had been broken into. He came down to the garage, where agents were waiting (Agent Scott Garriola's trial testimony). | Santa Monica Daily Press/AP; Portland Press Herald/AP |
| W_arrest | Arrested aged 81, with Greig, in Santa Monica. | FBI story; CNBC; HISTORY.com |
| W_cash | Nearly $822,000 in cash and 30 guns. A court filing says $822,198, "much of it… hidden inside a wall". The trial testimony says most of the guns were in holes cut into the walls. Hence "much of it hidden in the walls". | SMDP/AP trial coverage; Press Herald/AP; CBS News/AP (auction) |
| W_verdict | 12 August 2013: convicted on 31 of 32 counts, including racketeering. The jury found him involved in 11 of the 19 murders charged. | CNN; Boston Globe; WGBH; VOA/Reuters |
| W_died | Died in prison in 2018. The narration says only this. | CBS News; PBS NewsHour/AP |
| W_next | The end tease. Prosecutors said DNA from a pizza crust Rex Heuermann threw into a Manhattan trash can was linked to a hair found with a Gilgo Beach victim, which led to his 2023 arrest. | Al Jazeera; NBC New York |

## Myths and wording NOT used

- **"On the Most Wanted list for 16 years."** Wrong. He was on the run for about 16 years, but on the Top Ten list only from 1999 to 2011 (about 12 years). The hook says "hid from the FBI for sixteen years".
- **"Caught because of a stray cat."** Overstated. The tip came from a neighbour who knew Greig through a stray cat. Wording used: "The tip that caught him began with a stray cat" and "a stray cat helped end".
- **"She saw the FBI's TV ad."** Unverified. Reports say she saw news coverage of the search while in Iceland, and one report says the spots did not air in Los Angeles. Wording used: "She saw the news in Iceland."
- **"A woman in Iceland recognised her."** Misleading. She was a former Santa Monica neighbour who happened to be in Iceland.
- **"$800,000 in the walls."** Imprecise. The figure is nearly $822,000, and "much of it" was hidden in a wall or walls. The guns are only named, never drawn.
- **Greig's plastic surgery or monthly dental cleanings.** Not used (unverified in the extracts).
- **"The only tip" / "the FBI's genius".** Not claimed. A Las Vegas man said he reported a sighting in 2008. The FBI's own corruption (Connolly) is stated plainly.
- **The building name and the cat's name ("Tiger").** Not used (single extract).
- **"Bulger saw *The Departed* in a cinema while on the run."** Not used. This comes from the book *Hunting Whitey* via a deputy's report; it is secondhand.
- **The manner of his death in 2018.** Not used. The brief and ethics rules say "died in prison in 2018" only.

## Fun facts (two independent reputable sources each)

1. **The tipster was reportedly a former Miss Iceland**, and she saw the news while in Iceland (claim W_iceland).
   - Sources: [CBS News](https://cbsnews.com/news/whitey-bulger-taken-down-by-ex-miss-iceland); [CBS Boston](https://cbsnews.com/boston/news/report-whitey-bulger-tipster-was-former-miss-iceland); [TIME](https://newsfeed.time.com/?p=100228); [PRI](https://www.pri.org/stories/2011-10-10/former-miss-iceland-tipped-fbi-whitey-bulger).
   - All of these trace back to the Boston Globe's October 2011 report, so it is worded "reportedly" and she is not named.
2. **Jack Nicholson's mob boss in *The Departed* (2006) was reportedly inspired by Bulger** (claim W_departed).
   - Sources: [Boston Magazine](https://www.bostonmagazine.com/?p=547821); [MPR News](https://newscut.mprnews.org/2011/06/big-screen_villains_and_real-l/index.html); [A&E](https://www.aetv.com/articles/how-whitey-bulger-inspired-movie-and-tv-mob-bosses).
   - The inspiration was loose. The character's name, Frank Costello, comes from a different gangster.
- **Considered, not used (time):** the $2 million reward; the couple living in the same rent-controlled apartment for about 15 years and paying in cash (WBUR, The Daily Record).

## Ethics decisions

- **Depiction.** Bulger and Greig are illustrated representations ("ILLUSTRATION · NOT A LIKENESS" on every shot they appear in).
  - Bulger uses only generic older-man traits: white hair and beard, a cap and dark glasses.
  - The 1995 "wanted" card shows the same character without the beard, cap or glasses.
  - Greig is a generic older woman with white-blonde hair.
- **The tipster.** Always an anonymous rim-lit silhouette, never named. The FBI had promised confidentiality, and the Globe's decision to name her was criticised. "Former Miss Iceland" appears only as a "reportedly" fun fact, because it was widely published in 2011.
- **Connolly** (a real person) appears only as an anonymous silhouette, and the shot is tagged "not a likeness".
- **Greig** is living and has served her sentence. She appears only in everyday, non-sensational moments (feeding the cat), with no mocking or "moll" framing.
- **Victims.** No violence, victim, weapon or injury is shown. The murders are given in summary only ("involvement in eleven murders"). His death is "died in prison in 2018" with no detail.
- **No imitation of official material.** No FBI seal, poster, PSA, newscast or document is imitated. The "WANTED" / "TEN MOST WANTED" cards and the TV "PUBLIC APPEAL" are our own typed graphics, with no logo, seal or phone number. Every place (the street, the apartment, the garage, the office) is generic and tagged.
- **No invented dialogue or quotes.** The ruse is paraphrased from trial testimony, not quoted.
