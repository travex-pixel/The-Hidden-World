// Evaluate every frame of a plan without screenshots, to catch shot-code errors in seconds instead of mid-render.
// usage: node pipeline/dryrun.mjs out/<id>/plan.json [step_frames=1]
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const [planPath, stepArg] = process.argv.slice(2);
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
const step = parseInt(stepArg || '1', 10);
const browser = await chromium.launch({ args: ['--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: plan.width, height: plan.height } });
await page.goto(pathToFileURL(resolve(here, '../renderer/index.html')).href);
await page.addScriptTag({ path: resolve(here, '..', plan.scenes_js) });
await page.evaluate(({ episode, timeline, seed, visual, art, cast }) => window.HW.setup(episode, timeline, seed, visual, art, cast), plan);
const total = plan.timeline[plan.timeline.length - 1].end, n = Math.ceil(total * plan.fps);
const errors = await page.evaluate(({ n, fps, step }) => {
  const out = [];
  for (let i = 0; i < n; i += step) { const t = i / fps; try { window.HW.frame(t); } catch (e) { out.push(`${t.toFixed(3)}s: ${e.message}`); if (out.length > 20) break; } }
  return out;
}, { n, fps: plan.fps, step });
await browser.close();
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`dryrun ok: ${Math.ceil(n / step)} frames evaluated`);
