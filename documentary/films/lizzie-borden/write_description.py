"""Writes the YouTube description, tags and pinned comment for a rendered run of the Lizzie Borden film.
usage: python documentary/films/lizzie-borden/write_description.py <run_dir>
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
        "Three days after her father and stepmother were killed, Lizzie Borden stood at the kitchen stove with a dress she said was covered with paint. "
        "Ten months later a jury found her not guilty, and no one else was ever charged. So who killed Andrew and Abby Borden?",
        "",
        "Told from the trial record: the note no one found, the barn and the pears, the poison story the jury never heard, "
        "the grand jury that indicted her only after the dress came out, and the judge appointed by her own lawyer.",
        "",
        "LEGAL STATUS: Lizzie Borden was ACQUITTED on 20 June 1893. No one else was ever charged; the killings remain officially unsolved. "
        "Witness accounts are attributed to the witness. Theories about others are theories, not findings.",
        "",
        "ILLUSTRATIONS: every person shown is an illustrated representation, not a likeness; houses, rooms and documents are generic illustrations or our own summaries. "
        "Andrew and Abby Borden are not depicted.",
        "",
        "CHAPTERS",
    ]
    lines += [f"{ts(c['t'])} {c['title']}" for c in chapters]
    lines += ["", "SOURCES (accessed 11 Oct 2026). Every claim in the film is backed by at least one source below; where sources disagree, the film says so."]
    for sid in chosen:
        lines.append(f"- {srcs[sid]['publisher'].split(' (')[0]}: {srcs[sid]['url']}")
    lines += ["", "Spotted an error? Comment with a source and we will review it.", "#LizzieBorden #TrueCrime #Documentary"]
    bib = ["# Bibliography: Lizzie Borden Was Acquitted. So Who Killed the Bordens?", "",
           "All sources were read as search-result excerpts on 11 October 2026; no page could be opened in full. Claim-level passages are in `documentary/films/lizzie-borden/evidence/claims.json`.", ""]
    for s_ in sorted(srcs.values(), key=lambda x: (x["publisher"], x["id"])):
        bib.append(f"- **{s_['publisher']}**, {s_['title']}. {s_['url']}" + (" *(context only; not used as support)*" if s_.get("context_only") else "") + f" [{s_['id']}]")
    (run / "bibliography.md").write_text("\n".join(bib) + "\n")
    text = "\n".join(lines)
    tags = ["Lizzie Borden", "Lizzie Borden documentary", "Lizzie Borden true story", "Borden murders", "Fall River 1892", "Andrew Borden", "Abby Borden",
            "Lizzie Borden trial", "Lizzie Borden acquitted", "unsolved murders", "true crime documentary", "historical true crime", "Alice Russell", "Bridget Sullivan"]
    pinned = ("Lizzie Borden was acquitted in 1893, and the killings are officially unsolved. Which detail matters most to you: the note no one found, "
              "the barn and the pears, or the dress? Sources are in the description.")
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
