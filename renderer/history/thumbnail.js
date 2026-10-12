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
    loaf: (g, o) => { X.ART.loafShape(g, 0, 0, o.r / 42, mulberry32(3), '#b07a3e'); }
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
