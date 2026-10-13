/* Metaphor: travel-balls. The cinematic version of two-balls: two lanes, each ball rolls and bounces left to right
   under exact physics (x, h from pipeline/psych.py bounce_track), and a spring-damped camera (camera_track) follows
   the action with a slight lag and a slow push-in. Parallax columns, streaking floor ticks and a rolling seam give
   depth and speed; 8-sample motion blur does the rest. Hook and captions stay fixed on screen. */
window.PS.registerStory('travel-balls', function (t, ctx) {
  const P = ctx.P, A = ctx.anim, { seg, ease, clamp, PAL, W, H, f1, esc, mulberry32 } = P;
  const items = [], R = A.ball_radius;
  const camX = ctx.track('camera', 'x', t), zoom = ctx.track('camera', 'z', t) || 1;
  const sx = wx => W / 2 + (wx - camX);                                 // world x -> screen x (before zoom)
  const world = [];

  // ---------- far layer: tall graphite columns at 0.4 parallax
  const par = 0.4, cx0 = camX * par, rng = mulberry32(7);
  const cols = []; for (let i = -40; i < 120; i++) { const r = rng(); cols.push({ x: i * 300 + r * 140, w: 60 + rng() * 90, top: 160 + rng() * 260 }); }
  const topFloor = Math.min(...Object.values(A.lanes).map(l => l.floor_y));
  for (const c of cols) {
    const x = W / 2 + (c.x - cx0); if (x < -200 || x > W + 200) continue;
    world.push(`<rect x="${f1(x)}" y="${f1(c.top)}" width="${f1(c.w)}" height="${f1(topFloor - c.top - 40)}" fill="${PAL.dim}" opacity="0.32"/>`);
  }

  // ---------- lanes: floor line, streaking ticks (parallax 1), optional height line
  const L = A.line || null;
  const crossT = (() => { const T = L && ctx.tracks[L.watch]; if (!T) return 1e9; const i = T.h.findIndex(h => h >= L.h - 1); return i < 0 ? 1e9 : i / T.hz; })();
  const lit = ease.smooth(seg(t, crossT - 0.05, crossT + 0.35)) * (1 - 0.5 * ease.smooth(seg(t, crossT + 1.4, crossT + 2.6)));
  for (const [ln, lane] of Object.entries(A.lanes)) {
    const F = lane.floor_y;
    world.push(`<line x1="-400" y1="${F}" x2="${W + 400}" y2="${F}" stroke="${PAL.dim}" stroke-width="4"/>`);
    const step = 140, first = Math.floor((camX - W) / step) * step;
    for (let wx = first; wx < camX + W; wx += step) { const x = sx(wx); world.push(`<line x1="${f1(x)}" y1="${F + 10}" x2="${f1(x)}" y2="${F + (wx % 700 === 0 ? 34 : 20)}" stroke="${PAL.grey}" stroke-width="3" opacity="${wx % 700 === 0 ? 0.5 : 0.25}"/>`); }
    if (L) {
      const y = F - L.h - R;
      world.push(`<line x1="-400" y1="${f1(y)}" x2="${W + 400}" y2="${f1(y)}" stroke="${PAL.grey}" stroke-width="3" stroke-dasharray="14 14" opacity="${f1(0.3 * (1 - lit))}"/>
        <line x1="-400" y1="${f1(y)}" x2="${W + 400}" y2="${f1(y)}" stroke="${PAL.gold}" stroke-width="4" opacity="${f1(lit)}"/>
        <line x1="-400" y1="${f1(y)}" x2="${W + 400}" y2="${f1(y)}" stroke="${PAL.gold}" stroke-width="16" opacity="${f1(0.4 * lit)}" filter="url(#glowSm)"/>`);
    }
  }

  // ---------- balls
  const labels = [];
  for (const [name, b] of Object.entries(A.balls)) {
    const lane = A.lanes[b.lane], F = lane.floor_y, gold = b.color === 'gold', T = ctx.tracks[name];
    const h = ctx.track(name, 'h', t), v = ctx.track(name, 'v', t), wx = ctx.track(name, 'x', t);
    let squash = 0;
    for (const [ti, vi] of T.impacts) { const d = t - ti; if (d > -0.03 && d < 0.09) squash = Math.max(squash, clamp(vi / 2200, 0, 0.3) * Math.cos(d / 0.09 * Math.PI / 2) ** 2); }
    const stretch = clamp(Math.abs(v) / 5200, 0, 0.12) * (h > R * 0.5 ? 1 : 0);
    const syk = 1 - squash + stretch, sxk = 1 / Math.sqrt(syk);
    const x = sx(wx), cy = F - h - R * syk;
    const k = clamp(1 - h / 700, 0.3, 1);
    world.push(`<ellipse cx="${f1(x)}" cy="${F + 6}" rx="${f1(R * 1.1 * k * sxk)}" ry="${f1(R * 0.22 * k)}" fill="#000" opacity="${f1(0.65 * k)}" filter="url(#shadow)"/>`);
    const dimRest = (b.dim_on_rest ?? !gold) && T.rest_at && t > T.rest_at ? 1 - 0.35 * ease.smooth(seg(t, T.rest_at + 0.5, T.rest_at + 2.5)) : 1;
    const spin = ((wx - b.x) / R) * 180 / Math.PI;                       // rolling: the seam turns with distance travelled
    const fill = gold ? 'url(#sphere)' : PAL.white;
    const glow = gold ? `<ellipse cx="${f1(x)}" cy="${f1(cy)}" rx="${f1(R * 1.5 * sxk)}" ry="${f1(R * 1.5 * syk)}" fill="${PAL.gold}" opacity="0.28" filter="url(#glow)"/>` : '';
    const clip = `bc_${name}`;
    world.push(`<g opacity="${f1(dimRest)}">${glow}<clipPath id="${clip}"><ellipse cx="${f1(x)}" cy="${f1(cy)}" rx="${f1(R * sxk)}" ry="${f1(R * syk)}"/></clipPath>
      <ellipse cx="${f1(x)}" cy="${f1(cy)}" rx="${f1(R * sxk)}" ry="${f1(R * syk)}" fill="${fill}"/>
      <g clip-path="url(#${clip})"><g transform="translate(${f1(x)} ${f1(cy)}) rotate(${f1(spin)}) scale(${sxk.toFixed(3)} ${syk.toFixed(3)})"><path d="M${-R} 0 Q0 ${R * 0.35} ${R} 0" stroke="${gold ? PAL.goldDeep : '#b9b5ac'}" stroke-width="5" fill="none" opacity="0.8"/></g></g>
      <ellipse cx="${f1(x - R * 0.32 * sxk)}" cy="${f1(cy - R * 0.36 * syk)}" rx="${f1(R * 0.17 * sxk)}" ry="${f1(R * 0.17 * syk)}" fill="#fff" opacity="${gold ? 0.55 : 0.35}"/></g>`);
    const lop = ease.smooth(seg(t, 0.4, 1.2));
    labels.push(`<text x="${W - 64}" y="${F - 26}" text-anchor="end" class="f2" font-size="34" letter-spacing="6" fill="${gold ? PAL.gold : PAL.white}" opacity="${f1(lop * (gold ? 1 : 0.8 * dimRest))}">${esc(b.label)}</text>`);
  }
  // camera push-in about the frame centre; lane labels stay fixed like titles
  items.push({ z: 0, svg: `<g transform="translate(${W / 2} ${H * 0.6}) scale(${zoom.toFixed(4)}) translate(${-W / 2} ${-H * 0.6})">${world.join('')}</g>${labels.join('')}` });
  return items;
});
