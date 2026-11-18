"""Delivery package: upload copy (title, description, chapters, tags), provenance report, research bibliography.

usage: python -m copycat.package <project-id>
Reads out/copycat/<id>/{plan,dossier,scene-plan,audio-manifest}.json and qa/scorecard.json; writes out/copycat/<id>/package/.
"""
from __future__ import annotations
import json, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def ts(s: float) -> str:
    s = int(s); return f"{s // 60}:{s % 60:02d}" if s < 3600 else f"{s // 3600}:{(s % 3600) // 60:02d}:{s % 60:02d}"


def build(pid: str) -> Path:
    out = ROOT / "out" / "copycat" / pid; pk = out / "package"; pk.mkdir(exist_ok=True)
    proj = json.loads((ROOT / "copycat" / "projects" / pid / "project.json").read_text())
    plan = json.loads((out / "plan.json").read_text()); dos = json.loads((out / "dossier.json").read_text())
    scenes = json.loads((out / "scene-plan.json").read_text()); audio = json.loads((out / "audio-manifest.json").read_text())
    qa = json.loads((out / "qa" / "scorecard.json").read_text()) if (out / "qa" / "scorecard.json").exists() else None
    chapters = [("0:00", "Cold open")] + [(ts(c["start"]), c["title"].title()) for c in plan["chapters"] if c.get("title")]
    title = "What If Asta Was Reborn With ALL His Memories? (Black Clover What If) | Part 1"
    desc = f"""He died at the end of the war. He woke up as a baby on the church doorstep in Hage, with every memory intact.
But Anti-Magic was never his. It belongs to a devil sealed in a book in the tower wall. And a child carrying a devil's grimoire doesn't get a trial; he gets executed.

This is Part 1: the training arc, the brother in the book, the ceremony, the entrance exam... and the door.

CHAPTERS
""" + "\n".join(f"{a} {b}" for a, b in chapters) + f"""

Canon vs what-if: every scene is tagged on screen. CANON = established in the manga, CANON RULE = a hard limit the story respects, WHAT-IF TIMELINE = divergence.

{proj['disclaimer']}
Narration voices: Kokoro-82M (Apache-2.0). Fonts: Anton, Bebas Neue, Barlow Condensed, Inter, Cinzel, Cinzel Decorative, IM Fell English SC (SIL Open Font License). Music and sound design composed procedurally for this video.

#BlackClover #WhatIf #Asta #Anime
"""
    (pk / "youtube_title.txt").write_text(title + "\n")
    (pk / "youtube_description.txt").write_text(desc)
    (pk / "tags.txt").write_text(", ".join(["black clover", "black clover what if", "what if asta", "asta reborn", "asta reborn with memories", "anime what if", "liebe", "anti magic", "black clover theory", "yuno", "yami sukehiro", "julius novachrono", "lucius zogratis", "black clover manga"]) + "\n")
    claims = {c["claimId"]: c for c in dos["claims"]}; srcs = {s["sourceId"]: s for s in dos["sources"]}
    used = sorted({cid for b in proj["beats"] for cid in b.get("claims", [])})
    bib = [f"# Research bibliography — {proj['title']}\n", f"Dossier `{dos['dossierId']}` · retrieved {dos.get('retrievedAt','')} · content hash `{dos.get('contentHash','')}`\n",
           "Access layer: web-search result summaries; source pages were not fetched from this environment. Treat chapter anchors as approximate.\n", "## Claims used on screen\n"]
    for cid in used:
        c = claims.get(cid)
        if not c: continue
        tag = "source-backed" if c.get("verification") == "source_backed" else "**not verified in this run (writer's knowledge)**"
        bib.append(f"- **{cid}** ({tag}, confidence {c['confidence']}): {c['statement']}" + (f" — anchor: {c['temporalAnchor']}" if c.get("temporalAnchor") else "") + ("".join(f"\n  - [{srcs[s]['title'] or srcs[s]['urlOrPath']}]({srcs[s]['urlOrPath']})" for s in c["supportingSourceIds"] if s in srcs)))
    bib.append("\n## Contradictions handled\n" + "\n".join(f"- {x['issue']} → {x['resolutionStrategy']}" for x in dos.get("contradictionsAndNuances", [])))
    (pk / "bibliography.md").write_text("\n".join(bib) + "\n")
    tiers = {}
    for s in scenes: tiers[s["selectedAsset"]["acquisitionTier"]] = tiers.get(s["selectedAsset"]["acquisitionTier"], 0) + 1
    prov = {"project": pid, "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%S"),
            "visuals": {"scenes": len(scenes), "acquisitionTiers": tiers, "aiGeneratedImagery": 0, "thirdPartyFootage": 0,
                        "note": "Every frame is drawn by the repo's own Canvas renderer (copycat/renderer). No anime footage, manga panels, official artwork or AI-generated images were used. No authorised Black Clover media was present in copycat/vault/black-clover/media/, so nothing was indexed; drop authorised files there to have them preferred."},
            "audio": {"narration": {"engine": "Kokoro-82M v1.0 ONNX (Apache-2.0)", "voices": proj["voice"]}, "music": "procedural score (copycat/score.py), composed for this video", "sfx": "procedural (copycat/score.py)", "mix": {k: audio[k] for k in ("sections",) if k in audio} and f"{len(audio.get('sections', []))} music sections, {len(audio.get('sfx', []))} sfx events"},
            "fonts": "SIL OFL 1.1 (assets/fonts/copycat)", "reference": proj.get("reference"), "qaPassed": qa and qa["passed"]}
    (pk / "provenance.json").write_text(json.dumps(prov, indent=1, ensure_ascii=False))
    print(f"[package] wrote {pk}"); return pk


if __name__ == "__main__":
    build(sys.argv[1] if len(sys.argv) > 1 else "asta-reborn-p1")
