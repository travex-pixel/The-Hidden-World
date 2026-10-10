/* THE QUIET GAME #3 — The Favour. Storyboard scenes; the shared look lives in qg-kit.js. */
(function () {
  const E = window.HW, Q = window.QG; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const CALM = { b: [-0.15, 0.1], smile: 0.25, lid: 0.15, squint: 0.2 };          // kind but firm
  const PUPPY = { b: [1.0, -0.2], smile: 0.4, lid: 0.0, squint: 0.1 };            // "after everything?"
  const bubbleK = (t, a, b) => Math.min(seg(t, a, a + 0.25), 1 - seg(t, b, b + 0.2));
  const deskFront = (items = '') => layer(1.05, Q.desk(-120, 1420, 1320, { h: 600, mx: 150, mw: 260 }) + items);
  // Theo (or whoever sits there) at the desk, Ben standing on the right
  function deskShot(ctx, o) {
    const t = ctx.t; let s = Q.officeSet(t, { warm: o.warm ?? 0.8 });
    if (o.bg) s += o.bg;
    s += layer(1, person(o.sitter || 'theo', { x: 400, y: 1530, s: 2.0, ...alive(t, 0.3), lit: -1, mouth: talk(ctx, o.sitter || 'theo'), ...o.theo }));
    if (o.ben) s += layer(1, person('ben', { x: o.benX || 850, y: 1610, s: 2.1, ...alive(t, 2.2), lit: -1, mouth: talk(ctx, 'ben'), ...o.ben }));
    return s + deskFront(o.items || '');
  }
  const cupOnDesk = (t, at, x = 650) => t < at ? '' : item('cup', x, lerp(1330, 1390, ease.in(seg(t, at, at + 0.12))), { s: 1.4, steam: true });

  E.registerScenes({
    // 1 — HOOK: the coffee arrives
    fv_hook(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.08, sm(t, 0, 4)) + punch(t, 0.45, 0.06), 600, 1000, ctx.gt);
      const reach = Math.sin(Math.PI * seg(t, 0.15, 0.8));
      const look = t < 0.5 ? [-0.6, 0.2] : t < 1.1 ? [0.5, 0.8] : [0.9, -0.4];
      return Q.frame(ctx, deskShot(ctx, {
        theo: { ex: t < 1.1 ? 'curious' : 'hopeful', look, turn: t > 1.1 ? 0.35 : 0, arms: { l: [-8, 70 + (t < 0.5 ? Math.sin(t * 20) * 4 : 0)], r: [-8, 70] }, armsFront: true },
        ben: { ex: 'warm', look: [-0.7, 0.3], turn: -0.4, arms: { l: [mix(6, -40, reach), mix(4, -20, reach)], r: [6, 4] } },
        items: cupOnDesk(t, 0.45),
      }), GRADE.morning, { y: 1450 });
    },

    // 2 — "no big deal"
    fv_coffee(ctx) {
      const { t } = ctx;
      setCam(lerp(1.08, 1.14, sm(t, 0, 3)) + punch(t, LS(ctx, 1), 0.04), 600, 1000, ctx.gt);
      return Q.frame(ctx, deskShot(ctx, {
        theo: { ex: t > LS(ctx, 1) - 0.1 ? 'warm' : 'hopeful', look: [0.9, -0.4], turn: 0.35, arms: { l: [-8, 70], r: [6, 4] }, armsFront: true },
        ben: { ex: 'warm', look: [-0.7, 0.3], turn: -0.4 },
        items: item('cup', 650, 1390, { s: 1.4, steam: true }),
      }), GRADE.morning, { y: 1450 });
    },

    // 3 — Tuesday: the calls
    fv_calls(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.08, sm(t, 0, 3.5)) + punch(t, LS(ctx, 2), 0.04), 560, 1000, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.6 });
      s += layer(0.9, person('ben', { x: 790, y: 1320, s: 1.6, ...alive(t, 2.2), ex: 'warm', look: [-0.8, 0.2], turn: -0.45, mouth: talk(ctx, 'ben'), arms: { l: [-5, 85], r: [-5, 85] }, armsFront: true, lit: -1 }) + Q.partition(430, 1180, 900, 500));
      s += layer(1, person('theo', { x: 340, y: 1560, s: 2.0, ...alive(t, 0.3), ex: t > LS(ctx, 2) - 0.1 ? 'warm' : 'curious', look: [0.85, -0.3], turn: 0.45, mouth: talk(ctx, 'theo'), lit: -1 }));
      s += deskFront(item('deskphone', 760, 1400, { s: 1.4 }) + item('cup', 600, 1390, { s: 1.3 }));
      return Q.frame(ctx, s, GRADE.day, { y: 1450 });
    },

    // 4 — Wednesday: the cupcake
    fv_cake(ctx) {
      const { t } = ctx; const le = LE(ctx, 0);
      setCam(lerp(1.0, 1.1, sm(t, 0, 3.5)) + punch(t, le + 0.3, 0.05), 560, 1000, ctx.gt);
      const eating = t > le + 0.1, leave = sm(t, le + 0.1, le + 0.9);
      const chew = eating ? Math.abs(Math.sin(t * 9)) * 0.35 : 0;
      let s = deskShot(ctx, {
        theo: { ex: eating ? { b: [0.8, -0.2], smile: -0.1, lid: 0.25, squint: 0 } : 'hopeful', look: eating ? [0, 0.6] : [0.9, -0.3], turn: eating ? 0 : 0.35, mouth: chew,
          arms: eating ? { l: [-8, 70], r: [-12, 150] } : { l: [-8, 70], r: [6, 4] }, armsFront: true, hold: eating ? { r: { kind: 'cupcake', s: 1.1, dy: -20 } } : {} },
        ben: { x: lerp(850, 1250, leave), ex: 'warm', look: [-0.7, 0.3], turn: -0.4, arms: { l: [mix(6, -35, Math.sin(Math.PI * seg(t, 0, 0.6))), -15], r: [6, 4] } },
        items: (eating ? '' : item('cupcake', 640, 1385, { s: 1.4 })) + item('cup', 220, 1390, { s: 1.2 }),
      });
      s += layer(1, thought(720, 700, 470, 860, 'I should do something for him…', seg(t, le + 0.3, le + 0.55), { fs: 34, chars: 12 }));
      return Q.frame(ctx, s, GRADE.late, { y: 1450 });
    },

    // 5 — Thursday: the ask
    fv_ask(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1), e1 = LE(ctx, 1);
      setCam(lerp(1.05, 1.2, sm(t, 0, 4)) + punch(t, l1, 0.06), 560, 980, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.4 });
      s += layer(1, person('theo', { x: 360, y: 1530, s: 2.0, ...alive(t, 0.3), ex: t < e1 ? 'curious' : ex('unsure', 'hurt', sm(t, e1 + 0.6, e1 + 1.0)), look: [0.85, -0.3], turn: 0.4, lit: -1, blink: t > e1 ? 0 : undefined }));
      s += layer(1, person('ben', { x: 800, y: 1450, s: 2.0, ...alive(t, 2.2), ex: t > l1 - 0.1 ? PUPPY : 'warm', look: [-0.8, 0.25], turn: -0.5, lean: -6, mouth: talk(ctx, 'ben'), arms: { l: [-10, 30], r: [10, 30] }, lit: -1 }));
      s += deskFront(item('cup', 600, 1390, { s: 1.2 }) + item('cupcake', 680, 1395, { s: 0.0001 }));
      s += layer(1, thought(400, 640, 360, 880, 'But I have plans…', bubbleK(t, e1 + 0.1, e1 + 0.6), { fs: 36, chars: 10 }) + thought(400, 640, 360, 880, '…but the coffee.', seg(t, e1 + 0.7, e1 + 0.9), { fs: 36, chars: 10 }));
      return Q.frame(ctx, s, GRADE.late, { y: 1450 });
    },

    // 6 — no
    fv_no(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1), e1 = LE(ctx, 1), l2 = LS(ctx, 2);
      setCam(1.2 + punch(t, l1, 0.08) - 0.1 * sm(t, l2 - 0.3, l2 + 0.4), lerp(500, 600, sm(t, l2 - 0.3, l2 + 0.4)), 980, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.4 });
      const breath = t < LS(ctx, 0) ? Math.sin(Math.PI * seg(t, 0.05, LS(ctx, 0))) : 0;
      s += layer(1, person('theo', { x: 360, y: 1530, s: 2.0, ...alive(t, 0.3), ex: t < LS(ctx, 0) - 0.05 ? 'unsure' : CALM, blink: breath > 0.6 ? 1 : 0, look: [0.85, -0.3], turn: 0.4, mouth: talk(ctx, 'theo'), lit: -1 }));
      const benE = t < e1 + 0.05 ? PUPPY : t < l2 ? ex(PUPPY, 'unsure', sm(t, e1, e1 + 0.3)) : ex('unsure', 'neutral', sm(t, l2, l2 + 0.3));
      s += layer(1, person('ben', { x: 800, y: 1450, s: 2.0, ...alive(t, 2.2), ex: benE, look: [-0.8, 0.25], turn: -0.5, lean: lerp(-6, 0, sm(t, e1, e1 + 0.5)), mouth: talk(ctx, 'ben'), shrug: Math.sin(Math.PI * seg(t, l2, LE(ctx, 2) + 0.2)), arms: { l: [-10, 30], r: [10, 30] }, lit: -1 }));
      s += deskFront(item('cup', 600, 1390, { s: 1.2 }));
      return Q.frame(ctx, s, GRADE.day, { y: 1450 });
    },

    // 7 — one week later: the next new guy
    fv_next(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.08, sm(t, 0, 3.5)) + punch(t, 0.75, 0.05), 620, 1000, ctx.gt);
      const reach = Math.sin(Math.PI * seg(t, 0.45, 1.1));
      const bg = layer(0.72, person('theo', { x: 700, y: 1030, s: 0.85, ...alive(t, 0.3), ex: 'smug', browAsym: 0.9, look: [-0.8, 0], turn: -0.4, arms: { l: [10, 120], r: [6, 4] }, hold: { l: { kind: 'mug', s: 0.9, dy: -16 } }, lit: -1 }) + Q.desk(560, 980, 380, { h: 300, mx: 330, mw: 120 }));
      return Q.frame(ctx, deskShot(ctx, {
        sitter: 'jo', bg, warm: 0.9, benX: 940,
        theo: { ex: t > LS(ctx, 1) - 0.1 ? 'warm' : 'curious', look: [0.9, -0.4], turn: 0.35, arms: { l: [-8, 70], r: [6, 4] }, armsFront: true },
        ben: { ex: 'warm', look: [-0.7, 0.3], turn: -0.4, arms: { l: [mix(6, -40, reach), mix(4, -20, reach)], r: [6, 4] } },
        items: cupOnDesk(t, 0.75),
      }), GRADE.morning, { y: 1450 });
    },

    // 8 — the cup
    fv_end(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.1, sm(t, 0, 5)), 540, 1000, ctx.gt);
      let s = blurSet(2, Q.officeSet(t, { warm: 0.9 }));
      s += layer(1.1, blurSet(2, person('ben', { x: lerp(760, 1250, sm(t, 0, 3.5)), y: 1700, s: 2.4, back: true, ...alive(t, 2.2), walk: t * 6, legs: true })));
      s += layer(1, `<rect x="-200" y="1250" width="${W + 400}" height="800" fill="#a07a52"/><rect x="-200" y="1250" width="${W + 400}" height="20" fill="#c09a6c"/>` + item('cup', 540, 1180, { s: 4.2 }));
      let steam = '';
      for (let i = 0; i < 4; i++) { const ph = (t * 0.5 + i / 4) % 1; steam += `<path d="M${500 + i * 25} ${f1(960 - ph * 300)} q30 -45 0 -90 q-30 -45 0 -90" stroke="#fff" stroke-width="10" fill="none" opacity="${f1(0.35 * Math.sin(ph * Math.PI))}" stroke-linecap="round"/>`; }
      s += layer(1, steam);
      return Q.frame(ctx, s, GRADE.morning, { noClock: true }) + Q.wordmark(sm(t, LE(ctx, 1) + 0.1, LE(ctx, 1) + 0.6));
    },
  });
})();
