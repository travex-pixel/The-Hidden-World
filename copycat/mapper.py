"""Shot mapper: script.json + vault.json + timing.json -> edit.json (+ mapper_report.json).

    python -m copycat.mapper <project_id> [--estimate-timing]
"""
from __future__ import annotations

import argparse
import json
import math
import re
import sys
from pathlib import Path

from .domain_gate import AssetDomainGate

ROOT = Path(__file__).resolve().parent.parent
VAULT = ROOT / "assets/cache/black-clover/vault.json"

MIN_SHOT, MAX_SHOT = 1.2, 7.5
LOCK_SHOTS, LOCK_SECONDS = 8, 45.0
REUSE_PREFER, REUSE_CAP = 2, 3
WEAK_SCORE = 6.0          # base score below this = weak match
MIN_SCORE = 3.0           # below this (or no semantic overlap) = no acceptable asset
EMBER_CAP = 0.45
MAX_WHIPS = 6

SCARCE = {"asta_young", "liebe", "yuno_young", "sister_lily", "father_orsi"}
YOUNG = {"asta_young": "asta", "yuno_young": "yuno"}
FACE_SHOTS = {"closeup", "extreme_closeup", "medium", "action", "panel"}
NONCHAR = {"five_leaf_grimoire", "four_leaf_grimoire", "demon_slayer_sword", "anti_magic", "hage_village",
           "hage_church", "demon_skull", "grimoire_tower", "royal_capital", "exam_arena", "black_bulls_hideout",
           "dungeon", "mindscape", "night_sky", "crowd", "magic_knights", "black_bulls", "golden_dawn", "dark_triad"}
SPEAKER_SUBJECTS = {
    "ASTA": {"asta", "asta_young", "asta_black_form"},
    "YUNO": {"yuno", "yuno_young"},
    "LIEBE": {"liebe", "five_leaf_grimoire", "mindscape"},
    "YAMI": {"yami"}, "REVCHI": {"revchi"}, "JULIUS": {"julius", "lucius"}, "LUCIUS": {"lucius", "julius"},
    "FATHER_ORSI": {"father_orsi"}, "SISTER_LILY": {"sister_lily"}, "LICITA": {"licita"},
    "NOELLE": {"noelle"}, "MAGNA": {"magna"}, "LUCK": {"luck"}, "VANESSA": {"vanessa"}, "FINRAL": {"finral"},
    "WILLIAM": {"william_vangeance"}, "PATOLLI": {"patolli"}, "LICHT": {"licht"},
}
STOP = set("""a an the of in on at to and or with while over into from as is are was his her their its that this
 anime still manga panel image shot close up closeup wide frame showing shows looking ideal real black clover
 one two small big large giant above below behind front side toward towards by for it he she they
 """.split())
COMP_CAM = {"slow_push_in": "slow_pull_out", "slow_pull_out": "slow_push_in", "pan_lr": "pan_rl",
            "pan_rl": "pan_lr", "drift_up": "slow_pull_out", "impact_punch_zoom": "slow_push_in"}
CAM_CYCLE = ["slow_push_in", "pan_lr", "slow_pull_out", "pan_rl", "drift_up"]
SHOT_NEAR = {("closeup", "extreme_closeup"), ("wide", "establishing"), ("action", "medium"),
             ("medium", "closeup"), ("group", "wide"), ("panel", "closeup"), ("panel", "medium")}


def toks(s: str) -> set:
    return {w for w in re.findall(r"[a-z']+", (s or "").lower()) if w not in STOP and len(w) > 2}


# --------------------------------------------------------------------------- timeline
def estimate_timing(script: dict) -> dict:
    wpm = script.get("target_wpm", 160)
    t, beats, cards = 0.35, [], []
    for ch in script["chapters"]:
        if ch.get("card_seconds"):
            cards.append(dict(chapter=ch["id"], numeral=ch.get("numeral"), title=ch.get("title"),
                              start=round(t, 3), end=round(t + ch["card_seconds"], 3)))
            t += ch["card_seconds"]
        for b in ch["beats"]:
            d = len(b["text"].split()) * 60.0 / wpm
            beats.append(dict(id=b["id"], speaker=b["speaker"], chapter=ch["id"], start=round(t, 3),
                              end=round(t + d, 3), text=b["text"]))
            t += d + b.get("pause_after_ms", 200) / 1000.0
    return dict(duration=round(t + 0.6, 3), sample_rate=48000, beats=beats, cards=cards, estimated=True)


def load_timing(pid: str, force_estimate: bool, script: dict) -> dict:
    p = ROOT / "build/copycat" / pid / "audio/timing.json"
    if not force_estimate and p.exists():
        t = json.loads(p.read_text())
        known = {b["id"] for ch in script["chapters"] for b in ch["beats"]}
        if {b["id"] for b in t["beats"]} == known:
            return t
        print("timing.json beat ids differ from script -> estimating", file=sys.stderr)
    return estimate_timing(script)


# --------------------------------------------------------------------------- skeleton
def build_skeleton(script: dict, timing: dict):
    """Ordered list of shot slots: cards and cut slots with exact times."""
    tb = {b["id"]: b for b in timing["beats"]}
    cards = {c["chapter"]: c for c in timing.get("cards", [])}
    dur = timing["duration"]
    flat = [(ch, b) for ch in script["chapters"] for b in ch["beats"]]
    # picture start / end per beat
    pstart, pend = {}, {}
    for i, (ch, b) in enumerate(flat):
        first_of_ch = i == 0 or flat[i - 1][0]["id"] != ch["id"]
        if i == 0:
            pstart[b["id"]] = 0.0
        elif first_of_ch and ch["id"] in cards:
            pstart[b["id"]] = cards[ch["id"]]["end"]
        else:
            pstart[b["id"]] = tb[b["id"]]["start"]
        if i + 1 < len(flat):
            nch, nb = flat[i + 1]
            pend[b["id"]] = cards[nch["id"]]["start"] if nch["id"] != ch["id"] and nch["id"] in cards else tb[nb["id"]]["start"]
        else:
            pend[b["id"]] = dur
    slots, notes = [], []
    prev_ch = None
    for i, (ch, b) in enumerate(flat):
        if ch["id"] != prev_ch and ch["id"] in cards:
            c = cards[ch["id"]]
            slots.append(dict(type="card", start=c["start"], end=c["end"], chapter=ch["id"],
                              card=dict(numeral=c.get("numeral"), title=c.get("title"))))
        prev_ch = ch["id"]
        s, e = pstart[b["id"]], pend[b["id"]]
        # make sure picture starts where the previous slot ended
        if slots and abs(slots[-1]["end"] - s) > 1e-6:
            s = slots[-1]["end"]
        D = e - s
        vis = b["visuals"]
        n = len(vis)
        while n > 1 and D / n < MIN_SHOT:
            n -= 1
        if D < MIN_SHOT and slots and slots[-1]["type"] == "cut":
            slots[-1]["end"] = e                       # absorb a too-short beat into the previous shot
            notes.append(f"{b['id']} picture {D:.2f}s absorbed into previous shot")
            continue
        parts = []
        for ci in range(n):
            cs, ce = s + D * ci / n, s + D * (ci + 1) / n
            k = max(1, math.ceil((ce - cs) / MAX_SHOT - 1e-9))
            for si in range(k):
                parts.append((ci, si, cs + (ce - cs) * si / k, cs + (ce - cs) * (si + 1) / k))
        for ci, si, ps, pe in parts:
            v = vis[ci]
            slots.append(dict(type="cut", start=ps, end=pe, chapter=ch["id"], beat=b, beat_id=b["id"],
                              cut_index=ci, sub=si, spec=v, first=(ci == 0 and si == 0),
                              last_of_ch=False, prev_beat=flat[i - 1][1] if i else None,
                              after_card=(si == 0 and ci == 0 and slots and slots[-1]["type"] == "card")))
    # snap boundaries exactly (float safety)
    for a, b2 in zip(slots, slots[1:]):
        b2["start"] = a["end"]
    slots[0]["start"] = 0.0
    slots[-1]["end"] = dur
    return slots, notes


# --------------------------------------------------------------------------- scoring
class Scorer:
    def __init__(self, assets):
        self.assets = assets
        self.tok = {a["id"]: toks(" ".join([a.get("file_title", ""), a.get("caption", ""), a.get("page", "")]))
                    for a in assets}

    def score(self, slot, a, speaker_rule=True):
        sp, tg = slot["spec"], a["tags"]
        subs = sp.get("subjects") or []
        asub = set(tg.get("subjects") or [])
        s = 0.0
        if subs and subs[0] in asub:
            s += 4.0
        for o in subs[1:3]:
            if o in asub:
                s += 1.5
        loc = sp.get("location")
        if loc and (tg.get("location") == loc or loc in asub):
            s += 2.0
        m = sp.get("mood")
        if set(m if isinstance(m, list) else [m]) & set(tg.get("mood") or []):
            s += 1.0
        st, at = sp.get("shot"), tg.get("shotType")
        if st and at:
            if st == at:
                s += 1.0
            elif (st, at) in SHOT_NEAR or (at, st) in SHOT_NEAR:
                s += 0.5
        q = toks(sp.get("query", "")) & self.tok[a["id"]]
        s += min(2.0, 0.5 * len(q))
        sem = s
        s += a.get("quality", 0.5) * 1.0
        if a.get("lowres"):
            s -= 1.5
        if tg.get("aspectRatio") == "16:9":
            s += 0.5
        # young-variant strictness
        for y, adult in YOUNG.items():
            if y in subs and adult not in subs:
                if adult in asub and y not in asub:
                    s -= 8.0 if at in FACE_SHOTS else 2.0
            elif adult in subs and y not in subs and y in asub and adult not in asub:
                s -= 3.0
        # wrong characters in frame
        extra = [x for x in asub if x not in NONCHAR and x not in subs and x != "lucius"]
        if extra and subs and subs[0] not in NONCHAR:
            s -= min(1.5, 0.5 * len(extra))
        # don't burn scarce subjects on cuts that don't ask for them
        for sc in SCARCE:
            if sc in asub and sc not in subs:
                s -= 3.0
        # speaker rule
        if speaker_rule and slot["first"]:
            allowed = SPEAKER_SUBJECTS.get(slot["beat"]["speaker"])
            if allowed and not (allowed & (asub | {tg.get("location")})):
                s -= 6.0
        return s, sem


def acceptable(sem, score):
    return score >= MIN_SCORE and sem >= 1.2


# --------------------------------------------------------------------------- assignment
class Assigner:
    def __init__(self, slots, assets, scorer, pinned):
        self.slots, self.assets, self.sc = slots, assets, scorer
        self.cuts = [i for i, s in enumerate(slots) if s["type"] == "cut"]
        self.by_id = {a["id"]: a for a in assets}
        self.cand = {}
        self.base = {}
        for i in self.cuts:
            sl = slots[i]
            rows = []
            for a in assets:
                s, sem = scorer.score(sl, a)
                if acceptable(sem, s):
                    rows.append((s, a["id"]))
            rows.sort(reverse=True)
            self.cand[i] = [r[1] for r in rows[:40]]
            self.base[i] = {aid: s for s, aid in rows}
        self.assign = {i: None for i in self.cuts}
        self.pinned = pinned
        self.uses = {}                      # asset -> set of slot idx
        for i, aid in pinned.items():
            self._set(i, aid)
        self.scarce_by_ch = {}

    def _set(self, i, aid):
        old = self.assign.get(i)
        if old:
            self.uses[old].discard(i)
        self.assign[i] = aid
        if aid:
            self.uses.setdefault(aid, set()).add(i)

    def feasible(self, i, aid):
        for j in self.uses.get(aid, ()):
            if j == i:
                continue
            if abs(j - i) < LOCK_SHOTS or abs(self.slots[j]["start"] - self.slots[i]["start"]) < LOCK_SECONDS:
                return False
        others = len(self.uses.get(aid, ())) - (1 if i in self.uses.get(aid, ()) else 0)
        return others < REUSE_CAP

    def value(self, i, aid):
        if not self.feasible(i, aid):
            return None
        v = self.base[i][aid]
        sl = self.slots[i]
        js = [j for j in self.uses.get(aid, ()) if j != i]
        v -= {0: 0.0, 1: 1.2}.get(len(js), 4.0)
        if js:
            gap = min(abs(self.slots[j]["start"] - sl["start"]) for j in js)
            asub = set(self.by_id[aid]["tags"]["subjects"])
            coef = 1.5 if (asub & SCARCE) else 0.5
            v -= coef * max(0.0, 1.0 - gap / 120.0)
        return v

    def best_for(self, i):
        best, bv = None, -1e9
        for aid in self.cand[i]:
            v = self.value(i, aid)
            if v is not None and v > bv:
                best, bv = aid, v
        return best, bv

    def run(self, sweeps=8):
        order = sorted((i for i in self.cuts if i not in self.pinned), key=lambda i: len(self.cand[i]))
        for i in order:                                   # most constrained first
            aid, _ = self.best_for(i)
            if aid:
                self._set(i, aid)
        for _ in range(sweeps):
            changed = 0
            for i in self.cuts:
                if i in self.pinned:
                    continue
                cur = self.assign[i]
                cv = self.value(i, cur) if cur else None
                aid, bv = self.best_for(i)
                if aid and aid != cur and (cv is None or bv > cv + 1e-6):
                    self._set(i, aid)
                    changed += 1
            if not changed:
                break


# --------------------------------------------------------------------------- directives
def kind_layout(a):
    w, h = a["width"], a["height"]
    r = w / h
    if a.get("kind") == "manga_panel" or a.get("lowres") or not (1.6 <= r <= 2.0) or w < 1100:
        return "depth_frame"
    return "fill"


def accent_for(slot, a):
    sp = set(slot["spec"].get("subjects") or []) | set(a["tags"]["subjects"])
    mood = slot["spec"].get("mood")
    moods = set(mood if isinstance(mood, list) else [mood])
    if sp & {"liebe", "anti_magic", "lucifero", "demon_skull", "asta_black_form"} or "combat" in moods:
        return "crimson"
    if sp & {"julius", "lucius", "william_vangeance", "royal_capital", "magic_knights", "golden_dawn"}:
        return "gold"
    if sp & {"asta", "asta_young"} and moods & {"emotional", "quiet", "determined", "triumphant"}:
        return "emerald"
    if moods & {"ominous", "epic", "shock"}:
        return "crimson"
    return None


def pick_camera(slot, prev_cam, asset_shot):
    beat = slot["beat"]
    shot = slot["spec"].get("shot")
    if slot["first"]:
        cam = beat.get("camera") or ("slow_pull_out" if shot in ("wide", "establishing") else "slow_push_in")
    else:
        cam = COMP_CAM.get(beat.get("camera") or "slow_push_in", "slow_pull_out")
        if slot["cut_index"] >= 2 or slot["sub"] >= 1:
            cam = CAM_CYCLE[(CAM_CYCLE.index(cam) + 2) % len(CAM_CYCLE)] if cam in CAM_CYCLE else "pan_lr"
    if shot in ("wide", "establishing") and cam in ("slow_push_in", "drift_up"):
        cam = "slow_pull_out"
    if cam == prev_cam:
        cam = COMP_CAM.get(cam, "slow_push_in")
        if cam == prev_cam:
            cam = CAM_CYCLE[(CAM_CYCLE.index(prev_cam) + 1) % len(CAM_CYCLE)] if prev_cam in CAM_CYCLE else "slow_push_in"
    if cam == "impact_punch_zoom" and not slot["first"]:
        cam = "slow_push_in" if prev_cam != "slow_push_in" else "pan_lr"
    return cam


def build_shots(slots, assign, by_id, overrides):
    shots, prev_cam = [], None
    for n, sl in enumerate(slots):
        sid = f"s{n + 1:03d}"
        if sl["type"] == "card":
            shots.append(dict(id=sid, start=round(sl["start"], 3), end=round(sl["end"], 3), type="card", asset_id=None,
                              asset_path=None, layout="fill", focus=[0.5, 0.4], camera="slow_push_in", vfx=[],
                              transition_in="cut", treatment="anime", accent=None, beat_id=None, speaker=None,
                              chapter=sl["chapter"], card=sl["card"]))
            prev_cam = "slow_push_in"
            continue
        a = by_id.get(assign.get(n))
        beat = sl["beat"]
        key = f"{sl['beat_id']}#{sl['cut_index']}" + (f".{sl['sub']}" if sl["sub"] else "")
        ov = overrides.get(key, {})
        if a is None:
            shots.append(dict(id=sid, start=round(sl["start"], 3), end=round(sl["end"], 3), type="still", asset_id=None,
                              asset_path=None, layout="fill", focus=[0.5, 0.4], camera=pick_camera(sl, prev_cam, None),
                              vfx=[], transition_in="cut", treatment="anime", accent=None, beat_id=sl["beat_id"],
                              speaker=beat["speaker"], chapter=sl["chapter"], card=None, _key=key, _slot=n))
            continue
        cam = ov.get("camera") or pick_camera(sl, prev_cam, a["tags"].get("shotType"))
        prev_cam = cam
        vfx = [v for v in beat.get("vfx", []) if sl["first"] or v not in ("impact_flash", "speed_lines")]
        sp = set(sl["spec"].get("subjects") or []) | set(a["tags"]["subjects"])
        auto = False
        if "embers" not in vfx and sp & {"liebe", "anti_magic", "mindscape"}:
            vfx.append("embers")
            auto = True
        treat = ov.get("treatment") or ("manga_motion" if a.get("kind") == "manga_panel" else "anime")
        acc = ov.get("accent") or accent_for(sl, a)
        if treat == "manga_motion" and not acc:
            acc = "crimson"
        shots.append(dict(
            id=sid, start=round(sl["start"], 3), end=round(sl["end"], 3), type="still", asset_id=a["id"],
            asset_path=a["path"], layout=ov.get("layout") or kind_layout(a), focus=ov.get("focus") or a.get("focus") or [0.5, 0.4],
            camera=cam, vfx=ov["vfx"] if "vfx" in ov else vfx, transition_in=ov.get("transition_in", "cut"),
            treatment=treat, accent=acc, beat_id=sl["beat_id"], speaker=beat["speaker"], chapter=sl["chapter"],
            card=None, _key=key, _slot=n, _auto_ember=auto))
    return shots


def finish_shots(shots, slots, overrides):
    # embers cap
    lim = int(EMBER_CAP * len(shots))
    ember = [s for s in shots if "embers" in s.get("vfx", []) and not overrides.get(s.get("_key"), {}).get("vfx")]
    if len(ember) > lim:
        def keep_rank(s):                              # lower = remove first
            sl = slots[s["_slot"]]
            core = bool(set(sl["spec"].get("subjects") or []) & {"liebe", "mindscape", "anti_magic"})
            return (core, not s.get("_auto_ember"))
        ember.sort(key=keep_rank)
        for s in ember[: len(ember) - lim]:
            s["vfx"] = [v for v in s["vfx"] if v != "embers"]
    # transitions
    energetic = {"combat": 3, "epic": 2, "shock": 2, "determined": 1}
    cands = []
    prev = None
    for k, s in enumerate(shots):
        if s["type"] == "still" and "_slot" in s:
            sl = slots[s["_slot"]]
            ov = overrides.get(s["_key"], {})
            if "transition_in" not in ov:
                mood = sl["spec"].get("mood")
                moods = set(mood if isinstance(mood, list) else [mood])
                pb = sl["prev_beat"]
                if prev is not None and prev["type"] == "card":
                    s["transition_in"] = "dissolve"
                elif sl["first"] and "impact_flash" in sl["beat"].get("vfx", []):
                    s["transition_in"] = "flash"
                elif sl["first"] and moods & {"quiet", "emotional"} and pb and pb.get("pause_after_ms", 0) >= 400:
                    s["transition_in"] = "dissolve"
                elif sl["first"] and prev is not None and prev["type"] == "still":
                    ploc = slots[prev["_slot"]]["spec"].get("location") if "_slot" in prev else None
                    sc = max((energetic.get(m, 0) for m in moods), default=0)
                    if sc and sl["spec"].get("location") != ploc:
                        cands.append((sc + (1 if s["camera"].startswith("pan") else 0), k))
        prev = s
    cands.sort(reverse=True)
    chosen = []
    for sc, k in cands:
        if all(abs(k - c) >= 12 for c in chosen):
            chosen.append(k)
        if len(chosen) >= MAX_WHIPS:
            break
    for k in chosen:
        shots[k]["transition_in"] = "whip"
    for s in shots:
        for k in ("_key", "_slot", "_auto_ember"):
            s.pop(k, None)
    return shots


# --------------------------------------------------------------------------- captions
def split_caption(text, start, end, limit=84):
    if len(text) <= limit:
        return [(text, start, end)]
    mids = [m.end() for m in re.finditer(r"[.!?…]+[\"')\]]*\s+", text)] or [m.end() for m in re.finditer(r"[,;:—–-]+\s+", text)]
    if not mids:
        mids = [m.end() for m in re.finditer(r"\s+", text)]
    cut = min(mids, key=lambda p: abs(p - len(text) / 2))
    a, b = text[:cut].strip(), text[cut:].strip()
    tm = start + (end - start) * len(a) / (len(a) + len(b))
    return [(a, start, tm), (b, tm, end)]


def build_captions(script, timing):
    tb = {b["id"]: b for b in timing["beats"]}
    out = []
    for ch in script["chapters"]:
        for b in ch["beats"]:
            t = tb[b["id"]]
            for txt, s, e in split_caption(t.get("text") or b["text"], t["start"], t["end"]):
                out.append(dict(start=round(s, 3), end=round(e, 3), text=txt, speaker=b["speaker"]))
    return out


# --------------------------------------------------------------------------- main
def load_assets(gate, curation):
    v = json.loads(VAULT.read_text())
    assets = gate.filter(v["assets"])
    out, missing = [], []
    for a in assets:
        if curation.get(a["id"], {}).get("reject"):
            continue
        if not (ROOT / a["path"]).exists():
            missing.append(a["id"])
            continue
        out.append(a)
    return out, missing, len(v["assets"])


def violations(shots):
    last, bad = {}, []
    for k, s in enumerate(shots):
        aid = s.get("asset_id")
        if not aid:
            continue
        if aid in last:
            pk, pt = last[aid]
            if k - pk < LOCK_SHOTS or s["start"] - pt < LOCK_SECONDS:
                bad.append(dict(asset=aid, shot=s["id"], gap_shots=k - pk, gap_s=round(s["start"] - pt, 1)))
        last[aid] = (k, s["start"])
    return bad


def run(pid, estimate=False, write=True):
    proj = ROOT / "copycat/projects" / pid
    script = json.loads((proj / "script.json").read_text())
    gate = AssetDomainGate(script["domain"])
    cur_p = proj / "curation.json"
    curation = json.loads(cur_p.read_text()) if cur_p.exists() else {}
    assets, missing, vault_n = load_assets(gate, curation)
    by_id = {a["id"]: a for a in assets}
    timing = load_timing(pid, estimate, script)
    slots, notes = build_skeleton(script, timing)
    ov_p = proj / "shot_overrides.json"
    overrides = {k: v for k, v in json.loads(ov_p.read_text()).items() if not k.startswith("_")} if ov_p.exists() else {}
    key_slot = {}
    for i, s in enumerate(slots):
        if s["type"] == "cut":
            key_slot[f"{s['beat_id']}#{s['cut_index']}" + (f".{s['sub']}" if s["sub"] else "")] = i
    warnings, pinned = [], {}
    for k, ov in overrides.items():
        if k not in key_slot:
            warnings.append(f"override {k}: no such cut")
            continue
        aid = ov.get("asset_id")
        if aid:
            if aid not in by_id:
                warnings.append(f"override {k}: asset {aid} not in gate-approved vault")
            else:
                pinned[key_slot[k]] = aid
    scorer = Scorer(assets)
    A = Assigner(slots, assets, scorer, {})
    # pins validated against the lock in slot order
    for i in sorted(pinned):
        aid = pinned[i]
        if A.feasible(i, aid):
            A.base[i].setdefault(aid, scorer.score(slots[i], by_id[aid])[0])
            A.cand[i] = [aid] + [c for c in A.cand[i] if c != aid]
            A.pinned[i] = aid
            A._set(i, aid)
        else:
            warnings.append(f"override {slots[i]['beat_id']}#{slots[i]['cut_index']}: {aid} breaks the repetition lock/cap; ignored")
    A.run()
    assign = A.assign
    shots = build_shots(slots, assign, by_id, overrides)
    shots = finish_shots(shots, slots, overrides)
    edit = dict(id=pid, width=1920, height=1080, fps=30, duration=timing["duration"], shots=shots,
                captions=build_captions(script, timing))
    if write:
        (proj / "edit.json").write_text(json.dumps(edit, indent=1))
    rep = report(slots, shots, assign, by_id, A, script, vault_n, len(assets), missing, warnings, notes, timing)
    if write:
        out = ROOT / "build/copycat" / pid
        out.mkdir(parents=True, exist_ok=True)
        (out / "mapper_report.json").write_text(json.dumps(rep, indent=1))
    return edit, rep


def report(slots, shots, assign, by_id, A, script, vault_n, usable, missing, warnings, notes, timing):
    uses = {}
    for s in shots:
        if s["asset_id"]:
            uses[s["asset_id"]] = uses.get(s["asset_id"], 0) + 1
    tot = sum(s["end"] - s["start"] for s in shots)
    stills = [s for s in shots if s["type"] == "still"]
    real = sum(s["end"] - s["start"] for s in stills if s["asset_id"] and by_id[s["asset_id"]].get("source") != "generated")
    cardt = sum(s["end"] - s["start"] for s in shots if s["type"] == "card")
    ln = lambda L: round(sum(s["end"] - s["start"] for s in L) / len(L), 2) if L else None
    chap = {}
    for s in stills:
        chap.setdefault(s["chapter"], []).append(s)
    weak, unmatched, spk = [], [], []
    for n, sl in enumerate(slots):
        if sl["type"] != "cut":
            continue
        sh = shots[n]
        aid = assign.get(n)
        if not aid:
            unmatched.append(dict(shot=sh["id"], beat=sh["beat_id"], cut=sl["cut_index"],
                                  want=sl["spec"].get("subjects"), query=sl["spec"].get("query")))
            continue
        sc, sem = A.sc.score(sl, by_id[aid])
        if sc < WEAK_SCORE:
            weak.append(dict(shot=sh["id"], beat=f"{sl['beat_id']}#{sl['cut_index']}", asset=aid, score=round(sc, 1),
                             want=sl["spec"].get("subjects")))
        allowed = SPEAKER_SUBJECTS.get(sl["beat"]["speaker"])
        if sl["first"] and allowed and not (allowed & (set(by_id[aid]["tags"]["subjects"]) | {by_id[aid]["tags"].get("location")})):
            spk.append(f"{sh['id']} {sl['beat_id']} speaker {sl['beat']['speaker']} not shown")
    viol = violations(shots)
    return dict(shots=len(shots), cards=len(shots) - len(stills), vault_assets=vault_n, usable_assets=usable,
                unique_assets=len(uses), max_uses_of_one_asset=max(uses.values()) if uses else 0,
                assets_used_3x=sum(1 for v in uses.values() if v >= 3),
                repetition_violations=len(viol), repetition_detail=viol[:10],
                avg_cut_s=ln(stills), avg_cut_first30s=ln([s for s in stills if s["start"] < 30]),
                avg_cut_per_chapter={k: ln(v) for k, v in chap.items()},
                pct_runtime_real_stills=round(100 * real / tot, 1), pct_runtime_cards=round(100 * cardt / tot, 1),
                weak_matches=weak, unmatched_cuts=unmatched, speaker_unmet=spk, warnings=warnings + notes,
                missing_files=missing, timing="estimated" if timing.get("estimated") else "audio",
                duration=timing["duration"], embers_pct=round(100 * sum(1 for s in shots if "embers" in s["vfx"]) / len(shots), 1),
                whips=sum(1 for s in shots if s["transition_in"] == "whip"))


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("--estimate-timing", action="store_true")
    a = ap.parse_args(argv)
    edit, rep = run(a.project, a.estimate_timing)
    brief = {k: v for k, v in rep.items() if k not in ("weak_matches", "unmatched_cuts", "repetition_detail")}
    print(json.dumps(brief, indent=1))
    print(f"weak: {len(rep['weak_matches'])}  unmatched: {len(rep['unmatched_cuts'])}")
    for u in rep["unmatched_cuts"][:15]:
        print("  UNMATCHED", u)
    return 1 if rep["unmatched_cuts"] or rep["repetition_violations"] else 0


if __name__ == "__main__":
    sys.exit(main())
