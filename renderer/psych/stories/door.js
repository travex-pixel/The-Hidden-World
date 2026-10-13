/* Metaphor: door. One small figure, one oversized golden door. Hesitation, a few slow planted steps in a straight
   line, one touch, the door opens a sliver and warm light spills out. Fixed camera. Every timing is in episode.json.
   Walking uses true foot planting: the body position is derived from the stance foot staying fixed on the floor,
   so there is no sliding and the pace is set by the step windows, not by a speed constant. */
window.PS.registerStory('door', function (t, ctx) {
  const P = ctx.P, A = ctx.anim, { seg, ease, lerp, clamp, PAL, W, H, f1 } = P;
  const items = [];
  const D = A.door;                       // {x, y_top, w, h}: a double door, seam at x
  const FLOOR = A.floor_y;
  const S = A.figure_scale, dir = 1;
  const STRIDE = A.stride;                // leg amplitude (0..1); step length follows from the leg geometry

  // ---------- walk: phase advances by PI per step inside each step's window [t0, t]; eased so each step starts and stops softly
  const steps = A.steps;                  // [{t: landing time}], windows are [t - A.step_duration, t]
  let phase = 0;
  for (const st of steps) { const u = seg(t, st.t - A.step_duration, st.t); phase += Math.PI * ease.inOut(u); }
  // body x from foot planting: walk the phase from 0, planting whichever leg is in stance, in exact leg-local units
  function bodyX(ph) {
    let x = A.start_x, p = 0, stance = P.leg(0, STRIDE, 0, 1).swing ? -1 : 1;
    let planted = x + S * dir * P.leg(0, STRIDE, 0, stance).foot[0];
    while (true) {
      const next = Math.floor((p + Math.PI / 2) / Math.PI) * Math.PI + Math.PI / 2;   // next stance change
      const q = Math.min(ph, next);
      x = planted - S * dir * P.leg(q, STRIDE, 0, stance).foot[0];
      if (q >= ph) return x;
      p = q + 1e-6; stance = -stance; planted = x + S * dir * P.leg(p, STRIDE, 0, stance).foot[0];
    }
  }
  const x = bodyX(phase);
  const walking = steps.some(st => t > st.t - A.step_duration && t < st.t);
  const stride = walking ? STRIDE : STRIDE * (1 - ease.smooth(seg(t, steps[steps.length - 1].t, steps[steps.length - 1].t + 0.3)));

  // ---------- hesitation: one small forward lean that is withdrawn, then a slight head tilt. Nothing else.
  const h = A.hesitation;
  const leanIn = ease.smooth(seg(t, h.lean_at, h.lean_at + 0.9)) * (1 - ease.smooth(seg(t, h.lean_at + 1.5, h.lean_at + 2.4)));
  const tilt = (ease.smooth(seg(t, h.tilt_at, h.tilt_at + 0.8)) * (1 - ease.smooth(seg(t, h.tilt_at + 1.6, h.tilt_at + 2.4)))) * 7;
  const lean = leanIn * 5 + (walking ? 2.5 : 0);

  // ---------- the touch: the near arm rises to the seam and rests there
  const ru = ease.inOut(seg(t, A.reach[0], A.reach[1]));
  const handLocal = [(D.x - x) / S - 2, (A.touch_y - FLOOR) / S];   // seam in figure-local units
  const arms = ru > 0 ? 'reach_one' : 'rest';
  const reach = ru > 0 ? [lerp(22, handLocal[0], ru), lerp(-150, handLocal[1], ru)] : null;

  const F = P.figure({ x, y: FLOOR, scale: S, dir, phase, stride, lean, tilt, arms, reach, t });

  // ---------- the door and its light
  const open = ease.smooth(seg(t, A.open[0], A.open[1]));        // 0..1 over the reveal
  const gap = open * A.gap_px;                                    // seam width in px
  const glow = open;
  const halfW = D.w / 2;
  const door = (sx, flip) => `<g transform="translate(${f1(sx)} 0) scale(${flip} 1)">
      <rect x="0" y="${D.y_top}" width="${halfW}" height="${D.h}" fill="${PAL.block}" stroke="${PAL.goldDeep}" stroke-width="3"/>
      <rect x="${halfW * 0.16}" y="${D.y_top + D.h * 0.08}" width="${halfW * 0.68}" height="${D.h * 0.36}" fill="none" stroke="${PAL.goldDeep}" stroke-width="2" opacity="0.7"/>
      <rect x="${halfW * 0.16}" y="${D.y_top + D.h * 0.52}" width="${halfW * 0.68}" height="${D.h * 0.4}" fill="none" stroke="${PAL.goldDeep}" stroke-width="2" opacity="0.7"/>
      <circle cx="${halfW * 0.86}" cy="${D.y_top + D.h * 0.5}" r="7" fill="${PAL.gold}" opacity="0.9"/></g>`;
  const frame = `<rect x="${D.x - halfW - 26}" y="${D.y_top - 26}" width="${D.w + 52}" height="${D.h + 26}" fill="none" stroke="${PAL.gold}" stroke-width="5" opacity="0.55"/>`;
  // light behind the seam, spilling onto the floor and toward the figure
  const light = gap > 0.2 ? `
      <rect x="${f1(D.x - gap / 2)}" y="${D.y_top}" width="${f1(gap)}" height="${D.h}" fill="${PAL.goldHi}"/>
      <rect x="${f1(D.x - gap * 1.6)}" y="${D.y_top - 10}" width="${f1(gap * 3.2)}" height="${D.h + 20}" fill="${PAL.gold}" opacity="${f1(0.55 * glow)}" filter="url(#glow)"/>
      <polygon points="${f1(D.x - gap / 2)},${FLOOR} ${f1(D.x + gap / 2)},${FLOOR} ${f1(D.x + 150 + gap * 4)},${H} ${f1(D.x - 150 - gap * 4)},${H}" fill="${PAL.gold}" opacity="${f1(0.22 * glow)}" filter="url(#glow)"/>` : '';
  items.push({ z: 0, svg: `${frame}${light}${door(D.x - gap / 2, -1)}${door(D.x + gap / 2, 1)}` });
  items.push({ z: FLOOR, svg: F.svg });
  return items;
});
