// Character reference sheet for the figure library: every character in characters/figures/ in a set of poses/expressions.
// usage: node pipeline/figure_sheet.mjs <out.png> [id,id,...] [pose,pose,...]
import { chromium } from 'playwright';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url)); const ROOT = resolve(here, '..');
const [out = 'figures_sheet.png', idsArg, posesArg] = process.argv.slice(2);
const files = readdirSync(resolve(ROOT, 'characters/figures')).filter(f => f.endsWith('.json'));
const cast = Object.fromEntries(files.map(f => { const j = JSON.parse(readFileSync(resolve(ROOT, 'characters/figures', f), 'utf8')); return [j.id, j]; }));
const ids = idsArg ? idsArg.split(',') : Object.keys(cast);
const poses = posesArg ? posesArg.split(',') : ['stand', 'walk', 'read', 'examine', 'torch', 'sit_read'];
const cellW = 360, cellH = 640; const Wd = cellW * poses.length, Hd = cellH * ids.length;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(pathToFileURL(resolve(ROOT, 'renderer/index.html')).href);
await p.evaluate(() => document.fonts.ready);
const svg = await p.evaluate(({ cast, ids, poses, cellW, cellH }) => {
  const E = window.HW; E.state = { cast, seed: 1, timeline: [], ep: {} };
  let s = E.fig.figDefs;
  ids.forEach((id, r) => poses.forEach((pose, c) => {
    const exprs = ['neutral', 'focused', 'worried', 'realise', 'sad', 'determined']; const expr = (cast[id].expressions_allowed || exprs)[c % (cast[id].expressions_allowed || exprs).length];
    const f = { id, x: c * cellW + cellW / 2, y: r * cellH + cellH - 40, scale: 0.58, dir: c % 2 ? -1 : 1, turn: pose === 'walk' ? 0.8 : 0.4, pose, expr, gaze: [0.4, 0.1],
      walk: pose === 'walk' ? { from: c * cellW + cellW / 2, to: c * cellW + cellW / 2 + 0.001, at: 0, dur: 100, cadence: 6 } : null };
    s += `<rect x="${c * cellW}" y="${r * cellH}" width="${cellW}" height="${cellH}" fill="${(r + c) % 2 ? '#2a2f38' : '#323844'}"/>`;
    s += E.fig.figure(f, { t: 0.9 + c * 0.13, sceneStart: 0 }, { dir: 1, rim: '#ffd59a' });
    s += `<text x="${c * cellW + 12}" y="${r * cellH + 28}" font-family="Courier Prime" font-weight="700" font-size="22" fill="#e7ae4f">${id} · ${pose} · ${expr}</text>`;
  }));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cellW * poses.length}" height="${cellH * ids.length}" viewBox="0 0 ${cellW * poses.length} ${cellH * ids.length}">${s}</svg>`;
}, { cast, ids, poses, cellW, cellH });
await p.setViewportSize({ width: Wd, height: Hd });
await p.setContent(`<html><body style="margin:0;background:#000"><style>@font-face{font-family:'Courier Prime';font-weight:700;src:url('${pathToFileURL(resolve(ROOT, 'assets/fonts/CourierPrime-Bold.ttf')).href}')}</style>${svg}</body></html>`);
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: out, clip: { x: 0, y: 0, width: Wd, height: Hd } });
await b.close(); console.log('wrote', out, Wd + 'x' + Hd);
