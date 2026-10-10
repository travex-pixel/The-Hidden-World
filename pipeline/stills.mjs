// Render individual frames as PNG for visual inspection. usage: node pipeline/stills.mjs plan.json outdir t1 t2 ...
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const [planPath, outDir, ...times] = process.argv.slice(2);
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ args: ['--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: plan.width, height: plan.height } });
page.on('pageerror', e => { console.error('[page error]', e.message); process.exitCode = 1; });
await page.goto(pathToFileURL(resolve(here, '../renderer/index.html')).href);
await page.addScriptTag({ path: resolve(here, '..', plan.scenes_js) });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(({ episode, timeline, seed }) => window.HW.setup(episode, timeline, seed), plan);
for (const ts of times) { const t = parseFloat(ts); await page.evaluate(t => window.HW.frame(t), t); await page.screenshot({ path: resolve(outDir, `t${t.toFixed(2)}.png`) }); console.log('still', t); }
await browser.close();
