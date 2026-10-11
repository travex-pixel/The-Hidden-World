"""Write episodes/<id>/episode.json for THE HIDDEN WORLD: Case Files (true crime).

usage: python series/true-crime/make_episodes.py
The narration, captions, claims and sources live here so the factual review (research_case_0N.md) and the
episode data can be checked side by side. Map geometry comes from series/true-crime/geo/*.json (Natural Earth, public domain)."""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
ACCESSED = "2026-10-11"

# One narrator for the whole Case Files series (LibriTTS-R speaker 666: low register ~105 Hz measured,
# 0% word error on an offline Whisper round-trip; distinct from the thriller cast's voices).
NARRATOR = {"model": "en_US-libritts_r-medium", "speaker": 666, "length_scale": 1.1, "year_words": True}
CAPTION_Y = 1420   # captions sit above the Shorts title/channel overlay at the bottom of the screen


def N(text, **kw):
    assert len(text) <= 90, (len(text), text)
    return {"who": "narrator", "text": text, **kw}


def scene(id_, kind, lines, cue, claims, *, sfx=(), shot=None, min_d=2.0, pad=0.35, tr="cut", emph=(), music_db=None):
    s = {"id": id_, "scene": kind, "min_duration": min_d, "pad_after": pad, "music_cue": cue, "sfx": [dict(f) for f in sfx],
         "claims": list(claims), "transition": tr, "caption_y": CAPTION_Y, "lines": lines, "shot": shot or {}, "emphasis": list(emph)}
    if music_db is not None:
        s["music_gain_db"] = music_db
    return s


def fx(at, name, gain=1.0):
    return {"at": at, "name": name, "gain": gain}


# ------------------------------------------------------------------ Case File 01: Azaria Chamberlain
def chamberlain() -> dict:
    geo = json.loads((HERE / "geo" / "australia.json").read_text())
    ULURU = [131.0369, -25.3444]
    scenes = [
        scene("s01_hook", "tc1_hook", [
            N("A mother was jailed for life for murdering her baby."),
            N("But the 'baby's blood' in her car was never blood.", pause_before=0.3)],
            "cold", ["C_convicted", "C_noblood"], sfx=[fx(0.05, "hit", 0.8)], emph=["life", "never", "blood."], min_d=5.0),
        scene("s02_map", "case_map", [N("August 1980. A campsite at Uluru.")],
              "unease", ["C_aug1980"], sfx=[fx(0.0, "whoosh", 0.8), fx(0.3, "wind", 0.7)], min_d=3.6, shot={"map": {
                  "geo": "aus", "from": {"center": [134.0, -27.0], "span": 46}, "to": {"center": [ULURU[0] + 0.4, -25.0], "span": 11},
                  "cy": 0.40, "borders_at": 0.5, "grid": 5,
                  "region_label": {"ll": [133.4, -19.5], "text": "NORTHERN TERRITORY", "at": 0.6, "fs": 30},
                  "pins": [{"ll": ULURU, "label": "ULURU", "at": 1.1, "fs": 44}],
                  "scale_note": "Map: Natural Earth"}}),
        scene("s03_tent", "tc1_camp", [
            N("Lindy Chamberlain said a dingo took her nine week old daughter, Azaria, from their tent.")],
            "unease", ["C_lindy_said"], sfx=[fx(0.0, "wind", 0.8)], emph=["dingo"]),
        scene("s04_clothes", "tc1_clothes", [
            N("Azaria was never found. Her jumpsuit was, near the rock."),
            N("But not the matinee jacket Lindy said Azaria wore over it.", pause_before=0.2)],
            "unease", ["C_jumpsuit", "C_jacket_missing"], sfx=[fx(0.2, "paper")], emph=["jacket"]),
        scene("s05_case", "tc1_car", [
            N("Prosecutors said she killed Azaria in the family car,"),
            N("and that tests found a baby's blood. Even a spray of it, under the dashboard.", pause_before=0.1)],
            "tension", ["C_prosecution", "C_spray_claim"], sfx=[fx(0.3, "door", 0.8)], emph=["blood.", "spray"]),
        scene("s06_verdict", "tc1_verdict", [
            N("October 1982: guilty of murder. Life, with hard labour."),
            N("In 1984, the High Court rejected her appeal, three votes to two.", pause_before=0.2)],
            "cold", ["C_convicted", "C_michael", "C_highcourt"], sfx=[fx(0.25, "gavel"), fx(1.0, "stamp", 0.8)], emph=["guilty", "three", "two."]),
        scene("s07_search", "tc1_search", [
            N("Then, in early 1986, a tourist fell to his death from Uluru."),
            N("Searching near dingo dens below the rock, police found something else.", pause_before=0.15)],
            "hush", ["C_fall", "C_found"], sfx=[fx(0.0, "wind", 0.7), fx(3.6, "wind", 0.6)], music_db=-4, tr="fade"),
        scene("s08_jacket", "tc1_jacket", [N("Azaria's matinee jacket.", pause_before=0.7)],
              "hush", ["C_found"], sfx=[fx(0.0, "hit", 0.9)], min_d=4.2, pad=1.1, emph=["matinee", "jacket."], music_db=-8),
        scene("s09_release", "tc1_release", [N("Five days later, Lindy was released from prison.")],
              "aftermath", ["C_release"], sfx=[fx(0.3, "door", 0.9)], min_d=3.6, emph=["released"]),
        scene("s10_science", "tc1_science", [
            N("Then a Royal Commission re-examined the science."),
            N("The 'blood spray' under the dashboard? Sound-deadening compound, applied at the factory.", pause_before=0.1),
            N("No blood was found in the car at all.", pause_before=0.25)],
            "revelation", ["C_royal", "C_noblood"], sfx=[fx(0.2, "paper", 0.7)], emph=["sound-deadening", "factory.", "no", "blood"], music_db=-2),
        scene("s11_quashed", "tc1_quashed", [N("In 1988, all the convictions were quashed.")],
              "aftermath", ["C_quashed"], sfx=[fx(0.2, "gavel", 0.8), fx(1.0, "stamp")], min_d=3.4, emph=["quashed."]),
        scene("s12_end", "tc1_end", [
            N("But only in 2012 did a coroner finally rule how Azaria died:"),
            N("attacked and taken by a dingo.", pause_before=0.35),
            N("Just as her mother said, almost thirty-two years earlier.", pause_before=0.5)],
            "aftermath", ["C_2012"], sfx=[fx(0.0, "wind", 0.5)], emph=["dingo."], min_d=3.0, pad=2.4, tr="fade"),
    ]
    claims = [
        {"id": "C_aug1980", "type": "established", "text": "Azaria disappeared on 17 August 1980 from the family's tent at the Uluru (Ayers Rock) campsite, Northern Territory.", "sources": ["nma_inquest", "coroner2012", "adb"]},
        {"id": "C_lindy_said", "type": "established", "text": "Lindy Chamberlain said a dingo had taken nine-week-old Azaria from the tent.", "sources": ["nma_inquest", "aljazeera2012", "adb"]},
        {"id": "C_jumpsuit", "type": "established", "text": "Azaria's body was never found; her jumpsuit was found near the base of the rock about a week later.", "sources": ["asn_dates", "adb"]},
        {"id": "C_jacket_missing", "type": "established", "text": "The matinee jacket Lindy said Azaria wore over the jumpsuit was not found with it.", "sources": ["nma_vault", "adb"]},
        {"id": "C_prosecution", "type": "established", "text": "The prosecution case was that Lindy killed Azaria in the family car.", "sources": ["famous_trials", "nma_torana"]},
        {"id": "C_spray_claim", "type": "established", "text": "Forensic evidence at trial alleged infant (foetal) blood in the car, including a 'spray' under the dashboard.", "sources": ["nma_torana", "abc_torana", "newcastle_boettcher"]},
        {"id": "C_convicted", "type": "established", "text": "On 29 October 1982 Lindy was convicted of murder and sentenced to life imprisonment with hard labour.", "sources": ["famous_trials", "nma_inquest", "odt"]},
        {"id": "C_michael", "type": "established", "text": "Michael Chamberlain was convicted as an accessory after the fact (18-month suspended sentence).", "sources": ["famous_trials", "odt"]},
        {"id": "C_highcourt", "type": "established", "text": "The High Court dismissed the appeal 3-2 on 22 February 1984 (Chamberlain v R (No 2) [1984] HCA 7).", "sources": ["opinions_on_high", "vlex_hca"]},
        {"id": "C_fall", "type": "established", "text": "In early 1986 a British tourist fell to his death from Uluru; searchers looked for his remains below the rock, in an area of dingo lairs. (Exact date of the fall varies by source; not named on screen.)", "sources": ["adb", "macau_daily", "nma_vault"]},
        {"id": "C_found", "type": "established", "text": "Azaria's matinee jacket was found on 2 February 1986, partly buried near a dingo lair, during that search.", "sources": ["adb", "nma_vault", "macau_daily"]},
        {"id": "C_release", "type": "established", "text": "Lindy was released on 7 February 1986 (sentence remitted; not a pardon), five days after the jacket was found.", "sources": ["adb", "papers_past_release", "macau_daily"]},
        {"id": "C_royal", "type": "established", "text": "A Royal Commission (Justice Trevor Morling) re-examined the evidence; its 1987 report found serious doubts about the convictions.", "sources": ["famous_trials_morling", "adb", "nt_hansard_1987"]},
        {"id": "C_noblood", "type": "established", "text": "The 'spray' under the dashboard was a sound-deadening compound applied by the manufacturer; the inquiry found no blood in the car.", "sources": ["nma_torana", "abc_torana", "canberra_times_torana"]},
        {"id": "C_quashed", "type": "established", "text": "On 15 September 1988 the NT Court of Criminal Appeal quashed all convictions of Lindy and Michael Chamberlain.", "sources": ["famous_trials_quash", "adb", "ebsco"]},
        {"id": "C_2012", "type": "established", "text": "On 12 June 2012, at the fourth inquest, NT Coroner Elizabeth Morris found Azaria's death was caused by being 'attacked and taken by a dingo'.", "sources": ["coroner2012", "aljazeera2012", "csm2012"]},
    ]
    sources = [
        {"id": "coroner2012", "title": "Inquest into the death of Azaria Chantel Loren Chamberlain [2012] NTMC 020", "publisher": "Northern Territory Local Court (Coroner)", "url": "https://localcourt.nt.gov.au/sites/default/files/decisions/2012NTMC020.pdf", "date": "2012-06-12"},
        {"id": "nma_inquest", "title": "Defining Moments: Azaria Chamberlain inquest", "publisher": "National Museum of Australia", "url": "https://www.nma.gov.au/defining-moments/resources/azaria-chamberlain-inquest"},
        {"id": "nma_vault", "title": "From the vault: the Chamberlain collection", "publisher": "National Museum of Australia", "url": "https://www.nma.gov.au/explore/blog/from-the-vault-chamberlain-collection"},
        {"id": "nma_torana", "title": "National Museum acquires Michael Chamberlain's Torana", "publisher": "National Museum of Australia", "url": "https://www.nma.gov.au/about/media/media-releases-listing-by-year/2014/national-museum-acquires-michael-chamberlain-torana", "date": "2014"},
        {"id": "abc_torana", "title": "Chamberlain Torana becomes museum piece for all to see", "publisher": "ABC News", "url": "https://www.abc.net.au/news/2014-08-19/chamberlain-torana-becomes-museum-piece-for-all-to-see/5674120", "date": "2014-08-19"},
        {"id": "canberra_times_torana", "title": "Infamous Chamberlain Torana part of our lived history at National Museum", "publisher": "The Canberra Times", "url": "https://canberratimes.com.au/story/6869395/infamous-chamberlain-torana-part-of-our-lived-history-at-national-museum"},
        {"id": "adb", "title": "Chamberlain, Azaria Chantel (1980-1980)", "publisher": "Australian Dictionary of Biography, ANU", "url": "https://adb.anu.edu.au/biography/chamberlain-azaria-chantel-9719"},
        {"id": "famous_trials", "title": "The 'Dingo' (Chamberlain) Trial: chronology", "publisher": "Famous Trials (Prof. Douglas Linder, UMKC)", "url": "https://famous-trials.com/dingo/456-chronology"},
        {"id": "famous_trials_morling", "title": "Report of the Royal Commission (Morling) - excerpts", "publisher": "Famous Trials", "url": "https://www.famous-trials.com/dingo/468-morlingreport", "date": "1987-05-22"},
        {"id": "famous_trials_quash", "title": "Court of Criminal Appeal: Reference by the Attorney-General (1988)", "publisher": "Famous Trials", "url": "https://famous-trials.com/dingo/469-reconviction", "date": "1988-09-15"},
        {"id": "opinions_on_high", "title": "Chamberlain v R (No 2) - Opinions on High", "publisher": "University of Melbourne", "url": "https://blogs.unimelb.edu.au/opinionsonhigh/?p=5064"},
        {"id": "vlex_hca", "title": "Chamberlain v R [1984] HCA 7", "publisher": "vLex", "url": "https://au.vlex.com/vid/chamberlain-v-r-804816905"},
        {"id": "odt", "title": "Chamberlain verdict report", "publisher": "Otago Daily Times", "url": "https://www.odt.co.nz/node/119948"},
        {"id": "newcastle_boettcher", "title": "Blood expert remembers Azaria case", "publisher": "Newcastle Herald", "url": "https://newcastleherald.com.au/story/204737/blood-expert-remembers-azaria-case"},
        {"id": "asn_dates", "title": "The dates of key events in the Chamberlain drama", "publisher": "Alice Springs News", "url": "https://alicespringsnews.com.au/2020/09/30/the-dates-of-key-events-in-the-chamberlain-drama/", "date": "2020-09-30"},
        {"id": "papers_past_release", "title": "Mrs Chamberlain released (The Press, 8 Feb 1986)", "publisher": "Papers Past, National Library of New Zealand", "url": "https://dynamic-rsnz.natlib.govt.nz/newspapers/CHP19860208.2.2", "date": "1986-02-08"},
        {"id": "macau_daily", "title": "Azaria Chamberlain case retrospective", "publisher": "Macau Daily Times", "url": "https://macaudailytimes.com.mo/?p=37928"},
        {"id": "nt_hansard_1987", "title": "NT Legislative Assembly debates, 2-25 June 1987", "publisher": "Parliament of the Northern Territory", "url": "https://parliament.nt.gov.au/__data/assets/pdf_file/0008/367730/PR02-Debates-2-June-25-June-1987.pdf", "date": "1987-06"},
        {"id": "ebsco", "title": "Death of Azaria Chamberlain (Research Starter)", "publisher": "EBSCO", "url": "https://www.ebsco.com/research-starters/law/death-azaria-chamberlain"},
        {"id": "aljazeera2012", "title": "Coroner finds dingo took Australian baby", "publisher": "Al Jazeera", "url": "https://www.aljazeera.com/news/2012/06/12/coroner-finds-dingo-took-australian-baby", "date": "2012-06-12"},
        {"id": "csm2012", "title": "Australia's Azaria Chamberlain mystery solved: A dingo did it", "publisher": "Christian Science Monitor (wire)", "url": "https://m.csmonitor.com/World/Latest-News-Wires/2012/0612/Australia-s-Azaria-Chamberlain-mystery-solved-A-dingo-did-it", "date": "2012-06-12"},
    ]
    for s in sources:
        s["accessed"] = ACCESSED + " (search-result extract; full page not reachable from the build environment)"
    return {
        "id": "tc01-chamberlain-jacket", "number": 1, "series": "THE HIDDEN WORLD: Case Files",
        "title": "The Jacket That Freed Lindy Chamberlain",
        "central_question": "How did a mother convicted of murdering her baby come to be cleared, and what was the 'blood' in her car?",
        "template": "true-crime", "narrator_voice": NARRATOR["model"], "narrator_profile": NARRATOR, "loudness_lufs": -14,
        "target_duration_seconds": [45, 90], "visual_mode": "svg", "caption_style": "thriller",
        "case_file": {"number": "01", "label": "AZARIA CHAMBERLAIN · 1980-2012"},
        "music": {"bpm": 72}, "geo": {"aus": geo},
        "content_notes": "Non-graphic. No depiction of the child, of violence, or of blood. All scenes are labelled illustrations; no real photographs, documents or footage are imitated.",
        "scenes": scenes, "claims": claims, "sources": sources,
    }


# ------------------------------------------------------------------ Case File 02: the Unabomber
def unabomber() -> dict:
    geo = json.loads((HERE / "geo" / "usa.json").read_text())
    CHI, SAC, NJ, DC = [-87.675, 42.056], [-121.494, 38.582], [-74.258, 40.864], [-77.037, 38.907]
    SCH, LIN = [-73.94, 42.81], [-112.68, 46.955]
    scenes = [
        scene("s01_hook", "tc2_hook", [
            N("For seventeen years, the FBI hunted a bomber it couldn't name."),
            N("What finally caught him? His own words. And his own brother.", pause_before=0.25)],
            "cold", ["U_17years", "U_identified"], sfx=[fx(0.05, "hit", 0.8), fx(3.3, "typing", 0.6)], emph=["words.", "brother."], min_d=5.0),
        scene("s02_map", "case_map", [
            N("From 1978 to 1995, sixteen bombs killed three people and injured more than twenty.")],
            "unease", ["U_toll", "U_name"], sfx=[fx(0.0, "whoosh", 0.8), fx(1.3, "thump", 0.5), fx(2.6, "thump", 0.5), fx(3.9, "thump", 0.5)],
            emph=["sixteen", "three"], shot={"map": {
                "geo": "usa", "from": {"center": [-96.0, 38.6], "span": 58}, "to": {"center": [-96.0, 38.8], "span": 52},
                "cy": 0.40, "borders_at": 0.2, "grid": 10,
                "pins": [{"ll": CHI, "label": "CHICAGO AREA · 1978", "at": 0.8, "fs": 32, "dy": -34, "dx": 20, "anchor": "middle"},
                         {"ll": SAC, "label": "SACRAMENTO · 1985, 1995", "at": 1.6, "fs": 32, "dy": 52, "dx": 10},
                         {"ll": NJ, "label": "NEW JERSEY · 1994", "at": 2.4, "fs": 32, "dx": -24, "dy": 56, "anchor": "end"}],
                "stat": {"at": 3.2, "rows": ["16 BOMBS", "3 KILLED", "20+ INJURED"]},
                "title": {"text": "FBI CASE NAME: UNABOM", "sub": "UNIVERSITY AND AIRLINE BOMBINGS", "at": 0.3},
                "scale_note": "Selected locations. Map: Natural Earth"}}),
        scene("s03_offer", "tc2_offer", [
            N("In 1995, he made an offer."),
            N("Publish his 35,000-word manifesto, and he would \"desist from terrorism.\"", pause_before=0.1)],
            "tension", ["U_offer"], sfx=[fx(0.3, "paper", 0.8), fx(2.0, "typing", 0.6)], emph=["desist", "terrorism.\""]),
        scene("s04_gamble", "tc2_press", [
            N("The FBI and the Attorney General backed printing it,"),
            N("hoping someone would recognise the writer.", pause_before=0.05),
            N("On September 19th, 1995, The Washington Post printed all of it.", pause_before=0.25)],
            "tension-rise", ["U_reno", "U_published"], sfx=[fx(0.2, "rumble", 0.6), fx(5.5, "paper", 0.8)], emph=["recognise"]),
        scene("s05_reader", "tc2_reader", [
            N("One reader, Linda Patrik, suspected her husband's brother."),
            N("She urged her husband, David, to read it.", pause_before=0.2)],
            "unease", ["U_linda"], sfx=[fx(0.4, "paper", 0.6)], emph=["brother."]),
        scene("s06_compare", "tc2_compare", [
            N("David compared it with old letters from his brother, Ted."),
            N("An outside analyst judged the same person had probably written both.", pause_before=0.2)],
            "tension", ["U_compare"], sfx=[fx(0.3, "paper", 0.7), fx(3.9, "thump", 0.6), fx(4.6, "thump", 0.5)], emph=["ted.", "same", "both."]),
        scene("s07_fbi", "tc2_phrase", [
            N("Early in 1996, through a lawyer, the family went to the FBI."),
            N("Analysts found the same unusual twist on an old saying in both:", pause_before=0.2),
            N("\"You can't eat your cake and have it too.\"", pause_before=0.3)],
            "tension-peak", ["U_lawyer", "U_phrase"], sfx=[fx(0.3, "pen", 0.8), fx(5.0, "swell", 0.7)], emph=["eat", "cake", "have"], music_db=-3),
        scene("s08_cabin", "tc2_cabin", [
            N("April 3rd, 1996. Agents arrested Ted Kaczynski at his tiny cabin in Montana."),
            N("Inside, they found a live bomb, wrapped and ready to mail.", pause_before=0.3)],
            "cold", ["U_arrest", "U_cabin"], sfx=[fx(0.0, "hit", 0.8), fx(0.6, "wind", 0.5), fx(4.4, "door", 0.7)], emph=["kaczynski", "live", "bomb,"], tr="fade"),
        scene("s09_plea", "tc2_plea", [N("In 1998, he pleaded guilty, and was sentenced to life without release.")],
              "aftermath", ["U_plea"], sfx=[fx(0.25, "gavel"), fx(1.0, "stamp", 0.8)], emph=["guilty,", "life"]),
        scene("s10_end", "tc2_end", [
            N("David received a one-million-dollar reward."),
            N("He pledged most of it to the families of his brother's victims.", pause_before=0.25),
            N("The bomber wanted the world to read his words. His own family did.", pause_before=0.6)],
            "aftermath", ["U_reward", "U_identified"], sfx=[fx(0.2, "typing", 0.5)], emph=["victims.", "family"], min_d=3.0, pad=2.0, tr="fade"),
    ]
    claims = [
        {"id": "U_17years", "type": "established", "text": "The UNABOM bombings spanned about 17 years (1978-1995) without the FBI identifying a suspect.", "sources": ["fbi_history", "fbi_2008"]},
        {"id": "U_identified", "type": "established", "text": "Kaczynski was identified after the manifesto's publication, when his brother David (prompted by his wife Linda Patrik) recognised the writing and the family's lawyer contacted the FBI.", "sources": ["fbi_2021", "fbi_history", "fox_family"]},
        {"id": "U_toll", "type": "established", "text": "16 bombs, 1978-1995; 3 killed; 23 injured per AP and FBI as quoted by AP (one FBI page says 24), hence 'more than twenty'.", "sources": ["fbi_history", "pbs_2023", "kiro_2026", "fbi_2008"]},
        {"id": "U_name", "type": "established", "text": "UNABOM was the FBI case name, from early university and airline bombing targets.", "sources": ["fbi_history", "kiro_2026"]},
        {"id": "U_offer", "type": "established", "text": "In 1995 the bomber offered to 'desist from terrorism' if the New York Times or the Washington Post published his roughly 35,000-word manuscript.", "sources": ["nyt_letter", "ap_semo", "cnbc_2023"]},
        {"id": "U_reno", "type": "established", "text": "Attorney General Janet Reno and FBI Director Louis Freeh recommended publication; the FBI's aim was that someone would recognise the author.", "sources": ["cnn_1995", "csm_1995", "fbi_2021"]},
        {"id": "U_published", "type": "established", "text": "The Washington Post published the full text on 19 September 1995 as an 8-page insert, with the New York Times sharing the cost.", "sources": ["ep_1995", "cnn_1995"]},
        {"id": "U_linda", "type": "established", "text": "Linda Patrik, David Kaczynski's wife, first suspected Ted and urged David to read the manifesto.", "sources": ["daily_gazette", "fox_family", "macleans_1996"]},
        {"id": "U_compare", "type": "established", "text": "David compared the manifesto with Ted's old letters and essays; the family had an outside team (via PI Susan Swanson, ex-FBI analyst Clint Van Zandt) compare them, which judged the same person had probably written both.", "sources": ["macleans_1996", "fbi_2021", "fox_family"]},
        {"id": "U_lawyer", "type": "established", "text": "In early 1996 the family's lawyer, Tony Bisceglie, contacted the FBI and supplied comparison writings.", "sources": ["fbi_2021", "newsweek_1996", "macleans_1996"]},
        {"id": "U_phrase", "type": "established", "text": "The manifesto (para. 185) uses the inverted idiom 'you can't eat your cake and have it too'; FBI analyst James Fitzgerald flagged that it matched Ted's known writing. (Which letter it matched is disputed, so the script does not name one.)", "sources": ["npr_2017", "jstor_daily", "northeast_times"]},
        {"id": "U_arrest", "type": "established", "text": "Ted Kaczynski was arrested on 3 April 1996 at his cabin (about 10 x 12 ft) near Lincoln, Montana.", "sources": ["fbi_history", "history_arrest", "nbc_montana"]},
        {"id": "U_cabin", "type": "established", "text": "Agents found a live bomb in the cabin, wrapped and ready to mail, plus bomb components and tens of thousands of pages of writing.", "sources": ["fbi_history", "spokesman_1996", "history_arrest"]},
        {"id": "U_plea", "type": "established", "text": "He pleaded guilty on 22 January 1998 in exchange for life without possibility of release; on 4 May 1998 he was sentenced to four life terms plus 30 years.", "sources": ["history_plea", "deseret_1998", "npr_1998"]},
        {"id": "U_reward", "type": "established", "text": "David Kaczynski received the $1 million reward in August 1998 and pledged most of it to victims' families (roughly $630k-$680k reached them after taxes and legal costs).", "sources": ["wapo_1998", "crimelibrary_reward"]},
    ]
    sources = [
        {"id": "fbi_history", "title": "Unabomber", "publisher": "FBI (History: Famous Cases)", "url": "https://www.fbi.gov/history/famous-cases/unabomber"},
        {"id": "fbi_2021", "title": "The Words of a Killer: The Unabomber Case 25 Years Later", "publisher": "FBI", "url": "https://www.fbi.gov/news/stories/the-words-of-a-killer-the-unabomber-case-25-years-later-040221", "date": "2021-04-02"},
        {"id": "fbi_2008", "title": "FBI 100: The Unabomber", "publisher": "FBI", "url": "https://www.fbi.gov/news/stories/2008/april/unabomber_042408", "date": "2008-04-24"},
        {"id": "pbs_2023", "title": "Ted Kaczynski, known as the Unabomber, found dead in federal prison", "publisher": "PBS NewsHour (AP)", "url": "https://www.pbs.org/newshour/nation/ted-kaczynski-known-as-the-unabomber-found-dead-in-federal-prison", "date": "2023-06-10"},
        {"id": "kiro_2026", "title": "This week in history: Unabomber Ted Kaczynski was arrested 30 years ago", "publisher": "KIRO 7 (AP)", "url": "https://www.kiro7.com/news/local/this-week-history-unabomber-ted-kaczynski-was-arrested-30-years-ago/XRY4N6DPQBE67PWCOFIXL67JZE/", "date": "2026-04"},
        {"id": "nyt_letter", "title": "Text of Unabomber's letter received by The New York Times, April 26, 1995 (reproduction)", "publisher": "UpCounsel (reproduction)", "url": "https://upcounsel.com/lectl-text-of-unabombers-letter-received-by-NY-times-april-26-1995", "date": "1995-04-26"},
        {"id": "ap_semo", "title": "The Unabomber manifesto", "publisher": "Southeast Missourian (AP)", "url": "https://www.semissourian.com/opinion/the-unabomber-manifesto-2802514", "date": "1995"},
        {"id": "cnbc_2023", "title": "Unabomber Ted Kaczynski died by suicide, official says", "publisher": "CNBC (AP)", "url": "https://www.cnbc.com/2023/06/12/unabomber-ted-kaczynski-died-by-suicide-official-says.html", "date": "2023-06-12"},
        {"id": "cnn_1995", "title": "Unabomber manifesto to be published", "publisher": "CNN", "url": "https://www.cnn.com/US/9509/unabomber/index.html", "date": "1995-09"},
        {"id": "csm_1995", "title": "Unabomber manifesto published at urging of Attorney General", "publisher": "Christian Science Monitor", "url": "https://www.csmonitor.com/1995/0920/20011.html", "date": "1995-09-20"},
        {"id": "ep_1995", "title": "Entire Unabomber manifesto published by New York Times, Washington Post", "publisher": "Editor & Publisher", "url": "https://www.editorandpublisher.com/stories/entire-unabomber-manifesto-published-by-new-york-times-washington-post-p10,16672", "date": "1995"},
        {"id": "daily_gazette", "title": "Former Schenectady residents David Kaczynski, Linda Patrik played crucial role in Unabomber's capture", "publisher": "The Daily Gazette (Schenectady)", "url": "https://www.dailygazette.com/news/former-schenectady-residents-david-kaczynski-linda-patrik-played-crucial-role-in-unabomber-s-capture/article_5b006dea-2710-5770-86e0-c5567246384d.html"},
        {"id": "fox_family", "title": "Unabomber Ted Kaczynski's relative key in capturing infamous terrorist", "publisher": "Fox News", "url": "https://www.foxnews.com/us/unabomber-ted-kaczynski-relative-key-capturing-infamous-terrorist", "date": "2023"},
        {"id": "macleans_1996", "title": "Unabomber arrested (Maclean's, 15 April 1996)", "publisher": "The Canadian Encyclopedia", "url": "https://encyclopediecanadienne.ca/article/unabomber-arrested/", "date": "1996-04-15"},
        {"id": "newsweek_1996", "title": "A delicate dance", "publisher": "Newsweek", "url": "https://www.newsweek.com/delicate-dance-176482", "date": "1996"},
        {"id": "npr_2017", "title": "FBI profiler says linguistic work was pivotal in capture of Unabomber", "publisher": "NPR (Fresh Air)", "url": "https://www.npr.org/2017/08/22/545122205/fbi-profiler-says-linguistic-work-was-pivotal-in-capture-of-unabomber", "date": "2017-08-22"},
        {"id": "jstor_daily", "title": "Fighting words: the Unabomber", "publisher": "JSTOR Daily", "url": "https://daily.jstor.org/fighting-words-unabomber"},
        {"id": "northeast_times", "title": "Cracking the case", "publisher": "Northeast Times", "url": "https://northeasttimes.com/2017/12/01/cracking-the-case/", "date": "2017-12-01"},
        {"id": "history_arrest", "title": "Unabomber arrested", "publisher": "History.com", "url": "https://www.history.com/this-day-in-history/april-3/unabomber-arrested"},
        {"id": "nbc_montana", "title": "Unabomber's cabin lives on in Washington, D.C. exhibit", "publisher": "NBC Montana", "url": "https://nbcmontana.com/news/local/unabombers-cabin-lives-on-in-washington-dc-exhibit"},
        {"id": "spokesman_1996", "title": "Unabomber probe finds new evidence", "publisher": "Spokesman-Review (AP)", "url": "https://www.spokesman.com/stories/1996/apr/06/unabomber-probe-finds-new-evidence/", "date": "1996-04-06"},
        {"id": "history_plea", "title": "Ted Kaczynski pleads guilty to bombings", "publisher": "History.com", "url": "https://www.history.com/this-day-in-history/january-22/ted-kaczynski-pleads-guilty-to-bombings"},
        {"id": "deseret_1998", "title": "Unabomber gets 4 consecutive life terms", "publisher": "Deseret News (AP)", "url": "https://www.deseret.com/1998/5/4/19378082/unabomber-gets-4-consecutive-life-terms", "date": "1998-05-04"},
        {"id": "npr_1998", "title": "Kaczynski sentenced", "publisher": "NPR", "url": "https://www.npr.org/1998/05/04/1035095/kaczynski-sentenced", "date": "1998-05-04"},
        {"id": "wapo_1998", "title": "FBI gives reward to Unabomber's brother (W. Claiborne), archived copy", "publisher": "The Washington Post (via archive)", "url": "https://thetedkarchive.com/library/william-claiborne-fbi-gives-reward-to-unabomber-s-brother", "date": "1998-08-21"},
        {"id": "crimelibrary_reward", "title": "Theodore Kaczynski: the reward", "publisher": "Crime Library", "url": "https://crimelibrary.org/terrorists_spies/terrorists/kaczynski/15.html"},
    ]
    for s_ in sources:
        s_["accessed"] = ACCESSED + " (search-result extract; full page not reachable from the build environment)"
    return {
        "id": "tc02-unabomber-words", "number": 2, "series": "THE HIDDEN WORLD: Case Files",
        "title": "The Unabomber Was Caught by His Own Words",
        "central_question": "After 17 years with no suspect, how did the FBI finally identify the Unabomber?",
        "template": "true-crime", "narrator_voice": NARRATOR["model"], "narrator_profile": NARRATOR, "loudness_lufs": -14,
        "target_duration_seconds": [45, 90], "visual_mode": "svg", "caption_style": "thriller",
        "case_file": {"number": "02", "label": "UNABOM · 1978-1998"},
        "music": {"bpm": 76}, "geo": {"usa": geo},
        "content_notes": "Non-graphic. No depiction of explosions, injuries or bomb construction. No real newspaper masthead, letter, FBI document or photograph is imitated; manuscript text on screen is illegible placeholder except the verified quoted phrases.",
        "scenes": scenes, "claims": claims, "sources": sources,
    }


def main() -> None:
    for ep in (chamberlain(), unabomber()):
        d = ROOT / "episodes" / ep["id"]; d.mkdir(parents=True, exist_ok=True)
        (d / "episode.json").write_text(json.dumps(ep, indent=1, ensure_ascii=False) + "\n")
        print("wrote", d / "episode.json")


if __name__ == "__main__":
    main()
