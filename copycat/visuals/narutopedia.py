"""Narutopedia (naruto.fandom.com) discovery + tagging for the Naruto vault.

Narutopedia files are named descriptively ("Iruka protects naruto.png"), most anime screenshots sit in
Category:Fair use tv-screenshot / Category:1080p HD Images, and `prop=fileusage` tells which wiki pages use a file
(Iruka Umino, Hokage Residence, Scroll of Seals ...), which is the strongest subject/era signal we have.
"""
import re

SCREENSHOT_CATS = ["Category:Fair use tv-screenshot", "Category:1080p HD Images"]
EPISODE_LIST = "List of Naruto Episodes"       # original series (Part I); Shippuden / Boruto have their own lists
MIN_W = 960

# extra rejects on top of imgutil.NAME_REJECT (this wiki's naming habits)
NAME_REJECT = re.compile(
    r"chapter \d|\bcover\b|\bvol(ume)?\b|box ?art|\bgame\b|\bnsun|\bstorm\b|ninja council|clash of|\bpsp\b|\bps[34]\b|\bwii\b|"
    r"\bcard\b|\bbanner\b|\bposter\b|\bwallpaper\b|\bartwork\b|illustration|\bfan\b|\bhandbook\b|"
    r"\bsilhouette\b|\bsymbol\b|\bsvg\b|\bsprite\b|\bchibi\b|\bthumbnail\b|\bfont\b|\bjump\b|\bkizuna\b|\bstats?\b|\bgraph",
    re.I)

SHIPPUDEN = re.compile(
    r"shipp[uū]den|part ii|\bakatsuki|\bpain\b|\bnagato\b|\bobito\b|\bmadara\b|\bkaguya\b|\bsage mode|kurama mode|\bwar\b|"
    r"\balliance|\bedo\b|\btailed beast (bomb|ball)|\brasenshuriken|\brinnegan|\bmangekyo|\beternal|"
    r"\b(fifth|sixth|seventh) hokage|\bhokage naruto|\badult|\bkazekage|\bsai\b|\byamato\b|"
    r"\bsusanoo|\bjuubi|\bten.?tails|\bbiju|\bbijuu|\btsuchikage|\braikage|\bmizukage|\bkillerbee|\bkiller b\b|"
    r"\bhagoromo|\bhamura|\bindra|\basura\b|\bgedo|\bzetsu\b|\bkonan\b|\bsix paths|\bmenma|\bnangi\b|\bkabuto.*(edo|sage)|\bhidan|\bkakuzu|\bdeidara|\bsasori|\bitachi",
    re.I)
BORUTO = re.compile(r"\bboruto|\bhimawari|\bsarada|\bmitsuki|\bkawaki|\bshikadai|\bchocho|\bmetal lee|\bseventh hokage|\bboro\b|\bishiki|\bmomoshiki|\bdaemon|\bnext generation", re.I)
KID = re.compile(r"\b(child|children|young|kid|baby|infant|toddler|orphan|born|birth|first day|childhood|younger|as a boy|little)\b", re.I)

CHAR_RE = {
    "naruto": r"\bnaruto\b|\bnarutos\b",
    "iruka": r"\biruka\b|\bumino\b",
    "mizuki": r"\bmizuki\b",
    "hiruzen": r"hiruzen|third hokage|3rd hokage|sandaime|\bsarutobi\b|\blord third\b",
    "kakashi": r"\bkakashi\b|\bhatake\b|copy ninja|copy-ninja",
    "sasuke": r"\bsasuke\b",
    "sakura": r"\bsakura\b",
    "kurama": r"\bkurama\b|nine.?tails?|kyuubi|kyūbi|nine-tailed|demon fox|\bfox\b",
    "minato": r"\bminato\b|fourth hokage|4th hokage|yondaime|namikaze|yellow flash",
    "kushina": r"\bkushina\b",
    "tobirama": r"\btobirama\b|second hokage|2nd hokage|nidaime",
    "danzo": r"\bdanz[oō]\b",
    "anbu": r"\banbu\b|\bblack ops\b",
    "teuchi": r"\bteuchi\b|\bayame\b",
    "villagers": r"villagers?|townspeople|citizens|crowd|people of the (leaf|village)|passersby|civilians?",
}
OBJ_RE = {
    "forbidden_scroll": r"scroll of seals|forbidden scroll|sealing scroll|big scroll|giant scroll",
    "paperwork": r"paperwork|reports?\b|\bfiles?\b|records?\b|stack of|mission (desk|assignment|scroll|request|report)|assignment desk|\bdesk\b",
    "document": r"documents?\b|\bfiles?\b|reports?\b|\bpapers?\b|\bnotes?\b|\bletters?\b|\bscrolls?\b",
    "crystal_ball": r"crystal ball|telescope technique|telescope jutsu|crystal",
    "headband": r"forehead protector|headband|hitai-ate|leaf headband|hitai",
    "bells": r"\bbells?\b|bell test|survival (test|exercise)|bell exercise|bell trial",
    "seal_mark": r"eight trigrams|seal formula|sealing style|stomach seal|navel|eight trigram|fuinjutsu|seal on",
    "shuriken": r"shuriken|windmill|demon wind|fuma",
    "fireball": r"fireball|great fireball|katon",
    "ramen": r"ramen|ichiraku",
}
PLACE_RE = {
    "ichiraku": r"ichiraku|ramen (stand|shop|bar)",
    "hokage_monument": r"hokage (monument|rock|mountain|faces?|stone faces?)|monument|hokage stone",
    "hokage_office": r"hokage('s)? (office|residence|building|tower|room|desk)|hokage office|hokage residence|\boffice\b",
    "academy": r"\bacademy\b|ninja academy|graduation",
    "classroom": r"classroom|\bclass\b|lesson|lecture|\bstudents\b|chalkboard|blackboard",
    "archive": r"archives?\b|records room|\blibrary\b|bookshelf|shelves|book ?shelf|\bstacks\b|file room",
    "training_ground": r"training (ground|field|area|yard)|\bstumps?\b|memorial stone|cenotaph|\bground [0-9]\b|third training",
    "naruto_apartment": r"apartment|naruto'?s? (home|room|house|bedroom)|bedroom|\bbed\b|naruto's place",
    "seal_cage": r"\bcage\b|sewer|mindscape|seal(ed)? gate|\bbars\b|inner (world|self|mind)|kurama's cage|seal room",
    "night_sky": r"night sky|\bmoon(light)?\b|\bstars?\b|full moon",
    "sunrise": r"sunrise|dawn|\bsunset\b|\bdusk\b|\bsun\b|early morning|morning sun",
    "konoha_village": r"konoha|hidden leaf|leaf village|konohagakure|\bvillage\b|\bstreets?\b|rooftop|\broof\b",
    "forest": r"\bforest\b|\bwoods\b|\btrees?\b|\bjungle\b",
}

SUBJECT_KEYS = list(CHAR_RE) + list(OBJ_RE) + list(PLACE_RE)
ALL_RE = {**CHAR_RE, **OBJ_RE, **PLACE_RE}
PAGE_SUBJECT = {  # wiki page (fileusage) -> subject when the file title is silent
    "iruka umino": "iruka", "mizuki": "mizuki", "hiruzen sarutobi": "hiruzen", "kakashi hatake": "kakashi",
    "sasuke uchiha": "sasuke", "sakura haruno": "sakura", "kurama": "kurama", "minato namikaze": "minato",
    "kushina uzumaki": "kushina", "tobirama senju": "tobirama", "danzō shimura": "danzo", "danzo shimura": "danzo",
    "anbu": "anbu", "teuchi": "teuchi", "ichiraku ramen": "ichiraku", "ramen ichiraku": "ichiraku",
    "scroll of seals": "forbidden_scroll", "shadow clone technique": "naruto_clones", "multiple shadow clone technique": "naruto_clones",
    "team 7": "team7", "hokage": "hokage_office", "konohagakure": "konoha_village", "hokage monument": "hokage_monument",
    "ninja academy": "academy", "eight trigrams sealing style": "seal_mark", "crystal ball": "crystal_ball",
    "telescope technique": "crystal_ball", "windmill shuriken": "shuriken", "demon wind shuriken": "shuriken",
    "great fireball technique": "fireball", "bell test": "bells", "survival exercise": "bells", "survival test": "bells",
    "naruto uzumaki": "naruto",
}
MOODS = [
    ("comedy", r"funny|laugh|silly|embarrass|sexy|harem|ramen|eat(s|ing)?\b|goofy|prank|stuck|panic|sweat|grin|cheer|joke|oiroke"),
    ("emotional", r"cry|crying|tears?|sad|sorrow|hug|embrace|smile|farewell|promise|apolog|hurt|lonel|grief|funeral|memor|comfort|console|thanks?|sob"),
    ("action", r"\bvs\b|attack|clash|fight|battle|strike|punch|kick|throw|charge|slash|blocks?|dodg|jump|launch|rasengan|barrage|duel|spar"),
    ("ominous", r"dark|demon|evil|shadow|ominous|menac|glare|stare|kyuubi|nine.?tails|kurama|seal|curse|ghost|night|villain|betray"),
    ("triumphant", r"victory|wins?|win\b|triumph|proud|celebrat|pass(es|ed)?\b|success|hero|recogni|accept"),
    ("establishing", r"village|monument|view|panorama|overlook|sky|aerial|landscape|streets?|rooftops?"),
]
MOOD_EXTRA = [  # legacy mapper vocabulary kept alongside
    ("determined", r"determin|resolve|vow|declare|promise|never give|believe it|stand|rise|ready"),
    ("shock", r"shock|surpris|stun|startl|horrif|gasp|wide.?eye|reveal"),
    ("quiet", r"sleep|rest|alone|quiet|calm|sit|sits|waiting|thinking|study|read|library"),
    ("mysterious", r"mysterious|unknown|secret|hidden|mask|hide|hiding|sneak|stealth"),
]
CLOSE_RE = r"close.?up|face|portrait|eyes?\b|stare|glare|smile|grin|tears|crying|expression|reaction|look(s|ing)?\b|wide.?eyed"
WIDE_RE = r"village|panorama|overlook|monument|forest|view|aerial|army|crowd|streets|rooftops|landscape|skyline|gathering|assembl|group|\bteam\b|everyone"


def part1_episode_pages(api_all):
    """Titles of the original-series episode pages (links of 'List of Naruto Episodes')."""
    titles = set()
    try:
        for p in api_all({"action": "query", "titles": EPISODE_LIST, "prop": "links", "pllimit": "max", "plnamespace": "0", "redirects": "1"}):
            titles |= {l["title"] for l in p.get("links", [])}
    except Exception:
        pass
    return titles


def _text(title, caption=""):
    name = re.sub(r"^File:", "", title)
    name = re.sub(r"\.(png|jpe?g|webp|gif)$", "", name, flags=re.I)
    return f"{name} | {caption}".lower().replace("_", " ")


def derive(page="", title="", caption="", categories=(), kind="anime_still", width=0, height=0, usage=(), p1eps=frozenset()):
    """Naruto tags. Subject evidence: file title/caption first, then (only if silent) usage pages."""
    text = _text(title, caption)
    subs = [k for k in SUBJECT_KEYS if re.search(ALL_RE[k], text)]
    upages = [u.lower() for u in usage]
    if not [s for s in subs if s in CHAR_RE or s in ("forbidden_scroll", "crystal_ball")]:
        for u in upages:
            if u in PAGE_SUBJECT and PAGE_SUBJECT[u] not in subs: subs.append(PAGE_SUBJECT[u])
    if re.search(r"clones?\b|bunshin|thousand|narutos", text) and "naruto_clones" not in subs: subs.append("naruto_clones")
    if re.search(r"\bteam 7\b|\bteam seven\b|squad 7", text) or {"naruto", "sasuke", "sakura"} <= set(subs): subs.append("team7")
    if "kurama" in subs and re.search(r"\bfox\b", text) and not re.search(r"nine|kurama|kyuubi|demon fox", text): subs.remove("kurama")
    if "villagers" in subs and re.search(r"crowd", text) and not re.search(r"villag|konoha|leaf", text + " ".join(upages)): subs.remove("villagers")
    # era
    era = "unknown"
    ep_hits = [u for u in usage if u in p1eps]
    if BORUTO.search(text): era = "boruto"
    elif SHIPPUDEN.search(text): era = "shippuden"
    elif KID.search(text) and not re.search(r"academy|graduat", text): era = "kid"
    elif ep_hits: era = "part1"
    elif re.search(r"\bpart i\b|\bacademy\b|land of waves|chunin exams?|zabuza|\bhaku\b|forest of death|mizuki|iruka|konohamaru|ebisu|\bgato\b|survival exercise|bell test", text): era = "part1"
    time = None
    if re.search(r"\bnight\b|moon|stars?\b|midnight|evening", text): time = "night"
    elif re.search(r"dusk|sunset|twilight|sunrise|dawn", text): time = "dusk"
    elif re.search(r"\bday\b|morning|noon|afternoon|sunny", text): time = "day"
    moods = [m for m, p in MOODS if re.search(p, text)][:3]
    moods += [m for m, p in MOOD_EXTRA if re.search(p, text) and m not in moods][:2]
    if not moods: moods = ["establishing"] if (set(subs) & {"konoha_village", "hokage_monument"}) else ["quiet"]
    if "comedy" in moods and "comedic" not in moods: moods.append("comedic")
    if "action" in moods and "combat" not in moods: moods.append("combat")
    chars = [s for s in subs if s in CHAR_RE and s != "villagers"]
    loc = next((s for s in ("hokage_office", "archive", "ichiraku", "hokage_monument", "training_ground", "academy", "classroom", "naruto_apartment", "seal_cage",
                            "konoha_village") if s in subs), None)
    shot = "medium"
    if re.search(CLOSE_RE, text): shot = "closeup"
    elif re.search(WIDE_RE, text) or (loc and not chars) or "villagers" in subs: shot = "wide"
    elif "action" in moods: shot = "action"
    r = width / max(height, 1)
    return {"subjects": list(dict.fromkeys(subs)), "location": loc, "mood": list(dict.fromkeys(moods)), "shotType": shot,
            "aspectRatio": ("16:9" if 1.65 <= r < 2.0 else "4:3" if r < 1.65 else "21:9") if width and height else "16:9",
            "era": era, "time": time, "text_free": True}


def wanted(title, usage):
    """Is this file plausibly useful? (subject evidence in title or usage pages)."""
    if re.search("|".join(ALL_RE.values()), _text(title)): return True
    return any(u.lower() in PAGE_SUBJECT for u in usage)
