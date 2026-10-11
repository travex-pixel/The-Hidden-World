import json, os, re, subprocess, sys, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from pipeline.schema import load_episode  # noqa: E402

SDIR = ROOT / "series" / "five-messages"


def cfg():
    return json.loads((SDIR / "series.json").read_text())


def eps():
    return [load_episode(e["id"]) for e in cfg()["episodes"]]


def shots(ep, scene_type=None):
    return [s for s in ep["scenes"] if scene_type is None or s["scene"] == scene_type]


class SeriesStructure(unittest.TestCase):
    def test_five_episodes_named_correctly(self):
        c = cfg()
        self.assertEqual([e["n"] for e in c["episodes"]], [1, 2, 3, 4, 5])
        self.assertEqual([e["file"] for e in c["episodes"]], [f"episode_0{i}.mp4" for i in range(1, 6)])
        for e in c["episodes"]:
            self.assertTrue((ROOT / "episodes" / e["id"] / "episode.json").exists(), e["id"])
            self.assertTrue(e["title"] and len(e["youtube_title"]) <= 100)

    def test_every_episode_hooks_immediately(self):
        for ep in eps():
            first = ep["scenes"][0]; sh = first.get("shot", {})
            events = [sh.get("phone_toast", {}).get("at", 99)] + [m["at"] for m in sh.get("phone", {}).get("messages", [])]
            if first.get("lines"):
                events.append(first["lines"][0].get("pause_before", 0))
            self.assertLessEqual(min(events), 0.5, f"{ep['id']}: nothing happens in the first half-second")

    def test_every_episode_ends_with_a_card(self):
        for ep in eps():
            self.assertIn("end_card", ep["scenes"][-1]["shot"], ep["id"])

    def test_cast_is_the_shared_cast(self):
        for ep in eps():
            for s in ep["scenes"]:
                for a in s.get("shot", {}).get("actors", []):
                    self.assertIn(a["who"], {"mara", "theo", "priya", "celeste"})


class Continuity(unittest.TestCase):
    def test_the_ring(self):
        e = eps()
        for n in (0, 2, 4):
            rings = [s for s in shots(e[n], "insert_hand") if s["shot"]["hand"].get("ring") and s["shot"]["hand"]["who"] == "celeste"]
            self.assertTrue(rings, f"episode {n + 1} must show Celeste's ring")
        self.assertTrue(any(s["shot"]["hand"].get("action") == "remove" for s in shots(e[4], "insert_hand")), "finale removes the ring")

    def test_nine_fifteen(self):
        e = eps()
        for n in (0, 4):
            clocks = [s["shot"]["clock"] for s in e[n]["scenes"] if "clock" in s.get("shot", {})]
            self.assertTrue(any(c.get("to") == "9:15" and "flip_at" in c for c in clocks), f"episode {n + 1}: 9:15 flip")

    def test_the_linden(self):
        e = eps()
        self.assertIn("The Linden", json.dumps(e[1]["scenes"]))
        self.assertTrue(any(s["shot"].get("env") == "restaurant_window" for s in shots(e[2], "stage")))
        self.assertIn("The Linden", json.dumps(e[4]["scenes"]))

    def test_theo_wardrobe(self):
        for ep in eps():
            for s in ep["scenes"]:
                for a in s.get("shot", {}).get("actors", []):
                    if a["who"] == "theo":
                        self.assertEqual(a.get("outfit"), "shirt_sleeves", f"{ep['id']}/{s['id']}: Theo is suspended all season")

    def test_unknown_sender_styling(self):
        for ep in eps():
            for s in shots(ep, "phone_thread"):
                self.assertEqual(s["shot"]["phone"]["contact"], "Unknown", f"{ep['id']}/{s['id']}")

    def test_fair_play_clue(self):
        e = eps()
        ep1_msgs = " ".join(m["text"] for s in shots(e[0], "phone_thread") for m in s["shot"]["phone"]["messages"])
        ep2_lines = " ".join(l["text"] for s in e[1]["scenes"] for l in s.get("lines", []) if l["who"] == "theo")
        self.assertIn("ask Priya who she told", ep1_msgs)
        self.assertIn("ask Priya who she told", ep2_lines)

    def test_reveals_are_not_spoiled_early(self):
        e = eps()
        for n in (0, 1):  # the sender's identity must not be spoken before episode 4
            spoken = " ".join(l["text"] for s in e[n]["scenes"] for l in s.get("lines", []))
            self.assertNotIn("Theo sent", spoken)
        early = " ".join(l["text"] for ep in e[:2] for s in ep["scenes"] for l in s.get("lines", []))
        self.assertNotIn("Celeste", early.replace("Celeste Arden", ""), "Celeste is named as the culprit only in episode 3")


class Uploader(unittest.TestCase):
    def test_public_requires_confirmation(self):
        env = {k: v for k, v in os.environ.items() if k != "HW_CONFIRM_PUBLIC"}
        r = subprocess.run([sys.executable, "-m", "pipeline.youtube_upload", "series/five-messages", "--privacy", "public", "--dry-run"], cwd=ROOT, capture_output=True, text=True, env=env)
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("PUBLISH", r.stderr + r.stdout)

    def test_missing_secrets_fail_cleanly_without_echoing(self):
        env = {k: v for k, v in os.environ.items() if not k.startswith("YT_")}
        env["YT_CLIENT_SECRET"] = "s3cr3t-value-should-not-print"
        r = subprocess.run([sys.executable, "-m", "pipeline.youtube_upload", "series/five-messages", "--episodes", "1"], cwd=ROOT, capture_output=True, text=True, env=env)
        out = r.stdout + r.stderr
        self.assertNotIn("s3cr3t-value-should-not-print", out)
        if (SDIR / "output" / "episode_01.mp4").exists():
            self.assertIn("Missing secrets", out)

    def test_metadata(self):
        from pipeline.youtube_upload import build_metadata, ref_tag
        c = cfg()
        for ep in c["episodes"]:
            m = build_metadata(c, ep, "a" * 64, "five-messages")
            self.assertLessEqual(len(m["snippet"]["title"]), 100)
            self.assertEqual(m["status"]["privacyStatus"], "private")
            self.assertIn(ref_tag("five-messages", ep["id"], "a" * 64), m["snippet"]["description"])
            self.assertIn("Fictional", m["snippet"]["description"])


class Manifest(unittest.TestCase):
    def test_verified_entries_are_complete(self):
        mp = SDIR / "manifest.json"
        if not mp.exists():
            self.skipTest("no manifest yet")
        m = json.loads(mp.read_text())
        for k, v in m["episodes"].items():
            if v.get("status") == "verified":
                self.assertRegex(v["file"], r"^episode_0[1-5]\.mp4$")
                self.assertEqual(len(v["sha256"]), 64)
                self.assertGreater(v["size_bytes"], 1_000_000)
                self.assertEqual((v["width"], v["height"]), (1080, 1920))
                self.assertTrue(v["qa"]["all_passed"])
