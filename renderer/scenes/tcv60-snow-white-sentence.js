/* Case File 60 (premium look, engagement + shares + smoothness + hooks + plateau + hot-take rules): Leandro Andrade and
   California's three strikes law. In November 1995 he took nine videotapes ($84.70 + $68.84 = $153.54) from two Kmarts in
   San Bernardino County (Ontario, then Montclair), hiding them in his waistband; security stopped him both times. With prior
   burglary convictions, each petty theft triggered a separate three-strikes sentence: 25 years to life, twice. The Supreme
   Court upheld it 5-4 (Lockyer v. Andrade, March 2003); as sentenced, no parole until he was 87.
   Structure: frame 1 = the HERO OBJECT (a plain VHS slipcase typed "SNOW WHITE", the accent) sliding from his hand under his
   jacket hem into his waistband in a store aisle, his silhouette above it, the camera already pushing; the store's exit at
   night (he walks left to right, the guard steps in; the $153 counter); a courtroom (his silhouette in the dock; the priors);
   close on the bench (25 + 25 = 50 YEARS TO LIFE, the gavel, the single impact); the courthouse at night (BOTH SIDES: the
   state's lawyer left, a critic right); a marble hall with nine empty chairs (five light up: the 5-4 vote; the FUN FACT);
   a roadside stop at night (the LESSON checklist, captions off); the outcome back on the hero tape in frame 1's framing with
   the burned-in end question.
   Smoothness (owner, 44+): cuts and dissolves, one push (the reveal), one zoom (the end); one slow camera move per shot;
   settle only on the hero dolly-ins (first and last frames) and the reveal; one impact, no shake, no handheld.
   Screen direction: Andrade always faces / walks left to right (towards the exit).
   Look: episode.look = 'premium' with one warm-cool store-night palette (shadow #161c26, mid #cbbfa8, accent #d9a441). The
   ONLY strongly coloured object is the SNOW WHITE tape (its amber title band; props marked accent: true).
   Content rules: Andrade is a faceless rim-lit silhouette (NOT A LIKENESS). The nine justices are never drawn (empty
   chairs). Guard, judge, lawyers, reporter, officer and the young man are generic figures with no badge or insignia. Kmart
   and the film titles appear only as typed text; tape boxes are plain (no studio artwork or logo).
   New environments (E.registerSets): sw60_aisle (a video aisle under strip lights), sw60_exit (a store's front with glass
   doors onto a night car park), sw60_hall (a marble hall with nine empty high-backed chairs), sw60_curb (a roadside at night
   with a generic patrol car). Plus the engine's courtroom and courthouse_night. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#14110e';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#d9a441';
  const FONT = 'font-family="Nunito" font-weight="800"';
  const SPINE = ['#5a6470', '#7a5a48', '#4a5a4e', '#6a6050', '#4e4a5e', '#7a6a50', '#5a4e44', '#46525a'];

  // ---------- THE HERO: a plain VHS slipcase (cream card, a typed amber title band "SNOW WHITE", a simple apple motif,
  // a "VHS" tab). Centre (x, y); 200 x 340 at s = 1. No studio artwork or logo.
  function tape(x, y, s, rot = 0, o = {}) {
    const gl = o.glow ?? 0.6, title = o.title || 'SNOW WHITE';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    if (gl > 0) g += wash(0, 0, 210, 260, ACC, f1(0.2 * gl));
    g += `<rect x="-100" y="-170" width="200" height="340" rx="8" fill="#ece2cc" stroke="${INK}" stroke-width="7"/>`;
    g += `<rect x="-100" y="-170" width="200" height="340" rx="8" fill="url(#sw60g)" opacity="0.35"/>`;
    g += `<rect x="-88" y="-150" width="176" height="96" rx="4" fill="${ACC}" stroke="${INK}" stroke-width="4"/>`;
    const words = title.split(' ');
    g += words.map((w_, i) => `<text x="0" y="${-112 + i * 40 - (words.length - 1) * 8}" text-anchor="middle" ${FONT} font-size="${w_.length > 6 ? 34 : 38}" fill="#1a140c" letter-spacing="1">${w_}</text>`).join('');
    // a simple apple motif (generic fairy-tale emblem)
    g += `<g transform="translate(0 30)"><path d="M0 -34 C-44 -58 -66 -6 -40 34 C-26 56 -10 50 0 44 C10 50 26 56 40 34 C66 -6 44 -58 0 -34 Z" fill="#a8473a" stroke="${INK}" stroke-width="4"/><path d="M0 -34 Q4 -56 18 -64" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M6 -50 Q30 -66 40 -46 Q22 -40 6 -50 Z" fill="#6a8a4a" stroke="${INK}" stroke-width="3"/><path d="M-24 -18 Q-34 0 -26 18" stroke="#f0c8b8" stroke-width="6" fill="none" opacity="0.6" stroke-linecap="round"/></g>`;
    g += `<rect x="-88" y="112" width="70" height="36" rx="4" fill="#1a1a1c"/><text x="-53" y="139" text-anchor="middle" ${FONT} font-size="24" fill="#ece2cc">VHS</text>`;
    g += `<rect x="-8" y="122" width="96" height="10" rx="4" fill="#b8ac94"/><rect x="-8" y="140" width="70" height="8" rx="4" fill="#b8ac94"/>`;
    return g + '</g>';
  }
  // a plain tape spine / box seen from the shelf (no title or a typed short title)
  function spine(x, y, w, h, col, title) {
    let g = `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="3" fill="${col}" stroke="${INK}" stroke-width="3"/><rect x="${f1(x + w * 0.15)}" y="${f1(y + h * 0.1)}" width="${f1(w * 0.7)}" height="${f1(h * 0.16)}" fill="#e8dcc4" opacity="0.55"/>`;
    if (title) g += `<text x="${f1(x + w / 2)}" y="${f1(y + h * 0.62)}" text-anchor="middle" ${FONT} font-size="${f1(Math.min(26, w * 0.24))}" fill="#ece2cc">${title}</text>`;
    return g;
  }
  // a dark gloved-looking silhouette hand gripping from above (fingers wrap the box's near edge); origin at the knuckles
  function hand(x, y, s, rot = 0) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><path d="M-70 -150 Q-80 -60 -60 -10 L60 -10 Q78 -70 66 -150 Z" fill="#1c2026" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-64 -24 Q-70 26 -50 40 L-34 40 Q-30 10 -36 -16 Z M-30 -14 Q-32 44 -14 52 L2 52 Q4 14 0 -14 Z M6 -14 Q4 46 22 50 L36 48 Q38 12 32 -14 Z M38 -16 Q40 30 54 34 L64 30 Q66 0 60 -18 Z" fill="#20252c" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M-60 -80 Q-20 -96 56 -84" stroke="#3a4250" stroke-width="5" fill="none" opacity="0.7"/></g>`;
  }
  // the 25 + 25 = 50 typography for the reveal (screen space)
  function sum(t, a, b, c) {
    let g = '';
    const pop = (tt0, i) => ease.back(seg(t, tt0, tt0 + 0.35));
    const row = (k, y, txt, col, fs) => k > 0 ? `<g opacity="${f1(Math.min(1, k))}" transform="translate(540 ${y}) scale(${f1(Math.max(0.001, k) * 1000) / 1000}) translate(-540 ${-y})"><text x="540" y="${y}" text-anchor="middle" ${FONT} font-size="${fs}" fill="${col}" stroke="#0b0b0d" stroke-width="10" paint-order="stroke" letter-spacing="2">${txt}</text></g>` : '';
    const k1 = pop(a), k2 = pop(b), k3 = pop(c);
    if (k1 > 0 || k2 > 0) g += `<rect x="90" y="830" width="900" height="${k3 > 0 ? 370 : 260}" rx="24" fill="#05060c" opacity="${f1(0.7 * Math.min(1, Math.max(k1, 0)))}"/>`;
    g += row(k1, 920, '25 TO LIFE', '#f4efe6', 84) + row(k2, 1030, '+ 25 TO LIFE', '#f4efe6', 84);
    if (k3 > 0) g += `<path d="M180 1064 L900 1064" stroke="${ACC}" stroke-width="6" opacity="${f1(Math.min(1, k3))}"/>` + row(k3, 1150, '= 50 YEARS TO LIFE', ACC, 84);
    return g;
  }
  // a high-backed empty chair (the bench's nine seats), lit or dim
  function chair(x, y, s, lit) {
    const back = lit ? '#5a3a26' : '#2a2420', edge = lit ? '#e8b868' : '#4a3e34';
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">` + (lit ? wash(0, -120, 120, 170, ACC, 0.25) : '') +
      `<path d="M-50 0 L-56 -250 Q0 -282 56 -250 L50 0 Z" fill="${back}" stroke="${INK}" stroke-width="5"/><path d="M-40 -20 L-44 -232 Q0 -258 44 -232 L40 -20" fill="none" stroke="${edge}" stroke-width="4" opacity="0.8"/></g>`;
  }
  // a generic patrol car (side view facing left; plain dark body, a light bar, no markings, no plate number)
  function patrol(x, y, s, t) {
    const on = Math.sin(t * 9) > 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="340" ry="24" fill="#000" opacity="0.4"/>`;
    g += wash(-60, -270, 260, 120, on ? '#d84a3a' : '#3a6ad8', 0.35) + wash(60, -270, 260, 120, on ? '#3a6ad8' : '#d84a3a', 0.25);
    g += `<path d="M330 -60 L320 -130 Q310 -150 270 -156 L180 -164 L100 -236 Q80 -250 40 -250 L-110 -250 Q-150 -250 -180 -224 L-250 -164 L-300 -150 Q-340 -140 -340 -110 L-340 -60 Z" fill="#20242a" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M160 -168 L90 -230 L-20 -230 L-20 -168 Z M-40 -168 L-40 -230 L-110 -230 Q-140 -230 -160 -212 L-212 -168 Z" fill="#8aa0b0" opacity="0.55" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-300 -110 L330 -110" stroke="#e8e6e0" stroke-width="10" opacity="0.6"/>`;
    g += `<rect x="-70" y="-270" width="140" height="22" rx="6" fill="#1a1a1c"/><rect x="-66" y="-268" width="64" height="18" rx="5" fill="${on ? '#e84a3a' : '#5a2a26'}"/><rect x="2" y="-268" width="64" height="18" rx="5" fill="${on ? '#2a3a6a' : '#3a6ae8'}"/>`;
    g += `<rect x="-338" y="-136" width="34" height="18" rx="5" fill="#f4e6b0"/><rect x="306" y="-130" width="20" height="22" rx="4" fill="#c03a2e"/>`;
    g += [-190, 200].map(wx => `<circle cx="${wx}" cy="-46" r="54" fill="#141516" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-46" r="24" fill="#8a9096"/>`).join('');
    return g + '</g>';
  }
  // a generic hatchback (side view facing right; no badge, no plate number)
  function hatch(x, y, s) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="300" ry="22" fill="#000" opacity="0.35"/>` +
      `<path d="M-300 -60 L-300 -150 Q-296 -230 -220 -244 L60 -250 Q120 -250 160 -210 L230 -160 L290 -146 Q320 -136 320 -100 L320 -60 Z" fill="#6a5a4a" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="M-260 -160 L-250 -224 L40 -232 L40 -164 Z M60 -164 L60 -232 Q110 -232 140 -204 L196 -164 Z" fill="#b8ccd6" opacity="0.6" stroke="${INK}" stroke-width="4"/>` +
      `<rect x="292" y="-132" width="28" height="16" rx="5" fill="#f4e6b0"/>` + [-180, 190].map(wx => `<circle cx="${wx}" cy="-46" r="52" fill="#141516" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-46" r="22" fill="#8a9096"/>`).join('') + '</g>';
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a video aisle under strip lights: shelves of plain tape boxes on both sides receding to a far end wall; a polished floor
    sw60_aisle(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), r = R(6001);
      let back = `<defs><linearGradient id="sw60g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient></defs>`;
      back += `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#1e2228"/><rect x="-400" y="-300" width="${W + 800}" height="560" fill="#2a2e34"/>`;
      // the strip lights converge to the vanishing point (540, 820)
      for (let i = 0; i < 6; i++) { const u = Math.pow(i / 6, 1.6), y = lerp(-120, 700, u), w = lerp(560, 70, u); back += `<rect x="${f1(540 - w / 2)}" y="${f1(y)}" width="${f1(w)}" height="${f1(lerp(26, 6, u))}" rx="4" fill="#f4f0e2" opacity="0.92"/>` + wash(540, y + 10, w * 0.9, lerp(80, 20, u), '#e8f0ff', 0.18); }
      back += `<rect x="420" y="700" width="240" height="260" fill="#30343a" stroke="${INK}" stroke-width="4"/><rect x="440" y="720" width="200" height="40" fill="#e8dcc4" opacity="0.4"/>`;
      // shelves both sides: rows of tape spines in perspective
      let shelves = '';
      const side = (dir) => { let g = ''; const xn = dir < 0 ? -380 : W + 380, xf = dir < 0 ? 420 : 660;
        for (let row = 0; row < 6; row++) { const yN = -60 + row * 330, yF = 700 + row * 44;
          g += `<path d="M${xn} ${yN + 300} L${xf} ${yF + 40} L${xf} ${yF + 46} L${xn} ${yN + 330} Z" fill="#5a4e40" stroke="${INK}" stroke-width="3"/>`;
          for (let k = 0; k < 16; k++) { const u0 = k / 16, u1 = (k + 0.85) / 16, ue = Math.pow(u0, 0.75), ue1 = Math.pow(u1, 0.75);
            const xa = lerp(xn, xf, ue), xb = lerp(xn, xf, ue1), ya = lerp(yN, yF, ue), yb = lerp(yN + 300, yF + 40, ue);
            const col = SPINE[Math.floor(r() * SPINE.length)];
            g += `<path d="M${f1(xa)} ${f1(ya + 20)} L${f1(xb)} ${f1(lerp(yN, yF, ue1) + 20)} L${f1(xb)} ${f1(lerp(yN + 300, yF + 40, ue1))} L${f1(xa)} ${f1(yb)} Z" fill="${col}" stroke="${INK}" stroke-width="${f1(lerp(3, 1, ue))}"/>`; } }
        return g; };
      shelves += side(-1) + side(1);
      const floor = `<path d="M-400 ${H + 200} L420 960 L660 960 L${W + 400} ${H + 200} Z" fill="#8a8478"/><path d="M380 ${H} L520 960 L560 960 L700 ${H}" fill="#f4f0e2" opacity="0.12"/>` + wash(540, 1500, 400, 300, '#e8f0ff', 0.08);
      return { light: { dir: -1, rim: '#e8f0ff', key: '#f4ead8' }, layers: [[0.1, back], [0.35, floor], [0.5, shelves]] };
    },

    // a store's front at night: checkout counters on the left, glass doors on the right onto a car park with lamps and a
    // typed sign strip (store name as plain text only); polished floor
    sw60_exit(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#262a30"/><rect x="-400" y="-300" width="${W + 800}" height="420" fill="#30343a"/>`;
      for (let i = 0; i < 4; i++) back += `<rect x="${-260 + i * 420}" y="60" width="300" height="20" rx="4" fill="#f4f0e2" opacity="0.9"/>` + wash(-110 + i * 420, 80, 260, 60, '#e8f0ff', 0.2);
      // the glass doors (right): night car park beyond
      let doors = `<rect x="560" y="420" width="560" height="900" fill="#0c1420" stroke="${INK}" stroke-width="10"/>`;
      doors += `<rect x="560" y="1000" width="560" height="320" fill="#1a1e24"/>` + [700, 960].map(x => `<rect x="${x}" y="720" width="8" height="300" fill="#2a2e34"/><circle cx="${x + 4}" cy="716" r="12" fill="#ffe8b0"/>` + wash(x + 4, 730, 120, 80, '#ffe0a0', 0.35)).join('');
      doors += `<rect x="600" y="960" width="180" height="60" rx="14" fill="#2e3440"/><rect x="900" y="970" width="160" height="56" rx="14" fill="#3a2e30"/>`;
      doors += `<path d="M840 420 L840 1320" stroke="${INK}" stroke-width="12"/><rect x="560" y="420" width="560" height="900" fill="#cfe0ff" opacity="0.06"/><path d="M600 460 L700 460 L620 900 Z" fill="#fff" opacity="0.07"/>`;
      doors += `<rect x="560" y="380" width="560" height="40" fill="#1a1c20" stroke="${INK}" stroke-width="5"/>`;
      // checkout counters (left)
      let counters = '';
      for (let i = 0; i < 2; i++) { const x = -120 + i * 300; counters += `<rect x="${x}" y="1060" width="220" height="200" fill="#4a4e54" stroke="${INK}" stroke-width="6"/><rect x="${x - 10}" y="1040" width="240" height="30" fill="#6a6e74" stroke="${INK}" stroke-width="4"/><rect x="${x + 120}" y="990" width="70" height="56" rx="6" fill="#2a2e34" stroke="${INK}" stroke-width="4"/><rect x="${x + 70}" y="760" width="10" height="280" fill="#3a3e44"/><rect x="${x + 40}" y="740" width="70" height="44" rx="6" fill="#d9a441" opacity="0.25" stroke="${INK}" stroke-width="3"/>`; }
      const floor = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#8a8478"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M-400 ${1300 + i * 120} L${W + 400} ${1300 + i * 120}" stroke="#7a746a" stroke-width="3"/>`).join('') + wash(840, 1400, 360, 120, '#cfe0ff', 0.1);
      return { light: { dir: 1, rim: '#cfe0ff', key: '#f4ead8' }, layers: [[0.15, back], [0.3, doors], [0.5, counters], [0.7, floor]] };
    },

    // a marble hall: pale columns, a deep red curtain behind a long raised bench, nine empty high-backed chairs (lit by the
    // shot), a polished floor
    sw60_hall(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#2a2622"/>`;
      back += `<rect x="-400" y="260" width="${W + 800}" height="700" fill="#5a2a26"/>` + Array.from({ length: 22 }, (_, i) => `<path d="M${-380 + i * 82} 260 L${-380 + i * 82} 960" stroke="#3a1a18" stroke-width="16" opacity="0.6"/>`).join('');
      back += [-200, 100, 980, 1280].map(x => `<rect x="${x - 60}" y="120" width="120" height="980" fill="#d8d0c0" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3, 4].map(k => `<path d="M${x - 40 + k * 20} 140 L${x - 40 + k * 20} 1080" stroke="#b8b0a0" stroke-width="5"/>`).join('') + `<rect x="${x - 80}" y="100" width="160" height="40" fill="#e8e0d0" stroke="${INK}" stroke-width="4"/>`).join('');
      back += `<rect x="-400" y="40" width="${W + 800}" height="70" fill="#e0d8c8" stroke="${INK}" stroke-width="5"/>`;
      const bench = `<rect x="60" y="1020" width="960" height="200" fill="#4a3020" stroke="${INK}" stroke-width="6"/><rect x="40" y="1000" width="1000" height="34" fill="#6a4630" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${90 + i * 116}" y="1050" width="100" height="150" fill="none" stroke="${INK}" stroke-width="3" opacity="0.5"/>`).join('');
      const floor = `<rect x="-400" y="1220" width="${W + 800}" height="${H}" fill="#cfc6b4"/>` + [0, 1, 2, 3, 4, 5].map(i => `<path d="M${-400 + i * 360} 1220 L${-900 + i * 520} ${H + 200}" stroke="#b0a896" stroke-width="4"/>`).join('') + wash(540, 1200, 600, 100, '#fff4dc', 0.12);
      return { light: { dir: -1, rim: '#ffe8c0', key: '#fff0d8' }, layers: [[0.15, back], [0.42, bench], [0.6, floor]] };
    },

    // a roadside at night: dark trees, a street lamp, a kerb and the road; the patrol car is drawn by the shot
    sw60_curb(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="sw60sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#1c2634"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#sw60sky)"/>` + E.cine.stars(t, 60, 6031, -200, 700);
      let trees = '';
      const r = R(6032); for (let i = 0; i < 14; i++) { const x = -300 + i * 120 + r() * 60, h = 300 + r() * 200; trees += `<ellipse cx="${f1(x)}" cy="${f1(1120 - h / 2)}" rx="${f1(90 + r() * 50)}" ry="${f1(h / 2)}" fill="#0e1612"/>`; }
      trees += `<rect x="-400" y="1100" width="${W + 800}" height="40" fill="#141a18"/><rect x="900" y="560" width="14" height="580" fill="#2a2e32"/><path d="M907 566 Q860 540 820 560" stroke="#2a2e32" stroke-width="10" fill="none"/><circle cx="818" cy="566" r="14" fill="#ffe8b0"/>` + wash(818, 600, 160, 120, '#ffe0a0', 0.3);
      const road = `<rect x="-400" y="1140" width="${W + 800}" height="60" fill="#5a5a58"/><rect x="-400" y="1196" width="${W + 800}" height="${H}" fill="#2a2c30"/>` + [0, 1, 2, 3].map(i => `<rect x="${-300 + i * 380}" y="1620" width="200" height="14" fill="#d8d0b0" opacity="0.6"/>`).join('') + wash(540, 1400, 600, 200, '#d84a3a', f1(0.05 + 0.04 * Math.sin(t * 9)));
      return { light: { dir: 1, rim: '#a8b8e8', key: '#c8d0e8' }, layers: [[0.05, sky], [0.3, trees], [0.7, road]] };
    }
  });

  // the hero arrangement (frame 1 and the last frame): his silhouette right of centre facing right towards the shelf, the
  // tape in his hand at his hip, sliding under the jacket hem
  const HERO = { x: 660, y: 2090, s: 1.62 };
  const TAPE = { x: 590, y0: 1030, y1: 1140, s: 0.9 };
  // the tape's path in the hook: frame 1 already low at the hip and moving, then slides on under the hem
  const tapeY = tt => lerp(TAPE.y0, TAPE.y1, ease.inOut(seg(tt, -0.4, 2.2)));
  const hem = (y) => `<path d="M478 ${y} Q660 ${y + 30} 842 ${y} L850 ${y + 84} Q660 ${y + 110} 470 ${y + 84} Z" fill="#1a1e24" stroke="${INK}" stroke-width="5"/><path d="M488 ${y + 12} Q660 ${y + 40} 832 ${y + 12}" stroke="#3a424e" stroke-width="5" fill="none" opacity="0.8"/>`;

  E.registerScenes({
    // 1 - hook (frame 1): the SNOW WHITE tape in his hand at his hip, already sliding under his jacket hem into his
    //     waistband; his silhouette above, the aisle behind; the camera already pushing. On line 2 eight more plain tapes
    //     flick up in a row behind the label "+ 8 MORE TAPES".
    sw60_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.6), ei = WT(ctx, 1, 1, 3.0);
      return E.cine.shot(ctx, {
        set: 'sw60_aisle', grade: 'cold', haze: 0.4, dof: true,
        cam: { from: { x: 0, y: 40, z: 1.02 }, to: { x: 10, y: 60, z: 1.12 }, settle: true },
        figures: [
          { id: 'sw60_andrade', x: HERO.x, y: HERO.y, scale: HERO.s, dir: 1, turn: 0.45, pose: 'stand', silhouette: 'cool', depth: 1.0,
            keys: [{ at: 0.0, pose: 'stand', headTurn: -0.3, dur: 0.5 }, { at: 1.4, pose: 'stand', headTurn: 0.3, dur: 0.6 }, { at: l2 + 0.3, pose: 'stand_tense', headTurn: 0.0, dur: 0.6 }] }
        ],
        props: [
          { depth: 1.01, accent: true, svg: tt => `<defs><clipPath id="sw60hem"><rect x="-200" y="-400" width="1600" height="1590"/></clipPath></defs><g clip-path="url(#sw60hem)">` + tape(TAPE.x, tapeY(tt), TAPE.s, -6, { glow: 0.8 }) + hand(TAPE.x + 92, tapeY(tt) + 30, 0.8, 84) + `</g>` },
          { depth: 1.02, svg: hem(1150) }
        ],
        overlays: [
          { type: 'svg', at: ei - 0.1, svg: tt => { let g = ''; for (let i = 0; i < 8; i++) { const k = ease.back(seg(tt, ei - 0.1 + i * 0.07, ei + 0.25 + i * 0.07)); if (k <= 0) continue;
            const x = 50 + (i % 4) * 78, y = 640 + Math.floor(i / 4) * 150; g += `<g transform="translate(${x + 32} ${y + 60}) scale(${f1(Math.max(0.001, k) * 1000) / 1000}) translate(${-(x + 32)} ${-(y + 60)})">${spine(x, y, 64, 120, SPINE[i], '')}</g>`; } return g; } },
          { type: 'label', at: Math.max(ei, 3.05), x: 60, y: 590, text: '+ 8 MORE TAPES', fs: 40 }
        ],
        tag: LIKE
      });
    },

    // 2 - the thefts + the statistic: a store's front at night; his silhouette walks left to right towards the glass doors;
    //     the guard steps in from the doors on 'Kmarts' and holds a hand up; then the $153 counter with its credit row
    sw60_caught(ctx) {
      const t = ctx.t, T = ctx.T, wb = WT(ctx, 0, 5, 0.9), km = WT(ctx, 0, 8, 2.0), tv = LS(ctx, 1, 3.2), n = WT(ctx, 1, 3, 4.5);
      return E.cine.shot(ctx, {
        set: 'sw60_exit', grade: 'cold', haze: 0.4,
        cam: { from: { x: -20, y: 30, z: 1.0 }, to: { x: 20, y: 40, z: 1.07 } },
        figures: [
          { id: 'sw60_andrade', x: 120, y: 1760, scale: 0.86, dir: 1, turn: 0.4, pose: 'walk', silhouette: 'cool', depth: 1.0,
            walk: { at: 0.0, dur: km + 0.2, cadence: 4.4, stride: 16, from: 120, to: 470 },
            keys: [{ at: km + 0.25, pose: 'stand_tense', headTurn: 0.2, dur: 0.4 }, { at: tv + 0.4, pose: 'hands_together', dur: 0.6 }] },
          { id: 'sw60_guard', x: 960, y: 1780, scale: 0.9, dir: -1, turn: 0.4, pose: 'stand', expr: 'focused', depth: 1.01,
            walk: { at: km - 0.6, dur: 0.9, cadence: 3.8, stride: 14, from: 960, to: 800 },
            keys: [{ at: km + 0.3, pose: 'present', expr: 'stern', gaze: [-0.5, 0], dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: wb, x: 60, y: 470, text: 'TWO KMARTS · NOV 1995', fs: 40, sub: 'Ontario, then Montclair, California', until: tv - 0.1 },
          { type: 'label', at: km + 0.5, x: 60, y: 1180, text: 'STOPPED AT THE DOOR', fs: 36, sub: 'Both times', until: tv + 0.2 },
          { type: 'counter', at: n - 0.15, dur: 1.2, from: 0, to: 153, prefix: '$', suffix: '', label: '9 VIDEOTAPES IN ALL', y: 660, fs: 170 },
          { type: 'label', at: n + 0.35, x: 120, y: 840, text: '$84.70 + $68.84', fs: 32, sub: 'U.S. Supreme Court record, 2003' }
        ],
        tag: LIKE
      });
    },

    // 3 - the turn: a courtroom; his silhouette in the dock (right), the judge at the bench reads the file; the PRIORS card
    sw60_strikes(ctx) {
      const t = ctx.t, T = ctx.T, pr = WT(ctx, 0, 3, 0.4), cv = WT(ctx, 0, 5, 1.2);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: true }, grade: 'cold', haze: 0.5,
        cam: { from: { x: -10, y: 30, z: 1.0 }, to: { x: 20, y: 30, z: 1.07 } },
        figures: [
          { id: 'sw60_judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit_read', noChair: true, depth: 0.33,
            keys: [{ at: cv, pose: 'sit', expr: 'stern', dur: 0.5 }] },
          { id: 'sw60_andrade', x: 760, y: 1210, scale: 0.62, dir: -1, turn: 0.3, pose: 'stand', silhouette: 'cool', depth: 1.0,
            keys: [{ at: pr, pose: 'hands_together', dur: 0.5 }, { at: cv + 0.5, pose: 'bowed', dur: 0.7 }] }
        ],
        overlays: [
          { type: 'card', at: pr, x: 60, y: 1060, w: 560, rows: [{ text: 'PRIOR RECORD', fs: 34 }, { text: '1983: 3 BURGLARIES', fs: 34, at: cv }] }
        ],
        tag: LIKE
      });
    },

    // 4 - THE BIGGEST REVEAL: close on the bench; the judge lifts the gavel; 25 TO LIFE / + 25 TO LIFE / = 50 YEARS TO
    //     LIFE builds on the spoken words; the gavel and the single impact on 'two'
    sw60_reveal(ctx) {
      const t = ctx.t, T = ctx.T, th = WT(ctx, 0, 2, 0.4), tf = WT(ctx, 1, 0, 3.6), tm = WT(ctx, 1, 3, 4.5), tw = WT(ctx, 1, 4, 4.9);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false, benchDepth: 0.7, table: false }, grade: 'cold', haze: 0.5,
        cam: { from: { x: 0, y: -240, z: 1.04 }, to: { x: 0, y: -230, z: 1.14 }, settle: true },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        props: [{ depth: 0.705, svg: `<rect x="200" y="850" width="680" height="420" fill="#3a3632" stroke="${INK}" stroke-width="6"/>` + [260, 400, 680, 820].map(x => `<rect x="${x - 20}" y="880" width="70" height="330" fill="none" stroke="${INK}" stroke-width="3" opacity="0.5"/>`).join('') }],
        figures: [
          { id: 'sw60_judge', x: 540, y: 990, scale: 0.8, dir: 1, turn: 0.05, pose: 'sit', expr: 'stern', noChair: true, depth: 0.69,
            keys: [{ at: th, pose: 'sit_read', dur: 0.5 }, { at: tf - 0.2, pose: 'sit', dur: 0.4 }, { at: tw - 0.32, pose: 'gavel', dur: 0.3 }] }
        ],
        overlays: [
          { type: 'label', at: th, x: 60, y: 960, text: 'THREE STRIKES · 25 TO LIFE', fs: 36, sub: 'Each theft charged as a felony', until: tf - 0.3 },
          { type: 'svg', at: tf - 0.1, svg: tt => sum(tt, tf - 0.05, tm - 0.05, tw - 0.02) },
          { type: 'impact', at: tw, x: 540, y: 1000 }
        ],
        tag: TAG
      });
    },

    // 5 - BOTH SIDES: the courthouse at night; the state's lawyer (left) speaks on line 1; a critic (right) on line 2;
    //     typed side labels top-left / top-right
    sw60_sides(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.25), cl = WT(ctx, 0, 3, 1.0), l2 = LS(ctx, 1, 2.3), cr = WT(ctx, 1, 4, 3.3);
      return E.cine.shot(ctx, {
        set: 'courthouse_night', grade: 'night', haze: 0.5,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 20, y: 30, z: 1.06 } },
        figures: [
          { id: 'sw60_lawyer', x: 260, y: 1720, scale: 0.88, dir: 1, turn: 0.4, pose: 'stand', expr: 'stern', depth: 1.0,
            keys: [{ at: l1 + 0.1, pose: 'point', expr: 'determined', gaze: [0.4, 0], dur: 0.4 }, { at: l2, pose: 'arms_crossed', expr: 'stern', dur: 0.5 }] },
          { id: 'sw60_critic', x: 820, y: 1730, scale: 0.9, dir: -1, turn: 0.4, pose: 'arms_crossed', expr: 'focused', depth: 1.0,
            keys: [{ at: l2 + 0.05, pose: 'present', expr: 'determined', gaze: [-0.4, 0], dur: 0.4 }, { at: cr, pose: 'point', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: l1 + 0.1, x: 50, y: 470, text: 'THE LAW', fs: 44, sub: '3 strikes = 25 to life' },
          { type: 'label', at: l2 + 0.05, x: 340, y: 640, text: 'THE CRITICS', fs: 44, sub: 'Ninth Circuit + 4 justices' }
        ],
        tag: TAG
      });
    },

    // 6 - the vote + the FUN FACT: a marble hall; nine empty high-backed chairs; on 'five' five of them light up, four stay
    //     dim; a reporter in the foreground reads the ruling; the FUN FACT card (golf clubs)
    sw60_court(ctx) {
      const t = ctx.t, T = ctx.T, sc_ = WT(ctx, 0, 2, 0.6), up = WT(ctx, 0, 4, 1.3), fv = WT(ctx, 0, 6, 2.0);
      return E.cine.shot(ctx, {
        set: 'sw60_hall', grade: 'warm', haze: 0.45,
        cam: { from: { x: 0, y: 20, z: 1.0 }, to: { x: 0, y: 30, z: 1.06 } },
        figures: [
          { id: 'sw60_reporter', x: 840, y: 1820, scale: 0.92, dir: -1, turn: 0.35, pose: 'read', expr: 'focused', depth: 1.05,
            keys: [{ at: up, pose: 'read', expr: 'shocked', dur: 0.4 }, { at: fv + 0.6, pose: 'hand_to_face', expr: 'worried', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.415, svg: tt => { let g = ''; for (let i = 0; i < 9; i++) { const lit = i < 5 && tt > fv - 0.1 + i * 0.08; g += chair(140 + i * 100, 1010, 0.9, lit); } return g; } }
        ],
        overlays: [
          { type: 'label', at: sc_, x: 60, y: 1150, text: 'LOCKYER v. ANDRADE', fs: 36, sub: 'Upheld 5-4 · March 5, 2003' },
          { type: 'funfact', at: up + 0.25, y: 420, rows: [{ text: 'SAME DAY, SAME COURT:' }, { text: '25 TO LIFE UPHELD' }, { text: 'FOR 3 GOLF CLUBS' }, { text: 'Ewing v. California, 2003 · via AP', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 7 - the LESSON (save trigger, for the viewer): a roadside at night; a young man by his car, hands visible and calm;
    //     an officer with a torch; the checklist card with the SAVE ribbon (captions off)
    sw60_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 2, 1.0);
      return E.cine.shot(ctx, {
        set: 'sw60_curb', grade: 'night', haze: 0.5, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'sw60_viewer', x: 330, y: 1760, scale: 0.92, dir: 1, turn: 0.35, pose: 'stand', expr: 'worried', depth: 1.02,
            keys: [{ at: 0.3, pose: 'hands_together', expr: 'focused', dur: 0.5 }, { at: sv + 0.4, pose: 'stand', expr: 'neutral', dur: 0.6 }] },
          { id: 'sw60_officer', x: 820, y: 1740, scale: 0.88, dir: -1, turn: 0.35, pose: 'torch_low', expr: 'focused', depth: 1.0, propOpts: { beamLen: 420 } }
        ],
        props: [
          { depth: 0.85, svg: tt => patrol(820, 1330, 0.7, tt) },
          { depth: 0.95, svg: hatch(250, 1420, 0.72) }
        ],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 430, rows: [{ text: 'SAY YOU WILL STAY SILENT', fs: 42 }, { text: 'ASK FOR A LAWYER', fs: 42 }, { text: 'DO NOT CONSENT TO SEARCHES', fs: 42 }, { text: 'Public defenders: Santa Clara & Solano Co., CA', fs: 24, colour: '#cbbfa8' }] }
        ],
        tag: TAG
      });
    },

    // 8 - the outcome on the hero tape in frame 1's framing (the loop): the tape in his hand at the hip, held still; the
    //     AS SENTENCED card low, below the burned-in end question (last 3.6 s)
    sw60_end(ctx) {
      const t = ctx.t, T = ctx.T, pa = WT(ctx, 0, 4, 1.0);
      return E.cine.shot(ctx, {
        set: 'sw60_aisle', grade: 'cold', haze: 0.4, dof: true,
        cam: { from: { x: 10, y: 60, z: 1.06 }, to: { x: 0, y: 40, z: 1.12 }, settle: true },
        figures: [
          { id: 'sw60_andrade', x: HERO.x, y: HERO.y, scale: HERO.s, dir: 1, turn: 0.45, pose: 'stand', silhouette: 'cool', depth: 1.0,
            keys: [{ at: pa, pose: 'stand', headTurn: -0.3, dur: 0.8 }] }
        ],
        props: [
          { depth: 1.01, accent: true, svg: tt => `<defs><clipPath id="sw60hem2"><rect x="-200" y="-400" width="1600" height="1590"/></clipPath></defs><g clip-path="url(#sw60hem2)">` + tape(TAPE.x, TAPE.y0 + 6 * Math.sin(tt * 1.4), TAPE.s, -6, { glow: 0.8 + 0.2 * Math.sin(tt * 2.5) }) + hand(TAPE.x + 92, TAPE.y0 + 30 + 6 * Math.sin(tt * 1.4), 0.8, 84) + `</g>` },
          { depth: 1.02, svg: hem(1150) }
        ],
        overlays: [
          { type: 'label', at: pa + 0.1, x: 40, y: 790, text: 'AS SENTENCED', fs: 36, sub: 'No parole till 2046, aged 87' }
        ],
        tag: LIKE
      });
    }
  });
})();
