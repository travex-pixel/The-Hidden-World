"""Writes the YouTube description, tags and pinned comment for a rendered run of the Thomas Randolph film.
usage: python documentary/films/thomas-randolph/write_description.py <run_dir>
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
    # every claim gets up to two listed sources from different publishers (greedy cover keeps the list short)
    grp = lambda x: srcs[x]["independence_group"]
    chosen, cov = [], {k: set() for k in need}
    def gain(sid):
        return sum(1 for k, v in need.items() if sid in v and len({grp(x) for x in cov[k]}) < 2 and grp(sid) not in {grp(x) for x in cov[k]})
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
        "Las Vegas, May 2008: Thomas Randolph called 911 and said a masked intruder had shot his wife, Sharon. Prosecutors alleged he had hired the man, "
        "handyman Michael Miller, to kill her, then shot Miller to get rid of a witness. Two juries convicted him, and the first verdict was thrown out "
        "because jurors heard about a death in Utah that he had been acquitted of. This is the true story behind Netflix's The Widower, and where Thomas Randolph is now.",
        "",
        "LEGAL STATUS: Thomas Randolph was CONVICTED in August 2023 of conspiracy to commit murder and two counts of murder (Sharon Causse and Michael Miller), "
        "sentenced in April 2024 to 60 years to life, and the Nevada Supreme Court affirmed on 31 August 2026. A 2017 conviction and two death sentences in the same case "
        "were reversed in December 2020. In Utah he was ACQUITTED in 1989 of murder in the death of Becky Gault, and pleaded guilty to felony witness tampering. "
        "No charge was ever brought over the deaths of Francis Randolph or Leona Stapleton. He says he is innocent. "
        "Prosecution evidence is attributed to prosecutors or police; the defence's answers are included.",
        "",
        "ILLUSTRATIONS: every person shown is an illustrated representation, not a likeness; houses, rooms and documents are generic illustrations or our own summaries. "
        "No victim is depicted.",
        "",
        "CHAPTERS",
    ]
    lines += [f"{ts(c['t'])} {c['title']}" for c in chapters]
    lines += ["", "SOURCES (accessed 11 Oct 2026). Every claim in the film is backed by at least one source below; where sources disagree, the film says so."]
    for sid in chosen:
        lines.append(f"- {srcs[sid]['publisher'].split(' (')[0]}: {srcs[sid]['url']}")
    lines += ["", "Spotted an error? Comment with a source and we will review it.", "#TheWidower #ThomasRandolph #TrueCrime"]
    bib = ["# Bibliography: The Widower True Story: Where Is Thomas Randolph Now?", "",
           "All sources were read as search-result excerpts on 11 October 2026; no page could be opened in full. Claim-level passages are in `documentary/films/thomas-randolph/evidence/claims.json`.", ""]
    for s_ in sorted(srcs.values(), key=lambda x: (x["publisher"], x["id"])):
        bib.append(f"- **{s_['publisher']}**, {s_['title']}. {s_['url']}" + (" *(context only; not used as support)*" if s_.get("context_only") else "") + f" [{s_['id']}]")
    (run / "bibliography.md").write_text("\n".join(bib) + "\n")
    text = "\n".join(lines)
    tags = ["Thomas Randolph", "The Widower", "The Widower Netflix", "The Widower true story", "Where is Thomas Randolph now", "Thomas Randolph now",
            "The Widower Til Death Do Us Part", "Thomas Randolph trial", "Thomas Randolph black widower", "Sharon Causse", "Michael Miller", "Dateline The Widower",
            "Las Vegas true crime", "Nevada Supreme Court", "true crime documentary"]
    pinned = ("Thomas Randolph was convicted in 2023 and the Nevada Supreme Court upheld the conviction in August 2026; he says he is innocent. "
              "In Utah, a jury acquitted him in 1989. Which part of the record surprised you most: the reversal, the walkthrough video or the 911 call? "
              "Sources are in the description.")
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
