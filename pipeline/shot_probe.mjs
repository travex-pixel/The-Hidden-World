// Probe every scene of a planned episode in the real renderer and record what each shot actually stages:
// set, grade, camera move, figures (with their timed pose/expression actions, walks, outfits) and evidence overlays.
// It wraps E.cine.shot, so the data comes from the same code that draws the frames (no hand-kept description).
// usage: node pipeline/shot_probe.mjs out/<id>/plan.json out/<id>/shots_probe.json
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const [planPath, outPath] = process.argv.slice(2);
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: plan.width, height: plan.height } });
page.on('pageerror', e => { console.error('[page error]', e.message); process.exitCode = 1; });
await page.goto(pathToFileURL(resolve(here, '../renderer/index.html')).href);
await page.addScriptTag({ path: resolve(here, '..', plan.scenes_js) });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(({ episode, timeline, seed, visual, art, cast }) => window.HW.setup(episode, timeline, seed, visual, art, cast), plan);
const shots = await page.evaluate(() => {
  const E = window.HW; const out = []; let cur = null; const orig = E.cine.shot;
  E.cine.shot = (ctx, spec) => { cur = spec; return orig(ctx, spec); };
  const txt = o => o.text || (o.rows ? o.rows.map(r => r.text).join(' / ') : undefined);
  E.state.timeline.forEach((s, i) => {
    cur = null; const T = s.end - s.start; E.frame(s.start + T * 0.5);
    const sc = E.state.ep.scenes[i];
    if (!cur) { out.push({ id: s.id, scene: sc.scene, composed: false }); return; }
    const figs = (cur.figures || []).map(f => ({
      id: f.id, outfit: f.outfit || 'default', depth: f.depth ?? 1, scale: f.scale, start_pose: f.pose || 'stand', start_expr: f.expr || 'neutral',
      actions: (f.keys || []).map(k => ({ at: +k.at.toFixed(2), pose: k.pose, expr: k.expr, turn_head: k.headTurn !== undefined || undefined, move: (k.x !== undefined || k.y !== undefined || k.scale !== undefined) || undefined })).filter(a => a.pose || a.expr || a.turn_head || a.move),
      walk: f.walk ? { from: f.walk.from, to: f.walk.to, at: +f.walk.at.toFixed(2), dur: f.walk.dur } : undefined,
      silhouette: f.silhouette || undefined, prop: f.propOverride || undefined, visible: f.show ? f.show.map(v => +(+v).toFixed(2)) : undefined
    }));
    const cam = cur.cam || {};
    out.push({ id: s.id, scene: sc.scene, composed: true, set: cur.set, grade: cur.grade || 'none', tag: cur.tag || 'ILLUSTRATION · NOT A PHOTOGRAPH',
      camera: cam.keys ? { keys: cam.keys.length, handheld: cam.handheld || 0 } : { from: cam.from, to: cam.to, handheld: cam.handheld || 0 },
      figures: figs, overlays: (cur.overlays || []).map(o => ({ type: o.type, at: +(o.at || 0).toFixed(2), text: txt(o) })), props: (cur.props || []).length,
      rain: !!(cur.rain || (cur.setOpts || {}).rain), fog: !!cur.fog });
  });
  return out;
});
writeFileSync(outPath, JSON.stringify(shots, null, 1));
console.log('probed', shots.length, 'shots ->', outPath);
await browser.close();
