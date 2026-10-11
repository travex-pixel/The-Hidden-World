/* THE QUIET GAME · Round 3, Counter-Move #2 — The Big Ask (door-in-the-face). */
(function () {
  const E = window.HW, Q = window.QG, R = window.QR, T = window.Q3; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  function shot(ctx, me, them, items = '') {
    let s = Q.officeSet(ctx.t, { warm: 0.6 });
    s += layer(1, person('theo', { x: 360, y: 1530, s: 2.0, ...alive(ctx.t, 0.3), look: [0.85, -0.3], turn: 0.4, mouth: talk(ctx, 'theo'), lit: -1, ...me }));
    s += layer(1, person('ben', { x: 800, y: 1450, s: 2.0, ...alive(ctx.t, 2.2), look: [-0.8, 0.25], turn: -0.5, lean: -6, mouth: talk(ctx, 'ben'), arms: { l: [-10, 30], r: [10, 30] }, lit: -1, ...them }));
    return s + layer(1.05, Q.desk(-120, 1420, 1320, { h: 600, mx: 150, mw: 260 }) + items);
  }
  E.registerScenes({
    ba_hook(ctx) {
      const { t } = ctx;
      setCam(lerp(1.05, 1.15, sm(t, 0, 3)) + punch(t, 0.15, 0.05), 560, 980, ctx.gt);
      return Q.frame(ctx, shot(ctx, { ex: 'curious' }, { ex: T.PUPPY }), GRADE.late, { y: 1450 });
    },
    ba_big(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1);
      setCam(lerp(1.1, 1.18, sm(t, 0, 4)) + punch(t, LS(ctx, 0) + 0.6, 0.05) + punch(t, l1, 0.04), 560, 980, ctx.gt);
      return Q.frame(ctx, shot(ctx, { ex: t < l1 ? 'shocked' : { b: [0.6, 0.4], smile: 0.5, lid: 0.15, squint: 0.3 } }, { ex: T.PUPPY }), GRADE.late, { y: 1450 });
    },
    ba_small(ctx) {
      const { t } = ctx; const e0 = LE(ctx, 0);
      setCam(lerp(1.1, 1.25, sm(t, 0, e0 + 1.3)), lerp(560, 460, sm(t, e0, e0 + 0.6)), 980, ctx.gt);
      let s = shot(ctx, { ex: t < e0 ? 'curious' : { b: [0.6, 0.1], smile: 0.35, lid: 0.1, squint: 0.2 } }, { ex: T.PUPPY });
      s += layer(1, thought(330, 640, 360, 880, 'Well… compared to a week…', seg(t, e0 + 0.1, e0 + 0.35), { fs: 36, chars: 11 }));
      return Q.frame(ctx, s, GRADE.late, { y: 1450 });
    },
    ba_notice(ctx) {
      const { t } = ctx;
      setCam(lerp(1.25, 1.45, sm(t, 0, 2.6)) + punch(t, 0.3, 0.06), 400, 960, ctx.gt);
      let s = shot(ctx, { ex: ex('curious', T.CALM, sm(t, 0.8, 1.4)), look: [0.3, -0.5], blink: 0 }, { ex: T.PUPPY });
      s += layer(1, thought(560, 780, 380, 900, "Wait. Would I say yes if he'd asked that FIRST?", seg(t, 0.3, 0.55), { fs: 30, chars: 14 }));
      return Q.frame(ctx, s, GRADE.late, { y: 1450 });
    },
    ba_counter(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1);
      setCam(lerp(1.12, 1.08, sm(t, 0, 4)) + punch(t, l1, 0.05), 560, 980, ctx.gt);
      return Q.frame(ctx, shot(ctx, { ex: T.CALM }, { ex: t < l1 - 0.3 ? 'shocked' : { b: [0.7, 0.1], smile: 0.4, lid: 0.25, squint: 0.3 }, lean: 0 }), GRADE.day, { y: 1450 });
    },
    ba_twist(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1), cup = t > l1 + 0.05;
      setCam(lerp(1.05, 1.15, sm(t, 0, 4)) + punch(t, l1 + 0.05, 0.05), 600, 1000, ctx.gt);
      const cupSvg = cup ? item('cup', 700, lerp(1330, 1390, ease.in(seg(t, l1 + 0.05, l1 + 0.17))), { s: 1.4, steam: true }) : '';
      return Q.frame(ctx, shot(ctx, { ex: 'warm', arms: { l: [-8, 70], r: [mix(6, -35, Math.sin(Math.PI * seg(t, l1 - 0.2, l1 + 0.5))), -15] } },
        { ex: t > l1 + 0.3 ? 'suspicious' : 'warm', look: t > l1 + 0.3 ? [-0.6, 0.8] : [-0.8, 0.25], lean: 0 }, cupSvg), GRADE.morning, { y: 1450 });
    },
    ba_lesson(ctx) { return T.lessonShot(ctx, () => shot(ctx, { ex: 'warm' }, { ex: 'suspicious' }), GRADE.morning); },
  });
})();
