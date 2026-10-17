# Case File 30: the Boston Marathon bombing manhunt and a backyard boat (40-second cut) — research ledger

Date: 2026-10-12. Episode id `tcv30-boat-40`, prefix `bb30`. Closed at trial (convicted on all 30 counts, April 2015;
sentenced to death, 2015); appeals continue (see "Legal status"). Framing: a city shut down and a 20-block search found
nothing; an hour after the lockdown was lifted, a homeowner checking the cover on his boat found the suspect inside.

## Method and limits
- 15 WebSearch calls in "standard" mode. WebFetch and curl are blocked in the build environment, so only **search-result
  extracts** were read, never full pages. Every source record in `episode.json` says so in `accessed`. apnews.com and
  reuters.com are not reachable from this environment, so AP reporting is cited where it is syndicated (Salon, Fox 11,
  CBS, NBC).
- Official material: the FBI's "Boston Marathon Bombing" famous-cases page and the Justice Department's 2015 sentencing
  release. Contemporary press: CBS News, NBC News, NPR, CNN, WBUR, the Boston Globe, Salon (AP), Time, ABC7 (AP),
  UPI (citing the Globe), Long Island Press, Al Jazeera. Trial coverage: NBC News, CBS Boston, the Boston Globe, Fox 11
  (AP). Appeals: NBC News, the Boston Globe, WBUR, Boston 25 News.
- Narration uses only what at least two sources agree on, worded no more specifically than they are.

## Established facts (used in narration; claim ids in episode.json)
- **B_shutdown** (hook) — on 19 April 2013 Gov. Deval Patrick asked more than a million greater Boston residents to shelter
  in place (voluntary); mass transit was suspended; the order was lifted at about 6 p.m. with the search of the Watertown
  neighbourhood "not fruitful" (Boston Globe 2014; NBC; CBS). Narration: "Boston was shut down to find the marathon
  bomber." (the Globe's own wording: "decision to shut down Boston for manhunt") / "A million people were asked to stay in
  while police searched Watertown."
- **B_found** (hook / HOW) — after the order was lifted, a Watertown homeowner (David Henneberry; not named on screen)
  noticed something amiss with his boat, went out to check it, found the cover's strap loose, lifted the wrap, saw blood
  inside and called 911 (CNN 2013; NBC trial report 2015; CBS). Narration: "A man checking his boat found him." /
  "The cover was loose. He looked in, saw blood, called 911." Headline: "A BACKYARD BOAT / ENDED THE MARATHON
  MANHUNT" (the manhunt ended at the boat; the homeowner called police, police made the arrest).
- **B_toll** (stakes) — two bombs near the finish line on 15 April 2013 killed three people and injured more than 260
  (Al Jazeera 2015; WBUR 2015; FBI: "killing three and injuring scores more"; DOJ: "killing three people, maiming 17,
  and injuring hundreds more"). Narration: "The bombs killed three people and injured over 260." Victims are not
  named in narration (memorial card only).
- **B_photos** — on 18 April 2013, three days after the bombing, the FBI released images of two suspects (ABC7/AP; Salon/AP;
  Time). Narration: "Three days later, the FBI released photos of two suspects."
- **B_night** — that night (about 10:20-10:30 p.m. on 18 April) MIT police officer Sean Collier was shot and killed in
  Cambridge; the brothers carjacked an SUV; in a shootout with police in Watertown in the early hours of 19 April the older
  brother, Tamerlan Tsarnaev, died (NBC; CBS; FBI; NPR). Narration: "That night a campus police officer was killed, and
  one suspect died in a shootout." (summary only; the officer is named only on the memorial card).
- **B_search** — a 20-block area of Watertown was cordoned off and searched (Salon; NBC trial report: SWAT teams swarmed
  the area; Globe: search "not fruitful"). Card: "A 20-BLOCK SEARCH · NOTHING". "Thousands of officers" appears only on a
  weak source, so narration says "police".
- **B_hour** (irony) — about an hour after the order was lifted the homeowner went out to his boat (NBC: "About an hour
  after the order lifted"; CNN; UPI/Globe). Narration: "By evening: nothing. The lockdown was lifted." / "An hour later a
  homeowner went to check his boat."
- **B_capture** — Dzhokhar Tsarnaev was found hiding in the boat, wounded, and taken into custody at about 8:45 p.m.
  (Long Island Press: about 8:45 p.m.; Salon live blog: cheers at 8:43; CBS: just before 9 p.m.) after a standoff in which
  police fired and used stun grenades; thermal imaging confirmed someone inside (CBS; NPR; FBI). Narration: "Inside was
  Dzhokhar Tsarnaev." Card: "CAPTURED · ABOUT 8:45 P.M." Nothing of the standoff is depicted.
- **B_note** (card only) — a note he had written in pencil inside the boat was shown to jurors at his trial in March 2015
  (NPR 2013; CBS Boston 2015; Boston Globe 2015). Card: "A NOTE HE WROTE INSIDE WAS SHOWN AT HIS TRIAL". Its content is
  not quoted.
- **B_verdict** — a federal jury convicted him on all 30 counts in April 2015 (8 April, a Wednesday); the jury returned a
  death verdict on 15 May 2015; Judge George A. O'Toole Jr. formally imposed the death sentence in June 2015 (WBUR; Scripps;
  Al Jazeera; DOJ). Narration: "Convicted on all thirty counts. Sentenced to death."
- **B_appeals** (card only) — the First Circuit vacated the death sentence in July 2020; the Supreme Court reinstated it in
  March 2022 (6-3); in March 2024 the First Circuit sent the case back to the trial judge to investigate two jurors'
  alleged bias (if either should have been disqualified, a new penalty-phase trial); in July-August 2025 a First Circuit
  panel refused to remove Judge O'Toole and the defence sought en banc rehearing (NBC 2020; Boston Globe 2025; WBUR 2025;
  Boston 25). Card: "DEATH SENTENCE · APPEALS CONTINUE".

## Legal status (verified 2026-10-12, extracts only)
- Convicted April 2015; sentenced to death 2015; the sentence was vacated (2020), reinstated (2022) and is under further
  review (juror-bias remand, 2024; recusal fight, 2025). No extract reported a ruling on the juror-bias inquiry or the
  en banc petition after August 2025. Stated as: "sentenced to death; appeals continue." He is held at ADX Florence
  (not narrated).

## Conflicts noted (not narrated)
- Injured: "more than 180" in first-day reports, 260 / 264 / "more than 260" in later ones; narration says "over 260".
- The strap: Henneberry said it was looser than usual (perhaps the wind); a stepson said it had been cut. Narration says
  "the cover was loose". Henneberry said he saw no blood on the OUTSIDE of the cover, only inside; narration says "looked
  in, saw blood".
- Capture time: about 8:45 p.m. / 8:43 / "just before 9 p.m.". Card says "about 8:45 p.m.".
- Shelter-in-place numbers: "more than a million" (Globe) vs "close to 1 million" (NBC/CBS): narration says "a million"; the card says "about 1 million".
- Shootout timing: "night of 18 April" vs "early 19 April" (it straddled midnight): narration says "that night".
- Tamerlan's death: he was shot and then run over by the carjacked SUV driven by his brother (FBI). Narration: "died in a
  shootout" (summary only).
- Collier's age: 26 or 27. Not stated.

## Myths and claims NOT used
- That police "pulled the suspect from the boat within minutes": there was a standoff of about an hour; not narrated.
- Any claim that the homeowner "caught" the bomber: he found him and called 911; police made the arrest.
- The early report of a convenience-store robbery by the brothers (disputed by State Police): left out.
- The boat's name ("Slip Away II"), the street address and the boat's make: not shown or spoken (generic boat, no name).
- The note's content, the brothers' motives, statements or beliefs: never quoted or summarised.
- Crowd-funding for a replacement boat: left out.

## Ethics decisions
- No explosion, injury, weapon in use, victim, finish line or crime scene is drawn anywhere. The bombing is one spoken
  line; the toll is a typed card in a quiet room. The shootout is a card and a dark street with police lights only.
- Victims are not named in narration; the memorial card lists Krystle Campbell, Lu Lingzi, Martin Richard and Officer
  Sean Collier (spellings as in the Boston Public Library guide, NECN/UPI memorial reports; DOJ writes "Lingzi Lu"), and
  "We remember those who died." is the last spoken line. The callback before it is "A backyard boat ended the manhunt."
  (the wording "ended at a backyard boat" was dropped because Piper fuses "at a" and the captions would drift).
- Dzhokhar Tsarnaev is only a dark shape inside the boat and, in court, an anonymous rim-lit silhouette tagged
  "ILLUSTRATION · NOT A LIKENESS"; never a photo recreation; never posed heroically.
- The homeowner is a generic, unnamed figure (not a likeness); the officers are generic, with no insignia and no weapons.
- The boat, trailer, house, yard, street and city are generic drawings with no name, number, sign or logo; every card is
  our own typed graphic. No dialogue is invented.
