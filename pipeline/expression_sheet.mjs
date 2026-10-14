// Expression sheet: one character's face in every expression of the history rig, labelled, for visual review.
// usage: node pipeline/expression_sheet.mjs <plan.json> <character-id> <out.png>
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const [planPath, who, out] = process.argv.slice(2);
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
const only = process.env.ONLY ? process.env.ONLY.split(',') : null;
const cols = only ? only.length : 6, cw = only ? 600 : 300, chh = only ? 600 : 300;
const browser = await chromium.launch({ args: ['--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: cols * cw, height: 1500 } });
page.on('pageerror', e => { console.error('[page error]', e.message); process.exitCode = 1; });
await page.goto(pathToFileURL(resolve(here, '..', 'renderer/history/index.html')).href + `?w=${cols * cw}&h=1500`);
for (const f of [].concat(plan.scenes_js)) await page.addScriptTag({ path: resolve(here, '..', f) });
await page.evaluate(() => document.fonts.ready);
const size = await page.evaluate(({ who, cast, cols, cw, chh, only }) => {
  const X = window.HX, names = only || Object.keys(X.Rig.EXPR), rows = Math.ceil(names.length / cols);
  const c = document.getElementById('c'); c.width = cols * cw; c.height = rows * chh; const g = c.getContext('2d');
  g.fillStyle = '#efe6d2'; g.fillRect(0, 0, c.width, c.height);
  const ch = cast[who]; const heads = (ch.rig && ch.rig.heads) || 6; const hh = 1000 / heads;
  names.forEach((name, i) => {
    const x = (i % cols) * cw, y = Math.floor(i / cols) * chh;
    const A = X.Rig.compileActor({ id: 'sheet', char: who, x: 0, h: 1000, acts: [{ t: 0, expr: name, look: [0.5, 0], dur: 0.01 }], spec: ch, seed: 3, facing: 1 });
    const st = X.Rig.evaluate(A, 3.0, null); st.blink = 0; st.sway = 0; st.jolt = 0; st.talk = 0; st.dart = [0, 0];
    const K = (chh * 0.5) / hh, headY = -(st.hip + 330) - hh * 0.38;
    g.save(); g.beginPath(); g.rect(x + 2, y + 2, cw - 4, chh - 4); g.clip();
    g.fillStyle = i % 2 ? '#e6dcc4' : '#ece2cc'; g.fillRect(x, y, cw, chh);
    g.translate(x + cw * 0.46, y + chh * 0.5 - headY * K); g.scale(K, K);
    X.Rig.drawCharacter(g, A, st, [-0.7, -0.7], { lw: 2.6 / K, style: 'watercolour', softPx: 1.5, v3: true });
    g.restore();
    g.font = '800 22px Nunito'; g.fillStyle = '#3a2418'; g.textAlign = 'center'; g.fillText(name, x + cw / 2, y + chh - 14);
  });
  return [c.width, c.height];
}, { who, cast: plan.cast, cols, cw, chh, only });
await page.setViewportSize({ width: size[0], height: size[1] });
await page.locator('#c').screenshot({ path: out });
console.log('expression sheet', out, size.join('x'));
await browser.close();
