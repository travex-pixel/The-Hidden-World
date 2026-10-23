"""Case File 54 (cinematic, premium look, ENGAGEMENT ENGINE + SHARES + SMOOTHNESS + HOOKS rules; script written for the
OWNER'S OWN VOICE: short plain lines, numbers written the way they are said, no tongue-twisters): Carl Stewart, 39, of
Liverpool, UK, who used the encrypted phone network EncroChat under the handle "Toffeeforce" (a nod to Everton FC). EncroChat
was secretly penetrated in 2020 by a French-Dutch joint investigation team (with Europol); in the UK the response was the
NCA-led Operation Venetic. Stewart shared a photo of a block of Stilton (police: from Marks & Spencer) in his hand; the
photo showed no face, but Merseyside Police analysts examined the palm and fingerprints in it and established they were
his. He pleaded guilty to conspiracy to supply cocaine, heroin, MDMA and ketamine and to transferring criminal property, and
in May 2021 at Liverpool Crown Court was sentenced to 13 years and six months. DI Lee Wilkinson: he was "caught out by his
love of Stilton cheese".

The "wait, what?" statistic (a counter): by 2 July 2020 UK law enforcement had seized over £54 million in criminal cash
(plus 746 arrests, 77 firearms and over two tonnes of Class A and B drugs) under Operation Venetic (NCA).
The LESSON (save card, for the viewer): what a photo you post can give away: fingertips in sharp focus (Japan's National
Institute of Informatics, 2017), location data in the file (FBI; U.S. Army), reflections in your eyes (the 2019 Tokyo
stalking case).

Tone: remarkable and ironic. No drugs are shown (plain packages only), no weapon, no violence. Stewart appears only as a
faceless silhouette tagged NOT A LIKENESS; investigators, the exhibits officer, the analyst and the young man in the lesson
are generic figures, never named. No real logo (the cheese wrapper is plain; "M&S" appears only as typed text).
Research ledger: episodes/tcv54-stilton-dealer/research.md. Shots: renderer/scenes/tcv54-stilton-dealer.js."""
import json

EP = "tcv54-stilton-dealer"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-16"

    scenes = [
        # A - hook: frame 1 = the HERO OBJECT (a block of blue Stilton held up in a palm, a phone camera's focus square
        #     snapping onto a fingertip whose print glows), the camera already pushing in; the headline burned in at the top.
        #     Line 1 = the contradiction (cheese -> 13 years), done by ~2.3 s; line 2 escalates at ~2.6 s (no face in it).
        S("s01_hook", "sd54_hook", [N("A photo of cheese got him 13 years."), N("His face was not even in it.", pause_before=0.3)],
          "tension", ["J_hook", "J_noface"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "shutter", 0.32), fw(0, 6, "thump", 0.35, -0.03), fw(1, 3, "hit", 0.3, -0.03)],
          emph=["photo", "cheese", "13", "years.", "face", "not"], min_d=3.6, pad=0.15),
        # A/B - who: a wet terraced street in Liverpool at night; his silhouette walks left to right, phone glowing
        S("s02_dealer", "sd54_dealer", [N("He was a Liverpool drug dealer."), N("He used EncroChat, a secret phone network.", pause_before=0.3)],
          "tension-rise", ["J_dealer", "J_encro"], sfx=[fx(0.0, "rain", 0.22), fw(1, 2, "click", 0.28, 0.0), fw(1, 4, "glitch", 0.2, 0.0)],
          emph=["liverpool", "drug", "dealer.", "encrochat,", "secret"], min_d=3.6, pad=0.3, tr="cut"),
        # B - the turn (a LIKE moment): a police cyber room; two investigators at screens; the padlock on the screen springs
        #     open on 'cracked' (sound hit, held pause)
        S("s03_cracked", "sd54_cracked", [N("But French and Dutch police had cracked it.")],
          "tension-rise", ["J_cracked", "J_venetic"], sfx=[fx(0.0, "typing", 0.2), fw(0, 6, "glitch", 0.28, -0.05), fw(0, 6, "hit", 0.35, 0.05)],
          emph=["french", "dutch", "police", "cracked"], min_d=3.6, pad=0.45, tr="dissolve"),
        # B - the fun fact + the fatal photo: his kitchen at night; the FUN FACT card (Toffeeforce = Everton); held pause;
        #     then he holds the Stilton up and takes the photo (shutter)
        S("s04_photo", "sd54_photo", [N("His username? Toffeeforce, after Everton."), N("He shared a photo of Stilton.", pause_before=0.5)],
          "tension-rise", ["J_toffee", "J_photo", "J_mands"], sfx=[fx(0.0, "rain", 0.15), fw(0, 2, "sparkle", 0.3, 0.0), fw(1, 3, "shutter", 0.38, 0.0)],
          emph=["username?", "toffeeforce,", "everton.", "shared", "photo", "stilton."], min_d=3.6, pad=0.2, tr="dissolve"),
        # D - THE BIGGEST REVEAL (~60 %, music drop, the single impact): a fingerprint lab; the photo on a big monitor, zoomed
        #     to the fingertip; a reference print beside it; the match lines draw in on 'fingerprints'
        S("s05_prints", "sd54_prints", [N("But look at the hand holding it."), N("Then police matched his palm and fingerprints.", pause_before=0.4)],
          "revelation", ["J_prints"], sfx=[fw(0, 1, "whoosh", 0.25, -0.05), fw(1, 2, "riser", 0.22, -0.5), fw(1, 6, "hit", 0.45, -0.03)],
          emph=["look", "hand", "matched", "palm", "fingerprints."], min_d=3.6, pad=0.4, tr="push"),
        # C - the statistic after the reveal (a counter, a LIKE moment): the scale of the whole UK sweep; an exhibits store;
        #     an officer logs plain banded bundles; £54 million
        S("s06_stat", "sd54_stat", [N("The hack's first haul? Over fifty-four million in cash.")],
          "tension", ["J_stat"], sfx=[fw(0, 3, "tick", 0.25, 0.0), fw(0, 4, "cash", 0.3, 0.0), fw(0, 6, "thump", 0.4, 0.0)],
          emph=["first", "haul?", "fifty-four", "million", "cash."], min_d=3.6, pad=0.5, tr="cut"),
        # B - the LESSON (save trigger, for the viewer): a young man at his table at night about to post a photo; the checklist
        #     card with the SAVE ribbon; captions off; on screen >= 3 s
        S("s07_lesson", "sd54_lesson", [N("Save this before your next post.")],
          "tension-rise", ["J_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 0, "chime", 0.25, 0.0)],
          emph=["save", "next", "post."], min_d=3.8, pad=0.25, tr="cut"),
        # E - the outcome as the LAST lines, back on the hero object in frame 1's framing (the loop); the burned-in end
        #     question with the SEND line; pad 0.6, no fade
        S("s08_end", "sd54_end", [N("His sentence? Thirteen and a half years."), N("Brought down by one block of cheese.", pause_before=0.4)],
          "aftermath", ["J_sentence", "J_caught"], sfx=[fw(0, 2, "gavel", 0.4, -0.05), fw(1, 6, "sub", 0.35, -0.05), fw(1, 6, "thump", 0.3, 0.0)],
          emph=["sentence?", "thirteen", "half", "years.", "brought", "down", "block", "cheese."], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_dealer": "A", "s03_cracked": "B", "s06_stat": "C", "s04_photo": "B",
                "s05_prints": "D", "s07_lesson": "B", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4      # no full drop inside the first 15 s (rule 7)
    by_id["s07_lesson"]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    by_id["s05_prints"]["music_drop"] = True      # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("ap_rep", "The Republic (Associated Press)", "Big cheese no more: UK drug dealer caught out by cheese pic", "https://www.therepublic.com/?p=446438", "2021-05", A),
        src("cbs", "CBS News", "Drug dealer identified by photo of cheese he posted on encrypted messaging service", "https://www.cbsnews.com/amp/news/carl-stewart-drug-dealer-identified-cheese-photo-encrochat", "2021-05", A),
        src("register", "The Register", "Drug dealer jailed after police spot his fingerprints on a photo of cheese", "https://www.theregister.com/2021/05/25/cheese_fingerprint_prison", "2021-05-25", A),
        src("fox", "FOX Television Stations (FOX 29)", "Cheese-loving drug dealer nabbed after posting picture, exposing his fingerprints, police say", "https://www.fox29.com/news/cheese-loving-drug-dealer-nabbed-after-posting-picture-exposing-his-fingerprints", "2021-05", A),
        src("wsvn", "WSVN 7News", "Drug dealer jailed after sharing a photo of cheese that included his fingerprints", "https://wsvn.com/news/us-world/drug-dealer-jailed-after-sharing-a-photo-of-cheese-that-included-his-fingerprints/", "2021-05", A),
        src("kcrg", "KCRG (Gray / CNN)", "Drug dealer arrested after sending photo of cheese", "https://www.kcrg.com/2021/05/30/drug-dealer-arrested-after-sending-photo-of-cheese", "2021-05-30", A),
        src("abc6", "ABC6", "Cheese-loving drug dealer jailed after police spot his fingerprints in a picture of a block of Stilton", "https://www.abc6.com/?p=565316", "2021-05", A),
        src("irishlegal", "Irish Legal News", "And finally... hard cheese", "https://www.irishlegal.com/articles/and-finally-hard-cheese-2", "2021-05", A),
        src("pedestrian", "PEDESTRIAN.TV", "A UK drug dealer wanted by the cops was foiled after trying to run an illicit cheese racket", "https://www.pedestrian.tv/news/drug-dealer-illicit-cheese-trading-liverpool/", "2021-05", A),
        src("mentalfloss", "Mental Floss", "Drug dealer arrested after sharing Stilton cheese photo", "https://www.mentalfloss.com/article/647008/drug-dealer-arrested-after-sharing-stilton-cheese-photo", "2021-05", A),
        src("mixmag", "Mixmag", "Drug dealer arrested after posting a picture of Stilton cheese", "https://mixmag.net/read/picture-of-a-block-of-stilton-leads-to-the-arrest-of-a-drug-dealer-news", "2021-05", A),
        src("eurojust", "Eurojust", "Dismantling of an encrypted network sends shockwaves through organised crime groups across Europe", "https://www.eurojust.europa.eu/it/node/2381", "2020-07-02", A),
        src("govinfo", "GovInfoSecurity", "European police hack encrypted communication system", "https://www.govinfosecurity.com/european-police-hack-encrypted-communication-system-a-14553", "2020-07", A),
        src("secaff", "Security Affairs", "European police infiltrate and dismantled EncroChat chat network", "https://securityaffairs.com/105517/cyber-crime/european-police-dismantled-encrochat.html", "2020-07", A),
        src("nca_2020", "National Crime Agency (newsroom)", "NCA and police smash thousands of criminal conspiracies after infiltration of encrypted communication platform in UK's biggest ever law enforcement operation", "https://nca-newsroom.prgloo.com/news/nca-and-police-smash-thousands-of-criminal-conspiracies-after-infiltration-of-encrypted-communication-platform-in-uks-biggest-ever-law-enforcement-operation", "2020-07-02", A),
        src("nca_venetic", "National Crime Agency", "Operation Venetic", "https://nationalcrimeagency.gov.uk/news/operation-venetic", "2020", A),
        src("lbc", "LBC", "746 arrests made in UK's biggest ever law enforcement operation", "https://www.lbc.co.uk/article/746-arrests-made-in-uks-biggest-ever-law-enforcement-operation-DWyZmh_2/", "2020-07-02", A),
        src("express", "Daily Express (via PressReader)", "746 arrested in record sting after police crack criminals' secret code", "https://www.pressreader.com/uk/daily-express/20200703/281732681764688", "2020-07-03", A),
        src("computing", "Computing", "Operation Venetic: Police bust crime chat network in UK's biggest ever law enforcement operation", "https://www.computing.co.uk/news/4017324/operation-venetic-police-bust-crime-chat-network-uk-biggest-law-enforcement-operation", "2020-07", A),
        src("nii_arab", "Arab News (AFP/Jiji)", "Japan researchers warn of fingerprint theft from 'peace' sign", "https://www.arabnews.com/node/1037351", "2017-01", A),
        src("nii_malay", "Malay Mail", "Japan researchers warn of fingerprint theft from 'peace' sign", "https://www.malaymail.com/amp/news/life/2017/01/12/japan-researchers-warn-of-fingerprint-theft-from-peace-sign/1290881", "2017-01-12", A),
        src("nii_reuters", "Reuters (Screenocean archive)", "'Peace' signs risk fingerprint theft, says Japanese study", "https://reuters.screenocean.com/record/164471", "2017-01", A),
        src("fbi", "FBI", "Cyber alerts for parents and kids (geotagged photos and 'pattern of life')", "https://www.fbi.gov/resolveuid/0f5ea92c08fe475cac1915a95a6ac351", "2026", A),
        src("patch_fbi", "Patch (FBI release)", "FBI warns about location data in posted photos", "https://patch.com/pennsylvania/pottstown/fbi-warns", "2026", A),
        src("army", "U.S. Army (army.mil)", "Mapping your life: Embedded data in photos could tip off criminals", "https://www.army.mil/article/51268/", "2010", A),
        src("eyes_cbs", "CBS News", "Japan man accused of assaulting pop star tracked her using selfies and Google Street View", "https://www.cbsnews.com/news/japan-man-accused-assault-pop-star-tracked-using-social-media-selfies-google-street-view-today-2019-10-09/", "2019-10-09", A),
        src("eyes_reg", "The Register", "Stalker found pop star's home from the reflection in her eyes", "https://www.theregister.co.uk/2019/10/10/stalker_japan_eyes", "2019-10-10", A),
        src("eyes_tnw", "The Next Web", "Stalker used reflection in eyes in a photo to find a Japanese idol's home", "https://thenextweb.com/news/stalker-japan-reflection-eye-camera-phone", "2019-10-09", A),
    ]
    C = h.claim
    case = ["ap_rep", "cbs", "register", "fox", "kcrg", "abc6"]
    claims = [
        C("J_hook", "Carl Stewart, 39, of Liverpool was identified from a photo he shared on EncroChat of a block of Stilton in his hand, and was sentenced to 13 years and six months. Narration: 'A photo of cheese got him 13 years.' (the photo identified him; the sentence was for the drug conspiracies; '13' rounds down 13 years 6 months; the last line gives the full term).",
          case),
        C("J_noface", "Merseyside Police: the photo did not show any facial features; analysts identified him from the palm and fingerprints. Narration: 'His face was not even in it.'",
          ["pedestrian", "irishlegal", "cbs", "fox"]),
        C("J_dealer", "He pleaded guilty to conspiracy to supply cocaine, conspiracy to supply heroin, MDMA and ketamine, and transferring criminal property; DI Lee Wilkinson said he was involved in supplying large amounts of Class A and B drugs. Narration: 'He was a Liverpool drug dealer.'",
          ["cbs", "ap_rep", "register", "fox", "mentalfloss"]),
        C("J_encro", "He used EncroChat, an encrypted phone network, under the handle 'Toffeeforce'. Narration: 'He used EncroChat, a secret phone network.'",
          ["cbs", "ap_rep", "pedestrian", "nca_2020"]),
        C("J_cracked", "In April 2020 Eurojust set up a joint investigation team between France and the Netherlands (with Europol), which put 'a technical device' in place to get past EncroChat's encryption; the interception ended on 13 June 2020 when EncroChat realised it had been penetrated. Narration: 'But French and Dutch police had cracked it.'",
          ["eurojust", "govinfo", "secaff"]),
        C("J_venetic", "The UK response was Operation Venetic, led by the National Crime Agency with police forces; the Stewart case came from it (Merseyside Police had arrested more than 60 people under it by May 2021). Card only.",
          ["nca_2020", "nca_venetic", "cbs", "pedestrian"]),
        C("J_stat", "STATISTIC (counter): announcing the first results on 2 July 2020, the NCA said UK law enforcement had arrested 746 suspects and seized over £54 million in criminal cash, 77 firearms and over two tonnes of Class A and B drugs so far. Narration: 'The hack\'s first haul? Over fifty-four million in cash.'",
          ["nca_2020", "lbc", "express", "computing"]),
        C("J_toffee", "FUN FACT CARD: his EncroChat handle was 'Toffeeforce', a nod / reference to Everton Football Club (nicknamed the Toffees). Narration: 'His username? Toffeeforce, after Everton.'",
          ["pedestrian", "kcrg", "cbs", "ap_rep"]),
        C("J_photo", "He shared on EncroChat a photo of a block of Stilton cheese in his hand. Narration: 'He shared a photo of Stilton.'",
          case),
        C("J_mands", "Label: Merseyside Police said the Stilton was from Marks & Spencer (typed text only; no logo or packaging is drawn).",
          ["cbs", "fox", "mixmag"]),
        C("J_prints", "Merseyside Police: his palm and fingerprints were analysed from the picture and it was established they belonged to Stewart. Narration: 'But look at the hand holding it. Then police matched his palm and fingerprints.'",
          ["cbs", "register", "fox", "irishlegal", "pedestrian"]),
        C("J_lesson", "LESSON CARD (practical, for the viewer): what a posted photo can give away. (1) Fingerprints: Japan's National Institute of Informatics (Isao Echizen, Jan 2017) copied fingerprints from photos taken about 3 m away when the fingers were in focus and well lit. (2) Location: photo files can carry GPS coordinates (EXIF); the FBI warns that posted images can reveal a 'pattern of life', and the U.S. Army warns embedded photo data can tip off criminals. (3) Reflections: in 2019 a man in Tokyo found a singer's home from a station/bus stop reflected in her eyes in selfies (police account, widely reported). Rows: 'FINGERTIPS IN SHARP FOCUS', 'HIDDEN LOCATION DATA', 'REFLECTIONS IN YOUR EYES'.",
          ["nii_arab", "nii_malay", "nii_reuters", "fbi", "patch_fbi", "army", "eyes_cbs", "eyes_reg", "eyes_tnw"]),
        C("J_sentence", "He was sentenced to 13 years and six months at Liverpool Crown Court (reported 24-30 May 2021). Narration: 'His sentence? Thirteen and a half years.'",
          case + ["irishlegal"]),
        C("J_caught", "DI Lee Wilkinson (Merseyside Police) said Stewart was 'caught out by his love of Stilton cheese'. Narration: 'Brought down by one block of cheese.'",
          ["cbs", "ap_rep", "fox", "mentalfloss"]),
    ]

    figures = ["sd54_stewart", "sd54_cyber1", "sd54_cyber2", "sd54_officer", "sd54_analyst", "sd54_viewer"]
    ep = h.base(EP, 54, "A Photo of Cheese Caught a UK Drug Dealer",
                "How did a photo of a block of Stilton, with no face in it, put a Liverpool drug dealer in prison?",
                figures, scenes, claims, sources, "THE STILTON DEALER · LIVERPOOL 2020", bpm=78)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#131c24", "mid": "#cfc2a8", "accent": "#5fb0d6"}
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A PHOTO OF CHEESE"}, {"text": "CAUGHT A UK DRUG DEALER", "colour": "#5fb0d6"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "13½ YEARS. ONE CHEESE PIC."}, {"text": "SMART COPS OR DUMB DEALER? \U0001F447", "colour": "#5fb0d6"},
                                 {"text": "TAG THE MATE WHO OVERSHARES", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the CLUES chip: 1 on 'cracked' (s03), 2 on 'Stilton' (s05), 3 on 'fingerprints' (s06). Word-anchored from
    # out/<id>/timeline.json when a build exists (narration is cached, so they are stable); defaults are draft values.
    anchors = [("s03_cracked", 0, 6, 11.4, "1 OF 3"), ("s04_photo", 1, 5, 18.4, "2 OF 3"), ("s05_prints", 1, 6, 22.6, "3 OF 3")]
    keys = []
    try:
        tl = json.loads((h.ROOT / "out" / EP / "timeline.json").read_text())
        by = {s["id"]: s for s in tl}
    except Exception:
        by = {}
    for sid, li, wi, dflt, v in anchors:
        t = dflt
        sc = by.get(sid)
        if sc and sc.get("lines") and li < len(sc["lines"]):
            ln = sc["lines"][li]; ws = ln.get("words") or []
            t = round(ln["start"] + (ws[wi]["start"] if wi < len(ws) else 0.0), 2)
        keys.append({"t": t, "v": v})
    ep["progress"] = {"label": "CLUES", "keys": keys, "y": 330,
                      "until": round(by["s07_lesson"]["start"] - 0.3, 2) if "s07_lesson" in by else 28.5}   # gone before the lesson
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "13": "thirteen", "EncroChat": "Encro chat", "Toffeeforce": "Toffee force", "UK": "U K", "fifty-four": "fifty four"})
    ep["score"] = {"root_hz": 138.59, "bpm": 78,
                   "cliff": {"scene": "s05_prints", "word": [1, 6], "at": 0.45}}
    ep["content_notes"] = ("Tone: remarkable and ironic. No drugs are shown (plain packages only), no weapon, no violence. Carl Stewart (convicted, "
                           "sentenced May 2021) appears only as a faceless silhouette tagged NOT A LIKENESS; the big hand holding the cheese is a "
                           "generic illustrated hand, not his. The investigators, exhibits officer, fingerprint analyst and the young man in the "
                           "lesson are generic figures, never named; no badge, crest or insignia of any real force. The cheese wrapper is plain "
                           "(no logo); 'M&S' appears only as typed text attributed to police. No banknote is imitated (plain banded bundles). "
                           "The statistic card names its source and date. Every card is our own typed graphic. No dialogue is invented. "
                           "Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
