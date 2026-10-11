// Render individual frames as PNG for visual inspection. usage: node pipeline/stills.mjs plan.json outdir t1 t2 ...
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const [planPath, outDir, ...times] = process.argv.slice(2);
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ args: ['--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: plan.width, height: plan.height } });
page.on('pageerror', e => { console.error('[page error]', e.message); process.exitCode = 1; });
const url = pathToFileURL(resolve(here, '..', plan.page || 'renderer/index.html')).href + (plan.page ? `?w=${plan.width}&h=${plan.height}` : '');
await page.goto(url);
await page.addScriptTag({ path: resolve(here, '..', plan.scenes_js) });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(({ episode, timeline, seed, visual, art, cast }) => window.HW.setup(episode, timeline, seed, visual, art, cast), plan);
if (process.env.CLEAN) await page.evaluate(() => { window.HW.clean = true; });
const probes = {};
for (const ts of times) {
  const t = parseFloat(ts); const t0 = Date.now();
  await page.evaluate(async t => { window.HW.frame(t); await window.HW.ready(); }, t);
  await page.screenshot({ path: resolve(outDir, `t${t.toFixed(2)}.png`) });
  if (plan.page) probes[t] = await page.evaluate(t => window.HW.probe ? window.HW.probe(t) : null, t);
  console.log('still', t, `${Date.now() - t0}ms`);
}
if (plan.page) writeFileSync(resolve(outDir, 'probes.json'), JSON.stringify(probes, null, 1));
await browser.close();
