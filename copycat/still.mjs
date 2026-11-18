// Preview tool: render stills / contact sheets of shots without a full build.
// usage:
//   node copycat/still.mjs --shot '{"type":"title_card","title":"X"}' --dur 6 --times 0.5,2,4 --out sheet.png
//   node copycat/still.mjs --plan out/copycat/<id>/plan.json --beat <beatId> [--times ...] --out sheet.png
//   node copycat/still.mjs --plan plan.json --at 12.5,40,80 --out sheet.png      (global seconds)
// Options: --cues '{"name":1.2}'  --cols 3  --scale 0.5  --canon divergent  --full (single 1920x1080 frame, first time only)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright'); // resolves a local or globally pre-installed Playwright
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const args = {}; const av = process.argv.slice(2);
for (let i = 0; i < av.length; i++) { if (av[i].startsWith('--')) { const k = av[i].slice(2); const v = av[i + 1] && !av[i + 1].startsWith('--') ? av[++i] : true; args[k] = v; } }
const out = args.out || 'still.png'; const scale = parseFloat(args.scale || '0.5'); const cols = parseInt(args.cols || '3', 10);

let plan, frames = [];
if (args.plan) {
  plan = JSON.parse(readFileSync(args.plan, 'utf8'));
  if (args.beat) { const b = plan.beats.find(x => x.id === args.beat); if (!b) { console.error('no beat', args.beat, 'have:', plan.beats.map(x => x.id).join(' ')); process.exit(2); }
    const d = b.end - b.start; const ts = args.times ? String(args.times).split(',').map(Number) : [0.1, 0.3, 0.5, 0.7, 0.85, 0.97].map(p => +(p * d).toFixed(2)); frames = ts.map(t => Math.round((b.start + Math.min(t, d - 0.04)) * plan.meta.fps)); }
  else { frames = String(args.at || '1').split(',').map(t => Math.round(parseFloat(t) * plan.meta.fps)); }
} else {
  const shot = JSON.parse(args.shot || '{"type":"_test"}'); const dur = parseFloat(args.dur || '6');
  const words = args.caption ? String(args.caption).split(' ').map((w, i, a) => ({ w, s: 0.3 + i * (dur - 0.6) / a.length, e: 0.3 + (i + 1) * (dur - 0.6) / a.length })) : [];
  plan = { meta: { fps: 30, width: 1920, height: 1080, duration: dur, title: 'preview' }, chapters: [{ id: 'c', index: 1, title: args.chapter || 'Preview chapter', start: 0, end: dur }],
    beats: [{ id: args.id || 'preview', chapter: 'c', start: 0, end: dur, shot, cues: JSON.parse(args.cues || '{}'), canon: args.canon || 'none' }], captions: words.length ? [{ start: 0.3, end: dur - 0.3, words }] : [] };
  const ts = args.times ? String(args.times).split(',').map(Number) : [0.08, 0.28, 0.5, 0.7, 0.88, 0.98].map(p => +(p * dur).toFixed(2));
  frames = ts.map(t => Math.round(Math.min(t, dur - 0.04) * 30));
}
const full = !!args.full; if (full) frames = frames.slice(0, 1);
const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-gpu'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('[page error]', e.message));
page.on('console', m => { if (m.type() === 'error') console.error('[console]', m.text()); });
await page.goto(pathToFileURL(resolve(here, 'renderer/index.html')).href);
await page.evaluate(() => window.CC.loadFonts());
if (args.script) for (const f of String(args.script).split(',')) await page.addScriptTag({ path: resolve(f) });
await page.evaluate(p => window.CC.setup(p), plan);
const tmp = out.replace(/\.png$/, '');
const files = []; const t0 = Date.now();
for (let i = 0; i < frames.length; i++) {
  await page.evaluate(f => window.CC.frame(f), frames[i]);
  const f = `${tmp}.f${i}.jpg`; await page.screenshot({ path: f, type: 'jpeg', quality: 92 }); files.push(f);
}
const err = await page.evaluate(() => window.__ccError || '');
if (err) console.error('[shot errors]' + err);
await browser.close();
const ms = ((Date.now() - t0) / frames.length).toFixed(0);
if (full) { spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', files[0], out]); }
else {
  const rows = Math.ceil(files.length / cols); const w = Math.round(1920 * scale), h = Math.round(1080 * scale);
  const inputs = files.flatMap(f => ['-i', f]);
  const filt = files.map((_, i) => `[${i}:v]scale=${w}:${h}[s${i}]`).join(';') + ';' + files.map((_, i) => `[s${i}]`).join('') + `xstack=inputs=${files.length}:layout=` + files.map((_, i) => `${(i % cols) * w}_${Math.floor(i / cols) * h}`).join('|') + (files.length % cols && rows > 1 ? ':fill=black' : '') + '[o]';
  const r = files.length === 1 ? spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', files[0], '-vf', `scale=${w}:${h}`, out]) : spawnSync('ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', filt, '-map', '[o]', '-frames:v', '1', out]);
  if (r.status !== 0) console.error(String(r.stderr));
}
spawnSync('rm', ['-f', ...files]);
console.log(`[still] ${frames.length} frame(s) -> ${out}  (~${ms} ms/frame incl. screenshot)`);
