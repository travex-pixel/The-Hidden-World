"""Case File 52 (cinematic, premium look, EPISODES 48+ rules): Evaldas Rimasauskas, a Lithuanian man who, from 2013 to
2015, got two American internet companies, Google and Facebook, to wire over $100 million (DOJ sentencing release: "over
$120 million"; Bloomberg and NBC: about $121-122 million, of which about $23 million from Google and about $98-99 million
from Facebook) by registering a company in Latvia with the same name as their real Taiwanese hardware supplier, Quanta
Computer, opening bank accounts in its name in Latvia and Cyprus, and emailing the companies' staff fake invoices. Forged
invoices, contracts and letters that appeared to be signed by the companies' own executives were submitted to banks to
support the transfers. Arrested in Lithuania in March 2017, extradited to the United States in August 2017, he pleaded
guilty to wire fraud in March 2019 (agreeing to forfeit about $49.7 million) and was sentenced in December 2019 to five
years in prison (forfeiture $49,738,559.41; restitution $26,479,079.24).

The "wait, what?" statistic (a counter): business email compromise cost victims $3,046,598,558 in reported losses in 2025
(FBI IC3 2025 Internet Crime Report, released April 2026).

Tone: remarkable and ironic. Rimasauskas appears only as a faceless silhouette tagged NOT A LIKENESS; staff, technicians,
the analyst and the young man in the lesson are generic figures. Google, Facebook and Quanta Computer are named only as plain
text: no logos, no brand artwork, no real document or email is imitated.
Research ledger: episodes/tcv52-fake-invoices/research.md. Shots: renderer/scenes/tcv52-fake-invoices.js."""
import json

EP = "tcv52-fake-invoices"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-15"

    scenes = [
        # A - hook: frame 1 = the HERO OBJECT (a laptop with an invoice email open, a big PAY button) with a finance clerk's
        #     hand already on it; the camera already pushing in; the headline burned in at the top. Line 1 = the
        #     contradiction (done by 2.5 s); line 2 escalates with the stakes number at 3-5 s.
        S("s01_hook", "fi52_hook", [N("He sent Google fake invoices. They paid."), N("Then Facebook paid. Over $100 million.", pause_before=0.2)],
          "tension", ["F_hook", "F_total"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "click", 0.3), fw(0, 6, "cash", 0.35, 0.05), fw(1, 2, "cash", 0.3, 0.05), fw(1, 4, "thump", 0.35, -0.03)],
          emph=["google", "fake", "invoices.", "paid.", "facebook", "$100", "million."], min_d=3.6, pad=0.15),
        # A - who: a dim room at night; his silhouette at a laptop; the open loop (how?)
        S("s02_who", "fi52_who", [N("The sender was a Lithuanian man."), N("So how did it work?", pause_before=0.1)],
          "tension", ["F_who"], sfx=[fx(0.0, "typing", 0.25), fw(1, 1, "hit", 0.3, -0.03)],
          emph=["lithuanian", "how"], min_d=3.6, pad=0.3, tr="dissolve"),
        # B - the real supplier: a server assembly line in Taiwan (generic); the company name as plain text on a card
        S("s03_supplier", "fi52_supplier", [N("Both bought hardware from a real supplier based in Taiwan.")],
          "tension-rise", ["F_supplier"], sfx=[fx(0.0, "rumble", 0.2), fw(0, 5, "click", 0.3, 0.0), fw(0, 9, "ping", 0.3, 0.0)],
          emph=["real", "supplier", "taiwan."], min_d=3.6, pad=0.3, tr="dissolve"),
        # C - the emails: back at the finance desk; an invoice "from" QUANTA COMPUTER (plain text) lands; the WIRED chip ticks
        #     $0, $23M, $120M+; the rehook "But the money went to his accounts."; the fun fact card
        S("s04_invoice", "fi52_invoice", [N("He emailed their staff fake invoices in its name."), N("But the money went to him.", pause_before=0.2)],
          "tension-rise", ["F_emails", "F_accounts", "F_split", "F_total", "F_forged"],
          sfx=[fx(0.0, "ping", 0.3), fw(0, 5, "paper", 0.35, 0.0), fw(1, 0, "cash", 0.35, 0.1), fw(1, 5, "cash", 0.4, 0.0), fx(3.0, "sparkle", 0.3)],
          emph=["emailed", "fake", "invoices", "name.", "money", "him."], min_d=3.8, pad=0.45),
        # D - THE BIGGEST REVEAL (music drop; the one impact and the one shake): in Latvia, a door plaque with the SAME name;
        #     the like moment = a held beat after "same name."
        S("s05_samename", "fi52_samename", [N("In Latvia, he registered a company with the same name.")],
          "revelation", ["F_latvia", "F_accounts"], sfx=[fw(0, 5, "stamp", 0.4, -0.03), fw(0, 8, "riser", 0.25, -0.6), fw(0, 9, "hit", 0.45, -0.03)],
          emph=["latvia,", "registered", "company", "same", "name."], min_d=4.6, pad=0.6, tr="push"),
        # B - the LESSON (save trigger, for the viewer): a young man at home with a bill on his phone; captions OFF
        S("s06_lesson", "fi52_lesson", [N("You pay bills by email? Save these three checks.")],
          "tension-rise", ["F_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 5, "chime", 0.25, 0.0)],
          emph=["bills", "email?", "save", "three"], min_d=4.3, pad=0.3, tr="dissolve"),
        # C - the statistic (a counter): business email compromise losses reported to the FBI in 2025
        S("s07_stat", "fi52_stat", [N("Last year, this scam cost victims 3 billion dollars.")],
          "tension", ["F_stat"], sfx=[fx(0.0, "radio", 0.2), fw(0, 6, "riser", 0.25, -0.4), fw(0, 6, "thump", 0.4, 0.0), fw(0, 8, "cash", 0.3, 0.0)],
          emph=["scam", "victims", "3", "billion"], min_d=4.6, pad=0.45),
        # E - the outcome, then the irony as the LAST line, on the hero object in the first frame's framing; the burned-in end
        #     question with the SEND line; pad 0.6, no fade (the reel loops to frame 1)
        S("s08_end", "fi52_end", [N("He got five years in prison."), N("His weapon? A copied name and an email.", pause_before=0.3)],
          "aftermath", ["F_sentence", "F_twist"], sfx=[fw(0, 2, "gavel", 0.4, -0.05), fw(1, 1, "sub", 0.35, 0.0), fw(1, 7, "thump", 0.3, 0.0)],
          emph=["five", "years", "prison.", "copied", "name", "email."], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_who": "A", "s03_supplier": "B", "s04_invoice": "C", "s05_samename": "D",
                "s06_lesson": "B", "s07_stat": "C", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[0]["music_gain_db"] = -4    # no full drop inside the first 15 s
    scenes[5]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    scenes[4]["music_drop"] = True     # the same-name reveal (after 15 s)
    scenes[7]["music_drop"] = True     # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("doj_plea", "U.S. Attorney's Office, SDNY (DOJ)", "Lithuanian Man Pleads Guilty To Wire Fraud For Theft Of Over $100 Million In Fraudulent Business Email Compromise Scheme", "https://www.justice.gov/usao-sdny/pr/lithuanian-man-pleads-guilty-wire-fraud-theft-over-100-million-fraudulent-business", "2019-03-20", A),
        src("doj_sent", "U.S. Attorney's Office, SDNY (DOJ)", "Lithuanian Man Sentenced To 5 Years In Prison For Theft Of Over $120 Million In Fraudulent Business Email Compromise Scheme", "https://www.justice.gov/usao-sdny/pr/lithuanian-man-sentenced-5-years-prison-theft-over-120-million-fraudulent-business", "2019-12", A),
        src("nbc", "NBC News", "Lithuanian pleads guilty in U.S. to $100 million fraud against Google, Facebook", "https://www.nbcnews.com/tech/tech-news/lithuanian-pleads-guilty-u-s-100-million-fraud-against-google-n986871", "2019-03-20", A),
        src("bloomberg", "Bloomberg", "Facebook-Google Scammer Pleads Guilty in $121 Million Theft", "https://www.bloomberg.com/news/articles/2019-03-20/man-pleads-guilty-in-100-million-scam-of-facebook-and-google", "2019-03-20", A),
        src("npr", "NPR", "Man Pleads Guilty To Phishing Scheme That Fleeced Facebook, Google Of $100 Million", "https://www.npr.org/2019/03/25/706715377", "2019-03-25", A),
        src("cnbc17", "CNBC (reporting Fortune)", "Facebook and Google were victims of $100 million phishing scam: Fortune", "https://www.cnbc.com/2017/04/27/facebook-and-google-were-victims-of-a-100-million-dollar-phishing-scam-fortune.html", "2017-04-27", A),
        src("cnbc19", "CNBC", "How a phishing email scam stole $100 million from Facebook and Google", "https://www.cnbc.com/2019/03/27/phishing-email-scam-stole-100-million-from-facebook-and-google.html", "2019-03-27", A),
        src("register", "The Register", "Facebook, Google scam: Lithuanian admits fleecing tech giants", "https://www.theregister.com/2019/03/21/facebook_google_scam/", "2019-03-21", A),
        src("occrp", "OCCRP", "US: Extradited Lithuanian Man Pleads Not Guilty in US$ 100 million Fraud Case", "https://www.occrp.org/en/daily/6880-us-extradited-lithuanian-man-pleads-not-guilty-in-us-100-million-fraud-case", "2017-08", A),
        src("cyberscoop", "CyberScoop", "Man sentenced for Facebook, Google scam", "https://cyberscoop.com/facebook-google-scam-man-sentenced/", "2019-12", A),
        src("secaff", "Security Affairs", "Lithuanian man sentenced to 5 years in prison for stealing $120 Million From Google, Facebook", "https://securityaffairs.com/95523/breaking-news/lithuanian-man-sentenced-bec.html", "2019-12-21", A),
        src("computing", "Computing (UK)", "US court jails scammer who fleeced Facebook and Google out of $120m in email fraud", "https://computing.co.uk/news/3084788/google-facebook-email-phishing-fraud", "2019-12", A),
        src("africacheck", "Africa Check", "Man stole $122 million from tech giants by sending random bills? No, global fraud far more complex", "https://africacheck.org/fact-checks/fbchecks/man-stole-122-million-tech-giants-sending-random-bills-no-global-fraud-far", "2024", A),
        src("ic3_jds", "JD Supra (Alston & Bird)", "Cybercrime Trends to Watch: Takeaways from the FBI's 2025 IC3 Annual Report", "https://www.jdsupra.com/legalnews/cybercrime-trends-to-watch-takeaways-6390565/", "2026-04", A),
        src("ic3_mh", "McDonald Hopkins", "The sobering truth of the FBI's 2025 Internet Crime Complaint Center Report", "https://www.mcdonaldhopkins.com/insights/news/the-sobering-truth-of-the-fbis-2025-internet-crime-complaint-center-report", "2026-04", A),
        src("ic3_ib", "Insurance Business", "Business email fraud drives bulk of US cybercrime losses: Analysis", "https://www.insurancebusinessmag.com/us/news/cyber/business-email-fraud-drives-bulk-of-us-cybercrime-losses-analysis-590687.aspx", "2026-04", A),
        src("fbi_pdf", "FBI", "Business Email Compromise / Email Account Compromise (private sector partnerships guide)", "https://www.fbi.gov/file-repository/private-sector-partnerships/email-compromise_508.pdf", "2026", A),
        src("fbi_phx", "FBI Phoenix", "FBI Tech Tuesday: Business Email Compromise (BEC) Fraud", "https://www.fbi.gov/contact-us/field-offices/phoenix/news/press-releases/fbi-tech-tuesday-business-email-compromise-bec-fraud", "2026", A),
        src("nbcc", "National Business Crime Centre (UK police)", "Mandate Fraud", "https://nbcc.police.uk/crime-prevention/cyber-and-fraud/bank-mandate-fraud", "2026", A),
        src("psni", "Police Service of Northern Ireland", "Mandate fraud", "https://www.psni.police.uk/safety-and-support/keeping-safe/protecting-yourself/scams/mandate-fraud", "2026", A),
    ]
    C = h.claim
    claims = [
        C("F_hook", "From 2013 to 2015, Evaldas Rimasauskas, a Lithuanian citizen, sent fraudulent (phishing) emails with fake invoices to staff of two American internet companies, which wired money in payment; the DOJ did not name them, but a 2017 Lithuanian court order, Fortune/CNBC, Bloomberg and NBC/Reuters identify them as Google and Facebook. Narration: 'He sent Google fake invoices. They paid. Then Facebook paid.' Headline: 'HE EMAILED FAKE INVOICES / GOOGLE AND FACEBOOK PAID'.",
          ["doj_plea", "nbc", "cnbc17", "bloomberg"]),
        C("F_total", "In total the two companies wired over $100 million (DOJ plea release: 'over $100 million'; DOJ sentencing release title: 'over $120 million'; Bloomberg: $121 million). Narration: 'Over $100 million.' WIRED chip: '$120M+'.",
          ["doj_plea", "doj_sent", "bloomberg", "npr"]),
        C("F_who", "The scheme's author was Evaldas Rimasauskas, a Lithuanian man (about 50 at his plea), arrested in Lithuania in March 2017 and extradited to the United States in August 2017. Narration: 'The sender was a Lithuanian man.'",
          ["doj_plea", "occrp", "nbc", "register"]),
        C("F_supplier", "The real vendor he impersonated was Taiwan-based Quanta Computer, a hardware manufacturer that did business with both companies (it builds servers and other components). Quanta confirmed it was the Asian vendor. Narration: 'Both bought hardware from a real supplier based in Taiwan.'",
          ["nbc", "cyberscoop", "cnbc17", "register"]),
        C("F_latvia", "He registered a company in Latvia with the same name as the Asian-based computer hardware manufacturer (DOJ). Narration: 'In Latvia, he registered a company with the same name.' Door plaque in the drawing: plain text 'QUANTA COMPUTER' (no logo).",
          ["doj_plea", "nbc", "cnbc19", "register"]),
        C("F_accounts", "He opened bank accounts in that company's name at banks in Latvia and Cyprus, into which the victims' payments were wired. Narration: 'But the money went to him.' (accounts he controlled, opened in the look-alike company's name).",
          ["doj_plea", "nbc", "register"]),
        C("F_emails", "He sent phishing emails to employees and agents of the victim companies, posing as the supplier and asking for payment of invoices for goods and services actually provided by the real supplier. Narration: 'He emailed their staff fake invoices in its name.'",
          ["doj_plea", "cnbc17", "cyberscoop", "africacheck"]),
        C("F_forged", "FUN FACT CARD: forged invoices, contracts and letters that falsely appeared to have been executed and signed by executives and agents of the victim companies (and bore false corporate stamps) were submitted to banks to support the transfers. Card: 'HE FORGED SIGNATURES OF / THEIR OWN EXECUTIVES.'",
          ["doj_plea", "cnbc17", "register"]),
        C("F_split", "Per a 2017 Lithuanian court order (reported by NBC/Reuters) Google was defrauded of about $23 million and Facebook of about $99 million; Bloomberg's source: about $23 million and about $98 million. Shown as the WIRED chip ticking $23M then $120M+ in s04 (no narration of the split).",
          ["nbc", "bloomberg", "register"]),
        C("F_lesson", "LESSON CARD (for the viewer): before paying an invoice or sending money on an emailed request, (1) verify it by phone on a number you already have, never one given in the email; (2) check the sender's exact address/domain for look-alikes; (3) treat urgency and changed bank details as red flags and stop. Rows: 'CALL A NUMBER YOU KNOW', 'CHECK THE EXACT ADDRESS', 'URGENT? NEW BANK? STOP.' Credit: 'FBI · Action Fraud / UK police'.",
          ["fbi_pdf", "fbi_phx", "nbcc", "psni"]),
        C("F_stat", "STATISTIC (counter): in 2025, business email compromise caused $3,046,598,558 in reported losses (24,768 complaints), the second-costliest crime type in the FBI IC3 2025 Internet Crime Report (released April 2026). Narration: 'Last year, this scam cost victims 3 billion dollars.' (card: REPORTED LOSSES, 2025)",
          ["ic3_jds", "ic3_mh", "ic3_ib"]),
        C("F_sentence", "He pleaded guilty to wire fraud in March 2019 (agreeing to forfeit about $49.7 million) and in December 2019 was sentenced in Manhattan federal court to five years in prison, with forfeiture of $49,738,559.41 and restitution of $26,479,079.24. Narration: 'He got five years in prison.' (card: DEC 2019)",
          ["doj_sent", "secaff", "cyberscoop", "computing"]),
        C("F_twist", "IRONY / TWIST (characterisation): the fraud relied on impersonation by email (a company registered under a copied name and phishing emails), not on breaking into computer systems. Narration: 'His weapon? A copied name and an email.'",
          ["doj_plea", "cnbc19", "africacheck"], nature="reported"),
    ]

    figures = ["fi52_rimasauskas", "fi52_clerk", "fi52_clerk2", "fi52_worker", "fi52_worker2", "fi52_mate", "fi52_analyst"]
    ep = h.base(EP, 52, "He Invoiced Google",
                "How did one man get Google and Facebook to pay over $100 million in fake invoices, and how was he caught?",
                figures, scenes, claims, sources, "FAKE INVOICES · GOOGLE & FACEBOOK 2013-15", bpm=80)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#0f2630", "mid": "#c8b89e", "accent": "#e2a13b"}
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "HE EMAILED FAKE INVOICES"}, {"text": "GOOGLE AND FACEBOOK PAID", "colour": "#e2a13b"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "HE INVOICED GOOGLE."}, {"text": "GENIUS OR CRIMINAL? \U0001F447", "colour": "#e2a13b"},
                                 {"text": "TAG THE MATE WHO PAYS ANY BILL", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the WIRED chip: $0 on the invoices, $23M on Google, $120M+ on Facebook. Word-anchored from out/<id>/timeline.json when a
    # build exists (narration is cached, so they are stable); defaults are draft values.
    anchors = [("s04_invoice", 0, 5, 14.5, "$0"), ("s04_invoice", 1, 2, 16.5, "$23M"), ("s04_invoice", 1, 5, 17.4, "$120M+")]
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
        keys.append({"t": t, "v": v})
    ep["progress"] = {"label": "WIRED", "keys": keys, "y": 330,
                      "until": round(by["s05_samename"]["end"] - 0.25, 2) if "s05_samename" in by else 22.2}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "$100": "one hundred", "3": "three"})
    ep["score"] = {"root_hz": 130.81, "bpm": 80,
                   "cliff": {"scene": "s05_samename", "word": [0, 9], "at": 0.45}}
    ep["content_notes"] = ("Remarkable and ironic tone. Rimasauskas appears only as a faceless silhouette tagged NOT A LIKENESS. The finance "
                           "staff, technicians, the analyst and the young man in the lesson are generic figures, never named. Google, Facebook "
                           "and Quanta Computer are named only as plain text: no logo, brand artwork, product design or real email/invoice is "
                           "imitated; the invoice and email on screen are our own generic drawings with placeholder bars. The DOJ did not name "
                           "the victims; their identities come from a Lithuanian court order as reported by NBC/Reuters, Bloomberg and Fortune. "
                           "The offices, factory, street and rooms are generic illustrations. The statistic card names its source and year. "
                           "No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
