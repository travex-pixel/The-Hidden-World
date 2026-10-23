/* Case File 85 (premium look, ENGINE V6: promise -> proof -> escalate -> callback): DUMBEST GETAWAYS, 1.
   HEADLINE (this week): Monday 12 October 2026, Chillicothe, Ohio: officers answering a reported active burglary were
   pointed upstairs by the owner's relative, who had found the inner back-door lock missing, and found a man asleep in a
   bed in a second-floor bedroom of a house he had no permission to be in; booked on a burglary charge (accused only). He
   told police he was "just sleeping" and that an acquaintance called Chad had shown him the house (the callback).
   CASE 2: Frenchtown Township, Monroe County, Michigan: a burglar fell down the basement stairs at about 3:15 am, the noise
   woke the homeowners, deputies found him hiding in the basement (no year in the extracts; none shown).
   CASE 3 (best last): 1 October 2026, Oklahoma County: a suspected copper thief dived head-first through a closed window on
   a deputy's body camera and left his backpack behind, with his driver's licence inside.
   Structure (v6): frame 1 = the HERO, a sound-off picture of the headline: an upstairs bedroom, a big bed in the upper-middle
   of the frame with a silhouette fast asleep under a gold duvet (the one accent object), an officer's torch beam from the
   doorway already sweeping across him, the camera already pushing in. The headline gotcha before 9 s at the back door (the
   relative walks in, phones, points upstairs; the officer arrives). Case 2 in a dark Michigan hallway (the 13 % counter),
   then the top of the basement stairs (he drops out of frame, the light snaps on, the homeowner appears). Case 3 in a gutted
   vacant room with a plain body-camera HUD (the FUN FACT), then the dive through the window (the single impact, the music
   drop) and the backpack with the licence. The one closing line back on frame 1's bedroom: the same figures and poses, the
   camera and the beam easing back to frame 1's start (the loop), with the end card.
   Smoothness: cuts and dissolves, one push (into case 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact. Screen direction: the accused move LEFT TO RIGHT (to the basement door, to the window).
   Look: episode.look = 'premium', one cool night palette (shadow #141a24, mid #c8bfae, accent #e6b04a). The strongly
   coloured object is the duvet (prop marked accent: true); everything else is muted.
   Content rules: nobody is hurt; no weapon, no force. The three men are dark silhouettes tagged NOT A LIKENESS (the
   sleeper is a drawn silhouette under the duvet); the relative, the homeowner, the officer and the deputies are generic
   figures; no real address, badge, patch or department marking; the body-camera HUD is our own plain graphic.
   New environments (E.registerSets): ab85_bedroom (an upstairs bedroom, curtains drawn, the doorway left), ab85_backdoor
   (a kitchen back door with the stairs rising right), ab85_hall (a dark hallway, the basement door ajar), ab85_stairs (the
   top of the basement stairs), ab85_vacant (a gutted living room; view 'wide' or 'window'). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#10141a';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · NOT A LIKENESS';
  const GEN = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#e6b04a';

  // ---------- THE HERO: the bed with the sleeper (set coordinates; drawn as a prop so it sits in front of the floor)
  // o.breathe = time (the duvet rises and falls), o.lit = 0..1 and o.litX = where the torch light lands
  function bed(t, o = {}) {
    const br = Math.sin(t * 1.7) * 4;
    let g = '';
    // the headboard against the back wall
    g += `<path d="M380 1000 L380 720 Q380 690 410 690 L990 690 Q1020 690 1020 720 L1020 1000 Z" fill="#5a4234" stroke="${INK}" stroke-width="6"/>`;
    g += `<rect x="410" y="716" width="580" height="22" rx="6" fill="#6e5240"/><path d="M420 760 L980 760 M420 800 L980 800" stroke="#4a3628" stroke-width="5"/>`;
    // the base and legs (under the mattress)
    g += `<path d="M340 1180 L1060 1180 L1060 1240 L340 1240 Z" fill="#3e2c22" stroke="${INK}" stroke-width="5"/><rect x="350" y="1240" width="40" height="40" fill="#2e2018"/><rect x="1010" y="1240" width="40" height="40" fill="#2e2018"/>`;
    // the mattress (a trapezoid, foot toward us) and the sheet
    g += `<path d="M400 880 L1000 880 L1070 1190 L330 1190 Z" fill="#d8d2c4" stroke="${INK}" stroke-width="6"/>`;
    // the pillows
    g += `<path d="M430 850 Q560 830 700 850 L700 920 Q560 935 430 920 Z" fill="#ece8dc" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M715 850 Q845 830 985 850 L985 920 Q845 935 715 920 Z" fill="#ece8dc" stroke="${INK}" stroke-width="5"/>`;
    // the sleeper's head on the right pillow (a dark silhouette, hair tuft, rim light), rocking a touch with the breath
    g += `<g transform="translate(850 ${f1(890 + br * 0.4)})"><ellipse cx="0" cy="0" rx="50" ry="44" fill="#171b22" stroke="${INK}" stroke-width="4"/><path d="M-46 -14 Q-20 -58 30 -40 Q46 -30 44 -8" fill="#101318"/><path d="M-44 10 Q-36 36 -4 42" stroke="#7a8aa8" stroke-width="5" fill="none" opacity="0.6"/></g>`;
    // the duvet (the accent object) with the body lump breathing under it; the top edge turned down
    g += `<g transform="translate(0 ${f1(br)})"><path d="M400 960 Q700 940 1000 960 L1062 1150 L338 1150 Z" fill="${ACC}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M560 985 Q700 950 880 985 Q920 1050 860 1110 L560 1110 Q500 1050 560 985 Z" fill="#fff" opacity="0.14"/>`;
    g += `<path d="M400 960 Q700 940 1000 960 L1000 1000 Q700 985 400 1000 Z" fill="#f0e2b0" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M560 1070 Q700 1030 880 1070" stroke="#a87a28" stroke-width="5" fill="none" opacity="0.6"/></g>`;
    for (let i = 0; i < 3; i++) { const ph = ((t * 0.42 + i / 3) % 1); g += `<text x="${f1(890 + i * 6 + 70 * ph)}" y="${f1(820 - 150 * ph)}" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="${f1(34 + 26 * ph)}" fill="#e8eef8" opacity="${f1(0.85 * Math.sin(ph * Math.PI))}">Z</text>`; }
    // one arm hanging over the far side
    g += `<path d="M996 1010 Q1046 1060 1038 1150" stroke="#171b22" stroke-width="30" stroke-linecap="round"/>`;
    if (o.lit > 0) g += wash(o.litX, 1010, 260, 150, '#fff4d0', f1(0.3 * o.lit)) + wash(o.litX, 1010, 110, 70, '#fff8e0', f1(0.25 * o.lit));
    return g;
  }
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 12, y: 16, z: 1.09 };
  const OFFICER = { id: 'ab85_officer', x: 190, y: 1600, scale: 0.51, dir: 1, turn: 0.35, pose: 'torch', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#1a2230' } };
  // the torch sweep: aim in degrees (118 = up-right at the wall, 86 = level-right onto the sleeper)
  const sweepAim = k => lerp(118, 86, ease.inOut(k));
  const litX = k => lerp(520, 850, ease.inOut(k));
  // the hook/end torch beam drawn from a FIXED origin at the torch tip (not from the swaying arm), so frame 1 and the
  // last frame carry the identical wedge (the loop check); the figure's own beam is switched off in these two shots
  const TIP = [372, 1242];
  function beamProp(aimDeg) {
    const a = aimDeg * Math.PI / 180, L = 860, sp = 0.32, dx = Math.sin(a), dy = Math.cos(a);
    const l1 = [TIP[0] + Math.sin(a - sp) * L, TIP[1] + Math.cos(a - sp) * L], l2 = [TIP[0] + Math.sin(a + sp) * L, TIP[1] + Math.cos(a + sp) * L], end = [TIP[0] + dx * L, TIP[1] + dy * L];
    return `<defs><linearGradient id="ab85bm" gradientUnits="userSpaceOnUse" x1="${f1(TIP[0])}" y1="${f1(TIP[1])}" x2="${f1(end[0])}" y2="${f1(end[1])}"><stop offset="0" stop-color="#fff4cf" stop-opacity="0.5"/><stop offset="1" stop-color="#fff4cf" stop-opacity="0"/></linearGradient></defs><path d="M${f1(TIP[0])} ${f1(TIP[1])} L${f1(l1[0])} ${f1(l1[1])} L${f1(l2[0])} ${f1(l2[1])} Z" fill="url(#ab85bm)" style="mix-blend-mode:screen"/>`;
  }

  // a plain body-camera HUD (no department marking): corner brackets, REC, a plain date
  function hud(t, op = 1) {
    let g = `<g opacity="${f1(op)}" stroke="#e8eef4" stroke-width="5" fill="none">`;
    [[70, 300], [W - 70, 300], [70, 1260], [W - 70, 1260]].forEach(([x, y]) => { const sx = x < W / 2 ? 1 : -1, sy = y < H / 2 ? 1 : -1; g += `<path d="M${x} ${y + sy * 50} L${x} ${y} L${x + sx * 50} ${y}"/>`; });
    g += `</g><g opacity="${f1(op)}"><circle cx="110" cy="1215" r="12" fill="#ff4a3a" opacity="${f1(0.5 + 0.5 * Math.sin(t * 4))}"/><text x="136" y="1226" font-family="Arial, sans-serif" font-weight="700" font-size="30" fill="#e8eef4" letter-spacing="3">REC</text>`;
    g += `<text x="${W - 70}" y="1226" text-anchor="end" font-family="Arial, sans-serif" font-weight="700" font-size="28" fill="#e8eef4" letter-spacing="2">BODY CAM · 01 OCT 2026</text></g>`;
    return g;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // an upstairs bedroom in the afternoon with the curtains drawn: a muted blue wall, the doorway on the left (a dark
    // landing, the door swung into the room), a curtained window on the right with a slit of daylight, a framed picture,
    // a bedside table; wooden floor. The bed is drawn by the shot (a prop) so figures can stand around it
    ab85_bedroom(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1560" fill="#3a4656"/><rect x="-400" y="1210" width="${W + 800}" height="50" fill="#2c3542" stroke="${INK}" stroke-width="4"/>`;
      wall += `<rect x="-400" y="-300" width="${W + 800}" height="360" fill="#33404e"/><path d="M-400 60 L${W + 400} 60" stroke="#2a3340" stroke-width="6"/>`;
      // the picture
      wall += `<rect x="470" y="400" width="170" height="130" fill="#6a6050" stroke="${INK}" stroke-width="5"/><rect x="486" y="416" width="138" height="98" fill="#8a9aa8"/><path d="M486 490 L540 450 L580 480 L624 440 L624 514 L486 514 Z" fill="#4a5a48"/>`;
      // the window with drawn curtains and a slit of afternoon light
      wall += `<rect x="770" y="300" width="300" height="470" fill="#1e2630" stroke="${INK}" stroke-width="6"/>`;
      wall += `<rect x="760" y="300" width="150" height="500" fill="#8a7a5e" stroke="${INK}" stroke-width="5"/><rect x="930" y="300" width="150" height="500" fill="#8a7a5e" stroke="${INK}" stroke-width="5"/>`;
      for (let i = 0; i < 4; i++) wall += `<path d="M${790 + i * 30} 300 L${780 + i * 30} 800 M${960 + i * 30} 300 L${950 + i * 30} 800" stroke="#6e6048" stroke-width="4"/>`;
      wall += `<rect x="908" y="300" width="24" height="500" fill="#f4e4b8" opacity="0.8"/>` + wash(920, 560, 200, 420, '#ffe8b0', 0.14) + `<rect x="750" y="796" width="340" height="18" rx="4" fill="#5a4a38" stroke="${INK}" stroke-width="4"/>`;
      // the doorway (left): the frame, the dark landing, the door swung into the room
      let door = `<rect x="70" y="430" width="250" height="800" fill="#0c1016" stroke="${INK}" stroke-width="6"/><rect x="52" y="412" width="286" height="18" fill="#5a4a38" stroke="${INK}" stroke-width="4"/><rect x="52" y="412" width="18" height="820" fill="#5a4a38" stroke="${INK}" stroke-width="4"/><rect x="320" y="412" width="18" height="820" fill="#5a4a38" stroke="${INK}" stroke-width="4"/>`;
      door += `<path d="M338 420 L420 470 L420 1260 L338 1230 Z" fill="#6a5440" stroke="${INK}" stroke-width="5"/><circle cx="404" cy="860" r="9" fill="#c8a868"/>`;
      // the bedside table and lamp (right of the bed)
      let table = `<rect x="1030" y="1060" width="110" height="180" fill="#4a3628" stroke="${INK}" stroke-width="5"/><rect x="1060" y="960" width="50" height="100" fill="#2e2418"/><path d="M1035 970 L1135 970 L1120 900 L1050 900 Z" fill="#d8c8a0" stroke="${INK}" stroke-width="4"/>`;
      let floor = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#5a4a3a"/>`;
      for (let i = 0; i < 9; i++) floor += `<path d="M-400 ${1300 + i * 80} L${W + 400} ${1300 + i * 80}" stroke="#4a3c2e" stroke-width="3"/>`;
      floor += `<rect x="300" y="1300" width="700" height="360" rx="10" fill="#6a5a60" opacity="0.5"/>`;
      return { light: { dir: 1, rim: '#ffe0a0', key: '#dce4f0' }, layers: [[0.2, wall + door], [0.5, table], [0.85, floor]] };
    },

    // a kitchen back door: a pale wall with the back door (open, a storm door beyond, daylight), the staircase rising on the
    // right with a railing, a counter on the far left
    ab85_backdoor(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1560" fill="#8a8678"/><rect x="-400" y="-300" width="${W + 800}" height="420" fill="#7a7668"/>`;
      wall += `<rect x="-400" y="1210" width="${W + 800}" height="50" fill="#6a6658" stroke="${INK}" stroke-width="4"/>`;
      // the counter (far left)
      wall += `<rect x="-400" y="980" width="340" height="280" fill="#5a5048" stroke="${INK}" stroke-width="5"/><rect x="-400" y="960" width="360" height="30" fill="#c8c0b0" stroke="${INK}" stroke-width="4"/>`;
      // the back door: the frame, the opening (daylight), the door swung in (its lock plate empty), a storm door beyond
      let door = `<rect x="280" y="430" width="260" height="800" fill="#d8e4e8" stroke="${INK}" stroke-width="6"/>` + wash(410, 800, 260, 500, '#fff4d0', 0.22);
      door += `<rect x="300" y="450" width="220" height="760" fill="none" stroke="#9aa4a8" stroke-width="8"/><path d="M410 450 L410 1210 M300 830 L520 830" stroke="#9aa4a8" stroke-width="6"/>`;
      door += `<rect x="262" y="412" width="296" height="18" fill="#5a4a38" stroke="${INK}" stroke-width="4"/><rect x="262" y="412" width="18" height="820" fill="#5a4a38" stroke="${INK}" stroke-width="4"/><rect x="540" y="412" width="18" height="820" fill="#5a4a38" stroke="${INK}" stroke-width="4"/>`;
      door += `<path d="M558 420 L660 480 L660 1270 L558 1230 Z" fill="#6a5440" stroke="${INK}" stroke-width="5"/>`;
      // the empty lock hole in the door edge
      door += `<ellipse cx="640" cy="870" rx="14" ry="26" fill="#0e1014" stroke="${INK}" stroke-width="3"/><rect x="626" y="900" width="28" height="12" fill="#0e1014"/>`;
      // the staircase rising to the right
      let stairs = '';
      for (let i = 0; i < 8; i++) { const x = 700 + i * 60, y = 1230 - i * 80; stairs += `<path d="M${x} ${y} L${x + 60} ${y} L${x + 60} ${y - 80} L${W + 400} ${y - 80} L${W + 400} ${y + 80} L${x} ${y + 80} Z" fill="#6a5a48" stroke="${INK}" stroke-width="4"/>`; }
      stairs += `<rect x="690" y="580" width="${W}" height="660" fill="#5a4a3a" opacity="0"/>`;
      stairs += `<path d="M720 1180 L1180 560" stroke="#3e2c22" stroke-width="14"/><path d="M720 1200 L720 1100 M840 1040 L840 940 M960 880 L960 780 M1080 720 L1080 620" stroke="#3e2c22" stroke-width="10"/>`;
      let floor = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#9a9284"/>`;
      for (let i = 0; i < 7; i++) floor += `<path d="M-400 ${1310 + i * 90} L${W + 400} ${1310 + i * 90}" stroke="#8a8274" stroke-width="3"/>`;
      return { light: { dir: -1, rim: '#fff4d0', key: '#f0ece0' }, layers: [[0.2, wall], [0.45, door + stairs], [0.85, floor]] };
    },

    // a dark hallway at night: a moonlit window (left), framed photos, a rug, the basement door ajar on the right with a
    // few steps visible in the gap
    ab85_hall(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1560" fill="#232a36"/><rect x="-400" y="1210" width="${W + 800}" height="50" fill="#1a2028" stroke="${INK}" stroke-width="4"/>`;
      wall += `<rect x="-200" y="380" width="300" height="420" fill="#4a5a78" stroke="${INK}" stroke-width="6"/><path d="M-50 380 L-50 800 M-200 590 L100 590" stroke="${INK}" stroke-width="6"/>` + wash(-50, 590, 320, 420, '#b8c8e8', 0.16);
      wall += `<path d="M-40 1260 L260 1260 L140 820 L-80 820 Z" fill="#b8c8e8" opacity="0.08"/>`;
      [360, 500].forEach(x => { wall += `<rect x="${x}" y="470" width="110" height="140" fill="#3a3028" stroke="${INK}" stroke-width="4"/><rect x="${x + 14}" y="484" width="82" height="112" fill="#56606c"/>`; });
      let door = `<rect x="760" y="430" width="200" height="800" fill="#0a0d12" stroke="${INK}" stroke-width="6"/>`;
      for (let i = 0; i < 4; i++) door += `<path d="M${780} ${1200 - i * 60} L${940} ${1200 - i * 60}" stroke="#2a3038" stroke-width="6"/>`;
      door += `<rect x="742" y="412" width="236" height="18" fill="#3e3028" stroke="${INK}" stroke-width="4"/><rect x="742" y="412" width="18" height="820" fill="#3e3028" stroke="${INK}" stroke-width="4"/><rect x="960" y="412" width="18" height="820" fill="#3e3028" stroke="${INK}" stroke-width="4"/>`;
      door += `<path d="M978 420 L1050 460 L1050 1250 L978 1230 Z" fill="#4a3a2c" stroke="${INK}" stroke-width="5"/><circle cx="1036" cy="860" r="8" fill="#9a8a68"/>`;
      let floor = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#3a3028"/>`;
      for (let i = 0; i < 8; i++) floor += `<path d="M-400 ${1300 + i * 85} L${W + 400} ${1300 + i * 85}" stroke="#2e261e" stroke-width="3"/>`;
      floor += `<rect x="200" y="1330" width="800" height="300" rx="8" fill="#5a3a3a" opacity="0.5"/>`;
      return { light: { dir: -1, rim: '#b8c8e8', key: '#9aa8c0' }, layers: [[0.2, wall], [0.5, door], [0.85, floor]] };
    },

    // the top of the basement stairs, seen from the hallway: a wide door frame, the stairs dropping away into darkness,
    // a bare bulb (o.lit 0..1 switches it on and brightens the stairwell)
    ab85_stairs(ctx, o = {}) {
      const lit = o.lit || 0;
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1560" fill="#232a36"/><rect x="-400" y="1210" width="${W + 800}" height="50" fill="#1a2028" stroke="${INK}" stroke-width="4"/>`;
      let well = `<rect x="240" y="300" width="600" height="930" fill="#07090d" stroke="${INK}" stroke-width="6"/>`;
      // the stairs: steps receding downward (each narrower and lower)
      for (let i = 0; i < 9; i++) { const k = i / 8, y = 1230 - i * 70 - k * k * 160, hw = 300 - i * 24; const c = lit > 0 ? `rgb(${f1(50 + 50 * lit - i * 4 * lit)},${f1(44 + 40 * lit - i * 3 * lit)},${f1(36 + 30 * lit)})` : '#1a1c22'; well += `<path d="M${540 - hw} ${y} L${540 + hw} ${y} L${540 + hw} ${y + 20 + i * 2} L${540 - hw} ${y + 20 + i * 2} Z" fill="${c}" stroke="${INK}" stroke-width="3"/>`; }
      well += `<path d="M250 1150 L300 420" stroke="#3a3028" stroke-width="12"/><path d="M830 1150 L780 420" stroke="#3a3028" stroke-width="12"/>`;
      well += `<path d="M540 300 L540 380" stroke="#2a2a2a" stroke-width="4"/><circle cx="540" cy="400" r="22" fill="${lit > 0 ? '#fff0b0' : '#4a4a40'}" stroke="${INK}" stroke-width="3"/>` + (lit > 0 ? wash(540, 700, 420, 520, '#ffe8a0', f1(0.3 * lit)) : '');
      well += `<rect x="222" y="282" width="636" height="18" fill="#3e3028" stroke="${INK}" stroke-width="4"/><rect x="222" y="282" width="18" height="960" fill="#3e3028" stroke="${INK}" stroke-width="4"/><rect x="840" y="282" width="18" height="960" fill="#3e3028" stroke="${INK}" stroke-width="4"/>`;
      well += `<path d="M858 290 L950 340 L950 1260 L858 1240 Z" fill="#4a3a2c" stroke="${INK}" stroke-width="5"/>`;
      let floor = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#3a3028"/>`;
      for (let i = 0; i < 8; i++) floor += `<path d="M-400 ${1300 + i * 85} L${W + 400} ${1300 + i * 85}" stroke="#2e261e" stroke-width="3"/>`;
      if (lit > 0) floor += wash(540, 1400, 600, 260, '#ffe8a0', f1(0.18 * lit)) + wash(-100, 700, 500, 700, '#ffe8a0', f1(0.12 * lit));
      return { light: { dir: -1, rim: lit > 0 ? '#ffe0a0' : '#b8c8e8', key: lit > 0 ? '#f0e0c0' : '#9aa8c0' }, layers: [[0.2, wall], [0.5, well], [0.85, floor]] };
    },

    // a gutted vacant living room: bare drywall with channels cut open (studs, dangling wires), a doorway (left), a big
    // window on the right (o.view 'window' frames it larger; o.broken draws the shattered pane), debris on a bare floor
    ab85_vacant(ctx, o = {}) {
      const win = o.view === 'window';
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1560" fill="#b8b0a0"/><rect x="-400" y="1210" width="${W + 800}" height="50" fill="#8a8274" stroke="${INK}" stroke-width="4"/>`;
      // channels cut into the drywall: dark strips with studs and a loose wire
      [-120, 60, 420, 600].forEach((x, i) => { wall += `<rect x="${x}" y="300" width="70" height="910" fill="#4a3e34" stroke="${INK}" stroke-width="4"/><rect x="${x + 20}" y="300" width="30" height="910" fill="#6a5a48"/>`; if (i % 2) wall += `<path d="M${x + 35} 700 Q${x + 90} 800 ${x + 50} 960" stroke="#9a6a3a" stroke-width="6" fill="none"/>`; });
      wall += `<path d="M-400 300 L${W + 400} 300" stroke="#9a9284" stroke-width="6"/>`;
      // the doorway (left, far), the window (right)
      let door = `<rect x="-300" y="430" width="200" height="800" fill="#2a2e34" stroke="${INK}" stroke-width="6"/>`;
      const wx = win ? 560 : 720, wy = win ? 360 : 440, ww = win ? 460 : 320, wh = win ? 620 : 520;
      let window_ = `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="#5a7488" stroke="${INK}" stroke-width="6"/>` + wash(wx + ww / 2, wy + wh / 2, ww * 0.6, wh * 0.6, '#c8e0f0', 0.18);
      window_ += `<path d="M${wx + ww / 2} ${wy} L${wx + ww / 2} ${wy + wh} M${wx} ${wy + wh / 2} L${wx + ww} ${wy + wh / 2}" stroke="#d8d4c8" stroke-width="10"/>`;
      window_ += `<rect x="${wx - 16}" y="${wy - 16}" width="${ww + 32}" height="${wh + 32}" fill="none" stroke="#d8d4c8" stroke-width="16"/><rect x="${wx - 16}" y="${wy - 16}" width="${ww + 32}" height="${wh + 32}" fill="none" stroke="${INK}" stroke-width="4"/>`;
      let floor = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#7a7266"/>`;
      const r = R(8511); for (let i = 0; i < 26; i++) { const x = -300 + r() * 1700, y = 1280 + r() * 500; floor += `<path d="M${f1(x)} ${f1(y)} l${f1(20 + r() * 40)} ${f1(-6 + r() * 12)} l${f1(-8 + r() * 10)} 10 Z" fill="#9a8e7c" stroke="${INK}" stroke-width="2"/>`; }
      floor += `<path d="M300 1400 Q500 1360 700 1420" stroke="#9a6a3a" stroke-width="7" fill="none"/>`;
      return { light: { dir: -1, rim: '#d8e8f4', key: '#e8e4d8' }, layers: [[0.2, wall], [0.5, door + window_], [0.85, floor]] };
    }
  });

  // the shattered pane: shards flying out of the window (k 0..1), seeded
  function shards(cx, cy, k, seed = 8521) {
    const r = R(seed); let g = '';
    for (let i = 0; i < 26; i++) { const a = -0.9 + r() * 1.8, sp = 180 + r() * 420, s = 14 + r() * 26, rot = r() * 360; const x = cx + Math.cos(a) * sp * k, y = cy + Math.sin(a) * sp * k + 160 * k * k; g += `<path transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot + 400 * k)})" d="M0 ${-s} L${s * 0.7} ${s * 0.4} L${-s * 0.6} ${s * 0.3} Z" fill="#dff0fa" stroke="${INK}" stroke-width="2" opacity="${f1(0.95 - 0.6 * k)}"/>`; }
    return g;
  }
  // the diver: a horizontal dark silhouette (head first) flying right through the window; k 0..1 along the path
  function diver(k) {
    const x = lerp(560, 1180, k), y = lerp(1060, 820, ease.out(k)) + 40 * k * k, rot = lerp(-28, -6, k);
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><path d="M-170 0 Q-120 -40 -20 -30 L40 -30 Q90 -30 110 0 Q90 30 40 30 L-20 30 Q-120 40 -170 0 Z" fill="#171b22" stroke="${INK}" stroke-width="4"/><circle cx="128" cy="-2" r="34" fill="#171b22" stroke="${INK}" stroke-width="4"/><path d="M-170 -4 L-260 -60 M-166 6 L-250 70" stroke="#171b22" stroke-width="24" stroke-linecap="round"/><path d="M60 -30 L140 -90 M70 30 L150 70" stroke="#171b22" stroke-width="18" stroke-linecap="round"/><path d="M120 -30 Q150 -20 150 10" stroke="#8ab0d8" stroke-width="4" fill="none" opacity="0.6"/></g>` +
      [0, 1, 2].map(i => `<path d="M${f1(x - 260 - i * 40)} ${f1(y - 20 + i * 24)} l-120 0" stroke="#e8eef4" stroke-width="5" opacity="${f1(0.5 * k)}"/>`).join('');
  }
  const backpack = (x, y, glint = 0) => `<path d="M${x} ${y} Q${x - 10} ${y - 150} ${x + 70} ${y - 160} Q${x + 150} ${y - 150} ${x + 150} ${y} Z" fill="#2a3240" stroke="${INK}" stroke-width="5"/><path d="M${x + 20} ${y - 100} L${x + 130} ${y - 100}" stroke="#1a2028" stroke-width="6"/><g transform="translate(${x + 110} ${y - 40}) rotate(-22)"><rect x="-44" y="-28" width="88" height="56" rx="6" fill="#e8e6d8" stroke="${INK}" stroke-width="3"/><rect x="-34" y="-18" width="26" height="30" fill="#9aa8b8"/><path d="M0 -14 L34 -14 M0 -2 L34 -2 M0 10 L34 10" stroke="#5a6470" stroke-width="3"/></g>` + (glint > 0 ? wash(x + 110, y - 40, 90, 60, '#fff8e0', f1(0.5 * glint)) : '');

  E.registerScenes({
    // 1 - hook (frame 1): the bedroom; the big bed with the sleeper under the gold duvet in the upper-middle; the officer's
    //     torch beam from the doorway already sweeping across him; the camera already pushing in; on line 2 the officer
    //     steps in and the lock label appears
    ab85_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.6), lk = WT(ctx, 1, 3, 3.6), up = WT(ctx, 1, 4, 4.4);
      const k = seg(t, 0.0, 1.4), aim = sweepAim(k) + 2.5 * Math.sin(t * 1.3);
      return E.cine.shot(ctx, {
        set: 'ab85_bedroom', grade: 'night', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [
          { ...OFFICER, propOpts: { beam: false, aim },
            walk: { at: l2, dur: 0.7, cadence: 3.0, stride: 10, from: 190, to: 240 },
            keys: [{ at: l2 + 0.75, pose: 'torch', expr: 'stern', headTurn: 0.2, dur: 0.3 }, { at: lk, pose: 'torch_low', expr: 'focused', dur: 0.4 }, { at: up, pose: 'torch', expr: 'stern', headTurn: 0.3, dur: 0.4 }] }
        ],
        props: [{ depth: 1.0, accent: true, svg: tt => bed(tt, { lit: 0.4 + 0.6 * seg(tt, 0.3, 1.4), litX: litX(seg(tt, 0.0, 1.4)) }) },
          { depth: 1.0, svg: tt => beamProp(sweepAim(seg(tt, 0.0, 1.4)) + 2.5 * Math.sin(tt * 1.3)) }],
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.25), x: 60, y: 560, text: 'CHILLICOTHE, OHIO · MON 12 OCT 2026', fs: 38, sub: 'Police say · accused of burglary, not tried · AS OF OCT 2026' },
          { type: 'label', at: lk + 0.1, x: 60, y: 1120, text: 'INNER BACK-DOOR LOCK: MISSING', fs: 34, sub: 'Found by the owner\'s relative (Scioto Post, Heritage Headlines)' }
        ],
        tag: TAG
      });
    },

    // 2 - THE HEADLINE GOTCHA: the back door; the owner's relative walks in through it, stops, phone to his ear on 'called',
    //     points up the stairs on 'police' as the officer arrives behind him; the lock callout; the 'just sleeping' label
    ab85_door(ctx) {
      const t = ctx.t, T = ctx.T, wk = WT(ctx, 0, 3, 0.9), cl = WT(ctx, 0, 6, 1.7), po = WT(ctx, 0, 7, 2.1);
      return E.cine.shot(ctx, {
        set: 'ab85_backdoor', grade: 'warm', haze: 0.2,
        cam: { from: { x: -16, y: 20, z: 1.02 }, to: { x: 14, y: 30, z: 1.08 } },
        figures: [
          { id: 'ab85_caller', x: 480, y: 1640, scale: 0.6, dir: 1, turn: 0.4, pose: 'walk', expr: 'worried', depth: 1.02,
            walk: { at: 0.0, dur: Math.max(0.8, wk + 0.2), cadence: 3.2, stride: 14, from: 200, to: 480 },
            keys: [{ at: wk + 0.3, pose: 'stand_tense', expr: 'shocked', headTurn: 0.3, dur: 0.3 }, { at: cl, pose: 'hand_to_face', expr: 'worried', dur: 0.35 }, { at: po + 0.2, pose: 'point_up', expr: 'determined', headTurn: 0.4, dur: 0.4 }] },
          { ...OFFICER, x: 230, y: 1700, scale: 0.62, expr: 'focused', depth: 1.03, propOpts: { beamLen: 0, beam: false },
            walk: { at: po, dur: Math.max(0.8, T - po - 0.4), cadence: 3.4, stride: 14, from: -160, to: 230 }, keys: [{ at: po + 0.9, pose: 'point_up', expr: 'stern', headTurn: 0.3, dur: 0.4 }] }
        ],
        props: [],
        overlays: [
          { type: 'callout', at: 0.35, target: [640, 870], label: [700, 560], text: 'NO LOCK', w: 300, r: 50 },
          { type: 'label', at: cl + 0.1, x: 60, y: 560, text: 'REPORTED AS AN ACTIVE BURGLARY', fs: 36, sub: 'Found asleep upstairs · handcuffed as he woke (Scioto Post)' },
          { type: 'label', at: po + 0.5, x: 60, y: 1120, text: 'HE TOLD POLICE HE WAS "JUST SLEEPING"', fs: 32, sub: 'Wording as reported (Scioto Post, Heritage Headlines)' }
        ],
        tag: GEN
      });
    },

    // 3 - REHOOK + CASE 2: the dark hallway; the intruder (silhouette) creeps right toward the basement door, which stands
    //     ajar; the 13 % counter; the county label
    ab85_hall(ctx) {
      const t = ctx.t, T = ctx.T, nt = WT(ctx, 0, 3, 0.9), cl = WT(ctx, 0, 5, 1.6);
      return E.cine.shot(ctx, {
        set: 'ab85_hall', grade: 'night', haze: 0.35,
        cam: { from: { x: -12, y: 20, z: 1.02 }, to: { x: 16, y: 30, z: 1.08 } },
        figures: [
          { id: 'ab85_intruder_mi', x: 700, y: 1600, scale: 0.6, dir: 1, turn: 0.4, pose: 'walk', silhouette: 'cool', depth: 1.02,
            walk: { at: 0.0, dur: Math.max(1.6, T - 0.5), cadence: 2.6, stride: 12, from: 240, to: 700 },
            keys: [{ at: cl, pose: 'stand_tense', headTurn: 0.4, dur: 0.4 }] }
        ],
        props: [{ depth: 1.0, svg: tt => wash(lerp(300, 720, seg(tt, 0, T - 0.5)) + 40, 1100, 200, 320, '#b8c8e8', 0.05) }],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'MONROE COUNTY, MICHIGAN', fs: 38, sub: 'Frenchtown Township · sheriff\'s office statement (WWJ, WXYZ)' },
          { type: 'counter', at: nt - 0.1, dur: 1.1, from: 0, to: 13, prefix: '', suffix: '%', label: 'OF US BURGLARIES SOLVED · FBI 2022', y: 1060, fs: 120 }
        ],
        tag: TAG
      });
    },

    // 4 - CASE 2's GOTCHA: the top of the basement stairs; the intruder steps through and drops out of frame on 'fell' (the
    //     thud, a dust puff); the bulb and the landing light snap on; the homeowner appears in a dressing gown, then the
    //     deputy with a torch
    ab85_stairs(ctx) {
      const t = ctx.t, T = ctx.T, fl = WT(ctx, 0, 3, 1.0), st = WT(ctx, 0, 7, 2.2), l2 = LS(ctx, 1, 3.2), wk = WT(ctx, 1, 1, 3.4), hm = WT(ctx, 1, 3, 3.9);
      const lit = seg(t, wk, wk + 0.12);
      const dust = seg(t, fl + 0.35, fl + 1.2);
      return E.cine.shot(ctx, {
        set: 'ab85_stairs', setOpts: { lit }, grade: lit > 0.5 ? 'warm' : 'night', haze: 0.3,
        cam: { from: { x: 0, y: 30, z: 1.02 }, to: { x: 0, y: 0, z: 1.08 } },
        figures: [
          { id: 'ab85_intruder_mi', x: 540, y: 1250, scale: 0.55, dir: 1, turn: 0.55, pose: 'stand_tense', silhouette: 'cool', depth: 1.01,
            keys: [{ at: 0.1, y: 1310, scale: 0.5, turn: 0.6, dur: Math.max(0.5, fl - 0.2) }, { at: fl - 0.05, pose: 'walk', y: 2600, x: 600, scale: 0.42, dur: 0.5 }] },
          { id: 'ab85_homeowner', x: 250, y: 1660, scale: 0.6, dir: 1, turn: 0.4, pose: 'stand_tense', expr: 'worried', depth: 1.03,
            walk: { at: wk - 0.1, dur: 0.8, cadence: 3.4, stride: 12, from: -160, to: 250 }, keys: [{ at: wk + 0.75, pose: 'hand_to_face', expr: 'shocked', headTurn: 0.3, dur: 0.35 }, { at: hm + 0.4, pose: 'point', expr: 'worried', dur: 0.4 }] },
          { id: 'ab85_deputy', x: 60, y: 1760, scale: 0.64, dir: 1, turn: 0.4, pose: 'torch', expr: 'focused', depth: 1.04, hat: { style: 'cap', color: '#3a2a1e' }, propOpts: { beamLen: 700, aim: 80 },
            walk: { at: hm + 0.3, dur: 0.9, cadence: 3.4, stride: 14, from: -300, to: 60 } }
        ],
        props: [
          { depth: 1.0, svg: tt => dust > 0 && dust < 1 ? [0, 1, 2, 3, 4].map(i => `<circle cx="${f1(430 + i * 60 + Math.sin(i * 3.1) * 30)}" cy="${f1(1200 - 160 * ease.out(dust) - i * 18)}" r="${f1(22 + 26 * dust)}" fill="#8a8070" opacity="${f1(0.4 * (1 - dust))}"/>`).join('') : '' },
          { depth: 1.0, svg: tt => tt > fl - 0.05 && tt < fl + 0.6 ? [0, 1, 2].map(i => `<path d="M${520 + i * 50} ${f1(1200 + 400 * seg(tt, fl, fl + 0.5))} l10 -90" stroke="#b8c8e8" stroke-width="5" opacity="0.5"/>`).join('') : '' }
        ],
        overlays: [
          { type: 'label', at: st + 0.1, x: 60, y: 560, text: 'ABOUT 3:15 AM · A 911 CALL', fs: 38, sub: 'The homeowners heard him fall down the basement steps' },
          { type: 'label', at: hm + 0.3, x: 60, y: 1120, text: 'FOUND HIDING IN THE BASEMENT', fs: 34, sub: 'Jailed on a home-invasion charge · name withheld' }
        ],
        tag: TAG
      });
    },

    // 5 - REHOOK + CASE 3: the gutted vacant room through a plain body-camera HUD; the suspect (silhouette) bent over a
    //     stripped wall with a coil of wire looks up at the camera, then stands; the FUN FACT
    ab85_vacant(ctx) {
      const t = ctx.t, T = ctx.T, bc = WT(ctx, 0, 5, 1.6), l2 = LS(ctx, 1, 2.3), cp = WT(ctx, 1, 3, 3.3);
      return E.cine.shot(ctx, {
        set: 'ab85_vacant', setOpts: { view: 'wide' }, grade: 'cold', haze: 0.25,
        cam: { from: { x: -10, y: 20, z: 1.02 }, to: { x: 14, y: 30, z: 1.08 } },
        figures: [
          { id: 'ab85_suspect_ok', x: 520, y: 1600, scale: 0.9, dir: 1, turn: 0.45, pose: 'examine', silhouette: 'cool', depth: 1.02,
            keys: [{ at: 0.2, pose: 'examine', headTurn: 0.2, dur: 0.4 }, { at: bc, pose: 'stand_tense', headTurn: 0.6, turn: 0.7, dur: 0.35 }, { at: l2, pose: 'hands_together', headTurn: 0.4, dur: 0.4 }, { at: cp, pose: 'stand_tense', dur: 0.3 }] }
        ],
        props: [
          { depth: 1.01, svg: tt => { const k = ease.inOut(seg(tt, bc, bc + 0.5)); const y = lerp(1120, 1250, k); return `<g transform="translate(${f1(lerp(560, 480, k))} ${f1(y)})"><path d="M0 0 Q-40 -60 30 -70 Q90 -60 70 0 Q40 50 0 0 Z" fill="#b87333" stroke="${INK}" stroke-width="4" opacity="0.9"/><path d="M-10 -20 Q30 -90 80 -30" stroke="#c8884a" stroke-width="6" fill="none"/></g>`; } },
          { depth: 1.2, svg: tt => hud(tt, 1) }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'OKLAHOMA COUNTY · 1 OCT 2026', fs: 38, sub: 'Sheriff\'s office: stripping copper from a vacant house' },
          { type: 'funfact', at: cp - 0.4, y: 760, rows: [{ text: 'MORE US HOME BURGLARIES' }, { text: 'HAPPEN BY DAY THAN BY NIGHT' }, { text: '216,601 vs 174,053 · FBI 2024', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 6 - CASE 3's GOTCHA (the single impact, the music drop): closer on the window; the suspect bolts right and dives
    //     head-first through the closed pane (shards); then the backpack left on the floor with the licence (the callout);
    //     the status label
    ab85_window(ctx) {
      const t = ctx.t, T = ctx.T, dv = WT(ctx, 0, 1, 0.6), l2 = LS(ctx, 1, 2.8), bp = WT(ctx, 1, 3, 3.6), lc = WT(ctx, 1, 4, 4.0);
      const fly = seg(t, dv, dv + 0.55), sh = seg(t, dv + 0.12, dv + 0.9);
      return E.cine.shot(ctx, {
        set: 'ab85_vacant', setOpts: { view: 'window' }, grade: 'cold', haze: 0.2, dof: true,
        cam: { from: { x: 10, y: 10, z: 1.04 }, to: { x: 20, y: 20, z: 1.1 } },
        rack: { at: 0.05, dur: 0.6, from: 'bg' },
        figures: [
          { id: 'ab85_suspect_ok', x: 560, y: 1560, scale: 0.6, dir: 1, turn: 0.45, pose: 'stand_tense', silhouette: 'cool', depth: 1.02,
            walk: { at: 0.05, dur: Math.max(0.3, dv - 0.05), cadence: 5.0, stride: 22, from: 380, to: 560 },
            keys: [{ at: dv - 0.02, scale: 0.01, dur: 0.06 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => fly > 0 && fly < 1 ? diver(fly) : '' },
          { depth: 1.0, svg: tt => sh > 0 ? `<rect x="560" y="360" width="460" height="620" fill="#0e1218" opacity="${f1(0.55 * seg(tt, dv + 0.1, dv + 0.3))}"/>` + shards(790, 700, sh) : '' },
          { depth: 1.01, svg: tt => tt > dv + 0.2 ? backpack(430, 1280, seg(tt, l2, l2 + 0.5)) : '' },
          { depth: 1.015, svg: tt => { const k = seg(tt, l2 - 0.1, l2 + 0.6); return k > 0 ? wash(lerp(980, 510, ease.inOut(k)), 1200, 260, 170, '#fff4d0', f1(0.32 * Math.min(1, k * 2))) : ''; } },
          { depth: 1.2, svg: tt => hud(tt, 1) }
        ],
        overlays: [
          { type: 'impact', at: dv + 0.25, x: 800, y: 700 },
          { type: 'callout', at: l2 + 0.35, target: [540, 1240], label: [90, 1000], text: 'DRIVER\'S LICENCE', w: 420, r: 60 },
          { type: 'label', at: l2 + 0.1, x: 60, y: 560, text: 'LEFT BEHIND: A BACKPACK, HIS LICENCE', fs: 36, sub: 'Charged with burglary, resisting, obstruction · accused, not tried · AS OF OCT 2026' }
        ],
        tag: TAG
      });
    },

    // 7 - the one closing line on the bedroom in frame 1's framing (the loop): the same officer in the doorway, the same
    //     sleeper; the camera and the torch beam ease back to frame 1's start; the status label
    ab85_end(ctx) {
      const t = ctx.t, T = ctx.T;
      const k = 1 - ease.inOut(seg(t, 0.1, Math.max(1.2, T - 0.5))), aim = sweepAim(k);
      return E.cine.shot(ctx, {
        set: 'ab85_bedroom', grade: 'night', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.2, T - 0.5) }] },
        // the officer glances at the sleeper on the callback line and is back in frame 1's pose before the last frame (the loop)
        figures: [{ ...OFFICER, propOpts: { beam: false, aim },
          keys: [{ at: 0.25, pose: 'torch', headTurn: 0.45, dur: 0.4 }, { at: Math.max(1.0, T - 1.1), pose: 'torch', headTurn: 0, dur: 0.5 }] }],
        props: [{ depth: 1.0, accent: true, svg: tt => bed(Math.max(0, T - tt), { lit: 0.4 + 0.6 * k, litX: litX(k) }) },
          { depth: 1.0, svg: tt => beamProp(aim) }],
        overlays: [],
        tag: TAG
      });
    }
  });
})();
