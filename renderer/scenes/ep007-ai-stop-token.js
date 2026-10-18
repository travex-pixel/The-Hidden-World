/* Episode 007 — AI part 2: how a chatbot knows when to stop. Same night plaza as Episode 006 (phone, model core,
   token tiles, probability columns, roll spotlight), built on renderer/kit3d.js. Pure function of t. */
(function () {
  const E = window.HW; const { W, H, clamp, lerp, ease, seg, f1, mulberry32 } = E;
  const K = window.KIT3D(E);
  const C = { sky: '#0a1020', floor: '#111a2d', city: ['#141d33', '#18223b', '#1b2743', '#121a2e', '#1f2b4a'], body: '#0e1116', rim: '#3a4252',
    core: '#2f6fed', edge: '#9fd4ff', gold: '#ffc24b', red: '#ff5a4e', end: '#ff4fa3', green: '#3ddc97', blue: '#4f8cff', ink: '#0d1220', grey: '#9aa3b0',
    toks: ['#7b9bff', '#f5c451', '#5fd6a4', '#f58a7b', '#bb95ff', '#62cdea'] };
  const PH = { w: 9, h: 18, y: 11 }, CORE = [0, 30, -60];
  let T, core, coreEdge, halo, phone, spot, columns = [], cards = [];
  const EX = () => E.state.ep.example;

  // ---------------------------------------------------------------- world (once)
  function buildWorld() {
    const fl = K.mesh(new T.CircleGeometry(1600, 48), K.lam(C.floor)); fl.rotation.x = -Math.PI / 2;
    const rng = mulberry32(606), N = 520, city = new T.InstancedMesh(new T.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), K.lam('#ffffff', { emissive: '#0a1228' }), N), o = new T.Object3D(), col = new T.Color();
    for (let i = 0; i < N; i++) { const a = rng() * Math.PI * 2, r = 170 + Math.pow(rng(), 0.8) * 800; o.position.set(Math.cos(a) * r, 0, Math.sin(a) * r - 60); o.rotation.set(0, rng() * Math.PI, 0); o.scale.set(14 + rng() * 40, 12 + Math.pow(rng(), 2) * 160, 14 + rng() * 40); o.updateMatrix(); city.setMatrixAt(i, o.matrix); city.setColorAt(i, col.set(C.city[i % C.city.length])); }
    K.scene.add(city);
    const sp = [], sr = mulberry32(7); for (let i = 0; i < 700; i++) { const a = sr() * Math.PI * 2, e = 0.08 + sr() * 1.2; sp.push(Math.cos(a) * Math.cos(e) * 1400, Math.sin(e) * 1400, Math.sin(a) * Math.cos(e) * 1400); }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.Float32BufferAttribute(sp, 3)); K.scene.add(new T.Points(sg, new T.PointsMaterial({ color: '#c9dcff', size: 2.2, sizeAttenuation: false, fog: false })));
    K.scene.add(new T.HemisphereLight('#8fb4ff', '#0a0f1c', 1.3)); const key = new T.DirectionalLight('#dfe8ff', 1.5); key.position.set(30, 80, 60); K.scene.add(key);
    core = K.mesh(new T.IcosahedronGeometry(9, 1), K.lam('#1d3f8f', { emissive: C.core, emissiveIntensity: 0.6, flatShading: true }), CORE);
    coreEdge = new T.LineSegments(new T.EdgesGeometry(core.geometry), new T.LineBasicMaterial({ color: C.edge, transparent: true, opacity: 0.8 })); core.add(coreEdge);
    halo = new T.Sprite(new T.SpriteMaterial({ map: K.glowTex('rgba(80,140,255,0.9)'), blending: T.AdditiveBlending, depthWrite: false, transparent: true })); halo.scale.set(70, 70, 1); halo.position.set(...CORE); K.scene.add(halo);
    // phone
    phone = new T.Group(); phone.add(new T.Mesh(K.slab(PH.w, PH.h, 0.6, 1.4), K.lam(C.body)));
    phone.add(new T.LineSegments(new T.EdgesGeometry(K.slab(PH.w + 0.02, PH.h + 0.02, 0.6, 1.4), 30), new T.LineBasicMaterial({ color: C.rim })));
    const tex = K.canvasTex(600, 1240, () => {}); const scr = new T.Mesh(K.flatUV(new T.ShapeGeometry(K.roundedShape(PH.w - 0.6, PH.h - 0.6, 1.05), 8)), new T.MeshBasicMaterial({ map: tex })); scr.position.z = 0.45; phone.add(scr);
    const glow = new T.Mesh(new T.PlaneGeometry(26, 26), new T.MeshBasicMaterial({ map: K.glowTex('rgba(79,140,255,0.55)'), transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
    glow.rotation.x = -Math.PI / 2; glow.position.y = -PH.y + 0.4; phone.add(glow); phone.userData = { tex }; K.scene.add(phone);
    // probability columns + roll spotlight
    for (let i = 0; i < 5; i++) { const m = new T.Mesh(new T.BoxGeometry(2.8, 1, 1.4).translate(0, 0.5, 0), new T.MeshBasicMaterial({ color: C.blue, transparent: true, opacity: 0.85 })); K.scene.add(m); columns.push(m); }
    spot = new T.Mesh(new T.CylinderGeometry(0.4, 4.2, 1, 32, 1, true).translate(0, -0.5, 0), new T.MeshBasicMaterial({ color: C.gold, transparent: true, opacity: 0.3, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide })); K.scene.add(spot);
    // training-example cards (each ends in an END tile, drawn on the card)
    for (let i = 0; i < 6; i++) {
      const tx = K.canvasTex(512, 320, (g, w, h) => { g.fillStyle = '#e9eef7'; g.fillRect(0, 0, w, h); g.fillStyle = '#9aa6bb'; for (let l = 0; l < 4; l++) g.fillRect(36, 50 + l * 52, w - 72 - (l === 3 ? 170 : (l * 37) % 90), 22);
        g.fillStyle = C.end; K.roundRect(g, w - 200, 196, 164, 52, 12); g.fill(); g.fillStyle = '#fff'; g.font = '800 26px Nunito'; g.textAlign = 'center'; g.fillText('END', w - 118, 231); g.fillStyle = '#5b6578'; g.textAlign = 'left'; g.font = '800 22px Nunito'; g.fillText('TRAINING EXAMPLE ' + (i + 1), 36, 30); });
      const m = new T.Mesh(new T.BoxGeometry(8, 5, 0.2), [K.lam('#cfd6e4'), K.lam('#cfd6e4'), K.lam('#cfd6e4'), K.lam('#cfd6e4'), new T.MeshBasicMaterial({ map: tx }), K.lam('#cfd6e4')]);
      K.scene.add(m); cards.push(m);
    }
  }
  // the chat screen: question, streamed tokens coloured by token, an optional hidden END token, cursor, cut-off bar
  function drawChat(o) {
    const { c, g } = phone.userData.tex.userData, w = c.width, h = c.height;
    g.fillStyle = '#0f1218'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#e8ecf2'; g.font = '700 30px Nunito'; g.fillText('9:41', 46, 66); g.fillStyle = '#7f8896'; g.font = '800 30px Nunito'; g.textAlign = 'center'; g.fillText('AI chat', w / 2, 140); g.textAlign = 'left';
    g.fillStyle = '#252b36'; g.fillRect(40, 168, w - 80, 2);
    g.font = '700 36px Nunito'; const q = EX().question, qw = g.measureText(q).width + 52;
    g.fillStyle = '#2f6fed'; K.roundRect(g, w - 40 - qw, 210, qw, 74, 30); g.fill(); g.fillStyle = '#fff'; g.fillText(q, w - 40 - qw + 26, 260);
    const fs = o.fs || 40; let x = 46, y = 380; const lh = fs * 1.55, maxX = w - 46; g.font = `700 ${fs}px Nunito`;
    const place = tw => { if (x + tw > maxX && x > 46) { x = 46; y += lh; } };
    o.tokens.slice(0, o.shown).forEach((tk, i) => {
      const tw = g.measureText(tk).width; place(tw);
      if (o.colour) { g.globalAlpha = 0.34; g.fillStyle = C.toks[i % C.toks.length]; K.roundRect(g, x + (tk[0] === ' ' ? 8 : 0), y - fs, tw - (tk[0] === ' ' ? 8 : 0), fs * 1.35, 8); g.fill(); g.globalAlpha = 1; }
      g.fillStyle = (o.mark || []).includes(i) ? C.gold : '#eef2f8'; g.fillText(tk, x, y); x += tw;
    });
    if (o.ghost) { const s = EX().end_token; g.font = `800 ${Math.round(fs * 0.8)}px Nunito`; const tw = g.measureText(s).width + 24; place(tw + 10);
      g.globalAlpha = o.ghost; g.setLineDash([9, 7]); g.strokeStyle = C.end; g.lineWidth = 4; K.roundRect(g, x + 10, y - fs, tw, fs * 1.35, 10); g.stroke(); g.setLineDash([]);
      g.fillStyle = C.end; g.fillText(s, x + 22, y - 4); g.globalAlpha = 1; g.font = `700 ${fs}px Nunito`; }
    else if (o.cursor) { g.fillStyle = '#eef2f8'; g.globalAlpha = o.cursor; g.fillRect(x + 6, y - fs + 2, fs * 0.55, fs * 1.15); g.globalAlpha = 1; }
    if (o.cut) { g.fillStyle = C.red; g.globalAlpha = o.cut; g.fillRect(30, y + 28, w - 60, 8); g.font = '800 30px Nunito'; g.fillText('limit reached', 46, y + 80); g.globalAlpha = 1; }
    phone.userData.tex.needsUpdate = true;
  }
  function showCore(t, pulse = 0, pos = CORE) { core.visible = halo.visible = true; core.position.set(...pos); halo.position.set(...pos); core.rotation.set(t * 0.21, t * 0.33, 0); core.material.emissiveIntensity = 0.55 + 0.9 * pulse; coreEdge.material.opacity = 0.6 + 0.4 * pulse; halo.material.opacity = 0.55 + 0.45 * pulse; }
  function placePhone(pos = [0, PH.y, 0], ry = 0, s = 1) { phone.visible = true; phone.position.set(...pos); phone.rotation.set(0, ry, 0); phone.scale.setScalar(s); }
  // probability stage: candidate tiles on the floor with glowing columns (heights in %), the END tile in pink
  function stage(c, cands, o = {}) {
    const xs = cands.map((_, i) => (i - (cands.length - 1) / 2) * 5.0), sc = o.scale ?? 0.32;
    cands.forEach(([s, pc], i) => {
      const end = s === 'END', win = o.win === i;
      K.tile('c' + i + s, end ? 'END' : s === '(others)' ? '…' : s, end ? C.end : s === '(others)' ? '#55627a' : C.toks[(i + 2) % 6], { pos: [xs[i], 1.6, 4], s: 0.72, glow: win ? 1.0 : end ? 0.7 : 0.3, dim: o.win !== undefined && !win ? 0.55 : 1 });
      const col = columns[i]; col.visible = true; col.position.set(xs[i], 3.2, 2); col.scale.set(1, Math.max(0.02, pc * sc), 1); col.material.color.set(win ? C.gold : end ? C.end : '#3c63b8');
    });
    return cands.map(([s, pc], i) => { const p = K.proj([xs[i], 3.2 + Math.max(0.02, pc * sc), 2]); return K.txt(p.x, p.y - 18, (pc < 1 ? pc.toFixed(1) : Math.round(pc)) + '%', 40, s === 'END' ? '#ff9ccc' : '#d7e3ff'); }).join('');
  }
  const xsOf = n => i => (i - (n - 1) / 2) * 5.0;

  // ---------------------------------------------------------------- scenes
  // 1. Hook: the answer finishes at the full stop… then a hidden pink token appears after it.
  function hook_end(c) {
    const A = EX().answer, td = K.at(c, "doesn't"), th = K.at(c, 'hidden'), tn = K.at(c, 'never');
    const shown = Math.min(A.length, Math.floor(seg(c.t, 0.1, 2.3) * A.length + 1e-9));
    placePhone(); drawChat({ tokens: A, shown, colour: c.t > td, ghost: seg(c.t, th - 0.2, th + 0.3) * (0.75 + 0.25 * Math.sin(c.t * 7)), cursor: c.t < td ? (Math.sin(c.t * 9) > 0 ? 1 : 0.2) : 0 });
    K.camBlend([[0, PH.y - 1.5, 19], [0, PH.y - 0.5, 0], 50], [[4, PH.y + 2, 26], [0, PH.y + 1, 0], 50], ease.inOut(seg(c.t, td, td + 1.4)));
    showCore(c.t, 0.2);
    return K.hud(shown, 'tokens', c.t > td ? 'ended?' : 'live', c.t > td ? C.end : C.green)
      + K.chip(540, 260, 'THE APP HIDES THIS', { size: 36, bg: C.end, p: seg(c.t, tn, tn + 0.3), ls: 2 }) + K.caption(c);
  }
  // 2. The end token itself: a pink tile in front of the model; rolling it hides it and stops the app.
  function end_token(c) {
    const tm = K.at(c, 'meta'), tr = K.at(c, 'roll'), ts = K.at(c, 'stops'), fly = ease.inOut(seg(c.t, tr, tr + 0.8));
    K.setCam([0, 17, 44 - 4 * seg(c.t, 0, c.T)], [0, 15, 0], 50); showCore(c.t, 0.3 + 0.5 * seg(c.t, tr - 0.3, tr), [0, 32, -60]);
    placePhone([7.5, PH.y - 1, -4], -0.3, 0.8); drawChat({ tokens: EX().answer, shown: EX().answer.length, colour: true, cursor: c.t < ts ? 1 : 0 });
    if (fly < 1) K.tile('end', EX().end_token, C.end, { pos: [lerp(-2.5, 7.5, fly), lerp(21, 13, fly), lerp(4, -3, fly)], s: lerp(1.25, 0.3, fly), ry: Math.sin(c.t * 1.2) * 0.25 * (1 - fly), glow: 0.8, fs: 0.42 });
    const p = K.proj([-2.5, 24.5, 4]), ph = K.proj([7.5, PH.y + 7.5, -4]);
    return K.chip(540, p.y - 30, "Meta Llama 3's end token", { size: 34, bg: '#2a3346', p: seg(c.t, tm, tm + 0.3), op: 1 - seg(c.t, tr, tr + 0.3) })
      + K.chip(Math.min(ph.x, 760), ph.y - 40, 'hidden · stop', { size: 36, bg: C.end, p: seg(c.t, ts - 0.2, ts + 0.1) }) + K.caption(c);
  }
  // 3. Always on the menu: mid-sentence, END gets 0.1%.
  function always_menu(c) {
    const te = K.at(c, 'end'), tm = K.at(c, 'mid'), cands = [['END', 0.1], [' air', 41], [' sunlight', 33], [' the', 18], ['(others)', 7.9]];
    K.setCam([0, 17, 48], [0, 7, 0], 50); showCore(c.t, 0.2, [0, 34, -70]);
    const pcs = stage(c, cands), x = xsOf(5)(0), p = K.proj([x, 5, 2]);
    if (c.t > tm) { spot.visible = true; spot.position.set(x, 26, 4); spot.scale.set(1, 23, 1); spot.material.color.set(C.end); spot.material.opacity = 0.32; }
    return K.note('Illustration · invented probabilities', seg(c.t, 0.1, 0.4)) + strip(['The', ' sky', ' looks', ' blue', ' because'], 1) + pcs
      + K.chip(Math.max(250, p.x + 60), p.y - 90, 'END is always an option', { size: 32, bg: C.end, p: seg(c.t, te, te + 0.3) })
      + K.stamp(540, 560, 'MID-SENTENCE: 0.1%', C.end, seg(c.t, tm + 0.3, tm + 0.8), -5, 54) + K.caption(c);
  }
  // sentence strip (2D) across the top: tokens so far + the slot being decided
  function strip(tokens, slot, y = 300, endTok) {
    const ws = tokens.map(s => s.replace(/^ /, '')), widths = ws.map(s => 24 + s.length * 26), total = widths.reduce((a, b) => a + b + 10, 0) + (slot ? 110 : 0) + (endTok ? 150 : 0); let x = 540 - total / 2, out = '';
    tokens.forEach((tk, i) => { out += `<rect x="${f1(x)}" y="${y - 34}" width="${widths[i]}" height="68" rx="12" fill="${C.toks[i % C.toks.length]}" opacity="0.92"/>${K.txt(x + widths[i] / 2, y + 14, ws[i], 40, C.ink)}`; x += widths[i] + 10; });
    if (endTok) { out += `<rect x="${f1(x)}" y="${y - 34}" width="140" height="68" rx="12" fill="${C.end}" opacity="${endTok}"/>${K.txt(x + 70, y + 13, 'END', 38, '#fff', 'middle', `opacity="${endTok}"`)}`; x += 150; }
    if (slot) out += `<rect x="${f1(x)}" y="${y - 34}" width="100" height="68" rx="12" fill="none" stroke="${C.gold}" stroke-width="5" stroke-dasharray="12 9" opacity="${slot}"/>${K.txt(x + 50, y + 14, '?', 40, C.gold)}`;
    return `<g>${out}</g>`;
  }
  // 4. After a finished answer, END shoots up to 90%. Training examples all end with it.
  function shoots_up(c) {
    const tt = K.at(c, 'training'), te = K.at(c, 'every'), k = ease.inOut(seg(c.t, 0.4, 1.8));
    K.setCam([0, 17, 48], [0, 7, 0], 50); showCore(c.t, 0.3, [0, 34, -70]);
    const cands = [['END', lerp(0.1, 90, k)], [' Also', lerp(30, 6, k)], [' This', lerp(28, 2, k)], [' It', lerp(22, 1, k)], ['(others)', lerp(19.9, 1, k)]];
    const pcs = stage(c, cands, { scale: 0.15 });
    cards.forEach((m, i) => { const u = seg(c.t, tt + i * 0.28, tt + 1.4 + i * 0.28); m.visible = u > 0 && u < 1; m.position.set(lerp(-34, 34, u), 9 + (i % 3) * 1.6, 12 + (i % 2) * 2); m.rotation.set(0, lerp(0.5, -0.5, u), 0); });
    return K.note('Illustration · invented probabilities', seg(c.t, 0.1, 0.4)) + strip(['blue', ' light', ' the', ' most', '.'], 1) + pcs
      + K.chip(540, 470, 'every training answer ends with END', { size: 34, bg: C.end, p: seg(c.t, te, te + 0.3) }) + K.caption(c);
  }
  // 5. Sceptic: "it just knows when it's done?" The roll misses END (90%) and lands on "Also" (6%); it keeps going.
  function sceptic_ramble(c) {
    const tw = K.at(c, 'watch'), tl = K.at(c, 'lands'), tk = K.at(c, 'keeps'), ex = EX(), cands = ex.after_answer, xs = xsOf(3);
    const showStage = c.t < tk - 0.2;
    if (showStage) {
      K.setCam([0, 17, 40], [0, 7, 0], 50); showCore(c.t, 0.3, [0, 34, -70]);
      const pcs = stage(c, cands, { scale: 0.15, win: c.t > tl ? 1 : undefined });
      // roulette: hops slow down and stop on index 1 (" Also") at "lands"
      const hops = [2, 0, 1, 0, 2, 0, 0, 1], gaps = [0.13, 0.15, 0.18, 0.22, 0.27, 0.33, 0.4]; let ht = tl; const times = [tl];
      for (let i = gaps.length - 1; i >= 0; i--) { ht -= gaps[i]; times.unshift(ht); }
      if (c.t >= times[0]) { let idx = 1; for (let i = 0; i < times.length; i++) if (c.t >= times[i]) idx = hops[i]; spot.visible = true; spot.position.set(xs(idx), 26, 4); spot.scale.set(1, 23, 1); spot.material.color.set(C.gold); spot.material.opacity = c.t > tl ? 0.45 : 0.3; }
      return K.chip(540, 1250, 'THE SCEPTIC', { size: 30, bg: '#6b7280', p: seg(c.t, 0.05, 0.3), op: 1 - seg(c.t, tw - 0.4, tw - 0.1), ls: 3 })
        + strip(['the', ' most', '.'], 1) + pcs + K.stamp(540, 470, 'ROLLED: "ALSO"', C.gold, seg(c.t, tl, tl + 0.5), -6, 58) + K.caption(c);
    }
    // it keeps going: back on the phone, the answer rolls on into a second sentence
    const n = Math.min(ex.ramble.length, Math.floor((c.t - tk + 0.2) / 0.16) + 1);
    placePhone(); K.setCam([2, PH.y + 1, 25], [0, PH.y + 0.5, 0], 50); showCore(c.t, 0.4);
    drawChat({ tokens: [...ex.answer, ...ex.ramble], shown: ex.answer.length + n, colour: true, mark: [ex.answer.length], cursor: 1 });
    return K.chip(540, 260, 'IT KEEPS GOING', { size: 38, bg: C.gold, fg: C.ink, p: seg(c.t, tk - 0.2, tk + 0.1), ls: 2 }) + K.caption(c);
  }
  // 6. The hard limit: a long answer hits the app's token cap and is cut mid-sentence.
  function hard_limit(c) {
    const th = K.at(c, 'hard'), tc = K.at(c, 'cuts'), ex = EX(), L = ex.cutoff, lim = ex.limit_tokens;
    const n = Math.min(lim, Math.floor(seg(c.t, 0.3, tc) * lim + 1e-9));
    placePhone(); K.setCam([0, PH.y + 1, 24], [0, PH.y + 0.5, 0], 50); showCore(c.t, 0.4);
    drawChat({ tokens: L, shown: n, colour: true, cursor: n < lim ? 1 : 0, cut: seg(c.t, tc, tc + 0.3) });
    return K.hud(`${n}/${lim}`, 'tokens', n >= lim ? 'limit' : 'live', n >= lim ? C.red : C.green)
      + K.chip(540, 260, 'APP LIMIT: ' + lim + ' TOKENS', { size: 34, bg: '#2a3346', p: seg(c.t, th, th + 0.3), ls: 2 })
      + K.stamp(540, 400, 'CUT OFF MID-SENTENCE', C.red, seg(c.t, tc + 0.1, tc + 0.6), -5, 52) + K.caption(c);
  }
  // 7. Threshold: frozen glowing frame on the finished answer and its hidden END.
  function threshold_teacher(c) {
    placePhone(); K.setCam([3, 15, 30], [0, 12.5, 0], 50); showCore(5, 0.45);
    drawChat({ tokens: EX().answer, shown: EX().answer.length, colour: true, ghost: 0.8 + 0.2 * Math.sin(c.t * 5) });
    return `<defs><linearGradient id="fadeB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.sky}" stop-opacity="0"/><stop offset="0.35" stop-color="${C.sky}" stop-opacity="0.85"/><stop offset="1" stop-color="${C.sky}" stop-opacity="0.95"/></linearGradient></defs><rect x="0" y="980" width="${W}" height="${H - 980}" fill="url(#fadeB)"/>` + K.bigLine(c, 1180, 70);
  }
  const SCENES = { hook_end, end_token, always_menu, shoots_up, sceptic_ramble, hard_limit, threshold_teacher };
  E.registerScenes(SCENES);
  const reset = () => { for (const o of [core, halo, phone, spot, ...columns, ...cards]) o.visible = false; };
  E.custom = {
    async setup() { T = K.T; K.init({ bg: C.sky, fog: [120, 1100], near: 0.5 }); buildWorld(); },
    frame: K.frameFn(SCENES, reset)
  };
})();
