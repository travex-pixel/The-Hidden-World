# Case File 10: the Golden State Killer (Joseph James DeAngelo). Research ledger

Episode: `tcv10-golden-state-killer` · "The Golden State Killer Was Caught by His Cousins' DNA"
Ledger date: **2026-10-11** (legal status checked the same day; `legal_status_verified` = 2026-10-11).
Base dossier: `series/true-crime/research_other_candidates/gsk.md` (2026-10-11, search extracts, sources G1-G31).

## Method and limits

- 15 web searches on 2026-10-11 ("standard" mode), on top of the base dossier. WebFetch and curl are blocked from the
  build environment, so every source below is a **search-result extract** (title, URL, summary text). Full articles,
  the unsealed search-warrant affidavit and the plea documents were **not read**. Dates come from the URL or the extract;
  otherwise `episode.json` says "date not in extract".
- Rule used: a fact is narrated or put on screen only when at least two reputable outlets agree. Several outlets carry
  the same AP story (noted below); where that is the case, AP is paired with a separate outlet or the official DA release.
- No quote, date, ruling or source was invented. No quotation is used on screen or in the narration.
- Status check (2026-10-11): closed case. Guilty plea 29 Jun 2020; sentence 21 Aug 2020; under the plea he has no right
  to appeal the sentence (one extract). Nothing found that changes the episode.

## Script structure (producer update, BTK lessons)

The hook is the setup and the mystery, not the answer: "For decades, police had his DNA, but no name. / So they went
looking for his cousins." One hero object, a generic crime-scene DNA vial with our own typed label ("CRIME SCENE · DNA ·
NAME: ?"), is big and centred in the first frame and again in the last frames ("MATCHED"). Object micro-reveals: the
upload screen, the match list, the family tree, the car door handle, the tissue in an evidence bag. The payoff ("The DNA
was a conclusive match") lands at about 64% of the runtime. Callback: "Decades without a name, ended by a family tree
and a tissue in the trash." 186 words, 13 scenes, 76.6 s.

## Established facts (stated as fact in the narration or on cards)

| Claim | Fact | Sources | Scene |
|---|---|---|---|
| GS_noname | For decades the crime-scene DNA sat in evidence, but it matched no one in the FBI's national database or California's databank: he had never been arrested for an offence that put his DNA on file. Hook: "For decades, police had his DNA, but no name." | The Tech Interactive ("nor had he ever submitted or donated his DNA to any genealogy database"; never arrested for an offence requiring a sample); LA Magazine. A further search extract (Sacramento-area report, URL not identified) says the FBI and state databank searches "came up blank" and that the DNA "lay in evidence storage for decades". *Nuance:* the evidence dates from the 1970s-80s; DNA profiling and the link between the crime series came later. "Had his DNA" refers to the stored evidence. | s01 |
| GS_relatives | Investigators went looking for his relatives in a public genealogy database. He had never put his own DNA there; the lead came from profiles that distant relatives had uploaded and shared on GEDmatch. | The Tech Interactive; LA Magazine (a sample "uploaded by a distant relative of DeAngelo's to a genealogy website", per the Sacramento County DA's office); AP via KTVU; NPR 27 Apr 2018 | s01 |
| GS_crimes | They called him the Golden State Killer. The crimes he admitted were committed in California between **1975 and 1986**: dozens of crimes, including **13 murders**. | BreakingNews.ie ("crimes committed between 1975 and 1986"); OCDA joint release (13 murders, dozens of uncharged crimes); CBC ("crime spree from '70s and '80s"); AP via ABC13 | s02 |
| GS_upload | Investigators put a crime-scene DNA profile on **GEDmatch**, a **free** public genealogy site, reportedly under a pseudonym (NYT, relayed by AP). GEDmatch said this was done without its knowledge. | NPR 27 Apr 2018 ("Investigators Uploaded His DNA To Genealogy Site"); CNN 26 Apr 2018 ("free genealogy database"); AP via KTVU ("The free genealogy website, which pools DNA profiles that people upload and share publicly") | s03 |
| GS_cousins | No match for the killer himself; GEDmatch returned distant relatives, reported as roughly third- to fourth-cousin matches. The on-screen list ("~ 3RD COUSIN" etc.) is our own illustrative graphic, not the real results. | UC Davis Biology news; Valley News ("Family tree led to suspected Golden State Killer"); AP via KTVU ("several matches of individuals who were distant relatives") | s04 |
| GS_trees | Investigators built family trees (reported as more than 25) and narrowed them to men of the right age who lived in the right areas at the right times. | UC Davis; Valley News; NPR. *Conflict:* one report speaks of a tree of about 1,000 people, another of 25+ trees. No number is used; the tree on screen is a generic diagram. | s05, s06, s13 |
| GS_name | The trees led to Joseph James DeAngelo, then 72, of Citrus Heights, California. | AP via Anchorage Daily News; CBS Sacramento; UC Davis | s06 |
| GS_cop | He had been a police officer in Exeter (1973-76) and Auburn (1976-79), so he was still an officer when the crimes began (1975). | AP via ADN; Yahoo News (wire report); CBS Sacramento; 1975 start: BreakingNews.ie | s07 |
| GS_fired | Fired by Auburn in 1979 after being accused of shoplifting a hammer and a can of dog repellent from a store. | AP via ADN; Yahoo News; Truthdig ("Shoplifting Ended Accused Killer's Police Career"); also ABC10 and CBS Sacramento in the dossier | s07 |
| GS_door | 18 Apr 2018 (unsealed affidavit, June 2018): detectives followed him to a store in Roseville and swabbed the driver's-side door handle of his car while he shopped. | 10News/Scripps; AP via WFTV; The Daily World. *Not used:* the store brand (the store is generic, with a blank sign). | s08 |
| GS_tissue | 23 Apr 2018: a tissue taken from the trash outside his home gave the **conclusive** DNA match (per the warrant). | ABC News 1 Jun 2018; BuzzFeed News (dossier G6); The Daily World ("only one item... a piece of tissue... provided enough DNA"). *Conflict:* extracts give different intervals after the swab (two days / five days); the narration just says "Then". | s09, s13 |
| GS_arrest | Arrested outside his home in Citrus Heights (ABC: "in his driveway") on 24 Apr 2018, aged 72. | ABC News; The Daily Beast (police "waited for DeAngelo to vacate his home" before arresting him); AP via ADN (age 72). *Conflict:* booked early on 25 Apr; the card gives the arrest date. | s10 |
| GS_plea | 29 Jun 2020: pleaded guilty to 13 counts of first-degree murder and 13 of kidnapping to commit robbery; admitted 161 uncharged crimes that could no longer be charged (statute of limitations); the deal took the death penalty off the table. | OCDA joint release; The State Hornet; WAMC (NPR); Courthouse News. *Note:* some AP/NPR copy calls the second 13 counts "rape-related"; the official release says kidnapping to commit robbery, so the card says "13 KIDNAPPINGS". | s11 |
| GS_sentence | 21 Aug 2020, Judge Michael Bowman: 11 consecutive life terms without parole, plus further terms. Narration: "life without parole, eleven times over". | AP via ABC13; BreakingNews.ie; Investigation Discovery; NBC News. *Conflict:* AP says "15 life terms with the possibility of parole and eight years"; Investigation Discovery says "an additional life sentence, plus another eight years". The card shows only "11 CONSECUTIVE LIFE TERMS · WITHOUT PAROLE · PLUS FURTHER TERMS". | s12 |

## Allegations / inquiry findings

- None needed: he pleaded guilty, so the convictions are established. The **161 uncharged crimes** were **admitted, not
  convicted**; the card says "ADMITTED 161 UNCHARGED CRIMES".
- The affidavit's door-handle result (a mixed sample whose main contributor matched a crime-scene profile) is not
  characterised in the narration; the **conclusive** match is attributed to the tissue, as the warrant says ("Per the
  search warrant" on screen).

## Fun facts (pop-ups; each with two or more sources)

1. **GS_cop: he was still a police officer when the crimes began (1973-1979).** Sources: AP via ADN; Yahoo News (wire
   report); CBS Sacramento; BreakingNews.ie for the 1975 start. Pop-up in s07, sparkle on "police". The narration adds
   the firing in 1979 (GS_fired) as a stamp and label.
2. **GS_ballroom: the plea hearing was held in a university ballroom, for COVID distancing.** Sacramento State's ballroom
   was used as a makeshift courtroom to allow social distancing for a crowd of nearly 200. Sources: The State Hornet;
   CBC News; PBS NewsHour/AP (dossier G22). Pop-up in s11, sparkle on the line "at a hearing held in a university
   ballroom". The room is drawn as a generic hearing room with chandeliers and spaced chairs, tagged "GENERIC ROOM".

Verified but cut for length (BTK word budget), so their claims were removed from `episode.json`:
- **The wrong man in Oregon (2017).** In March 2017 an earlier genetic lead (YSearch, a different public database) got
  a judge to order a DNA sample from a 73-year-old Oregon man in a nursing home; he was not the killer. Sources: AP via
  KTVU (2018-04-28); ABC30; NBC News (mostly AP's review of court records). He would never have been named or shown.
- **"His case made genetic genealogy a standard cold-case tool."** Family Tree Magazine and Fox News say "hundreds" of
  cold cases since 2018 (no official count; estimates range from 200+ to 1,000+); CNN (Aug 2018) on the sharp increase.
- **The privacy debate.** AP: GEDmatch's co-founder said police use of the site was "without our knowledge" and raised
  privacy concerns echoed by civil-liberties groups; GEDmatch also said it had always told users the data could be used
  for other purposes; the lead investigator said no court order was needed (also Fox News, PBS). Not narrated; the
  GS_upload claim records "without its knowledge" neutrally.

## Next case tease (GS_next)

The Great Train Robbery, 8 Aug 1963: about £2.6 million stolen from a Royal Mail train; fingerprints found on a Monopoly
board (and a ketchup bottle) at the gang's Leatherslade Farm hideout helped lead police to them. Sources: British
Transport Police history page; Smithsonian; Family Tree (UK); Yahoo News. Narration: "Next: the Great Train Robbery, and
a Monopoly board." Card: "£2.6 million. A mail train. / And a Monopoly board." **Not used:** "Britain's biggest
robbery" (no extract stated it explicitly; the Postal Museum extract says only that the amount "stunned the nation"),
"undone by Monopoly" (the board was one of several leads), and the "played with real money" story (reputed). Re-verify
in the Great Train Robbery episode.

## Myths and claims NOT used

- **"His DNA was discarded on the car door handle."** The handle was swabbed (touch DNA); only the tissue was discarded.
- **"13 rape counts"** (some AP/NPR copy). The official release says 13 counts of kidnapping to commit robbery.
- **Victim counts from different bases** (AP "87 victims at 53 crime scenes in 11 counties" vs the official "161
  uncharged crimes / 61 victims"). Not mixed; only "13 murders" is narrated, and "161 uncharged crimes" is on a card.
- **Which databases were used.** 2018 coverage: GEDmatch. Later reporting (LA Times, ~2020, seen only second-hand) says
  FamilyTreeDNA and MyHeritage were also used. The narration names only GEDmatch, as in the 2018 public account.
- **"Forty years"** (suggested hook). The crimes began in 1975 and the arrest was in 2018 (43 years), but DNA profiles
  only existed for part of that time, so the hook says "For decades".
- **"Decades of hiding."** He lived openly under his own name, so the callback says "Decades without a name".
- **The Visalia Ransacker link, the "roast in the oven" remark, the store brand, the arrest time of day.** Not needed
  or not verified twice. The arrest is drawn in late-afternoon light (a neighbour reported commotion around 4 p.m.;
  booking was overnight), not as a dawn raid.
- **Names of investigators and the genealogist** (Paul Holes, Barbara Rae-Venter). Not named or depicted, per the brief.

## Pronunciation (offline ASR check, 2026-10-11)

- "DeAngelo" → spoken "Dee-Anjuh-lo" (Piper phonemes d-iː-ˈæ-n-dʒ-ʌ-l-oʊ, close to the reported "dee-AN-juh-loh"; Piper's
  default read "də-an-JEE-lo"). Captions keep "DeAngelo".
- "GEDmatch" → spoken "G E D match" (letters confirmed in the phonemes; the small recogniser hears "J.I.D. match").
- Years are spoken by the pipeline's year rule ("nineteen seventy five", "twenty eighteen"); ASR confirmed 1975, 1986,
  1979, 2018, 2020, "13 murders" and "eleven". No currency is spoken (the £2.6 million appears only on the card).
- Line starts that the recogniser clipped were reworded: "Dozens of crimes..." → "He committed dozens of crimes...",
  "fired in 1979..." → "He was fired in 1979...", "It didn't find him." → "It didn't find the killer.", and the
  callback was made one line ("Decades without a name, ended by...").

## Ethics decisions

- **Crimes:** summarised only ("dozens of crimes, including 13 murders"). The word "rape" appears in no narration or
  on-screen text; nothing is described or depicted. No house is shown being entered; the 1970s street is empty except
  for an anonymous silhouette walking on a public pavement.
- **Victims, survivors and families:** never named, shown or implied.
- **DeAngelo:** only an anonymous rim-lit silhouette (`characters/figures/gs10_man.json`, `real_person: true`), tagged
  "ILLUSTRATION · NOT A LIKENESS". No face, no photo reference, no wheelchair (as reported at the plea). In the 1970s shot
  a generic cap stands for his police years; the patrol car has no markings, badge or department name.
- **Investigators, genealogist, scientist, judge:** generic characters (`detective`, `agent_a`, `agent_b`, `analyst`,
  `examiner`, `scientist`, `judge`, `official`); the judge and court official are silhouettes. None represents a real person.
- **No imitation** of the warrant, the DA release, GEDmatch's website or logo, a store's branding, police badges or court
  records. Cards are the series' own typed graphics; the vial and evidence bag carry our own labels.
- **Tone:** the fun facts are investigative (the ex-officer, a ballroom hearing during COVID), never about the crimes.

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
- AP via KTVU (wrong man, 2017): https://www.ktvu.com/news/search-for-golden-state-killer-led-to-wrong-man-in-2017
- AP via ADN: https://www.adn.com/nation-world/2018/04/25/suspect-in-golden-state-killer-case-an-ex-police-officer-is-arrested-after-decades/
- Yahoo News: https://news.yahoo.com/california-man-arrested-golden-state-killer-case-suspected-195117631.html
- CBS Sacramento: https://www.cbsnews.com/sacramento/news/citrus-heights-arrest-search/
- Truthdig: https://www.truthdig.com/?p=168955
- 10News/Scripps: https://www.10news.com/news/national/golden-state-killer-dna-that-led-to-suspects-arrest-was-collect-from-his-car-while-he-shopped
- AP via WFTV: https://www.wftv.com/news/trending-now/affidavit-golden-state-killer-suspects-dna-obtained-while-he-shopped-at-hobby-lobby/762734958
- The Daily World: https://thedailyworld.com/?p=19252
- ABC News (tissue): https://abcnews.com/US/dna-tissue-alleged-golden-state-killers-trash-led/story?id=55602892
- The Daily Beast: https://www.thedailybeast.com/golden-state-killer-arrested-according-to-co-author-of-ill-be-gone-in-the-dark
- Cut for length (not cited in `episode.json`): ABC30 https://abc30.com/post/dna-mistake-pegged-oregon-man-as-golden-state-killer/3409391/ ·
  Family Tree Magazine https://familytreemagazine.com/dna/investigative-genetic-genealogy · Fox News (hundreds of cases)
  https://foxnews.com/us/cold-cases-cracked-experts-solving-hundreds-violent-crime-mysteries-decades-no-answers.print ·
  Fox News (privacy) https://www.foxnews.com/tech/dna-link-to-golden-state-killer-raises-questions-of-privacy-versus-safety
- British Transport Police (GTR): https://www.btp.police.uk/police-forces/british-transport-police/areas/campaigns/our-history/crime-history/great-train-robbery/
- Smithsonian (GTR): https://www.smithsonianmag.com/history/big-mystery-behind-great-train-robbery-may-finally-have-been-solved-180952054/
