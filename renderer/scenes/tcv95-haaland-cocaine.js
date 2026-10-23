/* Case File 95 (premium look, ENGINE V8 + the making-verb hook; v6/v7 structure promise -> proof -> escalate -> callback,
   the loop, the object-first headline, the 28-second cut): CARTEL BRANDS, 1. Lane: bust.
   HEADLINE: near Tulcan, Ecuador, August 2026: acting on an anonymous tip, Ecuador's anti-narcotics police searched a truck
   on the Pan-American Highway and found over 1,000 lb (469 kg, AP) of cocaine in its FALSE BOTTOM, the green packages
   carrying stickers of Erling Haaland's face. Haaland has no link to it: gangs use famous faces to mark their batches
   (the callback).
   CASE 2: Lisbon + Badajoz, March 2018: about 2.5 t in bricks stamped with The Godfather's logo; a road stop; 10 arrested.
   CASE 3 (strangest last): Tacuarembo, Uruguay, November 2022: 444 kg, bricks marked with the YouTube logo, thrown from a
   small plane; police stopped the firewood truck carrying them; 3 arrested.
   Structure: frame 0 = the made thing in the act: night, the open rear of a cargo truck; a police officer's gloved hands
   lift the false floor (already open, still rising) on a cavity packed with green bricks, each with a plain green sticker
   (a generic footballer silhouette and a "9": never a likeness, no badge, no kit); bricks spilled over the tailgate; a
   second officer's torch; the camera already pushing in. Then the gotcha (the truck side-on at blue hour; the cutaway on
   the false bottom: the single impact; the 469 KG counter), case 2 (the Lisbon warehouse: a brick lifted to the light,
   stamped THE GODFATHER in plain type; the fun fact; the night road stop close-up: 10 arrested), case 3 (dusk over the
   grassland: a small plane drops bundles by a waiting pickup; Route 59: the officer drags a log off the firewood truck on
   bricks marked YOUTUBE in plain type: the music drop) and the callback on frame 1's truck (the floor eases back to frame
   1's opening, the camera eases back to frame 1's start) with the end card.
   Smoothness: cuts and dissolves, one push (into case 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact. Screen direction: LEFT TO RIGHT (the officer walking in, the plane, the log pulled toward camera).
   Look: one restrained palette (shadow #0f1c26, mid #b8b4a6, accent #e2a13b); the strongly coloured things are the
   contraband (accent: true): the green Haaland-sticker bricks, the stamped bricks, the bundles.
   Content rules: Haaland and Messi are named in type only, never drawn; Brando is not drawn; brand and film names are plain
   typed words, never logo artwork. Nobody accused is named; the man by the pickup is an anonymous silhouette. Officers are
   generic figures in plain work clothes with no badge, patch, flag, agency name or insignia; torches only; no weapon.
   Vehicles carry no logo, livery, plate or registration.
   New environments (E.registerSets): hc95_night (a highway lay-by in the Andes at night), hc95_dawn (the Pan-American
   Highway at blue hour), hc95_wh (a warehouse at night), hc95_stop (a country road stop at night), hc95_pampa (grassland
   at dusk), hc95_route (a rural road verge by day). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const TAGS = 'ILLUSTRATION · ANONYMOUS SILHOUETTE';
  const FONT = 'font-family="Nunito" font-weight="800"';
  const ACC = '#e2a13b', GLOW = '#ffe2a8';
  const PK = '#2f7a3c', PK_D = '#1c4a24', PK_L = '#58a85c', STK = '#93d652', STK_B = '#eef6dc', SIL = '#10241a';
  const TAN = '#b89a6a', TAN_D = '#7a6040', TAN_L = '#d8c49a', LBL = '#efe9da';
  const GLOVE = '#4a4f57', GLOVE_D = '#30343a', GLOVE_L = '#7c838e', SLEEVE = '#2e3628';
  const WOOD = '#8a6a46', WOOD_D = '#5e462c', WOOD_L = '#ab8a60';

  // ---------- the Haaland-sticker brick
  // the sticker: a plain bright green rectangle with a pale border, a GENERIC footballer silhouette mid-kick with a ball,
  // and a "9" (no face, no likeness, no badge, no kit)
  function sticker(cx, cy, sw, sh) {
    const k = sh / 100;
    let g = `<rect x="${f1(cx - sw / 2)}" y="${f1(cy - sh / 2)}" width="${f1(sw)}" height="${f1(sh)}" rx="${f1(sh * 0.08)}" fill="${STK}" stroke="${STK_B}" stroke-width="${f1(Math.max(1.5, sh * 0.06))}"/>`;
    g += `<g transform="translate(${f1(cx - sw * 0.17)} ${f1(cy + sh * 0.02)}) scale(${sc(k)})" stroke="${SIL}" stroke-linecap="round" stroke-linejoin="round" fill="none">` +
      `<circle cx="1" cy="-33" r="9" fill="${SIL}" stroke="none"/>` +
      `<path d="M0 -22 L-3 6" stroke-width="13"/>` +
      `<path d="M0 -18 L-17 -6 M0 -18 L15 -28" stroke-width="7"/>` +
      `<path d="M-3 6 L-10 25 L-13 44" stroke-width="9"/>` +
      `<path d="M-3 6 L14 15 L27 7" stroke-width="9"/>` +
      `<circle cx="35" cy="5" r="6.5" fill="${SIL}" stroke="none"/></g>`;
    g += `<text x="${f1(cx + sw * 0.27)}" y="${f1(cy + sh * 0.25)}" text-anchor="middle" ${FONT} font-size="${f1(sh * 0.7)}" fill="${STK_B}" stroke="${SIL}" stroke-width="${f1(sh * 0.02)}">9</text>`;
    return g;
  }
  // a green taped package seen from above (centre cx, cy; w x h; rot deg), with the sticker
  function gBrick(cx, cy, w, h, rot = 0, lit = 1) {
    const th = h * 0.16;
    let g = `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(rot)})">`;
    g += `<rect x="${f1(-w / 2)}" y="${f1(-h / 2 + th)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(h * 0.16)}" fill="${PK_D}" stroke="${INK}" stroke-width="3.5"/>`;
    g += `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(h * 0.16)}" fill="${PK}" stroke="${INK}" stroke-width="3.5"/>`;
    g += `<path d="M${f1(-w * 0.46)} ${f1(-h * 0.3)} L${f1(-w * 0.3)} ${f1(-h * 0.42)} M${f1(w * 0.3)} ${f1(h * 0.42)} L${f1(w * 0.46)} ${f1(h * 0.28)}" stroke="${PK_L}" stroke-width="${f1(h * 0.05)}" opacity="0.6" stroke-linecap="round"/>`;
    g += `<rect x="${f1(-w / 2)}" y="${f1(-h * 0.04)}" width="${f1(w)}" height="${f1(h * 0.08)}" fill="#d8e6c8" opacity="0.32"/>`;
    g += sticker(0, 0, w * 0.52, h * 0.66);
    g += `<path d="M${f1(-w * 0.42)} ${f1(-h * 0.36)} L${f1(-w * 0.05)} ${f1(-h * 0.42)}" stroke="#fff" stroke-width="${f1(h * 0.06)}" stroke-linecap="round" opacity="${f1(0.35 * lit)}"/>`;
    return g + '</g>';
  }
  // a tan taped brick with a white typed label (centre cx, cy; w x h; rot): the stamped brands (plain type only)
  function tBrick(cx, cy, w, h, rot, word, o = {}) {
    const th = h * 0.18, fs = o.fs || h * 0.2;
    let g = `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(rot)})">`;
    g += `<rect x="${f1(-w / 2)}" y="${f1(-h / 2 + th)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(h * 0.12)}" fill="${TAN_D}" stroke="${INK}" stroke-width="3.5"/>`;
    g += `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(h * 0.12)}" fill="${o.fill || TAN}" stroke="${INK}" stroke-width="3.5"/>`;
    g += `<path d="M${f1(-w / 2)} ${f1(-h * 0.3)} L${f1(w / 2)} ${f1(-h * 0.26)} M${f1(-w / 2)} ${f1(h * 0.32)} L${f1(w / 2)} ${f1(h * 0.28)}" stroke="${TAN_L}" stroke-width="${f1(h * 0.06)}" opacity="0.55"/>`;
    if (word) {
      const f = Math.min(fs, w * 0.8 / (word.length * 0.7)), lw = word.length * f * 0.7 + f * 0.9, lh = f * 1.7;
      g += `<rect x="${f1(-lw / 2)}" y="${f1(-lh / 2)}" width="${f1(lw)}" height="${f1(lh)}" rx="${f1(f * 0.12)}" fill="${LBL}" stroke="${INK}" stroke-width="2"/>`;
      g += `<text x="0" y="${f1(f * 0.36)}" text-anchor="middle" ${FONT} font-size="${f1(f)}" fill="#141210">${word}</text>`;
    }
    g += `<path d="M${f1(-w * 0.44)} ${f1(-h * 0.38)} L${f1(-w * 0.1)} ${f1(-h * 0.44)}" stroke="#fff" stroke-width="${f1(h * 0.05)}" stroke-linecap="round" opacity="0.35"/>`;
    return g + '</g>';
  }
  // a dark work glove gripping (fingers toward +x when dir = 1), at (x, y), scale s, rotation rot
  function glove(x, y, s, dir, rot) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(dir * s)} ${sc(s)})">` +
      `<path d="M-58 -40 Q-8 -64 42 -46 Q76 -30 74 6 Q70 42 32 48 Q-18 56 -58 36 Z" fill="${GLOVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M22 -42 Q38 2 24 46 M46 -34 Q60 4 50 40" stroke="${GLOVE_D}" stroke-width="4" fill="none"/>` +
      `<path d="M-30 -42 Q22 -82 62 -54 Q70 -42 54 -36 Q16 -52 -18 -26 Z" fill="${GLOVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-40 -30 Q-8 -46 22 -42" stroke="${GLOVE_L}" stroke-width="7" fill="none" opacity="0.75" stroke-linecap="round"/>` +
      `<path d="M-56 -40 L-112 -50 L-122 46 L-56 36 Z" fill="${GLOVE_D}" stroke="${INK}" stroke-width="5"/></g>`;
  }
  // a forearm in a dark olive sleeve from (x0, y0) (off frame) to the wrist (x1, y1), widths w0 -> w1
  function sleeve(x0, y0, x1, y1, w0, w1) {
    const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a), mx = (x0 + x1) / 2, my = (y0 + y1) / 2, wm = (w0 + w1) / 2 * 1.08;
    const P = (x, y, w, sgn) => [x + nx * w / 2 * sgn, y + ny * w / 2 * sgn];
    const [a1, a2] = [P(x0, y0, w0, 1), P(x0, y0, w0, -1)], [b1, b2] = [P(x1, y1, w1, 1), P(x1, y1, w1, -1)], [m1, m2] = [P(mx, my, wm, 1), P(mx, my, wm, -1)];
    const c1 = [x1 - Math.cos(a) * 26, y1 - Math.sin(a) * 26], [k1, k2] = [P(c1[0], c1[1], w1 * 1.04, 1), P(c1[0], c1[1], w1 * 1.04, -1)];
    return `<path d="M${f1(a1[0])} ${f1(a1[1])} Q${f1(m1[0])} ${f1(m1[1])} ${f1(b1[0])} ${f1(b1[1])} L${f1(b2[0])} ${f1(b2[1])} Q${f1(m2[0])} ${f1(m2[1])} ${f1(a2[0])} ${f1(a2[1])} Z" fill="${SLEEVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M${f1(lerp(a1[0], b1[0], 0.15))} ${f1(lerp(a1[1], b1[1], 0.15))} Q${f1(lerp(m1[0], mx, 0.4))} ${f1(lerp(m1[1], my, 0.4))} ${f1(lerp(a1[0], b1[0], 0.85))} ${f1(lerp(a1[1], b1[1], 0.85))}" stroke="#46523c" stroke-width="9" fill="none" opacity="0.7" stroke-linecap="round"/>` +
      `<path d="M${f1(k1[0])} ${f1(k1[1])} L${f1(b1[0])} ${f1(b1[1])} L${f1(b2[0])} ${f1(b2[1])} L${f1(k2[0])} ${f1(k2[1])} Z" fill="#3c4634" stroke="${INK}" stroke-width="4"/>`;
  }

  // ---------- THE HERO: the open rear of a cargo truck at night, the false floor lifted on the green bricks
  // screen geometry (camera at frame 0): the bed floor from the cab end (y 640) to the tailgate edge (y 1000); the hatch
  // (the false floor's rear section) is hinged at y 820 and lifted by its near edge; the cavity under it is packed with
  // green bricks; the tailgate is down (y 1000 -> 1120); bricks spilled over it
  const BED = { yf: 640, yh: 820, yn: 1000, xfl: 330, xfr: 750, xnl: 175, xnr: 905 };
  const xAt = (y, side) => { const u = (y - BED.yf) / (BED.yn - BED.yf); return side < 0 ? lerp(BED.xfl, BED.xnl, u) : lerp(BED.xfr, BED.xnr, u); };
  // the truck body behind/around the hero (static)
  function truckRear() {
    let g = '';
    // the cab beyond the front board
    g += `<path d="M300 640 L318 520 Q330 500 360 498 L720 498 Q750 500 762 520 L780 640 Z" fill="#26323c" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M340 600 L352 532 L728 532 L740 600 Z" fill="#101820" stroke="${INK}" stroke-width="4"/>` + wash(540, 560, 200, 40, '#5a7a9a', 0.12);
    // the front board (cab end of the bed)
    g += `<path d="M${BED.xfl - 20} 560 L${BED.xfr + 20} 560 L${BED.xfr} ${BED.yf} L${BED.xfl} ${BED.yf} Z" fill="${WOOD_D}" stroke="${INK}" stroke-width="5"/>`;
    for (let i = 1; i < 3; i++) g += `<path d="M${BED.xfl - 20 + i * 2} ${560 + i * 26} L${BED.xfr + 20 - i * 2} ${560 + i * 26}" stroke="#3e2e1c" stroke-width="3"/>`;
    // the fixed floor (front section, planks running along the depth)
    g += `<path d="M${BED.xfl} ${BED.yf} L${BED.xfr} ${BED.yf} L${f1(xAt(BED.yh, 1))} ${BED.yh} L${f1(xAt(BED.yh, -1))} ${BED.yh} Z" fill="${WOOD}" stroke="${INK}" stroke-width="4"/>`;
    for (let i = 1; i < 8; i++) { const u = i / 8; g += `<path d="M${f1(lerp(BED.xfl, BED.xfr, u))} ${BED.yf} L${f1(lerp(xAt(BED.yh, -1), xAt(BED.yh, 1), u))} ${BED.yh}" stroke="${WOOD_D}" stroke-width="3"/>`; }
    // the side boards (left and right), rising from the floor edges
    const side = (s) => { const xf = s < 0 ? BED.xfl : BED.xfr, xn = s < 0 ? BED.xnl : BED.xnr, d = s * 1;
      let p = `<path d="M${xf} ${BED.yf} L${xf + d * -6} ${BED.yf - 90} L${xn + d * -2} ${BED.yn - 190} L${xn} ${BED.yn} Z" fill="${WOOD_D}" stroke="${INK}" stroke-width="6"/>`;
      for (let i = 1; i < 4; i++) { const k = i / 4; p += `<path d="M${f1(xf - d * 6 * k)} ${f1(BED.yf - 90 * k)} L${f1(xn - d * 2 * k)} ${f1(BED.yn - 190 * k)}" stroke="#3e2e1c" stroke-width="4"/>`; }
      p += `<path d="M${xf - d * 6} ${BED.yf - 90} L${xn - d * 2} ${BED.yn - 190}" stroke="${WOOD_L}" stroke-width="10" stroke-linecap="round"/>`;
      return p; };
    g += side(-1) + side(1);
    return g;
  }
  // the tailgate (down), the bumper, the tail lights, the wheels, the road under the truck (static, in front)
  function tailgate() {
    let g = `<path d="M${BED.xnl} ${BED.yn} L${BED.xnr} ${BED.yn} L${BED.xnr + 30} 1120 L${BED.xnl - 30} 1120 Z" fill="${WOOD}" stroke="${INK}" stroke-width="5"/>`;
    for (let i = 1; i < 3; i++) g += `<path d="M${BED.xnl - 10 * i} ${1000 + 40 * i} L${BED.xnr + 10 * i} ${1000 + 40 * i}" stroke="${WOOD_D}" stroke-width="3"/>`;
    g += `<path d="M${BED.xnl - 30} 1120 L${BED.xnr + 30} 1120 L${BED.xnr + 30} 1146 L${BED.xnl - 30} 1146 Z" fill="#3a3a3a" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="${BED.xnl - 10}" y="1146" width="${BED.xnr - BED.xnl + 20}" height="40" fill="#1e2226" stroke="${INK}" stroke-width="4"/>`;
    [BED.xnl + 20, BED.xnr - 70].forEach(x => { g += `<rect x="${x}" y="1152" width="50" height="26" rx="4" fill="#c4362c" stroke="${INK}" stroke-width="3"/>` + wash(x + 25, 1165, 70, 30, '#ff5040', 0.25); });
    [BED.xnl + 60, BED.xnr - 60].forEach(x => { g += `<rect x="${x - 60}" y="1186" width="120" height="110" rx="20" fill="#0e1012" stroke="${INK}" stroke-width="4"/>`; });
    return g;
  }
  // the hatch angle from k (0 closed .. 1 fully up)
  const thetaOf = k => clamp(k, 0, 1) * 78 * Math.PI / 180;
  // the cavity under the hatch, packed with green bricks lying flat (stickers up), lit by the torch
  function cavity(tt, lit) {
    const yh = BED.yh, yn = BED.yn;
    const poly = `M${f1(xAt(yh, -1))} ${yh} L${f1(xAt(yh, 1))} ${yh} L${BED.xnr} ${yn} L${BED.xnl} ${yn} Z`;
    let g = `<defs><clipPath id="hc95cav"><path d="${poly}"/></clipPath></defs><path d="${poly}" fill="#0c0d0a" stroke="${INK}" stroke-width="4"/>`;
    g += `<g clip-path="url(#hc95cav)">`;
    const rows = [[848, 0.56], [900, 0.66], [958, 0.78]];
    rows.forEach(([y, s], r) => { const xl = xAt(y, -1), xr = xAt(y, 1), bw = 168 * s, n = Math.ceil((xr - xl) / bw) + 1;
      for (let i = 0; i < n; i++) { const x = xl + (i + 0.5 + (r % 2) * 0.35) * bw - bw * 0.2; g += gBrick(x, y, bw * 0.94, 92 * s, ((i * 7 + r * 3) % 5 - 2) * 1.2, lit); } });
    g += `</g>` + wash(540, 905, 300, 110, GLOW, f1(0.22 * lit));
    // the cavity walls: the inner rim (it is a box under the floor: a false bottom)
    g += `<path d="${poly}" fill="none" stroke="#2a2016" stroke-width="10" opacity="0.8"/>`;
    return g;
  }
  // the hatch itself, lifted by angle th about the hinge line y = BED.yh: its underside faces the camera
  function hatch(th) {
    const L = BED.yn - BED.yh, ye = BED.yh + L * Math.cos(th) - 300 * Math.sin(th);
    const u = (1 - Math.cos(th)) * 0.85, xl = lerp(BED.xnl, xAt(BED.yh, -1), u) - 10 * Math.sin(th), xr = lerp(BED.xnr, xAt(BED.yh, 1), u) + 10 * Math.sin(th);
    const hl = xAt(BED.yh, -1), hr = xAt(BED.yh, 1);
    // a dark gap under the hinge (the hatch is a separate panel), then the pale plywood underside facing the camera
    let g = `<path d="M${f1(hl - 6)} ${BED.yh - 4} L${f1(hr + 6)} ${BED.yh - 4} L${f1(hr + 6)} ${BED.yh + 10} L${f1(hl - 6)} ${BED.yh + 10} Z" fill="#050504"/>`;
    g += `<path d="M${f1(hl)} ${BED.yh} L${f1(hr)} ${BED.yh} L${f1(xr)} ${f1(ye)} L${f1(xl)} ${f1(ye)} Z" fill="#b8955e" stroke="${INK}" stroke-width="6"/>`;
    const P = (u, v) => [lerp(lerp(hl, hr, u), lerp(xl, xr, u), v), lerp(BED.yh, ye, v)];
    // the underside's frame battens and a Z-brace (it reads as the back of a panel, not as floor)
    const bat = (a, b, w) => { const [x1, y1] = P(...a), [x2, y2] = P(...b); return `<path d="M${f1(x1)} ${f1(y1)} L${f1(x2)} ${f1(y2)}" stroke="#6a4c2a" stroke-width="${w}" stroke-linecap="round"/><path d="M${f1(x1)} ${f1(y1 - w * 0.35)} L${f1(x2)} ${f1(y2 - w * 0.35)}" stroke="#d8ba86" stroke-width="3" opacity="0.7"/>`; };
    g += bat([0.05, 0.18], [0.95, 0.18], 20) + bat([0.05, 0.82], [0.95, 0.82], 20) + bat([0.08, 0.2], [0.92, 0.8], 16);
    for (let i = 1; i < 6; i++) { const [x1, y1] = P(i / 6, 0), [x2, y2] = P(i / 6, 1); g += `<path d="M${f1(x1)} ${f1(y1)} L${f1(x2)} ${f1(y2)}" stroke="#8a6a40" stroke-width="2" opacity="0.6"/>`; }
    // the hatch's thick top edge (the false floor's thickness), lit by the torch
    g += `<path d="M${f1(xl)} ${f1(ye)} L${f1(xr)} ${f1(ye)} L${f1(xr + 4)} ${f1(ye - 24)} L${f1(xl - 4)} ${f1(ye - 24)} Z" fill="${WOOD_L}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M${f1(xl + 10)} ${f1(ye - 20)} L${f1(xr - 10)} ${f1(ye - 20)}" stroke="#ffe2a8" stroke-width="5" opacity="0.8" stroke-linecap="round"/>`;
    return { svg: g, xl, xr, ye };
  }
  // the whole hero prop stack for the hook and the end (k(t) = the hatch opening)
  const SPILL = [[392, 1068, 0.92, -14], [700, 1080, 0.95, 18], [560, 1235, 1.32, -6], [330, 1290, 1.18, 24], [810, 1300, 1.22, -20]];
  function heroProps(k) {
    return [
      { depth: 1.0, svg: () => truckRear() },
      { depth: 1.01, accent: true, svg: tt => { const kk = k(tt), th = thetaOf(kk), lit = 0.6 + 0.4 * clamp((kk - 0.3) / 0.7, 0, 1); const hz = hatch(th);
          // one brick riding out over the lip as the hatch rises (it slides back with the hatch in the end scene)
          const sl = clamp((kk - 0.45) / 0.55, 0, 1), bx = lerp(520, 585, sl), by = lerp(985, 1040, sl);
          return cavity(tt, lit) + hz.svg + tailgate() + gBrick(bx, by, 150, 84, lerp(-4, 12, sl), lit) + beam(tt); } },
      { depth: 1.02, accent: true, svg: () => SPILL.map(([x, y, s, r]) => gBrick(x, y, 172 * s, 98 * s, r)).join('') + wash(560, 1240, 360, 110, GLOW, 0.1) },
      { depth: 1.04, svg: tt => { const hz = hatch(thetaOf(k(tt)));
          const L = [hz.xl + 26, hz.ye + 4];
          // the camera-side officer's left arm lifts the hatch by its corner (the torch officer lights it from the right)
          return sleeve(-40, 1980, L[0] - 60, L[1] + 70, 160, 104) + glove(L[0], L[1], 0.95, 1, -62); } }
    ];
  }
  // the torch officer's beam, from his torch (probed from the rig) down into the cavity
  const TIP = [876, 757];   // hc95_officer 'torch' at (1010, 1000), scale 0.44, dir -1: tip local (304.5, -552.5)
  function beam(tt) {
    const tx = 560, ty = 930;   // static: the end frame must match frame 0
    const a = Math.atan2(ty - TIP[1], tx - TIP[0]), L = Math.hypot(tx - TIP[0], ty - TIP[1]) * 1.15, sp = 0.2;
    const p1 = [TIP[0] + Math.cos(a - sp) * L, TIP[1] + Math.sin(a - sp) * L], p2 = [TIP[0] + Math.cos(a + sp) * L, TIP[1] + Math.sin(a + sp) * L];
    return `<g style="mix-blend-mode:screen"><path d="M${TIP[0]} ${TIP[1]} L${f1(p1[0])} ${f1(p1[1])} L${f1(p2[0])} ${f1(p2[1])} Z" fill="#fff0c8" opacity="0.2"/>` + wash(tx, ty, 220, 100, '#fff0c8', 0.2) + `</g><circle cx="${TIP[0]}" cy="${TIP[1]}" r="9" fill="#fff6d8"/>` + wash(TIP[0], TIP[1], 40, 40, '#fff6d8', 0.5);
  }
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 0, y: -24, z: 1.09 };
  const TORCH = { id: 'hc95_officer', x: 1010, y: 1000, scale: 0.44, dir: -1, turn: 0.4, pose: 'torch', expr: 'focused', depth: 0.99, hat: { style: 'cap', color: '#2c3328' }, propOpts: { beamLen: 520, aim: 64 } };
  const K0 = 0.66;

  // ---------- vehicles and other props
  // the truck side-on (facing right) on the highway, for the gotcha: cab at the right, the cargo bed with wooden side
  // boards; cut 0..1 = the cutaway on the false bottom (a window in the bed's lower side on the hidden green bricks)
  function truckSide(x, y, s, cut, t) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="-380" cy="8" rx="560" ry="22" fill="#000" opacity="0.35"/>`;
    // chassis
    g += `<rect x="-860" y="-150" width="1020" height="40" fill="#22262a" stroke="${INK}" stroke-width="5"/>`;
    // the cargo bed: floor band (where the false bottom is) and the side boards above it
    g += `<rect x="-860" y="-250" width="700" height="100" fill="${WOOD_D}" stroke="${INK}" stroke-width="6"/>`;
    g += `<rect x="-860" y="-560" width="700" height="310" fill="${WOOD}" stroke="${INK}" stroke-width="6"/>`;
    for (let i = 1; i < 5; i++) g += `<path d="M-860 ${-560 + i * 62} L-160 ${-560 + i * 62}" stroke="${WOOD_D}" stroke-width="5"/>`;
    for (let i = 0; i < 6; i++) g += `<rect x="${-850 + i * 136}" y="-566" width="16" height="320" fill="#5a422a" stroke="${INK}" stroke-width="3"/>`;
    // cab
    g += `<path d="M-150 -110 L-150 -470 Q-140 -500 -100 -504 L40 -504 Q80 -500 96 -460 L150 -300 Q164 -260 164 -200 L164 -110 Z" fill="#3e5a72" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-90 -470 L30 -470 L74 -330 L-90 -330 Z" fill="#1c2a36" stroke="${INK}" stroke-width="4"/>` + wash(-20, -400, 90, 50, '#8ab0d0', 0.18);
    g += `<rect x="150" y="-200" width="26" height="50" rx="4" fill="#efe6c4" stroke="${INK}" stroke-width="3"/>` + wash(200, -175, 90, 40, '#fff2c8', 0.4);
    [-740, -620, 40].forEach(wx => { g += `<circle cx="${wx}" cy="-70" r="66" fill="#121416" stroke="${INK}" stroke-width="6"/><circle cx="${wx}" cy="-70" r="26" fill="#6e7276"/>`; });
    // the cutaway window on the floor band: the false bottom's hidden layer of green bricks
    if (cut > 0.001) {
      const w = 680 * clamp(cut, 0, 1);
      g += `<defs><clipPath id="hc95cut"><rect x="-850" y="-246" width="${f1(w)}" height="92"/></clipPath></defs><g clip-path="url(#hc95cut)"><rect x="-850" y="-246" width="680" height="92" fill="#0e0f0c"/>`;
      for (let i = 0; i < 9; i++) g += `<g transform="translate(${-810 + i * 76} -200)"><rect x="-34" y="-30" width="68" height="60" rx="8" fill="${PK}" stroke="${INK}" stroke-width="3"/>${sticker(0, -2, 40, 34)}</g>`;
      g += wash(-510, -200, 380, 70, GLOW, 0.25) + `</g>`;
      g += `<rect x="-850" y="-246" width="${f1(w)}" height="92" fill="none" stroke="${ACC}" stroke-width="5" stroke-dasharray="18 10" opacity="${f1(0.6 + 0.4 * Math.sin(t * 6))}"/>`;
      g += `<path d="M-856 -252 L${f1(-856 + w)} -252" stroke="#d8c49a" stroke-width="6" opacity="0.8"/>`;
    }
    return g + '</g>';
  }
  // a generic hatchback, rear three-quarter view, hatch up; o.floor 0..1 = the boot floor panel lifted on stamped bricks
  function hatchback(x, y, s, o = {}) {
    const fl = clamp(o.floor ?? 1, 0, 1);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="10" rx="360" ry="26" fill="#000" opacity="0.45"/>`;
    g += `<path d="M-330 -20 L-330 -230 Q-320 -270 -280 -280 L280 -280 Q320 -270 330 -230 L330 -20 Z" fill="#4a4e58" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-250 -280 L-200 -460 L200 -460 L250 -280 Z" fill="#3c4048" stroke="${INK}" stroke-width="6"/>`;
    // the hatch, swung up
    g += `<path d="M-240 -470 L240 -470 L210 -620 L-210 -620 Z" fill="#555a64" stroke="${INK}" stroke-width="6"/><path d="M-200 -490 L200 -490 L180 -600 L-180 -600 Z" fill="#1a1e24"/>`;
    // the boot opening and the lifted floor panel on the bricks
    g += `<path d="M-250 -280 L250 -280 L270 -60 L-270 -60 Z" fill="#0e1012" stroke="${INK}" stroke-width="5"/>`;
    const r = R(9561); let b = '';
    for (let row = 0; row < 2; row++) for (let i = 0; i < 4; i++) b += tBrick(-180 + i * 120 + row * 20, -110 - row * 70 + (r() - 0.5) * 6, 112, 60, (r() - 0.5) * 8, 'THE GODFATHER', { fs: 10.5 });
    g += b + wash(0, -150, 240, 110, GLOW, 0.22);
    g += `<path d="M-250 ${f1(-280 + 10 * fl)} L250 ${f1(-280 + 10 * fl)} L230 ${f1(-280 - 150 * fl)} L-230 ${f1(-280 - 150 * fl)} Z" fill="#2a2c30" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="-330" y="-60" width="660" height="50" rx="10" fill="#2a2d33" stroke="${INK}" stroke-width="5"/>`;
    [-290, 230].forEach(xx => { g += `<rect x="${xx}" y="-210" width="60" height="44" rx="6" fill="#b4302a" stroke="${INK}" stroke-width="3"/>`; });
    g += `<rect x="-90" y="-50" width="180" height="34" rx="4" fill="#20232a" stroke="${INK}" stroke-width="3"/>`;   // blank plate holder
    [-250, 250].forEach(xx => { g += `<rect x="${xx - 50}" y="-14" width="100" height="40" rx="12" fill="#0d0e10"/>`; });
    return g + '</g>';
  }
  // a generic high-wing light plane, side view, facing right (no registration, no livery); spin = propeller phase
  function plane(x, y, s, spin) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    g += `<path d="M-150 -6 Q-170 -10 -190 -46 L-170 -48 L-120 -16 Z" fill="#c8c4b8" stroke="${INK}" stroke-width="4"/>`;   // fin
    g += `<path d="M-180 0 Q-120 -26 40 -30 Q96 -30 112 -8 Q116 12 96 18 L-120 14 Q-170 10 -180 0 Z" fill="#dedad0" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M10 -28 L70 -28 Q90 -26 98 -10 L20 -10 Z" fill="#26343e" stroke="${INK}" stroke-width="3"/>`;
    g += `<path d="M-60 -42 L110 -42 L112 -32 L-58 -32 Z" fill="#cfcabd" stroke="${INK}" stroke-width="4"/>`;            // high wing (edge-on)
    g += `<path d="M40 -32 L60 -6 M80 -32 L70 -8" stroke="${INK}" stroke-width="4"/>`;                                     // struts
    g += `<path d="M30 18 L22 40 M70 18 L78 40" stroke="${INK}" stroke-width="4"/><circle cx="20" cy="44" r="8" fill="#141414"/><circle cx="80" cy="44" r="8" fill="#141414"/>`;
    g += `<ellipse cx="120" cy="-6" rx="${f1(6 + 4 * Math.abs(Math.sin(spin)))}" ry="34" fill="#e8e4da" opacity="0.4"/>`;
    return g + '</g>';
  }
  // a generic dark pickup, side view facing left, at ground (x, y), scale s
  function pickup(x, y, s) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="6" rx="230" ry="16" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-220 -40 L-220 -100 Q-210 -116 -180 -118 L-120 -118 L-80 -176 L20 -176 Q40 -174 46 -150 L50 -118 L220 -118 L222 -40 Z" fill="#2c3036" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-108 -122 L-76 -166 L-10 -166 L-10 -122 Z" fill="#c88a5a" opacity="0.55" stroke="${INK}" stroke-width="3"/><path d="M2 -122 L2 -166 L30 -166 L36 -122 Z" fill="#c88a5a" opacity="0.5" stroke="${INK}" stroke-width="3"/>`;
    [-140, 150].forEach(wx => { g += `<circle cx="${wx}" cy="-34" r="38" fill="#121416" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-34" r="14" fill="#5a5e62"/>`; });
    return g + '</g>';
  }
  // a firewood truck from behind (the load: a stack of log ends in a high-sided bed); pull 0..1 = one log dragged out
  // toward the camera, showing the bricks marked YOUTUBE behind it
  const LOGS = (() => { const r = R(9571), a = []; for (let row = 0; row < 5; row++) for (let i = 0; i < 6; i++) a.push([-250 + i * 100 + (row % 2) * 48 + (r() - 0.5) * 10, -120 - row * 86 + (r() - 0.5) * 8, 44 + r() * 9]); return a; })();
  const PULL_I = 14, GAP = [15, 8];   // the log pulled out, and the two beside it that come with it (the gap shows the bricks)
  function logEnd(x, y, r_) {
    let g = `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r_)}" fill="#c89a62" stroke="#3a2614" stroke-width="5"/>`;
    for (let i = 1; i < 4; i++) g += `<circle cx="${f1(x + i * 1.2)}" cy="${f1(y - i * 0.8)}" r="${f1(r_ * (1 - i * 0.24))}" fill="none" stroke="#9a6e40" stroke-width="2.5"/>`;
    return g + `<path d="M${f1(x)} ${f1(y)} l${f1(r_ * 0.5)} ${f1(-r_ * 0.4)}" stroke="#7a522c" stroke-width="2.5"/>`;
  }
  function woodTruck(x, y, s, pull) {
    const p = clamp(pull, 0, 1);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="12" rx="380" ry="26" fill="#000" opacity="0.3"/>`;
    g += `<rect x="-330" y="-40" width="660" height="40" fill="#2a2c2e" stroke="${INK}" stroke-width="5"/>`;
    [-250, 250].forEach(xx => { g += `<rect x="${xx - 64}" y="-10" width="128" height="104" rx="20" fill="#0e1012" stroke="${INK}" stroke-width="4"/>`; });
    g += `<rect x="-320" y="-560" width="640" height="520" fill="#6a5a44" stroke="${INK}" stroke-width="6"/>`;   // the bed's rear frame
    g += `<rect x="-300" y="-540" width="600" height="490" fill="#1c1610"/>`;
    // the hidden bricks behind the pulled log (plain typed word only)
    const [px, py, pr] = LOGS[PULL_I];
    g += tBrick(px + 60, py - 6, 150, 84, 5, 'YOUTUBE', { fs: 20, fill: '#d8d2c4' }) + tBrick(px + 30, py + 78, 160, 90, -4, 'YOUTUBE', { fs: 22, fill: '#d8d2c4' });
    g += wash(px, py, 90, 70, GLOW, f1(0.35 * p));
    LOGS.forEach(([lx, ly, lr], i) => { if (i !== PULL_I && !(p > 0.02 && GAP.includes(i))) g += logEnd(lx, ly, lr); });
    [-280, 280].forEach(xx => { g += `<rect x="${xx - 18}" y="-600" width="36" height="560" fill="#4a3e2e" stroke="${INK}" stroke-width="4"/>`; });
    g += `<rect x="-300" y="-36" width="70" height="26" rx="4" fill="#b4302a"/><rect x="230" y="-36" width="70" height="26" rx="4" fill="#b4302a"/>`;
    // the pulled log, last, sliding out toward the camera and down-left; the two beside it tumble out after it
    const e = ease.inOut(p);   // the pull runs down-left, below the officer's head
    if (p > 0.02) GAP.forEach((j, n) => { const [gx, gy, gr] = LOGS[j], ee = ease.inOut(clamp((p - 0.1 * (n + 1)) / 0.8, 0, 1)); g += logEnd(lerp(gx, gx - 160 - 60 * n, ee), lerp(gy, gy + 330 - 40 * n, ee), lerp(gr, gr * 1.3, ee)); });
    const lx = lerp(px, px - 220, e), ly = lerp(py, py + 330, e), lr = lerp(LOGS[PULL_I][2], LOGS[PULL_I][2] * 1.5, e);
    if (p > 0.02) g += `<path d="M${f1(px)} ${f1(py - pr)} L${f1(lx)} ${f1(ly - lr)} L${f1(lx)} ${f1(ly + lr)} L${f1(px)} ${f1(py + pr)} Z" fill="#6a4a2a" stroke="${INK}" stroke-width="4"/>`;
    g += logEnd(lx, ly, lr);
    return g + '</g>';
  }
  // a falling bundle (a taped brick tumbling), for the plane drop
  const bundle = (x, y, s, rot) => tBrick(x, y, 70 * s, 40 * s, rot, null, { fill: '#cdb48a' });

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a highway lay-by in the Andes at night: a deep blue sky, two mountain ridges, a few far road lights, a police
    // pickup's blue glow far left (static), the asphalt (the truck itself is a prop)
    hc95_night(ctx, o = {}) {
      let sky = `<defs><linearGradient id="hc95ns" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#08121c"/><stop offset="1" stop-color="#1e2e3e"/></linearGradient></defs><rect x="-600" y="-400" width="${W + 1200}" height="1300" fill="url(#hc95ns)"/>`;
      sky += E.cine.stars(0, 50, 951, -300, 520);
      sky += `<path d="M-600 700 L-420 560 L-260 610 L-60 470 L120 560 L300 500 L520 590 L700 470 L900 560 L1100 500 L1300 600 L1680 520 L1680 900 L-600 900 Z" fill="#162330"/>`;
      let mid = `<path d="M-600 760 L-380 650 L-180 700 L40 620 L260 690 L480 640 L700 700 L940 630 L1180 700 L1680 650 L1680 940 L-600 940 Z" fill="#101a24"/>`;
      const r = R(952); for (let i = 0; i < 9; i++) { const x = -300 + i * 190 + r() * 40, y = 700 + r() * 40; mid += `<circle cx="${f1(x)}" cy="${f1(y)}" r="3.5" fill="#ffc870" opacity="0.8"/>` + wash(x, y, 26, 12, '#ffc870', 0.3); }
      mid += `<rect x="-330" y="740" width="150" height="54" rx="12" fill="#1a222c" stroke="${INK}" stroke-width="4"/><rect x="-300" y="726" width="90" height="14" rx="4" fill="#3a6cff"/>` + wash(-255, 740, 260, 120, '#3a6cff', 0.26);
      const road = `<rect x="-600" y="760" width="${W + 1200}" height="${H}" fill="#24282d"/>` + wash(540, 1500, 900, 400, '#3a4048', 0.25) + `<path d="M-600 800 L${W + 600} 800" stroke="#c8b070" stroke-width="5" opacity="0.25"/>`;
      return { light: { dir: -1, rim: '#8ab0e0', key: '#d8d4c8' }, layers: [[0.05, sky], [0.3, mid], [0.8, road]] };
    },
    // the Pan-American Highway at blue hour: a pale dawn behind the ridges, eucalyptus on the verge, a guard rail, the road
    hc95_dawn(ctx, o = {}) {
      let sky = `<defs><linearGradient id="hc95ds" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#20304a"/><stop offset="0.65" stop-color="#6a7e98"/><stop offset="1" stop-color="#d8b898"/></linearGradient></defs><rect x="-600" y="-400" width="${W + 1200}" height="1400" fill="url(#hc95ds)"/>` + wash(760, 900, 520, 160, '#ffd8b0', 0.3);
      sky += `<path d="M-600 940 L-360 760 L-160 830 L60 700 L300 820 L520 740 L760 860 L980 760 L1200 840 L1680 760 L1680 1100 L-600 1100 Z" fill="#46566a"/>`;
      let mid = `<path d="M-600 1000 L-300 900 L0 960 L340 880 L640 960 L940 900 L1680 960 L1680 1120 L-600 1120 Z" fill="#33404c"/>`;
      const r = R(953); for (let i = 0; i < 10; i++) { const x = -500 + i * 230 + r() * 60, h = 260 + r() * 160; mid += `<path d="M${f1(x)} 1060 L${f1(x + 6)} ${f1(1060 - h)} L${f1(x + 14)} 1060 Z" fill="#283038"/><ellipse cx="${f1(x + 8)}" cy="${f1(1060 - h * 0.85)}" rx="${f1(50 + r() * 20)}" ry="${f1(h * 0.28)}" fill="#2c363e"/>`; }
      mid += `<path d="M-600 1110 L${W + 600} 1110" stroke="#9aa2aa" stroke-width="10"/>` + Array.from({ length: 16 }, (_, i) => `<rect x="${-560 + i * 140}" y="1106" width="10" height="40" fill="#7a828a"/>`).join('');
      const road = `<rect x="-600" y="1140" width="${W + 1200}" height="${H}" fill="#4a4e54"/><path d="M-600 1180 L${W + 600} 1180" stroke="#e8e2d0" stroke-width="8" opacity="0.6"/><path d="M-600 1500 L${W + 600} 1500" stroke="#e2c23b" stroke-width="10" stroke-dasharray="120 80" opacity="0.5"/>`;
      return { light: { dir: 1, rim: '#ffd8b0', key: '#d8dce4' }, layers: [[0.05, sky], [0.35, mid], [0.82, road]] };
    },
    // a warehouse at night: a corrugated wall, high racks with dark pallets, strip lights, a roller door's sodium glow, the
    // concrete floor (the stamped pallets are props)
    hc95_wh(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="#2c343a"/>`;
      for (let x = -500; x < W + 500; x += 40) back += `<rect x="${x}" y="-400" width="18" height="1500" fill="#262e34"/>`;
      back += [0, 1].map(i => `<rect x="${120 + i * 520}" y="110" width="320" height="18" rx="8" fill="#f2eee0" opacity="0.85"/>`).join('') + wash(540, 360, 760, 380, '#f2eee0', 0.08);
      let racks = '';
      [[-300, 0], [760, 0]].forEach(([x0]) => { for (let lv = 0; lv < 3; lv++) { const y = 420 + lv * 230; racks += `<rect x="${x0}" y="${y}" width="620" height="16" fill="#c06a2a" stroke="${INK}" stroke-width="3"/>`;
          for (let i = 0; i < 4; i++) racks += `<rect x="${x0 + 20 + i * 150}" y="${y - 120}" width="130" height="120" fill="${(i + lv) % 2 ? '#3e3a32' : '#46423a'}" stroke="${INK}" stroke-width="3"/>`; }
        racks += `<rect x="${x0}" y="180" width="16" height="1020" fill="#3a6a9a" stroke="${INK}" stroke-width="3"/><rect x="${x0 + 604}" y="180" width="16" height="1020" fill="#3a6a9a" stroke="${INK}" stroke-width="3"/>`; });
      racks += `<rect x="330" y="560" width="420" height="640" fill="#1a1612" stroke="${INK}" stroke-width="6"/>` + wash(540, 900, 260, 320, '#ffb460', 0.22);
      const floor = `<rect x="-500" y="1200" width="${W + 1000}" height="${H}" fill="#4c4f50"/><path d="M-500 1240 L${W + 500} 1240" stroke="#e2c23b" stroke-width="12" opacity="0.35"/>`;
      return { light: { dir: -1, rim: '#ffd59a', key: '#e6e2d6' }, layers: [[0.1, back], [0.45, racks], [0.82, floor]] };
    },
    // a country road stop at night: a dark hillside with olive trees, a blank road-sign post, a far blue glow, the asphalt
    hc95_stop(ctx, o = {}) {
      let sky = `<rect x="-600" y="-400" width="${W + 1200}" height="1300" fill="#0c141c"/>` + E.cine.stars(0, 40, 954, -300, 600);
      sky += `<path d="M-600 900 Q-200 760 200 840 Q600 900 1000 780 Q1300 720 1680 820 L1680 1100 L-600 1100 Z" fill="#141c22"/>`;
      let mid = ''; const r = R(955);
      for (let i = 0; i < 8; i++) { const x = -300 + i * 230 + r() * 60, y = 900 + r() * 50; mid += `<path d="M${f1(x)} ${f1(y + 40)} L${f1(x + 4)} ${f1(y)}" stroke="#0a0e12" stroke-width="10"/><ellipse cx="${f1(x)}" cy="${f1(y - 20)}" rx="${f1(60 + r() * 20)}" ry="${f1(36 + r() * 10)}" fill="#18222a"/>`; }
      mid += `<rect x="760" y="760" width="12" height="260" fill="#5a6066"/><rect x="700" y="700" width="140" height="80" rx="6" fill="#3a4450" stroke="${INK}" stroke-width="3"/>`;
      mid += wash(1100, 980, 260, 120, '#3a6cff', 0.2);
      const road = `<rect x="-600" y="1020" width="${W + 1200}" height="${H}" fill="#202428"/><path d="M-600 1060 L${W + 600} 1060" stroke="#e8e2d0" stroke-width="6" opacity="0.35"/>` + wash(700, 1400, 600, 260, '#3a4048', 0.2);
      return { light: { dir: 1, rim: '#8ab0e0', key: '#d0d0d0' }, layers: [[0.05, sky], [0.35, mid], [0.82, road]] };
    },
    // grassland at dusk: a violet-to-amber sky, a low sun glow, rolling hills, a line of eucalyptus, a wire fence, grass
    hc95_pampa(ctx, o = {}) {
      let sky = `<defs><linearGradient id="hc95ps" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c2a4a"/><stop offset="0.6" stop-color="#b8706a"/><stop offset="1" stop-color="#eab070"/></linearGradient></defs><rect x="-600" y="-400" width="${W + 1200}" height="1500" fill="url(#hc95ps)"/>` + wash(820, 1000, 420, 160, '#ffd090', 0.4);
      let hills = `<path d="M-600 1040 Q-200 960 200 1010 Q600 1060 1000 980 Q1300 940 1680 1000 L1680 1300 L-600 1300 Z" fill="#5a5a38"/>`;
      const r = R(956); for (let i = 0; i < 14; i++) { const x = -400 + i * 110 + r() * 30, h = 170 + r() * 90; hills += `<path d="M${f1(x)} 1030 L${f1(x + 5)} ${f1(1030 - h)} L${f1(x + 11)} 1030 Z" fill="#2a2a1e"/><ellipse cx="${f1(x + 6)}" cy="${f1(1030 - h * 0.8)}" rx="${f1(30 + r() * 14)}" ry="${f1(h * 0.3)}" fill="#33331f"/>`; }
      let field = `<path d="M-600 1100 Q0 1060 600 1110 Q1100 1150 1680 1090 L1680 ${H + 400} L-600 ${H + 400} Z" fill="#6e7a3c"/>`;
      for (let i = 0; i < 80; i++) { const x = -400 + r() * 1900, y = 1150 + r() * 700; field += `<path d="M${f1(x)} ${f1(y)} l${f1(-4 + r() * 8)} ${f1(-18 - r() * 16)}" stroke="${r() > 0.5 ? '#8a9448' : '#556028'}" stroke-width="3"/>`; }
      field += Array.from({ length: 9 }, (_, i) => `<rect x="${-300 + i * 200}" y="1360" width="12" height="120" fill="#4a3a26"/>`).join('') + `<path d="M-400 1380 L1500 1380 M-400 1420 L1500 1420" stroke="#8a8a80" stroke-width="2.5" opacity="0.7"/>`;
      return { light: { dir: 1, rim: '#ffcf8a', key: '#efd8b8' }, layers: [[0.05, sky], [0.35, hills], [0.82, field]] };
    },
    // a rural road verge by day: a pale late-afternoon sky, low hills, a fence line, the road and a grass verge
    hc95_route(ctx, o = {}) {
      let sky = `<defs><linearGradient id="hc95rs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8aa4b8"/><stop offset="1" stop-color="#e2d4b4"/></linearGradient></defs><rect x="-600" y="-400" width="${W + 1200}" height="1500" fill="url(#hc95rs)"/>` + wash(300, 760, 500, 200, '#fff0c8', 0.3);
      let hills = `<path d="M-600 960 Q-100 880 400 930 Q900 980 1680 900 L1680 1200 L-600 1200 Z" fill="#7e8a5a"/>`;
      const r = R(957); for (let i = 0; i < 7; i++) { const x = -300 + i * 260 + r() * 60; hills += `<ellipse cx="${f1(x)}" cy="${f1(930 + r() * 20)}" rx="${f1(70 + r() * 30)}" ry="${f1(40 + r() * 10)}" fill="#5e6a40"/>`; }
      const road = `<rect x="-600" y="1060" width="${W + 1200}" height="260" fill="#5e6062"/><path d="M-600 1180 L${W + 600} 1180" stroke="#e8e2d0" stroke-width="8" stroke-dasharray="100 80" opacity="0.6"/>` +
        `<path d="M-600 1320 L${W + 600} 1320 L${W + 600} ${H + 400} L-600 ${H + 400} Z" fill="#7a8a48"/>` + Array.from({ length: 60 }, (_, i) => { const x = -400 + r() * 1900, y = 1340 + r() * 600; return `<path d="M${f1(x)} ${f1(y)} l${f1(-4 + r() * 8)} ${f1(-16 - r() * 14)}" stroke="#5e6c32" stroke-width="3"/>`; }).join('');
      return { light: { dir: -1, rim: '#fff0c8', key: '#efe6d0' }, layers: [[0.05, sky], [0.35, hills], [0.82, road]] };
    }
  });

  E.registerScenes({
    // 1 - HOOK (frame 0): the truck's open rear at night; the gloved hands lift the false floor (already open, still
    //     rising) on the cavity of green sticker bricks; bricks spilled over the tailgate; the torch officer at the right;
    //     the camera already pushing in; he turns on line 1's end and points on "truck"
    hc95_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.55), tk = WT(ctx, 1, 6, 3.9);
      const k = tt => K0 + (1 - K0) * ease.inOut(seg(tt, 0.0, 1.2));
      return E.cine.shot(ctx, {
        set: 'hc95_night', grade: 'night', haze: 0.25,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [{ ...TORCH, keys: [{ at: 0.15, headTurn: 0.2, dur: 0.5 }, { at: l2 + 0.05, pose: 'torch', expr: 'realise', headTurn: 0.4, dur: 0.4 }, { at: tk, pose: 'point', expr: 'stern', headTurn: 0.3, dur: 0.4 }] }],
        props: heroProps(k),
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.3), x: 60, y: 560, text: 'NEAR TULCÁN, ECUADOR · AUG 2026', fs: 34, typeDur: 0.6, sub: "Ecuador's police · 1 arrested, not named" },
          { type: 'callout', at: Math.max(3.4, tk - 0.3), target: [560, 1235], label: [1040, 1250], anchor: 'end', w: 500, fs: 30, text: "STICKERS OF HAALAND'S FACE", sub: 'He has no link to the shipment', r: 80, depth: 1.02 }
        ],
        tag: TAG
      });
    },

    // 2 - THE GOTCHA: the highway at blue hour; the truck side-on, stopped; the officer in the foreground radios on "tip";
    //     on "false" he points and the bed's lower side opens into the cutaway on the hidden green bricks (the single
    //     impact on "bottom"); the 469 KG counter
    hc95_bottom(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.55), tp = WT(ctx, 0, 1, 0.69), fs = WT(ctx, 0, 6, 1.84), bt = WT(ctx, 0, 7, 2.19);
      const cut = tt => ease.inOut(seg(tt, fs - 0.05, bt + 0.25));
      return E.cine.shot(ctx, {
        set: 'hc95_dawn', grade: 'dawn', haze: 0.3,
        cam: { from: { x: 20, y: 20, z: 1.04 }, to: { x: -10, y: 30, z: 1.12 } },
        figures: [
          { id: 'hc95_officer', x: 140, y: 1880, scale: 0.92, dir: 1, turn: 0.4, pose: 'stand', expr: 'focused', depth: 1.04, hat: { style: 'cap', color: '#2c3328' },
            keys: [{ at: l1 - 0.2, headTurn: 0.25, dur: 0.4 }, { at: tp - 0.05, pose: 'hand_to_face', expr: 'focused', dur: 0.35 }, { at: fs - 0.05, pose: 'point', expr: 'determined', headTurn: 0.1, dur: 0.35 }, { at: bt + 0.7, pose: 'torch_low', expr: 'stern', dur: 0.4 }] }
        ],
        props: [{ depth: 0.98, accent: true, svg: tt => truckSide(880, 1330, 0.92, cut(tt), tt) }],
        overlays: [
          { type: 'label', at: tp, until: bt - 0.15, x: 60, y: 560, text: 'ANONYMOUS TIP · PAN-AMERICAN HIGHWAY', fs: 30, typeDur: 0.6, sub: 'Anti-narcotics police search a truck' },
          { type: 'impact', at: bt, x: 560, y: 1145 },
          { type: 'counter', at: bt + 0.05, dur: 0.9, from: 0, to: 469, suffix: ' KG', label: 'COCAINE · ABOUT 1,034 LB (AP)', y: 610, fs: 110 },
          { type: 'callout', at: bt + 0.3, target: [600, 1145], label: [1040, 960], anchor: 'end', w: 440, fs: 32, text: 'FALSE BOTTOM', sub: 'Haaland has no link to it', r: 50, depth: 0.98 }
        ],
        tag: TAG
      });
    },

    // 3 - REHOOK + CASE 2: a Lisbon warehouse at night; pallets of taped bricks; the officer walks in left to right and on
    //     "Godfather" lifts a brick to the light: its typed stamp reads THE GODFATHER; the fun fact
    hc95_godfather(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.28), l2 = LS(ctx, 1, 2.31), gf = WT(ctx, 1, 4, 3.48);
      const OX = 330, OY = 1690, OS = 0.8;
      const up = tt => ease.inOut(seg(tt, gf - 0.25, gf + 0.3));
      return E.cine.shot(ctx, {
        set: 'hc95_wh', grade: 'warm', haze: 0.3,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 20, y: 30, z: 1.07 } },
        figures: [
          { id: 'hc95_pj', x: OX, y: OY, scale: OS, dir: 1, turn: 0.4, pose: 'walk', expr: 'neutral', depth: 1.0,
            walk: { at: 0.0, dur: Math.max(0.8, l2 - 0.3), cadence: 3.2, stride: 14, from: 110, to: OX },
            keys: [{ at: l1 + 0.1, pose: 'walk', expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: l2 - 0.2, pose: 'examine', expr: 'focused', dur: 0.4 }, { at: gf - 0.25, pose: 'point', expr: 'realise', dur: 0.4 }] }
        ],
        props: [
          // the pallets of stamped bricks (the stamp too small to read at the back; the lifted one reads)
          { depth: 0.97, accent: true, svg: () => { let g = ''; const r = R(9551);
              [[700, 1210, 5], [960, 1230, 6]].forEach(([px, py, rows]) => { g += `<rect x="${px - 150}" y="${py}" width="300" height="24" fill="#8a6a46" stroke="${INK}" stroke-width="4"/>`;
                for (let row = 0; row < rows; row++) for (let i = 0; i < 3; i++) g += tBrick(px - 96 + i * 96 + (row % 2) * 8, py - 26 - row * 52, 92, 48, (r() - 0.5) * 4, 'THE GODFATHER', { fs: 8.5 }); });
              return g + wash(830, 1000, 300, 200, '#ffd59a', 0.12); } },
          // the top brick of the near pallet, lifting off toward the camera on "Godfather" (its stamp becomes readable)
          { depth: 1.01, accent: true, svg: tt => { const u = up(tt), x = lerp(700, 640, u), y = lerp(944, 1090, u);
              return wash(x, y, lerp(120, 240, u), lerp(60, 130, u), GLOW, f1(0.28 * u)) + tBrick(x, y, lerp(92, 330, u), lerp(48, 170, u), lerp(1, -4, u), 'THE GODFATHER', { fs: lerp(8.5, 31, u) }); } }
        ],
        overlays: [
          { type: 'funfact', at: Math.max(0.6, l1 + 0.4), x: 40, w: 1000, y: 670, fs: 38, rows: [{ text: "HAALAND'S NOT THE FIRST STAR:" }, { text: "MESSI'S FACE TURNED UP" }, { text: 'ON SEIZED COCAINE TOO' }, { text: 'AP, Ynet · gangs use star faces as batch labels', fs: 26 }] },
          { type: 'label', at: l2 + 0.05, x: 60, y: 560, text: 'LISBON + BADAJOZ · MARCH 2018', fs: 34, typeDur: 0.6, sub: 'Spanish + Portuguese police · about 2.5 tonnes' }
        ],
        tag: TAG
      });
    },

    // 4 - CASE 2's GOTCHA (the close-up): a night road stop just across the border; the car's boot floor up on bricks
    //     stamped THE GODFATHER; the officer close in the foreground, torch on them; on "caught" he turns; the label
    hc95_stop(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.55), rd = WT(ctx, 0, 1, 0.69), ct = WT(ctx, 0, 3, 1.22), tn = WT(ctx, 0, 5, 2.17);
      return E.cine.shot(ctx, {
        set: 'hc95_stop', grade: 'night', haze: 0.25, dof: true,
        cam: { from: { x: 10, y: 50, z: 1.12 }, to: { x: 30, y: 60, z: 1.2 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'hc95_guard', x: 250, y: 1960, scale: 1.16, dir: 1, turn: 0.45, pose: 'torch_low', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#1a2230' }, propOpts: { beamLen: 520, aim: 58 },
            keys: [{ at: 0.1, headTurn: 0.2, dur: 0.4 }, { at: rd, pose: 'torch_low', expr: 'focused', headTurn: 0.35, dur: 0.35 }, { at: ct, pose: 'torch', expr: 'determined', headTurn: 0.05, dur: 0.35 }, { at: tn, pose: 'point', expr: 'stern', headTurn: 0.25, dur: 0.35 }] }
        ],
        props: [{ depth: 0.97, accent: true, svg: tt => hatchback(760, 1260, 1.0, { floor: 0.6 + 0.4 * ease.inOut(seg(tt, 0, rd + 0.3)) }) }],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'ROAD STOP · BADAJOZ, SPAIN', fs: 34, typeDur: 0.6, sub: 'About half a tonne in a car (AP, AFP)' },
          { type: 'label', at: tn, x: 60, y: 760, text: '10 ARRESTED · NOT NAMED', fs: 36, typeDur: 0.5, sub: 'Spanish + Portuguese police' }
        ],
        tag: TAG
      });
    },

    // 5 - REHOOK + CASE 3: dusk over the grassland; a small plane crosses left to right; on "dropped" bundles fall from it
    //     and tumble into the grass by a waiting pickup; an anonymous silhouette looks up and points
    hc95_plane(ctx) {
      const t = ctx.t, T = ctx.T, yt = WT(ctx, 0, 2, 1.09), dp = WT(ctx, 0, 4, 2.03), pl = WT(ctx, 0, 6, 2.74);
      const px = tt => lerp(-260, 1340, tt / Math.max(3.2, T)), py = tt => lerp(790, 740, tt / Math.max(3.2, T));
      const drops = [[0, 380, 1215, -30], [0.12, 470, 1250, 40], [0.24, 330, 1270, 15], [0.36, 520, 1205, -55]];
      return E.cine.shot(ctx, {
        set: 'hc95_pampa', grade: 'warm', haze: 0.35,
        cam: { from: { x: -20, y: 10, z: 1.0 }, to: { x: 20, y: 20, z: 1.06 } },
        figures: [
          { id: 'hc95_pickup', x: 560, y: 1265, scale: 0.36, dir: 1, turn: 0.4, pose: 'stand', silhouette: 'warm', depth: 0.99,
            keys: [{ at: 0.1, headTurn: 0.3, dur: 0.4 }, { at: yt, pose: 'point_up', headTurn: 0.2, dur: 0.35 }, { at: dp + 0.4, pose: 'stand_tense', headTurn: 0.1, dur: 0.35 }, { at: pl + 0.2, pose: 'walk', dur: 0.3 }] }
        ],
        props: [
          { depth: 0.6, svg: tt => plane(px(tt), py(tt), 0.9, tt * 40) },
          { depth: 0.98, svg: () => pickup(800, 1255, 1.1) },
          { depth: 0.99, accent: true, svg: tt => { let g = '';
              drops.forEach(([d, lx, ly, rot], i) => { const t0 = dp + d; if (tt < t0) return; const u = clamp((tt - t0) / 0.9, 0, 1);
                // released under the plane (projected from its sky layer), falls with a forward drift, lands and settles
                const x0 = px(t0) * 0.75 + 135, y0 = py(t0) * 0.6 + 380;
                const x = lerp(x0, lx, u), y = lerp(y0, ly, u * u), s = lerp(0.5, 1.0, u);
                g += bundle(x, y, s, rot * (1 - u) + (u >= 1 ? rot * 0.2 : tt * 220 % 360 * (1 - u)));
                if (u >= 1) g += wash(lx, ly + 16, 50, 12, '#d8c49a', f1(0.3 * (1 - clamp((tt - t0 - 0.9) / 0.6, 0, 1)))); });
              return g; } }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'TACUAREMBÓ, URUGUAY · NOV 2022', fs: 34, typeDur: 0.6, sub: '444 kg · bricks marked YOUTUBE (reports)' }
        ],
        tag: TAGS
      });
    },

    // 6 - THE BIGGEST GOTCHA (music drop): Route 59; the firewood truck pulled over; the rural police officer points on
    //     "stopped", drags a log off the load on "firewood" and the bricks marked YOUTUBE show behind it; the label
    hc95_truck(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.55), st = WT(ctx, 0, 1, 0.89), fw_ = WT(ctx, 0, 3, 1.48), th = WT(ctx, 0, 5, 2.41);
      const pull = tt => seg(tt, fw_ - 0.15, fw_ + 0.45);
      return E.cine.shot(ctx, {
        set: 'hc95_route', grade: 'warm', haze: 0.3,
        cam: { from: { x: 0, y: 20, z: 1.05 }, to: { x: 20, y: 40, z: 1.13 } },
        figures: [
          { id: 'hc95_rural', x: 250, y: 1860, scale: 1.0, dir: 1, turn: 0.4, pose: 'stand', expr: 'focused', depth: 1.03, hat: { style: 'cap', color: '#3e3c32' },
            keys: [{ at: l1 - 0.2, headTurn: 0.25, dur: 0.35 }, { at: st, pose: 'point', expr: 'determined', dur: 0.35 }, { at: fw_ - 0.15, pose: 'present', expr: 'focused', dur: 0.35 }, { at: th, pose: 'point', expr: 'stern', headTurn: 0.1, dur: 0.35 }] }
        ],
        props: [{ depth: 0.98, accent: true, svg: tt => woodTruck(700, 1300, 1.0, pull(tt)) }],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'FIREWOOD TRUCK · ROUTE 59', fs: 34, typeDur: 0.6, sub: "Stopped by Uruguay's police" },
          { type: 'label', at: th, x: 60, y: 760, text: '3 ARRESTED · NOT NAMED', fs: 36, typeDur: 0.5, sub: 'Tacuarembó · Nov 2022' }
        ],
        tag: TAG
      });
    },

    // 7 - THE CALLBACK (the loop): frame 1's truck, the same officer; on "Haaland" he turns; the label; the false floor eases
    //     back to frame 1's opening and the camera eases back to frame 1's start; he is back in frame 1's pose before the end
    hc95_end(ctx) {
      const t = ctx.t, T = ctx.T, hl = WT(ctx, 0, 0, 0.34), lb = WT(ctx, 0, 7, 2.25);
      const back = T - 0.5;
      const k = tt => 1 - (1 - K0) * ease.inOut(seg(tt, 0.1, Math.max(0.9, back - 0.1)));
      return E.cine.shot(ctx, {
        set: 'hc95_night', grade: 'night', haze: 0.25,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [{ ...TORCH, keys: [{ at: hl, pose: 'point', expr: 'realise', headTurn: 0.35, dur: 0.35 }, { at: Math.max(1.0, back - 0.45), pose: 'torch', expr: 'focused', headTurn: 0, dur: 0.4 }] }],
        props: heroProps(k),
        tag: TAG
      });
    }
  });
})();
