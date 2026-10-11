# True-crime documentary outputs

| Run | Status | Notes |
|---|---|---|
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
