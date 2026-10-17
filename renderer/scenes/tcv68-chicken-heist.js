/* Case File 68 (premium look, engagement v3: TRENDING + SEARCH, THE LIST FORMAT): the Memphis chicken heist, then two other
   verified food heists, escalating to the most absurd. 1 Memphis, 15 Sept 2026: a task force serving an unrelated warrant
   at a motel found 13 people unloading pallets of chicken from an 18-wheeler (valued at $250,000 by the task force; the
   police affidavit says about $110,000); police say the driver told them he was trading the load to pay off a drug debt
   (all ACCUSED, not convicted, as of Oct 2026); 2 Greencastle, Pennsylvania, Feb 2025: about 100,000 eggs stolen from a
   distribution trailer during the egg shortage (no arrests); 3 Europe, March 2026: a truck with 413,793 KitKat bars (over 12
   tonnes) stolen between central Italy and Poland; still missing.
   Structure: frame 1 = the HERO (a semi-trailer's open rear doors at night behind a motel, boxes of chicken passed hand to
   hand by three silhouettes, red-and-blue light starting to sweep in from the left, the camera already pushing) with the
   headline; item 1's irony on the same lot, wide (a patrol car rolls in; the driver's silhouette by the cab); item 2 at a
   farm loading dock at night (silhouettes wheel away a pallet of egg trays); the LESSON (a young man offered meat from the
   back of a plain van at dusk, captions off) BEFORE item 3; item 3 = the biggest reveal on a motorway at night (a plain
   semi rolls left to right into the fog); the 413,793 counter, the FUN FACT and the spoken share line in a depot's empty
   loading bay; the punchline back at the hero trailer in frame 1's framing (the loop).
   Smoothness (owner, 44+): cuts and dissolves, one push, one zoom (the end); one slow camera move per shot; settle only on
   the hero dolly-ins (first frame, the reveal, the last frame); one impact, no shake, no handheld.
   Screen direction: loads travel left to right except the hand-to-hand chain in the hero shot (out of the trailer, leftwards
   towards the motel), which is the same in the first and last frames.
   Look: episode.look = 'premium', one cool night palette (shadow #141e28, mid #c4baa6, accent #e2a13b). The ONLY strongly
   coloured object is the chicken box's amber band (props marked accent: true); the police light is a soft wash.
   Content rules: everyone in Memphis is ACCUSED only: the unloaders and the driver are anonymous dark silhouettes (NOT A
   LIKENESS), never named; no weapon is shown. Officers, the depot worker, the seller and the young man are generic figures
   with no badge, crest or logo. Boxes, egg trays and chocolate bars are generic (no brand artwork). New environments
   (E.registerSets): ch68_lot (a motel's back parking lot at night), ch68_farm (a farm loading dock at night), ch68_street
   (a quiet street at dusk), ch68_road (a motorway through hills at night), ch68_depot (a depot loading bay). */
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
  const ACC = '#e2a13b';

  // a generic semi-trailer truck in profile (cab to the right; flip -1 = left), plain white trailer, no lettering;
  // bottom centre (x, y); ~1500 long at k = 1. o.lights = marker lights on.
  function semi(x, y, k, t, o = {}) {
    const fl = o.flip || 1, on = o.lights !== false;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k * fl)} ${sc(k)})"><ellipse cx="0" cy="8" rx="760" ry="30" fill="#000" opacity="0.45"/>`;
    g += `<rect x="-760" y="-470" width="1060" height="360" rx="10" fill="#d8dce0" stroke="${INK}" stroke-width="7"/><rect x="-760" y="-470" width="1060" height="40" fill="#b8bec6"/><rect x="-760" y="-150" width="1060" height="40" fill="#8a9098"/>`;
    for (let i = 0; i < 9; i++) g += `<path d="M${-720 + i * 120} -430 L${-720 + i * 120} -150" stroke="#b8bec6" stroke-width="3"/>`;
    g += `<rect x="-700" y="-110" width="500" height="26" fill="#2a2e34"/>`;
    // the tractor: a tall cab with a sleeper, an exhaust stack, a chrome bumper
    g += `<path d="M300 -110 L300 -520 Q300 -560 340 -560 L540 -560 L560 -520 L720 -500 L740 -440 L740 -110 Z" fill="#8e2a2a" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M560 -520 L720 -500 L728 -440 L560 -440 Z" fill="#141c2c"/><path d="M340 -540 L540 -540 L540 -440 L340 -440 Z" fill="#141c2c"/><rect x="290" y="-620" width="26" height="520" fill="#9aa0a8" stroke="${INK}" stroke-width="3"/>`;
    g += `<rect x="730" y="-180" width="40" height="70" rx="6" fill="#c9d0d6" stroke="${INK}" stroke-width="4"/><rect x="742" y="-300" width="16" height="40" fill="${on ? '#fff6d0' : '#4a4a4a'}"/>`;
    if (on) { for (let i = 0; i < 9; i++) g += `<circle cx="${-740 + i * 130}" cy="-480" r="7" fill="#ffb040"/>`; g += wash(760, -280, 120, 60, '#fff6d0', 0.35); }
    [[-600, -4], [-470, -4], [370, -4], [660, -4]].forEach(([cx, cy]) => { g += `<circle cx="${cx}" cy="${cy}" r="62" fill="#0b0b0d" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="26" fill="#6a7078"/>`; });
    return g + '</g>';
  }
  // a generic 2000s patrol sedan in profile (front to the right): plain white body, a dark stripe, a flashing light bar.
  // No text, no crest, no number.
  function patrolCar(x, y, k, t, o = {}) {
    const on = o.lights !== false, ph = (t * 2.4) % 1, red = ph < 0.5, fl = o.flip || 1;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k * fl)} ${sc(k)})"><ellipse cx="0" cy="6" rx="470" ry="24" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-450 -46 L-454 -108 Q-448 -128 -420 -132 L-290 -140 L-220 -150 L-140 -228 Q-126 -236 -100 -236 L92 -236 Q114 -236 126 -226 L204 -150 L420 -136 Q452 -130 456 -104 L456 -46 Z" fill="#e9edf1" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-452 -104 L456 -100 L456 -84 L-452 -88 Z" fill="#2a3448"/><path d="M-130 -222 L-32 -222 L-32 -160 L-200 -160 Z M-20 -222 L96 -222 L176 -160 L-20 -160 Z" fill="#141a24"/>`;
    g += `<rect x="-96" y="-258" width="150" height="20" rx="6" fill="#20242c" stroke="${INK}" stroke-width="3"/>`;
    g += `<rect x="-92" y="-256" width="68" height="16" rx="5" fill="${on && red ? '#ff3a2a' : '#5a1a18'}"/><rect x="-20" y="-256" width="70" height="16" rx="5" fill="${on && !red ? '#3a6aff' : '#18224a'}"/>`;
    if (on) g += wash(red ? -58 : 16, -250, 150, 70, red ? '#ff3a2a' : '#3a6aff', 0.55);
    g += `<rect x="440" y="-126" width="14" height="22" fill="#fff6d0"/>` + (o.headlights ? `<path d="M454 -118 L760 -150 L760 -60 L454 -104 Z" fill="#fff6d0" opacity="0.1"/>` : '');
    [-290, 300].forEach(cx => { g += `<path d="M${cx - 70} -46 A70 70 0 0 1 ${cx + 70} -46 Z" fill="#141210"/><circle cx="${cx}" cy="-2" r="52" fill="#0b0b0d" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-2" r="24" fill="#5a606a"/>`; });
    if (o.doorOpen) g += `<path d="M-20 -160 L-20 -48 L-110 -40 L-120 -150 Z" fill="#dfe4e8" stroke="${INK}" stroke-width="5"/>`;
    return g + '</g>';
  }

  // ---------- THE HERO: a cardboard box of chicken (generic, no brand): tan box, a lighter top face, a darker side, an
  // amber tape band (the accent) and a small white label with a stencilled drumstick. Centred at (x, y); ~150 x 96 at s = 1
  function cbox(x, y, s, rot = 0, glow = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    if (glow > 0) g += wash(0, 0, 130, 100, ACC, f1(0.2 * glow));
    g += `<path d="M-75 -48 L-62 -62 L88 -62 L75 -48 Z" fill="#c9ad82" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    g += `<path d="M75 -48 L88 -62 L88 34 L75 48 Z" fill="#8a7050" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    g += `<rect x="-75" y="-48" width="150" height="96" rx="3" fill="#b2946a" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-75" y="-9" width="150" height="18" fill="${ACC}"/><path d="M75 -9 L88 -21 L88 -3 L75 9 Z" fill="#b07a26"/>`;
    g += `<rect x="-62" y="-40" width="50" height="26" rx="2" fill="#ece6d8"/><path d="M-46 -27 q6 -9 15 -4 q7 5 1 11 l-6 2 l-5 5 q-3 3 -6 0 q-2 -3 1 -6 z" fill="#8a5a32"/>`;
    g += `<path d="M20 22 L60 22 M20 32 L48 32" stroke="#7a6446" stroke-width="3"/>`;
    return g + '</g>';
  }
  // a semi-trailer seen from the rear with both doors swung open: the lit interior stacked with boxes, a dome light, tail
  // lights, an under-ride bar and dual wheels. Bottom centre on the ground at (x, y); ~740 wide x 1000 tall at s = 1
  function trailerRear(x, y, s, t, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="6" rx="470" ry="34" fill="#000" opacity="0.5"/>`;
    [[-250], [250]].forEach(([wx]) => { g += `<rect x="${wx - 80}" y="-150" width="160" height="150" rx="22" fill="#0c0d0f" stroke="${INK}" stroke-width="4"/><path d="M${wx} -150 L${wx} 0" stroke="#24262a" stroke-width="6"/>`; });
    g += `<rect x="-360" y="-200" width="720" height="34" fill="#3a3e44" stroke="${INK}" stroke-width="4"/><rect x="-300" y="-166" width="600" height="18" fill="#c8ccd0" stroke="${INK}" stroke-width="3"/>`;
    // the body and its open mouth
    g += `<rect x="-370" y="-1000" width="740" height="800" rx="8" fill="#d2d6da" stroke="${INK}" stroke-width="7"/>`;
    g += `<rect x="-330" y="-968" width="660" height="752" fill="#0d1115"/>`;
    // the interior in perspective: floor, side walls, the back wall with stacked boxes, a dome light
    g += `<path d="M-330 -216 L330 -216 L210 -330 L-210 -330 Z" fill="#30343a"/><path d="M-330 -968 L-210 -860 L-210 -330 L-330 -216 Z" fill="#1c2228"/><path d="M330 -968 L210 -860 L210 -330 L330 -216 Z" fill="#161b20"/>`;
    g += `<rect x="-210" y="-860" width="420" height="530" fill="#22282e"/>`;
    for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) g += cbox(-150 + c * 100, -370 - r * 70, 0.6, 0, 0);
    for (let r = 0; r < 5; r++) { g += cbox(-268, -290 - r * 110, 0.86, 0, 0); g += cbox(262, -290 - r * 110, 0.86, 0, 0); }
    if (o.loose !== false) g += cbox(-150, -262, 0.9, -4, 0.4) + cbox(-40, -262, 0.9, 3, 0.3);
    g += `<rect x="-30" y="-952" width="60" height="16" rx="6" fill="#fff4d8"/>` + wash(0, -820, 320, 260, '#ffe8c0', 0.26) + wash(0, -300, 360, 120, '#ffe0b0', 0.12);
    // the doors, swung open towards the camera (foreshortened), with lock bars
    g += `<path d="M-370 -1000 L-478 -970 L-478 -228 L-370 -200 Z" fill="#c4c8cc" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-440 -960 L-440 -236 M-404 -976 L-404 -218" stroke="#8a9096" stroke-width="5"/>`;
    g += `<path d="M370 -1000 L478 -970 L478 -228 L370 -200 Z" fill="#b8bcc0" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M440 -960 L440 -236 M404 -976 L404 -218" stroke="#7a8086" stroke-width="5"/>`;
    // lights
    g += [-344, 344].map(lx => `<rect x="${lx - 16}" y="-236" width="32" height="20" rx="4" fill="#d83a2a"/>` + wash(lx, -226, 50, 30, '#ff4a30', 0.4)).join('');
    for (let i = 0; i < 5; i++) g += `<circle cx="${-200 + i * 100}" cy="-984" r="7" fill="#ffb040"/>`;
    return g + '</g>';
  }
  // red and blue police light washing in from the left edge (a parked or arriving car out of frame); k 0..1 intensity
  function sweep(t, k, x = -60, y = 1180) {
    if (k <= 0) return '';
    const ph = (t * 2.4) % 1, red = ph < 0.5, a = 0.5 + 0.5 * Math.sin(t * 15.1);
    return wash(x, y, 520, 620, red ? '#ff3a2a' : '#3a6aff', f1(0.22 * k * (0.75 + 0.25 * a))) + wash(x + 300, y - 200, 380, 260, red ? '#ff5a40' : '#5a80ff', f1(0.08 * k));
  }
  // a stack of egg trays on a pallet (cream trays with rows of egg bumps); bottom centre (x, y); ~260 wide
  function eggPallet(x, y, s, layers = 9) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="170" ry="16" fill="#000" opacity="0.4"/>`;
    g += `<rect x="-140" y="-26" width="280" height="26" fill="#7a5e40" stroke="${INK}" stroke-width="4"/><path d="M-100 -26 L-100 0 M0 -26 L0 0 M100 -26 L100 0" stroke="#4a3826" stroke-width="5"/>`;
    for (let i = 0; i < layers; i++) {
      const yy = -26 - (i + 1) * 30;
      g += `<rect x="-130" y="${yy}" width="260" height="28" fill="#d6cbb2" stroke="${INK}" stroke-width="3"/>`;
      for (let k = 0; k < 7; k++) g += `<ellipse cx="${-108 + k * 36}" cy="${yy + 2}" rx="15" ry="9" fill="#efe6d2" stroke="#a89a80" stroke-width="2"/>`;
    }
    g += `<path d="M-132 ${-26 - layers * 30 - 6} L132 ${-26 - layers * 30 - 6} L132 -26 L-132 -26 Z" fill="#dfe6ea" opacity="0.12"/>`;
    return g + '</g>';
  }
  // a pallet jack handle (the silhouette pushes it); bottom at (x, y)
  const jack = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M0 0 L-70 -300" stroke="#2a2c30" stroke-width="12" stroke-linecap="round"/><path d="M-90 -300 L-50 -300" stroke="#2a2c30" stroke-width="14" stroke-linecap="round"/><rect x="-20" y="-40" width="50" height="40" fill="#3a3e44"/><circle cx="6" cy="0" r="16" fill="#0c0d0f"/></g>`;
  // a generic chocolate bar in a plain dark wrapper (no brand), with a small printed batch code; centred (x, y); ~240 long
  function bar(x, y, s, rot = 0, code = false) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><rect x="-120" y="-34" width="240" height="68" rx="8" fill="#6e2a28" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-120 -34 L-96 -34 L-96 34 L-120 34 Z M120 -34 L96 -34 L96 34 L120 34 Z" fill="#a8a49c"/><path d="M-80 -18 L60 -18" stroke="#8a3e3a" stroke-width="6" stroke-linecap="round"/>`;
    if (code) g += `<rect x="10" y="4" width="80" height="22" fill="#ece6d8"/><path d="${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `M${14 + i * 6} 7 L${14 + i * 6} 23`).join(' ')}" stroke="#141210" stroke-width="${2}"/>`;
    return g + '</g>';
  }
  // a phone (screen towards camera) scanning: a framing box and a scan line; centred (x, y)
  function scanPhone(x, y, s, t, ok = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-70" y="-130" width="140" height="260" rx="20" fill="#1c1e22" stroke="${INK}" stroke-width="5"/><rect x="-58" y="-110" width="116" height="214" rx="6" fill="#2e3a44"/>`;
    g += `<path d="M-40 -60 L-40 -76 L-24 -76 M24 -76 L40 -76 L40 -60 M40 40 L40 56 L24 56 M-24 56 L-40 56 L-40 40" stroke="#e8e4d8" stroke-width="4" fill="none"/>`;
    const sy = -70 + 120 * (0.5 + 0.5 * Math.sin(t * 4));
    g += `<path d="M-38 ${f1(sy)} L38 ${f1(sy)}" stroke="${ACC}" stroke-width="3" opacity="${f1(0.9 * (1 - ok))}"/>`;
    if (ok > 0) g += `<g opacity="${f1(ok)}"><circle cx="0" cy="-10" r="30" fill="${ACC}"/><path d="M-14 -10 L-3 2 L16 -20" stroke="#1c1e22" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
    return g + '</g>';
  }
  // a plain panel van in profile with its rear doors open (rear at the left; no lettering); bottom centre (x, y)
  function van(x, y, s) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="80" cy="6" rx="380" ry="24" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-260 -60 L-260 -420 Q-260 -440 -240 -440 L230 -440 Q300 -436 340 -330 L400 -250 Q430 -230 430 -190 L430 -60 Z" fill="#d8dadc" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M250 -420 Q300 -414 326 -330 L250 -330 Z" fill="#1a2028"/><path d="M-250 -420 L-250 -70" stroke="#0d1115" stroke-width="2"/><rect x="-252" y="-424" width="40" height="358" fill="#0d1115"/>`;
    g += `<path d="M-260 -430 L-360 -404 L-360 -84 L-260 -64 Z" fill="#c8cacc" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    g += `<rect x="-250" y="-120" width="680" height="24" fill="#8a9096"/>`;
    [-150, 300].forEach(cx => { g += `<circle cx="${cx}" cy="-56" r="56" fill="#0c0d0f" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-56" r="24" fill="#6a7078"/>`; });
    g += cbox(-190, -150, 0.5, 0, 0) + cbox(-190, -210, 0.5, 2, 0);
    return g + '</g>';
  }
  // a two-storey motel block (generic): doors and windows along two floors, a walkway with a railing, a stairwell
  function motel(x0, x1, top, bot, seed) {
    const r = R(seed);
    let g = `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${bot - top}" fill="#3a3632" stroke="${INK}" stroke-width="4"/><rect x="${x0 - 20}" y="${top - 26}" width="${x1 - x0 + 40}" height="30" fill="#2a2724"/>`;
    const mid = (top + bot) / 2;
    g += `<rect x="${x0}" y="${mid - 10}" width="${x1 - x0}" height="20" fill="#4a4540"/>`;
    for (let x = x0 + 20; x < x1; x += 30) g += `<path d="M${x} ${mid - 50} L${x} ${mid - 10}" stroke="#5a554e" stroke-width="3"/>`;
    g += `<path d="M${x0} ${mid - 50} L${x1} ${mid - 50}" stroke="#5a554e" stroke-width="5"/>`;
    for (const [fy0, fy1] of [[top + 30, mid - 10], [mid + 30, bot]]) for (let x = x0 + 60; x < x1 - 80; x += 170) {
      const lit = r() > 0.45, wy = fy0 + 30, dh = fy1 - fy0 - 20;
      g += `<rect x="${x}" y="${fy0 + 10}" width="56" height="${dh}" fill="#5a3a2e" stroke="${INK}" stroke-width="3"/><circle cx="${x + 46}" cy="${fy0 + 10 + dh / 2}" r="4" fill="#c8b88a"/>`;
      g += `<rect x="${x + 76}" y="${wy}" width="64" height="${Math.min(70, dh - 30)}" fill="${lit ? '#d8b878' : '#262a2e'}" opacity="${lit ? 0.75 : 1}" stroke="${INK}" stroke-width="3"/>`;
      g += `<circle cx="${x + 28}" cy="${fy0 + 2}" r="5" fill="#ffe8b8"/>` + wash(x + 28, fy0 + 20, 40, 30, '#ffe0a0', 0.25);
    }
    return g;
  }
  // a tall sodium lamp
  const lamp = (x, y, h) => `<rect x="${x - 7}" y="${y}" width="14" height="${h}" fill="#26292c"/><path d="M${x} ${y + 6} Q${x + 10} ${y - 30} ${x + 70} ${y - 30}" stroke="#26292c" stroke-width="10" fill="none"/><ellipse cx="${x + 78}" cy="${y - 24}" rx="30" ry="9" fill="#ffd89a"/>` + wash(x + 78, y + 40, 200, 220, '#ffc878', 0.16) + `<path d="M${x + 60} ${y - 20} L${x - 120} ${y + h} L${x + 280} ${y + h} L${x + 96} ${y - 20} Z" fill="#ffd090" opacity="0.05"/>`;

  // ---------- new environments (generic illustrations, not replicas of any real place)
  E.registerSets({
    // a motel's back parking lot at night: a dark sky, the two-storey motel block across the back, a sodium lamp on the
    // right, a dumpster on the left, wet asphalt with parking lines in the foreground
    ch68_lot(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="chlsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b12"/><stop offset="1" stop-color="#1e2632"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1600" fill="url(#chlsky)"/>` + E.cine.stars(t, 30, 6801, -200, 500);
      sky += `<path d="M-400 700 L-200 640 L40 690 L260 620 L520 680 L800 610 L1100 670 L1480 630 L1480 760 L-400 760 Z" fill="#141a20"/>`;
      let back = motel(-380, 1460, 700, 1150, 6802) + lamp(980, 820, 420);
      back += `<rect x="-400" y="1150" width="${W + 800}" height="${H}" fill="#24262a"/>`;
      let lot = `<rect x="-400" y="1170" width="${W + 800}" height="${H}" fill="#2a2c30"/>`;
      for (let i = -6; i < 10; i++) lot += `<path d="M${540 + i * 150} 1180 L${540 + i * 330} ${H + 200}" stroke="#8a8a80" stroke-width="5" opacity="0.35"/>`;
      lot += wash(980, 1500, 520, 220, '#ffc878', 0.08) + wash(540, 1700, 700, 120, '#9ab4d0', 0.05);
      lot += `<g><rect x="-150" y="1020" width="300" height="190" rx="6" fill="#2e4038" stroke="${INK}" stroke-width="5"/><path d="M-160 1020 L160 1020 L150 990 L-150 990 Z" fill="#26362e" stroke="${INK}" stroke-width="4"/></g>`;
      return { light: { dir: 1, rim: '#9ab4d0', key: '#d8c8b0' }, layers: [[0.05, sky], [0.45, back], [0.8, lot]] };
    },

    // a farm loading dock at night: a long low metal-sided building with ribbed walls, two roller doors (one lit), a box
    // trailer backed up on the left, gravel in front, a fence line and a dark field behind
    ch68_farm(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="chfsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060a12"/><stop offset="1" stop-color="#1a2430"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#chfsky)"/>` + E.cine.stars(t, 110, 6811, -200, 700);
      sky += `<path d="M-400 820 Q300 760 900 800 T1480 790 L1480 900 L-400 900 Z" fill="#10161c"/>`;
      let bld = `<rect x="80" y="760" width="1400" height="470" fill="#c4c2ba" stroke="${INK}" stroke-width="5"/><path d="M60 760 L1500 760 L1500 730 L80 700 Z" fill="#7a7c7e" stroke="${INK}" stroke-width="4"/>`;
      for (let x = 100; x < 1480; x += 26) bld += `<path d="M${x} 770 L${x} 1230" stroke="#a8a69e" stroke-width="3"/>`;
      bld += `<rect x="520" y="900" width="260" height="330" fill="#ffe2a8" opacity="0.85"/><rect x="520" y="900" width="260" height="70" fill="#8a8c8e"/>` + wash(650, 1080, 340, 260, '#ffd890', 0.25);
      bld += `<rect x="900" y="900" width="260" height="330" fill="#8a8c8e" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<path d="M900 ${930 + i * 30} L1160 ${930 + i * 30}" stroke="#6a6c6e" stroke-width="3"/>`).join('');
      bld += `<rect x="80" y="1200" width="1400" height="60" fill="#5a5850" stroke="${INK}" stroke-width="4"/>` + `<rect x="620" y="780" width="60" height="20" rx="5" fill="#fff4d8"/>` + wash(650, 820, 220, 160, '#ffe8c0', 0.22);
      // a box trailer backed to the dock on the left (side view, rear at the right, doors open)
      let trl = `<rect x="-400" y="820" width="860" height="360" rx="6" fill="#d8dadc" stroke="${INK}" stroke-width="6"/><rect x="-400" y="820" width="860" height="30" fill="#b8bcc0"/><rect x="440" y="834" width="60" height="336" fill="#c8cccf" stroke="${INK}" stroke-width="5"/>`;
      trl += `<rect x="-380" y="1180" width="820" height="28" fill="#2a2e34"/>` + [[-260], [-120], [300]].map(([cx]) => `<circle cx="${cx}" cy="1230" r="52" fill="#0b0b0d" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="1230" r="22" fill="#5a606a"/>`).join('');
      let ground = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#3a3a34"/>` + E.cine.scrub(1300, 10, 6812, '#2a2a24', 0.8, -300, 1400);
      for (let i = 0; i < 70; i++) { const rr = R(6813 + i); ground += `<circle cx="${f1(-300 + rr() * 1700)}" cy="${f1(1300 + rr() * 600)}" r="${f1(2 + rr() * 4)}" fill="#5a5850" opacity="0.6"/>`; }
      return { light: { dir: 1, rim: '#ffd8a8', key: '#e0d0b8' }, layers: [[0.05, sky], [0.5, bld], [0.62, trl], [0.85, ground]] };
    },

    // a quiet residential street at dusk: a warm-to-violet sky, a row of houses with lit windows and bare trees, a
    // pavement and kerb, the road in front
    ch68_street(ctx, o = {}) {
      let sky = `<defs><linearGradient id="chssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2638"/><stop offset="0.6" stop-color="#6a5a6c"/><stop offset="1" stop-color="#d89a6e"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#chssky)"/>`;
      let houses = '';
      const r = R(6821);
      for (let i = 0; i < 6; i++) {
        const x = -360 + i * 330, w = 260 + r() * 40, h = 220 + r() * 60, y = 1180 - h;
        houses += `<path d="M${x} ${y} L${x + w / 2} ${y - 110} L${x + w} ${y} Z" fill="#3a3436" stroke="${INK}" stroke-width="4"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#4a4240" stroke="${INK}" stroke-width="4"/>`;
        houses += `<rect x="${x + 30}" y="${y + 40}" width="70" height="70" fill="${r() > 0.4 ? '#e8b878' : '#2a2a30'}" opacity="0.85"/><rect x="${x + w - 100}" y="${y + 40}" width="70" height="70" fill="${r() > 0.5 ? '#e8b878' : '#2a2a30'}" opacity="0.85"/><rect x="${x + w / 2 - 30}" y="${y + h - 120}" width="60" height="120" fill="#2a2220"/>`;
      }
      houses += wash(540, 1150, 900, 160, '#ffcf9a', 0.12);
      let street = `<rect x="-400" y="1180" width="${W + 800}" height="70" fill="#7a746c"/><rect x="-400" y="1250" width="${W + 800}" height="16" fill="#9a948a"/><rect x="-400" y="1266" width="${W + 800}" height="${H}" fill="#3a3c40"/>`;
      for (let i = 0; i < 6; i++) street += `<rect x="${-300 + i * 340}" y="1760" width="160" height="12" fill="#c8c0a8" opacity="0.35"/>`;
      return { light: { dir: -1, rim: '#ffcfa0', key: '#ffe0c0' }, layers: [[0.05, sky], [0.45, houses], [0.85, street]] };
    },

    // a motorway through hills at night: a deep sky, layered hill silhouettes and a far mountain line, a fog bank on the
    // right, the road on an embankment with a guardrail and scrolling lane marks
    ch68_road(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="chrsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05080e"/><stop offset="1" stop-color="#202a36"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1700" fill="url(#chrsky)"/>` + E.cine.stars(t, 140, 6831, -200, 800);
      sky += `<path d="M-400 900 L-160 700 L60 820 L300 640 L560 800 L820 660 L1100 820 L1480 700 L1480 1000 L-400 1000 Z" fill="#1a222c"/>`;
      let hills = `<path d="M780 520 A44 44 0 1 0 806 600 A34 34 0 1 1 780 520 Z" fill="#ece6d4" opacity="0.85"/>` + wash(790, 560, 160, 160, '#d8e0e8', 0.12) + `<path d="M-400 1040 Q100 900 520 1000 T1480 960 L1480 1200 L-400 1200 Z" fill="#141a20"/>` + wash(1250, 1080, 700, 130, '#c8d0d8', 0.12);
      let road = `<rect x="-400" y="1180" width="${W + 800}" height="200" fill="#2e3034"/><rect x="-400" y="1170" width="${W + 800}" height="12" fill="#8a9096"/>`;
      for (let i = 0; i < 14; i++) { const x = ((i * 200 - t * 520) % 2800 + 2800) % 2800 - 600; road += `<rect x="${f1(x)}" y="1270" width="110" height="10" fill="#d8d0b8" opacity="0.6"/>`; }
      road += `<rect x="-400" y="1380" width="${W + 800}" height="16" fill="#9aa0a6"/>` + Array.from({ length: 20 }, (_, i) => `<rect x="${-380 + i * 100}" y="1380" width="10" height="60" fill="#6a7076"/>`).join('');
      road += `<rect x="-400" y="1440" width="${W + 800}" height="${H}" fill="#161a1c"/>` + E.cine.scrub(1460, 16, 6832, '#22281f', 1.2, -300, 1400);
      const fog = wash(1300, 1250, 700, 150, '#dfe6ea', 0.22) + wash(1200, 1320, 420, 90, '#e8eef0', 0.14);
      return { light: { dir: 1, rim: '#9ab4d0', key: '#b8c8dc' }, layers: [[0.05, sky], [0.35, hills], [0.85, road], [0.95, fog]] };
    },

    // a depot loading bay: concrete walls, a strip light, an open roller door to the night, a painted empty bay on the
    // floor, shrink-wrapped pallets of chocolate along the left wall, a steel table across the front
    ch68_depot(ctx, o = {}) {
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#2a3034"/>`;
      for (let y = 300; y < 1200; y += 80) back += `<path d="M-300 ${y} L${W + 300} ${y}" stroke="#242a2e" stroke-width="3"/>`;
      back += `<rect x="360" y="560" width="520" height="640" fill="#0c1218"/><rect x="360" y="520" width="520" height="60" fill="#5a6066" stroke="${INK}" stroke-width="4"/>` + E.cine.stars(0, 20, 6841, 600, 900).replace(/<circle/g, '<circle clip-path="url(#chdc)"');
      back = back.replace('<rect x="360" y="560"', '<defs><clipPath id="chdc"><rect x="360" y="580" width="520" height="620"/></clipPath></defs><rect x="360" y="560"');
      back += `<rect x="200" y="380" width="680" height="16" rx="6" fill="#e8ecf0" opacity="0.8"/>` + wash(540, 460, 600, 260, '#dfe8ee', 0.14);
      let floor = `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="#3a3e40"/><path d="M300 1220 L900 1220 L1040 1560 L160 1560 Z" fill="none" stroke="#b8a070" stroke-width="8" stroke-dasharray="40 24" opacity="0.6"/>`;
      for (const [px, py] of [[-120, 1300], [60, 1340]]) { floor += `<rect x="${px - 120}" y="${py - 20}" width="240" height="20" fill="#7a5e40"/>`; for (let i = 0; i < 6; i++) for (let k = 0; k < 2; k++) floor += bar(px - 56 + k * 112, py - 40 - i * 36, 0.44, 0, false); floor += `<rect x="${px - 124}" y="${py - 250}" width="248" height="232" fill="#dfe6ea" opacity="0.12"/>`; }
      const table = `<rect x="-300" y="1620" width="${W + 600}" height="34" fill="#9aa0a6" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1654" width="${W + 600}" height="${H}" fill="#2a3034"/>`;
      return { light: { dir: 1, rim: '#d8e4ea', key: '#c8d4dc' }, layers: [[0.2, back], [0.6, floor], [1.06, table]] };
    }
  });

  // the hero arrangement (frame 1 and the last frame): the trailer's open rear right of centre, one silhouette on the deck
  // handing boxes down, one on the ground passing them on, one carrying them away to the left
  const TX = 660, TY = 1590, TS = 0.78;
  const DECK = TY - 216 * TS;
  const HERO_CAM0 = { x: 0, y: 30, z: 1.02 };
  const A = [570, DECK - 225], B = [330, 1330], Cc = [90, 1360], PER = 1.5;
  // a box in the chain at phase p (0..1): deck hands -> ground hands (hold) -> carrier's hands -> away left
  function chainBox(p) {
    let x, y;
    if (p < 0.35) { const u = ease.inOut(p / 0.35); x = lerp(A[0], B[0], u); y = lerp(A[1], B[1], u) - 60 * Math.sin(Math.PI * u); }
    else if (p < 0.5) { x = B[0]; y = B[1]; }
    else if (p < 0.8) { const u = ease.inOut((p - 0.5) / 0.3); x = lerp(B[0], Cc[0], u); y = lerp(B[1], Cc[1], u) - 40 * Math.sin(Math.PI * u); }
    else { const u = (p - 0.8) / 0.2; x = lerp(Cc[0], -200, u); y = Cc[1]; }
    return cbox(x, y, 0.8, 0, 0.7);
  }
  const chain = (tt, run = 1) => { const p0 = ((tt / PER) % 1 + 1) % 1; return chainBox(p0) + (run ? chainBox((p0 + 0.5) % 1) : ''); };
  const heroCrew = (keys3, keys1, keys2) => [
    { id: 'ch68_crew3', x: 620, y: DECK, scale: 0.46, dir: -1, turn: 0.4, pose: 'present', silhouette: 'cool', depth: 0.78, keys: keys3 },
    { id: 'ch68_crew1', x: 380, y: 1690, scale: 0.6, dir: -1, turn: 0.35, pose: 'present', silhouette: 'cool', depth: 0.82, keys: keys1 },
    { id: 'ch68_crew2', x: 150, y: 1760, scale: 0.66, dir: -1, turn: 0.3, pose: 'hands_together', silhouette: 'cool', depth: 0.86, keys: keys2 }
  ];
  // alternate poses on the chain's rhythm so the hands move with the boxes
  const rhythm = (from, to, a, b, off = 0) => { const k = []; let i = 0; for (let tt = from + off; tt < to; tt += PER / 2) k.push({ at: tt, pose: i++ % 2 ? b : a, dur: 0.3 }); return k; };

  E.registerScenes({
    // 1 - hook (frame 1): boxes already moving hand to hand out of the open trailer, the red-blue light starting to sweep in
    //     from the left, the camera already pushing in; the silhouettes freeze on 'arrested'
    ch68_hook(ctx) {
      const t = ctx.t, T = ctx.T, ar = WT(ctx, 0, 1, 0.6), l2 = LS(ctx, 1, 2.4);
      return E.cine.shot(ctx, {
        set: 'ch68_lot', grade: 'night', haze: 0.35,
        cam: { from: HERO_CAM0, to: { x: 20, y: 40, z: 1.1 }, settle: true },
        figures: heroCrew(
          rhythm(0, ar + 0.3, 'present', 'hands_together').concat([{ at: ar + 0.35, pose: 'stand_tense', headTurn: -0.4, dur: 0.4 }]),
          rhythm(0, ar + 0.3, 'hands_together', 'present', 0.35).concat([{ at: ar + 0.4, pose: 'stand_tense', headTurn: -0.5, dur: 0.4 }]),
          [{ at: 0, pose: 'hands_together', dur: 0.01 }, { at: ar + 0.45, pose: 'stand_tense', headTurn: -0.5, dur: 0.4 }]
        ),
        props: [
          { depth: 0.75, accent: true, svg: trailerRear(TX, TY, TS, t) },
          { depth: 0.84, accent: true, svg: tt => tt < ar + 0.4 ? chain(tt + 0.4) : cbox(B[0], B[1], 0.8, 0, 0.7) + cbox(Cc[0], Cc[1], 0.8, 0, 0.7) },
          { depth: 0.9, svg: tt => sweep(tt, seg(tt, 0.3, 1.8)) }
        ],
        overlays: [
          { type: 'label', at: Math.max(l2 + 0.2, 3.1), x: 60, y: 1180, text: 'MEMPHIS · SEPT 15, 2026', fs: 38, sub: 'Task force value · affidavit: ~$110K' }
        ],
        tag: LIKE
      });
    },

    // 2 - ITEM 1, the irony: the same lot, wide; the semi in profile; a patrol car rolls in from the left with its light
    //     bar on and stops on 'warrant'; an officer steps towards the driver's silhouette by the cab
    ch68_warrant(ctx) {
      const t = ctx.t, T = ctx.T, wr = WT(ctx, 0, 7, 1.5), l2 = LS(ctx, 1, 2.2), dv = WT(ctx, 1, 4, 2.6);
      const carX = tt => lerp(-700, 150, ease.out(seg(tt, -0.2, wr + 0.1)));
      return E.cine.shot(ctx, {
        set: 'ch68_lot', grade: 'night', haze: 0.4,
        cam: { from: { x: -10, y: 60, z: 1.0 }, to: { x: 10, y: 70, z: 1.06 } },
        figures: [
          { id: 'ch68_driver', x: 920, y: 1520, scale: 0.48, dir: -1, turn: 0.35, pose: 'stand', silhouette: 'cool', depth: 0.92,
            keys: [{ at: wr, pose: 'stand_tense', headTurn: -0.4, dur: 0.4 }, { at: dv, pose: 'hands_behind', dur: 0.5 }] },
          { id: 'ch68_officer', x: 380, y: 1720, scale: 0.68, dir: 1, turn: 0.35, pose: 'walk', expr: 'stern', depth: 1.0,
            keys: [{ at: 0, x: 280, pose: 'walk', dur: 0.01 }, { at: wr + 0.4, x: 520, pose: 'walk', dur: 1.2 }, { at: l2 + 0.5, pose: 'point', expr: 'stern', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.8, accent: true, svg: semi(520, 1470, 0.62, t, { lights: true }) + cbox(250, 1440, 0.5, 0, 0.4) + cbox(330, 1446, 0.5, 4, 0.4) + cbox(290, 1390, 0.5, -3, 0.4) },
          { depth: 0.98, svg: tt => patrolCar(carX(tt), 1880, 0.7, tt, { lights: true, headlights: true }) },
          { depth: 0.99, svg: tt => sweep(tt, 1, carX(tt) - 40, 1500) }
        ],
        overlays: [
          { type: 'label', at: l2 + 0.3, x: 60, y: 780, text: 'ACCUSED, NOT CONVICTED', fs: 38, sub: "The driver's account, per police" }
        ],
        tag: LIKE
      });
    },

    // 3 - ITEM 2: a farm loading dock at night; two silhouettes wheel a pallet of egg trays away from the trailer, left to
    //     right, on 'stole'; the place label
    ch68_eggs(ctx) {
      const t = ctx.t, T = ctx.T, st = WT(ctx, 0, 5, 1.6), eg = WT(ctx, 0, 4, 1.4);
      const PX = tt => lerp(260, 820, ease.inOut(seg(tt, st - 0.3, T + 0.5)));
      return E.cine.shot(ctx, {
        set: 'ch68_farm', grade: 'night', haze: 0.4,
        cam: { from: { x: -20, y: 40, z: 1.0 }, to: { x: 20, y: 50, z: 1.07 } },
        figures: [
          { id: 'ch68_crew2', x: 120, y: 1700, scale: 0.66, dir: 1, turn: 0.35, pose: 'stand', silhouette: 'cool', depth: 0.98,
            keys: [{ at: st - 0.3, pose: 'hands_together', dur: 0.3 }, { at: st, x: 120, pose: 'walk', dur: 0.01 }, { at: T, x: 640, pose: 'walk', dur: T - st }] },
          { id: 'ch68_crew3', x: 560, y: 1640, scale: 0.6, dir: 1, turn: 0.35, pose: 'stand', silhouette: 'cool', depth: 0.95,
            keys: [{ at: 0.4, pose: 'point', headTurn: 0.3, dur: 0.4 }, { at: st, pose: 'walk', dur: 0.01 }, { at: T, x: 1020, pose: 'walk', dur: T - st }] }
        ],
        props: [
          { depth: 0.97, svg: tt => eggPallet(PX(tt), 1700, 1.2) + jack(PX(tt) - 190, 1700, 1.2) }
        ],
        overlays: [
          { type: 'label', at: eg + 0.1, x: 60, y: 1180, text: 'GREENCASTLE, PA · FEB 2025', fs: 38, sub: 'Egg shortage · ~$40K · no arrests' }
        ],
        tag: TAG
      });
    },

    // 4 - the LESSON (save trigger, for the viewer): a quiet street at dusk; a seller at the open back of a plain van holds
    //     out a box; the young man folds his arms; the checklist card with the SAVE ribbon (captions off)
    ch68_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 6, 1.4);
      return E.cine.shot(ctx, {
        set: 'ch68_street', grade: 'warm', haze: 0.45, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'ch68_seller', x: 360, y: 1700, scale: 0.8, dir: 1, turn: 0.35, pose: 'present', expr: 'neutral', depth: 0.96, hat: { style: 'cap', color: '#3a3430' },
            keys: [{ at: 0.6, pose: 'hands_together', dur: 0.4 }, { at: sv, pose: 'present', dur: 0.5 }] },
          { id: 'ch68_viewer', x: 830, y: 1800, scale: 1.0, dir: -1, turn: 0.35, pose: 'stand', expr: 'focused', depth: 1.0,
            keys: [{ at: 0.8, pose: 'arms_crossed', expr: 'stern', dur: 0.5 }, { at: sv + 0.6, pose: 'hand_to_face', expr: 'focused', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.9, svg: van(160, 1560, 0.78) },
          { depth: 0.97, accent: true, svg: tt => cbox(470, 1340 + 4 * Math.sin(tt * 2), 0.6, 0, 0.4) }
        ],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 470, rows: [{ text: 'NO USDA INSPECTION MARK', fs: 42 }, { text: 'NOT KEPT COLD? WALK AWAY', fs: 42 }, { text: 'NO RECEIPT? NO DEAL', fs: 42 }, { text: 'USDA FSIS · Arkansas AG · Arizona Agriculture', fs: 24, colour: '#c4baa6' }] }
        ],
        tag: TAG
      });
    },

    // 5 - ITEM 3 = THE BIGGEST REVEAL: a motorway at night; a plain semi rolls in from the left on 'truck' (the single
    //     impact) and on into the fog on the right; the route label
    ch68_kitkat(ctx) {
      const t = ctx.t, T = ctx.T, tk = WT(ctx, 0, 6, 1.4), l2 = LS(ctx, 1, 2.6), gn = WT(ctx, 1, 3, 3.0);
      const X = tt => tt < tk ? lerp(-700, 420, ease.out(seg(tt, tk - 1.1, tk))) : lerp(420, 1250, ease.in(seg(tt, tk, T + 0.3)));
      const fade = tt => 1 - 0.75 * seg(tt, gn, T);
      return E.cine.shot(ctx, {
        set: 'ch68_road', grade: 'night', haze: 0.5,
        cam: { from: { x: 0, y: 120, z: 1.12 }, to: { x: 20, y: 130, z: 1.2 }, settle: true },
        figures: [],
        props: [
          { depth: 0.88, svg: tt => `<g opacity="${f1(fade(tt))}">${semi(X(tt), 1370, 0.72, tt, { lights: true })}</g>` + wash(X(tt) + 560, 1170, 300, 80, '#fff6d0', f1(0.25 * fade(tt))) }
        ],
        overlays: [
          { type: 'impact', at: tk, x: 540, y: 1000 },
          { type: 'label', at: l2 + 0.2, x: 60, y: 780, text: 'CENTRAL ITALY TO POLAND', fs: 38, sub: 'March 2026 · Nestlé: still not found' }
        ],
        tag: 'ILLUSTRATION · GENERIC TRUCK'
      });
    },

    // 6 - the statistic: a depot's empty loading bay; a worker with a clipboard looks at the painted, empty bay; the
    //     413,793 counter
    ch68_bars(ctx) {
      const t = ctx.t, T = ctx.T, n = WT(ctx, 0, 2, 0.6);
      return E.cine.shot(ctx, {
        set: 'ch68_depot', grade: 'cold', haze: 0.35,
        cam: { from: { x: 10, y: 30, z: 1.0 }, to: { x: -10, y: 40, z: 1.06 } },
        figures: [
          { id: 'ch68_worker', x: 820, y: 1560, scale: 0.66, dir: -1, turn: 0.4, pose: 'read', expr: 'focused', depth: 1.0,
            keys: [{ at: n, pose: 'read', expr: 'realise', headTurn: -0.3, dur: 0.5 }, { at: n + 1.4, pose: 'hand_to_face', expr: 'shocked', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.06, accent: true, svg: bar(330, 1580, 0.9, -6, true) }
        ],
        overlays: [
          { type: 'counter', at: n - 0.1, dur: 1.5, from: 0, to: 413793, prefix: '', suffix: '', label: 'KITKAT BARS STOLEN', y: 660, fs: 140 }
        ],
        tag: TAG
      });
    },

    // 7 - the spoken share line with the FUN FACT: close on the depot table; the worker's hand holds a phone over a bar and
    //     scans its batch code; the tick lands on 'wings'
    ch68_share(ctx) {
      const t = ctx.t, T = ctx.T, wg = WT(ctx, 0, 8, 2.0);
      return E.cine.shot(ctx, {
        set: 'ch68_depot', grade: 'cold', haze: 0.3, dof: true,
        cam: { from: { x: 0, y: 330, z: 1.32 }, to: { x: 10, y: 340, z: 1.38 } },
        figures: [
          { id: 'ch68_worker', x: 900, y: 1900, scale: 0.9, dir: -1, turn: 0.4, pose: 'examine', expr: 'focused', depth: 1.0,
            keys: [{ at: wg, pose: 'present', expr: 'realise', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.06, accent: true, svg: tt => bar(440, 1590, 1.2, -4, true) + bar(300, 1540, 1.0, 8, false) + scanPhone(690, 1180, 1.0, tt, seg(tt, wg, wg + 0.3)) }
        ],
        overlays: [
          { type: 'funfact', at: 0.25, y: 640, rows: [{ text: 'EVERY BAR HAS A BATCH CODE' }, { text: 'SCAN IT TO CHECK IF STOLEN' }, { text: 'Nestlé, via Swissinfo and Gulf News', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 8 - the punchline back at the hero trailer in frame 1's framing (the loop): the silhouettes stand where they stood,
    //     hands behind their backs, an officer with a torch by the doors; the camera pulls back to frame 1's start; in the
    //     last ~0.7 s the chain starts again (the loop)
    ch68_end(ctx) {
      const t = ctx.t, T = ctx.T, ar = WT(ctx, 0, 3, 0.9), l2 = LS(ctx, 1, 2.0);
      const t0 = T - 0.7;
      return E.cine.shot(ctx, {
        set: 'ch68_lot', grade: 'night', haze: 0.35,
        cam: { from: { x: 20, y: 40, z: 1.1 }, to: HERO_CAM0, settle: true },
        figures: heroCrew(
          [{ at: 0, pose: 'hands_behind', dur: 0.01 }, { at: t0, pose: 'present', dur: 0.3 }],
          [{ at: 0, pose: 'hands_behind', dur: 0.01 }, { at: t0 + 0.1, pose: 'hands_together', dur: 0.3 }],
          [{ at: 0, pose: 'hands_behind', dur: 0.01 }, { at: t0 + 0.15, pose: 'hands_together', dur: 0.3 }]
        ).concat([
          { id: 'ch68_officer2', x: 980, y: 1800, scale: 0.66, dir: -1, turn: 0.35, pose: 'torch', expr: 'stern', depth: 0.95, propOpts: { aim: 200, beamLen: 600 },
            keys: [{ at: ar, pose: 'torch_low', dur: 0.5 }, { at: l2 + 0.6, x: 1260, pose: 'walk', dur: 0.9 }] }
        ]),
        props: [
          { depth: 0.75, accent: true, svg: trailerRear(TX, TY, TS, t) },
          { depth: 0.84, accent: true, svg: tt => tt < t0 ? cbox(B[0], B[1] + 260, 0.62, 0, 0.5) + cbox(B[0] + 110, B[1] + 266, 0.62, 3, 0.5) + cbox(B[0] + 50, B[1] + 206, 0.62, -2, 0.5) : chain(tt - t0 + 0.4 - (T - t0)) },
          { depth: 0.9, svg: tt => sweep(tt, 1 - seg(tt, T - 0.8, T)) }
        ],
        overlays: [
          { type: 'label', at: 0.15, x: 60, y: 1200, text: 'AS OF OCT 2026', fs: 38, sub: 'Charged, not convicted · no trial yet', until: T - 0.7 }
        ],
        tag: LIKE
      });
    }
  });
})();
