# Packaging: titles and thumbnails (history series)

The full research report, with 86 sources and an evidence-strength label on every claim, is
[docs/research/packaging_research.md](research/packaging_research.md). Every source in it was read through search-result
snippets: the build environment could not open the pages. This page holds the rules the channel follows and how the
pipeline applies them.

## What the evidence says (short version)
1. **YouTube rewards watch time per impression, not clicks.** Its own A/B tool (Test & Compare: up to 3 titles and/or
   thumbnails) picks winners by watch-time share. High CTR with low view duration reads as clickbait and is
   recommended less. *Strong.*
2. **Pay off the promise immediately:** a visual payoff within ~10 s, confirmation within ~30 s, context within ~60 s.
   This is YouTube's own advice and the MrBeast production guide's. *Strong.*
3. **Absurd is allowed; false is not.** Anything in the title or thumbnail must be in the video (YouTube's
   misleading-metadata policy). Clickbait that doesn't deliver lowers credibility. *Strong.*
4. **One idea readable at a glance:** at most 3 focal elements (face, object, ≤3 words), checked at phone size.
   Moderate visual complexity beats both minimal and busy (peer-reviewed, 22,958 thumbnails). *Moderate–strong.*
5. **Specific beats vague.** Name the absurd thing (a hand mill, a penny, ale). Vague "you won't believe" curiosity
   gaps average slightly worse. *Moderate.*
6. **Title and thumbnail complement, never repeat.** *Weak–moderate (practitioner consensus).*
7. **Titles 30–50 characters, key words first.** *Moderate.*
8. **Faces help on average but aren't magic.** Prefer a specific, readable emotion with a closed or small mouth over
   the generic shock face. Closed-mouth thumbnails won ~30 A/B tests in a row for MrBeast's team. *Moderate.*
9. **No hype typography in titles:** no ALL CAPS, no "SECRET/TRUTH", no stacked "?!". All caps tested negative for
   Education in one 11-niche study. *Moderate.*
10. **Stand out from the AI-slop flood** of "you wake up in medieval times" videos with specific true facts and a
    recognisable hand-made character. *Moderate (reporting, 2025).*

## How the pipeline applies it
- `episode.json → publishing.packages`: up to 3 **title + thumbnail** pairs for Test & Compare. Each has its **promise**
  and **where the video pays it off** (timestamps), written before rendering.
- `publishing.thumbnails`: drawn by `renderer/history/thumbnail.js` from the episode's own rig, props and palette:
  - **Layouts:** L1 (reaction + object + question), L2 (object hero), L4 (big number).
  - **Text:** ≤3 words, saffron/cream with a 13 px ink stroke, cap height ≈ 0.13 H.
  - **Background:** a cool mid-value wash from the measured palette, picked to complement the object.
  - **Outlines:** 7–8 px ink outlines so watercolour survives at 168 px wide.
  - **Danger accent:** a red stamp only for "banned / fined".
  - **Series edge:** a deckled parchment border.
- `python -m pipeline.publish_history out/<id>` writes `thumbnail_A/B/C.jpg`, `packages.md` and `feed_test.png`.
  The feed test shows each thumbnail at desktop and phone size on light and dark backgrounds, for the 1-second glance test.
- `tests/test_history.py` enforces the mechanical rules: title length, no ALL-CAPS words, ≤3 thumbnail words, text
  not repeating the title, every package pointing to an existing thumbnail.

## Absurd-but-true: the promise ledger
For each package, write three lines before rendering:
- **Promise:** what a viewer expects from title + thumbnail.
- **Proof:** the timestamps where the video delivers it. Episode 2 therefore opens on the floor of confiscated mills.
- **Open loop:** the next question that keeps them watching.

If a historian would wince at the title, reword it. Episode 2 says "banned", not "illegal", because "banned" is what
the sources and the video support.

## Current packages
| Episode | A | B | C |
|---|---|---|---|
| H01 | *Why Medieval People Cut Their Money in Half* + "NO CHANGE?" | *You Have One Penny. Bread Costs a Quarter.* + "CUT IT UP" | *You Wake Up in a Medieval Village With One Penny* + "NO CHANGE?" |
| H02 | *Why Grinding Your Own Flour Was Banned* + "HIDE IT" | *The Abbot Who Paved His Floor With Hand Mills* + "UNDERFOOT?" | *Medieval Workdays Came in Two Types: Ale or Dry* + "ALE DAY" |

These are hypotheses to test with Test & Compare, not proven winners. Check watch-time share after 1–2 weeks and
keep the winning pattern for the next episode.
