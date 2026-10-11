/* THE HIDDEN WORLD — full-body figure rig for the cinematic true-crime series (Case Files v3).
   Graphic-novel style: ink outline, two-tone cel shading with a shadow side, coloured rim light.
   Characters live in characters/figures/<id>.json (face, hair, build, outfit, palette) and are drawn from that spec,
   so a person looks the same in every shot. Bodies are a 2D joint skeleton driven by named POSES (blended over time),
   a procedural walk cycle, breathing, blinking, gaze and head turn. Props attach to the hands.
   Units: figure-local, feet at (0,0), standing height ~980 (y up is negative). dir=+1 faces right, -1 faces left.
   Figures are illustrated representations, never likenesses presented as photographs. */
(function () {
  const E = window.HW; const { ease, clamp, lerp, f1 } = E;
  const INK = '#120d0b';
  let UID = 0; const uid = p => `${p}${++UID}`;

  // ---------- poses: joint angles in degrees (0 = straight down; + = toward the facing direction / forward-up)
  // arm: ua = upper arm, fa = forearm bend (+ folds forward/up); leg: th = thigh, sh = shin bend (+ = knee bends back)
  // body: lean (+ forward), head tilt (+ down), turn (0 frontal .. 1 profile), sit/kneel set hip height.
  const POSES = {
    stand:          { lean: 0, tilt: 0, nUa: -4, nFa: 8, fUa: 4, fFa: 8, nTh: 2, nSh: 0, fTh: -2, fSh: 0 },
    stand_tense:    { lean: -2, tilt: -2, nUa: -2, nFa: 18, fUa: 2, fFa: 18, nTh: 4, nSh: 0, fTh: -4, fSh: 0 },
    hands_together: { lean: 2, tilt: 6, nUa: 14, nFa: 70, fUa: 18, fFa: 66, nTh: 2, nSh: 0, fTh: -2, fSh: 0 },
    arms_crossed:   { lean: -1, tilt: -2, nUa: 16, nFa: 118, fUa: 20, fFa: 112, nTh: 3, nSh: 0, fTh: -3, fSh: 0 },
    read:           { lean: 4, tilt: 14, nUa: 24, nFa: 92, fUa: 30, fFa: 88, nTh: 2, nSh: 0, fTh: -2, fSh: 0, prop: 'paper' },
    read_newspaper: { lean: 2, tilt: 10, nUa: 30, nFa: 80, fUa: 36, fFa: 78, nTh: 2, nSh: 0, fTh: -2, fSh: 0, prop: 'newspaper' },
    examine:        { lean: 12, tilt: 18, nUa: 46, nFa: 60, fUa: 14, fFa: 40, nTh: 4, nSh: 2, fTh: -4, fSh: 2 },
    point:          { lean: 2, tilt: -2, nUa: 78, nFa: 6, fUa: 4, fFa: 10, nTh: 3, nSh: 0, fTh: -3, fSh: 0 },
    point_up:       { lean: -2, tilt: -8, nUa: 128, nFa: 4, fUa: 6, fFa: 12, nTh: 3, nSh: 0, fTh: -3, fSh: 0 },
    present:        { lean: 4, tilt: 2, nUa: 64, nFa: 30, fUa: 30, fFa: 70, nTh: 3, nSh: 0, fTh: -3, fSh: 0 },
    torch:          { lean: 6, tilt: 10, nUa: 52, nFa: 18, fUa: 6, fFa: 14, nTh: 6, nSh: 4, fTh: -6, fSh: 4, prop: 'torch' },
    torch_low:      { lean: 18, tilt: 24, nUa: 30, nFa: 10, fUa: 10, fFa: 20, nTh: 10, nSh: 8, fTh: -6, fSh: 6, prop: 'torch' },
    kneel:          { lean: 14, tilt: 22, nUa: 40, nFa: 22, fUa: 20, fFa: 40, nTh: 88, nSh: 92, fTh: -10, fSh: 96, kneel: 1, prop: 'torch' },
    sit:            { lean: 4, tilt: 4, nUa: 18, nFa: 64, fUa: 22, fFa: 60, nTh: 88, nSh: 88, fTh: 84, fSh: 86, sit: 1 },
    sit_read:       { lean: 10, tilt: 18, nUa: 30, nFa: 88, fUa: 34, fFa: 84, nTh: 88, nSh: 88, fTh: 84, fSh: 86, sit: 1, prop: 'paper' },
    sit_slumped:    { lean: 16, tilt: 26, nUa: 22, nFa: 50, fUa: 24, fFa: 46, nTh: 88, nSh: 92, fTh: 84, fSh: 90, sit: 1 },
    sit_type:       { lean: 12, tilt: 12, nUa: 34, nFa: 56, fUa: 38, fFa: 54, nTh: 88, nSh: 88, fTh: 84, fSh: 86, sit: 1 },
    sit_type_b:     { lean: 12, tilt: 13, nUa: 31, nFa: 62, fUa: 41, fFa: 48, nTh: 88, nSh: 88, fTh: 84, fSh: 86, sit: 1 },   // alternate with sit_type for typing
    hands_behind:   { lean: 4, tilt: 8, nUa: -18, nFa: 40, fUa: -22, fFa: 44, nTh: 2, nSh: 0, fTh: -2, fSh: 0 },
    hand_to_face:   { lean: 4, tilt: 14, nUa: 70, nFa: 150, fUa: 8, fFa: 30, nTh: 2, nSh: 0, fTh: -2, fSh: 0 },   // hand to mouth
    bowed:          { lean: 6, tilt: 26, nUa: 10, nFa: 46, fUa: 12, fFa: 44, nTh: 2, nSh: 0, fTh: -2, fSh: 0 },
    gavel:          { lean: 6, tilt: 6, nUa: 40, nFa: 70, fUa: 20, fFa: 70, nTh: 88, nSh: 88, fTh: 84, fSh: 86, sit: 1, prop: 'gavel' },
    walk:           { lean: 3, tilt: 0, nUa: 0, nFa: 12, fUa: 0, fFa: 12, nTh: 0, nSh: 0, fTh: 0, fSh: 0, walk: 1 }
  };
  const PKEYS = ['lean', 'tilt', 'nUa', 'nFa', 'fUa', 'fFa', 'nTh', 'nSh', 'fTh', 'fSh', 'sit', 'kneel', 'walk'];

  // ---------- expressions (numeric so they blend)
  const EXPR = {
    neutral:    { raise: 0, knit: 0, smile: 0, open: 0, lid: 0.15, wide: 0 },
    focused:    { raise: -0.1, knit: 0.55, smile: -0.05, open: 0, lid: 0.3, wide: 0 },
    worried:    { raise: 0.45, knit: 0.6, smile: -0.35, open: 0.05, lid: 0.1, wide: 0.1 },
    distraught: { raise: 0.7, knit: 0.85, smile: -0.6, open: 0.25, lid: 0.05, wide: 0.15 },
    shocked:    { raise: 0.95, knit: 0.1, smile: -0.1, open: 0.55, lid: -0.1, wide: 0.6 },
    sad:        { raise: 0.35, knit: 0.75, smile: -0.5, open: 0, lid: 0.35, wide: 0 },
    stern:      { raise: -0.25, knit: 0.75, smile: -0.25, open: 0, lid: 0.3, wide: 0 },
    determined: { raise: -0.1, knit: 0.45, smile: 0, open: 0, lid: 0.2, wide: 0 },
    relieved:   { raise: 0.25, knit: 0.1, smile: 0.35, open: 0, lid: 0.25, wide: 0 },
    realise:    { raise: 0.7, knit: 0.2, smile: -0.05, open: 0.3, lid: -0.05, wide: 0.4 },
    blank:      { raise: 0.05, knit: 0.1, smile: -0.1, open: 0, lid: 0.4, wide: 0 }
  };
  const XKEYS = ['raise', 'knit', 'smile', 'open', 'lid', 'wide'];
  const NKEYS = ['x', 'y', 'turn', 'headTurn', 'scale'];

  // state at time t from keyframes: [{at, pose, expr, gaze:[x,y], turn, headTurn, x, y, dur}]
  function stateAt(f, t) {
    const keys = [{ at: -1e9, pose: f.pose || 'stand', expr: f.expr || 'neutral', gaze: f.gaze || [0.3, 0], turn: f.turn ?? 0.35, headTurn: f.headTurn ?? 0, x: f.x, y: f.y, scale: f.scale || 1 }, ...(f.keys || [])].sort((a, b) => a.at - b.at);
    const P = { ...POSES[keys[0].pose] }; PKEYS.forEach(k => { P[k] = P[k] || 0; }); P.prop = POSES[keys[0].pose].prop;
    const X = { ...EXPR[keys[0].expr] }; let g = keys[0].gaze.slice(); const N = {}; NKEYS.forEach(k => N[k] = keys[0][k]);
    for (let i = 1; i < keys.length; i++) {
      const k = keys[i]; if (t < k.at) break; const u = ease.inOut(clamp((t - k.at) / (k.dur || 0.5), 0, 1));
      if (k.pose) { const tp = POSES[k.pose]; PKEYS.forEach(q => P[q] = lerp(P[q], tp[q] || 0, u)); if (u > 0.5) P.prop = tp.prop; }
      if (k.expr) { const tx = EXPR[k.expr]; XKEYS.forEach(q => X[q] = lerp(X[q], tx[q], u)); }
      if (k.gaze) g = [lerp(g[0], k.gaze[0], ease.out(clamp((t - k.at) / 0.25, 0, 1))), lerp(g[1], k.gaze[1], ease.out(clamp((t - k.at) / 0.25, 0, 1)))];
      NKEYS.forEach(q => { if (k[q] !== undefined) N[q] = lerp(N[q], k[q], u); });
    }
    if (f.propOverride !== undefined) P.prop = f.propOverride;
    return { P, X, gaze: g, ...N };
  }
  function blink(id, t) {
    const r = E.mulberry32(E.hashStr(id) ^ 77); let tb = 0.6 + r() * 1.4;
    while (tb < t + 0.2) { const d = t - tb; if (d >= 0 && d < 0.16) return Math.sin(d / 0.16 * Math.PI); tb += 2.2 + r() * 2.8; }
    return 0;
  }

  // ---------- geometry helpers
  const rad = d => d * Math.PI / 180;
  const pt = (x, y, ang, len, fx = 1) => [x + Math.sin(rad(ang)) * len * fx, y + Math.cos(rad(ang)) * len];   // angle 0 = down, + = toward +x; fx = foreshortening of forward motion
  function capsule(a, b, wa, wb) {   // tapered limb from joint a (width wa) to joint b (width wb)
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    const p1 = [a[0] + nx * wa / 2, a[1] + ny * wa / 2], p2 = [b[0] + nx * wb / 2, b[1] + ny * wb / 2], p3 = [b[0] - nx * wb / 2, b[1] - ny * wb / 2], p4 = [a[0] - nx * wa / 2, a[1] - ny * wa / 2];
    const ca = [a[0] - dx / L * wa / 2, a[1] - dy / L * wa / 2], cb = [b[0] + dx / L * wb / 2, b[1] + dy / L * wb / 2];
    return `M${f1(p1[0])} ${f1(p1[1])} L${f1(p2[0])} ${f1(p2[1])} Q${f1(cb[0] + nx * wb / 2)} ${f1(cb[1] + ny * wb / 2)} ${f1(cb[0])} ${f1(cb[1])} Q${f1(cb[0] - nx * wb / 2)} ${f1(cb[1] - ny * wb / 2)} ${f1(p3[0])} ${f1(p3[1])} L${f1(p4[0])} ${f1(p4[1])} Q${f1(ca[0] - nx * wa / 2)} ${f1(ca[1] - ny * wa / 2)} ${f1(ca[0])} ${f1(ca[1])} Q${f1(ca[0] + nx * wa / 2)} ${f1(ca[1] + ny * wa / 2)} ${f1(p1[0])} ${f1(p1[1])} Z`;
  }
  const shade = (c, k) => { const n = parseInt(c.slice(1), 16); const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255; const m = v => clamp(Math.round(v * k), 0, 255); return '#' + ((1 << 24) + (m(r) << 16) + (m(g) << 8) + m(b)).toString(16).slice(1); };
  // limb with ink outline and a shadow stripe on the side away from the key light
  function limb(a, b, wa, wb, col, sh, lightSide) {
    const d = capsule(a, b, wa, wb); const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; const nx = -dy / L * lightSide, ny = dx / L * lightSide;
    const s2 = capsule([a[0] - nx * wa * 0.28, a[1] - ny * wa * 0.28], [b[0] - nx * wb * 0.28, b[1] - ny * wb * 0.28], wa * 0.5, wb * 0.5);
    return `<path d="${d}" fill="${col}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="${s2}" fill="${sh}" opacity="0.55"/>`;
  }

  // ---------- head (graphic-novel): turn 0..1 toward facing side (drawn facing right; mirrored by dir)
  function head(sp, X, gaze, ht, bl, light, rim, id) {
    const T = clamp(ht, 0, 1), female = sp.sex === 'female', sk = sp.skin, ss = sp.skin_shadow, sl = sp.skin_light;
    const cx = T * 20; // features shift toward the facing side
    const face = `M-50 -6 C-52 -48 -30 -66 0 -66 C30 -66 52 -48 50 -6 C49 22 ${f1(40 + T * 6)} 44 ${f1(22 + T * 10)} 58 C${f1(12 + T * 8)} 65 ${f1(-12 + T * 6)} 65 -22 58 C-40 44 -49 22 -50 -6 Z`;
    let s = `<defs><clipPath id="${id}c"><path d="${face}"/></clipPath></defs>`;
    // neck
    s += `<path d="M${f1(-16 + T * 4)} 48 L${f1(-18 + T * 2)} 92 L${f1(18 + T * 2)} 92 L${f1(16 + T * 6)} 48 Z" fill="${sk}" stroke="${INK}" stroke-width="4"/><path d="M${f1(-16 + T * 4)} 56 L${f1(18 + T * 4)} 70 L${f1(18 + T * 2)} 92 L${f1(-18 + T * 2)} 92 Z" fill="${ss}" opacity="0.6"/>`;
    s += hairBack(sp, T);
    // ear on the far side becomes visible as the head turns
    const earX = lerp(-50, -10, T);
    s += `<path d="M${f1(earX - 6)} -12 C${f1(earX - 16)} -14 ${f1(earX - 16)} 14 ${f1(earX - 4)} 16" fill="${sk}" stroke="${INK}" stroke-width="4"/>`;
    s += `<path d="${face}" fill="${sk}"/>`;
    // shadow side + soft cheek light, clipped to the face
    const lx = light > 0 ? 1 : -1;   // +1 key light from the right of frame (in figure space after mirroring)
    s += `<g clip-path="url(#${id}c)"><path d="M${f1(-lx * 70)} -80 L${f1(-lx * 4 + cx * 0.4)} -80 Q${f1(-lx * 18 + cx * 0.4)} 0 ${f1(-lx * 2 + cx * 0.4)} 80 L${f1(-lx * 70)} 80 Z" fill="${ss}" opacity="0.75"/>
      <ellipse cx="${f1(lx * 22 + cx * 0.5)}" cy="10" rx="22" ry="16" fill="${sl}" opacity="0.35"/><rect x="-60" y="-70" width="120" height="22" fill="${ss}" opacity="0.25"/></g>`;
    // profile nose bump when turned far
    if (T > 0.5) { const k = (T - 0.5) * 2; s += `<path d="M48 -8 Q${f1(52 + 10 * k)} 8 ${f1(48 + 8 * k)} 16 Q${f1(46 + 4 * k)} 20 47 22" fill="${sk}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`; }
    s += `<path d="${face}" fill="none" stroke="${INK}" stroke-width="5"/>`;
    // eyes
    const eyeY = -8, sep = 21, w = female ? 15 : 14, h = 7 + X.wide * 3;
    const cover = clamp(bl + X.lid, -0.2, 1);
    [[-1, 1 - 0.75 * T], [1, 1 - 0.1 * T]].forEach(([side, sc]) => {
      if (sc < 0.3) return;
      const ex = cx + side * sep * (side < 0 ? 1 - 0.35 * T : 1), ww = w * sc;
      const lidY = lerp(-h, h, Math.max(0, cover));
      s += `<g transform="translate(${f1(ex)} ${eyeY})"><path d="M${f1(-ww)} 0 Q0 ${f1(-h * 1.3)} ${f1(ww)} 0 Q0 ${f1(h * 1.0)} ${f1(-ww)} 0 Z" fill="#efe7dc"/>
        <circle cx="${f1(clamp(gaze[0], -1, 1) * ww * 0.45)}" cy="${f1(clamp(gaze[1], -1, 1) * h * 0.4)}" r="${f1(h * 0.78)}" fill="${sp.eyes}"/><circle cx="${f1(clamp(gaze[0], -1, 1) * ww * 0.45)}" cy="${f1(clamp(gaze[1], -1, 1) * h * 0.4)}" r="${f1(h * 0.38)}" fill="#0b0807"/>
        <circle cx="${f1(clamp(gaze[0], -1, 1) * ww * 0.45 - 2)}" cy="${f1(clamp(gaze[1], -1, 1) * h * 0.4 - 2)}" r="1.8" fill="#fff"/>
        <path d="M${f1(-ww - 2)} -2 Q0 ${f1(lidY - h * 0.3)} ${f1(ww + 2)} -2 L${f1(ww + 2)} ${f1(-h * 2)} L${f1(-ww - 2)} ${f1(-h * 2)} Z" fill="${sk}"/>
        <path d="M${f1(-ww - 2)} 0 Q0 ${f1(Math.min(lidY, h * 0.2) - h * 0.35)} ${f1(ww + 3)} -1" stroke="${INK}" stroke-width="${female ? 4.4 : 3.8}" fill="none" stroke-linecap="round"/></g>`;
      // brow
      const by = eyeY - 17 - X.raise * 7 + X.knit * 3, inner = X.knit * 6 - X.raise * 3;
      s += `<path d="M${f1(ex - ww * 1.05 * side * -1 * 0 - ww)} ${f1(by + (side < 0 ? inner : 0) * 0 + (side > 0 ? 0 : 0))} " fill="none"/>`;
      const x1 = ex - ww - 2, x2 = ex + ww + 2; const yIn = by + inner, yOut = by - X.raise * 2;
      const [ya, yb] = side < 0 ? [yOut, yIn] : [yIn, yOut];
      s += `<path d="M${f1(x1)} ${f1(ya)} Q${f1(ex)} ${f1(Math.min(ya, yb) - 5)} ${f1(x2)} ${f1(yb)}" stroke="${sp.brows}" stroke-width="${female ? 4.5 : 6.5}" fill="none" stroke-linecap="round"/>`;
    });
    // nose (frontal / 3-4)
    if (T <= 0.75) s += `<path d="M${f1(cx + 4)} -2 Q${f1(cx + 10)} 14 ${f1(cx + 3)} 20" stroke="${ss}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M${f1(cx - 5)} 21 Q${f1(cx + 2)} 25 ${f1(cx + 9)} 20" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="0.7"/>`;
    // mouth
    const mx = cx + T * 6, my = 37, mw = 14 * (1 - 0.3 * T), sm = X.smile, op = X.open;
    if (op > 0.08) s += `<ellipse cx="${f1(mx)}" cy="${f1(my + 2)}" rx="${f1(mw * 0.7)}" ry="${f1(3 + op * 8)}" fill="#3a1717" stroke="${INK}" stroke-width="2.5"/>`;
    else s += `<path d="M${f1(mx - mw)} ${f1(my - sm * 4)} Q${f1(mx)} ${f1(my + sm * 5)} ${f1(mx + mw)} ${f1(my - sm * 4)}" stroke="${INK}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
    if (female) s += `<path d="M${f1(mx - mw * 0.7)} ${f1(my + 4)} Q${f1(mx)} ${f1(my + 9)} ${f1(mx + mw * 0.7)} ${f1(my + 4)}" stroke="${sp.lips}" stroke-width="3" fill="none" opacity="0.8" stroke-linecap="round"/>`;
    // age lines
    if (sp.age_lines) s += `<path d="M${f1(cx - 14)} 24 Q${f1(cx - 22)} 34 ${f1(cx - 18)} 44 M${f1(cx + 18)} 24 Q${f1(cx + 26)} 34 ${f1(cx + 22)} 44" stroke="${ss}" stroke-width="2.4" fill="none" opacity="0.9"/>`;
    // facial hair
    const fh = sp.facial_hair;
    if (fh === 'beard_full' || fh === 'beard_wild') { const wild = fh === 'beard_wild'; s += `<path d="M-46 4 C-44 ${wild ? 60 : 44} -26 ${wild ? 92 : 72} ${f1(cx * 0.5)} ${wild ? 96 : 76} C${f1(26 + T * 12)} ${wild ? 92 : 72} ${f1(46 + T * 4)} ${wild ? 60 : 44} ${f1(48 + T * 2)} 4 C${f1(40 + T * 4)} 20 ${f1(26 + T * 8)} 30 ${f1(mx + mw + 4)} ${f1(my - 6)} C${f1(mx)} ${f1(my - 12)} ${f1(mx - mw - 4)} ${f1(my - 8)} ${f1(mx - mw - 4)} ${f1(my - 6)} C-26 30 -40 20 -46 4 Z" fill="${sp.hair.color}" stroke="${INK}" stroke-width="4"/>
      <path d="M-30 50 Q-24 70 -16 80 M0 60 Q2 80 4 92 M26 50 Q22 70 18 82" stroke="${sp.hair.light}" stroke-width="3" fill="none" opacity="0.6"/>${op > 0.08 ? '' : `<path d="M${f1(mx - mw)} ${f1(my)} Q${f1(mx)} ${f1(my + 3)} ${f1(mx + mw)} ${f1(my)}" stroke="${INK}" stroke-width="3" fill="none"/>`}`; }
    if (fh === 'moustache') s += `<path d="M${f1(mx - mw - 3)} ${f1(my - 3)} Q${f1(mx)} ${f1(my - 12)} ${f1(mx + mw + 3)} ${f1(my - 3)} Q${f1(mx)} ${f1(my - 6)} ${f1(mx - mw - 3)} ${f1(my - 3)} Z" fill="${sp.hair.color}" stroke="${INK}" stroke-width="2.5"/>`;
    if (fh === 'stubble') s += `<path d="M-44 14 C-40 44 -20 62 ${f1(cx * 0.5)} 64 C24 62 42 44 46 14 C30 40 12 46 0 46 C-12 46 -30 40 -44 14 Z" fill="${sp.hair.color}" opacity="0.22"/>`;
    s += hairFront(sp, T);
    if (sp.glasses) { const gx = cx; s += `<g fill="${sp.glasses === 'dark' ? '#0d0f12' : 'none'}" stroke="${sp.glasses_colour || '#2a2420'}" stroke-width="3.2"><rect x="${f1(gx - sep - 15)}" y="${eyeY - 11}" width="${f1(30 * (1 - 0.6 * T))}" height="22" rx="7"/><rect x="${f1(gx + sep - 15)}" y="${eyeY - 11}" width="30" height="22" rx="7"/><path d="M${f1(gx - sep + 15 - 18 * T)} ${eyeY - 3} L${f1(gx + sep - 15)} ${eyeY - 3}"/></g>`; }
    if (sp.hat) s += hat(sp.hat, T);
    // rim light along the back edge of the head
    s += `<path d="${face}" fill="none" stroke="${rim}" stroke-width="6" opacity="0.8" clip-path="url(#${id}r)"/><clipPath id="${id}r"><rect x="${lx > 0 ? -80 : 30}" y="-90" width="50" height="160"/></clipPath>`;
    return s;
  }
  // hats (drawn over the hair, in head space: face top at y -66, eyes near -6); styles: fedora, trilby, cloche, cap, flatcap, bowler
  function hat(h, T) {
    const c = h.color || '#2a2622', band = h.band || shade(c, 0.55), sx = T * 6, st = h.style || 'fedora';
    const g = d => `<g transform="translate(${f1(sx)} 0)">${d}</g>`;
    if (st === 'fedora' || st === 'trilby') { const bw = st === 'trilby' ? 64 : 82;
      return g(`<ellipse cx="0" cy="-50" rx="${bw}" ry="13" fill="${c}" stroke="${INK}" stroke-width="4"/><path d="M-46 -50 C-50 -92 -30 -112 -8 -104 Q 0 -96 8 -104 C30 -112 50 -92 46 -50 Z" fill="${c}" stroke="${INK}" stroke-width="4"/><path d="M-46 -60 L46 -60 L46 -50 L-46 -50 Z" fill="${band}"/><path d="M-30 -96 Q 0 -86 30 -96" stroke="${shade(c, 0.6)}" stroke-width="4" fill="none"/>`); }
    if (st === 'bowler') return g(`<ellipse cx="0" cy="-50" rx="66" ry="11" fill="${c}" stroke="${INK}" stroke-width="4"/><path d="M-48 -50 C-52 -112 52 -112 48 -50 Z" fill="${c}" stroke="${INK}" stroke-width="4"/><rect x="-48" y="-62" width="96" height="10" fill="${band}"/>`);
    if (st === 'cloche') return g(`<path d="M-60 -14 C-66 -60 -40 -98 0 -98 C40 -98 66 -60 60 -14 C50 -28 30 -36 0 -36 C-30 -36 -50 -28 -60 -14 Z" fill="${c}" stroke="${INK}" stroke-width="4"/><path d="M-56 -30 C-30 -42 30 -42 56 -30" stroke="${band}" stroke-width="9" fill="none"/>` + (h.flower ? `<circle cx="-40" cy="-40" r="11" fill="${h.flower}" stroke="${INK}" stroke-width="3"/>` : ''));
    if (st === 'cap') return g(`<path d="M-52 -40 C-56 -96 52 -96 52 -40 Z" fill="${c}" stroke="${INK}" stroke-width="4"/><path d="M${f1(10 - 30 * (1 - T))} -42 Q ${f1(60 + 40 * T)} -46 ${f1(70 + 50 * T)} -34 L${f1(4 - 30 * (1 - T))} -34 Z" fill="${shade(c, 0.8)}" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-90" r="5" fill="${band}"/>`);
    if (st === 'flatcap') return g(`<path d="M-54 -44 C-58 -86 30 -96 56 -60 Q 74 -50 66 -42 Z" fill="${c}" stroke="${INK}" stroke-width="4"/><path d="M-50 -46 L64 -44" stroke="${shade(c, 0.6)}" stroke-width="4"/>`);
    return '';
  }
  function hairBack(sp, T) {
    const c = sp.hair.color, st = sp.hair.style, bx = -T * 8;
    if (st === 'bob_fringe') return `<path d="M${f1(-58 + bx)} -20 C${f1(-66 + bx)} -76 -24 -82 0 -82 C30 -82 66 -70 58 -16 C60 14 58 36 50 50 L${f1(-56 + bx)} 50 C${f1(-62 + bx)} 30 ${f1(-62 + bx)} 10 ${f1(-58 + bx)} -20 Z" fill="${c}" stroke="${INK}" stroke-width="4"/>`;
    if (st === 'long_tied' || st === 'shoulder') { const L = st === 'shoulder' ? 78 : 40; return `<path d="M${f1(-58 + bx)} -20 C${f1(-66 + bx)} -76 -24 -84 0 -84 C30 -84 66 -72 58 -16 C62 20 60 ${L} 50 ${L + 12} L${f1(-56 + bx)} ${L + 12} C${f1(-64 + bx)} ${L} ${f1(-64 + bx)} 10 ${f1(-58 + bx)} -20 Z" fill="${c}" stroke="${INK}" stroke-width="4"/>`; }
    if (st === 'wild') return `<path d="M${f1(-64 + bx)} -10 C${f1(-80 + bx)} -70 -40 -96 0 -92 C44 -96 78 -66 64 -10 C74 10 70 40 58 58 L${f1(-60 + bx)} 58 C${f1(-76 + bx)} 36 ${f1(-74 + bx)} 14 ${f1(-64 + bx)} -10 Z" fill="${c}" stroke="${INK}" stroke-width="4"/>`;
    return `<path d="M${f1(-54 + bx)} -16 C${f1(-60 + bx)} -70 -26 -80 0 -80 C28 -80 60 -68 54 -16 C54 0 50 10 46 14 L${f1(-50 + bx)} 14 C${f1(-54 + bx)} 4 ${f1(-56 + bx)} -4 ${f1(-54 + bx)} -16 Z" fill="${c}" stroke="${INK}" stroke-width="4"/>`;
  }
  function hairFront(sp, T) {
    const c = sp.hair.color, hl = sp.hair.light, st = sp.hair.style, sx = T * 6;
    if (st === 'bob_fringe') return `<path d="M-54 -22 C-58 -70 -28 -84 4 -82 C36 -82 60 -66 54 -22 C44 -34 30 -38 18 -34 C6 -42 -10 -40 -22 -34 C-34 -40 -46 -34 -54 -22 Z" transform="translate(${f1(sx)} 0)" fill="${c}" stroke="${INK}" stroke-width="4"/><path d="M-40 -64 C-10 -80 24 -78 44 -60" transform="translate(${f1(sx)} 0)" stroke="${hl}" stroke-width="5" fill="none" opacity="0.7" stroke-linecap="round"/>`;
    if (st === 'wild') return `<path d="M-60 -10 C-70 -60 -40 -92 0 -90 C40 -92 72 -62 60 -10 C56 -30 44 -44 30 -46 C40 -30 34 -20 26 -14 C20 -36 4 -46 -10 -44 C-4 -30 -12 -22 -20 -18 C-24 -38 -40 -44 -48 -36 C-48 -24 -54 -16 -60 -10 Z" transform="translate(${f1(sx)} 0)" fill="${c}" stroke="${INK}" stroke-width="4"/><path d="M-44 -70 C-20 -84 20 -84 46 -66 M-30 -56 C-26 -40 -30 -30 -36 -22 M14 -60 C20 -44 18 -32 12 -24" transform="translate(${f1(sx)} 0)" stroke="${hl}" stroke-width="4" fill="none" opacity="0.6" stroke-linecap="round"/>`;
    if (st === 'balding') return `<path d="M-52 -20 C-54 -40 -50 -50 -44 -54 C-40 -40 -42 -28 -46 -16 Z M52 -20 C54 -40 50 -50 44 -54 C40 -40 42 -28 46 -16 Z" transform="translate(${f1(sx)} 0)" fill="${c}" stroke="${INK}" stroke-width="3"/>`;
    if (st === 'long_tied' || st === 'shoulder') return `<path d="M-54 -24 C-56 -70 -24 -84 4 -82 C34 -82 58 -68 54 -24 C40 -52 10 -60 -12 -56 C-30 -52 -46 -40 -54 -24 Z" transform="translate(${f1(sx)} 0)" fill="${c}" stroke="${INK}" stroke-width="4"/><path d="M-36 -66 C-6 -80 26 -76 44 -58" transform="translate(${f1(sx)} 0)" stroke="${hl}" stroke-width="5" fill="none" opacity="0.65" stroke-linecap="round"/>`;
    // short_neat (side part)
    return `<path d="M-52 -20 C-56 -66 -26 -82 4 -80 C34 -80 58 -64 52 -22 C44 -44 26 -56 4 -56 C-6 -50 -20 -48 -34 -46 C-44 -40 -50 -32 -52 -20 Z" transform="translate(${f1(sx)} 0)" fill="${c}" stroke="${INK}" stroke-width="4"/><path d="M-28 -66 C0 -78 30 -74 46 -56" transform="translate(${f1(sx)} 0)" stroke="${hl}" stroke-width="5" fill="none" opacity="0.65" stroke-linecap="round"/>`;
  }

  // ---------- props held in the near hand (angle = forearm direction)
  function prop(kind, hand, ang, t, opts) {
    const [x, y] = hand;
    if (kind === 'torch') {
      const a = rad(ang); const dx = Math.sin(a), dy = Math.cos(a); const tip = [x + dx * 46, y + dy * 46];
      const beam = opts.beam !== false ? (() => { const L = opts.beamLen || 900, sp = 0.32; const l1 = [tip[0] + Math.sin(a - sp) * L, tip[1] + Math.cos(a - sp) * L], l2 = [tip[0] + Math.sin(a + sp) * L, tip[1] + Math.cos(a + sp) * L];
        const gid = uid('bm'); const end = [tip[0] + dx * L, tip[1] + dy * L];
        return `<defs><linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${f1(tip[0])}" y1="${f1(tip[1])}" x2="${f1(end[0])}" y2="${f1(end[1])}"><stop offset="0" stop-color="#fff4cf" stop-opacity="0.5"/><stop offset="1" stop-color="#fff4cf" stop-opacity="0"/></linearGradient></defs><path d="M${f1(tip[0])} ${f1(tip[1])} L${f1(l1[0])} ${f1(l1[1])} L${f1(l2[0])} ${f1(l2[1])} Z" fill="url(#${gid})" style="mix-blend-mode:screen"/>`; })() : '';
      return beam + `<path d="${capsule([x - dx * 10, y - dy * 10], tip, 22, 28)}" fill="#2c2c30" stroke="${INK}" stroke-width="4"/><circle cx="${f1(tip[0])}" cy="${f1(tip[1])}" r="12" fill="#fff6d8"/>`;
    }
    if (kind === 'paper') return `<g transform="translate(${f1(x + 10)} ${f1(y - 40)}) rotate(${f1(-8)})"><rect x="-55" y="-70" width="110" height="140" fill="#efe9da" stroke="${INK}" stroke-width="4"/>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="-40" y="${-52 + i * 18}" width="${70 - (i % 3) * 14}" height="5" fill="#8b857a"/>`).join('')}</g>`;
    if (kind === 'newspaper') return `<g transform="translate(${f1(x + 6)} ${f1(y - 70)}) rotate(-4)"><rect x="-95" y="-120" width="190" height="230" fill="#e4e0d4" stroke="${INK}" stroke-width="4"/><rect x="-80" y="-104" width="160" height="22" fill="#b9b4a6"/>${[0, 1, 2].map(c => [0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${-80 + c * 56}" y="${-72 + i * 22}" width="46" height="6" fill="#8b857a"/>`).join('')).join('')}</g>`;
    if (kind === 'magnifier') { const a = rad(ang); const tip = [x + Math.sin(a) * 70, y + Math.cos(a) * 70]; return `<path d="${capsule(hand, tip, 14, 14)}" fill="#3a2a20" stroke="${INK}" stroke-width="4"/><circle cx="${f1(tip[0] + Math.sin(a) * 34)}" cy="${f1(tip[1] + Math.cos(a) * 34)}" r="36" fill="#bfe3ff" fill-opacity="0.2" stroke="#c9ced6" stroke-width="9"/>`; }
    if (kind === 'envelope') return `<g transform="translate(${f1(x + 8)} ${f1(y - 20)}) rotate(-10)"><rect x="-50" y="-32" width="100" height="64" fill="#e8e0cf" stroke="${INK}" stroke-width="4"/><path d="M-50 -32 L0 6 L50 -32" stroke="#a89c84" stroke-width="3" fill="none"/></g>`;
    if (kind === 'folder') return `<g transform="translate(${f1(x + 10)} ${f1(y - 30)}) rotate(-6)"><rect x="-70" y="-50" width="140" height="100" rx="4" fill="#c9a964" stroke="${INK}" stroke-width="4"/><rect x="-70" y="-60" width="50" height="14" rx="3" fill="#c9a964" stroke="${INK}" stroke-width="3"/></g>`;
    if (kind === 'gavel') { const a = rad(ang); const tip = [x + Math.sin(a) * 60, y + Math.cos(a) * 60]; return `<path d="${capsule(hand, tip, 12, 12)}" fill="#5a3820" stroke="${INK}" stroke-width="4"/><rect x="${f1(tip[0] - 30)}" y="${f1(tip[1] - 16)}" width="60" height="32" rx="6" fill="#6a4226" stroke="${INK}" stroke-width="4"/>`; }
    return '';
  }

  // ---------- outfit pieces
  function torsoShape(sp, o, S, H, turn, lean, sit) {
    // S: shoulders [far, near], H: hips [far, near] (figure facing right); returns {back, front} svg
    const top = o.top, tsh = o.top_shadow || shade(top, 0.7), mid = [(S[0][0] + S[1][0]) / 2, (S[0][1] + S[1][1]) / 2], hip = [(H[0][0] + H[1][0]) / 2, (H[0][1] + H[1][1]) / 2];
    const chestF = 26 * turn;   // chest pushes forward in profile
    const coatLen = o.style === 'coat' || o.style === 'labcoat' || o.style === 'robe' ? (sit ? 60 : (o.style === 'robe' ? 430 : 300)) : (o.style === 'dress' ? (sit ? 40 : (o.length || 250)) : 30);
    const female = sp.sex === 'female'; const nk = [mid[0] + 4 + turn * 10, Math.min(S[0][1], S[1][1]) - 26];
    const wy = hip[1] - 70, win = female ? 16 : 7;   // waist height and taper
    const flare = o.style === 'dress' ? 26 : (o.style === 'coat' || o.style === 'labcoat' || o.style === 'robe' ? 12 : 0);
    const body = `M${f1(S[0][0] - 20)} ${f1(S[0][1] + 14)} C${f1(S[0][0] - 16)} ${f1(S[0][1] - 10)} ${f1(nk[0] - 44)} ${f1(nk[1] + 4)} ${f1(nk[0])} ${f1(nk[1])}
      C${f1(nk[0] + 44)} ${f1(nk[1] + 4)} ${f1(S[1][0] + 16)} ${f1(S[1][1] - 10)} ${f1(S[1][0] + 22)} ${f1(S[1][1] + 14)}
      C${f1(S[1][0] + 24 + chestF)} ${f1(S[1][1] + 80)} ${f1(H[1][0] + 16 - win + chestF * 0.3)} ${f1(wy - 40)} ${f1(H[1][0] + 12 - win)} ${f1(wy)}
      C${f1(H[1][0] + 10 - win)} ${f1(wy + 30)} ${f1(H[1][0] + 18)} ${f1(H[1][1] - 10)} ${f1(H[1][0] + 16 + flare)} ${f1(H[1][1] + coatLen)}
      L${f1(H[0][0] - 18 - flare)} ${f1(H[0][1] + coatLen)} C${f1(H[0][0] - 18)} ${f1(H[0][1] - 10)} ${f1(H[0][0] - 12 + win)} ${f1(wy + 30)} ${f1(H[0][0] - 12 + win)} ${f1(wy)}
      C${f1(H[0][0] - 14 + win)} ${f1(wy - 40)} ${f1(S[0][0] - 24)} ${f1(S[0][1] + 80)} ${f1(S[0][0] - 20)} ${f1(S[0][1] + 14)} Z`;
    let s = `<path d="${body}" fill="${top}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    // cel shadow on the far side + fold lines
    s += `<path d="M${f1(S[0][0] - 14)} ${f1(S[0][1] + 10)} C${f1(S[0][0] - 20)} ${f1(S[0][1] + 90)} ${f1(H[0][0] - 20)} ${f1(H[0][1] - 60)} ${f1(H[0][0] - 16)} ${f1(H[0][1] + coatLen - 6)} L${f1(H[0][0] + 26)} ${f1(H[0][1] + coatLen - 6)} C${f1(H[0][0] + 20)} ${f1(H[0][1] - 40)} ${f1(mid[0] - 10)} ${f1(mid[1] + 80)} ${f1(mid[0] - 6)} ${f1(mid[1] + 6)} Z" fill="${tsh}" opacity="0.8"/>`;
    if (o.style === 'coat' || o.style === 'jacket' || o.style === 'labcoat') {
      const lap = o.style === 'labcoat' ? '#e9edf0' : (o.shirt || '#d9d4c8');
      const nx = mid[0] + 8 + turn * 18, ny = mid[1];
      s += `<path d="M${f1(nx - 22)} ${f1(ny + 4)} L${f1(nx + 2)} ${f1(ny + 120)} L${f1(nx + 26)} ${f1(ny + 4)} Z" fill="${lap}" stroke="${INK}" stroke-width="3"/>`;
      if (o.tie) s += `<path d="M${f1(nx)} ${f1(ny + 18)} L${f1(nx - 7)} ${f1(ny + 30)} L${f1(nx + 1)} ${f1(ny + 110)} L${f1(nx + 9)} ${f1(ny + 30)} Z" fill="${o.tie}" stroke="${INK}" stroke-width="2.5"/>`;
      s += `<path d="M${f1(nx - 24)} ${f1(ny + 2)} L${f1(nx - 4)} ${f1(ny + 124)} M${f1(nx + 28)} ${f1(ny + 2)} L${f1(nx + 8)} ${f1(ny + 124)}" stroke="${INK}" stroke-width="3.5" opacity="0.9"/>`;
      s += `<path d="M${f1(nx + 2)} ${f1(ny + 124)} L${f1(hip[0] + 6 + turn * 10)} ${f1(hip[1] + coatLen - 8)}" stroke="${INK}" stroke-width="3" opacity="0.7"/>`;
    } else if (o.style === 'dress') {
      s += `<path d="M${f1(mid[0] - 18 + turn * 14)} ${f1(mid[1] + 6)} Q${f1(mid[0] + 4 + turn * 16)} ${f1(mid[1] + 34)} ${f1(mid[0] + 26 + turn * 14)} ${f1(mid[1] + 6)}" stroke="${o.accent || '#e8dcc0'}" stroke-width="7" fill="none"/>`;
      s += `<path d="M${f1(H[0][0] - 10)} ${f1(H[1][1] - 6)} L${f1(H[1][0] + 12)} ${f1(H[1][1] - 6)}" stroke="${o.accent || '#e8dcc0'}" stroke-width="6" opacity="0.8"/>`;
    } else if (o.style === 'sweater') {
      s += `<path d="M${f1(mid[0] - 16 + turn * 14)} ${f1(mid[1] + 4)} Q${f1(mid[0] + 6 + turn * 16)} ${f1(mid[1] + 26)} ${f1(mid[0] + 26 + turn * 14)} ${f1(mid[1] + 4)}" stroke="${shade(top, 0.75)}" stroke-width="9" fill="none"/>` +
        `<path d="M${f1(H[0][0] - 14)} ${f1(H[0][1] + coatLen - 12)} L${f1(H[1][0] + 14)} ${f1(H[1][1] + coatLen - 12)}" stroke="${shade(top, 0.75)}" stroke-width="10"/>`;
    } else if (o.style === 'robe') {
      s += `<path d="M${f1(mid[0] - 14 + turn * 14)} ${f1(mid[1] + 4)} L${f1(mid[0] + 6 + turn * 14)} ${f1(mid[1] + 60)} L${f1(mid[0] + 26 + turn * 14)} ${f1(mid[1] + 4)} Z" fill="#efeee8" stroke="${INK}" stroke-width="3"/>`;
    } else {   // shirt
      s += `<path d="M${f1(mid[0] - 18 + turn * 14)} ${f1(mid[1] + 2)} L${f1(mid[0] + 4 + turn * 14)} ${f1(mid[1] + 30)} L${f1(mid[0] + 28 + turn * 14)} ${f1(mid[1] + 2)}" stroke="${INK}" stroke-width="3" fill="${shade(top, 0.85)}"/>` +
        `<path d="M${f1(mid[0] + 4 + turn * 14)} ${f1(mid[1] + 30)} L${f1(hip[0] + 4 + turn * 12)} ${f1(hip[1] - 4)}" stroke="${INK}" stroke-width="2.5" opacity="0.7"/>`;
      if (o.pocket) s += `<rect x="${f1(mid[0] + 20 + turn * 14)}" y="${f1(mid[1] + 50)}" width="32" height="36" fill="none" stroke="${INK}" stroke-width="2.5" opacity="0.7"/>`;
    }
    return s;
  }

  // ---------- public: draw a figure. f = {id, x, y, scale, dir, keys, outfit, ...}; ctx.t = scene time
  function figure(f, ctx, light) {
    const sp0 = E.state.cast[f.id]; if (!sp0) throw new Error('figure ' + f.id + ' not in episode figures');
    const sp = (f.hat !== undefined || f.glasses !== undefined) ? { ...sp0, ...(f.hat !== undefined ? { hat: f.hat } : {}), ...(f.glasses !== undefined ? { glasses: f.glasses } : {}) } : sp0;   // per-shot hat / glasses
    const t = ctx.t, tg = t + (ctx.sceneStart || 0);
    const vis = f.show ? clamp((t - f.show[0]) / 0.3, 0, 1) * (f.show[1] !== undefined ? clamp((f.show[1] - t) / 0.3, 0, 1) : 1) : 1;   // show: [from, until] with 0.3 s fades
    if (vis <= 0) return '';
    const st = stateAt(f, t); const P = st.P, X = st.X; const dir = f.dir || 1; const sc = (st.scale || 1) * (sp.height || 1);
    const o = f.outfit && sp.outfit_variants && sp.outfit_variants[f.outfit] ? { ...sp.outfit, ...sp.outfit_variants[f.outfit] } : sp.outfit;
    const turn = clamp(st.turn, 0, 1), ht = clamp((st.headTurn ?? 0) + turn, 0, 1);
    const L = light || { dir: 1, rim: '#ffc27a' }; const lightSide = (L.dir || 1) * dir;  // +1: key light on the figure's facing side
    // walk cycle
    let x = st.x, y = st.y; let ph = 0, bob = 0;
    if (f.walk) { const w = f.walk; const u = clamp((t - w.at) / w.dur, 0, 1); x = lerp(w.from, w.to, u); ph = (t - w.at) * (w.cadence || 6.2); if (u <= 0 || u >= 1) ph = 0; bob = (u > 0 && u < 1) ? -Math.abs(Math.sin(ph)) * 8 : 0; }
    const walking = f.walk && t > f.walk.at && t < f.walk.at + f.walk.dur;
    const sw = walking ? Math.sin(ph) : 0, cw = walking ? Math.cos(ph) : 0;
    const breathe = Math.sin(tg * 1.7 + f.id.length) * 3;
    // skeleton (facing right before mirroring)
    const male = sp.sex !== 'female'; const shw = (male ? 86 : 72) * (sp.build === 'broad' ? 1.12 : sp.build === 'slim' ? 0.93 : 1);
    const FX = lerp(0.38, 1, turn);   // how much forward/back limb motion shows on screen (3/4 view foreshortening)
    const hipH = P.sit ? 440 : (P.kneel ? 310 : 470); const lean = P.lean + (walking ? 4 : 0);
    const hip = [0, -hipH + bob + (P.kneel ? 0 : 0)];
    const spineLen = 280; const sh = pt(hip[0], hip[1], 180 - lean, spineLen, FX); sh[1] += breathe * 0.5;
    const neck = pt(sh[0], sh[1], 180 - lean * 1.2, 34, FX);
    const fw = 1 - 0.55 * turn;     // shoulder/hip spread shrinks toward profile (a body keeps some depth)
    const S = [[sh[0] - shw * fw, sh[1] + 24], [sh[0] + shw * fw + 6 * turn, sh[1] + 22]];   // shoulders sit below the neck line
    const hipw = (male ? 56 : 62) * fw + 8;
    const Hh = [[hip[0] - hipw, hip[1]], [hip[0] + hipw + 4 * turn, hip[1]]];
    // legs: far uses Hh[0], near uses Hh[1]
    const legs = [];
    [[Hh[0], P.fTh, P.fSh, -1], [Hh[1], P.nTh, P.nSh, 1]].forEach(([hp, th, shn, side]) => {
      let thA = th, shA = shn;
      if (walking) { const s2 = side * sw; thA += (f.walk.stride ?? 26) * s2; shA += Math.max(0, 36 * (side * -cw)) + 6; }
      const knee = pt(hp[0], hp[1], thA, P.sit ? 205 : 225, P.sit || P.kneel ? Math.max(FX, 0.55) : FX);
      const ankle = pt(knee[0], knee[1], thA - shA, P.sit ? 225 : 222, FX);
      legs.push({ hp, knee, ankle, side });
    });
    // arms
    const arms = [];
    [[S[0], P.fUa, P.fFa, -1], [S[1], P.nUa, P.nFa, 1]].forEach(([s0, ua, fa, side]) => {
      let uaA = ua, faA = fa;
      if (walking && !P.prop) { uaA += -side * sw * 22; faA += 10; }
      if (walking && P.prop && side < 0) { uaA += sw * 18; }
      uaA += Math.sin(tg * 1.1 + side) * 1.5;
      const elbow = pt(s0[0], s0[1], uaA, 160, FX);
      const wrist = pt(elbow[0], elbow[1], uaA + faA, 140, FX);
      arms.push({ s0, elbow, wrist, ang: uaA + faA, side });
    });
    const skin = sp.skin, ssk = sp.skin_shadow, trs = o.bottom || '#2a2a30', shoes = o.shoes || '#1a1614';
    const topc = o.top, topSh = o.top_shadow || shade(topc, 0.7);
    const legCol = o.style === 'dress' || o.style === 'skirt' ? (o.legs || sp.skin) : trs;
    const draw = [];
    const drawLeg = l => {
      const dk = l.side < 0 ? 0.82 : 1;
      let s = limb(l.hp, l.knee, 84, 64, shade(legCol, dk), shade(legCol, 0.65 * dk), lightSide) + limb(l.knee, l.ankle, 62, 46, shade(legCol, dk), shade(legCol, 0.65 * dk), lightSide);
      const foot = [l.ankle[0] + 40, l.ankle[1] + 14];
      s += `<path d="M${f1(l.ankle[0] - 22)} ${f1(l.ankle[1] - 8)} Q${f1(l.ankle[0] - 24)} ${f1(l.ankle[1] + 20)} ${f1(l.ankle[0] - 10)} ${f1(l.ankle[1] + 22)} L${f1(foot[0] + 14)} ${f1(foot[1] + 8)} Q${f1(foot[0] + 22)} ${f1(foot[1] - 8)} ${f1(foot[0])} ${f1(foot[1] - 14)} L${f1(l.ankle[0] + 18)} ${f1(l.ankle[1] - 10)} Z" fill="${shade(shoes, dk)}" stroke="${INK}" stroke-width="4"/>`;
      return s;
    };
    const drawArm = (a, front) => {
      const dk = a.side < 0 ? 0.82 : 1; const sl = o.sleeve || topc;
      let s = limb(a.s0, a.elbow, 60, 50, shade(sl, dk), shade(sl, 0.62 * dk), lightSide) + limb(a.elbow, a.wrist, 50, 40, shade(sl, dk), shade(sl, 0.62 * dk), lightSide);
      const hd = pt(a.wrist[0], a.wrist[1], a.ang, 22, FX);
      s += `<ellipse cx="${f1(hd[0])}" cy="${f1(hd[1])}" rx="20" ry="25" transform="rotate(${f1(-a.ang)} ${f1(hd[0])} ${f1(hd[1])})" fill="${shade(skin, dk)}" stroke="${INK}" stroke-width="4"/>`;
      if (front && P.prop && a.side > 0) s += prop(P.prop, hd, (f.propOpts && f.propOpts.aim !== undefined) ? f.propOpts.aim : a.ang, t, f.propOpts || {});   // aim: torch direction override (deg)
      return s;
    };
    // ground shadow
    let out = `<ellipse cx="0" cy="6" rx="${f1(120 * (P.sit ? 1.3 : 1))}" ry="18" fill="#000" opacity="0.35"/>`;
    if (P.sit && !f.noChair) out += `<g><path d="M-120 -760 L-96 -450" stroke="#2c2018" stroke-width="22" stroke-linecap="round"/><rect x="-150" y="-720" width="34" height="200" rx="8" fill="#3a2c22" stroke="${INK}" stroke-width="4" transform="rotate(-6 -133 -620)"/><rect x="-120" y="-452" width="230" height="30" rx="8" fill="#3a2c22" stroke="${INK}" stroke-width="4"/><path d="M-100 -424 L-108 0 M92 -424 L100 0" stroke="#2c2018" stroke-width="16" stroke-linecap="round"/></g>`;
    const farArmBehind = turn > 0.35;
    if (farArmBehind) out += drawArm(arms[0], false);
    out += drawLeg(legs[0]);
    if (!(o.style === 'dress' || o.style === 'robe') || P.sit) out += drawLeg(legs[1]);
    out += torsoShape(sp, o, S, Hh, turn, lean, P.sit);
    if (o.style === 'dress' || o.style === 'robe') { if (!P.sit) out += drawLeg(legs[1]).replace(/^/, ''); }
    if (!farArmBehind) out += drawArm(arms[0], true);
    out += drawArm(arms[1], true);
    // head
    const hid = uid('fh'); const hp = pt(neck[0], neck[1], 180 - lean * 1.4, 84, FX);
    const headTilt = P.tilt + Math.sin(tg * 0.8 + f.id.length) * 1.2;
    out += `<g transform="translate(${f1(hp[0])} ${f1(hp[1] + 4)}) rotate(${f1(headTilt)}) scale(1.16)">${head(sp, X, st.gaze, ht, blink(f.id, tg), lightSide, L.rim || '#ffc27a', hid)}</g>`;
    // rim light on the body silhouette edge (back side)
    const flip = dir < 0 ? -1 : 1;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc * flip * 1000) / 1000} ${f1(sc * 1000) / 1000})">${out}</g>`;
    if (f.silhouette) g = `<g filter="url(#${f.silhouette === 'warm' ? 'figSilWarm' : f.silhouette === 'cool' ? 'figSilCool' : 'figSil'})">${g}</g>`;   // anonymous figure; 'warm'/'cool' add a rim light
    if (f.blur) g = `<g filter="url(#figBlur)">${g}</g>`;
    if (vis < 1) g = `<g opacity="${f1(vis)}">${g}</g>`;
    return g;
  }

  const figDefs = `<defs><linearGradient id="beamG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff4cf" stop-opacity="0.45"/><stop offset="1" stop-color="#fff4cf" stop-opacity="0"/></linearGradient>
    <filter id="figSil"><feColorMatrix type="matrix" values="0 0 0 0 0.03  0 0 0 0 0.03  0 0 0 0 0.05  0 0 0 1 0"/></filter>
    <filter id="figSilCool" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feMorphology in="SourceAlpha" operator="dilate" radius="4" result="d"/><feFlood flood-color="#a8c4ff" flood-opacity="0.75"/><feComposite in2="d" operator="in" result="rim"/><feGaussianBlur in="rim" stdDeviation="3" result="rimb"/><feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0.035  0 0 0 0 0.035  0 0 0 0 0.05  0 0 0 1 0" result="sil"/><feMerge><feMergeNode in="rimb"/><feMergeNode in="sil"/></feMerge></filter>
    <filter id="figSilWarm" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feMorphology in="SourceAlpha" operator="dilate" radius="4" result="d"/><feFlood flood-color="#ffbe6a" flood-opacity="0.75"/><feComposite in2="d" operator="in" result="rim"/><feGaussianBlur in="rim" stdDeviation="3" result="rimb"/><feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0.035  0 0 0 0 0.035  0 0 0 0 0.05  0 0 0 1 0" result="sil"/><feMerge><feMergeNode in="rimb"/><feMergeNode in="sil"/></feMerge></filter>
    <filter id="figBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter></defs>`;

  E.fig = { figure, POSES, EXPR, stateAt, figDefs, INK, shade };
})();
