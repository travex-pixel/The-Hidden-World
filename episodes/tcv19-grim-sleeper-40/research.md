# Case File 19: the "Grim Sleeper", 40-second cut. Research ledger

Episode: `tcv19-grim-sleeper-40` · "A Detective Posed as a Busboy and Kept a Killer's Pizza Crust" (format `short40`)
Ledger date: **2026-10-12**. Legal status verified on 2026-10-12 (`legal_status_verified` = 2026-10-12).

This is a short cut of Case File 15. The full research ledger is
[`episodes/tcv15-grim-sleeper/research.md`](../tcv15-grim-sleeper/research.md): every claim, source, conflict and ethics
decision below comes from it. No new research was done and no new fact is introduced.

## Method and limits

- No new web searches (0 of the 15 allowed). The Case File 15 ledger used 14 searches on 2026-10-12; WebFetch and curl
  were blocked, so every source is a **search-result extract** (title, URL, summary). Full articles, the Attorney
  General's release, court rulings and trial records were **not read**.
- Rule kept: a fact is narrated or put on screen only when at least two reputable sources agree. Claims and source
  records are copied from `series/true-crime-cinematic/slate/tcv15-grim-sleeper.py`; one claim (`GR_nickname`) is a
  narrower restatement of Case File 15's `GR_gap`, with the same sources.
- Status (2026-10-12): closed case. Convicted 5 May 2016; sentenced to death 10 Aug 2016; died on death row at San
  Quentin on 28 Mar 2020.

## Burned-in headline: wording check

"A DETECTIVE POSED AS A BUSBOY" / "AND KEPT A KILLER'S PIZZA CRUST".

- "A detective posed as a busboy": NBC News ("Pizza helped cops nab 'Grim Sleeper' suspect"), ABA Journal ("DNA cop got
  by posing as restaurant busboy"); KESQ (restaurant uniform). Some reports say waiter or employee; "busboy" is in 2+
  sources.
- "and kept ... pizza crust": the detective collected the items Franklin used: napkins, a glass, a fork and a
  partially eaten slice / leftover pizza crust (ABA Journal; The Boston Globe, "uneaten pizza crust"; Officer.com,
  "discarded crust"). The suggested "TO GET a killer's pizza crust" was changed to "AND KEPT": the operation aimed at
  his DNA on several items, so naming the crust as the sole purpose would narrow the facts. On screen the item card
  says "WHAT HE COLLECTED, AS REPORTED: NAPKINS · A GLASS · A FORK / AND THE PIZZA CRUST".
- "a killer's": Franklin was convicted of ten murders (5 May 2016), so the word is a matter of record.

## Claims used (narration and cards)

| Claim | Fact | Sources | Scene |
|---|---|---|---|
| GR_busboy | An undercover detective in a restaurant uniform posed as a busboy and collected what Franklin used, including the pizza crust. | NBC News; ABA Journal; The Boston Globe; Officer.com; KESQ | s01, s05, s09 |
| GR_verdict | 5 May 2016: convicted of 10 counts of first-degree murder (nine women and a 15-year-old girl). "In 2016, he was convicted of murdering nine women and a fifteen-year-old girl." | CNN; Christian Science Monitor (AP); CBC News | s01, s08 |
| GR_span | Convicted of murders in South Los Angeles between 1985 and 2007; identified in July 2010, about 25 years after the first. "From 1985 ...", "Twenty-five years without a name." | KTVU (AP); Christian Science Monitor (AP); CBC News | s02, s09 |
| GR_nickname | "The Grim Sleeper": coined by LA Weekly in 2008, later used by the LAPD and the press. | Columbia Journalism Review; KQED; IOL (Reuters); NBC Los Angeles | s02 |
| GR_nomatch | Police had the killer's crime-scene DNA, but it matched no one in the state offender database. "Police had his DNA, but no name." | KESQ (CNN wire); California AG release; Honolulu Star-Advertiser (AP) | s02 |
| GR_familial | A familial search of the state database (begun 28 Apr 2010) found a partial match pointing to a close relative: his son. "In 2010, a familial DNA search flagged his son." | California AG release; NBC News; CBS News; Star-Advertiser (AP); Court TV (AP) | s03 |
| GR_name | The son's father: Lonnie David Franklin Jr., then 57, of South Los Angeles. | KESQ; NBC News; Star-Advertiser (AP) | s04 |
| GR_party | 5 July 2010: detectives followed him to a birthday party at a pizza restaurant in Buena Park (on screen only). | ABA Journal; Center for Genetics and Society; Oxygen | s04 |
| GR_match | DNA from the restaurant items matched DNA evidence from the crime scenes. | NBC News; Center for Genetics and Society; Oxygen | s06, s09 |
| GR_arrest | Arrested on 7 July 2010, two days after the party, in front of his home. | KESQ; NBC News; ABA Journal | s07 |
| GR_firstarrest | FUN FACT (on screen only, attributed): officials called it the first arrest from California's familial DNA search program. | California AG release; NBC News; Star-Advertiser (AP) | s07 |
| GR_sentence | Sentenced to death on 10 Aug 2016 (jury recommendation June 2016). | ABC7 Los Angeles; KTVU (AP); CNN; CBC News | s08 |
| GR_died | Died 28 Mar 2020 at San Quentin, on death row, aged 67. "He died in prison in 2020." | CBS Los Angeles; Court TV (AP); The Telegraph, Nashua (AP) | s08 |

"A pizza crust helped end it" (callback): the crust was among the items whose DNA matched; "helped" because the familial
search had already pointed to the family.

## Allegations / inquiry findings (attributed)

- The "first familial DNA arrest" is attributed to officials on the card ("Officials said ..."), as in Case File 15.
- Not used: the defence's challenge to how the plates were collected (the judge ruled the DNA lawfully obtained), and
  police estimates of further victims.

## Fun fact (one card, no narration)

1. **GR_firstarrest**: "Officials said it was the first arrest from California's familial DNA search program."
   Sources: California AG release; NBC News; Star-Advertiser (AP). Pop-up in s07 with a sparkle.

## Myths and claims NOT used

Same exclusions as Case File 15: the restaurant's name; why the son's DNA was on file; "as many as 25" victims; "the
first familial DNA search in the US"; his jobs; survivor details; any crime detail. The 13-year "gap" fun fact and the
community coalition beat were cut for length (not for accuracy).

## Ethics decisions

- Franklin appears only as an anonymous rim-lit silhouette (`gr15_franklin`, `real_person: true`, "not a likeness");
  every shot with him is tagged "ILLUSTRATION · NOT A LIKENESS".
- The victims are never depicted or described; the verdict line names them as "nine women and a fifteen-year-old girl",
  and the end card carries an "IN MEMORY OF ALL TEN" line.
- His son: "his son" only, never named or shown; the card says "Not named here, and not a suspect."
- The undercover detective and all police are generic figures with no badges or insignia; the patrol car has no
  lettering. The restaurant, street, house, lab and courtroom are generic illustrations, tagged as such.
- No real photograph, newspaper, court or police document, logo or restaurant branding is imitated.
