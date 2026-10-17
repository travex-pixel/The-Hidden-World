/* Case File 70 (premium look, engagement v3: TRENDING + SEARCH, THE LIST FORMAT): the finger in the Wendy's chili, San
   Jose, March 2005, told as three escalating beats of the one case. 1 THE CLAIM: Anna Ayala said she bit into a fingertip
   in her chili (the coroner said it had not been cooked); 2 THE COST: sales fell, workers lost jobs, the charges put the
   loss at $2.5 million; 3 WHOSE FINGER: a co-worker of her husband, Jaime Plascencia, lost it in a truck tailgate at a Las
   Vegas asphalt company in December 2004, and court papers say the husband paid $100 for it. Sentenced January 2006: Ayala
   9 years, Plascencia 12 years 4 months.
   Structure: frame 1 = the HERO (a bowl of chili big and centred on a booth table, a paper napkin sliding across it, her
   silhouette behind, the camera already pushing) with the headline; item 1 in the same restaurant, wider (she stands and
   points; the manager hurries in; the FUN FACT); item 2 outside the restaurant at night (a crew member walks out with her
   apron; the $2,500,000 counter); the LESSON (a young man on his sofa frowning at a takeaway, captions off) BEFORE item 3;
   item 3 = the biggest reveal in an asphalt yard at dusk (a dump truck's tailgate swings shut; the husband's silhouette
   walks past); the $100 at a kitchen table at night; the spoken share line in the lab (an evidence bag, contents
   blurred); the punchline back at the hero bowl in frame 1's framing (the loop).
   Smoothness (owner, 44+): cuts and dissolves, one push, one zoom (the end); one slow camera move per shot; settle only on
   the hero dolly-ins (first frame, the reveal, the last frame); one impact, no shake, no handheld.
   Screen direction: people move left to right (the manager, the crew member, the husband); the napkin slides right to left
   in both the first and the last frame.
   Look: episode.look = 'premium', one warm-night palette (shadow #1a1e26, mid #c8b89e, accent #d9893a). The ONLY strongly
   coloured object is the chili bowl's paprika band (props marked accent: true).
   Content rules: Ayala and Plascencia are real people (pleaded guilty, sentenced 2006): dark silhouettes only, tagged NOT
   A LIKENESS. The co-worker was never charged: not named, not shown. The finger is NEVER shown (the napkin covers the
   bowl; the evidence bag's contents are blurred); no injury is shown (nobody is near the tailgate). Wendy's appears only
   as plain text: no logo, mascot, packaging, uniform or decor artwork; the restaurant, bowl, takeaway box and yard are
   generic. New environments (E.registerSets): wf70_diner (a generic fast-food booth), wf70_front (a generic restaurant
   front at night), wf70_room (an apartment living room at night), wf70_yard (an asphalt yard at dusk); plus the engine's
   kitchen_night and lab. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#d9893a';

  // ---------- THE HERO: a bowl of chili seen from a little above (generic paper bowl, a plain paprika band = the accent),
  // beans and onion specks, steam; a paper napkin draped over most of it (nap 0..1 = how far it has slid across, from
  // the right). Centred on the rim at (x, y); ~500 wide at s = 1. Nothing is ever drawn under the napkin.
  function bowl(x, y, s, t, nap = 1, glow = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    g += `<ellipse cx="0" cy="182" rx="250" ry="30" fill="#000" opacity="0.4"/>`;
    if (glow > 0) g += wash(0, 40, 340, 200, ACC, f1(0.12 * glow));
    // the body: tapering paper bowl with a band
    g += `<path d="M-250 0 Q-236 120 -168 172 Q0 196 168 172 Q236 120 250 0 Z" fill="#ece4d4" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-242 48 Q0 100 242 48 Q236 76 222 98 Q0 146 -222 98 Q-236 76 -242 48 Z" fill="${ACC}"/>`;
    g += `<path d="M-200 136 Q0 170 200 136" stroke="#c8bca6" stroke-width="5" fill="none"/>`;
    // the rim and the chili surface
    g += `<ellipse cx="0" cy="0" rx="250" ry="80" fill="#f4eee2" stroke="${INK}" stroke-width="6"/>`;
    g += `<ellipse cx="0" cy="4" rx="230" ry="66" fill="#6e2c18"/><ellipse cx="-20" cy="-6" rx="190" ry="44" fill="#843a20" opacity="0.7"/>`;
    const r = R(7001);
    for (let i = 0; i < 46; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()), bx = Math.cos(a) * 205 * d, by = 4 + Math.sin(a) * 56 * d, k = r();
      g += k < 0.5 ? `<ellipse cx="${f1(bx)}" cy="${f1(by)}" rx="${f1(9 + r() * 5)}" ry="${f1(5 + r() * 3)}" fill="${k < 0.25 ? '#3a160c' : '#9a4a26'}" transform="rotate(${f1(r() * 60 - 30)} ${f1(bx)} ${f1(by)})"/>`
        : `<rect x="${f1(bx)}" y="${f1(by)}" width="${f1(6 + r() * 6)}" height="${f1(4 + r() * 3)}" fill="#efe2bc" opacity="0.85"/>`;
    }
    g += `<path d="M-150 -30 Q-60 -48 40 -40" stroke="#c8784a" stroke-width="5" opacity="0.45" fill="none"/>`;
    // a plastic spoon standing in the bowl (right)
    g += `<path d="M150 -10 L300 -170" stroke="#f2f2ee" stroke-width="16" stroke-linecap="round"/><path d="M150 -10 L300 -170" stroke="#c8c8c2" stroke-width="4" stroke-linecap="round" transform="translate(4 2)"/>`;
    // steam
    for (let i = 0; i < 3; i++) { const sx = -120 + i * 110, ph = t * 0.6 + i * 0.37, op = 0.16 * (0.5 + 0.5 * Math.sin(ph * 3)); g += `<path d="M${sx} -40 q-30 -60 0 -120 q30 -60 0 -120" stroke="#ffffff" stroke-width="14" stroke-linecap="round" fill="none" opacity="${f1(op)}" filter="url(#cineSoft)" transform="translate(${f1(10 * Math.sin(ph * 2))} ${f1(-20 * ((ph % 1)))})"/>`; }
    // the napkin: a folded paper napkin slid in from the right, draped over the rim; its left edge at ax
    const ax = lerp(300, -236, clamp(nap, 0, 1));
    g += `<path d="M${f1(ax)} -64 L${f1(ax + 360)} -86 L${f1(ax + 400)} 70 Q${f1(ax + 200)} 104 ${f1(ax + 6)} 86 Q${f1(ax - 18)} 10 ${f1(ax)} -64 Z" fill="#000" opacity="0.18" transform="translate(6 14)"/>`;
    g += `<path d="M${f1(ax)} -64 L${f1(ax + 360)} -86 L${f1(ax + 400)} 70 Q${f1(ax + 200)} 104 ${f1(ax + 6)} 86 Q${f1(ax - 18)} 10 ${f1(ax)} -64 Z" fill="#f6f1e6" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    g += `<path d="M${f1(ax + 120)} -72 Q${f1(ax + 110)} 10 ${f1(ax + 132)} 96 M${f1(ax + 250)} -80 Q${f1(ax + 262)} 0 ${f1(ax + 270)} 92" stroke="#d8d0be" stroke-width="5" fill="none"/>`;
    g += `<path d="M${f1(ax + 10)} -40 L${f1(ax + 350)} -60" stroke="#ffffff" stroke-width="4" opacity="0.7"/>`;
    return g + '</g>';
  }
  // a dark silhouette hand + sleeve reaching in from the right to the napkin's right edge (her hand; no features)
  function silHand(x, y, s, rot = 8) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${sc(s)})"><path d="M60 -40 L520 -90 L540 70 L60 50 Z" fill="#1a1c22" stroke="#0a0b0e" stroke-width="5"/>` +
      `<path d="M70 -46 Q20 -60 -40 -40 Q-80 -20 -70 0 Q-40 10 0 0 Q-30 30 -20 50 Q20 60 70 46 Z" fill="#20232a" stroke="#0a0b0e" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M540 -90 L540 70" stroke="#9ab0c8" stroke-width="3" opacity="0.4"/></g>`;
  }
  // a generic white takeaway box, open (lid up), food inside, a fork; centred (x, y); ~260 wide
  function takeaway(x, y, s) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="70" rx="170" ry="18" fill="#000" opacity="0.35"/>`;
    g += `<path d="M-130 -110 L130 -110 L150 -30 L-150 -30 Z" fill="#e8e6e0" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-150 -30 L150 -30 L130 60 L-130 60 Z" fill="#f2f0ea" stroke="${INK}" stroke-width="5"/><path d="M-130 -30 L130 -30 L120 -6 L-120 -6 Z" fill="#c89a5a"/>`;
    g += `<path d="M-100 -20 q30 -16 60 0 q30 -16 60 0 q30 -16 60 0" stroke="#e8cf8a" stroke-width="10" fill="none"/>`;
    g += `<circle cx="40" cy="-18" r="7" fill="${ACC}" opacity="0.9"/><path d="M120 -20 L230 -120" stroke="#cfcfca" stroke-width="10" stroke-linecap="round"/>`;
    return g + '</g>';
  }
  // a phone (screen towards camera) with a camera viewfinder; centred (x, y)
  function phone(x, y, s, flash = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-60" y="-110" width="120" height="220" rx="18" fill="#1c1e22" stroke="${INK}" stroke-width="5"/><rect x="-50" y="-92" width="100" height="180" rx="6" fill="#2e3a44"/>`;
    g += `<path d="M-30 -50 L-30 -64 L-16 -64 M16 -64 L30 -64 L30 -50 M30 40 L30 54 L16 54 M-16 54 L-30 54 L-30 40" stroke="#e8e4d8" stroke-width="4" fill="none"/><circle cx="0" cy="70" r="9" fill="none" stroke="#e8e4d8" stroke-width="3"/>`;
    if (flash > 0) g += `<rect x="-50" y="-92" width="100" height="180" rx="6" fill="#ffffff" opacity="${f1(flash)}"/>`;
    return g + '</g>';
  }
  // a generic dump truck in profile, cab to the right; the tailgate at the rear (left) hinged at its top, opened by ang
  // (0 = shut, 1 = swung out); bottom centre (x, y); ~1200 long at k = 1. No lettering.
  function dumpTruck(x, y, k, ang = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><ellipse cx="0" cy="8" rx="620" ry="28" fill="#000" opacity="0.45"/>`;
    g += `<rect x="-560" y="-150" width="1100" height="40" fill="#2a2c30"/>`;
    // the dump body (a steel bed with ribs), asphalt heaped inside
    g += `<path d="M-540 -150 L-540 -420 L160 -420 L200 -150 Z" fill="#8a6a2e" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    for (let i = 0; i < 6; i++) g += `<path d="M${-460 + i * 110} -416 L${-460 + i * 110} -154" stroke="#6e5424" stroke-width="10"/>`;
    g += `<path d="M-520 -420 Q-300 -500 -60 -440 Q60 -470 150 -420 Z" fill="#1e1e20"/>`;
    // the tailgate, hinged at the top rear corner (-540, -420)
    g += `<g transform="rotate(${f1(28 * ang)} -540 -420)"><rect x="-566" y="-424" width="30" height="276" fill="#7a5c26" stroke="${INK}" stroke-width="6"/><rect x="-572" y="-260" width="40" height="18" fill="#3a3a3c"/></g>`;
    // the cab
    g += `<path d="M220 -150 L220 -470 Q220 -500 250 -500 L430 -500 L470 -430 L560 -410 L570 -150 Z" fill="#c8b06a" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    g += `<path d="M260 -470 L420 -470 L452 -420 L260 -420 Z" fill="#162030"/><rect x="250" y="-560" width="20" height="90" fill="#7a7e84"/>`;
    [[-420], [-260], [380]].forEach(([cx]) => { g += `<circle cx="${cx}" cy="-60" r="70" fill="#0b0b0d" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-60" r="30" fill="#5a606a"/>`; });
    g += `<rect x="550" y="-230" width="22" height="34" fill="#fff2c8"/>` + wash(600, -210, 120, 50, '#fff2c8', 0.25);
    return g + '</g>';
  }
  // a small sealed paper envelope, slightly fat (contents unseen); centred (x, y)
  const envelope = (x, y, s, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><ellipse cx="4" cy="34" rx="104" ry="12" fill="#000" opacity="0.35"/><rect x="-100" y="-56" width="200" height="112" rx="6" fill="#d8c8a0" stroke="${INK}" stroke-width="5"/><path d="M-100 -56 L0 6 L100 -56" stroke="#a8946a" stroke-width="5" fill="none"/><path d="M-100 56 L-30 0 M100 56 L30 0" stroke="#b8a47a" stroke-width="3"/></g>`;
  // a clear evidence bag with a red seal strip and blank writing lines; the small object inside is a soft blur (never
  // resolved); centred (x, y)
  function evBag(x, y, s, rot = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    g += `<rect x="-120" y="-170" width="240" height="340" rx="10" fill="#dfe8ee" opacity="0.22" stroke="#e8f0f4" stroke-width="5"/>`;
    g += `<rect x="-120" y="-170" width="240" height="30" fill="#b8322a" opacity="0.9"/><path d="M-120 -134 L120 -134" stroke="#e8f0f4" stroke-width="3" opacity="0.7"/>`;
    g += `<rect x="-100" y="70" width="200" height="80" rx="4" fill="#f2efe6" opacity="0.92"/>` + [0, 1, 2].map(i => `<path d="M-84 ${92 + i * 20} L${60 - i * 30} ${92 + i * 20}" stroke="#9a968c" stroke-width="3"/>`).join('');
    g += `<ellipse cx="0" cy="-20" rx="46" ry="30" fill="#b89a86" opacity="0.55" filter="url(#cineSoft)"/><ellipse cx="0" cy="-20" rx="70" ry="50" fill="#dfe8ee" opacity="0.18" filter="url(#cineSoft)"/>`;
    g += `<path d="M-100 -120 L-80 60" stroke="#ffffff" stroke-width="6" opacity="0.35"/>`;
    return g + '</g>';
  }

  // ---------- new environments (generic illustrations, not replicas of any real place or brand)
  E.registerSets({
    // a generic fast-food booth at night: a muted tiled wall, a blank menu board (plain bars, no words), warm pendant
    // lights, dark windows with car lights outside, the booth back, the table top in front (o.ty = its top edge)
    wf70_diner(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), r = R(7011), ty = o.ty ?? 1240;
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#3e3a36"/>`;
      for (let yy = -280; yy < 1000; yy += 64) for (let xx = -300 + ((yy / 64) % 2) * 40; xx < W + 300; xx += 80) back += `<rect x="${xx}" y="${yy}" width="76" height="60" fill="none" stroke="#35312e" stroke-width="4"/>`;
      back += `<rect x="-280" y="140" width="560" height="760" fill="#141c26" stroke="#24201c" stroke-width="16"/>`;
      for (let i = 0; i < 12; i++) { const bx = -250 + r() * 500, by = 560 + r() * 300, br = 12 + r() * 24; back += `<circle cx="${f1(bx)}" cy="${f1(by)}" r="${f1(br)}" fill="${i % 3 ? '#e8b866' : '#c8564a'}" opacity="${f1(0.22 + 0.18 * Math.sin(t * 1.3 + i))}" filter="url(#cineSoft)"/>`; }
      back += `<path d="M0 140 L0 900" stroke="#24201c" stroke-width="12"/>`;
      back += `<rect x="520" y="150" width="600" height="300" rx="10" fill="#1e2224" stroke="#0e1212" stroke-width="10"/>` + [0, 1, 2, 3].map(i => `<rect x="560" y="${190 + i * 62}" width="${320 - (i % 2) * 90}" height="20" rx="4" fill="#cbbca2" opacity="0.45"/><rect x="1000" y="${190 + i * 62}" width="70" height="20" rx="4" fill="#cbbca2" opacity="0.45"/>`).join('');
      let lights = ''; [[640, 560], [960, 600]].forEach(([lx, ly]) => { lights += `<path d="M${lx} -300 L${lx} ${ly - 60}" stroke="#141414" stroke-width="5"/><path d="M${lx - 70} ${ly} L${lx + 70} ${ly} L${lx + 40} ${ly - 60} L${lx - 40} ${ly - 60} Z" fill="#2a2420" stroke="${INK}" stroke-width="4"/><ellipse cx="${lx}" cy="${ly + 4}" rx="44" ry="10" fill="#ffe0a0"/>` + wash(lx, ly + 200, 300, 320, '#ffd89a', 0.16); });
      const booth = `<rect x="360" y="860" width="${W + 300}" height="520" rx="30" fill="#5a3e32" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2, 3].map(i => `<rect x="${390 + i * 180}" y="890" width="150" height="440" rx="20" fill="#6a4a3c" stroke="#3e2a22" stroke-width="4"/>`).join('');
      let table = `<path d="M-300 ${ty} L${W + 300} ${ty} L${W + 300} ${ty + 60} L-300 ${ty + 60} Z" fill="#cdbfa6" stroke="${INK}" stroke-width="6"/><rect x="-300" y="${ty + 60}" width="${W + 600}" height="${H}" fill="#2e2620"/>`;
      table += `<path d="M-300 ${ty + 6} L${W + 300} ${ty + 6}" stroke="#efe6d2" stroke-width="4" opacity="0.7"/>` + wash(540, ty + 20, 520, 70, '#ffe2a8', 0.2);
      return { light: { dir: 1, rim: '#ffe0a8', key: '#fff0d2' }, layers: [[0.1, back], [0.35, lights], [0.6, booth], [1.0, table]] };
    },

    // a generic fast-food restaurant front at night: a flat-roofed building with a plain fascia (no lettering), big
    // windows onto a dark dining room with chairs up on the tables, a blank pole sign, a lamp, an empty car park
    wf70_front(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="wfsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b12"/><stop offset="1" stop-color="#22283a"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1600" fill="url(#wfsky)"/>` + E.cine.stars(t, 30, 7021, -200, 500);
      sky += `<rect x="900" y="200" width="24" height="760" fill="#2a2c30"/><rect x="760" y="140" width="300" height="180" rx="12" fill="#3a3632" stroke="${INK}" stroke-width="6"/><rect x="780" y="160" width="260" height="140" rx="8" fill="#6a5a44" opacity="0.6"/>`;
      let bld = `<rect x="-360" y="720" width="1500" height="520" fill="#4a423a" stroke="${INK}" stroke-width="6"/><rect x="-380" y="660" width="1540" height="90" fill="#5e4a3a" stroke="${INK}" stroke-width="6"/><rect x="-380" y="740" width="1540" height="14" fill="${ACC}" opacity="0.55"/>`;
      // windows: a dark dining room, chairs upside down on tables
      bld += `<rect x="-300" y="800" width="900" height="360" fill="#121820" stroke="#1e1a16" stroke-width="10"/>`;
      for (let i = 0; i < 4; i++) { const cx = -220 + i * 220; bld += `<rect x="${cx - 60}" y="1060" width="120" height="14" fill="#3a3a3c"/><path d="M${cx} 1074 L${cx} 1150" stroke="#3a3a3c" stroke-width="10"/><path d="M${cx - 40} 1060 L${cx - 40} 1010 L${cx - 10} 1010 L${cx - 10} 1060 M${cx + 10} 1060 L${cx + 10} 1010 L${cx + 40} 1010 L${cx + 40} 1060" stroke="#34363a" stroke-width="7" fill="none"/>`; }
      bld += [0, 1, 2].map(i => `<path d="M${-300 + (i + 1) * 225} 800 L${-300 + (i + 1) * 225} 1160" stroke="#1e1a16" stroke-width="10"/>`).join('') + `<path d="M-280 820 L-120 1140" stroke="#ffffff" stroke-width="8" opacity="0.05"/>`;
      // the door (right), a soft light inside
      bld += `<rect x="700" y="860" width="200" height="380" fill="#1a2028" stroke="#1e1a16" stroke-width="10"/><path d="M800 860 L800 1240" stroke="#1e1a16" stroke-width="6"/>` + wash(800, 1040, 120, 160, '#ffe0a8', 0.18) + `<circle cx="800" cy="840" r="10" fill="#ffe8b8"/>` + wash(800, 900, 150, 120, '#ffe0a0', 0.25);
      let lot = `<rect x="-400" y="1240" width="${W + 800}" height="${H}" fill="#2a2c30"/>`;
      for (let i = -4; i < 9; i++) lot += `<path d="M${540 + i * 170} 1260 L${540 + i * 340} ${H + 200}" stroke="#8a8a80" stroke-width="5" opacity="0.3"/>`;
      lot += wash(800, 1400, 420, 160, '#ffe0a8', 0.08) + wash(540, 1700, 700, 120, '#9ab4d0', 0.05);
      return { light: { dir: 1, rim: '#9ab4d0', key: '#e0d0b8' }, layers: [[0.05, sky], [0.5, bld], [0.85, lot]] };
    },

    // an apartment living room at night: a dark wall with a framed print, a window with city lights, a TV's cool glow
    // from the left, a sofa across the back, a low coffee table in front (top at y 1500)
    wf70_room(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), r = R(7031);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#26262c"/><rect x="560" y="260" width="420" height="440" fill="#0e1422" stroke="#18181c" stroke-width="14"/>`;
      for (let i = 0; i < 26; i++) back += `<rect x="${f1(580 + r() * 380)}" y="${f1(420 + r() * 260)}" width="8" height="10" fill="#e8c880" opacity="${f1(0.3 + 0.4 * r())}"/>`;
      back += `<path d="M770 260 L770 700" stroke="#18181c" stroke-width="10"/><rect x="60" y="320" width="300" height="220" fill="#3a3a40" stroke="#18181c" stroke-width="10"/><path d="M80 520 L160 420 L220 480 L280 400 L340 520 Z" fill="#5a5a62"/>`;
      const tv = wash(-160, 1000, 520, 700, '#7aa0d8', f1(0.16 + 0.04 * Math.sin(t * 7.3) * Math.sin(t * 2.1)));
      let sofa = `<rect x="-200" y="980" width="1480" height="320" rx="40" fill="#4a5058" stroke="${INK}" stroke-width="6"/><rect x="-200" y="1200" width="1480" height="200" rx="20" fill="#5a6068" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2].map(i => `<rect x="${-150 + i * 460}" y="1010" width="420" height="200" rx="30" fill="#525860" stroke="#3a3e44" stroke-width="4"/>`).join('');
      const table = `<rect x="-300" y="1500" width="${W + 600}" height="46" fill="#6a5040" stroke="${INK}" stroke-width="6"/><rect x="-300" y="1546" width="${W + 600}" height="${H}" fill="#1c1a1a"/>` + wash(540, 1510, 500, 50, '#ffe2a8', 0.12);
      return { light: { dir: -1, rim: '#9ab8e0', key: '#e8d8c0' }, layers: [[0.1, back], [0.3, tv], [0.6, sofa], [1.05, table]] };
    },

    // an asphalt yard at dusk: an orange-to-violet sky, a batch-plant tower with a slanted conveyor and silos on the left,
    // gravel heaps, a chain-link fence line, packed dirt in front
    wf70_yard(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="wfysky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2236"/><stop offset="0.55" stop-color="#6a4e5a"/><stop offset="1" stop-color="#d8905a"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1600" fill="url(#wfysky)"/>`;
      sky += `<path d="M-400 980 L-100 860 L200 940 L520 840 L860 930 L1200 850 L1480 920 L1480 1100 L-400 1100 Z" fill="#4a3a44" opacity="0.8"/>`;
      let plant = `<rect x="-200" y="420" width="200" height="680" fill="#3a3a3e" stroke="${INK}" stroke-width="6"/><rect x="40" y="560" width="120" height="540" fill="#4a4a50" stroke="${INK}" stroke-width="6"/><path d="M40 560 Q100 520 160 560" fill="#4a4a50" stroke="${INK}" stroke-width="6"/>`;
      plant += `<path d="M-100 440 L520 900" stroke="#2a2a2e" stroke-width="40"/><path d="M-100 440 L520 900" stroke="#3e3e44" stroke-width="20"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${-60 + i * 120} ${470 + i * 89} L${-60 + i * 120} 1100" stroke="#2a2a2e" stroke-width="8"/>`).join('');
      plant += `<rect x="-160" y="380" width="120" height="40" fill="#2a2a2e"/><circle cx="-100" cy="370" r="8" fill="#ffb040"/>` + wash(-100, 370, 60, 40, '#ffb040', 0.4);
      plant += E.cine.wash(-40, 300, 180, 300, '#c8c0c0', 0.08);
      let heaps = `<path d="M520 1180 Q700 920 880 1180 Z" fill="#5a5450" stroke="${INK}" stroke-width="5"/><path d="M800 1180 Q1000 960 1220 1180 Z" fill="#4a4440" stroke="${INK}" stroke-width="5"/>`;
      heaps += `<path d="M-400 1080 L1480 1080" stroke="#5a5a5e" stroke-width="4"/>` + Array.from({ length: 30 }, (_, i) => `<path d="M${-380 + i * 64} 1080 L${-380 + i * 64} 1180" stroke="#5a5a5e" stroke-width="3"/>`).join('');
      let ground = `<rect x="-400" y="1180" width="${W + 800}" height="${H}" fill="#4a4038"/>`;
      for (let i = 0; i < 70; i++) { const rr = R(7041 + i); ground += `<circle cx="${f1(-300 + rr() * 1700)}" cy="${f1(1200 + rr() * 700)}" r="${f1(2 + rr() * 4)}" fill="#6a5e52" opacity="0.6"/>`; }
      ground += `<path d="M-400 1520 Q540 1460 1480 1540" stroke="#3a322c" stroke-width="30" fill="none" opacity="0.5"/>`;
      return { light: { dir: 1, rim: '#ffc890', key: '#f0d0b0' }, layers: [[0.05, sky], [0.4, plant], [0.6, heaps], [0.85, ground]] };
    }
  });

  // the hero arrangement (frame 1 and the last frame): the bowl big and centred on the booth table; her silhouette seated
  // behind, right of the bowl; the napkin sliding in from the right with her hand
  const BX = 520, BY = 1060, BS = 1.0, TY = 1240;
  const HERO_CAM0 = { x: 0, y: 20, z: 1.03 };
  const napAt = tt => 0.25 + 0.45 * ease.inOut(seg(tt, 0.0, 2.0));
  const handAt = (nap) => [BX + lerp(300, -236, nap) * BS + 380, BY + 6];
  const ayalaSeat = (keys) => ({ id: 'wf70_ayala', x: 860, y: 1640, scale: 0.92, dir: -1, turn: 0.45, pose: 'present', silhouette: 'cool', depth: 0.9, keys });

  E.registerScenes({
    // 1 - hook (frame 1): the bowl big and centred, the napkin already sliding across it with her silhouette hand, the
    //     camera already pushing in; she sits back on 'there'
    wf70_hook(ctx) {
      const t = ctx.t, T = ctx.T, th = WT(ctx, 0, 8, 1.9), l2 = LS(ctx, 1, 2.6);
      return E.cine.shot(ctx, {
        set: 'wf70_diner', setOpts: { ty: TY }, grade: 'warm', dof: true, haze: 0.45,
        cam: { from: HERO_CAM0, to: { x: 0, y: 40, z: 1.12 }, settle: true },
        figures: [ayalaSeat([{ at: 0, pose: 'present', dur: 0.01 }, { at: th + 0.1, pose: 'hands_together', headTurn: -0.3, dur: 0.5 }, { at: l2 + 0.3, pose: 'arms_crossed', dur: 0.5 }])],
        props: [
          { depth: 1.0, accent: true, svg: tt => bowl(BX, BY, BS, tt, napAt(tt), 0.8) },
          { depth: 1.02, svg: tt => { const n = napAt(tt), [hx, hy] = handAt(n); const away = seg(tt, th, th + 0.6); return away >= 1 ? '' : `<g opacity="${f1(1 - away)}">${silHand(hx + 260 * away, hy - 20, 0.9)}</g>`; } }
        ],
        overlays: [
          { type: 'label', at: Math.max(l2 + 0.2, 3.1), x: 60, y: 1180, text: 'WENDY\'S REWARD: $100,000', fs: 38, sub: 'For the finger\'s source · 2005' }
        ],
        tag: LIKE
      });
    },

    // 2 - ITEM 1, THE CLAIM: the same restaurant, wider; she stands behind the table and points at the bowl; the manager
    //     hurries in from the left; the FUN FACT on the second line
    wf70_claim(ctx) {
      const t = ctx.t, T = ctx.T, bt = WT(ctx, 0, 6, 1.4), l2 = LS(ctx, 1, 2.6);
      return E.cine.shot(ctx, {
        set: 'wf70_diner', setOpts: { ty: 1300 }, grade: 'warm', haze: 0.45,
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 20, y: 10, z: 1.06 } },
        figures: [
          { id: 'wf70_ayala', x: 780, y: 1700, scale: 0.84, dir: -1, turn: 0.4, pose: 'stand_tense', silhouette: 'cool', depth: 0.9,
            keys: [{ at: 0.2, pose: 'point', dur: 0.4 }, { at: bt + 0.2, pose: 'hand_to_face', dur: 0.5 }, { at: l2 + 0.4, pose: 'arms_crossed', dur: 0.5 }] },
          { id: 'wf70_manager', x: 60, y: 1760, scale: 0.86, dir: 1, turn: 0.4, pose: 'walk', expr: 'worried', depth: 0.95,
            keys: [{ at: 0, x: -40, pose: 'walk', dur: 0.01 }, { at: 1.4, x: 230, pose: 'walk', dur: 1.4 }, { at: 1.5, pose: 'hands_together', expr: 'shocked', dur: 0.4 }, { at: l2 + 0.6, pose: 'hand_to_face', expr: 'realise', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => bowl(470, 1150, 0.62, tt, 0.7, 0.6) }
        ],
        overlays: [
          { type: 'label', at: 0.25, x: 60, y: 1180, text: 'SAN JOSE · MARCH 22, 2005', fs: 38, sub: 'Her claim: she bit into it', until: l2 - 0.15 },
          { type: 'funfact', at: l2 - 0.05, y: 560, rows: [{ text: 'CHILI COOKS 3 HRS AT 170°F' }, { text: 'THE FINGER WAS NOT COOKED' }, { text: 'Santa Clara County coroner, via AP', fs: 26 }] }
        ],
        tag: LIKE
      });
    },

    // 3 - ITEM 2, THE COST: the restaurant front at night, the dining room dark; a crew member walks out of the door and
    //     away to the right with her apron over her arm; the $2,500,000 counter
    wf70_cost(ctx) {
      const t = ctx.t, T = ctx.T, jb = WT(ctx, 0, 6, 1.6), l2 = LS(ctx, 1, 2.3), ls = WT(ctx, 1, 5, 3.2);
      return E.cine.shot(ctx, {
        set: 'wf70_front', grade: 'night', haze: 0.4,
        cam: { from: { x: -10, y: 40, z: 1.0 }, to: { x: 10, y: 50, z: 1.06 } },
        figures: [
          { id: 'wf70_worker', x: 800, y: 1560, scale: 0.62, dir: 1, turn: 0.4, pose: 'stand', expr: 'sad', depth: 0.9, hat: { style: 'cap', color: '#4a3a30' },
            keys: [{ at: 0.3, pose: 'bowed', expr: 'sad', dur: 0.5 }, { at: jb, x: 800, pose: 'walk', dur: 0.01 }, { at: T + 0.4, x: 1240, pose: 'walk', dur: T + 0.4 - jb }] }
        ],
        props: [
          { depth: 0.92, svg: tt => { const x = tt < jb ? 830 : lerp(830, 1270, (tt - jb) / (T + 0.4 - jb)); return `<path d="M${f1(x - 30)} 1330 l70 0 l-6 70 l-58 0 Z" fill="#6a4a3a" stroke="${INK}" stroke-width="4"/>`; } }
        ],
        overlays: [
          { type: 'counter', at: ls - 0.1, dur: 1.5, from: 0, to: 2500000, prefix: '$', suffix: '', label: 'LOSS, PER THE CHARGES', y: 660, fs: 140 },
          { type: 'label', at: ls + 0.3, x: 90, y: 830, text: 'SAN JOSE-AREA RESTAURANTS', fs: 32, sub: 'Felony complaint, as reported by AP' }
        ],
        tag: TAG
      });
    },

    // 4 - the LESSON (save trigger, for the viewer): a young man on his sofa at night leans over a takeaway box on the
    //     coffee table and frowns; he lifts his phone to photograph it; the checklist card with the SAVE ribbon
    wf70_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 6, 1.4);
      const ph = seg(t, sv - 0.2, sv + 0.3);
      return E.cine.shot(ctx, {
        set: 'wf70_room', grade: 'cold', haze: 0.35, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'wf70_viewer', x: 700, y: 1600, scale: 0.92, dir: -1, turn: 0.4, pose: 'sit', expr: 'focused', depth: 0.98, gaze: [-0.6, 0.6],
            keys: [{ at: 0.5, pose: 'examine', expr: 'worried', dur: 0.5 }, { at: sv, pose: 'present', expr: 'focused', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.05, accent: true, svg: takeaway(330, 1440, 1.1) },
          { depth: 1.06, svg: tt => ph > 0 ? `<g opacity="${f1(ph)}">${phone(560, 1250, 0.8, Math.max(0, 1 - 4 * Math.abs(tt - sv - 0.6)) * 0.8)}</g>` : '' }
        ],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 470, rows: [{ text: 'KEEP OBJECT + PACKAGING', fs: 42 }, { text: 'FREEZE WHAT IS LEFT', fs: 42 }, { text: 'REPORT IT TO A REGULATOR', fs: 42 }, { text: 'USDA FSIS · FDA · UK Food Standards Agency', fs: 24, colour: '#c8b89e' }] }
        ],
        tag: TAG
      });
    },

    // 5 - ITEM 3 = THE BIGGEST REVEAL: an asphalt yard at dusk; the dump truck's tailgate swings shut on the reveal word
    //     (the single impact); the husband's silhouette walks left to right past the truck; the place label
    wf70_finger(ctx) {
      const t = ctx.t, T = ctx.T, cw = WT(ctx, 0, 4, 1.5), l2 = LS(ctx, 1, 2.2), tg = WT(ctx, 1, 6, 3.0);
      const gate = tt => tt < cw - 0.25 ? 1 : 1 - ease.in(seg(tt, cw - 0.25, cw));
      return E.cine.shot(ctx, {
        set: 'wf70_yard', grade: 'dawn', haze: 0.45,
        cam: { from: { x: 0, y: 60, z: 1.06 }, to: { x: 20, y: 70, z: 1.14 }, settle: true },
        figures: [
          { id: 'wf70_husband', x: 120, y: 1780, scale: 0.86, dir: 1, turn: 0.4, pose: 'walk', silhouette: 'cool', depth: 0.98,
            walk: { at: 0.05, dur: Math.max(1.5, cw - 0.2), cadence: 4.2, stride: 14, from: 120, to: 420 },
            keys: [{ at: cw, x: 420, pose: 'stand', headTurn: -0.5, dur: 0.4 }, { at: tg, pose: 'hands_behind', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.8, accent: false, svg: tt => dumpTruck(620, 1420, 0.62, gate(tt)) }
        ],
        overlays: [
          { type: 'impact', at: cw, x: 300, y: 1100 },
          { type: 'label', at: l2 + 0.2, x: 60, y: 780, text: 'LAS VEGAS · DECEMBER 2004', fs: 38, sub: 'An accident at work, police said · he was never charged' }
        ],
        tag: LIKE
      });
    },

    // 6 - the $100: a kitchen at night; the husband's silhouette behind the table slides a small sealed envelope across
    //     (right to left, towards the camera's left); the price label
    wf70_deal(ctx) {
      const t = ctx.t, T = ctx.T, bo = WT(ctx, 0, 2, 0.6), hd = WT(ctx, 0, 5, 1.4);
      const ex = tt => lerp(640, 380, ease.inOut(seg(tt, bo - 0.2, bo + 0.8)));
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'night', haze: 0.4, dof: true,
        cam: { from: { x: 0, y: 60, z: 1.04 }, to: { x: -10, y: 70, z: 1.1 } },
        figures: [
          { id: 'wf70_husband', x: 760, y: 1560, scale: 0.86, dir: -1, turn: 0.4, pose: 'stand', silhouette: 'cool', depth: 0.95,
            keys: [{ at: bo - 0.2, pose: 'present', dur: 0.4 }, { at: bo + 1.0, pose: 'arms_crossed', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.07, svg: tt => envelope(ex(tt), 1150, 0.9, -6) }
        ],
        overlays: [
          { type: 'label', at: hd - 0.1, x: 60, y: 700, text: 'PAID FOR THE FINGERTIP: $100', fs: 40, sub: 'Court papers, as reported by AP' }
        ],
        tag: LIKE
      });
    },

    // 7 - the spoken share line: the lab; a technician holds up an evidence bag (the object inside a soft blur) under the
    //     lamp and turns it; the source label
    wf70_share(ctx) {
      const t = ctx.t, T = ctx.T, md = WT(ctx, 0, 4, 1.0);
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 220 }, grade: 'cold', haze: 0.3, dof: true,
        cam: { from: { x: 0, y: 40, z: 1.06 }, to: { x: 10, y: 50, z: 1.12 } },
        rack: { at: 0.3, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'wf70_tech', x: 800, y: 1560, scale: 0.86, dir: -1, turn: 0.4, pose: 'examine', expr: 'focused', depth: 0.95,
            keys: [{ at: md, pose: 'present', expr: 'realise', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => evBag(560, 960 + 6 * Math.sin(tt * 1.6), 0.9, -4 + 3 * Math.sin(tt * 0.9)) }
        ],
        overlays: [
          { type: 'label', at: 0.2, x: 60, y: 780, text: 'SOURCE TRACED · MAY 2005', fs: 38, sub: 'San Jose police, with Las Vegas police' }
        ],
        tag: TAG
      });
    },

    // 8 - the punchline back at the hero bowl in frame 1's framing (the loop): she sits where she sat; the camera pulls
    //     back to frame 1's start; in the last ~0.7 s her hand returns and eases the napkin back to frame 1's position
    wf70_end(ctx) {
      const t = ctx.t, T = ctx.T, t0 = T - 0.7;
      const nap = tt => tt < t0 ? 0.7 : lerp(0.7, napAt(0), ease.inOut(seg(tt, t0, T)));   // ends exactly at frame 1's napkin
      return E.cine.shot(ctx, {
        set: 'wf70_diner', setOpts: { ty: TY }, grade: 'warm', dof: true, haze: 0.45,
        cam: { from: { x: 0, y: 40, z: 1.12 }, to: HERO_CAM0, settle: true },
        figures: [ayalaSeat([{ at: 0, pose: 'hands_together', dur: 0.01 }, { at: t0, pose: 'present', dur: 0.3 }])],
        props: [
          { depth: 1.0, accent: true, svg: tt => bowl(BX, BY, BS, tt, nap(tt), 0.8) },
          { depth: 1.02, svg: tt => { if (tt < t0) return ''; const [hx, hy] = handAt(nap(tt)); return `<g opacity="${f1(seg(tt, t0, t0 + 0.2))}">${silHand(hx, hy - 20, 0.9)}</g>`; } }
        ],
        overlays: [
          { type: 'label', at: 0.15, x: 60, y: 1180, text: 'SENTENCED · JANUARY 2006', fs: 38, sub: 'Ayala 9 years · her husband 12 years 4 months', until: T - 0.7 }
        ],
        tag: LIKE
      });
    }
  });
})();
