"""Episode schema validation. Fails loudly with precise messages instead of rendering a broken video."""
from __future__ import annotations
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REQUIRED_TOP = ["id", "number", "title", "central_question", "template", "narrator_voice",
                "target_duration_seconds", "scenes", "claims", "sources"]
REQUIRED_SCENE = ["id", "scene", "min_duration", "pad_after", "music_cue", "sfx", "claims", "transition"]
TEMPLATES = {"hidden-mechanism", "cascade", "counterintuitive-truth", "thriller", "history-pov"}
TRANSITIONS = {"cut", "wipe", "iris", "fade", "dissolve", "light", "dip", "match"}
CLAIM_TYPES = {"established", "plausible", "illustrative", "estimate", "disputed", "metaphor"}
MUSIC_CUES = {"curious", "playful", "tension-rise", "tension", "tension-peak", "revelation", "warm", "outro", "intimate", "unease", "cold", "hush", "power", "aftermath",
             "dawn", "village", "market", "problem", "reveal", "resolve", "tease", "dread", "brawl", "chase", "numb", "pub"}
SFX_NAMES = {"sparkle", "flutter", "paper", "thud", "stamp", "coins", "drain", "water", "gate", "brake", "sting", "chime", "ping", "rumble", "whoosh", "puff", "beep", "static", "tick", "buzz", "thump", "step", "pen", "door", "swell", "rain",
             "hen", "creak", "chink", "chop", "churchbell", "anvil", "rustle", "mudstep", "gasp", "smash", "punch", "horn", "roar", "doorslam", "run"}
# history profile: painted 2.5D sets (renderer/history/sets) and on-screen evidence labels
HISTORY_SETS = {"cottage", "village", "coin", "field", "cottage_dusk", "abbey_floor", "abbey_parlour",
                "alehouse", "alehouse_day", "village_night", "church_door", "church_dawn", "map_dover"}
AMBIENCE = {"interior", "village", "market", "alehouse", "night", "none"}
BADGE_CLAIM_TYPES = {"documented": {"established"}, "estimate": {"estimate"}, "disputed": {"disputed"},
                     "reconstruction": {"plausible", "illustrative"}, "dramatised": None}
URL_RE = re.compile(r"^https://[\w.-]+(/[^\s]*)?$")


class EpisodeError(ValueError):
    pass


def load_episode(ep_id: str) -> dict:
    d = ROOT / "episodes" / ep_id
    f = d / "episode.json"
    if not f.exists():
        avail = sorted(p.name for p in (ROOT / "episodes").iterdir() if (p / "episode.json").exists())
        raise EpisodeError(f"No episode '{ep_id}'. Available: {avail}")
    ep = json.loads(f.read_text())
    validate(ep, d)
    return ep


def validate(ep: dict, folder: Path | None = None) -> None:
    errs = []
    for k in REQUIRED_TOP:
        if k not in ep:
            errs.append(f"missing top-level field '{k}'")
    if errs:
        raise EpisodeError("; ".join(errs))
    if ep["template"] not in TEMPLATES:
        errs.append(f"template must be one of {sorted(TEMPLATES)}")
    lo, hi = ep["target_duration_seconds"]
    if not (0 < lo < hi):
        errs.append("target_duration_seconds must be [lo, hi] with lo < hi")
    claim_ids = {c["id"] for c in ep["claims"]}
    source_ids = {s["id"] for s in ep["sources"]}
    seen = set()
    for i, s in enumerate(ep["scenes"]):
        for k in REQUIRED_SCENE:
            if k not in s:
                errs.append(f"scene {i} ({s.get('id','?')}): missing '{k}'")
        if s.get("id") in seen:
            errs.append(f"duplicate scene id {s.get('id')}")
        seen.add(s.get("id"))
        if s.get("silent"):
            s.setdefault("narration", "")
            if not s.get("caption", "").strip():
                errs.append(f"scene {s.get('id')}: a silent scene needs an on-screen caption")
        elif s.get("lines"):
            for j, ln in enumerate(s["lines"]):
                if not ln.get("text", "").strip():
                    errs.append(f"scene {s.get('id')} line {j}: text is empty")
                if not (ROOT / "characters" / f"{ln.get('who')}.json").exists():
                    errs.append(f"scene {s.get('id')} line {j}: unknown character '{ln.get('who')}' (add characters/{ln.get('who')}.json)")
                if len(ln.get("text", "")) > 90:
                    errs.append(f"scene {s.get('id')} line {j}: line longer than 90 chars; split it so captions stay readable")
            if not s.get("caption"):
                s["caption"] = " ".join(ln["text"] for ln in s["lines"])[:90]
            s.setdefault("narration", " ".join(ln["text"] for ln in s["lines"]))
        else:
            if not s.get("narration", "").strip():
                errs.append(f"scene {s.get('id')}: narration is empty")
            if not s.get("caption", "").strip():
                errs.append(f"scene {s.get('id')}: caption is empty")
        for k in ("cast",):
            for cid in s.get(k, []):
                if not (ROOT / "characters" / f"{cid}.json").exists():
                    errs.append(f"scene {s.get('id')}: cast member '{cid}' has no characters/{cid}.json")
        if len(s.get("caption", "")) > 90:
            errs.append(f"scene {s.get('id')}: caption longer than 90 chars (phone readability)")
        if s.get("transition") not in TRANSITIONS:
            errs.append(f"scene {s.get('id')}: transition must be one of {sorted(TRANSITIONS)}")
        if s.get("music_cue") not in MUSIC_CUES:
            errs.append(f"scene {s.get('id')}: music_cue must be one of {sorted(MUSIC_CUES)}")
        for fx in s.get("sfx", []):
            if fx.get("name") not in SFX_NAMES:
                errs.append(f"scene {s.get('id')}: unknown sfx '{fx.get('name')}'")
            if ep.get("profile") == "history":
                from pipeline.history import valid_anchor
                if not valid_anchor(fx.get("at")):
                    errs.append(f"scene {s.get('id')}: sfx 'at' must be seconds, 'p<frac>', 'end-<s>' or {{line, off}}")
            elif not isinstance(fx.get("at"), (int, float)) or fx["at"] < 0:
                errs.append(f"scene {s.get('id')}: sfx 'at' must be a non-negative number")
        for c in s.get("claims", []):
            if c not in claim_ids:
                errs.append(f"scene {s.get('id')}: references unknown claim '{c}'")
        if not isinstance(s.get("min_duration"), (int, float)) or s["min_duration"] <= 0:
            errs.append(f"scene {s.get('id')}: min_duration must be > 0")
    for c in ep["claims"]:
        if c.get("type") not in CLAIM_TYPES:
            errs.append(f"claim {c.get('id')}: type must be one of {sorted(CLAIM_TYPES)}")
        for sid in c.get("sources", []):
            if sid not in source_ids:
                errs.append(f"claim {c.get('id')}: unknown source '{sid}'")
        if c.get("type") in {"established", "estimate"} and not c.get("sources"):
            errs.append(f"claim {c.get('id')} is '{c.get('type')}' but cites no sources")
    for s in ep["sources"]:
        if not URL_RE.match(s.get("url", "")):
            errs.append(f"source {s.get('id')}: invalid https URL")
        for k in ("title", "publisher", "accessed"):
            if not s.get(k):
                errs.append(f"source {s.get('id')}: missing '{k}'")
    if ep.get("visual_mode") not in (None, "svg", "art", "auto"):
        errs.append("visual_mode must be svg, art or auto")
    art_active = ep.get("visual_mode") == "art" or (ep.get("visual_mode") == "auto" and ep.get("art_manifest") and (ROOT / ep["art_manifest"]).exists())
    if art_active:
        man_path = ROOT / ep.get("art_manifest", "")
        panels = json.loads(man_path.read_text())["panels"] if ep.get("art_manifest") and man_path.exists() else None
        if panels is None:
            errs.append(f"visual_mode 'art' but art_manifest {ep.get('art_manifest')!r} not found (run python -m pipeline.import_panels)")
        for sc in ep["scenes"]:
            a = sc.get("art")
            if not a or not a.get("shots"):
                errs.append(f"scene {sc.get('id')}: visual_mode 'art' requires art.shots"); continue
            starts = [sh.get("start", -1) for sh in a["shots"]]
            if starts[0] != 0 or starts != sorted(starts) or starts[-1] >= 1:
                errs.append(f"scene {sc.get('id')}: art shot starts must begin at 0, increase, and be < 1")
            for sh in a["shots"]:
                if panels is not None and sh.get("panel") not in panels:
                    errs.append(f"scene {sc.get('id')}: unknown art panel {sh.get('panel')!r}")
                z = sh.get("zoom", [])
                if len(z) != 2 or min(z) < 1.0:
                    errs.append(f"scene {sc.get('id')}: zoom must be [from, to] with both >= 1.0 (art must always fill the frame)")
    if ep.get("profile") == "history":
        errs += validate_history(ep, claim_ids)
    if folder is not None and not (folder / "research.md").exists():
        errs.append("research.md is missing from the episode folder")
    if "financials" in ep:
        f = ep["financials"]
        if f["revenue"] - f["expenses"] != f["profit"]:
            errs.append("financials: profit != revenue - expenses")
        if f["revenue"] - f["collected_from_customers"] != f["receivables"]:
            errs.append("financials: receivables != revenue - collected")
        if f["starting_cash"] + f["collected_from_customers"] - f["cash_paid_out"] != f["cash_now"]:
            errs.append("financials: cash_now != starting_cash + collected - paid")
    if errs:
        raise EpisodeError("Episode validation failed:\n  - " + "\n  - ".join(errs))


def validate_history(ep: dict, claim_ids: set) -> list:
    errs = []
    claims = {c["id"]: c for c in ep["claims"]}
    for s in ep["scenes"]:
        sid = s.get("id")
        if s.get("set") not in HISTORY_SETS:
            errs.append(f"scene {sid}: set must be one of {sorted(HISTORY_SETS)}")
        if s.get("ambience", "none") not in AMBIENCE:
            errs.append(f"scene {sid}: ambience must be one of {sorted(AMBIENCE)}")
        if not s.get("lines") and not s.get("silent"):
            errs.append(f"scene {sid}: history scenes speak through 'lines' (narrator + characters) so subtitles are timed per line")
        for b in s.get("badges", []):
            kind = b.get("kind")
            if kind not in BADGE_CLAIM_TYPES:
                errs.append(f"scene {sid}: badge kind must be one of {sorted(BADGE_CLAIM_TYPES)}"); continue
            allowed = BADGE_CLAIM_TYPES[kind]
            if allowed is None:
                continue
            c = claims.get(b.get("claim"))
            if not c:
                errs.append(f"scene {sid}: '{kind}' badge must cite a claim id"); continue
            if c["type"] not in allowed:
                errs.append(f"scene {sid}: '{kind}' badge cites claim {c['id']} of type '{c['type']}' (needs {sorted(allowed)})")
            if b.get("claim") not in s.get("claims", []):
                errs.append(f"scene {sid}: badge claim {b.get('claim')} is not listed in the scene's claims")
        for a in s.get("actors", []):
            if a.get("char") and not (ROOT / "characters" / f"{a['char']}.json").exists():
                errs.append(f"scene {sid}: actor '{a.get('id')}' uses unknown character '{a['char']}'")
            for ac in a.get("acts", []):
                if "expr" in ac and ac["expr"] is not None and ac["expr"] not in RIG_EXPRESSIONS:
                    errs.append(f"scene {sid}: actor '{a.get('id')}' uses unknown expression '{ac['expr']}'")
        for ln in s.get("lines", []):
            if ln.get("tone") is not None and ln["tone"] not in KOKORO_TONES:
                errs.append(f"scene {sid}: line tone must be one of {sorted(KOKORO_TONES)}")
    if ep.get("voice_engine", "piper") not in ("piper", "kokoro"):
        errs.append("voice_engine must be 'piper' or 'kokoro'")
    if ep.get("voice_engine") == "kokoro":
        import json as _json
        for who in sorted({ln["who"] for s in ep["scenes"] for ln in s.get("lines", [])}):
            f = ROOT / "characters" / f"{who}.json"
            if f.exists() and not (_json.loads(f.read_text()).get("kokoro") or {}).get("voice"):
                errs.append(f"character '{who}' speaks but has no 'kokoro' voice (voice_engine is kokoro)")
    return errs


# names of the history rig's expressions (renderer/history/rig.js, EXPR) and Kokoro delivery tones (pipeline/kokoro.py)
RIG_EXPRESSIONS = {"neutral", "sleepy", "asleep", "surprised", "shocked", "happy", "delighted", "worried", "determined", "curious",
                   "smug", "nervous", "stern", "wince", "awe", "sly", "skeptical", "sheepish", "angry", "sad", "relieved", "proud",
                   "exhausted", "laughing", "horrified", "dreamy", "pleading", "grumpy", "startled", "eager"}
KOKORO_TONES = {"hook", "curious", "confident", "tense", "reveal", "reflective", "resolve", "playful"}


if __name__ == "__main__":
    import sys
    ep = load_episode(sys.argv[1])
    print(f"OK: {ep['id']} ({len(ep['scenes'])} scenes, {len(ep['sources'])} sources)")
