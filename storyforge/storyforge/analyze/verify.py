"""Grounding checks for a Spec against its Source.

Blocking (must be fixed before publishing):
  schema and reference errors; quote blocks and quoted words in prose (4+ words) that are not in the source;
  hero/stat/growth numbers with no support.
Warnings (reported, not blocking):
  other numbers that can't be traced (often arithmetic the analyst did).
Automatic fixes:
  near-verbatim quotes are replaced with the exact source words; section times snap to chapter starts.
"""
from __future__ import annotations

import difflib
import re
from dataclasses import dataclass, field

from ..schema import Source, validate_spec
from . import numbers

_QUOTES = str.maketrans({"“": '"', "”": '"', "‘": "'", "’": "'", "—": "-", "–": "-", "…": "..."})


def norm(s: str) -> str:
    s = s.translate(_QUOTES).lower()
    s = re.sub(r"[^\w\s']", " ", s)
    return re.sub(r"\s+", " ", s).strip()


@dataclass
class Report:
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    fixes: list[str] = field(default_factory=list)
    quotes: list[dict] = field(default_factory=list)
    numbers_checked: int = 0
    numbers_supported: int = 0

    @property
    def ok(self) -> bool:
        return not self.errors

    def to_dict(self) -> dict:
        return {"ok": self.ok, "errors": self.errors, "warnings": self.warnings, "fixes": self.fixes,
                "quotes": self.quotes, "numbers": {"checked": self.numbers_checked, "supported": self.numbers_supported}}

    def markdown(self) -> str:
        lines = [f"# Verification: {'PASS' if self.ok else 'FAIL'}", ""]
        q_ok = sum(1 for q in self.quotes if q["status"] != "missing")
        lines.append(f"- Quotes verified against the source: {q_ok}/{len(self.quotes)}")
        if self.numbers_checked:
            lines.append(f"- Numbers traced to the source: {self.numbers_supported}/{self.numbers_checked}")
        for title, items in (("Errors", self.errors), ("Warnings", self.warnings), ("Automatic fixes", self.fixes)):
            if items:
                lines += ["", f"## {title}", *[f"- {x}" for x in items]]
        return "\n".join(lines) + "\n"


class Index:
    """Normalized transcript with a char-offset -> segment map for locating quotes."""

    def __init__(self, source: Source):
        self.source = source
        parts, self.starts, pos = [], [], 0
        for seg in source.segments:
            t = norm(seg.text)
            self.starts.append((pos, seg))
            parts.append(t)
            pos += len(t) + 1
        self.text = " ".join(parts)
        self.raw = {seg.id: seg for seg in source.segments}
        self.order = {seg.id: i for i, seg in enumerate(source.segments)}

    def seg_at(self, offset: int):
        lo = None
        for start, seg in self.starts:
            if start > offset:
                break
            lo = seg
        return lo

    def find(self, quote: str, hint: str | None = None) -> tuple[str, float, object, str | None]:
        """(status, ratio, segment, exact_source_text). status: exact | fuzzy | missing."""
        q = norm(quote)
        if not q:
            return "missing", 0.0, None, None
        i = self.text.find(q)
        if i >= 0:
            return "exact", 1.0, self.seg_at(i), None
        # fuzzy: compare against windows around the hinted segment, else around rare-word anchors
        words = q.split()
        candidates: list[int] = []
        if hint and hint in self.order:
            k = self.order[hint]
            for start, seg in self.starts[max(0, k - 2):k + 3]:
                candidates.append(start)
        anchors = sorted(set(words), key=lambda w: self.text.count(" " + w + " ") or 1e9)[:3]
        for a in anchors:
            for m in re.finditer(r"\b" + re.escape(a) + r"\b", self.text):
                candidates.append(max(0, m.start() - len(q)))
                if len(candidates) > 60:
                    break
        best = (0.0, -1, -1)
        for c in candidates:
            window = self.text[c:c + len(q) * 2 + 40]
            sm = difflib.SequenceMatcher(None, q, window, autojunk=False)
            blocks = sm.get_matching_blocks()
            if not blocks:
                continue
            s0 = blocks[0].b
            e0 = max(b.b + b.size for b in blocks if b.size) if any(b.size for b in blocks) else s0
            span = window[s0:e0]
            r = difflib.SequenceMatcher(None, q, span, autojunk=False).ratio()
            if r > best[0]:
                best = (r, c + s0, c + e0)
        ratio, s, e = best
        if ratio >= 0.9:
            seg = self.seg_at(s)
            return "fuzzy", ratio, seg, self._raw_span(seg, self.text[s:e])
        return "missing", ratio, self.seg_at(s) if s >= 0 else None, None

    def _raw_span(self, seg, normalized_span: str) -> str | None:
        """Recover the original-cased words for a normalized span inside one or two segments."""
        if seg is None:
            return None
        k = self.order[seg.id]
        raw = " ".join(x.text for x in self.source.segments[k:k + 2])
        target = normalized_span.split()
        toks = list(re.finditer(r"\S+", raw))
        nt = [norm(t.group(0)) for t in toks]
        for i in range(len(toks)):
            j, m = i, 0
            while j < len(toks) and m < len(target):
                if not nt[j]:
                    j += 1
                    continue
                if nt[j].split()[0] != target[m]:
                    break
                m += len(nt[j].split())
                j += 1
            if m >= len(target):
                return raw[toks[i].start():toks[j - 1].end()].strip(" ,;:")
        return None


def _all_text(spec: dict):
    """(where, text) for every piece of prose in the spec."""
    yield "dek", spec["meta"]["dek"]
    for s in spec["sections"]:
        for k, b in enumerate(s["blocks"]):
            where = f"{s['number']}.{k + 1} {b['type']}"
            for key in ("text", "body", "title", "subtitle", "caption", "note"):
                v = b.get(key)
                if isinstance(v, str):
                    yield where, v


def verify(spec: dict, source: Source, *, fix: bool = True, strict_numbers: bool = True) -> Report:
    rep = Report()
    rep.errors += validate_spec(spec)
    if any(e.startswith("schema") for e in rep.errors):
        return rep
    idx = Index(source)

    # ---- quote blocks: must be verbatim
    for s in spec["sections"]:
        for k, b in enumerate(s["blocks"]):
            if b["type"] != "quote":
                continue
            status, ratio, seg, exact = idx.find(b["text"], b.get("segment_id"))
            rec = {"where": f"{s['number']}.{k + 1}", "text": b["text"][:120], "status": status, "ratio": round(ratio, 3),
                   "segment_id": seg.id if seg else None}
            rep.quotes.append(rec)
            if status == "missing":
                rep.errors.append(f"quote {rec['where']} not found in the source (best match {ratio:.0%}): “{b['text'][:90]}”")
            else:
                if fix and status == "fuzzy" and exact:
                    rep.fixes.append(f"quote {rec['where']}: replaced with the exact source words")
                    b["text"] = exact
                if fix and seg and b.get("segment_id") != seg.id:
                    b["segment_id"] = seg.id

    # ---- quotations inside prose (4+ words) must be verbatim too
    for where, text in _all_text(spec):
        for m in re.finditer(r"[“\"]([^”\"]{12,300})[”\"]", text):
            q = m.group(1)
            if len(q.split()) < 4:
                continue
            status, ratio, seg, exact = idx.find(q)
            rep.quotes.append({"where": where, "text": q[:120], "status": status, "ratio": round(ratio, 3),
                               "segment_id": seg.id if seg else None, "inline": True})
            if status == "missing":
                rep.errors.append(f"{where}: quoted words not found in the source (best {ratio:.0%}): “{q[:90]}”")

    # ---- numbers
    pool = set(numbers.values(source.text + " " + source.title + " " + (source.description or "")))
    if source.duration_s:  # the running time may be quoted in seconds, minutes or hours
        d = float(source.duration_s)
        pool |= {d, round(d / 60), d / 60, round(d / 3600, 1), d / 3600}

    def check(where: str, text: str, blocking: bool):
        for v in numbers.values(text):
            if not numbers.interesting(v):
                continue
            rep.numbers_checked += 1
            if numbers.supported(v, pool):
                rep.numbers_supported += 1
            else:
                msg = f"{where}: {v:g} is not stated in the source ({text[:70]!r})"
                (rep.errors if blocking and strict_numbers else rep.warnings).append(msg)

    for st in spec["hero"]["stats"]:
        check("hero stat", st["value"], True)
    for s in spec["sections"]:
        for k, b in enumerate(s["blocks"]):
            where = f"{s['number']}.{k + 1} {b['type']}"
            if b["type"] == "stats":
                for it in b["items"]:
                    check(where, it["value"], True)
            elif b["type"] in ("p", "takeaway"):
                check(where, b.get("text") or b.get("body", ""), False)
            elif b["type"] == "bars":
                for pt in b["points"]:
                    check(where, str(pt["y"]), False)
            elif b["type"] == "lines":
                for ser in b["series"]:
                    for pt in ser["points"]:
                        check(where, str(pt["y"]), False)
            elif b["type"] == "growth":
                check(where, f"{b['start_value']} {b['end_value']} {b['compare_end_value'] or ''}", True)

    # ---- timing
    dur = source.duration_s
    chapters = source.chapters
    for s in spec["sections"]:
        t = s.get("time_s")
        if t is None:
            continue
        if dur and not (0 <= t <= dur + 1):
            rep.errors.append(f"section {s['number']}: time {t}s is outside the source (0-{dur:.0f}s)")
        if chapters and fix:
            near = min(chapters, key=lambda c: abs(c.start_s - t))
            if 0 < abs(near.start_s - t) <= 20:
                rep.fixes.append(f"section {s['number']}: time {t:g}s snapped to chapter '{near.title}' at {near.start_s:g}s")
                s["time_s"] = near.start_s
    if chapters and len(spec["sections"]) < len(chapters) * 0.6:
        rep.warnings.append(f"{len(chapters)} source chapters but only {len(spec['sections'])} sections")
    if source.url and spec["closing"].get("cta_url") in (None, ""):
        rep.warnings.append("closing has no link back to the source")
    return rep
