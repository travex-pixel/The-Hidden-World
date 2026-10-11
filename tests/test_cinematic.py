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
            for fid in re.findall(r"\bid: '(\w+)'", js):
                self.assertIn(fid, ep["figures"], f"{eid}: shot uses {fid}, which is not in the episode's figures")
            for p in re.findall(r"\bpose: '(\w+)'", js) + re.findall(r"\? 'sit_type' : '(\w+)'", js):
                self.assertIn(p, POSES, f"{eid}: unknown pose {p}")
            for x in re.findall(r"\bexpr: '(\w+)'", js):
                self.assertIn(x, EXPRS, f"{eid}: unknown expression {x}")
            local = set(re.findall(r"E\.sets\.(\w+) =", js))
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
            self.assertRegex(e["file"], r"^true_crime_0\d\.mp4$")
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


if __name__ == "__main__":
    unittest.main()
