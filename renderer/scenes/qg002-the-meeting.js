/* THE QUIET GAME #2 — The Meeting. Storyboard scenes; the shared look lives in qg-kit.js. */
(function () {
  const E = window.HW, Q = window.QG; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const BOARD = [{ text: 'TEAM CAMPING' }, { text: 'WEEKEND!' }, { text: 'Sat + Sun', color: '#c0392b' }];
  const ROW = { theo: 110, kemi: 290, ben: 470, jo: 650, sam: 830 };
  const PH = { theo: 0.3, kemi: 1.1, ben: 2.2, jo: 0.1, sam: 0.9, rosa: 0.7 };
  const FORCED = { b: [0.75, -0.25], smile: 0.55, lid: 0.1, squint: 0.25 };          // smiling on the outside
  const MISERABLE = { b: [0.9, -0.45], smile: -0.5, lid: 0.5, squint: 0 };
  const seated = (id, t, o = {}) => person(id, { x: ROW[id], y: 1330, s: 0.95, ...alive(t, PH[id]), lit: 1, ...o });
  const room = (t, extra = {}) => Q.meetingSet(t, { board: BOARD, ...extra });
  const table = (y = 1240) => Q.meetingTable(y, { items: item('mug', 200, y + 40, { s: 1.2, color: '#3f7fb5' }) + item('mug', 760, y + 60, { s: 1.2 }) + `<rect x="420" y="${y + 30}" width="200" height="22" rx="4" fill="#2a2d33" transform="rotate(-4 520 ${y + 40})"/>` });
  const bubbleK = (t, a, b) => Math.min(seg(t, a, a + 0.25), 1 - seg(t, b, b + 0.2));
  const sweat = (x, y, t) => `<path d="M${x} ${y + Math.sin(t * 5) * 4} q12 20 0 30 q-12 -10 0 -30z" fill="#bfe3ff" stroke="${Q.LINE}" stroke-width="3"/>`;
  const tick = p => p <= 0 ? '' : `<path d="M470 650 L520 705 L630 560" stroke="#1e8a3c" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="300" stroke-dashoffset="${f1(300 * (1 - p))}"/>`;
  function mcu(ctx, id, o = {}) {   // medium close-up of someone at the table
    return layer(1, person(id, { x: 540, y: 1700, s: 2.3, ...alive(ctx.t, PH[id]), lit: 1, mouth: talk(ctx, id), ...o })) + layer(1.05, Q.meetingTable(1590));
  }
  // kitchen line-up for the after-meeting scenes
  const KX = { kemi: 250, theo: 540, ben: 830, jo: 395, sam: 685 };
  function kitchenLineup(ctx, faces) {
    const t = ctx.t; let back = '', front = '';
    for (const id of ['jo', 'sam']) back += person(id, { x: KX[id], y: 1235, s: 1.05, ...alive(t, PH[id]), lit: -1, mouth: talk(ctx, id), ...faces(id) });
    for (const id of ['kemi', 'theo', 'ben']) front += person(id, { x: KX[id], y: 1580, s: 1.55, ...alive(t, PH[id]), lit: -1, mouth: talk(ctx, id), ...faces(id) });
    return layer(0.9, back) + layer(1, front);
  }

  E.registerScenes({
    // 1 — HOOK: six hands up, six "no"s
    mt_hook(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.08, sm(t, 0, 4.4)) + punch(t, 0.7, 0.05), 540, 1000, ctx.gt);
      let s = room(t), row = '', bub = '';
      const ids = ['theo', 'kemi', 'ben', 'jo', 'sam'], words = ['No.', 'Ugh.', 'Nope.', 'Why?!', 'Help.'];
      ids.forEach((id, i) => {
        const up = sm(t, 0.1 + i * 0.1, 0.45 + i * 0.1), arms = { l: [6, 4], r: [6, 4] }; arms[i % 2 ? 'l' : 'r'] = [mix(6, -160, up), mix(4, 12, up)];
        row += seated(id, t, { ex: ex('neutral', i === 2 ? MISERABLE : 'unsure', up), look: [i < 2 ? 0.6 : -0.4, 0.1], arms, turn: (2 - i) * 0.1 });
        bub += thought(ROW[id] + 10, i % 2 ? 640 : 770, ROW[id], 950, words[i], seg(t, 1.0 + i * 0.25, 1.25 + i * 0.25), { fs: 40, chars: 8 });
      });
      const rUp = sm(t, 0.5, 0.9);
      s += layer(0.92, person('rosa', { x: 1000, y: 1290, s: 1.0, ...alive(t, 0.7), ex: ex('warm', FORCED, sm(t, 1.8, 2.3)), look: [-0.8, 0], turn: -0.4, arms: { l: [mix(6, -160, rUp), mix(4, 12, rUp)], r: [6, 4] }, lit: -1 }));
      s += layer(1, row + table()) + layer(1, bub + thought(890, 640, 1000, 940, 'Please say no.', seg(t, 2.25, 2.5), { fs: 34, chars: 7 }));
      return Q.frame(ctx, s, GRADE.late, { y: 1420 });
    },

    // 2 — the pitch
    mt_pitch(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.06, sm(t, 0, 3)), 540, 960, ctx.gt);
      let s = room(t);
      s += layer(1, person('rosa', { x: 780, y: 1640, s: 1.9, ...alive(t, 0.7), ex: 'warm', look: [-0.2, 0], turn: -0.25, mouth: talk(ctx, 'rosa'), arms: { l: [-80, -12], r: [10, 120] }, hold: { r: { kind: 'pen', rot: -30 } }, lit: -1 }));
      s += layer(1.1, Q.meetingTable(1600));
      return Q.frame(ctx, s, GRADE.late);
    },

    // 3 — the silence (what everyone thinks)
    mt_silence(ctx) {
      const { t } = ctx;
      setCam(1.5 + 0.03 * sm(t, 0, 3.3), 330, 1000, ctx.gt);
      let s = blurSet(1, room(t)), row = '';
      ['theo', 'kemi', 'ben', 'jo'].forEach((id, i) => {
        const dart = Math.sin(t * 2.6 + i * 1.7);
        row += seated(id, t, { ex: i === 1 ? 'suspicious' : 'unsure', look: [dart > 0.3 ? 0.8 : dart < -0.3 ? -0.8 : 0, 0.1], turn: dart * 0.12, blink: 0 });
      });
      s += layer(1, row + table() + sweat(160, 1000, t));
      s += layer(1, thought(150, 790, 110, 960, 'I have plans.', seg(t, 0.45, 0.7), { fs: 30, chars: 9 }) +
        thought(330, 680, 290, 950, 'I hate camping.', seg(t, 1.15, 1.4), { fs: 30, chars: 9 }) +
        thought(530, 800, 470, 960, "It's OCTOBER.", seg(t, 1.85, 2.1), { fs: 30, chars: 9 }));
      return Q.frame(ctx, s, GRADE.late);
    },

    // 4 — someone cracks first
    mt_ben(ctx) {
      const { t } = ctx; const l0 = LS(ctx, 0);
      setCam(lerp(1.0, 1.06, sm(t, 0, 2.5)) + punch(t, l0, 0.07), 540, 980, ctx.gt);
      let s = blurSet(1, room(t)) + layer(0.8, blurSet(2, seated('kemi', t, { x: 120, s: 1.6, y: 1500, ex: 'unsure' }) + seated('jo', t, { x: 980, s: 1.6, y: 1500, ex: 'unsure' })));
      const look = t < 0.45 ? [-0.9, 0] : t < 0.9 ? [0.9, 0] : [0, 0.1];
      s += mcu(ctx, 'ben', { ex: t < l0 - 0.1 ? 'unsure' : FORCED, look, turn: look[0] * 0.25 });
      s += layer(1, thought(800, 640, 650, 860, 'Someone say something…', bubbleK(t, 0.25, l0 - 0.1), { fs: 36, chars: 11 }));
      return Q.frame(ctx, s, GRADE.late);
    },

    // 5 — the cascade: each one agrees because the last one did
    mt_cascade(ctx) {
      const { t } = ctx; const ids = ['kemi', 'jo', 'sam'];
      let k = 0; for (let i = 1; i < 3; i++) if (t >= LS(ctx, i) - 0.2) k = i;
      const st = k ? LS(ctx, k) - 0.2 : 0, tt = t - st;
      setCam(lerp(1.0, 1.05, sm(tt, 0, 1.5)) + punch(tt, 0.15, 0.08), 540, 980, ctx.gt);
      let s = blurSet(1, room(t));
      s += mcu(ctx, ids[k], { ex: FORCED, look: [k === 1 ? 0.5 : -0.5, 0], turn: k === 1 ? 0.2 : -0.2 });
      if (k === 0) s += layer(1, thought(790, 640, 640, 860, 'WHY did I say that?!', seg(t, LE(ctx, 0) - 0.05, LE(ctx, 0) + 0.2), { fs: 36, chars: 10 }));
      return Q.frame(ctx, s, GRADE.late);
    },

    // 6 — everyone looks at Theo
    mt_theo(ctx) {
      const { t } = ctx; const cutB = LS(ctx, 1) - 0.25;
      if (t < cutB) {
        const l0 = LS(ctx, 0), toTheo = sm(t, l0 - 0.3, l0 + 0.1);
        setCam(lerp(1.2, 1.5, toTheo) + punch(t, l0, 0.05), lerp(420, 260, toTheo), lerp(1000, 1010, toTheo), ctx.gt);
        let s = room(t), row = '';
        const turn = sm(t, 0.1, 0.4);
        for (const id of ['kemi', 'ben', 'jo', 'sam']) row += seated(id, t, { ex: 'curious', look: [-1 * turn, 0.05], turn: -0.6 * turn });
        row += seated('theo', t, { ex: t < l0 ? 'unsure' : FORCED, look: t < l0 ? [Math.sin(t * 5) > 0 ? 0.8 : 0.3, 0] : [0.6, 0], mouth: talk(ctx, 'theo'), blink: 0 });
        s += layer(1, row + table() + (t > 0.5 ? sweat(165, 990, t) + sweat(60, 1010, t + 1) : ''));
        s += layer(1, thought(250, 760, 110, 950, 'I HAVE PLANS.', bubbleK(t, 0.6, l0 - 0.1), { fs: 32, chars: 8 }));
        return Q.frame(ctx, s, GRADE.late);
      }
      const tt = t - cutB;
      setCam(1.0 + punch(tt, 0.1, 0.05), 540, 960, ctx.gt);
      let s = room(t) + layer(0.55, tick(sm(tt, 0.15, 0.5)));
      s += layer(1, person('rosa', { x: 780, y: 1640, s: 1.9, ...alive(t, 0.7), ex: 'warm', look: [-0.3, 0], turn: -0.25, mouth: talk(ctx, 'rosa'), arms: { l: [mix(-80, -95, sm(tt, 0.1, 0.4)), -12], r: [10, 120] }, lit: -1 }));
      s += layer(1.1, Q.meetingTable(1600));
      return Q.frame(ctx, s, GRADE.late);
    },

    // 7 — the kitchen: the truth comes out, one by one
    mt_after(ctx) {
      const { t } = ctx;
      let spk = 'kemi'; for (const l of ctx.lines) if (t >= l.start - 0.15) spk = l.who;
      const said = id => { const l = ctx.lines.find(x => x.who === id); return l && t > l.start; };
      setCam(1.1 + punch(t, ctx.lines.find(l => l.who === spk).start, 0.04), 540 + (KX[spk] - 540) * 0.35, 1080, ctx.gt);
      let s = Q.kitchenSet(t);
      s += kitchenLineup(ctx, id => ({ ex: said(id) ? (id === 'kemi' ? 'smug' : 'warm') : 'curious', look: [(KX[spk] - KX[id]) / 300, 0], turn: clamp((KX[spk] - KX[id]) / 600, -0.5, 0.5) }));
      s += layer(1.15, `<rect x="-200" y="1500" width="${W + 400}" height="600" fill="#2f2620"/><rect x="-200" y="1500" width="${W + 400}" height="30" fill="#8c7356" stroke="${Q.LINE}" stroke-width="4"/>`);
      return Q.frame(ctx, s, GRADE.morning);
    },

    // 8 — the boss walks in
    mt_rosa(ctx) {
      const { t } = ctx; const frozen = t > LE(ctx, 1) + 0.05;
      setCam(lerp(1.06, 1.14, sm(t, 0, 4)) + punch(t, LE(ctx, 1) + 0.05, 0.08), 600, 1060, ctx.gt);
      let s = Q.kitchenSet(t);
      const look = sm(t, 0.25, 0.5);
      s += kitchenLineup(ctx, id => ({ ex: frozen ? 'shocked' : ex('warm', FORCED, look), look: [look, 0], turn: 0.4 * look, blink: frozen ? 0 : undefined }));
      s += layer(1, person('rosa', { x: lerp(1260, 1010, sm(t, 0, 0.6)), y: 1580, s: 1.6, ...alive(t, 0.7), ex: frozen ? ex('warm', 'unsure', sm(t, LE(ctx, 1) + 0.3, LE(ctx, 1) + 0.7)) : 'warm', look: [-0.8, 0], turn: -0.45, mouth: talk(ctx, 'rosa'), lit: -1 }));
      s += layer(1.15, `<rect x="-200" y="1500" width="${W + 400}" height="600" fill="#2f2620"/><rect x="-200" y="1500" width="${W + 400}" height="30" fill="#8c7356" stroke="${Q.LINE}" stroke-width="4"/>`);
      return Q.frame(ctx, s, GRADE.morning);
    },

    // 9 — Saturday night, in the rain
    mt_tent(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.08, sm(t, 0, 6)), 540, 1060, ctx.gt);
      let s = layer(0.6, Q.rainNight(t));
      let tent = `<polygon points="10,1500 540,420 1070,1500" fill="#c4622d" stroke="${Q.LINE}" stroke-width="6"/><path d="M540 420 L300 1500 M540 420 L780 1500" stroke="#9c4a20" stroke-width="5"/>`;
      tent += `<clipPath id="tentOpen"><polygon points="200,1500 540,640 880,1500"/></clipPath><polygon points="200,1500 540,640 880,1500" fill="#2a1a12"/>`;
      let inside = `<ellipse cx="540" cy="1150" rx="380" ry="320" fill="url(#qgPool)" style="mix-blend-mode:screen"/>`;
      for (const [id, x] of [['jo', 405], ['rosa', 540], ['sam', 675]]) inside += person(id, { x, y: 1330, s: 0.75, ...alive(t, PH[id]), ex: MISERABLE, look: [0, 0.4], lit: 1 });
      for (const [id, x] of [['theo', 395], ['kemi', 540], ['ben', 685]]) inside += person(id, { x, y: 1560, s: 0.95, ...alive(t, PH[id]), ex: MISERABLE, look: [0, 0.3], arms: { l: [-15, 70], r: [-15, 70] }, armsFront: true, lit: 1 });
      inside += `<circle cx="540" cy="760" r="20" fill="#ffd27a" opacity="0.9"/><circle cx="540" cy="760" r="60" fill="#ffd27a" opacity="0.2"/>`;
      tent += `<g clip-path="url(#tentOpen)">${inside}</g><path d="M200 1500 L540 640 L240 1500Z M880 1500 L540 640 L840 1500Z" fill="#a9521f" stroke="${Q.LINE}" stroke-width="4"/>`;
      s += layer(1, tent + `<rect x="-200" y="1500" width="${W + 400}" height="600" fill="#1a2418"/>`);
      s += layer(1.1, Q.rainDrops(t, 110, 0.35));
      return Q.frame(ctx, s, GRADE.night, { y: 560 }) + Q.wordmark(sm(t, LE(ctx, 1) + 0.1, LE(ctx, 1) + 0.6), 330);
    },
  });
})();
