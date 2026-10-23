# Case File 28: Ted Bundy, caught by traffic stops (40-second cut) — research ledger

Date: 2026-10-12. Episode id `tcv28-bundy-40`, prefix `tb28`. Closed case (convicted 1979 and 1980; executed 24 January 1989).
Framing: how ordinary police work (three traffic stops) kept catching him. Not about his crimes.

## Method and limits
- 12 WebSearch calls in "standard" mode. WebFetch and curl are blocked in the build environment, so only **search-result extracts** were read, never full pages. Every source record in `episode.json` says so in `accessed`.
- apnews.com could not be searched (blocked to the search tool's user agent). UPI archives did not surface. Contemporary press is represented by the Deseret News (2000 interview with the arresting sergeant; 1989 trial timeline), The Seattle Times (1997), and an AP "Today in History" item (Live 5 News, 2026).
- Primary-adjacent: the FBI's Ten Most Wanted history entry (no. 360) and an FBI records catalog entry (Umbra / GPO purl), which summarise the 1977 escapes and the 1978 arrest.
- Some details differ between sources (see "Conflicts"); narration only uses what at least two sources agree on, worded no more specifically than they are.

## Established facts (used in narration; claim ids in episode.json)
- **B_escapes** — escaped custody twice in Colorado in 1977: 7 June, from a second-floor law-library window of the Pitkin County Courthouse in Aspen during a hearing (Biography timeline; Crime+Investigation; Durango Herald; Denver Gazette; FBI record says "escaped from a Colorado courthouse"); 30 December, from the Garfield County Jail in Glenwood Springs through an opening in his cell ceiling (light-fixture opening into a crawl space) (FBI record; History.com; Durango Herald; Crime+Investigation). Narration: "Ted Bundy escaped custody twice." / "In Colorado, he jumped from a courthouse window." / "Then he escaped through a jail ceiling."
- **B_stops** — both escapes ended at a traffic stop in a stolen car: about six days after the Aspen escape, officers pulled over the stolen car he was driving erratically (Crime+Investigation; Denver Gazette "pulled over while driving a stolen car"; 9NEWS "Aspen police captured him in a stolen car after six days"; Aspen Times "Six Days in Aspen"); 15 Feb 1978, a Pensacola officer stopped the stolen Volkswagen he was driving (FBI record; Oxygen; KUTV). Narration: "Both times, a traffic stop caught him." / "Six days later, police stopped him in a stolen car." / "Two escapes. Two traffic stops." Headline: "TED BUNDY ESCAPED CUSTODY TWICE / BOTH TIMES, A TRAFFIC STOP CAUGHT HIM" (exact: courthouse escape + jail escape; each ended at a stop).
- **B_confessed** (stakes) — Britannica: he confessed to killing 30 people (its Q&A page says 28; History.com and some Biography pages say 36); the true total is unknown (Biography). Narration: "He later confessed to 30 murders." Card adds "Per Britannica · the true total is unknown".
- **B_1975** — early hours of 16 August 1975 (one source says 15 August), Utah Highway Patrol Sgt Bob Hayward saw a Volkswagen Beetle pass with its lights off in the Granger area of Salt Lake County; when his lights hit it, it fled; he pursued it until it pulled into a (closed) gas station (Deseret News 2000; Killer in the Archives, quoting Hayward's report; Yahoo/syndicated "without its headlights on"; LDS Living citing the Salt Lake Tribune). Narration: "In Utah, a trooper chased his Volkswagen. No headlights." (card: "SALT LAKE COUNTY, UTAH · August 1975") The sergeant is not named on screen.
- **B_items** — the passenger seat had been removed (placed in the back); officers found a crowbar, a ski mask and handcuffs, plus an ice pick, a pantyhose mask, garbage bags and other items (Deseret News; Crime Library ch. 8; Killer in the Archives; Yahoo). Arrested that night (evading an officer); the burglary-tools charge followed on 21 August. It was his first arrest (Yahoo; Killer in the Archives "The first arrest, 1975"). Narration: "Inside were a crowbar, a ski mask and handcuffs." The items are a typed card only; nothing is drawn.
- **B_tenmost** — added to the FBI's Ten Most Wanted list on 10 February 1978 (no. 360), off it on 15 February 1978 (FBI Top Ten history; NPR 2011 list 2/10/1978-2/15/1978; FBI record). Narration: "The FBI added him to its Ten Most Wanted list." Card "ADDED 10 FEBRUARY 1978".
- **B_pensacola** (the HOW) — 15 February 1978, Pensacola police officer David Lee ran the tag of an orange VW Beetle; it came back stolen; he stopped the car and arrested the driver after a struggle (Oxygen; KUTV 2018; Crime Library ch. 13; FBI record; WPMI NBC 15). The FBI record describes the stop as "for speeding while driving a stolen vehicle"; narration avoids the trigger and says only "an officer checked the plate of a Volkswagen. It was stolen." The officer is not named on screen; the struggle is one typed line.
- **B_convicted** — convicted in Florida in July 1979 (Miami trial, 24 July 1979) and February 1980 (Orlando trial; 7 or 10 Feb per source), sentenced to death; executed in the electric chair at Florida State Prison, 24 January 1989 (Encyclopedia.com; Deseret News 1989 timeline; WPLG Local 10; KOMO; Live 5/AP). Narration: "He was convicted in Florida and executed in 1989."
- **B_hero** — the 1975 car was Bundy's tan 1968 Volkswagen Beetle (now displayed at the Alcatraz East Crime Museum; Seattle Times 1997 on its sale; Yahoo); the 1978 car was a stolen orange Beetle (Crime Library ch. 13). The drawings are generic Beetle-shaped cars with no badge and blank plates.

## Conflicts noted (not used in narration)
- Date of the Utah stop: 16 Aug 1975 (most) vs 15 Aug (one). Card says only "August 1975".
- Time of the Pensacola stop: 1 a.m., 1:30 a.m. or 10 p.m. Not shown.
- Trigger of the Pensacola stop: plate check (Oxygen, KUTV, Crime Library) vs "speeding" (FBI record) vs expired tag / erratic driving (secondary). Narration says only that the plate was checked and the car was stolen.
- Confession count: 30 (Britannica main, Biography), 28 (Britannica Q&A), 36 (History.com). We use 30, attributed to Britannica on screen, with "true total unknown".
- Aspen escape month: 7 June 1977 (FBI record, Biography timeline) vs "July" in one secondary; June used.

## Pronunciation (offline recogniser, every line in isolation, on the cached clips the build uses)
- `Ted` -> `Tedde` (the hook's first word was heard as "that"); `FBI` -> `F B I`. Reworded: "Inside: ..." -> "Inside were ..." (articles dropped); "an officer checked a Volkswagen's plate" -> "checked the plate of a Volkswagen" ("checked a" blurred); "Convicted in Florida, ..." -> "He was convicted in Florida and ..." (lost first consonant). Remaining mishearings are homophones only ("we're", "to", "the stolen car") and the known "FBI" weakness.

## Myths and claims NOT used
- Any "charming", "handsome" or genius framing; any reference to films or series about him.
- "Hair matching victims" found in the Beetle (true per sources, but victim-centred); the attempted kidnapping linked to the 1975 items (victim-centred; not needed).
- The false name he gave in Pensacola (only one solid source surfaced).
- The Houdini-book anecdote, the hacksaw and the weight-loss story about the ceiling escape (single or anecdotal sources).
- Any victim count beyond the sourced confession figure; no victim names, places or details.

## Ethics decisions
- The episode is about policing, not the crimes: no victim is named or depicted; no violence, weapon in use, injury, crime scene or body appears. The 1975 items and the 1978 struggle are typed lines; the items are never drawn.
- Bundy is ONLY an anonymous rim-lit silhouette (`tb28_bundy`, real_person true, depiction "not a likeness") or a dark head shape in a car window. No face, no mugshot or courtroom recreation, never posed heroically, never "charming"; none of his words are quoted. Every shot he appears in is tagged "ILLUSTRATION · NOT A LIKENESS".
- The arresting officers are generic figures (`tb28_trooper`, `tb28_officer`, `tb28_deputy`) and are not named on screen.
- Cars are generic drawings: no VW badge, no lettering, blank plates with masked marks. Patrol cars have no text, crest or number. Places are generic and tagged.
- The memorial is the last spoken line: "We remember his victims." No names.
- End question (burned in): "WHAT CAUGHT TED BUNDY? / GOOD POLICING OR HIS OWN MISTAKES?" — invites debate about the police work, not about him.
