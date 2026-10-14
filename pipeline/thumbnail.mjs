// Render episode thumbnails with the history renderer's rig and artwork.
// usage: node pipeline/thumbnail.mjs <plan.json> <outdir>   (reads plan.episode.publishing.thumbnails)
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const [planPath, outDir] = process.argv.slice(2);
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
const specs = (plan.episode.publishing || {}).thumbnails || [];
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ args: ['--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', e => { console.error('[page error]', e.message); process.exitCode = 1; });
await page.goto(pathToFileURL(resolve(here, '..', 'renderer/history/index.html')).href + '?w=1280&h=720');
for (const f of [].concat(plan.scenes_js)) await page.addScriptTag({ path: resolve(here, '..', f) });
await page.addScriptTag({ path: resolve(here, '..', 'renderer/history/thumbnail.js') });
for (const s of specs) {
  if (s.character) s.character.engine_version = plan.episode.engine_version;
  await page.evaluate(async ({ s, cast, seed }) => window.THUMB.render(s, cast, seed), { s, cast: plan.cast, seed: plan.seed });
  const out = resolve(outDir, `thumbnail_${s.id}.jpg`);
  await page.locator('#c').screenshot({ path: out, type: 'jpeg', quality: 92 });
  console.log('thumbnail', out);
}
await browser.close();
