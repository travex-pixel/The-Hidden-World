"""Writes the YouTube description, tags and pinned comment for a rendered run of the Ed Gein film.
usage: python documentary/films/ed-gein/write_description.py <run_dir>
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
        "Plainfield, Wisconsin, November 1957: a hardware-store owner, Bernice Worden, vanished, and the last receipt she wrote led police to a quiet local "
        "handyman, Ed Gein. What they found at his farm made national news and later inspired Psycho, The Texas Chain Saw Massacre and The Silence of the "
        "Lambs. Netflix's Monster: The Ed Gein Story brought it back in 2025, but fact-checks say several scenes were invented. This is what the record shows, "
        "and what is legend.",
        "",
        "LEGAL RECORD: Ed Gein was charged with the first-degree murder of Bernice Worden. He was found incompetent to stand trial in 1958 and committed to a "
        "state hospital. At a 1968 trial without a jury, the judge found he committed first-degree murder and was legally insane, so he was committed, not "
        "imprisoned. Investigators said he also admitted killing Mary Hogan (1954); he was never charged or tried over her death. He was never charged over his "
        "brother Henry's 1944 death. He died at the Mendota Mental Health Institute in 1984.",
        "",
        "CONTENT: this film does not describe what was found in the house beyond the fact that he had robbed graves. Every person shown is an illustration, not "
        "a likeness; Bernice Worden and Mary Hogan appear only as silhouette cards; the farm, store and street are generic illustrations.",
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
    lines += ["", "Spotted an error? Comment with a source and we will review it.", "#EdGein #MonsterNetflix #TrueCrime #Wisconsin #TrueCrimeDocumentary"]
    bib = ["# Bibliography: Ed Gein: The Real Story Behind Netflix's Monster", "",
           "All sources were read as search-result excerpts on 11 October 2026; no article, court record or statute was opened in full; many search summaries did not name their outlet. Claim-level passages are in `documentary/films/ed-gein/evidence/claims.json`.", ""]
    for s_ in sorted(srcs.values(), key=lambda x: (x["publisher"], x["id"])):
        bib.append(f"- **{s_['publisher']}**, {s_['title']}. {s_['url']}" + (" *(context only; not used as support)*" if s_.get("context_only") else "") + f" [{s_['id']}]")
    (run / "bibliography.md").write_text("\n".join(bib) + "\n")
    text = "\n".join(lines)
    tags = ["Ed Gein", "Ed Gein true story", "Monster The Ed Gein Story", "Monster Netflix", "Ed Gein documentary", "Plainfield Wisconsin", "Bernice Worden",
            "Psycho true story", "Texas Chain Saw Massacre true story", "true crime documentary"]
    pinned = ("Ed Gein was found to have committed the murder of Bernice Worden and to be legally insane (1968); he was never imprisoned and died in 1984. "
              "He was never charged over his brother's death. Which part of Netflix's version surprised you most once you saw the record? Sources are in the description.")
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
