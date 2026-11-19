"""Keyword/alias tagger mapping wiki page + file title + caption onto the CONTRACT subject vocabulary."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CURATION = ROOT / "copycat/projects/bc-whatif-ep01/curation.json"

# subject -> regexes (matched on lowercased "title | caption | page")
ALIASES = {
    "liebe": [r"\bliebe\b", r"devil form"],
    "licita": [r"\blicita\b"],
    "five_leaf_grimoire": [r"five.?leaf", r"asta'?s? grimoire", r"asta grimoire", r"grimoire of asta"],
    "four_leaf_grimoire": [r"four.?leaf", r"yuno'?s? grimoire", r"yuno grimoire", r"yuno receives his grimoire"],
    "demon_slayer_sword": [r"demon.?slayer", r"asta'?s? sword", r"anti.?magic sword"],
    "anti_magic": [r"anti.?magic"],
    "father_orsi": [r"\borsi\b", r"father orsi"],
    "sister_lily": [r"lily aquaria", r"sister lily", r"\blily\b", r"punished by the sister"],
    "revchi": [r"revchi"],
    "yami": [r"\byami\b", r"sukehiro"],
    "noelle": [r"noelle"],
    "magna": [r"\bmagna\b"],
    "luck": [r"\bluck\b"],
    "vanessa": [r"vanessa"],
    "finral": [r"finral"],
    "julius": [r"julius", r"wizard king"],
    "william_vangeance": [r"vangeance", r"william"],
    "patolli": [r"patolli"],
    "licht": [r"\blicht\b"],
    "sylph": [r"sylph", r"\bbell\b"],
    "dark_triad": [r"dark triad", r"\bdante\b", r"zenon"],
    "lucifero": [r"lucifero"],
    "lucius": [r"lucius"],
    "magic_knights": [r"magic knights", r"captains"],
    "black_bulls": [r"black bulls?\b"],
    "golden_dawn": [r"golden dawn"],
    "crowd": [r"crowd", r"villagers", r"spectators", r"citizens", r"15-year-olds"],
    "hage_village": [r"\bhage\b"],
    "hage_church": [r"church", r"orphanage"],
    "demon_skull": [r"skull", r"first wizard king", r"statue"],
    "grimoire_tower": [r"grimoire tower", r"acceptance ceremony", r"receives? (his|their|her)? ?grimoire", r"receive their grimoire"],
    "royal_capital": [r"royal capital", r"\bcapital\b", r"clover kingdom"],
    "exam_arena": [r"\bexam", r"arena", r"selection"],
    "black_bulls_hideout": [r"hideout", r"headquarters", r"black bull hq", r"\bbase\b", r"\bhq\b"],
    "dungeon": [r"dungeon"],
    "mindscape": [r"mindscape", r"\bmind\b", r"\bdream\b"],
    "night_sky": [r"night sky", r"\bstars\b", r"\bmoon\b"],
}
BLACK = [r"black asta", r"black form", r"devil union", r"demon form", r"true unite", r"\bunite\b", r"devil.?union", r"demon.?union"]
YOUNG = r"\b(infants?|child|children|young|kid|kids|baby|orphan|little|infancy)\b|as a child"
CAT_SUBJECT = {  # "Images of X" category -> subject (only used when the title yields nothing)
    "asta": "asta", "yuno": "yuno", "liebe": "liebe", "licita": "licita", "orsi orfai": "father_orsi",
    "lily aquaria": "sister_lily", "revchi salik": "revchi", "yami sukehiro": "yami", "noelle silva": "noelle",
    "magna swing": "magna", "luck voltia": "luck", "vanessa enoteca": "vanessa", "finral roulacase": "finral",
    "julius novachrono": "julius", "william vangeance": "william_vangeance", "patolli": "patolli", "licht": "licht",
    "lucifero": "lucifero", "lucius zogratis": "lucius", "dante zogratis": "dark_triad", "zenon zogratis": "dark_triad",
}
LOCATIONS = ["hage_village", "hage_church", "grimoire_tower", "royal_capital", "exam_arena", "black_bulls_hideout", "dungeon", "mindscape"]
MOODS = [
    ("combat", r"\bvs\b|attack|slash|fight|battle|clash|charge|cut |slay|defeat|decapitat|blocks?|strike"),
    ("emotional", r"cry|tears|promise|hug|farewell|reunit|vow|shake hands|heals|proposal|crush"),
    ("determined", r"vow|declare|resolve|determin|ascension|aim for the top|prepared|without magic power"),
    ("shock", r"shock|surpris|stunned|horrif|audience"),
    ("ominous", r"devil|demon|dark|chains|binds|ambush|skull|attacked by|lucifero|punished"),
    ("triumphant", r"defeat|victory|celebrat|wins|ascension|feast|royal knight|wizard king"),
    ("quiet", r"sleep|rest|alone|quiet|infant|village|church|orphanage"),
    ("comedic", r"feast|persuade with food|first salary|entertain"),
    ("epic", r"unite|union|dragon|titanic|giant|true"),
    ("mysterious", r"mysterious|limbo|unknown|dream"),
]


def aspect_label(w, h):
    r = w / h
    if r >= 2.0: return "21:9"
    if 1.65 <= r < 2.0: return "16:9"
    if 1.2 <= r < 1.65: return "4:3"
    if 0.9 <= r < 1.2: return "square"
    return "portrait"


def _has(patterns, text):
    return any(re.search(p, text) for p in patterns)


def derive(page="", title="", caption="", categories=(), kind="anime_still", width=0, height=0):
    name = re.sub(r"^File:", "", title)
    name = re.sub(r"\.(png|jpe?g|webp|gif)$", "", name, flags=re.I)
    text = f"{name} | {caption}".lower().replace("_", " ")
    subs = [s for s, pats in ALIASES.items() if _has(pats, text)]
    # character names in the file title
    if re.search(r"\basta\b", text): subs.append("asta")
    if re.search(r"\byuno\b", text): subs.append("yuno")
    young = bool(re.search(YOUNG, text)) and "15-year" not in text
    if young:
        for base in ("asta", "yuno"):
            if base in subs:
                subs.remove(base); subs.append(base + "_young")
    if _has(BLACK, text):
        subs.append("asta_black_form")
        if "asta" in subs and not re.search(r"\basta\b.*\b(and|vs)\b|\b(and|vs)\b.*\basta\b", text): subs.remove("asta")
    if not subs:
        for c in categories:
            m = re.match(r"Category:Images of (.+)", c)
            if m and m.group(1).lower() in CAT_SUBJECT:
                subs.append(CAT_SUBJECT[m.group(1).lower()])
    if "hage_village" in subs and "grimoire_tower" in subs: pass
    subs = list(dict.fromkeys(subs))
    location = next((s for s in LOCATIONS if s in subs), None)
    moods = [m for m, p in MOODS if re.search(p, text)][:3] or ["quiet"]
    shot = "medium"
    if kind == "manga_panel": shot = "panel"
    elif re.search(r"close|face|portrait|stare|eyes", text): shot = "closeup"
    elif "combat" in moods: shot = "action"
    elif location or "crowd" in subs: shot = "establishing" if location and not [s for s in subs if s not in LOCATIONS] else "wide"
    elif len([s for s in subs if s not in LOCATIONS]) >= 3: shot = "group"
    return {"subjects": subs, "location": location, "mood": moods, "shotType": shot,
            "aspectRatio": aspect_label(width, height) if width and height else "16:9"}


def load_curation(path=CURATION):
    try:
        return json.loads(Path(path).read_text())
    except (OSError, ValueError):
        return {}


def apply_curation(asset, cur):
    """Merge curation into an asset dict in place; returns False when the asset is rejected."""
    c = {}
    for key in (asset["id"], asset.get("file_title", ""), re.sub(r"^File:", "", asset.get("file_title", ""))):
        c.update(cur.get(key, {}))
    if c.get("reject"): return False
    t = asset["tags"]
    if "subjects" in c: t["subjects"] = list(c["subjects"])
    for s in c.get("add_subjects", []):
        if s not in t["subjects"]: t["subjects"].append(s)
    t["subjects"] = [s for s in t["subjects"] if s not in c.get("remove_subjects", [])]
    for k in ("mood", "location", "shotType"):
        if k in c: t[k] = c[k]
    if "focus" in c: asset["focus"] = c["focus"]
    if "kind" in c: asset["kind"] = c["kind"]
    return True
