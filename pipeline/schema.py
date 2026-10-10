"""Episode schema validation. Fails loudly with precise messages instead of rendering a broken video."""
from __future__ import annotations
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REQUIRED_TOP = ["id", "number", "title", "central_question", "template", "narrator_voice",
                "target_duration_seconds", "scenes", "claims", "sources"]
REQUIRED_SCENE = ["id", "scene", "min_duration", "pad_after", "music_cue", "sfx", "claims", "transition"]
TEMPLATES = {"hidden-mechanism", "cascade", "counterintuitive-truth", "thriller"}
TRANSITIONS = {"cut", "wipe", "iris", "fade"}
CLAIM_TYPES = {"established", "plausible", "illustrative", "estimate", "disputed", "metaphor"}
MUSIC_CUES = {"curious", "playful", "tension-rise", "tension", "tension-peak", "revelation", "warm", "outro", "intimate", "unease", "cold", "hush", "power", "aftermath"}
SFX_NAMES = {"sparkle", "flutter", "paper", "thud", "stamp", "coins", "drain", "water", "gate", "brake", "sting", "chime", "ping", "rumble", "whoosh", "puff", "beep", "static", "tick", "buzz", "thump", "step", "pen", "door", "swell"}
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
            if not isinstance(fx.get("at"), (int, float)) or fx["at"] < 0:
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


if __name__ == "__main__":
    import sys
    ep = load_episode(sys.argv[1])
    print(f"OK: {ep['id']} ({len(ep['scenes'])} scenes, {len(ep['sources'])} sources)")
