"""Per-shot production manifest: one JSON record per shot, assembled from what the pipeline actually produced.

Sources: episodes/<id>/episode.json (script, claims, sources, audio cues), out/<id>/timeline.json (real narration and word
timings), out/<id>/shots_probe.json (pipeline/shot_probe.mjs: what each shot stages in the renderer). Each shot records:
duration, narration, caption word timings, a visual description, character ids and their timed actions, set, camera,
overlays, source references, asset paths, audio cues and validation status. It also scores "slideshow risk".

usage: python -m pipeline.shot_manifest <episode_id>      (writes episodes/<id>/shot_manifest.json)
"""
from __future__ import annotations
import json, subprocess, sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from pipeline.build import fx_time  # noqa: E402


def probe(ep_id: str) -> list:
    out = ROOT / "out" / ep_id
    subprocess.run(["node", str(ROOT / "pipeline" / "shot_probe.mjs"), str(out / "plan.json"), str(out / "shots_probe.json")], check=True, cwd=ROOT)
    return json.loads((out / "shots_probe.json").read_text())


def characters_act(sh: dict, loop_end: bool = False) -> bool:
    """A shot with figures must show someone doing something (a pose or expression key, or a walk). The one exception is
    the engine-v6 loop end scene: its camera is keyed back to frame 1 and its figures hold frame 1's pose on purpose, so a
    keyed camera move counts as the action there (Case Files 84 and 85 failed the gate on this after a 40-minute render)."""
    if not sh.get("figures"):
        return True
    if any(f.get("actions") or f.get("walk") for f in sh["figures"]):
        return True
    return bool(loop_end and "keys" in (sh.get("camera") or {}))


def shot_size(sh: dict) -> str:
    figs = [f for f in sh.get("figures", []) if f.get("depth", 1) >= 1]
    if not figs:
        return ("wide" if sh.get("figures") else "insert/graphic") if sh.get("set") else "map/graphic"
    cam = sh.get("camera", {}); z = (cam.get("to") or cam.get("from") or {}).get("z", 1.1) if "keys" not in cam else 1.15
    s = max(f.get("scale", 1) for f in figs) * z
    return "close-up" if s >= 1.35 else "medium" if s >= 0.95 else "medium-wide" if s >= 0.6 else "wide"


def describe(sh: dict) -> str:
    if not sh.get("composed"):
        return "Animated map / graphic (Case Files kit)."
    parts = [f"{sh['set'].replace('_', ' ')} ({sh['grade']} grade)"]
    for f in sh.get("figures", []):
        acts = [a.get("pose") or a.get("expr") for a in f["actions"] if a.get("pose") or a.get("expr")]
        who = f["id"] + (f" [{f['outfit']}]" if f["outfit"] != "default" else "") + (" (silhouette)" if f.get("silhouette") else "")
        parts.append(f"{who}: {f['start_pose']}" + (f" -> {' -> '.join(acts)}" if acts else "") + (" (walks)" if f.get("walk") else ""))
    cam = sh.get("camera", {})
    parts.append(("keyed camera moves" if "keys" in cam else "camera push/pull") + (", handheld" if cam.get("handheld") else ""))
    if sh.get("overlays"):
        parts.append("overlays: " + ", ".join(o["type"] + (f" '{o['text']}'" if o.get("text") else "") for o in sh["overlays"]))
    return "; ".join(parts) + "."


def build(ep_id: str, series_status: dict | None = None) -> dict:
    ep = json.loads((ROOT / "episodes" / ep_id / "episode.json").read_text())
    tl = json.loads((ROOT / "out" / ep_id / "timeline.json").read_text())
    shots = probe(ep_id)
    claims = {c["id"]: c for c in ep["claims"]}; srcs = {s["id"]: s for s in ep["sources"]}
    records = []
    v6 = (ep.get("engagement_version") or 1) >= 6
    for i, (sc, s, sh) in enumerate(zip(ep["scenes"], tl, shots)):
        acting = characters_act(sh, loop_end=v6 and i == len(shots) - 1)
        rec = {
            "id": sc["id"], "scene_type": sc["scene"], "start": round(s["start"], 3), "duration": round(s["end"] - s["start"], 3),
            "narration": [l["text"] for l in s.get("lines", [])],
            "caption_timings": [{"line": i, "start": round(l["start"], 3), "end": round(l["end"], 3),
                                 "words": [{"w": w["w"], "start": round(l["start"] + w["start"], 3), "end": round(l["start"] + w["end"], 3)} for w in l.get("words", [])]}
                                for i, l in enumerate(s.get("lines", []))],
            "visual_description": describe(sh), "shot_size": shot_size(sh), "set": sh.get("set"), "grade": sh.get("grade"), "camera": sh.get("camera"),
            "characters": sorted({f["id"] for f in sh.get("figures", [])}), "character_actions": sh.get("figures", []), "overlays": sh.get("overlays", []),
            "reconstruction_tag": sh.get("tag"), "transition_in": sc["transition"],
            "sources": [{"claim": c, "type": claims[c]["type"], "claim_text": claims[c]["text"],
                         "urls": [srcs[x]["url"] for x in claims[c]["sources"] if x in srcs]} for c in sc["claims"]],
            "audio": {"music_cue": sc["music_cue"], "music_gain_db": sc.get("music_gain_db", 0),
                      "sfx": [{"name": fx["name"], "at": round(fx_time(s, fx), 3), "gain": fx.get("gain", 1.0), **({"word": fx["word"]} if "word" in fx else {})} for fx in sc["sfx"]]},
            "assets": {"shot_code": f"renderer/scenes/{ep_id}.js#{sc['scene']}" if sh.get("composed") else "renderer/doc.js#case_map",
                       "set_code": f"renderer/sets.js#{sh['set']}" if sh.get("set") else None,
                       "characters": [f"characters/figures/{c}.json" for c in sorted({f['id'] for f in sh.get('figures', [])})]},
            "validation": {"claims_sourced": all(len(claims[c]["sources"]) >= 2 and claims[c]["type"] == "established" for c in sc["claims"]),
                           "tagged_as_illustration": (sh.get("tag") or "ILLUSTRATION").startswith("ILLUSTRATION") or not sh.get("composed"),
                           "characters_act": acting},
        }
        records.append(rec)
    composed = [r for r in records if r["set"]]; with_chars = [r for r in composed if r["characters"]]
    sets = Counter(r["set"] for r in composed); sizes = Counter(r["shot_size"] for r in records)
    risk = {"shots": len(records), "composed_shots": len(composed), "shots_with_characters": len(with_chars),
            "character_shot_share": round(len(with_chars) / max(1, len(composed)), 2), "distinct_sets": len(sets),
            "max_set_share": round(max(sets.values()) / max(1, len(composed)), 2), "shot_sizes": dict(sizes),
            "max_shot_size_share": round(max(sizes.values()) / len(records), 2)}
    risk["ok"] = (risk["character_shot_share"] >= 0.75 and risk["distinct_sets"] >= 4 and risk["max_set_share"] <= 0.5
                  and risk["max_shot_size_share"] <= 0.6 and all(r["validation"]["characters_act"] for r in records))
    man = {"episode": ep_id, "title": ep["title"], "duration": round(tl[-1]["end"], 3), "slideshow_risk": risk,
           "production_status": series_status or {}, "shots": records}
    (ROOT / "episodes" / ep_id / "shot_manifest.json").write_text(json.dumps(man, indent=1, ensure_ascii=False) + "\n")
    return man


if __name__ == "__main__":
    m = build(sys.argv[1])
    print(json.dumps(m["slideshow_risk"], indent=1))
    for r in m["shots"]:
        print(f"{r['id']:<14} {r['duration']:5.2f}s {r['shot_size']:<14} {r['visual_description'][:110]}")
