/* THE QUIET GAME — shared kit for every episode (loaded before the episode's scene file via
   episode.json "renderer_includes"). Original 2D cast + sets drawn as SVG. Deterministic in (t, seed).
   Cast designs, character rig, props, sets, camera, captions, rumour meter, name tags, time-jump cards. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1, esc } = E;
  const LINE = '#1b1418';
  let UID = 0; const uid = p => p + (UID++);
  const mix = (a, b, k) => a + (b - a) * clamp(k, 0, 1);
  const sm = (t, a, b) => ease.inOut(seg(t, a, b));          // smooth 0..1 between a and b

  // ---------------------------------------------------------------- cast (reusable across episodes)
  const CAST = {
    theo: { skin: '#a06d4c', skinSh: '#7c4e34', hair: '#201712', hairHi: '#4a3528', style: 'curls', top: '#d89a2c', topSh: '#a8731a', inner: '#efe6d2', trousers: '#2e3440', shoes: '#1d1a19', iris: '#3a2416', build: 0.95, cardigan: true },
    rosa: { skin: '#f0c6a6', skinSh: '#cf9e7f', hair: '#c9c4bd', hairHi: '#eeebe6', hairSh: '#9b958e', style: 'bob', top: '#b5322b', topSh: '#86221d', inner: '#22212a', trousers: '#262630', shoes: '#141214', iris: '#4f6a52', build: 1.0, glasses: '#5a1f1c', blazer: true },
    ben: { skin: '#f1c09d', skinSh: '#d39c79', hair: '#c4622b', hairHi: '#e08a4a', style: 'ben', top: '#2c8579', topSh: '#1f6158', inner: '#e8e4d8', trousers: '#3b3a36', shoes: '#231d1a', iris: '#37506b', build: 1.22, beard: true, collar: true },
    kemi: { skin: '#6d4430', skinSh: '#4f2f20', hair: '#17110f', hairHi: '#3b2a22', style: 'bun', top: '#7b4daf', topSh: '#5a3687', inner: '#7b4daf', trousers: '#1f1d26', shoes: '#151217', iris: '#2a1810', build: 0.92, hoops: true, necklace: true },
    jo: { skin: '#dba27b', skinSh: '#b97f59', hair: '#4b3426', hairHi: '#6b4c38', style: 'short', top: '#56687b', topSh: '#3f4e5e', inner: '#56687b', trousers: '#2a2e35', shoes: '#18161a', iris: '#3a2a1c', build: 1.05 },
    max: { skin: '#eab896', skinSh: '#c99572', hair: '#d9a93e', hairHi: '#f0cb6e', style: 'short', top: '#3a74c9', topSh: '#2a5698', inner: '#3a74c9', trousers: '#2b2f3a', shoes: '#18161a', iris: '#4a6a3a', build: 0.9 },
    sam: { skin: '#c48a62', skinSh: '#9f6845', hair: '#2b2626', hairHi: '#4a4242', style: 'pony', top: '#8b6c49', topSh: '#6a5135', inner: '#8b6c49', trousers: '#24262c', shoes: '#141214', iris: '#2a1c14', build: 0.95 },
  };

  // expressions: brows [innerRaise, outerRaise], smile -1..1, lid 0..1 (upper lid drop), squint 0..1, wide
  const EX = {
    neutral: { b: [0, 0], smile: 0.05, lid: 0.12, squint: 0 },
    warm: { b: [0.35, 0.15], smile: 0.75, lid: 0.12, squint: 0.35 },
    hopeful: { b: [0.6, 0.1], smile: 0.45, lid: 0.05, squint: 0.1 },
    unsure: { b: [0.8, -0.2], smile: -0.05, lid: 0.15, squint: 0 },
    hurt: { b: [1.0, -0.45], smile: -0.45, lid: 0.3, squint: 0.1 },
    angry: { b: [-1.1, 0.35], smile: -0.55, lid: 0.18, squint: 0.3 },
    suspicious: { b: [-0.85, 0.25], smile: -0.2, lid: 0.45, squint: 0.35 },
    smug: { b: [-0.4, 0.55], smile: 0.35, lid: 0.42, squint: 0.3 },
    curious: { b: [0.7, 0.6], smile: 0.0, lid: 0.0, squint: 0 },
    shocked: { b: [1.35, 1.1], smile: -0.25, lid: -0.15, squint: 0, wide: 1 },
    guilty: { b: [1.1, -0.35], smile: -0.5, lid: 0.25, squint: 0 },
    laugh: { b: [0.5, 0.3], smile: 0.95, lid: 0.55, squint: 0.85 },
    nervous: { b: [0.85, 0.1], smile: 0.3, lid: 0.0, squint: 0.1 },
  };
  function ex(a, b, k) {  // blend two named (or object) expressions
    const A = typeof a === 'string' ? EX[a] : a, B = typeof b === 'string' ? EX[b] : b; k = clamp(k, 0, 1);
    return { b: [mix(A.b[0], B.b[0], k), mix(A.b[1], B.b[1], k)], smile: mix(A.smile, B.smile, k), lid: mix(A.lid, B.lid, k), squint: mix(A.squint, B.squint, k), wide: mix(A.wide || 0, B.wide || 0, k) };
  }

  // lip sync from the narration envelope written by the pipeline
  function talk(ctx, who, t = ctx.t) {
    for (const l of ctx.lines) {
      if (l.who !== who || t < l.start || t > l.end) continue;
      const i = Math.floor((t - l.start) * 30), m = l.mouth || [];
      const a = m[i] || 0, b = m[i + 1] || 0, k = (t - l.start) * 30 - i;
      return clamp(lerp(a, b, k) * 1.05, 0, 1);
    }
    return 0;
  }
  function blink(t, phase, period = 3.7) { const k = ((t + phase) % period) / period * period; return k < 0.07 ? 1 : k < 0.14 ? 0.6 : 0; }

  // ---------------------------------------------------------------- character rig
  // origin = hip centre. Head centre at (0,-300). Arms: [shoulderAngle, elbowAngle] in degrees,
  // 0 = hanging down, positive = swings toward the body's centre line, negative = outward.
  function armPts(side, sx, sy, a1, a2, L1 = 104, L2 = 98) {
    const r1 = a1 * Math.PI / 180, r2 = (a1 + a2) * Math.PI / 180;
    const ex_ = sx - side * Math.sin(r1) * L1, ey = sy + Math.cos(r1) * L1;
    const hx = ex_ - side * Math.sin(r2) * L2, hy = ey + Math.cos(r2) * L2;
    return { ex: ex_, ey, hx, hy };
  }
  function drawArm(c, side, sx, sy, a) {
    const p = armPts(side, sx, sy, a[0], a[1]); const w = 30 * Math.min(1.15, c.build);
    const d = `M${f1(sx)} ${f1(sy)} L${f1(p.ex)} ${f1(p.ey)} L${f1(p.hx)} ${f1(p.hy)}`;
    return { p, svg: `<path d="${d}" stroke="${LINE}" stroke-width="${w + 7}" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="${d}" stroke="${c.top}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="${f1(p.hx)}" cy="${f1(p.hy)}" r="15" fill="${c.skin}" stroke="${LINE}" stroke-width="3.5"/>` };
  }
  function eye(cx, cy, e, look, c, sx) {
    const rx = 12.5 * sx, wide = 1 + 0.18 * (e.wide || 0), ry = 15 * wide;
    const lid = clamp(e.lid, -0.2, 1), top = Math.max(0.6, ry * (1 - lid)), bot = ry * (1 - 0.5 * e.squint) * 0.9;
    if (lid > 0.92) return `<path d="M${f1(cx - rx - 2)} ${f1(cy + 2)} Q${f1(cx)} ${f1(cy + 7)} ${f1(cx + rx + 2)} ${f1(cy + 2)}" stroke="${LINE}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    const id = uid('ey');
    const shape = `M${f1(cx - rx)} ${f1(cy)} A${f1(rx)} ${f1(top)} 0 0 1 ${f1(cx + rx)} ${f1(cy)} A${f1(rx)} ${f1(bot)} 0 0 1 ${f1(cx - rx)} ${f1(cy)} Z`;
    const ix = cx + look[0] * 6.5 * sx, iy = cy + look[1] * 5 + 1;
    return `<clipPath id="${id}"><path d="${shape}"/></clipPath><path d="${shape}" fill="#f7f1e6"/>
      <g clip-path="url(#${id})"><circle cx="${f1(ix)}" cy="${f1(iy)}" r="${f1(9.5 * (e.wide ? 0.92 : 1))}" fill="${c.iris}"/><circle cx="${f1(ix)}" cy="${f1(iy)}" r="${f1(5.2 * (e.wide ? 0.8 : 1))}" fill="#0d0a0a"/>
      <circle cx="${f1(ix - 3)}" cy="${f1(iy - 3.5)}" r="2.6" fill="#fff"/><path d="M${f1(cx - rx)} ${f1(cy - top + 3)} L${f1(cx + rx)} ${f1(cy - top + 3)}" stroke="${c.skinSh}" stroke-width="5" opacity="0.5"/></g>
      <path d="M${f1(cx - rx - 2)} ${f1(cy + 1)} A${f1(rx + 1)} ${f1(top + 1)} 0 0 1 ${f1(cx + rx + 2)} ${f1(cy)}" stroke="${LINE}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M${f1(cx - rx * 0.7)} ${f1(cy + bot * 0.95)} Q${f1(cx)} ${f1(cy + bot * 1.12)} ${f1(cx + rx * 0.7)} ${f1(cy + bot * 0.95)}" stroke="${c.skinSh}" stroke-width="2.5" fill="none" opacity="0.8"/>`;
  }
  function brow(cx, cy, side, b, c, sx) {
    // side -1 = image-left eye (inner end on the right)
    const inner = [cx - side * 11 * sx, cy - 24 - b[0] * 9], outer = [cx + side * 15 * sx, cy - 25 - b[1] * 8];
    const mid = [(inner[0] + outer[0]) / 2, Math.min(inner[1], outer[1]) - 5 - Math.max(0, b[0]) * 2];
    return `<path d="M${f1(inner[0])} ${f1(inner[1])} Q${f1(mid[0])} ${f1(mid[1])} ${f1(outer[0])} ${f1(outer[1])}" stroke="${c.style === 'ben' ? c.hair : (c.style === 'bob' ? '#6e6862' : LINE)}" stroke-width="7.5" fill="none" stroke-linecap="round"/>`;
  }
  function mouthSvg(mx, my, open, smile, c) {
    const w = 21 * (1 - 0.25 * open) + smile * 3, lift = smile * 7;
    if (open < 0.08) return `<path d="M${f1(mx - w)} ${f1(my - lift)} Q${f1(mx)} ${f1(my + smile * 9)} ${f1(mx + w)} ${f1(my - lift)}" stroke="${LINE}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    const h = 5 + open * 24, id = uid('mo');
    const d = `M${f1(mx - w)} ${f1(my - lift)} Q${f1(mx)} ${f1(my - 3 + smile * 4)} ${f1(mx + w)} ${f1(my - lift)} Q${f1(mx)} ${f1(my + h + smile * 6)} ${f1(mx - w)} ${f1(my - lift)} Z`;
    return `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="#3a1618"/><g clip-path="url(#${id})"><rect x="${f1(mx - w)}" y="${f1(my - 8)}" width="${f1(w * 2)}" height="${f1(6 + open * 3)}" fill="#f4efe6"/><ellipse cx="${f1(mx)}" cy="${f1(my + h)}" rx="${f1(w * 0.6)}" ry="${f1(h * 0.45)}" fill="#b5545a"/></g>
      <path d="${d}" fill="none" stroke="${LINE}" stroke-width="3.5" stroke-linejoin="round"/>`;
  }
  function hair(c, part, fx, back) {
    const H_ = c.hair, Hi = c.hairHi, sh = c.hairSh || LINE;
    if (c.style === 'curls') {
      const pts = [[-58, -40, 26], [-50, -68, 28], [-28, -88, 30], [0, -96, 31], [28, -88, 30], [52, -68, 28], [60, -40, 25], [-66, -12, 20], [66, -12, 20]];
      if (part === 'back') return `<g>${pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 4}" fill="${LINE}"/>`).join('')}${pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${H_}"/>`).join('')}<ellipse cx="0" cy="-50" rx="64" ry="44" fill="${H_}"/>${back ? `<ellipse cx="0" cy="-10" rx="66" ry="70" fill="${H_}"/>` + [[-30, -20], [20, -30], [-10, 20], [30, 15], [-40, 30]].map(([x, y]) => `<path d="M${x - 10} ${y} q10 -14 20 0" stroke="${Hi}" stroke-width="4" fill="none"/>`).join('') : ''}</g>`;
      const fr = [[-44, -58, 17], [-20, -66, 18], [6, -68, 18], [32, -62, 17], [50, -50, 14]];
      return back ? '' : `<g transform="translate(${f1(fx * 0.45)} 0)">${fr.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${H_}" stroke="${LINE}" stroke-width="3"/>`).join('')}${fr.map(([x, y, r]) => `<path d="M${x - r * 0.5} ${y - r * 0.2} q${r * 0.5} -${r * 0.6} ${r} 0" stroke="${Hi}" stroke-width="3.5" fill="none"/>`).join('')}</g>`;
    }
    if (c.style === 'bob') {
      if (part === 'back') return `<path d="M-84 26 C-96 -60 -62 -106 0 -108 C62 -106 96 -60 84 26 Q74 42 54 36 L-54 36 Q-74 42 -84 26Z" fill="${H_}" stroke="${LINE}" stroke-width="4"/>${back ? `<path d="M-60 -60 Q0 -90 60 -60 M-70 0 Q0 -20 70 0" stroke="${sh}" stroke-width="4" fill="none" opacity="0.6"/>` : ''}`;
      return back ? '' : `<g transform="translate(${f1(fx * 0.5)} 0)"><path d="M-70 -24 C-66 -84 -14 -102 40 -92 C70 -86 80 -60 74 -22 C60 -58 24 -66 -14 -56 C-40 -48 -58 -40 -70 -24Z" fill="${H_}" stroke="${LINE}" stroke-width="4"/>
        <path d="M-40 -66 Q0 -84 44 -76" stroke="${c.hairHi}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-50 -46 Q-10 -70 50 -62" stroke="${sh}" stroke-width="3" fill="none" opacity="0.7"/></g>`;
    }
    if (c.style === 'ben') {
      if (part === 'back') return back ? `<path d="M-64 -10 Q-66 50 -30 64 L30 64 Q66 50 64 -10 Q40 20 0 20 Q-40 20 -64 -10Z" fill="${H_}" opacity="0.95"/>` : '';
      return back ? '' : `<path d="M-63 -36 q-6 26 2 44 l10 -4 q-6 -18 0 -38z M63 -36 q6 26 -2 44 l-10 -4 q6 -18 0 -38z" fill="${H_}" stroke="${LINE}" stroke-width="3"/><ellipse cx="${f1(-14 + fx * 0.3)}" cy="-56" rx="22" ry="10" fill="#fff" opacity="0.28" transform="rotate(-15 ${f1(-14 + fx * 0.3)} -56)"/>`;
    }
    if (c.style === 'bun' || c.style === 'short' || c.style === 'pony') {
      if (part === 'back') {
        let s = '';
        if (c.style === 'bun') s += `<circle cx="${f1(fx * 0.15)}" cy="-104" r="40" fill="${H_}" stroke="${LINE}" stroke-width="4"/><path d="M${f1(fx * 0.15 - 26)} -110 q26 -22 52 0 M${f1(fx * 0.15 - 30)} -96 q30 -18 60 0" stroke="${Hi}" stroke-width="3.5" fill="none"/>`;
        if (c.style === 'pony') s += `<path d="M${f1(-fx * 0.4 + 40)} -60 C 110 -40 104 40 80 90 C 70 40 60 0 40 -40Z" fill="${H_}" stroke="${LINE}" stroke-width="4"/>`;
        s += `<path d="M-66 -10 C-72 -84 -30 -100 0 -100 C30 -100 72 -84 66 -10 Z" fill="${H_}" stroke="${LINE}" stroke-width="4"/>`;
        if (back) s += `<ellipse cx="0" cy="-30" rx="64" ry="62" fill="${H_}"/><path d="M-40 -70 Q0 -40 0 30 M40 -70 Q0 -40 0 30 M-56 -40 Q-10 -20 -8 40 M56 -40 Q10 -20 8 40" stroke="${Hi}" stroke-width="3" fill="none" opacity="0.8"/>`;
        return s;
      }
      return back ? '' : `<g transform="translate(${f1(fx * 0.3)} 0)"><path d="M-64 -20 C-68 -82 -30 -98 0 -98 C30 -98 68 -82 64 -20 C52 -54 22 -66 0 -66 C-22 -66 -52 -54 -64 -20Z" fill="${H_}" stroke="${LINE}" stroke-width="4"/>
        ${c.style === 'bun' ? `<path d="M-40 -74 Q-20 -60 -16 -66 M-10 -84 Q4 -66 8 -68 M24 -80 Q34 -64 40 -64" stroke="${Hi}" stroke-width="3.5" fill="none"/>` : `<path d="M-30 -80 Q10 -92 40 -74" stroke="${Hi}" stroke-width="4" fill="none"/>`}</g>`;
    }
    return '';
  }

  function head(c, o) {
    const turn = o.turn || 0, fx = turn * 22, sx = 1 - 0.16 * Math.abs(turn);
    const e = typeof o.ex === 'string' ? EX[o.ex] : (o.ex || EX.neutral), look = o.look || [0, 0], open = o.mouth || 0, lit = o.lit ?? -1;
    const lid = Math.max(e.lid, o.blink || 0);
    let s = '';
    s += hair(c, 'back', fx, o.back);
    // ears
    const earL = -61 + turn * 10, earR = 61 + turn * 10;
    s += `<ellipse cx="${f1(earL)}" cy="4" rx="12" ry="18" fill="${c.skin}" stroke="${LINE}" stroke-width="3.5"/><ellipse cx="${f1(earR)}" cy="4" rx="12" ry="18" fill="${c.skin}" stroke="${LINE}" stroke-width="3.5"/>`;
    if (c.hoops) s += `<circle cx="${f1(earL - 2)}" cy="30" r="11" fill="none" stroke="#e0b252" stroke-width="4"/><circle cx="${f1(earR + 2)}" cy="30" r="11" fill="none" stroke="#e0b252" stroke-width="4"/>`;
    // face
    s += `<path d="M-62 -10 C-64 -66 -34 -82 0 -82 C34 -82 64 -66 62 -10 C60 40 34 76 0 78 C-34 76 -60 40 -62 -10Z" fill="${c.skin}" stroke="${LINE}" stroke-width="4"/>`;
    const shadeSide = -lit;
    s += `<path d="M${shadeSide * 2} -80 C${shadeSide * 40} -76 ${shadeSide * 64} -50 ${shadeSide * 62} -10 C${shadeSide * 60} 40 ${shadeSide * 34} 76 0 78 C${shadeSide * 40} 50 ${shadeSide * 46} -20 ${shadeSide * 2} -80Z" fill="${c.skinSh}" opacity="${o.back ? 0 : 0.55}"/>`;
    if (o.back) { s += hair(c, 'back', 0, true); return s; }
    // cheeks
    s += `<ellipse cx="${f1(fx - 36 * sx)}" cy="28" rx="13" ry="8" fill="#e0655a" opacity="0.18"/><ellipse cx="${f1(fx + 36 * sx)}" cy="28" rx="13" ry="8" fill="#e0655a" opacity="0.18"/>`;
    if (c.beard) s += `<path d="M${f1(-62 + fx * 0.2)} -4 Q-62 70 ${f1(fx * 0.4)} 86 Q62 70 ${f1(62 + fx * 0.2)} -4 Q52 34 ${f1(fx + 30)} 42 Q${f1(fx)} 34 ${f1(fx - 30)} 42 Q-52 34 ${f1(-62 + fx * 0.2)} -4Z" fill="${c.hair}" stroke="${LINE}" stroke-width="3.5"/>`;
    // eyes, brows
    const ey = -6, exL = fx - 25 * sx, exR = fx + 25 * sx;
    const e2 = { ...e, lid };
    s += eye(exL, ey, e2, look, c, sx) + eye(exR, ey, e2, look, c, sx);
    const bA = o.browAsym || 0;
    s += brow(exL, ey, -1, [e.b[0] + bA, e.b[1] + bA], c, sx) + brow(exR, ey, 1, e.b, c, sx);
    // nose
    const nx = fx * 1.12;
    s += `<path d="M${f1(nx + turn * 2)} 8 Q${f1(nx + 8 + turn * 6)} 24 ${f1(nx + 1)} 30 Q${f1(nx - 6)} 32 ${f1(nx - 10)} 28" stroke="${c.skinSh}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    if (c.beard) s += `<path d="M${f1(fx - 28)} 46 Q${f1(fx)} 32 ${f1(fx + 28)} 46 Q${f1(fx + 12)} 52 ${f1(fx)} 46 Q${f1(fx - 12)} 52 ${f1(fx - 28)} 46Z" fill="${c.hair}" stroke="${LINE}" stroke-width="3"/>`;
    s += mouthSvg(fx * 1.05, c.beard ? 56 : 48, open, e.smile, c);
    s += hair(c, 'front', fx, false);
    if (c.glasses) {
      const gy = ey + (o.glassesDown || 0) + 1;
      s += `<g fill="none" stroke="${c.glasses}" stroke-width="4.5"><rect x="${f1(exL - 21 * sx)}" y="${f1(gy - 15)}" width="${f1(42 * sx)}" height="30" rx="10"/><rect x="${f1(exR - 21 * sx)}" y="${f1(gy - 15)}" width="${f1(42 * sx)}" height="30" rx="10"/><path d="M${f1(exL + 21 * sx)} ${f1(gy - 3)} Q${f1(fx)} ${f1(gy - 9)} ${f1(exR - 21 * sx)} ${f1(gy - 3)}"/></g>`;
      if (o.glare) s += `<path d="M${f1(exL - 14)} ${f1(gy + 8)} l14 -18 M${f1(exR - 14)} ${f1(gy + 8)} l14 -18" stroke="#cfe6ff" stroke-width="5" opacity="${f1(o.glare)}"/>`;
    }
    return s;
  }

  function torso(c, o) {
    const b = c.build, sw = 80 * b, hw = 64 * b, lit = o.lit ?? -1, breath = o.breath || 0;
    const sy = -218 - breath;
    const body = `M${f1(-sw)} ${f1(sy + 6)} Q${f1(-sw - 8)} -120 ${f1(-hw)} 0 L${f1(hw)} 0 Q${f1(sw + 8)} -120 ${f1(sw)} ${f1(sy + 6)} Q0 ${f1(sy - 22)} ${f1(-sw)} ${f1(sy + 6)}Z`;
    let s = `<path d="${body}" fill="${c.top}" stroke="${LINE}" stroke-width="4"/>`;
    s += `<path d="M${f1(-lit * sw * 0.15)} ${f1(sy - 8)} Q${f1(-lit * (sw + 8))} -120 ${f1(-lit * hw)} 0 L${f1(-lit * hw * 0.35)} 0 Q${f1(-lit * sw * 0.5)} -110 ${f1(-lit * sw * 0.15)} ${f1(sy - 8)}Z" fill="${c.topSh}" opacity="0.6"/>`;
    if (o.back) return s + `<rect x="-17" y="${f1(sy - 34)}" width="34" height="34" fill="${c.skinSh}"/>`;
    // neck
    s += `<path d="M-17 ${f1(sy - 36)} L-17 ${f1(sy + 2)} Q0 ${f1(sy + 14)} 17 ${f1(sy + 2)} L17 ${f1(sy - 36)}Z" fill="${c.skinSh}" stroke="${LINE}" stroke-width="3.5"/>`;
    if (c.cardigan) s += `<path d="M-22 ${f1(sy - 4)} L-14 0 L14 0 L22 ${f1(sy - 4)} Q0 ${f1(sy + 18)} -22 ${f1(sy - 4)}Z" fill="${c.inner}" stroke="${LINE}" stroke-width="3"/>${[-150, -100, -50].map(y => `<circle cx="-20" cy="${y}" r="4.5" fill="#6b4a1a"/>`).join('')}<path d="M-20 ${f1(sy)} L-20 0 M20 ${f1(sy)} L20 0" stroke="${c.topSh}" stroke-width="4"/>`;
    if (c.blazer) s += `<path d="M-26 ${f1(sy - 2)} L0 -120 L26 ${f1(sy - 2)} Q0 ${f1(sy + 10)} -26 ${f1(sy - 2)}Z" fill="${c.inner}"/><path d="M-26 ${f1(sy - 2)} L0 -120 L-36 -150 L-46 ${f1(sy + 18)}Z M26 ${f1(sy - 2)} L0 -120 L36 -150 L46 ${f1(sy + 18)}Z" fill="${c.topSh}" stroke="${LINE}" stroke-width="3"/><circle cx="0" cy="-92" r="5" fill="#2a0e0c"/>`;
    if (c.collar) s += `<path d="M-30 ${f1(sy - 4)} L-6 ${f1(sy + 26)} L0 ${f1(sy + 6)} L6 ${f1(sy + 26)} L30 ${f1(sy - 4)}" fill="${c.top}" stroke="${LINE}" stroke-width="3.5" stroke-linejoin="round"/><path d="M0 ${f1(sy + 12)} L0 0" stroke="${c.topSh}" stroke-width="3"/><rect x="${f1(sw * 0.25)}" y="-170" width="30" height="30" rx="3" fill="none" stroke="${c.topSh}" stroke-width="3"/>`;
    if (c.necklace) s += `<path d="M-20 ${f1(sy - 2)} Q0 ${f1(sy + 30)} 20 ${f1(sy - 2)}" stroke="#e0b252" stroke-width="3.5" fill="none"/><circle cx="0" cy="${f1(sy + 18)}" r="5" fill="#e0b252"/>`;
    if (!c.cardigan && !c.blazer && !c.collar) s += `<path d="M-24 ${f1(sy - 4)} Q0 ${f1(sy + 16)} 24 ${f1(sy - 4)}" stroke="${c.topSh}" stroke-width="5" fill="none"/>`;
    return s;
  }
  function legs(c, o) {
    const ph = o.walk ?? null; let s = '';
    const leg = (x, ang) => { const r = ang * Math.PI / 180, lx = x + Math.sin(r) * 240, ly = Math.cos(r) * 240;
      return `<path d="M${x} 0 L${f1(lx)} ${f1(ly)}" stroke="${LINE}" stroke-width="50" stroke-linecap="round"/><path d="M${x} 0 L${f1(lx)} ${f1(ly)}" stroke="${c.trousers}" stroke-width="43" stroke-linecap="round"/>
        <path d="M${f1(lx - 26)} ${f1(ly + 22)} Q${f1(lx - 26)} ${f1(ly - 4)} ${f1(lx + 4)} ${f1(ly)} Q${f1(lx + 34)} ${f1(ly + 4)} ${f1(lx + 34)} ${f1(ly + 22)}Z" fill="${c.shoes}" stroke="${LINE}" stroke-width="3"/>`; };
    const a = ph === null ? 0 : Math.sin(ph) * 17;
    s += leg(-26 * c.build, ph === null ? 2 : a) + leg(26 * c.build, ph === null ? -2 : -a);
    return s;
  }
  function item(kind, x, y, o = {}) {
    const r = o.rot || 0;
    const g = inner => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(r)}) scale(${o.s || 1})">${inner}</g>`;
    if (kind === 'phone') return g(`<rect x="-24" y="-44" width="48" height="88" rx="9" fill="#17181c" stroke="${LINE}" stroke-width="3"/><rect x="-19" y="-38" width="38" height="76" rx="5" fill="${o.lit ? '#9fd0ff' : '#2a3442'}" opacity="${o.lit ? 0.95 : 1}"/>`);
    if (kind === 'mug') return g(`<path d="M24 -14 q20 0 20 16 q0 16 -20 16" stroke="${LINE}" stroke-width="9" fill="none"/><path d="M24 -14 q20 0 20 16 q0 16 -20 16" stroke="${o.color || '#efe9df'}" stroke-width="4" fill="none"/><path d="M-26 -30 L26 -30 L22 34 Q0 42 -22 34Z" fill="${o.color || '#efe9df'}" stroke="${LINE}" stroke-width="3.5"/><ellipse cx="0" cy="-30" rx="26" ry="6" fill="#4a2e1c" stroke="${LINE}" stroke-width="3"/>`);
    if (kind === 'wallet') {
      if (!o.open) return g(`<rect x="-34" y="-22" width="68" height="44" rx="6" fill="#8a4b2a" stroke="${LINE}" stroke-width="3.5"/><path d="M-34 -6 L34 -6" stroke="#5e2f17" stroke-width="3"/><circle cx="24" cy="4" r="4" fill="#d8b46a"/>`);
      return g(`<path d="M-72 -26 L0 -30 L0 30 L-72 28Z" fill="#8a4b2a" stroke="${LINE}" stroke-width="3.5"/><path d="M0 -30 L72 -26 L72 28 L0 30Z" fill="#9a5733" stroke="${LINE}" stroke-width="3.5"/>
        ${o.notes ? `<g>${[0, 1, 2].map(i => `<rect x="${-62 + i * 4}" y="${-44 + i * 3 - (o.fan || 0) * i * 6}" width="56" height="30" rx="2" fill="#9cc79a" stroke="${LINE}" stroke-width="2.5" transform="rotate(${-6 + i * 6 + (o.fan || 0) * i * 10} ${-34 + i * 4} -30)"/>`).join('')}</g>` : ''}
        <rect x="8" y="-20" width="56" height="38" rx="4" fill="#f2efe6" stroke="${LINE}" stroke-width="2.5"/><circle cx="22" cy="-4" r="8" fill="#6d4430"/><rect x="34" y="-12" width="24" height="5" fill="#555"/><rect x="34" y="-2" width="18" height="4" fill="#888"/>`);
    }
    if (kind === 'tray') return g(`<rect x="-120" y="-16" width="240" height="30" rx="10" fill="#c9cfd1" stroke="${LINE}" stroke-width="4"/><ellipse cx="-40" cy="-22" rx="56" ry="13" fill="#f4f1ea" stroke="${LINE}" stroke-width="3"/><path d="M-76 -30 Q-40 -50 -6 -30 Z" fill="#e2b46a" stroke="${LINE}" stroke-width="3"/><path d="M-66 -32 Q-40 -42 -14 -32" stroke="#7da35b" stroke-width="5" fill="none"/>
      <rect x="40" y="-62" width="34" height="48" rx="4" fill="#d3463c" stroke="${LINE}" stroke-width="3"/><rect x="40" y="-48" width="34" height="12" fill="#f4f1ea"/><path d="M90 -26 l26 -8" stroke="#9aa3a6" stroke-width="5" stroke-linecap="round"/>`);
    if (kind === 'cup') return g(`<path d="M-24 -36 L24 -36 L19 34 L-19 34Z" fill="#f1ebe0" stroke="${LINE}" stroke-width="3.5"/><rect x="-28" y="-46" width="56" height="12" rx="4" fill="#3b2a20" stroke="${LINE}" stroke-width="3"/><rect x="-22" y="-8" width="44" height="22" fill="#b5532f"/>${o.steam ? `<path d="M-6 -52 q10 -16 0 -32 q-10 -16 0 -32" stroke="#fff" stroke-width="5" fill="none" opacity="0.5" stroke-linecap="round"/>` : ''}`);
    if (kind === 'cupcake') return g(`<path d="M-28 0 L28 0 L20 36 L-20 36Z" fill="#d9a05b" stroke="${LINE}" stroke-width="3.5"/><path d="M-34 2 Q-36 -30 -10 -34 Q0 -56 12 -34 Q38 -30 34 2Z" fill="#f4b6c8" stroke="${LINE}" stroke-width="3.5"/><circle cx="2" cy="-46" r="8" fill="#d6363c" stroke="${LINE}" stroke-width="2.5"/>`);
    if (kind === 'deskphone') return g(`<rect x="-60" y="-30" width="120" height="60" rx="12" fill="#2c2f35" stroke="${LINE}" stroke-width="3.5"/><path d="M-62 -30 Q-70 -60 -40 -62 L40 -62 Q70 -60 62 -30" fill="#3a3e45" stroke="${LINE}" stroke-width="3.5"/>${[0, 1, 2].map(i => [0, 1, 2].map(j => `<rect x="${-30 + j * 22}" y="${-20 + i * 14}" width="14" height="9" rx="2" fill="#9aa3ad"/>`).join('')).join('')}`);
    if (kind === 'certificate') return g(`<rect x="-90" y="-64" width="180" height="128" fill="#efe6c8" stroke="#8a6a2a" stroke-width="7"/><rect x="-76" y="-50" width="152" height="100" fill="none" stroke="#c9a85a" stroke-width="2"/><text x="0" y="-18" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="17" fill="#5a4318">EMPLOYEE</text><text x="0" y="4" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="17" fill="#5a4318">OF THE MONTH</text><text x="0" y="32" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="16" fill="#8a6a2a">${esc(o.text || 'MARCH 2023')}</text><circle cx="60" cy="38" r="12" fill="#c9a85a"/>`);
    if (kind === 'sticky') {   // handwritten sticky note; o.text = array of lines; o.torn = ragged top edge
      const col = o.color || '#ffe36b', lines = o.text || [], fs = o.fs || 30, w = o.w || 240, h = o.h || 240;
      const top = o.torn ? `M${-w / 2} ${-h / 2 + 8} ${[...Array(12).keys()].map(i => `L${f1(-w / 2 + (i + 1) * w / 12)} ${f1(-h / 2 + (i % 2 ? 0 : 10))}`).join(' ')}` : `M${-w / 2} ${-h / 2} L${w / 2} ${-h / 2}`;
      return g(`<rect x="${-w / 2 + 8}" y="${-h / 2 + 12}" width="${w}" height="${h}" fill="#000" opacity="0.22"/>
        <path d="${top} L${w / 2} ${h / 2 - 34} L${w / 2 - 34} ${h / 2} L${-w / 2} ${h / 2}Z" fill="${col}" stroke="${LINE}" stroke-width="3"/>
        <path d="M${w / 2} ${h / 2 - 34} L${w / 2 - 30} ${h / 2 - 30} L${w / 2 - 34} ${h / 2}Z" fill="#e6c44a" stroke="${LINE}" stroke-width="2.5"/>
        ${lines.map((l, i) => `<text x="0" y="${f1((i - (lines.length - 1) / 2) * fs * 1.2 + fs * 0.35)}" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="800" font-size="${fs}" fill="${o.ink || '#1d2a6b'}">${esc(l)}</text>`).join('')}`);
    }
    if (kind === 'envelope') return g(`<rect x="-80" y="-52" width="160" height="104" rx="6" fill="#f3e9d2" stroke="${LINE}" stroke-width="4"/><path d="M-80 -52 L0 8 L80 -52" fill="none" stroke="${LINE}" stroke-width="3.5"/><circle cx="0" cy="10" r="12" fill="#d0544a"/>`);
    if (kind === 'pen') return g(`<rect x="-4" y="-34" width="8" height="58" rx="3" fill="#2a63c4" stroke="${LINE}" stroke-width="2"/><path d="M-4 24 L0 34 L4 24Z" fill="#ddd"/>`);
    if (kind === 'bag') return g(`<path d="M-40 -60 Q0 -110 40 -60" stroke="#7a5432" stroke-width="9" fill="none"/><path d="M-62 -60 L62 -60 L72 70 L-72 70Z" fill="#c99a5e" stroke="${LINE}" stroke-width="4" stroke-linejoin="round"/><path d="M-62 -38 L62 -38" stroke="#a87a42" stroke-width="4"/><rect x="-14" y="-46" width="28" height="18" rx="3" fill="#7a5432"/>`);
    return '';
  }

  // full character. o: {x,y,s,flip,turn,lean,tilt,nod,ex,look,mouth,blink,arms:{l,r},hold:{l,r,both},legs,walk,back,blur,lit}
  function person(id, o) {
    const c = CAST[id]; const s = o.s || 1;
    const arms = o.arms || {}; const aL = arms.l || [6, 4], aR = arms.r || [6, 4];
    const b = c.build, shY = -206 - (o.breath || 0) - (o.shrug || 0) * 18, shX = 74 * b;
    let out = `<g transform="translate(${f1(o.x)} ${f1(o.y)}) scale(${f1(s * (o.flip ? -1 : 1))} ${f1(s)})" ${o.blur ? `filter="url(#qgBlur${o.blur})"` : ''} ${o.op !== undefined ? `opacity="${f1(o.op)}"` : ''}>`;
    out += `<ellipse cx="0" cy="${o.legs ? 252 : 10}" rx="${110 * b}" ry="16" fill="#000" opacity="${o.legs ? 0.25 : 0}"/>`;
    if (o.legs) out += legs(c, o);
    out += `<g transform="rotate(${f1(o.lean || 0)} 0 0)">`;
    const L = drawArm(c, -1, -shX, shY, aL), R = drawArm(c, 1, shX, shY, aR);
    const backArms = o.armsFront ? '' : L.svg + R.svg;
    out += backArms + torso(c, o);
    const hx = o.tilt || 0, nod = o.nod || 0;
    out += `<g transform="translate(${f1((o.turn || 0) * 4)} ${f1(-300 - (o.breath || 0) - (o.shrug || 0) * 8 + nod * 6)}) rotate(${f1(hx)} 0 70)">${head(c, o)}</g>`;
    if (o.armsFront) out += L.svg + R.svg;
    // held items (positions in body space, so they follow the arm)
    const hold = o.hold || {};
    if (hold.both) { const mx = (L.p.hx + R.p.hx) / 2, my = (L.p.hy + R.p.hy) / 2; out += item(hold.both.kind, mx + (hold.both.dx || 0), my + (hold.both.dy || 0), hold.both);
      out += `<circle cx="${f1(L.p.hx)}" cy="${f1(L.p.hy)}" r="15" fill="${c.skin}" stroke="${LINE}" stroke-width="3.5"/><circle cx="${f1(R.p.hx)}" cy="${f1(R.p.hy)}" r="15" fill="${c.skin}" stroke="${LINE}" stroke-width="3.5"/>`; }
    if (hold.l) out += item(hold.l.kind, L.p.hx + (hold.l.dx || 0), L.p.hy + (hold.l.dy || -10), hold.l) + `<circle cx="${f1(L.p.hx)}" cy="${f1(L.p.hy)}" r="15" fill="${c.skin}" stroke="${LINE}" stroke-width="3.5"/>`;
    if (hold.r) out += item(hold.r.kind, R.p.hx + (hold.r.dx || 0), R.p.hy + (hold.r.dy || -10), hold.r) + `<circle cx="${f1(R.p.hx)}" cy="${f1(R.p.hy)}" r="15" fill="${c.skin}" stroke="${LINE}" stroke-width="3.5"/>`;
    out += '</g></g>';
    return out;
  }
  // convenience: idle life (breathing, blinking, tiny sway) for a character at time t
  function alive(t, phase) { return { breath: Math.sin(t * 2.1 + phase) * 2.2, blink: blink(t, phase), tilt: Math.sin(t * 0.9 + phase) * 1.2 }; }

  // ---------------------------------------------------------------- camera + layers
  let CAM = { z: 1, cx: W / 2, cy: H / 2 };
  function setCam(z, cx, cy, t, shake = 0) {
    const hx = Math.sin(t * 0.73) * 3 + Math.sin(t * 1.9) * 1.5 + (shake ? Math.sin(t * 61) * shake : 0);
    const hy = Math.cos(t * 0.61) * 3 + (shake ? Math.cos(t * 53) * shake : 0);
    CAM = { z, cx: cx + hx, cy: cy + hy };
  }
  function layer(depth, content) {   // depth 1 = subject plane; <1 farther (moves/zooms less); >1 nearer
    const z = 1 + (CAM.z - 1) * depth, cx = W / 2 + (CAM.cx - W / 2) * depth, cy = H / 2 + (CAM.cy - H / 2) * depth;
    return `<g transform="translate(${W / 2} ${H / 2}) scale(${z.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})">${content}</g>`;
  }
  function defs() {
    return `<defs><filter id="qgBlur1" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.5"/></filter>
      <filter id="qgBlur2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
      <filter id="qgBlur3" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="12"/></filter>
      <filter id="qgGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed="7" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.10"/></feComponentTransfer></filter>
      <filter id="qgPaint" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="3" seed="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.16"/></feComponentTransfer></filter>
      <radialGradient id="qgVig" cx="50%" cy="42%" r="72%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#05070a" stop-opacity="0.62"/></radialGradient>
      <linearGradient id="qgShaft" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="#ffe3b0" stop-opacity="0.55"/><stop offset="1" stop-color="#ffe3b0" stop-opacity="0"/></linearGradient>
      <linearGradient id="qgShaftCool" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="#d8f0ff" stop-opacity="0.45"/><stop offset="1" stop-color="#d8f0ff" stop-opacity="0"/></linearGradient>
      <radialGradient id="qgGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#9fd0ff" stop-opacity="0.55"/><stop offset="1" stop-color="#9fd0ff" stop-opacity="0"/></radialGradient>
      <filter id="qgMemory"><feColorMatrix type="saturate" values="0.25"/><feComponentTransfer><feFuncR type="linear" slope="0.9" intercept="0.08"/><feFuncG type="linear" slope="0.85" intercept="0.07"/><feFuncB type="linear" slope="0.75" intercept="0.05"/></feComponentTransfer></filter>
      <radialGradient id="qgPool" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffe6b8" stop-opacity="0.5"/><stop offset="1" stop-color="#ffe6b8" stop-opacity="0"/></radialGradient></defs>`;
  }
  function finish(grade) {
    // colour grade + painterly mottling + grain + vignette (screen space)
    return `<rect width="${W}" height="${H}" fill="${grade.color}" opacity="${grade.op}" style="mix-blend-mode:${grade.mode || 'soft-light'}"/>
      <rect width="${W}" height="${H}" filter="url(#qgPaint)" style="mix-blend-mode:multiply"/>
      <rect width="${W}" height="${H}" fill="url(#qgVig)"/><rect width="${W}" height="${H}" filter="url(#qgGrain)" style="mix-blend-mode:overlay"/>`;
  }

  // ---------------------------------------------------------------- sets
  function wallTex(x, y, w, h, c1, c2, seed) {
    const r = E.mulberry32(seed); let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c1}"/>`;
    for (let i = 0; i < 14; i++) s += `<ellipse cx="${f1(x + r() * w)}" cy="${f1(y + r() * h)}" rx="${f1(120 + r() * 260)}" ry="${f1(60 + r() * 160)}" fill="${c2}" opacity="${f1(0.08 + r() * 0.12)}" filter="url(#qgBlur3)"/>`;
    return s;
  }
  function ceilingLights(y, n, col, op = 1) {
    let s = '';
    for (let i = 0; i < n; i++) { const x = 60 + i * (W - 120) / (n - 1) - 90; s += `<rect x="${f1(x)}" y="${y}" width="180" height="22" rx="4" fill="${col}" opacity="${op}"/><rect x="${f1(x - 30)}" y="${y - 10}" width="240" height="42" rx="10" fill="${col}" opacity="${0.15 * op}" filter="url(#qgBlur2)"/>`; }
    return s;
  }
  function windowWall(x, y, w, h, sky, opts = {}) {
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${sky}"/>`;
    s += `<rect x="${x}" y="${y + h * 0.55}" width="${w}" height="${h * 0.45}" fill="${opts.city || '#8fa8b0'}" opacity="0.55"/>`;
    const r = E.mulberry32(opts.seed || 5);
    for (let i = 0; i < 9; i++) { const bw = 40 + r() * 90, bh = h * (0.2 + r() * 0.4), bx = x + r() * w; s += `<rect x="${f1(bx)}" y="${f1(y + h - bh)}" width="${f1(bw)}" height="${f1(bh)}" fill="${opts.bld || '#7d939c'}" opacity="0.7"/>`; }
    const n = opts.panes || 3;
    for (let i = 0; i <= n; i++) s += `<rect x="${f1(x + i * w / n - 7)}" y="${y}" width="14" height="${h}" fill="${opts.frame || '#2b3236'}"/>`;
    s += `<rect x="${x - 7}" y="${y - 7}" width="${w + 14}" height="14" fill="${opts.frame || '#2b3236'}"/><rect x="${x - 7}" y="${y + h - 7}" width="${w + 14}" height="18" fill="${opts.frame || '#2b3236'}"/>`;
    if (opts.blinds) for (let k = y + 20; k < y + h * opts.blinds; k += 22) s += `<rect x="${x}" y="${k}" width="${w}" height="11" fill="#e8e2d4" opacity="0.85"/>`;
    return s;
  }
  function desk(x, y, w, opts = {}) {
    let s = `<rect x="${x}" y="${y}" width="${w}" height="24" fill="${opts.top || '#a07a52'}" stroke="${LINE}" stroke-width="3"/><rect x="${x + 10}" y="${y + 24}" width="${w - 20}" height="${opts.h || 300}" fill="${opts.front || '#5b4636'}" stroke="${LINE}" stroke-width="3"/>`;
    if (opts.monitor !== false) {
      const mx = x + (opts.mx ?? w * 0.55), mw = opts.mw || 190;
      s += `<rect x="${f1(mx - 10)}" y="${y - 40}" width="20" height="40" fill="#2a2a2e"/><rect x="${f1(mx - mw / 2)}" y="${f1(y - 40 - mw * 0.62)}" width="${mw}" height="${f1(mw * 0.62)}" rx="6" fill="#1d1f24" stroke="${LINE}" stroke-width="3"/><rect x="${f1(mx - mw / 2 + 8)}" y="${f1(y - 32 - mw * 0.62)}" width="${mw - 16}" height="${f1(mw * 0.62 - 16)}" fill="${opts.screen || '#6fa6c8'}" opacity="0.85"/>`;
    }
    if (opts.pot) s += `<rect x="${x + opts.pot}" y="${y - 50}" width="40" height="50" rx="5" fill="#d8d2c4" stroke="${LINE}" stroke-width="3"/>${[0, 1, 2].map(i => `<rect x="${x + opts.pot + 8 + i * 9}" y="${y - 80 + i * 6}" width="6" height="40" fill="${['#c4402f', '#2a63c4', '#222'][i]}"/>`).join('')}`;
    if (opts.plant) s += `<rect x="${x + opts.plant - 22}" y="${y - 50}" width="44" height="50" rx="4" fill="#b8613c" stroke="${LINE}" stroke-width="3"/>${[-40, -15, 10, 35].map((a, i) => `<path d="M${x + opts.plant} ${y - 48} q${a} -${60 + i * 12} ${a * 1.6} -${80 + i * 10}" stroke="#4f7d4a" stroke-width="12" fill="none" stroke-linecap="round"/>`).join('')}`;
    return s;
  }
  function partition(x, y, w, h, col = '#61707a') {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${col}" stroke="${LINE}" stroke-width="4"/><rect x="${x}" y="${y}" width="${w}" height="16" rx="5" fill="#9aa4a8" stroke="${LINE}" stroke-width="3"/>
      ${[0.2, 0.5, 0.8].map(k => `<rect x="${f1(x + w * k - 30)}" y="${y + 50}" width="60" height="44" fill="#efe7cf" opacity="0.65" transform="rotate(${k * 10 - 4} ${f1(x + w * k)} ${y + 70})"/>`).join('')}`;
  }
  // open-plan office, morning: big windows, partitions, desks
  function officeSet(t, opts = {}) {
    const warm = opts.warm ?? 1;
    let far = wallTex(-200, 0, W + 400, H, opts.wall || '#33464c', '#6a8a86', 11);
    far += ceilingLights(170, 5, '#fff7df', 0.9);
    far += windowWall(-60, 330, 1200, 560, opts.sky || '#d8e6e2', { blinds: 0.35, seed: 9, panes: 4 });
    far += `<rect x="-200" y="890" width="${W + 400}" height="${H}" fill="${opts.floor || '#2c3236'}"/>`;
    far += desk(-60, 900, 360, { h: 160, mx: 150, screen: '#7cb0cc', plant: 300 }) + desk(720, 900, 420, { h: 160, mx: 220, screen: '#89b8d0' });
    let s = layer(0.55, far);
    s += layer(0.6, `<polygon points="80,330 520,330 980,1700 120,1700" fill="url(#qgShaft)" opacity="${f1(0.55 * warm)}" style="mix-blend-mode:screen"/><polygon points="620,330 900,330 1300,1500 760,1500" fill="url(#qgShaft)" opacity="${f1(0.35 * warm)}" style="mix-blend-mode:screen"/>`);
    return s;
  }
  // break room: fridge, vending machine, window, fluorescent light
  function breakSet(t, opts = {}) {
    let far = wallTex(-200, 0, W + 400, H, opts.wall || '#41534c', '#8aa596', 21);
    far += `<rect x="-200" y="0" width="${W + 400}" height="250" fill="#2a3532"/>` + ceilingLights(200, 4, '#f2fff6', 0.95);
    far += windowWall(560, 360, 460, 470, opts.sky || '#e6eee6', { seed: 3, panes: 2, frame: '#24302c', city: '#a3b6ae', bld: '#8fa49c' });
    far += `<rect x="-40" y="380" width="250" height="560" rx="14" fill="#d9ddd6" stroke="${LINE}" stroke-width="4"/><path d="M-40 560 L210 560" stroke="${LINE}" stroke-width="3"/><rect x="180" y="440" width="10" height="80" rx="4" fill="#8a918c"/><rect x="180" y="600" width="10" height="120" rx="4" fill="#8a918c"/>`;
    far += `<rect x="20" y="420" width="70" height="50" fill="#f3e9c4" transform="rotate(-5 55 445)"/><rect x="100" y="640" width="60" height="44" fill="#f2c6c0" transform="rotate(4 130 662)"/>`;
    far += `<rect x="250" y="440" width="260" height="500" rx="10" fill="#7b2f2c" stroke="${LINE}" stroke-width="4"/><rect x="275" y="470" width="150" height="330" fill="#1c2226"/>${[0, 1, 2, 3].map(i => [0, 1, 2].map(j => `<rect x="${288 + j * 46}" y="${485 + i * 78}" width="34" height="50" rx="4" fill="${['#e2b04a', '#4aa3d0', '#d0544a', '#6ab06a'][(i + j) % 4]}"/>`).join('')).join('')}<rect x="440" y="500" width="46" height="90" rx="4" fill="#2a2f32"/>`;
    far += `<rect x="-200" y="940" width="${W + 400}" height="${H}" fill="${opts.floor || '#36403c'}"/>`;
    let s = layer(0.55, far);
    s += layer(0.6, `<polygon points="560,360 1020,360 1250,1500 560,1500" fill="url(#qgShaftCool)" opacity="0.5" style="mix-blend-mode:screen"/>`);
    return s;
  }
  function kitchenSet(t) {
    let far = wallTex(-200, 0, W + 400, H, '#4f4438', '#a2876a', 31);
    for (let y = 560; y < 1000; y += 46) for (let x = -200 + ((y / 46) % 2) * 45; x < W + 200; x += 90) far += `<rect x="${x}" y="${y}" width="86" height="42" rx="3" fill="#e7dfcf" opacity="0.85"/>`;
    far += `<rect x="-200" y="240" width="${W + 400}" height="300" fill="#6b5a48" stroke="${LINE}" stroke-width="4"/>${[0, 1, 2, 3, 4].map(i => `<rect x="${-150 + i * 280}" y="260" width="250" height="260" rx="6" fill="#7d6a55" stroke="${LINE}" stroke-width="3"/><rect x="${-40 + i * 280}" y="380" width="30" height="8" rx="3" fill="#c9b38c"/>`).join('')}`;
    far += `<rect x="430" y="640" width="230" height="330" rx="14" fill="#22252a" stroke="${LINE}" stroke-width="4"/><rect x="455" y="665" width="180" height="90" rx="6" fill="#3a4048"/><circle cx="610" cy="710" r="9" fill="#ff5a4a"/><rect x="500" y="800" width="90" height="60" rx="6" fill="#121418"/><rect x="520" y="870" width="50" height="60" rx="4" fill="#efe9df" stroke="${LINE}" stroke-width="2"/>`;
    far += `<rect x="-200" y="960" width="${W + 400}" height="60" fill="#c7b392" stroke="${LINE}" stroke-width="4"/><rect x="-200" y="1020" width="${W + 400}" height="${H}" fill="#5b4a3a"/>`;
    let s = layer(0.6, far);
    s += layer(0.65, `<polygon points="-200,200 200,200 700,1600 -200,1600" fill="url(#qgShaft)" opacity="0.5" style="mix-blend-mode:screen"/>`);
    return s;
  }
  function phoneInsert(ctx, t, o) {
    // close-up of a phone on a desk; o.mode = 'preview' | 'full'
    const ph = E.mulberry32(77); let s = wallTex(-200, -200, W + 400, H + 400, o.desk || '#3b2c24', '#7a5a44', 41);
    for (let i = 0; i < 26; i++) s += `<path d="M-200 ${f1(ph() * H)} q600 ${f1((ph() - 0.5) * 60)} 1500 ${f1((ph() - 0.5) * 80)}" stroke="#20160f" stroke-width="${f1(2 + ph() * 4)}" opacity="0.25" fill="none"/>`;
    s += `<rect x="-120" y="1450" width="700" height="260" rx="20" fill="#2a2a2e" opacity="0.9" transform="rotate(8 200 1500)" filter="url(#qgBlur2)"/>`;
    s += `<g filter="url(#qgBlur2)">${item('mug', 920, 380, { s: 3.2, color: '#d9d2c4' })}</g>`;
    const shake = o.buzz ? Math.sin(t * 90) * 7 * o.buzz : 0;
    let p = `<g transform="translate(${f1(540 + shake)} 860) rotate(${f1(-5 + shake * 0.1)})">`;
    p += `<rect x="-300" y="-560" width="600" height="1120" rx="70" fill="#101115" stroke="${LINE}" stroke-width="8"/><rect x="-276" y="-536" width="552" height="1072" rx="54" fill="${o.screen || '#1c2b3d'}"/>`;
    p += `<ellipse cx="0" cy="0" rx="420" ry="600" fill="url(#qgGlow)" opacity="0.35"/>`;
    if (o.mode === 'preview') {
      p += `<text x="0" y="-330" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="150" fill="#e9f1ff" opacity="0.9">9:02</text><text x="0" y="-262" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="34" fill="#b9c8dc">Monday</text>`;
      const k = ease.back(seg(t, 0.4, 0.7));
      p += `<g transform="translate(0 ${f1(lerp(-120, 0, k))})" opacity="${f1(clamp(k, 0, 1))}"><rect x="-252" y="-180" width="504" height="290" rx="34" fill="#eef2f7"/>
        <circle cx="-196" cy="-122" r="30" fill="#4caf72"/><path d="M-210 -132 h28 v18 h-18 l-10 8z" fill="#fff"/><text x="-150" y="-110" font-family="Nunito" font-weight="800" font-size="40" fill="#1c2430">Mia</text><text x="222" y="-112" text-anchor="end" font-family="Nunito" font-weight="700" font-size="28" fill="#7d8796">now</text>
        <text x="-222" y="-40" font-family="Nunito" font-weight="800" font-size="35" fill="#1c2430">Careful with the new guy.</text><text x="-222" y="12" font-family="Nunito" font-weight="800" font-size="35" fill="#1c2430">He got caught stealing at…</text>
        <text x="-222" y="70" font-family="Nunito" font-weight="700" font-size="26" fill="#7d8796">tap to read more</text></g>`;
    } else {
      p += `<rect x="-276" y="-536" width="552" height="130" fill="#e9edf2"/><circle cx="-190" cy="-470" r="34" fill="#4caf72"/><text x="-140" y="-458" font-family="Nunito" font-weight="800" font-size="42" fill="#1c2430">Mia</text>`;
      p += `<rect x="-276" y="-406" width="552" height="942" fill="#dfe5ec"/>`;
      const rev = seg(t, o.revealAt, o.revealAt + 0.5);
      p += `<rect x="-240" y="-330" width="470" height="${f1(lerp(290, 560, ease.out(rev)))}" rx="34" fill="#ffffff"/>`;
      const L = [['Careful with the', 0], ['new guy. He got', 0], ['caught stealing', 0], ['at MY work.', 1], ['Fired on day one!', 1], ['Hope yours is nicer x', 1]];
      L.forEach(([txt, late], i) => {
        const op = late ? seg(t, o.revealAt + 0.1 + i * 0.12, o.revealAt + 0.4 + i * 0.12) : 1; if (op <= 0) return;
        const y = -250 + i * 84;
        if (i === 3) p += `<rect x="-216" y="${y - 52}" width="${f1(300 * ease.out(seg(t, o.revealAt + 0.5, o.revealAt + 0.9)))}" height="66" rx="8" fill="#ffd84a" opacity="0.85"/>`;
        p += `<text x="-206" y="${y}" font-family="Nunito" font-weight="${i === 3 ? 800 : 700}" font-size="${i === 3 ? 50 : 40}" fill="#1c2430" opacity="${f1(op)}">${esc(txt)}</text>`;
      });
    }
    p += `</g>`;
    return s + p;
  }

  // thought bubble in world space: what someone thinks but doesn't say. (x,y) = bubble centre, (hx,hy) = head it belongs to
  function thought(x, y, hx, hy, text, k, opts = {}) {
    if (k <= 0) return '';
    const lines = E.wrap(text, opts.chars || 13), fs = opts.fs || 40, w = Math.max(...lines.map(l => l.length)) * fs * 0.56 + 70, h = lines.length * fs * 1.15 + 46;
    const sc = ease.back(clamp(k, 0, 1)); let s = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc)})">`;
    const bumps = []; const n = Math.max(6, Math.round((w + h) / 46));
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; bumps.push([Math.cos(a) * w / 2, Math.sin(a) * h / 2]); }
    s += bumps.map(([bx, by]) => `<circle cx="${f1(bx)}" cy="${f1(by)}" r="${f1(Math.min(w, h) * 0.28)}" fill="#fbf7ee" stroke="${LINE}" stroke-width="4"/>`).join('');
    s += `<ellipse cx="0" cy="0" rx="${f1(w / 2)}" ry="${f1(h / 2)}" fill="#fbf7ee"/>`;
    const dx = hx - x, dy = hy - y; [0.55, 0.75].forEach((f, i) => { s += `<circle cx="${f1(dx * f)}" cy="${f1(dy * f)}" r="${14 - i * 5}" fill="#fbf7ee" stroke="${LINE}" stroke-width="3.5"/>`; });
    s += lines.map((l, i) => `<text x="0" y="${f1((i - (lines.length - 1) / 2) * fs * 1.15 + fs * 0.35)}" text-anchor="middle" font-family="Nunito" font-weight="800" font-style="italic" font-size="${fs}" fill="${opts.color || '#2a2230'}">${esc(l)}</text>`).join('');
    return s + '</g>';
  }
  // meeting room: whiteboard (lines of marker text), optional projector screen, window
  function meetingSet(t, opts = {}) {
    let far = wallTex(-200, 0, W + 400, H, opts.wall || '#3e4a55', '#7d8fa0', 51);
    far += ceilingLights(170, 4, '#fff6e0', 0.85);
    far += windowWall(760, 330, 420, 560, opts.sky || '#d6e3e8', { blinds: 0.3, seed: 12, panes: 2 });
    far += `<rect x="40" y="360" width="600" height="420" rx="10" fill="#f5f4ef" stroke="${LINE}" stroke-width="5"/><rect x="40" y="780" width="600" height="18" fill="#9aa1a8" stroke="${LINE}" stroke-width="3"/>`;
    (opts.board || []).forEach((ln, i) => { far += `<text x="${opts.boardX || 80}" y="${450 + i * 78}" font-family="Fraunces" font-style="italic" font-weight="600" font-size="${i ? 52 : 60}" fill="${ln.color || '#1f4fa3'}">${esc(ln.text || ln)}</text>`; });
    if (opts.screen) far += `<rect x="660" y="300" width="400" height="250" rx="6" fill="#e9eef3" stroke="${LINE}" stroke-width="4"/><rect x="680" y="320" width="360" height="210" fill="${opts.screen === 'blue' ? '#2b5fb8' : '#dfe6ee'}"/>${opts.screen === 'blue' ? `<text x="860" y="440" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" fill="#dfe8ff">NO SIGNAL</text>` : ''}${opts.screen === 'on' ? [60, 95, 80, 140, 170].map((h, i) => `<rect x="${720 + i * 62}" y="${500 - h}" width="40" height="${h}" fill="${i === 4 ? '#1e8a3c' : '#5c8fd6'}"/>`).join('') : ''}`;
    far += `<rect x="-200" y="900" width="${W + 400}" height="${H}" fill="${opts.floor || '#2f3338'}"/>`;
    let s = layer(0.55, far);
    s += layer(0.6, `<polygon points="760,330 1180,330 1300,1500 620,1500" fill="url(#qgShaft)" opacity="0.4" style="mix-blend-mode:screen"/>`);
    return s;
  }
  function meetingTable(y, opts = {}) {
    return `<polygon points="-140,${y} 1220,${y} 1340,${y + 220} -260,${y + 220}" fill="${opts.top || '#d6d1c6'}" stroke="${LINE}" stroke-width="4"/><polygon points="-260,${y + 220} 1340,${y + 220} 1340,${y + 260} -260,${y + 260}" fill="#8b857a"/>
      <path d="M-140 ${y + 30} L1220 ${y + 30}" stroke="#fff" stroke-width="3" opacity="0.5"/>${opts.items || ''}`;
  }
  // night camp in the rain: sky, trees, tent interior opening framed in the middle
  function rainNight(t, opts = {}) {
    let s = `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#0d1622"/>`;
    const r = E.mulberry32(91);
    for (let i = 0; i < 9; i++) { const x = -150 + i * 160 + r() * 60, h = 700 + r() * 500; s += `<path d="M${f1(x)} ${f1(1300 - h)} L${f1(x - 110)} 1300 L${f1(x + 110)} 1300Z" fill="#132235"/>`; }
    s += `<rect x="-200" y="1300" width="${W + 400}" height="800" fill="#1a2418"/>`;
    return s;
  }
  function rainDrops(t, n = 90, op = 0.35) {
    const r = E.mulberry32(17); let s = '';
    for (let i = 0; i < n; i++) { const x0 = r() * (W + 300) - 150, sp = 1700 + r() * 900, ph = r(); const y = ((t * sp + ph * H * 1.3) % (H * 1.3)) - 200; s += `<line x1="${f1(x0)}" y1="${f1(y)}" x2="${f1(x0 - 16)}" y2="${f1(y + 60)}" stroke="#cfe0f2" stroke-width="3" opacity="${op}"/>`; }
    return s;
  }

  // a group-chat app on a phone, filling the frame. msgs: [{who:name, text, mine, at, color, system}]
  function chatScreen(t, o) {
    let s = wallTex(-200, -200, W + 400, H + 400, o.desk || '#2e2a2a', '#5a4d44', 61);
    const shake = o.buzz ? Math.sin(t * 90) * 6 * o.buzz : 0;
    let p = `<g transform="translate(${f1(540 + shake)} 900) rotate(-3)"><rect x="-320" y="-620" width="640" height="1240" rx="70" fill="#101115" stroke="${LINE}" stroke-width="8"/><rect x="-296" y="-596" width="592" height="1192" rx="54" fill="#eef1f5"/>`;
    p += `<rect x="-296" y="-596" width="592" height="130" rx="54" fill="#ffffff"/><rect x="-296" y="-520" width="592" height="54" fill="#ffffff"/><circle cx="-220" cy="-520" r="34" fill="${o.groupColor || '#5c8fd6'}"/><text x="-220" y="-509" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" fill="#fff">${esc((o.title || '?')[0])}</text>
      <text x="-170" y="-526" font-family="Nunito" font-weight="800" font-size="36" fill="#1c2430">${esc(o.title || '')}</text><text x="-170" y="-490" font-family="Nunito" font-weight="700" font-size="24" fill="#7d8796">${esc(o.members || '')}</text>`;
    let y = -400;
    for (const m of o.msgs || []) {
      const k = seg(t, m.at ?? -1, (m.at ?? -1) + 0.25); if (k <= 0) continue;
      const lines = E.wrap(m.text, 20), h = lines.length * 46 + (m.mine || m.system ? 30 : 64);
      if (m.system) { p += `<g opacity="${f1(k)}"><rect x="-200" y="${y}" width="400" height="56" rx="28" fill="#dfe4ea"/><text x="0" y="${y + 37}" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="26" fill="#5d6673">${esc(m.text)}</text></g>`; y += 76; continue; }
      const w = Math.max(...lines.map(l => l.length)) * 22 + 60, x = m.mine ? 270 - w : -270;
      p += `<g opacity="${f1(k)}" transform="translate(0 ${f1((1 - ease.out(k)) * 30)})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="${m.mine ? '#3a8a5f' : '#ffffff'}" stroke="#d4dae2" stroke-width="${m.mine ? 0 : 2}"/>`;
      if (!m.mine) p += `<text x="${x + 26}" y="${y + 40}" font-family="Nunito" font-weight="800" font-size="26" fill="${m.color || '#d0544a'}">${esc(m.who)}</text>`;
      lines.forEach((l, i) => { p += `<text x="${x + 26}" y="${y + (m.mine ? 50 : 84) + i * 46}" font-family="Nunito" font-weight="700" font-size="36" fill="${m.mine ? '#ffffff' : '#1c2430'}">${esc(l)}</text>`; });
      p += '</g>'; y += h + 22;
    }
    if (o.seen) { const k = seg(t, o.seen.at, o.seen.at + 0.3); if (k > 0) p += `<text x="270" y="${y + 6}" text-anchor="end" font-family="Nunito" font-weight="800" font-size="28" fill="#7d8796" opacity="${f1(k)}">${esc(o.seen.text)}</text>`; }
    if (o.typing && t > o.typing[0] && t < o.typing[1]) { const d = i => f1(0.35 + 0.65 * Math.abs(Math.sin(t * 6 + i))); p += `<rect x="-270" y="${y + 40}" width="130" height="64" rx="32" fill="#fff"/>${[0, 1, 2].map(i => `<circle cx="${-232 + i * 28}" cy="${y + 72}" r="9" fill="#9aa3ad" opacity="${d(i)}"/>`).join('')}`; }
    p += `<rect x="-296" y="500" width="592" height="96" fill="#ffffff"/><rect x="-270" y="520" width="440" height="56" rx="28" fill="#eef1f5"/><text x="-246" y="557" font-family="Nunito" font-weight="700" font-size="28" fill="${o.draft ? '#1c2430' : '#9aa3ad'}">${esc(o.draft || 'Message')}</text><circle cx="230" cy="548" r="30" fill="#3a8a5f"/>`;
    return s + p + '</g>';
  }
  // memory flash: replay a moment from an earlier episode (its scene function must be loaded via renderer_includes)
  function memory(sceneName, t, ep, opts = {}) {
    const fn = E.scenes[sceneName]; if (!fn) return '';
    const fake = { t, T: 6, p: t / 6, rng: E.mulberry32(5), scene: { id: sceneName, hud: false }, ep: { cast: ep.cast, scenes: [{ hud: false }] }, decisions: {},
      lines: [0, 1, 2, 3, 4].map(i => ({ who: 'narrator', caption: '', start: 90 + i, end: 90.5 + i, mouth: [] })), gt: t + 100, idx: 0, narrEnd: 0 };
    const saveCam = { ...CAM };
    const body = fn(fake, E); CAM = saveCam;
    return `<g filter="url(#qgMemory)">${body}</g><rect width="${W}" height="${H}" fill="#fff6e0" opacity="0.12"/>` +
      `<rect x="40" y="1540" width="1000" height="120" rx="20" fill="#0d0f12" opacity="0.85"/><text x="540" y="1620" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="52" letter-spacing="4" fill="#ffd36b">${esc(opts.label || '')}</text>`;
  }

  // ---------------------------------------------------------------- screen-space text (built for easy following)
  // Captions: 1-3 words at a time, big, the spoken word lit in the speaker's colour.
  const PUNCT = /[.,!?…]$/;
  function chunkWords(words) {
    const out = []; let cur = [];
    // break at punctuation or ~3 words, but never right after a little word like "the" / "with" (keeps phrases whole)
    const GLUE = /^(the|a|an|at|with|to|of|his|her|my|is|in|on|through|going|had|just)$/i;
    words.forEach((w, i) => { cur.push(i); const len = cur.map(j => words[j]).join(' ').length;
      let brk = PUNCT.test(w) || ((len >= 13 || cur.length >= 3) && !GLUE.test(w)) || len >= 20;
      if (brk && !PUNCT.test(w) && PUNCT.test(words[i + 1] || '') && len + words[i + 1].length < 24) brk = false;  // no one-word orphans
      if (brk) { out.push(cur); cur = []; } });
    if (cur.length) out.push(cur);
    return out;
  }
  function wordTimes(l) {   // no forced alignment available: spread the line by word length, with a beat after punctuation
    const words = l.caption.split(/\s+/).filter(w => w && w !== '|');
    const wts = words.map(w => w.replace(/[^A-Za-z0-9']/g, '').length + 1.6 + (PUNCT.test(w) ? 2.2 : 0));
    const tot = wts.reduce((x, y) => x + y, 0); let acc = l.start;
    return { words, times: words.map((w, i) => { const d = (l.end - l.start) * wts[i] / tot; const r = [acc, acc + d]; acc += d; return r; }) };
  }
  function captions(ctx, opts = {}) {
    let s = ''; const cast = ctx.ep.cast, t = ctx.t;
    ctx.lines.forEach((l, li) => {
      const next = ctx.lines[li + 1];
      const a = l.start - 0.05, b = Math.min(l.end + 0.3, next ? next.start - 0.06 : Infinity);   // never overlap the next caption
      if (t < a || t > b) return;
      const { words, times } = wordTimes(l);
      let groups;
      if (l.caption.includes('|')) {   // explicit breaks written in the episode data: "Is he going | through Kemi's wallet?"
        groups = []; let i = 0;
        for (const part of l.caption.split('|')) { const n = part.split(/\s+/).filter(Boolean).length; if (n) groups.push([...Array(n).keys()].map(k => k + i)); i += n; }
      } else groups = chunkWords(words);
      let wi = 0; times.forEach((tm, i) => { if (t >= tm[0]) wi = i; });
      const g = groups.find(gr => gr.includes(wi)) || groups[0];
      const gStart = times[g[0]][0], pop = ease.back(seg(t, gStart - 0.02, gStart + 0.1));
      const op = 1 - seg(t, b - Math.min(0.12, (b - l.end) * 0.8 + 0.02), b);
      const nar = l.who === 'narrator', col = nar ? '#ffd36b' : cast[l.who].color;
      const y = opts.y || 1380, fs = 80;
      s += `<g opacity="${f1(op)}" transform="translate(${W / 2} ${y}) scale(${f1(0.86 + 0.14 * pop)})">`;
      if (!nar) s += `<text x="0" y="-96" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" letter-spacing="6" fill="${col}" stroke="#0b0b0e" stroke-width="8" paint-order="stroke">${esc(cast[l.who].name.toUpperCase())}</text>`;
      s += `<text x="0" y="0" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="${fs}" stroke="#0b0b0e" stroke-width="14" stroke-linejoin="round" paint-order="stroke">` +
        g.map((i, k) => `<tspan fill="${i === wi && t <= l.end + 0.05 ? col : '#ffffff'}">${k ? ' ' : ''}${esc(words[i])}</tspan>`).join('') + `</text></g>`;
    });
    return s;
  }
  function clockChip(ctx, opts = {}) {
    const txt = ctx.scene.clock; if (!txt) return '';
    const k = ease.out(seg(ctx.t, 0.05, 0.4)), fade = opts.hold ? 1 : 1 - 0.55 * seg(ctx.t, 2.2, 2.8);
    const w = 52 + txt.length * 24;
    return `<g transform="translate(${f1(64 - (1 - k) * 40)} 196)" opacity="${f1(k * fade)}"><rect x="0" y="-40" width="${f1(w)}" height="60" rx="30" fill="#0d0f12" opacity="0.72"/><circle cx="30" cy="-10" r="9" fill="#ff5a4a"/>
      <text x="50" y="2" font-family="Nunito" font-weight="800" font-size="34" fill="#f4efe4" letter-spacing="1">${esc(txt)}</text></g>`;
  }
  // Rumour meter: what everyone *thinks* right now, and how big it has got (5 steps). Flips to THE TRUTH at the reveal.
  function rumourAt(ctx) {   // scene.rumour: one step or a list of steps {level, text, at_line}
    const scenes = ctx.ep.scenes; let cur = null, at = -9, fresh = false;
    for (let i = 0; i <= ctx.idx; i++) {
      if (i < ctx.idx && scenes[i].truth) cur = null;
      for (const st of scenes[i].rumour ? [].concat(scenes[i].rumour) : []) {
        if (i < ctx.idx) { cur = scenes[i].truth ? null : st; continue; }   // a revealed truth clears the meter for later scenes
        const ln = ctx.lines[st.at_line || 0]; const a = st.at !== undefined ? st.at : (ln ? ln.start + 0.15 : 0.2) + (st.delay || 0);
        if (ctx.t >= a) { cur = st; at = a; fresh = true; }
      }
    }
    return { r: cur, at, fresh };
  }
  function rumourMeter(ctx) {
    if (ctx.scene.hud === false) return '';
    const { r, at, fresh } = rumourAt(ctx); const tr = ctx.scene.truth, t = ctx.t;
    const trAt = tr ? (tr.at_line !== undefined ? ctx.lines[tr.at_line].end + (tr.after ?? 0.1) : tr.at) : 0;
    const truthK = tr ? seg(t, trAt, trAt + 0.6) : 0;
    if (!r && !truthK) return '';
    const showTruth = truthK >= 0.5;
    const level = r ? r.level * (1 - truthK) : 0;
    const text = showTruth ? tr.text : r.text;
    const flash = fresh ? 1 - seg(t, at, at + 0.7) : 0;
    const hud = ctx.ep.hud || {}, quotes = hud.quotes !== false, meter = hud.meter !== false;
    const label = showTruth ? (tr.label || hud.truth_label || 'THE TRUTH') : ((r && r.label) || hud.label || 'THE RUMOUR');
    const lines = E.wrap(showTruth || !quotes ? text : `“${text}”`, 28), fs = 44, h = 92 + lines.length * fs * 1.15;
    const col = showTruth ? '#6fe0a0' : '#ff6b5a';
    let s = `<g transform="translate(70 238)"><rect width="940" height="${f1(h)}" rx="26" fill="#0d0f12" opacity="0.8"/>`;
    s += `<rect width="940" height="${f1(h)}" rx="26" fill="none" stroke="${col}" stroke-width="${f1(3 + 6 * flash)}" opacity="${f1(0.5 + 0.5 * flash)}"/>`;
    s += `<text x="30" y="52" font-family="Nunito" font-weight="800" font-size="30" letter-spacing="6" fill="${col}">${esc(label)}</text>`;
    const mx = Math.max(330, 70 + label.length * 26), step = Math.min(120, (915 - mx) / 5), bw = step - 20, hb = bw / 2;   // meter sits after the label
    for (let i = 0; i < (meter ? 5 : 0); i++) {
      const fill = clamp(level - i, 0, 1), isNew = fresh && r && i === r.level - 1;
      const sc = isNew ? 1 + 0.35 * flash : 1, x = mx + i * step;
      s += `<g transform="translate(${f1(x + hb)} 40) scale(${f1(sc)})"><rect x="${f1(-hb)}" y="-12" width="${f1(bw)}" height="24" rx="12" fill="#2b2f36"/>${fill > 0 ? `<rect x="${f1(-hb)}" y="-12" width="${f1(bw * fill)}" height="24" rx="12" fill="${['#ffb347', '#ff9447', '#ff7a47', '#ff5c47', '#ff3b3b'][i]}"/>` : ''}${isNew && flash > 0.3 ? `<rect x="${f1(-hb)}" y="-12" width="${f1(bw)}" height="24" rx="12" fill="#fff" opacity="${f1(flash - 0.3)}"/>` : ''}</g>`;
    }
    const textOp = showTruth ? seg(t, trAt + 0.3, trAt + 0.6) : 1;
    lines.forEach((ln, i) => { s += `<text x="30" y="${f1(110 + i * fs * 1.15)}" font-family="Nunito" font-weight="800" font-size="${fs}" fill="#ffffff" opacity="${f1(textOp)}">${esc(ln)}</text>`; });
    return s + '</g>';
  }
  // Who's who: a name tag the first time someone matters
  function nameTags(ctx) {
    let s = ''; const cast = ctx.ep.cast;
    for (const g of ctx.scene.tags || []) {
      const at = g.at_line !== undefined ? ctx.lines[g.at_line].start - 0.1 : g.at;
      const k = ease.back(seg(ctx.t, at, at + 0.25)), out = seg(ctx.t, at + (g.dur || 1.9), at + (g.dur || 1.9) + 0.3);
      if (k <= 0 || out >= 1) continue;
      const name = cast[g.who].name.toUpperCase(), role = g.role, w = 60 + name.length * 24 + role.length * 17;
      s += `<g transform="translate(${g.x} ${g.y}) scale(${f1(k)})" opacity="${f1(1 - out)}"><rect x="${f1(-w / 2)}" y="-36" width="${f1(w)}" height="64" rx="32" fill="#0d0f12" opacity="0.88"/>
        <rect x="${f1(-w / 2)}" y="-36" width="${f1(w)}" height="64" rx="32" fill="none" stroke="${cast[g.who].color}" stroke-width="4"/><path d="M-12 28 L0 44 L12 28Z" fill="#0d0f12" opacity="0.88"/>
        <text x="0" y="8" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34"><tspan fill="${cast[g.who].color}">${esc(name)}</tspan><tspan fill="#ffffff" font-weight="700" font-size="28"> · ${esc(role)}</tspan></text></g>`;
    }
    return s;
  }
  // Time jumps are spelled out, not implied
  function jumpCard(ctx) {
    const j = ctx.scene.jump; if (!j) return '';
    const t = ctx.t, op = 1 - seg(t, 0.38, 0.55); if (op <= 0) return '';
    let s = `<rect width="${W}" height="${H}" fill="#08090c" opacity="${f1(0.72 * op)}"/>`;
    for (let i = 0; i < 9; i++) { const y = ((i * 230 + t * 2600 * -j.dir) % H + H) % H; s += `<rect x="0" y="${f1(y)}" width="${W}" height="10" fill="#ffffff" opacity="${f1(0.12 * op)}"/>`; }
    const tri = x => j.dir < 0 ? `M${x} -40 L${x - 60} 0 L${x} 40Z` : `M${x} -40 L${x + 60} 0 L${x} 40Z`;
    s += `<g transform="translate(${W / 2} 820)" opacity="${f1(op)}"><path d="${tri(j.dir < 0 ? -10 : -110)} ${tri(j.dir < 0 ? 60 : -40)}" fill="#ffd36b"/>
      <text x="0" y="140" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="56" letter-spacing="10" fill="#ffd36b">${esc(j.label)}</text>
      <text x="0" y="230" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="70" fill="#ffffff">${esc(j.text)}</text></g>`;
    return s;
  }
  function punch(t, at, amt = 0.07) {   // quick snap zoom on a key moment
    if (t < at) return 0; const k = t - at;
    return amt * ease.out(clamp(k / 0.12, 0, 1)) * (1 - 0.6 * clamp((k - 0.12) / 1.0, 0, 1));
  }
  // a countdown that stays on screen (stakes + timer): ep.countdown = {label, days}; scene.day = 1..days
  function countdownPill(ctx) {
    const c = ctx.ep.countdown, d = ctx.scene.day; if (!c || !d) return '';
    const k = ease.out(seg(ctx.t, 0.05, 0.35)), last = d >= c.days;
    const txt = last ? `${c.label} · TODAY` : `${c.label} · ${c.days - d + 1} DAYS LEFT`, w = 70 + txt.length * 19;
    let pips = ''; for (let i = 0; i < c.days; i++) pips += `<rect x="${f1(-w + 34 + i * 26)}" y="18" width="20" height="10" rx="5" fill="${i < d ? '#ff5a4a' : '#3a3f47'}"/>`;
    return `<g transform="translate(${f1(1016 + (1 - k) * 60)} 196)" opacity="${f1(k)}"><rect x="${-w}" y="-40" width="${w}" height="78" rx="26" fill="#0d0f12" opacity="0.82"/><rect x="${-w}" y="-40" width="${w}" height="78" rx="26" fill="none" stroke="#ff5a4a" stroke-width="${last ? 4 : 2}"/>
      <text x="${-w + 30}" y="2" font-family="Nunito" font-weight="800" font-size="30" letter-spacing="1" fill="#ffffff">${esc(txt)}</text>${pips}</g>`;
  }
  // cliffhanger card in the last ~1.2 s of a part: scene.next = {part, title}
  function nextCard(ctx) {
    const n = ctx.scene.next; if (!n) return '';
    const k = ease.back(seg(ctx.t, ctx.T - 1.25, ctx.T - 0.95)); if (k <= 0) return '';
    return `<rect width="${W}" height="${H}" fill="#08090c" opacity="${f1(0.55 * clamp(k, 0, 1))}"/><g transform="translate(${W / 2} 900) scale(${f1(k)})">
      <rect x="-400" y="-120" width="800" height="240" rx="34" fill="#ff5a4a"/><text x="0" y="-18" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="92" fill="#ffffff">PART ${n.part} →</text>
      <text x="0" y="62" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="46" letter-spacing="6" fill="#ffe9e6">${esc(n.title)}</text></g>`;
  }
  // the shareable lesson card: THE MOVE / THE COUNTER (scene.lesson)
  function lessonCard(ctx) {
    const L = ctx.lesson || ctx.scene.lesson; if (!L) return '';
    const t = ctx.t, k1 = ease.back(seg(t, 0.05, 0.4));
    const ln = ctx.lines[L.counter_at_line ?? 0], k2at = ln ? ln.start - 0.05 : 0.9, k2 = ease.back(seg(t, k2at, k2at + 0.35));
    const block = (y, k, label, text, col) => {
      if (k <= 0) return '';
      const lines = E.wrap(text, 20);
      return `<g transform="translate(${W / 2} ${y}) scale(${f1(k)})" opacity="${f1(clamp(k, 0, 1))}"><rect x="-460" y="-70" width="920" height="${f1(120 + lines.length * 74)}" rx="30" fill="#ffffff"/>
        <rect x="-460" y="-70" width="920" height="64" rx="30" fill="${col}"/><rect x="-460" y="-36" width="920" height="30" fill="${col}"/>
        <text x="0" y="-26" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" letter-spacing="8" fill="#ffffff">${esc(label)}</text>
        ${lines.map((l, i) => `<text x="0" y="${f1(56 + i * 74)}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="64" fill="#1c2430">${esc(l)}</text>`).join('')}</g>`;
    };
    let s = `<rect width="${W}" height="${H}" fill="#08090c" opacity="${f1(0.72 * clamp(k1, 0, 1))}"/>`;
    s += `<text x="${W / 2}" y="470" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="46" letter-spacing="10" fill="#ffd36b" opacity="${f1(clamp(k1, 0, 1))}">COUNTER-MOVE #${L.n}</text>`;
    s += block(640, k1, L.move_label || 'THE MOVE', L.move, '#d0544a') + block(1010, k2, L.counter_label || 'THE COUNTER', L.counter, '#2e9a5c');
    return s;
  }
  function frame(ctx, body, grade, opts = {}) {
    return `<rect width="${W}" height="${H}" fill="#0c0d10"/>${defs()}${body}${finish(grade)}${opts.noClock ? '' : clockChip(ctx, opts)}${countdownPill(ctx)}${rumourMeter(ctx)}${nameTags(ctx)}${lessonCard(ctx)}${captions(ctx, ctx.scene.lesson ? { ...opts, y: 1520 } : opts)}${jumpCard(ctx)}${nextCard(ctx)}`;
  }

  window.QG = { CAST, EX, ex, talk, blink, person, item, alive, setCam, layer, officeSet, breakSet, kitchenSet, phoneInsert, desk, partition, frame, sm, mix, punch, LINE, thought, meetingSet, meetingTable, rainNight, rainDrops, chatScreen, memory };
})();


/* shared scene helpers for every episode */
(function () {
  const E = window.HW, Q = window.QG;
  Q.GRADE = { noon: { color: '#7fd6c0', op: 0.22 }, morning: { color: '#ffbf6a', op: 0.32 }, day: { color: '#a8c4d0', op: 0.18 },
    cold: { color: '#5d8fd6', op: 0.32 }, dusk: { color: '#3d5f8a', op: 0.42 }, late: { color: '#ff9a5a', op: 0.26 }, night: { color: '#2d4a7a', op: 0.45 } };
  Q.LS = (ctx, i) => ctx.lines[i].start; Q.LE = (ctx, i) => ctx.lines[i].end;
  Q.blurSet = (k, s) => `<g filter="url(#qgBlur${k})">${s}</g>`;
  Q.RAISE = { l: [-160, 12], r: [-160, 12] };            // hand up (use one side)
  // a line's spoken state for a character: {mouth, talking}
  Q.says = (ctx, who) => Q.talk(ctx, who);
  // first time any line of `who` starts in this scene (or Infinity)
  Q.lineOf = (ctx, who, n = 0) => { const ls = ctx.lines.filter(l => l.who === who); return ls[n] || { start: Infinity, end: Infinity }; };
  // series wordmark used at the end of each episode
  Q.wordmark = (k, y = 420) => `<g opacity="${E.f1(k)}"><text x="${E.W / 2}" y="${y}" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="60" letter-spacing="14" fill="#f4ead2" stroke="#0b0b0e" stroke-width="8" paint-order="stroke">THE QUIET GAME</text></g>`;
})();
