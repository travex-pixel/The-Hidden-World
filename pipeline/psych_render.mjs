// Psychology shorts renderer driver. Deterministic frames from renderer/psych/index.html in headless Chromium.
//   node pipeline/psych_render.mjs video  plan.json out_silent.mp4
//   node pipeline/psych_render.mjs stills plan.json outdir t1 t2 ...
//   node pipeline/psych_render.mjs cover  plan.json out.png
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const [mode, planPath, outPath, ...rest] = process.argv.slice(2);
if (!mode || !planPath || !outPath) { console.error('usage: node psych_render.mjs video|stills|cover plan.json out [times...]'); process.exit(2); }
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
const { width, height, fps, total } = plan;

const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-gpu'] });
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
page.on('pageerror', e => { console.error('[page error]', e.message); process.exitCode = 1; });
await page.goto(pathToFileURL(resolve(here, '../renderer/psych/index.html')).href);
await page.addScriptTag({ path: resolve(here, '..', plan.story_js) });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(plan => window.PS.setup(plan), plan);

if (mode === 'cover') {
  await page.setViewportSize({ width: 1080, height: 1920 });
  await page.evaluate(async () => { window.PS.cover(); await window.PS.ready(); });
  await page.screenshot({ path: outPath, type: 'png' });
  console.log('[render] cover ->', outPath);
} else if (mode === 'stills') {
  mkdirSync(outPath, { recursive: true });
  for (const ts of rest) { const t = parseFloat(ts); await page.evaluate(async t => { window.PS.frame(t); await window.PS.ready(); }, t); await page.screenshot({ path: resolve(outPath, `t${t.toFixed(2)}.png`), type: 'png' }); console.log('[render] still', t); }
} else {
  const nFrames = Math.round(total * fps);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-an',
    '-c:v', 'libx264', '-preset', plan.preset || 'medium', '-crf', String(plan.crf ?? 20), '-pix_fmt', 'yuv420p', '-r', String(fps), outPath], { stdio: ['pipe', 'inherit', 'inherit'] });
  const ffDone = new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg exit ' + c))));
  const t0 = Date.now(); let lastBeat = -1;
  for (let i = 0; i < nFrames; i++) {
    const t = i / fps;
    const beat = await page.evaluate(async t => { const b = window.PS.frame(t); await window.PS.ready(); return b; }, t);
    if (beat !== lastBeat) { console.log(`[render] beat ${beat + 1}/${plan.episode.beats.length} (${plan.episode.beats[beat].id}) at ${t.toFixed(2)}s`); lastBeat = beat; }
    const img = await page.screenshot({ type: 'jpeg', quality: 96, animations: 'disabled', caret: 'hide' });
    if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0 && i) console.log(`[render] ${i}/${nFrames} frames, ${((Date.now() - t0) / 1000).toFixed(0)}s elapsed`);
  }
  ff.stdin.end(); await ffDone;
  console.log(`[render] done: ${nFrames} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s -> ${outPath}`);
}
await browser.close();
