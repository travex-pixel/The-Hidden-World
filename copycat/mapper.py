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

from . import franchise as franchise_mod
from . import whitelist as wl_mod
from .domain_gate import AssetDomainGate

ROOT = Path(__file__).resolve().parent.parent
VAULT = ROOT / "assets/cache/black-clover/vault.json"    # legacy default; run() resolves the vault per franchise

MIN_SHOT, MAX_SHOT = 1.2, 7.5
MIN_BEAT = 1.0                 # a beat shorter than this is absorbed into the previous shot
MAX_SHOT_COLD = 3.0            # cold open cuts every 2-3 s
MIN_CUT_MAIN = 3.4             # main story: drop extra cuts of a beat rather than cut faster than this
NEAR_DUP = 10                  # dhash hamming distance counted as the same scene angle
NEAR_GAP = 10                  # shots required between near-duplicate frames
LOCK_SHOTS, LOCK_SECONDS = 8, 45.0
REUSE_PREFER, REUSE_CAP = 1, 2
WEAK_SCORE = 6.0          # base score below this = weak match
MIN_SCORE = 3.0           # below this (or no semantic overlap) = no acceptable asset
EMBER_CAP = 0.45
MAX_WHIPS = 6

SCARCE = {"asta_young", "liebe", "yuno_young", "sister_lily", "father_orsi"}
YOUNG = {"asta_young": "asta", "yuno_young": "yuno"}
ATMOS = {"hage_village", "hage_church", "demon_skull"}
ATMOS2 = ATMOS | {"grimoire_tower", "five_leaf_grimoire", "night_sky", "mindscape"}
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


# --------------------------------------------------------------------------- franchise profile
# Everything franchise-specific the scorer needs. Black Clover = the constants above, untouched.
P = dict(scarce=SCARCE, young=YOUNG, atmos=ATMOS, atmos2=ATMOS2, nonchar=NONCHAR, speaker_subjects=SPEAKER_SUBJECTS,
         ember_subjects={"liebe", "anti_magic", "mindscape"}, accent="bc", lock_seconds=LOCK_SECONDS, era=None,
         avg_shot_s=None, avoid={}, avoid_penalty=3.0, young_fallback=True, era_agnostic=set(), aliases={},
         time_by_chapter={}, time_by_beat={}, merge_short_s=0.0, crowd_penalty=0.0, trust_mode=False,
         wl=None, wl_cfg=None, extra_inserts={}, cold_avg=0.0, merge_cross_s=0.0, merge_max_s=8.0, avg_by_chapter={}, max_shot=MAX_SHOT, split_bias=1.0, cold_max_shot=MAX_SHOT_COLD,
         grid_plan=[], gap_exempt=[], strict_reuse=False, lock_shots=None, holds={})

NARUTO_ALIASES = {
    "forbidden_scroll": ("document", "paperwork"), "paperwork": ("document", "letter", "book"), "document": ("paperwork", "letter", "book", "forbidden_scroll"),
    "archive": ("library", "hokage_office", "document", "paperwork", "classroom"), "library": ("archive", "classroom", "academy", "book"),
    "ink_brush": ("document", "letter", "paperwork"), "letter": ("document", "paperwork"), "ledger": ("document", "paperwork", "book"),
    "hokage_office": ("hokage_monument", "konoha_village"), "naruto_apartment": ("rooftop", "konoha_village"), "ramen": ("ichiraku",),
    "mission_desk": ("hokage_office", "document"), "training_ground": ("forest", "land_of_waves"), "forest_night": ("forest", "night_sky"),
    "naruto_clones": ("naruto",), "crystal_ball": ("hiruzen",), "seal_mark": ("seal_cage", "kurama"), "seal_cage": ("kurama", "seal_mark"),
    "memorial_stone": ("training_ground", "uchiha_district"), "headband": ("naruto", "iruka"), "bells": ("kakashi", "team7"),
}

NARUTO_NONCHAR = {"forest_night", "konoha_village", "hokage_monument", "hokage_office", "academy", "classroom", "archive", "library", "ichiraku",
                  "naruto_apartment", "training_ground", "seal_cage", "night_sky", "sunrise", "memorial_stone", "bridge", "mist", "land_of_waves",
                  "tazuna_house", "gato_office", "exam_hall", "forest_of_death", "arena", "barrier", "uchiha_district", "hospital", "mission_desk",
                  "rooftop", "forest", "forbidden_scroll", "paperwork", "crystal_ball", "headband", "bells", "seal_mark", "shuriken", "fireball", "ramen",
                  "document", "letter", "ink_brush", "ledger", "ice_mirrors", "kunai", "bingo_book", "coffins", "exam_paper", "info_cards", "water_prison",
                  "lightning_blade", "book", "villagers", "genin_crowd"}
NARUTO_SPEAKERS = {
    "NARUTO": {"naruto", "naruto_clones"}, "CLONE": {"naruto_clones", "naruto"}, "IRUKA": {"iruka"}, "MIZUKI": {"mizuki"}, "HIRUZEN": {"hiruzen", "hokage_office", "crystal_ball"},
    "KAKASHI": {"kakashi", "young_kakashi"}, "SASUKE": {"sasuke"}, "SAKURA": {"sakura"}, "KURAMA": {"kurama", "seal_cage"}, "DANZO": {"danzo", "root"},
    "TAZUNA": {"tazuna"}, "ZABUZA": {"zabuza"}, "HAKU": {"haku"}, "INARI": {"inari"}, "GATO": {"gato"}, "KABUTO": {"kabuto"}, "IBIKI": {"ibiki"}, "ANKO": {"anko"},
    "OROCHIMARU": {"orochimaru"}, "GAARA": {"gaara"}, "JIRAIYA": {"jiraiya"}, "MINATO": {"minato"}, "KUSHINA": {"kushina"},
}


def project_config(proj: Path, curation: dict, ov_all: dict) -> dict:
    """Optional per-project mapper knobs: curation.json['_config'] / shot_overrides.json['_config'] / mapper_config.json."""
    cfg = {}
    f = proj / "mapper_config.json"
    if f.exists():
        cfg.update(json.loads(f.read_text()))
    cfg.update(curation.get("_config", {}))
    cfg.update(ov_all.get("_config", {}))
    return cfg


def configure(fr_id: str, script: dict, cfg: dict, pid: str):
    """Set the module profile P for this run (also resets it to Black Clover for bc projects)."""
    P.update(scarce=SCARCE, young=YOUNG, atmos=ATMOS, atmos2=ATMOS2, nonchar=NONCHAR, speaker_subjects=SPEAKER_SUBJECTS,
             ember_subjects={"liebe", "anti_magic", "mindscape"}, accent="bc", lock_seconds=LOCK_SECONDS, era=None,
             avg_shot_s=None, avoid={}, avoid_penalty=3.0, young_fallback=True, era_agnostic=set(), aliases={},
             time_by_chapter={}, time_by_beat={}, merge_short_s=0.0, crowd_penalty=0.0, trust_mode=False,
             wl=None, wl_cfg=None, extra_inserts={}, cold_avg=0.0, merge_cross_s=0.0, merge_max_s=8.0, avg_by_chapter={}, max_shot=MAX_SHOT, split_bias=1.0, cold_max_shot=MAX_SHOT_COLD,
             grid_plan=[], gap_exempt=[], strict_reuse=False, lock_shots=None, holds={})
    if fr_id == "naruto":
        P.update(scarce={"kushina", "minato", "tobirama", "kurama", "danzo", "enma", "rin", "obito", "young_kakashi", "orochimaru", "jiraiya", "ibiki", "anko"},
                 young={"young_kakashi": "kakashi"}, atmos=set(), atmos2=set(), nonchar=NARUTO_NONCHAR, speaker_subjects=NARUTO_SPEAKERS,
                 ember_subjects={"kurama", "seal_cage"}, accent="naruto", lock_seconds=90.0, young_fallback=False,
                 era=script.get("era", cfg.get("era", "part1")), aliases=NARUTO_ALIASES,
                 era_agnostic={"minato", "kushina", "tobirama", "obito", "rin", "young_kakashi", "haku", "zabuza", "gato", "tazuna", "inari", "demon_brothers",
                               "mizuki", "iruka", "hiruzen", "anbu", "danzo", "root", "kurama", "villagers", "genin_crowd", "teuchi", "ibiki", "anko", "enma"})
    if fr_id == "naruto":
        P["time_by_chapter"] = cfg.get("time_by_chapter", {})
        P["time_by_beat"] = cfg.get("time_by_beat", {})
        P["merge_short_s"] = float(cfg.get("merge_short_s", 0.0))
        P["crowd_penalty"] = float(cfg.get("crowd_penalty", 3.0))
        P["trust_mode"] = bool(cfg.get("trust_mode", False))
        P["merge_cross_s"] = float(cfg.get("merge_cross_s", 0.0))
        P["merge_max_s"] = float(cfg.get("merge_max_s", 8.0))
        P["avg_by_chapter"] = cfg.get("avg_by_chapter", {})
        P["wl_cfg"] = cfg.get("wl")
        P["extra_inserts"] = cfg.get("extra_inserts") or {}
        P["max_shot"] = float(cfg.get("max_shot", MAX_SHOT))
        P["split_bias"] = float(cfg.get("split_bias", 1.0))
        P["cold_max_shot"] = float(cfg.get("cold_max_shot", MAX_SHOT_COLD))
        P["cold_avg"] = float(cfg.get("cold_avg", 0.0))
        P["grid_plan"] = cfg.get("grid_plan") or []
        P["gap_exempt"] = cfg.get("gap_exempt") or []
        P["strict_reuse"] = bool(cfg.get("strict_reuse", False))
        P["lock_shots"] = int(cfg.get("lock_shots", 0)) or None
    if cfg.get("lock_seconds"): P["lock_seconds"] = float(cfg["lock_seconds"])
    if cfg.get("avg_shot_s"): P["avg_shot_s"] = float(cfg["avg_shot_s"])
    avoid = {}
    for other in cfg.get("avoid_assets_from", []):
        ep = ROOT / "copycat/projects" / other / "edit.json"
        if other != pid and ep.exists():
            for sh in json.loads(ep.read_text()).get("shots", []):
                if sh.get("asset_id"): avoid[sh["asset_id"]] = avoid.get(sh["asset_id"], 0) + 1
    P["avoid"] = avoid
    if "avoid_penalty" in cfg: P["avoid_penalty"] = float(cfg["avoid_penalty"])


def toks(s: str) -> set:
    return {w for w in re.findall(r"[a-z']+", (s or "").lower()) if w not in STOP and len(w) > 2}


def _ins(b):
    return (P.get("holds") or {}).get(b["id"]) or b.get("insert") or (P.get("extra_inserts") or {}).get(b["id"])


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
        ins_tail = None
        if _ins(b):                              # designed document insert: one shot per view, no real frame
            ins = _ins(b)
            at = float(ins.get("at", 0.0))
            tbt = tb[b["id"]]

            def insert_slots(s0, e0, first_flag):
                views = ins.get("views") or [{}]
                out = []
                for vi, vw in enumerate(views):
                    cs, ce = s0 + (e0 - s0) * vi / len(views), s0 + (e0 - s0) * (vi + 1) / len(views)
                    spec = {k: v for k, v in ins.items() if k not in ("views", "at")}
                    spec.update(view=vw, beat_text=b["text"], beat_start=round(tbt["start"], 3), beat_end=round(tbt["end"], 3))
                    out.append(dict(type="insert", start=cs, end=ce, chapter=ch["id"], beat=b, beat_id=b["id"], cut_index=len(vis) + vi if at > 0 else vi,
                                    sub=0, spec=dict(vis[0], subjects=[], mood=vis[0].get("mood")), first=(first_flag and vi == 0), last_of_ch=False,
                                    prev_beat=flat[i - 1][1] if i else None, insert=spec,
                                    stamp=(b.get("stamp") if (first_flag and vi == 0) else None), after_card=False))
                return out
            if at <= 0:
                slots.extend(insert_slots(s, e, True))
                continue
            ins_tail = insert_slots(s + D * at, e, False)
            e = s + D * at                                # the first part of the beat keeps its normal real-frame cut(s)
            D = e - s
        n = len(vis)
        cold = ch["id"] == "cold_open"
        lic = any("licita" in (v.get("subjects") or []) for v in vis)   # keep the Licita cut when her name is spoken
        while n > 1 and D / n < (2.0 if cold else (1.7 if lic else MIN_CUT_MAIN)):
            n -= 1
        avg = P["avg_by_chapter"].get(ch["id"], P["avg_shot_s"])
        if cold and P["cold_avg"]:
            avg = P["cold_avg"]
        if avg and (not cold or P["cold_avg"]):                           # long-form: target average shot length, shorter in action/comedy
            bm = {m for v in vis for m in (v.get("mood") if isinstance(v.get("mood"), list) else [v.get("mood")])}
            ea = avg * 0.6 if bm & {"action", "combat", "comedy", "comedic"} else avg
            n = max(1, min(len(vis), int(round(D / (ea * P["split_bias"])))))
        merge = False
        if P["merge_short_s"] and slots and slots[-1]["type"] == "cut" and not _ins(b) and not b.get("stamp") and (ch["id"] != "cold_open" or P["cold_avg"]):
            pb = slots[-1]["beat"]
            same = pb["speaker"] == b["speaker"] or (P["speaker_subjects"].get(pb["speaker"], {0}) & P["speaker_subjects"].get(b["speaker"], {1}))
            lim = P["merge_short_s"] if same else min(P["merge_short_s"], P["merge_cross_s"] or 1.3)
            merge = D < lim and slots[-1]["end"] - slots[-1]["start"] + D <= P["merge_max_s"] and not slots[-1].get("stamp") \
                and slots[-1]["chapter"] == ch["id"]
        if (D < MIN_BEAT or merge) and slots and slots[-1]["type"] == "cut":
            if b.get("stamp") and not slots[-1].get("stamp"): slots[-1]["stamp"] = b["stamp"]
            slots[-1]["end"] = e                       # absorb a too-short beat into the previous shot
            slots[-1].setdefault("also", []).append(dict(speaker=b["speaker"], text=b["text"], id=b["id"]))
            notes.append(f"{b['id']} picture {D:.2f}s absorbed into previous shot")
            continue
        parts = []
        for ci in range(n):
            cs, ce = s + D * ci / n, s + D * (ci + 1) / n
            d_ = ce - cs
            if cold and not P["cold_avg"]:
                k = max(math.ceil(d_ / P["cold_max_shot"] - 1e-9), int(round(d_ / (2.5 if P["cold_max_shot"] <= MAX_SHOT_COLD else P["cold_max_shot"] * 0.85))), 1)
                while k > 1 and d_ / k < 2.0:
                    k -= 1
            else:
                k = max(1, math.ceil(d_ / P["max_shot"] - 1e-9))
                if avg:
                    k = max(k, int(round(d_ / ((avg * 0.6 if bm & {"action", "combat", "comedy", "comedic"} else avg) * P["split_bias"]))))
            for si in range(k):
                parts.append((ci, si, cs + (ce - cs) * si / k, cs + (ce - cs) * (si + 1) / k))
        for ci, si, ps, pe in parts:
            v = vis[ci]
            slots.append(dict(type="cut", start=ps, end=pe, chapter=ch["id"], beat=b, beat_id=b["id"],
                              cut_index=ci, sub=si, spec=v, first=(ci == 0 and si == 0),
                              last_of_ch=False, prev_beat=flat[i - 1][1] if i else None,
                              stamp=(b.get("stamp") if (ci == 0 and si == 0) else None),
                              after_card=(si == 0 and ci == 0 and slots and slots[-1]["type"] == "card")))
        if ins_tail:
            slots.extend(ins_tail)
    # snap boundaries exactly (float safety)
    for a, b2 in zip(slots, slots[1:]):
        b2["start"] = a["end"]
    slots[0]["start"] = 0.0
    slots[-1]["end"] = dur
    return slots, notes


# --------------------------------------------------------------------------- clone grids
def _beat_spans(script, timing):
    """beat id -> (picture start, picture end), the same spans build_skeleton uses."""
    tb = {b["id"]: b for b in timing["beats"]}
    cards = {c["chapter"]: c for c in timing.get("cards", [])}
    flat = [(ch, b) for ch in script["chapters"] for b in ch["beats"]]
    out = {}
    for i, (ch, b) in enumerate(flat):
        first = i == 0 or flat[i - 1][0]["id"] != ch["id"]
        s = 0.0 if i == 0 else (cards[ch["id"]]["end"] if first and ch["id"] in cards else tb[b["id"]]["start"])
        if i + 1 < len(flat):
            nch, nb = flat[i + 1]
            e = cards[nch["id"]]["start"] if nch["id"] != ch["id"] and nch["id"] in cards else tb[nb["id"]]["start"]
        else:
            e = timing["duration"]
        out[b["id"]] = (s, e)
    return out


def _expand(rng_s, order):
    a, _, b = rng_s.partition("..")
    i0 = order.index(a)
    i1 = order.index(b) if b else i0
    return order[min(i0, i1):max(i0, i1) + 1]


GRID_KINDS = {"g2": (2, "split"), "g3": (3, "grid"), "g4": (4, "grid"), "g6": (6, "grid"), "g9": (9, "grid"), "g16z": (16, "mosaic")}


def apply_grid_plan(slots, script, timing, plan_cfg):
    """Re-cut the listed beat runs into clone-grid shots and real-frame shots.

    ``grid_plan``: [{"cuts": [{"k": "g9" | "g2" | "g3" | "g4" | "g6" | "g16z" | "real", "b": "b105" | "b105..b107",
    "f": [0.0, 0.5]  (optional fraction of the beat range)}, ...]}, ...]  The cuts of one run must tile the run; designed
    inserts inside the run stay where they are.  Cut slots inside a run are replaced (a slot that straddles the run's edge is an error)."""
    if not plan_cfg:
        return slots
    order = [b["id"] for ch in script["chapters"] for b in ch["beats"]]
    beats = {b["id"]: (ch, b) for ch in script["chapters"] for b in ch["beats"]}
    tb = {b["id"]: b for b in timing["beats"]}
    spans = _beat_spans(script, timing)
    for run in plan_cfg:
        ents = []
        for e in run["cuts"]:
            ids = _expand(e["b"], order)
            a, z = spans[ids[0]][0], spans[ids[-1]][1]
            f0, f1 = e.get("f", [0.0, 1.0])
            ents.append(dict(e, ids=ids, a=a + f0 * (z - a), z=a + f1 * (z - a)))
        T0, T1 = min(e["a"] for e in ents), max(e["z"] for e in ents)
        for sl in slots:                                   # a slot that overhangs the run by a hair (merged short beats) is absorbed
            if sl["type"] in ("cut", "grid"):
                if sl["start"] < T0 - 1e-6 and sl["end"] > T0 + 1e-6 and T0 - sl["start"] <= 0.6:
                    ents[0]["a"] = T0 = sl["start"]
                if sl["start"] < T1 - 1e-6 and sl["end"] > T1 + 1e-6 and sl["end"] - T1 <= 0.6:
                    ents[-1]["z"] = T1 = sl["end"]
        for x, y in zip(ents, ents[1:]):
            if 1e-6 < abs(x["z"] - y["a"]) <= 0.15:
                y["a"] = x["z"]
            if abs(x["z"] - y["a"]) > 1e-6:
                raise ValueError(f"grid_plan: cuts {x['b']} and {y['b']} do not tile the run ({x['z']:.2f} vs {y['a']:.2f})")
        keep, old, ins = [], [], []
        for sl in slots:
            if sl["type"] == "insert" and sl["start"] >= T0 - 1e-6 and sl["end"] <= T1 + 1e-6:
                ins.append(sl)
            elif sl["type"] in ("cut", "grid") and sl["start"] >= T0 - 1e-6 and sl["end"] <= T1 + 1e-6:
                old.append(sl)
            elif sl["start"] < T1 - 1e-6 and sl["end"] > T0 + 1e-6 and sl["type"] != "card":
                if not (sl["type"] == "insert"):
                    raise ValueError(f"grid_plan: slot {sl.get('beat_id')} {sl['start']:.2f}-{sl['end']:.2f} straddles the run {T0:.2f}-{T1:.2f}")
                keep.append(sl)
            else:
                keep.append(sl)
        count, new = {}, []
        for e in ents:
            pieces = [(e["a"], e["z"])]
            for sl in ins:
                out = []
                for a, z in pieces:
                    if sl["end"] <= a + 1e-6 or sl["start"] >= z - 1e-6:
                        out.append((a, z))
                        continue
                    if sl["start"] > a + 1e-6:
                        out.append((a, sl["start"]))
                    if sl["end"] < z - 1e-6:
                        out.append((sl["end"], z))
                pieces = out
            for a, z in pieces:
                if z - a < 0.2:
                    continue
                ov = [(i, min(z, spans[i][1]) - max(a, spans[i][0])) for i in order if min(z, spans[i][1]) > max(a, spans[i][0]) + 1e-6]
                bid = max(ov, key=lambda q: q[1])[0] if e["k"] == "real" or True else None
                ch, b = beats[bid]
                ci = count.get(bid, 0)
                count[bid] = ci + 1
                also = [dict(speaker=beats[i][1]["speaker"], text=beats[i][1]["text"], id=i) for i, _ in ov if i != bid]
                at_start = abs(a - spans[bid][0]) < 1e-6
                sl = dict(type="cut", start=a, end=z, chapter=ch["id"], beat=b, beat_id=bid, cut_index=ci, sub=0,
                          spec=b["visuals"][0], first=at_start, last_of_ch=False,
                          prev_beat=beats[order[order.index(bid) - 1]][1] if order.index(bid) else None,
                          stamp=b.get("stamp") if at_start else None, after_card=False)
                if also:
                    sl["also"] = also
                if e["k"] != "real":
                    if sl["stamp"]:
                        raise ValueError(f"grid_plan: {bid} carries a CANON stamp; keep its shot a real frame")
                    n, mode = GRID_KINDS[e["k"]]
                    sl.update(type="grid", grid=dict(n=n, mode=mode),
                              beats=[dict(id=i, speaker=beats[i][1]["speaker"], start=max(a, tb[i]["start"]), end=min(z, tb[i]["end"])) for i, _ in ov])
                new.append(sl)
        cover = sum(sl["end"] - sl["start"] for sl in new) + sum(sl["end"] - sl["start"] for sl in ins)
        if abs(cover - (T1 - T0)) > 1e-3:
            raise ValueError(f"grid_plan: run {T0:.2f}-{T1:.2f} not fully covered ({cover:.2f}s)")
        slots = sorted(keep + ins + new, key=lambda q: q["start"])
    return slots


# --------------------------------------------------------------------------- scoring
class Scorer:
    def __init__(self, assets):
        self.assets = assets
        self.tok = {a["id"]: toks(" ".join([a.get("file_title", ""), a.get("caption", ""), a.get("page", "")]))
                    for a in assets}

    def score(self, slot, a, speaker_rule=True):
        if P["wl"] is not None:
            return P["wl"].score(slot, a)
        sp, tg = slot["spec"], a["tags"]
        subs = sp.get("subjects") or []
        asub = set(tg.get("subjects") or [])
        s = 0.0
        if not asub and not tg.get("location"):
            return -99.0, 0.0                          # untagged (title cards etc.): never usable
        if subs and subs[0] in asub:
            s += 4.0
        elif subs and any(al in asub for al in P["aliases"].get(subs[0], ())):
            s += 2.5                                  # stand-in subject (e.g. any scroll scene for the forbidden scroll)
        for o in subs[1:3]:
            if o in asub:
                s += 1.5
        loc = sp.get("location")
        if loc and (tg.get("location") == loc or loc in asub):
            s += 2.0
        core = s
        m = sp.get("mood")
        if set(m if isinstance(m, list) else [m]) & set(tg.get("mood") or []):
            s += 1.0
        st, at = sp.get("shot"), tg.get("shotType")
        if st and at:
            if st == at:
                s += 1.0
            elif (st, at) in SHOT_NEAR or (at, st) in SHOT_NEAR:
                s += 0.5
        YOUNG, NONCHAR, ATMOS, ATMOS2, SCARCE = P["young"], P["nonchar"], P["atmos"], P["atmos2"], P["scarce"]
        if P["young_fallback"] and subs and (subs[0] in YOUNG or subs[0] in ("father_orsi", "sister_lily")) and asub and asub <= NONCHAR \
                and asub & ATMOS:
            s += 2.0                                  # fallback: atmosphere/location when the young face does not exist
            core += 2.0
        elif P["young_fallback"] and subs and (subs[0] in YOUNG or subs[0] in ("father_orsi", "sister_lily")) and asub and asub <= ATMOS2:
            s += 1.3                                  # second-tier fallback: character-free object / place imagery
            core += 1.3
        q = toks(sp.get("query", "")) & self.tok[a["id"]]
        s += min(2.0, 0.5 * len(q))
        core += min(2.0, 0.5 * len(q))
        sem = core
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
        # era / time / text discipline (only for vaults whose assets carry these tags, i.e. Naruto)
        if P["era"] and a.get("franchise") and asub - NONCHAR:
            want = sp.get("era") or P["era"]
            ae = tg.get("era", "unknown")
            if ae != want:
                unk = 0.5 if (asub - NONCHAR) <= P["era_agnostic"] else 3.0   # unknown era: fine for people who look the same in every era
                s -= {"shippuden": 12.0, "boruto": 14.0, "kid": 6.0, "part1": 6.0, "unknown": unk}.get(ae, 1.0)
        want_t = sp.get("time") or P["time_by_beat"].get(slot["beat_id"]) or P["time_by_chapter"].get(slot["chapter"])
        if want_t and tg.get("time") and want_t != tg["time"]:
            s -= 3.0 if "night" in (want_t, tg["time"]) else 1.5
        elif want_t and tg.get("time") == want_t:
            s += 0.8
        if P["trust_mode"]:                         # curated ("trust": true in curation.json) frames win over unreviewed ones
            if a.get("trust"):
                s += 2.5 * float(a["trust"])          # 1 = fully vetted frame, 0.5 = checked on a contact sheet, nothing wrong with it
            elif asub - NONCHAR:
                s -= 1.5
        if tg.get("text_free") is False:
            s -= 4.0
        if tg.get("conf") == "low":
            s -= 1.0
        if a["id"] in P["avoid"]:
            s -= P["avoid_penalty"]
        # a speaker lost in a crowd is not "on screen": many characters in frame = weak match for a dialogue cut
        if P["crowd_penalty"] and slot["first"] and slot["beat"]["speaker"] in P["speaker_subjects"] and slot["beat"]["speaker"] not in ("NARRATOR",):
            if len([x for x in asub if x not in NONCHAR]) >= 4 or "genin_crowd" in asub:
                s -= P["crowd_penalty"]
        # speaker rule
        if speaker_rule and slot["first"]:
            allowed = P["speaker_subjects"].get(slot["beat"]["speaker"])
            if allowed and not (allowed & (asub | {tg.get("location")})):
                s -= 1.0 if (subs and subs[0] in YOUNG) else 6.0
        return s, sem


def acceptable(sem, score):
    if P["wl"] is not None:
        return score >= 4.0 and sem >= 1.0
    return score >= MIN_SCORE and sem >= 1.2


# --------------------------------------------------------------------------- assignment
class Assigner:
    def __init__(self, slots, assets, scorer, pinned):
        self.slots, self.assets, self.sc = slots, assets, scorer
        self.lock_shots = int(P.get("lock_shots") or LOCK_SHOTS)
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
        self.cap = {a["id"]: (REUSE_CAP + 1 if ("liebe" in a["tags"]["subjects"] and a["tags"].get("shotType") in
                    ("closeup", "extreme_closeup")) else REUSE_CAP) for a in assets}
        if P["wl"] is not None:
            self.cap = {a["id"]: P["wl"].cap(a) for a in assets}
        hs = {a["id"]: int(a["dhash"], 16) for a in assets if a.get("dhash")}
        self.near = {aid: [b for b, hb in hs.items() if b != aid and bin(h ^ hb).count("1") <= NEAR_DUP]
                     for aid, h in hs.items()}
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
        ex = getattr(self, "exempt", ())
        for j in self.uses.get(aid, ()):
            if j == i or (i in ex and j in ex):
                continue
            if abs(j - i) < self.lock_shots or abs(self.slots[j]["start"] - self.slots[i]["start"]) < P["lock_seconds"]:
                return False
        for b in self.near.get(aid, ()):
            for j in self.uses.get(b, ()):
                if j != i and abs(j - i) < NEAR_GAP and not (i in ex and j in ex):
                    return False
        others = len(self.uses.get(aid, ())) - (1 if i in self.uses.get(aid, ()) else 0)
        return others < self.cap.get(aid, REUSE_CAP)

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
            coef = 1.5 if (asub & P["scarce"]) else 0.5
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
        if P["wl"] is not None:
            self.relax_fill()
        elif P["accent"] == "naruto":                      # last resort: a speaker-appropriate frame beats an empty slot (it will show up as WEAK)
            for i in self.cuts:
                if self.assign[i] or i in self.pinned:
                    continue
                sl = self.slots[i]
                allowed = P["speaker_subjects"].get(sl["beat"]["speaker"]) or set()
                subs0 = sl["spec"].get("subjects") or []
                want = set(subs0) | (set(P["aliases"].get(subs0[0], ())) if subs0 else set())
                rows = []
                for a in self.assets:
                    asub = set(a["tags"]["subjects"])
                    if not (allowed & (asub | {a["tags"].get("location")})) and not (want & asub):
                        continue
                    sc, _ = self.sc.score(sl, a)
                    if sc > -6:
                        rows.append((sc, a["id"]))
                rows.sort(reverse=True)
                for sc, aid in rows:
                    if self.feasible(i, aid):
                        self.base[i][aid] = sc
                        self._set(i, aid)
                        break


def _relax_fill(self):
    """Whitelist mode: a slot nothing fits well still gets the least-bad approved frame (shown as WEAK in the report)."""
    for level in ((1, 2, 3) if P.get("strict_reuse") else (1, 2, 3, 4, 5)):
        P["wl"].relax = min(level, 3)
        if level == 5:
            P["lock_seconds"] = 6.0
            self.lock_shots = 2
            for a in self.assets:
                self.cap[a["id"]] = min(P["wl"].reuse_cap + 3, len(P["wl"].variants(a)))
        elif level == 4:
            self.lock_shots = 3
            P["lock_seconds"] = 18.0                   # last resort only: 30 s instead of 45 s between uses of one asset, one extra recrop
            for a in self.assets:
                self.cap[a["id"]] = min(P["wl"].reuse_cap + 2, len(P["wl"].variants(a)))
        for i in self.cuts:
            if self.assign[i] or i in self.pinned:
                continue
            sl = self.slots[i]
            rows = []
            for a in self.assets:
                sc, _ = self.sc.score(sl, a)
                if sc > -20:
                    rows.append((sc, a["id"]))
            rows.sort(reverse=True)
            for sc, aid in rows:
                if self.feasible(i, aid):
                    self.base[i][aid] = sc
                    self._set(i, aid)
                    break
    P["wl"].relax = 0
    P["lock_seconds"] = P["wl"].min_gap


Assigner.relax_fill = _relax_fill


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
    if P["accent"] == "naruto":
        if sp & {"kurama", "seal_cage", "orochimaru", "barrier", "zabuza", "itachi"} or moods & {"action", "combat", "ominous"}:
            return "crimson"
        if sp & {"hiruzen", "hokage_office", "crystal_ball", "paperwork", "archive", "minato", "kushina", "tobirama"}:
            return "gold"
        if sp & {"naruto", "naruto_clones", "iruka"} and moods & {"emotional", "quiet", "determined", "triumphant"}:
            return "emerald"
        return None
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


STAMP_TIMES = {}


def _stamp(sl):
    """CANON stamp carried from the beat onto the shot that starts it (edit.json: shot['stamp']); `time` = the instant the
    audio engine plans the thunk (timing.json stamps), so the compositor lands the slam's impact exactly there."""
    st = sl.get("stamp")
    if not st:
        return {}
    out = {"label": st.get("label", "CANON"), "note": st.get("note", "")}
    t = STAMP_TIMES.get(sl.get("beat_id"))
    if t is not None:
        out["time"] = round(t, 3)
    return {"stamp": out}


def pick_backgrounds(slots, assign, assets, overrides):
    """Real-frame backdrop (blurred + darkened by the compositor) for every designed insert. -> {slot index: asset id}."""
    from . import inserts
    used = {}
    for aid in assign.values():
        if aid:
            used[aid] = used.get(aid, 0) + 1
    out, recent, held_bg = {}, [], {}
    real_at = {}
    for i, aid in assign.items():
        if aid:
            real_at.setdefault(aid, []).append(i)
    for i, sl in enumerate(slots):
        if sl["type"] != "insert":
            continue
        key = f"{sl['beat_id']}#{sl['cut_index']}"
        pin = overrides.get(key, {}).get("bg")
        if P["wl"] is not None:                              # whitelist mode: the backdrop is a hand-approved frame too
            scs, tone = wl_mod.bg_scenes(sl["insert"]["type"], sl["insert"], P.get("wl_cfg"))
            hold = sl["insert"].get("hold")
            if hold and hold in held_bg:                     # one held document keeps one backdrop across its beats
                out[i] = held_bg[hold]
                used[out[i]] = used.get(out[i], 0) + 1
                continue
            best, bs = None, -1e9
            for pool in (scs, scs + [x for x in wl_mod.BG_TAIL if x not in scs]):
                for a in assets:
                    L = a["wl"]
                    if pin and a["id"] != pin:
                        continue
                    if L["scene"] not in pool:
                        continue
                    sc = -0.8 * pool.index(L["scene"]) + a.get("quality", 0.5)
                    if L["time"] == tone or (tone == "day" and L["time"] in ("interior", "dusk")) or L["time"] == "interior":
                        sc += 1.0
                    elif tone == "night" and L["ok_as_night"]:
                        sc += 0.3
                    else:
                        sc -= 3.0
                    sc -= 1.0 * len(L["who"])
                    if not L["who"]:
                        sc += 0.8
                    sc -= 1.3 * used.get(a["id"], 0)
                    if a["id"] in recent[-3:]:
                        sc -= 4.0
                    if any(abs(j - i) < 6 for j in real_at.get(a["id"], ())):
                        sc -= 2.5
                    if sc > bs:
                        best, bs = a, sc
                if best is not None:
                    break
            if best is None:
                best = max(assets, key=lambda a: -1.3 * used.get(a["id"], 0) + (1.0 if not a["wl"]["who"] else 0))
            if hold:
                held_bg[hold] = best["id"]
            out[i] = best["id"]
            used[best["id"]] = used.get(best["id"], 0) + 1
            recent.append(best["id"])
            continue
        subs, tone = inserts.bg_subjects_for(sl["insert"]["type"])
        best, bs = None, -1e9
        for a in assets:
            tg = a["tags"]
            asub = set(tg.get("subjects") or [])
            if pin:
                if a["id"] != pin:
                    continue
                best = a
                break
            rank = next((r for r, sub in enumerate(subs) if sub in asub or tg.get("location") == sub), None)
            if rank is None:
                continue
            sc = -0.8 * rank + a.get("quality", 0.5)
            ptime = tg.get("time")
            if ptime and ptime == tone:
                sc += 1.0
            elif ptime and ptime != tone:
                sc -= 0.8
            chars = asub - P["nonchar"]
            sc -= 1.0 * len(chars)
            if chars and P["era"] and tg.get("era") in ("shippuden", "boruto"):
                sc -= 6.0
            if tg.get("text_free") is False:
                sc -= 3.0
            sc -= 1.6 * used.get(a["id"], 0)
            if a["id"] in recent[-3:]:
                sc -= 4.0
            if any(abs(j - i) < 6 for j in real_at.get(a["id"], ())):
                sc -= 2.5
            if sc > bs:
                best, bs = a, sc
        if best is None:                                   # nothing tagged for this place: any frame will do behind the blur
            best = max(assets, key=lambda a: -1.6 * used.get(a["id"], 0) + a.get("quality", 0.5) + (0.6 if a["tags"].get("time") == tone else 0)
                       - 2 * len(set(a["tags"].get("subjects") or []) - P["nonchar"]))
        out[i] = best["id"]
        used[best["id"]] = used.get(best["id"], 0) + 1
        recent.append(best["id"])
    return out


def build_grid_shot(sid, sl, ov, by_id, rng_seed, used):
    """One clone_grid shot: panels chosen from the whitelist for this scene's time of day, speaker highlights from the beats."""
    import random
    from . import clone_grid as cg
    wl = P["wl"]
    if wl is None:
        raise ValueError("clone grids need whitelist mode")
    ctx = wl.ctx(sl["chapter"], sl["beat_id"])
    t = ctx.get("time")
    tctx = t if t in ("night", "lamp", "mist") else "day"
    bids = [b["id"] for b in sl.get("beats", [])] or [sl["beat_id"]]
    ok = lambda L: all(wl.only_ok(L, b) for b in bids)
    rng = random.Random(f"{rng_seed}:{sid}:{sl['beat_id']}:{sl['cut_index']}")
    D = sl["end"] - sl["start"]
    n, mode = sl["grid"]["n"], sl["grid"]["mode"]
    if mode == "mosaic":
        pl = cg.plan_mosaic(tctx, wl.labels, ok, rng, used, D, variants=wl.grid_variants())
    else:
        pl = cg.plan(n, mode, tctx, wl.labels, ok, rng, used, variants=wl.grid_variants())
    panels = pl["panels"]
    for p_ in panels:
        p_["path"] = by_id[p_["asset_id"]]["path"]
    ni = pl["naruto"]
    clones = [i for i in range(min(len(panels), n if mode != "mosaic" else 16)) if i != ni]
    hl, ci = [], rng.randrange(len(clones)) if clones else 0
    for b in sl.get("beats", []):
        if b["speaker"] == "NARUTO":
            hl.append(dict(t0=round(b["start"] - sl["start"], 3), t1=round(b["end"] - sl["start"], 3), panel=ni))
        elif b["speaker"] == "CLONE" and clones:
            hl.append(dict(t0=round(b["start"] - sl["start"], 3), t1=round(b["end"] - sl["start"], 3), panel=clones[ci % len(clones)]))
            ci += 1
    if mode != "mosaic":                                  # the panel of the first speaker pops first, so the line is never voiced by a panel not yet on the page
        cg.schedule_pops(panels, hl[0]["panel"] if hl else ni, D, rng)
    grid = dict(mode=mode, n=n, tilt=rng.choice([-1.6, 1.3, -1.1, 1.7]), hl=hl, naruto_panel=ni)
    g = None
    for p_ in panels:
        g = p_.get("grade") or g
    if g:
        grid["grade"] = g
    if mode == "mosaic":
        grid.update(zoom_to=0.52, drift=[0, 80])
    if ov.get("grid"):
        grid.update(ov["grid"])
    return grid, panels


def build_shots(slots, assign, by_id, overrides, bgs=None, wlmap=None, seed="grid"):
    shots, prev_cam = [], None
    bgs = bgs or {}
    wlmap = wlmap or {}
    gused = {}
    for n, sl in enumerate(slots):
        sid = f"s{n + 1:03d}"
        if sl["type"] == "grid":
            key = f"{sl['beat_id']}#{sl['cut_index']}"
            grid, panels = build_grid_shot(sid, sl, overrides.get(key, {}), by_id, seed, gused)
            shots.append(dict(id=sid, start=round(sl["start"], 3), end=round(sl["end"], 3), type="clone_grid", asset_id=None, asset_path=None,
                              layout="clone_grid", focus=[0.5, 0.4], camera="slow_push_in", vfx=[], transition_in=overrides.get(key, {}).get("transition_in", "cut"),
                              treatment="anime", accent=None, beat_id=sl["beat_id"], speaker=sl["beat"]["speaker"], chapter=sl["chapter"],
                              card=None, grid=grid, panels=panels, provenance="clone_grid", **_stamp(sl), _key=key, _slot=n))
            prev_cam = "slow_push_in"
            continue
        if sl["type"] == "card":
            shots.append(dict(id=sid, start=round(sl["start"], 3), end=round(sl["end"], 3), type="card", asset_id=None,
                              asset_path=None, layout="fill", focus=[0.5, 0.4], camera="slow_push_in", vfx=[],
                              transition_in="cut", treatment="anime", accent=None, beat_id=None, speaker=None,
                              chapter=sl["chapter"], card=sl["card"]))
            prev_cam = "slow_push_in"
            continue
        beat = sl["beat"]
        key = f"{sl['beat_id']}#{sl['cut_index']}" + (f".{sl['sub']}" if sl["sub"] else "")
        ov = overrides.get(key, {})
        if sl["type"] == "insert":
            bg = by_id[bgs[n]]
            ins = dict(sl["insert"])
            if ov.get("view"):
                ins["view"] = dict(ins.get("view") or {}, **ov["view"])
            shots.append(dict(id=sid, start=round(sl["start"], 3), end=round(sl["end"], 3), type="insert", asset_id=None, asset_path=None,
                              bg_asset_id=bg["id"], bg_path=bg["path"], layout="fill", focus=[0.5, 0.4], camera="slow_push_in",
                              vfx=ov["vfx"] if "vfx" in ov else [v for v in beat.get("vfx", []) if v == "dust"],
                              transition_in=ov.get("transition_in", "cut"), treatment="anime", accent=None, beat_id=sl["beat_id"],
                              speaker=beat["speaker"], chapter=sl["chapter"], card=None, insert=ins, provenance="designed_insert",
                              **_stamp(sl), _key=key, _slot=n))
            prev_cam = "slow_push_in"
            continue
        a = by_id.get(assign.get(n))
        if a is None:
            shots.append(dict(id=sid, start=round(sl["start"], 3), end=round(sl["end"], 3), type="still", asset_id=None,
                              asset_path=None, layout="fill", focus=[0.5, 0.4], camera=pick_camera(sl, prev_cam, None),
                              vfx=[], transition_in="cut", treatment="anime", accent=None, beat_id=sl["beat_id"],
                              speaker=beat["speaker"], chapter=sl["chapter"], card=None, **_stamp(sl), _key=key, _slot=n))
            continue
        cam = ov.get("camera") or pick_camera(sl, prev_cam, a["tags"].get("shotType"))
        prev_cam = cam
        vfx = [v for v in beat.get("vfx", []) if sl["first"] or v not in ("impact_flash", "speed_lines")]
        sp = set(sl["spec"].get("subjects") or []) | set(a["tags"]["subjects"])
        auto = False
        if "embers" not in vfx and sp & P["ember_subjects"]:
            vfx.append("embers")
            auto = True
        treat = ov.get("treatment") or ("manga_motion" if a.get("kind") == "manga_panel" else "anime")
        acc = ov.get("accent") or accent_for(sl, a)
        if treat == "manga_motion" and not acc:
            acc = "crimson"
        extra = {}
        layout = ov.get("layout") or kind_layout(a)
        focus = ov.get("focus") or a.get("focus") or [0.5, 0.4]
        if n in wlmap:                                    # whitelist mode: re-crop + grade chosen for this use
            m = wlmap[n]
            layout = ov.get("layout") or m["layout"]
            if ov.get("crop"):
                m = dict(m, crop=ov["crop"], kind="manual")
            if m["crop"]["zoom"] > 1.0 or m["kind"] != "natural":
                focus = [m["crop"]["x"], m["crop"]["y"]]
            else:
                focus = ov.get("focus") or a["wl"].get("focus") or focus
            extra = dict(crop=m["crop"], crop_kind=m["kind"])
            g = ov["grade"] if "grade" in ov else m["grade"]
            if g:
                extra["grade"] = g
            D = sl["end"] - sl["start"]
            extra["cam_amp"] = round(min(1.6, max(1.0, D / 4.6)), 2)
        elif ov.get("grade"):
            extra["grade"] = ov["grade"]
        shots.append(dict(
            id=sid, start=round(sl["start"], 3), end=round(sl["end"], 3), type="still", asset_id=a["id"],
            asset_path=a["path"], layout=layout, focus=focus,
            camera=cam, vfx=ov["vfx"] if "vfx" in ov else vfx, transition_in=ov.get("transition_in", "cut"),
            treatment=treat, accent=acc, beat_id=sl["beat_id"], speaker=beat["speaker"], chapter=sl["chapter"],
            card=None, **extra, **_stamp(sl), _key=key, _slot=n, _auto_ember=auto))
    return shots


def finish_shots(shots, slots, overrides):
    # embers cap
    lim = int(EMBER_CAP * len(shots))
    ember = [s for s in shots if "embers" in s.get("vfx", []) and not overrides.get(s.get("_key"), {}).get("vfx")]
    if len(ember) > lim:
        def keep_rank(s):                              # lower = remove first
            sl = slots[s["_slot"]]
            core = bool(set(sl["spec"].get("subjects") or []) & P["ember_subjects"])
            return (core, not s.get("_auto_ember"))
        ember.sort(key=keep_rank)
        for s in ember[: len(ember) - lim]:
            s["vfx"] = [v for v in s["vfx"] if v != "embers"]
    # transitions
    energetic = {"combat": 3, "epic": 2, "shock": 2, "determined": 1}
    cands = []
    prev = None
    for k, s in enumerate(shots):
        if s["type"] == "insert":
            ov = overrides.get(s["_key"], {})
            if "transition_in" not in ov and prev is not None and prev["type"] != "insert":
                s["transition_in"] = "dissolve"
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
        if P["accent"] == "naruto" and s.get("_key"):
            s["key"] = s["_key"]                       # override key (beat#cut[.sub]) so a reviewer can pin this exact shot
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
def load_assets(gate, curation, retag=None, vault=None, wl=None):
    v = json.loads((vault or VAULT).read_text())
    assets = gate.filter(v["assets"])
    out, missing = [], []
    for a in assets:
        if curation.get(a["id"], {}).get("reject"):
            continue
        if wl is not None:                              # whitelist mode: only hand-approved frames exist for this project
            if a["id"] not in wl.labels:
                continue
            a = dict(a, wl=wl.labels[a["id"]])
        rt = (retag or {}).get(a["id"])
        if rt:                                          # editorial corrections of vault tags (overrides "_retag")
            if rt.get("reject"):
                continue
            a = dict(a, tags=dict(a["tags"], **{k: v2 for k, v2 in rt.items() if k in ("subjects", "location", "mood", "shotType")}))
        if not (ROOT / a["path"]).exists():
            missing.append(a["id"])
            continue
        tr = curation.get(a["id"], {}).get("trust")
        if tr:
            a = dict(a, trust=1.0 if tr is True else float(tr))
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
            if (k - pk < int(P.get("lock_shots") or LOCK_SHOTS) or s["start"] - pt < LOCK_SECONDS) and not (s.get("lock_exempt") and shots[pk].get("lock_exempt")):
                bad.append(dict(asset=aid, shot=s["id"], gap_shots=k - pk, gap_s=round(s["start"] - pt, 1)))
        last[aid] = (k, s["start"])
    return bad


def run(pid, estimate=False, write=True):
    proj = ROOT / "copycat/projects" / pid
    script = json.loads((proj / "script.json").read_text())
    fr = franchise_mod.for_project(pid)
    gate = AssetDomainGate(script["domain"], fr["id"])
    vault_p = ROOT / fr["vault_dir"] / "vault.json"
    cur_p = proj / "curation.json"
    curation = json.loads(cur_p.read_text()) if cur_p.exists() else {}
    ov_p = proj / "shot_overrides.json"
    ov_all = json.loads(ov_p.read_text()) if ov_p.exists() else {}
    overrides = {k: v for k, v in ov_all.items() if not k.startswith("_")}
    cfg = project_config(proj, curation, ov_all)
    configure(fr["id"], script, cfg, pid)
    from . import inserts as inserts_mod
    P["holds"] = inserts_mod.resolve_holds(script, P.get("extra_inserts"))
    wl = None
    P["wl"] = None
    if P.get("wl_cfg") and (proj / "whitelist.json").exists():
        wl = wl_mod.WL(proj, P["wl_cfg"], script)
        P["wl"] = wl
        P["lock_seconds"] = wl.min_gap
    assets, missing, vault_n = load_assets(gate, curation, ov_all.get("_retag"), vault_p, wl)
    by_id = {a["id"]: a for a in assets}
    timing = load_timing(pid, estimate, script)
    STAMP_TIMES.clear()
    for st in timing.get("stamps") or []:
        STAMP_TIMES[st["beat"]] = float(st["time"])
    slots, notes = build_skeleton(script, timing)
    slots = apply_grid_plan(slots, script, timing, P.get("grid_plan") or [])
    key_slot = {}
    for i, s in enumerate(slots):
        if s["type"] == "cut":
            key_slot[f"{s['beat_id']}#{s['cut_index']}" + (f".{s['sub']}" if s["sub"] else "")] = i
        elif s["type"] in ("insert", "grid"):
            key_slot[f"{s['beat_id']}#{s['cut_index']}"] = i
    warnings, pinned = [], {}
    for k, ov in overrides.items():
        if k not in key_slot:
            warnings.append(f"override {k}: no such cut")
            continue
        aid = ov.get("asset_id")
        if aid and slots[key_slot[k]]["type"] in ("insert", "grid"):
            warnings.append(f"override {k}: insert / grid shots take 'bg' / 'grid', not 'asset_id'")
        elif aid:
            if aid not in by_id:
                warnings.append(f"override {k}: asset {aid} not in gate-approved vault")
            else:
                pinned[key_slot[k]] = aid
    scorer = Scorer(assets)
    A = Assigner(slots, assets, scorer, {})
    order_ids = [b["id"] for ch in script["chapters"] for b in ch["beats"]]
    ex_beats = {i for r_ in P.get("gap_exempt") or [] for i in _expand(r_, order_ids)}
    A.exempt = {i for i, sl in enumerate(slots) if sl["type"] == "cut" and sl["beat_id"] in ex_beats}
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
    A.soft = set()
    for k, ov in overrides.items():                      # editorial preferences: first feasible frame of the list wins; never breaks the lock/cap
        i = key_slot.get(k)
        if i is None or slots[i]["type"] != "cut":
            continue
        for rank, aid in enumerate(ov.get("prefer") or []):
            if aid not in by_id:
                warnings.append(f"override {k}: preferred {aid} not in gate-approved vault")
                continue
            A.base[i][aid] = scorer.score(slots[i], by_id[aid])[0] + 12.0 - 1.5 * rank
            if aid not in A.cand[i]:
                A.cand[i].append(aid)
            A.soft.add(i)
    A.run()
    assign = A.assign
    bgs = pick_backgrounds(slots, assign, assets, overrides)
    wlmap = wl.assign_crops(slots, assign, by_id) if wl else {}
    shots = build_shots(slots, assign, by_id, overrides, bgs, wlmap, pid)
    for i_ in A.exempt:
        if shots[i_].get("asset_id"):
            shots[i_]["lock_exempt"] = True
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
    inserts = [s for s in shots if s["type"] == "insert"]
    bg_uses = {}
    for s in inserts:
        bg_uses[s["bg_asset_id"]] = bg_uses.get(s["bg_asset_id"], 0) + 1
    ins_t = sum(s["end"] - s["start"] for s in inserts)
    ins_types = {}
    for s in inserts:
        ins_types[s["insert"]["type"]] = round(ins_types.get(s["insert"]["type"], 0) + s["end"] - s["start"], 1)
    real = sum(s["end"] - s["start"] for s in stills if s["asset_id"] and by_id[s["asset_id"]].get("source") != "generated")
    cardt = sum(s["end"] - s["start"] for s in shots if s["type"] == "card")
    ln = lambda L: round(sum(s["end"] - s["start"] for s in L) / len(L), 2) if L else None
    grids = [s for s in shots if s["type"] == "clone_grid"]
    chap = {}
    for s in stills + inserts + grids:
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
        if sc < WEAK_SCORE and n not in A.pinned and n not in getattr(A, "soft", ()):      # editorial pins / preferences are not 'weak'
            weak.append(dict(shot=sh["id"], beat=f"{sl['beat_id']}#{sl['cut_index']}", asset=aid, score=round(sc, 1),
                             want=sl["spec"].get("subjects")))
        if P["wl"] is not None:                          # whitelist mode: judge by the approved labels, honouring stand-ins
            sp_ = sl["beat"]["speaker"]
            ks = set(P["wl"].speaker_who.get(sp_, []))
            fb_ = P["wl"].fallback_for(sp_)
            if sl["first"] and ks and sp_ != "NARRATOR" and not ((ks | set((fb_ or {}).get("who", []))) & set(by_id[aid]["wl"]["who"])) \
                    and not (fb_ and fb_.get("allow_empty") and not by_id[aid]["wl"]["who"]):
                spk.append(f"{sh['id']} {sl['beat_id']} speaker {sp_} not shown")
            continue
        allowed = P["speaker_subjects"].get(sl["beat"]["speaker"])
        if sl["first"] and allowed and not (allowed & (set(by_id[aid]["tags"]["subjects"]) | {by_id[aid]["tags"].get("location")})):
            spk.append(f"{sh['id']} {sl['beat_id']} speaker {sl['beat']['speaker']} not shown")
    viol = violations(shots)
    wl_extra = {}
    if P["wl"] is not None:
        lab = P["wl"].labels
        seen, dup = {}, 0
        for s_ in stills:
            if s_.get("asset_id") and s_.get("crop"):
                k_ = (s_["asset_id"], s_["crop"]["x"], s_["crop"]["y"], s_["crop"]["zoom"])
                dup += 1 if k_ in seen else 0
                seen[k_] = 1
        wl_extra = dict(whitelist_size=len(lab),
                        non_whitelisted_stills=[s_["id"] for s_ in stills if s_["asset_id"] and s_["asset_id"] not in lab],
                        non_whitelisted_insert_bgs=[s_["id"] for s_ in inserts if s_["bg_asset_id"] not in lab],
                        recrop_uses=sum(1 for v in uses.values() if v > 1 for _ in range(v - 1)),
                        assets_with_recrops=sum(1 for v in uses.values() if v > 1),
                        repeated_asset_crop=dup,
                        night_graded=sum(1 for s_ in stills if s_.get("grade") == "night"),
                        lamp_graded=sum(1 for s_ in stills if s_.get("grade") == "interior_lamp"),
                        tight_crops=sum(1 for s_ in stills if (s_.get("crop") or {}).get("zoom", 1) > 1.3))
    if grids:
        by_n = {}
        for s in grids:
            k_ = "mosaic16" if s["grid"]["mode"] == "mosaic" else f"{s['grid']['n']}{'split' if s['grid']['mode'] == 'split' else ''}"
            by_n[k_] = round(by_n.get(k_, 0) + s["end"] - s["start"], 1)
        wl_extra.update(clone_grids=len(grids), pct_runtime_clone_grid=round(100 * sum(s["end"] - s["start"] for s in grids) / tot, 1),
                        clone_grid_seconds_by_size=by_n, clone_grid_panels=sum(len(s["panels"]) for s in grids),
                        non_whitelisted_grid_panels=sorted({p_["asset_id"] for s in grids for p_ in s["panels"]} - set(P["wl"].labels)) if P["wl"] else [])
    extra = dict(inserts=len(inserts), pct_runtime_designed_insert=round(100 * ins_t / tot, 1), insert_seconds_by_type=ins_types,
                 insert_bg_max_reuse=max(bg_uses.values())) if inserts else {}
    return dict(shots=len(shots), cards=sum(1 for s in shots if s["type"] == "card"), **extra, vault_assets=vault_n, usable_assets=usable,
                unique_assets=len(uses), max_uses_of_one_asset=max(uses.values()) if uses else 0,
                assets_used_3x=sum(1 for v in uses.values() if v >= 3),
                repetition_violations=len(viol), repetition_detail=viol[:10],
                avg_cut_s=ln(stills + inserts + grids), avg_cut_first30s=ln([s for s in stills + inserts + grids if s["start"] < 30]),
                avg_cut_per_chapter={k: ln(v) for k, v in chap.items()},
                pct_runtime_real_stills=round(100 * real / tot, 1), pct_runtime_cards=round(100 * cardt / tot, 1),
                weak_matches=weak, unmatched_cuts=unmatched, speaker_unmet=spk, warnings=warnings + notes,
                missing_files=missing, timing="estimated" if timing.get("estimated") else "audio", **wl_extra,
                duration=timing["duration"], embers_pct=round(100 * sum(1 for s in shots if "embers" in s["vfx"]) / len(shots), 1),
                whips=sum(1 for s in shots if s["transition_in"] == "whip"))


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("--estimate-timing", action="store_true")
    ap.add_argument("--dry-run", action="store_true", help="do not write edit.json / mapper_report.json")
    a = ap.parse_args(argv)
    edit, rep = run(a.project, a.estimate_timing, write=not a.dry_run)
    brief = {k: v for k, v in rep.items() if k not in ("weak_matches", "unmatched_cuts", "repetition_detail")}
    print(json.dumps(brief, indent=1))
    print(f"weak: {len(rep['weak_matches'])}  unmatched: {len(rep['unmatched_cuts'])}")
    for u in rep["unmatched_cuts"][:15]:
        print("  UNMATCHED", u)
    return 1 if rep["unmatched_cuts"] or rep["repetition_violations"] else 0


if __name__ == "__main__":
    sys.exit(main())
