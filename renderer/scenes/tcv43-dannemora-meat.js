/* Case File 43 (premium look, engagement rules): the June 2015 Dannemora escape and the hacksaw blades in frozen meat.
   Structure: a burned-in object-first headline over the HERO OBJECT (a pack of frozen hamburger meat on a steel tailor-shop
   table with two hacksaw blades pushed into it: big and centred in the first frame and again in the last, so the reel
   loops); the map fly-in (the USA draws itself in, a pin on Dannemora, NY); the tailor shop (Mitchell's silhouette at the
   fridge; impact on 'blades'); the guard at the cell bars (Palmer's silhouette); the LESSON checklist with its save ribbon
   (captions off); the steam tunnel (sparks, steam; the fun-fact note); the manhole, DAY 1 (the driver never came: impact);
   the night-woods manhunt, DAY 7 (handheld); DAY 21 (Matt: a card); DAY 23 (Sweat caught: impact, cuffs); the outcome
   on the hero object with the burned-in opinion question.
   Look: episode.look = 'premium' with one cold palette (shadow #0e1f2e, mid #b9c3c8, accent #e2a13b). The ONLY strongly
   coloured object is the pair of hacksaw blades (prop marked accent: true).
   Content rules:
   - No murder, no shooting, no injury, no weapon, no blood is ever drawn. Matt's death and Sweat's shooting are a line and
     a typed card only. Sweat's capture is a silhouette with hands behind its back.
   - Matt, Sweat, Mitchell and Palmer appear ONLY as faceless silhouettes (silhouette 'cool'/'warm', NOT A LIKENESS).
   - Officers are generic figures with no insignia. Places are generic illustrations, not replicas of the real prison.
   New environments (E.registerSets): dm43_tailor (a prison tailor shop: painted block wall, a barred window with light
   shafts, shelves of folded cloth, sewing machines, an upright fridge, a long steel table), dm43_block (a cell-block
   gallery at night: a run of barred cell fronts, a walkway, caged lights), dm43_tunnel (the steam tunnel: brick, big
   lagged pipes, valves, a caged bulb; steam from the 'smoke' atmosphere), dm43_street (a village street at night outside a
   high wall: a street lamp, dark houses, an open manhole), dm43_woods (dense night woods with ground fog), dm43_road (a
   rural road at dusk between fields and a tree line). Plus the engine's mapflight and cabin_woods. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#12171a';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#e2a13b', MID = '#b9c3c8', MUTE = '#7d868c';

  // ---------- THE HERO: a pack of frozen hamburger meat seen from above on a steel table, centre (x, y), ~780 x 460 at
  // s = 1: a pale foam tray, the meat block under clear film with frost, a blank price sticker, and TWO HACKSAW BLADES (the
  // ACCENT object) pushed into the meat at a slant. o.reveal 0..1 slides the blades out of the meat (0 = only their ends
  // show at the edge; 1 = both lie on top, fully visible); o.glow 0..1 = a warm wash on the blades.
  function blade(x, y, ang, len, col, op, over) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})" opacity="${f1(op)}">`;
    g += `<rect x="${f1(-len / 2)}" y="-13" width="${f1(len)}" height="26" rx="4" fill="${col}" stroke="${INK}" stroke-width="4"/>`;
    for (let i = 0; i < Math.floor(len / 22); i++) { const tx = -len / 2 + 12 + i * 22; g += `<path d="M${f1(tx)} 13 L${f1(tx + 11)} 22 L${f1(tx + 22)} 13 Z" fill="${col}" stroke="${INK}" stroke-width="2"/>`; }
    g += `<circle cx="${f1(-len / 2 + 18)}" cy="0" r="6" fill="${INK}"/><circle cx="${f1(len / 2 - 18)}" cy="0" r="6" fill="${INK}"/>`;
    if (over) g += `<path d="M${f1(-len / 2 + 30)} -6 L${f1(len / 2 - 30)} -6" stroke="#fff6dc" stroke-width="3" opacity="0.5"/>`;
    return g + '</g>';
  }
  function meatPack(x, y, s, t, o = {}) {
    const rv = clamp(o.reveal ?? 0.5, 0, 1), gl = o.glow ?? 0.8, r = R(4301);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="40" rx="430" ry="150" fill="#000" opacity="0.4" filter="url(#cineSoft)"/>`;
    // the tray
    g += `<rect x="-390" y="-230" width="780" height="460" rx="38" fill="#d9d6cc" stroke="${INK}" stroke-width="6"/><rect x="-360" y="-200" width="720" height="400" rx="30" fill="#c9c6bc" stroke="#b4b1a6" stroke-width="3"/>`;
    // the blades 'under' the meat: only the ends beyond the meat's edge show; they slide out with reveal
    const bl = [[-16, 40, -11], [36, 110, -7]];
    bl.forEach(([bx, by, ang]) => g += blade(bx + 150 * rv, by, ang, 620, ACC, 1, false));
    // the meat block: a muted pink-grey block, marbling, frost specks, the film sheen
    g += `<rect x="-330" y="-172" width="660" height="344" rx="26" fill="#9b7f7a" stroke="${INK}" stroke-width="5"/>`;
    for (let i = 0; i < 26; i++) { const mx = -300 + r() * 600, my = -150 + r() * 300; g += `<ellipse cx="${f1(mx)}" cy="${f1(my)}" rx="${f1(14 + r() * 30)}" ry="${f1(6 + r() * 14)}" fill="${i % 3 ? '#8a6c68' : '#b3a09a'}" opacity="0.55"/>`; }
    for (let i = 0; i < 70; i++) g += `<circle cx="${f1(-320 + r() * 640)}" cy="${f1(-160 + r() * 320)}" r="${f1(1.5 + r() * 3)}" fill="#f2f6f8" opacity="${f1(0.35 + r() * 0.5)}"/>`;
    g += `<path d="M-330 -120 Q-100 -200 330 -150 L330 -90 Q-60 -130 -330 -40 Z" fill="#ffffff" opacity="0.14"/><path d="M-330 90 Q0 130 330 70 L330 120 Q0 180 -330 150 Z" fill="#ffffff" opacity="0.08"/>`;
    // the blades over the meat (the part that is out), fading in with reveal
    bl.forEach(([bx, by, ang]) => g += blade(bx + 150 * rv, by, ang, 620, ACC, rv, true));
    if (gl > 0) g += wash(60 + 150 * rv, 70, 380, 120, ACC, f1(0.22 * gl * (0.35 + 0.65 * rv)));
    // a blank price sticker (no lettering), a corner of film lifting
    g += `<g transform="rotate(-6 250 -190)"><rect x="190" y="-222" width="150" height="70" rx="6" fill="#f0ece2" stroke="${INK}" stroke-width="3"/>` + [0, 1, 2].map(i => `<rect x="204" y="${-206 + i * 18}" width="${110 - i * 30}" height="7" fill="#9a948a"/>`).join('') + `</g>`;
    g += `<path d="M-390 170 Q-350 120 -300 230" stroke="#ffffff" stroke-width="4" fill="none" opacity="0.35"/>`;
    return g + '</g>';
  }
  // an upright fridge (generic): a tall pale box with a handle; o.open 0..1 swings the door and shows lit shelves
  function fridge(x, y, s, t, o = {}) {
    const op = clamp(o.open || 0, 0, 1);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-130" y="-640" width="260" height="640" rx="14" fill="#cfd3d2" stroke="${INK}" stroke-width="6"/>`;
    if (op > 0) { g += `<rect x="-118" y="-628" width="236" height="616" fill="#eef2f3"/>` + [0, 1, 2, 3].map(i => `<rect x="-112" y="${-560 + i * 150}" width="224" height="8" fill="#a8adb0"/><rect x="${-90 + (i % 2) * 40}" y="${-600 + i * 150}" width="${70 + (i % 3) * 30}" height="34" rx="6" fill="${i === 1 ? '#c9c6bc' : '#b9c3c8'}" opacity="0.9"/>`).join('') + wash(0, -320, 260, 400, '#eef6ff', 0.22 * op);
      g += `<g transform="translate(-130 0) skewY(${f1(-6 * op)}) scale(${f1(1 - 0.78 * op)} 1)"><rect x="0" y="-640" width="260" height="640" rx="14" fill="#d7dbda" stroke="${INK}" stroke-width="6"/><rect x="214" y="-470" width="16" height="200" rx="8" fill="#8d9598"/></g>`; }
    else g += `<rect x="-128" y="-440" width="256" height="4" fill="#a8adb0"/><rect x="92" y="-470" width="16" height="200" rx="8" fill="#8d9598"/>`;
    return g + '</g>';
  }
  // a generic sewing machine in silhouette, bottom centre (x, y)
  const sewing = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-120" y="-20" width="240" height="20" rx="6" fill="#2b3338" stroke="${INK}" stroke-width="3"/><path d="M-80 -20 L-80 -150 Q-80 -175 -55 -175 L70 -175 Q95 -175 95 -150 L95 -120 L60 -120 L60 -20 Z" fill="#3a444a" stroke="${INK}" stroke-width="4"/><rect x="-100" y="-230" width="16" height="60" fill="#3a444a"/><circle cx="-92" cy="-236" r="10" fill="#6c767c"/></g>`;
  // a street lamp with a soft pool of light; (x, y) at the base
  const lamp = (x, y, h, t, col = '#f6e6c4') => `<rect x="${x - 7}" y="${y - h}" width="14" height="${h}" fill="#1c2226"/><rect x="${x - 40}" y="${y - h - 24}" width="80" height="26" rx="8" fill="#232a2e" stroke="${INK}" stroke-width="3"/><ellipse cx="${x}" cy="${y - h}" rx="30" ry="10" fill="${col}" opacity="${f1(0.8 + 0.1 * Math.sin(t * 7))}"/>` + wash(x, y - h + 60, 240, 160, col, 0.2) + wash(x, y, 340, 120, col, 0.14);

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // the prison tailor shop: a painted block wall, a barred window top-left, shelves of folded cloth, two sewing machines on
    // a side bench, the fridge at the right, a long steel table in front. o.open = the fridge door.
    dm43_tailor(ctx, o = {}) {
      const t = ctx.t, r = R(4302);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#27363c"/><rect x="-300" y="820" width="${W + 600}" height="400" fill="#1f2c31"/>`;
      for (let yy = -40; yy < 1220; yy += 70) for (let xx = -300 + ((yy / 70) % 2) * 110; xx < W + 300; xx += 220) back += `<rect x="${xx}" y="${yy}" width="214" height="64" fill="none" stroke="#223035" stroke-width="3"/>`;
      // the barred window with cold daylight
      back += `<rect x="110" y="250" width="330" height="360" fill="#9fb3bd" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2, 3].map(i => `<rect x="${150 + i * 72}" y="252" width="12" height="356" fill="#1a2226"/>`).join('') + `<rect x="112" y="420" width="326" height="10" fill="#1a2226"/>` + wash(275, 430, 320, 300, '#dfe9ee', 0.2);
      // shelves of folded cloth (muted), a pegboard of spools
      let shelf = `<rect x="560" y="300" width="420" height="440" fill="#1c272c" stroke="#3a474d" stroke-width="6"/>`;
      for (let k = 0; k < 4; k++) { const yy = 400 + k * 110; shelf += `<rect x="560" y="${yy}" width="420" height="10" fill="#3a474d"/>`;
        let fx = 574; while (fx < 960) { const fw = 60 + r() * 50, col = ['#55606a', '#6b6a60', '#4f5d66', '#7a7468', '#5c6672'][Math.floor(r() * 5)]; shelf += `<rect x="${f1(fx)}" y="${f1(yy - 46)}" width="${f1(fw)}" height="44" rx="5" fill="${col}" stroke="${INK}" stroke-width="2"/>`; fx += fw + 6; } }
      // the side bench with sewing machines (left) and the fridge (right)
      let mid = `<rect x="-200" y="900" width="560" height="26" fill="#44525a" stroke="${INK}" stroke-width="4"/><rect x="-180" y="926" width="24" height="300" fill="#2a3338"/><rect x="320" y="926" width="24" height="300" fill="#2a3338"/>` + sewing(-40, 900, 0.9) + sewing(220, 900, 0.9);
      mid += fridge(880, 1220, 1.0, t, { open: o.open || 0 });
      // caged ceiling light
      const fl = 0.86 + 0.14 * Math.sin(t * 9.3);
      mid += `<rect x="420" y="120" width="300" height="22" rx="6" fill="#e9eadf" opacity="${f1(0.9 * fl)}"/>` + wash(570, 200, 420, 240, '#e2ebe9', f1(0.16 * fl));
      let floor = `<rect x="-300" y="1220" width="${W + 600}" height="${H}" fill="#1b2529"/><rect x="-300" y="1220" width="${W + 600}" height="10" fill="#34424a"/>`;
      for (let i = 0; i < 8; i++) floor += `<ellipse cx="${f1(-100 + r() * 1300)}" cy="${f1(1300 + r() * 600)}" rx="${f1(60 + r() * 120)}" ry="${f1(10 + r() * 14)}" fill="#141c20" opacity="0.6"/>`;
      return { light: { dir: -1, rim: '#dfe9ee', key: '#e4ece9' }, layers: [[0.1, back], [0.35, shelf], [0.6, mid], [1.0, floor]] };
    },

    // a cell-block gallery at night: a long run of barred cell fronts along the left, a walkway, caged lights, a far door
    dm43_block(ctx, o = {}) {
      const t = ctx.t, r = R(4303);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#1a2429"/>`;
      // the far wall and a door at the end of the gallery
      back += `<rect x="640" y="380" width="520" height="820" fill="#223035"/><rect x="820" y="640" width="150" height="560" fill="#141c20" stroke="#35444b" stroke-width="5"/>` + wash(895, 920, 160, 300, '#9fb3bd', 0.1);
      // cell fronts: bars in perspective along the left, each cell a dark opening with a bunk shape
      let cells = '';
      for (let k = 0; k < 4; k++) { const x0 = -120 + k * 230, w = 240 - k * 20, y0 = 300 + k * 40, h = 900 - k * 70;
        cells += `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#0f1619"/><rect x="${x0 + 20}" y="${y0 + h - 160}" width="${w - 60}" height="40" fill="#2a3338"/>`;
        for (let b = 0; b < 7; b++) cells += `<rect x="${f1(x0 + 10 + b * (w / 7))}" y="${y0}" width="9" height="${h}" fill="#55636b"/>`;
        cells += `<rect x="${x0}" y="${y0 + h * 0.5}" width="${w}" height="10" fill="#55636b"/><rect x="${x0}" y="${y0}" width="${w}" height="12" fill="#6a7880"/>`; }
      // caged lights along the ceiling
      let lights = '';
      [[160, 120], [520, 150], [860, 180]].forEach(([lx, ly], i) => { const fl = 0.85 + 0.15 * Math.sin(t * (i ? 1.7 : 11) + i); lights += `<rect x="${lx - 40}" y="${ly}" width="80" height="26" rx="8" fill="#e8e6d8" opacity="${f1(0.9 * fl)}"/>` + wash(lx, ly + 80, 260, 200, '#e2ebe9', f1(0.14 * fl)); });
      let floor = `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="#1f292d"/><rect x="-300" y="1200" width="${W + 600}" height="10" fill="#3a474d"/><rect x="760" y="1200" width="${W}" height="30" fill="#2a3338"/>`;
      for (let i = 0; i < 6; i++) floor += `<ellipse cx="${f1(-100 + r() * 1300)}" cy="${f1(1300 + r() * 600)}" rx="${f1(60 + r() * 100)}" ry="${f1(8 + r() * 12)}" fill="#141c20" opacity="0.6"/>`;
      return { light: { dir: 1, rim: '#dfe9ee', key: '#e4ece9' }, layers: [[0.1, back], [0.3, lights], [0.55, cells], [1.0, floor]] };
    },

    // the steam tunnel: a brick vault, two big lagged pipes with bands and valves, a caged bulb, a wet floor; o.cut 0..1
    // draws a rectangular cut in the lower pipe's lagging (no tool is drawn here; the figure carries the action)
    dm43_tunnel(ctx, o = {}) {
      const t = ctx.t, r = R(4304), cut = clamp(o.cut || 0, 0, 1);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#1c1f22"/>`;
      for (let yy = -40; yy < 1220; yy += 50) for (let xx = -300 + ((yy / 50) % 2) * 80; xx < W + 300; xx += 160) back += `<rect x="${xx}" y="${yy}" width="154" height="44" fill="${(xx + yy) % 7 ? '#2a2e30' : '#33373a'}" stroke="#1a1d1f" stroke-width="3"/>`;
      back += `<path d="M-300 -300 L${W + 300} -300 L${W + 300} 260 Q540 60 -300 260 Z" fill="#141719"/>`;
      // the caged bulb
      const bl = 0.82 + 0.18 * Math.sin(t * 6.1 + Math.sin(t * 17));
      back += `<path d="M540 60 L540 180" stroke="#0e1012" stroke-width="5"/><circle cx="540" cy="200" r="22" fill="#ffe3a8" opacity="${f1(bl)}"/><path d="M520 180 L560 180 M516 200 L564 200 M520 220 L560 220" stroke="#0e1012" stroke-width="3"/>` + wash(540, 260, 420, 320, '#f0d4a0', f1(0.22 * bl));
      // the pipes: an upper thin pipe and the big lagged steam pipe at knee height
      let pipes = `<rect x="-300" y="330" width="${W + 600}" height="70" rx="35" fill="#4a4f52" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${-200 + i * 330}" y="320" width="34" height="90" rx="8" fill="#5c6266" stroke="${INK}" stroke-width="3"/>`).join('');
      pipes += `<rect x="-300" y="860" width="${W + 600}" height="230" rx="115" fill="#6a6c66" stroke="${INK}" stroke-width="6"/><rect x="-300" y="880" width="${W + 600}" height="40" rx="20" fill="#8a8c84" opacity="0.6"/>`;
      pipes += [0, 1, 2, 3].map(i => `<rect x="${-100 + i * 380}" y="850" width="50" height="250" rx="10" fill="#4f5355" stroke="${INK}" stroke-width="4"/>`).join('');
      pipes += `<g transform="translate(260 760)"><rect x="-14" y="0" width="28" height="110" fill="#4f5355" stroke="${INK}" stroke-width="3"/><circle cx="0" cy="0" r="46" fill="none" stroke="#8a4a3a" stroke-width="12"/><path d="M-46 0 L46 0 M0 -46 L0 46" stroke="#8a4a3a" stroke-width="8"/></g>`;
      if (cut > 0) pipes += `<rect x="560" y="900" width="${f1(220 * cut)}" height="150" rx="6" fill="#0c0e10" stroke="${ACC}" stroke-width="${f1(3 * cut)}" stroke-opacity="0.7"/>`;
      let floor = `<rect x="-300" y="1090" width="${W + 600}" height="${H}" fill="#1a1d1f"/><rect x="-300" y="1090" width="${W + 600}" height="10" fill="#3a3e41"/>` + wash(540, 1180, 520, 120, '#f0d4a0', 0.1);
      for (let i = 0; i < 7; i++) floor += `<ellipse cx="${f1(-100 + r() * 1300)}" cy="${f1(1200 + r() * 500)}" rx="${f1(80 + r() * 140)}" ry="${f1(10 + r() * 14)}" fill="#2a3034" opacity="0.7"/>`;
      return { light: { dir: -1, rim: '#f0d4a0', key: '#e8d2a8' }, layers: [[0.1, back], [0.5, pipes], [1.0, floor]] };
    },

    // a village street at night outside a high wall (generic): the wall with a lit tower shape far off, dark houses, a
    // street lamp, the road, and an open manhole in the foreground with its cover beside it. o.open 0..1 = the cover slid.
    dm43_street(ctx, o = {}) {
      const t = ctx.t, r = R(4305), op = clamp(o.open ?? 1, 0, 1);
      let sky = `<defs><linearGradient id="dmssk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070d14"/><stop offset="1" stop-color="#1b2f3d"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#dmssk)"/>`;
      for (let i = 0; i < 40; i++) sky += `<circle cx="${f1(r() * W)}" cy="${f1(r() * 500)}" r="${f1(1 + r() * 1.6)}" fill="#dfe9ee" opacity="${f1(0.3 + 0.5 * r())}"/>`;
      // the wall and a tower, far
      let far = `<rect x="-300" y="560" width="${W + 600}" height="300" fill="#2b3a42" stroke="${INK}" stroke-width="5"/>` + [...Array(14)].map((_, i) => `<rect x="${-300 + i * 120}" y="540" width="70" height="24" fill="#2b3a42"/>`).join('');
      far += `<rect x="760" y="380" width="120" height="200" fill="#223139" stroke="${INK}" stroke-width="4"/><rect x="784" y="410" width="72" height="40" fill="#f6e6c4" opacity="0.7"/>` + wash(820, 430, 160, 90, '#f6e6c4', 0.2);
      for (let i = 0; i < 12; i++) far += `<rect x="${f1(-200 + i * 140)}" y="${f1(790 + (i % 3) * 10)}" width="100" height="60" fill="#1e2a31"/>`;
      // dark houses either side, the lamp
      let mid = `<path d="M-300 1000 L-300 760 L-120 660 L60 760 L60 1000 Z" fill="#1a252b" stroke="${INK}" stroke-width="4"/><rect x="-60" y="800" width="60" height="70" fill="#f6e6c4" opacity="0.25"/>`;
      mid += `<path d="M900 1000 L900 740 L1080 640 L1260 740 L1260 1000 Z" fill="#1a252b" stroke="${INK}" stroke-width="4"/>` + lamp(700, 1000, 420, t);
      let road = `<rect x="-300" y="1000" width="${W + 600}" height="${H}" fill="#1f282d"/><rect x="-300" y="1000" width="${W + 600}" height="12" fill="#39474f"/>`;
      road += `<path d="M-300 1120 L${W + 300} 1120" stroke="#2c373d" stroke-width="6"/>`;
      // the manhole: the rim, the dark opening, the cover slid aside
      road += `<ellipse cx="440" cy="1360" rx="190" ry="78" fill="#0a0e11" stroke="#55636b" stroke-width="8"/><ellipse cx="440" cy="1352" rx="170" ry="66" fill="#06090b"/>` + wash(440, 1340, 240, 110, '#3a5560', 0.14);
      road += `<g transform="translate(${f1(440 + 300 * op)} ${f1(1372 + 18 * op)})"><ellipse cx="0" cy="0" rx="180" ry="72" fill="#3a444a" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="0" rx="130" ry="50" fill="none" stroke="#2a3338" stroke-width="5"/>` + [0, 1, 2].map(i => `<ellipse cx="0" cy="0" rx="${40 + i * 30}" ry="${16 + i * 12}" fill="none" stroke="#4e5a60" stroke-width="3"/>`).join('') + `</g>`;
      return { light: { dir: -1, rim: '#f6e6c4', key: '#b9c3c8' }, layers: [[0.05, sky], [0.2, far], [0.5, mid], [1.0, road]], fog: true };
    },

    // dense night woods with ground fog: layered pines, trunks, a faint moonlit sky; o.glow = a far-off search glow
    dm43_woods(ctx, o = {}) {
      const t = ctx.t, r = R(4306), gl = o.glow ?? 0.5;
      let sky = `<defs><linearGradient id="dmwsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060b10"/><stop offset="1" stop-color="#1b2f3d"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#dmwsk)"/>` + wash(760, 900, 700, 260, '#9fb3bd', 0.12 * gl);
      const P = E.cine.pines;
      let far = P(980, 14, 31, '#0f1b22', 1.1, -300, W + 300), mid = P(1120, 9, 32, '#0a141a', 1.45, -300, W + 300);
      for (let i = 0; i < 8; i++) { const x = -200 + i * 190 + r() * 80; mid += `<rect x="${f1(x)}" y="${f1(700 + r() * 100)}" width="${f1(18 + r() * 14)}" height="${f1(420 + r() * 80)}" fill="#07111a"/>`; }
      let ground = `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="#0d171c"/>`;
      for (let i = 0; i < 16; i++) ground += `<ellipse cx="${f1(-100 + r() * 1300)}" cy="${f1(1240 + r() * 500)}" rx="${f1(40 + r() * 120)}" ry="${f1(8 + r() * 16)}" fill="#0a1216" opacity="0.8"/>`;
      const fg = P(1800, 3, 33, '#040a0e', 1.5, -500, 60) + P(1800, 2, 34, '#040a0e', 1.5, 1040, 1500);
      return { light: { dir: 1, rim: '#bcd4e6', key: '#dfe9ee' }, layers: [[0.05, sky], [0.25, far], [0.55, mid], [1.0, ground], [1.45, fg]], fog: true };
    },

    // a rural road at dusk between mown fields and a tree line (generic): a low sun glow, fence posts, a blank road sign
    dm43_road(ctx, o = {}) {
      const t = ctx.t, r = R(4307);
      let sky = `<defs><linearGradient id="dmrsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16283a"/><stop offset="0.65" stop-color="#6f7a80"/><stop offset="1" stop-color="#c9a77c"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#dmrsk)"/>` + wash(820, 760, 520, 220, '#f2c48a', 0.2);
      let far = `<rect x="-300" y="800" width="${W + 600}" height="120" fill="#2a3a3a"/>` + E.cine.pines(820, 22, 35, '#1c2a2e', 0.55, -300, W + 300);
      let field = `<rect x="-300" y="900" width="${W + 600}" height="400" fill="#4d5a48"/><rect x="-300" y="900" width="${W + 600}" height="6" fill="#5e6c58"/>`;
      for (let i = 0; i < 30; i++) field += `<path d="M${f1(-300 + i * 50)} 1000 Q${f1(-280 + i * 50)} 950 ${f1(-260 + i * 50)} 1000" stroke="#3e4a3a" stroke-width="3" fill="none"/>`;
      for (let i = 0; i < 9; i++) field += `<rect x="${-200 + i * 170}" y="${f1(1040 - i * 2)}" width="12" height="90" fill="#2a2a24"/>`;
      field += `<path d="M-200 1060 L${W + 200} 1050" stroke="#3a3a30" stroke-width="3"/>`;
      // the blank road sign (no lettering) and the road
      field += `<rect x="930" y="900" width="10" height="260" fill="#55606a"/><rect x="880" y="880" width="110" height="80" rx="6" fill="#4a5a52" stroke="${INK}" stroke-width="3"/>`;
      let road = `<path d="M-300 1300 L${W + 300} 1230 L${W + 300} ${H + 300} L-300 ${H + 300} Z" fill="#2c3236"/><path d="M-300 1300 L${W + 300} 1230" stroke="#3e464a" stroke-width="8"/>`;
      for (let i = 0; i < 8; i++) road += `<rect x="${-200 + i * 190}" y="${f1(1480 - i * 8)}" width="90" height="10" fill="#b9c3c8" opacity="0.35"/>`;
      return { light: { dir: -1, rim: '#f2c48a', key: '#e8d8c0' }, layers: [[0.05, sky], [0.25, far], [0.55, field], [1.0, road]] };
    }
  });

  // the hero framing in the first and last shots (the loop): the pack big and centred on the steel table
  const HERO = { x: 540, y: 1010, s: 0.92 };
  const table = `<path d="M-200 900 L${W + 200} 900 L${W + 300} 1260 L-300 1260 Z" fill="#53616a" stroke="${INK}" stroke-width="6"/><path d="M-300 1260 L${W + 300} 1260 L${W + 300} 1300 L-300 1300 Z" fill="#2c363c"/><path d="M-200 900 L${W + 200} 900" stroke="#7d8a92" stroke-width="5"/>` + wash(540, 1040, 560, 240, '#dfe9ee', 0.1);

  E.registerScenes({
    // 1 - hook: the pack with the blades, big and centred on the table; Mitchell's silhouette behind at the fridge. The
    //     headline is burned in by the engine until ~3 s; no overlays in y 380-720 before then.
    dm43_hook(ctx) {
      const t = ctx.t, T = ctx.T, kill = WT(ctx, 0, 4, 1.4), l1 = LS(ctx, 1, 2.5), d23 = WT(ctx, 1, 3, 3.2), off = WT(ctx, 1, 6, 4.2);
      return E.cine.shot(ctx, {
        set: 'dm43_tailor', setOpts: { open: 0.6 }, grade: 'cold', dof: true, haze: 0.7,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 0, y: 50, z: 1.12 }, settle: true },
        shafts: { x: 300, n: 3, op: 0.1, w: 70 },
        figures: [
          { id: 'dm43_mitchell', x: 760, y: 1230, scale: 0.72, dir: -1, turn: 0.5, pose: 'examine', silhouette: 'cool', depth: 0.93,
            keys: [{ at: kill, pose: 'hand_to_face', dur: 0.5 }, { at: l1 + 0.2, pose: 'stand_tense', dur: 0.5 }, { at: off, pose: 'arms_crossed', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.0, svg: table },
          { depth: 1.0, accent: true, svg: tt => meatPack(HERO.x, HERO.y, HERO.s, tt, { reveal: 0.45 + 0.1 * seg(tt, 0.3, 1.6), glow: 0.7 + 0.3 * Math.sin(tt * 3) }) }
        ],
        overlays: [{ type: 'label', at: d23 - 0.2, x: 60, y: 800, text: '23 DAYS · 1,300 OFFICERS', fs: 40, sub: 'June 2015 · upstate New York' }],
        tag: LIKE
      });
    },

    // 2 - where: the map fly-in over North America; the USA draws itself in; the pin lands on Dannemora, NY
    dm43_map(ctx) {
      const T = ctx.T, dan = WT(ctx, 0, 0, 0.1), how = WT(ctx, 0, 4, 1.8);
      return E.cine.shot(ctx, {
        set: 'mapflight', grade: 'none', haze: 0,
        setOpts: { geo: 'north_america', from: { center: [-96, 40], span: 62 }, to: { center: [-73.4, 44.6], span: 5.2 }, t0: 0.05, t1: Math.max(dan + 1.9, T - 0.5),
          country: 'United States of America', country_at: 0.1, draw: true, tilt: true,
          pin: { ll: [-73.72, 44.72], label: 'DANNEMORA, NY', at: dan + 1.3, dx: 36, dy: 70, anchor: 'start', fs: 50 },
          labels: [{ ll: [-100, 39.5], text: 'USA', at: 0.3, fs: 48 }, { ll: [-96, 52], text: 'CANADA', at: 0.5, fs: 40 }] },
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 0, z: 1.03 } },
        overlays: [{ type: 'label', at: how - 0.3, x: 60, y: 420, text: 'CLINTON CORRECTIONAL FACILITY', fs: 36, sub: 'Maximum security · escape found 6 June 2015' }],
        tag: 'ILLUSTRATION · MAP, NATURAL EARTH DATA'
      });
    },

    // 3 - the tailor shop: Mitchell's silhouette at the open fridge; the pack on the table; the blades slide into the meat
    //     (reveal 1 -> 0 on 'blades'); impact on 'blades'; a rack focus onto the pack
    dm43_tailor(ctx) {
      const t = ctx.t, T = ctx.T, pt = WT(ctx, 0, 0, 0.1), joy = WT(ctx, 0, 2, 0.6), hid = WT(ctx, 0, 4, 1.4), bl = WT(ctx, 0, 6, 2.0), ins = WT(ctx, 0, 7, 2.5);
      const rv = tt => 1 - ease.inOut(seg(tt, hid - 0.1, bl + 0.3));
      return E.cine.shot(ctx, {
        set: 'dm43_tailor', setOpts: { open: 1 }, grade: 'cold', dof: true, haze: 0.7,
        cam: { keys: [{ at: 0, x: 40, y: 20, z: 1.0 }, { at: 0, dur: Math.max(1.4, T), x: 60, y: 60, z: 1.14, settle: true }] },
        rack: { at: hid - 0.2, dur: 0.7, from: 'bg' },
        shake: [{ at: bl, amp: 2 }],
        figures: [
          { id: 'dm43_mitchell', x: 740, y: 1230, scale: 0.74, dir: -1, turn: 0.5, pose: 'examine', silhouette: 'cool', depth: 0.93,
            keys: [{ at: joy, pose: 'present', gaze: [-0.7, 0.4], dur: 0.5 }, { at: hid, pose: 'examine', dur: 0.4 }, { at: ins + 0.2, pose: 'hands_together', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.0, svg: table },
          { depth: 1.0, accent: true, svg: tt => meatPack(HERO.x, HERO.y, HERO.s, tt, { reveal: rv(tt), glow: 1 }) }
        ],
        overlays: [
          { type: 'impact', at: bl, x: 540, y: 1010 },
          { type: 'card', at: pt + 0.1, x: 60, y: 400, w: 760, rows: [{ text: 'THE TAILOR SHOP', fs: 40 }, { text: 'JOYCE MITCHELL · SHOP SUPERVISOR', fs: 28, at: joy }, { text: 'BLADES, CHISELS, A PUNCH, A BIT', fs: 28, at: bl + 0.1 }] }
        ],
        tag: LIKE
      });
    },

    // 4 - the guard: Palmer's silhouette carries the pack along the gallery and hands it through the bars to a
    //     silhouette inside; the card names the two men as convicted murderers
    dm43_guard(ctx) {
      const t = ctx.t, T = ctx.T, gd = WT(ctx, 0, 1, 0.3), car = WT(ctx, 0, 2, 0.6), mat = WT(ctx, 0, 5, 1.3), swt = WT(ctx, 0, 7, 1.9);
      const wk = { at: 0.05, dur: Math.max(0.8, car + 0.6), cadence: 5.0, stride: 16, from: 760, to: 560 };
      const px = tt => lerp(760, 560, ease.inOut(seg(tt, 0.05, 0.05 + wk.dur)));
      return E.cine.shot(ctx, {
        set: 'dm43_block', grade: 'night', haze: 0.7, dof: true,
        cam: { keys: [{ at: 0, x: -30, y: 20, z: 1.0 }, { at: 0, dur: Math.max(1.4, T), x: 20, y: 40, z: 1.1, settle: true }] },
        figures: [
          { id: 'dm43_palmer', x: 760, y: 1700, scale: 0.9, dir: -1, turn: 0.5, pose: 'walk', silhouette: 'cool', depth: 1.01, walk: wk,
            keys: [{ at: car + 0.6, pose: 'present', gaze: [-0.8, 0.2], dur: 0.5 }, { at: swt + 0.3, pose: 'stand_tense', dur: 0.5 }] },
          { id: 'dm43_matt', x: 180, y: 1420, scale: 0.7, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'warm', depth: 0.5,
            keys: [{ at: gd, pose: 'examine', dur: 0.5 }, { at: mat, pose: 'present', gaze: [0.8, 0.2], dur: 0.5 }] },
          { id: 'dm43_sweat', x: 60, y: 1380, scale: 0.62, dir: 1, turn: 0.4, pose: 'stand', silhouette: 'warm', depth: 0.5,
            keys: [{ at: swt, pose: 'point', gaze: [0.8, 0.1], dur: 0.5 }] }
        ],
        props: [{ depth: 1.02, accent: true, svg: tt => meatPack(px(tt) - 120, 1340 + 6 * Math.sin(tt * 10), 0.22, tt, { reveal: 0.05, glow: 0.35 }) }],
        overlays: [
          { type: 'label', at: gd - 0.1, x: 60, y: 420, text: 'A CORRECTIONS OFFICER', fs: 40, sub: 'Gene Palmer · said he did not know of the plan' },
          { type: 'card', at: mat - 0.1, x: 60, y: 600, w: 820, rows: [{ text: 'RICHARD MATT · DAVID SWEAT', fs: 36 }, { text: 'BOTH SERVING TIME FOR MURDER', fs: 28, at: swt }] }
        ],
        tag: LIKE
      });
    },

    // 5 - the LESSON (save trigger): the Inspector General's three warning signs as a ticked checklist with the SAVE ribbon,
    //     captions off (scene caption_mode 'none'); Palmer's silhouette walks on down the gallery behind it
    dm43_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sav = WT(ctx, 0, 3, 1.3);
      return E.cine.shot(ctx, {
        set: 'dm43_block', grade: 'night', haze: 0.8, dof: true,
        cam: { keys: [{ at: 0, x: 20, y: 40, z: 1.1 }, { at: 0, dur: Math.max(1.4, T), x: -20, y: 20, z: 1.02, settle: true }] },
        figures: [
          { id: 'dm43_palmer', x: 640, y: 1680, scale: 0.78, dir: 1, turn: 0.5, pose: 'walk', silhouette: 'cool', depth: 1.01, walk: { at: 0.05, dur: Math.max(1.2, T - 0.4), cadence: 5.0, stride: 16, from: 640, to: 900 },
            keys: [{ at: sav + 0.4, pose: 'stand', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 400, rows: [{ text: '1 TOOLS HIDDEN IN FOOD', fs: 40 }, { text: '2 A GUARD DOING FAVOURS', fs: 40 }, { text: '3 400 BED CHECKS SKIPPED', fs: 40 }, { text: 'NY Inspector General, 2016', fs: 26, colour: '#b9c3c8' }] }
        ],
        tag: LIKE
      });
    },

    // 6 - the cut: the steam tunnel; Sweat's silhouette kneels at the big pipe and works (arm keys), sparks and steam;
    //     the cut opens on 'pipe'; the fun fact (the note) pops after the line
    dm43_cut(ctx) {
      const t = ctx.t, T = ctx.T, cut = WT(ctx, 0, 1, 0.3), stl = WT(ctx, 0, 3, 0.9), stm = WT(ctx, 0, 6, 1.6), pipe = WT(ctx, 0, 7, 1.9);
      const strokes = []; for (let a = cut, i = 0; a < T; a += 0.26, i++) strokes.push({ at: a, pose: i % 2 ? 'kneel' : 'examine', dur: 0.2 });
      return E.cine.shot(ctx, {
        set: 'dm43_tunnel', setOpts: { cut: 0 }, grade: 'warm', haze: 0.8, dof: true,
        cam: { keys: [{ at: 0, x: -30, y: 60, z: 1.02 }, { at: 0, dur: Math.max(1.4, T), x: 30, y: 90, z: 1.14, settle: true }] },
        smoke: { y: 1150, op: 0.2, n: 7, col: '#c9d6e0' },
        sparks: { x: 600, y: 1000, n: 22 },
        figures: [
          { id: 'dm43_sweat', x: 760, y: 1560, scale: 0.86, dir: -1, turn: 0.5, pose: 'kneel', silhouette: 'warm', depth: 1.01, keys: strokes },
          { id: 'dm43_matt', x: 240, y: 1520, scale: 0.8, dir: 1, turn: 0.4, pose: 'torch_low', silhouette: 'cool', depth: 1.0, propOpts: { aim: 20, beamLen: 420 },
            keys: [{ at: stl, pose: 'torch_low', gaze: [0.8, 0.3], dur: 0.4 }, { at: pipe + 0.3, pose: 'stand_tense', dur: 0.5 }] }
        ],
        props: [{ depth: 0.51, svg: tt => { const k = seg(tt, stm, pipe + 0.6); return k > 0 ? `<rect x="560" y="900" width="${f1(220 * k)}" height="150" rx="6" fill="#0c0e10" stroke="${ACC}" stroke-width="3" stroke-opacity="0.7"/>` : ''; } }],
        overlays: [
          { type: 'label', at: cut - 0.1, x: 60, y: 420, text: 'THE STEAM TUNNELS', fs: 40, sub: 'Cells cut at the back · a steam pipe · a manhole' },
          { type: 'funfact', at: pipe + 0.5, y: 560, rows: [{ text: 'THEY LEFT A NOTE ON THE PIPE:' }, { text: '"HAVE A NICE DAY."' }] }
        ],
        tag: LIKE
      });
    },

    // 7 - the manhole, DAY 1: two silhouettes climb out into the night street; one looks for the car that never came;
    //     impact on 'never'; the card
    dm43_manhole(ctx) {
      const t = ctx.t, T = ctx.T, jun = WT(ctx, 0, 0, 0.1), out = WT(ctx, 0, 2, 0.7), man = WT(ctx, 0, 5, 1.4), drv = WT(ctx, 0, 7, 2.1), nev = WT(ctx, 0, 8, 2.5);
      const rise = (tt, a) => 1600 - 240 * ease.out(seg(tt, a, a + 1.2));
      return E.cine.shot(ctx, {
        set: 'dm43_street', setOpts: { open: 1 }, grade: 'night', haze: 0.8,
        cam: { keys: [{ at: 0, x: 0, y: 80, z: 1.06 }, { at: 0, dur: Math.max(1.4, T), x: 20, y: 40, z: 1.0, settle: true }], handheld: 0.12 },
        rack: { at: nev - 0.2, dur: 0.7, from: 'bg' },
        shake: [{ at: nev, amp: 3 }],
        figures: [
          { id: 'dm43_sweat', x: 400, y: 1600, scale: 0.84, dir: 1, turn: 0.45, pose: 'stand_tense', silhouette: 'cool', depth: 1.02,
            keys: [{ at: out, y: rise(out + 1.2, out), dur: 1.2 }, { at: drv, pose: 'point', gaze: [0.9, -0.2], headTurn: 0.5, dur: 0.5 }, { at: nev + 0.3, pose: 'stand_tense', headTurn: -0.5, dur: 0.5 }] },
          { id: 'dm43_matt', x: 560, y: 1640, scale: 0.9, dir: -1, turn: 0.45, pose: 'stand', silhouette: 'warm', depth: 1.03,
            keys: [{ at: man, y: rise(man + 1.2, man), dur: 1.2 }, { at: nev, pose: 'hand_to_face', dur: 0.6 }, { at: nev + 0.8, pose: 'arms_crossed', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: jun - 0.1, x: 60, y: 420, text: '6 JUNE 2015 · MORNING COUNT', fs: 40, sub: 'Two empty cells, beds stuffed with clothes' },
          { type: 'impact', at: nev, x: 540, y: 900 },
          { type: 'card', at: nev + 0.15, x: 60, y: 600, w: 800, rows: [{ text: 'THE GETAWAY DRIVER: MITCHELL', fs: 36 }, { text: 'SHE NEVER CAME · THEY FLED ON FOOT', fs: 28, at: nev + 0.5 }] }
        ],
        tag: LIKE
      });
    },

    // 8 - the manhunt, DAY 7: night woods, handheld, two officers with torches sweep the trees; Mitchell arrested (card);
    //     the killers still out there
    dm43_hunt(ctx) {
      const t = ctx.t, T = ctx.T, mit = WT(ctx, 0, 0, 0.1), arr = WT(ctx, 0, 2, 0.6), kil = WT(ctx, 0, 4, 1.4), gone = WT(ctx, 0, 5, 1.9);
      const W0 = { at: 0.1, dur: Math.max(1.5, T - 0.5), cadence: 5.0, stride: 14 };
      return E.cine.shot(ctx, {
        set: 'dm43_woods', setOpts: { glow: 0.7 }, grade: 'night', haze: 0.9,
        cam: { keys: [{ at: 0, x: -20, y: 20, z: 1.0 }, { at: 0, dur: Math.max(1.4, T), x: 30, y: 40, z: 1.1 }], handheld: 0.3 },
        police: 0.28,
        figures: [
          { id: 'dm43_trooper', x: 300, y: 1540, scale: 0.8, dir: 1, turn: 0.45, pose: 'torch', expr: 'focused', depth: 1.01, propOpts: { aim: -10 + 14 * Math.sin(t * 1.4), beamLen: 560 }, walk: { ...W0, from: 300, to: 420 },
            keys: [{ at: kil, pose: 'torch', expr: 'stern', gaze: [0.8, -0.3], dur: 0.4 }] },
          { id: 'dm43_officer', x: 780, y: 1490, scale: 0.76, dir: -1, turn: 0.45, pose: 'torch_low', expr: 'determined', depth: 0.99, propOpts: { aim: 24 + 10 * Math.sin(t * 1.1 + 2), beamLen: 480 }, walk: { ...W0, from: 780, to: 680 },
            keys: [{ at: gone, pose: 'torch', expr: 'worried', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'card', at: mit + 0.1, x: 60, y: 420, w: 800, rows: [{ text: 'JOYCE MITCHELL ARRESTED', fs: 38 }, { text: '12 JUNE 2015 · DAY 7 OF THE HUNT', fs: 28, at: arr }] },
          { type: 'label', at: gone - 0.1, x: 60, y: 760, text: '1,300 OFFICERS · $1M A DAY', fs: 36, sub: 'AP estimate from payroll records' }
        ],
        tag: TAG
      });
    },

    // 9 - DAY 21: two tactical officers at a cabin edge in the woods at dusk, radios; Matt is shot dead (card and line only)
    dm43_matt(ctx) {
      const t = ctx.t, T = ctx.T, d21 = WT(ctx, 0, 1, 0.3), bp = WT(ctx, 0, 2, 0.9), shot = WT(ctx, 0, 4, 1.7), dead = WT(ctx, 0, 7, 2.6);
      return E.cine.shot(ctx, {
        set: 'cabin_woods', setOpts: { cabinX: 760 }, grade: 'cold', haze: 0.8, dof: true,
        cam: { keys: [{ at: 0, x: 20, y: 0, z: 1.0 }, { at: 0, dur: Math.max(1.4, T), x: -20, y: 30, z: 1.1, settle: true }], handheld: 0.15 },
        shake: [{ at: dead, amp: 3 }],
        figures: [
          { id: 'dm43_agent', x: 300, y: 1560, scale: 0.9, dir: 1, turn: 0.45, pose: 'stand_tense', expr: 'focused', depth: 1.01,
            keys: [{ at: bp, pose: 'point', gaze: [0.8, -0.3], expr: 'determined', dur: 0.5 }, { at: dead + 0.3, pose: 'hand_to_face', expr: 'stern', dur: 0.6 }] },
          { id: 'dm43_officer', x: 760, y: 1600, scale: 0.92, dir: -1, turn: 0.45, pose: 'torch', expr: 'stern', depth: 1.02, propOpts: { aim: -16, beamLen: 420 },
            keys: [{ at: shot, pose: 'stand_tense', expr: 'shocked', dur: 0.4 }, { at: dead + 0.4, pose: 'bowed', expr: 'stern', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'label', at: d21 - 0.1, x: 60, y: 420, text: '26 JUNE 2015 · NEAR MALONE, NY', fs: 38, sub: 'About 10 miles from the Canadian border' },
          { type: 'impact', at: dead, x: 540, y: 800 },
          { type: 'card', at: shot - 0.1, x: 60, y: 600, w: 800, rows: [{ text: 'RICHARD MATT · SHOT DEAD', fs: 36 }, { text: 'BORDER PATROL TACTICAL TEAM · DAY 21', fs: 28, at: dead + 0.1 }] }
        ],
        tag: TAG
      });
    },

    // 10 - DAY 23: a rural road at dusk; a lone trooper; Sweat's silhouette runs for the tree line, then stands with hands
    //      behind its back; impact and cuffs on 'caught'; the card (about 2 miles from Canada)
    dm43_sweat(ctx) {
      const t = ctx.t, T = ctx.T, d23 = WT(ctx, 0, 1, 0.3), sw = WT(ctx, 0, 2, 0.9), caught = WT(ctx, 0, 4, 1.6), two = WT(ctx, 0, 5, 2.1), can = WT(ctx, 0, 8, 3.0);
      return E.cine.shot(ctx, {
        set: 'dm43_road', grade: 'dawn', haze: 0.7, dof: true,
        cam: { keys: [{ at: 0, x: 30, y: 10, z: 1.0 }, { at: 0, dur: Math.max(1.4, T), x: -10, y: 30, z: 1.12, settle: true }], handheld: 0.2 },
        rack: { at: caught - 0.2, dur: 0.7, from: 'bg' },
        shake: [{ at: caught, amp: 3 }],
        figures: [
          { id: 'dm43_sweat', x: 700, y: 1500, scale: 0.78, dir: 1, turn: 0.4, pose: 'walk', silhouette: 'cool', depth: 1.0, walk: { at: 0.05, dur: Math.max(0.6, caught - 0.3), cadence: 7.5, stride: 24, from: 700, to: 860 },
            keys: [{ at: caught - 0.2, pose: 'stand_tense', dur: 0.3 }, { at: caught + 0.3, pose: 'hands_behind', headTurn: -0.3, dur: 0.6 }] },
          { id: 'dm43_trooper', x: 240, y: 1600, scale: 0.94, dir: 1, turn: 0.5, pose: 'stand_tense', expr: 'determined', depth: 1.02,
            keys: [{ at: sw, pose: 'point', gaze: [0.9, -0.2], expr: 'stern', dur: 0.4 }, { at: caught + 0.2, pose: 'walk', dur: 0.5 }, { at: two, pose: 'stand', expr: 'relieved', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'label', at: d23 - 0.1, x: 60, y: 420, text: '28 JUNE 2015 · CONSTABLE, NY', fs: 38, sub: 'Shot twice and captured by a lone state trooper' },
          { type: 'impact', at: caught, x: 760, y: 1000 },
          { type: 'card', at: two + 0.1, x: 60, y: 600, w: 800, rows: [{ text: 'ABOUT 2 MILES FROM CANADA', fs: 36 }, { text: 'DAY 23 · THE MANHUNT ENDS', fs: 28, at: can - 0.2 }] }
        ],
        tag: LIKE
      });
    },

    // 11 - the outcome on the hero object in the first frame's framing (the loop); the sentences card sits BELOW y 760
    //      because the end question is burned in over the last 3.4 s; Mitchell's silhouette steps away from the fridge
    dm43_end(ctx) {
      const t = ctx.t, T = ctx.T, mit = WT(ctx, 0, 0, 0.1), out = WT(ctx, 0, 2, 0.6), y20 = WT(ctx, 0, 4, 1.2), nev = WT(ctx, 0, 6, 2.1);
      return E.cine.shot(ctx, {
        set: 'dm43_tailor', setOpts: { open: 0.3 }, grade: 'cold', dof: true, haze: 0.7,
        cam: { from: { x: 0, y: 50, z: 1.12 }, to: { x: 0, y: 30, z: 1.0 }, settle: true },
        shafts: { x: 300, n: 3, op: 0.1, w: 70 },
        figures: [
          { id: 'dm43_mitchell', x: 760, y: 1230, scale: 0.72, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'cool', depth: 0.93,
            keys: [{ at: out, pose: 'walk', dur: 0.4 }, { at: y20, pose: 'bowed', dur: 0.6 }, { at: nev, pose: 'hands_together', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.0, svg: table },
          { depth: 1.0, accent: true, svg: tt => meatPack(HERO.x, HERO.y, HERO.s, tt, { reveal: 0.5, glow: 0.8 + 0.2 * Math.sin(tt * 3) }) }
        ],
        overlays: [
          { type: 'card', at: mit + 0.05, x: 60, y: 1150, w: 960, rows: [{ text: 'MITCHELL: 2 1/3 TO 7 YRS · OUT 2020 · PALMER: 6 MONTHS', fs: 22 }, { text: 'SWEAT: 3 1/2 TO 7 MORE YRS, ON LIFE WITHOUT PAROLE', fs: 22, at: y20 }] }
        ],
        tag: LIKE
      });
    }
  });
})();
