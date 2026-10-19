/* Case File 88 (premium look, ENGINE V6: promise -> proof -> escalate -> callback, the loop; THE 28-SECOND CUT):
   CAUGHT BY THEIR OWN PHONE, 2.
   HEADLINE: Fresno, California, May 2013: police say two 20-year-olds dialled 911 by accident from a pocket on their
   way to break into a car; the dispatcher did not hang up, listened for about 35 minutes, heard the car window smash
   and guided officers to them; both were arrested (charged only: no verdict found). The 35 minutes are the callback.
   CASE 2: Silver Spring, Maryland, January 2011: a burglar whose home had lost power in a snowstorm plugged his phone in
   to charge inside the house he was burgling, fled through a window when the homeowner's son arrived, and left it
   charging; police rang his contacts; 26+ years after admitting seven break-ins.
   CASE 3 (best last): Walnut Creek, California (undated reports): police say a man filmed breaking into a restaurant
   left his phone inside and was arrested when he came to the police station to get it back.
   Structure: frame 1 = the HERO, the sound-off picture: a street at night, the back of a man in dark denim filling the
   left of the frame, a big phone glowing in his back pocket with 911 on its screen (a third of the frame wide,
   upper-middle), rising out of the pocket at 0.0 s while the camera pushes in; the lookout (a silhouette) beside a
   parked car on the right. Then the gotcha (the dispatch room: the waveform spikes on "smash", she turns to the radio;
   the 30 % counter), case 2 (the living room: he plugs the phone in; closer: out of the window, the phone glows on the
   floor, the officer kneels to it; the fun fact), case 3 (the closed restaurant: the phone left on the counter; the
   station lobby: he walks up to the desk, the cuffs: the music drop) and the callback on frame 1's street (the screen
   dims as the call ends, the phone sinks back, the camera eases back to frame 1's start) with the end card.
   Smoothness: cuts and dissolves, one push (into case 3's first beat), one zoom (the end); one slow camera move per
   shot; no shake, no handheld, one impact. Screen direction: the suspects move LEFT TO RIGHT; officers enter from the right.
   Look: episode.look = 'premium', one cool night palette (shadow #0e1826, mid #b9b4a8, accent #e9b44c). The strongly
   coloured object is the phone screen (accent: true) in every scene it appears in.
   Content rules: the phone screen shows only our own typed "911" and "CALLING" (no carrier, app or interface imitated);
   the dispatch console is a generic waveform and grid. The three men are dark silhouettes tagged NOT A LIKENESS and never
   named; the dispatcher and the officers are generic figures. No weapon, no force beyond hands behind the back, no
   victim shown; the car is intact and no break-in is shown.
   New environments (E.registerSets): bd88_street (a residential street at night with a parked car), bd88_dispatch_room (a
   911 dispatch room), bd88_room (a Maryland living room, snow at the window; view 'wide' or 'close'), bd88_diner_room (a
   closed restaurant at night), bd88_lobby (a police station lobby). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#0e1218';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · NOT A LIKENESS';
  const GEN = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#e9b44c';
  const TYPE = 'font-family="Nunito" font-weight="800"';

  // ---------- small props
  // a generic phone, screen to camera: top-left (x, y), size w x h; o.lit 0..1 the screen, o.call shows "911 / CALLING",
  // o.pulse the blinking dot phase; our own typed layout, no carrier, app or interface imitated
  function phoneAt(x, y, w, h, o = {}) {
    const lit = o.lit ?? 1, rx = w * 0.14;
    let g = `<rect x="${f1(x - w * 0.045)}" y="${f1(y - w * 0.045)}" width="${f1(w * 1.09)}" height="${f1(h + w * 0.09)}" rx="${f1(rx)}" fill="#1a1e26" stroke="${INK}" stroke-width="6"/>`;
    g += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(rx * 0.7)}" fill="#0c1018"/>`;
    if (lit > 0) {
      g += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(rx * 0.7)}" fill="#1c2a3a" opacity="${f1(lit)}"/>`;
      if (o.call) {
        const fs = w * 0.47, fs2 = w * 0.115, dot = 0.55 + 0.45 * Math.sin((o.pulse || 0) * 5);
        g += `<g opacity="${f1(lit)}"><text x="${f1(x + w / 2)}" y="${f1(y + h * 0.3)}" text-anchor="middle" ${TYPE} font-size="${f1(fs)}" fill="${ACC}">911</text>`;
        g += `<text x="${f1(x + w / 2)}" y="${f1(y + h * 0.3 + fs2 * 1.6)}" text-anchor="middle" ${TYPE} font-size="${f1(fs2)}" letter-spacing="4" fill="#dfe6ee">CALLING</text>`;
        g += `<circle cx="${f1(x + w / 2)}" cy="${f1(y + h * 0.3 + fs2 * 2.9)}" r="${f1(w * 0.03)}" fill="#3ee07a" opacity="${f1(dot)}"/>`;
        g += `<circle cx="${f1(x + w / 2)}" cy="${f1(y + h * 0.78)}" r="${f1(w * 0.14)}" fill="#c03a30" opacity="0.9"/><rect x="${f1(x + w / 2 - w * 0.075)}" y="${f1(y + h * 0.78 - w * 0.02)}" width="${f1(w * 0.15)}" height="${f1(w * 0.04)}" rx="${f1(w * 0.02)}" fill="#fff"/></g>`;
      } else {
        for (let i = 0; i < 4; i++) g += `<rect x="${f1(x + w * 0.12)}" y="${f1(y + h * (0.18 + i * 0.14))}" width="${f1(w * (0.76 - (i % 2) * 0.2))}" height="${f1(h * 0.05)}" rx="6" fill="#8a97a8" opacity="${f1(lit * 0.8)}"/>`;
      }
      g += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(rx * 0.7)}" fill="#fff" opacity="${f1(0.05 * lit)}"/>`;
    }
    return g;
  }
  // a small lit phone lying flat on a surface (seen from the front, foreshortened): centre (x, y), width w
  function phoneFlat(x, y, w, o = {}) {
    const h = w * 0.55, lit = o.lit ?? 1;
    let g = wash(x, y - 40, w * 1.4, w * 0.9, '#cfe4ff', f1(0.22 * lit)) + `<rect x="${f1(x - w / 2)}" y="${f1(y - h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(w * 0.08)}" fill="#1a1e26" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="${f1(x - w * 0.44)}" y="${f1(y - h * 0.38)}" width="${f1(w * 0.88)}" height="${f1(h * 0.76)}" rx="${f1(w * 0.05)}" fill="#1c2a3a" opacity="${f1(lit)}"/>`;
    for (let i = 0; i < 3; i++) g += `<rect x="${f1(x - w * 0.34)}" y="${f1(y - h * 0.24 + i * h * 0.2)}" width="${f1(w * (0.68 - (i % 2) * 0.2))}" height="${f1(h * 0.08)}" rx="4" fill="#8a97a8" opacity="${f1(0.8 * lit)}"/>`;
    return g;
  }
  // THE HERO: the back of a man in dark denim (jacket hem, belt, hip) filling the left of the frame; a big phone in the
  // back pocket with 911 on the screen. o.rise 0..1 how far the phone has risen out of the pocket (0 at frame 0 and the
  // last frame), o.lit 0..1 the screen, o.t for the blinking dot
  const PH = { x: 435, w: 300, h: 600, top0: 570, lift: 50 };   // the phone's top edge sits at top0 - lift * rise
  const PK = { cx: 435, top: 840, bot: 1200, w: 340 };          // the pocket face
  function pocketPhone(o = {}) {
    const rise = o.rise ?? 1, lit = o.lit ?? 1, top = PH.top0 - PH.lift * rise, x0 = PH.x - PH.w / 2;
    let g = `<path d="M170 452 Q435 418 700 452 L716 606 L154 606 Z" fill="#232a36" stroke="${INK}" stroke-width="6"/>`;   // the jacket hem
    g += `<path d="M154 606 L716 606 L740 1300 Q732 1700 690 1980 L180 1980 Q138 1700 130 1300 Z" fill="#26334a" stroke="${INK}" stroke-width="6"/>`;   // the denim hip
    g += `<path d="M435 606 L438 1980" stroke="#1b2535" stroke-width="12"/><path d="M435 606 L438 1980" stroke="#b07a3c" stroke-width="3" stroke-dasharray="14 10" opacity="0.6"/>`;   // the centre seam
    g += `<path d="M130 760 Q282 742 435 760 Q588 778 740 760" stroke="#1b2535" stroke-width="10" fill="none"/><path d="M130 760 Q282 742 435 760 Q588 778 740 760" stroke="#b07a3c" stroke-width="3" stroke-dasharray="14 10" fill="none" opacity="0.6"/>`;   // the yoke seam
    g += wash(PH.x, top + 150, 420, 300, '#ffd9a0', f1(0.2 * lit)) + wash(PH.x, top + 150, 230, 170, '#fff1c8', f1(0.16 * lit));
    g += phoneAt(x0, top, PH.w, PH.h, { lit, call: true, pulse: o.t || 0 });
    // the pocket face in front of the phone, with its stitching
    g += `<path d="M${PK.cx - PK.w / 2} ${PK.top} L${PK.cx + PK.w / 2} ${PK.top} L${PK.cx + PK.w / 2 - 26} ${PK.bot - 90} L${PK.cx} ${PK.bot} L${PK.cx - PK.w / 2 + 26} ${PK.bot - 90} Z" fill="#2b3a54" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M${PK.cx - PK.w / 2 + 22} ${PK.top + 22} L${PK.cx + PK.w / 2 - 22} ${PK.top + 22} L${PK.cx + PK.w / 2 - 44} ${PK.bot - 100} L${PK.cx} ${PK.bot - 26} L${PK.cx - PK.w / 2 + 44} ${PK.bot - 100} Z" fill="none" stroke="#b07a3c" stroke-width="3" stroke-dasharray="14 10" opacity="0.7"/>`;
    g += `<path d="M${PK.cx - PK.w / 2 + 40} ${PK.top + 60} Q${PK.cx} ${PK.top + 120} ${PK.cx + PK.w / 2 - 40} ${PK.top + 60}" fill="none" stroke="#b07a3c" stroke-width="3" opacity="0.5"/>`;
    // the belt and buckle over the top
    g += `<rect x="160" y="546" width="550" height="64" rx="8" fill="#2a2420" stroke="${INK}" stroke-width="6"/><rect x="390" y="538" width="90" height="80" rx="10" fill="none" stroke="#9a8a6a" stroke-width="9"/>`;
    return g;
  }
  // a generic dispatch waveform on a monitor: local 0..w x 0..h; k the spike 0..1
  function waveform(w, h, t, k) {
    let d = '';
    for (let i = 0; i <= 40; i++) { const x = i / 40 * w; const a = Math.sin(i * 0.9 + t * 7) * h * 0.08 + Math.sin(i * 2.3 - t * 11) * h * 0.05; const sp = k * h * 0.4 * Math.exp(-Math.pow((i - 22) / 4, 2)) * Math.sin(i * 3.1); d += `${i ? 'L' : 'M'}${f1(x)} ${f1(h / 2 + a + sp)} `; }
    return `<path d="${d}" fill="none" stroke="${k > 0.2 ? ACC : '#7ac7e8'}" stroke-width="4"/>`;
  }
  const flashAt = (tt, a) => (tt >= a && tt < a + 0.45 ? Math.pow(1 - (tt - a) / 0.45, 2) : 0);

  // the hero figure (the same in the hook and the end scene: the loop) and the camera it loops on
  const HERO_FIG = { id: 'bd88_lookout', x: 1000, y: 1620, scale: 0.52, dir: -1, turn: 0.4, pose: 'stand_tense', silhouette: 'cool', depth: 1.0 };
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 0, y: -16, z: 1.09 };

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a residential street at night: stars, low rooflines and fences, a street lamp, a parked dark sedan (generic, blank
    // plate) at the right, asphalt and a kerb
    bd88_street(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="bd88sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060b18"/><stop offset="1" stop-color="#17223a"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1300" fill="url(#bd88sk)"/>` + E.cine.stars(t, 60, 8811, -200, 700) + `<circle cx="860" cy="260" r="36" fill="#f3ecd8" opacity="0.9"/><circle cx="860" cy="260" r="120" fill="#f3ecd8" opacity="0.05"/>`;
      let houses = '';
      [[-300, 760, 520, 300], [260, 700, 560, 360], [860, 740, 620, 320]].forEach(([x, y, w, h], i) => {
        houses += `<path d="M${x - 30} ${y} L${x + w / 2} ${y - 150} L${x + w + 30} ${y} Z" fill="#1a2232" stroke="${INK}" stroke-width="5"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#222c3e" stroke="${INK}" stroke-width="5"/>`;
        houses += `<rect x="${x + 60}" y="${y + 70}" width="110" height="130" fill="${i === 1 ? '#e8d8a8' : '#10161f'}" opacity="${i === 1 ? 0.5 : 1}" stroke="${INK}" stroke-width="4"/><rect x="${x + w - 170}" y="${y + 70}" width="110" height="130" fill="#10161f" stroke="${INK}" stroke-width="4"/>`;
      });
      houses += `<rect x="-400" y="1060" width="${W + 800}" height="150" fill="#2a2a2c" stroke="${INK}" stroke-width="5"/>` + Array.from({ length: 24 }, (_, i) => `<rect x="${-400 + i * 80}" y="1070" width="14" height="130" fill="#1e1e20"/>`).join('');
      let mid = `<rect x="150" y="430" width="16" height="800" fill="#2a2e34"/><path d="M158 430 L230 418" stroke="#2a2e34" stroke-width="10"/><ellipse cx="240" cy="426" rx="34" ry="10" fill="#ffc870"/>` + wash(240, 620, 300, 460, '#ffb050', 0.1);
      mid += [60, 1000].map(x => `<ellipse cx="${x}" cy="1220" rx="110" ry="70" fill="#162016"/>`).join('');
      // the parked sedan (generic): nose to the left, in the right half of the frame
      let car = `<g transform="translate(930 1520)"><ellipse cx="0" cy="6" rx="330" ry="26" fill="#000" opacity="0.5"/><path d="M-320 0 L-310 -100 Q-280 -140 -180 -150 L-110 -240 Q-80 -270 0 -270 L140 -270 Q200 -270 230 -240 L300 -150 Q325 -130 325 -100 L325 0 Z" fill="#1e2430" stroke="${INK}" stroke-width="6"/><path d="M-90 -236 L-60 -160 L120 -160 L150 -236 Z" fill="#0f1620"/><path d="M-170 -150 L-100 -150 L-80 -236 Z" fill="#0f1620" opacity="0.8"/><rect x="-290" y="-50" width="90" height="36" rx="6" fill="#e4e2da" stroke="${INK}" stroke-width="3"/><circle cx="-210" cy="-8" r="46" fill="#0c0d10" stroke="${INK}" stroke-width="5"/><circle cx="220" cy="-8" r="46" fill="#0c0d10" stroke="${INK}" stroke-width="5"/><circle cx="-210" cy="-8" r="18" fill="#3a3e46"/><circle cx="220" cy="-8" r="18" fill="#3a3e46"/></g>`;
      let ground = `<rect x="-400" y="1210" width="${W + 800}" height="80" fill="#3a3a3c" stroke="${INK}" stroke-width="4"/><rect x="-400" y="1290" width="${W + 800}" height="${H}" fill="#1a1c22"/>`;
      ground += `<path d="M-400 1700 L${W + 400} 1700" stroke="#d8d4c4" stroke-width="8" stroke-dasharray="120 90" opacity="0.18"/>` + wash(240, 1400, 500, 160, '#ffb050', 0.05);
      return { light: { dir: -1, rim: '#9fd0ff', key: '#c8d4e8' }, layers: [[0.05, sky], [0.3, houses], [0.55, mid], [0.85, car], [0.9, ground]] };
    },

    // a 911 dispatch room at night: a dark wall with a big dim grid map, a long console desk with three monitors (the
    // waveform is drawn in the shot), a desk lamp glow
    bd88_dispatch_room(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#141a26"/>`;
      wall += `<rect x="-200" y="120" width="1480" height="640" fill="#0f1826" stroke="#2a3850" stroke-width="6"/>`;
      for (let i = 0; i < 14; i++) wall += `<path d="M${-200 + i * 110} 120 L${-200 + i * 110} 760" stroke="#1e2c44" stroke-width="2"/>`;
      for (let i = 0; i < 6; i++) wall += `<path d="M-200 ${120 + i * 110} L1280 ${120 + i * 110}" stroke="#1e2c44" stroke-width="2"/>`;
      wall += `<path d="M-100 600 Q200 380 520 460 Q860 540 1200 300" stroke="#3a6a9a" stroke-width="6" fill="none" opacity="0.6"/>` + wash(540, 440, 600, 300, '#3a6a9a', 0.08);
      wall += `<rect x="-400" y="760" width="${W + 800}" height="60" fill="#1c2432"/>`;
      let desk = `<rect x="-400" y="1180" width="${W + 800}" height="70" rx="6" fill="#2a3040" stroke="${INK}" stroke-width="6"/><rect x="-400" y="1250" width="${W + 800}" height="${H}" fill="#1a2030"/>`;
      // three monitors on the desk (the middle one carries the waveform in the shot)
      [[200, 840, 300, 230], [540, 820, 360, 270], [920, 840, 300, 230]].forEach(([cx, y, w, h]) => {
        desk += `<rect x="${cx - 24}" y="${y + h}" width="48" height="80" fill="#3a4050" stroke="${INK}" stroke-width="4"/><rect x="${cx - 90}" y="${y + h + 70}" width="180" height="16" rx="6" fill="#3a4050" stroke="${INK}" stroke-width="4"/>`;
        desk += `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="${h}" rx="10" fill="#2a3040" stroke="${INK}" stroke-width="6"/><rect x="${cx - w / 2 + 14}" y="${y + 14}" width="${w - 28}" height="${h - 28}" fill="#0f1a28"/>`;
        for (let i = 0; i < 4; i++) desk += `<rect x="${cx - w / 2 + 30}" y="${y + 36 + i * 40}" width="${w * (0.5 - (i % 2) * 0.15)}" height="12" rx="4" fill="#2e4a66"/>`;
        desk += wash(cx, y + h / 2, w * 0.9, h, '#7ac7e8', 0.1);
      });
      desk += `<rect x="40" y="1120" width="240" height="60" rx="8" fill="#20262f" stroke="${INK}" stroke-width="4"/>` + Array.from({ length: 10 }, (_, i) => `<rect x="${56 + i * 22}" y="1136" width="14" height="14" rx="3" fill="#3a4454"/>`).join('');
      desk += `<g transform="translate(980 1180)"><rect x="-10" y="-300" width="14" height="300" fill="#3a4048"/><path d="M-60 -300 L80 -300 L60 -230 L-40 -230 Z" fill="#e8d8a8" stroke="${INK}" stroke-width="4"/></g>` + wash(990, 1000, 240, 260, '#ffd090', 0.14);
      return { light: { dir: 1, rim: '#7ac7e8', key: '#c8d4e8' }, layers: [[0.25, wall], [0.9, desk]] };
    },

    // a Maryland living room at night, snow at the window: o.view 'wide' = a window at the left with snow and a sill, a
    // bookcase, a sofa, a wall socket low on the right wall (the phone is drawn in the shot); 'close' = the same room
    // framed closer on the window and the socket
    bd88_room(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), close = o.view === 'close';
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#3e3a44"/>`;
      // the window, snow falling outside, a curtain that sways (o.gust 0..1 adds a gust)
      const wx = close ? 60 : 110, wy = close ? 300 : 380, ww = close ? 420 : 340, wh = close ? 640 : 520;
      wall += `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="#0f1726" stroke="${INK}" stroke-width="8"/>`;
      const r = R(8821); let snow = '';
      for (let i = 0; i < 50; i++) { const sx = wx + 10 + r() * (ww - 20), sp = 30 + r() * 40, ph = r() * 1000; const sy = wy + ((ph + t * sp) % wh); snow += `<circle cx="${f1(sx + Math.sin(t * 1.3 + ph) * 6)}" cy="${f1(sy)}" r="${f1(2 + r() * 3)}" fill="#eef2f8" opacity="0.8"/>`; }
      wall += snow + `<rect x="${wx}" y="${wy + wh - 30}" width="${ww}" height="30" fill="#e8ecf0"/>`;
      wall += `<path d="M${wx + ww / 2} ${wy} L${wx + ww / 2} ${wy + wh} M${wx} ${wy + wh / 2} L${wx + ww} ${wy + wh / 2}" stroke="#8a8278" stroke-width="8"/>`;
      const gust = o.gust || 0, sw = Math.sin(t * 2.1) * (24 + 80 * gust), sw2 = Math.sin(t * 2.7 + 1) * (20 + 60 * gust);
      wall += `<path d="M${wx + ww} ${wy - 20} L${wx + ww + 60} ${wy - 20} L${wx + ww + 60 + sw} ${wy + wh * 0.5} Q${wx + ww + 90 + sw2} ${wy + wh * 0.8} ${wx + ww + 40 + sw} ${wy + wh + 40} L${wx + ww} ${wy + wh + 40} Z" fill="#8a6a5a" opacity="0.9" stroke="${INK}" stroke-width="3"/>`;
      wall += `<rect x="${wx - 30}" y="${wy - 44}" width="${ww + 120}" height="22" rx="6" fill="#4a3c30" stroke="${INK}" stroke-width="3"/>`;
      if (!close) {
        let furn = `<rect x="560" y="300" width="300" height="700" fill="#3a2c22" stroke="${INK}" stroke-width="6"/>`;
        const r2 = R(8822);
        for (let y = 330; y < 960; y += 130) { let x = 576; while (x < 830) { const w = 24 + r2() * 28, h = 80 + r2() * 36; furn += `<rect x="${f1(x)}" y="${f1(y + 110 - h)}" width="${f1(w)}" height="${f1(h)}" rx="3" fill="${['#8a4a3a', '#3a5a6a', '#6a6a4a', '#5a3a5a', '#a08a60'][Math.floor(r2() * 5)]}" stroke="${INK}" stroke-width="2"/>`; x += w + 4; } furn += `<rect x="560" y="${y + 112}" width="300" height="12" fill="#2a1e16"/>`; }
        furn += `<rect x="920" y="620" width="200" height="150" fill="#6a6a60" stroke="${INK}" stroke-width="5"/><rect x="940" y="640" width="160" height="110" fill="#3a4a5a"/>`;
        // the wall socket (low, right)
        furn += `<rect x="1000" y="1150" width="70" height="110" rx="8" fill="#e8e2d6" stroke="${INK}" stroke-width="4"/><rect x="1018" y="1172" width="12" height="30" fill="#2a2a2a"/><rect x="1040" y="1172" width="12" height="30" fill="#2a2a2a"/><rect x="1018" y="1214" width="12" height="30" fill="#2a2a2a"/><rect x="1040" y="1214" width="12" height="30" fill="#2a2a2a"/>`;
        let floor = `<rect x="-400" y="1300" width="${W + 800}" height="${H}" fill="#3a3028"/>` + [0, 1, 2, 3].map(i => `<path d="M-400 ${1340 + i * 120} L${W + 400} ${1340 + i * 120}" stroke="#2e261e" stroke-width="3"/>`).join('') + `<rect x="-400" y="1280" width="${W + 800}" height="24" fill="#d8d0c0" stroke="${INK}" stroke-width="3"/>`;
        return { light: { dir: 1, rim: '#cfe4ff', key: '#e8e0d0' }, layers: [[0.25, wall], [0.6, furn], [0.9, floor]] };
      }
      // the close view: the socket at the right, bigger, and a side table
      let furn = `<rect x="760" y="900" width="200" height="200" rx="8" fill="#5a4030" stroke="${INK}" stroke-width="6"/><rect x="770" y="1100" width="20" height="200" fill="#4a3426"/><rect x="930" y="1100" width="20" height="200" fill="#4a3426"/>`;
      furn += `<rect x="1000" y="1090" width="90" height="140" rx="10" fill="#e8e2d6" stroke="${INK}" stroke-width="4"/><rect x="1022" y="1118" width="14" height="36" fill="#2a2a2a"/><rect x="1052" y="1118" width="14" height="36" fill="#2a2a2a"/><rect x="1022" y="1170" width="14" height="36" fill="#2a2a2a"/><rect x="1052" y="1170" width="14" height="36" fill="#2a2a2a"/>`;
      let floor = `<rect x="-400" y="1300" width="${W + 800}" height="${H}" fill="#3a3028"/>` + [0, 1, 2, 3].map(i => `<path d="M-400 ${1340 + i * 120} L${W + 400} ${1340 + i * 120}" stroke="#2e261e" stroke-width="3"/>`).join('') + `<rect x="-400" y="1280" width="${W + 800}" height="24" fill="#d8d0c0" stroke="${INK}" stroke-width="3"/>`;
      return { light: { dir: 1, rim: '#cfe4ff', key: '#e8e0d0' }, layers: [[0.25, wall], [0.6, furn], [0.9, floor]] };
    },

    // a closed restaurant at night: a street window with blinds and a dim street glow, a kitchen pass, a long counter
    // with stools, chairs upturned on a table, a till (generic)
    bd88_diner_room(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#4a3c34"/>`;
      wall += `<rect x="80" y="260" width="420" height="620" fill="#1a2436" stroke="${INK}" stroke-width="8"/>` + Array.from({ length: 12 }, (_, i) => `<rect x="90" y="${276 + i * 50}" width="400" height="22" fill="#6a6a62" opacity="0.9"/>`).join('') + wash(290, 560, 320, 420, '#ffb050', 0.06);
      wall += `<rect x="620" y="300" width="420" height="300" fill="#2a2420" stroke="${INK}" stroke-width="6"/><rect x="640" y="320" width="380" height="260" fill="#1a1612"/>` + [0, 1, 2].map(i => `<rect x="${660 + i * 120}" y="500" width="90" height="60" rx="4" fill="#5a5048" stroke="${INK}" stroke-width="3"/>`).join('');
      wall += `<rect x="600" y="600" width="460" height="30" fill="#8a7a6a" stroke="${INK}" stroke-width="4"/>`;
      let furn = `<rect x="-400" y="1120" width="${W + 800}" height="70" rx="6" fill="#6a4a34" stroke="${INK}" stroke-width="6"/><rect x="-400" y="1190" width="${W + 800}" height="240" fill="#3a2a20" stroke="${INK}" stroke-width="6"/>`;
      furn += `<rect x="-400" y="1200" width="${W + 800}" height="14" fill="#8a6a4a"/>`;
      // the till (generic box with a dark screen) at the left of the counter, upturned chairs on a table at the right
      furn += `<rect x="120" y="990" width="200" height="130" rx="8" fill="#3a3e46" stroke="${INK}" stroke-width="5"/><rect x="140" y="1010" width="160" height="70" fill="#141820"/>`;
      furn += `<g transform="translate(900 1000)"><rect x="-150" y="0" width="300" height="24" rx="4" fill="#5a4030" stroke="${INK}" stroke-width="4"/><rect x="-130" y="24" width="18" height="100" fill="#4a3426"/><rect x="112" y="24" width="18" height="100" fill="#4a3426"/><g transform="translate(-60 0) rotate(180)"><rect x="-40" y="0" width="80" height="14" fill="#6a4a34" stroke="${INK}" stroke-width="3"/><rect x="-36" y="14" width="10" height="90" fill="#5a4030"/><rect x="26" y="14" width="10" height="90" fill="#5a4030"/><rect x="-40" y="100" width="80" height="60" rx="4" fill="#6a4a34" stroke="${INK}" stroke-width="3"/></g><g transform="translate(60 0) rotate(180)"><rect x="-40" y="0" width="80" height="14" fill="#6a4a34" stroke="${INK}" stroke-width="3"/><rect x="-36" y="14" width="10" height="90" fill="#5a4030"/><rect x="26" y="14" width="10" height="90" fill="#5a4030"/><rect x="-40" y="100" width="80" height="60" rx="4" fill="#6a4a34" stroke="${INK}" stroke-width="3"/></g></g>`;
      let floor = `<rect x="-400" y="1430" width="${W + 800}" height="${H}" fill="#2a2420"/>` + [0, 1, 2, 3, 4, 5].map(i => `<path d="M-400 ${1470 + i * 90} L${W + 400} ${1470 + i * 90}" stroke="#1e1a16" stroke-width="3"/>`).join('');
      floor += [200, 540, 880].map(x => `<rect x="${x - 60}" y="1430" width="120" height="30" rx="8" fill="#8a3a3a" stroke="${INK}" stroke-width="4"/><rect x="${x - 10}" y="1460" width="20" height="200" fill="#5a5a60"/><ellipse cx="${x}" cy="1660" rx="70" ry="16" fill="#4a4a50" stroke="${INK}" stroke-width="3"/>`).join('');
      return { light: { dir: -1, rim: '#ffb050', key: '#e8dcc8' }, layers: [[0.25, wall], [0.6, furn], [0.9, floor]] };
    },

    // a police station lobby: a plain wall with the word POLICE in plain type, a notice board, a front counter with a
    // glass partition, a bench, a tiled floor
    bd88_lobby(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#3a4250"/><rect x="-400" y="700" width="${W + 800}" height="40" fill="#2c3440"/>`;
      wall += `<text x="640" y="380" text-anchor="middle" ${TYPE} font-size="110" letter-spacing="14" fill="#d8dce4" opacity="0.85">POLICE</text><rect x="420" y="410" width="440" height="8" fill="#9aa3b0"/>`;
      wall += `<rect x="60" y="300" width="260" height="340" fill="#6a5a4a" stroke="${INK}" stroke-width="5"/>` + [[80, 320], [190, 330], [90, 470], [200, 480]].map(([x, y]) => `<rect x="${x}" y="${y}" width="100" height="130" fill="#e8e2d6" stroke="${INK}" stroke-width="2"/><rect x="${x + 12}" y="${y + 20}" width="76" height="8" fill="#a8a29a"/><rect x="${x + 12}" y="${y + 40}" width="60" height="8" fill="#a8a29a"/>`).join('');
      wall += `<rect x="-400" y="740" width="${W + 800}" height="640" fill="#2e3642"/>`;
      let counter = `<rect x="300" y="1080" width="900" height="80" rx="6" fill="#5a4a3a" stroke="${INK}" stroke-width="6"/><rect x="300" y="1160" width="900" height="260" fill="#3a3028" stroke="${INK}" stroke-width="6"/>`;
      counter += `<rect x="320" y="640" width="860" height="440" fill="#cfe0ea" opacity="0.18" stroke="#9aa3b0" stroke-width="6"/><path d="M750 640 L750 1080" stroke="#9aa3b0" stroke-width="6"/><rect x="620" y="980" width="260" height="100" fill="#141820" opacity="0.25"/>`;
      counter += `<rect x="-200" y="1280" width="380" height="60" rx="6" fill="#4a3c30" stroke="${INK}" stroke-width="5"/><rect x="-180" y="1340" width="24" height="120" fill="#3a2c22"/><rect x="136" y="1340" width="24" height="120" fill="#3a2c22"/>`;
      let floor = `<rect x="-400" y="1420" width="${W + 800}" height="${H}" fill="#2a2e38"/>`;
      for (let i = 0; i < 8; i++) floor += `<path d="M-400 ${1460 + i * 70} L${W + 400} ${1460 + i * 70}" stroke="#1e222a" stroke-width="3"/>`;
      for (let i = -3; i < 10; i++) floor += `<path d="M${540 + i * 170} 1420 L${540 + i * 340} ${H + 100}" stroke="#1e222a" stroke-width="3"/>`;
      return { light: { dir: -1, rim: '#cfe4ff', key: '#dce0e8' }, layers: [[0.25, wall], [0.9, counter], [0.92, floor]] };
    }
  });

  E.registerScenes({
    // 1 - HOOK (frame 1): the street; the back in denim fills the left, the phone rises out of the pocket at 0.0 s with
    //     911 glowing and the camera already pushing in; the lookout beside the car turns his head on line 2
    bd88_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.5), nb = WT(ctx, 1, 1, 3.3);
      const rise = ease.inOut(seg(t, 0.0, 0.9));
      return E.cine.shot(ctx, {
        set: 'bd88_street', grade: 'night', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [
          { ...HERO_FIG, keys: [{ at: 0.1, headTurn: 0.3, dur: 0.5 }, { at: l2 + 0.05, pose: 'stand', headTurn: -0.2, dur: 0.4 }, { at: nb + 0.2, pose: 'stand_tense', headTurn: 0.1, dur: 0.4 }] }
        ],
        props: [{ depth: 1.05, accent: true, svg: tt => pocketPhone({ rise, lit: 1, t: tt }) }],
        overlays: [
          { type: 'callout', at: Math.max(3.05, l2 + 0.25), target: [PH.x + 20, PH.top0 - PH.lift + 160], label: [1050, 1232], anchor: 'end', w: 520, fs: 30, text: 'STILL CONNECTED TO 911', sub: 'Police say · stayed on the line', r: 58, depth: 1.05 },
          { type: 'label', at: Math.max(3.05, nb + 0.1), x: 60, y: 1232, text: 'FRESNO, CA · MAY 2013', fs: 26 }
        ],
        tag: TAG
      });
    },

    // 2 - THE GOTCHA: the dispatch room, close on the dispatcher; on "heard" she presses the headset; on "smash" the
    //     waveform spikes (the single impact); on "sent" she turns to the radio and types; the charged label and the
    //     30 % counter
    bd88_dispatch(ctx) {
      const t = ctx.t, T = ctx.T, hd = WT(ctx, 0, 2, 0.6), sm = WT(ctx, 0, 5, 1.3), se = WT(ctx, 0, 7, 2.3), of = WT(ctx, 0, 8, 2.7);
      const spike = flashAt(t, sm) + 0.4 * seg(t, sm, sm + 0.3) * (1 - seg(t, sm + 0.5, sm + 1.2));
      return E.cine.shot(ctx, {
        set: 'bd88_dispatch_room', grade: 'cold', haze: 0.25, dof: true,
        cam: { from: { x: 20, y: 20, z: 1.08 }, to: { x: -10, y: 10, z: 1.2 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'bd88_dispatcher', x: 380, y: 1760, scale: 1.15, dir: 1, turn: 0.45, pose: 'sit', expr: 'focused', noChair: true, depth: 1.0,
            keys: [{ at: hd, pose: 'hand_to_face', expr: 'worried', headTurn: 0.15, dur: 0.3 }, { at: sm, pose: 'hand_to_face', expr: 'shocked', headTurn: 0.1, dur: 0.25 }, { at: se, pose: 'sit_type', expr: 'determined', headTurn: 0.3, dur: 0.35 }, { at: of + 0.4, pose: 'sit_type_b', expr: 'stern', dur: 0.3 }] }
        ],
        props: [
          // the middle monitor's waveform (the accent object of this shot) and the spike flash
          { depth: 0.98, accent: true, svg: tt => `<g transform="translate(374 834)">${waveform(332, 242, tt, flashAt(tt, sm) + 0.5 * seg(tt, sm, sm + 0.2) * (1 - seg(tt, sm + 0.6, sm + 1.4)))}</g>` + wash(540, 955, 360, 260, '#ffd9a0', f1(0.3 * spike)) },
        ],
        overlays: [
          { type: 'impact', at: sm, x: 540, y: 950 },
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'BOTH CHARGED · BURGLARY, CONSPIRACY · 2013', fs: 32, sub: 'Police say · no verdict found · as of Oct 2026' },
          { type: 'counter', at: of + 0.35, dur: 0.9, from: 0, to: 30, prefix: '', suffix: '%', label: 'MOBILE 911 CALLS · ACCIDENTAL', y: 1000, fs: 120 },
          { type: 'label', at: of + 0.5, x: 60, y: 1250, text: 'Google / San Francisco dispatch study, 2015', fs: 26 }
        ],
        tag: GEN
      });
    },

    // 3 - REHOOK + CASE 2: the living room, snow at the window; the silhouette walks in from the left; on "charged" he
    //     bends to the socket and the phone lights up on the floor, plugged in
    bd88_plug(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 1.5), ch = WT(ctx, 1, 2, 2.4), ph = WT(ctx, 1, 4, 3.1);
      const lit = seg(t, ch + 0.1, ch + 0.5);
      return E.cine.shot(ctx, {
        set: 'bd88_room', setOpts: { view: 'wide' }, grade: 'cold', haze: 0.25,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 20, y: 30, z: 1.07 } },
        figures: [
          { id: 'bd88_wilkins', x: 760, y: 1560, scale: 0.8, dir: 1, turn: 0.45, pose: 'stand_tense', silhouette: 'cool', depth: 1.0,
            walk: { at: 0.0, dur: Math.max(0.9, l2 - 0.2), cadence: 3.6, stride: 14, from: 320, to: 760 },
            keys: [{ at: l2, pose: 'examine', headTurn: 0.2, dur: 0.4 }, { at: ch, pose: 'examine', headTurn: 0.4, dur: 0.3 }, { at: ph + 0.3, pose: 'stand_tense', headTurn: -0.3, dur: 0.4 }] }
        ],
        props: [
          // the charger lead and the phone on the floor by the socket (lit from "charged")
          { depth: 1.02, accent: true, svg: tt => { const k = seg(tt, ch - 0.1, ch + 0.3); if (k <= 0) return ''; return `<path d="M1030 1230 Q1030 1290 980 1300" fill="none" stroke="#e8e2d6" stroke-width="6"/>` + phoneFlat(930, 1310, 120, { lit: seg(tt, ch + 0.1, ch + 0.5) }); } }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'SILVER SPRING, MARYLAND · JAN 2011', fs: 34, sub: 'His own home had lost power in a snowstorm (police)' }
        ],
        tag: TAG
      });
    },

    // 4 - CASE 2's GOTCHA + the FUN FACT: closer on the window and the socket; on "fled" he goes out through the window
    //     and the curtain gusts; on "charging" the phone glows with the callout; on line 2 the officer comes in from the
    //     right and kneels to it; the 26-years label; the fun-fact card
    bd88_window(ctx) {
      const t = ctx.t, T = ctx.T, fl = WT(ctx, 0, 1, 0.6), st = WT(ctx, 0, 5, 1.9), l2 = LS(ctx, 1, 2.8), co = WT(ctx, 1, 3, 3.6), ff = l2 + 0.35;
      return E.cine.shot(ctx, {
        set: 'bd88_room', setOpts: { view: 'close', gust: seg(t, fl, fl + 0.3) * (1 - seg(t, fl + 1.2, fl + 2.2)) }, grade: 'cold', haze: 0.2, dof: true,
        cam: { from: { x: 0, y: 20, z: 1.04 }, to: { x: 0, y: 30, z: 1.12 } },
        figures: [
          { id: 'bd88_wilkins', x: 560, y: 1540, scale: 0.9, dir: -1, turn: 0.4, pose: 'stand_tense', silhouette: 'cool', depth: 1.0, show: [0, fl + 0.75],
            keys: [{ at: 0.05, headTurn: 0.3, dur: 0.3 }, { at: fl, x: 300, y: 1460, pose: 'point_up', headTurn: 0.1, dur: 0.45 }] },
          { id: 'bd88_officer', x: 880, y: 1620, scale: 0.9, dir: -1, turn: 0.4, pose: 'torch_low', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#1a2230' }, propOpts: { beamLen: 420, aim: 150 }, show: [l2 - 0.2],
            walk: { at: l2 - 0.2, dur: 0.7, cadence: 4.0, stride: 16, from: 1180, to: 880 },
            keys: [{ at: l2 + 0.5, pose: 'torch_low', expr: 'determined', dur: 0.3 }, { at: co, pose: 'present', expr: 'stern', headTurn: 0.2, dur: 0.4 }] }
        ],
        props: [
          { depth: 1.02, accent: true, svg: tt => `<path d="M1045 1230 Q1045 1300 990 1310" fill="none" stroke="#e8e2d6" stroke-width="7"/>` + phoneFlat(930, 1320, 150, { lit: 0.7 + 0.3 * Math.sin(tt * 6) * seg(tt, st, st + 0.3) }) + wash(930, 1280, 260, 200, '#cfe4ff', f1(0.18 * seg(tt, st, st + 0.3))) }
        ],
        overlays: [
          { type: 'callout', at: st, until: l2 + 0.3, target: [930, 1300], label: [1020, 760], anchor: 'end', w: 420, text: 'STILL CHARGING', sub: 'Found in the socket by police', r: 60, depth: 1.02 },
          { type: 'label', at: co + 0.1, x: 60, y: 560, text: '26 YEARS · ADMITTED SEVEN BREAK-INS', fs: 32, sub: 'Sentenced July 2011, Montgomery County (UPI, NBC)' },
          { type: 'funfact', at: ff, x: 40, w: 760, y: 700, fs: 38, rows: [{ text: 'AN FCC COMMISSIONER’S ESTIMATE:' }, { text: '84 MILLION BUTT-DIALS' }, { text: 'TO 911 EVERY YEAR' }, { text: 'Michael O’Rielly, 2014; about half of mobile 911 calls', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 5 - REHOOK + CASE 3: the closed restaurant; the silhouette crosses to the counter, sets the phone down on "left" and
    //     walks off right on "behind" without it; the phone glows on the counter with the callout
    bd88_diner(ctx) {
      const t = ctx.t, T = ctx.T, lf = WT(ctx, 0, 4, 1.6), bh = WT(ctx, 0, 7, 2.6);
      const onCounter = t > lf;
      return E.cine.shot(ctx, {
        set: 'bd88_diner_room', grade: 'warm', haze: 0.25,
        cam: { from: { x: -20, y: 20, z: 1.02 }, to: { x: 10, y: 30, z: 1.08 } },
        figures: [
          { id: 'bd88_traynor', x: 520, y: 1600, scale: 0.75, dir: 1, turn: 0.4, pose: 'present', silhouette: 'cool', depth: 1.0,
            walk: { at: 0.0, dur: Math.max(0.8, lf - 0.3), cadence: 3.6, stride: 14, from: 200, to: 520 },
            keys: [{ at: lf - 0.1, pose: 'examine', headTurn: 0.2, dur: 0.3 }, { at: bh, pose: 'walk', headTurn: -0.3, dur: 0.3 }, { at: bh + 0.3, x: 1150, pose: 'stand_tense', dur: Math.max(0.6, T - bh - 0.5) }] }
        ],
        props: [
          // the phone: in his hand until "left", then on the counter, glowing
          { depth: 1.02, accent: true, svg: tt => (tt > lf ? phoneFlat(600, 1112, 130, { lit: 0.8 + 0.2 * Math.sin(tt * 4) }) : '') }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'WALNUT CREEK, CALIFORNIA · POLICE SAY', fs: 34, sub: 'Caught on video; the reports give no date' },
          { type: 'callout', at: lf + 0.4, target: [600, 1100], label: [1040, 820], anchor: 'end', w: 440, text: 'LEFT INSIDE', sub: 'Police say it led them to him', r: 70, depth: 1.02 }
        ],
        tag: TAG
      });
    },

    // 6 - THE BIGGEST GOTCHA (the music drop): the station lobby; the silhouette walks in from the left to the front
    //     counter where his phone lies glowing; the desk officer picks it up on "back"; on "Arrested" the cuffs
    bd88_station(ctx) {
      const t = ctx.t, T = ctx.T, bk = WT(ctx, 0, 6, 2.0), ar = WT(ctx, 0, 7, 2.7);
      return E.cine.shot(ctx, {
        set: 'bd88_lobby', grade: 'cold', haze: 0.2,
        cam: { from: { x: -10, y: 20, z: 1.02 }, to: { x: 10, y: 10, z: 1.1 } },
        figures: [
          { id: 'bd88_traynor', x: 470, y: 1680, scale: 0.95, dir: 1, turn: 0.45, pose: 'present', silhouette: 'cool', depth: 1.0,
            walk: { at: 0.0, dur: Math.max(0.9, bk - 0.5), cadence: 3.6, stride: 14, from: 60, to: 470 },
            keys: [{ at: bk - 0.3, pose: 'point', headTurn: 0.2, dur: 0.4 }, { at: ar, pose: 'hands_behind', headTurn: 0.4, dur: 0.45 }, { at: ar + 0.6, pose: 'bowed', dur: 0.4 }] },
          { id: 'bd88_officer', x: 820, y: 1300, scale: 0.72, dir: -1, turn: 0.4, pose: 'stand', expr: 'neutral', depth: 0.95, hat: { style: 'cap', color: '#1a2230' },
            keys: [{ at: 0.2, pose: 'hands_together', expr: 'focused', dur: 0.4 }, { at: bk, pose: 'present', expr: 'stern', headTurn: 0.1, dur: 0.35 }, { at: ar, pose: 'point', expr: 'stern', dur: 0.35 }] }
        ],
        props: [
          // the phone on the counter until "back", then held up by the officer
          { depth: 0.96, accent: true, svg: tt => (tt < bk ? phoneFlat(700, 1070, 110, { lit: 0.8 }) : phoneAt(760 - 28, 1000 - 60 * ease.out(seg(tt, bk, bk + 0.35)), 56, 108, { lit: 1 }) + wash(788, 960, 160, 160, '#cfe4ff', 0.14)) }
        ],
        overlays: [
          { type: 'label', at: ar + 0.2, x: 60, y: 560, text: 'ARRESTED AT THE STATION · POLICE SAY', fs: 34, sub: 'Booked for burglary; no court outcome found' }
        ],
        tag: TAG
      });
    },

    // 7 - THE CALLBACK (the loop): frame 1's street, the same lookout and pocket; on "minutes" the screen dims as the
    //     call ends; the phone sinks back to frame 1's position and the camera eases back to frame 1's start, so the
    //     last frame equals the first
    bd88_end(ctx) {
      const t = ctx.t, T = ctx.T, mn = WT(ctx, 0, 4, 1.4);
      const back = T - 0.55;
      const dim = 0.35 * seg(t, mn, mn + 0.25) * (1 - seg(t, mn + 0.5, Math.min(mn + 0.9, back)));
      const rise = 1 - ease.inOut(seg(t, 0.1, Math.max(0.9, back - 0.1)));
      return E.cine.shot(ctx, {
        set: 'bd88_street', grade: 'night', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        // he glances at the pocket on the callback line and is back in frame 1's pose before the last frame (the loop)
        figures: [{ ...HERO_FIG, keys: [{ at: 0.3, pose: 'stand', headTurn: 0.35, dur: 0.4 }, { at: Math.max(1.0, back - 0.4), pose: 'stand_tense', headTurn: 0, dur: 0.4 }] }],
        props: [{ depth: 1.05, accent: true, svg: tt => pocketPhone({ rise, lit: 1 - dim, t: tt }) }],
        overlays: [],
        tag: TAG
      });
    }
  });
})();
