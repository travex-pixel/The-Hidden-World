/* Case File 73 (premium look, engagement v5 = the new phone-ready sound, the LIST FORMAT): BORDER FAILS, PART 4 (after 59,
   the catapult, 63, the Jeep on the fence, and 72, the KFC tunnel, which teased "PART 4: A FAKE BORDER PATROL TRUCK").
   THE LIST = three disguised vehicles, best last:
   ITEM 1: 9 June 2023, west El Paso: two vans made to look like FedEx vans, stopped by Border Patrol and Texas DPS; four
   arrests. ITEM 2: 8 January 2025, Andrade (California) -> Yuma (Arizona): a pickup made up as a Border Patrol K-9 unit,
   "down to the license plate number"; agents watching from a casino parking lot followed it to a garage at a home.
   ITEM 3 (hero + hook): 22 July 2023, near Calexico: agents saw someone cutting the border fence; Mexican police found a
   white pickup made to look like a Border Patrol truck, and 17 people, before it crossed.
   Structure: frame 1 = the HERO, a sound-off picture of the headline: dusk on the line seen from the American side; a
   white pickup in border-patrol-style livery (plain lettering, a green stripe, a peeling decal) parked on the MEXICAN side
   behind a freshly cut gap in the steel fence; a real agent in the foreground does a double take; the camera already
   pushing. Item 1 on a west El Paso street by day; item 2 on a desert road at night, then at a house's garage (the copied
   plate circled: the FUN FACT); item 3 close on the fence (the cut, sparks), then the biggest reveal on a dark rise on the
   American side (two agents watching: the single impact, the music drop), then the Mexican side at night (police lights,
   the 17 counter), the one closing line back on frame 1's picture (the loop) with the end card.
   Smoothness: cuts and dissolves, one push (into item 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact.
   Screen direction: northbound = RIGHT (the vans and the K-9 truck face/drive right; the fake truck faces right).
   Look: episode.look = 'premium', one dusk-to-night palette (shadow #151c28, mid #cab79c, accent #e6a23a). The accent
   object is the fake truck (and per item its stand-in: the vans, the K-9 truck), props marked accent: true.
   Content rules: no weapon, no violence; agents and officers hold only flashlights. The fence-cutter is an anonymous dark
   silhouette; charged people are never drawn or named. Figures are generic with no badge, flag, seal or insignia. The fake
   trucks carry plain lettering only (no seal or crest); the copied plate is blank dots, never a number. FedEx is plain
   text only: the vans are plain white, no logo or brand colours. The people found with the truck are never shown.
   New environments (E.registerSets): bf73_line (the border at dusk from the American side), bf73_street (a west El Paso
   street by day), bf73_desert (the desert at night, view 'road' or 'rise'), bf73_garage (a house's garage at night),
   bf73_mx (the Mexican side at night, looking north at the fence). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#e6a23a', GLOW = '#ffcf7a';
  const WHITE = '#e9e6de', GREEN = '#2f6a4a';
  const TXT = 'font-family="Nunito" font-weight="900"';

  // ---------- vehicles (generic; no badge, seal, crest or real plate number)
  // the fake truck: a white pickup (side view, facing right; dir -1 faces left) in border-patrol-style livery: a plain
  // green stripe, plain lettering, an unlit roof bar; o.k9: a dog box in the bed; o.peel 0..1: the stripe's decal peels at
  // the rear; o.spin: wheel angle; o.lights: headlights; local ground y 0, body x -372..384
  function fakeTruck(x, y, s, o = {}) {
    const dir = o.dir || 1, sp = o.spin || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * dir)} ${sc(s)})"><ellipse cx="0" cy="4" rx="400" ry="22" fill="#000" opacity="0.4"/>`;
    if (o.glow) g += wash(0, -150, 460, 200, ACC, f1(0.14 * o.glow));
    g += `<path d="M-360 -60 L-360 -170 L-40 -170 L-30 -262 Q-26 -280 0 -280 L150 -280 Q180 -278 196 -254 L240 -178 L350 -164 Q384 -158 384 -120 L384 -60 Z" fill="${WHITE}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-14 -264 L150 -264 Q170 -262 182 -246 L222 -180 L-20 -180 Z" fill="#26323e" stroke="${INK}" stroke-width="4"/><path d="M90 -264 L84 -180" stroke="${INK}" stroke-width="6"/>`;
    // the stripe: a plain green band with a thin pin-stripe, rising towards the front
    g += `<path d="M-360 -100 L384 -112 L384 -84 L-360 -76 Z" fill="${GREEN}" stroke="${INK}" stroke-width="3"/><path d="M-360 -70 L384 -78" stroke="${GREEN}" stroke-width="5"/>`;
    if (o.peel) { const k = clamp(o.peel, 0, 1);
      g += `<path d="M-360 -100 L${f1(-360 + 52 * k)} -101 L-360 ${f1(-76 - 4 * k)} Z" fill="${WHITE}" stroke="${INK}" stroke-width="2"/><path d="M${f1(-360 + 52 * k)} -101 Q${f1(-326 + 20 * k)} ${f1(-56 - 30 * k)} -360 ${f1(-76 - 4 * k)}" fill="#7fa88e" stroke="${INK}" stroke-width="2.5"/>`; }
    // plain lettering on the bed side; o.k9: a dog box in the bed and plain 'K-9' on the door
    g += `<text x="70" y="-146" text-anchor="middle" ${TXT} font-size="31" letter-spacing="2" fill="${GREEN}">BORDER</text><text x="70" y="-117" text-anchor="middle" ${TXT} font-size="31" letter-spacing="2" fill="${GREEN}">PATROL</text>`;
    if (o.k9) {
      g += `<rect x="-344" y="-262" width="290" height="94" rx="6" fill="#b8bcc0" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${-318 + i * 52}" y="-244" width="30" height="10" rx="4" fill="#5a5e62"/>`).join('');
      g += `<text x="-200" y="-124" text-anchor="middle" ${TXT} font-size="34" fill="${GREEN}">K-9</text>`;
    }
    // the roof bar (unlit), mirror, handles, lights
    g += `<rect x="10" y="-298" width="130" height="18" rx="6" fill="#3a3e44" stroke="${INK}" stroke-width="3"/><rect x="18" y="-294" width="50" height="10" rx="3" fill="#7a3a3a"/><rect x="82" y="-294" width="50" height="10" rx="3" fill="#3a4a7a"/>`;
    g += `<rect x="150" y="-160" width="30" height="8" rx="3" fill="#9a9a94"/><rect x="360" y="-150" width="26" height="22" rx="4" fill="#f4e6b0"/><rect x="-372" y="-150" width="16" height="30" rx="3" fill="#b8392b"/>`;
    g += `<path d="M-360 -70 L384 -70" stroke="#3a3c40" stroke-width="12"/>`;
    [-230, 250].forEach(wx => { g += `<path d="M${wx - 70} -60 A70 70 0 0 1 ${wx + 70} -60 Z" fill="#141518"/><g transform="translate(${wx} -54) rotate(${f1(sp * 57)})"><circle r="56" fill="#141516" stroke="${INK}" stroke-width="5"/><circle r="24" fill="#8e9498" stroke="${INK}" stroke-width="4"/><path d="M-20 0 L20 0 M0 -20 L0 20" stroke="#4a4e52" stroke-width="5"/></g>`; });
    if (o.lights) g += `<path d="M384 -140 L860 -230 L860 -30 Z" fill="#fff4d0" opacity="${f1(0.13 * o.lights)}"/>` + wash(384, -138, 70, 44, '#fff4d0', f1(0.5 * o.lights));
    return g + '</g>';
  }
  // the K-9 truck from behind (the tailgate close-up): a dog box over the tailgate, a plain green band, tail lights, the
  // copied plate drawn as blank dots (never a number); local ground y 0; o.hl 0..1 = the plate catches the light
  function truckRear(x, y, s, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="6" rx="330" ry="24" fill="#000" opacity="0.45"/>`;
    if (o.glow) g += wash(0, -260, 360, 260, ACC, f1(0.12 * o.glow));
    [-212, 212].forEach(wx => { g += `<rect x="${wx - 44}" y="-120" width="88" height="118" rx="20" fill="#141516" stroke="${INK}" stroke-width="5"/>`; });
    g += `<path d="M-200 -520 L200 -520 Q220 -520 224 -500 L240 -330 L-240 -330 L-224 -500 Q-220 -520 -200 -520 Z" fill="${WHITE}" stroke="${INK}" stroke-width="6"/><rect x="-150" y="-500" width="300" height="110" rx="10" fill="#26323e" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-250" y="-430" width="500" height="130" rx="8" fill="#b8bcc0" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3, 4, 5].map(i => `<rect x="${-210 + i * 74}" y="-410" width="44" height="12" rx="5" fill="#5a5e62"/>`).join('');
    g += `<path d="M-280 -310 L280 -310 L272 -120 L-272 -120 Z" fill="${WHITE}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-276 -236 L276 -236 L275 -206 L-275 -206 Z" fill="${GREEN}"/><text x="0" y="-252" text-anchor="middle" ${TXT} font-size="34" fill="${GREEN}">BORDER PATROL</text>`;
    g += [-254, 254].map(lx => `<rect x="${lx - 18}" y="-300" width="36" height="96" rx="6" fill="#b8392b" stroke="${INK}" stroke-width="4"/>` + wash(lx, -252, 50, 60, '#ff6a5a', 0.25)).join('');
    g += `<rect x="-300" y="-122" width="600" height="46" rx="8" fill="#3a3c40" stroke="${INK}" stroke-width="5"/>`;
    // the plate on the tailgate (blank dots), highlighted on the reveal
    const hl = o.hl || 0;
    if (hl > 0) g += wash(0, -168, 150, 70, GLOW, f1(0.45 * hl));
    g += `<rect x="-72" y="-196" width="144" height="58" rx="6" fill="#efeadc" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2, 3, 4, 5].map(i => `<circle cx="${-46 + i * 18.4}" cy="-162" r="5.5" fill="#2a3a5a"/>`).join('') + `<rect x="-60" y="-190" width="120" height="8" rx="3" fill="#8a96a8"/>`;
    return g + '</g>';
  }
  // a plain white delivery step van (side view, facing right; no logo, lettering or brand colours)
  function van(x, y, s, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="400" ry="22" fill="#000" opacity="0.35"/>`;
    if (o.glow) g += wash(0, -200, 440, 220, ACC, f1(0.12 * o.glow));
    g += `<path d="M-380 -60 L-380 -420 Q-380 -436 -364 -436 L210 -436 Q236 -436 244 -410 L300 -230 L372 -210 Q392 -204 392 -180 L392 -60 Z" fill="#eceae4" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M216 -412 L276 -236 L214 -236 Z" fill="#26323e" stroke="${INK}" stroke-width="4"/><rect x="120" y="-390" width="70" height="150" fill="#26323e" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M100 -420 L100 -64" stroke="#b8b6ae" stroke-width="4"/><path d="M-380 -110 L392 -110" stroke="#c8c6be" stroke-width="5"/><path d="M-366 -400 L80 -400" stroke="#ffffff" stroke-width="6" opacity="0.6"/>`;
    g += `<rect x="372" y="-196" width="22" height="26" rx="5" fill="#f4e6b0"/><rect x="-392" y="-200" width="16" height="40" rx="3" fill="#b8392b"/><rect x="140" y="-200" width="26" height="8" rx="3" fill="#9a9a94"/>`;
    [-250, 250].forEach(wx => { g += `<path d="M${wx - 66} -60 A66 66 0 0 1 ${wx + 66} -60 Z" fill="#141518"/><circle cx="${wx}" cy="-52" r="52" fill="#141516" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-52" r="22" fill="#8e9498" stroke="${INK}" stroke-width="4"/>`; });
    return g + '</g>';
  }
  // a generic patrol vehicle (facing right; no markings or crest), its roof bar softly alternating; col = body colour
  function patrol(x, y, s, t, col = '#2a2e36', on = 1) {
    const ph = (t * 1.6) % 1, a = ph < 0.5 ? 1 : 0.25, b = ph < 0.5 ? 0.25 : 1;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="340" ry="22" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-320 -60 L-310 -130 Q-300 -150 -260 -156 L-170 -164 L-90 -236 Q-70 -250 -30 -250 L120 -250 Q160 -250 190 -224 L260 -164 L310 -150 Q340 -140 340 -110 L340 -60 Z" fill="${col}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-150 -168 L-80 -230 L30 -230 L30 -168 Z M50 -168 L50 -230 L120 -230 Q150 -230 170 -212 L222 -168 Z" fill="#7a94a8" opacity="0.6" stroke="${INK}" stroke-width="4"/><path d="M-300 -110 L330 -110" stroke="#c8ccd0" stroke-width="10" opacity="0.4"/>`;
    g += `<rect x="-60" y="-272" width="56" height="20" rx="6" fill="#c84a3a" opacity="${f1(on * (0.4 + 0.6 * a))}"/><rect x="0" y="-272" width="56" height="20" rx="6" fill="#4a6ad0" opacity="${f1(on * (0.4 + 0.6 * b))}"/>`;
    if (on > 0) g += wash(-32, -262, 240, 130, '#ff6a5a', f1(0.22 * a * on)) + wash(28, -262, 240, 130, '#6a8aff', f1(0.22 * b * on));
    g += `<rect x="300" y="-136" width="40" height="18" rx="5" fill="#f4e6b0"/>` + [-190, 200].map(wx => `<circle cx="${wx}" cy="-46" r="54" fill="#141516" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-46" r="24" fill="#8a9096"/>`).join('') + '</g>';
    return g;
  }

  // ---------- the steel border fence, seen front-on: bollards from top TOP to bottom BOT across the frame; o.gap [x0, x1]
  // = the bollards whose centres fall inside are cut (k 0..1: 0 intact, 1 cut and swung out); o.hot 0..1 = the cut ends glow
  const TOP = 800, BOT = 1300, PITCH = 50, BW = 28;
  function fenceFront(o = {}) {
    const k = clamp(o.cut ?? 1, 0, 1), hot = o.hot || 0, [gx0, gx1] = o.gap || [9999, 9999];
    let g = `<rect x="-500" y="${TOP - 26}" width="${W + 1000}" height="28" fill="#3e3028" stroke="${INK}" stroke-width="4"/>`;
    for (let x = -480; x < W + 500; x += PITCH) {
      const inGap = x >= gx0 && x <= gx1;
      if (inGap && k > 0) {
        // cut at the foot and swung outwards from the top plate (alternating sides)
        const side = ((x - gx0) / PITCH) % 2 < 1 ? -1 : 1, a = side * 16 * ease.out(k);
        if (k < 1) g += `<g opacity="${f1(1 - seg(k, 0.15, 0.55))}" transform="translate(${x} ${TOP}) rotate(${f1(a)})"><rect x="${-BW / 2}" y="0" width="${BW}" height="${f1(BOT - TOP - 60 * k)}" fill="#5a4436" stroke="${INK}" stroke-width="4"/>` +
          (hot > 0 ? `<rect x="${-BW / 2}" y="${f1(BOT - TOP - 60 * k - 8)}" width="${BW}" height="10" fill="${GLOW}" opacity="${f1(hot)}"/>` : '') + `</g>`;
        g += `<rect x="${x - BW / 2}" y="${BOT - 30}" width="${BW}" height="30" fill="#4a3a2e" stroke="${INK}" stroke-width="4"/>` + (hot > 0 ? `<rect x="${x - BW / 2}" y="${BOT - 34}" width="${BW}" height="8" fill="${GLOW}" opacity="${f1(hot)}"/>` + wash(x, BOT - 30, 40, 24, GLOW, f1(0.4 * hot)) : '');
        continue;
      }
      g += `<rect x="${x - BW / 2}" y="${TOP}" width="${BW}" height="${BOT - TOP}" fill="#5a4436" stroke="${INK}" stroke-width="4"/><rect x="${x - BW / 2 + 4}" y="${TOP}" width="6" height="${BOT - TOP}" fill="#8a6a54" opacity="0.55"/>`;
    }
    g += `<rect x="-500" y="${BOT - 6}" width="${W + 1000}" height="20" fill="#4a4038"/>`;
    return g;
  }
  // the American-side foreground ground in front of the fence (part of the fence plane, so it never slides)
  const usGround = () => `<rect x="-500" y="${BOT + 4}" width="${W + 1000}" height="1100" fill="#3a3029"/><path d="M-500 ${BOT + 70} Q300 ${BOT + 40} ${W + 500} ${BOT + 80}" stroke="#4e4034" stroke-width="44" fill="none" opacity="0.8"/>` +
    E.cine.scrub(BOT + 30, 10, 7311, '#2a2a20', 0.8, -300, 1400) + E.cine.scrub(BOT + 420, 6, 7312, '#221f18', 1.3, -300, 1400);

  // ---------- new environments (generic illustrations, not replicas of real places)
  const duskSky = (id, t, night) => {
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night ? '#060b16' : '#121a30'}"/><stop offset="0.55" stop-color="${night ? '#141e34' : '#4a3a56'}"/><stop offset="1" stop-color="${night ? '#2a3044' : '#d8905e'}"/></linearGradient></defs><rect x="-500" y="-400" width="${W + 1000}" height="1600" fill="url(#${id})"/>`;
    s += E.cine.stars(t, night ? 110 : 40, 7301, -200, night ? 900 : 560);
    if (!night) s += wash(300, 1000, 520, 220, '#ffb070', 0.35);
    return s;
  };
  E.registerSets({
    // the border at dusk from the American side: a violet-to-amber sky, the low sun behind far hills in Mexico with a few
    // town lights, the Mexican-side ground behind the fence (the fence itself and the American ground are a prop)
    bf73_line(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let far = `<path d="M-500 1060 L-500 990 Q-200 950 120 980 Q420 1000 700 960 Q980 930 1580 990 L1580 1060 Z" fill="#3a3044"/>`;
      const r = R(7302); for (let i = 0; i < 30; i++) far += `<circle cx="${f1(-450 + r() * 2000)}" cy="${f1(990 + r() * 50)}" r="${f1(1.6 + r() * 2)}" fill="#ffd89a" opacity="${f1(0.35 + 0.4 * r())}"/>`;
      let mx = `<rect x="-500" y="1040" width="${W + 1000}" height="500" fill="#6a5242"/>` + E.cine.scrub(1050, 22, 7303, '#4a4030', 0.5, -400, 1500) + `<path d="M-500 1180 Q400 1150 1580 1190" stroke="#7e624e" stroke-width="40" fill="none" opacity="0.6"/>`;
      return { light: { dir: 1, rim: '#ffb878', key: '#ffd8b0' }, layers: [[0.05, duskSky('bf73lsky', t, false)], [0.25, far], [0.6, mx]] };
    },

    // a west El Paso street by day: pale sky, a brown mountain ridge, a row of low stucco shops with a palm, a sidewalk and
    // the road
    bf73_street(ctx, o = {}) {
      let sky = `<defs><linearGradient id="bf73ssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a9ab8"/><stop offset="1" stop-color="#ecdcc0"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#bf73ssky)"/>` + wash(820, 420, 300, 300, '#fff4dc', 0.3);
      let mts = `<path d="M-400 1000 L-200 900 L-60 930 L120 820 L280 880 L420 800 L600 900 L760 860 L960 940 L1180 880 L1480 960 L1480 1080 L-400 1080 Z" fill="#8a6e5e"/><path d="M120 820 L200 900 M420 800 L470 880 M760 860 L800 930" stroke="#6e5648" stroke-width="10" opacity="0.6"/>`;
      let shops = `<path d="M-400 1240 L-400 1000 L60 1000 L60 1040 L520 1040 L520 990 L980 990 L980 1050 L1480 1050 L1480 1240 Z" fill="#c8a88a" stroke="${INK}" stroke-width="5"/>`;
      shops += [0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${-340 + i * 260}" y="1090" width="150" height="110" fill="#5a6e7e" opacity="0.75" stroke="${INK}" stroke-width="4"/><rect x="${-350 + i * 260}" y="1066" width="170" height="16" fill="#9a7a62"/>`).join('');
      shops += `<path d="M1060 1240 Q1070 1050 1080 960" stroke="#5a4a36" stroke-width="18" fill="none"/>` + [-60, -20, 20, 60, 100].map(a => `<path d="M1080 960 Q${1080 + a * 1.6} ${940 - Math.abs(a) * 0.3} ${1080 + a * 2.6} ${1000 + Math.abs(a) * 0.4}" stroke="#4e6a3a" stroke-width="14" fill="none" stroke-linecap="round"/>`).join('');
      let road = `<rect x="-400" y="1240" width="${W + 800}" height="60" fill="#b8b0a2"/><rect x="-400" y="1300" width="${W + 800}" height="14" fill="#8a8478"/><rect x="-400" y="1314" width="${W + 800}" height="${H}" fill="#5a5a5e"/>`;
      for (let i = 0; i < 6; i++) road += `<rect x="${-320 + i * 340}" y="1800" width="170" height="12" fill="#f0e8d0" opacity="0.6"/>`;
      return { light: { dir: -1, rim: '#fff4dc', key: '#fff0dc' }, layers: [[0.05, sky], [0.2, mts], [0.5, shops], [0.8, road]] };
    },

    // the desert at night: a starry sky, the border wall as a long low line with floodlights far off, creosote flats, a
    // dirt road ('road'); or a dark rise in the foreground with the wall far below ('rise')
    bf73_desert(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), rise = o.view === 'rise', wy = rise ? 1120 : 1060;
      let sky = duskSky('bf73dsky', t, true) + `<circle cx="${rise ? 860 : 220}" cy="560" r="28" fill="#ece8d8" opacity="0.85"/>` + wash(rise ? 860 : 220, 560, 150, 150, '#d8e0ec', 0.12);
      let wall = `<path d="M-500 ${wy + 40} L-500 ${wy - 10} Q300 ${wy - 40} 1580 ${wy - 20} L1580 ${wy + 40} Z" fill="#1c2232"/>`;
      for (let x = -480; x < W + 500; x += 12) wall += `<rect x="${x}" y="${f1(wy - 28 + 0.004 * (x - 500) * (x - 500) * 0.002)}" width="5" height="26" fill="#3a3436" opacity="0.8"/>`;
      [-200, 260, 760, 1240].forEach(x => { wall += `<rect x="${x - 2}" y="${wy - 70}" width="4" height="48" fill="#2a2a2e"/><circle cx="${x}" cy="${wy - 72}" r="5" fill="#fff0c8"/>` + wash(x, wy - 60, 80, 50, '#ffe0a0', 0.22); });
      let ground = `<rect x="-500" y="${wy + 30}" width="${W + 1000}" height="${H}" fill="#2a2c34"/>` + E.cine.scrub(wy + 60, 24, 7321, '#1e2a22', 0.5, -400, 1500);
      if (!rise) ground += `<path d="M-500 1320 Q500 1290 1580 1316 L1580 1420 Q500 1390 -500 1440 Z" fill="#4a463e"/>` + E.cine.scrub(1700, 8, 7322, '#1a221c', 1.1, -300, 1400);
      const L = [[0.05, sky], [0.25, wall], [0.6, ground]];
      if (rise) L.push([0.9, `<path d="M-500 1500 Q200 1420 700 1460 Q1100 1490 1580 1440 L1580 2400 L-500 2400 Z" fill="#1a1c22"/><path d="M-500 1500 Q200 1420 700 1460 Q1100 1490 1580 1440" stroke="#5a6478" stroke-width="3" fill="none" opacity="0.5"/>` + E.cine.scrub(1470, 10, 7323, '#14181a', 1.0, -300, 1400)]);
      return { light: { dir: -1, rim: '#9ab4d0', key: '#b8c8dc' }, layers: L };
    },

    // a house's garage at night: a dark sky, a stucco house front with a porch light and a palm; the garage door is a
    // prop (it rolls up); a concrete driveway
    bf73_garage(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = duskSky('bf73gsky', t, true);
      let house = `<path d="M-400 1360 L-400 600 L-300 520 L1380 520 L1480 600 L1480 1360 Z" fill="#6a5e54" stroke="${INK}" stroke-width="6"/><rect x="-400" y="508" width="${W + 800}" height="24" fill="#4a3e36"/>`;
      house += `<rect x="-330" y="760" width="150" height="190" fill="#3a3430" stroke="${INK}" stroke-width="5"/><rect x="-316" y="776" width="122" height="158" fill="#e8c68a" opacity="0.35"/>`;
      house += `<rect x="1000" y="700" width="40" height="40" rx="8" fill="#ffe0a0"/>` + wash(1020, 740, 220, 260, '#ffc878', 0.22) + `<rect x="1100" y="760" width="160" height="300" fill="#3a2e28" stroke="${INK}" stroke-width="5"/>`;
      house += `<rect x="130" y="660" width="820" height="700" fill="#2a2420" stroke="${INK}" stroke-width="6"/>`;
      let drive = `<rect x="-400" y="1360" width="${W + 800}" height="${H}" fill="#7a7670"/>` + [0, 1, 2].map(i => `<path d="M${120 + i * 420} 1360 L${-200 + i * 700} ${H + 200}" stroke="#646058" stroke-width="5"/>`).join('');
      return { light: { dir: 1, rim: '#ffc878', key: '#e8d8c0' }, layers: [[0.05, sky], [0.5, house], [0.8, drive]] };
    },

    // the Mexican side at night, looking north: the fence across the frame (front-on), the glow of an American town
    // beyond it, a dirt lot in front
    bf73_mx(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = duskSky('bf73msky', t, true);
      let town = `<path d="M-500 1100 L-500 1020 Q400 990 1580 1030 L1580 1100 Z" fill="#20283a"/>`;
      const r = R(7331); for (let i = 0; i < 60; i++) town += `<circle cx="${f1(-450 + r() * 2000)}" cy="${f1(1010 + r() * 60)}" r="${f1(1.4 + r() * 2.2)}" fill="#ffd89a" opacity="${f1(0.3 + 0.45 * r())}"/>`;
      town += wash(540, 1040, 900, 120, '#ffc880', 0.12);
      let fence = '';
      for (let x = -480; x < W + 500; x += 34) fence += `<rect x="${x - 10}" y="860" width="20" height="300" fill="#3a2e28" stroke="${INK}" stroke-width="3"/>`;
      fence = `<rect x="-500" y="846" width="${W + 1000}" height="18" fill="#2e2620"/>` + fence;
      let ground = `<rect x="-500" y="1150" width="${W + 1000}" height="${H}" fill="#4a4038"/>` + E.cine.scrub(1180, 16, 7332, '#2a2a20', 0.6, -400, 1500) + `<path d="M-500 1640 Q500 1580 1580 1630" stroke="#5a4e44" stroke-width="60" fill="none" opacity="0.6"/>`;
      return { light: { dir: 1, rim: '#ffc880', key: '#d8d0c0' }, layers: [[0.05, sky], [0.25, town], [0.45, fence], [0.7, ground]] };
    }
  });

  // ---------- the hero arrangement (frame 1 and the last frame): the fake truck parked on the Mexican side behind a cut gap
  // in the fence; the lettering shows through the gap
  const TX = 400, TY = 1250, TS = 1.0, GAP = [345, 575];
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: -36, y: 40, z: 1.08 };
  const heroProps = (o = {}) => [
    { depth: 0.97, accent: true, svg: tt => fakeTruck(TX, TY, TS, { peel: o.peel ?? 1, glow: 0.7 }) },
    { depth: 1.0, svg: () => fenceFront({ gap: GAP, cut: 1, hot: o.hot || 0 }) + usGround() }
  ];
  const watcher = (keys = []) => ({ id: 'bf72_agent2', x: 880, y: 1820, scale: 0.72, dir: -1, turn: 0.45, pose: 'torch_low', expr: 'focused', depth: 1.03, hat: { style: 'cap', color: '#2e3a2a' }, propOpts: { beamLen: 340, aim: -6 }, keys });

  E.registerScenes({
    // 1 - hook (frame 1): the fake truck behind the cut gap at dusk, its lettering through the gap; the agent in the
    //     foreground does a double take and raises his light; the camera already pushing in on the gap
    bf73_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.6), nb = WT(ctx, 1, 3, 3.4);
      return E.cine.shot(ctx, {
        set: 'bf73_line', grade: 'dawn', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [
          watcher([{ at: 0.35, pose: 'torch_low', expr: 'focused', headTurn: 0.3, dur: 0.35 }, { at: 0.9, pose: 'torch', expr: 'shocked', headTurn: -0.15, dur: 0.35 }, { at: nb, pose: 'point', expr: 'realise', dur: 0.4 }])
        ],
        props: heroProps({ hot: 0.8 * (1 - seg(t, 0, T)) + 0.2 }),
        overlays: [],
        tag: TAG
      });
    },

    // 2 - ITEM 1, THE FAKE FEDEX VANS: a west El Paso street by day; two plain white vans pulled over at the kerb, a
    //     patrol car behind; an officer walks up with a flashlight and waves the driver out on 'stopped'
    bf73_fedex(ctx) {
      const t = ctx.t, T = ctx.T, vn = WT(ctx, 0, 2, 0.6), st = WT(ctx, 1, 2, 2.4), ar = WT(ctx, 1, 5, 3.2);
      return E.cine.shot(ctx, {
        set: 'bf73_street', grade: 'warm', haze: 0.4,
        cam: { from: { x: -20, y: 40, z: 1.0 }, to: { x: 10, y: 60, z: 1.07 } },
        figures: [
          { id: 'bf72_cop', x: 120, y: 1800, scale: 0.56, dir: 1, turn: 0.3, pose: 'torch_low', expr: 'focused', depth: 1.04, hat: { style: 'cap', color: '#3a3a30' }, propOpts: { beamLen: 260 },
            walk: { at: 0.1, dur: Math.max(1.2, st - 0.3), cadence: 3.4, stride: 14, from: 60, to: 360 },
            keys: [{ at: st, pose: 'point', expr: 'stern', dur: 0.35 }, { at: ar + 0.2, pose: 'torch_low', expr: 'determined', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.96, svg: tt => patrol(-300, 1540, 0.7, tt + (ctx.sceneStart || 0), '#f0eee8') },
          { depth: 0.98, accent: true, svg: tt => van(930, 1560, 0.74, { glow: 0.4 }) + van(330 + 6 * Math.sin(Math.min(tt, vn) * 2), 1580, 0.78, { glow: 0.5 }) }
        ],
        overlays: [
          { type: 'label', at: vn + 0.1, x: 60, y: 560, text: 'TWO FAKE "FEDEX" VANS', fs: 40, sub: 'West El Paso, Texas · June 2023' },
          { type: 'label', at: ar - 0.1, x: 60, y: 760, text: '4 SUSPECTS ARRESTED', fs: 40, sub: '26 people found · Border Patrol + DPS', typeDur: 0.6 }
        ],
        tag: TAG
      });
    },

    // 3 - the rehook + ITEM 2, THE K-9 CLONE: the desert at night, the wall far behind; the fake K-9 truck drives left to
    //     right on the dirt road, headlights on; an agent by his parked car in the foreground turns to watch it and points
    bf73_k9(ctx) {
      const t = ctx.t, T = ctx.T, k9 = WT(ctx, 1, 4, 2.6);
      const X = tt => lerp(-300, 700, ease.inOut(seg(tt, 0, T + 0.4)));
      return E.cine.shot(ctx, {
        set: 'bf73_desert', setOpts: { view: 'road' }, grade: 'night', haze: 0.35,
        cam: { from: { x: -30, y: 30, z: 1.0 }, to: { x: 20, y: 50, z: 1.06 } },
        figures: [
          { id: 'bf72_agent1', x: 930, y: 1830, scale: 0.7, dir: -1, turn: 0.4, pose: 'stand', expr: 'focused', depth: 1.04, hat: { style: 'cap', color: '#1e2630' },
            keys: [{ at: 0.6, pose: 'arms_crossed', expr: 'focused', headTurn: 0.1, dur: 0.6 }, { at: k9, pose: 'point', expr: 'realise', headTurn: 0.2, dur: 0.4 }] }
        ],
        props: [
          { depth: 0.98, accent: true, svg: tt => fakeTruck(X(tt), 1370, 0.85, { k9: true, spin: tt * 6, lights: 1, glow: 0.6 }) },
          { depth: 1.06, svg: () => `<g opacity="0.95">${patrol(1180, 1900, 0.75, 0, '#3a4048', 0)}</g>` }
        ],
        overlays: [
          { type: 'label', at: LS(ctx, 1, 1.6) + 0.1, x: 60, y: 560, text: 'A FAKE K-9 UNIT · JAN 2025', fs: 40, sub: 'Andrade, California, to Yuma, Arizona' }
        ],
        tag: TAG
      });
    },

    // 4 - the K-9 clone's payoff + the FUN FACT: the tailgate at a house's garage at night; the copied plate is circled on
    //     'plate'; on 'followed' the garage door rolls up (light floods out) and two agents walk in from the left
    bf73_plate(ctx) {
      const t = ctx.t, T = ctx.T, pl = WT(ctx, 0, 5, 1.4), fo = WT(ctx, 1, 2, 2.6), hm = WT(ctx, 1, 4, 3.2);
      const door = tt => { const k = ease.inOut(seg(tt, fo - 0.2, hm + 0.6)), h = 700 * (1 - k);
        let g = '';
        if (k > 0) g += `<rect x="130" y="660" width="820" height="700" fill="#e8c68a" opacity="${f1(0.55 * k)}"/>` + wash(540, 1100, 520, 360, GLOW, f1(0.3 * k));
        g += `<rect x="130" y="660" width="820" height="${f1(h)}" fill="#cfc6b8" stroke="${INK}" stroke-width="5"/>`;
        for (let y = 660 + 70; y < 660 + h; y += 70) g += `<path d="M130 ${f1(y)} L950 ${f1(y)}" stroke="#a8a094" stroke-width="4"/>`;
        return g; };
      return E.cine.shot(ctx, {
        set: 'bf73_garage', grade: 'night', haze: 0.3, dof: true,
        cam: { from: { x: 0, y: 60, z: 1.02 }, to: { x: 0, y: 90, z: 1.09 } },
        figures: [
          { id: 'bf72_agent1', x: -60, y: 1760, scale: 0.7, dir: 1, turn: 0.35, pose: 'torch', expr: 'focused', depth: 1.04, hat: { style: 'cap', color: '#1e2630' }, propOpts: { beamLen: 420 },
            walk: { at: fo - 0.2, dur: 1.2, cadence: 3.4, stride: 14, from: -160, to: 190 } },
          { id: 'bf72_agent2', x: -200, y: 1880, scale: 0.9, dir: 1, turn: 0.35, pose: 'torch_low', expr: 'determined', depth: 1.05, hat: { style: 'cap', color: '#2e3a2a' }, propOpts: { beamLen: 380 },
            walk: { at: fo, dur: 1.2, cadence: 3.4, stride: 14, from: -320, to: -40 } }
        ],
        props: [
          { depth: 0.55, svg: door },
          { depth: 1.0, accent: true, svg: tt => truckRear(560, 1420, 1.08, { hl: seg(tt, pl - 0.1, pl + 0.4), glow: 0.5 }) }
        ],
        overlays: [
          { type: 'circle', at: pl, target: [560, 1420 - 167 * 1.08], rx: 110, ry: 56, depth: 1.0 },
          { type: 'funfact', at: pl + 0.25, y: 420, rows: [{ text: 'IT MATCHED A REAL' }, { text: 'K-9 UNIT, DOWN TO' }, { text: 'THE PLATE NUMBER' }, { text: 'Border Report / Just the News, Feb 2025', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 5 - ITEM 3 begins: close on the fence at dusk; an anonymous silhouette on the Mexican side kneels at a bollard and
    //     cuts it (sparks); on 'cut' the bollard swings out and the gap opens
    bf73_cut(ctx) {
      const t = ctx.t, T = ctx.T, ct = WT(ctx, 0, 4, 1.4), fe = WT(ctx, 0, 7, 2.0);
      const k = seg(t, ct - 0.1, fe + 0.5);
      return E.cine.shot(ctx, {
        set: 'bf73_line', grade: 'dawn', haze: 0.3,
        cam: { from: { x: -100, y: 150, z: 1.46 }, to: { x: -110, y: 170, z: 1.54 } },
        sparks: { x: 420, y: BOT - 40, n: Math.round(26 * (1 - 0.6 * k)), d: 1.0 },
        figures: [
          { id: 'fj63_smug1', x: 470, y: 1250, scale: 0.3, dir: -1, turn: 0.3, pose: 'kneel', silhouette: 'cool', depth: 0.98,
            keys: [{ at: ct, pose: 'kneel', headTurn: 0.2, dur: 0.3 }, { at: fe + 0.3, pose: 'stand_tense', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => fenceFront({ gap: GAP, cut: seg(tt, ct - 0.1, fe + 0.5), hot: 0.9 }) + usGround() + wash(420, BOT - 40, 90, 60, GLOW, f1(0.35 * (1 - 0.5 * seg(tt, fe, T)))) }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'NEAR CALEXICO · JULY 2023', fs: 40, sub: 'About five miles from the port of entry' }
        ],
        tag: TAG
      });
    },

    // 6 - THE BIGGEST REVEAL: the American side on a dark rise; two agents by their vehicle watch the far sparks at the
    //     wall; a rack focus snaps onto them; the single impact on 'watching'
    bf73_watch(ctx) {
      const t = ctx.t, T = ctx.T, wa = WT(ctx, 0, 6, 1.7);
      const spark = tt => { const fl = 0.6 + 0.4 * Math.abs(Math.sin(tt * 23)); return wash(240, 1100, 46, 30, GLOW, f1(0.5 * fl)) + `<circle cx="240" cy="1100" r="${f1(4 + 3 * fl)}" fill="#fff0c0"/>`; };
      return E.cine.shot(ctx, {
        set: 'bf73_desert', setOpts: { view: 'rise' }, grade: 'night', haze: 0.35, dof: true,
        cam: { from: { x: 20, y: 60, z: 1.02 }, to: { x: 40, y: 90, z: 1.1 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'bf72_agent1', x: 560, y: 1640, scale: 0.78, dir: -1, turn: 0.45, pose: 'arms_crossed', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#1e2630' },
            keys: [{ at: wa - 0.3, pose: 'point', expr: 'determined', dur: 0.35 }] },
          { id: 'bf72_agent2', x: 850, y: 1740, scale: 0.9, dir: -1, turn: 0.4, pose: 'stand', expr: 'focused', depth: 1.03, hat: { style: 'cap', color: '#2e3a2a' },
            keys: [{ at: wa, pose: 'hands_together', expr: 'stern', headTurn: 0.1, dur: 0.4 }] }
        ],
        props: [
          { depth: 0.3, svg: spark },
          { depth: 0.99, svg: () => patrol(1060, 1560, 0.72, 0, '#3a4048', 0) }
        ],
        overlays: [
          { type: 'impact', at: wa, x: 240, y: 1000 },
          { type: 'label', at: wa + 0.4, x: 60, y: 560, text: 'THEY SAW THE CUT', fs: 40, sub: 'and alerted Mexican authorities (CBP)', typeDur: 0.6 }
        ],
        tag: TAG
      });
    },

    // 7 - the outcome: the Mexican side at night; a police pickup's lights; two officers with flashlights at the fake truck;
    //     the 17 counter (the people themselves are never shown)
    bf73_found(ctx) {
      const t = ctx.t, T = ctx.T, fd = WT(ctx, 0, 2, 0.8), n17 = WT(ctx, 0, 7, 1.9);
      return E.cine.shot(ctx, {
        set: 'bf73_mx', grade: 'night', haze: 0.35,
        cam: { from: { x: 30, y: 60, z: 1.02 }, to: { x: 10, y: 80, z: 1.08 } },
        figures: [
          { id: 'bf73_police', x: 960, y: 1740, scale: 0.6, dir: -1, turn: 0.35, pose: 'torch', expr: 'focused', depth: 1.03, hat: { style: 'cap', color: '#1a2232' }, propOpts: { beamLen: 360 },
            walk: { at: 0.05, dur: Math.max(1.0, fd), cadence: 3.4, stride: 14, from: 1120, to: 960 }, keys: [{ at: fd + 0.2, pose: 'torch_low', expr: 'determined', dur: 0.5 }] },
          { id: 'bf73_police', x: 150, y: 1420, scale: 0.42, dir: 1, turn: 0.35, pose: 'torch_low', expr: 'stern', depth: 0.99, hat: { style: 'cap', color: '#1a2232' }, propOpts: { beamLen: 320 },
            keys: [{ at: n17, pose: 'point', expr: 'focused', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.94, svg: tt => patrol(60, 1300, 0.5, tt + (ctx.sceneStart || 0), '#1e2a3e', 1) },
          { depth: 0.98, accent: true, svg: tt => fakeTruck(600, 1350, 1.0, { peel: 1, glow: 0.6 }) }
        ],
        overlays: [
          { type: 'counter', at: n17 - 0.6, dur: 1.0, from: 0, to: 17, prefix: '', suffix: '', label: 'PEOPLE FOUND · DETAINED (CBP)', y: 620, fs: 140 },
          { type: 'label', at: n17 + 0.9, x: 60, y: 900, text: 'TRUCK SEIZED IN MEXICO', fs: 38, sub: "by Mexico's Attorney General's office", typeDur: 0.6 }
        ],
        tag: TAG
      });
    },

    // 8 - the one closing line on frame 1's picture (the loop): the camera eases back from frame 1's end framing to its
    //     start; the agent lowers his light and shakes off the double take
    bf73_end(ctx) {
      const t = ctx.t, T = ctx.T, nv = WT(ctx, 0, 3, 1.0);
      return E.cine.shot(ctx, {
        set: 'bf73_line', grade: 'dawn', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [
          watcher([{ at: 0.2, pose: 'torch', expr: 'focused', dur: 0.4 }, { at: nv, pose: 'torch_low', expr: 'realise', headTurn: 0.2, dur: 0.5 }])
        ],
        props: heroProps({ hot: 0.2 }),
        overlays: [],
        tag: TAG
      });
    }
  });
})();
