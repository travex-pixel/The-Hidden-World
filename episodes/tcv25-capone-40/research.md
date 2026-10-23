# Case File 25: Al Capone, brought down by a ledger (40-second cut) — research ledger

Date: 2026-10-12. Episode id `tcv25-capone-40`, prefix `ac25`. Closed case (conviction 1931; subject died 1947).

## Method and limits
- 14 WebSearch calls in "standard" mode; WebFetch and curl are blocked in the build environment, so only **search-result extracts** were read, never full pages. Every source record in `episode.json` says so in `accessed`.
- Primary material located: the IRS FOIA copy of Frank Wilson's 21 Dec 1933 summary report (irs.gov) and its Wikisource transcription; the UMKC "Famous Trials" transcript excerpt of Wilson's testimony; the FBI's history page and 2005 story. Secondary: Britannica (summary), History.com, Encyclopedia.com (Great American Trials), The Mob Museum, Crime Library, Wikipedia (Frank J. Wilson, Hawthorne Smoke Shop, James H. Wilkerson, Chicago Crime Commission, Frank J. Loesch, Eliot Ness), Deseret News, WBEZ, The Daily Beast, Albuquerque Journal, Grant Thornton, Gangland Wire, Yahoo News timeline, The Washington Post (via Teaching Cleveland), KTAR/AP.
- Not reachable in extracts: a Chicago Tribune, Smithsonian or National Archives page on the ledger (searched; none surfaced). The Tribune is cited only indirectly (the 24 Apr 1930 list, as reported by Wikipedia / Deseret News / WBEZ).

## Established facts (used in narration; claim ids in episode.json)
- **A_ran**: Capone dominated organized crime in Chicago from the mid-1920s to 1931 (Britannica, History.com, FBI).
- **A_enemy**: Chicago Crime Commission's first "public enemies" list, 24 April 1930, 28 names, Capone first; chairman Frank J. Loesch (Wikipedia CCC/Loesch, Deseret News 1997, WBEZ). Narrated as "Chicago's Crime Commission named him Public Enemy Number One"; card "APRIL 1930".
- **A_tax_owed**: prosecution figures at trial: $215,080.48 tax on $1,038,654.84 income, 1924-29 (Mob Museum; Encyclopedia.com; Famous Trials chronology; Yahoo timeline gives "$215,000 plus interest" in back taxes at sentencing). Narrated as "Prosecutors said he owed $215,000" (rounded; attributed). Card "PROSECUTORS, 1931: UNPAID TAX · $215,080".
- **A_never_filed**: Capone never filed a return; the Treasury Intelligence Unit (Elmer Irey) with special agent Frank J. Wilson built the case (Wikipedia Wilson, Mob Museum, Grant Thornton, IRS document page, History.com Wilson).
- **A_ledger_found**: 1930: Wilson found bound ledgers seized in a 1926 raid on a Capone gambling house in Cicero (the Hawthorne Smoke Shop) among stored records; the ledger covered 1924-26 (Famous Trials, Crime Library, Daily Beast, Wikipedia Hawthorne Smoke Shop, Wilson's 1933 report). Wikipedia's extract calls it a raid on "the Hawthorne Hotel" (the shop was in the hotel building). Narration: "a 1926 raid on a Cicero gambling house" (the shop is not named on screen).
- **A_bookkeeper**: handwriting led to bookkeeper Leslie Shumway, who testified; cashier Fred Ries also testified about cashier's cheques (Crime Library, Daily Beast, Wikipedia Hawthorne, Mob Museum Prohibition site, Famous Trials). Neither is named on screen; the figure is generic.
- **A_letter**: Capone's tax lawyer Lawrence Mattingly's 1930 letter conceding taxable income; admitted at trial over objection (Famous Trials Wilson transcript, Crime Library, Wikipedia Wilkerson, Albuquerque Journal). Narration: "Capone's own lawyer had written to the taxman, conceding income." The lawyer is not named on screen.
- **A_al**: the ledger split net profits among names/initials including "Al" (also "A", with "Ralph"/"R", "Pete", "J", "Town") — Wikipedia Hawthorne Smoke Shop ("a few references to 'Al'"), Daily Beast, Famous Trials ("A", "R" and "J"), Grant Thornton. Narration: "One of them was simply 'Al'." The drawn ledger carries only illegible marks; the "Al" is our own typed callout.
- **A_plea_jury** (card/label only): June 1931 indictment (22 counts); guilty plea entered 16 June 1931 and withdrawn after Judge Wilkerson said the court could not be bound by a bargain; on the first day of trial (5/6 Oct 1931, sources differ by a day) he swapped his jury panel with another judge's after a tip that the defence had the panel list (Wikipedia Wilkerson, Crime Library, Famous Trials chronology, Gangland Wire, FBI page). The assignment's "swapped the jury panel on the first day" is confirmed.
- **A_verdict**: guilty 17 Oct 1931 on five counts (evasion 1925-27; failure to file 1928-29); sentenced 24 Oct 1931 (FBI 2005 story; the FBI history page says 24 Nov, an outlier) to 11 years, $50,000 fine and costs ($7,692 per the timeline; Encyclopedia.com says $30,000 costs; History.co.uk's "$80,000 fine" not used). Narration: "Guilty on five counts. Eleven years." Card: "11 YEARS · $50,000 FINE + COSTS".
- **A_alcatraz**: Atlanta; Alcatraz August 1934 (19 or 22 Aug per source); Terminal Island Jan 1939; released 16 Nov 1939; died 25 Jan 1947, Palm Island, Florida (FBI, Mob Museum, Britannica, History.com).
- **A_ness** (card only): Ness's Prohibition squad was not part of the tax case; the legend is largely fiction (Washington Post 2022 via Teaching Cleveland; Jonathan Eig via KTAR/AP; Wikipedia Ness).

## Corrections to the assignment brief
- The ledger raid: sources say a 1926 raid on the Cicero gambling house / the Hawthorne Hotel building; **none of the extracts tie that raid to the McSwiggin shooting** (27 April 1926), so the McSwiggin link is not used anywhere.
- Sentencing date: 24 October 1931 (FBI 2005, Encyclopedia.com, History.com); the FBI history page's "November 24" is treated as an error.
- Costs: $7,692 (timeline) vs $30,000 (Encyclopedia.com): the card says "+ COSTS" without a figure.

## Myths and claims NOT used
- Eliot Ness / "The Untouchables" as the men who got Capone (fiction-driven; caveat on a card only).
- The St Valentine's Day massacre (not mentioned at all; nothing violent is shown).
- "$100 million a year" income estimates and Capone's "net worth" figures (unsourced in reputable extracts).
- Shumway found at a Miami racetrack / Ries in St Louis: colourful detail in secondary sources, not needed and not narrated.
- Syphilis as cause of death: not narrated (medical detail; sources vary).

## Ethics decisions
- Capone and Wilson are illustrated representations tagged 'ILLUSTRATION · NOT A LIKENESS': generic period figures, no scar, no photo reference, never with a weapon, alcohol or cash, never posed heroically; no words of theirs are quoted.
- The bookkeeper, the lawyer and the associates are generic figures or anonymous silhouettes and are not named on screen.
- No violence, victims or the massacre; the backroom is a counting room (cash box shut, adding machine), not a bar.
- No real document is imitated: the ledger has illegible marks, the letter is a blank sheet, the "Al" is our own typed callout with the note "our own mark; entries not reproduced".
- Dollar amounts have spoken forms in `pronounce` and match the sources; "about"/"prosecutors said" where rounded. Pronunciation checked with the offline recogniser: "$215,000" -> "two hundred fifteen thousand dollars"; "Cicero" -> "Sis-ero" (the default read as "size road"); "Capone" and "Alcatraz" are left to the voice (overrides made them worse); the hook was reworded "ruled Chicago's underworld" because "ran Chicago's" blurred into "ranch".
- The end question ("Eliot Ness or the taxman?") is a debate prompt; the answer is on the verdict card ("the tax case did it").
