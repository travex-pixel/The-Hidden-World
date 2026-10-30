# Case File 32: Silk Road, Ross Ulbricht and a fake fight in a library (40-second cut) — research ledger

Date: 2026-10-13. Episode id `tcv32-silkroad-40`, prefix `sr32`. CLOSED: convicted on all seven counts (4 February
2015); life without parole (29 May 2015); pardoned by President Trump on 21 January 2025 and released. Framing: a dark-web
drug market built on anonymity, undone by a real name in an old forum post and a fake argument in a public library.

## Method and limits
- 14 WebSearch calls in "standard" mode. WebFetch and curl are blocked in the build environment, so only **search-result
  extracts** were read, never full pages. Every source record in `episode.json` says so in `accessed`. The New York Times
  article is cited by its own URL, but its text was seen only through extracts and through Sophos' and IDG's summaries of
  it; apnews.com and reuters.com are not reachable, so AP and Reuters reporting is cited where it is syndicated (News4Jax,
  NBC News, Officer.com, Police1).
- Official material: the Justice Department's (SDNY), DEA's and ICE's sentencing releases of 29 May 2015. Trial coverage:
  IDG (PCWorld / Computerworld / Network World), Vice Motherboard, Wired, TechCrunch, NBC (Reuters), NPR, ITV. The 2013
  seizure: Al Jazeera, TechCrunch, NPR, CNN Money, The Register, CBS, Fox, KQED, CBC. The pardon: The Washington Times,
  AP (via News4Jax), Al Jazeera, Yahoo News.
- Narration uses only what at least two sources agree on, worded no more specifically than they are.
- Wikipedia came up in results and was used only as a pointer, never counted as a source.

## Established facts (used in narration; claim ids in episode.json)
- **S_market** (hook / stakes) — Silk Road ran as a hidden service on the Tor network from early 2011 (the complaint:
  about January/February 2011) until the FBI seized it and arrested its operator on 1-2 October 2013; purchases were in
  bitcoin (Al Jazeera 2013; TechCrunch 2013; NPR 2013; CNN Money 2013; The Register 2013). Narration: "Silk Road: a
  dark-web drug empire built on anonymity." / "It ran on Tor and Bitcoin".
- **S_sales** (stakes by 0:10) — the DOJ sentencing release: Silk Road's users "bought and sold more than $200 million in
  illegal goods"; Ulbricht's commissions "more than $13 million"; prosecutors' trial figure "more than $213 million" (DOJ;
  DEA; Network World 2015). The 2013 FBI complaint converted about 9.5 million bitcoins of revenue to roughly $1.2 billion
  at then-current exchange rates (CBS 2013; Fox 2013): a conversion, not a measured dollar figure, so the narration and the
  card use the DOJ's "over $200 million". Narration: "over 200 million dollars in sales." Card: "OVER $200 MILLION IN
  SALES · U.S. DEPARTMENT OF JUSTICE, 2015".
- **S_dpr** (card only) — the operator was known only as "Dread Pirate Roberts" (DOJ; TechCrunch; NPR; ICE).
- **S_google** — IRS criminal-investigation special agent Gary Alford (not named on screen), working with the DEA/strike
  force in New York, used Google searches to find the earliest mentions of Silk Road: in January 2011, shortly after the
  site started, a user called "altoid" posted about it on Bitcointalk.org and Shroomery.org (NYT, "The Tax Sleuth Who
  Took Down a Drug Lord", December 2015; Sophos citing the NYT; Vice; Network World trial report; TechCrunch).
  Narration: "An IRS agent started with a Google search." / "A 2011 forum post by altoid advertised Silk Road." The drawn forum page is generic and illegible.
- **S_email** (irony) — in altoid's posting history a later Bitcointalk post (seeking a developer; its exact date was not in any extract) told
  applicants to email an address at Gmail that was Ross Ulbricht's own name; with a search warrant the IRS obtained the
  account's email from Google (NYT; Sophos; Vice; Network World). Narration: "Later, altoid gave his own Gmail address:
  Ross Ulbricht." The address is never spoken or shown in full (card: "A GMAIL ADDRESS · HIS OWN NAME").
- **S_ulbricht** — Ross William Ulbricht, 29, of San Francisco (from Austin, Texas), charged in Manhattan federal court as
  the operator (KQED 2013; Officer.com/AP; NPR; DOJ). Drawn only as an anonymous rim-lit silhouette.
- **S_encrypt** — agents wanted him arrested with the laptop open and unencrypted: FBI computer scientist Thomas Kiernan
  testified "We waited for an opportunity to arrest the defendant with his laptop open to avoid encryption"; the
  undercover agent (Jared Der-Yeghiayan) said the aim was the computer "in an open, unencrypted state"; closing the lid
  would have encrypted the drive (PCWorld; Computerworld; Wired 2015; Yahoo/Business Insider). Narration: "Close the lid
  and it would encrypt. Agents needed it open."
- **S_fight** (the HOW; headline) — 1 October 2013, the science-fiction section of the Glen Park branch of the San
  Francisco Public Library: Kiernan stood behind him to photograph the screen while two other agents "posed as a bickering
  couple to create a diversion"; agents then grabbed the laptop before he could close it; he did not resist (PCWorld;
  Computerworld; Yahoo/Business Insider: "staged a lovers' fight"; KQED; Officer.com/AP; Police1; Wired). Narration: "So
  two agents staged a loud fight behind him." / "He looked up. An agent grabbed the laptop". Headline: "A FAKE FIGHT IN A
  LIBRARY / CAUGHT THE SILK ROAD FOUNDER". The agents are generic and unnamed on screen.
- **S_admin** — photographs of the screen showed him logged into the "mastermind" administrator panel as Dread Pirate
  Roberts; at that moment he was chatting with the undercover agent on the site's staff chat; the laptop's single
  account, "Frosty", was signed in (Vice; PCWorld; Wired; CBC). Narration: "still logged in as the admin." Card: "LOGGED
  IN AS THE ADMIN · ACCOUNT: 'DREAD PIRATE ROBERTS'". The drawn panel is generic placeholder blocks.
- **S_verdict** — Wednesday 4 February 2015: a Manhattan federal jury convicted him on all seven counts after less than a
  day (Reuters via NBC; NPR; ITV; DOJ). Narration: "He was convicted on all seven counts".
- **S_sentence** — Friday 29 May 2015: Judge Katherine B. Forrest sentenced him to life without the possibility of parole
  (two life terms plus 20, 15 and 5 years, concurrent) (DOJ; Wired; CoinDesk; Silicon Republic/Guardian; Network World).
  Narration: "life without parole."
- **S_pardon** — 21 January 2025: President Trump announced a "full and unconditional pardon" on Truth Social; Ulbricht,
  after 11 years in prison (USP Tucson), was released (The Washington Times; AP via News4Jax; Al Jazeera 24 Jan 2025;
  Yahoo News). Narration, as fact only: "In 2025 he was pardoned, and released." The end question ("WAS THE PARDON
  RIGHT? YES OR NO?") is the viewer's; the narration gives no opinion.

## Legal status (verified 2026-10-13, extracts only)
- Convicted February 2015; sentenced May 2015; pardoned 21 January 2025 and released. Appeals between 2015 and 2025 were
  not researched (nothing in the episode depends on them). No later development found in extracts.

## Conflicts noted (not narrated)
- Sales: $1.2 billion (2013 complaint, bitcoin converted at 2013 rates; one extract says "up to $1.3 billion") vs "more
  than $200 million" / $213 million (DOJ and prosecutors at sentencing, 2015). The DOJ figure is used.
- Launch: "January 2011" (complaint) vs "February 2011". Narration and card say "2011" / "2011-2013".
- Deliberation: "less than a day" (Reuters) vs "about three and a half hours" (Bloomberg/ITV). Not narrated.
- The library scene: "two agents posed as a bickering couple" (Kiernan's testimony) vs AP's "half a dozen agents burst
  in". Narration says "two agents staged a loud fight behind him" (the quarrel), and the other agents are shown walking
  in as the arrest is made. The name of the agent who grabbed the laptop varies by account; none is named on screen.
- Sentence: "life" (Wired) vs "two life terms plus 20, 15 and 5 years" (Guardian via Silicon Republic). Narration: "life
  without parole".
- Release: "freed the same day" (Yahoo/Dallas Express) vs no time given (AP). Card: "RELEASED AFTER 11 YEARS".

## Myths and claims NOT used
- The murder-for-hire allegations (never tried; not part of the New York conviction): NOT mentioned, per the assignment.
- Any claim about what Ulbricht typed, said or believed; the diary and chat-log contents; the "Frosty" account name on
  screen; the defence's frame-up theory (noted in the ledger only).
- "The FBI couldn't find him": not claimed; the narration says agents knew him only as Dread Pirate Roberts (card).
- The bitcoin seizure amounts (26,000 BTC / 144,000 BTC): not used.
- The IRS agent's name (Gary Alford) and the undercover agent's name are not on screen: "agents generic and unnamed".

## Ethics decisions
- Ulbricht is a convicted (later pardoned) real person: drawn ONLY as an anonymous rim-lit silhouette (`real_person: true`,
  "not a likeness"), seated at the laptop or standing in court; never posed heroically; the shot tag is
  'ILLUSTRATION · NOT A LIKENESS'.
- The pardon is stated as fact with no opinion in narration; the debate is the viewer's, in the burned-in end question.
- No drugs, listings, money, weapons or victims are drawn. The market is a dark room and a typed card.
- The Gmail address is never shown or spoken in full ("his own Gmail address"); the forum page and the admin panel are
  illegible placeholder graphics, not replicas; the library is a generic reading room, not the Glen Park branch; every
  card is our own typed graphic; no FBI, IRS, court or police material is imitated.
- No dialogue is invented. The agents' staged quarrel is shown as gestures only.
