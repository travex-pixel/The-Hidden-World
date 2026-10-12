/* Case File 29 (cinematic, 40-second cut): Eric Rudolph, the Centennial Olympic Park bomber, and a grocery-store dumpster.
   CLOSED: pleaded guilty April 2005 (death penalty off the table); life without parole; ADX Florence.
   Structure (short40 + the EPISODE 29+ rules): a burned-in hook headline that leads with the OBJECT, over the HERO OBJECT:
   a generic green dumpster behind a small-town store at night, lit by a patrol car's spotlight, big and centred in the
   first frame and again in the last (the video loops). A stakes number by 0:10 (one woman killed, more than 100 injured);
   fast beats (three more bombings and the Ten Most Wanted list; more than 200 agents in the mountains); the irony and the
   HOW at about 60% (a 21-year-old rookie on patrol; a man digging through the dumpster for food); the reveal (a fake
   name; recognised at the jail); the outcome in one line; the callback; the memorial; a burned-in YES/NO end question
   (episode.end_title) over the last 3.2 s. No nextcase card.
   Content rules:
   - No bomb, backpack, explosion, park, victim or injury is drawn anywhere. The toll is a typed card in a quiet room.
   - Rudolph appears ONLY as an anonymous rim-lit silhouette (characters/figures/er29_rudolph.json): no face, no likeness,
     never his booking photo, never posed heroically. None of his words or beliefs are quoted. Every shot he is in is
     tagged 'ILLUSTRATION · NOT A LIKENESS'.
   - The officer is a generic figure (er29_officer) and is not named. No weapon is drawn.
   - No brand or real material: the store has no name, sign or logo; the dumpster and the patrol car carry no lettering;
     the jail's wanted notice is our own blank design (no seal, no face, no words); every card is our own typed graphic.
   New environments (E.registerSets): er29_lot (the back lot of a small-town store at night under the mountains; o.view
   'back' = facing the back wall, 'wide' = the long lot, wall further off), er29_hills (the western North Carolina
   mountains by day, mist on the ridges, an unmarked helicopter), er29_jail (a small county jail's booking room at night).
   Plus the shared task_force, press_room and courtroom sets.
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
  const LOT = 'ILLUSTRATION · GENERIC STORE, NOT THE REAL ONE';
  const YEL = '#ffd23f', RED = '#8e1f18', MUTE = '#6b665c';
  const GRN = { body: '#2f6a3c', shade: '#214d2b', light: '#4f8f5a', dark: '#163620', rust: '#7a4a22' };
  const typing = (from, to, a = 'sit_type', b = 'sit_type_b', step = 0.24) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? b : a, dur: step * 0.8 }); return k; };
  const panel = (x, y, w, h, op = 0.6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#000" opacity="${op}"/>`;

  // ---------- THE HERO: a generic green front-load dumpster (no lettering, no logo), bottom centre (x, y) on the ground;
  // ~900 x 600 at s = 1. o.lid 0..1 raises the right-hand lid; o.spot 0..1 = the spotlight's pool on it; o.glow 0..1 = a
  // yellow outline; o.jig = the open lid jiggles (someone is digging inside).
  function dumpster(x, y, s, t, o = {}) {
    const C = GRN, lid = o.lid || 0, sp = o.spot || 0, k = o.glow || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="6" rx="480" ry="36" fill="#000" opacity="0.5"/>`;
    // casters
    [-350, 350].forEach(cx => { g += `<rect x="${cx - 30}" y="-66" width="60" height="26" fill="#2a2c2e" stroke="${INK}" stroke-width="4"/><circle cx="${cx}" cy="-24" r="24" fill="#0c0c0e" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-24" r="9" fill="#5a5e64"/>`; });
    // the open lid (behind the rim, standing up), drawn first
    if (o.part === 'back') { if (lid <= 0) return ''; }
    if (lid > 0 && o.part !== 'front') {
      const lh = 300 * lid, jig = o.jig ? 6 * Math.sin(t * 13) * lid : 0;
      g += `<path d="M14 -578 L430 -578 L${f1(420 + jig)} ${f1(-578 - lh)} L${f1(24 + jig)} ${f1(-578 - lh)} Z" fill="#26292c" stroke="${INK}" stroke-width="6"/>`;
      for (let i = 1; i < 4; i++) g += `<path d="M${14 + i * 104} -578 L${f1(24 + i * 99 + jig)} ${f1(-578 - lh)}" stroke="#3a3e42" stroke-width="6"/>`;
    }
    if (o.part === 'back') return g.replace(/<ellipse cx="0" cy="6"[^>]*>/, '') + '</g>';
    // the body: slightly wider at the top, three pressed ribs, a skid, side fork pockets
    g += `<path d="M-400 -52 L-440 -500 L440 -500 L400 -52 Z" fill="${C.body}" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M-400 -52 L-440 -500 L-398 -500 L-362 -52 Z" fill="${C.shade}"/><path d="M400 -52 L440 -500 L412 -500 L376 -52 Z" fill="${C.light}" opacity="0.5"/>`;
    [-215, 0, 215].forEach(cx => { g += `<path d="M${cx} -70 L${f1(cx * 1.06)} -496" stroke="${C.dark}" stroke-width="18"/><path d="M${cx + 12} -70 L${f1(cx * 1.06 + 12)} -496" stroke="${C.light}" stroke-width="4" opacity="0.5"/>`; });
    g += `<rect x="-410" y="-76" width="820" height="26" fill="${C.dark}" stroke="${INK}" stroke-width="5"/>`;
    [-1, 1].forEach(d => { g += `<rect x="${d < 0 ? -478 : 432}" y="-380" width="46" height="80" fill="${C.shade}" stroke="${INK}" stroke-width="5"/><rect x="${d < 0 ? -470 : 440}" y="-366" width="30" height="52" fill="#0c120e"/>`; });
    // rust, grime streaks and a dent (generic wear); a blank panel where a hauler's sticker would be (left empty)
    [[-330, -120, 40, 12], [300, -140, 30, 10], [-120, -470, 26, 7], [380, -420, 10, 26], [-410, -300, 9, 24]].forEach(([a, b, rx, ry]) => { g += `<ellipse cx="${a}" cy="${b}" rx="${rx}" ry="${ry}" fill="${C.rust}" opacity="0.7"/>`; });
    [-300, -90, 120, 330].forEach((cx, i) => { g += `<path d="M${cx} -496 q ${i % 2 ? 6 : -4} 70 ${i % 2 ? 2 : -2} ${120 + i * 30}" stroke="#0e1a10" stroke-width="6" fill="none" opacity="0.45"/>`; });
    g += `<path d="M70 -250 l 70 -10 M110 -226 l 50 -6" stroke="${C.dark}" stroke-width="5" fill="none" opacity="0.6"/><rect x="-330" y="-330" width="150" height="90" rx="6" fill="${C.light}" opacity="0.18"/>`;
    // the rim
    g += `<rect x="-452" y="-524" width="904" height="30" rx="4" fill="${C.dark}" stroke="${INK}" stroke-width="6"/>`;
    // the lids: the left one closed (a sloping black plastic lid), the right one closed or raised
    g += `<path d="M-444 -522 L-6 -522 L-16 -580 L-432 -580 Z" fill="#1c1e20" stroke="${INK}" stroke-width="5"/>` + [1, 2, 3].map(i => `<path d="M${-444 + i * 110} -522 L${-440 + i * 106} -580" stroke="#30343a" stroke-width="5"/>`).join('');
    if (lid > 0) {
      g += `<path d="M6 -522 L444 -522 L430 -578 L14 -578 Z" fill="#050607" stroke="${INK}" stroke-width="5"/>`;
      // cardboard flaps and a bag at the opening (no printing)
      g += `<path d="M70 -560 L120 -640 L190 -626 L170 -556 Z" fill="#a8844e" stroke="${INK}" stroke-width="4"/><path d="M230 -566 Q290 -640 360 -572 Z" fill="#14161a" stroke="${INK}" stroke-width="4"/><path d="M330 -560 L360 -612 L400 -600 L384 -556 Z" fill="#c09a5e" stroke="${INK}" stroke-width="4"/>`;
    } else g += `<path d="M6 -522 L444 -522 L430 -580 L14 -580 Z" fill="#1c1e20" stroke="${INK}" stroke-width="5"/>`;
    // a cardboard corner trapped under the closed lid
    g += `<path d="M-300 -582 L-250 -620 L-196 -600 L-214 -578 Z" fill="#a8844e" stroke="${INK}" stroke-width="4"/>`;
    if (sp > 0) g += wash(0, -300, 560, 360, '#fff6d8', f1(0.42 * sp)) + `<path d="M-440 -500 L440 -500 L400 -52 L-400 -52 Z" fill="#fff8e0" opacity="${f1(0.14 * sp)}"/>`;
    if (k > 0) g += `<path d="M-470 -36 L-462 -610 L462 -610 L470 -36 Z" fill="none" stroke="${YEL}" stroke-width="10" stroke-linejoin="round" opacity="${f1(k * (0.75 + 0.25 * Math.sin(t * 7)))}"/>`;
    return g + '</g>';
  }
  // stacked plastic milk crates (generic, no lettering), bottom centre (x, y)
  function crates(x, y, s, n = 2, col = '#2a4a8a') {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="90" ry="12" fill="#000" opacity="0.45"/>`;
    for (let i = 0; i < n; i++) { const yy = -92 * (i + 1); g += `<rect x="-80" y="${yy}" width="160" height="90" rx="6" fill="${col}" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2, 3].map(c => `<rect x="${-66 + c * 34}" y="${yy + 14}" width="24" height="60" rx="4" fill="#0e1424" opacity="0.55"/>`).join(''); }
    return g + '</g>';
  }
  // a spotlight beam: a soft cone from (x0, y0) to a pool around (x1, y1), half-width w0 at the source and w1 at the target
  function beam(x0, y0, x1, y1, w0, w1, op) {
    if (op <= 0) return '';
    const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a);
    const p = [[x0 + nx * w0, y0 + ny * w0], [x1 + nx * w1, y1 + ny * w1], [x1 - nx * w1, y1 - ny * w1], [x0 - nx * w0, y0 - ny * w0]];
    return `<path d="M${p.map(q => f1(q[0]) + ' ' + f1(q[1])).join(' L')} Z" fill="#fff6d8" opacity="${f1(0.13 * op)}"/>` +
      `<path d="M${f1(p[0][0])} ${f1(p[0][1])} L${f1(x1)} ${f1(y1)} L${f1(p[3][0])} ${f1(p[3][1])} Z" fill="#fffbe8" opacity="${f1(0.1 * op)}"/>` + wash(x0, y0, 60, 60, '#fffbe8', f1(0.7 * op));
  }
  // a generic early-2000s patrol sedan in profile (front to the right): plain white, a dark lower stripe, a light bar, a
  // door-pillar spotlight. No text, crest, number or real livery. o.lights = the bar flashes; o.doorOpen; o.spot = the
  // pillar lamp is lit.
  function patrolCar(x, y, k, t, o = {}) {
    const on = o.lights !== false, ph = (t * 2.4) % 1, red = ph < 0.5;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><ellipse cx="0" cy="6" rx="480" ry="24" fill="#000" opacity="0.45"/>`;
    g += `<path d="M-460 -48 L-462 -116 Q-456 -138 -420 -144 L-280 -150 L-200 -232 Q-180 -246 -150 -246 L110 -246 Q140 -244 160 -230 L250 -152 L430 -140 Q462 -134 466 -100 L466 -48 Z" fill="#eef1f4" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-462 -96 L466 -92 L466 -60 L-462 -64 Z" fill="#1e2638"/><path d="M-188 -230 L-40 -230 L-40 -160 L-262 -160 Z M-26 -230 L120 -230 L226 -158 L-26 -158 Z" fill="#141a24"/>`;
    g += `<rect x="-110" y="-268" width="190" height="22" rx="8" fill="#20242c" stroke="${INK}" stroke-width="3"/>`;
    g += `<rect x="-104" y="-266" width="86" height="18" rx="6" fill="${on && red ? '#ff3a2a' : '#5a1a18'}"/><rect x="-10" y="-266" width="84" height="18" rx="6" fill="${on && !red ? '#3a6aff' : '#18224a'}"/>`;
    if (on) g += wash(red ? -60 : 30, -258, 160, 70, red ? '#ff3a2a' : '#3a6aff', 0.5);
    // the pillar spotlight by the driver's door
    g += `<rect x="128" y="-214" width="34" height="22" rx="8" fill="#c9d0d6" stroke="${INK}" stroke-width="3"/>` + (o.spot ? `<circle cx="160" cy="-203" r="9" fill="#fffbe8"/>` : '');
    g += `<rect x="452" y="-130" width="14" height="24" fill="#fff6d0"/>` + (o.headlights ? `<path d="M466 -122 L800 -160 L800 -60 L466 -104 Z" fill="#fff6d0" opacity="0.12"/>` : '');
    [-300, 310].forEach(cx => { g += `<path d="M${cx - 72} -48 A72 72 0 0 1 ${cx + 72} -48 Z" fill="#141210"/><circle cx="${cx}" cy="-2" r="54" fill="#0b0b0d" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-2" r="26" fill="#9aa0a8"/><path d="M${cx - 16} -2 L${cx + 16} -2 M${cx} -18 L${cx} 14" stroke="#5a606a" stroke-width="4" transform="rotate(${f1((o.roll || 0) * 57)} ${cx} -2)"/>`; });
    if (o.doorOpen) g += `<path d="M-30 -158 L-30 -50 L-130 -40 L-140 -150 Z" fill="#e2e6ea" stroke="${INK}" stroke-width="5"/>`;
    return g + '</g>';
  }
  // an unmarked generic helicopter in profile (nose to the left), centre (x, y); rotor blur
  function heli(x, y, k, t) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})">`;
    g += `<path d="M-120 -10 Q-130 -70 -40 -80 L80 -80 Q130 -70 130 -20 L130 10 Q40 30 -80 20 Q-120 14 -120 -10 Z" fill="#3a4048" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-110 -16 Q-112 -62 -50 -70 L-20 -70 L-20 -10 Z" fill="#8aa2b8" opacity="0.7"/><path d="M130 -40 L330 -30 L330 -14 L130 -4 Z" fill="#3a4048" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M320 -60 L340 -60 L346 -6 L326 -6 Z" fill="#2a3038" stroke="${INK}" stroke-width="3"/><path d="M-80 40 L120 40 M-50 22 L-60 40 M80 24 L90 40" stroke="#22262c" stroke-width="7"/>`;
    g += `<rect x="20" y="-100" width="16" height="22" fill="#22262c"/><ellipse cx="28" cy="-102" rx="${f1(250 + 20 * Math.sin(t * 40))}" ry="7" fill="#22262c" opacity="0.55"/>`;
    g += `<ellipse cx="336" cy="-34" rx="10" ry="${f1(36 + 6 * Math.sin(t * 50))}" fill="#22262c" opacity="0.4"/>`;
    return g + '</g>';
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // the back lot of a small-town grocery store at night, under wooded mountains (generic; no name, sign or logo). The back
    // wall: painted block, a steel door under a caged lamp, a roll-up loading door, a downspout, a meter box. o.view 'back'
    // faces the wall close up; o.view 'wide' sets the wall back across a long lot (the patrol car drives in along it).
    er29_lot(ctx, o = {}) {
      const t = ctx.t, r = R(291), wide = o.view === 'wide', WB = wide ? 1010 : 1180, kk = wide ? 0.42 : 1;
      const flick = (Math.sin(t * 23) > -0.75 ? 1 : 0.5) * (0.88 + 0.12 * Math.sin(t * 4.1));
      let sky = `<defs><linearGradient id="ersky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070f"/><stop offset="0.7" stop-color="#0e1428"/><stop offset="1" stop-color="#1c2440"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#ersky)"/>`;
      for (let i = 0; i < 80; i++) { const sx = -200 + r() * 1500, sy = -150 + r() * 700, tw = 0.5 + 0.5 * Math.sin(t * (1 + r() * 3) + i); sky += `<circle cx="${f1(sx)}" cy="${f1(sy)}" r="${f1(1.3 + r() * 2)}" fill="#fff" opacity="${f1(0.55 * tw)}"/>`; }
      // wooded ridges behind the store (two layers, tree-tufted edges)
      const RY = wide ? 760 : 470;
      let ridge = '';
      [[RY - 170, '#121a2a', 0], [RY - 60, '#0c1220', 1]].forEach(([y0, col, li]) => {
        let d = `M-300 ${y0 + 200}`; for (let x = -300; x <= W + 300; x += 60) { const h = 90 * Math.sin((x + li * 300) / 260) + 50 * Math.sin((x + li * 170) / 97); d += ` L${x} ${f1(y0 - h * (wide ? 0.6 : 1))}`; }
        d += ` L${W + 300} ${y0 + 900} L-300 ${y0 + 900} Z`; ridge += `<path d="${d}" fill="${col}"/>`;
        for (let x = -300; x <= W + 300; x += 22) { const h = 90 * Math.sin((x + li * 300) / 260) + 50 * Math.sin((x + li * 170) / 97); ridge += `<ellipse cx="${x}" cy="${f1(y0 - h * (wide ? 0.6 : 1) + 6)}" rx="16" ry="${f1(14 + 8 * Math.abs(Math.sin(x)))}" fill="${col}"/>`; }
      });
      // the back wall (drawn in 'back' coordinates; scaled about the ground line in the wide view)
      let wall = `<g transform="translate(540 ${WB}) scale(${kk}) translate(-540 -1180)"><rect x="-2400" y="430" width="5900" height="750" fill="#7e7a6e"/><rect x="-2400" y="410" width="5900" height="30" fill="#5e5a50" stroke="${INK}" stroke-width="5"/>`;
      for (let yy = 470; yy < 1180; yy += 46) { wall += `<path d="M-2400 ${yy} L3500 ${yy}" stroke="#000" stroke-opacity="0.12" stroke-width="3"/>`; for (let xx = -2400 + ((yy / 46) % 2) * 50; xx < 3500; xx += 100) wall += `<path d="M${xx} ${yy} L${xx} ${yy + 46}" stroke="#000" stroke-opacity="0.08" stroke-width="3"/>`; }
      wall += `<rect x="-2400" y="430" width="5900" height="750" fill="#0a0e1a" opacity="0.35"/>`;
      // steel door with a caged lamp; a roll-up loading door; downspout; meter box; a second door far left, a lamp far right
      const door = (x) => `<rect x="${x}" y="860" width="180" height="320" fill="#4a4e54" stroke="${INK}" stroke-width="6"/><rect x="${x + 140}" y="1010" width="26" height="12" rx="4" fill="#9aa0a8"/><rect x="${x + 10}" y="870" width="160" height="10" fill="#fff" opacity="0.12"/>`;
      const lamp = (x, y) => `<rect x="${x - 26}" y="${y}" width="52" height="34" rx="8" fill="#2a2c30" stroke="${INK}" stroke-width="4"/><ellipse cx="${x}" cy="${y + 40}" rx="20" ry="14" fill="#fff4c8" opacity="${f1(flick)}"/>` + [-12, 0, 12].map(dx => `<path d="M${x + dx} ${y + 28} L${x + dx} ${y + 54}" stroke="#2a2c30" stroke-width="3"/>`).join('') + wash(x, y + 60, 260, 200, '#ffe9a8', f1(0.3 * flick)) + `<path d="M${x - 30} ${y + 50} L${x - 200} 1180 L${x + 200} 1180 L${x + 30} ${y + 50} Z" fill="#ffe9a8" opacity="${f1(0.07 * flick)}"/>`;
      wall += door(120) + lamp(210, 790) + door(-760) + lamp(-670, 790) + lamp(1500, 790);
      wall += `<rect x="700" y="760" width="330" height="420" fill="#5a5e62" stroke="${INK}" stroke-width="6"/>` + [...Array(13)].map((_, i) => `<path d="M704 ${790 + i * 30} L1026 ${790 + i * 30}" stroke="#3a3e42" stroke-width="5"/>`).join('') + `<rect x="690" y="740" width="350" height="26" fill="#4a4e52" stroke="${INK}" stroke-width="4"/>`;
      wall += `<rect x="560" y="430" width="24" height="750" fill="#5a5e60" stroke="${INK}" stroke-width="3"/><rect x="548" y="1150" width="48" height="24" fill="#5a5e60" stroke="${INK}" stroke-width="3"/>`;
      wall += `<rect x="400" y="880" width="100" height="130" rx="6" fill="#8a8e90" stroke="${INK}" stroke-width="4"/><circle cx="450" cy="930" r="22" fill="#d8dcd8" stroke="${INK}" stroke-width="3"/>`;
      wall += `<rect x="1300" y="900" width="420" height="280" fill="#6a665c" stroke="${INK}" stroke-width="5"/><rect x="1300" y="880" width="420" height="24" fill="#4a463e"/>`;   // a loading dock step (wide view)
      wall += `</g>`;
      // the lot: cracked asphalt, faint parking lines, oil stains, a puddle with the lamp's reflection
      let ground = `<rect x="-300" y="${WB}" width="${W + 600}" height="${H + 300 - WB}" fill="#1c1d22"/><rect x="-300" y="${WB}" width="${W + 600}" height="10" fill="#0e0f12"/>`;
      for (let i = 0; i < 7; i++) { const yy = WB + 60 + i * i * 22; ground += `<path d="M-300 ${yy} L${W + 300} ${yy}" stroke="#000" stroke-opacity="0.18" stroke-width="3"/>`; }
      for (let i = 0; i < 6; i++) { const x = -100 + i * 260; ground += `<path d="M${f1(540 + (x - 540) * 0.5)} ${WB + 30} L${x} ${H + 300}" stroke="#d8d2b8" stroke-width="5" opacity="0.12"/>`; }
      for (let i = 0; i < 10; i++) ground += `<ellipse cx="${f1(-200 + r() * 1500)}" cy="${f1(WB + 80 + r() * 700)}" rx="${f1(30 + r() * 60)}" ry="${f1(8 + r() * 14)}" fill="#0a0a0c" opacity="0.5"/>`;
      for (let i = 0; i < 8; i++) ground += `<path d="M${f1(-200 + r() * 1500)} ${f1(WB + 60 + r() * 700)} l ${f1(40 + r() * 90)} ${f1(-8 + r() * 20)} l ${f1(20 + r() * 50)} ${f1(14 + r() * 16)}" stroke="#0a0a0c" stroke-width="3" fill="none"/>`;
      ground += `<ellipse cx="${wide ? 400 : 260}" cy="${wide ? 1180 : 1560}" rx="${wide ? 120 : 220}" ry="${wide ? 16 : 30}" fill="#2a3448" opacity="0.7"/><ellipse cx="${wide ? 400 : 260}" cy="${wide ? 1180 : 1560}" rx="${wide ? 40 : 70}" ry="${wide ? 5 : 9}" fill="#ffe9a8" opacity="${f1(0.25 * flick)}"/>`;
      const layers = [[0.05, sky], [0.12, ridge], [wide ? 0.55 : 0.75, wall], [1.0, ground]];
      return { light: { dir: -1, rim: '#ffe6b0', key: '#ffefd0' }, layers };
    },

    // the mountains of western North Carolina by day (generic): layered blue ridges in mist, a wooded slope, ferns and
    // rhododendron, a fallen log; o.heli = an unmarked helicopter crosses the sky
    er29_hills(ctx, o = {}) {
      const t = ctx.t, r = R(292);
      let sky = `<defs><linearGradient id="erhsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a9caa"/><stop offset="0.6" stop-color="#c4ced2"/><stop offset="1" stop-color="#e2e4dc"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#erhsky)"/>` + wash(760, 260, 420, 200, '#f4f2e8', 0.4);
      let ridges = '';
      [[620, '#a8b6c0', 0.8], [720, '#8a9cac', 1.0], [820, '#6a8090', 1.2], [930, '#4c6474', 1.4]].forEach(([y0, col, a], li) => {
        let d = `M-300 ${y0 + 400}`; for (let x = -300; x <= W + 300; x += 40) d += ` L${x} ${f1(y0 - a * (70 * Math.sin((x + li * 230) / 210) + 34 * Math.sin((x + li * 90) / 77)))}`;
        d += ` L${W + 300} ${y0 + 900} L-300 ${y0 + 900} Z`; ridges += `<path d="${d}" fill="${col}"/>`;
        if (li < 3) ridges += `<rect x="-300" y="${y0 + 20}" width="${W + 600}" height="60" fill="#e8ece8" opacity="0.18"/>`;
      });
      let air = '';
      if (o.heli) { const u = ((t * 0.09) % 1); air += heli(1300 - u * 1800, 300 + 30 * Math.sin(t * 0.7), 0.6, t); }
      // the near wooded slope: tree crowns, trunks
      let wood = `<path d="M-300 1060 Q 300 980 ${W + 300} 1040 L${W + 300} ${H + 300} L-300 ${H + 300} Z" fill="#2e3e26"/>`;
      for (let i = 0; i < 26; i++) { const x = -260 + i * 62 + r() * 30, y = 1040 + r() * 50, h = 160 + r() * 120; wood += `<rect x="${f1(x - 7)}" y="${f1(y - h * 0.5)}" width="14" height="${f1(h * 0.5)}" fill="#2a2018"/><ellipse cx="${f1(x)}" cy="${f1(y - h * 0.6)}" rx="${f1(48 + r() * 30)}" ry="${f1(h * 0.42)}" fill="${['#2f4a2a', '#3a5530', '#283f24', '#44603a'][i % 4]}"/>`; }
      let floor = `<path d="M-300 1180 Q 400 1120 ${W + 300} 1170 L${W + 300} ${H + 300} L-300 ${H + 300} Z" fill="#4a4a2e"/>`;
      for (let i = 0; i < 120; i++) floor += `<ellipse cx="${f1(-260 + r() * 1600)}" cy="${f1(1200 + r() * 800)}" rx="${f1(6 + r() * 8)}" ry="${f1(3 + r() * 4)}" fill="${['#7a5a2a', '#8a6a34', '#5a4420', '#6a7a3a'][i % 4]}" opacity="0.8"/>`;
      // rhododendron clumps and ferns; a fallen log
      [[60, 1300, 1.0], [980, 1260, 0.9], [520, 1220, 0.6]].forEach(([x, y, k]) => { for (let j = 0; j < 7; j++) floor += `<ellipse cx="${f1(x + (j - 3) * 46 * k)}" cy="${f1(y - (j % 3) * 30 * k)}" rx="${f1(60 * k)}" ry="${f1(34 * k)}" fill="${j % 2 ? '#24361e' : '#2e4426'}" stroke="#16200f" stroke-width="3"/>`; });
      floor += `<g transform="translate(700 1440) rotate(-6)"><rect x="-260" y="-40" width="520" height="70" rx="34" fill="#4a3a2a" stroke="${INK}" stroke-width="5"/><ellipse cx="260" cy="-5" rx="22" ry="35" fill="#8a7050" stroke="${INK}" stroke-width="4"/></g>`;
      for (let i = 0; i < 10; i++) { const x = -200 + i * 150 + r() * 40, y = 1700 + r() * 200; floor += `<path d="M${f1(x)} ${f1(y)} q -40 -60 -90 -70 M${f1(x)} ${f1(y)} q 10 -80 0 -110 M${f1(x)} ${f1(y)} q 40 -60 90 -70" stroke="#3e5a24" stroke-width="9" fill="none" stroke-linecap="round"/>`; }
      let fg = `<rect x="-200" y="-300" width="120" height="${H + 600}" fill="#1e1812"/><rect x="1150" y="-300" width="140" height="${H + 600}" fill="#1e1812"/>` + `<path d="M-80 600 q 80 -40 160 -120" stroke="#1e1812" stroke-width="22" fill="none"/>`;
      return { light: { dir: 1, rim: '#eef2f0', key: '#e4e8e2' }, layers: [[0.05, sky], [0.1, ridges], [0.2, air], [0.5, wood], [1.0, floor], [1.3, fg]], fog: true };
    },

    // a small county jail's booking room at night (generic): painted block walls, fluorescent tubes, a clock, a notice
    // board whose largest notice is our own blank design (a dark head-shaped box and illegible lines: no seal, no face, no
    // words), a steel door with a wired-glass window; the booking counter (CRT monitor, an ink pad, a blank card) in front
    er29_jail(ctx, o = {}) {
      const t = ctx.t, flick = 0.9 + 0.1 * Math.sin(t * 37) * Math.sin(t * 3.1), hl = o.hl || 0;
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#c4c8b4"/><rect x="-300" y="800" width="${W + 600}" height="440" fill="#7e8e80"/><rect x="-300" y="792" width="${W + 600}" height="12" fill="#5a6a5c"/>`;
      for (let yy = 200; yy < 1240; yy += 50) { wall += `<path d="M-300 ${yy} L${W + 300} ${yy}" stroke="#000" stroke-opacity="0.08" stroke-width="3"/>`; for (let xx = -300 + ((yy / 50) % 2) * 55; xx < W + 300; xx += 110) wall += `<path d="M${xx} ${yy} L${xx} ${yy + 50}" stroke="#000" stroke-opacity="0.06" stroke-width="3"/>`; }
      wall += `<rect x="-300" y="-300" width="${W + 600}" height="460" fill="#2a2e2c"/>`;
      [160, 580, 1000].forEach(x => { wall += `<rect x="${x - 120}" y="140" width="240" height="22" rx="6" fill="#f4f6f0" opacity="${f1(flick)}"/>` + wash(x, 190, 260, 90, '#f4f8ff', f1(0.35 * flick)); });
      // the clock (no numerals), the notice board, the blank wanted-style notice (highlighted on o.hl)
      wall += `<g transform="translate(560 300)"><circle r="54" fill="#f4f0e4" stroke="#2a2a2a" stroke-width="8"/><path d="M0 0 L0 -34" stroke="#1a1a1a" stroke-width="6" transform="rotate(${f1(120 + t * 2)})"/><path d="M0 0 L0 -44" stroke="#1a1a1a" stroke-width="4" transform="rotate(${f1(t * 24)})"/><circle r="5" fill="#1a1a1a"/></g>`;
      wall += `<rect x="40" y="250" width="440" height="380" fill="#a8845a" stroke="#4a3a28" stroke-width="8"/>`;
      [[66, 276, -2], [66, 452, 2], [350, 470, -3]].forEach(([x, y, a]) => { wall += `<g transform="rotate(${a} ${x + 50} ${y + 60})"><rect x="${x}" y="${y}" width="100" height="130" fill="#f2ede0" stroke="#8b857a" stroke-width="2"/>${[0, 1, 2, 3].map(i => `<rect x="${x + 12}" y="${y + 18 + i * 24}" width="${74 - i * 10}" height="6" fill="#9a958a"/>`).join('')}</g>`; });
      wall += `<g><rect x="190" y="280" width="150" height="200" fill="#f6f1e2" stroke="#6a6458" stroke-width="3"/><rect x="214" y="300" width="102" height="96" fill="#2a2a2a"/><ellipse cx="265" cy="336" rx="24" ry="28" fill="#5a5a5a"/><path d="M226 396 Q265 352 304 396 Z" fill="#5a5a5a"/>${[0, 1, 2].map(i => `<rect x="${206 + i * 4}" y="${410 + i * 20}" width="${118 - i * 22}" height="7" fill="#9a958a"/>`).join('')}</g>`;
      if (hl > 0) wall += `<rect x="176" y="266" width="178" height="228" rx="8" fill="none" stroke="${YEL}" stroke-width="8" opacity="${f1(hl * (0.75 + 0.25 * Math.sin(t * 7)))}"/>`;
      wall += `<rect x="820" y="420" width="240" height="800" fill="#5a6064" stroke="${INK}" stroke-width="6"/><rect x="880" y="500" width="120" height="150" fill="#9ab0c0" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3].map(i => `<path d="M880 ${530 + i * 30} L1000 ${530 + i * 30} M${900 + i * 30} 500 L${900 + i * 30} 650" stroke="#4a5a64" stroke-width="2"/>`).join('') + `<rect x="1020" y="800" width="24" height="60" rx="6" fill="#9aa0a8"/>`;
      let floor = `<rect x="-300" y="1228" width="${W + 600}" height="${H}" fill="#7a7466"/><rect x="-300" y="1228" width="${W + 600}" height="10" fill="#4a463e"/>`;
      for (let i = -6; i < 16; i++) floor += `<line x1="${540 + i * 90}" y1="1238" x2="${540 + i * 260}" y2="${H + 300}" stroke="#000" stroke-opacity="0.1" stroke-width="3"/>`;
      [1320, 1480, 1700].forEach(y => { floor += `<line x1="-300" y1="${y}" x2="${W + 300}" y2="${y}" stroke="#000" stroke-opacity="0.1" stroke-width="3"/>`; });
      return { light: { dir: -1, rim: '#eef4ff', key: '#f4f8ff' }, layers: [[0.4, wall], [1.0, floor]] };
    }
  });

  // the booking counter in front of the clerk (CRT monitor, ink pad, a blank card); drawn as a prop in front of figures
  const counter = `<g><rect x="-300" y="1150" width="860" height="34" fill="#9aa0a4" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1182" width="846" height="${H}" fill="#5e6a62" stroke="${INK}" stroke-width="5"/>` +
    `<g transform="translate(150 1150)"><rect x="-90" y="-150" width="180" height="140" rx="10" fill="#d8d0b8" stroke="${INK}" stroke-width="5"/><rect x="-72" y="-134" width="144" height="104" rx="6" fill="#1a2a3a"/>${[0, 1, 2, 3].map(i => `<rect x="-60" y="${-122 + i * 22}" width="${100 - i * 14}" height="7" fill="#7ab0e0" opacity="0.8"/>`).join('')}<rect x="-100" y="-10" width="200" height="12" rx="4" fill="#cfc6ae" stroke="${INK}" stroke-width="3"/></g>` +
    `<g transform="translate(380 1146)"><rect x="-44" y="-16" width="88" height="16" rx="4" fill="#1a1a1e" stroke="${INK}" stroke-width="3"/><rect x="40" y="-12" width="110" height="10" fill="#f2ede0" stroke="${INK}" stroke-width="2" transform="rotate(4 95 -7)"/></g></g>`;

  E.registerScenes({
    // 1 - hook: the hero dumpster behind the store, big and centred from the first frame, in a patrol car's spotlight from
    //     off-screen left; the right lid is half up. The headline is burned in by the engine (until ~3.2 s), so nothing of
    //     ours sits in y 380-720 before that. An officer walks in; his flashlight finds the dumpster on "grocery".
    er29_hook(ctx) {
      const t = ctx.t, fbi = WT(ctx, 0, 7, 1.6), l1 = LS(ctx, 1, 3.2), gro = WT(ctx, 1, 4, 3.8), dmp = WT(ctx, 1, 6, 4.3);
      const D = { x: 540, y: 1400, s: 0.92 };
      return E.cine.shot(ctx, {
        set: 'er29_lot', setOpts: { view: 'back' }, grade: 'night', police: 0.16,
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 0, y: 70, z: 1.08 }, handheld: 1.2 },
        shake: [{ at: dmp, amp: 4 }],
        figures: [{ id: 'er29_officer', x: -160, y: 1520, scale: 0.66, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', depth: 1.02, show: [fbi - 0.3],
          walk: { from: -160, to: 45, at: fbi - 0.2, dur: Math.max(0.6, gro - fbi - 0.2), cadence: 6.2 }, propOpts: { aim: 100, beamLen: 420 },
          keys: [{ at: gro - 0.25, pose: 'torch', expr: 'stern', dur: 0.35 }] }],
        props: [
          { depth: 0.99, svg: tt => beam(-300, 1080, D.x + 40, D.y - 300, 20, 330, 1) },
          { depth: 1.0, svg: tt => crates(D.x + 520, D.y + 10, 0.9, 3) + dumpster(D.x, D.y, D.s, tt, { lid: 0.55, spot: 0.55 + 0.45 * seg(tt, gro - 0.2, gro + 0.2), glow: 0.8 * seg(tt, dmp - 0.1, dmp + 0.3) }) }
        ],
        overlays: [
          { type: 'label', at: 3.3, x: 60, y: 432, text: 'MURPHY, NORTH CAROLINA', fs: 40, sub: 'Behind a grocery store · 31 May 2003' }
        ],
        tag: LOT
      });
    },

    // 2 - the stakes, said once and plainly, in a quiet task-force room; nothing of the bombing is shown
    er29_toll(ctx) {
      const t = ctx.t, bomb = WT(ctx, 0, 1, 0.4), oly = WT(ctx, 0, 5, 1.3), kil = WT(ctx, 0, 6, 1.7), inj = WT(ctx, 0, 10, 2.5), n100 = WT(ctx, 0, 12, 3.0);
      const card = tt => { const k0 = seg(tt, kil - 0.15, kil + 0.25), k1 = seg(tt, inj - 0.15, inj + 0.25); if (k0 <= 0) return '';
        return `<g opacity="${f1(k0)}">${panel(110, 520, 860, 240, 0.7)}<text x="540" y="618" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="70" fill="#f4efe4">1 WOMAN KILLED</text>` +
          `<text x="540" y="712" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="50" fill="#e8dcc0" opacity="${f1(k1)}">MORE THAN 100 INJURED</text></g>`; };
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: {}, grade: 'cold', dust: true,
        cam: { from: { x: 20, y: -30, z: 1.06 }, to: { x: -20, y: -50, z: 1.0 }, handheld: 0.6 },
        figures: [
          { id: 'analyst', x: 200, y: 1610, scale: 0.92, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', keys: [...typing(0.05, kil - 0.1), { at: kil, pose: 'sit', expr: 'sad', gaze: [0.4, 0.3], dur: 0.5 }, { at: n100, pose: 'sit_slumped', dur: 0.6 }] },
          { id: 'agent_b', x: 840, y: 1740, scale: 0.96, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', keys: [{ at: bomb, pose: 'stand', expr: 'sad', dur: 0.5 }, { at: inj, pose: 'bowed', dur: 0.7 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'ATLANTA · 27 JULY 1996', fs: 40, sub: 'Centennial Olympic Park' },
          { type: 'svg', at: kil - 0.15, svg: card }
        ],
        tag: TAG
      });
    },

    // 3 - three more bombings (1997-98) and the FBI's Ten Most Wanted list (May 1998), at a press briefing (generic)
    er29_list(ctx) {
      const t = ctx.t, three = WT(ctx, 0, 1, 0.3), bombs = WT(ctx, 0, 3, 0.9), fbi = WT(ctx, 0, 7, 2.0), ten = WT(ctx, 0, 8, 2.3), lst = WT(ctx, 0, 11, 3.2);
      return E.cine.shot(ctx, {
        set: 'press_room', grade: 'cold', cam: { from: { x: 0, y: -30, z: 1.0 }, to: { x: -20, y: -50, z: 1.07 }, handheld: 0.8 },
        figures: [{ id: 'official', x: 520, y: 1290, scale: 0.7, dir: 1, turn: 0.15, pose: 'stand', expr: 'stern', gaze: [0.1, 0.1],
          keys: [{ at: three - 0.1, pose: 'present', dur: 0.45 }, { at: ten - 0.3, pose: 'point', headTurn: 0.4, gaze: [0.8, -0.3], dur: 0.5 }, { at: lst + 0.2, pose: 'hands_together', headTurn: 0, gaze: [0, 0], expr: 'determined', dur: 0.5 }] }],
        overlays: [
          { type: 'card', at: three - 0.1, x: 80, y: 390, w: 920, rows: [{ text: '1997-98: THREE MORE BOMBINGS', fs: 38, colour: RED }, { text: 'TWO CLINICS · A NIGHTCLUB', fs: 32, colour: MUTE, at: bombs }, { text: 'FBI TEN MOST WANTED · MAY 1998', fs: 40, at: ten - 0.1 }] }
        ],
        tag: TAG
      });
    },

    // 4 - the manhunt: the North Carolina mountains by day; searchers in the woods; an unmarked helicopter crosses
    er29_hunt(ctx) {
      const t = ctx.t, n200 = WT(ctx, 0, 2, 0.5), ag = WT(ctx, 0, 3, 0.9), srch = WT(ctx, 0, 4, 1.3), nc = WT(ctx, 0, 6, 1.9), mtn = WT(ctx, 0, 8, 2.6);
      return E.cine.shot(ctx, {
        set: 'er29_hills', setOpts: { heli: true }, grade: 'cold',
        cam: { from: { x: -40, y: 0, z: 1.0 }, to: { x: 40, y: -30, z: 1.08 }, handheld: 1.8 },
        figures: [
          { id: 'searcher', x: 200, y: 1720, scale: 0.84, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', walk: { from: 80, to: 300, at: 0.05, dur: Math.max(0.6, srch - 0.1), cadence: 6.0 },
            keys: [{ at: srch, pose: 'kneel', dur: 0.45 }, { at: mtn, pose: 'stand', expr: 'realise', dur: 0.4 }] },
          { id: 'searcher_b', x: 820, y: 1560, scale: 0.62, dir: -1, turn: 0.5, pose: 'walk', expr: 'focused', walk: { from: 980, to: 760, at: 0.2, dur: Math.max(0.6, nc), cadence: 6.0 },
            keys: [{ at: nc + 0.1, pose: 'stand', dur: 0.4 }] },
          { id: 'agent_a', x: 560, y: 1330, scale: 0.4, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', depth: 0.9, walk: { from: 460, to: 620, at: ag, dur: 1.6, cadence: 6.0 },
            keys: [{ at: mtn - 0.2, pose: 'point', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'WESTERN NORTH CAROLINA · 1998', fs: 38, sub: 'Infrared on helicopters · motion detectors' },
          { type: 'card', at: n200 - 0.1, x: 560, y: 690, w: 440, rows: [{ text: '200+ AGENTS', fs: 52, colour: RED }, { text: 'AT THE PEAK, 1998', fs: 26, colour: MUTE, at: mtn }] }
        ],
        tag: TAG
      });
    },

    // 5 - Murphy, 31 May 2003, before dawn (the wide lot): a patrol car rolls in along the back of the store; its spotlight
    //     swings onto the dumpster on "grocery store"; the rookie steps out
    er29_patrol(ctx) {
      const t = ctx.t, rk = WT(ctx, 0, 3, 1.0), pat = WT(ctx, 0, 5, 1.5), drv = WT(ctx, 0, 6, 1.8), gro = WT(ctx, 0, 9, 2.6), st = WT(ctx, 0, 10, 3.0);
      const GY = 1330, PC = { x: 300, k: 0.6 }, D = { x: 870, y: 1190, s: 0.36 };
      const stopT = pat + 0.1;
      const roll = tt => 1 - ease.out(clamp(tt / Math.max(0.8, stopT), 0, 1));
      const spot = tt => seg(tt, gro - 0.2, gro + 0.2);
      return E.cine.shot(ctx, {
        set: 'er29_lot', setOpts: { view: 'wide' }, grade: 'night', police: 0.14,
        cam: { from: { x: -20, y: 60, z: 1.0 }, to: { x: 30, y: 40, z: 1.06 }, handheld: 1.5 },
        figures: [{ id: 'er29_officer', x: 470, y: 1350, scale: 0.3, dir: 1, turn: 0.5, pose: 'stand', expr: 'focused', depth: 1.01, show: [stopT + 0.1],
          walk: { from: 470, to: 560, at: drv, dur: Math.max(0.5, gro - drv), cadence: 6.2 }, keys: [{ at: gro, pose: 'torch', expr: 'stern', dur: 0.35 }, { at: st + 0.1, pose: 'point', expr: 'determined', dur: 0.35 }], propOpts: { aim: 96, beamLen: 260 } }],
        props: [
          { depth: 1.0, svg: tt => crates(D.x + 150, D.y + 4, 0.34, 3) + dumpster(D.x, D.y, D.s, tt, { lid: 0.55, spot: spot(tt), glow: 0.7 * seg(tt, st, st + 0.3) }) },
          { depth: 1.0, svg: tt => beam(PC.x - 900 * roll(tt) + 160 * PC.k, GY - 203 * PC.k, D.x, D.y - 110, 8, 150, spot(tt)) + patrolCar(PC.x - 900 * roll(tt), GY, PC.k, tt, { headlights: true, spot: spot(tt) > 0, doorOpen: tt > stopT + 0.05, roll: -roll(tt) * 8 }) }
        ],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'MURPHY, N.C. · 31 MAY 2003', fs: 40, sub: 'Before dawn · a routine patrol' },
          { type: 'card', at: rk - 0.1, x: 60, y: 600, w: 620, rows: [{ text: 'A 21-YEAR-OLD ROOKIE', fs: 40, colour: RED }, { text: 'LESS THAN A YEAR ON THE FORCE', fs: 26, colour: MUTE, at: pat }] }
        ],
        tag: LOT
      });
    },

    // 6 - THE HOW: close on the dumpster. A dark, anonymous figure is digging in it (lid up); the spotlight floods it on
    //     "dumpster"; the rookie walks in with his flashlight. Card: he suspected a burglary.
    er29_dumpster(ctx) {
      const t = ctx.t, man = WT(ctx, 0, 1, 0.3), dig = WT(ctx, 0, 3, 0.8), dmp = WT(ctx, 0, 6, 1.6), food = WT(ctx, 0, 8, 2.2), end = ctx.T;
      const D = { x: 660, y: 1420, s: 0.8 };
      const digKeys = []; for (let tt = 0.05; tt < dmp; tt += 0.5) digKeys.push({ at: tt, pose: digKeys.length % 2 ? 'stand' : 'examine', dur: 0.35 });
      return E.cine.shot(ctx, {
        set: 'er29_lot', setOpts: { view: 'back' }, grade: 'night', police: 0.18 * seg(t, dmp - 0.2, dmp + 0.4),
        cam: { keys: [{ at: 0, x: 40, y: 80, z: 1.04 }, { at: dmp - 0.4, x: 0, y: 100, z: 1.12, dur: 1.0 }], handheld: 1.6 },
        shake: [{ at: dmp, amp: 5 }],
        figures: [
          { id: 'er29_rudolph', x: 790, y: 1330, scale: 0.66, dir: -1, turn: 0.4, pose: 'examine', silhouette: 'cool', depth: 0.99,
            keys: [...digKeys, { at: dmp, pose: 'stand_tense', dur: 0.3 }, { at: food + 0.2, pose: 'hands_together', dur: 0.5 }] },
          { id: 'er29_officer', x: 160, y: 1600, scale: 0.84, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', depth: 1.03, show: [dmp - 0.2], propOpts: { aim: 75, beamLen: 520 },
            walk: { from: -220, to: 150, at: dmp - 0.2, dur: Math.max(0.6, food - dmp + 0.2), cadence: 6.2 }, keys: [{ at: food - 0.1, pose: 'torch', expr: 'stern', dur: 0.35 }] }
        ],
        props: [
          { depth: 0.99, svg: tt => beam(-300, 1060, D.x - 80, D.y - 280, 18, 380, seg(tt, dmp - 0.25, dmp + 0.1)) },
          { depth: 0.985, svg: tt => dumpster(D.x, D.y, D.s, tt, { part: 'back', lid: 1, jig: tt < dmp }) },
          { depth: 1.0, svg: tt => dumpster(D.x, D.y, D.s, tt, { part: 'front', lid: 1, spot: 0.25 + 0.75 * seg(tt, dmp - 0.2, dmp + 0.15) }) }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: dmp - 0.1, x: 60, y: 432, text: 'ABOUT 4 A.M.', fs: 40, sub: 'Times vary by account' },
          { type: 'card', at: dmp, x: 40, y: 390, w: 650, rows: [{ text: 'SCAVENGING FOR FOOD', fs: 36, colour: RED }, { text: 'THE ROOKIE SUSPECTED', fs: 26, colour: MUTE, at: food }, { text: 'A BURGLARY', fs: 26, colour: MUTE, at: food + 0.3 }] }
        ],
        tag: LIKENESS
      });
    },

    // 7 - the reveal: the booking room; a fake name, then he is recognised (the blank wanted-style notice lights up)
    er29_reveal(ctx) {
      const t = ctx.t, gave = WT(ctx, 0, 2, 0.4), fake = WT(ctx, 0, 4, 0.9), l1 = LS(ctx, 1, 1.9), jail = WT(ctx, 1, 2, 2.3), rec = WT(ctx, 1, 5, 2.9), eric = WT(ctx, 1, 6, 3.4);
      return E.cine.shot(ctx, {
        set: 'er29_jail', setOpts: { hl: 0 }, grade: 'cold',
        cam: { keys: [{ at: 0, x: 20, y: 0, z: 1.0 }, { at: rec - 0.5, x: -40, y: -30, z: 1.1, dur: 1.0 }], handheld: 1.6 },
        shake: [{ at: eric, amp: 5 }],
        figures: [
          { id: 'official', x: 300, y: 1640, scale: 0.86, dir: 1, turn: 0.4, pose: 'sit_type', expr: 'focused', depth: 0.98,
            keys: [...typing(0.05, fake + 0.4), { at: rec - 0.1, pose: 'sit', expr: 'realise', gaze: [-0.6, -0.8], dur: 0.35 }, { at: eric, pose: 'sit_read', expr: 'stern', dur: 0.4 }] },
          { id: 'er29_rudolph', x: 690, y: 1660, scale: 0.8, dir: -1, turn: 0.45, pose: 'stand', silhouette: 'cool', keys: [{ at: gave - 0.1, pose: 'hands_behind', dur: 0.5 }, { at: eric + 0.2, pose: 'bowed', dur: 0.6 }] },
          { id: 'er29_officer', x: 960, y: 1690, scale: 0.82, dir: -1, turn: 0.5, pose: 'stand', expr: 'focused', keys: [{ at: fake, pose: 'arms_crossed', expr: 'stern', dur: 0.4 }, { at: rec, pose: 'point', expr: 'realise', dur: 0.4 }] }
        ],
        props: [{ depth: 0.4, svg: tt => `<rect x="176" y="266" width="178" height="228" rx="8" fill="none" stroke="${YEL}" stroke-width="8" opacity="${f1(seg(tt, rec - 0.15, rec + 0.2) * (0.75 + 0.25 * Math.sin(tt * 7)))}"/>` }, { depth: 1.02, svg: counter }],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.1, x: 560, y: 690, text: 'A FAKE NAME', fs: 40, sub: 'Reported as "Jerry Wilson"' },
          { type: 'card', at: rec - 0.1, x: 390, y: 380, w: 650, rows: [{ text: 'RECOGNISED AT THE JAIL', fs: 26, colour: MUTE }, { text: 'ERIC RUDOLPH', fs: 54, colour: RED, at: eric - 0.05 }, { text: 'FIVE YEARS ON THE RUN', fs: 26, at: eric + 0.5 }] }
        ],
        tag: LIKENESS
      });
    },

    // 8 - the outcome: the guilty pleas (April 2005), the death penalty off the table; life without parole
    er29_verdict(ctx) {
      const pl = WT(ctx, 0, 1, 0.3), death = WT(ctx, 0, 5, 1.3), l1 = LS(ctx, 1, 2.3), life = WT(ctx, 1, 0, 2.4), par = WT(ctx, 1, 2, 2.9);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.1 }, handheld: 0.5 },
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.33, keys: [{ at: pl - 0.3, pose: 'gavel', dur: 0.3 }, { at: pl + 0.15, pose: 'sit', dur: 0.15 }, { at: l1, pose: 'sit_read', dur: 0.5 }] },
          { id: 'er29_rudolph', x: 840, y: 1770, scale: 0.95, dir: -1, turn: 0.15, pose: 'stand', silhouette: 'cool', keys: [{ at: pl, pose: 'hands_together', dur: 0.4 }, { at: life, pose: 'bowed', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'card', at: 0.15, x: 40, y: 860, w: 660, rows: [{ text: 'APRIL 2005 · PLEADED GUILTY', fs: 30, colour: RED, at: pl - 0.05 }, { text: 'DEATH PENALTY OFF THE TABLE', fs: 26, colour: MUTE, at: death }, { text: 'LIFE WITHOUT PAROLE', fs: 36, at: life - 0.05 }, { text: 'ADX FLORENCE, COLORADO', fs: 24, colour: MUTE, at: par + 0.3 }] }
        ],
        tag: LIKENESS
      });
    },

    // 9 - callback on the hero object (the first frame's framing): the dumpster in the spotlight, the officer's flashlight on
    //     it. The engine burns the end question over the last 3.2 s at y 520, so nothing of ours sits in y 380-720; the
    //     last frame loops to the first.
    er29_end(ctx) {
      const t = ctx.t, hund = WT(ctx, 0, 2, 0.9), one = WT(ctx, 0, 6, 2.0), rk = WT(ctx, 0, 7, 2.3), l1 = LS(ctx, 1, 2.9);
      const D = { x: 540, y: 1400, s: 0.92 };
      return E.cine.shot(ctx, {
        set: 'er29_lot', setOpts: { view: 'back' }, grade: 'night', police: 0.16 * (1 - seg(t, l1, l1 + 1.2)),
        cam: { from: { x: 0, y: 70, z: 1.08 }, to: { x: 0, y: 40, z: 1.0 }, handheld: 0.6 },
        figures: [{ id: 'er29_officer', x: 45, y: 1520, scale: 0.66, dir: 1, turn: 0.5, pose: 'torch', expr: 'stern', depth: 1.02, propOpts: { aim: 100, beamLen: 420 },
          keys: [{ at: hund, pose: 'torch_low', dur: 0.4 }, { at: one - 0.1, pose: 'torch', expr: 'determined', dur: 0.35 }, { at: l1 + 0.1, pose: 'hands_together', expr: 'neutral', dur: 0.6 }] }],
        props: [
          { depth: 0.99, svg: tt => beam(-300, 1080, D.x + 40, D.y - 300, 20, 330, 1) },
          { depth: 1.0, svg: tt => crates(D.x + 520, D.y + 10, 0.9, 3) + dumpster(D.x, D.y, D.s, tt, { lid: 0.55, spot: 1 - 0.45 * seg(tt, l1 + 0.1, l1 + 0.7), glow: 0.8 * seg(tt, rk - 0.2, rk + 0.2) * (1 - seg(tt, l1, l1 + 0.6)) }) }
        ],
        overlays: [],   // nothing of ours: the engine burns the end question over the last 3.2 s
        tag: LOT
      });
    }
  });
})();
