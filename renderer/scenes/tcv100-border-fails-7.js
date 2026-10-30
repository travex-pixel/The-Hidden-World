/* Case File 100 (premium look, ENGINE V9: the half-reveal opening; the v8 lane and agent-first making-verb hook; v6/v7
   structure promise -> proof -> escalate -> callback, the loop, the object-first headline, the 28-second cut): BORDER
   FAILS, 7, the milestone reel. Lane: border. Things smugglers BUILT to beat a land border.
   HEADLINE: Otay Mesa, San Diego, May-June 2026: a Homeland Security Task Force watched a supposed discount store from
   December 2025 (few customers, a crew of apparent employees moving apparently empty suitcases); on 29 May 2026 deputies
   stopped three vehicles with over a ton of cocaine (about $45 million); the tunnel's exit was under the storage room's
   floor, reached by a hydraulic lift; about 1,933 ft long and 55 ft deep, into Tijuana. Four men charged (not named,
   not drawn). The callback: prosecutors say the packages were loaded into deep freezers on a truck.
   CASE 2: Douglas, Arizona, 29 November 2017: marijuana (over 240 lb, 10 bundles) sent down a zip line from a tall building
   in Agua Prieta; surveillance found an 18-year-old hiding in a vacant lot with the bundles (silhouette, not named).
   CASE 3 (best last): Lynden, Washington, July 2005: a 360-ft tunnel from a hut in Aldergrove, British Columbia, to under a
   house's living-room floor, the first found under the US-Canada border; agents had cameras and microphones inside the
   house (a judge's order) and watched three men carry bags through it (silhouettes, not named).
   Structure: frame 0 = THE HALF-REVEAL: close and high over the tiled storeroom floor; two gloved hands lift the near edge
   of a square floor hatch that fills the upper-middle (half the frame wide); a hot sliver of tunnel light leaks from the
   gap, the inside still hidden; the camera already pushing in; an agent with a torch at the left. On line 2 the hatch
   rises further; on the gotcha (a lower angle, the agent kneeling, close) the hydraulic lift swings it fully open on the
   lit shaft, the ladder and the tunnel mouth (the single impact), the empty shop through the door behind. Then case 2 (the
   zip line over the fence at night; the vacant lot: the torch finds the silhouette among the bundles), case 3 (a cutaway
   through the ground: hut, tunnel, house; the living room through the hidden camera: the music drop) and the callback on
   frame 1's floor (an inset picture of a deep freezer opens on packages and fades; the hatch settles back to frame 1's sliver and the
   camera eases back to frame 1's start) with the end card.
   Smoothness: cuts and dissolves, one push (into case 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact. Screen direction: contraband travels LEFT TO RIGHT (Mexico and Canada on the left).
   Look: one restrained palette (shadow #161c22, mid #b4b0a4, accent #f0a640); the strongly coloured thing in every shot is
   the build itself: the tunnel light under the hatch, the bundle on the line, the lit tunnel, the REC frame.
   Content rules: the arrested men are dark rim-lit silhouettes (NOT A LIKENESS), never named; the four charged in San Diego
   are not drawn. Agents are generic figures in plain clothing with no badge, patch, flag, agency name or insignia; no
   weapon; a torch only. The store, freezer, boxes, house and hut carry no real name, logo or plate; the shop's sign says
   only SALE; the camera frame is our own typed graphic.
   New environments (E.registerSets): bf100_store (a storeroom floor; view 'top' or 'low'), bf100_zip (the border fence at
   night with a tall building on the Mexican side), bf100_lot (a vacant lot at night), bf100_cut (a cutaway through the
   ground at the US-Canada line), bf100_living (a living room seen through a hidden camera). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#100d0b';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const TAG_SIL = 'ILLUSTRATION · SILHOUETTES · NOT A LIKENESS';
  const ACC = '#f0a640', HOT = '#ffd58a', HOTW = '#fff3d6';
  const GLOVE = '#b98a52', GLOVE_D = '#86602f', GLOVE_L = '#dcb47c', SLEEVE = '#232a33';
  const TILE = '#7c8288', TILE_D = '#5e6469', TILE_L = '#9aa0a5';
  const TAPE = '#c99a3c', TAPE_D = '#8a6420', TAPE_L = '#e8c46a';
  const flashAt = (tt, a) => (tt >= a && tt < a + 0.45 ? Math.pow(1 - (tt - a) / 0.45, 2) : 0);

  // ---------- a pinhole camera for the storeroom (metres; floor at Y = 0, Z away from the camera)
  function camP(hc, phi, F, cx, cy, x0) {
    const s = Math.sin(phi * Math.PI / 180), c = Math.cos(phi * Math.PI / 180);
    return (X, Y, Z) => { const dx = X - x0, dy = Y - hc; const zc = -dy * s + Z * c, yc = dy * c + Z * s; return [cx + F * dx / zc, cy - F * yc / zc]; };
  }
  const CAM_TOP = camP(2.2, 52, 1250, 540, 800, 0);       // the hook and the end: high, close, looking down at the hatch
  const CAM_LOW = camP(1.3, 26, 1150, 540, 860, -0.12);   // the gotcha: lower, the back wall and the door in view
  const pt = p => `${f1(p[0])} ${f1(p[1])}`;
  const poly = (ps, fill, extra = '') => `<path d="M${ps.map(pt).join(' L')} Z" fill="${fill}" ${extra}/>`;
  const line = (a, b, col, w, extra = '') => `<path d="M${pt(a)} L${pt(b)}" stroke="${col}" stroke-width="${w}" ${extra}/>`;

  // the hatch: a 1.1 m square floor panel hinged at its far edge; its near edge lifts by angle th (degrees)
  const HW = 0.55, ZN = 1.3, ZF = 2.4, PL = 1.1, DEEP = 2.6;
  const TH0 = 7.5;   // frame 0's lift: a sliver
  // the tiled floor of the storeroom (drawn by the set at the hatch's depth so the seams line up)
  function floorTiles(P, x0, x1, z0, z1, step) {
    let g = poly([P(x0, 0, z0), P(x1, 0, z0), P(x1, 0, z1), P(x0, 0, z1)], TILE);
    const r = R(10001);
    for (let i = 0, x = x0; x < x1 - 1e-6; x += step, i++) for (let j = 0, z = z0; z < z1 - 1e-6; z += step, j++) {
      const v = r(), ze = Math.min(z + step, z1); if (v < 0.35) g += poly([P(x, 0, z), P(x + step, 0, z), P(x + step, 0, ze), P(x, 0, ze)], v < 0.17 ? TILE_D : TILE_L, 'opacity="0.35"');
    }
    for (let x = x0; x <= x1 + 1e-6; x += step) g += line(P(x, 0, z0), P(x, 0, z1), '#53585d', 3);
    for (let z = z0; z <= z1 + 1e-6; z += step) g += line(P(x0, 0, z), P(x1, 0, z), '#53585d', 3);
    // scuffs and a pallet-jack track
    g += `<path d="M${pt(P(-2.4, 0, 0.6))} Q${pt(P(-1.4, 0, 1.8))} ${pt(P(-1.2, 0, 3.4))}" stroke="#4a4f54" stroke-width="10" fill="none" opacity="0.35"/>`;
    return g;
  }

  // ---------- hands (tan work gloves) and sleeves
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
    return `<path d="M${pt(a1)} Q${pt(m1)} ${pt(b1)} L${pt(b2)} Q${pt(m2)} ${pt(a2)} Z" fill="${SLEEVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M${pt([lerp(a1[0], b1[0], 0.15), lerp(a1[1], b1[1], 0.15)])} Q${pt([lerp(m1[0], mx, 0.4), lerp(m1[1], my, 0.4)])} ${pt([lerp(a1[0], b1[0], 0.85), lerp(a1[1], b1[1], 0.85)])}" stroke="#3a4450" stroke-width="9" fill="none" opacity="0.7" stroke-linecap="round"/>` +
      `<path d="M${pt(k1)} L${pt(b1)} L${pt(b2)} L${pt(k2)} Z" fill="#2c3440" stroke="${INK}" stroke-width="4"/>`;
  }

  // ---------- THE HERO: the floor hatch over the tunnel shaft. th = lift (deg); glowK = how hot the light is; o.hands
  // draws the two gloved hands on the near edge with sleeves to the bottom of the frame; o.cid keeps the clip ids unique
  function hatch(P, th, t, o = {}) {
    const id = o.cid || 'a', r = th * Math.PI / 180, sy = PL * Math.sin(r), sz = ZF - PL * Math.cos(r);
    const hn0 = P(-HW, 0, ZN), hn1 = P(HW, 0, ZN), hf0 = P(-HW, 0, ZF), hf1 = P(HW, 0, ZF);
    const open = clamp((th - TH0) / 70, 0, 1);
    let g = `<defs><clipPath id="bf100h${id}"><path d="M${pt(hn0)} L${pt(hn1)} L${pt(hf1)} L${pt(hf0)} Z"/></clipPath>` +
      `<linearGradient id="bf100sh${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d89448"/><stop offset="1" stop-color="#4a2c14"/></linearGradient></defs>`;
    // the shaft (only what the hole shows)
    let s = '';
    s += poly([P(-HW, -DEEP, ZN), P(HW, -DEEP, ZN), P(HW, -DEEP, ZF), P(-HW, -DEEP, ZF)], '#8a5e34');
    s += poly([P(-HW, 0, ZN), P(-HW, 0, ZF), P(-HW, -DEEP, ZF), P(-HW, -DEEP, ZN)], '#9a6c3c');
    s += poly([P(HW, 0, ZN), P(HW, 0, ZF), P(HW, -DEEP, ZF), P(HW, -DEEP, ZN)], '#7e5630');
    s += poly([P(-HW, 0, ZF), P(HW, 0, ZF), P(HW, -DEEP, ZF), P(-HW, -DEEP, ZF)], `url(#bf100sh${id})`);
    // shoring planks on the far wall
    for (let k = 1; k < 6; k++) { const y = -k * DEEP / 6; s += line(P(-HW, y, ZF), P(HW, y, ZF), '#7a5228', 6, 'opacity="0.8"'); }
    // the tunnel mouth at the foot of the far wall: a dark arch with a string of bulbs running away, rails on the floor
    const mx0 = -0.32, mx1 = 0.32, my0 = -DEEP, my1 = -DEEP + 1.25;
    s += `<path d="M${pt(P(mx0, my0, ZF))} L${pt(P(mx0, my1 - 0.2, ZF))} Q${pt(P(0, my1 + 0.1, ZF))} ${pt(P(mx1, my1 - 0.2, ZF))} L${pt(P(mx1, my0, ZF))} Z" fill="#2a1a0e" stroke="${INK}" stroke-width="4"/>`;
    for (let k = 0; k < 6; k++) { const q = P(lerp(-0.12, 0.08, k / 5), my1 - 0.28 - k * 0.12, ZF); s += `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${f1(9 - k * 1.2)}" fill="${HOTW}"/>` + wash(q[0], q[1], 30, 22, HOT, 0.5); }
    s += line(P(-0.16, -DEEP, ZN), P(-0.12, -DEEP, ZF), '#c8c2b0', 5) + line(P(0.16, -DEEP, ZN), P(0.12, -DEEP, ZF), '#c8c2b0', 5);
    // the ladder on the left wall
    const lx0 = -0.16, lx1 = 0.16, lz = ZF - 0.04;
    s += line(P(lx0, 0.02, lz), P(lx0, -DEEP, lz), '#d9dde0', 8) + line(P(lx1, 0.02, lz), P(lx1, -DEEP, lz), '#d9dde0', 8);
    for (let k = 1; k < 9; k++) { const y = -k * 0.28; s += line(P(lx0, y, lz), P(lx1, y, lz), '#d9dde0', 6); }
    // a string of work lights down the shaft beside the ladder
    for (let k = 0; k < 6; k++) { const q = P(0.36, -0.15 - k * 0.32, ZF - 0.05); s += `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${f1(9 - k)}" fill="${HOTW}"/>` + wash(q[0], q[1], 40, 30, HOT, 0.55); }
    s += `<path d="M${pt(P(0.36, 0.0, ZF - 0.05))} L${pt(P(0.36, -2.0, ZF - 0.05))}" stroke="#222" stroke-width="2"/>`;
    // the shaft darkens with depth
    s += poly([P(-HW, -0.9, ZF), P(HW, -0.9, ZF), P(HW, -DEEP, ZF), P(-HW, -DEEP, ZF)], '#140c06', 'opacity="0.35"');
    // the hydraulic lift: two steel rams from the shaft walls up toward the panel
    const ram = (x) => { const b = P(x, -1.2, ZF - 0.5), tp = P(x, sy * 0.45, ZF - (ZF - sz) * 0.45);
      return line(b, tp, '#3c4248', 22) + line(b, tp, '#b9c0c6', 12) + line([lerp(b[0], tp[0], 0.55), lerp(b[1], tp[1], 0.55)], tp, '#e8ecef', 6); };
    s += ram(-HW + 0.07) + ram(HW - 0.07);
    // the light: a bulb at the top of the shaft, washing everything
    const bq = P(HW - 0.1, -0.35, ZF - 0.1);
    s += `<circle cx="${f1(bq[0])}" cy="${f1(bq[1])}" r="14" fill="${HOTW}"/>` + wash(bq[0], bq[1], 200, 150, HOT, 0.3) + wash((hn0[0] + hf1[0]) / 2, (hn0[1] + hf1[1]) / 2, 320, 200, HOT, 0.12);
    g += `<g clip-path="url(#bf100h${id})">${s}</g>`;
    // the hole's cut edge (the floor's thickness) catching the light
    g += line(hn0, hn1, '#ffcf8a', 5, 'opacity="0.9"') + line(hn0, hf0, '#e2a860', 4, 'opacity="0.7"') + line(hn1, hf1, '#e2a860', 4, 'opacity="0.7"');
    // the light leak through the gap (strongest when the gap is a sliver)
    const r0 = P(-HW, sy, sz), r1 = P(HW, sy, sz);
    const gapY = (r0[1] + hn0[1]) / 2, gapH = Math.max(6, hn0[1] - r0[1]);
    g += `<g style="mix-blend-mode:screen">` + wash(540, gapY, 360, 46 + gapH * 0.8, HOT, f1(0.95 - 0.6 * open)) + wash(540, gapY - 30, 460, 150 + gapH, '#ffb24a', f1(0.42 - 0.3 * open)) + (open < 0.3 ? [-1, -0.5, 0, 0.5, 1].map(k => { const bx = 540 + k * 230; return `<path d="M${f1(bx - 40)} ${f1(gapY)} L${f1(bx + 40)} ${f1(gapY)} L${f1(bx + 90 + k * 120)} ${f1(gapY - 420)} L${f1(bx - 90 + k * 120)} ${f1(gapY - 420)} Z" fill="${HOT}" opacity="${f1(0.16 * (1 - open / 0.3) * (0.8 + 0.2 * Math.sin(t * 3 + k * 4)))}"/>`; }).join('') : '') +
      `<path d="M${pt(hn0)} L${pt(hn1)} L${pt(r1)} L${pt(r0)} Z" fill="${HOTW}" opacity="${f1(0.55 * (1 - open))}"/>` +
      // a soft beam rising from the opening
      `<path d="M${pt(hn0)} L${pt(hn1)} L${f1(hn1[0] + 120)} ${f1(hn1[1] - 520 - 300 * open)} L${f1(hn0[0] - 120)} ${f1(hn0[1] - 520 - 300 * open)} Z" fill="${HOT}" opacity="${f1(0.06 + 0.1 * open)}"/></g>`;
    // the panel: its top face (four tiles, the floor's own pattern), its lit edge, the seam lines
    const n = [0, Math.cos(r), Math.sin(r)], TK = 0.07;
    const e0 = P(-HW, sy - TK * n[1], sz - TK * n[2]), e1 = P(HW, sy - TK * n[1], sz - TK * n[2]);
    g += poly([r0, r1, e1, e0], '#e0a35c', `stroke="${INK}" stroke-width="4"`);
    g += poly([hf0, hf1, r1, r0], TILE, `stroke="${INK}" stroke-width="5"`);
    const mid = (u, v) => P(lerp(-HW, HW, u), sy * v, lerp(ZF, sz, v));
    g += line(mid(0.5, 0), mid(0.5, 1), '#53585d', 3) + line(mid(0, 0.5), mid(1, 0.5), '#53585d', 3);
    g += poly([mid(0.5, 0), mid(1, 0), mid(1, 0.5), mid(0.5, 0.5)], TILE_L, 'opacity="0.3"');
    // the near edge's underside lit warm, a recessed lift ring
    g += line(r0, r1, '#ffd08a', 4, 'opacity="0.8"');
    const ring = mid(0.5, 0.82);
    g += `<ellipse cx="${f1(ring[0])}" cy="${f1(ring[1])}" rx="34" ry="${f1(10 + 14 * Math.sin(r + 0.6))}" fill="none" stroke="#3e4348" stroke-width="7"/>`;
    if (o.hands) {
      const h0 = P(-HW + 0.13, sy - 0.01, sz - 0.02), h1 = P(HW - 0.13, sy - 0.01, sz - 0.02);
      g += sleeve(70, 2060, h0[0] - 40, h0[1] + 96, 190, 112) + sleeve(1010, 2060, h1[0] + 40, h1[1] + 96, 190, 112);
      g += glove(h0[0], h0[1] + 26, 0.95, 1, -70) + glove(h1[0], h1[1] + 26, 0.95, -1, 70);
      // the glow on the gloves from below
      g += `<g style="mix-blend-mode:screen">${wash(h0[0], h0[1] + 20, 70, 40, HOT, f1(0.35 * (1 - open)))}${wash(h1[0], h1[1] + 20, 70, 40, HOT, f1(0.35 * (1 - open)))}</g>`;
    }
    return g;
  }

  // a taped bundle (the contraband on the line and in the lot), centre (x, y), scale s, rotation rot
  function bundle(x, y, s, rot = 0, glow = 0) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">${glow > 0 ? wash(0, 0, 90, 60, ACC, f1(0.45 * glow)) : ''}` +
      `<rect x="-62" y="-34" width="124" height="68" rx="16" fill="${TAPE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-30 -34 L-30 34 M10 -34 L10 34 M-62 0 L62 0" stroke="${TAPE_D}" stroke-width="5"/>` +
      `<path d="M-50 -22 Q0 -30 50 -22" stroke="${TAPE_L}" stroke-width="8" fill="none" opacity="0.8" stroke-linecap="round"/></g>`;
  }
  // a big zipped sports bag (the Lynden carriers' "hockey bags"), centre-bottom (x, y), scale s
  function holdall(x, y, s) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="0" rx="150" ry="18" fill="#000" opacity="0.35"/>` +
      `<path d="M-140 -6 Q-150 -110 -96 -118 L96 -118 Q150 -110 140 -6 Z" fill="#3a4a5a" stroke="${INK}" stroke-width="6"/>` +
      `<path d="M-110 -112 Q0 -132 110 -112" stroke="#c8ccd0" stroke-width="6" fill="none"/><path d="M-60 -118 Q0 -190 60 -118" stroke="#222a32" stroke-width="12" fill="none"/>` +
      `<path d="M-120 -60 Q0 -70 120 -60" stroke="#2c3844" stroke-width="5" fill="none"/></g>`;
  }
  // the steel bollard fence seen front-on (as Case File 92 drew it): top y0, bottom y1, pitch p, bollard width bw
  function bollards(y0, y1, p, bw, x0 = -500, x1 = W + 500, col = '#4a382c', hi = '#7a5c46') {
    let g = `<rect x="${x0}" y="${y0 - 16}" width="${x1 - x0}" height="20" fill="#3a2c22" stroke="${INK}" stroke-width="4"/>`;
    for (let x = x0; x < x1; x += p) g += `<rect x="${x}" y="${y0}" width="${bw}" height="${y1 - y0}" fill="${col}" stroke="${INK}" stroke-width="3"/><rect x="${x + 3}" y="${y0}" width="${f1(bw * 0.25)}" height="${y1 - y0}" fill="${hi}" opacity="0.5"/>`;
    return g;
  }
  const nightSky = (id, t, top = '#070c18', bot = '#1c2640', n = 80, seed = 10021, y1 = 900) =>
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="url(#${id})"/>` + E.cine.stars(t, n, seed, -200, y1);

  // the zip line (bf100_zip): from the building's roof (left) to an anchor post on the US side (right)
  const ZA = [196, 470], ZB = [1010, 1330];
  const onLine = u => [lerp(ZA[0], ZB[0], u), lerp(ZA[1], ZB[1], u) + 60 * Math.sin(Math.PI * u)];   // a slight sag

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // the storeroom: o.view 'top' (high over the hatch: the floor fills the frame, the base of the back wall with shelves
    // of boxed stock at the top) or 'low' (the back wall with shelving and the open door on the empty shop floor)
    bf100_store(ctx, o = {}) {
      const low = o.view === 'low', P = low ? CAM_LOW : CAM_TOP, ZW = low ? 4.2 : 3.6;
      let wall = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#2c3238"/>`;
      // the back wall (a vertical plane at Z = ZW): painted block, a fluorescent tube
      wall += poly([P(-4, 0, ZW), P(4, 0, ZW), P(4, 3.2, ZW), P(-4, 3.2, ZW)], '#3a4148');
      for (let y = 0.3; y < 3.2; y += 0.3) wall += line(P(-4, y, ZW), P(4, y, ZW), '#323940', 3);
      let shelves = '';
      const unit = (xa, xb, seed) => { let g = ''; const r = R(seed);
        for (let lv = 0; lv < 4; lv++) { const y = 0.12 + lv * 0.55;
          g += poly([P(xa, y, ZW - 0.05), P(xb, y, ZW - 0.05), P(xb, y + 0.04, ZW - 0.05), P(xa, y + 0.04, ZW - 0.05)], '#c06a30', 'opacity="0.85"');
          for (let x = xa + 0.05; x < xb - 0.3; x += 0.36 + r() * 0.08) { const bh = 0.28 + r() * 0.2, bw = 0.3, kind = r();
            const col = kind < 0.25 ? '#4a5560' : kind < 0.5 ? '#6e5a44' : kind < 0.8 ? '#8a7454' : '#5c6a58';
            g += poly([P(x, y + 0.04, ZW - 0.08), P(x + bw, y + 0.04, ZW - 0.08), P(x + bw, y + 0.04 + bh, ZW - 0.08), P(x, y + 0.04 + bh, ZW - 0.08)], col, `stroke="${INK}" stroke-width="2"`);
            if (kind < 0.25) g += line(P(x + bw * 0.5, y + 0.04 + bh, ZW - 0.08), P(x + bw * 0.5, y + 0.1 + bh, ZW - 0.08), '#222', 3);   // a suitcase handle
          } }
        g += line(P(xa, 0, ZW - 0.05), P(xa, 2.4, ZW - 0.05), '#3a5a8a', 6) + line(P(xb, 0, ZW - 0.05), P(xb, 2.4, ZW - 0.05), '#3a5a8a', 6);
        return g; };
      let door = '';
      if (low) {
        // the open door on the shop floor: bright, empty aisles, a plain SALE banner, nobody there
        const d0 = P(0.9, 0, ZW), d1 = P(1.75, 0, ZW), d2 = P(1.75, 2.1, ZW), d3 = P(0.9, 2.1, ZW);
        door += poly([d0, d1, d2, d3], '#d9d4c4');
        door += `<g>${wash((d0[0] + d1[0]) / 2, (d0[1] + d3[1]) / 2, 200, 260, '#fffbe8', 0.5)}</g>`;
        const sh = (fx_, fz) => poly([P(fx_, 0, ZW + fz), P(fx_ + 0.25, 0, ZW + fz), P(fx_ + 0.25, 1.2, ZW + fz), P(fx_, 1.2, ZW + fz)], '#a8a090', 'opacity="0.9"');
        door += sh(1.0, 1.6) + sh(1.5, 1.6) + sh(1.0, 3.2) + sh(1.5, 3.2);
        const bn = P(1.32, 1.8, ZW + 1.2);
        door += `<rect x="${f1(bn[0] - 70)}" y="${f1(bn[1] - 26)}" width="140" height="46" fill="#c0392b" opacity="0.85"/><text x="${f1(bn[0])}" y="${f1(bn[1] + 9)}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" fill="#fff4e0">SALE</text>`;
        door += `<path d="M${pt(d0)} L${pt(d1)} L${pt(d2)} L${pt(d3)} Z" fill="none" stroke="#1c2024" stroke-width="12"/>`;
        // the door leaf swung in
        door += poly([d0, P(0.9, 0, ZW - 0.8), P(0.9, 2.1, ZW - 0.8), d3], '#5a6068', `stroke="${INK}" stroke-width="5"`);
      }
      const tube = P(-0.6, 2.9, ZW - 0.2);
      const lamp = `<rect x="${f1(tube[0] - 150)}" y="${f1(tube[1] - 8)}" width="300" height="16" rx="8" fill="#eef4f0"/>` + wash(tube[0], tube[1] + 40, 340, 120, '#eef4f0', 0.18);
      const floor = floorTiles(P, -3.3, 3.3, low ? 0.2 : -0.9, ZW, 0.55) + wash(...P(0, 0, 1.85), 520, 300, '#000', 0.25) +
        (low ? '' : wash(...P(-1.6, 0, 3.2), 380, 120, '#eef4f0', 0.08));
      return { light: { dir: 1, rim: '#ffd58a', key: '#dfe2de' }, layers: [[0.9, wall + shelves + unit(-3.0, -0.9, 10011) + unit(-0.7, 0.8, 10012) + (low ? '' : unit(1.0, 3.0, 10013)) + door + lamp], [1.0, floor]] };
    },
    // the border at night (Douglas side): a dark sky, the lights of Agua Prieta behind the fence, a tall pale building
    // on the Mexican side at the left (the zip line's anchor on its roof), the steel bollard fence, US scrub in front
    bf100_zip(ctx, o = {}) {
      const t = ctx.t;
      let sky = nightSky('bf100sk', t) + wash(760, 980, 700, 160, '#ffb060', 0.12);
      let far = `<path d="M-500 980 L-120 950 L300 975 L700 945 L1100 970 L1600 960 L1600 1200 L-500 1200 Z" fill="#141b2a"/>`;
      const r = R(10031); for (let i = 0; i < 60; i++) { const x = 300 + r() * 1300, y = 990 + r() * 70; far += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(2 + r() * 3)}" fill="${r() < 0.7 ? '#ffc070' : '#fff0d0'}" opacity="${f1(0.45 + 0.35 * Math.sin(t * 2 + i))}"/>`; }
      // the building (four storeys, a few lit windows), its roof at y 460
      let bld = `<rect x="-60" y="460" width="330" height="760" fill="#3e4250" stroke="${INK}" stroke-width="6"/><rect x="-60" y="440" width="330" height="26" fill="#2c303c"/>`;
      for (let fl = 0; fl < 5; fl++) for (let k = 0; k < 3; k++) { const lit = (fl * 3 + k) % 4 === 1; bld += `<rect x="${-30 + k * 100}" y="${510 + fl * 140}" width="60" height="80" fill="${lit ? '#f2c878' : '#232733'}" opacity="${lit ? 0.85 : 1}"/>`; }
      bld += `<rect x="176" y="420" width="16" height="50" fill="#22252e"/>`;
      const fence = bollards(960, 1250, 46, 24);
      let ground = `<rect x="-500" y="1246" width="${W + 1000}" height="900" fill="#2a2319"/>` + E.cine.scrub(1262, 12, 10032, '#1c1a14', 0.7, -300, 1400);
      ground += `<path d="M-500 1460 Q300 1420 ${W + 500} 1480" stroke="#1e1913" stroke-width="40" fill="none" opacity="0.7"/>`;
      // the anchor post on the US side
      ground += `<rect x="${ZB[0] - 8}" y="${ZB[1] - 10}" width="18" height="180" fill="#5a5048" stroke="${INK}" stroke-width="3"/>`;
      return { light: { dir: 1, rim: '#cfe0ff', key: '#c8d0e0' }, layers: [[0.05, sky], [0.25, far], [0.4, bld], [0.5, fence], [0.9, ground]] };
    },
    // a vacant lot at night on a town's edge: a sodium streetlight far right, a cinder-block wall and a roofline behind,
    // dry weeds, packed dirt
    bf100_lot(ctx, o = {}) {
      const t = ctx.t;
      let sky = nightSky('bf100lsk', t, '#060a14', '#18202e', 50, 10041, 700);
      let far = `<path d="M-500 860 L120 860 L180 800 L420 800 L480 860 L1600 860 L1600 1100 L-500 1100 Z" fill="#161a24"/>`;
      far += `<rect x="900" y="560" width="10" height="520" fill="#20242c"/><rect x="860" y="548" width="90" height="16" rx="6" fill="#ffc46a"/>` + wash(900, 600, 220, 160, '#ffb050', 0.25);
      let wall = `<rect x="-500" y="980" width="${W + 1000}" height="150" fill="#5a544c" stroke="${INK}" stroke-width="5"/>`;
      for (let y = 995; y < 1130; y += 34) for (let x = -500 + ((y / 34) % 2) * 36; x < W + 500; x += 72) wall += `<rect x="${x}" y="${y}" width="70" height="32" fill="none" stroke="#48433c" stroke-width="2"/>`;
      let ground = `<rect x="-500" y="1126" width="${W + 1000}" height="900" fill="#3a3024"/>` + wash(700, 1300, 700, 220, '#000', 0.3);
      ground += E.cine.scrub(1150, 16, 10042, '#2a2618', 0.9, -300, 1400) + E.cine.scrub(1480, 10, 10043, '#262214', 1.4, -300, 1400);
      return { light: { dir: -1, rim: '#ffc46a', key: '#c8ccd4' }, layers: [[0.05, sky], [0.3, far], [0.55, wall], [0.9, ground]] };
    },
    // a cutaway through the ground at the US-Canada line: a night sky, a low treeline, the surface at y 900; on the left
    // (Canada) a corrugated hut, on the right (USA) a small house; a ditch and a plain border marker between; below, the
    // soil strata (the lit tunnel is a prop)
    bf100_cut(ctx, o = {}) {
      const t = ctx.t;
      let sky = nightSky('bf100csk', t, '#081020', '#25324a', 60, 10051, 820);
      let far = E.cine.pines(905, 14, 10052, '#121a26', 0.45, -200, 1300);
      let surf = `<rect x="-500" y="896" width="${W + 1000}" height="1200" fill="#3a2a1c"/>`;
      [[1060, '#33251a'], [1260, '#2c2016'], [1500, '#251b12'], [1760, '#20170f']].forEach(([y, col]) => { surf += `<path d="M-500 ${y} Q300 ${y - 26} 700 ${y + 10} T1600 ${y}" fill="none" stroke="${col}" stroke-width="80" opacity="0.7"/>`; });
      const r = R(10053); for (let i = 0; i < 40; i++) surf += `<ellipse cx="${f1(-100 + r() * 1300)}" cy="${f1(960 + r() * 950)}" rx="${f1(8 + r() * 18)}" ry="${f1(5 + r() * 9)}" fill="#4a3826" opacity="0.6"/>`;
      surf += `<rect x="-500" y="884" width="${W + 1000}" height="20" fill="#2a3a24"/>`;
      // the ditch and the marker
      surf += `<path d="M470 890 Q540 930 610 890 Z" fill="#1a1612"/><rect x="530" y="836" width="20" height="58" fill="#c8c4b8" stroke="${INK}" stroke-width="3"/>`;
      // the hut (Canada, left) and the house (USA, right)
      let bld = `<path d="M40 892 L40 790 Q190 640 340 790 L340 892 Z" fill="#6e7478" stroke="${INK}" stroke-width="6"/>` +
        [80, 130, 190, 250, 300].map(x => `<path d="M${x} 892 L${x} ${f1(790 - 90 * Math.sin(Math.PI * (x - 40) / 300))}" stroke="#5a6064" stroke-width="4"/>`).join('') +
        `<rect x="160" y="820" width="64" height="72" fill="#2a2e32" stroke="${INK}" stroke-width="4"/>`;
      bld += `<path d="M700 892 L700 740 L860 640 L1020 740 L1020 892 Z" fill="#8a7a64" stroke="${INK}" stroke-width="6"/><path d="M680 748 L860 628 L1040 748" fill="none" stroke="#3a2e26" stroke-width="16"/>` +
        `<rect x="730" y="780" width="110" height="74" fill="#f0c878" opacity="0.85" stroke="${INK}" stroke-width="4"/><rect x="900" y="790" width="60" height="102" fill="#4a3a2c" stroke="${INK}" stroke-width="4"/>` + wash(785, 818, 120, 70, '#ffd08a', 0.35);
      // tiny typed side names (our own graphic)
      const nm = (x, s) => `<text x="${x}" y="960" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" letter-spacing="6" fill="#e8e2d4" opacity="0.85">${s}</text>`;
      surf += nm(105, 'CANADA') + nm(965, 'USA');
      return { light: { dir: 1, rim: '#ffd08a', key: '#d8d4cc' }, layers: [[0.05, sky], [0.3, far], [0.9, surf + bld]] };
    },
    // a small living room at night seen from a high corner (the hidden camera's view): papered wall, a window with
    // blinds, a sofa and a lamp; the rug folded back on an open floor hatch (props)
    bf100_living(ctx, o = {}) {
      let wall = `<rect x="-500" y="-400" width="${W + 1000}" height="1700" fill="#5e5648"/>`;
      for (let x = -480; x < W + 500; x += 60) wall += `<path d="M${x} -400 L${x} 1240" stroke="#564e42" stroke-width="10" opacity="0.6"/>`;
      wall += `<rect x="640" y="420" width="320" height="380" fill="#151c2a" stroke="${INK}" stroke-width="8"/>` + Array.from({ length: 11 }, (_, i) => `<rect x="646" y="${426 + i * 34}" width="308" height="18" fill="#7a7466" opacity="0.8"/>`).join('');
      wall += `<rect x="120" y="500" width="200" height="150" fill="#3c4a3a" stroke="#2a2218" stroke-width="10"/>`;
      let furn = `<rect x="-120" y="900" width="560" height="200" rx="40" fill="#4a3c50" stroke="${INK}" stroke-width="6"/><rect x="-120" y="830" width="560" height="110" rx="40" fill="#54465c" stroke="${INK}" stroke-width="6"/>` +
        `<rect x="490" y="700" width="14" height="380" fill="#2a2420"/><path d="M440 700 L556 700 L530 610 L466 610 Z" fill="#e8c890" stroke="${INK}" stroke-width="4"/>` + wash(498, 680, 200, 160, '#ffd08a', 0.3);
      const floor = `<rect x="-500" y="1080" width="${W + 1000}" height="1100" fill="#6a5038"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M-500 ${1100 + i * 70} L${W + 500} ${1100 + i * 70}" stroke="#5a4230" stroke-width="5"/>`).join('');
      return { light: { dir: -1, rim: '#ffd08a', key: '#e2dccc' }, layers: [[0.2, wall], [0.6, furn], [0.85, floor]] };
    }
  });

  // the hero shot's props, figure and camera (the same in the hook and the end scene: the loop)
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 0, y: -16, z: 1.08 };
  const AGENT = { id: 'bf100_agent', x: 120, y: 760, scale: 0.5, dir: 1, turn: 0.35, pose: 'torch', expr: 'focused', depth: 1.0 };
  const heroProps = (th, fr, id) => [
    { depth: 1.0, accent: true, svg: tt => hatch(CAM_TOP, th(tt), tt, { cid: id, hands: true }) }
  ].concat(fr ? [{ depth: 1.1, accent: true, svg: tt => freezerInset(fr(tt), tt) }] : []);
  // the callback's inset: a framed picture of a chest freezer, its lid up on taped packages (u 0..1 pops it in and out)
  function freezerInset(u, t) {
    if (u <= 0.01) return '';
    const k = ease.out(clamp(u, 0, 1)), cx = 790, cy = 1080, w = 440, h = 330;
    let g = `<g opacity="${f1(k)}" transform="translate(${cx} ${cy}) scale(${sc(0.85 + 0.15 * k)})">`;
    g += `<rect x="${-w / 2 - 8}" y="${-h / 2 - 8}" width="${w + 16}" height="${h + 16}" rx="12" fill="#0b0d10" stroke="${ACC}" stroke-width="5"/>`;
    g += `<clipPath id="bf100fz"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="8"/></clipPath><g clip-path="url(#bf100fz)"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#3a4148"/>`;
    g += `<rect x="${-w / 2}" y="70" width="${w}" height="120" fill="#2a3036"/>`;
    // a chest freezer seen from the front and a little above: the lid swings up on taped packages
    const lid = 0.25 + 0.75 * k;
    g += `<ellipse cx="0" cy="104" rx="170" ry="16" fill="#000" opacity="0.35"/>`;
    g += `<path d="M-128 ${f1(-46 - 120 * lid)} L128 ${f1(-46 - 120 * lid)} L150 -46 L-150 -46 Z" fill="#d4d7d3" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-150 -46 L150 -46 L132 -6 L-132 -6 Z" fill="#1e2226" stroke="${INK}" stroke-width="4"/>`;
    for (let i = 0; i < 5; i++) g += `<rect x="${-118 + i * 48}" y="${-40 + (i % 2) * 6}" width="42" height="26" rx="5" fill="${i % 2 ? TAPE : TAPE_L}" stroke="${INK}" stroke-width="3"/>`;
    g += `<g style="mix-blend-mode:screen">${wash(0, -30, 150, 40, '#dff2ff', f1(0.35 * k))}</g>`;
    g += `<rect x="-150" y="-6" width="300" height="110" fill="#c3c6c2" stroke="${INK}" stroke-width="4"/><path d="M-120 20 L120 20" stroke="#8e928e" stroke-width="4"/><rect x="100" y="40" width="30" height="12" rx="4" fill="#6a706a"/></g>`;
    g += `<text x="0" y="${h / 2 - 16}" text-anchor="middle" font-family="Courier Prime" font-weight="700" font-size="25" fill="#f4efe4">DEEP FREEZERS, PROSECUTORS SAY</text></g>`;
    return g;
  }

  E.registerScenes({
    // 1 - HOOK (frame 0, the half-reveal): the storeroom floor from above; the gloved hands lift the hatch's near edge on a
    //     sliver of tunnel light from 0.0 s; the camera already pushing in; the agent at the left raises his torch; on
    //     line 2 the hatch rises further and the counter runs
    bf100_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.6), ft = WT(ctx, 1, 2, 3.4), tj = WT(ctx, 1, 7, 4.4);
      const th = tt => TH0 + 3.5 * ease.inOut(seg(tt, 0.0, 1.6)) + 2.5 * ease.inOut(seg(tt, l2 - 0.05, l2 + 0.9)) + 2.0 * ease.inOut(seg(tt, tj - 0.1, tj + 0.6));
      return E.cine.shot(ctx, {
        set: 'bf100_store', setOpts: { view: 'top' }, grade: 'cold', haze: 0.2,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [{ ...AGENT, keys: [{ at: 0.1, headTurn: 0.25, dur: 0.5 }, { at: l2 + 0.05, pose: 'torch_low', expr: 'realise', headTurn: 0.35, dur: 0.45 }, { at: tj, expr: 'determined', headTurn: 0.2, dur: 0.4 }] }],
        props: heroProps(th, null, 'h'),
        overlays: [
          { type: 'counter', at: Math.max(2.7, ft - 0.25), dur: 1.0, from: 0, to: 1933, prefix: '', suffix: ' FT', label: 'TUNNEL TO TIJUANA', y: 1130, fs: 104 },
          { type: 'label', at: Math.max(2.9, l2 + 0.2), x: 60, y: 560, text: 'OTAY MESA, SAN DIEGO · MAY 2026', fs: 34, typeDur: 0.6, sub: 'Exit under the storeroom floor' }
        ],
        tag: TAG
      });
    },

    // 2 - THE GOTCHA: the same storeroom, lower and closer; the agent kneels at the hatch with his torch; on "noticed" the
    //     hydraulic lift swings it fully open on the lit shaft (the single impact); through the door the shop floor is
    //     empty under a SALE banner; the labels
    bf100_reveal(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.35), nt = WT(ctx, 0, 2, 0.8), nb = WT(ctx, 0, 5, 1.4), th_ = WT(ctx, 0, 7, 2.0);
      const th = tt => 16 + 56 * ease.out(seg(tt, nt - 0.08, nt + 0.55));
      return E.cine.shot(ctx, {
        set: 'bf100_store', setOpts: { view: 'low' }, grade: 'cold', haze: 0.2,
        cam: { from: { x: 10, y: 20, z: 1.12 }, to: { x: -10, y: 10, z: 1.2 } },
        figures: [
          { id: 'bf100_agent', x: 170, y: 1900, scale: 1.15, dir: 1, turn: 0.4, pose: 'torch_low', expr: 'focused', depth: 1.02,
            keys: [{ at: l1, pose: 'kneel', expr: 'focused', headTurn: 0.2, dur: 0.35 }, { at: nt, expr: 'shocked', headTurn: 0.05, dur: 0.25 }, { at: nb, expr: 'realise', headTurn: 0.4, dur: 0.4 }, { at: th_, expr: 'determined', dur: 0.35 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => hatch(CAM_LOW, th(tt), tt, { cid: 'r' }) + `<g style="mix-blend-mode:screen">${wash(640, 900, 420, 300, HOT, f1(0.4 * flashAt(tt, nt)))}</g>` }
        ],
        overlays: [
          { type: 'impact', at: nt, x: 650, y: 960 },
          { type: 'label', at: Math.max(0.25, nt + 0.25), x: 60, y: 520, text: 'ALMOST NO CUSTOMERS', fs: 36, typeDur: 0.5, sub: 'Watched Dec 2025 - May 2026 (HSI)' },
          { type: 'label', at: Math.max(0.6, th_ - 0.1), x: 60, y: 700, text: 'OVER A TON OF COCAINE · 4 CHARGED', fs: 32, typeDur: 0.6, sub: 'Charged, not convicted (US Attorney)' }
        ],
        tag: TAG
      });
    },

    // 3 - REHOOK + CASE 2: the fence at night; the cable runs from the building's roof (left) over the bollards to the post
    //     (right); on line 1 a bundle hooks on at the top and swings; on "zip-lined" it whizzes down left to right to the
    //     silhouette waiting in the dark, who reaches up; the label
    bf100_zip(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.28), l2 = LS(ctx, 1, 1.9), az = WT(ctx, 1, 1, 2.1), zl = WT(ctx, 1, 3, 2.7), bd = WT(ctx, 1, 7, 3.6);
      const ride = (tt, a) => ease.in(seg(tt, a, a + 0.85));
      return E.cine.shot(ctx, {
        set: 'bf100_zip', grade: 'cold', haze: 0.3,
        cam: { from: { x: -20, y: 10, z: 1.02 }, to: { x: 20, y: 30, z: 1.1 } },
        figures: [
          { id: 'bf100_runner', x: 930, y: 1560, scale: 0.55, dir: -1, turn: 0.4, pose: 'stand_tense', silhouette: 'cool', depth: 1.0,
            keys: [{ at: l1 + 0.05, headTurn: 0.3, dur: 0.4 }, { at: zl - 0.1, pose: 'point_up', dur: 0.35 }, { at: zl + 0.95, pose: 'hands_together', dur: 0.35 }, { at: bd, pose: 'stand_tense', headTurn: 0.1, dur: 0.4 }] }
        ],
        props: [
          // the cable and its pulley trolleys
          { depth: 0.6, svg: () => { let d = ''; for (let i = 0; i <= 20; i++) { const q = onLine(i / 20); d += `${i ? 'L' : 'M'}${f1(q[0])} ${f1(q[1])} `; }
              return `<path d="${d}" stroke="#0c0e12" stroke-width="11" fill="none"/><path d="${d}" stroke="#c4ccd6" stroke-width="5" fill="none" opacity="0.9"/>`; } },
          // the bundles (the accent): one waits and swings from line 1, rides on "zip-lined"; a second hooks on after it
          { depth: 0.6, accent: true, svg: tt => {
              let g = ''; const sw = Math.sin((tt - l1) * 4) * 10 * seg(tt, l1, l1 + 0.3);
              const one = (u, rot, gl) => { const q = onLine(u); return `<path d="M${f1(q[0])} ${f1(q[1])} L${f1(q[0])} ${f1(q[1] + 54)}" stroke="#0c0e12" stroke-width="4"/><circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="10" fill="#c8ccd0" stroke="${INK}" stroke-width="3"/>` + bundle(q[0], q[1] + 96, 0.95, rot, gl); };
              const u1 = 0.03 + 0.92 * ride(tt, zl - 0.05);
              if (tt >= l1 - 0.05) g += one(u1, u1 > 0.9 ? 0 : sw * (1 - u1) + 18 * Math.sin(Math.PI * u1), seg(tt, zl, zl + 0.3));
              if (tt >= zl + 0.9) g += one(0.03 + 0.5 * ride(tt, bd), 6 * Math.sin((tt - zl) * 5), 0);
              return g + `<g style="mix-blend-mode:screen">${wash(onLine(u1)[0], onLine(u1)[1] + 80, 120, 80, ACC, f1(0.3 * seg(tt, zl, zl + 0.2) * (1 - seg(tt, zl + 0.9, zl + 1.4))))}</g>`; } },
          // the bundles landed in the scrub by the post
          { depth: 1.01, svg: tt => [0, 1, 2].filter(i => tt > zl + 0.85 + i * 0.6).map(i => bundle(1000 - i * 70, 1600 + i * 18, 0.8, -8 + i * 9)).join('') }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.5, az - 0.05), x: 60, y: 560, text: 'DOUGLAS, ARIZONA · NOV 2017', fs: 34, typeDur: 0.6, sub: 'A zip line from a building in Agua Prieta' }
        ],
        tag: TAG_SIL
      });
    },

    // 4 - CASE 2's GOTCHA: the vacant lot at night; the agent's torch beam sweeps the weeds from the left and, on
    //     "caught", lands on the crouched silhouette among the bundles (the flash); the label
    bf100_lot(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.45), cg = WT(ctx, 0, 1, 0.8), hd = WT(ctx, 0, 4, 1.4), vl = WT(ctx, 0, 7, 2.0);
      const aim = tt => lerp(-0.5, 0, ease.inOut(seg(tt, l1 - 0.1, cg + 0.05)));   // beam angle offset (radians)
      return E.cine.shot(ctx, {
        set: 'bf100_lot', grade: 'cold', haze: 0.3,
        cam: { from: { x: 0, y: 20, z: 1.0 }, to: { x: 10, y: 30, z: 1.08 } },
        figures: [
          { id: 'bf100_runner', x: 790, y: 1440, scale: 0.72, dir: -1, turn: 0.4, pose: 'bowed', silhouette: 'warm', depth: 0.97,
            keys: [{ at: l1 + 0.1, headTurn: 0.2, dur: 0.3 }, { at: cg + 0.05, pose: 'hand_to_face', dur: 0.3 }, { at: vl, pose: 'hands_together', dur: 0.4 }] },
          { id: 'bf100_bpagent', x: 190, y: 1760, scale: 0.95, dir: 1, turn: 0.35, pose: 'torch', expr: 'focused', depth: 1.0,
            keys: [{ at: l1, pose: 'torch', expr: 'focused', headTurn: 0.25, dur: 0.3 }, { at: cg, expr: 'determined', headTurn: 0.1, dur: 0.3 }, { at: hd, pose: 'point', expr: 'stern', dur: 0.35 }] }
        ],
        props: [
          // the bundles round him (the accent)
          { depth: 0.98, accent: true, svg: tt => { let g = ''; const r = R(10061); for (let i = 0; i < 6; i++) g += bundle(650 + i * 58 + r() * 20, 1430 + (i % 2) * 26, 0.62, -20 + r() * 40, seg(tt, cg, cg + 0.3)); return g; } },
          // the torch beam (screen blend) from the agent's hand to the target
          { depth: 1.0, svg: tt => { const ox = 360, oy = 1150, a = Math.atan2(1380 - oy, 780 - ox) + aim(tt), L = 640, w = 170;
              const ex = ox + Math.cos(a) * L, ey = oy + Math.sin(a) * L, nx = -Math.sin(a) * w, ny = Math.cos(a) * w, hit = flashAt(tt, cg);
              return `<g style="mix-blend-mode:screen"><path d="M${ox} ${oy} L${f1(ex + nx)} ${f1(ey + ny)} L${f1(ex - nx)} ${f1(ey - ny)} Z" fill="#fff4d0" opacity="${f1(0.2 + 0.15 * hit)}"/>` + wash(ex, ey, 200, 130, '#fff4d0', f1(0.35 + 0.3 * hit)) + `</g>`; } }
        ],
        overlays: [
          { type: 'impact', at: cg, x: 780, y: 1380 },
          { type: 'label', at: Math.max(0.3, cg + 0.2), x: 60, y: 560, text: 'ARRESTED, 18 · NOT NAMED', fs: 34, typeDur: 0.6, sub: 'Over 240 lb of marijuana (Border Patrol)' }
        ],
        tag: TAG_SIL
      });
    },

    // 5 - REHOOK + CASE 3: the cutaway; the lit tunnel from under the hut (left) to under the house (right); a silhouette
    //     walks it left to right with a bag; on "tunnel" the tunnel's bulbs come on along its length; on "living room" the
    //     house's floor where the shaft comes up glows; the label and the fun fact
    bf100_cutaway(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.28), tn = WT(ctx, 0, 3, 0.9), cn = WT(ctx, 0, 5, 1.4), lv = WT(ctx, 0, 8, 2.2);
      const lit = tt => ease.out(seg(tt, tn - 0.1, tn + 0.6));
      return E.cine.shot(ctx, {
        set: 'bf100_cut', grade: 'warm', haze: 0.25,
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 10, y: 60, z: 1.06 } },
        figures: [
          { id: 'bf100_carrier', x: 260, y: 1330, scale: 0.17, dir: 1, turn: 0.3, pose: 'walk', silhouette: 'warm', depth: 1.0,
            walk: { at: 0.0, dur: Math.max(1.5, T - 0.2), cadence: 2.6, stride: 10, from: 250, to: 720 },
            keys: [{ at: l1 + 0.1, pose: 'walk', headTurn: 0.1, dur: 0.3 }, { at: lv, pose: 'walk', headTurn: 0.3, dur: 0.3 }] }
        ],
        props: [
          // the tunnel: a shaft down from the hut, the bore, the shaft up into the house (the accent)
          { depth: 0.99, accent: true, svg: tt => { const k = lit(tt), up = seg(tt, lv - 0.1, lv + 0.4);
              let g = `<path d="M196 892 L196 1210 L256 1210 L256 892 Z" fill="#1c140c" stroke="${INK}" stroke-width="4"/>` +
                `<path d="M196 1210 L860 1210 L860 1340 L196 1340 Z" fill="#24180e" stroke="${INK}" stroke-width="5"/>` +
                `<path d="M800 892 L800 1210 L860 1210 L860 892 Z" fill="#1c140c" stroke="${INK}" stroke-width="4"/>`;
              g += `<path d="M200 1214 L856 1214 L856 1336 L200 1336 Z" fill="#c88a48" opacity="${f1(0.15 + 0.55 * k)}"/>` + `<g style="mix-blend-mode:screen">${wash(528, 1272, 380, 80, HOT, f1(0.5 * k))}</g>`;
              for (let i = 0; i < 9; i++) { const x = 240 + i * 72, on = seg(tt, tn - 0.1 + i * 0.05, tn + i * 0.05); g += `<circle cx="${x}" cy="1226" r="7" fill="${on > 0 ? HOTW : '#4a3a28'}"/>` + (on > 0 ? wash(x, 1230, 34, 22, HOT, f1(0.6 * on)) : ''); }
              [0, 1].forEach(j => { g += `<path d="M200 ${1330 - j * 10} L856 ${1330 - j * 10}" stroke="#8a8478" stroke-width="3" opacity="0.6"/>`; });
              // rungs in both shafts
              for (let y = 920; y < 1200; y += 34) g += `<path d="M204 ${y} L248 ${y} M808 ${y} L852 ${y}" stroke="#9aa0a4" stroke-width="4"/>`;
              // the exit glow at the house's floor
              g += `<g style="mix-blend-mode:screen">${wash(830, 892, 120, 40, HOT, f1(0.7 * up))}</g>` + `<path d="M800 888 L860 888" stroke="${HOTW}" stroke-width="${f1(2 + 6 * up)}" opacity="${f1(0.3 + 0.7 * up)}"/>`;
              return g; } },
          // the bag he carries (rides with him)
          { depth: 1.0, svg: tt => { const u = clamp(tt / Math.max(1.5, T - 0.2), 0, 1), x = lerp(250, 720, u); return holdall(x + 34, 1322, 0.22); } }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, tn - 0.2), x: 60, y: 560, text: 'LYNDEN, WASHINGTON · JULY 2005', fs: 34, typeDur: 0.6, sub: 'About 360 ft, from a hut in British Columbia' },
          { type: 'funfact', at: Math.max(0.9, cn + 0.05), y: 660, fs: 36, rows: [{ text: 'THE FIRST TUNNEL EVER FOUND' }, { text: 'UNDER THE US-CANADA BORDER' }, { text: 'DOJ, CNN, The Globe and Mail', fs: 24 }] }
        ],
        tag: TAG_SIL
      });
    },

    // 6 - THE BIGGEST GOTCHA (music drop): the living room through the hidden camera (a high corner, a slight fisheye
    //     vignette); the rug folded back on the open floor hatch; the silhouette heaves a bag out of it; on "hidden" the REC
    //     frame snaps on with the impact; the label
    bf100_living(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.45), al = WT(ctx, 0, 2, 0.8), hd = WT(ctx, 0, 3, 1.1), cm = WT(ctx, 0, 4, 1.5), ins = WT(ctx, 0, 5, 2.0);
      const rec = tt => seg(tt, hd - 0.02, hd + 0.12);
      return E.cine.shot(ctx, {
        set: 'bf100_living', grade: 'warm', haze: 0.2,
        cam: { from: { x: 20, y: 20, z: 1.04 }, to: { x: -10, y: 30, z: 1.12 } },
        figures: [
          { id: 'bf100_carrier', x: 690, y: 1640, scale: 1.0, dir: -1, turn: 0.35, pose: 'stand_tense', silhouette: 'warm', depth: 1.0,
            keys: [{ at: l1, pose: 'present', headTurn: 0.2, dur: 0.35 }, { at: hd, pose: 'stand_tense', headTurn: 0.45, dur: 0.3 }, { at: ins, pose: 'hand_to_face', dur: 0.35 }] }
        ],
        props: [
          // the open hatch in the floor behind him (the tunnel's light) and the folded rug
          { depth: 0.9, accent: true, svg: tt => `<path d="M560 1250 L900 1250 L940 1330 L520 1330 Z" fill="#1c140c" stroke="${INK}" stroke-width="5"/>` +
              `<g style="mix-blend-mode:screen">${wash(730, 1300, 240, 70, HOT, 0.65)}<path d="M540 1290 L920 1290 L960 1000 L500 1000 Z" fill="${HOT}" opacity="0.08"/></g>` +
              `<path d="M560 1250 L900 1250 L880 1060 L580 1060 Z" fill="#6a5038" stroke="${INK}" stroke-width="5"/><path d="M590 1080 L870 1080" stroke="#5a4230" stroke-width="5"/>` +
              `<path d="M930 1300 Q1000 1240 1100 1260 L1140 1360 Q1030 1340 960 1380 Z" fill="#8a3a2e" stroke="${INK}" stroke-width="5"/><path d="M950 1320 Q1020 1290 1110 1300" stroke="#c8a060" stroke-width="5" fill="none"/>` },
          // the floor's front lip in front of his legs (he stands down in the hatch), and the bag he has heaved out
          { depth: 1.01, svg: tt => `<path d="M-500 1330 L${W + 500} 1330 L${W + 500} 2200 L-500 2200 Z" fill="#6a5038"/>` + Array.from({ length: 9 }, (_, i) => `<path d="M-500 ${1380 + i * 70} L${W + 500} ${1380 + i * 70}" stroke="#5a4230" stroke-width="5"/>`).join('') +
              holdall(lerp(760, 420, ease.inOut(seg(tt, l1, l1 + 1.0))), 1420, 0.9) },
          // the hidden camera's frame (our own typed graphic): corner brackets, REC, a timecode
          { depth: 1.2, svg: tt => { const k = rec(tt); if (k <= 0) return ''; const blink = Math.floor((tt - hd) * 2.5) % 2 === 0 ? 1 : 0.35;
              const br = (x, y, dx, dy) => `<path d="M${x} ${y + dy * 70} L${x} ${y} L${x + dx * 70} ${y}" stroke="#f4efe4" stroke-width="6" fill="none"/>`;
              return `<g opacity="${f1(k)}">` + br(70, 470, 1, 1) + br(1010, 470, -1, 1) + br(70, 1560, 1, -1) + br(1010, 1560, -1, -1) +
                `<circle cx="120" cy="530" r="16" fill="#e5372b" opacity="${blink}"/><text x="150" y="544" font-family="Courier Prime" font-weight="700" font-size="40" fill="#f4efe4">REC</text>` +
                `<text x="1000" y="544" text-anchor="end" font-family="Courier Prime" font-weight="700" font-size="34" fill="#f4efe4">CAM 1 · JULY 2005</text></g>`; } }
        ],
        overlays: [
          { type: 'impact', at: hd, x: 560, y: 1000 },
          { type: 'label', at: Math.max(0.3, cm + 0.1), x: 60, y: 700, text: 'THREE MEN ARRESTED · JULY 2005', fs: 32, typeDur: 0.6, sub: 'A judge approved the cameras (DOJ)' }
        ],
        tag: TAG_SIL
      });
    },

    // 7 - THE CALLBACK (the loop): frame 1's floor, the same hands and agent; from "cocaine" an inset picture of a deep
    //     freezer pops in, its lid up on taped packages, and fades before the end; the hatch settles back to frame 1's sliver and the camera
    //     eases back to frame 1's start; the agent is back in frame 1's pose before the last frame
    bf100_end(ctx) {
      const t = ctx.t, T = ctx.T, fz = WT(ctx, 0, 5, 1.4), cc = WT(ctx, 0, 2, 0.7);
      const back = T - 0.45;
      const th = tt => TH0 + 8 * (1 - ease.inOut(seg(tt, 0.05, Math.max(0.9, back - 0.1))));
      const fr = tt => ease.out(seg(tt, Math.min(cc, fz - 0.4), fz + 0.1)) * (1 - ease.inOut(seg(tt, back - 0.75, back - 0.15)));
      return E.cine.shot(ctx, {
        set: 'bf100_store', setOpts: { view: 'top' }, grade: 'cold', haze: 0.2,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.55) }] },
        figures: [{ ...AGENT, keys: [{ at: Math.max(0.1, cc - 0.1), pose: 'point', expr: 'realise', headTurn: 0.4, dur: 0.35 }, { at: Math.max(1.0, back - 0.5), pose: 'torch', expr: 'focused', headTurn: 0, dur: 0.4 }] }],
        props: heroProps(th, fr, 'e'),
        tag: TAG
      });
    }
  });
})();
