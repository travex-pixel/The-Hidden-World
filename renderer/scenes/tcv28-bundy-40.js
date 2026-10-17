/* Case File 28 (cinematic, 40-second cut): Ted Bundy, and the ordinary police work that kept catching him.
   CLOSED: convicted in Florida (July 1979, February 1980), executed 24 January 1989.
   Structure (short40 + the Case File 25 rules): a burned-in hook headline (contradiction + object) over the HERO OBJECT, a
   generic tan Beetle-shaped car seen from behind at night, headlights off, a patrol flashlight finding its blank licence
   plate; big and centred in the first frame and again in the last (the video loops). A stakes number by 0:10 (he later
   confessed to 30 murders, per Britannica); fast clue beats (Utah 1975: no headlights, the chase, what was inside; the
   Aspen courthouse window and the stolen-car stop six days later; the jail ceiling; the FBI's Ten Most Wanted); the HOW
   (Pensacola: a plate check comes back stolen) at about 60%; the outcome in one line; the callback; the memorial; a
   burned-in end question (episode.end_title) over the last 3.2 s. No nextcase card.
   Content rules:
   - The episode is about the police work, not his crimes. No victim is named or depicted; no violence, weapon, injury or
     crime scene appears anywhere. The items found in 1975 and the 1978 struggle are typed lines only, never drawn.
   - Bundy appears ONLY as an anonymous rim-lit silhouette (characters/figures/tb28_bundy.json) or a dark head shape through
     a car's rear window: no face, no likeness, never his mugshots or courtroom images, never posed heroically or
     'charming'. Every shot he is in is tagged 'ILLUSTRATION · NOT A LIKENESS'. Officers are generic and are not named.
   - No brand or real material: the cars are generic Beetle-shaped drawings with no badge, crest or lettering, and their
     plates are blank (masked marks, never a real number); the patrol cars carry no text or crest; the courthouse, jail,
     gas station and streets are generic; every card is the series' own typed graphic.
   New environments (E.registerSets): tb28_street (a suburban street at night seen from behind a stopped car; o.fl = the
   Florida variant with palms), tb28_station (a closed-down 1970s gas station at night, side view), tb28_colorado (o.view
   'library' = a courthouse law library with an open window onto the mountains; o.view 'cell' = a small county jail cell
   with an opening in its ceiling). Plus the shared task_force and courtroom sets.
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
  const YEL = '#ffd23f', RED = '#8e1f18', MUTE = '#6b665c';
  const TAN = { body: '#c9a66c', shade: '#9c7c48', dark: '#6e5532', light: '#e6cc96' };
  const ORANGE = { body: '#d4782e', shade: '#a65a20', dark: '#743c14', light: '#eea05a' };
  const typing = (from, to, a = 'sit_type', b = 'sit_type_b', step = 0.24) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? b : a, dur: step * 0.8 }); return k; };

  // ---------- THE HERO: a generic Beetle-shaped car seen from behind (no badge, no lettering), bottom centre (x, y) on the
  // ground; ~940 x 720 at s = 1. o.col = TAN | ORANGE; o.driver = a dark, anonymous head shape through the rear window;
  // o.spot 0..1 = a flashlight's pool of light on the plate; o.glow 0..1 = a yellow ring round the plate; o.brake.
  function beetleRear(x, y, s, t, o = {}) {
    const C = o.col || TAN;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="8" rx="500" ry="42" fill="#000" opacity="0.5"/>`;
    // tyres under the fenders
    [-1, 1].forEach(d => { g += `<rect x="${d < 0 ? -420 : 310}" y="-150" width="110" height="150" rx="26" fill="#0c0c0e" stroke="${INK}" stroke-width="6"/>`; });
    g += `<rect x="-330" y="-140" width="660" height="60" fill="#0e0d0c"/>`;
    // the domed body: engine lid below, roof above
    g += `<path d="M-336 -120 L-340 -330 Q-338 -560 -200 -650 Q0 -728 200 -650 Q338 -560 340 -330 L336 -120 Z" fill="${C.body}" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M-336 -120 L-340 -330 Q-338 -560 -200 -650 Q-250 -560 -268 -330 L-270 -120 Z" fill="${C.shade}" opacity="0.6"/><path d="M200 -650 Q338 -560 340 -330 L336 -120 L300 -120 L298 -330 Q290 -540 200 -650 Z" fill="${C.light}" opacity="0.35"/>`;
    g += `<path d="M-120 -690 Q0 -716 120 -690" stroke="${C.light}" stroke-width="10" fill="none" opacity="0.6" stroke-linecap="round"/>`;
    // the small rear window (dark glass), a faint reflection; the anonymous head shape
    g += `<path d="M-178 -566 Q0 -626 178 -566 L156 -470 Q0 -452 -156 -470 Z" fill="#141c26" stroke="${INK}" stroke-width="6"/>`;
    if (o.driver) g += `<path d="M-130 -470 Q-62 -520 6 -470 Z" fill="#05070a"/><ellipse cx="-62" cy="-528" rx="34" ry="40" fill="#05070a"/>`;
    g += `<path d="M60 -600 L100 -600 L70 -472 L40 -472 Z" fill="#d6e8f8" opacity="0.12"/>`;
    // the engine lid with its cooling louvres (no badge, no lettering)
    g += `<path d="M-168 -440 Q0 -468 168 -440 L186 -196 Q0 -176 -186 -196 Z" fill="${C.light}" opacity="0.28" stroke="${C.dark}" stroke-width="4"/>`;
    [-1, 1].forEach(d => { for (let i = 0; i < 4; i++) g += `<rect x="${d < 0 ? -122 : 42}" y="${-426 + i * 18}" width="80" height="8" rx="4" fill="${C.dark}"/>`; });
    // the rear fenders bulging out over the wheels, with tall tail lights on top
    [-1, 1].forEach(d => {
      g += `<path d="M${d * 470} -120 Q${d * 486} -300 ${d * 360} -372 Q${d * 300} -392 ${d * 262} -340 L${d * 262} -120 Z" fill="${C.body}" stroke="${INK}" stroke-width="7"/>`;
      g += `<path d="M${d * 470} -120 Q${d * 480} -250 ${d * 420} -320" stroke="${d < 0 ? C.shade : C.light}" stroke-width="12" fill="none" opacity="0.6"/>`;
      g += `<ellipse cx="${d * 372}" cy="-372" rx="30" ry="50" fill="${o.brake ? '#ff3a2a' : '#a8241c'}" stroke="#d7dde2" stroke-width="5"/><ellipse cx="${d * 372}" cy="-390" rx="12" ry="18" fill="#fff" opacity="0.25"/>`;
      if (o.brake) g += wash(d * 372, -372, 90, 110, '#ff4a2a', 0.45);
    });
    // the chrome bumper blade with two overriders; twin exhaust tips
    g += `<path d="M-490 -130 L490 -130 Q500 -150 490 -168 L-490 -168 Q-500 -150 -490 -130 Z" fill="#c9d0d6" stroke="${INK}" stroke-width="6"/><path d="M-484 -160 L484 -160" stroke="#fff" stroke-width="4" opacity="0.7"/>`;
    [-1, 1].forEach(d => { g += `<rect x="${d * 230 - 14}" y="-212" width="28" height="96" rx="12" fill="#c9d0d6" stroke="${INK}" stroke-width="4"/>`; });
    [-1, 1].forEach(d => { g += `<rect x="${d * 140 - 16}" y="-118" width="32" height="40" rx="8" fill="#5a5e64" stroke="${INK}" stroke-width="4"/><ellipse cx="${d * 140}" cy="-80" rx="12" ry="6" fill="#111"/>`; });
    // THE PLATE: blank, with masked marks only (never a real number); the plate lamp hood above it
    const k = o.glow || 0, sp = o.spot || 0;
    g += `<path d="M-46 -318 Q0 -340 46 -318 L40 -300 L-40 -300 Z" fill="#c9d0d6" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-104" y="-300" width="208" height="104" rx="8" fill="#e8e2cc" stroke="${INK}" stroke-width="5"/><rect x="-96" y="-292" width="192" height="16" fill="#3a5a8a" opacity="0.7"/>`;
    for (let i = 0; i < 6; i++) g += `<rect x="${-80 + i * 28}" y="-266" width="18" height="44" rx="3" fill="#2a2e36" opacity="0.75"/>`;
    if (sp > 0) g += wash(0, -248, 230, 150, '#fff6d8', f1(0.55 * sp)) + `<ellipse cx="0" cy="-248" rx="170" ry="110" fill="#fff6d8" opacity="${f1(0.18 * sp)}"/>`;
    if (k > 0) g += `<rect x="-120" y="-316" width="240" height="136" rx="14" fill="none" stroke="${YEL}" stroke-width="9" opacity="${f1(k * (0.75 + 0.25 * Math.sin(t * 7)))}"/>`;
    return g + '</g>';
  }
  // a generic Beetle-shaped car in profile (front to the right; o.flip = -1 faces left); bottom centre (x, y); ~900 long at k = 1.
  // o.lights = false: headlights OFF (a dark lamp, no beam). o.driver = an anonymous head shape. o.roll = wheel rotation.
  function beetleSide(x, y, k, t, o = {}) {
    const C = o.col || TAN, fl = o.flip || 1;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k * fl)} ${sc(k)})"><ellipse cx="0" cy="6" rx="470" ry="24" fill="#000" opacity="0.45"/>`;
    g += `<path d="M-440 -90 Q-456 -210 -380 -262 Q-300 -410 -110 -436 Q50 -446 150 -386 Q220 -330 270 -258 Q420 -238 446 -170 L446 -90 Z" fill="${C.body}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-250 -268 Q-190 -386 -66 -402 L50 -402 Q118 -384 172 -300 L176 -268 Z" fill="#141c26" stroke="${INK}" stroke-width="5"/><path d="M-40 -402 L-40 -268" stroke="${C.body}" stroke-width="12"/>`;
    if (o.driver) g += `<ellipse cx="60" cy="-330" rx="28" ry="34" fill="#05070a"/>`;
    g += `<path d="M-200 -276 L-150 -276 L-100 -380 L-130 -380 Z" fill="#d6e8f8" opacity="0.1"/>`;
    g += `<path d="M-40 -262 L-40 -110 M176 -262 L190 -110" stroke="${C.dark}" stroke-width="4" opacity="0.7"/><rect x="120" y="-210" width="36" height="8" rx="4" fill="#c9d0d6"/>`;
    // fenders over the wheels, running board between them
    g += `<path d="M-438 -70 Q-440 -236 -270 -248 Q-140 -238 -124 -70 Z" fill="${C.shade}" stroke="${INK}" stroke-width="6"/><path d="M150 -70 Q156 -240 296 -250 Q436 -236 446 -70 Z" fill="${C.shade}" stroke="${INK}" stroke-width="6"/>`;
    g += `<rect x="-130" y="-92" width="286" height="20" rx="6" fill="#2a2a2e" stroke="${INK}" stroke-width="4"/>`;
    // headlamp on the front fender: OFF unless o.lights; tail lamp on the rear fender
    const on = o.lights === true;
    g += `<ellipse cx="404" cy="-196" rx="22" ry="30" fill="${on ? '#fff6d0' : '#3a3c40'}" stroke="#c9d0d6" stroke-width="5"/>`;
    if (on) g += `<path d="M420 -206 L820 -250 L820 -120 L420 -186 Z" fill="#fff6d0" opacity="0.14"/>`;
    g += `<ellipse cx="-412" cy="-200" rx="14" ry="24" fill="${o.brake ? '#ff3a2a' : '#a8241c'}" stroke="#d7dde2" stroke-width="3"/>`;
    if (o.brake) g += wash(-420, -200, 60, 50, '#ff4a2a', 0.5);
    g += `<rect x="-466" y="-110" width="30" height="16" rx="5" fill="#c9d0d6" stroke="${INK}" stroke-width="3"/><rect x="438" y="-110" width="30" height="16" rx="5" fill="#c9d0d6" stroke="${INK}" stroke-width="3"/>`;
    [-276, 296].forEach(cx => { g += `<circle cx="${cx}" cy="-4" r="66" fill="#0b0b0d" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-4" r="32" fill="#c9d0d6" stroke="${INK}" stroke-width="4"/><path d="M${cx - 20} -4 L${cx + 20} -4 M${cx} -24 L${cx} 16" stroke="#7d868e" stroke-width="4" transform="rotate(${f1((o.roll || 0) * 57)} ${cx} -4)"/>`; });
    return g + '</g>';
  }
  // a generic 1970s patrol sedan in profile (front to the right): long, plain white with a dark stripe, a single rotating
  // roof beacon. No text, crest or number. o.headlights = beams forward; o.doorOpen.
  function patrol70(x, y, k, t, o = {}) {
    const ph = (t * 2.2) % 1, on = o.beacon !== false;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><ellipse cx="0" cy="6" rx="520" ry="24" fill="#000" opacity="0.45"/>`;
    g += `<path d="M-500 -48 L-504 -126 Q-498 -140 -470 -144 L-250 -150 L-170 -240 Q-156 -250 -130 -250 L120 -250 Q144 -250 158 -238 L250 -152 L470 -144 Q502 -138 506 -112 L506 -48 Z" fill="#e9edf1" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-502 -112 L506 -108 L506 -92 L-502 -96 Z" fill="#26304a"/><path d="M-160 -234 L-30 -234 L-30 -160 L-236 -160 Z M-16 -234 L126 -234 L216 -160 L-16 -160 Z" fill="#141a24"/>`;
    g += `<rect x="-26" y="-270" width="52" height="20" rx="4" fill="#20242c" stroke="${INK}" stroke-width="3"/><path d="M-20 -270 Q0 -306 20 -270 Z" fill="${on ? (ph < 0.5 ? '#ff3a2a' : '#c02018') : '#5a1a18'}" stroke="${INK}" stroke-width="3"/>`;
    if (on) g += wash(0, -284, 180, 80, '#ff3a2a', f1(0.35 + 0.35 * Math.abs(Math.sin(ph * Math.PI))));
    g += `<rect x="490" y="-138" width="16" height="24" fill="#fff6d0"/>` + (o.headlights ? `<path d="M506 -130 L880 -170 L880 -60 L506 -114 Z" fill="#fff6d0" opacity="0.13"/>` : '');
    [-320, 330].forEach(cx => { g += `<path d="M${cx - 74} -48 A74 74 0 0 1 ${cx + 74} -48 Z" fill="#141210"/><circle cx="${cx}" cy="-4" r="56" fill="#0b0b0d" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-4" r="24" fill="#8a9098"/>`; });
    if (o.doorOpen) g += `<path d="M-30 -160 L-30 -50 L-120 -42 L-130 -152 Z" fill="#dfe4e8" stroke="${INK}" stroke-width="5"/>`;
    return g + '</g>';
  }
  const palm = (x, y, h, sway, col = '#0c1418') => { let g = `<path d="M${x} ${y} Q${x + 18} ${y - h * 0.5} ${f1(x + sway)} ${y - h}" stroke="${col}" stroke-width="${f1(h * 0.05)}" fill="none" stroke-linecap="round"/>`; const tx = x + sway, ty = y - h;
    [-150, -110, -60, -20, 20, 60, 110, 150].forEach(a => { const r_ = h * 0.34, ax = tx + Math.sin(a * Math.PI / 180) * r_, ay = ty - Math.cos(a * Math.PI / 180) * r_ * 0.55 + r_ * 0.25; g += `<path d="M${f1(tx)} ${f1(ty)} Q${f1((tx + ax) / 2)} ${f1(Math.min(ty, ay) - r_ * 0.2)} ${f1(ax)} ${f1(ay)}" stroke="${col}" stroke-width="${f1(h * 0.022)}" fill="none" stroke-linecap="round"/>`; }); return g; };

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a suburban street at night, seen from behind a stopped car: the road runs away to a vanishing point; low houses with
    // a few lit windows, streetlamps, power poles. Utah: the mountain range under the stars. o.fl (Florida): palms, a warm
    // humid haze, sodium light.
    tb28_street(ctx, o = {}) {
      const t = ctx.t, r = R(281), fl = !!o.fl, HZ = 930, VX = 540, BY = H + 300;
      let sky = `<defs><linearGradient id="tbsky${fl ? 'f' : 'u'}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${fl ? '#0e1222' : '#070b1a'}"/><stop offset="0.7" stop-color="${fl ? '#2a2638' : '#141c34'}"/><stop offset="1" stop-color="${fl ? '#5a3a3a' : '#22304a'}"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#tbsky${fl ? 'f' : 'u'})"/>`;
      for (let i = 0; i < 70; i++) { const sx = -200 + r() * 1500, sy = -100 + r() * 760, tw = 0.5 + 0.5 * Math.sin(t * (1 + r() * 3) + i); sky += `<circle cx="${f1(sx)}" cy="${f1(sy)}" r="${f1(1.5 + r() * 2.2)}" fill="#fff" opacity="${f1((fl ? 0.25 : 0.55) * tw)}"/>`; }
      if (!fl) {   // the mountain range on the horizon, a moonlit edge
        sky += `<path d="M-300 ${HZ} L-200 760 L-80 820 L60 690 L200 780 L330 660 L470 760 L600 700 L760 800 L900 680 L1060 770 L1200 720 L1380 820 L1380 ${HZ} Z" fill="#1a2238" stroke="#3a4a6a" stroke-width="3"/>`;
        sky += `<path d="M60 690 L100 716 L130 706 M330 660 L372 690 L400 684 M900 680 L940 708 L972 700" stroke="#9aaccc" stroke-width="5" fill="none" opacity="0.6"/>`;
      } else sky += wash(540, HZ - 60, 900, 220, '#ff9a5a', 0.16);
      // houses either side, lit windows, roofs; power poles
      let far = `<rect x="-300" y="${HZ - 6}" width="${W + 600}" height="40" fill="${fl ? '#141818' : '#121622'}"/>`;
      const house = (x, y, w, h, lit) => `<path d="M${x} ${y} L${x} ${y - h} L${x + w / 2} ${y - h - h * 0.45} L${x + w} ${y - h} L${x + w} ${y} Z" fill="${fl ? '#1e2422' : '#1a1e2a'}" stroke="${INK}" stroke-width="4"/>` +
        `<rect x="${x + w * 0.18}" y="${y - h * 0.72}" width="${w * 0.22}" height="${h * 0.38}" fill="${lit ? '#f2c66a' : '#0e1018'}" opacity="0.9"/><rect x="${x + w * 0.6}" y="${y - h * 0.72}" width="${w * 0.22}" height="${h * 0.38}" fill="${lit === 2 ? '#f2c66a' : '#0e1018'}" opacity="0.85"/>` +
        (lit ? wash(x + w * 0.3, y - h * 0.5, w * 0.4, h * 0.4, '#f2c66a', 0.12) : '');
      [[-260, 1010, 300, 170, 1], [20, 970, 220, 120, 0], [230, 948, 140, 78, 2], [360, 938, 90, 48, 0]].forEach(([x, y, w, h, l]) => { far += house(x, y, w, h, l); });
      [[1040, 1010, 300, 170, 2], [820, 970, 220, 120, 1], [690, 948, 140, 78, 0], [610, 938, 90, 48, 1]].forEach(([x, y, w, h, l]) => { far += house(x, y, w, h, l); });
      if (fl) [[-140, 1010, 420, 30], [180, 960, 260, -20], [940, 1010, 440, -26], [760, 962, 250, 14]].forEach(([x, y, h, sw]) => { far += palm(x, y, h, sw + 8 * Math.sin(t * 0.8 + x)); });
      // the road in perspective, kerbs, a dashed centre line, a pool of lamp light
      const at = (xb, y) => VX + (xb - VX) * (y - HZ) / (BY - HZ);
      let road = `<path d="M${VX - 30} ${HZ} L${VX + 30} ${HZ} L${at(2600, BY)} ${BY} L${at(-1520, BY)} ${BY} Z" fill="${fl ? '#24262a' : '#1e2128'}"/>`;
      road += `<path d="M-300 ${HZ + 20} L${VX - 30} ${HZ} L${at(-1520, BY)} ${BY} L-300 ${BY} Z" fill="${fl ? '#1a2018' : '#161a20'}"/><path d="M${W + 300} ${HZ + 20} L${VX + 30} ${HZ} L${at(2600, BY)} ${BY} L${W + 300} ${BY} Z" fill="${fl ? '#1a2018' : '#161a20'}"/>`;
      road += `<path d="M${VX - 30} ${HZ} L${at(-1520, BY)} ${BY}" stroke="#5a5e66" stroke-width="10"/><path d="M${VX + 30} ${HZ} L${at(2600, BY)} ${BY}" stroke="#5a5e66" stroke-width="10"/>`;
      for (let i = 0; i < 12; i++) { const a = Math.pow(i / 12, 2.1), b = Math.pow((i + 0.45) / 12, 2.1); const y1 = HZ + a * (BY - HZ), y2 = HZ + b * (BY - HZ); road += `<line x1="${f1(at(VX, y1))}" y1="${f1(y1)}" x2="${f1(at(VX, y2))}" y2="${f1(y2)}" stroke="${fl ? '#d8c48a' : '#c9c4a8'}" stroke-width="${f1(2 + 26 * a)}" opacity="0.7"/>`; }
      road += wash(540, 1280, 700, 260, fl ? '#ffb060' : '#ffe6a8', fl ? 0.16 : 0.12);
      // streetlamps (sodium in Florida) and power poles
      let mid = '';
      [[90, 1150, 0.9], [990, 1150, 0.9], [330, 990, 0.45], [760, 990, 0.45]].forEach(([x, y, k], i) => { const h = 620 * k, d = x < 540 ? 1 : -1, col = fl ? '#ffb45a' : '#fff0c0', flick = 0.9 + 0.1 * Math.sin(t * (7 + i)); mid += `<path d="M${x} ${y} L${x} ${y - h} Q${x} ${y - h - 30 * k} ${x + d * 60 * k} ${y - h - 30 * k}" stroke="#14161a" stroke-width="${f1(12 * k)}" fill="none"/><ellipse cx="${f1(x + d * 66 * k)}" cy="${f1(y - h - 24 * k)}" rx="${f1(26 * k)}" ry="${f1(10 * k)}" fill="${col}" opacity="${f1(flick)}"/>` + wash(x + d * 66 * k, y - h * 0.4, 260 * k, h * 0.7, col, f1(0.14 * flick)); });
      let fg = `<rect x="-300" y="1840" width="${W + 600}" height="200" fill="#000" opacity="0.4"/>`;
      return { light: { dir: 1, rim: fl ? '#ffc890' : '#cfe0ff', key: fl ? '#ffd0a0' : '#e0e8ff' }, layers: [[0.05, sky], [0.14, far], [0.85, road], [0.9, mid], [1.0, ''], [1.3, fg]] };
    },

    // a closed-down 1970s gas station at night, side view: a canopy on two posts over an island of dark, unbranded pumps; a
    // boarded-up office with a blank sign; one flickering lamp; mountains under the stars; a cracked forecourt where the
    // cars stop (nothing names a real business)
    tb28_station(ctx, o = {}) {
      const t = ctx.t, r = R(282), flick = (Math.sin(t * 31) > -0.6 ? 1 : 0.35) * (0.85 + 0.15 * Math.sin(t * 5.3)), HZ = 900;
      let sky = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#080c1a"/>` + wash(540, 760, 900, 300, '#1e2a48', 0.5);
      for (let i = 0; i < 60; i++) sky += `<circle cx="${f1(-200 + r() * 1500)}" cy="${f1(-100 + r() * 700)}" r="${f1(1.4 + r() * 2)}" fill="#fff" opacity="${f1(0.3 + 0.4 * r())}"/>`;
      sky += `<path d="M-300 ${HZ} L-160 700 L0 790 L170 640 L340 760 L520 680 L700 780 L880 660 L1060 760 L1240 700 L1380 780 L1380 ${HZ} Z" fill="#141c30" stroke="#33405e" stroke-width="3"/>`;
      // the road behind, a passing car's lights far off
      let far = `<rect x="-300" y="${HZ}" width="${W + 600}" height="70" fill="#1a1c22"/><path d="M-300 ${HZ + 36} L${W + 300} ${HZ + 36}" stroke="#8a8670" stroke-width="3" stroke-dasharray="40 40" opacity="0.5"/>`;
      const px = ((t * 120) % 1900) - 300; far += `<circle cx="${f1(px)}" cy="${HZ + 30}" r="5" fill="#fff6d0"/>` + wash(px + 40, HZ + 30, 90, 20, '#fff6d0', 0.25);
      // the office: boarded windows, a dark door, a blank sign on a pole
      let bld = `<rect x="780" y="660" width="560" height="440" fill="#2a2a2e" stroke="${INK}" stroke-width="6"/><rect x="770" y="640" width="580" height="30" fill="#3a3a40" stroke="${INK}" stroke-width="5"/>`;
      [[820, 760], [1040, 760]].forEach(([x, y]) => { bld += `<rect x="${x}" y="${y}" width="170" height="150" fill="#14161a" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2].map(i => `<rect x="${x - 10}" y="${y + 20 + i * 46}" width="190" height="26" fill="#5a4630" stroke="${INK}" stroke-width="3" transform="rotate(${(i % 2 ? 4 : -3)} ${x + 85} ${y + 33 + i * 46})"/>`).join(''); });
      bld += `<rect x="1230" y="820" width="90" height="280" fill="#101114" stroke="${INK}" stroke-width="4"/>`;
      bld += `<rect x="1010" y="280" width="18" height="380" fill="#1a1a1e"/><rect x="920" y="200" width="200" height="110" rx="10" fill="#2e3036" stroke="${INK}" stroke-width="5"/><rect x="936" y="216" width="168" height="78" rx="6" fill="#3e4048" opacity="0.8"/>`;
      // the canopy and the pump island (dark, unbranded pumps)
      let can = `<rect x="40" y="560" width="760" height="56" fill="#3a3c42" stroke="${INK}" stroke-width="6"/><rect x="40" y="610" width="760" height="14" fill="#1a1a1e"/>`;
      [110, 730].forEach(x => { can += `<rect x="${x - 16}" y="620" width="32" height="520" fill="#2c2e34" stroke="${INK}" stroke-width="4"/>`; });
      can += `<rect x="180" y="1104" width="480" height="36" fill="#4a4a50" stroke="${INK}" stroke-width="4"/>`;
      [300, 540].forEach(x => { can += `<rect x="${x - 50}" y="880" width="100" height="224" rx="14" fill="#3a3e46" stroke="${INK}" stroke-width="5"/><rect x="${x - 34}" y="904" width="68" height="60" rx="6" fill="#1a1c22"/><path d="M${x + 50} 960 Q${x + 90} 1000 ${x + 60} 1060" stroke="#1a1a1e" stroke-width="8" fill="none"/>`; });
      // the lamp on the canopy edge (flickers), its cone on the forecourt
      can += `<rect x="400" y="616" width="80" height="16" rx="6" fill="#fff6d0" opacity="${f1(flick)}"/>` + `<path d="M400 632 L120 1300 L760 1300 L480 632 Z" fill="#ffe6a8" opacity="${f1(0.08 * flick)}"/>` + wash(440, 1100, 420, 260, '#ffe6a8', f1(0.2 * flick));
      let ground = `<rect x="-300" y="1100" width="${W + 600}" height="${H}" fill="#2a2a2e"/>`;
      for (let i = 0; i < 9; i++) ground += `<path d="M${f1(-200 + r() * 1500)} ${f1(1150 + r() * 600)} l ${f1(60 + r() * 120)} ${f1(-10 + r() * 30)} l ${f1(30 + r() * 60)} ${f1(20 + r() * 20)}" stroke="#141416" stroke-width="4" fill="none"/>`;
      for (let i = 0; i < 5; i++) ground += `<path d="M-300 ${1180 + i * 150} L${W + 300} ${1180 + i * 150}" stroke="#000" stroke-opacity="0.15" stroke-width="3"/>`;
      return { light: { dir: -1, rim: '#ffe6a8', key: '#fff0c8' }, layers: [[0.05, sky], [0.15, far], [0.4, bld], [0.6, can], [1.0, ground]] };
    },

    // Colorado, 1977 (generic). o.view 'library': a courthouse law library - shelves of law books, a tall window with its
    // lower sash raised onto a summer view of mountains and pines, a curtain moving. o.view 'cell': a small county jail cell
    // - painted block walls, a ceiling with an opening where a light fixture was (o.hole 0..1), a steel bunk, bars on the left.
    tb28_colorado(ctx, o = {}) {
      const t = ctx.t, r = R(283);
      if (o.view === 'cell') {
        const hole = o.hole ?? 1, flick = 0.9 + 0.1 * Math.sin(t * 29) * Math.sin(t * 2.1);
        let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#a8b8a4"/>`;
        for (let yy = 560; yy < 1240; yy += 50) { wall += `<path d="M-300 ${yy} L${W + 300} ${yy}" stroke="#000" stroke-opacity="0.09" stroke-width="3"/>`; for (let xx = -300 + ((yy / 50) % 2) * 60; xx < W + 300; xx += 120) wall += `<path d="M${xx} ${yy} L${xx} ${yy + 50}" stroke="#000" stroke-opacity="0.08" stroke-width="3"/>`; }
        // the ceiling (a lower-lit plane), a working light at the left, and THE OPENING at the right
        wall += `<path d="M-300 -300 L${W + 300} -300 L${W + 300} 560 L-300 560 Z" fill="#7a8676"/><path d="M-300 560 L${W + 300} 560" stroke="#4a5446" stroke-width="10"/>`;
        wall += `<rect x="150" y="430" width="200" height="40" rx="6" fill="#f4f6ea" opacity="${f1(flick)}"/>` + wash(250, 560, 360, 260, '#f4f8ec', f1(0.25 * flick));
        if (hole > 0) {
          wall += `<path d="M770 450 L930 450 L950 510 L750 510 Z" fill="#050607" opacity="${f1(hole)}" stroke="${INK}" stroke-width="4"/>`;
          // the fixture's cover hanging from one corner
          wall += `<g opacity="${f1(hole)}" transform="rotate(${f1(58 + 3 * Math.sin(t * 2))} 950 510)"><rect x="950" y="502" width="160" height="22" rx="4" fill="#d8dcd0" stroke="${INK}" stroke-width="4"/></g>`;
        } else wall += `<rect x="770" y="460" width="170" height="42" rx="6" fill="#e8ece0" stroke="${INK}" stroke-width="4"/>`;
        // the steel bunk on the back wall (right), a small shelf
        wall += `<rect x="560" y="1100" width="600" height="34" fill="#8a9096" stroke="${INK}" stroke-width="5"/><rect x="560" y="1080" width="600" height="24" rx="6" fill="#5a6a7a" stroke="${INK}" stroke-width="4"/><rect x="590" y="1134" width="20" height="100" fill="#6a7074"/><rect x="1110" y="1134" width="20" height="100" fill="#6a7074"/>`;
        wall += `<rect x="1000" y="720" width="160" height="16" fill="#8a9096" stroke="${INK}" stroke-width="3"/>`;
        let floor = `<rect x="-300" y="1228" width="${W + 600}" height="${H}" fill="#6e6a5e"/><rect x="-300" y="1228" width="${W + 600}" height="10" fill="#4a463e"/>`;
        for (let i = -6; i < 16; i++) floor += `<line x1="${540 + i * 90}" y1="1238" x2="${540 + i * 240}" y2="${H + 300}" stroke="#000" stroke-opacity="0.1" stroke-width="3"/>`;
        // the cell door's bars on the left, in front of the corridor
        let bars = `<rect x="-300" y="560" width="640" height="18" fill="#5a6064" stroke="${INK}" stroke-width="4"/><rect x="-300" y="860" width="640" height="16" fill="#5a6064" stroke="${INK}" stroke-width="4"/>`;
        for (let x = -260; x <= 320; x += 60) bars += `<rect x="${x - 7}" y="560" width="14" height="672" fill="#6a7074" stroke="${INK}" stroke-width="3"/><rect x="${x - 3}" y="560" width="4" height="672" fill="#c9d0d6" opacity="0.4"/>`;
        bars += `<rect x="330" y="560" width="24" height="672" fill="#4a5054" stroke="${INK}" stroke-width="4"/>`;
        return { light: { dir: 1, rim: '#eef4ff', key: '#f4f8ec' }, layers: [[0.4, wall], [1.0, floor], [o.barsDepth ?? 0.97, bars]] };
      }
      // the law library
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#5a3a24"/>`;
      for (let i = -6; i < 30; i++) wall += `<rect x="${i * 70}" y="-300" width="68" height="1540" fill="${i % 2 ? '#62402a' : '#5a3a24'}"/>`;
      wall += `<rect x="-300" y="140" width="${W + 600}" height="18" fill="#3a2414"/>`;
      // shelves of law books on the left
      let shelf = `<rect x="-140" y="180" width="700" height="1060" fill="#3a2414" stroke="${INK}" stroke-width="6"/>`;
      [300, 520, 740, 960, 1180].forEach(y => { shelf += `<rect x="-130" y="${y}" width="680" height="20" fill="#6a4a30" stroke="${INK}" stroke-width="3"/>`; let x = -120; while (x < 530) { const w = 22 + r() * 18, h = 150 + r() * 40; shelf += `<rect x="${f1(x)}" y="${f1(y - h)}" width="${f1(w)}" height="${f1(h)}" fill="${['#7a2a22', '#2a3a5a', '#5a4a2a', '#2a4a3a', '#8a6a3a'][Math.floor(r() * 5)]}" stroke="${INK}" stroke-width="2"/><rect x="${f1(x + 4)}" y="${f1(y - h + 20)}" width="${f1(w - 8)}" height="6" fill="#c9a356" opacity="0.6"/>`; x += w + 2; } });
      // the tall window on the right: summer mountains, pines; the lower sash raised (open), a curtain moving
      const WX = 690, WY = 230, WW = 400, WH = 800;
      let win = `<defs><clipPath id="tbwin"><rect x="${WX}" y="${WY}" width="${WW}" height="${WH}"/></clipPath></defs><g clip-path="url(#tbwin)"><rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" fill="#8ec0e8"/>`;
      win += `<path d="M${WX} ${WY + 420} L${WX + 80} ${WY + 250} L${WX + 170} ${WY + 330} L${WX + 260} ${WY + 200} L${WX + 400} ${WY + 360} L${WX + 400} ${WY + 800} L${WX} ${WY + 800} Z" fill="#6a7a8e"/><path d="M${WX + 230} ${WY + 236} L${WX + 260} ${WY + 200} L${WX + 296} ${WY + 244} L${WX + 276} ${WY + 236} L${WX + 256} ${WY + 252} Z M${WX + 60} ${WY + 290} L${WX + 80} ${WY + 250} L${WX + 104} ${WY + 284} Z" fill="#f4f8fc"/>`;
      win += `<path d="M${WX} ${WY + 560} Q${WX + 200} ${WY + 470} ${WX + 400} ${WY + 540} L${WX + 400} ${WY + 800} L${WX} ${WY + 800} Z" fill="#3e6a3a"/>`;
      for (let i = 0; i < 12; i++) { const x = WX + 10 + i * 34, y = WY + 560 + (i % 3) * 24; win += `<path d="M${x} ${y - 70} L${x - 20} ${y} L${x + 20} ${y} Z" fill="#244a2a"/>`; }
      win += `</g>`;
      // sashes: the upper glass with a reflection; the lower sash raised so its lower half is open air
      win += `<rect x="${WX}" y="${WY}" width="${WW}" height="${WH / 2}" fill="#d6e8f8" opacity="0.12"/><path d="M${WX + 40} ${WY + 40} L${WX + 120} ${WY + 40} L${WX + 40} ${WY + 200} Z" fill="#fff" opacity="0.12"/>`;
      win += `<rect x="${WX - 20}" y="${WY - 20}" width="${WW + 40}" height="${WH + 40}" fill="none" stroke="#e8e2d0" stroke-width="22"/><rect x="${WX}" y="${WY + WH / 2 - 60}" width="${WW}" height="24" fill="#e8e2d0" stroke="${INK}" stroke-width="3"/><rect x="${WX}" y="${WY + WH / 2 - 180}" width="${WW}" height="16" fill="#e8e2d0" opacity="0.9"/>`;
      win += `<rect x="${WX - 40}" y="${WY + WH}" width="${WW + 80}" height="30" fill="#d8d0bc" stroke="${INK}" stroke-width="4"/>`;
      const sway = 18 * Math.sin(t * 1.7) + 10 * Math.sin(t * 3.1);
      win += `<path d="M${WX + WW - 10} ${WY - 10} L${WX + WW + 60} ${WY - 10} Q${WX + WW + 50 + sway} ${WY + 400} ${WX + WW + 40 + sway * 1.6} ${WY + WH + 10} L${WX + WW - 30 + sway} ${WY + WH + 10} Q${WX + WW - 20 + sway * 0.6} ${WY + 400} ${WX + WW - 10} ${WY - 10} Z" fill="#8e3a2e" stroke="${INK}" stroke-width="4" opacity="0.92"/>`;
      win += wash(WX + WW / 2, WY + WH * 0.7, 420, 420, '#fff6dc', 0.18);
      let floor = `<rect x="-300" y="1236" width="${W + 600}" height="${H}" fill="#4a3020"/>`;
      for (let i = 0; i < 10; i++) floor += `<line x1="-300" y1="${1260 + i * 70}" x2="${W + 300}" y2="${1260 + i * 70}" stroke="#000" stroke-opacity="0.2" stroke-width="3"/>`;
      floor += `<path d="M${WX} 1236 L${WX + WW} 1236 L${WX + WW + 160} 1700 L${WX - 200} 1700 Z" fill="#fff6dc" opacity="0.06"/>`;
      const layers = [[0.3, wall + shelf + win], [1.0, floor]];
      if (o.table !== false) {   // a reading table in the foreground with two closed law books
        let tb = `<rect x="-300" y="1560" width="760" height="40" fill="#7a5232" stroke="${INK}" stroke-width="6"/><rect x="-300" y="1598" width="740" height="${H}" fill="#4a3020" stroke="${INK}" stroke-width="5"/>`;
        tb += `<rect x="40" y="1500" width="240" height="60" rx="4" fill="#7a2a22" stroke="${INK}" stroke-width="4"/><rect x="70" y="1460" width="200" height="40" rx="4" fill="#2a3a5a" stroke="${INK}" stroke-width="4"/>`;
        layers.push([1.06, tb]);
      }
      return { light: { dir: 1, rim: '#fff4dc', key: '#ffefd0' }, layers, dust: true };
    }
  });

  E.registerScenes({
    // 1 - hook: the hero car from behind, big and centred from the first frame, headlights off on a dark road; the headline is
    //     burned in by the engine (until ~3.2 s), so nothing of ours sits in y 380-720 before that. A trooper walks in and
    //     his flashlight finds the blank plate on "traffic stop".
    tb28_hook(ctx) {
      const t = ctx.t, esc = WT(ctx, 0, 2, 0.6), l1 = LS(ctx, 1, 2.6), stp = WT(ctx, 1, 4, 3.4), caught = WT(ctx, 1, 5, 3.7);
      const CARP = { x: 540, y: 1370, s: 0.9 };
      return E.cine.shot(ctx, {
        set: 'tb28_street', grade: 'night', police: 0.22 * seg(t, stp - 0.3, stp + 0.6),
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 0, y: 70, z: 1.08 }, handheld: 1.2 },
        shake: [{ at: caught, amp: 4 }],
        figures: [{ id: 'tb28_trooper', x: -160, y: 1500, scale: 0.68, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', depth: 1.02, show: [esc - 0.2],
          walk: { from: -160, to: 90, at: esc, dur: Math.max(0.6, stp - esc - 0.3), cadence: 6.2 }, propOpts: { aim: 96, beamLen: 460 },
          keys: [{ at: stp - 0.3, pose: 'torch', expr: 'stern', dur: 0.35 }] }],
        props: [{ depth: 1.0, svg: tt => beetleRear(CARP.x, CARP.y, CARP.s, tt, { driver: true, brake: tt < 1.2, spot: seg(tt, stp - 0.2, stp + 0.2), glow: 0.8 * seg(tt, caught - 0.1, caught + 0.3) }) }],
        overlays: [
          { type: 'label', at: 3.3, x: 60, y: 432, text: 'NIGHT · NO HEADLIGHTS', fs: 40, sub: 'Generic car and street; not the real ones' }
        ],
        tag: LIKENESS
      });
    },

    // 2 - the stakes, said once and plainly, in a quiet task-force room; nothing of his crimes is shown
    tb28_stakes(ctx) {
      const t = ctx.t, conf = WT(ctx, 0, 2, 0.5), n30 = WT(ctx, 0, 4, 1.2), mur = WT(ctx, 0, 5, 1.5);
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: {}, grade: 'cold', dust: true,
        cam: { from: { x: 20, y: -30, z: 1.06 }, to: { x: -20, y: -50, z: 1.0 }, handheld: 0.6 },
        figures: [
          { id: 'analyst', x: 220, y: 1560, scale: 0.92, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', keys: [...typing(0.05, conf - 0.1), { at: conf, pose: 'sit', expr: 'sad', gaze: [0.4, 0.3], dur: 0.5 }, { at: mur + 0.2, pose: 'sit_slumped', dur: 0.6 }] },
          { id: 'agent_b', x: 840, y: 1720, scale: 1.0, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', keys: [{ at: conf - 0.1, pose: 'stand', expr: 'sad', dur: 0.5 }, { at: n30 + 0.2, pose: 'bowed', dur: 0.7 }] }
        ],
        overlays: [
          { type: 'card', at: conf - 0.15, x: 90, y: 400, w: 900, rows: [{ text: 'HE LATER CONFESSED TO', fs: 30, colour: MUTE }, { text: '30 MURDERS', fs: 74, colour: RED, at: n30 - 0.35 }, { text: 'Per Britannica · the true total is unknown', fs: 26, colour: MUTE, at: mur + 0.2 }] }
        ],
        tag: TAG
      });
    },

    // 3 - Utah, August 1975 (side view): the Beetle rolls in with its headlights OFF, the patrol car right behind; they stop
    //     at a closed gas station; the trooper's flashlight goes to the empty passenger side. The items are a typed card only.
    tb28_utah(ctx) {
      const t = ctx.t, chased = WT(ctx, 0, 4, 1.6), vw = WT(ctx, 0, 6, 2.2), hl = WT(ctx, 0, 8, 3.0), l1 = LS(ctx, 1, 3.6), crow = WT(ctx, 1, 3, 4.3), hc = WT(ctx, 1, 8, 5.4);
      const GY = 1330, VWX = 720, PCX = 150;
      const stopT = hl + 0.2;
      const roll = tt => 1 - ease.out(clamp(tt / Math.max(0.8, stopT), 0, 1));   // 1 = still rolling in, 0 = stopped
      return E.cine.shot(ctx, {
        set: 'tb28_station', grade: 'night', police: 0.18 * seg(t, chased - 0.2, chased + 0.6),
        cam: { from: { x: 0, y: 60, z: 1.0 }, to: { x: 30, y: 40, z: 1.06 }, handheld: 1.6 },
        shake: [{ at: crow, amp: 3 }],
        figures: [
          { id: 'tb28_trooper', x: 360, y: 1350, scale: 0.33, dir: 1, turn: 0.5, pose: 'stand', expr: 'focused', depth: 1.01, show: [stopT + 0.1],
            walk: { from: 360, to: 450, at: stopT + 0.2, dur: Math.max(0.6, l1 - stopT), cadence: 6.4 }, propOpts: { aim: 112, beamLen: 220 },
            keys: [{ at: l1 + 0.1, pose: 'torch_low', expr: 'stern', dur: 0.35 }, { at: hc, pose: 'torch', expr: 'determined', dur: 0.35 }] },
          { id: 'tb28_bundy', x: 1010, y: 1350, scale: 0.33, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'cool', depth: 1.01, show: [stopT + 0.3],
            keys: [{ at: l1, pose: 'stand_tense', dur: 0.4 }, { at: crow + 0.2, pose: 'hands_together', dur: 0.5 }, { at: hc, pose: 'bowed', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => patrol70(PCX - 900 * roll(tt), GY, 0.52, tt, { headlights: true, doorOpen: tt > stopT + 0.05 }) },
          { depth: 1.0, svg: tt => beetleSide(VWX - 900 * roll(tt), GY, 0.6, tt, { driver: tt < stopT + 0.3, lights: false, brake: tt > stopT - 0.5 && tt < stopT + 0.5, roll: -roll(tt) * 9 }) }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.1, x: 60, y: 432, text: 'SALT LAKE COUNTY, UTAH', fs: 40, sub: 'August 1975 · before dawn' },
          { type: 'callout', at: hl - 0.05, until: l1 + 0.2, target: [VWX + 404 * 0.6, GY - 196 * 0.6], depth: 1.0, r: 46, label: [600, 760], w: 460, text: 'HEADLIGHTS OFF', colour: YEL },
          { type: 'card', at: l1 - 0.05, x: 60, y: 390, w: 900, rows: [{ text: 'PASSENGER SEAT: REMOVED', fs: 36 }, { text: 'CROWBAR · SKI MASK · HANDCUFFS', fs: 40, colour: RED, at: crow - 0.1 }, { text: 'HIS FIRST ARREST', fs: 30, colour: MUTE, at: hc - 0.05 }] }
        ],
        tag: LIKENESS
      });
    },

    // 4 - Aspen, June 1977: the courthouse law library; the silhouette crosses to the open window and is gone on "jumped";
    //     a deputy comes in to an empty room. Then: six days later, a stolen car pulled over (a card and a flash of lights).
    tb28_aspen(ctx) {
      const t = ctx.t, col = WT(ctx, 0, 1, 0.4), jmp = WT(ctx, 0, 3, 1.0), win = WT(ctx, 0, 7, 1.8), l1 = LS(ctx, 1, 2.5), stp = WT(ctx, 1, 4, 3.3), car = WT(ctx, 1, 9, 4.2);
      return E.cine.shot(ctx, {
        set: 'tb28_colorado', setOpts: { view: 'library' }, grade: 'warm', police: 0.12 * seg(t, stp - 0.2, stp + 0.4),
        cam: { keys: [{ at: 0, x: -20, y: 0, z: 1.02 }, { at: jmp - 0.4, x: 40, y: -20, z: 1.1, dur: 1.0 }], handheld: 1.4 },
        shake: [{ at: jmp + 0.1, amp: 5 }],
        figures: [
          { id: 'tb28_bundy', x: 520, y: 1440, scale: 0.72, dir: 1, turn: 0.4, pose: 'walk', silhouette: 'cool', show: [0, jmp + 0.15],
            walk: { from: 520, to: 860, at: 0.05, dur: Math.max(0.5, jmp - 0.3), cadence: 6.6 }, keys: [{ at: jmp - 0.25, pose: 'point_up', y: 1380, dur: 0.3 }] },
          { id: 'tb28_deputy', x: 460, y: 1460, scale: 0.72, dir: 1, turn: 0.45, pose: 'walk', expr: 'neutral', show: [win - 0.4],
            walk: { from: 200, to: 460, at: win - 0.4, dur: 0.9, cadence: 6.4 }, keys: [{ at: l1 - 0.2, pose: 'hand_to_face', expr: 'shocked', dur: 0.35 }, { at: stp, pose: 'point', expr: 'stern', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.1, x: 60, y: 432, text: 'ASPEN, COLORADO · JUNE 1977', fs: 38, sub: 'A courthouse law library (generic)' },
          { type: 'card', at: l1 - 0.05, x: 40, y: 390, w: 940, rows: [{ text: 'SIX DAYS LATER', fs: 34, colour: MUTE }, { text: 'PULLED OVER IN A STOLEN CAR', fs: 44, colour: RED, at: stp - 0.1 }, { text: 'BACK IN CUSTODY', fs: 30, at: car }] }
        ],
        tag: LIKENESS
      });
    },

    // 5 - Glenwood Springs, December 1977: the cell; the silhouette stands on the bunk and reaches up to the opening; he is
    //     gone on "ceiling"; a deputy's flashlight finds the empty cell; the FBI's Ten Most Wanted card
    tb28_ceiling(ctx) {
      const t = ctx.t, esc = WT(ctx, 0, 2, 0.5), jail = WT(ctx, 0, 5, 1.2), ceil = WT(ctx, 0, 6, 1.5), l1 = LS(ctx, 1, 2.3), fbi = WT(ctx, 1, 1, 2.6), ten = WT(ctx, 1, 6, 3.4);
      return E.cine.shot(ctx, {
        set: 'tb28_colorado', setOpts: { view: 'cell' }, grade: 'cold',
        cam: { from: { x: 20, y: 20, z: 1.0 }, to: { x: -30, y: 0, z: 1.08 }, handheld: 1.6 },
        shake: [{ at: ceil, amp: 4 }],
        figures: [
          { id: 'tb28_bundy', x: 860, y: 1084, scale: 0.6, dir: -1, turn: 0.4, pose: 'stand', silhouette: 'cool', show: [0, ceil + 0.2],
            keys: [{ at: esc - 0.4, pose: 'stand_tense', dur: 0.3 }, { at: jail - 0.3, pose: 'point_up', dur: 0.35 }, { at: ceil - 0.15, y: 1010, dur: 0.3 }] },
          { id: 'tb28_deputy', x: 120, y: 1500, scale: 0.86, dir: 1, turn: 0.5, pose: 'walk', expr: 'neutral', depth: 0.95, show: [l1 - 0.6], propOpts: { aim: 120, beamLen: 700 },
            walk: { from: -180, to: 140, at: l1 - 0.6, dur: 0.9, cadence: 6.2 }, keys: [{ at: l1 + 0.2, pose: 'torch', expr: 'focused', dur: 0.35 }, { at: fbi + 0.2, expr: 'shocked', dur: 0.3 }, { at: ten, pose: 'hand_to_face', expr: 'worried', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.1, x: 60, y: 520, text: 'GLENWOOD SPRINGS, COLORADO', fs: 36, sub: 'County jail · 30 December 1977' },
          { type: 'circle', at: ceil - 0.05, until: l1 + 0.4, target: [850, 500], depth: 0.4, rx: 150, ry: 70, colour: YEL },
          { type: 'card', at: l1 - 0.05, x: 380, y: 640, w: 660, rows: [{ text: 'FBI TEN MOST WANTED', fs: 48, colour: RED, at: ten - 0.1 }, { text: 'ADDED 10 FEBRUARY 1978', fs: 30, colour: MUTE, at: ten + 0.3 }] }
        ],
        tag: LIKENESS
      });
    },

    // 6 - THE HOW: Pensacola, 15 February 1978. A stolen orange Beetle from behind under sodium light and palms; the officer
    //     runs the plate, his flashlight on it; STOLEN. The driver is a dark shape in the window; nothing else is shown.
    tb28_plate(ctx) {
      const t = ctx.t, pen = WT(ctx, 0, 1, 0.3), off = WT(ctx, 0, 3, 1.2), chk = WT(ctx, 0, 4, 1.5), plate = WT(ctx, 0, 6, 2.3), l1 = LS(ctx, 1, 3.0), stol = WT(ctx, 1, 2, 3.4), bun = WT(ctx, 1, 6, 4.4);
      const CARP = { x: 500, y: 1360, s: 0.8 };
      return E.cine.shot(ctx, {
        set: 'tb28_street', setOpts: { fl: true }, grade: 'warm', police: 0.24 * seg(t, chk - 0.2, chk + 0.5),
        cam: { keys: [{ at: 0, x: 0, y: 40, z: 1.0 }, { at: stol - 0.5, x: -20, y: 90, z: 1.12, dur: 1.0 }], handheld: 1.3 },
        shake: [{ at: stol, amp: 6 }],
        figures: [{ id: 'tb28_officer', x: 930, y: 1600, scale: 0.86, dir: -1, turn: 0.5, pose: 'stand', expr: 'focused', depth: 1.02, propOpts: { aim: 74, beamLen: 420 },
          walk: { from: 1280, to: 930, at: 0.05, dur: Math.max(0.6, off - 0.1), cadence: 6.2 },
          keys: [{ at: chk - 0.1, pose: 'torch', expr: 'focused', dur: 0.35 }, { at: stol, expr: 'realise', dur: 0.3 }, { at: bun - 0.1, pose: 'stand_tense', expr: 'determined', dur: 0.35 }] }],
        props: [{ depth: 1.0, svg: tt => beetleRear(CARP.x, CARP.y, CARP.s, tt, { col: ORANGE, driver: true, spot: seg(tt, chk - 0.1, chk + 0.3), glow: seg(tt, plate - 0.15, plate + 0.2) }) }],
        overlays: [
          { type: 'label', at: 0.1, until: stol - 0.2, x: 60, y: 432, text: 'PENSACOLA, FLORIDA', fs: 40, sub: '15 February 1978 · a plate check' },
          { type: 'stamp', at: stol - 0.05, x: 540, y: 560, text: 'STOLEN', scale: 1.5, colour: '#c8312b' },
          { type: 'card', at: bun - 0.1, x: 40, y: 760, w: 760, rows: [{ text: 'THE DRIVER: TED BUNDY', fs: 40, colour: RED }, { text: 'ARRESTED AFTER A STRUGGLE', fs: 28, colour: MUTE, at: bun + 0.4 }] }
        ],
        tag: LIKENESS
      });
    },

    // 7 - the outcome: a Florida courtroom (generic); convicted (1979, 1980), executed (24 January 1989)
    tb28_verdict(ctx) {
      const cv = WT(ctx, 0, 2, 0.5), fl = WT(ctx, 0, 4, 1.0), ex = WT(ctx, 0, 6, 1.7);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.1 }, handheld: 0.5 },
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.33, keys: [{ at: cv - 0.4, pose: 'gavel', dur: 0.3 }, { at: cv + 0.05, pose: 'sit', dur: 0.15 }, { at: fl, pose: 'sit_read', dur: 0.5 }] },
          { id: 'tb28_bundy', x: 840, y: 1770, scale: 0.95, dir: -1, turn: 0.15, pose: 'stand', silhouette: 'cool', keys: [{ at: cv, pose: 'hands_together', dur: 0.4 }, { at: ex, pose: 'bowed', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'card', at: 0.15, x: 40, y: 860, w: 660, rows: [{ text: 'CONVICTED IN FLORIDA', fs: 34, colour: RED, at: cv - 0.05 }, { text: '1979 AND 1980 · DEATH SENTENCES', fs: 26, colour: MUTE, at: fl }, { text: 'EXECUTED · 24 JANUARY 1989', fs: 32, at: ex - 0.05 }] }
        ],
        tag: LIKENESS
      });
    },

    // 8 - callback on the hero object (the first frame's framing): the tan car, the trooper's flashlight on the blank plate.
    //     The engine burns the end question over the last 3.2 s at y 520, so nothing of ours sits in y 380-720; the last
    //     frame loops to the first.
    tb28_end(ctx) {
      const t = ctx.t, two = WT(ctx, 0, 2, 0.8), stops = WT(ctx, 0, 4, 1.4), l1 = LS(ctx, 1, 2.0), end = ctx.T;
      const CARP = { x: 540, y: 1370, s: 0.9 };
      return E.cine.shot(ctx, {
        set: 'tb28_street', grade: 'night', police: 0.22 * (1 - seg(t, l1, l1 + 1.2)),
        cam: { from: { x: 0, y: 70, z: 1.08 }, to: { x: 0, y: 40, z: 1.0 }, handheld: 0.6 },
        figures: [{ id: 'tb28_trooper', x: 90, y: 1500, scale: 0.68, dir: 1, turn: 0.5, pose: 'torch', expr: 'stern', depth: 1.02, propOpts: { aim: 96, beamLen: 460 },
          keys: [{ at: stops, pose: 'torch_low', dur: 0.4 }, { at: l1 + 0.1, pose: 'hands_together', expr: 'neutral', dur: 0.6 }] }],
        props: [{ depth: 1.0, svg: tt => beetleRear(CARP.x, CARP.y, CARP.s, tt, { driver: true, spot: 1 - seg(tt, l1 + 0.1, l1 + 0.7), glow: 0.8 * seg(tt, two - 0.2, two + 0.2) * (1 - seg(tt, l1, l1 + 0.6)) }) }],
        overlays: [],   // nothing of ours: the engine burns the end question over the last 3.2 s
        tag: LIKENESS
      });
    }
  });
})();
