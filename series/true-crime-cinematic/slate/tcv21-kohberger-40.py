"""Case File 21 (cinematic, 40-second cut of Case File 17): the University of Idaho killings. His family's trash helped.

CLOSED (with one 2026 development): Bryan Kohberger pleaded guilty on 2 Jul 2025 to four counts of first-degree murder and
one count of burglary and on 23 Jul 2025 was sentenced to four consecutive life sentences plus 10 years. On 27 Jul 2026 he
reportedly filed a post-conviction petition to withdraw the plea; Judge Hippler set a status conference for 3 Jun 2027 and,
if an evidentiary hearing is granted, a hearing from 17 Jun 2027. The state has asked for dismissal. No ruling as of the
verification date. There was no trial, so every clue (the sheath DNA, the genealogy, the trash, the paternity result) is
attributed to the affidavit, prosecutors or court filings.
The claims and sources are REUSED from the Case File 17 builder (slate/tcv17-kohberger.py), plus one new procedure claim
(K_hearings). Research: episodes/tcv21-kohberger-40/research.md -> episodes/tcv17-kohberger/research.md.
Shots: renderer/scenes/tcv21-kohberger-40.js (a trimmed copy of renderer/scenes/tcv17-kohberger.js)."""
import importlib.util


def _original(h):
    """The Case File 17 episode dict: the single source of its verified claims and sources."""
    p = h.ROOT / "series" / "true-crime-cinematic" / "slate" / "tcv17-kohberger.py"
    spec = importlib.util.spec_from_file_location("slate_tcv17_kohberger_for_tcv21", p)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m.build(h)


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-12"

    scenes = [
        # A - hook: the hero object (a tied black trash bag beside a curbside bin) is big and centred from the first frame
        S("s01_hook", "kb17_hook", [N("Investigators had the Idaho killer's DNA, but no name."),
                                    N("Then they went through his family's trash.", pause_before=0.25)],
          "cold", ["K_snap", "K_swab", "K_plea", "K_trash"],
          sfx=[fx(0.0, "sub", 0.5), fx(0.1, "wind", 0.45), fw(0, 8, "thud", 0.45, 0.05), fw(1, 3, "step", 0.35, -0.3), fw(1, 6, "hit", 0.5, -0.05)],
          emph=["dna,", "no", "name.", "trash."], min_d=4.6, pad=0.2),
        S("s02_case", "kb17_case", [N("In November 2022, four University of Idaho students were killed.")],
          "unease", ["K_killings", "K_names"], sfx=[fx(0.0, "wind", 0.45), fw(0, 9, "sub", 0.4, -0.05)],
          emph=["four", "students"], min_d=3.6, pad=0.2, tr="fade"),
        # B - the clue chain, attributed: the sheath and its snap -> the genealogy -> one family -> a name
        S("s03_sheath", "kb17_sheath", [N("Prosecutors said a knife sheath was left behind, with DNA on its button snap.")],
          "tension", ["K_sheath", "K_snap"], sfx=[fx(0.1, "click", 0.4), fw(0, 4, "paper", 0.45, -0.1), fw(0, 13, "ping", 0.45)],
          emph=["sheath", "dna", "snap."], pad=0.15, tr="push"),
        S("s04_tree", "kb17_tree", [N("Court filings said genetic genealogy pointed to one family, and to Bryan Kohberger.")],
          "tension-rise", ["K_igg", "K_name"], sfx=[fx(0.1, "typing", 0.4), fw(0, 5, "click", 0.4), fw(0, 8, "thump", 0.45), fw(0, 12, "hit", 0.45, -0.05)],
          emph=["genetic", "genealogy", "one", "family,", "kohberger."], pad=0.3, tr="push"),
        # C - the trash, the paternity result (the HOW, ~55-65%), the arrest
        S("s05_trash", "kb17_trash", [N("So investigators took trash from his parents' home in Pennsylvania.")],
          "tension-peak", ["K_trash"], sfx=[fx(0.0, "wind", 0.45), fw(0, 1, "step", 0.35, -0.3), fw(0, 3, "thud", 0.4, 0.05), fw(0, 9, "door", 0.4)],
          emph=["trash", "pennsylvania."], pad=0.15, tr="push"),
        S("s06_lab", "kb17_lab", [N("Prosecutors said the trash DNA came from the father of whoever left the sheath.", pause_before=0.2)],
          "revelation", ["K_paternity"], sfx=[fx(0.05, "click", 0.4), fw(0, 0, "swell", 0.45, -0.3), fw(0, 8, "hit", 0.5, -0.05)],
          emph=["father", "sheath."], min_d=4.4, pad=0.35, tr="flash"),
        S("s07_arrest", "kb17_arrest", [N("On December 30th, police arrested him.")],
          "tension", ["K_arrest", "K_distance"], sfx=[fx(0.0, "wind", 0.4), fw(0, 3, "step", 0.4, -0.3), fw(0, 4, "hit", 0.5, -0.05)],
          emph=["arrested"], min_d=2.6, pad=0.15, tr="push"),
        # D - the outcome in one line, then the mandatory 2026 line; the cliff impact sits in the pause before line 2
        S("s08_sentence", "kb17_sentence", [N("He pleaded guilty and got four life sentences."),
                                            N("In 2026, he reportedly asked to withdraw his plea.", pause_before=0.4)],
          "aftermath", ["K_plea", "K_sentence", "K_petition", "K_hearings"],
          sfx=[fw(0, 2, "stamp", 0.4, 0.2), fw(0, 6, "gavel", 0.5, -0.08), fw(1, 4, "paper", 0.4, -0.1)],
          emph=["guilty", "life", "withdraw"], pad=0.6, tr="zoom"),
        # E - the callback on the hero object; a compact follow card in the last ~1.5 s; the last frame loops to the first
        S("s09_end", "kb17_end", [N("His family's trash helped link that DNA to him.", pause_before=0.1)],
          "aftermath", ["K_trash", "K_paternity", "K_swab"], sfx=[fx(0.0, "wind", 0.4), fw(0, 2, "thud", 0.4, 0.05), fw(0, 8, "whoosh", 0.4, 0.35)],
          emph=["trash", "dna"], min_d=3.6, pad=1.75, tr="push"),
    ]
    sections = {"s01_hook": "A", "s02_case": "A", "s03_sheath": "B", "s04_tree": "B", "s05_trash": "C", "s06_lab": "C",
                "s07_arrest": "C", "s08_sentence": "D", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[5]["music_drop"] = True     # the paternity result (the HOW)
    scenes[7]["music_drop"] = True     # the outcome line, which carries the cliff impact
    # no fade to black on the last scene: the final frame (the bag at the curb) must loop cleanly into the first

    # ---- claims and sources: reused from Case File 17, plus the June 2027 court dates (new; procedure)
    orig = _original(h)
    src = lambda *a: h.src(*a, accessed=VER + " (search-result extract; full page not reachable from the build environment)")
    new_sources = [
        src("kmvt_hearings", "KMVT (Gray)", "Court sets 2027 evidentiary hearing for Kohberger's effort to withdraw guilty plea", "https://www.kmvt.com/2026/08/26/court-sets-2027-evidentiary-hearing-kohbergers-effort-withdraw-guilty-plea/", "2026-08-26"),
        src("kivi_hearings", "KIVI (Scripps)", "Court sets 2027 evidentiary hearing for Kohberger's effort to withdraw guilty plea [title from URL slug]", "https://www.kivitv.com/university-of-idaho-murders/court-sets-2027-evidentiary-hearing-for-kohbergers-effort-to-withdraw-guilty-plea", "2026-08"),
        src("fox_hearings", "FOX 13 Seattle (FOX Television Stations)", "Idaho judge grants Bryan Kohberger two hearings next year as admitted killer seeks to withdraw guilty plea", "https://www.fox13seattle.com/news/idaho-judge-grants-bryan-kohberger-two-hearings-next-year-admitted-killer-seeks-withdraw-guilty-plea", "2026-08"),
        src("foxnews_dismiss", "Fox News", "Bryan Kohberger's 2027 hearing is not guaranteed as Idaho seeks quick dismissal", "https://www.foxnews.com/us/bryan-kohberger-2027-hearing-not-guaranteed-idaho-seeks-quick-dismissal.amp", "2026-08/09"),
    ]
    used = ["K_killings", "K_names", "K_sheath", "K_snap", "K_swab", "K_igg", "K_name", "K_trash", "K_paternity", "K_arrest",
            "K_distance", "K_plea", "K_sentence", "K_petition"]
    by_id = {c["id"]: c for c in orig["claims"]}
    claims = [by_id[c] for c in used] + [
        h.claim("K_hearings", "Judge Steven Hippler set a status conference for 3 June 2027 and, if an evidentiary hearing is granted, a hearing to begin "
                "on 17 June 2027 on the post-conviction petition; the state has asked for the petition to be dismissed without a hearing. No ruling "
                "on the petition was found as of 12 October 2026 (search extracts only). Shown on screen only: 'NO RULING YET' and 'COURT DATES SET "
                "FOR JUNE 2027'.", ["kmvt_hearings", "kivi_hearings", "fox_hearings", "foxnews_dismiss"], "procedure")]
    cited = {s for c in claims for s in c["sources"]}
    sources = [s for s in orig["sources"] if s["id"] in cited] + new_sources

    figures = ["kb17_man", "agent_a", "agent_b", "detective", "analyst", "scientist", "examiner", "judge"]
    ep = h.base("tcv21-kohberger-40", 21, "His Family's Trash Helped Catch the Idaho Killer",
                "How did investigators tie the DNA left at the University of Idaho killings to one man?",
                figures, scenes, claims, sources, "MOSCOW, IDAHO · 2022-2026", bpm=80)
    ep["format"] = "short40"
    ep["target_duration_seconds"] = [30, 50]
    ep["hook_title"] = {"lines": [{"text": "HIS FAMILY'S TRASH"}, {"text": "HELPED CATCH THE IDAHO KILLER", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["music"]["beat_snap"] = 0.5   # cut on the half-beat: tighter pacing, still on the grid
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={"Kohberger": "Koh-burger"})
    ep["score"] = {"root_hz": 138.59, "bpm": 80,
                   "hits": [{"scene": "s04_tree", "word": [0, 11], "at": -0.05, "gain": 0.4}],
                   "cliff": {"scene": "s08_sentence", "word": [1, 0], "at": -0.38}}
    ep["content_notes"] = ("40-second cut of Case File 17 (tcv17-kohberger); same rules. Closed case: Kohberger pleaded guilty on 2 Jul 2025 and was "
                           "sentenced on 23 Jul 2025 to four consecutive life sentences plus 10 years; on 27 Jul 2026 he reportedly filed a "
                           "post-conviction petition to withdraw the plea (narrated as 'reportedly'); court dates are set for June 2027 and no ruling "
                           "was found as of " + VER + ". There was no trial, so every clue is attributed to the affidavit, prosecutors or court filings. "
                           "The hook headline says the trash 'HELPED CATCH' him: the affidavit lists the trash DNA alongside the sheath DNA, the car "
                           "and the phone records. Kohberger appears only as an anonymous rim-lit silhouette (not a likeness). His parents and family "
                           "are never named or shown; the Pennsylvania street and houses are generic and distant. The victims, the house, the killings, "
                           "the knife and any weapon are never depicted; the sheath is described in words only. The four students are named only on a "
                           "memorial card. No real photograph, filing, police or court material, logo or video frame is imitated. No dialogue is "
                           "invented. Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
