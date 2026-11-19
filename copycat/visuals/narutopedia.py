"""Narutopedia (naruto.fandom.com) discovery + tagging for the Naruto vault.

Narutopedia files are named descriptively ("Iruka protects naruto.png"), most anime screenshots sit in
Category:Fair use tv-screenshot / Category:1080p HD Images, and `prop=fileusage` tells which wiki pages use a file
(Iruka Umino, Hokage Residence, Scroll of Seals ...), which is the strongest subject/era signal we have.
"""
import re

SCREENSHOT_CATS = ["Category:Fair use tv-screenshot", "Category:1080p HD Images", "Category:Ultra HD Images", "Category:720p HD Images", "Category:Fair use film-screenshot"]
EPISODE_LIST = "List of Naruto Episodes"       # original series (Part I); Shippuden / Boruto have their own lists
MIN_W = 960

# extra rejects on top of imgutil.NAME_REJECT (this wiki's naming habits)
NAME_REJECT = re.compile(
    r"chapter \d|\bcover\b|\bvol(ume)?\b|box ?art|\bgame\b|\bnsun|\bstorm\b|ninja council|clash of|\bpsp\b|\bps[34]\b|\bwii\b|"
    r"\bcard\b|\bbanner\b|\bposter\b|\bwallpaper\b|\bartwork\b|illustration|\bfan\b|\bhandbook\b|"
    r"\bsilhouette\b|\bsymbol\b|\bsvg\b|\bsprite\b|\bchibi\b|\bthumbnail\b|\bfont\b|\bjump\b|\bkizuna\b|\bstats?\b|\bgraph|title card|\bopening\b|\bending\b|\bpreview\b|next episode|grand sports|festival|special report|\bshinden\b|\bhiden\b|\bgaiden\b|\bepisode \d+\b$|\bnaruto manga\b|\bblu-?ray\b|\bdvd\b|\bcd\b",
    re.I)

SHIPPUDEN = re.compile(
    r"shipp[uūû]+den|part ii|\bpain\b|\bnagato\b|\bobito\b|\bmadara\b|\bkaguya\b|\bsage mode|kurama mode|\bwar\b|"
    r"\balliance|\bedo\b|\btailed beast (bomb|ball)|\brasenshuriken|\brinnegan|\bmangekyo|\beternal|"
    r"\b(fifth|sixth|seventh) hokage|\bhokage naruto|\badult|\bsai\b|\byamato\b|"
    r"\bsusanoo|\bjuubi|\bten.?tails|\bbiju|\bbijuu|\btsuchikage|\braikage|\bmizukage|\bkillerbee|\bkiller b\b|"
    r"\bhagoromo|\bhamura|\bindra|\basura\b|\bgedo|\bzetsu\b|\bkonan\b|\bsix paths|\bmenma|\bnangi\b|\bkabuto.*(edo|sage)|\bhidan|\bkakuzu|\bdeidara|\bsasori|wedding|married|marriage|\bthe last\b|nakama|shinden|hiden\b|gaiden|\bdaughter\b|\bson\b|\bkurama (helps|writing)|parte ii\b|segunda parte|\bparte 2|periodo de cambios|per[ií]odo de transi|oscuro|negro\b|\bnegr[oa]\b|sombr[ií]o|dark naruto|modo (kurama|sabio|er[mn]it)|modo (bij|biju)|rasenshuriken|rasenshuriken|sennin m[oô]do|\bsage\b|jinch[uū]riki del|tailed beast|\bkcm\b|\bsm\b|kyuubi mode|nine.?tails mode|\bversion [12]\b|forma de (kurama|chakra)|jednoogoniasta",
    re.I)
BORUTO = re.compile(r"\bboruto|\bhimawari|\bsarada|\bmitsuki|\bkawaki|\bshikadai|\bchocho|\bmetal lee|\bseventh hokage|\bboro\b|\bishiki|\bmomoshiki|\bdaemon|\bnext generation|parte iii|tercera parte|terceira parte|per[ií]odo de cambios|periodo de cambios|\bboruto\b", re.I)
KID = re.compile(r"\b(child|children|young|kid|baby|infant|toddler|orphan|born|birth|first day|childhood|younger|as a boy|little)\b", re.I)

CHAR_RE = {
    "naruto": r"\bnaruto\b|\bnarutos\b",
    "iruka": r"\biruka\b|\bumino\b",
    "mizuki": r"\bmizuki\b",
    "hiruzen": r"hiruzen|third hokage|3rd hokage|tercer hokage|terceiro hokage|trzeci hokage|sandaime|\blord third\b|\bthe third\b(?! (exam|training|tailed|shinobi|great))",
    "kakashi": r"\bkakashi\b|\bhatake\b|copy ninja|copy-ninja",
    "sasuke": r"\bsasuke\b",
    "sakura": r"\bsakura\b",
    "kurama": r"(?<!yakumo )(?<!unkai )(?<!murakumo )\bkurama\b(?! clan)|nine.?tails?|kyuubi|kyūbi|nine-tailed|demon fox|\bfox\b",
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
    "obito": r"\bobito\b|masked man|\btobi\b|hombre enmascarado|homem mascarado",
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
    name = re.sub(r"^(?:(?:es|pt-br|pl|fr|de|it):)?(?:File|Archivo|Arquivo|Plik|Fichier|Datei):", "", title)
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
    series = "shippuden" if re.search(r"shipp[uūû]+den", low) else "boruto" if "boruto" in low else \
        "movie" if re.search(r"movie|film|the last|road to ninja|ova|special|gaiden|hiden|shinden", low) else "original" if re.search(r"naruto", low) else ""
    em = re.search(r"episode\s*(?:\[\[[^\]|]*\|)?\s*#?\s*(\d+)", low) or re.search(r"\bep\.?\s*(\d+)", low)
    if series == "original" and not em: series = ""      # no episode number = no proof it is the original series
    clean = lambda x: re.sub(r"\[\[(?:[^\]|]*\|)?([^\]]*)\]\]|'{2,3}|\{\{[^}]*\}\}", r"\1", x).strip()
    return {"desc": clean(field("Description")), "src": src[:80], "series": series, "episode": int(em.group(1)) if em else None,
            "chars": [clean(c).lower() for c in re.split(r",|;|&", clean(chars)) if clean(c)],
            "jutsu": [clean(c).lower() for c in re.split(r",|;", clean(field("Jutsu in image"))) if clean(c)]}


FLASH = re.compile(r"flashback|years? ago|\bacademy\b|\bgenin\b|team 7|graduat|memory|memories|remembers?\b|as a (child|kid)|younger", re.I)
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
    if re.search(r"scroll|pergamin|rollo\b|rolo\b", text) and {"naruto", "mizuki", "iruka"} & set(subs) and "forbidden_scroll" not in subs:
        subs.append("forbidden_scroll")             # stand-in: Narutopedia has no clean Scroll of Seals footage; any Part I scroll scene
    if "tora_cat" in subs and "tora_cat" not in known and not re.search(r"\btora\b", text): subs.remove("tora_cat")
    if "kurama" in subs and "kurama" not in known and re.search(r"\bfox\b", text) and not re.search(r"nine|kurama|kyuubi|demon fox", text): subs.remove("kurama")
    if "book" in subs and not re.search(r"\bbook\b|icha", text): subs.remove("book")
    if "villagers" in subs and re.search(r"crowd", text) and not re.search(r"villag|konoha|leaf", text): subs.remove("villagers")
    series, ep = meta.get("series", ""), meta.get("episode")
    era = "unknown"
    char_free = not meta.get("chars") and not [x for x in subs if x in CHAR_RE and x not in NONLOC]
    if series in ("lang", "lang_unsure"): char_free = not [x for x in subs if x in CHAR_RE and x not in NONLOC]
    if series == "boruto" or BORUTO.search(text): era = "boruto"
    elif char_free and series in ("shippuden", "original", "movie", "") and not SHIPPUDEN.search(text): era = "none"   # places/objects: era-agnostic
    elif series == "search": era = "none"                                      # char-free place/object frame from keyword search
    elif series == "lang": era = "none" if char_free else "part1"      # language-wiki history sections before the Part II heading
    elif series == "lang_unsure": era = "none" if char_free else "unknown"   # page without a recognisable Part II heading
    elif series == "original" and (ep or 0) <= 220: era = "part1"
    elif series == "original": era = "shippuden"
    elif series == "movie":      # only the three Part I era movies keep a Part I look
        era = "part1" if re.search(r"snow|gelel|crescent|ninja clash|stone of|guardians", (meta.get("src") or "").lower()) and not SHIPPUDEN.search(text) else "shippuden"
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
    nch = len(meta.get("chars") or []) or len(chars)
    shot = "medium"
    if re.search(CLOSE_RE, text) and nch <= 2: shot = "closeup"
    elif nch == 1 and not loc and "action" not in moods: shot = "closeup" if re.search(r"face|eyes|portrait|expression|smile|cry|tears|stare|glare|shock", text) else "medium"
    elif re.search(WIDE_RE, text) or (loc and not chars) or "villagers" in subs or nch >= 4 or "team7" in subs and nch >= 4: shot = "wide"
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


# --------------------------------------------------------------------------- language wikis (es / pt-br / pl)
# Character "Historia" pages are chronological; every file placed before the first Part II heading is Part I footage
# with a caption. File names and captions are Spanish/Portuguese/Polish, so a few extra keywords are folded in.
LANG_WIKIS = {
    "es": {"file_ns": "Archivo", "subpages": ["{n}/Historia", "{n}"]},
    "pt-br": {"file_ns": "Arquivo", "subpages": ["{n}"]},
    "pl": {"file_ns": "Plik", "subpages": ["{n}/Historia", "{n}"]},
    "fr": {"file_ns": "Fichier", "subpages": ["{n}"]},
    "de": {"file_ns": "Datei", "subpages": ["{n}"]},
    "it": {"file_ns": "File", "subpages": ["{n}"]},
}
PART2_HEAD = re.compile(r"partie ii\b|deuxi[eè]me partie|teil ii\b|zweiter teil|seconda parte|parte seconda|shipp[uû]den|segunda parte|parte ii\b|parte 2|segunda temporada|shipp[uūû]+den|druga część|=\s*''?naruto:? shipp|interl[uú]dio|per[ií]odo de cambios|pierwsza część.*shipp|"
                        r"cuarta guerra|quarta guerra|czwarta światowa|akatsuki|ataque de pain|atak paina|misi[oó]n del rescate del kazekage|miss[aã]o de resgate do kazekage", re.I)
PART1_HEAD = re.compile(r"premi[eè]re partie|erster teil|prima parte|pr[oô]logue|prolog\b|pays des vagues|land der wellen|paese delle onde|primera parte|primeira parte|pierwsza część|prólogo|prolog|pa[ií]s de las olas|pa[ií]s das ondas|kraj fal|ex[aá]menes ch|exames ch|egzamin", re.I)
LANG_CHARS = ["Naruto Uzumaki", "Iruka Umino", "Mizuki", "Hiruzen Sarutobi", "Kakashi Hatake", "Sasuke Uchiha", "Sakura Haruno", "Kurama", "Minato Namikaze",
              "Kushina Uzumaki", "Tobirama Senju", "Danzō Shimura", "Konohamaru Sarutobi", "Zabuza Momochi", "Haku", "Tazuna", "Inari", "Gatō", "Ibiki Morino",
              "Anko Mitarashi", "Orochimaru", "Kabuto Yakushi", "Gaara", "Temari", "Kankurō", "Jiraiya", "Shikamaru Nara", "Neji Hyūga", "Rock Lee", "Obito Uchiha",
              "Rin Nohara", "Itachi Uchiha", "Teuchi", "Ayame", "Enma", "Tsunade", "Hinata Hyūga", "Choji Akimichi", "Ino Yamanaka", "Kiba Inuzuka", "Shino Aburame",
              "Tenten", "Might Guy", "Asuma Sarutobi", "Kurenai Yūhi", "Ebisu", "Shizune", "Gozu", "Meizu", "Yamato"]
LANG_PLACES = ["Konohagakure", "Aldea Oculta de la Hoja", "Vila Oculta da Folha", "País de las Olas", "País das Ondas", "Kraj Fal", "Academia Ninja", "Academia Ninja de Konoha",
               "Ichiraku Ramen", "Monumento a los Hokage", "Monumento Hokage", "Monumento aos Hokage", "Edificio del Hokage", "Torre do Hokage", "Bosque de la Muerte", "Floresta da Morte",
               "Exámenes Chūnin", "Exames Chuunin", "Egzamin na chūnina", "Puente Tenchi", "Gran Puente Naruto", "Grande Ponte Naruto", "Rollo de los Sellos", "Pergaminho dos Selos",
               "Técnica de Clones de Sombra", "Técnica de Clones das Sombras", "Técnica de Multiclones de Sombra", "Jutsu de Clones das Sombras Múltiplos", "Gran Bola de Fuego",
               "Sellado de los Ocho Trigramas", "Selamento dos Oito Trigramas", "Distrito Uchiha", "Clan Uchiha", "Entrenamiento de Cascabeles", "Prueba de los Cascabeles",
               "Prueba de Supervivencia", "Teste de Sobrevivência", "Ninja Anbu", "Anbu", "Raíz", "Raiz", "Bola de Cristal", "Jutsu de Telescopio", "Técnica do Telescópio"]
LANG_RE_EXTRA = {
    "forbidden_scroll": r"rollo prohibido|pergamino prohibido|rollo de los sellos|pergaminho (dos selos|proibido)|pergamino de los sellos|rollo secreto|pergaminho secreto",
    "paperwork": r"informes?\b|expedientes?\b|relat[oó]rios?|papeleo|papelada|documentos?\b",
    "document": r"documentos?\b|papeles|pergaminhos?\b|pergaminos?\b|rollos?\b|archivos?\b|arquivos?\b",
    "crystal_ball": r"bola de cristal|esfera de cristal|telescopio|telesc[oó]pio",
    "bells": r"cascabeles|campanillas|cascav[eé]is|\bsinos\b|campanas",
    "fireball": r"bola de fuego|bola de fogo|katon",
    "headband": r"protector (de )?(frente|frontal)|bandana|protetor (de )?testa|banda frontal",
    "hokage_office": r"oficina del hokage|despacho|escrit[oó]rio do hokage|edificio del hokage|torre (do|del) hokage|residencia del hokage",
    "hokage_monument": r"monumento (a los |aos |del )?hokage|rostros? (de los |dos )?hokage",
    "archive": r"biblioteca|archivo|arquivo|archivos",
    "classroom": r"\baula\b|sala de aula|sal[oó]n de clases|\bclase\b",
    "academy": r"academia",
    "night_sky": r"noche|noite|\bluna\b|\blua\b|estrellas|estrelas",
    "sunrise": r"amanecer|atardecer|amanhecer|puesta de sol|p[oô]r do sol|anochecer",
    "konoha_village": r"aldea|aldeia|\bwioska\b",
    "bridge": r"puente|\bponte\b",
    "mist": r"niebla|n[eé]voa|neblina|\bmg[łl]a\b",
    "forest": r"bosque|floresta",
    "ramen": r"\bramen\b",
    "memorial_stone": r"piedra conmemorativa|monumento conmemorativo|l[aá]pide|monumento aos mortos",
    "naruto_clones": r"clones?\b|multiclones|clon(es)? de sombra|clones? das sombras|klon",
    "forest_of_death": r"bosque de la muerte|floresta da morte",
    "ichiraku": r"ichiraku",
    "villagers": r"aldeanos|aldeões|mieszka[nń]cy|habitantes|multitud|multid[aã]o",
}
for _k, _v in LANG_RE_EXTRA.items():
    ALL_RE[_k] = (ALL_RE[_k] + "|" if _k in ALL_RE else "") + _v
    if _k in CHAR_RE: CHAR_RE[_k] = ALL_RE[_k]
    elif _k in PLACE_RE: PLACE_RE[_k] = ALL_RE[_k]
    else: OBJ_RE[_k] = ALL_RE[_k]
PLACE_RE.setdefault("library", r"biblioteca|library")
ALL_RE.setdefault("library", PLACE_RE["library"])
SUBJECT_KEYS = list(CHAR_RE) + list(OBJ_RE) + list(PLACE_RE)


def history_images(wikitext):
    """[(file title, caption, section)] for files placed in Part I sections (before the first Part II heading)."""
    return history_images_ex(wikitext)[0]


def history_images_ex(wikitext):
    """(items, stopped): stopped = a Part II heading was found, i.e. the cut is trustworthy."""
    out, sect, stop = [], "", False
    parts = re.split(r"\n(={2,5}[^=\n]+={2,5})", "\n" + wikitext)
    for i, chunk in enumerate(parts):
        if i % 2 == 1:
            head = re.sub(r"[=\[\]']", "", chunk).strip()
            if PART2_HEAD.search(head) and not PART1_HEAD.search(head): stop = True
            sect = head
            continue
        if stop: break
        for m in re.finditer(r"\[\[(?:Archivo|File|Arquivo|Plik|Imagen|Image|Fichier|Datei):([^|\]\n]+)((?:\|(?:[^\[\]]|\[\[[^\]]*\]\])*)?)\]\]", chunk, re.I):
            cap = re.split(r"\|", m.group(2))[-1] if m.group(2) else ""
            cap = re.sub(r"\[\[(?:[^\]|]*\|)?([^\]]*)\]\]|'{2,3}|<[^>]+>", r"\1", cap).strip()
            out.append((m.group(1).strip(), "" if re.fullmatch(r"(thumb|miniatura|miniaturadaimagem|left|right|center|\d+px)", cap, re.I) else cap, sect))
        for blk in re.findall(r"<gallery[^>]*>(.*?)</gallery>", chunk, re.S | re.I):
            for line in blk.splitlines():
                g = re.match(r"\s*(?:Archivo|File|Arquivo|Plik|Imagen|Image|Fichier|Datei):([^|\n]+)\|?(.*)", line.strip(), re.I)
                if g: out.append((g.group(1).strip(), re.sub(r"\[\[|\]\]|'{2,3}", "", g.group(2)).strip(), sect))
    return out, stop


# --------------------------------------------------------------------------- keyword search for char-free place/object footage
# Place/object frames (archive, desks, scrolls, night sky ...) have no era, so every wiki and every series may contribute.
SEARCH_TERMS = {
    "": ["library", "archive", "records", "documents", "files", "paperwork", "desk", "scroll", "scrolls", "ink", "brush", "letter", "mission office", "Hokage office",
         "ramen", "Ichiraku", "apartment", "bedroom", "training ground", "stumps", "memorial", "night", "moon", "sunrise", "sunset", "dawn", "rooftop", "bridge", "mist",
         "shelves", "bookshelf", "crystal ball", "classroom", "academy", "Hokage monument", "village", "street", "forest", "kunai", "headband", "bells", "ledger", "cat"],
    "es": ["biblioteca", "documentos", "informe", "pergamino", "escritorio", "oficina", "carta", "tinta", "pincel", "apartamento", "habitación", "campo de entrenamiento",
           "tocones", "piedra conmemorativa", "noche", "luna", "amanecer", "atardecer", "puente", "niebla", "estantería", "aula", "academia", "monumento", "aldea", "calle", "bosque", "gato"],
    "pt-br": ["biblioteca", "arquivo", "documentos", "relatório", "pergaminho", "escrivaninha", "escritório", "carta", "tinta", "pincel", "apartamento", "quarto",
              "campo de treinamento", "pedra memorial", "noite", "lua", "amanhecer", "ponte", "névoa", "estante", "sala de aula", "academia", "monumento", "vila", "rua", "floresta", "gato"],
    "pl": ["biblioteka", "dokumenty", "zwój", "biuro", "list", "pole treningowe", "noc", "księżyc", "most", "mgła", "akademia", "wioska", "las", "kot"],
    "fr": ["bibliothèque", "documents", "parchemin", "bureau", "lettre", "terrain d'entraînement", "nuit", "lune", "pont", "brume", "académie", "village", "forêt", "chat"],
    "de": ["Bibliothek", "Dokumente", "Schriftrolle", "Büro", "Brief", "Trainingsplatz", "Nacht", "Mond", "Brücke", "Nebel", "Akademie", "Dorf", "Wald", "Katze"],
    "it": ["biblioteca", "documenti", "pergamena", "ufficio", "lettera", "campo di addestramento", "notte", "luna", "ponte", "nebbia", "accademia", "villaggio", "foresta", "gatto"],
}
SEARCH_FILE_NS = {"": "File", "es": "Archivo", "pt-br": "Arquivo", "pl": "Plik", "fr": "Fichier", "de": "Datei", "it": "File"}
