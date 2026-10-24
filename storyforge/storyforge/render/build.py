"""Spec + media manifest -> a static site (index.html, app.js, img/)."""
from __future__ import annotations

import html
import json
import os
import re
import shutil
from jinja2 import Environment, FileSystemLoader, select_autoescape
from markupsafe import Markup

from .themes import build_theme, css_tokens

HERE = os.path.dirname(__file__)

# Blocks that break out of the reading column.
WIDE = {"figures", "bars", "lines", "slope", "growth", "calculator", "cycle", "layers",
        "sorter", "scorecard", "equation", "gallery", "people"}

_LINK = re.compile(r"\[([^\]]+)\]\((https?://[^\s)]+)\)")
_BOLD = re.compile(r"\*\*(.+?)\*\*")
_EM = re.compile(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])")


def md(text: str | None) -> Markup:
    """Tiny inline markup: escape, then **bold**, *italic*, [text](https://url)."""
    if not text:
        return Markup("")
    s = html.escape(text, quote=False)
    s = _LINK.sub(lambda m: f'<a href="{html.escape(m.group(2))}" target="_blank" rel="noopener">{m.group(1)}</a>', s)
    s = _BOLD.sub(r"<strong>\1</strong>", s)
    s = _EM.sub(r"<em>\1</em>", s)
    return Markup(s)


def hms(t: float | None) -> str:
    if t is None:
        return ""
    t = int(round(t))
    return f"{t // 3600:02d}:{t % 3600 // 60:02d}:{t % 60:02d}"


def duration_label(t: float) -> str:
    t = int(round(t))
    h, m, s = t // 3600, t % 3600 // 60, t % 60
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def initials(name: str) -> str:
    parts = [p for p in re.split(r"\s+", name or "") if p and p[0].isalpha()]
    return (parts[0][0] + (parts[-1][0] if len(parts) > 1 else "")).upper() if parts else "?"


def tone_var(tone: str) -> str:
    return {"accent": "accent", "accent2": "accent2", "ink": "ink2", "muted": "muted",
            "good": "good", "bad": "bad"}.get(tone, "accent")


def on_tone(tone: str) -> str:
    return "on-accent" if tone == "accent" else "paper"


def _title_html(title: str) -> Markup:
    """The h1: *word* in the title marks the one italic accent word."""
    return md(title)


def plain_title(title: str) -> str:
    return title.replace("*", "")


def _runs(blocks: list[dict]) -> list[dict]:
    runs: list[dict] = []
    for b in blocks:
        wide = b["type"] in WIDE or (b["type"] == "figure" and b.get("layout") == "wide")
        if runs and runs[-1]["wide"] == wide:
            runs[-1]["blocks"].append(b)
        else:
            runs.append({"wide": wide, "blocks": [b]})
    return runs


def build_context(spec: dict, media: dict, *, standalone: bool = False, runtime_src: str = "app.js") -> dict:
    theme = build_theme(spec["theme"])
    noun = theme["section_noun"]
    timed = all(s.get("time_s") is not None for s in spec["sections"]) and bool(spec["meta"]["source"].get("duration_s"))
    images = {k: v for k, v in media.items() if v.get("ok")}

    sections, data_blocks, tk = [], {}, 0
    for si, s in enumerate(spec["sections"]):
        stamp = " · ".join(x for x in (hms(s.get("time_s")) if timed else "", s.get("date_label") or "") if x)
        sec = dict(s, noun=noun, stamp=stamp, anchor=f"s-{re.sub(r'[^a-z0-9_-]', '', s['id'].lower()) or si + 1}")
        blocks = []
        first_p = True
        for bi, b in enumerate(s["blocks"]):
            b = dict(b, dom_id=f"b{si + 1}-{bi + 1}")
            if b["type"] == "p":
                b["lede"] = first_p and si == 0
                first_p = False
            if b["type"] == "takeaway":
                tk += 1
                b["label"] = f"{theme['collection_noun'].rstrip('s').capitalize()} {tk:02d}"
            if b["type"] == "quote":
                b["stamp"] = ""
            if b["type"] in ("figure",) and b["image"] not in images:
                continue  # missing art is dropped, never shown broken
            blocks.append(b)
            if b["type"] in ("bars", "lines", "slope", "growth", "scenarios", "calculator", "cycle", "layers", "sorter", "equation"):
                data_blocks[b["dom_id"]] = b
        sec["runs"] = _runs(blocks)
        sections.append(sec)

    credits = []
    for k, v in media.items():
        if v.get("ok") and not v.get("fallback") and v.get("license"):
            credits.append({"where": v.get("where", k), "desc": v.get("desc") or v.get("alt", ""), "author": v.get("author", ""),
                            "license": v["license"], "url": v.get("page_url")})

    duration = spec["meta"]["source"].get("duration_s") or 0
    data = {
        "timed": timed, "duration": duration, "durationLabel": duration_label(duration) if duration else "",
        "noun": noun, "collectionNoun": theme["collection_noun"], "collector": theme["collector"],
        "collectorSpec": spec["collector"],
        "sections": [{"label": s["label"], "t": s.get("time_s"), "anchor": sec["anchor"]} for s, sec in zip(spec["sections"], sections)],
        "blocks": data_blocks,
    }
    data_json = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")

    with open(os.path.join(HERE, "static", "base.css"), encoding="utf-8") as f:
        css = f.read()
    return dict(
        standalone=standalone, lang=spec.get("lang", "en"), meta=dict(spec["meta"], title=plain_title(spec["meta"]["title"])), theme=theme,
        tokens=Markup(css_tokens(theme)), css=Markup(css), title_html=_title_html(spec["meta"]["title"]),
        hero=spec["hero"], intro=spec.get("intro"), sections=sections, closing=spec["closing"],
        about=spec["about"], sources=spec["sources"], credits=credits, images=images,
        takeaway_count=tk, timed=timed, duration_label=duration_label(duration) if duration else "",
        data_json=Markup(data_json), runtime_src=runtime_src,
        footnote=spec.get("footnote") or "Figures are rounded. Quotations are verified against the source transcript; narration around them is an editorial summary.",
    )


def stage_images(media: dict, media_base: str, out_dir: str) -> dict:
    """Copy every usable image into out_dir/img and point the manifest at the copies."""
    staged = {}
    img_dir = os.path.join(out_dir, "img")
    for key, m in media.items():
        m = dict(m)
        src = m.get("path")
        if m.get("ok") and src:
            src = src if os.path.isabs(src) else os.path.join(media_base, src)
            if os.path.exists(src):
                os.makedirs(img_dir, exist_ok=True)
                name = f"{key}{os.path.splitext(src)[1].lower()}"
                dst = os.path.join(img_dir, name)
                if os.path.abspath(src) != os.path.abspath(dst):
                    shutil.copyfile(src, dst)
                m["file"] = f"img/{name}"
                if not m.get("width"):
                    import cv2
                    h, w = cv2.imread(dst).shape[:2]
                    m.update(width=w, height=h)
            else:
                m["ok"] = False
                m["error"] = f"file not found: {src}"
        staged[key] = m
    return staged


def render(spec: dict, media: dict, out_dir: str, *, media_base: str = ".", standalone: bool = False) -> str:
    """Write index.html, app.js and img/ into out_dir. Returns the page path."""
    os.makedirs(out_dir, exist_ok=True)
    media = stage_images(media, media_base, out_dir)
    env = Environment(loader=FileSystemLoader(os.path.join(HERE, "templates")),
                      autoescape=select_autoescape(["html", "j2"]), trim_blocks=False, lstrip_blocks=False)
    env.filters["md"] = md
    env.globals.update(initials=initials, tone_var=tone_var, on_tone=on_tone)
    ctx = build_context(spec, media, standalone=standalone)
    page = env.get_template("page.html.j2").render(**ctx)
    page = re.sub(r"\n\s*\n+", "\n", page)
    path = os.path.join(out_dir, "index.html")
    with open(path, "w", encoding="utf-8") as f:
        f.write(page)
    shutil.copyfile(os.path.join(HERE, "static", "runtime.js"), os.path.join(out_dir, "app.js"))
    return path
