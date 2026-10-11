/* THE QUIET GAME #8 — The New Guy (Round 1 finale). Loads episodes 1-4 for the memory flashes. */
(function () {
  const E = window.HW, Q = window.QG; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const CALM = { b: [-0.15, 0.15], smile: 0.25, lid: 0.15, squint: 0.2 };
  const PHONE = { arms: { l: [8, 4], r: [-6, 108] }, hold: { r: { kind: 'phone', lit: true, s: 1.1, rot: -25, dy: 20 } } };
  const DANNY = [{ who: 'Danny', color: '#8a5ad0', text: 'Your new guy, Max? Careful.', at: 0.3 }, { who: 'Danny', color: '#8a5ad0', text: 'Heard he was trouble at his last place.', at: 0.65 }];
  const MEMS = [['hook_lunch', 3.6, '#1 · THE BAG ON THE CHAIR'], ['mt_tent', 3.2, '#2 · NOBODY WANTED IT'], ['fv_hook', 1.6, '#3 · THE "FREE" COFFEE'], ['cr_end', 2.0, '#4 · SAY HIS NAME']];

  E.registerScenes({
    // 1 — HOOK: the text, again
    ng_hook(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.12, sm(t, 0, 4)) + punch(t, 0.65, 0.05), 540, 820, ctx.gt);
      return Q.frame(ctx, layer(1, Q.chatScreen(t, { title: 'Danny', members: 'online', groupColor: '#8a5ad0', msgs: DANNY, buzz: t > 0.2 && t < 0.6 ? 1 : 0 })), GRADE.morning, { y: 1500 });
    },
    // 2 — Max walks in (exactly like Theo did)
    ng_arrive(ctx) {
      const { t } = ctx;
      setCam(lerp(1.02, 1.1, sm(t, 0, 3)), 600, 960, ctx.gt);
      let s = Q.officeSet(t, { warm: 1 });
      const wk = seg(t, 0, 1.4), mx = lerp(1180, 740, ease.out(wk));
      s += layer(0.62, `<rect x="760" y="420" width="16" height="760" fill="#9fb5b8" opacity="0.6"/><rect x="1060" y="420" width="16" height="760" fill="#9fb5b8" opacity="0.6"/>` +
        person('max', { x: mx, y: 1040, s: 0.78, legs: true, walk: wk < 1 ? t * 9 : null, ...alive(t, 0.5), ex: 'nervous', look: [-0.3, 0], turn: -0.3, arms: { l: [6, 4], r: [-150 + Math.sin(t * 9) * 12, 25] }, lit: -1 }));
      const up = t > 0.9;
      s += layer(1, person('theo', { x: 380, y: 1580, s: 2.1, ...alive(t, 0.3), ex: up ? 'unsure' : 'neutral', look: up ? [0.9, -0.5] : [0.1, 0.85], turn: up ? 0.3 : 0, lit: -1, ...PHONE }));
      s += layer(1, person('kemi', { x: 990, y: 1640, s: 2.0, ...alive(t, 1.1), ex: 'curious', look: [t > LS(ctx, 0) ? -0.8 : 0.5, -0.3], turn: t > LS(ctx, 0) ? -0.4 : 0.1, mouth: talk(ctx, 'kemi'), lit: -1 }));
      s += layer(1.15, `<rect x="-100" y="1510" width="1300" height="500" fill="#4e3a2c" stroke="${Q.LINE}" stroke-width="4"/><rect x="-100" y="1510" width="1300" height="26" fill="#8a6a4a"/>`);
      return Q.frame(ctx, s, GRADE.morning, { y: 1440 });
    },
    // 3 — he almost says it. Then he remembers.
    ng_almost(ctx) {
      const { t } = ctx; const f0 = LE(ctx, 0) + 0.05, step = 0.55, fEnd = f0 + step * MEMS.length;
      if (t >= f0 && t < fEnd) {
        const i = Math.floor((t - f0) / step), lt = t - f0 - i * step, [name, at, label] = MEMS[i];
        const flash = 1 - seg(lt, 0, 0.12);
        return Q.memory(name, at + lt, ctx.ep, { label }) + `<rect width="${W}" height="${H}" fill="#fff" opacity="${f1(0.8 * flash)}"/>`;
      }
      const after = t >= fEnd;
      setCam(lerp(1.0, 1.1, sm(t, 0, 4)) + punch(t, LS(ctx, 0), 0.04) + (after ? punch(t, fEnd, 0.06) : 0), 540, 980, ctx.gt);
      let s = blurSet(1, Q.officeSet(t, { warm: 0.8 }));
      s += layer(0.9, blurSet(2, person('kemi', { x: 1000, y: 1650, s: 2.0, ...alive(t, 1.1), ex: 'curious', look: [-0.8, 0], turn: -0.4 })));
      s += layer(1, person('theo', { x: 520, y: 1700, s: 2.3, ...alive(t, 0.3), ex: after ? ex('unsure', CALM, sm(t, fEnd, fEnd + 0.4)) : 'neutral', look: after ? [0.2, 0.3] : [0.7, 0], turn: 0.25, mouth: talk(ctx, 'theo'), lit: -1 }));
      s += layer(1.1, `<rect x="-100" y="1600" width="1300" height="500" fill="#4e3a2c" stroke="${Q.LINE}" stroke-width="4"/>`);
      return Q.frame(ctx, s, GRADE.morning, { y: 1440 });
    },
    // 4 — the reply
    ng_reply(ctx) {
      const { t } = ctx; const reply = "Let's not do this. He's new.";
      setCam(lerp(1.0, 1.08, sm(t, 0, 2.8)) + punch(t, 1.6, 0.05), 540, 820, ctx.gt);
      const n = Math.round(reply.length * clamp((t - 0.2) / 1.2, 0, 1));
      const msgs = [...DANNY.map(m => ({ ...m, at: -1 })), { mine: true, text: reply, at: 1.6 }];
      return Q.frame(ctx, layer(1, Q.chatScreen(t, { title: 'Danny', members: 'online', groupColor: '#8a5ad0', msgs, draft: t < 1.6 ? reply.slice(0, n) : '' })), GRADE.morning, { y: 1500 });
    },
    // 5 — hello
    ng_hello(ctx) {
      const { t } = ctx; const l2 = LS(ctx, 2);
      setCam(lerp(1.05, 1.12, sm(t, 0, 4)) + punch(t, l2, 0.05), 560, 1000, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.9 });
      s += layer(1, person('theo', { x: 300, y: 1330, s: 1.85, legs: true, ...alive(t, 0.3), ex: t > LS(ctx, 4) - 0.2 ? { b: [0.6, 0.1], smile: 0.45, lid: 0.25, squint: 0.3 } : 'warm', look: [0.8, 0.2], turn: 0.45, mouth: talk(ctx, 'theo'), lit: -1 }));
      s += layer(1, person('max', { x: 790, y: 1560, s: 2.0, ...alive(t, 0.5), ex: t < l2 ? 'nervous' : t < LS(ctx, 3) ? 'warm' : t < LS(ctx, 4) ? { b: [0.8, -0.1], smile: 0.2, lid: 0.2, squint: 0 } : 'warm', look: [-0.8, -0.2], turn: -0.45, mouth: talk(ctx, 'max'), lit: -1 }));
      s += layer(1.05, Q.desk(560, 1420, 700, { h: 600, mx: 450, mw: 220 }));
      return Q.frame(ctx, s, GRADE.morning, { y: 1440 });
    },
    // 6 — lunch: #1's opening, mirrored. The bag comes OFF the chair.
    ng_lunch(ctx) {
      const { t } = ctx; const endT = LE(ctx, 1) + 0.25;
      setCam(lerp(1.22, 1.32, sm(t, 0, 4.5)), 540, lerp(960, 900, sm(t, 0, 4.5)), ctx.gt);
      let s = Q.breakSet(t);
      s += layer(1, person('theo', { x: 400, y: 1080, s: 1.4, ...alive(t, 0.3), ex: 'warm', look: [0.8, 0.2], turn: 0.3, arms: { l: [-15, 60], r: [-15, 60] }, armsFront: true, hold: { both: { kind: 'tray', dy: 10 } }, lit: 1 }) +
        person('max', { x: 690, y: 1085, s: 1.4, ...alive(t, 0.5), ex: { b: [0.4, 0.2], smile: 0.6, lid: 0.15, squint: 0.3 }, look: [-0.6, 0.3], turn: -0.2, arms: { l: [-15, 60], r: [-15, 60] }, armsFront: true, hold: { both: { kind: 'tray', dy: 10 } }, lit: 1 }) + Q.lunchTable(1110));
      const lift = ease.inOut(seg(t, 0.3, 0.9)), pull = ease.out(seg(t, 0.5, 1.1));
      let fg = Q.chairBack(lerp(540, 640, pull), 1270);
      fg += item('bag', lerp(540, 250, lift), lerp(1215, 1330, lift) - Math.sin(lift * Math.PI) * 60, { s: 1.5, rot: lerp(4, -15, lift) });
      fg += person('kemi', { x: 165, y: 1720, s: 2.0, back: true, ...alive(t, 1.1), arms: { l: [6, 4], r: [mix(-62, 6, lift), mix(-10, 4, lift)] }, blur: 1, tilt: 4 });
      fg += person('ben', { x: 935, y: 1740, s: 2.05, back: true, ...alive(t, 2.2), arms: { l: [mix(6, -50, Math.sin(Math.PI * pull)), -10], r: [8, 4] }, blur: 1, tilt: -3 });
      s += layer(1.15, fg);
      const k = sm(t, endT, endT + 0.7);
      const card = k <= 0 ? '' : `<rect width="${W}" height="${H}" fill="#0b0d10" opacity="${f1(0.78 * k)}"/><g opacity="${f1(k)}">
        <text x="${W / 2}" y="820" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="84" letter-spacing="16" fill="#f4ead2">THE QUIET GAME</text>
        <text x="${W / 2}" y="910" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="40" letter-spacing="12" fill="#ffd36b">ROUND 1</text>
        <text x="${W / 2}" y="1060" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="600" font-size="64" fill="#ffffff">The End.</text></g>`;
      return Q.frame(ctx, s, GRADE.noon, { y: 1440, narSize: 70 }) + card;
    },
  });
})();
