/* Case File 35 (cinematic, 40-second cut): the end of the hunt for Pablo Escobar, Medellín, 2 December 1993.
   CLOSED: Escobar died on 2 December 1993 (no trial). 16 months after walking out of La Catedral prison (July 1992) he
   was found because a radiotelephone call to his son was long enough for police direction-finding teams to locate.
   Structure (short40 + the EPISODE 29+ / 31-35 rules): a burned-in hook headline that leads with the OBJECT, over the HERO
   OBJECT: a generic 1990s brick-style radiotelephone with its antenna up, big and centred on a table in a plain upstairs
   room with the hillside rooftops of Medellín in the window; it is the first frame and the last (the video loops).
   A stakes number by 0:10 (107 killed on Avianca 203; bounties on police); the hunters and their technology (the Search
   Bloc, DEA help, a plain van with a direction-finding mast); the weak point (the radiotelephone calls); the son's plea
   (attributed); the HOW at about 60 % (first call short, second long enough; the van's arcs converge on one house); the
   raid and the death in summary (officers at a door, the roof stays EMPTY, a card); the outcome (the day after his 44th
   birthday); the callback and the memorial; a burned-in YES/NO end question (episode.end_title) over the last 3.2 s.
   Content rules:
   - Nothing of the death is drawn: no figure is ever on a roof, no weapon, no body, no blood, no gunfire. The death is one
     spoken summary line and a typed card; the fatal-shot dispute is a card. No bomb, aircraft, drug, cash or victim appears.
   - Escobar is ONLY an anonymous rim-lit silhouette (characters/figures/pe35_escobar.json, silhouette 'warm'): no face,
     no likeness, never a photo recreation, never posed heroically; the 'hand_to_face' pose stands for a handset at the ear.
     Every shot he is in is tagged 'ILLUSTRATION · NOT A LIKENESS'. His son is never drawn.
   - The officers (pe35_officer) and agents (agent_a/b, analyst) are generic figures with no insignia; nobody is named.
   - No brand or real material: the handset has no logo, no digits on its display; the van, house, street and hillside are
     generic drawings; every card is our own typed graphic.
   New environments (E.registerSets): pe35_room (a plain upstairs room: plaster wall, a window on the hillside barrio at
   dusk, a curtain, a wooden table across the foreground; o.dark 0..1 towards night, o.police flicker), pe35_street (a
   street of two-storey flat-roofed houses with balconies and water tanks, power lines, a hill behind; o.dusk 0..1,
   o.target 0..1 outlines the centre house, o.police flicker), pe35_hill (a wide hillside of rooftops stepping down to the
   city at dusk, a foreground flat roof with a parapet; o.police flicker). Plus the shared task_force set.
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
  const PLACE = 'ILLUSTRATION · GENERIC PLACE, NOT THE REAL ONE';
  const YEL = '#ffd23f', RED = '#8e1f18', MUTE = '#6b665c';
  const panel = (x, y, w, h, op = 0.6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#000" opacity="${op}"/>`;
  const mix = (a, b, k) => { const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16)); return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], clamp(k, 0, 1))).toString(16).padStart(2, '0')).join(''); };

  // ---------- THE HERO: a generic 1990s brick-style radiotelephone standing upright, bottom centre (x, y); ~360 wide and
  // 700 tall at s = 1, the antenna reaching to y -930. Dark grey body, an earpiece grille, a blank green LCD (no digits),
  // a 3 x 4 keypad with no legends, a mouthpiece, a stubby rubber antenna. o.lit 0..1 lights the LCD; o.ring 0..1 sends
  // signal arcs out from the antenna tip; o.glow 0..1 = a yellow outline; o.tilt = degrees about the base.
  function phone(x, y, s, t, o = {}) {
    const lit = o.lit || 0, ring = o.ring || 0, k = o.glow || 0, tilt = o.tilt || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)}) rotate(${f1(tilt)})"><ellipse cx="10" cy="8" rx="230" ry="26" fill="#000" opacity="0.5"/>`;
    // signal arcs from the antenna tip (behind the body)
    if (ring > 0) for (let i = 0; i < 4; i++) { const ph = ((t * 0.9) + i * 0.25) % 1; const r = 60 + 420 * ph; g += `<circle cx="116" cy="-940" r="${f1(r)}" fill="none" stroke="${YEL}" stroke-width="${f1(10 - 6 * ph)}" opacity="${f1(ring * 0.75 * (1 - ph))}"/>`; }
    // antenna: a stubby rubber whip with a tip cap
    g += `<rect x="100" y="-930" width="32" height="250" rx="12" fill="#1c1c1e" stroke="${INK}" stroke-width="4"/><rect x="92" y="-700" width="48" height="40" rx="8" fill="#2c2c30" stroke="${INK}" stroke-width="4"/><circle cx="116" cy="-934" r="18" fill="#2a2a2e" stroke="${INK}" stroke-width="4"/><path d="M108 -915 L108 -700" stroke="#7a7e88" stroke-width="5" opacity="0.8"/>`;
    // body and face panel
    g += `<rect x="-180" y="-700" width="360" height="700" rx="40" fill="#26282c" stroke="${INK}" stroke-width="7"/><rect x="-160" y="-680" width="320" height="660" rx="30" fill="#33363c"/><rect x="-160" y="-680" width="90" height="660" rx="30" fill="#3e4248" opacity="0.5"/>`;
    // earpiece grille
    for (let i = 0; i < 5; i++) g += `<rect x="-60" y="${-646 + i * 12}" width="120" height="5" rx="2" fill="#15161a"/>`;
    // the LCD window: blank green glass; when lit, a soft glow and a row of dashes (no digits)
    g += `<rect x="-130" y="-566" width="260" height="110" rx="12" fill="#1a1d20" stroke="${INK}" stroke-width="5"/><rect x="-118" y="-554" width="236" height="86" rx="8" fill="${mix('#5c6e48', '#a8d47a', lit)}"/>`;
    if (lit > 0) { g += wash(0, -511, 200, 90, '#c8ff9a', f1(0.35 * lit)); for (let i = 0; i < 7; i++) g += `<rect x="${-96 + i * 30}" y="-520" width="18" height="6" fill="#203018" opacity="${f1(0.7 * lit)}"/>`; }
    // keypad: 3 x 4 blank keys
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const kx = -126 + c * 90, ky = -410 + r * 78; g += `<rect x="${kx}" y="${ky}" width="72" height="54" rx="10" fill="#45484f" stroke="${INK}" stroke-width="4"/><rect x="${kx + 8}" y="${ky + 6}" width="56" height="12" rx="6" fill="#5c6068" opacity="0.8"/>`; }
    // mouthpiece dots and a base lip
    for (let i = 0; i < 5; i++) g += `<circle cx="${-40 + i * 20}" cy="-60" r="4" fill="#15161a"/>`;
    g += `<rect x="-180" y="-30" width="360" height="30" rx="10" fill="#1e2024" stroke="${INK}" stroke-width="5"/>`;
    if (k > 0) g += `<path d="M-200 20 L-200 -720 L80 -720 L80 -950 L150 -950 L150 -720 L200 -720 L200 20 Z" fill="none" stroke="${YEL}" stroke-width="10" stroke-linejoin="round" opacity="${f1(k * (0.75 + 0.25 * Math.sin(t * 7)))}"/>`;
    return g + '</g>';
  }
  // a plain panel van in profile (nose to the left), bottom centre (x, y), ~900 x 420 at s = 1, with a direction-finding
  // mast on the roof: o.mast 0..1 raises it; o.arcs 0..1 sends sweeping arcs from its head. No lettering, no plate.
  function dfvan(x, y, s, t, o = {}) {
    const m = o.mast ?? 1, arcs = o.arcs || 0, mh = 40 + 260 * ease.out(m);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="6" rx="470" ry="30" fill="#000" opacity="0.45"/>`;
    if (arcs > 0) for (let i = 0; i < 4; i++) { const ph = ((t * 0.7) + i * 0.25) % 1; const r = 80 + 900 * ph; g += `<circle cx="120" cy="${f1(-330 - mh)}" r="${f1(r)}" fill="none" stroke="${YEL}" stroke-width="${f1(9 - 6 * ph)}" opacity="${f1(arcs * 0.6 * (1 - ph))}"/>`; }
    g += `<rect x="-440" y="-330" width="880" height="270" rx="30" fill="#d9d3c4" stroke="${INK}" stroke-width="7"/><path d="M-440 -200 L-440 -120 Q-470 -110 -470 -80 L-470 -60 L-440 -60 Z" fill="#cfc9ba" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-440 -330 L-300 -330 L-300 -200 L-440 -200 Z" fill="#8fb4c8" stroke="${INK}" stroke-width="6"/><rect x="-250" y="-310" width="150" height="110" rx="10" fill="#8fb4c8" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="-440" y="-120" width="880" height="60" fill="#bdb6a6"/><rect x="-60" y="-320" width="20" height="250" fill="#000" opacity="0.15"/>`;
    [-280, 280].forEach(cx => { g += `<circle cx="${cx}" cy="-40" r="58" fill="#0c0c0e" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-40" r="26" fill="#9aa0a8"/>`; });
    g += `<rect x="-470" y="-100" width="40" height="36" rx="6" fill="#e8c850"/><rect x="430" y="-100" width="30" height="36" rx="6" fill="#c83a2a"/>`;
    // the mast: a pole from a roof box, with a loop head
    g += `<rect x="60" y="-370" width="120" height="44" rx="8" fill="#4a4e56" stroke="${INK}" stroke-width="5"/><rect x="110" y="${f1(-330 - mh)}" width="20" height="${f1(mh)}" fill="#2a2e36" stroke="${INK}" stroke-width="4"/>`;
    g += `<circle cx="120" cy="${f1(-330 - mh)}" r="46" fill="none" stroke="#2a2e36" stroke-width="12"/><path d="M74 ${f1(-330 - mh)} L166 ${f1(-330 - mh)}" stroke="#2a2e36" stroke-width="10"/>`;
    return g + '</g>';
  }
  // a direction-finding scope on a stand, bottom centre (x, y): a round screen with a sweep line, o.blip 0..1 shows a mark
  function scope(x, y, s, t, o = {}) {
    const b = o.blip || 0, a = (t * 2.2) % (Math.PI * 2);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-30" y="-220" width="60" height="220" fill="#3a3e46" stroke="${INK}" stroke-width="5"/><rect x="-120" y="-20" width="240" height="24" rx="8" fill="#2e323a" stroke="${INK}" stroke-width="4"/>`;
    g += `<circle cx="0" cy="-380" r="190" fill="#15181c" stroke="${INK}" stroke-width="8"/><circle cx="0" cy="-380" r="160" fill="#13301c"/>`;
    for (let i = 1; i <= 3; i++) g += `<circle cx="0" cy="-380" r="${i * 52}" fill="none" stroke="#2c6a3a" stroke-width="2"/>`;
    g += `<path d="M-160 -380 L160 -380 M0 -540 L0 -220" stroke="#2c6a3a" stroke-width="2"/>`;
    g += `<path d="M0 -380 L${f1(160 * Math.cos(a))} ${f1(-380 + 160 * Math.sin(a))}" stroke="#8cff9a" stroke-width="5" opacity="0.9"/><path d="M0 -380 L${f1(160 * Math.cos(a))} ${f1(-380 + 160 * Math.sin(a))} A160 160 0 0 0 ${f1(160 * Math.cos(a - 0.9))} ${f1(-380 + 160 * Math.sin(a - 0.9))} Z" fill="#8cff9a" opacity="0.18"/>`;
    if (b > 0) g += `<circle cx="70" cy="-440" r="${f1(10 + 6 * b)}" fill="${YEL}" opacity="${f1(b * (0.6 + 0.4 * Math.sin(t * 9)))}"/>`;
    return g + '</g>';
  }
  // a dense hillside barrio: small flat-roofed houses stepping up a slope inside the box (x0..x1, y0..y1), seed-driven
  function barrio(r, x0, y0, x1, y1, n, dk, s = 1) {
    let g = '';
    for (let i = 0; i < n; i++) {
      const bx = x0 + r() * (x1 - x0), by = y0 + r() * (y1 - y0), bw = (30 + r() * 40) * s, bh = (26 + r() * 40) * s;
      const col = ['#b86a3e', '#c98a52', '#a85a3a', '#d9b27a', '#8c6a4a', '#c7c0a8'][i % 6];
      g += `<rect x="${f1(bx)}" y="${f1(by)}" width="${f1(bw)}" height="${f1(bh)}" fill="${mix(col, '#2a1e1c', dk * 0.7)}" stroke="#2a1a14" stroke-width="1.5"/>`;
      if (r() > 0.45) g += `<rect x="${f1(bx + bw * 0.3)}" y="${f1(by + bh * 0.35)}" width="${f1(bw * 0.22)}" height="${f1(bh * 0.3)}" fill="#ffd98a" opacity="${f1(0.25 + 0.7 * dk)}"/>`;
    }
    return g;
  }
  const skyGrad = (id, dk, top, mid, low) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(top, '#05070f', dk)}"/><stop offset="0.55" stop-color="${mix(mid, '#0c1226', dk)}"/><stop offset="1" stop-color="${mix(low, '#2a2030', dk)}"/></linearGradient></defs>`;

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a plain upstairs room (generic): a plaster wall, a window (centre-right) onto the hillside barrio at dusk, a curtain
    // on its left, a bare bulb's glow, a wooden table across the foreground (the phone stands on it). o.dark 0..1 takes
    // the window towards night and brightens the bulb; o.police 0..1 flickers red/blue on the wall.
    pe35_room(ctx, o = {}) {
      const t = ctx.t, r = R(351), dk = o.dark || 0, po = o.police || 0;
      // outside, seen through the window: sky, far mountains, the barrio on the slope
      let out = skyGrad('pe35rsky', dk, '#243a66', '#c0744a', '#e8a860') + `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#pe35rsky)"/>`;
      out += `<path d="M-300 760 Q 200 560 560 700 Q 900 520 1380 720 L1380 1300 L-300 1300 Z" fill="${mix('#3a4a5a', '#0c1020', dk)}"/>`;
      out += barrio(r, -300, 700, W + 300, 1250, 420, dk, 1.3);
      // the wall, the window frame, the curtain, the bulb
      const wallc = mix('#b9a98c', '#4a4038', dk * 0.8);
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="${wallc}"/>`;
      for (let i = 0; i < 60; i++) wall += `<ellipse cx="${f1(-200 + r() * 1500)}" cy="${f1(-100 + r() * 1700)}" rx="${f1(30 + r() * 90)}" ry="${f1(10 + r() * 30)}" fill="#000" opacity="0.05"/>`;
      // the window: a hole in the wall (the outside layer shows through), frame and sill
      wall = `<defs><mask id="pe35win"><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#fff"/><rect x="560" y="400" width="440" height="620" fill="#000"/></mask></defs><g mask="url(#pe35win)">${wall}</g>`;
      wall += `<rect x="540" y="380" width="480" height="660" fill="none" stroke="${mix('#6a5a48', '#2a2420', dk)}" stroke-width="22"/><rect x="770" y="400" width="14" height="620" fill="${mix('#6a5a48', '#2a2420', dk)}"/><rect x="560" y="700" width="440" height="12" fill="${mix('#6a5a48', '#2a2420', dk)}"/>`;
      wall += `<rect x="520" y="1030" width="520" height="30" fill="${mix('#8a7a62', '#3a3028', dk)}" stroke="${INK}" stroke-width="4"/>`;
      // a curtain on the left of the window
      wall += `<path d="M330 380 L500 380 L480 1040 L310 1040 Z" fill="${mix('#8e3a3a', '#3a1c1c', dk)}" stroke="${INK}" stroke-width="4"/>`;
      for (let i = 0; i < 5; i++) wall += `<path d="M${350 + i * 30} 380 Q ${340 + i * 30} 700 ${330 + i * 30} 1040" stroke="#000" stroke-opacity="0.18" stroke-width="8" fill="none"/>`;
      // a bare bulb on a cord, top left, warmer as it gets dark
      const lit = 0.35 + 0.65 * dk;
      wall += `<path d="M200 -300 L200 300" stroke="#2a2420" stroke-width="5"/><ellipse cx="200" cy="330" rx="30" ry="40" fill="#fff4c8" opacity="${f1(lit)}"/>` + wash(200, 420, 420, 360, '#ffe2a0', f1(0.3 * lit));
      if (po > 0) { const ph = (t * 2.4) % 1; wall += `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="${ph < 0.5 ? '#ff3a2a' : '#3a6aff'}" opacity="${f1(0.14 * po)}"/>`; }
      // the floor and the table across the foreground
      let fore = `<rect x="-300" y="1700" width="${W + 600}" height="${H}" fill="${mix('#6a4e3a', '#2a1e18', dk * 0.8)}"/>`;
      fore += `<rect x="-300" y="1500" width="${W + 600}" height="40" fill="${mix('#9a6a42', '#4a3222', dk * 0.6)}" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1540" width="${W + 600}" height="170" fill="${mix('#7a5232', '#3a2618', dk * 0.6)}" stroke="${INK}" stroke-width="5"/>`;
      for (let i = 0; i < 9; i++) fore += `<path d="M${-300 + i * 180} 1548 L${-260 + i * 180} 1700" stroke="#000" stroke-opacity="0.12" stroke-width="3"/>`;
      fore += `<rect x="-300" y="1500" width="${W + 600}" height="12" fill="#fff" opacity="0.12"/>`;
      return { light: { dir: 1, rim: dk > 0.5 ? '#ffd090' : '#ffe0b0', key: '#ffe6c0' }, layers: [[0.05, out], [0.5, wall], [1.0, fore]] };
    },

    // a street of two-storey flat-roofed houses (generic): parapets, water tanks, balconies with iron grilles, doors,
    // power poles and lines, a hill of small houses behind, a road with a kerb in front. o.dusk 0..1 goes to evening;
    // o.target 0..1 outlines the centre house in yellow; o.police 0..1 flickers red/blue on the fronts.
    pe35_street(ctx, o = {}) {
      const t = ctx.t, r = R(352), dk = o.dusk || 0, tg = o.target || 0, po = o.police || 0;
      let sky = skyGrad('pe35ssky', dk, '#5a8ac0', '#b9c8d4', '#e8c8a0') + `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#pe35ssky)"/>`;
      sky += `<path d="M-300 640 Q 300 420 700 560 Q 1000 440 1380 600 L1380 900 L-300 900 Z" fill="${mix('#6a7a62', '#141a24', dk)}"/>`;
      let hill = barrio(r, -300, 560, W + 300, 760, 260, dk, 0.9);
      // the row of houses: five fronts, the centre one (x 360..740) is the target
      let houses = '';
      const fronts = [[-320, 340, '#d9b27a'], [20, 340, '#c7c0a8'], [360, 380, '#c98a52'], [740, 340, '#b86a3e'], [1080, 340, '#a8b89a']];
      fronts.forEach(([x, w, col], i) => {
        const c = mix(col, '#2a2020', dk * 0.6), y0 = 620 - (i % 2) * 30;
        houses += `<rect x="${x}" y="${y0}" width="${w}" height="${1200 - y0}" fill="${c}" stroke="${INK}" stroke-width="6"/>`;
        houses += `<rect x="${x - 6}" y="${y0 - 26}" width="${w + 12}" height="30" fill="${mix('#e8e0cc', '#3a3430', dk * 0.6)}" stroke="${INK}" stroke-width="5"/>`;
        houses += `<rect x="${x + w - 110}" y="${y0 - 90}" width="70" height="64" rx="6" fill="${mix('#3a3e46', '#1a1c22', dk * 0.5)}" stroke="${INK}" stroke-width="4"/>`;
        // first floor: a balcony with a grille and a door; ground floor: a window and a door
        houses += `<rect x="${x + 40}" y="${y0 + 60}" width="${w - 80}" height="150" fill="${mix('#2a3448', '#0c1018', dk * 0.5)}" stroke="${INK}" stroke-width="5"/>`;
        houses += `<rect x="${x + 40}" y="${y0 + 70}" width="${w - 80}" height="130" fill="#ffd98a" opacity="${f1(0.15 + 0.5 * dk * ((i + 1) % 2))}"/>`;
        houses += `<rect x="${x + 24}" y="${y0 + 150}" width="${w - 48}" height="90" fill="none" stroke="${INK}" stroke-width="6"/>`;
        for (let gx = x + 36; gx < x + w - 30; gx += 22) houses += `<path d="M${gx} ${y0 + 150} L${gx} ${y0 + 240}" stroke="${INK}" stroke-width="3"/>`;
        houses += `<rect x="${x + 50}" y="${y0 + 330}" width="110" height="140" fill="${mix('#2a3448', '#0c1018', dk * 0.5)}" stroke="${INK}" stroke-width="5"/><rect x="${x + 54}" y="${y0 + 334}" width="102" height="132" fill="#ffd98a" opacity="${f1(0.15 + 0.5 * dk * (i % 2))}"/>`;
        houses += `<rect x="${x + w - 150}" y="${1200 - 240}" width="100" height="240" fill="${mix('#4a3a2a', '#1a1410', dk * 0.5)}" stroke="${INK}" stroke-width="5"/><circle cx="${x + w - 70}" cy="${1200 - 120}" r="6" fill="#c9ced6"/>`;
        for (let yy = y0 + 20; yy < 1200; yy += 44) houses += `<path d="M${x} ${yy} L${x + w} ${yy}" stroke="#000" stroke-opacity="0.07" stroke-width="2"/>`;
      });
      // a power pole with lines
      houses += `<rect x="900" y="420" width="16" height="780" fill="#3a2e24" stroke="${INK}" stroke-width="3"/><rect x="860" y="470" width="96" height="10" fill="#3a2e24"/><path d="M-300 520 Q 300 600 860 472 M956 472 Q 1200 500 1380 440" stroke="#1a1612" stroke-width="3" fill="none"/>`;
      if (po > 0) { const ph = (t * 2.4) % 1; houses += `<rect x="-300" y="300" width="${W + 600}" height="900" fill="${ph < 0.5 ? '#ff3a2a' : '#3a6aff'}" opacity="${f1(0.14 * po)}"/>`; }
      if (tg > 0) houses += `<rect x="352" y="548" width="396" height="660" rx="8" fill="none" stroke="${YEL}" stroke-width="12" opacity="${f1(tg * (0.75 + 0.25 * Math.sin(t * 7)))}"/>`;
      let road = `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="${mix('#6a6660', '#22242a', dk * 0.7)}"/><rect x="-300" y="1200" width="${W + 600}" height="60" fill="${mix('#9a9690', '#3a3c42', dk * 0.6)}" stroke="${INK}" stroke-width="4"/>`;
      for (let i = 0; i < 10; i++) road += `<ellipse cx="${f1(-200 + r() * 1500)}" cy="${f1(1320 + r() * 560)}" rx="${f1(40 + r() * 70)}" ry="${f1(8 + r() * 12)}" fill="#000" opacity="0.18"/>`;
      return { light: { dir: 1, rim: dk > 0.5 ? '#ffc890' : '#fff4e0', key: dk > 0.5 ? '#ffd8a8' : '#fff8ec' }, layers: [[0.05, sky], [0.25, hill], [0.55, houses], [1.0, road]] };
    },

    // a wide hillside at dusk (generic): dense rooftops stepping down the slope to the lit valley, mountains behind;
    // a flat roof with a parapet in the foreground where figures stand. o.police 0..1 flickers red/blue on the parapet.
    pe35_hill(ctx, o = {}) {
      const t = ctx.t, r = R(353), dk = 0.7, po = o.police || 0;
      let sky = skyGrad('pe35hsky', 0.35, '#1c2a52', '#9a5a48', '#e8a060') + `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#pe35hsky)"/>`;
      for (let i = 0; i < 40; i++) sky += `<circle cx="${f1(-200 + r() * 1500)}" cy="${f1(-150 + r() * 500)}" r="${f1(1.2 + r() * 2)}" fill="#fff" opacity="${f1(0.5 * (0.5 + 0.5 * Math.sin(t * (1 + r() * 3) + i)))}"/>`;
      sky += `<path d="M-300 700 Q 200 460 600 620 Q 900 480 1380 640 L1380 1000 L-300 1000 Z" fill="#1c2436"/>`;
      let slope = `<path d="M-300 1300 L-300 760 Q 400 640 1380 900 L1380 1300 Z" fill="#2a2420"/>` + barrio(r, -300, 700, W + 300, 1320, 520, dk, 1.2);
      slope += `<rect x="-300" y="1200" width="${W + 600}" height="140" fill="#0c1020" opacity="0.5"/>`;
      for (let i = 0; i < 120; i++) slope += `<circle cx="${f1(-200 + r() * 1500)}" cy="${f1(1210 + r() * 120)}" r="${f1(1.5 + r() * 2.5)}" fill="#ffd98a" opacity="${f1(0.6 + 0.4 * Math.sin(t * 2 + i))}"/>`;
      // the foreground roof: a concrete slab with a parapet, a water tank at the right, a stair hood at the left
      let roof = `<rect x="-300" y="1360" width="${W + 600}" height="${H}" fill="#55504a"/><rect x="-300" y="1300" width="${W + 600}" height="70" fill="#6a645c" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1300" width="${W + 600}" height="12" fill="#fff" opacity="0.12"/>`;
      roof += `<rect x="-200" y="1120" width="260" height="190" rx="8" fill="#4a4640" stroke="${INK}" stroke-width="5"/><rect x="-170" y="1160" width="80" height="150" fill="#1a1c22"/>`;
      roof += `<rect x="860" y="1150" width="150" height="160" rx="12" fill="#2e3238" stroke="${INK}" stroke-width="5"/><ellipse cx="935" cy="1150" rx="75" ry="16" fill="#3e4248" stroke="${INK}" stroke-width="4"/>`;
      if (po > 0) { const ph = (t * 2.4) % 1; roof += `<rect x="-300" y="1100" width="${W + 600}" height="900" fill="${ph < 0.5 ? '#ff3a2a' : '#3a6aff'}" opacity="${f1(0.12 * po)}"/>`; }
      for (let i = 0; i < 14; i++) roof += `<ellipse cx="${f1(-200 + r() * 1500)}" cy="${f1(1400 + r() * 500)}" rx="${f1(40 + r() * 80)}" ry="${f1(8 + r() * 14)}" fill="#000" opacity="0.15"/>`;
      return { light: { dir: -1, rim: '#ffc890', key: '#ffd8b0' }, layers: [[0.05, sky], [0.3, slope], [1.0, roof]] };
    }
  });

  // the hero handset's framing in the first and the last shot (the loop): standing on the table, big and centred; its
  // antenna tip sits at about y 664, below the headline band (y 380-720 is only for the burned-in titles)
  const HERO = { x: 540, y: 1520, s: 0.92 };

  E.registerScenes({
    // 1 - hook: the handset on the table, big and centred from the first frame; Escobar is a warm silhouette at the
    //     window behind the table. He turns away on "escaped", bows on "hid", lifts a hand to his ear on "phone"; the
    //     handset glows and sends out arcs on "call". The headline is burned in by the engine (until ~3.2 s), so our
    //     label waits until 3.3 s.
    pe35_hook(ctx) {
      const t = ctx.t, esc = WT(ctx, 0, 2, 0.8), hid = WT(ctx, 0, 5, 1.6), l1 = LS(ctx, 1, 3.4), pho = WT(ctx, 1, 1, 3.6), cal = WT(ctx, 1, 2, 3.9), hunt = WT(ctx, 1, 8, 5.0);
      return E.cine.shot(ctx, {
        set: 'pe35_room', setOpts: { dark: 0.25 }, grade: 'warm',
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 0, y: 60, z: 1.07 }, handheld: 1.0 },
        shake: [{ at: cal, amp: 3 }],
        figures: [{ id: 'pe35_escobar', x: 800, y: 1700, scale: 0.82, dir: -1, turn: 0.4, pose: 'stand', expr: 'neutral', silhouette: 'warm', depth: 0.75, gaze: [-0.3, 0],
          keys: [{ at: esc, pose: 'stand_tense', headTurn: 0.6, gaze: [0.8, -0.2], dur: 0.45 }, { at: hid, pose: 'bowed', headTurn: 0, dur: 0.5 }, { at: pho, pose: 'hand_to_face', headTurn: -0.3, dur: 0.4 }, { at: hunt + 0.2, pose: 'stand', dur: 0.5 }] }],
        props: [{ depth: 1.0, svg: tt => phone(HERO.x, HERO.y, HERO.s, tt, { lit: 0.3 + 0.7 * seg(tt, pho - 0.1, pho + 0.3), ring: seg(tt, cal - 0.1, cal + 0.3) * (1 - seg(tt, hunt + 0.4, hunt + 1.0)), glow: 0.8 * seg(tt, cal - 0.1, cal + 0.3) * (1 - seg(tt, hunt + 0.6, hunt + 1.2)) }) }],
        overlays: [
          { type: 'label', at: 3.3, x: 60, y: 432, text: 'MEDELLÍN, COLOMBIA', fs: 40, sub: 'A hideout · 2 December 1993' }
        ],
        tag: LIKENESS
      });
    },

    // 2 - the stakes by 0:10, on a card in a quiet ops room: the jet bombing (107 killed) and the bounties on police.
    //     Nothing of either is drawn; the analyst reads and points, the agent reads and stiffens.
    pe35_toll(ctx) {
      const bom = WT(ctx, 0, 2, 0.6), jet = WT(ctx, 0, 4, 1.1), n107 = WT(ctx, 0, 6, 1.7), bou = WT(ctx, 0, 9, 2.6), pol = WT(ctx, 0, 11, 3.2);
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: {}, grade: 'cold', dust: true,
        cam: { from: { x: 20, y: -30, z: 1.06 }, to: { x: -20, y: -50, z: 1.0 }, handheld: 0.6 },
        figures: [
          { id: 'analyst', x: 200, y: 1610, scale: 0.92, dir: 1, turn: 0.55, pose: 'sit_read', expr: 'focused', keys: [{ at: bom, pose: 'examine', dur: 0.4 }, { at: n107, pose: 'point', expr: 'determined', gaze: [0.6, -0.3], dur: 0.4 }, { at: pol, pose: 'sit_read', expr: 'focused', dur: 0.5 }] },
          { id: 'agent_b', x: 840, y: 1740, scale: 0.96, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', keys: [{ at: jet, pose: 'stand', expr: 'stern', dur: 0.5 }, { at: bou, pose: 'stand_tense', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'card', at: 0.1, x: 60, y: 400, w: 820, rows: [{ text: 'THE MEDELLÍN CARTEL · AVIANCA FLIGHT 203 · 1989', fs: 24, colour: MUTE }, { text: '107 KILLED', fs: 56, colour: RED, at: n107 - 0.1 }, { text: 'BOUNTIES PAID FOR POLICE KILLED', fs: 30, at: bou - 0.1 }, { text: '500+ OFFICERS KILLED IN MEDELLÍN SINCE 1989 (AP)', fs: 22, colour: MUTE, at: pol }] }
        ],
        tag: TAG
      });
    },

    // 3 - the hunters: a Medellín street by day; a plain van with a direction-finding mast; an officer walks in and
    //     points up the street on "hunted"; the agent (the US help) walks in and stops on "DEA"; the mast rises on "tracking"
    pe35_bloc(ctx) {
      const t = ctx.t, srch = WT(ctx, 0, 1, 0.4), hun = WT(ctx, 0, 3, 1.1), dea = WT(ctx, 0, 6, 2.0), us = WT(ctx, 0, 9, 2.7), trk = WT(ctx, 0, 10, 3.0), gear = WT(ctx, 0, 11, 3.4);
      return E.cine.shot(ctx, {
        set: 'pe35_street', setOpts: { dusk: 0.1 }, grade: 'warm',
        cam: { from: { x: -30, y: 0, z: 1.0 }, to: { x: 30, y: -10, z: 1.06 }, handheld: 1.2 },
        figures: [
          { id: 'pe35_officer', x: 620, y: 1660, scale: 0.78, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', depth: 1.02, walk: { from: 300, to: 620, at: 0.05, dur: Math.max(0.6, hun - 0.1), cadence: 6.2 },
            keys: [{ at: hun, pose: 'point', expr: 'determined', gaze: [0.9, -0.3], dur: 0.4 }, { at: trk, pose: 'stand', headTurn: -0.6, gaze: [-0.8, -0.4], dur: 0.4 }] },
          { id: 'agent_a', x: 900, y: 1600, scale: 0.7, dir: -1, turn: 0.5, pose: 'walk', expr: 'focused', walk: { from: 1240, to: 900, at: srch, dur: Math.max(0.6, dea - srch), cadence: 6.2 },
            keys: [{ at: dea, pose: 'stand_tense', expr: 'stern', dur: 0.4 }, { at: gear, pose: 'point', headTurn: 0.3, gaze: [-0.9, -0.4], dur: 0.4 }] }
        ],
        props: [{ depth: 0.9, svg: tt => dfvan(230, 1470, 0.62, tt, { mast: seg(tt, trk - 0.1, trk + 0.5), arcs: 0.6 * seg(tt, gear - 0.1, gear + 0.3) }) }],
        overlays: [
          { type: 'card', at: srch - 0.1, x: 60, y: 390, w: 800, rows: [{ text: 'THE SEARCH BLOC', fs: 44, colour: RED }, { text: 'COLOMBIAN NATIONAL POLICE · HUNT BEGINS JULY 1992', fs: 24, colour: MUTE, at: hun }, { text: 'US SUPPORT: DEA · DIRECTION-FINDING EQUIPMENT', fs: 26, at: dea - 0.1 }] }
        ],
        tag: TAG
      });
    },

    // 4 - the weak point: the room at dusk, closer; the silhouette at the window lifts the handset to his ear on
    //     "phoning"; arcs spread from it into the window on "radiotelephone" (every call is a signal in the air)
    pe35_calls(ctx) {
      const t = ctx.t, kept = WT(ctx, 0, 2, 0.5), pho = WT(ctx, 0, 3, 0.8), fam = WT(ctx, 0, 5, 1.4), rad = WT(ctx, 0, 8, 2.3);
      const arcs = tt => { const k = seg(tt, rad - 0.1, rad + 0.3); if (k <= 0) return ''; let g = ''; for (let i = 0; i < 4; i++) { const ph = ((tt * 0.8) + i * 0.25) % 1; const r = 40 + 520 * ph; g += `<circle cx="790" cy="1120" r="${f1(r)}" fill="none" stroke="${YEL}" stroke-width="${f1(10 - 6 * ph)}" opacity="${f1(k * 0.7 * (1 - ph))}"/>`; } return g; };
      return E.cine.shot(ctx, {
        set: 'pe35_room', setOpts: { dark: 0.5 }, grade: 'night',
        cam: { keys: [{ at: 0, x: 120, y: -40, z: 1.16 }, { at: pho - 0.2, x: 160, y: -60, z: 1.24, dur: 1.2 }], handheld: 1.3 },
        figures: [{ id: 'pe35_escobar', x: 800, y: 1700, scale: 0.82, dir: -1, turn: 0.4, pose: 'stand', expr: 'neutral', silhouette: 'warm', depth: 0.75, gaze: [-0.3, 0],
          keys: [{ at: kept, pose: 'stand_tense', dur: 0.3 }, { at: pho, pose: 'hand_to_face', headTurn: -0.2, dur: 0.4 }, { at: fam, pose: 'hand_to_face', headTurn: 0.4, gaze: [0.6, -0.3], dur: 0.5 }, { at: rad + 0.5, pose: 'hand_to_face', headTurn: -0.3, dur: 0.4 }] }],
        props: [{ depth: 0.74, svg: arcs }],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'A RADIOTELEPHONE', fs: 40, sub: 'Calls to his family in Bogotá' },
          { type: 'card', at: rad - 0.1, x: 60, y: 760, w: 760, rows: [{ text: 'EVERY CALL PUT A SIGNAL IN THE AIR', fs: 30, colour: RED }, { text: 'DIRECTION-FINDING TEAMS LISTENED FOR IT', fs: 24, at: rad + 0.4 }] }
        ],
        tag: LIKENESS
      });
    },

    // 5 - the son's account (attributed, a card): the listening post; the analyst leans in on "begged" and points at the
    //     scope's blip on "kill"; the agent stiffens on "stop"
    pe35_plea(ctx) {
      const t = ctx.t, son = WT(ctx, 0, 1, 0.3), beg = WT(ctx, 0, 4, 1.1), stop = WT(ctx, 0, 6, 1.8), kill = WT(ctx, 0, 10, 2.9);
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: {}, grade: 'cold', dust: true,
        cam: { from: { x: -20, y: -20, z: 1.04 }, to: { x: 20, y: -40, z: 1.12 }, handheld: 0.9 },
        figures: [
          { id: 'analyst', x: 240, y: 1610, scale: 0.92, dir: 1, turn: 0.55, pose: 'sit_read', expr: 'focused', keys: [{ at: beg, pose: 'examine', expr: 'focused', gaze: [0.7, -0.2], dur: 0.4 }, { at: kill, pose: 'point', expr: 'realise', gaze: [0.8, -0.3], dur: 0.35 }] },
          { id: 'agent_b', x: 880, y: 1740, scale: 0.96, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', keys: [{ at: son, pose: 'stand', dur: 0.4 }, { at: stop, pose: 'stand_tense', expr: 'stern', gaze: [-0.6, -0.1], dur: 0.4 }] }
        ],
        props: [{ depth: 0.95, svg: tt => scope(600, 1360, 0.7, tt, { blip: seg(tt, kill - 0.2, kill + 0.2) }) }],
        overlays: [
          { type: 'card', at: son - 0.1, x: 60, y: 390, w: 760, rows: [{ text: "HIS SON'S ACCOUNT · CNN, 2016", fs: 26, colour: MUTE }, { text: 'HE BEGGED HIM TO STOP CALLING', fs: 40, colour: RED, at: beg - 0.1 }, { text: "'THEY ARE GOING TO KILL YOU'", fs: 28, at: kill - 0.1 }] }
        ],
        tag: TAG
      });
    },

    // 6 - THE HOW: the street at dusk; the van's mast is up; on "second" its arcs sweep out, on "trace" they converge on
    //     the centre house, which lights up in yellow; the officer and the agent point at it. Music drop on this scene.
    pe35_trace(ctx) {
      const t = ctx.t, dec = WT(ctx, 0, 0, 0.2), first = WT(ctx, 0, 4, 1.6), short = WT(ctx, 0, 7, 2.4), l1 = LS(ctx, 1, 3.2), sec = WT(ctx, 1, 1, 3.4), lon = WT(ctx, 1, 3, 3.9), tra = WT(ctx, 1, 6, 4.6);
      const lock = tt => seg(tt, tra - 0.15, tra + 0.3);
      return E.cine.shot(ctx, {
        set: 'pe35_street', setOpts: { dusk: 0.7, target: lock(t), police: 0.4 * seg(t, tra + 0.3, tra + 0.9) }, grade: 'dawn', police: 0.14 * seg(t, tra + 0.3, tra + 0.9),
        cam: { keys: [{ at: 0, x: -40, y: 0, z: 1.0 }, { at: sec - 0.2, x: 10, y: -30, z: 1.1, dur: 1.4 }], handheld: 1.4 },
        shake: [{ at: tra, amp: 5 }],
        figures: [
          { id: 'pe35_officer', x: 460, y: 1680, scale: 0.78, dir: 1, turn: 0.5, pose: 'read', expr: 'focused', depth: 1.02, keys: [{ at: first, pose: 'stand', headTurn: 0.4, gaze: [0.6, -0.3], dur: 0.4 }, { at: short, pose: 'read', dur: 0.4 }, { at: sec, pose: 'stand_tense', expr: 'realise', gaze: [0.3, -0.5], dur: 0.35 }, { at: tra, pose: 'point_up', expr: 'determined', gaze: [0.3, -0.6], dur: 0.35 }] },
          { id: 'agent_a', x: 820, y: 1600, scale: 0.7, dir: -1, turn: 0.5, pose: 'stand', expr: 'focused', keys: [{ at: dec, pose: 'stand_tense', dur: 0.4 }, { at: lon, pose: 'point', gaze: [-0.5, -0.5], dur: 0.4 }, { at: tra + 0.3, pose: 'walk', dur: 0.3 }],
            walk: { from: 820, to: 700, at: tra + 0.3, dur: 0.9, cadence: 6.5 } }
        ],
        props: [{ depth: 0.9, svg: tt => dfvan(200, 1470, 0.62, tt, { mast: 1, arcs: 0.5 * seg(tt, sec - 0.1, sec + 0.3) * (1 - 0.6 * lock(tt)) }) }],
        overlays: [
          { type: 'card', at: dec - 0.1, x: 60, y: 390, w: 800, rows: [{ text: '2 DECEMBER 1993 · A CALL TO HIS SON', fs: 26, colour: MUTE }, { text: 'FIRST CALL: SHORT', fs: 30, at: first - 0.1 }, { text: 'SECOND CALL: LONG ENOUGH', fs: 40, colour: RED, at: sec - 0.1 }, { text: 'SIGNAL LOCKED IN ABOUT 5 MINUTES', fs: 26, at: tra - 0.05 }, { text: 'A TWO-STOREY HOUSE · LOS OLIVOS, MEDELLÍN', fs: 22, colour: MUTE, at: tra + 0.6 }] }
        ],
        tag: PLACE
      });
    },

    // 7 - the raid and the death, summary only: close on the centre house under police lights; the officer reaches the
    //     door on "raided", the agents close in; on "roof" all three look up at an EMPTY roof; the death is the card.
    //     Nothing is drawn on the roof; no weapon; the cliff impact sits in the pause before the second line.
    pe35_raid(ctx) {
      const t = ctx.t, raid = WT(ctx, 0, 1, 0.4), hou = WT(ctx, 0, 3, 1.0), l1 = LS(ctx, 1, 2.2), fled = WT(ctx, 1, 1, 2.4), roof = WT(ctx, 1, 4, 3.0), shot = WT(ctx, 1, 7, 3.6), dead = WT(ctx, 1, 8, 3.9);
      return E.cine.shot(ctx, {
        set: 'pe35_street', setOpts: { dusk: 0.8, police: 0.7 }, grade: 'night', police: 0.2,
        cam: { keys: [{ at: 0, x: 0, y: 120, z: 1.24 }, { at: roof - 0.3, x: 0, y: 40, z: 1.3, dur: 1.0 }], handheld: 1.8 },
        shake: [{ at: raid, amp: 4 }, { at: shot, amp: 5 }],
        figures: [
          { id: 'pe35_officer', x: 560, y: 1700, scale: 0.8, dir: 1, turn: 0.5, pose: 'walk', expr: 'stern', depth: 1.02, walk: { from: 240, to: 560, at: 0.05, dur: Math.max(0.5, raid - 0.05), cadence: 8.0, stride: 34 },
            keys: [{ at: raid, pose: 'point', expr: 'determined', gaze: [0.8, -0.2], dur: 0.3 }, { at: fled, pose: 'stand_tense', headTurn: 0.2, gaze: [0.3, -0.7], dur: 0.4 }, { at: roof, pose: 'point_up', expr: 'shocked', gaze: [0.2, -0.9], dur: 0.35 }, { at: dead + 0.3, pose: 'stand', expr: 'stern', gaze: [0.2, -0.6], dur: 0.5 }] },
          { id: 'agent_a', x: 300, y: 1620, scale: 0.72, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', walk: { from: -60, to: 300, at: 0.1, dur: Math.max(0.5, hou - 0.1), cadence: 8.0, stride: 34 },
            keys: [{ at: hou, pose: 'stand_tense', dur: 0.4 }, { at: roof, pose: 'stand', gaze: [0.4, -0.9], dur: 0.4 }] },
          { id: 'agent_b', x: 900, y: 1620, scale: 0.72, dir: -1, turn: 0.5, pose: 'walk', expr: 'focused', walk: { from: 1240, to: 900, at: 0.1, dur: Math.max(0.5, hou - 0.1), cadence: 8.0, stride: 34 },
            keys: [{ at: hou, pose: 'stand_tense', expr: 'stern', dur: 0.4 }, { at: roof + 0.1, pose: 'stand', gaze: [-0.4, -0.9], dur: 0.4 }] }
        ],
        overlays: [
          { type: 'card', at: raid - 0.1, x: 60, y: 390, w: 800, rows: [{ text: 'POLICE RAID THE HOUSE', fs: 36, colour: RED }, { text: 'HE AND HIS BODYGUARD FLED TO THE ROOF', fs: 26, at: fled - 0.05 }, { text: 'SHOT DEAD · 2 DECEMBER 1993', fs: 32, at: shot - 0.05 }, { text: 'WHO FIRED THE FATAL SHOT IS STILL DISPUTED', fs: 22, colour: MUTE, at: dead + 0.5 }] }
        ],
        tag: TAG
      });
    },

    // 8 - the outcome in one line, wide: a rooftop above the city at dusk under distant police lights; the officer lowers
    //     his flashlight on "ended", the agent turns to the view on "birthday"
    pe35_over(ctx) {
      const t = ctx.t, hunt = WT(ctx, 0, 1, 0.3), end = WT(ctx, 0, 2, 0.6), day = WT(ctx, 0, 4, 1.2), b44 = WT(ctx, 0, 7, 2.2), bday = WT(ctx, 0, 8, 2.6);
      return E.cine.shot(ctx, {
        set: 'pe35_hill', setOpts: { police: 0.35 }, grade: 'night',
        cam: { from: { x: 0, y: 20, z: 0.98 }, to: { x: 20, y: 0, z: 1.05 }, handheld: 0.8 },
        figures: [
          { id: 'pe35_officer', x: 330, y: 1760, scale: 0.84, dir: 1, turn: 0.5, pose: 'torch', expr: 'focused', propOpts: { aim: 10, beamLen: 420 }, keys: [{ at: end, pose: 'torch_low', expr: 'neutral', dur: 0.5 }, { at: b44, pose: 'stand', headTurn: 0.4, gaze: [0.7, -0.2], dur: 0.5 }] },
          { id: 'agent_a', x: 780, y: 1700, scale: 0.74, dir: -1, turn: 0.4, pose: 'stand_tense', expr: 'stern', keys: [{ at: hunt, pose: 'stand', dur: 0.4 }, { at: bday, pose: 'stand', headTurn: 0.6, gaze: [0.8, -0.3], dur: 0.5 }] }
        ],
        overlays: [
          { type: 'card', at: 0.15, x: 60, y: 390, w: 760, rows: [{ text: '1 DECEMBER 1993 · HIS 44TH BIRTHDAY', fs: 26, colour: MUTE }, { text: '2 DECEMBER 1993 · THE 16-MONTH HUNT ENDS', fs: 34, colour: RED, at: end - 0.1 }, { text: 'HUNTED SINCE HIS ESCAPE IN JULY 1992', fs: 24, at: day }] }
        ],
        tag: PLACE
      });
    },

    // 9 - callback on the hero object (the first frame's framing): the handset on the table, the silhouette at the
    //     window with the handset at his ear on "phone", lowering it on "long", bowing on "remember" ("One phone call ran too long."). The memorial card
    //     sits at y 770-990 (outside the end-question band); the engine burns the end question over the last 3.2 s at
    //     y 520, so nothing of ours sits in y 380-720; the last frame loops to the first.
    pe35_end(ctx) {
      const t = ctx.t, sta = WT(ctx, 0, 0, 0.2), pho = WT(ctx, 0, 1, 0.4), lon = WT(ctx, 0, 5, 1.5), l1 = LS(ctx, 1, 2.6), rem = WT(ctx, 1, 1, 2.8);
      const memo = tt => { const k = seg(tt, l1 - 0.2, l1 + 0.3); if (k <= 0) return '';
        return `<g opacity="${f1(k)}">${panel(90, 770, 900, 220, 0.66)}<text x="540" y="822" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="26" fill="#e8dcc0">IN MEMORY OF THOSE THE MEDELLÍN CARTEL KILLED</text>` +
          `<text x="540" y="878" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" fill="#f4efe4">THE 107 OF AVIANCA 203 · 500+ POLICE OFFICERS</text>` +
          `<text x="540" y="930" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="26" fill="#f4efe4">JUDGES · JOURNALISTS · CANDIDATES · CIVILIANS</text>` +
          `<text x="540" y="970" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="20" fill="#bdb6a8">Colombia, 1980s-1993</text></g>`; };
      return E.cine.shot(ctx, {
        set: 'pe35_room', setOpts: { dark: 0.25 }, grade: 'warm',
        cam: { from: { x: 0, y: 60, z: 1.07 }, to: { x: 0, y: 40, z: 1.0 }, handheld: 0.6 },
        figures: [{ id: 'pe35_escobar', x: 800, y: 1700, scale: 0.82, dir: -1, turn: 0.4, pose: 'hand_to_face', expr: 'neutral', silhouette: 'warm', depth: 0.75, gaze: [-0.3, 0],
          keys: [{ at: sta, pose: 'hand_to_face', headTurn: 0.3, dur: 0.4 }, { at: lon, pose: 'stand', headTurn: 0, dur: 0.5 }, { at: rem, pose: 'bowed', dur: 0.6 }] }],
        props: [{ depth: 1.0, svg: tt => phone(HERO.x, HERO.y, HERO.s, tt, { lit: 0.3 + 0.7 * seg(tt, pho - 0.1, pho + 0.2) * (1 - seg(tt, lon + 0.2, lon + 0.8)), glow: 0.8 * seg(tt, pho - 0.2, pho + 0.2) * (1 - seg(tt, lon + 0.3, lon + 0.9)) }) }],
        overlays: [{ type: 'svg', at: l1 - 0.2, svg: memo }],
        tag: LIKENESS
      });
    }
  });
})();
