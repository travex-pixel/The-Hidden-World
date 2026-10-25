/* Case File 101 (premium look, ENGINE V10 "ONE SMUGGLER": one case, one person; beats hook -> gotcha -> person ->
   consequence -> callback; the half-reveal opening and the making-verb hook from v9; the loop to frame 1).
   THE HIDDEN WORLD · CASE FILE 101. Lane: customs (an airport check). The id keeps "soap-grandad" (the brief created the
   folder); the case is Ronald Lord's (research.md section A), not the soap case (its charge was dropped).
   THE CASE: London Gatwick, 7 February 2025, off a flight from Barbados: Border Force X-rayed the mobility scooter of
   Ronald Lord, 71, of Montreal, and found about 8 kg of cocaine in a void behind the seat-back panel. He said he'd had a
   week's holiday in Barbados (the airline: three days) and that he had no idea how the drugs got in (the screw from the
   seat panel was in his pocket). He pleaded guilty and was jailed for six years at Croydon Crown Court (Sept 2025).
   Structure: frame 0 = THE HALF-REVEAL: close, from behind, on the glossy red rear shell of a mobility-scooter seat back
   in a Border Force search bay (the tiller's handlebar above it, the armrests, the rear body and wheels below); two blue
   gloved hands from the sides: the left backs a screw out of the top-left corner with a screwdriver (the screw
   half out, its head turning), the right prises up the top-right corner, which has NO screw (an empty hole: the callback),
   showing a dark wedge inside; the camera already pushing in; an officer behind at the right reads. On line 2 the
   corner lifts further and a pale edge glints in the dark. GOTCHA (a tighter cut): on "Border Force" an X-ray band sweeps
   the shell and shows the blocks through it; on "X-rayed" the panel comes away on six wrapped blocks (the single impact).
   PERSON: an interview room (his silhouette seated at the desk; the officer reads his travel record); the evidence
   close-up (our own typed travel record: "HIS STORY: 7 DAYS" struck through, "AIRLINE CHECKS: 3 DAYS" circled).
   CONSEQUENCE: the interview room closer (he shakes his head; the NCA fun fact); a crown court (his silhouette in the
   dock; the 6 YEARS counter). CALLBACK on frame 1's set: the panel goes back over the blocks, the empty screw hole is
   circled ("THE SCREW FROM THIS PANEL / found in his pocket"), and the hands and camera return to frame 1's start.
   Smoothness: cuts and dissolves, one zoom (the end), no push, no shake; one slow camera move per shot.
   Look: one restrained palette (shadow #141c26, mid #b6b0a4, accent #e8a33a); the saturated thing is the scooter's red
   shell, then the pale wrapped blocks.
   Content rules: Ronald Lord pleaded guilty and is widely named, so he is named, but drawn ONLY as a dark rim-lit
   silhouette (NOT A LIKENESS), seated or in the dock; nothing implies he does not need the scooter, and the scooter itself
   is never the joke. The officers and the judge are generic figures with no badge, patch, crest, flag or insignia; no
   weapon. The scooter is generic (colour and model not reported); the blocks are plain wrapped packages; no airline,
   airport sign, livery, logo or real document is copied.
   New environments (E.registerSets): sg101_bay (a search bay), sg101_room (an interview room), sg101_records (a records
   desk). The court uses the engine's courtroom set. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES · GENERIC SCOOTER';
  const TAG_SIL = 'ILLUSTRATION · SILHOUETTE · NOT A LIKENESS';
  const ACC = '#e8a33a', GLOW = '#fff1d6';
  const RED = '#c8342a', RED_D = '#7e1a14', RED_L = '#ec6a54', RED_E = '#561009';
  const UPH = '#2a2c31', UPH_L = '#3d4048', UPH_D = '#1b1c20';
  const PK = '#ece5d2', PK_S = '#bdb39a', PK_H = '#fffaf0', TP = '#d9a548', TP_D = '#a8782c';
  const STEEL = '#c9ced4', STEEL_D = '#7d858e', STEEL_L = '#f2f5f8';
  const GLOVE = '#5b90d8', GLOVE_D = '#3a67ad', GLOVE_L = '#a6c8f2', SLEEVE = '#1f2630';
  const XR = '#7fe8ff';
  const rad = d => d * Math.PI / 180;
  const P = (x, y) => `${f1(x)} ${f1(y)}`;

  // ---------- hands (as Case Files 97/98)
  function glove(x, y, s, dir, rot) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(dir * s)} ${sc(s)})">` +
      `<path d="M-58 -40 Q-8 -64 42 -46 Q76 -30 74 6 Q70 42 32 48 Q-18 56 -58 36 Z" fill="${GLOVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M22 -42 Q38 2 24 46 M46 -34 Q60 4 50 40" stroke="${GLOVE_D}" stroke-width="4" fill="none"/>` +
      `<path d="M-30 -42 Q22 -82 62 -54 Q70 -42 54 -36 Q16 -52 -18 -26 Z" fill="${GLOVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-40 -30 Q-8 -46 22 -42" stroke="${GLOVE_L}" stroke-width="7" fill="none" opacity="0.75" stroke-linecap="round"/>` +
      `<path d="M-56 -40 L-112 -50 L-122 46 L-56 36 Z" fill="${GLOVE_D}" stroke="${INK}" stroke-width="5"/></g>`;
  }
  function sleeve(x0, y0, x1, y1, w0, w1) {
    const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a), mx = (x0 + x1) / 2, my = (y0 + y1) / 2, wm = (w0 + w1) / 2 * 1.08;
    const Q = (x, y, w, sgn) => [x + nx * w / 2 * sgn, y + ny * w / 2 * sgn];
    const [a1, a2] = [Q(x0, y0, w0, 1), Q(x0, y0, w0, -1)], [b1, b2] = [Q(x1, y1, w1, 1), Q(x1, y1, w1, -1)], [m1, m2] = [Q(mx, my, wm, 1), Q(mx, my, wm, -1)];
    const c1 = [x1 - Math.cos(a) * 26, y1 - Math.sin(a) * 26], [k1, k2] = [Q(c1[0], c1[1], w1 * 1.04, 1), Q(c1[0], c1[1], w1 * 1.04, -1)];
    return `<path d="M${P(a1[0], a1[1])} Q${P(m1[0], m1[1])} ${P(b1[0], b1[1])} L${P(b2[0], b2[1])} Q${P(m2[0], m2[1])} ${P(a2[0], a2[1])} Z" fill="${SLEEVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M${P(lerp(a1[0], b1[0], 0.15), lerp(a1[1], b1[1], 0.15))} Q${P(lerp(m1[0], mx, 0.4), lerp(m1[1], my, 0.4))} ${P(lerp(a1[0], b1[0], 0.85), lerp(a1[1], b1[1], 0.85))}" stroke="#36404c" stroke-width="9" fill="none" opacity="0.7" stroke-linecap="round"/>` +
      `<path d="M${P(k1[0], k1[1])} L${P(b1[0], b1[1])} L${P(b2[0], b2[1])} L${P(k2[0], k2[1])} Z" fill="#2c3440" stroke="${INK}" stroke-width="4"/>`;
  }
  function hand(x, y, ang, s, ox, oy, sw = 150) {
    const a = rad(ang), wx = x - Math.cos(a) * 96 * s, wy = y - Math.sin(a) * 96 * s;
    return sleeve(ox, oy, wx, wy, sw, sw * 0.62) + glove(x, y, s, 1, ang);
  }

  // ---------- the scooter, seen from behind (local frame: the seat-back shell's centre at the origin)
  const PX0 = -270, PX1 = 270, PY0 = -330, PY1 = 290;              // the removable rear panel at rest
  const SCREWS = { tl: [-222, -282], tr: [222, -282], bl: [-222, 242], br: [222, 242] };
  // the panel's peel: the top-right corner (the one with NO screw) lifts toward the camera; u 0..1
  function warp(u) {
    const TL = [PX0, PY0], TR = [PX1 - 92 * u, PY0 + 108 * u], BR = [PX1, PY1], BL = [PX0, PY1];
    return (x, y) => { const s = (x - PX0) / (PX1 - PX0), v = (y - PY0) / (PY1 - PY0);
      const tx = lerp(TL[0], TR[0], s), ty = lerp(TL[1], TR[1], s), bx = lerp(BL[0], BR[0], s), by = lerp(BL[1], BR[1], s);
      return [lerp(tx, bx, v), lerp(ty, by, v)]; };
  }
  // a rounded rectangle as points (for warping)
  function rrect(x0, y0, x1, y1, r, n = 5) {
    const pts = [], C = [[x1 - r, y0 + r, -90], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180]];
    for (const [cx, cy, a0] of C) for (let i = 0; i <= n; i++) { const a = rad(a0 + 90 * i / n); pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    return pts;
  }
  const poly = (pts, m) => 'M' + pts.map(([x, y]) => { const q = m ? m(x, y) : [x, y]; return P(q[0], q[1]); }).join(' L') + ' Z';

  // the six wrapped blocks in the void (local frame), lit 0..1
  function blocks(lit) {
    let g = '';
    const r = R(10101);
    for (let row = 0; row < 3; row++) for (let col = 0; col < 2; col++) {
      const x = -238 + col * 242, y = -300 + row * 190, w = 232, h = 178, j = (r() - 0.5) * 6;
      g += `<g transform="rotate(${f1(j)} ${x + w / 2} ${y + h / 2})">` +
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${PK}" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M${x + 10} ${y + 20} Q${x + w / 2} ${y + 6} ${x + w - 12} ${y + 22}" stroke="${PK_H}" stroke-width="8" fill="none" opacity="0.8" stroke-linecap="round"/>` +
        `<path d="M${x + 6} ${y + h - 18} L${x + w - 6} ${y + h - 14}" stroke="${PK_S}" stroke-width="10" opacity="0.7"/>` +
        `<rect x="${x + w * 0.38}" y="${y - 2}" width="${w * 0.2}" height="${h + 4}" fill="${TP}" stroke="${TP_D}" stroke-width="3" opacity="0.92"/>` +
        `<rect x="${x - 2}" y="${y + h * 0.42}" width="${w + 4}" height="${h * 0.16}" fill="${TP}" stroke="${TP_D}" stroke-width="3" opacity="0.92"/></g>`;
    }
    if (lit > 0) g += wash(0, -20, 300, 330, '#ffffff', f1(0.28 * lit));
    return g;
  }
  // a screw: head at (x, y); out 0..1 = how far the shank stands out (drawn toward the lower left, the camera side);
  // ang = the slot's angle
  function screw(x, y, out, ang) {
    const dx = -30 * out, dy = 34 * out;
    let g = `<circle cx="${f1(x)}" cy="${f1(y)}" r="17" fill="#120d0b"/><circle cx="${f1(x)}" cy="${f1(y)}" r="22" fill="none" stroke="${RED_E}" stroke-width="5"/>`;
    if (out > 0.02) {
      const hx = x + dx, hy = y + dy, n = Math.max(2, Math.round(7 * out));
      g += `<path d="M${P(x - 8, y - 4)} L${P(hx - 8, hy - 4)} L${P(hx + 8, hy + 4)} L${P(x + 8, y + 4)} Z" fill="${STEEL_D}" stroke="${INK}" stroke-width="3"/>`;
      for (let i = 1; i < n; i++) { const k = i / n; g += `<path d="M${P(lerp(x, hx, k) - 9, lerp(y, hy, k) - 3)} L${P(lerp(x, hx, k) + 9, lerp(y, hy, k) + 5)}" stroke="${STEEL_L}" stroke-width="2.5" opacity="0.8"/>`; }
      g += `<circle cx="${f1(hx)}" cy="${f1(hy)}" r="21" fill="${STEEL}" stroke="${INK}" stroke-width="4"/><circle cx="${f1(hx - 6)}" cy="${f1(hy - 6)}" r="8" fill="${STEEL_L}" opacity="0.8"/>` +
        `<path d="M${P(hx - Math.cos(rad(ang)) * 15, hy - Math.sin(rad(ang)) * 15)} L${P(hx + Math.cos(rad(ang)) * 15, hy + Math.sin(rad(ang)) * 15)}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    } else {
      g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="20" fill="${STEEL}" stroke="${INK}" stroke-width="4"/><path d="M${P(x - 12, y)} L${P(x + 12, y)} M${P(x, y - 12)} L${P(x, y + 12)}" stroke="${INK}" stroke-width="4"/>`;
    }
    return g;
  }
  const holeEmpty = (x, y) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="19" fill="#070505"/><circle cx="${f1(x)}" cy="${f1(y)}" r="23" fill="none" stroke="${RED_E}" stroke-width="6"/><path d="M${P(x - 14, y + 10)} Q${P(x, y + 20)} ${P(x + 14, y + 10)}" stroke="${RED_L}" stroke-width="3" fill="none" opacity="0.6"/>`;

  // the scooter behind and around the panel (the tiller, upholstery, armrests, seat base, rear body, wheels)
  function scooterBody() {
    let g = '';
    g += `<ellipse cx="0" cy="890" rx="520" ry="46" fill="#000" opacity="0.4"/>`;
    // rear wheels
    [-1, 1].forEach(s => { g += `<rect x="${s > 0 ? 300 : -420}" y="600" width="120" height="290" rx="50" fill="#141518" stroke="${INK}" stroke-width="6"/><rect x="${s > 0 ? 322 : -398}" y="640" width="76" height="210" rx="34" fill="#25272b"/><ellipse cx="${s * 360}" cy="745" rx="22" ry="50" fill="#6c727a" stroke="${INK}" stroke-width="3"/>`; });
    // the rear body shell (red, with a dark bumper and two small reflectors)
    g += `<defs><linearGradient id="sg101rb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${RED_L}"/><stop offset="0.35" stop-color="${RED}"/><stop offset="1" stop-color="${RED_D}"/></linearGradient></defs>`;
    g += `<path d="M-370 560 Q-360 500 -260 494 L260 494 Q360 500 370 560 L380 770 Q380 800 340 804 L-340 804 Q-380 800 -380 770 Z" fill="url(#sg101rb)" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M-300 530 Q0 512 300 530" stroke="#ffb2a0" stroke-width="10" fill="none" opacity="0.5" stroke-linecap="round"/>`;
    g += `<rect x="-372" y="740" width="744" height="56" rx="20" fill="#1c1d21" stroke="${INK}" stroke-width="5"/>`;
    [-1, 1].forEach(s => { g += `<rect x="${s * 250 - 40}" y="604" width="80" height="34" rx="12" fill="#e24a2a" stroke="${INK}" stroke-width="4"/><rect x="${s * 250 - 30}" y="610" width="36" height="10" rx="5" fill="#ffc2a8" opacity="0.8"/>`; });
    // the seat's swivel post
    g += `<rect x="-46" y="380" width="92" height="130" fill="#4a4f56" stroke="${INK}" stroke-width="5"/><rect x="-46" y="400" width="92" height="16" fill="#5e646c"/>`;
    g += `<path d="M46 430 L140 470" stroke="#2a2d32" stroke-width="12" stroke-linecap="round"/><circle cx="146" cy="472" r="14" fill="#1a1b1e" stroke="${INK}" stroke-width="3"/>`;
    // the tiller behind the seat: the stem and the handlebar with grips
    g += `<rect x="-20" y="-540" width="40" height="200" fill="#3a3f46" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="-178" y="-566" width="356" height="38" rx="18" fill="#2c3036" stroke="${INK}" stroke-width="5"/>`;
    [-1, 1].forEach(s => { g += `<rect x="${s > 0 ? 150 : -214}" y="-574" width="64" height="54" rx="22" fill="#141518" stroke="${INK}" stroke-width="5"/>`; });
    g += `<path d="M-150 -556 L150 -556" stroke="#6a717a" stroke-width="6" opacity="0.6"/>`;
    // the seat base (the back edge of the cushion) and the armrests
    g += `<rect x="-350" y="296" width="700" height="96" rx="40" fill="${UPH}" stroke="${INK}" stroke-width="6"/><path d="M-310 316 Q0 304 310 316" stroke="${UPH_L}" stroke-width="10" fill="none" opacity="0.7" stroke-linecap="round"/>`;
    [-1, 1].forEach(s => { const x0 = s > 0 ? 290 : -440;
      g += `<path d="M${s * 340} -20 L${s * 350} 300" stroke="#2c3036" stroke-width="22"/>` +
        `<rect x="${x0}" y="-86" width="150" height="70" rx="30" fill="${UPH}" stroke="${INK}" stroke-width="6"/><path d="M${x0 + 18} -70 L${x0 + 132} -70" stroke="${UPH_L}" stroke-width="8" opacity="0.7" stroke-linecap="round"/>`; });
    // the upholstered seat back behind the shell (its rolled top shows above it)
    g += `<path d="M-312 -330 Q-318 -432 -200 -446 Q0 -462 200 -446 Q318 -432 312 -330 L316 300 L-316 300 Z" fill="${UPH}" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M-250 -420 Q0 -446 250 -420" stroke="${UPH_L}" stroke-width="14" fill="none" opacity="0.75" stroke-linecap="round"/>`;
    g += `<path d="M-286 -360 Q0 -380 286 -360" stroke="${UPH_D}" stroke-width="4" stroke-dasharray="10 9" fill="none"/>`;
    return g;
  }
  // the whole hero. u = the corner's lift, w = the panel taken off, lit = the blocks lit, xr = the X-ray sweep 0..1 (or
  // <0 / >1 when off), so = the top-left screw's travel out, ang = its slot angle, glint = a pale edge in the gap 0..1
  const HERO = { x: 540, y: 1020 };
  function hero(st, t, id) {
    const u = clamp(st.u, 0, 1), w = clamp(st.w, 0, 1), lit = clamp(st.lit || 0, 0, 1);
    const m = warp(u);
    let g = scooterBody();
    // the void (the hole in the shell) with the blocks, in darkness until the panel comes away
    g += `<rect x="${PX0 + 8}" y="${PY0 + 8}" width="${PX1 - PX0 - 16}" height="${PY1 - PY0 - 16}" rx="30" fill="#07080a" stroke="${RED_E}" stroke-width="8"/>`;
    g += blocks(lit);
    const dark = 1 - w;
    if (dark > 0.01) {
      g += `<rect x="${PX0 + 8}" y="${PY0 + 8}" width="${PX1 - PX0 - 16}" height="${PY1 - PY0 - 16}" rx="30" fill="#05060a" opacity="${f1(0.96 * dark)}"/>`;
      // a pale edge catching a sliver of light in the gap at the lifted corner
      const gl = clamp(st.glint || 0, 0, 1) * dark;
      if (gl > 0.01) g += `<path d="M${P(PX1 - 70, PY0 + 22)} L${P(PX1 - 22, PY0 + 22)} L${P(PX1 - 22, PY0 + 64)} Z" fill="${PK_H}" opacity="${f1(0.85 * gl)}"/>` + wash(PX1 - 40, PY0 + 40, 50, 30, '#ffffff', f1(0.3 * gl));
    }
    if (w > 0.01) g += wash(0, -20, 330, 360, GLOW, f1(0.22 * w));
    // the panel: a thickness lip, then the glossy shell with a moulded inset, the screws and the empty hole
    const out = rrect(PX0, PY0, PX1, PY1, 40), inset = rrect(PX0 + 56, PY0 + 70, PX1 - 56, PY1 - 70, 26);
    const pT = `translate(${f1(560 * w)} ${f1(-470 * w)}) rotate(${f1(26 * w)} ${PX1} ${PY0}) translate(${f1(PX1 * 0.12 * w)} ${f1(PY0 * 0.12 * w)}) scale(${sc(1 + 0.12 * w)})`;
    let pn = `<defs><linearGradient id="sg101sh${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${RED_L}"/><stop offset="0.45" stop-color="${RED}"/><stop offset="1" stop-color="${RED_D}"/></linearGradient></defs>`;
    pn += `<path d="${poly(out, (x, y) => { const q = m(x, y); const k = clamp((x - PX0) / (PX1 - PX0) * (1 - (y - PY0) / (PY1 - PY0)), 0, 1); return [q[0] + 18 * u * k * k + 3, q[1] - 20 * u * k * k + 5]; })}" fill="${RED_E}" stroke="${INK}" stroke-width="5"/>`;
    pn += `<path d="${poly(out, m)}" fill="url(#sg101sh${id})" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    pn += `<path d="${poly(inset, m)}" fill="none" stroke="${RED_D}" stroke-width="7" opacity="0.8"/>`;
    const hl = [[-200, -270], [-40, -296], [150, -270]].map(([x, y]) => m(x, y));
    pn += `<path d="M${P(hl[0][0], hl[0][1])} Q${P(hl[1][0], hl[1][1])} ${P(hl[2][0], hl[2][1])}" stroke="#ffd0c0" stroke-width="12" fill="none" opacity="0.55" stroke-linecap="round"/>`;
    const sp = m(-232, -120), sp2 = m(-210, 150);
    pn += `<path d="M${P(sp[0], sp[1])} L${P(sp2[0], sp2[1])}" stroke="#ffb4a0" stroke-width="9" opacity="0.4" stroke-linecap="round"/>`;
    const [tlx, tly] = m(...SCREWS.tl), [brx, bry] = m(...SCREWS.br), [blx, bly] = m(...SCREWS.bl), [trx, try_] = m(...SCREWS.tr);
    pn += screw(blx, bly, 0, 45) + screw(brx, bry, 0, 20) + holeEmpty(trx, try_) + screw(tlx, tly, clamp(st.so, 0, 1), st.ang || 0);
    g += `<g transform="${pT}">${pn}</g>`;
    // the X-ray sweep: a cyan band crossing the shell, showing the blocks through it
    const xr = st.xr ?? -1;
    if (xr > 0 && xr < 1) {
      const bx = lerp(-460, 460, xr), fade = Math.sin(Math.PI * xr);
      g += `<defs><clipPath id="sg101xc${id}"><rect x="${f1(bx - 110)}" y="${PY0 - 10}" width="220" height="${PY1 - PY0 + 20}"/></clipPath></defs>`;
      g += `<g clip-path="url(#sg101xc${id})" opacity="${f1(0.92 * fade)}"><rect x="${PX0}" y="${PY0}" width="${PX1 - PX0}" height="${PY1 - PY0}" fill="#062a36" opacity="0.82"/>`;
      for (let row = 0; row < 3; row++) for (let col = 0; col < 2; col++) g += `<rect x="${-238 + col * 242}" y="${-300 + row * 190}" width="232" height="178" rx="14" fill="${XR}" fill-opacity="0.35" stroke="${XR}" stroke-width="5"/>`;
      g += `</g><rect x="${f1(bx - 4)}" y="${PY0 - 20}" width="8" height="${PY1 - PY0 + 40}" fill="#d8fbff" opacity="${f1(0.9 * fade)}"/>` + wash(bx, -20, 140, 340, XR, f1(0.25 * fade));
    }
    // the hands: the left holds a screwdriver on the top-left screw; the right prises up the top-right corner (no screw)
    const pt = (x, y) => {   // a panel point through the warp and the take-off transform
      let [x1, y1] = m(x, y); const s1 = 1 + 0.12 * w; x1 = x1 * s1 + PX1 * 0.12 * w; y1 = y1 * s1 + PY0 * 0.12 * w;
      const a = rad(26 * w), c = Math.cos(a), s = Math.sin(a), rx = PX1 + (x1 - PX1) * c - (y1 - PY0) * s, ry = PY0 + (x1 - PX1) * s + (y1 - PY0) * c;
      return [rx + 560 * w, ry - 470 * w]; };
    const j = Math.sin(t * 8) * 2.5 * (1 - w);
    // the right glove: fingers under the panel's right edge just below the lifted corner (the empty hole stays visible)
    const [cx, cy] = pt(PX1 - 4, PY0 + 190);
    let hands = hand(cx + 34, cy + 10 + j, -168 + 14 * w, 0.82, 860, -150, 160);
    // the screwdriver on the top-left screw: the tip on its head, the shaft out to the left, the handle in the left glove
    const so = clamp(st.so, 0, 1), hx = tlx - 30 * so, hy = tly + 34 * so;
    const drop = clamp(st.drop || 0, 0, 1), dx0 = hx - 150 * drop, dy0 = hy + 200 * drop;
    const ex = dx0 - 150, ey = dy0 + 66;
    hands += `<path d="M${P(dx0, dy0)} L${P(ex, ey)}" stroke="${STEEL}" stroke-width="13" stroke-linecap="round"/><path d="M${P(dx0, dy0)} L${P(ex, ey)}" stroke="${STEEL_L}" stroke-width="4" opacity="0.7"/>`;
    const hx2 = ex - 110, hy2 = ey + 48;
    hands += `<path d="M${P(ex, ey)} L${P(hx2, hy2)}" stroke="#1b1c1f" stroke-width="42" stroke-linecap="round"/><path d="M${P(ex - 4, ey - 2)} L${P(hx2 + 2, hy2 - 1)}" stroke="${ACC}" stroke-width="22" stroke-linecap="round" opacity="0.92"/>`;
    const ga = Math.sin(rad(st.ang || 0)) * 5;
    hands += hand(lerp(ex, hx2, 0.5) + 10, lerp(ey, hy2, 0.5) - 2, -24 + ga, 0.84, -760, 560, 168);
    g += hands;
    return g;
  }
  const heroProp = (st, id) => ({ depth: 1.03, accent: true, svg: tt => `<g transform="translate(${HERO.x} ${HERO.y})">${hero(st(tt), tt, id)}</g>` });
  const CAM0 = { x: 0, y: 0, z: 1.0 }, CAM1 = { x: 0, y: -22, z: 1.08 };
  const OFFICER = { id: 'sg101_officer', x: 990, y: 1440, scale: 0.5, dir: -1, turn: 0.35, pose: 'read', expr: 'focused', depth: 0.98 };   // behind, at the right, under the right arm
  const U0 = 0.42, U1 = 0.56, U2 = 0.7, SO0 = 0.55, SO1 = 0.78;

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a border search bay: slate wall panels, a steel rail, a frosted window, an X-ray tunnel's lead curtain at the right,
    // a hanging lamp throwing a warm cone down on the scooter, an epoxy floor
    sg101_bay(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#2a3540"/>`;
      for (let x = -500; x < W + 500; x += 180) back += `<rect x="${x + 6}" y="-400" width="168" height="1640" fill="#2f3b46" stroke="#24303a" stroke-width="4"/>`;
      back += `<rect x="-500" y="1010" width="${W + 1000}" height="22" fill="#56626c"/>`;
      let win = `<rect x="-120" y="300" width="380" height="420" fill="#6f8290" stroke="${INK}" stroke-width="8"/>` + wash(70, 500, 200, 220, '#dfeaf0', 0.22);
      for (let i = 0; i < 10; i++) win += `<rect x="-114" y="${310 + i * 41}" width="368" height="24" fill="#8a9ca8" opacity="0.75"/>`;
      // the X-ray tunnel at the right: a grey housing with a dark mouth hung with lead strips
      win += `<rect x="900" y="560" width="560" height="660" rx="18" fill="#59636c" stroke="${INK}" stroke-width="8"/><rect x="940" y="700" width="480" height="470" fill="#141a20" stroke="${INK}" stroke-width="5"/>`;
      for (let i = 0; i < 9; i++) win += `<rect x="${944 + i * 53}" y="704" width="48" height="440" fill="#2c343c" stroke="#10151a" stroke-width="3"/>`;
      win += `<rect x="960" y="600" width="120" height="44" rx="6" fill="#2a3036"/><circle cx="1110" cy="622" r="12" fill="#e8a33a" opacity="0.85"/>`;
      const lamp = `<path d="M540 -400 L540 120" stroke="#151a1e" stroke-width="6"/><path d="M476 186 L604 186 L576 120 L504 120 Z" fill="#3c4a44" stroke="${INK}" stroke-width="5"/>` +
        `<ellipse cx="540" cy="188" rx="58" ry="12" fill="#fff4d8"/>` + wash(540, 204, 170, 60, '#fff1cf', 0.5) +
        `<path d="M488 190 L592 190 L1020 1300 L60 1300 Z" fill="#fff1cf" opacity="0.06"/>` + wash(540, 900, 480, 420, '#ffe8c0', 0.16);
      const floor = `<rect x="-500" y="1500" width="${W + 1000}" height="${H}" fill="#3e454c"/>` + wash(540, 1700, 700, 160, '#ffe8c0', 0.1) +
        `<path d="M-500 1560 L${W + 500} 1560" stroke="#59616a" stroke-width="4"/>`;
      return { light: { dir: -1, rim: '#fff1cf', key: '#ece4d4' }, layers: [[0.1, back], [0.4, win], [0.9, lamp], [0.95, floor]] };
    },
    // an interview room: grey-green walls, a window blind, a wall clock, a plain table (drawn as a prop in the shots)
    sg101_room(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#38443f"/>` + wash(560, 700, 700, 520, '#f2dcb4', 0.1);
      back += `<rect x="-500" y="1040" width="${W + 1000}" height="300" fill="#2e3834"/><rect x="-500" y="1030" width="${W + 1000}" height="16" fill="#4c5a54"/>`;
      let win = `<rect x="640" y="260" width="400" height="460" fill="#7d8a8a" stroke="${INK}" stroke-width="8"/>`;
      for (let i = 0; i < 12; i++) win += `<rect x="646" y="${268 + i * 37}" width="388" height="22" fill="#a6b2ae" opacity="0.8"/>`;
      win += wash(840, 480, 220, 240, '#fff2d8', 0.18);
      const t = ctx.t + (ctx.sceneStart || 0), a = t * 6;
      win += `<circle cx="250" cy="430" r="78" fill="#e8e4da" stroke="${INK}" stroke-width="7"/><path d="M250 430 L250 378 M250 430 L${f1(250 + Math.cos(rad(a - 90)) * 60)} ${f1(430 + Math.sin(rad(a - 90)) * 60)}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
      const floor = `<rect x="-500" y="1340" width="${W + 1000}" height="${H}" fill="#4a4f4c"/>` + wash(540, 1500, 700, 120, '#f2dcb4', 0.1);
      return { light: { dir: 1, rim: '#ffe6bc', key: '#e8e2d4' }, layers: [[0.1, back], [0.35, win], [0.9, floor]] };
    },
    // a records desk: a dark office wall with a pinboard, a monitor glow, and a near desk top (the travel record is a prop)
    sg101_records(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#232c36"/>` + wash(300, 600, 600, 500, '#bcd4ff', 0.08);
      back += `<rect x="-60" y="260" width="520" height="380" fill="#6a5440" stroke="${INK}" stroke-width="7"/>` + [[-20, 300], [160, 290], [310, 320], [40, 470], [240, 460]].map(([x, y]) => `<rect x="${x}" y="${y}" width="120" height="120" fill="#e2dccb" opacity="0.7"/>`).join('');
      const mon = `<rect x="560" y="420" width="480" height="320" rx="14" fill="#1a1f26" stroke="${INK}" stroke-width="8"/><rect x="584" y="444" width="432" height="272" fill="#2c4a66"/>` +
        [470, 520, 570, 620, 670].map((y, i) => `<rect x="610" y="${y}" width="${[300, 220, 340, 180, 260][i]}" height="18" rx="4" fill="#9cc4e8" opacity="0.6"/>`).join('') + wash(800, 580, 300, 220, '#9cc4e8', 0.2) +
        `<rect x="780" y="740" width="40" height="80" fill="#14181e"/>`;
      const desk = `<rect x="-500" y="1260" width="${W + 1000}" height="${H}" fill="#5a4a3c"/><rect x="-500" y="1250" width="${W + 1000}" height="26" fill="#6e5c4a" stroke="${INK}" stroke-width="5"/>`;
      return { light: { dir: -1, rim: '#bcd4ff', key: '#e4e2dc' }, layers: [[0.1, back], [0.4, mon], [0.95, desk]] };
    }
  });

  // a plain table and chair-side props for the interview room (screen space)
  const table = (x, y, w) => `<rect x="${x}" y="${y}" width="${w}" height="34" rx="6" fill="#6a5a48" stroke="${INK}" stroke-width="6"/><rect x="${x + 20}" y="${y + 34}" width="${w - 40}" height="300" fill="#4a3e32" stroke="${INK}" stroke-width="5"/>`;
  // our own typed travel record (not a boarding pass or any real document): strike 0..1 = "7 DAYS" struck through
  function record(x, y, rot, strike, mark) {
    let g = `<g transform="translate(${x} ${y}) rotate(${rot})">`;
    g += `<rect x="12" y="16" width="620" height="420" rx="10" fill="#000" opacity="0.35"/><rect x="0" y="0" width="620" height="420" rx="10" fill="#efe9da" stroke="${INK}" stroke-width="6"/>`;
    g += `<rect x="0" y="0" width="620" height="78" rx="10" fill="#2a323c"/><text x="30" y="52" font-family="Nunito" font-weight="800" font-size="36" letter-spacing="3" fill="#f2ece0">TRAVEL RECORD</text>`;
    g += `<path d="M470 0 L470 420" stroke="#b9ad90" stroke-width="3" stroke-dasharray="10 8"/>`;
    const row = (yy, k, v, col = '#1a1915', fs = 34) => `<text x="30" y="${yy}" font-family="Nunito" font-weight="700" font-size="22" letter-spacing="2" fill="#6b665c">${k}</text><text x="30" y="${yy + 40}" font-family="Nunito" font-weight="800" font-size="${fs}" fill="${col}">${v}</text>`;
    g += row(120, 'FLIGHT', 'BARBADOS → GATWICK') + row(214, 'HIS STORY', '7 DAYS IN BARBADOS') + row(308, 'AIRLINE CHECKS', '3 DAYS', '#8e1f18', 44);
    g += `<text x="492" y="140" font-family="Nunito" font-weight="800" font-size="26" fill="#6b665c">7 FEB</text><text x="492" y="176" font-family="Nunito" font-weight="800" font-size="26" fill="#6b665c">2025</text>`;
    if (strike > 0) g += `<path d="M24 ${254 - 12} L${f1(24 + 360 * strike)} ${254 - 12}" stroke="#8e1f18" stroke-width="7" stroke-linecap="round"/>`;
    if (mark > 0) g += `<ellipse cx="96" cy="336" rx="96" ry="42" fill="none" stroke="#c8342a" stroke-width="7" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${f1(1 - mark)}" transform="rotate(-4 96 336)"/>`;
    return g + '</g>';
  }

  E.registerScenes({
    // 1 - HOOK (frame 0, the half-reveal): close from behind on the seat back's red shell; the left glove backs the lower-left
    //     screw out (its head turning from 0.0 s), the right glove prises up the top-right corner (no screw there), dark
    //     inside; the camera already pushing in; on line 2 the corner lifts further and a pale edge glints in the gap
    sg101_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.7), kg = WT(ctx, 1, 1, 3.0), bh = WT(ctx, 1, 5, 3.8);
      const st = tt => ({
        u: tt < l2 ? U0 + (U1 - U0) * ease.out(seg(tt, 0.0, 1.4)) : U1 + (U2 - U1) * ease.inOut(seg(tt, l2, l2 + 0.8)),
        w: 0, lit: 0, xr: -1, glint: seg(tt, bh - 0.2, bh + 0.4),
        so: SO0 + (SO1 - SO0) * ease.inOut(seg(tt, 0.0, ctx.T)), ang: tt * 260
      });
      return E.cine.shot(ctx, {
        set: 'sg101_bay', grade: 'cold', haze: 0.22,
        cam: { from: CAM0, to: CAM1 },
        figures: [{ ...OFFICER, keys: [{ at: 0.2, headTurn: 0.25, dur: 0.5 }, { at: l2 + 0.05, pose: 'read', expr: 'realise', headTurn: 0.45, dur: 0.4 }, { at: bh, pose: 'examine', expr: 'focused', headTurn: 0.3, dur: 0.4 }] }],
        props: [heroProp(st, 'h')],
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.2), x: 60, y: 1460, text: 'GATWICK AIRPORT · 7 FEB 2025', fs: 34, typeDur: 0.6, sub: 'Flight from Barbados · Border Force' }
        ],
        tag: TAG
      });
    },

    // 2 - GOTCHA: a tighter cut on the same seat back; on "Border" an X-ray band sweeps the shell and shows six blocks;
    //     on "X-rayed" the right glove pulls the panel away on the wrapped blocks (the single impact), the screwdriver drops
    //     back; the officer points; the callout
    sg101_xray(ctx) {
      const t = ctx.t, bd = WT(ctx, 0, 1, 0.6), xw = WT(ctx, 0, 3, 1.3), sct = WT(ctx, 0, 5, 1.9);
      const st = tt => ({
        u: U2 + 0.06 * ease.out(seg(tt, 0, 0.6)), w: ease.out(seg(tt, xw - 0.04, xw + 0.34)), lit: seg(tt, xw, xw + 0.5),
        xr: seg(tt, bd - 0.15, xw - 0.02), glint: 1, so: SO1 + 0.28 * seg(tt, xw - 0.2, xw + 0.1), ang: (tt + 4) * 260,
        drop: ease.inOut(seg(tt, xw + 0.05, xw + 0.6))
      });
      return E.cine.shot(ctx, {
        set: 'sg101_bay', grade: 'cold', haze: 0.18,
        cam: { from: { x: 20, y: -40, z: 1.13 }, to: { x: 30, y: -54, z: 1.2 } },
        figures: [{ ...OFFICER, keys: [{ at: Math.max(0.05, bd - 0.2), pose: 'examine', expr: 'focused', headTurn: 0.35, dur: 0.35 }, { at: xw, pose: 'point', expr: 'stern', headTurn: 0.3, dur: 0.35 }] }],
        props: [heroProp(st, 'x')],
        overlays: [
          { type: 'impact', at: xw, x: HERO.x, y: HERO.y - 40 },
          { type: 'callout', at: sct - 0.1, target: [HERO.x - 20, HERO.y - 10], label: [1040, 520], anchor: 'end', w: 560, fs: 34, text: '8 KG BEHIND THE SEAT BACK', sub: 'Cocaine, found by X-ray', r: 80, depth: 1.03 }
        ],
        tag: TAG
      });
    },

    // 3 - PERSON: the interview room; his silhouette seated at the table (right, facing left); the officer stands at the
    //     left reading his travel record, looks up on "Barbados"; the name label on line 1, his story on line 2
    sg101_person(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), sv = WT(ctx, 0, 2, 1.2), l2 = LS(ctx, 1, 2.6), wk = WT(ctx, 1, 5, 3.4), bb = WT(ctx, 1, 7, 3.8);
      return E.cine.shot(ctx, {
        set: 'sg101_room', grade: 'warm', haze: 0.25,
        cam: { from: { x: -20, y: 20, z: 1.03 }, to: { x: 10, y: 30, z: 1.08 } },
        figures: [
          { id: 'sg101_lord', x: 760, y: 1640, scale: 0.82, dir: -1, turn: 0.55, pose: 'sit', silhouette: 'warm', depth: 1.0,
            keys: [{ at: l1, headTurn: 0.15, dur: 0.4 }, { at: sv, headTurn: 0.35, dur: 0.4 }, { at: l2, pose: 'sit', headTurn: 0.05, dur: 0.5 }, { at: bb, headTurn: 0.3, dur: 0.4 }] },
          { id: 'sg101_officer', x: 290, y: 1650, scale: 0.8, dir: 1, turn: 0.4, pose: 'read', expr: 'focused', depth: 1.0,
            keys: [{ at: l1 + 0.05, pose: 'read', expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: l2 - 0.05, pose: 'examine', expr: 'focused', headTurn: 0.1, dur: 0.4 }, { at: wk, pose: 'read', expr: 'realise', headTurn: 0.35, dur: 0.4 }] }
        ],
        props: [
          { depth: 1.01, svg: () => table(420, 1330, 520) + `<rect x="520" y="1300" width="120" height="34" rx="4" fill="#24303c" stroke="${INK}" stroke-width="3"/><rect x="680" y="1306" width="150" height="26" rx="3" fill="#e8e2d2" stroke="${INK}" stroke-width="3" transform="rotate(-4 755 1319)"/>` }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), x: 60, y: 560, text: 'RONALD LORD · 71 · MONTREAL', fs: 34, typeDur: 0.6, sub: 'Pleaded guilty · silhouette, not a likeness' },
          { type: 'label', at: l2 + 0.05, x: 60, y: 760, text: 'HIS STORY: A WEEK IN BARBADOS', fs: 32, typeDur: 0.6, sub: 'What he told officers' }
        ],
        tag: TAG_SIL
      });
    },

    // 4 - PERSON, the evidence close-up: the officer close at the right; our typed travel record on the desk; on "airline"
    //     the pen strikes "7 DAYS", on "three" a red ring closes round "3 DAYS"
    sg101_days(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.4), al = WT(ctx, 0, 2, 0.8), th = WT(ctx, 0, 4, 1.3);
      return E.cine.shot(ctx, {
        set: 'sg101_records', grade: 'cold', haze: 0.15, dof: true,
        cam: { from: { x: -10, y: 20, z: 1.08 }, to: { x: 10, y: 30, z: 1.13 } },
        figures: [
          { id: 'sg101_officer', x: 850, y: 2150, scale: 1.3, dir: -1, turn: 0.35, pose: 'examine', expr: 'focused', depth: 1.0,
            keys: [{ at: l1, pose: 'examine', expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: al - 0.05, pose: 'point', expr: 'realise', headTurn: 0.1, dur: 0.35 }, { at: th + 0.3, expr: 'stern', headTurn: 0.3, dur: 0.4 }] }
        ],
        props: [
          { depth: 1.04, accent: true, svg: tt => record(70, 1060, -5, ease.out(seg(tt, al - 0.05, al + 0.4)), ease.out(seg(tt, th - 0.05, th + 0.45))) + wash(380, 1360, 260, 120, ACC, f1(0.18 * seg(tt, th, th + 0.4))) }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), x: 60, y: 560, text: 'HE SAID 7 DAYS. IT WAS 3.', fs: 36, typeDur: 0.6, sub: 'Airline checks, per the NCA' }
        ],
        tag: TAG
      });
    },

    // 5 - CONSEQUENCE (the second re-hook): the interview room, closer; on line 1 he shakes his head, then holds still; the
    //     officer folds her arms; the sightseeing fun fact; on line 2 (the irony) the officer turns to him and the NCA label
    sg101_claim(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), no = WT(ctx, 0, 4, 1.0), id_ = WT(ctx, 0, 5, 1.2), gi = WT(ctx, 0, 5, 1.6),
        l2 = LS(ctx, 1, 2.9), pn = WT(ctx, 1, 5, 3.6), tg = WT(ctx, 1, 10, 4.6);
      return E.cine.shot(ctx, {
        set: 'sg101_room', grade: 'warm', haze: 0.2,
        cam: { from: { x: 60, y: 40, z: 1.1 }, to: { x: 30, y: 54, z: 1.16 } },
        figures: [
          { id: 'sg101_lord', x: 640, y: 1760, scale: 1.0, dir: -1, turn: 0.5, pose: 'sit', silhouette: 'warm', depth: 1.0,
            keys: [{ at: l1, headTurn: 0.4, dur: 0.25 }, { at: no, headTurn: -0.1, dur: 0.2 }, { at: id_, headTurn: 0.4, dur: 0.2 }, { at: gi, headTurn: 0.1, dur: 0.4 }, { at: l2, headTurn: 0.3, dur: 0.5 }] },
          { id: 'sg101_officer', x: 170, y: 1700, scale: 0.92, dir: 1, turn: 0.4, pose: 'read', expr: 'focused', depth: 0.99,
            keys: [{ at: l1 + 0.05, pose: 'arms_crossed', expr: 'stern', headTurn: 0.2, dur: 0.4 }, { at: l2 - 0.05, pose: 'read', expr: 'focused', headTurn: 0.35, dur: 0.4 }, { at: tg, pose: 'point', expr: 'stern', headTurn: 0.25, dur: 0.4 }] }
        ],
        props: [
          { depth: 1.01, svg: () => table(300, 1420, 600) }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), until: l2 - 0.2, x: 60, y: 1250, text: 'HE SAID: NO IDEA HOW IT GOT IN', fs: 32, typeDur: 0.6, sub: 'He denied knowing, per the NCA' },
          { type: 'funfact', at: Math.max(0.6, l1 + 0.5), until: l2 + 0.6, y: 400, fs: 38, rows: [{ text: "HE SAID HE'D COME TO THE UK" }, { text: 'TO GO SIGHTSEEING' }, { text: 'Border Force interview, per the NCA', fs: 26 }] },
          { type: 'label', at: l2 + 0.05, x: 60, y: 1250, text: 'THE NCA: "LESS OF A TARGET"', fs: 34, typeDur: 0.6, sub: 'Senior investigating officer' }
        ],
        tag: TAG_SIL
      });
    },

    // 6 - CONSEQUENCE: the court; his silhouette in the dock; the judge at the bench behind; on "guilty" he lowers his head
    //     and the judge reads; on "Six years" the counter
    sg101_court(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), gu = WT(ctx, 0, 2, 0.9), sx = WT(ctx, 0, 3, 1.4);
      const LORD = { id: 'sg101_lord', x: 680, y: 1760, scale: 0.88, dir: -1, turn: 0.4, pose: 'stand', silhouette: 'warm', depth: 1.0 };
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: { x: 680, y: 1760, s: 0.88 }, table: false }, grade: 'warm', haze: 0.25,
        cam: { from: { x: 20, y: 20, z: 1.02 }, to: { x: 0, y: 30, z: 1.07 } },
        figures: [
          { id: 'sg101_judge', x: 540, y: 800, scale: 0.5, dir: 1, turn: 0.05, pose: 'sit', noChair: true, expr: 'stern', depth: 0.34,
            keys: [{ at: l1, pose: 'sit', headTurn: 0.1, dur: 0.3 }, { at: gu, pose: 'sit_read', dur: 0.4 }] },
          { ...LORD, keys: [{ at: l1, pose: 'stand', headTurn: 0.2, dur: 0.3 }, { at: gu, pose: 'hands_together', headTurn: 0.05, dur: 0.4 }, { at: sx, pose: 'bowed', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), x: 60, y: 1240, text: 'CROYDON CROWN COURT', fs: 34, typeDur: 0.5, sub: 'Pleaded guilty · Aug 2025' },
          { type: 'counter', at: sx - 0.05, dur: 0.7, from: 0, to: 6, prefix: '', suffix: ' YEARS', label: 'JAILED · SEPT 2025', y: 520, fs: 120 }
        ],
        tag: TAG_SIL
      });
    },

    // 7 - THE CALLBACK (the loop): frame 1's search bay; it opens on the blocks; the panel comes back over them; on
    //     "screw" the empty hole at the top-right corner is circled; the hands, the screw and the camera return to frame 1's
    //     start; no fade
    sg101_end(ctx) {
      const t = ctx.t, T = ctx.T, sw = WT(ctx, 0, 2, 0.5), pk = WT(ctx, 0, 6, 1.4);
      const back = T - 0.4;
      const ret = tt => ease.inOut(seg(tt, 0.05, Math.max(0.9, back - 0.15)));
      const st = tt => { const r = ret(tt), w = 1 - ease.inOut(seg(tt, 0.05, Math.max(0.6, sw + 0.25)));
        return { u: lerp(U2, U0, r), w, lit: w, xr: -1, glint: 0, so: lerp(SO1, SO0, r), ang: 0, drop: 0 }; };
      return E.cine.shot(ctx, {
        set: 'sg101_bay', grade: 'cold', haze: 0.22,
        cam: { keys: [{ at: 0, ...CAM1 }, { at: 0.05, ...CAM0, dur: Math.max(1.4, T - 0.45) }] },
        figures: [{ ...OFFICER, keys: [{ at: Math.max(0.05, sw - 0.1), pose: 'point', expr: 'realise', headTurn: 0.4, dur: 0.35 }, { at: Math.max(0.8, back - 0.5), pose: 'read', expr: 'focused', headTurn: 0, dur: 0.4 }] }],
        props: [heroProp(st, 'e')],
        overlays: [
          { type: 'callout', at: sw, until: back - 0.45, target: [HERO.x + 222 - 92 * 0.84 * U0, HERO.y - 282 + 108 * 0.84 * U0], label: [1040, 470], anchor: 'end', w: 560, fs: 32, text: 'THE SCREW FROM THIS PANEL', sub: 'Found in his pocket', r: 54, depth: 1.03 }
        ],
        tag: TAG
      });
    }
  });
})();
