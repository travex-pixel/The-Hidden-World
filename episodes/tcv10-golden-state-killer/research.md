# Case File 10: the Golden State Killer (Joseph James DeAngelo). Research ledger

Episode: `tcv10-golden-state-killer` · "The Golden State Killer Was Caught by His Cousins' DNA"
Ledger date: **2026-10-11** (legal status checked the same day; `legal_status_verified` = 2026-10-11).
Base dossier: `series/true-crime/research_other_candidates/gsk.md` (2026-10-11, search extracts, sources G1-G31).

## Method and limits

- 15 web searches on 2026-10-11 ("standard" mode), on top of the base dossier. WebFetch and curl are blocked from the
  build environment, so every source below is a **search-result extract** (title, URL, summary text). Full articles,
  the unsealed search-warrant affidavit and the plea documents were **not read**. Dates come from the URL or the extract;
  otherwise `episode.json` says "date not in extract".
- Rule used: a fact is narrated or put on screen only when at least two reputable outlets agree. Several "independent"
  outlets carry the same AP story (noted below); where that is the case I paired AP with a separate outlet or the
  official DA release.
- No quote, date, ruling or source was invented. No quotation is used on screen or in the narration.
- Status check (2026-10-11): closed case. Guilty plea 29 Jun 2020; sentence 21 Aug 2020; under the plea he gave up his
  right to appeal (one extract). Nothing found that changes the episode.

## Established facts (stated as fact in the narration)

| Claim | Fact | Sources | Scene |
|---|---|---|---|
| GS_relatives | He had never put his own DNA in a genealogy (or law-enforcement) database. The genealogy lead came from profiles that distant relatives had uploaded and shared on GEDmatch. | The Tech Interactive ("nor had he ever submitted or donated his DNA to any genealogy database"); LA Magazine (a sample "uploaded by a distant relative of DeAngelo's to a genealogy website", per the Sacramento County DA's office); AP via KTVU (matched "genetic material stored in an online database by a distant relative"); NPR 27 Apr 2018 | s01 hook |
| GS_crimes | The crimes covered by the plea were committed in California between **1975 and 1986**: dozens of crimes, including **13 murders**. | BreakingNews.ie ("crimes committed between 1975 and 1986"); OCDA joint release (13 murders, dozens of uncharged crimes); CBC ("crime spree from '70s and '80s"); AP via ABC13 | s02 |
| GS_nomatch | Police had crime-scene DNA, but for years it matched no one in the FBI's national database or California's databank. | The Tech Interactive; LA Magazine; a Sacramento-area report summarised in search (no match in the FBI database; California databank "came up blank") | s03 |
| GS_upload | Investigators put a crime-scene DNA profile on **GEDmatch**, a **free** public genealogy site, reportedly under a pseudonym/fake profile (NYT, relayed by AP). | NPR 27 Apr 2018 ("Investigators Uploaded His DNA To Genealogy Site"); CNN 26 Apr 2018 ("free genealogy database"); AP via KTVU ("The free genealogy website, which pools DNA profiles that people upload and share publicly") | s04 |
| GS_cousins | GEDmatch returned distant relatives, reported as roughly third- to fourth-cousin matches. | UC Davis Biology news; Valley News ("Family tree led to suspected Golden State Killer"); AP via KTVU ("several matches of individuals who were distant relatives") | s05 |
| GS_trees | Investigators built family trees (reported as more than 25) and narrowed them to men of the right age who lived in the right areas at the right times. Narration: "narrowed them by age and location". | UC Davis; Valley News; NPR. *Conflict:* one report speaks of a tree of about 1,000 people, another of 25+ trees. No number is used. | s05, s07 |
| GS_name | The trees led to Joseph James DeAngelo, then 72, of Citrus Heights, a Sacramento suburb. | AP via Anchorage Daily News; CBS Sacramento; UC Davis | s07 |
| GS_door | 18 Apr 2018 (unsealed affidavit, June 2018): detectives followed him to a store in Roseville and swabbed the driver's-side door handle of his car while he shopped. | 10News/Scripps; AP via WFTV; The Daily World. *Detail not used:* the store brand (shown as a generic store with no name or logo). | s09 |
| GS_tissue | 23 Apr 2018: a tissue taken from the trash outside his home gave the **conclusive** DNA link (per the warrant). | ABC News 1 Jun 2018; BuzzFeed News (dossier G6); The Daily World ("only one item... a piece of tissue... provided enough DNA"). *Conflict:* one extract says the trash was taken "two days" after the swab, AP says five; the episode gives no interval ("Then"). | s10 |
| GS_arrest | Arrested outside his home in Citrus Heights (ABC: "in his driveway") on 24 Apr 2018, aged 72. | ABC News; The Daily Beast (police "waited for DeAngelo to vacate his home" before arresting him); AP via ADN (age 72). *Conflict:* booking was early on 25 Apr; one outlet says Wednesday. The card says 24 APRIL 2018 (arrest date). | s11 |
| GS_plea | 29 Jun 2020: pleaded guilty to 13 counts of first-degree murder and 13 of kidnapping to commit robbery; admitted 161 uncharged crimes that could not be charged because of the statute of limitations; the deal took the death penalty off the table. | OCDA joint release; The State Hornet; WAMC (NPR); Courthouse News. *Note:* some AP/NPR copy calls the second 13 counts "rape-related"; the official release says kidnapping to commit robbery, which the card uses. | s12 |
| GS_sentence | 21 Aug 2020, Judge Michael Bowman: 11 consecutive life terms without parole, plus further terms. | AP via ABC13; BreakingNews.ie; Investigation Discovery; NBC News. *Conflict:* AP says "15 life terms with the possibility of parole and eight years"; Investigation Discovery says "an additional life sentence, plus another eight years". The card shows only "11 x LIFE WITHOUT PAROLE" and "PLUS FURTHER TERMS". | s13 |

## Allegations / inquiry findings

- None needed: he pleaded guilty, so the convictions are established. The **161 uncharged crimes** were **admitted, not
  convicted**. The card says "ADMITTED 161 UNCHARGED CRIMES", not "convicted".
- The affidavit's door-handle result (a mixed sample whose main contributor matched a crime-scene profile) is described
  only as "swabbed his car's door handle"; the **conclusive** match is attributed to the tissue, as the warrant says.

## Fun facts (pop-ups; each with two or more sources)

1. **GS_oregon: a year earlier, a DNA lead pointed to the wrong man in Oregon.** In March 2017, an Oregon City officer,
   acting for California investigators, persuaded a judge to order a DNA sample from a 73-year-old man in a nursing
   home, citing a rare genetic marker found through a different public genealogy database (YSearch). He was not the
   killer. Sources: AP via KTVU (2018-04-28); ABC30 ("DNA mistake pegged Oregon man as 'Golden State Killer'"); NBC News
   (dossier G14). Most of these carry AP's review of court records, so they are not fully independent. **He is never
   named or shown.** Pop-up: "In 2017, an earlier DNA lead got a judge to order a sample from an Oregon man. He wasn't
   the killer." Sparkle on "wrong".
2. **GS_cop: he was still a police officer when the crimes began.** Exeter PD (1973-76) and Auburn PD (1976-79); the
   crimes covered by the plea began in 1975. Fired in 1979 after being accused of shoplifting a hammer and a can of
   dog repellent. Sources: AP via ADN; Yahoo News (wire report); CBS Sacramento; Truthdig ("Shoplifting Ended Accused
   Killer's Police Career"); 1975 start: BreakingNews.ie. Pop-up: "He was still a police officer when the crimes began.
   (1973-1979)". Sparkle on "police".
3. **GS_ballroom: the plea hearing was held in a university ballroom.** Sacramento State's ballroom was used as a
   makeshift courtroom to allow social distancing (COVID-19) for a crowd of nearly 200. Sources: The State Hornet;
   CBC News; PBS NewsHour/AP (dossier G22). Sparkle on "ballroom."

Considered, used as a story line rather than a pop-up: "the case made genetic genealogy a standard cold-case tool"
(GS_legacy, narrated as "the method has helped crack hundreds of cold cases": Family Tree Magazine; Fox News; CNN
2018 trend piece. "Hundreds" is a widely reported approximation; no official national count was found, and estimates
range from 200+ to 1,000+, so no number is given).

## The privacy debate (GS_privacy, stated neutrally)

- GEDmatch's co-founder said police use of the site was "without our knowledge" and raised privacy concerns echoed by
  civil-liberties groups; GEDmatch also said it had always told users the database could be used for other purposes;
  the lead investigator said no court order was needed. Sources: AP via KTVU; Fox News; PBS NewsHour. Narration: "It
  also sparked a debate over DNA privacy." No side is endorsed.

## Next case tease (GS_next)

The Great Train Robbery, 8 Aug 1963: about £2.6 million stolen from a Royal Mail train; fingerprints found on a Monopoly
board (and a ketchup bottle) at the gang's Leatherslade Farm hideout helped lead police to them. Sources: British
Transport Police history page; Smithsonian; Family Tree (UK); Yahoo News. **Not used:** "Britain's biggest robbery"
(no extract stated it explicitly; the Postal Museum extract says only that the amount "stunned the nation"), and the
"played with real money" story (reputed, not established). Re-verify in the Great Train Robbery episode.

## Myths and claims NOT used

- **"His DNA was discarded on the car door handle."** The handle was swabbed (touch DNA); only the tissue was discarded.
- **"13 rape counts"** (some AP/NPR copy). The official release says 13 counts of kidnapping to commit robbery; the
  rapes could not be charged because of the statute of limitations.
- **Victim counts from different bases** (AP "87 victims at 53 crime scenes in 11 counties" vs the official "161
  uncharged crimes / 61 victims"). Not mixed; only "13 murders" is narrated, and "161 uncharged crimes" is on a card.
- **Which databases were used.** 2018 coverage: GEDmatch. Later reporting (LA Times, ~2020, seen only second-hand) says
  FamilyTreeDNA and MyHeritage were also used. The narration names only GEDmatch, as in the 2018 public account.
- **The Visalia Ransacker link, the "roast in the oven" remark, the store brand, the Hobby Lobby name, the arrest time of
  day.** Not needed or not verified twice. The arrest is drawn in neutral late-afternoon light (a neighbour reported
  commotion around 4 p.m.; booking was overnight), not as a dawn raid.
- **Names of investigators and the genealogist** (Paul Holes, Barbara Rae-Venter). Not named or depicted, per the brief.
- **"Arrested after a 40-year manhunt" / "four decades".** Phrasing varies; the narration avoids a number of years.

## Ethics decisions

- **Crimes:** summarised only ("dozens of crimes, including 13 murders"). The word "rape" appears in no narration or
  on-screen text; nothing is described or depicted. No house is shown being entered; the 1970s street is empty except
  for an anonymous silhouette walking on a public pavement.
- **Victims, survivors and families:** never named, shown or implied. The 1980 crime-scene profile mentioned in some
  extracts is not linked to any victim on screen.
- **DeAngelo:** only an anonymous rim-lit silhouette (`characters/figures/gs10_man.json`, `real_person: true`), tagged
  "ILLUSTRATION · NOT A LIKENESS". No face, no photo reference, no wheelchair (as reported at the plea), no uniform
  badge or department markings.
- **The Oregon man (2017):** never named or shown.
- **Investigators and genealogists:** generic characters (`detective`, `agent_a`, `agent_b`, `analyst`, `examiner`,
  `scientist`, `judge`, `official`); none represents a real person.
- **No imitation** of the warrant, the DA release, GEDmatch's website or logo, a store's branding, police badges or
  court records. Cards are the series' own typed graphics; the genealogy screen is a generic tree of dots.
- **Tone:** the fun facts are investigative (a wrong lead, the ex-officer, a ballroom hearing during COVID), never about
  the crimes.

## Sources (search-result extracts, accessed 2026-10-11)

See `episode.json` → `sources` for the full list with publishers and dates. Key URLs:
- OCDA joint release (official): https://ocdistrictattorney.gov/?p=23204
- The State Hornet: https://statehornet.com/2020/06/golden-state-killer-plea-guilty-sac-state
- CBC: https://www.cbc.ca/1.5631418 · https://www.cbc.ca/lite/story/1.4634936
- WAMC (NPR): https://www.wamc.org/2020-06-29/golden-state-killer-pleads-guilty-to-13-murders-to-avoid-the-death-penalty
- Courthouse News: https://www.courthousenews.com/golden-state-killer-pleads-guilty-to-13-murders-admits-to-multiple-rapes/
- AP via ABC13: https://abc13.com/post/golden-state-killer-sentenced-to-life-for-26-rapes-slayings/6381825/
- BreakingNews.ie: https://www.breakingnews.ie/world/golden-state-killer-will-die-in-prison-after-string-of-rapes-and-murders-1014701.html
- Investigation Discovery: https://www.investigationdiscovery.com/crimefeed/serial-killer/golden-state-killer-joseph-deangelo-sentenced-to-life-in-prison-
- The Tech Interactive: https://www.thetech.org/ask-a-geneticist/golden-state-killer-suspect-tracked-down-through-familial-dna
- LA Magazine: https://www.lamag.com/citythinkblog/dna-golden-state-killer/
- UC Davis: https://biology.ucdavis.edu/news/using-dna-databases-track-down-golden-state-killer-suspect
- Valley News: https://vnews.com/2018/05/02/family-tree-led-to-suspected-golden-state-killer-17176624/
- AP via KTVU (GEDmatch): https://www.ktvu.com/news/genealogy-site-didnt-know-it-was-used-to-seek-serial-killer
- AP via KTVU (wrong man): https://www.ktvu.com/news/search-for-golden-state-killer-led-to-wrong-man-in-2017
- ABC30: https://abc30.com/post/dna-mistake-pegged-oregon-man-as-golden-state-killer/3409391/
- AP via ADN: https://www.adn.com/nation-world/2018/04/25/suspect-in-golden-state-killer-case-an-ex-police-officer-is-arrested-after-decades/
- Yahoo News: https://news.yahoo.com/california-man-arrested-golden-state-killer-case-suspected-195117631.html
- CBS Sacramento: https://www.cbsnews.com/sacramento/news/citrus-heights-arrest-search/
- Truthdig: https://www.truthdig.com/?p=168955
- 10News/Scripps: https://www.10news.com/news/national/golden-state-killer-dna-that-led-to-suspects-arrest-was-collect-from-his-car-while-he-shopped
- AP via WFTV: https://www.wftv.com/news/trending-now/affidavit-golden-state-killer-suspects-dna-obtained-while-he-shopped-at-hobby-lobby/762734958
- The Daily World: https://thedailyworld.com/?p=19252
- ABC News (tissue): https://abcnews.com/US/dna-tissue-alleged-golden-state-killers-trash-led/story?id=55602892
- The Daily Beast: https://www.thedailybeast.com/golden-state-killer-arrested-according-to-co-author-of-ill-be-gone-in-the-dark
- Family Tree Magazine: https://familytreemagazine.com/dna/investigative-genetic-genealogy
- Fox News (hundreds of cases): https://foxnews.com/us/cold-cases-cracked-experts-solving-hundreds-violent-crime-mysteries-decades-no-answers.print
- Fox News (privacy): https://www.foxnews.com/tech/dna-link-to-golden-state-killer-raises-questions-of-privacy-versus-safety
- British Transport Police (GTR): https://www.btp.police.uk/police-forces/british-transport-police/areas/campaigns/our-history/crime-history/great-train-robbery/
- Smithsonian (GTR): https://www.smithsonianmag.com/history/big-mystery-behind-great-train-robbery-may-finally-have-been-solved-180952054/
