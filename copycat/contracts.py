"""COPYCAT data contracts: project validation and the SceneProductionNode adapter.

The authoring format (projects/<id>/project.json) is deliberately small; this module expands every beat into the
full SceneProductionNode contract (traceability, visual sourcing, render directive, audio plan, captions) that the
QA engine audits and that the renderer plan is derived from.
"""
from __future__ import annotations
import re

DOMAINS = {"fictional_what_if", "factual_documentary", "educational_explainer", "business_case", "historical", "hybrid"}
CANON_TAGS = {"canon": "CANON_ESTABLISHED", "rule": "CANON_ESTABLISHED", "inferred": "CANON_INFERRED", "divergent": "WHAT_IF_DIVERGENT", "none": "NONE"}
BANNED_OPENERS = ["in a world where", "have you ever wondered", "let's dive", "lets dive", "in conclusion", "without further ado", "buckle up"]
DIAGRAM_SHOTS = {"state_card", "equation", "checklist_countdown", "canon_vs_now", "timeline_rewind", "timeline_pushback", "threat_timeline", "dilemma", "inventory", "ki_radar", "union_meter", "evidence_board", "knows_list", "underworld", "anti_source", "foresight"}
CARD_SHOTS = {"title_card", "chapter_card", "end_card", "problem_card", "ripple_card", "text_slam", "quote_card", "quote_duel", "captain_file", "squad_card", "title_callback"}
PURPOSE = ["cold_open_hook", "premise_setup", "rising_action", "turning_point", "rising_action", "context_lore", "cliffhanger_outro"]


def clean_say(say: str) -> str:
    s = re.sub(r"\{\w+\}|\*|@n:", "", say or ""); s = re.sub(r"@(\w+):", lambda m: m.group(1).upper() + ":", s)
    return re.sub(r"\s+", " ", s).strip()


def validate_project(p: dict) -> list[str]:
    bad = []
    for k in ("id", "title", "domain", "format", "voice", "chapters", "beats"):
        if k not in p: bad.append(f"missing key {k}")
    if bad: return bad
    if p["domain"] not in DOMAINS: bad.append(f"unknown domain {p['domain']}")
    chs = {c["id"] for c in p["chapters"]}; seen = set()
    for b in p["beats"]:
        if b["id"] in seen: bad.append(f"duplicate beat id {b['id']}")
        seen.add(b["id"])
        if b.get("ch") not in chs: bad.append(f"{b['id']}: unknown chapter {b.get('ch')}")
        if "type" not in b.get("shot", {}): bad.append(f"{b['id']}: shot.type missing")
        say = b.get("say", "")
        if say.count("*") % 2: bad.append(f"{b['id']}: unbalanced *emphasis*")
        if not say and "duration" not in b: bad.append(f"{b['id']}: silent beat needs a duration")
        cues = set(re.findall(r"\{(\w+)\}", say))
        for fx in b.get("sfx", []):
            if isinstance(fx["at"], str) and fx["at"] not in cues: bad.append(f"{b['id']}: sfx cue '{fx['at']}' not marked in narration")
        if b.get("canon", "none") not in CANON_TAGS: bad.append(f"{b['id']}: bad canon tag")
    first = clean_say(next((b["say"] for b in p["beats"] if b.get("say")), "")).lower()
    for ph in BANNED_OPENERS:
        if any(ph in clean_say(b.get("say", "")).lower() for b in p["beats"]): bad.append(f"banned filler phrase used: '{ph}'")
    return bad


def scene_node(beat: dict, i: int, project: dict, dossier: dict) -> dict:
    src, shot = beat["_src"], beat["shot"]; t = shot["type"]
    chi = next((k for k, c in enumerate(project["chapters"]) if c["id"] == beat["chapter"]), 0)
    mode = "title_card" if t in CARD_SHOTS else "animated_diagram" if t in DIAGRAM_SHOTS else "svg_character_animation"
    return {
        "sceneId": beat["id"], "chapterId": beat["chapter"], "sequenceIndex": i, "narrativePurpose": PURPOSE[min(chi, len(PURPOSE) - 1)],
        "narrationText": clean_say(src.get("say", "")), "estimatedDurationMs": round((beat["end"] - beat["start"]) * 1000),
        "dossierClaimIds": src.get("claims", []), "canonTag": CANON_TAGS[beat["canon"]], "continuityStateSnapshot": src.get("state"),
        "visualBrief": {"subjectIds": src.get("subjects", []), "actionDescription": t.replace("_", " ") + (f" ({shot['stage']})" if "stage" in shot else ""), "emotionalTone": src.get("music") or "chapter default", "shotComposition": mode, "searchQueries": []},
        "candidateAssetIds": [f"proc:{t}"],
        "selectedAsset": {"assetId": f"proc:{t}", "acquisitionTier": 1, "licenseStatus": "internal_asset",
                          "fallbackReason": "No authorised source footage or stills were present in the vault; beat resolved to a repo-owned procedural motion component (tier 1/6) rather than generated imagery."},
        "visualTreatment": {"renderMode": mode, "cameraMovement": {"type": "parallax_drift", "intensity": 0.5}, "overlays": [{"type": "citation_badge", "text": CANON_TAGS[beat["canon"]]}] if beat["canon"] != "none" else [], "animationDirective": shot},
        "audioPlan": {"ttsVoiceProfile": src.get("voice", "narrator"), "pacingMultiplier": 1.0, "bgmTrackId": src.get("music") or "chapter", "bgmVolumeDb": -15, "sfxTriggers": [{"sfxId": f["name"], "offsetMs": round((beat["cues"].get(f["at"], 0) if isinstance(f["at"], str) else f["at"]) * 1000), "reason": str(f["at"])} for f in src.get("sfx", [])]},
        "captions": {"enabled": shot.get("captions", True) is not False, "stylePreset": "karaoke_condensed"},
        "transitionOut": {"type": "dip_to_black" if shot.get("out") == "black" else "hard_cut", "durationMs": 0},
    }
