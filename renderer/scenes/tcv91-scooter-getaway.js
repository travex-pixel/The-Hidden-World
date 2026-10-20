/* Case File 91 (premium look, ENGINE V7: promise -> proof -> escalate -> callback, the loop; THE 28-SECOND CUT; THE
   IMPOSSIBLE FRAME 0): DUMBEST GETAWAYS, 3.
   HEADLINE: Kayseri, Turkey, about 4 a.m. on 9 February 2026: a 26-year-old rammed a jewellery shop with a forklift he
   had found on the road, took about 150 grams of gold and rode off through the empty town on a donkey; cameras filmed
   the ride, police identified him from the footage, the gold was recovered; sentenced in May 2026 to nine years seven
   months (first instance). The forklift is the callback.
   CASE 2: Chula Vista, California, 14 October 2019: a bank robber rode off on a Lime rental scooter; arrested three weeks
   later; pleaded guilty; 57 months (June 2020).
   CASE 3 (best last): Austin, Texas, 18 December 2018: police say a 19-year-old robbed a downtown bank and rode off on a
   rental e-scooter; the scooter company's account data for that ride identified him; charged with robbery by threat
   (accused only, no outcome found).
   Structure: frame 0 = THE IMPOSSIBLE PICTURE: a hooded silhouette riding a small donkey side-saddle across a dark Turkish
   street, a glowing sack of gold in his lap (the accent), the jeweller's shutter bent open behind him with a forklift
   nosed into it; the donkey is already walking and the camera already pushing in at 0.0 s. Then the gotcha (the police
   monitoring room: the donkey crosses the camera feeds, the tracking box locks on "tracked"; the sentence label; the
   fun fact), case 2 (the California bank: out of the door and off on the green scooter; closer at dusk: the cuffs and
   the 57-months label), case 3 (downtown Austin: he taps his phone on a rental scooter and rides off; the 157-million
   counter; the detective's desk: the account record on the monitor, the cuffs: the music drop) and the callback on
   frame 1's street (the forklift's beacon blinks on "forklift", the donkey eases back to frame 1's spot and the camera
   eases back to frame 1's start) with the end card.
   Smoothness: cuts and dissolves, one push (into case 3's first beat), one zoom (the end); one slow camera move per
   shot; no shake, no handheld, one impact. Screen direction: the suspects move LEFT TO RIGHT; officers enter from the right.
   Look: episode.look = 'premium', one cool pre-dawn palette (shadow #101a2a, mid #c2b8a6, accent #f0b429). The strongly
   coloured object is the sack of gold (accent: true) in the hook and the end; the green scooters and the tracking box
   carry the accent in their shots.
   Content rules: the three men are dark silhouettes tagged NOT A LIKENESS and never named; the officers and the detective
   are generic figures; no weapon, no force beyond hands behind the back, no victim shown; the donkey is calm and unhurt;
   the forklift sits still in the shutter (the ramming is not shown); the scooters are plain green and blank (no company
   name, logo or app interface); the camera feeds and the account record are our own drawings, not real footage or data.
   New environments (E.registerSets): sg91_street (a Turkish town street before dawn with a jeweller's shop and a forklift
   in its shutter), sg91_cctv_room (a police camera-monitoring room), sg91_bank (a California bank front; view 'wide' by day
   or 'close' at dusk), sg91_downtown (downtown Austin at dusk with a bank and a scooter dock), sg91_office (a detective's
   office at night). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#0e1218';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · NOT A LIKENESS';
  const GEN = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#f0b429';
  const GREEN = '#5fd36a';
  const TYPE = 'font-family="Nunito" font-weight="800"';
  const flashAt = (tt, a) => (tt >= a && tt < a + 0.45 ? Math.pow(1 - (tt - a) / 0.45, 2) : 0);
  const sm = k => k * k * (3 - 2 * k);

  // ---------- the hero: a small donkey (generic, calm) walking right; cx the body centre, gy the hoof line, ph the gait phase
  const DK = { bodyRx: 215, bodyRy: 95, bodyUp: 290 };
  function donkey(cx, gy, ph) {
    const bob = Math.sin(ph * 2) * 3, by = gy - DK.bodyUp + bob;
    const COAT = '#b5aa9c', DARK = '#7d7368', PALE = '#d8d0c4';
    const leg = (lx, off, near) => {
      const sw = Math.sin(ph + off) * 48, lift = Math.max(0, Math.cos(ph + off)) * 26;
      const col = near ? COAT : DARK;
      return `<path d="M${f1(lx)} ${f1(by + 40)} L${f1(lx + sw * 0.45)} ${f1(gy - 150)} L${f1(lx + sw)} ${f1(gy - lift)}" fill="none" stroke="${col}" stroke-width="42" stroke-linecap="round" stroke-linejoin="round"/>` +
        `<path d="M${f1(lx)} ${f1(by + 40)} L${f1(lx + sw * 0.45)} ${f1(gy - 150)} L${f1(lx + sw)} ${f1(gy - lift)}" fill="none" stroke="${INK}" stroke-width="50" stroke-linecap="round" stroke-linejoin="round" opacity="0.35"/>` +
        `<ellipse cx="${f1(lx + sw + 4)}" cy="${f1(gy - lift - 6)}" rx="26" ry="14" fill="#2a2420" stroke="${INK}" stroke-width="3"/>`;
    };
    let g = `<g>`;
    g += `<ellipse cx="${f1(cx)}" cy="${f1(gy + 4)}" rx="${DK.bodyRx + 120}" ry="30" fill="#000" opacity="0.4"/>`;
    // far legs, then the body, then the near legs
    g += leg(cx - 140, 0.0, false) + leg(cx + 150, Math.PI, false);
    // tail
    g += `<path d="M${f1(cx - 205)} ${f1(by - 30)} Q${f1(cx - 260)} ${f1(by + 60)} ${f1(cx - 250 + Math.sin(ph) * 8)} ${f1(by + 170)}" fill="none" stroke="${DARK}" stroke-width="16" stroke-linecap="round"/><ellipse cx="${f1(cx - 250 + Math.sin(ph) * 8)}" cy="${f1(by + 185)}" rx="18" ry="30" fill="#4a4038"/>`;
    g += `<ellipse cx="${f1(cx)}" cy="${f1(by)}" rx="${DK.bodyRx}" ry="${DK.bodyRy}" fill="${COAT}" stroke="${INK}" stroke-width="6"/>`;
    g += `<ellipse cx="${f1(cx + 10)}" cy="${f1(by + 50)}" rx="${DK.bodyRx - 60}" ry="46" fill="${PALE}" opacity="0.7"/>`;
    g += `<path d="M${f1(cx - 200)} ${f1(by - 60)} Q${f1(cx)} ${f1(by - 100)} ${f1(cx + 200)} ${f1(by - 60)}" fill="none" stroke="${DARK}" stroke-width="8" opacity="0.6"/>`;   // the dorsal stripe
    // the neck and the head (facing right)
    g += `<path d="M${f1(cx + 170)} ${f1(by - 40)} Q${f1(cx + 240)} ${f1(by - 110)} ${f1(cx + 285)} ${f1(by - 135)}" fill="none" stroke="${COAT}" stroke-width="98" stroke-linecap="round"/><path d="M${f1(cx + 170)} ${f1(by - 40)} Q${f1(cx + 240)} ${f1(by - 110)} ${f1(cx + 285)} ${f1(by - 135)}" fill="none" stroke="${INK}" stroke-width="106" stroke-linecap="round" opacity="0.35"/>`;
    for (let i = 0; i < 6; i++) { const k = i / 5; const mx = cx + 150 + k * 125, my = by - 82 - k * 95; g += `<path d="M${f1(mx)} ${f1(my)} L${f1(mx - 10)} ${f1(my - 26)}" stroke="#4a4038" stroke-width="7" stroke-linecap="round"/>`; }   // the mane
    g += `<g transform="translate(${f1(cx + 318)} ${f1(by - 150)}) rotate(22)"><ellipse cx="0" cy="0" rx="92" ry="52" fill="${COAT}" stroke="${INK}" stroke-width="6"/><ellipse cx="62" cy="8" rx="44" ry="36" fill="${PALE}" stroke="${INK}" stroke-width="4"/><circle cx="-18" cy="-14" r="8" fill="${INK}"/><circle cx="-21" cy="-17" r="3" fill="#fff"/><circle cx="82" cy="4" r="5" fill="#5a5048"/>`;
    g += `<ellipse cx="-50" cy="-82" rx="20" ry="58" transform="rotate(-18 -50 -82)" fill="${COAT}" stroke="${INK}" stroke-width="5"/><ellipse cx="-50" cy="-82" rx="9" ry="40" transform="rotate(-18 -50 -82)" fill="#c9a0a0" opacity="0.6"/>`;
    g += `<ellipse cx="-14" cy="-88" rx="20" ry="58" transform="rotate(8 -14 -88)" fill="${COAT}" stroke="${INK}" stroke-width="5"/><ellipse cx="-14" cy="-88" rx="9" ry="40" transform="rotate(8 -14 -88)" fill="#c9a0a0" opacity="0.6"/>`;
    g += `<path d="M-60 10 Q-30 40 40 34" fill="none" stroke="#6a5a4a" stroke-width="5"/></g>`;   // the halter
    // the saddle blanket (muted red, pale stripes) under the rider
    g += `<g transform="translate(${f1(cx - 20)} ${f1(by - 70)}) rotate(-4)"><rect x="-120" y="-30" width="240" height="120" rx="14" fill="#7a2e2e" stroke="${INK}" stroke-width="5"/><rect x="-120" y="10" width="240" height="14" fill="#d8c8a8" opacity="0.7"/><rect x="-120" y="50" width="240" height="14" fill="#d8c8a8" opacity="0.7"/></g>`;
    g += leg(cx - 160, Math.PI, true) + leg(cx + 130, 0.0, true);
    return g + '</g>';
  }
  // the sack of gold on the rider's lap (the accent object): centre (x, y), width w, o.glow 0..1
  function goldSack(x, y, w, o = {}) {
    const glow = o.glow ?? 1, h = w * 0.9;
    let g = wash(x, y, w * 1.6, h * 1.4, '#ffd27a', f1(0.26 * glow)) + wash(x, y, w * 0.9, h * 0.8, '#fff0c0', f1(0.18 * glow));
    g += `<path d="M${f1(x - w / 2)} ${f1(y + h / 2)} Q${f1(x - w * 0.6)} ${f1(y - h * 0.1)} ${f1(x - w * 0.2)} ${f1(y - h * 0.4)} L${f1(x + w * 0.2)} ${f1(y - h * 0.4)} Q${f1(x + w * 0.6)} ${f1(y - h * 0.1)} ${f1(x + w / 2)} ${f1(y + h / 2)} Z" fill="#c9b48a" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M${f1(x - w * 0.2)} ${f1(y - h * 0.4)} Q${f1(x)} ${f1(y - h * 0.52)} ${f1(x + w * 0.2)} ${f1(y - h * 0.4)}" fill="none" stroke="#6a5a3a" stroke-width="8"/>`;   // the tie
    const r = R(9101);
    for (let i = 0; i < 9; i++) { const gx = x - w * 0.28 + r() * w * 0.56, gy2 = y - h * 0.46 - r() * 30; g += `<circle cx="${f1(gx)}" cy="${f1(gy2)}" r="${f1(8 + r() * 9)}" fill="${ACC}" stroke="#8a6a1a" stroke-width="2"/>`; }
    g += `<circle cx="${f1(x + w * 0.1)}" cy="${f1(y - h * 0.56)}" r="6" fill="#fff8e0" opacity="${f1(0.9 * glow)}"/><circle cx="${f1(x - w * 0.2)}" cy="${f1(y - h * 0.5)}" r="4" fill="#fff8e0" opacity="${f1(0.7 * glow)}"/>`;
    return g;
  }
  // a plain stand-up rental e-scooter (generic, blank: no company name or logo); rear wheel at (x, gy); o.lit the lamp
  function scooter(x, gy, s = 1, o = {}) {
    const lit = o.lit ?? 0;
    let g = `<g transform="translate(${f1(x)} ${f1(gy)}) scale(${s})">`;
    g += `<ellipse cx="90" cy="6" rx="190" ry="14" fill="#000" opacity="0.35"/>`;
    g += `<circle cx="0" cy="-28" r="30" fill="#1a1e24" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="-28" r="10" fill="#4a5058"/>`;
    g += `<circle cx="250" cy="-28" r="30" fill="#1a1e24" stroke="${INK}" stroke-width="5"/><circle cx="250" cy="-28" r="10" fill="#4a5058"/>`;
    g += `<rect x="20" y="-52" width="210" height="22" rx="8" fill="${GREEN}" stroke="${INK}" stroke-width="5"/>`;   // the deck
    g += `<path d="M232 -44 L300 -520" stroke="${GREEN}" stroke-width="22" stroke-linecap="round"/><path d="M232 -44 L300 -520" stroke="${INK}" stroke-width="28" stroke-linecap="round" opacity="0.35"/>`;   // the stem
    g += `<rect x="236" y="-544" width="130" height="24" rx="10" fill="#2a2e34" stroke="${INK}" stroke-width="4"/>`;   // the bars
    g += `<circle cx="300" cy="-480" r="12" fill="${lit ? '#fff2c0' : '#55606a'}"/>` + (lit ? wash(300, -480, 120, 90, '#fff2c0', f1(0.4 * lit)) : '');
    return g + '</g>';
  }
  // the rental account record on a monitor (our own typed, redacted layout): local 0..w x 0..h; k the highlight 0..1
  function record(w, h, k) {
    const fs = h * 0.09, rows = [['RENTAL ACCOUNT', ''], ['NAME', '██████ ██████'], ['PHONE', '(███) ███-████'], ['EMAIL', '██████@██████'], ['CARD', '•••• •••• •••• ████'], ['GPS', 'MATCHED']];
    let g = `<rect x="0" y="0" width="${w}" height="${h}" fill="#0f1a28"/>`;
    rows.forEach(([a, b], i) => {
      const y = h * 0.14 + i * h * 0.15, hl = i === 1 ? k : 0;
      if (hl > 0) g += `<rect x="${f1(w * 0.03)}" y="${f1(y - fs * 0.95)}" width="${f1(w * 0.94)}" height="${f1(fs * 1.4)}" rx="6" fill="${ACC}" opacity="${f1(0.22 * hl)}"/>`;
      g += `<text x="${f1(w * 0.06)}" y="${f1(y)}" ${TYPE} font-size="${f1(fs)}" fill="${i === 0 ? ACC : hl > 0.5 ? ACC : '#9fb0c4'}" letter-spacing="2">${a}</text>`;
      g += `<text x="${f1(w * 0.36)}" y="${f1(y)}" ${TYPE} font-size="${f1(fs)}" fill="${hl > 0.5 ? '#fff' : '#5e728a'}">${b}</text>`;
    });
    return g;
  }

  // the hero figure (the same in the hook and the end scene: the loop) and the camera it loops on
  const GY = 1500;                                    // the hoof line
  const RX0 = 400, RY = GY - 141;                     // the rider's feet (sit pose: hips 244 px up at scale 0.54, on the donkey's back)
  const HERO_FIG = { id: 'sg91_rider', x: RX0, y: RY, scale: 0.54, dir: 1, turn: 0.45, pose: 'sit', noChair: true, silhouette: 'cool', depth: 1.0 };
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 0, y: -16, z: 1.09 };
  // the gait: the donkey drifts dx over the shot and bobs; the rider gets the same path as keys (one per quarter second)
  function gaitKeys(T, x0, x1, extra = []) {
    const n = Math.max(2, Math.round(T / 0.25)), keys = [];
    for (let i = 1; i <= n; i++) { const at = Math.min(T, i * 0.25); keys.push({ at: at - 0.25, x: lerp(x0, x1, at / T), y: RY + (i % 2 ? -6 : 0), dur: 0.25 }); }
    return keys.concat(extra);
  }
  const gaitX = (t, T, x0, x1) => { const i = Math.floor(t / 0.25), a = i * 0.25, b = Math.min(T, a + 0.25); return lerp(lerp(x0, x1, Math.min(T, a) / T), lerp(x0, x1, b / T), sm(clamp((t - a) / 0.25, 0, 1))); };
  const gaitY = (t) => { const i = Math.floor(t / 0.25), k = sm(clamp((t - i * 0.25) / 0.25, 0, 1)); return ((i + 1) % 2 ? -6 : 0) * k + ((i % 2) ? -6 : 0) * (1 - k); };
  // the end scene: the same gait up to Ts = T - 0.3, then one last key settles the rider exactly on frame 1's spot (x1, RY)
  function settleKeys(T, x0, x1, extra = []) {
    const Ts = T - 0.3, n = Math.max(1, Math.floor(Ts / 0.25)), keys = [];
    for (let i = 1; i <= n; i++) { const at = i * 0.25; keys.push({ at: at - 0.25, x: lerp(x0, x1, at / Ts), y: RY + (i % 2 ? -6 : 0), dur: 0.25 }); }
    keys.push({ at: Ts, x: x1, y: RY, dur: 0.3 });
    return keys.concat(extra);
  }
  function settleGait(t, T, x0, x1) {
    const Ts = T - 0.3, n = Math.max(1, Math.floor(Ts / 0.25)), tn = n * 0.25;
    if (t <= tn) return { x: gaitX(t, Ts, x0, x1), y: gaitY(t) };
    const k = sm(clamp((t - Ts) / 0.3, 0, 1)), xa = gaitX(tn, Ts, x0, x1), ya = gaitY(tn);
    if (t <= Ts) return { x: xa, y: ya };
    return { x: lerp(xa, x1, k), y: lerp(ya, 0, k) };
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a Turkish town street before dawn: stars, a distant dome and minaret, a row of shuttered shops, the jeweller's bent
    // shutter with a forklift nosed into it (o.beacon 0..1 lights its amber beacon), a street lamp, cobbles
    sg91_street(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), bc = o.beacon || 0;
      let sky = `<defs><linearGradient id="sg91sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070d1c"/><stop offset="1" stop-color="#1a2744"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1400" fill="url(#sg91sk)"/>` + E.cine.stars(t, 70, 9101, -200, 640) + `<circle cx="900" cy="300" r="34" fill="#f3ecd8" opacity="0.9"/><circle cx="900" cy="300" r="110" fill="#f3ecd8" opacity="0.05"/>`;
      // the far skyline: low roofs, a dome and a minaret (generic)
      let far = `<path d="M-400 760 L120 760 L120 700 L260 700 L260 760 L520 760 L520 690 Q600 600 680 690 L680 760 L1040 760 L1040 730 L1070 730 L1070 420 L1082 400 L1094 420 L1094 730 L1130 730 L1130 760 L${W + 400} 760 L${W + 400} 900 L-400 900 Z" fill="#141c30"/>`;
      far += `<rect x="1066" y="470" width="30" height="8" fill="#0d1322"/><rect x="1066" y="560" width="30" height="8" fill="#0d1322"/>`;
      // the shop row: facades with closed shutters; the jeweller (x 120-560) with its shutter bent open and the window smashed
      let shops = `<rect x="-400" y="600" width="${W + 800}" height="560" fill="#3a3a42" stroke="${INK}" stroke-width="5"/><rect x="-400" y="600" width="${W + 800}" height="24" fill="#2a2a32"/>`;
      [[-380, 460], [600, 300], [940, 520]].forEach(([x, w]) => {
        shops += `<rect x="${x}" y="700" width="${w}" height="440" fill="#2c2c34" stroke="${INK}" stroke-width="5"/>`;
        for (let y = 712; y < 1130; y += 26) shops += `<rect x="${x + 8}" y="${y}" width="${w - 16}" height="12" fill="#3a3a44"/>`;
        shops += `<rect x="${x + 20}" y="630" width="${w - 40}" height="50" rx="6" fill="#4a4a54" stroke="${INK}" stroke-width="3"/>`;
      });
      // the jeweller: a sign band, a dark window with dim gold glints, the shutter slats curled up over the smashed part
      shops += `<rect x="120" y="700" width="440" height="440" fill="#1a1612" stroke="${INK}" stroke-width="6"/>`;
      shops += `<rect x="130" y="630" width="420" height="56" rx="6" fill="#5a4a2a" stroke="${INK}" stroke-width="4"/><text x="340" y="672" text-anchor="middle" ${TYPE} font-size="36" letter-spacing="8" fill="#e8d8a8">KUYUMCU</text>`;
      shops += wash(340, 900, 300, 220, '#ffd27a', 0.06);
      [[200, 980], [260, 1040], [330, 960], [400, 1030], [470, 990], [300, 1090], [430, 1095]].forEach(([x, y]) => { shops += `<circle cx="${x}" cy="${y}" r="7" fill="#c9a356" opacity="0.7"/><circle cx="${x + 10}" cy="${y + 12}" r="4" fill="#c9a356" opacity="0.5"/>`; });
      for (let y = 712; y < 860; y += 26) shops += `<rect x="128" y="${y}" width="424" height="12" fill="#3a3a44"/>`;   // the intact top slats
      shops += `<path d="M128 872 Q200 940 150 1000 Q110 1050 170 1060" fill="none" stroke="#4a4a54" stroke-width="14"/><path d="M552 872 Q470 920 520 980 Q560 1030 500 1050" fill="none" stroke="#4a4a54" stroke-width="14"/>`;   // the curled slats
      [[180, 1120, 40], [250, 1135, 28], [330, 1128, 36], [430, 1140, 30], [500, 1125, 24]].forEach(([x, y, w]) => { shops += `<path d="M${x} ${y} L${x + w} ${y - 12} L${x + w * 0.6} ${y + 10} Z" fill="#9fb7cc" opacity="0.6"/>`; });   // glass on the step
      shops += `<rect x="-400" y="1140" width="${W + 800}" height="24" fill="#5a5a60" stroke="${INK}" stroke-width="3"/>`;
      // the forklift (dull olive, generic), side on, its mast and forks in the shutter gap; the amber beacon on the cab roof
      let fork = `<g transform="translate(60 1150)">`;
      fork += `<ellipse cx="150" cy="4" rx="230" ry="18" fill="#000" opacity="0.45"/>`;
      fork += `<rect x="-20" y="-150" width="280" height="110" rx="10" fill="#6a6a2e" stroke="${INK}" stroke-width="6"/><rect x="0" y="-320" width="200" height="180" rx="8" fill="none" stroke="#4a4a22" stroke-width="16"/><rect x="40" y="-300" width="120" height="140" fill="#1a2030" opacity="0.6"/>`;
      fork += `<rect x="260" y="-380" width="26" height="340" fill="#5a5a28" stroke="${INK}" stroke-width="4"/><rect x="300" y="-380" width="26" height="340" fill="#5a5a28" stroke="${INK}" stroke-width="4"/><rect x="250" y="-392" width="90" height="16" fill="#4a4a22"/>`;   // the mast (in the shutter gap)
      fork += `<rect x="286" y="-120" width="190" height="14" fill="#8a8a7a" stroke="${INK}" stroke-width="3"/><rect x="286" y="-70" width="190" height="14" fill="#8a8a7a" stroke="${INK}" stroke-width="3"/>`;   // the forks
      fork += `<circle cx="40" cy="-30" r="44" fill="#1a1a1e" stroke="${INK}" stroke-width="5"/><circle cx="40" cy="-30" r="16" fill="#4a4a50"/><circle cx="220" cy="-30" r="44" fill="#1a1a1e" stroke="${INK}" stroke-width="5"/><circle cx="220" cy="-30" r="16" fill="#4a4a50"/>`;
      fork += `<rect x="-26" y="-200" width="60" height="40" rx="6" fill="#2a2a2e" stroke="${INK}" stroke-width="3"/>`;   // the seat back
      fork += `<rect x="80" y="-346" width="40" height="26" rx="6" fill="${bc > 0.3 ? '#ffb020' : '#6a4a10'}" stroke="${INK}" stroke-width="3"/>` + (bc > 0 ? wash(100, -340, 240, 180, '#ffb020', f1(0.35 * bc)) : '');
      fork += `</g>`;
      // the street lamp (right) and its warm pool
      let lamp = `<rect x="1010" y="520" width="16" height="640" fill="#2a2e34"/><path d="M1018 520 L960 504" stroke="#2a2e34" stroke-width="10"/><ellipse cx="950" cy="508" rx="34" ry="10" fill="#ffc870"/>` + wash(950, 760, 340, 520, '#ffb050', 0.1);
      let ground = `<rect x="-400" y="1164" width="${W + 800}" height="${H}" fill="#23262e"/>`;
      const r = R(9102);
      for (let y = 1190; y < H + 80; y += 46) { const w = 40 + (y - 1190) * 0.09; for (let x = -400 + ((y / 46) % 2) * w * 0.5; x < W + 400; x += w) ground += `<rect x="${f1(x)}" y="${y}" width="${f1(w - 6)}" height="${f1(34 + (y - 1190) * 0.04)}" rx="6" fill="${['#2a2e36', '#262a32', '#2e3038'][Math.floor(r() * 3)]}"/>`; }
      ground += wash(950, 1420, 520, 180, '#ffb050', 0.05);
      return { light: { dir: -1, rim: '#9fc8ff', key: '#c8d4e8' }, layers: [[0.05, sky], [0.2, far], [0.45, shops], [0.6, fork], [0.55, lamp], [0.9, ground]] };
    },

    // a police camera-monitoring room at night: a dark wall with a 3 x 2 bank of camera feeds (their pictures are drawn in
    // the shot), a long console desk, a desk lamp
    sg91_cctv_room(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#131a26"/>`;
      wall += `<rect x="-400" y="760" width="${W + 800}" height="60" fill="#1b2330"/>`;
      [[90, 300], [400, 300], [710, 300], [90, 540], [400, 540], [710, 540]].forEach(([x, y]) => { wall += `<rect x="${x - 10}" y="${y - 10}" width="320" height="220" rx="8" fill="#2a3040" stroke="${INK}" stroke-width="5"/><rect x="${x}" y="${y}" width="300" height="200" fill="#0b121c"/>`; });
      let desk = `<rect x="-400" y="1180" width="${W + 800}" height="70" rx="6" fill="#2a3040" stroke="${INK}" stroke-width="6"/><rect x="-400" y="1250" width="${W + 800}" height="${H}" fill="#1a2030"/>`;
      desk += `<rect x="520" y="860" width="420" height="280" rx="10" fill="#2a3040" stroke="${INK}" stroke-width="6"/><rect x="536" y="876" width="388" height="248" fill="#0f1a28"/>`;
      for (let i = 0; i < 5; i++) desk += `<rect x="560" y="${900 + i * 40}" width="${200 - (i % 2) * 60}" height="12" rx="4" fill="#2e4a66"/>`;
      desk += `<rect x="700" y="1140" width="60" height="40" fill="#3a4050" stroke="${INK}" stroke-width="4"/><rect x="620" y="1176" width="220" height="14" rx="6" fill="#3a4050" stroke="${INK}" stroke-width="4"/>`;
      desk += `<rect x="40" y="1120" width="240" height="60" rx="8" fill="#20262f" stroke="${INK}" stroke-width="4"/>` + Array.from({ length: 10 }, (_, i) => `<rect x="${56 + i * 22}" y="1136" width="14" height="14" rx="3" fill="#3a4454"/>`).join('');
      desk += `<g transform="translate(1000 1180)"><rect x="-10" y="-300" width="14" height="300" fill="#3a4048"/><path d="M-60 -300 L80 -300 L60 -230 L-40 -230 Z" fill="#e8d8a8" stroke="${INK}" stroke-width="4"/></g>` + wash(1010, 1000, 240, 260, '#ffd090', 0.14);
      return { light: { dir: 1, rim: '#7ac7e8', key: '#c8d4e8' }, layers: [[0.25, wall], [0.9, desk]] };
    },

    // a California bank front: o.view 'wide' = a pale daytime sky, a flat-roofed bank with BANK in plain type and a glass
    // door, two palms, a kerb and a road; 'close' = the same kerb at dusk, framed close on the pavement and a bench
    sg91_bank(ctx, o = {}) {
      const close = o.view === 'close';
      if (!close) {
        let sky = `<defs><linearGradient id="sg91dy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7f9fbf"/><stop offset="1" stop-color="#c9d6dc"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#sg91dy)"/>`;
        sky += `<ellipse cx="200" cy="420" rx="160" ry="40" fill="#e8eef2" opacity="0.6"/><ellipse cx="900" cy="330" rx="200" ry="46" fill="#e8eef2" opacity="0.5"/>`;
        let bank = `<rect x="160" y="560" width="760" height="600" fill="#b9b0a0" stroke="${INK}" stroke-width="6"/><rect x="140" y="540" width="800" height="40" fill="#8a8274" stroke="${INK}" stroke-width="5"/>`;
        bank += `<text x="540" y="690" text-anchor="middle" ${TYPE} font-size="92" letter-spacing="18" fill="#2a3038">BANK</text>`;
        bank += `<rect x="560" y="820" width="200" height="340" fill="#4a6a8a" stroke="${INK}" stroke-width="6"/><path d="M660 820 L660 1160" stroke="${INK}" stroke-width="6"/><rect x="580" y="840" width="60" height="300" fill="#7fa0bf" opacity="0.5"/>`;
        [[240, 760], [380, 760], [800, 760]].forEach(([x, y]) => { bank += `<rect x="${x}" y="${y}" width="90" height="140" fill="#2a3a4a" stroke="${INK}" stroke-width="4"/><rect x="${x + 10}" y="${y + 10}" width="30" height="120" fill="#7fa0bf" opacity="0.4"/>`; });
        bank += `<rect x="-400" y="1160" width="${W + 800}" height="140" fill="#cfc8b8" stroke="${INK}" stroke-width="4"/>`;
        const palm = (x, h) => { let p = `<path d="M${x} 1160 Q${x + 20} ${1160 - h * 0.5} ${x + 10} ${1160 - h}" fill="none" stroke="#5a4a3a" stroke-width="22" stroke-linecap="round"/>`; for (let i = 0; i < 7; i++) { const a = -2.6 + i * 0.75; p += `<path d="M${x + 10} ${1160 - h} Q${f1(x + 10 + Math.cos(a) * 110)} ${f1(1160 - h + Math.sin(a) * 110 - 40)} ${f1(x + 10 + Math.cos(a) * 200)} ${f1(1160 - h + Math.sin(a) * 160 + 30)}" fill="none" stroke="#3a6a44" stroke-width="16" stroke-linecap="round"/>`; } return p; };
        let mid = palm(60, 700) + palm(1000, 620);
        let ground = `<rect x="-400" y="1300" width="${W + 800}" height="50" fill="#9a9488" stroke="${INK}" stroke-width="4"/><rect x="-400" y="1350" width="${W + 800}" height="${H}" fill="#3a3c42"/><path d="M-400 1720 L${W + 400} 1720" stroke="#d8d4c4" stroke-width="8" stroke-dasharray="120 90" opacity="0.25"/>`;
        return { light: { dir: -1, rim: '#fff3d0', key: '#f0ece0' }, layers: [[0.05, sky], [0.4, bank], [0.5, mid], [0.9, ground]] };
      }
      let wall = `<defs><linearGradient id="sg91du" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2e48"/><stop offset="1" stop-color="#6a4a5a"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1000" fill="url(#sg91du)"/>`;
      wall += `<rect x="-400" y="520" width="${W + 800}" height="760" fill="#8a8072" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M-400 ${620 + i * 130} L${W + 400} ${620 + i * 130}" stroke="#6e6658" stroke-width="4"/>`).join('');
      wall += `<rect x="640" y="640" width="300" height="420" fill="#2a3a4a" stroke="${INK}" stroke-width="6"/><rect x="660" y="660" width="80" height="380" fill="#ffd9a0" opacity="0.25"/>`;
      let bench = `<rect x="60" y="1040" width="420" height="40" rx="6" fill="#4a3c30" stroke="${INK}" stroke-width="5"/><rect x="80" y="1080" width="26" height="200" fill="#3a2c22"/><rect x="434" y="1080" width="26" height="200" fill="#3a2c22"/>`;
      let ground = `<rect x="-400" y="1280" width="${W + 800}" height="60" fill="#9a9488" stroke="${INK}" stroke-width="4"/><rect x="-400" y="1340" width="${W + 800}" height="${H}" fill="#2e3036"/>` + wash(760, 900, 360, 420, '#ffd9a0', 0.08);
      return { light: { dir: -1, rim: '#ffd9a0', key: '#e8d8c8' }, layers: [[0.25, wall], [0.6, bench], [0.9, ground]] };
    },

    // downtown Austin at dusk (generic): tall buildings with lit windows, a bank front at the left with BANK in plain type,
    // a kerb (the scooter dock is drawn in the shot)
    sg91_downtown(ctx, o = {}) {
      let sky = `<defs><linearGradient id="sg91dt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2240"/><stop offset="1" stop-color="#7a5a6a"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#sg91dt)"/>`;
      const r = R(9103); let far = '';
      [[-300, 300, 360], [40, 160, 420], [440, 60, 300], [720, 220, 360], [1060, 120, 400]].forEach(([x, y, w]) => {
        far += `<rect x="${x}" y="${y}" width="${w}" height="${1100 - y}" fill="#1c2236" stroke="${INK}" stroke-width="4"/>`;
        for (let yy = y + 40; yy < 1060; yy += 60) for (let xx = x + 24; xx < x + w - 40; xx += 56) if (r() < 0.45) far += `<rect x="${xx}" y="${yy}" width="30" height="34" fill="${r() < 0.6 ? '#ffd9a0' : '#9fc8ff'}" opacity="${f1(0.35 + r() * 0.4)}"/>`;
      });
      let bank = `<rect x="-400" y="700" width="900" height="500" fill="#4a4a54" stroke="${INK}" stroke-width="6"/><rect x="-400" y="680" width="900" height="36" fill="#2e2e38" stroke="${INK}" stroke-width="5"/>`;
      bank += `<text x="240" y="830" text-anchor="middle" ${TYPE} font-size="84" letter-spacing="16" fill="#e0dcd0">BANK</text><rect x="120" y="940" width="200" height="260" fill="#2a3a4a" stroke="${INK}" stroke-width="6"/><rect x="140" y="960" width="60" height="220" fill="#ffd9a0" opacity="0.3"/>`;
      bank += `<rect x="-400" y="1200" width="${W + 800}" height="100" fill="#8a8478" stroke="${INK}" stroke-width="4"/>`;
      let ground = `<rect x="-400" y="1300" width="${W + 800}" height="50" fill="#9a9488" stroke="${INK}" stroke-width="4"/><rect x="-400" y="1350" width="${W + 800}" height="${H}" fill="#2a2c34"/><path d="M-400 1720 L${W + 400} 1720" stroke="#d8d4c4" stroke-width="8" stroke-dasharray="120 90" opacity="0.2"/>` + wash(640, 1500, 700, 200, '#ffd9a0', 0.05);
      return { light: { dir: -1, rim: '#ffd9a0', key: '#d8d0e0' }, layers: [[0.05, sky], [0.25, far], [0.5, bank], [0.9, ground]] };
    },

    // a detective's office at night: a corkboard at the left, a window with city lights at the right, a desk with a big
    // monitor (the record is drawn in the shot), a desk lamp
    sg91_office(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#2e3440"/>`;
      wall += `<rect x="60" y="280" width="360" height="400" fill="#6a5a4a" stroke="${INK}" stroke-width="5"/>` + [[80, 300], [220, 310], [100, 480], [240, 490]].map(([x, y]) => `<rect x="${x}" y="${y}" width="120" height="150" fill="#e8e2d6" stroke="${INK}" stroke-width="2"/><rect x="${x + 14}" y="${y + 24}" width="90" height="8" fill="#a8a29a"/><rect x="${x + 14}" y="${y + 46}" width="70" height="8" fill="#a8a29a"/>`).join('');
      wall += `<rect x="700" y="260" width="320" height="480" fill="#0f1726" stroke="${INK}" stroke-width="8"/>`;
      const r = R(9104); for (let i = 0; i < 40; i++) wall += `<rect x="${f1(712 + r() * 290)}" y="${f1(300 + r() * 400)}" width="10" height="12" fill="${r() < 0.6 ? '#ffd9a0' : '#9fc8ff'}" opacity="${f1(0.3 + r() * 0.5)}"/>`;
      wall += `<path d="M860 260 L860 740 M700 500 L1020 500" stroke="#4a5060" stroke-width="8"/>`;
      let desk = `<rect x="-400" y="1180" width="${W + 800}" height="70" rx="6" fill="#4a3c30" stroke="${INK}" stroke-width="6"/><rect x="-400" y="1250" width="${W + 800}" height="${H}" fill="#2a2420"/>`;
      desk += `<rect x="640" y="1100" width="60" height="80" fill="#3a4050" stroke="${INK}" stroke-width="4"/><rect x="560" y="1170" width="220" height="16" rx="6" fill="#3a4050" stroke="${INK}" stroke-width="4"/>`;
      desk += `<rect x="440" y="700" width="420" height="400" rx="10" fill="#2a3040" stroke="${INK}" stroke-width="6"/>`;
      desk += `<rect x="40" y="1120" width="240" height="60" rx="8" fill="#20262f" stroke="${INK}" stroke-width="4"/>` + Array.from({ length: 10 }, (_, i) => `<rect x="${56 + i * 22}" y="1136" width="14" height="14" rx="3" fill="#3a4454"/>`).join('');
      desk += `<g transform="translate(980 1180)"><rect x="-10" y="-300" width="14" height="300" fill="#3a4048"/><path d="M-60 -300 L80 -300 L60 -230 L-40 -230 Z" fill="#e8d8a8" stroke="${INK}" stroke-width="4"/></g>` + wash(990, 1000, 240, 260, '#ffd090', 0.14);
      return { light: { dir: 1, rim: '#9fc8ff', key: '#dcd4c8' }, layers: [[0.25, wall], [0.9, desk]] };
    }
  });

  E.registerScenes({
    // 1 - HOOK (frame 0): the street; the rider and donkey already walking right with the sack of gold glowing; the camera
    //     already pushing in; on line 2 he looks back at the shop and the gold catches the light
    sg91_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.3), gr = WT(ctx, 1, 2, 2.9);
      const DX = 70;
      return E.cine.shot(ctx, {
        set: 'sg91_street', grade: 'night', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [
          { ...HERO_FIG, keys: gaitKeys(T, RX0, RX0 + DX, [{ at: l2 + 0.05, headTurn: -0.45, dur: 0.4 }, { at: gr + 0.6, headTurn: 0.15, dur: 0.4 }]) }
        ],
        props: [
          { depth: 0.995, svg: tt => donkey(gaitX(tt, T, RX0, RX0 + DX) + 30, GY + gaitY(tt), tt * 7.5) },
          { depth: 1.01, accent: true, svg: tt => goldSack(gaitX(tt, T, RX0, RX0 + DX) + 95, RY - 250 + gaitY(tt), 150, { glow: 0.85 + 0.15 * Math.sin(tt * 3) + 0.5 * flashAt(tt, gr) }) }
        ],
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.25), x: 60, y: 540, text: 'KAYSERI, TURKEY · 9 FEB 2026', fs: 30, sub: 'About 4 a.m. · 150 g of gold (DHA, NTV, Gulf News)' }
        ],
        tag: TAG
      });
    },

    // 2 - THE GOTCHA: the monitoring room, close on the officer; the donkey crosses the camera feeds one after another;
    //     on "tracked" the tracking box locks and flashes (the single impact) and he points; on "Sentence" he sits back
    //     with his arms crossed; the sentence label; the fun-fact card
    sg91_cctv(ctx) {
      const t = ctx.t, T = ctx.T, tr = WT(ctx, 0, 1, 0.9), se = WT(ctx, 0, 3, 2.2), nn = WT(ctx, 0, 4, 2.8), ff = nn + 0.35;
      const feeds = [[90, 300], [400, 300], [710, 300], [90, 540], [400, 540], [710, 540]];
      return E.cine.shot(ctx, {
        set: 'sg91_cctv_room', grade: 'cold', haze: 0.25, dof: true,
        cam: { from: { x: 20, y: 20, z: 1.08 }, to: { x: -10, y: 10, z: 1.2 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'sg91_officer_tr', x: 760, y: 1760, scale: 1.15, dir: -1, turn: 0.45, pose: 'stand', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#1a2230' },
            keys: [{ at: 0.1, pose: 'examine', expr: 'focused', headTurn: 0.2, dur: 0.4 }, { at: tr, pose: 'point_up', expr: 'realise', headTurn: 0.1, dur: 0.3 }, { at: se, pose: 'arms_crossed', expr: 'stern', headTurn: 0.15, dur: 0.4 }, { at: nn + 0.6, pose: 'arms_crossed', expr: 'determined', dur: 0.3 }] }
        ],
        props: [
          // the six camera feeds: a street band, a timestamp, the little donkey crossing each in turn; the tracking box
          { depth: 0.98, accent: true, svg: tt => {
            let g = '';
            feeds.forEach(([x, y], i) => {
              const t0 = i * 0.55, k = clamp((tt - t0) / 0.55, 0, 1);
              g += `<rect x="${x}" y="${y + 130}" width="300" height="70" fill="#1e2a3a"/><rect x="${x}" y="${y}" width="300" height="130" fill="#0b1626"/><rect x="${x + 20}" y="${y + 40}" width="120" height="90" fill="#15202e"/><rect x="${x + 180}" y="${y + 30}" width="100" height="100" fill="#15202e"/>`;
              g += `<text x="${x + 10}" y="${y + 22}" ${TYPE} font-size="16" fill="#9fb0c4">CAM ${i + 1} · 04:1${i}</text>`;
              if (k > 0 && k < 1) {
                const dx = x + 10 + k * 230, dy = y + 150 + Math.sin(tt * 12) * 2;
                g += `<ellipse cx="${f1(dx)}" cy="${f1(dy)}" rx="28" ry="12" fill="#c9c0b4"/><ellipse cx="${f1(dx + 30)}" cy="${f1(dy - 16)}" rx="12" ry="8" fill="#c9c0b4"/><rect x="${f1(dx + 26)}" y="${f1(dy - 34)}" width="4" height="16" fill="#c9c0b4"/><rect x="${f1(dx + 34)}" y="${f1(dy - 34)}" width="4" height="16" fill="#c9c0b4"/><ellipse cx="${f1(dx - 4)}" cy="${f1(dy - 22)}" rx="9" ry="14" fill="#2a2e38"/>`;
                if (tt > tr) g += `<rect x="${f1(dx - 44)}" y="${f1(dy - 46)}" width="92" height="66" fill="none" stroke="${ACC}" stroke-width="3"/>`;
              }
            });
            const fl = flashAt(tt, tr);
            if (fl > 0) g += `<rect x="80" y="290" width="940" height="460" fill="${ACC}" opacity="${f1(0.18 * fl)}"/>`;
            return g;
          } }
        ],
        overlays: [
          { type: 'impact', at: tr, x: 560, y: 520 },
          { type: 'label', at: se - 0.1, x: 60, y: 560, text: 'SENTENCED · 9 YEARS 7 MONTHS', fs: 34, sub: 'Kayseri court, 13 May 2026 · first instance' },
          { type: 'funfact', at: ff, x: 40, w: 620, y: 700, fs: 38, rows: [{ text: 'THE INDICTMENT ASKED FOR' }, { text: 'UP TO 16 YEARS' }, { text: 'FOR THE DONKEY GETAWAY' }, { text: 'Kayseri prosecutors, 2026 (NTV, CNN Türk, Diken)', fs: 26 }] }
        ],
        tag: GEN
      });
    },

    // 3 - REHOOK + CASE 2: the California bank by day; the silhouette walks out of the door with the bag; on "rental" he
    //     steps on to the green scooter and on "scooter" rides off right
    sg91_scoot(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 1.5), rn = WT(ctx, 1, 5, 2.6), sc = WT(ctx, 1, 6, 3.0);
      const SX = 780, X1 = 1240, D = Math.max(0.9, T - sc - 0.1);
      const ride = tt => lerp(SX, X1, sm(seg(tt, sc, sc + D)));
      return E.cine.shot(ctx, {
        set: 'sg91_bank', setOpts: { view: 'wide' }, grade: 'warm', haze: 0.25,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 20, y: 30, z: 1.06 } },
        figures: [
          { id: 'sg91_robber_cv', x: SX - 110, y: 1600, scale: 0.7, dir: 1, turn: 0.45, pose: 'stand_tense', silhouette: 'cool', depth: 1.0,
            walk: { at: 0.05, dur: Math.max(0.9, l2 - 0.1), cadence: 3.6, stride: 14, from: 600, to: SX - 110 },
            keys: [{ at: l2, pose: 'examine', headTurn: 0.2, dur: 0.4 }, { at: rn, x: SX - 125, y: 1510, pose: 'stand', headTurn: 0.3, dur: 0.35 }, { at: sc, x: X1 - 125, y: 1510, pose: 'stand_tense', headTurn: 0.1, dur: D }] }
        ],
        props: [
          // the scooter at the kerb, then under him as he rides off right
          { depth: 1.02, accent: true, svg: tt => scooter((tt < rn ? SX : tt < sc ? SX : ride(tt)) - 250, 1560, 1.0, { lit: seg(tt, rn, rn + 0.3) }) },
          { depth: 1.01, svg: tt => (tt < rn ? `<rect x="${f1(SX - 70)}" y="1310" width="70" height="90" rx="10" fill="#3a3a44" stroke="${INK}" stroke-width="4"/>` : '') }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'CHULA VISTA, CALIFORNIA · OCT 2019', fs: 34, sub: 'A note to the teller; about $1,000 (DOJ)' },
          { type: 'callout', at: sc + 0.4, target: [X1 - 200, 1320], label: [60, 1000], anchor: 'start', w: 440, text: 'A RENTAL SCOOTER', sub: 'Witnesses saw him ride off', r: 60, depth: 1.02 }
        ],
        tag: TAG
      });
    },

    // 4 - CASE 2's GOTCHA: close on the kerb at dusk, three weeks later; the officer steps in from the right; on "Caught"
    //     the hands go behind the back; on "57" the sentence label
    sg91_cuffs(ctx) {
      const t = ctx.t, T = ctx.T, ca = WT(ctx, 0, 0, 0.35), fv = WT(ctx, 0, 4, 1.8);
      return E.cine.shot(ctx, {
        set: 'sg91_bank', setOpts: { view: 'close' }, grade: 'warm', haze: 0.2, dof: true,
        cam: { from: { x: 0, y: 20, z: 1.1 }, to: { x: 10, y: 30, z: 1.2 } },
        figures: [
          { id: 'sg91_robber_cv', x: 420, y: 2240, scale: 1.15, dir: 1, turn: 0.4, pose: 'stand_tense', silhouette: 'cool', depth: 1.0,
            keys: [{ at: 0.05, headTurn: 0.4, dur: 0.3 }, { at: ca + 0.05, pose: 'hands_behind', headTurn: 0.3, dur: 0.45 }, { at: fv, pose: 'bowed', dur: 0.4 }] },
          { id: 'sg91_officer_us', x: 900, y: 2200, scale: 1.05, dir: -1, turn: 0.4, pose: 'stand', expr: 'focused', depth: 0.99, hat: { style: 'cap', color: '#1a2230' },
            walk: { at: 0.0, dur: Math.max(0.5, ca - 0.05), cadence: 4.0, stride: 16, from: 1200, to: 900 },
            keys: [{ at: ca + 0.05, pose: 'present', expr: 'stern', headTurn: 0.1, dur: 0.35 }, { at: fv, pose: 'hands_together', expr: 'determined', dur: 0.35 }] }
        ],
        props: [],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'ARRESTED 4 NOV 2019 · 21 DAYS LATER', fs: 32, sub: 'US Attorney, Southern District of California' },
          { type: 'label', at: fv - 0.1, x: 60, y: 1000, text: '57 MONTHS · PLEADED GUILTY', fs: 34, sub: 'Sentenced June 2020, federal court (DOJ)' }
        ],
        tag: TAG
      });
    },

    // 5 - REHOOK + CASE 3: downtown Austin at dusk; the teen silhouette walks in from the left to the scooter dock; on
    //     "rented" he taps his phone on one and its lamp lights; on "getaway" he rides off right; the 157-million counter
    sg91_rent(ctx) {
      const t = ctx.t, T = ctx.T, rn = WT(ctx, 0, 4, 1.5), gw = WT(ctx, 0, 6, 2.3);
      const SX = 700, X1 = 1250, D = Math.max(0.9, T - gw - 0.1);
      const ride = tt => lerp(SX, X1, sm(seg(tt, gw, gw + D)));
      return E.cine.shot(ctx, {
        set: 'sg91_downtown', grade: 'dawn', haze: 0.3,
        cam: { from: { x: -20, y: 20, z: 1.02 }, to: { x: 10, y: 30, z: 1.08 } },
        figures: [
          { id: 'sg91_teen_atx', x: SX - 130, y: 1580, scale: 0.72, dir: 1, turn: 0.45, pose: 'stand', silhouette: 'cool', depth: 1.0,
            walk: { at: 0.0, dur: Math.max(0.8, rn - 0.3), cadence: 3.6, stride: 14, from: 200, to: SX - 130 },
            keys: [{ at: rn - 0.2, pose: 'examine', headTurn: 0.2, dur: 0.3 }, { at: rn + 0.4, x: SX - 125, y: 1510, pose: 'stand', headTurn: 0.1, dur: 0.3 }, { at: gw, x: X1 - 125, y: 1510, pose: 'stand_tense', dur: D }] }
        ],
        props: [
          // the dock: two scooters stay, the third goes with him; the phone glow on "rented"
          { depth: 1.02, accent: true, svg: tt => scooter(SX + 60, 1560, 0.8) + scooter(SX + 220, 1560, 0.8) + scooter((tt < gw ? SX : ride(tt)) - 250, 1560, 1.0, { lit: seg(tt, rn, rn + 0.3) }) },
          { depth: 1.03, svg: tt => { const k = seg(tt, rn - 0.1, rn + 0.1) * (1 - seg(tt, gw - 0.1, gw + 0.1)); return k > 0 ? wash(SX - 60, 1180, 90, 70, '#cfe4ff', f1(0.5 * k)) + `<rect x="${SX - 80}" y="1160" width="36" height="60" rx="6" fill="#1c2a3a" stroke="${INK}" stroke-width="3" opacity="${f1(k)}"/>` : ''; } }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'AUSTIN, TEXAS · DEC 2018 · POLICE SAY', fs: 34, sub: 'Charged, not tried · as of Oct 2026' },
          { type: 'counter', at: rn + 0.3, dur: 0.9, from: 0, to: 157, prefix: '', suffix: 'M', label: 'SHARED BIKE & SCOOTER RIDES · 2023', y: 1000, fs: 120 },
          { type: 'label', at: rn + 0.45, x: 60, y: 1250, text: 'US and Canada, a record (NACTO, July 2024)', fs: 26 }
        ],
        tag: TAG
      });
    },

    // 6 - THE BIGGEST GOTCHA (the music drop): the detective's office; the account record fills the monitor; on "name"
    //     the NAME row lights; on "Arrested" the silhouette is led in from the right in cuffs by the officer
    sg91_data(ctx) {
      const t = ctx.t, T = ctx.T, nm = WT(ctx, 0, 6, 1.9), ar = WT(ctx, 0, 7, 2.6);
      return E.cine.shot(ctx, {
        set: 'sg91_office', grade: 'cold', haze: 0.2,
        cam: { from: { x: -10, y: 20, z: 1.05 }, to: { x: 10, y: 10, z: 1.15 } },
        figures: [
          { id: 'sg91_detective', x: 300, y: 1760, scale: 1.0, dir: 1, turn: 0.45, pose: 'sit_type', expr: 'focused', noChair: true, depth: 1.0,
            keys: [{ at: 0.2, pose: 'sit_type_b', expr: 'focused', dur: 0.3 }, { at: nm, pose: 'point', expr: 'realise', headTurn: 0.2, dur: 0.35 }, { at: ar + 0.2, pose: 'sit', expr: 'stern', headTurn: 0.5, dur: 0.4 }] },
          { id: 'sg91_teen_atx', x: 960, y: 1640, scale: 0.6, dir: -1, turn: 0.4, pose: 'hands_behind', silhouette: 'cool', depth: 0.95, show: [ar - 0.1],
            walk: { at: ar - 0.1, dur: 0.8, cadence: 3.6, stride: 12, from: 1250, to: 960 },
            keys: [{ at: ar + 0.7, pose: 'bowed', dur: 0.4 }] },
          { id: 'sg91_officer_us', x: 1110, y: 1660, scale: 0.6, dir: -1, turn: 0.4, pose: 'stand', expr: 'stern', depth: 0.94, hat: { style: 'cap', color: '#1a2230' }, show: [ar - 0.1],
            walk: { at: ar - 0.1, dur: 0.8, cadence: 3.6, stride: 12, from: 1400, to: 1110 },
            keys: [{ at: ar + 0.7, pose: 'present', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.98, accent: true, svg: tt => `<g transform="translate(456 716)">${record(388, 368, seg(tt, nm, nm + 0.3))}</g>` + wash(650, 900, 360, 300, '#7ac7e8', f1(0.1 + 0.2 * flashAt(tt, nm))) }
        ],
        overlays: [
          { type: 'callout', at: nm + 0.1, target: [560, 800], label: [1000, 600], anchor: 'end', w: 420, text: 'ACCOUNT DATA', sub: 'Police say · the ride record', r: 60, depth: 1.02 },
          { type: 'label', at: ar + 0.2, x: 60, y: 1000, text: 'CHARGED · ROBBERY BY THREAT · POLICE SAY', fs: 32, sub: 'No outcome found · as of Oct 2026' }
        ],
        tag: TAG
      });
    },

    // 7 - THE CALLBACK (the loop): frame 1's street, the same rider and donkey; on "forklift" the forklift's beacon blinks
    //     on and off again; the donkey eases back to frame 1's spot and the camera eases back to frame 1's start, so the
    //     last frame equals the first
    sg91_end(ctx) {
      const t = ctx.t, T = ctx.T, fk = WT(ctx, 0, 4, 1.2);
      const back = T - 0.55;
      const beacon = seg(t, fk, fk + 0.15) * (1 - seg(t, Math.min(fk + 0.5, back - 0.3), back));   // off again before the last frame
      const X0 = RX0 + 20;
      return E.cine.shot(ctx, {
        set: 'sg91_street', setOpts: { beacon }, grade: 'night', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        // he glances back at the shop on the callback line and is facing forward again before the last frame (the loop)
        figures: [{ ...HERO_FIG, x: X0, keys: settleKeys(T, X0, RX0, [{ at: 0.3, headTurn: -0.4, dur: 0.4 }, { at: Math.max(1.0, back - 0.4), headTurn: 0, dur: 0.4 }]) }],
        props: [
          { depth: 0.995, svg: tt => { const g = settleGait(tt, T, X0, RX0); return donkey(g.x + 30, GY + g.y, (Math.min(tt, T - 0.3) - (T - 0.3)) * 7.5); } },
          { depth: 1.01, accent: true, svg: tt => { const g = settleGait(tt, T, X0, RX0); return goldSack(g.x + 95, RY - 250 + g.y, 150, { glow: 0.85 + 0.15 * Math.sin((tt - T) * 3) }); } }
        ],
        overlays: [],
        tag: TAG
      });
    }
  });
})();
