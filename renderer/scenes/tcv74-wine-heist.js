/* Case File 74 (premium look, engagement v5, the LIST FORMAT): WINE HEISTS, PART 1.
   HOOK + ITEM 1 (trending): October 2026, Marchesi Antinori's facility near Cortona, Tuscany: thieves switched off the alarm
   and cameras, backed in two trucks and loaded about 30,000 bottles (incl. 8,000-10,000 Solaia) with the winery's own
   forklifts; about EUR 5 million; no arrests (as of 18 Oct 2026).
   ITEM 2: October 2021, the Atrio hotel, Caceres, Spain: a couple checked in as guests; in the night she ordered room
   service, the lone clerk left the desk, he took the cellar key; 45 bottles incl. an 1806 Chateau d'Yquem; jailed 2023.
   ITEM 3 (best last): November 2025, L'Auberge Provencale, Virginia: fake event planners on a cellar tour left decoy bottles
   in the rack; six bottles, about $42,000; staff stopped the woman (pleaded guilty), the man got away.
   Structure: frame 1 = the HERO, a sound-off picture of the headline: a dim cellar wall of rack slots, every slot EMPTY except
   one bottle (the accent, glowing), a night guard's torch beam sweeping the empty wall, the winery's forklift parked by the
   wall, the camera already pushing in. Item 1's loading bay (alarm and camera lights go dark; a forklift carries a pallet of
   cases into the trucks; the EUR counter); item 2 in a hotel lobby (check-in) and at the night desk (room service; the key;
   the FUN FACT, 1806); item 3 in a lamp-lit stone cellar (the tour), then the biggest reveal close on the display shelves
   (a real bottle lifts away, a decoy slides into its place: the single impact, the music drop), then the inn's door at dusk
   (staff stop her; he walks off); the one closing line back on frame 1's cellar (the loop) with the end card.
   Smoothness: cuts and dissolves, one push (into item 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact. Screen direction: what is taken moves LEFT TO RIGHT (the forklift, the couple, the clerk, the
   bottle, the man leaving).
   Look: episode.look = 'premium', one dark wine-cellar palette (shadow #16121a, mid #c9b8a2, accent #b8324a). The ONLY
   strongly coloured object is the lone bottle's wine-red capsule (and, per item, its accent prop: the cases' red stripe,
   the cellar key, the swapped bottle), props marked accent: true.
   Content rules: Antinori, Solaia, Atrio and the Virginia restaurant are plain text only: every bottle is a generic dark
   bottle with a blank cream label, every case a plain wooden case; no logo, crest, label artwork or real building. Real
   people (the gang, the Atrio couple, the Virginia pair) are dark silhouettes tagged NOT A LIKENESS; the guard, the clerk
   and the sommelier are generic figures. No weapon, no force: the sommelier only stands in the woman's way.
   New environments (E.registerSets): wh74_cellar (the emptied rack wall), wh74_bay (the loading bay at night), wh74_hotel
   (a hotel lobby; view 'lobby' or 'desk'), wh74_vault (a lamp-lit stone cellar; view 'tour' or 'close'), wh74_inn (a
   country inn's front at dusk). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#b8324a', GLOW = '#ffcf8a', CAP = '#c23a50', GLASS = '#1c2a22', LABEL = '#e4d8bc';

  // ---------- small props
  // a bottle seen neck-out from the front of a rack slot (dark glass shoulder, neck, foil capsule); o.cap colour, o.glow
  function neck(x, y, s, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    if (o.glow) g += wash(0, 0, 110, 110, o.cap || CAP, f1(0.3 * o.glow)) + wash(0, 0, 60, 60, GLOW, f1(0.22 * o.glow));
    g += `<circle cx="0" cy="0" r="34" fill="${GLASS}" stroke="${INK}" stroke-width="4"/><path d="M-22 -18 A28 28 0 0 1 10 -28" stroke="#5a7a66" stroke-width="5" fill="none" opacity="0.7"/>`;
    g += `<circle cx="0" cy="0" r="17" fill="${o.cap || '#3a3430'}" stroke="${INK}" stroke-width="3"/><circle cx="-5" cy="-5" r="5" fill="#fff" opacity="${o.cap ? 0.55 : 0.25}"/>`;
    return g + '</g>';
  }
  // a generic bottle lying on its side, neck to the right (dark glass, blank cream label, foil capsule); centre (x, y)
  function bottleSide(x, y, s, rot = 0, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    if (o.glow) g += wash(10, 0, 220, 90, o.cap || CAP, f1(0.3 * o.glow)) + wash(10, 0, 140, 60, GLOW, f1(0.18 * o.glow));
    g += `<path d="M-130 -38 Q-140 -38 -140 -28 L-140 28 Q-140 38 -130 38 L40 38 Q74 36 92 16 L112 12 L150 12 L150 -12 L112 -12 L92 -16 Q74 -36 40 -38 Z" fill="${GLASS}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    g += `<path d="M-124 -26 L30 -28" stroke="#5a7a66" stroke-width="6" opacity="0.55" stroke-linecap="round"/>`;
    g += `<rect x="-96" y="-30" width="96" height="60" rx="4" fill="${o.label || LABEL}" stroke="${INK}" stroke-width="3"/><rect x="-84" y="-8" width="70" height="8" rx="3" fill="#b8ab90" opacity="0.7"/>`;
    g += `<rect x="112" y="-14" width="42" height="28" rx="4" fill="${o.cap || '#4a4038'}" stroke="${INK}" stroke-width="3"/>`;
    return g + '</g>';
  }
  // a generic bottle standing upright (dark glass, blank cream label, wine-red foil capsule); bottom-centre (x, y)
  function bottleUp(x, y, s, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    if (o.glow) g += wash(0, -130, 110, 170, o.cap || CAP, f1(0.28 * o.glow)) + wash(0, -230, 60, 60, GLOW, f1(0.2 * o.glow));
    g += `<ellipse cx="0" cy="2" rx="52" ry="9" fill="#000" opacity="0.5"/>`;
    g += `<path d="M-40 0 Q-46 0 -46 -8 L-46 -150 Q-46 -186 -16 -200 L-16 -262 L16 -262 L16 -200 Q46 -186 46 -150 L46 -8 Q46 0 40 0 Z" fill="${GLASS}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    g += `<path d="M-30 -20 L-30 -150 Q-30 -170 -12 -186" stroke="#6a8a76" stroke-width="7" fill="none" opacity="0.6" stroke-linecap="round"/>`;
    g += `<rect x="-40" y="-118" width="80" height="66" rx="4" fill="${o.label || LABEL}" stroke="${INK}" stroke-width="3"/><rect x="-26" y="-90" width="52" height="8" rx="3" fill="#b8ab90" opacity="0.7"/>`;
    g += `<rect x="-18" y="-266" width="36" height="48" rx="4" fill="${o.cap || '#4a4038'}" stroke="${INK}" stroke-width="3"/><rect x="-12" y="-262" width="7" height="40" fill="#fff" opacity="0.35"/>`;
    return g + '</g>';
  }
  // a plain wooden wine case (front face) with one wine-red stripe; bottom-centre (x, y)
  function wcase(x, y, s, stripe = true) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-90" y="-70" width="180" height="70" fill="#a8845a" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M-90 -46 L90 -46 M-90 -22 L90 -22" stroke="#8a6a44" stroke-width="3"/>` + (stripe ? `<rect x="-90" y="-62" width="180" height="10" fill="${ACC}" opacity="0.8"/>` : '') +
      `<rect x="-40" y="-40" width="80" height="22" rx="3" fill="#c8a878" stroke="#8a6a44" stroke-width="2"/></g>`;
  }
  // a pallet with a stack of cases (3 wide x n high); bottom-centre (x, y)
  function palletLoad(x, y, s, n = 3) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-290" y="-30" width="580" height="30" fill="#8a6a46" stroke="${INK}" stroke-width="4"/>` +
      [-240, -40, 160].map(px => `<rect x="${px}" y="-24" width="80" height="18" fill="#3a2c20"/>`).join('');
    for (let r = 0; r < n; r++) for (let c = 0; c < 3; c++) g += wcase(-190 + c * 190, -30 - r * 72, 1.0, r === n - 1);
    return g + '</g>';
  }
  // a generic warehouse forklift, side view facing right (no badge); o.fork 0..1 raises the forks, o.load draws a pallet of
  // cases on them, o.driver draws a dark seated silhouette in the cage; ground y = 0
  function forklift(x, y, s, o = {}) {
    const fh = -40 - 220 * (o.fork || 0);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * (o.dir || 1))} ${sc(s)})"><ellipse cx="40" cy="4" rx="330" ry="22" fill="#000" opacity="0.4"/>`;
    // the mast and forks (front, right)
    g += `<rect x="200" y="-460" width="26" height="440" fill="#3a3e44" stroke="${INK}" stroke-width="4"/><rect x="236" y="-460" width="26" height="440" fill="#3a3e44" stroke="${INK}" stroke-width="4"/>`;
    g += `<g transform="translate(0 ${f1(fh)})"><rect x="250" y="-60" width="30" height="80" fill="#2a2c30" stroke="${INK}" stroke-width="3"/><rect x="262" y="8" width="230" height="16" fill="#4a4e54" stroke="${INK}" stroke-width="3"/>` +
      (o.load ? palletLoad(372, 8, 0.4, 3) : '') + `</g>`;
    // the body (amber-grey, muted), counterweight at the back, overhead guard cage, seat
    g += `<path d="M-200 -40 L-200 -190 Q-200 -230 -160 -230 L60 -230 L80 -150 L200 -150 L200 -40 Z" fill="#9a8a5e" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-200 -190 Q-240 -190 -240 -150 L-240 -60 Q-240 -40 -210 -40 Z" fill="#6a6040" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-120 -230 L-110 -470 L150 -470 L170 -230" stroke="#2a2c30" stroke-width="14" fill="none" stroke-linejoin="round"/><rect x="-120" y="-484" width="300" height="20" fill="#2a2c30"/>`;
    g += `<rect x="-60" y="-300" width="60" height="70" rx="10" fill="#2a2a2c" stroke="${INK}" stroke-width="3"/><path d="M80 -230 L120 -330" stroke="#2a2c30" stroke-width="10" stroke-linecap="round"/>`;
    if (o.driver) g += `<path d="M-40 -300 Q-50 -380 -10 -392 Q30 -396 34 -360 Q36 -330 20 -310 L60 -260 L-30 -240 Z" fill="#0c0c0e"/><circle cx="2" cy="-412" r="30" fill="#0c0c0e"/>` + `<path d="M-30 -418 A32 32 0 0 1 20 -440" stroke="${GLOW}" stroke-width="4" fill="none" opacity="0.5"/>`;
    [-120, 140].forEach(wx => { g += `<circle cx="${wx}" cy="-46" r="${wx > 0 ? 58 : 48}" fill="#141516" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-46" r="${wx > 0 ? 22 : 18}" fill="#7e868c"/>`; });
    g += `<rect x="40" y="-210" width="16" height="10" rx="3" fill="#ffb04a"/>`;
    return g + '</g>';
  }
  // the rear of a box truck backed into a dock door, its doors swung open; k 0..1 = how full the box is with cases
  function truckRear(x, y, s, k = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    g += `<rect x="-190" y="-560" width="380" height="520" fill="#d8d4cc" stroke="${INK}" stroke-width="6"/><rect x="-170" y="-540" width="340" height="490" fill="#1c1a18"/>`;
    const n = Math.round(9 * k);
    for (let i = 0; i < n; i++) { const c = i % 3, r = Math.floor(i / 3); g += `<g opacity="0.85">${wcase(-110 + c * 110, -60 - r * 64, 0.58, false)}</g>`; }
    g += `<path d="M-190 -560 L-280 -530 L-280 -50 L-190 -40 Z" fill="#c8c4bc" stroke="${INK}" stroke-width="5"/><path d="M190 -560 L280 -530 L280 -50 L190 -40 Z" fill="#c8c4bc" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="-200" y="-40" width="400" height="26" fill="#3a3c40" stroke="${INK}" stroke-width="4"/><rect x="-196" y="-30" width="30" height="16" rx="3" fill="#b8392b"/><rect x="166" y="-30" width="30" height="16" rx="3" fill="#b8392b"/>`;
    return g + '</g>';
  }

  // ---------- THE HERO: the rack wall (world coordinates). Cubbies on a square grid; every slot empty except the LONE slot
  const RX = -260, RY = 520, P = 104, COLS = 16, ROWS = 8, NC = 7, NR = 2;   // the display niche: columns 7-8, rows 2-4
  const NX0 = RX + NC * P, NY0 = RY + NR * P, NX1 = NX0 + 2 * P, NY1 = NY0 + 3 * P;
  const LONE = [(NX0 + NX1) / 2, NY1 - 150];   // the lone bottle stands in the niche
  function rackWall(t, o = {}) {
    let g = `<rect x="${RX - 30}" y="${RY - 40}" width="${COLS * P + 60}" height="${ROWS * P + 70}" fill="#3a2a1e" stroke="${INK}" stroke-width="6"/>`;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const x = RX + c * P, y = RY + r * P;
      if (!o.full && c >= NC && c < NC + 2 && r >= NR && r < NR + 3) continue;
      g += `<rect x="${x + 7}" y="${y + 7}" width="${P - 14}" height="${P - 14}" fill="#0e0a08" stroke="#5a4230" stroke-width="5"/><path d="M${x + 10} ${y + P - 12} L${x + P - 10} ${y + P - 12}" stroke="#2a1e16" stroke-width="5"/>`;
      if (o.full) g += neck(x + P / 2, y + P / 2, 0.95, {});
    }
    g += `<rect x="${RX - 30}" y="${RY - 52}" width="${COLS * P + 60}" height="18" fill="#5a4230" stroke="${INK}" stroke-width="4"/>`;
    // the display niche (a lit recess) where the one bottle stands
    if (!o.full) g += `<rect x="${NX0 + 7}" y="${NY0 + 7}" width="${NX1 - NX0 - 14}" height="${NY1 - NY0 - 14}" fill="#1a120e" stroke="#6a4e38" stroke-width="6"/><rect x="${NX0 + 7}" y="${NY1 - 24}" width="${NX1 - NX0 - 14}" height="18" fill="#5a4230"/>`;
    // the dust outlines where bottles were (faint rings), so the emptiness reads
    if (!o.full) { const r = R(7401); for (let i = 0; i < 40; i++) { const c = Math.floor(r() * COLS), rr = Math.floor(r() * ROWS); if (c >= NC && c < NC + 2 && rr >= NR && rr < NR + 3) continue; g += `<circle cx="${RX + c * P + P / 2}" cy="${RY + rr * P + P / 2}" r="30" fill="none" stroke="#3a2c22" stroke-width="3" opacity="0.6"/>`; } }
    return g;
  }
  // the sweeping torch spot on the wall (world space), centre cx at time t
  const spotX = (t, a = 0) => 540 + 330 * Math.sin(t * 0.9 + a);
  function heroScene(t, o = {}) {
    const sx = o.spot !== undefined ? o.spot : spotX(t);
    let g = rackWall(t, {});
    g += wash(sx, 900, 230, 200, '#fff0d0', 0.2) + wash(sx, 900, 120, 110, '#fff6e0', 0.12);
    // the lone bottle (the accent), its slot lit
    const lg = 0.75 + 0.25 * Math.sin(t * 2.2) + 0.6 * clamp(1 - Math.abs(sx - LONE[0]) / 260, 0, 1);
    g += wash(LONE[0], LONE[1], 150, 190, '#ffd8a0', f1(0.12 * lg)) + bottleUp(LONE[0], NY1 - 24, 1.0, { cap: CAP, glow: lg });
    // the floor: concrete, forklift tyre tracks leading off right, an empty case, a cork
    g += `<rect x="-400" y="1350" width="${W + 800}" height="${H}" fill="#2a2420"/>` + `<rect x="-400" y="1350" width="${W + 800}" height="14" fill="#3e342c"/>`;
    for (let i = 0; i < 2; i++) g += `<path d="M-200 ${1500 + i * 70} Q400 ${1460 + i * 70} 1300 ${1420 + i * 60}" stroke="#1a1612" stroke-width="22" fill="none" opacity="0.5" stroke-dasharray="14 10"/>`;
    g += `<g transform="translate(700 1470) rotate(-8)">${wcase(0, 0, 0.9, true)}</g>` + `<rect x="840" y="1458" width="18" height="10" rx="4" fill="#c8a878" transform="rotate(20 849 1463)"/>`;
    // two dim hanging bulbs
    [240, 860].forEach(bx => { g += `<path d="M${bx} 200 L${bx} 360" stroke="#1a1612" stroke-width="4"/><circle cx="${bx}" cy="372" r="16" fill="#ffd89a"/>` + wash(bx, 380, 220, 220, '#ffc070', 0.12); });
    return g;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // the emptied cellar: a dark brick wall (the rack and floor are drawn as a prop at depth 1.0 so figures sit in it)
    wh74_cellar(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#1e1614"/>`;
      for (let y = -280; y < 1360; y += 46) { const off = (Math.round(y / 46) % 2) * 50; for (let x = -400 + off; x < W + 400; x += 100) wall += `<rect x="${x}" y="${y}" width="96" height="42" fill="#26201c" opacity="0.8"/>`; }
      wall += wash(540, 900, 900, 700, '#3a2418', 0.25);
      return { light: { dir: -1, rim: GLOW, key: '#e8d0b0' }, layers: [[0.3, wall]], dust: true };
    },

    // the loading bay at night: a concrete wall with two open dock doors (a truck backed into each), the pillar between
    // them carrying a security camera and an alarm panel (drawn in the shot), a concrete floor with yellow lines
    wh74_bay(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1600" fill="#2c2e32"/>`;
      for (let y = 0; y < 1200; y += 120) wall += `<path d="M-400 ${y} L${W + 400} ${y}" stroke="#25272a" stroke-width="4"/>`;
      wall += [0, 1, 2].map(i => `<rect x="${-200 + i * 560}" y="200" width="200" height="14" rx="6" fill="#e8e4d8" opacity="0.7"/>`).join('') + wash(540, 260, 900, 200, '#d8e0e8', 0.08);
      // the dock door openings (dark, the trucks are drawn in the shot) and their frames
      let doors = [[-20, 500], [600, 1120]].map(([a, b]) => `<rect x="${a}" y="560" width="${b - a}" height="640" fill="#0c0d10" stroke="${INK}" stroke-width="8"/><rect x="${a}" y="520" width="${b - a}" height="44" fill="#4a4e54" stroke="${INK}" stroke-width="5"/>`).join('');
      doors += [[-20, 500], [600, 1120]].map(([a, b]) => `<rect x="${a - 16}" y="560" width="16" height="640" fill="#e0b040" opacity="0.7"/><rect x="${b}" y="560" width="16" height="640" fill="#e0b040" opacity="0.7"/>`).join('');
      let floor = `<rect x="-400" y="1200" width="${W + 800}" height="${H}" fill="#4a4844"/><rect x="-400" y="1200" width="${W + 800}" height="30" fill="#2a2a2a"/>`;
      floor += [0, 1, 2, 3].map(i => `<path d="M${-100 + i * 380} 1240 L${-500 + i * 560} 1960" stroke="#c8a040" stroke-width="10" opacity="0.45"/>`).join('');
      return { light: { dir: 1, rim: '#ffe0b0', key: '#e8e0d0' }, layers: [[0.2, wall], [0.4, doors], [0.8, floor]] };
    },

    // a hotel at night: o.view 'lobby' = stone arches, a lamp-lit reception desk on the right with a key board behind it;
    // 'desk' = closer and darker, the desk centred, a wooden cellar door on the left
    wh74_hotel(ctx, o = {}) {
      const desk = o.view === 'desk';
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="${desk ? '#2a221c' : '#3a2e24'}"/>`;
      for (let y = -200; y < 1300; y += 70) { const off = (Math.round(y / 70) % 2) * 90; for (let x = -400 + off; x < W + 400; x += 180) wall += `<rect x="${x}" y="${y}" width="174" height="64" rx="6" fill="${desk ? '#30271f' : '#443628'}" opacity="0.7"/>`; }
      let arches = '';
      if (!desk) {
        arches = [-180, 260].map(ax => `<path d="M${ax} 1240 L${ax} 640 Q${ax + 170} 420 ${ax + 340} 640 L${ax + 340} 1240 Z" fill="#1a1410" stroke="#5a4634" stroke-width="18"/>` + wash(ax + 170, 900, 200, 260, '#ffc078', 0.06)).join('');
        arches += `<rect x="700" y="560" width="300" height="260" rx="6" fill="#4a3826" stroke="#2a2018" stroke-width="6"/>` + [0, 1, 2].map(r => [0, 1, 2, 3, 4].map(c => `<circle cx="${740 + c * 56}" cy="${610 + r * 80}" r="7" fill="#c8a868"/><rect x="${736 + c * 56}" y="${618 + r * 80}" width="8" height="30" fill="#d8c8a0"/>`).join('')).join('');
      } else {
        arches = `<rect x="-60" y="560" width="300" height="680" fill="#4a3424" stroke="${INK}" stroke-width="8"/><rect x="-30" y="600" width="240" height="280" fill="#3a2a1c" stroke="#2a1e14" stroke-width="5"/><rect x="-30" y="920" width="240" height="280" fill="#3a2a1c" stroke="#2a1e14" stroke-width="5"/><circle cx="210" cy="900" r="12" fill="#c8a868"/>`;
        arches += `<rect x="560" y="520" width="380" height="300" rx="6" fill="#4a3826" stroke="#2a2018" stroke-width="6"/>` + [0, 1, 2].map(r => [0, 1, 2, 3, 4, 5].map(c => `<circle cx="${600 + c * 60}" cy="${570 + r * 90}" r="7" fill="#c8a868"/>`).join('')).join('');
      }
      const lamp = desk ? wash(760, 1100, 360, 260, '#ffc070', 0.16) : wash(860, 1100, 420, 300, '#ffc070', 0.14);
      let floor = `<rect x="-400" y="1240" width="${W + 800}" height="${H}" fill="${desk ? '#3a2a20' : '#5a4232'}"/>`;
      for (let i = -6; i <= 12; i++) floor += `<path d="M${540 + i * 120} 1240 L${540 + i * 260} ${H + 100}" stroke="#2e2219" stroke-width="3" opacity="0.6"/>`;
      return { light: { dir: -1, rim: '#ffc888', key: '#f0d8b8' }, layers: [[0.2, wall], [0.35, arches + lamp], [0.8, floor]] };
    },

    // a lamp-lit stone cellar: barrel vault, racks of bottles along the back (o.view 'tour'), or ('close') a dark stone
    // backdrop for the close-up display shelves drawn in the shot
    wh74_vault(ctx, o = {}) {
      const close = o.view === 'close';
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#2a2420"/>`;
      const r = R(7411);
      for (let i = 0; i < 160; i++) { const x = -380 + r() * 1840, y = -200 + r() * 1500, w = 60 + r() * 90; back += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(36 + r() * 30)}" rx="10" fill="#3a322c" opacity="${f1(0.5 + 0.4 * r())}"/>`; }
      let rack = '';
      if (!close) {
        back += `<path d="M-400 520 Q540 -40 1480 520" stroke="#4a3e34" stroke-width="40" fill="none"/>`;
        rack = `<rect x="-120" y="640" width="1320" height="600" fill="#3a2a1e" stroke="${INK}" stroke-width="6"/>`;
        for (let rr = 0; rr < 6; rr++) for (let c = 0; c < 14; c++) { const x = -100 + c * 92, y = 660 + rr * 96; rack += `<rect x="${x}" y="${y}" width="84" height="88" fill="#100c0a" stroke="#5a4230" stroke-width="4"/>` + neck(x + 42, y + 44, 0.85, {}); }
        rack += [180, 900].map(lx => `<path d="M${lx} 300 L${lx} 520" stroke="#1a1612" stroke-width="4"/><path d="M${lx - 40} 560 L${lx} 520 L${lx + 40} 560 Z" fill="#3a3028"/><circle cx="${lx}" cy="568" r="14" fill="#ffd89a"/>` + wash(lx, 600, 300, 280, '#ffb860', 0.16)).join('');
      } else back += wash(540, 900, 800, 600, '#ffb860', 0.1);
      let floor = `<rect x="-400" y="1240" width="${W + 800}" height="${H}" fill="#4a3e34"/>`;
      for (let i = 0; i < 9; i++) floor += `<path d="M-400 ${1270 + i * 80} L${W + 400} ${1270 + i * 80}" stroke="#3a3028" stroke-width="4"/>`;
      return { light: { dir: -1, rim: '#ffc070', key: '#f0d8b4' }, layers: close ? [[0.3, back]] : [[0.2, back], [0.5, rack], [0.8, floor]] };
    },

    // a country inn's front at dusk: a deep blue sky, trees, a stone house with a porch and warm windows, lanterns either
    // side of the door, a gravel drive
    wh74_inn(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="whisky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121a30"/><stop offset="0.7" stop-color="#3a3a58"/><stop offset="1" stop-color="#8a6a6a"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1700" fill="url(#whisky)"/>` + E.cine.stars(t, 40, 7421, -200, 500);
      let trees = '';
      const r = R(7422); for (let i = 0; i < 9; i++) { const x = -360 + i * 220 + r() * 60, h = 380 + r() * 200; trees += `<ellipse cx="${f1(x)}" cy="${f1(1000 - h / 2)}" rx="${f1(130 + r() * 50)}" ry="${f1(h / 2)}" fill="#141a20"/>`; }
      let house = `<rect x="-80" y="640" width="1080" height="560" fill="#6a6258" stroke="${INK}" stroke-width="7"/><path d="M-140 660 L460 380 L1060 660 Z" fill="#2e2a2c" stroke="${INK}" stroke-width="7"/>`;
      const rs = R(7423); for (let i = 0; i < 70; i++) house += `<rect x="${f1(-70 + rs() * 1040)}" y="${f1(650 + rs() * 540)}" width="${f1(40 + rs() * 50)}" height="${f1(22 + rs() * 16)}" rx="6" fill="#7a7266" opacity="0.6"/>`;
      house += [40, 640, 820].map(wx => `<rect x="${wx}" y="760" width="120" height="160" fill="#ffd08a" stroke="${INK}" stroke-width="6"/><path d="M${wx + 60} 760 L${wx + 60} 920 M${wx} 840 L${wx + 120} 840" stroke="${INK}" stroke-width="5"/>` + wash(wx + 60, 840, 160, 160, '#ffc070', 0.16)).join('');
      // the door (open, warm light) and the porch roof with two lanterns
      house += `<rect x="280" y="820" width="170" height="380" fill="#ffcf8a" stroke="${INK}" stroke-width="7"/><path d="M280 820 L230 840 L230 1200 L280 1200 Z" fill="#4a3424" stroke="${INK}" stroke-width="5"/>` + wash(365, 1020, 260, 300, '#ffc070', 0.2);
      house += `<path d="M180 780 L560 780 L590 820 L150 820 Z" fill="#3a3430" stroke="${INK}" stroke-width="5"/>` + [230, 500].map(lx => `<rect x="${lx - 14}" y="860" width="28" height="44" rx="6" fill="#ffd08a" stroke="${INK}" stroke-width="3"/>` + wash(lx, 880, 90, 90, '#ffc070', 0.25)).join('');
      let ground = `<rect x="-400" y="1200" width="${W + 800}" height="${H}" fill="#5a5048"/>`;
      const rg = R(7424); for (let i = 0; i < 120; i++) ground += `<circle cx="${f1(-380 + rg() * 1840)}" cy="${f1(1210 + rg() * 700)}" r="${f1(2 + rg() * 3)}" fill="#7a7066" opacity="0.6"/>`;
      return { light: { dir: -1, rim: '#ffc888', key: '#e8d0c0' }, layers: [[0.05, sky], [0.25, trees], [0.5, house], [0.8, ground]] };
    }
  });

  // the hero prop (frame 1 and the last frame): the rack wall + floor at depth 1.0
  const hero = (o = {}) => ({ depth: 1.0, accent: true, svg: tt => heroScene(tt, o) });
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 20, y: -10, z: 1.09 };
  const parked = () => ({ depth: 1.01, svg: () => forklift(120, 1560, 0.56, { fork: 0.35 }) });
  const guard = (aim, keys = []) => ({ id: 'wh74_guard', x: 860, y: 1640, scale: 0.6, dir: -1, turn: 0.4, pose: 'torch', expr: 'focused', depth: 1.03, propOpts: { beamLen: 520, aim }, keys });

  E.registerScenes({
    // 1 - hook (frame 1): the emptied rack wall, one bottle left; the guard's torch sweeps; the camera already pushing in;
    //     on line 2 he turns his beam down onto the winery's parked forklift
    wh74_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.5), fk = WT(ctx, 1, 5, 3.9);
      const aim = lerp(96 + 10 * Math.sin(t * 0.9), 72, ease.inOut(seg(t, l2, l2 + 0.6)));
      return E.cine.shot(ctx, {
        set: 'wh74_cellar', grade: 'night', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [
          guard(aim, [{ at: 0.6, pose: 'torch', expr: 'shocked', headTurn: 0.2, dur: 0.4 }, { at: l2, pose: 'torch_low', expr: 'realise', headTurn: -0.2, dur: 0.6 }])
        ],
        props: [hero({ spot: t < l2 ? undefined : lerp(spotX(l2), 260, ease.inOut(seg(t, l2, l2 + 0.8))) }), parked(),
          { depth: 1.02, svg: tt => tt > l2 ? wash(260, 1360, 300, 180, '#fff0d0', f1(0.22 * seg(tt, l2 + 0.3, l2 + 0.8))) : '' }],
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.3), x: 60, y: 560, text: 'ANTINORI · TUSCANY, ITALY', fs: 40, sub: 'Discovered 5 Oct 2026' },
          { type: 'label', at: fk + 0.1, x: 60, y: 1190, text: "THE WINERY'S OWN FORKLIFTS", fs: 36, sub: 'Antinori CEO, via AP' }
        ],
        tag: TAG
      });
    },

    // 2 - ITEM 1 continued: the loading bay at night; the camera's red light and the alarm panel go dark on 'switched';
    //     a forklift (a silhouette driving) carries a pallet of cases right, into the right-hand truck, which fills; a
    //     second thief (silhouette) waves it in; the EUR counter
    wh74_trucks(ctx) {
      const t = ctx.t, T = ctx.T, sw = WT(ctx, 0, 1, 0.5), tr = WT(ctx, 1, 2, 2.8), fv = WT(ctx, 1, 5, 3.8);
      const off = seg(t, sw + 0.1, sw + 0.3);
      const fx0 = lerp(-20, 420, ease.inOut(seg(t, 0, T - 0.3)));
      return E.cine.shot(ctx, {
        set: 'wh74_bay', grade: 'night', haze: 0.35,
        cam: { from: { x: -20, y: 20, z: 1.02 }, to: { x: 20, y: 30, z: 1.08 } },
        figures: [
          { id: 'wh74_crew', x: 960, y: 1650, scale: 0.52, dir: -1, turn: 0.3, pose: 'stand', silhouette: 'cool', depth: 1.03,
            keys: [{ at: sw + 0.2, pose: 'point', dur: 0.4 }, { at: tr, pose: 'hands_together', headTurn: 0.3, dur: 0.5 }, { at: fv + 0.4, pose: 'point', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.9, accent: true, svg: tt => truckRear(240, 1200, 0.9, 1) + truckRear(860, 1200, 0.9, 0.2 + 0.7 * seg(tt, 1.0, T)) },
          { depth: 0.92, svg: tt => { const k = 1 - seg(tt, sw + 0.1, sw + 0.3);
            let g = `<rect x="490" y="420" width="100" height="70" rx="8" fill="#3a3c40" stroke="${INK}" stroke-width="4"/><path d="M540 420 L540 380" stroke="#3a3c40" stroke-width="10"/><rect x="560" y="440" width="40" height="30" rx="6" fill="#1a1c1e"/>`;
            g += `<circle cx="512" cy="442" r="9" fill="#e83a3a" opacity="${f1(0.15 + 0.85 * k * (0.6 + 0.4 * Math.sin(tt * 8)))}"/>` + (k > 0.05 ? wash(512, 442, 40, 40, '#ff4a4a', f1(0.4 * k)) : '');
            g += `<rect x="500" y="680" width="80" height="110" rx="6" fill="#d8d4cc" stroke="${INK}" stroke-width="4"/><rect x="512" y="696" width="56" height="30" fill="${k > 0.05 ? '#7ad08a' : '#1a2a20'}"/>` + [0, 1, 2].map(i => `<rect x="${514 + i * 18}" y="740" width="14" height="10" fill="#8a8680"/>`).join('');
            return g; } },
          { depth: 1.0, svg: tt => forklift(lerp(40, 380, ease.inOut(seg(tt, 0, T - 0.3))), 1660, 0.85, { fork: 0.18, load: true, driver: true }) }
        ],
        overlays: [
          { type: 'label', at: 0.35, x: 60, y: 560, text: 'INCL. 8,000-10,000 SOLAIA', fs: 40, sub: 'Only 60-70k made a year (AP)' },
          { type: 'counter', at: fv - 0.1, dur: 1.2, from: 0, to: 5000000, prefix: '€', suffix: '', label: 'OF WINE · AP, REUTERS', y: 1080, fs: 120 }
        ],
        tag: LIKE
      });
    },

    // 3 - the rehook + ITEM 2: a hotel lobby at night; the couple (silhouettes) walk in from the left with a suitcase; the
    //     clerk behind the desk hands over a key on 'checked'
    wh74_hotel(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.1), ck = WT(ctx, 1, 4, 3.0), ht = WT(ctx, 1, 8, 4.0);
      const wk = { at: 0.1, dur: Math.max(1.5, ck - 0.3) };
      const fx = tt => lerp(-120, 300, ease.out(seg(tt, wk.at, wk.at + wk.dur)));
      return E.cine.shot(ctx, {
        set: 'wh74_hotel', setOpts: { view: 'lobby' }, grade: 'warm', haze: 0.3,
        cam: { from: { x: -20, y: 30, z: 1.0 }, to: { x: 10, y: 40, z: 1.06 } },
        figures: [
          { id: 'wh74_guest_f', x: 300, y: 1660, scale: 0.62, dir: 1, turn: 0.35, pose: 'stand', silhouette: 'warm', depth: 1.03,
            walk: { at: wk.at, dur: wk.dur, cadence: 3.2, stride: 14, from: -120, to: 300 }, keys: [{ at: ck + 0.2, pose: 'hands_together', headTurn: 0.2, dur: 0.5 }] },
          { id: 'wh74_guest_m', x: 470, y: 1640, scale: 0.64, dir: 1, turn: 0.35, pose: 'stand', silhouette: 'warm', depth: 1.02,
            walk: { at: wk.at + 0.3, dur: wk.dur, cadence: 3.2, stride: 14, from: 20, to: 470 }, keys: [{ at: ht, pose: 'present', dur: 0.4 }] },
          { id: 'wh74_clerk', x: 860, y: 1560, scale: 0.6, dir: -1, turn: 0.35, pose: 'stand', expr: 'neutral', depth: 0.98,
            keys: [{ at: l2, pose: 'hands_together', expr: 'focused', dur: 0.4 }, { at: ck, pose: 'present', expr: 'relieved', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, svg: () => `<rect x="640" y="1260" width="560" height="300" fill="#5a3e28" stroke="${INK}" stroke-width="6"/><rect x="620" y="1240" width="600" height="30" fill="#7a5638" stroke="${INK}" stroke-width="5"/>` +
            [0, 1, 2].map(i => `<rect x="${680 + i * 170}" y="1300" width="130" height="220" fill="#4e3622" stroke="#3a2818" stroke-width="4"/>`).join('') + `<path d="M720 1240 Q740 1206 760 1240 Z" fill="#c8a868" stroke="${INK}" stroke-width="3"/>` + wash(820, 1150, 120, 80, '#ffc070', 0.2) + `<rect x="800" y="1110" width="40" height="130" fill="#3a2a1e"/><path d="M770 1110 L870 1110 L850 1060 L790 1060 Z" fill="#e8d0a0" stroke="${INK}" stroke-width="3"/>` },
          { depth: 1.04, svg: tt => { const x = fx(tt) + 70; return `<g transform="translate(${f1(x)} 1660)"><rect x="-10" y="-150" width="110" height="150" rx="12" fill="#2a2a30" stroke="${INK}" stroke-width="5"/><path d="M30 -150 L30 -190 L70 -190 L70 -150" stroke="#3a3a40" stroke-width="7" fill="none"/><circle cx="10" cy="0" r="9" fill="#141414"/><circle cx="90" cy="0" r="9" fill="#141414"/></g>`; } },
          { depth: 1.0, accent: true, svg: tt => tt > ck ? `<g opacity="${f1(seg(tt, ck, ck + 0.3))}"><rect x="700" y="1214" width="44" height="22" rx="4" fill="${ACC}" stroke="${INK}" stroke-width="3"/><circle cx="696" cy="1225" r="8" fill="none" stroke="#c8a868" stroke-width="4"/></g>` + wash(720, 1225, 60, 40, ACC, 0.3) : '' }
        ],
        overlays: [
          { type: 'label', at: l2 + 0.1, x: 60, y: 560, text: 'CÁCERES, SPAIN · OCT 2021', fs: 40, sub: 'Atrio: a Michelin-starred hotel' }
        ],
        tag: LIKE
      });
    },

    // 4 - ITEM 2's payoff: the desk at night; the desk phone glows; the clerk wheels a room-service trolley off right; the
    //     man (silhouette) slips in from the left, takes the key, and stands by the cellar door with a heavy bag of
    //     bottles; the FUN FACT (1806) and the outcome label
    wh74_room(ctx) {
      const t = ctx.t, T = ctx.T, rs = WT(ctx, 0, 5, 1.4), l2 = LS(ctx, 1, 2.5), tk = WT(ctx, 1, 1, 2.8), n45 = WT(ctx, 1, 2, 3.2), one = WT(ctx, 1, 4, 4.2);
      const cx = tt => lerp(700, 1400, ease.in(seg(tt, rs, rs + 1.5)));
      return E.cine.shot(ctx, {
        set: 'wh74_hotel', setOpts: { view: 'desk' }, grade: 'night', haze: 0.35,
        cam: { from: { x: 0, y: 30, z: 1.04 }, to: { x: 20, y: 40, z: 1.1 } },
        figures: [
          { id: 'wh74_clerk', x: 700, y: 1600, scale: 0.64, dir: 1, turn: 0.35, pose: 'stand', expr: 'neutral', depth: 1.02,
            walk: { at: rs, dur: 1.5, cadence: 3.4, stride: 14, from: 700, to: 1400 }, keys: [{ at: 0.4, pose: 'hand_to_face', expr: 'worried', dur: 0.4 }, { at: rs - 0.3, pose: 'hands_together', expr: 'neutral', dur: 0.3 }] },
          { id: 'wh74_guest_m', x: 400, y: 1620, scale: 0.66, dir: 1, turn: 0.35, pose: 'stand', silhouette: 'cool', depth: 1.03,
            walk: { at: Math.max(rs + 0.6, l2 - 1.0), dur: 1.0, cadence: 3.0, stride: 12, from: -200, to: 400 },
            keys: [{ at: tk - 0.1, pose: 'point_up', dur: 0.35 }, { at: n45, pose: 'hands_together', headTurn: -0.3, dur: 0.4 }] }
        ],
        props: [
          { depth: 0.98, accent: true, svg: tt => { const on = 0.5 + 0.5 * Math.sin(tt * 14), ring = tt > 0.2 && tt < rs ? 1 : 0;
            let g = `<rect x="460" y="1250" width="560" height="260" fill="#4e3622" stroke="${INK}" stroke-width="6"/><rect x="440" y="1230" width="600" height="28" fill="#6a4a30" stroke="${INK}" stroke-width="5"/>`;
            g += `<rect x="900" y="1196" width="80" height="36" rx="8" fill="#2a2a2c" stroke="${INK}" stroke-width="3"/><rect x="896" y="1180" width="88" height="18" rx="8" fill="#3a3a3c"/>` + (ring ? `<circle cx="940" cy="1200" r="8" fill="${GLOW}" opacity="${f1(on)}"/>` + wash(940, 1190, 70, 50, GLOW, f1(0.35 * on)) + `<path d="M990 1170 Q1010 1150 1000 1130 M1006 1180 Q1032 1150 1018 1120" stroke="${GLOW}" stroke-width="4" fill="none" opacity="${f1(on)}"/>` : '');
            // the cellar key on the board (the accent) until he takes it
            if (tt < tk + 0.1) g += `<rect x="736" y="700" width="16" height="40" fill="${ACC}" stroke="${INK}" stroke-width="2"/>` + wash(744, 720, 50, 50, ACC, 0.35);
            return g; } },
          { depth: 1.025, svg: tt => { const x = cx(tt); return `<g transform="translate(${f1(x + 150)} 1600)"><rect x="-90" y="-210" width="180" height="16" fill="#c8ccd0" stroke="${INK}" stroke-width="3"/><rect x="-90" y="-100" width="180" height="12" fill="#a8acb0"/><path d="M-80 -194 L-80 -20 M80 -194 L80 -20" stroke="#a8acb0" stroke-width="7"/><path d="M-50 -210 Q0 -270 50 -210 Z" fill="#d8dce0" stroke="${INK}" stroke-width="3"/><circle cx="-80" cy="-10" r="10" fill="#222"/><circle cx="80" cy="-10" r="10" fill="#222"/></g>`; } },
          { depth: 1.035, svg: tt => tt > n45 ? `<g opacity="${f1(seg(tt, n45, n45 + 0.3))}" transform="translate(560 1620)"><path d="M-70 0 L-80 -120 L80 -120 L70 0 Z" fill="#3a3430" stroke="${INK}" stroke-width="5"/>${[-46, -16, 14, 44].map(bx => `<rect x="${bx - 8}" y="-170" width="16" height="56" rx="5" fill="${GLASS}" stroke="${INK}" stroke-width="3"/><rect x="${bx - 8}" y="-174" width="16" height="14" fill="#4a4038"/>`).join('')}</g>` : '' }
        ],
        overlays: [
          { type: 'label', at: tk + 0.2, x: 60, y: 560, text: '45 BOTTLES · BOTH JAILED, 2023', fs: 38, sub: 'Arrested July 2022, Croatian border' },
          { type: 'funfact', at: one + 0.05, y: 780, rows: [{ text: 'ONE OF THE 45:' }, { text: 'AN 1806 CHÂTEAU' }, { text: "D'YQUEM" }, { text: 'CNN, Decanter, wein.plus', fs: 26 }] }
        ],
        tag: LIKE
      });
    },

    // 5 - ITEM 3 begins: the lamp-lit stone cellar; the sommelier leads the tour right, gesturing at the racks; the two
    //     "event planners" (silhouettes) follow
    wh74_tour(ctx) {
      const t = ctx.t, T = ctx.T, vg = WT(ctx, 0, 1, 0.5), fk = WT(ctx, 0, 2, 1.0), cl = WT(ctx, 0, 8, 2.8);
      return E.cine.shot(ctx, {
        set: 'wh74_vault', setOpts: { view: 'tour' }, grade: 'warm', haze: 0.35,
        cam: { from: { x: -10, y: 30, z: 1.02 }, to: { x: 20, y: 40, z: 1.08 } },
        figures: [
          { id: 'wh74_somm', x: 820, y: 1620, scale: 0.53, dir: -1, turn: 0.35, pose: 'stand', expr: 'neutral', depth: 1.02,
            walk: { at: 0.0, dur: Math.max(1.2, fk), cadence: 3.0, stride: 12, from: 640, to: 820 }, keys: [{ at: fk + 0.1, pose: 'present', expr: 'relieved', headTurn: 0.2, dur: 0.5 }, { at: cl, pose: 'point', expr: 'neutral', dur: 0.4 }] },
          { id: 'wh74_planner_f', x: 440, y: 1640, scale: 0.53, dir: 1, turn: 0.35, pose: 'stand', silhouette: 'warm', depth: 1.03,
            walk: { at: 0.0, dur: Math.max(1.4, fk + 0.4), cadence: 3.0, stride: 12, from: 200, to: 440 }, keys: [{ at: fk + 0.3, pose: 'hands_together', dur: 0.5 }, { at: cl + 0.2, pose: 'examine', dur: 0.5 }] },
          { id: 'wh74_planner_m', x: 200, y: 1620, scale: 0.55, dir: 1, turn: 0.35, pose: 'stand', silhouette: 'warm', depth: 1.01,
            walk: { at: 0.2, dur: Math.max(1.4, fk + 0.4), cadence: 3.0, stride: 12, from: -60, to: 200 }, keys: [{ at: cl, pose: 'hands_behind', headTurn: -0.3, dur: 0.5 }] }
        ],
        props: [],
        overlays: [
          { type: 'label', at: vg, x: 60, y: 560, text: 'WHITE POST, VIRGINIA · NOV 2025', fs: 38, sub: "L'Auberge Provençale's cellar" }
        ],
        tag: LIKE
      });
    },

    // 6 - THE BIGGEST REVEAL: close on the angled display shelves; a real bottle lifts off its shelf and away right (into
    //     the man's coat, at the edge); on 'fake' an identical decoy slides into the gap (the single impact); the DECOY
    //     callout; the value label
    wh74_swap(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.5), fk = WT(ctx, 0, 2, 1.0), l2 = LS(ctx, 1, 2.6);
      const SX = 520, SY = 960;
      const shelves = tt => {
        let g = '';
        [700, 960, 1220].forEach((y, i) => {
          g += `<path d="M-200 ${y + 40} L1300 ${y + 40} L1300 ${y + 64} L-200 ${y + 64} Z" fill="#5a4230" stroke="${INK}" stroke-width="5"/>`;
          for (let k = 0; k < 4; k++) { const x = -40 + k * 300 + (i % 2) * 40; if (i === 1 && k === 2) continue; g += bottleSide(x, y, 0.95, -6, {}); }
        });
        // the swap slot (row 2, third bottle): the real one lifts away right, the decoy slides in from the left
        const up = ease.inOut(seg(tt, l1 - 0.2, fk - 0.05)), dn = ease.out(seg(tt, fk - 0.15, fk + 0.35));
        if (up < 1) g += bottleSide(lerp(SX, 1180, up), lerp(SY, SY - 260, up), 0.95, lerp(-6, -24, up), { cap: CAP, glow: 1 - up });
        if (tt > fk - 0.15) g += bottleSide(lerp(-260, SX, dn), SY, 0.95, -6, { label: '#d8ccb0', glow: 0.6 * dn, cap: '#5a4a40' });
        return g; };
      return E.cine.shot(ctx, {
        set: 'wh74_vault', setOpts: { view: 'close' }, grade: 'warm', haze: 0.25, dof: true,
        cam: { from: { x: 0, y: 20, z: 1.04 }, to: { x: 10, y: 30, z: 1.12 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'wh74_planner_m', x: 1060, y: 2160, scale: 1.25, dir: -1, turn: 0.45, pose: 'stand', silhouette: 'warm', depth: 1.05,
            keys: [{ at: l1, pose: 'examine', dur: 0.4 }, { at: fk + 0.3, pose: 'hands_behind', headTurn: 0.2, dur: 0.5 }] }
        ],
        props: [{ depth: 1.0, accent: true, svg: shelves }],
        overlays: [
          { type: 'impact', at: fk, x: SX, y: SY },
          { type: 'callout', at: fk + 0.35, target: [SX - 40, SY], label: [120, 1180], text: 'A DECOY BOTTLE', w: 420, r: 70 },
          { type: 'label', at: l2 + 0.1, x: 60, y: 560, text: 'SIX BOTTLES · ABOUT $42,000', fs: 40, sub: 'Romanée-Conti wines (Wine Spectator)' }
        ],
        tag: LIKE
      });
    },

    // 7 - the inn's front at dusk: the woman (silhouette) steps out of the door and stops when the sommelier walks into
    //     her way; behind them the man (silhouette) walks briskly off to the right
    wh74_caught(ctx) {
      const t = ctx.t, T = ctx.T, ca = WT(ctx, 0, 1, 0.5), ot = WT(ctx, 0, 4, 1.4), aw = WT(ctx, 0, 6, 2.0);
      return E.cine.shot(ctx, {
        set: 'wh74_inn', grade: 'dawn', haze: 0.35,
        cam: { from: { x: -10, y: 30, z: 1.02 }, to: { x: 20, y: 40, z: 1.07 } },
        figures: [
          { id: 'wh74_planner_m', x: 1320, y: 1570, scale: 0.46, dir: 1, turn: 0.3, pose: 'stand_tense', silhouette: 'warm', depth: 0.98,
            walk: { at: ot - 0.3, dur: Math.max(1.2, T - ot), cadence: 4.0, stride: 18, from: 880, to: 1320 }, keys: [{ at: ca, pose: 'stand_tense', headTurn: -0.4, dur: 0.3 }] },
          { id: 'wh74_planner_f', x: 420, y: 1650, scale: 0.54, dir: 1, turn: 0.35, pose: 'stand', silhouette: 'warm', depth: 1.02,
            walk: { at: 0.0, dur: Math.max(0.8, ca - 0.1), cadence: 3.4, stride: 14, from: 300, to: 420 }, keys: [{ at: ca, pose: 'stand_tense', dur: 0.25 }, { at: aw, pose: 'hands_together', headTurn: 0.3, dur: 0.5 }] },
          { id: 'wh74_somm', x: 700, y: 1660, scale: 0.54, dir: -1, turn: 0.35, pose: 'stand', expr: 'determined', depth: 1.03,
            walk: { at: 0.0, dur: Math.max(0.8, ca - 0.1), cadence: 3.4, stride: 14, from: 900, to: 700 }, keys: [{ at: ca - 0.1, pose: 'present', expr: 'stern', dur: 0.3 }, { at: aw + 0.2, pose: 'point', expr: 'shocked', headTurn: 0.4, dur: 0.4 }] }
        ],
        props: [],
        overlays: [
          { type: 'label', at: ot, x: 60, y: 560, text: 'SHE PLEADED GUILTY · 12 MONTHS', fs: 38, sub: 'He is still a fugitive (May 2026)' }
        ],
        tag: LIKE
      });
    },

    // 8 - the one closing line on the hero wall in frame 1's framing (the loop): the camera eases back to frame 1's start;
    //     the guard's beam comes to rest on the one bottle left
    wh74_end(ctx) {
      const t = ctx.t, T = ctx.T, st = WT(ctx, 0, 2, 1.2);
      const aim = lerp(80, 96, ease.inOut(seg(t, 0, 1.2)));
      return E.cine.shot(ctx, {
        set: 'wh74_cellar', grade: 'night', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [guard(aim, [{ at: st, pose: 'torch', expr: 'realise', headTurn: -0.2, dur: 0.5 }])],
        props: [hero({ spot: lerp(spotX(0), LONE[0], ease.inOut(seg(t, 0, 1.4))) }), parked()],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 1190, text: 'AS OF OCT 2026: NO ARRESTS', fs: 34 }
        ],
        tag: TAG
      });
    }
  });
})();
