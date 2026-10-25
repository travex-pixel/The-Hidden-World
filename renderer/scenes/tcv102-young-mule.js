/* Case File 102 (premium look, ENGINE V10 "ONE SMUGGLER": one case, one person; beats hook -> gotcha -> person ->
   consequence -> callback; the v9 half-reveal opening; the loop). Lane: customs (an airport luggage inspection).
   THE CASE: Bella May Culley, 18, from Billingham, England, reported missing by her family in Thailand; on 10 May 2025 a
   luggage inspection at Tbilisi airport, Georgia, found about 12 kg of marijuana and 2 kg of hashish in her travel bag
   (she had flown from Bangkok via Sharjah). She said a gang forced her to carry it; Thailand released airport CCTV and
   called that baseless. On 3 Nov 2025 she pleaded guilty under a plea agreement: time served (nearly six months) plus a
   500,000-lari fine her family paid. She flew home the next day.
   Structure: frame 0 = THE HALF-REVEAL: close on a plain dark travel bag lying on a steel inspection bench under a
   hanging lamp; two blue gloved hands (sleeves from the bottom corners) are unzipping it: the brass pull a third of the
   way along the front edge, the flap behind it lifted on a dark gap (the inside hidden); the camera already pushing in;
   a generic officer at the left behind the bench. On line 2 the zip runs on to two thirds. GOTCHA (cut closer): the zip
   reaches the corner and on "unzipped" the lid flips open on wrapped green bricks and dark slabs (ILLUSTRATION: the
   packing is not sourced) with the single impact. PERSON: a departures lounge at night, close on her silhouette in
   profile (NOT A LIKENESS), the name label, then the typed travel card (Bangkok -> Sharjah -> Tbilisi, 10 May 2025);
   her account and Thailand's answer at the automated passport gates seen from a high CCTV angle. CONSEQUENCE: a
   courtroom, her silhouette in the glass dock, a generic judge; the fun fact (up to 20 years or life) and the fine
   counter. CALLBACK on frame 1's set: the hands close the lid and run the zip back to a third; the camera eases back to
   frame 1's start; the end card.
   Smoothness: cuts and dissolves, one zoom (the end), no push, no shake; one slow camera move per shot. Screen direction:
   she faces and travels LEFT TO RIGHT.
   Look: one restrained palette (shadow #141b22, mid #aeb2ac, accent #e8a33a); the strong colours are the blue gloves, the
   brass pull and, once open, the green bricks.
   Content rules: she is a dark rim-lit silhouette only (NOT A LIKENESS), never labelled "the mule"; no family member is
   drawn; the officer and the judge are generic figures with no badge, patch, flag, emblem, agency name or insignia; no
   weapon; no force. The bag's colour and brand are not sourced (a plain dark bag); the CCTV frame is our own drawing; the
   travel card is our own typed graphic, not a boarding pass; no airline, airport sign, livery or logo.
   New environments (E.registerSets): ym102_bench (an airport inspection room), ym102_lounge (a departures lounge at
   night), ym102_gates (automated passport gates, high angle), ym102_court (a courtroom). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const TAG_SIL = 'ILLUSTRATION · SILHOUETTE · NOT A LIKENESS';
  const ACC = '#e8a33a', GLOW = '#fff1d6';
  const BAG = '#36435c', BAG_D = '#232c3e', BAG_L = '#53658a', BAG_H = '#8ea2c8', LINING = '#1b2028';
  const GLOVE = '#5b90d8', GLOVE_D = '#3a67ad', GLOVE_L = '#a6c8f2', SLEEVE = '#1f2630';
  const BRICK = '#7fae5a', BRICK_D = '#4c7a36', BRICK_L = '#c4e3a2', SLAB = '#3e2a1c', SLAB_L = '#6a4a32';
  const rad = d => d * Math.PI / 180;

  // ---------- hands (as Case Files 97 and 98)
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
    const P = (x, y, w, sgn) => [x + nx * w / 2 * sgn, y + ny * w / 2 * sgn];
    const [a1, a2] = [P(x0, y0, w0, 1), P(x0, y0, w0, -1)], [b1, b2] = [P(x1, y1, w1, 1), P(x1, y1, w1, -1)], [m1, m2] = [P(mx, my, wm, 1), P(mx, my, wm, -1)];
    const c1 = [x1 - Math.cos(a) * 26, y1 - Math.sin(a) * 26], [k1, k2] = [P(c1[0], c1[1], w1 * 1.04, 1), P(c1[0], c1[1], w1 * 1.04, -1)];
    return `<path d="M${f1(a1[0])} ${f1(a1[1])} Q${f1(m1[0])} ${f1(m1[1])} ${f1(b1[0])} ${f1(b1[1])} L${f1(b2[0])} ${f1(b2[1])} Q${f1(m2[0])} ${f1(m2[1])} ${f1(a2[0])} ${f1(a2[1])} Z" fill="${SLEEVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M${f1(lerp(a1[0], b1[0], 0.15))} ${f1(lerp(a1[1], b1[1], 0.15))} Q${f1(lerp(m1[0], mx, 0.4))} ${f1(lerp(m1[1], my, 0.4))} ${f1(lerp(a1[0], b1[0], 0.85))} ${f1(lerp(a1[1], b1[1], 0.85))}" stroke="#36404c" stroke-width="9" fill="none" opacity="0.7" stroke-linecap="round"/>` +
      `<path d="M${f1(k1[0])} ${f1(k1[1])} L${f1(b1[0])} ${f1(b1[1])} L${f1(b2[0])} ${f1(b2[1])} L${f1(k2[0])} ${f1(k2[1])} Z" fill="#2c3440" stroke="${INK}" stroke-width="4"/>`;
  }
  function hand(x, y, ang, s, ox, oy, sw = 150) {
    const a = rad(ang), wx = x - Math.cos(a) * 96 * s, wy = y - Math.sin(a) * 96 * s;
    return sleeve(ox, oy, wx, wy, sw, sw * 0.62) + glove(x, y, s, 1, ang);
  }

  // ---------- the travel bag (local frame: the lid's rear edge at y = -190 (x +-330), its front edge and the zip at
  // y = -30 (x +-380), the front face down to y = 230). z 0..1 = the zip pull along the front edge (left to right);
  // L = how far the unzipped flap is lifted (px); o 0..1 = the lid flipped fully open; lit 0..1 = light on the contents
  const RX = 330, FX = 380, RY = -190, FY = -30, BY = 230, OPEN_Y = RY - 230;
  const zipX = z => lerp(-FX, FX, clamp(z, 0, 1));
  // the lid's front edge at x (closed part on the rim, the unzipped part lifted, tapering to the pull)
  function lidEdge(x, z, L, o) {
    const xz = zipX(z), k = clamp((xz - x) / 240, 0, 1), lift = L * (k * k * (3 - 2 * k));
    const y0 = FY - lift, eo = ease.inOut(clamp(o, 0, 1));
    return [x * lerp(1, RX / FX * 1.02, eo), lerp(y0, OPEN_Y, eo)];
  }
  // a point on the top face: u -1..1 across, v 0 (rear) .. 1 (front)
  const topPt = (u, v) => [u * lerp(RX, FX, v), lerp(RY, FY, v)];
  function quad(p) { return p.map((q, i) => `${i ? 'L' : 'M'}${f1(q[0])} ${f1(q[1])}`).join(' ') + ' Z'; }
  // the contents (illustrative): two rows of wrapped green bricks and a stack of dark slabs, in the top face's perspective
  function contents() {
    let g = '';
    const brick = (u0, u1, v0, v1, k) => {
      const p = [topPt(u0, v0), topPt(u1, v0), topPt(u1, v1), topPt(u0, v1)];
      const front = [topPt(u0, v1), topPt(u1, v1), [topPt(u1, v1)[0], topPt(u1, v1)[1] + 26], [topPt(u0, v1)[0], topPt(u0, v1)[1] + 26]];
      return `<path d="${quad(front)}" fill="${BRICK_D}" stroke="${INK}" stroke-width="3"/><path d="${quad(p)}" fill="${BRICK}" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M${f1(lerp(p[0][0], p[1][0], 0.15))} ${f1(lerp(p[0][1], p[3][1], 0.3))} L${f1(lerp(p[0][0], p[1][0], 0.8))} ${f1(lerp(p[0][1], p[3][1], 0.22))}" stroke="${BRICK_L}" stroke-width="6" opacity="0.8" stroke-linecap="round"/>` +
        `<path d="M${f1(lerp(p[3][0], p[2][0], 0.5))} ${f1(p[0][1] + 2)} L${f1(lerp(p[3][0], p[2][0], 0.5) + 6)} ${f1(p[3][1] - 2)}" stroke="#e8f4dc" stroke-width="3" opacity="${f1(0.45 + 0.1 * k)}"/>`;
    };
    const slab = (u0, u1, v0, v1) => {
      const p = [topPt(u0, v0), topPt(u1, v0), topPt(u1, v1), topPt(u0, v1)];
      const front = [topPt(u0, v1), topPt(u1, v1), [topPt(u1, v1)[0], topPt(u1, v1)[1] + 14], [topPt(u0, v1)[0], topPt(u0, v1)[1] + 14]];
      return `<path d="${quad(front)}" fill="#24180f" stroke="${INK}" stroke-width="3"/><path d="${quad(p)}" fill="${SLAB}" stroke="${INK}" stroke-width="3"/>` +
        `<path d="M${f1(lerp(p[0][0], p[1][0], 0.2))} ${f1(lerp(p[0][1], p[3][1], 0.35))} L${f1(lerp(p[0][0], p[1][0], 0.75))} ${f1(lerp(p[0][1], p[3][1], 0.3))}" stroke="${SLAB_L}" stroke-width="4" opacity="0.7"/>`;
    };
    const us = [-0.94, -0.6, -0.26, 0.08, 0.42];
    for (let i = 0; i < 4; i++) g += brick(us[i], us[i + 1] - 0.04, 0.06, 0.46, i);
    for (let i = 0; i < 3; i++) g += brick(us[i], us[i + 1] - 0.04, 0.52, 0.94, i + 4);
    g += slab(0.46, 0.92, 0.08, 0.3) + slab(0.46, 0.92, 0.36, 0.58) + slab(0.12, 0.4, 0.6, 0.92) + slab(0.46, 0.92, 0.64, 0.9);
    return g;
  }
  function bag(z, L, o, lit, t, id) {
    const zz = clamp(z, 0, 1), oo = clamp(o, 0, 1), xz = zipX(zz);
    let g = '';
    // the shadow on the bench
    g += `<ellipse cx="0" cy="${BY + 18}" rx="${FX + 60}" ry="40" fill="#000" opacity="0.45"/>`;
    // the right side face (a little depth) and the front face
    g += `<path d="M${FX} ${FY} L${RX + 14} ${RY + 6} L${RX + 14} ${BY - 150} L${FX} ${BY} Z" fill="${BAG_D}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<defs><linearGradient id="ym102f${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${BAG}"/><stop offset="1" stop-color="${BAG_D}"/></linearGradient></defs>`;
    g += `<path d="M${-FX} ${FY} L${FX} ${FY} L${FX} ${BY - 26} Q${FX} ${BY} ${FX - 30} ${BY} L${-FX + 30} ${BY} Q${-FX} ${BY} ${-FX} ${BY - 26} Z" fill="url(#ym102f${id})" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    // a front pocket with its own (closed) zip and piping
    g += `<path d="M${-FX + 70} 40 L${FX - 70} 40 L${FX - 80} ${BY - 30} L${-FX + 80} ${BY - 30} Z" fill="none" stroke="#1a2130" stroke-width="5"/>` +
      `<path d="M${-FX + 90} 62 L${FX - 90} 62" stroke="#7d8696" stroke-width="4" stroke-dasharray="6 5"/><rect x="${FX - 140}" y="54" width="34" height="16" rx="4" fill="#9a8a5a" stroke="${INK}" stroke-width="3"/>`;
    g += `<path d="M${-FX + 6} ${BY - 10} L${FX - 6} ${BY - 10}" stroke="#151b26" stroke-width="8"/>`;
    // the interior (the top opening): dark, the contents waiting in it
    const inner = [topPt(-1, 0), topPt(1, 0), topPt(1, 1), topPt(-1, 1)];
    g += `<defs><clipPath id="ym102in${id}"><path d="${quad(inner)}"/></clipPath></defs>`;
    g += `<g clip-path="url(#ym102in${id})"><path d="${quad(inner)}" fill="#07090c"/>${contents()}` +
      `<path d="${quad(inner)}" fill="#05070a" opacity="${f1(0.96 * (1 - clamp(lit, 0, 1)))}"/>` +
      (lit > 0 ? wash(0, -110, 330, 110, '#fff6dc', f1(0.25 * lit)) : '') + `</g>`;
    // the rim's zip tape on the open stretch (left of the pull)
    if (xz > -FX + 2) g += `<path d="M${-FX} ${FY} L${f1(xz)} ${FY}" stroke="#8c939e" stroke-width="5" stroke-dasharray="5 4"/>`;
    // the lid: the rear edge, then its front edge sampled right to left
    const pts = [[-RX, RY], [RX, RY]];
    for (let i = 0; i <= 40; i++) { const x = FX - i * (2 * FX / 40); pts.push(lidEdge(x, zz, L, oo)); }
    const flipped = oo > 0.55;
    const lidFill = flipped ? LINING : BAG_L;
    g += `<defs><linearGradient id="ym102l${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${flipped ? '#262c36' : BAG_H}"/><stop offset="1" stop-color="${lidFill}"/></linearGradient></defs>`;
    g += `<path d="${quad(pts)}" fill="url(#ym102l${id})" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    if (!flipped) {
      // two carry handles and the lamp's gloss across the lid
      const hs = (hx) => { const a = topPt(hx - 0.2, 0.42), b = topPt(hx + 0.2, 0.42); const lift = 0;
        return `<path d="M${f1(a[0])} ${f1(a[1] - lift)} Q${f1((a[0] + b[0]) / 2)} ${f1(a[1] - 34)} ${f1(b[0])} ${f1(b[1] - lift)}" stroke="#1a2130" stroke-width="20" fill="none" stroke-linecap="round"/>` +
          `<path d="M${f1(a[0] + 10)} ${f1(a[1] - 6)} Q${f1((a[0] + b[0]) / 2)} ${f1(a[1] - 30)} ${f1(b[0] - 10)} ${f1(b[1] - 6)}" stroke="#55627a" stroke-width="5" fill="none"/>`; };
      if (oo < 0.15) g += hs(0);
      g += `<path d="M${-RX + 60} ${RY + 40} Q0 ${RY + 20} ${RX - 60} ${RY + 40}" stroke="${BAG_H}" stroke-width="16" fill="none" opacity="${f1(0.35 * (1 - oo))}" stroke-linecap="round"/>`;
    } else {
      // the open lid's lining: a mesh pocket
      const a = lidEdge(-FX + 60, zz, L, oo), b = lidEdge(FX - 60, zz, L, oo);
      g += `<path d="M${f1(a[0])} ${f1(a[1] + 40)} L${f1(b[0])} ${f1(b[1] + 40)} L${f1(b[0] * 0.95)} ${RY - 40} L${f1(a[0] * 0.95)} ${RY - 40} Z" fill="#2a313c" stroke="#3c4554" stroke-width="4"/>`;
      for (let i = 1; i < 9; i++) { const xx = lerp(a[0], b[0], i / 9); g += `<path d="M${f1(xx)} ${f1(a[1] + 44)} L${f1(xx * 0.95)} ${RY - 44}" stroke="#3a4250" stroke-width="2"/>`; }
    }
    // the lid's zip tape along its edge (open stretch) and the closed teeth right of the pull
    let tape = ''; for (let i = 0; i <= 30; i++) { const x = -FX + i * ((xz + FX) / 30); const p = lidEdge(x, zz, L, oo); tape += `${i ? 'L' : 'M'}${f1(p[0])} ${f1(p[1])} `; }
    if (xz > -FX + 2 && oo < 0.98) g += `<path d="${tape}" stroke="#8c939e" stroke-width="5" fill="none" stroke-dasharray="5 4"/>`;
    if (xz < FX - 2) g += `<path d="M${f1(xz)} ${FY} L${FX} ${FY}" stroke="#a7aeb8" stroke-width="7" stroke-dasharray="4 3"/>`;
    // the brass pull (the accent), at the zip head
    const pz = oo > 0.5 ? [FX, FY] : [xz, FY];
    g += wash(pz[0], pz[1], 50, 30, ACC, 0.35) + `<rect x="${f1(pz[0] - 18)}" y="${f1(pz[1] - 12)}" width="36" height="22" rx="5" fill="#c9922c" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M${f1(pz[0] - 9)} ${f1(pz[1] + 8)} L${f1(pz[0] - 12)} ${f1(pz[1] + 48)} L${f1(pz[0] + 12)} ${f1(pz[1] + 48)} L${f1(pz[0] + 9)} ${f1(pz[1] + 8)} Z" fill="${ACC}" stroke="${INK}" stroke-width="4"/>`;
    if (lit > 0.01) g += wash(0, -60, 420, 240, GLOW, f1(0.22 * lit));
    // the hands: the left one holds the lifted flap's corner (and lifts the lid when it opens), the right one the pull
    const j = Math.sin(t * 7) * 2;
    const lc = lidEdge(-FX + 40, zz, L, oo);
    g += hand(lc[0] + 4, lc[1] + 10 + j, -58 - 30 * oo, 0.86, -640, 980, 168);
    const rp = oo > 0.5 ? [FX + 40 + 120 * (oo - 0.5), FY + 60] : [pz[0] + 6, pz[1] + 34];
    g += hand(rp[0], rp[1] - j, -112 + 20 * oo, 0.86, 660, 1000, 168);
    return g;
  }
  // the bench (local frame, the bag on it): a steel top in perspective, its front edge, two grey trays at the left
  function bench() {
    return `<path d="M-1100 110 L1100 110 L1300 340 L-1300 340 Z" fill="#7b8389" stroke="${INK}" stroke-width="6"/>` +
      wash(0, 220, 700, 120, '#fff1d6', 0.18) +
      `<path d="M-1300 340 L1300 340 L1300 392 L-1300 392 Z" fill="#4e555b" stroke="${INK}" stroke-width="5"/><rect x="-1300" y="392" width="2600" height="900" fill="#1a1f24"/>` +
      `<path d="M-1060 120 L1060 120" stroke="#a9b0b5" stroke-width="4" opacity="0.6"/>`;
  }
  const HERO = { x: 590, y: 1010 };
  const heroProp = (z, L, o, lit, id) => ({ depth: 1.03, accent: true, svg: tt => `<g transform="translate(${HERO.x} ${HERO.y})">${bench()}${bag(z(tt), L(tt), o(tt), lit(tt), tt, id)}</g>` });
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 0, y: -24, z: 1.09 };
  const OFFICER = { id: 'ym102_officer', x: 104, y: 1300, scale: 0.5, dir: 1, turn: 0.35, pose: 'read', expr: 'focused', depth: 1.0 };
  const Z0 = 0.33, Z1 = 0.42, Z2 = 0.64, L0 = 64, L1 = 84, L2 = 112;

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // an airport inspection room: grey-green wall panels, a dark luggage belt behind, a blank notice board, a hanging
    // lamp throwing a warm cone onto the bench (the bench, bag and hands are props)
    ym102_bench(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#26312f"/>`;
      for (let x = -500; x < W + 500; x += 180) back += `<path d="M${x} -400 L${x} 2000" stroke="#1f2927" stroke-width="5"/>`;
      back += `<rect x="-500" y="600" width="${W + 1000}" height="16" fill="#1d2624"/>`;
      let belt = `<rect x="-500" y="720" width="${W + 1000}" height="70" fill="#15191c" stroke="${INK}" stroke-width="5"/>`;
      for (let x = -480; x < W + 500; x += 60) belt += `<rect x="${x}" y="728" width="40" height="54" rx="4" fill="#1f2428"/>`;
      belt += `<rect x="740" y="300" width="300" height="200" rx="8" fill="#344240" stroke="${INK}" stroke-width="4"/><rect x="770" y="330" width="240" height="140" fill="#3e4e4b" opacity="0.8"/>`;
      const lamp = `<path d="M590 -400 L590 140" stroke="#151a1e" stroke-width="6"/><path d="M524 206 L656 206 L626 140 L554 140 Z" fill="#3c4a44" stroke="${INK}" stroke-width="5"/>` +
        `<ellipse cx="590" cy="208" rx="60" ry="12" fill="#fff4d8"/>` + wash(590, 222, 170, 60, '#fff1cf', 0.5) +
        `<path d="M536 210 L644 210 L1080 1300 L100 1300 Z" fill="#fff1cf" opacity="0.06"/>` + wash(590, 900, 480, 380, '#ffe8c0', 0.16);
      return { light: { dir: -1, rim: '#fff1cf', key: '#ece4d4' }, layers: [[0.1, back], [0.35, belt], [0.9, lamp]] };
    },
    // a departures lounge at night: tall windows on a dark apron (runway lights, a plain unmarked tail far off), a row
    // of seats, a glossy floor
    ym102_lounge(ctx, o = {}) {
      let back = `<defs><linearGradient id="ym102night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1220"/><stop offset="0.75" stop-color="#1e2a3e"/><stop offset="1" stop-color="#3a3a46"/></linearGradient></defs>` +
        `<rect x="-500" y="-400" width="${W + 1000}" height="1700" fill="url(#ym102night)"/>`;
      const r = R(10201);
      for (let i = 0; i < 26; i++) { const x = -400 + r() * 1900, y = 980 + r() * 120; back += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(3 + r() * 4)}" fill="${i % 3 ? '#e8a33a' : '#cfe0ff'}" opacity="0.8"/>`; }
      back += `<path d="M880 1060 L940 820 L990 820 L980 1060 Z" fill="#8a909a" opacity="0.5"/><rect x="560" y="1040" width="600" height="26" rx="12" fill="#8a909a" opacity="0.4"/>`;
      back += Array.from({ length: 8 }, (_, i) => `<rect x="${-480 + i * 280}" y="-400" width="24" height="1700" fill="#151a22"/>`).join('') + `<rect x="-500" y="1120" width="${W + 1000}" height="30" fill="#151a22"/>`;
      let seats = '';
      for (let i = 0; i < 9; i++) seats += `<rect x="${-300 + i * 170}" y="1190" width="140" height="70" rx="12" fill="#2e3a44" stroke="${INK}" stroke-width="4"/><rect x="${-290 + i * 170}" y="1260" width="120" height="30" fill="#232c34"/>`;
      const floor = `<rect x="-500" y="1300" width="${W + 1000}" height="${H}" fill="#3c4048"/>` + wash(540, 1380, 700, 100, '#ffd9a0', 0.1);
      return { light: { dir: 1, rim: '#ffd9a0', key: '#dfe2ea' }, layers: [[0.1, back], [0.4, seats], [0.82, floor]] };
    },
    // automated passport gates from a high angle: a tiled floor in perspective, a row of grey gate cabinets with glass
    // flaps across the middle, blank overhead sign boxes
    ym102_gates(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#3a4044"/>`;
      for (let i = 0; i < 16; i++) back += `<path d="M-500 ${700 + i * i * 6 + i * 40} L${W + 500} ${700 + i * i * 6 + i * 40}" stroke="#34393d" stroke-width="3"/>`;
      for (let i = -12; i <= 12; i++) back += `<path d="M${540 + i * 60} 600 L${540 + i * 260} 2000" stroke="#34393d" stroke-width="3"/>`;
      back += `<rect x="-500" y="-400" width="${W + 1000}" height="1000" fill="#2a3034"/>` + wash(540, 300, 700, 200, '#dfe8ee', 0.1);
      const signs = [140, 540, 940].map(x => `<rect x="${x - 120}" y="250" width="240" height="80" rx="6" fill="#20272c" stroke="${INK}" stroke-width="4"/><rect x="${x - 100}" y="272" width="200" height="36" fill="#3a4a54"/>`).join('');
      let gates = '';
      for (let i = 0; i < 5; i++) { const x = -60 + i * 280;
        gates += `<rect x="${x}" y="980" width="70" height="300" rx="8" fill="#8a9298" stroke="${INK}" stroke-width="5"/><rect x="${x + 10}" y="1000" width="50" height="40" rx="4" fill="#2a3a44"/>` +
          `<path d="M${x + 70} 1110 L${x + 150} 1100 L${x + 150} 1180 L${x + 70} 1190 Z" fill="#cfe4ee" opacity="0.35" stroke="#9fb4be" stroke-width="3"/>`; }
      return { light: { dir: 1, rim: '#e6eef2', key: '#e0e4e6' }, layers: [[0.1, back], [0.4, signs], [0.85, gates]] };
    },
    // a courtroom: dark wood panels, a high bench at the right, a glass dock at the left, no emblem or flag
    ym102_court(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#3a2a20"/>`;
      for (let x = -500; x < W + 500; x += 160) back += `<rect x="${x + 10}" y="200" width="140" height="760" fill="#46342a" stroke="#2e2018" stroke-width="4"/>`;
      back += `<rect x="-500" y="960" width="${W + 1000}" height="30" fill="#2a1e16"/>` + wash(700, 500, 600, 400, '#ffdcae', 0.1);
      const floor = `<rect x="-500" y="1500" width="${W + 1000}" height="${H}" fill="#2c221c"/>`;
      return { light: { dir: -1, rim: '#ffdcae', key: '#e8dccb' }, layers: [[0.1, back], [0.85, floor]] };
    }
  });

  // the CCTV frame (screen space): corner brackets, a REC dot, a timestamp, scanlines; k 0..1 fades it in
  function cctv(t, k) {
    if (k <= 0) return '';
    let g = `<rect width="${W}" height="${H}" fill="#9fc8b0" opacity="${f1(0.1 * k)}" style="mix-blend-mode:multiply"/>`;
    for (let y = 0; y < H; y += 8) g += `<rect x="0" y="${y}" width="${W}" height="2" fill="#000" opacity="${f1(0.12 * k)}"/>`;
    const b = (x, y, sx, sy) => `<path d="M${x} ${y + sy * 70} L${x} ${y} L${x + sx * 70} ${y}" stroke="#e6f2ea" stroke-width="6" fill="none" opacity="${f1(0.8 * k)}"/>`;
    g += b(60, 470, 1, 1) + b(W - 60, 470, -1, 1) + b(60, 1340, 1, -1) + b(W - 60, 1340, -1, -1);
    const blink = Math.floor(t * 2) % 2 === 0 ? 1 : 0.25;
    g += `<circle cx="104" cy="${520}" r="12" fill="#e5372b" opacity="${f1(blink * k)}"/><text x="128" y="531" font-family="Nunito" font-weight="800" font-size="30" fill="#e6f2ea" opacity="${f1(k)}">REC</text>`;
    g += `<text x="${W - 90}" y="531" text-anchor="end" font-family="Nunito" font-weight="800" font-size="28" fill="#e6f2ea" opacity="${f1(k)}">10-05-2025  CAM 04</text>`;
    return g;
  }

  E.registerScenes({
    // 1 - HOOK (frame 0, the half-reveal): the bench; the hands draw the zip from a third (the flap lifted on darkness)
    //     from 0.0 s, the camera already pushing in; on line 2 the zip runs on to two thirds, the officer looks up and
    //     the place label types
    ym102_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.7);
      const z = tt => tt < l2 ? Z0 + (Z1 - Z0) * ease.out(seg(tt, 0.0, 1.2)) : Z1 + (Z2 - Z1) * ease.inOut(seg(tt, l2, l2 + 0.9));
      const L = tt => tt < l2 ? L0 + (L1 - L0) * ease.out(seg(tt, 0.0, 1.2)) : L1 + (L2 - L1) * ease.inOut(seg(tt, l2, l2 + 0.9));
      return E.cine.shot(ctx, {
        set: 'ym102_bench', grade: 'cold', haze: 0.25,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [{ ...OFFICER, keys: [{ at: 0.15, headTurn: 0.25, dur: 0.5 }, { at: l2, pose: 'examine', expr: 'realise', headTurn: 0.4, dur: 0.4 }] }],
        props: [heroProp(z, L, () => 0, () => 0, 'h')],
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.05), x: 60, y: 600, text: 'TBILISI AIRPORT, GEORGIA', fs: 34, typeDur: 0.6, sub: 'Luggage inspection · 10 May 2025' }
        ],
        tag: TAG
      });
    },

    // 2 - GOTCHA: the same bench, closer; the zip runs to the corner and on "unzipped" the lid flips open on the bricks
    //     and slabs (the single impact); the find label
    ym102_open(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.45), uz = WT(ctx, 0, 4, 1.2);
      const z = tt => Z2 + (1 - Z2) * ease.inOut(seg(tt, Math.min(l1, uz - 0.6), uz));
      const L = tt => L2 + 30 * ease.out(seg(tt, 0, uz));
      const o = tt => ease.out(seg(tt, uz - 0.02, uz + 0.4));
      const lit = tt => seg(tt, uz, uz + 0.5);
      return E.cine.shot(ctx, {
        set: 'ym102_bench', grade: 'cold', haze: 0.2,
        cam: { from: { x: 30, y: -40, z: 1.2 }, to: { x: 30, y: -56, z: 1.27 } },
        figures: [{ id: 'ym102_officer', x: 200, y: 1330, scale: 0.62, dir: 1, turn: 0.35, pose: 'examine', expr: 'focused', depth: 1.0,
          keys: [{ at: l1, pose: 'examine', expr: 'focused', headTurn: 0.3, dur: 0.3 }, { at: uz, pose: 'point', expr: 'stern', headTurn: 0.2, dur: 0.35 }] }],
        props: [heroProp(z, L, o, lit, 'g')],
        overlays: [
          { type: 'impact', at: uz, x: HERO.x, y: HERO.y - 110 },
          { type: 'label', at: uz + 0.35, x: 60, y: 470, text: '12 KG MARIJUANA · 2 KG HASHISH', fs: 34, typeDur: 0.6, sub: "Georgia's Interior Ministry · packing illustrated" }
        ],
        tag: TAG
      });
    },

    // 3 - PERSON: the night lounge; close on her silhouette in profile facing the window (left to right); on line 1 the
    //     name label, on line 2 she turns to the window and the typed travel card slides in
    ym102_person(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), l2 = LS(ctx, 1, 2.4), th = WT(ctx, 1, 5, 3.6);
      return E.cine.shot(ctx, {
        set: 'ym102_lounge', grade: 'cold', haze: 0.3, dof: true,
        cam: { from: { x: -10, y: 20, z: 1.16 }, to: { x: 10, y: 30, z: 1.22 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [{ id: 'ym102_traveller', x: 400, y: 1900, scale: 1.15, dir: 1, turn: 0.85, pose: 'stand', silhouette: 'warm', depth: 1.0,
          keys: [{ at: l1, headTurn: 0.1, dur: 0.4 }, { at: l2, pose: 'hands_together', headTurn: 0.45, dur: 0.5 }, { at: th, headTurn: 0.25, dur: 0.6 }] }],
        props: [{ depth: 1.0, svg: tt => wash(900, 1000, 260, 200, ACC, f1(0.06 + 0.08 * seg(tt, l2, l2 + 0.8))) }],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), x: 60, y: 1200, text: 'BELLA CULLEY, 18', fs: 38, typeDur: 0.5, sub: 'Pleaded guilty · silhouette, not a likeness' },
          { type: 'card', at: l2 + 0.05, x: 130, y: 430, w: 820, rows: [
            { text: 'BANGKOK → SHARJAH → TBILISI', fs: 36 },
            { text: 'FLIGHT DATE: 10 MAY 2025', fs: 32, at: l2 + 0.35 },
            { text: 'ARRESTED ON ARRIVAL', fs: 32, colour: ACC, at: l2 + 0.65 }] }
        ],
        tag: TAG_SIL
      });
    },

    // 4 - PERSON: her account, then Thailand's: the passport gates from a high CCTV angle; her silhouette walks left to
    //     right through a gate; on line 1 her account's label, on line 2 the CCTV frame and Thailand's answer
    ym102_claim(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), l2 = LS(ctx, 1, 2.6);
      const k = tt => ease.out(seg(tt, l2 - 0.05, l2 + 0.35));
      return E.cine.shot(ctx, {
        set: 'ym102_gates', grade: 'cold', haze: 0.3,
        cam: { from: { x: -20, y: 10, z: 1.02 }, to: { x: 10, y: 20, z: 1.07 } },
        figures: [{ id: 'ym102_traveller', x: 120, y: 1260, scale: 0.46, dir: 1, turn: 0.6, pose: 'walk', silhouette: 'cool', depth: 1.0,
          walk: { at: 0.0, dur: Math.max(3.0, ctx.T - 0.2), cadence: 3.0, stride: 16, from: 120, to: 760 },
          keys: [{ at: l1, pose: 'walk', headTurn: 0.1, dur: 0.3 }, { at: l2, pose: 'walk', headTurn: 0.35, dur: 0.4 }] }],
        props: [{ depth: 1.0, svg: tt => wash(540, 1150, 300, 200, '#dfe8ee', f1(0.06 + 0.1 * k(tt))) }],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), x: 60, y: 640, text: 'HER ACCOUNT: FORCED BY A GANG', fs: 32, typeDur: 0.6, sub: 'What she told the court in Tbilisi' },
          { type: 'svg', at: l2 - 0.05, dur: 0.3, svg: tt => cctv(tt, k(tt)) },
          { type: 'label', at: l2 + 0.1, x: 60, y: 820, text: 'THAILAND: CLAIM BASELESS', fs: 32, typeDur: 0.6, sub: 'Immigration police CCTV · 10 May 2025' }
        ],
        tag: TAG_SIL
      });
    },

    // 5 - CONSEQUENCE (the music drop): the courtroom; her silhouette in the glass dock, the judge at the bench; on line
    //     1 the plea label and the fun fact; on line 2 the fine counter
    ym102_court(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.5), gu = WT(ctx, 0, 2, 0.9), l2 = LS(ctx, 1, 1.9);
      return E.cine.shot(ctx, {
        set: 'ym102_court', grade: 'warm', haze: 0.25,
        cam: { from: { x: -10, y: 20, z: 1.04 }, to: { x: 10, y: 30, z: 1.1 } },
        figures: [
          { id: 'ym102_judge', x: 820, y: 1440, scale: 0.86, dir: -1, turn: 0.4, pose: 'read', expr: 'focused', depth: 0.98,
            keys: [{ at: l1, pose: 'read', expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: gu - 0.1, pose: 'gavel', expr: 'stern', headTurn: 0.1, dur: 0.35 }, { at: l2, pose: 'read', expr: 'neutral', dur: 0.4 }] },
          { id: 'ym102_traveller', x: 300, y: 1560, scale: 0.8, dir: 1, turn: 0.7, pose: 'stand', silhouette: 'warm', depth: 1.0,
            keys: [{ at: l1, headTurn: 0.1, dur: 0.4 }, { at: gu, pose: 'hands_together', headTurn: 0.3, dur: 0.4 }] }
        ],
        props: [
          // the judge's bench (in front of his legs)
          { depth: 0.99, svg: () => `<path d="M600 1140 L1200 1140 L1200 1600 L600 1600 Z" fill="#5a4030" stroke="${INK}" stroke-width="6"/><rect x="590" y="1120" width="620" height="30" fill="#6e5038" stroke="${INK}" stroke-width="4"/>` +
              `<path d="M640 1200 L1160 1200 M640 1300 L1160 1300" stroke="#4a3426" stroke-width="5"/>` },
          // the glass dock around her
          { depth: 1.01, svg: tt => `<rect x="110" y="980" width="390" height="620" fill="#cfe4ee" opacity="0.1" stroke="#b9ccd4" stroke-width="5"/><rect x="100" y="1340" width="410" height="260" fill="#4a3628" stroke="${INK}" stroke-width="5"/>` +
              `<path d="M150 1000 L230 1320" stroke="#ffffff" stroke-width="6" opacity="0.18"/>` + wash(300, 1150, 200, 260, ACC, f1(0.05 + 0.1 * seg(tt, gu, gu + 0.5))) }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, gu), x: 60, y: 820, text: 'GUILTY PLEA · 3 NOV 2025', fs: 34, typeDur: 0.5, sub: 'Plea agreement · Tbilisi court' },
          { type: 'funfact', at: Math.max(0.4, l1 + 0.2), until: l2 - 0.1, y: 430, fs: 40, rows: [{ text: 'THE CHARGE CARRIED' }, { text: 'UP TO 20 YEARS OR LIFE' }, { text: "Georgia's Interior Ministry", fs: 26 }] },
          { type: 'counter', at: l2 + 0.05, dur: 1.1, from: 0, to: 500000, prefix: '', suffix: ' LARI', label: 'FINE · PAID BY HER FAMILY', y: 560, fs: 100 }
        ],
        tag: TAG_SIL
      });
    },

    // 6 - THE CALLBACK (the loop): frame 1's bench, the same officer; the hands close the lid and run the zip back to a
    //     third (frame 1's state) and the camera eases back to frame 1's start; the officer is back in frame 1's pose
    ym102_end(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.1);
      const back = T - 0.45;
      const o = tt => 1 - ease.inOut(seg(tt, 0.05, Math.max(0.8, back - 0.9)));
      const z = tt => 1 - (1 - Z0) * ease.inOut(seg(tt, Math.max(0.6, back - 1.1), Math.max(1.0, back)));
      const L = tt => L2 + 30 - (L2 + 30 - L0) * ease.inOut(seg(tt, 0.3, Math.max(1.0, back)));
      const lit = tt => 1 - seg(tt, 0.05, Math.max(0.8, back - 0.9));
      return E.cine.shot(ctx, {
        set: 'ym102_bench', grade: 'cold', haze: 0.25,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.55) }] },
        figures: [{ ...OFFICER, keys: [{ at: l1, pose: 'examine', expr: 'focused', headTurn: 0.35, dur: 0.35 }, { at: Math.max(1.0, back - 0.5), pose: 'read', expr: 'focused', headTurn: 0, dur: 0.4 }] }],
        props: [heroProp(z, L, o, lit, 'e')],
        overlays: [],
        tag: TAG
      });
    }
  });
})();
