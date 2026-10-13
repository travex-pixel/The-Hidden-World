# Case File 35: the end of the hunt for Pablo Escobar, a phone call to his son (40-second cut) — research ledger

Date: 2026-10-13. Episode id `tcv35-escobar-40`, prefix `pe35`. Closed: Escobar died on 2 December 1993; there was no
trial. Framing: 16 months after walking out of La Catedral prison he was found because a radiotelephone call to his son
was long enough for police direction-finding teams to locate. Hero object: a generic 1990s brick-style radiotelephone.

## Method and limits
- 15 WebSearch calls in "standard" mode (8 open queries, then domain-restricted ones). WebFetch and curl are blocked in
  the build environment, so only **search-result extracts** were read, never full pages. Every source record in
  `episode.json` says so in `accessed`.
- nytimes.com, apnews.com, reuters.com, latimes.com, bbc.co.uk/bbc.com, theguardian.com, independent.co.uk,
  chicagotribune.com and theatlantic.com **block the search crawler** (the API refused those domains outright), so AP
  reporting is cited where it is syndicated (The Seattle Times, Deseret News) and the contemporaneous US press is The
  Washington Post, UPI, the St. Petersburg Times (Tampa Bay Times archive) and Time. Official material: the DEA's own
  history (1990-1994) and the DEA Museum. Reference: Britannica, PBS Frontline, CNN transcripts (the 2000 "Killing Pablo"
  documentary; the 2016 interview with his son). Secondary: Wikipedia, Crime+Investigation UK, History Collection, A&E,
  Colombia Reports, La FM (Spanish), Business Insider via Yahoo.
- Narration uses only what at least two sources agree on, worded no more specifically than they are. Every narrated
  claim maps to a claim id in `episode.json` with ≥2 sources.

## Established facts (used in narration; claim ids in episode.json)
- **E_escape** — Escobar escaped from La Catedral (the prison built for him near Medellín) on 22 July 1992 when the
  government moved to transfer him; the DEA history says 28 guards were later charged with aiding the break-out (DEA
  history 1990-94; DEA Museum; Wikipedia "La Catedral"; Crime+Investigation UK). Narration: "Pablo Escobar escaped prison".
- **E_hunt16** — he was hunted for 16 months (AP, 5 Dec 1993, quoting President Gaviria's speech: the police and soldiers
  "hunted the drug trafficker for 16 months before killing him"; Crime+Investigation UK: "a fugitive for 16 months") by
  the Search Bloc, a Colombian National Police unit led by Col. Hugo Martínez, backed by US agencies (Wikipedia "Search
  Bloc"; Britannica: "the Search Bloc, a Colombian special forces unit"); the DEA Museum calls it "the largest manhunt in
  Colombia's history". Narration: "hid for 16 months" / "Colombia's Search Bloc hunted him". Conflict: one secondary source
  says "seventeen months" (counting differently); the AP/Gaviria figure is used.
- **E_hook** — the phone call to his son on 2 December 1993, traced by police direction-finding, led the Search Bloc to
  the house where he was killed that day (Time 1993: the son "would be on the phone with his father long enough for the
  Colombian police to trace the call, track the fugitive drug lord down and kill him"; Britannica: "his hideout in
  Medellín was discovered after the Search Bloc ... traced a phone call"; St. Petersburg Times headline, 3 Dec 1993:
  "Final error: a phone call"; CNN 2000; PBS Frontline). Headline: "A PHONE CALL TO HIS SON / ENDED THE HUNT FOR ESCOBAR".
  Narration: "A phone call to his son ended the hunt."
- **E_avianca** (stakes) — Avianca Flight 203, a Boeing 727 from Bogotá to Cali, exploded and crashed on 27 November 1989,
  killing all 107 aboard (Washington Post 28 Nov 1989: "killing 107"; UPI 27 Nov 1989: "107 die"); Colombian officials
  concluded a bomb caused it (Washington Post, 6 Dec 1989); the cartel's "Extraditables" claimed it; Escobar was blamed
  and indicted by a US grand jury in 1992 (UPI); the cartel hitman charged with the bombing was tried in New York in 1994
  (UPI; CNN). Narration: "His cartel bombed a jet, killing 107". Conflicts: later reports give 110 or 111 dead (some count
  people on the ground); 107 is the contemporaneous figure in both wire reports and the one used. A 2010s Colombian
  theory of mechanical failure or a missile (Noticias Caracol) is a minority claim and is not used.
- **E_bounty** (stakes) — the cartel offered money for each police officer killed (UPI, 1990: "a reward of some $4,200
  for each officer killed"; La FM: one million pesos per officer, more by rank, from 1990); by December 1993 Escobar and
  his gang were blamed for the deaths of at least 500 police officers in Medellín since 1989 (AP via The Seattle Times;
  AP via Deseret 2012: about 500 in the worst year). Narration: "paid bounties on police". Card: "500+ OFFICERS KILLED IN
  MEDELLÍN SINCE 1989 (AP)". The bounty amount is NOT narrated (sources differ by currency and year).
- **E_us** — the DEA "assisted the Colombian National Police in the pursuit of Escobar"; "his exact location was determined
  using electronic, directional-finding equipment" (DEA history 1990-94); Time: calls traced "through a scanning
  operation set up outside Medellín with U.S.-donated equipment"; Frontline: "radio directional-finding equipment";
  Wikipedia "Search Bloc": US signals-intelligence teams and DEA/CIA support. Narration: "with DEA help and US tracking
  gear". The names of US units (Centra Spike, Delta Force) are NOT used: they come from Mark Bowden's reporting and
  Wikipedia only, and are not needed.
- **E_radiotel** — in hiding he kept calling his family, his wife and more often his son, on a radiotelephone (Frontline:
  "intercepted ... using their radio directional-finding equipment, talking to his son"; St. Petersburg Times: he "could
  not resist the temptation of speaking to his family in Bogotá"; History Collection; Time). Narration: "But he kept
  phoning his family on a radiotelephone."
- **E_son_plea** (ATTRIBUTED) — his son's account (CNN, 2016; also Time's profile of the son): "'Papa, don't call
  anymore,' Marroquín told his father. 'They are going to kill you.'" Narration: "His son says he begged him: stop
  calling, they will kill you." Card: "HIS SON'S ACCOUNT · CNN, 2016". The son is referred to only as "his son"; he later
  changed his name and is never drawn.
- **E_call** (the HOW) — on 2 December 1993 he phoned his son (then 16, in Bogotá); he kept the first call short and
  promised to call back; the second call was his last and was long enough to trace (CNN 2000 transcript: "Pablo keeps
  first phone call short but hangs up promising to call his son back later that same day. It was the second call to his
  family that would prove to be his last"; Col. Hugo Martínez in the same transcript: "when the communication started, we
  begin looking for him, and in about five minutes it was done. We knew exactly where he was"; Time: traced "within 90
  minutes"; Frontline; Britannica). Narration: "December 2nd, 1993. His first call was short. The second was long enough
  to trace." Card: "SIGNAL LOCKED IN ABOUT 5 MINUTES" (Martínez's own figure; Time's "90 minutes" covers the whole
  scanning operation that day). The brief's "he had been warned to keep calls short" was NOT confirmed in that form in any
  reputable extract; the son's plea (above) and the short first call are what the sources support.
- **E_house** — the signal was pinpointed to "a middle-class two-story house in the western part of the city" (Time;
  Washington Post: a middle-class residence); secondary sources name the neighbourhood as Los Olivos (Wikipedia "Search
  Bloc"; History Collection). Card only: "A TWO-STOREY HOUSE · LOS OLIVOS, MEDELLÍN". The drawn house is generic.
- **E_death** — police raided the house; "Escobar and his bodyguard attempted to escape by running across the roofs of
  adjoining houses, but the Colombian National Police shot and killed them" (DEA history; Britannica: "both men were
  fatally shot"; Washington Post 3 Dec 1993; UPI 3 Dec 1993; Time). Narration: "Police raided the house. He fled onto the
  roof and was shot dead." Summary only; nothing of it is drawn (the roof in the picture stays empty).
- **E_birthday** — born 1 December 1949 (Wikipedia; Britannica); 1 December 1993 was his 44th birthday (Britannica: "On
  December 1, 1993, Escobar celebrated his 44th birthday"); killed the next day, 2 December 1993, aged 44 (Wikipedia
  "Death of Pablo Escobar"; UPI "On This Day"). Narration: "The hunt ended the day after his 44th birthday."

## Allegations / disputed points (cards only, attributed)
- **E_dispute** — who fired the fatal shot: Britannica: "there is uncertainty about who fired the fatal shot"; police
  accounts name different officers (A&E; Colombia Reports: Óscar Naranjo's book says an anonymous policeman); Los Pepes
  figures claimed it (Carlos Castaño; "Don Berna" credited his brother, which police denied); his son believes from the
  forensic report that his father, badly wounded by police, shot himself (CNN 2016; A&E; Business Insider via Yahoo).
  Card: "WHO FIRED THE FATAL SHOT IS STILL DISPUTED". Not narrated.
- The Search Bloc's alleged collaboration with the Los Pepes vigilantes (Wikipedia; CS Monitor 1993) is not used.

## Memorial line (E_toll)
- Escobar was "accused of ordering the assassinations of presidential candidates, judges, journalists and police.
  Hundreds of ordinary Colombians died in bombings of shopping centers, neighborhoods and a passenger airplane" (AP, 5 Dec
  1993); the DEA history: the cartel was responsible for "the assassinations of dozens of government officials"; CS
  Monitor 1990: the cartel blamed for "hundreds of recent murders". **No reputable extract gives a verified total**, so the
  brief's "the thousands his cartel killed" is NOT used; the last line is "We remember everyone his cartel killed." The
  memorial card lists the 107 of Avianca 203, 500+ police officers, judges, journalists, candidates and civilians.

## Myths and claims NOT used
- That a US Delta Force sniper fired the fatal shot (rumour alluded to in Bowden's book): not used.
- That the call was to a radio station about his family's treatment in Germany (one 1993 account): the son's call is the
  version in Time, CNN, Frontline, Britannica and the St. Petersburg Times, and is the one used.
- The "17 months" count; the 110/111 Avianca figures; the exact bounty amount; "the world's most wanted man" (not in a
  reputable extract about Escobar: the CS Monitor headline with that phrase is about a 1995 Cali arrest).
- Any depiction of La Catedral's luxuries, the Los Pepes killings, the body, the rooftop or the famous photographs.

## Ethics decisions
- Escobar is only an anonymous rim-lit silhouette (`pe35_escobar`, "ILLUSTRATION · NOT A LIKENESS"); never a photo
  recreation, never posed heroically; none of his words are quoted. The `hand_to_face` pose stands for a handset.
- Nothing of the death is drawn: no figure on any roof, no weapon, no body, no blood, no gunfire; the raid is officers at
  a door under police lights; the death is one summary line and a typed card; the dispute is a card.
- The son is never drawn or named beyond "his son"; his account is attributed ("his son says", CNN 2016).
- Victims are never shown; the jet, the bomb and the police killings are a typed card in a quiet room. The memorial is
  the last spoken line and the only sentiment.
- Officers and agents are generic figures with no insignia; Col. Martínez and the convicted hitman are not named on
  screen. The handset, van, room, street and hillside are generic drawings; every card is our own typed graphic.

## Pronunciation (tested line by line with the offline recogniser, 2026-10-13)
- Piper reads "Pablo Escobar", "Colombia's" and "December 2nd, 1993" correctly on its own; respelling Escobar made it
  worse ("Ablesco, Bar"). "DEA" needs "D E A"; "44th" needs "forty fourth" (the hyphenated form was heard as "40th");
  "107" is given its spoken form; "16" is "sixteen"; "radiotelephone" is "radio-telephone". Medellín and Los Olivos appear
  only on cards (keys kept).
- The callback line is "One phone call ran too long.": "He stayed on the phone too long" left Piper's word alignment
  proportional ("stayed on" merges), and "lasted too" was heard as "last to too"; the chosen wording aligns word for word
  and transcribes cleanly.
