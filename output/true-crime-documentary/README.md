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
