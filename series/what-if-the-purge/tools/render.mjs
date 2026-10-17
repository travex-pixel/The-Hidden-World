// Renders an episode's index.html to MP4 by stepping its master clock (window.renderAt) frame by frame.
// usage: node render.mjs <episode/index.html> <out.mp4> [--stills t1,t2,...] [--audio mix.wav]
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = createRequire('/opt/node22/lib/node_modules/')('playwright')); }

const args = process.argv.slice(2);
const [html, out] = args;
const opt = k => { const i = args.indexOf(k); return i > 0 ? args[i + 1] : null; };
const FPS = 30, DUR = 30, N = FPS * DUR;

const browser = await chromium.launch({ args: ['--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('pageerror', e => { console.error('[page error]', e.message); process.exitCode = 1; });
page.on('console', m => console.log('[page]', m.text()));
await page.goto(pathToFileURL(resolve(html)).href + '?capture=1');
await page.waitForFunction(() => window.READY === true);

const stills = opt('--stills');
if (stills) {
  mkdirSync(out, { recursive: true });
  for (const t of stills.split(',').map(Number)) {
    await page.evaluate(t => window.renderAt(t), t);
    await page.screenshot({ path: `${out}/t${t.toFixed(2).padStart(5, '0')}.png` });
  }
  await browser.close(); process.exit();
}

const audio = opt('--audio');
const ffArgs = ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-'];
if (audio) ffArgs.push('-i', audio, '-c:a', 'aac', '-b:a', '192k', '-shortest');
ffArgs.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-movflags', '+faststart', out);
const ff = spawn('ffmpeg', ffArgs, { stdio: ['pipe', 'inherit', 'inherit'] });
const done = new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg exit ' + c))));
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  await page.evaluate(t => window.renderAt(t), i / FPS);
  const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 150 === 0) console.log(`[render] ${i}/${N} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
ff.stdin.end(); await done; await browser.close();
console.log(`[render] done -> ${out}`);
