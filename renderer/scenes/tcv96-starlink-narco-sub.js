/* Case File 96 (premium look, ENGINE V8 + the making-verb hook; promise -> proof -> escalate -> callback; the loop; THE
   28-SECOND CUT): SMUGGLER TECH, 1.
   HEADLINE: off Tayrona National Park near Santa Marta, Colombia's Caribbean coast (found April 2025, announced 2 July 2025):
   the Colombian Navy seized an uncrewed, remote-controlled semi-submersible fitted with a Starlink antenna; empty (a trial
   run); capacity 1.5 tonnes of cocaine; the Gulf Clan's, per the navy (the callback).
   CASE 2: Callao, Peru, June 2011: a fake torpedo clamped under a boat's hull; police divers found it, with 113 kg of cocaine.
   CASE 3 (best last): near San Lorenzo, Ecuador, July 2010: on a DEA tip, Ecuadorian police and troops found the first fully
   submersible narco submarine half-submerged in a jungle channel, before it ever sailed (one person detained).
   Structure: frame 0 = THE MADE THING IN THE ACT: dawn at sea off a dark jungle coast; a low grey fibreglass
   semi-submersible cuts left to right through the swell with nobody aboard, spray off its bow, a white flat satellite
   antenna on its back blinking; a navy patrol boat's searchlight (its operator a small silhouette on the bow, lower right)
   sweeps onto it; the camera already pushing in. Then the seizure (morning: the sub between two grey patrol boats, the
   hatch open on an empty hull, the impact), case 2 (Callao harbour at night, half above and half below the waterline: the
   torpedo under the hull; the close: a police diver's torch finds it, the 113 KG counter), case 3 (a jungle channel: a
   real submarine half-submerged under netting, the fun fact; the close at the bank: the netting pulled back, the detained
   man led away: the music drop) and the callback on frame 1's picture, where the searchlight sweeps back so the last
   frame equals the first.
   Smoothness: cuts and dissolves, one push (into case 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact. Screen direction: the drone sub travels left to right; the diver swims left to right; the troops
   come in from the left.
   Look: episode.look = 'premium', one cool sea palette (shadow #0e1c26, mid #b6b4a8, accent #e8a33a). The strongly coloured
   things are the searchlight pool on the hull, the antenna's blink, the packets in the torpedo.
   Content rules: no weapon, no violence; navy, police and troops hold only flashlights; generic figures with no badge, flag,
   crest or insignia; boats, ships and submarines carry no name, number, flag, logo or livery; the satellite antenna is a
   generic white flat panel with no logo (Starlink is named in the narration only, as reported). Nobody is drawn aboard the
   drone sub (it had no crew). The man detained in Ecuador is a dark silhouette, never named.
   New environments (E.registerSets): ns96_sea (the Caribbean off a jungle coast; view 'dawn' or 'day'), ns96_harbour
   (Callao at night, split at the waterline), ns96_under (under a ship's hull), ns96_jungle (a jungle channel; view 'wide'
   or 'close'). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#10151a';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const TAGL = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#e8a33a', BEAM = '#fff0cc';
  const SIDE = '#4c5960', DECK = '#7b878d', DECK_L = '#a6b2b6', HULL_D = '#2e383e';

  // ---------- water
  // a moving water band from y0 down: drifting highlight streaks that spread toward the viewer; o.dx scrolls them (the
  // camera travels with the boat, so the water slides past right to left)
  function sea(y0, t, o = {}) {
    const col = o.col || '#1a2a34', hi = o.hi || '#8aa2aa', sp = o.sp ?? 1, n = o.n ?? 18, r = R(o.seed || 9601), dx = o.dx ?? 0;
    let g = `<rect x="-600" y="${f1(y0)}" width="${W + 1200}" height="${H + 600}" fill="${col}"/>`;
    for (let i = 0; i < n; i++) { const u = i / n, y = y0 + u * u * 1000 + 6, k = 0.3 + u * 1.7;
      for (let j = 0; j < 5; j++) { const x = ((r() * 2200 - t * (24 + 70 * u) * sp * (j % 2 ? 1 : 0.7) - dx * t * k * 60) % 2200 + 2200) % 2200 - 600, w = (40 + r() * 130) * k;
        g += `<path d="M${f1(x)} ${f1(y)} q${f1(w / 2)} ${f1(-4 * k)} ${f1(w)} 0" stroke="${hi}" stroke-width="${f1(2 + 3 * u)}" fill="none" opacity="${f1(0.16 + 0.28 * u)}"/>`; } }
    return g;
  }
  const crestY = (x, y, t, a, L, sp, ph) => y + a * Math.sin((x / L) * Math.PI * 2 + t * 1.6 * sp + ph) + a * 0.35 * Math.sin((x / (L * 0.47)) * Math.PI * 2 - t * 2.3 * sp + ph);
  // a wave crest band across the frame, filled down to y + 900, with a foam line
  function crest(y, t, a, L, col, op, sp = 1, ph = 0, foam = 0.35) {
    let d = `M-600 ${f1(y + 900)}`, fd = '';
    for (let x = -600; x <= W + 600; x += 30) { const yy = crestY(x, y, t, a, L, sp, ph); d += ` L${x} ${f1(yy)}`; fd += (x === -600 ? 'M' : ' L') + `${x} ${f1(yy)}`; }
    d += ` L${W + 600} ${f1(y + 900)} Z`;
    return `<path d="${d}" fill="${col}" opacity="${f1(op)}"/>` + (foam > 0 ? `<path d="${fd}" stroke="#d8e2e2" stroke-width="5" fill="none" opacity="${f1(foam * op)}"/>` : '');
  }

  // ---------- THE HERO: the uncrewed semi-submersible, profile facing RIGHT (bow at +520, stern at -470), waterline at local
  // y = 0, seen from slightly above (the deck shows), low and shark-like: a long pointed hull riding awash, a raked fin-like
  // cabin, the white flat antenna on a mast on the foredeck. o.lit 0..1 the searchlight on it; o.hatch 0..1 the hatch lid
  // open (s02); o.run 0..1 under way (bow spray, wake, water over the deck); o.bob the swell motion; o.sig the satellite
  // signal arcs from the antenna
  function semiSub(x, y, s, t, o = {}) {
    const bb = o.bob ?? 1, run = o.run ?? 1, lit = o.lit ?? 0, hatch = clamp(o.hatch || 0, 0, 1), sig = o.sig ?? 0;
    const bob = bb * (5 * Math.sin(t * 1.4) + 2.5 * Math.sin(t * 2.9 + 1)), pitch = bb * 0.9 * Math.sin(t * 1.4 + 0.6);
    let g = `<g transform="translate(${f1(x)} ${f1(y + bob * s)}) scale(${sc(s)})">`;
    // the wake: foam streaks trailing off the stern, sliding left
    if (run > 0) {
      let wk = '';
      for (let i = 0; i < 9; i++) { const u = ((t * 0.9 + i / 9) % 1), xx = -480 - u * 700, sp = 20 + u * 120;
        wk += `<path d="M${f1(xx)} ${f1(-4 - sp * 0.35)} q-60 ${f1(-10 - u * 10)} -130 ${f1(-sp * 0.15)}" stroke="#e6eeee" stroke-width="${f1(7 - u * 4)}" fill="none" opacity="${f1(0.55 * (1 - u) * run)}"/>` +
          `<path d="M${f1(xx)} ${f1(10 + sp * 0.3)} q-60 ${f1(12 + u * 10)} -140 ${f1(sp * 0.18)}" stroke="#e6eeee" stroke-width="${f1(8 - u * 4)}" fill="none" opacity="${f1(0.5 * (1 - u) * run)}"/>`; }
      g += wk + wash(-660, 6, 300, 40, '#dfe9e9', f1(0.18 * run));
    }
    g += `<g transform="rotate(${f1(pitch)})">`;
    // the side band above the water (dark blue-grey fibreglass), the long pointed bow
    g += `<path d="M-472 10 L-466 -70 Q-300 -88 -40 -92 L300 -84 Q450 -70 524 -16 L520 10 Z" fill="${SIDE}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    g += `<path d="M-460 -30 Q0 -42 490 -16" stroke="#3a454b" stroke-width="6" fill="none" opacity="0.8"/>`;
    // the deck, seen from slightly above, converging to the bow point
    g += `<path d="M-466 -70 Q-456 -112 -392 -122 Q-40 -140 300 -126 Q450 -104 524 -16 Q450 -70 300 -84 L-40 -92 Q-300 -88 -466 -70 Z" fill="${DECK}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-436 -100 Q-40 -126 300 -112 Q410 -96 486 -40" stroke="${DECK_L}" stroke-width="7" fill="none" opacity="0.75"/>`;
    for (let i = 0; i < 8; i++) g += `<path d="M${-380 + i * 105} ${f1(-88 - 34 * Math.sin(Math.PI * (i + 0.5) / 8))} L${-384 + i * 105} -6" stroke="#2e383e" stroke-width="3" opacity="0.4"/>`;
    // the exhaust stack at the stern
    g += `<rect x="-420" y="-196" width="24" height="96" fill="${SIDE}" stroke="${INK}" stroke-width="4"/><rect x="-428" y="-206" width="40" height="14" rx="3" fill="#2e363a" stroke="${INK}" stroke-width="3"/>`;
    // the raked, fin-like cabin with a camera dome at its front (remote cameras) and the hatch on top (opens in s02)
    g += `<path d="M-290 -112 Q-250 -210 -150 -222 L30 -222 Q110 -214 170 -118 Z" fill="${SIDE}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-262 -150 Q-230 -206 -150 -214 L30 -214 Q94 -206 136 -158 Q30 -180 -70 -180 Q-190 -178 -262 -150 Z" fill="${DECK}" opacity="0.9"/>`;
    g += `<path d="M-30 -170 L120 -150" stroke="#141a1e" stroke-width="12" stroke-linecap="round" opacity="0.85"/>`;
    g += `<circle cx="152" cy="-134" r="17" fill="#141a1e" stroke="${INK}" stroke-width="3"/><circle cx="157" cy="-139" r="6" fill="#9ab4c0" opacity="0.85"/>`;
    if (hatch > 0) g += `<ellipse cx="-90" cy="-214" rx="${f1(50 * hatch)}" ry="${f1(11 * hatch)}" fill="#050708"/>`;
    g += `<g transform="rotate(${f1(-105 * ease.inOut(hatch))} -140 -216)"><ellipse cx="-90" cy="-216" rx="52" ry="12" fill="${DECK_L}" stroke="${INK}" stroke-width="4"/></g>`;
    // the searchlight's warm pool on the hull (the accent)
    if (lit > 0) g += `<g style="mix-blend-mode:screen">${wash(180, -100, 380, 120, '#ffbe6a', f1(0.5 * lit))}${wash(300, -80, 160, 60, '#fff0d0', f1(0.3 * lit))}</g>`;
    // THE ANTENNA: a white flat panel tilted to the sky on a mast on the foredeck (generic; no logo); its light blinks
    g += `<path d="M262 -112 L262 -196" stroke="#20282c" stroke-width="12"/><path d="M244 -114 L280 -114" stroke="#20282c" stroke-width="10"/>`;
    g += `<path d="M178 -272 L346 -258 L338 -198 L170 -212 Z" fill="#eef1f0" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M186 -262 L338 -248" stroke="#ffffff" stroke-width="6" opacity="0.85"/><path d="M174 -216 L338 -202" stroke="#aeb6b8" stroke-width="6" opacity="0.9"/>`;
    if (lit > 0) g += `<path d="M178 -272 L346 -258 L338 -198 L170 -212 Z" fill="#fff4dc" opacity="${f1(0.4 * lit)}"/>`;
    const bl = Math.pow(Math.max(0, Math.sin(t * 5.2)), 6);
    g += wash(262, -196, 50, 36, '#ffd890', f1(0.2 + 0.7 * bl)) + `<circle cx="262" cy="-196" r="${f1(7 + 5 * bl)}" fill="${bl > 0.3 ? '#fff4d6' : '#d8a050'}" stroke="${INK}" stroke-width="2"/>`;
    // the signal: arcs rising off the panel toward the sky, cycling
    if (sig > 0) { let sg = ''; for (let i = 0; i < 3; i++) { const u = ((t * 0.8 + i / 3) % 1), r = 60 + u * 220; sg += `<path d="M${f1(258 - r * 0.7)} ${f1(-250 - r * 0.45)} Q258 ${f1(-250 - r * 1.05)} ${f1(258 + r * 0.7)} ${f1(-250 - r * 0.45)}" stroke="#fff0c8" stroke-width="${f1(8 - u * 5)}" fill="none" stroke-linecap="round" opacity="${f1(0.75 * sig * Math.sin(Math.PI * u))}"/>`; } g += `<g style="mix-blend-mode:screen">${sg}</g>`; }
    // water washing over the deck and along the waterline
    if (run > 0) {
      let fm = '';
      for (let i = 0; i < 12; i++) { const u = ((t * 1.3 + i / 12) % 1), xx = 480 - u * 950; fm += `<path d="M${f1(xx)} ${f1(-4 + 4 * Math.sin(i))} q-30 -8 -76 -2" stroke="#eef4f4" stroke-width="7" fill="none" opacity="${f1(0.55 * Math.sin(Math.PI * u) * run)}"/>`; }
      fm += `<path d="M520 -14 Q440 -70 300 -92 Q380 -60 430 -30 Z" fill="#dfeaea" opacity="${f1((0.35 + 0.15 * Math.sin(t * 3.1)) * run)}"/>`;
      for (let i = 0; i < 5; i++) { const u = ((t * 0.9 + i / 5) % 1), xx = 420 - u * 560; fm += `<path d="M${f1(xx)} ${f1(-96 - 10 * u)} q-40 -6 -90 4" stroke="#e8f0f0" stroke-width="5" fill="none" opacity="${f1(0.4 * Math.sin(Math.PI * u) * run)}"/>`; }
      g += fm;
    }
    g += `<path d="M-474 2 Q0 14 524 2" stroke="#dfe8e8" stroke-width="8" fill="none" opacity="0.6"/>`;
    g += '</g>';
    // the bow spray: droplets thrown forward and up off the bow, cycling
    if (run > 0) {
      let sp = '';
      const r = R(9611);
      for (let i = 0; i < 30; i++) { const ph = r(), v = 0.7 + r() * 0.6, ang = -0.35 - r() * 0.9, u = ((t * 1.7 * v + ph) % 1);
        const px = 510 + Math.cos(ang) * 280 * u, py = -14 + Math.sin(ang) * 240 * u + 280 * u * u, rr = 5 + r() * 10;
        sp += `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(rr * (1 - u * 0.4))}" fill="#eef4f4" opacity="${f1(0.8 * (1 - u) * run)}"/>`; }
      g += sp + `<path d="M450 6 Q540 -50 620 -38 Q580 -8 660 12" stroke="#eef4f4" stroke-width="12" fill="none" opacity="${f1(0.65 * run)}"/>` + wash(560, -24, 140, 70, '#eef4f4', f1(0.28 * run));
    }
    return g + '</g>';
  }
  // the hull below the waterline, seen through the water (drawn over the near swell, translucent)
  function subUnder(x, y, s, t) {
    const bob = 5 * Math.sin(t * 1.4) + 2.5 * Math.sin(t * 2.9 + 1);
    return `<g transform="translate(${f1(x)} ${f1(y + bob * s)}) scale(${sc(s)})"><path d="M-472 8 Q-490 70 -420 96 L420 96 Q500 70 522 10 Z" fill="#0c161c" opacity="0.42"/></g>`;
  }
  // a generic satellite (body and two panels, no marking), small, high in the sky; and a dashed link down to the antenna
  function satellite(x, y, s, t) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(-14 + 3 * Math.sin(t * 0.6))}) scale(${sc(s)})">`;
    g += `<rect x="-130" y="-22" width="96" height="44" fill="#4a5a78" stroke="#cfd6e0" stroke-width="3"/><rect x="34" y="-22" width="96" height="44" fill="#4a5a78" stroke="#cfd6e0" stroke-width="3"/>`;
    g += `<path d="M-98 -22 L-98 22 M-66 -22 L-66 22 M66 -22 L66 22 M98 -22 L98 22" stroke="#8a9ab8" stroke-width="2"/>`;
    g += `<rect x="-26" y="-26" width="52" height="52" rx="6" fill="#d8dcdc" stroke="#20262c" stroke-width="3"/><path d="M-34 0 L-26 0 M26 0 L34 0" stroke="#d8dcdc" stroke-width="5"/>`;
    return g + '</g>' + wash(x, y, 70, 50, '#fff0c8', 0.16 + 0.12 * Math.sin(t * 3));
  }
  // ---------- a generic grey navy patrol boat: the foredeck coming in from the lower right (frame-1 coordinates), with
  // a searchlight on a pedestal aimed at (tx, ty); no number, flag or marking
  const LAMP = { x: 770, y: 1176 };
  function patrolDeck() {
    let g = '';
    // the hull side and the foredeck (drawn behind the operator)
    g += `<path d="M590 1460 L700 1330 Q900 1300 1300 1310 L1300 1980 L760 1980 Z" fill="#59646c" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    g += `<path d="M610 1450 L712 1338 Q900 1312 1300 1322 L1300 1440 Q900 1430 640 1470 Z" fill="#7d8890"/>`;
    g += `<path d="M640 1470 Q900 1430 1300 1440" stroke="#9aa5ac" stroke-width="6" fill="none" opacity="0.7"/>`;
    return g;
  }
  function patrolFront(t, tx, ty, on = 1) {
    let g = '';
    // the guard rail
    g += `<path d="M600 1452 Q900 1400 1300 1404" stroke="#2a3238" stroke-width="7" fill="none"/>`;
    for (let i = 0; i < 6; i++) { const x = 640 + i * 120; g += `<path d="M${x} ${f1(1446 - i * 8)} L${x + 6} ${f1(1530 - i * 8)}" stroke="#2a3238" stroke-width="6"/>`; }
    // the searchlight: pedestal and a drum lamp turned toward its target
    const a = Math.atan2(ty - LAMP.y, tx - LAMP.x) * 180 / Math.PI;
    g += `<rect x="${LAMP.x - 12}" y="${LAMP.y + 10}" width="24" height="230" fill="#2a3238" stroke="${INK}" stroke-width="4"/><rect x="${LAMP.x - 34}" y="${LAMP.y + 230}" width="68" height="18" rx="4" fill="#2a3238"/>`;
    g += `<g transform="translate(${LAMP.x} ${LAMP.y}) rotate(${f1(a)})"><rect x="-40" y="-30" width="74" height="60" rx="12" fill="#3a444a" stroke="${INK}" stroke-width="5"/><ellipse cx="36" cy="0" rx="12" ry="30" fill="${on > 0 ? '#fff6dc' : '#4a545a'}" stroke="${INK}" stroke-width="4"/></g>`;
    if (on > 0) g += wash(LAMP.x + 30, LAMP.y - 10, 90, 80, BEAM, f1(0.5 * on));
    return g;
  }
  // a searchlight cone from (x0, y0) to (x1, y1), half-width w at the target, and the warm pool where it lands
  function beamCone(x0, y0, x1, y1, w, op) {
    if (op <= 0) return '';
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
    return `<g style="mix-blend-mode:screen"><path d="M${f1(x0)} ${f1(y0)} L${f1(x1 + nx * w)} ${f1(y1 + ny * w)} L${f1(x1 - nx * w)} ${f1(y1 - ny * w)} Z" fill="${BEAM}" opacity="${f1(0.17 * op)}"/>` +
      `<path d="M${f1(x0)} ${f1(y0)} L${f1(x1 + nx * w * 0.45)} ${f1(y1 + ny * w * 0.45)} L${f1(x1 - nx * w * 0.45)} ${f1(y1 - ny * w * 0.45)} Z" fill="${BEAM}" opacity="${f1(0.12 * op)}"/>` +
      wash(x1, y1, w * 1.5, w * 0.8, '#ffd28a', f1(0.42 * op)) + wash(x1, y1, w * 0.7, w * 0.4, BEAM, f1(0.35 * op)) + `</g>`;
  }

  // ---------- frame 1: the sub, the swell around it, the patrol boat and its beam. tau = seconds since frame 0; the beam's
  // sweep runs on its own clock (sw) so the end scene can play it backwards
  const SUB = { x: 500, y: 990, s: 0.96 };
  const SAT = { x: 930, y: 640 };
  // the satellite and a dashed link from it down to the antenna (frame-1 coordinates; the dashes travel down)
  const satLink = tau => { const ax = SUB.x + 258 * SUB.s, ay = SUB.y - 300 * SUB.s; return `<path d="M${f1(SAT.x - 20)} ${f1(SAT.y + 30)} L${f1(ax + 10)} ${f1(ay)}" stroke="#fff0c8" stroke-width="5" stroke-dasharray="14 18" stroke-dashoffset="${f1(-tau * 60)}" opacity="0.5"/>` + satellite(SAT.x, SAT.y, 0.7, tau); };
  const B0 = { x: 1010, y: 1010 }, B1 = { x: 560, y: 900 };
  const sweepAt = sw => { const e = ease.inOut(clamp((sw + 0.3) / 1.9, 0, 1)); return { x: lerp(B0.x, B1.x, e), y: lerp(B0.y, B1.y, e), e }; };
  function heroAt(tau, sw) {
    const b = sweepAt(sw);
    const lit = clamp(1 - Math.abs(b.x - 740) / 520, 0.15, 1);
    return {
      back: crest(SUB.y - 34, tau, 9, 380, '#20323c', 0.7, 0.9, 0.4, 0.25),
      sub: satLink(tau) + semiSub(SUB.x, SUB.y, SUB.s, tau, { lit, run: 1, sig: 1 }),
      front: crest(SUB.y + 26, tau, 13, 460, '#1c2c36', 0.82, 1.1, 1.7, 0.3) + subUnder(SUB.x, SUB.y, SUB.s, tau) + crest(SUB.y + 170, tau, 20, 560, '#18262f', 0.9, 1.2, 0.9, 0.3),
      beam: beamCone(LAMP.x + 30, LAMP.y - 6, b.x, b.y, 120, 1),
      deck: patrolDeck(),
      boat: patrolFront(tau, b.x, b.y, 1),
    };
  }
  // memoised per (tau, sweep): every prop layer of the hero shot reads the same frame
  let _hk = null, _hv = null;
  const heroM = (tau, sw) => { const k = tau.toFixed(4) + '|' + sw.toFixed(4); if (k !== _hk) { _hk = k; _hv = heroAt(tau, sw); } return _hv; };

  // ---------- a generic cargo ship's hull (Callao), seen side-on, cut by the waterline; and the narco-torpedo
  // the torpedo: a grey cylinder with a cone nose and small fins, steel clamps, centre (x, y), length ~600 at s = 1;
  // o.open 0..1 a panel slides back on taped packets (the accent); o.lit the torch on it
  function torpedo(x, y, s, o = {}) {
    const op_ = clamp(o.open || 0, 0, 1), lit = o.lit ?? 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    if (lit > 0) g += wash(0, 0, 380, 120, '#cfeee6', f1(0.3 * lit));
    g += `<path d="M-300 -46 L220 -46 Q300 -40 330 0 Q300 40 220 46 L-300 46 Q-318 0 -300 -46 Z" fill="#6e7a7a" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-290 -30 L220 -30 Q280 -26 306 -6" stroke="#9aa8a6" stroke-width="7" fill="none" opacity="0.8"/><path d="M-290 30 L220 30" stroke="#48524f" stroke-width="7" opacity="0.8"/>`;
    g += `<path d="M-300 -46 L-350 -84 L-330 -40 Z M-300 46 L-350 84 L-330 40 Z" fill="#5a6464" stroke="${INK}" stroke-width="4"/>`;
    // cement-sealed seam and rust
    g += `<path d="M-120 -46 L-120 46 M100 -46 L100 46" stroke="#3a4242" stroke-width="5"/><path d="M-200 -10 q30 12 60 0 M40 16 q40 10 70 -4" stroke="#8a5a3a" stroke-width="5" fill="none" opacity="0.5"/>`;
    // the open panel on the packets
    if (op_ > 0) {
      g += `<rect x="-110" y="-38" width="${f1(200 * op_)}" height="76" fill="#1a1612"/>`;
      for (let i = 0; i < 4; i++) { const px = -96 + i * 48; if (px + 44 > -110 + 200 * op_) break; g += `<rect x="${px}" y="-30" width="42" height="60" rx="8" fill="#c8954f" stroke="${INK}" stroke-width="3"/><path d="M${px} -4 L${px + 42} -8" stroke="#8a6232" stroke-width="5"/>`; }
      g += wash(-10, 0, 140, 60, ACC, f1(0.35 * op_));
    }
    return g + '</g>';
  }
  // the clamps that hold it to the hull plate above (y = hull line, relative to the torpedo centre at s = 1)
  function clamps(x, y, s, gap = 70) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    [-200, 0, 180].forEach(cx => { g += `<path d="M${cx - 50} ${-gap} L${cx - 50} -20 Q${cx} -70 ${cx + 50} -20 L${cx + 50} ${-gap}" fill="none" stroke="#3a3430" stroke-width="12"/><rect x="${cx - 64}" y="${-gap - 14}" width="128" height="16" fill="#4a423a" stroke="${INK}" stroke-width="3"/>`; });
    return g + '</g>';
  }
  // a police diver (generic: black wetsuit, mask, tank, fins), swimming RIGHT; centre (x, y); kick phase from t; torch beam
  // toward (tx, ty) when beam > 0
  function diver(x, y, s, t, beam = 0, tx = 0, ty = 0) {
    const k = Math.sin(t * 5.5), k2 = Math.sin(t * 5.5 + 1.2);
    let g = '';
    if (beam > 0) {
      const ax = x + 150 * s, ay = y - 30 * s, dx = tx - ax, dy = ty - ay, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, w = 110;
      g += `<g style="mix-blend-mode:screen"><path d="M${f1(ax)} ${f1(ay)} L${f1(tx + nx * w)} ${f1(ty + ny * w)} L${f1(tx - nx * w)} ${f1(ty - ny * w)} Z" fill="#e6fff6" opacity="${f1(0.2 * beam)}"/>` + wash(tx, ty, 160, 90, '#e6fff6', f1(0.4 * beam)) + `</g>`;
    }
    g += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)}) rotate(-8)">`;
    // fins and legs (kicking)
    g += `<g transform="rotate(${f1(6 * k)} -60 10)"><path d="M-60 0 L-200 ${f1(10 + 18 * k)} L-270 ${f1(-6 + 40 * k)} L-300 ${f1(40 + 40 * k)} L-196 ${f1(34 + 18 * k)} L-60 24 Z" fill="#14181a" stroke="${INK}" stroke-width="4"/></g>`;
    g += `<g transform="rotate(${f1(6 * k2)} -60 10)"><path d="M-60 10 L-200 ${f1(30 - 18 * k2)} L-270 ${f1(20 - 40 * k2)} L-300 ${f1(66 - 40 * k2)} L-196 ${f1(52 - 18 * k2)} L-60 34 Z" fill="#1e2427" stroke="${INK}" stroke-width="4"/></g>`;
    // torso, tank, arm with the torch, head with the mask
    g += `<rect x="-90" y="-62" width="150" height="34" rx="14" fill="#3a4448" stroke="${INK}" stroke-width="4"/><path d="M-80 -60 L40 -60" stroke="#5a6468" stroke-width="5"/>`;
    g += `<path d="M-70 -30 Q0 -44 90 -26 Q110 0 80 24 Q0 34 -70 26 Z" fill="#1a1f22" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M60 -16 L130 -26 L152 -32" stroke="#1a1f22" stroke-width="20" stroke-linecap="round"/><rect x="140" y="-42" width="34" height="18" rx="5" fill="#d8d0b8" stroke="${INK}" stroke-width="3"/>`;
    g += `<circle cx="120" cy="-40" r="28" fill="#1a1f22" stroke="${INK}" stroke-width="4"/><path d="M126 -54 L150 -50 L148 -26 L124 -30 Z" fill="#9ac0c8" stroke="${INK}" stroke-width="3" opacity="0.9"/>`;
    // bubbles rising from the regulator
    let bub = ''; for (let i = 0; i < 6; i++) { const u = ((t * 0.8 + i / 6) % 1); bub += `<circle cx="${f1(110 + 12 * Math.sin(u * 9 + i))}" cy="${f1(-60 - u * 240)}" r="${f1(5 + i % 3 * 3)}" fill="none" stroke="#dff2f0" stroke-width="3" opacity="${f1(0.7 * (1 - u))}"/>`; }
    return g + bub + '</g>';
  }

  // ---------- the jungle submarine (Ecuador 2010): a long dark cylinder lying half-submerged, profile facing LEFT, waterline
  // at local y = 0, ~1100 long at s = 1, conning tower and periscope; o.net 0..1 camouflage netting over it; o.lit torch light
  function jungleSub(x, y, s, t, o = {}) {
    const net = clamp(o.net ?? 1, 0, 1), lit = o.lit ?? 0, bob = 2 * Math.sin(t * 0.9);
    let g = `<g transform="translate(${f1(x)} ${f1(y + bob)}) scale(${sc(s)})">`;
    g += `<path d="M-560 0 Q-560 90 -480 110 L460 110 Q560 90 560 0 Z" fill="#1e2620" opacity="0.6"/>`;
    // the visible top of the hull
    g += `<path d="M-580 4 Q-560 -60 -470 -74 L470 -74 Q540 -66 566 -22 L570 4 Z" fill="#28322a" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    g += `<path d="M-548 -40 Q-490 -64 -400 -68 L460 -68 Q522 -60 550 -32" stroke="#9aae88" stroke-width="8" fill="none" opacity="0.75"/>`;
    for (let i = 0; i < 9; i++) g += `<path d="M${-460 + i * 110} -62 L${-462 + i * 110} 0" stroke="#2a3428" stroke-width="3" opacity="0.6"/>`;
    // the conning tower, the hatch, the periscope mast
    g += `<path d="M-90 -70 L-70 -230 Q-66 -246 -46 -246 L70 -246 Q92 -246 96 -228 L120 -70 Z" fill="#303c2e" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    g += `<path d="M-74 -216 L-66 -238 L70 -238 L92 -222" stroke="#9aae88" stroke-width="6" fill="none" opacity="0.7"/><path d="M-70 -200 L96 -200" stroke="#4a5844" stroke-width="6"/><ellipse cx="10" cy="-248" rx="44" ry="9" fill="#1e2620" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="58" y="-370" width="16" height="130" fill="#222a20" stroke="${INK}" stroke-width="3"/><path d="M58 -370 L102 -370 L102 -350 L74 -350" fill="#222a20" stroke="${INK}" stroke-width="3"/>`;
    // mud and water lapping at the waterline, weed
    g += `<path d="M-590 4 Q-300 18 0 6 Q300 -4 590 8" stroke="#8a7a58" stroke-width="10" fill="none" opacity="0.7"/>`;
    if (lit > 0) g += wash(10, -150, 220, 160, '#fff1c8', f1(0.35 * lit));
    // the camouflage netting: a mesh draped over the rear half and the tower, with leaf tufts; it pulls back with net -> 0
    if (net > 0) {
      const x0 = lerp(560, -40, net); let m = '';
      m += `<path d="M${f1(x0)} 10 Q${f1(x0 - 40)} -120 ${f1(Math.min(x0, 130))} -250 L600 -250 L600 10 Z" fill="#2c3a24" opacity="0.55"/>`;
      for (let i = 0; i < 12; i++) { const xx = x0 + i * 52; if (xx > 600) break; m += `<path d="M${f1(xx)} -250 L${f1(xx - 30)} 10" stroke="#5a6a3a" stroke-width="3" opacity="0.7"/>`; }
      for (let j = 0; j < 6; j++) m += `<path d="M${f1(x0)} ${-40 * j} L600 ${-40 * j}" stroke="#5a6a3a" stroke-width="3" opacity="0.6"/>`;
      const r = R(9661); for (let i = 0; i < 26; i++) { const xx = x0 + r() * (600 - x0), yy = -240 + r() * 240; m += `<ellipse cx="${f1(xx)}" cy="${f1(yy)}" rx="${f1(16 + r() * 18)}" ry="${f1(8 + r() * 8)}" fill="${r() < 0.5 ? '#4a6a34' : '#3a5428'}" opacity="0.9"/>`; }
      g += m;
    }
    return g + '</g>';
  }
  // a stilt shack with a tin roof (the smugglers' camp)
  const shack = (x, y, s, seed) => { const r = R(seed); let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    [-90, -30, 40, 90].forEach(px => { g += `<rect x="${px - 5}" y="-10" width="10" height="${f1(140 + r() * 30)}" fill="#3a2e22"/>`; });
    g += `<rect x="-110" y="-140" width="220" height="130" fill="#5a4630" stroke="${INK}" stroke-width="4"/>`;
    for (let i = 0; i < 7; i++) g += `<path d="M${-106 + i * 32} -138 L${-106 + i * 32} -12" stroke="#4a3a26" stroke-width="4"/>`;
    g += `<path d="M-130 -134 L0 -200 L130 -134 Z" fill="#7a7a72" stroke="${INK}" stroke-width="4"/><path d="M-110 -140 L0 -196" stroke="#9a9a90" stroke-width="4" opacity="0.6"/>`;
    g += `<rect x="-30" y="-110" width="44" height="40" fill="#1a1612"/>`;
    return g + '</g>'; };
  // a palm / broadleaf clump
  function leaves(x, y, s, col, seed, sway = 0) {
    const r = R(seed); let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(sway)}) scale(${sc(s)})">`;
    for (let i = 0; i < 9; i++) { const a = -160 + i * 18 + (r() - 0.5) * 10, L = 220 + r() * 120;
      g += `<g transform="rotate(${f1(a)})"><path d="M0 0 Q${f1(L * 0.5)} -40 ${f1(L)} 0 Q${f1(L * 0.5)} 40 0 0 Z" fill="${col}" stroke="${INK}" stroke-width="3" opacity="0.96"/><path d="M0 0 L${f1(L)} 0" stroke="#0e140c" stroke-width="3" opacity="0.5"/></g>`; }
    return g + '</g>';
  }

  // the hero figure (the same in the hook and the end scene: the loop) and the camera it loops on
  const HERO_FIG = { id: 'ns96_sailor', x: 880, y: 1420, scale: 0.4, dir: -1, turn: 0.45, pose: 'present', silhouette: 'cool', depth: 1.0 };
  const HERO_CAM0 = { x: 0, y: -20, z: 1.04 }, HERO_CAM1 = { x: 16, y: -44, z: 1.12 };

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // the Caribbean off a jungle coast: o.view 'dawn' (frame 1: a deep blue sky warming at the horizon, the dark mountains of
    // the coast at the left in mist, a sun glint on the water) or 'day' (morning: the green hills and a beach nearer).
    // o.off: the end scene passes off = T - 0.08 so its last frame replays frame 0's water
    ns96_sea(ctx, o = {}) {
      const day = o.view === 'day', t = (o.off !== undefined ? ctx.t - o.off : ctx.t + (ctx.sceneStart || 0));
      const hz = day ? 860 : 800;
      let sky = `<defs><linearGradient id="ns96sk${day ? 'd' : 'n'}" x1="0" y1="0" x2="0" y2="1">` + (day
        ? `<stop offset="0" stop-color="#4a6278"/><stop offset="0.55" stop-color="#9aaab0"/><stop offset="1" stop-color="#d8cdb4"/>`
        : `<stop offset="0" stop-color="#0a1320"/><stop offset="0.5" stop-color="#22364a"/><stop offset="0.82" stop-color="#7a6a6c"/><stop offset="1" stop-color="#d89a6a"/>`) +
        `</linearGradient></defs><rect x="-600" y="-400" width="${W + 1200}" height="${hz + 410}" fill="url(#ns96sk${day ? 'd' : 'n'})"/>`;
      sky += wash(day ? 800 : 860, hz - 20, 520, 110, day ? '#fff2d0' : '#ffb070', day ? 0.3 : 0.4);
      if (!day) sky += E.cine.stars(t, 40, 9602, -200, 420);
      const rc = R(9603);
      for (let i = 0; i < 7; i++) { const cx = ((rc() * 2200 + t * (6 + 5 * rc())) % 2200) - 600, cy = 160 + rc() * (hz - 360), rx = 240 + rc() * 280;
        sky += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(36 + rc() * 40)}" fill="${day ? '#7a8a94' : '#1a2636'}" opacity="${f1(0.3 + 0.3 * rc())}" filter="url(#cineSoft)"/>`; }
      // the coast: jungle mountains dropping to the sea at the left, a far range behind, mist at their feet
      const c1 = day ? '#3a5040' : '#141e22', c2 = day ? '#2a3e30' : '#0e161a';
      let far = `<path d="M-600 ${hz - 120} L-380 ${hz - 250} L-220 ${hz - 200} L-60 ${hz - 300} L120 ${hz - 210} L300 ${hz - 150} L520 ${hz - 60} L700 ${hz - 10} L700 ${hz + 4} L-600 ${hz + 4} Z" fill="${c1}" opacity="0.85"/>`;
      far += `<path d="M-600 ${hz - 40} L-420 ${hz - 150} L-260 ${hz - 110} L-120 ${hz - 170} L60 ${hz - 100} L260 ${hz - 50} L460 ${hz - 6} L460 ${hz + 4} L-600 ${hz + 4} Z" fill="${c2}"/>`;
      if (day) { far += `<path d="M-600 ${hz - 6} Q-200 ${hz - 16} 300 ${hz - 4} L300 ${hz + 4} L-600 ${hz + 4} Z" fill="#d8c8a0"/>`; const rt = R(9604); for (let i = 0; i < 30; i++) { const x = -500 + rt() * 820, y = hz - 120 + rt() * 100; far += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(14 + rt() * 22)}" fill="${rt() < 0.5 ? '#2e4632' : '#3e5a3e'}" opacity="0.8"/>`; } }
      far += wash(100, hz - 10, 600, 50, day ? '#e8e4d8' : '#8a96a0', day ? 0.3 : 0.22);
      // the water: base, the glint path under the light, the drifting streaks
      let water = sea(hz, t, { col: day ? '#2c4652' : '#162630', hi: day ? '#c0d0d0' : '#7e98a2', seed: 9605, n: 20, dx: 0.5 });
      if (!day) { const rg = R(9606); for (let i = 0; i < 26; i++) { const y = hz + 6 + rg() * 120, x = 860 + (rg() - 0.5) * (120 + (y - hz) * 3), w = 20 + rg() * 60; water += `<path d="M${f1(x)} ${f1(y)} l${f1(w)} 0" stroke="#ffc890" stroke-width="3" opacity="${f1(0.25 + 0.35 * Math.abs(Math.sin(t * 2 + i)))}"/>`; } }
      return { light: { dir: 1, rim: day ? '#fff0d0' : '#ffc890', key: day ? '#e8e4d8' : '#c0ccd8' }, layers: [[0.04, sky], [0.2, far], [0.5, water]] };
    },

    // Callao harbour at night, cut at the waterline (y 980): above, a night sky, port cranes with red lights and the city's
    // lights, and the dark side of a cargo ship at anchor; below, murky green water, the ship's hull curving down to the keel
    ns96_harbour(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), WL = 900;
      let sky = `<defs><linearGradient id="ns96hs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060a14"/><stop offset="1" stop-color="#1c2638"/></linearGradient></defs><rect x="-600" y="-400" width="${W + 1200}" height="${WL + 400}" fill="url(#ns96hs)"/>` + E.cine.stars(t, 50, 9621, -200, 500);
      let far = '';
      [[-160, 620, 1.0], [140, 660, 0.8], [1040, 600, 1.1]].forEach(([x, y, k]) => { far += `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 0 L0 300 M80 0 L80 300 M-40 0 L260 0 L260 30 L-40 30 Z M80 0 L180 -60 L200 0" stroke="#1a2230" stroke-width="10" fill="#1a2230"/><circle cx="260" cy="0" r="7" fill="#ff5a4a" opacity="${f1(0.5 + 0.5 * Math.abs(Math.sin(t * 2 + x)))}"/></g>`; });
      const r = R(9622); for (let i = 0; i < 80; i++) { const x = -300 + r() * 1700, y = 900 + r() * 70; far += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(2 + r() * 3)}" fill="${r() < 0.7 ? '#ffc070' : '#fff0d0'}" opacity="${f1(0.5 + 0.4 * Math.sin(t * 2 + i))}"/>`; }
      far += wash(540, 950, 900, 80, '#ffb060', 0.12);
      // the ship: the hull side above the water (a deck rail, scuppers, rust), the hull below the water curving to the keel
      let ship = `<path d="M-600 520 L1700 520 L1700 ${WL} L-600 ${WL} Z" fill="#2a1e1c" stroke="${INK}" stroke-width="6"/>`;
      ship += `<path d="M-600 520 L1700 520" stroke="#5a4038" stroke-width="10"/><path d="M-600 500 L1700 500" stroke="#3a3030" stroke-width="5"/>` + Array.from({ length: 24 }, (_, i) => `<path d="M${-600 + i * 100} 500 L${-600 + i * 100} 520" stroke="#3a3030" stroke-width="5"/>`).join('') + Array.from({ length: 7 }, (_, i) => `<circle cx="${-300 + i * 260}" cy="600" r="16" fill="#120c0c" stroke="#5a4038" stroke-width="4"/>`).join('');
      for (let i = 0; i < 9; i++) ship += `<path d="M${-500 + i * 240} 522 L${-500 + i * 240} ${WL}" stroke="#20161a" stroke-width="4" opacity="0.7"/><path d="M${-470 + i * 240} 600 q10 60 0 120" stroke="#6a3a26" stroke-width="6" fill="none" opacity="0.4"/>`;
      ship += `<path d="M-600 ${WL - 60} L1700 ${WL - 60}" stroke="#7a2e24" stroke-width="40" opacity="0.6"/>`;
      // the water surface and everything below it
      let under = `<rect x="-600" y="${WL}" width="${W + 1200}" height="${H}" fill="#0c2226"/>`;
      under += `<path d="M-600 ${WL} L1700 ${WL} L1700 ${WL + 150} Q900 ${WL + 236} 540 ${WL + 238} Q180 ${WL + 236} -600 ${WL + 150} Z" fill="#2a1c1c" stroke="#6a8a86" stroke-width="6"/>`;
      under += `<path d="M-600 ${WL + 110} Q540 ${WL + 200} 1700 ${WL + 110}" stroke="#4a2a22" stroke-width="10" fill="none" opacity="0.5"/>`;
      for (let i = 0; i < 18; i++) { const x = -300 + i * 90; under += `<circle cx="${x}" cy="${f1(WL + 150 + Math.sin(i) * 20)}" r="${f1(5 + (i % 4) * 2)}" fill="#3a4a3e" opacity="0.6"/>`; }
      under += wash(540, WL + 360, 900, 260, '#1e4a4a', 0.35);
      under += `<rect x="-600" y="${WL - 3}" width="${W + 1200}" height="8" fill="#9ab8b8" opacity="0.5"/>`;
      let ripples = ''; for (let i = 0; i < 14; i++) { const x = ((i * 160 - t * 40) % 1900 + 1900) % 1900 - 400; ripples += `<path d="M${f1(x)} ${WL - 4} q40 -8 80 0 q40 8 80 0" stroke="#cfe0e0" stroke-width="4" fill="none" opacity="0.4"/>`; }
      under += ripples;
      return { light: { dir: -1, rim: '#ffc890', key: '#c0ccd8' }, layers: [[0.05, sky], [0.25, far], [0.7, ship + under]] };
    },

    // under a ship's hull: the dark steel plates across the top curving down to the keel line, barnacles, a green-teal gloom
    // fading to black, particles drifting, light rippling down from the surface
    ns96_under(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let bg = `<defs><linearGradient id="ns96uw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a5458"/><stop offset="0.5" stop-color="#123236"/><stop offset="1" stop-color="#040e12"/></linearGradient></defs><rect x="-600" y="-400" width="${W + 1200}" height="${H + 800}" fill="url(#ns96uw)"/>`;
      const r = R(9631); let pt = '';
      for (let i = 0; i < 70; i++) { const x = (r() * 1800 + t * (6 + r() * 10)) % 1800 - 360, y = (r() * 2000 - t * (4 + r() * 8) % 2000 + 2000) % 2000 - 40; pt += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.5 + r() * 3)}" fill="#cfe8e0" opacity="${f1(0.2 + r() * 0.35)}"/>`; }
      let hull = `<path d="M-600 -400 L1700 -400 L1700 520 Q1100 700 540 720 Q-20 700 -600 520 Z" fill="#141012" stroke="${INK}" stroke-width="6"/>`;
      hull += `<path d="M-600 470 Q-20 650 540 668 Q1100 650 1700 470" stroke="#3a2420" stroke-width="12" fill="none" opacity="0.7"/>`;
      for (let i = 0; i < 10; i++) hull += `<path d="M${-500 + i * 230} -400 L${-500 + i * 230 + (i - 4.5) * 20} ${f1(560 + 150 * Math.sin(Math.PI * (i + 0.5) / 10))}" stroke="#241a1a" stroke-width="5" opacity="0.8"/>`;
      const rb = R(9632); for (let i = 0; i < 60; i++) { const x = -300 + rb() * 1700, u = (x - 540) / 1100, y = 700 - 200 * u * u - rb() * 120; hull += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(5 + rb() * 9)}" ry="${f1(4 + rb() * 6)}" fill="${rb() < 0.5 ? '#4a5444' : '#5a5a4a'}" opacity="0.7"/>`; }
      hull += wash(540, 600, 700, 120, '#2a5a5a', 0.2);
      return { light: { dir: 1, rim: '#cfeee6', key: '#9ab8b8' }, layers: [[0.05, bg], [0.4, pt], [0.8, hull]] };
    },

    // a jungle river channel by day: a pale sky through the canopy, layers of rainforest, a muddy brown channel with
    // reflections, roots at the banks, the smugglers' stilt shacks; o.view 'wide' or 'close' (low at the bank, big leaves)
    ns96_jungle(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), close = o.view === 'close';
      const wy = close ? 1240 : 1000;
      let sky = `<defs><linearGradient id="ns96js" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ab0a0"/><stop offset="1" stop-color="#d8dcc4"/></linearGradient></defs><rect x="-600" y="-400" width="${W + 1200}" height="${wy + 400}" fill="url(#ns96js)"/>` + wash(700, 300, 500, 300, '#fff8e0', 0.35);
      let far = '';
      const r = R(close ? 9641 : 9642);
      for (let i = 0; i < 26; i++) { const x = -400 + r() * 1900, y = (close ? 520 : 600) + r() * 220, rr = 90 + r() * 120; far += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="${r() < 0.5 ? '#4a6248' : '#3e5640'}" opacity="0.9"/>`; }
      far += `<rect x="-600" y="${close ? 640 : 720}" width="${W + 1200}" height="${wy - (close ? 640 : 720) + 10}" fill="#2e4430"/>`;
      for (let i = 0; i < 12; i++) { const x = -300 + i * 150 + (r() - 0.5) * 60; far += `<path d="M${f1(x)} ${wy} L${f1(x + 10)} ${f1(wy - 380 - r() * 200)}" stroke="#2a2e22" stroke-width="${f1(10 + r() * 14)}"/>`; }
      far += wash(540, wy - 120, 900, 160, '#c8d8b8', 0.22);
      let mid = '';
      const r2 = R(close ? 9643 : 9644);
      for (let i = 0; i < 18; i++) { const x = -400 + r2() * 1900, y = wy - 160 + r2() * 120, rr = 70 + r2() * 90; mid += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="${r2() < 0.5 ? '#26381f' : '#30462a'}"/>`; }
      // the channel: muddy water with slow reflections, banks with roots
      const bk = wy + (close ? 300 : 400);
      let water = `<rect x="-600" y="${wy}" width="${W + 1200}" height="${H}" fill="#4a4428"/>` + wash(540, wy + 30, 900, 50, '#d8d8b0', 0.32);
      for (let i = 0; i < 9; i++) { const x = -300 + i * 190; water += `<path d="M${x} ${wy + 8} L${x + 14} ${bk - 40}" stroke="#26301c" stroke-width="${26 + (i % 3) * 12}" opacity="0.35"/>`; }
      for (let i = 0; i < 16; i++) { const x = ((i * 150 + t * 16) % 1900) - 400, y = wy + 20 + (i % 6) * 55; water += `<path d="M${f1(x)} ${y} q50 -7 110 0" stroke="#c8bc94" stroke-width="4" fill="none" opacity="0.5"/>`; }
      water += `<path d="M-600 ${bk} Q300 ${bk - 50} ${W + 600} ${bk + 20} L${W + 600} ${H + 400} L-600 ${H + 400} Z" fill="#2a2216"/>`;
      water += `<path d="M-600 ${bk} Q300 ${bk - 50} ${W + 600} ${bk + 20}" stroke="#1a140c" stroke-width="14" fill="none"/>`;
      const rg = R(9647); for (let i = 0; i < 40; i++) { const x = -400 + i * 48, y = bk - 50 * Math.sin(Math.PI * (x + 600) / 2280) + 6; water += `<path d="M${x} ${f1(y)} l${f1(-8 + rg() * 16)} ${f1(-20 - rg() * 26)} M${x + 10} ${f1(y)} l${f1(4 + rg() * 10)} ${f1(-16 - rg() * 20)}" stroke="${rg() < 0.5 ? '#4a6a30' : '#3a5426'}" stroke-width="5" stroke-linecap="round"/>`; }
      if (!close) water += shack(900, wy - 10, 0.9, 9645) + shack(1150, wy - 30, 0.7, 9646);
      return { light: { dir: -1, rim: '#fff4d8', key: '#e0e4cc' }, layers: [[0.05, sky], [0.25, far], [0.45, mid], [0.6, water]] };
    }
  });

  E.registerScenes({
    // 1 - HOOK (frame 0): the drone sub under way, the swell, the patrol boat's searchlight sweeping onto it from 0.0 s;
    //     the operator leans into the lamp at once, glances up on line 2 (the antenna callout)
    ns96_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.6), cr = WT(ctx, 1, 1, 3.0);
      return E.cine.shot(ctx, {
        set: 'ns96_sea', grade: 'dawn', haze: 0.35,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [
          { ...HERO_FIG, keys: [{ at: 0.05, headTurn: 0.25, dur: 0.45 }, { at: l2, pose: 'point', headTurn: 0.15, dur: 0.4 }, { at: cr + 0.6, pose: 'present', headTurn: 0.05, dur: 0.4 }] }
        ],
        props: [
          { depth: 0.94, svg: tt => heroM(tt, tt).back },
          { depth: 0.95, accent: true, svg: tt => heroM(tt, tt).sub },
          { depth: 0.96, svg: tt => heroM(tt, tt).front },
          { depth: 0.97, svg: tt => heroM(tt, tt).beam },
          { depth: 0.985, svg: tt => heroM(tt, tt).deck },
          { depth: 1.01, svg: tt => heroM(tt, tt).boat }
        ],
        overlays: [
          { type: 'callout', at: Math.max(3.05, l2 + 0.3), target: [748, 764], label: [620, 640], anchor: 'end', w: 560, fs: 30, text: 'STARLINK ANTENNA, NO CREW', sub: 'A commercial terminal, as reported', r: 62, depth: 0.95 },
          { type: 'label', at: Math.max(3.05, l2 + 0.55), x: 60, y: 1160, text: "COLOMBIA'S CARIBBEAN COAST · 2025", fs: 28, sub: 'Capacity: 1.5 tonnes, per the navy' }
        ],
        tag: TAG
      });
    },

    // 2 - THE GOTCHA: morning off the green coast; the sub between two patrol boats; on "seized" the impact and the sailor
    //     on its deck lifts the hatch; on "empty" his torch goes into the hull and the officer on the near boat points;
    //     the stamp on "test run"
    ns96_seized(ctx) {
      const t = ctx.t, sz = WT(ctx, 0, 2, 0.7), em = WT(ctx, 0, 4, 1.3), tr = WT(ctx, 0, 6, 1.9);
      const hatch = ease.inOut(seg(t, sz - 0.1, sz + 0.5));
      return E.cine.shot(ctx, {
        set: 'ns96_sea', setOpts: { view: 'day' }, grade: 'none', haze: 0.4,
        cam: { from: { x: -10, y: 20, z: 1.0 }, to: { x: 14, y: 10, z: 1.07 } },
        figures: [
          { id: 'ns96_sailor', x: 430, y: 952, scale: 0.3, dir: 1, turn: 0.4, pose: 'kneel', expr: 'focused', depth: 0.955, propOpts: { beamLen: 160, aim: 20 },
            keys: [{ at: 0.1, headTurn: 0.25, dur: 0.4 }, { at: sz, pose: 'examine', dur: 0.35 }, { at: em, pose: 'torch_low', expr: 'realise', headTurn: 0.1, dur: 0.35 }, { at: tr + 0.3, pose: 'kneel', headTurn: 0.4, dur: 0.4 }] },
          { id: 'ns96_navy', x: 210, y: 1720, scale: 0.98, dir: 1, turn: 0.45, pose: 'stand', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#2a3442' },
            keys: [{ at: 0.1, headTurn: 0.2, dur: 0.4 }, { at: sz, pose: 'point', expr: 'determined', dur: 0.3 }, { at: tr, pose: 'arms_crossed', expr: 'stern', headTurn: 0.1, dur: 0.4 }] }
        ],
        props: [
          // the far patrol boat (left, behind the sub) and the sub itself, stopped, lying low in the calm
          { depth: 0.9, svg: tt => { let g = `<g transform="translate(-40 920) scale(0.55)"><path d="M-300 0 L700 0 L640 70 L-260 70 Z" fill="#6a767e" stroke="${INK}" stroke-width="7"/><path d="M-120 0 L-100 -110 L300 -110 L340 0 Z" fill="#8a969e" stroke="${INK}" stroke-width="6"/><rect x="-60" y="-90" width="300" height="34" fill="#2a343c"/><path d="M120 -110 L120 -220 M80 -180 L160 -180" stroke="#2a343c" stroke-width="8"/></g>`; return g + crest(985, tt, 4, 400, '#2c4652', 0.8, 0.5, 0.3, 0.2); } },
          { depth: 0.95, accent: true, svg: tt => semiSub(560, 1050, 0.86, tt, { run: 0, bob: 0.5, hatch, lit: 0.3 }) + crest(1058, tt, 5, 420, '#2a4450', 0.8, 0.6, 1.1, 0.25) },
          // the near patrol boat's deck (the officer stands on it) and its rail, lower foreground
          { depth: 0.98, svg: tt => `<path d="M-200 1560 Q500 1500 1300 1540 L1300 2100 L-200 2100 Z" fill="#6a767e" stroke="${INK}" stroke-width="7"/><path d="M-200 1600 Q500 1544 1300 1584" stroke="#8a969e" stroke-width="8" fill="none"/>` },
          { depth: 1.02, svg: tt => `<path d="M-200 1640 Q500 1580 1300 1620" stroke="#2a3238" stroke-width="9" fill="none"/>` + Array.from({ length: 8 }, (_, i) => `<path d="M${-100 + i * 180} ${f1(1624 - i * 4)} L${-96 + i * 180} ${f1(1730 - i * 4)}" stroke="#2a3238" stroke-width="7"/>`).join('') }
        ],
        overlays: [
          { type: 'impact', at: sz, x: 520, y: 950 },
          { type: 'callout', at: em + 0.1, target: [483, 862], label: [1040, 700], anchor: 'end', w: 470, fs: 30, text: 'NO DRUGS ABOARD', sub: 'A trial run, per the navy', r: 50, depth: 0.95 },
          { type: 'stamp', at: tr, x: 760, y: 1210, text: 'TEST RUN', rot: -8, scale: 1.3 },
          { type: 'label', at: 0.3, x: 60, y: 436, text: 'COLOMBIAN NAVY · FOUND APRIL 2025', fs: 28, sub: 'Spotted from the air, per MIT Tech Review' }
        ],
        tag: TAG
      });
    },

    // 3 - REHOOK + CASE 2: Callao harbour at night, half under water; the police officer on the launch sweeps his torch
    //     across the water; on "torpedo" the light under the hull finds the torpedo clamped there
    ns96_torpedo(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 1.5), tp = WT(ctx, 1, 3, 2.1), sh = WT(ctx, 1, 7, 2.8);
      const lit = seg(t, tp - 0.25, tp + 0.35);
      return E.cine.shot(ctx, {
        set: 'ns96_harbour', grade: 'night', haze: 0.3,
        cam: { from: { x: -16, y: 10, z: 1.02 }, to: { x: 10, y: 30, z: 1.08 } },
        figures: [
          { id: 'ns96_police', x: 910, y: 916, scale: 0.46, dir: -1, turn: 0.4, pose: 'torch', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#2a3024' }, propOpts: { beamLen: 320, aim: 35 },
            keys: [{ at: 0.1, headTurn: 0.3, dur: 0.5 }, { at: l2, pose: 'torch_low', expr: 'focused', headTurn: 0.1, dur: 0.4 }, { at: tp, pose: 'point', expr: 'realise', dur: 0.3 }, { at: sh + 0.4, pose: 'torch_low', expr: 'determined', dur: 0.4 }] }
        ],
        props: [
          // the torpedo clamped under the hull (keel line ~ y 1212 at x 540), lit on "torpedo"
          { depth: 0.7, accent: true, svg: tt => clamps(470, 1196, 0.86, 64) + torpedo(470, 1196, 0.86, { lit: 0.25 + 0.75 * lit }) + `<g style="mix-blend-mode:screen">${wash(470, 1196, 420, 150, '#bfe8e0', f1(0.4 * lit))}</g>` },
          // the light from the surface going down to it
          { depth: 0.75, svg: tt => `<g style="mix-blend-mode:screen"><path d="M700 910 L250 1230 L640 1250 Z" fill="#dff4ee" opacity="${f1(0.16 * lit)}"/></g>` },
          // the police launch at the waterline (the officer stands on it)
          { depth: 1.01, svg: tt => { const b = 3 * Math.sin(tt * 1.3); return `<g transform="translate(0 ${f1(b)})"><path d="M640 906 L1200 906 L1200 976 L700 976 Q660 956 640 906 Z" fill="#3a4044" stroke="${INK}" stroke-width="6"/><path d="M640 906 L1200 906" stroke="#8a9296" stroke-width="7"/><path d="M700 976 L1200 976 L1200 1006 L730 1006 Z" fill="#1e2a2c" opacity="0.7"/></g>`; } }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 480, text: 'CALLAO, PERU · JUNE 2011', fs: 32, sub: 'Sealed with cement, clamped to the hull' }
        ],
        tag: TAG
      });
    },

    // 4 - CASE 2's GOTCHA: under the hull; the police diver swims in from the left; on "found" his torch beam lands on the
    //     torpedo; the panel slides back on the packets; the 113 KG counter on "113"
    ns96_divers(ctx) {
      const t = ctx.t, fd = WT(ctx, 0, 2, 0.7), n = WT(ctx, 0, 4, 1.0);
      const sw = ease.out(seg(t, 0, fd + 0.3)), bm = seg(t, fd - 0.15, fd + 0.25);
      return E.cine.shot(ctx, {
        set: 'ns96_under', grade: 'cold', haze: 0.3, dof: true,
        cam: { from: { x: -10, y: 30, z: 1.1 }, to: { x: 16, y: 40, z: 1.18 } },
        shafts: { n: 4, x: 520, w: 80, op: 0.14, col: '#d8fff4', d: 0.5 },
        props: [
          { depth: 0.82, accent: true, svg: tt => clamps(560, 860, 1.05, 80) + torpedo(560, 860, 1.05, { lit: 0.2 + 0.8 * bm, open: ease.inOut(seg(tt, n, n + 0.6)) }) },
          { depth: 0.9, svg: tt => diver(lerp(-300, 300, sw), 1150 + 10 * Math.sin(tt * 1.5), 1.45, tt, bm, 560, 880) }
        ],
        overlays: [
          { type: 'counter', at: n + 0.05, dur: 0.8, from: 0, to: 113, suffix: ' KG', label: 'OF COCAINE IN THE TORPEDO', y: 640, fs: 110 },
          { type: 'label', at: 0.3, x: 60, y: 436, text: 'POLICE DIVERS (DIRANDRO) · CALLAO', fs: 26, sub: '3 arrested, per InSight Crime' }
        ],
        tag: TAG
      });
    },

    // 5 - REHOOK + CASE 3: the jungle channel; a real submarine half-submerged under camouflage netting; two officers wade
    //     in from the left (the nearer walks on "boldest"); the FUN FACT card
    ns96_jungle(ctx) {
      const t = ctx.t, bo = WT(ctx, 0, 2, 0.5), su = WT(ctx, 0, 6, 1.6);
      return E.cine.shot(ctx, {
        set: 'ns96_jungle', setOpts: { view: 'wide' }, grade: 'warm', haze: 0.45,
        cam: { from: { x: -14, y: 10, z: 1.02 }, to: { x: 12, y: 20, z: 1.08 } },
        shafts: { n: 3, x: 640, w: 90, op: 0.12, col: '#fff4d0', d: 0.5 },
        figures: [
          { id: 'ns96_trooper', x: 150, y: 1700, scale: 0.6, dir: 1, turn: 0.45, pose: 'torch', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#3a4230' }, propOpts: { beamLen: 220, aim: 20 },
            walk: { at: bo - 0.1, dur: 1.4, cadence: 5.5, stride: 22, from: 70, to: 200 },
            keys: [{ at: 0.1, headTurn: 0.3, dur: 0.4 }, { at: bo - 0.15, pose: 'walk', dur: 0.2 }, { at: bo + 1.3, pose: 'point', expr: 'shocked', dur: 0.3 }] },
          { id: 'ns96_trooper', x: 330, y: 1590, scale: 0.42, dir: 1, turn: 0.45, pose: 'stand_tense', expr: 'focused', depth: 0.97, hat: { style: 'cap', color: '#3a4230' },
            keys: [{ at: 0.2, headTurn: 0.2, dur: 0.4 }, { at: su, pose: 'point_up', expr: 'shocked', dur: 0.3 }] }
        ],
        props: [
          { depth: 0.62, accent: true, svg: tt => jungleSub(600, 1110, 1.0, tt, { net: 0.42 }) },
          { depth: 1.08, svg: tt => leaves(-120, 1960, 1.6, '#1e3018', 9651, 2 * Math.sin(tt * 0.8)) + leaves(1220, 1900, 1.4, '#22361c', 9652, -2 * Math.sin(tt * 0.7 + 1)) }
        ],
        overlays: [
          { type: 'funfact', at: LS(ctx, 0, 0) + 0.4, x: 40, w: 1000, y: 470, fs: 40, rows: [{ text: 'THE JUNGLE SUB HAD' }, { text: 'A PERISCOPE AND AIR CON' }, { text: 'DEA · about 30 m, fully submersible', fs: 28 }] }
        ],
        tag: TAG
      });
    },

    // 6 - THE BIGGEST GOTCHA (the music drop): close at the bank; the officer in the foreground pulls the netting back on
    //     "tip" and his torch finds the conning tower; behind, a second officer leads the detained man (silhouette, hands
    //     behind his back) on "troops"; "never sailed"
    ns96_tip(ctx) {
      const t = ctx.t, tp = WT(ctx, 0, 2, 0.6), tr = WT(ctx, 0, 4, 1.0), ns = WT(ctx, 0, 7, 1.9);
      const net = 0.75 * (1 - ease.inOut(seg(t, tp - 0.1, tp + 0.7)));
      return E.cine.shot(ctx, {
        set: 'ns96_jungle', setOpts: { view: 'close' }, grade: 'warm', haze: 0.35, dof: true,
        cam: { from: { x: 10, y: 50, z: 1.14 }, to: { x: 30, y: 60, z: 1.22 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'ns96_detainee', x: 470, y: 1600, scale: 0.5, dir: -1, turn: 0.4, pose: 'stand_tense', silhouette: 'warm', depth: 0.9,
            keys: [{ at: 0.1, headTurn: 0.2, dur: 0.4 }, { at: tr, pose: 'hands_behind', headTurn: 0.35, dur: 0.4 }, { at: ns + 0.3, pose: 'bowed', dur: 0.4 }] },
          { id: 'ns96_trooper', x: 580, y: 1610, scale: 0.52, dir: -1, turn: 0.4, pose: 'stand', expr: 'stern', depth: 0.905, hat: { style: 'cap', color: '#3a4230' },
            keys: [{ at: 0.15, headTurn: 0.2, dur: 0.4 }, { at: tr, pose: 'present', expr: 'determined', dur: 0.35 }] },
          { id: 'ns96_trooper', x: 250, y: 1790, scale: 1.16, dir: 1, turn: 0.45, pose: 'torch', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#3a4230' }, propOpts: { beamLen: 420, aim: 118 },
            keys: [{ at: 0.1, headTurn: 0.25, dur: 0.4 }, { at: tp - 0.1, pose: 'present', expr: 'realise', dur: 0.35 }, { at: tp + 0.7, pose: 'torch', expr: 'determined', headTurn: 0.1, dur: 0.35 }, { at: ns, pose: 'point', expr: 'stern', dur: 0.35 }] }
        ],
        props: [
          { depth: 0.86, accent: true, svg: tt => jungleSub(800, 1330, 1.25, tt, { net, lit: seg(tt, tp + 0.3, tp + 0.8) }) },
          { depth: 1.1, svg: tt => leaves(1180, 760, 1.5, '#1e3018', 9661, 2 * Math.sin(tt * 0.8)) + leaves(-160, 900, 1.3, '#22361c', 9662, -2 * Math.sin(tt * 0.7 + 1)) }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 520, text: 'NEAR SAN LORENZO, ECUADOR · JULY 2010', fs: 28, sub: 'Seized with DEA help · 1 detained at the site' }
        ],
        tag: TAGL
      });
    },

    // 7 - THE CALLBACK (the loop): frame 1's picture; the operator glances round on "owner"; the camera eases back to frame
    //     1's start and the searchlight sweeps back so that, at the last frame, everything is where it was at frame 0
    ns96_end(ctx) {
      const t = ctx.t, T = ctx.T, ow = WT(ctx, 0, 1, 0.3);
      const LOOP_AT = T - 0.08;   // the loop check grabs the frame 0.08 s before the end: there, everything time-driven equals frame 0
      const back = T - 0.5;
      const H_ = tt => heroM(tt - LOOP_AT, LOOP_AT - tt);
      return E.cine.shot(ctx, {
        set: 'ns96_sea', setOpts: { off: LOOP_AT }, grade: 'dawn', haze: 0.35,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [{ ...HERO_FIG, keys: [{ at: 0.15, headTurn: 0.3, dur: 0.4 }, { at: ow, headTurn: -0.25, dur: 0.4 }, { at: Math.max(ow + 0.5, back - 0.6), headTurn: 0, dur: 0.45 }] }],
        props: [
          { depth: 0.94, svg: tt => H_(tt).back },
          { depth: 0.95, accent: true, svg: tt => H_(tt).sub },
          { depth: 0.96, svg: tt => H_(tt).front },
          { depth: 0.97, svg: tt => H_(tt).beam },
          { depth: 0.985, svg: tt => H_(tt).deck },
          { depth: 1.01, svg: tt => H_(tt).boat }
        ],
        overlays: [],
        tag: TAG
      });
    }
  });
})();
