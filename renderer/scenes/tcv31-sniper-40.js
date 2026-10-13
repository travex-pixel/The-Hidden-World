/* Case File 31 (cinematic, 40-second cut): the October 2002 Washington DC-area sniper attacks and a highway rest stop.
   CLOSED: John Allen Muhammad convicted (Virginia, 2003) and executed (10 Nov 2009); Lee Boyd Malvo (17 at the time) given
   life; a Maryland resentencing ordered in 2022 has stalled; the Maryland Supreme Court refused his appeal (Aug 2026).
   Structure (short40 + the EPISODE 29+ rules): a burned-in hook headline that leads with the OBJECT, over the HERO OBJECT:
   a generic dark blue 1990s sedan parked at a highway rest stop at night under sodium lights, a REST AREA sign beside it,
   big and centred in the first frame and again in the last (the video loops). A stakes number by 0:10 (ten killed, three
   wounded); fast beats (the white box truck lookout; the tip-line call about Alabama; the fingerprint; the Caprice); the
   HOW at about 60 % (the plate goes out, a trucker sees the car, both men asleep); the outcome in one line; the callback;
   the memorial; a burned-in YES/NO end question (episode.end_title) over the last 3.2 s. No nextcase card.
   Content rules:
   - No shooting, weapon, victim, injury or crime scene is drawn anywhere. The toll is a typed card at a briefing; the
     Alabama beat is a storefront exterior at dusk with an evidence marker; the trunk is only said to be "modified".
   - Muhammad and Malvo are ONLY dark shapes inside the car and, in court, anonymous rim-lit silhouettes
     (characters/figures/ds31_muhammad.json, ds31_malvo.json): no face, no likeness, never a photo recreation, never posed
     heroically. Every shot they are in is tagged 'ILLUSTRATION · NOT A LIKENESS'.
   - The trucker (ds31_trucker) and the officers (ds31_officer, agent_a/b) are generic figures, not named. No weapon.
   - No brand or real material: the sedan carries a BLANK plate; the trucks have no logo; the store has a blank sign; the
     rest-area sign is our own generic drawing; every card is our own typed graphic.
   New environments (E.registerSets): ds31_rest (an interstate rest area at night: a tree line, the highway behind it with
   passing headlights, a low rest-area building with a lit alcove, a sodium lamp, a parking lot; o.trucks 0..1 parks two
   generic semi-trailers across the exit; o.police 0..1 adds red/blue flicker), ds31_road (a suburban arterial road in
   October by day: autumn trees, a distant overpass, a shoulder where a white box truck is stopped), ds31_store (a generic
   single-storey liquor store exterior at dusk with a blank sign box, a glass door, a strip of parking). Plus the shared
   press_room, task_force, office_day and courtroom sets.
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
  const REST = 'ILLUSTRATION · GENERIC REST AREA, NOT THE REAL ONE';
  const YEL = '#ffd23f', RED = '#8e1f18', MUTE = '#6b665c';
  const typing = (from, to, a = 'sit_type', b = 'sit_type_b', step = 0.24) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? b : a, dur: step * 0.8 }); return k; };
  const panel = (x, y, w, h, op = 0.6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#000" opacity="${op}"/>`;

  // ---------- THE HERO: a generic dark blue 1990 full-size sedan in profile (boxy three-box shape), front to the right
  // (o.flip = -1 faces left); bottom centre (x, y) on the ground; ~1040 long at k = 1. The plate is a BLANK pale
  // rectangle (no characters). o.sleep 0..1 draws two dark slumped head shapes inside; o.glow 0..1 = a yellow outline;
  // o.sodium 0..1 = the orange lamp sheen on the roof and hood; o.brake = tail lights lit. No badge, logo or text.
  const CAR = { body: '#1d3566', shade: '#122146', light: '#3a5a9a', trim: '#c9d0d6', glass: '#141c2c' };
  function sedan(x, y, k, t, o = {}) {
    const C = CAR, fl = o.flip || 1, sl = o.sleep || 0, gl = o.glow || 0, so = o.sodium ?? 0.6;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k * fl)} ${sc(k)})"><ellipse cx="0" cy="8" rx="540" ry="28" fill="#000" opacity="0.45"/>`;
    // the body: a long flat hood (right), a boxy cabin with upright pillars, a long trunk deck (left)
    g += `<path d="M-520 -50 L-524 -120 Q-522 -138 -500 -142 L-330 -150 L-290 -156 L-220 -252 Q-210 -262 -186 -262 L150 -262 Q172 -262 184 -250 L262 -156 L492 -144 Q520 -140 524 -116 L524 -50 Z" fill="${C.body}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-520 -50 L-522 -100 L524 -100 L524 -50 Z" fill="${C.shade}" opacity="0.85"/><path d="M-516 -104 L520 -104" stroke="${C.trim}" stroke-width="5" opacity="0.8"/>`;
    // the roof's sheen under the lamp, the hood's sheen
    g += `<path d="M-220 -252 Q-210 -262 -186 -262 L150 -262 Q172 -262 184 -250 L176 -242 L-212 -242 Z" fill="#ffb060" opacity="${f1(0.35 * so)}"/>`;
    g += `<path d="M270 -156 L492 -144 L488 -134 L280 -146 Z" fill="#ffb060" opacity="${f1(0.22 * so)}"/>`;
    // windows: rear, two doors with a B-pillar, a sloped windscreen
    g += `<path d="M-206 -244 L-120 -244 L-120 -166 L-278 -162 Z" fill="${C.glass}"/><path d="M-104 -244 L10 -244 L10 -166 L-104 -166 Z M26 -244 L146 -244 L228 -164 L26 -166 Z" fill="${C.glass}"/>`;
    g += `<path d="M-290 -156 L-220 -252" stroke="${C.body}" stroke-width="10"/><path d="M-120 -250 L-120 -160 M10 -250 L10 -160" stroke="${C.body}" stroke-width="12"/>`;
    if (sl > 0) g += `<g opacity="${f1(sl)}"><path d="M-82 -168 Q-70 -214 -40 -204 Q-18 -200 -14 -168 Z" fill="#06080b"/><path d="M70 -168 Q84 -222 116 -210 Q138 -204 142 -168 Z" fill="#06080b"/></g>`;
    g += `<path d="M-60 -238 L-20 -238 L-50 -172 L-90 -172 Z" fill="#d6e8f8" opacity="0.1"/><path d="M60 -238 L100 -238 L140 -172 L100 -172 Z" fill="#d6e8f8" opacity="0.08"/>`;
    // door handles, side mirror, a chrome strip
    g += `<rect x="-96" y="-150" width="40" height="10" rx="4" fill="${C.trim}"/><rect x="24" y="-150" width="40" height="10" rx="4" fill="${C.trim}"/><rect x="228" y="-196" width="30" height="22" rx="5" fill="${C.shade}" stroke="${INK}" stroke-width="3"/>`;
    g += `<path d="M-500 -128 L-330 -136 M262 -148 L480 -136" stroke="${C.light}" stroke-width="3" opacity="0.5"/>`;
    // bumpers, the BLANK rear plate on the left bumper, lamps
    g += `<rect x="-540" y="-86" width="38" height="40" rx="6" fill="${C.trim}" stroke="${INK}" stroke-width="4"/><rect x="504" y="-88" width="36" height="42" rx="6" fill="${C.trim}" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-534" y="-78" width="12" height="26" rx="2" fill="#e8e2d0" stroke="${INK}" stroke-width="2"/>`;
    g += `<rect x="-528" y="-136" width="16" height="30" fill="${o.brake ? '#ff3a2a' : '#8e1f18'}"/><rect x="512" y="-134" width="14" height="26" fill="#fff6d0"/>`;
    if (o.brake) g += wash(-540, -120, 60, 36, '#ff4a2a', 0.5);
    if (o.headlights) g += `<path d="M526 -130 L900 -176 L900 -56 L526 -108 Z" fill="#fff6d0" opacity="0.1"/>`;
    // wheels with plain hubcaps
    [-330, 332].forEach(cx => { g += `<path d="M${cx - 78} -50 A78 78 0 0 1 ${cx + 78} -50 Z" fill="#101214"/><circle cx="${cx}" cy="-4" r="60" fill="#0b0b0d" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-4" r="30" fill="${C.trim}" stroke="${INK}" stroke-width="4"/><circle cx="${cx}" cy="-4" r="8" fill="#7d868e"/>`; });
    if (gl > 0) g += `<path d="M-560 -40 L-560 -150 L-300 -176 L-230 -284 L190 -284 L280 -176 L560 -150 L560 -40 Z" fill="none" stroke="${YEL}" stroke-width="10" stroke-linejoin="round" opacity="${f1(gl * (0.75 + 0.25 * Math.sin(t * 7)))}"/>`;
    return g + '</g>';
  }
  // a generic blue REST AREA sign on two posts (our own drawing, no highway shield or route number); bottom centre (x, y)
  function restSign(x, y, s, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-150" y="-420" width="18" height="420" fill="#4a4e56" stroke="${INK}" stroke-width="3"/><rect x="132" y="-420" width="18" height="420" fill="#4a4e56" stroke="${INK}" stroke-width="3"/>`;
    g += `<rect x="-210" y="-620" width="420" height="220" rx="14" fill="#1d4a8a" stroke="#f4f4f0" stroke-width="8"/><rect x="-196" y="-606" width="392" height="192" rx="10" fill="none" stroke="${INK}" stroke-width="3" opacity="0.5"/>`;
    g += `<text x="0" y="-540" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="64" fill="#f4f4f0">REST AREA</text>`;
    g += `<path d="M-60 -470 L40 -470 L40 -496 L90 -456 L40 -416 L40 -442 L-60 -442 Z" fill="#f4f4f0"/>`;
    if (o.glow) g += `<rect x="-224" y="-634" width="448" height="248" rx="18" fill="none" stroke="${YEL}" stroke-width="8" opacity="${f1(o.glow)}"/>`;
    return g + '</g>';
  }
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
  // a generic white box truck in profile (cab to the right); plain white box, no lettering; bottom centre (x, y); ~900 long
  function boxTruck(x, y, k, t, o = {}) {
    const fl = o.flip || 1;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k * fl)} ${sc(k)})"><ellipse cx="0" cy="8" rx="460" ry="26" fill="#000" opacity="0.4"/>`;
    g += `<rect x="-450" y="-420" width="600" height="320" rx="8" fill="#eceef0" stroke="${INK}" stroke-width="7"/><rect x="-450" y="-420" width="600" height="30" fill="#c8ccd0"/><path d="M-440 -110 L140 -110" stroke="#9aa0a8" stroke-width="6"/>`;
    g += `<path d="M150 -110 L150 -380 L300 -380 L390 -300 L450 -280 L450 -110 Z" fill="#e4e6e8" stroke="${INK}" stroke-width="7"/><path d="M300 -368 L380 -296 L300 -296 Z M170 -366 L288 -366 L288 -296 L170 -296 Z" fill="#141c2c"/>`;
    g += `<rect x="-470" y="-130" width="930" height="26" fill="#2a2e34"/><rect x="440" y="-186" width="26" height="60" rx="5" fill="#c9d0d6" stroke="${INK}" stroke-width="3"/>`;
    if (o.doors) g += `<path d="M-450 -400 L-560 -360 L-560 -140 L-450 -120 Z" fill="#d8dce0" stroke="${INK}" stroke-width="6"/>`;
    [[-300, -4], [330, -4]].forEach(([cx, cy]) => { g += `<circle cx="${cx}" cy="${cy}" r="58" fill="#0b0b0d" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="24" fill="#6a7078"/>`; });
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
  // a flashlight beam: a soft cone from (x0, y0) to a pool around (x1, y1)
  function beam(x0, y0, x1, y1, w0, w1, op) {
    if (op <= 0) return '';
    const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a);
    const p = [[x0 + nx * w0, y0 + ny * w0], [x1 + nx * w1, y1 + ny * w1], [x1 - nx * w1, y1 - ny * w1], [x0 - nx * w0, y0 - ny * w0]];
    return `<path d="M${p.map(q => f1(q[0]) + ' ' + f1(q[1])).join(' L')} Z" fill="#fff6d8" opacity="${f1(0.13 * op)}"/>` +
      `<path d="M${f1(p[0][0])} ${f1(p[0][1])} L${f1(x1)} ${f1(y1)} L${f1(p[3][0])} ${f1(p[3][1])} Z" fill="#fffbe8" opacity="${f1(0.1 * op)}"/>` + wash(x0, y0, 60, 60, '#fffbe8', f1(0.7 * op));
  }
  // a desk phone (grey, 2000s); o.ring 0..1 shakes it and draws ring lines
  function phone(x, y, s, t, ring) {
    const j = ring > 0 ? Math.sin(t * 60) * 3 * ring : 0;
    let g = `<g transform="translate(${f1(x + j)} ${f1(y)}) scale(${sc(s)})"><path d="M-70 0 L-58 -50 L58 -50 L70 0 Z" fill="#8a8e94" stroke="${INK}" stroke-width="5"/><rect x="-80" y="-76" width="160" height="30" rx="14" fill="#6a6e74" stroke="${INK}" stroke-width="5"/>` +
      [0, 1, 2].map(r_ => [0, 1, 2].map(c => `<rect x="${-30 + c * 22}" y="${-40 + r_ * 12}" width="14" height="8" rx="2" fill="#3a3e44"/>`).join('')).join('');
    if (ring > 0) g += [1, 2].map(i => `<path d="M${-100 - i * 22} ${-70 - i * 10} q -14 26 0 52 M${100 + i * 22} ${-70 - i * 10} q 14 26 0 52" stroke="${YEL}" stroke-width="5" fill="none" opacity="${f1(ring * (0.5 + 0.5 * Math.sin(t * 18 + i)))}"/>`).join('');
    return g + '</g>';
  }
  // a numbered evidence marker (a yellow tent) on the ground; o.glow lights it
  const marker = (x, y, s, glow = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M-40 0 L0 -70 L40 0 Z" fill="#ffd23f" stroke="${INK}" stroke-width="4"/><path d="M-26 -8 L0 -52 L26 -8 Z" fill="#141414" opacity="0.2"/>${glow > 0 ? `<circle r="70" cy="-30" fill="none" stroke="${YEL}" stroke-width="7" opacity="${f1(glow)}"/>` : ''}</g>`;
  // an autumn tree (October in the mid-Atlantic): a trunk and a rounded orange-yellow crown; base at (x, y)
  function autumnTree(x, y, s, col = '#c8742a', col2 = '#e0a030') {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M-16 0 L-10 -240 L10 -240 L16 0 Z" fill="#3a2a1c" stroke="${INK}" stroke-width="3"/>`;
    g += `<ellipse cx="0" cy="-360" rx="150" ry="160" fill="${col}"/><ellipse cx="-70" cy="-300" rx="110" ry="110" fill="${col}"/><ellipse cx="80" cy="-310" rx="110" ry="105" fill="${col2}"/><ellipse cx="20" cy="-420" rx="100" ry="90" fill="${col2}"/>`;
    return g + '</g>';
  }
  // a bare dark tree silhouette for the night tree line; base at (x, y)
  function nightTree(x, y, s, col = '#0a0e14') {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M-14 0 L-10 -200 L-40 -340 M-10 -200 L30 -360 L50 -460 M30 -360 L-10 -450 M-40 -340 L-80 -420 M-10 -200 L10 0 Z" stroke="${col}" stroke-width="18" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-380" rx="150" ry="150" fill="${col}" opacity="0.85"/></g>`;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // an interstate rest area at night (generic): a dark tree line, the highway behind it with passing headlights, a
    // low rest-area building at the left with a lit vending alcove, a sodium lamp at the right, the parking lot in the
    // foreground with painted bays. o.trucks 0..1 parks two generic semis across the back of the lot (the blocked exit);
    // o.police 0..1 adds red/blue flicker on the trees and lot; o.lamp (default 1) the sodium lamp's brightness.
    ds31_rest(ctx, o = {}) {
      const t = ctx.t, r = R(311), tr = o.trucks || 0, po = o.police || 0, lampK = o.lamp ?? 1, HZ = 980;
      let sky = `<defs><linearGradient id="dssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04060c"/><stop offset="0.7" stop-color="#0c1224"/><stop offset="1" stop-color="#2a2238"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#dssky)"/>`;
      for (let i = 0; i < 60; i++) { const sx = -200 + r() * 1500, sy = -150 + r() * 700, tw = 0.5 + 0.5 * Math.sin(t * (1 + r() * 3) + i); sky += `<circle cx="${f1(sx)}" cy="${f1(sy)}" r="${f1(1.2 + r() * 2)}" fill="#fff" opacity="${f1(0.5 * tw)}"/>`; }
      sky += wash(900, HZ - 120, 700, 200, '#ff9a4a', 0.12 * lampK);
      // the tree line, the highway beyond it (headlights pass right to left), an embankment
      let far = `<rect x="-300" y="${HZ - 120}" width="${W + 600}" height="40" fill="#101418"/>`;
      for (let i = 0; i < 3; i++) { const u = ((t * 0.22 + i * 0.37) % 1), x = 1500 - u * 2000; far += `<circle cx="${f1(x)}" cy="${HZ - 104}" r="6" fill="#fff6d0" opacity="0.9"/><circle cx="${f1(x + 26)}" cy="${HZ - 104}" r="6" fill="#fff6d0" opacity="0.9"/>` + wash(x + 60, HZ - 104, 120, 22, '#fff6d0', 0.25); }
      for (let i = 0; i < 2; i++) { const u = ((t * 0.17 + i * 0.5) % 1), x = -500 + u * 2000; far += `<circle cx="${f1(x)}" cy="${HZ - 96}" r="5" fill="#ff3a2a" opacity="0.8"/><circle cx="${f1(x + 22)}" cy="${HZ - 96}" r="5" fill="#ff3a2a" opacity="0.8"/>`; }
      [[-200, 0.9], [60, 0.75], [330, 1.0], [620, 0.8], [900, 0.95], [1180, 0.8], [1400, 0.9]].forEach(([x, s]) => { far += nightTree(x, HZ - 20, s); });
      far += `<path d="M-300 ${HZ - 20} Q 540 ${HZ - 40} ${W + 300} ${HZ - 20} L${W + 300} ${HZ + 60} L-300 ${HZ + 60} Z" fill="#141a1a"/>`;
      if (po > 0) { const ph = (t * 2.4) % 1; far += `<rect x="-300" y="${HZ - 500}" width="${W + 600}" height="560" fill="${ph < 0.5 ? '#ff3a2a' : '#3a6aff'}" opacity="${f1(0.12 * po)}"/>`; }
      // the rest-area building at the left: a low flat-roofed block, a lit alcove with vending machines, a bench
      let bld = `<rect x="-300" y="${HZ - 300}" width="560" height="360" fill="#3a3c40" stroke="${INK}" stroke-width="6"/><rect x="-300" y="${HZ - 330}" width="580" height="36" fill="#50535a" stroke="${INK}" stroke-width="5"/>`;
      bld += `<rect x="-60" y="${HZ - 250}" width="240" height="290" fill="#1a1c22" stroke="${INK}" stroke-width="5"/><rect x="-40" y="${HZ - 230}" width="80" height="200" rx="6" fill="#2a3a6a" stroke="${INK}" stroke-width="4"/><rect x="60" y="${HZ - 230}" width="80" height="200" rx="6" fill="#6a2a2a" stroke="${INK}" stroke-width="4"/>`;
      bld += `<rect x="-30" y="${HZ - 216}" width="60" height="70" fill="#9ad0ff" opacity="0.5"/><rect x="70" y="${HZ - 216}" width="60" height="70" fill="#ffd0a0" opacity="0.5"/>` + wash(60, HZ - 120, 220, 160, '#dfe8ff', 0.35);
      bld += `<rect x="-280" y="${HZ - 200}" width="150" height="120" fill="#141a24" stroke="${INK}" stroke-width="4"/><rect x="-268" y="${HZ - 190}" width="60" height="100" fill="#ffd98a" opacity="0.3"/>`;
      bld += `<rect x="-300" y="${HZ + 40}" width="560" height="22" fill="#2a2a2e"/>`;
      // the semis across the back of the lot (the blocked exit), behind the hero's plane
      let trucks = '';
      if (tr > 0) trucks = `<g opacity="${f1(tr)}">${semi(1120, HZ + 150, 0.42, t, { flip: -1 })}${semi(380, HZ + 180, 0.46, t, { flip: 1 })}</g>`;
      // the sodium lamp at the right, its orange pool across the lot
      const flick = 0.92 + 0.08 * Math.sin(t * 9.1) * Math.sin(t * 2.3);
      let lamp = `<rect x="1020" y="380" width="18" height="${HZ + 130 - 380}" fill="#2a2e36" stroke="${INK}" stroke-width="3"/><path d="M1029 380 L960 380 L960 410 L1000 410" fill="none" stroke="#2a2e36" stroke-width="10"/><ellipse cx="950" cy="420" rx="30" ry="12" fill="#ffb45a" opacity="${f1(flick * lampK)}"/>`;
      lamp += wash(950, 500, 380, 220, '#ff9a4a', f1(0.3 * flick * lampK)) + `<path d="M910 420 L300 ${H + 300} L${W + 300} ${H + 300} L990 420 Z" fill="#ff9a4a" opacity="${f1(0.07 * flick * lampK)}"/>`;
      // the lot: dark asphalt, painted bays, a kerb line, the lamp's pool
      let lot = `<rect x="-300" y="${HZ + 60}" width="${W + 600}" height="${H}" fill="#1e2026"/><rect x="-300" y="${HZ + 60}" width="${W + 600}" height="14" fill="#55585e"/>`;
      for (let i = 0; i < 7; i++) { const a = Math.pow((i + 0.5) / 7, 1.6), y = HZ + 120 + a * 900; lot += `<path d="M${f1(-100 + i * 70)} ${f1(y)} L${f1(-100 + i * 70 + 140 + a * 500)} ${f1(y)}" stroke="#d8c070" stroke-width="${f1(3 + 6 * a)}" opacity="0.35"/>`; }
      lot += wash(820, 1500, 620, 300, '#ff9a4a', f1(0.2 * flick * lampK));
      for (let i = 0; i < 8; i++) lot += `<ellipse cx="${f1(-200 + r() * 1500)}" cy="${f1(1250 + r() * 600)}" rx="${f1(40 + r() * 60)}" ry="${f1(8 + r() * 12)}" fill="#0a0a0c" opacity="0.4"/>`;
      if (po > 0) { const ph = (t * 2.4) % 1; lot += `<rect x="-300" y="${HZ + 60}" width="${W + 600}" height="${H}" fill="${ph < 0.5 ? '#ff3a2a' : '#3a6aff'}" opacity="${f1(0.1 * po)}"/>`; }
      return { light: { dir: 1, rim: '#ffb060', key: '#ffd0a0' }, layers: [[0.05, sky], [0.18, far], [0.4, bld], [0.6, trucks], [0.9, lamp], [1.0, lot]] };
    },

    // a suburban arterial road in October by day (generic, the DC suburbs): autumn trees, a distant overpass, a strip of
    // low shops behind a fence, a wide shoulder in the foreground where a stopped truck stands; o.tape adds police tape.
    ds31_road(ctx, o = {}) {
      const t = ctx.t, r = R(312), HZ = 900;
      let sky = `<defs><linearGradient id="dsrsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8aa6c8"/><stop offset="0.7" stop-color="#c8d4dc"/><stop offset="1" stop-color="#e6e2d4"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#dsrsky)"/>` + wash(600, 300, 500, 200, '#f4f2e8', 0.4);
      [[-100, 240, 300, 40], [500, 180, 340, 50], [900, 300, 260, 36]].forEach(([x, y, w, h], i) => { const dx = ((t * (6 + i * 2) + x + 300) % 1700) - 300; sky += `<ellipse cx="${f1(dx)}" cy="${y}" rx="${w}" ry="${h}" fill="#fff" opacity="0.6"/>`; });
      // far: the overpass, low shops, a fence, a tree line in autumn colour
      let far = `<rect x="-300" y="${HZ - 40}" width="${W + 600}" height="80" fill="#6a7a6a"/>`;
      far += `<rect x="-300" y="${HZ - 260}" width="${W + 600}" height="40" fill="#8a8e94" stroke="${INK}" stroke-width="4"/>` + [-150, 250, 650, 1050].map(x => `<rect x="${x}" y="${HZ - 220}" width="50" height="180" fill="#7a7e84" stroke="${INK}" stroke-width="3"/>`).join('') + `<rect x="-300" y="${HZ - 290}" width="${W + 600}" height="30" fill="#a8acb2"/>`;
      [[-240, 0.8, '#b85a2a', '#d89a30'], [40, 0.95, '#c8742a', '#e0a030'], [360, 0.85, '#a84a2a', '#c87a30'], [700, 1.0, '#c8742a', '#e8b040'], [1000, 0.9, '#b8602a', '#d89a30'], [1300, 0.8, '#c8742a', '#e0a030']].forEach(([x, s, a, b]) => { far += autumnTree(x, HZ - 20, s, a, b); });
      far += `<rect x="-300" y="${HZ - 120}" width="${W + 600}" height="120" fill="#4a5a44" opacity="0.5"/>`;
      // the road: two lanes with a centre line, a kerb, the near shoulder, grass in the foreground
      let road = `<rect x="-300" y="${HZ + 40}" width="${W + 600}" height="300" fill="#5e5c58"/><path d="M-300 ${HZ + 190} L${W + 300} ${HZ + 190}" stroke="#e8c45a" stroke-width="6" stroke-dasharray="80 60"/><path d="M-300 ${HZ + 44} L${W + 300} ${HZ + 44}" stroke="#8a8e94" stroke-width="6"/>`;
      road += `<rect x="-300" y="${HZ + 340}" width="${W + 600}" height="20" fill="#f4f0e4"/><rect x="-300" y="${HZ + 360}" width="${W + 600}" height="420" fill="#7a7872"/>`;
      for (let i = 0; i < 12; i++) road += `<path d="M${f1(-200 + r() * 1500)} ${f1(HZ + 400 + r() * 340)} l ${f1(40 + r() * 90)} ${f1(-6 + r() * 14)}" stroke="#55534e" stroke-width="3" fill="none" opacity="0.6"/>`;
      let ground = `<path d="M-300 ${HZ + 780} Q 540 ${HZ + 760} ${W + 300} ${HZ + 780} L${W + 300} ${H + 300} L-300 ${H + 300} Z" fill="#6a7a3a"/>`;
      for (let i = 0; i < 80; i++) { const x = -260 + r() * 1600, y = HZ + 800 + r() * 500; ground += `<path d="M${f1(x)} ${f1(y)} l -5 -22 M${f1(x)} ${f1(y)} l 6 -20" stroke="#4e6e2a" stroke-width="3"/>`; if (i % 5 === 0) ground += `<ellipse cx="${f1(x)}" cy="${f1(y - 4)}" rx="12" ry="6" fill="${i % 10 ? '#c8742a' : '#e0a030'}"/>`; }
      if (o.tape) ground += `<path d="M-300 1500 Q 540 1480 ${W + 300} 1500" stroke="#ffd23f" stroke-width="14" fill="none"/>` + [0, 1, 2, 3, 4, 5].map(i => `<rect x="${-200 + i * 300}" y="1486" width="90" height="20" fill="#141414" opacity="0.8"/>`).join('');
      return { light: { dir: 1, rim: '#fff0c8', key: '#fff4dc' }, layers: [[0.05, sky], [0.16, far], [0.55, road], [1.0, ground]] };
    },

    // a generic single-storey liquor store exterior at dusk (Alabama, September): a flat roof, a BLANK sign box, a glass
    // door with a lit interior, a barred window, a narrow strip of parking in front, a pole lamp. Nothing names a real
    // business or street. o.police 0..1 adds flicker.
    ds31_store(ctx, o = {}) {
      const t = ctx.t, r = R(313), po = o.police || 0, HZ = 960;
      let sky = `<defs><linearGradient id="dsssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2244"/><stop offset="0.55" stop-color="#5a3a60"/><stop offset="1" stop-color="#d87a4a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#dsssky)"/>`;
      for (let i = 0; i < 25; i++) sky += `<circle cx="${f1(-200 + r() * 1500)}" cy="${f1(-100 + r() * 400)}" r="${f1(1 + r() * 2)}" fill="#fff" opacity="${f1(0.3 + 0.3 * r())}"/>`;
      let far = `<rect x="-300" y="${HZ - 80}" width="${W + 600}" height="120" fill="#1e1a26"/>` + [[-150, 0.7], [1250, 0.8]].map(([x, s]) => nightTree(x, HZ - 60, s, '#161420')).join('');
      // the store: a wide low block, a parapet, the blank sign box, a glass door, a barred window, a pole lamp
      let bld = `<rect x="-200" y="${HZ - 420}" width="1480" height="440" fill="#8a7a6a" stroke="${INK}" stroke-width="6"/><rect x="-200" y="${HZ - 450}" width="1480" height="36" fill="#5a5048" stroke="${INK}" stroke-width="5"/>`;
      for (let yy = HZ - 400; yy < HZ; yy += 40) bld += `<path d="M-200 ${yy} L1280 ${yy}" stroke="#000" stroke-opacity="0.08" stroke-width="3"/>`;
      bld += `<rect x="140" y="${HZ - 400}" width="800" height="120" rx="6" fill="#e8e2d4" stroke="${INK}" stroke-width="5"/><rect x="160" y="${HZ - 384}" width="760" height="88" fill="#ffe9a8" opacity="0.5"/>`;
      bld += `<rect x="440" y="${HZ - 260}" width="200" height="280" fill="#2a3448" stroke="${INK}" stroke-width="6"/><rect x="452" y="${HZ - 248}" width="176" height="256" fill="#ffd98a" opacity="0.45"/><path d="M540 ${HZ - 260} L540 ${HZ + 20}" stroke="${INK}" stroke-width="5"/>` + wash(540, HZ - 40, 300, 200, '#ffe9a8', 0.3);
      bld += `<rect x="720" y="${HZ - 250}" width="260" height="160" fill="#2a3448" stroke="${INK}" stroke-width="5"/><rect x="730" y="${HZ - 240}" width="240" height="140" fill="#ffd98a" opacity="0.25"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${760 + i * 50} ${HZ - 250} L${760 + i * 50} ${HZ - 90}" stroke="#141414" stroke-width="5"/>`).join('');
      bld += `<rect x="-60" y="${HZ - 250}" width="260" height="160" fill="#2a3448" stroke="${INK}" stroke-width="5"/><rect x="-50" y="${HZ - 240}" width="240" height="140" fill="#ffd98a" opacity="0.2"/>`;
      bld += `<rect x="1120" y="${HZ - 640}" width="16" height="660" fill="#2a2e36" stroke="${INK}" stroke-width="3"/><ellipse cx="1128" cy="${HZ - 640}" rx="40" ry="14" fill="#fff4c8"/>` + wash(1128, HZ - 400, 300, 300, '#ffe9a8', 0.22);
      if (po > 0) { const ph = (t * 2.4) % 1; bld += `<rect x="-300" y="${HZ - 460}" width="${W + 600}" height="500" fill="${ph < 0.5 ? '#ff3a2a' : '#3a6aff'}" opacity="${f1(0.12 * po)}"/>`; }
      // the parking strip in front: cracked asphalt, a kerb, a painted line
      let ground = `<rect x="-300" y="${HZ + 20}" width="${W + 600}" height="${H}" fill="#2a2a2e"/><rect x="-300" y="${HZ + 20}" width="${W + 600}" height="16" fill="#6a6e74"/>`;
      for (let i = 0; i < 4; i++) ground += `<path d="M${f1(-100 + i * 360)} ${HZ + 200} L${f1(-100 + i * 360)} ${HZ + 900}" stroke="#d8c070" stroke-width="6" opacity="0.3"/>`;
      for (let i = 0; i < 10; i++) ground += `<path d="M${f1(-200 + r() * 1500)} ${f1(HZ + 120 + r() * 700)} l ${f1(60 + r() * 120)} ${f1(-10 + r() * 30)} l ${f1(30 + r() * 60)} ${f1(20 + r() * 20)}" stroke="#141416" stroke-width="4" fill="none"/>`;
      ground += wash(540, HZ + 300, 500, 220, '#ffe9a8', 0.14);
      if (po > 0) { const ph = (t * 2.4) % 1; ground += `<rect x="-300" y="${HZ + 20}" width="${W + 600}" height="${H}" fill="${ph < 0.5 ? '#ff3a2a' : '#3a6aff'}" opacity="${f1(0.1 * po)}"/>`; }
      return { light: { dir: -1, rim: '#ffd0a0', key: '#ffe6c0' }, layers: [[0.05, sky], [0.2, far], [0.5, bld], [1.0, ground]] };
    }
  });

  // the hero sedan's framing in the first and the last shot (the loop): bottom centre on the lot, big and centred, nose
  // to the left; the REST AREA sign stands at the right, its board below the headline band
  const HERO = { x: 520, y: 1560, k: 0.98 };
  const SIGN = { x: 740, y: 1460, s: 0.72 };

  E.registerScenes({
    // 1 - hook: the sedan at the rest stop at night under the sodium lamp, big and centred from the first frame. The
    //     headline is burned in by the engine (until ~3.2 s), so nothing of ours sits in y 380-720 before that. The trucker
    //     walks in from the right on "rest stop", stops and points at the car on "ended".
    ds31_hook(ctx) {
      const t = ctx.t, snip = WT(ctx, 0, 2, 0.5), rnd = WT(ctx, 0, 6, 1.6), l1 = LS(ctx, 1, 3.6), rest = WT(ctx, 1, 2, 3.9), ended = WT(ctx, 1, 4, 4.6);
      return E.cine.shot(ctx, {
        set: 'ds31_rest', setOpts: {}, grade: 'night',
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 0, y: 70, z: 1.08 }, handheld: 1.2 },
        shake: [{ at: ended, amp: 4 }],
        figures: [{ id: 'ds31_trucker', x: 940, y: 1700, scale: 0.52, dir: -1, turn: 0.5, pose: 'walk', expr: 'focused', depth: 1.02, show: [rest - 0.3],
          walk: { from: 1180, to: 940, at: rest - 0.2, dur: Math.max(0.6, ended - rest + 0.1), cadence: 6.0 },
          keys: [{ at: ended, pose: 'stand_tense', expr: 'realise', gaze: [-0.8, -0.3], dur: 0.35 }, { at: ended + 0.5, pose: 'point', expr: 'worried', gaze: [-0.8, -0.3], dur: 0.5 }] }],
        props: [
          { depth: 1.005, svg: tt => sedan(HERO.x, HERO.y, HERO.k, tt, { flip: -1, sleep: 0.9, sodium: 0.7, glow: 0.8 * seg(tt, ended - 0.1, ended + 0.3) * (1 - seg(tt, ended + 1.2, ended + 1.8)) }) },
          { depth: 1.002, svg: tt => restSign(SIGN.x, SIGN.y, SIGN.s) }
        ],
        overlays: [
          { type: 'label', at: 3.3, x: 60, y: 432, text: 'MYERSVILLE, MARYLAND', fs: 40, sub: 'A rest stop off Interstate 70 · 24 October 2002' }
        ],
        tag: REST
      });
    },

    // 2 - the stakes, said once and plainly, at a briefing (generic press room); nothing of the shootings is shown
    ds31_toll(ctx) {
      const t = ctx.t, ten = WT(ctx, 0, 0, 0.3), kil = WT(ctx, 0, 2, 0.8), three = WT(ctx, 0, 4, 1.3), wnd = WT(ctx, 0, 5, 1.6), md = wnd + 0.5, dc = LE(ctx, 0, 2.6);
      const card = tt => { const k0 = seg(tt, ten - 0.1, ten + 0.3), k1 = seg(tt, three - 0.15, three + 0.25), k2 = seg(tt, md - 0.1, md + 0.3); if (k0 <= 0) return '';
        return `<g opacity="${f1(k0)}">${panel(90, 380, 900, 280, 0.7)}<text x="540" y="478" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="70" fill="#f4efe4">10 KILLED <tspan opacity="${f1(k1)}">· 3 WOUNDED</tspan></text>` +
          `<text x="540" y="552" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" fill="#e8dcc0" opacity="${f1(k2)}">MARYLAND · VIRGINIA · WASHINGTON, DC</text>` +
          `<text x="540" y="620" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="30" fill="#bdb6a8" opacity="${f1(k2)}">2 – 22 October 2002</text></g>`; };
      return E.cine.shot(ctx, {
        set: 'press_room', grade: 'cold', cam: { from: { x: 0, y: -30, z: 1.0 }, to: { x: -20, y: -50, z: 1.07 }, handheld: 0.7 },
        figures: [{ id: 'official', x: 420, y: 1290, scale: 0.7, dir: 1, turn: 0.15, pose: 'stand', expr: 'stern', gaze: [0.1, 0.1],
          keys: [{ at: ten, pose: 'present', expr: 'stern', dur: 0.45 }, { at: kil, pose: 'hands_together', expr: 'neutral', dur: 0.5 }, { at: wnd, pose: 'bowed', dur: 0.6 }, { at: dc, pose: 'stand', expr: 'stern', dur: 0.5 }] }],
        overlays: [
          { type: 'svg', at: ten - 0.1, svg: card },
          { type: 'label', at: 0.1, x: 60, y: 1140, text: 'THREE WEEKS · OCTOBER 2002', fs: 40, sub: 'Shootings at random across the DC area' }
        ],
        tag: TAG
      });
    },

    // 3 - the wrong lead: a white box truck stopped on the shoulder of a suburban road in autumn; an officer walks to its
    //     rear doors on "hunted" and examines on "box truck"; an agent stands by the patrol car
    ds31_truck(ctx) {
      const t = ctx.t, weeks = WT(ctx, 0, 1, 0.3), pol = WT(ctx, 0, 3, 0.8), hunt = WT(ctx, 0, 4, 1.1), white = WT(ctx, 0, 6, 1.7), box = WT(ctx, 0, 7, 2.0), trk = WT(ctx, 0, 8, 2.3);
      return E.cine.shot(ctx, {
        set: 'ds31_road', grade: 'warm', cam: { from: { x: 30, y: 0, z: 1.0 }, to: { x: -30, y: 10, z: 1.06 }, handheld: 1.3 },
        figures: [
          { id: 'ds31_officer', x: 260, y: 1720, scale: 0.56, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', depth: 1.01, walk: { from: 40, to: 260, at: hunt - 0.2, dur: Math.max(0.6, box - hunt + 0.2), cadence: 6.2 },
            keys: [{ at: box, pose: 'examine', expr: 'focused', gaze: [0.8, -0.3], dur: 0.4 }, { at: trk + 0.4, pose: 'stand_tense', expr: 'stern', dur: 0.4 }] },
          { id: 'agent_a', x: 1000, y: 1640, scale: 0.5, dir: -1, turn: 0.5, pose: 'stand', expr: 'focused', depth: 1.0, keys: [{ at: pol, pose: 'point', expr: 'determined', gaze: [-0.8, -0.2], dur: 0.4 }, { at: trk, pose: 'stand', expr: 'stern', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.98, svg: tt => boxTruck(640, 1580, 1.05, tt, { flip: 1, doors: tt > box }) },
          { depth: 0.9, svg: tt => patrolCar(1240, 1440, 0.5, tt, { flip: -1, lights: true }) }
        ],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'THE FIRST LOOKOUT', fs: 40, sub: 'A white box truck or van' },
          { type: 'card', at: white - 0.1, x: 60, y: 600, w: 720, rows: [{ text: 'A WHITE BOX TRUCK', fs: 44, colour: RED }, { text: 'CONFLICTING WITNESS REPORTS', fs: 28, colour: MUTE, at: trk }] }
        ],
        tag: TAG
      });
    },

    // 4 - the irony: the task-force room; the phone rings on "caller" and the analyst answers; the agent turns to the
    //     map on "Montgomery, Alabama" (card). Nothing of the call is quoted.
    ds31_call(ctx) {
      const t = ctx.t, then = WT(ctx, 0, 0, 0.2), tip = WT(ctx, 0, 2, 0.7), caller = WT(ctx, 0, 4, 1.1), claim = WT(ctx, 0, 5, 1.5), snip = WT(ctx, 0, 9, 2.6), l1 = LS(ctx, 1, 3.2), point = WT(ctx, 1, 0, 3.3), liq = WT(ctx, 1, 3, 4.0), mont = WT(ctx, 1, 6, 4.8), ala = WT(ctx, 1, 7, 5.0);
      const ring = tt => seg(tt, then, then + 0.2) * (1 - seg(tt, caller + 0.2, caller + 0.5));
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: {}, grade: 'cold', dust: true,
        cam: { keys: [{ at: 0, x: 20, y: -30, z: 1.04 }, { at: point - 0.2, x: -30, y: -40, z: 1.1, dur: 1.2 }], handheld: 0.8 },
        figures: [
          { id: 'analyst', x: 240, y: 1610, scale: 0.92, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', keys: [...typing(0.05, caller - 0.2), { at: caller, pose: 'sit', expr: 'realise', gaze: [0.4, 0.2], dur: 0.3 }, { at: caller + 0.3, pose: 'sit_read', expr: 'focused', dur: 0.4 }, { at: snip, pose: 'sit', expr: 'realise', gaze: [0.6, -0.2], dur: 0.4 }, { at: liq, pose: 'sit_type', dur: 0.4 }] },
          { id: 'agent_b', x: 860, y: 1740, scale: 0.96, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', keys: [{ at: claim, pose: 'stand', expr: 'stern', gaze: [-0.6, 0.2], dur: 0.5 }, { at: point, pose: 'stand_tense', expr: 'determined', headTurn: 0.4, gaze: [0.6, -0.5], dur: 0.5 }, { at: mont, pose: 'stand', expr: 'focused', dur: 0.4 }] }
        ],
        props: [{ depth: 1.03, svg: tt => phone(520, 1176, 1.0, tt, ring(tt)) }],
        overlays: [
          { type: 'label', at: 0.1, until: point - 0.15, x: 60, y: 432, text: '17 OCTOBER 2002 · THE TIP LINE', fs: 40, sub: 'A caller claims to be the sniper' },
          { type: 'card', at: point - 0.1, x: 60, y: 400, w: 760, rows: [{ text: 'MONTGOMERY, ALABAMA', fs: 44, colour: RED, at: mont - 0.1 }, { text: 'A LIQUOR STORE SHOOTING · 21 SEPT 2002', fs: 28, at: liq - 0.1 }, { text: 'FIRST TREATED AS A ROBBERY', fs: 26, colour: MUTE, at: ala + 0.4 }] }
        ],
        tag: TAG
      });
    },

    // 5 - the fingerprint: the store exterior at dusk, an evidence marker by the door; the officer kneels with a torch on
    //     "fingerprint", the agent walks in and points on "matched"; the match is a card (no print, no document imitated)
    ds31_print(ctx) {
      const t = ctx.t, fp = WT(ctx, 0, 1, 0.3), scene = WT(ctx, 0, 2, 1.0), match = WT(ctx, 0, 3, 1.3), sev = WT(ctx, 0, 5, 1.8), lee = WT(ctx, 0, 6, 2.6), malvo = WT(ctx, 0, 8, 3.2);
      return E.cine.shot(ctx, {
        set: 'ds31_store', setOpts: { police: 0.5 }, grade: 'dawn', police: 0.12,
        cam: { from: { x: -30, y: 30, z: 1.0 }, to: { x: 20, y: 50, z: 1.08 }, handheld: 1.1 },
        shake: [{ at: malvo, amp: 4 }],
        figures: [
          { id: 'ds31_officer', x: 420, y: 1640, scale: 0.78, dir: 1, turn: 0.5, pose: 'torch_low', expr: 'focused', depth: 1.01, gaze: [0.6, 0.5], propOpts: { aim: 40, beamLen: 260 },
            keys: [{ at: fp, pose: 'kneel', expr: 'focused', dur: 0.4 }, { at: match, pose: 'torch', expr: 'realise', gaze: [-0.6, -0.3], headTurn: -0.5, dur: 0.4 }, { at: malvo, pose: 'stand_tense', expr: 'shocked', dur: 0.4 }] },
          { id: 'agent_a', x: 880, y: 1580, scale: 0.62, dir: -1, turn: 0.5, pose: 'walk', expr: 'focused', depth: 1.0, show: [scene - 0.3], walk: { from: 1200, to: 880, at: scene - 0.2, dur: Math.max(0.6, match - scene + 0.3), cadence: 6.2 },
            keys: [{ at: match + 0.1, pose: 'point', expr: 'determined', gaze: [-0.8, 0.2], dur: 0.4 }, { at: malvo, pose: 'stand', expr: 'stern', dur: 0.4 }] }
        ],
        props: [{ depth: 1.004, svg: tt => marker(640, 1620, 1.0, 0.8 * seg(tt, fp - 0.1, fp + 0.3) * (1 - seg(tt, match, match + 0.5))) }],
        overlays: [
          { type: 'label', at: 0.1, until: match - 0.1, x: 60, y: 432, text: 'MONTGOMERY, ALABAMA', fs: 40, sub: 'Evidence from the September scene' },
          { type: 'card', at: match - 0.1, x: 60, y: 390, w: 760, rows: [{ text: 'A FINGERPRINT · FBI DATABASE MATCH', fs: 32, colour: RED }, { text: 'LEE BOYD MALVO · 17', fs: 48, at: lee - 0.1 }, { text: 'PRINTS ON FILE FROM A WASHINGTON STATE ARREST', fs: 22, colour: MUTE, at: malvo + 0.4 }] }
        ],
        tag: TAG
      });
    },

    // 6 - the car: an office by day; the analyst types on "led to", the agent points at the card on "Caprice"
    ds31_car(ctx) {
      const t = ctx.t, mal = WT(ctx, 0, 0, 0.2), led = WT(ctx, 0, 1, 0.5), john = WT(ctx, 0, 3, 1.0), muh = WT(ctx, 0, 5, 1.6), blue = WT(ctx, 0, 8, 2.6), chev = WT(ctx, 0, 10, 3.1), cap = WT(ctx, 0, 11, 3.5);
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'cold', cam: { from: { x: -20, y: -20, z: 1.0 }, to: { x: 20, y: -40, z: 1.08 }, handheld: 0.7 },
        figures: [
          { id: 'analyst', x: 300, y: 1720, scale: 0.8, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', keys: [...typing(led - 0.1, muh), { at: muh, pose: 'sit', expr: 'realise', gaze: [0.5, -0.2], dur: 0.4 }, { at: blue, pose: 'point', expr: 'determined', gaze: [0.8, -0.3], dur: 0.4 }] },
          { id: 'agent_a', x: 840, y: 1800, scale: 0.9, dir: -1, turn: 0.45, pose: 'stand', expr: 'focused', keys: [{ at: john, pose: 'stand_tense', expr: 'stern', gaze: [-0.6, 0.2], dur: 0.4 }, { at: chev, pose: 'point', expr: 'determined', headTurn: 0.3, gaze: [0.5, -0.5], dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: '22 OCTOBER 2002 · A RECORDS SEARCH', fs: 40, sub: 'Malvo’s file leads to a second name' },
          { type: 'card', at: john - 0.1, x: 60, y: 600, w: 760, rows: [{ text: 'JOHN ALLEN MUHAMMAD', fs: 44, colour: RED }, { text: 'A BLUE 1990 CHEVROLET CAPRICE', fs: 32, at: blue - 0.1 }, { text: 'REGISTERED IN NEW JERSEY', fs: 28, colour: MUTE, at: cap + 0.2 }] }
        ],
        tag: TAG
      });
    },

    // 7 - THE HOW: the rest stop at night; the sedan at the near left with two dark shapes asleep inside; the trucker stands
    //     by the lot with the phone to his face on "trucker"; semis slide across the back on "rest stop"; the police flicker
    //     and two officers walk in with torches on "Both men"; the arrest is a card only. Music drop on this scene.
    ds31_rest(ctx) {
      const t = ctx.t, pol = WT(ctx, 0, 0, 0.2), bro = WT(ctx, 0, 1, 0.5), plate = WT(ctx, 0, 3, 1.2), hours = WT(ctx, 0, 4, 1.7), trk = WT(ctx, 0, 7, 2.4), saw = WT(ctx, 0, 8, 2.8), car = WT(ctx, 0, 10, 3.3), rest = WT(ctx, 0, 13, 4.2), l1 = LS(ctx, 1, 5.4), both = WT(ctx, 1, 0, 5.5), asleep = WT(ctx, 1, 3, 6.3);
      const B = { x: 440, y: 1600, k: 1.12 };
      return E.cine.shot(ctx, {
        set: 'ds31_rest', setOpts: { trucks: seg(t, rest - 0.4, rest + 0.4), police: 0.7 * seg(t, l1 - 0.3, l1 + 0.5) }, grade: 'night', police: 0.2 * seg(t, l1 - 0.3, l1 + 0.5),
        cam: { keys: [{ at: 0, x: 0, y: 50, z: 1.08 }, { at: hours, x: -30, y: 70, z: 1.16, dur: 1.4 }, { at: both - 0.2, x: 10, y: 60, z: 1.1, dur: 0.8 }], handheld: 1.6 },
        shake: [{ at: saw, amp: 4 }, { at: asleep, amp: 5 }],
        figures: [
          { id: 'ds31_trucker', x: 870, y: 1700, scale: 0.72, dir: -1, turn: 0.5, pose: 'stand', expr: 'focused', depth: 1.02, gaze: [-0.8, -0.2], show: [hours - 0.2],
            keys: [{ at: trk - 0.1, pose: 'hand_to_face', expr: 'worried', gaze: [-0.8, -0.2], dur: 0.4 }, { at: saw, pose: 'point', expr: 'realise', gaze: [-0.9, -0.2], dur: 0.4 }, { at: rest, pose: 'hand_to_face', expr: 'worried', dur: 0.4 }, { at: both, pose: 'stand_tense', expr: 'relieved', gaze: [-0.5, 0], dur: 0.5 }] },
          { id: 'ds31_officer', x: 700, y: 1760, scale: 0.6, dir: -1, turn: 0.5, pose: 'walk', expr: 'focused', depth: 1.03, show: [both - 0.3], walk: { from: 1240, to: 700, at: both - 0.2, dur: Math.max(0.7, asleep - both + 0.4), cadence: 7.0, stride: 30 }, propOpts: { aim: 160, beamLen: 320 },
            keys: [{ at: asleep + 0.3, pose: 'torch', expr: 'stern', dur: 0.4 }] },
          { id: 'agent_a', x: 1040, y: 1560, scale: 0.5, dir: -1, turn: 0.5, pose: 'walk', expr: 'focused', depth: 1.01, show: [both - 0.1], walk: { from: 1300, to: 1040, at: both, dur: Math.max(0.6, asleep - both + 0.3), cadence: 7.0, stride: 30 },
            keys: [{ at: asleep + 0.4, pose: 'stand_tense', expr: 'stern', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.005, svg: tt => sedan(B.x, B.y, B.k, tt, { flip: -1, sleep: 0.6 + 0.4 * seg(tt, both - 0.2, both + 0.3), sodium: 0.75, glow: 0.8 * seg(tt, saw - 0.1, saw + 0.3) * (1 - seg(tt, saw + 1.2, saw + 1.8)) }) },
          { depth: 1.025, svg: tt => beam(700 - 20, 1760 - 300, 420, 1480, 14, 180, seg(tt, asleep + 0.3, asleep + 0.6)) }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: hours - 0.1, x: 60, y: 432, text: '23 OCTOBER · NIGHT', fs: 40, sub: 'The car and its plate go out on radio and TV' },
          { type: 'card', at: hours, until: l1 - 0.1, x: 60, y: 390, w: 720, rows: [{ text: 'MYERSVILLE, MARYLAND · ABOUT 1 A.M.', fs: 30, colour: RED }, { text: 'A TRUCKER CALLS 911', fs: 40, at: saw - 0.1 }, { text: 'TRUCKS BLOCK THE EXIT', fs: 28, colour: MUTE, at: rest - 0.1 }] },
          { type: 'card', at: both - 0.1, x: 60, y: 390, w: 760, rows: [{ text: '24 OCTOBER 2002 · BEFORE DAWN', fs: 26, colour: MUTE }, { text: 'BOTH ASLEEP · ARRESTED', fs: 48, colour: RED, at: asleep - 0.05 }, { text: 'WITHOUT INCIDENT', fs: 30, at: asleep + 0.4 }, { text: 'THE TRUNK HAD BEEN MODIFIED', fs: 26, colour: MUTE, at: asleep + 0.9 }] }
        ],
        tag: LIKENESS
      });
    },

    // 8 - the outcome: a modern courtroom; the judge's gavel on "executed"; the two silhouettes stand in the well
    ds31_verdict(ctx) {
      const muh = WT(ctx, 0, 0, 0.2), exe = WT(ctx, 0, 2, 0.6), yr = WT(ctx, 0, 4, 1.4), l1 = LS(ctx, 1, 2.7), mal = WT(ctx, 1, 0, 2.8), life = WT(ctx, 1, 3, 3.6);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.1 }, handheld: 0.5 },
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.33, keys: [{ at: exe - 0.3, pose: 'gavel', dur: 0.3 }, { at: exe + 0.15, pose: 'sit', dur: 0.15 }, { at: l1, pose: 'sit_read', dur: 0.5 }] },
          { id: 'ds31_muhammad', x: 820, y: 1770, scale: 0.96, dir: -1, turn: 0.15, pose: 'stand', silhouette: 'cool', keys: [{ at: muh, pose: 'hands_together', dur: 0.4 }, { at: exe, pose: 'bowed', dur: 0.6 }] },
          { id: 'ds31_malvo', x: 280, y: 1760, scale: 0.92, dir: 1, turn: 0.15, pose: 'stand', silhouette: 'cool', keys: [{ at: mal, pose: 'hands_behind', dur: 0.4 }, { at: life, pose: 'bowed', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'card', at: 0.15, x: 40, y: 920, w: 760, rows: [{ text: 'MUHAMMAD · CONVICTED 2003 · EXECUTED 2009', fs: 28, colour: RED, at: exe - 0.05 }, { text: 'MALVO, 17 · LIFE SENTENCES', fs: 36, at: mal - 0.05 }, { text: 'RESENTENCING FIGHTS CONTINUE (2026)', fs: 24, colour: MUTE, at: life + 0.3 }] }
        ],
        tag: LIKENESS
      });
    },

    // 9 - callback on the hero object (the first frame's framing): the sedan at the rest stop under the sodium lamp, the
    //     trucker standing by it. The memorial card sits at y 770-990 (outside the end-question band); the engine burns the
    //     end question over the last 3.2 s at y 520, so nothing of ours sits in y 380-720; the last frame loops to the first.
    ds31_end(ctx) {
      const t = ctx.t, rest = WT(ctx, 0, 1, 0.3), ended = WT(ctx, 0, 3, 0.9), att = WT(ctx, 0, 7, 1.9), l1 = LS(ctx, 1, 3.0), rem = WT(ctx, 1, 1, 3.2);
      const names = tt => { const k = seg(tt, l1 - 0.2, l1 + 0.3); if (k <= 0) return '';
        return `<g opacity="${f1(k)}">${panel(90, 770, 900, 210, 0.66)}<text x="540" y="830" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="28" fill="#e8dcc0">IN MEMORY OF</text>` +
          `<text x="540" y="892" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="40" fill="#f4efe4">THE TEN WHO DIED</text>` +
          `<text x="540" y="948" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="24" fill="#bdb6a8">Maryland · Virginia · Washington, DC · October 2002</text></g>`; };
      return E.cine.shot(ctx, {
        set: 'ds31_rest', setOpts: {}, grade: 'night',
        cam: { from: { x: 0, y: 70, z: 1.08 }, to: { x: 0, y: 40, z: 1.0 }, handheld: 0.6 },
        figures: [{ id: 'ds31_trucker', x: 940, y: 1700, scale: 0.52, dir: -1, turn: 0.5, pose: 'stand_tense', expr: 'worried', depth: 1.02, gaze: [-0.8, -0.3],
          keys: [{ at: rest - 0.1, pose: 'point', expr: 'focused', dur: 0.4 }, { at: att, pose: 'stand', expr: 'neutral', dur: 0.4 }, { at: l1 + 0.1, pose: 'hands_together', expr: 'sad', gaze: [-0.2, 0.3], dur: 0.6 }] }],
        props: [
          { depth: 1.005, svg: tt => sedan(HERO.x, HERO.y, HERO.k, tt, { flip: -1, sleep: 0.9, sodium: 0.7, glow: 0.8 * seg(tt, rest - 0.2, rest + 0.2) * (1 - seg(tt, ended + 0.6, ended + 1.2)) }) },
          { depth: 1.002, svg: tt => restSign(SIGN.x, SIGN.y, SIGN.s) }
        ],
        overlays: [{ type: 'svg', at: l1 - 0.2, svg: names }],
        tag: REST
      });
    }
  });
})();
