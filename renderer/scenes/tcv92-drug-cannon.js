/* Case File 92 (premium look, ENGINE V8: the lane and the first spoken words; promise -> proof -> escalate -> callback;
   the loop; THE 28-SECOND CUT): BORDER FAILS, 6.
   HEADLINE: Agua Prieta, Sonora (across from Douglas, Arizona), November 2017: Mexican soldiers and federal police seized
   a van with an air cannon built into it (its roof opened to raise the barrel; compressor, gasoline engine, air tank),
   with about 1,800 lb of marijuana; the town's SECOND cannon van (the first: September 2016) is the callback.
   CASE 2: near San Luis, Arizona (Yuma Sector), December 2012: a CO2 cannon fired cans of marijuana over the fence; agents
   found 33 cans (about 85 lb) in a field and the CO2 tank by the fence; no arrests.
   CASE 3 (best last): near Marana, Arizona, October 2008: an ultralight tracked by radar and a CBP helicopter landed with
   about 223 lb of marijuana; the pilot ran; the helicopter landed and its crew caught him (pleaded guilty, 33 months).
   Structure: frame 0 = THE DEVICE IN THE ACT: night on the Mexican side of the steel bollard fence; a pale van in profile
   across the lower-middle of the frame, its roof hatch open, a long air-cannon barrel angled up out of the roof; a glowing
   taped package has just left the muzzle (flash, puff, dust) and flies over the fence top; the side door is open on the
   lit tank, compressor and engine; an operator silhouette at the door; the camera already pushing in. Then the seizure
   (a dusty lot at dawn: the van with soldiers and a federal police officer, the packages, the impact, the 1,800 counter),
   case 2 (an Arizona field at night: cans arc over the fence; the close-up: the agent's torch finds the cans), case 3 (the
   night sky: the ultralight, the searchlight, the fun fact; the landing site: he runs, the helicopter lands in his path,
   hands behind his back: the music drop) and the callback on frame 1's picture, where the cannon fires again so the last
   frame equals the first.
   Smoothness: cuts and dissolves, one push (into case 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact. Screen direction: northbound (into the US) = RIGHT: the package flies up and right, the cans come
   over the fence travelling right, the ultralight flies left to right.
   Look: episode.look = 'premium', one cool night palette (shadow #111a26, mid #c4b59c, accent #e8a33a). The strongly
   coloured objects are the contraband (the package, the packages, the cans, the bundles) and the muzzle flash.
   Content rules: no weapon, no violence; soldiers, police, agents and crew hold only flashlights or nothing; generic
   figures with no badge, flag, crest or insignia; the van, the helicopter and the ultralight carry no logo, livery, plate
   or registration. The van operator (no arrest reported) and the ultralight pilot (convicted) are dark silhouettes, never
   named.
   New environments (E.registerSets): dc92_line (the border fence at night from the Mexican side), dc92_lot (a dusty lot in
   Agua Prieta at dawn), dc92_field (an Arizona farm field at night with the fence behind; view 'wide' or 'close'),
   dc92_sky (the night sky over the desert, scrolling), dc92_strip (the desert near Marana at night). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const TAGL = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#e8a33a', GLOW = '#ffd28a';

  // ---------- contraband
  // a taped package (brick of marijuana in brown tape): centre (x, y), scale s, rotation r (deg), glow 0..1
  function pkg(x, y, s, r = 0, glow = 1) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(r)}) scale(${sc(s)})">`;
    if (glow > 0) g += wash(0, 0, 120, 100, ACC, f1(0.32 * glow));
    g += `<rect x="-48" y="-32" width="96" height="64" rx="14" fill="#c8954f" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-48 -6 L48 -10 M-48 14 L48 10" stroke="#8a6232" stroke-width="7" opacity="0.8"/><path d="M-14 -32 L-8 32 M18 -32 L22 32" stroke="#a87a3e" stroke-width="6" opacity="0.7"/>`;
    g += `<path d="M-40 -24 Q-10 -30 30 -26" stroke="#f2d6a0" stroke-width="5" fill="none" opacity="0.7"/>`;
    return g + '</g>';
  }
  // a sealed can (marijuana canned for the cannon): centre (x, y), scale s, rotation r
  function can(x, y, s, r = 0, glow = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(r)}) scale(${sc(s)})">`;
    if (glow > 0) g += wash(0, 0, 70, 70, ACC, f1(0.3 * glow));
    g += `<rect x="-20" y="-30" width="40" height="60" rx="6" fill="#b9bec2" stroke="${INK}" stroke-width="4"/><rect x="-20" y="-12" width="40" height="22" fill="#c8954f" stroke="${INK}" stroke-width="2"/>`;
    g += `<ellipse cx="0" cy="-30" rx="20" ry="6" fill="#dfe3e6" stroke="${INK}" stroke-width="3"/><path d="M-12 -22 L-12 22" stroke="#eef2f4" stroke-width="4" opacity="0.6"/>`;
    return g + '</g>';
  }

  // ---------- THE HERO: the cannon van (profile, facing LEFT, rear at the right), drawn in frame-1 coordinates (wheels on
  // y 1330, rear at x 826); the barrel runs from its pivot inside (B) out of the roof hatch (EX) to the muzzle (M)
  const D = { x: 0.643, y: -0.766 };                        // the barrel's direction (50 degrees up, to the right)
  const B = { x: 520, y: 1015 }, EX = { x: 650, y: 860 }, M = { x: 843, y: 630 };
  function vanSVG(o = {}) {
    const t = o.t || 0, rc = o.recoil || 0, lit = o.lit ?? 1;
    const ox = -D.x * 14 * rc, oy = -D.y * 14 * rc;          // recoil: the barrel kicks back along its axis
    let g = '';
    // body
    g += `<ellipse cx="320" cy="1336" rx="600" ry="26" fill="#000" opacity="0.45"/>`;
    g += `<path d="M-200 1240 L-200 1062 Q-200 1036 -175 1031 L-40 1005 L85 870 Q95 858 115 858 L790 858 Q822 858 824 890 L826 1240 Z" fill="#d6d0c3" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-200 1172 L826 1172 L826 1240 L-200 1240 Z" fill="#b5ae9f"/><path d="M-196 1010 L822 1010" stroke="#a9a293" stroke-width="4"/>`;
    g += `<path d="M95 870 L780 870" stroke="#ece8de" stroke-width="6" opacity="0.7"/>`;
    // the side-door opening, lit from inside: the air tank, the compressor and its flywheel, the gasoline engine,
    // stacked packages, a work light; the barrel's lower end on its pivot, a hose from the tank
    g += `<defs><clipPath id="dc92door"><rect x="330" y="900" width="270" height="332" rx="10"/></clipPath></defs>`;
    let inn = `<rect x="330" y="900" width="270" height="332" fill="#3a2818"/>` + wash(470, 1010, 230, 220, '#ffcf7a', f1(0.42 * lit)) + wash(470, 940, 90, 60, '#fff1c8', f1(0.5 * lit));
    inn += `<rect x="350" y="960" width="56" height="262" rx="24" fill="#5f6f62" stroke="${INK}" stroke-width="4"/><path d="M362 975 L362 1210" stroke="#8aa08e" stroke-width="6" opacity="0.7"/><circle cx="378" cy="992" r="15" fill="#e8e2d0" stroke="${INK}" stroke-width="3"/><path d="M378 992 L386 984" stroke="${INK}" stroke-width="3"/>`;
    inn += `<rect x="410" y="1128" width="92" height="96" rx="8" fill="#8a3a2a" stroke="${INK}" stroke-width="4"/>`;
    const fw_ = t * 9;
    inn += `<g transform="translate(442 1158) rotate(${f1(fw_ * 57)})"><circle r="24" fill="#2a2a2c" stroke="${INK}" stroke-width="3"/><path d="M-20 0 L20 0 M0 -20 L0 20" stroke="#8a8e92" stroke-width="5"/></g>`;
    inn += `<rect x="505" y="1166" width="58" height="58" rx="6" fill="#3a3e44" stroke="${INK}" stroke-width="4"/><rect x="514" y="1176" width="40" height="10" fill="#5a5e64"/>`;
    inn += pkg(578, 1200, 0.42, 4, 0.6) + pkg(580, 1172, 0.4, -6, 0.6);
    inn += `<path d="M406 1000 Q470 980 ${f1(B.x + ox)} ${f1(B.y + oy + 30)}" fill="none" stroke="#1e1e20" stroke-width="9"/>`;
    inn += `<path d="M${B.x - 30} 1226 L${f1(B.x + ox)} ${f1(B.y + oy + 20)} L${B.x + 30} 1226" fill="none" stroke="#4a4e52" stroke-width="10"/>`;
    inn += `<line x1="${f1(B.x + ox)}" y1="${f1(B.y + oy)}" x2="${f1(EX.x + ox)}" y2="${f1(EX.y + oy)}" stroke="${INK}" stroke-width="50"/><line x1="${f1(B.x + ox)}" y1="${f1(B.y + oy)}" x2="${f1(EX.x + ox)}" y2="${f1(EX.y + oy)}" stroke="#7f878c" stroke-width="40"/>`;
    inn += `<line x1="470" y1="902" x2="470" y2="930" stroke="#1e1e20" stroke-width="3"/><circle cx="470" cy="934" r="9" fill="#fff4d0"/>`;
    g += `<g clip-path="url(#dc92door)">${inn}</g><rect x="330" y="900" width="270" height="332" rx="10" fill="none" stroke="${INK}" stroke-width="5"/>`;
    // the front door window and pillar, the door seam, the mirror
    g += `<path d="M92 888 L300 888 L300 995 L0 995 Z" fill="#26323e" stroke="${INK}" stroke-width="4"/><path d="M110 896 L180 896 L120 986 L20 986 Z" fill="#4a5a6a" opacity="0.5"/>`;
    g += `<path d="M314 884 L314 1236" stroke="#9a9486" stroke-width="4"/><rect x="250" y="1050" width="34" height="9" rx="4" fill="#8a8476"/>`;
    g += `<path d="M58 962 L82 948 L92 980 L66 988 Z" fill="#2a2e34" stroke="${INK}" stroke-width="3"/>`;
    // the slid-back side door over the rear quarter (a step out from the body), with its window
    g += `<path d="M606 894 L814 894 L814 1238 L606 1238 Z" fill="#cdc7b9" stroke="${INK}" stroke-width="5"/><path d="M606 894 L606 1238" stroke="#8a8476" stroke-width="7"/>`;
    g += `<path d="M626 906 L800 906 L800 988 L626 988 Z" fill="#26323e" stroke="${INK}" stroke-width="4"/><rect x="630" y="1050" width="30" height="9" rx="4" fill="#8a8476"/>`;
    // the rear door, swung open toward the camera, the interior glow on its inner edge
    g += wash(830, 1050, 60, 180, '#ffcf7a', f1(0.3 * lit)) + `<path d="M824 884 L912 906 L912 1258 L826 1240 Z" fill="#c4bdae" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M836 902 L900 918 L900 1000 L836 990 Z" fill="#26323e" stroke="${INK}" stroke-width="3"/>`;
    // packages waiting on the ground under the open rear door
    g += wash(940, 1330, 150, 60, ACC, f1(0.16 * lit)) + pkg(890, 1352, 0.62, -4, 0.7) + pkg(960, 1356, 0.62, 5, 0.7) + pkg(1030, 1350, 0.62, -2, 0.7) + pkg(925, 1316, 0.62, 3, 0.7) + pkg(995, 1318, 0.62, -6, 0.7) + pkg(960, 1282, 0.6, 2, 0.7);
    // the front: headlight, bumper, a blank plate holder
    g += `<rect x="-200" y="1066" width="26" height="30" rx="6" fill="#f2ecd0" stroke="${INK}" stroke-width="3"/><rect x="-206" y="1188" width="80" height="52" rx="8" fill="#2a2c30" stroke="${INK}" stroke-width="4"/>`;
    // wheel arches and wheels
    [70, 690].forEach(wx => { g += `<path d="M${wx - 86} 1240 A86 86 0 0 1 ${wx + 86} 1240 Z" fill="#141518"/><circle cx="${wx}" cy="1262" r="68" fill="#161719" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="1262" r="30" fill="#8a8f93" stroke="${INK}" stroke-width="4"/><circle cx="${wx}" cy="1262" r="9" fill="#3a3e42"/>`; });
    // the roof hatch: a dark slot and the lid hinged at its front edge, tipped up and forward
    g += `<rect x="560" y="855" width="200" height="10" fill="#1a1410"/>` + wash(660, 856, 120, 26, '#ffcf7a', f1(0.3 * lit));
    g += `<path d="M560 860 L440 690 L478 674 L600 846 Z" fill="#c4bdae" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M548 842 L452 704" stroke="#e6e1d6" stroke-width="5" opacity="0.6"/>`;
    // the barrel above the roof: from just below the hatch to the muzzle, with clamps and a highlight
    const e0 = { x: EX.x - D.x * 20 + ox, y: EX.y - D.y * 20 + oy }, m0 = { x: M.x + ox, y: M.y + oy };
    g += `<line x1="${f1(e0.x)}" y1="${f1(e0.y)}" x2="${f1(m0.x)}" y2="${f1(m0.y)}" stroke="${INK}" stroke-width="52" stroke-linecap="butt"/><line x1="${f1(e0.x)}" y1="${f1(e0.y)}" x2="${f1(m0.x)}" y2="${f1(m0.y)}" stroke="#8a9296" stroke-width="40" stroke-linecap="butt"/>`;
    g += `<line x1="${f1(e0.x - 10)}" y1="${f1(e0.y - 8)}" x2="${f1(m0.x - 10)}" y2="${f1(m0.y - 8)}" stroke="#c4ccd0" stroke-width="7" opacity="0.7"/>`;
    for (let i = 1; i < 4; i++) { const cx = lerp(e0.x, m0.x, i / 4), cy = lerp(e0.y, m0.y, i / 4); g += `<line x1="${f1(cx - D.y * 26)}" y1="${f1(cy + D.x * 26)}" x2="${f1(cx + D.y * 26)}" y2="${f1(cy - D.x * 26)}" stroke="#4a5054" stroke-width="12"/>`; }
    g += `<g transform="translate(${f1(m0.x)} ${f1(m0.y)}) rotate(${f1(Math.atan2(D.y, D.x) * 180 / Math.PI + 90)})"><ellipse cx="0" cy="0" rx="28" ry="11" fill="#5a6064" stroke="${INK}" stroke-width="4"/><ellipse cx="0" cy="0" rx="18" ry="6" fill="#0c0c0e"/></g>`;
    return g;
  }
  // the package's flight from the muzzle up and over the fence, receding (frame-1 coordinates); tau = seconds since launch
  const PC = { x: 930, y: 560 }, P1 = { x: 990, y: 650 }, FL = 2.2, TAU0 = 0.18;
  function flight(tau) {
    if (tau < 0 || tau > FL) return '';
    const u = tau / FL, s = 1 - Math.pow(1 - u, 2), a = Math.pow(1 - s, 2), b = 2 * s * (1 - s), c = s * s;
    const x = a * M.x + b * PC.x + c * P1.x, y = a * M.y + b * PC.y + c * P1.y;
    const k = 1 - 0.5 * Math.pow(s, 1.5), op = 1 - seg(s, 0.85, 1);
    // a short motion trail, then the package
    let g = `<g opacity="${f1(op)}">`;
    for (let i = -1; i <= 1; i++) g += `<path d="M${f1(x - 110 * k + i * 14)} ${f1(y + 90 * k - i * 12)} L${f1(x - 30 * k + i * 14)} ${f1(y + 20 * k - i * 12)}" stroke="${GLOW}" stroke-width="${f1(8 * k)}" stroke-linecap="round" opacity="${i ? 0.35 : 0.6}"/>`;
    return g + pkg(x, y, 1.4 * k, -24 + tau * 200, 1) + '</g>';
  }
  // the launch effects at the muzzle: a flash, an expanding puff of air and dust along the barrel, dust off the hatch
  function blast(tau) {
    if (tau < 0 || tau > 1.8) return '';
    let g = '';
    let sm = '';
    for (let i = 0; i < 5; i++) {
      const e = ease.out(clamp((tau - i * 0.04) / 1.7, 0, 1)); if (e <= 0) continue;
      const along = 10 + (40 + i * 34) * e, px = M.x + D.x * along - (i % 2 ? 26 : -18) * e, py = M.y + D.y * along - 26 * e + (i % 2 ? 22 : 0) * e, r = 22 + (40 + i * 10) * e;
      sm += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(r)}" ry="${f1(r * 0.75)}" fill="#d6d8d4" opacity="${f1(0.62 * Math.pow(1 - e, 1.2))}"/>`;
    }
    const e2 = ease.out(clamp(tau / 1.2, 0, 1));
    sm += `<ellipse cx="${f1(EX.x - 20 * e2)}" cy="${f1(EX.y - 20 - 30 * e2)}" rx="${f1(40 + 110 * e2)}" ry="${f1(18 + 40 * e2)}" fill="#b8ad98" opacity="${f1(0.45 * (1 - e2))}"/>`;
    const fl = tau < 1.0 ? Math.pow(1 - tau / 1.0, 1.2) : 0;
    if (fl > 0) {
      const cx = M.x + D.x * 34, cy = M.y + D.y * 34;
      g += wash(cx, cy, 300, 260, '#ffd890', f1(0.75 * fl)) + wash(cx, cy, 130, 120, '#ffffff', f1(0.95 * fl));
      let rays = ''; for (let i = 0; i < 11; i++) { const a = Math.atan2(D.y, D.x) + (i - 5) * 0.2, L = (70 + (i % 3) * 40) * (0.5 + 0.5 * fl); rays += `<line x1="${f1(M.x + Math.cos(a) * 30)}" y1="${f1(M.y + Math.sin(a) * 30)}" x2="${f1(M.x + Math.cos(a) * (30 + L))}" y2="${f1(M.y + Math.sin(a) * (30 + L))}" stroke="${GLOW}" stroke-width="13" stroke-linecap="round"/>`; }
      g += `<g opacity="${f1(fl)}">${rays}</g><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(24 + 20 * fl)}" fill="#fffbe8" opacity="${f1(0.9 * fl)}"/>`;
    }
    return sm + `<g style="mix-blend-mode:screen">${g}</g>`;
  }
  // everything the hero shot draws for a list of launch times (scene-local seconds)
  function cannonAt(tt, launches) {
    let rc = 0, fx = '', fly = '';
    for (const L of launches) { const tau = tt - L; if (tau >= 0) rc = Math.max(rc, 1 - clamp(tau / 0.25, 0, 1)); fx += blast(tau); fly += flight(tau); }
    return vanSVG({ t: tt, recoil: rc }) + fx + fly;
  }

  // ---------- the ultralight trike (side view, facing right): local origin at the ground under the seat; o.spin the
  // propeller phase; o.tilt degrees (landed: the wing tipped); bundles strapped under the seat (the accent)
  function ultralight(x, y, s, o = {}) {
    const sp = o.spin || 0, tl = o.tilt || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    if (o.shadow) g += `<ellipse cx="0" cy="6" rx="300" ry="20" fill="#000" opacity="0.4"/>`;
    // the wing on its mast (a delta seen from below and to the side)
    g += `<g transform="rotate(${f1(tl)} 0 -470)"><path d="M-20 -470 L-20 -300" stroke="#3a3e44" stroke-width="12"/>`;
    g += `<path d="M320 -520 L-420 -560 Q-120 -470 -40 -455 Q140 -440 380 -420 Z" fill="#c9c0ae" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M320 -520 L-420 -560 L-300 -530 L300 -505 Z" fill="#8a7a62" opacity="0.8"/><path d="M-40 -455 L320 -520" stroke="#6a6252" stroke-width="5"/>`;
    g += `<path d="M-20 -470 L-160 -380 M-20 -470 L120 -380" stroke="#3a3e44" stroke-width="5"/></g>`;
    // the carriage: a tube frame, the seat, three wheels, the engine and the pusher propeller at the back
    g += `<path d="M-150 -300 L160 -300 L120 -120 L-120 -120 Z" fill="none" stroke="#4a4e54" stroke-width="12" stroke-linejoin="round"/>`;
    g += `<path d="M160 -300 L210 -40 M120 -120 L210 -40" stroke="#4a4e54" stroke-width="10"/>`;
    g += `<rect x="-60" y="-210" width="90" height="26" rx="10" fill="#2a2c30" stroke="${INK}" stroke-width="4"/><rect x="-66" y="-300" width="22" height="100" rx="8" fill="#2a2c30" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-200" y="-250" width="70" height="80" rx="10" fill="#5a5e64" stroke="${INK}" stroke-width="4"/>`;
    // the cage of bundles under the seat
    g += `<rect x="-110" y="-150" width="200" height="110" rx="8" fill="none" stroke="#6a6e74" stroke-width="5"/>` + pkg(-60, -112, 0.7, -4, 1) + pkg(30, -110, 0.7, 6, 1) + pkg(-20, -70, 0.7, 2, 1);
    [[-120, -30], [100, -30], [210, -30]].forEach(([wx, wy]) => { g += `<circle cx="${wx}" cy="${wy}" r="30" fill="#161719" stroke="${INK}" stroke-width="4"/><circle cx="${wx}" cy="${wy}" r="11" fill="#8a8f93"/>`; });
    g += `<path d="M-120 -30 L-120 -120 M100 -30 L100 -120" stroke="#4a4e54" stroke-width="8"/>`;
    const a = sp * 360;
    g += `<g transform="translate(-232 -210)"><ellipse rx="22" ry="96" fill="#d8dcdf" opacity="0.18"/><g transform="scale(0.25 1) rotate(${f1(a)})"><rect x="-6" y="-96" width="12" height="192" rx="6" fill="#2a2c30" opacity="0.8"/></g></g>`;
    return g + '</g>';
  }
  // a generic helicopter (side view, facing LEFT; no markings): local origin at the skids' ground contact
  function heli(x, y, s, t, o = {}) {
    const beam = o.beam ?? 1, rot = t * 26;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    if (o.shadow) g += `<ellipse cx="0" cy="${f1(o.shadow)}" rx="320" ry="24" fill="#000" opacity="0.4"/>`;
    g += `<path d="M120 -170 L560 -190 L580 -220 L600 -224 L590 -150 L140 -120 Z" fill="#646c76" stroke="${INK}" stroke-width="5"/>`;   // tail boom and fin
    g += `<path d="M-250 -150 Q-260 -260 -150 -300 L120 -300 Q200 -296 210 -220 L200 -110 Q190 -70 140 -64 L-160 -64 Q-240 -70 -250 -150 Z" fill="#7c848e" stroke="${INK}" stroke-width="6"/><path d="M-246 -120 L200 -120" stroke="#9aa2ac" stroke-width="10" opacity="0.7"/>`;
    g += `<path d="M-236 -170 Q-232 -270 -150 -286 L-90 -286 L-90 -150 Z" fill="#6a8aa0" opacity="0.55" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-120" y="-330" width="160" height="34" rx="10" fill="#2a2e34" stroke="${INK}" stroke-width="4"/><rect x="-46" y="-352" width="12" height="24" fill="#2a2e34"/>`;
    g += `<path d="M-200 0 L200 0 M-150 0 L-140 -64 M120 0 L110 -64" stroke="#2a2e34" stroke-width="10" stroke-linecap="round"/>`;
    const bl = Math.abs(Math.sin(rot)) * 0.4 + 0.6;
    g += `<ellipse cx="-40" cy="-356" rx="${f1(420 * bl)}" ry="10" fill="#c8ccd0" opacity="0.28"/><ellipse cx="-40" cy="-356" rx="${f1(420 * (1.6 - bl))}" ry="5" fill="#2a2e34" opacity="0.5"/>`;
    g += `<circle cx="580" cy="-204" r="${f1(46 * (0.6 + 0.4 * Math.abs(Math.cos(rot * 1.3))))}" fill="#c8ccd0" opacity="0.2"/>`;
    g += `<circle cx="-240" cy="-100" r="16" fill="#fff4d0" stroke="${INK}" stroke-width="3"/>` + (beam > 0 ? wash(-240, -100, 60, 50, '#fff4d0', f1(0.6 * beam)) : '');
    return g + '</g>';
  }
  // a searchlight cone from (x0, y0) to a target (x1, y1), half-width w at the target
  function beamCone(x0, y0, x1, y1, w, op) {
    if (op <= 0) return '';
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
    return `<g style="mix-blend-mode:screen"><path d="M${f1(x0)} ${f1(y0)} L${f1(x1 + nx * w)} ${f1(y1 + ny * w)} L${f1(x1 - nx * w)} ${f1(y1 - ny * w)} Z" fill="#fff4d0" opacity="${f1(0.16 * op)}"/>` +
      wash(x1, y1, w * 1.1, w * 0.6, '#fff4d0', f1(0.3 * op)) + `</g>`;
  }

  // ---------- the steel bollard fence seen front-on: top y0, bottom y1, bollard pitch p and width bw
  function bollards(y0, y1, p, bw, x0 = -500, x1 = W + 500, col = '#4a382c', hi = '#7a5c46') {
    let g = `<rect x="${x0}" y="${y0 - 16}" width="${x1 - x0}" height="20" fill="#3a2c22" stroke="${INK}" stroke-width="4"/>`;
    for (let x = x0; x < x1; x += p) g += `<rect x="${x}" y="${y0}" width="${bw}" height="${y1 - y0}" fill="${col}" stroke="${INK}" stroke-width="3"/><rect x="${x + 3}" y="${y0}" width="${f1(bw * 0.25)}" height="${y1 - y0}" fill="${hi}" opacity="0.5"/>`;
    return g;
  }
  const nightSky = (id, t, top = '#070c18', bot = '#1c2640', n = 90, seed = 9201, y1 = 1000) =>
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="url(#${id})"/>` + E.cine.stars(t, n, seed, -200, y1);

  // the hero figure (the same in the hook and the end scene: the loop) and the camera it loops on
  const HERO_FIG = { id: 'dc92_operator', x: 296, y: 1346, scale: 0.4, dir: 1, turn: 0.45, pose: 'present', silhouette: 'warm', depth: 1.0 };
  const HERO_CAM0 = { x: 10, y: -30, z: 1.05 }, HERO_CAM1 = { x: 32, y: -50, z: 1.13 };

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // the border at night from the Mexican side: a night sky with a pale moon; the US side beyond (a dark ridge, the
    // lights of a town, two floodlight poles); the steel bollard fence across the frame; a dirt lot in front
    dc92_line(ctx, o = {}) {
      const t = ctx.t - (o.off || 0);   // the loop: the end scene passes off = T - 0.08 so its last frame replays frame 0's twinkle
      let sky = nightSky('dc92sk', t) + `<circle cx="150" cy="640" r="30" fill="#efe8d4" opacity="0.85"/>` + wash(150, 640, 110, 110, '#efe8d4', 0.08);
      let far = `<path d="M-500 1010 L-100 960 L160 990 L420 940 L700 985 L980 930 L1300 980 L1600 1000 L1600 1240 L-500 1240 Z" fill="#141b2a"/>`;
      const r = R(9202); for (let i = 0; i < 70; i++) { const x = -300 + r() * 1700, y = 1040 + r() * 90; far += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(2 + r() * 3)}" fill="${r() < 0.7 ? '#ffc070' : '#fff0d0'}" opacity="${f1(0.5 + 0.4 * Math.sin(t * 2 + i))}"/>`; }
      far += wash(540, 1090, 900, 120, '#ffb060', 0.14);
      [[80, 820], [1000, 800]].forEach(([x, y]) => { far += `<rect x="${x - 5}" y="${y}" width="10" height="${1200 - y}" fill="#1e2430"/><rect x="${x - 26}" y="${y - 14}" width="52" height="18" rx="4" fill="#fff0d0"/>` + wash(x, y, 160, 120, '#fff0d0', 0.22); });
      const fence = bollards(690, 1200, 46, 24);
      let ground = `<rect x="-500" y="1196" width="${W + 1000}" height="900" fill="#2a221a"/>` + E.cine.scrub(1212, 14, 9203, '#1c1a14', 0.7, -300, 1400);
      ground += `<path d="M-500 1420 Q300 1380 ${W + 500} 1440" stroke="#1e1913" stroke-width="40" fill="none" opacity="0.7"/><path d="M-500 1600 Q400 1560 ${W + 500} 1620" stroke="#1e1913" stroke-width="44" fill="none" opacity="0.6"/>`;
      ground += wash(470, 1380, 460, 140, '#ffcf7a', 0.12);
      return { light: { dir: 1, rim: '#ffc27a', key: '#c8d0e0' }, layers: [[0.05, sky], [0.25, far], [0.5, fence], [0.9, ground]] };
    },

    // a dusty lot in Agua Prieta at dawn: a pale sky warming at the horizon, flat-roofed houses and power poles, a
    // cinder-block wall with a sheet-metal gate, bare packed earth with tyre tracks
    dc92_lot(ctx, o = {}) {
      let sky = `<defs><linearGradient id="dc92dw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26304a"/><stop offset="0.6" stop-color="#7a6a78"/><stop offset="1" stop-color="#d89a64"/></linearGradient></defs><rect x="-500" y="-400" width="${W + 1000}" height="1500" fill="url(#dc92dw)"/>` + wash(700, 960, 600, 200, '#ffc080', 0.3);
      let far = '';
      [[-300, 860, 300, 120], [40, 880, 220, 100], [300, 850, 260, 130], [620, 870, 200, 110], [860, 845, 320, 135], [1200, 870, 260, 110]].forEach(([x, y, w, h], i) => { far += `<rect x="${x}" y="${y}" width="${w}" height="${h + 100}" fill="${i % 2 ? '#4a4048' : '#3e3640'}" stroke="${INK}" stroke-width="3"/><rect x="${x + w * 0.3}" y="${y + 30}" width="40" height="40" fill="#e8c890" opacity="${i % 3 ? 0.15 : 0.5}"/>`; });
      far += [120, 640, 1100].map(x => `<rect x="${x}" y="700" width="10" height="320" fill="#2a2428"/><rect x="${x - 40}" y="720" width="90" height="8" fill="#2a2428"/>`).join('') + `<path d="M-200 724 Q380 760 645 724 Q880 760 1300 724" stroke="#2a2428" stroke-width="3" fill="none"/>`;
      let wall = `<rect x="-500" y="960" width="${W + 1000}" height="190" fill="#9a9080" stroke="${INK}" stroke-width="5"/>`;
      for (let y = 980; y < 1150; y += 38) for (let x = -500 + ((y / 38) % 2) * 40; x < W + 500; x += 80) wall += `<rect x="${x}" y="${y}" width="78" height="36" fill="none" stroke="#7a7062" stroke-width="2"/>`;
      wall += `<rect x="760" y="900" width="300" height="250" fill="#6a6e70" stroke="${INK}" stroke-width="5"/>` + Array.from({ length: 10 }, (_, i) => `<path d="M${770 + i * 29} 905 L${770 + i * 29} 1145" stroke="#4e5254" stroke-width="5"/>`).join('');
      let ground = `<rect x="-500" y="1146" width="${W + 1000}" height="900" fill="#6a5640"/>` + wash(540, 1500, 900, 400, '#3a2e22', 0.5);
      ground += `<path d="M-500 1300 Q300 1270 ${W + 500} 1320" stroke="#5a4834" stroke-width="30" fill="none"/><path d="M-500 1480 Q400 1440 ${W + 500} 1500" stroke="#5a4834" stroke-width="36" fill="none"/>` + E.cine.scrub(1160, 8, 9211, '#4a4030', 0.6, -300, 1400);
      return { light: { dir: -1, rim: '#ffb070', key: '#e8dcc8' }, layers: [[0.05, sky], [0.3, far], [0.55, wall], [0.9, ground]] };
    },

    // an Arizona farm field at night with the border fence across the back and the lights of the Mexican side beyond:
    // o.view 'wide' (the fence far, the rows converging) or 'close' (low over the furrows, the fence small and high)
    dc92_field(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), close = o.view === 'close';
      const fy0 = close ? 640 : 760, fy1 = close ? 830 : 1010;
      let sky = nightSky('dc92fs', t, '#060a16', '#1a2238', 70, 9221, fy0);
      let far = '';
      const r = R(9222); for (let i = 0; i < 50; i++) { const x = -300 + r() * 1700, y = fy1 - 60 + r() * 50; far += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(2 + r() * 2)}" fill="#ffc070" opacity="${f1(0.4 + 0.3 * Math.sin(t * 2 + i))}"/>`; }
      far += wash(540, fy1 - 30, 900, 90, '#ffb060', 0.12);
      let fence = bollards(fy0, fy1, close ? 26 : 34, close ? 12 : 16) + `<rect x="-500" y="${fy1 - 4}" width="${W + 1000}" height="40" fill="#3a3226"/>`;
      if (close) fence += `<g transform="translate(880 ${fy1 + 30})"><rect x="-22" y="-120" width="44" height="120" rx="16" fill="#5f6f62" stroke="${INK}" stroke-width="3"/><rect x="-8" y="-136" width="16" height="18" fill="#3a3e44"/></g>` + wash(880, fy1 - 30, 70, 90, ACC, 0.12);
      let ground = `<rect x="-500" y="${fy1 + 34}" width="${W + 1000}" height="1400" fill="#2a2a1c"/>`;
      const vx = 540, vy = fy1 + 10;
      for (let i = -12; i <= 12; i++) { const xb = vx + i * (close ? 260 : 170); ground += `<path d="M${f1(vx + i * 14)} ${vy + 30} L${f1(xb)} ${H + 200}" stroke="#3a3a26" stroke-width="${close ? 26 : 16}"/><path d="M${f1(vx + i * 14 + 7)} ${vy + 30} L${f1(xb + (close ? 120 : 80))} ${H + 200}" stroke="#1e1e14" stroke-width="${close ? 10 : 6}" opacity="0.8"/>`; }
      ground += wash(540, fy1 + 200, 700, 160, '#5a6a4a', 0.12);
      return { light: { dir: -1, rim: '#cfe4ff', key: '#c8d0dc' }, layers: [[0.05, sky], [0.3, far], [0.5, fence], [0.9, ground]] };
    },

    // the night sky over the desert, seen while flying: stars, a moon, two ridgelines and saguaros that scroll right to
    // left (the aircraft flies left to right), a town glow on the horizon
    dc92_sky(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = nightSky('dc92ns', t, '#050914', '#1c2440', 120, 9231, 1300) + `<circle cx="880" cy="1100" r="34" fill="#efe8d4" opacity="0.8"/>` + wash(880, 1100, 140, 140, '#efe8d4', 0.08);
      const sh1 = -((t * 30) % 600), sh2 = -((t * 90) % 700), sh3 = -((t * 240) % 520);
      let ridge = `<g transform="translate(${f1(sh1)} 0)">` + [0, 600, 1200].map(o_ => `<path d="M${o_ - 500} 1560 L${o_ - 300} 1480 L${o_ - 120} 1520 L${o_ + 60} 1450 L${o_ + 100} 1560 Z" fill="#141a28"/>`).join('') + `</g>` + wash(1000, 1560, 400, 60, '#ffb060', 0.14);
      let near = `<g transform="translate(${f1(sh2)} 0)">` + [0, 700, 1400].map(o_ => `<path d="M${o_ - 600} 1640 Q${o_ - 300} 1590 ${o_ - 50} 1630 Q${o_ + 200} 1600 ${o_ + 100} 1660 L${o_ + 100} 1700 L${o_ - 600} 1700 Z" fill="#10141e"/>`).join('') + `</g><rect x="-500" y="1690" width="${W + 1000}" height="400" fill="#0e1018"/>`;
      let cacti = `<g transform="translate(${f1(sh3)} 0)">`;
      for (let i = 0; i < 6; i++) { const x = -200 + i * 260, hh = 160 + (i % 3) * 50; cacti += `<path d="M${x} 1760 L${x} ${1760 - hh} M${x} ${1760 - hh * 0.6} L${x - 40} ${1760 - hh * 0.6} L${x - 40} ${1760 - hh * 0.85} M${x} ${1760 - hh * 0.5} L${x + 36} ${1760 - hh * 0.5} L${x + 36} ${1760 - hh * 0.75}" stroke="#090b10" stroke-width="22" stroke-linecap="round" fill="none"/>`; }
      cacti += `</g>`;
      return { light: { dir: 1, rim: '#cfe4ff', key: '#c8d0dc' }, layers: [[0.05, sky], [0.25, ridge], [0.6, near], [0.9, cacti]] };
    },

    // the desert near Marana at night: a mountain ridge, a distant airport beacon and a row of runway lights, creosote
    // scrub, flat sandy ground
    dc92_strip(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = nightSky('dc92ss', t, '#060a16', '#1e2638', 90, 9241, 900);
      let far = `<path d="M-500 1020 L-200 900 L60 960 L300 860 L520 940 L760 880 L1000 950 L1300 900 L1600 1000 L1600 1100 L-500 1100 Z" fill="#161c2a"/>`;
      for (let i = 0; i < 16; i++) far += `<circle cx="${-100 + i * 26}" cy="1066" r="3" fill="#cfe8ff" opacity="0.7"/>`;
      const bk = (t * 0.8) % 1; far += `<rect x="236" y="990" width="6" height="70" fill="#2a3040"/><circle cx="239" cy="986" r="7" fill="${bk < 0.5 ? '#9fffb0' : '#fff4d0'}" opacity="${f1(0.5 + 0.5 * Math.abs(Math.sin(t * 4)))}"/>` + wash(239, 986, 40, 40, '#d0ffe0', 0.2);
      let mid = `<rect x="-500" y="1090" width="${W + 1000}" height="200" fill="#2a261e"/>` + E.cine.scrub(1110, 16, 9242, '#1a1a12', 0.8, -300, 1400);
      let ground = `<rect x="-500" y="1270" width="${W + 1000}" height="900" fill="#3a3326"/>` + E.cine.scrub(1300, 8, 9243, '#22200f', 1.3, -300, 1400) + `<path d="M-500 1500 Q400 1470 ${W + 500} 1520" stroke="#2e281e" stroke-width="40" fill="none"/>`;
      return { light: { dir: 1, rim: '#cfe4ff', key: '#c8d0dc' }, layers: [[0.05, sky], [0.25, far], [0.55, mid], [0.9, ground]] };
    }
  });

  E.registerScenes({
    // 1 - HOOK (frame 0): the cannon van at the fence; a package just out of the muzzle (launched 0.18 s before frame 0:
    //     the flash, the puff and the dust are already there) flies over the fence top; the camera pushes in; the
    //     operator turns his head at once, points up on line 2, works the valve again for the second shot on "shot"
    dc92_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.4), fr = WT(ctx, 1, 5, 3.4);
      return E.cine.shot(ctx, {
        set: 'dc92_line', grade: 'night', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [
          { ...HERO_FIG, keys: [{ at: 0.05, headTurn: 0.3, dur: 0.45 }, { at: l2, pose: 'point_up', headTurn: 0.2, dur: 0.4 }, { at: fr - 0.25, pose: 'present', headTurn: 0.1, dur: 0.35 }] }
        ],
        props: [{ depth: 0.98, accent: true, svg: tt => cannonAt(tt, [-TAU0, fr]) }],
        overlays: [
          { type: 'callout', at: Math.max(3.05, l2 + 0.35), target: [748, 745], label: [1040, 470], anchor: 'end', w: 520, fs: 30, text: 'AIR CANNON IN THE ROOF', sub: 'Compressor, engine, air tank', r: 50, depth: 0.98 },
          { type: 'label', at: Math.max(3.05, l2 + 0.6), x: 60, y: 640, text: 'AGUA PRIETA, MEXICO · NOV 2017', fs: 28 }
        ],
        tag: TAG
      });
    },

    // 2 - THE GOTCHA: the lot at dawn; the van (smaller, further back) with its roof open and the barrel up; the soldier
    //     in the foreground stoops to the stacked packages and points on "seized" (the single impact); the federal
    //     officer by the van; on "1,800" the packages light up and the counter counts
    dc92_seized(ctx) {
      const t = ctx.t, sz = WT(ctx, 0, 1, 0.7), n = WT(ctx, 0, 4, 1.4), wd = WT(ctx, 0, 7, 2.3);
      const lit = seg(t, n - 0.1, n + 0.4);
      return E.cine.shot(ctx, {
        set: 'dc92_lot', grade: 'dawn', haze: 0.35,
        cam: { from: { x: -20, y: 30, z: 1.0 }, to: { x: 10, y: 20, z: 1.07 } },
        figures: [
          { id: 'dc92_fedpol', x: 960, y: 1560, scale: 0.78, dir: -1, turn: 0.4, pose: 'arms_crossed', expr: 'stern', depth: 0.96, hat: { style: 'cap', color: '#1a2230' },
            keys: [{ at: 0.2, headTurn: 0.2, dur: 0.4 }, { at: sz, pose: 'present', expr: 'determined', dur: 0.35 }, { at: wd, pose: 'point', headTurn: 0.1, dur: 0.35 }] },
          { id: 'dc92_soldier', x: 170, y: 1840, scale: 1.0, dir: 1, turn: 0.45, pose: 'stand', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#3a4232' },
            keys: [{ at: 0.1, pose: 'examine', dur: 0.5 }, { at: sz, pose: 'point', expr: 'determined', headTurn: 0.1, dur: 0.3 }, { at: n + 0.2, pose: 'examine', expr: 'stern', dur: 0.4 }] }
        ],
        props: [
          // the van, parked further back, roof open, barrel up
          { depth: 0.92, accent: true, svg: tt => `<g transform="translate(372 240) scale(0.75)">${vanSVG({ t: tt, lit: 0.6 })}</g>` },
          // the seized packages, stacked on the earth in front of the van (they warm up on "1,800")
          { depth: 0.93, accent: true, svg: tt => { let g = wash(470, 1250, 300, 120, ACC, f1(0.18 + 0.2 * lit)); const r = R(9251);
              for (let row = 0; row < 4; row++) for (let i = 0; i < 7 - row; i++) g += pkg(300 + i * 58 + row * 29 + (r() - 0.5) * 6, 1290 - row * 34, 0.7, (r() - 0.5) * 8, 0.4 + 0.6 * lit);
              return g; } }
        ],
        overlays: [
          { type: 'impact', at: sz, x: 480, y: 1180 },
          { type: 'counter', at: n + 0.05, dur: 0.9, from: 0, to: 1800, suffix: ' LB', label: 'OF WEED SEIZED WITH THE VAN', y: 610, fs: 120 },
          { type: 'label', at: 0.3, x: 60, y: 436, text: 'MEXICAN MILITARY + FEDERAL POLICE · NOV 2017', fs: 26 }
        ],
        tag: TAG
      });
    },

    // 3 - REHOOK + CASE 2: the Arizona field at night; on "shot" a puff rises beyond the fence and three cans arc over it
    //     into the field, travelling right; the agent in the foreground turns, lifts his torch and points as they land
    dc92_cans(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 1.6), fd = WT(ctx, 1, 4, 2.6), cn = WT(ctx, 1, 5, 3.0);
      const L0 = { x: 230, y: 860 }, lands = [[540, 1330], [720, 1240], [410, 1200]];
      const canFly = tt => { let g = ''; const e = ease.out(clamp((tt - fd) / 1.4, 0, 1));
        if (tt > fd - 0.05) g += `<g style="mix-blend-mode:screen"><ellipse cx="${f1(L0.x)}" cy="${f1(740 - 60 * e)}" rx="${f1(40 + 90 * e)}" ry="${f1(26 + 50 * e)}" fill="#cfd2d0" opacity="${f1(0.45 * (1 - e))}"/></g>`;
        lands.forEach(([lx, ly], i) => { const t0 = fd + i * 0.22, u = clamp((tt - t0) / 1.0, 0, 1); if (tt < t0) return;
          if (u < 1) { const cx = (L0.x + lx) / 2 - 40, cy = 620, a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u, x = a * L0.x + b * cx + c * lx, y = a * L0.y + b * cy + c * ly;
            g += `<path d="M${f1(x - 40)} ${f1(y - 30 + 60 * u)} L${f1(x)} ${f1(y)}" stroke="${GLOW}" stroke-width="6" stroke-linecap="round" opacity="0.3"/>` + can(x, y, 0.8 + 0.7 * u, u * 540 + i * 40, 0.9); }
          else { const d = clamp((tt - t0 - 1.0) / 0.6, 0, 1); g += `<ellipse cx="${lx}" cy="${ly + 30}" rx="${f1(40 + 60 * d)}" ry="${f1(12 + 14 * d)}" fill="#8a8068" opacity="${f1(0.45 * (1 - d))}"/>` + can(lx, ly, 1.5, 80 + i * 30, 0.9); } });
        return g; };
      return E.cine.shot(ctx, {
        set: 'dc92_field', setOpts: { view: 'wide' }, grade: 'night', haze: 0.3,
        cam: { from: { x: -20, y: 10, z: 1.02 }, to: { x: 10, y: 20, z: 1.08 } },
        figures: [
          { id: 'dc92_agent', x: 880, y: 1660, scale: 0.72, dir: -1, turn: 0.4, pose: 'torch', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#2e3a30' }, propOpts: { beamLen: 360, aim: 70 },
            keys: [{ at: 0.1, headTurn: 0.3, dur: 0.5 }, { at: l2, pose: 'stand_tense', expr: 'worried', headTurn: 0.1, dur: 0.35 }, { at: fd, pose: 'point_up', expr: 'shocked', dur: 0.3 }, { at: cn + 0.5, pose: 'torch_low', expr: 'determined', dur: 0.4 }] }
        ],
        props: [{ depth: 0.95, accent: true, svg: canFly }],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 480, text: 'SAN LUIS, ARIZONA (NEAR YUMA) · DEC 2012', fs: 30, sub: 'Border Patrol: fired about 500 ft into Arizona' }
        ],
        tag: TAG
      });
    },

    // 4 - CASE 2's GOTCHA (the close-up): low over the furrows; the agent kneels on "found" and his torch beam sweeps onto
    //     the cans (they catch the light one by one); the callout on "33"; the CO2 tank by the fence behind
    dc92_found(ctx) {
      const t = ctx.t, fd = WT(ctx, 0, 1, 0.6), n = WT(ctx, 0, 2, 0.9), fl = WT(ctx, 0, 6, 1.8);
      const cans = [[600, 1215, 1.2, 70], [720, 1170, 1.1, 120], [860, 1235, 1.25, 30], [660, 1290, 1.3, 160], [940, 1160, 1.0, 95], [800, 1125, 0.9, 10], [1010, 1255, 1.2, 140]];
      return E.cine.shot(ctx, {
        set: 'dc92_field', setOpts: { view: 'close' }, grade: 'night', haze: 0.25, dof: true,
        cam: { from: { x: 10, y: 60, z: 1.12 }, to: { x: 30, y: 70, z: 1.2 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'dc92_agent', x: 330, y: 1690, scale: 1.18, dir: 1, turn: 0.45, pose: 'torch_low', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#2e3a30' }, propOpts: { beamLen: 520, aim: 62 },
            keys: [{ at: 0.1, headTurn: 0.2, dur: 0.4 }, { at: fd, pose: 'kneel', expr: 'realise', headTurn: 0.25, dur: 0.4 }, { at: fl + 0.2, pose: 'kneel', expr: 'determined', headTurn: 0.35, dur: 0.4 }] }
        ],
        props: [{ depth: 0.98, accent: true, svg: tt => { let g = ''; cans.forEach(([x, y, s, r], i) => { const k = seg(tt, fd + 0.1 + i * 0.08, fd + 0.4 + i * 0.08); g += can(x, y, s, r, k); }); return g + wash(780, 1210, 300, 120, '#fff4d0', f1(0.12 * seg(tt, fd, fd + 0.4))); } }],
        overlays: [
          { type: 'callout', at: n + 0.15, target: [720, 1170], label: [1050, 990], anchor: 'end', w: 500, text: '33 CANS · ABOUT 85 LB', sub: 'Plus a CO2 tank by the fence', r: 60, depth: 0.98 },
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'BORDER PATROL · YUMA SECTOR', fs: 32, sub: 'No arrests reported' }
        ],
        tag: TAG
      });
    },

    // 5 - REHOOK + CASE 3: the night sky over the desert, the ground scrolling under the ultralight (left to right);
    //     the pilot (silhouette) turns his head on "flew"; on "ultralight" a helicopter searchlight sweeps in and holds on
    //     him; the FUN FACT card
    dc92_flight(ctx) {
      const t = ctx.t, T = ctx.T, fw_ = WT(ctx, 0, 3, 0.8), ul = WT(ctx, 0, 6, 1.8);
      const bm = seg(t, ul - 0.3, ul + 0.2);
      return E.cine.shot(ctx, {
        set: 'dc92_sky', grade: 'night', haze: 0.2,
        cam: { from: { x: -10, y: 20, z: 1.02 }, to: { x: 10, y: 10, z: 1.08 } },
        figures: [
          { id: 'dc92_pilot', x: 520, y: 1236, scale: 0.42, dir: 1, turn: 0.5, pose: 'sit_type', silhouette: 'cool', noChair: true, depth: 1.0,
            keys: [{ at: 0.1, headTurn: 0.2, dur: 0.4 }, { at: fw_, pose: 'sit', headTurn: -0.2, dur: 0.35 }, { at: ul, pose: 'sit_slumped', headTurn: 0.3, dur: 0.35 }] }
        ],
        props: [
          { depth: 0.98, accent: true, svg: tt => ultralight(540, 1260, 0.85, { spin: tt * 7 }) },
          { depth: 1.02, svg: tt => beamCone(1300, 300, lerp(1300, 560, ease.out(bm)), lerp(300, 1050, ease.out(bm)), 150, bm) }
        ],
        overlays: [
          { type: 'funfact', at: LS(ctx, 0, 0) + 0.4, x: 40, w: 1000, y: 470, fs: 40, rows: [{ text: 'IN THE US, AN ULTRALIGHT' }, { text: 'NEEDS NO PILOT’S LICENSE' }, { text: 'FAA Part 103 · one seat, under 254 lb empty', fs: 28 }] }
        ],
        tag: TAGL
      });
    },

    // 6 - THE BIGGEST GOTCHA (the music drop): the landing site; the landed ultralight at the left; the pilot runs right
    //     on "ran"; the helicopter settles in his path in a swirl of dust on "helicopter" and the crew member steps out;
    //     on "caught" the pilot stops, hands behind his back
    dc92_caught(ctx) {
      const t = ctx.t, T = ctx.T, rn = WT(ctx, 0, 2, 0.8), hc = WT(ctx, 0, 5, 1.6), ct = WT(ctx, 0, 6, 2.0);
      const land = ease.inOut(seg(t, 0, hc + 0.2));
      return E.cine.shot(ctx, {
        set: 'dc92_strip', grade: 'night', haze: 0.25,
        cam: { from: { x: -10, y: 30, z: 1.02 }, to: { x: 20, y: 20, z: 1.08 } },
        smoke: { y: 1300, op: 0.18, col: '#a89a80' },
        figures: [
          { id: 'dc92_pilot', x: 170, y: 1720, scale: 0.88, dir: 1, turn: 0.45, pose: 'stand_tense', silhouette: 'cool', depth: 1.0,
            walk: { at: rn - 0.05, dur: Math.max(0.8, hc - rn + 0.1), cadence: 7.5, stride: 30, from: 170, to: 400 },
            keys: [{ at: 0.1, headTurn: 0.3, dur: 0.4 }, { at: rn - 0.1, pose: 'walk', dur: 0.2 }, { at: hc + 0.1, pose: 'stand_tense', headTurn: 0.1, dur: 0.3 }, { at: ct, pose: 'hands_behind', headTurn: 0.35, dur: 0.4 }, { at: ct + 0.6, pose: 'bowed', dur: 0.4 }] },
          { id: 'dc92_crew', x: 640, y: 1660, scale: 0.84, dir: -1, turn: 0.4, pose: 'torch', expr: 'stern', depth: 0.96, propOpts: { beamLen: 380, aim: 70 }, show: [hc - 0.1],
            walk: { at: hc - 0.1, dur: 0.7, cadence: 4.4, stride: 18, from: 760, to: 620 },
            keys: [{ at: ct - 0.1, pose: 'present', expr: 'determined', dur: 0.35 }, { at: ct + 0.6, pose: 'point', expr: 'stern', dur: 0.35 }] }
        ],
        props: [
          { depth: 0.92, accent: true, svg: tt => ultralight(150, 1300, 0.55, { spin: tt * 2, tilt: -8, shadow: true }) },
          { depth: 0.93, svg: tt => { const hy = lerp(1100, 1480, land); return heli(900, hy, 0.9, tt, { beam: 1, shadow: lerp(360, 10, land) }) + beamCone(900 - 216, hy - 90, lerp(220, 420, seg(tt, rn, hc)), 1620, 120, 1); } }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'MARANA, ARIZONA · OCT 2008', fs: 32, sub: 'About 223 lb on board · pleaded guilty, 33 months' }
        ],
        tag: TAGL
      });
    },

    // 7 - THE CALLBACK (the loop): frame 1's picture; the operator turns his head on "second"; the camera eases back to
    //     frame 1's start and the cannon fires again so that, at the last frame, the package is where it was at frame 0
    dc92_end(ctx) {
      const t = ctx.t, T = ctx.T, sd = WT(ctx, 0, 4, 1.0);
      const LOOP_AT = T - 0.08;   // the loop check grabs the frame 0.08 s before the end: there, everything time-driven equals frame 0
      const back = T - 0.5;
      return E.cine.shot(ctx, {
        set: 'dc92_line', setOpts: { off: LOOP_AT }, grade: 'night', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [{ ...HERO_FIG, keys: [{ at: 0.2, headTurn: 0.25, dur: 0.4 }, { at: sd, headTurn: -0.3, dur: 0.4 }, { at: Math.max(sd + 0.5, back - 0.6), headTurn: 0, dur: 0.45 }] }],
        props: [{ depth: 0.98, accent: true, svg: tt => cannonAt(tt - LOOP_AT, [-TAU0]) }],
        overlays: [],
        tag: TAG
      });
    }
  });
})();
