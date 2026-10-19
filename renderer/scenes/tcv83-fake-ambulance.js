/* Case File 83 (premium look, ENGINE V6: promise -> proof -> escalate -> callback): DISGUISE FAILS · 1.
   HEADLINE CASE (0-9 s + the callback): Oct 2014-Jun 2015, a Dutch-run company ran second-hand ambulances, with men in
   paramedic uniforms and a "patient" on crutches, from the Netherlands to Britain with cocaine, heroin and ecstasy behind
   riveted panels. 16 June 2015: the National Crime Agency tracked one from Harwich to a scrapyard in Smethwick (the gotcha):
   193 kg of cocaine, 74 kg of heroin; at least 45 trips in 14 months; Dutch police found about ten more ambulances; jailed
   at Birmingham Crown Court (28, 24 and 18 years in Dec 2015; six more in Jul 2016).
   CASE 2: April 2010, Spain: a truck disguised as a Dakar Rally support vehicle (logos and all) with 814 kg of cocaine in
   32 hidden compartments; it had followed the January race in Argentina and was seized when it was shipped back to Bilbao;
   seven arrested. CASE 3: 13 Dec 2024, the A29 near Numansdorp: a van with two coffins; the driver said they held two
   bodies but had no proper paperwork; at a funeral home the coffins held sports bags of cocaine; four years (Apr 2025).
   Structure: frame 1 = the HERO: a plain white ambulance from behind in a scrapyard at dusk, its back doors swinging open on
   bricks of cocaine and a stretcher, an officer beside it, the camera already pushing in. Then inside the ambulance (a
   riveted panel lifts: the 193 counter); the port at dusk (the rally truck rolls off the ship's ramp, left to right; the
   fun fact); the truck's floor hatch (bricks); the motorway at night (the van, the patrol car's lights, the driver and the
   officer); the funeral home (the lid lifts: bags, the single impact, the music drop); the callback on frame 1's yard
   (the loop: same figures and poses, the doors swing back, the camera eases back to frame 1's start).
   Smoothness: cuts and dissolves, one push (into the motorway), one zoom (the end); one slow camera move per shot; no
   shake, no handheld, one impact. Screen direction: every vehicle faces or moves LEFT TO RIGHT.
   Look: episode.look = 'premium', one cool dusk palette (shadow #121a22, mid #c6bcaa, accent #e8a93a). The accent objects
   are the bricks of cocaine (props marked accent: true); everything else is muted.
   Content rules: the ambulance is a plain white van with AMBULANCE in plain type and a plain blue/amber light bar: no
   cross, star, crest or real service's livery. The rally truck carries plain RALLY lettering and generic stripes, no event
   or sponsor logo. The patrol car is unmarked. No body, remains or mourner is drawn: the coffins are empty but for the
   bags. The convicted men are dark silhouettes tagged NOT A LIKENESS and never named; officers are generic figures.
   New environments (E.registerSets): fa83_yard (a scrapyard at dusk), fa83_inside (the ambulance interior), fa83_dock (a
   port at dusk; view 'wide' or 'close'), fa83_road (a motorway at night), fa83_chapel (a funeral home's back room). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#10141a';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · NOT A LIKENESS';
  const GEN = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#e8a93a';
  const WHITE = '#ece9e2';
  const TXT = `font-family="Arial, Helvetica, sans-serif" font-weight="900"`;

  // ---------- small props
  // a plastic-wrapped brick of cocaine (front face): top-left (x, y), size (w, h); a tape band and a shine
  function brick(x, y, w, h, o = {}) {
    const col = o.col || '#e8dcc0';
    let g = `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(Math.min(6, w * 0.06))}" fill="${col}" stroke="${INK}" stroke-width="${o.sw || 3}"/>`;
    g += `<rect x="${f1(x + w * 0.36)}" y="${f1(y)}" width="${f1(w * 0.26)}" height="${f1(h)}" fill="#b89a5a" opacity="0.8"/>`;
    g += `<rect x="${f1(x + w * 0.06)}" y="${f1(y + h * 0.1)}" width="${f1(w * 0.88)}" height="${f1(h * 0.18)}" fill="#fff" opacity="0.35"/>`;
    return g;
  }
  // a stack of bricks filling (x0..x1, y0..y1), seeded; k 0..1 = how many rows are visible (from the bottom)
  function brickWall(x0, y0, x1, y1, seed, o = {}) {
    const r = R(seed); let g = '', y = y1, k = o.k ?? 1, rows = 0;
    const hb = o.h || 56, wb = o.w || 96;
    const nRows = Math.floor((y1 - y0) / hb), show = Math.round(nRows * k);
    while (y - hb >= y0 && rows < show) {
      let x = x0 + (rows % 2 ? -wb * 0.45 : 0);
      while (x < x1) { const w = Math.min(x1 - x, wb); if (w > 30) g += brick(Math.max(x, x0), y - hb, w - (x < x0 ? x0 - x : 0) - 4, hb - 4, { col: r() > 0.6 ? '#dcd0b4' : '#e8dcc0', sw: o.sw }); x += wb; }
      y -= hb; rows++;
    }
    return g;
  }
  // a sports bag (dark, zip open along the top) with bricks showing; top-left (x, y), width w
  function sportsBag(x, y, w, h, o = {}) {
    let g = `<path d="M${f1(x)} ${f1(y + 16)} Q${f1(x)} ${f1(y)} ${f1(x + 16)} ${f1(y)} L${f1(x + w - 16)} ${f1(y)} Q${f1(x + w)} ${f1(y)} ${f1(x + w)} ${f1(y + 16)} L${f1(x + w)} ${f1(y + h)} L${f1(x)} ${f1(y + h)} Z" fill="#23262c" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M${f1(x + 30)} ${f1(y - 6)} Q${f1(x + w / 2)} ${f1(y - 34)} ${f1(x + w - 30)} ${f1(y - 6)}" fill="none" stroke="#3a3e46" stroke-width="10"/>`;
    g += `<path d="M${f1(x + w * 0.1)} ${f1(y + h * 0.35)} L${f1(x + w * 0.9)} ${f1(y + h * 0.35)}" stroke="#4a5060" stroke-width="3" opacity="0.6"/>`;
    if (o.open) { const k = clamp(o.open, 0, 1); g += `<rect x="${f1(x + 14)}" y="${f1(y + 6)}" width="${f1(w - 28)}" height="${f1(h * 0.45 * k)}" fill="#0c0e12"/>`; g += `<g opacity="${f1(k)}">${brick(x + 24, y + 14, (w - 48) * 0.46, h * 0.3)}${brick(x + 30 + (w - 48) * 0.5, y + 18, (w - 48) * 0.46, h * 0.3)}</g>`; }
    return g;
  }
  // a stretcher (gurney) seen from behind-above inside the ambulance: a frame, a mattress, two wheel legs
  function stretcher(x, y, w, o = {}) {
    let g = `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="22" rx="6" fill="#9aa0a8" stroke="${INK}" stroke-width="3"/>`;
    g += `<rect x="${f1(x + 6)}" y="${f1(y - 30)}" width="${f1(w - 12)}" height="34" rx="8" fill="#c8ccd2" stroke="${INK}" stroke-width="3"/>`;
    [x + 24, x + w - 24].forEach(lx => { g += `<rect x="${f1(lx - 5)}" y="${f1(y + 20)}" width="10" height="56" fill="#7a8088" stroke="${INK}" stroke-width="2"/><circle cx="${f1(lx)}" cy="${f1(y + 82)}" r="12" fill="#2a2e34" stroke="${INK}" stroke-width="3"/>`; });
    if (o.bricks) g += brick(x + 30, y - 68, 90, 40) + brick(x + 130, y - 68, 90, 40) + brick(x + 80, y - 104, 90, 40);
    return g;
  }

  // ---------- THE HERO: the ambulance from behind, back doors swinging open (local origin = ground centre)
  const AMB = { x: 540, y: 1300, s: 0.95 };
  // o.open 0..1 = the doors (hinged at the body's edges) swing out toward us; o.beam = torch wash inside; t for the light bar
  function ambulanceRear(t, o = {}) {
    const k = ease.inOut(clamp(o.open ?? 1, 0, 1));
    let g = `<g transform="translate(${AMB.x} ${AMB.y}) scale(${AMB.s})">`;
    g += `<ellipse cx="0" cy="8" rx="440" ry="30" fill="#000" opacity="0.5"/>`;
    [-300, 300].forEach(wx => { g += `<rect x="${wx - 58}" y="-116" width="116" height="118" rx="16" fill="#0c0d10" stroke="${INK}" stroke-width="5"/>`; });
    // the body: a tall box van, a chamfered roof edge
    g += `<path d="M-390 -120 L-390 -760 Q-390 -800 -350 -800 L350 -800 Q390 -800 390 -760 L390 -120 Q390 -84 354 -84 L-354 -84 Q-390 -84 -390 -120 Z" fill="${WHITE}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    g += `<path d="M-370 -780 L370 -780" stroke="#ffffff" stroke-width="6" opacity="0.7"/>`;
    // the plain yellow band and the word AMBULANCE in plain type across the body above the doors
    g += `<rect x="-390" y="-744" width="780" height="54" fill="#f2d24a" opacity="0.9"/><path d="M-390 -744 L390 -744 M-390 -690 L390 -690" stroke="${INK}" stroke-width="3"/>`;
    g += `<text x="0" y="-700" text-anchor="middle" ${TXT} font-size="42" letter-spacing="6" fill="${INK}">AMBULANCE</text>`;
    // the open rear: dark interior; the riveted walls; bricks stacked on the floor and on the stretcher
    g += `<rect x="-300" y="-680" width="600" height="520" rx="8" fill="#0e1116"/>`;
    g += `<rect x="-300" y="-680" width="600" height="520" rx="8" fill="none" stroke="#3a4048" stroke-width="3"/>`;
    g += `<rect x="-290" y="-668" width="580" height="14" fill="#9aa0a8" opacity="0.8"/>` + wash(0, -420, 320, 260, '#8fb4ff', 0.1);
    for (let i = 0; i < 5; i++) g += `<rect x="-292" y="${-640 + i * 60}" width="22" height="4" fill="#5a6068"/><rect x="270" y="${-640 + i * 60}" width="22" height="4" fill="#5a6068"/>`;
    g += `<g>${brickWall(-280, -420, 290, -170, 8301, { w: 118, h: 62 })}</g>`;
    g += stretcher(-120, -470, 280, { bricks: true });
    if (o.beam) g += wash(40, -380, 300, 240, '#fff2c8', f1(0.28 * o.beam));
    // the doors, hinged at x = +-300: closed = each covers half the opening; open = a narrow slab beyond the body edge
    [-1, 1].forEach(sd => {
      const wi = 300 * (1 - k), wo = 76 * k, hTop = -690 - 24 * k, hBot = -148 + 28 * k;
      const x0 = sd * 300, xi = sd * (300 - wi), xo = sd * (300 + wo);
      g += `<path d="M${f1(x0)} -690 L${f1(xi)} -690 L${f1(xi)} -148 L${f1(x0)} -148 Z" fill="${WHITE}" stroke="${INK}" stroke-width="5"/>`;
      if (wi > 40) { g += `<rect x="${f1(Math.min(x0, xi) + 24)}" y="-660" width="${f1(Math.max(0, wi - 48))}" height="190" rx="8" fill="#1a2230" stroke="${INK}" stroke-width="4"/>`;
        g += `<g transform="translate(${f1((x0 + xi) / 2)} -300) scale(${sc(wi / 300)} 1)"><text x="0" y="0" text-anchor="middle" ${TXT} font-size="40" letter-spacing="4" fill="${INK}" opacity="0.9">${sd < 0 ? 'AMBU' : 'LANCE'}</text></g>`; }
      if (wo > 2) g += `<path d="M${f1(x0)} -690 L${f1(xo)} ${f1(hTop)} L${f1(xo)} ${f1(hBot)} L${f1(x0)} -148 Z" fill="#d8d4cc" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    });
    // the bumper, rear lights, the BLANK plate, the light bar (blue / amber, no cross)
    g += `<rect x="-410" y="-140" width="820" height="60" rx="14" fill="#2a3038" stroke="${INK}" stroke-width="6"/>`;
    [-1, 1].forEach(sd => { g += `<rect x="${sd > 0 ? 330 : -380}" y="-220" width="50" height="60" rx="8" fill="#9a2a24" stroke="${INK}" stroke-width="4"/>` + wash(sd * 355, -190, 60, 50, '#ff5a4a', 0.2); });
    g += `<rect x="-84" y="-136" width="168" height="50" rx="6" fill="#e4e2da" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2, 3, 4, 5].map(i => `<circle cx="${-56 + i * 22}" cy="-111" r="5" fill="#2a3a5a"/>`).join('');
    const ph = (t * 1.8) % 1, a = ph < 0.5 ? 1 : 0.3, b = ph < 0.5 ? 0.3 : 1;
    g += `<rect x="-230" y="-840" width="460" height="40" rx="10" fill="#3a3e44" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-214" y="-832" width="130" height="24" rx="6" fill="#4a7ae0" opacity="${f1(0.35 + 0.65 * a)}"/><rect x="-62" y="-832" width="124" height="24" rx="6" fill="#f0b040" opacity="0.8"/><rect x="84" y="-832" width="130" height="24" rx="6" fill="#4a7ae0" opacity="${f1(0.35 + 0.65 * b)}"/>`;
    g += wash(-150, -820, 200, 110, '#6a8aff', f1(0.22 * a)) + wash(150, -820, 200, 110, '#6a8aff', f1(0.22 * b));
    return g + '</g>';
  }
  const hero = (o = {}) => ({ depth: 1.0, accent: true, svg: tt => ambulanceRear(tt, { open: o.open ? o.open(tt) : 1, beam: o.beam ? o.beam(tt) : 0 }) });
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 10, y: 24, z: 1.1 };

  // ---------- the rally truck (side view, facing right): a cab-over truck with a tall box body, generic stripes, plain
  // RALLY lettering, a number roundel, spare wheels on the roof, a light bar; o.spin wheel angle; o.hatch 0..1 = a floor
  // hatch on the body side drops open with bricks behind it; local ground y 0, body x -420..420
  function rallyTruck(x, y, s, o = {}) {
    const sp = o.spin || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="6" rx="440" ry="24" fill="#000" opacity="0.4"/>`;
    if (o.glow) g += wash(0, -220, 480, 260, ACC, f1(0.12 * o.glow));
    // the box body (left) and the cab (right)
    g += `<path d="M-420 -70 L-420 -470 Q-420 -490 -400 -490 L120 -490 L120 -70 Z" fill="${WHITE}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M140 -70 L140 -460 Q140 -480 160 -480 L330 -480 Q360 -480 380 -450 L420 -330 Q430 -300 430 -260 L430 -70 Z" fill="${WHITE}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M330 -470 L372 -440 L410 -330 L330 -330 Z" fill="#26323e" stroke="${INK}" stroke-width="4"/><rect x="180" y="-460" width="130" height="130" rx="8" fill="#26323e" stroke="${INK}" stroke-width="4"/>`;
    // generic stripes (no logo), RALLY in plain type, a number roundel
    g += `<path d="M-420 -300 L120 -330 L120 -290 L-420 -260 Z" fill="#c8402e" opacity="0.9"/><path d="M-420 -250 L120 -280 L120 -262 L-420 -232 Z" fill="#2f6fb0" opacity="0.9"/>`;
    g += `<text x="-150" y="-370" text-anchor="middle" ${TXT} font-size="64" letter-spacing="10" fill="${INK}" opacity="0.85">RALLY</text>`;
    g += `<circle cx="-330" cy="-160" r="54" fill="#f2f0ea" stroke="${INK}" stroke-width="5"/><text x="-330" y="-142" text-anchor="middle" ${TXT} font-size="52" fill="${INK}">7</text>`;
    g += `<text x="-100" y="-130" text-anchor="middle" ${TXT} font-size="30" letter-spacing="4" fill="#5a6068">SUPPORT</text>`;
    // the floor hatch on the body side: a flap drops open (o.hatch) on bricks
    if (o.hatch) { const k = ease.inOut(clamp(o.hatch, 0, 1));
      g += `<rect x="-60" y="-210" width="160" height="120" fill="#0e1116" stroke="${INK}" stroke-width="4"/>`;
      g += `<g opacity="${f1(k)}">${brick(-50, -196, 66, 44)}${brick(24, -196, 66, 44)}${brick(-50, -146, 66, 44)}${brick(24, -146, 66, 44)}</g>`;
      g += `<g transform="translate(-60 -90) rotate(${f1(-90 * (1 - k) + 0 * k)})"><rect x="0" y="0" width="160" height="120" fill="#d8d4cc" stroke="${INK}" stroke-width="4"/></g>`; }
    // roof: spare wheels and a light bar; the bumper, lights
    g += `<rect x="-380" y="-540" width="440" height="50" rx="10" fill="#3a3e44" stroke="${INK}" stroke-width="4"/>` + [-300, -180, -60].map(wx => `<circle cx="${wx}" cy="-520" r="40" fill="#141516" stroke="${INK}" stroke-width="4"/><circle cx="${wx}" cy="-520" r="16" fill="#5a5e62"/>`).join('');
    g += `<rect x="150" y="-520" width="240" height="22" rx="6" fill="#3a3e44" stroke="${INK}" stroke-width="3"/>` + [0, 1, 2, 3].map(i => `<circle cx="${180 + i * 60}" cy="-509" r="9" fill="#f4e6b0"/>`).join('');
    g += `<path d="M-420 -70 L430 -70" stroke="#3a3c40" stroke-width="14"/><rect x="424" y="-240" width="20" height="40" rx="4" fill="#f4e6b0"/><rect x="-436" y="-240" width="18" height="40" rx="4" fill="#b8392b"/>`;
    [-300, -120, 300].forEach(wx => { g += `<path d="M${wx - 80} -70 A80 80 0 0 1 ${wx + 80} -70 Z" fill="#141518"/><g transform="translate(${wx} -70) rotate(${f1(sp * 57)})"><circle r="74" fill="#141516" stroke="${INK}" stroke-width="5"/><circle r="30" fill="#8e9498" stroke="${INK}" stroke-width="4"/><path d="M-24 0 L24 0 M0 -24 L0 24" stroke="#4a4e52" stroke-width="6"/></g>`; });
    return g + '</g>';
  }
  // a plain white panel van (side view, facing right; no lettering), its rear doors closed; o.spin; blank plate
  function panelVan(x, y, s, o = {}) {
    const sp = o.spin || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="380" ry="22" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-360 -60 L-360 -400 Q-360 -420 -340 -420 L170 -420 Q210 -420 230 -390 L310 -250 L360 -230 Q380 -224 380 -200 L380 -60 Z" fill="${WHITE}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M186 -404 L250 -256 L186 -256 Z" fill="#26323e" stroke="${INK}" stroke-width="4"/><rect x="60" y="-400" width="110" height="140" fill="#26323e" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M40 -410 L40 -70" stroke="#b8b6ae" stroke-width="4"/><path d="M-360 -200 L380 -200" stroke="#c8c6be" stroke-width="5"/>`;
    g += `<rect x="360" y="-190" width="22" height="30" rx="5" fill="#f4e6b0"/><rect x="-374" y="-200" width="16" height="44" rx="3" fill="#b8392b"/>`;
    g += `<rect x="-330" y="-120" width="110" height="36" rx="5" fill="#e4e2da" stroke="${INK}" stroke-width="3"/>`;
    [-230, 240].forEach(wx => { g += `<path d="M${wx - 64} -60 A64 64 0 0 1 ${wx + 64} -60 Z" fill="#141518"/><g transform="translate(${wx} -54) rotate(${f1(sp * 57)})"><circle r="52" fill="#141516" stroke="${INK}" stroke-width="5"/><circle r="22" fill="#8e9498" stroke="${INK}" stroke-width="4"/><path d="M-18 0 L18 0 M0 -18 L0 18" stroke="#4a4e52" stroke-width="5"/></g>`; });
    return g + '</g>';
  }
  // an unmarked patrol car (facing right), its roof bar alternating blue; on 0..1
  function patrol(x, y, s, t, on = 1) {
    const ph = (t * 1.6) % 1, a = ph < 0.5 ? 1 : 0.25, b = ph < 0.5 ? 0.25 : 1;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="340" ry="22" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-320 -60 L-310 -130 Q-300 -150 -260 -156 L-170 -164 L-90 -236 Q-70 -250 -30 -250 L120 -250 Q160 -250 190 -224 L260 -164 L310 -150 Q340 -140 340 -110 L340 -60 Z" fill="#2a2e36" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-150 -168 L-80 -230 L30 -230 L30 -168 Z M50 -168 L50 -230 L120 -230 Q150 -230 170 -212 L222 -168 Z" fill="#7a94a8" opacity="0.6" stroke="${INK}" stroke-width="4"/><path d="M-300 -110 L330 -110" stroke="#c8ccd0" stroke-width="10" opacity="0.4"/>`;
    g += `<rect x="-60" y="-272" width="56" height="20" rx="6" fill="#4a6ad0" opacity="${f1(on * (0.4 + 0.6 * a))}"/><rect x="0" y="-272" width="56" height="20" rx="6" fill="#4a6ad0" opacity="${f1(on * (0.4 + 0.6 * b))}"/>`;
    if (on > 0) g += wash(-32, -262, 260, 140, '#6a8aff', f1(0.24 * a * on)) + wash(28, -262, 260, 140, '#6a8aff', f1(0.24 * b * on));
    g += `<rect x="300" y="-136" width="40" height="18" rx="5" fill="#f4e6b0"/>` + [-190, 200].map(wx => `<circle cx="${wx}" cy="-46" r="54" fill="#141516" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-46" r="24" fill="#8a9096"/>`).join('') + '</g>';
    return g;
  }
  // a wooden coffin on two trestles (side-on, slightly from above); o.lid 0..1 = the lid lifts up and back; inside: two
  // sports bags (o.bags 0..1 = unzipped); local origin = the coffin's bottom-left, width w
  function coffin(x, y, w, o = {}) {
    const lid = ease.inOut(clamp(o.lid ?? 0, 0, 1)), h = 150;
    let g = `<g transform="translate(${f1(x)} ${f1(y)})">`;
    [w * 0.22, w * 0.78].forEach(tx => { g += `<path d="M${f1(tx - 60)} 120 L${f1(tx)} 0 L${f1(tx + 60)} 120" fill="none" stroke="#5a4634" stroke-width="12"/><path d="M${f1(tx - 40)} 80 L${f1(tx + 40)} 80" stroke="#5a4634" stroke-width="8"/>`; });
    g += `<path d="M0 0 L${f1(w)} 0 L${f1(w - 20)} ${-h} L20 ${-h} Z" fill="#5c3a24" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M30 ${-h + 14} L${f1(w - 30)} ${-h + 14}" stroke="#8a6040" stroke-width="4" opacity="0.6"/><path d="M0 -20 L${f1(w)} -20" stroke="#3a2416" stroke-width="4" opacity="0.6"/>`;
    [w * 0.15, w * 0.85].forEach(hx => { g += `<rect x="${f1(hx - 34)}" y="-90" width="68" height="14" rx="6" fill="#c8a860" stroke="${INK}" stroke-width="3"/>`; });
    // the interior seen through the open top: lining, two bags
    if (lid > 0.05) {
      g += `<path d="M20 ${-h} L${f1(w - 20)} ${-h} L${f1(w - 34)} ${-h - 70} L34 ${-h - 70} Z" fill="#1a1416" stroke="${INK}" stroke-width="3"/>`;
      g += `<path d="M26 ${-h - 6} L${f1(w - 26)} ${-h - 6} L${f1(w - 36)} ${-h - 62} L36 ${-h - 62} Z" fill="none" stroke="#8a7050" stroke-width="3" opacity="0.5"/>`;
      g += `<g opacity="${f1(lid)}">${sportsBag(w * 0.12, -h - 58, w * 0.34, 54, { open: o.bags })}${sportsBag(w * 0.54, -h - 56, w * 0.34, 52, { open: o.bags })}</g>`;
    }
    // the lid: hinged along the far edge, it lifts (rotates back) and recedes
    const lift = lerp(0, -150, lid), sq = lerp(1, 0.22, lid);
    g += `<g transform="translate(0 ${f1(-h + lift)}) scale(1 ${sc(sq)})"><path d="M20 0 L${f1(w - 20)} 0 L${f1(w - 32)} -64 L32 -64 Z" fill="#6a4630" stroke="${INK}" stroke-width="5"/><path d="M60 -40 L${f1(w - 60)} -40" stroke="#9a7050" stroke-width="4" opacity="0.5"/></g>`;
    return g + '</g>';
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a scrapyard at dusk: a dark violet-grey sky with a sodium glow, stacks of crushed cars either side, a crane with a
    // claw top-right, a chain-link fence far back, gravel with puddles
    fa83_yard(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="fa83sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0f1a"/><stop offset="1" stop-color="#2a2434"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#fa83sky)"/>` + E.cine.stars(t, 24, 8311, -200, 420) + wash(540, 980, 900, 300, '#ff9a40', 0.1);
      let far = `<rect x="-400" y="900" width="${W + 800}" height="220" fill="#1c1a22"/>`;
      for (let x = -400; x < W + 400; x += 34) far += `<path d="M${x} 900 L${x + 17} 1120 M${x + 17} 900 L${x} 1120" stroke="#3a3842" stroke-width="2" opacity="0.6"/>`;
      far += `<rect x="-400" y="896" width="${W + 800}" height="8" fill="#4a4852"/>`;
      // crushed-car stacks: flattened slabs in muted colours
      const slab = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${c}" stroke="${INK}" stroke-width="4"/><path d="M${x + 10} ${y + h * 0.5} L${x + w - 10} ${y + h * 0.5}" stroke="#000" stroke-width="3" opacity="0.3"/>`;
      let stacks = ''; const cols = ['#4a3c44', '#3c4a52', '#5a4a3a', '#44504a', '#4e4452'];
      const r = R(8312);
      for (let s = 0; s < 6; s++) { const x = -360 + s * 120 - 300, y = 1120 - (s + 3) * 0; let yy = 1120; for (let i = 0; i < 5 + Math.floor(r() * 3); i++) { const h = 60 + r() * 30; yy -= h; stacks += slab(x + r() * 10, yy, 260, h, cols[Math.floor(r() * 5)]); } }
      for (let s = 0; s < 4; s++) { const x = 900 + s * 150; let yy = 1120; for (let i = 0; i < 6 + Math.floor(r() * 3); i++) { const h = 60 + r() * 30; yy -= h; stacks += slab(x + r() * 10, yy, 280, h, cols[Math.floor(r() * 5)]); } }
      let crane = `<path d="M900 1120 L900 300" stroke="#2a2e34" stroke-width="22"/><path d="M900 320 L560 420" stroke="#2a2e34" stroke-width="18"/><path d="M900 300 L560 420 M900 560 L720 420" stroke="#2a2e34" stroke-width="8"/>`;
      crane += `<path d="M640 400 L640 520" stroke="#3a3e44" stroke-width="5"/><path d="M600 520 Q640 600 680 520 M612 528 L600 580 M668 528 L680 580 M640 520 L640 590" fill="none" stroke="#3a3e44" stroke-width="12" stroke-linecap="round"/>`;
      let lamp = `<rect x="-20" y="480" width="18" height="640" fill="#2a2e34"/><path d="M-10 480 L80 470" stroke="#2a2e34" stroke-width="10"/><ellipse cx="90" cy="476" rx="36" ry="12" fill="#ffc870"/>` + wash(90, 700, 320, 460, '#ffb050', 0.14);
      let ground = `<rect x="-400" y="1120" width="${W + 800}" height="${H}" fill="#2a2a2c"/>`;
      const rg = R(8313); for (let i = 0; i < 90; i++) { const x = -380 + rg() * 1840, y = 1140 + rg() * 760; ground += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(10 + rg() * 30)}" ry="${f1(4 + rg() * 8)}" fill="#3a3a3c"/>`; }
      ground += `<ellipse cx="300" cy="1560" rx="220" ry="40" fill="#1a1e2a" opacity="0.8"/>` + wash(300, 1560, 220, 40, '#6a8aff', 0.08) + wash(540, 1500, 700, 260, '#ffb050', 0.06);
      return { light: { dir: -1, rim: '#ffd090', key: '#d8dce8' }, layers: [[0.05, sky], [0.25, far], [0.5, stacks + crane + lamp], [0.85, ground]] };
    },

    // the ambulance interior, close: pale-grey riveted walls, a strip light, a grab rail, a bench; the panel is drawn
    // in the shot
    fa83_inside(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#b8bcc2"/><rect x="-400" y="-300" width="${W + 800}" height="700" fill="#c8ccd2"/>`;
      wall += `<rect x="60" y="300" width="960" height="26" rx="10" fill="#f4f6f8" opacity="0.9"/>` + wash(540, 330, 900, 160, '#e8f0ff', 0.14);
      for (let x = -300; x < W + 300; x += 120) wall += `<path d="M${x} 400 L${x} 1240" stroke="#9aa0a8" stroke-width="3"/>`;
      for (let y = 460; y < 1240; y += 120) for (let x = -240; x < W + 300; x += 120) wall += `<circle cx="${x}" cy="${y}" r="5" fill="#7a8088"/>`;
      wall += `<rect x="-400" y="640" width="${W + 800}" height="26" rx="12" fill="#e8c84a" stroke="${INK}" stroke-width="3"/>`;
      let bench = `<rect x="-400" y="1100" width="${W + 800}" height="160" rx="12" fill="#2a3a5a" stroke="${INK}" stroke-width="5"/><rect x="-400" y="1100" width="${W + 800}" height="30" fill="#3a4a6a"/>`;
      let floor = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#4a4e54"/>` + wash(540, 1300, 800, 80, '#ffffff', 0.08);
      for (let i = 0; i < 6; i++) floor += `<path d="M-400 ${1300 + i * 110} L${W + 400} ${1300 + i * 110}" stroke="#3e4248" stroke-width="3"/>`;
      return { light: { dir: 1, rim: '#e8f0ff', key: '#eef0f2' }, layers: [[0.25, wall], [0.55, bench], [0.85, floor]] };
    },

    // a port at dusk (generic): an orange-violet sky, container cranes far back, a ro-ro ship's stern and lowered ramp
    // on the left, dark water glinting, a wide concrete quay; o.view 'close' tightens on the quay (no ship, more quay)
    fa83_dock(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), close = o.view === 'close';
      let sky = `<defs><linearGradient id="fa83dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1a30"/><stop offset="0.6" stop-color="#6a3a40"/><stop offset="1" stop-color="#d88a50"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1300" fill="url(#fa83dusk)"/>`;
      let cranes = ''; [-200, 300, 800, 1300].forEach((x, i) => { cranes += `<path d="M${x} 1000 L${x} ${520 + i * 20} L${x + 260} ${520 + i * 20} M${x + 40} 1000 L${x + 40} ${520 + i * 20} M${x} ${640 + i * 20} L${x + 200} ${520 + i * 20}" fill="none" stroke="#2a2434" stroke-width="12"/>`; });
      cranes += `<rect x="-400" y="990" width="${W + 800}" height="40" fill="#2a2434"/>`;
      let ship = '';
      if (!close) {
        ship = `<path d="M-400 1020 L-400 560 L120 560 Q180 560 200 620 L240 1020 Z" fill="#2a3444" stroke="${INK}" stroke-width="6"/><rect x="-400" y="560" width="620" height="60" fill="#3a4a5c"/>`;
        for (let i = 0; i < 4; i++) ship += `<rect x="${-300 + i * 110}" y="680" width="70" height="50" rx="6" fill="#e8d8b0" opacity="0.7"/>`;
        ship += `<rect x="-400" y="430" width="300" height="130" fill="#d8d4cc" stroke="${INK}" stroke-width="5"/><rect x="-360" y="460" width="220" height="40" fill="#26323e"/>`;
        // the stern ramp lowered to the quay (the truck drives down it, left to right)
        ship += `<path d="M160 760 L560 1100 L560 1130 L140 790 Z" fill="#4a505a" stroke="${INK}" stroke-width="5"/><path d="M160 760 L560 1100" stroke="#8a9098" stroke-width="4"/>`;
        ship += `<rect x="40" y="740" width="150" height="300" fill="#0e1116"/>` + wash(115, 880, 120, 160, '#ffd090', 0.18);
      }
      let water = `<rect x="-400" y="1030" width="${W + 800}" height="90" fill="#1a1e30"/>`; const r = R(8321);
      for (let i = 0; i < 40; i++) { const x = -380 + r() * 1840, y = 1036 + r() * 80; water += `<path d="M${f1(x)} ${f1(y)} l${f1(20 + r() * 40)} 0" stroke="#e0a060" stroke-width="2" opacity="${f1(0.3 + 0.4 * Math.abs(Math.sin(t * 1.3 + i)))}"/>`; }
      let quay = `<rect x="-400" y="1120" width="${W + 800}" height="${H}" fill="#6a6660"/><rect x="-400" y="1116" width="${W + 800}" height="18" fill="#8a8680" stroke="${INK}" stroke-width="3"/>`;
      for (let i = 0; i < 8; i++) quay += `<path d="M-400 ${1180 + i * 100} L${W + 400} ${1180 + i * 100}" stroke="#5a5650" stroke-width="3"/>`;
      quay += `<path d="M-400 1400 L${W + 400} 1400" stroke="#e8c84a" stroke-width="10" opacity="0.5"/>` + wash(540, 1500, 700, 260, '#ffb050', 0.08);
      return { light: { dir: -1, rim: '#ffc890', key: '#e8d8d0' }, layers: close ? [[0.05, sky], [0.3, cranes], [0.55, water], [0.85, quay]] : [[0.05, sky], [0.25, cranes], [0.5, ship + water], [0.85, quay]] };
    },

    // a motorway at night: a black sky, flat dark fields, a crash barrier, lane markings, the hard shoulder, reflective
    // posts; the vehicles are props
    fa83_road(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<rect x="-400" y="-300" width="${W + 800}" height="1500" fill="#07090f"/>` + E.cine.stars(t, 40, 8331, -200, 600);
      let fields = `<rect x="-400" y="900" width="${W + 800}" height="240" fill="#0e1410"/>`; const r = R(8332);
      for (let i = 0; i < 10; i++) { const x = -360 + i * 200 + r() * 60; fields += `<ellipse cx="${f1(x)}" cy="${f1(900)}" rx="${f1(90 + r() * 60)}" ry="${f1(40 + r() * 50)}" fill="#0a0e0c"/>`; }
      let barrier = `<rect x="-400" y="1080" width="${W + 800}" height="30" rx="6" fill="#8a8e94" stroke="${INK}" stroke-width="3"/>`;
      for (let x = -400; x < W + 400; x += 140) barrier += `<rect x="${x}" y="1100" width="16" height="50" fill="#5a5e64"/>`;
      let road = `<rect x="-400" y="1140" width="${W + 800}" height="${H}" fill="#1e2024"/><path d="M-400 1150 L${W + 400} 1150" stroke="#e8e4d8" stroke-width="6" opacity="0.7"/>`;
      road += `<path d="M-400 1330 L${W + 400} 1330" stroke="#e8e4d8" stroke-width="6" stroke-dasharray="90 60" opacity="0.6"/><path d="M-400 1600 L${W + 400} 1600" stroke="#e8e4d8" stroke-width="7" opacity="0.7"/>`;
      road += wash(600, 1400, 700, 240, '#6a8aff', 0.08) + wash(540, 1700, 600, 200, '#ffb050', 0.05);
      return { light: { dir: 1, rim: '#8ab0ff', key: '#c8d4e8' }, layers: [[0.05, sky], [0.3, fields], [0.5, barrier], [0.85, road]] };
    },

    // a funeral home's back room (generic): muted plaster walls, a curtained alcove, a wall lamp, a tiled floor; the coffin
    // on trestles is a prop
    fa83_chapel(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#6a625a"/><rect x="-400" y="-300" width="${W + 800}" height="560" fill="#5a524a"/>`;
      wall += `<rect x="620" y="300" width="520" height="900" fill="#3a2e34"/>`; for (let i = 0; i < 9; i++) wall += `<path d="M${640 + i * 58} 300 Q${650 + i * 58} 750 ${640 + i * 58} 1200" fill="none" stroke="#4a3a42" stroke-width="12"/>`;
      wall += `<path d="M160 520 L220 440 L280 520 Z" fill="#e8d8b8" stroke="${INK}" stroke-width="4"/><rect x="214" y="520" width="12" height="40" fill="#3a3430"/>` + wash(220, 560, 420, 380, '#ffe0a8', 0.16);
      wall += `<rect x="-400" y="1180" width="${W + 800}" height="60" fill="#4a423a" stroke="${INK}" stroke-width="3"/>`;
      let floor = `<rect x="-400" y="1240" width="${W + 800}" height="${H}" fill="#8a8078"/>`;
      for (let i = 0; i < 8; i++) floor += `<path d="M-400 ${1270 + i * 90} L${W + 400} ${1270 + i * 90}" stroke="#6a6058" stroke-width="3"/>`;
      for (let x = -300; x < W + 400; x += 180) floor += `<path d="M${x} 1240 L${x - 200} ${H + 100}" stroke="#6a6058" stroke-width="3"/>`;
      return { light: { dir: -1, rim: '#fff0d0', key: '#f0e4d0' }, layers: [[0.2, wall], [0.85, floor]] };
    }
  });

  E.registerScenes({
    // 1 - hook (frame 1): the scrapyard at dusk; the ambulance from behind, its doors swinging open on the bricks and the
    //     stretcher from 0.0 s; the officer (right) swings his torch into it; the medic silhouette (left) stands with his
    //     hands behind him; the camera already pushing in; the 45-trips label on line 2
    fa83_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.3), tr = WT(ctx, 1, 2, 3.4);
      return E.cine.shot(ctx, {
        set: 'fa83_yard', grade: 'night', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [
          { id: 'fa83_officer', x: 930, y: 1500, scale: 0.6, dir: -1, turn: 0.4, pose: 'torch', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#1a2230' }, propOpts: { beamLen: 420, aim: 150 },
            keys: [{ at: 0.9, pose: 'torch', expr: 'shocked', headTurn: -0.2, dur: 0.4 }, { at: l2 + 0.1, pose: 'point', expr: 'stern', dur: 0.4 }, { at: tr + 0.1, pose: 'torch', expr: 'focused', dur: 0.4 }] },
          { id: 'fa83_medic', x: 190, y: 1500, scale: 0.58, dir: 1, turn: 0.4, pose: 'hands_behind', silhouette: 'cool', depth: 1.02,
            keys: [{ at: l2 + 0.2, pose: 'hands_behind', headTurn: 0.5, dur: 0.4 }, { at: tr + 0.3, pose: 'bowed', dur: 0.4 }] }
        ],
        props: [hero({ open: tt => 0.45 + 0.55 * seg(tt, 0.0, 0.85), beam: tt => seg(tt, 0.3, 0.9) })],
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.25), x: 60, y: 600, text: 'NETHERLANDS TO BRITAIN · 2014-15', fs: 38, sub: 'Fake medics · at least 45 trips in 14 months (NCA)' }
        ],
        tag: TAG
      });
    },

    // 2 - THE GOTCHA (reveal) + the 193 counter: inside the ambulance; the officer's gloved hand pries a riveted wall panel
    //     up at the line start: bricks behind it; the panel lifts further on line 2 and the stack fills; the scrapyard label
    fa83_inside(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.3), sy = WT(ctx, 0, 5, 2.0), l2 = LS(ctx, 1, 2.8), n = WT(ctx, 1, 1, 3.2);
      const lift = ease.inOut(seg(t, l1, l1 + 0.8)) * 0.55 + ease.inOut(seg(t, l2, l2 + 0.7)) * 0.45;
      const PX = 300, PY = 700, PW = 480, PH = 400;
      return E.cine.shot(ctx, {
        set: 'fa83_inside', grade: 'cold', haze: 0.2, dof: true,
        cam: { from: { x: 0, y: 20, z: 1.04 }, to: { x: 0, y: 30, z: 1.12 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'fa83_officer', x: 1000, y: 2160, scale: 1.2, dir: -1, turn: 0.45, pose: 'examine', expr: 'focused', depth: 1.05, hat: { style: 'cap', color: '#1a2230' },
            keys: [{ at: sy, pose: 'point', expr: 'realise', dur: 0.4 }, { at: n, pose: 'hand_to_face', expr: 'shocked', dur: 0.4 }] }
        ],
        props: [{ depth: 1.0, accent: true, svg: tt => {
          let g = `<rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" fill="#0e1116" stroke="${INK}" stroke-width="4"/>`;
          g += `<g>${brickWall(PX + 10, PY + 10, PX + PW - 10, PY + PH - 10, 8341, { w: 120, h: 66, k: 0.3 + 0.7 * seg(tt, l2, l2 + 1.0) })}</g>`;
          const ly = PY - lift * 330, sq = 1 - 0.4 * lift;
          g += `<g transform="translate(${PX} ${f1(ly)}) scale(1 ${sc(sq)})"><rect x="0" y="0" width="${PW}" height="${PH}" fill="#b8bcc2" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3].map(i => `<circle cx="${20 + i * (PW - 40) / 3}" cy="20" r="6" fill="#7a8088"/><circle cx="${20 + i * (PW - 40) / 3}" cy="${PH - 20}" r="6" fill="#7a8088"/>`).join('') + `</g>`;
          g += wash(PX + PW / 2, PY + PH / 2, 320, 260, '#fff2c8', f1(0.2 * lift));
          return g; } }],
        overlays: [
          { type: 'label', at: 0.25, x: 60, y: 520, text: 'TRACKED FROM HARWICH TO A SCRAPYARD', fs: 36, sub: 'Smethwick, 16 June 2015 · four arrested' },
          { type: 'counter', at: n - 0.1, dur: 1.1, from: 0, to: 193, prefix: '', suffix: ' KG', label: 'COCAINE IN ONE AMBULANCE · NCA', y: 1200, fs: 120 }
        ],
        tag: GEN
      });
    },

    // 3 - the rehook + CASE 2: the port at dusk; the rally truck rolls down the ship's ramp left to right and stops on the
    //     quay; the racer silhouette climbs down; the agent waits right; the Bilbao label
    fa83_dock(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 1.9), tk = WT(ctx, 1, 4, 3.0);
      const drive = ease.out(seg(t, 0.0, Math.max(1.2, tk - 0.2)));
      const tx = lerp(-80, 560, drive);
      return E.cine.shot(ctx, {
        set: 'fa83_dock', setOpts: { view: 'wide' }, grade: 'warm', haze: 0.35,
        cam: { from: { x: -20, y: 10, z: 1.02 }, to: { x: 10, y: 20, z: 1.08 } },
        figures: [
          { id: 'fa83_agent', x: 960, y: 1560, scale: 0.56, dir: -1, turn: 0.35, pose: 'arms_crossed', expr: 'stern', depth: 1.03, hat: { style: 'cap', color: '#1c2432' },
            keys: [{ at: l2, pose: 'point', expr: 'stern', dur: 0.4 }, { at: tk + 0.2, pose: 'stand', expr: 'determined', dur: 0.4 }] },
          { id: 'fa83_racer', x: 420, y: 1620, scale: 0.5, dir: 1, turn: 0.35, pose: 'stand_tense', silhouette: 'warm', depth: 1.04,
            keys: [{ at: tk + 0.1, pose: 'hand_to_face', dur: 0.4 }] }
        ],
        props: [{ depth: 1.0, accent: true, svg: tt => rallyTruck(tx, 1330, 0.62, { spin: drive * 9, glow: 0.4 }) }],
        overlays: [
          { type: 'label', at: 0.25, x: 60, y: 520, text: 'BILBAO, SPAIN · APRIL 2010', fs: 38, sub: 'Dressed as a Dakar Rally support truck' },
          { type: 'label', at: tk + 0.1, x: 60, y: 1180, text: '7 ARRESTED · BOUND FOR IBIZA', fs: 34 }
        ],
        tag: TAG
      });
    },

    // 4 - CASE 2's gotcha (reveal) + the FUN FACT: close on the truck on the quay; on the line start the floor hatch drops
    //     open on bricks; the agent kneels with a torch; the 814 label on line 2; the Dakar fun fact
    fa83_hatch(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.3), ap = WT(ctx, 0, 7, 2.6), l2 = LS(ctx, 1, 3.0), hid = WT(ctx, 1, 0, 3.2);
      return E.cine.shot(ctx, {
        set: 'fa83_dock', setOpts: { view: 'close' }, grade: 'warm', haze: 0.3, dof: true,
        cam: { from: { x: 10, y: 20, z: 1.08 }, to: { x: 30, y: 30, z: 1.16 } },
        figures: [
          { id: 'fa83_agent', x: 300, y: 1620, scale: 0.6, dir: 1, turn: 0.4, pose: 'torch_low', expr: 'focused', depth: 1.04, hat: { style: 'cap', color: '#1c2432' }, propOpts: { beamLen: 380, aim: 60 },
            keys: [{ at: l1 + 0.1, pose: 'kneel', expr: 'focused', dur: 0.45 }, { at: ap, pose: 'kneel', expr: 'realise', headTurn: 0.3, dur: 0.35 }, { at: l2 + 0.1, pose: 'point', expr: 'stern', dur: 0.4 }] },
          { id: 'fa83_racer', x: 880, y: 1600, scale: 0.56, dir: -1, turn: 0.35, pose: 'hands_behind', silhouette: 'warm', depth: 1.03,
            keys: [{ at: ap + 0.2, pose: 'bowed', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => rallyTruck(600, 1330, 0.78, { hatch: seg(tt, l1, l1 + 0.8), glow: 0.5 }) },
          { depth: 1.02, accent: true, svg: tt => { const k = seg(tt, l2, l2 + 1.0); return k <= 0 ? '' : `<g opacity="${f1(k)}">${brickWall(380, 1240, 760, 1330, 8351, { w: 110, h: 46, k })}</g>`; } }
        ],
        overlays: [
          { type: 'callout', at: l1 + 0.6, target: [640, 1210], label: [90, 690], text: 'HIDDEN FLOOR', w: 380, r: 60 },
          { type: 'label', at: l2 + 0.1, x: 60, y: 520, text: '814 KG · 32 HIDDEN COMPARTMENTS', fs: 36, sub: 'Policía Nacional and Spanish customs, 2010' },
          { type: 'funfact', at: hid - 0.2, y: 860, rows: [{ text: "THE 'DAKAR' RALLY" }, { text: 'HAS NOT REACHED DAKAR' }, { text: 'SINCE 2007' }, { text: '2008 cancelled; South America 2009-19', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 5 - the rehook + CASE 3: the motorway at night; the van sits on the hard shoulder facing right, the patrol car behind
    //     it with its lights turning; the officer walks up to the driver, who stands by the door; the A29 label
    fa83_road(ctx) {
      const t = ctx.t, T = ctx.T, vn = WT(ctx, 0, 2, 0.6), cf = WT(ctx, 0, 5, 1.8), bd = WT(ctx, 0, 6, 2.4), sd = WT(ctx, 0, 9, 3.4);
      return E.cine.shot(ctx, {
        set: 'fa83_road', grade: 'night', haze: 0.35,
        cam: { from: { x: -20, y: 20, z: 1.02 }, to: { x: 10, y: 30, z: 1.08 } },
        figures: [
          { id: 'fa83_driver', x: 760, y: 1560, scale: 0.52, dir: -1, turn: 0.35, pose: 'stand', silhouette: 'cool', depth: 1.02,
            keys: [{ at: cf, pose: 'present', headTurn: 0.3, dur: 0.4 }, { at: bd, pose: 'point', dur: 0.4 }, { at: sd + 0.2, pose: 'hands_together', dur: 0.4 }] },
          { id: 'fa83_agent', x: 480, y: 1620, scale: 0.56, dir: 1, turn: 0.35, pose: 'torch', expr: 'focused', depth: 1.03, hat: { style: 'cap', color: '#1c2432' }, propOpts: { beamLen: 360, aim: 110 },
            walk: { at: vn - 0.2, dur: Math.max(1.0, cf - vn + 0.1), cadence: 3.2, stride: 14, from: 180, to: 480 },
            keys: [{ at: cf + 0.1, pose: 'torch', expr: 'stern', dur: 0.3 }, { at: sd, pose: 'arms_crossed', expr: 'stern', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => panelVan(820, 1380, 0.6, {}) },
          { depth: 0.98, svg: tt => patrol(60, 1340, 0.5, tt, 1) }
        ],
        overlays: [
          { type: 'label', at: vn, x: 60, y: 520, text: 'A29 NEAR NUMANSDORP · 13 DEC 2024', fs: 36, sub: 'Stopped for suspicious driving (Dutch police)' },
          { type: 'label', at: bd + 0.1, x: 60, y: 720, text: 'NO PAPERWORK FOR THE "BODIES"', fs: 34, sub: "A body needs a 'laissez-passer' (1973 treaty)" }
        ],
        tag: TAG
      });
    },

    // 6 - THE BIGGEST REVEAL (music drop, the single impact): the funeral home; the coffin on trestles; the lid lifts at the
    //     line start, the bags unzip on 'bodies' (the impact); the officer steps back; the driver silhouette, hands behind;
    //     the court label on 'Four'
    fa83_coffin(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.3), bo = WT(ctx, 0, 3, 1.4), co = WT(ctx, 0, 4, 2.2), fy = WT(ctx, 0, 5, 2.8);
      return E.cine.shot(ctx, {
        set: 'fa83_chapel', grade: 'warm', haze: 0.2, dof: true,
        cam: { from: { x: 0, y: 20, z: 1.04 }, to: { x: 0, y: 30, z: 1.12 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'fa83_agent', x: 200, y: 1600, scale: 0.58, dir: 1, turn: 0.4, pose: 'examine', expr: 'focused', depth: 1.03, hat: { style: 'cap', color: '#1c2432' },
            keys: [{ at: bo, pose: 'hand_to_face', expr: 'shocked', dur: 0.35 }, { at: fy, pose: 'point', expr: 'stern', dur: 0.4 }] },
          { id: 'fa83_driver', x: 900, y: 1580, scale: 0.54, dir: -1, turn: 0.35, pose: 'hands_behind', silhouette: 'cool', depth: 1.02,
            keys: [{ at: co, pose: 'bowed', dur: 0.4 }, { at: fy + 0.2, pose: 'hands_behind', headTurn: -0.3, dur: 0.4 }] }
        ],
        props: [{ depth: 1.0, accent: true, svg: tt => coffin(300, 1300, 560, { lid: seg(tt, l1, l1 + 0.9), bags: seg(tt, bo - 0.1, bo + 0.5) }) }],
        overlays: [
          { type: 'impact', at: bo, x: 580, y: 1060 },
          { type: 'callout', at: bo + 0.35, target: [520, 1080], label: [90, 760], text: 'SPORTS BAGS OF COCAINE', w: 520, r: 60 },
          { type: 'label', at: fy, x: 60, y: 520, text: 'ROTTERDAM COURT, APRIL 2025: 4 YEARS', fs: 36, sub: 'Guilty of using forged documents' }
        ],
        tag: TAG
      });
    },

    // 7 - the CALLBACK on frame 1's scrapyard (the loop): the same figures in the same poses; the medic's crutches
    //     label; the doors swing back toward frame 1's position and the camera eases back to frame 1's start by the last
    //     frame; the end card sits on top
    fa83_end(ctx) {
      const t = ctx.t, T = ctx.T, cr = WT(ctx, 0, 3, 1.0), gg = WT(ctx, 0, 5, 1.8);
      const back = Math.max(0.0, T - 1.0);
      return E.cine.shot(ctx, {
        set: 'fa83_yard', grade: 'night', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.5) }] },
        figures: [
          { id: 'fa83_officer', x: 930, y: 1500, scale: 0.6, dir: -1, turn: 0.4, pose: 'torch', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#1a2230' }, propOpts: { beamLen: 420, aim: 150 },
            keys: [{ at: cr, pose: 'point', expr: 'stern', headTurn: -0.3, dur: 0.35 }, { at: Math.max(cr + 0.5, back - 0.2), pose: 'torch', expr: 'focused', dur: 0.4 }] },
          { id: 'fa83_medic', x: 190, y: 1500, scale: 0.58, dir: 1, turn: 0.4, pose: 'hands_behind', silhouette: 'cool', depth: 1.02,
            keys: [{ at: cr + 0.1, pose: 'hands_behind', headTurn: 0.5, dur: 0.4 }, { at: Math.max(cr + 0.6, back - 0.1), pose: 'hands_behind', headTurn: 0, dur: 0.4 }] }
        ],
        props: [hero({ open: tt => 1 - 0.55 * ease.inOut(seg(tt, back, T - 0.05)), beam: tt => 1 - seg(tt, back, T) })],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 728, text: 'THE "PATIENT" ON CRUTCHES WAS ONE OF THE GANG (NCA)', fs: 28 }
        ],
        tag: TAG
      });
    }
  });
})();
