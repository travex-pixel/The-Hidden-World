/* THE QUIET GAME #5 — The Group Chat. Storyboard scenes; the shared look lives in qg-kit.js. */
(function () {
  const E = window.HW, Q = window.QG; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const bubbleK = (t, a, b) => Math.min(seg(t, a, a + 0.25), 1 - seg(t, b, b + 0.2));
  const PHONE = { arms: { l: [8, 4], r: [-6, 108] }, hold: { r: { kind: 'phone', lit: true, s: 1.1, rot: -25, dy: 20 } } };
  const deskFront = (items = '') => layer(1.05, Q.desk(-120, 1420, 1320, { h: 600, mx: 150, mw: 260 }) + items);
  const sandwich = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-50 10 L50 10 L0 -40Z" fill="#e8c27a" stroke="${Q.LINE}" stroke-width="4"/><path d="M-44 4 L44 4" stroke="#7da35b" stroke-width="7"/></g>`;
  const MAIN = { title: 'Team', members: 'Rosa, Ben, Kemi, Jo, Sam, You', msgs: [{ mine: true, text: 'Anyone fancy lunch?', at: 0 }] };

  E.registerScenes({
    // 1 — HOOK: seen by 5
    gc_hook(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.12, sm(t, 0, 4)) + punch(t, 0.8, 0.05), 540, 820, ctx.gt);
      return Q.frame(ctx, layer(1, Q.chatScreen(t, { ...MAIN, seen: { text: 'Seen by 5', at: 0.8 } })), GRADE.day, { y: 1500 });
    },
    // 2 — waiting
    gc_wait(ctx) {
      const { t } = ctx;
      setCam(lerp(1.05, 1.15, sm(t, 0, 2.8)), 480, 980, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.6 });
      s += layer(1, person('theo', { x: 400, y: 1530, s: 2.0, ...alive(t, 0.3), ex: ex('hopeful', 'unsure', sm(t, 0.8, 2.0)), look: [0.1, 0.85], lit: -1, ...PHONE }));
      s += deskFront(item('cup', 760, 1390, { s: 1.2 }));
      s += layer(1, thought(760, 700, 470, 860, "Maybe they're busy.", seg(t, 0.5, 0.75), { fs: 36, chars: 10 }));
      return Q.frame(ctx, s, GRADE.day, { y: 1450 });
    },
    // 3 — the laugh across the room
    gc_laugh(ctx) {
      const { t } = ctx; const e0 = LE(ctx, 0);
      setCam(lerp(1.0, 1.08, sm(t, 0, 3)) + punch(t, LS(ctx, 0), 0.04), 560, 1000, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.6 });
      const laugh = (k) => ({ ex: 'laugh', mouth: 0.4 + 0.3 * Math.abs(Math.sin(t * 9 + k)) });
      let grp = '';
      [['jo', 560, 1.0], ['kemi', 700, 0.4], ['sam', 980, 2.1]].forEach(([id, x, ph]) => { grp += person(id, { x, y: 1180, s: 1.0, ...alive(t, ph), ...laugh(ph), look: [0, 0.6], ...PHONE, lit: -1 }); });
      grp += person('ben', { x: 840, y: 1190, s: 1.05, ...alive(t, 2.2), ex: 'laugh', mouth: talk(ctx, 'ben') || 0.5, look: [-0.2, 0.6], ...PHONE, lit: -1 });
      s += layer(0.8, grp + Q.desk(420, 1150, 700, { h: 400, monitor: false }));
      s += layer(1.1, person('theo', { x: 200, y: 1760, s: 2.2, ...alive(t, 0.3), ex: t > e0 ? 'unsure' : 'curious', look: [1, -0.15], turn: 0.55, lit: -1, ...PHONE }));
      s += layer(1.1, thought(300, 760, 230, 1060, 'Is there… another chat?', seg(t, e0 + 0.25, e0 + 0.5), { fs: 36, chars: 11 }));
      return Q.frame(ctx, s, GRADE.day, { y: 1450 });
    },
    // 4 — lunch alone
    gc_alone(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.15, sm(t, 0, 3.4)), 480, 980, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.3 });
      const chew = Math.abs(Math.sin(t * 8)) * 0.3 * (t < 1.4 ? 1 : 0);
      s += layer(1, person('theo', { x: 400, y: 1530, s: 2.0, ...alive(t, 0.3), ex: ex('unsure', 'hurt', sm(t, 0.8, 1.8)), look: [0.4, 0.8], mouth: chew, lit: -1, arms: { l: [-10, 130], r: [-8, 70] }, armsFront: true }));
      s += deskFront(sandwich(250, 1405, 1.2) + `<g transform="translate(700 1395) rotate(-80)">${item('phone', 0, 0, { lit: true, s: 1.5 })}</g><text x="760" y="1360" font-family="Nunito" font-weight="800" font-size="26" fill="#c9d3dd">Seen by 5</text>`);
      s += layer(1, thought(740, 700, 470, 860, 'What did I do?', seg(t, 0.6, 0.85), { fs: 38, chars: 9 }));
      return Q.frame(ctx, s, GRADE.dusk, { y: 1450 });
    },
    // 5 — Kemi
    gc_kemi(ctx) {
      const { t } = ctx; const l2 = LS(ctx, 2), l3 = LS(ctx, 3);
      setCam(lerp(1.05, 1.15, sm(t, 0, 4)) + punch(t, l2, 0.04) + punch(t, l3, 0.05), 600, 1000, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.6 });
      s += layer(1, person('theo', { x: 400, y: 1530, s: 2.0, ...alive(t, 0.3), ex: t > l3 ? 'shocked' : t > LS(ctx, 1) ? 'hurt' : 'unsure', look: [0.9, -0.4], turn: 0.35, mouth: talk(ctx, 'theo'), lit: -1 }));
      s += layer(1, person('kemi', { x: 850, y: 1610, s: 2.05, ...alive(t, 1.1), ex: t > l2 ? ex('curious', 'shocked', sm(t, l2, l2 + 0.4)) : 'curious', look: [-0.7, 0.3], turn: -0.4, mouth: talk(ctx, 'kemi'), lit: -1 }));
      return Q.frame(ctx, s + deskFront(item('phone', 680, 1400, { s: 1.3, rot: -80 })), GRADE.day, { y: 1450 });
    },
    // 6 — the other chat
    gc_other(ctx) {
      const { t } = ctx; const e1 = LE(ctx, 1);
      setCam(lerp(1.0, 1.1, sm(t, 0, 4)) + punch(t, e1 + 0.15, 0.05), 540, 820, ctx.gt);
      const msgs = [{ who: 'Ben', color: '#2c8579', text: 'STILL damp from that camping trip', at: 0.1 }, { who: 'Sam', color: '#b07a3a', text: 'never. again.', at: 0.45 },
        { who: 'Jo', color: '#56687b', text: 'lunch at 12?', at: 0.8 }, { system: true, text: 'Kemi added Theo', at: e1 + 0.1 }];
      return Q.frame(ctx, layer(1, Q.chatScreen(t, { title: 'Team (NO ROSA)', members: 'Ben, Kemi, Jo, Sam', groupColor: '#d0544a', msgs })), GRADE.day, { y: 1500 });
    },
    // 7 — same.
    gc_same(ctx) {
      const { t } = ctx; const l0 = LS(ctx, 0);
      setCam(lerp(1.15, 1.0, sm(t, 0, 6)), 600, 1000, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.9 });
      s += layer(1, person('theo', { x: 400, y: 1530, s: 2.0, ...alive(t, 0.3), ex: t < l0 - 0.2 ? 'laugh' : 'warm', mouth: talk(ctx, 'theo') || (t < l0 - 0.2 ? 0.4 : 0), look: [0.1, 0.85], lit: -1, ...PHONE }));
      s += layer(1, person('kemi', { x: 850, y: 1610, s: 2.05, ...alive(t, 1.1), ex: 'warm', look: [-0.7, 0.3], turn: -0.4, lit: -1 }));
      s += deskFront();
      return Q.frame(ctx, s, GRADE.morning, { noClock: true, y: 1450 }) + Q.wordmark(sm(t, LE(ctx, 2) + 0.1, LE(ctx, 2) + 0.6));
    },
  });
})();
