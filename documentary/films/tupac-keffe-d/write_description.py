"""Writes the YouTube description, tags and pinned comment for a rendered run of the Tupac / Keffe D trial film.
usage: python documentary/films/tupac-keffe-d/write_description.py <run_dir>
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
        "Las Vegas, 7 September 1996: Tupac Shakur was shot at a red light and died six days later. For 27 years nobody was charged. On 31 August 2026 a jury "
        "convicted Duane \"Keffe D\" Davis of first-degree murder after less than three hours. Prosecutors never said he fired the gun: they said he planned the "
        "shooting and supplied the weapon, and the heart of their case was his own words, in a 2008 police interview, on TV and in a memoir. He now says he only told "
        "those stories because he was paid. This is how the case reached a verdict, and what the record still can't tell us.",
        "",
        "LEGAL STATUS (as of 12 October 2026): Duane Davis was CONVICTED on 31 August 2026 of first-degree murder with use of a deadly weapon. He is due to be "
        "sentenced on 13 October 2026 and faces up to life without parole. He says he is innocent and plans to appeal. Everything Davis said in interviews and his "
        "memoir is presented as his account. Orlando Anderson, whom Davis named in 2008 as the shooter, denied any involvement, was never charged and died in 1998. "
        "Suge Knight survived the shooting and has never been charged in it. No one else has been charged; the district attorney said after the verdict there is not "
        "enough evidence to charge anyone else.",
        "",
        "ILLUSTRATIONS: every person shown is an illustrated representation, not a likeness; Tupac Shakur, Orlando Anderson and Suge Knight appear only as "
        "featureless silhouette cards; streets, rooms and documents are generic illustrations or our own summaries. No security footage is shown.",
        "",
        "CHAPTERS",
    ]
    lines += [f"{ts(c['t'])} {c['title']}" for c in chapters]
    lines += ["", "SOURCES (search results read 11 Oct 2026). Every claim in the film is backed by at least one source below; where sources disagree, the film says so or uses only the part they agree on."]
    for sid in chosen:
        name = srcs[sid]['publisher'].split(' (')[0]
        if "repost" in srcs[sid]['publisher'].lower():
            name += " report, as reposted on a forum (the original page could not be reached)"
        lines.append(f"- {name}: {srcs[sid]['url']}")
    lines += ["", "Spotted an error? Comment with a source and we will review it.", "#Tupac #KeffeD #TrueCrime"]
    bib = ["# Bibliography: Tupac Murder Trial: Why Keffe D Was Convicted in Under 3 Hours", "",
           "All sources were read as search-result excerpts on 11 October 2026; no article, court record or statute was opened in full; many search summaries did not name their outlet. Claim-level passages are in `documentary/films/tupac-keffe-d/evidence/claims.json`.", ""]
    for s_ in sorted(srcs.values(), key=lambda x: (x["publisher"], x["id"])):
        bib.append(f"- **{s_['publisher']}**, {s_['title']}. {s_['url']}" + (" *(context only; not used as support)*" if s_.get("context_only") else "") + f" [{s_['id']}]")
    (run / "bibliography.md").write_text("\n".join(bib) + "\n")
    text = "\n".join(lines)
    tags = ["Tupac", "Tupac Shakur", "Keffe D", "Duane Davis", "Keffe D trial", "Keffe D verdict", "Keffe D sentencing", "Tupac murder trial", "Tupac murder case",
            "Tupac verdict", "Las Vegas", "1996 Las Vegas shooting", "Compton Street Legend", "true crime documentary"]
    pinned = ("Duane \"Keffe D\" Davis was convicted of first-degree murder on 31 August 2026 and is due to be sentenced on 13 October; he says he is innocent and plans "
              "to appeal. Prosecutors never said he fired the gun. Orlando Anderson, whom Davis named in 2008, denied involvement and was never charged. What do you think "
              "mattered most to the jury: the 2008 tape, the TV interview or the memoir? Sources are in the description.")
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
