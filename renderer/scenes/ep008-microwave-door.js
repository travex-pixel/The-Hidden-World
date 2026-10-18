/* Episode 008 — why microwaves can't get through the door you can see through. A low-poly kitchen (1 unit = 1 cm,
   so the 12.2 cm waves inside the oven are drawn at true size) and a macro stage of the door's perforated sheet
   (2 units = 1 mm: 1.5 mm holes against a 122 mm wave, the real ratio). Built on renderer/kit3d.js. Pure function of t. */
(function () {
  const E = window.HW; const { W, H, clamp, lerp, ease, seg, f1, mulberry32 } = E;
  const K = window.KIT3D(E);
  const C = { sky: '#efe8dd', floor: '#d6cbb9', wall: '#f2ece2', counter: '#ebe5da', cab: '#c9bda9', body: '#f5f5f3', trim: '#2b2f36', wave: '#ff5a36', light: '#ffe27a',
    blue: '#3a7cf0', gold: '#ffb52e', red: '#ee3b30', green: '#20ad68', ink: '#1d232b', steel: '#1c232d', grey: '#9aa3b0' };
  const WL = 12.2, CY = 105, CAV = { x0: -22, x1: 6, y0: 93, y1: 117, z0: -16, z1: 16 }, MZ = 5000, MPX = 2;   // cavity (cm); macro stage at z=5000, 2 units per mm
  let T, waves, leak, glass, sheet, sheetMat, glow, cavLight, food, bowlOut, foodOut, cage, macro, hole, streaks, router, routerLed, display, frameLines;

  // ---------------------------------------------------------------- kitchen (once)
  function box(w, h, d, col, pos, parent) { const m = K.mesh(new T.BoxGeometry(w, h, d), K.lam(col), pos, parent); return m; }
  function holesTex(px, pitch, holeR, metal) {   // perforated sheet: metal with transparent round holes (alpha), tileable
    const t = K.canvasTex(px, px, (g, w) => { g.fillStyle = metal; g.fillRect(0, 0, w, w); g.globalCompositeOperation = 'destination-out'; const n = w / pitch;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const x = (i + 0.5 + (j % 2) * 0.5) * pitch, y = (j + 0.5) * pitch; for (const dx of [0, -w]) { g.beginPath(); g.arc(x + dx, y, holeR, 0, 7); g.fill(); } } });
    t.wrapS = t.wrapT = T.RepeatWrapping; return t;
  }
  function foodTex(frozen) {
    return K.canvasTex(256, 256, (g, w) => { const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      if (frozen) { r.addColorStop(0, '#cfeeff'); r.addColorStop(0.38, '#9fd3f0'); r.addColorStop(0.55, '#e5925a'); r.addColorStop(1, '#d9572b'); } else { r.addColorStop(0, '#e98a3c'); r.addColorStop(1, '#d9632b'); }
      g.fillStyle = r; g.fillRect(0, 0, w, w); if (frozen) { const rr = mulberry32(3); g.fillStyle = '#ffffff'; for (let i = 0; i < 90; i++) { const a = rr() * 7, d = rr() * w * 0.24; g.fillRect(w / 2 + Math.cos(a) * d, w / 2 + Math.sin(a) * d, 3, 3); } } });
  }
  function bowl(pos, frozen) {
    const g = new T.Group(); const prof = [[0, 0], [6, 0], [8.5, 1.2], [10, 5.5], [10.4, 6.2], [9.8, 6.2]].map(([x, y]) => new T.Vector2(x, y));
    g.add(new T.Mesh(new T.LatheGeometry(prof, 32), K.lam('#f7f3ea', { side: T.DoubleSide })));
    const f = new T.Mesh(new T.CircleGeometry(9.6, 40), new T.MeshLambertMaterial({ map: foodTex(frozen), emissive: '#3a1a08', emissiveIntensity: frozen ? 0.15 : 0.3 })); f.rotation.x = -Math.PI / 2; f.position.y = 5.2; g.add(f);
    g.position.set(...pos); K.scene.add(g); return { g, f };
  }
  function buildKitchen() {
    K.scene.add(new T.HemisphereLight('#ffffff', '#cbbfae', 1.7)); const sun = new T.DirectionalLight('#fff4e4', 1.6); sun.position.set(-120, 260, 200); K.scene.add(sun);
    const fl = K.mesh(new T.PlaneGeometry(2000, 2000), K.lam(C.floor)); fl.rotation.x = -Math.PI / 2;
    K.mesh(new T.PlaneGeometry(2000, 600), K.lam(C.wall), [0, 300, -40]);
    box(260, 4, 70, C.counter, [10, 88, -5]); box(256, 84, 64, C.cab, [10, 43, -6]);
    for (const x of [-90, -30, 30, 90]) box(1.2, 70, 0.6, '#b3a790', [x, 46, 26.4]);
    for (const x of [-80, 0, 80]) box(76, 60, 34, '#e3dbcd', [x, 210, -22]);
    const kettle = K.mesh(new T.CylinderGeometry(7, 9, 20, 16), K.lam('#9fb8c9'), [-70, 100, -12]); kettle.add(K.mesh(new T.TorusGeometry(5, 1, 6, 12, Math.PI), K.lam('#2b2f36'), [9, 2, 0], kettle));
    const pot = K.mesh(new T.CylinderGeometry(6, 5, 10, 10), K.lam('#c56a4a'), [62, 95, -14]); K.mesh(new T.IcosahedronGeometry(9, 0), K.lam('#6f9a5c', { flatShading: true }), [0, 13, 0], pot);
    // microwave: an open box (so the cavity is visible through the window), control panel, door frame
    const mw = new T.Group(); K.scene.add(mw);
    box(50, 2, 38, C.body, [0, 119, 0], mw); box(50, 2, 38, C.body, [0, 91, 0], mw); box(2, 26, 38, C.body, [-24, CY, 0], mw); box(50, 26, 2, '#cfcbc3', [0, CY, -18], mw);
    box(16, 26, 38, C.body, [17, CY, 0], mw);
    // door frame stands 0.5 cm proud of the body on every side, so no face is shared with the body (no z-fighting)
    for (const [w, h, x, y] of [[4.4, 30.8, -23.1, CY], [3, 30.8, 7.6, CY], [33.6, 5.2, -7.4, 117.6], [33.6, 5.2, -7.4, 92.4]]) box(w, h, 2.4, C.trim, [x, y, 18.3], mw);
    box(0.8, 22, 1, '#d7d9dc', [5.5, CY, 19.6], mw);  // door handle
    display = K.canvasTex(256, 384, () => {}); K.mesh(new T.PlaneGeometry(13, 19.5), new T.MeshBasicMaterial({ map: display }), [17, CY, 19.35], mw);
    // window: perforated metal sheet (inner) and glass (outer), 0.5 cm apart so they never z-fight
    sheetMat = new T.MeshLambertMaterial({ map: holesTex(512, 16, 5.2, '#30363f'), transparent: true, alphaTest: 0.5, side: T.DoubleSide }); sheetMat.map.repeat.set(5, 3.6);
    sheet = K.mesh(new T.PlaneGeometry(28, 20), sheetMat, [-7.5, CY, 17.6], mw);
    glass = K.mesh(new T.PlaneGeometry(28, 20), new T.MeshBasicMaterial({ color: '#9fc3e0', transparent: true, opacity: 0.16, depthWrite: false }), [-7.5, CY, 18.6], mw);
    frameLines = new T.LineSegments(new T.EdgesGeometry(new T.PlaneGeometry(28.4, 20.4)), new T.LineBasicMaterial({ color: C.gold })); frameLines.position.set(-7.5, CY, 18.9); mw.add(frameLines);
    // inside: turntable, bowl, warm light
    K.mesh(new T.CylinderGeometry(13, 13, 0.6, 40), new T.MeshLambertMaterial({ color: '#cfe0e8', transparent: true, opacity: 0.8 }), [-8, 92.4, 0], mw);
    const b = bowl([-8, 92.7, 0], false); food = b;
    cavLight = new T.PointLight('#ffcf7a', 0, 60, 1.5); cavLight.position.set(-8, 114, 4); K.scene.add(cavLight);
    glow = K.mesh(new T.PlaneGeometry(30, 22), new T.MeshBasicMaterial({ color: '#ffb84a', transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false }), [-7.5, CY, -16.8], mw);
    // waves in the cavity at true wavelength: 6 lanes of glowing beads, travelling both ways (bouncing off the walls)
    waves = new T.InstancedMesh(new T.SphereGeometry(0.42, 8, 6), new T.MeshBasicMaterial({ color: C.wave }), 6 * 70); K.scene.add(waves);
    leak = new T.InstancedMesh(new T.SphereGeometry(0.5, 8, 6), new T.MeshBasicMaterial({ color: C.wave, transparent: true, opacity: 0.6 }), 40); K.scene.add(leak);
    // Faraday cage overlay: a grid of glowing bars on every face of the cavity
    const pts = [], g3 = (a0, a1, b0, b1, f) => { for (let a = a0; a <= a1 + 1e-6; a += 3) pts.push(...f(a, b0), ...f(a, b1)); for (let b = b0; b <= b1 + 1e-6; b += 3) pts.push(...f(a0, b), ...f(a1, b)); };
    const X0 = -25, X1 = 25, Y0 = 90, Y1 = 120, Z0 = -19, Z1 = 19.2;
    g3(X0, X1, Y0, Y1, (a, b) => [a, b, Z1]); g3(X0, X1, Y0, Y1, (a, b) => [a, b, Z0]); g3(Z0, Z1, Y0, Y1, (a, b) => [X0, b, a]); g3(Z0, Z1, Y0, Y1, (a, b) => [X1, b, a]); g3(X0, X1, Z0, Z1, (a, b) => [a, Y1, b]); g3(X0, X1, Z0, Z1, (a, b) => [a, Y0, b]);
    const cg = new T.BufferGeometry(); cg.setAttribute('position', new T.Float32BufferAttribute(pts, 3)); cage = new T.LineSegments(cg, new T.LineBasicMaterial({ color: '#4aa8ff', transparent: true, opacity: 0.9 })); K.scene.add(cage);
    // router on the counter
    router = new T.Group(); box(20, 4, 13, '#2a2e35', [0, 2, 0], router); for (const x of [-7, 7]) K.mesh(new T.CylinderGeometry(0.6, 0.6, 14, 8), K.lam('#2a2e35'), [x, 10, -5], router);
    routerLed = K.mesh(new T.BoxGeometry(6, 0.6, 0.3), new T.MeshBasicMaterial({ color: C.green }), [0, 2.4, 6.6], router); router.position.set(34, 90, 8); K.scene.add(router);
    bowlOut = bowl([-44, 90, 14], true);
  }
  // macro stage: a patch of the door sheet at 2 units per mm, a 122 mm wave and light streaks
  function buildMacro() {
    macro = new T.Group(); K.scene.add(macro);
    const tex = holesTex(512, 64, 21, '#4b5563'); tex.repeat.set(600 / 288, 900 / 288);  // one tile = 8 holes of 1.5 mm at 4.5 mm pitch => 288 units
    sheet.userData.macro = K.mesh(new T.PlaneGeometry(600, 900), new T.MeshLambertMaterial({ map: tex, transparent: true, alphaTest: 0.5, side: T.DoubleSide }), [0, 0, MZ], macro);
    macro.add(new T.HemisphereLight('#dfe9ff', '#1a1f28', 0.8));
    hole = new T.Mesh(new T.RingGeometry(1.6, 2.1, 24), new T.MeshBasicMaterial({ color: C.gold })); hole.position.set(0, 0, MZ + 0.6); macro.add(hole);
    macro.userData.beads = new T.InstancedMesh(new T.SphereGeometry(2.2, 10, 8), new T.MeshBasicMaterial({ color: C.wave }), 220); macro.add(macro.userData.beads);
    streaks = new T.InstancedMesh(new T.BoxGeometry(1.4, 1.4, 34), new T.MeshBasicMaterial({ color: C.light }), 90); macro.add(streaks);
  }
  const noCull = (...ms) => ms.forEach(m => { m.frustumCulled = false; });
  function drawDisplay(s, on) { const { c, g } = display.userData; g.fillStyle = '#22262c'; g.fillRect(0, 0, c.width, c.height); g.fillStyle = '#10161b'; K.roundRect(g, 26, 26, 204, 84, 10); g.fill();
    g.fillStyle = on ? '#5dff9a' : '#2f5a40'; g.font = '800 64px Nunito'; g.textAlign = 'center'; g.fillText(s, 128, 92);
    g.fillStyle = '#3a4048'; for (let r = 0; r < 4; r++) for (let q = 0; q < 3; q++) { K.roundRect(g, 30 + q * 68, 140 + r * 50, 56, 38, 8); g.fill(); } g.fillStyle = on ? '#3fa7ff' : '#3a4048'; K.roundRect(g, 30, 345, 196, 30, 8); g.fill(); display.needsUpdate = true; }

  // ---------------------------------------------------------------- per-frame helpers
  function run(t, on, amp = 2.4) {   // oven running: light, glow, rotating food, travelling waves
    cavLight.intensity = on ? 260 : 0; glow.material.opacity = on ? 0.18 : 0; food.g.rotation.y = t * 0.6;
    waves.visible = on > 0; if (!on) return;
    const o = new T.Object3D(), lanes = [[98, -8, 1], [103, 6, -1], [108, -2, 1], [112, 10, -1], [101, 12, 1], [115, -12, -1]]; let i = 0;
    lanes.forEach(([y, z, dir]) => { for (let k = 0; k < 70; k++) { const x = lerp(CAV.x0, CAV.x1, k / 69), ph = 2 * Math.PI * (x / WL) - dir * t * 7; o.position.set(x, y + amp * Math.sin(ph), z + 0.6 * Math.cos(ph)); o.scale.setScalar(on); o.updateMatrix(); waves.setMatrixAt(i++, o.matrix); } });
    waves.instanceMatrix.needsUpdate = true;
  }
  function leaking(t, k) {   // a faint trickle of beads escaping around the door (exaggerated so it can be seen)
    leak.visible = k > 0; if (!k) return; const o = new T.Object3D(), rng = mulberry32(9);
    for (let i = 0; i < 40; i++) { const u = ((t * 0.5 + rng()) % 1), x = 9 + u * 40, y = 98 + rng() * 16 + Math.sin(u * 20 + i) * 2, z = 20 + u * 6; o.position.set(x, y, z); o.scale.setScalar(k * (1 - u)); o.updateMatrix(); leak.setMatrixAt(i, o.matrix); }
    leak.instanceMatrix.needsUpdate = true;
  }
  function macroWave(t, tHit, k) {   // incident pulse travels to the sheet, reflects at tHit (beads along z in front of the sheet)
    const b = macro.userData.beads, o = new T.Object3D(), lam = WL * 10 * MPX, A = 34;   // 122 mm wave = 244 units
    for (let i = 0; i < 220; i++) { const z = MZ + 2 + i * 3.2, d = z - MZ, front = 520 - 260 * (t - tHit + 2) ; const inc = t < tHit ? (d > front - 300 && d >= 0 ? 1 : 0) : 0;
      const refl = t >= tHit ? (d < 260 * (t - tHit) + 40 ? 1 : 0) : 0, on = Math.max(inc, refl) * k;
      o.position.set(-40, A * Math.sin(2 * Math.PI * d / lam - t * 6 * (refl ? -1 : 1)) * on, z); o.scale.setScalar(on ? 1 : 0); o.updateMatrix(); b.setMatrixAt(i, o.matrix); }
    b.instanceMatrix.needsUpdate = true; b.material.color.set(t >= tHit ? '#ff8a3d' : C.wave);
  }

  // ---------------------------------------------------------------- scenes
  // 1. Hook: a running microwave, waves bouncing inside; the glass is cleared, the dotted sheet takes the credit.
  function hook_glass(c) {
    const tg = K.at(c, 'glass'), td = K.at(c, 'dotted'), k = ease.inOut(seg(c.t, 0, c.T));
    K.camBlend([[0, 122, 140], [0, 103, 0], 46], [[-5, 107, 58], [-7, 105, 10], 46], k); run(c.t, 1); drawDisplay('0:' + String(45 - Math.floor(c.t)).padStart(2, '0'), true);
    glass.material.opacity = 0.16 + 0.3 * seg(c.t, tg, tg + 0.3) * (1 - seg(c.t, td - 0.2, td)); frameLines.visible = c.t > td;
    const g = K.proj([-7.5, 118, 19]);
    return K.chip(540, g.y - 70, 'GLASS: microwaves pass through', { size: 34, bg: '#3e6e9e', p: seg(c.t, tg + 0.1, tg + 0.4), op: 1 - seg(c.t, td - 0.3, td) })
      + K.chip(540, g.y - 70, 'THIS METAL SHEET STOPS THEM', { size: 36, bg: C.gold, fg: C.ink, p: seg(c.t, td, td + 0.3), ls: 2 }) + K.caption(c);
  }
  // 2. The wave: true-size 12.2 cm waves inside the cavity, with a ruler.
  function wave_size(c) {
    const tw = K.at(c, 'twelve'), tb = K.at(c, 'bounce');
    K.camBlend([[-6, 107, 62], [-8, 106, 0], 46], [[-8, 108, 54], [-8, 106, 0], 46], ease.inOut(seg(c.t, 0, c.T))); run(c.t, 1); drawDisplay('0:39', true);
    sheet.visible = c.t < 0.4; glass.visible = c.t < 0.4;   // look through the door into the cavity
    const a = K.proj([-14.2, 108 + 3.6, -2]), b = K.proj([-2, 108 + 3.6, -2]), y = Math.min(a.y, b.y) - 30, kk = seg(c.t, tw, tw + 0.5);
    return (kk > 0 ? `<g opacity="${kk}"><line x1="${f1(a.x)}" y1="${f1(y)}" x2="${f1(lerp(a.x, b.x, ease.out(kk)))}" y2="${f1(y)}" stroke="#fff" stroke-width="6"/><line x1="${f1(a.x)}" y1="${y - 20}" x2="${f1(a.x)}" y2="${y + 20}" stroke="#fff" stroke-width="6"/><line x1="${f1(b.x)}" y1="${y - 20}" x2="${f1(b.x)}" y2="${y + 20}" stroke="#fff" stroke-width="6" opacity="${kk >= 1 ? 1 : 0}"/></g>` : '')
      + K.chip((a.x + b.x) / 2, y - 60, 'one wave ≈ 12.2 cm', { size: 40, bg: C.wave, p: seg(c.t, tw + 0.3, tw + 0.6) })
      + K.chip(540, 1250, '2.45 GHz', { size: 32, bg: '#2a2f38', p: seg(c.t, tw + 0.6, tw + 0.9) })
      + K.chip(540, 300, 'bounce off the metal walls', { size: 34, bg: '#2a2f38', p: seg(c.t, tb, tb + 0.3) }) + K.caption(c);
  }
  // 3. The holes: macro on the sheet. 1.5 mm holes; the 122 mm wave arrives and reflects as if the sheet were solid.
  function mesh_holes(c) {
    const th = K.at(c, 'holes'), ts = K.at(c, 'solid'), tb = K.at(c, 'bounce');
    macro.visible = true; K.scene.background.set('#1b222d'); K.scene.fog.near = 2000; K.scene.fog.far = 4000;
    const k = ease.inOut(seg(c.t, 0, 1.6)); K.camBlend([[0, 0, MZ + 14], [0, 0, MZ], 46], [[300, 120, MZ + 420], [0, 0, MZ + 160], 46], k);
    macroWave(c.t, tb, seg(c.t, ts - 1.2, ts - 0.8));
    const hp = K.proj([0, 0, MZ]); macro.userData.beads.visible = true;
    return K.chip(clamp(hp.x, 260, 820), hp.y - 70, 'hole ≈ 1.5 mm', { size: 38, bg: C.gold, fg: C.ink, p: seg(c.t, th, th + 0.3), op: 1 - seg(c.t, ts - 0.6, ts - 0.3) })
      + K.chip(540, 300, 'to the wave, this is solid metal', { size: 36, bg: '#3e4a5c', p: seg(c.t, ts, ts + 0.3) })
      + K.chip(540, 400, 'one wave: 122 mm', { size: 36, bg: C.wave, p: seg(c.t, ts - 0.8, ts - 0.5) })
      + K.stamp(540, 1120, 'BOUNCES BACK', C.wave, seg(c.t, tb + 0.2, tb + 0.7), -6, 56)
      + K.note('Sizes to scale: 2 units = 1 mm', seg(c.t, 1.6, 2.0)) + K.caption(c);
  }
  // 4. Light: thousands of times smaller, it streams straight through the holes.
  function light_through(c) {
    const tl = K.at(c, 'light'), ts = K.at(c, 'slip'), tf = K.at(c, 'food');
    macro.visible = true; K.scene.background.set('#1b222d'); K.scene.fog.near = 2000; K.scene.fog.far = 4000;
    K.camBlend([[300, 120, MZ + 420], [0, 0, MZ + 160], 46], [[160, 40, MZ - 220], [0, 0, MZ], 50], ease.inOut(seg(c.t, ts - 0.3, tf + 0.4)));
    const o = new T.Object3D(), pitch = 288 / 8; let i = 0;
    for (let a = -4; a < 5; a++) for (let b = -5; b < 5; b++) { const x = (a + 0.5 + ((b + 100) % 2) * 0.5) * pitch, y = (b + 0.5) * pitch, z = MZ + 300 - ((c.t * 220 + (a * 37 + b * 61) % 300) % 600);
      o.position.set(x, y, z); o.scale.setScalar(seg(c.t, tl - 0.2, tl + 0.3)); o.updateMatrix(); if (i < 90) streaks.setMatrixAt(i++, o.matrix); }
    streaks.count = i; streaks.instanceMatrix.needsUpdate = true;
    return K.chip(540, 300, 'light wave ≈ 0.0005 mm', { size: 38, bg: '#c99a12', p: seg(c.t, tl + 0.2, tl + 0.5) })
      + K.chip(540, 390, '~3,000× smaller than a hole', { size: 34, bg: '#2a2f38', p: seg(c.t, tl + 0.6, tl + 0.9) })
      + K.caption(c);
  }
  // 5. Sceptic: "why does my Wi-Fi drop?" Same 2.4 GHz band; a tiny legal leak drowns the router out.
  function sceptic_wifi(c) {
    const tw = K.at(c, 'good'), tb = K.at(c, 'band'), tk = K.at(c, 'tiny'), td = K.at(c, 'drowns');
    K.setCam([8, 140, 178], [8, 104, 0], 46); const on = c.t > tw ? 1 : 0; run(c.t, on); drawDisplay(on ? '1:00' : '--:--', on); leaking(c.t, seg(c.t, tk, tk + 0.5));
    routerLed.material.color.set(c.t > td ? C.red : C.green);
    const r = K.proj([34, 104, 8]), m = K.proj([-8, 120, 19]), bars = c.t > td ? 1 : c.t > tk ? 2 : 4;
    let arcs = ''; for (let i = 0; i < 3; i++) { const rr = 40 + i * 34, op = bars >= 2 + i ? 0.9 : 0.15; arcs += `<path d="M ${f1(r.x - rr * 0.7)} ${f1(r.y - rr * 0.7)} A ${rr} ${rr} 0 0 1 ${f1(r.x + rr * 0.7)} ${f1(r.y - rr * 0.7)}" stroke="${bars < 2 ? C.red : C.blue}" stroke-width="10" fill="none" stroke-linecap="round" opacity="${op}"/>`; }
    return K.chip(540, 1250, 'THE SCEPTIC', { size: 30, bg: '#6b7280', p: seg(c.t, 0.05, 0.3), op: 1 - seg(c.t, tw - 0.4, tw - 0.1), ls: 3 })
      + arcs + K.chip(r.x - 30, r.y + 70, 'Wi-Fi 2.4 GHz', { size: 30, bg: C.blue, p: seg(c.t, tb - 0.3, tb) })
      + K.chip(m.x, m.y - 70, 'oven 2.45 GHz', { size: 30, bg: C.wave, p: seg(c.t, tb, tb + 0.3) })
      + K.chip(540, 300, 'US limit: 5 mW/cm² at ~5 cm', { size: 34, bg: '#2a2f38', p: seg(c.t, tk + 0.2, tk + 0.5) }) + K.note('Leak drawn larger than life so you can see it', seg(c.t, tk, tk + 0.3))
      + K.hud(bars, bars === 1 ? 'bar' : 'bars', 'Wi-Fi', bars < 2 ? C.red : C.green, { op: seg(c.t, tw, tw + 0.3) }) + K.caption(c);
  }
  // 6. The whole oven is a Faraday cage: glowing bars on every face, the waves trapped inside.
  function faraday_cage(c) {
    const tc = K.at(c, 'cage'), tf = K.at(c, 'faraday'), a = lerp(-0.7, 0.6, ease.inOut(seg(c.t, 0, c.T)));
    K.setCam([Math.sin(a) * 95 - 2, 128, Math.cos(a) * 95], [-2, 104, 0], 46); run(c.t, 1, 3); drawDisplay('0:21', true);
    cage.visible = c.t > tc - 0.2; cage.material.opacity = 0.9 * seg(c.t, tc - 0.2, tc + 0.4);
    return K.chip(540, 300, 'FARADAY CAGE', { size: 44, bg: C.blue, p: seg(c.t, tf, tf + 0.3), ls: 3 }) + K.caption(c);
  }
  // 7. Threshold: a bowl straight out of the oven, steaming edges, a frozen blue centre. Frozen frame.
  function threshold_frozen(c) {
    K.setCam([-44, 132, 52], [-44, 92, 12], 46); run(0, 0); drawDisplay('0:00', false);
    bowlOut.g.visible = true;
    const p = K.proj([-44, 96, 14]);
    let steam = ''; for (let i = 0; i < 6; i++) { const x = p.x - 180 + i * 72, y = p.y - 230 - (i % 2) * 40; steam += `<path d="M ${x} ${y + 120} q 24 -40 0 -80 q -24 -40 0 -80" stroke="#ffffff" stroke-width="12" fill="none" stroke-linecap="round" opacity="${f1(0.35 + 0.15 * Math.sin(c.t * 3 + i))}"/>`; }
    return steam + `<defs><linearGradient id="fadeK" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2029" stop-opacity="0"/><stop offset="0.4" stop-color="#1b2029" stop-opacity="0.75"/><stop offset="1" stop-color="#1b2029" stop-opacity="0.9"/></linearGradient></defs><rect x="0" y="1000" width="${W}" height="${H - 1000}" fill="url(#fadeK)"/>`
      + K.chip(p.x + 230, p.y - 120, 'still frozen', { size: 34, bg: '#5aa9e6', p: seg(c.t, 0.4, 0.7) }) + K.bigLine(c, 1180, 70, { off: '#5b6575' });
  }
  const SCENES = { hook_glass, wave_size, mesh_holes, light_through, sceptic_wifi, faraday_cage, threshold_frozen };
  E.registerScenes(SCENES);
  const reset = () => {
    for (const o of [macro, cage, leak, bowlOut.g, frameLines, macro.userData.beads]) o.visible = false; sheet.visible = glass.visible = true; streaks.count = 90; waves.visible = true;
    K.scene.background.set(C.sky); K.scene.fog.near = 300; K.scene.fog.far = 1600; routerLed.material.color.set(C.green); glass.material.opacity = 0.16;
  };
  E.custom = {
    async setup() { T = K.T; K.init({ bg: C.sky, fog: [300, 1600], near: 1, far: 9000 }); buildKitchen(); buildMacro(); noCull(waves, leak, macro.userData.beads, streaks); },
    frame: K.frameFn(SCENES, reset)
  };
})();
