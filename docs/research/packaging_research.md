# YouTube Packaging Research: Thumbnails and Titles for an Absurd-but-True History Channel

Prepared 2026-10-11 for an animated watercolour history channel whose point-of-view character is "You" (second person). The recurring avatar is defined in `characters/pov.json` (amber signature colour `#e0a14a`, chestnut hair with an upright cowlick, big amber eyes, freckles, brown wool tunic `#8c6a3f`).

## 0. How to read this report

**Evidence labels used throughout**

| Label | Meaning |
|---|---|
| **[OFFICIAL]** | YouTube/Google documentation, YouTube blog, or statements by YouTube staff |
| **[DATA]** | Quantitative analysis: peer-reviewed study, or a practitioner dataset with a stated sample |
| **[INSIDER]** | Statements by people who run top channels (MrBeast team, strategists), including the leaked MrBeast doc |
| **[LORE]** | Widely repeated practitioner advice with no controlled evidence found |
| **[OPINION]** | My own design inference or recommendation, derived from the sources but not measured by them |
| **Strength** | **Strong** = official documentation or peer-reviewed/large data that agree; **Moderate** = consistent insider and practitioner evidence, or large but correlational data; **Weak** = single vendor blog, anecdote, or unverified snippet |

**Method and limits (please read)**

- **WebFetch was blocked.** `support.google.com` failed DNS resolution in WebFetch, and direct HTTPS through the agent proxy returned `403` on CONNECT (for example to `werd.io`, `en.wikipedia.org`, `www.google.com`). **No page was opened in full.** Every claim below comes from **search-engine result snippets**, which are summaries and may paraphrase. Quotes are given as the snippets reproduced them. Numbers are as reported and were not re-checked against the primary page. Every source in Section 14 is therefore marked "search snippet only".
- **The search budget ran out.** The session hit the 200-searches-per-turn cap near the end, so some threads stay open. They are listed in Section 13 (for example Film Booth's exact advice, view counts for specific "medieval peasant" videos, and Historia Civilis or Jacob Geller packaging).
- Vendor studies (vidIQ, AIR, OverseerOS, OutlierKit, Thumbnail Bench, Eden, Spotter) come from companies that sell growth tools. They are correlational, and their methods were only partly visible in snippets.
- The historical "facts" used in the title examples (Section 9) come from general historical knowledge. They were **not** researched in this session and must be checked by the channel's research step (`docs/RESEARCH_TEMPLATE.md`) before use.

---

## 1. Executive summary: the 10 rules that matter most

| # | Rule | Why (one line) | Strength | Key sources |
|---|---|---|---|---|
| 1 | **Win watch time per impression, not clicks.** A thumbnail or title only "wins" if the people it brings in keep watching. | YouTube's own A/B tool picks winners by watch time (share), not CTR. Its CTR FAQ says high CTR with low view duration looks like clickbait and gets recommended less. Its ranking model predicts expected watch time rather than click probability. | **Strong** | S1, S2, S3, S6, S17, S19 |
| 2 | **Pay off the promise in the first 30–60 seconds.** Show the absurd thing early, then keep paying it off. | YouTube's creator liaison: "reward that click immediately in the intro and keep paying it off right to the very end". The leaked MrBeast doc says the first minute must show the thumbnail's promise is met, and to front-load information. | **Strong** (official plus insider) | S4, S28, S29, S33 |
| 3 | **Absurd is allowed; false is not.** Every element in the title or thumbnail must appear in the video. | Misleading metadata or thumbnails is a Community Guidelines violation. In Dec 2024 YouTube started removing "egregious clickbait" (India first, news and current events). Experiments show clickbait headlines lower perceived credibility. | **Strong** | S8, S9, S10, S69 |
| 4 | **Package before you produce.** Write the title and draw the thumbnail before scripting, and make 10–50 variants. | The MrBeast team settles title and thumbnail before filming and makes ~20–50 concepts per video. Galloway and Lawrence both put "packaging first". | **Moderate** (insider, consistent) | S30, S33, S34, S53, S54, S55 |
| 5 | **One idea, readable in a glance:** at most 3 focal elements, checked at phone size. | YouTube Help: keep designs uncluttered and check them at small sizes. MrBeast's thumbnail lead: complex thumbnails make people scroll. Galloway's "glance test". A peer-reviewed study finds an inverted-U between thumbnail visual complexity and popularity. | **Moderate–Strong** | S5, S34, S52, S72 |
| 6 | **Be specific and concrete, not vaguely mysterious.** Name the absurd thing (a pig, a chicken, a millstone, a number). | Vague curiosity-gap titles did no better than controls on average (median 0.92x vs 1.00x) but had a fatter outlier tail. Outlier titles promise something new in a familiar shape: a number, a named thing, or a counter-expectation claim. | **Moderate** | S49, S51, S65, S68 |
| 7 | **Title and thumbnail must complement, never repeat.** The thumbnail shows the scene; the title adds the context (or the reverse). | Galloway: check whether they "compliment each other or contradict/repeat". Widely repeated practitioner advice. | **Weak–Moderate** (lore) | S52 |
| 8 | **Short, front-loaded titles, about 30–50 characters.** Put the key words first. | YouTube Help: keep titles short and put important words first, because they get truncated. Vendor datasets favour roughly 20–50 characters, though one dataset found no length effect. | **Moderate** | S5, S43, S44, S45 |
| 9 | **A clear character face helps on average, but it is not magic. Prefer a readable, specific emotion over the generic shock face.** | Faces appear in 69–80% of breakout thumbnails, but also in about 82% of underperformers. Shocked expressions appear on only 5–11% of faces in large samples. MrBeast's closed-mouth thumbnails won 30 A/B tests in a row on watch time. | **Moderate** | S35, S37, S38, S39, S40, S33 |
| 10 | **Hype typography is not a lever, especially in education.** Avoid ALL-CAPS titles, "SECRET/TRUTH" words and stacked "?!". Test whether a question works rather than assume it does. | YouTube says to limit all caps, and a YouTube PM said viewers feel "yelled at". In one 11-niche study, all caps was negative in Education. "Secrecy/reveal" wording came in at 0.87x baseline. Question-ending titles were 0.82x in one study and null in another, but positive in Education in a third. | **Moderate** | S5, S18, S43, S46, S47, S48 |

**Bottom line for this channel.** The format ("You" + absurd-but-true medieval fact + watercolour) suits curiosity packaging well, *provided* each video opens on the absurd fact it advertises. The main risks are not policy strikes, since egregious-clickbait enforcement targets news, but **retention loss** from overpromising, **credibility loss** with a history audience that polices accuracy, and **blending in** with the flood of AI-made "you wake up in medieval times" and "boring history" videos (S82, S83).

---

## 2. What YouTube itself says (official guidance and data)

### 2.1 Test & Compare / A/B testing: confirmed to optimise for watch time, not CTR
- **[OFFICIAL] Thumbnail Test & Compare** (help page S1): up to three thumbnails, shown evenly to viewers. The winner is chosen by **watch time share**. YouTube's own explanation is that tools optimising solely for click-through rate "may pick a different winner", and that it believes watch time share "will best support creators' growth". Results are labelled Winner, Preferred or None. Final results take from a few days up to two weeks, and thumbnails that look too similar may produce no clear result. **Strength: Strong (confirmed).**
- **[OFFICIAL] Why watch time and not CTR** (S3, "Rene's Top Five", June 14, 2024): the tool reports watch time because watch time includes both the click and the retention. Over-indexing on CTR "could become click-bait", which can hurt retention. S19 quotes YouTube as "optimizing for overall watch time share over other metrics".
- **[OFFICIAL] Title testing added** (S2, help page "A/B test titles & thumbnails"): creators can test up to three titles, or title-and-thumbnail combinations. The one "with the highest watch time will be shown to all viewers". If none clearly wins, the first uploaded option is used. It is desktop YouTube Studio only, requires advanced features, and is not available for Shorts, scheduled livestreams or Premieres (Live Archives are allowed). Trade press dates the broad title-testing rollout to **9 Dec 2025** after a mid-2025 experiment (S20, S21).
  - Unverified third-party claim: title testing is said to be unavailable for "Made for Kids", age-restricted and private videos. This matters for an animated channel (see 5.9).
- **Practical meaning:** a cartoon "absurd object" thumbnail that lifts CTR but brings in viewers who leave will **lose** in YouTube's own test. Your absurdity has to be the real content.

### 2.2 How CTR, view duration and satisfaction interact
- **[OFFICIAL] CTR FAQ** (S6): a thumbnail is likely clickbait if it has **high CTR but low average view duration and lower-than-expected impressions**, and clickbait "tends to get recommended less". Videos with fewer impressions often show higher CTR and view duration. A secondary source reports YouTube saying half of all channels sit between 2% and 10% CTR (S86, unverified).
- **[OFFICIAL] CTR falls as reach grows** (S7, "Decoding CTR & impressions"): as a video reaches wider audiences, CTR can drop. YouTube's example is 10,000 impressions at 9% CTR becoming 100,000 impressions at 3.5% a week later, which YouTube frames as more reach, not decline. Home generates many impressions at lower CTR. **Do not panic about falling CTR on a growing video.**
- **[OFFICIAL] Where to read CTR** (S5): check CTR on Home and Suggested in the **first 24 hours** for videos with above-average impressions, and check the Subscriptions feed for core fans.
- **[OFFICIAL] Satisfaction / "valued watchtime"** (S15): YouTube surveys viewers to rate videos from 1 to 5 stars. Only 4–5 star watch time counts as "valued", and a model predicts survey answers for everyone else. In a Creator Insider segment (reported by S16), a YouTube PM said "We serve out millions of surveys per month", and that discovery looks at "both relative and absolute watch time". Likes, dislikes and "not interested" are also reported as satisfaction inputs (secondary).
- **[DATA/OFFICIAL] Historical design rationale** (S17, Covington et al., Google, RecSys 2016): the ranking model was trained to predict **expected watch time** rather than click probability. A widely cited summary (S17b) quotes the motivation: ranking by CTR "often promotes deceptive videos that the user does not complete ('clickbait')". The exact phrase "expected watch time per impression" could not be confirmed in snippets.
- **YouTube does not publish weights.** Claims that "satisfaction now outranks watch time" (seen on several vendor blogs) are unofficial. **Strength: Strong** for the direction (watch time and satisfaction gate distribution), **Weak** for any specific weighting.

### 2.3 Official thumbnail and title tips (S5)
- **[OFFICIAL]** Design for two audiences. Content for **subscribers** can highlight familiar features. Content for **casual viewers** should use "more universally relatable actions and emotions" (YouTube's example: "a shocked face").
- **[OFFICIAL]** Keep thumbnails uncluttered and check how they look at small sizes across devices.
- **[OFFICIAL]** Titles should be accurate, short and front-loaded, because viewers may see only part of a title. Limit ALL CAPS and emoji to emphasis. If a title misrepresents the video, viewers may stop watching, "which can impact discoverability".
- **[OFFICIAL, 2018]** A YouTube group PM, Todd Beaupré, said in a Creator Insider Q&A that viewers liken all-caps titles to being "yelled at", that systems tend not to recommend off-putting videos to people who dislike that, and advised "just do a regular title" (S18).

### 2.4 Policy: misleading metadata, "egregious clickbait", inauthentic content
- **[OFFICIAL] Spam, deceptive practices & scams policy** (S8): "Misleading metadata or thumbnails" means "using the title, thumbnails or description to trick users into believing that the content is something that it is not". The policy explicitly includes metadata that leads viewers "to believe that they will see something in a video, but then not including it".
- **[OFFICIAL] Egregious clickbait, confirmed** (S9, Google India blog, **18 Dec 2024**; corroborated by S10, S11, S12): YouTube said it was "strengthening our efforts to tackle egregious clickbait", meaning titles or thumbnails that promise something the video does not deliver, **focused on breaking news and current events**. It was rolled out "slowly ... in India over the coming months". Initially violating videos are **removed without a strike**, with enforcement later prioritising new uploads. The examples given were a title claiming "the president resigned" when the video never covers it, and a "Top Political News" thumbnail on a video with no news. A YouTube spokesperson (Jack Malon, via The Verge, reported in S13) said it would extend to more countries. **No confirmation of any expansion beyond India was found** in 2025–2026 coverage, and MediaNama noted the definitions were unclear (S12).
  - **Relevance to this channel:** historical topics are outside the news focus, but the general misleading-metadata policy (S8) still applies. Never show an object, event or claim in the thumbnail that the video does not contain.
- **[OFFICIAL, via trade press] Inauthentic / mass-produced content** (S22): YouTube updated its Partner Program guidelines on **15 July 2025** to better identify "mass-produced and repetitious" content, described by TeamYouTube as a "minor update" to long-standing rules. This is relevant because the medieval "POV / boring history" niche is flooded with templated AI videos (S82). An animated, scripted, researched series should keep visible human authorship and variety, and avoid one identical template per upload.

### 2.5 Specs and screens
- **[OFFICIAL]** Custom thumbnail: **1280×720** (minimum width 640), JPG/GIF/PNG, under **2 MB**, 16:9 preferred (S14).
- **[OFFICIAL, older]** YouTube said at DMEXCO 2018 that more than 70% of watch time was on mobile (S24, secondary). No current official figure was found.
- **[DATA]** TV is now a major YouTube screen. Nielsen's Gauge put YouTube at **13.4%** of all US TV usage in July 2025 (S25). Thumbnails must work both at phone-feed size and on a living-room TV. **[OPINION]** Simple, high-contrast compositions survive both; fine watercolour texture only reads on TV.

---

## 3. The MrBeast evidence

### 3.1 The leaked "How to Succeed in MrBeast Production" document (Sept 2024)
Authenticity: posted by Rosanna Pansino, who said a former employee sent it to her. One report says two former producers confirmed it and a spokesperson declined to comment, while other outlets call it unverified (S26, S27, S30). Treat quotes as reported, not verified against the PDF (S32 appeared in results but could not be opened).

- **[INSIDER] Three metrics:** CTR, AVD (average view duration) and AVP (average view percentage) (S27, S31). One summary reports the line "CTR is what dictates what we do for videos" (S27).
- **[INSIDER] Title wording and extremity:** retitle "I Spent" as "I Survived" because it "would add more intrigue and make it feel more extreme. In general, the more extreme, the better" (S27, S28).
- **[INSIDER] Idea must be clickable:** a "50 hours in my front yard" video is lame and you would not click it, but you would click "I Spent 50 Hours In Ketchup" (reported in coverage of the leak; results included GIGAZINE, OMR and Passionfruit, and the exact wording is unverified).
- **[INSIDER] Packaging comes first:** title and thumbnail are settled before production (S30).
- **[INSIDER] First minute:** the first minute must hook viewers and show the thumbnail's promise is met (S29). "We lost 21 million viewers in the first minute" (quoted as still above platform average) and "match the clickbait expectations and front-load as much information about the video as possible" (S28).
- **[INSIDER] "Wow factor" is separate from packaging:** lifting a house on a crane about 30 seconds into a video "didn't add anything to the title and thumbnail" but helped retention (S28).
- *Not confirmed:* the exact sentence "the title and thumbnail are the most important" did not appear in any snippet. The document's emphasis on CTR and on packaging-first workflow is, however, consistently reported.

### 3.2 Interviews with the MrBeast team (Chucky Appleby, thumbnail lead)
- **[INSIDER]** The team creates the title and thumbnail **before filming**. Donaldson's face has been in thumbnails since 2019 for recognition. They develop about **50 title and thumbnail concepts per video** and narrow them down. Earlier coverage repeats a self-reported "**~$10,000 per thumbnail**, up to **20 variations**" (S33).
- **[INSIDER]** "Trust is key": deliver on the thumbnail promise early, because viewers can leave any time (S33). Thumbnails must be **simple**, since complex ones make viewers scroll, and the team may test up to 50 thumbnails (S34).
- **[INSIDER/DATA-lite] Closed mouth beats open mouth:** MrBeast tweeted (6 Sept 2023) that he closed his mouth in all thumbnails and watch time rose. Appleby said **30 closed-mouth tests in a row** won on watch time, with a small but consistent difference (S33, S35). No numbers were published.
- **[INSIDER]** Origin story: Appleby found MrBeast's early thumbnails "horrible" and refocused them on Donaldson's expressive face (S36, The Ringer, 2026).

### 3.3 What transfers to a watercolour history channel [OPINION, grounded in the above]
- **Transfers:** packaging-first workflow; many variants; one simple visual idea; consistent recognisable character face; first-minute payoff; testing by watch time.
- **Does not transfer:** "the more extreme the better" when the extremity is invented. A history audience punishes inaccuracy (critics run "bad history" tier lists of big channels, S85; forum users advise avoiding titles with "the Truth", S84). Extremity must come from a **true** fact, such as a pig tried in court or rent paid in hens, never from exaggeration.

---

## 4. What works (with evidence)

### 4.1 Workflow
- **Package first, then script.** [INSIDER] S30, S33. Galloway: "reallocating time toward ideas, thumbnails, and packaging" is the biggest shift he makes inside channels (S53). Lawrence's interview has a segment titled "Packaging Comes First" (S55). **Strength: Moderate.**
- **Make many variants.** [INSIDER] MrBeast ~20–50 (S33, S34). Galloway recommends **10–20 thumbnail and title variations**, then getting feedback (S54). **Moderate.**
- **Test natively and refresh under-performers.** [OFFICIAL] S1, S2. [DATA, weak to moderate] Vevo reported about **12%** more views in the first 20 days across ~4,000 catalogue videos after thumbnail refreshes (S58, S58b; other accounts give a smaller sustained gain of "over 5%", S58c). Primal Video shows two TubeBuddy tests where the winning thumbnail drew 45.2% and 33.8% more clicks, without isolating the design change (S63). Ali Abdaal reported a video going from **300,000 to 1.1M** views after a tested thumbnail change (S57, self-reported). Veritasium's Derek Muller says retitling and repackaging is routine and argues for "legit bait", meaning enticing but accurate packaging (S59). **Moderate.**

### 4.2 Thumbnails
| Principle | Evidence | Label / strength |
|---|---|---|
| **Simplicity, one dominant idea, readable at a glance** | YouTube Help: uncluttered and small-size check (S5). Appleby: simple, because complex ones get scrolled (S34). Galloway: "glance test: can you process everything in just a quick glance?" (S52). vidIQ: one focal point, clean layout (S42). | OFFICIAL + INSIDER, **Moderate–Strong** |
| **Moderate complexity, not minimal and not busy** | Fang et al. 2026 (*J. Academy of Marketing Science*), 22,958 thumbnails with panel models and two experiments: **visual complexity has an inverted-U relationship with popularity**, and coherence a U-shape. Effects were stronger for "utilitarian" and "highly typical" videos (S72). | DATA (peer-reviewed), **Strong** for the curve shape. Exact optimum unknown. |
| **≤3 focal elements** (face, object, text) | Practitioner "three element rule" (multiple guides). Galloway reportedly advises "3 or less focus areas" (search synthesis; underlying page not identified). | LORE, **Weak–Moderate** |
| **Faces / characters** | vidIQ: a face appears in **69%** of 500 breakouts, 75% of the top 100 and 80% of the top 50 (S37). **But** a 300K-video dataset found faces perform "about the same" as no faces, with niche differences (S38). Eden reports faces in **84.2%** of breakout thumbnails versus **82.2%** of underperformers (S39). Thumbnail Bench: faces on **71%** of 11,223 thumbnails from 1,043 channels (S40). | DATA (correlational), **Moderate**: faces are the norm, not a proven cause. |
| **Expression: clear and specific beats the generic shock face** | Shocked/surprised appears on only **11%** of faces in Thumbnail Bench (neutral 35%, happy 32%; about a quarter in Gaming, 3% in Fitness) (S40). vidIQ: about **5%** exaggerated shocked expressions among breakouts (S37). Kapwing: surprise and happiness each about **27%** of top creators' thumbnail faces, and happy or surprised faces linked to views (S41, S41b). MrBeast's closed-mouth result (S33, S35). | DATA + INSIDER, **Moderate** |
| **Short text** | vidIQ: **72%** of breakouts had overlay text, with a **median of 5 words** (S37). Galloway reportedly suggests "4–5 impactful words" (S54, secondary). Many guides say ≤3–4 words, but Thumbnail Bench headlines a section "Word Counts Undercut the 'Three Words Maximum' Guidance" (figures not visible) (S40). | DATA + LORE, **Moderate**: "short" is solid, "exactly 3" is lore. |
| **Contrast** | vidIQ: high contrast in **56%** of breakouts, and **89%** used a face, high contrast or both (S37). vidIQ guide: light-on-dark or dark-on-light text, and colours that stand out from YouTube's red/black/white interface (S42). Guides note YouTube's dark background is `#0f0f0f` against white in light mode, and say to test both modes (S61, S61b, S61c). | DATA + LORE, **Moderate** |
| **Emotion in thumbnail images vs. captions** | Cui et al. 2024 (*J. Business Research*, about 16,000 videos): strong sentiment **in thumbnails** is associated with more views, while strong sentiment **in captions** is associated with fewer views (S71). | DATA (peer-reviewed), **Moderate** |
| **Consistent branding plus a novel core** | YouTube Help: subscribers respond to familiar features, casual viewers to universal emotions (S5). MrBeast's face as a constant since 2019 (S33). Fang et al.: effects of complexity are moderated by how "typical" a video looks (S72). | OFFICIAL + INSIDER, **Moderate** for the principle. No data found on the right ratio. |

### 4.3 Titles
| Principle | Evidence | Label / strength |
|---|---|---|
| **Front-load and keep short** | YouTube Help: short, front-loaded (S5). AIR (18,000 channels, 11 niches): **30–50 characters** performed best in almost every niche, and **90+** generally underperformed except search content (S43). Spotter (about 5,000 channels): **4–7 words / 20–45 characters** (S44). Counterpoint: ytgrowth (28,947 videos) found length did not predict performance (correlation 0.0046) (S45). Galloway reportedly: titles under 60 characters (secondary). | OFFICIAL + DATA, **Moderate** |
| **Specific promise in a familiar shape** | OutlierKit (case study of 6 outliers): titles promised "something new, in a shape people already recognise: a number, a named thing, or a claim that goes against what people expect" (S51). | DATA (tiny sample), **Weak–Moderate** |
| **Specific numbers, not decorative ones** | AIR: numbers help in Tech, Business, Fitness and Food, and do little elsewhere. A number that makes a **specific promise** helps more than a decorative one (S43). | DATA, **Moderate** |
| **Concrete situational formats** | vidIQ title-formula study (more than 4M 2026 uploads): "caught on camera" titles **>4x** average, "turning X into Y" **>3x**, "nobody knows" **>2.5x**, question endings **0.82x** (S46, S46b). Observational, with no history breakdown. | DATA (vendor), **Weak–Moderate** |
| **Second person ("You") at scale** | Kurzgesagt: "What If You Fall into a Black Hole?" about **19M** views and "You Are Immune Against Every Disease" about **19M** (OutlierKit estimates, S77). The Infographics Show runs "What If You…" titles (e.g., "What If You Were 1000 feet (300 meters) Tall", S78b). | Examples, **Weak–Moderate**: shows the frame can work at scale. Not a controlled test. |
| **Emotional valence** | News A/B tests (Upworthy, ~105,000 headline variants, 5.7M clicks): **each negative word raised CTR by about 2.3%**, positive words lowered it by about 1%, and sad words worked better than angry or scary ones (S64, S64b). **But** on video, Cui et al. found **positive** titles associated with more views (S71). | DATA (peer-reviewed), **Moderate, and mixed for YouTube** |

### 4.4 Title and thumbnail as one unit
- **[INSIDER/LORE]** Galloway: "view the title and thumbnail as one, do they compliment each other or contradict/repeat?" (S52). Guides repeat "thumbnail text should complement the title, not duplicate it".
- **[OPINION]** Practical rule: **the thumbnail shows the absurd situation, the title names the stakes or the "why", and the thumbnail text (≤3 words) voices You's reaction or question.** No word should appear in both the title and the thumbnail text.
- **[INSIDER]** Veritasium's "anti-clickbait" variant: answer the title's question in the thumbnail, so the video promises an explanation rather than the answer (S59c).

---

## 5. What does not work, and the risks

1. **Optimising CTR alone.** YouTube flags high CTR combined with low AVD as clickbait, and its A/B tool would pick a different winner (S1, S6, S3). **Strong.**
2. **Overpromising or showing things not in the video.** This is a policy violation (S8). It can mean removal where egregious-clickbait enforcement applies (S9). Viewers express frustration in comments on clickbait videos, and clickbait videos tend to collect more dislikes than likes (S70, S70b). Experiments show lower credibility and perceived quality (S69, S69b). **Strong.**
3. **Vague mystery titles.** Curiosity-gap titles: median **0.92x** vs **1.00x** control, but **27.6% vs 24.7%** reached a 2x-outlier rate, a "high-variance tool" (S49). Kuiken et al.: most clickbait features raised clicks in Blendle A/B data, but effectiveness could **not** be predicted from those features alone (S68). **Moderate.**
4. **Sensational words as a shortcut.** OverseerOS (2,309 videos, matched within channel): clickbait-style titles gave a median **1.03x**, shock words **1.06x**, danger words **1.04x**, and **secrecy/reveal words 0.87x** (S48). One forum historian's advice is to "avoid anything with the Truth in their title" (S84, anecdote). vidIQ's "nobody knows" at >2.5x (S46) conflicts with this, so **test it, don't assume it.** **Moderate.**
5. **ALL CAPS titles.** YouTube says to limit caps (S5), a YouTube PM described them as "yelled at" (S18), and AIR found all caps "actively negative" in Education (S43). OverseerOS saw no lift from caps (S50). **Moderate.** Thumbnail text in capitals is a different case: it is display type and is ubiquitous.
6. **Question-mark titles as a default.** vidIQ: question endings at **0.82x** (S46). OverseerOS: 891 matched pairs split **445 vs 446**, median ratio **1.000** (S47). AIR: questions are "strong positive" in Education, Business and Science & Tech (S43). Cui et al.: question-based clickbait titles were associated with fewer views (S71). **Mixed; decide by A/B test.**
7. **The generic open-mouth shock face.** It is declining. It appears on only 5–11% of faces in large samples (S37, S40), and closed-mouth expressions won MrBeast's tests (S33, S35). **Moderate.**
8. **Clutter: arrows, circles, many words, many objects.** No controlled study isolating arrows or circles was found. Guides say "one or two guides max" (LORE). Complexity has an inverted-U relationship with popularity (S72). **Weak** for arrows specifically, **Strong** for "not too busy".
9. **Blending into the "POV: you wake up in medieval times" / "Boring History for Sleep" flood.** 404 Media (Sept 2025) documented AI-generated history channels with near-interchangeable names and multi-hour videos (one 2-hour video at 2.3M views), plus historians' accuracy complaints (S82). The "POV: You Wake Up in 1351" format spread from TikTok to Shorts in 2025 (S83, unverified view counts). **[OPINION]** Generic titles like "How Medieval Peasants Survived Winter" now compete with infinite AI supply. Specific, named, funny, true facts plus a recognisable hand-made character are the moat. YouTube's July 2025 mass-produced content update (S22) points the same way.
10. **Made-for-Kids classification risk.** The FTC lists "animated characters" as one factor in deciding whether content is child-directed, but says bright colours or animation do not automatically trigger COPPA, and that subject matter matters most (S23). **[OPINION]** Keep topics, vocabulary and thumbnails aimed at a general or teen-adult audience. A Made-for-Kids designation would reportedly remove title testing (unverified third-party claim, see 2.1).
11. **Over-reading CTR drops.** Falling CTR during expansion is normal (S7).

---

## 6. Academic research on clickbait, curiosity and CTR vs. retention

| Study | Design | Finding relevant to packaging | Strength |
|---|---|---|---|
| Loewenstein 1994, *Psychological Bulletin* 116(1):75–98 (S66) | Review / theory | Curiosity is a deprivation state caused by a perceived **gap in knowledge**. This is the theoretical basis of the "curiosity gap". | Strong (foundational) |
| Blom & Hansen 2015, *J. Pragmatics* 76:87–100 (S67) | 100,000 Danish news headlines | **Forward-reference** ("this", "here's why", ellipsis, questions) is used as a lure, increasingly with commercialisation. | Moderate (descriptive) |
| Kuiken, Schuth, Spitters & Marx 2017, *Digital Journalism* 5(10) (S68) | Blendle newsletter original-vs-rewritten headline CTRs | Most, not all, clickbait features significantly raised clicks, but effectiveness could not be predicted from features alone. | Moderate–Strong |
| Scott 2021, *J. Pragmatics* 175:53–66 (S65) | Corpus plus relevance theory | Clickbait over-uses **definite referring expressions** and **superlatives/intensifiers** to open "files" that the headline does not fill. The click is a bet that the content will reward the reader. | Moderate (theory) |
| Molyneux & Coddington 2020, *Journalism Practice* (S69); clickbait-credibility experiment, n=200 (S69b) | Experiments | Clickbait headlines **lower perceived credibility and quality**. | Moderate–Strong |
| Robertson et al. 2023, *Nature Human Behaviour* 7:812–822 (S64) | Upworthy RCTs, ~105k variants, 5.7M clicks | Each negative word raised CTR by about **2.3%**, positive words lowered it by about 1%, and **sad words beat angry or fearful** ones. | Strong (news context) |
| Cui, Chung, Peng & Wang 2024, *J. Business Research* 183:114849 (S71) | AI sentiment on ~16,000 videos | Strong sentiment in **thumbnails** went with more views. Strong sentiment in **captions** and question-based clickbait titles went with fewer. **Positive titles** went with more views (sample size per S71b). | Moderate (correlational) |
| Fang et al. 2026, *J. Academy of Marketing Science* 54(3):815–837 (S72) | 22,958 thumbnails, panel models plus 2 experiments | **Inverted-U**: moderate visual complexity is best. Coherence is U-shaped. Effects are stronger for utilitarian or typical-looking videos. | Strong |
| Koh & Cui 2022, *Decision Support Systems* 160:113820 (S73) | 3,745 branded videos | Thumbnail informativeness (complexity) and aesthetics (colourfulness, brightness) relate to view-through. Specific results were not retrievable. | Unknown |
| Zannettou et al., "The Good, the Bad and the Bait" (S70); arXiv 2112.08611 (S70b) | YouTube clickbait detection | Clickbait videos attract frustrated comments and **more dislikes than likes**. Detection uses title, thumbnail and content mismatch. | Moderate |
| Covington et al. 2016, Google (S17) | Production recommender | Ranking predicts **expected watch time**, not click probability, to avoid rewarding clickbait. | Strong (industry) |

**Synthesis [OPINION]:** curiosity gaps reliably raise clicks in controlled news data. On YouTube, though, clicks are only an entry ticket: the system rewards completed, satisfying watch time (S1, S15, S17), and misleading packaging erodes credibility (S69). The winning move is a **specific, concrete gap that the video closes quickly and then widens again**. In practice: show the absurd fact, then promise the "why" and the consequence for You.

---

## 7. History and explainer channels: what their packaging shows

*View counts below are only those that appeared in search results, most from third-party trackers with unstated dates. Treat them as approximate.*

| Channel | Packaging pattern observed in results | Numbers found | Source |
|---|---|---|---|
| **Sam O'Nella Academy** | Deadpan, specific, often absurd named subjects: "Why It Sucked to Be a Pirate", "Dog Breed Deformities", "Why Produce Used to Suck" (2018), "Tarrare, the Hungriest Man in History", "Joshua Norton, the Only United States Emperor", "Timothy Dexter: The Dumbest Rags-to-Riches Story" (2020), "Zhang Zongchang, the Dogmeat General" (2023). Stick-figure art. | Channel more than 756M views (profile site). No per-video counts found. | S74, S75 |
| **OverSimplified** | Plain topic plus series brand ("WW2 - OverSimplified (Part 1)"). The brand is the promise. Faceless cartoon style. | WW2 Part 1 about **104M**, Cold War Part 1 about **74M**, WW2 Part 2 about **67M** (OutlierKit). | S76 |
| **Kurzgesagt** | Cosmic or bodily stakes plus second person: "What If You Fall into a Black Hole?", "You Are Immune Against Every Disease", "What Happens if the Moon Crashes into Earth?", "What if We Nuke the Moon?" | About **19M, 19M, 22M, 20M**, and "The Largest Black Hole in the Universe – Size Comparison" about **32M** (OutlierKit AI estimates). | S77 |
| **The Infographics Show** | "What If [extreme scenario]?", "[A] vs [B] – Who Would Win?", "What If You Were 1000 feet (300 meters) Tall". Thumbnails described as one dramatic image, bold white text with a dark drop shadow, no creator face but always a human element (third-party case studies). | About 15.5M subscribers, 6.8B views, ~1.1M average per video (OutlierKit). | S78, S78b, S78c, S78d |
| **Weird History** | "How Much It Sucked to Be a Medieval Serf" (2020, 13 min), "What It Was Actually Like to be a Knight During Medieval Times" (2019), "What Life Was Really Like as a Wild West Sheriff". The "what it was really like" and "how much it sucked" frames. | No view counts found. | S79, S79b |
| **Tasting History** | Concrete, experiential: "What it was like to visit a Medieval Tavern", "Dining Third Class on the RMS Titanic". | Channel about 963M views (Wikipedia). No per-video counts. | S80 |
| **Toldinstone (Garrett Ryan)** | Answers "specific, often counterintuitive questions about everyday life in antiquity". His books are framed as FAQs ("Naked Statues, Fat Gladiators, and War Elephants"). | About 631K followers (creator-stats site). | S81 |
| **Veritasium (science)** | Case study of a *descriptive* title failing: the dam basketball / Magnus-effect video drew 16.3M views in a week, mostly embedded off-platform, with very few views on YouTube itself. Muller attributes this to the title, and his talk distinguishes accurate "Type 1" bait from deceptive "Type 2" clickbait. | 8.3M views on the clickbait video itself (Rosetta). | S59, S59b, S59c |
| **AI "Boring History"** | Long, generic, sleep-oriented titles such as "Unusual Medieval Cures for Common Illnesses" and "How Medieval PEASANTS Survived the Coldest Nights". | One 2-hour video at 2.3M views. | S82 |

**Patterns that perform (synthesis):**
- **Named absurd subject + plain verb:** "Tarrare, the Hungriest Man in History", "Zhang Zongchang, the Dogmeat General". The absurdity is the noun, and the title stays calm.
- **Experiential frame:** "What it was like to…", "A day in the life…", "What If You…". This suits a "You" POV well (Kurzgesagt, The Infographics Show, Weird History, Tasting History).
- **Suffering-as-comedy:** "Why It Sucked to Be a…", "How Much It Sucked to Be a…".
- **Series brand as a promise:** OverSimplified's "– OverSimplified".

**Patterns abandoned or shown to underperform:**
- The **open-mouth shock face**, which MrBeast dropped after 30 tests (S33, S35) and which is now a minority in large samples (S37, S40).
- **Purely descriptive science titles** (Veritasium's own example, S59b).
- **Sensational filler words**: no reliable lift, and "secret/reveal" wording is negative (S48).
- **ALL CAPS titles** (S18, S43).
- **Generic "how medieval people survived X"** titles: **[OPINION]** this is now the AI-slop register (S82).
- *Not found:* specific evidence on Historia Civilis, Kings and Generals or Jacob Geller packaging changes. Kings and Generals is described as map-centred (no packaging data).

---

## 8. Absurd-but-true clickbait: doing it without killing retention or breaking policy

**The promise ledger [OPINION, built on S1, S4, S8, S28, S33]:** before publishing, write three lines:
1. **Promise:** what the title plus thumbnail make a viewer expect. *"A pig is on trial and I'm a witness."*
2. **Proof timestamp:** where the video delivers it. *"0:08 the pig is led into court; 0:20 narrator: 'This really happened, in Falaise, 1386.'"* Target: **first visual payoff ≤10 s, explicit confirmation ≤30 s, full context ≤60 s.** (YouTube: reward the click "immediately in the intro" (S4); MrBeast: the first minute must meet the thumbnail's promise (S29).)
3. **Open loop:** what new question keeps them watching after the payoff. *"…and the pig's owner had to pay for the executioner."*

**Rules:**
- **Clickbait is acceptable only when expectations are met.** Even growth vendors frame it this way: "if you're meeting viewers' expectations and satisfying their needs, what some call clickbait is just good marketing" (S60).
- **The absurd element must be literally true and on screen.** If the thumbnail shows a chicken, a chicken is in the video, and the claim attached to it is sourced. This is the line between Veritasium's "Type 1" (legit bait) and "Type 2" (deceptive) clickbait (S59b), and it is what YouTube's policy tests (S8).
- **Extremity from the fact, not from the adjectives.** "Why You Paid Your Rent in Chickens" is strange because it is true. "The INSANE Truth About Medieval Rent" is strange because it shouts, and both evidence and policy say shouting does not help (S18, S43, S48).
- **Second person is a promise of experience.** "You" titles promise that the viewer will *be there*, so the video must stay in POV, not drift into a lecture. **[OPINION]**
- **Close the gap, then open another.** Avoid "you won't believe…" withholding (Scott 2021, S65). Answer the headline quickly and replace it with a bigger question. This keeps retention, which is what YouTube's test measures (S1).
- **Calibrate humour for credibility.** Absurdity reads as playful when the tone is deadpan and specific (Sam O'Nella-style), and as "bad history" when it misstates facts (S84, S85). Put a small on-screen source card at the payoff moment. **[OPINION]**
- **Disputed facts get disputed framing.** If historians argue (for example animal trials' details, "medieval people worked fewer hours", segmented sleep), title it as a question or a myth check, not as settled fact.
- **Don't use news-style framing.** "BREAKING", "just discovered" and "scientists confirm" invite the current-events clickbait lens (S9) and are usually false for history anyway.

**Five-second pre-publish test:**
- (a) Can a stranger say what the video is about from the thumbnail alone in 1 second? (S34, S52)
- (b) Is every object and word in the thumbnail present in the first 60 seconds? (S8, S29)
- (c) Would a historian wince at the title? If yes, rephrase as a question or a myth check.

---

## 9. Title formulas: 15 templates with medieval-peasant examples

Constraints applied: ≤45 characters (inside the 30–50 band, S43), key noun in the first ~25 characters, sentence case, no ALL-CAPS words, and at most one punctuation device. Each title is paired with **thumbnail text** that complements rather than repeats it. **Every fact needs verification by the research step**; the "fact basis" column is my general historical knowledge, not sourced in this session.

| # | Template | Example title | Chars | Thumbnail text (≤3 words) | Fact basis to verify | Notes |
|---|---|---|---|---|---|---|
| 1 | Why You [did absurd-but-true thing] | Why You Paid Your Rent in Chickens | 34 | RENT DAY | Customary renders of hens (Christmas) and eggs (Easter) on English manors | Core series formula |
| 2 | You [ordinary event]. Now [absurd consequence]. | You Died. Now Your Lord Gets Your Cow. | 38 | HIS NOW? | Heriot (best beast to the lord); mortuary (second-best to the church) | Dark comedy, works with L1 or L5 |
| 3 | Why [ordinary thing] Was Illegal for You | Why Football Was Illegal for You | 32 | NOT THE BALL! | 1314 London proclamation; 1363 order favouring archery practice | "Illegal" framing; keep caps off |
| 4 | The [unexpected subject] Is on [situation]. You're the [role]. | The Pig Is on Trial. You're the Witness. | 40 | GUILTY? | Animal trials (e.g., Falaise pig, 1386; details debated) | Use L6 (selective colour) |
| 5 | A Day as a [role], Hour by Hour | A Day as a Medieval Peasant, Hour by Hour | 41 | YOUR SCHEDULE | Seasonal labour, week-work, boon-work | Matches roadmap Ep. 2 |
| 6 | [N] [specific things] You [did] as a [role] | 7 Weird Fees You Paid as a Medieval Peasant | 43 | 10% FIRST | Tithe, heriot, merchet, leyrwite, chevage, tallage, multure, entry fine | Number = specific promise (S43); thumbnail shows a *different* number |
| 7 | You Need [authority]'s Permission to [act] | You Need Your Lord's Permission to Marry | 40 | HOW MUCH? | Merchet (applied to unfree tenants; the video must explain the nuance) | Counter-expectation claim |
| 8 | Why [owning/doing ordinary thing] Got You [punished] | Why Owning a Hand Mill Got You Fined | 36 | HIDE IT | Suit of mill; fines for hand-querns; St Albans quern confiscation | Object-hero layout (L2) |
| 9 | You Were [punished] for [mundane failure] | You Were Fined for Brewing Bad Ale | 34 | TOO WEAK? | Assize of ale; ale-tasters; routine amercements of brewsters | Light, funny |
| 10 | [Group] Weren't [myth]. Here's Why. | Medieval Peasants Weren't Filthy. Here's Why. | 45 | BATH DAY | Washing practices; urban bathhouses ("stews") | Myth-bust; avoid "truth/secret" (S48) |
| 11 | Don't [civic duty]? Your [group] Pays. | Don't Chase the Thief? Your Village Pays. | 41 | RUN! | Hue and cry; tithings and frankpledge; amercement of townships | Collective-stakes hook |
| 12 | What [thing] Cost You in [year] vs Today | What a Cow Cost You in 1300 vs Today | 36 | 1300 / NOW (labels) | Price series for livestock and wages (source needed) | Split layout (L3); conversion method must be on screen |
| 13 | Tonight, You're the [worst job] | Tonight, You're the Gong Farmer | 31 | NIGHT SHIFT | Cesspit cleaners ("gongfermors") in medieval London (better documented in Tudor times) | Extreme close-up (L5) |
| 14 | [Option A] or [Option B]? Pick Your [fate] | Hot Iron or Hot Water? Pick Your Ordeal | 39 | PICK ONE | Trial by ordeal before the Fourth Lateran Council (1215) | Versus layout (L7) |
| 15 | [Myth statistic]? Not Exactly. | You Lived to 30? Not Exactly. | 29 | MEET GRANDPA | Low life expectancy at birth driven by infant mortality | Myth-check; deadpan |

**Question variant for A/B tests:** "Can You Survive One Medieval Winter?" (36). Evidence on question titles is mixed (vidIQ 0.82x, OverseerOS null, AIR positive for Education; S46, S47, S43), so pair it with a statement version, for example "One Medieval Winter, From Your Bed" (33), in YouTube's title A/B test (S2).

**Title A/B pairs to test first [OPINION]:**
- Why-frame vs. You-statement: "Why You Paid Your Rent in Chickens" vs "Your Rent Is Due. In Chickens."
- Question vs. statement (above).
- Number vs. named thing: "7 Weird Fees You Paid as a Medieval Peasant" vs "Your Lord Charged You to Die".

---

## 10. Thumbnail formulas: 8 layouts specified for programmatic composition

### 10.1 Global spec (applies to all layouts)

**Canvas and export.** 1280×720 px, sRGB, JPG quality 90 or PNG, under 2 MB (S14). Coordinates below are fractions of width (x) and height (y), origin top-left, with px in brackets.

**Reserved zones [OPINION / practitioner convention; verify with a previewer such as S61c]:**
- **Duration badge:** keep x ≥ 0.85 and y ≥ 0.88 (≥1088 px, ≥634 px) free of faces and text.
- **Watch-progress bar:** keep the bottom 3% (y ≥ 698 px) free of critical detail.
- **Edge margin:** keep text at least 0.03 W (38 px) from every edge, because the UI rounds corners.

**Text.**
- 1–3 words, or one numeral plus one word.
- Cap height ≥ **0.125 H (90 px)** preferred, **0.11 H (80 px)** minimum.
- At a ~168 px-wide phone render (a commonly cited small size, S62; weak source), the scale is 0.131. That makes 90 px text about **11.8 px** and 80 px about **10.5 px** on screen. At a 360 px-wide render, 90 px text is about 25 px.
- Heavy display face, the same one on every episode (for example a bold hand-lettered or condensed sans).
- Fill: saffron `#FFC531` or cream `#FFF8E7`. Stroke: **10–14 px ink `#1B1A1F`**. Soft drop shadow: 8 px offset, 40% opacity.
- Measured contrast: saffron on ink **10.9:1**; cream on ultramarine `#2E4BB0` **7.2:1**; saffron on ultramarine **4.8:1**. Aim for ≥4.5:1 between fill and its immediate surround (the WCAG AA threshold for normal text).

**The character ("You").**
- Head and shoulders only, with face height as specified per layout.
- Exaggerate the thumbnail-scale identifiers: the upright cowlick, the big amber eyes, the freckles.
- Expressions should be specific and readable: worried side-eye, raised-brow suspicion, tight-lipped dread, delighted grin.
- **Default to a closed or small mouth.** Real-face evidence favours closed mouths (S33, S35), and applying it to cartoons is a hypothesis to test.
- Gaze points at the absurd object or the text (practitioner lore).

**Watercolour-specific rules [OPINION].** Washes are soft and textured, and at about 13% scale the texture turns to mush.
- (a) Put 6–10 px ink outlines on the character and the object.
- (b) Raise the saturation of the focal object 20–30% above the background.
- (c) Keep the background a single, low-detail wash.
- (d) Keep subject vs background value separation ≥ 30 L* units at the face.
- **Measured:** the POV tunic `#8c6a3f` (L* 47) has only **1.1–1.7:1** luminance contrast against any mid-value background tested. **Crop to the face** (skin `#f3d2b3`, L* 86) and rely on hue contrast plus outline for the body.

**Background.** Use a mid-value, cool wash so it separates from both YouTube's white light mode and `#0f0f0f` dark mode (S61).
- **Avoid** backgrounds with L* above ~85, which vanish on white, or below ~15, which vanish on dark.
- **Add a series edge:** a **16 px deckled parchment-paper border** (`#F3E7C9`). It pops in dark mode (15.6:1 vs `#0f0f0f`) and is harmless in light mode. At 168 px it renders about 2 px wide.

**Palette (measured with the WCAG relative-luminance formula, rounded):**

| Role | Name | Hex | L* | Contrast vs `#0f0f0f` | Contrast vs `#FFFFFF` | Notes |
|---|---|---|---|---|---|---|
| Line / text stroke | Ink | `#1B1A1F` | 10 | 1.1 | 17.3 | Outlines, text stroke |
| Text fill A | Saffron | `#FFC531` | 83 | 12.1 | 1.6 | Always with ink stroke |
| Text fill B | Cream | `#FFF8E7` | 98 | 18.1 | 1.1 | Always with ink stroke |
| Series edge | Parchment | `#F3E7C9` | 92 | 15.6 | 1.2 | 16 px deckled border |
| BG 1 (cool, default) | Ultramarine | `#2E4BB0` | 35 | 2.5 | 7.6 | Skin on it 5.3:1; best for warm subjects |
| BG 2 | Slate blue | `#3E5C8A` | 39 | 2.8 | 6.8 | Skin 4.7:1 |
| BG 3 | Plum | `#6B3A7A` | 33 | 2.3 | 8.4 | Skin 5.8:1; plague and night topics |
| BG 4 (balanced) | Woad teal | `#2A7F8F` | 49 | 4.1 | 4.6 | Separates in both UI modes; skin 3.2:1, so outline needed |
| BG 5 (balanced) | Moss | `#5E8C3A` | 53 | 4.8 | 4.0 | Field and harvest topics; cream text only |
| Danger accent (sparing) | Madder | `#C8312B` | 45 | 3.6 | 5.3 | Use only for "fine/illegal" stamps. Red is YouTube's UI colour, so keep it small (S42) |
| Character signature | Amber (from `pov.json`) | `#e0a14a` | 71 | 8.5 | 2.2 | Keep as the character's colour; don't reuse for backgrounds |

**Per-episode rotation:** choose one background (BG 1–5) that is **complementary to the absurd object's hue**. For example a pink pig goes on woad teal, a gold coin on ultramarine, a green cabbage on plum.

**Focal budget.** At most 3 focal elements: character, object, text. One optional single ink-brush arrow or circle counts as the object's helper, not a 4th element. Evidence on arrows is weak, so use one only when the absurd detail is small.

### 10.2 The eight layouts

Notation: `[x0, y0, x1, y1]` as fractions, with px in brackets. "Face height" means chin to hairline (the cowlick extends above it).

**L1. Reaction + absurd object + 2–3-word question (series default)**
- **Character:** box [0.03, 0.14, 0.47, 1.00] → (38, 101)–(602, 720). Face height **0.40–0.50 H** (288–360 px). Turned three-quarters to the right, eyes on the object.
- **Object:** centre (0.72, 0.56), box about **0.30 W × 0.50 H** (384×360 px). Highest saturation in the frame, ink-outlined. Keep the bottom edge ≤ y 0.86 to stay clear of the badge zone.
- **Text:** box [0.52, 0.05, 0.97, 0.27]. Cap height **0.13–0.15 H** (94–108 px). Right-aligned, may end in "?".
- **Background:** one cool wash (BG 1–4), with a light-to-dark radial vignette darker at the edges.
- **Use for:** most "Why You…" episodes. **Example:** title 1. You, tight-lipped and anxious, holds out a plump hen towards a ledger on the right edge; text "RENT DAY".

**L2. Object hero**
- **Object:** box [0.30, 0.06, 0.95, 0.86], about 55% of the canvas area.
- **Character:** small, box [0.02, 0.52, 0.32, 1.00]. Face height **0.20–0.25 H** (144–180 px). Looks up at the object, scaled to emphasise the object's size.
- **Text:** box [0.03, 0.04, 0.42, 0.22]. 1–2 words, cap height 0.12–0.14 H.
- **Use for:** when the object is the joke. **Example:** title 8. A giant hand-quern with a red wax "FINED" seal tag; You is small in the corner, hugging it; text "HIDE IT".

**L3. Then / Now split**
- **Divider:** a hand-painted ink stroke 12–16 px wide from (0.53, 0) to (0.47, 1). A slight diagonal adds energy.
- **Left panel:** medieval scene in a warm palette (parchment and ochre washes), with You in medieval dress, face height 0.30–0.35 H.
- **Right panel:** modern scene in a cool palette (woad teal, slate), with You in modern dress in **the same pose**. This is a series gag that also reinforces character recognition.
- **Labels:** "1300" centred at (0.25, 0.12) and "NOW" centred at (0.75, 0.12), cap height 0.11–0.13 H.
- **Keep clear:** the right panel's bottom-right badge zone.
- **Use for:** cost, comparison and "vs today" episodes. **Example:** title 12. Left: You leading a cow with a coin pouch. Right: You at a modern purchase, with the price shown as a single numeral (the true converted figure from the video).

**L4. Big number**
- **Numeral:** box [0.04, 0.08, 0.50, 0.86]. Numeral height **0.45–0.60 H** (324–432 px). Saffron with a 14 px ink stroke and a slight 4–6° tilt.
- **Character:** box [0.50, 0.12, 0.98, 1.00]. Face height 0.38–0.42 H. Points at or recoils from the numeral.
- **Optional label:** one word under the numeral at 0.10 H.
- **Rule:** the numeral must be a figure **stated in the video**, and should differ from any number in the title.
- **Example:** title 6 ("7 Weird Fees…"). The thumbnail shows **"10%"** (the tithe) with You clutching a sheaf of grain; label "FIRST".

**L5. Extreme close-up**
- **Face:** crop box [0.00, 0.00, 0.70, 1.00]. Face height **≥0.90 H**, cropped at forehead and chin, with eyes on the upper third line (y ≈ 0.33).
- **Object:** enters from the right edge, box [0.68, 0.20, 1.00, 0.80], or is reflected in the eyes (eye whites ≥ 60 px wide so the reflection reads).
- **Text:** box [0.66, 0.04, 0.97, 0.22]. ≤2 words, cap height 0.12 H.
- **Use for:** high-stakes or disgust and dread topics (plague, ordeal, cesspits). **Example:** title 13. You pinches their nose, lit by a lantern glow, eyes watering; text "NIGHT SHIFT".

**L6. Odd one out (selective colour)**
- **Crowd:** a row or grid of 4–7 desaturated (≤15% saturation) figures across [0.03, 0.30, 0.97, 0.95].
- **Hero:** one subject in full saturation at **1.3–1.6× the scale** of the others, centred at about (0.62, 0.60), off-centre.
- **Text:** top band [0.04, 0.04, 0.70, 0.24], 2–3 words.
- **Why it fits:** this plays to the watercolour medium, where colour against grey wash pops even at small sizes. **[OPINION]**
- **Example:** title 4. A grey courtroom of villagers, one pink pig in the dock in full colour, and You (in colour, smaller) in the witness spot; text "GUILTY?".

**L7. Choice / versus**
- **Character:** centre box [0.36, 0.14, 0.64, 1.00], face height 0.35–0.40 H, eyes darting to one side.
- **Option A:** left, box [0.02, 0.18, 0.34, 0.82], warm glow (for example a red-hot iron).
- **Option B:** right, box [0.66, 0.12, 0.98, 0.78], cool hue (for example a steaming cauldron). Raised to clear the badge zone.
- **Text:** top centre [0.30, 0.02, 0.70, 0.18], "PICK ONE", cap height 0.12 H.
- **Example:** title 14.

**L8. Honest partial reveal**
- **Object:** partly hidden (under cloth, behind a door, in shadow), box [0.45, 0.10, 0.95, 0.84]. **The hidden thing must be shown in the first 30–60 seconds** (S8, S29), and never hide something absent from the video.
- **Character:** box [0.03, 0.14, 0.43, 1.00], face height 0.40–0.45 H, peeking with suspicion.
- **Text:** box [0.50, 0.04, 0.96, 0.22], 1–3 words.
- **Example:** title 7. You holds a half-unrolled parchment with the lord's seal, and a coin purse spills out of frame; text "HOW MUCH?".

### 10.3 Machine-readable summary (for the renderer)

```yaml
canvas: {w: 1280, h: 720, safe_badge: [0.85, 0.88, 1.0, 1.0], progress_bar_y: 0.97, edge_margin: 0.03}
type: {min_cap_h: 0.11, pref_cap_h: 0.125, max_words: 3, stroke_px: [10, 14], stroke: "#1B1A1F", fills: ["#FFC531", "#FFF8E7"]}
series: {edge_border_px: 16, edge_colour: "#F3E7C9", character: pov, mouth_default: closed, outline_px: [6, 10]}
backgrounds: ["#2E4BB0", "#3E5C8A", "#6B3A7A", "#2A7F8F", "#5E8C3A"]
accent_danger: "#C8312B"   # stamps only, <=5% of canvas area
layouts:
  L1_reaction_object_text: {char: [0.03,0.14,0.47,1.00], face_h: [0.40,0.50], object_centre: [0.72,0.56], object_size: [0.30,0.50], text: [0.52,0.05,0.97,0.27], cap_h: [0.13,0.15]}
  L2_object_hero:          {object: [0.30,0.06,0.95,0.86], char: [0.02,0.52,0.32,1.00], face_h: [0.20,0.25], text: [0.03,0.04,0.42,0.22], cap_h: [0.12,0.14]}
  L3_then_now:             {divider: [[0.53,0.0],[0.47,1.0]], divider_px: [12,16], face_h: [0.30,0.35], labels: [[0.25,0.12],[0.75,0.12]], cap_h: [0.11,0.13]}
  L4_big_number:           {numeral: [0.04,0.08,0.50,0.86], numeral_h: [0.45,0.60], char: [0.50,0.12,0.98,1.00], face_h: [0.38,0.42], label_cap_h: 0.10}
  L5_extreme_closeup:      {face_crop: [0.00,0.00,0.70,1.00], face_h_min: 0.90, object: [0.68,0.20,1.00,0.80], text: [0.66,0.04,0.97,0.22], cap_h: 0.12}
  L6_odd_one_out:          {crowd: [0.03,0.30,0.97,0.95], crowd_sat_max: 0.15, hero_centre: [0.62,0.60], hero_scale: [1.3,1.6], text: [0.04,0.04,0.70,0.24]}
  L7_versus:               {char: [0.36,0.14,0.64,1.00], face_h: [0.35,0.40], opt_a: [0.02,0.18,0.34,0.82], opt_b: [0.66,0.12,0.98,0.78], text: [0.30,0.02,0.70,0.18], cap_h: 0.12}
  L8_partial_reveal:       {object: [0.45,0.10,0.95,0.84], char: [0.03,0.14,0.43,1.00], face_h: [0.40,0.45], text: [0.50,0.04,0.96,0.22], reveal_by_s: 60}
```

---

## 11. Keeping series branding while each thumbnail stands out [OPINION, grounded in S5, S33, S72]

- **Constants (recognition for subscribers, S5):**
  - The **same "You" face** in every era. Only the costume changes, as `pov.json` already specifies, mirroring MrBeast's "face since 2019" (S33).
  - The same display font and ink-stroke treatment.
  - The **16 px deckled parchment edge**.
  - Saffron or cream text.
  - Ink outlines.
  - Optionally a tiny wax-seal mark, ≤0.07 W (90 px) wide, top-left. Most guides warn that large logos clutter.
- **Variables (novelty for casual viewers):** the absurd object, the background wash (rotate BG 1–5, complementary to the object), the expression, and the layout (L1–L8). Never use the same layout and background twice in a row.
- **Proportion:** roughly 70% recognisable and 30% new. This is a heuristic; no data on the ratio was found. Fang et al. show that "typicality" moderates how complexity affects popularity (S72), so a consistent frame plus a clear new focal idea is a reasonable balance.
- **Feed test:** paste the candidate thumbnail into a mock grid next to (a) your last 6 uploads and (b) the top 6 results for the topic (for example "medieval peasant"). If it looks like the competitors (sepia, generic peasants in mud, "boring history" stills), change the background hue or layout. If it looks identical to your last upload, change the layout.
- **Existing roadmap concepts** (`series/history/ROADMAP.md`: "CUT YOUR MONEY?", "WORK FOR FREE?", "WHY DIDN'T HE DIE?", "WAIT, WHAT?", "NOT A RAIDER?") already follow the "You + object + ≤4-word question" pattern. Two suggestions:
  - Keep them at ≤3 words where possible ("WHY DIDN'T HE DIE?" is 4).
  - Prefer specific text over generic exclamations ("WAIT, WHAT?" carries no information).

---

## 12. Checklist for every upload

**Before scripting**
- [ ] Idea passes the "would a stranger click this?" test (S30), and the absurd element is **true and sourced**.
- [ ] 10+ title options written (S54); top 3 at ≤45 characters with key words in the first 25 (S5, S43).
- [ ] 3+ thumbnail concepts sketched using different layouts (L1–L8) (S33, S34).
- [ ] Promise ledger written: promise, proof timestamp (≤10 s visual, ≤30 s confirmation, ≤60 s context), next open loop (S4, S28, S29).

**Thumbnail QA**
- [ ] ≤3 focal elements, with one clearly dominant (S5, S52, S72).
- [ ] Text 1–3 words, cap height ≥ 90 px, ink stroke, readable at a 168 px-wide preview (S62).
- [ ] "You" face readable at small size (cowlick, eyes, specific expression), mouth closed unless testing otherwise (S33).
- [ ] Nothing in the badge zone (bottom-right) or the bottom 3%.
- [ ] Checked on a white background **and** on `#0f0f0f` (S61, S61c).
- [ ] Background hue differs from the previous upload and from top competitor thumbnails.
- [ ] Every object shown appears in the video's first 60 s (S8).

**Title QA**
- [ ] No word repeated between title and thumbnail text (S52).
- [ ] No ALL-CAPS words, no "secret/truth/insane/shocking", no stacked "?!" (S5, S18, S43, S48).
- [ ] Specific noun (named thing, number or counter-expectation) present (S51).
- [ ] Disputed history framed as a question or myth check.
- [ ] Not news-styled ("breaking", "just discovered") (S9).

**Publish and test**
- [ ] Set up a YouTube A/B test with 2–3 **meaningfully different** thumbnails, or title/thumbnail combinations, before publishing. Variants that are too similar give no result (S1, S2).
- [ ] Day 1: check CTR on Home and Suggested if impressions are above average, and the Subscriptions feed for core fans (S5).
- [ ] Day 1–3: check the first-30-second retention dip. If CTR is high and retention low, fix the packaging *down*, not up (S6).
- [ ] Don't panic about CTR decline as impressions grow (S7).
- [ ] Day 7–14: read the A/B result (Winner / Preferred / None); log what won and why in the series' packaging log.
- [ ] After 30+ days: refresh the packaging of under-performers (S58, S57).

**Compliance**
- [ ] Audience set honestly: general audience unless content is genuinely child-directed (S23).
- [ ] Visible human authorship and variety, not a templated mass-produced feel (S22).

---

## 13. Gaps, conflicts and what to verify next

- **Not verifiable here (fetch blocked, search cap reached):** exact wording of YouTube Help pages S1, S2, S5–S8, S14; the full MrBeast PDF (S32); Film Booth / Ed Lawrence's specific thumbnail rules beyond "packaging comes first" and "less is more" (S55, S56); view counts for specific "medieval peasant" titles; Historia Civilis, Kings and Generals and Jacob Geller packaging histories; the Thumbnail Bench word-count figures (S40); vidIQ's title study by category (S46); Koh & Cui's actual results (S73).
- **Conflicts to resolve by testing on this channel:**
  - Question titles: 0.82x (S46) vs null (S47) vs positive in Education (S43).
  - "Nobody knows" framing: >2.5x (S46) vs secrecy/reveal 0.87x (S48).
  - Faces: correlational prevalence (S37) vs no difference (S38, S39).
  - Negative wording: helps in news CTR (S64) vs positive titles associated with more video views (S71).
- **Egregious-clickbait scope:** confirmed for India and news (S9). No expansion to other countries or genres was confirmed. Re-check YouTube's blog and policy changelog periodically.
- **A/B result labels:** "Winner / Preferred / None" (S1) vs "Winner / Performed Same / Inconclusive" reported by third parties for the newer tool. Check the Studio UI.
- **Historical facts in Section 9:** all need primary or secondary sources via `docs/RESEARCH_TEMPLATE.md`.

---

## 14. Sources

All accessed **2026-10-11**. **Status:** every item is **"search snippet only"**. WebFetch failed (DNS failure on support.google.com) and the proxy returned 403 for direct fetches, so no page was opened in full.

| ID | URL | Title | Publisher | Supports | Status |
|---|---|---|---|---|---|
| S1 | https://support.google.com/youtube/answer/13861714 | Test & compare thumbnails | YouTube Help (Google) | Watch-time-share winner; up to 3 thumbnails; result labels; timing | search snippet only |
| S2 | https://support.google.com/youtube/answer/16391400 | A/B test titles & thumbnails | YouTube Help (Google) | Title/thumbnail A/B; highest watch time wins; eligibility | search snippet only |
| S3 | https://blog.youtube/creator-and-artist-stories/renes-top-five-june-14-2024/ | Rene's Top Five (June 14, 2024) | YouTube Official Blog | Why the tool reports watch time; CTR over-indexing risks clickbait | search snippet only |
| S4 | https://blog.youtube/culture-and-trends/renes-top-five-on-youtube-march-21-2024-edition/ | Rene's Top Five on YouTube: March 21, 2024 | YouTube Official Blog | Deliver the thumbnail promise; reward click in intro | search snippet only |
| S5 | https://support.google.com/youtube/answer/12340300 | Thumbnail & title tips | YouTube Help (Google) | Subscribers vs casual; uncluttered; small-size check; short front-loaded titles; limit caps/emoji; 24 h CTR check | search snippet only |
| S6 | https://support.google.com/youtube/answer/7628154 | Impressions and click-through rate FAQ | YouTube Help (Google) | High CTR + low AVD = clickbait, recommended less | search snippet only |
| S7 | https://support.google.com/youtube/answer/16767369 | Decoding CTR & impressions in your Analytics | YouTube Help (Google) | CTR falls as reach expands (9% → 3.5% example) | search snippet only |
| S8 | https://support.google.com/youtube/answer/2801973 | Spam, deceptive practices & scams policies | YouTube Help (Google) | Misleading metadata/thumbnails definition | search snippet only |
| S9 | https://blog.google/intl/en-in/products/platforms/strengthening-enforcement-against-egregious-clickbait-on-youtube/ | Strengthening enforcement against egregious clickbait on YouTube | Google India Blog (YouTube Team), 18 Dec 2024 | Egregious clickbait enforcement, India first, news focus, no strikes initially | search snippet only (via secondary reproductions) |
| S10 | https://techcrunch.com/2024/12/18/youtube-says-it-will-start-cracking-down-on-videos-with-clickbait-titles-in-india | YouTube says it will start cracking down on videos with clickbait titles in India | TechCrunch | Corroborates S9 | search snippet only |
| S11 | https://www.tubefilter.com/2024/12/19/youtube-clickbait-crackdown-india-egregious-misleading-videos/ | YouTube's clickbait crackdown begins in India | Tubefilter | Corroborates S9; removal without strikes | search snippet only |
| S12 | https://www.medianama.com/2024/12/223-youtube-to-begin-crackdown-on-egregious-clickbait-india/ | YouTube to begin crackdown on egregious clickbait in India | MediaNama | Open definitional questions | search snippet only |
| S13 | https://chromeunboxed.com/no-more-clickbait-youtube-is-cracking-down-on-misleading-videos/ | No more clickbait? YouTube is cracking down on misleading videos | Chrome Unboxed | Spokesperson (via The Verge): expansion to more countries planned | search snippet only |
| S14 | https://support.google.com/youtube/answer/72431 | Add video thumbnails | YouTube Help (Google) | 1280×720, min 640 wide, <2 MB, 16:9 | search snippet only |
| S15 | https://blog.youtube/inside-youtube/on-youtubes-recommendation-system/ | On YouTube's recommendation system | YouTube Official Blog | Valued watchtime; 1–5 star surveys; prediction model | search snippet only |
| S16 | https://www.socialmediatoday.com/news/youtube-explains-some-common-algorithm-and-video-distribution-queries/ | YouTube explains some common algorithm and video distribution queries | Social Media Today | Creator Insider: millions of surveys/month; relative and absolute watch time | search snippet only |
| S17 | https://research.google.com/pubs/pub45530.html | Deep Neural Networks for YouTube Recommendations (Covington et al., 2016) | Google Research / RecSys | Ranking predicts expected watch time, not click probability | search snippet only |
| S17b | https://blog.acolyer.org/2016/09/19/deep-neural-networks-for-youtube-recommendations/ | Deep neural networks for YouTube recommendations | The Morning Paper (A. Colyer) | Quote: CTR ranking promotes deceptive clickbait | search snippet only |
| S18 | https://tubefilter.com/2018/08/30/youtube-all-caps-titles-perform-worse/ | YouTube Exec Says Using All Caps Titles Causes Videos To Perform Worse | Tubefilter | Todd Beaupré, "yelled at"; "just do a regular title" | search snippet only |
| S19 | https://searchenginejournal.com/youtube-rolls-out-thumbnail-a-b-testing-to-all-channels/519281 | YouTube rolls out thumbnail A/B testing to all channels | Search Engine Journal | "Optimizing for overall watch time share" | search snippet only |
| S20 | https://ppc.land/youtube-expands-a-b-testing-to-include-titles-alongside-thumbnails/ | YouTube expands A/B testing to include titles alongside thumbnails | PPC Land | Title testing announced 9 Dec 2025; up to 2 weeks | search snippet only |
| S21 | https://www.tubefilter.com/?p=187324 | YouTube is expanding a feature that lets creators "test and compare" titles and thumbnails | Tubefilter | Mid-2025 title-test experiment | search snippet only |
| S22 | https://www.plagiarismtoday.com/2025/07/08/youtube-targets-inauthentic-content/ | YouTube Targets "Inauthentic" Content | Plagiarism Today | 15 July 2025 YPP update on mass-produced/repetitious content | search snippet only |
| S23 | https://www.ftc.gov/business-guidance/blog/2019/11/youtube-channel-owners-your-content-directed-children | YouTube channel owners: Is your content directed to children? | US Federal Trade Commission | Animation is a factor, not determinative | search snippet only |
| S24 | https://www.mobiflip.de/youtube-mit-neuen-zahlen/amp/ | YouTube mit neuen Zahlen | mobiflip.de | DMEXCO 2018: >70% watch time on mobile | search snippet only |
| S25 | https://informitv.com/2025/08/26/youtube-increases-share-of-viewing/ | YouTube increases share of viewing | informitv | Nielsen Gauge: YouTube 13.4% of US TV usage (July 2025) | search snippet only |
| S26 | https://simonwillison.net/2024/Sep/15/how-to-succeed-in-mrbeast-production/ | How to succeed in MrBeast production (leaked PDF) | Simon Willison's Weblog | Context of the leak; "not to make the best produced videos" | search snippet only |
| S27 | https://www.creatorhandbook.net/leaked-document-allegedly-reveals-mrbeasts-secrets-to-youtube-success-the-key-takeaways/ | Leaked document allegedly reveals MrBeast's secrets to YouTube success | Creator Handbook | CTR/AVD/AVP; "I Survived" vs "I Spent"; "the more extreme, the better"; authenticity caveat | search snippet only |
| S28 | https://futuresocial.beehiiv.com/p/mr-beasts-how-to-viral | MrBeast's guide to making content | Future Social (beehiiv newsletter) | Wow factor; 21M lost in first minute; match clickbait expectations, front-load | search snippet only |
| S29 | https://gigazine.net/gsc_news/en/20240917-mrbeast-youtube-production/ | The video production manual of MrBeast has been leaked | GIGAZINE | First minute shows thumbnail meets expectations | search snippet only |
| S30 | https://omr.com/de/daily/mrbeast-doc-pdf-leak | Geleaktes MrBeast-PDF | OMR | Title and thumbnail settled before production | search snippet only |
| S31 | https://www.dexerto.com/youtube/leaked-mrbeast-pdf-reveals-youtubers-secrets-to-video-success-2900841/ | Leaked MrBeast PDF reveals YouTuber's secrets to video success | Dexerto | Leak coverage, metrics | search snippet only |
| S32 | https://cdn.prod.website-files.com/6623b7720b009050313e701c/66ede69453b7bbadcd2f05a8_How-To-Succeed-At-MrBeast-Production%20(2).pdf | How to Succeed in MrBeast Production (PDF copy) | Unknown host (Webflow CDN) | Primary document (not opened) | search result listing only |
| S33 | https://www.socialmediatoday.com/news/youtube-shares-insights-mrbeasts-team-creates-compelling-thumbnail/709817/ | YouTube shares insights into how MrBeast's team creates compelling thumbnails | Social Media Today | Appleby: trust; face since 2019; packaging before filming; ~50 concepts; closed-mouth 30 tests; $10k / 20 variants claim | search snippet only |
| S34 | https://win.gg/mrbeasts-thumbnail-creator-reveals-strategy/ | MrBeast's thumbnail creator reveals strategy | WIN.gg | Simplicity; complex = scroll; up to 50 tests | search snippet only |
| S35 | https://creativebloq.com/news/youtube-thumbnails | Are 'shocked face' YouTube thumbnails finally over? | Creative Bloq | Closed-mouth tweet (6 Sept 2023); A/B "winner" badges | search snippet only |
| S36 | https://www.theringer.com/2026/03/09/pop-culture/youtube-face-thumbnails-history-explained | The Rise of YouTube Face | The Ringer | Appleby origin story. A Ryan Hall "packaging" quote appeared in one snippet but could not be re-confirmed (unverified) | search snippet only |
| S37 | https://vidiq.com/research/youtube-thumbnail-study/ | YouTube Thumbnail Study: What 500 Breakout Thumbnails Reveal (2026) | vidIQ | Faces 69/75/80%; contrast 56%; 89% face or contrast; text 72%, median 5 words; ~5% shocked | search snippet only |
| S38 | https://www.searchenginejournal.com/do-faces-help-youtube-thumbnails-heres-what-the-data-says/563944/ | Do Faces Help YouTube Thumbnails? Here's What The Data Says | Search Engine Journal | 300K-video dataset: faces ≈ no faces; niche differences | search snippet only |
| S39 | https://eden.so/blog/what-makes-a-good-youtube-thumbnail/ | What makes a good YouTube thumbnail? We analyzed 507,478 videos | Eden | Faces 84.2% breakouts vs 82.2% underperformers | search snippet only (single snippet; a second search did not surface it) |
| S40 | https://www.netinfluencer.com/?p=53558 | Thumbnail Bench study coverage | Net Influencer | 1,043 channels, 11,223 thumbnails; faces 71%; shocked 11%; neutral 35%; happy 32% | search snippet only |
| S41 | https://www.kapwing.com/resources/the-youtube-thumbnail-faces-that-attract-the-most-views/ | The YouTube Thumbnail Faces That Attract the Most Views | Kapwing | Emotion mix; surprise/happy ~27% each | search snippet only |
| S41b | https://www.tubefilter.com/2024/10/24/emotion-in-thumbnails-ai-study-kapwing/ | Emotion in thumbnails AI study (Kapwing) | Tubefilter | Corroborates S41 | search snippet only |
| S42 | https://vidiq.com/blog/post/youtube-thumbnail-design-tips/ | YouTube Thumbnail Design Tips: Best Practices for 2026 | vidIQ | One focal point; contrast; colours that stand out from YouTube UI | search snippet only |
| S43 | https://air.io/en/audience-growth/how-to-write-a-youtube-title-that-gets-clicked-research-across-11-niches | How to write YouTube titles that get views: a data study [2026] | AIR Media-Tech | 30–50 chars; 90+ underperform; numbers by niche; questions + in Education; caps − in Education | search snippet only |
| S44 | https://spottercommunity.beehiiv.com/p/titles-optimal-length | Titles: optimal length | Spotter (The Spot newsletter) | 4–7 words / 20–45 chars (~5,000 channels) | search snippet only |
| S45 | https://ytgrowth.io/blog/youtube-title-length | YouTube title length | ytgrowth.io | 28,947 videos; length r = 0.0046 (null) | search snippet only |
| S46 | https://vidiq.com/research/youtube-title-formulas-study/ | YouTube title formulas study (July 2026) | vidIQ | >4M uploads; caught-on-camera >4x; X→Y >3x; "nobody knows" >2.5x; question 0.82x | search snippet only |
| S46b | https://vidiq.com/ai-title-generator/ | AI YouTube Title Generator | vidIQ | Same multipliers cited | search snippet only |
| S47 | https://www.overseeros.com/blog/should-youtube-titles-be-questions | Should YouTube titles be questions? | OverseerOS | 891 matched pairs, 445 vs 446, median 1.000 | search snippet only |
| S48 | https://www.overseeros.com/blog/do-clickbait-youtube-titles-get-more-views | Do clickbait YouTube titles get more views? | OverseerOS | Median 1.03x; shock 1.06x; danger 1.04x; secrecy/reveal 0.87x | search snippet only |
| S49 | https://www.overseeros.com/blog/curiosity-gap-youtube-titles | Curiosity-gap YouTube titles | OverseerOS | 0.92x vs 1.00x median; 27.6% vs 24.7% 2x outliers | search snippet only |
| S50 | https://www.overseeros.com/blog/youtube-title-capitalization | YouTube title capitalization | OverseerOS | 6,878 million-view titles; 4.3% all caps; no lever | search snippet only |
| S51 | https://outlierkit.com/resources/what-outlier-videos-have-in-common/ | What is the one thing every outlier video has in common? | OutlierKit | Number / named thing / counter-expectation; strangers drive outliers | search snippet only |
| S52 | https://x.com/PaddyG96/status/1811083499044044951 | Paddy Galloway post (tips 19–20) | X (Paddy Galloway) | Glance test; title + thumbnail complement vs repeat | search snippet only |
| S53 | https://podcast.creatorscience.com/paddy-galloway/ | Paddy Galloway episode | Creator Science podcast | Reallocating time to ideas, thumbnails, packaging | search snippet only |
| S54 | https://marketing-examined.beehiiv.com/p/paddy-galloway-part-2-version | Paddy Galloway (part 2) | Marketing Examined (newsletter) | 10–20 thumbnail/title variations; feedback; "4–5 impactful words" (reported) | search snippet only |
| S55 | https://podcast.creatorscience.com/ed-lawrence/ | Ed Lawrence (Film Booth) episode | Creator Science podcast | "Packaging Comes First" segment | search snippet only |
| S56 | https://rosetta.to/u/ed-lawrence | Ed Lawrence | Rosetta (aggregator) | "Less is more" thumbnails; intro must match thumbnail/title expectations (AI summaries) | search snippet only |
| S57 | https://x.com/AliAbdaal/status/1727976482968854624 | Ali Abdaal post on thumbnail A/B testing | X (Ali Abdaal) | 300K → 1.1M views after tested thumbnail change (self-reported) | search snippet only |
| S58 | https://www.hypebot.com/vevo-uses-a-simple-tactic-to-increase-music-video-views-and-you-should-too | Vevo uses a simple tactic to increase music video views | Hypebot (reporting Variety) | ~12% lift in first 20 days, ~4,000 videos | search snippet only |
| S58b | https://fortune.com/2019/12/20/vevo-music-videos-billie-eilish-dscvr-lift-youtube/ | Vevo music videos… | Fortune | 12% average lift from brighter, face-led thumbnails | search snippet only |
| S58c | https://vidiq.com/blog/post/youtube-custom-thumbnails-vevo/ | How to Change a YouTube Thumbnail (Vevo case) | vidIQ | Sustained lift "over 5%" | search snippet only |
| S59 | https://www.veritasium.com/videos/2021/8/17/we-need-to-talk-about-clickbait | We Need To Talk About Clickbait (Clickbait is Unreasonably Effective) | Veritasium | Packaging matters; legit bait vs deceptive | search snippet only |
| S59b | https://gigazine.net/gsc_news/en/20210830-clickbait-effective | Small improvements to titles and thumbnails… (summary) | GIGAZINE | Type 1 vs Type 2 clickbait; dam video 16.3M mostly off-platform | search snippet only |
| S59c | https://www.digitalinformationworld.com/2021/09/why-is-clickbait-so-common-in-online.html | Why is clickbait so common online | Digital Information World | "Anti-clickbait": answer the title's question in the thumbnail | search snippet only |
| S60 | https://vidiq.com/blog/post/youtube-clickbait/ | Why Clickbait Is Actually Good for Your YouTube Channel | vidIQ (L. Sweatt, 2022) | Clickbait acceptable when expectations are met | search snippet only |
| S61 | https://1of10.com/blog/best-colors-for-youtube-thumbnails/ | 9 Best Colors for YouTube Thumbnails | 1of10 | Contrast against #0f0f0f dark / white light UI; niche colour saturation | search snippet only |
| S61b | https://thumbnailtest.com/guides/youtube-thumbnail-colors/ | 7 Best Colors For YouTube Thumbnails | ThumbnailTest | Colour pairing guidance | search snippet only |
| S61c | https://www.collabpals.com/tools/youtube-thumbnail-previewer | YouTube thumbnail previewer | CollabPals | Test thumbnails in both light and dark modes | search snippet only |
| S62 | https://thumbfa.st/posts/youtube-thumbnail-maker-tips-common-mistakes | YouTube Thumbnail Maker Tips: 10 Things Most People Get Wrong | thumbfa.st | ~168×94 px typical mobile render (weak) | search snippet only |
| S63 | https://primalvideo.com/guides/youtube-thumbnail-design-strategy/ | YouTube thumbnail design strategy | Primal Video | TubeBuddy A/B examples (+45.2%, +33.8% clicks) | search snippet only |
| S64 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10202797/ | Negativity drives online news consumption (Robertson et al., 2023) | Nature Human Behaviour (PMC) | Negative words +2.3% CTR each; sad > angry/fear | search snippet only |
| S64b | https://www.niemanlab.org/2023/03/negative-words-in-news-headlines-generate-more-clicks-but-sad-words-are-more-effective-than-angry-or-scary-ones/ | Negative words in news headlines generate more clicks… | Nieman Lab | Coverage of S64 | search snippet only |
| S65 | https://eprints.kingston.ac.uk/47719 | You won't believe what's in this paper! Clickbait, relevance, and the curiosity gap (Scott, 2021) | Journal of Pragmatics / Kingston eprints | Curiosity gap mechanics; definite reference; superlatives | search snippet only |
| S66 | https://stafforini.com/works/loewenstein-1994-psychology-curiosity-review/ | The Psychology of Curiosity: A Review and Reinterpretation (Loewenstein, 1994) | Psychological Bulletin (bibliographic page) | Information-gap theory | search snippet only |
| S67 | https://www.ucviden.dk/da/publications/click-bait-forward-reference-as-lure-in-online-news-headlines/ | Click bait: Forward-reference as lure in online news headlines (Blom & Hansen, 2015) | Journal of Pragmatics / UC Viden | Forward-reference lures; 100k headlines | search snippet only |
| S68 | https://pure.uva.nl/ws/files/20924776/Effective_Headlines_of_Newspaper_Articles_in_a_Digital_Environment.pdf | Effective Headlines of Newspaper Articles in a Digital Environment (Kuiken et al., 2017) | Digital Journalism / Univ. of Amsterdam | Clickbait features raise clicks but don't predict alone | search snippet only |
| S69 | https://scholarshare.temple.edu/handle/20.500.12613/393 | Aggregation, Clickbait and Their Effect on Perceptions of Journalistic Credibility and Quality (Molyneux & Coddington) | Journalism Practice / Temple ScholarShare | Clickbait lowers credibility/quality | search snippet only |
| S69b | https://www.researchgate.net/publication/350912220_Clickbait-Trust_and_Credibility_of_Digital_News | Clickbait—Trust and Credibility of Digital News | ResearchGate | n=200 experiment: clickbait reduced credibility | search snippet only |
| S70 | https://ktisis.cut.ac.cy/handle/20.500.14279/13460 | The good, the bad and the bait: detecting and characterizing clickbait on YouTube (Zannettou et al.) | Cyprus Univ. of Technology repository | YouTube clickbait detection; frustrated comments | search snippet only |
| S70b | https://arxiv.org/pdf/2112.08611 | Clickbait in YouTube: Prevention, Detection and Analysis of the Bait | arXiv | Clickbait videos tend to have more dislikes than likes | search snippet only |
| S71 | https://www.sciencedirect.com/science/article/abs/pii/S0148296324003539 | Clicks for money: Predicting video views through a sentiment analysis of titles and thumbnails (Cui et al., 2024) | Journal of Business Research (Elsevier) | Thumbnail sentiment + views; caption sentiment − views; positive titles +; question clickbait − | search snippet only |
| S71b | https://www.ln.edu.hk/news/press-releases/20240806/lingnan-study-using-ai-analyses-over16000-social-media-videos-in-order-to-show-key-marketing-strategies-that-boost-viewership | Lingnan study using AI analyses over 16,000 social media videos | Lingnan University | Sample size of S71 | search snippet only |
| S72 | https://link.springer.com/article/10.1007/s11747-026-01152-6 | Thumbnail power: Visual cues and video popularity on UGV platforms (Fang et al., 2026) | Journal of the Academy of Marketing Science (Springer) | Inverted-U complexity; U-shaped coherence; typicality moderation | search snippet only |
| S73 | https://scholar.korea.ac.kr/handle/2021.sw.korea/143319 | Visual attributes of thumbnails and view-through of videos (Koh & Cui, 2022) | Decision Support Systems / Korea Univ. repository | Design only; results not retrieved | search snippet only |
| S74 | https://www.famousbirthdays.com/people/sam-o-nella.html | Sam O'Nella | Famous Birthdays | Popular titles; >756M channel views | search snippet only |
| S75 | https://www.thetvdb.com/series/341664-show/seasons/official/2018 | Sam O'Nella Academy season listings (also /2019, /2020, /2023) | TheTVDB | Episode titles | search snippet only |
| S76 | https://outlierkit.com/channel/oversimplified | OverSimplified channel analysis | OutlierKit | WW2 Pt1 ~104M; Cold War ~74M; WW2 Pt2 ~67M | search snippet only |
| S77 | https://outlierkit.com/channel/kurzgesagt | Kurzgesagt channel analysis | OutlierKit | Second-person titles ~19M; top videos 20–32M (AI estimates) | search snippet only |
| S78 | https://outlierkit.com/channel/theinfographicsshow | The Infographics Show channel analysis | OutlierKit | Channel scale | search snippet only |
| S78b | https://www.thetvdb.com/series/infographics/episodes/7939082 | What If You Were 1000 feet (300 meters) Tall | TheTVDB | Second-person "What If You" title | search snippet only |
| S78c | https://faceless.directory/case-studies/the-infographics-show | The Infographics Show Case Study | faceless.directory | Title formulas; thumbnail style (third-party) | search snippet only |
| S78d | https://becomeviral.com/blog/infographics-show-case-study | The Infographics Show: 14M Subscribers on Faceless Animation | BecomeViral | Third-party case study (same claims as S78c) | search snippet only |
| S79 | https://thetvdb.com/series/weird-history | Weird History | TheTVDB | "How Much It Sucked to Be a Medieval Serf"; knight episode | search snippet only |
| S79b | https://www.rokuguide.com/node/23569 | Weird History (Roku listing) | Roku Guide | "What Life Was Really Like as a Wild West Sheriff" | search snippet only |
| S80 | https://en.wikipedia.org/wiki/Max_Miller_(YouTuber) | Max Miller (YouTuber) | Wikipedia | Tasting History scale. Example titles from search coverage incl. https://www.phoenixnewtimes.com/food-drink/max-miller-tasting-history-youtube-11520675/ (Phoenix New Times) | search snippet only |
| S81 | https://creatordb.app/creatorstats/toldinstone/ | toldinstone creator stats | CreatorDB | Topic framing; follower count | search snippet only |
| S82 | https://www.404media.co/ai-generated-boring-history-videos-are-flooding-youtube-and-drowning-out-real-history/ | AI Generated 'Boring History' Videos Are Flooding YouTube and Drowning Out Real History | 404 Media (3 Sept 2025) | AI history flood; 2.3M-view example; historian criticism | search snippet only |
| S83 | https://www.autoclips.app/ai-history-pov-videos | AI History POV Videos: The Time Travel Trend | Autoclips (vendor) | "POV: You Wake Up in 1351" format (unverified views) | search snippet only |
| S84 | https://historum.com/t/is-youtube-a-viable-option-for-teaching-history.130672/ | Is YouTube a viable option for teaching History? | Historum forum | Anecdote: avoid "the Truth" titles | search snippet only |
| S85 | https://veritas-et-caritas.com/index.php/2023/01/04/a-bad-history-youtuber-tier-list-scoring-nine-of-the-largest-youtube-history-channels/ | A bad history YouTuber tier list | Veritas et Caritas | Audience and critic scrutiny of accuracy | search snippet only |
| S86 | https://outlierkit.com/resources/youtube-click-through-rate/ | What Is a Good YouTube Click-Through Rate? YouTube's Own Numbers | OutlierKit | Reports YouTube saying half of channels have 2–10% CTR (secondary) | search snippet only |
