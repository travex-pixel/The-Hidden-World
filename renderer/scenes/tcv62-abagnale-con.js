/* Case File 62 (premium look, engagement + shares + smoothness + hooks + plateau + HOT TAKE rules): Frank Abagnale and
   "Catch Me If You Can". His claims (a Pan Am pilot, a doctor, a lawyer; $2.5 million in bad checks, by his own account)
   against what a researcher found in public records (Alan C. Logan, 2020): New York prison records place him at Great
   Meadow from July 1965 to December 1968, aged 17 to 20. Both sides are given; his rebuttal is on screen.
   Structure: frame 1 = the HERO OBJECTS on a desk by an airport window (a pilot's cap, a fanned stack of checks, a film
   clapperboard) with his silhouette in a pilot's uniform striding past, the camera already pushing; the concourse (the
   claims); a bank counter (the $2.5 million counter, HIS claim); an archive (the prison record: the biggest reveal, the one
   impact); the memoir at its disclaimer page (the FUN FACT); a cinema whose screen turns to bars (BOTH SIDES); a kitchen
   table (the LESSON: fake-check scams, captions off); the hero desk again with the burned-in verdict question.
   Smoothness (owner, 44+): cuts and dissolves, one push (the reveal), one zoom (the end); one slow camera move per shot;
   settle only on the hero dolly-ins (first and last) and the reveal; one impact, no shake, no handheld.
   Screen direction: he always walks left to right.
   Look: episode.look = 'premium', one dusk palette (shadow #16202c, mid #cdbb9c, accent #e3a23a). The ONLY strongly
   coloured object is the stack of checks (props marked accent: true).
   Content rules: Abagnale (a living person) is a faceless silhouette in a GENERIC pilot's uniform, tagged NOT A LIKENESS;
   nothing from the 2002 film (no poster, still or actor); no airline livery, logo or badge; the record card, book and checks
   are our own generic graphics. Everyone else is a generic figure.
   New environments (E.registerSets): fa62_terminal (a 1960s airport concourse at dusk, a window wall, a generic airliner
   outside), fa62_bank (a 1960s bank hall with a teller counter), fa62_archive (an archive room: shelves of file boxes, a
   long table, a desk lamp), fa62_cinema (a dark cinema: the screen on the left, a projector beam, rows of seats). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG_HIM = 'ILLUSTRATION · NOT A LIKENESS';
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#e3a23a';
  const PILOT = { id: 'fa62_frank', silhouette: 'cool', hat: { style: 'cap', color: '#1a2230', band: '#9a8450' } };

  // ---------- THE HERO OBJECTS
  // one check (generic: no bank name; an amber band = the accent), local origin = centre
  function check(x, y, s, rot = 0, glow = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    if (glow > 0) g += wash(0, 0, 230, 120, ACC, f1(0.2 * glow));
    g += `<rect x="-170" y="-74" width="340" height="148" rx="8" fill="#efe6cf" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="-170" y="-74" width="340" height="30" rx="6" fill="${ACC}" opacity="0.9"/>`;
    g += `<path d="M-150 -6 L60 -6 M-150 26 L20 26 M-150 52 L-40 52 M90 34 L150 34" stroke="#8a7a60" stroke-width="5" stroke-linecap="round"/>`;
    g += `<rect x="78" y="-20" width="76" height="34" rx="4" fill="none" stroke="#8a7a60" stroke-width="4"/><text x="116" y="6" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="22" fill="#6a5a40">$</text>`;
    g += `<path d="M30 60 q20 -22 40 0 t40 -4" stroke="#3a3a5a" stroke-width="4" fill="none"/>`;
    return g + '</g>';
  }
  // a fanned stack of checks
  function checkStack(x, y, s, fan = 1, glow = 0.6) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="40" rx="230" ry="40" fill="#000" opacity="0.3"/>`;
    for (let i = 0; i < 5; i++) g += check(-40 + i * 18 * fan, 10 - i * 8, 1, -14 + i * 7 * fan, i === 4 ? glow : 0);
    return g + '</g>';
  }
  // a pilot's peaked cap (generic: a plain dark crown, a muted braid, a black visor; no wings or badge)
  function cap(x, y, s, rot = 0) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><ellipse cx="0" cy="56" rx="150" ry="22" fill="#000" opacity="0.32"/>` +
      `<path d="M-120 -10 Q-140 -70 -40 -86 Q60 -96 130 -62 Q150 -40 120 -10 Z" fill="#1e2634" stroke="${INK}" stroke-width="6"/>` +
      `<path d="M-108 -14 Q0 -40 116 -14 L112 14 Q0 -6 -104 14 Z" fill="#141a24" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-100 -2 Q0 -24 108 -2" stroke="#9a8450" stroke-width="7" fill="none"/>` +
      `<path d="M-60 12 Q20 4 120 18 Q150 40 90 52 Q0 54 -70 34 Z" fill="#0c0e12" stroke="${INK}" stroke-width="5"/><path d="M-40 24 Q30 18 100 30" stroke="#3a4250" stroke-width="4" fill="none"/>` +
      `<circle cx="4" cy="-40" r="12" fill="#5a5444" stroke="${INK}" stroke-width="3"/></g>`;
  }
  // a film clapperboard (generic slate, no title), clap = 0 open .. 1 shut
  function clapper(x, y, s, clap = 1) {
    const a = -28 * (1 - clamp(clap, 0, 1));
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(-6) scale(${sc(s)})"><ellipse cx="0" cy="118" rx="170" ry="20" fill="#000" opacity="0.3"/>`;
    g += `<rect x="-150" y="-50" width="300" height="160" rx="6" fill="#1a1b1e" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-140 10 L140 10 M-140 60 L140 60 M0 10 L0 104" stroke="#c8c2b4" stroke-width="3" opacity="0.7"/>`;
    g += `<text x="-130" y="44" font-family="Nunito" font-weight="800" font-size="24" fill="#c8c2b4" opacity="0.85">SCENE</text><text x="12" y="44" font-family="Nunito" font-weight="800" font-size="24" fill="#c8c2b4" opacity="0.85">TAKE</text>`;
    g += `<rect x="-150" y="-80" width="300" height="30" fill="#1a1b1e" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${-140 + i * 60} -80 L${-110 + i * 60} -50 L${-80 + i * 60} -50 L${-110 + i * 60} -80 Z" fill="#e8e2d4"/>`).join('');
    g += `<g transform="rotate(${f1(a)} -150 -80)"><rect x="-150" y="-112" width="300" height="30" fill="#1a1b1e" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${-140 + i * 60} -112 L${-110 + i * 60} -82 L${-80 + i * 60} -82 L${-110 + i * 60} -112 Z" fill="#e8e2d4"/>`).join('') + `</g>`;
    return g + '</g>';
  }
  // the desk (foreground: a dark wooden top with a front edge) on which the hero objects sit
  function desk(y0) {
    return `<rect x="-300" y="${y0}" width="${W + 600}" height="${H - y0 + 300}" fill="#3a2a1e"/><rect x="-300" y="${y0}" width="${W + 600}" height="14" fill="#5a4230"/>` +
      `<path d="M-300 ${y0 + 60} L${W + 300} ${y0 + 40} M-300 ${y0 + 150} L${W + 300} ${y0 + 130}" stroke="#2e2218" stroke-width="5" opacity="0.6"/>` + wash(540, y0 + 120, 600, 160, '#ffd8a0', 0.12);
  }
  function heroDesk(t, clap = 1) {
    return desk(1500) + cap(250, 1590, 1.1, -6) + clapper(860, 1580, 0.95, clap);
  }
  // a generic airliner (side view, facing right; plain white and grey, no livery, no logo, no registration)
  function airliner(x, y, s) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    g += `<path d="M-420 -40 Q-430 -80 -380 -86 L360 -86 Q440 -80 470 -40 Q440 -6 360 0 L-380 0 Q-430 -4 -420 -40 Z" fill="#d8d6d0" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-380 -86 L-440 -220 L-380 -220 L-300 -86 Z" fill="#c4c2bc" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-60 -30 L-200 90 L-130 90 L60 -30 Z" fill="#b8b6b0" stroke="${INK}" stroke-width="5"/>`;
    g += [-80, -150].map(ex => `<rect x="${ex - 40}" y="40" width="80" height="28" rx="12" fill="#8a8a88" stroke="${INK}" stroke-width="4"/>`).join('');
    for (let i = 0; i < 18; i++) g += `<rect x="${-330 + i * 36}" y="-66" width="14" height="18" rx="5" fill="#ffe2a8" opacity="0.85"/>`;
    g += `<path d="M380 -70 Q430 -66 450 -46 L380 -46 Z" fill="#3a4a5a"/><path d="M-420 -40 L470 -40" stroke="#9a9a98" stroke-width="4" opacity="0.6"/>`;
    g += `<rect x="-20" y="0" width="10" height="44" fill="#3a3a3a"/><circle cx="-15" cy="50" r="12" fill="#1a1a1a"/><rect x="330" y="0" width="8" height="40" fill="#3a3a3a"/><circle cx="334" cy="46" r="10" fill="#1a1a1a"/>`;
    return g + '</g>';
  }
  // a plain open book (no title), the right page shows a short disclaimer paragraph as grey lines
  function book(x, y, s, glow = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="70" rx="380" ry="40" fill="#000" opacity="0.3"/>`;
    g += `<path d="M-360 -200 L0 -170 L360 -200 L360 60 L0 90 L-360 60 Z" fill="#5a3a2a" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-340 -190 Q-170 -210 0 -170 L0 76 Q-170 40 -340 50 Z" fill="#efe8d8" stroke="${INK}" stroke-width="4"/><path d="M340 -190 Q170 -210 0 -170 L0 76 Q170 40 340 50 Z" fill="#f4eee0" stroke="${INK}" stroke-width="4"/>`;
    for (let i = 0; i < 8; i++) g += `<path d="M-300 ${-140 + i * 24} L-40 ${-130 + i * 24}" stroke="#a89a80" stroke-width="5" opacity="0.6"/>`;
    g += `<text x="170" y="-128" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="22" fill="#6a5a40" letter-spacing="3">AUTHOR'S NOTE</text>`;
    for (let i = 0; i < 5; i++) g += `<path d="M50 ${-96 + i * 26} L${i === 4 ? 200 : 300} ${-104 + i * 26}" stroke="#8a7a60" stroke-width="5" opacity="0.75"/>`;
    if (glow > 0) g += `<rect x="40" y="-114" width="276" height="134" rx="8" fill="${ACC}" opacity="${f1(0.22 * glow)}"/>`;
    return g + '</g>';
  }
  // a generic record card (our own graphic, not a replica): ruled lines and two typed years
  function recordCard(x, y, s, rot = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><rect x="-200" y="-130" width="400" height="260" rx="6" fill="#e8e0c8" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="-200" y="-130" width="400" height="44" rx="6" fill="#b8ac8c"/><text x="0" y="-98" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="24" fill="#2a2418" letter-spacing="3">RECORD CARD</text>`;
    for (let i = 0; i < 5; i++) g += `<path d="M-180 ${-60 + i * 36} L180 ${-60 + i * 36}" stroke="#a89c80" stroke-width="3"/>`;
    g += `<text x="-170" y="-14" font-family="Nunito" font-weight="800" font-size="34" fill="#2a2418">IN · 1965</text><text x="-170" y="58" font-family="Nunito" font-weight="800" font-size="34" fill="#2a2418">OUT · 1968</text>`;
    return g + '</g>';
  }
  // the shadow of bars falling across the picture (u 0..1 slides them in from the left)
  function barShadow(u, op = 0.32, x0 = -200, y0 = 0, h = H) {
    let g = '';
    for (let i = 0; i < 9; i++) { const x = x0 + (i * 150) * u - 60 + 260 * u; g += `<rect x="${f1(x)}" y="${y0}" width="46" height="${h}" fill="#05070a" opacity="${f1(op * u)}"/>`; }
    return g;
  }
  // a smartphone (screen up, lit)
  const phone = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-44" y="-84" width="88" height="168" rx="16" fill="#141618" stroke="${INK}" stroke-width="4"/><rect x="-36" y="-72" width="72" height="140" rx="8" fill="#9ab8c8" opacity="0.85"/></g>`;

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a 1960s airport concourse at dusk: a full-height window wall (mullions) onto the apron, a generic airliner outside with
    // runway lights beyond, a polished terrazzo floor with reflections, pendant lights
    fa62_terminal(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="fatsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2638"/><stop offset="0.65" stop-color="#6a6070"/><stop offset="1" stop-color="#d89a6a"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1700" fill="url(#fatsky)"/>`;
      sky += wash(760, 1180, 520, 150, '#ffc890', 0.3) + `<path d="M-400 1240 L1480 1240 L1480 1320 L-400 1320 Z" fill="#3a3a40"/>`;
      for (let i = 0; i < 14; i++) sky += `<circle cx="${-300 + i * 120}" cy="1252" r="4" fill="${i % 2 ? '#a8d0ff' : '#ffd890'}" opacity="${f1(0.6 + 0.3 * Math.sin(t * 2 + i))}"/>`;
      const plane = airliner(o.planeX ?? 520, 1236, o.planeS ?? 0.9);
      let frame = '';
      for (let i = 0; i < 9; i++) frame += `<rect x="${-360 + i * 220}" y="140" width="22" height="1180" fill="#20242a" stroke="${INK}" stroke-width="3"/>`;
      frame += `<rect x="-400" y="120" width="${W + 800}" height="40" fill="#20242a"/><rect x="-400" y="720" width="${W + 800}" height="14" fill="#20242a"/><rect x="-400" y="1310" width="${W + 800}" height="30" fill="#2a2e34"/>`;
      frame += [80, 540, 1000].map(x => `<path d="M${x} 0 L${x} 200" stroke="#14161a" stroke-width="4"/><path d="M${x - 50} 230 L${x + 50} 230 L${x + 30} 200 L${x - 30} 200 Z" fill="#c8b890"/>` + wash(x, 250, 90, 50, '#ffe8c0', 0.4)).join('');
      let floor = `<rect x="-400" y="1340" width="${W + 800}" height="${H}" fill="#6a625a"/>`;
      for (let i = 0; i < 10; i++) floor += `<path d="M${-400 + i * 200} 1340 L${-1200 + i * 380} 2000" stroke="#5a524a" stroke-width="4" opacity="0.6"/>`;
      floor += `<rect x="-400" y="1340" width="${W + 800}" height="200" fill="#d89a6a" opacity="0.12"/>` + wash(760, 1420, 520, 90, '#ffd0a0', 0.18);
      return { light: { dir: 1, rim: '#ffc890', key: '#f0d8b8' }, layers: [[0.1, sky], [0.25, plane], [0.4, frame], [0.75, floor]] };
    },

    // a 1960s bank hall: cream marble columns, a wall clock, a teller counter with a brass grille across the middle
    fa62_bank(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#3e3a32"/><rect x="-400" y="-300" width="${W + 800}" height="800" fill="#4a453c"/>`;
      for (let i = 0; i < 6; i++) { const x = -300 + i * 330; back += `<rect x="${x}" y="100" width="110" height="1100" fill="#b8ae98" stroke="${INK}" stroke-width="4"/><rect x="${x - 14}" y="90" width="138" height="40" fill="#a89e88" stroke="${INK}" stroke-width="4"/><rect x="${x + 16}" y="140" width="14" height="1050" fill="#d0c8b4" opacity="0.6"/>`; }
      const ang = t * 0.4;
      back += `<g transform="translate(540 330)"><circle r="78" fill="#efe8d8" stroke="${INK}" stroke-width="7"/><path d="M0 0 L${f1(Math.sin(ang) * 54)} ${f1(-Math.cos(ang) * 54)}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M0 0 L0 -36" stroke="${INK}" stroke-width="9" stroke-linecap="round"/></g>`;
      back += wash(540, 600, 600, 400, '#ffe0b0', 0.12);
      let counter = `<rect x="-400" y="1180" width="${W + 800}" height="60" fill="#6a4a30" stroke="${INK}" stroke-width="6"/><rect x="-400" y="1240" width="${W + 800}" height="${H}" fill="#4a3424"/>`;
      for (let i = 0; i < 12; i++) counter += `<rect x="${-380 + i * 160}" y="1270" width="120" height="400" rx="6" fill="#56402c" stroke="#3a2a1c" stroke-width="4"/>`;
      let grille = `<rect x="${o.grilleX ?? 560}" y="780" width="560" height="400" fill="none"/>`;
      for (let i = 0; i < 12; i++) grille += `<path d="M${(o.grilleX ?? 560) + i * 46} 780 L${(o.grilleX ?? 560) + i * 46} 1180" stroke="#b8964a" stroke-width="6" opacity="0.8"/>`;
      grille += `<path d="M${o.grilleX ?? 560} 780 L${(o.grilleX ?? 560) + 560} 780" stroke="#b8964a" stroke-width="12"/><rect x="${(o.grilleX ?? 560) + 120}" y="1100" width="200" height="80" fill="#2a2016" opacity="0.6"/>`;
      return { light: { dir: -1, rim: '#ffe0b0', key: '#f0dcc0' }, layers: [[0.2, back], [0.95, ''], [1.04, counter], [1.05, grille]] };
    },

    // an archive room: tall shelves of numbered file boxes receding, a high window, a long table with a green desk lamp
    fa62_archive(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#1c2026"/>`;
      back += `<rect x="380" y="120" width="320" height="300" fill="#7a8a9a" stroke="${INK}" stroke-width="8"/><path d="M540 120 L540 420 M380 270 L700 270" stroke="${INK}" stroke-width="8"/>` + wash(540, 270, 240, 200, '#b8c8d8', 0.25);
      for (let r = 0; r < 2; r++) { const x0 = r ? 760 : -380; for (let sh = 0; sh < 6; sh++) { const y = 200 + sh * 170;
        back += `<rect x="${x0}" y="${y + 140}" width="700" height="16" fill="#3a3228"/>`;
        for (let b = 0; b < 7; b++) back += `<rect x="${x0 + 14 + b * 96}" y="${y + 40}" width="84" height="100" fill="${['#8a7a5e', '#7a6c52', '#94846a'][(b + sh + r) % 3]}" stroke="${INK}" stroke-width="3"/><rect x="${x0 + 34 + b * 96}" y="${y + 70}" width="44" height="22" fill="#d8ccb0"/>`; } }
      back += wash(540, 900, 700, 500, '#b8c8d8', 0.06);
      const y0 = o.tableY ?? 1360;
      let table = `<rect x="-400" y="${y0}" width="${W + 800}" height="40" fill="#5a4430" stroke="${INK}" stroke-width="5"/><rect x="-400" y="${y0 + 40}" width="${W + 800}" height="${H}" fill="#241c16"/>`;
      if (o.lamp !== false) table += `<g transform="translate(${o.lampX ?? 860} ${y0})"><rect x="-10" y="-160" width="20" height="160" fill="#2a2a24"/><path d="M-110 -150 Q0 -230 110 -150 Z" fill="#2e5a3a" stroke="${INK}" stroke-width="5"/><rect x="-60" y="-12" width="120" height="14" rx="5" fill="#2a2a24"/></g>` + wash(o.lampX ?? 860, y0 + 10, 420, 120, '#ffe0a0', 0.32);
      return { light: { dir: 1, rim: '#ffe0a0', key: '#e8dcc8' }, layers: [[0.25, back], [0.98, ''], [1.05, table]] };
    },

    // a dark cinema: the screen on the upper left, a projector beam from the upper right through haze, rows of seats
    fa62_cinema(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#120e12"/>`;
      back += `<rect x="-400" y="300" width="1200" height="40" fill="#3a1e22"/><rect x="-400" y="980" width="1200" height="40" fill="#3a1e22"/>`;
      for (let i = 0; i < 12; i++) back += `<path d="M${-380 + i * 30} 300 Q${-370 + i * 30} 660 ${-380 + i * 30} 1020" stroke="#4a2228" stroke-width="18" fill="none"/>`;
      for (let i = 0; i < 12; i++) back += `<path d="M${560 + i * 30} 300 Q${570 + i * 30} 660 ${560 + i * 30} 1020" stroke="#4a2228" stroke-width="18" fill="none"/>`;
      const beam = `<path d="M1240 120 L0 380 L0 960 Z" fill="#fff4dc" opacity="${f1(0.07 + 0.015 * Math.sin(t * 7))}"/>` + wash(1180, 140, 90, 60, '#fff4dc', 0.5);
      let seats = `<rect x="-400" y="1180" width="${W + 800}" height="${H}" fill="#1a1216"/>`;
      for (let r = 0; r < 3; r++) for (let i = 0; i < 14; i++) seats += `<rect x="${-300 + i * 110 + r * 30}" y="${1300 + r * 200}" width="92" height="120" rx="22" fill="#4a1e26" stroke="${INK}" stroke-width="4"/>`;
      return { light: { dir: -1, rim: '#fff0d0', key: '#e8d8c8' }, layers: [[0.3, back], [0.5, beam], [1.08, seats]] };
    }
  });

  // the screen picture (world coords inside the screen x 20..760, y 360..960): u = 0 a dusk sky with a generic airliner
  // gliding right; v = 0..1 bars slide across and the plane fades: the story becomes a cell
  function screenPic(t, v) {
    let g = `<defs><clipPath id="fascr"><rect x="20" y="360" width="740" height="600"/></clipPath><linearGradient id="fascg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a5070"/><stop offset="1" stop-color="#e8b080"/></linearGradient></defs>`;
    g += `<g clip-path="url(#fascr)"><rect x="20" y="360" width="740" height="600" fill="url(#fascg)"/>`;
    g += `<g opacity="${f1(1 - 0.7 * v)}">${airliner(lerp(200, 560, seg(t, 0, 6)), 700, 0.62)}</g>`;
    g += `<rect x="20" y="360" width="740" height="600" fill="#1a1c22" opacity="${f1(0.7 * v)}"/>`;
    for (let i = 0; i < 8; i++) { const x = lerp(-200, 50 + i * 96, ease.out(v)); g += `<rect x="${f1(x)}" y="360" width="34" height="600" fill="#5a5e66" stroke="${INK}" stroke-width="4" opacity="${f1(v)}"/>`; }
    g += `<rect x="20" y="360" width="740" height="600" fill="#fff4dc" opacity="0.08"/></g>`;
    return g + `<rect x="20" y="360" width="740" height="600" fill="none" stroke="#0a0a0c" stroke-width="10"/>` + wash(390, 660, 460, 380, '#ffe8c8', f1(0.12 * (1 - v)));
  }

  E.registerScenes({
    // 1 - hook (frame 1): the cap, the fanned checks and the clapperboard on a desk by the window; his silhouette in a pilot's
    //     uniform already striding past left to right behind the desk; the camera already pushing in. The clapper snaps
    //     shut on 'hit'.
    fa62_hook(ctx) {
      const t = ctx.t, T = ctx.T, hit = WT(ctx, 1, 2, 3.2);
      return E.cine.shot(ctx, {
        set: 'fa62_terminal', grade: 'warm', haze: 0.35, dof: true,
        cam: { from: { x: 0, y: 30, z: 1.02 }, to: { x: 16, y: 40, z: 1.12 }, settle: true },
        figures: [
          { ...PILOT, x: 120, y: 1470, scale: 0.72, dir: 1, turn: 0.3, pose: 'walk', depth: 0.92,
            walk: { at: -0.6, dur: T + 1.2, cadence: 5.6, stride: 22, from: 60, to: 1000 } }
        ],
        props: [
          { depth: 1.04, svg: tt => heroDesk(tt, tt < hit - 0.35 ? 0 : ease.in(seg(tt, hit - 0.35, hit))) },
          { depth: 1.05, accent: true, svg: tt => checkStack(560, 1660, 1.05, 0.6 + 0.4 * ease.out(seg(tt, 0, 1.2)), 0.7) }
        ],
        overlays: [
          { type: 'label', at: Math.max(LS(ctx, 1, 2.6) + 0.1, 3.0), x: 60, y: 820, text: 'CATCH ME IF YOU CAN · 2002', fs: 38, sub: 'His story, as a Spielberg film' }
        ],
        tag: TAG_HIM
      });
    },

    // 2 - the claims: the concourse, wider; his silhouette strides left to right past two flight attendants, who turn to
    //     watch; the cap tipped on 'pilot'
    fa62_claim(ctx) {
      const t = ctx.t, T = ctx.T, pl = WT(ctx, 0, 7, 1.5), dc = WT(ctx, 0, 10, 2.2), lw = dc + 0.5;
      return E.cine.shot(ctx, {
        set: 'fa62_terminal', setOpts: { planeX: 360, planeS: 1.05 }, grade: 'warm', haze: 0.45,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 10, y: 30, z: 1.06 } },
        figures: [
          { ...PILOT, x: 80, y: 1720, scale: 0.86, dir: 1, turn: 0.3, pose: 'walk', depth: 1.0,
            walk: { at: 0.0, dur: pl - 0.1, cadence: 5.6, stride: 22, from: 80, to: 420 },
            keys: [{ at: pl, pose: 'present', headTurn: 0.3, dur: 0.4 }, { at: lw + 0.3, pose: 'stand', dur: 0.5 }] },
          { id: 'fa62_crew', x: 760, y: 1660, scale: 0.8, dir: -1, turn: 0.35, pose: 'stand', expr: 'neutral', depth: 0.98,
            keys: [{ at: pl - 0.2, pose: 'hands_together', expr: 'relieved', gaze: [-0.6, 0], dur: 0.5 }, { at: lw, pose: 'hand_to_face', expr: 'shocked', dur: 0.4 }] },
          { id: 'fa62_crew2', x: 930, y: 1640, scale: 0.78, dir: -1, turn: 0.3, pose: 'arms_crossed', expr: 'neutral', depth: 0.97,
            keys: [{ at: dc, pose: 'stand', expr: 'realise', gaze: [-0.6, 0], dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: pl + 0.1, x: 60, y: 820, text: 'HIS CLAIMS · AS A TEENAGER', fs: 38, sub: 'Pan Am pilot, doctor, lawyer (his account)' }
        ],
        tag: TAG_HIM
      });
    },

    // 3 - the bank counter: his silhouette (left) slides a check under the grille to the teller (right), who stamps it;
    //     the counter to $2,500,000 (HIS claim); then a cut-in of a check fluttering down as 'checked' lands
    fa62_checks(ctx) {
      const t = ctx.t, T = ctx.T, mn = WT(ctx, 0, 2, 0.6), ck = WT(ctx, 1, 3, 2.9);
      return E.cine.shot(ctx, {
        set: 'fa62_bank', setOpts: { grilleX: 560 }, grade: 'warm', haze: 0.35,
        cam: { from: { x: 10, y: 20, z: 1.0 }, to: { x: -10, y: 30, z: 1.06 } },
        figures: [
          { ...PILOT, x: 280, y: 1640, scale: 0.92, dir: 1, turn: 0.3, pose: 'stand', depth: 1.0,
            keys: [{ at: 0.2, pose: 'present', dur: 0.5 }, { at: mn + 0.8, pose: 'stand', headTurn: 0.2, dur: 0.5 }] },
          { id: 'fa62_teller', x: 820, y: 1560, scale: 0.8, dir: -1, turn: 0.35, pose: 'read', expr: 'neutral', depth: 0.96,
            keys: [{ at: mn, pose: 'examine', expr: 'focused', dur: 0.4 }, { at: ck - 0.2, pose: 'hand_to_face', expr: 'realise', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.05, accent: true, svg: tt => { const k = ease.inOut(seg(tt, 0.3, 1.1)); return check(lerp(400, 700, k), 1160, 0.75, lerp(-8, 4, k), 0.5) +
            (tt > ck - 0.4 ? check(lerp(260, 300, seg(tt, ck - 0.4, T)), lerp(900, 1130, ease.out(seg(tt, ck - 0.4, ck + 0.6))), 0.6, lerp(-30, 12, seg(tt, ck - 0.4, ck + 0.6)), 0.4) : ''); } }
        ],
        overlays: [
          { type: 'counter', at: mn - 0.1, dur: 1.4, from: 0, to: 2500000, prefix: '$', suffix: '', label: 'IN BAD CHECKS, HE CLAIMED', y: 600, fs: 132, until: ck - 0.3 },
          { type: 'label', at: mn + 0.4, x: 90, y: 1235, text: 'HIS OWN CLAIM · UNVERIFIED', fs: 32, sub: 'Book and talks: 26 countries, age 16-21', until: ck - 0.3 }
        ],
        tag: TAG_HIM
      });
    },

    // 4 - THE BIGGEST REVEAL: an archive; the researcher (a generic stand-in) lifts a record card from a box on 'find' and
    //     it swings up to camera on 'Prison' (the single impact); the shadow of bars slides across the table
    fa62_prison(ctx) {
      const t = ctx.t, T = ctx.T, fd = WT(ctx, 0, 3, 0.8), pr = WT(ctx, 0, 4, 1.3), yrs = LS(ctx, 1, 3.0);
      return E.cine.shot(ctx, {
        set: 'fa62_archive', grade: 'cold', haze: 0.45,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 10, y: 40, z: 1.09 }, settle: true },
        rack: { at: pr - 0.1, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'fa62_researcher', x: 190, y: 1700, scale: 0.92, dir: 1, turn: 0.35, pose: 'examine', expr: 'focused', depth: 1.0,
            keys: [{ at: fd - 0.3, pose: 'present', expr: 'focused', dur: 0.4 }, { at: pr + 0.1, pose: 'stand', expr: 'shocked', gaze: [0.3, -0.2], dur: 0.4 }, { at: yrs + 0.3, pose: 'hand_to_face', expr: 'realise', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.04, svg: tt => `<g transform="translate(720 1350)"><rect x="-160" y="-110" width="320" height="120" fill="#8a7a5e" stroke="${INK}" stroke-width="5"/><rect x="-60" y="-80" width="120" height="40" fill="#d8ccb0"/></g>` },
          { depth: 1.06, svg: tt => { const k = ease.out(seg(tt, pr - 0.2, pr + 0.5)), lift = ease.inOut(seg(tt, fd - 0.2, pr - 0.2));
            return recordCard(lerp(lerp(700, 660, lift), 650, k), lerp(lerp(1280, 1200, lift), 1070, k), lerp(0.6, 1.2, k), lerp(-12, -3, k)); } },
          { depth: 1.07, svg: tt => barShadow(ease.inOut(seg(tt, pr, pr + 1.2)), 0.28, -260, 1100, 900) }
        ],
        overlays: [
          { type: 'impact', at: pr, x: 540, y: 1000 },
          { type: 'label', at: pr + 0.25, x: 60, y: 760, text: 'GREAT MEADOW PRISON, NEW YORK', fs: 36, sub: 'Jul 1965 - Dec 1968, per archive records' }
        ],
        tag: TAG
      });
    },

    // 5 - the FUN FACT: close on the table; the memoir (a generic book) open at its author's note; the researcher seated
    //     behind it turns the page and taps the note
    fa62_book(ctx) {
      const t = ctx.t, T = ctx.T, bk = WT(ctx, 0, 3, 0.8), ch = WT(ctx, 0, 9, 2.0);
      return E.cine.shot(ctx, {
        set: 'fa62_archive', setOpts: { tableY: 1440, lampX: 920 }, grade: 'warm', haze: 0.4, dof: true,
        cam: { from: { x: 10, y: 40, z: 1.04 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'fa62_researcher', x: 300, y: 1560, scale: 0.88, dir: 1, turn: 0.4, pose: 'sit_read', expr: 'focused', depth: 0.99,
            keys: [{ at: bk, pose: 'point', expr: 'realise', gaze: [0.4, 0.4], dur: 0.4 }, { at: ch + 0.2, pose: 'sit', expr: 'stern', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.06, svg: tt => book(600, 1660, 1.05, seg(tt, bk, bk + 0.5)) }
        ],
        overlays: [
          { type: 'funfact', at: bk - 0.05, y: 420, rows: [{ text: 'HIS OWN BOOK WARNS:' }, { text: 'NAMES, DATES AND PLACES' }, { text: 'HAVE BEEN CHANGED' }, { text: "The memoir's disclaimer (1980)", fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 6 - BOTH SIDES: a cinema; the screen shows a dusk sky and an airliner; two cinema-goers in the front row applaud on
    //     'great story'; on 'Records' bars slide over the picture and they react; his rebuttal on a label
    fa62_sides(ctx) {
      const t = ctx.t, T = ctx.T, gs = WT(ctx, 0, 5, 1.3), rc = LS(ctx, 1, 2.4), bb = WT(ctx, 1, 4, 3.2);
      return E.cine.shot(ctx, {
        set: 'fa62_cinema', grade: 'night', haze: 0.5,
        cam: { from: { x: -10, y: 20, z: 1.0 }, to: { x: 10, y: 30, z: 1.06 } },
        figures: [
          { id: 'fa62_fan1', x: 620, y: 1680, scale: 0.9, dir: -1, turn: 0.45, pose: 'sit', expr: 'relieved', depth: 1.0,
            keys: [{ at: gs - 0.3, pose: 'hands_together', expr: 'relieved', gaze: [-0.6, -0.5], dur: 0.35 }, { at: bb, pose: 'arms_crossed', expr: 'stern', dur: 0.45 }] },
          { id: 'fa62_fan2', x: 880, y: 1700, scale: 0.88, dir: -1, turn: 0.45, pose: 'sit', expr: 'neutral', depth: 1.01,
            keys: [{ at: gs, pose: 'hands_together', expr: 'relieved', gaze: [-0.6, -0.5], dur: 0.35 }, { at: bb + 0.1, pose: 'hand_to_face', expr: 'shocked', dur: 0.45 }] }
        ],
        props: [
          { depth: 0.6, svg: tt => screenPic(tt, ease.inOut(seg(tt, rc + 0.1, bb + 0.2))) }
        ],
        overlays: [
          { type: 'label', at: rc + 0.2, x: 60, y: 1150, text: 'HIS SIDE: HE DISPUTES IT', fs: 36, sub: 'Says sources were too embarrassed to admit it' }
        ],
        tag: TAG
      });
    },

    // 7 - the LESSON (save trigger, for the viewer): a young man at a kitchen table looks from a check to his phone; the
    //     checklist card with the SAVE ribbon (captions off)
    fa62_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 3, 1.0);
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'warm', haze: 0.4, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.06 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'fa62_viewer', x: 330, y: 1700, scale: 0.95, dir: 1, turn: 0.35, pose: 'read', expr: 'neutral', depth: 1.02,
            keys: [{ at: 0.4, pose: 'examine', expr: 'focused', dur: 0.5 }, { at: sv + 0.4, pose: 'hand_to_face', expr: 'worried', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.07, accent: true, svg: tt => check(700, 1205, 0.55, -6, 0.3) },
          { depth: 1.07, svg: phone(900, 1200, 0.6) }
        ],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 430, rows: [{ text: 'OVERPAID? IT IS A SCAM', fs: 42 }, { text: 'CLEARED CAN STILL BOUNCE', fs: 42 }, { text: 'NEVER SEND THE EXTRA BACK', fs: 42 }, { text: 'FTC · Fake check scams', fs: 24, colour: '#cdbb9c' }] }
        ],
        tag: TAG
      });
    },

    // 8 - the outcome on the hero desk in frame 1's framing (the loop): his silhouette walks in from the left and stops by
    //     the desk; the label at the bottom until the burned-in verdict question takes over (last 3.6 s)
    fa62_end(ctx) {
      const t = ctx.t, T = ctx.T, pd = WT(ctx, 0, 6, 1.6);
      return E.cine.shot(ctx, {
        set: 'fa62_terminal', grade: 'warm', haze: 0.35,
        cam: { from: { x: 0, y: 30, z: 1.03 }, to: { x: 16, y: 40, z: 1.12 }, settle: true },
        figures: [
          { ...PILOT, x: 120, y: 1470, scale: 0.72, dir: 1, turn: 0.3, pose: 'walk', depth: 0.92,
            walk: { at: 0.0, dur: 1.6, cadence: 5.6, stride: 22, from: 100, to: 520 },
            keys: [{ at: 1.7, pose: 'stand', headTurn: 0.3, dur: 0.4 }, { at: pd, pose: 'present', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.04, svg: tt => heroDesk(tt, 1) },
          { depth: 1.05, accent: true, svg: tt => checkStack(560, 1660, 1.05, 1, 0.8) }
        ],
        overlays: [
          { type: 'label', at: pd, x: 60, y: 1190, text: 'A PAID FRAUD CONSULTANT', fs: 38, sub: 'Washington Post, 2002 · AARP, 2015' }
        ],
        tag: TAG_HIM
      });
    }
  });
})();
