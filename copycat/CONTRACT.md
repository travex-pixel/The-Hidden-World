# PROJECT COPYCAT — pipeline contract

Anime "What If" productions (16:9, stills-driven, full-cast audio drama). Python 3 package `copycat/`
at repo root, sibling of the existing `pipeline/` (which must keep working untouched except for the
domain gate hook). Everything runs as `python -m copycat.<module> <project_id>`.

## Paths
| What | Path | Git |
|---|---|---|
| Project source (script, edit plan, curation) | `copycat/projects/<id>/` | tracked |
| Asset vault (downloaded images + index) | `assets/cache/<franchise>/` (`images/`, `raw/`, `vault.json`, `pinned_ids.json`); franchise from `script.json["franchise"]` via `copycat.franchise` (default `black-clover`) | `images/` + `raw/` ignored, `vault.json` + `pinned_ids.json` tracked |
| Intermediate build files | `build/copycat/<id>/` | ignored |
| Final deliverables | `releases/copycat/<id>/` | tracked |
| Downloaded fonts | `assets/fonts/copycat/` | tracked |

Project id for this run: `bc-whatif-ep01`. Domain: `anime_black_clover`.

## Subject vocabulary (canonical keys used by script, vault tags and mapper)
asta, asta_young, asta_black_form, yuno, yuno_young, liebe, licita, five_leaf_grimoire, four_leaf_grimoire,
demon_slayer_sword, anti_magic, father_orsi, sister_lily, revchi, yami, noelle, magna, luck, vanessa, finral,
julius, william_vangeance, patolli, licht, sylph, dark_triad, lucifero, magic_knights, black_bulls, golden_dawn,
crowd, hage_village, hage_church, demon_skull, grimoire_tower, royal_capital, exam_arena, black_bulls_hideout,
dungeon, mindscape, night_sky.
Moods: quiet, ominous, determined, shock, combat, emotional, triumphant, comedic, mysterious, epic.
Shot types: wide, medium, closeup, extreme_closeup, action, group, establishing, panel.

## 1. `copycat/projects/<id>/script.json`
```
{ "id","domain","title","part","target_wpm",
  "cast": { "<SPEAKER>": {"description": str} },
  "chapters": [ { "id": "cold_open"|"ch1"..., "numeral": "I"|null, "title": str|null,
                  "card_seconds": float (0 = no card), "music": "<mood cue>",
                  "beats": [ {
      "id": "b001",                       # unique, ordered
      "speaker": "NARRATOR"|"ASTA"|"LIEBE"|"YUNO"|"YAMI"|"REVCHI"|"JULIUS"|"FATHER_ORSI"|"SISTER_LILY"|...,
      "text": str,                         # spoken words only, no stage directions, no "he said"
      "emotion": str,                      # delivery hint
      "pause_after_ms": int,               # 180-320 inside an exchange, up to 700 on dramatic holds
      "visuals": [ {"subjects":[..], "location": str|null, "mood": str, "shot": str|null,
                    "query": str,          # free-text description of the ideal real Black Clover image
                    "non_canon": bool} ],  # 1-3 cuts; beat time is split evenly across them
      "camera": "slow_push_in"|"slow_pull_out"|"pan_lr"|"pan_rl"|"impact_punch_zoom"|"drift_up"|null,
      "vfx": ["embers"|"dust"|"wind_streaks"|"impact_flash"|"speed_lines"|"red_glow"],
      "sfx": ["whoosh"|"page_flutter"|"anti_magic_hum"|"sword_ring"|"bass_drop"|"chain_rattle"|"wind"|"heartbeat"|"bell"|"crowd_murmur"|"riser"]
  } ] } ] }
```

## 2. `assets/cache/black-clover/vault.json`
```
{ "domain":"anime_black_clover", "assets":[ {
   "id":"bc_0001", "path":"assets/cache/black-clover/images/bc_0001.jpg", "domain":"anime_black_clover",
   "kind":"anime_still"|"manga_panel"|"key_art"|"portrait", "source":"fandom"|"jikan"|"local"|"generated",
   "source_url": str, "page": str, "file_title": str, "caption": str,
   "width": int, "height": int, "dhash": hex,
   "tags": {"subjects":[..], "location": str|null, "mood":[..], "shotType": str, "aspectRatio": "16:9"|"4:3"|"portrait"|..., "dominantPalette":["#rrggbb",..]},
   "focus": [x,y] 0-1 (point of interest for cropping, default [0.5,0.4]),
   "quality": 0-1 } ] }
```

## 3. `build/copycat/<id>/audio/timing.json` (written by the audio engine, which OWNS the timeline)
```
{ "duration": float, "sample_rate": 48000,
  "beats":[{"id","speaker","chapter","start","end","text"}],
  "cards":[{"chapter","numeral","title","start","end"}] }
```
Audio master: `build/copycat/<id>/audio/master.wav` (48 kHz stereo, -14 LUFS, TP < -1 dBTP).

## 4. `copycat/projects/<id>/edit.json` (written by the mapper, consumed by the compositor)
```
{ "id","width":1920,"height":1080,"fps":30,"duration": float,
  "shots":[ { "id":"s001","start": float,"end": float,       # contiguous, no gaps, cover [0,duration]
     "type":"still"|"card", "asset_id": str|null, "asset_path": str|null,
     "layout":"fill"|"depth_frame",                          # depth_frame = blurred 16:9 bg + sharp framed fg
     "focus":[x,y], "camera": str, "vfx":[..], "transition_in":"cut"|"flash"|"dissolve"|"whip",
     "treatment":"anime"|"manga_motion", "accent":"crimson"|"emerald"|"gold"|null,
     "beat_id": str|null, "speaker": str|null, "chapter": str,
     "card": {"numeral","title"}|null } ],
  "captions":[ {"start","end","text","speaker"} ] }
```
Silent picture: `build/copycat/<id>/video/picture.mp4`; final mux: `releases/copycat/<id>/master.mp4`
(H.264 yuv420p 1920x1080 30fps, AAC 192k).

## Rules
- Domain gate: an anime project may only ever receive assets whose `domain` is `anime_black_clover`
  (or `anime_fantasy`). No procedural cartoon / SVG / stickman / stock fallback — a missing match is an error.
- An asset may not repeat within 8 consecutive shots or 45 s.
- No frame may be static: every shot has camera motion.
- Do not commit; do not touch files outside your assignment; pipe noisy output through `tail -n 30`.

## Run order (project `bc-whatif-ep01`)
```
python -m copycat.visuals.harvester            # fetch + cache real Black Clover stills -> assets/cache/black-clover/
python -m copycat.script_tools  bc-whatif-ep01 # validate script.json
python -m copycat.audio_drama   bc-whatif-ep01 # full-cast mix -> build/.../audio/master.wav + timing.json
python -m copycat.mapper        bc-whatif-ep01 # beats -> edit.json (applies shot_overrides.json, domain gate)
python -m copycat.storyboard    bc-whatif-ep01 # review sheets -> build/.../storyboard/
python -m copycat.compositor    bc-whatif-ep01 --mux   # 1080p render -> releases/.../master.mp4
python -m copycat.qa_verify     bc-whatif-ep01 # gates on the real MP4 + qa_contact_sheet.png
python -m copycat.packaging     bc-whatif-ep01 && python -m copycat.thumbnail bc-whatif-ep01 && python -m copycat.shorts bc-whatif-ep01
```
`master.mp4` exceeds GitHub's 100 MB limit and is git-ignored; `master_web_1080p.mp4` is the committed copy.


## 5. Franchises (added with the Naruto series)
`copycat.franchise.for_project(pid)` / `.load(id)` resolve the vault dir, wiki API, subject vocabulary and
`speaker_colours` (caption speaker tags) from `config/franchises/<id>.json`. `subjects: null` = the legacy built-in
Black Clover vocabulary. Black Clover stays the default and behaves exactly as before.
* Vault assets carry `"franchise": "<id>"` (absent = `black-clover`); `AssetDomainGate(domain, franchise)` and the mapper refuse
  an asset of another franchise (a Black Clover frame never appears in a Naruto episode and vice versa). Naruto assets use
  domain `anime_naruto` (`anime_fantasy` also admits it); kinds stay `anime_still` / `manga_panel`.
* Harvest: `python -m copycat.visuals.harvester --franchise naruto [--lang-wikis es,pt-br,pl,fr] [--search-places] [--max N] [--rebuild]`
  (Narutopedia screenshot categories + file-page metadata; Part I sections of es/pt-br/pl/fr character pages; keyword search for character-free place/object frames, tagged `conf: low`)
  (ids `nr_0001...`). Contact sheets: `python -m copycat.visuals.sheets --franchise naruto [--era part1] <subject>`.
* Naruto asset tags add: `era` = `part1|kid|none|unknown` (`shippuden`/`boruto` are never kept in the vault; `none` = place/object
  frames with no character), `time` = `night|day|dusk|null`, `text_free` (bool), `series`, `src_episode`; shot scale in `shotType`
  (`closeup|medium|wide|action`); moods use both the franchise words (`comedy`, `action`) and the legacy ones (`comedic`, `combat`).
  Manual corrections: `copycat/projects/<id>/curation.json` (`reject`, `subjects`, `add_subjects`, `remove_subjects`, `era`, `time`,
  `text_free`, `shotType`, `mood`, `location`, `focus`, `keep`); `"_config"` there (or in `shot_overrides.json`, or `mapper_config.json`)
  holds mapper knobs: `avg_shot_s` (target average shot length, 0.6x in action/comedy beats), `lock_seconds` (default 90 for Naruto),
  `era` (default `part1`), `avoid_assets_from: [project ids]` (+ `avoid_penalty`, default 3.0: soft penalty for hero frames those
  projects' edit.json already used).
* Repetition (Naruto): no asset more than twice, never within 8 shots or 90 s. Character frames whose era differs from the project era
  (script `era`, default `part1`) are penalised (shippuden/boruto -12/-14, kid -6, unknown -1); visuals may set `"era"` / `"time"`.

## 6. CANON stamp
A beat may carry `"stamp": {"label": "CANON", "note": "<= 60 chars"}`. The mapper copies it to the shot that starts the beat
(`edit.json` `shots[].stamp`, same shape); `copycat/stamp.py` renders it in the compositor: upper-right safe area, rubber-stamp
(Anton, double-ruled box rotated -7 degrees, distressed ink), note on a clean strip beneath. Slam 1.6 -> 1.0 over 5 frames with a small
overshoot and a 2-frame white border flash, hold, fade over 8 frames; on screen min(2.6 s, shot length). It never reaches the caption zone.


---------------------------------------------------------------------------------------------------------------------
# Season 1 engine (Naruto "What If", Episodes 1-4): shared by every episode project

Episode 1 (`naruto-whatif-ep01`) is the reference: its `edit.json` must stay byte-identical when the engine changes
(`python -m copycat.mapper naruto-whatif-ep01 --dry-run` vs the committed file; same for `bc-whatif-ep01`).
**Episode editors never touch shared code** (`copycat/*.py`): everything below is per-project data in
`copycat/projects/<id>/` (`script.json`, `whitelist.json`, `shot_overrides.json`, optional `thumbnails.json`, `shorts.json`,
`packaging_copy.json`).

## 7. Episode run order
```
1  audio       python -m copycat.audio_drama <id>                 # -> build/copycat/<id>/audio/master.wav + timing.json (owns the timeline)
2  whitelist   hand-verify frames -> copycat/projects/<id>/whitelist.json  (labels below)
3  inserts     put "insert": {...} on beats in script.json (or "extra_inserts" in _config) -> stills:  python -m copycat.inserts stills-s1
4  mapper      python -m copycat.mapper <id> --dry-run            # stats only; fix _config (windows, grid_plan, chapter ctx) until unmatched = 0
               python -m copycat.mapper <id>                      # writes edit.json + build/.../mapper_report.json
5  storyboard  python -m copycat.storyboard <id>                  # build/copycat/<id>/storyboard/sheet_*.jpg (weak / unmatched boxed red)
6  render      python -m copycat.compositor <id> --plan           # validates files + estimate, writes nothing
               python -m copycat.compositor <id> --mux --crf 20   # -> releases/copycat/<id>/master.mp4 (+ captions.srt)
7  qa          python -m copycat.qa_verify <id>                   # gates on the real MP4;  --plan = picture-plan gates only (no video)
8  extras      python -m copycat.shorts <id> [--plan]  ·  python -m copycat.thumbnail <id> [--plan|--out DIR]  ·  python -m copycat.packaging <id> [--dry-run|--out DIR]
```
`--plan` / `--dry-run` / `--out` never write under `releases/`.  Before the first real mapper run there is no `edit.json`: storyboard,
compositor `--plan`, qa_verify `--plan` and thumbnail props then use an in-memory mapper dry run.
`thumbnail` writes starter variants from the whitelist when `thumbnails.json` is missing; `shorts` picks three starter windows from the
timing when `shorts.json` is missing; `packaging` derives titles / chapters / tags from `script.json` + `timing.json` when
`packaging_copy.json` is missing - replace all three with hand-made files before upload (same shapes as Episode 1's).

## 8. Whitelist mode
A project with `whitelist.json` and `_config.wl` (in `shot_overrides.json`) may only use frames a person looked at and approved,
plus designed inserts and clone grids made from the same frames.  Every cut is scored from the labels, never from wiki tags.
Labels per frame id: `scene time who expression scale ok_as_night note w h` and optional `focus [x,y]`, `faces {who:[x,y]}`,
`clone_points [[x,y]..]`, `crops [{x,y,zoom}]`, `crop_only {x,y,zoom}` (forced framing), `maxz`, `only ["b012..b020"]` (beat ranges the frame
may serve), `flashback true` (never night-graded), `fight`.
* `scene` is free text: `_config.wl.chapters[ch].scenes` lists the scenes a chapter may use, best first.  Seen so far: forest_night_ep1,
  village_day / village_night, hokage_office, archive_library, classroom_academy, training_ground, ichiraku, mission_desk, mail_desk,
  parents_flashback, uchiha_flashback, seal_mindscape, neutral_portrait, object, establishing, road_day, woods_morning, shore_fight, ice_mirrors,
  boat_mist, bridge_battle_mist, tazuna_house, gato_office, aftermath, exam_hall, forest_of_death, arena, stands_asleep, barrier_roof,
  village_under_attack, rooftop_night, hospital.
* `time`: `day | night | dusk | interior`.  `who`: any key of `whitelist.CHAR_KEYS` / `EXTRA_CHAR_KEYS` (Episode 1 cast + obito, rin, danzo, root,
  anbu, tazuna, inari, zabuza, haku, gato, ibiki, anko, orochimaru, kabuto, gaara, jiraiya, rock_lee ...) or any key named in `wl.extra_who`.
  `team7` expands to naruto + sasuke + sakura + kakashi.
* **Speaker -> who**: `whitelist.SPEAKER_WHO` (NARUTO, CLONE, IRUKA ... DANZO, TAZUNA, ZABUZA, HAKU, INARI, GATO, KABUTO, IBIKI, ANKO,
  OROCHIMARU, GAARA, JIRAIYA, KURAMA ...); override / extend with `wl.speaker_who {"SPEAKER": ["key", ..]}`.  Dialogue always shows its speaker.
  Narration shows the characters the beat's visuals / text mention (`wl.mention {key: regex}` adds patterns).
* **Speaker fallback** (`wl.speaker_fallback`): a speaker with fewer than `min_frames` (default 3) own approved frames may be shown by a
  stand-in set instead of leaving the cut unmatched, e.g.
  `{"DANZO": {"who": ["anbu","root"], "scenes": ["hokage_office","object"], "min_frames": 3, "allow_empty": true}}` - frames with those `who`
  (and, with `allow_empty`, character-free frames of those scenes) count as the speaker; combine with an insert on the beat.
* **Introduction windows** (`wl.windows {who: ["b159..b167", ..]}`): nobody is on screen outside the beats where the story has met them.
* **Chapter / beat context** (`wl.chapters {ch: ctx}`, `wl.beats {"b006": ctx | "b215..b225": ctx}`; beat ctx merges over chapter ctx):
  `scenes`, `time` (`day | night | dusk | interior | lamp | mist`), `who` (allowed cast; others are rejected), `graded_scenes` (frames of these scenes
  may be graded to fit the time), `shot`.
* **Grades** (`vfx.GRADES`, applied by the compositor, picked by the mapper per shot -> `shots[].grade`): `night` (cool teal, moon rim) for a day
  frame in a `night` scene; `interior_lamp` (warm tungsten) in `lamp` scenes; **`mist`** (desaturated cool grey-green haze, lifted blacks, soft
  bloom) for `time: "mist"` scenes (Episode 3 boat / bridge) - frames of `wl.mist_native_scenes` (default boat_mist, bridge_battle_mist) are not graded.
  `seal_mindscape`, `parents_flashback`, `uchiha_flashback` (`wl.no_grade_scenes`) and `flashback` frames keep their own light.
* **Re-crops**: one asset may serve several cuts (`reuse_cap`, default 4) but never twice with the same crop; crops come from `crops`,
  `faces`, `clone_points`, `focus` (natural / tight / left / right ...).  `repeated_asset_crop` must be 0.
* **Relaxation** (when a cut finds nothing): `wl.relax_scenes`, `relax_night_scenes`, `no_relax_scenes`, `relax_who`; the report counts WEAK frames.
* **Insert backdrops** come from the project's own whitelist: `whitelist.BG_SCENES[type]`, overridden by `wl.insert_bg {type: [scenes]}`,
  `wl.insert_tone {type: "day"|"night"}` or per insert `"bg_scenes": [...]`, `"bg_tone"`; pin one with `shot_overrides["b012#0"] = {"bg": "nr_0123"}`.

## 9. `_config` keys (`shot_overrides.json`, also read from `curation.json` / `mapper_config.json`)
`avg_shot_s`, `avg_by_chapter {ch: s}`, `cold_avg`, `split_bias`, `max_shot`, `cold_max_shot`, `merge_short_s`, `merge_cross_s`, `merge_max_s`,
`lock_seconds` (min seconds between uses of one asset), `lock_shots`, `strict_reuse`, `era`, `crowd_penalty`, `avoid_assets_from [project ids]`,
`avoid_penalty`, `extra_inserts {beat_id: insert}` (inserts without touching script.json), `grid_plan [...]`, `gap_exempt ["b035..b038"]`,
`time_by_chapter / time_by_beat`, and the `wl` block of section 8: `reuse_cap`, `min_gap_s`, `chapters`, `beats`, `windows`, `speaker_who`,
`speaker_fallback`, `extra_who`, `mention`, `relax_*`, `no_relax_scenes`, `no_grade_scenes`, `lamp_scenes`, `mist_native_scenes`, `insert_bg`,
`insert_tone`, `avoid [asset ids]`, **`grid_faces`**.  Starter configs for Episodes 2-4 set whitelist mode on, chapter contexts guessed from the
script (`lamp` for archive / office, `day` for the village / exam, `mist` for Episode 3's boat and bridge, `night` for the rooftop), Episode 1's reuse
rules, and empty `windows` / `grid_plan` / `extra_inserts` for the editor to fill.

## 10. Clone grid (`type: "clone_grid"`, see `clone_grid.py`)
Comic-page grids of Naruto / clone face crops (2, 3, 4, 6, 9 panels, `split`, 16-tile `mosaic`) that pop in one by one; the speaker's panel gets a
border in the speaker colour.  `grid_plan` in `_config` lists runs of beats: `{"cuts": [{"k": "g6"|"g2"|"g9z"|"g16z"|"real", "b": "b049..b050", "f": [0, 0.5]}]}`
(`f` = fraction of the beat).  Panels come only from whitelisted frames whose `who` is naruto / naruto_clones.  `wl.grid_faces`:
`"library"` (default = Episode 1's hand-made crop table, which names Episode 1 frame ids), `"auto"` (library crops that exist in this whitelist +
crops derived from the labels: `faces.naruto` / `focus` for close-ups, `clone_points` for crowds), `"derived"` (labels only).  Episodes 2-4 use `"auto"`.
Time of day follows the chapter ctx (`night` / `lamp` / `mist` grades per panel).

## 11. Designed inserts (`copycat/inserts.py` engine + `copycat/inserts_s1.py` season-1 prop pack)
A beat opts in with `"insert": {"type": ..., params}` (script.json or `_config.extra_inserts[beat_id]`).  Each shot shows a paper prop over a blurred,
darkened real frame; ink is revealed from *phrases of the beat text* (`say`), so it follows the real voices.  Common keys: `variant`, `views`
(`[{frm, to, z:[z0,z1], ty}]`, one shot per view; `frm`/`to` = an anchor name or paper coordinates `[x, y]`), `at` (fraction of the beat after which the
insert starts), `present` (groups already on the page), `animate` (groups written during the beat), `say {group|name: phrase}`,
`bg_scenes`, `bg_tone`, `hold` + `reveal`.  Groups not in `present` / `animate` use the type's default (written in sequence over the beat; in a held
document: not yet drawn).  `python -m copycat.inserts stills-s1 [type...]` renders review stills to `build/copycat/inserts_s1/` (+ `_overview/`);
the printed `lint` lists legibility-critical ink that enters the caption zone for the default view - choose `views` so it does not.

**Held documents** (`hold`): beats whose inserts share `"hold": "<id>"` show the same document, with the same backdrop; `"reveal": ["g1","g2"]` names the
groups that write in on *this* beat, earlier reveals stay (`present`), `"reveal": "rest"` writes everything left.  Explicit `present` / `animate` win.
Example: `b061 {type: incident_file, hold: inc, reveal: [r1,r2]}`, `b062 {..., reveal: [r3]}`, `b063 {..., reveal: rest}`.

| type (variant) | params (defaults reproduce the Episode 2-4 script lines) | groups |
|---|---|---|
| `scroll_note`, `notebook_rules`, `maths_card`, `staff_form`, `kazekage_letter`, `mission_report` (`ambush`, `formation`, `cat`, `puddle`, `names`, `tabs`), `evaluation_folder`, `roster` | Episode 1 props, unchanged (see `inserts.py`) | per type |
| `mission_report` `signed_doodle` | `lines [str]`, `rank`, `team`, `date`, `client`, `signature` | l1.., doodle, sig |
| `patrol_report` | `lines [{text, say, ul}]`, `signature`, `week`, `title`, `doodle` (ramen) | l1.., ul, doodle, sig |
| `incident_file` | `rows [{item, cause, cost, say}]`, `final`, `stamps [{text,x,y,rot,color,size}]` | r1.., final, st_invoice, st_paid |
| `team_report` | `entries [{name, text | weeks [..], say}]` | e1.. |
| `notebook_dates` | `dates [11]`, `circled [idx,idx]`, `file_dates`, `title`, `note` | dates, c1, c2, file, a1, a2, note |
| `regulation` (`overlay: "requisition"`) | `sections [str]`, `highlight` (1-based), `requester`, `item` | s1.., hl, ul, slip, denied |
| `bingo_appendix` | `steps [str]`, `village`, `rule`, `margin` | st1.., diagram, rule, ul, margin |
| `mission_board` (`empty`) | `ticked`, `prev_ticked`, `total`, `tora` (tally), `missions [str]` | tick, tora, sign |
| `box_label` | `names [str]`, `sub [str]` | l1.. |
| `price_sheet` | `rows [{rank,text,fee,say}]`, `circle` (row idx), `note` | r1.., circ, note |
| `work_schedule` | `equation [[text, phrase]]`, `batches`, `title` | e1.., total, gantt, pop |
| `ledger` | `rows [{date,item,amount,paid,say}]`, `highlight` (idx or name) | r1.., hl, circ |
| `registration_form` | `fields [[LABEL,value,phrase]]`, `circle ["ATTEMPTS"]`, `signature` | f1.., circ, stamp |
| `info_card` (`naruto`, `sasuke`) | `name`, `rank`, `stats [[label,0-5]]`, `notes [str]`, `underline` | portrait, stats, n1.. |
| `cheater_report` | `rows [[row,seat,name,method]]`, `circle` (name), `note` | r1.., c1-c3, note |
| `scout_map` | `sectors`, `sector` (circled), `note_lines [str]`, `seed` | ring, note |
| `hospital_report` | `fields [[LABEL,value,phrase]]`, `circle [LABELS]`, `note` | f1.., circ, chart, note |
| `signature_compare` | `ref_new` (the old letter is Episode 1's `kazekage_letter` signature, stroke for stroke) | circ, old, new |
| `postponement_form` | `fields`, `applicant`, `reason`, `filed`, `by` | f1.., signature, stamp |
| `leave_slip` | `date`, `rank`, `destination`, `countersigned`; the name line is always inked out | date, counter, seal, name |

**Stamps.**  (1) The series CANON stamp: a beat's `"stamp": {"label": "CANON", "note": "<= 60 chars"}` (section 6) - upper-right safe area, never
on a stamped shot's caption zone; inserts keep clear of `STAMP_RECT` when the shot carries one.  (2) In-world rubber stamps inside props
(`rubber()` in `inserts_s1.py`: PAID IN FULL, INVOICE, DENIED, RECEIVED, ACCEPTED, RESTRICTED): Anton text in a double-ruled box, slam-in, own
group name (`st_paid`, `denied`, `stamp`).
