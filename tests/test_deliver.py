"""Phone delivery page (documentary/deliver.py): chunks reassemble byte-exactly, publish batches respect the
artifact limits, and the page carries the right file facts."""
import hashlib
import json
import os
import re
import tempfile
import unittest
from pathlib import Path

from documentary import deliver


class DeliverTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); self.d = Path(self.tmp.name)
        self.src = self.d / "film.mp4"; self.src.write_bytes(os.urandom(3_100_000))

    def tearDown(self):
        self.tmp.cleanup()

    def test_chunks_reassemble_and_batches_fit(self):
        out = self.d / "page"
        plan = deliver.prepare(self.src, out, "My Film", "sub", "my-film.mp4", "Draft", chunk=1_000_000)
        self.assertEqual(len(plan["chunks"]), 4)
        data = b"".join((out / c["source"]).read_bytes() for c in plan["chunks"])
        self.assertEqual(hashlib.sha256(data).hexdigest(), hashlib.sha256(self.src.read_bytes()).hexdigest())
        self.assertEqual(plan["sha256"], hashlib.sha256(self.src.read_bytes()).hexdigest())
        for c in plan["chunks"]:
            self.assertTrue(c["published"].endswith(".mp4"))   # .bin is not a served type on the artifact host
        flat = [f["published"] for b in plan["batches"] for f in b]
        self.assertEqual(flat, [c["published"] for c in plan["chunks"]])
        self.assertTrue(all(sum(c["bytes"] for c in plan["chunks"] if c["published"] in {f["published"] for f in b}) <= deliver.PUBLISH_MAX
                            for b in plan["batches"]))
        self.assertEqual(json.loads((out / "publish-plan.json").read_text())["bytes"], 3_100_000)

    def test_page_facts_and_no_placeholders(self):
        out = self.d / "page"
        plan = deliver.prepare(self.src, out, "My <Film>", "sub", "my-film.mp4", "Draft", chunk=1_000_000)
        page = (out / "index.html").read_text()
        self.assertNotIn("{{", page)
        self.assertIn('const TOTAL = 3100000;', page)
        self.assertIn('const CHUNK = 1000000;', page)
        self.assertIn('const NAME = "my-film.mp4";', page)
        self.assertIn(plan["sha256"], page)
        self.assertIn("My &lt;Film&gt;", page)                 # title is escaped
        self.assertIn('claude.use("downloads")', page)          # saves through the downloads capability
        self.assertIn("Works in the Claude app", page)          # small file: no Chrome-only warning
        self.assertEqual(re.findall(r'"c/c" \+ String\(i\)\.padStart\(2, "0"\) \+ "\.mp4"', page).__len__(), 1)

    def test_big_file_warns_about_the_app(self):
        out = self.d / "page"
        old = deliver.APP_SAVE_MAX
        try:
            deliver.APP_SAVE_MAX = 1_000_000
            deliver.prepare(self.src, out, "T", "s", "f.mp4", "Draft", chunk=1_000_000)
        finally:
            deliver.APP_SAVE_MAX = old
        self.assertIn("Chrome", (out / "index.html").read_text())

    def test_refuses_files_over_the_version_limit(self):
        old = deliver.VERSION_MAX
        try:
            deliver.VERSION_MAX = 2_000_000
            with self.assertRaises(SystemExit):
                deliver.prepare(self.src, self.d / "page", "T", "s", "f.mp4", "Draft", chunk=1_000_000)
        finally:
            deliver.VERSION_MAX = old


if __name__ == "__main__":
    unittest.main()
