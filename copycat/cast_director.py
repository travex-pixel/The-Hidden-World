"""Cast director: finds original archetype voices on Fish Audio, auditions them and writes config/black-clover-cast.json.

    FISH_API_KEY=... python -m copycat.cast_director [--refresh] [--no-audition]

Hard rules: only trained, public, English, non-DMCA, non-licensed (paid multiplier) voices; never a voice whose title,
description or tags name a real person or an existing franchise character / brand; and every selected title must be made
only of generic descriptive words or a plain given name (so unknown handles that may be a streamer are never picked).
"""
from __future__ import annotations
import argparse, json, math, re, sys
from pathlib import Path
import numpy as np

from copycat import fish_audio as FA

ROOT = Path(__file__).resolve().parent.parent
CAST_FILE = ROOT / "config" / "black-clover-cast.json"
POOL_FILE = FA.CACHE_DIR / "voice_pool.json"
AUDITION_JSON = ROOT / "build" / "copycat" / "bc-whatif-ep01" / "audio" / "cast_audition.json"
CHILD_CHAPTERS = {"ASTA": ["cold_open", "ch1", "ch2"], "YUNO": ["ch1"]}

# ----------------------------------------------------------------------------- identity safety
BLOCK_WORDS = {w.lower() for w in """
smash bros mortal kombat announcer goku naruto gojo satoru sukuna yuji subaru isagi miku hatsune sonic freddy fredbear
baldi bluey loud house sponge spongebob rick morty griffin peter mickey scooby shaggy starfire gohan videl venti raiden
shogun jarvis lawliet yagami light mitsuri kanroji pigsy kinito walten bon invincible grayson tokai teio paddington
trump donald musk elon markiplier mrbeast beast kendrick lamar michael jackson taylor swift ronaldo drury kirk charlie
ksi a2ksi ksia2 potus wnba slax guyzo atomic polo ezzy ezzy verity miside mita dexter morgan alhaitham valentino marcus
heisty wigman matu twinko brainrot ultrakill sans mario link samus pikachu luffy zoro tanjiro asta yuno noelle liebe yami
julius vegeta deku bakugo eren levi mikasa hinata sasuke itachi kakashi saitama genos anya loid yor megumi nobara
batman joker spiderman deadpool thanos optimus homer bart simpson stewie cartman kenny kyle elmo kermit shrek
obama biden putin hitler kanye drake eminem rihanna beyonce zelensky modi
""".split()}
BLOCK_PATTERNS = re.compile(
    r"voice actor|voice of|voiced by|impression|imitat|impersonat|sound[s]? like|based on|clone of|replica|youtuber|streamer|"
    r"influencer|celebrity|rapper|singer|politician|president|prime minister|footballer|athlete|character from|from the (?:anime|game|show|series|movie)|"
    r"\b(?:anime|game|cartoon|movie|show) character\b|official voice|english dub|\bdub\b|\bva\b|\bcosplay\b|\bparody\b|"
    r"\bfamous\b|\btiktok\b|\bwatermark\b|\bmeme\b|\bvocaloid\b", re.I)
FRANCHISE_TAGS = re.compile(r"smash|kombat|bluey|loud house|jujutsu|rezero|rick and morty|family guy|vocaloid|scoobydoo|genshin|fnaf|sonic", re.I)

GENERIC_WORDS = set("""
narrator narration storyteller story teller calm male female man woman boy girl kid child teen young old older elder deep soft
gentle warm cold raspy gravelly gruff smooth clear crisp bright dark low high slow fast measured energetic cheerful friendly
serious dramatic mysterious horror creepy tale documentary historian sleepless regular book record voice audiobook english us uk
british american american narrator professional announcer host teenager youth little baby mommy mom dad father mother friendly
confident authoritative breathy whisper whispering anime character villain hero demon spirit devil monster wizard knight
guard thug bully sister brother nun priest monk elder grandfather grandmother granpa grandpa uncle aunt lady gentleman
cinematic epic trailer radio podcast educational conversational casual relaxed sleepy tired bored cool deadpan sharp proud
stoic noble cynical sarcastic snarky sneering flustered anxious nervous shy timid quiet loud screaming shouting yelling
women men teen teenage adult mature middle aged one two three the a of and for with my is in on
""".split())
GIVEN_NAMES = set("""
sarah adrian selene ethan laura hannah paula jordan abby aubrey noah jax emma olivia sophia mia lily grace chloe ella
james john david daniel adam alex ryan lucas oliver henry jack leo max sam ben tom luke owen eli finn kai theo ian
anna emily nora ruby zoe lena iris vera clara alice maya nina rosa
""".split())


def _tokens(s: str) -> list[str]:
    return [t for t in re.split(r"[^a-z0-9]+", (s or "").lower()) if t]


def tags_of(item: dict) -> list[str]:
    t = item.get("tags") or []
    return [str(x).lower() for x in t]


def is_original_voice(item: dict) -> tuple[bool, str]:
    """True when the voice is an original archetype voice. Returns (ok, reason_if_not)."""
    title, desc = item.get("title") or "", item.get("description") or ""
    if item.get("state") != "trained": return False, "not trained"
    if item.get("dmca_taken_down"): return False, "dmca"
    if item.get("licensed"): return False, "licensed (2.5x)"
    if item.get("visibility") != "public": return False, "not public"
    if "en" not in (item.get("languages") or []): return False, "not english"
    if not title.isascii(): return False, "non-ascii title"
    toks = _tokens(title) + _tokens(desc)
    hit = BLOCK_WORDS.intersection(toks)
    if hit: return False, f"names a person/character/brand: {sorted(hit)[:2]}"
    if BLOCK_PATTERNS.search(title) or BLOCK_PATTERNS.search(desc): return False, "impersonation/real-person wording"
    for t in tags_of(item):
        if FRANCHISE_TAGS.search(t): return False, f"franchise tag {t!r}"
        if t not in {*GENERIC_WORDS, "character-voice", "social-media", "entertainment", "advertisement", "egirl", "neutral", "middle-aged", "gaming", "character", "anime", "cartoon"} and not re.fullmatch(r"[a-z\-]{3,14}", t):
            return False, f"unusual tag {t!r}"
    tt = _tokens(title)
    if not tt or any(t not in GENERIC_WORDS and t not in GIVEN_NAMES for t in tt):
        return False, "title is not a generic descriptor/given name"
    return True, ""


# ----------------------------------------------------------------------------- pool

QUERIES = [{}] + [{"tag": t} for t in ("narration", "deep", "young", "anime", "calm", "raspy", "child", "kid", "female", "soft", "gentle", "dark", "energetic", "male", "old", "cool")] \
    + [{"title": t} for t in ("narrator", "storyteller", "boy", "kid", "teen", "girl", "old man", "villain", "demon", "anime", "hero", "young man", "woman", "mother", "bully", "calm", "gruff", "deep voice", "teen boy", "anime boy", "devil")]


def fetch_pool(refresh: bool = False, pages: int = 3) -> list[dict]:
    if POOL_FILE.exists() and not refresh:
        return json.loads(POOL_FILE.read_text())
    import requests
    FA.CACHE_DIR.mkdir(parents=True, exist_ok=True)
    seen: dict[str, dict] = {}
    for q in QUERIES:
        for pg in range(1, (pages if not q else 2) + 1):
            params = {"page_size": 30, "page_number": pg, "language": "en", "sort_by": "task_count", **q}
            try:
                r = requests.get(f"{FA.API}/model", params=params, headers={"Authorization": f"Bearer {FA.api_key()}"}, timeout=40)
                if r.status_code != 200:
                    break
                items = r.json().get("items", [])
            except Exception as e:
                print("  pool query failed", q, type(e).__name__); break
            for it in items:
                seen.setdefault(it["_id"], it)
            if len(items) < 30:
                break
    pool = list(seen.values())
    POOL_FILE.write_text(json.dumps(pool))
    return pool


# ----------------------------------------------------------------------------- roles

# want: tag -> weight ; kw: title keywords ; f0: target median-F0 range (Hz) ; cent: preferred spectral centroid range
ROLES: dict[str, dict] = {
    "NARRATOR": dict(want={"male": 2, "narration": 3, "deep": 3, "calm": 3, "low": 2, "slow": 1, "measured": 1, "raspy": 1, "documentary": 1, "old": 1, "middle-aged": 1}, kw=["narrator", "storyteller", "story", "documentary", "historian", "book"], f0=(85, 125), speed=1.02, temp=0.65,
                     line="Nobody in Hage ever thought about the wind. Nobody thought about the two boys on the church steps, either.",
                     post_fx="equalizer=f=170:t=q:w=1.0:g=2.0,equalizer=f=3000:t=q:w=1.2:g=1.5", gender="m"),
    "ASTA": dict(want={"male": 3, "young": 3, "energetic": 2, "character-voice": 1, "dynamic": 1, "confident": 1, "expressive": 1, "raspy": 1, "serious": 1, "anime": 2}, kw=["boy", "teen", "young", "hero", "anime"], f0=(115, 175), speed=1.04, temp=0.72,
                 line="I do not have magic. So I will swing this sword until the whole world has to admit I am here.", post_fx="", gender="m"),
    "ASTA_CHILD": dict(want={"young": 3, "child": 3, "kid": 3, "bright": 2, "boy": 2, "neutral": 1, "female": 1, "high": 1, "conversational": 1, "cheerful": 1}, kw=["boy", "kid", "child", "little"], f0=(190, 290), speed=1.05, temp=0.72,
                       line="One day I am going to be the Wizard King! Just watch me, Yuno! I will not lose!", post_fx="", gender="c"),
    "LIEBE": dict(want={"raspy": 9, "deep": 2, "dark": 4, "low": 2, "male": 1, "mysterious": 2, "character-voice": 1, "dramatic": 1, "old": 1, "creepy": 2, "horror": 2}, kw=["demon", "devil", "villain", "creepy", "horror", "dark"], f0=(80, 130), speed=0.98, temp=0.78,
                  line="Heh. You humans are so loud. Hold the book properly, boy, and let me show you what hell tastes like.",
                  post_fx="aecho=0.8:0.75:18|32:0.18|0.12,equalizer=f=110:t=q:w=1.0:g=3.0", gender="m"),
    "YUNO": dict(want={"male": 3, "young": 3, "calm": 2, "cool": 1, "smooth": 2, "serious": 2, "confident": 1, "clear": 1, "measured": 1, "conversational": 1, "medium": 1}, kw=["young", "cool", "calm", "teen"], f0=(105, 155), speed=0.98, temp=0.60,
                  line="Do not be reckless, Asta. I will not wait for you forever. Keep up, or stay behind.", post_fx="", gender="m"),
    "YUNO_CHILD": dict(want={"young": 3, "child": 3, "kid": 2, "soft": 3, "gentle": 2, "quiet": 2, "calm": 1, "neutral": 1, "boy": 2}, kw=["boy", "kid", "child", "quiet", "soft", "little"], f0=(180, 270), speed=0.98, temp=0.60,
                        line="It is okay. I am here. Stop crying, Asta. We will be fine.", post_fx="", gender="c"),
    "YAMI": dict(want={"male": 2, "deep": 4, "gruff": 3, "low": 3, "raspy": 2, "old": 2, "middle-aged": 1, "confident": 1, "relaxed": 2, "slow": 1}, kw=["gruff", "deep", "old man", "captain"], f0=(80, 115), speed=0.95, temp=0.68,
                 line="Ah, you are loud, brat. Fine. You want to join my Black Bulls? Then do not bore me.", post_fx="", gender="m"),
    "NOELLE": dict(want={"female": 3, "young": 3, "confident": 2, "clear": 2, "bright": 1, "energetic": 1, "authoritative": 1, "proud": 2, "crisp": 1, "conversational": 1}, kw=["girl", "teen", "young", "woman"], f0=(185, 255), speed=1.03, temp=0.72,
                   line="I am not weak! I am a royal of the Silva family, and I will not be looked down on by the likes of you!", post_fx="", gender="f"),
    "FATHER_ORSI": dict(want={"male": 2, "old": 3, "middle-aged": 2, "warm": 2, "calm": 1, "friendly": 1, "soft": 1, "anxious": 1, "gentle": 1, "narration": 1}, kw=["old", "father", "priest", "grandpa", "elder"], f0=(95, 140), speed=1.0, temp=0.7,
                        line="Oh dear, oh dear. Two babies on the steps, in the middle of the night. Sister, quickly, bring blankets.", post_fx="", gender="m"),
    "SISTER_LILY": dict(want={"female": 3, "gentle": 3, "soft": 3, "warm": 2, "calm": 2, "middle-aged": 1, "narration": 1, "conversational": 1, "kind": 1}, kw=["woman", "mother", "gentle", "soft", "sister", "nun"], f0=(170, 235), speed=1.0, temp=0.68,
                         line="Hush now, little ones. You are safe here. Nobody will take you away from us.", post_fx="", gender="f"),
    "REVCHI": dict(want={"male": 2, "raspy": 3, "energetic": 2, "character-voice": 2, "confident": 2, "dramatic": 1, "middle-aged": 1, "dynamic": 1, "bully": 2, "mean": 1}, kw=["bully", "thug", "villain", "guard"], f0=(100, 145), speed=1.05, temp=0.76,
                   line="Look at that. The no-magic freak thinks he can stand next to us. Get out of my way, trash.", post_fx="", gender="m"),
    "JULIUS": dict(want={"male": 1, "friendly": 2, "cheerful": 2, "bright": 2, "mysterious": 3, "playful": 2, "calm": 1, "young": 1, "middle-aged": 1, "smooth": 2}, kw=["mysterious", "friendly", "cheerful"], f0=(115, 185), speed=1.0, temp=0.70,
                   line="Oh, how delightful. Every story needs someone who is willing to turn the page, doesn't it?", post_fx="", gender="m"),
    "DEFAULT": dict(want={"narration": 2, "calm": 2, "clear": 2, "professional": 1, "conversational": 1}, kw=["voice"], f0=(100, 220), speed=1.0, temp=0.7,
                    line="The night went quiet, and the world, for a moment, held its breath.", post_fx="", gender="m"),
}
CHILD_ROLES = {"ASTA_CHILD", "YUNO_CHILD"}


def tag_score(item: dict, role: dict) -> float:
    tags, title = set(tags_of(item)), _tokens(item.get("title"))
    s = sum(w for t, w in role["want"].items() if t in tags)
    s += 2.5 * sum(1 for k in role["kw"] if any(k in " ".join(title) for _ in [0]))
    if len(tags) > 20:           # tag-stuffed listings (every tag at once) say nothing about the real timbre
        s *= 0.35
    g = role["gender"]
    if g == "m" and "female" in tags: s -= 5
    if g == "f" and "male" in tags: s -= 5
    if g == "m" and "male" not in tags and "neutral" not in tags: s -= 1
    return s


def prelim_score(item: dict, role: dict) -> float:
    return tag_score(item, role) + 0.9 * math.log10(max(int(item.get("task_count") or 1), 1))


# ----------------------------------------------------------------------------- measurement / audition

def measure_clip(x: np.ndarray, sr: int = 48000) -> dict:
    from copycat import voicecast as VC
    win = int(0.02 * sr)
    n = len(x) // win
    r = np.sqrt((x[: n * win].reshape(n, win).astype(np.float64) ** 2).mean(axis=1)) if n else np.array([0.0])
    sil = float((r < max(r.max() * 0.03, 1e-4)).mean())
    return {"dur_s": round(len(x) / sr, 2), "f0_hz": round(VC.median_f0(x, sr), 1), "centroid_hz": round(VC.spectral_centroid(x, sr)),
            "rms_db": round(VC.speech_rms_db(x, sr), 1), "peak": round(float(np.abs(x).max()), 3), "silence_ratio": round(sil, 3)}


def fit_score(role: dict, m: dict, words: int) -> float:
    lo, hi = role["f0"]
    f0 = m["f0_hz"] or (lo + hi) / 2
    d = 0.0 if lo <= f0 <= hi else abs(math.log(f0 / (lo if f0 < lo else hi)))
    wpm = words / max(m["dur_s"] * (1 - m["silence_ratio"]), 0.1) * 60
    wpm_pen = 0.0 if 120 <= wpm <= 210 else 0.5
    center = -12.0 * abs(math.log(f0 / math.sqrt(lo * hi)))          # closeness to the archetype's pitch centre
    return -6.0 * d + center - wpm_pen - (3 if m["peak"] >= 0.99 else 0) - (2 if m["silence_ratio"] > 0.45 else 0)


def differs(a: dict, b: dict, frac: float = 0.15) -> bool:
    fd = abs(a["f0_hz"] - b["f0_hz"]) / max(min(a["f0_hz"], b["f0_hz"]), 1)
    cd = abs(a["centroid_hz"] - b["centroid_hz"]) / max(min(a["centroid_hz"], b["centroid_hz"]), 1)
    return fd >= frac or cd >= frac


def shares_scene(a: str, b: str) -> bool:
    pair = {a, b}
    return pair not in ({"ASTA", "ASTA_CHILD"}, {"YUNO", "YUNO_CHILD"}, {"ASTA", "YUNO_CHILD"}, {"YUNO", "ASTA_CHILD"}, {"DEFAULT", "DEFAULT"}) and "DEFAULT" not in pair


def audition(pool: list[dict], top: int = 4) -> dict:
    client = FA.FishClient()
    res: dict[str, list[dict]] = {}
    used_global: set[str] = set()
    for rname, role in ROLES.items():
        ok = [it for it in pool if is_original_voice(it)[0]]
        ranked = sorted(ok, key=lambda it: -prelim_score(it, role))
        cands = ranked[:top]
        out = []
        for it in cands:
            try:
                p = client.synth(f"aud-{rname}", role["line"], it["_id"], role["speed"], role["temp"], voice_label=it["title"])
                m = measure_clip(FA.decode_pcm(p))
            except FA.FishError as e:
                print(f"  audition failed {rname}/{it['title']}: {e.status}")
                continue
            words = len(role["line"].split())
            out.append({"_id": it["_id"], "title": it["title"], "tags": tags_of(it)[:8], "task_count": it.get("task_count"),
                        "tag_score": round(prelim_score(it, role), 2), "fit": round(fit_score(role, m, words), 2), "measure": m})
        res[rname] = out
    return res


def total_score(c: dict) -> float:
    return c["tag_score"] + c["fit"]


def assign(aud: dict) -> tuple[dict, list[str]]:
    """Greedy over roles (hardest-to-distinguish first) enforcing unique ids and >=15 % F0-or-centroid separation
    between any two roles that share scenes. Returns ({role: candidate}, warnings)."""
    order = ["NARRATOR", "YAMI", "LIEBE", "ASTA", "YUNO", "NOELLE", "FATHER_ORSI", "SISTER_LILY", "REVCHI", "JULIUS", "ASTA_CHILD", "YUNO_CHILD", "DEFAULT"]
    chosen: dict[str, dict] = {}
    warn: list[str] = []
    for r in order:
        cands = sorted(aud.get(r, []), key=lambda c: -total_score(c))
        pick = None
        for c in cands:
            if any(c["_id"] == o["_id"] for o in chosen.values()):
                continue
            if all(differs(c["measure"], o["measure"]) for rr, o in chosen.items() if shares_scene(r, rr)):
                pick = c; break
        if pick is None:
            for c in cands:
                if not any(c["_id"] == o["_id"] for o in chosen.values()):
                    pick = c; warn.append(f"{r}: no candidate met the 15% separation rule; took best unique ({c['title']})"); break
        if pick is None:
            warn.append(f"{r}: no candidate")
            continue
        chosen[r] = pick
    return chosen, warn


# ----------------------------------------------------------------------------- config

def load_cast_config(path: Path = CAST_FILE) -> dict:
    return json.loads(path.read_text()) if path.exists() else {}


def build_config(chosen: dict, existing: dict) -> dict:
    out = {}
    for rname, role in ROLES.items():
        ex = existing.get(rname)
        if ex and (ex.get("pinned") or ex.get("_user_edited")):
            out[rname] = ex; continue
        c = chosen.get(rname)
        if not c:
            if ex: out[rname] = ex
            continue
        ent = {"_id": c["_id"], "title": c["title"], "tags": c["tags"], "speed": role["speed"], "temperature": role["temp"],
               "post_fx": role["post_fx"], "pinned": False, "measured": c["measure"]}
        if rname in CHILD_ROLES:
            ent["chapters"] = CHILD_CHAPTERS["ASTA" if rname == "ASTA_CHILD" else "YUNO"]
        # a user-edited _id (differs from what we would write) is preserved with its own settings
        if ex and ex.get("_id") and ex["_id"] != c["_id"] and ex.get("title") == c["title"] is False:
            pass
        out[rname] = ent
    return out


def is_user_edited(ex: dict, pool_by_id: dict) -> bool:
    return bool(ex.get("pinned"))


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--refresh", action="store_true", help="re-query the voice catalogue and re-audition")
    ap.add_argument("--top", type=int, default=6, help="candidates auditioned per role")
    ap.add_argument("--refresh-pool", action="store_true", help="re-query the voice catalogue (default: reuse the cached pool)")
    a = ap.parse_args(argv)
    if not FA.available():
        return 0
    existing = load_cast_config()
    if existing and not a.refresh:
        print(f"{CAST_FILE} exists; use --refresh to re-audition (pinned entries are always kept)")
        return 0
    pool = fetch_pool(a.refresh_pool)
    ok = [it for it in pool if is_original_voice(it)[0]]
    print(f"pool {len(pool)} voices, {len(ok)} pass the original-voice filter")
    aud = audition(pool, a.top)
    chosen, warn = assign(aud)
    # preserve user overrides: pinned, or an _id that differs from the file's last auto-written `_auto_id`
    cfg = build_config(chosen, {k: v for k, v in existing.get("cast", existing).items() if isinstance(v, dict)})
    for k, v in existing.get("cast", {}).items():
        if isinstance(v, dict) and v.get("_auto_id") and v.get("_id") != v["_auto_id"]:
            cfg[k] = v      # user edited the id by hand
    for k, v in cfg.items():
        v.setdefault("_auto_id", v["_id"])
    CAST_FILE.parent.mkdir(parents=True, exist_ok=True)
    CAST_FILE.write_text(json.dumps({"_comment": "Fish Audio cast for Black Clover What-If. Set pinned:true (or edit _id) to keep an entry across --refresh.",
                                     "model_default": FA.FREE_MODEL, "cast": cfg, "warnings": warn}, indent=1, ensure_ascii=False))
    AUDITION_JSON.parent.mkdir(parents=True, exist_ok=True)
    AUDITION_JSON.write_text(json.dumps(aud, indent=1))
    print(f"{'role':12s} {'title':28s} {'f0':>6s} {'cent':>6s} {'wpm?':>5s}  tags")
    for r, c in cfg.items():
        m = c.get("measured", {})
        print(f"{r:12s} {c['title'][:28]:28s} {m.get('f0_hz', 0):6.1f} {m.get('centroid_hz', 0):6d}  {c['tags'][:5]}")
    for w in warn: print("WARN", w)
    print("api:", json.dumps(FA.STATS.as_dict())[:400])
    return 0


if __name__ == "__main__":
    sys.exit(main())
