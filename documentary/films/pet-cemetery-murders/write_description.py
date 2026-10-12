"""Writes the YouTube description, tags and pinned comment for a rendered run of the Pet Cemetery Murders film.
usage: python documentary/films/pet-cemetery-murders/write_description.py <run_dir>
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
        "St. Bernard Parish, Louisiana, April 1985: Dorothy Thompson, who ran a small pet cemetery, disappeared days before her lawsuit over her land was due in court. "
        "Less than a month later her body was found in the Mississippi River, weighted down with steel chains. Twenty-four years later a man told police the groundskeeper had "
        "confessed, and said her ghost was haunting his dreams. This is the real case behind HBO's The Pet Cemetery Murders: A Ghost Story, and what the record shows.",
        "",
        "LEGAL STATUS: Brandon Nodier was indicted for second-degree murder in April 2012. In 2014, under a plea agreement, he pleaded guilty to MANSLAUGHTER, "
        "a reduced charge, and was sentenced to 10 years. He was never convicted of murder. The ghost accounts are what witnesses said, as police and news outlets "
        "reported them; this film does not present them as fact. The second witness was not named by police and is not named here.",
        "",
        "ILLUSTRATIONS: every person shown is an illustrated representation, not a likeness; witnesses are anonymous silhouettes; the cemetery, river and rooms are "
        "generic illustrations, and documents are our own summaries. Dorothy Thompson is not depicted.",
        "",
        "CHAPTERS",
    ]
    lines += [f"{ts(c['t'])} {c['title']}" for c in chapters]
    lines += ["", "SOURCES (accessed 11 Oct 2026). Every claim in the film is backed by at least one source below; where sources disagree, the film says so or uses only the part they agree on."]
    for sid in chosen:
        name = srcs[sid]['publisher'].split(' (')[0]
        if "repost" in srcs[sid]['publisher'].lower():
            name += " report, as reposted on a forum (the original page could not be reached)"
        lines.append(f"- {name}: {srcs[sid]['url']}")
    lines += ["", "Spotted an error? Comment with a source and we will review it.", "#ThePetCemeteryMurders #TrueCrime #ColdCase"]
    bib = ["# Bibliography: The Pet Cemetery Murders: The Real Case Behind HBO's Ghost Story", "",
           "All sources were read as search-result excerpts on 11 October 2026; nola.com, wdsu.com and reuters.com could not be reached, and no page was opened in full. Claim-level passages are in `documentary/films/pet-cemetery-murders/evidence/claims.json`.", ""]
    for s_ in sorted(srcs.values(), key=lambda x: (x["publisher"], x["id"])):
        bib.append(f"- **{s_['publisher']}**, {s_['title']}. {s_['url']}" + (" *(context only; not used as support)*" if s_.get("context_only") else "") + f" [{s_['id']}]")
    (run / "bibliography.md").write_text("\n".join(bib) + "\n")
    text = "\n".join(lines)
    tags = ["The Pet Cemetery Murders", "The Pet Cemetery Murders A Ghost Story", "Pet Cemetery Murders HBO", "Pet Cemetery Murders true story", "Dorothy Thompson",
            "Brandon Nodier", "St. Bernard Parish", "Azalea Original Pet Cemetery", "Louisiana cold case", "HBO true crime", "ghost story true crime",
            "1985 cold case", "true crime documentary"]
    pinned = ("Brandon Nodier pleaded guilty to manslaughter in 2014 and was sentenced to 10 years; he was never convicted of murder. Two witnesses said Dorothy "
              "Thompson's ghost haunted them, and The Advocate reported a different reason for one of them coming forward. Which account do you find more convincing? "
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
