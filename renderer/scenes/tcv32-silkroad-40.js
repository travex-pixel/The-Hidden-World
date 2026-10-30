/* Case File 32 (cinematic, 40-second cut): Silk Road, Ross Ulbricht and a fake fight in a library (1 October 2013).
   CLOSED: convicted on all seven counts (4 February 2015); life without parole (29 May 2015); pardoned by President Trump
   on 21 January 2025 and released (stated as fact only; the end question asks the viewer).
   Structure (short40 + the EPISODE 29+ / 31-35 rules): a burned-in hook headline that leads with the OBJECT and the twist
   ("A FAKE FIGHT IN A LIBRARY / CAUGHT THE SILK ROAD FOUNDER") over the HERO OBJECT: a generic open laptop on a library
   reading table, its lid to camera and its screen glow on an anonymous seated silhouette, big and centred in the first
   frame and again in the last (the video loops). A stakes number by 0:10 (over $200 million in sales, DOJ); fast beats
   (a Google search by an IRS investigator; a 2011 forum post by "altoid"; a later post with his own Gmail address); the
   problem (close the lid and it encrypts); the HOW at ~55 % (two agents stage a quarrel behind him; he looks up; an agent
   takes the laptop; still logged in as the admin); the outcome in one line; the pardon as fact; the callback; a burned-in
   YES/NO end question (episode.end_title) over the last 3.2 s. No nextcase card.
   Content rules:
   - No drugs, listings, money, weapons or victims are drawn anywhere. The market is a dark room with a glowing screen and
     a typed card; the forum page and the admin panel are illegible placeholder blocks; the Gmail address is never shown.
   - Ulbricht is ONLY an anonymous rim-lit silhouette (characters/figures/sr32_ulbricht.json), seated at the laptop or
     standing in court: no face, no likeness, never a photo recreation, never posed heroically. Every shot he is in is
     tagged 'ILLUSTRATION · NOT A LIKENESS'.
   - The IRS investigator (sr32_irs) and the agents (sr32_agent, agent_a, agent_b) are generic, unnamed figures. No badge,
     no weapon. The library patron (sr32_patron) is generic.
   - No brand or real material: the laptop carries no logo; the library, office, street and courtroom are generic drawings
     (the library is NOT a replica of the Glen Park branch); every card is our own typed graphic.
   New environments (E.registerSets): sr32_library (a public library reading room: tall shelves of colour-blocked spines,
   a high window, hanging lamps, a long reading table in the foreground that the figures sit behind), sr32_room (a dark
   apartment at night with a city window and a desk), sr32_street (a San Francisco hill street by day outside a generic
   branch library). Plus the shared office_day, task_force and courtroom sets.
   Timing: actions are keyed to the narrator's word timings (WT), so they land on the spoken word. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · ANONYMOUS FIGURES';
  const LIKENESS = 'ILLUSTRATION · NOT A LIKENESS';
  const LIB = 'ILLUSTRATION · GENERIC LIBRARY, NOT THE REAL ONE';
  const YEL = '#ffd23f', RED = '#8e1f18', MUTE = '#6b665c';
  const typing = (from, to, a = 'sit_type', b = 'sit_type_b', step = 0.24) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? b : a, dur: step * 0.8 }); return k; };
  const panel = (x, y, w, h, op = 0.6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#000" opacity="${op}"/>`;

  // ---------- THE HERO: a generic open laptop seen from behind at three-quarters, its lid towards the camera, on a
  // table; bottom front-left corner of the base at (x, y); ~560 x 430 at s = 1 with the lid open. The screen itself faces
  // away (towards the seated figure); its light spills over the top edge of the lid (o.glow 0..1). o.open 0..1 is the lid
  // angle (1 = open); o.lift 0..1 raises and tilts the whole laptop (the grab); o.outline 0..1 = a yellow outline;
  // o.tag 0..1 = a small blank evidence tag hanging from the corner. No logo, name or lettering is drawn.
  function laptop(x, y, s, t, o = {}) {
    const op = o.open ?? 1, gl = o.glow ?? 0.8, lf = o.lift || 0, k = o.outline || 0;
    const BODY = '#3a3d44', BODYD = '#24262c', BODYL = '#5a5e68';
    const dy = -lf * 140, rot = -lf * 18;
    let g = `<g transform="translate(${f1(x)} ${f1(y + dy)}) rotate(${f1(rot)})">`;
    g += `<ellipse cx="40" cy="4" rx="300" ry="26" fill="#000" opacity="${f1(0.45 * (1 - lf * 0.6))}"/>`;
    // the base: a thin slab in perspective, going back and to the right
    g += `<path d="M-260 0 L200 0 L200 16 L-260 16 Z" fill="${BODYD}" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-260 0 L200 0 L300 -90 L-160 -90 Z" fill="${BODY}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-230 -8 L180 -8 L270 -82 L-150 -82 Z" fill="${BODYL}" opacity="0.25"/>`;
    // the lid: hinged on the far edge, rising with the lid angle; its back is plain
    const hgt = 330 * op, lean = 40 * op + 90 * (1 - op);
    g += `<path d="M-160 -90 L300 -90 L${f1(300 + lean)} ${f1(-90 - hgt)} L${f1(-160 + lean)} ${f1(-90 - hgt)} Z" fill="${BODY}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-140 -100 L280 -100 L${f1(280 + lean * 0.92)} ${f1(-100 - hgt * 0.92)} L${f1(-140 + lean * 0.92)} ${f1(-100 - hgt * 0.92)} Z" fill="${BODYL}" opacity="0.18"/>`;
    g += `<path d="M${f1(-100 + lean * 0.5)} ${f1(-90 - hgt * 0.5)} q 120 -8 240 0" stroke="${BODYL}" stroke-width="3" fill="none" opacity="0.35"/>`;
    // the hinge
    g += `<path d="M-160 -90 L300 -90" stroke="${BODYD}" stroke-width="10"/><path d="M-160 -90 L300 -90" stroke="${INK}" stroke-width="3"/>`;
    // the screen's light over the top edge of the lid (it faces the person behind), and the bright edge itself
    if (gl > 0 && op > 0.2) {
      const ty = -90 - hgt;
      g += wash(70 + lean, ty - 60, 320, 150, '#9fd0ff', f1(0.32 * gl * op)) + wash(70 + lean, ty - 20, 260, 60, '#dff0ff', f1(0.35 * gl * op));
      g += `<path d="M${f1(-160 + lean)} ${f1(ty)} L${f1(300 + lean)} ${f1(ty)}" stroke="#cfe8ff" stroke-width="5" opacity="${f1(0.9 * gl)}"/>`;
    }
    if (o.tag > 0) g += `<g opacity="${f1(o.tag)}"><path d="M200 0 q 30 40 20 90" stroke="#e8dcc0" stroke-width="3" fill="none"/><rect x="200" y="86" width="60" height="38" rx="4" fill="#efe6c8" stroke="${INK}" stroke-width="3"/><path d="M210 98 L250 98 M210 110 L240 110" stroke="#9a958a" stroke-width="3"/></g>`;
    if (k > 0) g += `<path d="M-280 20 L220 20 L320 -80 L${f1(330 + lean)} ${f1(-100 - hgt)} L${f1(-180 + lean)} ${f1(-100 - hgt)} L-180 -100 Z" fill="none" stroke="${YEL}" stroke-width="10" stroke-linejoin="round" opacity="${f1(k * (0.75 + 0.25 * Math.sin(t * 7)))}"/>`;
    return g + '</g>';
  }
  // the same generic laptop seen from the FRONT (the screen to camera): base with keyboard dots, lid with a dark panel of
  // illegible blocks (a generic admin page: a side column, rows of bars, one green status block); no text. Bottom centre (x, y).
  function laptopFront(x, y, s, t, o = {}) {
    const gl = o.glow ?? 1, hl = o.hl || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="6" rx="320" ry="24" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-300 0 L300 0 L260 -70 L-260 -70 Z" fill="#3a3d44" stroke="${INK}" stroke-width="5"/>`;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) g += `<rect x="${f1(-220 + c * 32 + r * 4)}" y="${f1(-58 + r * 13)}" width="22" height="9" rx="2" fill="#23252b"/>`;
    g += `<rect x="-60" y="-16" width="120" height="12" rx="3" fill="#2a2c32"/>`;
    g += `<rect x="-270" y="-420" width="540" height="350" rx="10" fill="#2a2c32" stroke="${INK}" stroke-width="6"/>`;
    g += `<rect x="-250" y="-400" width="500" height="312" fill="#0d1118"/>`;
    if (gl > 0) g += wash(0, -250, 420, 260, '#9fd0ff', f1(0.25 * gl));
    // the generic panel: a top bar, a side column, rows of bars, a green block
    g += `<rect x="-250" y="-400" width="500" height="34" fill="#1c2430"/><rect x="-236" y="-390" width="90" height="14" rx="3" fill="#8fa6c0"/>`;
    g += `<rect x="-250" y="-366" width="120" height="278" fill="#141a22"/>`;
    for (let i = 0; i < 7; i++) g += `<rect x="-236" y="${f1(-350 + i * 36)}" width="${f1(70 - (i % 3) * 14)}" height="12" rx="3" fill="#4a5868"/>`;
    for (let i = 0; i < 6; i++) g += `<rect x="-110" y="${f1(-350 + i * 42)}" width="${f1(300 - (i % 4) * 40)}" height="14" rx="3" fill="${i === 1 ? '#c9d2dc' : '#5a6878'}"/>`;
    g += `<rect x="150" y="-350" width="86" height="40" rx="6" fill="#2a7a4a" opacity="${f1(0.7 + 0.3 * Math.sin(t * 4))}"/>`;
    if (hl > 0) g += `<rect x="-120" y="-318" width="330" height="36" rx="6" fill="none" stroke="${YEL}" stroke-width="6" opacity="${f1(hl)}"/>`;
    return g + '</g>';
  }
  // a desktop monitor seen from the front, bottom centre (x, y); o.page 'search' (a white page, a search box that fills as
  // o.fill 0..1) or 'forum' (a header, post blocks with avatar squares and grey lines; o.hl 0..1 outlines the first post
  // in yellow). All text is illegible placeholder bars.
  function monitor(x, y, s, t, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="200" ry="16" fill="#000" opacity="0.4"/>`;
    g += `<rect x="-90" y="-30" width="180" height="30" rx="6" fill="#2a2c32" stroke="${INK}" stroke-width="4"/><rect x="-24" y="-120" width="48" height="94" fill="#2a2c32" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-330" y="-520" width="660" height="410" rx="10" fill="#2a2c32" stroke="${INK}" stroke-width="6"/>`;
    const page = o.page || 'search';
    if (page === 'search') {
      g += `<rect x="-310" y="-500" width="620" height="370" fill="#f4f4f2"/>` + wash(0, -320, 400, 260, '#ffffff', 0.5);
      g += `<rect x="-200" y="-380" width="400" height="56" rx="28" fill="#fff" stroke="#9a9a98" stroke-width="4"/>`;
      const fl = clamp(o.fill || 0, 0, 1); if (fl > 0) g += `<rect x="-176" y="-364" width="${f1(300 * fl)}" height="24" rx="4" fill="#3a3d44"/>`;
      g += `<circle cx="170" cy="-352" r="12" fill="none" stroke="#3a5a8a" stroke-width="5"/><path d="M179 -343 L190 -332" stroke="#3a5a8a" stroke-width="5"/>`;
      if (fl >= 1) for (let i = 0; i < 4; i++) g += `<rect x="-260" y="${f1(-290 + i * 36)}" width="${f1(360 - (i % 2) * 90)}" height="12" rx="3" fill="${i === 0 ? '#2a5aa0' : '#8a8a88'}"/>`;
    } else {
      g += `<rect x="-310" y="-500" width="620" height="370" fill="#e8e6e0"/><rect x="-310" y="-500" width="620" height="44" fill="#3a4a5a"/><rect x="-290" y="-488" width="120" height="18" rx="3" fill="#c9d2dc"/>`;
      for (let i = 0; i < 3; i++) {
        const py = -440 + i * 112;
        g += `<rect x="-296" y="${py}" width="592" height="100" rx="4" fill="#fbfaf6" stroke="#c8c4b8" stroke-width="3"/><rect x="-284" y="${py + 12}" width="56" height="56" fill="#9aa6b4"/>`;
        for (let j = 0; j < 3; j++) g += `<rect x="-214" y="${f1(py + 16 + j * 24)}" width="${f1(380 - j * 60 - i * 30)}" height="10" rx="3" fill="${j === 0 ? '#2a4a7a' : '#8a8a88'}"/>`;
      }
      if (o.hl > 0) g += `<rect x="-302" y="-446" width="604" height="112" rx="6" fill="none" stroke="${YEL}" stroke-width="7" opacity="${f1(o.hl * (0.8 + 0.2 * Math.sin(t * 6)))}"/>`;
    }
    return g + '</g>';
  }
  // a plain wooden library chair seen from behind (an empty seat), bottom centre (x, y)
  function chair(x, y, s) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M-110 0 L-100 -300 M110 0 L100 -300" stroke="#3a2c22" stroke-width="16" stroke-linecap="round"/><rect x="-120" y="-420" width="240" height="140" rx="12" fill="#5a4432" stroke="${INK}" stroke-width="5"/><rect x="-100" y="-392" width="200" height="14" fill="#3a2c22" opacity="0.5"/><rect x="-100" y="-356" width="200" height="14" fill="#3a2c22" opacity="0.5"/></g>`;
  }
  // shelves: a wall of books with colour-blocked spines (no lettering), from (x, y) top-left, w x h
  function shelves(x, y, w, h, seed) {
    const r = R(seed); const COLS = ['#8e2f2a', '#2f4a7a', '#4a6a3a', '#b08a3a', '#5a3a6a', '#2a6a6a', '#9a5a2a', '#d8cfb8', '#3a3a44'];
    let g = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#4a3426" stroke="${INK}" stroke-width="6"/>`;
    for (let yy = y + 20; yy < y + h - 40; yy += 150) {
      g += `<rect x="${x}" y="${yy + 128}" width="${w}" height="14" fill="#2e2018"/>`;
      let xx = x + 12; while (xx < x + w - 30) { const bw = 18 + r() * 26, bh = 90 + r() * 36, col = COLS[Math.floor(r() * COLS.length)]; g += `<rect x="${f1(xx)}" y="${f1(yy + 128 - bh)}" width="${f1(bw)}" height="${f1(bh)}" fill="${col}" stroke="${INK}" stroke-width="2"/><rect x="${f1(xx + 3)}" y="${f1(yy + 128 - bh + 12)}" width="${f1(bw - 6)}" height="4" fill="#000" opacity="0.25"/>`; xx += bw + 2; if (r() < 0.08) xx += 24; }
    }
    return g;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a public library reading room (generic): a back wall of tall shelves, a high arched window on the right with daylight,
    // two hanging lamps, a parquet floor, and in the foreground a long wooden reading table (depth 1.06) that the figures
    // sit behind (figures at depth 1.0, y ~ 1620; props on the table at depth 1.07, y ~ 1175). o.dim 0..1 lowers the light.
    sr32_library(ctx, o = {}) {
      const t = ctx.t, dim = o.dim || 0;
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#6a5a48"/>`;
      back += `<rect x="-300" y="-300" width="${W + 600}" height="520" fill="#d9cfb8"/><rect x="-300" y="210" width="${W + 600}" height="18" fill="#3a2c22"/>`;
      back += shelves(-300, 230, 860, 900, 321) + shelves(560, 230, 520, 900, 322);
      // the window, right: an arch of daylight, panes
      back += `<path d="M1090 460 L1090 1020 L1380 1020 L1380 460 A145 145 0 0 0 1090 460 Z" fill="#dce9f0" stroke="${INK}" stroke-width="8"/>`;
      back += `<path d="M1235 316 L1235 1020 M1090 620 L1380 620 M1090 800 L1380 800" stroke="#5a4a3a" stroke-width="10"/>` + wash(1200, 740, 320, 360, '#fff6dc', 0.5 * (1 - dim));
      // light falling from the window across the shelves and floor
      back += `<path d="M1090 1020 L1380 1020 L1000 1600 L300 1600 Z" fill="#fff6dc" opacity="${f1(0.08 * (1 - dim))}"/>`;
      // hanging lamps
      [300, 760].forEach(x => { back += `<path d="M${x} -300 L${x} 520" stroke="#2a2420" stroke-width="5"/><path d="M${x - 90} 560 L${x + 90} 560 L${x + 60} 500 L${x - 60} 500 Z" fill="#3a4a3a" stroke="${INK}" stroke-width="5"/><ellipse cx="${x}" cy="562" rx="70" ry="12" fill="#fff4c8" opacity="${f1(0.9 - 0.3 * dim)}"/>` + wash(x, 700, 240, 240, '#ffe9a8', 0.28 * (1 - dim * 0.5)); });
      // the floor: parquet
      let floor = `<rect x="-300" y="1130" width="${W + 600}" height="${H}" fill="#6a4e36"/>`;
      for (let yy = 1130; yy < H + 300; yy += 46) floor += `<path d="M-300 ${yy} L${W + 300} ${yy}" stroke="#4a3426" stroke-width="3" opacity="0.6"/>`;
      for (let xx = -300; xx < W + 300; xx += 160) floor += `<path d="M${xx} 1130 L${xx - 120} ${H + 300}" stroke="#4a3426" stroke-width="3" opacity="0.4"/>`;
      floor += `<rect x="-300" y="1130" width="${W + 600}" height="${H}" fill="#05070f" opacity="${f1(0.35 * dim)}"/>`;
      // the reading table, foreground: a top slab and a front apron, two legs; a stack of books at the far right
      let table = `<rect x="-300" y="1160" width="${W + 600}" height="90" rx="6" fill="#8a6a46" stroke="${INK}" stroke-width="6"/><rect x="-300" y="1172" width="${W + 600}" height="24" fill="#a88458" opacity="0.5"/>`;
      table += `<rect x="-300" y="1250" width="${W + 600}" height="60" fill="#5a4230" stroke="${INK}" stroke-width="5"/><rect x="80" y="1310" width="40" height="700" fill="#4a3426"/><rect x="960" y="1310" width="40" height="700" fill="#4a3426"/>`;
      table += `<g transform="translate(1010 1160)"><rect x="-90" y="-26" width="180" height="26" fill="#8e2f2a" stroke="${INK}" stroke-width="3"/><rect x="-80" y="-50" width="170" height="24" fill="#2f4a7a" stroke="${INK}" stroke-width="3"/><rect x="-86" y="-72" width="160" height="22" fill="#d8cfb8" stroke="${INK}" stroke-width="3"/></g>`;
      table += `<rect x="-300" y="1160" width="${W + 600}" height="${H}" fill="#05070f" opacity="${f1(0.3 * dim)}"/>`;
      const dark = dim > 0 ? `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#05070f" opacity="${f1(0.35 * dim)}"/>` : '';
      return { light: { dir: 1, rim: '#bfe0ff', key: '#fff6dc' }, layers: [[0.3, back + dark], [0.95, floor], [1.0, ''], [1.06, table]], dust: true };
    },

    // a dark apartment room at night (generic): a window with city lights at the left, a bare wall, a desk at the right
    // (depth 1.06) with a lamp off; the only light is the laptop's screen
    sr32_room(ctx, o = {}) {
      const t = ctx.t, r = R(331);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#0c0f16"/>`;
      back += `<rect x="-120" y="240" width="520" height="700" fill="#0a1424" stroke="#1c2230" stroke-width="12"/>`;
      for (let i = 0; i < 70; i++) back += `<rect x="${f1(-100 + r() * 480)}" y="${f1(420 + r() * 480)}" width="${f1(6 + r() * 10)}" height="${f1(6 + r() * 12)}" fill="${r() < 0.7 ? '#ffd98a' : '#9fd0ff'}" opacity="${f1(0.4 + 0.5 * r())}"/>`;
      back += `<path d="M-120 240 L400 240 L400 940 L-120 940 Z" fill="none" stroke="#1c2230" stroke-width="12"/><path d="M140 240 L140 940 M-120 590 L400 590" stroke="#1c2230" stroke-width="10"/>`;
      back += `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#1a2436" opacity="0.25"/>`;
      // a shelf with a few dark objects, a poster-sized blank rectangle
      back += `<rect x="620" y="300" width="360" height="460" fill="#161a22" stroke="#222632" stroke-width="6"/><rect x="560" y="820" width="520" height="14" fill="#2a2e38"/><rect x="600" y="760" width="60" height="60" fill="#22262e"/><rect x="700" y="740" width="40" height="80" fill="#22262e"/>`;
      let floor = `<rect x="-300" y="1140" width="${W + 600}" height="${H}" fill="#14171e"/>`;
      let desk = `<rect x="-300" y="1170" width="${W + 600}" height="70" rx="4" fill="#2e2a2a" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1240" width="${W + 600}" height="40" fill="#1e1a1a"/><rect x="120" y="1280" width="36" height="700" fill="#1a1618"/><rect x="900" y="1280" width="36" height="700" fill="#1a1618"/>`;
      desk += `<g transform="translate(980 1170)"><path d="M0 0 L0 -220 L80 -280" stroke="#20242a" stroke-width="12" fill="none"/><path d="M50 -300 L140 -300 L120 -250 L70 -250 Z" fill="#20242a" stroke="${INK}" stroke-width="4"/></g><rect x="-300" y="1170" width="${W + 600}" height="110" fill="#000" opacity="0.2"/>`;
      return { light: { dir: -1, rim: '#9fd0ff', key: '#9fd0ff' }, layers: [[0.3, back], [0.95, floor], [1.0, ''], [1.06, desk]] };
    },

    // a San Francisco hill street by day (generic): a sloping road, pastel bay-window row houses stepping up the hill, a
    // small civic building with a plain 'LIBRARY' sign over its door at the right, a tree, a street lamp, a sidewalk
    sr32_street(ctx, o = {}) {
      const t = ctx.t, r = R(341);
      let sky = `<defs><linearGradient id="srsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7aa6d0"/><stop offset="1" stop-color="#e8eef2"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#srsky)"/>` + wash(300, 200, 500, 200, '#ffffff', 0.4);
      // row houses stepping up to the left (the hill)
      let houses = '';
      [[-300, 760, 300, '#e8d8c0'], [-20, 700, 300, '#d8c8d8'], [260, 640, 320, '#c8d8d0']].forEach(([x, y, w, col], i) => {
        houses += `<rect x="${x}" y="${y}" width="${w}" height="${1200 - y}" fill="${col}" stroke="${INK}" stroke-width="5"/><rect x="${x}" y="${y - 30}" width="${w}" height="30" fill="#8a7a6a" stroke="${INK}" stroke-width="4"/>`;
        for (let yy = y + 60; yy < 1040; yy += 180) houses += `<path d="M${x + 60} ${yy} L${x + 90} ${yy - 20} L${x + 210} ${yy - 20} L${x + 240} ${yy} L${x + 240} ${yy + 120} L${x + 210} ${yy + 140} L${x + 90} ${yy + 140} L${x + 60} ${yy + 120} Z" fill="#dfe8ee" stroke="${INK}" stroke-width="4"/><path d="M${x + 90} ${yy - 20} L${x + 90} ${yy + 140} M${x + 210} ${yy - 20} L${x + 210} ${yy + 140}" stroke="${INK}" stroke-width="3"/>`;
        houses += `<rect x="${x + 20}" y="1080" width="70" height="120" fill="#5a4a3a" stroke="${INK}" stroke-width="4"/>`;
      });
      // the library: a low civic building at the right, a wide door with steps, a plain sign (generic lettering only)
      houses += `<rect x="580" y="620" width="800" height="580" fill="#d9cfb8" stroke="${INK}" stroke-width="6"/><rect x="580" y="590" width="800" height="40" fill="#8a7a6a" stroke="${INK}" stroke-width="4"/>`;
      houses += `<rect x="620" y="680" width="130" height="200" fill="#9fc0d8" stroke="${INK}" stroke-width="4"/><rect x="1010" y="680" width="130" height="200" fill="#9fc0d8" stroke="${INK}" stroke-width="4"/>`;
      houses += `<rect x="800" y="900" width="170" height="300" fill="#3a3a44" stroke="${INK}" stroke-width="5"/><rect x="810" y="920" width="150" height="160" fill="#8fb0c8" opacity="0.6"/>`;
      houses += `<rect x="730" y="760" width="310" height="70" rx="6" fill="#2a3a4a" stroke="${INK}" stroke-width="4"/><text x="885" y="810" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="42" fill="#f4efe4">LIBRARY</text>`;
      houses += `<rect x="760" y="1200" width="250" height="20" fill="#9a9088" stroke="${INK}" stroke-width="3"/><rect x="740" y="1220" width="290" height="20" fill="#8a8078" stroke="${INK}" stroke-width="3"/>`;
      // a street tree at the left and a lamp post
      houses += `<path d="M120 1240 L120 1000" stroke="#4a3426" stroke-width="18"/><ellipse cx="120" cy="920" rx="150" ry="130" fill="#4a7a3c" stroke="${INK}" stroke-width="5"/><ellipse cx="80" cy="880" rx="90" ry="80" fill="#5a8a48"/>`;
      houses += `<rect x="500" y="860" width="12" height="380" fill="#2a2e36" stroke="${INK}" stroke-width="3"/><path d="M506 860 L506 820 L540 820" stroke="#2a2e36" stroke-width="10" fill="none"/><ellipse cx="546" cy="828" rx="18" ry="10" fill="#dfe8ee" stroke="${INK}" stroke-width="3"/>`;
      // the sidewalk and the sloping road
      let road = `<rect x="-300" y="1240" width="${W + 600}" height="120" fill="#b8b4ac" stroke="${INK}" stroke-width="4"/>`;
      for (let xx = -300; xx < W + 300; xx += 180) road += `<path d="M${xx} 1240 L${xx} 1360" stroke="#8a867e" stroke-width="3"/>`;
      road += `<path d="M-300 1360 L${W + 300} 1360 L${W + 300} ${H + 300} L-300 ${H + 300} Z" fill="#4a4c52"/><path d="M-300 1500 L${W + 300} 1440" stroke="#d8c070" stroke-width="8" stroke-dasharray="70 50" opacity="0.6"/>`;
      for (let i = 0; i < 6; i++) road += `<ellipse cx="${f1(-200 + r() * 1500)}" cy="${f1(1420 + r() * 500)}" rx="${f1(40 + r() * 60)}" ry="${f1(8 + r() * 10)}" fill="#0a0a0c" opacity="0.2"/>`;
      return { light: { dir: 1, rim: '#ffffff', key: '#fff6dc' }, layers: [[0.05, sky], [0.4, houses], [1.0, road]] };
    }
  });

  // the hero laptop's framing in the first and the last shot (the loop): on the reading table, big and centred
  const HERO = { x: 380, y: 1176, s: 1.0 };

  E.registerScenes({
    // 1 - hook: the library; the open laptop on the table, big and centred from the first frame, its screen glow on the
    //     anonymous silhouette typing behind it; a patron reads at the right. The headline is burned in by the engine
    //     (until ~3.2 s), so nothing of ours sits in y 380-720 before that. On "fake fight" two agents walk in behind;
    //     on "caught" the laptop outline flashes and the silhouette stops typing.
    sr32_hook(ctx) {
      const t = ctx.t, silk = WT(ctx, 0, 0, 0.2), empire = WT(ctx, 0, 5, 1.6), anon = WT(ctx, 0, 8, 2.6), l1 = LS(ctx, 1, 3.6), fake = WT(ctx, 1, 1, 3.8), lib = WT(ctx, 1, 6, 4.7), caught = WT(ctx, 1, 7, 5.1);
      return E.cine.shot(ctx, {
        set: 'sr32_library', setOpts: { dim: 0.15 }, grade: 'cold',
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 0, y: 50, z: 1.07 }, handheld: 1.0 },
        shake: [{ at: caught, amp: 4 }],
        figures: [
          { id: 'sr32_ulbricht', x: 720, y: 1620, scale: 0.9, dir: -1, turn: 0.5, pose: 'sit_type', expr: 'neutral', silhouette: 'cool', gaze: [-0.6, 0.4],
            keys: [...typing(0.05, caught - 0.15), { at: caught - 0.1, pose: 'sit', headTurn: 0.6, gaze: [0.9, -0.2], dur: 0.3 }, { at: caught + 0.8, pose: 'sit_slumped', dur: 0.5 }] },
          { id: 'sr32_patron', x: 1020, y: 1590, scale: 0.72, dir: -1, turn: 0.5, pose: 'sit_read', expr: 'focused', depth: 0.97, keys: [{ at: empire, pose: 'sit_read', gaze: [-0.4, 0.2], dur: 0.4 }, { at: lib, pose: 'sit', expr: 'worried', headTurn: 0.5, gaze: [-0.9, -0.2], dur: 0.4 }] },
          { id: 'agent_a', x: 180, y: 1130, scale: 0.46, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', depth: 0.6, show: [fake - 0.3], walk: { from: -60, to: 180, at: fake - 0.2, dur: Math.max(0.6, caught - fake + 0.2), cadence: 6.0 }, keys: [{ at: caught + 0.1, pose: 'stand_tense', dur: 0.4 }] },
          { id: 'agent_b', x: 300, y: 1130, scale: 0.44, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', depth: 0.6, show: [fake - 0.1], walk: { from: 60, to: 300, at: fake, dur: Math.max(0.6, caught - fake + 0.3), cadence: 6.0 }, keys: [{ at: caught + 0.2, pose: 'stand', dur: 0.4 }] }
        ],
        props: [{ depth: 1.07, svg: tt => laptop(HERO.x, HERO.y, HERO.s, tt, { open: 1, glow: 0.9, outline: 0.8 * seg(tt, caught - 0.1, caught + 0.3) * (1 - seg(tt, caught + 1.2, caught + 1.8)) }) }],
        overlays: [
          { type: 'label', at: 3.3, x: 60, y: 432, text: 'SAN FRANCISCO · 1 OCTOBER 2013', fs: 40, sub: 'A public library branch · a generic drawing' }
        ],
        tag: LIKENESS
      });
    },

    // 2 - the stakes by 0:10: a dark apartment at night, the silhouette at a desk lit only by the laptop; the card gives
    //     the years, Tor, Bitcoin and the DOJ sales figure, row by row on the spoken words
    sr32_market(ctx) {
      const t = ctx.t, ran = WT(ctx, 0, 1, 0.3), tor = WT(ctx, 0, 3, 0.8), bit = WT(ctx, 0, 5, 1.3), over = WT(ctx, 0, 6, 1.8), mil = WT(ctx, 0, 8, 2.4), sales = WT(ctx, 0, 10, 3.0);
      return E.cine.shot(ctx, {
        set: 'sr32_room', grade: 'night',
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 60, z: 1.16 }, handheld: 0.8 },
        figures: [{ id: 'sr32_ulbricht', x: 760, y: 1630, scale: 0.95, dir: -1, turn: 0.55, pose: 'sit_type', expr: 'neutral', silhouette: 'cool', gaze: [-0.6, 0.4],
          keys: [...typing(0.05, mil - 0.1), { at: mil, pose: 'sit', gaze: [-0.8, 0.3], dur: 0.4 }, { at: sales + 0.3, pose: 'sit_type', dur: 0.4 }] }],
        props: [{ depth: 1.07, svg: tt => laptop(360, 1186, 0.86, tt, { open: 1, glow: 1.0 }) }],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: '2011-2013 · A DARK-WEB MARKET', fs: 40, sub: 'Seized by the FBI, October 2013' },
          { type: 'card', at: tor - 0.1, x: 60, y: 550, w: 700, rows: [{ text: 'RAN ON TOR · PAID IN BITCOIN', fs: 32, colour: MUTE }, { text: 'OVER $200 MILLION IN SALES', fs: 44, colour: RED, at: over - 0.1 }, { text: 'U.S. DEPARTMENT OF JUSTICE, 2015', fs: 24, colour: MUTE, at: sales }] }
        ],
        tag: LIKENESS
      });
    },

    // 3 - an IRS criminal investigator at an office desk, typing a search on a monitor (a generic white page); the card says
    //     the operator was known only as Dread Pirate Roberts, then that the investigator started with a Google search
    sr32_google(ctx) {
      const t = ctx.t, irs = WT(ctx, 0, 1, 0.3), agent = WT(ctx, 0, 2, 0.6), started = WT(ctx, 0, 3, 1.0), goog = WT(ctx, 0, 6, 1.9), srch = WT(ctx, 0, 7, 2.3);
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'warm', cam: { from: { x: -20, y: 20, z: 0.98 }, to: { x: 20, y: 40, z: 1.04 }, handheld: 0.7 },
        figures: [{ id: 'sr32_irs', x: 300, y: 1650, scale: 0.85, dir: 1, turn: 0.5, pose: 'sit_read', expr: 'focused', gaze: [0.6, 0.3],
          keys: [{ at: irs, pose: 'sit', expr: 'determined', gaze: [0.7, 0.2], dur: 0.3 }, ...typing(started, srch + 0.4), { at: srch + 0.5, pose: 'sit', expr: 'focused', gaze: [0.8, 0.1], dur: 0.4 }] }],
        props: [{ depth: 1.07, svg: tt => monitor(720, 1206, 0.9, tt, { page: 'search', fill: seg(tt, goog - 0.2, srch + 0.5) }) }],
        overlays: [
          { type: 'label', at: 0.1, until: started + 0.2, x: 60, y: 432, text: "KNOWN ONLY AS 'DREAD PIRATE ROBERTS'", fs: 34, sub: 'The operator, 2013' },
          { type: 'card', at: irs - 0.05, x: 60, y: 560, w: 700, rows: [{ text: 'IRS CRIMINAL INVESTIGATION', fs: 34, colour: RED }, { text: 'STEP ONE: A GOOGLE SEARCH', fs: 32, at: goog - 0.1 }] }
        ],
        tag: TAG
      });
    },

    // 4 - the clue: close on the monitor, now a generic forum page; the first post lights up in yellow on "altoid"; the
    //     investigator leans in and points on "advertised"
    sr32_post(ctx) {
      const t = ctx.t, y2011 = WT(ctx, 0, 1, 0.3), post = WT(ctx, 0, 3, 0.9), alt = WT(ctx, 0, 5, 1.6), adv = WT(ctx, 0, 6, 2.1), silk = WT(ctx, 0, 7, 2.6);
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'warm', cam: { keys: [{ at: 0, x: 60, y: 90, z: 1.2 }, { at: alt - 0.2, x: 90, y: 110, z: 1.3, dur: 1.0 }], handheld: 0.9 },
        figures: [{ id: 'sr32_irs', x: 240, y: 1790, scale: 1.18, dir: 1, turn: 0.6, pose: 'sit', expr: 'focused', gaze: [0.8, -0.2],
          keys: [{ at: post, pose: 'sit_read', expr: 'focused', dur: 0.4 }, { at: alt - 0.1, pose: 'sit', expr: 'realise', gaze: [0.9, 0.1], dur: 0.3 }, { at: adv, pose: 'point', expr: 'realise', gaze: [0.9, 0.1], dur: 0.4 }] }],
        props: [{ depth: 1.07, svg: tt => monitor(760, 1206, 1.15, tt, { page: 'forum', hl: seg(tt, alt - 0.15, alt + 0.25) }) }],
        overlays: [
          { type: 'card', at: y2011 - 0.1, x: 60, y: 390, w: 720, rows: [{ text: 'JANUARY 2011 · A FORUM POST', fs: 36, colour: RED }, { text: "USERNAME: 'ALTOID'", fs: 40, at: alt - 0.1 }, { text: 'ADVERTISING THE NEW SILK ROAD SITE', fs: 28, colour: MUTE, at: adv }] }
        ],
        tag: TAG
      });
    },

    // 5 - the irony: the task-force room; the investigator pins the thread on the evidence wall on "Gmail", the analyst
    //     steps back on the name; the card gives the real name (the address itself is never shown)
    sr32_email(ctx) {
      const t = ctx.t, later = WT(ctx, 0, 0, 0.2), gave = WT(ctx, 0, 2, 0.8), own = WT(ctx, 0, 4, 1.3), gm = WT(ctx, 0, 5, 1.6), addr = WT(ctx, 0, 6, 1.9), ross = WT(ctx, 0, 7, 2.6), ulb = WT(ctx, 0, 8, 2.9);
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: {}, grade: 'cold', dust: true,
        cam: { from: { x: 20, y: -40, z: 1.0 }, to: { x: -20, y: -60, z: 1.08 }, handheld: 0.8 },
        shake: [{ at: ross, amp: 4 }],
        figures: [
          { id: 'sr32_irs', x: 300, y: 1700, scale: 0.98, dir: 1, turn: 0.5, pose: 'read', expr: 'focused', keys: [{ at: gave, pose: 'examine', dur: 0.4 }, { at: gm, pose: 'point_up', expr: 'realise', gaze: [0.8, -0.6], dur: 0.4 }, { at: ross, pose: 'point', expr: 'determined', gaze: [0.8, -0.3], dur: 0.4 }] },
          { id: 'analyst', x: 820, y: 1720, scale: 0.98, dir: -1, turn: 0.5, pose: 'stand', expr: 'focused', keys: [{ at: own, pose: 'examine', dur: 0.4 }, { at: ross - 0.1, pose: 'stand', expr: 'realise', gaze: [-0.8, -0.4], dur: 0.4 }, { at: ulb + 0.4, pose: 'point', expr: 'determined', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'card', at: later, x: 60, y: 600, w: 760, rows: [{ text: "A LATER POST BY 'ALTOID'", fs: 30, colour: MUTE }, { text: 'A GMAIL ADDRESS · HIS OWN NAME', fs: 34, colour: RED, at: gm - 0.05 }, { text: 'ROSS ULBRICHT', fs: 54, colour: RED, at: ross - 0.05 }] }
        ],
        tag: TAG
      });
    },

    // 6 - the problem: the street outside the library by day; two plain-clothes agents on the sidewalk, one walks to the
    //     library door on "open"; the card explains the encryption trap
    sr32_encrypt(ctx) {
      const t = ctx.t, close = WT(ctx, 0, 0, 0.2), lap = WT(ctx, 0, 2, 0.7), enc = WT(ctx, 0, 6, 1.6), agents = WT(ctx, 0, 7, 2.2), needed = WT(ctx, 0, 8, 2.6), open = WT(ctx, 0, 10, 3.2);
      return E.cine.shot(ctx, {
        set: 'sr32_street', grade: 'warm', cam: { from: { x: 30, y: 10, z: 1.0 }, to: { x: -30, y: -10, z: 1.06 }, handheld: 1.3 },
        figures: [
          { id: 'sr32_agent', x: 420, y: 1560, scale: 0.6, dir: 1, turn: 0.5, pose: 'stand', expr: 'focused', gaze: [0.8, -0.3], keys: [{ at: close, pose: 'arms_crossed', dur: 0.4 }, { at: enc, pose: 'hand_to_face', expr: 'stern', dur: 0.4 }, { at: agents, pose: 'walk', expr: 'determined', dur: 0.3 }, { at: open + 0.3, pose: 'stand_tense', dur: 0.4 }], walk: { from: 420, to: 860, at: agents, dur: Math.max(0.8, open - agents + 0.4), cadence: 6.0 } },
          { id: 'agent_a', x: 250, y: 1520, scale: 0.56, dir: 1, turn: 0.5, pose: 'stand', expr: 'focused', depth: 0.98, gaze: [0.8, -0.2], keys: [{ at: lap, pose: 'point', dur: 0.4 }, { at: needed, pose: 'stand_tense', expr: 'stern', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: '1 OCTOBER 2013 · SAN FRANCISCO', fs: 40, sub: 'Outside a public library branch' },
          { type: 'card', at: close - 0.05, x: 60, y: 600, w: 660, rows: [{ text: 'HIS LAPTOP: CLOSE THE LID', fs: 34, colour: RED }, { text: 'AND IT ENCRYPTS', fs: 34, colour: RED, at: enc - 0.1 }, { text: 'AGENTS NEEDED IT OPEN AND LOGGED IN', fs: 28, at: needed - 0.05 }] }
        ],
        tag: TAG
      });
    },

    // 7 - THE HOW (music drop): the library, wider. Two agents walk in behind the silhouette and stage a quarrel on "loud
    //     fight" (pointing, tense); the silhouette turns on "looked up"; the plain-clothes agent steps in from the right and
    //     the laptop lifts off the table on "grabbed"; on "logged in" a front view of the laptop fills the foreground: a
    //     generic admin panel, and a card names the account
    sr32_fight(ctx) {
      const t = ctx.t, two = WT(ctx, 0, 1, 0.3), staged = WT(ctx, 0, 3, 0.9), loud = WT(ctx, 0, 5, 1.5), fight = WT(ctx, 0, 6, 1.8), behind = WT(ctx, 0, 7, 2.1),
        l1 = LS(ctx, 1, 3.4), looked = WT(ctx, 1, 1, 3.6), up = WT(ctx, 1, 2, 3.9), agent = WT(ctx, 1, 4, 4.4), grabbed = WT(ctx, 1, 5, 4.7), lap = WT(ctx, 1, 7, 5.2),
        l2 = LS(ctx, 2, 6.2), logged = WT(ctx, 2, 1, 6.4), admin = WT(ctx, 2, 5, 7.3);
      const lift = tt => ease.out(seg(tt, grabbed - 0.05, grabbed + 0.4));
      const front = tt => { const k = ease.out(seg(tt, logged - 0.2, logged + 0.4)); if (k <= 0) return ''; return `<g opacity="${f1(k)}" transform="translate(0 ${f1((1 - k) * 80)})">${laptopFront(540, 1150, 1.05, tt, { glow: 1, hl: seg(tt, admin - 0.2, admin + 0.3) })}</g>`; };
      return E.cine.shot(ctx, {
        set: 'sr32_library', setOpts: { dim: 0.1 }, grade: 'cold',
        cam: { keys: [{ at: 0, x: 0, y: 0, z: 0.96 }, { at: looked - 0.3, x: 10, y: 30, z: 1.06, dur: 1.0 }, { at: logged - 0.3, x: 0, y: 40, z: 1.1, dur: 0.8 }], handheld: 1.6 },
        shake: [{ at: fight, amp: 5 }, { at: grabbed, amp: 5 }, { at: admin, amp: 3 }],
        figures: [
          { id: 'sr32_ulbricht', x: 640, y: 1620, scale: 0.9, dir: -1, turn: 0.5, pose: 'sit_type', expr: 'neutral', silhouette: 'cool', gaze: [-0.6, 0.4], show: [0, logged + 0.1],
            keys: [...typing(0.05, looked - 0.1), { at: looked, pose: 'sit', headTurn: 0.8, gaze: [0.9, -0.5], dur: 0.3 }, { at: grabbed, pose: 'stand_tense', headTurn: 0, gaze: [0.9, 0], dur: 0.35 }, { at: lap + 0.2, pose: 'hands_behind', dur: 0.5 }] },
          { id: 'agent_a', x: 820, y: 1125, scale: 0.68, dir: 1, turn: 0.55, pose: 'walk', expr: 'focused', depth: 0.9, show: [two - 0.3, logged + 0.1], walk: { from: 560, to: 820, at: two - 0.2, dur: Math.max(0.6, staged - two + 0.4), cadence: 6.0 },
            keys: [{ at: staged, pose: 'stand', expr: 'stern', dur: 0.3 }, { at: loud, pose: 'point', expr: 'stern', gaze: [0.9, 0], dur: 0.3 }, { at: fight + 0.3, pose: 'stand_tense', expr: 'stern', dur: 0.3 }, { at: behind + 0.2, pose: 'point', dur: 0.3 }, { at: looked + 0.4, pose: 'stand_tense', dur: 0.4 }] },
          { id: 'agent_b', x: 1010, y: 1125, scale: 0.66, dir: -1, turn: 0.55, pose: 'walk', expr: 'focused', depth: 0.9, show: [two - 0.1, logged + 0.1], walk: { from: 1260, to: 1010, at: two, dur: Math.max(0.6, staged - two + 0.5), cadence: 6.0 },
            keys: [{ at: staged + 0.1, pose: 'stand', expr: 'stern', dur: 0.3 }, { at: loud + 0.15, pose: 'stand_tense', expr: 'stern', gaze: [-0.9, 0], dur: 0.3 }, { at: fight + 0.15, pose: 'read', expr: 'stern', dur: 0.3 }, { at: behind + 0.35, pose: 'stand_tense', dur: 0.3 }, { at: looked + 0.5, pose: 'stand', dur: 0.4 }] },
          { id: 'sr32_agent', x: 900, y: 1660, scale: 0.98, dir: -1, turn: 0.5, pose: 'walk', expr: 'determined', depth: 1.02, show: [agent - 0.35, logged + 0.1], walk: { from: 1300, to: 900, at: agent - 0.3, dur: Math.max(0.5, grabbed - agent + 0.3), cadence: 7.0 },
            keys: [{ at: grabbed - 0.05, pose: 'examine', expr: 'determined', gaze: [-0.8, 0.4], dur: 0.3 }, { at: grabbed + 0.4, pose: 'stand_tense', expr: 'stern', dur: 0.3 }, { at: lap + 0.3, pose: 'point', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.07, svg: tt => tt < logged + 0.1 ? laptop(300, 1176, 1.0, tt, { open: 1, glow: 0.9, lift: lift(tt), outline: 0.8 * seg(tt, grabbed - 0.1, grabbed + 0.3) * (1 - seg(tt, grabbed + 0.9, grabbed + 1.4)) }) : '' },
          { depth: 1.1, svg: front }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: looked - 0.1, x: 60, y: 432, text: 'TWO AGENTS · A STAGED QUARREL', fs: 40, sub: 'Behind him, in the library' },
          { type: 'card', at: looked - 0.05, until: logged - 0.1, x: 60, y: 390, w: 700, rows: [{ text: 'HE LOOKED UP', fs: 40, colour: RED }, { text: 'AN AGENT TOOK THE OPEN LAPTOP', fs: 30, at: grabbed - 0.05 }] },
          { type: 'card', at: logged - 0.1, x: 60, y: 390, w: 780, rows: [{ text: 'LOGGED IN AS THE ADMIN', fs: 44, colour: RED }, { text: "ACCOUNT: 'DREAD PIRATE ROBERTS'", fs: 32, at: admin - 0.05 }, { text: 'THE SCREEN WAS PHOTOGRAPHED BEFORE THE ARREST', fs: 22, colour: MUTE, at: admin + 0.6 }] }
        ],
        tag: LIKENESS
      });
    },

    // 8 - the outcome: the verdict and the sentence (February and May 2015), then the pardon and release (January 2025),
    //     stated as fact on the card; the cliff impact sits in the pause between the two lines
    sr32_verdict(ctx) {
      const conv = WT(ctx, 0, 2, 0.5), seven = WT(ctx, 0, 5, 1.3), life = WT(ctx, 0, 7, 2.0), l1 = LS(ctx, 1, 3.4), pard = WT(ctx, 1, 4, 4.2), rel = WT(ctx, 1, 6, 4.8);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.1 }, handheld: 0.5 },
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.33, keys: [{ at: conv - 0.2, pose: 'gavel', dur: 0.3 }, { at: conv + 0.25, pose: 'sit', dur: 0.15 }, { at: l1, pose: 'sit_read', dur: 0.5 }] },
          { id: 'sr32_ulbricht', x: 900, y: 1770, scale: 0.95, dir: -1, turn: 0.15, pose: 'stand', silhouette: 'cool', keys: [{ at: conv, pose: 'hands_together', dur: 0.4 }, { at: life, pose: 'bowed', dur: 0.6 }, { at: pard, pose: 'stand', dur: 0.5 }, { at: rel + 0.2, pose: 'walk', dur: 0.4 }],
            walk: { from: 900, to: 1320, at: rel + 0.2, dur: 1.4, cadence: 5.5 } }
        ],
        overlays: [
          { type: 'card', at: 0.15, x: 40, y: 860, w: 700, rows: [{ text: 'FEB 2015 · GUILTY ON ALL 7 COUNTS', fs: 30, colour: RED, at: conv - 0.05 }, { text: 'MAY 2015 · LIFE WITHOUT PAROLE', fs: 34, at: life - 0.05 }, { text: '21 JAN 2025 · PARDONED BY TRUMP', fs: 28, colour: MUTE, at: pard - 0.05 }, { text: 'RELEASED AFTER 11 YEARS', fs: 28, colour: MUTE, at: rel }] }
        ],
        tag: LIKENESS
      });
    },

    // 9 - callback on the hero object (the first frame's framing): the open laptop on the reading table, the chair behind
    //     it now empty, a small evidence tag on its corner; the plain-clothes agent stands at the right and looks it over.
    //     The engine burns the end question over the last 3.2 s at y 520, so nothing of ours sits in y 380-720; the last
    //     frame loops to the first.
    sr32_end(ctx) {
      const t = ctx.t, built = WT(ctx, 0, 0, 0.2), anon = WT(ctx, 0, 2, 0.7), undone = WT(ctx, 0, 3, 1.4), fake = WT(ctx, 0, 7, 2.4), fight = WT(ctx, 0, 8, 2.7);
      return E.cine.shot(ctx, {
        set: 'sr32_library', setOpts: { dim: 0.15 }, grade: 'cold',
        cam: { from: { x: 0, y: 50, z: 1.07 }, to: { x: 0, y: 30, z: 1.0 }, handheld: 0.6 },
        figures: [
          { id: 'sr32_agent', x: 980, y: 1640, scale: 0.9, dir: -1, turn: 0.5, pose: 'stand', expr: 'focused', gaze: [-0.8, 0.3], keys: [{ at: built, pose: 'examine', dur: 0.4 }, { at: undone, pose: 'point', expr: 'determined', gaze: [-0.9, 0.2], dur: 0.4 }, { at: fight + 0.3, pose: 'arms_crossed', expr: 'neutral', dur: 0.5 }] },
          { id: 'sr32_patron', x: 120, y: 1600, scale: 0.78, dir: 1, turn: 0.5, pose: 'sit', expr: 'worried', depth: 0.99, gaze: [0.8, 0.1], keys: [{ at: anon, pose: 'hand_to_face', dur: 0.5 }, { at: fake, pose: 'sit_read', expr: 'neutral', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.98, svg: tt => chair(720, 1480, 0.9) },
          { depth: 1.07, svg: tt => laptop(HERO.x, HERO.y, HERO.s, tt, { open: 1, glow: 0.9, tag: seg(tt, built - 0.1, built + 0.4), outline: 0.8 * seg(tt, fake - 0.1, fake + 0.3) * (1 - seg(tt, fight + 0.6, fight + 1.2)) }) }
        ],
        overlays: [],
        tag: LIB
      });
    }
  });
})();
