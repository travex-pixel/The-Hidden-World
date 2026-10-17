/* Case File 59 (premium look, engagement + shares + smoothness + hooks + plateau rules): the drug catapult at the
   Arizona-Sonora border near Naco, January 2011. National Guard troops on Border Patrol cameras watched smugglers on the
   Mexican side launch bundles over the border fence with a homemade, elastic-powered catapult on a trailer; Mexican soldiers
   moved in, the smugglers fled, and the catapult, an SUV and the marijuana were seized. Then the escalation at the same
   border: a gas (CO2) cannon firing cans of weed (San Luis, Arizona, December 2012) and 228 ultralight crossings in a year
   (CBP, fiscal 2010).
   Structure: frame 1 = the HERO OBJECT (the catapult on its trailer, the arm just slammed up, a taped bale already in flight
   over the border fence) with two smuggler silhouettes, the camera already pushing, a generic surveillance-camera frame on
   top; a dim camera room (two Guard troops at a monitor wall, white-hot images); close on the trailer (loading and the
   launch; the FUN FACT); the raid (torch beams, the smugglers run, the catapult left alone); a farm field at dawn on the
   American side (the biggest reveal: a can lands from over the fence; the single impact); the night sky (an ultralight; the
   228 counter); a border-crossing lane at dusk (the LESSON checklist, captions off); the outcome on the hero catapult in
   frame 1's framing with the burned-in end question.
   Smoothness (owner, 44+): cuts and dissolves, one push, one zoom (the end); one slow camera move per shot; settle only on
   the hero dolly-ins (first and last frames) and the reveal; one impact, no shake, no handheld.
   Screen direction: bales, cans and the ultralight always travel left to right (Mexico -> America).
   Look: episode.look = 'premium' with one cool night palette (shadow #14202a, mid #c9b89a, accent #e8a33c). The ONLY strongly
   coloured object is the taped bale in the catapult's cup / in flight (props marked accent: true).
   Content rules: no weapon is drawn or pointed, no violence; soldiers hold only torches. The smugglers are anonymous dark
   silhouettes; the Guard troops, soldiers, agent and the young man are generic figures with no insignia, flag or logo.
   New environments (E.registerSets): dc59_border (the Mexican side of the border fence at night, the fence receding on the
   right), dc59_close (close on the fence top and the trailer), dc59_ops (a camera room), dc59_field (a farm field at dawn on
   the American side, the fence and a canal behind), dc59_sky (a starry desert sky over the border), dc59_lane (a border
   crossing lane at dusk). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#e8a33c';
  const D2R = Math.PI / 180;

  // ---------- THE HERO: a taped bale (plain bundle, amber tape bands; the accent)
  function bale(x, y, s, rot = 0, glow = 0.5) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    if (glow > 0) g += wash(0, 0, 110, 90, ACC, f1(0.22 * glow));
    g += `<rect x="-62" y="-40" width="124" height="80" rx="16" fill="#b98a4a" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-50 -30 Q0 -40 52 -28" stroke="#d9a860" stroke-width="7" fill="none" opacity="0.8" stroke-linecap="round"/>`;
    g += [-30, 4, 36].map(x0 => `<rect x="${x0 - 8}" y="-41" width="16" height="82" fill="${ACC}" stroke="${INK}" stroke-width="3"/>`).join('');
    g += `<rect x="-63" y="-6" width="126" height="13" fill="${ACC}" stroke="${INK}" stroke-width="3" opacity="0.95"/>`;
    return g + '</g>';
  }
  // a sealed can (the cannon's projectile)
  function can(x, y, s, rot = 0) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><rect x="-34" y="-50" width="68" height="100" rx="10" fill="#9aa2a6" stroke="${INK}" stroke-width="5"/>` +
      `<rect x="-34" y="-40" width="68" height="8" fill="#6e767a"/><rect x="-34" y="32" width="68" height="8" fill="#6e767a"/><path d="M-20 -44 L-20 44" stroke="#d8dee0" stroke-width="6" opacity="0.6"/>` +
      `<rect x="-28" y="-14" width="56" height="26" fill="${ACC}" opacity="0.55"/></g>`;
  }

  // the catapult on its flatbed trailer (side view, towing tongue to the left). Origin = the ground under the trailer's
  // centre; local units: wheels r 48, bed top -132, pivot (0, -600), long arm 380, short arm 100. th = arm angle in degrees
  // (SVG convention, clockwise positive): 150 = cocked (down-left), 290 = fired (up-right, against the stop bar).
  const PIV = -600, ARM = 380;
  function catapult(x, y, s, th, o = {}) {
    const a = th * D2R, dx = Math.cos(a), dy = Math.sin(a);
    const tip = [ARM * dx, PIV + ARM * dy], back = [-100 * dx, PIV - 100 * dy];
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    g += `<ellipse cx="0" cy="4" rx="360" ry="24" fill="#000" opacity="0.35"/>`;
    // the rear A-frame (further away: lighter, offset)
    g += `<g transform="translate(26 -16)" opacity="0.8"><path d="M-160 -132 L-6 ${PIV - 10} L6 ${PIV - 10} L160 -132" stroke="${INK}" stroke-width="34" fill="none" stroke-linejoin="round"/><path d="M-160 -132 L-6 ${PIV - 10} L6 ${PIV - 10} L160 -132" stroke="#6a5038" stroke-width="22" fill="none" stroke-linejoin="round"/></g>`;
    // the elastic bands: from the short arm's end to the rear of the bed (stretched when cocked)
    const bandW = clamp(16 - 0.012 * Math.hypot(back[0] + 240, back[1] + 132), 5, 12);
    g += [[-250, -132], [-214, -132], [-178, -132]].map(([bx, by], i) => `<path d="M${f1(back[0] + i * 4)} ${f1(back[1])} L${bx} ${by}" stroke="#1a1a1c" stroke-width="${f1(bandW + 4)}" stroke-linecap="round"/><path d="M${f1(back[0] + i * 4)} ${f1(back[1])} L${bx} ${by}" stroke="#4a4e52" stroke-width="${f1(bandW - 2)}" stroke-linecap="round"/>`).join('');
    // the flatbed trailer: tongue + coupler, jack stand, bed, rails, tandem wheels with mudguard
    g += `<path d="M-280 -112 L-500 -92 L-280 -82 Z" fill="#2a2c2e" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="-530" y="-104" width="40" height="22" rx="6" fill="#3a3c3e" stroke="${INK}" stroke-width="4"/><rect x="-420" y="-96" width="12" height="70" fill="#3a3c3e" stroke="${INK}" stroke-width="3"/><rect x="-436" y="-30" width="44" height="12" fill="#3a3c3e" stroke="${INK}" stroke-width="3"/>`;
    g += `<rect x="-290" y="-136" width="580" height="44" rx="4" fill="#5a4a38" stroke="${INK}" stroke-width="6"/>` + [-230, -150, -70, 10, 90, 170, 250].map(xx => `<path d="M${xx} -134 L${xx} -94" stroke="#463a2c" stroke-width="4"/>`).join('') + `<rect x="-290" y="-100" width="580" height="12" fill="#2a2c2e"/>`;
    g += `<path d="M-130 -90 Q-10 -150 120 -90" fill="#2a2c2e" stroke="${INK}" stroke-width="5"/>`;
    [-62, 62].forEach(wx => { g += `<circle cx="${wx}" cy="-48" r="48" fill="#141516" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-48" r="22" fill="#6a6e72" stroke="${INK}" stroke-width="4"/><circle cx="${wx}" cy="-48" r="6" fill="#2a2c2e"/>`; });
    // the front A-frame + cross brace + stop bar
    g += `<path d="M-170 -132 L-8 ${PIV - 10} L8 ${PIV - 10} L170 -132" stroke="${INK}" stroke-width="40" fill="none" stroke-linejoin="round"/><path d="M-170 -132 L-8 ${PIV - 10} L8 ${PIV - 10} L170 -132" stroke="#8a6a48" stroke-width="28" fill="none" stroke-linejoin="round"/>`;
    g += `<path d="M-100 -330 L100 -330" stroke="${INK}" stroke-width="26"/><path d="M-100 -330 L100 -330" stroke="#7a5c3e" stroke-width="16"/>`;
    g += `<path d="M24 ${PIV - 8} L104 ${PIV - 150}" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M24 ${PIV - 8} L104 ${PIV - 150}" stroke="#7a5c3e" stroke-width="12" stroke-linecap="round"/><rect x="84" y="${PIV - 176}" width="44" height="34" rx="10" fill="#3a3c3e" stroke="${INK}" stroke-width="5" transform="rotate(20 106 ${PIV - 159})"/>`;
    g += [-150, -110, 110, 150].map((xx, i) => `<circle cx="${xx * (i < 2 ? 1 : 1)}" cy="${-150 - (i % 2) * 60}" r="5" fill="#c8c0b0" opacity="0.6"/>`).join('');
    // the throwing arm (a heavy timber), the cup at its tip, the axle hub
    g += `<path d="M${f1(back[0])} ${f1(back[1])} L${f1(tip[0])} ${f1(tip[1])}" stroke="${INK}" stroke-width="36" stroke-linecap="round"/><path d="M${f1(back[0])} ${f1(back[1])} L${f1(tip[0])} ${f1(tip[1])}" stroke="#a07a50" stroke-width="24" stroke-linecap="round"/>`;
    g += `<path d="M${f1(back[0] * 0.6)} ${f1(PIV + (back[1] - PIV) * 0.6)} L${f1(tip[0] * 0.95)} ${f1(PIV + (tip[1] - PIV) * 0.95)}" stroke="#c49a68" stroke-width="5" opacity="0.6"/>`;
    const nx = -dy, ny = dx;   // the cup opens towards the direction of the swing
    const cx = tip[0] + nx * 14, cy = tip[1] + ny * 14, ca = Math.atan2(ny, nx) / D2R;
    g += `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(ca + 90)})"><path d="M-62 0 Q-62 -64 0 -64 Q62 -64 62 0 Z" fill="#3a3430" stroke="${INK}" stroke-width="6" transform="scale(1 -1)"/><path d="M-50 4 L50 4" stroke="#6a5a48" stroke-width="6"/></g>`;
    if (o.load) g += bale(cx + nx * 38, cy + ny * 38, 0.8, ca + 90, 0.6);
    g += `<circle cx="0" cy="${PIV}" r="22" fill="#3a3c3e" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="${PIV}" r="8" fill="#9a9ea2"/>`;
    return g + '</g>';
  }
  // the world position of the cup's load for a catapult placed at (x, y, s) with arm angle th
  const cupAt = (x, y, s, th) => { const a = th * D2R, dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx;
    return [x + s * (ARM * dx + nx * 52), y + s * (PIV + ARM * dy + ny * 52)]; };
  // the arm's angle through one launch: at rest cocked (150) until t0 - 0.3, slams up to 290 at t0, then a damped bounce
  const fireTh = (t, t0) => t < t0 ? lerp(150, 290, ease.in(seg(t, t0 - 0.3, t0))) : 290 - 9 * Math.exp(-5 * (t - t0)) * Math.cos(16 * (t - t0));
  // a bale in flight from p0 to p1 between ta and tb, with an arc of height ah; trailing speed streaks
  function flight(t, ta, tb, p0, p1, ah, s, spin = 380) {
    if (t < ta || t > tb + 0.05) return '';
    const u = seg(t, ta, tb), x = lerp(p0[0], p1[0], u), y = lerp(p0[1], p1[1], u) - ah * 4 * u * (1 - u);
    const u2 = Math.max(0, u - 0.06), x2 = lerp(p0[0], p1[0], u2), y2 = lerp(p0[1], p1[1], u2) - ah * 4 * u2 * (1 - u2);
    let g = '';
    for (let k = 0; k < 3; k++) g += `<path d="M${f1(x2 - 30)} ${f1(y2 - 18 + k * 18)} L${f1(x - 70)} ${f1(y - 18 + k * 18)}" stroke="#f4ead8" stroke-width="4" opacity="${f1(0.35 - k * 0.08)}" stroke-linecap="round"/>`;
    return g + bale(x, y, s, -20 + spin * u, 0.9);
  }
  // a generic surveillance-camera frame (our own graphic, not real footage): corner brackets, a blinking REC dot, a small
  // centre cross and a faint scanline drift
  function hud(t, top = true) {
    const br = (x, y, dx, dy) => `<path d="M${x} ${y + dy * 80} L${x} ${y} L${x + dx * 80} ${y}" stroke="#e6efe8" stroke-width="6" fill="none" opacity="0.75" stroke-linecap="round"/>`;
    let g = br(50, 590, 1, 1) + br(1030, 590, -1, 1) + br(50, 1270, 1, -1) + br(1030, 1270, -1, -1);
    const on = Math.sin(t * 6) > -0.2;
    if (top) g += `<circle cx="96" cy="640" r="12" fill="#e23b2e" opacity="${on ? 0.9 : 0.2}"/><text x="118" y="651" font-family="Nunito" font-weight="800" font-size="30" fill="#e6efe8" opacity="0.85" letter-spacing="2">REC</text>`;
    if (top) g += `<text x="1000" y="651" text-anchor="end" font-family="Nunito" font-weight="800" font-size="28" fill="#e6efe8" opacity="0.75" letter-spacing="2">CAM · IR</text>`;
    g += `<path d="M540 900 L540 940 M540 980 L540 1020 M480 960 L520 960 M560 960 L600 960" stroke="#e6efe8" stroke-width="3" opacity="0.35"/>`;
    const sy = 590 + ((t * 120) % 680);
    g += `<rect x="50" y="${f1(sy)}" width="980" height="3" fill="#e6efe8" opacity="0.08"/>`;
    return g;
  }

  // the fence receding along the right (posts from near x0 to far x1): bollards, a top plate, a little glow from the other side
  function fenceRecede(x0, top0, bot0, x1, top1, bot1, n, col = '#3e3026') {
    let g = '';
    for (let i = n; i >= 0; i--) { const u = Math.pow(i / n, 0.8), x = lerp(x0, x1, u), tp = lerp(top0, top1, u), bt = lerp(bot0, bot1, u), w = lerp(30, 7, u);
      g += `<rect x="${f1(x - w / 2)}" y="${f1(tp)}" width="${f1(w)}" height="${f1(bt - tp)}" fill="${col}" stroke="${INK}" stroke-width="${f1(lerp(4, 1.5, u))}"/>`; }
    g += `<path d="M${x0 + 30} ${top0 - 6} L${x1} ${top1 - 2}" stroke="#2a221c" stroke-width="22" stroke-linecap="round"/><path d="M${x0 + 30} ${top0 - 12} L${x1} ${top1 - 4}" stroke="#5a4636" stroke-width="6" opacity="0.7"/>`;
    return g;
  }
  // an ultralight (a delta wing over a small open trike with a pusher propeller and a cargo basket); faces right
  function ultralight(x, y, s, t, drop = 1) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)}) rotate(${f1(-3 + 2 * Math.sin(t * 1.7))})">`;
    g += `<path d="M-250 -96 L220 -160 L110 -100 Z" fill="#8a7e68" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-210 -100 L180 -152" stroke="#c8b898" stroke-width="5"/>` + wash(0, -110, 260, 70, '#9ab4d0', 0.12);
    g += `<path d="M10 -120 L-30 10 M10 -120 L60 10" stroke="#3a3e44" stroke-width="7"/><path d="M-70 10 L90 10 Q110 30 70 40 L-40 40 Q-80 30 -70 10 Z" fill="#3a3e44" stroke="${INK}" stroke-width="5"/>`;
    g += `<ellipse cx="-92" cy="20" rx="8" ry="${f1(40 * Math.abs(Math.sin(t * 40)))}" fill="#8a9096" opacity="0.6"/><circle cx="-30" cy="58" r="14" fill="#1a1a1c"/><circle cx="70" cy="58" r="14" fill="#1a1a1c"/>`;
    g += `<rect x="-6" y="40" width="70" height="40" fill="none" stroke="#5a6068" stroke-width="5"/>` + (drop > 0 ? '' : '');
    g += `<circle cx="200" cy="-146" r="5" fill="#e23b2e" opacity="${Math.sin(t * 8) > 0 ? 0.9 : 0.2}"/>`;
    return g + '</g>';
  }
  // a generic sedan (side view, facing right; no badge, no plate number)
  function car(x, y, s) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="330" ry="22" fill="#000" opacity="0.35"/>` +
      `<path d="M-320 -60 L-310 -130 Q-300 -150 -260 -156 L-170 -164 L-90 -236 Q-70 -250 -30 -250 L120 -250 Q160 -250 190 -224 L260 -164 L310 -150 Q340 -140 340 -110 L340 -60 Z" fill="#5a6470" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="M-150 -168 L-80 -230 L30 -230 L30 -168 Z M50 -168 L50 -230 L120 -230 Q150 -230 170 -212 L222 -168 Z" fill="#b8d0dc" opacity="0.7" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M-300 -110 L330 -110" stroke="#4a525c" stroke-width="4"/><rect x="300" y="-136" width="40" height="18" rx="5" fill="#f4e6b0"/><rect x="-322" y="-130" width="18" height="22" rx="4" fill="#c03a2e"/>` +
      [-190, 200].map(wx => `<circle cx="${wx}" cy="-46" r="54" fill="#141516" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-46" r="24" fill="#8a9096"/>`).join('') + '</g>';
  }
  // a duffel bag
  const duffel = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-80" y="-60" width="160" height="70" rx="30" fill="#3e4a3c" stroke="${INK}" stroke-width="5"/><path d="M-40 -60 Q0 -110 40 -60" stroke="#2a2e2a" stroke-width="8" fill="none"/><path d="M-70 -30 L70 -30" stroke="#5a6a58" stroke-width="4"/></g>`;
  // a white-hot camera image of the catapult (for the monitors): black ground, white shapes
  function thermalImg(w, h, t, th, fly) {
    const cx = w * 0.4, gy = h * 0.82, s = h / 1500;
    let g = `<rect x="0" y="0" width="${w}" height="${h}" fill="#0c0e10"/><rect x="0" y="${f1(gy)}" width="${w}" height="${f1(h - gy)}" fill="#24282a"/>`;
    g += `<g>` + catapult(cx, gy, s, th).replace(/fill="#(?!000)[0-9a-fA-F]{6}"/g, 'fill="#d8dcd8"').replace(/stroke="#(?!120f0c)[0-9a-fA-F]{6}"/g, 'stroke="#e8ece8"') + '</g>';
    g += [w * 0.18, w * 0.62].map((px, i) => `<g transform="translate(${f1(px)} ${f1(gy)}) scale(${sc(s * 1.1)})"><ellipse cx="0" cy="-640" rx="46" ry="54" fill="#f4f6f4"/><rect x="-60" y="-590" width="120" height="330" rx="40" fill="#eef0ee"/><rect x="-50" y="-270" width="40" height="270" fill="#e0e4e0"/><rect x="10" y="-270" width="40" height="270" fill="#e0e4e0"/></g>`).join('');
    if (fly) { const u = (t * 0.6) % 1; g += `<rect x="${f1(lerp(cx + 60, w * 1.05, u))}" y="${f1(gy - 0.55 * h - 0.18 * h * 4 * u * (1 - u))}" width="${f1(w * 0.07)}" height="${f1(w * 0.045)}" rx="4" fill="#ffffff"/>`; }
    for (let i = 0; i < 8; i++) g += `<rect x="${f1(w * (0.8 + i * 0.03))}" y="${f1(gy - h * 0.5)}" width="${f1(w * 0.012)}" height="${f1(h * 0.5)}" fill="#3a3e3c"/>`;
    return g;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // the Mexican side of the border at night: a deep blue sky with stars, a low ridge, a faint amber glow of a town beyond
    // the fence (right), a dirt strip with tyre tracks and dry scrub; the bollard fence recedes along the right
    dc59_border(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="dcbsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070d18"/><stop offset="0.7" stop-color="#14202e"/><stop offset="1" stop-color="#26303a"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1520" fill="url(#dcbsky)"/>`;
      sky += E.cine.stars(t, 90, 5901, -200, 1050) + wash(1000, 1120, 520, 160, '#e0a060', 0.2) + `<circle cx="250" cy="1010" r="30" fill="#e8e4d4" opacity="0.8"/>` + wash(250, 1010, 130, 130, '#d8e0e8', 0.12);
      let ridge = `<path d="M-400 1180 L-200 1120 L0 1140 L200 1090 L380 1130 L560 1100 L760 1140 L940 1110 L1200 1150 L1480 1120 L1480 1240 L-400 1240 Z" fill="#141c26"/>`;
      for (let i = 0; i < 9; i++) ridge += `<circle cx="${820 + i * 34}" cy="${1158 + (i % 3) * 6}" r="3" fill="#f0c070" opacity="0.7"/>`;
      let ground = `<rect x="-400" y="1170" width="${W + 800}" height="${H}" fill="#2a2620"/><path d="M-400 1170 L1480 1170" stroke="#3a342a" stroke-width="6"/>`;
      ground += `<path d="M-300 1900 Q300 1500 700 1260 M-100 1900 Q450 1520 780 1270" stroke="#3a342c" stroke-width="22" fill="none" opacity="0.8"/>`;
      ground += E.cine.scrub(1250, 18, 5903, '#3a3a2a', 0.8, -300, 700) + E.cine.scrub(1180, 22, 5904, '#2e2e24', 0.5, -300, 760);
      const fence = fenceRecede(1110, 600, 1700, 720, 1060, 1186, 30) + wash(980, 1100, 200, 300, '#e0a060', 0.1);
      const fg = E.cine.scrub(1880, 10, 5905, '#1a1a14', 1.6, -200, 600);
      return { light: { dir: -1, rim: '#9ab4d0', key: '#b8c8dc' }, layers: [[0.05, sky], [0.2, ridge], [0.6, ground], [0.88, fence], [1.14, fg]] };
    },

    // close on the fence top at night: three big bollards on the right with a top plate, the ridge beyond, the dirt below
    dc59_close(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="dccsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060c16"/><stop offset="1" stop-color="#20303e"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1800" fill="url(#dccsky)"/>` + E.cine.stars(t, 110, 5911, -200, 1300);
      sky += `<path d="M-400 1340 L-100 1260 L200 1300 L500 1240 L800 1290 L1100 1250 L1480 1300 L1480 1420 L-400 1420 Z" fill="#121a24"/>` + wash(1000, 1320, 400, 120, '#e0a060', 0.18);
      let fence = '';
      for (let i = 0; i < 9; i++) { const x = 640 + i * 70; fence += `<rect x="${x}" y="${860 - i * 6}" width="44" height="${1300 - 860 + i * 6}" fill="#4a382a" stroke="${INK}" stroke-width="5"/><rect x="${x + 6}" y="${860 - i * 6}" width="8" height="${1300 - 860 + i * 6}" fill="#6a5040" opacity="0.6"/>`; }
      fence += `<path d="M620 848 L1300 800" stroke="#2a221c" stroke-width="34"/><path d="M620 838 L1300 790" stroke="#6a5444" stroke-width="7" opacity="0.7"/>`;
      const ground = `<rect x="-400" y="1400" width="${W + 800}" height="${H}" fill="#2c2720"/>` + E.cine.scrub(1460, 16, 5913, '#3a3a2a', 0.9, -300, 1300);
      return { light: { dir: -1, rim: '#9ab4d0', key: '#b8c8dc' }, layers: [[0.05, sky], [0.55, fence], [0.75, ground]] };
    },

    // a dim camera room: dark walls, a wall of monitors (drawn by the shot), a long desk across the front with a keyboard
    dc59_ops(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#0e151a"/><rect x="-300" y="1260" width="${W + 600}" height="${H}" fill="#151c20"/>`;
      back += `<rect x="40" y="300" width="1000" height="900" rx="10" fill="#0a0e12" stroke="#1e262c" stroke-width="8"/>` + wash(540, 760, 560, 460, '#9ab0b8', 0.12);
      for (let i = 0; i < 4; i++) back += `<rect x="${-260 + i * 520}" y="150" width="200" height="16" rx="6" fill="#3a464c" opacity="0.6"/>`;
      const desk = `<rect x="-300" y="1500" width="${W + 600}" height="40" fill="#3a4246" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1540" width="${W + 600}" height="${H}" fill="#1a2024"/>` +
        `<rect x="380" y="1470" width="300" height="34" rx="6" fill="#22282c" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${394 + i * 36}" y="1478" width="28" height="18" rx="3" fill="#3a4246"/>`).join('') +
        `<rect x="760" y="1462" width="90" height="40" rx="8" fill="#2a3034" stroke="${INK}" stroke-width="4"/><circle cx="805" cy="1482" r="8" fill="#5ad07a" opacity="${f1(0.5 + 0.4 * Math.sin(t * 3))}"/>`;
      return { light: { dir: 1, rim: '#c8dce4', key: '#b0c4cc' }, layers: [[0.2, back], [1.06, desk]] };
    },

    // a farm field on the American side at dawn: a pink-amber sky, the bollard fence across the horizon with light through
    // the gaps, a concrete canal in front of it, furrowed rows of young crops running towards us
    dc59_field(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="dcfsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e2a40"/><stop offset="0.6" stop-color="#7a6a78"/><stop offset="1" stop-color="#e8a878"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1400" fill="url(#dcfsky)"/>` + wash(260, 1020, 420, 160, '#ffd0a0', 0.35);
      sky += `<path d="M-400 1000 L-100 950 L200 980 L520 930 L860 970 L1200 940 L1480 980 L1480 1060 L-400 1060 Z" fill="#5a5060" opacity="0.8"/>`;
      let fence = `<rect x="-400" y="1020" width="${W + 800}" height="40" fill="#3a3430"/>`;
      for (let x = -380; x < W + 400; x += 26) fence += `<rect x="${x}" y="760" width="16" height="300" fill="#3e3028"/>`;
      fence += `<rect x="-400" y="748" width="${W + 800}" height="18" fill="#2a221c"/>` + wash(260, 900, 300, 160, '#ffd0a0', 0.15);
      let canal = `<rect x="-400" y="1060" width="${W + 800}" height="70" fill="#8a8478"/><rect x="-400" y="1078" width="${W + 800}" height="36" fill="#5a7080"/>` +
        `<rect x="-400" y="1086" width="${W + 800}" height="6" fill="#e8b890" opacity="${f1(0.3 + 0.1 * Math.sin(t * 2))}"/>`;
      let field = `<rect x="-400" y="1130" width="${W + 800}" height="${H}" fill="#5a4a36"/>`;
      for (let i = -12; i <= 12; i++) { const xb = 540 + i * 170, xt = 540 + i * 40;
        field += `<path d="M${xt} 1132 L${xb} 1980" stroke="#4a3c2c" stroke-width="${f1(10 + Math.abs(i) * 0.4)}"/>`;
        for (let k = 0; k < 9; k++) { const u = Math.pow(k / 9, 1.6), px = lerp(xt + 20, xb + 85, u), py = lerp(1140, 1960, u); field += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(6 + 22 * u)}" ry="${f1(3 + 11 * u)}" fill="#6a8a4a" opacity="0.85"/>`; } }
      return { light: { dir: 1, rim: '#ffcfa0', key: '#ffe0c0' }, layers: [[0.05, sky], [0.45, fence], [0.55, canal], [0.8, field]] };
    },

    // a starry desert sky over the border: a moon, the fence line along the horizon with a few floodlights, scrub below
    dc59_sky(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="dcssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050a14"/><stop offset="1" stop-color="#1c2a3a"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1700" fill="url(#dcssky)"/>` + E.cine.stars(t, 160, 5921, -200, 1300);
      sky += `<circle cx="860" cy="1180" r="40" fill="#ece6d4" opacity="0.9"/>` + wash(860, 1180, 200, 200, '#d8e0e8', 0.14);
      let line = `<path d="M-400 1380 L-100 1340 L300 1370 L700 1330 L1100 1360 L1480 1340 L1480 1420 L-400 1420 Z" fill="#121a24"/><rect x="-400" y="1370" width="${W + 800}" height="16" fill="#2a2420"/>`;
      for (let x = -360; x < W + 400; x += 14) line += `<rect x="${x}" y="1330" width="6" height="44" fill="#2a221c"/>`;
      [60, 420, 780].forEach(x => { line += `<rect x="${x}" y="1240" width="6" height="130" fill="#2a2a2a"/><circle cx="${x + 3}" cy="1240" r="7" fill="#fff0c8"/>` + wash(x + 3, 1250, 90, 70, '#ffe0a0', 0.3); });
      const ground = `<rect x="-400" y="1384" width="${W + 800}" height="${H}" fill="#1e1c18"/>` + E.cine.scrub(1450, 20, 5923, '#2e2e24', 0.9, -300, 1300) + E.cine.scrub(1720, 10, 5924, '#141410', 1.6, -300, 1300);
      return { light: { dir: -1, rim: '#9ab4d0', key: '#b8c8dc' }, layers: [[0.05, sky], [0.4, line], [0.85, ground]] };
    },

    // a border-crossing lane at dusk (generic): a flat canopy on pillars, an inspection booth with a lit window, lane lights
    // (green / red), a lowered barrier arm, painted lane lines
    dc59_lane(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="dclsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2234"/><stop offset="1" stop-color="#a87a66"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1400" fill="url(#dclsky)"/>` +
        `<path d="M-400 1080 L0 1030 L400 1060 L800 1020 L1480 1060 L1480 1120 L-400 1120 Z" fill="#3a3440"/>`;
      let canopy = `<rect x="-400" y="560" width="${W + 800}" height="90" fill="#c8c4bc" stroke="${INK}" stroke-width="6"/><rect x="-400" y="650" width="${W + 800}" height="20" fill="#7a7670"/>`;
      for (let i = 0; i < 6; i++) canopy += `<rect x="${-260 + i * 300}" y="670" width="40" height="600" fill="#9a968e" stroke="${INK}" stroke-width="4"/>`;
      for (let i = 0; i < 5; i++) { const x = -120 + i * 300, green = i === 2; canopy += `<rect x="${x}" y="676" width="80" height="54" rx="6" fill="#1a1c1e" stroke="${INK}" stroke-width="3"/><circle cx="${x + 40}" cy="703" r="16" fill="${green ? '#4ad07a' : '#e04a3a'}" opacity="0.9"/>` + wash(x + 40, 703, 50, 40, green ? '#4ad07a' : '#e04a3a', 0.25); }
      for (let i = 0; i < 8; i++) canopy += `<rect x="${-300 + i * 200}" y="648" width="120" height="10" fill="#fff4dc" opacity="0.9"/>` + wash(-240 + i * 200, 700, 120, 80, '#fff0d0', 0.18);
      let booth = `<rect x="760" y="900" width="260" height="380" fill="#b8b4ac" stroke="${INK}" stroke-width="6"/><rect x="740" y="880" width="300" height="30" fill="#8a8680" stroke="${INK}" stroke-width="5"/><rect x="790" y="960" width="200" height="140" fill="#f4e0a8" opacity="0.85" stroke="${INK}" stroke-width="5"/>` + wash(890, 1030, 200, 140, '#ffe0a0', 0.2);
      booth += `<rect x="700" y="1190" width="20" height="90" fill="#3a3a3a"/><rect x="460" y="1186" width="260" height="16" rx="6" fill="#e8e4dc" stroke="${INK}" stroke-width="3"/>` + [0, 1, 2].map(i => `<rect x="${490 + i * 80}" y="1186" width="36" height="16" fill="#d0402e"/>`).join('');
      let road = `<rect x="-400" y="1270" width="${W + 800}" height="${H}" fill="#3a3a3e"/>`;
      for (let i = 0; i < 6; i++) road += `<path d="M${-200 + i * 300} 1272 L${-500 + i * 420} 1980" stroke="#e8e0c8" stroke-width="8" stroke-dasharray="40 30" opacity="0.6"/>`;
      return { light: { dir: 1, rim: '#ffd8a8', key: '#ffe8c8' }, layers: [[0.05, sky], [0.4, canopy], [0.5, booth], [0.8, road]] };
    }
  });

  // the hero arrangement (frame 1 and the last frame): the catapult left of centre, the fence receding on the right
  const HERO = { x: 450, y: 1650, s: 0.92 };
  const heroP1 = [1240, 900];

  E.registerScenes({
    // 1 - hook (frame 1): the arm has just slammed up against the stop bar and a taped bale is in flight over the fence; a
    //     smuggler (silhouette) points after it, a second waits at the arm; the camera already pushing in. Then they haul the
    //     arm down, load a second bale and fire it on '2011'. The surveillance-camera frame sits on top.
    dc59_hook(ctx) {
      const t = ctx.t, T = ctx.T, tB = WT(ctx, 1, 1, 3.3), l2 = LS(ctx, 1, 2.4);
      const th = tt => tt < 0.95 ? fireTh(tt, -0.62) : (tt < tB - 0.3 ? lerp(290, 150, ease.inOut(seg(tt, 0.95, 2.4))) : fireTh(tt, tB));
      const p0 = cupAt(HERO.x, HERO.y, HERO.s, 280);
      return E.cine.shot(ctx, {
        set: 'dc59_border', grade: 'night', haze: 0.4,
        cam: { from: { x: 0, y: 30, z: 1.02 }, to: { x: 20, y: 40, z: 1.1 }, settle: true },
        figures: [
          { id: 'dc59_smug2', x: 150, y: 1680, scale: 0.66, dir: 1, turn: 0.3, pose: 'stand_tense', silhouette: 'cool', depth: 1.0, hat: { style: 'cap', color: '#2a2a2a' },
            keys: [{ at: 0.9, pose: 'hands_together', headTurn: 0.2, dur: 0.5 }, { at: 2.4, pose: 'present', dur: 0.5 }, { at: tB - 0.45, pose: 'stand_tense', dur: 0.35 }] },
          { id: 'dc59_smug1', x: 720, y: 1700, scale: 0.68, dir: 1, turn: 0.35, pose: 'point_up', silhouette: 'cool', depth: 1.02,
            keys: [{ at: 1.3, pose: 'stand', headTurn: -0.3, dur: 0.6 }, { at: tB + 0.05, pose: 'point_up', headTurn: 0.2, dur: 0.35 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => catapult(HERO.x, HERO.y, HERO.s, th(tt), { load: tt > 2.5 && tt < tB - 0.06 }) },
          { depth: 1.01, accent: true, svg: tt => flight(tt, -0.6, 0.95, p0, heroP1, 100, 1.05) + flight(tt, tB - 0.05, tB + 1.3, p0, heroP1, 100, 1.05) }
        ],
        overlays: [
          { type: 'svg', at: -1, svg: tt => hud(tt) },
          { type: 'label', at: Math.max(l2 + 0.1, 3.1), x: 60, y: 760, text: 'MEXICO → ARIZONA', fs: 38, sub: 'Over the border fence' }
        ],
        tag: TAG
      });
    },

    // 2 - who saw it: a dim camera room; a Guard troop types at the desk, a second stands at the monitor wall and points on
    //     'camera'; the big screen shows the white-hot catapult and a bundle flying over the fence
    dc59_cams(ctx) {
      const t = ctx.t, T = ctx.T, ng = WT(ctx, 0, 1, 0.3), cam = WT(ctx, 0, 7, 2.0);
      const wall = tt => {
        let g = '';
        const scr = (id, x, y, w, h, k, big) => `<g transform="translate(${x} ${y})"><rect x="-10" y="-10" width="${w + 20}" height="${h + 20}" rx="8" fill="#1a2024" stroke="${INK}" stroke-width="5"/><defs><clipPath id="dcscr${id}"><rect x="0" y="0" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#dcscr${id})">${big ? thermalImg(w, h, tt, fireTh(tt % 2.6, 1.3), true) : thermalImg(w, h, tt + k, 150, false)}</g></g>`;
        g += scr(0, 170, 560, 740, 460, 0, true);
        g += scr(1, 10, 560, 130, 220, 1, false) + scr(2, 10, 800, 130, 220, 2, false) + scr(3, 940, 560, 130, 220, 3, false) + scr(4, 940, 800, 130, 220, 4, false);
        g += `<text x="190" y="604" font-family="Nunito" font-weight="800" font-size="26" fill="#e6efe8" opacity="0.8" letter-spacing="2">CAM · IR · LIVE</text>`;
        return g + wash(540, 790, 420, 260, '#e6efe8', f1(0.08 + 0.06 * seg(tt, cam, cam + 0.4))); };
      return E.cine.shot(ctx, {
        set: 'dc59_ops', grade: 'cold', haze: 0.4,
        cam: { from: { x: 10, y: 30, z: 1.0 }, to: { x: -10, y: 40, z: 1.07 } },
        figures: [
          { id: 'dc59_guard1', x: 250, y: 1640, scale: 0.9, dir: 1, turn: 0.45, pose: 'sit_type', expr: 'focused', depth: 1.02,
            keys: [{ at: 0.4, pose: 'sit_type_b', dur: 0.4 }, { at: ng, pose: 'sit_type', dur: 0.4 }, { at: cam - 0.2, pose: 'sit', expr: 'shocked', gaze: [0.5, -0.4], dur: 0.4 }] },
          { id: 'dc59_guard2', x: 850, y: 1640, scale: 0.95, dir: -1, turn: 0.45, pose: 'arms_crossed', expr: 'focused', depth: 1.02,
            keys: [{ at: ng, pose: 'stand', dur: 0.5 }, { at: cam, pose: 'point', expr: 'realise', gaze: [-0.6, -0.4], dur: 0.4 }] }
        ],
        props: [{ depth: 0.9, svg: wall }],
        overlays: [
          { type: 'label', at: ng + 0.05, x: 60, y: 470, text: 'NACO, ARIZONA · JAN 2011', fs: 40, sub: 'Guard troops on Border Patrol cameras' }
        ],
        tag: TAG
      });
    },

    // 3 - the launch (the FUN FACT): close on the trailer; a smuggler (silhouette) sets a bale in the cup on 'loaded'; the
    //     arm whips up on 'flung' and the bale sails off over the fence top; he points after it
    dc59_launch(ctx) {
      const t = ctx.t, T = ctx.T, ld = 0.45, fl = WT(ctx, 0, 1, 0.9), l2 = LS(ctx, 1, 2.6);
      const C = { x: 800, y: 1880, s: 1.25 }, th = tt => fireTh(tt, fl + 0.1);
      const p0 = cupAt(C.x, C.y, C.s, 282);
      return E.cine.shot(ctx, {
        set: 'dc59_close', grade: 'night', haze: 0.4, dof: true,
        cam: { from: { x: -20, y: 30, z: 1.0 }, to: { x: 10, y: 40, z: 1.08 } },
        figures: [
          { id: 'dc59_smug2', x: 170, y: 2000, scale: 1.25, dir: 1, turn: 0.35, pose: 'present', silhouette: 'cool', depth: 1.02, hat: { style: 'cap', color: '#2a2a2a' },
            keys: [{ at: ld + 0.4, pose: 'hands_together', dur: 0.4 }, { at: fl - 0.35, pose: 'stand_tense', dur: 0.3 }, { at: fl + 0.4, pose: 'point_up', headTurn: 0.3, dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => catapult(C.x, C.y, C.s, th(tt)) },
          { depth: 1.03, accent: true, svg: tt => { if (tt < ld + 0.25) { const k = ease.out(seg(tt, 0, ld + 0.25)); return bale(lerp(380, cupAt(C.x, C.y, C.s, 150)[0], k), lerp(1330, cupAt(C.x, C.y, C.s, 150)[1], k), 1.2, -10 + 40 * k, 0.8); }
            if (tt < fl + 0.04) { const th_ = th(tt), [bx, by] = cupAt(C.x, C.y, C.s, th_); return bale(bx, by, 1.2, th_ + 90, 0.8); }
            return flight(tt, fl + 0.04, fl + 1.3, p0, [1320, 640], 150, 1.1, 300); } }
        ],
        overlays: [
          { type: 'funfact', at: l2 - 0.05, y: 640, rows: [{ text: 'IT COULD FLING ABOUT' }, { text: '4.4 LB (2 KG) PER SHOT' }, { text: 'A Mexican army officer, via AP', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 4 - the raid: wider; torch beams sweep in from the right as two soldiers (torches only) walk in along the fence; the
    //     two smugglers (silhouettes) run off to the left; the catapult is left alone in the beams
    dc59_raid(ctx) {
      const t = ctx.t, T = ctx.T, mv = WT(ctx, 0, 1, 0.5), rn = WT(ctx, 0, 6, 1.6), lf = WT(ctx, 1, 1, 2.8);
      return E.cine.shot(ctx, {
        set: 'dc59_border', grade: 'night', haze: 0.5,
        cam: { from: { x: 20, y: 10, z: 0.96 }, to: { x: -10, y: 20, z: 1.03 } },
        figures: [
          { id: 'dc59_smug1', x: 330, y: 1560, scale: 0.55, dir: -1, turn: 0.3, pose: 'stand_tense', silhouette: 'cool', depth: 0.98,
            walk: { at: rn - 0.4, dur: 1.6, cadence: 7.5, stride: 24, from: 330, to: -220 } },
          { id: 'dc59_smug2', x: 200, y: 1580, scale: 0.55, dir: -1, turn: 0.3, pose: 'stand_tense', silhouette: 'cool', depth: 0.99, hat: { style: 'cap', color: '#2a2a2a' },
            walk: { at: rn - 0.25, dur: 1.4, cadence: 7.5, stride: 24, from: 200, to: -260 } },
          { id: 'dc59_soldier1', x: 1180, y: 1640, scale: 0.6, dir: -1, turn: 0.35, pose: 'torch', expr: 'determined', depth: 1.02, hat: { style: 'cap', color: '#3a4232' }, propOpts: { beamLen: 700 },
            walk: { at: mv - 0.3, dur: 2.2, cadence: 3.6, stride: 14, from: 1180, to: 860 }, keys: [{ at: lf + 0.2, pose: 'torch_low', dur: 0.5 }] },
          { id: 'dc59_soldier2', x: 1300, y: 1600, scale: 0.57, dir: -1, turn: 0.35, pose: 'torch_low', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#3a4232' }, propOpts: { beamLen: 600 },
            walk: { at: mv, dur: 2.2, cadence: 3.6, stride: 14, from: 1300, to: 1000 } }
        ],
        props: [
          { depth: 0.99, svg: tt => catapult(560, 1520, 0.6, 290 - 4 * Math.exp(-tt)) + wash(560, 1300, 260, 260, '#fff4cf', f1(0.12 * seg(tt, lf - 0.3, lf + 0.4))) }
        ],
        overlays: [
          { type: 'label', at: lf + 0.15, x: 60, y: 760, text: 'LEFT BEHIND: A 3-YARD CATAPULT', fs: 38, sub: 'On a trailer, about 20 yards from the fence' }
        ],
        tag: TAG
      });
    },

    // 5 - THE BIGGEST REVEAL: a farm field on the American side at dawn; a border agent kneels by sealed cans in the rows;
    //     on 'cannon' a can arcs in over the fence and thuds into the field (the single impact); he rises and looks up-left
    dc59_cannon(ctx) {
      const t = ctx.t, T = ctx.T, wi = WT(ctx, 0, 5, 1.0), cn = WT(ctx, 1, 3, 3.0), cs = WT(ctx, 1, 5, 3.6);
      const cans = [[380, 1560, 0.9, 70], [470, 1610, 1.0, -20], [260, 1640, 1.05, 100], [560, 1700, 1.1, 15], [180, 1520, 0.8, -60]];
      return E.cine.shot(ctx, {
        set: 'dc59_field', grade: 'dawn', haze: 0.5,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 10, y: 40, z: 1.08 }, settle: true },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'dc59_agent', x: 760, y: 1700, scale: 0.8, dir: -1, turn: 0.4, pose: 'kneel', propOverride: null, expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#2e4636' },
            keys: [{ at: wi, pose: 'kneel', expr: 'realise', gaze: [-0.5, 0.3], dur: 0.4 }, { at: cn + 0.1, pose: 'stand_tense', expr: 'shocked', gaze: [-0.6, -0.5], dur: 0.45 }] }
        ],
        props: [
          { depth: 1.0, svg: cans.map(([x, y, s, r]) => can(x, y, s, r)).join('') },
          { depth: 1.01, svg: tt => { if (tt < cn - 0.35) return ''; const u = seg(tt, cn - 0.35, cn + 0.45); if (u >= 1) return can(640, 1590, 1.0, 80);
            const x = lerp(-80, 640, u), y = lerp(700, 1590, u) - 520 * 4 * u * (1 - u); return `<path d="M${f1(x - 90)} ${f1(y + 30)} L${f1(x - 30)} ${f1(y + 6)}" stroke="#fff4e0" stroke-width="5" opacity="0.5"/>` + can(x, y, 1.0, 720 * u); } }
        ],
        overlays: [
          { type: 'impact', at: cn, x: 540, y: 1000 },
          { type: 'label', at: cn + 0.2, x: 60, y: 760, text: 'SAN LUIS, ARIZONA · DEC 2012', fs: 38, sub: '33 cans, about 85 lb, fired with CO2' }
        ],
        tag: TAG
      });
    },

    // 6 - the statistic: the starry sky over the border; an ultralight buzzes across left to right and releases a bundle;
    //     an agent below points up; the counter to 228 with the source credit beneath
    dc59_stat(ctx) {
      const t = ctx.t, T = ctx.T, ul = WT(ctx, 0, 0, 0.3), n = WT(ctx, 0, 2, 1.3);
      const X = tt => lerp(-260, 1340, seg(tt, -0.2, T + 0.3)), Y = tt => 1060 - 40 * seg(tt, 0, T);
      const td = n + 0.5;
      return E.cine.shot(ctx, {
        set: 'dc59_sky', grade: 'night', haze: 0.4,
        cam: { from: { x: -10, y: 20, z: 1.0 }, to: { x: 10, y: 30, z: 1.06 } },
        figures: [
          { id: 'dc59_agent', x: 860, y: 1760, scale: 0.5, dir: -1, turn: 0.4, pose: 'stand', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#2e4636' },
            keys: [{ at: ul + 0.1, pose: 'point_up', gaze: [-0.4, -0.7], dur: 0.4 }] }
        ],
        props: [
          { depth: 0.9, svg: tt => ultralight(X(tt), Y(tt), 1.0, tt) },
          { depth: 0.9, accent: true, svg: tt => { if (tt < td) return bale(X(tt) + 29, Y(tt) + 60, 0.5, 0, 0.6); const u = seg(tt, td, td + 1.4), bx = X(td) + 29 + 160 * u, by = Y(td) + 60 + 520 * u * u;
            return by < 1400 ? bale(bx, by, 0.4, 200 * u, 0.7) : ''; } }
        ],
        overlays: [
          { type: 'counter', at: n - 0.1, dur: 1.4, from: 0, to: 228, prefix: '', suffix: '', label: 'ULTRALIGHT CROSSINGS IN ONE YEAR', y: 660, fs: 150 },
          { type: 'label', at: n + 0.3, x: 90, y: 830, text: 'CBP COUNT · FISCAL 2010', fs: 32, sub: 'Via AP · up from 118 the year before' }
        ],
        tag: TAG
      });
    },

    // 7 - the LESSON (save trigger, for the viewer): a young man at a border-crossing lane beside his car, a bag at his
    //     feet; he picks it up and checks it; the checklist card with the SAVE ribbon (captions off)
    dc59_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 2, 1.0);
      return E.cine.shot(ctx, {
        set: 'dc59_lane', grade: 'warm', haze: 0.5, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'dc59_viewer', x: 300, y: 1720, scale: 0.95, dir: 1, turn: 0.35, pose: 'stand', expr: 'neutral', depth: 1.02,
            keys: [{ at: 0.3, pose: 'examine', expr: 'focused', dur: 0.5 }, { at: sv + 0.4, pose: 'hand_to_face', expr: 'worried', dur: 0.6 }] }
        ],
        props: [
          { depth: 0.98, svg: car(760, 1640, 0.95) },
          { depth: 1.03, svg: duffel(470, 1730, 0.9) }
        ],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 430, rows: [{ text: 'CARRY NOTHING FOR ANYONE', fs: 42 }, { text: 'KNOW WHAT IS IN YOUR BAGS', fs: 42 }, { text: 'DECLARE CASH OVER $10,000', fs: 42 }, { text: 'Smartraveller (Australia) · USA.gov · CBP', fs: 24, colour: '#c9b89a' }] }
        ],
        tag: TAG
      });
    },

    // 8 - the outcome on the hero catapult in frame 1's framing (the loop): abandoned, the arm still up; a soldier's torch
    //     beam finds it; the seizure label at the top until the burned-in end question takes over (last 3.6 s)
    dc59_end(ctx) {
      const t = ctx.t, T = ctx.T, aw = WT(ctx, 0, 3, 0.8);
      return E.cine.shot(ctx, {
        set: 'dc59_border', grade: 'night', haze: 0.4,
        cam: { from: { x: 0, y: 30, z: 1.03 }, to: { x: 20, y: 40, z: 1.12 }, settle: true },
        figures: [
          { id: 'dc59_soldier1', x: 830, y: 1710, scale: 0.68, dir: -1, turn: 0.35, pose: 'torch', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#3a4232' }, propOpts: { beamLen: 760 },
            keys: [{ at: aw, pose: 'torch_low', dur: 0.6 }, { at: Math.max(aw + 1.0, T - 2.4), pose: 'torch', dur: 0.8 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => catapult(HERO.x, HERO.y, HERO.s, 290, { load: true }) + wash(HERO.x, HERO.y - 600, 300, 340, '#fff4cf', 0.1) }
        ],
        overlays: [
          { type: 'svg', at: -1, svg: tt => hud(tt, tt < T - 3.75) },
          { type: 'label', at: aw, x: 60, y: 1190, text: 'SEIZED: CATAPULT, SUV, WEED', fs: 40, sub: 'About 45 lb (AP: 35) · no arrests reported' }
        ],
        tag: TAG
      });
    }
  });
})();
