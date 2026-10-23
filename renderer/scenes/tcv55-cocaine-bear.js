/* Case File 55 (premium look, engagement + shares + smoothness + hooks + plateau rules): the real "Cocaine Bear".
   Andrew C. Thornton II, a former Lexington, Kentucky police narcotics officer turned smuggler, dumped duffel bags of
   cocaine over north Georgia in September 1985, then jumped over Knoxville, Tennessee; his parachute failed. Three months
   later state agents found a dead black bear beside a torn bag and about 40 ripped-open packets; the medical examiner
   said its stomach was packed with cocaine. A stuffed bear said to be it is shown in Lexington, the city he once policed.
   Structure (8 shots): frame 1 = the HERO (a black bear nosing a torn duffel bag of plain wrapped packets in a moonlit
   forest), a twin plane crossing the moon with a tiny silhouette in its open door, a bag falling, the camera already
   pushing, the headline burned in; a 1970s narcotics squad room (he walks out: 'switched sides'); inside the plane, the
   door open on the moonlit hills (the bags go out; the FUN FACT: a former paratrooper); a Knoxville street at dawn, a
   resident stops on his drive (nothing he sees is shown; the counter 79 LB); the forest by day in winter, two agents
   find the torn bag by bear prints (the biggest reveal, music drop, the single impact + shake; the bear is NOT shown);
   a North Carolina mountainside at night, the empty plane in the pines, a deputy with a torch; the LESSON on a woodland
   trail (a hiker finds a bag, steps back, calls; captions off); back on the hero framing with the end question.
   Smoothness: cut, dissolve, dissolve, push, cut, dissolve, zoom; one slow camera move per shot; settle only on the hero
   dolly-ins (first and last shots); one shake and one impact (the reveal); no handheld. Screen direction: the plane
   flies left to right; the bear faces right.
   Look: episode.look = 'premium', one moonlit palette (shadow #0f1d26, mid #c9bc9e, accent #e39a3b). The ONLY accent
   object is the duffel bag (props marked accent: true).
   Content rules: Thornton appears ONLY as a faceless rim-lit silhouette (NOT A LIKENESS); his fall and body are never
   shown. The bear is shown alive and calm, never dead, hurt or suffering. Plain wrapped packets only (no loose drugs), no
   weapon, no violence; no badge, insignia, aircraft registration, logo, brand artwork or film poster.
   New environments (E.registerSets): cb55_forest (a moonlit Appalachian forest; o.day = a grey winter day), cb55_squad
   (a 1970s squad room at night), cb55_cabin (inside a small plane, the side door open on moonlit hills), cb55_street (a
   suburban street at dawn), cb55_ridge (a mountainside at night). Plus the engine's cabin_woods. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#0c1014';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#e39a3b', ACCD = '#a8641e', MOON = '#dfe6ee';

  // ---------- THE HERO: a stylised American black bear in profile facing right; feet on y = 0 at (x, y); ~560 long at
  // s = 1. o.nose 0..1 = head lowered to the ground (sniffing); o.rim 0..1 = moonlight rim on the back; calm, never hurt.
  function bear(x, y, s, t, o = {}) {
    const nd = clamp(o.nose ?? 1, 0, 1), rim = o.rim ?? 1, br = Math.sin(t * 2.2) * 3, sn = Math.sin(t * 7.5) * 4 * nd;
    const FUR = '#14161b', FUR2 = '#1e2128', RIM = '#9fb6cc';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="10" cy="6" rx="300" ry="26" fill="#000" opacity="0.5"/>`;
    // far legs (darker), body, near legs
    // a leg: a thick tapered column from a rounded thigh/shoulder down to a broad paw (k = stride offset)
    const leg = (lx, top, w, col, k = 0) => `<path d="M${lx - w * 0.62} ${top} Q${lx - w * 0.7} ${top + 60} ${lx - w * 0.42 + k} -34 L${lx - w * 0.5 + k} -8 Q${lx + k} 6 ${lx + w * 0.62 + k} -6 L${lx + w * 0.42 + k} -34 Q${lx + w * 0.55} ${top + 70} ${lx + w * 0.6} ${top} Z" fill="${col}"/><ellipse cx="${lx + w * 0.08 + k}" cy="-8" rx="${w * 0.62}" ry="16" fill="${col}"/>`;
    const step = Math.sin(t * 1.6) * 6 * (1 - nd * 0.5);
    g += leg(-160, -170, 92, '#0b0c10', -step) + leg(150, -170, 84, '#0b0c10', step);
    g += `<path d="M-280 -160 C-302 -250 -230 -304 -130 -302 C-60 -302 0 ${-318 + br} 80 ${-326 + br} C170 ${-332 + br} 244 -292 266 -222 C280 -170 252 -126 196 -116 Q60 -86 -120 -96 Q-230 -98 -262 -118 C-280 -128 -284 -140 -280 -160 Z" fill="${FUR}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-268 -186 Q-292 -208 -282 -222 Q-262 -214 -258 -196 Z" fill="${FUR2}"/>`;   // the short tail
    for (let i = 0; i < 9; i++) { const fx = -220 + i * 52, fy = -250 + Math.abs(i - 4) * 10; g += `<path d="M${fx} ${fy} q14 18 4 40" stroke="${FUR2}" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/>`; }
    if (rim > 0) g += `<path d="M-276 -180 C-292 -256 -226 -300 -130 -300 C-60 -300 0 ${-316 + br} 80 ${-324 + br} C168 ${-330 + br} 238 -292 258 -232" stroke="${RIM}" stroke-width="7" fill="none" opacity="${f1(0.55 * rim)}" stroke-linecap="round"/>`;
    g += `<ellipse cx="-180" cy="-170" rx="96" ry="96" fill="${FUR}"/><ellipse cx="190" cy="-176" rx="80" ry="92" fill="${FUR}"/>`;   // haunch and shoulder
    g += `<path d="M-250 -200 Q-240 -110 -150 -96 M240 -210 Q250 -130 200 -110" stroke="${FUR2}" stroke-width="6" fill="none" opacity="0.9"/>`;
    g += leg(-120, -160, 104, FUR, step) + leg(210, -160, 94, FUR, -step);
    g += `<path d="M-148 -8 l-14 6 M-120 -6 l-6 8 M226 -6 l14 6 M200 -4 l6 8" stroke="#3a3a40" stroke-width="4"/>`;   // claws, blunt
    // the head: hinged at the shoulder front; lowered by nd (and sniffing)
    const ang = lerp(-6, 38, nd) + sn * 0.4;
    g += `<g transform="translate(236 -236) rotate(${f1(ang)})">`;
    g += `<path d="M-60 -40 Q-20 -76 40 -66 Q96 -56 118 -20 L160 -6 Q182 6 176 26 Q166 44 140 44 L60 52 Q-10 58 -50 30 Z" fill="${FUR}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M110 -18 L160 -6 Q182 6 176 26 Q166 44 140 44 L96 46 Q88 12 110 -18 Z" fill="#7a5a3e"/>`;   // the tan muzzle
    g += `<ellipse cx="174" cy="10" rx="14" ry="11" fill="#08090b"/><path d="M128 40 Q146 34 160 38" stroke="#2a1e14" stroke-width="3" fill="none"/>`;
    g += `<circle cx="-10" cy="-66" r="24" fill="${FUR}" stroke="${INK}" stroke-width="5"/><circle cx="-10" cy="-66" r="10" fill="#3a3036"/><circle cx="30" cy="-74" r="20" fill="${FUR}" stroke="${INK}" stroke-width="4"/>`;
    g += `<ellipse cx="78" cy="-22" rx="7" ry="6" fill="#0a0a0c"/><circle cx="80" cy="-24" r="2.4" fill="${MOON}" opacity="0.9"/>`;
    if (rim > 0) g += `<path d="M-40 -56 Q0 -80 46 -68 Q96 -58 116 -24" stroke="${RIM}" stroke-width="5" fill="none" opacity="${f1(0.5 * rim)}" stroke-linecap="round"/>`;
    g += `</g></g>`;
    return g;
  }

  // a plain wrapped packet (no markings): cream wrap with a tape band; centre (x, y)
  const packet = (x, y, s = 1, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><rect x="-34" y="-20" width="68" height="40" rx="6" fill="#ddd4bf" stroke="${INK}" stroke-width="3"/><rect x="-6" y="-21" width="12" height="42" fill="#b9ad92"/><path d="M-30 -14 L28 -14" stroke="#fff" stroke-width="3" opacity="0.5"/></g>`;
  // a torn (empty) packet: the wrap split and flattened
  const torn = (x, y, s = 1, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><path d="M-36 4 L-22 -16 L-6 -6 L8 -18 L34 -4 L30 10 L-30 12 Z" fill="#cfc6b0" stroke="${INK}" stroke-width="3"/><path d="M-20 -2 L20 -4" stroke="#b0a68e" stroke-width="3"/></g>`;
  // the HERO OBJECT: a duffel bag lying on its side (accent colour), ground at (x, y), ~320 wide at s = 1. o.torn 0..1 =
  // ripped open along the top with packets showing; o.spill = packets scattered around it
  function duffel(x, y, s, t, o = {}) {
    const tr = clamp(o.torn || 0, 0, 1), gl = o.glow || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="190" ry="20" fill="#000" opacity="0.5"/>`;
    if (gl > 0) g += wash(0, -70, 260, 160, ACC, f1(0.22 * gl));
    g += `<path d="M-160 -10 Q-176 -70 -150 -112 Q-120 -146 -60 -148 L70 -150 Q140 -148 160 -110 Q180 -64 166 -10 Q150 4 120 4 L-130 4 Q-156 2 -160 -10 Z" fill="${ACC}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-150 -40 Q0 -30 160 -42" stroke="${ACCD}" stroke-width="10" fill="none" opacity="0.7"/><ellipse cx="-160" cy="-62" rx="18" ry="52" fill="${ACCD}" stroke="${INK}" stroke-width="5"/><ellipse cx="164" cy="-62" rx="16" ry="50" fill="#c7802c" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-60 -146 Q-40 -196 0 -196 Q40 -196 60 -148" stroke="#2a2a2e" stroke-width="12" fill="none"/>`;   // the strap
    g += `<path d="M-120 -112 Q0 -132 120 -114" stroke="#2a2a2e" stroke-width="6" fill="none" stroke-dasharray="${tr > 0 ? '10 8' : '0'}"/>`;   // the zip
    if (tr > 0) { g += `<path d="M-110 -116 Q-60 ${-150 - 30 * tr} 0 ${-140 - 24 * tr} Q60 ${-150 - 30 * tr} 110 -118 Q60 -100 0 -104 Q-60 -100 -110 -116 Z" fill="#1a1410" stroke="${INK}" stroke-width="5"/>`;
      g += packet(-46, -128 - 16 * tr, 0.9, -12) + packet(20, -134 - 20 * tr, 0.9, 8) + packet(70, -124 - 10 * tr, 0.8, 18);
      g += `<path d="M-110 -116 L-96 -130 L-84 -112 L-70 -134 L-58 -112" stroke="${INK}" stroke-width="4" fill="none"/>`; }
    if (o.spill) { const r = R(5505); for (let i = 0; i < o.spill; i++) { const px = -260 + r() * 520 + (i % 2 ? 60 : -60), py = 8 + r() * 70, rot = (r() - 0.5) * 70;
      g += (i % 3 === 0 ? packet(px, py, 0.8, rot) : torn(px, py, 0.9, rot)); } }
    return g + '</g>';
  }

  // a dark generic light twin in profile facing right (seen against the night sky): no registration, no livery; centre of
  // the fuselage at (x, y), ~600 wide at s = 1. o.door 0..1 opens the side door (a warm cabin glow inside)
  function nightPlane(x, y, s, t, o = {}) {
    const B = o.lit ? '#46505c' : '#1a1f26', E2 = o.lit ? '#2a323c' : '#11151a', dr = o.door || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${sc(s)})">`;
    g += `<path d="M-300 -10 L-340 -110 L-300 -110 L-240 -20 Z" fill="${B}" stroke="${INK}" stroke-width="4"/><path d="M-330 -16 L-220 -12 L-224 4 L-330 2 Z" fill="${E2}"/>`;
    g += `<path d="M-300 -8 Q-100 -40 160 -36 Q260 -32 300 0 Q262 26 160 28 L-260 20 Z" fill="${B}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-80 10 L120 6 L130 20 L-80 24 Z" fill="${E2}"/><path d="M-200 30 L200 26" stroke="${E2}" stroke-width="16" stroke-linecap="round"/>`;
    g += `<path d="M40 -6 L150 -8 Q180 -4 184 8 Q178 18 150 18 L40 18 Z" fill="${E2}" stroke="${INK}" stroke-width="3"/>`;   // the near engine nacelle
    const sp = Math.sin(t * 40) * 0.5 + 0.5; g += `<ellipse cx="190" cy="6" rx="5" ry="${f1(40 + 6 * sp)}" fill="#8a96a4" opacity="0.25"/>`;
    for (let i = 0; i < 4; i++) g += `<rect x="${-120 + i * 54}" y="-30" width="30" height="16" rx="6" fill="#2a3440" opacity="0.8"/>`;
    g += `<path d="M230 -26 Q268 -20 288 -4 L230 -6 Z" fill="#2a3644"/>`;
    g += `<path d="M-300 -10 Q-100 -42 160 -38 Q262 -34 300 0" stroke="${MOON}" stroke-width="3" fill="none" opacity="0.45"/>`;
    if (dr > 0) g += `<rect x="-200" y="-30" width="${f1(46 * dr)}" height="46" fill="#ffcf8a" opacity="0.85"/>` + wash(-180, -8, 60, 50, '#ffcf8a', f1(0.4 * dr));
    return g + '</g>';
  }
  // the same plane crashed nose-down in trees (dark; no fire, a thin smoke wisp); centre at (x, y)
  function wreck(x, y, s, t) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(28) scale(${sc(s)})">` + nightPlane(0, 0, 1, 0, { lit: true }).replace(/^<g[^>]*>/, '<g>') + `<path d="M260 -30 L300 -6 L280 12 L310 24 L270 30 Z" fill="#3a4048" stroke="${INK}" stroke-width="3"/></g>`;
    for (let i = 0; i < 7; i++) { const ph = ((t * 0.25 + i / 7) % 1); g += `<circle cx="${f1(x + 60 + Math.sin(ph * 6 + i) * 30 + ph * 80)}" cy="${f1(y - 40 - ph * 520)}" r="${f1(30 + ph * 90)}" fill="#8a94a0" opacity="${f1(0.22 * (1 - ph))}"/>`; }
    return g;
  }

  // a pine (tiers), base (x, y), height h; o.snow tips
  function pine(x, y, h, col, t = 0, seed = 1, rimCol = null) {
    const sw = Math.sin(t * 0.8 + seed) * h * 0.006, w = h * 0.36;
    let g = `<rect x="${f1(x - h * 0.02)}" y="${f1(y - h * 0.2)}" width="${f1(h * 0.04)}" height="${f1(h * 0.2)}" fill="#0a0806"/>`;
    for (let i = 0; i < 4; i++) { const yb = y - h * 0.12 - i * h * 0.2, yt = yb - h * 0.36, hw = w * (1 - i * 0.22);
      g += `<path d="M${f1(x - hw)} ${f1(yb)} Q${f1(x - hw * 0.3)} ${f1(yb - h * 0.06)} ${f1(x + sw * (i + 1))} ${f1(yt)} Q${f1(x + hw * 0.3)} ${f1(yb - h * 0.06)} ${f1(x + hw)} ${f1(yb)} Z" fill="${col}"/>`;
      if (rimCol) g += `<path d="M${f1(x + sw * (i + 1))} ${f1(yt)} Q${f1(x + hw * 0.3)} ${f1(yb - h * 0.06)} ${f1(x + hw)} ${f1(yb)}" stroke="${rimCol}" stroke-width="${f1(Math.max(1.5, h * 0.006))}" fill="none" opacity="0.45"/>`; }
    return g;
  }
  // a bare winter hardwood: trunk + forking branches; base (x, y), height h
  function bare(x, y, h, col, seed = 1) {
    const r = R(seed); let g = `<path d="M${x - h * 0.03} ${y} L${f1(x - h * 0.012)} ${f1(y - h)} L${f1(x + h * 0.012)} ${f1(y - h)} L${x + h * 0.03} ${y} Z" fill="${col}"/>`;
    for (let i = 0; i < 7; i++) { const by = y - h * (0.35 + i * 0.09), d = i % 2 ? 1 : -1, L = h * (0.32 - i * 0.03) * (0.8 + r() * 0.4);
      g += `<path d="M${x} ${f1(by)} Q${f1(x + d * L * 0.5)} ${f1(by - L * 0.3)} ${f1(x + d * L)} ${f1(by - L * 0.7)}" stroke="${col}" stroke-width="${f1(h * 0.012)}" fill="none" stroke-linecap="round"/>`; }
    return g;
  }
  // bear paw prints in mud, a trail from (x0, y0) to (x1, y1)
  function prints(x0, y0, x1, y1, n, op = 0.7) {
    let g = ''; for (let i = 0; i < n; i++) { const u = i / (n - 1), px = lerp(x0, x1, u) + (i % 2 ? 18 : -18), py = lerp(y0, y1, u), k = 0.6 + 0.4 * u;
      g += `<g transform="translate(${f1(px)} ${f1(py)}) scale(${sc(k)})" opacity="${op}"><ellipse rx="22" ry="14" fill="#2a2018"/>${[-18, -6, 6, 18].map(dx => `<circle cx="${dx}" cy="-20" r="5" fill="#2a2018"/>`).join('')}</g>`; }
    return g;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a moonlit Appalachian forest (night) or the same slope on a grey winter day (o.day): sky, a big moon (night), ridges
    // of pines, a leaf-littered clearing, foreground trunks
    cb55_forest(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), day = !!o.day, r = R(5501);
      const sk = day ? ['#8c98a2', '#c4c8c4'] : ['#070d16', '#1c2c3c'];
      let sky = `<defs><linearGradient id="cbfsk${day ? 'd' : 'n'}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sk[0]}"/><stop offset="1" stop-color="${sk[1]}"/></linearGradient></defs><rect x="-400" y="-400" width="${W + 800}" height="1500" fill="url(#cbfsk${day ? 'd' : 'n'})"/>`;
      if (!day) { for (let i = 0; i < 70; i++) sky += `<circle cx="${f1(-300 + r() * 1700)}" cy="${f1(-200 + r() * 900)}" r="${f1(1.2 + r() * 2)}" fill="#e8eef4" opacity="${f1(0.25 + 0.45 * Math.abs(Math.sin(t * 0.7 + i)))}"/>`;
        const mx = o.moonX ?? 760, my = o.moonY ?? 700; sky += wash(mx, my, 360, 360, '#9fb6cc', 0.22) + `<circle cx="${mx}" cy="${my}" r="118" fill="${MOON}"/><circle cx="${mx - 34}" cy="${my - 20}" r="22" fill="#c8d0da" opacity="0.6"/><circle cx="${mx + 30}" cy="${my + 34}" r="15" fill="#c8d0da" opacity="0.5"/>`; }
      else sky += wash(300, 500, 600, 260, '#e8ece8', 0.35);
      const c1 = day ? '#6e7a78' : '#122230', c2 = day ? '#4e5c56' : '#0d1a24', c3 = day ? '#34403a' : '#08121a';
      let ridge = `<path d="M-400 1000 Q0 860 300 930 Q600 980 900 880 Q1150 820 ${W + 400} 900 L${W + 400} 1100 L-400 1100 Z" fill="${c1}"/>`;
      for (let i = 0; i < 26; i++) ridge += pine(-380 + i * 70 + (i % 3) * 14, 960 - Math.sin(i * 0.7) * 50, 140 + (i % 4) * 30, c1, t, i);
      let mid = `<rect x="-400" y="1040" width="${W + 800}" height="140" fill="${c2}"/>`;
      for (let i = 0; i < 14; i++) mid += pine(-360 + i * 130, 1110 + (i % 2) * 20, 300 + (i % 3) * 70, c2, t, i + 40, day ? null : '#6a8aa6');
      if (day) for (let i = 0; i < 6; i++) mid += bare(-300 + i * 300 + (i % 2) * 90, 1150, 420 + (i % 3) * 80, '#2e3430', 5520 + i);
      // the clearing floor: leaf litter (night: moonlit; day: muddy with patchy frost)
      let floor = `<path d="M-400 1150 Q300 1110 ${W + 400} 1160 L${W + 400} ${H + 400} L-400 ${H + 400} Z" fill="${day ? '#4a4032' : '#1a1a16'}"/>`;
      floor += wash(560, 1300, 620, 160, day ? '#8a7a62' : '#5a6a7a', day ? 0.35 : 0.3);
      for (let i = 0; i < 80; i++) { const lx = -300 + r() * 1700, ly = 1170 + r() * 700; floor += `<ellipse cx="${f1(lx)}" cy="${f1(ly)}" rx="${f1(8 + r() * 10)}" ry="${f1(3 + r() * 4)}" fill="${day ? (i % 3 ? '#6a5236' : '#c8ccc8') : (i % 3 ? '#3a3226' : '#4a5260')}" opacity="0.7" transform="rotate(${f1(r() * 180)} ${f1(lx)} ${f1(ly)})"/>`; }
      // foreground trunks framing the shot (left and right)
      const fg = `<rect x="-120" y="-400" width="110" height="${H + 800}" fill="${day ? '#1e221e' : '#05080b'}"/><rect x="${W + 30}" y="-400" width="140" height="${H + 800}" fill="${day ? '#1e221e' : '#05080b'}"/>` +
        (day ? '' : `<rect x="-14" y="-400" width="5" height="${H + 800}" fill="#6a8aa6" opacity="0.35"/>`);
      return { light: day ? { dir: -1, rim: '#e8ece8', key: '#f2f2ee' } : { dir: 1, rim: '#9fb6cc', key: '#c8d6e6' }, layers: [[0.05, sky], [0.3, ridge], [0.55, mid], [0.85, floor], [1.25, fg]] };
    },

    // a 1970s narcotics squad room at night (generic): wood-panel walls, a venetian-blind window with a streetlight
    // beyond, a corkboard of blank pinned cards, a wall clock, a filing cabinet, a green-shaded desk lamp
    cb55_squad(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#3a2e22"/>`;
      for (let i = 0; i < 22; i++) back += `<rect x="${-300 + i * 80}" y="-300" width="6" height="1560" fill="#2a2018" opacity="0.7"/>`;
      back += `<rect x="560" y="300" width="440" height="520" fill="#0e1622"/>` + wash(860, 420, 120, 120, '#ffcf8a', 0.5) + `<circle cx="860" cy="420" r="16" fill="#ffe2b0"/>`;
      for (let i = 0; i < 18; i++) back += `<rect x="560" y="${306 + i * 29}" width="440" height="15" fill="#b8a684" opacity="0.85"/>`;
      back += `<rect x="560" y="300" width="440" height="520" fill="none" stroke="${INK}" stroke-width="12"/>`;
      // the corkboard with blank cards and string (no real documents)
      back += `<rect x="40" y="340" width="420" height="300" fill="#8a6a44" stroke="${INK}" stroke-width="8"/>` + [[80, 370], [200, 390], [320, 360], [110, 500], [250, 520], [360, 480]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="${90 + (i % 2) * 20}" height="${70 + (i % 3) * 14}" fill="#e6dcc4" transform="rotate(${(i % 3 - 1) * 4} ${x} ${y})"/><circle cx="${x + 40}" cy="${y + 6}" r="6" fill="#a83a2a"/>`).join('') +
        `<path d="M120 376 L240 396 L360 366 M150 506 L290 526" stroke="#a83a2a" stroke-width="3" fill="none"/>`;
      // the wall clock
      const ca = t * 6;
      back += `<circle cx="300" cy="220" r="56" fill="#efe6d2" stroke="${INK}" stroke-width="6"/><path d="M300 220 L300 184 M300 220 L${f1(300 + Math.sin(ca) * 40)} ${f1(220 - Math.cos(ca) * 40)}" stroke="${INK}" stroke-width="5"/>`;
      let mid = `<rect x="-260" y="760" width="200" height="440" fill="#5a5a50" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2].map(i => `<rect x="-240" y="${780 + i * 140}" width="160" height="120" fill="#6a6a60" stroke="${INK}" stroke-width="4"/><rect x="-190" y="${830 + i * 140}" width="60" height="12" fill="#2a2a26"/>`).join('');
      let floor = `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="#2a2420"/><rect x="-300" y="1200" width="${W + 600}" height="8" fill="#1a1612"/>`;
      return { light: { dir: 1, rim: '#ffcf8a', key: '#ffe2b8' }, layers: [[0.1, back], [0.4, mid], [0.9, floor]] };
    },

    // inside a small plane at night (generic): the curved dark fuselage wall with ribs, round windows, a dim red cabin
    // light, and the side door open on the right onto the moonlit hills far below (wind streaks across the gap)
    cb55_cabin(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), r = R(5503);
      // the outside, seen through the door: moonlit hills far below, streaking past right to left (we fly left to right)
      let out = `<defs><linearGradient id="cbcout" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1420"/><stop offset="1" stop-color="#22384a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#cbcout)"/>`;
      for (let i = 0; i < 40; i++) out += `<circle cx="${f1(400 + r() * 900)}" cy="${f1(200 + r() * 500)}" r="${f1(1 + r() * 1.6)}" fill="#e8eef4" opacity="0.6"/>`;
      out += wash(980, 520, 160, 160, '#9fb6cc', 0.25) + `<circle cx="980" cy="520" r="44" fill="${MOON}"/>`;
      for (let k = 0; k < 3; k++) { const yb = 1000 + k * 200, sp = (t * (120 + k * 140)) % 600;
        let p = `M${-300} ${yb + 300}`; for (let x = -300 - sp; x <= W + 700; x += 100) p += ` L${f1(x)} ${f1(yb - 40 * Math.sin(x * 0.008 + k * 2) - 30 * Math.sin(x * 0.021 + k))}`; p += ` L${W + 700} ${yb + 300} Z`;
        out += `<path d="${p}" fill="${['#2c445a', '#203648', '#162838'][k]}"/><path d="${p.replace(/ L[^L]*Z$/, '')}" stroke="#9fb6cc" stroke-width="3" fill="none" opacity="0.35"/>`; }
      for (let i = 0; i < 8; i++) { const yy = 400 + i * 120, ph = (t * 3 + i * 0.37) % 1; out += `<path d="M${f1(1200 - ph * 900)} ${yy} l-160 0" stroke="#c8d6e6" stroke-width="3" opacity="${f1(0.35 * (1 - ph))}"/>`; }
      // the cabin shell with the door gap (even-odd cut-out) on the right
      let shell = `<path fill-rule="evenodd" d="M-400 -400 H${W + 400} V${H + 400} H-400 Z M640 360 Q650 340 670 340 L1040 340 L1040 1600 L660 1600 Q640 1600 640 1580 Z" fill="#161a20"/>`;
      shell += `<path d="M-400 300 Q540 160 ${W + 400} 300" stroke="#20262e" stroke-width="80" fill="none"/>` + [0, 1, 2, 3].map(i => `<path d="M${-200 + i * 220} 300 L${-220 + i * 220} 1600" stroke="#20262e" stroke-width="26"/>`).join('');
      shell += [0, 1].map(i => `<ellipse cx="${80 + i * 260}" cy="560" rx="54" ry="66" fill="#0c141c" stroke="#2a323c" stroke-width="10"/><ellipse cx="${80 + i * 260}" cy="560" rx="40" ry="50" fill="#22384a" opacity="0.5"/>`).join('');
      shell += `<rect x="636" y="336" width="14" height="1270" fill="#2a3038"/><path d="M640 360 L640 1590" stroke="#9fb6cc" stroke-width="4" opacity="0.4"/>`;
      shell += wash(300, 300, 260, 120, '#c84a3a', 0.3) + `<rect x="270" y="270" width="60" height="16" rx="6" fill="#e2604a" opacity="0.8"/>`;
      let floor = `<path d="M-400 1600 L${W + 400} 1600 L${W + 400} ${H + 400} L-400 ${H + 400} Z" fill="#1e2228"/><path d="M-400 1600 L${W + 400} 1600" stroke="#2e343c" stroke-width="10"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${-200 + i * 260} 1610 L${-300 + i * 300} ${H + 200}" stroke="#262a30" stroke-width="5"/>`).join('') + `<path d="M640 1600 L1040 1600" stroke="#9fb6cc" stroke-width="5" opacity="0.5"/>`;
      return { light: { dir: 1, rim: '#9fb6cc', key: '#c8a090' }, layers: [[0.05, out], [0.75, shell], [0.9, floor]] };
    },

    // a suburban street at dawn (generic): a peach sky, single-storey houses with porches, a gravel driveway, a mailbox,
    // power lines, a big oak; long soft shadows
    cb55_street(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="cbssk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#46566c"/><stop offset="0.6" stop-color="#c8a08e"/><stop offset="1" stop-color="#eec49a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="1400" fill="url(#cbssk)"/>` + wash(860, 900, 420, 160, '#ffe2b8', 0.45);
      sky += `<path d="M-300 520 Q300 600 ${W + 300} 500 M-300 560 Q300 650 ${W + 300} 540" stroke="#2a2a30" stroke-width="3" fill="none" opacity="0.7"/>`;
      let far = '';
      for (let i = 0; i < 4; i++) { const x = -260 + i * 420; far += `<g transform="translate(${x} 1000)"><rect x="0" y="-150" width="320" height="150" fill="#5a5250"/><path d="M-20 -150 L160 -230 L340 -150 Z" fill="#3a3436"/><rect x="40" y="-110" width="60" height="50" fill="#e8b46a" opacity="${i % 2 ? 0.7 : 0.2}"/><rect x="200" y="-110" width="60" height="50" fill="#2a2a30"/></g>`; }
      let near = `<g transform="translate(-120 1180)"><rect x="0" y="-360" width="560" height="360" fill="#8a7a68" stroke="${INK}" stroke-width="6"/><path d="M-40 -360 L280 -500 L600 -360 Z" fill="#4a3e3a" stroke="${INK}" stroke-width="6"/>` +
        `<rect x="330" y="-230" width="110" height="230" fill="#5a3a2a" stroke="${INK}" stroke-width="5"/><rect x="60" y="-260" width="160" height="110" fill="#e8c890" opacity="0.75" stroke="${INK}" stroke-width="5"/><path d="M140 -260 L140 -150" stroke="${INK}" stroke-width="4"/>` +
        `<rect x="300" y="-250" width="200" height="16" fill="#6a5a4a"/>${[0, 1, 2].map(i => `<rect x="${310 + i * 80}" y="-236" width="12" height="236" fill="#d8ccb8"/>`).join('')}</g>`;
      near += `<g transform="translate(940 1000)"><rect x="-20" y="-420" width="40" height="420" fill="#2a2018"/><circle cx="-90" cy="-460" r="150" fill="#3a4630"/><circle cx="80" cy="-500" r="170" fill="#34402c"/><circle cx="0" cy="-600" r="140" fill="#3e4a34"/></g>`;
      let ground = `<rect x="-300" y="1180" width="${W + 600}" height="${H}" fill="#5a6a44"/><path d="M420 1180 L${W + 300} 1180 L${W + 300} ${H} L700 ${H} Z" fill="#a89a84"/>`;
      const r = R(5504); for (let i = 0; i < 60; i++) ground += `<circle cx="${f1(560 + r() * 800)}" cy="${f1(1200 + r() * 700)}" r="${f1(2 + r() * 4)}" fill="#8a7e6a" opacity="0.8"/>`;
      ground += `<g transform="translate(470 1260)"><rect x="-6" y="0" width="12" height="120" fill="#4a3a2a"/><rect x="-46" y="-36" width="92" height="44" rx="20" fill="#3a4a5a" stroke="${INK}" stroke-width="4"/></g>`;
      ground += `<path d="M-300 1640 L${W + 300} 1640 L${W + 300} ${H + 300} L-300 ${H + 300} Z" fill="#3a3a3c"/>`;
      return { light: { dir: 1, rim: '#ffd8a8', key: '#ffe8cc' }, layers: [[0.05, sky], [0.35, far], [0.8, near], [0.9, ground]] };
    },

    // a mountainside at night (generic): layered ridges under a hazy moon, steep pine slopes, a clearing among the trees
    cb55_ridge(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), r = R(5506);
      let sky = `<defs><linearGradient id="cbrsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060b12"/><stop offset="1" stop-color="#1a2836"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="1500" fill="url(#cbrsk)"/>`;
      for (let i = 0; i < 50; i++) sky += `<circle cx="${f1(-300 + r() * 1700)}" cy="${f1(-200 + r() * 800)}" r="${f1(1 + r() * 1.8)}" fill="#e8eef4" opacity="0.5"/>`;
      sky += wash(200, 420, 240, 240, '#9fb6cc', 0.18) + `<circle cx="200" cy="420" r="62" fill="${MOON}" opacity="0.85"/>`;
      let ridges = '';
      [['#142230', 820], ['#0f1c28', 920], ['#0b1620', 1020]].forEach(([c, yb], k) => { ridges += `<path d="M-300 ${yb} L${-100 + k * 60} ${yb - 180} L${260 + k * 40} ${yb - 60} L${520 - k * 30} ${yb - 240} L${820 + k * 20} ${yb - 90} L${W + 300} ${yb - 200} L${W + 300} ${yb + 200} L-300 ${yb + 200} Z" fill="${c}"/>`;
        for (let i = 0; i < 18; i++) ridges += pine(-280 + i * 90, yb + 10 - (i % 3) * 16, 90 + k * 50, c, t, i + k * 30); });
      let slope = `<path d="M-300 1120 Q500 1060 ${W + 300} 1180 L${W + 300} ${H + 300} L-300 ${H + 300} Z" fill="#0a1218"/>`;
      for (let i = 0; i < 9; i++) slope += pine(-260 + i * 170, 1200 + (i % 2) * 40, 380 + (i % 3) * 60, '#071017', t, i + 70, '#6a8aa6');
      slope += `<path d="M-300 1360 Q500 1300 ${W + 300} 1380 L${W + 300} ${H + 300} L-300 ${H + 300} Z" fill="#141c18"/>`;
      return { light: { dir: -1, rim: '#9fb6cc', key: '#c8d6e6' }, layers: [[0.05, sky], [0.3, ridges], [0.8, slope]] };
    }
  });

  // the hero framing in the first and last shots (the loop): the bear at left-centre facing right, its nose in the torn
  // duffel at right-centre, both under the moon
  const HERO = { bx: 400, by: 1330, bs: 0.92, dx: 760, dy: 1350, ds: 0.95 };
  const heroBag = (tt, glow) => duffel(HERO.dx, HERO.dy, HERO.ds, tt, { torn: 1, spill: 9, glow });
  const heroBear = (tt, nose) => bear(HERO.bx, HERO.by, HERO.bs, tt, { nose });

  E.registerScenes({
    // 1 - hook (frame 1): the bear nosing the torn duffel; the plane crosses the moon left to right with a tiny silhouette
    //     in its lit door, a bag dropping away; the camera already pushing. The headline sits at the top until ~3 s.
    cb55_hook(ctx) {
      const t = ctx.t, T = ctx.T, fd = WT(ctx, 1, 2, 2.6), pk = WT(ctx, 1, 4, 3.4);
      const px = tt => lerp(260, 1240, seg(tt, 0, 5.5)), py = tt => 740 - 30 * seg(tt, 0, 5.5);
      return E.cine.shot(ctx, {
        set: 'cb55_forest', setOpts: { moonX: 700, moonY: 720 }, grade: 'night', dof: false, haze: 0.4,
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 30, y: 70, z: 1.12 }, settle: true },
        figures: [
          { id: 'cb55_thornton', x: px(t) - 105, y: py(t) + 18, scale: 0.05, dir: -1, turn: 0.2, pose: 'present', silhouette: 'warm', depth: 0.3,
            keys: [{ at: 0.4, pose: 'examine', dur: 0.4 }, { at: 1.0, pose: 'present', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.3, svg: tt => nightPlane(px(tt), py(tt), 0.42, tt, { door: 1 }) },
          { depth: 0.31, svg: tt => { const k = seg(tt, 0.5, 3.5); if (k <= 0 || k >= 1) return ''; const bx = lerp(px(0.5) - 70, px(0.5) + 120, k), by = py(0.5) + 20 + 520 * k * k; return `<g opacity="${f1(1 - seg(k, 0.8, 1))}">${duffel(bx, by, 0.12, tt, {})}</g>`; } },
          { depth: 1.0, accent: true, svg: tt => heroBag(tt, 0.6 + 0.3 * Math.sin(tt * 2.4)) },
          { depth: 1.01, svg: tt => heroBear(tt, 0.85 + 0.15 * Math.sin(tt * 3.1) - 0.5 * seg(tt, fd - 0.1, fd + 0.3) * (1 - seg(tt, fd + 0.9, fd + 1.4))) }
        ],
        overlays: [
          { type: 'label', at: Math.max(pk + 0.2, 3.15), x: 60, y: 820, text: 'CHATTAHOOCHEE NATIONAL FOREST', fs: 36, sub: 'North Georgia, 1985' }
        ],
        tag: 'ILLUSTRATION · NOT A LIKENESS'
      });
    },

    // 2 - who: a 1970s squad room at night; his silhouette at a desk (left) going through files; the partner (right) at
    //     his own desk; on 'switched' he stands, grabs his jacket and walks out of frame to the right
    cb55_cop(ctx) {
      const t = ctx.t, T = ctx.T, ch = WT(ctx, 0, 3, 0.6), l2 = LS(ctx, 1, 2.0), sw = WT(ctx, 1, 2, 2.4);
      const desk = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-260" y="-150" width="520" height="40" fill="#5a4030" stroke="${INK}" stroke-width="6"/><rect x="-250" y="-110" width="160" height="230" fill="#4a3426" stroke="${INK}" stroke-width="5"/><rect x="90" y="-110" width="160" height="230" fill="#4a3426" stroke="${INK}" stroke-width="5"/>` +
        `<rect x="-200" y="-196" width="150" height="46" fill="#e6dcc4" stroke="${INK}" stroke-width="3"/><rect x="-190" y="-212" width="140" height="18" fill="#c8b48e" stroke="${INK}" stroke-width="3"/><path d="M150 -150 L150 -250 L120 -290" stroke="#2a2a26" stroke-width="8" fill="none"/><path d="M80 -300 L170 -300 L150 -260 L100 -260 Z" fill="#3a6a4a" stroke="${INK}" stroke-width="4"/></g>`;
      return E.cine.shot(ctx, {
        set: 'cb55_squad', grade: 'warm', dof: true, haze: 0.5,
        cam: { from: { x: -20, y: 30, z: 1.02 }, to: { x: 20, y: 40, z: 1.09 } },
        figures: [
          { id: 'cb55_thornton', x: 300, y: 1560, scale: 0.88, dir: 1, turn: 0.35, pose: 'sit_read', silhouette: 'warm', depth: 1.0,
            keys: [{ at: ch, pose: 'sit_type', dur: 0.5 }, { at: l2 - 0.15, pose: 'stand', dur: 0.5 }],
            walk: { at: sw, dur: 1.6, cadence: 4.6, stride: 16, from: 300, to: 1240 } },
          { id: 'cb55_partner', x: 820, y: 1470, scale: 0.7, dir: -1, turn: 0.4, pose: 'sit_type', expr: 'focused', depth: 0.94,
            keys: [{ at: sw + 0.2, pose: 'sit', expr: 'shocked', gaze: [-0.8, 0], dur: 0.5 }] }
        ],
        props: [
          { depth: 0.93, svg: desk(820, 1470, 0.7) },
          { depth: 1.02, svg: tt => desk(330, 1600, 0.95) }
        ],
        overlays: [
          { type: 'label', at: 0.15, until: sw - 0.5, x: 60, y: 440, text: 'LEXINGTON, KENTUCKY · NARCOTICS', fs: 38, sub: 'Andrew C. Thornton II · police officer 1968–77' },
          { type: 'label', at: sw, x: 60, y: 440, text: 'LATER EARNED A LAW DEGREE', fs: 38, sub: "Linked to a smuggling ring, 'The Company'" }
        ],
        tag: LIKE
      });
    },

    // 3 - the drop: inside the plane at night; the door open on the right; his silhouette shoves a duffel bag out (it slides
    //     right and is gone); a second bag waits; on 'jumped' he steps to the door; the FUN FACT pops
    cb55_drop(ctx) {
      const t = ctx.t, T = ctx.T, dm = WT(ctx, 0, 3, 0.9), jp = WT(ctx, 1, 2, 2.6);
      const bagX = tt => lerp(430, 900, ease.in(seg(tt, dm - 0.4, dm + 0.5)));
      return E.cine.shot(ctx, {
        set: 'cb55_cabin', grade: 'night', haze: 0.3,
        cam: { from: { x: -10, y: 30, z: 1.0 }, to: { x: 20, y: 40, z: 1.07 } },
        figures: [
          { id: 'cb55_thornton', x: 300, y: 1640, scale: 0.92, dir: 1, turn: 0.3, pose: 'examine', silhouette: 'cool', depth: 1.0,
            keys: [{ at: dm - 0.4, pose: 'present', dur: 0.35 }, { at: dm + 0.6, pose: 'stand', dur: 0.5 }, { at: jp - 0.3, pose: 'stand_tense', dur: 0.4 }],
            walk: { at: jp - 0.2, dur: 1.0, cadence: 4.0, stride: 12, from: 300, to: 520 } }
        ],
        props: [
          { depth: 0.98, accent: true, svg: tt => { const x = bagX(tt), gone = seg(tt, dm + 0.35, dm + 0.6); return `<g opacity="${f1(1 - gone)}">${duffel(x, 1600 + 260 * gone * gone, 0.62, tt, {})}</g>`; } },
          { depth: 1.04, accent: true, svg: duffel(190, 1720, 0.7, 0, {}) }
        ],
        overlays: [
          { type: 'label', at: 0.15, until: jp - 0.6, x: 60, y: 440, text: 'SEPTEMBER 1985 · OVER GEORGIA', fs: 38, sub: 'Duffel bags pushed out of the plane' },
          { type: 'funfact', at: jp - 0.1, y: 430, rows: [{ text: 'HE WAS A FORMER' }, { text: 'PARATROOPER', fs: 52 }] }
        ],
        tag: LIKE
      });
    },

    // 4 - the landing (the statistic): a quiet street at dawn; an older resident steps off his porch with a mug, then stops
    //     dead on the drive, staring down-right at something we never see; the counter 79 LB
    cb55_jump(ctx) {
      const t = ctx.t, T = ctx.T, fl = WT(ctx, 0, 2, 0.8), l2 = LS(ctx, 1, 1.6), n79 = WT(ctx, 1, 4, 2.6);
      return E.cine.shot(ctx, {
        set: 'cb55_street', grade: 'dawn', haze: 0.6, dof: true,
        cam: { from: { x: -10, y: 30, z: 1.0 }, to: { x: 30, y: 40, z: 1.07 } },
        figures: [
          { id: 'cb55_resident', x: 330, y: 1500, scale: 0.72, dir: 1, turn: 0.4, pose: 'walk', expr: 'neutral', depth: 1.0,
            walk: { at: 0.05, dur: Math.max(0.6, fl - 0.1), cadence: 3.6, stride: 12, from: 330, to: 520 },
            keys: [{ at: fl, pose: 'stand_tense', expr: 'shocked', gaze: [0.7, 0.5], dur: 0.35 }, { at: n79 + 0.3, pose: 'hand_to_face', expr: 'shocked', gaze: [0.7, 0.5], dur: 0.5 }] }
        ],
        props: [
          { depth: 1.01, svg: tt => { const dropT = seg(tt, fl, fl + 0.3), mx = 600 + 40 * dropT, my = lerp(1190, 1500, ease.in(dropT)); return `<g transform="translate(${f1(mx)} ${f1(my)}) rotate(${f1(70 * dropT)})"><path d="M-22 -30 L22 -30 L18 20 Q0 28 -18 20 Z" fill="#e8e0d0" stroke="${INK}" stroke-width="4"/></g>`; } }
        ],
        overlays: [
          { type: 'label', at: 0.15, until: l2 - 0.1, x: 60, y: 440, text: 'KNOXVILLE, TENNESSEE · 11 SEPT 1985', fs: 36, sub: 'Found dead that morning by a resident' },
          { type: 'counter', at: n79 - 0.15, dur: 1.1, from: 0, to: 79, suffix: ' LB', label: 'OF COCAINE STRAPPED ON', y: 620, fs: 150 },
          { type: 'label', at: n79 + 0.5, x: 120, y: 780, text: 'ALSO: NIGHT-VISION GOGGLES', fs: 32, sub: 'New York Times / AP, September 1985' }
        ],
        tag: TAG
      });
    },

    // 5 - THE BIGGEST REVEAL: the forest by day in winter; two state investigators walk in from the left and find the
    //     torn duffel and the ripped packets beside a trail of bear prints in the mud (the bear itself is never shown); on
    //     'packed' the single impact + shake and the examiner card
    cb55_bear(ctx) {
      const t = ctx.t, T = ctx.T, ag = WT(ctx, 0, 3, 0.8), dd = WT(ctx, 0, 6, 1.6), l2 = LS(ctx, 1, 2.4), pk = WT(ctx, 1, 3, 3.2);
      return E.cine.shot(ctx, {
        set: 'cb55_forest', setOpts: { day: true }, grade: 'cold', haze: 0.6, dof: true,
        cam: { from: { x: -20, y: 40, z: 1.02 }, to: { x: 20, y: 60, z: 1.1 } },
        shake: [{ at: pk, amp: 3 }],
        rack: { at: dd - 0.2, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'cb55_agent1', x: 180, y: 1520, scale: 0.7, dir: 1, turn: 0.4, pose: 'walk', expr: 'focused', depth: 1.0,
            walk: { at: 0.05, dur: Math.max(0.8, ag + 0.4), cadence: 4.2, stride: 14, from: 60, to: 250 },
            keys: [{ at: dd, pose: 'point', expr: 'realise', gaze: [0.6, 0.4], dur: 0.4 }, { at: pk, pose: 'hand_to_face', expr: 'shocked', dur: 0.4 }] },
          { id: 'cb55_agent2', x: 520, y: 1560, scale: 0.74, dir: 1, turn: 0.35, pose: 'walk', expr: 'neutral', depth: 1.02,
            walk: { at: 0.2, dur: Math.max(0.8, ag + 0.2), cadence: 4.0, stride: 14, from: 380, to: 520 },
            keys: [{ at: dd + 0.2, pose: 'kneel', expr: 'focused', gaze: [0.6, 0.6], dur: 0.6 }, { at: pk + 0.1, pose: 'kneel', expr: 'shocked', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.9, svg: prints(-80, 1300, 640, 1450, 9, 0.75) },
          { depth: 1.0, accent: true, svg: tt => duffel(800, 1460, 0.82, tt, { torn: 1, spill: 12, glow: 0.4 * seg(tt, dd - 0.2, dd + 0.4) }) }
        ],
        overlays: [
          { type: 'label', at: 0.15, until: l2 - 0.1, x: 60, y: 440, text: 'DECEMBER 1985 · FANNIN COUNTY, GA', fs: 36, sub: 'Georgia Bureau of Investigation agents' },
          { type: 'impact', at: pk, x: 540, y: 860 },
          { type: 'label', at: pk + 0.1, x: 60, y: 440, text: 'THE STATE MEDICAL EXAMINER', fs: 38, sub: "Stomach 'packed to the brim', 1985" }
        ],
        tag: TAG
      });
    },

    // 6 - the afterthought: a mountainside at night; the empty plane nose-down in the pines, a thin smoke wisp; a deputy
    //     walks in from the left with a torch and stops, beam on the wreck
    cb55_plane(ctx) {
      const t = ctx.t, T = ctx.T, l2 = WT(ctx, 0, 4, 1.4), cr = WT(ctx, 0, 5, 1.7);
      return E.cine.shot(ctx, {
        set: 'cb55_ridge', grade: 'night', haze: 0.5,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 30, y: 50, z: 1.07 } },
        figures: [
          { id: 'cb55_deputy', x: 240, y: 1600, scale: 0.78, dir: 1, turn: 0.4, pose: 'torch', expr: 'focused', depth: 1.0,
            walk: { at: 0.05, dur: Math.max(0.8, cr - 0.2), cadence: 4.0, stride: 12, from: 80, to: 300 },
            keys: [{ at: cr, pose: 'torch_low', expr: 'shocked', gaze: [0.7, -0.1], dur: 0.4 }] }
        ],
        props: [
          { depth: 0.82, svg: tt => wash(720, 1250, 330, 150, '#9fb6cc', 0.18) + wreck(700, 1230, 0.85, tt) },
          { depth: 0.99, svg: tt => { const k = seg(tt, cr - 0.3, cr + 0.2); return k > 0 ? `<path d="M380 1350 L700 1180 L760 1330 Z" fill="#fff4cc" opacity="${f1(0.14 * k)}"/>` + wash(720, 1260, 110, 70, '#fff4cc', f1(0.3 * k)) : ''; } }
        ],
        overlays: [
          { type: 'label', at: l2, x: 60, y: 440, text: 'HAYESVILLE, NORTH CAROLINA', fs: 38, sub: 'Over 60 miles from Knoxville' }
        ],
        tag: TAG
      });
    },

    // 7 - the LESSON (save trigger, for the viewer): a woodland trail at dusk; a young hiker spots a bag in the leaves,
    //     steps back with his hands up, then makes a call; the checklist card with the SAVE ribbon (captions off)
    cb55_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 5, 1.4);
      return E.cine.shot(ctx, {
        set: 'cabin_woods', setOpts: { cabinX: 1300 }, grade: 'cold', haze: 0.6, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.06 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'cb55_hiker', x: 420, y: 1640, scale: 0.86, dir: 1, turn: 0.4, pose: 'walk', expr: 'neutral', depth: 1.0,
            walk: { at: 0.05, dur: 0.6, cadence: 3.8, stride: 10, from: 360, to: 420 },
            keys: [{ at: 0.7, pose: 'stand_tense', expr: 'worried', gaze: [0.6, 0.6], dur: 0.4 }, { at: sv - 0.1, pose: 'hand_to_face', expr: 'focused', gaze: [0.6, 0.3], dur: 0.5 }] }
        ],
        props: [{ depth: 1.03, accent: true, svg: tt => duffel(800, 1600, 0.6, tt, {}) }],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 430, rows: [{ text: "DON'T TOUCH OR OPEN IT", fs: 42 }, { text: 'PICKING IT UP = POSSESSION', fs: 42 }, { text: 'NOTE THE SPOT, CALL POLICE', fs: 42 }, { text: "Sheriff's offices: Matagorda Co. TX · Indian River Co. FL", fs: 24, colour: '#c9bc9e' }] }
        ],
        tag: TAG
      });
    },

    // 8 - the outcome on the hero framing (the loop): the bear at the torn duffel under the moon; it lifts its head on
    //     'Lexington' and looks towards us; the stuffed-bear card sits between the end question and the captions
    cb55_end(ctx) {
      const t = ctx.t, T = ctx.T, lx = WT(ctx, 0, 6, 2.0);
      return E.cine.shot(ctx, {
        set: 'cb55_forest', setOpts: { moonX: 700, moonY: 720 }, grade: 'night', haze: 0.4,
        cam: { from: { x: 10, y: 50, z: 1.03 }, to: { x: 30, y: 70, z: 1.12 }, settle: true },
        props: [
          { depth: 1.0, accent: true, svg: tt => heroBag(tt, 0.75 + 0.25 * Math.sin(tt * 2.4)) },
          { depth: 1.01, svg: tt => heroBear(tt, 0.9 - 0.6 * seg(tt, lx - 0.2, lx + 0.6)) }
        ],
        overlays: [
          { type: 'card', at: 0.1, x: 60, y: 740, w: 960, rows: [{ text: "STUFFED BEAR NICKNAMED 'PABLO ESKOBEAR'", fs: 30 }, { text: "INSPIRED THE 2023 FILM 'COCAINE BEAR'", fs: 30 }] }
        ],
        tag: 'ILLUSTRATION · GENERIC BEAR'
      });
    }
  });
})();
