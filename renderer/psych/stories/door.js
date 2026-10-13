/* Metaphor: door. One small figure, one large golden door. A hesitation, one slow straight approach, one touch,
   the door opens a sliver and warm light spills out. Fixed camera. All timings live in episode.json -> animation.
   The walk is ONE smooth motion computed in pipeline/psych.py (walk_schedule): the body eases in and out once,
   the leg phase is solved from distance travelled so feet stay planted, and footfalls drive the soundtrack. */
window.PS.registerStory('door', function (t, ctx) {
  const P = ctx.P, A = ctx.anim, { seg, ease, lerp, PAL, H, f1 } = P;
  const items = [];
  const D = A.door, FLOOR = A.floor_y, S = A.figure_scale, dir = 1, Wk = A.walk;

  // ---------- body and legs from the precomputed walk; stride fades in/out so the standing pose has straight legs
  const wk = ctx.walkAt(t);
  const x = wk.x, phase = wk.phase;
  const inWalk = ease.smooth(seg(t, Wk.start, Wk.start + 0.35)) * (1 - ease.smooth(seg(t, Wk.end - 0.35, Wk.end)));
  const stride = Wk.stride * inWalk;

  // ---------- hesitation: one slow lean that is withdrawn, then one slow head tilt. All continuous.
  const h = A.hesitation;
  const leanIn = ease.smooth(seg(t, h.lean_at, h.lean_at + 1.1)) * (1 - ease.smooth(seg(t, h.lean_at + 1.7, h.lean_at + 2.8)));
  const tilt = (ease.smooth(seg(t, h.tilt_at, h.tilt_at + 1.2)) * (1 - ease.smooth(seg(t, h.tilt_at + 1.8, h.tilt_at + 2.8)))) * 5;
  const toLight = A.lean_to_light ? ease.smooth(seg(t, A.lean_to_light.at, A.lean_to_light.at + 1.6)) * A.lean_to_light.deg : 0;
  const lean = leanIn * 4 + 2.5 * inWalk + toLight;

  // ---------- the touch: the near arm rises to the seam and rests there
  const ru = ease.inOut(seg(t, A.reach[0], A.reach[1]));
  const handLocal = [(D.x - x) / S - 2, (A.touch_y - FLOOR) / S];
  const arms = ru > 0 ? 'reach_one' : 'swing';
  const reach = ru > 0 ? [lerp(22, handLocal[0], ru), lerp(-150, handLocal[1], ru)] : null;
  const F = P.figure({ x, y: FLOOR, scale: S, dir, phase, stride, lean, tilt, arms, reach, t });

  // ---------- the door and its light
  const open = ease.smooth(seg(t, A.open[0], A.open[1]));
  const gap = open * A.gap_px, halfW = D.w / 2;
  const door = (sx, flip) => `<g transform="translate(${f1(sx)} 0) scale(${flip} 1)">
      <rect x="0" y="${D.y_top}" width="${halfW}" height="${D.h}" fill="${PAL.block}" stroke="${PAL.goldDeep}" stroke-width="3"/>
      <rect x="${halfW * 0.16}" y="${D.y_top + D.h * 0.08}" width="${halfW * 0.68}" height="${D.h * 0.36}" fill="none" stroke="${PAL.goldDeep}" stroke-width="2" opacity="0.7"/>
      <rect x="${halfW * 0.16}" y="${D.y_top + D.h * 0.52}" width="${halfW * 0.68}" height="${D.h * 0.4}" fill="none" stroke="${PAL.goldDeep}" stroke-width="2" opacity="0.7"/>
      <circle cx="${halfW * 0.86}" cy="${D.y_top + D.h * 0.5}" r="6" fill="${PAL.gold}" opacity="0.9"/></g>`;
  const frame = `<rect x="${D.x - halfW - 22}" y="${D.y_top - 22}" width="${D.w + 44}" height="${D.h + 22}" fill="none" stroke="${PAL.gold}" stroke-width="4" opacity="0.55"/>`;
  const light = gap > 0.2 ? `
      <rect x="${f1(D.x - gap / 2)}" y="${D.y_top}" width="${f1(gap)}" height="${D.h}" fill="${PAL.goldHi}"/>
      <rect x="${f1(D.x - gap * 1.6)}" y="${D.y_top - 10}" width="${f1(gap * 3.2)}" height="${D.h + 20}" fill="${PAL.gold}" opacity="${f1(0.55 * open)}" filter="url(#glow)"/>
      <polygon points="${f1(D.x - gap / 2)},${FLOOR} ${f1(D.x + gap / 2)},${FLOOR} ${f1(D.x + 140 + gap * 4)},${H} ${f1(D.x - 140 - gap * 4)},${H}" fill="${PAL.gold}" opacity="${f1(0.22 * open)}" filter="url(#glow)"/>` : '';
  items.push({ z: 0, svg: `${frame}${light}${door(D.x - gap / 2, -1)}${door(D.x + gap / 2, 1)}` });
  items.push({ z: FLOOR, svg: F.svg });
  return items;
});
