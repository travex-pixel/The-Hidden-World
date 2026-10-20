/* Case File 90 (premium look, ENGINE V7: promise -> proof -> escalate -> callback, the loop, THE 28-SECOND CUT, the
   impossible frame 0): THEY STOLE WHAT?, 1.
   HEADLINE: North Beaver Township, Lawrence County, Pennsylvania, late Sept-early Oct 2011: state police say a 50-foot
   steel bridge (Covert's Crossing, valued at about $100,000) was cut apart with a torch and hauled away; two New Castle
   brothers were charged after a recycling company called police: one had shown an employee photos of the bridge on his
   phone; the complaint says they sold 31,000 lb of steel for $5,179. CHARGED only (no plea, verdict or sentence found):
   silhouettes, never named, "police say". The callback: worth a hundred grand, they got five thousand.
   CASE 2: Coral Spring, Trelawny, Jamaica, July 2008: an estimated 500 truckloads of sand vanished from a planned
   resort's beach; police sampled rival beaches to match it; three months on, no sand and no suspects. Nobody named.
   CASE 3 (best last): Chilean Patagonia, Feb 2012: a refrigerated truck stopped for a routine traffic violation held
   about five tonnes of ice from the Jorge Montt glacier, reportedly bound for Santiago bars as cocktail ice; the driver
   was charged with theft (accused only, silhouette).
   Structure: frame 0 = THE IMPOSSIBLE PICTURE: a steel bridge over a creek at night MISSING ITS MIDDLE (a gap over a
   third of the span, the cut ends glowing, the far stub hanging), the flatbed below already carrying that section and
   pulling away, the cutter on the remaining stub with the torch, sparks pouring into the creek, the camera pushing in. Then the gotcha (the
   scrapyard office: the phone with the bridge photo, the yard man lifts the desk phone: the impact; the 81 % counter),
   case 2 (the beach at night: a dump truck and a shoveller by the scooped-out sand; the rival resort by day: the officer
   scoops a sample jar), case 3 (the gravel road: the police pickup behind the box truck; the rear doors swing open on
   glowing ice: the music drop; the fun fact) and the callback on frame 1's creek (the torch flares and settles, the
   camera eases back to frame 1's start) with the end card.
   Smoothness: cuts and dissolves, one push (into case 3), one zoom (the end); one slow camera move per shot; no shake,
   no handheld, one impact. Screen direction: the suspects face RIGHT; officers enter from the right.
   Look: episode.look = 'premium', one cool night palette (shadow #0c1a24, mid #b8b3a4, accent #f0a640). The strongly
   coloured thing in each shot carries accent: true (the torch and sparks, the phone screen, the beacon, the sample jar,
   the light bar, the ice glow).
   Content rules: the phone screen shows only our own drawn bridge thumbnail; signs and vehicles carry plain type and no
   company, force or brand marking; the three accused men are dark silhouettes tagged NOT A LIKENESS and never named;
   the sand loader is an anonymous generic silhouette; the yard man and the officers are generic figures. No weapon, no
   force beyond hands behind the back, no victim shown.
   New environments (E.registerSets): sb90_creek (the wooded creek with the half-cut bridge and the flatbed), sb90_yard
   (a scrapyard office at night), sb90_beach_night (a beach at night with a dump truck and a scooped-out hole),
   sb90_resort (a resort beach by day), sb90_road (a Patagonian gravel road with the box truck and a police pickup),
   sb90_doors (the rear of the box truck, doors opening on the ice). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#0e1218';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · NOT A LIKENESS';
  const GEN = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#f0a640';
  const TYPE = 'font-family="Nunito" font-weight="800"';
  const flashAt = (tt, a) => (tt >= a && tt < a + 0.45 ? Math.pow(1 - (tt - a) / 0.45, 2) : 0);

  // ---------- the bridge geometry (shared by the set and the hero props so the loop frames match)
  const DECK = { x0: 40, x1: 1040, y: 1000, th: 24, gird: 78, gapL: 400, gapR: 760 };   // the middle of the span is GONE: gapL..gapR
  const CUT = { x: DECK.gapL, y: DECK.y + DECK.th + DECK.gird * 0.5 };    // where the torch bites (the left stub's cut face)
  const SAG = 5;                                                           // the far stub hangs: degrees about the right abutment
  const WATER = { y0: 1210, y1: 1330 };

  // steel grating: a hatched band (x, y, w, h)
  function grating(x, y, w, h, col = '#5a6470') {
    let g = `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="#2e3640" stroke="${INK}" stroke-width="4"/>`;
    for (let i = 0; i < w; i += 16) g += `<rect x="${f1(x + i + 4)}" y="${f1(y + 3)}" width="5" height="${f1(h - 6)}" fill="${col}" opacity="0.9"/>`;
    g += `<path d="M${f1(x)} ${f1(y + h / 2)} L${f1(x + w)} ${f1(y + h / 2)}" stroke="${col}" stroke-width="3" opacity="0.6"/>`;
    return g;
  }
  // a jagged cut edge, vertical, from (x, y0) to (x, y1); k 0..1 the glow
  function cutEdge(x, y0, y1, k) {
    let d = `M${f1(x)} ${f1(y0)}`; const n = 7; const r = R(9001);
    for (let i = 1; i <= n; i++) d += ` L${f1(x + (r() - 0.5) * 18)} ${f1(y0 + (y1 - y0) * i / n)}`;
    return `<path d="${d}" fill="none" stroke="#ffd9a0" stroke-width="7" opacity="${f1(0.55 + 0.45 * k)}"/><path d="${d}" fill="none" stroke="#fff4dc" stroke-width="3" opacity="${f1(0.5 + 0.5 * k)}"/>`;
  }
  // a steel bent (pier) from the girder down to the water: X-braced
  function bent(x, y0, y1) {
    const w = 70;
    let g = `<rect x="${f1(x - w / 2)}" y="${f1(y0)}" width="16" height="${f1(y1 - y0)}" fill="#3a4450" stroke="${INK}" stroke-width="4"/><rect x="${f1(x + w / 2 - 16)}" y="${f1(y0)}" width="16" height="${f1(y1 - y0)}" fill="#3a4450" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M${f1(x - w / 2)} ${f1(y0)} L${f1(x + w / 2)} ${f1(y1)} M${f1(x + w / 2)} ${f1(y0)} L${f1(x - w / 2)} ${f1(y1)}" stroke="#4a5562" stroke-width="7"/>`;
    g += `<rect x="${f1(x - w / 2 - 18)}" y="${f1(y1 - 10)}" width="${f1(w + 36)}" height="26" fill="#6a6a62" stroke="${INK}" stroke-width="4"/>`;
    return g;
  }
  // the flatbed truck on the near bank, already carrying the MISSING SECTION (a deck-length of grating and the girder
  // with both cut ends glowing), pulling away to the right (dx); nose to the RIGHT (generic, blank plate)
  function flatbed(glow, dx = 0) {
    let g = `<g transform="translate(${f1(700 + dx)} 1430)">`;
    g += `<ellipse cx="20" cy="8" rx="340" ry="22" fill="#000" opacity="0.5"/>`;
    g += `<rect x="-310" y="-96" width="420" height="26" fill="#2a2e34" stroke="${INK}" stroke-width="5"/>`;                   // the bed
    g += `<rect x="-310" y="-70" width="420" height="30" fill="#1e2226" stroke="${INK}" stroke-width="4"/>`;                   // the chassis
    g += `<path d="M110 -70 L110 -230 Q110 -250 130 -250 L220 -250 L262 -170 L270 -70 Z" fill="#3a4a5e" stroke="${INK}" stroke-width="5"/>`; // the cab
    g += `<path d="M130 -236 L212 -236 L246 -170 L130 -170 Z" fill="#111820"/>`;                                           // the windscreen
    g += `<rect x="190" y="-120" width="54" height="22" rx="4" fill="#e4e2da" stroke="${INK}" stroke-width="3"/>`;            // a blank plate
    g += `<circle cx="-240" cy="-14" r="40" fill="#0c0d10" stroke="${INK}" stroke-width="5"/><circle cx="-150" cy="-14" r="40" fill="#0c0d10" stroke="${INK}" stroke-width="5"/><circle cx="200" cy="-14" r="40" fill="#0c0d10" stroke="${INK}" stroke-width="5"/>`;
    g += `<circle cx="-240" cy="-14" r="14" fill="#3a3e46"/><circle cx="-150" cy="-14" r="14" fill="#3a3e46"/><circle cx="200" cy="-14" r="14" fill="#3a3e46"/>`;
    g += `<ellipse cx="282" cy="-128" rx="12" ry="10" fill="#ffe9b0"/>` + wash(440, -150, 180, 60, '#ffd090', 0.16);           // the headlamp, on
    g += `<ellipse cx="-330" cy="-40" rx="26" ry="14" fill="#9aa0a8" opacity="0.35"/><ellipse cx="-368" cy="-56" rx="34" ry="18" fill="#9aa0a8" opacity="0.2"/>`;   // exhaust
    // the load: the missing section (gapR - gapL wide) of grating and the girder, cut ends glowing at both ends
    const L = DECK.gapR - DECK.gapL;
    g += `<rect x="-286" y="-170" width="${L - 20}" height="${DECK.gird * 0.9}" fill="#2a323c" stroke="${INK}" stroke-width="4"/><rect x="-286" y="-160" width="${L - 20}" height="8" fill="#48525e"/><rect x="-286" y="${-170 + DECK.gird * 0.9 - 14}" width="${L - 20}" height="8" fill="#48525e"/>`;
    g += `<g transform="translate(-300 -176) rotate(-4)">${grating(0, -40, L, 36)}</g>`;
    g += `<rect x="-292" y="-172" width="14" height="${DECK.gird * 0.9}" fill="#ffc06a" opacity="${f1(0.6 + 0.4 * glow)}"/><rect x="${-290 + L - 24}" y="-172" width="14" height="${DECK.gird * 0.9}" fill="#ffc06a" opacity="${f1(0.6 + 0.4 * glow)}"/>` + wash(-290 + L / 2, -190, L * 0.6, 90, '#ff9a3a', f1(0.12 * glow));
    g += `</g>`;
    return g;
  }
  // THE HERO LIGHT: the torch flame at the kneeling figure's hands and the glow on the cut face. o.k 0..1 the flare
  const HAND = { x: 378, y: 938 };
  function torchFire(t, o = {}) {
    const k = o.k ?? 0.5, fl = 0.75 + 0.25 * Math.sin(t * 23) * Math.sin(t * 7.3), a = 0.6 + 0.4 * k;
    let g = wash(CUT.x, CUT.y, 360 + 120 * k, 260 + 80 * k, '#ff9a3a', f1(0.26 * a * fl)) + wash(CUT.x, CUT.y, 180, 140, '#ffe2b0', f1(0.3 * a * fl));
    // the torch body in the hands and the flame cone to the cut face
    g += `<path d="M${f1(HAND.x - 26)} ${f1(HAND.y - 6)} L${f1(HAND.x + 10)} ${f1(HAND.y + 14)}" stroke="#3a4048" stroke-width="12" stroke-linecap="round"/>`;
    g += `<path d="M${f1(HAND.x + 10)} ${f1(HAND.y + 14)} L${f1(CUT.x - 8)} ${f1(CUT.y - 10)} L${f1(CUT.x - 8)} ${f1(CUT.y + 10)} Z" fill="#9ad4ff" opacity="${f1(0.8 * fl)}"/>`;
    g += `<path d="M${f1(HAND.x + 10)} ${f1(HAND.y + 14)} L${f1(CUT.x - 10)} ${f1(CUT.y - 3)} L${f1(CUT.x - 10)} ${f1(CUT.y + 3)} Z" fill="#ffffff" opacity="${f1(0.9 * fl)}"/>`;
    g += `<circle cx="${f1(CUT.x - 4)}" cy="${f1(CUT.y)}" r="${f1(16 + 10 * k * fl)}" fill="#fff6e0" opacity="${f1(0.95 * fl)}"/>`;
    g += `<circle cx="${f1(CUT.x - 4)}" cy="${f1(CUT.y)}" r="${f1(40 + 20 * k)}" fill="#ffb24a" opacity="${f1(0.45 * fl)}"/>`;
    g += cutEdge(DECK.gapL, DECK.y - 2, DECK.y + DECK.th + DECK.gird, fl * a);
    // the far stub's cut face, still warm (it hangs: rotated like the stub)
    g += `<g transform="rotate(${SAG} ${DECK.x1} ${DECK.y})">${cutEdge(DECK.gapR, DECK.y - 2, DECK.y + DECK.th + DECK.gird, 0.35)}</g>` + wash(DECK.gapR + 10, CUT.y + 30, 140, 110, '#ff9a3a', f1(0.12 * fl));
    // the spark streaks: thrown from the cut face, arcing down into the creek (bigger than the atmos specks so they
    // read at thumbnail size); deterministic, time-driven
    const r = R(9077); let sp = '';
    for (let i = 0; i < 26; i++) {
      const life = 0.45 + r() * 0.5, ph = r() * life, vx = 60 + r() * 420, vy = -(40 + r() * 260), u = ((t + ph) % life) / life, tt = u * life;
      const x = CUT.x + vx * tt, y = CUT.y + vy * tt + 1500 * tt * tt, x2 = x - vx * 0.05, y2 = y - (vy + 3000 * tt) * 0.05;
      if (y > WATER.y0 + 40) continue;
      sp += `<path d="M${f1(x2)} ${f1(y2)} L${f1(x)} ${f1(y)}" stroke="${i % 3 ? '#ffc46a' : '#fff1c8'}" stroke-width="${f1(3.5 * (1 - u) + 1.5)}" stroke-linecap="round" opacity="${f1(0.95 * (1 - u * 0.7))}"/>`;
    }
    g += `<g style="mix-blend-mode:screen">${sp}</g>`;
    // the reflection on the water
    g += wash(CUT.x + 60, 1265, 300, 55, '#ff9a3a', f1(0.22 * a * fl)) + `<path d="M${f1(CUT.x - 80)} 1240 L${f1(CUT.x + 200)} 1240 M${f1(CUT.x - 50)} 1266 L${f1(CUT.x + 160)} 1266 M${f1(CUT.x - 20)} 1292 L${f1(CUT.x + 120)} 1292" stroke="#ffc270" stroke-width="5" opacity="${f1(0.4 * a * fl)}"/>`;
    return g;
  }
  // a generic phone held up, screen to camera, with our own drawn bridge thumbnail on it: top-left (x, y), size w x h
  function phoneBridge(x, y, w, h, lit = 1) {
    const rx = w * 0.14;
    let g = wash(x + w / 2, y + h / 2, w * 1.3, h * 0.9, '#ffd9a0', f1(0.18 * lit));
    g += `<rect x="${f1(x - w * 0.045)}" y="${f1(y - w * 0.045)}" width="${f1(w * 1.09)}" height="${f1(h + w * 0.09)}" rx="${f1(rx)}" fill="#1a1e26" stroke="${INK}" stroke-width="6"/>`;
    g += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(rx * 0.7)}" fill="#1c2a3a" opacity="${f1(lit)}"/>`;
    // the thumbnail: a sky band, a creek band and the truss bridge across the middle
    g += `<g opacity="${f1(lit)}"><rect x="${f1(x + w * 0.08)}" y="${f1(y + h * 0.12)}" width="${f1(w * 0.84)}" height="${f1(h * 0.5)}" fill="#8fb3c8"/><rect x="${f1(x + w * 0.08)}" y="${f1(y + h * 0.5)}" width="${f1(w * 0.84)}" height="${f1(h * 0.12)}" fill="#4a6a5a"/>`;
    g += `<rect x="${f1(x + w * 0.08)}" y="${f1(y + h * 0.34)}" width="${f1(w * 0.84)}" height="${f1(h * 0.05)}" fill="#3a4450"/>`;
    for (let i = 0; i < 6; i++) g += `<path d="M${f1(x + w * (0.1 + i * 0.14))} ${f1(y + h * 0.34)} L${f1(x + w * (0.17 + i * 0.14))} ${f1(y + h * 0.24)} L${f1(x + w * (0.24 + i * 0.14))} ${f1(y + h * 0.34)}" fill="none" stroke="#3a4450" stroke-width="${f1(w * 0.02)}"/>`;
    g += `<path d="M${f1(x + w * 0.1)} ${f1(y + h * 0.24)} L${f1(x + w * 0.92)} ${f1(y + h * 0.24)}" stroke="#3a4450" stroke-width="${f1(w * 0.02)}"/>`;
    g += `<rect x="${f1(x + w * 0.1)}" y="${f1(y + h * 0.7)}" width="${f1(w * 0.5)}" height="${f1(h * 0.04)}" rx="3" fill="#8a97a8"/><rect x="${f1(x + w * 0.1)}" y="${f1(y + h * 0.78)}" width="${f1(w * 0.3)}" height="${f1(h * 0.04)}" rx="3" fill="#8a97a8"/></g>`;
    g += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(rx * 0.7)}" fill="#fff" opacity="${f1(0.05 * lit)}"/>`;
    return g;
  }
  // a sample jar with an amber lid and a plain label (the accent in the resort shot): centre-bottom (x, y), height h
  function jar(x, y, h, fill = 0) {
    const w = h * 0.7;
    let g = `<rect x="${f1(x - w / 2)}" y="${f1(y - h)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(w * 0.12)}" fill="#dce8f0" opacity="0.35" stroke="${INK}" stroke-width="4"/>`;
    if (fill > 0) g += `<rect x="${f1(x - w / 2 + 4)}" y="${f1(y - h * 0.55 * fill - 4)}" width="${f1(w - 8)}" height="${f1(h * 0.55 * fill)}" fill="#e8dcc0"/>`;
    g += `<rect x="${f1(x - w / 2 - 4)}" y="${f1(y - h - h * 0.14)}" width="${f1(w + 8)}" height="${f1(h * 0.16)}" rx="4" fill="${ACC}" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="${f1(x - w * 0.36)}" y="${f1(y - h * 0.5)}" width="${f1(w * 0.72)}" height="${f1(h * 0.26)}" fill="#f4f0e6" stroke="${INK}" stroke-width="2"/><rect x="${f1(x - w * 0.28)}" y="${f1(y - h * 0.42)}" width="${f1(w * 0.5)}" height="4" fill="#8a8a80"/><rect x="${f1(x - w * 0.28)}" y="${f1(y - h * 0.34)}" width="${f1(w * 0.34)}" height="4" fill="#8a8a80"/>`;
    return g;
  }
  // a block of glacier ice (x, y top-left, w, h) with a cool glow
  function iceBlock(x, y, w, h, glow) {
    let g = `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="10" fill="#bfe0f4" stroke="#7fb4d4" stroke-width="4" opacity="${f1(0.85 + 0.15 * glow)}"/>`;
    g += `<path d="M${f1(x + w * 0.2)} ${f1(y + 8)} L${f1(x + w * 0.45)} ${f1(y + h * 0.5)} L${f1(x + w * 0.3)} ${f1(y + h - 8)}" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.7"/>`;
    g += `<rect x="${f1(x + 8)}" y="${f1(y + 8)}" width="${f1(w * 0.3)}" height="${f1(h * 0.25)}" rx="6" fill="#fff" opacity="${f1(0.35 + 0.3 * glow)}"/>`;
    return g;
  }

  // the hero figure (the same in the hook and the end scene: the loop) and the camera it loops on
  const HERO_FIG = { id: 'sb90_cutter', x: 318, y: DECK.y + 6, scale: 0.42, dir: 1, turn: 0.4, pose: 'torch_low', propOverride: null, silhouette: 'cool', depth: 1.0 };
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 0, y: -14, z: 1.09 };

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // the wooded creek at night: stars and a moon, tree lines on both banks, the bridge with its far third gone (the
    // deck, the near girder, the far rail, two steel bents, a concrete abutment at each end), the creek, the near bank
    // with a dirt track, the flatbed with the cut section, a knocked-over "BRIDGE CLOSED" barrier. o.glow 0..1
    sb90_creek(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), glow = o.glow ?? 0.5, dx = o.dx || 0;
      let sky = `<defs><linearGradient id="sb90sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050a16"/><stop offset="1" stop-color="#14203a"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#sb90sk)"/>` + E.cine.stars(t, 70, 9011, -200, 700) + `<circle cx="220" cy="300" r="40" fill="#f3ecd8" opacity="0.9"/><circle cx="220" cy="300" r="130" fill="#f3ecd8" opacity="0.05"/>`;
      // the tree lines (far), the far bank down to the water
      const r = R(9012); let trees = '';
      for (let x = -300; x < W + 300; x += 44) { const h = 180 + r() * 220; trees += `<path d="M${x} 900 L${x + 22} ${f1(900 - h)} L${x + 44} 900 Z" fill="#0d1a22"/>`; }
      trees += `<rect x="-400" y="880" width="${W + 800}" height="${WATER.y0 - 880 + 10}" fill="#16231c"/>` + wash(540, 840, 900, 200, '#1e3a4a', 0.2);
      const Y = DECK.y, TH = DECK.th, GD = DECK.gird, L0 = DECK.x0, L1 = DECK.gapL, R0 = DECK.gapR, R1 = DECK.x1;
      // a stub of the bridge from xa to xb: the far rail, the grating, the near girder with its rivets
      const rail = (xa, xb) => { let g = ''; for (let x = xa + 30; x < xb - 10; x += 110) g += `<rect x="${x}" y="${Y - 70}" width="12" height="70" fill="#3a4450" stroke="${INK}" stroke-width="3"/>`;
        return g + `<rect x="${xa + 20}" y="${Y - 74}" width="${xb - xa - 36}" height="10" fill="#4a5562" stroke="${INK}" stroke-width="3"/><rect x="${xa + 20}" y="${Y - 40}" width="${xb - xa - 36}" height="6" fill="#4a5562"/>`; };
      const stub = (xa, xb) => { let g = grating(xa, Y, xb - xa, TH) + `<rect x="${xa}" y="${Y + TH}" width="${xb - xa}" height="${GD}" fill="#2a323c" stroke="${INK}" stroke-width="5"/>`;
        g += `<rect x="${xa}" y="${Y + TH + 8}" width="${xb - xa}" height="8" fill="#48525e"/><rect x="${xa}" y="${Y + TH + GD - 16}" width="${xb - xa}" height="8" fill="#48525e"/>`;
        for (let x = xa + 20; x < xb - 10; x += 40) g += `<circle cx="${x}" cy="${Y + TH + GD / 2}" r="4" fill="#48525e"/>`; return g; };
      const hang = `transform="rotate(${SAG} ${R1} ${Y})"`;   // the far stub hangs from the right abutment
      let railL = rail(L0, L1) + `<g ${hang}>${rail(R0, R1)}</g>`;
      // the abutments, the bents (the middle one bare under the gap), the two stubs; the bare bent's cap glows faintly
      let bridge = `<rect x="-60" y="${Y - 30}" width="120" height="${TH + GD + 60}" fill="#6a6a62" stroke="${INK}" stroke-width="5"/><rect x="${R1 - 20}" y="${Y - 30}" width="140" height="${TH + GD + 60}" fill="#6a6a62" stroke="${INK}" stroke-width="5"/>`;
      bridge += bent(220, Y + TH + GD, WATER.y0) + bent(580, Y + TH + GD - 4, WATER.y0) + bent(900, Y + TH + GD + 30, WATER.y0);
      bridge += `<rect x="${560}" y="${Y + TH + GD - 18}" width="40" height="14" fill="#c08a4a" opacity="0.7"/>`;
      bridge += stub(L0, L1) + `<g ${hang}>${stub(R0, R1)}</g>`;
      // the creek: dark water with slow ripples and the moon's broken reflection, seen THROUGH the gap
      let water = `<rect x="-400" y="${WATER.y0}" width="${W + 800}" height="${WATER.y1 - WATER.y0}" fill="#0b1620"/>`;
      for (let i = 0; i < 9; i++) { const y = WATER.y0 + 12 + i * 12, ph = Math.sin(t * 0.8 + i) * 30; water += `<path d="M-400 ${y} Q${200 + ph} ${y - 4} ${600 + ph} ${y} T${W + 400} ${y}" fill="none" stroke="#1d3344" stroke-width="3" opacity="0.7"/>`; }
      water += `<path d="M160 ${WATER.y0 + 22} L300 ${WATER.y0 + 22} M190 ${WATER.y0 + 46} L270 ${WATER.y0 + 46} M210 ${WATER.y0 + 70} L250 ${WATER.y0 + 70}" stroke="#d8d4c4" stroke-width="4" opacity="0.18"/>`;
      // the near bank: dark earth, grass tufts, a dirt track at the right, the barrier at the left, the flatbed pulling away
      const G = WATER.y1;
      let ground = `<path d="M-400 ${G + 10} Q300 ${G - 20} 700 ${G + 2} T${W + 400} ${G - 10} L${W + 400} ${H + 300} L-400 ${H + 300} Z" fill="#1a2018"/>`;
      ground += `<path d="M380 ${G + 70} Q800 ${G + 50} ${W + 400} ${G + 62} L${W + 400} ${G + 190} Q800 ${G + 170} 380 ${G + 190} Z" fill="#2a2820" opacity="0.9"/>`;
      const r2 = R(9013);
      for (let i = 0; i < 40; i++) { const x = -300 + r2() * (W + 600), y = G + 20 + r2() * 480; ground += `<path d="M${f1(x)} ${f1(y)} l-8 -22 l8 6 l8 -8 l-2 24" fill="#26361e" opacity="0.8"/>`; }
      ground += `<g transform="translate(150 ${G + 50}) rotate(-18)"><rect x="-90" y="-60" width="180" height="40" rx="4" fill="#d8d4c4" stroke="${INK}" stroke-width="4"/><text x="0" y="-32" text-anchor="middle" ${TYPE} font-size="24" fill="#3a3a3a">BRIDGE CLOSED</text><path d="M-70 -20 L-90 40 M70 -20 L90 40" stroke="#a09a88" stroke-width="8"/></g>`;
      ground += flatbed(glow, dx);
      return { light: { dir: 1, rim: '#ffb86a', key: '#c8d4e8' }, layers: [[0.05, sky], [0.3, trees], [0.9, railL], [0.97, bridge], [0.97, water], [0.98, ground]] };
    },

    // a scrapyard office at night: a wall with a plain sign, a window onto a floodlit scrap pile and a crane claw, a
    // counter with a scale readout and a desk phone (its handset is drawn in the shot), a strip light
    sb90_yard(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#2c3036"/>` + `<rect x="-400" y="700" width="${W + 800}" height="30" fill="#232830"/>`;
      wall += `<rect x="60" y="280" width="620" height="110" rx="6" fill="#3a3e44" stroke="${INK}" stroke-width="5"/><text x="370" y="356" text-anchor="middle" ${TYPE} font-size="52" letter-spacing="4" fill="#d8dce4" opacity="0.9">SCRAP · WE BUY STEEL</text>`;
      // the window: a floodlit pile of scrap, a crane claw
      wall += `<rect x="720" y="260" width="420" height="440" fill="#121820" stroke="${INK}" stroke-width="8"/>`;
      const r = R(9021); let pile = '';
      for (let i = 0; i < 40; i++) { const x = 740 + r() * 380, y = 520 + r() * 150 - (Math.abs(x - 930) / 190) * 120, w = 26 + r() * 60, h = 14 + r() * 40; pile += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="3" fill="${['#4a4e56', '#5a5048', '#3e4a52', '#6a6460'][Math.floor(r() * 4)]}" stroke="${INK}" stroke-width="2" transform="rotate(${f1((r() - 0.5) * 40)} ${f1(x)} ${f1(y)})"/>`; }
      wall += pile + `<path d="M980 260 L980 380" stroke="#2a2e34" stroke-width="10"/><path d="M940 380 Q980 330 1020 380 L1000 440 L960 440 Z" fill="#3a3e44" stroke="${INK}" stroke-width="4"/>` + wash(930, 520, 300, 240, '#ffe0a0', 0.12);
      wall += `<rect x="760" y="300" width="340" height="14" fill="#ffe9c4" opacity="0.5"/>` + wash(930, 320, 400, 80, '#ffe9c4', 0.1);
      let desk = `<rect x="-400" y="1180" width="${W + 800}" height="70" rx="6" fill="#4a4034" stroke="${INK}" stroke-width="6"/><rect x="-400" y="1250" width="${W + 800}" height="${H}" fill="#2a2620"/>`;
      desk += `<rect x="640" y="1060" width="260" height="120" rx="8" fill="#20262f" stroke="${INK}" stroke-width="5"/><rect x="660" y="1080" width="220" height="50" fill="#0f1a28"/><text x="770" y="1118" text-anchor="middle" ${TYPE} font-size="34" fill="#7ac7e8" opacity="${f1(0.6 + 0.3 * Math.sin(t * 2))}">31,000 LB</text>`;
      desk += `<rect x="960" y="1120" width="150" height="60" rx="8" fill="#3a3e46" stroke="${INK}" stroke-width="4"/>`;   // the desk phone's base (the handset is a shot prop)
      return { light: { dir: 1, rim: '#ffd9a0', key: '#e8e0d0' }, layers: [[0.25, wall], [0.92, desk]] };
    },

    // a Jamaican beach at night: a moon over the sea, the pale sand with a scooped-out hole, a dump truck (generic) at
    // the right with sand on its bed and an amber beacon (drawn in the shot), palms at the edges
    sb90_beach_night(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="sb90bk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#071020"/><stop offset="1" stop-color="#1a2a44"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1100" fill="url(#sb90bk)"/>` + E.cine.stars(t, 60, 9031, -200, 560) + `<circle cx="780" cy="330" r="46" fill="#f3ecd8" opacity="0.9"/><circle cx="780" cy="330" r="150" fill="#f3ecd8" opacity="0.05"/>`;
      let sea = `<rect x="-400" y="720" width="${W + 800}" height="260" fill="#132a3c"/>`;
      for (let i = 0; i < 8; i++) { const y = 740 + i * 30, ph = Math.sin(t * 0.7 + i) * 40; sea += `<path d="M-400 ${y} Q${300 + ph} ${y - 6} ${700 + ph} ${y} T${W + 400} ${y}" fill="none" stroke="#1f4458" stroke-width="3" opacity="0.8"/>`; }
      sea += `<path d="M700 760 L860 760 M720 800 L840 800 M740 840 L820 840" stroke="#e8e4d4" stroke-width="5" opacity="0.2"/>`;
      sea += `<path d="M-400 975 Q200 960 600 978 T${W + 400} 970 L${W + 400} 1000 L-400 1000 Z" fill="#e8ece8" opacity="0.35"/>`;   // the surf line
      // the sand (muted) with the scooped-out hole at the left
      let sand = `<rect x="-400" y="990" width="${W + 800}" height="${H}" fill="#9a9480"/>`;
      sand += `<path d="M60 1060 Q300 1010 620 1070 Q700 1180 560 1250 Q300 1300 80 1230 Q-20 1140 60 1060 Z" fill="#4a4436"/><path d="M110 1080 Q320 1040 580 1090 Q630 1170 520 1220 Q310 1260 130 1210 Q60 1140 110 1080 Z" fill="#3a3428"/>`;
      sand += `<path d="M60 1060 Q300 1010 620 1070" fill="none" stroke="#c4bca4" stroke-width="6" opacity="0.6"/>`;
      // the palms
      let palms = '';
      [[-40, 980], [1100, 960]].forEach(([x, y]) => { palms += `<path d="M${x} ${y} Q${x + 30} ${y - 300} ${x + 10} ${y - 560}" stroke="#1a2418" stroke-width="22" fill="none"/>`; for (let i = 0; i < 6; i++) palms += `<path d="M${x + 10} ${y - 560} q${f1(Math.cos(i * 1.05) * 180)} ${f1(Math.sin(i * 1.05) * 60 - 40)} ${f1(Math.cos(i * 1.05) * 260)} ${f1(Math.sin(i * 1.05) * 140 + 30)}" stroke="#1e2e1c" stroke-width="16" fill="none" stroke-linecap="round"/>`; });
      // the dump truck (generic), nose to the right, bed heaped with sand
      let truck = `<g transform="translate(860 1290)"><ellipse cx="0" cy="10" rx="280" ry="22" fill="#000" opacity="0.5"/>`;
      truck += `<path d="M-250 -80 L-250 -250 L60 -250 L80 -80 Z" fill="#5a4a30" stroke="${INK}" stroke-width="5"/><path d="M-240 -250 Q-100 -340 60 -250 Z" fill="#cfc3a8" stroke="${INK}" stroke-width="4"/>`;   // the bed and the sand heap
      truck += `<rect x="-260" y="-80" width="360" height="30" fill="#1e2226" stroke="${INK}" stroke-width="4"/>`;
      truck += `<path d="M100 -80 L100 -240 Q100 -260 120 -260 L210 -260 L250 -180 L258 -80 Z" fill="#3a4a3a" stroke="${INK}" stroke-width="5"/><path d="M120 -246 L204 -246 L236 -180 L120 -180 Z" fill="#111820"/>`;
      truck += `<circle cx="-190" cy="-14" r="42" fill="#0c0d10" stroke="${INK}" stroke-width="5"/><circle cx="-100" cy="-14" r="42" fill="#0c0d10" stroke="${INK}" stroke-width="5"/><circle cx="190" cy="-14" r="42" fill="#0c0d10" stroke="${INK}" stroke-width="5"/>`;
      truck += `<circle cx="-190" cy="-14" r="14" fill="#3a3e46"/><circle cx="-100" cy="-14" r="14" fill="#3a3e46"/><circle cx="190" cy="-14" r="14" fill="#3a3e46"/>`;
      truck += `<ellipse cx="270" cy="-130" rx="12" ry="10" fill="#ffe9b0"/>` + wash(420, -150, 170, 60, '#ffd090', 0.14) + `</g>`;
      return { light: { dir: -1, rim: '#cfe4ff', key: '#d8d4c8' }, layers: [[0.05, sky], [0.35, sea], [0.9, sand], [0.6, palms], [0.95, truck]] };
    },

    // a resort beach by day: a bright sky, the sea, two umbrellas and a lounger, a plain sign post, the sand
    sb90_resort(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="sb90dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb0cc"/><stop offset="1" stop-color="#cfe0e8"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1100" fill="url(#sb90dk)"/>`;
      sky += [[200, 300, 160], [720, 240, 200], [1000, 420, 120]].map(([x, y, r]) => `<ellipse cx="${x + Math.sin(t * 0.1) * 10}" cy="${y}" rx="${r}" ry="${r * 0.4}" fill="#fff" opacity="0.55"/>`).join('');
      let sea = `<rect x="-400" y="700" width="${W + 800}" height="300" fill="#3a8aa0"/>`;
      for (let i = 0; i < 8; i++) { const y = 720 + i * 34, ph = Math.sin(t * 0.7 + i) * 40; sea += `<path d="M-400 ${y} Q${300 + ph} ${y - 6} ${700 + ph} ${y} T${W + 400} ${y}" fill="none" stroke="#5aa8bc" stroke-width="3" opacity="0.8"/>`; }
      sea += `<path d="M-400 990 Q200 975 600 992 T${W + 400} 985 L${W + 400} 1020 L-400 1020 Z" fill="#f4f6f2" opacity="0.8"/>`;
      let sand = `<rect x="-400" y="1010" width="${W + 800}" height="${H}" fill="#d8ccac"/><path d="M-400 1100 Q300 1080 700 1110 T${W + 400} 1095" fill="none" stroke="#c8bc9c" stroke-width="4"/>`;
      // umbrellas and a lounger (muted), a sign post
      let furn = '';
      [[180, 1140, '#a84a3a'], [980, 1100, '#3a6a8a']].forEach(([x, y, c]) => { furn += `<rect x="${x - 6}" y="${y - 420}" width="12" height="420" fill="#8a7a60" stroke="${INK}" stroke-width="3"/><path d="M${x - 190} ${y - 400} Q${x} ${y - 520} ${x + 190} ${y - 400} Z" fill="${c}" stroke="${INK}" stroke-width="4"/>`; for (let i = 1; i < 4; i++) furn += `<path d="M${x} ${y - 500} L${x - 190 + i * 95} ${y - 400 + (i === 2 ? 0 : -6)}" stroke="${INK}" stroke-width="2" opacity="0.5"/>`; });
      furn += `<g transform="translate(260 1180)"><path d="M-140 0 L-100 -60 L60 -60 L140 -40 L140 0 Z" fill="#e8e4d8" stroke="${INK}" stroke-width="4"/><rect x="-130" y="0" width="12" height="40" fill="#8a7a60"/><rect x="120" y="0" width="12" height="40" fill="#8a7a60"/></g>`;
      furn += `<g transform="translate(560 1060)"><rect x="-6" y="-300" width="12" height="300" fill="#8a7a60" stroke="${INK}" stroke-width="3"/><rect x="-150" y="-370" width="300" height="80" rx="6" fill="#f4f0e6" stroke="${INK}" stroke-width="4"/><text x="0" y="-316" text-anchor="middle" ${TYPE} font-size="30" fill="#3a3a3a">RESORT BEACH</text></g>`;
      return { light: { dir: -1, rim: '#fff4dc', key: '#fff8ec' }, layers: [[0.05, sky], [0.35, sea], [0.9, sand], [0.8, furn]] };
    },

    // a Patagonian gravel road: a grey sky, snow-capped mountains, scrub, the road running in from the left; a white
    // refrigerated box truck (generic) pulled over at the right, a police pickup (generic, plain stripe) behind it
    // with its light bar (drawn in the shot)
    sb90_road(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="sb90rk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a7a8c"/><stop offset="1" stop-color="#b8c0c8"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1200" fill="url(#sb90rk)"/>`;
      sky += [[300, 260, 220], [900, 200, 260]].map(([x, y, r]) => `<ellipse cx="${x + Math.sin(t * 0.08) * 12}" cy="${y}" rx="${r}" ry="${r * 0.35}" fill="#dde2e6" opacity="0.6"/>`).join('');
      let mts = `<path d="M-400 900 L-100 560 L120 700 L340 480 L560 720 L760 540 L980 700 L1200 520 L1480 900 Z" fill="#3e4a56"/>`;
      mts += `<path d="M-100 560 L-40 630 L-160 640 Z M340 480 L410 570 L270 580 Z M760 540 L820 620 L700 630 Z M1200 520 L1260 600 L1140 610 Z" fill="#e8eef2"/>`;
      mts += `<rect x="-400" y="880" width="${W + 800}" height="260" fill="#5a6652"/>`;
      const r = R(9051); let scrub = '';
      for (let i = 0; i < 50; i++) { const x = -300 + r() * (W + 600), y = 900 + r() * 220; scrub += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(20 + r() * 30)}" ry="${f1(10 + r() * 12)}" fill="#4a5a40"/>`; }
      let road = `<path d="M-400 1200 L${W + 400} 1140 L${W + 400} ${H + 300} L-400 ${H + 300} Z" fill="#8a8478"/><path d="M-400 1210 L${W + 400} 1150" stroke="#6a6458" stroke-width="6"/>` + `<rect x="-400" y="1140" width="${W + 800}" height="40" fill="#6e7a62"/>`;
      // the refrigerated box truck (generic white box, no marking), nose to the right
      let truck = `<g transform="translate(800 1300)"><ellipse cx="0" cy="10" rx="320" ry="24" fill="#000" opacity="0.45"/>`;
      truck += `<rect x="-300" y="-330" width="380" height="260" rx="8" fill="#dfe3e6" stroke="${INK}" stroke-width="5"/><rect x="-300" y="-330" width="380" height="30" fill="#c8ced4"/>`;
      truck += `<rect x="-310" y="-80" width="400" height="26" fill="#1e2226" stroke="${INK}" stroke-width="4"/>`;
      truck += `<path d="M90 -80 L90 -280 Q90 -300 110 -300 L220 -300 L270 -200 L280 -80 Z" fill="#d8dce0" stroke="${INK}" stroke-width="5"/><path d="M110 -286 L214 -286 L254 -200 L110 -200 Z" fill="#1a2430"/>`;
      truck += `<circle cx="-230" cy="-14" r="44" fill="#0c0d10" stroke="${INK}" stroke-width="5"/><circle cx="-130" cy="-14" r="44" fill="#0c0d10" stroke="${INK}" stroke-width="5"/><circle cx="200" cy="-14" r="44" fill="#0c0d10" stroke="${INK}" stroke-width="5"/>`;
      truck += `<circle cx="-230" cy="-14" r="14" fill="#3a3e46"/><circle cx="-130" cy="-14" r="14" fill="#3a3e46"/><circle cx="200" cy="-14" r="14" fill="#3a3e46"/></g>`;
      // the police pickup behind (left), plain green with a white stripe, no crest
      let car = `<g transform="translate(250 1330)"><ellipse cx="0" cy="8" rx="230" ry="20" fill="#000" opacity="0.45"/>`;
      car += `<path d="M-220 0 L-214 -90 Q-200 -120 -150 -124 L-80 -200 Q-60 -220 0 -220 L90 -220 Q130 -220 150 -196 L190 -124 Q220 -116 222 -90 L226 0 Z" fill="#2a5a40" stroke="${INK}" stroke-width="5"/><rect x="-214" y="-100" width="440" height="22" fill="#e8ece8"/>`;
      car += `<path d="M-70 -196 L-48 -130 L120 -130 L136 -196 Z" fill="#101820"/><circle cx="-140" cy="-6" r="40" fill="#0c0d10" stroke="${INK}" stroke-width="5"/><circle cx="150" cy="-6" r="40" fill="#0c0d10" stroke="${INK}" stroke-width="5"/><circle cx="-140" cy="-6" r="13" fill="#3a3e46"/><circle cx="150" cy="-6" r="13" fill="#3a3e46"/></g>`;
      return { light: { dir: -1, rim: '#e8f0f8', key: '#dce4ec' }, layers: [[0.05, sky], [0.3, mts], [0.55, scrub], [0.9, road], [0.92, car], [0.95, truck]] };
    },

    // the rear of the box truck filling the frame on the road: the same sky and mountains behind, the box with two
    // doors hinged at the sides (o.open 0..1 swings them out), the dark inside, the stacked ice (o.glow 0..1)
    sb90_doors(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), open = o.open ?? 0, glow = o.glow ?? 0;
      let sky = `<defs><linearGradient id="sb90dk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a7a8c"/><stop offset="1" stop-color="#b8c0c8"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1200" fill="url(#sb90dk2)"/>`;
      sky += `<path d="M-400 900 L-100 560 L120 700 L340 480 L560 720 L760 540 L980 700 L1200 520 L1480 900 Z" fill="#3e4a56"/><path d="M-100 560 L-40 630 L-160 640 Z M340 480 L410 570 L270 580 Z M760 540 L820 620 L700 630 Z M1200 520 L1260 600 L1140 610 Z" fill="#e8eef2"/><rect x="-400" y="880" width="${W + 800}" height="260" fill="#5a6652"/>`;
      let road = `<rect x="-400" y="1140" width="${W + 800}" height="${H}" fill="#8a8478"/><rect x="-400" y="1140" width="${W + 800}" height="30" fill="#6e7a62"/>`;
      // the box: the frame, the dark inside, the ice
      const bx = 160, by = 420, bw = 760, bh = 880;
      let box = `<rect x="${bx - 30}" y="${by - 30}" width="${bw + 60}" height="${bh + 60}" rx="14" fill="#c8ced4" stroke="${INK}" stroke-width="6"/><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#0a1016"/>`;
      // the ice stacked inside (visible as the doors open)
      let ice = wash(bx + bw / 2, by + bh * 0.6, bw * 0.7, bh * 0.5, '#9fd4ff', f1(0.35 * glow));
      const r = R(9061);
      for (let row = 0; row < 4; row++) for (let col = 0; col < 3; col++) { const w = 200 + r() * 40, h = 150 + r() * 30; ice += iceBlock(bx + 40 + col * 230 + (row % 2) * 30, by + bh - 40 - (row + 1) * 185 + 20, w, h, glow); }
      ice += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#0a1016" opacity="${f1(1 - Math.min(1, 0.15 + 0.85 * glow))}"/>`;   // the dark inside until the glow comes up
      // the two doors, hinged at the outer edges: each shrinks toward its hinge as it opens (a cheap perspective)
      const dw = bw / 2, k = 1 - 0.92 * ease.inOut(open);
      let doors = '';
      [[bx, 1], [bx + bw, -1]].forEach(([hx, s]) => {
        const w = dw * k;
        doors += `<rect x="${f1(s > 0 ? hx : hx - w)}" y="${by}" width="${f1(w)}" height="${bh}" fill="#dfe3e6" stroke="${INK}" stroke-width="5"/>`;
        doors += `<rect x="${f1(s > 0 ? hx + w * 0.1 : hx - w * 0.9)}" y="${by + 60}" width="${f1(w * 0.8)}" height="${bh - 120}" fill="none" stroke="#b8c0c6" stroke-width="5"/>`;
        doors += `<rect x="${f1(s > 0 ? hx + w * 0.82 : hx - w * 0.9)}" y="${by + bh * 0.45}" width="${f1(w * 0.08)}" height="${bh * 0.1}" rx="6" fill="#4a5058" stroke="${INK}" stroke-width="3"/>`;
      });
      box += `<rect x="${bx - 40}" y="${by + bh + 30}" width="${bw + 80}" height="40" fill="#1e2226" stroke="${INK}" stroke-width="4"/><rect x="${bx + 120}" y="${by + bh + 70}" width="90" height="60" fill="#0c0d10" stroke="${INK}" stroke-width="4"/><rect x="${bx + bw - 210}" y="${by + bh + 70}" width="90" height="60" fill="#0c0d10" stroke="${INK}" stroke-width="4"/>`;
      return { light: { dir: 1, rim: '#bfe4ff', key: '#dce4ec' }, layers: [[0.05, sky], [0.9, road], [0.94, box], [0.95, ice], [0.96, doors]] };
    }
  });

  E.registerScenes({
    // 1 - HOOK (frame 0, the impossible picture): the creek; the silhouette kneels at the cut with the torch running
    //     from 0.0 s, sparks pour into the creek, the flatbed on the bank holds the cut section, the camera already
    //     pushing in; on line 2 he leans into the cut and the torch flares
    sb90_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.5), fe = WT(ctx, 1, 0, 2.5), tc = WT(ctx, 1, 4, 3.6);
      const k = 0.5 + 0.5 * seg(t, fe, fe + 0.5) - 0.3 * seg(t, tc + 0.8, tc + 1.6);
      return E.cine.shot(ctx, {
        set: 'sb90_creek', setOpts: { glow: k, dx: 70 * seg(t, 0, Math.max(3.5, ctx.T)) }, grade: 'night', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        sparks: { x: CUT.x - 4, y: CUT.y, n: 44, col: '#ffc46a', d: 1.06 },
        figures: [
          { ...HERO_FIG, keys: [{ at: 0.1, headTurn: 0.2, dur: 0.5 }, { at: fe + 0.05, pose: 'torch_low', headTurn: 0.45, dur: 0.4 }, { at: tc + 0.2, pose: 'torch_low', headTurn: 0.1, dur: 0.4 }] }
        ],
        props: [{ depth: 1.04, accent: true, svg: tt => torchFire(tt, { k }) }],
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.25), x: 60, y: 1180, text: 'NORTH BEAVER TWP, PENNSYLVANIA · OCT 2011', fs: 28, sub: 'State police: about 50 ft, cut with a torch' },
          { type: 'callout', at: Math.max(3.1, tc + 0.1), target: [600, 1300], label: [1040, 800], anchor: 'end', w: 460, fs: 30, text: '31,000 LB OF STEEL', sub: 'Per the criminal complaint', r: 70, depth: 0.98 }
        ],
        tag: TAG
      });
    },

    // 2 - THE GOTCHA: the scrapyard office, close on the silhouette holding up his phone with the bridge photo; on
    //     "photos" the yard man leans in to look; on "called" he lifts the handset (the single impact); the charged
    //     label and the 81 % counter
    sb90_yard(ctx) {
      const t = ctx.t, T = ctx.T, sh = WT(ctx, 0, 1, 0.5), ph = WT(ctx, 0, 3, 1.3), cl = WT(ctx, 0, 5, 2.1), po = WT(ctx, 0, 6, 2.5);
      const lift = ease.out(seg(t, cl, cl + 0.4));
      return E.cine.shot(ctx, {
        set: 'sb90_yard', grade: 'warm', haze: 0.25, dof: true,
        cam: { from: { x: 20, y: 20, z: 1.08 }, to: { x: -10, y: 10, z: 1.2 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'sb90_cutter', x: 330, y: 1800, scale: 1.15, dir: 1, turn: 0.45, pose: 'stand_tense', silhouette: 'cool', depth: 1.0,
            keys: [{ at: sh, pose: 'present', headTurn: 0.2, dur: 0.4 }, { at: ph, pose: 'point', headTurn: 0.3, dur: 0.3 }, { at: po + 0.3, pose: 'stand_tense', headTurn: -0.2, dur: 0.4 }] },
          { id: 'sb90_yardman', x: 860, y: 1500, scale: 0.9, dir: -1, turn: 0.4, pose: 'stand', expr: 'neutral', depth: 0.95,
            keys: [{ at: sh + 0.2, pose: 'examine', expr: 'focused', headTurn: 0.2, dur: 0.4 }, { at: ph + 0.2, pose: 'examine', expr: 'shocked', headTurn: 0.1, dur: 0.3 }, { at: cl, pose: 'hand_to_face', expr: 'stern', headTurn: 0.3, dur: 0.35 }, { at: po + 0.5, pose: 'hand_to_face', expr: 'determined', dur: 0.3 }] }
        ],
        props: [
          // the phone held up from "showed" (the accent object of this shot): our own drawn bridge thumbnail
          { depth: 1.02, accent: true, svg: tt => { const u = ease.out(seg(tt, sh, sh + 0.5)); if (u <= 0) return ''; return phoneBridge(560 - 40 * u, 980 - 160 * u, 150, 300, u); } },
          // the handset lifts off the desk phone on "called"
          { depth: 0.96, svg: tt => { const u = ease.out(seg(tt, cl, cl + 0.4)); return `<g transform="translate(${f1(1035 - 120 * u)} ${f1(1116 - 260 * u)}) rotate(${f1(-60 * u)})"><rect x="-70" y="-14" width="140" height="28" rx="12" fill="#2a2e36" stroke="${INK}" stroke-width="4"/><circle cx="-62" cy="0" r="18" fill="#2a2e36" stroke="${INK}" stroke-width="4"/><circle cx="62" cy="0" r="18" fill="#2a2e36" stroke="${INK}" stroke-width="4"/></g>`; } }
        ],
        overlays: [
          { type: 'impact', at: cl, x: 960, y: 1040 },
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'BOTH CHARGED · THEFT, CONSPIRACY · OCT 2011', fs: 32, sub: 'Police say · no verdict found · as of Oct 2026' },
          { type: 'counter', at: po + 0.35, dur: 0.9, from: 0, to: 81, prefix: '+', suffix: '%', label: 'US METAL-THEFT INSURANCE CLAIMS', y: 1000, fs: 120 },
          { type: 'label', at: po + 0.5, x: 60, y: 1250, text: 'NICB: 2009–11 vs 2006–08', fs: 26 }
        ],
        tag: TAG
      });
    },

    // 3 - REHOOK + CASE 2: the beach at night; the dump truck at the right with its beacon turning; the silhouette walks
    //     in from the left with a shovel and digs at the hole on "trucked"; the truckloads label
    sb90_beach(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 1.5), tr = WT(ctx, 1, 3, 2.6), bc = WT(ctx, 1, 5, 3.4);
      const dig = (tt, a) => (tt > a ? 0.5 + 0.5 * Math.sin((tt - a) * 7) : 0);
      return E.cine.shot(ctx, {
        set: 'sb90_beach_night', grade: 'night', haze: 0.3,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 20, y: 30, z: 1.06 } },
        figures: [
          { id: 'sb90_shoveller', x: 520, y: 1290, scale: 0.72, dir: 1, turn: 0.45, pose: 'stand_tense', silhouette: 'cool', depth: 1.0,
            walk: { at: 0.0, dur: Math.max(0.9, l2 - 0.2), cadence: 3.6, stride: 14, from: 120, to: 520 },
            keys: [{ at: l2, pose: 'examine', headTurn: 0.2, dur: 0.4 }, { at: tr, pose: 'present', headTurn: 0.3, dur: 0.3 }, { at: tr + 0.5, pose: 'examine', dur: 0.3 }, { at: bc, pose: 'present', headTurn: 0.1, dur: 0.3 }, { at: bc + 0.5, pose: 'examine', dur: 0.3 }] }
        ],
        props: [
          // the shovel in his hands, swinging from "trucked"; sand flies on each throw
          { depth: 1.01, svg: tt => { const d = dig(tt, tr), a = -28 + 40 * d; return `<g transform="translate(${f1(560)} ${f1(1180)}) rotate(${f1(a)})"><rect x="0" y="-8" width="150" height="14" rx="6" fill="#6a5a40" stroke="${INK}" stroke-width="3"/><path d="M150 -30 L210 -30 L220 30 L150 30 Z" fill="#5a5a60" stroke="${INK}" stroke-width="4"/></g>` + (d > 0.7 ? `<ellipse cx="${f1(760 + 60 * d)}" cy="${f1(1120 - 60 * d)}" rx="30" ry="12" fill="#cfc3a8" opacity="0.7"/>` : ''); } },
          // the amber beacon on the cab (the accent of this shot)
          { depth: 0.96, accent: true, svg: tt => { const b = 0.5 + 0.5 * Math.sin(tt * 9); return `<rect x="1004" y="1018" width="40" height="22" rx="6" fill="#ffb347" opacity="${f1(0.6 + 0.4 * b)}"/>` + wash(1024, 1030, 220, 120, '#ffb347', f1(0.22 * b)); } }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'CORAL SPRING, JAMAICA · JULY 2008', fs: 34, sub: 'Police: up to 500 truckloads (Mines Division: no more than 140)' },
          { type: 'callout', at: tr + 0.4, target: [340, 1150], label: [60, 820], anchor: 'start', w: 420, text: 'THE BEACH, GONE', sub: 'Believed sold to rival resorts (police)', r: 80, depth: 0.98 }
        ],
        tag: GEN
      });
    },

    // 4 - CASE 2's GOTCHA: a rival resort beach by day; the officer walks in from the right, kneels and scoops sand
    //     into the sample jar on "tested"; on "No" he stands and holds the jar up; the callout and the status label
    sb90_resort(ctx) {
      const t = ctx.t, T = ctx.T, te = WT(ctx, 0, 1, 0.6), bh = WT(ctx, 0, 3, 1.5), no = WT(ctx, 0, 4, 2.2), su = WT(ctx, 0, 6, 3.3);
      const fill = seg(t, te + 0.1, te + 0.8);
      return E.cine.shot(ctx, {
        set: 'sb90_resort', grade: 'warm', haze: 0.15, dof: true,
        cam: { from: { x: 10, y: 20, z: 1.02 }, to: { x: -10, y: 30, z: 1.1 } },
        figures: [
          { id: 'sb90_officer_jm', x: 620, y: 1420, scale: 0.92, dir: -1, turn: 0.4, pose: 'walk', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#1e2a44', band: '#b03a3a' },
            walk: { at: 0.0, dur: Math.max(0.5, te - 0.15), cadence: 4.0, stride: 16, from: 900, to: 620 },
            keys: [{ at: te - 0.1, pose: 'kneel', expr: 'focused', headTurn: 0.1, dur: 0.4 }, { at: bh, pose: 'kneel', expr: 'determined', headTurn: -0.2, dur: 0.3 }, { at: no, pose: 'present', expr: 'stern', headTurn: 0.2, dur: 0.45 }, { at: su, pose: 'present', expr: 'worried', headTurn: 0.3, dur: 0.3 }], propOverride: null }
        ],
        props: [
          // the sample jar (the accent): on the sand from "tested", filling; held up from "No"
          { depth: 1.02, accent: true, svg: tt => { if (tt < te) return ''; const u = ease.out(seg(tt, no, no + 0.45)); return jar(lerp(540, 520, u), lerp(1400, 1120, u), 120, fill); } }
        ],
        overlays: [
          { type: 'callout', at: te + 0.35, until: no + 0.2, target: [540, 1330], label: [1030, 860], anchor: 'end', w: 440, text: 'SAND SAMPLES', sub: 'Rival beaches tested to match it (BBC)', r: 70, depth: 1.02 },
          { type: 'label', at: no + 0.2, x: 60, y: 560, text: 'OCT 2008: NO SAND, NO SUSPECTS', fs: 32, sub: 'No conviction found in reports · as of Oct 2026' }
        ],
        tag: GEN
      });
    },

    // 5 - REHOOK + CASE 3: the gravel road; the box truck pulled over, the police pickup behind it with its light bar
    //     turning; the officer walks from the pickup to the cab and points up at it on "truck"; the place label
    sb90_road(ctx) {
      const t = ctx.t, T = ctx.T, tk = WT(ctx, 0, 4, 1.8);
      return E.cine.shot(ctx, {
        set: 'sb90_road', grade: 'cold', haze: 0.35,
        cam: { from: { x: -20, y: 10, z: 1.0 }, to: { x: 10, y: 20, z: 1.08 } },
        figures: [
          { id: 'sb90_carabinero', x: 700, y: 1360, scale: 0.6, dir: 1, turn: 0.45, pose: 'walk', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#2a4a3a' },
            walk: { at: 0.0, dur: Math.max(0.8, tk - 0.2), cadence: 3.8, stride: 16, from: 380, to: 700 },
            keys: [{ at: tk, pose: 'point_up', expr: 'stern', headTurn: 0.3, dur: 0.4 }, { at: tk + 0.9, pose: 'point', expr: 'determined', dur: 0.3 }] }
        ],
        props: [
          // the light bar on the pickup (the accent of this shot)
          { depth: 0.93, accent: true, svg: tt => { const b = 0.5 + 0.5 * Math.sin(tt * 10); return `<rect x="190" y="1096" width="120" height="18" rx="5" fill="#2a3040" stroke="${INK}" stroke-width="3"/><rect x="196" y="1098" width="50" height="14" rx="4" fill="#ff5a4a" opacity="${f1(0.4 + 0.6 * b)}"/><rect x="254" y="1098" width="50" height="14" rx="4" fill="#6ab0ff" opacity="${f1(1 - 0.6 * b)}"/>` + wash(250, 1105, 260, 120, '#ff7a5a', f1(0.2 * b)) + wash(250, 1105, 260, 120, '#6ab0ff', f1(0.2 * (1 - b))); } }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'PATAGONIA, CHILE · FEB 2012', fs: 34, sub: 'A refrigerated truck, stopped for a traffic violation (police)' }
        ],
        tag: GEN
      });
    },

    // 6 - THE BIGGEST GOTCHA (the music drop): the rear of the truck; on "violation" the doors swing open; on "glacier"
    //     the ice glows out of the dark box and the officer points; on line 2 the driver's hands go behind his back;
    //     the charged label; the FUN FACT
    sb90_doors(ctx) {
      const t = ctx.t, T = ctx.T, vi = WT(ctx, 0, 2, 0.9), fi = WT(ctx, 0, 3, 1.4), gl = WT(ctx, 0, 6, 2.3), l2 = LS(ctx, 1, 2.9), ps = WT(ctx, 1, 3, 3.6);
      const open = seg(t, vi, vi + 1.1), glow = 0.25 * seg(t, vi + 0.4, vi + 1.0) + 0.75 * seg(t, gl - 0.05, gl + 0.35);
      return E.cine.shot(ctx, {
        set: 'sb90_doors', setOpts: { open, glow }, grade: 'cold', haze: 0.2, dof: true,
        cam: { from: { x: 0, y: 20, z: 1.04 }, to: { x: 0, y: 10, z: 1.12 } },
        figures: [
          { id: 'sb90_driver', x: 150, y: 1600, scale: 0.85, dir: 1, turn: 0.45, pose: 'stand_tense', silhouette: 'cool', depth: 1.0,
            keys: [{ at: 0.15, pose: 'hands_together', headTurn: 0.2, dur: 0.4 }, { at: gl, pose: 'hand_to_face', headTurn: 0.3, dur: 0.35 }, { at: l2 + 0.1, pose: 'hands_behind', headTurn: 0.2, dur: 0.45 }, { at: ps + 0.3, pose: 'bowed', dur: 0.4 }] },
          { id: 'sb90_carabinero', x: 930, y: 1640, scale: 0.9, dir: -1, turn: 0.4, pose: 'stand', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#2a4a3a' },
            keys: [{ at: vi - 0.1, pose: 'present', expr: 'focused', headTurn: 0.1, dur: 0.4 }, { at: fi, pose: 'examine', expr: 'shocked', headTurn: 0.2, dur: 0.3 }, { at: gl, pose: 'point', expr: 'stern', headTurn: 0.1, dur: 0.35 }, { at: l2 + 0.2, pose: 'point', expr: 'determined', dur: 0.3 }] }
        ],
        props: [
          // the ice glow spilling out of the box onto the road (the accent of this shot)
          { depth: 0.97, accent: true, svg: tt => wash(540, 1250, 520, 160, '#9fd4ff', f1(0.3 * glow)) + wash(540, 860, 420, 420, '#cfe9ff', f1(0.12 * glow)) }
        ],
        overlays: [
          { type: 'label', at: gl + 0.3, x: 60, y: 560, text: 'CHARGED WITH THEFT · POLICE SAY', fs: 34, sub: 'About 5 tonnes of Jorge Montt glacier ice, valued about $6,000' },
          { type: 'funfact', at: l2 + 0.3, x: 40, w: 720, y: 1040, fs: 38, rows: [{ text: 'THE GLACIER HE TOOK FROM' }, { text: 'RETREATED 1 KM IN ONE YEAR' }, { text: '1,445 time-lapse photos, Feb 2010–Jan 2011 (AP)', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 7 - THE CALLBACK (the loop): frame 1's creek, the same kneeling silhouette and the same flatbed; the torch flares
    //     on "hundred" and settles back to frame 1's glow; the camera eases back to frame 1's start, so the last
    //     frame equals the first
    sb90_end(ctx) {
      const t = ctx.t, T = ctx.T, hu = WT(ctx, 0, 2, 0.6), fv = WT(ctx, 0, 6, 1.6);
      const back = T - 0.55;
      const k = 0.5 + 0.5 * seg(t, hu, hu + 0.3) * (1 - seg(t, Math.min(fv + 0.3, back - 0.4), back));   // back to frame 1's flare before the last frame
      return E.cine.shot(ctx, {
        set: 'sb90_creek', setOpts: { glow: k }, grade: 'night', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        sparks: { x: CUT.x - 4, y: CUT.y, n: 44, col: '#ffc46a', d: 1.06 },
        // he looks up on the callback line and is back in frame 1's pose before the last frame (the loop)
        figures: [{ ...HERO_FIG, keys: [{ at: 0.3, pose: 'torch_low', headTurn: 0.5, dur: 0.4 }, { at: Math.max(1.0, back - 0.4), pose: 'torch_low', headTurn: 0, dur: 0.4 }] }],
        props: [{ depth: 1.04, accent: true, svg: tt => torchFire(tt, { k }) }],
        overlays: [],
        tag: TAG
      });
    }
  });
})();
