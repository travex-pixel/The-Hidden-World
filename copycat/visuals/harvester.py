"""Franchise visual harvester: build assets/cache/<franchise>/vault.json from the franchise's Fandom wiki.

    python -m copycat.visuals.harvester [--franchise black-clover|naruto] [--max 220] [--refresh] [--stats] [--rebuild]

Black Clover is the default (legacy behaviour untouched). Naruto uses copycat/visuals/narutopedia.py for discovery.
"""
import argparse
import hashlib
import json
import os
import re
import statistics
import sys
import time
from collections import Counter
from pathlib import Path
from urllib.parse import quote

import requests

from .. import franchise as franchise_mod
from . import imgutil, tagger
from .local_indexer import index_local_media

ROOT = Path(__file__).resolve().parents[2]
CURATION = ROOT / "copycat/projects/bc-whatif-ep01/curation.json"
CACHE = ROOT / "assets/cache/black-clover"
IMAGES, RAW, VAULT, REGISTRY = CACHE / "images", CACHE / "raw", CACHE / "vault.json", CACHE / "raw/registry.json"
API = "https://blackclover.fandom.com/api.php"
FRANCHISE = "black-clover"
ID_PREFIX = "bc_"
UA = "HiddenWorldVisualHarvester/1.0 (non-commercial research tool; polite, cached, <=4 req/s)"
DOMAIN = "anime_black_clover"
MANGA_SUBJECTS = {"liebe", "licita", "five_leaf_grimoire", "lucius", "asta_black_form", "lucifero", "anti_magic", "father_orsi", "sister_lily", "hage_village", "hage_church", "grimoire_tower", "revchi", "demon_skull", "asta_young", "yuno_young", "mindscape", "julius"}
MANDATORY = ["asta_young", "yuno_young", "liebe", "licita", "five_leaf_grimoire", "grimoire_tower", "hage_village", "hage_church",
             "demon_skull", "revchi", "yami", "julius", "william_vangeance", "exam_arena", "asta_black_form", "yuno", "asta"]
SCARCE = {"sister_lily", "father_orsi", "grimoire_tower", "hage_church", "crowd", "night_sky", "mindscape", "liebe", "asta_young", "yuno_young", "hage_church", "licita", "demon_skull", "hage_village", "revchi", "five_leaf_grimoire"}  # lowres (>=480px) tolerated, flagged
MAX_VAULT = 300
CAPS = {"asta": 60, "yuno": 28, "default": 24}
EXTRA_CATS = ["Licita", "Lucifero", "Lucius Zogratis", "Dante Zogratis", "Zenon Zogratis", "Orsi Orfai", "Lily Aquaria", "Patolli", "Licht"]
ENTITY_PAGES = ["Asta", "Yuno", "Liebe", "Licita", "Black Asta", "Five-leaf Clover Grimoire", "Four-leaf Clover Grimoire", "Demon-Slayer Sword", "Anti Magic",
                "Hage Village", "Orsi Orfai", "Lily Aquaria", "Revchi Salik", "Yami Sukehiro", "Noelle Silva", "Magna Swing", "Luck Voltia",
                "Vanessa Enoteca", "Finral Roulacase", "Julius Novachrono", "William Vangeance", "Patolli", "Licht", "Magic Knights Entrance Exam",
                "Royal Capital", "Black Bulls", "Dark Triad", "Dante Zogratis", "Zenon Zogratis", "Lucifero", "Lucius Zogratis"]
EPISODE_PAGES = [f"Episode {n}" for n in list(range(1, 14)) + [64, 66, 68, 102, 103, 105, 145, 146]]

def configure(franchise_id):
    """Point the module-level paths/API at another franchise (default state = black-clover)."""
    global CACHE, IMAGES, RAW, VAULT, REGISTRY, API, DOMAIN, FRANCHISE, ID_PREFIX
    fr = franchise_mod.load(franchise_id)
    FRANCHISE = fr["id"]
    CACHE = ROOT / fr["vault_dir"]
    IMAGES, RAW, VAULT, REGISTRY = CACHE / "images", CACHE / "raw", CACHE / "vault.json", CACHE / "raw/registry.json"
    API = fr["wiki_apis"][0]
    global CURATION
    if FRANCHISE != "black-clover": CURATION = ROOT / f"copycat/projects/{FRANCHISE}-whatif-ep01/curation.json"
    DOMAIN = fr.get("domain") or ("anime_black_clover" if FRANCHISE == "black-clover" else f"anime_{FRANCHISE.replace('-', '_')}")
    ID_PREFIX = fr.get("id_prefix") or ("bc_" if FRANCHISE == "black-clover" else {"naruto": "nr_"}.get(FRANCHISE, FRANCHISE[:2] + "_"))
    return fr


_last = [0.0]
_session = requests.Session()
_session.headers["User-Agent"] = UA
if os.path.exists("/root/.ccr/ca-bundle.crt") and not os.environ.get("REQUESTS_CA_BUNDLE"):
    os.environ["REQUESTS_CA_BUNDLE"] = "/root/.ccr/ca-bundle.crt"


def log(m): print(f"[harvester] {m}", flush=True)


def get(url, params=None, tries=5, min_gap=0.26, **kw):
    for i in range(tries):
        wait = _last[0] + min_gap - time.time()
        if wait > 0: time.sleep(wait)
        _last[0] = time.time()
        try:
            r = _session.get(url, params=params, timeout=60, **kw)
            if r.status_code == 403 and i == 0:
                time.sleep(30); continue
            if r.status_code in (429, 500, 502, 503, 504):
                time.sleep(2 ** (i + 1)); continue
            r.raise_for_status()
            return r
        except requests.RequestException as e:
            if i == tries - 1: raise
            time.sleep(2 ** (i + 1))
    raise RuntimeError("unreachable")


def api(params, refresh=False, base=None):
    base = base or API
    p = {"format": "json", "formatversion": "2", **params}
    if base != API: p["_base"] = base
    f = RAW / ("api_" + hashlib.sha1(json.dumps(p, sort_keys=True).encode()).hexdigest()[:20] + ".json")
    if f.exists() and not refresh:
        return json.loads(f.read_text())
    d = get(base, {k: v for k, v in p.items() if k != "_base"}).json()
    f.write_text(json.dumps(d))
    return d


def api_all(params, refresh=False, base=None):
    """Follow `continue`, merging pages by pageid. Returns list of page dicts (generator queries) or raw lists."""
    pages, extra, cont = {}, [], {}
    while True:
        d = api({**params, **cont}, refresh, base)
        q = d.get("query", {})
        for p in q.get("pages", []):
            m = pages.setdefault(p["pageid"] if "pageid" in p else p["title"], {})
            for k, v in p.items():
                if isinstance(v, list): m.setdefault(k, []).extend(v)
                else: m[k] = v
        for k in ("categorymembers", "allimages"):
            extra += q.get(k, [])
        if "continue" not in d: break
        cont = d["continue"]
    return list(pages.values()) or extra


def full_url(u):
    return re.sub(r"/scale-to-width-down/\d+", "", u)


def page_record(p, page, caption=""):
    ii = (p.get("imageinfo") or [None])[0]
    if not ii: return None
    return {"title": p["title"], "page": page, "caption": caption, "url": full_url(ii["url"]), "w": ii["width"], "h": ii["height"],
            "mime": ii.get("mime", ""), "cats": [c["title"] for c in p.get("categories", [])]}


def gallery_captions(wikitext):
    out = {}
    for blk in re.findall(r"<gallery[^>]*>(.*?)</gallery>", wikitext, re.S | re.I):
        for line in blk.splitlines():
            m = re.match(r"\s*(?:File|Image):([^|]+)\|?(.*)", line.strip())
            if m: out["File:" + m.group(1).strip().replace("_", " ")] = re.sub(r"\[\[|\]\]|'''|''", "", m.group(2)).strip()
    return out


def discover(refresh):
    cand, caps = {}, {}
    def add(rec):
        if rec and rec["title"] not in cand: cand[rec["title"]] = rec
        elif rec and rec["page"] and not cand[rec["title"]]["page"]: cand[rec["title"]]["page"] = rec["page"]
    def cat(title):
        for p in api_all({"action": "query", "generator": "categorymembers", "gcmtitle": title, "gcmnamespace": "6", "gcmlimit": "50",
                          "prop": "categories|imageinfo", "cllimit": "max", "iiprop": "url|size|mime"}, refresh):
            add(page_record(p, title.replace("Category:Images of ", "")))
    subcats = lambda t: [m["title"] for m in api_all({"action": "query", "list": "categorymembers", "cmtitle": t, "cmtype": "subcat", "cmlimit": "500"}, refresh)]
    episodes = subcats("Category:Images_by_Episode")
    log(f"{len(episodes)} episode categories")
    for c in episodes: cat(c)
    chars = {c.lower() for c in subcats("Category:Images_by_Character")}
    wanted = [f"Category:Images of {n}" for n in list(tagger.CAT_SUBJECT) + [e.lower() for e in EXTRA_CATS]]
    for c in sorted({w for w in wanted if w.lower() in chars}) + ["Category:Images of Grimoires"]: cat(c)
    # articles: prop=images + gallery wikitext captions
    for t in ENTITY_PAGES + EPISODE_PAGES:
        try:
            w = api({"action": "parse", "page": t, "prop": "wikitext", "redirects": "1"}, refresh)
            if "parse" in w: caps.update(gallery_captions(w["parse"]["wikitext"]))
            imgs = api_all({"action": "query", "titles": t, "prop": "images", "imlimit": "500", "redirects": "1"}, refresh)
            titles = [i["title"] for p in imgs for i in p.get("images", [])]
        except requests.RequestException as e:
            log(f"skip {t}: {e}"); continue
        titles = [x for x in titles if x not in cand and not imgutil.NAME_REJECT.search(x)]
        for i in range(0, len(titles), 40):
            for p in api_all({"action": "query", "titles": "|".join(titles[i:i + 40]), "prop": "categories|imageinfo", "cllimit": "max", "iiprop": "url|size|mime"}, refresh):
                add(page_record(p, t))
    for k, v in cand.items():
        if k in caps: v["caption"] = caps[k]
    for t, c in caps.items():  # captions for files not otherwise seen are ignored (no metadata)
        pass
    log(f"{len(cand)} candidate files")
    return cand


def classify(rec):
    cats = " ".join(rec["cats"])
    if "Images of Episode" in cats: return "anime_still"
    if "Images of Chapter" in cats: return "manga_panel"
    if re.search(r"anime visual|key visual", rec["title"], re.I): return "key_art"
    return None


def early(rec):
    m = re.search(r"Images of Episode (\d+)", " ".join(rec["cats"]))
    return bool(m and int(m.group(1)) <= 3) or bool(re.search(r"flashback|child|baby|infant|church|orphan|hage|pendant|promise|nash|recca|potato|lily|orsi|young|contract|liebe|richita|licita", rec["title"], re.I) and re.search(r"Images of Episode (\d+)", " ".join(rec["cats"])))


def score(rec, tags):
    s = 10 if early(rec) else 0
    m = re.search(r"Images of Episode (\d+)", " ".join(rec["cats"]))
    if m and int(m.group(1)) <= 13: s += 3
    s += 2 * len([x for x in tags["subjects"] if x in MANDATORY]) + (1 if tags["subjects"] else 0)
    if not tags["subjects"] and not tags["location"]: s -= 9
    return s + min(rec["w"], 1920) / 1920


def load_registry():
    try: return json.loads(REGISTRY.read_text())
    except (OSError, ValueError): return {}


def save_registry(reg): REGISTRY.write_text(json.dumps(reg, indent=0))


def download(url, params=None):
    return get(url, params, min_gap=0.3).content


def fetch_and_register(rec, kind, reg, source="fandom"):
    key = rec["title"]
    e = {"title": key, "kind": kind, "source": source, "url": rec["url"], "page": rec["page"], "caption": rec["caption"], "cats": rec["cats"]}
    if rec.get("usage"): e["usage"] = rec["usage"]
    try:
        img = imgutil.open_image(download(rec["url"]))
    except Exception as ex:
        e.update(status="rejected", reason=f"download:{type(ex).__name__}"); reg[key] = e; return e
    reason = imgutil.check(img, manga=kind == "manga_panel", min_w=rec.get("min_w") or (640 if rec.get("lowres_ok") else 800))
    if reason:
        e.update(status="rejected", reason=reason); reg[key] = e; return e
    nid = ID_PREFIX + "%04d" % (1 + max([int(v["id"][len(ID_PREFIX):]) for v in reg.values() if v.get("id")] or [0]))
    IMAGES.mkdir(parents=True, exist_ok=True)
    imgutil.save_jpeg(img, IMAGES / f"{nid}.jpg")
    e.update(status="ok", id=nid, lowres=img.width < 800, width=img.width, height=img.height, dhash=imgutil.dhash(img), palette=imgutil.palette(img), quality=imgutil.quality(img))
    reg[key] = e
    return e


def jikan(reg, refresh):
    for ep in ("pictures", "characters"):
        try:
            d = get(f"https://api.jikan.moe/v4/anime/34572/{ep}", tries=2, min_gap=1.1).json()["data"]
        except Exception as ex:
            log(f"jikan {ep}: {ex}"); continue
        urls = []
        for x in d:
            j = (x.get("jpg") or x.get("character", {}).get("images", {}).get("jpg") or {})
            u = j.get("large_image_url") or j.get("image_url")
            if u: urls.append(u)
        for u in urls[:30]:
            key = "jikan:" + u
            if key in reg: continue
            fetch_and_register({"title": key, "url": u, "page": f"jikan/{ep}", "caption": "", "cats": []}, "portrait", reg, "jikan")
    save_registry(reg)


def build_vault(local_entries=()):
    reg = load_registry()
    ok = [e for e in reg.values() if e.get("status") == "ok"]
    assets = []
    for e in ok:
        t = tagger.derive(e["page"], e["title"], e["caption"], e["cats"], e["kind"], e["width"], e["height"])
        t["dominantPalette"] = e["palette"]
        assets.append({"id": e["id"], "path": f"assets/cache/black-clover/images/{e['id']}.jpg", "domain": DOMAIN, "kind": e["kind"], "source": e["source"],
                       "source_url": e["url"], "page": e["page"], "file_title": e["title"], "caption": e["caption"], "width": e["width"], "height": e["height"],
                       "dhash": e["dhash"], "tags": t, "focus": [0.5, 0.4], "quality": e["quality"], **({"lowres": True} if e.get("lowres") else {})})
    assets += list(local_entries)
    assets.sort(key=lambda a: a["id"])  # older ids win ties so existing ids stay stable
    kept, dups = [], 0
    for a in assets:
        if any(imgutil.hamming(a["dhash"], k["dhash"]) <= 6 for k in kept): dups += 1; continue
        kept.append(a)
    cur, final, rejected_cur, capped = tagger.load_curation(), [], 0, 0
    try: pinned = set(json.loads((CACHE / "pinned_ids.json").read_text()))  # assets already handed to downstream tools: never drop
    except (OSError, ValueError): pinned = set()
    cnt, pruned = Counter(), []
    for a in sorted(kept, key=lambda a: -a["quality"]):
        if a["kind"] == "manga_panel" or a.get("lowres") or a["source"] == "local" or a["id"] in pinned or tagger.curation_for(a, cur).get("keep"): pruned.append(a); continue
        subs = a["tags"]["subjects"] or ["_none"]
        if all(cnt[x] >= CAPS.get(x, CAPS["default"]) for x in subs):
            capped += 1; continue
        cnt.update(subs); pruned.append(a)
    core = set(MANDATORY) - {"asta", "yuno"}
    must = [a for a in pruned if a["kind"] == "manga_panel" or a.get("lowres") or core & set(a["tags"]["subjects"]) or a["id"] in pinned or tagger.curation_for(a, cur).get("keep")]
    rest = sorted((a for a in pruned if a not in must), key=lambda a: -a["quality"])
    room = max(0, MAX_VAULT - len(must)); capped += max(0, len(rest) - room)
    kept = must + rest[:room]
    for a in sorted(kept, key=lambda a: a["id"]):
        if tagger.apply_curation(a, cur): final.append(a)
        else: rejected_cur += 1
    VAULT.write_text(json.dumps({"domain": DOMAIN, "assets": final}, indent=1))
    reasons = Counter(e["reason"].split(":")[0] for e in reg.values() if e.get("status") == "rejected")
    reasons["duplicate"] += dups; reasons["curation"] += rejected_cur; reasons["subject_cap"] += capped
    return final, reasons


ES = "https://blackclover.fandom.com/es/api.php"


def lang_files(base, prefixes, refresh=False):
    """List files (url/size) whose names start with each prefix on a language wiki."""
    out = {}
    for pre in prefixes:
        for p in api_all({"action": "query", "generator": "allimages", "gaiprefix": pre, "gailimit": "50", "prop": "imageinfo", "iiprop": "url|size|mime"}, refresh, base):
            rec = page_record(p, pre)
            if rec: out[rec["title"]] = rec
    return out


def harvest_lang(base, prefixes, tag, refresh=False, minw=640):
    reg = load_registry(); n = 0
    for k, rec in sorted(lang_files(base, prefixes, refresh).items()):
        key = f"{tag}:{k}"
        if key in reg or rec["mime"] == "image/gif" or rec["w"] < minw or imgutil.NAME_REJECT.search(k): continue
        rec = {**rec, "title": key, "cats": [], "lowres_ok": rec["w"] < 800}
        e = fetch_and_register(rec, "anime_still", reg); n += 1
        if n % 10 == 0: save_registry(reg)
    save_registry(reg); log(f"{tag}: {n} new files")


# --------------------------------------------------------------------------- Naruto (Narutopedia)
def naruto_discover(refresh):
    """All tv-screenshot files + their file-page metadata -> {title: rec}; API responses cached under raw/."""
    from . import narutopedia as npd
    cand = {}
    for c in npd.SCREENSHOT_CATS:
        for p in api_all({"action": "query", "generator": "categorymembers", "gcmtitle": c, "gcmnamespace": "6", "gcmlimit": "50",
                          "prop": "imageinfo", "iiprop": "url|size|mime"}, refresh):
            rec = page_record(p, "")
            if rec and rec["title"] not in cand: cand[rec["title"]] = rec
    log(f"{len(cand)} screenshot files in categories")
    keep = {t: r for t, r in cand.items() if r["w"] >= npd.MIN_W and r["mime"] in ("image/png", "image/jpeg") and not imgutil.NAME_REJECT.search(t) and not npd.NAME_REJECT.search(t)}
    log(f"{len(keep)} after size/name filter")
    titles = sorted(keep)
    for i in range(0, len(titles), 50):
        d = api({"action": "query", "titles": "|".join(titles[i:i + 50]), "prop": "revisions", "rvprop": "content", "rvslots": "main"}, refresh)
        for p in d.get("query", {}).get("pages", []):
            if p["title"] in keep and p.get("revisions"):
                keep[p["title"]]["meta"] = npd.parse_meta(p["revisions"][0]["slots"]["main"]["content"])
        if i % 1000 == 0: log(f"file pages {i}/{len(titles)}")
    # subject pages -> their image lists (page membership is strong subject evidence for char-free footage)
    for subj, pages in npd.SUBJECT_PAGES.items():
        for pg in dict.fromkeys(pages):
            try:
                d = api({"action": "query", "titles": pg, "prop": "images", "imlimit": "500", "redirects": "1"}, refresh)
            except requests.RequestException:
                continue
            for p in d.get("query", {}).get("pages", []):
                for im in p.get("images", []):
                    r = keep.get(im["title"])
                    if r is not None:
                        r.setdefault("meta", {}).setdefault("pages", [])
                        if subj not in r["meta"]["pages"]: r["meta"]["pages"].append(subj)
    return keep


NARUTO_NEED = {"naruto", "naruto_clones", "forbidden_scroll", "iruka", "mizuki", "hiruzen", "crystal_ball", "hokage_office", "paperwork", "document", "kakashi", "bells",
               "sasuke", "fireball", "sakura", "team7", "kurama", "seal_mark", "minato", "kushina", "tobirama", "konoha_village", "hokage_monument", "academy", "classroom",
               "forest", "training_ground", "ichiraku", "naruto_apartment", "night_sky", "sunrise", "archive", "anbu", "danzo", "villagers", "shuriken", "ramen", "headband", "seal_cage", "teuchi"}


def naruto_rank(cand):
    from . import narutopedia as npd
    out = []
    for rec in cand.values():
        meta = rec.get("meta") or {}
        if not npd.wanted(rec["title"], meta): continue
        t = npd.derive("", rec["title"], "", [], "anime_still", rec["w"], rec["h"], (), meta)
        if t["era"] in ("shippuden", "boruto"): continue
        sc = (3 if t["era"] == "part1" else 0) + len(t["subjects"]) + min(rec["w"], 1920) / 1920 - (3 if not t["subjects"] else 0)
        out.append((sc, rec, t))
    out.sort(key=lambda x: -x[0])
    return out


def naruto_lang_discover(langs, refresh):
    """Part I footage from es / pt-br / pl history pages (files before the Part II heading) -> {key: rec}."""
    from . import narutopedia as npd
    out = {}
    for lang in langs:
        cfg = npd.LANG_WIKIS[lang]
        base = f"https://naruto.fandom.com/{lang}/api.php"
        files = {}
        for name in npd.LANG_CHARS + npd.LANG_PLACES:
            subj = npd.NAME_SUBJECT.get(name.lower())
            for pat in cfg["subpages"]:
                try:
                    d = api({"action": "query", "titles": pat.format(n=name), "prop": "revisions", "rvprop": "content", "rvslots": "main", "redirects": "1"}, refresh, base)
                except requests.RequestException:
                    continue
                for p in d.get("query", {}).get("pages", []):
                    if not p.get("revisions"): continue
                    items, stopped = npd.history_images_ex(p["revisions"][0]["slots"]["main"]["content"])
                    for fn, cap, sect in items:
                        t = cfg["file_ns"] + ":" + fn.replace("_", " ")
                        e = files.setdefault(t, {"caption": cap, "section": sect, "pages": [], "sure": False})
                        e["sure"] = e["sure"] or stopped
                        if cap and not e["caption"]: e["caption"] = cap
                        if subj and subj not in e["pages"]: e["pages"].append(subj)
        log(f"{lang}: {len(files)} Part I files referenced")
        titles = sorted(files)
        for i in range(0, len(titles), 50):
            for p in api_all({"action": "query", "titles": "|".join(titles[i:i + 50]), "prop": "imageinfo", "iiprop": "url|size|mime"}, refresh, base):
                rec = page_record(p, "")
                if not rec or rec["mime"] not in ("image/png", "image/jpeg") or rec["w"] < 800: continue
                if imgutil.NAME_REJECT.search(rec["title"]) or npd.NAME_REJECT.search(rec["title"]): continue
                f = files.get(p["title"], {})
                rec["meta"] = {"desc": f.get("caption", ""), "series": "lang" if f.get("sure") else "lang_unsure", "lang": lang, "section": f.get("section", ""), "chars": [], "pages": f.get("pages", [])}
                key = f"{lang}:{rec['title']}"
                rec["title"] = key
                out[key] = rec
    return out


def naruto_search_discover(refresh):
    """Character-free place/object frames found by keyword search in every wiki's File namespace (era is irrelevant for those)."""
    from . import narutopedia as npd
    out = {}
    for lang, terms in npd.SEARCH_TERMS.items():
        base = f"https://naruto.fandom.com/{lang}/api.php" if lang else API
        for term in terms:
            try:
                d = api({"action": "query", "list": "search", "srsearch": term, "srnamespace": "6", "srlimit": "50"}, refresh, base)
            except requests.RequestException:
                continue
            titles = [x["title"] for x in d.get("query", {}).get("search", [])]
            for i in range(0, len(titles), 50):
                for p in api_all({"action": "query", "titles": "|".join(titles[i:i + 50]), "prop": "imageinfo", "iiprop": "url|size|mime"}, refresh, base):
                    rec = page_record(p, "")
                    if not rec or rec["mime"] not in ("image/png", "image/jpeg") or rec["w"] < npd.MIN_W: continue
                    if imgutil.NAME_REJECT.search(rec["title"]) or npd.NAME_REJECT.search(rec["title"]): continue
                    t = npd.derive("", rec["title"], "", [], "anime_still", rec["w"], rec["h"], (), {"series": "search", "chars": []})
                    if any(x in npd.CHAR_RE for x in t["subjects"]) or not t["subjects"]: continue      # people frames come from the sources above
                    if npd.BORUTO.search(rec["title"]) or npd.SHIPPUDEN.search(rec["title"]): continue
                    key = (f"{lang}:" if lang else "") + rec["title"]
                    rec["title"] = key
                    rec["meta"] = {"desc": "", "series": "search", "chars": [], "pages": [], "lang": lang or "en", "term": term}
                    out.setdefault(key, rec)
        log(f"search {lang or 'en'}: {len(out)} char-free candidates so far")
    return out


def run_naruto(a):
    global npd_MIN_W
    from . import narutopedia as _n
    npd_MIN_W = _n.MIN_W
    RAW.mkdir(parents=True, exist_ok=True); IMAGES.mkdir(parents=True, exist_ok=True)
    reg = load_registry()
    if not a.rebuild:
        cand = naruto_discover(a.refresh)
        if a.lang_wikis:
            cand.update(naruto_lang_discover([x for x in a.lang_wikis.split(",") if x], a.refresh))
        for k, r in cand.items():                         # keep registry metadata in step with the parser
            if k in reg and r.get("meta"): reg[k]["meta"] = r["meta"]
        if a.search_places:
            cand.update(naruto_search_discover(a.refresh))
        ranked = naruto_rank(cand)
        log(f"{len(ranked)} ranked candidates (of {len(cand)})")
        if a.discover_only:
            from collections import Counter as C
            print(C(s for _, _, t in ranked for s in t["subjects"]).most_common(80)); return 0
        n = 0
        for sc, rec, t in ranked:
            if rec["title"] in reg: continue
            if n >= a.max: break
            m = rec.get("meta") or {}
            lang = m.get("series") in ("lang", "lang_unsure")
            rec = {**rec, "page": (f"{m['lang']}: {m.get('section', '')}" if lang else f"Episode {m['episode']} ({m['series']})" if m.get("episode") else m.get("series", "")),
                   "caption": m.get("desc", ""), "min_w": 800 if lang else npd_MIN_W}
            e = fetch_and_register(rec, "anime_still", reg); n += 1
            e["meta"] = m
            if n % 25 == 0:
                save_registry(reg); log(f"{n} fetched, last {e['status']} {e.get('id', e.get('reason'))}")
        save_registry(reg)
    final, reasons = build_vault_naruto()
    log(f"vault: {len(final)} assets; rejected: {dict(reasons)}")
    return 0


def build_vault_naruto():
    from . import narutopedia as npd
    reg = load_registry()
    assets = []
    for e in (v for v in reg.values() if v.get("status") == "ok"):
        t = npd.derive(e["page"], e["title"], e["caption"], e["cats"], e["kind"], e["width"], e["height"], (), e.get("meta"))
        t["dominantPalette"] = e["palette"]
        if (e.get("meta") or {}).get("series") == "search": t["conf"] = "low"        # keyword-search find: char-free by title only
        assets.append({"id": e["id"], "path": f"{CACHE.relative_to(ROOT).as_posix()}/images/{e['id']}.jpg", "domain": DOMAIN, "franchise": FRANCHISE, "kind": e["kind"],
                       "source": e["source"], "source_url": e["url"], "page": e["page"], "file_title": e["title"], "caption": e["caption"],
                       "width": e["width"], "height": e["height"], "dhash": e["dhash"], "tags": t, "focus": [0.5, 0.4], "quality": e["quality"]})
    assets.sort(key=lambda a: a["id"])
    kept, dups = [], 0
    for a in assets:
        if any(imgutil.hamming(a["dhash"], k["dhash"]) <= 6 for k in kept): dups += 1; continue
        kept.append(a)
    cur = tagger.load_curation(CURATION)
    final, rej = [], 0
    for a in kept:
        if tagger.apply_curation(a, cur) and a["tags"].get("era") not in ("shippuden", "boruto"): final.append(a)
        else: rej += 1
    VAULT.write_text(json.dumps({"domain": DOMAIN, "franchise": FRANCHISE, "assets": final}, indent=1))
    reasons = Counter(e["reason"].split(":")[0] for e in reg.values() if e.get("status") == "rejected")
    reasons["duplicate"] += dups; reasons["curation_or_era"] += rej
    return final, reasons


def stats():
    v = json.loads(VAULT.read_text())["assets"]
    print(f"assets: {len(v)}")
    for title, fn in (("kind", lambda a: a["kind"]), ("aspect", lambda a: a["tags"]["aspectRatio"]), ("source", lambda a: a["source"])):
        print(f"{title}:", dict(Counter(fn(a) for a in v).most_common()))
    print("subjects:")
    for s, n in Counter(s for a in v for s in a["tags"]["subjects"]).most_common(): print(f"  {s:22s}{n:4d}" + ("" if s not in MANDATORY else ""))
    print("median resolution:", statistics.median(a["width"] for a in v), "x", statistics.median(a["height"] for a in v))


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--franchise", default="black-clover", help="franchise id from config/franchises (default black-clover)")
    ap.add_argument("--max", type=int, default=220)
    ap.add_argument("--refresh", action="store_true", help="re-fetch API JSON (images on disk are never re-downloaded)")
    ap.add_argument("--lang", help="lang wiki code (es, pt-br, ...) with --prefix")
    ap.add_argument("--prefix", action="append", default=[], help="file-name prefix on the language wiki")
    ap.add_argument("--stats", action="store_true")
    ap.add_argument("--lang-wikis", default="", help="naruto: comma list of language wikis to mine for Part I history images (es,pt-br,pl)")
    ap.add_argument("--search-places", action="store_true", help="naruto: keyword-search all wikis for character-free place/object frames")
    ap.add_argument("--discover-only", action="store_true", help="naruto: list + analyse candidates, download nothing")
    ap.add_argument("--rebuild", action="store_true", help="rebuild vault.json from registry without network")
    a = ap.parse_args(argv)
    if a.franchise != "black-clover":
        configure(a.franchise)
        if a.franchise != "naruto": raise SystemExit(f"no harvester for franchise {a.franchise!r}")
        if a.stats: stats(); return 0
        return run_naruto(a)
    if a.stats: stats(); return 0
    if a.lang:
        harvest_lang(f"https://blackclover.fandom.com/{a.lang}/api.php", a.prefix, a.lang, a.refresh)
        local = index_local_media(); final, reasons = build_vault(local); log(f"vault: {len(final)} assets"); return 0
    RAW.mkdir(parents=True, exist_ok=True); IMAGES.mkdir(parents=True, exist_ok=True)
    reg = load_registry()
    if not a.rebuild:
        cand = discover(a.refresh)
        ranked = []
        for rec in cand.values():
            kind = classify(rec)
            if not kind or rec["mime"] == "image/gif" or imgutil.NAME_REJECT.search(rec["title"]): continue
            t = tagger.derive(rec["page"], rec["title"], rec["caption"], rec["cats"], kind, rec["w"], rec["h"])
            if kind == "manga_panel":
                if not (set(t["subjects"]) & MANGA_SUBJECTS or re.match(r"File:Chapter [1-5]\.", rec["title"])) or min(rec["w"], rec["h"]) < 600: continue
            elif rec["w"] < 800 and not (rec["w"] >= 640 and (early(rec) or set(t["subjects"]) & SCARCE)): continue
            ranked.append((score(rec, t), kind, rec))
        ranked.sort(key=lambda x: -x[0])
        have = lambda k: sum(1 for e in reg.values() if e.get("status") == "ok" and e["kind"] == k)
        n_manga = 0
        for sc, kind, rec in ranked:
            if rec["title"] in reg: continue
            if kind != "manga_panel" and have("anime_still") + have("key_art") >= a.max: continue
            if kind == "manga_panel" and have("manga_panel") >= 45: continue
            if sc < 0 and not early(rec) and kind != "manga_panel": continue
            rec["lowres_ok"] = rec["w"] < 800
            e = fetch_and_register(rec, kind, reg)
            log(f"{e['status']:8s} {e.get('id', e.get('reason')):12s} {rec['title']}")
            if len(reg) % 10 == 0: save_registry(reg)
        save_registry(reg)
        jikan(reg, a.refresh)
    local = index_local_media()
    final, reasons = build_vault(local)
    log(f"vault: {len(final)} assets; rejected: {dict(reasons)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
