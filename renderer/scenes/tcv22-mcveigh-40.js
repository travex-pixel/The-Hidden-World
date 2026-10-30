/* Case File 22 (cinematic, 40-second "Caught by..." cut): the Oklahoma City bombing (19 April 1995) and Timothy McVeigh.
   CLOSED: convicted 2 June 1997 (all 11 counts), executed 11 June 2001; Terry Nichols was also convicted.
   Structure (short40): a burned-in hook headline over the HERO OBJECT, the rear of a generic 1970s yellow sedan with an
   EMPTY license-plate bracket, big and centred in the first frame and again in the last (the video loops); fast clue beats
   (the stop, the jail, the axle, the rental shop, the sketch); the HOW (he was already in jail, about to be released) at
   about 60%; the outcome in one line; a callback on the hero object and one memorial line.
   Content rules:
   - 168 people were killed, including 19 children. The explosion, the damaged building, the victims, rescue scenes and
     injuries are never depicted, and no famous photograph is recreated. The toll is a typed card in a quiet room.
   - McVeigh appears ONLY as an anonymous rim-lit silhouette (characters/figures/mc22_driver.json) or a dark head shape
     through a car's rear window: no face, no likeness, never his booking photo, never posed heroically. None of his words
     or beliefs are quoted. Every shot he is in is tagged 'ILLUSTRATION · NOT A LIKENESS'.
   - The trooper is a generic figure (mc22_trooper) and is not named. No weapon is drawn anywhere.
   - No brand or real material: the rental counter and the box trucks carry no name, colours or logo; the axle's number is
     never shown (masked blocks); the composite sketch is never shown; the jail, highway, lab and court are generic; every
     card is the series' own typed graphic.
   New environments (E.registerSets): mc22_highway (an Oklahoma interstate on a spring morning; 'rear' and 'side' views),
   mc22_jail (a small county jail: booking counter or cell row), mc22_rental (a small-town truck-rental counter in Kansas).
   Timing: actions are keyed to the narrator's word timings (WT), so they land on the spoken word. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const TYPE = "font-family=\"Courier Prime\"";
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · ANONYMOUS FIGURES';
  const LIKENESS = 'ILLUSTRATION · NOT A LIKENESS';
  const ROAD = 'ILLUSTRATION · GENERIC CAR AND ROAD';
  const YEL = '#ffd23f';
  const CAR = { body: '#e5c55a', shade: '#b8953a', dark: '#7e6224', light: '#f6e3a0', rust: '#8a4a22' };
  const typing = (from, to, a = 'sit_type', b = 'sit_type_b', step = 0.24) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? b : a, dur: step * 0.8 }); return k; };
  const panel = (x, y, w, h, op = 0.6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#000" opacity="${op}"/>`;

  // ---------- THE HERO: the rear of a generic 1970s full-size sedan, pale yellow and rusting, with an EMPTY plate bracket.
  // Bottom centre (x, y) on the ground; ~950 x 750 at s = 1. o.glow 0..1 lights the empty bracket; o.brake = brake lights;
  // o.exhaust = the engine idles (puffs); o.driver = a dark, anonymous head shape seen through the rear window.
  function carRear(x, y, s, t, o = {}) {
    const C = CAR;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="8" rx="520" ry="44" fill="#000" opacity="0.42"/>`;
    if (o.exhaust) for (let i = 0; i < 4; i++) { const u = ((t * 0.55 + i * 0.25) % 1); g += `<circle cx="${f1(-300 - 160 * u)}" cy="${f1(-130 - 60 * u)}" r="${f1(14 + 46 * u)}" fill="#e8ecef" opacity="${f1(0.28 * (1 - u))}"/>`; }
    // tyres and the dark underbody
    g += `<rect x="-420" y="-160" width="840" height="50" fill="#0e0d0c"/>`;
    [-1, 1].forEach(d => { const x0 = d < 0 ? -428 : 322; g += `<rect x="${x0}" y="-158" width="106" height="158" rx="22" fill="#0c0c0e" stroke="${INK}" stroke-width="6"/>` + [-118, -78, -38].map(yy => `<path d="M${x0 + 14} ${yy} L${x0 + 92} ${yy}" stroke="#2a2a2e" stroke-width="7"/>`).join(''); });
    // body: rear panel, trunk deck, the greenhouse (C-pillars), the rear window, a cream vinyl roof
    g += `<path d="M-446 -150 L-454 -300 Q-454 -470 -430 -480 L430 -480 Q454 -470 454 -300 L446 -150 Z" fill="${C.body}" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M-446 -150 L-454 -300 Q-454 -470 -430 -480 L-392 -480 Q-420 -440 -420 -300 L-414 -150 Z" fill="${C.shade}" opacity="0.7"/><path d="M446 -150 L454 -300 Q454 -470 430 -480 L404 -480 Q426 -440 426 -300 L420 -150 Z" fill="${C.light}" opacity="0.5"/>`;
    g += `<path d="M-430 -480 L430 -480 L392 -528 L-392 -528 Z" fill="${C.light}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-392 -528 L392 -528 L300 -718 Q0 -730 -300 -718 Z" fill="${C.body}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-338 -536 L338 -536 L262 -702 Q0 -712 -262 -702 Z" fill="#18212d" stroke="${INK}" stroke-width="5"/>`;
    if (o.driver) g += `<path d="M-236 -536 Q-150 -590 -64 -536 Z" fill="#06080b"/><ellipse cx="-150" cy="-604" rx="38" ry="46" fill="#06080b"/><rect x="104" y="-610" width="88" height="70" rx="22" fill="#2a3240" opacity="0.8"/>`;
    g += `<path d="M-210 -536 L-130 -536 L-46 -704 L-104 -704 Z" fill="#d6e8f8" opacity="0.13"/><path d="M60 -536 L96 -536 L170 -705 L148 -705 Z" fill="#d6e8f8" opacity="0.1"/>`;
    g += `<path d="M-300 -718 Q0 -730 300 -718 L282 -746 Q0 -758 -282 -746 Z" fill="#d8caa2" stroke="${INK}" stroke-width="5"/>`;
    // wide horizontal tail-light bars with chrome surrounds
    const lamp = o.brake ? '#ff3a2a' : '#b8261f';
    [-1, 1].forEach(d => {
      const x0 = d < 0 ? -434 : 138;
      g += `<rect x="${x0}" y="-448" width="296" height="88" rx="8" fill="${lamp}" stroke="#d7dde2" stroke-width="7"/>`;
      g += [1, 2, 3].map(i => `<path d="M${x0 + i * 74} -446 L${x0 + i * 74} -362" stroke="#e2e6ea" stroke-width="4" opacity="0.8"/>`).join('');
      g += `<rect x="${d < 0 ? x0 + 240 : x0 + 8}" y="-440" width="48" height="72" rx="4" fill="#f4efe4" opacity="0.85"/><rect x="${x0 + 6}" y="-442" width="${296 - 12}" height="12" fill="#fff" opacity="0.22"/>`;
      if (o.brake) g += wash(x0 + 148, -404, 210, 90, '#ff4a2a', 0.45);
    });
    // THE EMPTY PLATE BRACKET: a bare recess, four bolt holes, rust streaks, a plate lamp with nothing to light
    const k = o.glow || 0;
    g += `<rect x="-62" y="-462" width="124" height="14" rx="4" fill="#d7dde2" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-466" r="9" fill="#d7dde2" stroke="${INK}" stroke-width="3"/>`;
    g += `<rect x="-122" y="-444" width="244" height="122" rx="7" fill="#4e4020" stroke="#2c230f" stroke-width="6"/><rect x="-114" y="-436" width="228" height="16" fill="#000" opacity="0.35"/><rect x="-114" y="-436" width="10" height="106" fill="#000" opacity="0.25"/>`;
    g += `<rect x="-104" y="-428" width="208" height="96" rx="4" fill="none" stroke="#9aa2a8" stroke-width="4" opacity="0.65"/>`;
    [[-80, -412], [80, -412], [-80, -350], [80, -350]].forEach(([a, b]) => { g += `<circle cx="${a}" cy="${b}" r="9" fill="#120e06" stroke="#9aa2a8" stroke-width="3"/><path d="M${a} ${b + 9} q 3 18 -2 34" stroke="${C.rust}" stroke-width="5" fill="none" opacity="0.6"/>`; });
    if (k > 0) g += `<rect x="-134" y="-456" width="268" height="146" rx="12" fill="none" stroke="${YEL}" stroke-width="9" opacity="${f1(k * (0.75 + 0.25 * Math.sin(t * 7)))}"/>` + wash(0, -383, 220, 110, '#fff1b0', f1(0.3 * k));
    // chrome bumper with rubber strip and guards, valance, exhaust pipe
    g += `<path d="M-472 -194 L472 -194 Q486 -230 472 -268 L-472 -268 Q-486 -230 -472 -194 Z" fill="#c9d0d6" stroke="${INK}" stroke-width="6"/><path d="M-466 -256 L466 -256" stroke="#fff" stroke-width="5" opacity="0.7"/><path d="M-466 -206 L466 -206" stroke="#7d868e" stroke-width="6"/>`;
    g += `<rect x="-470" y="-238" width="940" height="10" fill="#1a1a1c"/>` + [-1, 1].map(d => `<rect x="${d * 222 - 22}" y="-272" width="44" height="84" rx="10" fill="#1a1a1c" stroke="${INK}" stroke-width="4"/>`).join('');
    g += `<rect x="-440" y="-194" width="880" height="42" fill="${C.shade}" stroke="${INK}" stroke-width="5"/><ellipse cx="-300" cy="-146" rx="20" ry="11" fill="#1c1c1e" stroke="${INK}" stroke-width="3"/>`;
    // rust: it was described as a rusting yellow car
    [[-404, -176, 26, 9], [-364, -184, 14, 6], [396, -172, 22, 8], [-418, -330, 9, 22], [420, -300, 8, 18], [-200, -486, 30, 5]].forEach(([a, b, rx, ry]) => { g += `<ellipse cx="${a}" cy="${b}" rx="${rx}" ry="${ry}" fill="${C.rust}" opacity="0.7"/>`; });
    g += `<path d="M-454 -320 L454 -320" stroke="${C.dark}" stroke-width="3" opacity="0.5"/>`;
    return g + '</g>';
  }
  // a generic 1970s full-size sedan in profile (front to the right; o.flip = -1 faces left); bottom centre (x, y); ~1010 long at k = 1
  function carSide(x, y, k, t, o = {}) {
    const C = CAR, fl = o.flip || 1;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k * fl)} ${sc(k)})"><ellipse cx="0" cy="6" rx="520" ry="26" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-500 -46 L-506 -112 Q-504 -128 -486 -132 L-300 -142 L-250 -150 L-160 -238 Q-150 -246 -128 -246 L110 -246 Q128 -246 138 -238 L222 -150 L470 -138 Q500 -134 506 -112 L506 -46 Z" fill="${C.body}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-500 -46 L-504 -96 L506 -96 L506 -46 Z" fill="${C.shade}" opacity="0.8"/><path d="M-496 -100 L502 -100" stroke="#d7dde2" stroke-width="5"/>`;
    g += `<path d="M-160 -238 Q-150 -246 -128 -246 L110 -246 Q128 -246 138 -238 L132 -230 L-150 -230 Z" fill="#d8caa2" stroke="${INK}" stroke-width="3"/>`;
    g += `<path d="M-146 -228 L-36 -228 L-36 -158 L-214 -158 Z M-24 -228 L112 -228 L196 -158 L-24 -158 Z" fill="#18212d"/><path d="M-246 -150 L-160 -236" stroke="#18212d" stroke-width="9"/>`;
    if (o.driver) g += `<ellipse cx="54" cy="-196" rx="24" ry="28" fill="#06080b"/>`;
    g += `<path d="M-10 -224 L60 -224 L20 -162 L-10 -162 Z" fill="#d6e8f8" opacity="0.12"/>`;
    g += `<rect x="-516" y="-80" width="34" height="36" rx="6" fill="#c9d0d6" stroke="${INK}" stroke-width="4"/><rect x="488" y="-82" width="32" height="38" rx="6" fill="#c9d0d6" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-508" y="-128" width="14" height="30" fill="${o.brake ? '#ff3a2a' : '#b8261f'}"/><rect x="496" y="-128" width="12" height="24" fill="#fff6d0"/>`;
    if (o.brake) g += wash(-520, -112, 50, 30, '#ff4a2a', 0.5);
    [-310, 322].forEach(cx => { g += `<path d="M${cx - 74} -46 A74 74 0 0 1 ${cx + 74} -46 Z" fill="#141210"/><circle cx="${cx}" cy="-2" r="56" fill="#0b0b0d" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-2" r="28" fill="#c9d0d6" stroke="${INK}" stroke-width="4"/><path d="M${cx - 18} -2 L${cx + 18} -2 M${cx} -20 L${cx} 16" stroke="#7d868e" stroke-width="4" transform="rotate(${f1((o.roll || 0) * 57)} ${cx} -2)"/>`; });
    [[-420, -70, 24, 9], [210, -60, 18, 7], [-250, -120, 12, 5]].forEach(([a, b, rx, ry]) => { g += `<ellipse cx="${a}" cy="${b}" rx="${rx}" ry="${ry}" fill="${C.rust}" opacity="0.7"/>`; });
    return g + '</g>';
  }
  // a generic 1990s patrol sedan in profile (front to the right): plain white body, dark stripe, flashing light bar. No text, no crest.
  function patrolCar(x, y, k, t, o = {}) {
    const on = o.lights !== false, ph = (t * 2.4) % 1, red = ph < 0.5;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><ellipse cx="0" cy="6" rx="470" ry="24" fill="#000" opacity="0.4"/>`;
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
  // a small generic car for passing traffic (side view, front to the right; flip -1 = left); bottom centre (x, y)
  const traffic = (x, y, k, col, fl = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k * fl)} ${sc(k)})"><path d="M-200 -16 L-200 -56 Q-190 -74 -150 -78 L-96 -82 L-56 -124 Q-36 -134 40 -134 L94 -130 Q136 -116 160 -80 L198 -70 L202 -16 Z" fill="${col}" stroke="#000" stroke-width="5"/>` +
    `<path d="M-46 -120 L-84 -84 L36 -84 L36 -126 Z M48 -126 L48 -84 L140 -84 Q126 -112 100 -122 Z" fill="#141a24"/><circle cx="-118" cy="-12" r="32" fill="#0a0a0c"/><circle cx="126" cy="-12" r="32" fill="#0a0a0c"/></g>`;
  // a small generic car seen from behind (for traffic receding up the road in the rear view); bottom centre (x, y)
  const trafficRear = (x, y, k, col) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><ellipse cx="0" cy="4" rx="230" ry="18" fill="#000" opacity="0.35"/>` +
    `<rect x="-200" y="-150" width="400" height="120" rx="18" fill="${col}" stroke="#000" stroke-width="6"/><path d="M-160 -150 L-120 -250 L120 -250 L160 -150 Z" fill="${col}" stroke="#000" stroke-width="6"/>` +
    `<path d="M-130 -158 L-100 -236 L100 -236 L130 -158 Z" fill="#141a24"/><rect x="-186" y="-122" width="90" height="30" rx="5" fill="#c8312b"/><rect x="96" y="-122" width="90" height="30" rx="5" fill="#c8312b"/>` +
    `<rect x="-210" y="-58" width="420" height="30" rx="8" fill="#9aa0a6" stroke="#000" stroke-width="4"/><rect x="-190" y="-30" width="70" height="34" rx="8" fill="#0a0a0c"/><rect x="120" y="-30" width="70" height="34" rx="8" fill="#0a0a0c"/></g>`;
  // the rental truck's rear axle housing (generic drawing): a long tube, a central differential, flanged ends, grime;
  // a stamped area whose characters are MASKED (never a real number). Centre (x, y) on the bench; ~900 long at s = 1.
  function axle(x, y, s, t, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="14" rx="470" ry="26" fill="#000" opacity="0.35"/>`;
    g += `<path d="M-430 -48 L430 -48 L430 -6 L-430 -6 Z" fill="#4a4844" stroke="${INK}" stroke-width="6"/><path d="M-430 -40 L430 -40" stroke="#8a8780" stroke-width="5" opacity="0.6"/>`;
    [-1, 1].forEach(d => { g += `<ellipse cx="${d * 440}" cy="-27" rx="18" ry="72" fill="#3a3834" stroke="${INK}" stroke-width="6"/><rect x="${d > 0 ? 448 : -476}" y="-46" width="28" height="38" rx="5" fill="#2e2c28" stroke="${INK}" stroke-width="4"/>`; });
    g += `<circle cx="0" cy="-30" r="118" fill="#3e3c38" stroke="${INK}" stroke-width="7"/><circle cx="0" cy="-30" r="86" fill="#55524c" stroke="${INK}" stroke-width="5"/>`;
    for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; g += `<circle cx="${f1(Math.cos(a) * 100)}" cy="${f1(-30 + Math.sin(a) * 100)}" r="7" fill="#2a2824" stroke="${INK}" stroke-width="2"/>`; }
    g += `<path d="M-70 -80 Q-20 -104 40 -96" stroke="#9a968e" stroke-width="6" fill="none" opacity="0.5"/>`;
    [[-300, -30, 50, 14], [260, -20, 70, 12], [-120, -12, 30, 8]].forEach(([a, b, rx, ry]) => { g += `<ellipse cx="${a}" cy="${b}" rx="${rx}" ry="${ry}" fill="#1c1a16" opacity="0.6"/>`; });
    // the stamped area (characters masked)
    const k = o.glow || 0;
    g += `<rect x="168" y="-46" width="200" height="38" rx="4" fill="#5e5a52" stroke="${INK}" stroke-width="3"/>`;
    for (let i = 0; i < 9; i++) g += `<rect x="${178 + i * 20}" y="-38" width="13" height="22" rx="2" fill="${k > 0.5 ? '#1a1814' : '#3a3730'}"/>`;
    if (k > 0) g += `<rect x="158" y="-56" width="220" height="58" rx="8" fill="none" stroke="${YEL}" stroke-width="7" opacity="${f1(k * (0.75 + 0.25 * Math.sin(t * 7)))}"/>`;
    // a plain evidence tag on a string (illegible lines; our own design)
    g += `<g transform="translate(-250 -36) rotate(-8)"><path d="M70 0 L30 -6" stroke="#d9cfb6" stroke-width="3"/><rect x="-50" y="-30" width="80" height="54" rx="6" fill="#d9c79a" stroke="${INK}" stroke-width="3"/><circle cx="20" cy="-18" r="5" fill="#8a7a5a"/>${[0, 1].map(i => `<rect x="-40" y="${-10 + i * 16}" width="${50 - i * 12}" height="6" fill="#8b857a"/>`).join('')}</g>`;
    return g + '</g>';
  }
  // a desk phone (beige, 1990s); o.ring 0..1 shakes it and draws ring lines
  function phone(x, y, s, t, ring) {
    const j = ring > 0 ? Math.sin(t * 60) * 3 * ring : 0;
    let g = `<g transform="translate(${f1(x + j)} ${f1(y)}) scale(${sc(s)})"><path d="M-70 0 L-58 -50 L58 -50 L70 0 Z" fill="#d9cfb6" stroke="${INK}" stroke-width="5"/><rect x="-80" y="-76" width="160" height="30" rx="14" fill="#cfc4aa" stroke="${INK}" stroke-width="5"/>` +
      [0, 1, 2].map(r_ => [0, 1, 2].map(c => `<rect x="${-30 + c * 22}" y="${-40 + r_ * 12}" width="14" height="8" rx="2" fill="#8b857a"/>`).join('')).join('');
    if (ring > 0) g += [1, 2].map(i => `<path d="M${-100 - i * 22} ${-70 - i * 10} q -14 26 0 52 M${100 + i * 22} ${-70 - i * 10} q 14 26 0 52" stroke="${YEL}" stroke-width="5" fill="none" opacity="${f1(ring * (0.5 + 0.5 * Math.sin(t * 18 + i)))}"/>`).join('');
    return g + '</g>';
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // an Oklahoma interstate on a spring morning: big sky, flat green-gold farmland, tree lines, a distant generic grain
    // elevator, power poles. o.view 'rear': the road in perspective, a shoulder on the right where the hero car stands
    // (camera = the patrol car behind it) and traffic receding; o.view 'side': cars park on the near shoulder, traffic
    // passes behind them in the near lanes, the far carriageway beyond the median.
    mc22_highway(ctx, o = {}) {
      const t = ctx.t, r = R(221), side = o.view === 'side', HZ = side ? 905 : 880;
      let sky = `<defs><linearGradient id="mchsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fa6d8"/><stop offset="0.6" stop-color="#b9d6ea"/><stop offset="1" stop-color="#f1e8cf"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#mchsky)"/>` + wash(900, 300, 360, 260, '#fff4d0', 0.55) + `<circle cx="900" cy="300" r="56" fill="#fff8e2" opacity="0.9"/>`;
      [[-200, 200, 320, 50], [260, 330, 260, 38], [620, 150, 300, 44], [-60, 520, 240, 30], [760, 560, 280, 34]].forEach(([x, y, w, h], i) => {
        const dx = ((t * (8 + i * 2) + x + 300) % 1700) - 300;
        sky += `<g opacity="0.85"><ellipse cx="${f1(dx)}" cy="${y}" rx="${w}" ry="${h}" fill="#ffffff" opacity="0.7"/><ellipse cx="${f1(dx + w * 0.3)}" cy="${y - h * 0.6}" rx="${f1(w * 0.55)}" ry="${f1(h * 0.9)}" fill="#ffffff" opacity="0.75"/><ellipse cx="${f1(dx - w * 0.35)}" cy="${y - h * 0.3}" rx="${f1(w * 0.4)}" ry="${f1(h * 0.7)}" fill="#ffffff" opacity="0.7"/></g>`;
      });
      // far: tree lines, a generic grain elevator (no lettering), power poles
      let far = `<rect x="-300" y="${HZ - 6}" width="${W + 600}" height="70" fill="#8aa05a"/>`;
      for (let i = 0; i < 46; i++) { const x = -280 + i * 38 + r() * 20, hgt = 14 + r() * 26; far += `<ellipse cx="${f1(x)}" cy="${f1(HZ - hgt * 0.4)}" rx="${f1(18 + r() * 16)}" ry="${f1(hgt)}" fill="${i % 3 ? '#3e5a34' : '#4a6a3c'}"/>`; }
      far += `<g transform="translate(150 ${HZ})"><rect x="0" y="-150" width="60" height="150" fill="#b8b4a8"/><rect x="60" y="-110" width="44" height="110" fill="#a8a498"/><rect x="-26" y="-96" width="26" height="96" fill="#c4c0b4"/><rect x="10" y="-176" width="30" height="28" fill="#a8a498"/><path d="M0 -150 L60 -150" stroke="#8a867a" stroke-width="4"/></g>`;
      for (let i = 0; i < 9; i++) { const x = -200 + i * 190, h = 120; far += `<path d="M${x} ${HZ + 10} L${x} ${HZ + 10 - h} M${x - 16} ${HZ + 18 - h} L${x + 16} ${HZ + 18 - h}" stroke="#4a4438" stroke-width="4"/>`; if (i < 8) far += `<path d="M${x + 16} ${HZ + 18 - h} Q ${x + 95} ${HZ + 40 - h} ${x + 174} ${HZ + 18 - h}" stroke="#4a4438" stroke-width="1.5" fill="none"/>`; }
      if (side) {
        // far carriageway, median, near lanes with traffic passing behind our parked cars, shoulder, grass
        let mid = `<rect x="-300" y="${HZ + 50}" width="${W + 600}" height="40" fill="#6e6c66"/><path d="M-300 ${HZ + 70} L${W + 300} ${HZ + 70}" stroke="#e8e2c8" stroke-width="3" stroke-dasharray="40 40" opacity="0.7"/>`;
        for (let i = 0; i < 2; i++) { const u = ((t * 0.16 + i * 0.5) % 1); mid += traffic(1400 - u * 1800, HZ + 86, 0.26, i ? '#8e2a2a' : '#d9dde2', -1); }
        mid += `<rect x="-300" y="${HZ + 90}" width="${W + 600}" height="62" fill="#7e9a4c"/>`;
        let lanes = `<rect x="-300" y="${HZ + 150}" width="${W + 600}" height="128" fill="#5e5c58"/><path d="M-300 ${HZ + 214} L${W + 300} ${HZ + 214}" stroke="#f2ecd0" stroke-width="5" stroke-dasharray="70 70"/><path d="M-300 ${HZ + 154} L${W + 300} ${HZ + 154}" stroke="#e8c45a" stroke-width="5"/>`;
        for (let i = 0; i < 2; i++) { const u = ((t * 0.28 + i * 0.55) % 1); lanes += traffic(-400 + u * 2000, HZ + 206 + i * 54, 0.42 + i * 0.06, i ? '#3a4a6a' : '#5a3a3a', 1); }
        let near = `<rect x="-300" y="${HZ + 276}" width="${W + 600}" height="92" fill="#86847e"/><path d="M-300 ${HZ + 280} L${W + 300} ${HZ + 280}" stroke="#f4f0e4" stroke-width="7"/>`;
        near += `<path d="M-300 ${HZ + 368} Q 540 ${HZ + 356} ${W + 300} ${HZ + 370} L${W + 300} ${H + 300} L-300 ${H + 300} Z" fill="#6f8f3e"/>`;
        for (let i = 0; i < 70; i++) { const x = -260 + r() * 1600, y = HZ + 390 + r() * 600; near += `<path d="M${f1(x)} ${f1(y)} l -6 -26 M${f1(x)} ${f1(y)} l 6 -24" stroke="#4e6e2a" stroke-width="4"/>`; if (i % 4 === 0) near += `<circle cx="${f1(x)}" cy="${f1(y - 26)}" r="6" fill="${i % 8 ? '#f2d24a' : '#c86ab0'}"/>`; }
        let fg = ''; for (let i = 0; i < 9; i++) { const x = -150 + i * 160, y = 1900; fg += `<path d="M${x} ${y} q -20 -150 -50 -220 M${x} ${y} q 10 -170 30 -240 M${x} ${y} q 30 -120 80 -170" stroke="#3e5a24" stroke-width="10" fill="none" stroke-linecap="round"/>`; }
        return { light: { dir: 1, rim: '#fff0c8', key: '#fff4dc' }, layers: [[0.05, sky], [0.12, far], [0.3, mid], [0.6, lanes], [1.0, near], [1.32, fg]] };
      }
      // rear view: the road in perspective (vanishing at VX, HZ) - travel lanes on the left, the shoulder on the right
      const VX = 600, VY = HZ + 6, BY = H + 300;
      const at = (xb, y) => VX + (xb - VX) * (y - VY) / (BY - VY);
      let road = `<path d="M-300 ${VY} L${W + 300} ${VY} L${W + 300} ${BY} L-300 ${BY} Z" fill="#7a9846"/>`;
      road += `<path d="M${VX - 40} ${VY} L-6000 ${BY} L-300 ${BY} L-300 ${VY} Z" fill="#6f8c40"/>`;
      road += `<path d="M${VX - 4} ${VY} L${VX + 8} ${VY} L2100 ${BY} L-5200 ${BY} Z" fill="#5e5c58"/>`;
      road += `<path d="M${VX + 4} ${VY} L-1340 ${BY}" stroke="#f4f0e4" stroke-width="10"/><path d="M${VX + 8} ${VY} L2100 ${BY}" stroke="#d8d2bc" stroke-width="6" opacity="0.6"/>`;
      road += `<path d="M${VX - 6} ${VY} L-5200 ${BY}" stroke="#e8c45a" stroke-width="8"/>`;
      for (let i = 0; i < 14; i++) { const a = Math.pow(i / 14, 2.2), b = Math.pow((i + 0.42) / 14, 2.2); const y1 = VY + a * (BY - VY), y2 = VY + b * (BY - VY); road += `<line x1="${f1(at(-3200, y1))}" y1="${f1(y1)}" x2="${f1(at(-3200, y2))}" y2="${f1(y2)}" stroke="#f2ecd0" stroke-width="${f1(2 + 30 * a)}"/>`; }
      road += `<path d="M${VX + 8} ${VY} L2100 ${BY} L${W + 300} ${BY} L${W + 300} ${VY} Z" fill="#7a9846"/>`;
      for (let i = 0; i < 10; i++) { const a = Math.pow((i + 0.6) / 10, 2), y = VY + a * 900, x = at(3200, y); road += `<path d="M${f1(x)} ${f1(y)} L${f1(x)} ${f1(y - 8 - 70 * a)}" stroke="#5a4a36" stroke-width="${f1(2 + 8 * a)}"/>`; if (i) { const ap = Math.pow((i - 0.4) / 10, 2), yp = VY + ap * 900; road += `<path d="M${f1(at(3200, yp))} ${f1(yp - 6 - 50 * ap)} L${f1(x)} ${f1(y - 6 - 50 * a)}" stroke="#5a4a36" stroke-width="1.5"/>`; } }
      for (let i = 0; i < 2; i++) { const u = ((t * 0.2 + i * 0.5) % 1), y = lerp(1320, VY + 6, Math.pow(u, 0.45)), k = 0.42 * (y - VY) / (1300 - VY); if (k > 0.02) road += trafficRear(at(i ? -4200 : -2300, y), y, k, i ? '#3a4a6a' : '#8e2a2a'); }
      let fg = ''; for (let i = 0; i < 7; i++) { const x = 820 + i * 90, y = 1960; fg += `<path d="M${x} ${y} q -20 -150 -50 -220 M${x} ${y} q 10 -170 30 -240 M${x} ${y} q 30 -120 80 -170" stroke="#3e5a24" stroke-width="10" fill="none" stroke-linecap="round"/>`; }
      return { light: { dir: 1, rim: '#fff0c8', key: '#fff4dc' }, layers: [[0.05, sky], [0.12, far], [0.85, road], [1.0, ''], [1.32, fg]] };
    },

    // a small-town county jail (generic): painted cinder-block walls, fluorescent tubes, linoleum. o.view 'desk' = the
    // booking counter (on the left) with a clock, a notice board and a barred gate to the cells; o.view 'cells' = a row of
    // cells (o.cell = {x0, x1} is the near cell, whose bars are drawn in front of the figures) and a duty desk on the right.
    mc22_jail(ctx, o = {}) {
      const t = ctx.t, cells = o.view === 'cells', flick = 0.9 + 0.1 * Math.sin(t * 37) * Math.sin(t * 3.1);
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#d6d0b8"/><rect x="-300" y="760" width="${W + 600}" height="560" fill="#8ea092"/><rect x="-300" y="752" width="${W + 600}" height="14" fill="#5e6e62"/>`;
      for (let yy = 200; yy < 1240; yy += 52) { wall += `<path d="M-300 ${yy} L${W + 300} ${yy}" stroke="#000" stroke-opacity="0.08" stroke-width="3"/>`; for (let xx = -300 + ((yy / 52) % 2) * 55; xx < W + 300; xx += 110) wall += `<path d="M${xx} ${yy} L${xx} ${yy + 52}" stroke="#000" stroke-opacity="0.07" stroke-width="3"/>`; }
      wall += `<rect x="-300" y="-300" width="${W + 600}" height="470" fill="#2c302e"/>`;
      [140, 560, 980].forEach(x => { wall += `<rect x="${x - 120}" y="150" width="240" height="22" rx="6" fill="#f4f6f0" opacity="${f1(flick)}"/>` + wash(x, 200, 260, 90, '#f4f8ff', f1(0.35 * flick)); });
      if (!cells) {
        wall += `<g transform="translate(760 330)"><circle r="56" fill="#f4f0e4" stroke="#2a2a2a" stroke-width="8"/><path d="M0 0 L0 -36" stroke="#1a1a1a" stroke-width="6" transform="rotate(${f1(-60 + t * 2)})"/><path d="M0 0 L0 -46" stroke="#1a1a1a" stroke-width="4" transform="rotate(${f1(t * 24)})"/><circle r="5" fill="#1a1a1a"/></g>`;
        wall += `<rect x="70" y="280" width="420" height="300" fill="#a8845a" stroke="#4a3a28" stroke-width="8"/>` + [[100, 300, -3], [220, 320, 2], [340, 296, -1], [130, 440, 2], [290, 450, -2]].map(([x, y, a]) => `<g transform="rotate(${a} ${x + 50} ${y + 60})"><rect x="${x}" y="${y}" width="104" height="120" fill="#f2ede0" stroke="#8b857a" stroke-width="2"/>${[0, 1, 2, 3].map(i => `<rect x="${x + 12}" y="${y + 18 + i * 22}" width="${76 - i * 10}" height="6" fill="#9a958a"/>`).join('')}<circle cx="${x + 52}" cy="${y + 8}" r="6" fill="#c8312b"/></g>`).join('');
        wall += `<rect x="880" y="330" width="420" height="900" fill="#3a3e40" stroke="${INK}" stroke-width="6"/><rect x="890" y="340" width="400" height="880" fill="#1e2224"/>` + wash(1080, 800, 220, 300, '#f4f8ff', 0.08);
        for (let i = 0; i < 9; i++) wall += `<rect x="${900 + i * 46}" y="340" width="14" height="880" fill="#6a7074" stroke="${INK}" stroke-width="2"/>`;
        wall += `<rect x="884" y="620" width="410" height="18" fill="#6a7074" stroke="${INK}" stroke-width="2"/>`;
      } else {
        // the cell row: the near cell (o.cell) and a second one beyond it; inside: back wall, a steel bench
        const c = o.cell || { x0: 60, x1: 640 };
        wall += `<rect x="${c.x0}" y="300" width="${c.x1 - c.x0}" height="930" fill="#6e7a70" stroke="${INK}" stroke-width="6"/><rect x="${c.x0}" y="300" width="${c.x1 - c.x0}" height="60" fill="#000" opacity="0.25"/>` + wash((c.x0 + c.x1) / 2, 520, 300, 200, '#f4f8ff', 0.12);
        wall += `<rect x="${c.x0 + 40}" y="${o.benchY ?? 1140}" width="${c.x1 - c.x0 - 80}" height="26" fill="#9aa0a4" stroke="${INK}" stroke-width="4"/><rect x="${c.x0 + 60}" y="${(o.benchY ?? 1140) + 26}" width="16" height="${1230 - (o.benchY ?? 1140) - 26}" fill="#6a7074"/><rect x="${c.x1 - 76}" y="${(o.benchY ?? 1140) + 26}" width="16" height="${1230 - (o.benchY ?? 1140) - 26}" fill="#6a7074"/>`;
        wall += `<rect x="${c.x1 + 20}" y="300" width="260" height="930" fill="#5e6a60" stroke="${INK}" stroke-width="6"/>`;
        for (let i = 0; i < 6; i++) wall += `<rect x="${c.x1 + 30 + i * 44}" y="300" width="12" height="930" fill="#6a7074" stroke="${INK}" stroke-width="2"/>`;
        wall += `<rect x="${c.x1 + 20}" y="640" width="260" height="16" fill="#6a7074" stroke="${INK}" stroke-width="2"/>`;
      }
      let floor = `<rect x="-300" y="1228" width="${W + 600}" height="${H}" fill="#7a7466"/><rect x="-300" y="1228" width="${W + 600}" height="10" fill="#4a463e"/>`;
      for (let i = -6; i < 16; i++) floor += `<line x1="${540 + i * 90}" y1="1238" x2="${540 + i * 260}" y2="${H + 300}" stroke="#000" stroke-opacity="0.1" stroke-width="3"/>`;
      [1320, 1480, 1700].forEach(y => { floor += `<line x1="-300" y1="${y}" x2="${W + 300}" y2="${y}" stroke="#000" stroke-opacity="0.1" stroke-width="3"/>`; });
      const layers = [[0.4, wall], [1.0, floor]];
      if (cells) {   // the near cell's bars, in front of whoever sits inside
        const c = o.cell || { x0: 60, x1: 640 };
        let bars = `<rect x="${c.x0 - 10}" y="290" width="${c.x1 - c.x0 + 20}" height="22" fill="#5a6064" stroke="${INK}" stroke-width="4"/><rect x="${c.x0 - 10}" y="700" width="${c.x1 - c.x0 + 20}" height="18" fill="#5a6064" stroke="${INK}" stroke-width="4"/>`;
        for (let x = c.x0; x <= c.x1; x += 58) bars += `<rect x="${x - 7}" y="300" width="14" height="${1232 - 300}" fill="#6a7074" stroke="${INK}" stroke-width="3"/><rect x="${x - 3}" y="300" width="4" height="932" fill="#c9d0d6" opacity="0.4"/>`;
        layers.push([1.03, bars]);
      }
      return { light: { dir: cells ? 1 : -1, rim: '#eef4ff', key: '#f4f8ff' }, layers };
    },

    // a small-town truck-rental counter in Kansas (generic; no brand name, colours or logo anywhere): wood panelling, a
    // key board, a blank wall calendar, a window onto a gravel lot with plain box trucks under a flat Kansas sky, and the
    // counter in the foreground (o.counter = false to drop it)
    mc22_rental(ctx, o = {}) {
      const t = ctx.t, r = R(231);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#6a4a30"/>`;
      for (let i = -6; i < 30; i++) back += `<rect x="${i * 58}" y="0" width="56" height="1240" fill="${i % 2 ? '#7a5838' : '#704f32'}"/><path d="M${i * 58} 0 L${i * 58} 1240" stroke="#3a2818" stroke-width="3"/>`;
      back += `<rect x="-300" y="-300" width="${W + 600}" height="420" fill="#d8d2c0"/><rect x="-300" y="110" width="${W + 600}" height="14" fill="#3a2818"/>`;
      // the window onto the lot
      const WX = 520, WY = 250, WW = 560, WH = 520;
      let win = `<defs><clipPath id="mcrwin"><rect x="${WX}" y="${WY}" width="${WW}" height="${WH}"/></clipPath></defs><g clip-path="url(#mcrwin)"><rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" fill="#a9cbe6"/>` +
        `<rect x="${WX}" y="${WY + 330}" width="${WW}" height="${WH}" fill="#b8a888"/><rect x="${WX}" y="${WY + 318}" width="${WW}" height="16" fill="#8aa05a"/>`;
      [[WX + 30, 0.9, '#e4e6e8'], [WX + 330, 0.8, '#d4d8dc']].forEach(([x, k, col]) => {
        const y = WY + 440;
        win += `<g transform="translate(${x} ${y}) scale(${k})"><rect x="0" y="-170" width="210" height="150" fill="${col}" stroke="#2a2a2a" stroke-width="4"/><path d="M210 -110 L262 -110 L282 -70 L282 -20 L210 -20 Z" fill="#9aa0a6" stroke="#2a2a2a" stroke-width="4"/><path d="M222 -102 L256 -102 L270 -74 L222 -74 Z" fill="#2a3240"/><circle cx="50" cy="-14" r="20" fill="#141414"/><circle cx="160" cy="-14" r="20" fill="#141414"/><circle cx="246" cy="-14" r="20" fill="#141414"/></g>`;
      });
      win += `<path d="M${WX + 470} ${WY + 440} L${WX + 470} ${WY + 200}" stroke="#4a4a4a" stroke-width="6"/>`;
      for (let i = 0; i < 9; i++) win += `<rect x="${WX}" y="${WY + i * 18}" width="${WW}" height="12" fill="#e8e2d0" stroke="#b8b0a0" stroke-width="1"/>`;
      win += `</g><rect x="${WX - 12}" y="${WY - 12}" width="${WW + 24}" height="${WH + 24}" fill="none" stroke="#e8e2d6" stroke-width="16"/><path d="M${WX + WW / 2} ${WY} L${WX + WW / 2} ${WY + WH}" stroke="#e8e2d6" stroke-width="10"/>` + wash(WX + WW / 2, WY + WH / 2, 380, 300, '#fff6dc', 0.18);
      // key board and a blank calendar (no words)
      let keys = `<rect x="60" y="300" width="300" height="250" fill="#c4a87a" stroke="#3a2818" stroke-width="6"/>`;
      for (let rr = 0; rr < 3; rr++) for (let c = 0; c < 5; c++) { const x = 92 + c * 54, y = 340 + rr * 70; keys += `<circle cx="${x}" cy="${y}" r="4" fill="#3a3a3a"/>` + (r() < 0.75 ? `<path d="M${x} ${y} l -6 20 l 12 0 Z" fill="#b8bcc0" stroke="#3a3a3a" stroke-width="2"/><rect x="${x - 10}" y="${y + 20}" width="20" height="28" rx="3" fill="${['#e8d070', '#cfd8e2', '#e8a070'][(rr + c) % 3]}" stroke="#3a3a3a" stroke-width="2"/>` : ''); }
      keys += `<g transform="translate(400 300)"><rect width="90" height="120" fill="#f2ede0" stroke="#5a4a38" stroke-width="3"/><rect width="90" height="30" fill="#8e2a2a"/>${[0, 1, 2, 3].map(rr => [0, 1, 2, 3, 4].map(c => `<rect x="${8 + c * 16}" y="${40 + rr * 18}" width="11" height="11" fill="#cfc8b6"/>`).join('')).join('')}</g>`;
      let floor = `<rect x="-300" y="1236" width="${W + 600}" height="${H}" fill="#6a5e4c"/>`;
      for (let i = 0; i < 10; i++) floor += `<line x1="-300" y1="${1260 + i * 70}" x2="${W + 300}" y2="${1260 + i * 70}" stroke="#000" stroke-opacity="0.1" stroke-width="3"/>`;
      const layers = [[0.3, back + win + keys], [1.0, floor]];
      if (o.counter !== false) {
        const cx1 = o.counterX1 ?? 700;
        let counter = `<rect x="-300" y="1206" width="${cx1 + 300}" height="34" fill="#c2a878" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1238" width="${cx1 + 300 - 14}" height="${H}" fill="#7a5a3a" stroke="${INK}" stroke-width="5"/>`;
        for (let i = -4; i < 12; i++) if (i * 120 < cx1 - 40) counter += `<rect x="${i * 120 + 10}" y="1260" width="100" height="500" fill="none" stroke="#5a3e26" stroke-width="4"/>`;
        counter += `<g transform="translate(${cx1 - 120} 1206)"><ellipse cx="0" cy="-4" rx="34" ry="8" fill="#8a8e92"/><path d="M-26 -6 Q0 -50 26 -6 Z" fill="#c9cfd4" stroke="${INK}" stroke-width="3"/><circle cx="0" cy="-48" r="5" fill="#8a8e92"/></g>`;
        counter += `<g transform="translate(120 1200) rotate(-4)"><rect x="-70" y="-10" width="140" height="16" fill="#8a6a40" stroke="${INK}" stroke-width="3"/><rect x="-60" y="-18" width="120" height="12" fill="#f2ede0" stroke="${INK}" stroke-width="2"/></g>`;
        layers.push([1.04, counter]);
      }
      return { light: { dir: 1, rim: '#fff0d0', key: '#ffe8c0' }, layers };
    }
  });

  // the toll, as a quiet typed card (no images): 168 people, 19 children
  function tollCard(t, k0, k1) {
    if (k0 <= 0) return '';
    return `<g opacity="${f1(k0)}">${panel(110, 520, 860, 250, 0.7)}<text x="540" y="626" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="76" fill="#f4efe4">168 PEOPLE KILLED</text>` +
      `<text x="540" y="712" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="50" fill="#e8dcc0" opacity="${f1(k1)}">INCLUDING 19 CHILDREN</text></g>`;
  }

  E.registerScenes({
    // 1 - hook: the hero car from the patrol car's seat, big and centred from the first frame; the headline is burned in
    //     by the engine (until ~3.2 s), so nothing of ours sits in y 380-720 before that. The trooper walks up and points.
    mc22_hook(ctx) {
      const t = ctx.t, l1 = LS(ctx, 1, 4.0), miss = WT(ctx, 1, 3, 4.6), plate = WT(ctx, 1, 5, 5.2);
      const CARP = { x: 540, y: 1300, s: 0.9 };
      return E.cine.shot(ctx, {
        set: 'mc22_highway', setOpts: { view: 'rear' }, grade: 'warm', police: 0.22 * seg(t, 0.2, 1.2),
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 0, y: 70, z: 1.08 }, handheld: 1.2 },
        shake: [{ at: plate, amp: 4 }],
        figures: [{ id: 'mc22_trooper', x: -200, y: 1236, scale: 0.66, dir: 1, turn: 0.5, pose: 'stand', expr: 'focused', depth: 0.99, show: [l1 - 1.1],
          walk: { from: -200, to: 120, at: l1 - 1.0, dur: Math.max(0.6, miss - l1 + 0.7), cadence: 6.2 }, keys: [{ at: plate - 0.3, pose: 'point', expr: 'stern', dur: 0.35 }] }],
        props: [{ depth: 1.0, svg: tt => carRear(CARP.x, CARP.y, CARP.s, tt, { driver: true, exhaust: true, brake: tt < 1.4, glow: seg(tt, plate - 0.2, plate + 0.3) }) }],
        overlays: [
          { type: 'label', at: 3.25, until: plate - 0.35, x: 60, y: 432, text: 'I-35, OKLAHOMA · 19 APRIL 1995', fs: 38, sub: 'The same morning as the bombing' },
          { type: 'callout', at: plate - 0.05, target: [CARP.x, CARP.y - 383 * CARP.s], depth: 1.0, r: 92, label: [500, 470], w: 520, text: 'NO LICENSE PLATE', colour: YEL }
        ],
        tag: LIKENESS
      });
    },

    // 2 - the toll, said once and plainly, in a quiet task-force room; nothing of the bombing is shown
    mc22_toll(ctx) {
      const t = ctx.t, bomb = WT(ctx, 0, 2, 0.6), kil = WT(ctx, 0, 3, 0.9), n168 = WT(ctx, 0, 4, 1.2), ch = WT(ctx, 0, 8, 2.4);
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: {}, grade: 'cold', dust: true,
        cam: { from: { x: 20, y: -30, z: 1.06 }, to: { x: -20, y: -50, z: 1.0 }, handheld: 0.6 },
        figures: [
          { id: 'analyst', x: 200, y: 1560, scale: 0.92, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', keys: [...typing(0.05, kil - 0.1), { at: kil, pose: 'sit', expr: 'sad', gaze: [0.4, 0.3], dur: 0.5 }, { at: ch, pose: 'sit_slumped', dur: 0.6 }] },
          { id: 'agent_b', x: 840, y: 1700, scale: 0.96, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', keys: [{ at: bomb, pose: 'stand', expr: 'sad', dur: 0.5 }, { at: n168 + 0.2, pose: 'bowed', dur: 0.7 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'OKLAHOMA CITY · 19 APRIL 1995', fs: 38, sub: '9:02 a.m.' },
          { type: 'svg', at: n168 - 0.15, svg: tt => tollCard(tt, seg(tt, n168 - 0.15, n168 + 0.3), seg(tt, ch - 0.6, ch - 0.2)) }
        ],
        tag: TAG
      });
    },

    // 3 - the stop: the yellow car and the patrol car roll onto the shoulder; the trooper walks up (side view)
    mc22_stop(ctx) {
      const t = ctx.t, mins = WT(ctx, 0, 3, 1.0), stp = WT(ctx, 0, 6, 1.9), no = WT(ctx, 0, 10, 2.9), plate = WT(ctx, 0, 12, 3.4);
      const GY = 1268, YC = { x: 790, k: 0.7 }, PC = { x: 70, k: 0.66 };
      const roll = tt => 1 - ease.out(clamp(tt / Math.max(0.6, stp + 0.1), 0, 1));   // 1 = still rolling in, 0 = stopped
      return E.cine.shot(ctx, {
        set: 'mc22_highway', setOpts: { view: 'side' }, grade: 'warm', police: 0.16 * seg(t, 0.3, 1.0),
        cam: { from: { x: 0, y: 120, z: 1.0 }, to: { x: 20, y: 110, z: 1.05 }, handheld: 1.6 },
        figures: [{ id: 'mc22_trooper', x: 90, y: 1290, scale: 0.27, dir: 1, turn: 0.5, pose: 'stand', expr: 'focused', depth: 1.01, show: [stp + 0.1],
          walk: { from: 90, to: 560, at: stp + 0.2, dur: Math.max(0.6, plate - stp), cadence: 6.4 }, keys: [{ at: plate + 0.15, pose: 'point', dur: 0.35 }] }],
        props: [
          { depth: 1.0, svg: tt => patrolCar(PC.x - 760 * roll(tt), GY, PC.k, tt, { doorOpen: tt > stp + 0.05 }) },
          { depth: 1.0, svg: tt => carSide(YC.x - 760 * roll(tt), GY, YC.k, tt, { driver: true, brake: tt > stp - 0.6 && tt < stp + 0.5, roll: -roll(tt) * 8 }) }
        ],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'WITHIN ABOUT 90 MINUTES', fs: 40, sub: 'Per the FBI · I-35, north of Oklahoma City' },
          { type: 'callout', at: no - 0.05, target: [YC.x - 500 * YC.k, GY - 90 * YC.k], depth: 1.0, r: 60, label: [500, 690], w: 470, text: 'NO LICENSE PLATE', colour: YEL }
        ],
        tag: LIKENESS
      });
    },

    // 4 - booked at a small county jail (generic): the clerk types, the trooper hands over the paperwork
    mc22_jail(ctx) {
      const t = ctx.t, jl = WT(ctx, 0, 2, 0.5), gun = WT(ctx, 0, 4, 1.0), chg = WT(ctx, 0, 7, 1.9);
      const desk = `<g><rect x="-300" y="1150" width="860" height="34" fill="#9aa0a4" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1182" width="846" height="${H}" fill="#5e6a62" stroke="${INK}" stroke-width="5"/>` +
        `<g transform="translate(150 1150)"><rect x="-90" y="-150" width="180" height="140" rx="10" fill="#d8d0b8" stroke="${INK}" stroke-width="5"/><rect x="-72" y="-134" width="144" height="104" rx="6" fill="#1a3a2a"/>${[0, 1, 2, 3].map(i => `<rect x="-60" y="${-122 + i * 22}" width="${100 - i * 14}" height="7" fill="#5ad08a" opacity="0.8"/>`).join('')}<rect x="-100" y="-10" width="200" height="12" rx="4" fill="#cfc6ae" stroke="${INK}" stroke-width="3"/></g>` +
        `<g transform="translate(420 1146) rotate(3)"><rect x="-60" y="-10" width="120" height="12" fill="#f2ede0" stroke="${INK}" stroke-width="2"/><rect x="-56" y="-18" width="112" height="10" fill="#ebe5d6" stroke="${INK}" stroke-width="2"/></g></g>`;
      return E.cine.shot(ctx, {
        set: 'mc22_jail', setOpts: { view: 'desk' }, grade: 'cold',
        cam: { from: { x: 20, y: 0, z: 1.0 }, to: { x: -30, y: -20, z: 1.07 }, handheld: 1.4 },
        figures: [
          { id: 'official', x: 300, y: 1640, scale: 0.86, dir: 1, turn: 0.4, pose: 'sit_type', expr: 'focused', depth: 0.98, keys: [...typing(0.05, chg - 0.2), { at: chg - 0.1, pose: 'sit_read', expr: 'stern', dur: 0.4 }] },
          { id: 'mc22_driver', x: 690, y: 1660, scale: 0.8, dir: -1, turn: 0.45, pose: 'stand', silhouette: 'cool', keys: [{ at: jl - 0.2, pose: 'hands_behind', dur: 0.5 }, { at: chg + 0.2, pose: 'bowed', dur: 0.6 }] },
          { id: 'mc22_trooper', x: 1290, y: 1690, scale: 0.83, dir: -1, turn: 0.5, pose: 'stand', expr: 'stern', walk: { from: 1290, to: 930, at: 0.05, dur: 1.0, cadence: 6.4 }, keys: [{ at: gun, pose: 'read', dur: 0.4 }, { at: chg - 0.1, pose: 'present', dur: 0.4 }] }
        ],
        props: [{ depth: 1.02, svg: desk }],
        overlays: [{ type: 'label', at: 0.1, x: 60, y: 432, text: 'BOOKED · NOBLE COUNTY JAIL', fs: 40, sub: 'Misdemeanor gun and traffic charges' }],
        tag: LIKENESS
      });
    },

    // 5 - the axle from the wreckage, in the lab; its number (masked) points the FBI to Kansas
    mc22_axle(ctx) {
      const t = ctx.t, ax = WT(ctx, 0, 3, 0.8), vin = WT(ctx, 0, 4, 1.1), led = WT(ctx, 0, 7, 2.3), fbi = WT(ctx, 0, 9, 2.6), ks = WT(ctx, 0, 11, 3.0);
      const A = { x: 560, y: 1196, s: 0.78 };
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 980 }, grade: 'cold', cam: { from: { x: 0, y: -30, z: 1.04 }, to: { x: 30, y: -60, z: 1.14 }, handheld: 0.8 },
        figures: [
          { id: 'scientist', x: 230, y: 1800, scale: 1.0, dir: 1, turn: 0.45, pose: 'examine', expr: 'focused', gaze: [0.6, 0.7], keys: [{ at: vin - 0.2, pose: 'point', expr: 'realise', gaze: [0.7, 0.4], dur: 0.4 }, { at: ks + 0.2, pose: 'stand', dur: 0.4 }] },
          { id: 'agent_a', x: 1010, y: 1820, scale: 0.98, dir: -1, turn: 0.5, pose: 'stand', expr: 'focused', keys: [{ at: ax - 0.1, pose: 'read', dur: 0.4 }, { at: fbi - 0.1, pose: 'point', expr: 'determined', dur: 0.4 }] }
        ],
        props: [{ depth: 1.06, svg: tt => axle(A.x, A.y, A.s, tt, { glow: seg(tt, vin - 0.2, vin + 0.3) }) }],
        overlays: [
          { type: 'label', at: 0.1, until: led - 0.3, x: 60, y: 432, text: "FROM THE WRECKAGE: AN AXLE", fs: 40, sub: "The rental truck's rear axle housing" },
          { type: 'callout', at: vin + 0.05, target: [A.x + 268 * A.s, A.y - 27 * A.s], depth: 1.06, r: 70, label: [420, 760], w: 600, h: 104, text: 'VEHICLE ID NUMBER', sub: 'digits masked here', colour: YEL },
          { type: 'card', at: led - 0.15, x: 80, y: 390, w: 920, rows: [{ text: 'TRACED TO A TRUCK-RENTAL SHOP', fs: 36 }, { text: 'JUNCTION CITY, KANSAS', fs: 50, colour: '#8e1f18', at: ks - 0.3 }] }
        ],
        tag: TAG
      });
    },

    // 6 - the rental counter in Kansas: staff help agents with a composite sketch (never shown); then a name
    mc22_rental(ctx) {
      const t = ctx.t, sk = WT(ctx, 0, 0, 0.2), shop = WT(ctx, 0, 4, 1.0), led = WT(ctx, 0, 6, 1.5), nm = WT(ctx, 0, 9, 2.1), tm = WT(ctx, 0, 10, 2.5);
      return E.cine.shot(ctx, {
        set: 'mc22_rental', setOpts: { counterX1: 640 }, grade: 'warm',
        cam: { keys: [{ at: 0, x: -30, y: 0, z: 1.02 }, { at: nm - 0.4, x: 40, y: -20, z: 1.1, dur: 1.2 }], handheld: 1.2 },
        figures: [
          { id: 'mc22_clerk', x: 300, y: 1690, scale: 0.9, dir: 1, turn: 0.4, pose: 'stand', expr: 'focused', depth: 0.98, keys: [{ at: sk, pose: 'present', dur: 0.4 }, { at: shop, pose: 'hand_to_face', expr: 'focused', dur: 0.4 }, { at: led, pose: 'point', expr: 'realise', dur: 0.35 }] },
          { id: 'agent_b', x: 820, y: 1720, scale: 0.92, dir: -1, turn: 0.4, pose: 'read', expr: 'focused', keys: [{ at: nm - 0.1, pose: 'stand', expr: 'determined', dur: 0.4 }] },
          { id: 'agent_a', x: 1300, y: 1760, scale: 0.95, dir: -1, turn: 0.5, pose: 'stand', expr: 'focused', walk: { from: 1300, to: 1030, at: 0.2, dur: 1.0, cadence: 6.4 }, keys: [{ at: tm, pose: 'arms_crossed', expr: 'determined', dur: 0.45 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: nm - 0.25, x: 60, y: 432, text: 'JUNCTION CITY, KANSAS', fs: 40, sub: 'Shop staff helped make a sketch' },
          { type: 'card', at: nm - 0.1, x: 80, y: 390, w: 920, rows: [{ text: 'THE SKETCH, MATCHED AT A MOTEL:', fs: 30, colour: '#6b665c' }, { text: 'TIMOTHY McVEIGH', fs: 62, colour: '#8e1f18', at: tm - 0.05 }] }
        ],
        tag: 'ILLUSTRATION · GENERIC SHOP, NO REAL BRAND'
      });
    },

    // 7 - THE HOW: he was already in a cell. A records check; the duty desk phone rings; HOLD (21 April)
    mc22_reveal(ctx) {
      const t = ctx.t, ran = WT(ctx, 0, 1, 0.3), alr = WT(ctx, 0, 6, 1.4), jail = WT(ctx, 0, 8, 1.8), l1 = LS(ctx, 1, 2.6), rel = WT(ctx, 1, 3, 3.3);
      // a seated figure's feet sit ~208 units above its feet line, so the cell floor (FL) is FY - 208 * FS; the seat is at the hip
      const CELL = { x0: 60, x1: 640 }, FS = 0.62, FL = 1206, FY = FL + 208 * FS, bench = FY - 440 * FS;
      const benchSvg = `<rect x="${CELL.x0 + 40}" y="${f1(bench)}" width="${CELL.x1 - CELL.x0 - 80}" height="24" fill="#9aa0a4" stroke="${INK}" stroke-width="4"/><rect x="${CELL.x0 + 60}" y="${f1(bench + 24)}" width="16" height="${f1(FL - bench - 24)}" fill="#6a7074"/><rect x="${CELL.x1 - 76}" y="${f1(bench + 24)}" width="16" height="${f1(FL - bench - 24)}" fill="#6a7074"/>` +
        `<ellipse cx="340" cy="${FL + 4}" rx="110" ry="10" fill="#000" opacity="0.3"/>`;
      // repaint the corridor floor in front of the cell, over the figure's own ground shadow (which falls on its feet line)
      const floorPatch = `<rect x="${CELL.x0 - 20}" y="1236" width="${CELL.x1 - CELL.x0 + 40}" height="140" fill="#7a7466"/><line x1="${CELL.x0 - 20}" y1="1320" x2="${CELL.x1 + 20}" y2="1320" stroke="#000" stroke-opacity="0.1" stroke-width="3"/>`;
      const duty = tt => `<g><rect x="620" y="1330" width="780" height="30" fill="#8a7a62" stroke="${INK}" stroke-width="5"/><rect x="632" y="1358" width="756" height="${H}" fill="#5a4e40" stroke="${INK}" stroke-width="5"/>` +
        phone(730, 1332, 0.8, tt, seg(tt, ran - 0.1, ran + 0.2) * (1 - seg(tt, alr - 0.2, alr))) + `<g transform="translate(960 1326) rotate(-3)"><rect x="-70" y="-10" width="140" height="14" fill="#f2ede0" stroke="${INK}" stroke-width="2"/></g></g>`;
      return E.cine.shot(ctx, {
        set: 'mc22_jail', setOpts: { view: 'cells', cell: CELL, benchY: 2000 }, grade: 'cold',
        cam: { from: { x: 30, y: 10, z: 1.0 }, to: { x: -60, y: -10, z: 1.12 }, handheld: 2.2 },
        shake: [{ at: jail, amp: 5 }],
        figures: [
          { id: 'mc22_driver', x: 340, y: FY, scale: FS, dir: 1, turn: 0.35, pose: 'sit_slumped', noChair: true, silhouette: 'cool', keys: [{ at: alr, pose: 'sit', dur: 0.5 }, { at: rel - 0.1, pose: 'sit_slumped', dur: 0.6 }] },
          { id: 'official', x: 880, y: 1780, scale: 0.8, dir: -1, turn: 0.4, pose: 'sit_read', expr: 'focused', depth: 1.01, keys: [{ at: ran + 0.1, pose: 'present', expr: 'realise', gaze: [0.6, 0.6], dur: 0.35 }, { at: jail, pose: 'sit', expr: 'stern', gaze: [-0.9, -0.2], dur: 0.4 }] }
        ],
        props: [{ depth: 0.995, svg: benchSvg }, { depth: 1.005, svg: floorPatch }, { depth: 1.04, svg: duty }],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.1, x: 60, y: 432, text: '21 APRIL 1995 · RECORDS CHECK', fs: 38, sub: 'He was still in the county jail' },
          { type: 'callout', at: alr - 0.05, target: [345, 930], depth: 1.0, r: 84, label: [560, 640], w: 470, text: 'ALREADY IN CUSTODY', colour: YEL },
          { type: 'stamp', at: rel - 0.05, x: 540, y: 540, text: 'HOLD', scale: 1.5, colour: '#c8312b' }
        ],
        tag: LIKENESS
      });
    },

    // 8 - the outcome: guilty (2 June 1997), executed (11 June 2001); Terry Nichols also convicted (card only)
    mc22_verdict(ctx) {
      const cv = WT(ctx, 0, 2, 0.4), l1 = LS(ctx, 1, 1.8), ex = WT(ctx, 1, 1, 2.1);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.1 } },
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.33, keys: [{ at: cv - 0.4, pose: 'gavel', dur: 0.3 }, { at: cv + 0.05, pose: 'sit', dur: 0.15 }, { at: l1, pose: 'sit_read', dur: 0.5 }] },
          { id: 'mc22_driver', x: 840, y: 1770, scale: 0.95, dir: -1, turn: 0.15, pose: 'sit', silhouette: 'cool', keys: [{ at: 0.1, pose: 'stand', dur: 0.5 }, { at: cv, pose: 'hands_together', dur: 0.4 }, { at: ex, pose: 'bowed', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'card', at: 0.15, x: 40, y: 860, w: 640, rows: [{ text: 'FEDERAL JURY · 2 JUNE 1997', fs: 26, colour: '#6b665c' }, { text: 'GUILTY ON ALL 11 COUNTS', fs: 34, colour: '#8e1f18', at: cv - 0.05 }, { text: 'EXECUTED · 11 JUNE 2001', fs: 34, at: ex - 0.05 }, { text: 'TERRY NICHOLS: ALSO CONVICTED', fs: 24, colour: '#6b665c', at: ex + 0.4 }] }
        ],
        tag: LIKENESS
      });
    },

    // 9 - callback on the hero object (same framing as the first frame), the memorial line, then a compact follow card.
    //     The last frame is the yellow car, big and centred, so the video loops back to the first.
    mc22_end(ctx) {
      const t = ctx.t, pl = WT(ctx, 0, 3, 1.0), l1 = LS(ctx, 1, 2.4), end = ctx.T;
      const CARP = { x: 540, y: 1300, s: 0.9 };
      const memo = tt => { const k = seg(tt, l1 + 0.1, l1 + 0.5) * (1 - seg(tt, end - 1.75, end - 1.5)); if (k <= 0) return ''; return `<g opacity="${f1(k)}">${panel(150, 400, 780, 150, 0.62)}<text x="540" y="496" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="56" fill="#f4efe4">WE REMEMBER THE 168</text></g>`; };
      return E.cine.shot(ctx, {
        set: 'mc22_highway', setOpts: { view: 'rear' }, grade: 'warm', police: 0.22 * (1 - seg(t, end - 1.6, end - 0.4)),
        cam: { from: { x: 0, y: 70, z: 1.08 }, to: { x: 0, y: 40, z: 1.0 }, handheld: 0.6 },
        props: [{ depth: 1.0, svg: tt => carRear(CARP.x, CARP.y, CARP.s, tt, { driver: true, exhaust: true, glow: 0.8 * seg(tt, pl - 0.3, pl + 0.2) * (1 - seg(tt, end - 1.6, end - 0.6)) }) }],
        overlays: [
          { type: 'funfact', at: WT(ctx, 0, 0, 0.25) - 0.05, until: l1 - 0.1, y: 400, w: 920, fs: 38, rows: [{ text: 'The real car later went on display' }, { text: 'at the Oklahoma City National' }, { text: 'Memorial & Museum.', colour: YEL }] },
          { type: 'svg', at: l1 + 0.1, svg: memo },
          { type: 'nextcase', at: end - 1.55, y: 380, w: 900, rows: [{ text: "MORE 'CAUGHT BY…' CASES", fs: 44 }], sub: 'FOLLOW' }
        ],
        tag: ROAD
      });
    }
  });
})();
