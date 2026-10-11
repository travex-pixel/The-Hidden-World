/* THE QUIET GAME · Round 3, Counter-Move #6 — Everyone's In (social proof). */
(function () {
  const E = window.HW, Q = window.QG, R = window.QR, T = window.Q3; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const note = (x, y, s, v, rot = 0) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(${rot})"><rect x="-80" y="-42" width="160" height="84" rx="8" fill="#9cc79a" stroke="${Q.LINE}" stroke-width="4"/><circle cx="0" cy="0" r="24" fill="#7fb07c"/><text x="-52" y="-12" font-family="Nunito" font-weight="800" font-size="26" fill="#2d5a2a">£${v}</text></g>`;
  const ENV = { arms: { l: [-30, 60], r: [6, 4] }, hold: { l: { kind: 'envelope', s: 0.9 } } };
  const envLabel = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-170" y="-36" width="340" height="72" rx="12" fill="#ffd36b" stroke="${Q.LINE}" stroke-width="4"/><text x="0" y="14" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="34" fill="#1c2430">JO'S BIRTHDAY</text></g>`;
  const shot = (ctx, sitter, me, them, extra = {}) => R.deskShot(ctx, { sitter, visitor: 'ben', me: { look: [0.85, -0.35], turn: 0.35, ...me }, them: { look: [-0.7, 0.3], turn: -0.4, ...ENV, ...them }, ...extra });
  E.registerScenes({
    ev_hook(ctx) {
      const { t } = ctx;
      setCam(lerp(1.05, 1.15, sm(t, 0, 3)) + punch(t, 0.2, 0.06), 540, 980, ctx.gt);
      let s = blurSet(1, Q.officeSet(t, { warm: 0.8 }));
      s += layer(1, person('ben', { x: 540, y: 1700, s: 2.3, ...alive(t, 2.2), ex: T.SLY, look: [0.2, 0], lit: 1, arms: { l: [-10, 100], r: [-10, 100] }, armsFront: true, hold: { both: { kind: 'envelope', s: 1.6, dy: 10 } } }) + envLabel(540, 1350, 1.15));
      return Q.frame(ctx, s, GRADE.day, { y: 1500 });
    },
    ev_pitch(ctx) {
      const { t } = ctx;
      setCam(lerp(1.08, 1.15, sm(t, 0, 4)) + punch(t, LS(ctx, 2), 0.05), 600, 1000, ctx.gt);
      return Q.frame(ctx, shot(ctx, 'kemi', { ex: t > LS(ctx, 1) ? 'hopeful' : 'curious' }, { ex: T.SLY }), GRADE.day, { y: 1450 });
    },
    ev_almost(ctx) {
      const { t } = ctx;
      setCam(lerp(1.05, 1.15, sm(t, 0, 2.4)), 540, 980, ctx.gt);
      let s = blurSet(1, Q.officeSet(t, { warm: 0.6 }));
      s += layer(1, person('kemi', { x: 540, y: 1700, s: 2.3, ...alive(t, 1.1), ex: 'unsure', look: [0.3, 0.7], lit: 1, arms: { l: [6, 4], r: [mix(6, -20, sm(t, 0, 0.4)), mix(4, 110, sm(t, 0, 0.4))] } }) + note(700, 1300, 1.6, 20, -8));
      s += layer(1, thought(300, 660, 470, 860, "Can't be the only one who doesn't…", seg(t, 0.3, 0.55), { fs: 32, chars: 12 }));
      return Q.frame(ctx, s, GRADE.day, { y: 1500 });
    },
    ev_counter(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1);
      setCam(lerp(1.1, 1.18, sm(t, 0, 4)) + punch(t, LS(ctx, 0), 0.05) + punch(t, l1, 0.05), 600, 1000, ctx.gt);
      return Q.frame(ctx, shot(ctx, 'kemi', { ex: T.CALM }, { ex: t < l1 ? 'shocked' : { b: [0.9, -0.2], smile: 0.2, lid: 0.3, squint: 0.1 }, shrug: Math.sin(Math.PI * seg(t, l1, LE(ctx, 2))) }), GRADE.day, { y: 1450 });
    },
    ev_twist(ctx) {
      const { t } = ctx; const cut = LS(ctx, 1) - 0.1;
      if (t < cut) {
        setCam(1.12, 600, 1000, ctx.gt);
        return Q.frame(ctx, shot(ctx, 'kemi', { ex: T.CALM, arms: { l: [6, 4], r: [-40, -10] } }, { ex: 'warm' }, { items: note(700, 1360, 1.0, 10, 6) }), GRADE.day, { y: 1450 });
      }
      setCam(lerp(1.05, 1.12, sm(t, cut, cut + 2)) + punch(t, LS(ctx, 2), 0.05), 600, 1000, ctx.gt);
      const bg = layer(0.75, person('kemi', { x: 160, y: 1060, s: 0.95, ...alive(t, 1.1), ex: t > LS(ctx, 2) ? 'laugh' : 'curious', mouth: t > LS(ctx, 2) ? 0.4 : 0, look: [0.8, 0], turn: 0.4, lit: -1 }));
      return Q.frame(ctx, shot(ctx, 'max', { ex: t > LS(ctx, 2) - 0.1 ? 'warm' : 'curious', mouth: talk(ctx, 'max') }, { ex: T.SLY }, { bg }), GRADE.day, { y: 1450 });
    },
    ev_lesson(ctx) { return T.lessonShot(ctx, () => shot(ctx, 'max', { ex: 'warm' }, { ex: T.SLY }), GRADE.day); },
  });
})();
