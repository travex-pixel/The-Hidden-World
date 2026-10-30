/* Case File 87 (premium look, ENGINE V6: promise -> proof -> escalate -> callback): DUMBEST GETAWAYS, 2.
   FRAME-0 EXPERIMENT, VARIANT B ("the object"): frame 0 is the absurd object AT REST, big in the upper-middle of the frame, with
   a generic figure beside it and the camera already pushing in: a gold ride-share sedan waiting at the kerb outside a plain bank,
   hazards blinking, the driver's head in the window, the suspect's silhouette leaning to the window. Not the act (Case File 86).
   HEADLINE: November 2022, Southfield, Michigan: police say a man took an Uber to a bank on Greenfield Road, asked the driver
   to wait while he robbed it and was driven home; police tracked the driver to his apartment complex and arrested him there in
   the same clothes, red from a dye pack in the cash. Why an Uber? Police say his licence was suspended (the callback). Accused.
   CASE 2: Sunday 14 April 2024, Colma, California: a shoplifting pair's getaway car ran out of gas and stopped in the middle of
   the road after two red lights; the driver was a wanted Texas fugitive; the clothes in the car still had their security tags.
   CASE 3 (best last): Thursday 15 March 2018, Bentleyville, Pennsylvania: a demand note written on a deposit slip and signed
   with the robber's own name, prosecutors said; arrested that evening at a casino. Accused (no verdict found).
   Smoothness: cuts and dissolves, one push (into case 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact (the signature). Screen direction: the accused move LEFT TO RIGHT (to the bank door, along the path,
   away from the stalled car); the police enter from the right.
   Look: episode.look = 'premium', one cool November palette (shadow #141a24, mid #c8bfae, accent #e6b04a). The strongly
   coloured object is the gold sedan (prop marked accent: true); everything else is muted. The car is a plain unbranded sedan.
   Content rules: nobody is hurt; no weapon, no force. The three accused are dark silhouettes tagged NOT A LIKENESS; the
   officers and the teller are generic figures; the driver is only a head shape in the window; no real place, badge, logo or
   document is imitated (the deposit slip is our own plain graphic; its demand line is a scribble because the wording was
   never reported; the "signature" is a scribble, never a name).
   New environments (E.registerSets): dg87_street (a plain bank frontage with the kerb and road), dg87_court (an apartment
   complex path), dg87_road (a suburban boulevard with a red light; o.view 'close' lowers the horizon), dg87_bank (a bank
   interior; o.view 'counter' is the counter-top close-up). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#10141a';
  const f3 = n => Math.round(n * 1000) / 1000;
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · NOT A LIKENESS';
  const GEN = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#e6b04a';

  // ---------- THE HERO: a plain sedan, side view, facing right (dir -1 mirrors it). Origin at the ground under its centre.
  // o.col body colour; o.t time (hazards blink, exhaust puffs, a soft idle); o.hazards 0/1; o.driver draws a head in the front
  // window; o.phone a small lit screen on the dash; o.boot 0..1 lifts the boot lid (the rear is on the LEFT); o.glow accent haze
  function sedan(x, y, s, o = {}) {
    const t = o.t || 0, col = o.col || ACC, dark = E.fig ? E.fig.shade(col, 0.72) : col;
    const idle = o.idle === false ? 0 : Math.sin(t * 9.2) * 1.6;
    const ph = ((t * 1.3) % 1 + 1) % 1, haz = o.hazards === 0 ? 0 : (ph < 0.5 ? 1 : 0.18);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s * (o.dir || 1))} ${f3(s)})"><ellipse cx="0" cy="6" rx="420" ry="26" fill="#000" opacity="0.38"/>`;
    if (o.glow) g += wash(0, -190, 520, 230, ACC, f1(0.14 * o.glow));
    // exhaust puffs at the rear (left), rising and fading
    if (o.exhaust !== false) for (let i = 0; i < 3; i++) { const k = ((t * 0.55 + i / 3) % 1 + 1) % 1; g += `<circle cx="${f1(-420 - 90 * k - i * 8)}" cy="${f1(-70 - 70 * k)}" r="${f1(14 + 30 * k)}" fill="#d8dce4" opacity="${f1(0.28 * (1 - k))}"/>`; }
    g += `<g transform="translate(0 ${f1(idle)})">`;
    // the body: a long lower box with a sloped bonnet, the cabin on top
    g += `<path d="M-392 -70 L-384 -170 Q-380 -190 -356 -194 L-250 -204 L-168 -296 Q-150 -316 -110 -318 L150 -318 Q196 -318 224 -290 L300 -206 L368 -192 Q398 -186 398 -156 L398 -70 Z" fill="${col}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-392 -120 L398 -120" stroke="${dark}" stroke-width="6" opacity="0.5"/><path d="M-370 -150 L-262 -150 M-230 -200 L300 -200" stroke="#fff" stroke-width="5" opacity="0.35"/>`;
    // windows (tinted), the pillar between them; the driver's head in the front (right) window
    g += `<path d="M-160 -214 L-100 -294 L26 -294 L26 -214 Z" fill="#5a7288" stroke="${INK}" stroke-width="4"/><path d="M48 -214 L48 -294 L150 -294 Q180 -294 198 -272 L250 -214 Z" fill="#5a7288" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-160 -214 L26 -214 M-100 -294 L150 -294" stroke="#8fb0c8" stroke-width="3" opacity="0.5"/>`;
    if (o.driver) g += `<g transform="translate(140 -252)"><ellipse cx="0" cy="0" rx="26" ry="30" fill="#1a2028"/><path d="M-26 -8 Q-10 -40 22 -28 Q30 -20 26 -4" fill="#141a20"/><path d="M-6 30 Q-30 40 -34 60 L34 60 Q30 40 6 30 Z" fill="#1a2028"/></g>`;
    if (o.phone) g += `<rect x="196" y="-250" width="22" height="34" rx="4" fill="#f0f6ff" opacity="${f1(0.85 + 0.15 * Math.sin(t * 3.1))}"/>` + wash(206, -240, 70, 60, '#dceeff', 0.35);
    // doors and handles
    g += `<path d="M36 -312 L36 -74 M-176 -210 L-176 -74" stroke="${dark}" stroke-width="5"/><rect x="-120" y="-176" width="56" height="12" rx="5" fill="${dark}"/><rect x="80" y="-176" width="56" height="12" rx="5" fill="${dark}"/>`;
    // lights: the rear (left) and front (right) clusters; the hazards blink amber
    g += `<rect x="-404" y="-186" width="22" height="46" rx="5" fill="#c83a30"/><rect x="384" y="-182" width="26" height="40" rx="5" fill="#f4e8c0"/>`;
    g += `<rect x="-404" y="-136" width="22" height="26" rx="5" fill="#ffb03a" opacity="${f1(haz)}"/><rect x="384" y="-138" width="26" height="26" rx="5" fill="#ffb03a" opacity="${f1(haz)}"/>`;
    if (haz > 0.5) g += wash(-404, -124, 110, 70, '#ffb03a', 0.45) + wash(400, -124, 120, 70, '#ffb03a', 0.45);
    // the boot lid (hinged at the rear of the roof line), lifted by o.boot
    if (o.boot) { const a = -70 * ease.out(clamp(o.boot, 0, 1)); g += `<g transform="translate(-250 -204) rotate(${f1(a)})"><path d="M0 0 L-106 10 Q-134 14 -136 36 L-140 70 L0 60 Z" fill="${col}" stroke="${INK}" stroke-width="5"/></g>`; }
    g += `</g>`;
    // wheels and arches (not bobbing)
    [-250, 258].forEach(wx => { g += `<path d="M${wx - 74} -70 A74 74 0 0 1 ${wx + 74} -70 Z" fill="#141518"/><circle cx="${wx}" cy="-62" r="60" fill="#141516" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-62" r="26" fill="#8e9498" stroke="${INK}" stroke-width="4"/>`; });
    return g + '</g>';
  }
  // a generic patrol car (facing right; no markings or crest), its roof bar softly alternating red and blue
  function patrol(x, y, s, t, on = 1) {
    const ph = ((t * 1.6) % 1 + 1) % 1, a = ph < 0.5 ? 1 : 0.25, b = ph < 0.5 ? 0.25 : 1;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})"><ellipse cx="0" cy="4" rx="340" ry="22" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-320 -60 L-310 -130 Q-300 -150 -260 -156 L-170 -164 L-90 -236 Q-70 -250 -30 -250 L120 -250 Q160 -250 190 -224 L260 -164 L310 -150 Q340 -140 340 -110 L340 -60 Z" fill="#2a2e36" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-150 -168 L-80 -230 L30 -230 L30 -168 Z M50 -168 L50 -230 L120 -230 Q150 -230 170 -212 L222 -168 Z" fill="#7a94a8" opacity="0.6" stroke="${INK}" stroke-width="4"/><path d="M-300 -110 L330 -110" stroke="#c8ccd0" stroke-width="10" opacity="0.4"/>`;
    g += `<rect x="-60" y="-272" width="56" height="20" rx="6" fill="#c84a3a" opacity="${f1(on * (0.4 + 0.6 * a))}"/><rect x="0" y="-272" width="56" height="20" rx="6" fill="#4a6ad0" opacity="${f1(on * (0.4 + 0.6 * b))}"/>`;
    if (on > 0) g += wash(-32, -262, 240, 130, '#ff6a5a', f1(0.22 * a * on)) + wash(28, -262, 240, 130, '#6a8aff', f1(0.22 * b * on));
    g += `<rect x="300" y="-136" width="40" height="18" rx="5" fill="#f4e6b0"/>` + [-190, 200].map(wx => `<circle cx="${wx}" cy="-46" r="54" fill="#141516" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-46" r="24" fill="#8a9096"/>`).join('') + '</g>';
    return g;
  }
  // the hero car's placement on the kerb (set coordinates) and the frame-1 camera; the end scene reuses both (the loop)
  const CAR = { x: 390, y: 1075, s: 0.98 };
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 10, y: 14, z: 1.09 };
  // the suspect beside the car at frame 1 (facing the driver's window); the end scene draws him identically
  const BESIDE = { id: 'dg87_suspect_mi', x: 735, y: 1122, scale: 0.5, dir: -1, turn: 0.5, pose: 'stand_tense', silhouette: 'cool', depth: 1.02 };

  // clothes with security tags spilling from a boot: a heap of folded colour with little grey tags on loops
  function clothes(x, y, k = 1) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(k)})"><path d="M-150 0 Q-120 -90 -40 -84 Q20 -120 80 -80 Q150 -70 150 0 Z" fill="#8a4a6a" stroke="${INK}" stroke-width="4"/><path d="M-110 -20 Q-60 -60 10 -40 Q60 -70 110 -24" stroke="#b86a8a" stroke-width="6" fill="none"/>`;
    g += `<path d="M-60 -70 Q-20 -130 60 -110 Q110 -100 100 -60 Z" fill="#3a6a8a" stroke="${INK}" stroke-width="4"/>`;
    [[-90, -40], [20, -92], [96, -40]].forEach(([tx, ty]) => { g += `<path d="M${tx} ${ty} l10 -26" stroke="#d8dce0" stroke-width="3"/><rect x="${tx + 4}" y="${ty - 44}" width="26" height="22" rx="4" fill="#d8dce0" stroke="${INK}" stroke-width="3"/><circle cx="${tx + 17}" cy="${ty - 33}" r="4" fill="#9aa0a8"/>`; });
    return g + '</g>';
  }
  // the deposit slip (our own plain graphic): a pale form with a few rule lines, a scribbled demand line (the wording was never
  // reported) and, when sig > 0, a scribbled signature drawing itself on the signature line (never a name)
  function slip(x, y, rot, sig = 0, k = 1) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f3(k)})"><rect x="-230" y="-150" width="460" height="300" rx="8" fill="#efe9d6" stroke="${INK}" stroke-width="5"/><rect x="-230" y="-150" width="460" height="40" rx="8" fill="#c8c0a8"/>`;
    g += `<rect x="-200" y="-96" width="140" height="16" rx="3" fill="#b8b09a"/><rect x="-200" y="-56" width="300" height="3" fill="#b8b09a"/><rect x="-200" y="-10" width="300" height="3" fill="#b8b09a"/><rect x="-200" y="36" width="300" height="3" fill="#b8b09a"/>`;
    g += `<rect x="90" y="-100" width="120" height="30" rx="4" fill="none" stroke="#b8b09a" stroke-width="3"/>`;
    // the demand line: a dense scribble in pen
    g += `<path d="M-196 -64 q10 -14 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 M-196 -18 q10 -14 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" stroke="#1a2a5a" stroke-width="4" fill="none"/>`;
    // the signature line and the signature itself (drawn in)
    g += `<path d="M-200 108 L200 108" stroke="#8a8270" stroke-width="3"/><text x="-200" y="130" font-family="Arial, sans-serif" font-size="18" fill="#8a8270" letter-spacing="2">SIGNATURE</text>`;
    if (sig > 0) g += `<path pathLength="100" stroke-dasharray="100" stroke-dashoffset="${f1(100 - 100 * clamp(sig, 0, 1))}" d="M-180 104 q30 -70 50 -10 q10 40 40 -20 q20 -40 40 0 q20 30 36 -10 q24 -40 40 -4 q10 40 50 -6 q20 -30 36 0" stroke="#1a2a5a" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    return g + '</g>';
  }
  // the robber's forearm and pen entering from the lower left to the slip (a dark silhouette)
  function penHand(x, y, k) {
    const px = lerp(-200, x - 90, ease.out(k)), py = lerp(H + 200, y + 60, ease.out(k));
    return `<g transform="translate(${f1(px)} ${f1(py)}) rotate(-26)"><path d="M-600 40 Q-300 -10 -60 -14 L30 -10 Q70 -6 60 30 Q30 60 -40 54 L-600 90 Z" fill="#1a2028" stroke="${INK}" stroke-width="4"/><circle cx="50" cy="20" r="40" fill="#1a2028" stroke="${INK}" stroke-width="4"/><path d="M80 10 L190 -70" stroke="#2a3a6a" stroke-width="10" stroke-linecap="round"/><path d="M186 -66 L202 -84" stroke="#9aa8c0" stroke-width="6" stroke-linecap="round"/></g>`;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a plain bank frontage on a grey November day: pale stone, tall windows, a glass door on the right, a sign band with the word
    // BANK in plain type, a bare tree far left; a pavement with a kerb; the road in the foreground where the car waits
    dg87_street(ctx, o = {}) {
      let sky = `<rect x="-400" y="-400" width="${W + 800}" height="760" fill="#9aa4b0"/>` + wash(540, 120, 900, 300, '#c8d0d8', 0.3);
      // the bare tree (far left)
      sky += `<path d="M-60 960 L-60 500 M-60 760 L-150 640 M-60 700 L30 580 M-60 640 L-130 540 M-60 600 L10 500" stroke="#3a3430" stroke-width="18" stroke-linecap="round"/>`;
      let bank = `<rect x="60" y="300" width="${W + 400}" height="660" fill="#d8d2c4" stroke="${INK}" stroke-width="6"/><rect x="60" y="300" width="${W + 400}" height="110" fill="#b8ae9a" stroke="${INK}" stroke-width="5"/>`;
      bank += `<rect x="160" y="330" width="420" height="52" rx="6" fill="#2a3240"/><text x="370" y="370" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="40" letter-spacing="10" fill="#f0ead8">BANK</text>`;
      [140, 420].forEach(x => { bank += `<rect x="${x}" y="450" width="200" height="360" fill="#4a6478" stroke="${INK}" stroke-width="6"/><path d="M${x + 100} 450 L${x + 100} 810 M${x} 630 L${x + 200} 630" stroke="#c8d0d8" stroke-width="6"/>` + wash(x + 100, 630, 160, 260, '#9ab0c0', 0.12); });
      // the glass door (right) with its frame and a step
      bank += `<rect x="740" y="430" width="260" height="530" fill="#3a5468" stroke="${INK}" stroke-width="6"/><path d="M870 430 L870 960 M740 700 L1000 700" stroke="#c8d0d8" stroke-width="8"/><rect x="850" y="670" width="12" height="80" rx="4" fill="#c8c0a8"/><rect x="876" y="670" width="12" height="80" rx="4" fill="#c8c0a8"/>` + wash(870, 700, 200, 280, '#b8ccd8', 0.14);
      bank += `<rect x="60" y="900" width="${W + 400}" height="60" fill="#b8ae9a" stroke="${INK}" stroke-width="4"/>`;
      // pavement, kerb, road
      let ground = `<rect x="-400" y="960" width="${W + 800}" height="110" fill="#9a948a"/><rect x="-400" y="1056" width="${W + 800}" height="22" fill="#c8c2b4" stroke="${INK}" stroke-width="4"/>`;
      for (let i = 0; i < 9; i++) ground += `<path d="M${-300 + i * 180} 960 L${-300 + i * 180} 1056" stroke="#8a847a" stroke-width="3"/>`;
      ground += `<rect x="-400" y="1078" width="${W + 800}" height="${H}" fill="#3a3c42"/><path d="M-400 1500 L${W + 400} 1500" stroke="#c8c080" stroke-width="8" stroke-dasharray="90 70" opacity="0.7"/>`;
      ground += wash(400, 1160, 700, 160, '#000', 0.15);
      return { light: { dir: -1, rim: '#e8f0f8', key: '#dce4ec' }, layers: [[0.2, sky], [0.45, bank], [0.85, ground]] };
    },

    // an apartment complex on a grey afternoon: two brick blocks with balconies behind a lawn, a concrete path across the frame,
    // shrubs, a lamp post; no numbers or names on anything
    dg87_court(ctx, o = {}) {
      let sky = `<rect x="-400" y="-400" width="${W + 800}" height="900" fill="#98a2ae"/>` + wash(540, 200, 900, 300, '#c0c8d0', 0.25);
      let blocks = '';
      [[-200, 560, 760], [720, 520, 820]].forEach(([x, y, w]) => {
        blocks += `<rect x="${x}" y="${y}" width="${w}" height="${1120 - y}" fill="#6a4a3c" stroke="${INK}" stroke-width="6"/><rect x="${x}" y="${y}" width="${w}" height="30" fill="#4a3028"/>`;
        for (let r = 0; r < 2; r++) for (let c = 0; c < Math.floor(w / 190); c++) { const wx = x + 40 + c * 190, wy = y + 70 + r * 250; blocks += `<rect x="${wx}" y="${wy}" width="110" height="150" fill="#3a4a5a" stroke="${INK}" stroke-width="4"/><path d="M${wx + 55} ${wy} L${wx + 55} ${wy + 150}" stroke="#8a9aa8" stroke-width="4"/>`; if (r === 1) blocks += `<rect x="${wx - 16}" y="${wy + 150}" width="142" height="14" fill="#2a2a2a"/>`; }
        blocks += `<rect x="${x + w - 190}" y="920" width="110" height="200" fill="#2a2e34" stroke="${INK}" stroke-width="4"/>`;
      });
      let lawn = `<rect x="-400" y="1120" width="${W + 800}" height="${H}" fill="#4a5a3a"/>`;
      [[80, 1130], [420, 1140], [980, 1126]].forEach(([x, y]) => { lawn += `<ellipse cx="${x}" cy="${y}" rx="90" ry="46" fill="#3a4a2e" stroke="${INK}" stroke-width="4"/>`; });
      lawn += `<path d="M600 1130 L600 620" stroke="#2a2e34" stroke-width="12"/><ellipse cx="600" cy="612" rx="26" ry="18" fill="#2a2e34"/>`;
      let path = `<path d="M-400 1200 L${W + 400} 1200 L${W + 400} 1330 L-400 1330 Z" fill="#8a8478" stroke="${INK}" stroke-width="4"/>`;
      for (let i = 0; i < 10; i++) path += `<path d="M${-300 + i * 170} 1200 L${-320 + i * 170} 1330" stroke="#7a746a" stroke-width="3"/>`;
      path += `<rect x="-400" y="1330" width="${W + 800}" height="${H}" fill="#445238"/>` + wash(500, 1500, 800, 200, '#000', 0.12);
      return { light: { dir: -1, rim: '#e8f0f8', key: '#d8e0e8' }, layers: [[0.2, sky + blocks], [0.5, lawn], [0.85, path]] };
    },

    // a suburban boulevard, overcast: low shops beyond with a plain SHOPS sign, a few trees, a traffic light on the right showing
    // red, a wide road with a yellow centre line filling the lower half (o.view 'close' lowers the horizon for the boot shot)
    dg87_road(ctx, o = {}) {
      const close = o.view === 'close', hz = close ? 1020 : 1120;
      let sky = `<rect x="-400" y="-400" width="${W + 800}" height="${hz + 400}" fill="#a0aab4"/>` + wash(540, 300, 1000, 400, '#c8d0d8', 0.3);
      let far = `<rect x="-400" y="${hz - 300}" width="${W + 800}" height="300" fill="#b8b0a0" stroke="${INK}" stroke-width="5"/><rect x="-400" y="${hz - 300}" width="${W + 800}" height="40" fill="#8a8274"/>`;
      for (let i = 0; i < 8; i++) far += `<rect x="${-300 + i * 220}" y="${hz - 220}" width="140" height="130" fill="#4a5a68" stroke="${INK}" stroke-width="4"/>`;
      far += `<rect x="300" y="${hz - 420}" width="300" height="80" rx="8" fill="#2a3240" stroke="${INK}" stroke-width="4"/><text x="450" y="${hz - 364}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="44" letter-spacing="8" fill="#f0ead8">SHOPS</text><rect x="440" y="${hz - 340}" width="20" height="40" fill="#2a3240"/>`;
      [-120, 1100].forEach(x => { far += `<path d="M${x} ${hz} L${x} ${hz - 360}" stroke="#4a3a30" stroke-width="22"/><ellipse cx="${x}" cy="${hz - 440}" rx="150" ry="120" fill="#4a5a3a" stroke="${INK}" stroke-width="5"/>`; });
      // the traffic light (right), red
      far += `<path d="M900 ${hz} L900 ${hz - 640} L760 ${hz - 640}" stroke="#2a2e34" stroke-width="16" fill="none"/><rect x="716" y="${hz - 700}" width="90" height="220" rx="14" fill="#1e2228" stroke="${INK}" stroke-width="4"/><circle cx="761" cy="${hz - 660}" r="28" fill="#ff4a3a"/><circle cx="761" cy="${hz - 590}" r="28" fill="#3a3a30"/><circle cx="761" cy="${hz - 520}" r="28" fill="#3a3a30"/>` + wash(761, hz - 660, 90, 90, '#ff6a5a', 0.4);
      let road = `<rect x="-400" y="${hz}" width="${W + 800}" height="60" fill="#9a948a"/><rect x="-400" y="${hz + 60}" width="${W + 800}" height="${H}" fill="#3a3c42"/>`;
      road += `<path d="M-400 ${hz + 400} L${W + 400} ${hz + 400}" stroke="#d8b84a" stroke-width="10" opacity="0.8"/><path d="M-400 ${hz + 430} L${W + 400} ${hz + 430}" stroke="#d8b84a" stroke-width="10" opacity="0.8"/>`;
      road += `<path d="M-400 ${hz + 760} L${W + 400} ${hz + 760}" stroke="#e8e8e0" stroke-width="8" stroke-dasharray="110 90" opacity="0.6"/>` + wash(500, hz + 500, 800, 200, '#000', 0.12);
      return { light: { dir: -1, rim: '#e8f0f8', key: '#dce4ec' }, layers: [[0.2, sky + far], [0.85, road]] };
    },

    // a bank interior: a back wall with a clock and a plain notice board, glass partitions on a dark wood counter, a rope
    // barrier (o.view 'counter' is the counter-top close: the wood plane fills the lower middle, the partition frame above)
    dg87_bank(ctx, o = {}) {
      const close = o.view === 'counter';
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1560" fill="#b8b4a8"/><rect x="-400" y="-300" width="${W + 800}" height="520" fill="#a8a498"/><path d="M-400 220 L${W + 400} 220" stroke="#8a8678" stroke-width="6"/>`;
      if (!close) {
        wall += `<circle cx="820" cy="420" r="70" fill="#f0ece0" stroke="${INK}" stroke-width="6"/><path d="M820 420 L820 372 M820 420 L852 440" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
        wall += `<rect x="140" y="340" width="360" height="200" fill="#6a5a48" stroke="${INK}" stroke-width="5"/>`; for (let i = 0; i < 3; i++) wall += `<rect x="${170 + i * 110}" y="370" width="80" height="60" fill="#e8e4d8"/>`;
      }
      // the counter with glass partitions
      const top = close ? 1160 : 1100, front = close ? 1420 : 1250;
      let counter = `<path d="M-400 ${top} L${W + 400} ${top} L${W + 400} ${front} L-400 ${front} Z" fill="#6a4a34" stroke="${INK}" stroke-width="6"/><path d="M-400 ${front} L${W + 400} ${front} L${W + 400} ${H} L-400 ${H} Z" fill="#4a3424" stroke="${INK}" stroke-width="5"/>`;
      counter += `<path d="M-400 ${top + 10} L${W + 400} ${top + 10}" stroke="#8a6a4a" stroke-width="6" opacity="0.6"/>`;
      // glass above the counter: frames at intervals, the glass tinted, a slot at the counter level
      const gx = close ? [-200, 1180] : [-100, 480, 1060];
      gx.forEach((x, i) => { counter += `<rect x="${x}" y="${top - 620}" width="16" height="620" fill="#3a3028" stroke="${INK}" stroke-width="3"/>`; if (i < gx.length - 1) counter += `<rect x="${x + 16}" y="${top - 600}" width="${gx[i + 1] - x - 16}" height="600" fill="#9ab8cc" opacity="0.22"/><rect x="${x + 16}" y="${top - 600}" width="${gx[i + 1] - x - 16}" height="600" fill="none" stroke="#c8d8e4" stroke-width="3" opacity="0.5"/>`; });
      counter += `<rect x="-400" y="${top - 620}" width="${W + 800}" height="24" fill="#3a3028" stroke="${INK}" stroke-width="3"/>`;
      // the pen on its chain and the slip rack (left), the rope barrier (near)
      if (!close) counter += `<rect x="120" y="${top - 70}" width="110" height="70" fill="#8a8274" stroke="${INK}" stroke-width="4"/><rect x="132" y="${top - 60}" width="86" height="50" fill="#efe9d6"/><path d="M300 ${top} q10 -40 24 -60 l6 -18" stroke="#2a3a6a" stroke-width="7" stroke-linecap="round"/><path d="M300 ${top} q-40 -14 -60 6" stroke="#8a9098" stroke-width="3" fill="none"/>`;
      let near = close ? '' : `<path d="M-100 1560 L1180 1560" stroke="#8a2a2a" stroke-width="14"/><rect x="160" y="1440" width="20" height="200" fill="#c8b070" stroke="${INK}" stroke-width="3"/><rect x="900" y="1440" width="20" height="200" fill="#c8b070" stroke="${INK}" stroke-width="3"/><path d="M180 1480 Q540 1600 900 1480" stroke="#8a2a2a" stroke-width="14" fill="none"/>`;
      let floor = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#7a7266"/>`;
      return { light: { dir: -1, rim: '#fff0d0', key: '#f0ece0' }, layers: [[0.2, wall], [0.5, counter], [0.9, near + (close ? '' : floor)]] };
    }
  });

  E.registerScenes({
    // 1 - HOOK (frame 0, variant B): the gold ride-share sedan waiting at the kerb, hazards blinking, exhaust rising, the driver's
    //     head in the window, the suspect's silhouette beside the front door facing the driver; the camera already pushing in.
    //     Line 2 ('Then told the driver to wait'): he leans to the window on 'told', then turns and walks right to the bank door
    dg87_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.6), told = WT(ctx, 1, 1, 2.9), wait = WT(ctx, 1, 4, 3.8);
      const tw = wait - 0.15;   // when the second entry (facing right, walking) takes over
      return E.cine.shot(ctx, {
        set: 'dg87_street', grade: 'cold', haze: 0.28,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [
          { ...BESIDE, show: [-1, tw], keys: [{ at: told, pose: 'examine', headTurn: 0.2, dur: 0.4 }, { at: tw - 0.35, pose: 'stand_tense', headTurn: 0.6, turn: 0.7, dur: 0.3 }] },
          { ...BESIDE, dir: 1, turn: 0.45, pose: 'walk', show: [tw, T + 1], x: 735,
            walk: { at: tw, dur: Math.max(0.9, T - tw - 0.1), cadence: 3.2, stride: 13, from: 735, to: 905 } }
        ],
        props: [{ depth: 1.0, accent: true, svg: tt => sedan(CAR.x, CAR.y, CAR.s, { t: tt, driver: true, phone: true, glow: 0.6 }) }],
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.25), x: 60, y: 560, text: 'SOUTHFIELD, MICHIGAN · NOVEMBER 2022', fs: 38, sub: 'Police say · charged, not tried · AS OF OCT 2026' },
          { type: 'label', at: wait + 0.1, x: 60, y: 1200, text: 'THE DRIVER DID NOT KNOW · NOT INVOLVED', fs: 34, sub: 'Southfield police (FOX 2 Detroit, CBS Detroit)' }
        ],
        tag: TAG
      });
    },

    // 2 - THE HEADLINE GOTCHA: the apartment complex; the suspect walks in along the path (left to right); an officer walks in
    //     from the right to meet him on 'driver.'; he stops; on line 2 his hands go behind his back and the red dye on his clothes
    //     gets the callout
    dg87_court(ctx) {
      const t = ctx.t, T = ctx.T, dr = WT(ctx, 0, 3, 1.1), hm = WT(ctx, 0, 6, 2.0), l2 = LS(ctx, 1, 3.0), dye = WT(ctx, 1, 2, 3.5);
      const wk = { at: 0.0, dur: Math.max(1.0, hm - 0.1), cadence: 3.2, stride: 14, from: 150, to: 520 };
      const sx = tt => lerp(wk.from, wk.to, clamp((tt - wk.at) / wk.dur, 0, 1));
      return E.cine.shot(ctx, {
        set: 'dg87_court', grade: 'cold', haze: 0.25,
        cam: { from: { x: -14, y: 20, z: 1.02 }, to: { x: 12, y: 30, z: 1.08 } },
        figures: [
          { id: 'dg87_suspect_mi', x: 520, y: 1300, scale: 0.9, dir: 1, turn: 0.4, pose: 'walk', silhouette: 'cool', depth: 1.02, walk: wk,
            keys: [{ at: hm, pose: 'stand_tense', headTurn: 0.3, dur: 0.35 }, { at: l2 + 0.1, pose: 'hands_behind', headTurn: 0.1, dur: 0.45 }] },
          { id: 'dg87_officer_mi', x: 840, y: 1330, scale: 0.92, dir: -1, turn: 0.4, pose: 'walk', expr: 'focused', depth: 1.03, hat: { style: 'cap', color: '#1a2230' },
            walk: { at: dr - 0.1, dur: Math.max(0.8, hm - dr + 0.3), cadence: 3.4, stride: 14, from: 1250, to: 840 },
            keys: [{ at: hm + 0.25, pose: 'point', expr: 'stern', headTurn: 0.2, dur: 0.4 }, { at: l2 + 0.2, pose: 'present', expr: 'determined', dur: 0.4 }] }
        ],
        props: [
          // red dye on his jacket and sleeve, moving with him; brighter on 'dye'
          { depth: 1.03, svg: tt => { const x = sx(tt), y = 1300, k = 0.55 + 0.45 * seg(tt, l2, dye + 0.3); const r = R(8702); let g = ''; for (let i = 0; i < 9; i++) { const dx = -40 + r() * 80, dy = -560 + r() * 160, rr = 10 + r() * 22; g += `<ellipse cx="${f1(x + dx)}" cy="${f1(y + dy)}" rx="${f1(rr)}" ry="${f1(rr * 0.8)}" fill="#ff3a6a" opacity="${f1(0.85 * k)}"/>`; } return g; } },
          { depth: 1.03, svg: tt => { const k = seg(tt, dye - 0.1, dye + 0.5); return k > 0 ? wash(sx(tt), 780, 220, 200, '#ff6a9a', f1(0.3 * k)) : ''; } }
        ],
        overlays: [
          { type: 'label', at: 0.35, x: 60, y: 560, text: 'DROPPED AT HIS APARTMENT BY THE DRIVER', fs: 32, sub: 'Tracked via the driver · photo line-up (FOX 2, CBS)' },
          { type: 'callout', at: dye + 0.15, target: [520, 760], label: [600, 1000], text: 'RED DYE · FROM THE CASH', w: 460, r: 60 },
          { type: 'label', at: l2 + 0.1, x: 60, y: 1120, text: 'ARRESTED IN THE SAME CLOTHES', fs: 34, sub: 'A dye pack in the cash · police · accused, not tried' }
        ],
        tag: TAG
      });
    },

    // 3 - REHOOK + CASE 2: the boulevard, wide: the dark getaway car stopped dead in the middle of the road, hazards on; two
    //     silhouettes walking away right; a patrol car rolls in from the left on 'California'; the 1,263 counter
    dg87_road(ctx) {
      const t = ctx.t, T = ctx.T, nt = WT(ctx, 0, 3, 0.9), l2 = LS(ctx, 1, 1.9), br = WT(ctx, 1, 3, 2.9);
      return E.cine.shot(ctx, {
        set: 'dg87_road', grade: 'cold', haze: 0.3,
        cam: { from: { x: -12, y: 16, z: 1.02 }, to: { x: 12, y: 26, z: 1.08 } },
        figures: [
          { id: 'dg87_walker_a', x: 900, y: 1560, scale: 0.58, dir: 1, turn: 0.45, pose: 'walk', silhouette: 'cool', depth: 1.03,
            walk: { at: 0.0, dur: Math.max(1.5, T - 0.4), cadence: 2.8, stride: 12, from: 700, to: 980 }, keys: [{ at: br, pose: 'stand_tense', headTurn: 0.5, dur: 0.4 }] },
          { id: 'dg87_walker_b', x: 980, y: 1600, scale: 0.6, dir: 1, turn: 0.45, pose: 'walk', silhouette: 'cool', depth: 1.04,
            walk: { at: 0.1, dur: Math.max(1.5, T - 0.5), cadence: 2.6, stride: 12, from: 780, to: 1060 }, keys: [{ at: br + 0.1, pose: 'stand_tense', headTurn: 0.5, dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => sedan(470, 1500, 0.78, { t: tt, col: '#2a2e34', exhaust: false, idle: false }) },
          { depth: 0.98, svg: tt => { const k = ease.out(seg(tt, l2, br + 0.2)); return k > 0 ? patrol(lerp(-520, 60, k), 1440, 0.72, tt, 1) : ''; } }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 470, text: 'COLMA, CALIFORNIA · SUN 14 APRIL 2024', fs: 38, sub: 'Police say · three charged, not tried · OCT 2026' },
          { type: 'counter', at: nt - 0.1, dur: 1.1, from: 0, to: 1263, prefix: '', suffix: '', label: 'US BANK ROBBERIES · FBI 2023', y: 800, fs: 120 }
        ],
        tag: TAG
      });
    },

    // 4 - CASE 2's GOTCHA: closer on the stalled car; the engine's last puff on 'ran'; the officer walks in from the right on
    //     'gas' and lifts the boot lid; the clothes with their security tags (the callout); the pair stand with hands behind;
    //     the department's full-tank joke on a label
    dg87_boot(ctx) {
      const t = ctx.t, T = ctx.T, ran = WT(ctx, 0, 3, 1.0), gas = WT(ctx, 0, 6, 1.9), l2 = LS(ctx, 1, 3.2), tags = WT(ctx, 1, 0, 3.2);
      const lid = seg(t, gas + 0.3, gas + 0.9);
      return E.cine.shot(ctx, {
        set: 'dg87_road', setOpts: { view: 'close' }, grade: 'cold', haze: 0.22,
        cam: { from: { x: 8, y: 10, z: 1.0 }, to: { x: 18, y: 18, z: 1.08 } },
        figures: [
          { id: 'dg87_officer_ca', x: 560, y: 1560, scale: 0.9, dir: -1, turn: 0.45, pose: 'walk', expr: 'focused', depth: 1.03, hat: { style: 'cap', color: '#22262e' },
            walk: { at: gas - 0.8, dur: 0.9, cadence: 3.4, stride: 14, from: 1100, to: 560 },
            keys: [{ at: gas + 0.15, pose: 'examine', expr: 'focused', dur: 0.4 }, { at: tags, pose: 'point', expr: 'stern', headTurn: 0.2, dur: 0.4 }, { at: tags + 1.0, pose: 'present', expr: 'determined', dur: 0.4 }] },
          { id: 'dg87_walker_a', x: 930, y: 1500, scale: 0.6, dir: 1, turn: 0.55, pose: 'stand_tense', silhouette: 'cool', depth: 1.02,
            keys: [{ at: ran, headTurn: 0.5, dur: 0.4 }, { at: l2, pose: 'hands_behind', dur: 0.45 }] },
          { id: 'dg87_walker_b', x: 1020, y: 1530, scale: 0.62, dir: 1, turn: 0.55, pose: 'stand_tense', silhouette: 'cool', depth: 1.025,
            keys: [{ at: ran + 0.1, headTurn: 0.5, dur: 0.4 }, { at: l2 + 0.1, pose: 'hands_behind', dur: 0.45 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => sedan(500, 1460, 1.0, { t: tt, col: '#2a2e34', exhaust: false, idle: false, boot: lid }) },
          // the engine's dying puff on 'ran' (the car is facing right; its rear is on the left)
          { depth: 1.0, svg: tt => { const k = seg(tt, ran, ran + 1.0); return k > 0 && k < 1 ? [0, 1, 2].map(i => `<circle cx="${f1(90 - 60 * k - i * 30)}" cy="${f1(1380 - 120 * k - i * 20)}" r="${f1(16 + 44 * k)}" fill="#d8dce4" opacity="${f1(0.4 * (1 - k))}"/>`).join('') : ''; } },
          { depth: 1.01, svg: tt => lid > 0.3 ? clothes(250, 1250, 0.9 * Math.min(1, (lid - 0.3) / 0.5)) : '' }
        ],
        overlays: [
          { type: 'label', at: 0.35, x: 60, y: 470, text: 'DRIVER TOLD OFFICERS: OUT OF GAS', fs: 36, sub: 'Stopped mid-road after two red lights (KTVU, KRON 4)' },
          { type: 'callout', at: tags + 0.3, target: [250, 1190], label: [400, 940], text: 'SECURITY TAGS STILL ON', w: 480, r: 70 },
          { type: 'label', at: tags + 0.8, x: 60, y: 1120, text: 'POLICE: "MAKE SURE YOUR GETAWAY CAR HAS A FULL TANK"', fs: 28, sub: 'Colma PD post, as reported (KTVU, KRON 4, Hoodline)' }
        ],
        tag: TAG
      });
    },

    // 5 - REHOOK + CASE 3: the bank interior; the robber (silhouette) bent over the counter writing on a slip, the teller behind
    //     the glass; he lifts the slip on 'note' and pushes it under the glass on 'slip.'; the FUN FACT
    dg87_bank(ctx) {
      const t = ctx.t, T = ctx.T, dm = WT(ctx, 0, 1, 0.5), note = WT(ctx, 0, 4, 1.6), sl = WT(ctx, 0, 8, 2.9);
      return E.cine.shot(ctx, {
        set: 'dg87_bank', grade: 'warm', haze: 0.25,
        cam: { from: { x: -10, y: 16, z: 1.02 }, to: { x: 12, y: 26, z: 1.08 } },
        figures: [
          { id: 'dg87_teller', x: 760, y: 1190, scale: 0.6, dir: -1, turn: 0.4, pose: 'stand', expr: 'neutral', depth: 0.45,
            keys: [{ at: dm, pose: 'hands_together', expr: 'focused', dur: 0.4 }, { at: note + 0.2, expr: 'worried', headTurn: 0.2, dur: 0.3 }, { at: sl + 0.1, pose: 'present', expr: 'shocked', dur: 0.4 }] },
          { id: 'dg87_robber_pa', x: 520, y: 1600, scale: 0.72, dir: 1, turn: 0.5, pose: 'examine', silhouette: 'cool', depth: 1.02,
            keys: [{ at: 0.2, pose: 'examine', dur: 0.4 }, { at: note, pose: 'read', headTurn: 0.2, dur: 0.4 }, { at: sl, pose: 'present', headTurn: 0.1, dur: 0.4 }] }
        ],
        props: [
          // the slip on the counter under his pen, then slid toward the glass on 'slip.'
          { depth: 1.01, svg: tt => { const k = ease.inOut(seg(tt, sl, sl + 0.5)); return slip(lerp(560, 640, k), lerp(1230, 1160, k), lerp(-6, -2, k), 0, 0.28); } }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'BENTLEYVILLE, PA · THU 15 MARCH 2018', fs: 36, sub: 'Police say · held for trial 2018 · no verdict found' },
          { type: 'funfact', at: note + 0.35, y: 700, rows: [{ text: 'FRIDAY: THE BUSIEST DAY' }, { text: 'FOR US BANK ROBBERIES' }, { text: '280 OF 1,362 INCIDENTS · FBI 2023', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 6 - CASE 3's GOTCHA (the single impact, the music drop): the counter-top close; the slip slides in from the left under
    //     the robber's pen; on 'name' the signature scribbles itself (the callout, the impact); the teller behind the glass goes
    //     from 'present' to shocked; then the casino label
    dg87_slip(ctx) {
      const t = ctx.t, T = ctx.T, sg = WT(ctx, 0, 1, 0.6), nm = WT(ctx, 0, 6, 1.9), l2 = LS(ctx, 1, 3.0), cas = WT(ctx, 1, 5, 4.2);
      const inK = ease.out(seg(t, 0.0, sg + 0.3)), sig = seg(t, nm - 0.05, nm + 0.75), hand = seg(t, 0.0, sg + 0.2) * (1 - seg(t, nm + 0.9, nm + 1.4));
      return E.cine.shot(ctx, {
        set: 'dg87_bank', setOpts: { view: 'counter' }, grade: 'warm', haze: 0.2, dof: true,
        cam: { from: { x: 6, y: 8, z: 1.12 }, to: { x: 14, y: 16, z: 1.2 } },
        rack: { at: 0.05, dur: 0.6, from: 'bg' },
        figures: [
          { id: 'dg87_teller', x: 700, y: 2000, scale: 1.15, dir: -1, turn: 0.35, pose: 'present', expr: 'focused', depth: 0.45,
            keys: [{ at: sg, pose: 'hands_together', expr: 'worried', dur: 0.4 }, { at: nm + 0.3, pose: 'present', expr: 'shocked', headTurn: 0.1, dur: 0.35 }, { at: l2 + 0.2, pose: 'hand_to_face', expr: 'realise', dur: 0.4 }] },
          // the robber's head and shoulder in the near foreground (over-the-shoulder close), leaning over the slip
          { id: 'dg87_robber_pa', x: 60, y: 2290, scale: 1.2, dir: 1, turn: 0.75, pose: 'examine', silhouette: 'cool', depth: 1.0,
            keys: [{ at: sg, pose: 'examine', headTurn: 0.1, dur: 0.4 }, { at: nm + 0.2, pose: 'stand_tense', headTurn: 0.25, dur: 0.45 }, { at: l2 + 0.3, pose: 'hands_together', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.02, svg: tt => slip(lerp(120, 540, inK), lerp(1420, 1290, inK), lerp(-18, -4, inK), sig, 0.9) },
          { depth: 1.03, svg: tt => hand > 0 ? penHand(540, 1290, hand) : '' },
          { depth: 1.025, svg: tt => sig > 0 ? wash(560, 1380, 260, 120, '#fff4d0', f1(0.3 * Math.min(1, sig * 2))) : '' }
        ],
        overlays: [
          { type: 'impact', at: nm + 0.25, x: 560, y: 1380 },
          { type: 'callout', at: nm + 0.4, target: [560, 1385], label: [660, 1000], text: 'HIS OWN NAME', w: 320, r: 70 },
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'THE NOTE WAS SHOWN IN COURT · APRIL 2018', fs: 34, sub: 'Prosecutors: signed with his own name (WPXI, O-R)' },
          { type: 'label', at: l2 + 0.1, x: 60, y: 1120, text: 'ARRESTED THAT EVENING AT A CASINO', fs: 34, sub: 'His friend\'s truck found there · accused, not tried' }
        ],
        tag: TAG
      });
    },

    // 7 - the one closing line on the kerb in frame 1's framing (the loop): the same car, the same silhouette beside it facing
    //     the driver's window; he glances toward us on the callback and is back in frame 1's pose before the last frame; the
    //     camera eases back to frame 1's start; the car is drawn at mirrored time so its hazards and exhaust match frame 0
    dg87_end(ctx) {
      const t = ctx.t, T = ctx.T;
      return E.cine.shot(ctx, {
        set: 'dg87_street', grade: 'cold', haze: 0.28,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.2, T - 0.5) }] },
        figures: [{ ...BESIDE, keys: [{ at: 0.25, pose: 'stand_tense', headTurn: 0.5, dur: 0.4 }, { at: Math.max(1.0, T - 1.1), pose: 'stand_tense', headTurn: 0, dur: 0.5 }] }],
        props: [{ depth: 1.0, accent: true, svg: tt => sedan(CAR.x, CAR.y, CAR.s, { t: Math.max(0, T - tt), driver: true, phone: true, glow: 0.6 }) }],
        // the attribution for the callback, gone (faded) well before the last frame so the loop frame stays clean
        overlays: [{ type: 'label', at: 0.3, until: Math.max(1.2, T - 1.0), x: 60, y: 560, text: 'POLICE SAY: HIS LICENCE WAS SUSPENDED', fs: 34, sub: 'Southfield police (FOX 2, CBS) · accused, not tried' }],
        tag: TAG
      });
    }
  });
})();
