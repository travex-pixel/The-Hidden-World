/* Episode 009 — the unit distance problem and the AI disproof. A dark "table" in space: glowing dots, gold rods for
   every pair at distance exactly 1, a 20x20 grid (exact 1,744 pairs at squared distance 65), an illustrative AI pattern,
   a wall of Lean lines, and Erdős's to-do list. Built on renderer/kit3d.js. Pure function of t. */
(function () {
  const E = window.HW; const { W, H, clamp, lerp, ease, seg, f1, mulberry32 } = E;
  const K = window.KIT3D(E);
  const C = { sky: '#0b1020', table: '#141b2e', dot: '#ffffff', rod: '#ffc24b', rodAI: '#5fd6ff', red: '#ff5a4e', green: '#3ddc97', blue: '#4f8cff', gold: '#ffc24b', ink: '#0d1220', grey: '#9aa3b0', paper: '#e9eef7' };
  let T, dots, rods, million, cards, lean, leanTex, list, listTex, core, halo, stars;
  const F = () => E.state.ep.facts;

  // ---------------------------------------------------------------- world (once)
  function buildWorld() {
    K.scene.add(new T.HemisphereLight('#8fb4ff', '#0a0f1c', 1.2)); const key = new T.DirectionalLight('#dfe8ff', 1.2); key.position.set(30, 80, 60); K.scene.add(key);
    const tb = K.mesh(new T.CircleGeometry(900, 64), K.lam(C.table)); tb.rotation.x = -Math.PI / 2;
    const sp = [], sr = mulberry32(7); for (let i = 0; i < 900; i++) { const a = sr() * Math.PI * 2, e = 0.05 + sr() * 1.3; sp.push(Math.cos(a) * Math.cos(e) * 1400, Math.sin(e) * 1400, Math.sin(a) * Math.cos(e) * 1400); }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.Float32BufferAttribute(sp, 3)); stars = new T.Points(sg, new T.PointsMaterial({ color: '#c9dcff', size: 2.2, sizeAttenuation: false, fog: false })); K.scene.add(stars);
    dots = new T.InstancedMesh(new T.SphereGeometry(0.42, 12, 10), new T.MeshLambertMaterial({ color: C.dot, emissive: '#dfe8ff', emissiveIntensity: 0.5 }), 1200); K.scene.add(dots); dots.frustumCulled = false;
    rods = new T.InstancedMesh(new T.BoxGeometry(0.11, 0.11, 1), new T.MeshBasicMaterial({ color: C.rod, transparent: true, opacity: 0.85 }), 6000); K.scene.add(rods); rods.frustumCulled = false;
    const mp = [], mr = mulberry32(99); for (let i = 0; i < 24000; i++) { const a = mr() * Math.PI * 2, r = Math.sqrt(mr()) * 60; mp.push(Math.cos(a) * r, 0.2, Math.sin(a) * r); }
    const mg = new T.BufferGeometry(); mg.setAttribute('position', new T.Float32BufferAttribute(mp, 3)); million = new T.Points(mg, new T.PointsMaterial({ color: '#ffffff', size: 2.0, sizeAttenuation: false, transparent: true, opacity: 0 })); K.scene.add(million);
    core = K.mesh(new T.IcosahedronGeometry(6, 1), K.lam('#1d3f8f', { emissive: '#2f6fed', emissiveIntensity: 0.7, flatShading: true }), [0, 26, -30]);
    core.add(new T.LineSegments(new T.EdgesGeometry(core.geometry), new T.LineBasicMaterial({ color: '#9fd4ff', transparent: true, opacity: 0.8 })));
    halo = new T.Sprite(new T.SpriteMaterial({ map: K.glowTex('rgba(80,140,255,0.9)'), blending: T.AdditiveBlending, depthWrite: false, transparent: true })); halo.scale.set(50, 50, 1); halo.position.copy(core.position); K.scene.add(halo);
    // paper cards (old papers for the lookup beat)
    cards = []; for (let i = 0; i < 8; i++) {
      const tx = K.canvasTex(512, 320, (g, w, h) => { g.fillStyle = C.paper; g.fillRect(0, 0, w, h); g.fillStyle = '#9aa6bb'; for (let l = 0; l < 6; l++) g.fillRect(36, 60 + l * 40, w - 72 - (l * 53) % 120, 16); g.fillStyle = '#5b6578'; g.font = '800 24px Nunito'; g.fillText(['1983', '1997', '2004', '2011', '1979', '2015', '1990', '2008'][i] + ' · journal paper', 36, 36); });
      const m = new T.Mesh(new T.BoxGeometry(8, 5, 0.2), [K.lam('#cfd6e4'), K.lam('#cfd6e4'), K.lam('#cfd6e4'), K.lam('#cfd6e4'), new T.MeshBasicMaterial({ map: tx }), K.lam('#cfd6e4')]); K.scene.add(m); cards.push(m);
    }
    // wall of Lean lines
    leanTex = K.canvasTex(1024, 2048, () => {}); lean = K.mesh(new T.PlaneGeometry(42, 84), new T.MeshBasicMaterial({ map: leanTex, transparent: true }), [0, 60, -40]);
    // Erdős's list: a tall board of small cards
    listTex = K.canvasTex(1024, 2048, () => {}); list = K.mesh(new T.PlaneGeometry(64, 128), new T.MeshBasicMaterial({ map: listTex }), [0, 64, -40]);
  }
  // ---------------------------------------------------------------- dot/rod layouts
  let o3;
  function layout(pts, pairs, o = {}) {   // pts: [[x,z],...] in table units; pairs: [[i,j],...]
    const s = o.s ?? 1, yy = o.y ?? 0.5, nd = Math.min(pts.length, dots.count), np = Math.min(pairs.length, rods.count);
    for (let i = 0; i < dots.count; i++) { if (i < nd) { o3.position.set(pts[i][0] * s, yy, pts[i][1] * s); o3.scale.setScalar(o.dotScale ?? 1); } else o3.scale.setScalar(0); o3.rotation.set(0, 0, 0); o3.updateMatrix(); dots.setMatrixAt(i, o3.matrix); }
    const a = new T.Vector3(), b = new T.Vector3(), show = o.show ?? np;
    for (let k = 0; k < rods.count; k++) {
      if (k < np && k < show) { const [i, j] = pairs[k]; a.set(pts[i][0] * s, yy, pts[i][1] * s); b.set(pts[j][0] * s, yy, pts[j][1] * s); o3.position.copy(a).lerp(b, 0.5); o3.lookAt(b); o3.scale.set(1, 1, a.distanceTo(b)); }
      else o3.scale.setScalar(0);
      o3.updateMatrix(); rods.setMatrixAt(k, o3.matrix);
    }
    dots.instanceMatrix.needsUpdate = true; rods.instanceMatrix.needsUpdate = true; dots.visible = rods.visible = true;
  }
  const unitPairs = (pts, d2 = 1, tol = 1e-6) => { const out = []; for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const dx = pts[i][0] - pts[j][0], dz = pts[i][1] - pts[j][1]; if (Math.abs(dx * dx + dz * dz - d2) < tol) out.push([i, j]); } return out; };
  const TRI = [[0, 0], [1, 0], [0.5, Math.sqrt(3) / 2]], DIAMOND = [...TRI, [1.5, Math.sqrt(3) / 2]];
  let GRID, GRID_PAIRS, AIP, AI_PAIRS;
  function buildLayouts() {
    const N = F().grid_side, d2 = F().grid_best_sq_dist; GRID = []; for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) GRID.push([x - (N - 1) / 2, y - (N - 1) / 2]);
    GRID_PAIRS = unitPairs(GRID, d2);   // 1,744 for N=20, d2=65 (checked in tests)
    // illustrative "AI pattern": a 2-D projection of a 3-D lattice; many unit pairs, not a grid. Not the real construction.
    const u = [1, 0], v = [Math.cos(1.0472), Math.sin(1.0472)], w = [Math.cos(2.3), Math.sin(2.3)]; AIP = []; const seen = new Set();
    for (let a = -5; a <= 5; a++) for (let b = -5; b <= 5; b++) for (let c = -2; c <= 2; c++) { const x = a * u[0] + b * v[0] + c * w[0], z = a * u[1] + b * v[1] + c * w[1]; if (x * x + z * z > 36) continue; const kk = `${x.toFixed(4)},${z.toFixed(4)}`; if (seen.has(kk)) continue; seen.add(kk); AIP.push([x, z]); }
    AI_PAIRS = unitPairs(AIP, 1, 1e-4);
  }
  function showCore(t, pulse) { core.visible = halo.visible = true; core.rotation.set(t * 0.2, t * 0.33, 0); core.material.emissiveIntensity = 0.6 + 0.9 * pulse; halo.material.opacity = 0.5 + 0.5 * pulse; }
  // the Lean wall: scrolling monospace-ish lines; n lines checked (green ticks)
  function drawLean(checked, scroll) {
    const { c, g } = leanTex.userData, w = c.width, h = c.height; g.fillStyle = '#0f1420'; g.fillRect(0, 0, w, h);
    const rng = mulberry32(31), lines = 64, lh = h / lines, frag = ['theorem', 'lemma', 'have h :=', 'simp only', 'exact', 'calc', 'rw [', 'intro x', 'apply', 'norm_num', 'ring', 'omega', 'Finset.sum', 'Nat.card', 'obtain ⟨', 'refine ⟨'];
    for (let i = 0; i < lines; i++) { const y = ((i * lh - scroll * lh) % h + h) % h, ind = (i * 7) % 4; g.font = '700 26px Nunito'; g.fillStyle = i < checked ? '#8fe3b4' : '#5b6a85'; g.fillText((i < checked ? '✓ ' : '  ') + '  '.repeat(ind) + frag[(i * 5) % frag.length] + ' ' + frag[(i * 11 + 3) % frag.length] + ' ' + ['a', 'b', 'x', 'n', 'P', 'd'][i % 6] + (i % 3 ? ' ' + ['≤', '=', '∈', '→'][i % 4] + ' ' + ['n ^ (1 + ε)', 'unitDist P', '|P|', 'K', 'Λ'][i % 5] : ''), 24, y + lh * 0.7); }
    leanTex.needsUpdate = true;
  }
  // Erdős's list board: 1,217 small cards; solved ones green, newly-solved ones gold
  function drawList(newly, pulse) {
    const { c, g } = listTex.userData, w = c.width, h = c.height; g.fillStyle = '#11182a'; g.fillRect(0, 0, w, h);
    const total = F().erdos_total, open = F().erdos_open, cols = 29, cw = (w - 40) / cols, rows = Math.ceil(total / cols), ch = (h - 40) / rows, rng = mulberry32(17);
    const solvedIdx = new Set(); while (solvedIdx.size < total - open) solvedIdx.add(Math.floor(rng() * total));
    const newIdx = [...solvedIdx].slice(0, 0); const picks = []; const pr = mulberry32(5); while (picks.length < 12) { const i = Math.floor(pr() * total); if (!solvedIdx.has(i) && !picks.includes(i)) picks.push(i); }
    for (let i = 0; i < total; i++) { const x = 20 + (i % cols) * cw, y = 20 + Math.floor(i / cols) * ch, k = picks.indexOf(i);
      g.fillStyle = k >= 0 && k < newly ? C.gold : solvedIdx.has(i) ? '#2d8c5e' : '#2a3450'; K.roundRect(g, x + 2, y + 2, cw - 4, ch - 4, 4); g.fill(); }
    if (pulse !== undefined) { const i = picks[newly] ?? picks[11], x = 20 + (i % cols) * cw, y = 20 + Math.floor(i / cols) * ch; g.strokeStyle = C.gold; g.lineWidth = 4 + 3 * pulse; K.roundRect(g, x - 2, y - 2, cw, ch, 5); g.stroke(); }
    listTex.needsUpdate = true;
  }

  // ---------------------------------------------------------------- scenes
  // 1. Hook: floating old papers (the lookup) get a red stamp; then the first glowing dots and rods appear: NEW.
  function hook_lookup(c) {
    const to = K.at(c, 'october'), tl = K.at(c, 'did'), tm = K.at(c, 'may'), te = K.at(c, 'eighty');
    const k = ease.inOut(seg(c.t, tm - 0.3, tm + 1.0));
    K.camBlend([[0, 18, 42], [0, 12, 0], 48], [[0, 30, 36], [0, 1, 0], 48], k); showCore(c.t, c.t > tm ? 0.8 : 0.15);
    cards.forEach((m, i) => { m.visible = c.t < tm + 0.6; const u = (c.t * 0.12 + i / 8) % 1; m.position.set(-22 + i * 6.2 + Math.sin(c.t + i) * 1.5, 8 + 5 * Math.sin(u * 6.28 + i), -4 - (i % 3) * 5); m.rotation.set(0, Math.sin(c.t * 0.5 + i) * 0.3, 0); m.scale.setScalar(1 - seg(c.t, tm, tm + 0.6)); });
    if (c.t > tm) { const pts = GRID.filter(p => Math.hypot(p[0], p[1]) < 5.5), pairs = unitPairs(pts, F().grid_best_sq_dist); layout(pts, pairs, { s: 2.2, show: Math.floor(seg(c.t, tm + 0.2, te + 0.7) * pairs.length) }); }
    return K.chip(540, 300, 'OCTOBER 2025: "SOLVED 10 ERDŐS PROBLEMS"', { size: 30, bg: '#2a3346', p: seg(c.t, to, to + 0.3), op: 1 - seg(c.t, tm - 0.2, tm), ls: 1 })
      + K.stamp(540, 520, 'ONLY FOUND OLD PAPERS', C.red, seg(c.t, tl, tl + 0.5) * (1 - seg(c.t, tm - 0.2, tm)), -6, 50)
      + K.chip(540, 300, 'MAY 2026: SOMETHING NEW', { size: 36, bg: C.gold, fg: C.ink, p: seg(c.t, tm, tm + 0.3), ls: 2 })
      + K.caption(c);
  }
  // 2. The puzzle: dots on a table, rods for pairs exactly 1 apart, 3→3, 4→5, then a million.
  function dots_puzzle(c) {
    const td = K.at(c, 'dots', 0), tq = K.at(c, 'how'), t3 = K.at(c, 'three', 0), t4 = K.at(c, 'four'), tm = K.at(c, 'million');
    K.setCam([0, 26, 30], [0, 0, 0], 46);
    let pts, pairs, show, label = '';
    if (c.t < t4) { pts = TRI; pairs = unitPairs(TRI); show = c.t < t3 ? (c.t > tq ? 3 : 0) : 3; }
    else { pts = DIAMOND; pairs = unitPairs(DIAMOND); show = Math.min(5, 3 + Math.floor(seg(c.t, t4, t4 + 0.6) * 3)); }
    layout(pts.map(p => [p[0] - 0.75, p[1] - 0.43]), pairs, { s: 9, show, dotScale: 2.2 });
    const mk = seg(c.t, tm, tm + 0.5); million.material.opacity = 0.9 * mk; million.visible = mk > 0; if (mk > 0) { dots.visible = rods.visible = false; }
    const n = c.t >= t4 ? 4 : 3, p = c.t >= t4 ? show : (c.t >= tq ? 3 : 0);
    const ruler = c.t > tq && c.t < t3 + 0.6 && mk === 0 ? (() => { const a = K.proj([-0.75 * 9, 1, -0.43 * 9]), b = K.proj([0.25 * 9, 1, -0.43 * 9]); return `<line x1="${f1(a.x)}" y1="${f1(a.y + 70)}" x2="${f1(b.x)}" y2="${f1(b.y + 70)}" stroke="#fff" stroke-width="6"/>` + K.chip((a.x + b.x) / 2, a.y + 120, 'exactly 1 inch', { size: 32, bg: '#2a3346', p: seg(c.t, tq, tq + 0.3) }); })() : '';
    return (mk > 0 ? K.chip(540, 300, 'now a MILLION dots', { size: 44, bg: C.gold, fg: C.ink, p: mk }) : K.hud(n, 'dots', `${p} pairs`, C.gold, { op: seg(c.t, td, td + 0.3) }))
      + ruler + K.note('Illustration · 24,000 dots drawn', mk) + K.caption(c);
  }
  // 3. The grid: 20x20, scaled so the most popular distance is 1; rods light up to exactly 1,744.
  function grid_ceiling(c) {
    const t19 = K.at(c, '1946'), tf = K.at(c, 'four'), tp = K.at(c, 'thousand'), tn = K.at(c, 'nothing', 0), te = K.at(c, 'eighty');
    const k = ease.inOut(seg(c.t, 0, 2.5)); K.camBlend([[0, 24, 44], [0, 0, 0], 46], [[0, 52, 30], [0, 0, 0], 46], k);
    const show = Math.floor(seg(c.t, tf, tp + 0.9) * GRID_PAIRS.length);
    layout(GRID, GRID_PAIRS, { s: 1.5, show, dotScale: 0.9 }); rods.material.opacity = 0.55;
    const n = Math.round(GRID_PAIRS.length * seg(c.t, tf, tp + 0.9));
    return K.chip(540, 300, 'ERDŐS · 1946', { size: 40, bg: '#2a3346', p: seg(c.t, t19, t19 + 0.3), ls: 3 })
      + K.chip(540, 390, '"the grid is the ceiling"', { size: 34, bg: C.gold, fg: C.ink, p: seg(c.t, tn - 0.6, tn - 0.3) })
      + K.hud(c.t > tf ? F().grid_n : 0, 'dots', `${n.toLocaleString('en-GB')} pairs`, C.gold, { op: seg(c.t, tf, tf + 0.3), w: 540 })
      + K.chip(540, 480, '1946 ———————— 2026', { size: 32, bg: '#2a3346', p: seg(c.t, te, te + 0.3), ls: 2 }) + K.caption(c);
  }
  // 4. The AI family: the core emits a new pattern; a growth chart shows it climbing above the grid; ERDŐS WAS WRONG.
  function ai_family(c) {
    const tg = K.at(c, 'general'), tf = K.at(c, 'family'), tc = K.at(c, 'climb'), tn = K.at(c, 'nine'), tw = K.at(c, 'wrong');
    K.setCam([0, 30, 40], [0, 2, -4], 46); showCore(c.t, 0.4 + 0.6 * seg(c.t, tf - 0.3, tf + 0.3));
    const show = Math.floor(seg(c.t, tf, tf + 1.6) * AI_PAIRS.length); layout(AIP, AI_PAIRS, { s: 2.6, show, dotScale: 1.1 }); rods.material.color.set(C.rodAI); rods.material.opacity = 0.9;
    // growth chart: grid vs AI, schematic
    const gk = seg(c.t, tc, tc + 1.2); let chart = '';
    if (gk > 0) { const x0 = 160, x1 = 920, y0 = 760, h = 300; const g = u => y0 - h * Math.pow(u, 1.25) * 0.75, a = u => y0 - h * Math.pow(u, 1.25) * 0.75 - h * 0.35 * Math.pow(u, 3); let pg = '', pa = '';
      for (let i = 0; i <= 40; i++) { const u = i / 40, x = lerp(x0, x1, u); pg += `${f1(x)},${f1(g(u))} `; if (u <= gk) pa += `${f1(x)},${f1(a(u))} `; }
      chart = `<g opacity="${seg(c.t, tc, tc + 0.3)}"><rect x="100" y="420" width="880" height="380" rx="26" fill="#0f1420" opacity="0.92"/>${K.txt(140, 470, 'PAIRS vs DOTS (schematic)', 26, C.grey, 'start', 'letter-spacing="2"')}<polyline points="${pg}" stroke="${C.gold}" stroke-width="8" fill="none" stroke-linecap="round"/><polyline points="${pa}" stroke="${C.rodAI}" stroke-width="8" fill="none" stroke-linecap="round"/>${K.txt(x1 + 10, g(1) + 10, 'grid', 30, C.gold, 'start')}${gk >= 1 ? K.txt(x1 + 10, a(1) + 10, 'AI', 30, C.rodAI, 'start') : ''}</g>`; }
    return K.note('Illustration · not the real construction', seg(c.t, tf, tf + 0.3))
      + K.chip(540, 300, 'general model · no hints', { size: 34, bg: C.blue, p: seg(c.t, tg, tg + 0.3), op: 1 - seg(c.t, tc - 0.2, tc) }) + chart
      + K.chip(540, 300, `checked by ${F().reviewers} mathematicians`, { size: 34, bg: C.green, fg: C.ink, p: seg(c.t, tn, tn + 0.3) })
      + K.stamp(540, 1000, 'ERDŐS WAS WRONG', C.red, seg(c.t, tw, tw + 0.5), -6, 60) + K.caption(c);
  }
  // 5. Sceptic: "it's dots" → nobody is building anything → the wall of Lean lines, every line checked.
  function sceptic_dots(c) {
    const tf = K.at(c, 'fair'), tn = K.at(c, 'nobody'), tc = K.at(c, 'computer'), tt = K.at(c, 'tens'), tb = K.at(c, 'bluffed');
    if (c.t < tc - 0.3) { K.setCam([0, 30, 40], [0, 2, -4], 46); layout(AIP, AI_PAIRS, { s: 2.6, dotScale: 1.1 }); rods.material.color.set(C.rodAI); rods.material.opacity = c.t > tn ? 0.35 : 0.9; }
    else { lean.visible = true; const k = ease.inOut(seg(c.t, tc - 0.3, tc + 1.2)); K.camBlend([[0, 40, 70], [0, 40, -40], 46], [[0, 60, 46], [0, 60, -40], 46], k); drawLean(Math.floor(64 * seg(c.t, tc + 0.3, tt + 1.0)), (c.t - tc) * 6); }
    const n = Math.round(F().lean_lines * ease.out(seg(c.t, tt - 0.2, tt + 1.2)));
    return K.chip(540, 1250, 'THE SCEPTIC', { size: 30, bg: '#6b7280', p: seg(c.t, 0.05, 0.3), op: 1 - seg(c.t, tf - 0.4, tf - 0.1), ls: 3 })
      + K.chip(540, 300, 'no product · no app · no money in it', { size: 32, bg: '#2a3346', p: seg(c.t, tn, tn + 0.3), op: 1 - seg(c.t, tc - 0.3, tc) })
      + (c.t > tt - 0.2 ? `<rect x="120" y="230" width="840" height="210" rx="28" fill="#0b1020" opacity="0.88"/>` + K.txt(540, 330, n.toLocaleString('en-GB'), 104, '#ffffff', 'middle', 'filter="url(#glow6)"') + K.txt(540, 392, 'lines of proof · checked by Lean', 36, '#9fe3b4') : '')
      + K.stamp(540, 1000, 'CANNOT BE BLUFFED', C.green, seg(c.t, tb, tb + 0.5), -5, 56) + K.caption(c);
  }
  // 6. The to-do list: 1,217 cards, 565 green, 652 dark; a dozen flip gold with "2026 · AI".
  function todo_list(c) {
    const tt = K.at(c, 'todo'), tw = K.at(c, 'twelve'), ts = K.at(c, 'six'), tc = K.at(c, 'crossing');
    list.visible = true; const k = ease.inOut(seg(c.t, 0, c.T)); K.camBlend([[0, 64, 70], [0, 64, -40], 46], [[0, 70, 56], [0, 76, -40], 46], k);
    drawList(Math.floor(12 * seg(c.t, tc, tc + 1.2)));
    const n = Math.round(F().erdos_total * ease.out(seg(c.t, tw - 0.2, tw + 1.0)));
    return K.chip(540, 300, "ERDŐS'S TO-DO LIST", { size: 36, bg: '#2a3346', p: seg(c.t, tt, tt + 0.3), ls: 3 })
      + (c.t > tw - 0.2 ? K.txt(540, 430, n.toLocaleString('en-GB'), 104, '#ffffff', 'middle', 'filter="url(#glow6)"') + K.txt(540, 492, 'problems', 36, C.grey) : '')
      + K.chip(540, 1250, `${F().erdos_open} still open`, { size: 40, bg: '#2a3450', p: seg(c.t, ts, ts + 0.3) })
      + K.chip(540, 1170, '2026 · AI', { size: 34, bg: C.gold, fg: C.ink, p: seg(c.t, tc, tc + 0.3) }) + K.caption(c);
  }
  // 7. Threshold: the list, frozen, one open card pulsing.
  function threshold_next(c) {
    list.visible = true; K.setCam([0, 70, 56], [0, 76, -40], 46); drawList(12, 0.5 + 0.5 * Math.sin(c.t * 5));
    return `<defs><linearGradient id="fadeB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.sky}" stop-opacity="0"/><stop offset="0.35" stop-color="${C.sky}" stop-opacity="0.85"/><stop offset="1" stop-color="${C.sky}" stop-opacity="0.95"/></linearGradient></defs><rect x="0" y="980" width="${W}" height="${H - 980}" fill="url(#fadeB)"/>` + K.bigLine(c, 1180, 72);
  }
  const SCENES = { hook_lookup, dots_puzzle, grid_ceiling, ai_family, sceptic_dots, todo_list, threshold_next };
  E.registerScenes(SCENES);
  const reset = () => { for (const o of [core, halo, lean, list, million, dots, rods, ...cards]) o.visible = false; rods.material.color.set(C.rod); rods.material.opacity = 0.85; };
  E.custom = {
    async setup() { T = K.T; o3 = new T.Object3D(); K.init({ bg: C.sky, fog: [200, 1600], near: 0.5 }); buildWorld(); buildLayouts(); },
    frame: K.frameFn(SCENES, reset)
  };
})();
