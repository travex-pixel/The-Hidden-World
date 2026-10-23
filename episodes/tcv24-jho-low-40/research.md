# Case File 24 (40-second "money and supercars" cut): 1MDB and Low Taek Jho ("Jho Low"). Research ledger

- **Episode:** `tcv24-jho-low-40`. A new case, not a cut of an earlier episode.
- **Research date:** 2026-10-12. Legal status verified as of this date.
- **Status:** OPEN for Low. He has **never been tried**, faces criminal charges in the US and Malaysia, is a fugitive whose whereabouts are **not officially confirmed**, and **denies wrongdoing**. Others have been convicted (below).

## Method and limits

- **Only search-result extracts were used.** WebFetch and curl are blocked here. Every claim comes from WebSearch result summaries of the URLs cited; no full page was read, and quotes are as the extracts gave them.
- **Searches:** 13 WebSearch calls in standard mode (cap 15).
- **justice.gov pages** came back as partial extracts. The "more than $4.5 billion" figure is attributed to the Justice Department by Al Jazeera and NPR (Oct 2019) and repeated by Free Malaysia Today (2026); I did not see it in the justice.gov extract itself. It is narrated as "US prosecutors say".
- **Labels:** VERIFIED = at least two independent reputable sources (DOJ, AP, Reuters, Al Jazeera, NPR, CNN, SCMP, Malaysian outlets of record). Wikipedia, aggregators and yacht-broker blogs are pointers only.

## Established facts (claim ids match `episode.json`)

| Claim | What is said or shown | Sources |
|---|---|---|
| `J_fund` | 1MDB is a Malaysian state (sovereign wealth) fund | DOJ 2016 release; Al Jazeera 2019; CNN 2025 |
| `J_redgranite` | Red Granite Pictures agreed (March 2018) to pay $60 million to settle the forfeiture suit, admitting no wrongdoing (card only) | CNBC/Reuters 2018-03-07; Inquirer/AP |
| `J_seize` | 28 Feb 2018: Indonesian police, at US request and with the FBI, seized the Equanimity at Benoa Bay, Bali; Low was not aboard (crew only) | BenarNews; Free Malaysia Today; Dockwalk (citing WSJ: FBI request 21 Feb) |
| `J_sold` | Handed to Malaysia in 2018; Malaysia sold it to Genting in April 2019 for $126 million (card only) | Inquirer/AP; The Edge Singapore |
| `J_settle` | Oct 2019: Low and family settled 13 US civil forfeiture cases, assets in the US, UK and Switzerland worth more than $700 million; no admission of guilt or liability; criminal charges unaffected | DOJ (USAO CDCA) 2019; Al Jazeera; NPR; Malay Mail |
| `J_najib` | Najib Razak: convicted July 2020 (SRC International, 12 years, later halved by a pardons board); convicted 26 Dec 2025 in the main 1MDB trial (4 abuse of power, 21 money laundering; 15 years, plus fines; the AP and Gulf News fine totals differ, so no fine is shown). He denies wrongdoing; his lawyer said he would appeal | CNN (KVIA/KEYT) 2025-12-26; AP (Yahoo) 2025-12-26; OCCRP 2020 |
| `J_bankers` | Roger Ng: convicted by a Brooklyn jury April 2022, sentenced to 10 years March 2023 (appealing). Tim Leissner: pleaded guilty 2018, sentenced to 2 years on 29 May 2025 | Al Jazeera 2023; AP 2023; Al Jazeera 2025; SCMP 2025 |
| `J_status` | Low has never been tried. In May 2026 Malaysian police were still verifying a claim that he was in Malaysia late in 2025; in July 2025 the Home Minister said Shanghai reports had no verifiable evidence. He has consistently denied wrongdoing | FMT 2026-05-16; The Sun 2026; The Vibes 2025; Fortune 2022 |

Also verified but NOT on screen: Pras Michel was convicted on 10 counts in April 2023 and sentenced to 14 years on 20 Nov 2025 (Al Jazeera; Malay Mail; he said he would appeal).

## Allegations (attributed in narration and on screen)

| Claim | Allegation, and who makes it | Sources |
|---|---|---|
| `J_hook` | The Justice Department said 1MDB officials and associates, including Low, siphoned more than $4.5 billion (2009–2015) | Al Jazeera 2019; NPR 2019; FMT 2026 ("at least US$4.5 billion", charges) |
| `J_yacht` | DOJ officials (2017) said the ~$250 million Equanimity was bought with money taken from 1MDB (The Edge gives "over $260 million"; not shown) | BenarNews; FMT; Dockwalk |
| `J_low` | Prosecutors put Low at the centre; he is "wanted for his leading role" (Al Jazeera) and faces US and Malaysian charges; he denies it | Al Jazeera 2025; FMT 2026; DOJ 2019 |
| `J_jet` | DOJ: a Bombardier Global 5000 bought for $35.4 million in 2010 with allegedly misappropriated funds; the 2016 actions sought 17 assets including a jet | Arab News (Reuters); Malaysiakini |
| `J_party` | Prosecution evidence at the Ng trial described lavish Las Vegas parties (a ~$3.6 million invoice for one party); DOJ said he gambled away millions of allegedly misappropriated money | The Malaysian Insight; Fortune; Vice |
| `J_assets` | DOJ forfeiture actions: luxury real estate, more than $200 million in art (Van Gogh, Monet and others), diamond jewellery | DOJ 2016; DOJ 2024; The Edge/Bloomberg 2016 |
| `J_film` | Attorney General Lynch (2016): associates allegedly used 1MDB proceeds to help fund The Wolf of Wall Street | DOJ 2016; The Edge 2016; CNBC 2018 |

## Narration (9 scenes)

1. "US prosecutors say over $4.5bn was siphoned from a Malaysian state fund." / "And some of it, they say, bought a superyacht." (`J_hook`, `J_yacht`)
2. "The fund was 1MDB. Prosecutors put financier Jho Low at its centre." (`J_fund`, `J_low`)
3. "They say the money paid for a private jet," (`J_jet`)
4. "lavish parties, mansions, diamonds and a Van Gogh." (`J_party`, `J_assets`; still governed by "They say")
5. "Even The Wolf of Wall Street, the Justice Department says." (`J_film`; card: `J_redgranite`)
6. "In 2018, at US request, Indonesia seized the superyacht in Bali." (`J_seize`; card: `J_sold`)
7. "In 2019 Low gave up over $700m in assets, admitting no guilt." (`J_settle`)
8. "Others were convicted, including a former prime minister." / "Low has never been tried, and he denies wrongdoing." (`J_najib`, `J_bankers`, `J_status`)
9. "Billions, prosecutors say. And one superyacht." (`J_hook`)

Hook headline: "PROSECUTORS: BILLIONS TAKEN FROM A STATE FUND" / "AND SOME BOUGHT A SUPERYACHT" (attributed; the DOJ alleges the yacht was bought with 1MDB money).

## Myths and claims NOT used

- **Celebrity names and payments** (an actor's reported fee, named party guests, the 30th-birthday guest list): trial testimony about named people who were never charged. Not named or depicted.
- **"Low stole $X personally"**: figures vary by source ($700m Fortune vs $1.42bn per FBI testimony, Vice). Not used.
- **The "about $1 billion" settlement total** (media sum of the $700m plus earlier forfeitures): only the DOJ's "more than $700 million" is used.
- **Where Low is** (Shanghai, Macau, Malaysia claims) and the reported pardon bid: unverified; only "whereabouts not confirmed" is shown.
- **The yacht's purchase price ($250m vs $260m), its length, and its later name or owner's use**: not narrated.
- **"Billions vanished"** (the series.json title wording): kept for the platform title only; the burned-in headline and narration use the attributed "prosecutors say ... siphoned / taken".

## Ethics decisions

- Low has not been tried: every allegation is attributed; "admitting no guilt" is narrated with the settlement; "he denies wrongdoing" is narrated and shown on a card; he appears only as an anonymous silhouette (`jl24_low`, real_person, not a likeness), never with money, never in a dock, cell or handcuffs.
- Najib Razak, Roger Ng and Tim Leissner appear only as typed text on one card; none is drawn.
- No celebrity is named or depicted; party guests are anonymous silhouettes.
- Yacht, jet, mansion, harbour and courtroom are generic: no names, flags, liveries, logos or registration; police uniforms carry no insignia. No painting is reproduced (frames show abstract colour fields).
- No document, court paper, banknote or photograph is imitated: every card is the series' own typed graphic.
