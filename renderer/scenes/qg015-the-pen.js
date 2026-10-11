/* THE QUIET GAME · Round 3, Counter-Move #1 — The Pen (foot-in-the-door). */
(function () {
  const E = window.HW, Q = window.QG, R = window.QR, T = window.Q3; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const reach = k => ({ l: [6, 4], r: [mix(6, -40, k), mix(4, -10, k)] });
  const ask = { arms: { l: [-40, -10], r: [6, 4] } };
  const INV = (ctx, upTo) => {
    const n = ctx.ep.scenes.findIndex(s => s.id === ctx.scene.id);   // icons for earlier scenes are already there
    const at = i => (i < upTo ? -1 : 0.2);
    const items = [['PEN', T.penIcon, at(0)], ['CHARGER', () => T.charger(0, -20, 1.1), at(1)], ['LUNCH RUN', () => T.lunchBag(0, -6, 0.9), at(2)], ['CAR KEYS', () => T.keys(0, -16, 1.0), at(3)]].slice(0, upTo + 1);
    if (upTo === 3 && ctx.scene.id === 's06_counter') items[3][3] = { text: 'NO', at: LS(ctx, 0) + 0.5 };
    return T.inventory(ctx.t, items);
  };
  function shot(ctx, o) { return R.deskShot(ctx, { visitor: 'sam', ...o, them: { ex: T.SLY, look: [-0.7, 0.3], turn: -0.4, ...ask, ...(o.them || {}) }, me: { look: [0.85, -0.35], turn: 0.35, ...(o.me || {}) } }); }
  E.registerScenes({
    pn_hook(ctx) {
      const { t } = ctx; const k = Math.sin(Math.PI * seg(t, 0.2, 1.4));
      setCam(lerp(1.05, 1.15, sm(t, 0, 3)) + punch(t, 0.2, 0.05), 600, 1000, ctx.gt);
      return Q.frame(ctx, shot(ctx, { me: { ex: 'warm', arms: reach(k), hold: { r: { kind: 'pen', rot: 60 } } } }), GRADE.morning, { y: 1450 });
    },
    pn_pen(ctx) {
      const { t } = ctx; const give = t > LS(ctx, 1) + 0.2, k = give ? 1 - seg(t, LS(ctx, 1) + 0.2, LS(ctx, 1) + 0.6) : seg(t, 0.3, 0.7);
      setCam(lerp(1.08, 1.14, sm(t, 0, 3)), 600, 1000, ctx.gt);
      return Q.frame(ctx, shot(ctx, { me: { ex: 'warm', mouth: talk(ctx, 'max'), arms: reach(k), hold: give ? {} : { r: { kind: 'pen', rot: 60 } } }, them: { hold: give ? { l: { kind: 'pen', rot: -40 } } : {} } }), GRADE.morning, { y: 1450 }) + INV(ctx, 0);
    },
    pn_charger(ctx) {
      const { t } = ctx; const mv = sm(t, LS(ctx, 1) + 0.1, LS(ctx, 1) + 0.6);
      setCam(lerp(1.08, 1.14, sm(t, 0, 3)) + punch(t, LS(ctx, 0), 0.03), 600, 1000, ctx.gt);
      return Q.frame(ctx, shot(ctx, { me: { ex: t > LS(ctx, 1) ? 'unsure' : 'neutral' }, items: T.charger(lerp(560, 760, mv), 1360, 1.1) }), GRADE.day, { y: 1450 }) + INV(ctx, 1);
    },
    pn_lunch(ctx) {
      const { t } = ctx;
      setCam(lerp(1.08, 1.16, sm(t, 0, 3)) + punch(t, LS(ctx, 0), 0.03), 600, 1000, ctx.gt);
      return Q.frame(ctx, shot(ctx, { me: { ex: t > LS(ctx, 1) ? { b: [0.8, -0.2], smile: 0.1, lid: 0.15, squint: 0 } : 'unsure' }, items: T.lunchBag(640, 1360, 1.2) + T.charger(760, 1370, 0.9) }), GRADE.day, { y: 1450 }) + INV(ctx, 2);
    },
    pn_car(ctx) {
      const { t } = ctx; const e0 = LE(ctx, 0);
      setCam(lerp(1.1, 1.3, sm(t, 0, e0 + 1)) + punch(t, LS(ctx, 0) + 0.8, 0.06), lerp(600, 480, sm(t, e0, e0 + 0.8)), 1000, ctx.gt);
      let s = shot(ctx, { me: { ex: t > e0 ? 'unsure' : 'shocked', blink: 0 }, items: T.keys(640, 1370, 1.2) + T.lunchBag(470, 1370, 0.9) });
      s += layer(1, thought(720, 820, 470, 900, 'I said yes to everything else…', seg(t, e0 + 0.15, e0 + 0.4), { fs: 34, chars: 12 }));
      return Q.frame(ctx, s, GRADE.late, { y: 1450 }) + INV(ctx, 3);
    },
    pn_counter(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1);
      setCam(lerp(1.12, 1.05, sm(t, 0, 3)) + punch(t, LS(ctx, 0), 0.06), 600, 1000, ctx.gt);
      return Q.frame(ctx, shot(ctx, { me: { ex: T.CALM, arms: { l: [6, 4], r: [-10, 60] } }, them: { ex: t > l1 ? T.SLY : 'shocked', shrug: Math.sin(Math.PI * seg(t, l1, LE(ctx, 1) + 0.2)), arms: { l: [6, 4], r: [6, 4] } }, items: T.keys(560, 1375, 1.2) }), GRADE.late, { y: 1450 }) + INV(ctx, 3);
    },
    pn_lesson(ctx) { return T.lessonShot(ctx, () => shot(ctx, { me: { ex: T.CALM } }), GRADE.late); },
  });
})();
