/* Case File 86 (premium look, ENGINE V6: promise -> proof -> escalate -> callback): DISGUISE FAILS, 2.
   EXPERIMENT PAIR 86/87, FRAME-0 VARIANT A, "THE ACT IN PROGRESS": frame 0 shows the crime happening, not the object at rest.
   HEADLINE: May 2020, Louisa, Virginia: two men in hollowed-out watermelons with eye holes cut out walked into a convenience
   store and took alcohol; the Louisa Police Department posted the security images on Facebook, commenters said they had seen
   the pair in town, and about ten days later police announced one arrest: a 20-year-old charged with wearing a mask in public
   while committing larceny, petit larceny of alcohol and underage possession of alcohol (accused only; the second man was
   still being sought). The callback: the haul was alcohol and he was 20.
   CASE 2: June 2011, Spain: a thief rode inside a suitcase in the hold of the Girona airport-Barcelona coach and stole from
   other bags; a driver noticed a passenger struggling with a very heavy case and called police, who knocked, found it warm and
   opened it on a sweating man; he and his accomplice were arrested.
   CASE 3 (best last): Brooklyn: a man dressed as his dead mother (blond wig, dress, oversized sunglasses) for about six years
   to collect her Social Security cheques and keep her brownstone; investigators met "her" (red cardigan, lipstick, an oxygen
   tank) already holding a photo of her tombstone; convicted 2012, 13 2/3 to 41 years.
   Structure (v6): frame 0 = THE ACT: a night-time convenience store; a dark silhouette with a big green watermelon on his head
   (the one accent object, ~300 px wide, upper-middle) leans over the counter, his hand closing on a bottle; the clerk recoils;
   a second melon-head at the door with bottles; the camera already pushing in. The headline gotcha before 9 s at a police desk
   (the officer posts the image, comments pop up, the charges label; the FUN FACT: Virginia's mask felony). Case 2 at an airport
   coach bay (the accomplice drags a huge suitcase, the driver watches; the 90-minute counter), then the open hold (the officer
   knocks, the lid lifts on a sweating silhouette; both arrested). Case 3 on a brownstone stoop (the disguised silhouette comes
   down with the oxygen tank; a passer-by glances), then the interview room (the tombstone photo slides across: the single
   impact, the music drop; the sentence). The one closing line back on frame 1's store, the same figures and poses, the camera
   easing back to frame 1's start (the loop), with the end card.
   Smoothness: cuts and dissolves, one push (into case 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact. Screen direction: the disguised men face and move LEFT TO RIGHT.
   Look: episode.look = 'premium', one cool night palette (shadow #121a1e, mid #c6bfb0, accent #9ccf3e). The strongly coloured
   object is the watermelon (prop marked accent: true); everything else is muted.
   Content rules: nobody is hurt; no weapon, no force; a shoplifting, never called a robbery. The Louisa men, the two men
   arrested in Spain and the Brooklyn man are featureless dark silhouettes tagged NOT A LIKENESS (the melons and the wig and
   sunglasses are drawn over silhouettes); the clerk, officers, driver, investigator and passer-by are generic figures. The
   store has no chain name or trade dress; the coach has no livery; the posted "security image" and the tombstone photo are our
   own plain typed graphics.
   New environments (E.registerSets): wm86_shop (a convenience store at night), wm86_desk (a police office desk, close),
   wm86_coach (an airport coach bay; view 'wide' or 'hold'), wm86_stoop (a brownstone stoop), wm86_room (an interview room). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#10141a';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · NOT A LIKENESS';
  const GEN = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#9ccf3e';
  const SIL = '#171b22', RIM = '#8ab0d8';

  // ---------- props
  // a hollowed-out watermelon worn as a head: centre (cx, cy), radii; two eye holes with the red flesh showing at the cut
  function melon(cx, cy, rx, ry, o = {}) {
    const bob = o.bob || 0;
    let g = `<g transform="translate(${f1(cx)} ${f1(cy + bob)})">`;
    g += `<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="#3e8a2c" stroke="${INK}" stroke-width="6"/>`;
    // the dark stripes (curved, following the ellipse)
    for (let i = -3; i <= 3; i++) { const x = i * rx * 0.26; g += `<path d="M${f1(x - rx * 0.06)} ${f1(-ry * 0.96)} Q${f1(x + rx * 0.18)} 0 ${f1(x - rx * 0.04)} ${f1(ry * 0.96)}" stroke="#245a1c" stroke-width="${f1(rx * 0.09)}" fill="none" stroke-linecap="round" opacity="0.85"/>`; }
    g += `<ellipse cx="${f1(-rx * 0.35)}" cy="${f1(-ry * 0.45)}" rx="${f1(rx * 0.22)}" ry="${f1(ry * 0.14)}" fill="#fff" opacity="0.18"/>`;
    // the eye holes: cut through the rind (pale ring, red flesh, black hole)
    [-0.36, 0.3].forEach(ex => { const x = ex * rx, y = -ry * 0.08, hr = rx * 0.17; g += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(hr * 1.3)}" ry="${f1(hr * 1.05)}" fill="#e8e2b8"/><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(hr * 1.15)}" ry="${f1(hr * 0.9)}" fill="#d9475a"/><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(hr * 0.85)}" ry="${f1(hr * 0.62)}" fill="#07090c"/>`; });
    // the cut at the bottom where the neck goes in: pale rind, red flesh
    g += `<path d="M${f1(-rx * 0.5)} ${f1(ry * 0.86)} Q0 ${f1(ry * 1.02)} ${f1(rx * 0.5)} ${f1(ry * 0.86)} Q0 ${f1(ry * 0.72)} ${f1(-rx * 0.5)} ${f1(ry * 0.86)} Z" fill="#e8e2b8"/><path d="M${f1(-rx * 0.4)} ${f1(ry * 0.86)} Q0 ${f1(ry * 0.98)} ${f1(rx * 0.4)} ${f1(ry * 0.86)} Q0 ${f1(ry * 0.76)} ${f1(-rx * 0.4)} ${f1(ry * 0.86)} Z" fill="#d9475a"/>`;
    g += `<path d="M${f1(rx * 0.55)} ${f1(-ry * 0.7)} Q${f1(rx * 0.98)} ${f1(-ry * 0.1)} ${f1(rx * 0.72)} ${f1(ry * 0.62)}" stroke="${RIM}" stroke-width="5" fill="none" opacity="0.55"/>`;
    return g + '</g>';
  }
  // a plain bottle (no label text): bottom centre (x, y), height h
  const bottle = (x, y, h, col = '#5a4a3a') => `<path d="M${f1(x - h * 0.16)} ${f1(y)} L${f1(x - h * 0.16)} ${f1(y - h * 0.55)} Q${f1(x - h * 0.16)} ${f1(y - h * 0.7)} ${f1(x - h * 0.06)} ${f1(y - h * 0.76)} L${f1(x - h * 0.06)} ${f1(y - h)} L${f1(x + h * 0.06)} ${f1(y - h)} L${f1(x + h * 0.06)} ${f1(y - h * 0.76)} Q${f1(x + h * 0.16)} ${f1(y - h * 0.7)} ${f1(x + h * 0.16)} ${f1(y - h * 0.55)} L${f1(x + h * 0.16)} ${f1(y)} Z" fill="${col}" stroke="${INK}" stroke-width="3"/><rect x="${f1(x - h * 0.12)}" y="${f1(y - h * 0.46)}" width="${f1(h * 0.24)}" height="${f1(h * 0.2)}" fill="#d8d2c4" opacity="0.8"/><path d="M${f1(x - h * 0.1)} ${f1(y - h * 0.9)} L${f1(x - h * 0.1)} ${f1(y - h * 0.3)}" stroke="#fff" stroke-width="3" opacity="0.25"/>`;
  // the counter (drawn by the shot so the thief stands in front of it and the clerk behind): a glass-fronted display of
  // bottles on top
  function counter(y = 1150) {
    let g = `<rect x="430" y="${y}" width="900" height="420" fill="#4a5058" stroke="${INK}" stroke-width="6"/><rect x="410" y="${y - 24}" width="940" height="30" fill="#b8bcc0" stroke="${INK}" stroke-width="5"/>`;
    for (let i = 0; i < 6; i++) g += `<rect x="${450 + i * 150}" y="${y + 40}" width="110" height="300" rx="4" fill="#3e444c"/>`;
    // the bottle display on the counter (right half), the thief's target
    g += `<rect x="820" y="${y - 24 - 180}" width="300" height="180" fill="#1a2028" opacity="0.5"/>`;
    for (let i = 0; i < 4; i++) g += bottle(860 + i * 70, y - 26, 150, ['#5a4a3a', '#2e5a3a', '#4a3a5a', '#5a4a3a'][i]);
    return g;
  }
  // THE HERO: the melon-headed silhouette leaning over the counter, k 0..1 = the reach (his hand closing on a bottle)
  function melonMan(t, k) {
    const kk = ease.inOut(k);
    const hx = lerp(640, 700, kk), hy = lerp(820, 790, kk);                   // the melon drifts forward with the lean
    const shx = lerp(600, 640, kk), shy = lerp(960, 930, kk);                 // the shoulders
    let g = `<g>`;
    // legs and hips in front of the counter (feet at the floor, hips at the counter edge)
    g += `<path d="M470 1560 L500 1180 L600 1150 L640 1560 Z" fill="${SIL}" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M560 1560 L600 1150 L660 1160 L660 1560 Z" fill="${SIL}" stroke="${INK}" stroke-width="4"/>`;
    // the torso leaning right over the counter top
    g += `<path d="M500 1180 Q${f1(shx - 80)} ${f1(shy + 20)} ${f1(shx)} ${f1(shy)} L${f1(shx + 110)} ${f1(shy + 40)} Q${f1(shx + 110)} 1080 640 1150 Z" fill="${SIL}" stroke="${INK}" stroke-width="4"/>`;
    // the far arm braced on the counter
    g += `<path d="M${f1(shx + 40)} ${f1(shy + 30)} Q${f1(shx + 140)} ${f1(shy + 120)} 760 1128" stroke="${SIL}" stroke-width="34" stroke-linecap="round" fill="none"/>`;
    // the reaching arm: from the near shoulder to the bottle on the display
    const ex = lerp(700, 790, kk), ey = lerp(1040, 1010, kk), wx = lerp(770, 862, kk), wy = lerp(1060, 985, kk);
    g += `<path d="M${f1(shx + 60)} ${f1(shy + 10)} Q${f1(ex)} ${f1(ey)} ${f1(wx)} ${f1(wy)}" stroke="${SIL}" stroke-width="36" stroke-linecap="round" fill="none"/>`;
    g += `<ellipse cx="${f1(wx + 6)}" cy="${f1(wy - 10)}" rx="26" ry="30" fill="${SIL}" stroke="${INK}" stroke-width="3"/>`;
    // the neck into the melon, then the melon
    g += `<path d="M${f1(shx + 20)} ${f1(shy)} L${f1(hx - 30)} ${f1(hy + 110)} L${f1(hx + 40)} ${f1(hy + 110)} L${f1(shx + 90)} ${f1(shy + 20)} Z" fill="${SIL}"/>`;
    // rim light down the back
    g += `<path d="M${f1(shx - 70)} ${f1(shy + 40)} Q${f1(shx - 90)} 1100 520 1180" stroke="${RIM}" stroke-width="5" fill="none" opacity="0.5"/>`;
    g += melon(hx, hy, 150, 128, { bob: Math.sin(t * 2.2) * 3 });
    return g + '</g>';
  }
  // the second melon-head by the door, bottles in his arms (static, a slight sway)
  function melonMan2(t) {
    const sw = Math.sin(t * 1.6) * 3;
    let g = `<g transform="translate(${f1(sw)} 0)">`;
    g += `<path d="M150 1560 L170 1240 L250 1240 L280 1560 Z" fill="${SIL}" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M160 1250 Q150 1010 215 990 Q290 1000 300 1250 Z" fill="${SIL}" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M190 1070 Q230 1160 310 1120" stroke="${SIL}" stroke-width="30" stroke-linecap="round" fill="none"/>`;
    g += bottle(255, 1150, 130, '#2e5a3a') + bottle(300, 1160, 120, '#5a4a3a');
    g += `<path d="M200 1000 L200 940 L240 940 L240 1000 Z" fill="${SIL}"/>`;
    g += `<path d="M160 1030 Q140 1150 170 1250" stroke="${RIM}" stroke-width="4" fill="none" opacity="0.45"/>`;
    g += melon(222, 870, 104, 90, { bob: Math.sin(t * 1.9 + 1) * 2 });
    return g + '</g>';
  }
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 10, y: 14, z: 1.09 };
  const CLERK = { id: 'wm86_clerk', x: 1010, y: 1330, scale: 0.5, dir: -1, turn: 0.4, pose: 'stand_tense', expr: 'worried', depth: 0.98 };

  // a hardshell suitcase (upright): bottom centre (x, y), tilt in degrees
  function suitcase(x, y, tilt = 0, s = 1) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(tilt)}) scale(${f1(s)})"><rect x="-120" y="-20" width="60" height="22" rx="8" fill="#0e1014"/><rect x="60" y="-20" width="60" height="22" rx="8" fill="#0e1014"/><rect x="-140" y="-360" width="280" height="340" rx="22" fill="#3a4250" stroke="${INK}" stroke-width="6"/><path d="M-140 -190 L140 -190" stroke="${INK}" stroke-width="5"/><path d="M-110 -340 L-110 -40 M110 -340 L110 -40" stroke="#4e5868" stroke-width="8"/><rect x="-40" y="-400" width="80" height="44" rx="14" fill="none" stroke="#2a3038" stroke-width="12"/><rect x="-26" y="-205" width="52" height="30" rx="4" fill="#8a9098" stroke="${INK}" stroke-width="3"/></g>`;
  }
  // the suitcase lying open in the hold: lid angle k 0..1; a curled silhouette inside with sweat drops (sw 0..1)
  function openCase(cx, cy, k, sw, t) {
    const lid = lerp(0, -112, ease.out(k));
    let g = `<g transform="translate(${f1(cx)} ${f1(cy)})">`;
    g += `<rect x="-260" y="-150" width="520" height="150" rx="16" fill="#2e3642" stroke="${INK}" stroke-width="6"/>`;   // the base shell
    if (k > 0.05) {
      g += `<rect x="-246" y="-140" width="492" height="130" fill="#8a93a0"/><rect x="-246" y="-140" width="492" height="130" fill="#5a6470" opacity="${f1(0.6 * (1 - k))}"/>`;
      // the man curled on his side, head left, knees drawn up (a featureless dark silhouette)
      g += `<ellipse cx="-150" cy="-78" rx="56" ry="50" fill="${SIL}" stroke="${INK}" stroke-width="3"/><path d="M-100 -70 Q-20 -130 90 -110 Q190 -90 200 -40 Q120 -10 20 -20 Q-60 -20 -100 -70 Z" fill="${SIL}" stroke="${INK}" stroke-width="3"/><path d="M90 -100 Q150 -140 220 -110" stroke="${SIL}" stroke-width="26" stroke-linecap="round" fill="none"/>`;
      g += `<path d="M-190 -110 Q-200 -60 -170 -36" stroke="${RIM}" stroke-width="4" fill="none" opacity="0.55"/>`;
      for (let i = 0; i < 5; i++) { const ph = (t * 0.9 + i * 0.37) % 1; g += `<path d="M${f1(-210 + i * 34)} ${f1(-150 + 40 * ph)} q9 -20 18 0 q-9 20 -18 0 Z" fill="#dff2ff" stroke="#4a8ab8" stroke-width="2" opacity="${f1(sw * (1 - ph))}"/>`; }
    }
    g += `<g transform="translate(0 -150) rotate(${f1(lid)})"><rect x="-260" y="-130" width="520" height="130" rx="16" fill="#3a4250" stroke="${INK}" stroke-width="6"/><path d="M-230 -100 L230 -100" stroke="#4e5868" stroke-width="8"/></g>`;
    return g + '</g>';
  }
  // the disguised silhouette: blond wig, oversized sunglasses, a cardigan, pulling an oxygen tank on a trolley;
  // ground centre (x, y), scale s, facing right; step = walk phase
  function granny(x, y, s = 1, step = 0) {
    const bob = Math.sin(step) * 4;
    let g = `<g transform="translate(${f1(x)} ${f1(y + bob)}) scale(${f1(s)})">`;
    // the trolley and tank behind (left)
    g += `<rect x="-200" y="-150" width="46" height="150" rx="6" fill="#4a5a6a" stroke="${INK}" stroke-width="3"/><rect x="-204" y="-190" width="54" height="40" rx="12" fill="#5a6a7a" stroke="${INK}" stroke-width="3"/><circle cx="-177" cy="-230" r="10" fill="#d8dce0"/><circle cx="-190" cy="6" r="14" fill="#1a1c20" stroke="${INK}" stroke-width="3"/><circle cx="-164" cy="6" r="14" fill="#1a1c20" stroke="${INK}" stroke-width="3"/><path d="M-180 -200 L-150 -400" stroke="#4a5a6a" stroke-width="8"/>`;
    // the tube to the face
    g += `<path d="M-177 -220 Q-120 -260 -40 -340 Q0 -370 20 -392" stroke="#c8d8e0" stroke-width="4" fill="none"/>`;
    // the body: a long skirt/dress, a cardigan over it (silhouette dark; the cardigan drawn as an outline in muted red)
    g += `<path d="M-70 0 L-50 -260 L70 -260 L90 0 Z" fill="${SIL}" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-58 -260 Q-70 -380 0 -400 Q70 -380 78 -260 Z" fill="#5a2a2e" stroke="${INK}" stroke-width="4"/><path d="M0 -392 L0 -268" stroke="#3e1c20" stroke-width="4"/>`;
    g += `<path d="M-60 -360 Q-140 -330 -150 -400" stroke="#5a2a2e" stroke-width="30" stroke-linecap="round" fill="none"/>`;   // the arm back to the trolley
    g += `<path d="M60 -370 Q110 -330 120 -290" stroke="#5a2a2e" stroke-width="30" stroke-linecap="round" fill="none"/>`;
    // the head: silhouette, the blond wig, the oversized sunglasses
    g += `<path d="M-50 -440 Q-66 -370 -48 -340 L-26 -346 Q-40 -392 -38 -436 Z" fill="#d8b85a" stroke="${INK}" stroke-width="3"/><path d="M78 -440 Q94 -370 76 -340 L54 -346 Q68 -392 66 -436 Z" fill="#d8b85a" stroke="${INK}" stroke-width="3"/>`;   // the wig falling to the shoulders
    g += `<ellipse cx="14" cy="-440" rx="46" ry="52" fill="${SIL}" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-44 -436 Q-58 -522 14 -518 Q86 -522 72 -436 Q62 -474 36 -484 Q14 -490 -8 -484 Q-34 -474 -44 -436 Z" fill="#d8b85a" stroke="${INK}" stroke-width="4"/><path d="M-26 -470 Q14 -492 54 -470" stroke="#e8d08a" stroke-width="4" fill="none"/>`;   // the crown and fringe
    g += `<rect x="-20" y="-454" width="36" height="28" rx="11" fill="#1a1c22" stroke="#d8d2c4" stroke-width="4"/><rect x="24" y="-454" width="36" height="28" rx="11" fill="#1a1c22" stroke="#d8d2c4" stroke-width="4"/><path d="M16 -442 L24 -442" stroke="#d8d2c4" stroke-width="4"/>`;   // the oversized sunglasses
    g += `<ellipse cx="22" cy="-404" rx="24" ry="15" fill="#dfe8ee" stroke="${INK}" stroke-width="3"/>`;   // the oxygen mask
    g += `<path d="M58 -300 Q70 -200 66 -40" stroke="${RIM}" stroke-width="4" fill="none" opacity="0.5"/>`;
    return g + '</g>';
  }
  // the posted "security image" on the officer's monitor (our own plain typed graphic): two green melon blobs over a dark
  // store, a HELP IDENTIFY line; cm 0..1 = how many comment bubbles have popped up
  function monitor(t, cm) {
    let g = `<rect x="160" y="560" width="760" height="520" rx="18" fill="#1a2028" stroke="${INK}" stroke-width="8"/><rect x="184" y="584" width="712" height="472" rx="8" fill="#242c36"/>`;
    g += `<rect x="204" y="604" width="672" height="60" rx="6" fill="#2e3844"/><text x="224" y="646" font-family="Arial, sans-serif" font-weight="700" font-size="30" fill="#d8dce0" letter-spacing="2">LOUISA POLICE · HELP IDENTIFY</text>`;
    g += `<rect x="204" y="680" width="420" height="300" rx="6" fill="#0e1218"/><rect x="204" y="880" width="420" height="100" fill="#3a3e46" opacity="0.6"/>`;
    g += `<path d="M300 980 L310 820 L380 790 L410 980 Z" fill="${SIL}"/><path d="M480 980 L490 850 L540 830 L560 980 Z" fill="${SIL}"/>`;
    g += melon(348, 760, 50, 44) + melon(516, 800, 40, 35);
    g += `<rect x="204" y="880" width="420" height="100" fill="none"/>`;
    // the comments column
    const rows = ['A WATERMELON??', 'SEEN THEM IN TOWN', 'THAT TRUCK...'];
    rows.forEach((s, i) => { const k = seg(cm * 3, i, i + 0.6); if (k <= 0) return; g += `<g opacity="${f1(k)}" transform="translate(0 ${f1(12 * (1 - k))})"><rect x="644" y="${690 + i * 96}" width="232" height="72" rx="12" fill="#3a4654"/><text x="760" y="${736 + i * 96}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="20" fill="#e8ecf0">${s}</text></g>`; });
    g += `<rect x="470" y="1080" width="140" height="60" fill="#2a3038" stroke="${INK}" stroke-width="5"/><rect x="380" y="1140" width="320" height="22" rx="6" fill="#2a3038" stroke="${INK}" stroke-width="4"/>`;
    g += wash(540, 820, 420, 300, '#9ab8d8', 0.1);
    return g;
  }
  // the tombstone photo (a plain card): centre (x, y), rotation
  const gravePhoto = (x, y, rot = -8, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s)})"><rect x="-150" y="-110" width="300" height="220" rx="6" fill="#e8e6dc" stroke="${INK}" stroke-width="4"/><rect x="-136" y="-96" width="272" height="160" fill="#6a7a6a"/><rect x="-136" y="30" width="272" height="34" fill="#4a5a44"/><path d="M-60 40 L-60 -40 Q-60 -80 0 -80 Q60 -80 60 -40 L60 40 Z" fill="#9a9a98" stroke="${INK}" stroke-width="3"/><path d="M-36 -40 L36 -40 M-36 -20 L36 -20 M-28 0 L28 0" stroke="#5a5a58" stroke-width="4"/><text x="0" y="92" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="22" fill="#2a2a2a" letter-spacing="2">DIED 2003</text></g>`;

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a convenience store at night: a back wall of shelving with muted bottles and boxes, a glowing cooler door (right),
    // ceiling strip lights, a glass entrance door (left) showing the dark forecourt, a tiled floor
    wm86_shop(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1600" fill="#2a3038"/><rect x="-400" y="-300" width="${W + 800}" height="560" fill="#232930"/>`;
      wall += [0, 1, 2].map(i => `<rect x="${-200 + i * 560}" y="230" width="380" height="16" rx="6" fill="#eef2f4" opacity="0.75"/>`).join('') + wash(540, 260, 900, 140, '#e8f0ff', 0.07);
      // the shelving across the back (muted bottles)
      wall += `<rect x="300" y="460" width="900" height="720" fill="#3a4048" stroke="${INK}" stroke-width="5"/>`;
      const r = R(8601);
      for (let s = 0; s < 4; s++) { const y = 480 + s * 170; let x = 320; while (x < 1180) { const h = 90 + r() * 50; if (r() > 0.2) wall += bottle(x + 24, y + 150, h, ['#4a4038', '#3a4a40', '#44384e', '#4a4a3a'][Math.floor(r() * 4)]); x += 56; } wall += `<rect x="300" y="${y + 150}" width="900" height="14" fill="#7a8088" stroke="${INK}" stroke-width="3"/>`; }
      // the cooler door (right), its light
      wall += `<rect x="1210" y="420" width="300" height="780" fill="#1e2a36" stroke="${INK}" stroke-width="6"/><rect x="1230" y="440" width="260" height="740" fill="#2a4a5e" opacity="0.7"/>` + wash(1340, 800, 240, 460, '#bfe8ff', 0.16);
      for (let i = 0; i < 4; i++) wall += `<path d="M1232 ${500 + i * 170} L1488 ${500 + i * 170}" stroke="#9ac8e0" stroke-width="4" opacity="0.5"/>`;
      // the entrance door (left): glass, the dark forecourt beyond, a lifted pickup's shape far off (no plate, no badge)
      let door = `<rect x="-120" y="380" width="380" height="880" fill="#0c1016" stroke="${INK}" stroke-width="6"/><rect x="-100" y="400" width="340" height="840" fill="#141c26"/>`;
      door += `<path d="M-60 980 L-50 900 Q-30 860 20 856 L120 856 Q170 860 190 900 L200 980 Z" fill="#1a1e24" stroke="${INK}" stroke-width="4"/><rect x="-40" y="950" width="60" height="50" fill="#0c0d10"/><rect x="130" y="950" width="60" height="50" fill="#0c0d10"/>`;
      door += `<path d="M70 400 L70 1240" stroke="#4a5058" stroke-width="10"/><rect x="-100" y="800" width="340" height="16" fill="#4a5058"/>` + wash(70, 700, 200, 400, '#8aa8c8', 0.06);
      let floor = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#6a6e72"/>` + wash(540, 1300, 800, 80, '#ffffff', 0.08);
      for (let i = 0; i < 6; i++) floor += `<path d="M-400 ${1300 + i * 110} L${W + 400} ${1300 + i * 110}" stroke="#5a5e62" stroke-width="3"/>`;
      for (let i = -2; i < 8; i++) floor += `<path d="M${i * 220} 1260 L${i * 300 - 400} ${H + 100}" stroke="#5a5e62" stroke-width="3"/>`;
      return { light: { dir: 1, rim: '#bfe8ff', key: '#e8eef4' }, layers: [[0.2, wall], [0.5, door], [0.85, floor]] };
    },

    // a police office desk at night, close: a dark blue-grey wall, a corkboard with blank cards, a desk lamp's warm pool,
    // the desk top (the monitor is drawn by the shot)
    wm86_desk(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1600" fill="#2a3240"/><rect x="-400" y="-300" width="${W + 800}" height="520" fill="#242c38"/>`;
      wall += `<rect x="-200" y="320" width="520" height="360" fill="#6a5a44" stroke="${INK}" stroke-width="5"/>`;
      const r = R(8611); for (let i = 0; i < 7; i++) wall += `<rect x="${f1(-170 + r() * 400)}" y="${f1(340 + r() * 240)}" width="90" height="70" fill="#e8e4d8" opacity="0.85" transform="rotate(${f1(-6 + r() * 12)} 0 0)"/>`;
      wall += `<rect x="960" y="300" width="300" height="420" fill="#1a2230" stroke="${INK}" stroke-width="6"/>` + Array.from({ length: 11 }, (_, i) => `<path d="M960 ${320 + i * 38} L1260 ${320 + i * 38}" stroke="#4a5a6c" stroke-width="7"/>`).join('');
      wall += `<path d="M1180 760 L1180 1120" stroke="#3a3430" stroke-width="12"/><path d="M1100 780 L1180 740 L1260 780 Z" fill="#d8c8a0" stroke="${INK}" stroke-width="4"/>` + wash(1120, 980, 420, 320, '#ffe0a8', 0.16);
      let desk = `<rect x="-400" y="1150" width="${W + 800}" height="${H}" fill="#4a3c30"/><rect x="-400" y="1130" width="${W + 800}" height="30" fill="#6a5a48" stroke="${INK}" stroke-width="5"/>`;
      desk += `<rect x="1000" y="1200" width="260" height="40" rx="6" fill="#2a3038" stroke="${INK}" stroke-width="4"/><rect x="40" y="1190" width="160" height="110" rx="10" fill="#e8e4d8" stroke="${INK}" stroke-width="4"/>`;
      return { light: { dir: -1, rim: '#ffe0a8', key: '#d8e0ec' }, layers: [[0.3, wall], [0.85, desk]] };
    },

    // an airport coach bay by day: a terminal's glass band behind, a long plain pale coach side-on (no livery), its luggage
    // hold flap raised; o.view 'hold' frames the hold opening large and centred, with bags inside
    wm86_coach(ctx, o = {}) {
      const hold = o.view === 'hold';
      let sky = `<defs><linearGradient id="wm86sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a9ab8"/><stop offset="1" stop-color="#c8d4dc"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1300" fill="url(#wm86sky)"/>`;
      let term = `<rect x="-400" y="300" width="${W + 800}" height="380" fill="#5a6470" stroke="${INK}" stroke-width="5"/>` + Array.from({ length: 12 }, (_, i) => `<rect x="${-380 + i * 160}" y="330" width="130" height="300" fill="#8aa4b8" opacity="0.7"/>`).join('') + `<rect x="-400" y="640" width="${W + 800}" height="40" fill="#3a4450"/>`;
      let bus = '';
      if (!hold) {
        bus += `<path d="M-300 1140 L-300 760 Q-300 700 -240 700 L1300 700 Q1360 700 1360 760 L1360 1140 Z" fill="#d8dce0" stroke="${INK}" stroke-width="7"/>`;
        for (let i = 0; i < 6; i++) bus += `<rect x="${-240 + i * 270}" y="740" width="220" height="150" rx="8" fill="#2e3c4c" stroke="${INK}" stroke-width="4"/>`;
        bus += `<rect x="-300" y="900" width="1660" height="24" fill="#8a94a0"/>`;
        // the hold: the flap raised, the dark opening
        bus += `<rect x="560" y="930" width="460" height="200" fill="#0e1218" stroke="${INK}" stroke-width="5"/><path d="M560 930 L600 800 L1060 800 L1020 930 Z" fill="#c8ccd0" stroke="${INK}" stroke-width="5"/>`;
        bus += `<rect x="600" y="1000" width="140" height="120" rx="8" fill="#3a4250" stroke="${INK}" stroke-width="3"/><rect x="760" y="1020" width="200" height="100" rx="8" fill="#5a4a3a" stroke="${INK}" stroke-width="3"/>`;
        [-140, 1200].forEach(x => { bus += `<circle cx="${x}" cy="1140" r="90" fill="#0c0d10" stroke="${INK}" stroke-width="6"/><circle cx="${x}" cy="1140" r="40" fill="#5a6068"/>`; });
      } else {
        bus += `<rect x="-400" y="300" width="${W + 800}" height="900" fill="#d8dce0" stroke="${INK}" stroke-width="7"/><rect x="-400" y="600" width="${W + 800}" height="30" fill="#8a94a0"/>`;
        bus += `<rect x="-400" y="760" width="${W + 800}" height="500" fill="#0e1218" stroke="${INK}" stroke-width="6"/><path d="M-400 760 L-340 560 L${W + 400} 560 L${W + 400} 760 Z" fill="#c8ccd0" stroke="${INK}" stroke-width="5"/>`;
        bus += `<rect x="-200" y="900" width="260" height="300" rx="10" fill="#3a4250" stroke="${INK}" stroke-width="4"/><rect x="1060" y="960" width="300" height="240" rx="10" fill="#5a4a3a" stroke="${INK}" stroke-width="4"/><rect x="1120" y="860" width="200" height="100" rx="10" fill="#4a3a5a" stroke="${INK}" stroke-width="4"/>`;
        bus += wash(540, 1000, 700, 300, '#c8d8e8', 0.08);
      }
      let ground = `<rect x="-400" y="1240" width="${W + 800}" height="${H}" fill="#6a6e70"/><path d="M-400 1300 L${W + 400} 1300" stroke="#e8e4c8" stroke-width="8" opacity="0.5"/>`;
      return { light: { dir: -1, rim: '#fff4d0', key: '#eef2f6' }, layers: hold ? [[0.3, bus], [0.85, ground]] : [[0.05, sky], [0.25, term], [0.5, bus], [0.85, ground]] };
    },

    // a Brooklyn brownstone front: brown stone facade, tall arched windows, a stoop with iron railings coming down to the
    // right, a street tree, the sidewalk
    wm86_stoop(ctx, o = {}) {
      let sky = `<rect x="-400" y="-300" width="${W + 800}" height="1400" fill="#b8c4cc"/>`;
      let house = `<rect x="-400" y="-300" width="${W + 800}" height="1560" fill="#6a4a3a"/>`;
      for (let y = -280; y < 1260; y += 44) house += `<path d="M-400 ${y} L${W + 400} ${y}" stroke="#5e4232" stroke-width="3"/>`;
      [60, 420, 780].forEach(x => { house += `<path d="M${x} 760 L${x} 420 Q${x + 110} 320 ${x + 220} 420 L${x + 220} 760 Z" fill="#1e2430" stroke="${INK}" stroke-width="6"/><path d="M${x + 110} 420 L${x + 110} 760 M${x} 590 L${x + 220} 590" stroke="#c8bca4" stroke-width="8"/><rect x="${x - 16}" y="760" width="252" height="26" fill="#8a6a50" stroke="${INK}" stroke-width="4"/>`; });
      // the door at the top of the stoop (right)
      house += `<rect x="1120" y="500" width="200" height="420" fill="#2a1e18" stroke="${INK}" stroke-width="6"/><rect x="1100" y="470" width="240" height="40" fill="#8a6a50" stroke="${INK}" stroke-width="4"/>`;
      // the stoop: steps descending leftward from the door to the sidewalk, railings
      let stoop = '';
      for (let i = 0; i < 7; i++) { const x = 1100 - i * 70, y = 920 + i * 48; stoop += `<path d="M${x} ${y} L${x + 70 + i * 70} ${y} L${x + 70 + i * 70} ${y + 48} L${x} ${y + 48} Z" fill="#7a5a44" stroke="${INK}" stroke-width="4"/>`; }
      stoop += `<path d="M1120 900 L1120 860 L620 1240 L620 1280" stroke="#2a2a2e" stroke-width="10" fill="none"/><path d="M1120 860 L620 1240" stroke="#2a2a2e" stroke-width="10"/>`;
      for (let i = 0; i < 8; i++) stoop += `<path d="M${1100 - i * 66} ${f1(878 + i * 48)} L${1100 - i * 66} ${f1(930 + i * 48)}" stroke="#2a2a2e" stroke-width="6"/>`;
      stoop += `<rect x="-200" y="1120" width="40" height="400" fill="#4a3a2a"/><ellipse cx="-180" cy="1000" rx="230" ry="200" fill="#4a6a40"/>`;
      let walk = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#8a8a84"/>`;
      for (let i = 0; i < 8; i++) walk += `<path d="M${-400 + i * 260} 1260 L${-500 + i * 300} ${H + 100}" stroke="#6a6a66" stroke-width="4"/>`;
      walk += `<path d="M-400 1420 L${W + 400} 1420 M-400 1600 L${W + 400} 1600" stroke="#6a6a66" stroke-width="4"/>`;
      const M = s => `<g transform="translate(${W} 0) scale(-1 1)">${s}</g>`;
      return { light: { dir: 1, rim: '#fff4e0', key: '#f0ece4' }, layers: [[0.05, sky], [0.3, M(house)], [0.55, M(stoop)], [0.85, walk]] };
    },

    // an interview room: a plain grey-green wall, a high window with blinds, a wall clock, a long table (drawn in the shot)
    wm86_room(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1600" fill="#4a5450"/><rect x="-400" y="-300" width="${W + 800}" height="520" fill="#424c48"/>`;
      wall += `<rect x="-400" y="1210" width="${W + 800}" height="50" fill="#3a4440" stroke="${INK}" stroke-width="4"/>`;
      wall += `<rect x="640" y="300" width="520" height="300" fill="#1e2a30" stroke="${INK}" stroke-width="6"/>` + Array.from({ length: 9 }, (_, i) => `<path d="M640 ${318 + i * 32} L1160 ${318 + i * 32}" stroke="#8a9aa0" stroke-width="7"/>`).join('') + wash(900, 450, 400, 260, '#d8e8f0', 0.1);
      wall += `<circle cx="200" cy="440" r="70" fill="#e8e6dc" stroke="${INK}" stroke-width="6"/><path d="M200 440 L200 390 M200 440 L236 456" stroke="${INK}" stroke-width="5"/>`;
      wall += `<rect x="-200" y="620" width="300" height="420" fill="#6a5a44" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2].map(i => `<rect x="${-170 + i * 90}" y="660" width="70" height="90" fill="#e8e4d8" opacity="0.8"/>`).join('');
      let floor = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#5a5a56"/>`;
      for (let i = 0; i < 7; i++) floor += `<path d="M-400 ${1310 + i * 90} L${W + 400} ${1310 + i * 90}" stroke="#4a4a46" stroke-width="3"/>`;
      return { light: { dir: 1, rim: '#d8e8f0', key: '#e8ece8' }, layers: [[0.3, wall], [0.85, floor]] };
    }
  });

  const table = (y = 1180) => `<rect x="-200" y="${y}" width="1200" height="300" fill="#5a4a3a" stroke="${INK}" stroke-width="6"/><rect x="-220" y="${y - 26}" width="1240" height="32" fill="#8a7a62" stroke="${INK}" stroke-width="5"/>`;

  E.registerScenes({
    // 1 - hook (frame 0, VARIANT A, the act in progress): the store at night; the melon-head leans over the counter, his hand
    //     closing on a bottle in the first second; the clerk recoils; the second melon-head waits by the door with bottles;
    //     the camera already pushing in; on line 2 the clerk's hands go up and the labels appear
    wm86_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.6), ey = WT(ctx, 1, 0, 2.6), al = WT(ctx, 1, 3, 3.4);
      return E.cine.shot(ctx, {
        set: 'wm86_shop', grade: 'night', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [
          { ...CLERK, keys: [{ at: 0.25, pose: 'hand_to_face', expr: 'shocked', headTurn: -0.3, dur: 0.4 }, { at: ey + 0.1, pose: 'point_up', expr: 'worried', dur: 0.35 }, { at: al + 0.1, pose: 'hand_to_face', expr: 'shocked', dur: 0.35 }] }
        ],
        props: [
          { depth: 1.0, svg: () => counter(1150) },
          { depth: 1.01, accent: true, svg: tt => melonMan(tt, seg(tt, 0.0, 1.0)) },
          { depth: 1.0, svg: tt => melonMan2(tt) },
          { depth: 1.005, svg: tt => tt > al ? bottle(lerp(240, 300, ease.out(seg(tt, al, al + 0.6))), 1180, 110, '#4a3a5a') : '' }
        ],
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.25), x: 60, y: 560, text: 'LOUISA, VIRGINIA · MAY 2020', fs: 38, sub: 'Police: hollowed-out watermelons, eye holes cut (WRIC, CBS, Law&Crime)' },
          { type: 'label', at: al + 0.15, x: 60, y: 1120, text: 'POLICE: THEY TOOK ALCOHOL', fs: 34, sub: 'A shoplifting, not a robbery · generic store, no chain shown' }
        ],
        tag: TAG
      });
    },

    // 2 - THE HEADLINE GOTCHA: close on the police desk; the officer types and the posted image fills the monitor; comment
    //     bubbles pop up on 'pictures'; on 'arrest' she sits back (the hit) and the charges label lands; the FUN FACT
    wm86_post(ctx) {
      const t = ctx.t, T = ctx.T, pc = WT(ctx, 0, 3, 1.1), th = WT(ctx, 0, 4, 1.6), ar = WT(ctx, 0, 7, 2.4);
      return E.cine.shot(ctx, {
        set: 'wm86_desk', grade: 'cold', haze: 0.2, dof: true,
        cam: { from: { x: 0, y: 20, z: 1.1 }, to: { x: 10, y: 30, z: 1.2 } },
        rack: { at: 0.05, dur: 0.6, from: 'bg' },
        figures: [
          { id: 'wm86_officer', x: 1110, y: 1760, scale: 1.15, dir: -1, turn: 0.45, pose: 'sit_type', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#1a2230' },
            keys: [{ at: pc, pose: 'sit_type_b', expr: 'focused', dur: 0.3 }, { at: th, pose: 'sit', expr: 'realise', headTurn: -0.2, dur: 0.35 }, { at: ar + 0.1, pose: 'sit_type', expr: 'stern', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => monitor(tt, seg(tt, pc - 0.1, th + 0.7)) },
          { depth: 1.0, svg: tt => tt > ar ? wash(540, 820, 440, 320, '#fff4d0', f1(0.2 * seg(tt, ar, ar + 0.3))) : '' }
        ],
        overlays: [
          { type: 'label', at: 0.3, until: ar + 0.55, x: 60, y: 1190, text: 'LOUISA POLICE POSTED THE PHOTOS ON FACEBOOK', fs: 32, sub: 'Commenters said they had seen the pair in town (Global News, WRIC)' },
          { type: 'callout', at: ar + 0.3, target: [540, 760], label: [600, 440], text: 'ONE MAN, 20, CHARGED', w: 460, r: 50 },
          { type: 'label', at: ar + 0.4, x: 60, y: 1000, text: 'MASK IN PUBLIC · PETIT LARCENY · UNDERAGE POSSESSION', fs: 28, sub: 'Accused, not tried · second man never identified · AS OF OCT 2026' },
          { type: 'funfact', at: ar + 0.9, y: 1240, rows: [{ text: 'IN VIRGINIA, HIDING YOUR FACE' }, { text: 'IN PUBLIC IS A FELONY' }, { text: 'Code of Virginia § 18.2-422 · Class 6', fs: 26 }] }
        ],
        tag: GEN
      });
    },

    // 3 - REHOOK + CASE 2: the coach bay; the accomplice (silhouette) drags a huge suitcase rightward toward the open hold,
    //     struggling; the driver by the hold turns and watches; the 90-minute counter
    wm86_coach(ctx) {
      const t = ctx.t, T = ctx.T, nt = WT(ctx, 0, 3, 0.9), l2 = LS(ctx, 1, 2.2), sc = WT(ctx, 1, 7, 3.6);
      const haul = seg(t, 0.0, Math.max(1.5, l2 + 0.6));
      const bx = lerp(140, 560, ease.inOut(haul));
      return E.cine.shot(ctx, {
        set: 'wm86_coach', setOpts: { view: 'wide' }, grade: 'none', haze: 0.25,
        cam: { from: { x: -16, y: 20, z: 1.02 }, to: { x: 14, y: 30, z: 1.08 } },
        figures: [
          { id: 'wm86_accomplice', x: 560, y: 1560, scale: 0.6, dir: 1, turn: 0.45, pose: 'walk', silhouette: 'cool', depth: 1.02,
            walk: { at: 0.0, dur: Math.max(1.5, l2 + 0.6), cadence: 2.4, stride: 9, from: 140, to: 560 },
            keys: [{ at: l2 + 0.7, pose: 'bowed', headTurn: 0.2, dur: 0.4 }, { at: sc, pose: 'hands_together', dur: 0.4 }] },
          { id: 'wm86_driver', x: 1080, y: 1560, scale: 0.6, dir: -1, turn: 0.4, pose: 'arms_crossed', expr: 'neutral', depth: 1.02, hat: { style: 'flatcap', color: '#2a3038' },
            keys: [{ at: nt, pose: 'stand', expr: 'focused', headTurn: 0.3, dur: 0.4 }, { at: l2 + 0.3, pose: 'hand_to_face', expr: 'worried', dur: 0.4 }, { at: sc, pose: 'point', expr: 'realise', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.03, svg: tt => suitcase(bx - 150 + Math.sin(tt * 2.4) * 2, 1560, -8 + Math.sin(tt * 2.4) * 3, 1.0) },
          { depth: 1.0, svg: tt => tt > sc ? wash(640, 1030, 260, 120, '#fff4d0', f1(0.18 * seg(tt, sc, sc + 0.4))) : '' }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'GIRONA AIRPORT COACH · JUNE 2011', fs: 38, sub: 'Spanish police (CBS News, Fox News, ABC7, TIME)' },
          { type: 'counter', at: sc - 0.1, dur: 1.1, from: 0, to: 90, prefix: '', suffix: '', label: 'MINUTES IN THE LUGGAGE HOLD', y: 1060, fs: 120 }
        ],
        tag: TAG
      });
    },

    // 4 - CASE 2's GOTCHA: the hold, open and large; the officer kneels and knocks on the suitcase (the knock), the lid lifts
    //     on 'warm' and a sweating silhouette is curled inside; the accomplice at right puts his hands behind his back
    wm86_hold(ctx) {
      const t = ctx.t, T = ctx.T, kn = WT(ctx, 0, 1, 0.6), wm = WT(ctx, 0, 5, 1.9), l2 = LS(ctx, 1, 2.8), sw = WT(ctx, 1, 2, 3.4), ar = WT(ctx, 1, 5, 4.2);
      const lid = seg(t, wm - 0.1, wm + 0.6), sweat = seg(t, wm, wm + 0.8);
      return E.cine.shot(ctx, {
        set: 'wm86_coach', setOpts: { view: 'hold' }, grade: 'cold', haze: 0.2,
        cam: { from: { x: 0, y: 30, z: 1.02 }, to: { x: 0, y: 10, z: 1.08 } },
        figures: [
          { id: 'wm86_officer_es', x: 120, y: 1600, scale: 0.9, dir: 1, turn: 0.45, pose: 'kneel', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#1c2a4a' },
            keys: [{ at: kn - 0.1, pose: 'examine', expr: 'focused', dur: 0.3 }, { at: kn + 0.2, pose: 'kneel', expr: 'focused', dur: 0.25 }, { at: wm, pose: 'hand_to_face', expr: 'shocked', headTurn: 0.2, dur: 0.4 }, { at: sw, pose: 'point', expr: 'stern', dur: 0.4 }] },
          { id: 'wm86_accomplice', x: 940, y: 1600, scale: 0.7, dir: -1, turn: 0.4, pose: 'stand_tense', silhouette: 'cool', depth: 1.02,
            keys: [{ at: wm + 0.3, pose: 'hand_to_face', headTurn: -0.3, dur: 0.4 }, { at: ar, pose: 'hands_behind', headTurn: -0.2, dur: 0.5 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => openCase(620, 1200, lid, sweat, tt) },
          { depth: 1.01, svg: tt => { const k = seg(tt, kn, kn + 0.5); return k > 0 && k < 1 ? [0, 1, 2].map(i => `<path d="M${f1(480 + i * 24 - 60 * k)} ${f1(1040 - 40 * k - i * 10)} q${f1(14 + i * 6)} -12 ${f1(28 + i * 12)} 0" stroke="#e8eef4" stroke-width="4" fill="none" opacity="${f1(0.7 * (1 - k))}"/>`).join('') : ''; } },
          { depth: 1.0, svg: tt => tt > wm ? wash(620, 1120, 300, 140, '#ffb070', f1(0.16 * seg(tt, wm, wm + 0.5))) : '' }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'A DRIVER NOTICED A VERY HEAVY SUITCASE', fs: 36, sub: 'He called police · the case felt unusually warm (CBS News, Fox News)' },
          { type: 'callout', at: wm + 0.3, target: [480, 1110], label: [560, 900], text: 'WARM', w: 240, r: 50 },
          { type: 'label', at: ar + 0.1, x: 60, y: 1190, text: 'TWO MEN ARRESTED · A LAPTOP AND A GPS REPORTED STOLEN', fs: 30, sub: 'Spanish police, June 2011 (CBS News, TIME)' }
        ],
        tag: TAG
      });
    },

    // 5 - REHOOK + CASE 3: the brownstone; the disguised silhouette (wig, sunglasses, cardigan, the oxygen tank) comes down
    //     the stoop onto the sidewalk; a passer-by walking right glances and looks again; the years label
    wm86_stoop(ctx) {
      const t = ctx.t, T = ctx.T, sx = WT(ctx, 0, 3, 1.2), l2 = LS(ctx, 1, 2.2), dr = WT(ctx, 1, 3, 3.0), mo = WT(ctx, 1, 7, 4.2);
      const down = ease.inOut(seg(t, 0.0, Math.max(2.0, l2 + 0.4)));
      const gx = lerp(W - 1080, W - 560, down), gy = lerp(920, 1260, down);
      return E.cine.shot(ctx, {
        set: 'wm86_stoop', grade: 'warm', haze: 0.2,
        cam: { from: { x: 16, y: 10, z: 1.02 }, to: { x: -10, y: 20, z: 1.08 } },
        figures: [
          { id: 'wm86_neighbour', x: 280, y: 1660, scale: 0.6, dir: 1, turn: 0.4, pose: 'walk', expr: 'neutral', depth: 1.03,
            walk: { at: 0.0, dur: Math.max(1.8, dr), cadence: 3.0, stride: 12, from: -200, to: 280 },
            keys: [{ at: sx, pose: 'walk', expr: 'focused', headTurn: 0.5, dur: 0.3 }, { at: dr + 0.1, pose: 'stand_tense', expr: 'shocked', headTurn: 0.6, dur: 0.35 }, { at: mo, pose: 'hand_to_face', expr: 'worried', headTurn: 0.5, dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => granny(gx, gy, 0.74, tt * 7 * (down < 1 ? 1 : 0)) }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'BROOKLYN, NEW YORK · 2003-2009', fs: 38, sub: 'Blond wig, dress, oversized sunglasses (AP, Reuters, NBC)' },
          { type: 'label', at: dr + 0.2, x: 60, y: 1120, text: 'HER SOCIAL SECURITY CHEQUES · A $2.2M BROWNSTONE', fs: 32, sub: 'Prosecutors · he even renewed her driver\'s licence in person' }
        ],
        tag: TAG
      });
    },

    // 6 - CASE 3's GOTCHA (the single impact, the music drop): the interview room, close; the disguised silhouette sits at
    //     the table with the oxygen tank; the investigator slides the tombstone photo across on 'gravestone' (the impact);
    //     the sentence label on line 2
    wm86_room(ctx) {
      const t = ctx.t, T = ctx.T, mt = WT(ctx, 0, 1, 0.5), hr = WT(ctx, 0, 2, 0.9), gv = WT(ctx, 0, 5, 2.2), l2 = LS(ctx, 1, 3.2), cv = WT(ctx, 1, 0, 3.2), yr = WT(ctx, 1, 4, 4.2);
      const slide = ease.inOut(seg(t, gv - 0.45, gv + 0.05));
      return E.cine.shot(ctx, {
        set: 'wm86_room', grade: 'cold', haze: 0.2, dof: true,
        cam: { from: { x: 0, y: 20, z: 1.1 }, to: { x: 6, y: 30, z: 1.22 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'wm86_investigator', x: 1000, y: 1760, scale: 1.15, dir: -1, turn: 0.45, pose: 'read', expr: 'neutral', depth: 1.02,
            keys: [{ at: mt, pose: 'present', expr: 'focused', headTurn: -0.2, dur: 0.4 }, { at: gv - 0.5, pose: 'point', expr: 'stern', dur: 0.4 }, { at: gv + 0.3, pose: 'arms_crossed', expr: 'stern', dur: 0.4 }, { at: cv, pose: 'hands_together', expr: 'determined', dur: 0.4 }, { at: yr, pose: 'arms_crossed', expr: 'stern', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => granny(330, 1330, 0.95, 0) },
          { depth: 1.01, svg: () => table(1180) },
          { depth: 1.015, svg: tt => tt > gv - 0.5 ? gravePhoto(lerp(980, 520, slide), lerp(1110, 1080, slide), lerp(6, -8, slide), 1.0) + (tt > gv ? wash(520, 1080, 220, 160, '#fff4d0', f1(0.25 * seg(tt, gv, gv + 0.4))) : '') : '' }
        ],
        overlays: [
          { type: 'impact', at: gv, x: 520, y: 1080 },
          { type: 'label', at: hr + 0.15, x: 60, y: 560, text: 'HE CAME IN A RED CARDIGAN, LIPSTICK AND AN OXYGEN TANK', fs: 32, sub: 'Prosecutors · investigators already held a photo of her tombstone' },
          { type: 'label', at: yr + 0.1, x: 60, y: 760, text: 'CONVICTED MAY 2012 · 13⅔ TO 41 YEARS', fs: 34, sub: 'Grand larceny, mortgage fraud, forgery (AP, Reuters)' }
        ],
        tag: TAG
      });
    },

    // 7 - the one closing line on the store in frame 1's framing (the loop): the same melon-heads, the same clerk; the
    //     camera and the reach ease back to frame 1's start; the status label
    wm86_end(ctx) {
      const t = ctx.t, T = ctx.T;
      const back = Math.max(1.2, T - 0.5);
      const k = 1 - ease.inOut(seg(t, 0.1, back));
      return E.cine.shot(ctx, {
        set: 'wm86_shop', grade: 'night', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: back }] },
        // the clerk glances at the thief on the callback line and is back in frame 1's pose before the last frame (the loop)
        figures: [
          { ...CLERK, keys: [{ at: 0.25, pose: 'stand_tense', expr: 'worried', headTurn: -0.35, dur: 0.4 }, { at: Math.max(1.0, T - 1.1), pose: 'stand_tense', expr: 'worried', headTurn: 0, dur: 0.5 }] }
        ],
        props: [
          { depth: 1.0, svg: () => counter(1150) },
          { depth: 1.01, accent: true, svg: tt => melonMan(Math.max(0, T - tt), k) },
          { depth: 1.0, svg: tt => melonMan2(Math.max(0, T - tt)) }
        ],
        overlays: [],
        tag: TAG
      });
    }
  });
})();
