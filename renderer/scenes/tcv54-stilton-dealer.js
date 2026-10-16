/* Case File 54 (premium look, engagement + shares + smoothness + hooks rules): Carl Stewart of Liverpool, UK, an EncroChat
   user ("Toffeeforce") identified from the palm and fingerprints in a photo of a block of Stilton he shared; the network had
   been cracked by a French-Dutch joint team in 2020 (UK: Operation Venetic); sentenced to 13 years 6 months in May 2021.
   Structure: frame 1 = the HERO OBJECT (a block of blue Stilton held up in a palm, a phone camera's focus square snapping
   onto the index fingertip, whose print glows), the hand already rising and the camera already pushing in; a wet terraced
   street at night (his silhouette walks left to right, phone glowing); a police cyber room (the padlock on the screen
   springs open on 'cracked'); an exhibits store (the £54 million counter); his kitchen at night (the FUN FACT, then the
   photo: shutter flash); a fingerprint lab (the biggest reveal: the match lines draw in; the single impact); a young man at
   his table at night (the LESSON checklist, captions off); the outcome on the hero object in frame 1's framing with the
   burned-in end question.
   Smoothness (owner, 44+): cuts and dissolves, one push, one zoom (the end); one slow camera move per shot; settle only on
   the hero dolly-ins (first and last frames, the lab); one impact, no shake, no handheld.
   Screen direction: Stewart always faces / walks left to right.
   Look: episode.look = 'premium' with one cool night palette (shadow #131c24, mid #cfc2a8, accent #5fb0d6). The ONLY strongly
   coloured object is the Stilton (its blue veins) and the glowing fingerprint (props marked accent: true).
   Content rules: no drugs (plain packages only), no weapon, no violence. Stewart appears ONLY as a faceless rim-lit silhouette
   (NOT A LIKENESS); the big hand is a generic illustrated hand. Investigators, the exhibits officer, the analyst and the young
   man are generic figures; no badge, insignia, logo or real packaging (the wrapper is plain); no banknote is imitated.
   New environments (E.registerSets): sd54_flat (a small kitchen at night, rain on the window, terraced roofs outside),
   sd54_street (a wet terraced street at night, side view), sd54_store (a police exhibits store). Plus the engine's
   task_force, lab and kitchen_night. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#15120f';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#5fb0d6';
  const SKIN = '#d9ae8e', SKIN_D = '#b48768', SKIN_L = '#ecc8aa', SLEEVE = '#2a2f36';

  // ---------- THE HERO: a block of blue Stilton (a cut face with blue veins, a crusty rind on top and side, a plain clear
  // wrapper with a blank label). Bottom-centre of the front face at (x, y); the front face is 320 x 170 at s = 1.
  function stilton(x, y, s, o = {}) {
    const gl = o.glow ?? 0.5, r = R(5401);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    if (gl > 0) g += wash(20, -110, 300, 200, ACC, f1(0.16 * gl));
    // top (rind) and side (rind) faces
    g += `<path d="M-160 -170 L160 -170 L212 -214 L-108 -214 Z" fill="#b8a27a" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M160 0 L212 -44 L212 -214 L160 -170 Z" fill="#9c8662" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    for (let i = 0; i < 26; i++) { const u = r(), v = r(); g += `<circle cx="${f1(-150 + u * 300 + v * 50)}" cy="${f1(-174 - v * 36)}" r="${f1(3 + r() * 4)}" fill="#8a7454" opacity="0.7"/>`; }
    for (let i = 0; i < 14; i++) { const v = r(); g += `<circle cx="${f1(166 + v * 42)}" cy="${f1(-20 - r() * 170 - v * 30)}" r="${f1(3 + r() * 4)}" fill="#7a6648" opacity="0.7"/>`; }
    // the cut face: creamy paste with blue-green veins (the accent) and a few small holes
    g += `<rect x="-160" y="-170" width="320" height="170" fill="#efe5c6" stroke="${INK}" stroke-width="6"/>`;
    g += `<rect x="-160" y="-170" width="320" height="14" fill="#a8916a" opacity="0.85"/>`;
    const vein = (x0, y0, n, seed) => { const q = R(seed); let d = `M${x0} ${y0}`, px = x0, py = y0; for (let i = 0; i < n; i++) { px += 14 + q() * 26; py += (q() - 0.5) * 34; py = clamp(py, -150, -14); d += ` L${f1(px)} ${f1(py)}`; } return d; };
    [[-150, -120, 7, 11], [-130, -60, 9, 12], [-60, -140, 6, 13], [-20, -40, 7, 14], [30, -100, 6, 15], [-150, -30, 5, 16]].forEach(([a, b, n, sd]) => {
      g += `<path d="${vein(a, b, n, sd)}" stroke="#4f7f98" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>` +
        `<path d="${vein(a, b, n, sd)}" stroke="${ACC}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`; });
    for (let i = 0; i < 12; i++) g += `<ellipse cx="${f1(-140 + r() * 280)}" cy="${f1(-150 + r() * 130)}" rx="${f1(4 + r() * 6)}" ry="${f1(3 + r() * 4)}" fill="#c8b98e" opacity="0.8"/>`;
    // the plain clear wrapper: a sheen and a blank label strip (no logo, no text)
    g += `<path d="M-150 -160 L-60 -160 L-150 -40 Z" fill="#fff" opacity="0.16"/><path d="M60 -10 L150 -110 L150 -60 L100 -10 Z" fill="#fff" opacity="0.1"/>`;
    g += `<rect x="40" y="-62" width="100" height="40" rx="4" fill="#f6f2ea" stroke="${INK}" stroke-width="3" opacity="0.92"/><rect x="52" y="-50" width="60" height="6" fill="#b8b0a0"/><rect x="52" y="-38" width="44" height="6" fill="#b8b0a0"/>`;
    return g + '</g>';
  }
  // a fingerprint (a loop pattern): concentric open arcs inside a pad ellipse, centre (cx, cy), radius rr, rotation rot
  function swirl(cx, cy, rr, rot, col, op, sw = 3) {
    let g = `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(rot)})" opacity="${f1(op)}">`;
    for (let k = 1; k <= 6; k++) { const a = rr * k / 6.4, b = a * 1.25;
      g += `<path d="M${f1(-a)} ${f1(b * 0.55)} L${f1(-a)} 0 A${f1(a)} ${f1(b)} 0 0 1 ${f1(a)} 0 L${f1(a)} ${f1(b * 0.55)}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"/>`; }
    return g + `<path d="M0 ${f1(-rr * 0.08)} L0 ${f1(rr * 0.5)}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"/></g>`;
  }
  // the hand holding the block, palm up, fingers fanning out to the left with their pads (and prints) towards us, the thumb
  // crossing the front face, the forearm and a dark sleeve running off to the lower right. Returns [behind, front].
  // Same local frame as stilton(); o.glow 0..1 = the index print glows; o.flex = a small finger flex.
  function hand(x, y, s, t, o = {}) {
    const fl = o.flex ?? 0, gl = o.glow ?? 0;
    const T = `translate(${f1(x)} ${f1(y)}) scale(${sc(s)})`;
    let b = `<g transform="${T}">`;
    // forearm + sleeve
    b += `<path d="M120 10 L230 -30 L640 420 L470 560 Z" fill="${SKIN}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    b += `<path d="M330 150 L420 80 L760 420 L560 640 Z" fill="${SLEEVE}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M330 150 L420 80" stroke="#4a525c" stroke-width="10"/>`;
    // palm
    b += `<path d="M-175 -6 Q-170 -40 -100 -36 L150 -30 Q240 -20 230 40 Q210 110 80 112 L-120 96 Q-185 80 -175 -6 Z" fill="${SKIN}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    b += `<path d="M-120 60 Q0 90 140 60" stroke="${SKIN_D}" stroke-width="5" fill="none" opacity="0.7"/>`;
    // four fingers fanning left; pads lighter with a print each (index brightest)
    const F = [[-150, -26, -330, -96, 50], [-160, 6, -350, -10, 48], [-158, 38, -340, 74, 44], [-146, 70, -300, 146, 38]];
    let pads = '';
    F.forEach(([bx, by, tx, ty, w], i) => {
      const f = 1 + 0.04 * Math.sin(t * 2.2 + i) * (1 + fl), ex = bx + (tx - bx) * f, ey = by + (ty - by) * f, mx = (bx + ex) / 2 - 8, my = (by + ey) / 2 - 18;
      b += `<path d="M${bx} ${by} Q${f1(mx)} ${f1(my)} ${f1(ex)} ${f1(ey)}" stroke="${INK}" stroke-width="${w + 12}" stroke-linecap="round" fill="none"/><path d="M${bx} ${by} Q${f1(mx)} ${f1(my)} ${f1(ex)} ${f1(ey)}" stroke="${SKIN}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
      // knuckle creases
      const kx = bx + (ex - bx) * 0.55, ky = by + (ey - by) * 0.55 - 6;
      b += `<path d="M${f1(kx - 4)} ${f1(ky - w * 0.36)} Q${f1(kx + 6)} ${f1(ky)} ${f1(kx - 4)} ${f1(ky + w * 0.36)}" stroke="${SKIN_D}" stroke-width="4" fill="none"/>`;
      const ang = Math.atan2(ey - by, ex - bx) * 180 / Math.PI, px = ex - (ex - bx) * 0.06, py = ey - (ey - by) * 0.06;
      pads += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(w * 0.46)}" ry="${f1(w * 0.4)}" fill="${SKIN_L}" transform="rotate(${f1(ang)} ${f1(px)} ${f1(py)})"/>`;
      if (i === 0) { if (gl > 0) pads += wash(px, py, 90, 90, ACC, f1(0.55 * gl)); pads += swirl(px, py, w * 0.5, ang + 90, gl > 0 ? ACC : SKIN_D, 0.55 + 0.45 * gl, gl > 0 ? 4 : 3); }
      else pads += swirl(px, py, w * 0.46, ang + 90, SKIN_D, 0.55, 2.5);
    });
    b += pads + '</g>';
    // the thumb across the front face (nail side towards us)
    let fr = `<g transform="${T}"><path d="M120 96 Q60 40 0 -40" stroke="${INK}" stroke-width="66" stroke-linecap="round" fill="none"/><path d="M120 96 Q60 40 0 -40" stroke="${SKIN}" stroke-width="54" stroke-linecap="round" fill="none"/>` +
      `<ellipse cx="6" cy="-30" rx="17" ry="22" fill="#e9c6b0" stroke="${SKIN_D}" stroke-width="3" transform="rotate(-38 6 -30)"/><path d="M70 36 Q86 30 92 44" stroke="${SKIN_D}" stroke-width="4" fill="none"/></g>`;
    return [b, fr];
  }
  // the hero arrangement (frame 1 and the last frame): the hand rises into frame and tilts the block gently; where the index
  // print sits on screen (for the focus square) is returned by heroTip()
  const HERO = { x: 630, y: 1120, s: 1.3 };
  const heroPose = (tt, rise) => ({ y: HERO.y + 70 * (1 - ease.out(clamp(rise, 0, 1))) + 6 * Math.sin(tt * 1.7), rot: -3 + 2 * Math.sin(tt * 0.9) });
  function heroSvg(tt, rise, glow) {
    const p = heroPose(tt, rise); const [b, fr] = hand(0, 0, 1, tt, { glow });
    return `<g transform="translate(${HERO.x} ${f1(p.y)}) rotate(${f1(p.rot)}) scale(${sc(HERO.s)})">${b}${stilton(0, 0, 1, { glow: 0.4 + 0.6 * glow })}${fr}</g>`;
  }
  // screen position of the index print (local tip ~(-318, -88) in the hand frame)
  const heroTip = (tt, rise) => { const p = heroPose(tt, rise), a = p.rot * Math.PI / 180, lx = -318 * HERO.s, ly = -88 * HERO.s;
    return [HERO.x + lx * Math.cos(a) - ly * Math.sin(a), p.y + lx * Math.sin(a) + ly * Math.cos(a)]; };
  // a phone camera's viewfinder: corner brackets, a focus square that shrinks onto (fx, fy) over [a, a + 0.5], and a dot
  function viewfinder(fx, fy, tt, a) {
    const k = ease.out(seg(tt, a, a + 0.55)), sz = lerp(300, 120, k), cx = lerp(540, fx, k), cy = lerp(1060, fy, k);
    const br = (x, y, dx, dy) => `<path d="M${x} ${y + dy * 70} L${x} ${y} L${x + dx * 70} ${y}" stroke="#f2f4f6" stroke-width="7" fill="none" opacity="0.8" stroke-linecap="round"/>`;
    let g = br(70, 640, 1, 1) + br(1010, 640, -1, 1) + br(70, 1560, 1, -1) + br(1010, 1560, -1, -1);
    const h = sz / 2, q = sz * 0.26, col = k >= 1 ? '#f4d35e' : '#f2f4f6';
    g += [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => `<path d="M${f1(cx + sx * h)} ${f1(cy + sy * (h - q))} L${f1(cx + sx * h)} ${f1(cy + sy * h)} L${f1(cx + sx * (h - q))} ${f1(cy + sy * h)}" stroke="${col}" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('');
    g += `<circle cx="540" cy="1500" r="${f1(14 + 2 * Math.sin(tt * 6))}" fill="#f2f4f6" opacity="0.5"/>`;
    return g;
  }

  // a plain banded bundle (no banknote is imitated): a pale stack with a paper band
  const bundle = (x, y, s, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${sc(s)})"><rect x="-90" y="-34" width="180" height="40" rx="4" fill="#aab49a" stroke="${INK}" stroke-width="4"/><rect x="-90" y="-40" width="180" height="12" rx="3" fill="#c4ccb2" stroke="${INK}" stroke-width="3"/><rect x="-18" y="-42" width="36" height="50" fill="#e8dcb4" stroke="${INK}" stroke-width="3"/></g>`;
  // a sealed evidence bag (plain, a red seal strip and a blank tag)
  const evBag = (x, y, s, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${sc(s)})"><rect x="-70" y="-90" width="140" height="180" rx="8" fill="#d8dde0" opacity="0.55" stroke="${INK}" stroke-width="4"/><rect x="-70" y="-90" width="140" height="18" fill="#b8322a" opacity="0.85"/><rect x="-50" y="-50" width="100" height="60" rx="4" fill="#efe9dc" stroke="${INK}" stroke-width="3"/><rect x="-38" y="-36" width="70" height="6" fill="#9a948a"/><rect x="-38" y="-22" width="50" height="6" fill="#9a948a"/></g>`;
  // a generic phone held up (screen lit); o.flash 0..1 = the camera flash
  const phoneSvg = (x, y, s, rot, glow, flash = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${sc(s)})"><rect x="-38" y="-70" width="76" height="140" rx="12" fill="#101214" stroke="${INK}" stroke-width="4"/><rect x="-31" y="-60" width="62" height="118" rx="6" fill="#bfe2f0" opacity="${f1(glow)}"/>` +
    (flash > 0 ? wash(0, -40, 160, 160, '#ffffff', f1(0.9 * flash)) : '') + '</g>' + wash(x, y, 120, 120, '#bfe2f0', f1(0.25 * glow));

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a small kitchen at night: a rain-streaked window (left) onto terraced roofs and chimneys under a sodium-orange sky, a
    // tiled splashback, wall cupboards, a fridge (right) with a cool light leaking from its door, the counter across the front
    sd54_flat(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#1c262c"/>`;
      // the window
      back += `<defs><linearGradient id="sdfsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16202c"/><stop offset="1" stop-color="#6a4a36"/></linearGradient><clipPath id="sdfwin"><rect x="40" y="260" width="440" height="520"/></clipPath></defs>`;
      let win = `<rect x="40" y="260" width="440" height="520" fill="url(#sdfsky)"/>`;
      for (let i = 0; i < 7; i++) { const x = 20 + i * 72, hh = 60 + (i % 3) * 22; win += `<path d="M${x} 780 L${x} ${700 - hh} L${x + 36} ${670 - hh} L${x + 72} ${700 - hh} L${x + 72} 780 Z" fill="#141a20"/><rect x="${x + 44}" y="${640 - hh}" width="14" height="40" fill="#141a20"/>`;
        if (i % 2) win += `<rect x="${x + 18}" y="${724 - hh}" width="18" height="22" fill="#e8b46a" opacity="0.7"/>`; }
      win += wash(380, 640, 160, 120, '#f0a050', 0.4) + `<g clip-path="url(#sdfwin)">${E.cine.rain(t, [40, 260, 440, 520], 46, 541, 0.5)}</g>`;
      win += `<rect x="40" y="260" width="440" height="520" fill="none" stroke="#0e1216" stroke-width="18"/><path d="M260 260 L260 780 M40 520 L480 520" stroke="#0e1216" stroke-width="12"/><rect x="20" y="776" width="480" height="22" fill="#2e383e"/>`;
      // cupboards and splashback
      let mid = `<rect x="540" y="200" width="300" height="320" fill="#2a3640" stroke="${INK}" stroke-width="5"/><path d="M690 200 L690 520" stroke="${INK}" stroke-width="5"/><rect x="664" y="440" width="10" height="40" fill="#8a949a"/><rect x="706" y="440" width="10" height="40" fill="#8a949a"/>`;
      for (let yy = 900; yy < 1250; yy += 56) for (let xx = -300; xx < W + 300; xx += 80) mid += `<rect x="${xx}" y="${yy}" width="78" height="54" fill="#28343a" stroke="#1e282e" stroke-width="3"/>`;
      // the fridge, door ajar: a cool light spill
      mid += `<rect x="880" y="380" width="320" height="880" rx="14" fill="#cfd4d6" stroke="${INK}" stroke-width="6"/><path d="M880 760 L1200 760" stroke="${INK}" stroke-width="5"/><rect x="900" y="640" width="12" height="90" fill="#8a949a"/>` +
        `<path d="M880 400 L860 420 L860 1240 L880 1250 Z" fill="#e8f4fa" opacity="0.6"/>` + wash(840, 900, 160, 420, '#cfeaf6', 0.22);
      // the counter (foreground)
      const counter = `<rect x="-300" y="1250" width="${W + 600}" height="34" fill="#5a5048" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1284" width="${W + 600}" height="${H}" fill="#232a30"/>` +
        [0, 1, 2, 3].map(i => `<rect x="${-200 + i * 380}" y="1320" width="340" height="560" fill="none" stroke="#161c20" stroke-width="5"/><rect x="${-60 + i * 380}" y="1350" width="60" height="10" rx="4" fill="#8a949a"/>`).join('');
      return { light: { dir: 1, rim: '#f0b070', key: '#d8ecf6' }, layers: [[0.1, back], [0.2, win], [0.4, mid], [1.06, counter]] };
    },

    // a wet terraced street at night, side view: an orange-lit cloudy sky, a row of red-brick terraced houses (doors,
    // sash windows, chimney pots), a streetlamp, the pavement and a rain-slicked road with reflections
    sd54_street(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="sdssk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121a24"/><stop offset="1" stop-color="#4a3a36"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1300" fill="url(#sdssk)"/>` + wash(800, 700, 600, 220, '#e0904a', 0.18);
      let row = '';
      for (let i = 0; i < 8; i++) { const x = -340 + i * 240;
        row += `<rect x="${x}" y="560" width="240" height="680" fill="#5a3a30" stroke="${INK}" stroke-width="4"/>`;
        for (let yy = 590; yy < 1230; yy += 36) row += `<path d="M${x} ${yy} L${x + 240} ${yy}" stroke="#4a2e26" stroke-width="3"/>`;
        row += `<path d="M${x - 10} 560 L${x + 120} 470 L${x + 250} 560 Z" fill="#262a30" stroke="${INK}" stroke-width="4"/><rect x="${x + 170}" y="440" width="34" height="70" fill="#4a2e26" stroke="${INK}" stroke-width="3"/><rect x="${x + 172}" y="428" width="12" height="16" fill="#8a5a3a"/><rect x="${x + 188}" y="428" width="12" height="16" fill="#8a5a3a"/>`;
        const lit = (i * 5) % 3 !== 0;
        row += `<rect x="${x + 30}" y="640" width="90" height="150" fill="${lit ? '#e8b46a' : '#1a2028'}" opacity="${lit ? 0.75 : 1}" stroke="#e8e0d0" stroke-width="6"/><path d="M${x + 75} 640 L${x + 75} 790 M${x + 30} 715 L${x + 120} 715" stroke="#e8e0d0" stroke-width="4"/>`;
        row += `<rect x="${x + 30}" y="880" width="90" height="150" fill="${(i % 3) ? '#1a2028' : '#d8a060'}" opacity="0.85" stroke="#e8e0d0" stroke-width="6"/>`;
        row += `<rect x="${x + 150}" y="1010" width="66" height="230" fill="${['#2a3a4a', '#4a2a2a', '#2a3a2e'][i % 3]}" stroke="${INK}" stroke-width="4"/><rect x="${x + 158}" y="1020" width="50" height="40" fill="#e8c88a" opacity="0.5"/><circle cx="${x + 202}" cy="1130" r="4" fill="#c8b070"/>`;
        row += `<rect x="${x}" y="1232" width="240" height="14" fill="#8a7a6a"/>`; }
      // the streetlamp
      let lamp = `<rect x="742" y="560" width="14" height="700" fill="#22262a"/><path d="M749 570 Q760 520 820 520 L850 520" stroke="#22262a" stroke-width="12" fill="none"/><path d="M826 512 L878 512 L868 540 L836 540 Z" fill="#2a2e32"/><ellipse cx="852" cy="544" rx="20" ry="8" fill="#ffd28a"/>` +
        wash(852, 560, 260, 240, '#f0a050', 0.32) + `<path d="M852 548 L1080 1300 L620 1300 Z" fill="#f0a050" opacity="0.07"/>`;
      // the pavement and the road with wet reflections
      let ground = `<rect x="-400" y="1246" width="${W + 800}" height="140" fill="#3a3a3e"/>`;
      for (let i = 0; i < 12; i++) ground += `<path d="M${-380 + i * 130} 1246 L${-400 + i * 130} 1386" stroke="#2a2a2e" stroke-width="3"/>`;
      ground += `<rect x="-400" y="1386" width="${W + 800}" height="18" fill="#6a6a66"/><rect x="-400" y="1404" width="${W + 800}" height="${H}" fill="#18191d"/>`;
      ground += `<rect x="830" y="1410" width="44" height="400" fill="#f0a050" opacity="${f1(0.18 + 0.05 * Math.sin(t * 3))}"/>`;
      for (let i = 0; i < 8; i++) { const x = -340 + i * 240 + 75; if ((i * 5) % 3 !== 0) ground += `<rect x="${x - 30}" y="1420" width="60" height="${f1(220 + 30 * Math.sin(t * 2 + i))}" fill="#e8b46a" opacity="0.1"/>`; }
      ground += E.cine.rain(t, [-300, 300, W + 600, 1300], 90, 543, 0.32);
      return { light: { dir: 1, rim: '#f0b070', key: '#ffd8a8' }, layers: [[0.05, sky], [0.3, row], [0.5, lamp], [0.95, ground]] };
    },

    // a police exhibits store (generic): cool fluorescent light, metal shelving with plain boxes and sealed bags, a long
    // logging table across the front
    sd54_store(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), fl = 0.94 + 0.06 * Math.sin(t * 17) * Math.sin(t * 2.3);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#29343a"/><rect x="-300" y="1180" width="${W + 600}" height="${H}" fill="#3a4246"/>`;
      let shelves = '';
      for (let u = 0; u < 3; u++) { const x0 = -220 + u * 470;
        shelves += `<rect x="${x0}" y="300" width="14" height="900" fill="#6a747a"/><rect x="${x0 + 400}" y="300" width="14" height="900" fill="#6a747a"/>`;
        for (let k = 0; k < 4; k++) { const y = 480 + k * 220; shelves += `<rect x="${x0}" y="${y}" width="414" height="12" fill="#7a8488"/>`;
          const r = R(5440 + u * 10 + k); let xx = x0 + 20;
          while (xx < x0 + 380) { const w = 60 + r() * 70, h = 60 + r() * 90; shelves += r() < 0.6 ? `<rect x="${f1(xx)}" y="${f1(y - h)}" width="${f1(w)}" height="${f1(h)}" fill="${r() < 0.5 ? '#9a8462' : '#8a765a'}" stroke="${INK}" stroke-width="3"/><rect x="${f1(xx + 8)}" y="${f1(y - h + 10)}" width="${f1(w * 0.5)}" height="14" fill="#efe9dc"/>`
            : `<rect x="${f1(xx)}" y="${f1(y - h)}" width="${f1(w)}" height="${f1(h)}" rx="6" fill="#d8dde0" opacity="0.5" stroke="${INK}" stroke-width="3"/><rect x="${f1(xx)}" y="${f1(y - h)}" width="${f1(w)}" height="10" fill="#b8322a" opacity="0.8"/>`; xx += w + 10; } } }
      let lights = [180, 540, 900].map(x => `<rect x="${x - 130}" y="150" width="260" height="22" rx="8" fill="#eaf6fa" opacity="${f1(fl)}"/>` + wash(x, 170, 260, 90, '#d8f0fa', f1(0.35 * fl))).join('');
      const table = `<rect x="-300" y="1240" width="${W + 600}" height="40" fill="#8a9296" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1280" width="${W + 600}" height="${H}" fill="#20272b"/>`;
      return { light: { dir: -1, rim: '#d8f0fa', key: '#e8f4fa' }, layers: [[0.1, back], [0.3, shelves], [0.35, lights], [1.06, table]], dust: true };
    }
  });

  E.registerScenes({
    // 1 - hook (frame 1): the Stilton held up in a palm, big and centred; the hand is already rising, the camera already
    //     pushing in (the engine eases the first shot out from full speed), the focus square snapping onto the index
    //     fingertip and its print beginning to glow. The headline is burned in at the top until ~3 s.
    sd54_hook(ctx) {
      const t = ctx.t, T = ctx.T, ys = WT(ctx, 0, 6, 1.6), face = WT(ctx, 1, 1, 3.0);
      const glow = tt => 0.35 + 0.65 * ease.out(seg(tt, 0.3, 0.9));
      return E.cine.shot(ctx, {
        set: 'sd54_flat', grade: 'cold', dof: true, haze: 0.4,
        cam: { from: { x: 0, y: 30, z: 1.03 }, to: { x: 10, y: 50, z: 1.13 }, settle: true },
        figures: [
          { id: 'sd54_stewart', x: 990, y: 2160, scale: 1.36, dir: -1, turn: 0.4, pose: 'present', silhouette: 'cool', depth: 1.0,
            keys: [{ at: 0.0, pose: 'present', headTurn: 0.1, dur: 0.6 }, { at: ys, pose: 'present', headTurn: 0.35, dur: 0.6 }, { at: face, pose: 'examine', dur: 0.7 }] }
        ],
        props: [
          { depth: 1.1, accent: true, svg: tt => heroSvg(tt, tt / 0.9, glow(tt)) },
          { depth: 1.1, svg: tt => { const [fx_, fy_] = heroTip(tt, tt / 0.9); return viewfinder(fx_, fy_, tt, 0.0); } }
        ],
        overlays: [
          { type: 'label', at: Math.max(face + 0.2, 3.15), x: 60, y: 470, text: 'NO FACE IN THE PHOTO', fs: 40, sub: 'Just a hand and a block of Stilton' }
        ],
        tag: LIKE
      });
    },

    // 2 - who: a wet terraced street at night; his silhouette walks left to right on the pavement, phone glowing in his hands
    sd54_dealer(ctx) {
      const t = ctx.t, T = ctx.T, lv = WT(ctx, 0, 3, 0.6), enc = WT(ctx, 1, 2, 2.4);
      const X = tt => lerp(140, 560, seg(tt, 0.0, T + 0.6));
      return E.cine.shot(ctx, {
        set: 'sd54_street', grade: 'night', haze: 0.5,
        cam: { from: { x: -30, y: 30, z: 1.0 }, to: { x: 20, y: 40, z: 1.07 } },
        figures: [
          { id: 'sd54_stewart', x: 140, y: 1640, scale: 0.78, dir: 1, turn: 0.4, pose: 'walk', silhouette: 'warm', depth: 1.0,
            walk: { at: 0.0, dur: T + 0.6, cadence: 4.4, stride: 16, from: 140, to: 560 },
            keys: [{ at: enc - 0.3, pose: 'hands_together', headTurn: 0.2, dur: 0.5 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => { const on = seg(tt, enc - 0.3, enc + 0.1); return on > 0 ? phoneSvg(X(tt) + 70, 1640 - 0.78 * 560, 0.5, -12, 0.9 * on) : ''; } }
        ],
        overlays: [
          { type: 'label', at: lv + 0.05, x: 60, y: 470, text: 'LIVERPOOL, UK', fs: 40, sub: 'Handle on EncroChat: "Toffeeforce"' }
        ],
        tag: LIKE
      });
    },

    // 3 - the turn: a police cyber room at night; an investigator types, another stands; on the big screen the chat bubbles
    //     scroll and the padlock springs open on 'cracked' (the LIKE beat: a hit and a held pause)
    sd54_cracked(ctx) {
      const t = ctx.t, T = ctx.T, fr = WT(ctx, 0, 1, 0.3), ck = WT(ctx, 0, 6, 1.9);
      const screen = tt => { const op = ease.out(seg(tt, ck - 0.1, ck + 0.35));
        let g = `<g transform="translate(540 1150)"><rect x="-300" y="-400" width="600" height="380" rx="14" fill="#0c1218" stroke="${INK}" stroke-width="8"/><rect x="-280" y="-380" width="560" height="340" rx="6" fill="#142230"/><rect x="-30" y="-20" width="60" height="30" fill="#1c2228"/><rect x="-90" y="8" width="180" height="14" rx="5" fill="#1c2228"/>`;
        for (let i = 0; i < 6; i++) { const y = -360 + ((i * 60 + tt * 40) % 330), left = i % 2 === 0; g += `<rect x="${left ? -260 : 20}" y="${f1(y)}" width="240" height="40" rx="14" fill="${left ? '#2a3e50' : '#24465a'}" opacity="${f1(0.4 + 0.6 * op)}"/><rect x="${left ? -244 : 36}" y="${f1(y + 14)}" width="${120 + (i * 37) % 90}" height="10" rx="5" fill="#8fb6c8" opacity="${f1(0.25 + 0.55 * op)}"/>`; }
        // the padlock: shackle lifts and swings open
        const lift = 26 * op, sw = -32 * op;
        g += `<g transform="translate(0 -200)">` + wash(0, 0, 160, 140, ACC, f1(0.15 + 0.35 * op)) + `<g transform="translate(-34 ${f1(-40 - lift)}) rotate(${f1(sw)} 0 0)"><path d="M0 0 L0 -40 A34 34 0 0 1 68 -40 L68 0" fill="none" stroke="${op > 0.5 ? ACC : '#9ab0bc'}" stroke-width="14"/></g>` +
          `<rect x="-58" y="-44" width="116" height="96" rx="14" fill="${op > 0.5 ? ACC : '#6a8494'}" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="-6" r="12" fill="${INK}"/><rect x="-5" y="-4" width="10" height="28" fill="${INK}"/></g>`;
        return g + '</g>'; };
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: { rain: true }, grade: 'cold', haze: 0.5,
        cam: { from: { x: 20, y: 30, z: 1.0 }, to: { x: -10, y: 40, z: 1.07 } },
        figures: [
          { id: 'sd54_cyber1', x: 210, y: 1500, scale: 0.8, dir: 1, turn: 0.45, pose: 'sit_type', noChair: true, expr: 'focused', depth: 1.02,
            keys: [{ at: 0.4, pose: 'sit_type_b', dur: 0.4 }, { at: 0.9, pose: 'sit_type', dur: 0.4 }, { at: ck, pose: 'sit', expr: 'realise', gaze: [0.6, -0.3], dur: 0.4 }] },
          { id: 'sd54_cyber2', x: 880, y: 1560, scale: 0.84, dir: -1, turn: 0.45, pose: 'arms_crossed', expr: 'focused', depth: 1.02,
            keys: [{ at: fr, pose: 'stand', dur: 0.5 }, { at: ck, pose: 'point', expr: 'determined', gaze: [-0.6, -0.3], dur: 0.4 }] }
        ],
        props: [{ depth: 1.04, accent: true, svg: screen }],
        overlays: [
          { type: 'label', at: fr + 0.05, x: 60, y: 470, text: 'FRENCH-DUTCH POLICE TEAM', fs: 40, sub: 'With Europol, 2020 · UK side: Operation Venetic' }
        ],
        tag: TAG
      });
    },

    // 4 - the statistic: a police exhibits store; an officer sets down a plain banded bundle on a growing stack; the counter
    //     to £54 million with the source credit beneath
    sd54_stat(ctx) {
      const t = ctx.t, T = ctx.T, sz = WT(ctx, 0, 4, 1.2), mil = WT(ctx, 0, 6, 1.9);
      return E.cine.shot(ctx, {
        set: 'sd54_store', grade: 'cold', haze: 0.5,
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 20, y: 30, z: 1.07 } },
        figures: [
          { id: 'sd54_officer', x: 890, y: 1640, scale: 0.9, dir: -1, turn: 0.4, pose: 'present', expr: 'focused', depth: 1.0,
            keys: [{ at: sz, pose: 'examine', dur: 0.5 }, { at: mil + 0.3, pose: 'read', expr: 'shocked', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.07, svg: tt => { const r = R(5450); let g = ''; const n = 6 + Math.floor(8 * seg(tt, sz - 0.2, mil + 0.6));
            for (let i = 0; i < n; i++) { const col = i % 3, row = Math.floor(i / 3); g += bundle(180 + col * 170 + (r() - 0.5) * 16, 1236 - row * 44, 0.9, (r() - 0.5) * 6); }
            return g + evBag(620, 1160, 0.7, 6); } }
        ],
        overlays: [
          { type: 'counter', at: sz - 0.1, dur: 1.5, from: 0, to: 54, prefix: '£', suffix: ' MILLION', label: 'CASH SEIZED IN THE UK', y: 640, fs: 128 },
          { type: 'label', at: sz + 0.3, x: 90, y: 820, text: 'NCA · FIRST RESULTS, 2 JULY 2020', fs: 32, sub: 'Plus 746 arrests, 2+ tonnes of drugs' }
        ],
        tag: TAG
      });
    },

    // 5 - the fun fact + the fatal photo: his kitchen at night; his silhouette at the counter, the Stilton beside him (the
    //     accent); the FUN FACT card; held pause; then he lifts the phone and takes the photo (shutter flash)
    sd54_photo(ctx) {
      const t = ctx.t, T = ctx.T, un = WT(ctx, 0, 1, 0.4), tf = WT(ctx, 0, 2, 0.9), l2 = LS(ctx, 1, 3.0), ph = WT(ctx, 1, 3, 3.6), st = WT(ctx, 1, 5, 4.2);
      return E.cine.shot(ctx, {
        set: 'sd54_flat', grade: 'cold', haze: 0.5, dof: true,
        cam: { from: { x: -20, y: 40, z: 1.0 }, to: { x: 10, y: 50, z: 1.08 } },
        figures: [
          { id: 'sd54_stewart', x: 330, y: 1640, scale: 0.9, dir: 1, turn: 0.45, pose: 'hands_together', silhouette: 'warm', depth: 1.0,
            keys: [{ at: tf, pose: 'stand', headTurn: 0.3, dur: 0.5 }, { at: l2, pose: 'present', dur: 0.5 }, { at: st + 0.3, pose: 'hands_together', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.04, accent: true, svg: stilton(720, 1250, 0.62, { glow: 0.6 }) },
          { depth: 1.03, svg: tt => { const up = seg(tt, l2, l2 + 0.5); if (up <= 0) return ''; const fl = Math.max(0, 1 - Math.abs(tt - ph) / 0.18) * (tt > ph - 0.05 ? 1 : 0);
            return phoneSvg(lerp(520, 560, up), lerp(1180, 980, ease.out(up)), 0.75, -8, 0.9, fl); } }
        ],
        overlays: [
          { type: 'funfact', at: tf - 0.1, until: l2 - 0.1, y: 470, rows: [{ text: 'HIS ENCROCHAT NAME:' }, { text: "'TOFFEEFORCE', A NOD TO EVERTON" }] },
          { type: 'label', at: st, x: 60, y: 470, text: 'A BLOCK OF STILTON', fs: 40, sub: 'From M&S, police said' }
        ],
        tag: LIKE
      });
    },

    // 6 - THE BIGGEST REVEAL: a fingerprint lab; the photo on a big monitor, zoomed to the index fingertip; a reference print
    //     card beside it; the analyst leans in; on 'fingerprints' the match lines draw in, MATCH appears (the single impact)
    sd54_prints(ctx) {
      const t = ctx.t, T = ctx.T, lk = WT(ctx, 0, 1, 0.3), hd = WT(ctx, 0, 4, 1.0), mt = WT(ctx, 1, 2, 2.4), fp = WT(ctx, 1, 6, 3.4);
      const mon = tt => { const zoom = ease.inOut(seg(tt, lk, hd + 0.6)), m = ease.out(seg(tt, fp, fp + 0.6));
        let g = `<g transform="translate(540 1150)"><rect x="-420" y="-640" width="840" height="560" rx="16" fill="#0c1014" stroke="${INK}" stroke-width="8"/><rect x="-400" y="-620" width="800" height="520" rx="8" fill="#111a20"/><rect x="-40" y="-80" width="80" height="40" fill="#1c2228"/><rect x="-120" y="-44" width="240" height="16" rx="6" fill="#1c2228"/>`;
        // left pane: the photo, zooming from the whole hand to the fingertip
        g += `<defs><clipPath id="sdmL"><rect x="-390" y="-610" width="440" height="500" rx="6"/></clipPath></defs><g clip-path="url(#sdmL)"><rect x="-390" y="-610" width="440" height="500" fill="#2a3036"/>`;
        const zs = lerp(0.5, 1.7, zoom), zx = lerp(-170, -170 + 318 * 1.7, zoom), zy = lerp(-360 + 100 * 0.5, -360 + 88 * 1.7, zoom);
        const [b, fr] = hand(0, 0, 1, tt, { glow: 0.3 + 0.7 * m });
        g += `<g transform="translate(${f1(zx)} ${f1(zy)}) scale(${sc(zs)})">${b}${stilton(0, 0, 1, { glow: 0 })}${fr}</g></g>`;
        // right pane: a reference print card
        g += `<rect x="70" y="-600" width="320" height="480" rx="6" fill="#ece8de"/>` + swirl(230, -360, 120, 0, '#2a2a2a', 0.9, 6) + `<rect x="100" y="-170" width="160" height="12" fill="#9a948a"/><rect x="100" y="-148" width="110" height="12" fill="#9a948a"/>`;
        // match lines (left tip pane centre ~(-140,-360) -> card)
        if (m > 0) { [[-150, -400, 190, -420], [-120, -330, 260, -330], [-170, -300, 170, -280], [-100, -380, 290, -400]].forEach(([x1, y1, x2, y2], i) => { const q = clamp(m * 1.6 - i * 0.18, 0, 1);
          g += `<line x1="${x1}" y1="${y1}" x2="${f1(lerp(x1, x2, q))}" y2="${f1(lerp(y1, y2, q))}" stroke="${ACC}" stroke-width="4"/><circle cx="${x1}" cy="${y1}" r="8" fill="none" stroke="${ACC}" stroke-width="4" opacity="${f1(q)}"/><circle cx="${x2}" cy="${y2}" r="8" fill="none" stroke="${ACC}" stroke-width="4" opacity="${f1(q > 0.95 ? 1 : 0)}"/>`; });
          g += `<g opacity="${f1(seg(tt, fp + 0.35, fp + 0.6))}"><rect x="-110" y="-200" width="220" height="64" rx="10" fill="${ACC}"/><text x="0" y="-155" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="40" fill="#0c1014">MATCH</text></g>`; }
        return g + '</g>'; };
      return E.cine.shot(ctx, {
        set: 'lab', grade: 'cold', haze: 0.4, dof: true,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 10, y: 40, z: 1.08 }, settle: true },
        rack: { at: lk, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'sd54_analyst', x: 170, y: 1560, scale: 0.82, dir: 1, turn: 0.5, pose: 'sit_type', noChair: true, expr: 'focused', depth: 1.03,
            keys: [{ at: lk, pose: 'examine', dur: 0.5 }, { at: mt, pose: 'sit_type', dur: 0.4 }, { at: fp + 0.2, pose: 'point', expr: 'realise', gaze: [0.7, -0.4], dur: 0.4 }] }
        ],
        props: [{ depth: 1.0, accent: true, svg: mon }],
        overlays: [
          { type: 'impact', at: fp, x: 540, y: 800 },
          { type: 'label', at: fp + 0.1, x: 60, y: 470, text: 'PALM AND FINGERPRINTS: HIS', fs: 38, sub: 'Merseyside Police analysts' }
        ],
        tag: TAG
      });
    },

    // 7 - the LESSON (save trigger, for the viewer): a young man at his kitchen table at night holds up his phone to post a
    //     photo, then lowers it; the checklist card with the SAVE ribbon (captions off)
    sd54_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 0, 0.1), ps = WT(ctx, 0, 5, 1.2);
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'cold', haze: 0.6, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'sd54_viewer', x: 540, y: 1480, scale: 0.86, dir: 1, turn: 0.35, pose: 'sit', expr: 'neutral', depth: 1.0,
            keys: [{ at: 0.3, pose: 'present', expr: 'focused', dur: 0.5 }, { at: ps + 0.6, pose: 'sit', expr: 'worried', gaze: [0.3, 0.3], dur: 0.6 }] }
        ],
        props: [{ depth: 1.07, svg: tt => { const up = seg(tt, 0.3, 0.8) * (1 - seg(tt, ps + 0.6, ps + 1.2)); return phoneSvg(lerp(640, 690, up), lerp(1170, 1030, up), 0.7, -6, 0.5 + 0.4 * up); } }],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 430, rows: [{ text: 'FINGERTIPS IN SHARP FOCUS', fs: 42 }, { text: 'HIDDEN LOCATION DATA', fs: 42 }, { text: 'REFLECTIONS IN YOUR EYES', fs: 42 }, { text: "Japan's NII · FBI · U.S. Army · Tokyo case, 2019", fs: 24, colour: '#cfc2a8' }] }
        ],
        tag: TAG
      });
    },

    // 8 - the outcome on the hero object in frame 1's framing (the loop): the Stilton in the palm, the focus square locked on
    //     the glowing print; the sentence label at the top until the burned-in end question takes the top (last 3.6 s)
    sd54_end(ctx) {
      const t = ctx.t, T = ctx.T, th = WT(ctx, 0, 2, 0.8);
      return E.cine.shot(ctx, {
        set: 'sd54_flat', grade: 'cold', dof: true, haze: 0.4,
        cam: { from: { x: 0, y: 30, z: 1.03 }, to: { x: 10, y: 50, z: 1.12 }, settle: true },
        figures: [
          { id: 'sd54_stewart', x: 990, y: 2160, scale: 1.36, dir: -1, turn: 0.4, pose: 'present', silhouette: 'cool', depth: 1.0,
            keys: [{ at: th, pose: 'examine', headTurn: 0.3, dur: 0.7 }] }
        ],
        props: [
          { depth: 1.1, accent: true, svg: tt => heroSvg(tt, 1, 0.85 + 0.15 * Math.sin(tt * 2.5)) },
          { depth: 1.1, svg: tt => { const [fx_, fy_] = heroTip(tt, 1); return viewfinder(fx_, fy_, tt, -1); } }
        ],
        overlays: [
          { type: 'label', at: th, until: Math.max(th + 0.8, T - 3.9), x: 60, y: 470, text: '13 YEARS, 6 MONTHS', fs: 44, sub: 'Liverpool Crown Court, May 2021' }
        ],
        tag: LIKE
      });
    }
  });
})();
