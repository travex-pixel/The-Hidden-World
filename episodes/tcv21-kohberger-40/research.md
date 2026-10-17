# Case File 21: the University of Idaho killings, 40-second cut (Bryan Kohberger). Research ledger

Episode: `tcv21-kohberger-40` · "His Family's Trash Helped Catch the Idaho Killer" (a 40-second cut of Case File 17).
Ledger date: **2026-10-12**. Legal status verified on 2026-10-12 (`legal_status_verified` = 2026-10-12).
**Full ledger:** `episodes/tcv17-kohberger/research.md`. Every claim, source, myth and ethics decision there applies here.
This file lists only what the short cut uses and the one new check.

## Method and limits

- The claims and sources are reused from the Case File 17 builder (`series/true-crime-cinematic/slate/tcv17-kohberger.py`).
  The 40-second slate imports that builder and keeps only the claims it narrates or shows, so nothing is re-typed.
- 4 new web searches on 2026-10-12, all in "standard" mode: the June 2027 court dates (twice), a check for any later
  ruling, and how outlets describe the trash's role in the arrest. WebFetch and curl are blocked from the build
  environment, so every source is a **search-result extract** (title, URL and summary). Full articles were not read.
- "No ruling found" means the searches returned nothing newer. It does not prove that nothing happened.

## Hook headline (burned in for the first ~3 s): accuracy check

- Shown: **"HIS FAMILY'S TRASH" / "HELPED CATCH THE IDAHO KILLER"**.
- Why "helped catch" and not "led police to": the court filings say genetic genealogy gave the FBI the tip that pointed
  to him (K_igg). The trash came afterwards. Its DNA was found to come from the father of whoever left the sheath DNA
  (K_paternity), and the affidavit used that result, together with the car and the phone records, to support the arrest.
  CNN/AP coverage of the affidavit (6abc https://6abc.com/bryan-kohberger-update-idaho-murders-affidavit-court-documents-killer/12661256/ ;
  KTVZ https://ktvz.com/news/national-world/cnn-national/2023/01/05/key-takeaways-from-court-documents-in-case-against-bryan-kohberger-and-some-questions-that-remain/ )
  says investigators identified him through phone records, video of his car, the DNA at the scene "and a DNA analysis of
  trash collected from his parents' home". So the trash **helped**. It did not lead police to him on its own.
- "The Idaho killer" is supported by his guilty plea (K_plea). The convictions stand; the 2026 petition is narrated.
- **Flag for the owner:** the series.json `youtube_title` for this episode reads "His Family's Trash **Led to** the Idaho
  Killer". That overstates what the filings say. The safer form, "Helped Catch", is suggested. series.json was not edited.

## Claims used (all from Case File 17 unless marked NEW)

| Claim | Used for | Nature |
|---|---|---|
| K_snap, K_swab, K_plea | hook: "Investigators had the Idaho killer's DNA, but no name." | allegation / allegation / fact |
| K_trash | hook line 2, the trash shot, the callback | allegation (affidavit) |
| K_killings | "In November 2022, four University of Idaho students were killed." | fact |
| K_names | memorial card only (Ethan Chapin, Kaylee Goncalves, Xana Kernodle, Madison Mogen) | fact |
| K_sheath, K_snap | "Prosecutors said a knife sheath was left behind, with DNA on its button snap." | allegation |
| K_igg, K_name | "Court filings said genetic genealogy pointed to one family, and to Bryan Kohberger." Label: "28 · criminology PhD student" | allegation / fact |
| K_paternity | "Prosecutors said the trash DNA came from the father of whoever left the sheath." Card: "AT LEAST 99.9998% OF MEN EXCLUDED" | allegation |
| K_arrest, K_distance | "On December 30th, police arrested him." Label: "About 2,500 miles from Moscow, Idaho" | fact |
| K_plea, K_sentence | "In 2025, he pleaded guilty and got four life sentences." | fact |
| K_petition | "In 2026, he reportedly asked to withdraw his plea." (mandatory line) | procedure |
| **K_hearings (NEW)** | card only: "NO RULING YET (12 OCT 2026)" / "COURT DATES SET: JUNE 2027" | procedure |
| K_trash, K_paternity, K_swab | callback: "His family's trash helped link that DNA to him." | allegation |

## NEW: the June 2027 court dates (K_hearings)

- Judge Steven Hippler set a **status conference for 3 June 2027** and, **if an evidentiary hearing is granted**, a hearing
  to begin on **17 June 2027** on Kohberger's post-conviction petition. The petition argues ineffective assistance of
  counsel and an involuntary plea. The state has asked for the petition to be dismissed without a hearing, so the June 17
  hearing is conditional. That is why the card says "COURT DATES SET" and not "HEARING SET".
- One extract (Brownstone Law, 2026-09-08; not used as a source) mentions a 15 Oct 2026 hearing on a defence request to
  disqualify the judge. It would not decide the petition. Nothing on screen depends on it.
- Sources: KMVT (Gray) 2026-08-26 https://www.kmvt.com/2026/08/26/court-sets-2027-evidentiary-hearing-kohbergers-effort-withdraw-guilty-plea/ ;
  KIVI (Scripps) https://www.kivitv.com/university-of-idaho-murders/court-sets-2027-evidentiary-hearing-for-kohbergers-effort-to-withdraw-guilty-plea ;
  FOX Television Stations (FOX 13 Seattle and others) https://www.fox13seattle.com/news/idaho-judge-grants-bryan-kohberger-two-hearings-next-year-admitted-killer-seeks-withdraw-guilty-plea ;
  Fox News https://www.foxnews.com/us/bryan-kohberger-2027-hearing-not-guaranteed-idaho-seeks-quick-dismissal.amp
- A search for anything newer (October 2026) returned only unreliable aggregator pages, which were not used.

## Fun facts

- None as a pop-up. The 40-second rules allow at most one, and a card would slow the clue chain. The criminology PhD
  detail (K_name, sourced in the full ledger) appears only as the sub-line of his name label.

## Myths and claims NOT used

- Everything listed in the full ledger, plus: the white car, the phone records, the death-penalty deal, the families'
  objections and the "no motive" line. All are sourced but cut for length.
- Any claim that the trash alone identified him (see the headline check above).
- The People magazine detail about a cotton swab in the trash, which comes from a secondary report and is not used.

## Ethics decisions (unchanged from Case File 17)

- His parents and family are never named or shown. The father exists only as a line in a DNA result.
- Kohberger appears only as an anonymous rim-lit silhouette, tagged "ILLUSTRATION · NOT A LIKENESS".
- No knife, no victims, no house and no scene. The sheath is described in words only.
- The four students are named only on the memorial card, over a wide, distant, generic town.
- The 2026 petition is stated and attributed ("reportedly"), and the card says there is no ruling yet.
