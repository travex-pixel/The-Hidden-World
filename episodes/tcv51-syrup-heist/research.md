# Case File 51: The Great Canadian Maple Syrup Heist (tcv51-syrup-heist)

Research ledger, 2026-10-15 (all accesses on this date).

## Method and limits
- 12 standard web searches. WebFetch and curl are blocked in this environment, so every source below is cited from **search-result extracts only**; no full page was read (including the Supreme Court of Canada decision and the Agriculture and Agri-Food Canada report).
- Where the extracts disagree, the narration uses the narrowest wording all of them support, and the disagreement is recorded below.
- No paid APIs. Nature column: **fact** = reported consistently by independent outlets or an official record; **reported** = an account attributed to one party; **alleged** = not used.

## Corrections to the brief
- **How it was discovered:** the brief said the inspector "found a barrel that was water". The sources say the barrel he was climbing on was **empty** (Mental Floss: it nearly tipped over; Wikipedia, citing Businessweek: he nearly fell, expecting 600-lb barrels and finding them empty); barrels that **looked full** were then found to hold water. Narration: "And the barrel under him? Empty."
- **Quantity:** "about 3,000 tonnes / 2.7 million kg" are two different reports (Wikipedia: nearly 3,000 tonnes; Canadian Encyclopedia: about 2,700 tonnes; CP24: 2.7 million kg). Neither weight is spoken; the label says "NEARLY 10,000 BARRELS EMPTIED".
- **Fine:** "about C$9 million" holds: C$9.4 million at sentencing (2017), cut to about C$1 million on appeal, restored by the Supreme Court of Canada on 31 March 2022 at about C$9.17 million. Narration: "And a fine of over 9 million dollars."
- **Quebec's share of world syrup:** no source states Quebec's share of WORLD output directly (the "~70 %" figure appears only in an undated article). The official figures are Canada's share of the world (>75 % in 2025, 73 % in 2024) and Quebec's share of Canada (90 %). The counter uses those published numbers, not a multiplied estimate.
- **Map:** not used (48+ rule: no map before 10 s; the north_america.json bbox, lon -130..-60 / lat 22..55, does cover Saint-Louis-de-Blandford at about -72.0, 46.3 if one is wanted later). The town is named on a label, never spoken; the recogniser garbled it ("St. Louis deBlanc for Quebec") and "Quebec" alone was heard correctly.

## Claims ledger
| # | Claim | Nature | Used as | Sources (accessed 2026-10-15) |
|---|---|---|---|---|
| H_value | Over several months in 2011-2012 thieves stole maple syrup valued at about C$18.7 million (also reported as "about $18 million"). | fact | Hook line ("They stole 18 million dollars of syrup."), headline "$18M", end card | Wikipedia https://en.wikipedia.org/wiki/Great_Canadian_Maple_Syrup_Heist ; CJAD (2016) https://cjad800.com/news/men-arrested-in-great-maple-syrup-heist-found-guilty-of-18-7-million-syrup-theft-1.2183735.html ; Mental Floss https://www.mentalfloss.com/article/63848/worlds-greatest-maple-syrup-heist ; CP24 (Dec 2012) https://www.cp24.com/news/slew-of-arrests-made-in-quebec-syrup-heist-1.1087540 ; The Canadian Encyclopedia https://thecanadianencyclopedia.ca/en/article/great-canadian-maple-syrup-heist |
| H_water | Emptied barrels were refilled with water, so the stock still looked full. | fact | s01 line 2 ("And the barrels still looked full."), headline "SWAPPED FOR WATER", s04 | Wikipedia; Mental Floss; Toronto Star (6 Oct 2013) https://www.pressreader.com/canada/toronto-star/20131006/281509338901276 ; CJAD |
| H_where | The syrup was the Federation of Quebec Maple Syrup Producers' reserve, in a rented warehouse in Saint-Louis-de-Blandford, Quebec. | fact | s02 label (not spoken) | Wikipedia; Bloomberg Businessweek (2 Jan 2013) https://brp-prod-bcc.bloomberg.com/news/articles/2013-01-02/the-great-canadian-maple-syrup-heist ; Mental Floss; Canadian Encyclopedia |
| H_reserve | The federation keeps a strategic reserve of maple syrup (the "Global Strategic Maple Syrup Reserve") to keep supply and prices stable. | fact | s02 line ("It was Quebec's strategic reserve of syrup."), **FUN FACT** card | Bloomberg Businessweek; Mental Floss; Wikipedia; CBC (2016) https://amp.cbc.ca/news/canada/montreal/maple-syrup-heist-quebec-canada-guilty-1.3848431 |
| H_night / H_span | Barrels were taken out at night (Toronto Star: over about ten months); police dated the theft from about August 2011 to July 2012. | fact | s03 line ("Slowly, at night, for almost a year."), label "AUGUST 2011 TO JULY 2012", date chip | Toronto Star; Mental Floss; Wikipedia; CNN (18 Dec 2012) https://edition.cnn.com/2012/12/18/world/americas/maple-syrup-heist ; Canadian Encyclopedia |
| H_shack | Barrels were trucked to a sugar shack, emptied, refilled with water (reported as stream or lake water) and returned; when the stream froze the operation moved, and later barrels were drained on site. | fact | s04 lines ("They drained the barrels at a sugar shack, / filled them with water, and brought them back.") | Wikipedia; Toronto Star; Canadian Encyclopedia |
| H_found | The inventory audit began on 30 July 2012 (Bloomberg; Wikipedia: July 2012); the inspector was climbing the stacked barrels. | fact | s05 line ("In 2012, an inspector climbed up the barrels."), date chip "JULY 2012" | Bloomberg Businessweek; Mental Floss; Wikipedia |
| H_empty | The barrel under him was empty (it nearly tipped / he nearly fell); barrels that looked full were found to hold water. | fact | s05 line ("And the barrel under him? Empty."), the single impact; the biggest reveal | Mental Floss; Wikipedia (citing Businessweek); CBC (2016) |
| H_barrels | About 9,600 barrels were emptied (CBC: 9,571; a student paper citing the Guardian: over 9,500; others: 9,600; a law newsletter: about 10,000), more than half the stockpile (CBC). | fact | label "NEARLY 10,000 BARRELS EMPTIED" | CBC (2016); CNN (2012); Wikipedia |
| H_sentence | Richard Vallieres, described as a ringleader, was found guilty of theft, fraud and trafficking (2016) and in 2017 sentenced to eight years in prison. | fact | s08 line ("The ringleader got eight years in prison."), card, date chip "2017" | CBC https://amp.cbc.ca/lite/story/1.4090811 ; CTV Montreal https://montreal.ctvnews.ca/maple-syrup-heist-mastermind-receives-8-yr-sentence-1.3390130 ; Reuters via Grainews (2022) https://www.grainews.ca/daily/top-court-affirms-hefty-fine-for-man-behind-quebec-maple-syrup-heist ; Wikipedia |
| H_fine | Fined about C$9.4 million (2017; six more years if unpaid); cut to about C$1 million by the Quebec Court of Appeal; on 31 March 2022 the Supreme Court of Canada restored a fine of C$9,171,397 (C$10 million less C$828,602 restitution), with 10 years to pay or six years in prison. | fact | last line ("And a fine of over 9 million dollars."), card | CBC (2017); SCC Case in Brief 39162 https://www.scc-csc.ca/judgments-jugements/cb/2022/39162/ ; CBC (2022) https://amp.cbc.ca/lite/story/1.6403757 ; Reuters via Grainews; Wikipedia |

**Disagreements recorded:**
- **Weight:** nearly 3,000 tonnes (Wikipedia) vs about 2,700 tonnes / 2.7 million kg (Canadian Encyclopedia, CP24) vs "six million pounds" (Mental Floss). Not used on screen.
- **Value:** C$18.7 million (Wikipedia, CJAD, Supreme Court coverage) vs "about $18 million" (CBC, CP24, Mental Floss) vs "$15-20 million" (one early report) vs an early estimate of $30 million (later revised down). Narration "18 million dollars"; card "$18M".
- **Barrels:** 9,571 / 9,600 / over 9,500 / about 10,000. Label "NEARLY 10,000".
- **Sentence:** eight years (CBC, CTV, Reuters); the Canadian Encyclopedia gives 7 years 10 months (likely after credit for time served). Narration "eight years".
- **Fine:** C$9.4 million (2017) vs about C$9.17 million (2022 Supreme Court). Narration "over 9 million dollars"; card gives both.
- **Discovery detail:** the barrel nearly tipped (Mental Floss) / the inspector nearly fell (Wikipedia citing Businessweek); the Businessweek extract itself did not show the wording. Narration only says the barrel under him was empty ("And the barrel under him? Empty.").
- **Recovered share:** about two-thirds (police) vs a quarter (another report). Not used.

## Statistic
| # | Statistic | Source and year | Used as |
|---|---|---|---|
| H_stat | Canada produced **more than 75 %** of the world's maple syrup in 2025 (about 73 % in 2024); **90.0 %** of Canadian production came from Quebec (90.7 % in 2024). | Agriculture and Agri-Food Canada, *Statistical overview of the Canadian maple industry, 2025* https://agriculture.canada.ca/en/sector/horticulture/reports/statistical-overview-canadian-maple-industry-2025 and *2024* https://agriculture.canada.ca/en/sector/horticulture/reports/statistical-overview-canadian-maple-industry-2024 ; Statistics Canada, The Daily (11 Dec 2025) https://www150.statcan.gc.ca/daily-quotidien/251211/dq251211f-eng.htm | COUNTER "OVER 75%" / "CANADA'S SHARE OF WORLD SYRUP", label "90% OF IT FROM QUEBEC", credit "Agriculture and Agri-Food Canada, 2025"; line "Canada makes over three quarters of the world's syrup." |

## Fun fact (card)
"QUEBEC KEEPS A STRATEGIC / RESERVE OF MAPLE SYRUP." Bloomberg Businessweek, Mental Floss, Wikipedia and CBC all describe the producers' strategic reserve. SUCCESs: simple, unexpected (a "strategic reserve" usually means oil), concrete, credible, and it is the story's setting.

## Lesson (checklist card with SAVE ribbon, captions off)
Spoken cue: "Buying second-hand online? Save these three red flags."
Rows: "WAY BELOW MARKET PRICE" / "NO RECEIPT OR SERIAL NO." / "WON'T MEET IN PUBLIC"; credit row "Winnipeg Police Service · ACT Policing (AFP)".
- Price far below normal: ACT Policing (Australian Federal Police), "Police advise online scooter buyers to beware" https://www.policenews.act.gov.au/node/12631 ("too good to be true"); UK police forces say the same (not cited on screen).
- No proof of purchase / no serial number: Winnipeg Police Service, via CTV Winnipeg https://winnipeg.ctvnews.ca/winnipeg-police-warn-about-shoplifted-items-ending-up-online-1.4309434 and CHVN https://chvnradio.com/articles/winnipeg-police-urge-shoppers-to-ask-questions-when-buying-second-hand (ask for a receipt photo; be wary if the seller cannot give a serial number or has no original packaging; ask where it came from).
- Meeting place: Winnipeg police flag a seller who wants to meet somewhere you are uncomfortable; ACT Policing, "Police urge vigilance when buying and selling goods online" https://www.policenews.act.gov.au/node/5726 , advises a busy, well-lit public place. (New Zealand Police add a different caution; not used.) Row 3 is the plain reading of both: a seller who will not meet in a public place is a red flag.
- Why it matters to the buyer (caption only): police can seize stolen goods and the buyer has no right to get them back or to a refund.

## Quotes
- None used. No dialogue is invented. Vallieres's trial claim that he was forced into the scheme by a man with a gun (CBC) is not used: one side's account, and the episode depicts no weapon.

## Myths and claims NOT used
- That the thieves used garden hoses for the whole theft: in one extract only (a federation spokesman); the hoses drawn are generic and the narration does not say "garden hoses".
- That it was "the largest theft in the history of the Sûreté du Québec": reported by prosecutors via one outlet only; not used.
- The exact number of people arrested or convicted: counts differ across reports; not used.
- The names of the inspector, the accomplices or the warehouse owner: not used.
- Quebec "makes 70 % of the world's syrup": undated, single source; replaced by the official Canada/Quebec figures.

## Ethics decisions
- Richard Vallieres (alive, sentence served or in progress) appears only as a faceless rim-lit silhouette tagged "ILLUSTRATION · NOT A LIKENESS" and is never named in narration (the slate and ledger name him for the record). Accomplices are faceless silhouettes; the inspector, workers, the officer, the producer and the buyer are generic figures, never named.
- No federation or police logo; the warehouse, dock, sugar shack, truck and sugar bush are generic illustrations; the barrels carry blank lot tags; the laptop listing is generic.
- The end question ("GENIUS OR STICKY FINGERS?") invites opinion about the scheme, not about anyone's guilt; the outcome (eight years and a fine of over 9 million dollars) is the last thing heard, so the episode does not glamorise the theft.
