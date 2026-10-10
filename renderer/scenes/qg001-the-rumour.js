/* THE QUIET GAME #1 — The Rumour.
   Original 2D cast + office sets drawn as SVG. Deterministic in (t, seed).
   Part 1: shared look (palette, cast designs, character rig, props, sets, camera, subtitles).
   Part 2 (bottom): one function per storyboard scene. */
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
    for (const l of ctx.lines) {
      const a = l.start - 0.05, b = l.end + 0.3;
      if (t < a || t > b) continue;
      const { words, times } = wordTimes(l);
      let groups;
      if (l.caption.includes('|')) {   // explicit breaks written in the episode data: "Is he going | through Kemi's wallet?"
        groups = []; let i = 0;
        for (const part of l.caption.split('|')) { const n = part.split(/\s+/).filter(Boolean).length; if (n) groups.push([...Array(n).keys()].map(k => k + i)); i += n; }
      } else groups = chunkWords(words);
      let wi = 0; times.forEach((tm, i) => { if (t >= tm[0]) wi = i; });
      const g = groups.find(gr => gr.includes(wi)) || groups[0];
      const gStart = times[g[0]][0], pop = ease.back(seg(t, gStart - 0.02, gStart + 0.1));
      const op = 1 - seg(t, b - 0.12, b);
      const nar = l.who === 'narrator', col = nar ? '#ffd36b' : cast[l.who].color;
      const y = opts.y || 1380, fs = 80;
      s += `<g opacity="${f1(op)}" transform="translate(${W / 2} ${y}) scale(${f1(0.86 + 0.14 * pop)})">`;
      if (!nar) s += `<text x="0" y="-96" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" letter-spacing="6" fill="${col}" stroke="#0b0b0e" stroke-width="8" paint-order="stroke">${esc(cast[l.who].name.toUpperCase())}</text>`;
      s += `<text x="0" y="0" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="${fs}" stroke="#0b0b0e" stroke-width="14" stroke-linejoin="round" paint-order="stroke">` +
        g.map((i, k) => `<tspan fill="${i === wi && t <= l.end + 0.05 ? col : '#ffffff'}">${k ? ' ' : ''}${esc(words[i])}</tspan>`).join('') + `</text></g>`;
    }
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
  function rumourAt(ctx) {
    const scenes = ctx.ep.scenes; let cur = null, prev = null;
    for (let i = 0; i <= ctx.idx; i++) if (scenes[i].rumour) { prev = cur; cur = scenes[i].rumour; if (i === ctx.idx) break; }
    const own = ctx.scene.rumour;
    if (own) { const ln = ctx.lines[own.at_line || 0]; const at = ln ? ln.start + 0.15 : 0.2; return { r: ctx.t >= at ? own : prev, at, fresh: ctx.t >= at }; }
    return { r: cur, at: -9, fresh: false };
  }
  function rumourMeter(ctx) {
    if (ctx.scene.hud === false) return '';
    const { r, at, fresh } = rumourAt(ctx); const tr = ctx.scene.truth, t = ctx.t;
    const truthK = tr ? seg(t, tr.at, tr.at + 0.6) : 0;
    if (!r && !truthK) return '';
    const showTruth = truthK >= 0.5;
    const level = r ? r.level * (1 - truthK) : 0;
    const text = showTruth ? tr.text : r.text;
    const flash = fresh ? 1 - seg(t, at, at + 0.7) : 0;
    const lines = E.wrap(showTruth ? text : `“${text}”`, 28), fs = 44, h = 92 + lines.length * fs * 1.15;
    const col = showTruth ? '#6fe0a0' : '#ff6b5a';
    let s = `<g transform="translate(70 238)"><rect width="940" height="${f1(h)}" rx="26" fill="#0d0f12" opacity="0.8"/>`;
    s += `<rect width="940" height="${f1(h)}" rx="26" fill="none" stroke="${col}" stroke-width="${f1(3 + 6 * flash)}" opacity="${f1(0.5 + 0.5 * flash)}"/>`;
    s += `<text x="30" y="52" font-family="Nunito" font-weight="800" font-size="30" letter-spacing="6" fill="${col}">${showTruth ? 'THE TRUTH' : 'THE RUMOUR'}</text>`;
    for (let i = 0; i < 5; i++) {
      const fill = clamp(level - i, 0, 1), isNew = fresh && r && i === r.level - 1;
      const sc = isNew ? 1 + 0.35 * flash : 1, x = 330 + i * 120;
      s += `<g transform="translate(${x + 50} 40) scale(${f1(sc)})"><rect x="-50" y="-12" width="100" height="24" rx="12" fill="#2b2f36"/>${fill > 0 ? `<rect x="-50" y="-12" width="${f1(100 * fill)}" height="24" rx="12" fill="${['#ffb347', '#ff9447', '#ff7a47', '#ff5c47', '#ff3b3b'][i]}"/>` : ''}${isNew && flash > 0.3 ? `<rect x="-50" y="-12" width="100" height="24" rx="12" fill="#fff" opacity="${f1(flash - 0.3)}"/>` : ''}</g>`;
    }
    const textOp = showTruth ? seg(t, tr.at + 0.3, tr.at + 0.6) : 1;
    lines.forEach((ln, i) => { s += `<text x="30" y="${f1(110 + i * fs * 1.15)}" font-family="Nunito" font-weight="800" font-size="${fs}" fill="#ffffff" opacity="${f1(textOp)}">${esc(ln)}</text>`; });
    return s + '</g>';
  }
  // Who's who: a name tag the first time someone matters
  function nameTags(ctx) {
    let s = ''; const cast = ctx.ep.cast;
    for (const g of ctx.scene.tags || []) {
      const k = ease.back(seg(ctx.t, g.at, g.at + 0.25)), out = seg(ctx.t, g.at + 1.9, g.at + 2.2);
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
  function frame(ctx, body, grade, opts = {}) {
    return `<rect width="${W}" height="${H}" fill="#0c0d10"/>${defs()}${body}${finish(grade)}${opts.noClock ? '' : clockChip(ctx, opts)}${rumourMeter(ctx)}${nameTags(ctx)}${captions(ctx, opts)}${jumpCard(ctx)}`;
  }

  window.QG = { CAST, EX, ex, talk, blink, person, item, alive, setCam, layer, officeSet, breakSet, kitchenSet, phoneInsert, desk, partition, frame, sm, mix, punch, LINE };
})();

/* ---------------------------------------------------------------- Part 2: storyboard scenes */
(function () {
  const E = window.HW, Q = window.QG; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch } = Q;
  const LS = (ctx, i) => ctx.lines[i].start, LE = (ctx, i) => ctx.lines[i].end;
  const GRADE = {
    noon: { color: '#7fd6c0', op: 0.22 }, morning: { color: '#ffbf6a', op: 0.32 }, day: { color: '#a8c4d0', op: 0.18 },
    cold: { color: '#5d8fd6', op: 0.32 }, dusk: { color: '#3d5f8a', op: 0.42 },
  };
  const blurSet = (k, s) => `<g filter="url(#qgBlur${k})">${s}</g>`;
  function lunchTable(y, opts = {}) {
    return `<polygon points="-120,${y} 1200,${y} 1320,${y + 170} -240,${y + 170}" fill="#a77d55" stroke="${Q.LINE}" stroke-width="4"/><polygon points="-240,${y + 170} 1320,${y + 170} 1320,${y + 200} -240,${y + 200}" fill="#6c4d33"/>
      <path d="M-120 ${y + 40} L1200 ${y + 40}" stroke="#c49a6c" stroke-width="3" opacity="0.6"/>${opts.items || ''}`;
  }
  function chairBack(x, y, w = 280) {
    return `<rect x="${x - w / 2}" y="${y}" width="${w}" height="700" rx="40" fill="#363d42" stroke="${Q.LINE}" stroke-width="5"/><rect x="${x - w / 2 + 24}" y="${y + 24}" width="${w - 48}" height="200" rx="26" fill="#454e54"/>`;
  }

  E.registerScenes({
    // 1 — HOOK: the bag on the chair
    hook_lunch(ctx) {
      const { t } = ctx; const gt = ctx.gt;
      setCam(lerp(1.22, 1.4, sm(t, 0, 4.5)) + punch(t, 0.8, 0.09), 540, lerp(960, 880, sm(t, 0, 4.5)), gt);
      const fall = sm(t, 0.55, 1.3);
      let s = Q.breakSet(t);
      const thE = ex(ex('hopeful', 'unsure', fall), 'hurt', sm(t, LS(ctx, 1) - 0.2, LS(ctx, 1) + 0.6));
      s += layer(1, person('theo', { x: 540, y: 1080, s: 1.5, ...alive(t, 0.3), ex: thE, look: [lerp(0.15, -0.55, fall), lerp(0.55, 0.3, fall)], turn: lerp(0, -0.15, fall), arms: { l: [-15, 60], r: [-15, 60] }, armsFront: true, hold: { both: { kind: 'tray', dy: 10 } }, lit: 1 }) + lunchTable(1110));
      // foreground: Kemi (back), empty chair, Ben (back)
      const reach = Math.sin(Math.PI * seg(t, 0.25, 1.0));
      const bagK = ease.out(seg(t, 0.4, 0.8));
      let fg = Q.chairBack(540, 1270) ;
      fg += item('bag', lerp(330, 540, bagK), lerp(1180, 1215, bagK) - Math.sin(bagK * Math.PI) * 40, { s: 1.5, rot: lerp(-25, 4, bagK) });
      fg += person('kemi', { x: 165, y: 1720, s: 2.0, back: true, ...alive(t, 1.1), arms: { l: [6, 4], r: [mix(6, -62, reach), mix(4, -10, reach)] }, blur: 1, tilt: -3 });
      fg += person('ben', { x: 935, y: 1740, s: 2.05, back: true, ...alive(t, 2.2), arms: { l: [12, 120], r: [8, 4] }, blur: 1, nod: 2 });
      s += layer(1.15, fg);
      return Q.frame(ctx, s, GRADE.noon, { narSize: 70, y: 1430 });
    },

    // 2 — ORIGIN: the preview, the look, the comment
    origin_phone(ctx) {
      const { t } = ctx; const gt = ctx.gt;
      const cut = LS(ctx, 0) - 0.65;
      if (t < cut) {
        setCam(lerp(1.0, 1.1, sm(t, 0, cut)), 540, 820, gt);
        const buzz = (t > 0.5 && t < 0.85) || (t > 1.0 && t < 1.35) ? 1 : 0;
        return Q.frame(ctx, layer(1, Q.phoneInsert(ctx, t, { mode: 'preview', buzz })), GRADE.morning, { hold: true });
      }
      const tt = t - cut;
      setCam(lerp(1.02, 1.12, sm(tt, 0, 2.6)), 600, 960, gt);
      let s = Q.officeSet(t, { warm: 1 });
      // Theo arrives through the glass door, waving
      const wk = seg(tt, 0, 1.4), tx = lerp(1180, 900, ease.out(wk));
      s += layer(0.62, `<rect x="760" y="420" width="16" height="760" fill="#9fb5b8" opacity="0.6"/><rect x="1060" y="420" width="16" height="760" fill="#9fb5b8" opacity="0.6"/>` +
        person('theo', { x: tx, y: 1040, s: 0.78, legs: true, walk: wk < 1 ? tt * 9 : null, ...alive(t, 0.3), ex: 'warm', look: [-0.3, 0], turn: -0.3, arms: { l: [6, 4], r: [-150 + Math.sin(tt * 9) * 12, 25] }, lit: -1 }) +
        `<rect x="700" y="400" width="420" height="800" fill="#cfe3e6" opacity="0.10"/>`);
      const look = tt < 0.3 ? [0, 0.9] : [0.85, -0.55];
      const rosaE = ex('neutral', 'suspicious', sm(tt, 0.25, 0.55));
      const lean = -4 * sm(tt, 0.5, 0.7);
      s += layer(1, person('rosa', { x: 560, y: 1560, s: 2.15, ...alive(t, 0.7), ex: rosaE, look, turn: lerp(0.1, -0.3, sm(tt, 0.5, 0.75)), lean, glassesDown: 8 * sm(tt, 0.25, 0.55), mouth: talk(ctx, 'rosa'), arms: { l: [8, 4], r: [-6, 108] }, hold: { r: { kind: 'phone', lit: true, s: 1.1, rot: -25, dy: 20 } }, lit: -1 }));
      const benLook = tt > 2.0 ? [0.9, -0.3] : tt > 0.7 ? [0.9, 0] : [-0.6, 0.3];
      s += layer(1.05, person('ben', { x: 105, y: 1640, s: 2.15, ...alive(t, 2.0), ex: tt > 0.8 ? ex('neutral', 'curious', sm(tt, 0.8, 1.2)) : 'neutral', look: benLook, turn: lerp(-0.2, 0.75, sm(tt, 0.5, 0.8)), lit: -1 }));
      s += layer(1.2, `<rect x="-100" y="1510" width="1300" height="500" fill="#4e3a2c" stroke="${Q.LINE}" stroke-width="4"/><rect x="-100" y="1510" width="1300" height="26" fill="#8a6a4a"/>` + `<g filter="url(#qgBlur2)"><rect x="700" y="1230" width="420" height="280" rx="12" fill="#1a1d22"/><rect x="716" y="1246" width="388" height="248" fill="#8fc4e0" opacity="0.8"/></g>`);
      return Q.frame(ctx, s, GRADE.morning, { hold: true });
    },

    // 3 — the coffee machine: a guess gets added
    coffee_whisper(ctx) {
      const { t } = ctx; const gt = ctx.gt;
      setCam(lerp(1.0, 1.15, sm(t, 0, 3.9)) + punch(t, LS(ctx, 1), 0.06), lerp(540, 640, sm(t, 0, 3.9)), 960, gt);
      let s = Q.kitchenSet(t);
      const second = sm(t, LS(ctx, 1) - 0.1, LS(ctx, 1) + 0.4);
      s += layer(1, person('ben', { x: 330, y: 1540, s: 2.0, ...alive(t, 0.4), ex: ex('neutral', 'smug', 0.4), look: [0.8, 0.05], turn: 0.55, lean: 5, mouth: talk(ctx, 'ben'), arms: { l: [6, 4], r: [8, 128] }, hold: { r: { kind: 'mug', s: 0.9, dy: -16, color: '#3f7fb5' } }, lit: -1 }));
      s += layer(1, person('kemi', { x: 770, y: 1540, s: 1.95, ...alive(t, 1.7), ex: ex('curious', 'suspicious', second), look: second > 0.5 ? [1, -0.05] : [-0.8, 0.05], turn: lerp(-0.45, 0.05, second), arms: { l: [10, 125], r: [6, 4] }, hold: { l: { kind: 'mug', s: 0.9, dy: -16 } }, lit: -1 }));
      // steam
      let st = '';
      for (const [x, y] of [[440, 1230], [640, 1240]]) for (let i = 0; i < 3; i++) { const ph = (t * 0.6 + i / 3) % 1; st += `<path d="M${x + i * 10} ${f1(y - ph * 160)} q20 -30 0 -60 q-20 -30 0 -60" stroke="#fff" stroke-width="6" fill="none" opacity="${f1(0.25 * Math.sin(ph * Math.PI))}" stroke-linecap="round"/>`; }
      s += layer(1, st);
      s += layer(1.15, `<rect x="-200" y="1480" width="${W + 400}" height="600" fill="#2f2620"/><rect x="-200" y="1480" width="${W + 400}" height="30" fill="#8c7356" stroke="${Q.LINE}" stroke-width="4"/>`);
      return Q.frame(ctx, s, GRADE.morning);
    },

    // 4 — the guess becomes a fact; the pen
    kemi_spreads(ctx) {
      const { t } = ctx; const gt = ctx.gt;
      const p0 = LE(ctx, 1) + 0.05, pan = sm(t, p0, p0 + 0.6);
      setCam(lerp(1.05, 1.14, pan) + punch(t, LS(ctx, 1), 0.08) * (1 - pan), lerp(520, 760, pan), lerp(1020, 980, pan), gt);
      let s = Q.officeSet(t, { warm: 0.7 });
      // Theo in the background, happily taking a pen from the shared pot
      const take = seg(t, p0 + 0.3, p0 + 0.75), has = t > p0 + 0.62;
      s += layer(0.8, person('theo', { x: 1010, y: 1030, s: 0.85, ...alive(t, 0.3), ex: 'warm', look: has ? [-0.3, 0.6] : [0.5, 0.3], turn: 0.25, arms: { l: [10, 80], r: has ? [6, 120] : [mix(10, -45, Math.sin(Math.PI * take)), mix(80, 20, Math.sin(Math.PI * take))] }, hold: has ? { r: { kind: 'pen', rot: 30 } } : {}, lit: -1 }) +
        Q.desk(860, 960, 400, { h: 400, mx: 280, mw: 160, pot: 110, monitor: true }));
      const turnTo = sm(t, p0 + 0.2, p0 + 0.55);
      s += layer(1, person('kemi', { x: 430, y: 1400, s: 1.75, ...alive(t, 1.2), ex: turnTo > 0.5 ? 'suspicious' : ex('smug', 'suspicious', sm(t, 1.2, 1.6)), look: turnTo > 0.4 ? [1, 0] : [-0.3, 0.5], turn: lerp(-0.15, 0.6, turnTo), lean: lerp(8, 2, turnTo), mouth: talk(ctx, 'kemi'), arms: { l: [-5, 85], r: [-5, 85] }, armsFront: true, lit: -1 }));
      s += layer(1.05, Q.partition(-60, 1250, 1200, 700));
      const react = sm(t, LS(ctx, 1), LS(ctx, 1) + 0.35);
      s += layer(1.2, person('jo', { x: 170, y: 1890, s: 2.1, back: true, ...alive(t, 0.1), tilt: lerp(-4, 9, turnTo) - 4 * react, blur: 1 }) + person('sam', { x: 905, y: 1910, s: 2.1, back: true, ...alive(t, 0.9), tilt: lerp(5, 12, turnTo) + 3 * react, blur: 1 }));
      return Q.frame(ctx, s, GRADE.day);
    },

    // 5 — the wallet
    wallet(ctx) {
      const { t } = ctx; const gt = ctx.gt;
      if (t < 0.9) {
        setCam(1.08 + punch(t, 0.52, 0.06), 560, 1080, gt);
        let s = Q.officeSet(t, { warm: 0.6 });
        const down = t > 0.6;
        s += layer(1, person('theo', { x: 640, y: 1400, s: 1.75, ...alive(t, 0.3), ex: down ? 'curious' : 'neutral', look: down ? [-0.5, 1] : [0.2, 0.4], turn: down ? -0.2 : 0.1, arms: { l: [-8, 70 + Math.sin(t * 20) * 4], r: [-8, 70 + Math.cos(t * 23) * 4] }, armsFront: true, lit: -1 }) + Q.desk(260, 1300, 760, { h: 340, mx: 560, mw: 220 }));
        const kx = lerp(-260, 1360, t / 0.95);
        const wk = seg(t, 0.32, 0.52);
        s += layer(1.15, (t > 0.32 ? item('wallet', lerp(380, 440, wk), lerp(1480, 1770, ease.in(wk)), { s: 2.3, rot: lerp(-30, 8, wk) }) : '') +
          person('kemi', { x: kx, y: 2000, s: 2.6, walk: t * 8, legs: true, back: true, arms: { l: [-8, 6], r: [6, 4] }, hold: { l: { kind: 'bag', s: 0.9, dy: 40 } }, blur: 2 }));
        return Q.frame(ctx, s, GRADE.day);
      }
      if (t < LS(ctx, 0)) {
        const tt = t - 0.9;
        setCam(lerp(1.0, 1.06, tt), 540, 900, gt);
        let s = blurSet(2, Q.officeSet(t, { warm: 0.6 }));
        s += layer(1, person('theo', { x: 540, y: 1560, s: 2.5, ...alive(t, 0.3), ex: { b: [0.6, 0.4], smile: -0.1, lid: 0.25, squint: 0 }, look: [0.2, 0.85], turn: 0.1, nod: 3, arms: { l: [-15, 108], r: [-15, 108] }, armsFront: true, hold: { both: { kind: 'wallet', open: true, notes: true, s: 1.5, dy: 30 } }, lit: -1 }));
        return Q.frame(ctx, s, GRADE.day);
      }
      const tt = t - LS(ctx, 0);
      setCam(lerp(1.0, 1.1, sm(tt, 0, 2.0)) + punch(tt, 0, 0.08), 560, 960, gt);
      let s = blurSet(1, Q.officeSet(t, { warm: 0.5 }) + layer(0.7, person('theo', { x: 300, y: 1090, s: 0.95, ...alive(t, 0.3), ex: 'curious', look: [0.2, 0.9], turn: 0.1, nod: 3, arms: { l: [-15, 108], r: [-15, 108] }, armsFront: true, hold: { both: { kind: 'wallet', open: true, notes: true, s: 1.4, dy: 30 } } })));
      s += layer(1, person('ben', { x: 600, y: 1590, s: 2.3, ...alive(t, 2.0), ex: ex('curious', 'suspicious', sm(tt, 0, 0.6)), look: [-0.95, 0.15], turn: -0.3, mouth: talk(ctx, 'ben'), lit: 1 }));
      s += layer(1.1, `<rect x="120" y="1110" width="960" height="900" rx="24" fill="#202328" stroke="${Q.LINE}" stroke-width="6"/><rect x="560" y="1250" width="80" height="30" rx="6" fill="#33373e"/><circle cx="1040" cy="1150" r="6" fill="#59e08a"/>`);
      return Q.frame(ctx, s, GRADE.day);
    },

    // 6 — handing it back
    return_wallet(ctx) {
      const { t } = ctx; const gt = ctx.gt;
      const g = LE(ctx, 0) + 0.05;
      setCam(lerp(1.0, 1.12, sm(t, 0, 3.6)) + punch(t, g + 0.45, 0.06), 560, lerp(1060, 980, sm(t, 0, 3.6)), gt);
      let s = Q.officeSet(t, { warm: 0.45, wall: '#30424a' });
      s += layer(0.85, Q.desk(760, 1150, 520, { h: 500, mx: 360, mw: 200, plant: 80 }));
      const give = t < g, grab = sm(t, g - 0.1, g + 0.1), back = sm(t, g + 0.1, g + 0.45);
      const theoArmR = give ? [mix(6, -48, sm(t, 0, 0.35)), mix(4, -6, sm(t, 0, 0.35))] : [mix(-48, 6, sm(t, g, g + 0.4)), mix(-6, 4, sm(t, g, g + 0.4))];
      const theoE = t < g + 0.3 ? 'warm' : t < LS(ctx, 1) + 0.3 ? ex('warm', 'unsure', sm(t, g + 0.3, g + 0.9)) : ex('unsure', 'hurt', sm(t, LS(ctx, 1) + 0.3, LS(ctx, 1) + 0.8));
      const shrug = Math.sin(Math.PI * seg(t, LS(ctx, 1) - 0.1, LE(ctx, 1) + 0.1));
      const counting = t > g + 0.45;
      const kArms = counting ? { l: [-20, 100], r: [-20, 100] } : { l: [mix(6, -40, grab) * (1 - back) + 6 * back, mix(4, -8, grab) * (1 - back) + 4 * back], r: [6, 4] };
      const hold = counting ? { both: { kind: 'wallet', open: true, notes: true, fan: Math.abs(Math.sin(t * 7)), s: 1.15, dy: 10 } } : (t > g ? { l: { kind: 'wallet', s: 1.1 } } : {});
      s += layer(1, person('kemi', { x: 800, y: 1330, s: 1.85, legs: true, ...alive(t, 1.2), ex: t < g - 0.1 ? ex('neutral', 'suspicious', sm(t, 0.3, 0.9)) : 'suspicious', look: counting && Math.sin(t * 3) > 0.6 ? [-0.2, 0.7] : [-0.85, 0.05], turn: -0.5, arms: kArms, armsFront: counting, hold, lit: -1 }));
      s += layer(1, person('theo', { x: 290, y: 1330, s: 1.85, legs: true, ...alive(t, 0.3), ex: theoE, look: t > LE(ctx, 1) + 0.15 ? [-0.5, 0.5] : [0.8, 0.05], turn: t > LE(ctx, 1) + 0.15 ? lerp(0.5, -0.2, sm(t, LE(ctx, 1) + 0.15, LE(ctx, 1) + 0.5)) : 0.5, mouth: talk(ctx, 'theo'), shrug, arms: { l: [6, 4], r: theoArmR }, hold: t < g ? { r: { kind: 'wallet', s: 1.1, dy: 4 } } : {}, lit: -1 }));
      return Q.frame(ctx, s, GRADE.day);
    },

    // 7 — he snaps, and that becomes the proof
    lunch_snap(ctx) {
      const { t } = ctx; const gt = ctx.gt;
      const slam = LE(ctx, 0) + 0.06, rev = slam + 0.33;
      if (t < rev) {
        const shake = t > slam ? 11 * (1 - seg(t, slam, rev)) : 0;
        setCam(lerp(1.22, 1.34, sm(t, 0, slam)) + punch(t, slam, 0.1), 540, 820, gt, shake);
        let s = Q.breakSet(t);
        const dropped = t > slam; const dk = ease.in(seg(t, slam - 0.04, slam + 0.06));
        const angry = { b: [-0.7, 0.5], smile: -0.6, lid: 0.05, squint: 0.15 };
        const thE = t < 0.5 ? 'hurt' : ex('hurt', angry, sm(t, 0.5, 0.9));
        s += layer(1, person('theo', { x: 540, y: 1080, s: 1.5, ...alive(t, 0.3), ex: thE, look: t < 0.45 ? [0.2, 0.8] : [-0.35, 0.35], turn: -0.12, mouth: talk(ctx, 'theo'), lean: dropped ? 0 : -2, arms: dropped ? { l: [mix(-15, 6, seg(t, slam, slam + 0.28)), mix(60, 4, seg(t, slam, slam + 0.28))], r: [mix(-15, 6, seg(t, slam, slam + 0.28)), mix(60, 4, seg(t, slam, slam + 0.28))] } : { l: [-15, 60], r: [-15, 60] }, armsFront: true, hold: dropped ? {} : { both: { kind: 'tray', dy: 10 + dk * 40 } }, lit: 1 }) +
          lunchTable(1110, { items: dropped ? item('tray', 540, 1135, { s: 1.5, rot: 4 }) : '' }));
        s += layer(1.15, Q.chairBack(540, 1270) + item('bag', 540, 1215, { s: 1.5, rot: 4 }) + person('kemi', { x: 165, y: 1720, s: 2.0, back: true, ...alive(t, 1.1), blur: 1, tilt: dropped ? 6 : -3 }) + person('ben', { x: 935, y: 1740, s: 2.05, back: true, ...alive(t, 2.2), blur: 1, tilt: dropped ? -6 : 2 }));
        return Q.frame(ctx, s, GRADE.noon, { noClock: false, y: 1430 });
      }
      const tt = t - rev, k0 = LS(ctx, 1) - rev;
      setCam(lerp(1.05, 1.13, sm(tt, 0, 2.0)) + punch(tt, k0, 0.06), 700, 930, gt);
      let s = Q.breakSet(t);
      const lean = sm(tt, k0 - 0.3, k0 - 0.05);
      s += layer(1, person('kemi', { x: 570, y: 1400, s: 1.7, ...alive(t, 1.1), ex: ex('suspicious', 'smug', lean), look: tt < k0 - 0.05 ? [-0.8, 0] : [0.7, 0.05], turn: lerp(-0.2, 0.55, lean), lean: 8 * lean, mouth: talk(ctx, 'kemi'), lit: -1 }));
      const n0 = k0 + 0.6; const nod = Math.max(0, Math.sin((tt - n0) * 7)) * sm(tt, n0, n0 + 0.2) * (1 - sm(tt, n0 + 1.0, n0 + 1.3));
      s += layer(1, person('ben', { x: 860, y: 1410, s: 1.75, ...alive(t, 2.2), ex: 'suspicious', look: [-0.85, 0], turn: -0.35, nod: nod * 2.5, lit: -1 }));
      s += layer(1.05, `<rect x="-200" y="1360" width="${W + 400}" height="700" fill="#8a6644" stroke="${Q.LINE}" stroke-width="4"/>` + item('tray', 600, 1430, { s: 1.4, rot: -3 }) + item('mug', 880, 1430, { s: 1.4, color: '#3f7fb5' }));
      s += layer(1.3, person('theo', { x: 80, y: 2120, s: 2.7, back: true, ...alive(t, 0.3), blur: 2 }));
      return Q.frame(ctx, s, GRADE.noon, { y: 1250 });
    },

    // 8 — the reveal
    reveal_phone(ctx) {
      const { t } = ctx; const gt = ctx.gt;
      const ins = LS(ctx, 0) - 0.1;
      if (t < 0.8) {
        setCam(1.05, 540, 980, gt);
        let s = Q.breakSet(t);
        s += layer(0.8, `<rect x="270" y="380" width="540" height="1600" fill="#1c2a2c" stroke="#222" stroke-width="10"/><rect x="250" y="360" width="580" height="30" fill="#5a6a66"/>`);
        const lift = sm(t, 0.15, 0.6);
        s += layer(1, person('rosa', { x: 540, y: 1520, s: 2.0, ...alive(t, 0.7), ex: 'neutral', look: lift > 0.5 ? [0, 0.9] : [0.3, 0], arms: { l: [6, 4], r: [mix(6, -6, lift), mix(4, 108, lift)] }, hold: { r: { kind: 'phone', lit: true, s: 1.1, rot: -25, dy: 20 } }, lit: 1 }));
        return Q.frame(ctx, s, GRADE.cold);
      }
      if (t < ins) {
        setCam(lerp(1.0, 1.12, sm(t, 0.8, ins)) + punch(t, 1.55, 0.07), 540, 780, gt);
        return Q.frame(ctx, layer(1, Q.phoneInsert(ctx, t, { mode: 'full', revealAt: 1.05, desk: '#26303a' })), GRADE.cold, { noClock: true });
      }
      const tt = t - ins;
      setCam(lerp(1.0, 1.12, sm(tt, 0, 2.6)), 540, 960, gt);
      let s = blurSet(2, Q.breakSet(t));
      const rE = tt < 0.1 ? 'neutral' : tt < 0.9 ? 'shocked' : ex('shocked', 'guilty', sm(tt, 0.9, 1.4));
      s += layer(1, person('rosa', { x: 540, y: 1840, s: 2.9, ...alive(t, 0.7), blink: 0, ex: rE, look: tt > 1.0 ? [0.9, 0.15] : [0, 0.6], turn: lerp(0, 0.15, sm(tt, 1.0, 1.4)), mouth: talk(ctx, 'rosa'), glare: 0.5, lit: 1 }));
      s += layer(1, `<ellipse cx="540" cy="1250" rx="420" ry="300" fill="url(#qgGlow)" style="mix-blend-mode:screen"/>`);
      return Q.frame(ctx, s, GRADE.cold, { noClock: true });
    },

    // 9 — alone
    end_alone(ctx) {
      const { t } = ctx; const gt = ctx.gt;
      setCam(lerp(1.3, 1.0, sm(t, 0, 5.6)), 540, lerp(980, 940, sm(t, 0, 5.6)), gt);
      let s = Q.breakSet(t, { wall: '#34433f' });
      // the others, in shadow, carrying on
      const chat = k => Math.max(0, Math.sin(t * 8 + k)) * 0.5;
      let grp = person('jo', { x: 60, y: 1120, s: 0.8, ...alive(t, 0.1), ex: 'warm', look: [0.6, 0], turn: 0.5, mouth: chat(0), lit: 1 }) + person('kemi', { x: 200, y: 1125, s: 0.82, ...alive(t, 1.1), ex: 'warm', look: [-0.6, 0], turn: -0.3, mouth: chat(2), lit: 1 }) + person('ben', { x: 340, y: 1130, s: 0.85, ...alive(t, 2.2), ex: 'warm', look: [-0.7, 0], turn: -0.5, lit: 1 });
      grp += `<ellipse cx="200" cy="1150" rx="230" ry="44" fill="#6c5038" stroke="${Q.LINE}" stroke-width="3"/>`;
      s += layer(0.85, `<g opacity="0.8">${grp}</g><rect x="-200" y="600" width="660" height="800" fill="#0c1216" opacity="0.38"/>`);
      s += layer(0.85, `<rect x="830" y="560" width="230" height="700" fill="#1c2a2c"/>` + person('rosa', { x: 945, y: 1110, s: 0.8, ...alive(t, 0.7), ex: 'guilty', look: [-0.9, 0.2], turn: -0.4, lit: -1 }));
      // Theo alone in a pool of light
      s += layer(1, `<ellipse cx="560" cy="1180" rx="420" ry="260" fill="url(#qgPool)" style="mix-blend-mode:screen"/>` +
        person('theo', { x: 560, y: 1290, s: 1.05, ...alive(t, 0.3), ex: { b: [0.9, -0.4], smile: -0.35, lid: 0.5, squint: 0 }, look: [0, 0.9], nod: 4, arms: { l: [-12, 70], r: [-12, 70] }, armsFront: true, lit: 1 }) +
        `<ellipse cx="560" cy="1310" rx="250" ry="52" fill="#a77d55" stroke="${Q.LINE}" stroke-width="4"/><rect x="545" y="1350" width="30" height="230" fill="#4a3a2c"/>` + item('tray', 560, 1290, { s: 0.95 }));
      // series mark after the last line
      const k = sm(t, LE(ctx, 1) + 0.1, LE(ctx, 1) + 0.6);
      s += `<g opacity="${f1(k)}"><text x="${W / 2}" y="420" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="60" letter-spacing="14" fill="#f4ead2" stroke="#0b0b0e" stroke-width="8" paint-order="stroke">THE QUIET GAME</text></g>`;
      return Q.frame(ctx, s, GRADE.dusk, { noClock: true, y: 1500, narSize: 68 });
    },
  });
  // expose small helpers for future episodes
  Object.assign(Q, { lunchTable, chairBack });
})();
