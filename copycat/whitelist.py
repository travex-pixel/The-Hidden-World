"""Hand-verified continuity whitelist mode for the mapper.

A project that ships `whitelist.json` (asset id -> labels) and sets `"wl": {...}` in its `_config`
(curation.json / shot_overrides.json) may only use frames that were looked at and approved by the picture editor,
plus designed inserts.  Scoring uses the editor's labels instead of the wiki tags:

    scene  forest_night_ep1 | village_day | village_night | hokage_office | archive_library | classroom_academy |
           training_ground | ichiraku | apartment_bed | seal_mindscape | parents_flashback | neutral_portrait | object
    time   day | night | dusk | interior
    who    exact characters visible (empty = place / object)
    expression  neutral grin shout shock sad_cry determined thinking tired_sick smug gentle angry asleep
    scale  closeup | medium | wide
    ok_as_night  a night grade makes the frame pass in a night scene
    focus / faces {who: [x, y]} / clone_points / crops / crop_only {x, y, zoom}   (framing hints for re-crops)

`_config.wl` keys:  chapters {chapter: ctx}, beats {"b006": ctx | "b215..b225": ctx}, reuse_cap, min_gap_s.
ctx keys:  scenes [..ordered..], time (night|day|dusk|interior|lamp), who [..allowed cast..], graded_scenes,
           grade ("night" | "lamp" | null), shot ("wide" ...).  A beat ctx is merged over its chapter ctx.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

CHAR_KEYS = {"naruto", "naruto_clones", "iruka", "mizuki", "hiruzen", "kakashi", "sasuke", "sakura", "team7", "kurama",
             "kushina", "minato", "tobirama", "villagers"}
TEAM7 = {"naruto", "sasuke", "sakura", "kakashi"}
MENTION = {
    "sasuke": r"\bsasuke\b", "sakura": r"\bsakura\b", "kakashi": r"\bkakashi\b", "iruka": r"\biruka\b", "mizuki": r"\bmizuki\b",
    "hiruzen": r"\b(hiruzen|third hokage|third|old man|lord third)\b", "kurama": r"\b(kurama|nine.tails|fox)\b",
    "kushina": r"\bkushina\b", "minato": r"\b(minato|fourth hokage|fourth)\b", "tobirama": r"\b(tobirama|second hokage|lord second)\b",
    "team7": r"\b(team seven|team 7)\b", "naruto": r"\bnaruto\b", "naruto_clones": r"\b(clones?|copies)\b",
}
SPEAKER_WHO = {
    "NARUTO": ["naruto", "naruto_clones"], "CLONE": ["naruto_clones", "naruto"], "IRUKA": ["iruka"], "MIZUKI": ["mizuki"],
    "HIRUZEN": ["hiruzen"], "KAKASHI": ["kakashi"], "SASUKE": ["sasuke"], "SAKURA": ["sakura"], "KURAMA": ["kurama"],
}
EXPR_KEYS = [  # first match wins; order matters
    ("sad_cry", r"tear|cry|wet|raw|choked|small, honest|sob"),
    ("tired_sick", r"groggy|hoarse|tired|shaky|sick|exhaust|wincing"),
    ("angry", r"furious|outrag|angry|savage|cold|quiet anger|scoff|grim"),
    ("shock", r"stunn|alarm|startl|baffl|incredul|shock|genuinely|dawning|amazed|awed"),
    ("shout", r"manic|taunt|fired up|frantic|panick|committed|exasperat|instant|fast, urgent"),
    ("grin", r"grin|thrill|bright|cheer|gleeful|delight|eager|joy|triumph|light|easy"),
    ("smug", r"smug|sly|smooth|mock|dry|lazy|bored|deadpan|wry|bone dry|flat"),
    ("determined", r"determin|firm|steady|resolv|sincere|level|clipped|earnest|serious|low, deliberate"),
    ("thinking", r"think|puzzl|careful|slow|reading|muttering|observ|hushed|whisper|building|brisk|measured|reflect|narrow"),
    ("gentle", r"gentle|warm|soft|kind|proud|fond|quiet|calm|mild|still|final"),
]
# expression similarity: 2 same, 1 near, 0 neutral/unknown, negative = clash
NEAR = [{"grin", "shout", "smug", "gentle"}, {"angry", "shout", "determined"}, {"shock", "thinking", "tired_sick"},
        {"sad_cry", "tired_sick", "gentle"}, {"thinking", "determined", "neutral"}, {"smug", "neutral", "thinking"}]
STRONG = {"grin", "shout", "shock", "sad_cry", "angry", "tired_sick"}
GRADEABLE_DEFAULT = ["neutral_portrait", "object", "seal_mindscape"]
SCALE_NEAR = {("closeup", "medium"), ("medium", "closeup"), ("medium", "wide"), ("wide", "medium")}
NO_GRADE_SCENES = {"seal_mindscape", "parents_flashback"}


def infer_expression(emotion: str) -> str:
    e = (emotion or "").lower()
    for k, rx in EXPR_KEYS:
        if re.search(rx, e):
            return k
    return "neutral"


def expr_sim(want: str, have: str) -> float:
    if want == have:
        return 2.0
    if have == "neutral" or want == "neutral":
        return 0.0 if want not in STRONG else -0.5
    if any(want in g and have in g for g in NEAR):
        return 0.8
    return -2.5 if (want in STRONG and have in STRONG) else -0.8


def _beat_order(script):
    return [b["id"] for ch in script["chapters"] for b in ch["beats"]]


class WL:
    """Whitelist state for one mapper run."""

    def __init__(self, proj: Path, cfg: dict, script: dict):
        self.labels = {k: v for k, v in json.loads((proj / "whitelist.json").read_text()).items() if not k.startswith("_")}
        self.cfg = cfg
        self.order = _beat_order(script)
        self.reuse_cap = int(cfg.get("reuse_cap", 4))
        self.min_gap = float(cfg.get("min_gap_s", 45.0))
        self.relax = 0
        self.windows = {}
        for who, rngs in (cfg.get("windows") or {}).items():
            ids = set()
            for k in rngs:
                x, _, y = k.partition("..")
                i0 = self.order.index(x)
                i1 = self.order.index(y) if y else i0
                ids |= set(self.order[min(i0, i1):max(i0, i1) + 1])
            self.windows[who] = ids
        self._ctx = {}
        self._beat_ctx = []
        for k, v in (cfg.get("beats") or {}).items():
            a, _, b = k.partition("..")
            i0 = self.order.index(a)
            i1 = self.order.index(b) if b else i0
            self._beat_ctx.append((min(i0, i1), max(i0, i1), v))

    # ---- context ------------------------------------------------------------------------
    def ctx(self, chapter: str, beat_id: str) -> dict:
        key = (chapter, beat_id)
        if key in self._ctx:
            return self._ctx[key]
        c = dict(self.cfg["chapters"].get(chapter, {}))
        i = self.order.index(beat_id)
        for i0, i1, v in self._beat_ctx:
            if i0 <= i <= i1:
                c.update(v)
        c.setdefault("scenes", [])
        c.setdefault("who", [])
        c.setdefault("graded_scenes", GRADEABLE_DEFAULT)
        c.setdefault("time", None)
        self._ctx[key] = c
        return c

    # ---- helpers on assets ----------------------------------------------------------------
    def zmax(self, a) -> float:
        L = a["wl"]
        zm = max(1.0, min(2.2, L.get("w", a.get("width", 1920)) / 900.0))
        return zm

    def layout_for(self, a) -> str:
        L = a["wl"]
        w, h = L.get("w", a["width"]), L.get("h", a["height"])
        r = w / h
        if 1.6 <= r <= 2.05 and w >= 1100:
            return "fill"
        if L["scale"] in ("closeup", "medium") and L["who"] and w >= 1000 and len(L["who"]) <= 2 and L.get("crop_only") is None:
            return "fill"
        if r > 2.05 or r < 0.9:
            return "fill"                                    # tall / panoramic frames are only ever shown as crops
        return "depth_frame"

    def variants(self, a) -> list:
        """Ordered re-crops of one asset: dicts(x, y, zoom, kind, who?)."""
        L = a["wl"]
        if "_variants" in L:
            return L["_variants"]
        fx, fy = L.get("focus") or a.get("focus") or [0.5, 0.4]
        zmax = min(self.zmax(a), float(L.get("maxz", 9)))
        co = L.get("crop_only")
        zmin = co["zoom"] if co else 1.0
        v = []

        def add(x, y, z, kind, who=None):
            z = round(min(max(z, zmin), max(zmax, zmin)), 2)
            x, y = round(min(max(x, 0.0), 1.0), 3), round(min(max(y, 0.0), 1.0), 3)
            for o in v:
                if abs(o["x"] - x) < 0.05 and abs(o["y"] - y) < 0.05 and abs(o["zoom"] - z) < 0.12:
                    return
            d = dict(x=x, y=y, zoom=z, kind=kind)
            if who:
                d["who"] = who
            v.append(d)

        if L.get("crops"):
            for c in L["crops"]:
                add(c["x"], c["y"], c["zoom"], "manual")
        if co:
            add(co["x"], co["y"], co["zoom"], "forced")
        add(fx, fy, 1.0, "natural")
        tall = L.get("h", 1080) / max(L.get("w", 1920), 1) > 1.0
        for who, (x, y) in (L.get("faces") or {}).items():
            add(x, y, 1.9, "face", who)
        for (x, y) in L.get("clone_points") or []:
            add(x, y, 1.9, "clone", "naruto_clones")
        add(fx, fy, 1.4, "tight")
        if not tall:
            add(fx - 0.22, fy, 1.55, "left")
            add(fx + 0.22, fy, 1.55, "right")
        add(fx, fy + 0.08, 1.75, "tight2")
        add(fx - 0.1, fy - 0.05, 1.25, "soft")
        add(fx + 0.08, fy + 0.04, 1.1, "soft2")
        add(fx - 0.14, fy + 0.1, 1.95, "tight3")
        add(fx + 0.14, fy - 0.06, 1.65, "tight4")
        L["_variants"] = v
        return v

    def cap(self, a) -> int:
        return max(1, min(self.reuse_cap, len(self.variants(a))))

    # ---- scoring ----------------------------------------------------------------------------
    def want(self, slot) -> dict:
        """What this slot needs (cached on the slot)."""
        w = slot.get("_wl")
        if w:
            return w
        b = slot["beat"]
        ctx = self.ctx(slot["chapter"], slot["beat_id"])
        spk = b["speaker"]
        dialogue = spk != "NARRATOR"
        text = b["text"].lower()
        speakers = [(spk, 1.0)] + [(x["speaker"], 0.45) for x in slot.get("also", [])]
        who = []
        for sp, wt in speakers:
            for k in SPEAKER_WHO.get(sp, []):
                who.append((k, wt))
        subs = [s for s in (slot["spec"].get("subjects") or []) if s in CHAR_KEYS]
        mention = {k for k, rx in MENTION.items() if re.search(rx, text)}
        for x in slot.get("also", []):
            mention |= {k for k, rx in MENTION.items() if re.search(rx, x["text"].lower())}
        if not dialogue:
            for i, s in enumerate(subs):
                who.append((s, 1.0 if i == 0 else 0.5))
            for m in sorted(mention):
                who.append((m, 0.8))
        w = dict(dialogue=dialogue, who=who, mention=mention | set(subs) | {k for k, _ in who},
                 expr=infer_expression(b.get("emotion", "")), shot=slot["spec"].get("shot"),
                 mood=slot["spec"].get("mood"), first=slot["first"])
        slot["_wl"] = w
        return w

    def only_ok(self, L, beat_id):
        if not L.get("only"):
            return True
        if "_only" not in L:
            ids = set()
            for k in L["only"]:
                x, _, y = k.partition("..")
                i0 = self.order.index(x)
                i1 = self.order.index(y) if y else i0
                ids |= set(self.order[min(i0, i1):max(i0, i1) + 1])
            L["_only"] = ids
        return beat_id in L["_only"]

    def score(self, slot, a):
        L = a["wl"]
        if not self.only_ok(L, slot["beat_id"]):
            return -99.0, 0.0
        ctx = self.ctx(slot["chapter"], slot["beat_id"])
        w = self.want(slot)
        s = 8.0
        # --- introduction windows: nobody on screen before (or outside) the beats where the story has met them ------------------
        for k in set(L["who"]) | (TEAM7 if "team7" in L["who"] else set()):
            win = self.windows.get(k)
            if win is not None and slot["beat_id"] not in win:
                return -99.0, 0.0
        # --- cast of the chapter ----------------------------------------------------------
        lw = set(L["who"])
        if lw:
            expanded = set(lw) | (TEAM7 if "team7" in lw else set())
            allowed = set(ctx["who"]) | {"villagers"}
            if self.relax >= 3 and (L["scale"] == "wide" or lw <= {"hiruzen"}):   # placeholders: wide frames where a bystander is tiny
                allowed |= {"iruka", "hiruzen", "sakura", "sasuke", "team7"}
            if ctx["who"] and not (expanded - {"villagers"}) <= allowed:
                return -99.0, 0.0
        # --- scene / time ---------------------------------------------------------------------
        scenes = ctx["scenes"]
        t = ctx.get("time")
        grade = None
        if self.relax >= 2:                                # last resort: neighbouring scene types that keep the cast and the time of day
            if L["scene"] in ("forest_night_ep1", "seal_mindscape", "parents_flashback", "apartment_bed") and L["scene"] not in scenes:
                return -99.0, 0.0
            if t == "night":
                scenes = scenes + ["neutral_portrait", "object", "village_night"]     # never a daytime interior in the night forest
            else:
                scenes = scenes + ["village_day", "classroom_academy", "neutral_portrait", "object", "archive_library", "hokage_office"]
            if self.relax >= 3 and L["scene"] == "parents_flashback":
                scenes = scenes + ["parents_flashback"]
        if t in ("night", "lamp") and self.relax >= 2:
            if L["time"] in ("day", "dusk") and not L["ok_as_night"]:
                return -99.0, 0.0
            if L["scene"] in scenes:
                s += 1.0
            else:
                return -99.0, 0.0
        elif t in ("night", "lamp"):
            if L["time"] == "night":
                pass
            elif L["time"] in ("day", "dusk") and not L["ok_as_night"]:
                return -99.0, 0.0
            if L["scene"] in scenes:
                s += 3.0 - 0.6 * scenes.index(L["scene"])
            elif L["ok_as_night"] and L["scene"] in ctx["graded_scenes"]:
                s += 1.2
            else:
                return -99.0, 0.0
        else:
            if L["scene"] in scenes:
                s += 3.0 - 0.6 * scenes.index(L["scene"])
            elif scenes:
                if L["ok_as_night"] and L["scene"] in ctx["graded_scenes"] and t != "day":
                    s += 0.8
                else:
                    return -99.0, 0.0
            if t == "day" and L["time"] == "night" and L["scene"] not in NO_GRADE_SCENES:
                return -99.0, 0.0
        # --- who on screen -------------------------------------------------------------------
        sem = 2.0
        wanted = w["who"]
        if not lw:
            if w["dialogue"]:
                return -99.0, 0.0                          # dialogue always shows the speaker (or a clone / Naruto for CLONE)
            else:
                s += 2.4 if (not wanted or w["shot"] in ("wide", "establishing") or w["mood"] == "establishing") else 1.0
        else:
            expanded = set(lw) | (TEAM7 if "team7" in lw else set())
            hit = 0.0
            prim = 0.0
            for k, wt in wanted:
                if wt >= 1.0 and (k in expanded or {k, "naruto"} <= {k} | expanded and k in ("naruto_clones", "naruto") and expanded & {"naruto", "naruto_clones"}):
                    prim = 1.0
            if w["dialogue"] and not prim:
                return -99.0, 0.0
            for k, wt in wanted:
                if k in expanded:
                    hit = max(hit, wt)
                elif k == "naruto" and "naruto_clones" in expanded:
                    hit = max(hit, wt * 0.8)
                elif k == "naruto_clones" and "naruto" in expanded:
                    hit = max(hit, wt * 0.8)
            if w["dialogue"]:
                if not hit:
                    return -99.0, 0.0
                s += 6.0 * hit
            else:
                if wanted:
                    s += 4.0 * hit if hit else -1.5
                else:
                    s += 0.5
            ok = w["mention"] | ({"naruto_clones"} if "naruto" in w["mention"] else set()) | ({"naruto"} if "naruto_clones" in w["mention"] else set())
            extra = [k for k in expanded if k not in ok and k != "villagers" and not (k == "team7")]
            if "team7" in lw:
                extra = [k for k in extra if k not in TEAM7 or k not in ok]
            s -= min(5.0, 2.5 * len(extra))
        # --- expression / scale / quality --------------------------------------------------
        s += expr_sim(w["expr"], L["expression"]) * (1.0 if w["dialogue"] or lw else 0.4)
        shot = w["shot"]
        if shot:
            if shot in ("closeup", "extreme_closeup") and L["scale"] == "closeup" or shot == L["scale"]:
                s += 1.0
            elif (shot, L["scale"]) in SCALE_NEAR or (shot in ("establishing", "group") and L["scale"] == "wide"):
                s += 0.5
            elif shot == "establishing" and L["scale"] != "wide":
                s -= 1.0
        if w["dialogue"] and L["scale"] == "wide" and lw:
            s -= 0.8
        s += 0.8 * a.get("quality", 0.5)
        if a.get("lowres") or L.get("w", 1920) < 1000:
            s -= 0.8
        if a["id"] in (self.cfg.get("avoid") or []):
            s -= 3.0
        return s, sem

    # ---- crops / grades -----------------------------------------------------------------------
    def grade_for(self, slot, a):
        ctx = self.ctx(slot["chapter"], slot["beat_id"])
        t = ctx.get("time")
        L = a["wl"]
        if L["scene"] in NO_GRADE_SCENES and L["time"] != "day":
            return None
        if t == "night":
            return None if L["time"] == "night" else "night"
        if t == "lamp":
            return "interior_lamp" if L["time"] != "night" or L["scene"] in ("archive_library", "hokage_office") else "night"
        return ctx.get("grade") or None

    def assign_crops(self, slots, assign, by_id):
        """-> {slot index: dict(crop, layout, grade, kind)}; every use of an asset gets a different crop."""
        uses = {}
        for i in sorted(assign):
            if assign.get(i):
                uses.setdefault(assign[i], []).append(i)
        out = {}
        for aid, idxs in uses.items():
            a = by_id[aid]
            L = a["wl"]
            vs = self.variants(a)
            taken = set()
            idxs = sorted(idxs, key=lambda j: (slots[j]["beat"]["speaker"] == "NARRATOR", j))
            for n, i in enumerate(idxs):
                sl = slots[i]
                w = self.want(sl)
                spk = {k for k, _ in w["who"]}
                best, bs = None, -1e9
                for vi, v in enumerate(vs):
                    if vi in taken:
                        continue
                    f = -0.15 * vi
                    if v["kind"] == "natural" and n == 0:
                        f += 0.8
                    if v["kind"] in ("face", "clone"):
                        f += 3.0 if (v.get("who") in spk or (v["kind"] == "clone" and spk & {"naruto_clones", "naruto"})) else -2.0
                        if not w["dialogue"] and v["kind"] == "face":
                            f -= 0.5
                    if v["kind"] == "forced":
                        f += 1.0
                    shot = w["shot"]
                    if shot in ("wide", "establishing") and v["zoom"] > 1.3:
                        f -= 1.4
                    if (shot in ("closeup", "extreme_closeup") or w["dialogue"]) and v["zoom"] > 1.3 and L["who"]:
                        f += 0.8
                    if v["kind"] == "natural" and n > 0 and L["scale"] == "wide":
                        f -= 0.3
                    if f > bs:
                        best, bs = vi, f
                if best is None:
                    best = n % len(vs)
                taken.add(best)
                v = vs[best]
                lay = self.layout_for(a)
                if v["zoom"] > 1.0 or v["kind"] in ("face", "clone", "forced", "manual"):
                    lay = "fill"
                out[i] = dict(crop=dict(x=v["x"], y=v["y"], zoom=v["zoom"]), kind=v["kind"], layout=lay,
                              grade=self.grade_for(sl, a))
        return out

    def background_pool(self, assets):
        return [a for a in assets if a.get("wl")]


BG_SCENES = {   # designed-insert backdrops -> preferred whitelisted scenes, in order
    "scroll_note": (["forest_night_ep1", "village_night"], "night"),
    "notebook_rules": (["village_day", "classroom_academy"], "day"),
    "maths_card": (["training_ground", "village_day"], "day"),
    "staff_form": (["hokage_office", "neutral_portrait"], "day"),
    "kazekage_letter": (["hokage_office", "archive_library"], "day"),
    "mission_report": (["archive_library", "classroom_academy", "hokage_office"], "day"),
    "evaluation_folder": (["archive_library", "hokage_office"], "day"),
    "roster": (["archive_library", "hokage_office"], "night"),
}
