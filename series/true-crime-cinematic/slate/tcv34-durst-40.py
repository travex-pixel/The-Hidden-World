"""Case File 34 (cinematic, 40-second cut): Robert Durst and the hot microphone.
A New York real-estate heir volunteered for the HBO series "The Jinx". His first wife, Kathleen McCormack Durst, was last
seen on 31 January 1982 and was never found; his close friend Susan Berman was shot dead at her home near Beverly Hills in
December 2000, and an anonymous note ("CADAVER" plus her address, the envelope misspelt "Beverley") reached the police.
He denied writing it for years. The filmmakers found a letter he had sent Berman in the same handwriting with the same
misspelling; after the final interview (18 April 2012) he went to the bathroom still wearing a live microphone and was
recorded saying "What the hell did I do? Killed them all, of course." (wording as reported; a 2019 New York Times
transcript report showed the remarks had been re-ordered in editing, which is stated on a card). He was arrested in New
Orleans on 14 March 2015, the day before the finale aired. The recording was played to the jury; the handwriting match was
the key evidence.

CLOSED: convicted of Berman's first-degree murder on 17 September 2021; sentenced to life without parole on 14 October
2021; charged in New York with Kathleen's murder (complaint 19 October 2021, indictment reported 1 November 2021); died in
custody on 10 January 2022, so that case never went to trial.
Format: short40 (target 42-45 s, hard window 30-50 s); EPISODE 29+ rules: the hook headline leads with the everyday OBJECT
(a lavalier microphone clipped to a lapel), a stakes line by 0:10, the irony beat (he volunteered for the interviews; it
was his own microphone), the HOW at ~60 %, the outcome inside the last 8 s, a burned-in YES/NO end question (end_title).
No nextcase card; no music_drop before 15 s; the 2001 Texas case is omitted entirely.
Research ledger: episodes/tcv34-durst-40/research.md. Shots: renderer/scenes/tcv34-durst-40.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-13"

    scenes = [
        # A - hook: the hero object (a generic lavalier microphone clipped to a dark lapel, macro, big and centred) from the
        #     first frame; the headline is burned in by the engine; the object and the contradiction in the first 3 s
        S("s01_hook", "rd34_hook", [N("Robert Durst offered to do a television interview."),
                                    N("Then he went to the bathroom wearing a live mic.", pause_before=0.2)],
          "cold", ["R_heir", "R_interview", "R_mic"], sfx=[fx(0.0, "sub", 0.45), fx(0.15, "wind", 0.3), fw(0, 2, "thud", 0.4, 0.05),
                                                           fw(1, 8, "hit", 0.5, -0.05), fw(1, 9, "ping", 0.35, 0.1)],
          emph=["durst", "offered", "interview.", "bathroom", "live", "mic."], min_d=5.0, pad=0.2),
        # A - the stakes by 0:10: two women, 1982 and 2000, said once and plainly in a quiet task-force room
        S("s02_stakes", "rd34_stakes", [N("His wife vanished in 1982. His best friend was shot dead in 2000.", pause_before=0.1)],
          "hush", ["R_wife", "R_berman"], sfx=[fx(0.0, "wind", 0.3), fw(0, 2, "thump", 0.4, -0.05), fw(0, 9, "thump", 0.4, -0.05)],
          emph=["wife", "vanished", "1982.", "friend", "shot", "dead", "2000."], min_d=3.6, pad=0.2, tr="fade"),
        # B - clue 1: the anonymous note (the word, the address, the misspelt envelope)
        S("s03_note", "rd34_note", [N("Police got an anonymous note: cadaver, and her address.")],
          "tension", ["R_note"], sfx=[fx(0.0, "whoosh", 0.35), fw(0, 1, "paper", 0.4, -0.05), fw(0, 5, "stamp", 0.45, -0.05)],
          emph=["anonymous", "note:", "cadaver,", "address."], pad=0.2, tr="push"),
        # B - clue 2 and the irony: he denied writing it, and volunteered for the HBO series himself
        S("s04_jinx", "rd34_jinx", [N("He denied writing it, even to the HBO crew filming him.")],
          "tension", ["R_denied", "R_interview"], sfx=[fw(0, 1, "thud", 0.35, -0.05), fw(0, 6, "click", 0.4, -0.05), fw(0, 7, "whoosh", 0.3, -0.05)],
          emph=["denied", "HBO", "crew", "filming"], pad=0.2, tr="push"),
        # B/C - clue 3: the letter he had sent her; same handwriting, same misspelling (pause before the reveal)
        S("s05_letter", "rd34_letter", [N("The filmmakers found a letter he'd sent her."),
                                        N("Same handwriting, same spelling mistake.", pause_before=0.25)],
          "tension-rise", ["R_letter", "R_note"], sfx=[fw(0, 2, "paper", 0.4, -0.05), fw(0, 4, "click", 0.35, -0.05), fw(1, 0, "swell", 0.4, -0.3), fw(1, 4, "hit", 0.5, -0.05)],
          emph=["letter", "same", "handwriting,", "spelling", "mistake."], pad=0.25, tr="push"),
        # C - THE HOW: confronted, he went to the bathroom with the mic still on; the reported wording on a card (music drop)
        S("s06_mic", "rd34_mic", [N("Confronted, he went to the bathroom, mic still on."),
                                  N("It caught him: killed them all, of course.", pause_before=0.3)],
          "revelation", ["R_mic", "R_edit", "R_letter"], sfx=[fw(0, 0, "thud", 0.35, -0.05), fw(0, 2, "step", 0.3, 0.05), fw(0, 5, "door", 0.45, -0.05),
                                                              fw(0, 6, "ping", 0.35, -0.05), fw(1, 1, "swell", 0.45, -0.3), fw(1, 3, "hit", 0.55, -0.05)],
          emph=["confronted,", "bathroom,", "mic", "still", "on.", "killed", "them", "all,"], pad=0.25, tr="flash"),
        # C - the irony, part two: arrested the day before the finale aired
        S("s07_arrest", "rd34_arrest", [N("He was arrested the day before it aired.")],
          "tension-rise", ["R_arrest", "R_letter"], sfx=[fx(0.0, "whoosh", 0.35), fw(0, 2, "stamp", 0.45, -0.05), fw(0, 7, "thump", 0.4, -0.05)],
          emph=["arrested", "day", "before", "aired."], min_d=2.6, pad=0.2, tr="push"),
        # D - the outcome; the cliff impact sits in the pause between the two lines
        S("s08_verdict", "rd34_verdict", [N("In 2021 a jury convicted him of his friend's murder."), N("Sentence: life without parole.", pause_before=0.35)],
          "tension-peak", ["R_verdict", "R_sentence", "R_tape_trial"], sfx=[fw(0, 4, "gavel", 0.8, -0.08)],
          emph=["2021", "convicted", "murder.", "life", "without", "parole."], min_d=3.4, pad=0.3, tr="zoom"),
        # E - callback on the hero object (the first frame's framing), the Kathleen case on a card, the memorial last;
        #     the engine burns the end question over the last 3.2 s
        S("s09_end", "rd34_end", [N("He died in custody in 2022, charged with his wife's murder too."), N("We remember them both.", pause_before=0.3)],
          "aftermath", ["R_death", "R_kathie_charge", "R_victims"], sfx=[fx(0.0, "wind", 0.3), fw(0, 1, "thud", 0.35, -0.05), fw(0, 6, "click", 0.35, -0.05)],
          emph=["died", "custody", "2022,", "charged", "wife's", "remember"], min_d=4.0, pad=1.3, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_stakes": "A", "s03_note": "B", "s04_jinx": "B", "s05_letter": "C",
                "s06_mic": "C", "s07_arrest": "C", "s08_verdict": "D", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[1]["music_gain_db"] = -4   # the stakes: the score steps back (no full drop inside the first 15 s, rule 7)
    scenes[5]["music_drop"] = True    # the HOW: the bathroom and the live mic (starts well after 15 s)
    # no fade to black: the final frame is the lapel microphone, big and centred under the burned-in end question, so the
    # video loops cleanly back to its first frame

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("abc7_arrest", "ABC7 Los Angeles (AP)", "Robert Durst, subject of HBO series, arrested on murder charges in New Orleans", "https://abc7.com/robert-durst-murder-the-jinx/558780/", "2015-03-15", A),
        src("apr_arrest", "Alabama Public Radio (NPR)", "Robert Durst, Subject Of HBO's 'The Jinx,' Arrested In New Orleans", "https://www.apr.org/2015-03-15/robert-durst-subject-of-hbos-the-jinx-arrested-in-new-orleans", "2015-03-15", A),
        src("csm_arrest", "The Christian Science Monitor", "After HBO film, wealthy eccentric arrested for murder", "https://m.csmonitor.com/USA/2015/0315/After-HBO-film-wealthy-eccentric-arrested-for-murder", "2015-03-15", A),
        src("bangor_wire", "Bangor Daily News (wire)", "New York real estate scion Robert Durst agrees to extradition on murder charge", "https://www.bangordailynews.com/2015/03/16/news/new-york-real-estate-scion-robert-durst-agrees-to-extradition-on-murder-charge/", "2015-03-16", A),
        src("abc7_finale", "ABC7 News", "Robert Durst says in HBO finale he 'killed them all'", "https://abc7news.com/post/robert-durst-says-in-hbo-finale-he-killed-them-all/558878/", "2015-03-15", A),
        src("nbc_jinx2", "NBC News", "'The Jinx Part Two' revisits the Robert Durst saga of murder and mystery", "https://www.nbcnews.com/news/amp/rcna149001", "2024-04", A),
        src("thr_jinx2", "The Hollywood Reporter", "'The Jinx' director Andrew Jarecki on the Robert Durst encounter", "https://www.hollywoodreporter.com/tv/tv-news/the-jinx-director-andrew-jarecki-safety-robert-durst-encounter-1235879470/", "2024-04", A),
        src("greenwich_verdict", "Greenwich Time (via PressReader)", "HBO series helped lead to Durst murder conviction", "https://www.pressreader.com/usa/greenwich-time-sunday/20210919/281818581967770", "2021-09-19", A),
        src("cns_tape", "City News Service (via KFI)", "Jury Hears Tape of Durst Saying 'Killed Them All'", "https://kfiam640.iheart.com/content/2020-03-05-jury-hears-tape-of-durst-saying-killed-them-all", "2020-03-05", A),
        src("guardian_open", "The Guardian (via PressReader)", "Robert Durst: Berman murder trial opens with jury watching The Jinx", "https://www.pressreader.com/usa/the-guardian-usa/20200306/281638192257721", "2020-03-06", A),
        src("ap_audio", "AP (via KTVU)", "Audio of Durst in bathroom could play 2 ways in murder case", "https://www.ktvu.com/news/audio-of-durst-in-bathroom-could-play-2-ways-in-murder-case", "2020-03", A),
        src("spin_edit", "Spin (reporting the New York Times transcript)", "Robert Durst's 'Jinx' confession was edited, trial evidence shows", "https://www.spinmagazine.com/2019/04/robert-durst-the-jinx-confession-murder-trial-evidence/", "2019-04", A),
        src("newser_edit", "Newser", "Durst's Final Jinx Words Seem 'Damning.' They Were Also Edited", "https://www.newser.com/story/274359/problematic-editing-altered-dursts-jinx-confession.html", "2019-04", A),
        src("buzzfeed_edit", "BuzzFeed News", "The Holes In 'The Jinx' Might Go Deeper Than We Thought", "https://www.buzzfeednews.com/article/kateaurthur/the-holes-in-the-jinx-might-go-deeper-than-we-thought", "date not in extract", A),
        src("dailybeast_edit", "The Daily Beast", "How will HBO's The Jinx and Robert Durst's doctored confession factor into his murder trial", "https://www.thedailybeast.com/how-will-hbos-the-jinx-and-robert-dursts-doctored-confession-factor-into-his-murder-trial/", "date not in extract", A),
        src("aol_refresher", "AOL / Yahoo News", "The Jinx Part Two is out Sunday. Here's a refresher on Robert Durst's story", "https://www.aol.com/jinx-happened-season-one-led-232659182.html", "2024-04", A),
        src("ap_lawyers", "AP (via KSL)", "Lawyers: Robert Durst wrote incriminating 'cadaver' note", "https://www.ksl.com/article/46697805/lawyers-robert-durst-wrote-incriminating-cadaver-note", "2020-03", A),
        src("ap_cadaver", "AP (via Fox 11)", "Robert Durst says he lied, penned 'cadaver' note to police", "https://fox11online.com/news/nation-world/robert-durst-says-he-lied-penned-cadaver-note-to-police", "2021-08", A),
        src("ap_closing", "AP, Brian Melley (via Court TV)", "Prosecutor says cadaver note proves Durst killed friend", "https://www.courttv.com/news/prosecutor-says-cadaver-note-proves-durst-killed-friend/", "2021-09", A),
        src("chn_arrest", "Courthouse News (AP)", "Durst arrest: handwriting analysis the key new evidence", "https://www.courthousenews.com/?p=536287", "2015-03", A),
        src("fox_letter", "Fox News", "Letter, not recording, led authorities to arrest Robert Durst for friend's murder", "https://www.foxnews.com/us/letter-not-recording-led-authorities-to-arrest-robert-durst-for-friends-murder", "date not in extract", A),
        src("cbs_sentence", "CBS News", "Robert Durst sentenced to life in prison for killing best friend Susan Berman", "https://www.cbsnews.com/news/robert-durst-sentenced-to-life-in-prison-for-killing-best-friend-susan-berman/", "2021-10-14", A),
        src("spectrum_sentence", "Spectrum News 1 (AP)", "Robert Durst sentenced to life in California prison", "https://spectrumnews1.com/ca/la/crime/2021/10/14/robert-durst-sentenced-to-life-in-california-prison", "2021-10-14", A),
        src("rs_sentence", "Rolling Stone", "Robert Durst Sentenced To Life Without Parole in Susan Berman Murder", "https://www.rollingstone.com/culture/culture-news/robert-durst-sentence-susan-berman-murder-1242348/", "2021-10-14", A),
        src("abc13_timeline", "ABC13 Houston", "Robert Durst: A timeline of his life and alleged crimes", "https://abc13.com/robert-durst-murders-texas-who-is/5944699/", "date not in extract", A),
        src("cnn_indict", "CNN (via ABC17)", "New York grand jury indicts Robert Durst on murder charge", "https://abc17news.com/news/national-world/cnn-national/2021/11/01/new-york-grand-jury-indicts-robert-durst-on-murder-charge/", "2021-11-01", A),
        src("oxygen_charge", "Oxygen (NBCUniversal)", "Robert Durst Charged With The Murder Of His First Wife", "https://www.oxygen.com/crime-news/robert-durst-charged-with-the-murder-of-kathie-mccormack-durst", "2021-10-22", A),
        src("avpress_charge", "Antelope Valley Press (via PressReader)", "Robert Durst charged with 1982 murder of first wife", "https://avpress.pressreader.com/article/281578063866511", "2021-10", A),
        src("abc6_death", "6abc Philadelphia (AP)", "Convicted murderer Robert Durst dies in custody", "https://6abc.com/post/convicted-murderer-robert-durst-dies-in-custody/11452062/", "2022-01-10", A),
        src("abc30_death", "ABC30 Fresno", "Robert Durst, millionaire convicted of killing Susan Berman, has died at age 78", "https://abc30.com/robert-durst-death-dies-murders-texas/11449771/", "2022-01-10", A),
        src("nbc_kathie", "NBC News (Dateline)", "Thirty-six years after her disappearance, Kathie Durst's family still seeks answers", "https://www.nbcnews.com/dateline/thirty-six-years-after-her-disappearance-kathie-durst-s-family-n843401", "2018-02-01", A),
        src("cbs_kathie", "CBS New York", "Retired NYPD detective hopes for resolution in disappearance of Robert Durst's wife", "https://www.cbsnews.com/newyork/news/retired-nypd-detective-hopes-for-resolution-in-disappearance-of-robert-dursts-wife/", "date not in extract", A),
        src("news12_kathie", "News 12 Westchester", "Monday to mark 40 years since disappearance of Kathie Durst", "https://westchester.news12.com/monday-to-mark-40-years-since-disappearance-of-kathie-durst", "2022-01", A),
        src("abc7_berman", "ABC7 Los Angeles", "What you need to know about alleged Durst victim Susan Berman", "https://abc7.com/news/what-you-need-to-know-about-alleged-durst-victim-susan-berman/559937/", "2015-03", A),
        src("nbc_hearing", "NBC News", "Robert Durst, scowling, faces photos of slain friend at murder hearing", "https://www.nbcnews.com/news/crime-courts/robert-durst-scowling-faces-photos-slain-friend-murder-hearing-n866516", "2018-04", A),
    ]
    C = h.claim
    claims = [
        C("R_heir", "Robert Durst was a New York real-estate heir ('scion' of the Durst family). Narration: 'Robert Durst'; label: 'NEW YORK REAL-ESTATE HEIR'.",
          ["bangor_wire", "abc7_arrest", "csm_arrest", "nbc_jinx2"]),
        C("R_interview", "Durst approached the filmmaker after the 2010 feature 'All Good Things' and volunteered to be interviewed for the HBO series 'The Jinx' (THR: about 21 hours of interviews, not stated). Narration: 'Robert Durst offered to do a television interview.'",
          ["thr_jinx2", "greenwich_verdict", "nbc_jinx2"]),
        C("R_mic", "After the final interview (recorded 18 April 2012) he went to the bathroom still wearing a live microphone and was recorded saying, among other remarks, 'There it is. You're caught.' and 'What the hell did I do? Killed them all, of course.' The finale aired on 15 March 2015. Narration: 'Then he went to the bathroom wearing a live mic.' / 'It caught him: killed them all, of course.' The card says 'wording as reported'.",
          ["abc7_finale", "abc7_arrest", "cns_tape", "ap_audio"]),
        C("R_edit", "CARD ONLY: a 2019 New York Times report on the unedited transcript showed the bathroom remarks were pulled from a longer sequence of rambling remarks and re-ordered; the filmmakers said they put 'killed them all' last for dramatic effect; the editing came out at trial. Card: 'THE AUDIO WAS LATER SHOWN TO BE RE-ORDERED IN EDITING'.",
          ["spin_edit", "newser_edit", "buzzfeed_edit", "dailybeast_edit", "aol_refresher"]),
        C("R_wife", "Kathleen McCormack Durst, his first wife, 29 and a medical student, was last seen on 31 January 1982 (Durst said he put her on a train at South Salem, New York); she was never found. Narration: 'His wife vanished in 1982.' Card: '1982 · HIS WIFE VANISHED · NEVER FOUND'. She is named only on the memorial card.",
          ["nbc_kathie", "cbs_kathie", "news12_kathie", "cnn_indict"]),
        C("R_berman", "Susan Berman, 55, a writer and his close friend (CBS: 'best friend'), was shot dead at her home near Beverly Hills in December 2000, as New York investigators prepared to question her about Kathleen's disappearance. Narration: 'His best friend was shot dead in 2000.' She is named only on the memorial card; nothing of the crime is shown.",
          ["abc7_berman", "nbc_hearing", "cbs_sentence"]),
        C("R_note", "An anonymous note mailed to Beverly Hills police gave only Berman's address and the word 'CADAVER', in block letters; the envelope misspelled Beverly as 'Beverley'. Narration: 'Police got an anonymous note: cadaver, and her address.' The drawn envelope and note are generic (tag 'NOT THE REAL NOTE'); no address is drawn.",
          ["ap_lawyers", "ap_cadaver", "ap_closing"]),
        C("R_denied", "Durst denied writing the note for years, to police and to the documentary filmmakers; at trial in August 2021 he admitted writing it but denied the killing. Narration: 'He denied writing it, even to the HBO crew filming him.'",
          ["ap_cadaver", "ap_closing", "ap_lawyers"]),
        C("R_letter", "The Jinx filmmakers found an earlier letter Durst had sent Berman with nearly identical handwriting and the same 'Beverley' misspelling; confronted with the two side by side he could not tell them apart. A law-enforcement official told AP the handwriting analysis linking the letters was the key new evidence given to prosecutors before his arrest; the prosecutor called the note the 'smoking gun'. Narration: 'The filmmakers found a letter he'd sent her.' / 'Same handwriting, same spelling mistake.'",
          ["ap_lawyers", "ap_cadaver", "chn_arrest", "fox_letter", "ap_closing"]),
        C("R_arrest", "FBI agents arrested Durst at a New Orleans hotel on Saturday 14 March 2015, the day before the finale aired, on a Los Angeles warrant for Berman's murder. Narration: 'He was arrested the day before it aired.' Card: 'NEW ORLEANS · 14 MARCH 2015'.",
          ["abc7_arrest", "apr_arrest", "csm_arrest", "nbc_jinx2"]),
        C("R_tape_trial", "CARD ONLY: the bathroom recording was played to the jury in Los Angeles during opening statements in March 2020; the trial was paused by the pandemic and resumed in May 2021 with the same jury. Card: 'THE LETTER AND THE TAPE WERE BOTH IN EVIDENCE'.",
          ["cns_tape", "guardian_open", "ap_audio"]),
        C("R_verdict", "A Los Angeles jury convicted Durst of the first-degree murder of Susan Berman, with special circumstances, on 17 September 2021. Narration: 'In 2021 a jury convicted him of his friend's murder.'",
          ["cbs_sentence", "rs_sentence", "greenwich_verdict", "abc13_timeline"]),
        C("R_sentence", "Judge Mark Windham sentenced him to life without the possibility of parole on 14 October 2021. Narration: 'Sentence: life without parole.'",
          ["cbs_sentence", "spectrum_sentence", "rs_sentence"]),
        C("R_kathie_charge", "A second-degree murder complaint over Kathleen's death was filed in Lewisboro Town Court on 19 October 2021 and a Westchester County grand jury indictment was reported on 1 November 2021. Narration: 'charged with his wife's murder too'. Card: 'OCT-NOV 2021'.",
          ["cnn_indict", "oxygen_charge", "avpress_charge"]),
        C("R_death", "Durst died of natural causes in custody (at an outside hospital, per the California corrections department) on 10 January 2022, aged 78, while awaiting trial on the Kathleen charge; that case never went to trial. Narration: 'He died in custody in 2022'. Card: 'THAT CASE NEVER WENT TO TRIAL'.",
          ["abc6_death", "abc30_death", "cnn_indict"]),
        C("R_victims", "CARD ONLY (memorial): Kathleen McCormack Durst (29 when last seen in 1982) and Susan Berman (55, killed in 2000). Narration: 'We remember them both.'",
          ["nbc_kathie", "abc7_berman", "cbs_sentence"]),
    ]

    figures = ["rd34_durst", "rd34_filmmaker", "rd34_crew", "detective", "analyst", "examiner", "agent_a", "agent_b", "judge"]
    ep = h.base("tcv34-durst-40", 34, "A Hot Mic Helped Convict Robert Durst",
                "How did a microphone he agreed to wear, and a letter he had posted years earlier, help convict Robert Durst?",
                figures, scenes, claims, sources, "ROBERT DURST · 1982-2022", bpm=80)
    ep["format"] = "short40"
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A LIVE MICROPHONE"}, {"text": "HELPED CONVICT ROBERT DURST", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["end_title"] = {"lines": [{"text": "DID THE MIC GIVE HIM AWAY?"}, {"text": "YES OR NO? \U0001F447", "colour": "#ffd23f"}],
                       "from": 3.2, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "HBO": "H B O", "mic": "mike", "filmmakers": "film makers", "1982": "nineteen eighty two", "2000": "two thousand",
        "2021": "twenty twenty one", "2022": "twenty twenty two"})
    ep["score"] = {"root_hz": 146.83, "bpm": 80,
                   "cliff": {"scene": "s08_verdict", "word": [1, 0], "at": -0.3}}
    ep["content_notes"] = ("Closed: Robert Durst was convicted of the first-degree murder of Susan Berman on 17 September 2021, sentenced to life "
                           "without parole on 14 October 2021, charged in New York with the murder of Kathleen McCormack Durst (October-November "
                           "2021) and died in custody on 10 January 2022, so that case never went to trial. Durst is drawn only as an anonymous "
                           "rim-lit silhouette (not a likeness, never a photo or interview recreation), never posed heroically; the only words of "
                           "his are the reported bathroom remarks, on a 'wording as reported' card that also says the audio was later shown to be "
                           "re-ordered in editing. The victims are named only on the memorial card and are never shown; no violence, weapon, body, "
                           "home or crime scene is drawn; the 2001 Texas case is omitted entirely. The note, envelope and letter are generic drawings "
                           "(tagged 'not the real note' / 'not the real letters'), showing only the reported word 'CADAVER' and the reported "
                           "'BEVERLEY' misspelling, with no address. The studio, corridor, bathroom door and hotel corridor are generic illustrations "
                           "with no HBO branding, logo, room number or real set; the microphone is a generic lavalier with no brand. Every card is "
                           "our own typed graphic; no real police, court or HBO material is imitated. No dialogue is invented. Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
