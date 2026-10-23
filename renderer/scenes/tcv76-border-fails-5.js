/* Case File 76 (premium look, engagement v5 = the phone-ready sound, the LIST FORMAT): BORDER FAILS, PART 5 (after 59,
   the catapult, 63, the Jeep on the fence, 72, the KFC tunnel, and 73, the fake Border Patrol truck, which teased
   "PART 5: A TUNNEL WITH AN ELEVATOR").
   THE LIST = three border tunnel extravagances, best last:
   ITEM 1: May 1990, Agua Prieta -> Douglas, Arizona: the entrance under a pool table on a floor panel lifted by hydraulics.
   ITEM 2: May 2022, Tijuana -> Otay Mesa, San Diego: 1,744 ft, 61 ft deep, its own rail system; HSI agents followed people
   from a stash house to the warehouse; 1,762 lb of cocaine seized.
   ITEM 3 (hero + hook): announced January 2020: the longest smuggling tunnel found on the Southwest border, 4,309 ft,
   ~70 ft deep, rails, power, ventilation, drainage and an ELEVATOR at the Tijuana entrance; the suspected old exit was
   blocked with sandbags and the replacement exit (a side branch) was unfinished.
   Structure: frame 1 = the HERO, a sound-off picture of the headline: a night cutaway of the ground; a small industrial
   building on the Mexican side (left) over a concrete shaft; a lit elevator car going DOWN the shaft into a long lit rail
   tunnel that runs right under the border fence to a warehouse on the American side (its old exit shaft packed with
   sandbags; the unfinished side branch stopping short); an agent kneels at the top of the shaft with his torch; the
   camera already pushing in. Item 1 in a 1990 game room (the floor lifts, pool table and all); item 2 inside the rail
   tunnel (a cart rolls in), then the warehouse (the cut floor, the packets); item 3 in the Tijuana building (the
   elevator's headframe over the shaft), the biggest reveal on the cutaway, travelling right along the tunnel (the 4,309 FT
   counter, the single impact, the music drop), the elevator close up (the FUN FACT: sandbags), and the one closing line
   back on frame 1's framing (the loop) with the end card.
   Smoothness: cuts and dissolves, one push (into item 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact.
   Screen direction: Mexico is always LEFT, America RIGHT: the tunnels run left to right; the camera travels right.
   Look: episode.look = 'premium', one cool night palette (shadow #131b26, mid #c8b9a0, accent #e6a23a). The ONLY strongly
   coloured object is the lit tunnel and its elevator car (per item: the lifted floor's light, the rail cart, the packets),
   props marked accent: true.
   Content rules: no weapon, no violence; agents and officers hold only flashlights. No offender is drawn or named. Figures
   are generic with no badge, flag, seal or insignia; buildings are generic with blank signs; the drugs are plain packets.
   New environments (E.registerSets): bf76_cut (the night sky over the cutaway), bf76_room (a 1990 game room), bf76_bore
   (inside a lit rail tunnel), bf76_ware (a warehouse at night), bf76_tj (a small industrial building at night),
   bf76_shaft (inside the concrete elevator shaft). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#e6a23a', GLOW = '#ffcf7a';
  const TXT = 'font-family="Nunito" font-weight="800"';

  // ---------- small props
  // a plain taped packet (cream wrap, amber tape bands); centre (x, y)
  function packet(x, y, s, rot = 0, glow = 0.4) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    if (glow > 0) g += wash(0, 0, 80, 56, ACC, f1(0.22 * glow));
    g += `<rect x="-44" y="-26" width="88" height="52" rx="12" fill="#d8ccb0" stroke="${INK}" stroke-width="5"/><path d="M-30 -22 Q-10 -6 -26 20 M10 -24 Q26 0 8 22" stroke="#b8ab90" stroke-width="4" fill="none"/>`;
    g += [-20, 18].map(x0 => `<rect x="${x0 - 6}" y="-27" width="12" height="54" fill="${ACC}" stroke="${INK}" stroke-width="3"/>`).join('');
    return g + '</g>';
  }
  // a stack of packets on a pallet; bottom-centre (x, y)
  function pallet(x, y, s, seed, glow = 0.5) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-150" y="-26" width="300" height="26" fill="#8a6a46" stroke="${INK}" stroke-width="4"/>` +
      [-120, -10, 100].map(x0 => `<rect x="${x0}" y="-26" width="22" height="26" fill="#5a4430"/>`).join('');
    const r = R(seed);
    for (let row = 0; row < 4; row++) for (let c = 0; c < 3; c++) g += packet(-92 + c * 92 + (r() - 0.5) * 8, -52 - row * 50, 1.0, (r() - 0.5) * 8, row === 3 ? glow : 0);
    return g + '</g>';
  }
  // a small rail cart (side view) on its wheels; o.load: taped packets in it; bottom-centre (x, y) on the rail
  function cart(x, y, s, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    if (o.glow) g += wash(0, -40, 120, 70, ACC, f1(0.2 * o.glow));
    if (o.load) g += packet(-26, -70, 0.55, -6, 0) + packet(24, -72, 0.55, 5, 0);
    g += `<path d="M-70 -64 L70 -64 L58 -16 L-58 -16 Z" fill="#6a6258" stroke="${INK}" stroke-width="4"/><path d="M-62 -48 L62 -48" stroke="#8a8278" stroke-width="3"/>`;
    g += [-36, 36].map(wx => `<circle cx="${wx}" cy="-9" r="10" fill="#2a2826" stroke="${INK}" stroke-width="3"/>`).join('');
    return g + '</g>';
  }
  // the elevator car: a lit steel cage (front view) with a cable to its top; centre-top (x, y)
  function car(x, y, s, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    g += wash(0, 60, 130, 120, GLOW, f1(0.34 * (o.glow ?? 1)));
    g += `<rect x="-46" y="0" width="92" height="118" fill="#3a2a1a" stroke="${INK}" stroke-width="5"/><rect x="-40" y="6" width="80" height="106" fill="${ACC}" opacity="0.78"/>`;
    g += `<circle cx="0" cy="18" r="7" fill="#fff4d8"/>` + [-24, -8, 8, 24].map(cx => `<path d="M${cx} 6 L${cx} 112" stroke="#4a3a28" stroke-width="3"/>`).join('');
    g += `<path d="M-46 60 L46 60" stroke="#4a3a28" stroke-width="3"/><rect x="-50" y="-8" width="100" height="10" fill="#6a6a6a" stroke="${INK}" stroke-width="3"/><rect x="-50" y="116" width="100" height="10" fill="#6a6a6a" stroke="${INK}" stroke-width="3"/>`;
    return g + '</g>';
  }
  // a sandbag (a fat pillow shape); centre (x, y)
  function sandbag(x, y, s, rot = 0) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><path d="M-30 -12 Q-34 -16 -26 -16 L26 -16 Q34 -16 30 -12 Q36 0 30 12 Q34 16 26 16 L-26 16 Q-34 16 -30 12 Q-36 0 -30 -12 Z" fill="#b8a27a" stroke="${INK}" stroke-width="3"/><path d="M-20 -6 Q0 -2 20 -6" stroke="#9a8460" stroke-width="2" fill="none"/></g>`;
  }
  // the border fence seen end-on: the near bollard at x, receding towards the vanishing point (vx, vy)
  function fenceEnd(x, top, bot, vx, vy, n = 16, wNear = 26, col = '#4a3a2e') {
    let g = '';
    for (let i = n; i >= 1; i--) { const k = Math.pow(i / (n + 1), 0.55), px = lerp(x, vx, k), tp = lerp(top, vy, k), bt = lerp(bot, vy, k), w = lerp(wNear, 3, k);
      g += `<rect x="${f1(px - w / 2)}" y="${f1(tp)}" width="${f1(w)}" height="${f1(bt - tp)}" fill="${col}" stroke="${INK}" stroke-width="${f1(lerp(3, 1, k))}" opacity="${f1(lerp(1, 0.55, k))}"/>`; }
    g += `<rect x="${x - wNear / 2}" y="${top}" width="${wNear}" height="${bot - top}" fill="${col}" stroke="${INK}" stroke-width="5"/><rect x="${x - wNear / 2 + 4}" y="${top}" width="6" height="${bot - top}" fill="#7a6050" opacity="0.6"/>`;
    return g;
  }

  // ---------- THE HERO: the night cutaway (world coordinates, one plane). Ground surface GY; the Tijuana building on the
  // left over the elevator shaft (SX); the tunnel TY0..TY1 runs right under the fence (FX) to the old exit shaft (OX) under
  // the warehouse on the American side, packed with sandbags; the unfinished side branch leaves the tunnel at BX0 and
  // stops at BX1. o.carY = the elevator car's top (CAR_TOP..CAR_BOT); o.depth 0..1 = the 70 FT dimension line; o.branch
  // 0..1 = highlight the unfinished branch; o.cartX = the rail cart's position.
  const GY = 960, SX = 190, SW = 120, TY0 = 1430, TY1 = 1510, FX = 520, OX = 1010, OW = 70;
  const BX0 = 740, BX1 = 870, BY = 1190;
  const CAR_TOP = GY - 40, CAR_BOT = TY1 - 134;
  function cutaway(t, o = {}) {
    const gl = (o.glow ?? 1) * (0.9 + 0.1 * Math.sin(t * 2.1));
    let g = '';
    // the soil: layered strata with pebbles
    g += `<defs><linearGradient id="bf76soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3a2c"/><stop offset="0.35" stop-color="#3a2c22"/><stop offset="1" stop-color="#1c1610"/></linearGradient></defs>`;
    g += `<rect x="-800" y="${GY}" width="${W + 1800}" height="1400" fill="url(#bf76soil)"/>`;
    for (let k = 0; k < 6; k++) { let d = `M-800 ${GY + 60 + k * 120}`; for (let x = -800; x <= W + 1000; x += 60) d += ` L${x} ${f1(GY + 60 + k * 120 + 10 * Math.sin(x * 0.011 + k * 1.7))}`; g += `<path d="${d}" stroke="#2a2018" stroke-width="5" fill="none" opacity="0.55"/>`; }
    const r = R(7601); for (let i = 0; i < 90; i++) { const px = -750 + r() * (W + 1700), py = GY + 30 + r() * 1000; if (py > TY0 - 24 && py < TY1 + 24) continue; g += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(5 + r() * 9)}" ry="${f1(3 + r() * 5)}" fill="#5a4838" opacity="0.6"/>`; }
    g += `<rect x="-800" y="${GY - 6}" width="${W + 1800}" height="16" fill="#5e4a38"/>` + E.cine.scrub(GY - 4, 12, 7602, '#2e3228', 0.5, -700, 2000);
    // the unfinished side branch (drawn first, under the main bore): leaves the tunnel floor, runs right and stops short
    const bk = o.branch || 0;
    g += `<path d="M${BX0} ${TY0 + 10} L${BX1} ${BY}" stroke="${INK}" stroke-width="54" stroke-linecap="butt"/><path d="M${BX0} ${TY0 + 10} L${BX1} ${BY}" stroke="#2a1c12" stroke-width="44"/>`;
    g += `<path d="M${BX0 + 6} ${TY0 + 4} L${BX1 - 2} ${BY + 6}" stroke="${ACC}" stroke-width="28" opacity="${f1((0.25 + 0.45 * bk) * gl)}"/>`;
    // its rough, unfinished end + where it would have had to go (dashed)
    g += `<path d="M${BX1 - 22} ${BY - 14} L${BX1 - 6} ${BY - 22} L${BX1 + 4} ${BY - 8} L${BX1 + 20} ${BY - 12} L${BX1 + 22} ${BY + 10}" stroke="#6a5038" stroke-width="6" fill="none"/>`;
    if (bk > 0) g += `<g opacity="${f1(bk)}"><path d="M${BX1 + 10} ${BY - 20} L${BX1 + 60} ${GY + 14}" stroke="#ece4d4" stroke-width="4" fill="none" stroke-dasharray="14 12"/>` + wash(BX1, BY, 90, 70, GLOW, f1(0.45 * bk)) +
      `<text x="${BX1 - 40}" y="${BY + 10}" text-anchor="end" ${TXT} font-size="38" letter-spacing="2" fill="#ece4d4" stroke="${INK}" stroke-width="7" paint-order="stroke">UNFINISHED</text></g>`;
    // the main bore: lit, with rails, a cable, a vent duct and lamps (the accent)
    const X0 = SX - SW / 2, X1 = OX + OW / 2;
    g += wash((SX + OX) / 2, (TY0 + TY1) / 2, 560, 120, GLOW, f1(0.16 * gl));
    g += `<rect x="${X0}" y="${TY0}" width="${X1 - X0}" height="${TY1 - TY0}" fill="#2a1c12" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="${X0 + 4}" y="${TY0 + 6}" width="${X1 - X0 - 8}" height="${TY1 - TY0 - 12}" fill="${ACC}" opacity="${f1(0.48 * gl)}"/>`;
    g += `<path d="M${X0 + 10} ${TY0 + 14} L${X1 - 10} ${TY0 + 14}" stroke="#5a5a56" stroke-width="9"/><path d="M${X0 + 10} ${TY0 + 26} L${X1 - 10} ${TY0 + 26}" stroke="#1a1a1a" stroke-width="3"/>`;
    for (let x = X0 + 40; x < X1 - 20; x += 70) g += `<circle cx="${x}" cy="${TY0 + 32}" r="4" fill="#fff0c8" opacity="${f1(0.8 * gl)}"/>`;
    g += `<path d="M${X0 + 6} ${TY1 - 10} L${X1 - 6} ${TY1 - 10}" stroke="#8a8a86" stroke-width="4"/>` + (() => { let s = ''; for (let x = X0 + 14; x < X1 - 10; x += 26) s += `<path d="M${x} ${TY1 - 14} L${x} ${TY1 - 6}" stroke="#5a3e24" stroke-width="5"/>`; return s; })();
    g += cart(o.cartX ?? 400, TY1 - 10, 0.5, { load: true });
    // the elevator shaft (left): concrete walls, the guide rails, the cable, the car
    g += `<rect x="${SX - SW / 2}" y="${GY + 10}" width="${SW}" height="${TY1 - GY - 10}" fill="#3a3632" stroke="${INK}" stroke-width="5"/><rect x="${SX - SW / 2 + 8}" y="${GY + 12}" width="${SW - 16}" height="${TY1 - GY - 14}" fill="${ACC}" opacity="${f1(0.18 * gl)}"/>`;
    g += [SX - SW / 2 + 12, SX + SW / 2 - 12].map(x => `<path d="M${x} ${GY - 150} L${x} ${TY1}" stroke="#6a6a66" stroke-width="5"/>`).join('');
    const cy = o.carY ?? CAR_TOP;
    g += `<path d="M${SX} ${GY - 170} L${SX} ${f1(cy)}" stroke="#1a1a1a" stroke-width="3"/>` + car(SX, cy, 0.98, { glow: gl });
    // the depth line (70 FT)
    if (o.depth) { const dx = FX + 44, k = o.depth;
      g += `<g opacity="${f1(k)}"><path d="M${dx} ${GY + 10} L${dx} ${TY1}" stroke="#ece4d4" stroke-width="4" stroke-dasharray="${f1((TY1 - GY) * k)} 999"/><path d="M${dx - 14} ${GY + 10} L${dx + 14} ${GY + 10} M${dx - 14} ${TY1} L${dx + 14} ${TY1}" stroke="#ece4d4" stroke-width="4"/>` +
        `<text x="${dx + 22}" y="${(GY + TY1) / 2 + 14}" ${TXT} font-size="40" fill="#ece4d4" stroke="${INK}" stroke-width="7" paint-order="stroke">70 FT</text></g>`; }
    // the old exit shaft (right), packed with sandbags
    g += `<rect x="${OX - OW / 2}" y="${GY + 10}" width="${OW}" height="${TY0 - GY - 6}" fill="#2a1c12" stroke="${INK}" stroke-width="5"/>`;
    for (let row = 0; row < 15; row++) for (let c = 0; c < 2; c++) g += sandbag(OX - 16 + c * 32 + (row % 2) * 4, GY + 28 + row * 30, 0.5, (row * 7 + c * 5) % 9 - 4);
    // the border fence (end-on) and its footing; the line names
    g += `<rect x="${FX - 22}" y="${GY}" width="44" height="60" fill="#5a5048" stroke="${INK}" stroke-width="4"/>` + fenceEnd(FX, 760, GY + 4, FX + 150, 870, 14, 26);
    g += `<text x="${FX - 36}" y="${GY + 64}" text-anchor="end" ${TXT} font-size="30" letter-spacing="3" fill="#d8ccb4" opacity="0.75">MEXICO</text><text x="${FX + 36}" y="${GY + 64}" ${TXT} font-size="30" letter-spacing="3" fill="#d8ccb4" opacity="0.75">USA</text>`;
    // the small industrial building in Tijuana (left), cut away: corrugated back wall, a bulb, the elevator headframe
    const B0 = -260, B1 = 420, BR = 690;
    g += `<rect x="${B0}" y="${BR}" width="${B1 - B0}" height="${GY - BR}" fill="#34322e" stroke="${INK}" stroke-width="6"/>`;
    for (let x = B0 + 20; x < B1; x += 26) g += `<path d="M${x} ${BR + 6} L${x} ${GY - 4}" stroke="#2c2a26" stroke-width="5"/>`;
    g += `<path d="M${B0 - 20} ${BR + 2} L${(B0 + B1) / 2} ${BR - 60} L${B1 + 20} ${BR + 2} Z" fill="#5a5650" stroke="${INK}" stroke-width="5"/><rect x="${B1 - 14}" y="${BR}" width="14" height="${GY - BR}" fill="#8a8478"/>`;
    g += `<path d="M330 ${BR + 4} L330 ${BR + 40}" stroke="#1a1a1a" stroke-width="2"/><circle cx="330" cy="${BR + 48}" r="9" fill="#fff0c8"/>` + wash(330, BR + 70, 160, 120, '#ffe0a8', 0.14);
    // the headframe: two steel posts, a cross-beam, a pulley, a winch box
    g += `<path d="M${SX - 66} ${GY} L${SX - 40} ${GY - 196} M${SX + 66} ${GY} L${SX + 40} ${GY - 196} M${SX - 52} ${GY - 196} L${SX + 52} ${GY - 196}" stroke="#7a7a74" stroke-width="12" stroke-linecap="round"/>`;
    g += `<circle cx="${SX}" cy="${GY - 182}" r="16" fill="#4a4a46" stroke="${INK}" stroke-width="4"/><rect x="${SX + 80}" y="${GY - 64}" width="70" height="64" fill="#5a5e62" stroke="${INK}" stroke-width="4"/><path d="M${SX + 16} ${GY - 182} L${SX + 104} ${GY - 50}" stroke="#1a1a1a" stroke-width="3"/>`;
    g += `<rect x="${B0}" y="${GY}" width="${SX - SW / 2 - B0}" height="14" fill="#8a867e" stroke="${INK}" stroke-width="3"/><rect x="${SX + SW / 2}" y="${GY}" width="${B1 - SX - SW / 2}" height="14" fill="#8a867e" stroke="${INK}" stroke-width="3"/>`;
    g += wash(SX, GY, 110, 50, GLOW, f1(0.36 * gl));
    // the warehouse on the American side (right), plain, over the old exit
    const W0 = 820, W1 = 1500, WR = 780;
    g += `<rect x="${W0}" y="${WR}" width="${W1 - W0}" height="${GY - WR}" fill="#3e4246" stroke="${INK}" stroke-width="6"/><rect x="${W0 - 10}" y="${WR - 16}" width="${W1 - W0 + 20}" height="18" fill="#5a5e62" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="${W0 + 40}" y="${WR + 50}" width="160" height="${GY - WR - 50}" fill="#2a2e32" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2, 3].map(i => `<path d="M${W0 + 40} ${WR + 80 + i * 26} L${W0 + 200} ${WR + 80 + i * 26}" stroke="#3a3e42" stroke-width="3"/>`).join('');
    g += `<rect x="${W0 + 240}" y="${WR + 40}" width="80" height="30" fill="#e8d4a8" opacity="0.4"/>`;
    return g;
  }
  // the sky over the cutaway: deep blue, stars, a moon, far town lights on both sides of the line
  function cutSky(t) {
    let sky = `<defs><linearGradient id="bf76csky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060b16"/><stop offset="0.7" stop-color="#142036"/><stop offset="1" stop-color="#26344a"/></linearGradient></defs><rect x="-800" y="-400" width="${W + 1800}" height="1500" fill="url(#bf76csky)"/>`;
    sky += E.cine.stars(t, 120, 7611, -200, 860) + `<circle cx="760" cy="640" r="28" fill="#ece8d8" opacity="0.85"/>` + wash(760, 640, 150, 150, '#d8e0ec', 0.12);
    let far = `<path d="M-800 960 L-800 890 Q-300 860 100 882 Q500 900 900 870 Q1300 850 1900 890 L1900 960 Z" fill="#1e2838"/>`;
    const r = R(7612); for (let i = 0; i < 50; i++) { const x = -750 + r() * 2600, y = 876 + r() * 60; far += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.6 + r() * 2.4)}" fill="#ffd89a" opacity="${f1(0.35 + 0.4 * r())}"/>`; }
    return { sky, far };
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // the night cutaway: the sky layers only (the cross-section itself is a prop at depth 1.0 so the figures sit in it)
    bf76_cut(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), { sky, far } = cutSky(t);
      return { light: { dir: -1, rim: GLOW, key: '#e8d8c0' }, layers: [[0.05, sky], [0.3, far]] };
    },

    // a 1990 game room in a house: wood-panelled walls, a framed picture, a small bar with bottles on the right, a curtained
    // window on the left; a carpeted floor in perspective (the lifting panel is drawn in the shot)
    bf76_room(ctx, o = {}) {
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#3a2a20"/>`;
      for (let x = -380; x < W + 400; x += 70) back += `<rect x="${x}" y="200" width="62" height="900" fill="#4a3426" stroke="#2e2018" stroke-width="3"/>`;
      back += `<rect x="-400" y="1040" width="${W + 800}" height="40" fill="#2e2018"/>`;
      back += `<rect x="-240" y="420" width="260" height="360" fill="#1a2232" stroke="${INK}" stroke-width="6"/><path d="M-240 420 Q-170 600 -200 780 L-240 780 Z M20 420 Q-50 600 -20 780 L20 780 Z" fill="#6a3a2e"/>`;
      back += `<rect x="380" y="430" width="260" height="190" fill="#5a4a36" stroke="#b89a5a" stroke-width="10"/><path d="M400 600 L470 500 L520 560 L560 520 L620 600 Z" fill="#7a8a6a"/>`;
      // the bar (right): counter, shelf of bottles
      back += `<rect x="820" y="520" width="520" height="16" fill="#6a4a30"/>` + [0, 1, 2, 3, 4, 5].map(i => `<rect x="${840 + i * 40}" y="${456 + (i % 2) * 10}" width="22" height="${64 - (i % 2) * 10}" rx="5" fill="${['#4a6a4a', '#8a5a2a', '#c8b48a'][i % 3]}" stroke="${INK}" stroke-width="3"/>`).join('');
      back += `<rect x="800" y="820" width="560" height="260" fill="#5a3a26" stroke="${INK}" stroke-width="5"/><rect x="790" y="800" width="580" height="30" fill="#7a5236" stroke="${INK}" stroke-width="4"/>`;
      let floor = `<rect x="-400" y="1080" width="${W + 800}" height="${H}" fill="#5a3e3a"/>`;
      for (let i = 0; i < 9; i++) { const y = 1080 + Math.pow(i / 9, 1.6) * 900; floor += `<path d="M-400 ${f1(y)} L${W + 400} ${f1(y)}" stroke="#4e3432" stroke-width="3" opacity="0.6"/>`; }
      return { light: { dir: 1, rim: '#ffd8a0', key: '#f0d8b8' }, layers: [[0.3, back], [0.75, floor]] };
    },

    // inside a lit rail tunnel, one-point perspective: the bore's walls and timber sets, string lamps, a vent duct and
    // cables on the ceiling, two rails converging to the vanishing point (VX, VY)
    bf76_bore(ctx, o = {}) {
      const VX = 540, VY = 880;
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#1a120c"/>`;
      // the far end: a glowing point
      back += wash(VX, VY, 160, 120, GLOW, 0.5) + `<ellipse cx="${VX}" cy="${VY}" rx="38" ry="30" fill="${ACC}" opacity="0.8"/>`;
      // receding frames (rings) from far to near
      for (let i = 14; i >= 1; i--) { const k = i / 14, hw = lerp(560, 40, Math.pow(k, 0.6)), hh = lerp(820, 34, Math.pow(k, 0.6));
        back += `<rect x="${f1(VX - hw)}" y="${f1(VY - hh)}" width="${f1(2 * hw)}" height="${f1(2 * hh * 0.98)}" rx="${f1(hw * 0.25)}" fill="none" stroke="#5a3e24" stroke-width="${f1(lerp(26, 3, Math.pow(k, 0.6)))}" opacity="${f1(lerp(1, 0.5, k))}"/>`;
        back += `<circle cx="${f1(VX)}" cy="${f1(VY - hh * 0.86)}" r="${f1(lerp(12, 2, Math.pow(k, 0.6)))}" fill="#fff0c8" opacity="${f1(lerp(0.95, 0.5, k))}"/>` + wash(VX, VY - hh * 0.8, hw * 0.5, hh * 0.3, GLOW, f1(0.06 * (1 - k))); }
      back += wash(VX, VY, 600, 700, ACC, 0.12);
      // the vent duct and cables along the ceiling (perspective lines)
      back += `<path d="M-200 120 L${VX - 20} ${VY - 30}" stroke="#6a6a66" stroke-width="44" stroke-linecap="round"/><path d="M-200 120 L${VX - 20} ${VY - 30}" stroke="#8a8a84" stroke-width="12" opacity="0.6"/>`;
      back += `<path d="M1300 200 L${VX + 20} ${VY - 26}" stroke="#141414" stroke-width="8"/><path d="M1300 250 L${VX + 22} ${VY - 22}" stroke="#4a2a1a" stroke-width="6"/>`;
      // the floor and the rails
      let floor = `<path d="M-400 1920 L${VX - 40} ${VY + 30} L${VX + 40} ${VY + 30} L1480 1920 Z" fill="#3a2a1c"/>`;
      for (let i = 1; i < 18; i++) { const k = Math.pow(i / 18, 1.8), y = lerp(VY + 30, 1920, k), hw = lerp(30, 520, k); floor += `<path d="M${f1(VX - hw)} ${f1(y)} L${f1(VX + hw)} ${f1(y)}" stroke="#5a3e24" stroke-width="${f1(lerp(2, 16, k))}"/>`; }
      floor += `<path d="M${VX - 14} ${VY + 30} L120 1920 M${VX + 14} ${VY + 30} L960 1920" stroke="#9a9a94" stroke-width="12"/>`;
      return { light: { dir: -1, rim: GLOW, key: '#e8d0a8' }, layers: [[0.25, back], [0.7, floor]] };
    },

    // a warehouse at night: a high steel roof with one strip light, racking on the left, a roller door on the right with a
    // streetlamp's glow under it, a concrete floor in perspective
    bf76_ware(ctx, o = {}) {
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#22262a"/>`;
      for (let i = 0; i < 8; i++) back += `<path d="M${-400 + i * 240} -300 L${-300 + i * 240} 360" stroke="#1a1d20" stroke-width="16"/>`;
      back += `<rect x="-400" y="360" width="${W + 800}" height="30" fill="#3a3e42"/><rect x="200" y="392" width="500" height="14" rx="6" fill="#e8ecf0" opacity="0.7"/>` + wash(450, 520, 600, 300, '#d8e4ee', 0.08);
      // racking (left)
      for (let c = 0; c < 2; c++) { const x = -300 + c * 300; back += `<rect x="${x}" y="500" width="16" height="680" fill="#4a5a6a"/><rect x="${x + 250}" y="500" width="16" height="680" fill="#4a5a6a"/>` + [0, 1, 2].map(r0 => `<rect x="${x}" y="${640 + r0 * 200}" width="266" height="14" fill="#c8823a" opacity="0.7"/><rect x="${x + 20}" y="${560 + r0 * 200}" width="220" height="80" fill="#6a5a46" stroke="${INK}" stroke-width="3"/>`).join(''); }
      // the roller door (right), the light under it
      back += `<rect x="640" y="560" width="560" height="620" fill="#5a5e62" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<path d="M640 ${600 + i * 64} L1200 ${600 + i * 64}" stroke="#4a4e52" stroke-width="5"/>`).join('');
      back += `<rect x="640" y="1150" width="560" height="30" fill="#e8c68a" opacity="0.6"/>` + wash(920, 1180, 360, 80, '#ffd890', 0.25);
      let floor = `<rect x="-400" y="1180" width="${W + 800}" height="${H}" fill="#7a7670"/>`;
      for (let i = -6; i <= 14; i++) floor += `<path d="M${540 + i * 120} 1180 L${540 + (i * 120) * 2.4} ${H + 200}" stroke="#6a6660" stroke-width="3"/>`;
      return { light: { dir: 1, rim: '#ffd890', key: '#dce0e4' }, layers: [[0.3, back], [0.75, floor]] };
    },

    // a small industrial building in Tijuana at night: corrugated walls, one bare bulb, crates, a roller door on the left
    // half open to a street lamp; a concrete floor (the shaft and the headframe are drawn in the shot)
    bf76_tj(ctx, o = {}) {
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#2e2c28"/>`;
      for (let x = -390; x < W + 400; x += 30) back += `<path d="M${x} 200 L${x} 1160" stroke="#262420" stroke-width="7"/>`;
      back += `<rect x="-400" y="160" width="${W + 800}" height="50" fill="#3e3a34"/>`;
      // the roller door, half up: the street outside (dark blue) with a lamp
      back += `<rect x="-300" y="560" width="520" height="600" fill="#101a2a" stroke="${INK}" stroke-width="6"/>` + wash(-40, 760, 260, 300, '#ffc878', 0.16) + `<rect x="-60" y="640" width="12" height="520" fill="#1a1c20"/>`;
      back += `<rect x="-300" y="560" width="520" height="300" fill="#6a6660" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3].map(i => `<path d="M-300 ${600 + i * 64} L220 ${600 + i * 64}" stroke="#5a5650" stroke-width="5"/>`).join('');
      // crates and a hanging bulb
      back += `<rect x="860" y="900" width="260" height="260" fill="#7a6246" stroke="${INK}" stroke-width="5"/><rect x="900" y="760" width="180" height="140" fill="#8a7050" stroke="${INK}" stroke-width="5"/>`;
      back += `<path d="M600 200 L600 420" stroke="#1a1a1a" stroke-width="3"/><circle cx="600" cy="432" r="14" fill="#fff0c8"/>` + wash(600, 520, 400, 300, '#ffe0a8', 0.14);
      let floor = `<rect x="-400" y="1160" width="${W + 800}" height="${H}" fill="#6e6a62"/>`;
      for (let k = 0; k < 8; k++) { const y = 1160 + Math.pow(k / 8, 1.6) * 900; floor += `<path d="M-400 ${f1(y)} L${W + 400} ${f1(y)}" stroke="#5e5a54" stroke-width="3"/>`; }
      return { light: { dir: 1, rim: GLOW, key: '#e0d4c0' }, layers: [[0.3, back], [0.75, floor]] };
    },

    // inside the concrete elevator shaft, looking at its back wall: formwork lines and tie holes, two steel guide rails;
    // at the bottom, the tunnel mouth opening to the right (drawn in the shot)
    bf76_shaft(ctx, o = {}) {
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#3a3834"/>`;
      for (let y = -200; y < 1700; y += 120) back += `<path d="M-400 ${y} L${W + 400} ${y}" stroke="#302e2a" stroke-width="5"/>`;
      for (let y = -140; y < 1700; y += 120) for (let x = -340; x < W + 400; x += 180) back += `<circle cx="${x + (y % 240 ? 0 : 90)}" cy="${y}" r="6" fill="#26241f"/>`;
      back += wash(540, 800, 500, 900, '#ffe0a8', 0.06);
      let walls = `<rect x="-400" y="-300" width="560" height="${H + 600}" fill="#24221e"/><rect x="920" y="-300" width="560" height="${H + 600}" fill="#24221e"/>`;
      walls += `<path d="M160 -300 L160 ${H + 300} M920 -300 L920 ${H + 300}" stroke="${INK}" stroke-width="6"/>`;
      return { light: { dir: -1, rim: GLOW, key: '#e0d0b8' }, layers: [[0.3, back], [0.85, walls]] };
    }
  });

  // the hero props (frame 1 and the last frame): the cutaway at depth 1.0
  const heroCut = (o = {}) => ({ depth: 1.0, accent: true, svg: tt => cutaway(tt, o) });
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: -60, y: 60, z: 1.09 };
  const kneeler = (keys = []) => ({ id: 'bf72_agent1', x: SX + 96, y: GY + 4, scale: 0.3, dir: -1, turn: 0.45, pose: 'kneel', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#1e2630' }, propOpts: { beamLen: 260, aim: 62 }, keys });
  const usAgent = (keys = []) => ({ id: 'bf72_agent2', x: 1120, y: GY + 4, scale: 0.28, dir: -1, turn: 0.4, pose: 'torch_low', expr: 'focused', depth: 1.01, hat: { style: 'cap', color: '#2e3a2a' }, propOpts: { beamLen: 220 }, keys });

  E.registerScenes({
    // 1 - hook (frame 1): the cutaway; the lit elevator car going down the shaft, the cart rolling along the tunnel; the
    //     agent kneeling at the top of the shaft with his light, the U.S. agent by the warehouse; the camera already pushing
    bf76_hook(ctx) {
      const t = ctx.t, T = ctx.T, el = WT(ctx, 0, 6, 1.8), l2 = LS(ctx, 1, 2.5), n3 = WT(ctx, 1, 3, 3.2);
      return E.cine.shot(ctx, {
        set: 'bf76_cut', grade: 'night', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [
          kneeler([{ at: 0.3, pose: 'kneel', expr: 'focused', headTurn: 0.2, dur: 0.4 }, { at: el, pose: 'kneel', expr: 'shocked', headTurn: -0.2, dur: 0.35 }, { at: l2 + 0.2, pose: 'kneel', expr: 'realise', dur: 0.5 }]),
          usAgent([{ at: 0.6, pose: 'torch', dur: 0.8 }, { at: n3, pose: 'point', expr: 'realise', dur: 0.4 }])
        ],
        props: [heroCut({ glow: 1, carY: lerp(CAR_TOP, CAR_TOP + 200, ease.inOut(seg(t, 0, T))), cartX: lerp(300, 420, seg(t, 0, T)) })],
        overlays: [],
        tag: TAG
      });
    },

    // 2 - ITEM 1, THE POOL-TABLE TUNNEL: the 1990 game room; a hanging lamp over the pool table; the customs agent by the
    //     table and the officer with a torch; on 'Hydraulics' the floor panel rises on two pistons, pool table and all,
    //     light pouring up from the shaft
    bf76_pool(ctx) {
      const t = ctx.t, T = ctx.T, pt = WT(ctx, 0, 7, 1.6), hy = LS(ctx, 1, 2.6), al = WT(ctx, 1, 7, 4.2);
      const PX = 540, PY = 1330;
      const table = tt => { const k = ease.inOut(seg(tt, hy, hy + 1.2)), lift = 230 * k;
        let g = '';
        // the opening under the panel (lit) and the hydraulic pistons
        if (k > 0) g += `<path d="M${PX - 300} ${PY - 10} L${PX + 300} ${PY - 10} L${PX + 330} ${PY + 70} L${PX - 330} ${PY + 70} Z" fill="#140e08" stroke="${INK}" stroke-width="5"/>` +
          `<path d="M${PX - 280} ${PY - 4} L${PX + 280} ${PY - 4} L${PX + 306} ${PY + 62} L${PX - 306} ${PY + 62} Z" fill="${ACC}" opacity="${f1(0.7 * k)}"/>` + wash(PX, PY - 60, 420, 220, GLOW, f1(0.4 * k)) +
          [-170, 170].map(dx => `<rect x="${PX + dx - 16}" y="${f1(PY - lift)}" width="32" height="${f1(lift + 20)}" fill="#9aa0a6" stroke="${INK}" stroke-width="4"/><rect x="${PX + dx - 24}" y="${PY - 6}" width="48" height="30" fill="#5a5e62" stroke="${INK}" stroke-width="4"/>`).join('');
        // the concrete panel (carpeted top) and the pool table on it
        g += `<g transform="translate(0 ${f1(-lift)})"><path d="M${PX - 300} ${PY - 10} L${PX + 300} ${PY - 10} L${PX + 330} ${PY + 50} L${PX - 330} ${PY + 50} Z" fill="#6a4a46" stroke="${INK}" stroke-width="5"/><rect x="${PX - 330}" y="${PY + 50}" width="660" height="${f1(20 + 30 * k)}" fill="#8a867e" stroke="${INK}" stroke-width="4"/>`;
        g += `<rect x="${PX - 230}" y="${PY - 120}" width="30" height="110" fill="#4a2e1c" stroke="${INK}" stroke-width="4"/><rect x="${PX + 200}" y="${PY - 120}" width="30" height="110" fill="#4a2e1c" stroke="${INK}" stroke-width="4"/>`;
        g += `<path d="M${PX - 270} ${PY - 210} L${PX + 270} ${PY - 210} L${PX + 300} ${PY - 130} L${PX - 300} ${PY - 130} Z" fill="#2e6a4a" stroke="${INK}" stroke-width="5"/><rect x="${PX - 300}" y="${PY - 130}" width="600" height="26" fill="#5a3420" stroke="${INK}" stroke-width="4"/>`;
        g += `<circle cx="${PX - 60}" cy="${PY - 170}" r="12" fill="#efe6d4" stroke="${INK}" stroke-width="2"/><circle cx="${PX + 70}" cy="${PY - 160}" r="12" fill="#c8402e" stroke="${INK}" stroke-width="2"/><circle cx="${PX + 100}" cy="${PY - 182}" r="12" fill="#e6c23a" stroke="${INK}" stroke-width="2"/></g>`;
        return g; };
      return E.cine.shot(ctx, {
        set: 'bf76_room', grade: 'warm', haze: 0.35, dof: true,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 0, y: 60, z: 1.07 } },
        figures: [
          { id: 'bf76_customs', x: 150, y: 1620, scale: 0.66, dir: 1, turn: 0.35, pose: 'examine', expr: 'focused', depth: 1.03,
            keys: [{ at: pt, pose: 'point', expr: 'focused', dur: 0.4 }, { at: hy + 0.2, pose: 'stand_tense', expr: 'shocked', dur: 0.35 }, { at: al, pose: 'hand_to_face', expr: 'realise', dur: 0.5 }] },
          { id: 'bf76_mxfed', x: 930, y: 1610, scale: 0.64, dir: -1, turn: 0.35, pose: 'torch_low', expr: 'focused', depth: 1.02, propOpts: { beamLen: 300 },
            keys: [{ at: 0.3, pose: 'torch', expr: 'focused', dur: 0.6 }, { at: hy + 0.4, pose: 'torch_low', expr: 'shocked', dur: 0.35 }] }
        ],
        props: [
          { depth: 0.9, svg: tt => `<path d="M${PX} 200 L${PX} 600" stroke="#1a1a1a" stroke-width="4"/><path d="M${PX - 150} 600 L${PX + 150} 600 L${PX + 110} 650 L${PX - 110} 650 Z" fill="#2e5a3e" stroke="${INK}" stroke-width="4"/>` + wash(PX, 760, 340, 220, '#ffe0a0', 0.16) },
          { depth: 1.0, accent: true, svg: table }
        ],
        overlays: [
          { type: 'label', at: LS(ctx, 0, 0.1) + 0.15, x: 60, y: 560, text: 'DOUGLAS, ARIZONA · MAY 1990', fs: 40, sub: 'From a house in Agua Prieta, Mexico' },
          { type: 'label', at: hy + 0.5, x: 60, y: 760, text: 'A HYDRAULIC FLOOR', fs: 40, sub: 'under the pool table, reports say', typeDur: 0.6 }
        ],
        tag: TAG
      });
    },

    // 3 - the rehook + ITEM 2, THE RAILWAY TUNNEL: inside the lit bore; on 'railway' a rail cart rolls in from the far end
    //     along the track towards camera; an agent stands at the side with his light and turns to it
    bf76_rail(ctx) {
      const t = ctx.t, T = ctx.T, rw = WT(ctx, 0, 7, 1.6), sd = WT(ctx, 1, 5, 3.4);
      const cartAt = tt => { const u = ease.out(seg(tt, rw - 0.6, T)); return { y: lerp(960, 1560, u), s: lerp(0.4, 2.2, u) }; };
      return E.cine.shot(ctx, {
        set: 'bf76_bore', grade: 'night', haze: 0.3,
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 20, z: 1.08 } },
        figures: [
          { id: 'bf72_agent2', x: 860, y: 1640, scale: 0.62, dir: -1, turn: 0.4, pose: 'torch', expr: 'focused', depth: 1.03, hat: { style: 'cap', color: '#2e3a2a' }, propOpts: { beamLen: 300, aim: 18 },
            keys: [{ at: 0.2, pose: 'torch_low', expr: 'focused', dur: 0.5 }, { at: rw, pose: 'torch', expr: 'shocked', headTurn: 0.25, dur: 0.35 }, { at: sd, pose: 'point', expr: 'realise', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.98, accent: true, svg: tt => { const c = cartAt(tt); return tt < rw - 0.6 ? '' : cart(540, c.y, c.s, { load: true, glow: 0.8 }); } }
        ],
        overlays: [
          { type: 'label', at: LS(ctx, 1, 2.0) + 0.1, x: 60, y: 560, text: 'TIJUANA → SAN DIEGO · MAY 2022', fs: 40, sub: '1,744 ft · rails, power, ventilation' }
        ],
        tag: TAG
      });
    },

    // 4 - the railway tunnel's payoff: the warehouse at night; two agents walk in from the left with their lights; the
    //     cut hole in the floor glows; on 'ton' the light lands on the pallets of packets
    bf76_ware(ctx) {
      const t = ctx.t, T = ctx.T, fo = WT(ctx, 0, 2, 0.5), l2 = LS(ctx, 1, 1.8), tn = WT(ctx, 1, 3, 2.4);
      const HX = 470, HY = 1270;
      return E.cine.shot(ctx, {
        set: 'bf76_ware', grade: 'night', haze: 0.35,
        cam: { from: { x: -20, y: 40, z: 1.0 }, to: { x: 20, y: 60, z: 1.07 } },
        figures: [
          { id: 'bf72_agent1', x: 300, y: 1680, scale: 0.6, dir: 1, turn: 0.35, pose: 'torch', expr: 'focused', depth: 1.04, hat: { style: 'cap', color: '#1e2630' }, propOpts: { beamLen: 380 },
            walk: { at: 0.05, dur: Math.max(1.2, l2 - 0.1), cadence: 3.4, stride: 14, from: 60, to: 300 }, keys: [{ at: tn, pose: 'torch_low', expr: 'shocked', dur: 0.3 }] },
          { id: 'bf72_agent2', x: 130, y: 1760, scale: 0.68, dir: 1, turn: 0.35, pose: 'torch_low', expr: 'determined', depth: 1.05, hat: { style: 'cap', color: '#2e3a2a' }, propOpts: { beamLen: 360 },
            walk: { at: fo, dur: 1.3, cadence: 3.4, stride: 14, from: -120, to: 130 }, keys: [{ at: tn + 0.3, pose: 'point', expr: 'realise', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.97, svg: () => `<path d="M${HX - 150} ${HY - 40} L${HX + 150} ${HY - 40} L${HX + 180} ${HY + 40} L${HX - 180} ${HY + 40} Z" fill="#140e08" stroke="${INK}" stroke-width="5"/><path d="M${HX - 136} ${HY - 34} L${HX + 136} ${HY - 34} L${HX + 164} ${HY + 34} L${HX - 164} ${HY + 34} Z" fill="${ACC}" opacity="0.55"/>` + wash(HX, HY - 80, 280, 160, GLOW, 0.3) +
            [0, 1, 2].map(i => `<path d="M${HX - 30} ${HY - 26 + i * 18} L${HX + 30} ${HY - 26 + i * 18}" stroke="#6a4a2a" stroke-width="5"/>`).join('') +
            [[HX - 210, HY - 30, -14], [HX + 220, HY - 26, 12], [HX - 60, HY + 70, 4]].map(([x, y, a]) => `<rect x="${x - 60}" y="${y - 14}" width="120" height="28" fill="#9a968e" stroke="${INK}" stroke-width="3" transform="rotate(${a} ${x} ${y})"/>`).join('') },
          { depth: 1.0, accent: true, svg: tt => pallet(800, 1250, 0.7, 7641, 0.3 + 0.7 * seg(tt, tn - 0.2, tn + 0.4)) + pallet(950, 1290, 0.7, 7642, 0.3 + 0.7 * seg(tt, tn - 0.2, tn + 0.4)) }
        ],
        overlays: [
          { type: 'label', at: tn + 0.15, x: 60, y: 560, text: '1,762 LB OF COCAINE', fs: 42, sub: 'Six people charged (HSI / DOJ)', typeDur: 0.6 }
        ],
        tag: TAG
      });
    },

    // 5 - ITEM 3 begins: the Tijuana building at night; an officer walks in from the half-open roller door and stops at the
    //     square shaft in the floor under a steel headframe with a pulley and cable; light glowing up; he aims his light down
    bf76_tj(ctx) {
      const t = ctx.t, T = ctx.T, lg = WT(ctx, 0, 3, 1.0), fd = WT(ctx, 0, 6, 1.8);
      const SXc = 620, SYc = 1220;
      const shaft = tt => { const L = 0.6 + 0.4 * ease.out(seg(tt, lg - 0.2, fd + 0.3));
        let g = `<path d="M${SXc - 190} ${SYc - 60} L${SXc + 190} ${SYc - 60} L${SXc + 240} ${SYc + 60} L${SXc - 240} ${SYc + 60} Z" fill="#141008" stroke="${INK}" stroke-width="6"/>`;
        g += `<path d="M${SXc - 176} ${SYc - 52} L${SXc + 176} ${SYc - 52} L${SXc + 222} ${SYc + 52} L${SXc - 222} ${SYc + 52} Z" fill="${ACC}" opacity="${f1(0.5 * L)}"/>` + wash(SXc, SYc - 120, 360, 300, GLOW, f1(0.3 * L));
        g += `<rect x="${SXc - 70}" y="${SYc - 40}" width="140" height="40" fill="#3a2a1a" stroke="${INK}" stroke-width="4"/>`;   // the car's roof far below
        g += `<path d="M${SXc - 250} ${SYc + 40} L${SXc - 160} 640 M${SXc + 250} ${SYc + 40} L${SXc + 160} 640 M${SXc - 190} 640 L${SXc + 190} 640" stroke="#7a7a74" stroke-width="20" stroke-linecap="round"/>`;
        g += `<circle cx="${SXc}" cy="666" r="28" fill="#4a4a46" stroke="${INK}" stroke-width="5"/><path d="M${SXc} 694 L${SXc} ${SYc - 40}" stroke="#1a1a1a" stroke-width="4"/><path d="M${SXc + 24} 680 L${SXc + 300} 1100" stroke="#1a1a1a" stroke-width="4"/><rect x="${SXc + 270}" y="1090" width="150" height="130" fill="#5a5e62" stroke="${INK}" stroke-width="5"/>`;
        return g; };
      return E.cine.shot(ctx, {
        set: 'bf76_tj', grade: 'night', haze: 0.35, dof: true,
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 10, y: 70, z: 1.07 } },
        figures: [
          { id: 'bf73_police', x: 160, y: 1700, scale: 0.7, dir: 1, turn: 0.35, pose: 'torch', expr: 'focused', depth: 1.04, hat: { style: 'cap', color: '#1a202a' }, propOpts: { beamLen: 340 },
            walk: { at: 0.05, dur: Math.max(1.0, lg - 0.1), cadence: 3.4, stride: 14, from: -40, to: 200 }, keys: [{ at: fd - 0.2, pose: 'torch_low', expr: 'shocked', dur: 0.35 }] }
        ],
        props: [{ depth: 1.0, accent: true, svg: shaft }],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'TIJUANA · FOUND AUG 2019', fs: 40, sub: 'Its entrance: a small industrial building' }
        ],
        tag: TAG
      });
    },

    // 6 - THE BIGGEST REVEAL: the cutaway, closer; the camera travels right along the lit tunnel from the shaft, under the
    //     fence, towards the American side (the 4,309 FT counter, the 70 FT depth line); the single impact on '4,309'
    bf76_long(ctx) {
      const t = ctx.t, T = ctx.T, w0 = LS(ctx, 0, 0.2), sv = WT(ctx, 0, 2, 1.4);
      return E.cine.shot(ctx, {
        set: 'bf76_cut', grade: 'night', haze: 0.25,
        cam: { keys: [{ at: 0, x: -380, y: 380, z: 1.3 }, { at: 0.1, x: -360, y: 380, z: 1.3, dur: 0.6 }, { at: 0.7, x: 300, y: 370, z: 1.32, dur: Math.max(1.6, T - 0.9) }] },
        figures: [
          { id: 'bf72_agent1', x: SX + 80, y: TY1 - 6, scale: 0.08, dir: 1, turn: 0.4, pose: 'torch', expr: 'focused', depth: 1.01, hat: { style: 'cap', color: '#1e2630' }, propOpts: { beamLen: 200 },
            walk: { at: 0.1, dur: Math.max(2.4, T), cadence: 3.2, stride: 10, from: SX + 80, to: FX + 120 } }
        ],
        props: [heroCut({ glow: 1, depth: seg(t, sv - 0.1, sv + 0.9), carY: CAR_BOT, cartX: lerp(380, 900, seg(t, 0.4, T)) })],
        overlays: [
          { type: 'impact', at: w0 + 0.05, x: 540, y: 900 },
          { type: 'counter', at: w0, dur: 1.2, from: 0, to: 4309, prefix: '', suffix: ' FT', label: 'LONGEST ON THE BORDER (CBP)', y: 520, fs: 130 }
        ],
        tag: TAG
      });
    },

    // 7 - the elevator close up: inside the shaft, the lit car comes down to the tunnel mouth, where a rail cart waits under
    //     the power cables and the vent duct; an agent at the bottom looks up; on line 2 he turns to look down the tunnel and
    //     the FUN FACT appears (the sandbagged old exit)
    bf76_elev(ctx) {
      const t = ctx.t, T = ctx.T, ev = WT(ctx, 0, 4, 1.2), l2 = LS(ctx, 1, 2.4), sb = WT(ctx, 1, 4, 3.2);
      const MY = 1180;   // the tunnel mouth's ceiling
      const shaft = tt => { const cy = lerp(250, MY - 330, ease.inOut(seg(tt, 0, ev + 0.9)));
        let g = `<path d="M240 -300 L240 ${MY + 260} M840 -300 L840 ${MY}" stroke="#6a6a66" stroke-width="12"/>`;
        // the tunnel mouth at the bottom right: the lit bore going right with rails, cables, duct, a cart
        g += `<rect x="840" y="${MY}" width="700" height="260" fill="#2a1c12" stroke="${INK}" stroke-width="6"/><rect x="846" y="${MY + 8}" width="690" height="244" fill="${ACC}" opacity="0.5"/>` + wash(1000, MY + 130, 360, 160, GLOW, 0.3);
        g += `<path d="M846 ${MY + 30} L1540 ${MY + 30}" stroke="#5a5a56" stroke-width="22"/><path d="M846 ${MY + 56} L1540 ${MY + 56}" stroke="#1a1a1a" stroke-width="5"/>` + [900, 1040, 1180].map(x => `<circle cx="${x}" cy="${MY + 72}" r="7" fill="#fff0c8"/>`).join('');
        g += `<path d="M160 ${MY + 236} L1540 ${MY + 236}" stroke="#9a9a94" stroke-width="8"/>` + (() => { let s = ''; for (let x = 180; x < 1540; x += 50) s += `<path d="M${x} ${MY + 228} L${x} ${MY + 250}" stroke="#5a3e24" stroke-width="8"/>`; return s; })();
        g += cart(1000, MY + 232, 1.3, { load: true });
        g += `<rect x="160" y="${MY + 250}" width="1400" height="400" fill="#2a2420"/>`;
        // the cable and the car
        g += `<path d="M540 -300 L540 ${f1(cy)}" stroke="#1a1a1a" stroke-width="5"/>` + car(540, cy, 2.6, { glow: 1 });
        return g; };
      return E.cine.shot(ctx, {
        set: 'bf76_shaft', grade: 'night', haze: 0.25, dof: true,
        cam: { from: { x: 0, y: -20, z: 1.0 }, to: { x: 10, y: 40, z: 1.06 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'bf72_agent1', x: 300, y: MY + 250, scale: 0.5, dir: 1, turn: 0.35, pose: 'torch', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#1e2630' }, propOpts: { beamLen: 240, aim: -40 },
            keys: [{ at: ev, pose: 'point_up', expr: 'shocked', gaze: [0.3, -0.8], dur: 0.35 }, { at: l2, pose: 'torch_low', expr: 'focused', headTurn: 0.3, dur: 0.4 }, { at: sb + 0.2, pose: 'hand_to_face', expr: 'realise', dur: 0.5 }] }
        ],
        props: [{ depth: 1.0, accent: true, svg: shaft }],
        overlays: [
          { type: 'label', at: ev + 0.2, x: 60, y: 560, text: 'AN ELEVATOR AT THE ENTRANCE', fs: 40, sub: 'Plus high-voltage power, vents, drainage', until: l2 - 0.05 },
          { type: 'funfact', at: l2 + 0.05, y: 420, rows: [{ text: 'ITS SUSPECTED OLD EXIT:' }, { text: 'BLOCKED WITH' }, { text: 'HUNDREDS OF SANDBAGS' }, { text: 'Border Patrol (AP), Jan 2020', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 8 - the one closing line on the hero cutaway in frame 1's framing (the loop): the unfinished side branch lights up and
    //     stops short (UNFINISHED); the elevator car rises back to frame 1's start; the camera eases back to frame 1's start
    bf76_end(ctx) {
      const t = ctx.t, T = ctx.T, nx = WT(ctx, 0, 2, 0.6), fn = WT(ctx, 0, 6, 1.6);
      return E.cine.shot(ctx, {
        set: 'bf76_cut', grade: 'night', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [
          kneeler([{ at: nx, pose: 'kneel', expr: 'focused', headTurn: 0.2, dur: 0.4 }, { at: fn, pose: 'kneel', expr: 'realise', headTurn: -0.2, dur: 0.5 }]),
          usAgent([{ at: 0.3, pose: 'torch', dur: 0.6 }, { at: fn, pose: 'hand_to_face', expr: 'realise', dur: 0.5 }])
        ],
        props: [heroCut({ glow: 1, branch: seg(t, nx - 0.1, fn), carY: lerp(CAR_TOP + 200, CAR_TOP, ease.inOut(seg(t, 0.1, T - 0.3))), cartX: lerp(420, 300, seg(t, 0, T)) })],
        overlays: [],
        tag: TAG
      });
    }
  });
})();
