// Frame renderer: loads renderer/index.html in headless Chromium, renders every frame deterministically,
// and pipes PNG frames into ffmpeg to produce a silent H.264 video.
// usage: node pipeline/render.mjs <plan.json> <out_silent.mp4>
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const [planPath, outPath] = process.argv.slice(2);
if (!planPath || !outPath) { console.error('usage: node render.mjs plan.json out.mp4'); process.exit(2); }
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
const { width, height, fps, seed, timeline, episode, scenes_js } = plan;
const total = timeline[timeline.length - 1].end;
const nFrames = Math.round(total * fps);

const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-gpu'] });
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
page.on('pageerror', e => { console.error('[page error]', e.message); process.exitCode = 1; });
await page.goto(pathToFileURL(resolve(here, '../renderer/index.html')).href);
await page.addScriptTag({ path: resolve(here, '..', scenes_js) });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(({ episode, timeline, seed, visual, art }) => window.HW.setup(episode, timeline, seed, visual, art), { episode, timeline, seed, visual: plan.visual, art: plan.art });

const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-an',
  '-c:v', 'libx264', '-preset', plan.preset || 'medium', '-crf', String(plan.crf ?? 20), '-pix_fmt', 'yuv420p', '-r', String(fps), outPath], { stdio: ['pipe', 'inherit', 'inherit'] });
const ffDone = new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg exit ' + c))));

const t0 = Date.now(); let lastScene = -1;
for (let i = 0; i < nFrames; i++) {
  const t = i / fps;
  const sceneIdx = await page.evaluate(async t => { const i = window.HW.frame(t); await window.HW.ready(); return i; }, t);
  if (sceneIdx !== lastScene) { console.log(`[render] scene ${sceneIdx + 1}/${timeline.length} (${timeline[sceneIdx].id}) at ${t.toFixed(2)}s`); lastScene = sceneIdx; }
  const png = await page.screenshot({ type: 'jpeg', quality: 95, animations: 'disabled', caret: 'hide' }); // JPEG: ~6x faster than PNG in Chromium for grainy frames
  if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 150 === 0 && i) console.log(`[render] ${i}/${nFrames} frames, ${((Date.now() - t0) / 1000).toFixed(0)}s elapsed`);
}
ff.stdin.end();
await ffDone;
await browser.close();
console.log(`[render] done: ${nFrames} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s -> ${outPath}`);
