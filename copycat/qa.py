"""COPYCAT 4-stage QualityAssuranceEngine. A render exit code of 0 is not success: this inspects the plan AND the real MP4.

  Stage 1  research & lore integrity   claims <-> dossier <-> sources, canon tagging, continuity ledger, filler phrases
  Stage 2  visual & continuity audit   shot implementations, repetition, provenance, acquisition-tier ratio
  Stage 3  audio & stream gate         ffprobe streams/duration (reuses pipeline.verify), EBU R128 loudness, true peak, silence
  Stage 4  post-render frame check     blackdetect, freezedetect, per-beat frames sampled from the MP4, caption presence, contact sheets
"""
from __future__ import annotations
import json, re, subprocess, time
from pathlib import Path
from PIL import Image, ImageStat

from pipeline.verify import verify as legacy_verify
from copycat import contracts

ROOT = Path(__file__).resolve().parent.parent


def _run(cmd): return subprocess.run(cmd, capture_output=True, text=True)


def stage1(project, dossier, out) -> dict:
    err, warn = [], []; claims = {c["claimId"]: c for c in dossier["claims"]}; srcs = {s["sourceId"]: s for s in dossier["sources"]}
    used = set()
    for b in project["beats"]:
        for cid in b.get("claims", []):
            used.add(cid)
            if cid not in claims: err.append(f"{b['id']}: claim {cid} not in dossier")
        if b.get("canon") in ("canon", "rule") and b.get("say") and not b.get("claims"): warn.append(f"{b['id']}: canon-tagged narration with no linked claim")
    for cid in sorted(used & set(claims)):
        c = claims[cid]
        for sid in c["supportingSourceIds"]:
            if sid not in srcs: err.append(f"{cid}: cites missing source {sid}")
            elif not re.match(r"^https?://[\w.-]+\.[a-z]{2,}", srcs[sid]["urlOrPath"]): err.append(f"{cid}: malformed source url {srcs[sid]['urlOrPath']}")
        if c.get("verification") != "source_backed": warn.append(f"{cid}: used in script but NOT source-verified in this run — {c['statement'][:90]}")
    probs = [p for p in contracts.validate_project(project) if "banned" in p]; err += probs
    # continuity ledger: nothing may be used before the divergent timeline unlocks it
    cont_p = out / "continuity.json"; checked = 0
    if cont_p.exists():
        cont = json.loads(cont_p.read_text()); unlock = {}
        for row in cont["ledger"]:
            for u in row.get("unlocks", []): unlock.setdefault(u, row["age"])
        for bid, reqs in cont.get("requirements", {}).items():
            age = cont.get("requirementAges", {}).get(bid, cont.get("beatAges", {}).get(bid[:2]))
            for r in reqs:
                checked += 1
                if r not in unlock: err.append(f"{bid}: requires '{r}' which the ledger never unlocks")
                elif age is None or unlock[r] > age: err.append(f"{bid}: uses '{r}' at age {age} but it unlocks at {unlock[r]}")
    tags = {}
    for b in project["beats"]: tags[b.get("canon", "none")] = tags.get(b.get("canon", "none"), 0) + 1
    n_backed = sum(1 for c in used & set(claims) if claims[c].get("verification") == "source_backed")
    return {"passed": not err, "errors": err, "warnings": warn, "claims_used": len(used), "claims_source_backed": n_backed, "claims_model_memory_only": len(used & set(claims)) - n_backed,
            "sources_cited": len({s for c in used & set(claims) for s in claims[c]["supportingSourceIds"]}), "source_access_layer": "search-result summaries only; pages were not fetched (network policy), urls not re-resolved",
            "canon_tag_counts": tags, "continuity_checks": checked}


def stage2(project, plan, out) -> dict:
    err, warn = [], []; rdir = ROOT / "copycat" / "renderer"; impl = set()
    for f in rdir.glob("*.js"): impl |= set(re.findall(r"CC\.def\(\s*['\"]([\w-]+)['\"]", f.read_text()))
    sig = lambda b: (b["shot"]["type"], str(b["shot"].get("stage", b["shot"].get("mode", b["shot"].get("who", b["shot"].get("n", ""))))))
    counts = {}; prev = None; b2b = []
    for b in plan["beats"]:
        if b["shot"]["type"] not in impl: err.append(f"{b['id']}: shot type '{b['shot']['type']}' has no renderer implementation")
        s = sig(b); counts[s] = counts.get(s, 0) + 1
        if prev and prev[1] == s and json.dumps(prev[2], sort_keys=True) == json.dumps(b["shot"], sort_keys=True): b2b.append(f"{prev[0]}->{b['id']} {s}")
        prev = (b["id"], s, b["shot"])
    over = {f"{k[0]}:{k[1]}": v for k, v in counts.items() if v > 3 and k[0] not in ("chapter_card",)}
    if b2b: warn.append("identical shot used back-to-back: " + "; ".join(b2b))
    if over: warn.append(f"shot signatures reused more than 3 times: {over}")
    scenes = json.loads((out / "scene-plan.json").read_text())
    for s in scenes:
        if not s["selectedAsset"].get("licenseStatus"): err.append(f"{s['sceneId']}: asset without licence")
    tiers = {}
    for s in scenes: tiers[s["selectedAsset"]["acquisitionTier"]] = tiers.get(s["selectedAsset"]["acquisitionTier"], 0) + 1
    n = len(scenes)
    media_dir = ROOT / "copycat" / "vault" / project.get("universe", "_") / "media"
    local_media = [p.name for p in media_dir.glob("*") if p.suffix.lower() in (".mp4", ".mkv", ".mov", ".png", ".jpg", ".jpeg", ".webp")] if media_dir.exists() else []
    return {"passed": not err, "errors": err, "warnings": warn, "distinct_shot_types": len({b["shot"]["type"] for b in plan["beats"]}), "distinct_shot_signatures": len(counts), "beats": n,
            "avg_shot_seconds": round(plan["meta"]["duration"] / n, 2), "acquisition_tiers": {str(k): v for k, v in sorted(tiers.items())}, "tier_1_to_6_ratio": round(sum(v for k, v in tiers.items() if k <= 6) / n, 3), "tier_7_8_ai_generated_ratio": round(sum(v for k, v in tiers.items() if k >= 7) / n, 3),
            "authorised_source_media_indexed": local_media, "authorised_source_media_note": f"No source footage/stills were on disk. Drop authorised files into {media_dir.relative_to(ROOT)}/ to have them indexed and preferred over procedural art." if not local_media else ""}


def stage3(plan, mp4: Path) -> dict:
    m = plan["meta"]; rep = legacy_verify(mp4, expected_duration=m["duration"], width=m["width"], height=m["height"], fps=m["fps"])
    r = _run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(mp4), "-vn", "-af", "ebur128=peak=true,silencedetect=n=-48dB:d=1.6", "-f", "null", "-"]).stderr
    tail = r[r.rfind("Summary:"):] if "Summary:" in r else ""
    g = lambda pat: (float(re.search(pat, tail).group(1)) if re.search(pat, tail) else None)
    lufs, lra, tp = g(r"I:\s+([-\d.]+) LUFS"), g(r"LRA:\s+([-\d.]+) LU"), g(r"Peak:\s+([-\d.]+) dBFS")
    sil = [(float(a), float(b)) for a, b in re.findall(r"silence_end: ([\d.]+) \| silence_duration: ([\d.]+)", r)]
    checks = dict(rep["checks"]); checks.pop("no_long_silence_gaps", None)
    checks["loudness_-16_to_-12_LUFS"] = lufs is not None and -16.5 <= lufs <= -12.0
    checks["true_peak_below_-0.5_dBFS"] = tp is not None and tp <= -0.5
    checks["no_dead_air_over_1.6s"] = len(sil) == 0
    return {"passed": all(checks.values()), "checks": checks, "integrated_lufs": lufs, "loudness_range_lu": lra, "true_peak_dbfs": tp, "silences": [{"end": a, "dur": b} for a, b in sil],
            "duration": rep["duration"], "size_mb": round(rep["size_bytes"] / 1e6, 1), "video_codec": rep["video_codec"], "audio_codec": rep["audio_codec"], "fps": rep["fps"], "resolution": f"{rep['width']}x{rep['height']}"}


def stage4(plan, mp4: Path, out: Path) -> dict:
    qdir = out / "qa"; fdir = qdir / "frames"; fdir.mkdir(parents=True, exist_ok=True)
    for f in fdir.glob("*.jpg"): f.unlink()
    fps = plan["meta"]["fps"]; err, warn = [], []
    r = _run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(mp4), "-an", "-vf", "blackdetect=d=0.7:pix_th=0.08,freezedetect=n=0.0008:d=1.5", "-f", "null", "-"]).stderr
    black = [(float(a), float(b)) for a, b in re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", r)]
    freeze = [(float(a), float(b)) for a, b in zip(re.findall(r"freeze_start: ([\d.]+)", r), re.findall(r"freeze_end: ([\d.]+)", r))]
    if black: err.append(f"black segments >0.7s: {black}")
    if freeze: err.append(f"frozen video >1.5s: {freeze}")
    # one frame per beat (midpoint) + caption probes, pulled from the real MP4 in a single decode pass
    caps = [c for c in plan["captions"] if c["end"] - c["start"] > 0.35]; step = max(1, len(caps) // 60); cap_s = caps[::step]
    want = [("beat", b["id"], round((b["start"] + b["end"]) / 2 * fps)) for b in plan["beats"]] + [("cap", str(i), round((c["start"] + min(c["end"], c["start"] + 0.5)) / 2 * fps + 2)) for i, c in enumerate(cap_s)]
    want.sort(key=lambda x: x[2]); uniq = sorted({w[2] for w in want})
    sel = "+".join(f"eq(n\\,{n})" for n in uniq)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mp4), "-an", "-vf", f"select='{sel}',scale=960:540", "-vsync", "0", "-q:v", "3", str(fdir / "f%05d.jpg")], check=True)
    files = sorted(fdir.glob("f*.jpg")); path_of = {n: files[i] for i, n in enumerate(uniq) if i < len(files)}
    if len(files) != len(uniq): err.append(f"expected {len(uniq)} sampled frames, decoded {len(files)}")
    blank, cap_ok, cap_n, per_beat = [], 0, 0, {}
    for kind, key, n in want:
        f = path_of.get(n)
        if not f: continue
        im = Image.open(f).convert("L")
        if kind == "beat":
            st = ImageStat.Stat(im); per_beat[key] = f
            if st.mean[0] < 5 or st.stddev[0] < 3.5: blank.append(f"{key} (mean {st.mean[0]:.1f}, sd {st.stddev[0]:.1f})")
        else:
            cap_n += 1; band = im.crop((180, 440, 780, 520)); h = band.histogram(); bright = sum(h[205:]) / (band.width * band.height); cap_ok += bright > 0.012
    if blank: err.append("near-blank frames at beat midpoints: " + ", ".join(blank))
    rate = cap_ok / max(1, cap_n)
    if rate < 0.93: err.append(f"captions detected in only {cap_ok}/{cap_n} probes")
    # contact sheets per chapter for vision review
    sheets = []
    for ch in plan["chapters"]:
        ids = [b["id"] for b in plan["beats"] if b["chapter"] == ch["id"] and b["id"] in per_beat]
        if not ids: continue
        cols = 5; rows = (len(ids) + cols - 1) // cols; sheet = Image.new("RGB", (cols * 384, rows * 216), "black")
        for i, bid in enumerate(ids): sheet.paste(Image.open(per_beat[bid]).resize((384, 216)), ((i % cols) * 384, (i // cols) * 216))
        p = qdir / f"contact_{ch['id']}.jpg"; sheet.save(p, quality=88); sheets.append(str(p.relative_to(out)))
    return {"passed": not err, "errors": err, "warnings": warn, "black_segments": black, "freeze_segments": freeze, "beat_frames_sampled": len(per_beat), "caption_probes": cap_n, "caption_detect_rate": round(rate, 3), "contact_sheets": sheets,
            "vision_review": "contact sheets are produced for model/human vision review against scene-plan.json; see qa/vision_review.md if a reviewer has signed off"}


def run(project, dossier, plan, out: Path, mp4: Path) -> dict:
    (out / "qa").mkdir(exist_ok=True); t0 = time.time()
    rep = {"project": project["id"], "file": str(mp4), "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%S"), "stage1_research_lore": stage1(project, dossier, out), "stage2_visual_plan": stage2(project, plan, out)}
    if mp4.exists():
        rep["stage3_audio_stream"] = stage3(plan, mp4); rep["stage4_rendered_frames"] = stage4(plan, mp4, out)
    else:
        rep["stage3_audio_stream"] = rep["stage4_rendered_frames"] = {"passed": False, "errors": ["rendered MP4 missing"]}
    stages = [k for k in rep if k.startswith("stage")]
    rep["passed"] = all(rep[k]["passed"] for k in stages)
    rep["summary"] = ", ".join(f"{k.split('_')[0]}={'ok' if rep[k]['passed'] else 'FAIL'}" for k in stages) + f" ({time.time()-t0:.0f}s)"
    (out / "qa" / "scorecard.json").write_text(json.dumps(rep, indent=1))
    return rep
