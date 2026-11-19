"""BlackCloverVisualHarvester: build assets/cache/black-clover/vault.json from the Black Clover Fandom wiki.

    python -m copycat.visuals.harvester [--max 220] [--refresh] [--stats] [--rebuild]
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

from . import imgutil, tagger
from .local_indexer import index_local_media

ROOT = Path(__file__).resolve().parents[2]
CACHE = ROOT / "assets/cache/black-clover"
IMAGES, RAW, VAULT, REGISTRY = CACHE / "images", CACHE / "raw", CACHE / "vault.json", CACHE / "raw/registry.json"
API = "https://blackclover.fandom.com/api.php"
UA = "HiddenWorldVisualHarvester/1.0 (non-commercial research tool; polite, cached, <=4 req/s)"
DOMAIN = "anime_black_clover"
MANGA_SUBJECTS = {"liebe", "licita", "five_leaf_grimoire", "lucius", "asta_black_form"}
MANDATORY = ["asta_young", "yuno_young", "liebe", "licita", "five_leaf_grimoire", "grimoire_tower", "hage_village", "hage_church",
             "demon_skull", "revchi", "yami", "julius", "william_vangeance", "exam_arena", "asta_black_form", "yuno", "asta"]
EXTRA_CATS = ["Licita", "Lucifero", "Lucius Zogratis", "Dante Zogratis", "Zenon Zogratis", "Orsi Orfai", "Lily Aquaria", "Patolli", "Licht"]
ENTITY_PAGES = ["Asta", "Yuno", "Liebe", "Licita", "Black Asta", "Five-leaf Clover Grimoire", "Four-leaf Clover Grimoire", "Demon-Slayer Sword", "Anti Magic",
                "Hage Village", "Orsi Orfai", "Lily Aquaria", "Revchi Salik", "Yami Sukehiro", "Noelle Silva", "Magna Swing", "Luck Voltia",
                "Vanessa Enoteca", "Finral Roulacase", "Julius Novachrono", "William Vangeance", "Patolli", "Licht", "Magic Knights Entrance Exam",
                "Royal Capital", "Black Bulls", "Dark Triad", "Dante Zogratis", "Zenon Zogratis", "Lucifero", "Lucius Zogratis"]
EPISODE_PAGES = [f"Episode {n}" for n in list(range(1, 14)) + [64, 66, 68, 102, 103, 105, 145, 146]]

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


def api(params, refresh=False):
    p = {"format": "json", "formatversion": "2", **params}
    f = RAW / ("api_" + hashlib.sha1(json.dumps(p, sort_keys=True).encode()).hexdigest()[:20] + ".json")
    if f.exists() and not refresh:
        return json.loads(f.read_text())
    d = get(API, p).json()
    f.write_text(json.dumps(d))
    return d


def api_all(params, refresh=False):
    """Follow `continue`, merging pages by pageid. Returns list of page dicts (generator queries) or raw lists."""
    pages, extra, cont = {}, [], {}
    while True:
        d = api({**params, **cont}, refresh)
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
        for p in api_all({"action": "query", "generator": "categorymembers", "gcmtitle": title, "gcmtype": "file", "gcmlimit": "50",
                          "prop": "categories|imageinfo", "cllimit": "max", "iiprop": "url|size|mime"}, refresh):
            add(page_record(p, title.replace("Category:Images of ", "")))
    subcats = lambda t: [m["title"] for m in api_all({"action": "query", "list": "categorymembers", "cmtitle": t, "cmtype": "subcat", "cmlimit": "500"}, refresh)]
    episodes = subcats("Category:Images_by_Episode")
    log(f"{len(episodes)} episode categories")
    for c in episodes: cat(c)
    chars = {c.lower() for c in subcats("Category:Images_by_Character")}
    wanted = [f"Category:Images of {n}" for n in list(tagger.CAT_SUBJECT) + [e.lower() for e in EXTRA_CATS]]
    for c in sorted({w for w in wanted if w.lower() in chars}): cat(c)
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


def score(rec, tags):
    s = 0
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
    try:
        img = imgutil.open_image(download(rec["url"]))
    except Exception as ex:
        e.update(status="rejected", reason=f"download:{type(ex).__name__}"); reg[key] = e; return e
    reason = imgutil.check(img, manga=kind == "manga_panel")
    if reason:
        e.update(status="rejected", reason=reason); reg[key] = e; return e
    nid = "bc_%04d" % (1 + max([int(v["id"][3:]) for v in reg.values() if v.get("id")] or [0]))
    IMAGES.mkdir(parents=True, exist_ok=True)
    imgutil.save_jpeg(img, IMAGES / f"{nid}.jpg")
    e.update(status="ok", id=nid, width=img.width, height=img.height, dhash=imgutil.dhash(img), palette=imgutil.palette(img), quality=imgutil.quality(img))
    reg[key] = e
    return e


def jikan(reg, refresh):
    for ep in ("pictures", "characters"):
        try:
            d = get(f"https://api.jikan.moe/v4/anime/34572/{ep}", min_gap=1.1).json()["data"]
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
                       "dhash": e["dhash"], "tags": t, "focus": [0.5, 0.4], "quality": e["quality"]})
    assets += list(local_entries)
    assets.sort(key=lambda a: -(a["width"] * a["height"]))
    kept, dups = [], 0
    for a in assets:
        if any(imgutil.hamming(a["dhash"], k["dhash"]) <= 6 for k in kept): dups += 1; continue
        kept.append(a)
    cur, final, rejected_cur = tagger.load_curation(), [], 0
    for a in sorted(kept, key=lambda a: a["id"]):
        if tagger.apply_curation(a, cur): final.append(a)
        else: rejected_cur += 1
    VAULT.write_text(json.dumps({"domain": DOMAIN, "assets": final}, indent=1))
    reasons = Counter(e["reason"].split(":")[0] for e in reg.values() if e.get("status") == "rejected")
    reasons["duplicate"] += dups; reasons["curation"] += rejected_cur
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
    ap.add_argument("--max", type=int, default=220)
    ap.add_argument("--refresh", action="store_true", help="re-fetch API JSON (images on disk are never re-downloaded)")
    ap.add_argument("--stats", action="store_true")
    ap.add_argument("--rebuild", action="store_true", help="rebuild vault.json from registry without network")
    a = ap.parse_args(argv)
    if a.stats: stats(); return 0
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
                if not set(t["subjects"]) & MANGA_SUBJECTS or min(rec["w"], rec["h"]) < 600: continue
            elif rec["w"] < 800: continue
            ranked.append((score(rec, t), kind, rec))
        ranked.sort(key=lambda x: -x[0])
        have = lambda k: sum(1 for e in reg.values() if e.get("status") == "ok" and e["kind"] == k)
        n_manga = 0
        for sc, kind, rec in ranked:
            if rec["title"] in reg: continue
            if kind != "manga_panel" and have("anime_still") + have("key_art") >= a.max: continue
            if kind == "manga_panel" and have("manga_panel") >= 20: continue
            if sc < 0: continue
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
