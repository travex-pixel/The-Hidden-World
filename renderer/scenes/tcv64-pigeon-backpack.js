/* Case File 64 (premium look, engagement v2: the escalating 3-item LIST): animals caught smuggling.
   ITEM 1 (the hero): Kuwait, May 2017. Customs officers near the customs building in Abdali, by the Iraqi border, caught a
   pigeon with a small fabric backpack on its back holding 178 pills (al-Rai via the BBC; an al-Rai journalist said a form of
   ketamine, other outlets said ecstasy, so the screen says "pills").
   ITEM 2: Bucaramanga, Colombia, January 2011. Police found a pigeon about a block from a prison with about 45 g of marijuana
   and cocaine paste strapped to it; they said the load was too heavy for it to clear the prison walls. Police said pigeons
   had earlier carried SIM cards into the same jail (the FUN FACT).
   ITEM 3 (the best): Welikada Prison, Sri Lanka, 1 August 2020. Jail officials caught a cat with a small bag tied around its
   neck holding about two grams of heroin, two SIM cards and a memory chip; the next day it escaped from the room it was held
   in (AFP; Sunday Observer; Daily FT).
   Structure: frame 1 = the HERO (a pigeon wearing a tiny amber backpack, fluttering above a desert customs post at dusk) with a
   customs officer looking up and pointing, the camera already pushing; the pigeon lands on the barrier arm (item 1); the
   inspection table (178 pills, the counter); a prison wall in Colombia (item 2, the fun fact); close on the wall (too heavy:
   the biggest reveal, the single impact); a departures hall (the LESSON, captions off); a prison yard at night (item 3, the
   cat; the spoken share line); the punchline back on the hero in frame 1's framing (the loop), with the end question.
   Smoothness: cuts and dissolves, one push, one zoom (the end); one slow camera move per shot; settle on the hero dolly-ins
   (first and last) and the reveal; one impact, no shake, no handheld. Screen direction: the smugglers (birds) fly left to right.
   Look: premium, one dusk palette (shadow #16202c, mid #c9b89c, accent #e8873a). The ONLY strongly coloured object is the
   contraband: the pigeon's backpack, the Colombian bird's bundle and the packet in the cat's pouch (props marked accent: true).
   Content rules: no animal is shown hurt; officers handle nothing roughly (the pigeon lands on a barrier, rests in a carrier,
   is found sitting on the pavement; the cat sits in a torch beam). Officers, the police officer, the guard and the young man
   are generic figures with no badge, patch, flag or insignia; no weapon. Prison and agency names are plain text only.
   New environments (E.registerSets): pb64_post (a desert customs post at dusk), pb64_insp (an inspection room), pb64_wall (a
   prison wall in an Andean city, wide and close), pb64_hall (an airport departures hall at dusk), pb64_yard (a prison yard at
   night). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#e8873a', ACC_D = '#b45a22';
  const PG = { body: '#8d97a6', dark: '#5c6676', light: '#b9c1cc', head: '#7a8596', neckA: '#4d8574', neckB: '#7d5c8e', band: '#2a303a', leg: '#c86c74' };

  // ---------- THE HERO: a pigeon (side view, facing right; local units: body ~200 wide). o.flap = wing phase in radians (a
  // number = flying; null = perched, wings folded); o.pack = the tiny backpack (accent); o.bundle = a taped bundle hung under
  // the belly (accent); o.blink = 0..1
  function wing(ph, col, edge) {
    const k = Math.cos(ph), r = -8 + 14 * Math.sin(ph);
    let g = `<g transform="translate(-4 -38) rotate(${f1(r)}) scale(1 ${f1(k)})">`;
    g += `<path d="M-14 6 C-34 -40 -74 -112 -118 -172 L-98 -168 L-108 -190 L-84 -178 L-90 -202 L-66 -186 L-68 -206 L-46 -188 C-22 -132 10 -62 34 6 Z" fill="${col}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    g += `<path d="M-30 -40 L-70 -120 M-14 -40 L-46 -130 M2 -34 L-26 -110" stroke="${edge}" stroke-width="3" opacity="0.7" fill="none"/>`;
    g += `<path d="M-20 -20 L18 -24" stroke="${PG.band}" stroke-width="6" stroke-linecap="round" opacity="0.8"/>`;
    return g + '</g>';
  }
  function pack() {   // the tiny backpack, strapped over the back
    let g = `<path d="M-34 -38 C-44 0 -34 36 -28 46" stroke="#3a2a20" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M22 -46 C30 -8 26 30 20 46" stroke="#3a2a20" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    g += `<g transform="translate(-10 -58) rotate(-10)">` + wash(0, 0, 70, 56, ACC, 0.22) +
      `<rect x="-42" y="-30" width="84" height="54" rx="15" fill="${ACC}" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M-42 -8 Q0 2 42 -8 L42 -20 Q42 -30 30 -30 L-30 -30 Q-42 -30 -42 -20 Z" fill="${ACC_D}" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="-7" y="-10" width="14" height="12" rx="3" fill="#e8dcc0" stroke="${INK}" stroke-width="2"/>` +
      `<path d="M-30 10 L30 10" stroke="${ACC_D}" stroke-width="3" opacity="0.8"/><path d="M-34 -24 Q-10 -30 20 -26" stroke="#f6c690" stroke-width="3" opacity="0.7" fill="none"/></g>`;
    return g;
  }
  function bundle() {   // a small taped bundle hanging under the belly on two strings
    return `<g transform="translate(-8 52)"><path d="M-14 -14 L-12 6 M12 -14 L10 6" stroke="#4a3a2c" stroke-width="3"/>` + wash(0, 26, 50, 36, ACC, 0.2) +
      `<rect x="-30" y="4" width="60" height="40" rx="9" fill="${ACC}" stroke="${INK}" stroke-width="4"/><path d="M-30 24 L30 24 M-6 4 L-6 44" stroke="${ACC_D}" stroke-width="4"/></g>`;
  }
  function pigeon(x, y, s, o = {}) {
    const dir = o.dir || 1, fly = typeof o.flap === 'number';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * dir)} ${sc(s)}) rotate(${f1(o.rot || 0)})">`;
    if (o.shadow) g += `<ellipse cx="0" cy="${o.shadow}" rx="90" ry="12" fill="#000" opacity="0.25"/>`;
    if (fly) g += wing(o.flap + 0.35, PG.dark, PG.band);
    // tail fan with a dark band
    g += `<path d="M-92 -8 L-180 -30 Q-190 -6 -184 20 L-92 16 Z" fill="${PG.dark}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-160 -25 L-180 -30 Q-190 -6 -184 20 L-164 18 Z" fill="${PG.band}"/>`;
    // legs: tucked in flight, standing when perched
    g += fly ? `<path d="M-24 38 L-54 50 M-12 40 L-42 58" stroke="${PG.leg}" stroke-width="6" stroke-linecap="round"/>`
      : `<path d="M-8 40 L-12 76 M16 40 L18 76" stroke="${PG.leg}" stroke-width="7" stroke-linecap="round"/><path d="M-26 78 L4 78 M2 78 L34 78" stroke="${PG.leg}" stroke-width="6" stroke-linecap="round"/>`;
    if (o.bundle) g += bundle();
    // body + belly light
    g += `<path d="M-100 2 C-70 -48 20 -62 66 -34 C92 -16 92 26 52 44 C10 60 -64 46 -100 2 Z" fill="${PG.body}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-46 38 C6 52 48 40 72 8" stroke="${PG.light}" stroke-width="10" opacity="0.45" fill="none" stroke-linecap="round"/>`;
    // the iridescent neck and the head
    g += `<path d="M36 -36 C44 -76 68 -98 96 -96 C122 -92 124 -60 110 -44 C94 -26 74 -6 56 10 Z" fill="${PG.neckA}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M48 -40 C58 -66 76 -76 96 -70 C86 -56 70 -36 58 -14 Z" fill="${PG.neckB}" opacity="0.6"/>`;
    g += `<circle cx="100" cy="-84" r="25" fill="${PG.head}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M120 -88 L148 -80 L120 -73 Z" fill="#3a3a40" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="122" cy="-86" rx="7" ry="5" fill="#ecebe6"/>`;
    const bl = o.blink || 0;
    g += bl > 0.5 ? `<path d="M100 -90 L114 -90" stroke="${INK}" stroke-width="3"/>` : `<circle cx="107" cy="-90" r="7" fill="#e8822e" stroke="${INK}" stroke-width="2"/><circle cx="108" cy="-90" r="3.2" fill="#111"/><circle cx="105.5" cy="-92.5" r="1.6" fill="#fff"/>`;
    // folded wing with two dark bars (perched), or the near wing (flying)
    if (!fly) g += `<path d="M-72 -24 C-22 -52 40 -46 58 -14 C30 14 -40 22 -116 6 Z" fill="${PG.light}" stroke="${INK}" stroke-width="4"/><path d="M-32 -12 L22 -18 M-42 4 L14 0" stroke="${PG.band}" stroke-width="7" stroke-linecap="round"/>`;
    else g += wing(o.flap, PG.light, PG.dark);
    if (o.pack) g += pack();
    return g + '</g>';
  }
  // flutter phase: o fast beats (Hz) with a soft hover bob
  const FL = (t, hz = 4.2) => t * hz * 2 * Math.PI;
  const BOB = (t, hz = 4.2, a = 10) => -a * Math.sin(FL(t, hz) + 0.6);
  const BLINK = (t, per = 2.7) => ((t % per) < 0.12 ? 1 : 0);

  // a sitting tabby cat (side view, facing right; ground at 0, ~230 tall at s 1) with a small clear pouch tied at its neck
  function cat(x, y, s, t, o = {}) {
    const C = '#8c7a62', CD = '#5a4a3a', CL = '#d6c8ae';
    const sw = 10 * Math.sin(t * 1.6);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * (o.dir || 1))} ${sc(s)})">`;
    g += `<ellipse cx="-10" cy="4" rx="110" ry="14" fill="#000" opacity="0.3"/>`;
    const tail = `M-58 -10 C-118 -8 ${f1(-136 + sw)} -50 ${f1(-104 + sw)} -86`;
    g += `<path d="${tail}" stroke="${INK}" stroke-width="28" fill="none" stroke-linecap="round"/><path d="${tail}" stroke="${C}" stroke-width="19" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M-72 0 C-84 -62 -52 -142 0 -150 C42 -152 62 -112 62 -62 C62 -22 52 0 30 0 Z" fill="${C}" stroke="${INK}" stroke-width="5"/>`;
    g += [[-50, -40], [-58, -80], [-40, -118]].map(([a, b]) => `<path d="M${a} ${b} q22 -6 40 6" stroke="${CD}" stroke-width="8" fill="none" stroke-linecap="round"/>`).join('');
    g += `<path d="M20 -126 C50 -108 54 -60 42 -18" stroke="${CL}" stroke-width="22" opacity="0.75" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M22 -64 L22 -4 M44 -64 L46 -4" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M22 -64 L22 -4 M44 -64 L46 -4" stroke="${C}" stroke-width="14" stroke-linecap="round"/>`;
    g += `<ellipse cx="26" cy="-2" rx="14" ry="7" fill="${CL}" stroke="${INK}" stroke-width="3"/><ellipse cx="50" cy="-2" rx="14" ry="7" fill="${CL}" stroke="${INK}" stroke-width="3"/>`;
    // head (a slow look around)
    const hr = o.look !== undefined ? o.look : 6 * Math.sin(t * 0.9);
    g += `<g transform="translate(36 -172) rotate(${f1(hr)})">`;
    g += `<path d="M-30 -24 L-24 -70 L4 -34 Z" fill="${C}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-24 -30 L-21 -56 L-6 -36 Z" fill="#c89a90"/>`;
    g += `<path d="M14 -36 L44 -68 L46 -22 Z" fill="${C}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M20 -36 L40 -56 L40 -30 Z" fill="#c89a90"/>`;
    g += `<ellipse cx="6" cy="0" rx="50" ry="42" fill="${C}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-10 -38 L-6 -24 M6 -40 L6 -26 M20 -38 L16 -24" stroke="${CD}" stroke-width="5" stroke-linecap="round"/>`;
    g += `<ellipse cx="22" cy="18" rx="22" ry="16" fill="${CL}" opacity="0.8"/>`;
    const bl = BLINK(t + 0.7, 3.1);
    g += bl ? `<path d="M-14 -4 L2 -4 M22 -4 L38 -4" stroke="${INK}" stroke-width="3"/>`
      : `<ellipse cx="-6" cy="-4" rx="9" ry="7" fill="#a8c050" stroke="${INK}" stroke-width="2"/><ellipse cx="-5" cy="-4" rx="2" ry="6" fill="#111"/><ellipse cx="30" cy="-4" rx="9" ry="7" fill="#a8c050" stroke="${INK}" stroke-width="2"/><ellipse cx="31" cy="-4" rx="2" ry="6" fill="#111"/>`;
    g += `<path d="M18 10 L28 10 L23 16 Z" fill="#c87a80"/><path d="M23 16 Q18 24 12 22 M23 16 Q28 24 34 22" stroke="${INK}" stroke-width="2" fill="none"/>`;
    g += `<path d="M36 16 L76 10 M36 20 L76 22 M8 16 L-30 10 M8 20 L-30 22" stroke="#efe8d8" stroke-width="1.6" opacity="0.8"/></g>`;
    // the clear pouch tied at the neck: a small packet (accent), two SIM cards
    if (o.pouch !== false) {
      g += `<path d="M-2 -146 Q34 -128 70 -150" stroke="#ece6d4" stroke-width="3" fill="none"/>`;
      g += `<g transform="translate(36 -136) rotate(${f1(4 * Math.sin(t * 1.6))})">` + wash(0, 22, 40, 34, ACC, 0.22) +
        `<rect x="-9" y="10" width="18" height="16" rx="3" fill="${ACC}" stroke="${INK}" stroke-width="2"/><rect x="-14" y="26" width="12" height="9" rx="1.5" fill="#e8e2c8" stroke="${INK}" stroke-width="1.5"/><rect x="2" y="26" width="12" height="9" rx="1.5" fill="#d8c070" stroke="${INK}" stroke-width="1.5"/>` +
        `<path d="M-18 0 L18 0 L22 40 Q0 48 -22 40 Z" fill="#f4f2ec" opacity="0.32" stroke="#e6e2d6" stroke-width="2.5"/><path d="M-12 6 L-14 34" stroke="#ffffff" stroke-width="3" opacity="0.5"/></g>`;
    }
    return g + '</g>';
  }

  // the red-and-white barrier arm of the customs post (pivot post on the right)
  function barrier(x0, x1, y, s = 1) {
    let g = `<rect x="${x1 - 18}" y="${y - 30}" width="46" height="${f1(200 * s)}" fill="#4a4a48" stroke="${INK}" stroke-width="5"/><rect x="${x1 - 30}" y="${y - 44}" width="70" height="40" rx="6" fill="#d8d2c4" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="${x0}" y="${y - 12}" width="${x1 - x0}" height="24" rx="8" fill="#ece6da" stroke="${INK}" stroke-width="4"/>`;
    for (let xx = x0 + 30; xx < x1 - 40; xx += 90) g += `<rect x="${xx}" y="${y - 11}" width="42" height="22" fill="#b8402e"/>`;
    return g;
  }
  // a steel inspection table edge, the open backpack and a tray of pills
  function table(t, pills, opened) {
    let g = `<rect x="-300" y="1440" width="${W + 600}" height="30" fill="#b8c0c4" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1470" width="${W + 600}" height="${H}" fill="#5a6266"/><path d="M-300 1446 L${W + 300} 1446" stroke="#eef2f2" stroke-width="4" opacity="0.6"/>`;
    g += `<rect x="440" y="1330" width="420" height="96" rx="10" fill="#d0d6d8" stroke="${INK}" stroke-width="5"/><rect x="456" y="1344" width="388" height="70" rx="6" fill="#aab4b8"/>`;
    const n = Math.round(pills);
    for (let i = 0; i < n; i++) { const u = (i * 0.618) % 1, v = (i * 0.37) % 1, px = 470 + 360 * u, py = 1356 + 52 * ((v + Math.floor(i / 40) * 0.13) % 1);
      g += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="9" ry="5.5" fill="${i % 3 ? '#efe9f2' : '#dcd2ea'}" stroke="#7a7486" stroke-width="1.2" transform="rotate(${f1(40 * u - 20)} ${f1(px)} ${f1(py)})"/>`; }
    return g;
  }
  // an open tiny backpack lying on the table (the hero object, accent)
  function packOpen(x, y, s) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">` + wash(0, 0, 120, 80, ACC, 0.25) +
      `<path d="M-60 -40 L60 -40 L66 34 Q0 46 -66 34 Z" fill="${ACC}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-60 -40 Q0 -86 60 -40 L50 -58 Q0 -96 -50 -58 Z" fill="${ACC_D}" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M-74 0 C-110 30 -100 60 -70 70 M74 0 C110 30 100 60 70 70" stroke="#3a2a20" stroke-width="7" fill="none" stroke-linecap="round"/>` +
      [[-20, -36], [6, -42], [28, -34], [-2, -30]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="10" ry="6" fill="#efe9f2" stroke="#7a7486" stroke-width="1.5"/>`).join('') + '</g>';
  }
  // a ventilated pet carrier (the pigeon rests inside, unharmed)
  function carrier(x, y, s, door = 1) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-150" y="-180" width="300" height="180" rx="22" fill="#cfc8b8" stroke="${INK}" stroke-width="6"/>`;
    for (let i = 0; i < 6; i++) g += `<rect x="${-120 + i * 34}" y="-160" width="16" height="40" rx="6" fill="#8a8476"/>`;
    g += `<rect x="-150" y="-110" width="300" height="12" fill="#b4ac9a"/>`;
    return g + '</g>';
  }
  function carrierFront(x, y, s) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M-150 -180 L-150 0 L150 0 L150 -180" fill="none" stroke="${INK}" stroke-width="6"/>`;
    for (let i = 0; i < 9; i++) g += `<path d="M${-130 + i * 32} -176 L${-130 + i * 32} -4" stroke="#9a9488" stroke-width="5"/>`;
    return g + '</g>';
  }
  // a stone bench against the yard wall (the cat sits on it)
  const bench = (x, y) => `<ellipse cx="${x}" cy="${y + 96}" rx="240" ry="16" fill="#000" opacity="0.3"/><rect x="${x - 220}" y="${y}" width="440" height="34" rx="6" fill="#8a867c" stroke="${INK}" stroke-width="5"/><rect x="${x - 190}" y="${y + 34}" width="50" height="60" fill="#6a665e" stroke="${INK}" stroke-width="4"/><rect x="${x + 140}" y="${y + 34}" width="50" height="60" fill="#6a665e" stroke="${INK}" stroke-width="4"/>`;
  // a wrapped parcel (lesson)
  const parcel = (x, y, s, r = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)}) rotate(${f1(r)})"><rect x="-70" y="-50" width="140" height="100" rx="6" fill="#b48c5e" stroke="${INK}" stroke-width="5"/><path d="M-70 -4 L70 -4 M-6 -50 L-6 50" stroke="#e8dcc0" stroke-width="8"/><path d="M-6 -50 q-30 -26 -40 -6 q10 10 40 6 q30 -26 40 -6 q-10 10 -40 6" fill="none" stroke="#e8dcc0" stroke-width="5"/></g>`;
  const suitcase = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="6" rx="110" ry="14" fill="#000" opacity="0.3"/><rect x="-90" y="-260" width="180" height="250" rx="20" fill="#3c4650" stroke="${INK}" stroke-width="6"/><path d="M-40 -260 L-40 -300 L40 -300 L40 -260" stroke="#2a3038" stroke-width="10" fill="none"/><path d="M-90 -170 L90 -170 M-90 -90 L90 -90" stroke="#2a3038" stroke-width="5"/><circle cx="-60" cy="0" r="10" fill="#1a1a1a"/><circle cx="60" cy="0" r="10" fill="#1a1a1a"/></g>`;

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a desert customs post at dusk: a violet-to-amber sky, low dunes and a distant border fence with floodlights, a long flat
    // customs canopy with lit booths on the right, sand with tyre tracks
    pb64_post(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="pbpsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121a2c"/><stop offset="0.5" stop-color="#3e3c5c"/><stop offset="0.8" stop-color="#a8705e"/><stop offset="1" stop-color="#e2a072"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#pbpsky)"/>`;
      sky += E.cine.stars(t, 50, 6401, -200, 520) + wash(180, 1120, 520, 180, '#ffc890', 0.32) + `<circle cx="180" cy="1150" r="40" fill="#ffd8a8" opacity="0.65"/>`;
      let far = `<path d="M-400 1140 Q-150 1100 100 1130 Q380 1090 640 1124 Q900 1094 1160 1126 Q1340 1104 1480 1120 L1480 1200 L-400 1200 Z" fill="#6a5052"/>`;
      for (let x = -390; x < W + 400; x += 18) far += `<rect x="${x}" y="1118" width="4" height="26" fill="#3a2e30" opacity="0.8"/>`;
      far += `<path d="M-400 1122 L1480 1122" stroke="#3a2e30" stroke-width="3" opacity="0.8"/>`;
      [-140, 300, 1240].forEach(x => { far += `<rect x="${x}" y="1040" width="5" height="84" fill="#2a2426"/><circle cx="${x + 2}" cy="1040" r="6" fill="#fff0c8"/>` + wash(x + 2, 1046, 70, 50, '#ffe0a0', 0.3); });
      let post = `<rect x="560" y="880" width="1000" height="44" fill="#d6ccb8" stroke="${INK}" stroke-width="6"/><rect x="560" y="924" width="1000" height="16" fill="#8a8274"/>`;
      for (let i = 0; i < 6; i++) post += `<rect x="${600 + i * 180}" y="940" width="30" height="270" fill="#a8a092" stroke="${INK}" stroke-width="4"/>`;
      for (let i = 0; i < 6; i++) post += `<rect x="${640 + i * 160}" y="934" width="90" height="8" fill="#fff4dc"/>` + wash(685 + i * 160, 990, 90, 70, '#fff0d0', 0.2);
      post += `<rect x="700" y="1030" width="210" height="180" fill="#bcb2a2" stroke="${INK}" stroke-width="5"/><rect x="726" y="1060" width="158" height="90" fill="#f6dca0" opacity="0.9" stroke="${INK}" stroke-width="4"/>` + wash(805, 1105, 160, 100, '#ffe0a0', 0.22);
      post += `<rect x="1060" y="1030" width="210" height="180" fill="#bcb2a2" stroke="${INK}" stroke-width="5"/><rect x="1086" y="1060" width="158" height="90" fill="#f6dca0" opacity="0.85" stroke="${INK}" stroke-width="4"/>`;
      post += `<rect x="560" y="1206" width="1000" height="14" fill="#7a7266"/>`;
      let ground = `<rect x="-400" y="1196" width="${W + 800}" height="${H}" fill="#8a6c54"/><path d="M-400 1200 L1480 1200" stroke="#a88a6c" stroke-width="5" opacity="0.6"/>`;
      ground += `<path d="M-200 1980 Q300 1560 760 1230 M60 1980 Q520 1580 860 1236" stroke="#74584a" stroke-width="22" fill="none" opacity="0.7"/>`;
      for (let i = 0; i < 14; i++) ground += `<path d="M${-300 + i * 120} ${1300 + (i % 4) * 140} q60 -18 120 0" stroke="#9c7e62" stroke-width="5" fill="none" opacity="0.5"/>`;
      ground += E.cine.scrub(1260, 12, 6403, '#5a4a3a', 0.6, -300, 520);
      const fg = E.cine.scrub(1900, 8, 6405, '#3a2e26', 1.5, -200, 480);
      return { light: { dir: -1, rim: '#ffcfa0', key: '#f0d8c0' }, layers: [[0.05, sky], [0.3, far], [0.55, post], [0.8, ground], [1.14, fg]] };
    },

    // an inspection room: pale tiled wall, a fluorescent tube, a blank notice board, a window with a blind (dusk outside)
    pb64_insp(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#7e8c86"/>`;
      for (let y = 200; y < 1440; y += 70) wall += `<path d="M-300 ${y} L${W + 300} ${y}" stroke="#6c7a74" stroke-width="3"/>`;
      for (let x = -280; x < W + 300; x += 70) wall += `<path d="M${x} 200 L${x} 1440" stroke="#6c7a74" stroke-width="3"/>`;
      wall += `<rect x="-300" y="-300" width="${W + 600}" height="500" fill="#5e6a66"/>`;
      wall += `<rect x="60" y="430" width="330" height="420" fill="#2c3448" stroke="${INK}" stroke-width="8"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<rect x="66" y="${440 + i * 46}" width="318" height="26" fill="#c8bca4" opacity="0.85"/>`).join('') + wash(225, 640, 180, 220, '#ffcfa0', 0.12);
      wall += `<rect x="640" y="460" width="360" height="260" fill="#8a7458" stroke="${INK}" stroke-width="6"/>` + [[670, 490, 120, 150], [820, 500, 150, 110], [830, 630, 120, 70]].map(([a, b, c, d]) => `<rect x="${a}" y="${b}" width="${c}" height="${d}" fill="#eee6d6" stroke="#4a4036" stroke-width="2"/>`).join('');
      const lamp = `<rect x="200" y="250" width="680" height="26" rx="10" fill="#f6f8f0" opacity="${f1(0.92 + 0.04 * Math.sin(t * 9))}"/><rect x="190" y="244" width="700" height="10" fill="#4a5250"/>` + wash(540, 360, 620, 260, '#e8f4ee', 0.2);
      return { light: { dir: 1, rim: '#e8f4ee', key: '#dce8e2' }, layers: [[0.3, wall], [0.4, lamp]] };
    },

    // a prison wall in a hilly Andean city, late afternoon: green mountains, low houses on the left, a tall cream wall with
    // coiled wire and a watchtower on the right, a street and a pavement. o.close: nearer, the wall fills the right side
    pb64_wall(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), cl = !!o.close;
      let sky = `<defs><linearGradient id="pbwsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3e5274"/><stop offset="0.65" stop-color="#9aa2b0"/><stop offset="1" stop-color="#e8c09a"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1600" fill="url(#pbwsky)"/>` + wash(240, 900, 420, 240, '#ffe0b8', 0.22);
      sky += `<path d="M-400 1000 Q-200 860 0 920 Q200 800 420 900 Q640 780 880 880 Q1100 820 1480 900 L1480 1200 L-400 1200 Z" fill="#5a7262" opacity="0.85"/><path d="M-400 1060 Q-100 980 200 1030 Q500 960 800 1020 Q1100 980 1480 1030 L1480 1200 L-400 1200 Z" fill="#4a6052"/>`;
      let town = '';
      const cols = ['#c8a888', '#a8b4a0', '#d4b8a0', '#b0a0a8', '#c8bc98'];
      const n = cl ? 3 : 5;
      for (let i = 0; i < n; i++) { const x = -260 + i * 150, h = 150 + (i * 53) % 90; town += `<rect x="${x}" y="${1200 - h}" width="140" height="${h}" fill="${cols[i % 5]}" stroke="${INK}" stroke-width="4"/><rect x="${x + 36}" y="${1200 - h + 30}" width="40" height="46" fill="#3a3a40" opacity="0.7"/><path d="M${x - 8} ${1200 - h} L${x + 148} ${1200 - h}" stroke="#8a5040" stroke-width="10"/>`; }
      const wx = cl ? 560 : 520, top = cl ? 560 : 820, wb = 1290;
      let wall = `<rect x="${wx}" y="${top}" width="${W + 400 - wx}" height="${wb - top}" fill="#cdb990" stroke="${INK}" stroke-width="6"/><rect x="${wx - 10}" y="${top - 26}" width="${W + 420 - wx}" height="30" fill="#a8946c" stroke="${INK}" stroke-width="5"/>`;
      for (let i = 0; i < 6; i++) wall += `<path d="M${wx + 60 + i * 140} ${top + 10} q${10 + i * 3} ${120 + i * 20} -6 ${220 + i * 30}" stroke="#a89470" stroke-width="${8 + (i % 3) * 4}" opacity="0.35" fill="none"/>`;
      for (let y = top + 80; y < wb; y += 110) wall += `<path d="M${wx} ${y} L${W + 400} ${y}" stroke="#b8a47c" stroke-width="3" opacity="0.6"/>`;
      // coiled wire along the top
      let coil = '';
      for (let x = wx; x < W + 400; x += 34) coil += `<ellipse cx="${x}" cy="${top - 52}" rx="26" ry="24" fill="none" stroke="#3a3c40" stroke-width="3" opacity="0.85"/>`;
      // watchtower
      const tx = cl ? 1180 : 1000, ty = top - 200;
      let tower = `<rect x="${tx}" y="${ty}" width="150" height="230" fill="#bca880" stroke="${INK}" stroke-width="5"/><rect x="${tx + 18}" y="${ty + 40}" width="114" height="60" fill="#2c3036"/><path d="M${tx - 20} ${ty} L${tx + 75} ${ty - 70} L${tx + 170} ${ty} Z" fill="#8a5a44" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
      let street = `<rect x="-400" y="1290" width="${W + 800}" height="70" fill="#a8a296"/><rect x="-400" y="1290" width="${W + 800}" height="10" fill="#d0cabc"/><rect x="-400" y="1360" width="${W + 800}" height="${H}" fill="#55565a"/>`;
      for (let i = 0; i < 7; i++) street += `<rect x="${-200 + i * 260}" y="1640" width="140" height="14" fill="#e8e0c8" opacity="0.55"/>`;
      for (let x = -380; x < W + 400; x += 110) street += `<path d="M${x} 1292 L${x + 10} 1358" stroke="#8a8478" stroke-width="3"/>`;
      // a tree on the left
      const tree = `<path d="M${cl ? 180 : 300} 1300 Q${cl ? 170 : 290} 1100 ${cl ? 200 : 320} 980" stroke="#4a3a2c" stroke-width="22" fill="none"/>` + [[0, 0, 120], [-90, 40, 90], [90, 30, 100], [0, -70, 90]].map(([a, b, r]) => `<circle cx="${(cl ? 200 : 320) + a + 6 * Math.sin(t * 0.8 + a)}" cy="${960 + b}" r="${r}" fill="#4e6a44" opacity="0.92"/>`).join('');
      return { light: { dir: 1, rim: '#ffd8b0', key: '#f6e4cc' }, layers: [[0.05, sky], [0.3, town], [0.5, coil + wall + tower], [0.55, tree], [0.8, street]] };
    },

    // an airport departures hall at dusk (generic): a tall glass wall with a parked jet outside (no livery), overhead light
    // rows, a polished floor with reflections, a check-in counter on the right
    pb64_hall(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let out = `<defs><linearGradient id="pbhsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2640"/><stop offset="0.7" stop-color="#6a5a74"/><stop offset="1" stop-color="#d89a72"/></linearGradient></defs><rect x="-400" y="200" width="${W + 800}" height="1040" fill="url(#pbhsky)"/>`;
      out += `<rect x="-400" y="1120" width="${W + 800}" height="120" fill="#3a3a44"/>`;
      const px = 300 + 30 * Math.sin(t * 0.2);
      out += `<g transform="translate(${f1(px)} 1080)"><path d="M-320 0 Q-330 -40 -280 -46 L260 -46 Q330 -40 340 -10 Q330 10 260 12 L-280 12 Q-320 10 -320 0 Z" fill="#c8ccd2"/><path d="M-40 -10 L-200 70 L-140 70 L60 -6 Z" fill="#a8acb2"/><path d="M-280 -46 L-330 -150 L-280 -150 L-220 -46 Z" fill="#b8bcc2"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<rect x="${-200 + i * 44}" y="-34" width="16" height="12" rx="4" fill="#ffe8b8" opacity="0.8"/>`).join('') + `</g>`;
      let glass = '';
      for (let x = -300; x < W + 400; x += 220) glass += `<rect x="${x}" y="200" width="18" height="1040" fill="#20242c"/>`;
      glass += `<rect x="-400" y="640" width="${W + 800}" height="14" fill="#20242c"/><rect x="-400" y="186" width="${W + 800}" height="30" fill="#2a2e36"/>`;
      let roof = `<rect x="-400" y="-300" width="${W + 800}" height="500" fill="#2e323a"/>`;
      for (let i = 0; i < 9; i++) roof += `<rect x="${-300 + i * 190}" y="140" width="110" height="12" rx="4" fill="#fff2d8" opacity="0.95"/>` + wash(-245 + i * 190, 170, 110, 60, '#fff0d0', 0.2);
      let floor = `<rect x="-400" y="1240" width="${W + 800}" height="${H}" fill="#6a6668"/><path d="M-400 1240 L1480 1240" stroke="#3a383c" stroke-width="6"/>` + wash(540, 1500, 700, 200, '#d8a080', 0.14);
      for (let i = 0; i < 8; i++) floor += `<path d="M${-260 + i * 220} 1240 L${-760 + i * 340} 1980" stroke="#5a5658" stroke-width="3"/>`;
      floor += `<rect x="860" y="1100" width="420" height="160" fill="#4a4e58" stroke="${INK}" stroke-width="5"/><rect x="860" y="1100" width="420" height="20" fill="#d8d2c6"/>`;
      return { light: { dir: 1, rim: '#ffd0a8', key: '#f0dcc8' }, layers: [[0.15, out], [0.4, glass + roof], [0.75, floor]] };
    },

    // a prison yard at night (generic, tropical): a high whitewashed wall with a lamp on a bracket (warm sodium light, moths),
    // an arched gate with bars, a palm over the wall, packed earth and a drain
    pb64_yard(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="pbysky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060a16"/><stop offset="1" stop-color="#1c2840"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1400" fill="url(#pbysky)"/>` + E.cine.stars(t, 70, 6411, -200, 700);
      const palm = `<path d="M980 800 Q960 520 1010 300" stroke="#141a16" stroke-width="26" fill="none"/>` + [-150, -100, -40, 20, 80, 140].map((a, i) => `<path d="M1010 300 q${f1(a * 1.4 + 8 * Math.sin(t + i))} ${-40 + Math.abs(a) * 0.6} ${f1(a * 2.6)} ${f1(120 + Math.abs(a) * 0.2)}" stroke="#141a16" stroke-width="16" fill="none" stroke-linecap="round"/>`).join('');
      let wall = `<rect x="-400" y="620" width="${W + 800}" height="700" fill="#a8a69e" stroke="${INK}" stroke-width="6"/><rect x="-400" y="596" width="${W + 800}" height="30" fill="#8a887e" stroke="${INK}" stroke-width="5"/>`;
      for (let i = 0; i < 7; i++) wall += `<path d="M${-260 + i * 230} 640 q${12 + i * 2} 160 -4 ${300 + i * 30}" stroke="#7e7c72" stroke-width="${10 + (i % 3) * 4}" opacity="0.4" fill="none"/>`;
      wall += `<path d="M120 1320 L120 900 Q120 760 260 760 Q400 760 400 900 L400 1320 Z" fill="#20242a" stroke="${INK}" stroke-width="6"/>`;
      for (let x = 140; x < 400; x += 32) wall += `<path d="M${x} 790 L${x} 1320" stroke="#4a4e56" stroke-width="7"/>`;
      wall += `<path d="M120 960 L400 960 M120 1140 L400 1140" stroke="#4a4e56" stroke-width="7"/>`;
      const lampOn = 0.92 + 0.05 * Math.sin(t * 7);
      wall += `<path d="M640 700 L700 700 L700 730" stroke="#2a2a2a" stroke-width="8" fill="none"/><path d="M676 730 L724 730 L716 752 L684 752 Z" fill="#3a3a3a"/><ellipse cx="700" cy="756" rx="18" ry="8" fill="#ffd890" opacity="${f1(lampOn)}"/>` + wash(700, 900, 420, 380, '#ffc870', f1(0.3 * lampOn));
      for (let i = 0; i < 4; i++) { const a = t * (2 + i) + i * 2; wall += `<circle cx="${f1(700 + 40 * Math.cos(a))}" cy="${f1(780 + 26 * Math.sin(a * 1.3))}" r="2.5" fill="#fff4d8" opacity="0.8"/>`; }
      let ground = `<rect x="-400" y="1316" width="${W + 800}" height="${H}" fill="#3a342c"/><rect x="-400" y="1316" width="${W + 800}" height="24" fill="#4a4438"/>` + wash(700, 1420, 520, 140, '#ffc870', 0.16);
      ground += `<rect x="-400" y="1340" width="${W + 800}" height="18" fill="#22201c"/>` + E.cine.scrub(1500, 10, 6413, '#2a2a20', 0.6, -300, 1300);
      return { light: { dir: 1, rim: '#ffd890', key: '#e8d0a8' }, layers: [[0.05, sky], [0.3, palm], [0.5, wall], [0.8, ground]] };
    }
  });

  // the hero arrangement (frame 1 and the last frame): the pigeon hovering left of centre under the headline, the officer
  // lower right looking up at it
  const HX = t => lerp(430, 520, ease.inOut(clamp(t / 6, 0, 1))), HY = t => 930 + BOB(t);
  const OFF = { x: 820, y: 1730, s: 0.86 };

  E.registerScenes({
    // 1 - hook (frame 1): the pigeon with the tiny backpack flutters above the customs post; the officer below looks up and
    //     points; the camera already pushing in
    pb64_hook(ctx) {
      const t = ctx.t, T = ctx.T, lw = WT(ctx, 1, 8, 4.4);
      return E.cine.shot(ctx, {
        set: 'pb64_post', grade: 'dawn', haze: 0.35,
        cam: { from: { x: 0, y: 30, z: 1.02 }, to: { x: 16, y: 40, z: 1.1 }, settle: true },
        figures: [
          { id: 'pb64_officer', x: OFF.x, y: OFF.y, scale: OFF.s, dir: -1, turn: 0.35, pose: 'point_up', expr: 'shocked', gaze: [-0.6, -0.8], depth: 1.02, hat: { style: 'cap', color: '#6a5e48' },
            keys: [{ at: 2.6, pose: 'stand', expr: 'focused', gaze: [-0.5, -0.7], dur: 0.6 }, { at: lw - 0.1, pose: 'hand_to_face', expr: 'blank', gaze: [-0.5, -0.6], dur: 0.5 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => pigeon(HX(tt), HY(tt), 1.35, { flap: FL(tt), pack: true, blink: BLINK(tt) }) }
        ],
        overlays: [
          { type: 'label', at: Math.max(LS(ctx, 1, 2.6) + 0.1, 3.1), x: 60, y: 1180, text: 'CAUGHT BY CUSTOMS', fs: 38, sub: 'One pigeon, one tiny backpack' }
        ],
        tag: TAG
      });
    },

    // 2 - item 1: the pigeon flutters down onto the barrier arm; the officer walks up and holds out his hand on 'caught'
    pb64_catch(ctx) {
      const t = ctx.t, T = ctx.T, ku = WT(ctx, 0, 0, 0.2), ca = WT(ctx, 0, 2, 0.8);
      const land = ca + 0.2, P0 = [240, 820], P1 = [470, 1166];
      const pos = tt => { const u = ease.inOut(seg(tt, -0.3, land)); return [lerp(P0[0], P1[0], u), lerp(P0[1], P1[1], u) + (u < 1 ? BOB(tt) * (1 - u) : 0)]; };
      return E.cine.shot(ctx, {
        set: 'pb64_post', grade: 'dawn', haze: 0.35,
        cam: { from: { x: 40, y: 60, z: 1.12 }, to: { x: 60, y: 70, z: 1.16 } },
        figures: [
          { id: 'pb64_officer', x: 1080, y: 1740, scale: 0.9, dir: -1, turn: 0.35, pose: 'stand', expr: 'focused', gaze: [-0.5, -0.4], depth: 1.02, hat: { style: 'cap', color: '#6a5e48' },
            walk: { at: 0.05, dur: 1.4, cadence: 3.4, stride: 14, from: 1080, to: 880 }, keys: [{ at: ca, pose: 'present', expr: 'realise', gaze: [-0.6, -0.2], dur: 0.45 }] }
        ],
        props: [
          { depth: 1.0, svg: barrier(320, 1000, 1260) },
          { depth: 1.01, accent: true, svg: tt => { const [x, y] = pos(tt), flying = tt < land + 0.05;
            return pigeon(x, y, 1.0, { flap: flying ? FL(tt, 5) : null, pack: true, blink: BLINK(tt), rot: flying ? 6 : 0 }); } }
        ],
        overlays: [
          { type: 'label', at: ku + 0.05, x: 60, y: 470, text: 'ABDALI, KUWAIT · MAY 2017', fs: 40, sub: 'Customs, near the Iraqi border' }
        ],
        tag: TAG
      });
    },

    // 3 - the statistic: the inspection table; the open backpack, the pills counted out into a tray; the pigeon rests in a
    //     carrier behind; the officer leans in; the counter to 178
    pb64_pills(ctx) {
      const t = ctx.t, T = ctx.T, n = WT(ctx, 0, 5, 1.6);
      const pills = tt => 178 * ease.out(seg(tt, n - 0.1, n + 1.3));
      return E.cine.shot(ctx, {
        set: 'pb64_insp', grade: 'cold', haze: 0.3, dof: true,
        cam: { from: { x: 10, y: 40, z: 1.0 }, to: { x: -10, y: 50, z: 1.07 } },
        figures: [
          { id: 'pb64_officer', x: 900, y: 1760, scale: 1.0, dir: -1, turn: 0.4, pose: 'examine', expr: 'focused', gaze: [-0.4, 0.5], depth: 0.97, hat: { style: 'cap', color: '#6a5e48' },
            keys: [{ at: n + 0.2, pose: 'hand_to_face', expr: 'shocked', gaze: [-0.5, 0.4], dur: 0.45 }] }
        ],
        props: [
          { depth: 0.95, svg: tt => carrier(250, 1430, 1.0) + pigeon(250, 1340, 0.62, { flap: null, blink: BLINK(tt + 1.1, 2.3) }) + carrierFront(250, 1430, 1.0) },
          { depth: 1.0, svg: tt => table(tt, pills(tt), true) },
          { depth: 1.01, accent: true, svg: packOpen(650, 1316, 0.9) }
        ],
        overlays: [
          { type: 'counter', at: n - 0.1, dur: 1.4, from: 0, to: 178, prefix: '', suffix: '', label: 'PILLS IN ONE TINY BACKPACK', y: 640, fs: 150 },
          { type: 'label', at: n + 0.3, x: 90, y: 810, text: 'AL-RAI VIA BBC · MAY 2017', fs: 32, sub: 'Reportedly a form of ketamine' }
        ],
        tag: TAG
      });
    },

    // 4 - item 2: a prison wall in Colombia, late afternoon; a pigeon labours in from the left, low, a bundle under its belly;
    //     a police officer on the pavement looks up; the FUN FACT (SIM cards)
    pb64_colombia(ctx) {
      const t = ctx.t, T = ctx.T, co = WT(ctx, 1, 1, 2.4), l2 = LS(ctx, 1, 2.2);
      const X = tt => lerp(-160, 520, seg(tt, l2 - 0.6, T + 0.4)), Y = tt => 1000 - 60 * seg(tt, l2 - 0.6, T) + BOB(tt, 5.5, 18);
      return E.cine.shot(ctx, {
        set: 'pb64_wall', grade: 'warm', haze: 0.4,
        cam: { from: { x: -10, y: 20, z: 1.0 }, to: { x: 10, y: 30, z: 1.06 } },
        figures: [
          { id: 'pb64_police', x: 860, y: 1720, scale: 0.72, dir: -1, turn: 0.35, pose: 'stand', expr: 'neutral', depth: 1.02, hat: { style: 'cap', color: '#3e4830' },
            keys: [{ at: co + 0.3, pose: 'point_up', expr: 'realise', gaze: [-0.6, -0.6], dur: 0.45 }] }
        ],
        props: [
          { depth: 0.9, accent: true, svg: tt => tt < l2 - 0.6 ? '' : pigeon(X(tt), Y(tt), 0.7, { flap: FL(tt, 5.5), bundle: true, rot: -4 }) }
        ],
        overlays: [
          { type: 'funfact', at: l2 + 1.2, y: 470, rows: [{ text: 'PIGEONS HAD ALREADY FLOWN' }, { text: 'SIM CARDS INTO THAT JAIL' }, { text: 'Colombian police, via Time and Colombia Reports', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 5 - THE BIGGEST REVEAL: close on the wall; the pigeon flaps hard, climbs, stalls well short of the top and flutters
    //     down to the pavement; the officer kneels beside it (the single impact on 'heavy')
    pb64_heavy(ctx) {
      const t = ctx.t, T = ctx.T, hv = WT(ctx, 0, 5, 1.0), wl = WT(ctx, 0, 9, 1.7);
      const path = tt => {
        if (tt < hv) { const u = seg(tt, -0.4, hv); return [lerp(80, 400, u), lerp(1080, 880, ease.out(u)) + BOB(tt, 6.5, 22), FL(tt, 6.5)]; }
        if (tt < hv + 1.4) { const u = seg(tt, hv, hv + 1.4); return [lerp(400, 560, u), lerp(880, 1660, ease.inOut(u)) + BOB(tt, 3, 10) * (1 - u), FL(tt, 3)]; }
        return [560, 1660, null];
      };
      return E.cine.shot(ctx, {
        set: 'pb64_wall', setOpts: { close: true }, grade: 'warm', haze: 0.35,
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 10, y: 60, z: 1.08 }, settle: true },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'pb64_police', x: 860, y: 1760, scale: 0.92, dir: -1, turn: 0.35, pose: 'stand', expr: 'focused', gaze: [-0.5, -0.6], depth: 1.02, hat: { style: 'cap', color: '#3e4830' },
            keys: [{ at: hv + 0.1, pose: 'stand', expr: 'shocked', gaze: [-0.6, -0.3], dur: 0.4 }, { at: wl + 0.3, pose: 'kneel', expr: 'realise', gaze: [-0.8, 0.4], dur: 0.6 }], propOverride: null }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => { const [x, y, fl] = path(tt); return pigeon(x, y, 0.95, { flap: fl, bundle: true, blink: fl === null ? BLINK(tt) : 0, rot: fl === null ? 0 : -8 }); } }
        ],
        overlays: [
          { type: 'impact', at: hv, x: 540, y: 900 },
          { type: 'label', at: wl + 0.2, x: 60, y: 420, text: 'BUCARAMANGA, COLOMBIA · JAN 2011', fs: 36, sub: 'About 45 g of marijuana and cocaine paste' }
        ],
        tag: TAG
      });
    },

    // 6 - the LESSON (save trigger, for the viewer): a young man in a departures hall looks down at a wrapped parcel on top of
    //     his suitcase; the checklist card with the SAVE ribbon (captions off)
    pb64_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 7, 1.8);
      return E.cine.shot(ctx, {
        set: 'pb64_hall', grade: 'warm', haze: 0.4, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'pb64_viewer', x: 360, y: 1740, scale: 0.98, dir: 1, turn: 0.35, pose: 'stand', expr: 'neutral', depth: 1.02,
            keys: [{ at: 0.3, pose: 'examine', expr: 'focused', gaze: [0.5, 0.6], dur: 0.5 }, { at: sv + 0.3, pose: 'hand_to_face', expr: 'worried', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.03, svg: suitcase(690, 1760, 1.0) },
          { depth: 1.03, svg: parcel(690, 1460, 0.95, -4) }
        ],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 430, rows: [{ text: 'CARRY ONLY YOUR OWN BAGS', fs: 42 }, { text: 'KNOW WHAT IS INSIDE THEM', fs: 42 }, { text: 'PAID TO CARRY? RED FLAG', fs: 42 }, { text: 'UK Travel Aware (FCDO) · Smartraveller (Australia)', fs: 24, colour: '#c9b89c' }] }
        ],
        tag: TAG
      });
    },

    // 7 - item 3 (the best): a prison yard at night; a cat sits under the wall lamp with a clear pouch tied at its neck; a
    //     guard steps in from the right with a torch and finds it; the cat looks round, unbothered
    pb64_cat(ctx) {
      const t = ctx.t, T = ctx.T, ct = WT(ctx, 0, 5, 1.2), l2 = LS(ctx, 1, 3.2);
      return E.cine.shot(ctx, {
        set: 'pb64_yard', grade: 'night', haze: 0.45,
        cam: { from: { x: -20, y: 40, z: 1.0 }, to: { x: 0, y: 50, z: 1.07 } },
        figures: [
          { id: 'pb64_guard', x: 1180, y: 1740, scale: 0.86, dir: -1, turn: 0.35, pose: 'torch', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#5a5040' }, propOpts: { beamLen: 520 },
            walk: { at: 0.0, dur: 1.4, cadence: 3.4, stride: 14, from: 1180, to: 900 }, keys: [{ at: ct, pose: 'torch', expr: 'shocked', dur: 0.4 }, { at: l2 + 0.2, pose: 'hand_to_face', expr: 'blank', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => bench(470, 1250) + cat(470, 1250, 1.3, tt, { look: tt > ct ? 14 * ease.out(seg(tt, ct, ct + 0.5)) - 4 : 6 * Math.sin(tt * 0.9) }) + wash(470, 1130, 260, 200, '#fff4cf', f1(0.1 * seg(tt, ct - 0.3, ct + 0.3))) }
        ],
        overlays: [
          { type: 'label', at: ct + 0.15, x: 60, y: 470, text: 'WELIKADA PRISON, SRI LANKA · AUG 2020', fs: 34, sub: 'In its pouch: heroin, two SIM cards, a memory chip' }
        ],
        tag: TAG
      });
    },

    // 8 - the punchline back on the hero in frame 1's framing (the loop): the pigeon hovers over the customs post, the officer
    //     looks up; the camera eases back to frame 1's framing; the escape label until the end question takes over
    pb64_end(ctx) {
      const t = ctx.t, T = ctx.T, oc = WT(ctx, 1, 1, 1.6);
      const ex = tt => lerp(520, 430, ease.inOut(seg(tt, 0, T)));
      return E.cine.shot(ctx, {
        set: 'pb64_post', grade: 'dawn', haze: 0.35,
        cam: { from: { x: 16, y: 40, z: 1.1 }, to: { x: 0, y: 30, z: 1.02 }, settle: true },
        figures: [
          { id: 'pb64_officer', x: OFF.x, y: OFF.y, scale: OFF.s, dir: -1, turn: 0.35, pose: 'stand', expr: 'focused', gaze: [-0.5, -0.7], depth: 1.02, hat: { style: 'cap', color: '#6a5e48' },
            keys: [{ at: Math.max(0.3, T - 1.4), pose: 'point_up', expr: 'shocked', gaze: [-0.6, -0.8], dur: 0.6 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => pigeon(ex(tt), HY(tt), 1.35, { flap: FL(tt), pack: true, blink: BLINK(tt) }) }
        ],
        overlays: [
          { type: 'label', at: oc, x: 60, y: 1180, text: 'THE CAT ESCAPED THE NEXT DAY', fs: 38, sub: 'Sri Lanka, Aug 2020 · via AFP' }
        ],
        tag: TAG
      });
    }
  });
})();
