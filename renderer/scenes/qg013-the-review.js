/* THE QUIET GAME · Round 2, Part 5/6 — The Review. */
(function () {
  const E = window.HW, Q = window.QG, R = window.QR; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const SERIOUS = { b: [-0.35, 0.1], smile: -0.25, lid: 0.15, squint: 0.1 };
  const office = t => Q.meetingSet(t, { board: [{ text: 'PROBATION' }, { text: 'REVIEW: MAX', color: '#c0392b' }] });
  function two(ctx, maxO, rosaO, items = '') {
    let s = office(ctx.t);
    s += layer(1, person('max', { x: 300, y: 1620, s: 2.0, ...alive(ctx.t, 0.5), look: [0.85, -0.1], turn: 0.45, mouth: talk(ctx, 'max'), lit: 1, ...maxO }));
    s += layer(1, person('rosa', { x: 790, y: 1620, s: 2.0, ...alive(ctx.t, 0.7), look: [-0.85, -0.1], turn: -0.45, mouth: talk(ctx, 'rosa'), lit: -1, ...rosaO }));
    return s + layer(1.05, Q.meetingTable(1560, { top: '#a07a52' }) + items);
  }
  E.registerScenes({
    r5_hook(ctx) {
      const { t } = ctx;
      setCam(lerp(1.2, 1.05, sm(t, 0, 4)) + punch(t, LS(ctx, 1), 0.05), 540, 960, ctx.gt);
      return Q.frame(ctx, two(ctx, { ex: R.DEFENSIVE }, { ex: SERIOUS }), GRADE.cold, { y: 1440 });
    },
    r5_talk(ctx) {
      const { t } = ctx; const l2 = LS(ctx, 2);
      setCam(lerp(1.05, 1.15, sm(t, 0, 5)) + punch(t, LS(ctx, 1), 0.04) + punch(t, l2, 0.07), lerp(600, 420, sm(t, l2 - 0.2, l2 + 0.2)), 980, ctx.gt);
      return Q.frame(ctx, two(ctx, { ex: t < l2 ? R.DEFENSIVE : { b: [-1.1, 0.4], smile: -0.6, lid: 0.05, squint: 0.2 }, lean: t > l2 ? 6 : 0 }, { ex: SERIOUS }), GRADE.cold, { y: 1440 });
    },
    r5_slam(ctx) {
      const { t } = ctx; const hit = 0.12, down = sm(t, 0, hit);
      setCam(1.12 + punch(t, hit, 0.1), 540, 1000, ctx.gt, t > hit && t < hit + 0.3 ? 10 : 0);
      const note = t > hit ? item('sticky', 545, 1640, { s: 0.85, rot: -6, text: R.NOTE, fs: 34 }) : '';
      return Q.frame(ctx, two(ctx, { ex: { b: [-1.1, 0.4], smile: -0.6, lid: 0.05, squint: 0.2 }, arms: { l: [6, 4], r: [mix(-120, -25, down), mix(40, 60, down)] }, lean: 6 },
        { ex: t < LS(ctx, 0) ? 'shocked' : 'curious', look: [-0.4, 0.7] }, note), GRADE.cold, { y: 1440 });
    },
    r5_twist(ctx) {
      const { t } = ctx; const cut = LE(ctx, 1) + 0.1;
      if (t < cut) {
        setCam(lerp(1.0, 1.1, sm(t, 0, cut)) + punch(t, LS(ctx, 1), 0.07), 540, 960, ctx.gt);
        let s = blurSet(1, office(t));
        s += layer(1, person('rosa', { x: 540, y: 1700, s: 2.3, ...alive(t, 0.7), ex: t < LS(ctx, 1) ? 'curious' : 'shocked', look: t < LS(ctx, 1) ? [0.3, 0.5] : [-0.6, 0], mouth: talk(ctx, 'rosa'), lit: 1, arms: { l: [6, 4], r: [-20, 75] }, hold: { r: { kind: 'sticky', s: 0.6, text: R.NOTE, fs: 34, rot: -8, dy: 40 } } }) + Q.meetingTable(1600, { top: '#a07a52' }));
        return Q.frame(ctx, s, GRADE.cold, { y: 1440 });
      }
      setCam(1.1 + punch(t, cut, 0.08), 540, 960, ctx.gt);
      let s = blurSet(1, office(t)) + layer(1, person('max', { x: 540, y: 1700, s: 2.3, ...alive(t, 0.5), ex: 'shocked', blink: 0, look: [0.4, 0], lit: 1 }) + Q.meetingTable(1600, { top: '#a07a52' }));
      return Q.frame(ctx, s, GRADE.cold, { y: 1440 });
    },
    r5_cliff(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.15, sm(t, 0, 3)), 540, 960, ctx.gt);
      let s = blurSet(2, office(t));
      s += layer(1, person('max', { x: 540, y: 1900, s: 3.0, ...alive(t, 0.5), ex: { b: [-1.0, 0.4], smile: -0.4, lid: 0.3, squint: 0.3 }, look: [0.5, 0], turn: 0.2, lit: 1 }));
      return Q.frame(ctx, s, GRADE.dusk, { y: 1450 });
    },
  });
})();
