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
