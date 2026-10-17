# Case File 50: The lottery's security boss rigged it (tcv50-lottery-coder)

Research ledger, 2026-10-15 (all accesses on this date).

## Method and limits
- 13 standard web searches. WebFetch is blocked in this environment (DNS failure on en.wikipedia.org) and curl is not used, so every source below is cited from **search-result extracts only**; no full page was read (including the Powerball prize chart and the Iowa Supreme Court opinion).
- Several outlets carry the same Associated Press story (CNN Money, KSHB, KSL, Inquirer.net, Fox News). Where an AP syndication is one of the two sources, the second is a non-AP outlet or an official/court source.
- Nature column: **fact** = reported consistently by independent outlets or an official record; **alleged** = prosecutors' account at trial, attributed on screen; **reported** = attributed account.

## Claims ledger
| # | Claim | Nature | Used as | Sources (accessed 2026-10-15) |
|---|---|---|---|---|
| L_hook | Eddie Tipton was information security director of the Multi-State Lottery Association (MUSL, Iowa) and admitted rigging lottery draws. | fact | Line 1 "The lottery's security boss rigged the jackpots."; headline "LOTTERY SECURITY BOSS / RIGGED THE JACKPOTS" | AP via CNN Money (22 Aug 2017) https://money.cnn.com/2017/08/22/news/iowa-lottery-sentencing/ ; KCRG (June 2017) https://www.kcrg.com/content/news/Brothers-plead-guilty-in-Iowa-to-lottery-rigging-scheme-431575663.html ; AP via KSHB https://www.kshb.com/news/national/ex-lottery-worker-who-rigged-winnings-gets-25-years-in-prison |
| L_code | Investigators: code he installed let the random number generators work normally except on three days a year, when they produced predictable numbers (Wednesday or Saturday draws after 8 p.m.). He admitted rigging computer code to produce winning numbers. | fact (investigators' finding + admission) | Line 2 "His secret code made 3 days a year predictable."; card "INVESTIGATORS: 3 DATES A YEAR" | AP via KSL (Apr 2016) https://www.ksl.com/article/news/business/code-let-lottery-vendor-predict-winning-numbers-police-say/39209103 ; AP via Inquirer.net https://newsinfo.inquirer.net/778097/code-let-lottery-vendor-predict-winning-numbers-police-say ; Sophos Naked Security (8 Apr 2016) https://news.sophos.com/en-us/2016/04/08/forensics-uncover-how-brothers-rigged-the-lottery/ ; AP via CNN Money (2017) |
| L_crew | He conspired with his brother Tommy Tipton, his friend Robert Rhodes and others to buy and claim winning tickets. | fact | s02 line "His brother and a friend claimed wins in five states." | AP via Fox News (29 Nov 2016) https://www.foxnews.com/us/jackpot-rigging-scandal-grows-in-scope-as-trials-near.print ; KCRG (2017) ; AP via CNN Money (2017) |
| L_states | Five states, 2005-2011: Colorado, Wisconsin, Oklahoma, Kansas, Iowa. Restitution about $2.2 million (Colorado $1.1M, Oklahoma $644K, Wisconsin $391K, Kansas $30K). | fact | s02 card "CO · WI · OK · KS · IA / 2005-2011"; YEAR chip 2005 | AP via Fox News (2016); AP via CNN Money / KSHB (2017); AP via KSL (2016) |
| L_tommy | Tommy Tipton was a justice of the peace in Texas (AP: "a former Texas judge"); pleaded guilty in Iowa (2017) to conspiracy to commit theft. | fact | s02 line "The brother was a Texas judge." (LIKE moment); card "JUSTICE OF THE PEACE" | AP via CNN Money (2017); AP via Fox News (2016); KCRG (2017) |
| L_ticket | The Hot Lotto ticket was bought on 23 Dec 2010 at a QuikTrip in Des Moines for the 29 Dec 2010 draw. Advertised jackpot $16.5 million (cash value about $10.75 million). | fact | s03 line "In 2010, an Iowa ticket hit a $16.5 million jackpot."; card "DES MOINES, IOWA · DEC 2010"; YEAR chip 2010 | Casino.org (Jan 2015) https://www.casino.org/news/iowa-lottery-worker-illegal-winning-ticket ; Reader's Digest (2018) https://rd.com/?p=808811 ; Wikipedia https://en.wikipedia.org/wiki/Hot_Lotto_fraud_scandal ; AP via Fox News (2012) https://www.foxnews.com/us/investigators-look-to-unravel-mystery-behind-iowa-lotto-winner ; CNN (28 Dec 2011) https://edition.cnn.com/2011/12/28/us/iowa-lottery-deadline |
| L_unclaimed | Nobody came forward for most of the one-year claim window. | fact | s03 line "But nobody claimed it." (LIKE moment) | AP via Fox News (2012); CNN (2011); Wikipedia |
| L_belize | In late Dec 2011, less than two hours before the one-year deadline, a New York lawyer (Crawford Shaw) filed a claim for a trust tied to a Belize company (Hexham Investments Trust); a Quebec lawyer (Philip Johnston) had called first. | fact | s04 line "Then lawyers tried to claim it for a trust in Belize."; card "DEC 2011 · HOURS BEFORE THE DEADLINE"; YEAR chip 2011 | AP via Fox News (2012); Wikipedia; Reader's Digest; CNN (2011) |
| L_refused | The Iowa Lottery refused to pay because the trust would not say who bought the ticket (anonymous claims not allowed); the claim was withdrawn. | fact | s04 line "The lottery refused. So who bought it?" | AP via Fox News (2012); Wikipedia; CNN (2011) |
| L_video | The store camera recorded the buyer; officials released the footage in October 2014 (9 Oct 2014 per Reader's Digest). | fact | s05 line "A gas station camera had filmed the buyer."; YEAR chip 2014 | AP via Fox News (2012, the video's existence); Reader's Digest; Irish Examiner https://www.irishexaminer.com/opinion/commentanalysis/arid-30845121.html ; Artful Living https://artfulliving.com/how-an-iowa-man-cracked-the-lottery/ |
| L_voice | People who knew him recognised the buyer by his VOICE, not his appearance: an Iowa Lottery web developer who had worked with him for years, a Maine Lottery employee, and his friend Jason Maher, who compared the audio. | fact | REVEAL line "Co-workers knew that voice. It was Eddie Tipton."; FUN FACT card "CO-WORKERS KNEW HIS VOICE, / NOT HIS FACE." | Reader's Digest (2018); Artful Living; Irish Examiner |
| L_camera | Prosecutors alleged at the 2015 trial that he set the draw-room camera to record one second per minute and used a USB drive on the draw computer. The rootkit was never recovered. | **alleged** | Card only in s01 (attributed "PROSECUTORS SAID"), not narrated | HackRead https://www.hackread.com/dude-hacked-lottery-computers-for-jackpot/ ; Sophos (2016); Bitdefender HotForSecurity (2015) https://www.bitdefender.com/blog/hotforsecurity/lottery-security-chief-found-guilty-of-hacking-hot-lotto-to-win-14-3-million |
| L_plea | Jury conviction July 2015 (two fraud counts; reversed/vacated by the Iowa Supreme Court in June 2017 on statute-of-limitations grounds); in June 2017 he pleaded guilty to ongoing criminal conduct (money laundering dropped). | fact | s08 card "2017 · PLEADED GUILTY" | AP via CNN Money (2017); KCRG (2017); The Gazette (June 2017) https://www.thegazette.com/?p=171929 ; AP via Fox News (2017) https://www.foxnews.com/us/mastermind-of-lottery-fraud-faces-25-year-prison-sentence |
| L_sentence | Aug 2017: an Iowa judge, mentioning his "greed", gave him the maximum, 25 years (Iowa indeterminate term, i.e. up to 25 years), concurrent with up to 5 1/2 years in Wisconsin. Paroled July 2022 after about five years. | fact | LAST line "The judge cited greed, and gave him 25 years."; card "AUG 2017 · UP TO 25 YEARS" | AP via CNN Money; AP via KSHB; AP via Fox News (2017, "faces up to 25 years"); AP via KTTC (19 Jul 2022) https://www.kttc.com/2022/07/19/iowa-man-convicted-lottery-rigging-scheme-is-paroled |

**Corrections to the brief and disagreements recorded:**
- **Jackpot figure:** the brief said "$14.3 million". AP (2015-2017), Sophos, Bitdefender and Wikipedia use $14.3 million; Casino.org, Reader's Digest and the prosecutors' summaries say the advertised jackpot was **$16.5 million**, with a cash value of **$10.75 million** (Casino.org; CNN 2011). One extract suggested $14.3 million belongs to another draw. No extract reconciles the $14.3M figure, so the narration uses the advertised **$16.5 million jackpot** (the word "jackpot", not "cash"), and the caption avoids a figure.
- **Purchase vs draw date:** bought 23 Dec 2010 (video), drawn 29 Dec 2010. One CNN extract says "bought December 29"; not used. The card says "DEC 2010".
- **"Des Moines-area petrol station":** the sources say a QuikTrip in Des Moines; the narration says "a gas station" (American audience); the store chain is not named on screen and no store branding is drawn.
- **Sentence:** the brief said "up to 25 years". AP reports "25 years" (the maximum); Iowa terms are indeterminate (AP 2017: "faces up to 25 years"). Narration "gave him 25 years"; card "UP TO 25 YEARS".
- **Conviction 2015:** confirmed (July 2015 jury verdict), but it was later reversed on limitations grounds; the episode states only the 2017 plea and sentence.
- **Days of the year:** AP (2016) names May 27, Nov 22 and Dec 29; other reports say Nov 23. The episode says only "3 days a year".
- **Prosecutors' camera/USB account:** an allegation (the rootkit was never found); used on one attributed card only.

## Statistic
| # | Statistic | Source | Used as |
|---|---|---|---|
| L_odds | Powerball grand prize (jackpot) odds: **1 in 292,201,338** (overall odds of any prize 1 in 24.87). | Powerball prize chart https://www.powerball.com/powerball-prize-chart (MUSL's own site); Iowa Lottery Powerball page https://www.ialottery.com/Pages/Games-Online/Powerball.aspx ; CNBC (2019) https://www.cnbc.com/2019/05/31/these-are-the-odds-youll-win-the-350-million-powerball-jackpot.html ; arithmetic check: C(69,5) x 26 = 11,238,513 x 26 = 292,201,338 | The "wait, what?" COUNTER "1 IN 292,201,338" with "Normal Powerball jackpot odds? 1 in 292 million." and a credit row |

## Fun fact (card)
"CO-WORKERS KNEW HIS VOICE, / NOT HIS FACE." Reader's Digest ("universally recognizing him by his voice, not his appearance"), Artful Living and the Irish Examiner all report that the people who named him recognised his voice on the released store video. Passes SUCCESs (simple, unexpected, concrete, credible, a story: the security boss caught by a security camera).

## Lesson (checklist card with SAVE ribbon, captions off)
Spoken cue: "Got a text saying you won? Save these three rules."
Rows: "NEVER PAY TO GET A PRIZE" / "NO ENTRY? THEN NO WIN" / "NO GIFT CARDS OR WIRES"; credit row "Source: FTC consumer advice".
From the FTC's consumer alert "Fake prize offers? Don't pay" (Mar 2021) https://consumer.ftc.gov/consumer-alerts/2021/03/fake-prize-offers-dont-pay and FTC guidance as reproduced by the San Joaquin County DA (Apr 2023) https://www.sjgov.org/department/da/news/consumer-alerts/consumer-alerts/2023/04/21/are-you-really-the-lucky-winner-spot-the-prize-scams : legitimate prizes never require a fee ("taxes", "shipping", "processing"); if you did not enter or play, you did not win; never pay by wire transfer, gift card or cryptocurrency. Useful to the viewer himself (prize texts target everyone).

## Quotes
- No quote is used on screen. The judge's "greed" remark is paraphrased ("The judge cited greed") from AP's report that he "mentioned Tipton's 'greed' in his sentencing". No dialogue is invented.

## Myths and claims NOT used
- That he "hacked Powerball": lottery officials said Powerball and scratch tickets were not part of the scheme (Bitdefender/Fox extracts); the episode uses Powerball only for the odds statistic.
- The exact three dates (sources differ on Nov 22/23).
- The $14.3 million figure (see above) and the claim that he was "caught by the hood / face" (he was recognised by voice).
- Parole after about five years (July 2022): true, recorded here, not narrated (the last line stays the sentence); offered to the owner for the seed comment.

## Ethics decisions
- Eddie Tipton, Tommy Tipton and Robert Rhodes are convicted adults; all three appear only as faceless silhouettes tagged "ILLUSTRATION · NOT A LIKENESS". Only Eddie is named in narration; Tommy is "his brother", Rhodes "a friend".
- The clerk, the co-worker, the lawyer, the lottery official and the young player are generic figures, never named.
- No logo, ticket design, store branding or game artwork of any real lottery, game or company is drawn: the ticket is a generic printed slip, the store is a generic gas station, and "Powerball" appears only as plain narration and card text.
- The camera/USB detail is an allegation and is labelled "PROSECUTORS SAID".
- End question is an opinion about him, not about any victim: "THE SECURITY BOSS RIGGED IT. / GENIUS OR GREEDY? / TAG THE MATE WHO PLAYS WEEKLY".
