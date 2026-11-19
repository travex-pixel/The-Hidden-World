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
    r"shipp[uū]den|part ii|\bpain\b|\bnagato\b|\bobito\b|\bmadara\b|\bkaguya\b|\bsage mode|kurama mode|\bwar\b|"
    r"\balliance|\bedo\b|\btailed beast (bomb|ball)|\brasenshuriken|\brinnegan|\bmangekyo|\beternal|"
    r"\b(fifth|sixth|seventh) hokage|\bhokage naruto|\badult|\bsai\b|\byamato\b|"
    r"\bsusanoo|\bjuubi|\bten.?tails|\bbiju|\bbijuu|\btsuchikage|\braikage|\bmizukage|\bkillerbee|\bkiller b\b|"
    r"\bhagoromo|\bhamura|\bindra|\basura\b|\bgedo|\bzetsu\b|\bkonan\b|\bsix paths|\bmenma|\bnangi\b|\bkabuto.*(edo|sage)|\bhidan|\bkakuzu|\bdeidara|\bsasori",
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
    "konohamaru": r"konohamaru",
    "tora_cat": r"\btora\b|daimyo'?s? wife'?s? cat|lost cat|\bcat\b",
    "zabuza": r"zabuza|demon of the hidden mist|executioner'?s? blade|kubikiribocho",
    "haku": r"\bhaku\b",
    "tazuna": r"tazuna",
    "inari": r"\binari\b",
    "gato": r"\bgat[oō]\b",
    "demon_brothers": r"demon brothers|\bg[oō]zu\b|\bmeizu\b",
    "ibiki": r"ibiki",
    "anko": r"\banko\b",
    "orochimaru": r"orochimaru",
    "kabuto": r"kabuto",
    "gaara": r"\bgaara\b",
    "temari": r"temari",
    "kankuro": r"kankur[oō]",
    "kazekage": r"kazekage",
    "jiraiya": r"jiraiya",
    "shikamaru": r"shikamaru",
    "neji": r"\bneji\b",
    "rock_lee": r"rock lee|\blee\b",
    "obito": r"\bobito\b|masked man|tobi\b",
    "rin": r"\brin\b|\bnohara\b",
    "young_kakashi": r"young kakashi|kakashi.*(child|young|academy|team minato)",
    "itachi": r"\bitachi\b",
    "root": r"\broot\b|foundation",
    "enma": r"\benma\b|monkey king",
    "genin_crowd": r"genin|rookies|examinees|exam participants|candidates|participants",
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
    "letter": r"\bletters?\b|\bmail\b|\bmessage\b|\bnote\b",
    "ink_brush": r"\bbrush\b|\bink\b|calligraph|signature|signs?\b|\bseal stamp",
    "ledger": r"ledger|account book|\bbooks?\b.*(gato|shipping)|payroll|\bpay\b",
    "ice_mirrors": r"ice mirrors?|demonic ice|crystal ice mirrors|mirror",
    "kunai": r"\bkunai\b",
    "bingo_book": r"bingo book",
    "coffins": r"coffins?",
    "exam_paper": r"exam(ination)? (paper|sheet|test|questions?)|written (exam|test)|answer sheet|cheating|\btest paper",
    "info_cards": r"info(rmation)? cards?|ninja info|\bcards?\b",
    "water_prison": r"water prison",
    "lightning_blade": r"lightning blade|chidori|raikiri",
    "book": r"\bbook\b|icha icha|\bread(s|ing)?\b",
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
    "konoha_village": r"konoha|hidden leaf|leaf village|konohagakure|\bvillage\b|\bstreets?\b",
    "memorial_stone": r"memorial stone|cenotaph|memorial|\bgrave\b",
    "bridge": r"\bbridge\b",
    "mist": r"\bmist\b|\bfog\b",
    "land_of_waves": r"land of waves|wave country|\bwaves?\b",
    "tazuna_house": r"tazuna'?s? (house|home)|\binari'?s? (house|home)|dining",
    "gato_office": r"gato'?s? (office|building|company|mansion|base)|gato shipping",
    "exam_hall": r"exam(ination)? (hall|room|venue)|room 301|written exam|first exam|first test",
    "forest_of_death": r"forest of death|training ground 44|\btower\b",
    "arena": r"\barena\b|stadium|preliminar|\bfinals?\b|spectator",
    "barrier": r"barrier|four violet flames|purple flames|\bflames?\b",
    "uchiha_district": r"uchiha (district|clan|compound|massacre)|\bmassacre\b",
    "hospital": r"hospital|\bward\b|\bpatient\b|infirmary",
    "mission_desk": r"mission (desk|assignment|counter|office|room|request)|assignment desk|d.?rank",
    "rooftop": r"rooftops?|\broof\b",
    "forest": r"\bforest\b|\bwoods\b|\btrees?\b|\bjungle\b",
}

SUBJECT_KEYS = list(CHAR_RE) + list(OBJ_RE) + list(PLACE_RE)
ALL_RE = {**CHAR_RE, **OBJ_RE, **PLACE_RE}
NAME_SUBJECT = {  # "Characters in image" names -> subject
    "naruto uzumaki": "naruto", "iruka umino": "iruka", "mizuki": "mizuki", "hiruzen sarutobi": "hiruzen", "kakashi hatake": "kakashi",
    "sasuke uchiha": "sasuke", "sakura haruno": "sakura", "kurama": "kurama", "nine-tails": "kurama", "minato namikaze": "minato",
    "kushina uzumaki": "kushina", "tobirama senju": "tobirama", "danzō shimura": "danzo", "danzo shimura": "danzo", "teuchi": "teuchi",
    "ayame": "teuchi", "konohamaru sarutobi": "konohamaru", "tora": "tora_cat", "zabuza momochi": "zabuza", "haku": "haku", "tazuna": "tazuna",
    "inari": "inari", "gatō": "gato", "gato": "gato", "gōzu": "demon_brothers", "meizu": "demon_brothers", "ibiki morino": "ibiki",
    "anko mitarashi": "anko", "orochimaru": "orochimaru", "kabuto yakushi": "kabuto", "gaara": "gaara", "temari": "temari", "kankurō": "kankuro",
    "kankuro": "kankuro", "fourth kazekage": "kazekage", "jiraiya": "jiraiya", "shikamaru nara": "shikamaru", "neji hyūga": "neji", "neji hyuga": "neji",
    "rock lee": "rock_lee", "obito uchiha": "obito", "rin nohara": "rin", "itachi uchiha": "itachi", "enma": "enma", "tsunade": None,
}
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


# subject -> Narutopedia pages whose image lists give char-free place/object/jutsu footage (page images -> subject)
SUBJECT_PAGES = {
    "konoha_village": ["Konohagakure", "Konoha Gates", "Hidden Leaf Village"],
    "hokage_monument": ["Hokage Monument", "Hokage Rock"],
    "hokage_office": ["Hokage Residence", "Hokage's Office", "Hokage", "Hokage Building", "Hokage Mansion", "Kage Summit Room"],
    "academy": ["Ninja Academy", "Academy Graduation Exam", "Academy Student"],
    "classroom": ["Ninja Academy"],
    "ichiraku": ["Ichiraku Ramen", "Teuchi", "Ayame"],
    "ramen": ["Ichiraku Ramen", "Ramen"],
    "training_ground": ["Training Ground", "Third Training Ground", "Training Grounds"],
    "memorial_stone": ["Memorial Stone", "Memorial Stone (Konoha)", "Cenotaph"],
    "land_of_waves": ["Land of Waves", "Prologue — Land of Waves", "Wave Country", "Land of Waves arc"],
    "bridge": ["Great Naruto Bridge", "Tazuna's Bridge", "Land of Waves"],
    "mist": ["Hidden Mist Technique", "Hidden Mist Technique (technique)", "Kirigakure"],
    "forest_of_death": ["Forest of Death", "Training Ground 44", "Second Exam"],
    "exam_hall": ["Chūnin Exams", "First Exam", "Chunin Exams", "Ibiki Morino"],
    "arena": ["Konoha Stadium", "Chūnin Exams Finals", "Preliminaries", "Konoha Arena"],
    "barrier": ["Four Violet Flames Formation", "Four Violet Flames", "Konoha Crush", "Invasion of Konoha"],
    "uchiha_district": ["Uchiha District", "Uchiha Clan", "Uchiha Clan Massacre"],
    "hospital": ["Konoha Hospital", "Hospital"],
    "mission_desk": ["Mission Assignment Desk", "Mission Request", "Mission Ranking", "Tora"],
    "forbidden_scroll": ["Scroll of Seals", "Forbidden Scroll"],
    "crystal_ball": ["Telescope Technique", "Crystal Ball", "Crystal Ball (tool)"],
    "naruto_clones": ["Shadow Clone Technique", "Multiple Shadow Clone Technique", "Shadow Clone Technique (technique)", "Mass Shadow Clone Technique"],
    "seal_mark": ["Eight Trigrams Sealing Style", "Evil Sealing Method", "Eight Trigrams Seal", "Fūinjutsu", "Five Elements Seal", "Seal"],
    "seal_cage": ["Kurama", "Seal Room", "Eight Trigrams Seal", "Mindscape", "Nine-Tails"],
    "fireball": ["Great Fireball Technique", "Fire Release: Great Fireball Technique", "Fire Release"],
    "shuriken": ["Windmill Shuriken", "Demon Wind Shuriken", "Shuriken", "Shuriken Shadow Clone Technique", "Shuriken"],
    "kunai": ["Kunai"],
    "bells": ["Survival Exercise", "Bell Test", "Team 7", "Survival Test"],
    "headband": ["Forehead Protector", "Hitai-ate", "Forehead protector"],
    "bingo_book": ["Bingo Book"],
    "ice_mirrors": ["Demonic Ice Mirrors", "Demonic Mirroring Ice Crystals", "Haku"],
    "water_prison": ["Water Release: Water Prison Technique", "Water Prison Technique"],
    "lightning_blade": ["Lightning Blade", "Chidori"],
    "coffins": ["Coffin", "Sealed Coffins"],
    "info_cards": ["Ninja Information Card", "Ninja Info Card", "Kabuto Yakushi"],
    "exam_paper": ["Written Exam", "First Exam", "Chūnin Exams"],
    "tora_cat": ["Tora"],
    "anbu": ["Anbu", "ANBU Black Ops"],
    "root": ["Root", "Danzō Shimura"],
    "kazekage": ["Fourth Kazekage"],
    "enma": ["Enma"],
    "book": ["Icha Icha", "Icha Icha Paradise"],
    "letter": ["Letter", "Kazekage Letter", "Mail"],
    "ink_brush": ["Calligraphy", "Brush"],
    "ledger": ["Ledger", "Gatō Company", "Gato Company"],
    "paperwork": ["Paperwork", "Mission Request", "Mission Report"],
    "document": ["Mission Report", "Mission Scroll", "Scroll"],
    "library": ["Konoha Library", "Library", "Archive", "Konoha Archives", "Hokage Library"],
    "villagers": ["Villager", "Villagers"],
    "naruto_apartment": ["Naruto's Apartment", "Naruto Uzumaki's apartment"],
    "tazuna_house": ["Tazuna's House"],
    "gato_office": ["Gatō Company", "Gato's Building"],
    "rooftop": ["Konohagakure"],
    "forest_night": ["Forest of Death"],
    "night_sky": ["Moon", "Full Moon"],
    "sunrise": ["Sunrise"],
}


def part1_episode_pages(api):
    """Titles of the original-series (Part I) episode pages: section 2 of 'List of Animated Media'.
    `api` is harvester.api (cached). Returned in list order so index+1 = episode number."""
    d = api({"action": "parse", "page": "List of Animated Media", "section": "2", "prop": "links"})
    return [l["title"] for l in d.get("parse", {}).get("links", []) if l.get("ns") == 0 and l.get("exists", True)]


def _text(title, caption=""):
    name = re.sub(r"^File:", "", title)
    name = re.sub(r"\.(png|jpe?g|webp|gif)$", "", name, flags=re.I)
    return f"{name} | {caption}".lower().replace("_", " ")


def parse_meta(wikitext):
    """File-page wikitext -> {desc, series, episode, chars[], jutsu[]} (Narutopedia fair-use template)."""
    def field(*names):
        for n in names:
            m = re.search(r"\|\s*" + n + r"\s*=\s*(.*)", wikitext, re.I)
            if m: return m.group(1).strip()
        return ""
    src = field("Source")
    m = re.search(r"\{\{Characters in image\|([^}]*)\}\}", wikitext, re.I)
    chars = (m.group(1) if m else field("Characters in image", "Characters"))
    low = src.lower()
    series = "shippuden" if re.search(r"shipp[uū]den", low) else "boruto" if "boruto" in low else \
        "movie" if re.search(r"movie|film|the last|road to ninja|ova", low) else "original" if re.search(r"naruto", low) else ""
    em = re.search(r"episode\s*#?\s*(\d+)", low)
    clean = lambda x: re.sub(r"\[\[(?:[^\]|]*\|)?([^\]]*)\]\]|'{2,3}|\{\{[^}]*\}\}", r"\1", x).strip()
    return {"desc": clean(field("Description")), "series": series, "episode": int(em.group(1)) if em else None,
            "chars": [clean(c).lower() for c in re.split(r",|;|&", clean(chars)) if clean(c)],
            "jutsu": [clean(c).lower() for c in re.split(r",|;", clean(field("Jutsu in image"))) if clean(c)]}


FLASH = re.compile(r"flashback|years? ago|\bacademy\b|\bfirst\b|young|child|\bkid\b|genin|team 7|graduat|origin|\bpast\b|memory|memories|remember", re.I)
NONLOC = ("villagers", "genin_crowd")
# characters who, in Shippuden-sourced screenshots, mostly appear in Part I flashbacks (era left "unknown" -> verified on sheets)
FLASHCHARS = {"mizuki", "zabuza", "haku", "kushina", "minato", "tobirama", "gato", "demon_brothers", "tazuna", "inari", "obito", "rin", "young_kakashi", "iruka", "hiruzen"}


def derive(page="", title="", caption="", categories=(), kind="anime_still", width=0, height=0, usage=(), meta=None):
    """Naruto tags. Characters come from the file page's 'Characters in image' when known, else from the title."""
    meta = meta or {}
    desc = meta.get("desc") or caption or ""
    text = _text(title, desc + " " + " ".join(meta.get("jutsu", [])))
    known = [NAME_SUBJECT.get(c) for c in meta.get("chars", [])]
    has_meta = any(known)
    subs = [k for k in SUBJECT_KEYS if re.search(ALL_RE[k], text) and not (k in CHAR_RE and has_meta and k not in ("villagers", "anbu", "root", "genin_crowd"))]
    for sj in known:
        if sj and sj not in subs: subs.append(sj)
    for sj in meta.get("pages", []):        # subject lists derived from Narutopedia page image lists
        if sj not in CHAR_RE or not has_meta:
            if sj not in subs: subs.append(sj)
    if re.search(r"clones?\b|bunshin|thousand|narutos", text) and "naruto_clones" not in subs: subs.append("naruto_clones")
    if re.search(r"\bteam 7\b|\bteam seven\b|squad 7", text) or {"naruto", "sasuke", "sakura"} <= set(subs): subs.append("team7")
    if "tora_cat" in subs and "tora_cat" not in known and not re.search(r"\btora\b", text): subs.remove("tora_cat")
    if "kurama" in subs and "kurama" not in known and re.search(r"\bfox\b", text) and not re.search(r"nine|kurama|kyuubi|demon fox", text): subs.remove("kurama")
    if "book" in subs and not re.search(r"\bbook\b|icha", text): subs.remove("book")
    if "villagers" in subs and re.search(r"crowd", text) and not re.search(r"villag|konoha|leaf", text): subs.remove("villagers")
    series, ep = meta.get("series", ""), meta.get("episode")
    era = "unknown"
    char_free = not meta.get("chars") and not [x for x in subs if x in CHAR_RE and x not in NONLOC]
    if series == "boruto" or BORUTO.search(text): era = "boruto"
    elif char_free and series in ("shippuden", "original", "movie", "") and not SHIPPUDEN.search(text): era = "none"   # places/objects: era-agnostic
    elif series == "original" or (series == "movie" and not SHIPPUDEN.search(text)): era = "part1"
    elif series == "shippuden":
        if SHIPPUDEN.search(text): era = "shippuden"
        elif FLASH.search(desc): era = "part1"
        else: era = "unknown" if FLASHCHARS & set(subs) else "shippuden"
    elif SHIPPUDEN.search(text): era = "shippuden"
    elif re.search(r"land of waves|chunin exams?|zabuza|\bhaku\b|forest of death|mizuki|iruka|konohamaru|survival exercise|bell test|\bacademy\b", text): era = "part1"
    if era == "part1" and re.search(r"\b(baby|infant|toddler|newborn|orphan|childhood|as a (small )?child|four years old|born|birth)\b", text) and not re.search(r"academy|graduat|genin|team 7", text): era = "kid"
    young_k = "kakashi" in subs and (re.search(r"young kakashi|kakashi.*(child|young|academy)|as a child", text) or ({"obito", "rin"} & set(subs) and re.search(r"team minato|flashback|young|child|academy", text)))
    if young_k:
        subs = [x for x in subs if x != "kakashi"] + ["young_kakashi"]
        era = "kid" if era == "part1" else era
    time = None
    if re.search(r"\bnight\b|moon|stars?\b|midnight|evening", text): time = "night"
    elif re.search(r"dusk|sunset|twilight|sunrise|dawn", text): time = "dusk"
    elif re.search(r"\bday\b|morning|noon|afternoon|sunny", text): time = "day"
    if "forest" in subs and time == "night": subs.append("forest_night")
    moods = [m for m, p in MOODS if re.search(p, text)][:3]
    moods += [m for m, p in MOOD_EXTRA if re.search(p, text) and m not in moods][:2]
    if not moods: moods = ["establishing"] if (set(subs) & {"konoha_village", "hokage_monument"}) else ["quiet"]
    if "comedy" in moods and "comedic" not in moods: moods.append("comedic")
    if "action" in moods and "combat" not in moods: moods.append("combat")
    chars = [x for x in subs if x in CHAR_RE and x not in NONLOC]
    loc = next((x for x in ("hokage_office", "archive", "ichiraku", "hokage_monument", "training_ground", "academy", "classroom", "naruto_apartment", "seal_cage",
                            "memorial_stone", "bridge", "mist", "tazuna_house", "gato_office", "exam_hall", "forest_of_death", "arena", "hospital", "mission_desk",
                            "uchiha_district", "land_of_waves", "konoha_village") if x in subs), None)
    shot = "medium"
    if re.search(CLOSE_RE, text) and len(chars) <= 2: shot = "closeup"
    elif re.search(WIDE_RE, text) or (loc and not chars) or "villagers" in subs or len(chars) >= 4: shot = "wide"
    elif "action" in moods: shot = "action"
    r = width / max(height, 1)
    out = {"subjects": list(dict.fromkeys(subs)), "location": loc, "mood": list(dict.fromkeys(moods)), "shotType": shot,
           "aspectRatio": ("16:9" if 1.65 <= r < 2.0 else "4:3" if r < 1.65 else "21:9") if width and height else "16:9",
           "era": era, "time": time, "text_free": True, "series": series or "unknown"}
    if ep: out["src_episode"] = ep
    return out


def wanted(title, meta):
    """Plausibly useful? Needs a known subject, and not a later-era source."""
    if meta.get("series") == "boruto": return False
    t = _text(title, meta.get("desc", ""))
    if meta.get("series") == "shippuden" and not FLASH.search(meta.get("desc", "")):
        names = {NAME_SUBJECT.get(c) for c in meta.get("chars", [])}
        place_obj = not meta.get("chars") and (meta.get("pages") or re.search("|".join(list(PLACE_RE.values()) + list(OBJ_RE.values())), t))
        if not (FLASHCHARS & names or place_obj) or SHIPPUDEN.search(t): return False
    if meta.get("pages"): return True
    if any(NAME_SUBJECT.get(c) for c in meta.get("chars", [])): return True
    return bool(re.search("|".join(ALL_RE.values()), t))
