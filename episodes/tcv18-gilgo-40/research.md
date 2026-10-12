# Case File 18 (40-second cut of Case File 07): Gilgo Beach. Research ledger

Episode: `tcv18-gilgo-40` · "This Pizza Crust Helped Catch a Serial Killer" · format `short40` (target 38-45 s).
Ledger date: **2026-10-12**. Legal status as verified on **2026-10-11** in the Case File 07 ledger
(`legal_status_verified` = 2026-10-11): pleaded guilty 8 Apr 2026, sentenced 17 Jun 2026, appeal waived.

Full ledger, with every source, conflict and rejected claim: **`episodes/tcv07-gilgo-beach/research.md`**.
This cut makes no new factual claim. It reuses Case File 07's claims and sources word for word (a subset of them).

## Method and limits

- No new web searches were run for this cut. The Case File 07 searches (9, "standard" mode, 2026-10-11) were
  search-result extracts only: WebFetch and curl were blocked, so full articles were not read.
- Every narrated line maps to a Case File 07 claim with at least two sources (listed below and in `episode.json`).

## Script and claims used

| Scene | Narration | Claim(s) | Nature |
|---|---|---|---|
| s01 | This pizza crust, tossed in a Manhattan trash can, helped catch the Gilgo Beach killer. | G_pizza, G_plea | allegation (attributed on screen: "As described in a 2023 court filing") + fact |
| s02 | For over a decade, the case went cold. | G_cold | fact (first remains Dec 2010; first charge July 2023) |
| s03 | Prosecutors said a truck a witness saw led a 2022 task force to him. | G_task, G_truck, G_name | fact + allegation (2023 filing) |
| s04 | Then, they said, burner phones that called victims pinged near his office. | G_phones, G_name | allegation (2023 filing) |
| s05 | Investigators watched him. / In January 2023, he tossed a pizza box into a trash can. (Screen: "FIFTH AVENUE · JAN 2023".) | G_surveil, G_pizza | fact + allegation (2023 filing) |
| s06 | Prosecutors said the crust's DNA linked him to a hair found with a victim. | G_pizza, G_dna | allegation (2023 filing) |
| s07 | That July, he was arrested. | G_arrest | fact (13 July 2023) |
| s08 | In 2026, he pleaded guilty to seven murders and admitted an eighth. / Life without parole. | G_plea, G_sentence, G_names | fact |
| s09 | He threw that pizza box away. / Investigators were waiting. | G_pizza, G_surveil | allegation + fact |

Sources (as in Case File 07): CBS News (pizza crust; "Avalanche of evidence"), NBC New York (pizza crust; "How was
the Gilgo Beach killer caught?"), Fox News (pizza box), WJLA/Sinclair, KSL (CNN), AP via AOL, CNN timeline 2024-01-15,
Boston Globe/AP timeline 2026-04-08, CNN plea 2026-04-11, NewsNation, The Hill, CNN sentencing 2026-06-17, Suffolk
County DA release, CBS New York, PBS NewsHour.

## Wording decisions

- **"Helped catch", never "caught".** The headline is "THIS PIZZA CRUST / HELPED CATCH A SERIAL KILLER". The crust was
  one strand of the evidence (with the truck and the phone records); the arrest followed about a month after the lab result.
- **"A DNA link", never a "match" or "nuclear DNA".** The crust gave a mitochondrial result: he "cannot be excluded" as
  the source of a hair found with Megan Waterman. The card says "A DNA LINK · TO A HAIR FOUND WITH A VICTIM ·
  MITOCHONDRIAL: HE 'CANNOT BE EXCLUDED'". The quoted words are the ones the CBS extract attributes to the 2023 filing.
- **The truck.** "A truck a witness saw led a 2022 task force to him" keeps the 07 framing ("led ... to"): the filing
  says a witness saw a first-generation Chevrolet Avalanche in 2010 and investigators found he had owned one.
- **"Life without parole."** He received three consecutive life-without-parole terms plus four consecutive 25-to-life terms.
- **"Investigators were waiting."** He had been under surveillance for more than a year; the filing says a surveillance
  team recovered the box.
- Attribution: "prosecutors said" opens the clue chain (s03), "they said" carries it (s04), and the reveal repeats it
  (s06). Cards say "PROSECUTORS' 2023 FILING".

## Fun facts

None. The 40-second format allows at most one; it was left out to keep the pace. (Case File 07's two fun facts, the
six-week identification and the 2025 whole-genome DNA ruling, are not used here.)

## Myths and claims NOT used

As in the Case File 07 ledger: no "DNA match", no "nuclear DNA from the crust", no "proven at trial", no other deaths
attributed to him, no family statements or quotes, no taunting calls, no online searches.

## Ethics decisions

- The defendant is only an anonymous rim-lit silhouette (`gb7_suit`), tagged "ILLUSTRATION · ANONYMOUS FIGURE". He is
  named once, on a typed card, not in the narration.
- His wife and children were never charged: never depicted, named or implied. No home is shown.
- The victims are never depicted; no remains, no crime scene. A single line on screen at the sentence: "IN MEMORY OF
  THE EIGHT WOMEN" (no names, photographs, ages or occupations in this cut).
- The dune road is a generic empty road, tagged "GENERIC ROAD, NOT A CRIME SCENE". The street, car, office, lab and
  courtroom are generic. The pizza box is a plain box with no brand or text. The viewfinder brackets in the last shot are
  a generic graphic, not police material.
- No dialogue is invented; only the narrator speaks.
