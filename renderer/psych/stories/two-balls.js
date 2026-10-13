/* Metaphor: two-balls. Motivation (ivory) is dropped from a great height and loses a little every bounce until it
   lies still. Habit (gold) starts small and gets a small push every bounce until it rises past motivation's starting
   line. Heights come from exact physics tracks (pipeline/psych.py bounce_track); this file only draws. */
window.PS.registerStory('two-balls', function (t, ctx) {
  const P = ctx.P, A = ctx.anim, { seg, ease, lerp, clamp, PAL, W, f1, esc } = P;
  const items = [], FLOOR = A.floor_y, R = A.ball_radius;
  // the faint line (default: motivation's starting height, watched by habit); it lights gold when the watched ball reaches it
  const L = A.line === null ? null : (A.line || { h: (A.balls.motivation || {}).h0, watch: 'habit' });
  const markH = L ? L.h : 0;
  const crossT = (() => { const T = L && ctx.tracks[L.watch]; if (!T) return 1e9; const i = T.h.findIndex(h => h >= markH - 1); return i < 0 ? 1e9 : i / T.hz; })();
  const lit = ease.smooth(seg(t, crossT - 0.05, crossT + 0.35)) * (1 - 0.6 * ease.smooth(seg(t, crossT + 1.2, crossT + 2.4)));
  const lineY = FLOOR - markH - R;
  const lineOp = 0.32 * ease.smooth(seg(t, 0.2, 1.0));
  if (L) items.push({ z: -20, svg: `<line x1="150" y1="${f1(lineY)}" x2="${W - 150}" y2="${f1(lineY)}" stroke="${PAL.grey}" stroke-width="3" stroke-dasharray="14 14" opacity="${f1(lineOp * (1 - lit))}"/>
    <line x1="150" y1="${f1(lineY)}" x2="${W - 150}" y2="${f1(lineY)}" stroke="${PAL.gold}" stroke-width="4" opacity="${f1(lit)}"/>
    <line x1="150" y1="${f1(lineY)}" x2="${W - 150}" y2="${f1(lineY)}" stroke="${PAL.gold}" stroke-width="16" opacity="${f1(0.45 * lit)}" filter="url(#glowSm)"/>` });
  // floor line
  items.push({ z: -19, svg: `<line x1="120" y1="${FLOOR}" x2="${W - 120}" y2="${FLOOR}" stroke="${PAL.dim}" stroke-width="4"/>` });

  for (const [name, b] of Object.entries(A.balls)) {
    const h = ctx.track(name, 'h', t), v = ctx.track(name, 'v', t);
    const gold = b.color === 'gold';
    // squash on contact (from the impact speed), stretch in flight along velocity; volume preserved
    const T = ctx.tracks[name]; let squash = 0;
    for (const [ti, vi] of T.impacts) { const d = t - ti; if (d > -0.03 && d < 0.09) squash = Math.max(squash, clamp(vi / 2400, 0, 0.32) * Math.cos(d / 0.09 * Math.PI / 2) ** 2); }
    const stretch = clamp(Math.abs(v) / 6000, 0, 0.14) * (h > R * 0.5 ? 1 : 0);
    const sy = 1 - squash + stretch, sx = 1 / Math.sqrt(sy);
    const cy = FLOOR - h - R * sy;
    // contact shadow shrinks and fades with height
    const k = clamp(1 - h / 1100, 0.25, 1);
    items.push({ z: -10, svg: `<ellipse cx="${b.x}" cy="${FLOOR + 6}" rx="${f1(R * 1.1 * k * sx)}" ry="${f1(R * 0.22 * k)}" fill="#000" opacity="${f1(0.65 * k)}" filter="url(#shadow)"/>` });
    const fill = gold ? 'url(#sphere)' : PAL.white;
    const glow = gold ? `<ellipse cx="${b.x}" cy="${f1(cy)}" rx="${f1(R * 1.5 * sx)}" ry="${f1(R * 1.5 * sy)}" fill="${PAL.gold}" opacity="0.28" filter="url(#glow)"/>` : '';
    const hi = `<ellipse cx="${f1(b.x - R * 0.32 * sx)}" cy="${f1(cy - R * 0.36 * sy)}" rx="${f1(R * 0.17 * sx)}" ry="${f1(R * 0.17 * sy)}" fill="#fff" opacity="${gold ? 0.55 : 0.35}"/>`;
    const dimRest = (b.dim_on_rest ?? !gold) && T.rest_at && t > T.rest_at ? 1 - 0.35 * ease.smooth(seg(t, T.rest_at + 0.5, T.rest_at + 2.5)) : 1;
    items.push({ z: 0, svg: `<g opacity="${f1(dimRest)}">${glow}<ellipse cx="${b.x}" cy="${f1(cy)}" rx="${f1(R * sx)}" ry="${f1(R * sy)}" fill="${fill}"/>${hi}</g>` });
    // label under the floor
    const lop = ease.smooth(seg(t, 0.4, 1.2));
    items.push({ z: 1, svg: `<text x="${b.x}" y="${FLOOR + 66}" text-anchor="middle" class="f2" font-size="36" letter-spacing="6" fill="${gold ? PAL.gold : PAL.white}" opacity="${f1(lop * (gold ? 1 : 0.8 * dimRest))}">${esc(b.label)}</text>` });
  }
  return items;
});
