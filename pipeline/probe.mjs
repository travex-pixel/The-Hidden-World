// Sample the deterministic history renderer model (camera + rigs) without drawing, for automated QA.
// usage: node pipeline/probe.mjs plan.json out.json [rate=30]
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const [planPath, outPath, rateS] = process.argv.slice(2); const rate = +(rateS || 30);
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
const browser = await chromium.launch({ args: ['--disable-gpu'] });
const page = await browser.newPage({ viewport: { width: 320, height: 180 } });
page.on('pageerror', e => { console.error('[page error]', e.message); process.exitCode = 1; });
await page.goto(pathToFileURL(resolve(here, '..', plan.page)).href + '?w=320&h=180');
await page.addScriptTag({ path: resolve(here, '..', plan.scenes_js) });
await page.evaluate(({ episode, timeline, seed, visual, art, cast }) => window.HW.setup(episode, timeline, seed, visual, art, cast), plan);
const total = plan.timeline[plan.timeline.length - 1].end;
const samples = await page.evaluate(({ total, rate }) => {
  const out = []; for (let i = 0; i < Math.round(total * rate); i++) { const t = i / rate; out.push({ t, cam: window.HW.cameraAt(t), actors: window.HW.probe(t) }); } return out;
}, { total, rate });
writeFileSync(outPath, JSON.stringify({ rate, samples }));
await browser.close();
console.log(`[probe] ${samples.length} samples -> ${outPath}`);
