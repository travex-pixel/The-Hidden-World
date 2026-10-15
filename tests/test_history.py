"""History documentary profile: schema, timing grammar, subtitles, audio additions, rig/camera maths.
The rig tests run the actual renderer JavaScript in Node (skipped if Node is not installed)."""
import json, shutil, subprocess, sys, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from pipeline.schema import load_episode, validate, EpisodeError  # noqa: E402
from pipeline import history, audio  # noqa: E402

EP = "hist001-medieval-village"


def fake_timeline(ep, per=4.0):
    tl, t = [], 0.0
    for s in ep["scenes"]:
        lines = [{"who": l["who"], "text": l["text"], "start": t + 0.3 + i * 1.2, "end": t + 1.3 + i * 1.2} for i, l in enumerate(s["lines"])]
        dur = max(per, 0.6 + 1.2 * len(lines))
        tl.append({"id": s["id"], "start": t, "end": t + dur, "lines": lines, "music_cue": s["music_cue"]}); t += dur
    return tl


class HistorySchema(unittest.TestCase):
    def setUp(self):
        self.ep = load_episode(EP)

    def test_valid_and_selected_by_profile(self):
        self.assertEqual(self.ep["profile"], "history")
        self.assertTrue(history.is_history(self.ep))
        self.assertFalse(history.is_history(load_episode("ep001-cash-vs-profit")))

    def test_unknown_set_rejected(self):
        bad = json.loads(json.dumps(self.ep)); bad["scenes"][0]["set"] = "spaceship"
        with self.assertRaises(EpisodeError): validate(bad)

    def test_documented_badge_must_cite_established_claim(self):
        bad = json.loads(json.dumps(self.ep))
        sc = next(s for s in bad["scenes"] if any(b["kind"] == "documented" for b in s.get("badges", [])))
        b = next(b for b in sc["badges"] if b["kind"] == "documented")
        est = next(c["id"] for c in bad["claims"] if c["type"] == "estimate")
        b["claim"] = est; sc["claims"].append(est)
        with self.assertRaises(EpisodeError): validate(bad)

    def test_every_non_fiction_scene_shows_its_evidence(self):
        # each scene that makes a factual claim labels at least one of them on screen
        for s in self.ep["scenes"]:
            facts = [c for c in s["claims"] if c != "C12"]
            if facts:
                self.assertTrue(s.get("badges"), f"{s['id']} makes claims but shows no evidence badge")

    def test_fiction_is_labelled(self):
        kinds = {b["kind"] for s in self.ep["scenes"] for b in s.get("badges", [])}
        self.assertIn("dramatised", kinds)

    def test_no_cutting_guide_claim(self):
        # research found no authority for "the cross was a cutting guide"; the script must not say it
        text = " ".join(l["text"].lower() for s in self.ep["scenes"] for l in s["lines"])
        self.assertNotIn("guide", text)

    def test_lines_short_enough_for_subtitles(self):
        for s in self.ep["scenes"]:
            for l in s["lines"]:
                self.assertLessEqual(len(l["text"]), 90)

    def test_chapters_meet_youtube_rules(self):
        tl = fake_timeline(self.ep, per=12)
        from pipeline.publish_history import chapters
        ch = chapters(self.ep, tl)
        self.assertGreaterEqual(len(ch), 3); self.assertEqual(ch[0][0], 0.0)


class Packaging(unittest.TestCase):
    """Mechanical rules from docs/PACKAGING.md, checked on every history episode that has packages."""
    def episodes(self):
        out = []
        for p in sorted((ROOT / "episodes").iterdir()):
            f = p / "episode.json"
            if f.exists():
                ep = json.loads(f.read_text())
                if ep.get("profile") == "history" and ep.get("publishing", {}).get("packages"):
                    out.append(ep)
        return out

    def test_packages_follow_the_rules(self):
        eps = self.episodes(); self.assertGreaterEqual(len(eps), 2)
        for ep in eps:
            pub = ep["publishing"]; thumbs = {t["id"]: t for t in pub["thumbnails"]}
            self.assertLessEqual(len(pub["packages"]), 3, "YouTube Test & Compare takes up to 3")
            for pk in pub["packages"]:
                t = pk["title"]
                self.assertTrue(28 <= len(t) <= 50, f"{ep['id']}: title length {len(t)}: {t}")
                caps = [w for w in t.replace("'", " ").split() if len(w) > 2 and w.isupper()]
                self.assertFalse(caps, f"{ep['id']}: ALL-CAPS words in title {caps}")
                self.assertIn(pk["thumbnail"], thumbs)
                text = thumbs[pk["thumbnail"]]["text"].replace("|", " ")
                self.assertLessEqual(len(text.split()), 3, f"{ep['id']}: thumbnail text too long: {text}")
                tw = {w.strip("?!.,").lower() for w in text.split()}; ttl = {w.strip("?!.,:").lower() for w in t.split()}
                self.assertFalse((tw - {"it", "a", "the", "up"}) <= ttl and len(tw) > 1, f"{ep['id']}: thumbnail text repeats the title")
                self.assertTrue(pk.get("promise") and pk.get("proof"), "every package records its promise and where it is paid off")


class Timing(unittest.TestCase):
    def test_anchor_grammar(self):
        s = {"id": "x", "start": 10.0, "end": 20.0, "lines": [{"start": 11.0, "end": 12.0}, {"start": 13.5, "end": 15.0}]}
        self.assertEqual(history.resolve_at(2, s), 2.0)
        self.assertEqual(history.resolve_at("p0.5", s), 5.0)
        self.assertEqual(history.resolve_at("end-1.5", s), 8.5)
        self.assertEqual(history.resolve_at({"line": 1, "off": 0.5}, s), 4.0)
        with self.assertRaises(ValueError): history.resolve_at({"line": 9}, s)

    def test_sequences_group_consecutive_sets(self):
        ep = load_episode(EP); tl = fake_timeline(ep)
        seqs = history.sequences(ep, tl)
        self.assertEqual([q["set"] for q in seqs], ["cottage", "village", "coin", "village"])
        self.assertEqual(seqs[0]["scenes"], ["s01_wake", "s02_home"])

    def test_srt_cues_ordered_without_overlap(self):
        ep = load_episode(EP); tl = fake_timeline(ep)
        cues = history.subtitles(tl, {"baker_hugh": {"name": "Hugh the Baker"}})
        self.assertEqual(len(cues), sum(len(s["lines"]) for s in ep["scenes"]))
        for a, b in zip(cues, cues[1:]):
            self.assertLessEqual(a["end"], b["start"])
        self.assertTrue(any(c["text"].startswith("HUGH THE BAKER:") for c in cues))
        self.assertEqual(history.srt_time(3723.456), "01:02:03,456")


class HistoryAudio(unittest.TestCase):
    def test_new_cues_and_sfx_render(self):
        tl = [{"start": i * 3.0, "end": (i + 1) * 3.0, "music_cue": c} for i, c in enumerate(["dawn", "village", "market", "problem", "reveal", "resolve", "tease"])]
        m = audio.compose(tl, 21.0, 1)
        self.assertEqual(len(m), int(21.0 * audio.SR)); self.assertGreater(float(abs(m).max()), 0.01)
        for n in ["hen", "creak", "chink", "chop", "churchbell", "anvil", "rustle", "mudstep", "gasp"]:
            x = audio.sfx(n, 1); self.assertGreater(len(x), 1000, n); self.assertLessEqual(float(abs(x).max()), 0.951, n)

    def test_ambience_beds(self):
        for k in ("interior", "village", "market"):
            x = audio.ambience(k, 3.0, 2); self.assertEqual(len(x), 3 * audio.SR); self.assertGreater(float(abs(x).max()), 0.005)

    def test_existing_cues_unchanged_by_history_palette(self):
        # the history cues must not alter the crime/thriller music: same seed -> same samples as a scale-less cue path
        tl = [{"start": 0.0, "end": 6.0, "music_cue": "curious"}, {"start": 6.0, "end": 12.0, "music_cue": "cold"}]
        a = audio.compose(tl, 12.0, 5); b = audio.compose(tl, 12.0, 5)
        self.assertTrue((a == b).all())
        self.assertNotIn("scale", audio.CUES["curious"]); self.assertNotIn("drone", audio.CUES["cold"])


@unittest.skipUnless(shutil.which("node"), "node not installed")
class RigAndCamera(unittest.TestCase):
    """Runs renderer/history/core.js + rig.js + camera maths in Node and checks motion invariants."""
    def node(self, body):
        js = """
const vm = require('vm'), fs = require('fs'); const c = { Math, console }; c.globalThis = c; c.window = c; vm.createContext(c);
for (const f of ['core.js', 'rig.js']) vm.runInContext(fs.readFileSync('%s/renderer/history/' + f, 'utf8'), c);
const R = c.HX.Rig, X = c.HX; const out = (()=>{ %s })(); console.log(JSON.stringify(out));
""" % (ROOT, body)
        r = subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True)
        return json.loads(r.stdout.strip().splitlines()[-1])

    def test_planted_feet_never_slide(self):
        res = self.node("""
          const A = R.compileActor({ id: 'a', x: 100, acts: [{ t: 1, walk: 1300, dur: 6 }, { t: 8, walk: 700, dur: 3 }, { t: 12, walk: 905, dur: 1.4 }] });
          let prev = null, slip = 0, planted = 0;
          for (let t = 0; t < 15; t += 1 / 120) { const w = R.walkAt(A, t); if (!w.feet) { prev = null; continue; }
            if (prev) for (const i of [0, 1]) if (w.lift[i] === 0 && prev.lift[i] === 0) { planted++; slip = Math.max(slip, Math.abs(w.feet[i] - prev.feet[i])); }
            prev = { feet: w.feet.slice(), lift: w.lift.slice() }; }
          return { slip, planted, end: R.walkAt(A, 20).x };""")
        self.assertLess(res["slip"], 1e-6); self.assertGreater(res["planted"], 1000); self.assertAlmostEqual(res["end"], 905, places=6)

    def test_drawn_feet_never_slide(self):
        # the feet as drawn (hip + local offset x character scale) must stay put while planted, including idle sway
        res = self.node("""
          let worst = 0, n = 0;
          for (const [h, z] of [[430, 1], [420, 1.35], [455, 1.04]]) {
            const A = R.compileActor({ id: 'd' + h, x: 100, h, z, acts: [{ t: 1, walk: 1300, dur: 5 }, { t: 8, walk: 700, dur: 3 }] });
            let prev = null;
            for (let t = 0; t < 14; t += 1 / 60) { const s = R.evaluate(A, t, null); const d = [s.x + s.fN * A.K * s.facing, s.x + s.fF * A.K * s.facing], l = [s.liftN, s.liftF];
              if (prev && s.squash === 1 && prev.sq === 1 && s.facing === prev.f) for (const i of [0, 1]) if (l[i] === 0 && prev.l[i] === 0) { n++; worst = Math.max(worst, Math.abs(d[i] - prev.d[i])); }
              prev = { d, l, sq: s.squash, f: s.facing }; } }
          return { worst, n };""")
        self.assertLess(res["worst"], 1e-6); self.assertGreater(res["n"], 2000)

    def test_walk_speed_ramps_smoothly(self):
        res = self.node("""
          const v = []; for (let u = 0; u <= 1.0001; u += 0.01) v.push(R.rampPos(u, 0.28));
          let mono = true; for (let i = 1; i < v.length; i++) if (v[i] < v[i - 1] - 1e-12) mono = false;
          const d = v.slice(1).map((x, i) => x - v[i]); const dd = d.slice(1).map((x, i) => Math.abs(x - d[i]));
          return { start: v[0], end: v[v.length - 1], mono, maxJerk: Math.max(...dd) };""")
        self.assertEqual(res["start"], 0); self.assertAlmostEqual(res["end"], 1, places=9); self.assertTrue(res["mono"]); self.assertLess(res["maxJerk"], 0.002)

    def test_leg_ik_preserves_bone_lengths(self):
        res = self.node("""
          let worst = 0; for (const [fx, fy] of [[0, -36], [180, -36], [-150, -60], [400, -36], [20, -300]]) {
            const r = R.ik2(0, -490, fx, fy); const a = Math.hypot(r.knee[0], r.knee[1] + 490), b = Math.hypot(r.foot[0] - r.knee[0], r.foot[1] - r.knee[1]);
            worst = Math.max(worst, Math.abs(a - 232), Math.abs(b - 226)); } return { worst };""")
        self.assertLess(res["worst"], 1e-6)

    def test_rig_is_deterministic(self):
        res = self.node("""
          const mk = () => R.compileActor({ id: 'b', x: 0, acts: [{ t: 0.5, walk: 800, dur: 3 }, { t: 1, expr: 'happy' }, { t: 2, gesture: 'wave' }] });
          const a = R.evaluate(mk(), 1.73, null), b = R.evaluate(mk(), 1.73, null);
          return { same: JSON.stringify(a) === JSON.stringify(b) };""")
        self.assertTrue(res["same"])


class EngineV3(unittest.TestCase):
    """Expressions, acting layer, Kokoro delivery and mix v2 (engine v3)."""
    node = RigAndCamera.node

    def test_schema_lists_match_rig_and_voice(self):
        from pipeline.schema import RIG_EXPRESSIONS, KOKORO_TONES
        from pipeline import kokoro
        names = self.node("return Object.keys(R.EXPR);")
        self.assertEqual(set(names), RIG_EXPRESSIONS)
        self.assertEqual(set(kokoro.DELIVERY), KOKORO_TONES)

    def test_every_expression_carries_every_control(self):
        res = self.node("""const keys = Object.keys(R.EXPR.neutral); return Object.entries(R.EXPR).filter(([k, v]) => Object.keys(v).length !== keys.length).map(([k]) => k);""")
        self.assertEqual(res, [])

    def test_expression_change_blinks_and_eyes_dart(self):
        res = self.node("""
          const A = R.compileActor({ id: 'a', x: 0, acts: [{ t: 2, expr: 'angry' }] });
          const b = R.evaluate(A, 2.05, null).blink, far = R.evaluate(A, 4.0, null);
          const darts = new Set(); for (let t = 0; t < 12; t += 0.5) darts.add(R.evaluate(A, t, null).dart.map(v => v.toFixed(3)).join(','));
          return { b, tilt: far.E.tilt, darts: darts.size };""")
        self.assertGreater(res["b"], 0.5)
        self.assertGreater(res["darts"], 3)

    def test_unknown_expression_and_tone_are_rejected(self):
        ep = load_episode("hist002-peasant-day")
        ep["scenes"][1]["actors"][0]["acts"].append({"t": 1, "expr": "furious"})
        ep["scenes"][1]["lines"][0]["tone"] = "whisper"
        with self.assertRaises(EpisodeError) as cm:
            validate(ep)
        self.assertIn("furious", str(cm.exception)); self.assertIn("tone", str(cm.exception))

    def test_sentence_split_and_pronunciation(self):
        from pipeline.narrate import split_sentences, tts_text
        self.assertEqual(split_sentences("Bread. Cheese. Bacon, if you were lucky. And ale."), ["Bread.", "Cheese.", "Bacon, if you were lucky.", "And ale."])
        self.assertEqual(tts_text({"pronounce": {"1331": "thirteen thirty-one", "St Albans": "Saint Albans"}}, "In 1331, the abbot of St Albans"),
                         "In thirteen thirty-one, the abbot of Saint Albans")

    def test_mix_keeps_voice_clear_of_the_bed(self):
        import numpy as np
        from pipeline import mixdown
        sr = 24000; t = np.arange(int(3 * sr)) / sr
        voice = (0.1 * np.sin(2 * np.pi * 180 * t) * (0.6 + 0.4 * np.sin(2 * np.pi * 4 * t))).astype(np.float32)
        music = (0.3 * np.sin(2 * np.pi * 440 * np.arange(int(8 * audio.SR)) / audio.SR)).astype(np.float32)   # deliberately loud
        mixed, st = mixdown.master_mix(8.0, [(2.0, voice, sr)], music, np.zeros_like(music), [], seed=1)
        r = mixdown.voice_to_bed(st["voice"], st["bed"])
        self.assertEqual(mixed.shape[1], 2)
        self.assertGreaterEqual(r["median_db"], 20.0)
        self.assertLess(float(np.max(np.abs(mixed))), 1.0)

    def test_fft_resample_keeps_pitch_and_length(self):
        import numpy as np
        from pipeline.mixdown import fft_resample
        sr = 24000; x = np.sin(2 * np.pi * 1000 * np.arange(sr) / sr).astype(np.float32)
        y = fft_resample(x, sr, 44100)
        self.assertEqual(len(y), 44100)
        f = np.fft.rfftfreq(len(y), 1 / 44100)[np.argmax(np.abs(np.fft.rfft(y)))]
        self.assertAlmostEqual(f, 1000, delta=2)


if __name__ == "__main__":
    unittest.main()


class WhatIf(unittest.TestCase):
    """What-If 001: speculation is always labelled, and the on-screen arithmetic is right."""
    def setUp(self):
        self.ep = load_episode("whatif001-modern-knowledge")

    def test_hypothetical_badge_needs_no_claim_but_is_a_known_kind(self):
        ok = json.loads(json.dumps(self.ep)); ok["scenes"][0]["badges"].append({"kind": "hypothetical", "text": "a guess", "at": 1.0})
        validate(ok)
        bad = json.loads(json.dumps(self.ep)); bad["scenes"][0]["badges"].append({"kind": "speculative", "text": "x", "at": 1.0})
        with self.assertRaises(EpisodeError): validate(bad)

    def test_alternate_history_is_labelled_for_the_whole_branch(self):
        branch = next(s for s in self.ep["scenes"] if s["set"] == "alt_town" and s.get("beats", {}).get("stage1") is not None)
        hyp = [b for b in branch["badges"] if b["kind"] == "hypothetical"]
        self.assertTrue(hyp and hyp[0]["dur"] >= 60, "the branch must carry a HYPOTHETICAL label from start to end")
        self.assertIn("W18", branch["claims"])
        self.assertEqual(next(c for c in self.ep["claims"] if c["id"] == "W18")["type"], "illustrative")

    def test_fiction_and_disputes_are_labelled(self):
        kinds = {b["kind"] for s in self.ep["scenes"] for b in s.get("badges", [])}
        for k in ("dramatised", "hypothetical", "disputed", "estimate", "documented"):
            self.assertIn(k, kinds)

    def test_no_myths_in_the_script(self):
        text = " ".join(l["text"].lower() for s in self.ep["scenes"] for l in s["lines"])
        for myth in ("witch-hunt", "witch hunt", "burned at the stake", "forty days in 1377", "rats alone", "first cannon"):
            self.assertNotIn(myth, text)

    def test_ledger_sums_are_correct(self):
        import re
        src = (ROOT / "renderer" / "history" / "sets" / "medieval.js").read_text()
        block = src[src.index("X.SETS.ledger_insert"):src.index("X.SETS.smithy")]
        rom = re.findall(r"'([MDCLXVI]+)'", block); arab = [int(x) for x in re.findall(r"'(\d+)'", block)]
        val = {"M": 1000, "D": 500, "C": 100, "L": 50, "X": 10, "V": 5, "I": 1}
        def roman(s):
            n = 0
            for i, ch in enumerate(s):
                v = val[ch]; n += -v if i + 1 < len(s) and val[s[i + 1]] > v else v
            return n
        self.assertEqual(len(rom), 5); self.assertEqual(len(arab), 5)
        self.assertEqual([roman(r) for r in rom], arab, "each Roman figure matches its Hindu-Arabic twin")
        self.assertEqual(sum(arab[:4]), arab[4], "the column adds up")


class EngineV4(unittest.TestCase):
    """What-If 003: several set modules per episode, world landmark sets, animals, richer faces, new effects."""
    def setUp(self):
        self.ep = load_episode("whatif003-gravity-off")
        self.rig = (ROOT / "renderer" / "history" / "rig.js").read_text()
        self.world = (ROOT / "renderer" / "history" / "sets" / "world.js").read_text()
        self.fx = (ROOT / "renderer" / "history" / "fx.js").read_text()

    def test_episode_loads_several_set_modules_that_exist(self):
        mods = self.ep["set_module"]
        self.assertIsInstance(mods, list); self.assertGreaterEqual(len(mods), 2)
        for m in mods: self.assertTrue((ROOT / m).exists(), m)

    def test_world_sets_are_registered_and_defined(self):
        from pipeline.schema import HISTORY_SETS
        for name in ("times_square", "sydney_harbour", "golden_gate", "london_bigben", "uluru", "kitchen_insert", "space_moon"):
            self.assertIn(name, HISTORY_SETS); self.assertIn(f"X.SETS.{name} =", self.world)
        used = {s["set"] for s in self.ep["scenes"]}
        self.assertTrue(used <= HISTORY_SETS, used - HISTORY_SETS)

    def test_new_expressions_exist_in_schema_and_rig(self):
        from pipeline.schema import RIG_EXPRESSIONS
        for e in ("scream", "panic", "dizzy", "ecstatic", "dazed", "gleeful"):
            self.assertIn(e, RIG_EXPRESSIONS); self.assertRegex(self.rig, rf"\n\s+{e}:\s+\{{")
        for ctrl in ("arc: 0", "spiral: 0", "shout: 0"):
            self.assertIn(ctrl, self.rig)

    def test_animals_marks_and_effects_are_exported(self):
        for a in ("dog", "cat", "kangaroo", "emu", "pigeon"): self.assertIn(f"function {a}(g, t, o)", self.rig)
        self.assertIn("kangaroo, emu, pigeon, walkFeet", self.rig)
        for m in ("shock", "hearts", "question", "stars", "zzz", "anger"): self.assertIn(f"'{m}'", self.rig)
        for f in ("rain", "lightning", "fireworks", "snow", "fogBank", "lensFlare", "waves", "confetti"): self.assertIn(f"function {f}(g, t, o)", self.fx)
        self.assertIn("fogBank, lensFlare, waves, confetti }", self.fx)

    def test_speculation_is_labelled_and_the_scenario_is_declared_fiction(self):
        kinds = {b["kind"] for s in self.ep["scenes"] for b in s.get("badges", [])}
        for k in ("dramatised", "estimate", "hypothetical", "documented"): self.assertIn(k, kinds)
        ours = [c for c in self.ep["claims"] if c["type"] == "estimate"]
        self.assertTrue(all("Our calculation" in c["text"] for c in ours), "every estimate says it is our own arithmetic")
        self.assertIn("cannot switch off", self.ep["fiction_notice"])

    def test_gravity_scenes_carry_lift_beats(self):
        for s in self.ep["scenes"]:
            if s["set"] in ("times_square", "sydney_harbour", "golden_gate", "london_bigben", "uluru"):
                self.assertIn("lift", s.get("beats", {}), s["id"])


class EngineV5(unittest.TestCase):
    """What-If 004: the walking Statue of Liberty, hero landmarks, modern clothes, framing rules learned from QA."""
    def setUp(self):
        self.ep = load_episode("whatif004-liberty-walks")
        self.lib = (ROOT / "renderer" / "history" / "sets" / "liberty.js").read_text()
        self.rig = (ROOT / "renderer" / "history" / "rig.js").read_text()
        self.world = (ROOT / "renderer" / "history" / "sets" / "world.js").read_text()

    def test_liberty_sets_are_registered_and_defined(self):
        from pipeline.schema import HISTORY_SETS
        for name in ("liberty_island_night", "liberty_island_day", "ny_harbor", "paris_1884", "atlantic_map", "sea_shelf", "deep_titanic",
                     "ridge_vents", "mont_saint_michel", "paris_arc", "paris_eiffel", "ile_aux_cygnes", "landmark_lineup"):
            self.assertIn(name, HISTORY_SETS)
        for name in ("ny_harbor", "paris_1884", "atlantic_map", "sea_shelf", "deep_titanic", "ridge_vents", "mont_saint_michel", "paris_arc", "paris_eiffel", "ile_aux_cygnes", "landmark_lineup"):
            self.assertIn(f"X.SETS.{name} =", self.lib)
        self.assertIn("X.SETS.liberty_island_night = libertyIsland('night')", self.lib)
        used = {s["set"] for s in self.ep["scenes"]}
        self.assertTrue(used <= HISTORY_SETS, used - HISTORY_SETS)
        self.assertIn("renderer/history/sets/liberty.js", self.ep["set_module"])

    def test_tablet_reads_1776_and_is_fitted(self):
        # the blind review caught the date clipped to MDCCLXXV (1775); the text must be the real date and shrink to fit
        self.assertIn("fillText('MDCCLXXVI'", self.lib)
        self.assertIn("measureText('MDCCLXXVI').width", self.lib)
        self.assertIn("JULY IV", self.lib)

    def test_statue_is_an_actor_kind_with_its_own_channels(self):
        self.assertIn("X.Rig.liberty = drawLiberty", self.lib)
        for ch in ("'alive'", "'arm'", "'kneel'", "'wave'", "'tilt'", "'glow'"):
            self.assertIn(ch, self.lib)
        statues = [a for s in self.ep["scenes"] for a in s.get("actors", []) if a.get("kind") == "liberty"]
        self.assertGreaterEqual(len(statues), 10)
        self.assertTrue(all(a.get("palette", "verdigris") in ("verdigris", "copper", "bronze", "sea", "deep") for a in statues))

    def test_modern_outfit_is_opt_in(self):
        self.assertIn("outfit: r.outfit || 'tunic'", self.rig)
        self.assertIn("spec: o.modern ? modernise(extraSpec(r, o), r) : extraSpec(r, o)", self.world)
        for c in ("ranger_dee", "tourist_tony"):
            spec = json.loads((ROOT / "characters" / f"{c}.json").read_text())
            self.assertEqual(spec["rig"]["outfit"], "modern")
            self.assertTrue(spec["kokoro"]["voice"].startswith("a"), "American voices for New Yorkers")

    def test_liberty_crowds_never_float_and_stay_at_the_edges(self):
        # crowds once stood in front of the landmarks; in this module every crowd goes through edgeCrowds
        self.assertNotRegex(self.lib, r"WD\.crowd\(set, \{ n:")
        self.assertIn("rise: false", self.lib)

    def test_claims_estimates_and_fiction(self):
        kinds = {b["kind"] for s in self.ep["scenes"] for b in s.get("badges", [])}
        for k in ("documented", "estimate", "hypothetical", "dramatised", "disputed"): self.assertIn(k, kinds)
        ours = [c for c in self.ep["claims"] if c["type"] == "estimate"]
        self.assertTrue(ours and all("Our calculation" in c["text"] for c in ours))
        self.assertIn("statues cannot walk", self.ep["fiction_notice"])
        self.assertTrue((ROOT / "episodes" / "whatif004-liberty-walks" / "research.md").exists())

    def test_walking_speed_estimate_arithmetic(self):
        import math
        v = math.sqrt(0.25 * 9.81 * 18.0)               # Froude 0.25, 18 m leg
        self.assertAlmostEqual(v * 3.6, 24, delta=0.6)  # ~24 km/h
        self.assertAlmostEqual(5837 / (v * 3.6) / 24, 10, delta=0.4)   # ~10 days
        self.assertAlmostEqual(3800 / 10, 380)          # ~380 atm at the Titanic

    def test_titles_and_thumbnails_follow_packaging_rules(self):
        pub = self.ep["publishing"]
        for t in pub["titles"]: self.assertTrue(28 <= len(t) <= 50, t)
        for th in pub["thumbnails"]: self.assertLessEqual(len(th["text"].replace("|", " ").split()), 3)
