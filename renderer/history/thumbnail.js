/* THE HIDDEN WORLD — thumbnail compositor (history series).
   Draws thumbnails from the same rig and artwork as the episode, at 1280×720, following the packaging spec in
   docs/PACKAGING.md: ≤3 words of thick-stroked text, one readable face (closed mouth by default), one saturated
   absurd object, a cool mid-value background wash, ink outlines that survive phone size, and the series'
   deckled parchment edge. Every element must appear in the video (the spec lists where).
   usage (in the history renderer page): await THUMB.render(spec, cast, seed) */
(function (root) {
  const X = root.HX; const P = X.P; const { clamp, lerp, rgba, shade, mix, mulberry32 } = X;
  const TW = 1280, TH = 720, INK = '#1B1A1F', PARCH = '#F3E7C9';
  const LAYOUTS = {
    // fractions of the canvas; from the research report's machine-readable layout table
    L1: { char: [0.03, 0.14, 0.47, 1.0], face_h: 0.44, face_c: [0.25, 0.42], object: [0.72, 0.56], object_size: [0.30, 0.50], text: [0.52, 0.05, 0.97, 0.27], cap_h: 0.14, align: 'right' },
    L2: { char: [0.02, 0.52, 0.32, 1.0], face_h: 0.22, face_c: [0.15, 0.66], object: [0.62, 0.48], object_size: [0.58, 0.72], text: [0.03, 0.04, 0.42, 0.22], cap_h: 0.13, align: 'left' },
    L4: { char: [0.5, 0.12, 0.98, 1.0], face_h: 0.40, face_c: [0.74, 0.40], object: [0.27, 0.48], object_size: [0.42, 0.7], text: [0.04, 0.78, 0.5, 0.95], cap_h: 0.10, align: 'left' }
  };

  function canvas(w, h) { return P.canvas(w, h); }

  // background: one cool wash, lighter at the centre, watercolour blooms and paper grain
  function background(g, bg, rng) {
    g.fillStyle = bg; g.fillRect(0, 0, TW, TH);
    const r = g.createRadialGradient(TW * 0.55, TH * 0.45, 40, TW * 0.55, TH * 0.5, TW * 0.75); r.addColorStop(0, rgba(shade(bg, 0.28), 1)); r.addColorStop(1, rgba(shade(bg, -0.35), 1));
    g.fillStyle = r; g.fillRect(0, 0, TW, TH);
    for (let i = 0; i < 9; i++) P.bloom(g, rng() * TW, rng() * TH, 120 + rng() * 260, shade(bg, rng() < 0.5 ? 0.25 : -0.25), 0.28);
    P.granulate(g, 0, 0, TW, TH, 0.28);
  }
  // series edge: deckled parchment border
  function border(g, rng) {
    const c = canvas(TW, TH), cg = c.getContext('2d'); cg.fillStyle = PARCH; cg.fillRect(0, 0, TW, TH);
    cg.globalCompositeOperation = 'destination-out'; const inset = 16;
    P.polyPath(cg, P.deform(P.rect(inset, inset, TW - inset * 2, TH - inset * 2), 5, 0.004, rng)); cg.fill();
    cg.globalCompositeOperation = 'source-atop'; P.granulate(cg, 0, 0, TW, TH, 0.25);
    g.drawImage(c, 0, 0);
  }
  // bold ink outline around anything drawn on its own layer (dilate the silhouette)
  function outlined(g, layer, px) {
    const sil = canvas(layer.width, layer.height), sg = sil.getContext('2d'); sg.drawImage(layer, 0, 0); sg.globalCompositeOperation = 'source-in'; sg.fillStyle = INK; sg.fillRect(0, 0, sil.width, sil.height);
    g.save(); g.globalAlpha = 0.35; g.filter = 'blur(10px)'; g.drawImage(sil, 8, 10); g.filter = 'none'; g.globalAlpha = 1;   // soft drop shadow
    for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; g.drawImage(sil, Math.cos(a) * px, Math.sin(a) * px); }
    g.drawImage(layer, 0, 0); g.restore();
  }
  // the character, head-and-shoulders or full, in watercolour style
  function character(spec, cast, seed) {
    const ch = cast[spec.char] || {};
    const acts = [{ t: 0, expr: spec.expr || 'neutral', look: spec.look || [0.6, 0], dur: 0.01 }];
    if (spec.gesture) acts.push({ t: 0, gesture: spec.gesture, dur: 0.01, hold: -1 });
    if (spec.prop) acts.push({ t: 0, prop: spec.prop });
    if (spec.pose) acts.push({ t: 0, pose: spec.pose, dur: 0.01 });
    const A = X.Rig.compileActor({ id: 'thumb_' + spec.char, char: spec.char, x: 0, h: 1000, acts, spec: ch, seed: 3, facing: spec.facing || 1 });
    const st = X.Rig.evaluate(A, 3.0, null); st.blink = 0; st.sway = 0; st.jolt = 0; st.talk = 0;
    if (spec.mouth !== undefined) st.E = { ...st.E, mouth: spec.mouth };
    return { A, st };
  }
  function drawCharacterLayer(spec, lay, cast, seed) {
    const { A, st } = character(spec, cast, seed);
    const heads = (cast[spec.char] && cast[spec.char].rig && cast[spec.char].rig.heads) || 6;
    const hh = 1000 / heads; const faceH = (spec.face_h ?? lay.face_h) * TH; const K = faceH / hh;
    const [fcx, fcy] = spec.face_c || lay.face_c; const headY = -(st.hip + 300 + 30) - hh * 0.38;
    const layer = canvas(TW, TH), g = layer.getContext('2d');
    g.translate(fcx * TW - 30 * K * (spec.facing || 1), fcy * TH - headY * K); g.scale(K, K);
    X.Rig.drawCharacter(g, A, st, [-0.7, -0.7], { lw: 3.2 / K * 2.2, style: 'watercolour', softPx: 2.5, v3: (spec.engine_version || 2) >= 3, propDraw: (gg, prop) => X.PROPS[prop] && X.PROPS[prop](gg, 0, 4) });
    // pigment texture on the character layer only
    const T = P.wcTextures(seed); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop';
    g.globalAlpha = 0.4; g.fillStyle = g.createPattern(T.dark, 'repeat'); g.fillRect(0, 0, TW, TH); g.globalAlpha = 0.35; g.fillStyle = g.createPattern(T.light, 'repeat'); g.fillRect(0, 0, TW, TH);
    return layer;
  }
  // focal objects (all appear in the episodes)
  const OBJECTS = {
    penny_quarters: (g, o) => { const R = o.r; const r = mulberry32(7); for (const [qx, qy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.save(); g.translate(qx * o.sep, qy * o.sep); g.beginPath(); g.rect(qx < 0 ? -R - 40 : 0, qy < 0 ? -R - 40 : 0, R + 40, R + 40); g.clip(); X.ART.penny(g, 0, 0, R, 'reverse', r); g.restore(); } },
    penny: (g, o) => X.ART.penny(g, 0, 0, o.r, o.side || 'reverse', mulberry32(7)),
    quern: (g, o) => { g.scale(o.r / 90, o.r / 90); X.WORLD_PROPS.quern(g, 0, {}, { beat: () => 1e9 }, null); },
    millstone: (g, o) => X.ART.millstone(g, 0, 0, o.r, mulberry32(5), o.crack || 0, 0),
    floor: (g, o) => {   // a round window onto the abbey floor: flagstones with hand-mill stones set in
      const R = o.r; g.save(); g.beginPath(); g.arc(0, 0, R, 0, 7); g.clip(); g.fillStyle = '#6e685e'; g.fillRect(-R, -R, R * 2, R * 2);
      const r = mulberry32(9); for (let y = -R; y < R; y += 70) for (let x = -R + ((y / 70) % 2) * 45; x < R; x += 90) P.flat(g, [[x + 3, y + 3], [x + 87, y + 4], [x + 86, y + 67], [x + 4, y + 66]], shade('#8a857a', (r() - 0.5) * 0.25), r, { mottle: 0.4 });
      for (const [x, y, s] of [[-0.42, -0.35, 0.3], [0.2, -0.45, 0.28], [-0.1, 0.25, 0.34], [0.5, 0.2, 0.27], [-0.6, 0.45, 0.22]]) X.ART.millstone(g, x * R, y * R, s * R, r, 0, 0);
      g.restore(); g.strokeStyle = '#e9b860'; g.lineWidth = 18; g.beginPath(); g.arc(0, 0, R, 0, 7); g.stroke(); g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.arc(0, 0, R + 10, 0, 7); g.stroke();
    },
    jug: (g, o) => { g.scale(o.r / 50, o.r / 50); X.PROPS.jug(g, 0, 4); },
    jug_smash: (g, o) => {   // the ale jug at the moment it breaks: a recognisable jug, cracked through, a chunk flying off, ale spraying
      const s = o.r / 60; g.scale(s, s); const r = mulberry32(11);
      g.fillStyle = 'rgba(214,150,62,0.8)'; for (let i = 0; i < 30; i++) { const a = -Math.PI * (0.15 + r() * 0.7), d = 50 + r() * 120; g.beginPath(); g.ellipse(Math.cos(a) * d, Math.sin(a) * d - 30, 3 + r() * 7, 2 + r() * 5, a, 0, 7); g.fill(); }
      g.save(); g.rotate(-0.25); g.scale(1.25, 1.25); X.PROPS.jug(g, 0, 4);
      g.strokeStyle = '#2a140a'; g.lineWidth = 3.5; g.lineJoin = 'round'; g.beginPath(); g.moveTo(-6, -40); g.lineTo(4, -18); g.lineTo(-10, 0); g.lineTo(8, 18); g.lineTo(-2, 34); g.lineTo(10, 50); g.stroke();
      g.beginPath(); g.moveTo(4, -18); g.lineTo(26, -10); g.moveTo(-10, 0); g.lineTo(-30, 8); g.moveTo(8, 18); g.lineTo(30, 24); g.stroke(); g.restore();
      g.save(); g.translate(58, -46); g.rotate(0.7); g.fillStyle = '#a0623a'; g.beginPath(); g.moveTo(-16, -10); g.lineTo(14, -14); g.lineTo(18, 10); g.lineTo(-10, 14); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke(); g.restore();
      for (let i = 0; i < 9; i++) { const a = -Math.PI * (0.1 + r() * 0.8), d = 80 + r() * 70, sz = 5 + r() * 8; g.save(); g.translate(Math.cos(a) * d, Math.sin(a) * d - 20); g.rotate(r() * 6); g.fillStyle = i % 2 ? '#a0623a' : '#c8803e'; g.beginPath(); g.moveTo(-sz, -sz * 0.4); g.lineTo(sz * 0.7, -sz * 0.6); g.lineTo(sz, sz * 0.5); g.lineTo(-sz * 0.4, sz * 0.6); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 2; g.stroke(); g.restore(); }
      g.strokeStyle = '#fff3c8'; g.lineWidth = 5; g.lineCap = 'round'; for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.05 + i / 7 * 0.9); g.beginPath(); g.moveTo(Math.cos(a) * 92, Math.sin(a) * 92 - 10); g.lineTo(Math.cos(a) * 128, Math.sin(a) * 128 - 10); g.stroke(); }
    },
    church_door: (g, o) => {   // a round-headed church doorway, door ajar, candlelight spilling out
      const R = o.r; g.save();
      for (let k = 0; k < 13; k++) { const a = Math.PI + k / 12 * Math.PI; g.fillStyle = k % 2 ? '#c8bea8' : '#a89e88'; g.beginPath(); g.arc(0, -R * 0.2, R * 0.78, a, a + Math.PI / 12 + 0.02); g.arc(0, -R * 0.2, R * 0.55, a + Math.PI / 12 + 0.02, a, true); g.closePath(); g.fill(); }
      g.beginPath(); g.moveTo(-R * 0.55, R); g.lineTo(-R * 0.55, -R * 0.2); g.arc(0, -R * 0.2, R * 0.55, Math.PI, 0); g.lineTo(R * 0.55, R); g.closePath();
      const gr = g.createLinearGradient(0, -R, 0, R); gr.addColorStop(0, '#ffd890'); gr.addColorStop(1, '#e07a2a'); g.fillStyle = gr; g.fill(); g.save(); g.clip();
      g.fillStyle = '#4a2e1a'; g.fillRect(-R * 0.55, -R * 0.8, R * 0.62, R * 1.9); g.strokeStyle = '#2a2a2e'; g.lineWidth = R * 0.05; for (const yy of [-0.3, 0.5]) { g.beginPath(); g.moveTo(-R * 0.55, yy * R); g.lineTo(R * 0.05, yy * R); g.stroke(); }
      g.beginPath(); g.arc(-R * 0.05, R * 0.12, R * 0.09, 0, 7); g.lineWidth = R * 0.035; g.stroke(); g.restore();
      g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.moveTo(-R * 0.55, R); g.lineTo(-R * 0.55, -R * 0.2); g.arc(0, -R * 0.2, R * 0.55, Math.PI, 0); g.lineTo(R * 0.55, R); g.stroke(); g.restore();
    },
    cross: (g, o) => { const s = o.r / 120; g.scale(s, s); g.fillStyle = '#7a5636'; g.fillRect(-14, -150, 28, 300); g.fillRect(-90, -90, 180, 26); g.strokeStyle = INK; g.lineWidth = 6; g.strokeRect(-14, -150, 28, 300); g.strokeRect(-90, -90, 180, 26); },
    loaf: (g, o) => { X.ART.loafShape(g, 0, 0, o.r / 42, mulberry32(3), '#b07a3e'); },
    // What-If 001: the plague map, the eight-year hourglass, the steam engine that bursts
    plague_map: (g, o) => {   // a parchment roundel of England and Wales, the plague staining outward from Dorset
      const R = o.r, r = mulberry32(17); const pr = (lon, lat) => [(lon + 1.97) * R * 0.2, (52.9 - lat) * R * 0.3];
      g.save(); g.rotate(-0.06); g.beginPath(); g.arc(0, 0, R, 0, 7); g.fillStyle = '#e8d8b0'; g.fill(); g.clip();
      g.fillStyle = '#8aa4ae'; g.fillRect(-R, -R, R * 2, R * 2); P.granulate(g, -R, -R, R * 2, R * 2, 0.4);
      const land = X.ART.ENG.map(([lo, la]) => pr(lo, la)); g.beginPath(); land.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fillStyle = '#ecdcb4'; g.fill();
      g.save(); g.clip(); const [mx, my] = pr(-2.46, 50.61); const gr = g.createRadialGradient(mx, my, 0, mx, my, R * 1.25); gr.addColorStop(0, 'rgba(150,20,30,0.95)'); gr.addColorStop(0.55, 'rgba(150,20,30,0.7)'); gr.addColorStop(1, 'rgba(150,20,30,0)'); g.fillStyle = gr; g.fillRect(-R, -R, R * 2, R * 2); g.restore();
      g.strokeStyle = '#4a2e1e'; g.lineWidth = R * 0.025; g.beginPath(); land.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.stroke();
      for (const [lo, la] of [[-2.46, 50.61], [-0.12, 51.5], [-2.59, 51.45], [-1.08, 53.96]]) { const [x, y] = pr(lo, la); g.fillStyle = '#3a0a10'; g.beginPath(); g.arc(x, y, R * 0.035, 0, 7); g.fill(); }
      g.restore(); g.strokeStyle = '#e9b860'; g.lineWidth = R * 0.07; g.beginPath(); g.arc(0, 0, R, 0, 7); g.stroke(); g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.arc(0, 0, R + R * 0.045, 0, 7); g.stroke();
      g.save(); g.translate(R * 0.55, R * 0.72); g.rotate(-0.12); g.fillStyle = '#C8312B'; g.beginPath(); g.roundRect(-R * 0.36, -R * 0.15, R * 0.72, R * 0.3, R * 0.05); g.fill(); g.fillStyle = '#FFF8E7'; g.font = `800 ${Math.round(R * 0.2)}px Nunito`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('1348', 0, R * 0.01); g.restore();
    },
    hourglass: (g, o) => {   // oak caps, glass bulbs, most of the sand still to fall
      const s = o.r / 150; g.scale(s, s); g.rotate(0.08);
      const bulb = (dir) => { g.beginPath(); g.moveTo(-90, dir * -150); g.bezierCurveTo(-95, dir * -60, -12, dir * -40, -10, 0); g.lineTo(10, 0); g.bezierCurveTo(12, dir * -40, 95, dir * -60, 90, dir * -150); g.closePath(); };
      g.fillStyle = 'rgba(220,236,240,0.55)'; bulb(1); g.fill(); bulb(-1); g.fill();
      g.save(); bulb(1); g.clip(); g.fillStyle = '#d8a24a'; g.fillRect(-100, -110, 200, 120); g.restore();
      g.save(); bulb(-1); g.clip(); g.fillStyle = '#d8a24a'; g.beginPath(); g.moveTo(-90, 150); g.quadraticCurveTo(0, 105, 90, 150); g.fill(); g.restore();
      g.strokeStyle = '#d8a24a'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 128); g.stroke();
      g.strokeStyle = INK; g.lineWidth = 6; bulb(1); g.stroke(); bulb(-1); g.stroke();
      g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 8; g.beginPath(); g.moveTo(-62, -128); g.quadraticCurveTo(-70, -80, -40, -50); g.stroke();
      for (const y of [-170, 150]) { g.fillStyle = '#6a4228'; g.fillRect(-120, y, 240, 24); g.strokeStyle = INK; g.lineWidth = 5; g.strokeRect(-120, y, 240, 24); }
      for (const x of [-108, 96]) { g.fillStyle = '#7a5032'; g.fillRect(x, -150, 12, 302); g.strokeRect(x, -150, 12, 302); }
    },
    globe_stop: (g, o) => {   // What-If 002: the Earth braking hard, a red STOP sign, speed lines streaming off it
      const R = o.r, r = mulberry32(31);
      g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineCap = 'round'; for (let i = 0; i < 9; i++) { const y = -R * 0.8 + i * R * 0.2; g.lineWidth = 6 + r() * 6; g.beginPath(); g.moveTo(R * 1.1, y); g.lineTo(R * 1.1 + 80 + r() * 120, y); g.stroke(); }
      const oc = g.createRadialGradient(-R * 0.35, -R * 0.35, R * 0.1, 0, 0, R); oc.addColorStop(0, '#6aaae0'); oc.addColorStop(1, '#1e4a8a'); g.fillStyle = oc; g.beginPath(); g.arc(0, 0, R, 0, 7); g.fill();
      g.save(); g.beginPath(); g.arc(0, 0, R, 0, 7); g.clip(); g.fillStyle = '#7a9a52';
      for (const [cx, cy, rx, ry, a] of [[-0.35, -0.35, 0.35, 0.22, 0.4], [-0.15, 0.2, 0.2, 0.38, -0.2], [0.35, -0.2, 0.3, 0.18, -0.3], [0.45, 0.35, 0.15, 0.2, 0.2]]) { g.beginPath(); g.ellipse(cx * R, cy * R, rx * R, ry * R, a, 0, 7); g.fill(); }
      g.fillStyle = 'rgba(255,255,255,0.6)'; for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse((r() - 0.5) * R * 1.4, (r() - 0.5) * R * 1.4, R * 0.18, R * 0.05, 0, 0, 7); g.fill(); } g.restore();
      g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.arc(0, 0, R, 0, 7); g.stroke();
      g.save(); g.translate(R * 0.55, -R * 0.6); g.rotate(-0.12); const S = R * 0.42; g.beginPath(); for (let k = 0; k < 8; k++) { const a = Math.PI / 8 + k * Math.PI / 4; k ? g.lineTo(Math.cos(a) * S, Math.sin(a) * S) : g.moveTo(Math.cos(a) * S, Math.sin(a) * S); } g.closePath();
      g.fillStyle = '#C8312B'; g.fill(); g.strokeStyle = '#FFF8E7'; g.lineWidth = S * 0.08; g.stroke(); g.fillStyle = '#FFF8E7'; g.font = `800 ${Math.round(S * 0.52)}px Nunito`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('STOP', 0, S * 0.04); g.restore();
    },
    pole_marker: (g, o) => {   // the South Pole: a striped post with a mirror ball on snow, flags around it
      const s = o.r / 200; g.scale(s, s);
      g.fillStyle = '#eef3f8'; g.beginPath(); g.ellipse(0, 190, 260, 50, 0, 0, 7); g.fill();
      for (const [x, c] of [[-190, '#c83a3a'], [-110, '#2a5aa8'], [110, '#f0c040'], [190, '#3a8a5a']]) { g.fillStyle = '#8a8e96'; g.fillRect(x - 3, -40, 6, 230); g.fillStyle = c; g.beginPath(); g.moveTo(x, -40); g.quadraticCurveTo(x + 35, -30, x + 70, -36); g.lineTo(x + 70, 4); g.quadraticCurveTo(x + 35, 10, x, 0); g.fill(); }
      for (let k = 0; k < 9; k++) { g.fillStyle = k % 2 ? '#c83a3a' : '#f4f4f4'; g.fillRect(-18, -10 + k * 22, 36, 22); } g.strokeStyle = INK; g.lineWidth = 4; g.strokeRect(-18, -10, 36, 198);
      const mb = g.createRadialGradient(-18, -64, 8, 0, -48, 60); mb.addColorStop(0, '#ffffff'); mb.addColorStop(0.5, '#b8c8d8'); mb.addColorStop(1, '#5a6a7a'); g.fillStyle = mb; g.beginPath(); g.arc(0, -48, 54, 0, 7); g.fill(); g.stroke();
      g.save(); g.translate(150, -150); g.rotate(0.15); g.font = '800 64px Nunito'; g.textAlign = 'center'; g.fillStyle = '#FFF8E7'; g.strokeStyle = INK; g.lineWidth = 8; g.strokeText('0 km/h', 0, 0); g.fillText('0 km/h', 0, 0); g.restore();
    },
    floating_roo: (g, o) => {   // What-If 003: a kangaroo tumbling in mid-air with motion lines
      const s = o.r / 150; g.scale(s, s); g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineCap = 'round'; for (let i = 0; i < 7; i++) { g.lineWidth = 5 + (i % 3) * 3; g.beginPath(); g.moveTo(-170 + i * 50, 150 + (i % 2) * 30); g.lineTo(-170 + i * 50, 230 + (i % 2) * 30); g.stroke(); }
      g.save(); g.rotate(-0.55); g.translate(0, 70); X.Rig.kangaroo(g, 0.3, { walking: false, facing: 1, airborne: true, colour: '#b8724a' }); g.restore();
    },
    floating_bus: (g, o) => {   // a red double-decker, nose up, with motion lines
      const s = o.r / 240; g.scale(s, s); g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineCap = 'round'; for (let i = 0; i < 7; i++) { g.lineWidth = 5 + (i % 3) * 3; g.beginPath(); g.moveTo(-240 + i * 80, 200); g.lineTo(-240 + i * 80, 280); g.stroke(); }
      g.save(); g.rotate(-0.35); g.translate(0, 150); if (X.WORLD) X.WORLD.bus(g, 0, 0, 1.0, mulberry32(3), { sign: '24' }); g.restore();
    },
    liberty_wade: (g, o) => {   // What-If 004: the statue striding out of the sea, the Eiffel Tower on the horizon behind her
      const s = o.r / 300; g.scale(s, s);
      if (X.LIB) { g.save(); g.translate(260, 210); X.LIB.eiffel(g, mulberry32(4), 0, 0, 330, { sky: '#2a4a8a', col: '#5a4030', colD: '#2a1a10', beacon: true }); g.restore(); }
      g.save(); g.translate(-40, 330); X.Rig.liberty(g, 1.2, { h: 1000, z: 1, px: 160, walking: true, mood0: 'determined', alive0: 1, lookX0: 0.9, glow0: 1, lw: 7, acts: [] }); g.restore();
      g.fillStyle = '#2f6aa0'; g.beginPath(); g.moveTo(-340, 180); for (let x = -340; x <= 340; x += 20) g.lineTo(x, 180 + Math.sin(x * 0.05) * 10); g.lineTo(340, 330); g.lineTo(-340, 330); g.closePath(); g.fill();
      g.strokeStyle = '#e8f6ff'; g.lineWidth = 7; g.lineCap = 'round'; for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(-30, 186, 70 + i * 26, 12 + i * 4, 0, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); }
    },
    liberty_heel: (g, o) => {   // What-If 004: her raised right heel, ringed in red
      const s = o.r / 260; g.scale(s, s);
      g.save(); g.translate(0, 640); g.scale(2.6, 2.6); X.Rig.liberty(g, 0.5, { h: 1000, z: 1, walking: false, mood0: 'stone', alive0: 0, glow0: 0, lw: 5, chain: true, acts: [] }); g.restore();
      g.strokeStyle = '#ff3b30'; g.lineWidth = 16; g.beginPath(); g.ellipse(-30, 600, 120, 80, -0.2, 0, Math.PI * 2); g.stroke();
      g.lineWidth = 18; g.lineCap = 'round'; g.beginPath(); g.moveTo(-260, 300); g.lineTo(-120, 520); g.stroke(); g.beginPath(); g.moveTo(-120, 520); g.lineTo(-190, 500); g.moveTo(-120, 520); g.lineTo(-115, 445); g.stroke();
    },
    boiler_burst: (g, o) => {   // a sealed boiler on a firebox, its lid blown off in a cloud of steam
      const s = o.r / 150; g.scale(s, s); const r = mulberry32(23);
      for (let i = 0; i < 12; i++) { const a = r() * Math.PI * 2, d = 60 + r() * 110; P.bloom(g, Math.cos(a) * d * 1.1, -120 + Math.sin(a) * d * 0.7, 90 + r() * 70, '#ffffff', 0.55); }
      g.fillStyle = '#7a4a34'; g.fillRect(-110, 40, 220, 100); g.strokeStyle = INK; g.lineWidth = 6; g.strokeRect(-110, 40, 220, 100);
      g.fillStyle = '#ffb040'; g.beginPath(); g.ellipse(0, 100, 60, 24, 0, 0, 7); g.fill();
      g.fillStyle = '#6a6a74'; g.beginPath(); g.moveTo(-100, 40); g.lineTo(100, 40); g.lineTo(88, -110); g.lineTo(-88, -110); g.closePath(); g.fill(); g.stroke();
      for (const y of [-70, -10]) { g.strokeStyle = '#3a3a42'; g.lineWidth = 9; g.beginPath(); g.moveTo(-96, y); g.lineTo(96, y); g.stroke(); }
      g.save(); g.translate(70, -230); g.rotate(0.9); g.fillStyle = '#7a7a84'; g.beginPath(); g.ellipse(0, 0, 92, 20, 0, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); g.restore();
      g.strokeStyle = '#fff3c8'; g.lineWidth = 7; g.lineCap = 'round'; for (let i = 0; i < 9; i++) { const a = -Math.PI * (0.08 + i / 9 * 0.84); g.beginPath(); g.moveTo(Math.cos(a) * 120, -110 + Math.sin(a) * 90); g.lineTo(Math.cos(a) * 200, -110 + Math.sin(a) * 160); g.stroke(); }
      for (let i = 0; i < 14; i++) { const a = -Math.PI * r(), d = 120 + r() * 120; g.fillStyle = r() < 0.5 ? '#ffcf60' : '#ff8a30'; g.beginPath(); g.arc(Math.cos(a) * d, -110 + Math.sin(a) * d * 0.8, 4 + r() * 5, 0, 7); g.fill(); }
    }
  };
  function drawObjectLayer(spec, lay) {
    const layer = canvas(TW, TH), g = layer.getContext('2d');
    const [cx, cy] = spec.c || lay.object; const size = spec.size || lay.object_size;
    g.translate(cx * TW, cy * TH); if (spec.rot) g.rotate(spec.rot);
    OBJECTS[spec.type](g, { r: (spec.r ?? Math.min(size[0] * TW, size[1] * TH) * 0.5), sep: spec.sep ?? 16, side: spec.side, crack: spec.crack });
    // the focal object is the most saturated thing in frame
    const out = canvas(TW, TH), og = out.getContext('2d'); og.filter = `saturate(${spec.saturate ?? 1.25}) contrast(1.08)`; og.drawImage(layer, 0, 0); return out;
  }
  // a wax-seal stamp ("BANNED") — danger accent, used sparingly
  function stamp(g, s) {
    g.save(); g.translate(s.c[0] * TW, s.c[1] * TH); g.rotate(s.rot ?? -0.18);
    g.font = `800 ${s.size || 54}px Nunito`; const w = g.measureText(s.text).width + 54, h = (s.size || 54) * 1.45;
    g.fillStyle = 'rgba(0,0,0,0.3)'; g.beginPath(); g.roundRect(-w / 2 + 6, -h / 2 + 8, w, h, 12); g.fill();
    g.fillStyle = '#C8312B'; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 12); g.fill(); g.strokeStyle = '#FFF8E7'; g.lineWidth = 5; g.beginPath(); g.roundRect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16, 8); g.stroke();
    g.fillStyle = '#FFF8E7'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s.text, 0, 4); g.restore();
  }
  // headline text: heavy display face, saffron or cream with a thick ink stroke; auto-fits its box
  function headline(g, text, box, capH, align, fill) {
    const [x0, y0, x1, y1] = box.map((v, i) => v * (i % 2 ? TH : TW)); const lines = text.split('|');
    let size = capH * TH / 0.7; g.font = `800 ${size}px Fraunces`;
    while (Math.max(...lines.map(l => g.measureText(l).width)) > x1 - x0 && size > 40) { size -= 2; g.font = `800 ${size}px Fraunces`; }
    const lh = size * 0.95; const x = align === 'right' ? x1 : align === 'center' ? (x0 + x1) / 2 : x0;
    g.textAlign = align; g.textBaseline = 'alphabetic'; g.lineJoin = 'round';
    lines.forEach((l, i) => {
      const y = y0 + size * 0.78 + i * lh;
      g.save(); g.fillStyle = 'rgba(0,0,0,0.4)'; g.filter = 'blur(6px)'; g.fillText(l, x + 8, y + 8); g.restore();
      g.strokeStyle = INK; g.lineWidth = 13; g.strokeText(l, x, y); g.fillStyle = fill || '#FFC531'; g.fillText(l, x, y);
    });
  }

  async function render(spec, cast, seed) {
    await document.fonts.ready;
    const c = document.getElementById('c'); c.width = TW; c.height = TH; const g = c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0);
    const lay = LAYOUTS[spec.layout || 'L1']; const rng = mulberry32(seed || 1);
    P.paper(seed || 1);
    background(g, spec.bg || '#2E4BB0', rng);
    if (spec.object) outlined(g, drawObjectLayer(spec.object, lay), 7);
    if (spec.stamp) stamp(g, spec.stamp);
    if (spec.character) outlined(g, drawCharacterLayer(spec.character, lay, cast, seed), 8);
    if (spec.text) headline(g, spec.text, spec.text_box || lay.text, spec.cap_h || lay.cap_h, spec.align || lay.align, spec.text_fill);
    border(g, rng);
    return true;
  }
  root.THUMB = { render, LAYOUTS, OBJECTS };
})(window);
