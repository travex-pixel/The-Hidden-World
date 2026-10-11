"""Tests for the cinematic Case Files (engine v3): the character library, the figure rig and sets, the shot files, and
that the cinematic episodes narrate exactly the reviewed, sourced script of the original series (no new claims)."""
import json, re, sys, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from pipeline.schema import load_episode  # noqa: E402
from pipeline.build import fx_time  # noqa: E402

SERIES = ROOT / "series" / "true-crime-cinematic"
CFG = json.loads((SERIES / "series.json").read_text())
EPS = [e["id"] for e in CFG["episodes"]]
FIGS = {p.stem: json.loads(p.read_text()) for p in (ROOT / "characters" / "figures").glob("*.json")}
FIG_JS = (ROOT / "renderer" / "figures.js").read_text()
SETS_JS = (ROOT / "renderer" / "sets.js").read_text()


def _keys(js: str, const: str) -> set[str]:
    body = js[js.index(f"const {const} = {{"):]
    body = body[:body.index("\n  };")]
    return set(re.findall(r"^\s{4}(\w+):\s", body, flags=re.M))


POSES, EXPRS = _keys(FIG_JS, "POSES"), _keys(FIG_JS, "EXPR")
SETS = set(re.findall(r"^\s{4}(\w+)\(ctx, o = \{\}\) \{", SETS_JS, flags=re.M))


def _code(path: Path) -> str:
    return re.sub(r"/\*.*?\*/|//[^\n]*", "", path.read_text(), flags=re.S)


class CharacterLibrary(unittest.TestCase):
    def test_every_character_spec_is_complete(self):
        need = ["id", "name", "real_person", "depiction", "sex", "skin", "skin_shadow", "skin_light", "eyes", "brows", "lips", "hair", "outfit"]
        for fid, f in FIGS.items():
            for k in need:
                self.assertIn(k, f, f"{fid}: missing {k}")
            self.assertEqual(f["id"], fid, f"{fid}: id must match the file name")
            self.assertIn(f["hair"]["style"], {"bob_fringe", "long_tied", "shoulder", "wild", "balding", "short_neat"})
            self.assertIn(f["outfit"]["style"], {"coat", "jacket", "labcoat", "robe", "dress", "sweater", "shirt"})
            for e in f.get("expressions_allowed", []):
                self.assertIn(e, EXPRS, f"{fid}: unknown expression {e}")
            for p in f.get("poses_allowed", []):
                self.assertIn(p, POSES, f"{fid}: unknown pose {p}")

    def test_real_people_are_labelled_as_illustrations_not_likenesses(self):
        real = [f for f in FIGS.values() if f["real_person"]]
        self.assertTrue(real)
        for f in real:
            self.assertIn("not a likeness", f["depiction"].lower(), f"{f['id']}: real person must be an illustrated representation")
        for f in FIGS.values():
            if not f["real_person"]:
                self.assertRegex(f["name"].lower(), r"generic", f"{f['id']}: invented characters are named as generic")


class CinematicEpisodes(unittest.TestCase):
    def test_episode_data_is_generated_from_the_source_script(self):
        import importlib.util
        spec = importlib.util.spec_from_file_location("case_files_cinematic", SERIES / "make_episodes.py")
        make_episodes = importlib.util.module_from_spec(spec); spec.loader.exec_module(make_episodes)
        for build in (make_episodes.poc, make_episodes.chamberlain, make_episodes.unabomber):
            ep = build()
            on_disk = json.loads((ROOT / "episodes" / ep["id"] / "episode.json").read_text())
            self.assertEqual(on_disk, json.loads(json.dumps(ep)), f"{ep['id']}: run python series/true-crime-cinematic/make_episodes.py")

    def test_narration_and_claims_are_the_reviewed_script(self):
        # the cinematic cut may re-stage and re-split shots, but must say exactly what the sourced v1 script says
        for new, old in (("tcv01-chamberlain", "tc01-chamberlain-jacket"), ("tcv02-unabomber", "tc02-unabomber-words")):
            a, b = load_episode(new), load_episode(old)
            said = lambda ep: " ".join(l["text"] for s in ep["scenes"] for l in s["lines"])
            self.assertEqual(said(a), said(b), f"{new}: narration differs from the reviewed script")
            self.assertEqual(a["claims"], b["claims"])
            self.assertEqual([s["id"] for s in a["sources"]], [s["id"] for s in b["sources"]])

    def test_shots_only_use_known_figures_poses_expressions_sets(self):
        for eid in EPS + ["tcv00-poc"]:
            ep = load_episode(eid)
            js = _code(ROOT / "renderer" / "scenes" / f"{eid}.js")
            for fid in ep["figures"]:
                self.assertIn(fid, FIGS, f"{eid}: figure {fid} has no characters/figures/{fid}.json")
            derived = dict(re.findall(r"c\.(\w+) = \{ \.\.\.c\.(\w+)", js))   # runtime variants of a cast member (e.g. a card portrait)
            for fid in re.findall(r"\bid: '(\w+)'", js):
                self.assertIn(derived.get(fid, fid), ep["figures"], f"{eid}: shot uses {fid}, which is not in the episode's figures")
            for p in re.findall(r"\bpose: '(\w+)'", js) + re.findall(r"\? 'sit_type' : '(\w+)'", js):
                self.assertIn(p, POSES, f"{eid}: unknown pose {p}")
            for x in re.findall(r"\bexpr: '(\w+)'", js):
                self.assertIn(x, EXPRS, f"{eid}: unknown expression {x}")
            local = set(re.findall(r"E\.sets\.(\w+) =", js))
            i = js.find("E.registerSets(")   # environments an episode adds itself (set functions take (ctx, o))
            if i >= 0:
                local |= set(re.findall(r"\b(\w+)\s*\(\s*ctx\s*,\s*o\b", js[i:]))
            for s in re.findall(r"\bset: '(\w+)'", js):
                self.assertIn(s, SETS | local, f"{eid}: unknown set {s}")
            for fid, var in re.findall(r"id: '(\w+)', outfit: '(\w+)'", js):
                self.assertIn(var, FIGS[fid].get("outfit_variants", {}), f"{eid}: {fid} has no outfit {var}")

    def test_every_shot_is_tagged_as_an_illustration(self):
        # E.cine.shot always draws a tag (default "ILLUSTRATION · NOT A PHOTOGRAPH"); custom tags must still say ILLUSTRATION
        self.assertIn("E.doc.tag(spec.tag || 'ILLUSTRATION · NOT A PHOTOGRAPH')", SETS_JS)
        for eid in EPS:
            js = _code(ROOT / "renderer" / "scenes" / f"{eid}.js")
            for tag in re.findall(r"\btag: '([^']*)'", js):
                self.assertTrue(tag.startswith("ILLUSTRATION"), f"{eid}: tag '{tag}'")
            n_shot = js.count("E.cine.shot(")
            n_types = len({s["scene"] for s in load_episode(eid)["scenes"]} - {"case_map"})
            self.assertEqual(n_shot, n_types, f"{eid}: every scene type is a composed cinematic shot")

    def test_flagged_wording_is_absent(self):
        banned = {"tcv01-chamberlain": ["dingo ate my baby", "declared innocent", "innocent", "faked", "cardigan", "David Brett"],
                  "tcv02-unabomber": ["typewriter matched", "original manifesto", "suicide", "never seen", "23 injured", "24 injured", "PUBLISH MY", "I WILL"]}
        for eid, words in banned.items():
            js = _code(ROOT / "renderer" / "scenes" / f"{eid}.js").lower()
            for w in words:
                self.assertNotIn(w.lower(), js, f"{eid}: on-screen text uses flagged wording '{w}'")
        self.assertNotIn("Washington Post</text>", (ROOT / "renderer" / "scenes" / "tcv02-unabomber.js").read_text())

    def test_runtime_and_output_folder(self):
        lo, hi = CFG["duration_limits_s"]
        self.assertEqual((lo, hi), (45, 90))
        for e in CFG["episodes"]:
            self.assertRegex(e["file"], r"^true_crime_[a-z0-9_]+\.mp4$")
        # the cinematic outputs live in their own folder and never overwrite the original series' files
        self.assertNotEqual(SERIES / "output", ROOT / "series" / "true-crime" / "output")

    def test_outputs_verified_if_present(self):
        m = SERIES / "production_manifest.json"
        if not m.exists():
            self.skipTest("no manifest yet")
        from pipeline.series import sha256
        for key, rec in json.loads(m.read_text())["videos"].items():
            f = SERIES / "output" / rec.get("file", "")
            if rec.get("status", "").startswith("verified") and f.is_file():
                self.assertEqual(sha256(f), rec["sha256"], f"{rec['file']} changed since verification")
                self.assertEqual((rec["media"]["width"], rec["media"]["height"]), (1080, 1920))
                self.assertTrue(45 <= rec["media"]["duration"] <= 90)


class EngineV3(unittest.TestCase):
    def test_word_anchored_sfx_land_on_the_word(self):
        s = {"start": 10.0, "lines": [{"start": 10.5, "words": [{"w": "a", "start": 0.0}, {"w": "guilty", "start": 1.25}]}]}
        self.assertAlmostEqual(fx_time(s, {"at": 0.3}), 10.3)
        self.assertAlmostEqual(fx_time(s, {"at": -0.1, "word": [0, 1]}), 11.65)
        self.assertAlmostEqual(fx_time(s, {"at": -5, "word": [0, 1]}), 10.0)   # never before the scene starts
        self.assertAlmostEqual(fx_time(s, {"at": 0.2, "word": [3, 0]}), 10.2)  # missing line: falls back to scene time

    def test_rig_and_compositor_features_present(self):
        for needle in ["function stateAt", "function blink", "headTurn", "propOpts.aim", "f.walk.stride", "f.show", "silhouette", "rim"]:
            self.assertIn(needle, FIG_JS)
        for needle in ["function camAt", "cam.keys", "function project", "benchDepth", "o.table === false", "fogDepth"]:
            self.assertIn(needle, SETS_JS)
        self.assertGreaterEqual(len(SETS), 12)
        self.assertGreaterEqual(len(POSES), 20)


class StudioQA(unittest.TestCase):
    def _plan(self, caption_y, max_w=None, words=("SOUND-DEADENING",)):
        ep = {"scenes": [{"caption_y": caption_y}], **({"caption_max_w": max_w} if max_w else {})}
        line = {"start": 0.0, "end": 2.0, "text": " ".join(words), "words": [{"w": w, "start": 0.3 * i, "end": 0.3 * i + 0.25} for i, w in enumerate(words)]}
        return {"episode": ep, "timeline": [{"id": "s", "start": 0.0, "end": 2.0, "lines": [line]}]}

    def test_caption_safe_area_catches_old_geometry_and_passes_new(self):
        from pipeline import caption_safe
        self.assertFalse(caption_safe.check(self._plan(1460))["ok"])                 # v2 layout: too low and too wide
        r = caption_safe.check(self._plan(1380, 800))
        self.assertTrue(r["ok"], r)
        self.assertIn("SOUND-DEADENING", r["rows_scaled_to_fit"])                     # a long word is scaled, not clipped
        self.assertTrue(caption_safe.check(self._plan(1380, 800, ("WHAT", "FINALLY", "CAUGHT")))["ok"])

    def test_cinematic_episodes_use_safe_caption_geometry(self):
        for eid in EPS:
            ep = load_episode(eid)
            self.assertEqual(ep["caption_max_w"], 800)
            self.assertTrue(all(s["caption_y"] == 1380 for s in ep["scenes"]))
        self.assertIn("ctx.ep.caption_max_w || 920", (ROOT / "renderer" / "engine.js").read_text())   # older episodes unchanged

    def test_produce_hash_covers_every_render_input(self):
        import importlib.util
        spec = importlib.util.spec_from_file_location("produce_cinematic", SERIES / "produce.py")
        pr = importlib.util.module_from_spec(spec); spec.loader.exec_module(pr)
        h1 = pr.inputs_hash("tcv01-chamberlain", "final", 1)
        self.assertEqual(h1, pr.inputs_hash("tcv01-chamberlain", "final", 1))      # deterministic -> safe resume
        self.assertNotEqual(h1, pr.inputs_hash("tcv01-chamberlain", "final60", 1))  # quality change forces a re-render
        for f in ["renderer/figures.js", "renderer/sets.js", "renderer/engine.js", "pipeline/audio.py", "pipeline/narrate.py"]:
            self.assertIn(f, pr.ENGINE)

    def test_shot_manifest_if_built(self):
        for eid in EPS:
            p = ROOT / "episodes" / eid / "shot_manifest.json"
            if not p.exists():
                continue
            m = json.loads(p.read_text()); ep = load_episode(eid)
            self.assertEqual([r["id"] for r in m["shots"]], [s["id"] for s in ep["scenes"]])
            for r in m["shots"]:
                for k in ["duration", "narration", "caption_timings", "visual_description", "characters", "camera", "sources", "audio", "assets", "validation"]:
                    self.assertIn(k, r, f"{eid}/{r['id']}: {k}")
                self.assertTrue(all(v for v in r["validation"].values()), f"{eid}/{r['id']}: {r['validation']}")
                for c in r["characters"]:
                    self.assertIn(c, ep["figures"])
            self.assertTrue(m["slideshow_risk"]["ok"], m["slideshow_risk"])


class SlateEpisodes(unittest.TestCase):
    """Episodes 04-09: retention devices are present and verifiable, and numbers are spoken as words."""
    SLATE = [e for e in EPS if int(e[3:5]) >= 4]

    def test_fun_facts_and_next_case_hook(self):
        for eid in self.SLATE:
            js = _code(ROOT / "renderer" / "scenes" / f"{eid}.js")
            self.assertGreaterEqual(js.count("type: 'funfact'"), 2, f"{eid}: at least two FUN FACT cards")
            self.assertIn("type: 'nextcase'", js, f"{eid}: end-of-video NEXT CASE hook")

    def test_every_claim_has_two_sources(self):
        for eid in self.SLATE:
            ep = load_episode(eid); ids = {s["id"] for s in ep["sources"]}
            for c in ep["claims"]:
                self.assertGreaterEqual(len(c["sources"]), 2, f"{eid}: {c['id']}")
                self.assertTrue(set(c["sources"]) <= ids, f"{eid}: {c['id']} cites an unknown source")
            used = {c for s in ep["scenes"] for c in s["claims"]}
            self.assertTrue(used <= {c["id"] for c in ep["claims"]}, f"{eid}: scene cites an unknown claim")

    def test_dollar_amounts_are_spoken_as_words(self):
        # Piper reads "$200,000" as "dollar two, hundred thousand": every amount needs a spoken form
        for eid in self.SLATE:
            ep = load_episode(eid); table = {k.lower() for k in (ep["narrator_profile"].get("pronounce") or {})}
            for s in ep["scenes"]:
                for l in s["lines"]:
                    for w in re.findall(r"\$[\d,]+", l["text"]):
                        self.assertIn(w.rstrip(",").lower(), table, f"{eid}: '{w}' has no spoken form")

    def test_ongoing_louvre_case_is_anonymous_and_presumes_innocence(self):
        ep = load_episode("tcv04-louvre-heist"); js = _code(ROOT / "renderer" / "scenes" / "tcv04-louvre-heist.js")
        said = " ".join(l["text"] for s in ep["scenes"] for l in s["lines"]).lower()
        self.assertIn("presumed innocent", said)
        for fid in ep["figures"]:
            self.assertFalse(FIGS[fid]["real_person"], fid)
        self.assertRegex(ep.get("legal_status_verified", ""), r"^\d{4}-\d{2}-\d{2}$")


class NoNewVideosInGit(unittest.TestCase):
    """MP4s are build outputs: delivered in chat and archived in GitHub Releases, not committed (see README)."""
    GRANDFATHERED = {
        "releases/ep001-cash-vs-profit.mp4", "releases/ep002-mars-units.mp4", "releases/ep003-metronome-bridge.mp4",
        "series/true-crime/output/true_crime_01.mp4", "series/true-crime/output/true_crime_02.mp4",
        *[f"series/true-crime-cinematic/output/{f}" for f in (
            "true_crime_01.mp4", "true_crime_02.mp4", "true_crime_d4vd_case.mp4", "true_crime_04_louvre_heist.mp4",
            "true_crime_05_db_cooper.mp4", "true_crime_06_whitey_bulger.mp4", "true_crime_07_gilgo_beach.mp4",
            "true_crime_08_lizzie_borden.mp4", "true_crime_09_agatha_christie.mp4")]}

    def test_no_new_mp4_is_tracked(self):
        import subprocess
        r = subprocess.run(["git", "ls-files", "*.mp4"], cwd=ROOT, capture_output=True, text=True)
        if r.returncode != 0:
            self.skipTest("not a git checkout")
        new = set(r.stdout.split()) - self.GRANDFATHERED
        self.assertFalse(new, f"MP4s must not be committed (archive them in a GitHub Release): {sorted(new)}")


class OngoingCaseSafeguards(unittest.TestCase):
    """The D4vd episode covers a live prosecution: these checks protect the presumption of innocence and the victim."""
    EID = "tcv03-d4vd-case"

    def setUp(self):
        self.ep = load_episode(self.EID)
        self.said = " ".join(l["text"] for s in self.ep["scenes"] for l in s["lines"]).lower()
        self.js = _code(ROOT / "renderer" / "scenes" / f"{self.EID}.js")

    def test_presumption_of_innocence_and_plea_are_stated(self):
        self.assertIn("presumed innocent", self.said)
        self.assertIn("pleaded not guilty", self.said)
        self.assertIn("allege", self.said)                      # the prosecution's account is attributed
        self.assertIn("not a verdict", self.said)              # the holding order is not presented as a conviction

    def test_no_graphic_unverified_or_prejudicial_wording(self):
        banned = ["killer", "murdered her", "he killed", "confess", "chainsaw", "stab", "dismember", "pregnan", "abortion", "tmz",
                  "will seek the death penalty", "trial date was set", "guilty of"]
        for w in banned:
            self.assertNotIn(w, self.said, f"narration: '{w}'")
            self.assertNotIn(w, self.js.lower(), f"on screen: '{w}'")

    def test_no_real_person_is_depicted(self):
        for fid in self.ep["figures"]:
            self.assertFalse(FIGS[fid]["real_person"], f"{fid} is a real person")
        figs = re.findall(r"\{ id: '(\w+)'[^}]*", self.js)
        specs = re.findall(r"\{ id: '\w+'[^\n]*", self.js)
        self.assertTrue(specs)
        for spec in specs:
            self.assertRegex(spec, r"silhouette: '(cool|warm)'", f"figure not anonymised: {spec[:60]}")

    def test_legal_status_is_dated_and_matches_the_dossier(self):
        d = self.ep["legal_status_verified"]
        self.assertRegex(d, r"^\d{4}-\d{2}-\d{2}$")
        self.assertIn(f"Legal status verified on {d}", (ROOT / "episodes" / self.EID / "research.md").read_text())
        for c in self.ep["claims"]:
            self.assertGreaterEqual(len(c["sources"]), 2, c["id"])
            self.assertIn(c.get("nature"), {"fact", "allegation", "defence", "procedure"}, c["id"])
        self.assertIn("october 19th", self.said)   # the cliffhanger is the next scheduled hearing, as reported


if __name__ == "__main__":
    unittest.main()
