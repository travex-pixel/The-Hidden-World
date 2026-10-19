/* Case File 80 (premium look, engagement v5): THE PEOPLE'S COURT CASE, an arrest 15 years later. A RESPECTFUL CASE UPDATE.
   Michelle Parker, 33, vanished on 17 November 2011, hours after a pre-taped "People's Court" episode aired in which her
   ex-fiance Dale Smith Jr. had sued her over a $5,000 engagement ring. Her car was found abandoned the next day; her phone
   was later recovered from a lake; her body has never been found. On 14 October 2026 Orlando police arrested Smith, 55, on a
   second-degree murder charge, crediting a fresh review and advances in digital forensics. He has pleaded not guilty and is
   held without bond; his lawyer says the state may not meet its burden and the probe focused too narrowly on him.
   Structure: frame 1 = the HERO, the sound-off picture of the headline: a living room at night, an old TV glowing with a
   generic courtroom drawn in silhouette, an open ring box on the coffee table (the accent), an EMPTY armchair, a framed
   silhouette on the cabinet, the camera already pushing in; on line 2 the wall calendar flips from NOV 2011 to OCT 2026.
   Then: a generic TV studio (his silhouette at the plaintiff's lectern, the other lectern EMPTY, the TV-verdict card); a
   condo doorway at dusk (his silhouette in the door, an empty twin stroller, the door closes); an evidence table (the car's
   tagged key, then the phone in a wet evidence bag); a lake at dusk (a searcher's torch, the memorial card, 15 YEARS);
   THE REVEAL at night (an officer walks his silhouette to a patrol car: the music drop); a cold-case desk (a location trail
   draws on a generic map); a courtroom (his silhouette in the dock, his generic lawyer, the defence card); the one closing
   line back on frame 1's living room (the loop) with the end card.
   Smoothness: cuts and dissolves, one push (into the reveal), one zoom (the end); one slow camera move per shot; no shake,
   no handheld, no impact (a respectful tone). Screen direction: movement runs LEFT TO RIGHT.
   Look: episode.look = 'premium', one cool night palette (shadow #121a24, mid #c2b8a8, accent #d8a64a). The ONLY strongly
   coloured object is the gold engagement ring (and, per scene, one accent prop: the evidence phone, the light bar's glow,
   the location trail), props marked accent: true.
   Content rules: Michelle Parker is NEVER drawn (empty armchair, empty lectern, a framed silhouette tagged NOT A LIKENESS);
   Smith is accused and presumed innocent: a dark silhouette tagged NOT A LIKENESS; the children are never shown; no force,
   no weapon, no body. The show is plain text only: generic courtroom/studio, no logo, set, judge or show likeness.
   New environments (E.registerSets): pc80_room (the living room), pc80_studio (a generic TV-courtroom studio), pc80_condo
   (a condo front at dusk), pc80_evidence (an evidence room), pc80_lake (a lake at dusk), pc80_street (a night street),
   pc80_office (a cold-case office). The real courtroom uses the shared 'courtroom' set (modern). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#0e1014';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#d8a64a', GOLD_L = '#f4d68a', TVGLOW = '#9fb8d8', FONT = 'font-family="Nunito" font-weight="800"';

  // ---------- small props
  // the engagement-ring box, open (dark velvet, a gold band, a small stone); bottom-centre (x, y); o.glow 0..1
  function ringBox(x, y, s, o = {}) {
    const gl = o.glow ?? 0.8;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    g += wash(0, -70, 150, 110, ACC, f1(0.22 * gl)) + wash(0, -80, 70, 60, GOLD_L, f1(0.25 * gl));
    g += `<ellipse cx="0" cy="2" rx="80" ry="12" fill="#000" opacity="0.45"/>`;
    // the lid (open, tilted back) and its satin lining
    g += `<path d="M-62 -66 L-56 -128 Q0 -140 56 -128 L62 -66 Z" fill="#232030" stroke="${INK}" stroke-width="4"/><path d="M-48 -74 L-44 -118 Q0 -128 44 -118 L48 -74 Z" fill="#d8d2c8" opacity="0.85"/>`;
    // the base and the velvet cushion with its slit
    g += `<rect x="-66" y="-68" width="132" height="68" rx="10" fill="#2a2636" stroke="${INK}" stroke-width="4"/><rect x="-54" y="-70" width="108" height="20" rx="8" fill="#3a3448"/><path d="M-30 -60 L30 -60" stroke="#141218" stroke-width="5"/>`;
    // the ring (the accent): a gold band standing in the slit, a small stone and a glint
    g += `<ellipse cx="0" cy="-92" rx="24" ry="30" fill="none" stroke="${ACC}" stroke-width="9"/><ellipse cx="-4" cy="-96" rx="18" ry="24" fill="none" stroke="${GOLD_L}" stroke-width="3" opacity="0.7"/>`;
    g += `<path d="M-11 -124 L0 -138 L11 -124 L0 -114 Z" fill="#eef4ff" stroke="${INK}" stroke-width="2"/>`;
    if (gl > 0.05) { const k = f1(0.5 + 0.5 * gl); g += `<path d="M0 -150 L4 -138 L16 -134 L4 -130 L0 -118 L-4 -130 L-16 -134 L-4 -138 Z" fill="#fff" opacity="${k}"/>`; }
    return g + '</g>';
  }
  // the TV picture: a generic courtroom in silhouette (a bench with an EMPTY high-backed chair, two lecterns; a dark
  // featureless silhouette gestures at the left lectern, the right lectern stands empty in a spotlight); local 0..330 x 0..250
  function tvPicture(t) {
    let g = `<rect x="0" y="0" width="330" height="250" fill="#5a6e88"/><rect x="0" y="0" width="330" height="150" fill="#6e84a0"/>`;
    g += `<rect x="70" y="40" width="190" height="34" fill="#2e3a4c"/><rect x="60" y="72" width="210" height="70" fill="#26303e"/><path d="M150 40 L150 6 Q165 -2 180 6 L180 40 Z" fill="#202834"/>`;
    g += `<circle cx="165" cy="22" r="10" fill="none" stroke="#8a9ab0" stroke-width="3" opacity="0.6"/>`;
    g += `<rect x="0" y="170" width="330" height="80" fill="#3e4c60"/>`;
    // the spotlight on the empty right lectern
    g += `<path d="M232 0 L276 0 L300 230 L210 230 Z" fill="#dfe8f6" opacity="0.14"/>`;
    [[86, 0], [254, 1]].forEach(([lx]) => { g += `<path d="M${lx - 26} 230 L${lx - 20} 168 L${lx + 20} 168 L${lx + 26} 230 Z" fill="#1c2330"/><rect x="${lx - 30}" y="160" width="60" height="12" fill="#2c3646"/>`; });
    // the one silhouette (no features) with a gesturing arm
    const a = Math.sin(t * 3.1) * 14 + Math.sin(t * 1.3) * 8;
    g += `<g transform="translate(86 162)"><path d="M-28 0 Q-30 -46 0 -52 Q30 -46 28 0 Z" fill="#0c0f14"/><circle cx="0" cy="-66" r="16" fill="#0c0f14"/>` +
      `<path d="M20 -38 L${f1(44 + a * 0.4)} ${f1(-60 - a)}" stroke="#0c0f14" stroke-width="11" stroke-linecap="round"/></g>`;
    return g;
  }
  // an old CRT television on a low cabinet; bottom-centre (x, y) = the cabinet's floor line; the picture flickers
  function crtTV(x, y, s, t, o = {}) {
    const fl = 0.85 + 0.1 * Math.sin(t * 13) + 0.05 * Math.sin(t * 31);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    g += wash(0, -360, 420, 320, TVGLOW, f1(0.16 * fl)) + wash(60, 40, 520, 90, TVGLOW, f1(0.1 * fl));
    // the cabinet
    g += `<rect x="-260" y="-150" width="520" height="150" fill="#3a2e26" stroke="${INK}" stroke-width="5"/><rect x="-240" y="-130" width="230" height="110" fill="#33281f" stroke="#2a2018" stroke-width="3"/><rect x="10" y="-130" width="230" height="110" fill="#33281f" stroke="#2a2018" stroke-width="3"/>`;
    g += `<circle cx="-24" cy="-76" r="6" fill="#8a7458"/><circle cx="24" cy="-76" r="6" fill="#8a7458"/>`;
    // the set: a deep box, a grey bezel, the curved screen
    g += `<rect x="-210" y="-470" width="420" height="320" rx="26" fill="#4a4642" stroke="${INK}" stroke-width="6"/><rect x="-196" y="-456" width="392" height="292" rx="20" fill="#2c2a28"/>`;
    g += `<defs><clipPath id="pc80tv"><rect x="-180" y="-444" width="330" height="250" rx="24"/></clipPath></defs>`;
    g += `<g clip-path="url(#pc80tv)"><g transform="translate(-180 -444)" opacity="${f1(fl)}">${tvPicture(t)}</g>`;
    for (let i = 0; i < 25; i++) g += `<rect x="-180" y="${-444 + i * 10}" width="330" height="3" fill="#000" opacity="0.18"/>`;
    g += `<rect x="-180" y="-444" width="330" height="250" fill="#cfe0ff" opacity="${f1(0.06 + 0.04 * Math.sin(t * 7))}"/><path d="M-170 -436 Q-60 -452 60 -436" stroke="#fff" stroke-width="8" opacity="0.12" fill="none"/></g>`;
    g += `<rect x="160" y="-430" width="30" height="220" rx="6" fill="#3a3734"/>` + [0, 1, 2].map(i => `<circle cx="175" cy="${-410 + i * 46}" r="9" fill="#24221f" stroke="#5a5650" stroke-width="2"/>`).join('');
    g += `<circle cx="175" cy="-240" r="5" fill="#e04a3a" opacity="${f1(0.6 + 0.4 * Math.sin(t * 2))}"/>`;
    g += `<path d="M-60 -470 L-120 -560 M60 -470 L130 -570" stroke="#5a5650" stroke-width="5" stroke-linecap="round"/>`;
    return g + '</g>';
  }
  // the EMPTY armchair (muted fabric, a folded throw), bottom-centre (x, y)
  function armchair(x, y, s) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="230" ry="22" fill="#000" opacity="0.45"/>`;
    g += `<path d="M-170 -60 L-160 -420 Q-150 -470 -90 -476 L90 -476 Q150 -470 160 -420 L170 -60 Z" fill="#5a4440" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-120 -400 Q0 -430 120 -400 L116 -230 L-116 -230 Z" fill="#664e48" opacity="0.8"/>`;
    g += `<rect x="-150" y="-240" width="300" height="110" rx="26" fill="#6a524a" stroke="${INK}" stroke-width="5"/>`;
    [-1, 1].forEach(sd => { g += `<path d="M${sd * 150} -300 Q${sd * 230} -310 ${sd * 226} -250 L${sd * 210} -40 L${sd * 150} -40 Z" fill="#4e3a36" stroke="${INK}" stroke-width="5"/>`; });
    g += `<rect x="-170" y="-140" width="340" height="100" fill="#4a3632" stroke="${INK}" stroke-width="5"/>` + [-120, 120].map(lx => `<rect x="${lx - 10}" y="-40" width="20" height="40" fill="#2a1e1a"/>`).join('');
    // a folded throw over the right arm
    g += `<path d="M150 -300 Q200 -306 226 -270 L214 -170 Q190 -190 160 -180 Z" fill="#7a8a8e" stroke="${INK}" stroke-width="4" opacity="0.9"/>`;
    return g + '</g>';
  }
  // a small picture frame holding a dark featureless silhouette (NOT A LIKENESS); bottom-centre (x, y)
  function frame(x, y, s) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M-40 0 L-30 -16 L30 -16 L40 0 Z" fill="#2a2420"/>` +
      `<rect x="-56" y="-168" width="112" height="150" rx="4" fill="#b8955a" stroke="${INK}" stroke-width="4"/><rect x="-44" y="-156" width="88" height="126" fill="#c8c0b4"/>` +
      `<path d="M-34 -30 Q-34 -70 0 -76 Q34 -70 34 -30 Z" fill="#2a2a30"/><ellipse cx="0" cy="-100" rx="20" ry="24" fill="#2a2a30"/><path d="M-22 -112 Q0 -136 22 -112 Q26 -86 20 -78 L-20 -78 Q-26 -90 -22 -112 Z" fill="#2a2a30"/></g>`;
  }
  // the wall calendar: NOV 2011 until k > 0, then the page flips up to OCT 2026
  function calendar(x, y, k) {
    const pg = (m, yr) => `<rect x="-80" y="0" width="160" height="190" fill="#e8e2d4" stroke="${INK}" stroke-width="3"/><rect x="-80" y="0" width="160" height="50" fill="#7a5a4a"/>` +
      `<text x="0" y="38" text-anchor="middle" ${FONT} font-size="32" fill="#f4efe4">${m}</text><text x="0" y="96" text-anchor="middle" ${FONT} font-size="40" fill="#2a2420">${yr}</text>` +
      [0, 1, 2, 3].map(r => [0, 1, 2, 3, 4, 5, 6].map(c => `<rect x="${-66 + c * 19}" y="${112 + r * 18}" width="13" height="11" fill="#b8ae9c"/>`).join('')).join('');
    const f = ease.inOut(clamp(k, 0, 1));
    let g = `<g transform="translate(${x} ${y})"><circle cx="0" cy="-10" r="6" fill="#5a5048"/>${pg('OCT', '2026')}`;
    if (f < 1) g += `<g transform="translate(0 0) scale(1 ${f1((1 - 2 * f) * 100) / 100 || 0.01})">${f < 0.5 ? pg('NOV', '2011') : `<rect x="-80" y="0" width="160" height="190" fill="#d8d0c0"/>`}</g>`;
    return g + '</g>';
  }
  // a generic patrol car (no text, no crest), side view facing left; ground y = 0; light bar alternates red/blue
  function patrolCar(x, y, s, t, op = 0) {
    const ph = Math.sin(t * 9) > 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="6" rx="330" ry="24" fill="#000" opacity="0.5"/>`;
    g += `<path d="M-320 -40 L-310 -120 Q-300 -150 -250 -156 L-160 -164 L-90 -240 Q-70 -256 -40 -256 L130 -256 Q160 -256 180 -236 L250 -168 L300 -160 Q330 -150 330 -110 L330 -40 Z" fill="#e4e6ea" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-320 -100 L330 -100 L330 -40 L-320 -40 Z" fill="#1c2230"/><path d="M-80 -232 L-20 -232 L-20 -168 L-140 -166 Z M0 -232 L120 -232 Q140 -232 156 -214 L196 -168 L0 -168 Z" fill="#2a3440" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-60" y="-276" width="140" height="22" rx="8" fill="#2a2a2e"/><rect x="-56" y="-274" width="64" height="18" rx="6" fill="${ph ? '#e8443a' : '#4a1e1e'}"/><rect x="12" y="-274" width="64" height="18" rx="6" fill="${ph ? '#1e2a4a' : '#3a6ae8'}"/>`;
    g += ph ? wash(-24, -266, 260, 200, '#e8443a', 0.22) : wash(44, -266, 260, 200, '#3a6ae8', 0.22);
    g += [-200, 200].map(wx => `<circle cx="${wx}" cy="-40" r="56" fill="#141518" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-40" r="22" fill="#8a9096"/>`).join('');
    g += `<rect x="-322" y="-120" width="22" height="24" rx="6" fill="#ffe8b0"/>` + wash(-330, -108, 80, 40, '#ffe8b0', 0.3);
    // the rear door swings open toward the camera (op 0..1): a dark opening, a lit interior, the door panel swung left
    if (op > 0.01) { const k = ease.inOut(clamp(op, 0, 1)); g += `<path d="M0 -232 L120 -232 Q140 -232 156 -214 L196 -168 L196 -44 L0 -44 Z" fill="#0c0e12"/>` + wash(98, -140, 90, 80, '#ffe8b0', f1(0.25 * k)) +
      `<path d="M0 -236 L${f1(-150 * k)} ${f1(-226 - 20 * k)} L${f1(-150 * k)} -40 L0 -44 Z" fill="#d8dade" stroke="${INK}" stroke-width="5"/>`; }
    return g + '</g>';
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // the living room at night: a dark blue-grey wall, a window with blinds (night outside), a floor lamp, a wood floor
    pc80_room(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1600" fill="#1e2632"/>`;
      for (let x = -400; x < W + 400; x += 70) wall += `<rect x="${x}" y="-300" width="34" height="1600" fill="#222b38" opacity="0.6"/>`;
      // the window with blinds, right
      wall += `<rect x="640" y="430" width="360" height="430" fill="#0c1424" stroke="#3a3a3e" stroke-width="12"/>` + wash(760, 560, 120, 120, '#e8c890', 0.12) + `<circle cx="760" cy="560" r="10" fill="#f0d8a0" opacity="0.7"/>`;
      for (let y = 446; y < 850; y += 26) wall += `<rect x="646" y="${y}" width="348" height="12" fill="#5a6070" opacity="0.65"/>`;
      wall += `<rect x="-400" y="1240" width="${W + 800}" height="20" fill="#2a2a2e"/>`;
      let floor = `<rect x="-400" y="1250" width="${W + 800}" height="${H}" fill="#2e2620"/>`;
      for (let i = 0; i < 9; i++) floor += `<path d="M-400 ${1290 + i * 70} L${W + 400} ${1290 + i * 70}" stroke="#241d18" stroke-width="4"/>`;
      floor += `<ellipse cx="560" cy="1420" rx="560" ry="120" fill="#3a3436" opacity="0.6"/>`;
      // the floor lamp (warm pool on the empty chair)
      const lamp = `<path d="M1010 1250 L1010 640" stroke="#2a2826" stroke-width="10"/><path d="M950 650 L1070 650 L1040 560 L980 560 Z" fill="#d8c8a8" stroke="${INK}" stroke-width="4"/>` + wash(1000, 700, 260, 220, '#ffd29a', f1(0.14 + 0.01 * Math.sin(t))) + wash(860, 1100, 300, 220, '#ffcf8a', 0.07);
      return { light: { dir: 1, rim: TVGLOW, key: '#d8e0f0' }, layers: [[0.3, wall], [0.6, lamp], [0.8, floor]], dust: true };
    },

    // a generic TV-courtroom studio: dark panels, a lighting rig with cans, an elevated bench far back with an EMPTY chair
    // (no judge, no seal, no logo), gallery seats in shadow; the lecterns and the studio camera are drawn in the shot
    pc80_studio(ctx, o = {}) {
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#1a1f28"/>`;
      for (let x = -380; x < W + 400; x += 150) back += `<rect x="${x}" y="200" width="138" height="900" fill="#20262f" stroke="#151a20" stroke-width="4"/>`;
      let rig = `<rect x="-400" y="120" width="${W + 800}" height="18" fill="#2a2e34"/>` + [80, 300, 540, 780, 1000].map(lx => `<path d="M${lx} 138 L${lx} 170" stroke="#2a2e34" stroke-width="6"/><path d="M${lx - 30} 170 L${lx + 30} 170 L${lx + 22} 230 L${lx - 22} 230 Z" fill="#3a3e44" stroke="${INK}" stroke-width="3"/><ellipse cx="${lx}" cy="230" rx="20" ry="6" fill="#fff4dc"/>` + wash(lx, 260, 110, 70, '#fff0d0', 0.12)).join('');
      let bench = `<rect x="250" y="620" width="580" height="300" fill="#4a3a2c" stroke="${INK}" stroke-width="6"/><rect x="230" y="600" width="620" height="30" fill="#5e4a38" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M480 600 L480 470 Q540 440 600 470 L600 600 Z" fill="#2a2420" stroke="${INK}" stroke-width="5"/>` + [300, 420, 660, 780].map(x => `<rect x="${x}" y="660" width="80" height="220" fill="#423426" stroke="#2e241a" stroke-width="3"/>`).join('');
      let floor = `<rect x="-400" y="1120" width="${W + 800}" height="${H}" fill="#2a2a30"/>` + `<rect x="-400" y="1120" width="${W + 800}" height="16" fill="#3a3a42"/>`;
      return { light: { dir: 1, rim: '#e8eef8', key: '#e8eef8' }, layers: [[0.15, back], [0.25, rig], [0.4, bench], [0.8, floor]], dust: true };
    },

    // a condo block at dusk: a deep blue sky, palm silhouettes, a two-storey stucco front with a few lit windows, a front
    // door (its opening drawn here; the door panel itself is drawn in the shot so it can close), steps and a porch light
    pc80_condo(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="pc80sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141c34"/><stop offset="0.6" stop-color="#3a3a5a"/><stop offset="1" stop-color="#9a6a62"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#pc80sky)"/>` + E.cine.stars(t, 30, 8021, -200, 400);
      let palms = '';
      [-160, 1150, 980].forEach((px, i) => { const h = 760 + i * 60; palms += `<path d="M${px} 1200 Q${px + 20} ${1200 - h / 2} ${px - 10} ${1200 - h}" stroke="#121620" stroke-width="22" fill="none"/>` + [0, 1, 2, 3, 4, 5].map(k => { const a = -2.6 + k * 0.85; return `<path d="M${px - 10} ${1200 - h} Q${f1(px - 10 + Math.cos(a) * 120)} ${f1(1200 - h + Math.sin(a) * 60 - 40)} ${f1(px - 10 + Math.cos(a) * 220)} ${f1(1200 - h + Math.sin(a) * 120 + 40)}" stroke="#121620" stroke-width="14" fill="none" stroke-linecap="round"/>`; }).join(''); });
      let house = `<rect x="40" y="420" width="1000" height="830" fill="#8a8274" stroke="${INK}" stroke-width="7"/><rect x="20" y="400" width="1040" height="30" fill="#5a5448" stroke="${INK}" stroke-width="5"/><rect x="40" y="800" width="1000" height="14" fill="#6a6458"/>`;
      [[120, 500, 1], [780, 500, 0], [120, 880, 0], [800, 880, 1]].forEach(([wx, wy, lit]) => { house += `<rect x="${wx}" y="${wy}" width="170" height="200" fill="${lit ? '#e8c088' : '#2a2e3a'}" stroke="${INK}" stroke-width="6"/><path d="M${wx + 85} ${wy} L${wx + 85} ${wy + 200}" stroke="${INK}" stroke-width="5"/>` + (lit ? wash(wx + 85, wy + 100, 140, 140, '#ffc070', 0.14) : ''); });
      // the door opening (warm light inside) with its frame, the steps, the porch light
      house += `<rect x="440" y="860" width="200" height="390" fill="#ffd49a" stroke="${INK}" stroke-width="8"/>` + wash(540, 1060, 240, 300, '#ffc070', 0.22);
      house += `<rect x="400" y="1250" width="280" height="30" fill="#6a6258" stroke="${INK}" stroke-width="4"/><rect x="370" y="1280" width="340" height="30" fill="#5e564c" stroke="${INK}" stroke-width="4"/>`;
      const pl = o.porch ?? 1;
      house += `<rect x="676" y="900" width="26" height="40" rx="6" fill="${pl > 0.5 ? '#ffe0a0' : '#4a4436'}" stroke="${INK}" stroke-width="3"/>` + (pl > 0.05 ? wash(690, 940, 200, 200, '#ffd08a', f1(0.25 * pl)) : '');
      let ground = `<rect x="-400" y="1310" width="${W + 800}" height="${H}" fill="#3a3a34"/>` + `<path d="M-400 1500 L${W + 400} 1460" stroke="#4a4a42" stroke-width="40" opacity="0.6"/>`;
      return { light: { dir: -1, rim: '#ffc888', key: '#e8d0c0' }, layers: [[0.05, sky], [0.2, palms], [0.5, house], [0.8, ground]] };
    },

    // an evidence room: a grey wall with metal shelving and plain archive boxes (blank labels), strip lights
    pc80_evidence(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#2a3036"/>`;
      wall += [0, 1, 2].map(i => `<rect x="${-200 + i * 560}" y="160" width="300" height="16" rx="6" fill="#e8eef0" opacity="0.7"/>` + wash(-50 + i * 560, 200, 300, 90, '#e0ecf0', 0.08)).join('');
      let shelves = '';
      const r = R(8041);
      [-140, 480].forEach(sx => {
        shelves += `<rect x="${sx}" y="320" width="560" height="900" fill="none" stroke="#5a626a" stroke-width="10"/>`;
        for (let k = 0; k < 4; k++) { const y = 520 + k * 220; shelves += `<rect x="${sx}" y="${y}" width="560" height="14" fill="#5a626a"/>`;
          for (let b = 0; b < 3; b++) { const bw = 140 + r() * 30; shelves += `<rect x="${f1(sx + 20 + b * 180)}" y="${y - 150}" width="${f1(bw)}" height="150" fill="${['#8a7a60', '#7a6c54', '#94846a'][b]}" stroke="${INK}" stroke-width="3"/><rect x="${f1(sx + 50 + b * 180)}" y="${y - 110}" width="60" height="30" fill="#e8e2d4" opacity="0.8"/>`; } }
      });
      let floor = `<rect x="-400" y="1220" width="${W + 800}" height="${H}" fill="#3a3e42"/>`;
      return { light: { dir: 1, rim: '#d8e8f0', key: '#e8eef0' }, layers: [[0.2, wall], [0.45, shelves], [0.8, floor]] };
    },

    // a lake at dusk: a deep blue sky going mauve at the horizon, a dark treeline, still water with soft reflections, a
    // wooden dock on the right
    pc80_lake(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="pc80lk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1428"/><stop offset="0.75" stop-color="#2e3456"/><stop offset="1" stop-color="#6a5a6e"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1260" fill="url(#pc80lk)"/>` + E.cine.stars(t, 60, 8051, -200, 700);
      let trees = '';
      const r = R(8052); for (let i = 0; i < 16; i++) { const x = -380 + i * 120 + r() * 40, h = 80 + r() * 120; trees += `<ellipse cx="${f1(x)}" cy="${f1(960 - h / 2)}" rx="${f1(70 + r() * 30)}" ry="${f1(h / 2 + 10)}" fill="#0c1018"/>`; }
      trees += `<rect x="-400" y="940" width="${W + 800}" height="24" fill="#0c1018"/>`;
      let water = `<rect x="-400" y="960" width="${W + 800}" height="${H}" fill="#141c2c"/>`;
      for (let i = 0; i < 26; i++) { const y = 980 + i * 34 + i * i * 0.6, w = 120 + (i * 37) % 200, x = ((i * 173) % 1300) - 200 + 20 * Math.sin(t * 0.6 + i); water += `<rect x="${f1(x)}" y="${f1(y)}" width="${w}" height="4" rx="2" fill="#4a5674" opacity="${f1(0.25 + 0.15 * Math.sin(t * 1.3 + i))}"/>`; }
      water += wash(540, 980, 600, 60, '#6a5a6e', 0.18);
      // the dock: planks running right, posts
      let dock = `<path d="M560 1260 L1500 1240 L1500 1330 L540 1340 Z" fill="#4a3e34" stroke="${INK}" stroke-width="5"/>`;
      for (let k = 0; k < 12; k++) dock += `<path d="M${600 + k * 80} 1262 L${590 + k * 80} 1336" stroke="#3a3028" stroke-width="4"/>`;
      dock += [600, 840, 1080].map(px => `<rect x="${px}" y="1330" width="22" height="120" fill="#2e2620"/>`).join('');
      return { light: { dir: 1, rim: '#9ab0d8', key: '#c8d0e8' }, layers: [[0.05, sky], [0.3, trees], [0.6, water], [0.95, dock]] };
    },

    // a night street: an apartment front with a few lit windows, two street lamps, wet asphalt with reflections
    pc80_street(ctx, o = {}) {
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="1500" fill="#0e1420"/>`;
      back += `<rect x="-200" y="260" width="1480" height="1000" fill="#262a32" stroke="${INK}" stroke-width="6"/>`;
      const r = R(8061);
      for (let rr = 0; rr < 4; rr++) for (let c = 0; c < 7; c++) { const lit = r() < 0.3; back += `<rect x="${-140 + c * 200}" y="${320 + rr * 220}" width="120" height="140" fill="${lit ? '#d8b078' : '#1a1e26'}" stroke="${INK}" stroke-width="4"/>` + (lit ? wash(-80 + c * 200, 390 + rr * 220, 90, 90, '#ffc070', 0.1) : ''); }
      let lamps = [100, 980].map(lx => `<path d="M${lx} 1300 L${lx} 760" stroke="#2a2e34" stroke-width="12"/><path d="M${lx - 40} 760 L${lx + 40} 760 L${lx + 24} 730 L${lx - 24} 730 Z" fill="#3a3e44"/><ellipse cx="${lx}" cy="764" rx="30" ry="8" fill="#ffe0a8"/>` + wash(lx, 900, 220, 300, '#ffd8a0', 0.1)).join('');
      let street = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#1a1e24"/><rect x="-400" y="1260" width="${W + 800}" height="40" fill="#3a3e44"/>`;
      street += [100, 980].map(lx => `<rect x="${lx - 30}" y="1320" width="60" height="260" fill="#ffd8a0" opacity="0.07"/>`).join('');
      return { light: { dir: 1, rim: '#9ab0e8', key: '#c8d0e8' }, layers: [[0.15, back], [0.5, lamps], [0.85, street]] };
    },

    // a cold-case office at night: blinds, a case board of plain index cards on string (no photos, no names), a desk lamp
    pc80_office(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#1c2228"/>`;
      wall += `<rect x="-300" y="380" width="420" height="520" fill="#0e1420" stroke="#3a3e44" stroke-width="10"/>` + Array.from({ length: 18 }, (_, i) => `<rect x="-294" y="${392 + i * 28}" width="408" height="12" fill="#4a5262" opacity="0.6"/>`).join('');
      let board = `<rect x="200" y="380" width="760" height="500" fill="#7a6248" stroke="${INK}" stroke-width="8"/>`;
      const r = R(8071); const pts = [];
      for (let i = 0; i < 9; i++) { const x = 250 + (i % 3) * 240 + r() * 60, y = 420 + Math.floor(i / 3) * 150 + r() * 30; pts.push([x + 60, y + 40]); board += `<rect x="${f1(x)}" y="${f1(y)}" width="130" height="90" fill="#ece6d6" transform="rotate(${f1(-4 + r() * 8)} ${f1(x + 65)} ${f1(y + 45)})"/><rect x="${f1(x + 14)}" y="${f1(y + 20)}" width="90" height="8" fill="#a8a090"/><rect x="${f1(x + 14)}" y="${f1(y + 40)}" width="70" height="8" fill="#a8a090"/>`; }
      board += `<path d="M${pts.map(p => p.map(f1).join(' ')).join(' L')}" stroke="#a8443a" stroke-width="3" fill="none" opacity="0.8"/>`;
      let floor = `<rect x="-400" y="1240" width="${W + 800}" height="${H}" fill="#24282c"/>`;
      return { light: { dir: 1, rim: '#9ac0e8', key: '#d8e4f0' }, layers: [[0.2, wall], [0.4, board], [0.8, floor]] };
    }
  });

  // the hero prop (frame 1 and the last frame): TV + cabinet, the framed silhouette, the EMPTY armchair, the coffee table and
  // the ring box (the accent), the calendar; depth 1.0
  const CAL = [880, 330];
  function heroScene(t, o = {}) {
    let g = calendar(CAL[0], CAL[1], o.cal ?? 0);
    g += armchair(800, 1262, 0.92);
    g += crtTV(290, 1262, 0.92, t);
    g += frame(500, 1124, 0.62);
    // the coffee table (low, dark wood) and the ring box on it
    g += `<path d="M300 1236 L800 1236 L840 1276 L260 1276 Z" fill="#4a3628" stroke="${INK}" stroke-width="5"/><rect x="260" y="1276" width="580" height="22" fill="#3a2a1e" stroke="${INK}" stroke-width="4"/>` + [290, 810].map(lx => `<rect x="${lx - 8}" y="1298" width="16" height="50" fill="#2a1e16"/>`).join('');
    g += ringBox(560, 1240, 1.0, { glow: 0.75 + 0.25 * Math.sin(t * 2.2) });
    return g;
  }
  const hero = (o = {}) => ({ depth: 1.0, accent: true, svg: tt => heroScene(tt, o) });
  const HERO_CAM0 = { x: 0, y: -50, z: 1.1 }, HERO_CAM1 = { x: 20, y: -30, z: 1.18 };

  E.registerScenes({
    // 1 - hook (frame 1): the living room; the TV's generic courtroom flickers; the open ring box glints; the EMPTY armchair;
    //     the camera already pushing; on line 2 the calendar flips NOV 2011 -> OCT 2026 and the date label types on
    pc80_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.5);
      return E.cine.shot(ctx, {
        set: 'pc80_room', grade: 'night', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [],
        props: [hero({ cal: seg(t, l2, l2 + 0.7) })],
        overlays: [],
        tag: LIKE
      });
    },

    // 2 - the ring lawsuit: the generic studio; his silhouette at the plaintiff's lectern gestures; the other lectern stands
    //     EMPTY under its spotlight; the ring box on the stand between them glints on 'ring'; the TV-verdict card
    pc80_ring(ctx) {
      const t = ctx.t, T = ctx.T, sd = WT(ctx, 0, 3, 0.9), dl = WT(ctx, 0, 7, 1.9), rg = WT(ctx, 0, 8, 2.4);
      return E.cine.shot(ctx, {
        set: 'pc80_studio', grade: 'cold', haze: 0.3,
        cam: { from: { x: -20, y: 20, z: 1.02 }, to: { x: 10, y: 30, z: 1.08 } },
        figures: [
          { id: 'pc80_smith', x: 280, y: 1660, scale: 0.6, dir: 1, turn: 0.35, pose: 'stand', silhouette: 'cool', depth: 1.02,
            keys: [{ at: 0.15, pose: 'present', dur: 0.4 }, { at: sd, pose: 'point', headTurn: 0.2, dur: 0.4 }, { at: rg, pose: 'hands_together', dur: 0.5 }] }
        ],
        props: [
          // the spotlight cone on the EMPTY right lectern
          { depth: 1.0, svg: tt => `<path d="M720 120 L860 120 L980 1500 L600 1500 Z" fill="#e8f0ff" opacity="${f1(0.08 + 0.02 * Math.sin(tt * 2))}"/>` + wash(790, 1480, 220, 50, '#e8f0ff', 0.2) },
          // the two lecterns (plain, blank fronts)
          { depth: 1.03, svg: () => [[300, 0], [790, 1]].map(([lx]) => `<path d="M${lx - 120} 1660 L${lx - 100} 1300 L${lx + 100} 1300 L${lx + 120} 1660 Z" fill="#3a3028" stroke="${INK}" stroke-width="6"/><rect x="${lx - 130}" y="1280" width="260" height="30" fill="#4e4034" stroke="${INK}" stroke-width="5"/><rect x="${lx - 60}" y="1360" width="120" height="40" fill="#2a221c"/>`).join('') },
          // the evidence stand with the ring box (the accent)
          { depth: 1.01, accent: true, svg: tt => `<rect x="520" y="1250" width="40" height="300" fill="#2a2a30" stroke="${INK}" stroke-width="4"/><rect x="470" y="1236" width="140" height="20" fill="#3a3a42" stroke="${INK}" stroke-width="4"/>` + ringBox(540, 1238, 0.72, { glow: 0.5 + 0.5 * seg(tt, rg - 0.2, rg + 0.3) }) },
          // the studio camera (foreground, right edge) with its red tally light
          { depth: 1.1, svg: tt => `<g transform="translate(1010 1620)"><rect x="-140" y="-300" width="240" height="170" rx="16" fill="#16181c" stroke="${INK}" stroke-width="5"/><rect x="-200" y="-260" width="70" height="90" rx="10" fill="#101214"/><path d="M-20 -130 L-80 120 M-20 -130 L40 120 M-20 -130 L-20 120" stroke="#16181c" stroke-width="14"/><circle cx="70" cy="-280" r="10" fill="#e8443a" opacity="${f1(0.7 + 0.3 * Math.sin(tt * 4))}"/></g>` + wash(1080, 1340, 50, 50, '#e8443a', 0.3) }
        ],
        overlays: [
          { type: 'funfact', badge: 'THE TV VERDICT', at: dl - 0.25, y: 700, fs: 40, rows: [{ text: 'THE JUDGE FOUND BOTH' }, { text: 'TO BLAME. SHE WAS' }, { text: 'ORDERED TO PAY $2,500' }, { text: 'AP · TV Insider', fs: 26 }] }
        ],
        tag: LIKE
      });
    },

    // 3 - the last sighting: the condo at dusk; the porch light comes on; his silhouette stands in the lit doorway; the empty
    //     twin stroller waits on the step; the door swings shut on 'home'
    pc80_door(ctx) {
      const t = ctx.t, T = ctx.T, mp = WT(ctx, 0, 2, 0.8), tw = WT(ctx, 0, 5, 1.5), hm = WT(ctx, 0, 8, 2.2);
      const shut = ease.inOut(seg(t, hm + 0.2, hm + 1.2));
      return E.cine.shot(ctx, {
        set: 'pc80_condo', setOpts: { porch: seg(t, 0.05, 0.3) }, grade: 'dawn', haze: 0.35,
        cam: { from: { x: -10, y: 20, z: 1.02 }, to: { x: 10, y: 30, z: 1.08 } },
        figures: [
          { id: 'pc80_smith', x: 540, y: 1250, scale: 0.37, dir: 1, turn: 0.2, pose: 'stand', silhouette: 'warm', depth: 1.0,
            keys: [{ at: mp, pose: 'hands_together', headTurn: -0.2, dur: 0.4 }, { at: tw, pose: 'present', headTurn: -0.3, dur: 0.4 }, { at: hm, pose: 'stand', headTurn: 0.3, dur: 0.5 }] }
        ],
        props: [
          // the door panel swinging shut from its left hinge (in front of the figure)
          { depth: 1.005, svg: () => shut > 0.01 ? `<rect x="440" y="860" width="${f1(200 * shut)}" height="390" fill="#5a4030" stroke="${INK}" stroke-width="6"/>` + (shut > 0.9 ? `<circle cx="615" cy="1060" r="8" fill="#c8a868"/>` : '') : '' },
          // the empty twin stroller on the path (no children are shown)
          { depth: 1.02, svg: () => `<g transform="translate(250 1420)"><ellipse cx="0" cy="6" rx="150" ry="14" fill="#000" opacity="0.4"/><path d="M-120 -170 L120 -170 L100 -60 L-100 -60 Z" fill="#3a4450" stroke="${INK}" stroke-width="5"/><path d="M-120 -170 Q-120 -260 -40 -260 L-10 -170 Z M10 -170 L40 -260 Q120 -260 120 -170 Z" fill="#2e3640" stroke="${INK}" stroke-width="5"/><path d="M110 -150 L170 -260" stroke="#2a2e34" stroke-width="10" stroke-linecap="round"/>` + [-90, 90].map(wx => `<circle cx="${wx}" cy="-24" r="30" fill="#1a1c20" stroke="${INK}" stroke-width="4"/>`).join('') + `</g>` }
        ],
        overlays: [
          { type: 'label', at: 0.25, x: 60, y: 560, text: 'NOV 17, 2011 · HIS HOME', fs: 40, sub: 'Police: the last known to see her' }
        ],
        tag: LIKE
      });
    },

    // 4 - the vanishing: the evidence table; the technician sets down the car's tagged key on 'car', then the phone in a wet
    //     evidence bag on 'phone' (the accent glow)
    pc80_evidence(ctx) {
      const t = ctx.t, T = ctx.T, car = WT(ctx, 0, 3, 0.7), l2 = LS(ctx, 1, 2.2), ph = WT(ctx, 1, 1, 2.4);
      const k1 = ease.out(seg(t, car - 0.3, car + 0.2)), k2 = ease.out(seg(t, ph - 0.3, ph + 0.2));
      return E.cine.shot(ctx, {
        set: 'pc80_evidence', grade: 'cold', haze: 0.25, dof: true,
        cam: { from: { x: -10, y: 30, z: 1.03 }, to: { x: 20, y: 40, z: 1.1 } },
        figures: [
          { id: 'pc80_tech', x: 850, y: 1560, scale: 0.74, dir: -1, turn: 0.35, pose: 'stand', expr: 'focused', depth: 0.99,
            keys: [{ at: Math.max(0.1, car - 0.5), pose: 'present', expr: 'focused', dur: 0.4 }, { at: l2 - 0.1, pose: 'examine', expr: 'focused', headTurn: 0.2, dur: 0.5 }] }
        ],
        props: [
          { depth: 1.02, accent: true, svg: tt => {
            let g = `<path d="M-200 1250 L1280 1250 L1280 1300 L-200 1300 Z" fill="#9aa2aa" stroke="${INK}" stroke-width="5"/><rect x="-200" y="1300" width="1480" height="400" fill="#4a5058"/>`;
            // a printed photo of a generic car (no plate) + the key with a manila evidence tag
            if (k1 > 0) g += `<g opacity="${f1(k1)}" transform="translate(${f1(lerp(220, 260, k1))} 1236) scale(1.5)"><path d="M-110 -20 L80 -26 L96 18 L-100 26 Z" fill="#e8e4dc" stroke="${INK}" stroke-width="3"/>` +
              `<g transform="translate(-8 4) scale(0.8 0.5)"><path d="M-80 0 L-70 -30 L-30 -48 L30 -48 L60 -20 L84 -14 L84 10 L-80 10 Z" fill="#4a5a6a"/><circle cx="-46" cy="12" r="12" fill="#1a1a1a"/><circle cx="52" cy="12" r="12" fill="#1a1a1a"/></g>` +
              `<g transform="translate(150 -6)"><circle cx="0" cy="0" r="14" fill="none" stroke="#c8ccd0" stroke-width="5"/><rect x="10" y="-6" width="50" height="12" rx="4" fill="#9aa0a8"/><path d="M-12 -4 L-50 -40" stroke="#a89060" stroke-width="2"/><rect x="-96" y="-66" width="56" height="34" rx="4" fill="#d8b878" stroke="${INK}" stroke-width="2" transform="rotate(-20 -68 -49)"/></g></g>`;
            // the phone in a clear evidence bag, droplets on it, the screen dark (the accent glow)
            if (k2 > 0) g += `<g opacity="${f1(k2)}" transform="translate(620 ${f1(lerp(1170, 1250, k2))}) scale(1.5)">` + wash(0, -10, 180, 60, '#9ac8e8', f1(0.3 * k2)) +
              `<rect x="-110" y="-30" width="220" height="44" rx="6" fill="#dfe8ee" opacity="0.35" stroke="#e8f0f4" stroke-width="3"/><rect x="-110" y="-30" width="220" height="10" fill="#d84a3a" opacity="0.8"/>` +
              `<rect x="-60" y="-22" width="120" height="30" rx="8" fill="#14181c" stroke="#3a4248" stroke-width="3"/>` + [[-80, -6], [70, 0], [30, -24], [-30, 6]].map(([dx, dy]) => `<circle cx="${dx}" cy="${dy}" r="4" fill="#cfe6f4" opacity="0.8"/>`).join('') + `</g>`;
            return g; } }
        ],
        overlays: [
          { type: 'label', at: car - 0.1, x: 60, y: 560, text: 'HER CAR: FOUND ABANDONED', fs: 40, sub: 'The next day (AP)' },
          { type: 'label', at: ph, x: 60, y: 740, text: 'HER PHONE: FROM A LAKE', fs: 40, sub: 'Recovered later, south of Orlando' }
        ],
        tag: TAG
      });
    },

    // 5 - the memorial beat: the lake at dusk; a searcher on the dock sweeps the water with a torch; the memorial card; the
    //     15-YEARS counter
    pc80_lake(ctx) {
      const t = ctx.t, T = ctx.T, nv = WT(ctx, 0, 3, 0.8);
      const aim = 120 + 16 * Math.sin(t * 0.8);
      return E.cine.shot(ctx, {
        set: 'pc80_lake', grade: 'night', haze: 0.4,
        cam: { from: { x: 0, y: 10, z: 1.02 }, to: { x: 20, y: 20, z: 1.07 } },
        figures: [
          { id: 'pc80_searcher', x: 820, y: 1330, scale: 0.46, dir: -1, turn: 0.35, pose: 'torch', expr: 'sad', depth: 1.0, propOpts: { beamLen: 460, aim },
            keys: [{ at: 0.15, pose: 'torch_low', expr: 'sad', headTurn: -0.2, dur: 0.6 }, { at: nv, pose: 'torch', expr: 'sad', headTurn: 0.1, dur: 0.6 }] }
        ],
        props: [
          { depth: 0.98, svg: tt => { const x = 460 + 140 * Math.sin(tt * 0.8); return wash(x, 1120, 200, 40, '#fff0d0', 0.18) + wash(x, 1120, 90, 18, '#fff6e0', 0.2); } }
        ],
        overlays: [
          { type: 'label', at: 0.2, x: 60, y: 520, text: 'REMEMBERING MICHELLE PARKER, 33', fs: 38, sub: 'Missing since Nov 17, 2011' },
          { type: 'counter', at: nv + 0.2, dur: 1.2, from: 0, to: 15, prefix: '', suffix: ' YEARS', label: 'WITHOUT A CHARGE · 2011-2026', y: 770, fs: 110 }
        ],
        tag: TAG
      });
    },

    // 6 - THE BIGGEST REVEAL (music drop): night; the officer walks beside his silhouette (hands behind him) left to right
    //     toward the patrol car, its light bar turning; the CHARGED / PRESUMED INNOCENT label; the charge label
    pc80_arrest(ctx) {
      const t = ctx.t, T = ctx.T, ar = WT(ctx, 0, 2, 0.6), l2 = LS(ctx, 1, 2.4), md = WT(ctx, 1, 3, 3.2);
      return E.cine.shot(ctx, {
        set: 'pc80_street', grade: 'night', haze: 0.35, dof: true,
        cam: { from: { x: -20, y: 20, z: 1.04 }, to: { x: 10, y: 30, z: 1.12 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'pc80_smith', x: 470, y: 1640, scale: 0.6, dir: 1, turn: 0.3, pose: 'hands_behind', silhouette: 'cool', depth: 1.02,
            walk: { at: 0.0, dur: Math.max(1.6, T - 0.6), cadence: 2.8, stride: 12, from: 200, to: 470 }, keys: [{ at: l2, pose: 'hands_behind', headTurn: -0.3, dur: 0.5 }] },
          { id: 'pc80_officer', x: 290, y: 1660, scale: 0.6, dir: 1, turn: 0.3, pose: 'stand', expr: 'stern', depth: 1.03,
            walk: { at: 0.0, dur: Math.max(1.6, T - 0.6), cadence: 2.8, stride: 12, from: 20, to: 290 }, keys: [{ at: ar, pose: 'stand', expr: 'determined', dur: 0.4 }, { at: l2 - 0.15, pose: 'point', expr: 'stern', dur: 0.4 }, { at: md + 0.3, pose: 'stand', expr: 'stern', dur: 0.5 }] }
        ],
        props: [{ depth: 1.0, accent: true, svg: tt => patrolCar(780, 1560, 0.66, tt, seg(tt, l2 - 0.15, l2 + 0.5)) }],
        overlays: [
          { type: 'label', at: ar, x: 60, y: 560, text: 'DALE SMITH JR., 55 · CHARGED', fs: 38, sub: 'Presumed innocent · arrested Oct 14, 2026' },
          { type: 'label', at: l2 - 0.1, x: 60, y: 740, text: 'SECOND-DEGREE MURDER', fs: 40, sub: 'Police say the evidence points to him' }
        ],
        tag: LIKE
      });
    },

    // 7 - what changed: the cold-case office; the detective at two screens: a location trail draws across a generic street
    //     map (the accent), message bars stack on the other screen; an archive box marked 2011
    pc80_forensics(ctx) {
      const t = ctx.t, T = ctx.T, fo = WT(ctx, 0, 3, 0.8), ph = WT(ctx, 0, 6, 1.6), da = WT(ctx, 0, 9, 2.4);
      const trail = seg(t, 0.2, T - 0.4);
      return E.cine.shot(ctx, {
        set: 'pc80_office', grade: 'cold', haze: 0.3,
        cam: { from: { x: -10, y: 30, z: 1.03 }, to: { x: 20, y: 40, z: 1.09 } },
        figures: [
          { id: 'pc80_detective', x: 220, y: 1600, scale: 0.74, dir: 1, turn: 0.35, pose: 'stand', expr: 'focused', depth: 1.0,
            keys: [{ at: 0.1, pose: 'hands_together', expr: 'focused', dur: 0.4 }, { at: fo, pose: 'point', expr: 'focused', dur: 0.4 }, { at: da, pose: 'examine', expr: 'determined', headTurn: 0.2, dur: 0.5 }] }
        ],
        props: [
          { depth: 1.02, accent: true, svg: tt => {
            let g = `<rect x="-200" y="1300" width="1480" height="40" fill="#5a4a3a" stroke="${INK}" stroke-width="5"/><rect x="-200" y="1340" width="1480" height="400" fill="#3a3028"/>`;
            // screen 1: a generic street grid with a location trail (dots) and a pin
            g += `<rect x="470" y="930" width="360" height="250" rx="10" fill="#101820" stroke="#2a2e34" stroke-width="10"/><rect x="630" y="1180" width="40" height="120" fill="#2a2e34"/>`;
            g += `<defs><clipPath id="pc80map"><rect x="480" y="940" width="340" height="230"/></clipPath></defs><g clip-path="url(#pc80map)"><rect x="480" y="940" width="340" height="230" fill="#1a2a36"/>`;
            for (let i = 0; i < 8; i++) g += `<path d="M${480 + i * 50} 940 L${470 + i * 50} 1170" stroke="#2e4250" stroke-width="5"/><path d="M480 ${960 + i * 30} L820 ${950 + i * 30}" stroke="#2e4250" stroke-width="4"/>`;
            g += `<ellipse cx="760" cy="1120" rx="60" ry="34" fill="#22465a"/>`;
            const P = [[510, 960], [560, 990], [600, 1020], [640, 1040], [690, 1070], [730, 1100], [760, 1118]];
            const n = Math.floor(trail * P.length);
            for (let i = 1; i <= n && i < P.length; i++) g += `<line x1="${P[i - 1][0]}" y1="${P[i - 1][1]}" x2="${P[i][0]}" y2="${P[i][1]}" stroke="${ACC}" stroke-width="4" stroke-dasharray="6 5"/>`;
            for (let i = 0; i < Math.min(n + 1, P.length); i++) g += `<circle cx="${P[i][0]}" cy="${P[i][1]}" r="7" fill="${ACC}"/>`;
            g += `</g>` + wash(650, 1050, 220, 160, '#7ab0d8', 0.12);
            // screen 2: message bars stacking (blank, no text) and a phone icon
            g += `<rect x="860" y="960" width="260" height="220" rx="10" fill="#101820" stroke="#2a2e34" stroke-width="10"/><rect x="975" y="1180" width="30" height="120" fill="#2a2e34"/>`;
            const m = Math.floor(seg(tt, ph - 0.2, T - 0.3) * 5);
            for (let i = 0; i < m; i++) g += `<rect x="${i % 2 ? 960 : 880}" y="${1150 - i * 36}" width="${i % 2 ? 140 : 150}" height="26" rx="12" fill="${i % 2 ? '#3a6a8a' : '#4a5260'}"/>`;
            // the archive box marked 2011 (typed on, our own graphic)
            g += `<rect x="900" y="1190" width="190" height="120" fill="#8a7a60" stroke="${INK}" stroke-width="4"/><rect x="890" y="1176" width="210" height="22" fill="#9a8a70" stroke="${INK}" stroke-width="3"/><text x="995" y="1272" text-anchor="middle" ${FONT} font-size="44" fill="#2a2420">2011</text>`;
            return g; } }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.15, fo - 0.3), x: 60, y: 560, text: 'POLICE: NEW DIGITAL FORENSICS', fs: 38, sub: 'Old phone, car and computer data' },
          { type: 'label', at: da, x: 60, y: 740, text: 'MORE DETAILED LOCATION DATA', fs: 36, sub: 'A detective, as reported (NBC, Gray)' }
        ],
        tag: TAG
      });
    },

    // 8 - the defence: a courtroom; his silhouette in the dock; his (generic) lawyer stands at the table; the defence card;
    //     the status label
    pc80_court(ctx) {
      const t = ctx.t, T = ctx.T, pl = WT(ctx, 0, 2, 0.5), ng = WT(ctx, 0, 3, 0.9);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dockX: 780 }, grade: 'cold', haze: 0.3,
        cam: { from: { x: 0, y: 20, z: 1.02 }, to: { x: 20, y: 30, z: 1.07 } },
        figures: [
          { id: 'pc80_smith', x: 780, y: 1210, scale: 0.62, dir: -1, turn: 0.3, pose: 'stand', silhouette: 'cool', depth: 1.0,
            keys: [{ at: pl, pose: 'hands_together', headTurn: -0.2, dur: 0.4 }] },
          { id: 'pc80_lawyer', x: 230, y: 1880, scale: 0.8, dir: 1, turn: 0.35, pose: 'stand', expr: 'neutral', depth: 1.6,
            keys: [{ at: 0.1, pose: 'present', expr: 'determined', dur: 0.4 }, { at: ng + 0.3, pose: 'hands_together', expr: 'neutral', dur: 0.5 }] }
        ],
        props: [],
        overlays: [
          { type: 'card', at: 0.25, x: 40, y: 500, w: 600, rows: [{ text: 'HIS LAWYER SAYS THE', fs: 32 }, { text: 'STATE MAY NOT MEET ITS', fs: 32 }, { text: 'BURDEN, AND POLICE', fs: 32 }, { text: 'FOCUSED TOO NARROWLY', fs: 32 }, { text: 'ON HIM (AP)', fs: 32 }] },
          { type: 'label', at: ng + 0.2, x: 60, y: 1000, text: 'HELD WITHOUT BOND · OCT 2026', fs: 34, sub: 'Detention hearing still to come' }
        ],
        tag: LIKE
      });
    },

    // 9 - the one closing line on the living room in frame 1's framing (the loop): the camera eases back to frame 1's start;
    //     the TV's courtroom glows; the calendar reads OCT 2026
    pc80_end(ctx) {
      const t = ctx.t, T = ctx.T;
      return E.cine.shot(ctx, {
        set: 'pc80_room', grade: 'night', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [],
        props: [hero({ cal: 1 })],
        overlays: [],
        tag: LIKE
      });
    }
  });
})();
