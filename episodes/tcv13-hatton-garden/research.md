# Case File 13: the Hatton Garden safe deposit burglary (London, Easter 2015). Research ledger

Episode: `tcv13-hatton-garden` · "Thieves Drilled Into a London Vault Over Easter. The Ringleader Was 76."
Ledger date: **2026-10-11** (`legal_status_verified` = 2026-10-11).
Base dossier: `series/true-crime/research_next_slate/heists_and_mysteries.md`, section 3 (verified 2026-10-11; sources [HG1]-[HG31]).

## Method and limits

- 15 web searches on 2026-10-11 ("standard" mode), on top of the dossier. WebFetch and curl are blocked from the build
  environment, so every source is a **search-result extract** (title, URL, summary text). No full article, judgment or
  court record was read. Dates come from the URL or the extract; otherwise "n.d." in `episode.json`.
- Wikipedia, BuzzFeed-style explainers and jeweller blogs were used only as pointers or corroboration. BuzzFeed News is
  always paired with a newspaper or broadcaster in the claims it supports.
- No quote, date, figure or source was invented. The only quoted words on screen are the prosecution's "the largest
  burglary in English legal history" (Fox News/AP, VOA, ITV) and the nickname 'Basil'.
- **Legal status (2026-10-11):** all convictions are final. Four ringleaders pleaded guilty in 2015. Wood, Lincoln and
  Doyle were convicted at trial on 14 Jan 2016, and one defendant was acquitted. Sentences followed in March 2016.
  Michael Seed ("Basil") was convicted in March 2019. Confiscation orders followed in 2018 and 2020. Brian Reader died in
  September 2023 (reported April 2024), and Terry Perkins died in 2018. Nothing found changes the episode.
- **Structure (producer update, after the BTK "floppy disk" model):**
  - The hook gives the setup and the mystery, not the answer: "Over one Easter weekend, a gang of thieves drilled through
    a vault wall in London. / The ringleader was 76."
  - The payoff (the car, the bug, the pub recordings) lands at about 60-66% of the runtime.
  - The hero object (the three drilled holes) fills the first frame and the last frame.
  - The ending is a callback: "One of Britain's biggest burglaries, / undone by a car, and a chat in the pub."
  - 183 words; 13 scenes; 76.9 s.

## Established facts (stated as fact in the narration or on screen)

| Claim | Fact | Where it is used | Sources |
|---|---|---|---|
| HG_easter | Easter bank holiday weekend 2015 (Thu 2 Apr night to Sun 5 Apr morning), Hatton Garden Safe Deposit, London's jewellery district. | "Over one Easter weekend..."; "The vault: in Hatton Garden, London's jewellery district." | NPR 2015-05-19; Channel 4 News 2015-05-19; KSL (AP) |
| HG_drill | A diamond-tipped industrial core drill bored three holes through the vault's concrete wall (reported as 50 cm / 20 in thick). | "...drilled through a vault wall"; "The tool: a diamond-tipped drill." The thickness is not given (see below). | Gulf News 2015-12-14 (prosecutors); Daily Mail 2015-04-23; JLC (police: diamond coring rig); NBC News (police: heavy-duty drill) |
| HG_reader76 | Brian Reader, described as the gang's leader ("the guv'nor", "mastermind"), was 76. | "The ringleader was 76." | Fox News (AP: "76-year-old"); Malay Mail wire report (Reuters: "the oldest at 76"); ITV 2015-11-24; ITV "Dad's Army" piece |
| HG_largest | Prosecutor Philip Evans QC called it "the largest burglary in English legal history" (Woolwich Crown Court, Nov 2015). | On screen only, as a quote card attributed to the prosecution. The callback line says "One of Britain's biggest burglaries". | Fox News (AP); VOA; ITV 2015-11-23; ITV 2016-01-14 |
| HG_alarm | At 00:21 on Good Friday (3 Apr 2015) an alarm-monitoring company's call reached the Met. It was graded as needing no police response, so no officers were sent; a security guard attended. | "The alarm went off. / The police never came." | Police Professional; City A.M.; MayorWatch; KSL (AP) |
| HG_apology | The Met said its call-handling procedures "were not followed" and apologised that officers were not sent. | "The Met later apologised." | Police Professional; MayorWatch; KSL (AP); Car Dealer Magazine and Channel 4 News per dossier [HG9] |
| HG_cabinet | Night one: they drilled through, hit a metal cabinet on the far side that was bolted to the floor, and left empty-handed after several hours. | "But a bolted-down metal cabinet blocked the holes." | ITV 2015-11-24; NPR (via WGBH) 2015-12-01 |
| HG_return | They came back on the Saturday night (4 Apr) with new equipment, dislodged the cabinet and got into the vault. | "Two nights later, the others came back and got through." | NPR (via WGBH) 2015-12-01; NPR 2015-05-19 (dates) |
| HG_boxes | More than 70 boxes were broken into (reports say 72 or 73). | "They ransacked more than 70 safe deposit boxes." | KSL (AP, 72); Fox News (AP, 73); VOA |
| HG_value | Prosecutors put the haul at about £14 million. | On screen only: "HAUL: ABOUT £14 MILLION · THE PROSECUTION'S FIGURE". | Fox News (AP); VOA; Fox News 2019 |
| HG_cctv | Detectives trawling CCTV (BuzzFeed: about 150 cameras) spotted a distinctive white Mercedes E-class with a black roof, parked near the vault. It belonged to the gang's driver, John "Kenny" Collins. | "Detectives scoured CCTV. / One car stood out: a white Mercedes, black roof." | BuzzFeed News; Scottish Daily Mail 2016-01-15; Crime+Investigation ("pinpointed one of their vehicles using CCTV") |
| HG_bugged | Police bugged Collins's Mercedes and Terry Perkins's car. | "Officers secretly bugged it." | BuzzFeed News; Scottish Daily Mail 2016-01-15; Crime+Investigation |
| HG_pub | Police observed and recorded the men at the Castle pub in Islington. Per the police account (NPR), "after a few pints" they became "more and more boastful". | "Officers recorded them in a pub. / After a few pints, police said, they got boastful." The pub is not named or replicated. | NPR 2016-01-14; BuzzFeed News trial report (Castle pub, Pentonville Road); ITV 2016-03-09 |
| HG_pleas | Reader, Collins, Daniel Jones and Terry Perkins pleaded guilty to conspiracy to commit burglary (2015). | "Four ringleaders pleaded guilty." | NPR 2016-01-14; ITV 2016-01-14; ITV 2016-03-09 |
| HG_trial | On 14 Jan 2016, Carl Wood, William Lincoln and Hugh Doyle were convicted at Woolwich Crown Court. One defendant was acquitted; he is not named or shown. | "Three more were convicted." Card: "JAN 2016 · 3 MORE CONVICTED AT TRIAL". | NPR 2016-01-14; ITV 2016-01-14; The Courier (PA) |
| HG_reader_died | Reader died in September 2023, aged 84, at home in Dartford; his death was reported in April 2024. | "The ringleader died in 2023." Card: "BRIAN READER · DIED SEPTEMBER 2023, AGED 84". | LBC; Kent Online; NationalWorld |
| HG_callback | Summary of the claims above. It adds no new fact. | "One of Britain's biggest burglaries, / undone by a car, and a chat in the pub." | Fox News (AP); ITV 2016-01-14; BuzzFeed News; NPR 2016-01-14 |
| HG_next | Next-episode tease: in Nov 2006 Alexander Litvinenko drank tea laced with polonium-210 at a London hotel, and investigators traced radioactive contamination across London. | "Next: a cup of tea that left a radioactive trail across London." | Chemistry World; The Moscow Times; VOA |

## Attributed claims (the prosecution case, as reported at trial)

- **HG_buspass:** prosecutors said Reader travelled to Hatton Garden by bus on a free older person's travel pass (a
  Freedom Pass). The sources disagree on whose pass it was:
  - Fox News (AP) says it was in another man's name (T. McCarthy).
  - ITV calls it "his Oyster Freedom Pass".
  - The Camden New Journal (a report on a book) says "a borrowed Freedom Pass".
  - So the narration says only "a pensioner's free pass", attributed to prosecutors.
- **HG_quit:** prosecutors said Reader quit after the first night and did not come back.
  - ITV 2015-11-24: "'Mastermind'... 'quit on first night'".
  - NPR via WGBH: Reader "backed out after the gang ran into difficulties".
  - Narration: "Prosecutors said the ringleader quit that night." The on-screen label adds "According to the prosecution".

## Fun facts (each with two or more reputable sources)

1. **FUN FACT 1 (HG_buspass): prosecutors said the 76-year-old ringleader took the bus to the job, on a pensioner's free
   pass.**
   - Sources: Fox News (AP), "Prosecutors: London jewel theft suspect used free senior citizens bus pass to get to
     heist"; ITV "Dad's Army masterminds" (he used an Oyster Freedom Pass to travel by public transport from Dartford);
     Camden New Journal (two buses, a borrowed Freedom Pass). The Malay Mail wire report (dossier [HG7]) adds that his
     Oyster card showed his journeys.
   - Narration: "Fun fact: prosecutors said he took the bus there, on a pensioner's free pass."
2. **FUN FACT 2 (HG_basil): "Basil", the man who got them inside, stayed free for about three years.**
   - Seed evaded capture until police raided his Islington flat in March 2018. He was convicted in March 2019 and jailed
     for 10 years. Police said he was responsible for getting into the premises and disabling security.
   - Sources: Fox News 2019; Westminster Extra; The Daily Telegraph 2019-03-16 ("Unmasked, Basil the mystery Hatton
     Garden raider"); QEB Hollis Whiteman.
   - Older "Basil is still unknown" lines are out of date and were not used.
3. **Closing beat, not styled as a fun fact (HG_unrecovered): much of the loot was never recovered.**
   - Sources: Kent Online (only about £4m recovered); BuzzFeed News trial report (about £9m "still unaccounted for");
     Police Professional and Benchpeg (2018: a large amount of cash, loose stones and bullion still outstanding); NPR
     2015-05-19 per the dossier (£4.3m recovered).
   - The current total is not verified, so the narration gives no figure: "Much of the loot was never recovered."
   - It is a sober card, not a FUN FACT pop-up with a sparkle, because these were people's savings and stock.

## Myths and claims NOT used

- **The gang's combined or average age.** The sources disagree because they count different people at different times:
  about 500 (Reuters), 533 (at the arrests), 448 (ITV at sentencing), and 275 for four men (Daily Mail).
- **"A gang of pensioners" as a flat statement, and the suggested hook "Police expected professionals. They found
  pensioners."**
  - The four ringleaders were 60 to 76; other members were in their late 40s and 50s.
  - No source describes what police "expected".
  - The hook says instead: "a gang of thieves ... The ringleader was 76."
- **"Caught by number-plate cameras (ANPR)".**
  - The reported route is CCTV plus a congestion-charge database lookup of the plate, which is BuzzFeed only.
  - ANPR appears in the ITV drama, not in the trial reports.
- **The lift shaft.** Only one extract (NBC News, quoting a police statement) mentions it. It is not narrated or drawn.
- **The Flying Squad by name.** In the extracts seen, only BuzzFeed and Wikipedia name it.
- **Values of £20m, £25m, £60m or £200m.** Only the prosecution's figure, about £14 million, appears on screen.
- **"73 boxes".** Both 72 and 73 are reported, so the episode says "more than 70".
- **The wall thickness in figures.** Prosecutors said 50 cm, but NBC quoted police as saying 2 metres.
- **The drill's brand.** It is neither named nor drawn; the drill is generic and unbranded.
- **The "pension pot" quote and the "biggest cash robbery" boast.** One is single-source; the other is attributed to
  different men by different outlets.
- **Reader's "£200m career earnings" (LBC/Kent Online).** UNVERIFIED.
- **Speculation about hidden loot held by named living men.**

## Ethics decisions

- **Real people.**
  - Reader is named once on screen and once in narration ("the ringleader"). The case is closed, he was convicted, and
    he has died. He appears as an illustrated generic older man (`hg13_reader`, `real_person: true`), tagged
    'ILLUSTRATION · NOT A LIKENESS'.
  - The other gang members appear as generic older men in hi-vis or plain clothes (`hg13_crew_a`, `hg13_crew_b`,
    `hg13_driver`, all `real_person: true` with "not a likeness" depictions). None is named on screen.
  - "Basil" is an anonymous silhouette in a doorway (`hg13_basil`).
  - No one is caricatured. Early stills showed two crew members' gestures meeting like a high five in the vault; they
    were re-staged so the men work apart and no celebration is shown.
- **The acquitted defendant** is never named, shown or alluded to beyond the count of convictions.
- **Non-violent, not glamorised.**
  - The break-in is a plain reconstruction.
  - The ending states the losses without a fun-fact flourish.
  - The card about Reader's death appears only after the investigator has left the frame, so no one on screen can be
    mistaken for him.
- **No real branding or documents.**
  - The jewellers' fronts carry generic words only. The bus, van and Mercedes have no logos or badges.
  - The CCTV grid, call log and court cards are the series' own typed graphics, and no real CCTV still is imitated.
  - The pub is a generic London pub, not a replica of the Castle.
  - The microphone badge is a graphic, not a claim about where any device was placed.
- **Pronunciation and wording, after tests with the offline speech recogniser:**
  - "CCTV" is spoken as "C C T V".
  - "jewellery" is spoken as "jewelry", because Piper garbled the British spelling ("Jewel Rec").
  - "trawled" became "scoured", because it was misheard as "Strold".
  - "thieves drilled" became "a gang of thieves drilled".
  - "Police bugged it." became "Officers secretly bugged it.", and "Police didn't come." became "The police never
    came.", because short lines starting with "Police" were misheard as "Please".
  - The haul figure is shown on screen only, so no currency symbol is ever spoken. Years are spoken by the engine's year
    rule.
