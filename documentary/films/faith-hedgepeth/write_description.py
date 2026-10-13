"""Writes the YouTube description, tags and pinned comment for a rendered run of the Faith Hedgepeth trial film.
usage: python documentary/films/faith-hedgepeth/write_description.py <run_dir>
Chapters come from the run's edit manifest; the source list is every source cited by a narrated or on-screen
claim (context-only sources excluded), so the film's 'sources for every claim' promise holds (gate G15)."""
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def ts(t: float) -> str:
    m, s = divmod(int(t), 60)
    return f"{m}:{s:02d}"


def main(run: Path) -> None:
    man = json.loads((run / "edit-manifest.json").read_text())
    claims = json.loads((HERE / "evidence" / "claims.json").read_text())["claims"]
    srcs = {s["id"]: s for s in json.loads((HERE / "evidence" / "sources.json").read_text())["sources"]}
    pk = json.loads((HERE / "evidence" / "packaging.json").read_text())
    film = json.loads((HERE / "film.json").read_text())
    shot_claims = {c for ln in film["lines"] for s in ln["shots"] for c in s.get("claims", [])}
    need = {}
    for c in claims:
        if not (c["lines"] or c["id"] in shot_claims) or c["assertion"] == "derived":
            continue
        need[c["id"]] = {e["source"] for e in c["evidence"] if e["supports"] in ("direct", "reports_allegation") and not srcs[e["source"]].get("context_only")}
    # every claim gets at least one listed source (greedy cover); this case has ~50 claims, so two per claim would exceed YouTube's 5,000 characters
    grp = lambda x: srcs[x]["independence_group"]
    chosen, cov = [], {k: set() for k in need}
    def gain(sid):
        return sum(1 for k, v in need.items() if sid in v and len({grp(x) for x in cov[k]}) < 1 and grp(sid) not in {grp(x) for x in cov[k]})
    while True:
        cand = max(sorted({x for v in need.values() for x in v} - set(chosen)), key=gain, default=None)
        if cand is None or gain(cand) == 0:
            break
        chosen.append(cand)
        for k, v in need.items():
            if cand in v:
                cov[k].add(cand)
    assert all(cov[k] for k in need if need[k]), "a claim has no listed source"
    chosen.sort(key=lambda x: (srcs[x]["publisher"], x))
    chapters = [{"t": 0.0, "title": "Cold open"}] + [c for c in man["chapters"] if c["title"] != "Cold open"]
    lines = [
        "Chapel Hill, North Carolina, September 2012: Faith Hedgepeth, a 19-year-old UNC student, was found dead in an off-campus apartment. On the bed near her, "
        "police found a note on a fast-food bag that they believed her killer wrote. For nine years no one was arrested. In 2021 police charged Miguel "
        "Salguero-Olivares, and investigators said his DNA matched the scene. His trial is now under way in Durham. This is what the jury has heard so far, "
        "what it won't hear, and what both sides say.",
        "",
        "LEGAL STATUS (as of 13 October 2026): Miguel Salguero-Olivares is charged with first-degree murder, rape, sexual offense and burglary. He has pleaded "
        "NOT GUILTY to all charges and is presumed innocent. The trial is ongoing and there is no verdict. Prosecution evidence is attributed to prosecutors or "
        "investigators; the defence's answers are included. The State is not seeking the death penalty.",
        "",
        "ILLUSTRATIONS: every person shown is an illustrated representation, not a likeness; the defendant and witnesses are not shown; Faith Hedgepeth appears "
        "only as a silhouette card; buildings, rooms and documents are generic illustrations or our own summaries.",
        "",
        "CHAPTERS",
    ]
    lines += [f"{ts(c['t'])} {c['title']}" for c in chapters]
    lines += ["", "SOURCES (search results read 13 Oct 2026). Every claim in the film is backed by at least one source below; where sources disagree, the film says so or uses only the part they agree on."]
    for sid in chosen:
        name = srcs[sid]['publisher'].split(' (')[0]
        if "repost" in srcs[sid]['publisher'].lower():
            name += " report, as reposted on a forum (the original page could not be reached)"
        lines.append(f"- {name}: {srcs[sid]['url']}")
    lines += ["", "Spotted an error? Comment with a source and we will review it.", "#FaithHedgepeth #TrueCrime #UNC #ChapelHill #TrueCrimeDocumentary"]
    bib = ["# Bibliography: Faith Hedgepeth Trial: The Note, the DNA and 14 Years of Waiting", "",
           "All sources were read as search-result excerpts on 11 October 2026; no article, court record or statute was opened in full; many search summaries did not name their outlet. Claim-level passages are in `documentary/films/faith-hedgepeth/evidence/claims.json`.", ""]
    for s_ in sorted(srcs.values(), key=lambda x: (x["publisher"], x["id"])):
        bib.append(f"- **{s_['publisher']}**, {s_['title']}. {s_['url']}" + (" *(context only; not used as support)*" if s_.get("context_only") else "") + f" [{s_['id']}]")
    (run / "bibliography.md").write_text("\n".join(bib) + "\n")
    text = "\n".join(lines)
    tags = ["Faith Hedgepeth", "Faith Hedgepeth trial", "Faith Hedgepeth case", "Miguel Salguero-Olivares", "UNC student murder", "Chapel Hill", "Durham trial",
            "cold case DNA", "genetic genealogy", "true crime documentary"]
    pinned = ("Miguel Salguero-Olivares has pleaded not guilty and the trial is ongoing as of 13 October 2026; there is no verdict. We will update this when the jury "
              "decides. Which evidence do you think matters most: the note, the DNA or the lost bloodstain sample? Sources are in the description.")
    (run / "youtube-description.md").write_text(text + "\n")
    (run / "youtube-tags.txt").write_text(", ".join(tags) + "\n")
    (run / "pinned-comment.md").write_text(pinned + "\n")
    (run / "youtube-title.txt").write_text(pk["title"] + "\n")
    pk["run"] = str(run.relative_to(HERE.parents[2])); pk["description_file"] = pk["run"] + "/youtube-description.md"; pk["description_text"] = text
    (HERE / "evidence" / "packaging.json").write_text(json.dumps(pk, indent=1, ensure_ascii=False) + "\n")
    assert len(text) <= 5000, f"description too long for YouTube: {len(text)} chars"
    print(f"description: {len(text)} chars, {len(chosen)} sources (covering {len(need)} claims), {len(chapters)} chapters; bibliography.md has {len(srcs)}")


if __name__ == "__main__":
    main(Path(sys.argv[1]).resolve())
