# Case File 20: the Boston Strangler, 40-second cut. Research ledger

Episode: `tcv20-boston-strangler-40` · "A Water Bottle and the Boston Strangler #Shorts" (series.json title)
Ledger date: **2026-10-12**. Legal status verified on 2026-10-12 (`legal_status_verified` = 2026-10-12).
This is a short cut of Case File 16. **The full research ledger is `episodes/tcv16-boston-strangler/research.md`**
(sources, myths, ethics decisions). This file lists only what the cut uses and what was checked again for it.

## Method and limits

- Built from the Case File 16 ledger (13 web searches on 2026-10-12). For this cut, 2 more searches ("standard" mode) on
  2026-10-12 tried to date the collection of the water bottle. WebFetch and curl are blocked from the build environment,
  so every source is a **search-result extract** (title, URL, summary text). No full article, court record or official
  release was read in full.
- Result of the extra searches: the extracts confirm that detectives followed DeSalvo's male relatives until one nephew,
  who was not named at the 11 July 2013 news conference, threw away a water bottle that an officer took. **No extract
  gives the date the bottle was collected.** The narration therefore says "Decades later" for the tail and does not
  narrate a year for the bottle; the on-screen cards date only what the sources date: the familial match ("ANNOUNCED
  JULY 2013") and the exhumation ("JULY 2013 · EXHUMATION", "OFFICIALS · 19 JULY 2013").
- No quote, date, ruling or source was invented. The only words quoted on screen are "leaves no doubt" (Attorney General
  Martha Coakley, 19 July 2013, as reported by NBC News, the Bangor Daily News (AP) and the Inquirer).

## Status (closed historical case)

- Albert DeSalvo confessed in 1965 but was **never tried** for any of the Strangler killings. He was killed in prison in 1973.
- In July 2013 officials announced that DNA linked DeSalvo to the January 1964 murder of **Mary Sullivan** (19): first a
  familial match from a nephew's discarded water bottle (11 July), then his own DNA from his exhumed remains (19 July).
  That link concerns **her case only**; whether he committed all thirteen killings is still debated.
- No newer development was found on 2026-10-12.

## Narration and the claims behind it (all reused from Case File 16, each with 2+ sources)

| Scene | Narration | Claims |
|---|---|---|
| s01_hook | A man confessed to being the Boston Strangler. / For decades, many doubted him. | B_confess, B_doubt |
| s02_city | From 1962 to 1964, thirteen women were killed around Boston. | B_killed |
| s03_never | That man, Albert DeSalvo, was never tried for them. | B_confess, B_never |
| s04_follow | Decades later, detectives secretly followed one of his nephews. / He threw away a water bottle. They took it. | B_follow |
| s05_match | Its DNA was a familial match to evidence from Mary Sullivan's case. | B_familial, B_mary |
| s06_exhume | To be sure, they exhumed DeSalvo's remains. / Officials said it left no doubt he killed Mary Sullivan. | B_exhume |
| s07_only | But it links him to her murder only. / Whether he killed all thirteen is still debated. | B_only, B_family_dispute |
| s08_end | For Mary Sullivan's family, the answer started with a thrown-away water bottle. | B_justice, B_follow, B_killed, B_next |

Notes on wording:
- **Hook headline** (burned in, first 2.8 s): "A THROWN-AWAY WATER BOTTLE / AND THE BOSTON STRANGLER". It claims no result:
  never "named", "caught" or "solved".
- **"Decades later"** (s04): the collection date was not found; the bottle was taken some time before the match was
  announced on 11 July 2013, almost fifty years after 1964.
- **"one of his nephews"** (s04): the sources say detectives followed male relatives until one nephew discarded a bottle.
  He is not named in the narration, on screen or in this ledger, and is drawn only as a small anonymous silhouette.
- **"Officials said it left no doubt he killed Mary Sullivan"** (s06): attributed. Coakley said the result "leaves no
  doubt" that DeSalvo was responsible for Mary Sullivan's murder.
- **The accuracy line** (s07, mandatory): "But it links him to her murder only. Whether he killed all thirteen is still
  debated." Cards say "MARY SULLIVAN'S MURDER · ONLY" and "ALL THIRTEEN? STILL DEBATED", plus "His family disputed the
  result" (B_family_dispute).
- **The callback** (s08): "the answer started with a thrown-away water bottle" rests on B_justice (her nephew Casey
  Sherman called the result "full justice for my aunt"; DA Dan Conley said questions Mary's family had asked for almost 50
  years had been answered) and B_follow (the bottle began the chain). It does not say the bottle alone proved anything.
- **NEXT CASE card** (s08, on screen only, no narration): "A family's trash and the Idaho killer" (B_next: Kohberger,
  who pleaded guilty in July 2025 and was sentenced to four consecutive life terms).

## Fun facts

- None in this cut (the 40-second rules allow at most one, and the fun facts of Case File 16 would slow the pace).

## Myths and claims NOT used (see the Case File 16 ledger for the full list)

- "DNA proved DeSalvo was the Boston Strangler" / "a water bottle caught the Boston Strangler": false as general
  statements. The DNA links him to Mary Sullivan's murder only, and the narration says so.
- "In 2013, detectives followed his nephew": the year of the collection is not in any extract, so it is not narrated
  (2013 appears only on the match and exhumation cards, which the sources date).
- The nephew's name: reported by some outlets (single-sourced in our extracts); deliberately not used or recorded.
- Coakley's view that he was "most likely" responsible for the others: opinion, not used.

## Ethics decisions (unchanged from Case File 16)

- **Victims:** never depicted; no method or detail. Mary Sullivan is named respectfully because the DNA result concerns
  her case and her family welcomed it. The end shot carries a one-line memorial: "IN MEMORY OF THE 13 WOMEN".
- **DeSalvo:** an anonymous rim-lit silhouette only (`bs16_desalvo`, real_person: true, "not a likeness"); every shot he
  appears in is tagged ILLUSTRATION · NOT A LIKENESS.
- **The nephew:** did nothing wrong; never named; a small generic silhouette on a generic street.
- **Places and objects:** generic streets, lab, office, press room and a wide dawn cemetery (no coffin or remains). The
  bottle is a plain generic bottle. No police, court, DA or newspaper material, logo or real document is imitated.
- **Fairness:** the accuracy limit is narrated, and the DeSalvo family's dispute is on screen.

## Sources used by this cut (search-result extracts, 2026-10-12)

All are listed with full titles in `episode.json` and in the Case File 16 ledger: Fox17 (AP) 2013-07-11; NBC News
(two reports, July 2013); CS Monitor 2013-07-11; Fox News 2013-07; Suffolk County DA archive 2013-07-19; Bangor Daily
News (AP) 2013-07-19; CBS Boston 2013-07; Philadelphia Inquirer (AP) 2013-07-21; WBUR 2013-07-19; AJC (AP) 2013-07;
KPBS (NPR) 2013-07-11; Biography.com; Yahoo (TV Insider), two reports, 2023; EBSCO Research Starters; Wikipedia "Boston
Strangler"; BU Bostonia 2017; Bloody Disgusting; and, for the NEXT CASE card, WFMZ, NBC News, UPI, Straight Arrow News
and FOX 13 Seattle. Extra search extracts seen for this cut (not cited as claim sources): Bangor Daily News (AP)
2013-07-12 "DNA ties dead suspect to Boston Strangler case"; Philadelphia Inquirer (AP) 2013-07-12 "DNA links DeSalvo
to 'Strangler' victim"; WBUR 2013-07-11 and 2013-07-12; Daily Monitor (Uganda, CNN-sourced) "DNA solves murder after
50 years".
