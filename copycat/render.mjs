// COPYCAT resumable segment renderer.
// Each beat of the scene plan is rendered to its own H.264 segment by a pool of headless-Chromium pages,
// keyed by a content hash (beat + captions + the renderer sources that draw it). A re-run only re-renders
// beats whose inputs changed; finished segments are concatenated losslessly.
// usage: node copycat/render.mjs <plan.json> <outDir> [--workers 4] [--beats id,id] [--crf 18] [--preset medium] [--no-concat]
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright'); // local or globally pre-installed Playwright
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, renameSync, unlinkSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const here = dirname(fileURLToPath(import.meta.url));
const av = process.argv.slice(2); const pos = []; const opt = {};
for (let i = 0; i < av.length; i++) { if (av[i].startsWith('--')) { const k = av[i].slice(2); opt[k] = av[i + 1] && !av[i + 1].startsWith('--') ? av[++i] : true; } else pos.push(av[i]); }
const [planPath, outDir] = pos; if (!planPath || !outDir) { console.error('usage: node render.mjs plan.json outDir [--workers N] [--beats a,b]'); process.exit(2); }
const plan = JSON.parse(readFileSync(planPath, 'utf8')); const fps = plan.meta.fps;
const segDir = join(outDir, 'rendered-segments'); mkdirSync(segDir, { recursive: true });
const workers = parseInt(opt.workers || '4', 10), crf = String(opt.crf || 18), preset = opt.preset || 'medium';

// ---- content hashing -------------------------------------------------------------------------
const rdir = resolve(here, 'renderer'); const src = {}; for (const f of readdirSync(rdir).filter(f => f.endsWith('.js'))) src[f] = readFileSync(join(rdir, f), 'utf8');
const sha = s => createHash('sha1').update(s).digest('hex');
const baseHash = sha(['engine.js', 'art.js', 'shots_core.js'].map(f => src[f] || '').join('\n') + readFileSync(join(rdir, 'index.html'), 'utf8'));
const packOf = {}; for (const [f, s] of Object.entries(src)) for (const m of s.matchAll(/CC\.def\(\s*['"]([\w-]+)['"]/g)) packOf[m[1]] = f;
const missing = [...new Set(plan.beats.map(b => b.shot && b.shot.type).filter(t => t && !packOf[t]))];
if (missing.length) console.error('[render] WARNING: shot types with no implementation: ' + missing.join(', '));
const frameRange = b => [Math.round(b.start * fps), Math.round(b.end * fps)];
function beatHash(b) {
  const caps = (plan.captions || []).filter(c => c.end > b.start && c.start < b.end); const ch = (plan.chapters || []).find(c => c.id === b.chapter);
  const pack = packOf[b.shot.type]; const packHash = pack && !['engine.js', 'art.js', 'shots_core.js'].includes(pack) ? sha(src[pack]) : '';
  return sha(JSON.stringify([b, caps, ch, plan.meta, baseHash, packHash, crf, preset])).slice(0, 12);
}
const only = opt.beats ? new Set(String(opt.beats).split(',')) : null;
const jobs = plan.beats.map(b => ({ b, file: join(segDir, `${b.id}-${beatHash(b)}.mp4`) }));
const todo = jobs.filter(j => !existsSync(j.file) && (!only || only.has(j.b.id)));
// drop stale segments of beats we are about to (re)render
for (const j of todo) for (const f of readdirSync(segDir)) if (f.startsWith(j.b.id + '-') && join(segDir, f) !== j.file) unlinkSync(join(segDir, f));
const totalFrames = todo.reduce((s, j) => s + frameRange(j.b)[1] - frameRange(j.b)[0], 0);
console.log(`[render] ${jobs.length} beats, ${jobs.length - todo.length} cached, ${todo.length} to render (${totalFrames} frames) with ${workers} workers`);

// ---- render pool ------------------------------------------------------------------------------
let done = 0, failed = 0; const t0 = Date.now(); const errors = [];
async function worker(id, browser) {
  const page = await browser.newPage({ viewport: { width: plan.meta.width, height: plan.meta.height }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { errors.push(`[page ${id}] ${e.message}`); });
  await page.goto(pathToFileURL(join(rdir, 'index.html')).href);
  await page.evaluate(() => window.CC.loadFonts()); await page.evaluate(p => window.CC.setup(p), plan);
  const cdp = await page.context().newCDPSession(page);
  while (todo.length) {
    const j = todo.shift(); const [f0, f1] = frameRange(j.b); const tmp = j.file + '.part.mp4';
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-an', '-c:v', 'libx264', '-preset', preset, '-crf', crf, '-pix_fmt', 'yuv420p', '-r', String(fps), '-g', String(fps * 2), '-video_track_timescale', '15360', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-vf', 'scale=in_range=full:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709', tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
    const ffDone = new Promise(res => ff.on('close', res));
    for (let f = f0; f < f1; f++) {
      await page.evaluate(i => window.CC.frame(i), f);
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 95, optimizeForSpeed: true });
      if (!ff.stdin.write(Buffer.from(data, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
      done++;
    }
    ff.stdin.end(); const code = await ffDone;
    const err = await page.evaluate(() => { const e = window.__ccError || ''; window.__ccError = ''; return e; });
    if (err) errors.push(err.trim());
    if (code === 0) renameSync(tmp, j.file); else { failed++; errors.push(`ffmpeg exit ${code} for ${j.b.id}`); }
    const el = (Date.now() - t0) / 1000; console.log(`[render] ${j.b.id} (${j.b.shot.type}) ${f1 - f0}f  | ${done}/${totalFrames} frames, ${el.toFixed(0)}s, ${(done / el).toFixed(1)} fps, eta ${(((totalFrames - done) / Math.max(done / el, 0.01)) / 60).toFixed(1)} min`);
  }
  await page.close();
}
if (todo.length) {
  const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-gpu', '--disable-dev-shm-usage'] });
  await Promise.all(Array.from({ length: Math.min(workers, todo.length) }, (_, i) => worker(i, browser)));
  await browser.close();
}
if (errors.length) { console.error('[render] ERRORS:\n' + [...new Set(errors)].join('\n')); writeFileSync(join(outDir, 'render-errors.log'), [...new Set(errors)].join('\n')); }
else if (existsSync(join(outDir, 'render-errors.log'))) unlinkSync(join(outDir, 'render-errors.log'));

// ---- concat ------------------------------------------------------------------------------------
const have = jobs.filter(j => existsSync(j.file));
writeFileSync(join(outDir, 'segments.json'), JSON.stringify(jobs.map(j => ({ id: j.b.id, file: j.file, frames: frameRange(j.b)[1] - frameRange(j.b)[0], rendered: existsSync(j.file) })), null, 1));
if (!opt['no-concat'] && have.length === jobs.length) {
  const list = join(outDir, 'segments.txt'); writeFileSync(list, jobs.map(j => `file '${resolve(j.file)}'`).join('\n'));
  const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', join(outDir, 'video_silent.mp4')], { stdio: 'inherit' });
  if (r.status !== 0) { console.error('[render] concat failed'); process.exit(5); }
  console.log(`[render] done -> ${join(outDir, 'video_silent.mp4')} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
} else console.log(`[render] ${have.length}/${jobs.length} segments present; concat skipped`);
process.exit(failed || errors.length ? 4 : 0);
