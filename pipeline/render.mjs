// Frame renderer: loads renderer/index.html in headless Chromium, renders every frame deterministically,
// and pipes frames into ffmpeg to produce a silent H.264 video.
// usage: node pipeline/render.mjs <plan.json> <out_silent.mp4> [--workers N]
//
// Frames are a pure function of (plan, t), so the timeline can be split into contiguous chunks rendered by
// independent browsers at the same time. Each chunk is encoded with identical settings and the chunks are
// joined with ffmpeg's concat demuxer (stream copy, no re-encode). Rendering is latency-bound (screenshots),
// not CPU-bound, so a few workers give a near-linear speed-up for long-form episodes. --workers 1 (default)
// is the original single-pass path.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const wi = args.indexOf('--workers');
const workers = wi >= 0 ? Math.max(1, parseInt(args.splice(wi, 2)[1], 10) || 1) : 1;
const [planPath, outPath] = args;
if (!planPath || !outPath) { console.error('usage: node render.mjs plan.json out.mp4 [--workers N]'); process.exit(2); }
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
const { width, height, fps, seed, timeline, episode, scenes_js } = plan;
const canvas = plan.canvas || null;   // logical SVG canvas (e.g. 1920x1080); null = engine default (1080x1920)
const total = timeline[timeline.length - 1].end;
const nFrames = Math.round(total * fps);

function ffmpegTo(path) {
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-an',
    '-c:v', 'libx264', '-preset', plan.preset || 'medium', '-crf', String(plan.crf ?? 20), '-pix_fmt', 'yuv420p', '-r', String(fps), path], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg exit ' + c))));
  return { ff, done };
}

async function openPage() {
  const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-gpu'] });
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('[page error]', e.message); process.exitCode = 1; });
  const url = pathToFileURL(resolve(here, '../renderer/index.html')).href + (canvas ? `?w=${canvas[0]}&h=${canvas[1]}` : '');
  await page.goto(url);
  await page.addScriptTag({ path: resolve(here, '..', scenes_js) });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(({ episode, timeline, seed, visual, art, cast }) => window.HW.setup(episode, timeline, seed, visual, art, cast), { episode, timeline, seed, visual: plan.visual, art: plan.art, cast: plan.cast });
  return { browser, page };
}

async function renderRange(label, from, to, path, t0) {
  const { browser, page } = await openPage();
  const { ff, done } = ffmpegTo(path);
  let lastScene = -1;
  for (let i = from; i < to; i++) {
    const t = i / fps;
    const sceneIdx = await page.evaluate(async t => { const i = window.HW.frame(t); await window.HW.ready(); return i; }, t);
    if (sceneIdx !== lastScene) { console.log(`[render${label}] scene ${sceneIdx + 1}/${timeline.length} (${timeline[sceneIdx].id}) at ${t.toFixed(2)}s`); lastScene = sceneIdx; }
    const img = await page.screenshot({ type: 'jpeg', quality: 95, animations: 'disabled', caret: 'hide' }); // JPEG: ~6x faster than PNG in Chromium for grainy frames
    if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
    if ((i - from) % 300 === 0 && i > from) console.log(`[render${label}] ${i - from}/${to - from} frames, ${((Date.now() - t0) / 1000).toFixed(0)}s elapsed`);
  }
  ff.stdin.end();
  await done;
  await browser.close();
}

const t0 = Date.now();
if (workers === 1) {
  await renderRange('', 0, nFrames, outPath, t0);
} else {
  const dir = outPath + '.parts'; rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  const per = Math.ceil(nFrames / workers); const parts = [];
  for (let w = 0; w < workers; w++) { const a = w * per, b = Math.min(nFrames, a + per); if (a < b) parts.push({ w, a, b, path: join(dir, `part${String(w).padStart(2, '0')}.mp4`) }); }
  console.log(`[render] ${nFrames} frames across ${parts.length} workers`);
  await Promise.all(parts.map(p => renderRange(` w${p.w}`, p.a, p.b, p.path, t0)));
  const list = join(dir, 'list.txt'); writeFileSync(list, parts.map(p => `file '${p.path.replace(/'/g, "'\\''")}'`).join('\n') + '\n');
  await new Promise((res, rej) => spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', outPath], { stdio: 'inherit' })
    .on('close', c => c === 0 ? res() : rej(new Error('concat exit ' + c))));
  rmSync(dir, { recursive: true, force: true });
}
console.log(`[render] done: ${nFrames} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s -> ${outPath}`);
