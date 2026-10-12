# True-crime documentary outputs

| Run | Status | Notes |
|---|---|---|
| `tupac-keffe-d-20261012-run2/` | **FINAL: Tupac murder trial (Keffe D)** | 7:19. How the case reached a verdict after 27 years; the State never said Davis fired. Kokoro `bm_fable`, three opening concepts, a tone per line. ASR WER 3.8%; voice 19.5 dB over the music, 21.4 dB in the opening. Every QA check passes. Gate: no critical findings; legal-language checks pass; 21 high findings open (search-excerpt sourcing, plus FC-02: **sentencing is on 13 Oct 2026, so this cut is accurate only until then**). DRAFT until human sign-off. Delivered as a private download page. |
| `tupac-keffe-d-20261012-run1/` | Superseded by run2 | 7:19. Same script; QA flagged a 4-second black frame at 1:34 (the shooting beat). run2 replaces it with a shot of the intersection. Kept for reference. |
| `pet-cemetery-murders-20261011-run1/` | **FINAL: The Pet Cemetery Murders** | 6:39. The real case behind HBO's ghost-story series (Dorothy Thompson, 1985). Kokoro `bm_fable` narrator, three opening concepts, a tone per line. ASR WER 7.7% (mostly number formatting; "Nodier" needs a listen); voice 19.4 dB over the music, 21.7 dB in the opening. Gate: no critical findings; legal-language checks pass; 8 high findings open until The Advocate, Sheriff's Office and FOX 8 reports are read in full. DRAFT until human sign-off. Delivered as a private download page. |
| `thomas-randolph-20261011-run2/` | **FINAL (v2): The Widower, new narration** | 9:11. Kokoro `bm_fable` narrator. The script was rewritten for the ear, with a new 60-second opening and a tone per line. ASR WER 2.4%; voice 19–22 dB over the music. Gate: no critical findings; legal-language checks pass; 14 high findings open until the court rulings are read in full. DRAFT until human sign-off and the owner's listening check (`audit/narration-qa.md`). Delivered as a private download page. |
| `thomas-randolph-20261011-run1/` | Superseded by run2 (v1 narration) | 7:35. Piper narrator. Kept for reference; run2 has the same evidence with the new narration and opening. |
| `lizzie-borden-20261011-run1/` | **FINAL: Lizzie Borden** | 8:41. 73 of the 111 shots are walking and acting character scenes from the Case Files rig. Gate: 0 critical, high or medium findings; DRAFT until human sign-off. Delivered as a private download page. |
| `betsy-faria-20261011-run2/` | **FINAL (v2): use this one** | 7:17. Tighter cold open: the GUILTY → NOT GUILTY contradiction lands at 0:03.6. Includes the accuracy fixes from the investigative review and the fixed opening frames. Full deliverables are in the folder. |
| `betsy-faria-20261011-run1/` | Superseded (v1) | 7:26. Passed the 12 core media checks and was delivered first as an early preview. The extended QA later found its first 0.87 s nearly black. Kept for reference. |

The large media (`documentary.mp4`, previews, Shorts MP4s, `mix.wav`) are ignored by git. They exist only on the machine that rendered them. Re-create them with:

```
python -m documentary.build documentary/films/betsy-faria
python -m documentary.qa <run>
python -m documentary.shorts <run>
```

## Evidence and legal-risk audit (11 Oct 2026)

`betsy-faria-20261011-run2/audit/` contains the following. These are reports only: the MP4s were not modified (see `audit/preservation-check.json` at this level).

| File | Contents |
|---|---|
| `final-qa-report.md` | Start here. Three-part review and the answers to the brief. |
| `release-decision.md`, `gate-report.json` | **DRAFT — NOT CLEARED FOR PUBLICATION**, with every finding |
| `evidence-ledger.md`, `bibliography.md` | Claim-level evidence and sources, with access dates |
| `legal-risk-review.md`, `independent-fact-check.md`, `post-production-audit.md` | Review stages D, C and F |
| `human-review-items.md` | Outstanding items for a human |
| `claim-aware-manifest.json`, `asset-provenance.json`, `asr-audit.json`, `test-results.txt` | Supporting data |
| `superseded/` | Packaging text as it stood before the audit revisions |

The machine-readable sources of truth live in `documentary/films/betsy-faria/evidence/`.
