/* Episode 002 — Mars Climate Orbiter. Scene functions get ctx {t, T, p, rng, scene, ep, narrEnd}. */
(function () {
  const E = window.HW; const { W, H, PAL, ease, seg, clamp, lerp, f1, esc } = E;
  const SP = { deep: '#141a33', mid: '#232a4f', dust: '#4a3b6b', rust: '#c1552f', rustDark: '#7a2e1a', mars: '#d0703f', marsLight: '#e8a06a', glow: '#ffb070', star: '#fff6dc', foil: '#d9a441', panel: '#2c3f73', teal: '#5fb3a8' };

  function spaceBg(ctx, opts = {}) {
    const { t } = ctx; const r = E.mulberry32(E.hashStr(ctx.scene.id + 'stars'));
    let s = `<defs><linearGradient id="e2sky" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="${SP.deep}"/><stop offset="0.6" stop-color="${SP.mid}"/><stop offset="1" stop-color="#3a2a4a"/></linearGradient>
      <radialGradient id="e2mars" cx="38%" cy="35%" r="70%"><stop offset="0" stop-color="${SP.marsLight}"/><stop offset="0.55" stop-color="${SP.mars}"/><stop offset="1" stop-color="${SP.rustDark}"/></radialGradient>
      <radialGradient id="e2halo" cx="50%" cy="50%" r="50%"><stop offset="0.86" stop-color="${SP.glow}" stop-opacity="0"/><stop offset="0.93" stop-color="${SP.glow}" stop-opacity="0.35"/><stop offset="1" stop-color="${SP.glow}" stop-opacity="0"/></radialGradient>
      <radialGradient id="e2shade" cx="25%" cy="30%" r="85%"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#0a0a1a" stop-opacity="0.65"/></radialGradient>
      <radialGradient id="e2earth" cx="35%" cy="35%" r="70%"><stop offset="0" stop-color="#8fd0e8"/><stop offset="1" stop-color="#2a5d9a"/></radialGradient></defs>`;
    s += `<rect width="${W}" height="${H}" fill="url(#e2sky)"/>`;
    s += E.blob(300, 500, 420, 260, SP.dust, ctx.rng, { n: 14, jitter: 0.3, noRim: true, opacity: 0.35 });
    s += E.blob(820, 1250, 380, 300, '#5a3550', ctx.rng, { n: 14, jitter: 0.3, noRim: true, opacity: 0.3 });
    for (let i = 0; i < (opts.stars || 110); i++) { const x = r() * W, y = r() * H, ph = r() * 6, sz = 1 + r() * 2.6; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(sz)}" fill="${SP.star}" opacity="${f1(0.35 + 0.55 * Math.abs(Math.sin(t * (0.6 + r()) + ph)))}"/>`; }
    return s;
  }
  function mars(cx, cy, r, rng, opts = {}) {
    const cid = 'e2mclip' + Math.round(cx) + Math.round(cy);
    let s = `<g><circle cx="${cx}" cy="${cy}" r="${r * 1.12}" fill="url(#e2halo)"/><clipPath id="${cid}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#e2mars)"/><g clip-path="url(#${cid})">`;
    const rr = E.mulberry32(1234);
    for (let i = 0; i < 9; i++) s += E.blob(cx + (rr() - 0.5) * r * 1.4, cy + (rr() - 0.4) * r * 1.2, r * (0.12 + rr() * 0.22), r * (0.06 + rr() * 0.12), i % 3 ? '#8a3a22' : '#e6a777', rr, { n: 10, jitter: 0.35, noRim: true, opacity: 0.45 });
    s += `<ellipse cx="${cx - r * 0.1}" cy="${cy - r * 0.93}" rx="${r * 0.32}" ry="${r * 0.12}" fill="#fbefe0" opacity="0.85"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#e2shade)"/></g><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${PAL.ink}" stroke-width="4" opacity="0.6"/></g>`;
    return s;
  }
  function earth(cx, cy, r) { return `<g><circle cx="${cx}" cy="${cy}" r="${r * 1.5}" fill="#8fd0e8" opacity="0.15"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#e2earth)" stroke="${PAL.ink}" stroke-width="3"/><path d="M${cx - r * 0.5} ${cy - r * 0.2} q${r * 0.3} ${-r * 0.4} ${r * 0.6} ${-r * 0.1} q${-r * 0.1} ${r * 0.4} ${-r * 0.5} ${r * 0.5}z" fill="#7fb36a"/></g>`; }
  function orbiter(x, y, s, rot, opts = {}) {
    // asymmetric single solar wing (a real feature of this spacecraft), gold-foil bus, dish, main engine
    const hot = opts.hot || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})">`;
    if (opts.flame) g += `<path d="M-14 46 Q0 ${f1(90 + opts.flame * 60)} 14 46 Z" fill="#ffd27a" opacity="0.9"/><path d="M-8 46 Q0 ${f1(70 + opts.flame * 35)} 8 46 Z" fill="#fff4cf"/>`;
    g += `<rect x="40" y="-14" width="150" height="40" fill="${SP.panel}" stroke="${PAL.ink}" stroke-width="3"/>${[0, 1, 2, 3, 4].map(i => `<line x1="${70 + i * 30}" y1="-14" x2="${70 + i * 30}" y2="26" stroke="#5e78b8" stroke-width="2"/>`).join('')}<line x1="40" y1="6" x2="190" y2="6" stroke="#5e78b8" stroke-width="2"/><rect x="26" y="0" width="16" height="10" fill="#8d7b63" stroke="${PAL.ink}" stroke-width="2"/>`;
    g += `<rect x="-30" y="-36" width="60" height="78" rx="4" fill="${SP.foil}" stroke="${PAL.ink}" stroke-width="3"/><path d="M-24 -26 l14 10 l10 -8 l14 12 M-22 10 l16 -6 l12 10 l16 -8" stroke="#a87418" stroke-width="2" fill="none"/>`;
    g += `<path d="M-12 42 L12 42 L16 50 L-16 50 Z" fill="#6b5d4c" stroke="${PAL.ink}" stroke-width="2.5"/>`;
    g += `<g transform="translate(-30 -40) rotate(-30)"><path d="M-40 0 Q0 30 40 0 Z" fill="#efe6d2" stroke="${PAL.ink}" stroke-width="3"/><line x1="0" y1="14" x2="0" y2="-12" stroke="${PAL.ink}" stroke-width="3"/></g>`;
    if (opts.puff) { const k = opts.puff, cx = opts.puffSide < 0 ? -36 : 36, cy = opts.puffY ?? -30; g += `<g opacity="${f1(1 - k)}">${[0, 1, 2].map(i => `<circle cx="${f1(cx + opts.puffSide * (8 + k * 46 + i * 9))}" cy="${f1(cy - i * 6 + Math.sin(i) * 4)}" r="${f1(6 + k * 18 - i * 3)}" fill="#f4f1ea"/>`).join('')}</g>`; }
    if (hot > 0) g += `<rect x="-36" y="-42" width="72" height="92" rx="10" fill="#ff6a2a" opacity="${f1(0.45 * hot)}" filter="url(#glow)"/>`;
    return g + '</g>';
  }
  function slip(x, y, rot, line1, line2, opts = {}) {
    const w = opts.w || 230, h = opts.h || 96;
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><rect x="${-w / 2 + 5}" y="${-h / 2 + 7}" width="${w}" height="${h}" rx="6" fill="${PAL.ink}" opacity="0.25"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="6" fill="${PAL.cream}" stroke="${PAL.ink}" stroke-width="3.5"/>
      <text y="${f1(-h / 2 + 34)}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="24" fill="${PAL.inkSoft}">${esc(line1)}</text>
      <text y="${f1(h / 2 - 18)}" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="${opts.fs || 36}" fill="${opts.color || PAL.ink}">${esc(line2)}</text></g>`;
  }
  function person(x, y, s, coat, t, opts = {}) {
    const bob = Math.sin(t * 3 + x) * 3;
    return `<g transform="translate(${f1(x)} ${f1(y + bob)}) scale(${s})">${E.shadowEllipse(0, 150, 66, 12, 0.2)}<path d="M-58 150 q-14 -104 0 -132 q58 -22 116 0 q14 28 0 132z" fill="${coat}" stroke="${PAL.ink}" stroke-width="4"/><ellipse cx="0" cy="-30" rx="54" ry="52" fill="#efc7a3" stroke="${PAL.ink}" stroke-width="4"/>
      <path d="M-54 -44 q54 -54 108 0 l0 -10 q-54 -50 -108 0z" fill="${opts.hair || PAL.ink}"/><circle cx="-18" cy="-32" r="6" fill="${PAL.ink}"/><circle cx="18" cy="-32" r="6" fill="${PAL.ink}"/>
      <path d="${opts.mood === 'worried' ? 'M-14 0 q14 -10 28 0' : 'M-14 -6 q14 10 28 0'}" stroke="${PAL.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${opts.headset ? `<path d="M-54 -36 q0 -64 54 -64 q54 0 54 64" stroke="${PAL.ink}" stroke-width="6" fill="none"/><rect x="-62" y="-44" width="16" height="26" rx="5" fill="${PAL.ink}"/><path d="M-54 -22 q4 30 34 30" stroke="${PAL.ink}" stroke-width="4" fill="none"/>` : ''}</g>`;
  }

  E.registerScenes({
    hook_mars(ctx) {
      const { t, rng } = ctx; let s = spaceBg(ctx);
      const z = 1 + 0.1 * ease.inOut(seg(t, 0, 9));
      s += `<g transform="translate(760 960) scale(${f1(z)}) translate(-760 -960)">${mars(760, 960, 430, rng)}</g>`;
      const k = ease.out(seg(t, 0, 6.0));
      s += orbiter(lerp(120, 470, k), lerp(260, 560, k), 1.25, lerp(-30, 18, k), { flame: t < 0.6 ? 0.6 : 0 });
      s += `<path d="M ${f1(lerp(120, 470, k) - 40)} ${f1(lerp(260, 560, k) - 40)} Q 60 220 -40 140" stroke="${SP.star}" stroke-width="3" stroke-dasharray="4 14" fill="none" opacity="0.5"/>`;
      // homework page slides in
      const hp = ease.out(seg(t, 6.0, 6.7));
      if (hp > 0) {
        s += `<g transform="translate(${f1(lerp(-500, 70, hp))} 960) rotate(-5)"><rect x="8" y="10" width="520" height="380" rx="8" fill="${PAL.ink}" opacity="0.3"/><rect width="520" height="380" rx="8" fill="#fbf6e6" stroke="${PAL.ink}" stroke-width="4"/>
          ${[1, 2, 3, 4, 5, 6].map(i => `<line x1="0" x2="520" y1="${i * 56}" y2="${i * 56}" stroke="#9cc3d8" stroke-width="2"/>`).join('')}<line x1="70" x2="70" y1="0" y2="380" stroke="#e08a8a" stroke-width="3"/>
          <text x="96" y="46" font-family="Fraunces" font-style="italic" font-weight="600" font-size="34" fill="#2b3f7a">Homework, Q3</text>
          <text x="96" y="160" font-family="Fraunces" font-style="italic" font-weight="600" font-size="46" fill="#2b3f7a">10 lbf·s = 10 N·s</text>
          <text x="96" y="262" font-family="Fraunces" font-style="italic" font-weight="600" font-size="34" fill="#2b3f7a">…right?</text></g>`;
        const st = seg(t, 8.7, 8.95); if (st > 0) s += `<g transform="translate(470 1120) rotate(-12) scale(${f1(lerp(1.8, 1, ease.out(st)))})" opacity="${f1(st)}"><circle r="95" fill="none" stroke="${PAL.red}" stroke-width="10"/><path d="M-50 -50 L50 50 M50 -50 L-50 50" stroke="${PAL.red}" stroke-width="14" stroke-linecap="round"/></g>`;
      }
      return s;
    },

    vanish(ctx) {
      const { t, rng } = ctx; let s = spaceBg(ctx);
      s += earth(150, 230, 44) + `<text x="150" y="320" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="26" fill="${SP.star}" opacity="0.8">EARTH</text>`;
      const k = ease.inOut(seg(t, 0, 3.6));
      // path: from upper right, curving down and behind the left limb of Mars
      const px = t => { const u = clamp(t, 0, 1); return [lerp(lerp(1020, 300, u), lerp(300, 230, u), u), lerp(lerp(300, 420, u), lerp(420, 1000, u), u)]; };
      const [ox, oy] = px(k);
      s += `<path d="M1020 300 Q300 420 230 1000" stroke="${SP.star}" stroke-width="3" stroke-dasharray="4 14" fill="none" opacity="0.4"/>`;
      s += orbiter(ox, oy, 1.1, lerp(-20, 60, k), { flame: t > 1.6 && t < 3.6 ? 0.8 + 0.2 * Math.sin(t * 30) : 0 });
      s += mars(560, 1000, 360, rng);   // drawn after the orbiter so Mars hides it
      // radio link to Earth
      const linked = t < 3.4;
      if (linked) { s += `<line x1="${f1(ox)}" y1="${f1(oy)}" x2="150" y2="230" stroke="${SP.teal}" stroke-width="3" stroke-dasharray="6 12" opacity="0.7"/>`; for (let i = 0; i < 3; i++) { const u = ((t * 0.9 + i / 3) % 1); s += `<circle cx="${f1(lerp(ox, 150, u))}" cy="${f1(lerp(oy, 230, u))}" r="7" fill="${SP.teal}"/>`; } }
      // mission status panel
      const lost = t > 5.0; const blink = lost && Math.floor(t * 3) % 2 === 0;
      s += `<g transform="translate(560 120)"><rect x="0" y="0" width="460" height="190" rx="16" fill="#0d1226" stroke="${PAL.ink}" stroke-width="4" opacity="0.92"/>
        <text x="30" y="56" font-family="Nunito" font-weight="800" font-size="30" fill="#9fb3d9">23 SEP 1999</text>
        <text x="30" y="110" font-family="Nunito" font-weight="800" font-size="30" fill="#9fb3d9">SIGNAL</text>
        <text x="200" y="112" font-family="Fraunces" font-weight="800" font-size="44" fill="${lost ? '#ff6a5a' : t > 3.4 ? '#f0c060' : '#7dffa8'}" opacity="${blink ? 0.35 : 1}">${lost ? 'LOST' : t > 3.4 ? 'WAITING…' : 'LOCKED'}</text>
        <text x="30" y="164" font-family="Nunito" font-weight="700" font-size="24" fill="#6f80a8">a short blackout was expected</text></g>`;
      return s;
    },

    puffs(ctx) {
      const { t, rng } = ctx; let s = spaceBg(ctx, { stars: 70 });
      const times = [1.0, 2.2, 3.4, 4.6]; const sides = [1, -1, 1, -1];
      let puff = 0, side = 1; times.forEach((a, i) => { const k = seg(t, a, a + 0.9); if (k > 0 && k < 1) { puff = k; side = sides[i]; } });
      s += orbiter(560, 560, 2.5, Math.sin(t * 0.8) * 3, { puff, puffSide: side });
      s += `<text x="560" y="210" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="40" fill="${SP.star}">tiny thruster puffs</text>`;
      // clipboard log
      s += `<g transform="translate(110 900) rotate(-3)"><rect x="6" y="10" width="560" height="430" rx="14" fill="${PAL.ink}" opacity="0.3"/><rect width="560" height="430" rx="14" fill="#b98a5b" stroke="${PAL.ink}" stroke-width="4"/><rect x="24" y="40" width="512" height="370" rx="6" fill="${PAL.cream}" stroke="${PAL.ink}" stroke-width="3"/><rect x="200" y="-12" width="160" height="50" rx="10" fill="#8d7b63" stroke="${PAL.ink}" stroke-width="4"/>
        <text x="280" y="96" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="34" fill="${PAL.ink}">"SMALL FORCES" LOG</text>`;
      times.forEach((a, i) => { const k = seg(t, a + 0.4, a + 0.9); if (k > 0) s += `<g opacity="${f1(k)}"><text x="56" y="${160 + i * 62}" font-family="Nunito" font-weight="800" font-size="30" fill="${PAL.inkSoft}">puff #${i + 1}</text><text x="500" y="${160 + i * 62}" text-anchor="end" font-family="Fraunces" font-weight="800" font-size="32" fill="${PAL.ink}">${[10, 12, 9, 11][i]} lbf·s</text></g>`; });
      s += `<text x="280" y="400" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="20" fill="${PAL.inkSoft}">example values</text></g>`;
      // send to navigators
      const sp = seg(t, 5.6, 6.6); s += `<g opacity="${f1(seg(t, 5.2, 5.6))}">${E.label(850, 960, 'to the navigators', { fs: 30, bg: PAL.gold })}<path d="M720 1060 Q 850 1080 940 1180" stroke="${SP.star}" stroke-width="6" fill="none" stroke-dasharray="10 10"/></g>`;
      if (sp > 0) s += slip(lerp(700, 900, ease.inOut(sp)), lerp(1080, 1260, ease.inOut(sp)), lerp(-4, 8, sp), 'LOG FILE', '10 lbf·s', { w: 200, h: 90, fs: 30 });
      return s;
    },

    two_teams(ctx) {
      const { t, rng } = ctx; let s = '';
      // top: Colorado
      s += `<rect width="${W}" height="760" fill="#cfd9e3"/>` + E.blob(540, 300, 700, 260, '#e3e9ee', rng, { n: 14, jitter: 0.15, noRim: true, opacity: 0.7 });
      const mtn = (x, w, h, c) => `<path d="M${x - w} 600 L${x} ${600 - h} L${x + w} 600 Z" fill="${c}" stroke="${PAL.ink}" stroke-width="4"/><path d="M${x - w * 0.28} ${600 - h * 0.72} L${x} ${600 - h} L${x + w * 0.28} ${600 - h * 0.72} L${x + w * 0.1} ${600 - h * 0.66} L${x - w * 0.08} ${600 - h * 0.74} Z" fill="#fbfbf6"/>`;
      s += mtn(180, 260, 330, '#7b7f9e') + mtn(560, 320, 420, '#6a6f90') + mtn(920, 260, 300, '#868aa8');
      s += `<rect x="0" y="600" width="${W}" height="160" fill="#a9b48d"/>`;
      s += `<rect x="560" y="440" width="380" height="220" fill="${PAL.cream}" stroke="${PAL.ink}" stroke-width="5"/><rect x="600" y="490" width="80" height="60" fill="#9cc3d8" stroke="${PAL.ink}" stroke-width="3"/><rect x="820" y="490" width="80" height="60" fill="#9cc3d8" stroke="${PAL.ink}" stroke-width="3"/><rect x="720" y="560" width="60" height="100" fill="${PAL.ink}"/>`;
      s += E.label(540, 90, 'SPACECRAFT TEAM · COLORADO', { fs: 34, bg: PAL.cream });
      s += person(330, 520, 0.85, PAL.rust, t);
      // bottom: California
      s += `<rect x="0" y="760" width="${W}" height="${H - 760}" fill="#f2d7a6"/><circle cx="880" cy="900" r="70" fill="#ffd36a" opacity="0.9"/><rect x="0" y="1260" width="${W}" height="${H - 1260}" fill="#d9b77e"/>`;
      const palm = x => `<g transform="translate(${x} 1260)"><path d="M0 0 q-10 -120 10 -260" stroke="#8a5a32" stroke-width="20" fill="none" stroke-linecap="round"/>${[-70, -30, 20, 60, 100].map(a => `<path d="M10 -260 q${f1(Math.cos(a * Math.PI / 180) * 80)} ${-40} ${f1(Math.cos(a * Math.PI / 180) * 150)} ${f1(10 + Math.abs(a))}" stroke="#4f8a4a" stroke-width="16" fill="none" stroke-linecap="round"/>`).join('')}</g>`;
      s += palm(110) + palm(980);
      s += `<rect x="180" y="1080" width="420" height="200" fill="${PAL.cream}" stroke="${PAL.ink}" stroke-width="5"/><rect x="220" y="1130" width="90" height="60" fill="#9cc3d8" stroke="${PAL.ink}" stroke-width="3"/><rect x="460" y="1130" width="90" height="60" fill="#9cc3d8" stroke="${PAL.ink}" stroke-width="3"/>`;
      s += `<g transform="translate(760 1150)"><path d="M-70 -40 Q0 30 70 -40 Z" fill="#efe6d2" stroke="${PAL.ink}" stroke-width="4"/><rect x="-8" y="-10" width="16" height="110" fill="#8d7b63" stroke="${PAL.ink}" stroke-width="3"/></g>`;
      s += E.label(540, 830, 'NAVIGATION TEAM · CALIFORNIA', { fs: 34, bg: PAL.cream });
      s += person(700, 1170, 0.85, PAL.teal, t, { headset: true });
      s += `<line x1="0" y1="760" x2="${W}" y2="760" stroke="${PAL.ink}" stroke-width="8"/>`;
      // the slip travels down; its unit is lost on the way
      const k = ease.inOut(seg(t, 1.4, 3.0)); const y = lerp(380, 990, k), x = lerp(230, 300, k);
      const arrived = t > 3.0;
      s += slip(x, y, lerp(-6, 4, k), arrived ? 'READ AS' : 'WRITTEN AS', arrived ? '10 N·s' : '10 lbf·s', { color: arrived ? PAL.teal : PAL.rust });
      if (t > 2.2 && t < 3.2) s += `<text x="${f1(x + 150)}" y="${f1(y)}" font-family="Fraunces" font-weight="800" font-size="40" fill="${PAL.ink}" opacity="${f1(1 - seg(t, 2.8, 3.2))}">?</text>`;
      const st = seg(t, 4.5, 4.75); if (st > 0) s += `<g transform="translate(660 1000) rotate(-10) scale(${f1(lerp(1.6, 1, ease.out(st)))})" opacity="${f1(st)}"><rect x="-200" y="-46" width="400" height="92" rx="12" fill="none" stroke="${PAL.red}" stroke-width="8"/><text y="18" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="46" fill="${PAL.red}">WRONG UNIT</text></g>`;
      return s;
    },

    scale(ctx) {
      const { t, rng } = ctx; let s = `<rect width="${W}" height="${H}" fill="#ecdcb6"/>` + E.blob(540, 800, 800, 760, '#f4e6c4', rng, { n: 16, jitter: 0.08, noRim: true });
      const added = [0.8, 1.4, 2.0, 2.6].filter(a => t >= a).length + (t >= 3.2 ? 0.448 : 0);
      const tilt = clamp((4.448 - added) / 4.448, 0, 1) * 16; // degrees, left side down when heavier
      s += `<g transform="translate(540 520)"><path d="M-40 520 L40 520 L14 0 L-14 0 Z" fill="#8d7b63" stroke="${PAL.ink}" stroke-width="5"/><rect x="-140" y="510" width="280" height="40" rx="10" fill="#8d7b63" stroke="${PAL.ink}" stroke-width="5"/>
        <g transform="rotate(${f1(-tilt)})"><rect x="-420" y="-14" width="840" height="28" rx="12" fill="${PAL.gold}" stroke="${PAL.ink}" stroke-width="5"/><circle r="22" fill="${PAL.goldDark}" stroke="${PAL.ink}" stroke-width="4"/>`;
      const pan = (x, inner) => `<g transform="translate(${x} 0) rotate(${f1(tilt)})"><line x1="-90" y1="0" x2="-110" y2="200" stroke="${PAL.ink}" stroke-width="4"/><line x1="90" y1="0" x2="110" y2="200" stroke="${PAL.ink}" stroke-width="4"/><path d="M-150 200 L150 200 Q130 250 0 250 Q-130 250 -150 200 Z" fill="#b07a1f" stroke="${PAL.ink}" stroke-width="5"/>${inner}</g>`;
      const lblock = `<rect x="-90" y="40" width="180" height="160" rx="10" fill="${PAL.rust}" stroke="${PAL.ink}" stroke-width="5"/><text y="140" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="56" fill="${PAL.cream}">1 lbf</text>`;
      let rb = ''; [0.8, 1.4, 2.0, 2.6].forEach((a, i) => { const k = seg(t, a - 0.3, a); if (k > 0) { const yy = lerp(-400, 0, ease.in(k)); rb += `<g transform="translate(${-104 + (i % 2) * 108} ${f1(yy + 130 - Math.floor(i / 2) * 76)})"><rect x="-50" y="-4" width="100" height="72" rx="8" fill="${PAL.teal}" stroke="${PAL.ink}" stroke-width="4"/><text x="0" y="46" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="34" fill="${PAL.cream}">1 N</text></g>`; } });
      const sm = seg(t, 2.9, 3.2); if (sm > 0) rb += `<g transform="translate(0 ${f1(lerp(-500, -18, ease.in(sm)))})"><rect x="-34" y="0" width="68" height="44" rx="6" fill="${PAL.sage}" stroke="${PAL.ink}" stroke-width="4"/><text x="0" y="31" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="22" fill="${PAL.cream}">0.45</text></g>`;
      s += pan(-330, lblock) + pan(330, rb) + `</g></g>`;
      const eq = seg(t, 3.3, 3.8); if (eq > 0) s += `<g opacity="${f1(eq)}">${E.label(540, 230, '1 pound-force ≈ 4.45 newtons', { fs: 46, bg: PAL.cream })}</g>`;
      // bars: real vs counted
      const bp = seg(t, 4.2, 4.6); if (bp > 0) {
        const shrink = ease.inOut(seg(t, 4.9, 5.8)); const w2 = lerp(860, 860 / 4.448, shrink);
        s += `<g opacity="${f1(bp)}" transform="translate(110 1130)"><text x="0" y="0" font-family="Nunito" font-weight="800" font-size="30" fill="${PAL.ink}">real push</text><rect x="0" y="16" width="860" height="54" rx="10" fill="${PAL.rust}" stroke="${PAL.ink}" stroke-width="4"/>
          <text x="0" y="128" font-family="Nunito" font-weight="800" font-size="30" fill="${PAL.ink}">what navigation counted</text><rect x="0" y="144" width="${f1(w2)}" height="54" rx="10" fill="${PAL.teal}" stroke="${PAL.ink}" stroke-width="4"/>${shrink > 0.95 ? `<text x="${f1(w2 + 20)}" y="184" font-family="Fraunces" font-weight="800" font-size="36" fill="${PAL.teal}">about 22%</text>` : ''}</g>`;
      }
      return s;
    },

    drift(ctx) {
      const { t, T, rng } = ctx; let s = spaceBg(ctx);
      s += earth(150, 1320, 60) + mars(850, 400, 170, rng);
      const P = u => [lerp(lerp(190, 300, u), lerp(300, 700, u), u), lerp(lerp(1270, 600, u), lerp(600, 450, u), u)];
      const A = u => { const [x, y] = P(u); const d = Math.pow(u, 1.8) * 230; return [x + d * 0.35, y + d]; };
      const prog = ease.inOut(seg(t, 0.2, Math.min(T - 0.6, 5.6)));
      const pathOf = (f, n = 40) => Array.from({ length: n + 1 }, (_, i) => { const [x, y] = f(i / n * prog); return `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`; }).join(' ');
      s += `<path d="${pathOf(P)}" stroke="${SP.teal}" stroke-width="7" stroke-dasharray="16 12" fill="none"/>`;
      s += `<path d="${pathOf(A)}" stroke="#ff8a5a" stroke-width="8" fill="none"/>`;
      // puff markers: spacing tightens over time (more firings than planned)
      let u = 0.05, step = 0.16; while (u < prog) { const [x, y] = A(u); s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="9" fill="#f4f1ea" opacity="0.9"/>`; u += step; step = Math.max(0.035, step * 0.72); }
      const [hx, hy] = A(prog); s += orbiter(hx, hy, 0.5, 30);
      s += `<g transform="translate(590 1110)">${E.label(0, 0, 'planned path', { fs: 30, bg: SP.teal, color: PAL.cream })}<g transform="translate(40 76)">${E.label(0, 0, 'actual path', { fs: 30, bg: '#d9603a', color: PAL.cream })}</g></g>`;
      const months = ['DEC 1998', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP 1999'];
      s += `<g transform="translate(60 110)"><rect width="370" height="96" rx="14" fill="#0d1226" stroke="${PAL.ink}" stroke-width="4" opacity="0.92"/><text x="185" y="64" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="44" fill="#9fb3d9">${months[Math.min(9, Math.floor(prog * 9.99))]}</text></g>`;
      return s;
    },

    altitude(ctx) {
      const { t, rng } = ctx; let s = `<defs><linearGradient id="e2atm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SP.deep}"/><stop offset="0.55" stop-color="#3a2a52"/><stop offset="0.85" stop-color="#b8603a"/><stop offset="1" stop-color="#e89a5a"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#e2atm)"/>`;
      s += spaceBg(ctx, { stars: 60 }).replace(/<rect width="1080" height="1920" fill="url\(#e2sky\)"\/>/, '');
      const ground = 1330, kmY = km => ground - km * 5;
      s += `<path d="M-200 ${ground + 30} Q540 ${ground - 70} 1280 ${ground + 30} L1280 1920 L-200 1920 Z" fill="${SP.mars}" stroke="${PAL.ink}" stroke-width="5"/>` + E.blob(300, ground + 120, 260, 60, '#8a3a22', rng, { n: 10, jitter: 0.3, noRim: true, opacity: 0.5 });
      // altitude ruler
      s += `<g><line x1="90" y1="${kmY(0)}" x2="90" y2="${kmY(190)}" stroke="${SP.star}" stroke-width="4"/>${[0, 50, 100, 150].map(km => `<line x1="78" x2="102" y1="${kmY(km)}" y2="${kmY(km)}" stroke="${SP.star}" stroke-width="4"/><text x="114" y="${kmY(km) + 10}" font-family="Nunito" font-weight="800" font-size="28" fill="${SP.star}">${km} km</text>`).join('')}</g>`;
      s += `<line x1="210" x2="1040" y1="${kmY(145)}" y2="${kmY(145)}" stroke="${SP.teal}" stroke-width="5" stroke-dasharray="14 10"/>${E.label(800, kmY(145) - 44, 'planned: ~140–150 km', { fs: 30, bg: SP.teal, color: PAL.cream })}`;
      const ap = seg(t, 2.4, 3.0); if (ap > 0) s += `<g opacity="${f1(ap)}"><line x1="210" x2="1040" y1="${kmY(57)}" y2="${kmY(57)}" stroke="#ff6a5a" stroke-width="5"/>${E.label(820, kmY(57) + 52, 'actual: ~57 km', { fs: 30, bg: PAL.red, color: PAL.cream })}</g>`;
      // ghost planned pass vs real pass
      const curve = (minY, u) => [lerp(-80, 1160, u), minY + Math.pow((u - 0.5) * 2, 2) * (minY - 120)];
      const ghost = Array.from({ length: 41 }, (_, i) => { const [x, y] = curve(kmY(145), i / 40); return `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`; }).join(' ');
      s += `<path d="${ghost}" stroke="${SP.teal}" stroke-width="3" fill="none" opacity="0.45"/>`;
      const u = lerp(0.05, 0.5, ease.out(seg(t, 0.2, 3.6))) + Math.max(0, t - 3.6) * 0.04;
      const [ox, oy] = curve(kmY(57), u);
      const hot = seg(t, 3.4, 4.6); const fade = 1 - seg(t, 5.2, 6.0);
      if (hot > 0) s += `<path d="M${f1(ox)} ${f1(oy)} L${f1(ox - 260)} ${f1(oy - 90)}" stroke="#ffb070" stroke-width="${f1(26 * hot)}" stroke-linecap="round" opacity="${f1(0.6 * hot * fade)}" filter="url(#glow)"/>`;
      s += `<g opacity="${f1(fade)}">${orbiter(ox, oy, 0.75, 20, { hot })}</g>`;
      return s;
    },

    twist(ctx) {
      const { t, rng } = ctx; let s = `<rect width="${W}" height="${H}" fill="#1a1d33"/>` + `<path d="M540 -40 L180 1400 L900 1400 Z" fill="#fff2c8" opacity="0.10"/>` + `<ellipse cx="540" cy="1380" rx="440" ry="60" fill="#fff2c8" opacity="0.12"/>`;
      // two desks and an empty checkpoint between them
      s += person(170, 1150, 0.8, PAL.rust, t) + person(910, 1150, 0.8, PAL.teal, t, { headset: true });
      s += `<g transform="translate(540 1120)"><rect x="-120" y="-240" width="240" height="380" rx="14" fill="none" stroke="#fff2c8" stroke-width="6" stroke-dasharray="18 14" opacity="0.8"/><text y="190" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" fill="#fff2c8">the check that</text><text y="226" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" fill="#fff2c8">should have caught it</text></g>`;
      const k = ease.inOut(seg(t, 0.6, 2.6)); s += slip(lerp(250, 830, k), 1040 + Math.sin(k * Math.PI) * -60, lerp(-6, 6, k), 'PUSH', '10 ???', { w: 190, h: 86, fs: 32 });
      // quote card
      const q = ease.back(seg(t, 3.0, 3.6)); if (q > 0) s += `<g transform="translate(540 470) scale(${f1(q)}) rotate(-2)"><rect x="-430" y="-260" width="860" height="520" rx="18" fill="${PAL.cream}" stroke="${PAL.ink}" stroke-width="6"/>
        <text x="-370" y="-120" font-family="Fraunces" font-weight="800" font-size="160" fill="${PAL.gold}">“</text>
        ${E.textBlock(0, -60, 'The problem here was not the error.', { fs: 64, maxChars: 20 })}
        <text y="200" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="28" fill="${PAL.inkSoft}">Ed Weiler, NASA Associate Administrator for Space Science</text></g>`;
      return s;
    },

    lesson(ctx) {
      const { t, rng } = ctx; let s = `<rect width="${W}" height="${H}" fill="#e7d4a8"/>` + E.blob(540, 900, 800, 760, '#f3e5c2', rng, { n: 18, jitter: 0.08, noRim: true });
      const k = ease.out(seg(t, 0.1, 0.8));
      s += `<g opacity="${f1(k)}"><text x="540" y="230" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" fill="${PAL.inkSoft}" letter-spacing="6">LESSON LEARNED</text>${E.textBlock(540, 340, 'A number without its unit isn’t information.', { fs: 60, maxChars: 22 })}</g>`;
      const k2 = ease.out(seg(t, 2.6, 3.2)); s += `<g opacity="${f1(k2)}">${E.textBlock(540, 560, 'It’s a guess in a lab coat.', { fs: 64, maxChars: 22, color: PAL.rust })}</g>`;
      // the number in a lab coat
      const bob = Math.sin(t * 3) * 6, labelled = t > 5.2;
      s += `<g transform="translate(540 ${f1(1080 + bob)})">${E.shadowEllipse(0, 330, 200, 26, 0.22)}
        <path d="M-170 320 L-130 40 Q0 -10 130 40 L170 320 Z" fill="#fbfbf6" stroke="${PAL.ink}" stroke-width="6"/><path d="M-40 40 L0 150 L40 40" fill="none" stroke="${PAL.ink}" stroke-width="5"/><line x1="0" y1="150" x2="0" y2="320" stroke="${PAL.ink}" stroke-width="4"/><rect x="60" y="170" width="60" height="44" rx="6" fill="none" stroke="${PAL.ink}" stroke-width="4"/><path d="M78 168 l0 -24" stroke="${PAL.teal}" stroke-width="6"/>
        <g transform="rotate(${f1(Math.sin(t * 2) * 6)})"><path d="M-130 70 Q-230 140 -190 230" stroke="#fbfbf6" stroke-width="44" fill="none" stroke-linecap="round"/><path d="M-130 70 Q-230 140 -190 230" stroke="${PAL.ink}" stroke-width="52" fill="none" stroke-linecap="round" opacity="0"/></g>
        <path d="M130 70 Q230 120 210 220" stroke="#fbfbf6" stroke-width="44" fill="none" stroke-linecap="round"/><g transform="translate(200 210) rotate(10)"><rect x="-50" y="-60" width="100" height="130" rx="8" fill="#b98a5b" stroke="${PAL.ink}" stroke-width="4"/><rect x="-38" y="-44" width="76" height="100" fill="${PAL.cream}"/></g>
        <text x="0" y="40" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="300" fill="${PAL.ink}">10</text>
        <circle cx="-62" cy="-150" r="30" fill="#fff" stroke="${PAL.ink}" stroke-width="5"/><circle cx="62" cy="-150" r="30" fill="#fff" stroke="${PAL.ink}" stroke-width="5"/><line x1="-32" y1="-150" x2="32" y2="-150" stroke="${PAL.ink}" stroke-width="5"/>
        <circle cx="${f1(-58 + Math.sin(t) * 6)}" cy="-148" r="11" fill="${PAL.ink}"/><circle cx="${f1(66 + Math.sin(t) * 6)}" cy="-148" r="11" fill="${PAL.ink}"/>
        ${labelled ? `<path d="M-40 -60 q40 26 80 0" stroke="${PAL.ink}" stroke-width="7" fill="none" stroke-linecap="round"/>` : `<path d="M-30 -50 q30 -14 60 0" stroke="${PAL.ink}" stroke-width="7" fill="none" stroke-linecap="round"/><text x="200" y="-200" font-family="Fraunces" font-weight="800" font-size="110" fill="${PAL.inkSoft}" opacity="${f1(seg(t, 3.2, 3.8))}">?</text>`}
        ${labelled ? `<g transform="translate(220 -40) rotate(${f1(lerp(-30, 8, ease.back(seg(t, 5.2, 5.5))))}) scale(${f1(lerp(1.6, 1, ease.out(seg(t, 5.2, 5.4))))})"><rect x="-90" y="-46" width="180" height="92" rx="12" fill="${PAL.gold}" stroke="${PAL.ink}" stroke-width="5"/><text y="20" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="56" fill="${PAL.ink}">N·s</text></g>` : ''}</g>`;
      if (labelled) s += E.sparkles(540, 1000, 300, t, rng, 10);
      const b = seg(t, 5.6, 6.2); if (b > 0) s += `<g opacity="${f1(b)}" transform="translate(${W / 2 - 190} 1560)">${E.brandMark(0, 0, 1.2, 0.95)}</g><g opacity="${f1(b)}">${E.textBlock(540, 1650, 'Everything has a secret. Let’s find it.', { fs: 36, maxChars: 40, font: 'Fraunces', weight: 600, italic: true, color: PAL.inkSoft })}</g>`;
      return s;
    }
  });
})();
