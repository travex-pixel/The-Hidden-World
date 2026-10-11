/* THE QUIET GAME · Round 3, Counter-Move #3 — The Price (anchoring). */
(function () {
  const E = window.HW, Q = window.QG, R = window.QR, T = window.Q3; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const tag = (x, y, text, k, col = '#ff5a4a') => k <= 0 ? '' : `<g transform="translate(${x} ${y}) rotate(-8) scale(${f1(ease.back(clamp(k, 0, 1)))})"><rect x="-90" y="-46" width="180" height="92" rx="14" fill="${col}" stroke="${Q.LINE}" stroke-width="4"/><text x="0" y="20" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="58" fill="#ffffff">${text}</text></g>`;
  function shot(ctx, o) {
    const t = ctx.t;
    return R.deskShot(ctx, { sitter: o.sitter || 'kemi', visitor: 'jo', vx: 860, me: { look: [0.85, -0.35], turn: 0.35, ...(o.me || {}) }, them: { ex: T.SLY, look: [-0.7, 0.3], turn: -0.4, ...(o.them || {}) },
      bg: o.bg || '', noMonitor: true, items: T.forSale(700, 1290, 1.25, '£400', o.strike || 0) + tag(560, 1040, '£200', o.second || 0) });
  }
  E.registerScenes({
    pr_hook(ctx) {
      const { t } = ctx;
      setCam(lerp(1.05, 1.15, sm(t, 0, 3)) + punch(t, 0.2, 0.06), 600, 1050, ctx.gt);
      return Q.frame(ctx, shot(ctx, { me: { ex: 'curious' } }), GRADE.day, { y: 1500 });
    },
    pr_pitch(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1);
      setCam(lerp(1.08, 1.16, sm(t, 0, 4)) + punch(t, l1 + 0.1, 0.05), 600, 1050, ctx.gt);
      return Q.frame(ctx, shot(ctx, { me: { ex: t > l1 ? 'hopeful' : 'curious' }, strike: sm(t, l1, l1 + 0.3), second: seg(t, l1 + 0.1, l1 + 0.4) }), GRADE.day, { y: 1500 });
    },
    pr_almost(ctx) {
      const { t } = ctx;
      setCam(lerp(1.15, 1.3, sm(t, 0, 2.4)), 500, 1000, ctx.gt);
      let s = shot(ctx, { me: { ex: 'warm', look: [0.5, 0.6], arms: { l: [-8, 70], r: [mix(6, -30, sm(t, 0.1, 0.6)), mix(4, 60, sm(t, 0.1, 0.6))] } }, strike: 1, second: 1 });
      s += layer(1, thought(330, 640, 360, 880, 'Half price! That’s…', seg(t, 0.3, 0.55), { fs: 38, chars: 10 }));
      return Q.frame(ctx, s, GRADE.day, { y: 1500 });
    },
    pr_check(ctx) {
      const { t } = ctx; const cut = LS(ctx, 1) - 0.1;
      if (t < cut) {
        setCam(lerp(1.0, 1.08, sm(t, 0, cut)) + punch(t, LS(ctx, 0) + 0.5, 0.05), 540, 900, ctx.gt);
        return Q.frame(ctx, T.listing(t, { title: '24" monitor (same model)', sub: 'Used · good condition', price: '£90' }), GRADE.day, { y: 1560 });
      }
      setCam(1.12 + punch(t, cut, 0.05), 600, 1050, ctx.gt);
      return Q.frame(ctx, shot(ctx, { me: { ex: T.CALM }, them: { ex: { b: [0.7, 0.1], smile: 0.35, lid: 0.25, squint: 0.3 }, shrug: Math.sin(Math.PI * seg(t, cut, LE(ctx, 1))) }, strike: 1, second: 1 }), GRADE.day, { y: 1500 });
    },
    pr_twist(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1);
      setCam(lerp(1.05, 1.12, sm(t, 0, 4)) + punch(t, l1, 0.05), 600, 1050, ctx.gt);
      const bg = layer(0.75, person('kemi', { x: 160, y: 1030, s: 0.95, ...alive(t, 1.1), ex: t > l1 ? { b: [0.8, -0.3], smile: -0.2, lid: 0.7, squint: 0 } : 'curious', look: [0.8, 0], turn: 0.4, arms: t > l1 ? { l: [6, 4], r: [12, 165] } : undefined, lit: -1 }));
      return Q.frame(ctx, shot(ctx, { sitter: 'max', bg, me: { ex: t > l1 ? 'laugh' : 'curious', mouth: talk(ctx, 'max') }, strike: 1, second: 1 }), GRADE.day, { y: 1500 });
    },
    pr_lesson(ctx) { return T.lessonShot(ctx, () => shot(ctx, { me: { ex: 'warm' }, strike: 1, second: 1 }), GRADE.day); },
  });
})();
