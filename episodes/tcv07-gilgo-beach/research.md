# Case File 07: the Gilgo Beach killings (Rex Heuermann). Research ledger

Episode: `tcv07-gilgo-beach` · "A Pizza Crust Helped Crack the Gilgo Beach Killings"
Ledger date: **2026-10-11** (legal status re-verified the same day; `legal_status_verified` = 2026-10-11).
Base dossier: `series/true-crime/research_next_slate/ongoing_us_cases_status.md`, section 1 (verified 2026-10-11).

## Method and limits

- 9 web searches on 2026-10-11 ("standard" mode). WebFetch and curl were blocked from the build environment, so every
  source below is a **search-result extract** (title, URL, summary text). Full articles were not read. Dates come from the
  URL or the extract; otherwise "date not in extract" is stated in `episode.json`.
- No quote, date, ruling or source was invented. The only quoted words on screen are "cannot be excluded", which the CBS
  News extract attributes to the prosecution's 2023 bail application.
- "No report found" means the searches returned nothing newer. It does not prove nothing happened.
- Status re-check (search 1, 2026-10-11): sentenced June 2026; **he waived his right to appeal** as part of the plea; no
  appeal or post-sentencing challenge reported; expected transfer to a state prison (not yet named). Nothing after the
  17 June 2026 sentencing changes the episode.

## Established facts (stated as fact in the narration)

| Claim | Fact | Sources |
|---|---|---|
| G_plea | 8 Apr 2026, before any trial: pleaded guilty to seven murders (3 first-degree, 4 second-degree) and admitted killing an eighth woman, Karen Vergata, with whose death he was never charged. Trial had been set for Sept 2026. | CNN 2026-04-11; NewsNation; The Hill; Boston Globe/AP timeline 2026-04-08 |
| G_sentence | 17 Jun 2026, Judge Timothy Mazzei, Riverhead: three consecutive life-without-parole terms (Barthelemy, Waterman, Costello) plus four consecutive 25-to-life terms (Brainard-Barnes, Taylor, Costilla, Mack). | CNN 2026-06-17; Suffolk County DA release; CBS New York; PBS NewsHour |
| G_appeal | He waived his right to appeal as part of the plea (on screen only: "APPEAL WAIVED" stamp). | FOX 13 (Fox News); ABC13/ABC News sentencing report |
| G_names | The eight women: Melissa Barthelemy, Maureen Brainard-Barnes, Amber Costello, Sandra Costilla, Valerie Mack, Jessica Taylor, Karen Vergata, Megan Waterman. | Suffolk County DA; CNN sentencing; CNN plea |
| G_families | Victims' relatives spoke at the sentencing. | ABC13 ("angry families speak out"); CBS New York |
| G_cold | First remains found 11 Dec 2010 (search for a missing woman); nobody charged until July 2023, i.e. more than a decade. | CNN timeline 2024-01-15; Boston Globe/AP timeline 2026-04-08; KSL (CNN) 2023 |
| G_task | Multi-agency task force (Suffolk PD, Sheriff, NY State Police, FBI) formed early 2022 under Commissioner Rodney Harrison. | KSL (CNN); NBC New York "How was the Gilgo Beach killer caught?"; AP via AOL |
| G_name | Heuermann was a Manhattan architect with an office on Fifth Avenue in Midtown. | NBC New York (pizza crust); Fox News; WJLA/Sinclair |
| G_arrest | Arrested 13 Jul 2023 in Midtown Manhattan as he left / near his office. (Extracts differ slightly: "at his office" vs "as he left his office in Midtown". Narration says "near his Manhattan office".) | WJLA/Sinclair; CBS News "Avalanche of evidence"; KSL (CNN) |
| G_ng | July 2023: not-guilty plea entered through his lawyer. | WJLA/Sinclair; CBS News |
| G_surveil | He was under surveillance for more than a year before the arrest. | KSL (CNN); CBS News; NBC New York |

## Prosecution's 2023 allegations as filed (attributed in narration and on screen)

The trial never happened, so these were never tested before a jury. They come from the prosecution's **July 2023 bail
application**. The narration says "prosecutors said"; cards say "PROSECUTORS' 2023 FILING".

1. **The truck (G_truck).** A witness saw a first-generation Chevrolet Avalanche when Amber Costello disappeared in 2010.
   In March 2022 a state investigator on the task force linked Heuermann to that kind of truck, which he had owned (one
   extract says 13 March, others 14 March; the episode gives no day). Sources: CBS News "Avalanche of evidence";
   WJLA/Sinclair; NBC New York. *The victim is not named in the narration: "Prosecutors said it began with a truck a witness saw in 2010. It led the task force to a Manhattan architect: Rex Heuermann."*
2. **Burner phones (G_phones).** Billing records led investigators to burner phones that, prosecutors alleged, were used
   to contact the victims; phone records placed them near his Midtown office. Narration: "Next, burner phones. Prosecutors said they reached victims and pinged near his office." (The filing also alleged taunting calls and
   voicemail checks; not used, to keep the episode non-graphic.) Sources: CBS News; WJLA/Sinclair.
3. **The pizza crust (G_pizza, G_dna).** On or about 26 Jan 2023 a surveillance team recovered a pizza box he threw into
   a garbage can on Fifth Avenue in Manhattan. The crust was swabbed and sent for **mitochondrial** DNA analysis. On or
   about 12 Jun 2023 the lab reported that he "cannot be excluded" as the source of a male hair found near the bottom of
   the burlap around Megan Waterman's body (prosecutors: 99.96% of the North American population would be excluded).
   The defence said mitochondrial DNA is less precise than nuclear DNA. Sources: CBS News (pizza crust); NBC New York;
   Fox News. *Narration: "Prosecutors said the crust's DNA linked him to a hair found with a victim." Card: "MITOCHONDRIAL DNA
   LINK · HE 'CANNOT BE EXCLUDED' · NOT A NUCLEAR, UNIQUE MATCH".*

## Fun facts (each with two or more reputable sources)

1. **FUN FACT 1 (G_weeks): the 2022 task force flagged him within about six weeks of forming.** NBC New York: identified
   "six weeks after" the new commissioner formed the task force; KSL (CNN): "within weeks, the task force identified
   Heuermann", per DA Ray Tierney; AP (via AOL/Gulf News): within six weeks of the task force's first meeting. One News 12
   extract said "six months", which conflicts with the March 2022 date and is treated as an error (Feb 2022 first
   meeting → 14 Mar 2022 = about six weeks). Pop-up: "The new task force flagged him within about six weeks of forming."
   Sparkle anchored to "weeks,".
2. **FUN FACT 2 (G_wgs): a New York first.** On 3 Sep 2025, after a Frye hearing of nearly six months, Judge Mazzei
   ruled that whole-genome-sequencing (nuclear) DNA results that Astrea Forensics produced from rootless hairs were
   admissible; reports called it the first time such evidence was allowed in a New York court. Sources: ABC7/ABC News
   ("the first time the techniques are allowed as evidence in a New York court"); Law360; Hoodline; NBC New York; the
   decision itself, People v Heuermann, 2025 NY Slip Op 25203 (Justia). Wording on screen is hedged: "It was reportedly
   the first time a New York court allowed whole-genome DNA from hair." The label adds "Allowed as evidence: not a
   verdict". The plea made the ruling moot for trial.

Rejected fun-fact candidate: "unsolved for over a decade" is used as a story line (G_cold), not a fun fact.

## Next case tease (G_next)

Lizzie Borden was acquitted on 20 June 1893 (New Bedford, Massachusetts). Her friend Alice Russell said she saw Lizzie
burn a dress in the kitchen stove after the killings (Lizzie said it was stained with paint). Sources: Biography.com
(trial); Encyclopedia.com (Great American Trials, "Lizzie Borden Trial: 1893"); Oxygen. Re-verify in the Borden episode.

## Myths and claims NOT used

- **"Nuclear DNA from the pizza crust" / "a DNA match".** False framing: the crust gave a mitochondrial result that "cannot
  exclude" him. Nuclear (whole-genome) work was Astrea's separate, later analysis of hairs.
- **"Proven at trial".** There was no trial; the clues are filing allegations. The plea is the established fact.
- **Any other Gilgo-area death attributed to him** (including Shannan Gilbert and the unidentified remains). Not part of
  his plea; not mentioned.
- **A 2010-2011 date range for the killings** (one WAVY extract). CBS and CNN say 1993-2010. Not used on screen.
- **18 June sentencing date** (one ABC-based extract). CNN, the DA and CBS give 17 June. Used 17 June.
- **FBI Behavioral Analysis Unit cooperation.** From an unnamed extract only; not used.
- **"Thawk" e-mail account and online searches.** Reported, but not needed and not used.
- **Victims' family statements / quotes.** Not quoted.

## Ethics decisions

- **Defendant:** shown only as an anonymous rim-lit silhouette (`characters/figures/gb7_suit.json`, a generic tall man in
  a suit). No likeness, no face, no photo reference.
- **His wife and children** were never charged: never depicted, named or implied. No home is shown.
- **Victims:** never depicted; remains never shown or described. Named once, respectfully, on an "IN MEMORY OF" card
  (alphabetical, no ages, no photographs, no occupations). No stigmatising words anywhere; occupations are not mentioned.
- **Places:** the beach and the parkway where remains were found are not shown as crime scenes. The dune road is a
  generic, empty barrier-island road at dusk, tagged "GENERIC ROAD, NOT A CRIME SCENE". The Midtown street, the car,
  the office, the lab and the courtroom are generic.
- **No imitation** of the bail filing, police photographs, logos, the DA seal or court records. Cards are the series'
  own typed graphics. The pizza box is a plain generic box with no brand.
- **Tone:** the fun facts are investigative (speed of the task force, a legal first), not flippant. The ending states the
  outcome, gives one line to the women and their families, then the next-case tease.
- **Generic investigators** (detective, agent_a, agent_b, analyst, scientist, examiner, official) are not real people.

## Sources (search-result extracts, accessed 2026-10-11)

- CNN, 2026-04-11: https://www.cnn.com/2026/04/11/us/gilgo-beach-killings-rex-heuermann-guilty
- NewsNation: https://www.newsnationnow.com/crime/gilgo-beach-killings/rex-heuermann-plead-guilty-gilgo-beach-murders-hearing/
- The Hill: https://thehill.com/regulation/court-battles/5821815-rex-heuermann-pleads-guilty-to-gilgo-beach-serial-killings/
- Boston Globe (AP timeline), 2026-04-08: https://www.bostonglobe.com/2026/04/08/nation/gilgo-beach-killings-timeline/
- CNN, 2026-06-17: https://www.cnn.com/2026/06/17/us/rex-heuermann-life-sentence
- Suffolk County DA: https://www.suffolkcountyda.org/gilgo-serial-killer-sentenced-to-three-consecutive-life-sentences-plus-100-years-for-murdering-eight-women/
- CBS New York: https://www.cbsnews.com/newyork/news/rex-heuermann-gilgo-beach-serial-killer-sentencing-long-island/
- PBS NewsHour: https://www.pbs.org/newshour/nation/rex-heuermann-sentenced-to-life-in-prison-for-new-yorks-gilgo-beach-serial-killings
- ABC13: https://abc13.com/post/gilgo-beach-serial-killer-rex-heuermann-sentenced-admitting-8-murders/19315064/
- FOX 13: https://www.fox13news.com/news/rex-heuermann-be-sentenced-after-pleading-guilty-7-murders-admitting-another
- CBS News, "Avalanche of evidence": https://www.cbsnews.com/news/gilgo-beach-murder-suspect-rex-heuermann-evidence-chevy-strand-of-hair-pizza-box/
- CBS News, pizza crust: https://www.cbsnews.com/amp/news/gilgo-beach-murders-dna-pizza-crust-linked-rex-heuermann-to-victim-court-documents-say/
- NBC New York, pizza crust: https://www.nbcnewyork.com/news/local/how-leftover-pizza-crust-linked-an-architect-to-gilgo-beach-serial-killings/4506598/
- Fox News, pizza box: https://foxnews.com/us/gilgo-beach-murders-pizza-box-dna-manhattan-led-police-long-island-serial-killing-suspect-rex-heuermann.amp
- WJLA/Sinclair: https://wjla.com/news/nation-world/suspected-serial-killer-arrested-long-island-architect-linked-to-the-gilgo-four-murders-through-burner-phones-and-dna-evidence-rex-andrew-heuermann-melissa-barthelemy-megan-waterman-amber-costello-maureen-brainard-barnes-netflix-film-lost-girls
- KSL (CNN): https://www.ksl.com/article/50687701/a-flood-of-evidence-has-come-in-since-suspects-arrest-in-gilgo-beach-serial-killings-case-da-says
- NBC New York, how he was caught: https://www.nbcnewyork.com/news/local/crime-and-courts/how-was-gilgo-beach-killer-caught/6486890/
- AP via AOL: https://www.aol.com/police-investigating-gilgo-beach-killings-143329651.html
- CNN timeline, 2024-01-15: https://edition.cnn.com/2024/01/15/us/gilgo-beach-murder-case-timeline
- ABC7, DNA ruling: https://abc7news.com/post/critical-dna-evidence-allowed-gilgo-beach-serial-killer-case-judge-rules/17730897/
- Law360: https://www.law360.com/articles/2385233/gilgo-beach-dna-evidence-ruling-may-propel-new-methods
- Hoodline: https://hoodline.com/2025/09/new-york-judge-greenlights-cutting-edge-dna-as-evidence-in-gilgo-beach-serial-killer-case/
- People v Heuermann, 2025 NY Slip Op 25203: https://law.justia.com/cases/new-york/other-courts/2025/2025-ny-slip-op-25203.html
- Biography.com: https://www.biography.com/crime/a73581416/lizzie-borden-trial
- Encyclopedia.com: https://www.encyclopedia.com/law/law-magazines/lizzie-borden-trial-1893
- Oxygen: https://www.oxygen.com/crime-news/lizzie-borden-the-real-story-of-andrew-borden-abby-bordens-murders
