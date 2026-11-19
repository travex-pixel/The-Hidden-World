import json
import unittest
from pathlib import Path

from copycat import mapper, whitelist

ROOT = Path(__file__).resolve().parent.parent


class WhitelistMode(unittest.TestCase):
    def test_ep01_only_whitelisted_and_unique_crops(self):
        edit, rep = mapper.run("naruto-whatif-ep01", False, write=False)
        self.assertEqual(rep["non_whitelisted_stills"], [])
        self.assertEqual(rep["non_whitelisted_insert_bgs"], [])
        self.assertEqual(rep["unmatched_cuts"], [])
        self.assertEqual(rep["repeated_asset_crop"], 0)
        self.assertLessEqual(rep["max_uses_of_one_asset"], 4)

    def test_expression_inference(self):
        self.assertEqual(whitelist.infer_expression("wet, raw"), "sad_cry")
        self.assertEqual(whitelist.infer_expression("slow grin"), "grin")

    def test_grades_change_pixels(self):
        import numpy as np
        from copycat.vfx import GRADES
        im = (np.random.default_rng(1).random((32, 32, 3)) * 255).astype("uint8")
        for g in GRADES.values():
            self.assertEqual(g(im).shape, im.shape)
            self.assertFalse((g(im) == im).all())


if __name__ == "__main__":
    unittest.main()
