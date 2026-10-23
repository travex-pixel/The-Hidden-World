"""Theme presets and the contrast guard.

A preset fixes typography and neutrals; the spec may override the accent with
a color from the subject's world. Every accent is corrected so that
  * accent text on paper meets WCAG AA (4.5:1),
  * text on an accent fill (signs, tag headers) picks white or ink, whichever reads,
in both the light and the dark palette.
"""
from __future__ import annotations

import colorsys
from dataclasses import dataclass, field


# ----------------------------------------------------------------- color math

def _rgb(h: str) -> tuple[float, float, float]:
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))  # type: ignore[return-value]


def _hex(rgb) -> str:
    return "#" + "".join(f"{max(0, min(255, round(c * 255))):02x}" for c in rgb)


def luminance(h: str) -> float:
    def ch(c):
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(c) for c in _rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a: str, b: str) -> float:
    la, lb = sorted((luminance(a), luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def _shift_lightness(h: str, target_lighter: bool, step: float = 0.02) -> str:
    r, g, b = _rgb(h)
    hh, l, s = colorsys.rgb_to_hls(r, g, b)
    l = min(1.0, l + step) if target_lighter else max(0.0, l - step)
    return _hex(colorsys.hls_to_rgb(hh, l, s))


def ensure_contrast(fg: str, bg: str, ratio: float) -> str:
    """Move fg's lightness away from bg until the contrast ratio is met."""
    lighter = luminance(bg) < 0.5
    out = fg
    for _ in range(60):
        if contrast(out, bg) >= ratio:
            return out
        out = _shift_lightness(out, lighter)
    return out


def mix(a: str, b: str, t: float) -> str:
    ra, rb = _rgb(a), _rgb(b)
    return _hex(tuple(x * (1 - t) + y * t for x, y in zip(ra, rb)))


def on_color(fill: str, light: str = "#ffffff", dark: str = "#17150f") -> str:
    return light if contrast(light, fill) >= contrast(dark, fill) else dark


# ----------------------------------------------------------------- presets

@dataclass
class Fonts:
    display: str
    display_italic: str
    text: str
    label: str
    mono: str
    css_url: str
    label_upper: bool = True


@dataclass
class Preset:
    name: str
    fonts: Fonts
    light: dict
    dark: dict
    dark_first: bool = False
    defaults: dict = field(default_factory=dict)


GF = "https://fonts.googleapis.com/css2?"

PRESETS: dict[str, Preset] = {
    "signage": Preset(
        "signage",
        Fonts(display='"Libre Caslon Display", "Libre Caslon Text", Georgia, serif',
              display_italic='"Libre Caslon Text", Georgia, serif',
              text='"Newsreader", Georgia, "Times New Roman", serif',
              label='"Big Shoulders Display", "Oswald", "Arial Narrow", Impact, sans-serif',
              mono='"IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace',
              css_url=GF + "family=Big+Shoulders+Display:wght@600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600"
                      "&family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital@1"
                      "&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&display=swap"),
        light=dict(paper="#fbfaf7", paper2="#f2eee7", plate="#f6f2e9", ink="#1d1b18", ink2="#47423b",
                   muted="#756e65", rule="#ddd6cb", accent="#ee6a1f", accent2="#2b5b8a", good="#3f7a4a", bad="#a8402e"),
        dark=dict(paper="#131416", paper2="#1c1d20", plate="#ebe5da", ink="#ece7de", ink2="#c8c1b6",
                  muted="#9a938a", rule="#34332f", accent="#ff7a33", accent2="#8ab2dc", good="#7cbf86", bad="#f08a76"),
        defaults=dict(chapter_style="sign", collector="receipt"),
    ),
    "editorial": Preset(
        "editorial",
        Fonts(display='"Bodoni Moda", "Didot", Georgia, serif',
              display_italic='"Bodoni Moda", "Didot", Georgia, serif',
              text='"Source Serif 4", Georgia, "Times New Roman", serif',
              label='"Archivo Narrow", "Arial Narrow", "Helvetica Neue", sans-serif',
              mono='"IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace',
              css_url=GF + "family=Archivo+Narrow:wght@500;600;700&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;1,6..96,400"
                      "&family=IBM+Plex+Mono:wght@400;500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap"),
        light=dict(paper="#fcfcfa", paper2="#f1f0ec", plate="#f6f3ec", ink="#161616", ink2="#3d3d3a",
                   muted="#6f6e69", rule="#dcdad3", accent="#b3261e", accent2="#1f4e5f", good="#2f6b45", bad="#a23a2a"),
        dark=dict(paper="#121314", paper2="#1b1c1e", plate="#ebe6dc", ink="#efede8", ink2="#cbc8c0",
                  muted="#98958e", rule="#323230", accent="#ef6f63", accent2="#7fb6c8", good="#7cbf8e", bad="#f08a76"),
        defaults=dict(chapter_style="plate", collector="notebook"),
    ),
    "lab": Preset(
        "lab",
        Fonts(display='"Bricolage Grotesque", "Helvetica Neue", Arial, sans-serif',
              display_italic='"Literata", Georgia, serif',
              text='"Literata", Georgia, "Times New Roman", serif',
              label='"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace',
              mono='"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace',
              css_url=GF + "family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800"
                      "&family=JetBrains+Mono:wght@400;500;700&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&display=swap",
              label_upper=False),
        light=dict(paper="#f8f9fb", paper2="#eef1f5", plate="#f4f4f1", ink="#131722", ink2="#3a4152",
                   muted="#687084", rule="#d8dde6", accent="#2f5bea", accent2="#d9480f", good="#2f7d4f", bad="#b4372b"),
        dark=dict(paper="#0f1218", paper2="#171b23", plate="#e9e8e2", ink="#e8ebf2", ink2="#c3c9d6",
                  muted="#8d95a7", rule="#2a303c", accent="#7c9bff", accent2="#ff8a50", good="#78c79a", bad="#f08a76"),
        defaults=dict(chapter_style="tab", collector="notebook"),
    ),
    "field": Preset(
        "field",
        Fonts(display='"Young Serif", Georgia, serif',
              display_italic='"Crimson Pro", Georgia, serif',
              text='"Crimson Pro", Georgia, "Times New Roman", serif',
              label='"Barlow Condensed", "Arial Narrow", sans-serif',
              mono='"IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace',
              css_url=GF + "family=Barlow+Condensed:wght@500;600;700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400"
                      "&family=IBM+Plex+Mono:wght@400;500&family=Young+Serif&display=swap"),
        light=dict(paper="#f9f7f1", paper2="#efebe0", plate="#f6f2e9", ink="#1b1d17", ink2="#41443a",
                   muted="#6f7065", rule="#dad5c6", accent="#3f6f45", accent2="#b5651d", good="#3f7a4a", bad="#a8402e"),
        dark=dict(paper="#121410", paper2="#1b1e18", plate="#ebe6da", ink="#ebeadf", ink2="#c8c7b8",
                  muted="#989787", rule="#30332b", accent="#86c08c", accent2="#e39a59", good="#86c08c", bad="#f08a76"),
        defaults=dict(chapter_style="plate", collector="notebook"),
    ),
    "noir": Preset(
        "noir",
        Fonts(display='"Old Standard TT", "Bodoni Moda", Georgia, serif',
              display_italic='"Old Standard TT", Georgia, serif',
              text='"Crimson Pro", Georgia, "Times New Roman", serif',
              label='"Oswald", "Arial Narrow", Impact, sans-serif',
              mono='"IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace',
              css_url=GF + "family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;500"
                      "&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Oswald:wght@500;600;700&display=swap"),
        light=dict(paper="#f4f1ea", paper2="#e9e4d8", plate="#f3eee3", ink="#191714", ink2="#3e3a33",
                   muted="#6c665c", rule="#d4cdbd", accent="#a3241d", accent2="#7a6320", good="#3f7a4a", bad="#a8402e"),
        dark=dict(paper="#111111", paper2="#1a1a19", plate="#e6e0d3", ink="#ece6da", ink2="#c9c2b4",
                  muted="#958e81", rule="#302e2a", accent="#e2483d", accent2="#d4ad45", good="#7cbf86", bad="#f08a76"),
        dark_first=True,
        defaults=dict(chapter_style="tab", collector="notebook"),
    ),
}


def _finish(pal: dict) -> dict:
    """Derive accent-ink and on-accent colors so text always reads."""
    p = dict(pal)
    p["accent_ink"] = ensure_contrast(p["accent"], p["paper"], 4.6)
    p["accent2"] = ensure_contrast(p["accent2"], p["paper"], 4.6)
    p["on_accent"] = on_color(p["accent"])
    p["accent_wash"] = mix(p["accent"], p["paper"], 0.82)
    for k in ("muted", "ink2"):
        p[k] = ensure_contrast(p[k], p["paper2"], 4.6)
    return p


def build_theme(theme: dict) -> dict:
    """Spec theme -> {fonts, light, dark, dark_first, chapter_style, collector, nouns}."""
    preset = PRESETS.get(theme.get("preset") or "editorial", PRESETS["editorial"])
    light, dark = dict(preset.light), dict(preset.dark)
    acc = (theme.get("accent") or "").strip()
    if acc.startswith("#") and len(acc) in (4, 7):
        light["accent"] = acc
        # dark mode gets a lighter sibling of the same hue
        dark["accent"] = ensure_contrast(mix(acc, "#ffffff", 0.18), dark["paper"], 4.6)
    return {
        "name": preset.name,
        "fonts": preset.fonts,
        "light": _finish(light),
        "dark": _finish(dark),
        "dark_first": preset.dark_first,
        "chapter_style": theme.get("chapter_style") or preset.defaults["chapter_style"],
        "collector": theme.get("collector") or preset.defaults["collector"],
        "section_noun": theme.get("section_noun") or "Chapter",
        "collection_noun": theme.get("collection_noun") or "lessons",
    }


TOKEN_ORDER = ["paper", "paper2", "plate", "ink", "ink2", "muted", "rule", "accent", "accent_ink",
               "on_accent", "accent_wash", "accent2", "good", "bad"]


def css_tokens(t: dict) -> str:
    """The :root token block in the three-state theme shape the artifact viewer expects."""
    def block(p):
        return " ".join(f"--{k.replace('_', '-')}: {p[k]};" for k in TOKEN_ORDER)

    f = t["fonts"]
    font_vars = (f'--f-display: {f.display}; --f-display-it: {f.display_italic}; --f-text: {f.text}; '
                 f'--f-label: {f.label}; --f-mono: {f.mono}; --label-case: {"uppercase" if f.label_upper else "none"};')
    first, second = (t["dark"], t["light"]) if t["dark_first"] else (t["light"], t["dark"])
    first_scheme, second_scheme = ("dark", "light") if t["dark_first"] else ("light", "dark")
    media = "light" if t["dark_first"] else "dark"
    return (
        f":root {{ {block(first)} {font_vars} color-scheme: {first_scheme}; --img-filter: {'brightness(.9) contrast(1.02)' if first_scheme == 'dark' else 'none'}; }}\n"
        f"@media (prefers-color-scheme: {media}) {{ :root:not([data-theme=\"{first_scheme}\"]) {{ {block(second)} color-scheme: {second_scheme}; "
        f"--img-filter: {'brightness(.9) contrast(1.02)' if second_scheme == 'dark' else 'none'}; }} }}\n"
        f":root[data-theme=\"{second_scheme}\"] {{ {block(second)} color-scheme: {second_scheme}; "
        f"--img-filter: {'brightness(.9) contrast(1.02)' if second_scheme == 'dark' else 'none'}; }}\n"
        f":root[data-theme=\"{first_scheme}\"] {{ {block(first)} color-scheme: {first_scheme}; "
        f"--img-filter: {'brightness(.9) contrast(1.02)' if first_scheme == 'dark' else 'none'}; }}\n"
    )
