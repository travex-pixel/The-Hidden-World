/* Case File 33 (cinematic, 40-second cut): the Times Square car bomb attempt (1 May 2010) and the engine-block VIN.
   CLOSED: guilty plea to all ten counts (21 June 2010); life in prison (5 October 2010). No victims.
   Structure (short40 + the EPISODE 29+ / 31-35 rules): a burned-in hook headline that leads with the OBJECT, over the HERO
   OBJECT: a generic dark SUV seen head-on, hazard lights blinking, thin smoke seeping from it, on a bright night street of
   abstract billboards; big and centred in the first frame and again in the last (the video loops). A stakes card by 0:10 (what
   police said was inside; what officials said it could have done); the first HOW (the dashboard VIN gone; the one on the engine
   block); the clue chain (a Craigslist seller, a prepaid phone, a name); the irony (on the no-fly list that day; on a plane to
   Dubai that night); the HOW at ~70 % (the plane had left the gate; called back; taken off the plane); the outcome in one
   line; the callback; a burned-in YES/NO end question (episode.end_title) over the last 3.2 s. No nextcase card.
   Content rules:
   - No device, explosion, weapon or victim is drawn anywhere (there were none): only smoke from a parked SUV. The contents
     are a typed card in a quiet room.
   - Shahzad is ONLY an anonymous rim-lit silhouette (characters/figures/ts33_shahzad.json): no face, no likeness, never a photo
     recreation, never posed heroically. Every shot he is in is tagged 'ILLUSTRATION · NOT A LIKENESS'.
   - The vendors, the mounted officer, the technician and the agents are generic figures, not named. No weapon. The horse is generic.
   - No brand or real material: the SUV carries no plate, badge or logo; the billboards are abstract colour panels with no text;
     no airline, dealer, website or police crest; the VIN is masked; every card is our own typed graphic.
   New environments (E.registerSets): ts33_square (a bright city square at night: tall fronts with abstract billboards, a blank
   marquee, crowds as dark shapes on the sidewalks, a wet road with colour reflections; o.police flickers red/blue; o.clear
   empties the sidewalks), ts33_garage (a police garage: block wall, fluorescent tubes, a roll door, a lift column, a tool
   chest), ts33_gate (an airport gate at night: a glass wall onto a dark apron with a generic airliner and a jet bridge, a gate
   desk, a boarding door), ts33_cabin (a modern jet cabin in one-point perspective: bins, rows of seats, an aisle).
   Plus the shared task_force and courtroom sets.
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
  const STREET = 'ILLUSTRATION · GENERIC STREET, NO REAL SIGNS';
  const YEL = '#ffd23f', RED = '#8e1f18', MUTE = '#6b665c';
  const panel = (x, y, w, h, op = 0.6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#000" opacity="${op}"/>`;
  const BODY = '#2b2f36', BODYL = '#4a5058', BODYD = '#1a1d22', GLASS = '#18212d', AMBER = '#ffb020', AMBERD = '#6a4a10';
  const blink = t => ((t * 1.4) % 1) < 0.5;   // hazard flashers, about 1.4 Hz

  // thin smoke: n puffs rising from (x, y), drifting right; k 0..1 = density (in local car units)
  function smoke(x, y, k, t, n = 5, seed = 0, rise = 320) {
    if (k <= 0) return '';
    let g = '';
    for (let i = 0; i < n; i++) {
      const u = ((t * 0.3 + i / n + seed) % 1), cx = x + 60 * u + 22 * Math.sin(t * 1.3 + i * 1.7), cy = y - rise * u, r = 26 + 96 * u;
      g += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="#b4bcc4" opacity="${f1(0.6 * k * (1 - u))}"/><circle cx="${f1(cx - r * 0.3)}" cy="${f1(cy - r * 0.2)}" r="${f1(r * 0.6)}" fill="#d8dee2" opacity="${f1(0.35 * k * (1 - u))}"/>`;
    }
    return g;
  }

  // ---------- THE HERO: a generic dark mid-size SUV seen head-on; bottom centre (x, y) on the road; ~900 x 760 at s = 1.
  // o.hazard (default true) blinks the amber corner lamps; o.smoke 0..1 = smoke seeping out from behind the roof and the
  // window seams; o.glow 0..1 = a yellow outline. No plate, badge, logo, lettering or make is drawn.
  function suvFront(x, y, s, t, o = {}) {
    const on = (o.hazard !== false) && blink(t), sm = o.smoke || 0, k = o.glow || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="8" rx="500" ry="40" fill="#000" opacity="0.45"/>`;
    g += smoke(-250, -700, sm, t, 6, 0.13) + smoke(250, -700, sm, t, 6, 0.47) + smoke(0, -730, sm * 0.8, t, 5, 0.8, 380);
    // tyres and the dark underbody
    g += `<rect x="-420" y="-170" width="840" height="60" fill="#0e0d0c"/>`;
    [-1, 1].forEach(d => { const x0 = d < 0 ? -440 : 330; g += `<rect x="${x0}" y="-160" width="110" height="160" rx="22" fill="#0c0c0e" stroke="${INK}" stroke-width="6"/>` + [-120, -80, -40].map(yy => `<path d="M${x0 + 14} ${yy} L${x0 + 96} ${yy}" stroke="#2a2a2e" stroke-width="7"/>`).join(''); });
    // the body: a tall front with flared fenders, a hood, the windscreen, the roof and a roof rack
    g += `<path d="M-444 -150 L-452 -330 Q-452 -450 -420 -456 L420 -456 Q452 -450 452 -330 L444 -150 Z" fill="${BODY}" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M-444 -150 L-452 -330 Q-452 -450 -420 -456 L-388 -456 Q-416 -440 -416 -330 L-410 -150 Z" fill="${BODYD}" opacity="0.8"/><path d="M444 -150 L452 -330 Q452 -450 420 -456 L396 -456 Q422 -440 422 -330 L416 -150 Z" fill="${BODYL}" opacity="0.5"/>`;
    g += `<path d="M-420 -456 L420 -456 L392 -516 L-392 -516 Z" fill="${BODYL}" stroke="${INK}" stroke-width="6"/><path d="M0 -458 L0 -514" stroke="${BODYD}" stroke-width="4" opacity="0.6"/>`;
    g += `<path d="M-392 -516 L392 -516 L330 -700 L-330 -700 Z" fill="${BODY}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-350 -524 L350 -524 L300 -690 L-300 -690 Z" fill="${GLASS}" stroke="${INK}" stroke-width="5"/>`;
    // reflections of the lights in the glass (no interior is visible)
    g += `<path d="M-230 -526 L-150 -526 L-60 -688 L-120 -688 Z" fill="#ff8ac8" opacity="0.14"/><path d="M60 -526 L96 -526 L170 -688 L150 -688 Z" fill="#7ad8ff" opacity="0.14"/><path d="M-310 -530 L-290 -530 L-230 -680 L-250 -680 Z" fill="#fff" opacity="0.08"/>`;
    g += `<path d="M-200 -530 Q-120 -600 -40 -560" stroke="#0c0e12" stroke-width="5" fill="none"/><path d="M40 -530 Q120 -600 200 -560" stroke="#0c0e12" stroke-width="5" fill="none"/>`;
    g += `<rect x="-336" y="-732" width="672" height="34" rx="8" fill="${BODY}" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="-300" y="-764" width="600" height="12" rx="4" fill="#1a1a1c" stroke="${INK}" stroke-width="3"/><rect x="-290" y="-752" width="20" height="22" fill="#1a1a1c"/><rect x="270" y="-752" width="20" height="22" fill="#1a1a1c"/>`;
    // mirrors
    g += `<rect x="-480" y="-612" width="64" height="48" rx="12" fill="${BODY}" stroke="${INK}" stroke-width="5"/><rect x="416" y="-612" width="64" height="48" rx="12" fill="${BODY}" stroke="${INK}" stroke-width="5"/>`;
    // the grille (plain bars, no badge) between two headlamps
    g += `<rect x="-236" y="-430" width="472" height="96" rx="10" fill="#15181c" stroke="${INK}" stroke-width="5"/>` + [1, 2, 3].map(i => `<path d="M-226 ${-430 + i * 24} L226 ${-430 + i * 24}" stroke="#3a3f46" stroke-width="7"/>`).join('');
    [-1, 1].forEach(d => { const x0 = d < 0 ? -424 : 254; g += `<rect x="${x0}" y="-434" width="170" height="100" rx="14" fill="#d8e4ec" stroke="${INK}" stroke-width="5"/><rect x="${x0 + 12}" y="-422" width="146" height="40" rx="8" fill="#fff" opacity="0.5"/>`; });
    // THE HAZARD LAMPS: amber corner lamps that blink together
    [-1, 1].forEach(d => { const x0 = d < 0 ? -446 : 358; g += `<rect x="${x0}" y="-326" width="88" height="40" rx="8" fill="${on ? AMBER : AMBERD}" stroke="${INK}" stroke-width="4"/>`; if (on) g += wash(x0 + 44, -306, 150, 80, AMBER, 0.6); });
    // bumper and valance (no plate)
    g += `<path d="M-460 -210 L460 -210 Q476 -240 460 -292 L-460 -292 Q-476 -240 -460 -210 Z" fill="#3a3e44" stroke="${INK}" stroke-width="6"/><rect x="-440" y="-210" width="880" height="46" fill="#1e2126" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="-120" y="-276" width="240" height="50" rx="6" fill="#2a2e34" stroke="${INK}" stroke-width="3"/>`;
    g += `<path d="M-330 -270 L-250 -270 M250 -270 L330 -270" stroke="#111214" stroke-width="12"/>`;
    // thin smoke also seeps from the hood seam and the window edges, in front of the body
    g += smoke(-300, -500, sm * 0.5, t, 3, 0.3, 220) + smoke(300, -500, sm * 0.5, t, 3, 0.65, 220);
    if (k > 0) g += `<path d="M-500 -120 L-510 -340 L-460 -470 L-400 -540 L-340 -770 L340 -770 L400 -540 L460 -470 L510 -340 L500 -120 Z" fill="none" stroke="${YEL}" stroke-width="10" stroke-linejoin="round" opacity="${f1(k * (0.75 + 0.25 * Math.sin(t * 7)))}"/>`;
    return g + '</g>';
  }

  // the same SUV in profile, front to the right; bottom centre (x, y); ~1120 long at s = 1. o.hood 0..1 lifts the hood (hinged
  // at the windscreen end), showing a dark engine bay with a generic engine block and a small stamped strip whose characters are
  // MASKED (never a real number); o.glow 0..1 lights that strip. No plate, badge, logo or lettering.
  function suvSide(x, y, s, t, o = {}) {
    const hd = o.hood || 0, k = o.glow || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="6" rx="570" ry="28" fill="#000" opacity="0.42"/>`;
    // the body: a boxy wagon with a long roof; the hood at the front (right) is drawn separately so it can open
    g += `<path d="M-548 -60 L-552 -150 Q-552 -180 -528 -184 L-520 -330 Q-516 -348 -490 -350 L-120 -350 L-60 -486 Q-50 -500 -30 -500 L330 -500 Q352 -500 362 -488 L440 -350 L470 -346 L548 -300 Q564 -290 564 -270 L564 -60 Z" fill="${BODY}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-548 -60 L-552 -112 L564 -112 L564 -60 Z" fill="${BODYD}" opacity="0.85"/><path d="M-544 -118 L560 -118" stroke="#5a6068" stroke-width="4"/>`;
    g += `<path d="M-60 -486 Q-50 -500 -30 -500 L330 -500 Q352 -500 362 -488 L354 -478 L-52 -478 Z" fill="${BODYL}" stroke="${INK}" stroke-width="3"/>`;
    g += `<rect x="-20" y="-520" width="300" height="12" rx="4" fill="#1a1a1c" stroke="${INK}" stroke-width="3"/>`;
    // windows (dark glass, three panes), door seams, handles, a mirror
    g += `<path d="M-500 -340 L-130 -340 L-130 -358 L-500 -358 Z" fill="${BODYL}" opacity="0.4"/>`;
    g += `<path d="M-480 -344 L-220 -344 L-220 -470 Q-220 -482 -232 -482 L-470 -482 Q-482 -482 -482 -470 Z M-200 -344 L0 -344 L0 -480 L-60 -480 L-108 -356 Z M30 -344 L250 -344 L306 -480 L30 -480 Z" fill="${GLASS}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-470 -476 L-250 -476 L-250 -440 L-470 -440 Z" fill="#fff" opacity="0.06"/><path d="M40 -474 L150 -474 L130 -430 L40 -430 Z" fill="#7ad8ff" opacity="0.1"/>`;
    g += `<path d="M-210 -350 L-210 -110 M18 -350 L18 -110" stroke="${INK}" stroke-width="4" opacity="0.7"/><rect x="-260" y="-300" width="40" height="12" rx="5" fill="#c9d0d6" stroke="${INK}" stroke-width="3"/><rect x="-30" y="-300" width="40" height="12" rx="5" fill="#c9d0d6" stroke="${INK}" stroke-width="3"/>`;
    g += `<rect x="286" y="-420" width="54" height="40" rx="10" fill="${BODY}" stroke="${INK}" stroke-width="4"/>`;
    // tail lamp (rear, left) and head lamp (front, right); hazards off here
    g += `<rect x="-556" y="-280" width="16" height="60" rx="4" fill="#b8261f"/><rect x="548" y="-290" width="18" height="46" rx="4" fill="#d8e4ec" stroke="${INK}" stroke-width="3"/>`;
    // wheels
    [-340, 340].forEach(cx => { g += `<path d="M${cx - 92} -60 A92 92 0 0 1 ${cx + 92} -60 Z" fill="#141210"/><circle cx="${cx}" cy="-6" r="74" fill="#0b0b0d" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-6" r="36" fill="#9aa0a8" stroke="${INK}" stroke-width="4"/><path d="M${cx - 22} -6 L${cx + 22} -6 M${cx} -28 L${cx} 16" stroke="#5a606a" stroke-width="5"/>`; });
    // the engine bay (only visible when the hood lifts): a dark well, a generic engine block, the masked stamped strip
    if (hd > 0.02) {
      g += `<rect x="372" y="-346" width="176" height="110" fill="#07080a"/><rect x="396" y="-330" width="130" height="86" rx="8" fill="#4a4844" stroke="${INK}" stroke-width="5"/>`;
      g += [0, 1, 2, 3].map(i => `<path d="M${404 + i * 30} -326 L${404 + i * 30} -290" stroke="#2e2c28" stroke-width="6"/>`).join('') + `<rect x="404" y="-286" width="114" height="10" fill="#2e2c28"/>`;
      g += `<rect x="408" y="-274" width="100" height="22" rx="3" fill="${k > 0.5 ? '#8a8578' : '#5e5a52'}" stroke="${INK}" stroke-width="3"/>`;
      for (let i = 0; i < 8; i++) g += `<rect x="${414 + i * 11.5}" y="-270" width="7" height="14" rx="1.5" fill="${k > 0.5 ? '#1a1814' : '#3a3730'}"/>`;
      if (k > 0) g += `<rect x="396" y="-286" width="124" height="46" rx="8" fill="none" stroke="${YEL}" stroke-width="7" opacity="${f1(k * (0.75 + 0.25 * Math.sin(t * 7)))}"/>` + wash(458, -263, 150, 70, '#fff1b0', f1(0.35 * k));
    }
    // the hood: a slab hinged at the windscreen end (x = 362, y = -350); it swings up and back by up to ~55 degrees
    g += `<g transform="rotate(${f1(-55 * ease.out(hd))} 362 -350)"><path d="M362 -350 L548 -304 L560 -290 L556 -276 L372 -332 Z" fill="${BODYL}" stroke="${INK}" stroke-width="5"/><path d="M372 -346 L540 -306" stroke="${BODY}" stroke-width="4"/></g>`;
    return g + '</g>';
  }

  // a generic dark police horse in profile, facing right, bottom centre (x, y); ~620 tall at s = 1 (no number, no insignia)
  function horse(x, y, s, t, fl = 1) {
    const bob = 3 * Math.sin(t * 1.6);
    let g = `<g transform="translate(${f1(x)} ${f1(y + bob)}) scale(${sc(s * fl)} ${sc(s)})"><ellipse cx="0" cy="4" rx="230" ry="20" fill="#000" opacity="0.4"/>`;
    const C = '#6b4328', D = '#3e2616';
    [[-150, -1], [-96, 1], [92, -1], [150, 1]].forEach(([lx, d]) => { g += `<path d="M${lx - 16} -320 L${lx - 10 + d * 8} -140 L${lx - 12 + d * 10} -8 L${lx + 14 + d * 10} -8 L${lx + 12 + d * 8} -140 L${lx + 16} -320 Z" fill="${d < 0 ? D : C}" stroke="${INK}" stroke-width="4"/><rect x="${lx - 16 + d * 10}" y="-18" width="30" height="18" rx="4" fill="#0e0a08"/>`; });
    g += `<ellipse cx="0" cy="-360" rx="200" ry="92" fill="${C}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-190 -400 Q-280 -330 -236 -140 Q-250 -120 -262 -140 Q-300 -340 -210 -420 Z" fill="${D}" stroke="${INK}" stroke-width="3"/>`;
    g += `<path d="M150 -420 L250 -600 L310 -596 L218 -380 Z" fill="${C}" stroke="${INK}" stroke-width="5"/><path d="M160 -430 Q220 -560 262 -600 L286 -598 Q236 -560 196 -420 Z" fill="${D}"/>`;
    g += `<path d="M246 -612 L338 -620 L372 -556 L336 -520 L262 -530 Z" fill="${C}" stroke="${INK}" stroke-width="5"/><path d="M296 -614 L312 -660 L330 -618 Z" fill="${C}" stroke="${INK}" stroke-width="3"/><circle cx="318" cy="-586" r="6" fill="#0a0806"/>`;
    g += `<path d="M262 -536 L372 -556 M336 -520 L338 -540" stroke="#c9d0d6" stroke-width="4" fill="none" opacity="0.8"/>`;
    g += `<path d="M-70 -440 L90 -440 L80 -420 Q0 -400 -60 -420 Z" fill="#2a1a10" stroke="${INK}" stroke-width="4"/><path d="M-60 -418 L-56 -330 M76 -418 L72 -330" stroke="#2a1a10" stroke-width="10"/>`;
    g += `<path d="M-150 -410 Q0 -470 150 -420" stroke="#8a5c3a" stroke-width="6" fill="none" opacity="0.6"/><path d="M-190 -370 Q-120 -330 -60 -360" stroke="#000" stroke-width="5" fill="none" opacity="0.2"/>`;
    return g + '</g>';
  }

  // a vendor's folding table with stacks of folded T-shirts and a small rack of hanging shirts behind it (no lettering, no prints)
  function stall(x, y, s) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="260" ry="16" fill="#000" opacity="0.4"/>`;
    g += `<rect x="-230" y="-250" width="460" height="18" rx="4" fill="#4a4e56" stroke="${INK}" stroke-width="4"/><path d="M-210 -232 L-190 0 M210 -232 L190 0 M-200 -120 L-220 0 M200 -120 L220 0" stroke="#3a3e46" stroke-width="10"/>`;
    g += `<rect x="-230" y="-232" width="460" height="230" fill="#1c1e24" opacity="0.6"/>`;
    const cols = ['#c8312b', '#2a62b8', '#e8e2d4', '#1c1c1e', '#3aa35a', '#f0c040'];
    for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) g += `<rect x="${-214 + i * 90}" y="${-258 - j * 14}" width="80" height="14" rx="3" fill="${cols[(i + j) % 6]}" stroke="${INK}" stroke-width="2"/>`;
    g += `<path d="M-250 -540 L250 -540" stroke="#8a8f98" stroke-width="8"/><path d="M-250 -540 L-250 -250 M250 -540 L250 -250" stroke="#8a8f98" stroke-width="6"/>`;
    [[-180, '#2a62b8'], [-60, '#c8312b'], [60, '#e8e2d4'], [180, '#1c1c1e']].forEach(([tx, c]) => { g += `<path d="M${tx - 50} -520 L${tx - 24} -536 L${tx + 24} -536 L${tx + 50} -520 L${tx + 36} -500 L${tx + 28} -500 L${tx + 28} -380 L${tx - 28} -380 L${tx - 28} -500 L${tx - 36} -500 Z" fill="${c}" stroke="${INK}" stroke-width="3"/>`; });
    return g + '</g>';
  }

  // a modern airliner seat back seen from behind/side in one-point perspective; (x, y) bottom centre, k = scale
  function seat(x, y, k, col = '#24365a') {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><rect x="-80" y="-300" width="160" height="300" rx="22" fill="${col}" stroke="${INK}" stroke-width="5"/><rect x="-56" y="-330" width="112" height="60" rx="16" fill="${col}" stroke="${INK}" stroke-width="4"/><rect x="-60" y="-286" width="120" height="50" rx="10" fill="#fff" opacity="0.12"/><rect x="-96" y="-150" width="30" height="110" rx="8" fill="#3a3f48" stroke="${INK}" stroke-width="3"/><rect x="66" y="-150" width="30" height="110" rx="8" fill="#3a3f48" stroke="${INK}" stroke-width="3"/></g>`;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a bright city square at night (generic): tall fronts left and right covered in abstract colour billboards (no text, no
    // logos), a blank-bulb marquee, crowds as dark shapes on the sidewalks, a wet road reflecting the colours.
    // o.police 0..1 flickers red/blue on the fronts; o.clear 0..1 empties the sidewalks.
    ts33_square(ctx, o = {}) {
      const t = ctx.t, r = R(331), po = o.police || 0, clear = o.clear || 0;
      let sky = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#06070c"/>`;
      // the fronts: dark towers with window grids
      let bld = '';
      [[-300, -300, 620, '#141622'], [320, 80, 460, '#10121a'], [780, -300, 620, '#141622']].forEach(([x, y, w, col]) => {
        bld += `<rect x="${x}" y="${y}" width="${w}" height="${1200 - y}" fill="${col}" stroke="#0a0b10" stroke-width="4"/>`;
        for (let yy = Math.max(y, -200) + 40; yy < 1100; yy += 70) for (let xx = x + 30; xx < x + w - 50; xx += 70) bld += `<rect x="${xx}" y="${yy}" width="34" height="46" fill="${(xx + yy) % 3 ? '#2a3448' : '#ffd98a'}" opacity="${(xx + yy) % 3 ? 0.8 : 0.35}"/>`;
      });
      // the billboards: abstract colour panels with a shape or two, flickering gently; a glow behind each
      const boards = [[-220, 60, 460, 300, '#ff2d8a', '#ffb3d6'], [-180, 420, 420, 240, '#2ad4ff', '#bff1ff'], [-140, 720, 380, 180, '#ffd23f', '#fff1b0'],
        [800, 40, 480, 320, '#3cf0a0', '#c8ffe6'], [840, 420, 440, 250, '#ff8a2a', '#ffd9b0'], [880, 730, 400, 180, '#8a5cff', '#d8c8ff'],
        [340, 150, 420, 170, '#ff4a4a', '#ffc8c8'], [360, 370, 380, 130, '#44c8ff', '#c8f0ff'], [380, 560, 340, 110, '#f4efe4', '#ffffff']];
      boards.forEach(([x, y, w, h, c, l], i) => {
        const fl = 0.86 + 0.14 * Math.sin(t * (1.1 + i * 0.37) + i);
        bld += wash(x + w / 2, y + h / 2, w * 0.9, h * 0.9, c, 0.35 * fl) + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${c}" opacity="${f1(fl)}" stroke="${INK}" stroke-width="5"/>`;
        if (i % 3 === 0) bld += `<circle cx="${x + w * 0.3}" cy="${y + h * 0.5}" r="${h * 0.3}" fill="${l}" opacity="0.8"/><rect x="${x + w * 0.55}" y="${y + h * 0.3}" width="${w * 0.35}" height="${h * 0.14}" rx="6" fill="${l}" opacity="0.7"/><rect x="${x + w * 0.55}" y="${y + h * 0.55}" width="${w * 0.25}" height="${h * 0.14}" rx="6" fill="${l}" opacity="0.5"/>`;
        else if (i % 3 === 1) bld += `<path d="M${x + w * 0.1} ${y + h * 0.8} L${x + w * 0.4} ${y + h * 0.2} L${x + w * 0.7} ${y + h * 0.8} Z" fill="${l}" opacity="0.7"/><rect x="${x + w * 0.72}" y="${y + h * 0.2}" width="${w * 0.18}" height="${h * 0.6}" rx="8" fill="${l}" opacity="0.5"/>`;
        else bld += `<rect x="${x + w * 0.1}" y="${y + h * 0.25}" width="${w * 0.5}" height="${h * 0.5}" rx="10" fill="${l}" opacity="0.55"/><circle cx="${x + w * 0.8}" cy="${y + h * 0.5}" r="${h * 0.2}" fill="${l}" opacity="0.8"/>`;
      });
      // a blank marquee on the left (bulbs, no lettering); a street lamp on the right
      bld += `<rect x="-300" y="930" width="560" height="110" rx="6" fill="#1c1826" stroke="${INK}" stroke-width="5"/>`;
      for (let i = 0; i < 13; i++) bld += `<circle cx="${-280 + i * 44}" cy="946" r="7" fill="#ffe9a8" opacity="${f1(0.6 + 0.4 * Math.sin(t * 6 + i))}"/><circle cx="${-280 + i * 44}" cy="1024" r="7" fill="#ffe9a8" opacity="${f1(0.6 + 0.4 * Math.sin(t * 6 + i + 1))}"/>`;
      bld += `<rect x="1010" y="640" width="14" height="560" fill="#2a2e36" stroke="${INK}" stroke-width="3"/><path d="M1017 640 L960 640 L960 668" fill="none" stroke="#2a2e36" stroke-width="10"/><ellipse cx="960" cy="680" rx="26" ry="12" fill="#fff4c8"/>` + wash(960, 720, 300, 200, '#ffe9a8', 0.25);
      if (po > 0) { const ph = (t * 2.4) % 1; bld += `<rect x="-300" y="-300" width="${W + 600}" height="1500" fill="${ph < 0.5 ? '#ff3a2a' : '#3a6aff'}" opacity="${f1(0.14 * po)}"/>`; }
      // the crowds: dark shapes along both sidewalks (the middle of the road stays clear for the SUV)
      let crowd = `<rect x="-300" y="1150" width="${W + 600}" height="50" fill="#2a2d34"/><rect x="-300" y="1150" width="${W + 600}" height="8" fill="#55585e"/>`;
      if (clear < 1) {
        for (let i = 0; i < 30; i++) {
          const left = i < 15, cx = left ? -240 + i * 34 + r() * 20 : 1080 - (i - 15) * 34 - r() * 20, cy = 1120 + r() * 50, hh = 96 + r() * 36, sw = 1.5 * Math.sin(t * (0.8 + r()) + i);
          crowd += `<g opacity="${f1(0.92 * (1 - clear))}" transform="translate(${f1(sw)} 0)"><rect x="${f1(cx - 14)}" y="${f1(cy - hh)}" width="28" height="${f1(hh)}" rx="12" fill="#0b0c12"/><circle cx="${f1(cx)}" cy="${f1(cy - hh - 16)}" r="15" fill="#0b0c12"/></g>`;
        }
      }
      // the wet road: the billboard colours smeared down it, a crosswalk, a centre line
      let road = `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="#1a1c22"/>`;
      boards.forEach(([x, y, w, h, c]) => { road += `<rect x="${x + w * 0.2}" y="1200" width="${w * 0.6}" height="700" fill="${c}" opacity="0.07"/>`; });
      for (let i = 0; i < 7; i++) road += `<rect x="${f1(-80 + i * 190)}" y="1260" width="110" height="70" fill="#e8e4d8" opacity="0.5"/>`;
      road += `<path d="M-300 1620 L${W + 300} 1620" stroke="#d8c070" stroke-width="8" stroke-dasharray="70 50" opacity="0.4"/>`;
      for (let i = 0; i < 10; i++) road += `<ellipse cx="${f1(-200 + r() * 1500)}" cy="${f1(1300 + r() * 600)}" rx="${f1(40 + r() * 80)}" ry="${f1(8 + r() * 14)}" fill="#fff" opacity="0.05"/>`;
      if (po > 0) { const ph = (t * 2.4) % 1; road += `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="${ph < 0.5 ? '#ff3a2a' : '#3a6aff'}" opacity="${f1(0.1 * po)}"/>`; }
      // the road rides with the crowd layer (depth 0.5) so props placed up the street (depth 0.85-0.99) draw on top of it
      return { light: { dir: 1, rim: '#ff9ad0', key: '#dfe8ff' }, layers: [[0.05, sky], [0.22, bld], [0.5, crowd + road], [1.0, '']] };
    },

    // a police garage (generic): a block wall, fluorescent tubes, a roll door on the right, a lift column, a red tool chest,
    // a concrete floor with a painted bay line and oil stains. No crest, number or lettering.
    ts33_garage(ctx, o = {}) {
      const t = ctx.t, r = R(332);
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="1500" fill="#3a3e44"/>`;
      for (let yy = -280; yy < 1180; yy += 60) { wall += `<path d="M-300 ${yy} L${W + 300} ${yy}" stroke="#2c3036" stroke-width="3"/>`; for (let xx = -300 + ((yy / 60) % 2) * 60; xx < W + 300; xx += 120) wall += `<path d="M${xx} ${yy} L${xx} ${yy + 60}" stroke="#2c3036" stroke-width="3"/>`; }
      [[60, 420], [560, 420]].forEach(([x, w]) => { wall += `<rect x="${x}" y="230" width="${w}" height="22" rx="6" fill="#f4f6ff" opacity="${f1(0.9 + 0.1 * Math.sin(t * 40 + x))}"/>` + wash(x + w / 2, 300, w * 0.8, 160, '#f4f6ff', 0.25) + `<rect x="${x - 10}" y="214" width="${w + 20}" height="14" fill="#2a2e34"/>`; });
      wall += `<rect x="760" y="400" width="620" height="800" fill="#4a5058" stroke="${INK}" stroke-width="6"/>` + [...Array(13)].map((_, i) => `<path d="M764 ${440 + i * 60} L1376 ${440 + i * 60}" stroke="#2e3238" stroke-width="6"/>`).join('') + `<rect x="740" y="380" width="660" height="30" fill="#2a2e34" stroke="${INK}" stroke-width="4"/>`;
      wall += `<rect x="300" y="520" width="44" height="680" fill="#2a2e34" stroke="${INK}" stroke-width="4"/><rect x="280" y="500" width="84" height="40" rx="6" fill="#3a3f46" stroke="${INK}" stroke-width="4"/>`;
      wall += `<rect x="-120" y="880" width="280" height="320" rx="8" fill="#8e1f18" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2, 3].map(i => `<rect x="-104" y="${900 + i * 74}" width="248" height="58" rx="4" fill="#a8302a" stroke="${INK}" stroke-width="3"/><rect x="-10" y="${924 + i * 74}" width="60" height="10" rx="4" fill="#d8dce0"/>`).join('');
      wall += `<rect x="-300" y="1140" width="${W + 600}" height="60" fill="#2c3036"/>`;
      let floor = `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="#2a2d32"/><rect x="-300" y="1200" width="${W + 600}" height="10" fill="#4a4e54"/>`;
      floor += `<path d="M-300 1700 L${W + 300} 1700" stroke="#d8c070" stroke-width="10" opacity="0.35"/>`;
      for (let i = 0; i < 8; i++) floor += `<ellipse cx="${f1(-200 + r() * 1500)}" cy="${f1(1300 + r() * 600)}" rx="${f1(40 + r() * 90)}" ry="${f1(10 + r() * 16)}" fill="#0a0a0c" opacity="0.4"/>`;
      floor += wash(540, 1300, 700, 160, '#f4f6ff', 0.1);
      return { light: { dir: -1, rim: '#dfe8ff', key: '#f4f6ff' }, layers: [[0.3, wall], [1.0, floor]] };
    },

    // an airport gate at night (generic): a glass wall onto a dark apron with blue taxiway lights, a plain white airliner tail
    // and a jet bridge; a lit ceiling; a gate desk and a boarding door with a blank lit sign. No airline, logo or lettering.
    ts33_gate(ctx, o = {}) {
      const t = ctx.t, r = R(333);
      let out = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#04060c"/><rect x="-300" y="820" width="${W + 600}" height="500" fill="#0e1016"/>`;
      for (let i = 0; i < 40; i++) out += `<circle cx="${f1(-250 + r() * 1600)}" cy="${f1(-100 + r() * 400)}" r="${f1(1 + r() * 1.6)}" fill="#fff" opacity="${f1(0.3 + 0.3 * Math.sin(t * 2 + i))}"/>`;
      for (let i = 0; i < 14; i++) out += `<circle cx="${-200 + i * 110}" cy="${900 + (i % 2) * 6}" r="5" fill="#3a8aff" opacity="${f1(0.6 + 0.4 * Math.sin(t * 3 + i))}"/>`;
      // the airliner: a plain white fuselage with a row of windows, a tail fin with no marking; a jet bridge to its door
      out += `<path d="M420 760 Q480 700 700 700 L1180 700 Q1300 700 1340 740 Q1300 790 1180 800 L700 800 Q480 800 420 760 Z" fill="#dfe4e8" stroke="${INK}" stroke-width="5"/>`;
      out += `<path d="M1120 700 L1220 560 L1300 560 L1260 700 Z" fill="#d0d5da" stroke="${INK}" stroke-width="5"/>`;
      for (let i = 0; i < 16; i++) out += `<rect x="${600 + i * 40}" y="736" width="18" height="22" rx="6" fill="#2a3448"/>`;
      out += `<rect x="520" y="720" width="40" height="60" rx="4" fill="#2a3448" stroke="${INK}" stroke-width="3"/>`;
      out += `<path d="M220 740 L540 740 L540 800 L220 820 Z" fill="#4a4e56" stroke="${INK}" stroke-width="5"/><rect x="340" y="800" width="20" height="60" fill="#3a3e46"/>`;
      out += wash(900, 640, 600, 200, '#dfe8ff', 0.1);
      // the glass wall: mullions and a tint; the ceiling with light panels
      let glass = `<rect x="-300" y="300" width="${W + 600}" height="880" fill="#8ab4d8" opacity="0.08"/>`;
      for (let x = -300; x < W + 300; x += 200) glass += `<rect x="${x}" y="300" width="16" height="880" fill="#2a3040" stroke="${INK}" stroke-width="3"/>`;
      glass += `<rect x="-300" y="300" width="${W + 600}" height="16" fill="#2a3040"/><rect x="-300" y="760" width="${W + 600}" height="12" fill="#2a3040"/>`;
      glass += `<rect x="-300" y="-300" width="${W + 600}" height="600" fill="#2c2f36"/>`;
      for (let x = -200; x < W + 300; x += 260) glass += `<rect x="${x}" y="200" width="180" height="40" rx="6" fill="#fff4d8" opacity="0.7"/>` + wash(x + 90, 240, 200, 120, '#fff4d8', 0.2);
      // the boarding door on the right with a blank lit sign; the gate desk; stanchions
      glass += `<rect x="1040" y="560" width="220" height="640" fill="#1c2028" stroke="${INK}" stroke-width="6"/><rect x="1060" y="600" width="80" height="560" fill="#2a3040" stroke="${INK}" stroke-width="4"/><rect x="1150" y="600" width="90" height="560" fill="#2a3040" stroke="${INK}" stroke-width="4"/>`;
      glass += `<rect x="1020" y="480" width="260" height="60" rx="8" fill="#ffd23f" opacity="0.85" stroke="${INK}" stroke-width="4"/>` + wash(1150, 510, 240, 90, '#ffd23f', 0.3);
      let floor = `<rect x="-300" y="1180" width="${W + 600}" height="${H}" fill="#3a3a44"/><rect x="-300" y="1180" width="${W + 600}" height="12" fill="#55555e"/>`;
      for (let i = 0; i < 12; i++) floor += `<path d="M-300 ${1240 + i * 70} L${W + 300} ${1240 + i * 70}" stroke="#2e2e36" stroke-width="3"/>`;
      floor += `<rect x="700" y="980" width="300" height="220" rx="8" fill="#3a3e48" stroke="${INK}" stroke-width="6"/><rect x="690" y="970" width="320" height="24" rx="6" fill="#5a5e68" stroke="${INK}" stroke-width="4"/><rect x="720" y="1010" width="260" height="40" fill="#2a2e38"/>`;
      [[520, 1240], [640, 1250]].forEach(([x, y]) => { floor += `<rect x="${x - 6}" y="${y - 220}" width="12" height="220" fill="#8a8f98" stroke="${INK}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="26" fill="#6a6f78" stroke="${INK}" stroke-width="3"/>`; });
      floor += `<path d="M520 1030 Q580 1070 640 1040" stroke="#8e1f18" stroke-width="8" fill="none"/>`;
      floor += wash(900, 1300, 500, 120, '#fff4d8', 0.12);
      return { light: { dir: 1, rim: '#aac4ff', key: '#fff4d8' }, layers: [[0.2, out], [0.45, glass], [1.0, floor]] };
    },

    // a modern jet cabin in one-point perspective (generic): a ceiling, overhead bins left and right, small dark windows,
    // rows of navy seats receding to a far bulkhead, an aisle. No airline colours, logo or lettering.
    ts33_cabin(ctx, o = {}) {
      const t = ctx.t;
      let far = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#1c1e24"/>`;
      far += `<path d="M-300 -300 L${W + 300} -300 L${W + 300} 200 L700 620 L380 620 L-300 200 Z" fill="#d8d6d0"/><path d="M-300 200 L380 620 L700 620 L${W + 300} 200 L${W + 300} 260 L700 650 L380 650 L-300 260 Z" fill="#b8b6b0"/>`;
      far += `<path d="M-300 260 L380 650 L380 760 L-300 560 Z" fill="#c4c2ba" stroke="${INK}" stroke-width="4"/><path d="M${W + 300} 260 L700 650 L700 760 L${W + 300} 560 Z" fill="#c4c2ba" stroke="${INK}" stroke-width="4"/>`;
      for (let i = 0; i < 7; i++) { const u = i / 7, x = lerp(-240, 360, u), y = lerp(330, 648, u); far += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(6 - 4 * u)}" fill="#fff4d8" opacity="0.9"/><circle cx="${f1(W - x)}" cy="${f1(y)}" r="${f1(6 - 4 * u)}" fill="#fff4d8" opacity="0.9"/>`; }
      far += `<path d="M-300 560 L380 760 L380 1000 L-300 1300 Z" fill="#a8a6a0"/><path d="M${W + 300} 560 L700 760 L700 1000 L${W + 300} 1300 Z" fill="#a8a6a0"/>`;
      for (let i = 0; i < 6; i++) { const u = i / 6, x = lerp(-200, 330, u), y = lerp(760, 860, u), k = 1 - 0.8 * u; far += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(70 * k)}" height="${f1(100 * k)}" rx="${f1(20 * k)}" fill="#0c1424" stroke="${INK}" stroke-width="3"/><rect x="${f1(x + 10 * k)}" y="${f1(y + 50 * k)}" width="${f1(50 * k)}" height="${f1(30 * k)}" fill="#3a6aff" opacity="0.25"/>`; far += `<rect x="${f1(W - x - 70 * k)}" y="${f1(y)}" width="${f1(70 * k)}" height="${f1(100 * k)}" rx="${f1(20 * k)}" fill="#0c1424" stroke="${INK}" stroke-width="3"/>`; }
      far += `<rect x="380" y="620" width="320" height="420" fill="#2c2e36" stroke="${INK}" stroke-width="4"/><rect x="470" y="700" width="140" height="300" rx="10" fill="#3a3e48" stroke="${INK}" stroke-width="3"/>`;
      far += wash(540, 500, 700, 260, '#fff4d8', 0.14);
      // the floor and the aisle
      let floor = `<path d="M-300 1300 L380 1000 L700 1000 L${W + 300} 1300 L${W + 300} ${H + 300} L-300 ${H + 300} Z" fill="#2f2a3a"/><path d="M380 1000 L700 1000 L1000 ${H + 300} L80 ${H + 300} Z" fill="#3a3346"/>`;
      for (let i = 0; i < 6; i++) { const u = i / 6, y = lerp(1040, 1900, u * u), x0 = lerp(390, 120, u * u), x1 = lerp(690, 960, u * u); floor += `<path d="M${f1(x0)} ${f1(y)} L${f1(x1)} ${f1(y)}" stroke="#4a3f5a" stroke-width="4" opacity="0.6"/>`; }
      // the seat rows: far to near, three seats each side of the aisle; the four far rows sit behind the figures, the two
      // nearest rows in front of them (so a figure in the aisle walks between seat backs). The floor is part of the far layer.
      let farSeats = '', nearSeats = '';
      for (let i = 0; i < 6; i++) {
        const u = i / 5, k = 0.3 + 0.7 * Math.pow(u, 1.5), y = 1000 + 760 * Math.pow(u, 1.35);
        let row = '';
        for (let j = 0; j < 3; j++) { const dx = 190 * k + j * 170 * k; row += seat(540 - dx, y, k) + seat(540 + dx, y, k); }
        if (i < 4) farSeats += row; else nearSeats += row;
      }
      return { light: { dir: -1, rim: '#ffe2b0', key: '#fff4d8' }, layers: [[0.3, far + floor], [0.5, farSeats], [1.0, ''], [1.01, nearSeats]], dust: true };
    }
  });

  // the hero SUV's framing in the first and the last shot (the loop): bottom centre on the road, big and centred
  const HERO = { x: 540, y: 1580, s: 0.95 };

  E.registerScenes({
    // 1 - hook: the SUV head-on on the bright square, hazards blinking, smoke seeping out, big and centred from the first
    //     frame. The headline is burned in by the engine (until ~3.2 s), so nothing of ours sits in y 380-720 before that.
    //     The vendor at his stall (left) notices on "smoking", points on "Hazard", recoils on "smoke".
    ts33_hook(ctx) {
      const t = ctx.t, smk = WT(ctx, 0, 1, 0.3), caught = WT(ctx, 0, 3, 1.2), bomber = WT(ctx, 0, 7, 2.6), haz = WT(ctx, 1, 0, 3.6), smoke2 = WT(ctx, 1, 5, 5.0);
      return E.cine.shot(ctx, {
        set: 'ts33_square', setOpts: {}, grade: 'cold',
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 0, y: 70, z: 1.08 }, handheld: 1.2 },
        shake: [{ at: smoke2, amp: 4 }],
        figures: [{ id: 'ts33_vendor', x: 150, y: 1600, scale: 0.6, dir: 1, turn: 0.5, pose: 'stand', expr: 'neutral', depth: 1.02, gaze: [0.6, -0.2],
          keys: [{ at: smk, pose: 'stand_tense', expr: 'focused', gaze: [0.8, -0.3], dur: 0.4 }, { at: haz, pose: 'point', expr: 'worried', gaze: [0.8, -0.3], dur: 0.45 },
            { at: smoke2, pose: 'hand_to_face', expr: 'shocked', dur: 0.5 }] }],
        props: [
          { depth: 1.0, svg: tt => suvFront(HERO.x, HERO.y, HERO.s, tt, { smoke: 0.5 + 0.5 * seg(tt, smoke2 - 0.2, smoke2 + 0.3), glow: 0.8 * seg(tt, caught - 0.1, caught + 0.3) * (1 - seg(tt, bomber + 0.6, bomber + 1.2)) }) },
          { depth: 1.03, svg: tt => stall(150, 1640, 0.56) }
        ],
        overlays: [
          { type: 'label', at: 3.3, x: 60, y: 432, text: 'TIMES SQUARE, NEW YORK', fs: 40, sub: '45th Street · Saturday evening, 1 May 2010' }
        ],
        tag: STREET
      });
    },

    // 2 - two vendors flag a mounted officer (the horse beside him); the vendor walks over and points; the device never goes
    //     off (card). Police lights come up on the second line. Nothing of the device is drawn.
    ts33_vendors(ctx) {
      const t = ctx.t, two = WT(ctx, 0, 0, 0.2), ven = WT(ctx, 0, 2, 0.8), flg = WT(ctx, 0, 3, 1.2), mnt = WT(ctx, 0, 5, 1.8), off = WT(ctx, 0, 6, 2.1), l1 = LS(ctx, 1, 3.0), dev = WT(ctx, 1, 1, 3.3), went = WT(ctx, 1, 3, 4.0);
      const po = seg(t, l1 - 0.2, l1 + 0.5);
      return E.cine.shot(ctx, {
        set: 'ts33_square', setOpts: { police: 0.6 * po }, grade: 'cold', police: 0.15 * po,
        cam: { keys: [{ at: 0, x: 60, y: 20, z: 1.1 }, { at: flg - 0.2, x: -40, y: 30, z: 1.16, dur: 1.2 }], handheld: 1.6 },
        figures: [
          { id: 'ts33_vendor', x: 720, y: 1690, scale: 0.72, dir: -1, turn: 0.5, pose: 'walk', expr: 'worried', walk: { from: 960, to: 720, at: two, dur: Math.max(0.6, flg - two), cadence: 6.5 },
            keys: [{ at: flg, pose: 'point', expr: 'determined', gaze: [-0.8, -0.2], dur: 0.4 }, { at: l1, pose: 'stand_tense', expr: 'worried', headTurn: 0.6, gaze: [0.8, -0.2], dur: 0.5 }] },
          { id: 'ts33_officer', x: 210, y: 1700, scale: 0.74, dir: 1, turn: 0.5, pose: 'stand', expr: 'neutral', keys: [{ at: mnt, pose: 'stand_tense', expr: 'focused', gaze: [0.8, -0.2], dur: 0.35 }, { at: off + 0.1, pose: 'point', expr: 'stern', dur: 0.4 }, { at: l1, pose: 'present', expr: 'determined', dur: 0.5 }] }
        ],
        // the horse stands behind the officer, facing him (flipped); the smoking SUV sits up the street behind them
        props: [
          { depth: 0.97, svg: tt => horse(650, 1690, 0.8, tt, -1) },
          { depth: 0.88, svg: tt => suvFront(880, 1430, 0.5, tt, { smoke: 0.8 }) }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.1, x: 60, y: 432, text: 'TWO T-SHIRT VENDORS', fs: 40, sub: 'Both veterans · they flagged a mounted officer' },
          { type: 'card', at: dev - 0.1, x: 60, y: 600, w: 700, rows: [{ text: 'THE DEVICE NEVER WENT OFF', fs: 40, colour: RED }, { text: 'ENGINE RUNNING · HAZARD LIGHTS ON', fs: 28, colour: MUTE, at: went }] }
        ],
        tag: STREET
      });
    },

    // 3 - the stakes by 0:10: a quiet task-force room; the contents and what officials said, as typed cards
    ts33_stakes(ctx) {
      const t = ctx.t, offi = WT(ctx, 0, 0, 0.2), said = WT(ctx, 0, 1, 0.6), it = WT(ctx, 0, 2, 0.9), could = WT(ctx, 0, 3, 1.1), very = WT(ctx, 0, 6, 1.9), dead = WT(ctx, 0, 7, 2.2);
      const card = tt => { const k0 = seg(tt, 0.05, 0.45), k1 = seg(tt, could - 0.1, could + 0.3), k2 = seg(tt, dead - 0.1, dead + 0.3); if (k0 <= 0) return '';
        return `<g opacity="${f1(k0)}">${panel(90, 520, 900, 280, 0.7)}<text x="540" y="590" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" fill="#bdb6a8">INSIDE THE SUV, POLICE SAID</text>` +
          `<text x="540" y="650" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="44" fill="#f4efe4">3 PROPANE TANKS · 2 GAS CANS</text>` +
          `<text x="540" y="700" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" fill="#e8dcc0">FIREWORKS · CLOCKS · WIRES</text>` +
          `<text x="540" y="760" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" fill="${YEL}" opacity="${f1(k1)}">"A SIGNIFICANT FIREBALL" — THE POLICE COMMISSIONER</text>` +
          `<text x="540" y="790" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="22" fill="#bdb6a8" opacity="${f1(k2)}">it failed to detonate · no one was hurt</text></g>`; };
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: {}, grade: 'cold', dust: true,
        cam: { from: { x: 20, y: -30, z: 1.06 }, to: { x: -20, y: -50, z: 1.0 }, handheld: 0.6 },
        figures: [
          { id: 'analyst', x: 220, y: 1610, scale: 0.92, dir: 1, turn: 0.55, pose: 'sit_read', expr: 'focused', keys: [{ at: said, pose: 'point', expr: 'determined', gaze: [0.6, -0.2], dur: 0.45 }, { at: very, pose: 'sit_read', expr: 'neutral', dur: 0.5 }] },
          { id: 'agent_b', x: 840, y: 1740, scale: 0.96, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', keys: [{ at: offi, pose: 'stand', expr: 'stern', dur: 0.5 }, { at: could, pose: 'stand_tense', dur: 0.5 }, { at: dead, pose: 'stand', expr: 'determined', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'NEW YORK · 1-2 MAY 2010', fs: 40, sub: 'The bomb squad examined the SUV' },
          { type: 'svg', at: 0.05, svg: card }
        ],
        tag: TAG
      });
    },

    // 4 - the first HOW: a police garage. The technician points up at the dashboard on "dashboard" (the VIN gone), walks to the
    //     front on the second line; the hood lifts on "stamped" and the strip on the engine block lights on "engine" (card)
    ts33_vin(ctx) {
      const t = ctx.t, dash = WT(ctx, 0, 1, 0.3), vin0 = WT(ctx, 0, 2, 0.7), gone = WT(ctx, 0, 4, 1.3), l1 = LS(ctx, 1, 2.3), also = WT(ctx, 1, 4, 3.0), stamp = WT(ctx, 1, 5, 3.3), engine = WT(ctx, 1, 8, 4.0), block = WT(ctx, 1, 9, 4.3);
      const V = { x: 400, y: 1540, s: 0.92 };
      return E.cine.shot(ctx, {
        set: 'ts33_garage', grade: 'cold',
        cam: { keys: [{ at: 0, x: -20, y: 30, z: 1.0 }, { at: l1 - 0.2, x: 20, y: 60, z: 1.06, dur: 1.2 }], handheld: 1.0 },
        shake: [{ at: engine, amp: 3 }],
        // the technician works on the far side of the SUV, seen above its body (at the windscreen, then over the open engine
        // bay, so the lifted hood and the stamped strip stay in view); the agent stands in front, by the rear
        figures: [
          { id: 'ts33_tech', x: 560, y: 1480, scale: 0.8, dir: 1, turn: 0.5, pose: 'examine', expr: 'focused', depth: 0.96, gaze: [0.6, -0.4],
            walk: { from: 560, to: 770, at: l1 - 0.1, dur: Math.max(0.5, stamp - l1), cadence: 6.0 },
            keys: [{ at: dash, pose: 'examine', expr: 'focused', gaze: [0.3, 0.6], dur: 0.4 }, { at: gone, pose: 'stand_tense', expr: 'realise', gaze: [0.3, 0.4], dur: 0.4 }, { at: l1 - 0.1, pose: 'walk', expr: 'focused', dur: 0.3 },
              { at: stamp, pose: 'torch_low', expr: 'focused', gaze: [0.6, 0.5], dur: 0.4 }, { at: engine, pose: 'examine', expr: 'realise', gaze: [0.6, 0.5], dur: 0.4 }] },
          { id: 'agent_a', x: 200, y: 1770, scale: 0.9, dir: 1, turn: 0.5, pose: 'stand', expr: 'focused', depth: 1.03, gaze: [0.8, -0.2], keys: [{ at: vin0, pose: 'stand_tense', dur: 0.4 }, { at: also, pose: 'point', expr: 'determined', dur: 0.4 }, { at: block + 0.3, pose: 'stand', expr: 'determined', dur: 0.4 }] }
        ],
        props: [{ depth: 1.0, svg: tt => suvSide(V.x, V.y, V.s, tt, { hood: seg(tt, stamp - 0.2, stamp + 0.5), glow: 0.9 * seg(tt, engine - 0.1, engine + 0.3) }) }],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.1, x: 60, y: 432, text: 'A POLICE GARAGE · THE SUV', fs: 40, sub: 'The dashboard VIN had been removed' },
          { type: 'card', at: stamp - 0.1, x: 60, y: 390, w: 760, rows: [{ text: 'VIN · VEHICLE IDENTIFICATION NUMBER', fs: 24, colour: MUTE }, { text: 'STAMPED ON THE ENGINE BLOCK', fs: 44, colour: RED, at: engine - 0.1 }, { text: 'IT NAMED THE REGISTERED OWNER', fs: 28, at: block + 0.3 }] }
        ],
        tag: TAG
      });
    },

    // 5 - the clue chain in the task-force room: the Craigslist seller, the prepaid phone, a name (cards)
    ts33_trail(ctx) {
      const t = ctx.t, craig = WT(ctx, 0, 1, 0.3), sell = WT(ctx, 0, 2, 0.8), prep = WT(ctx, 0, 5, 1.6), phone = WT(ctx, 0, 6, 2.0), name = WT(ctx, 0, 10, 3.0), fais = WT(ctx, 0, 11, 3.3);
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: {}, grade: 'cold', dust: true,
        cam: { from: { x: 20, y: -20, z: 1.04 }, to: { x: -30, y: -40, z: 1.12 }, handheld: 0.8 },
        figures: [
          { id: 'analyst', x: 220, y: 1610, scale: 0.92, dir: 1, turn: 0.55, pose: 'sit_read', expr: 'focused', keys: [{ at: craig, pose: 'examine', dur: 0.4 }, { at: prep, pose: 'read', dur: 0.4 }, { at: name, pose: 'point', expr: 'realise', gaze: [0.6, -0.3], dur: 0.5 }] },
          { id: 'agent_a', x: 860, y: 1740, scale: 0.96, dir: -1, turn: 0.45, pose: 'stand', expr: 'focused', keys: [{ at: sell, pose: 'point', dur: 0.4 }, { at: phone, pose: 'stand_tense', dur: 0.4 }, { at: fais, pose: 'stand', expr: 'determined', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'card', at: craig - 0.1, x: 60, y: 390, w: 760, rows: [{ text: 'THE OWNER HAD SOLD IT FOR CASH', fs: 28, colour: MUTE }, { text: 'A CRAIGSLIST AD · NO PAPERWORK', fs: 38, colour: RED, at: craig }, { text: 'THE BUYER HAD CALLED FROM A PREPAID PHONE', fs: 26, at: prep }, { text: 'FAISAL SHAHZAD · 30 · A U.S. CITIZEN', fs: 32, at: fais - 0.05 }] }
        ],
        tag: TAG
      });
    },

    // 6 - the irony beat: an airport gate at night. On the no-fly list that day (card); on the second line the silhouette
    //     walks across the gate area to the boarding door; the airline's copy of the list had not been updated (card)
    ts33_gate(ctx) {
      const t = ctx.t, put = WT(ctx, 0, 2, 0.4), nofly = WT(ctx, 0, 5, 1.1), list = WT(ctx, 0, 6, 1.4), l1 = LS(ctx, 1, 2.4), night = WT(ctx, 1, 1, 2.7), board = WT(ctx, 1, 3, 3.3), dubai = WT(ctx, 1, 7, 4.3), any = WT(ctx, 1, 8, 4.7);
      return E.cine.shot(ctx, {
        set: 'ts33_gate', grade: 'night',
        cam: { keys: [{ at: 0, x: -40, y: 0, z: 1.0 }, { at: board - 0.3, x: 40, y: 20, z: 1.1, dur: 1.6 }], handheld: 1.0 },
        figures: [
          { id: 'official', x: 850, y: 1420, scale: 0.6, dir: -1, turn: 0.3, pose: 'sit', noChair: true, depth: 0.9, keys: [{ at: board, pose: 'read', dur: 0.5 }, { at: any, pose: 'sit', dur: 0.4 }] },
          { id: 'ts33_shahzad', x: 880, y: 1700, scale: 0.82, dir: 1, turn: 0.5, pose: 'walk', silhouette: 'cool', show: [l1 - 0.2],
            walk: { from: 360, to: 880, at: night, dur: Math.max(0.8, any - night), cadence: 6.0 },
            keys: [{ at: any + 0.1, pose: 'stand', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.1, x: 60, y: 432, text: 'JFK AIRPORT, NEW YORK', fs: 40, sub: 'Monday 3 May 2010 · late evening' },
          { type: 'card', at: nofly - 0.1, x: 60, y: 390, w: 760, rows: [{ text: 'ADDED TO THE NO-FLY LIST THAT DAY', fs: 34, colour: RED }, { text: "THE AIRLINE'S COPY OF THE LIST: NOT YET UPDATED", fs: 24, colour: MUTE, at: l1 + 0.2 }, { text: 'TICKET BOOKED ON THE WAY · PAID IN CASH', fs: 24, at: dubai }] }
        ],
        tag: LIKENESS
      });
    },

    // 7 - THE HOW: the cabin. The silhouette sits in a left-hand seat; the cabin lurches on "called" (the plane turns back);
    //     two agents come down the aisle on "It was called back"; on "taken off" he stands and is led away (hands behind).
    //     Music drop on this scene.
    ts33_cabin(ctx) {
      const t = ctx.t, plane = WT(ctx, 0, 1, 0.3), left = WT(ctx, 0, 3, 0.8), gate = WT(ctx, 0, 5, 1.3), it = WT(ctx, 0, 6, 1.6), called = WT(ctx, 0, 8, 2.1), back = WT(ctx, 0, 9, 2.4), l1 = LS(ctx, 1, 3.4), taken = WT(ctx, 1, 2, 3.9), off = WT(ctx, 1, 3, 4.2), plane2 = WT(ctx, 1, 5, 4.7);
      return E.cine.shot(ctx, {
        set: 'ts33_cabin', grade: 'warm',
        cam: { keys: [{ at: 0, x: 0, y: 0, z: 1.0 }, { at: called - 0.2, x: -20, y: 20, z: 1.1, dur: 1.0 }], handheld: 1.4 },
        shake: [{ at: called, amp: 5 }, { at: taken, amp: 3 }],
        // the silhouette sits in an aisle seat of a middle row (between the far and the near seat layers); the agents come
        // down the aisle to him
        figures: [
          { id: 'ts33_shahzad', x: 410, y: 1400, scale: 0.52, dir: 1, turn: 0.4, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.6,
            keys: [{ at: gate, pose: 'sit_slumped', dur: 0.4 }, { at: called, pose: 'sit', dur: 0.3 }, { at: taken - 0.1, pose: 'stand', dur: 0.4 }, { at: off + 0.2, pose: 'hands_behind', dur: 0.5 }] },
          { id: 'agent_a', x: 560, y: 1790, scale: 0.86, dir: -1, turn: 0.5, pose: 'walk', expr: 'determined', show: [it - 0.2],
            walk: { from: 1000, to: 560, at: it, dur: Math.max(0.8, taken - it - 0.2), cadence: 6.4 },
            keys: [{ at: taken, pose: 'point', expr: 'stern', gaze: [-0.8, -0.1], dur: 0.4 }, { at: plane2, pose: 'stand', dur: 0.4 }] },
          { id: 'agent_b', x: 720, y: 1640, scale: 0.7, dir: -1, turn: 0.5, pose: 'walk', expr: 'focused', depth: 0.9, show: [called - 0.1],
            walk: { from: 1100, to: 720, at: called, dur: Math.max(0.8, off - called), cadence: 6.4 },
            keys: [{ at: off, pose: 'stand_tense', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.1, x: 60, y: 432, text: 'A FLIGHT TO DUBAI', fs: 40, sub: 'Pushed back from the gate · taxiing' },
          { type: 'card', at: called - 0.1, x: 60, y: 390, w: 760, rows: [{ text: 'CALLED BACK TO THE GATE', fs: 40, colour: RED }, { text: 'TAKEN OFF THE PLANE · ARRESTED', fs: 30, at: taken - 0.05 }, { text: 'ABOUT 53 HOURS AFTER THE SMOKE', fs: 30, colour: YEL, at: plane2 }] }
        ],
        tag: LIKENESS
      });
    },

    // 8 - the outcome: the guilty plea to all ten counts (June 2010); life in prison (October 2010)
    ts33_verdict(ctx) {
      const plead = WT(ctx, 0, 1, 0.3), guilty = WT(ctx, 0, 2, 0.6), ten = WT(ctx, 0, 5, 1.4), counts = WT(ctx, 0, 6, 1.7), l1 = LS(ctx, 1, 2.7), life = WT(ctx, 1, 2, 3.2), prison = WT(ctx, 1, 4, 3.8);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.1 }, handheld: 0.5 },
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.33, keys: [{ at: guilty - 0.3, pose: 'gavel', dur: 0.3 }, { at: guilty + 0.15, pose: 'sit', dur: 0.15 }, { at: l1, pose: 'sit_read', dur: 0.5 }] },
          { id: 'ts33_shahzad', x: 840, y: 1770, scale: 0.95, dir: -1, turn: 0.15, pose: 'stand', silhouette: 'cool', keys: [{ at: plead, pose: 'hands_together', dur: 0.4 }, { at: life, pose: 'bowed', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'card', at: 0.15, x: 40, y: 860, w: 720, rows: [{ text: 'JUNE 2010 · GUILTY PLEA, ALL 10 COUNTS', fs: 30, colour: RED, at: plead - 0.05 }, { text: 'NO PLEA DEAL', fs: 24, colour: MUTE, at: counts }, { text: 'OCTOBER 2010 · LIFE IN PRISON', fs: 36, at: life - 0.05 }] }
        ],
        tag: LIKENESS
      });
    },

    // 9 - callback on the hero object (the first frame's framing): the SUV with its hazards blinking, a wisp of smoke, the
    //     vendor at his stall. The small label sits at y 760 (outside the end-question band); the engine burns the end question
    //     over the last 3.2 s at y 520, so nothing of ours sits in y 380-720; the last frame loops to the first.
    ts33_end(ctx) {
      const t = ctx.t, rem = WT(ctx, 0, 1, 0.4), vin = WT(ctx, 0, 3, 1.0), l1 = LS(ctx, 1, 2.6), eng = WT(ctx, 1, 1, 2.9), kept = WT(ctx, 1, 2, 3.2), other = WT(ctx, 1, 4, 3.8);
      return E.cine.shot(ctx, {
        set: 'ts33_square', setOpts: {}, grade: 'cold',
        cam: { from: { x: 0, y: 70, z: 1.08 }, to: { x: 0, y: 40, z: 1.0 }, handheld: 0.6 },
        figures: [{ id: 'ts33_vendor', x: 150, y: 1600, scale: 0.6, dir: 1, turn: 0.5, pose: 'stand_tense', expr: 'worried', depth: 1.02, gaze: [0.7, -0.3],
          keys: [{ at: rem, pose: 'point', expr: 'focused', dur: 0.4 }, { at: eng, pose: 'stand', expr: 'neutral', dur: 0.4 }, { at: other + 0.2, pose: 'hands_together', expr: 'relieved', dur: 0.6 }] }],
        props: [
          { depth: 1.0, svg: tt => suvFront(HERO.x, HERO.y, HERO.s, tt, { smoke: 0.3, glow: 0.8 * seg(tt, vin - 0.2, vin + 0.2) * (1 - seg(tt, eng + 0.4, eng + 1.0)) }) },
          { depth: 1.03, svg: tt => stall(150, 1640, 0.56) }
        ],
        overlays: [{ type: 'label', at: eng - 0.1, x: 60, y: 760, text: 'ONE VIN REMOVED · ONE STAMPED ON THE ENGINE', fs: 30 }],
        tag: STREET
      });
    }
  });
})();
