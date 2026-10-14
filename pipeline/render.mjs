// Frame renderer: loads a renderer page in headless Chromium, renders every frame deterministically,
// and pipes JPEG frames into ffmpeg to produce a silent H.264 video.
// usage: node pipeline/render.mjs <plan.json> <out_silent.mp4>
// plan.page (default renderer/index.html) selects the renderer; plan.workers > 1 renders contiguous
// chunks in parallel pages and joins them losslessly (frames are pure functions of t, so this is safe).
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const [planPath, outPath] = process.argv.slice(2);
if (!planPath || !outPath) { console.error('usage: node render.mjs plan.json out.mp4'); process.exit(2); }
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
const { width, height, fps, seed, timeline, episode, scenes_js } = plan;
const total = timeline[timeline.length - 1].end;
const nFrames = Math.round(total * fps);
const pageUrl = pathToFileURL(resolve(here, '..', plan.page || 'renderer/index.html')).href + (plan.page ? `?w=${width}&h=${height}` : '');
const workers = Math.max(1, Math.min(plan.workers || 1, 8));

const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-gpu'] });

async function openPage() {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('[page error]', e.message); process.exitCode = 1; });
  page.on('console', m => { if (m.type() === 'error') console.error('[page console]', m.text()); });
  await page.goto(pageUrl);
  for (const f of [].concat(scenes_js)) await page.addScriptTag({ path: resolve(here, '..', f) });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(({ episode, timeline, seed, visual, art, cast, fps }) => window.HW.setup(episode, timeline, seed, visual, art, cast, fps), { episode, timeline, seed, visual: plan.visual, art: plan.art, cast: plan.cast, fps: plan.fps });
  return page;
}

// render frames [a, b) of one segment with an already set-up page
async function renderSegment(page, w, a, b, out) {
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-an',
    '-c:v', 'libx264', '-preset', plan.preset || 'medium', '-crf', String(plan.crf ?? 20), ...(plan.tune ? ['-tune', plan.tune] : []), '-pix_fmt', 'yuv420p', '-r', String(fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const ffDone = new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg exit ' + c))));
  let lastScene = -1;
  for (let i = a; i < b; i++) {
    const t = i / fps;
    const sceneIdx = await page.evaluate(async t => { const i = window.HW.frame(t); await window.HW.ready(); return i; }, t);
    if (sceneIdx !== lastScene) { console.log(`[render w${w}] scene ${sceneIdx + 1}/${timeline.length} (${timeline[sceneIdx].id}) at ${t.toFixed(2)}s`); lastScene = sceneIdx; }
    const img = await page.screenshot({ type: 'jpeg', quality: 95, animations: 'disabled', caret: 'hide' }); // JPEG: ~6x faster than PNG in Chromium for grainy frames
    if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
    done++; if (done % 300 === 0) console.log(`[render] ${done}/${nFrames} frames, ${((Date.now() - t0) / 1000).toFixed(0)}s elapsed`);
  }
  ff.stdin.end();
  await ffDone;
}

const t0 = Date.now(); let done = 0;
if (workers === 1) {
  const page = await openPage(); await renderSegment(page, 0, 0, nFrames, outPath); await page.close();
} else {
  // many short segments dealt round-robin, so heavy scenes are shared between workers; joined losslessly in order
  const nSeg = workers * 6, per = Math.ceil(nFrames / nSeg); const segs = [];
  for (let k = 0; k < nSeg; k++) { const a = k * per, b = Math.min(nFrames, (k + 1) * per); if (b > a) segs.push({ k, a, b, out: `${outPath}.seg${String(k).padStart(3, '0')}.mp4` }); }
  await Promise.all(Array.from({ length: workers }, async (_, w) => {
    const page = await openPage();
    for (const sg of segs.filter(sg => sg.k % workers === w)) await renderSegment(page, w, sg.a, sg.b, sg.out);
    await page.close();
  }));
  const list = `${outPath}.parts.txt`; writeFileSync(list, segs.map(sg => `file '${resolve(sg.out)}'`).join('\n'));
  await new Promise((res, rej) => spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', outPath], { stdio: 'inherit' }).on('close', c => c === 0 ? res() : rej(new Error('concat exit ' + c))));
  for (const sg of segs) { try { unlinkSync(sg.out); } catch { } } unlinkSync(list);
}
await browser.close();
console.log(`[render] done: ${nFrames} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s -> ${outPath}`);
