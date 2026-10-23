"""Generate scripts_and_storyboards.md and sources.md from the episode data and the rendered timelines.

usage: python series/true-crime/tools/write_docs.py      (after both episodes are built, so out/<id>/timeline.json exists)
Timings come from the actual render, so the storyboard always matches the MP4."""
from __future__ import annotations
import json
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
ROOT = HERE.parents[1]
CFG = json.loads((HERE / "series.json").read_text())

CREATIVE = {
    "tc01-chamberlain-jacket": {
        "working_title": "The Jacket That Freed Lindy Chamberlain",
        "hooks": [
            ("A mother was jailed for life for murdering her baby. But the 'baby's blood' in her car was never blood.",
             "SELECTED. It opens on the most consequential verified paradox (a life sentence resting on evidence that was not what it seemed) and poses a question the video answers: what was it, and how did the truth come out?"),
            ("A missing baby's jacket, found by accident five years later, set a convicted mother free.",
             "Strong, but it spends the turning point in the first second and loses the forensic payoff."),
            ("She said a dingo took her baby. Australia didn't believe her, until a stranger's fall from Uluru.",
             "Emotive, but 'Australia didn't believe her' generalises public opinion we cannot measure, and it leans on a death as a teaser."),
        ],
        "story_timeline": [
            "17 Aug 1980: nine-week-old Azaria disappears from the family tent at the Uluru campsite; Lindy says a dingo took her.",
            "Late Aug 1980: Azaria's jumpsuit is found near the base of the rock; the matinee jacket is not.",
            "Feb 1981: first inquest finds a dingo took her. The finding is quashed, and a second inquest commits Lindy for trial.",
            "29 Oct 1982: Lindy is convicted of murder (life with hard labour); Michael is convicted as an accessory.",
            "22 Feb 1984: the High Court dismisses the appeal 3-2.",
            "Early 1986: a tourist falls to his death from Uluru. On 2 Feb, searchers find the matinee jacket near a dingo lair.",
            "7 Feb 1986: Lindy is released (sentence remitted).",
            "1986-87: Morling Royal Commission. The 'blood spray' was factory sound-deadener; no blood is found in the car.",
            "15 Sep 1988: all convictions are quashed.",
            "1995: third inquest, open finding.",
            "12 Jun 2012: fourth inquest. Cause of death: 'attacked and taken by a dingo'.",
        ],
        "board": {
            "s01_hook": ("Extreme close-up under a car dashboard (illustrated). A red circle draws itself around a dark speckled patch. Typed: \"TRIAL CLAIM: 'BABY'S BLOOD'\", then struck through. A \"NOT BLOOD\" stamp slams onto the patch. Header: \"1982 · LIFE SENTENCE\".", "Low cinematic hit at 0 s. Cold bell score with heartbeat pulse."),
            "s02_map": ("Natural Earth map of Australia; the camera flies from the whole continent to central Australia. The Northern Territory border dashes in. Pulsing pin: ULURU.", "Whoosh into desert wind; uneasy score."),
            "s03_tent": ("Night illustration: stars, moon, Uluru silhouette, a dome tent glowing warm among spinifex and desert oaks. Slow push in. Typed \"17 AUGUST 1980\". No people, no animal shown.", "Wind; sparse bells."),
            "s04_clothes": ("Evidence board: two pinned cards. JUMPSUIT (found near the rock). Dashed outline of the MATINEE JACKET, \"MISSING\", red '?'. A red string joins them. Tag \"NOT ACTUAL ITEMS\".", "Paper rustle."),
            "s05_case": ("Generic 1970s hatchback silhouette, then a cross-fade inside to the dashboard. The red circle returns. Typed \"PROSECUTION CASE, 1982\", \"ALLEGED: INFANT BLOOD\".", "Car door; tension cue."),
            "s06_verdict": ("Typed case card (our own graphic): court, date, GUILTY OF MURDER, LIFE WITH HARD LABOUR, MICHAEL: ACCESSORY, HIGH COURT 1984, APPEAL DISMISSED 3-2. A GUILTY stamp, then five vote tiles: 3 DISMISS, 2 ALLOW.", "Gavel and stamp; cold cue."),
            "s07_search": ("Night at the base of the rock: dark den openings in a sand bank, three torch beams sweeping. Typed \"EARLY 1986\".", "Wind; the score drops away (hush, music -4 dB)."),
            "s08_jacket": ("A torch pool opens on red sand. A small knitted jacket lies half-covered by a wind-blown drift. \"2 FEBRUARY 1986 · HALF-BURIED NEAR A DINGO LAIR\". Tag \"NOT THE ACTUAL JACKET\".", "Low hit, then near-silence (music -8 dB, 0.7 s pause before the line). Strategic silence on the genuine turning point."),
            "s09_release": ("Barred gate slides open onto daylight desert. \"7 FEBRUARY 1986\" typed on the sand.", "Gate thud; aftermath cue."),
            "s10_science": ("Back to the dashboard under a magnifying glass. \"ROYAL COMMISSION, 1986-87\". \"'BLOOD SPRAY'\" struck through, becoming \"SOUND-DEADENING COMPOUND · APPLIED AT THE FACTORY\". Then \"BLOOD FOUND IN THE CAR: NONE\".", "Paper; the brightest cue of the film (revelation)."),
            "s11_quashed": ("The verdict card returns, dims, and a large QUASHED stamp lands. \"15 SEPTEMBER 1988 · NT COURT OF CRIMINAL APPEAL\".", "Gavel and stamp."),
            "s12_end": ("Dawn breaks over Uluru. A typed card: \"NT CORONER, 12 JUNE 2012: 'ATTACKED AND TAKEN BY A DINGO'\". The card fades. \"In memory of Azaria Chamberlain\". Fade to black.", "Wind; aftermath bells; music fade."),
        },
    },
    "tc02-unabomber-words": {
        "working_title": "The Unabomber Was Caught by His Own Words",
        "hooks": [
            ("For seventeen years, the FBI hunted a bomber it couldn't name. What finally caught him? His own words. And his own brother.",
             "SELECTED. A clear premise (17 years, no name) and a two-part answer that is itself a curiosity gap: how could words, and a brother, do it?"),
            ("In 1995, a serial bomber made an offer: publish my 35,000-word manifesto and I'll stop. The FBI said yes.",
             "Strong, but 'the FBI said yes' oversimplifies (the AG and FBI recommended; newspapers decided), and it hides the family story."),
            ("One old saying, written backwards, helped catch the Unabomber.",
             "Intriguing, but it overstates the idiom's role: it was one strand of the analysis, not the sole basis for the warrant."),
        ],
        "story_timeline": [
            "May 1978: first device, linked to Northwestern University (Chicago area).",
            "1978-1995: 16 bombs; 3 killed (Hugh Scrutton 1985, Thomas Mosser 1994, Gilbert Murray 1995); 23-24 injured.",
            "Apr-Jun 1995: the bomber offers to 'desist from terrorism' if his manuscript is published.",
            "19 Sep 1995: The Washington Post prints the 35,000-word manifesto (cost shared with the NYT), on the recommendation of AG Reno and FBI Director Freeh.",
            "Late 1995: Linda Patrik suspects her brother-in-law. David Kaczynski compares the text with Ted's letters; an outside analyst judges them probably the same author.",
            "Early 1996: the family's lawyer contacts the FBI. FBI analysts compare the writings, including the inverted idiom.",
            "3 Apr 1996: arrest at the cabin near Lincoln, Montana; a live bomb is found inside.",
            "22 Jan 1998: guilty plea. 4 May 1998: four life terms plus 30 years.",
            "Aug 1998: David receives the $1M reward and pledges most of it to the victims' families.",
            "10 Jun 2023: Kaczynski dies in federal custody.",
        ],
        "board": {
            "s01_hook": ("Drifting manuscript pages (illegible) in cold light. Typed \"1978 - 1995 · NO NAME\". The frame darkens. Big serif words: \"HIS WORDS.\", then \"HIS BROTHER.\" in red.", "Low hit; typewriter; cold cue."),
            "s02_map": ("Natural Earth map of the USA with state lines. Header \"FBI CASE NAME: UNABOM · UNIVERSITY AND AIRLINE BOMBINGS\". Pins: CHICAGO AREA · 1978; SACRAMENTO · 1985, 1995; NEW JERSEY · 1994 (\"Selected locations\"). Tally: 16 BOMBS · 3 KILLED · 20+ INJURED.", "Whoosh; three soft heartbeats as pins land."),
            "s03_offer": ("A manuscript stack grows page by page. Card: \"PUBLISH: ~35,000 WORDS\" / \"THEN: 'DESIST FROM TERRORISM'\".", "Paper; typewriter; tension."),
            "s04_gamble": ("Illustrated printing press: rollers turning, a paper web of grey columns running. \"U.S. ATTORNEY GENERAL + FBI DIRECTOR: PUBLISH\". Card: \"19 SEPTEMBER 1995 · PRINTED IN FULL · 8-PAGE INSERT\". No real masthead.", "Press rumble; rising tension."),
            "s05_reader": ("A table under a lamp at night, the insert lying open; one line slowly underlined in red; a coffee cup. No person depicted. \"LATE 1995\".", "Paper; uneasy bells."),
            "s06_compare": ("Two pinned pages: OLD FAMILY LETTERS (handwriting squiggles) and THE MANIFESTO (typed bars). Matching passages highlight and red threads connect them. Card: \"OUTSIDE ANALYSIS: PROBABLY THE SAME AUTHOR\". Tag \"NOT ACTUAL DOCUMENTS\".", "Paper; two heartbeats."),
            "s07_fbi": ("An envelope slides from FAMILY'S LAWYER to FBI. Then \"THE USUAL SAYING: 'have your cake and eat it too'\". Below, \"IN BOTH TEXTS\": the words 'have' and 'eat' physically swap places to read \"You can't EAT your cake and HAVE it too.\", then are underlined.", "Pen click; a swell into the quote; music dips (-3 dB) so the phrase lands."),
            "s08_cabin": ("Montana pines at blue dawn; a tiny plank cabin; dimension line \"ABOUT 10 × 12 FT\". \"3 APRIL 1996 · NEAR LINCOLN, MONTANA\". Card: \"FOUND INSIDE: A LIVE BOMB · WRAPPED, READY TO MAIL\" (text only, no bomb drawn).", "Hit; wind; door."),
            "s09_plea": ("Typed court card: \"22 JAN 1998: PLEADS GUILTY · 4 MAY 1998: SENTENCED · 4 LIFE TERMS + 30 YEARS · NO POSSIBILITY OF RELEASE\", GUILTY stamp; small note \"Died in federal custody, 2023.\"", "Gavel and stamp; aftermath."),
            "s10_end": ("$0 counts up to $1,000,000: \"REWARD PAID TO DAVID KACZYNSKI, 1998\" then \"MOST OF IT PLEDGED TO THE VICTIMS' FAMILIES\". Cross-fade to a newspaper page with one line underlined in red. \"In memory of Hugh Scrutton, Thomas Mosser and Gilbert Murray\". Fade to black.", "Typewriter; quiet aftermath bells; fade."),
        },
    },
    "tc03-btk-floppy": {
        "working_title": "The Question That Caught BTK",
        "hooks": [
            ("A serial killer asked the police one question. Could a floppy disk be traced? They told him it was safe. They lied.",
             "SELECTED. A verified twist inside 9 seconds; three short beats (question, answer, lie) that each change what the viewer knows, and a curiosity gap (how did the lie catch him?)."),
            ("One deleted file ended a 31-year manhunt.",
             "Strong, but abstract without context, and it gives away the payoff mechanism first."),
            ("Police answered a serial killer's question in the newspaper classifieds.",
             "Intriguing, but slower; it lacks the stakes of the lie."),
        ],
        "story_timeline": [
            "Jan 1974 - 1991: BTK kills ten people in and around Wichita, Kansas; letters to police and media in the 1970s, then silence.",
            "Mar 2004: BTK resumes communication with a letter to The Wichita Eagle.",
            "Jan 2005: a postcard to KAKE-TV leads to a cereal box containing a note asking if a floppy disk could be traced.",
            "Late Jan/early Feb 2005: police run the classified ad 'Rex, it will be OK'.",
            "16 Feb 2005 (per AP): a floppy disk arrives at KSAS-TV; a deleted Word file's metadata names Christ Lutheran Church and 'Dennis'.",
            "Feb 2005: Dennis Rader, church council president, is linked by a familial DNA test.",
            "25 Feb 2005: arrest.",
            "27 Jun 2005: guilty plea to ten counts of first-degree murder. 18 Aug 2005: ten consecutive life terms.",
        ],
        "board": {
            "s01_question": ("Cold open, no fade-in: a floppy disk tilts into a sodium street-light cone, with drifting dust and a lens flare. A red '?' slams in on the word 'question' (camera shake).", "Sub-drop on frame 1; driving 100 BPM cue (saw-bass ostinato, ticking hats)."),
            "s02_traced": ("Flash cut. Macro: the metal shutter slides open; a cold scan line sweeps down; glowing 'TRACEABLE?'.", "Digital glitch under the flash (kept quiet so the line lands)."),
            "s03_lie": ("Motion-blur push to a classifieds page; one ad, 'REX, IT WILL BE OK'. On 'lied' the frame shakes, the ad outline turns red and a TRAP stamp slams across it.", "Whoosh; impact on 'lied'."),
            "s04_map": ("Zoom transition. Natural Earth map of the USA zooms to Kansas (state lines). 'KANSAS' label; pin WICHITA; header 'WICHITA, KANSAS · 1974 - 1991 · 10 VICTIMS'.", "Whoosh; one heartbeat thump."),
            "s05_silence": ("Push. Envelopes fall one by one onto a lamp-lit desk ('THE 1970s'). On 'silence' the lamp dims and 'THEN: SILENCE' types in grey.", "Paper; music drops 3 dB."),
            "s06_back": ("Flash. A new envelope slams onto the desk with a red '2004' stamp ('A NEW LETTER').", "Impact; typewriter."),
            "s07_cereal": ("Push. A generic cereal box under cold light; a folded note slides out of the top ('JANUARY 2005'). Tag: NOT THE ACTUAL BOX.", "Paper."),
            "s08_note": ("Zoom. A typed card ('BTK'S NOTE · WORDING AS REPORTED'); words appear exactly as narrated, FLOPPY and TRACED in red. Card lifts; 'NEWSPAPER AD?' pops in on the word 'ad'.", "Typewriter."),
            "s09_ad": ("Push. 'THE WICHITA EAGLE · CLASSIFIEDS'; the ad prints word by word in sync: REX, / IT / WILL / BE / OK. Tag: AD TEXT AS REPORTED.", "Paper; soft stamp."),
            "s10_disk": ("Flash. A padded envelope on a desk; the disk slides out toward camera on 'floppy disk' (shake). 'FEBRUARY 2005 · KSAS-TV, WICHITA'.", "Sub-drop; mechanical click. Music steps up to the peak cue (kick on 1 and 3)."),
            "s11_file": ("Zoom. A beige CRT: '> SCANNING DISK', '> 1 DELETED FILE FOUND', a progress bar, '> READING HIDDEN DATA'; scanlines; glitch bands. Tag: ILLUSTRATION · SIMPLIFIED.", "Typing; glitch; riser into the reveal."),
            "s12_reveal": ("Flash to near-black CRT glow: 'IN THE DELETED FILE'S HIDDEN DATA', then 'CHRIST LUTHERAN CHURCH' (glow) and a huge red '\"DENNIS\"', each landing on the spoken word with shake.", "Sub and impact at the cut, then the narration in near-silence (music -6 dB, hush cue)."),
            "s13_church": ("Push. A moonlit, rim-lit generic church; one window lights up; a name card slides in on 'Dennis': 'DENNIS RADER · CHURCH COUNCIL PRESIDENT'. Tag: NOT THE ACTUAL BUILDING.", "Whoosh; impact."),
            "s14_arrest": ("Flash. Two abstract DNA band profiles slide together: 'FAMILIAL DNA: LINK CONFIRMED'. Cross-fade to a night road under sodium street lights with a red/blue light wash; '25 FEB 2005', then 'ARRESTED' on the word.", "Glitch; impact on 'arrested'."),
            "s15_sentence": ("Push. Ten candle lights appear one by one (in memory, not a tally of violence). 'PLEADED GUILTY · JUNE 2005', then '10 × LIFE · CONSECUTIVE · AUGUST 2005'.", "Gavel and stamp; aftermath bells."),
            "s16_end": ("Zoom. The disk alone in a cold spotlight, slowly turning. Three icons light on the spoken words: '?' (question), 'AD' (lie), 'FILE'. The frame darkens to 'In memory of the ten people he killed.', then fades to black.", "Sub; aftermath; fade."),
        },
    },
}

DESC_TAIL = ("\n\nIllustrated documentary reconstruction. Scenes are labelled illustrations; no real footage, photographs or documents are shown. "
             "Narration is synthetic (Piper TTS). Music and sound effects are original and generated in code.")


def main() -> None:
    eps = {e["id"]: e for e in CFG["episodes"]}
    md = ["# Scripts and storyboards — THE HIDDEN WORLD: Case Files\n",
          "Both videos share one design system: night-desk backgrounds, Courier Prime case-file typography, Fraunces headlines, "
          "Nunito word-by-word captions at y = 1420 (above the Shorts title overlay) with key words in amber, red reserved for evidence, "
          "ILLUSTRATION tags on every reconstruction, one documentary narrator (Piper LibriTTS-R speaker 666) and -14 LUFS loudness. "
          "Case 01 is graded warm (desert and amber); Case 02 is graded cold (blue newsprint). Case 03 (v2 engine) adds word-synced punch captions, "
          "beat-snapped cuts at 100 BPM, push/flash/zoom transitions, a driving music cue and 60 fps; its palette is sodium orange, police blue, CRT green.\n",
          "Timings below come from the final render (`out/<id>/timeline.json`).\n"]
    src_md = ["# Sources\n", "Every narrated scene cites claim IDs in `episodes/<id>/episode.json`; each claim lists these sources. "
              "Access note: pages were consulted through web-search extracts on 2026-10-11 (direct fetching was blocked in the build environment).\n"]
    for eid, cr in CREATIVE.items():
        ep = json.loads((ROOT / "episodes" / eid / "episode.json").read_text())
        tl = json.loads((ROOT / "out" / eid / "timeline.json").read_text())
        meta = eps[eid]; n = meta["n"]
        md.append(f"\n---\n\n## Video {n:02d} — {cr['working_title']}  (`{meta['file']}`)\n")
        md.append(f"**YouTube title:** {meta['youtube_title']}  \n**Runtime:** {tl[-1]['end']:.1f} s  \n**Central question:** {ep['central_question']}\n")
        md.append("### Opening hooks considered\n")
        for i, (h, why) in enumerate(cr["hooks"], 1):
            md.append(f"{i}. \"{h}\"  \n   *{why}*")
        md.append("\n### Case timeline (verified)\n" + "\n".join(f"- {x}" for x in cr["story_timeline"]))
        md.append("\n### Full narration\n")
        md.append("\n".join(f"> {l['text']}" for s in tl for l in s.get("lines", [])))
        words = sum(len(l["text"].split()) for s in tl for l in s.get("lines", []))
        md.append(f"\n*{words} words, spoken in {tl[-1]['end']:.1f} s including pauses and holds.*\n")
        md.append("### Shot-by-shot storyboard, captions and sound\n")
        md.append("| Time | Scene | Visual (on-screen text in quotes) | Narration and caption timing | Sound | Claims |\n|---|---|---|---|---|---|")
        for s, sc in zip(tl, ep["scenes"]):
            vis, snd = cr["board"][s["id"]]
            caps = "<br>".join(f"{l['start']:.1f}-{l['end']:.1f}s: {l['text']}" for l in s.get("lines", []))
            md.append(f"| {s['start']:.1f}-{s['end']:.1f}s | {s['id']} | {vis} | {caps} | {snd} Music cue: `{sc['music_cue']}`. | {', '.join(sc['claims'])} |")
        md.append(f"\nCaption emphasis (amber): " + "; ".join(f"{sc['id']}: {', '.join(sc['emphasis'])}" for sc in ep["scenes"] if sc.get("emphasis")))
        md.append("\n### Source references for factual claims\n" + "\n".join(f"- **{c['id']}**: {c['text']} — {', '.join(c['sources'])}" for c in ep["claims"]))
        # sources.md + YouTube description
        src_md.append(f"\n## Video {n:02d} — {cr['working_title']}\n")
        for s_ in ep["sources"]:
            used = [c["id"] for c in ep["claims"] if s_["id"] in c["sources"]]
            src_md.append(f"- **[{s_['id']}]** {s_['title']}. *{s_['publisher']}*{(', ' + s_['date']) if s_.get('date') else ''}. {s_['url']}  \n  Supports: {', '.join(used)}")
        key = [s_ for s_ in ep["sources"]][:8]
        desc = (f"{ep['central_question']}\n\nSources:\n" + "\n".join(f"- {s_['publisher']}: {s_['url']}" for s_ in key) + DESC_TAIL)
        src_md.append(f"\n### YouTube upload metadata — Video {n:02d}\n**Title:** {meta['youtube_title']}\n\n**Description (paste as is):**\n```\n{desc}\n```\n**Hashtags:** #Shorts #TrueCrime #Documentary { {1: '#Australia #LindyChamberlain', 2: '#Unabomber #FBI', 3: '#BTK #ColdCase #Wichita'}[n] }\n")
    (HERE / "scripts_and_storyboards.md").write_text("\n".join(md) + "\n")
    (HERE / "sources.md").write_text("\n".join(src_md) + "\n")
    print("wrote scripts_and_storyboards.md, sources.md")


if __name__ == "__main__":
    main()
