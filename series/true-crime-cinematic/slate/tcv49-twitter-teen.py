"""Case File 49 (cinematic, premium look, ENGAGEMENT ENGINE + SHARES + SMOOTHNESS + HOOKS + 48+ rules): the July 2020
Twitter hack. On 15 July 2020 hijacked high-profile Twitter accounts (Barack Obama, Joe Biden, Elon Musk, Bill Gates, Jeff
Bezos, Apple, Kanye West among them) posted a "send Bitcoin and I will send double back" scam. Twitter said a small number
of employees were targeted by a "phone spear phishing" attack: callers posing as Twitter's IT help desk steered staff to a
look-alike login page and took their credentials, which opened Twitter's internal admin tools. 130 accounts were targeted;
tweets went out from 45. The scam took in more than $100,000 in Bitcoin in one day (Hillsborough State Attorney; NYDFS:
about $118,000). Graham Ivan Clark, 17, of Tampa, Florida, was arrested on 31 July 2020 and charged as an adult in Florida
state court with 30 felonies (two others were charged federally). On 16 March 2021 he pleaded guilty under a deal that
sentenced him as a youthful offender to three years in custody followed by three years' probation, with a ban on using
computers without law-enforcement permission and supervision.

The "wait, what?" statistic (a counter): the FBI's IC3 logged 1,611 SIM-swap complaints in 2021 with adjusted losses of over
$68 million (IC3 public service announcement I-020822-PSA, 8 Feb 2022).

Tone: remarkable and ironic, never glamorising the scam. Clark was a minor at the time: he appears only as a faceless
silhouette tagged NOT A LIKENESS, and nothing is said about his life now. No real tweet, logo, bird or badge is drawn: the
hero phone shows a generic social app with a generic tick and grey placeholder name bars; account names are plain text.
Research ledger: episodes/tcv49-twitter-teen/research.md. Shots: renderer/scenes/tcv49-twitter-teen.js."""
import json

EP = "tcv49-twitter-teen"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-15"

    scenes = [
        # A - hook: frame 1 = the HERO OBJECT (a phone showing a generic verified post) big and centred, his silhouette at a
        #     desk behind it already typing, the camera already pushing in; the headline burned in at the top. Line 1 = the
        #     contradiction with the number (done by 2.5 s); line 2 escalates at 3-5 s (the other names).
        S("s01_hook", "tt49_hook", [N("At 17, he hijacked Obama's Twitter."), N("Then Musk, Gates and Apple.", pause_before=0.1)],
          "tension", ["T_age", "T_accounts", "T_charged"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "click", 0.3), fw(0, 3, "glitch", 0.25, -0.03), fw(1, 4, "ping", 0.3, -0.02)],
          emph=["17,", "hijacked", "obama's", "musk,", "gates", "apple."], min_d=3.6, pad=0.1),
        # B - how: an open-plan tech office at night; a staffer answers her desk phone; the caller claims to be tech support;
        #     she types her password into a look-alike login page (a like moment: a held beat after the line)
        S("s02_call", "tt49_call", [N("How? He phoned staff, posing as tech support."), N("They typed passwords into a fake site.", pause_before=0.1)],
          "tension-rise", ["T_vishing", "T_fakesite"], sfx=[fw(0, 0, "knock", 0.2, 0.0), fw(0, 2, "beep", 0.25, -0.05), fw(1, 1, "typing", 0.35, -0.05), fw(1, 6, "thump", 0.35, 0.0)],
          emph=["how?", "phoned", "tech", "support.", "fake", "site."], min_d=3.6, pad=0.45, tr="cut"),
        # B/C - inside: back in his room, over his shoulder; the big monitor shows a generic admin panel; rows tick to TARGETED
        #     (the ACCOUNTS chip -> 130); then the monitor flips to the scam post (our own paraphrase, a generic post)
        S("s03_tools", "tt49_tools", [N("Inside, they targeted 130 accounts."), N("The tweets: send Bitcoin, get double back.", pause_before=0.15)],
          "tension-rise", ["T_tools", "T_130", "T_scam", "T_accounts"], sfx=[fw(0, 0, "whoosh", 0.25, -0.1), fw(0, 3, "stamp", 0.3, 0.0), fw(1, 1, "ping", 0.3, -0.02), fw(1, 5, "coins", 0.3, 0.0)],
          emph=["inside,", "targeted", "130", "tweets:", "bitcoin,", "double", "back."], min_d=3.6, pad=0.15, tr="dissolve"),
        # D - the biggest reveal (~50 %, music drop, the single impact + shake): the money; then the fun fact (Twitter froze
        #     every verified account) in the office as the staff scramble
        S("s04_money", "tt49_money", [N("In one day, people sent over $100,000."), N("So Twitter briefly muted every verified account.", pause_before=0.45)],
          "revelation", ["T_money", "T_freeze"], sfx=[fw(0, 0, "riser", 0.25, -0.5), fw(0, 6, "hit", 0.42, -0.03), fw(0, 6, "cash", 0.3, 0.1), fw(1, 3, "buzz", 0.2, 0.0), fw(1, 6, "sparkle", 0.3, 0.1)],
          emph=["one", "day,", "$100,000.", "muted", "every", "verified"], min_d=3.6, pad=0.2, tr="push"),
        # D - the arrest: the map (after 15 s) draws the USA in and flies to Florida; the pin lands on Tampa
        S("s05_arrest", "tt49_map", [N("Then, sixteen days later, police arrested him in Tampa.")],
          "revelation", ["T_arrest", "T_age", "T_charged"], sfx=[fx(0.0, "whoosh", 0.25), fw(0, 5, "cuffs", 0.35, 0.0), fw(0, 8, "ping", 0.3, -0.02)],
          emph=["sixteen", "days", "arrested", "tampa."], min_d=3.6, pad=0.2, tr="dissolve"),
        # C - the statistic (a counter): an investigators' office; the counter $0 -> $68M with the IC3 credit row
        S("s06_stat", "tt49_stat", [N("SIM swaps cost Americans $68 million in 2021.")],
          "tension", ["T_stat"], sfx=[fw(0, 0, "tick", 0.25, 0.0), fw(0, 4, "riser", 0.25, -0.4), fw(0, 5, "thump", 0.4, 0.0)],
          emph=["sim", "swaps", "$68", "million"], min_d=3.6, pad=0.2, tr="dissolve"),
        # B - the LESSON (save trigger, for the viewer himself): a young man at a bus shelter locks down his phone; captions OFF
        S("s07_lesson", "tt49_lesson", [N("Want to stop this? Save these three.")],
          "tension-rise", ["T_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 5, "chime", 0.25, 0.0)],
          emph=["stop", "save", "three."], min_d=3.6, pad=0.3, tr="cut"),
        # E - the outcome as the LAST lines, on the hero phone in the first frame's framing; the burned-in end question with
        #     the SEND line; pad 0.6, no fade (the reel loops to frame 1). The irony (no computers) is the last thing heard.
        S("s08_end", "tt49_end", [N("His plea deal: three years."), N("No computers without police supervision.", pause_before=0.25)],
          "aftermath", ["T_plea", "T_computers", "T_charged"], sfx=[fw(0, 1, "gavel", 0.35, -0.05), fw(1, 1, "sub", 0.3, -0.05), fw(1, 4, "click", 0.3, 0.0)],
          emph=["plea", "three", "years.", "no", "computers", "police"], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_call": "B", "s03_tools": "C", "s04_money": "D",
                "s05_arrest": "D", "s06_stat": "C", "s07_lesson": "B", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[0]["music_gain_db"] = -4    # no full drop inside the first 15 s (rule 7)
    scenes[6]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    scenes[3]["music_drop"] = True     # the biggest reveal (after 15 s)
    scenes[7]["music_drop"] = True     # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("abcan", "ABC Action News (WFTS Tampa Bay)", "Teen behind Twitter hack to serve 3 years in juvenile facility, 3 years probation", "https://www.abcactionnews.com/news/region-hillsborough/teen-behind-twitter-hack-to-serve-3-years-in-juvenile-facility-3-years-probation", "2021-03-16", A),
        src("fox13", "FOX 13 Tampa Bay", "Tampa teen takes deal in Twitter hacking case, may serve 3-year sentence in military-style camp", "https://fox13news.com/news/tampa-teen-takes-deal-in-twitter-hacking-case-may-serve-3-year-sentence-in-military-style-camp", "2021-03-16", A),
        src("cbs_sf", "CBS San Francisco (KPIX)", "Teen Sentenced To 3 Years In Prison For Hacking Celebrity Twitter Accounts", "https://www.cbsnews.com/sanfrancisco/news/teen-sentenced-to-3-years-in-prison-for-hacking-celebrity-twitter-accounts/", "2021-03-16", A),
        src("record_plea", "The Record (Recorded Future News)", "Teenage Twitter hacker pleads guilty, will serve 3 years in prison", "https://therecord.media/teenage-twitter-hacker-pleads-guilty-will-serve-3-years-in-prison/", "2021-03-16", A),
        src("bbc_plea", "BBC News", "Teen 'mastermind' pleads guilty to celeb Twitter hack", "https://bbc.in/38Oe4H4", "2021-03-17", A),
        src("darkreading", "Dark Reading", "Teen Behind Twitter Hack Agrees to Three Years in Prison", "https://www.darkreading.com/threat-intelligence/teen-behind-twitter-hack-agrees-to-three-years-in-prison/d/d-id/1340439", "2021-03", A),
        src("wfla", "WFLA (Tampa)", "Tampa teen behind 'mastermind' Twitter hack pleads guilty, accepts 3-year prison sentence", "https://www.wfla.com/news/local-news/tampa-teen-behind-mastermind-twitter-hack-pleads-guilty-accepts-3-year-prison-sentence/amp/", "2021-03-16", A),
        src("nbc_phone", "NBC News", "Twitter says hackers used a telephone to fool staff and gain access", "https://www.nbcnews.com/business/business-news/twitter-says-hackers-used-telephone-fool-staff-gain-access-n1235466", "2020-07-31", A),
        src("techxplore", "TechXplore (AFP)", "Twitter says hackers used phone to fool staff, gain access", "https://techxplore.com/news/2020-07-twitter-hackers-staff-gain-access.html", "2020-07-31", A),
        src("guardian_ng", "The Guardian Nigeria (AFP)", "Twitter says hack targeted employees using 'spear phishing'", "https://guardian.ng/?p=1194134", "2020-07-31", A),
        src("decrypt", "Decrypt", "Twitter reveals how the Bitcoin scam really happened", "https://decrypt.co/37306/twitter-reveals-how-the-bitcoin-scam-really-happened", "2020-07-31", A),
        src("scripps_dfs", "Scripps / Denver7", "Twitter hackers got access to accounts by posing as IT desk employees, report says (NYDFS report)", "https://denver7.com/news/national/twitter-hackers-got-access-to-accounts-by-posing-as-it-desk-employees-report-says", "2020-10-15", A),
        src("wmht_dfs", "WMHT New York NOW", "After July Twitter hack, NY agency recommends stronger regulation", "https://nynow.wmht.org/blogs/economy/after-july-twitter-hack-ny-agency-recommends-stronger-regulation/", "2020-10", A),
        src("npr_charged", "NPR", "Suspects charged in Twitter hack that targeted high-profile accounts", "https://www.npr.org/2020/07/31/897855204/suspects-charged-in-twitter-hack-that-targeted-high-profile-accounts", "2020-07-31", A),
        src("aj_charged", "Al Jazeera", "Three men charged in connection with celebrity Twitter hack", "https://www.aljazeera.com/news/2020/07/teen-arrested-mastermind-twitter-hack-200731191507910.html", "2020-07-31", A),
        src("aj_plea", "Al Jazeera", "US: Accused Twitter hacker teenager pleads not guilty", "https://www.aljazeera.com/news/2020/8/4/us-accused-twitter-hacker-teenager-pleads-not-guilty", "2020-08-04", A),
        src("nbcct", "NBC Connecticut (AP)", "Florida Teen 'Mastermind' Among 3 Charged in Massive Twitter Hack", "https://www.nbcconnecticut.com/news/national-international/florida-teen-accused-of-being-mastermind-of-twitter-hack-that-hit-gates-biden/2311490/?amp=1", "2020-07-31", A),
        src("baynews9", "Bay News 9", "Tampa teen, 2 others arrested in massive Twitter hack", "https://www.baynews9.com/fl/tampa/news/2020/08/01/tampa-teen--2-others-arrested-in-massive-twitter-hack", "2020-08-01", A),
        src("engadget", "Engadget", "Twitter temporarily disabled tweets from verified accounts", "https://engadget.com/twitter-disabled-verified-tweets-231734579.html", "2020-07-15", A),
        src("thewrap", "TheWrap", "Twitter blocks blue-check verified accounts after hack", "https://thewrap.com/twitter-blocks-blue-check-verified-accounts-hack", "2020-07-15", A),
        src("wtxl", "WTXL (Tallahassee)", "Twitter disables verified accounts after massive high-profile hack", "https://www.wtxl.com/news/local-news/twitter-disables-verified-accounts-after-massive-high-profile-hack", "2020-07-15", A),
        src("techradar", "TechRadar", "Twitter hack 2020", "https://www.techradar.com/news/twitter-hack-2020", "2020-07", A),
        src("ic3_psa", "FBI Internet Crime Complaint Center (IC3)", "Criminals Increasing SIM Swap Schemes to Steal Millions of Dollars from US Public (I-020822-PSA)", "https://www.ic3.gov/PSA/2022/PSA220208", "2022-02-08", A),
        src("record_sim", "The Record (Recorded Future News)", "FBI: $68 million lost to SIM swapping attacks in 2021", "https://therecord.media/fbi-68-million-lost-to-sim-swapping-attacks-in-2021", "2022-02", A),
        src("cfi_sim", "Crowdfund Insider", "The FBI Warns About Growing SIM Swap Threat: $68 Million Stolen in 2021", "https://www.crowdfundinsider.com/2022/02/187201-the-fbi-warns-on-growing-sim-swap-threat-68-million-stolen-in-2021/", "2022-02", A),
        src("ftc_sim", "Federal Trade Commission (Consumer Advice)", "SIM swap scams: how to protect yourself (consumer guidance)", "https://consumer.ftc.gov/node/76732", "2026", A),
        src("bleeping_ftc", "BleepingComputer", "FTC issues guidance on protecting against SIM swap attacks", "https://www.bleepingcomputer.com/news/security/ftc-issues-guidance-on-protecting-against-sim-swap-attacks", "2019-2020", A),
        src("ftc_code", "Federal Trade Commission (Consumer Alert)", "Got a call about fraud activity on your bank account? It could be a scammer", "https://consumer.ftc.gov/consumer-alerts/2024/06/got-call-about-fraud-activity-your-bank-account-it-could-be-scammer", "2024-06", A),
        src("cisa_mfa", "CISA", "More than a Password (multifactor authentication)", "https://www.cisa.gov/MFA", "2026", A),
    ]
    C = h.claim
    claims = [
        C("T_age", "Graham Ivan Clark of Tampa, Florida, was 17 at the time of the 15 July 2020 hack and when arrested (Hillsborough State Attorney's Office, as reported). Narration: 'At 17, ...'; AGE is not repeated after that.",
          ["nbcct", "npr_charged", "aj_plea", "abcan"]),
        C("T_accounts", "On 15 July 2020 hijacked accounts included Barack Obama, Joe Biden, Elon Musk, Bill Gates, Jeff Bezos, Mike Bloomberg, Apple and Kanye West. Narration names Obama, Musk, Gates and Apple; the headline names Obama, Musk and Apple (plain text only, no logos or real tweets).",
          ["guardian_ng", "techradar", "aj_charged", "nbcct"]),
        C("T_charged", "Prosecutors (Hillsborough State Attorney Andrew Warren) called him the 'mastermind'; he was charged as an adult in Florida state court with 30 felonies (Florida law allows minors to be charged as adults in financial fraud cases). Two others were charged federally. Narration: 'he hijacked' (he later pleaded guilty). Map label: 'Charged as an adult: 30 felonies'.",
          ["nbcct", "aj_plea", "npr_charged", "abcan"]),
        C("T_vishing", "Twitter said a small number of employees were targeted in a 'phone spear phishing' attack; the NYDFS report (Oct 2020) found that from 14 July callers posed as Twitter's IT help desk, saying they were checking VPN problems; Florida prosecutors said Clark presented himself to a Twitter employee as a member of the IT team. Narration: 'How? He phoned staff, posing as tech support.'",
          ["nbc_phone", "techxplore", "scripps_dfs", "wmht_dfs", "nbcct"]),
        C("T_fakesite", "The callers directed employees to a phishing website that looked identical to Twitter's real internal login page, where employees entered their credentials (NYDFS). Narration: 'They typed passwords into a fake site.'",
          ["scripps_dfs", "wmht_dfs", "decrypt"]),
        C("T_tools", "With the stolen credentials the hackers reached Twitter's internal tools / admin panel (customer-service portal).",
          ["nbc_phone", "guardian_ng", "nbcct"]),
        C("T_130", "Twitter said 130 accounts were targeted; the attackers tweeted from 45, accessed the DM inboxes of 36 and downloaded the data of 7 (NYDFS: 130 accounts hacked, tweets from 45). Narration: 'Inside, they targeted 130 accounts.' ACCOUNTS chip 4 -> 130.",
          ["guardian_ng", "scripps_dfs", "npr_charged"]),
        C("T_scam", "The posts offered to send back double any Bitcoin sent to an address (e.g. $2,000 for every $1,000). Narration paraphrases: 'The tweets: send Bitcoin, get double back.' The phone shows our own generic wording, not a real tweet.",
          ["guardian_ng", "nbcct", "techradar"]),
        C("T_money", "The State Attorney's office said the scheme reaped more than $100,000 in Bitcoin in one day; NYDFS put it at about $118,000; plea coverage about $117,000. Narration: 'In one day, people sent over $100,000.'",
          ["nbcct", "aj_charged", "scripps_dfs", "darkreading"]),
        C("T_freeze", "FUN FACT: during the attack Twitter temporarily stopped all verified (blue-check) accounts from tweeting. Narration: 'So Twitter briefly muted every verified account.' Card: 'TWITTER BRIEFLY BLOCKED / EVERY VERIFIED ACCOUNT / FROM TWEETING.'",
          ["engadget", "thewrap", "wtxl", "techradar"]),
        C("T_arrest", "Clark was arrested in Tampa on 31 July 2020, sixteen days after the 15 July hack. Narration: 'Then, sixteen days later, police arrested him in Tampa.' (Arrest by Florida authorities following an FBI/IRS/Secret Service investigation; narration says 'police'.)",
          ["npr_charged", "aj_charged", "baynews9", "nbcct"]),
        C("T_stat", "STATISTIC (counter): FBI IC3 received 1,611 SIM-swap complaints in 2021 with adjusted losses of over $68 million (up from 320 complaints and about $12 million in 2018-2020 combined). Narration: 'SIM swaps cost Americans $68 million in 2021.' Credit: 'FBI IC3 · Feb 2022'.",
          ["ic3_psa", "record_sim", "cfi_sim"]),
        C("T_lesson", "LESSON CARD (for the viewer): use an authentication app or security key rather than text-message codes (FTC: SMS may not stop a SIM swap; CISA: SMS codes can be phished or SIM-swapped); set a PIN or password on your mobile carrier account (FTC); never give a verification code or PIN to someone who calls you (FTC 2024 alert: sharing a code is always a scam; FBI IC3: do not give PINs or passwords to callers). Rows: 'USE AN AUTHENTICATOR APP', 'SET A CARRIER ACCOUNT PIN', 'NEVER GIVE A CALLER A CODE'.",
          ["ftc_sim", "bleeping_ftc", "ftc_code", "ic3_psa", "cisa_mfa"]),
        C("T_plea", "On 16 March 2021 Clark pleaded guilty and was sentenced the same day as a youthful offender to three years (reported as a juvenile facility / prison for young adults, possibly part at a boot camp), followed by three years' probation, with 229 days' credit. Narration: 'His plea deal: three years.'",
          ["abcan", "fox13", "cbs_sf", "record_plea", "bbc_plea", "darkreading"]),
        C("T_computers", "Under the plea deal he is barred from using computers without permission and supervision from law enforcement (and must hand over account passwords and submit to searches). Narration: 'No computers without police supervision.'",
          ["abcan", "darkreading", "wfla"]),
    ]

    figures = ["tt49_clark", "tt49_staffer", "tt49_engineer", "tt49_commuter", "tt49_agent", "tt49_viewer"]
    ep = h.base(EP, 49, "A 17-Year-Old Hacked Twitter's Biggest Accounts",
                "How did a 17-year-old in Tampa take over Obama's, Musk's and Apple's Twitter accounts with phone calls, and how did it end?",
                figures, scenes, claims, sources, "THE TWITTER HACK · JULY 2020", bpm=82)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#101a26", "mid": "#b4bcc4", "accent": "#52c4b4"}
    ep["geo"] = {"north_america": json.loads((h.ROOT / "series" / "true-crime" / "geo" / "north_america.json").read_text())}
    ep["target_duration_seconds"] = [30, 55]   # the owner's own read runs a little longer than the synthetic voice
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A 17-YEAR-OLD HIJACKED"}, {"text": "OBAMA, MUSK AND APPLE", "colour": "#52c4b4"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "AT 17, HE HACKED OBAMA."}, {"text": "GENIUS OR IDIOT? \U0001F447", "colour": "#52c4b4"},
                                 {"text": "TAG YOUR TECHIEST MATE", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the ACCOUNTS chip: 4 (Obama, Musk, Gates, Apple: the end of the hook) then 130 (the targeted accounts). Word-anchored
    # from out/<id>/timeline.json when a build exists (narration is cached, so they are stable); defaults are draft values.
    anchors = [("s01_hook", 1, 4, 3.6, 4), ("s03_tools", 0, 3, 11.4, 130)]
    keys = []
    try:
        tl = json.loads((h.ROOT / "out" / EP / "timeline.json").read_text())
        by = {s["id"]: s for s in tl}
    except Exception:
        by = {}
    for sid, li, wi, dflt, v in anchors:
        t = dflt
        sc = by.get(sid)
        if sc and sc.get("lines"):
            ln = sc["lines"][li]; ws = ln.get("words") or []
            t = round(ln["start"] + (ws[wi]["start"] if wi < len(ws) else 0.0), 2)
        keys.append({"t": max(t, 3.2), "v": v})
    ep["progress"] = {"label": "ACCOUNTS", "keys": keys, "y": 330,
                      "until": round(by["s03_tools"]["end"] - 0.25, 2) if "s03_tools" in by else 16.0}   # top of frame; gone before the big reveal
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "17": "seventeen", "130": "a hundred and thirty", "$100,000": "a hundred thousand dollars",
        "$68": "sixty-eight", "2021": "twenty twenty-one", "SIM": "Sim", "million": "million dollars"})
    ep["score"] = {"root_hz": 138.59, "bpm": 82,
                   "cliff": {"scene": "s04_money", "word": [0, 6], "at": 0.45}}
    ep["content_notes"] = ("Remarkable and ironic, never glamorising the scam. Graham Ivan Clark was 17 (a minor) at the time; he appears only as a "
                           "faceless silhouette tagged NOT A LIKENESS, and nothing is said about his life now. The Twitter staffer, engineers, "
                           "people on the street, investigators and the young man in the lesson are generic figures, never named. No real tweet, "
                           "screenshot, logo, bird, verified badge or app interface is reproduced: the phone shows a generic social app with a plain "
                           "tick and grey placeholder bars; account names appear only as plain text. The co-defendants are not named. The scam "
                           "wording is paraphrased. The statistic and lesson cards name their official sources. Every card is our own typed "
                           "graphic. No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
