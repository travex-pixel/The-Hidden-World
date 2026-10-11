/* THE QUIET GAME · Round 2, Part 3/6 — The Chair. */
(function () {
  const E = window.HW, Q = window.QG, R = window.QR; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const noChair = (x, y, k) => `<g opacity="${f1(k)}"><rect x="${x - 120}" y="${y - 260}" width="240" height="300" rx="40" fill="none" stroke="#ffd36b" stroke-width="8" stroke-dasharray="26 18"/><text x="${x}" y="${y - 70}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="150" fill="#ffd36b">?</text></g>`;
  const chair = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-120" y="-330" width="240" height="300" rx="40" fill="#3b4a5c" stroke="${Q.LINE}" stroke-width="5"/><rect x="-100" y="-310" width="200" height="120" rx="26" fill="#4a5c70"/></g>`;
  const label = (x, y, text, k) => k <= 0 ? '' : `<g transform="translate(${x} ${y}) scale(${f1(ease.back(clamp(k, 0, 1)))})"><rect x="-150" y="-34" width="300" height="60" rx="30" fill="#ffd36b"/><text x="0" y="8" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="32" fill="#1c2430">${text}</text><path d="M-14 26 L0 50 L14 26Z" fill="#ffd36b"/></g>`;
  E.registerScenes({
    r3_hook(ctx) {
      const { t } = ctx;
      setCam(lerp(1.12, 1.2, sm(t, 0, 3)) + punch(t, 0.1, 0.08), 560, 1000, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.9 });
      s += layer(1, person('max', { x: 260, y: 1330, s: 1.85, legs: true, ...alive(t, 0.5), ex: 'shocked', look: [0.9, 0.5], turn: 0.4, arms: { l: [-40, -10], r: [-40, -10] }, lit: -1 }));
      s += layer(1.05, Q.desk(380, 1420, 900, { h: 600, monitor: false }) + R.monitor(860, 1380, 1.05, false) + noChair(640, 1470, 1));
      return Q.frame(ctx, s, GRADE.morning, { y: 1450 });
    },
    r3_found(ctx) {
      const { t } = ctx; const l2 = LS(ctx, 2);
      setCam(lerp(1.05, 1.12, sm(t, 0, 4)) + punch(t, l2, 0.05), 560, 1000, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.8 });
      s += layer(1, chair(780, 1560, 1.6) + person('kemi', { x: 780, y: 1560, s: 1.95, ...alive(t, 1.1), ex: t < l2 ? 'warm' : 'unsure', look: [-0.8, -0.2], turn: -0.45, mouth: talk(ctx, 'kemi'), lit: -1 }));
      s += layer(1, person('max', { x: 280, y: 1330, s: 1.85, legs: true, ...alive(t, 0.5), ex: t < l2 ? 'curious' : R.DEFENSIVE, look: [0.85, 0.15], turn: 0.45, mouth: talk(ctx, 'max'), lit: -1 }));
      s += layer(1.05, Q.desk(560, 1440, 700, { h: 600, mx: 520, mw: 200 }));
      s += layer(1, label(780, 700, "MAX'S CHAIR", seg(t, 0.3, 0.6)));
      return Q.frame(ctx, s, GRADE.day, { y: 1450 });
    },
    r3_hide(ctx) {
      const { t } = ctx; const slide = sm(t, 0.1, 0.45);
      setCam(lerp(1.05, 1.15, sm(t, 0, 3)) + punch(t, LS(ctx, 1), 0.06), 560, 1000, ctx.gt);
      let s = blurSet(1, Q.officeSet(t, { warm: 0.8 }));
      s += layer(1, chair(540, 1700, 2.0) + person('kemi', { x: 540, y: 1700, s: 2.3, ...alive(t, 1.1), ex: t < LS(ctx, 1) ? 'shocked' : R.FORCED, look: [-0.8, 0], turn: -0.2, mouth: talk(ctx, 'kemi'), lit: 1, arms: { l: [-10, 80], r: [mix(-30, -5, slide), mix(60, 70, slide)] }, armsFront: true }));
      s += layer(1.05, Q.meetingTable(1600, { top: '#a07a52' }) + item('envelope', lerp(760, 610, slide), lerp(1500, 1640, slide), { s: 1.2, rot: lerp(-20, 0, slide) }) + `<rect x="420" y="1600" width="420" height="70" rx="10" fill="#2a2d33" stroke="${Q.LINE}" stroke-width="4"/>`);
      return Q.frame(ctx, s, GRADE.day, { y: 1440 });
    },
    r3_broken(ctx) {
      const { t } = ctx; const sink = ease.in(seg(t, 0.4, 0.6));
      setCam(1.1 + punch(t, 0.55, 0.08), 520, 1000, ctx.gt, t > 0.55 && t < 0.85 ? 8 : 0);
      let s = Q.officeSet(t, { warm: 0.6 });
      s += layer(1, chair(400, 1560 + sink * 160, 1.6) + person('max', { x: 400, y: lerp(1300, 1530, ease.inOut(seg(t, 0, 0.4))) + sink * 160, s: 2.0, ...alive(t, 0.5), ex: t < 0.6 ? 'neutral' : t < LS(ctx, 0) ? 'shocked' : { b: [0.2, -0.3], smile: -0.3, lid: 0.55, squint: 0 }, look: t > 0.6 ? [0, 0] : [0.3, 0.5], mouth: talk(ctx, 'max'), lit: -1 }));
      s += layer(1.05, Q.desk(-120, 1420, 1320, { h: 600, monitor: false }) + R.monitor(860, 1380, 1.05, false));
      return Q.frame(ctx, s, GRADE.day, { y: 1450 });
    },
    r3_whisper(ctx) {
      const { t } = ctx; const l0 = LS(ctx, 0);
      setCam(lerp(1.0, 1.08, sm(t, 0, 3)) + punch(t, l0 + 0.2, 0.08), 540, 980, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.7 });
      s += layer(0.75, person('theo', { x: 840, y: 1060, s: 0.9, ...alive(t, 0.3), ex: t > LS(ctx, 1) - 0.1 ? 'smug' : 'curious', look: [-0.8, 0], turn: -0.3, mouth: talk(ctx, 'theo'), lit: -1 }) + person('kemi', { x: 700, y: 1070, s: 0.9, ...alive(t, 1.1), ex: 'smug', look: [0.8, 0], turn: 0.4, lean: 8, mouth: talk(ctx, 'kemi'), lit: -1 }) + Q.desk(560, 1020, 420, { h: 300, monitor: false }));
      s += layer(1.05, person('max', { x: 360, y: 1760, s: 2.3, ...alive(t, 0.5), ex: t > l0 + 0.15 ? 'shocked' : R.DEFENSIVE, look: t > l0 + 0.15 ? [0.9, -0.1] : [0, 0.2], turn: t > l0 + 0.15 ? 0.3 : 0, lit: -1, blink: 0 }));
      return Q.frame(ctx, s, GRADE.day, { y: 1450 });
    },
    r3_cliff(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.15, sm(t, 0, 3)), 540, 960, ctx.gt);
      let s = blurSet(2, Q.officeSet(t, { warm: 0.4 }));
      s += layer(1, person('max', { x: 540, y: 1900, s: 3.0, ...alive(t, 0.5), ex: R.DEFENSIVE, look: [0.6, 0], turn: 0.15, lit: -1 }));
      return Q.frame(ctx, s, GRADE.dusk, { y: 1450 });
    },
  });
})();
