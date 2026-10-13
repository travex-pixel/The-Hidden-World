# Case File 34 (40-second cut): Robert Durst and the hot microphone. Research ledger

- **Episode:** `tcv34-durst-40`, prefix `rd34`. A new 40-second episode (no earlier long cut).
- **Research date:** 2026-10-13. Legal status verified on 2026-10-13.
- **Status:** CLOSED. Robert Durst was convicted of the first-degree murder of Susan Berman on 17 September 2021 and
  sentenced to life without parole on 14 October 2021. He was charged in New York with the murder of his first wife,
  Kathleen McCormack Durst (complaint filed 19 October 2021; grand jury indictment reported 1 November 2021) and died in
  custody on 10 January 2022, so that case never went to trial.
- Framing: he volunteered for the HBO series "The Jinx"; after the final interview he went to the bathroom still wearing
  a live lavalier microphone; the recording was played to the jury, and the letter the filmmakers found (same
  handwriting and the same "Beverley" misspelling as the anonymous "cadaver" note) was the key evidence. Headline:
  "A LIVE MICROPHONE / HELPED CONVICT ROBERT DURST" ("helped": the letter and handwriting were central; the recording was
  evidence at trial).

## Method and limits
- **Only search-result extracts were used.** WebFetch and curl are blocked in the build environment. Every claim comes
  from WebSearch result summaries of the URLs cited; no full page was read, and quotes are as the extracts gave them.
  Every source record in `episode.json` says so in `accessed`.
- **Searches:** 12 WebSearch calls in standard mode (cap 15).
- apnews.com, reuters.com, nytimes.com and latimes.com pages did not surface as direct results; AP reporting is cited
  where it is syndicated (KSL, Fox 11, Court TV, Spectrum News, ABC stations, 6abc), and the New York Times 2019
  transcript report is cited through the outlets that reported it (Spin, Newser, BuzzFeed News, The Daily Beast).
- VERIFIED means at least two independent reputable sources agree. Biography.com, Wikipedia and aggregator mirrors
  (distractify/phpfox, tvtropes, substack) were pointers only and are never counted.
- Narration uses only what at least two sources agree on, worded no more specifically than they are.

## Established facts (all VERIFIED; claim ids match `episode.json`)

| Claim | What is said or shown | Sources |
|---|---|---|
| `R_heir` | Robert Durst, New York real-estate heir / "scion" of the Durst family | Bangor Daily News (AP/Reuters wire); ABC7 (AP) 2015; CS Monitor 2015; NBC News 2024 |
| `R_interview` | He approached the filmmaker after "All Good Things" and volunteered to be interviewed for the HBO series "The Jinx" (THR: about 21 hours of interviews). Narration: "agreed to a TV interview" / "He even volunteered for an HBO series." | Hollywood Reporter 2024; Greenwich Time 2021 (reached out and agreed to be interviewed); NBC News 2024 |
| `R_mic` | After the final interview (recorded 18 April 2012) he went to the bathroom still wearing a live microphone and was recorded saying, among other things, "There it is. You're caught." and "What the hell did I do? Killed them all, of course." The finale aired 15 March 2015. | ABC7 2015 ("killed them all"); ABC7 (AP) arrest report; City News Service 2020 (what the jury heard); AP via KTVU |
| `R_edit` | CARD ONLY: a 2019 New York Times report on the unedited transcript showed the bathroom remarks had been pulled from longer rambling remarks and re-ordered; the filmmakers said they put "killed them all" last for dramatic effect; the editing came out at trial. Card: "THE AUDIO WAS LATER SHOWN TO BE RE-ORDERED IN EDITING". | Spin 2019; Newser 2019; BuzzFeed News; The Daily Beast; Yahoo/AOL 2024 refresher |
| `R_wife` | Kathleen McCormack Durst, his first wife, 29, a medical student, was last seen on 31 January 1982 (Durst said he put her on a train at South Salem, NY); she was never found. Narration: "His wife vanished in 1982." | NBC News (Dateline) 2018; CBS New York; News 12 Westchester 2022; CNN (via ABC17) 2021 |
| `R_berman` | Susan Berman, 55, a writer and his close friend ("best friend", CBS), was shot dead at her home in the Benedict Canyon area near Beverly Hills in December 2000, as New York investigators prepared to question her about Kathleen's disappearance. Narration: "His best friend was shot dead in 2000." | ABC7 2015; NBC News 2018; CBS News 2021 |
| `R_note` | An anonymous note mailed to Beverly Hills police gave only Berman's address and the word "CADAVER", in block letters; the envelope misspelled Beverly as "Beverley". Narration: "Police got an anonymous note: cadaver, and her address." | AP via KSL 2020; AP via Fox 11 2021; AP (Melley) via Court TV 2021 |
| `R_denied` | Durst had denied writing the note for years, to police and to the documentary filmmakers; at trial in August 2021 he admitted writing it but denied the killing. Narration: "He denied writing it." | AP via Fox 11 2021; AP via Court TV 2021; AP via KSL 2020 |
| `R_letter` | The Jinx filmmakers found an earlier letter Durst had sent Berman with nearly identical handwriting and the same misspelling; confronted with the two side by side he could not tell them apart. A law-enforcement official told AP the handwriting analysis linking the letters was the key new evidence given to prosecutors before his arrest; the prosecutor called the note the "smoking gun". Narration: "The filmmakers found a letter he'd sent her. Same handwriting, same misspelling." | AP via KSL 2020; AP via Fox 11 2021; Courthouse News 2015 (AP); Fox News ("letter, not recording, led authorities to arrest"); AP via Court TV 2021 |
| `R_arrest` | Arrested by FBI agents at a New Orleans hotel on Saturday 14 March 2015, the day before the finale aired, on a Los Angeles warrant for Berman's murder. Narration: "He was arrested the day before it aired." | ABC7 (AP) 2015; Alabama Public Radio/NPR 2015; CS Monitor 2015; NBC News 2024 |
| `R_tape_trial` | The bathroom recording was played to the jury in Los Angeles during opening statements in March 2020; the trial was paused by the pandemic and resumed in May 2021 with the same jury. Card: "THE LETTER AND THE TAPE WERE BOTH IN EVIDENCE". | City News Service 2020; The Guardian 2020; AP via KTVU |
| `R_verdict` | A Los Angeles jury convicted him of first-degree murder (with special circumstances) on 17 September 2021. Narration: "In 2021 a jury convicted him of his friend's murder." | CBS News 2021; Rolling Stone 2021; Greenwich Time 2021; ABC13 timeline |
| `R_sentence` | Judge Mark Windham sentenced him to life without the possibility of parole on 14 October 2021. Narration: "Sentence: life without parole." | CBS News 2021; Spectrum News 1 (AP) 2021-10-14; Rolling Stone 2021 |
| `R_kathie_charge` | A second-degree murder complaint over Kathleen's death was filed in Lewisboro Town Court on 19 October 2021; a Westchester grand jury indictment was reported on 1 November 2021. Narration: "charged with his wife's murder too". | CNN via ABC17 2021; Oxygen 2021; Antelope Valley Press (via PressReader) 2021 |
| `R_death` | He died of natural causes in custody (at an outside hospital, CDCR) on 10 January 2022, aged 78, while awaiting trial on the Kathleen charge; that case never went to trial. Narration: "He died in custody in 2022." | 6abc (AP) 2022; ABC30 2022; CNN via ABC17 (awaiting trial) |
| `R_victims` | CARD ONLY (memorial): Kathleen McCormack Durst (29 when last seen) and Susan Berman (55). | NBC News 2018; ABC7 2015; CBS News 2021 |

## Allegations and the defence (attributed; not narrated)
- Prosecutors' theory: he killed Berman because she could incriminate him over Kathleen's disappearance (CBS; Rolling Stone).
  Narration does not state a motive.
- The defence said the "Jinx" audio was manipulated; Durst's own account at trial was that he found Berman dead and
  wrote the note (AP via Court TV). Not narrated; the editing caveat is on a card.

## Conflicts noted
- Arrest time on 14 March 2015: "just before 4:30 p.m." vs "just before 11 p.m." (ABC7 vs others). Only the date is used.
- Kathleen's disappearance is dated 31 January 1982 (NBC, News 12) while CNN's indictment report says "on or about
  January 31, 1982". Narration says "1982".
- The Kathleen charge: complaint 19 October 2021, indictment reported 1 November 2021. Card says "OCT–NOV 2021".

## Myths and claims NOT used
- That the bathroom audio was a clean, continuous confession: the editing/re-ordering is on a card.
- That the recording alone convicted him: the handwriting/letter evidence was the key evidence (AP); headline says "helped".
- The 2001 Galveston killing of Morris Black (acquitted 2003; self-defence) is omitted entirely: no dismemberment, no Texas.
- "21 hours of interviews" appears in one source only (THR): not stated.
- No quote of his beyond the reported bathroom wording, and no account of the killings.

## Ethics decisions
- Durst (convicted, deceased) is drawn only as an anonymous rim-lit silhouette (`rd34_durst`, `real_person: true`), tagged
  "ILLUSTRATION · NOT A LIKENESS"; never posed heroically; no photograph recreated.
- Victims are named only on the memorial card (Kathleen McCormack Durst, Susan Berman) and never shown; no violence,
  weapon, body or crime scene is drawn; Berman's home and address are not drawn or stated.
- The note, envelope and letter are our own generic drawings (tagged "NOT THE REAL NOTE"/"NOT THE REAL LETTERS"), not
  replicas; only the word "CADAVER" and the misspelling "BEVERLEY" appear, both widely reported.
- The studio, bathroom corridor and hotel corridor are generic illustrations; no HBO branding, logo or real set.
- The bathroom quote is on a "wording as reported" card with the editing caveat; narration says "It caught him:
  killed them all, of course." (the reported words).
