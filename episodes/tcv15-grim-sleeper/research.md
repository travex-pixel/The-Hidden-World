# Case File 15: the "Grim Sleeper" (Lonnie David Franklin Jr.). Research ledger

Episode: `tcv15-grim-sleeper` · "Police Posed as a Busboy to Get a Killer's Pizza Crust"
Ledger date: **2026-10-12**. Legal status verified on 2026-10-12 (`legal_status_verified` = 2026-10-12).
No earlier dossier existed for this case; everything below comes from this ledger's own searches.

## Method and limits

- 14 web searches on 2026-10-12 ("standard" mode). WebFetch and curl are blocked from the build environment, so every
  source is a **search-result extract** (title, URL, summary text). Full articles, the Attorney General's release, the
  court rulings and trial records were **not read**. Dates come from the URL or the extract; otherwise `episode.json`
  says "date not in extract".
- Rule used: a fact is narrated or put on screen only when at least two reputable outlets agree. Where several outlets
  carry the same wire story (AP lists, CNN wire), the wire copy is paired with an independent outlet or an official
  release.
- No quote, ruling, date or source was invented. No quotation is used on screen or in the narration.
- Status check (2026-10-12): closed case. Convicted 5 May 2016; sentenced to death 10 Aug 2016; died on death row at
  San Quentin on 28 Mar 2020. Nothing found that changes the episode.

## Script structure (the proven formula)

Line 1 pairs an everyday object with our best-performing case and withholds the how: "A pizza crust helped catch the
Gilgo Beach killer. / But it wasn't the first time." The hero object is a generic plate with a leftover pizza crust,
big and centred in the first and the last frame (no visual fade-out, so the video loops on it). Clue chain: the
apparent gap and the nickname, crime-scene DNA with no name, the familial search, the name, the pizza restaurant, the
undercover busboy (the payoff, about 57% of the runtime), the lab match, the arrest. Justice payoff: convicted of ten
murders, sentenced to death, died in prison. Memorial card (names only), callback ("Twenty-five years without a name. A
pizza crust helped end it."), then the NEXT CASE card (the Boston Strangler).

## Established facts (stated as fact in the narration or on cards)

| Claim | Fact | Sources | Scene |
|---|---|---|---|
| GR_gilgo | Gilgo Beach (our Case File 07): prosecutors' July 2023 filing said DNA from a pizza crust Rex Heuermann discarded in Manhattan linked him to evidence (a mitochondrial link); he pleaded guilty in April 2026. "Helped catch" = its role in building the case. | CBS News; NBC New York; CNN (plea) — all already in the Case File 07 ledger | s01 |
| GR_first_time | In July 2010, 13 years before Gilgo, LA detectives used DNA from pizza and tableware Franklin left at a restaurant. | NBC News ("Pizza helped cops nab 'Grim Sleeper' suspect"); ABA Journal; The Boston Globe | s01 |
| GR_span | Convicted of murdering nine women and a 15-year-old girl in South Los Angeles between 1985 and 2007. "In 1985, a killer began murdering women in South Los Angeles." Summary only. | KTVU (AP) sentencing report; Christian Science Monitor (AP); CBC News | s02, s15 |
| GR_victims | Most of the victims were Black women (ages in the AP list run from 15 to the mid-thirties). Narration: "Most of his victims were young Black women." | Courthouse News ("Most of the victims ... were black"); NBC News (NBCBLK); AFRO (AP list with ages) | s04 |
| GR_community | The Black Coalition Fighting Back Serial Murders (Margaret Prescod and others, mid-1980s) pressed police and the city for answers; after the verdict Prescod said the group had been "fighting for justice" since 1985. Narration: "A community group spent decades demanding justice." | Courthouse News; NBC News (NBCBLK, Prescod quoted on Black women's lives being undervalued); NPR (families still awaiting closure, 2016). Supporting: UCLA Bunche Center paper (credits her campaign with a city reward and an LAPD task force). | s04 |
| GR_nomatch | Investigators had the killer's crime-scene DNA, but it matched no one in California's offender database (no identical match); the first familial search for the case (2008) found no relative. | KESQ (CNN wire: "found no identical matches, but did find a 'familial' match"); California AG release; Honolulu Star-Advertiser (AP) | s05 |
| GR_familial | A second familial search of the state database, begun 28 Apr 2010, found a partial match pointing to a close relative of the killer: his son. Narration: "It flagged a close relative: his son." | California AG release; NBC News; CBS News; Star-Advertiser (AP); Court TV (AP, 2020) | s06 |
| GR_name | The son's father: Lonnie David Franklin Jr., then 57, of West 81st Street, South Los Angeles. | KESQ; NBC News; Star-Advertiser (AP) | s07 |
| GR_party | 5 July 2010: LAPD detectives followed him to a birthday party at a pizza restaurant in Buena Park. | ABA Journal ("two LAPD detectives saw Franklin enter ... in Buena Park for a kid's birthday party"); Center for Genetics and Society (aggregated news report: Franklin testified he was at a birthday party on 5 July 2010 at a Buena Park pizza restaurant); Oxygen ("followed him to a local pizza parlor") | s08 |
| GR_busboy | One detective, in a restaurant uniform, posed as a busboy and collected what Franklin used: napkins, a glass, a fork and his leftover pizza. A judge later ruled the DNA was lawfully obtained. | NBC News (busboy); ABA Journal ("cop got by posing as restaurant busboy"; napkins, glasses, a fork, a partially eaten slice); The Boston Globe ("uneaten pizza crust, a napkin and a drinking glass"); Officer.com ("discarded crust"); KESQ (restaurant uniform). *Conflicts:* busboy vs waiter vs employee; slice vs crust; glass vs cups. Narration says "busboy" and "pizza crust" (each in 2+ sources); the card says "AS REPORTED". | s09, s15 |
| GR_match | DNA from the restaurant items matched DNA evidence from the crime scenes. | NBC News; Center for Genetics and Society (report on the 2015 ruling: "proved a match with material found on ... many of the women"); Oxygen | s10 |
| GR_arrest | Arrested on 7 July 2010, two days after the party, in front of his home on West 81st Street. | KESQ ("9:20 a.m. in front of his home in the 1700 block of West 81st Street"); NBC News; ABA Journal ("two days later") | s11 |
| GR_verdict | 5 May 2016: convicted of 10 counts of first-degree murder (nine women and a 15-year-old girl) and one count of attempted murder. | CNN; Christian Science Monitor (AP); CBC News | s13 |
| GR_sentence | Jury recommended death (June 2016); on 10 Aug 2016 Judge Kathleen Kennedy sentenced him to death and rejected motions for a new trial and for life without parole. | ABC7 Los Angeles; KTVU (AP); CNN; CBC (jury recommendation) | s13 |
| GR_died | Died 28 Mar 2020 at San Quentin State Prison, on death row, aged 67; no signs of trauma reported; cause pending autopsy at the time. Narration: "he died in prison in 2020". | CBS Los Angeles; Court TV (AP); The Telegraph, Nashua (AP) | s13 |
| GR_names | The ten people he was convicted of murdering: Debra Jackson, Henrietta Wright, Barbara Ware, Bernita Sparks, Mary Lowe, Lachrica Jefferson, Alicia Alexander, Princess Berthomieux (15), Valerie McCorvey, Janecia Peters. Shown as names only. | AFRO (AP list); Los Angeles Sentinel; La Opinión. *Conflicts:* some ages and one date differ between lists; no ages or dates are shown. | s14 |
| GR_families | Some families waited decades: the earliest killings in the conviction date from 1985 and the verdict came in 2016; in 2016 NPR described families still awaiting closure. | NPR; NBC News (NBCBLK); CNN | s14 |

## Allegations / inquiry findings (attributed)

- **The "first" (GR_firstarrest)** is attributed to officials, not stated as our finding: the Attorney General's office
  said the familial search program (adopted 2008, used about ten times) had led to its first arrest, and DA Steve Cooley
  called it the first successful use of a familial search in California (NBC News). Narration: "Officials called it
  California's first familial DNA arrest." Sources: California AG release; NBC News; Star-Advertiser (AP).
- **Defence challenge (not narrated):** the defence argued the detective cleared the plates before Franklin had
  finished and that his plates could have been mixed with others; Judge Kathleen Kennedy ruled the DNA lawfully
  obtained (ABA Journal; Center for Genetics and Society). Only "as reported" is used on the item card.
- **More victims (not used):** prosecutors tied him to further deaths in the penalty phase and police said he may have
  killed more; the episode states only the ten convictions.

## Fun facts (pop-ups; each with two or more sources)

1. **GR_gap: the nickname.** LA Weekly (reporter Christine Pelisek and her editor) coined "the Grim Sleeper" in 2008
   because of an apparent gap in the killings between 1988 and 2002; the LAPD later adopted the name. Sources: Columbia
   Journalism Review (Darts and Laurels, Nov/Dec 2010: "thirteen-year gap"); KQED ("How a determined L.A. reporter
   helped expose the alleged Grim Sleeper killer"); IOL/Reuters ("gap of more than 13 years ... earned the mass murderer
   the nickname"); CBS Los Angeles ("apparent 13-year break"). *Conflict:* 13 vs 14 years (AP says 14, 1988-2002);
   narration says "about thirteen years"; the card shows "1988 to 2002". *Nuance:* NBC Los Angeles (2020) reports that
   detectives later did not believe there was a real break, so the narration says he "seemed to stop" and the card says
   "apparent". Pop-up in s03, sparkle on "newspaper".
2. **GR_firstarrest: California's first arrest from a familial DNA search** (attributed to officials, see above).
   Pop-up in s12, sparkle on "first".

## Next case tease (GR_next)

The Boston Strangler: in July 2013, almost 50 years after Mary Sullivan's 1964 killing, investigators tailed relatives
of Albert DeSalvo until a nephew discarded a water bottle; its Y-DNA linked the family to crime-scene evidence, and after
DeSalvo's remains were exhumed the Suffolk DA announced a match, applying to Sullivan's case only. Sources: Suffolk
County DA (archive release, 19 Jul 2013); NBC News; Fox News ("50 years later, DNA found on discarded bottle"). Narration:
"Next: almost fifty years later, a water bottle and the Boston Strangler." Card: "Almost 50 years later, a water bottle
linked him." ("named him" was avoided: DeSalvo had confessed decades earlier; the DNA linked him to one killing.)

## Myths and claims NOT used

- **The restaurant's name** (a real business, reported in Franklin's testimony): not shown or said. The restaurant is a
  generic family pizza place with an illegible menu board.
- **Why the son's DNA was on file** (reported as a 2009 felony weapons conviction; one source says "after an arrest"):
  not narrated: it is irrelevant to the killings and would stigmatise someone who was never a suspect; he is never named
  or shown. A card says "Not named here,
  and not a suspect."
- **"Killed as many as 25" / "35 women in photos"**: police and activist estimates, not convictions. Not used.
- **"The first familial DNA search in the US"**: AG Brown spoke of the first time in the nation that familial DNA broke
  a case "of such magnitude"; too qualified for a short. Not used.
- **His job (city sanitation worker, police garage attendant)**: in some extracts, not needed. Not used.
- **Survivor details**: the woman who survived a 1988 attack and testified is not named or described.
- **Crime details** (how the victims were killed or found): never used.

## Ethics decisions

- Franklin appears only as an anonymous rim-lit silhouette (`gr15_franklin`, `real_person: true`, "not a likeness");
  every shot with him carries "ILLUSTRATION · NOT A LIKENESS".
- The victims are never depicted or described; they are remembered by name on a memorial card. The victims are
  described only as "mostly young Black women", never stigmatised; no mention of drugs or sex work.
- One respectful line acknowledges the community's long campaign ("A community group spent decades demanding
  justice"), with the coalition's name on a typed card. Community members are generic figures, labelled as such.
- His son: "a close relative: his son" (as in 2+ sources), never named, shown or implied to have done wrong.
- The undercover detective and all police are generic figures with no badges, insignia or likeness; the patrol car has
  no lettering. The streets, house, restaurant, lab, briefing room and courtroom are generic illustrations, tagged.
- No real photograph, newspaper, court or police document, logo or restaurant branding is imitated. Screens and cards
  are our own typed graphics; DNA traces are illustrative, not real data.
