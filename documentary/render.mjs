// Long-form frame renderer: N parallel headless-Chromium workers each paint a contiguous frame range on a
// 1920x1080 canvas (documentary/renderer), encode it to an H.264 segment, then the segments are joined
// losslessly with ffmpeg's concat demuxer.
// usage: node documentary/render.mjs <plan.json> <out_silent.mp4> [--workers N] [--from S --to S]
//        node documentary/render.mjs <plan.json> --stills <outdir> t1,t2,...      (PNG stills for review)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const planPath = args[0];
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
const mapData = JSON.parse(readFileSync(resolve(here, 'assets/mo_region_counties.json'), 'utf8'));
const { fps } = plan;
const total = plan.shots[plan.shots.length - 1].end;

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('[page error]', e.message); process.exitCode = 1; });
  page.on('console', m => { if (m.type() === 'error') console.error('[console]', m.text()); });
  await page.goto(pathToFileURL(resolve(here, 'renderer/index.html')).href);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(({ plan, mapData }) => window.DOC.setup(plan, mapData), { plan, mapData });
  return page;
}

function decode(dataUrl) { return Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64'); }

async function renderRange(f0, f1, out, k) {
  const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-gpu', '--disable-lcd-text'] });
  const page = await openPage(browser);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(fps), '-i', '-', '-an',
    '-c:v', 'libx264', '-preset', plan.preset || 'medium', '-crf', String(plan.crf ?? 19), '-tune', 'film', '-pix_fmt', 'yuv420p',
    '-r', String(fps), '-g', String(fps * 2), '-threads', '2', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg exit ' + c))));
  const t0 = Date.now();
  for (let i = f0; i < f1; i++) {
    const url = await page.evaluate(t => { window.DOC.frame(t); return window.DOC.jpeg(0.93); }, i / fps);
    if (!ff.stdin.write(decode(url))) await new Promise(r => ff.stdin.once('drain', r));
    if ((i - f0) % 600 === 0 && i > f0) console.log(`[render w${k}] ${i - f0}/${f1 - f0} frames, ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end(); await done; await browser.close();
  console.log(`[render w${k}] done ${f1 - f0} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}

if (opt('--stills')) {
  const dir = opt('--stills'); mkdirSync(dir, { recursive: true });
  const times = args[args.indexOf('--stills') + 2].split(',').map(Number);
  const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-gpu'] });
  const page = await openPage(browser);
  for (const t of times) {
    const url = await page.evaluate(t => { window.DOC.frame(t); return document.getElementById('c').toDataURL('image/png'); }, t);
    writeFileSync(join(dir, `still_${t.toFixed(2).padStart(7, '0')}.png`), decode(url));
  }
  await browser.close(); console.log(`[stills] ${times.length} -> ${dir}`);
} else {
  const outPath = args[1];
  const workers = Number(opt('--workers', 4));
  const from = Number(opt('--from', 0)), to = Number(opt('--to', total));
  const F0 = Math.round(from * fps), F1 = Math.round(to * fps), n = F1 - F0;
  const segDir = outPath + '.segments'; rmSync(segDir, { recursive: true, force: true }); mkdirSync(segDir, { recursive: true });
  console.log(`[render] ${n} frames (${(n / fps).toFixed(1)}s) with ${workers} workers`);
  const t0 = Date.now(); const jobs = []; const segs = [];
  for (let k = 0; k < workers; k++) {
    const a = F0 + Math.floor(n * k / workers), b = F0 + Math.floor(n * (k + 1) / workers);
    const seg = join(segDir, `seg_${k}.mp4`); segs.push(seg); jobs.push(renderRange(a, b, seg, k));
  }
  await Promise.all(jobs);
  writeFileSync(join(segDir, 'list.txt'), segs.map(s => `file '${s}'`).join('\n'));
  await new Promise((res, rej) => spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', join(segDir, 'list.txt'), '-c', 'copy', outPath], { stdio: 'inherit' })
    .on('close', c => c === 0 ? res() : rej(new Error('concat failed ' + c))));
  rmSync(segDir, { recursive: true, force: true });
  console.log(`[render] done: ${n} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s -> ${outPath}`);
}
