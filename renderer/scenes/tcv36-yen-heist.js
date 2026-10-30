/* Case File 36 ("Danger Zones" showcase on the upgraded engine): Japan's 300 million yen robbery, Fuchu, Tokyo,
   10 December 1968. UNSOLVED: the robber is never identified.
   Structure: a burned-in object-first headline over the HERO OBJECT (a white 1960s police-look motorcycle on a wet Tokyo
   road at dawn, big and centred in the first frame and again in the last, so the video loops); the map fly-in (Asia view
   to western Tokyo, Japan highlighted, a pin on Fuchu); the stakes count-up (¥294,307,500); the stop; the lie (bomb,
   dynamite; threat letters on a card); THE HOW at ~55 % (he crawls under the car, a flare: smoke and flames, the staff run;
   impact); the getaway (impact) and the fake bike; the fun fact (the workers still got their bonuses); the hunt count-up
   (170,000 officers); never caught (impact); the lesson card; the callback; a burned-in YES/NO end question.
   Look: episode.look = 'vivid' with varied bright grades (tokyo, dawn, warm, cold, neon, night, sepia); every shot has a
   continuous eased camera move plus handheld 0.3-0.6; rain, a pulsing beacon, spinning wheels, drifting smoke.
   Content rules:
   - The robber is ONLY a rim-lit silhouette (yh36_robber, silhouette 'cool') wearing a white helmet with a dark visor down,
     drawn over his head by helmetFor(), so no face is ever shown; on the bike he is a drawn dark rider with the same helmet.
     No suspect is named, drawn or hinted at. No weapon.
   - Nobody was hurt: the flare is smoke with a small flicker; no explosion, no injury.
   - Generic drawings only: the motorcycle carries no insignia, crest, number or lettering; the sedan has a blank plate and
     no badge; the bank, the road, the wall and the posters are generic. Toshiba is typed only, never a logo.
   New environments (E.registerSets): yh36_road (a 1968 Tokyo-outskirts road at a rainy dawn: violet-to-orange sky, low
   tiled roofs, utility poles and wires, a long concrete wall, wet asphalt with reflections), yh36_carside (closer: the
   concrete wall, a pole with a blank plate, a streetlamp, puddles; o.flare flickers pink-red light on the wall),
   yh36_bay (the bank branch's loading bay in the morning: a 1960s concrete block, ribbon windows, a lit roller-shutter
   bay, a wall clock). Plus the engine's mapflight, task_force and press_room. */
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
  const ROBBER = 'ILLUSTRATION · ROBBER NEVER IDENTIFIED';
  const YEL = '#ffd23f', RED = '#8e1f18', MUTE = '#6b665c', HL = '#ff3b5c';
  const rad = a => a * Math.PI / 180;
  const pt = (x, y, ang, len, fx = 1) => [x + Math.sin(rad(ang)) * len * fx, y + Math.cos(rad(ang)) * len];

  // ---------- the robber's helmet: a white jet helmet with a dark visor DOWN, drawn over the figure's head so no face shows.
  // Follows the figure rig's own skeleton maths (hip -> shoulders -> neck -> head) for the figure spec f at time t.
  function helmetFor(f, t) {
    const st = E.fig.stateAt(f, t), P = st.P; const sp = E.state.cast[f.id] || {}; const dir = f.dir || 1;
    const s = (st.scale || 1) * (sp.height || 1); const turn = clamp(st.turn, 0, 1), FX = lerp(0.38, 1, turn);
    let x = st.x, y = st.y, bob = 0; let walking = false;
    if (f.walk) { const w = f.walk, u = clamp((t - w.at) / w.dur, 0, 1); x = lerp(w.from, w.to, u); walking = u > 0 && u < 1; if (walking) bob = -Math.abs(Math.sin((t - w.at) * (w.cadence || 6.2))) * 8; }
    let vis = 1; if (f.show) { vis = clamp((t - f.show[0]) / 0.3, 0, 1) * (f.show[1] !== undefined ? clamp((f.show[1] - t) / 0.3, 0, 1) : 1); if (vis <= 0) return ''; }
    const lean = P.lean + (walking ? 4 : 0), hipH = P.sit ? 440 : (P.kneel ? 310 : 470);
    const sh = pt(0, -hipH + bob, 180 - lean, 280, FX); const neck = pt(sh[0], sh[1], 180 - lean * 1.2, 34, FX); const hp = pt(neck[0], neck[1], 180 - lean * 1.4, 84, FX);
    const tilt = P.tilt, T = clamp((st.headTurn ?? 0) + turn, 0, 1), vx = 30 * T;
    let g = `<g opacity="${f1(vis)}" transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * dir)} ${sc(s)})"><g transform="translate(${f1(hp[0])} ${f1(hp[1] + 4)}) rotate(${f1(tilt)}) scale(1.16)">`;
    g += `<path d="M-70 30 C-80 -40 -60 -104 0 -108 C62 -108 82 -40 74 30 Q 40 50 0 50 Q-40 50 -70 30 Z" fill="#f2f4f6" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-62 -40 C-40 -96 40 -100 66 -44" stroke="#c9d0d8" stroke-width="8" fill="none"/><path d="M-30 -96 C-10 -104 20 -104 40 -96" stroke="#ffffff" stroke-width="6" fill="none" opacity="0.8"/>`;
    g += `<path d="M${f1(-34 + vx)} -40 C${f1(10 + vx)} -52 ${f1(70 + vx * 0.6)} -44 ${f1(78 + vx * 0.3)} -10 L${f1(76 + vx * 0.3)} 34 Q${f1(30 + vx)} 52 ${f1(-30 + vx)} 40 Z" fill="#0b0f1c" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M${f1(-14 + vx)} -30 C${f1(20 + vx)} -40 ${f1(52 + vx * 0.6)} -34 ${f1(62 + vx * 0.3)} -16" stroke="#7fa8ff" stroke-width="5" fill="none" opacity="0.65"/>`;
    g += `<rect x="-74" y="22" width="148" height="16" rx="6" fill="#d8dde2" stroke="${INK}" stroke-width="3"/>`;
    return g + '</g></g>';
  }

  // ---------- THE HERO: a generic white 1960s police-look motorcycle in profile, facing right (o.flip faces left); bottom
  // centre (x, y) on the ground; ~980 wide x ~760 tall at s = 1. White tank, fairing, mudguards and side boxes, chrome
  // forks and crash bars, a round headlight, a red beacon on a mast. NO insignia, crest, number or lettering.
  // o.spin = wheel angle (deg); o.beacon 0..1 = beacon pulse; o.glow 0..1 = yellow outline; o.rider 0..1 = a dark seated
  // rider with the white helmet; o.wave 0..1 raises the rider's arm; o.lamp 0..1 = headlight beam.
  function bike(x, y, s, t, o = {}) {
    const sp = o.spin || 0, bc = o.beacon ?? 1, k = o.glow || 0, WH = '#f4f6f8', WHD = '#c4ccd6', CH = '#c8ced6', CHD = '#7a828c';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * (o.flip ? -1 : 1))} ${sc(s)})"><ellipse cx="0" cy="8" rx="520" ry="34" fill="#000" opacity="0.5"/>`;
    if (k > 0) { const kk = k * (0.8 + 0.2 * Math.sin(t * 7)); g += wash(0, -400, 700, 520, YEL, f1(0.5 * kk)) + `<ellipse cx="0" cy="-400" rx="${f1(600 + 30 * Math.sin(t * 5))}" ry="${f1(470 + 20 * Math.sin(t * 5))}" fill="none" stroke="${YEL}" stroke-width="8" stroke-dasharray="26 18" opacity="${f1(0.8 * kk)}"/>`; }
    const wheel = cx => { let w = `<circle cx="${cx}" cy="-140" r="140" fill="#101114" stroke="${INK}" stroke-width="6"/><circle cx="${cx}" cy="-140" r="104" fill="#1e2024"/><circle cx="${cx}" cy="-140" r="98" fill="none" stroke="${CH}" stroke-width="8"/>`;
      for (let i = 0; i < 12; i++) { const a = rad(sp + i * 30); w += `<line x1="${cx}" y1="-140" x2="${f1(cx + Math.cos(a) * 96)}" y2="${f1(-140 + Math.sin(a) * 96)}" stroke="${CHD}" stroke-width="3"/>`; }
      return w + `<circle cx="${cx}" cy="-140" r="26" fill="${CH}" stroke="${INK}" stroke-width="4"/><circle cx="${cx}" cy="-140" r="9" fill="#3a3e44"/>`; };
    g += wheel(-330) + wheel(330);
    // frame, swingarm, engine, exhaust
    g += `<path d="M-330 -140 L-120 -210 L60 -200 L230 -470" stroke="#2a2e34" stroke-width="22" fill="none" stroke-linejoin="round"/><path d="M-330 -140 L-200 -360" stroke="#2a2e34" stroke-width="16"/>`;
    g += `<rect x="-120" y="-330" width="220" height="150" rx="18" fill="#4a5058" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="-104" y="${-320 + i * 26}" width="188" height="10" rx="4" fill="${CH}" opacity="0.8"/>`).join('');
    g += `<path d="M60 -210 Q 0 -150 -200 -150 L-470 -170" stroke="${CH}" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M-470 -170 L-520 -176" stroke="${CHD}" stroke-width="30" stroke-linecap="round"/>`;
    // rear mudguard and white side box (pannier), black seat, white tank with a chrome stripe
    g += `<path d="M-480 -150 C-470 -300 -260 -330 -170 -270" stroke="${WH}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M-480 -150 C-470 -300 -260 -330 -170 -270" stroke="${INK}" stroke-width="4" fill="none" opacity="0.4"/>`;
    g += `<rect x="-470" y="-450" width="220" height="170" rx="22" fill="${WH}" stroke="${INK}" stroke-width="6"/><rect x="-458" y="-440" width="196" height="44" rx="14" fill="${WHD}" opacity="0.7"/>`;
    g += `<path d="M-300 -400 Q-200 -440 -40 -420 L-40 -380 Q-200 -392 -300 -370 Z" fill="#141518" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-60 -430 C-40 -490 160 -500 220 -440 C230 -400 200 -360 150 -350 L-40 -350 C-70 -370 -70 -400 -60 -430 Z" fill="${WH}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-30 -440 C20 -480 140 -486 190 -446" stroke="#ffffff" stroke-width="10" fill="none" opacity="0.9"/><path d="M-50 -392 L190 -392" stroke="${CH}" stroke-width="7"/>`;
    // front forks, front mudguard, crash bar
    g += `<path d="M330 -140 L210 -520" stroke="${CH}" stroke-width="22" stroke-linecap="round"/><path d="M330 -140 L210 -520" stroke="${CHD}" stroke-width="5" opacity="0.6"/>`;
    g += `<path d="M190 -200 C220 -310 430 -310 470 -210" stroke="${WH}" stroke-width="28" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M120 -300 C190 -250 190 -170 110 -150" stroke="${CH}" stroke-width="12" fill="none" stroke-linecap="round"/>`;
    // the fairing / leg shield (white), windscreen, round headlight, handlebars, mirror, beacon mast with red lamp
    g += `<path d="M150 -620 C230 -650 330 -620 350 -520 C370 -440 340 -360 280 -330 L200 -330 C180 -420 150 -520 150 -620 Z" fill="${WH}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M175 -600 C240 -625 310 -600 326 -540" stroke="${WHD}" stroke-width="8" fill="none"/>`;
    g += `<path d="M160 -620 C170 -720 250 -780 320 -770 C330 -720 330 -670 320 -630 C280 -650 210 -650 160 -620 Z" fill="#a8d8ff" opacity="0.4" stroke="#e8f4ff" stroke-width="4"/><path d="M200 -660 C220 -720 270 -750 300 -748" stroke="#ffffff" stroke-width="5" fill="none" opacity="0.7"/>`;
    g += `<circle cx="352" cy="-470" r="44" fill="${CH}" stroke="${INK}" stroke-width="5"/><circle cx="356" cy="-470" r="32" fill="#fff6c8"/>` + wash(370, -470, 80, 70, '#fff6c8', 0.55);
    if (o.lamp) g += `<path d="M380 -500 L1100 -620 L1100 -260 L380 -440 Z" fill="#fff6c8" opacity="${f1(0.14 * o.lamp)}"/>`;
    g += `<path d="M140 -600 L90 -640 L60 -630" stroke="#1a1c20" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M150 -610 L130 -690" stroke="#2a2e34" stroke-width="6"/><ellipse cx="128" cy="-702" rx="20" ry="14" fill="${CH}" stroke="${INK}" stroke-width="3"/>`;
    const pulse = bc * (0.55 + 0.45 * Math.max(0, Math.sin(t * 9)));
    g += `<path d="M300 -760 L300 -830" stroke="#2a2e34" stroke-width="10"/><path d="M276 -830 Q300 -880 324 -830 Z" fill="#ff2a3a" stroke="${INK}" stroke-width="4"/><rect x="272" y="-836" width="56" height="12" rx="4" fill="#3a3e44"/>`;
    if (bc > 0) g += wash(300, -850, 150, 120, '#ff2a3a', f1(0.6 * pulse)) + `<circle cx="300" cy="-850" r="${f1(12 + 8 * pulse)}" fill="#ffd0d4" opacity="${f1(pulse)}"/>`;
    // the rider (custom, dark, helmeted, visor down), seated; o.wave raises his near arm
    if (o.rider > 0) {
      const wv = o.wave || 0;
      let r = `<g opacity="${f1(o.rider)}"><path d="M-240 -400 C-250 -520 -200 -640 -120 -700 L-40 -690 C-10 -600 -40 -480 -80 -400 Z" fill="#1c2232" stroke="#0a0c12" stroke-width="5"/>`;
      r += `<path d="M-220 -390 L-60 -380 L-30 -220 L-80 -200 L-110 -340 L-230 -350 Z" fill="#1a1f2c" stroke="#0a0c12" stroke-width="5"/><path d="M-90 -210 L-30 -210 L-20 -186 L-100 -186 Z" fill="#0c0d10"/>`;
      const sh0 = [-80, -660], el = pt(sh0[0], sh0[1], lerp(115, 160, wv), 140), wr = pt(el[0], el[1], lerp(95, 175, wv), 130);
      r += `<path d="M${sh0[0]} ${sh0[1]} L${f1(el[0])} ${f1(el[1])} L${f1(wr[0])} ${f1(wr[1])}" stroke="#1c2232" stroke-width="44" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${f1(wr[0])}" cy="${f1(wr[1])}" r="24" fill="#e8ecf0" stroke="${INK}" stroke-width="4"/>`;
      r += `<path d="M-150 -700 L-30 -700 L-40 -740 L-140 -740 Z" fill="#1c2232"/>`;
      r += `<g transform="translate(-80 -800) scale(1.0)"><path d="M-70 30 C-80 -40 -60 -104 0 -108 C62 -108 82 -40 74 30 Q 40 50 0 50 Q-40 50 -70 30 Z" fill="#f2f4f6" stroke="${INK}" stroke-width="5"/><path d="M-10 -40 C30 -52 76 -44 80 -10 L78 34 Q50 52 -6 40 Z" fill="#0b0f1c" stroke="${INK}" stroke-width="4"/><path d="M10 -30 C40 -40 62 -34 70 -16" stroke="#7fa8ff" stroke-width="5" fill="none" opacity="0.65"/><path d="M-30 -96 C-10 -104 20 -104 40 -96" stroke="#fff" stroke-width="6" fill="none"/></g>`;
      g += r + '</g>';
    }
    return g + '</g>';
  }

  // ---------- a generic late-1960s Japanese saloon in profile, facing right (o.flip faces left): dark navy body, chrome
  // bumpers and trim, a BLANK plate, no badge. ~1000 wide x ~400 tall at s = 1. o.door 0..1 opens the front door;
  // o.trunk 0..1 raises the boot lid over silver cash cases; o.heads 0..1 shows four dark heads; o.spin wheel angle;
  // o.speed 0..1 adds motion streaks; o.smoke 0..1 = smoke and flame flicker from underneath (the flare).
  function sedan(x, y, s, t, o = {}) {
    const BODY = o.col || '#1b2540', BD = '#121a2e', CH = '#d4dae0', GL = '#9cc4e4';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * (o.flip ? -1 : 1))} ${sc(s)})"><ellipse cx="0" cy="8" rx="540" ry="36" fill="#000" opacity="0.55"/>`;
    if (o.smoke > 0) { const fl = o.smoke * (0.6 + 0.4 * Math.sin(t * 23) * Math.sin(t * 7.3)); g += wash(0, -40, 480, 120, '#ff3a5a', f1(0.55 * fl)) + wash(-40, -30, 200, 60, '#fff0c0', f1(0.6 * fl)); }
    if (o.speed > 0) for (let i = 0; i < 9; i++) { const yy = -380 + i * 40, ln = 200 + (i * 73) % 260; g += `<line x1="${-560 - ln}" y1="${yy}" x2="-540" y2="${yy}" stroke="#ffffff" stroke-width="${3 + (i % 3)}" opacity="${f1(0.45 * o.speed)}" stroke-linecap="round"/>`; }
    // body: long low box with a slight tail fin, the greenhouse with three side windows
    g += `<path d="M-500 -110 L-500 -230 Q-496 -262 -460 -268 L-280 -276 L-200 -400 Q-180 -414 -150 -416 L170 -416 Q200 -414 220 -396 L310 -280 L470 -268 Q506 -262 510 -226 L512 -110 Z" fill="${BODY}" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M-500 -170 L512 -170 L512 -110 L-500 -110 Z" fill="${BD}"/><path d="M-496 -232 L508 -222" stroke="${CH}" stroke-width="6"/>`;
    const win = (a, b, c, d) => `<path d="${a}" fill="${GL}" stroke="${INK}" stroke-width="5"/><path d="${b}" stroke="#ffffff" stroke-width="6" opacity="0.5"/>`;
    g += win('M-268 -282 L-196 -392 L-100 -392 L-100 -282 Z', 'M-230 -300 L-180 -376') + win('M-80 -282 L-80 -392 L80 -392 L80 -282 Z', 'M-40 -300 L10 -380') + win('M100 -282 L100 -392 L176 -392 L262 -282 Z', 'M130 -300 L170 -370');
    if (o.heads > 0) [[-170, -318], [-20, -322], [40, -320], [150, -318]].forEach(([hx, hy]) => { g += `<g opacity="${f1(o.heads)}"><ellipse cx="${hx}" cy="${hy}" rx="30" ry="36" fill="#0c0e14"/><rect x="${hx - 34}" y="${hy + 26}" width="68" height="40" fill="#0c0e14"/></g>`; });
    // the doors (seams), handles; the front door swings open toward the viewer (a lighter panel)
    g += `<path d="M-90 -276 L-90 -116 M110 -276 L120 -116" stroke="${INK}" stroke-width="4" opacity="0.8"/><rect x="-60" y="-246" width="40" height="10" rx="4" fill="${CH}"/><rect x="140" y="-246" width="40" height="10" rx="4" fill="${CH}"/>`;
    const dr = o.door || 0;
    if (dr > 0) g += `<path d="M110 -282 L262 -282 L300 -230 L300 -116 L120 -116 Z" fill="#06080e"/><path d="M262 -282 L${f1(262 + 170 * dr)} ${f1(-300 - 30 * dr)} L${f1(300 + 200 * dr)} -230 L${f1(300 + 200 * dr)} ${f1(-100 + 10 * dr)} L300 -116 L300 -230 Z" fill="#26324e" stroke="${INK}" stroke-width="5"/>`;
    // the boot (left), lid raised over cash cases
    const tk = o.trunk || 0;
    if (tk > 0) {
      g += `<path d="M-500 -268 L-300 -276 L-300 -250 L-500 -244 Z" fill="#06080e"/>`;
      [[-480, 0], [-410, 6], [-340, -2]].forEach(([cx, d]) => { g += `<rect x="${cx}" y="${-330 + d}" width="66" height="70" rx="6" fill="#c8ced6" stroke="${INK}" stroke-width="4"/><path d="M${cx + 6} ${-310 + d} L${cx + 60} ${-310 + d}" stroke="#8a929c" stroke-width="4"/>`; });
      g += `<path d="M-300 -276 L${f1(-300 - 40 * tk)} ${f1(-276 - 180 * tk)} L${f1(-500 - 30 * tk)} ${f1(-268 - 160 * tk)} L-500 -268 Z" fill="${BODY}" stroke="${INK}" stroke-width="6"/>`;
    }
    // bumpers, lights, blank plate
    g += `<rect x="-530" y="-150" width="70" height="34" rx="12" fill="${CH}" stroke="${INK}" stroke-width="4"/><rect x="470" y="-150" width="70" height="34" rx="12" fill="${CH}" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-508" y="-240" width="20" height="44" rx="6" fill="#ff3a3a"/><circle cx="500" cy="-206" r="26" fill="#fff6c8" stroke="${INK}" stroke-width="4"/>` + wash(510, -206, 70, 50, '#fff6c8', 0.5);
    g += `<rect x="470" y="-196" width="30" height="40" rx="3" fill="#eeeae0" stroke="${INK}" stroke-width="3"/>`;
    // wheels with hubcaps (they spin)
    [-300, 300].forEach(cx => { g += `<path d="M${cx - 110} -110 A110 110 0 0 1 ${cx + 110} -110 Z" fill="#06080e"/><circle cx="${cx}" cy="-84" r="84" fill="#101114" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-84" r="48" fill="${CH}" stroke="${INK}" stroke-width="4"/>`;
      for (let i = 0; i < 6; i++) { const a = rad((o.spin || 0) + i * 60); g += `<line x1="${cx}" y1="-84" x2="${f1(cx + Math.cos(a) * 44)}" y2="${f1(-84 + Math.sin(a) * 44)}" stroke="#7a828c" stroke-width="5"/>`; }
      g += `<circle cx="${cx}" cy="-84" r="12" fill="#5a626c"/>`; });
    // a highlight along the roof (wet)
    g += `<path d="M-180 -410 L170 -410" stroke="#8fb0ff" stroke-width="5" opacity="0.5"/>`;
    return g + '</g>';
  }

  // the flare's smoke: billows rising and spreading from (x, y); k 0..1 = amount; tinted pink/red underneath
  function smoke(x, y, k, t, seed = 7) {
    if (k <= 0) return ''; const r = R(seed); let g = `<g>`;
    let soft = '', crisp = '';
    for (let i = 0; i < 26; i++) {
      const ph = ((t * (0.18 + r() * 0.1) + r()) % 1), side = (r() - 0.5), dx = side * 900 * (0.25 + ph), up = 20 + ph * ph * 700 * (0.6 + r() * 0.5), rr = (40 + ph * 160 + r() * 40) * Math.min(1, k * 1.3);
      const col = ph < 0.3 ? '#ff9ac0' : (i % 3 ? '#f4eefa' : '#dcd2ea'), op = k * (1 - ph) * (ph < 0.08 ? ph / 0.08 : 1);
      soft += `<circle cx="${f1(x + dx)}" cy="${f1(y - up)}" r="${f1(rr * 1.3)}" fill="${col}" opacity="${f1(0.5 * op)}"/>`;
      crisp += `<circle cx="${f1(x + dx)}" cy="${f1(y - up)}" r="${f1(rr * 0.7)}" fill="${col}" opacity="${f1(0.16 * op)}"/>`;
    }
    g += `<g filter="url(#cineSoft)">${soft}</g>${crisp}`;
    g += `<circle cx="${x}" cy="${y - 20}" r="${f1(60 + 30 * Math.sin(t * 19))}" fill="#ff4a2a" opacity="${f1(k * 0.7)}" filter="url(#cineSoft)"/><circle cx="${x}" cy="${y - 16}" r="${f1(18 + 8 * Math.sin(t * 31))}" fill="#fff4c0" opacity="${f1(k)}"/>`;
    return g + '</g>';
  }
  // rain streaks over the whole frame (screen-space-ish, drawn as a prop at depth 1.2)
  function drops(t, n = 90, op = 0.35, seed = 361) {
    const r = R(seed); let g = '';
    for (let i = 0; i < n; i++) { const x0 = r() * (W + 400) - 200, sp = 1400 + r() * 700, ph = r() * 2000; const yy = ((ph + t * sp) % (H + 400)) - 200, ln = 40 + r() * 50; g += `<line x1="${f1(x0)}" y1="${f1(yy)}" x2="${f1(x0 - ln * 0.18)}" y2="${f1(yy + ln)}" stroke="#d8e4ff" stroke-width="${f1(1.6 + r() * 1.6)}" opacity="${f1(op * (0.5 + r() * 0.5))}"/>`; }
    return g;
  }
  // a utility pole with crossarms (Japanese street look), base at (x, y), height h
  function pole(x, y, h, col = '#1a1622') {
    return `<rect x="${x - 10}" y="${y - h}" width="20" height="${h}" fill="${col}"/><rect x="${x - 80}" y="${y - h + 50}" width="160" height="12" fill="${col}"/><rect x="${x - 60}" y="${y - h + 100}" width="120" height="10" fill="${col}"/>` +
      [-70, -30, 30, 70].map(dx => `<rect x="${x + dx - 5}" y="${y - h + 36}" width="10" height="16" fill="#8a8a96"/>`).join('') + `<rect x="${x - 16}" y="${y - h + 220}" width="32" height="60" rx="6" fill="#3a3a46"/>`;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a 1968 Tokyo-outskirts road at a rainy dawn (generic): violet-to-orange sky, low tiled roofs and a factory roofline,
    // utility poles with sagging wires, a long grey concrete wall, wet asphalt with sky reflections and a centre line.
    // o.dark 0..1 deepens the sky.
    yh36_road(ctx, o = {}) {
      const t = ctx.t, r = R(3601), dk = o.dark || 0;
      let sky = `<defs><linearGradient id="yhsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dk > 0.5 ? '#0a0820' : '#1a1240'}"/><stop offset="0.38" stop-color="#4a2a7a"/><stop offset="0.66" stop-color="#c24a7a"/><stop offset="0.86" stop-color="#ff8a4a"/><stop offset="1" stop-color="#ffc070"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#yhsky)"/>` + wash(760, 860, 620, 220, '#ffb070', 0.45);
      for (let i = 0; i < 26; i++) { const sx = -200 + r() * 1500, sy = -150 + r() * 420; sky += `<circle cx="${f1(sx)}" cy="${f1(sy)}" r="${f1(1.2 + r() * 1.8)}" fill="#fff" opacity="${f1((0.25 + 0.35 * dk) * (0.5 + 0.5 * Math.sin(t * (1 + r() * 2) + i)))}"/>`; }
      // distant city: low tiled roofs, a factory saw-tooth roof and a chimney, a few lit windows
      let far = '';
      for (let i = 0; i < 9; i++) { const x = -260 + i * 180 + r() * 40, w = 150 + r() * 60, h = 70 + r() * 70; far += `<path d="M${f1(x - 20)} ${f1(900 - h)} L${f1(x + w / 2)} ${f1(860 - h)} L${f1(x + w + 20)} ${f1(900 - h)} L${f1(x + w)} 920 L${f1(x)} 920 Z" fill="#2a1c3a"/><rect x="${f1(x)}" y="${f1(900 - h)}" width="${f1(w)}" height="${f1(h + 20)}" fill="#24182f"/>`;
        if (i % 2) far += `<rect x="${f1(x + 30)}" y="${f1(920 - h * 0.6)}" width="26" height="22" fill="#ffd98a" opacity="${f1(0.55 + 0.25 * Math.sin(t * 1.3 + i))}"/>`; }
      far += [0, 1, 2, 3, 4, 5].map(i => `<path d="M${700 + i * 90} 800 L${790 + i * 90} 740 L${790 + i * 90} 800 Z" fill="#2e1f40"/>`).join('') + `<rect x="700" y="800" width="560" height="120" fill="#281b38"/><rect x="1120" y="560" width="34" height="250" fill="#2a1c3a"/>`;
      for (let i = 0; i < 4; i++) { const ph = (t * 0.12 + i * 0.25) % 1; far += `<circle cx="${f1(1137 + ph * 60)}" cy="${f1(540 - ph * 240)}" r="${f1(20 + ph * 60)}" fill="#c8a0c0" opacity="${f1(0.28 * (1 - ph))}"/>`; }
      // the long concrete wall (generic), its coping and stains, a gate post
      let wall = `<rect x="-300" y="860" width="${W + 600}" height="200" fill="#6a6478"/><rect x="-300" y="850" width="${W + 600}" height="22" fill="#86809a" stroke="${INK}" stroke-width="3"/>`;
      for (let x = -300; x < W + 300; x += 150) wall += `<path d="M${x} 872 L${x} 1060" stroke="#4a4458" stroke-width="3"/>` + `<rect x="${x + 20 + (x * 7) % 60}" y="900" width="${30 + (x * 3) % 40}" height="${60 + (x * 5) % 80}" fill="#3e3a4e" opacity="0.35"/>`;
      // utility poles and the wires (they sag between poles), lit by the dawn
      let poles = [-60, 520, 1100].map(x => pole(x, 1080, 760)).join('');
      [0, 1, 2].forEach(j => { poles += `<path d="M-400 ${400 + j * 22} Q -60 ${470 + j * 22} 230 ${400 + j * 22} Q 520 ${480 + j * 22} 810 ${400 + j * 22} Q 1100 ${470 + j * 22} 1500 ${400 + j * 22}" stroke="#140f1c" stroke-width="3" fill="none"/>`; });
      // wet asphalt: dark road, sky reflections, puddle glints, a centre line in perspective
      let road = `<defs><linearGradient id="yhroad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a50"/><stop offset="0.3" stop-color="#1c1828"/><stop offset="1" stop-color="#0e0c14"/></linearGradient></defs><rect x="-300" y="1060" width="${W + 600}" height="${H}" fill="url(#yhroad)"/>`;
      road += `<rect x="-300" y="1060" width="${W + 600}" height="14" fill="#9a8aa8" opacity="0.6"/>` + wash(760, 1180, 600, 120, '#ff9a5a', 0.3) + wash(300, 1400, 500, 160, '#c24a7a', 0.16);
      for (let i = 0; i < 7; i++) { const yy = 1110 + i * i * 22, w = 30 + i * 16; road += `<rect x="${f1(540 - w / 2)}" y="${yy}" width="${f1(w)}" height="${f1(10 + i * 6)}" fill="#ffd7a0" opacity="0.5"/>`; }
      [-60, 520, 1100].forEach(x => { road += `<rect x="${x - 8}" y="1080" width="16" height="${f1(260 + 40 * Math.sin(t * 2 + x))}" fill="#140f1c" opacity="0.35"/>`; });
      for (let i = 0; i < 16; i++) { const px = -200 + r() * 1500, py = 1150 + r() * 700, pr = 50 + r() * 120; road += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(pr)}" ry="${f1(pr * 0.12)}" fill="#ffb98a" opacity="${f1(0.08 + 0.05 * Math.sin(t * 3 + i))}"/>`;
        const rp = ((t * 0.9 + r()) % 1); road += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(10 + rp * 40)}" ry="${f1(2 + rp * 6)}" fill="none" stroke="#e8dcff" stroke-width="2" opacity="${f1(0.35 * (1 - rp))}"/>`; }
      return { light: { dir: 1, rim: '#ff9ad0', key: '#ffd0b0' }, layers: [[0.05, sky], [0.2, far], [0.4, wall], [0.5, poles], [1.0, road]] };
    },

    // closer on the street (generic): a tall concrete wall filling the background with stains and a small steel door, a
    // pole with a blank metal plate, a streetlamp with a halo, wet pavement with puddles. o.flare 0..1 = flickering pink-red
    // light on the wall from the flare under the car.
    yh36_carside(ctx, o = {}) {
      const t = ctx.t, r = R(3602), fl = o.flare || 0;
      let back = `<defs><linearGradient id="yhcs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1e46"/><stop offset="1" stop-color="#c06a8a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#yhcs)"/>`;
      let wall = `<rect x="-300" y="300" width="${W + 600}" height="900" fill="#76708a"/><rect x="-300" y="286" width="${W + 600}" height="30" fill="#928ca8" stroke="${INK}" stroke-width="4"/>`;
      for (let x = -300; x < W + 300; x += 220) wall += `<path d="M${x} 316 L${x} 1200" stroke="#56506a" stroke-width="4"/>`;
      for (let i = 0; i < 14; i++) { const x = -250 + r() * 1500, w = 30 + r() * 80; wall += `<path d="M${f1(x)} 316 L${f1(x + w)} 316 L${f1(x + w * 0.7)} ${f1(500 + r() * 400)} L${f1(x + w * 0.2)} ${f1(420 + r() * 300)} Z" fill="#4e4862" opacity="0.3"/>`; }
      wall += `<rect x="860" y="760" width="200" height="440" fill="#4a4e5a" stroke="${INK}" stroke-width="6"/><rect x="880" y="780" width="160" height="180" fill="#3e424e"/><circle cx="1030" cy="1000" r="10" fill="#c8ced6"/>`;
      if (fl > 0) { const k = fl * (0.6 + 0.4 * Math.sin(t * 21) * Math.sin(t * 6.1)); wall += `<rect x="-300" y="300" width="${W + 600}" height="900" fill="#ff2a6a" opacity="${f1(0.28 * k)}"/>` + wash(520, 1100, 700, 380, '#ff7a4a', f1(0.4 * k)); }
      // a pole with a blank plate, and a streetlamp with its halo
      let fore = pole(120, 1240, 1100, '#221a2c') + `<rect x="96" y="760" width="48" height="160" fill="#d8d8e0" stroke="${INK}" stroke-width="3"/>`;
      fore += `<path d="M120 400 L260 400 L260 430" stroke="#221a2c" stroke-width="12" fill="none"/><ellipse cx="260" cy="440" rx="34" ry="14" fill="#fff4d0"/>` + wash(260, 470, 240, 200, '#ffe0b0', 0.35);
      let ground = `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="#1a1622"/><rect x="-300" y="1200" width="${W + 600}" height="16" fill="#8a8098" opacity="0.6"/>` + wash(540, 1260, 700, 100, '#c06a8a', 0.3);
      for (let i = 0; i < 12; i++) { const px = -200 + r() * 1500, py = 1260 + r() * 600, pr = 60 + r() * 140; ground += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(pr)}" ry="${f1(pr * 0.14)}" fill="${fl > 0 ? '#ff6a8a' : '#d8b0d8'}" opacity="${f1(0.1 + 0.2 * fl)}"/>`;
        const rp = ((t * 1.1 + r()) % 1); ground += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(10 + rp * 40)}" ry="${f1(2 + rp * 6)}" fill="none" stroke="#f0e0ff" stroke-width="2" opacity="${f1(0.35 * (1 - rp))}"/>`; }
      return { light: { dir: -1, rim: fl > 0.3 ? '#ff7aa0' : '#c8b8ff', key: '#ffd8e0' }, layers: [[0.1, back], [0.35, wall], [0.6, fore], [1.0, ground]] };
    },

    // the bank branch's loading bay on a winter morning (generic 1960s concrete block): ribbon windows, a roller-shutter bay
    // lit warm inside with a counter and stacked cases, a plain wall clock reading about 9:15, a cold sky strip, wet concrete.
    yh36_bay(ctx, o = {}) {
      const t = ctx.t, r = R(3603);
      let back = `<defs><linearGradient id="yhbs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3a70"/><stop offset="1" stop-color="#8aa0d0"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#yhbs)"/>`;
      let bld = `<rect x="-300" y="120" width="${W + 600}" height="1100" fill="#b8b0a4"/>`;
      for (let row = 0; row < 2; row++) { const yy = 200 + row * 220; bld += `<rect x="-300" y="${yy}" width="${W + 600}" height="120" fill="#2a3450" stroke="${INK}" stroke-width="5"/>`;
        for (let x = -300; x < W + 300; x += 110) bld += `<rect x="${x}" y="${yy}" width="8" height="120" fill="#8a8478"/><rect x="${x + 14}" y="${yy + 8}" width="88" height="104" fill="#ffd98a" opacity="${f1(0.18 + 0.2 * ((x / 110 + row) % 3 === 0 ? 1 : 0))}"/>`; }
      // the bay: a raised roller shutter, a warm interior, a counter and stacked silver cases, a lamp
      bld += `<rect x="40" y="640" width="1000" height="580" fill="#2a2016" stroke="${INK}" stroke-width="8"/>` + wash(540, 900, 520, 300, '#ffb050', 0.5);
      bld += `<rect x="40" y="620" width="1000" height="70" fill="#8a8e94" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2].map(i => `<path d="M44 ${634 + i * 18} L1036 ${634 + i * 18}" stroke="#5a5e64" stroke-width="4"/>`).join('');
      bld += `<rect x="80" y="980" width="920" height="40" fill="#5a3e28" stroke="${INK}" stroke-width="5"/><rect x="80" y="1020" width="920" height="200" fill="#3a2a1c"/>`;
      [[640, 900], [720, 900], [800, 900], [680, 830], [760, 830]].forEach(([cx, cy]) => { bld += `<rect x="${cx}" y="${cy}" width="74" height="74" rx="6" fill="#c8ced6" stroke="${INK}" stroke-width="4"/><path d="M${cx + 8} ${cy + 20} L${cx + 66} ${cy + 20}" stroke="#8a929c" stroke-width="4"/>`; });
      bld += `<path d="M300 690 L300 760" stroke="#1a1410" stroke-width="5"/><path d="M260 760 L340 760 L320 730 L280 730 Z" fill="#c8a050" stroke="${INK}" stroke-width="3"/>` + wash(300, 800, 160, 120, '#ffe0a0', 0.4);
      // the wall clock (plain face, no logo), about 9:15
      const mn = 15 + (t * 0.5) % 1;
      bld += `<circle cx="960" cy="770" r="46" fill="#f4f0e4" stroke="${INK}" stroke-width="7"/>` + [...Array(12)].map((_, i) => { const a = rad(i * 30); return `<line x1="${f1(960 + Math.sin(a) * 36)}" y1="${f1(770 - Math.cos(a) * 36)}" x2="${f1(960 + Math.sin(a) * 42)}" y2="${f1(770 - Math.cos(a) * 42)}" stroke="${INK}" stroke-width="3"/>`; }).join('');
      bld += `<line x1="960" y1="770" x2="${f1(960 + Math.sin(rad(9 * 30 + mn * 0.5)) * 22)}" y2="${f1(770 - Math.cos(rad(9 * 30 + mn * 0.5)) * 22)}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><line x1="960" y1="770" x2="${f1(960 + Math.sin(rad(mn * 6)) * 34)}" y2="${f1(770 - Math.cos(rad(mn * 6)) * 34)}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
      let ground = `<rect x="-300" y="1220" width="${W + 600}" height="${H}" fill="#4a4a52"/><rect x="-300" y="1220" width="${W + 600}" height="14" fill="#2a2a30"/>` + wash(540, 1300, 600, 120, '#ffb050', 0.3);
      for (let i = 0; i < 10; i++) { const px = -200 + r() * 1500, py = 1280 + r() * 600, pr = 60 + r() * 120; ground += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(pr)}" ry="${f1(pr * 0.14)}" fill="#8aa0d0" opacity="0.18"/>`; }
      return { light: { dir: -1, rim: '#ffd08a', key: '#ffe0b0' }, layers: [[0.05, back], [0.4, bld], [1.0, ground]] };
    }
  });

  // the hero motorcycle's framing in the first and the last shot (the loop): big and centred on the road
  const HERO = { x: 600, y: 1500, s: 0.84 };
  const ROB = { id: 'yh36_robber', x: 150, y: 1470, scale: 0.7, dir: 1, turn: 0.45, pose: 'stand', silhouette: 'cool', depth: 1.0 };

  E.registerScenes({
    // 1 - hook: the white motorcycle on the wet road at dawn, beacon pulsing, the helmeted rider standing behind it. The
    //     headline is burned in by the engine (until ~3.2 s); the only card before then sits at y 790+.
    yh36_hook(ctx) {
      const t = ctx.t, safe = WT(ctx, 0, 5, 0.9), l1 = LS(ctx, 1, 3.0), fake = WT(ctx, 1, 3, 3.8), stole = WT(ctx, 1, 5, 4.4), n300 = WT(ctx, 1, 7, 5.0);
      const rob = { ...ROB, keys: [{ at: fake - 0.1, pose: 'stand_tense', dur: 0.4 }, { at: stole, pose: 'point', gaze: [0.8, 0], dur: 0.45 }, { at: n300 + 0.5, pose: 'stand', dur: 0.5 }] };
      return E.cine.shot(ctx, {
        set: 'yh36_road', setOpts: { dark: 0.2 }, grade: 'tokyo',
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 20, y: 70, z: 1.1 }, handheld: 0.4 },
        shake: [{ at: fake, amp: 3 }],
        figures: [rob],
        props: [{ depth: 1.0, svg: tt => helmetFor(rob, tt) },
          { depth: 1.0, svg: tt => bike(HERO.x, HERO.y, HERO.s, tt, { beacon: 1, glow: 0.85 * seg(tt, fake - 0.1, fake + 0.3) * (1 - seg(tt, n300 + 0.4, n300 + 1.0)) }) },
          { depth: 1.2, svg: tt => drops(tt + (ctx.sceneStart || 0), 80, 0.3) }],
        overlays: [
          { type: 'impact', at: fake, x: 560, y: 1150, colour: HL }
        ],
        tag: ROBBER
      });
    },

    // 2 - where: the map fly-in, Asia to western Tokyo; Japan glows; the pin lands on Fuchu
    yh36_map(ctx) {
      const T = ctx.T, dec = WT(ctx, 0, 2, 0.4), fu = WT(ctx, 0, 5, 1.9);
      return E.cine.shot(ctx, {
        set: 'mapflight', grade: 'tokyo',
        setOpts: { geo: 'asia', from: { center: [121, 31], span: 62 }, to: { center: [139.45, 35.75], span: 4.2 }, t0: 0.05, t1: Math.max(fu + 0.4, T - 0.5),
          country: 'Japan', hl: HL, country_at: 0.35, pin: { ll: [139.477, 35.669], label: 'FUCHU, TOKYO', at: fu - 0.15, dx: -40, dy: -60, anchor: 'end', fs: 52 },
          labels: [{ ll: [104, 34], text: 'CHINA', at: 0.2, fs: 44 }, { ll: [127.8, 36.4], text: 'KOREA', at: 0.3, fs: 34 }, { ll: [141.6, 39.8], text: 'JAPAN', at: 0.5, fs: 48 }] },
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 0, z: 1.04 }, handheld: 0.3 },
        overlays: [{ type: 'label', at: dec - 0.1, x: 60, y: 432, text: '10 DECEMBER 1968', fs: 46, sub: 'A rainy winter morning' }],
        tag: 'ILLUSTRATION · MAP, NATURAL EARTH DATA'
      });
    },

    // 3 - the stakes: the bank's loading bay; two clerks load silver cases into the bank car's boot; the count-up
    yh36_cash(ctx) {
      const t = ctx.t, bank = WT(ctx, 0, 1, 0.2), car = WT(ctx, 0, 2, 0.4), n294 = WT(ctx, 0, 4, 1.1), bon = WT(ctx, 0, 8, 3.1), tosh = WT(ctx, 0, 10, 3.8);
      const caseX = tt => lerp(560, 330, ease.inOut(seg(tt, 0.1, car + 0.6)));
      return E.cine.shot(ctx, {
        set: 'yh36_bay', grade: 'warm',
        cam: { from: { x: -40, y: 30, z: 1.0 }, to: { x: 30, y: 50, z: 1.12 }, handheld: 0.4 },
        figures: [
          { id: 'yh36_clerk_a', x: 560, y: 1620, scale: 0.86, dir: -1, depth: 1.01, turn: 0.5, pose: 'walk', expr: 'focused', walk: { from: 640, to: 470, at: 0.1, dur: Math.max(0.6, car + 0.4), cadence: 6 },
            keys: [{ at: car + 0.5, pose: 'present', expr: 'focused', dur: 0.4 }, { at: bon, pose: 'stand', expr: 'neutral', gaze: [0.6, -0.2], dur: 0.4 }] },
          { id: 'yh36_clerk_b', x: 860, y: 1660, scale: 0.92, dir: -1, depth: 1.01, turn: 0.45, pose: 'read', expr: 'focused',
            keys: [{ at: n294, pose: 'read', expr: 'realise', dur: 0.3 }, { at: tosh, pose: 'point', expr: 'determined', gaze: [0.9, -0.2], dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => sedan(120, 1500, 0.72, tt, { trunk: 1, flip: true }) },
          { depth: 1.01, svg: tt => (tt < car + 0.6 ? `<rect x="${f1(caseX(tt) - 40)}" y="1180" width="80" height="78" rx="6" fill="#c8ced6" stroke="${INK}" stroke-width="4"/><path d="M${f1(caseX(tt) - 32)} 1200 L${f1(caseX(tt) + 32)} 1200" stroke="#8a929c" stroke-width="4"/>` : '') }
        ],
        overlays: [
          { type: 'counter', at: n294 - 0.1, dur: 1.7, from: 0, to: 294307500, prefix: '¥', label: "TOSHIBA WORKERS' BONUSES", y: 600, fs: 112 },
          { type: 'impact', at: n294 + 1.6, x: 540, y: 560, colour: YEL }
        ],
        tag: TAG
      });
    },

    // 4 - the stop: the bank car brakes in the rain as the white motorcycle rides in from the right; the rider waves it down
    yh36_stop(ctx) {
      const t = ctx.t, pol = WT(ctx, 0, 2, 0.3), wh = WT(ctx, 0, 5, 1.0), mot = WT(ctx, 0, 6, 1.3), wav = WT(ctx, 0, 7, 1.9), dn = WT(ctx, 0, 9, 2.2);
      const carX = tt => lerp(-500, 300, ease.out(seg(tt, 0, wav + 0.2))); const bikeX = tt => lerp(1500, 760, ease.out(seg(tt, pol - 0.5, wav)));
      const carMoving = tt => 1 - seg(tt, wav - 0.3, wav + 0.2), bikeMoving = tt => 1 - seg(tt, wav - 0.3, wav);
      return E.cine.shot(ctx, {
        set: 'yh36_road', setOpts: { dark: 0.05 }, grade: 'dawn',
        cam: { from: { x: 60, y: 20, z: 1.0 }, to: { x: -30, y: 50, z: 1.12 }, handheld: 0.5 },
        shake: [{ at: wav, amp: 4 }],
        props: [
          { depth: 1.0, svg: tt => sedan(carX(tt), 1400, 0.6, tt, { heads: 1, spin: tt * 900 * carMoving(tt) + 400 * ease.out(seg(tt, 0, wav)), speed: 0.8 * carMoving(tt) }) },
          { depth: 1.0, svg: tt => bike(bikeX(tt), 1580, 0.6, tt, { flip: true, rider: 1, wave: ease.out(seg(tt, wav - 0.15, wav + 0.3)), beacon: 1, lamp: 0.8, spin: -tt * 700 * bikeMoving(tt), glow: 0.7 * seg(tt, wh - 0.1, wh + 0.2) * (1 - seg(tt, mot + 0.6, mot + 1.0)) }) },
          { depth: 1.2, svg: tt => drops(tt + (ctx.sceneStart || 0), 90, 0.32, 362) }
        ],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'NEAR FUCHU PRISON · MORNING', fs: 38, sub: 'About 200 m from the Toshiba factory' },
          { type: 'callout', at: wh, until: dn + 0.4, target: [760, 1220], r: 90, label: [420, 800], w: 470, text: 'A WHITE "POLICE" BIKE', fs: 32, colour: HL }
        ],
        tag: ROBBER
      });
    },

    // 5 - the lie: close on the car; the helmeted "officer" points at it; a clerk steps out of the opened door; the threat
    //     letters on a card
    yh36_bomb(ctx) {
      const t = ctx.t, said = WT(ctx, 0, 1, 0.2), man = WT(ctx, 0, 3, 0.6), bomb = WT(ctx, 0, 6, 1.5), dyn = WT(ctx, 0, 8, 2.3), pla = WT(ctx, 0, 10, 2.9), car = WT(ctx, 0, 13, 3.6);
      const rob = { id: 'yh36_robber', x: 920, y: 1700, scale: 0.92, dir: -1, turn: 0.45, pose: 'stand', silhouette: 'cool', depth: 1.01,
        keys: [{ at: said, pose: 'present', dur: 0.4 }, { at: bomb, pose: 'point', gaze: [0.9, 0.2], dur: 0.35 }, { at: pla, pose: 'examine', dur: 0.5 }] };
      return E.cine.shot(ctx, {
        set: 'yh36_carside', grade: 'cold',
        cam: { from: { x: -30, y: 30, z: 1.03 }, to: { x: 40, y: 60, z: 1.15 }, handheld: 0.5 },
        shake: [{ at: bomb, amp: 3 }],
        figures: [
          { id: 'yh36_clerk_c', x: 250, y: 1560, scale: 0.74, dir: 1, turn: 0.4, pose: 'stand', expr: 'neutral', depth: 1.01,
            keys: [{ at: bomb, pose: 'hand_to_face', expr: 'shocked', dur: 0.35 }, { at: car, pose: 'stand_tense', expr: 'worried', dur: 0.4 }] },
          { id: 'yh36_clerk_a', x: 600, y: 1640, scale: 0.84, dir: 1, turn: 0.5, pose: 'stand', expr: 'focused', depth: 1.01, show: [man - 0.1],
            keys: [{ at: bomb, pose: 'stand_tense', expr: 'worried', dur: 0.35 }, { at: dyn, pose: 'hand_to_face', expr: 'shocked', gaze: [0.8, 0.4], dur: 0.35 }] },
          rob
        ],
        props: [
          { depth: 1.0, svg: tt => sedan(360, 1500, 0.82, tt, { heads: 1 - seg(tt, man - 0.3, man + 0.3), door: ease.out(seg(tt, said, man + 0.2)) }) },
          { depth: 1.01, svg: tt => helmetFor(rob, tt) },
          { depth: 0.6, svg: tt => bike(1080, 1180, 0.3, tt, { flip: true, beacon: 1 }) }
        ],
        overlays: [
          { type: 'card', at: man - 0.1, x: 60, y: 390, w: 800, rows: [{ text: 'HIS STORY: THE MANAGER\'S HOUSE', fs: 32, colour: RED }, { text: 'WAS BOMBED · DYNAMITE IN THE CAR', fs: 32, colour: RED, at: dyn - 0.1 }, { text: 'THE MANAGER HAD GOT THREAT LETTERS', fs: 26, colour: MUTE, at: car - 0.1 }] },
          { type: 'impact', at: dyn, x: 360, y: 1300, colour: HL }
        ],
        tag: ROBBER
      });
    },

    // 6 - THE HOW: he kneels and crawls under the car; smoke and flames pour out (a flare); the staff run left. Music drop.
    yh36_flare(ctx) {
      const t = ctx.t, cr = WT(ctx, 0, 1, 0.2), smk = WT(ctx, 0, 3, 1.1), l1 = LS(ctx, 1, 2.8), four = WT(ctx, 1, 1, 2.9), ran = WT(ctx, 1, 3, 3.5), fl = WT(ctx, 1, 8, 4.8);
      const sk = tt => ease.out(seg(tt, smk - 0.1, smk + 0.7));
      const und = WT(ctx, 0, 2, 0.6); const rob = { id: 'yh36_robber', x: 860, y: 1660, scale: 0.86, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'cool', depth: 1.01, show: [-1, und + 0.45], keys: [{ at: 0.0, pose: 'kneel', dur: Math.max(0.3, cr) }, { at: und, x: 760, y: 1700, dur: 0.4 }] };
      return E.cine.shot(ctx, {
        set: 'yh36_carside', setOpts: { flare: seg(t, smk - 0.1, smk + 0.4) }, grade: 'neon',
        cam: { from: { x: 0, y: 40, z: 1.06 }, to: { x: -40, y: 70, z: 1.18 }, handheld: 0.6 },
        shake: [{ at: smk, amp: 7 }, { at: fl, amp: 4 }],
        figures: [
          rob,
          { id: 'yh36_clerk_a', x: 300, y: 1700, scale: 0.88, dir: -1, turn: 0.5, pose: 'stand_tense', expr: 'worried', depth: 1.06,
            walk: { from: 300, to: -260, at: ran - 0.2, dur: 0.9, cadence: 11, stride: 36 }, keys: [{ at: smk, pose: 'hand_to_face', expr: 'shocked', dur: 0.25 }, { at: ran - 0.25, pose: 'walk', expr: 'shocked', dur: 0.2 }] },
          { id: 'yh36_clerk_b', x: 140, y: 1620, scale: 0.8, dir: -1, turn: 0.5, pose: 'stand_tense', expr: 'worried', depth: 1.06,
            walk: { from: 140, to: -300, at: ran - 0.1, dur: 0.85, cadence: 11, stride: 36 }, keys: [{ at: smk + 0.1, pose: 'stand_tense', expr: 'shocked', dur: 0.25 }, { at: ran - 0.15, pose: 'walk', dur: 0.2 }] },
          { id: 'yh36_clerk_c', x: 470, y: 1580, scale: 0.74, dir: -1, turn: 0.5, pose: 'stand', expr: 'worried', depth: 1.06,
            walk: { from: 470, to: -260, at: ran, dur: 1.1, cadence: 10, stride: 34 }, keys: [{ at: smk, pose: 'hand_to_face', expr: 'shocked', dur: 0.25 }, { at: ran - 0.05, pose: 'walk', dur: 0.2 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => sedan(560, 1500, 0.82, tt, { door: 1, smoke: sk(tt) }) },
          { depth: 1.01, svg: tt => helmetFor(rob, tt) },
          { depth: 1.05, svg: tt => smoke(560, 1500, sk(tt), tt + (ctx.sceneStart || 0)) }
        ],
        overlays: [
          { type: 'impact', at: smk, x: 560, y: 1300, colour: HL },
          { type: 'card', at: l1 + 0.6, x: 60, y: 390, w: 760, rows: [{ text: 'IT WAS A FLARE', fs: 50, colour: RED, at: l1 + 0.6 }, { text: 'NO BOMB · NOBODY WAS HURT', fs: 30, at: l1 + 1.3 }] },
          { type: 'impact', at: fl, x: 540, y: 520, colour: YEL }
        ],
        tag: ROBBER
      });
    },

    // 7 - the getaway: the bank car speeds off right with the cash; two clerks stare from the kerb; the white bike, left
    //     behind, glows and is circled (a repainted civilian bike). The fun fact pops at the top.
    yh36_getaway(ctx) {
      const t = ctx.t, got = WT(ctx, 0, 1, 0.2), drv = WT(ctx, 0, 4, 0.6), all = WT(ctx, 0, 8, 1.5), l1 = LS(ctx, 1, 2.5), mot = WT(ctx, 1, 3, 3.3), fk = WT(ctx, 1, 6, 4.2);
      const carX = tt => lerp(560, 1900, ease.in(seg(tt, drv - 0.1, drv + 1.3))); const mv = tt => seg(tt, drv - 0.1, drv + 0.3);
      return E.cine.shot(ctx, {
        set: 'yh36_road', setOpts: { dark: 0 }, grade: 'warm',
        cam: { from: { x: -30, y: 30, z: 1.04 }, to: { x: 20, y: 50, z: 1.12 }, handheld: 0.5 },
        shake: [{ at: drv, amp: 5 }],
        figures: [
          { id: 'yh36_clerk_a', x: 170, y: 1760, scale: 1.02, dir: 1, turn: 0.5, pose: 'stand_tense', expr: 'worried', depth: 1.01,
            keys: [{ at: drv, pose: 'hand_to_face', expr: 'shocked', gaze: [0.9, -0.1], dur: 0.35 }, { at: l1 + 0.3, pose: 'point', expr: 'realise', gaze: [0.8, -0.2], dur: 0.4 }] },
          { id: 'yh36_clerk_b', x: 400, y: 1690, scale: 0.9, dir: 1, turn: 0.5, pose: 'stand', expr: 'worried', depth: 1.01,
            keys: [{ at: drv + 0.2, pose: 'stand_tense', expr: 'distraught', gaze: [0.9, -0.2], dur: 0.35 }, { at: mot, pose: 'hand_to_face', expr: 'shocked', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => sedan(carX(tt), 1330, 0.56, tt, { spin: tt * 1200 * mv(tt), speed: mv(tt) }) },
          { depth: 1.0, svg: tt => bike(760, 1450, 0.5, tt, { beacon: 0.4 }) },
          { depth: 1.2, svg: tt => drops(tt + (ctx.sceneStart || 0), 60, 0.25, 363) }
        ],
        overlays: [
          { type: 'impact', at: drv, x: 760, y: 1200, colour: YEL },
          { type: 'funfact', at: all + 0.2, until: l1 + 0.9, y: 400, rows: [{ text: 'THE TOSHIBA WORKERS STILL' }, { text: 'GOT THEIR BONUSES:' }, { text: 'THE CASH WAS INSURED.', colour: YEL }] },
          { type: 'circle', at: mot, target: [760, 1250], rx: 290, ry: 240, colour: HL },
          { type: 'card', at: mot + 0.1, x: 60, y: 420, w: 780, rows: [{ text: 'AN ORDINARY BIKE', fs: 40, colour: RED }, { text: 'REPAINTED TO LOOK LIKE POLICE', fs: 30, at: fk - 0.2 }] },
          { type: 'stamp', at: fk, x: 760, y: 980, text: 'FAKE', scale: 1.5, colour: '#e5372b' }
        ],
        tag: TAG
      });
    },

    // 8 - the hunt: detectives at a wall of generic helmet sketches; the count-up to 170,000 officers; the scale on a card
    yh36_hunt(ctx) {
      const t = ctx.t, ab = WT(ctx, 0, 0, 0.1), n170 = WT(ctx, 0, 1, 0.3), pol = WT(ctx, 0, 2, 1.3), wk = WT(ctx, 0, 4, 2.2), cs = WT(ctx, 0, 6, 2.6);
      const wallP = tt => { let g = `<g>`; const r = R(3608);
        for (let i = 0; i < 12; i++) { const x = 90 + (i % 6) * 152, y = 660 + Math.floor(i / 6) * 170, k = seg(tt, 0.05 + i * 0.09, 0.35 + i * 0.09); if (k <= 0) continue;
          g += `<g opacity="${f1(k)}" transform="rotate(${f1((r() - 0.5) * 6)} ${x + 60} ${y + 70})"><rect x="${x}" y="${y}" width="124" height="150" fill="#ece6d6" stroke="${INK}" stroke-width="3"/><path d="M${x + 22} ${y + 92} C${x + 18} ${y + 30} ${x + 106} ${y + 30} ${x + 102} ${y + 92} Z" fill="#9aa0a8"/><path d="M${x + 50} ${y + 60} L${x + 104} ${y + 60} L${x + 102} ${y + 90} L${x + 50} ${y + 90} Z" fill="#2a2e36"/><rect x="${x + 16}" y="${y + 112}" width="92" height="8" fill="#9a958a"/><rect x="${x + 16}" y="${y + 128}" width="64" height="8" fill="#9a958a"/></g>`; }
        return g + '</g>'; };
      const typing = (from, to, step = 0.22) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? 'sit_type_b' : 'sit_type', dur: step * 0.8 }); return k; };
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'night', dust: true,
        cam: { from: { x: 30, y: -10, z: 1.0 }, to: { x: -30, y: -30, z: 1.1 }, handheld: 0.4 },
        figures: [
          { id: 'yh36_det_a', x: 800, y: 1640, scale: 0.98, dir: -1, turn: 0.55, pose: 'stand', expr: 'focused',
            keys: [{ at: pol, pose: 'point', expr: 'determined', gaze: [0.9, -0.5], headTurn: 0.3, dur: 0.4 }, { at: cs, pose: 'arms_crossed', expr: 'stern', dur: 0.45 }] },
          { id: 'yh36_det_b', x: 400, y: 1660, scale: 0.94, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', keys: [...typing(0.05, wk), { at: wk, pose: 'sit_read', dur: 0.4 }] }
        ],
        props: [{ depth: 0.5, svg: wallP }],
        overlays: [
          { type: 'counter', at: n170 - 0.1, until: pol + 0.25, dur: 1.2, from: 0, to: 170000, label: 'POLICE OFFICERS', y: 560, fs: 130, colour: '#5fd4ff' },
          { type: 'card', at: pol + 0.4, x: 60, y: 390, w: 800, rows: [{ text: '110,000 SUSPECT NAMES CHECKED', fs: 32, colour: RED }, { text: 'COST: OVER ¥900 MILLION', fs: 30, at: wk }] }
        ],
        tag: TAG
      });
    },

    // 9 - the end of the road: a press table; the wall calendar flips 1968 -> 1975; the statute card; UNSOLVED stamp + impact
    yh36_never(ctx) {
      const t = ctx.t, n75 = WT(ctx, 0, 1, 0.3), tm = WT(ctx, 0, 2, 1.4), ch = WT(ctx, 0, 6, 2.2), l1 = LS(ctx, 1, 3.4), nev = WT(ctx, 1, 5, 4.4), cau = WT(ctx, 1, 6, 4.7);
      const cal = tt => { const yr = Math.round(lerp(1968, 1975, ease.inOut(seg(tt, n75 - 0.2, tm + 0.1)))); const flip = (tt * 7) % 1;
        return `<g transform="translate(830 560)"><rect x="-130" y="-150" width="260" height="300" rx="10" fill="#f4f0e4" stroke="${INK}" stroke-width="6"/><rect x="-130" y="-150" width="260" height="70" rx="10" fill="#c8312b"/>` +
          `<text x="0" y="-100" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="36" fill="#fff">DEC 10</text><text x="0" y="40" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="96" fill="#1a1915">${yr}</text>` +
          (yr < 1975 ? `<path d="M-120 ${f1(-70 + flip * 200)} L120 ${f1(-70 + flip * 200)}" stroke="#bdb6a8" stroke-width="4"/>` : '') + `</g>`; };
      return E.cine.shot(ctx, {
        set: 'press_room', grade: 'sepia',
        cam: { from: { x: 0, y: -20, z: 1.0 }, to: { x: -30, y: -40, z: 1.1 }, handheld: 0.4 },
        shake: [{ at: nev, amp: 6 }],
        figures: [{ id: 'yh36_chief', x: 470, y: 1290, scale: 0.72, dir: 1, turn: 0.15, pose: 'stand', expr: 'stern', gaze: [0.1, 0.1],
          keys: [{ at: n75, pose: 'present', dur: 0.45 }, { at: ch, pose: 'hands_together', expr: 'sad', dur: 0.5 }, { at: nev - 0.1, pose: 'bowed', expr: 'sad', dur: 0.6 }] }],
        props: [{ depth: 0.6, svg: cal }],
        overlays: [
          { type: 'card', at: tm - 0.1, x: 60, y: 390, w: 640, rows: [{ text: 'STATUTE OF LIMITATIONS', fs: 34, colour: RED }, { text: 'EXPIRED · 10 DEC 1975', fs: 32, at: ch - 0.1 }] },
          { type: 'stamp', at: nev, x: 540, y: 960, text: 'NEVER CAUGHT', scale: 1.5, colour: '#e5372b' },
          { type: 'impact', at: nev, x: 540, y: 960, colour: HL }
        ],
        tag: TAG
      });
    },

    // 10 - the lesson card, then the callback on the hero motorcycle in the first frame's framing; the end question is
    //      burned in over the last 3.2 s, so the lesson card has faded by then; the last frame loops to the first.
    yh36_end(ctx) {
      const t = ctx.t, T = ctx.T, les = WT(ctx, 0, 1, 0.2), uni = WT(ctx, 0, 3, 0.9), l1 = LS(ctx, 1, 2.7), fk = WT(ctx, 1, 5, 3.6), mot = WT(ctx, 1, 7, 4.2);
      const rob = { ...ROB, keys: [{ at: uni, pose: 'stand_tense', dur: 0.4 }, { at: l1, pose: 'stand', dur: 0.6 }] };
      return E.cine.shot(ctx, {
        set: 'yh36_road', setOpts: { dark: 0.2 }, grade: 'tokyo',
        cam: { from: { x: 20, y: 70, z: 1.1 }, to: { x: 0, y: 30, z: 1.0 }, handheld: 0.4 },
        figures: [rob],
        props: [{ depth: 1.0, svg: tt => helmetFor(rob, tt) },
          { depth: 1.0, svg: tt => bike(HERO.x, HERO.y, HERO.s, tt, { beacon: 1, glow: 0.85 * seg(tt, fk - 0.1, fk + 0.3) * (1 - seg(tt, mot + 0.6, mot + 1.2)) }) },
          { depth: 1.2, svg: tt => drops(tt + (ctx.sceneStart || 0), 80, 0.3) }],
        overlays: [
          { type: 'lesson', at: les - 0.15, until: T - 3.75, y: 400, rows: [{ text: "A UNIFORM ISN'T PROOF.", fs: 50 }, { text: 'ASK FOR ID, OR CALL THE AGENCY', fs: 36 }, { text: 'ON A NUMBER YOU LOOK UP YOURSELF.', fs: 36 }] }
        ],
        tag: ROBBER
      });
    }
  });
})();
