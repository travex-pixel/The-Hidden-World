/* Case File 44 (premium look, engagement + shares + smoothness + hooks rules): J.L. Hunter "Red" Rountree, the oldest
   convicted bank robber (Guinness): at 91 he handed a teller in Abilene, Texas, an envelope marked "Robbery" (2003).
   Structure: frame 1 = the HERO OBJECT (a manila envelope marked ROBBERY) big and centred on a bank counter, with his
   silhouetted hand already sliding it towards the teller and the camera already pushing in; the map fly-in to Abilene;
   the loan office (his own account: a bank forced him into bankruptcy); robberies 1 and 2 (a slow pan along a Gulf Coast
   street as his silhouette walks left to right from one bank to the next); robbery 3 in the Abilene bank (light shafts;
   the fun fact: the teller asked twice if he was joking); the getaway (the only handheld shot: his car pulls out left to
   right, a customer writes the plate, police lights; the single impact and shake on 'stopped'); the LESSON checklist at a
   kitchen table (captions off); the statistic counter in a prison corridor; the outcome on the hero object in the first
   frame's framing with the burned-in end question.
   Smoothness (owner, 44+): mostly cuts and dissolves, one push, one zoom (the end); one slow camera move per shot; settle
   only on the three hero dolly-ins; one shake and one impact in the whole video.
   Look: episode.look = 'premium' with one warm palette (shadow #0f2630, mid #c8b89e, accent #e2a13b). The ONLY strongly
   coloured object is the envelope (prop marked accent: true).
   Content rules: no weapon, no threat, no violence is drawn; the teller is never shown in danger. Rountree appears ONLY
   as a faceless rim-lit silhouette (NOT A LIKENESS). Everyone else is a generic figure; no real bank's name or logo, no
   police insignia. Places are generic illustrations.
   New environments (E.registerSets): or44_bank (a small-town bank lobby: cream walls, tall windows, a wall clock, a wooden
   teller counter), or44_gulf (a sunny Gulf Coast street with two generic bank fronts and palms, wide for a pan),
   or44_lot (a flat West Texas bank car park under a big sky, a highway beyond), or44_block (a prison corridor). Plus the
   engine's mapflight, office_day and kitchen_night. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#15120f';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#e2a13b';
  const HAT = { style: 'fedora', color: '#3a3128', band: '#241e18' };

  // ---------- THE HERO: a manila envelope marked ROBBERY in dark ink; centre (x, y), ~600 x 360 at s = 1. o.glow 0..1 = a
  // warm wash under it; o.rot = rotation in degrees.
  function envelope(x, y, s, t, o = {}) {
    const gl = o.glow ?? 0.7, rot = o.rot ?? -5;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    g += `<ellipse cx="14" cy="30" rx="330" ry="200" fill="#000" opacity="0.35" filter="url(#cineSoft)"/>`;
    if (gl > 0) g += wash(0, 0, 380, 240, ACC, f1(0.18 * gl));
    g += `<rect x="-300" y="-180" width="600" height="360" rx="10" fill="#e3ac52" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-300 -180 L0 10 L300 -180" fill="#d39a40" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    g += `<path d="M-300 180 L-60 -10 M300 180 L60 -10" stroke="#b9822e" stroke-width="4" opacity="0.8"/>`;
    g += `<path d="M-290 -168 L290 -168" stroke="#f6d48e" stroke-width="4" opacity="0.6"/>`;
    // the word, in dark ink, slightly uneven like a hand-written word (our own lettering)
    g += `<g transform="rotate(-3)"><text x="0" y="118" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="600" font-size="112" letter-spacing="2" fill="#1d1712" opacity="0.92">Robbery</text>` +
      `<path d="M-200 136 Q0 150 210 130" stroke="#1d1712" stroke-width="5" fill="none" opacity="0.7"/></g>`;
    return g + '</g>';
  }
  // a plain second envelope (the one the teller fills), smaller and unmarked
  const plainEnv = (x, y, s, rot = 8) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${sc(s)})"><rect x="-150" y="-90" width="300" height="180" rx="6" fill="#efe6d2" stroke="${INK}" stroke-width="5"/><path d="M-150 -90 L0 10 L150 -90" fill="none" stroke="#b9ab8e" stroke-width="4"/></g>`;

  // a generic four-door sedan in profile (no badge, no plate number); bottom centre (x, y); ~440 x 150 at k = 1; flip -1 faces left
  function sedan(x, y, k, col, o = {}) {
    const fl = o.flip || 1;
    const body = col || '#8a7a68', shade = '#4e4438', glass = '#1a2026';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k * fl)} ${sc(k)})"><ellipse cx="0" cy="4" rx="240" ry="20" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-214 -6 L-218 -58 Q-210 -78 -170 -84 L-104 -92 L-56 -140 Q-36 -152 40 -152 L92 -148 Q136 -134 168 -94 L206 -86 Q222 -76 222 -50 L220 -6 Z" fill="${body}" stroke="#000" stroke-width="5"/>`;
    g += `<path d="M-46 -136 L-88 -94 L30 -94 L30 -142 Z M42 -142 L42 -94 L150 -94 Q128 -128 98 -140 Z" fill="${glass}"/>`;
    g += `<path d="M-212 -40 L220 -44" stroke="${shade}" stroke-width="5"/><path d="M-190 -64 L196 -70" stroke="#fff" stroke-opacity="0.35" stroke-width="4"/>`;
    g += `<circle cx="-130" cy="-6" r="36" fill="#050506"/><circle cx="-130" cy="-6" r="16" fill="#5a5a58"/><circle cx="140" cy="-6" r="36" fill="#050506"/><circle cx="140" cy="-6" r="16" fill="#5a5a58"/>`;
    g += `<path d="M208 -76 L222 -72 L220 -58 L206 -60 Z" fill="#f2ead2"/><rect x="-220" y="-74" width="12" height="18" fill="#a83a2b"/>`;
    // a blank plate at the rear (no characters)
    g += `<rect x="-236" y="-40" width="26" height="18" rx="2" fill="#efe9da" stroke="#000" stroke-width="2"/>`;
    return g + '</g>';
  }
  // a generic palm tree; base (x, y)
  const palm = (x, y, h, sway) => { let g = `<path d="M${x} ${y} Q${f1(x + 18 + sway)} ${f1(y - h * 0.5)} ${f1(x + 30 + sway)} ${f1(y - h)}" stroke="#5a4a38" stroke-width="18" fill="none"/>`;
    const tx = x + 30 + sway, ty = y - h; for (let i = 0; i < 7; i++) { const a = -Math.PI + i * Math.PI / 6, L = 130; g += `<path d="M${f1(tx)} ${f1(ty)} Q${f1(tx + Math.cos(a) * L * 0.6)} ${f1(ty + Math.sin(a) * L * 0.5 - 30)} ${f1(tx + Math.cos(a) * L)} ${f1(ty + Math.sin(a) * L * 0.4 + 40)}" stroke="#4a6048" stroke-width="16" fill="none" stroke-linecap="round"/>`; } return g; };
  // a generic bank front (columns, steps, a blank lintel, a door); centre x, base y
  function bankFront(x, y, w, col, o = {}) {
    const hgt = 560; let g = `<rect x="${x - w / 2}" y="${y - hgt}" width="${w}" height="${hgt}" fill="${col}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M${x - w / 2 - 30} ${y - hgt} L${x} ${y - hgt - 120} L${x + w / 2 + 30} ${y - hgt} Z" fill="${col}" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="${x - w / 2 + 40}" y="${y - hgt + 30}" width="${w - 80}" height="50" fill="#d8cdb6" stroke="${INK}" stroke-width="3"/>` + [0, 1, 2].map(i => `<rect x="${x - 120 + i * 90}" y="${y - hgt + 48}" width="60" height="12" fill="#9a8e78"/>`).join('');
    for (let i = 0; i < 4; i++) { const cx = x - w / 2 + 70 + i * (w - 140) / 3; g += `<rect x="${f1(cx - 22)}" y="${y - hgt + 100}" width="44" height="${hgt - 150}" fill="#efe6d4" stroke="${INK}" stroke-width="3"/><rect x="${f1(cx - 30)}" y="${y - hgt + 92}" width="60" height="16" fill="#e2d8c2"/>`; }
    g += `<rect x="${x - 70}" y="${y - 300}" width="140" height="250" fill="#2a2a28" stroke="${INK}" stroke-width="5"/><rect x="${x - 60}" y="${y - 290}" width="58" height="230" fill="#6d7a7c" opacity="0.6"/><rect x="${x + 2}" y="${y - 290}" width="58" height="230" fill="#6d7a7c" opacity="0.6"/>`;
    g += `<rect x="${x - w / 2 - 20}" y="${y - 50}" width="${w + 40}" height="25" fill="#d0c6b0" stroke="${INK}" stroke-width="3"/><rect x="${x - w / 2 - 40}" y="${y - 25}" width="${w + 80}" height="25" fill="#c4baa4" stroke="${INK}" stroke-width="3"/>`;
    return g;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a small-town bank lobby: warm cream walls, two tall windows (left), a wall clock, a framed blank notice, a wooden
    // teller counter in front with a low glass screen. o.counter = false hides the counter (the figures then stand free).
    or44_bank(ctx, o = {}) {
      const t = ctx.t, r = R(4401);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#cbbb9c"/><rect x="-300" y="860" width="${W + 600}" height="40" fill="#a8977a"/>`;
      back += `<rect x="-300" y="900" width="${W + 600}" height="400" fill="#b4a283"/>`;
      // tall windows with warm light
      [[-60, 120], [250, 120]].forEach(([wx, wy]) => { back += `<rect x="${wx}" y="${wy}" width="230" height="640" fill="#f3e2b8" stroke="#6a5a44" stroke-width="10"/><path d="M${wx + 115} ${wy} L${wx + 115} ${wy + 640} M${wx} ${wy + 320} L${wx + 230} ${wy + 320}" stroke="#6a5a44" stroke-width="8"/>` + wash(wx + 115, wy + 320, 220, 360, '#fff2cc', 0.3); });
      // the clock and a blank framed notice
      const ang = (t * 6) % 360;
      back += `<g transform="translate(780 300)"><circle r="80" fill="#f2ead8" stroke="#4a3e30" stroke-width="10"/>` + [...Array(12)].map((_, i) => `<rect x="-3" y="-70" width="6" height="14" fill="#4a3e30" transform="rotate(${i * 30})"/>`).join('') +
        `<path d="M0 0 L0 -42" stroke="#2a2420" stroke-width="7" transform="rotate(${f1(300 + t * 0.5)})"/><path d="M0 0 L0 -60" stroke="#2a2420" stroke-width="4" transform="rotate(${f1(ang)})"/><circle r="6" fill="#2a2420"/></g>`;
      back += `<rect x="660" y="460" width="260" height="190" fill="#e8dfcb" stroke="#6a5a44" stroke-width="8"/>` + [0, 1, 2, 3].map(i => `<rect x="690" y="${496 + i * 34}" width="${190 - (i % 2) * 50}" height="10" fill="#b5a88e"/>`).join('');
      // back counter line with teller windows (behind the teller)
      let mid = `<rect x="-300" y="700" width="${W + 600}" height="200" fill="#8a6e50" stroke="${INK}" stroke-width="4"/>`;
      for (let i = 0; i < 6; i++) mid += `<rect x="${-260 + i * 260}" y="720" width="220" height="160" fill="#7a5f44" stroke="#5a4532" stroke-width="3"/>`;
      // the front counter: a pale stone top and a panelled wooden face, with a low glass screen
      let front = '';
      if (o.counter !== false) {
        const cy = o.cy ?? 1100;
        front += `<path d="M-300 ${cy - 70} L${W + 300} ${cy - 70} L${W + 300} ${cy} L-300 ${cy} Z" fill="#ddd2bc" stroke="${INK}" stroke-width="5"/><path d="M-300 ${cy - 66} L${W + 300} ${cy - 66}" stroke="#f2ead8" stroke-width="4"/>`;
        front += `<rect x="-300" y="${cy}" width="${W + 600}" height="${H}" fill="#6e5236" stroke="${INK}" stroke-width="5"/>`;
        for (let i = 0; i < 7; i++) front += `<rect x="${-260 + i * 230}" y="${cy + 40}" width="190" height="300" fill="#7c5d3e" stroke="#4e3a26" stroke-width="4"/>`;
        if (o.glass !== false) front += `<rect x="-300" y="${cy - 330}" width="${W + 600}" height="260" fill="#dfe6e2" opacity="0.08"/><path d="M-300 ${cy - 330} L${W + 300} ${cy - 330}" stroke="#a89878" stroke-width="5" opacity="0.6"/>`;
        front += wash(560, cy - 40, 520, 90, '#fff2cc', 0.16);
      }
      let floor = `<rect x="-300" y="1300" width="${W + 600}" height="${H}" fill="#5e4c3a"/>`;
      for (let i = 0; i < 6; i++) floor += `<rect x="${f1(-300 + r() * 1400)}" y="${f1(1360 + r() * 400)}" width="${f1(120 + r() * 200)}" height="6" fill="#4e3e2e" opacity="0.6"/>`;
      return { light: { dir: -1, rim: '#ffe6b4', key: '#fff0d2' }, layers: [[0.1, back], [0.45, mid], [0.75, floor], [0.96, front]] };
    },

    // a sunny Gulf Coast street (generic), drawn wide for a slow pan: two bank fronts (left: 'robbery 1', right:
    // 'robbery 2'), palms, a pavement and a road; the sky warm
    or44_gulf(ctx, o = {}) {
      const t = ctx.t, sw = 6 * Math.sin(t * 0.9);
      let sky = `<defs><linearGradient id="orgsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fa2b0"/><stop offset="1" stop-color="#e8d6b4"/></linearGradient></defs><rect x="-900" y="-300" width="${W + 1800}" height="${H + 600}" fill="url(#orgsk)"/>` + wash(900, 300, 500, 260, '#fff2cc', 0.3);
      let far = '';
      for (let i = 0; i < 10; i++) far += `<rect x="${-900 + i * 300}" y="${760 - (i % 3) * 40}" width="240" height="${300 + (i % 3) * 40}" fill="#b9ad96" opacity="0.6"/>`;
      let mid = bankFront(80, 1180, 560, '#e4d8c0') + bankFront(1180, 1180, 560, '#d9cfb8') + palm(-330, 1180, 520, sw) + palm(620, 1190, 600, sw * 0.8) + palm(1680, 1180, 540, sw);
      let road = `<rect x="-900" y="1180" width="${W + 1800}" height="160" fill="#cfc4ae"/><rect x="-900" y="1180" width="${W + 1800}" height="8" fill="#a99e88"/><rect x="-900" y="1340" width="${W + 1800}" height="${H}" fill="#57524a"/>`;
      for (let i = 0; i < 12; i++) road += `<rect x="${-860 + i * 260}" y="1500" width="140" height="12" fill="#e8dcc0" opacity="0.6"/>`;
      return { light: { dir: -1, rim: '#fff0cc', key: '#fff4dc' }, layers: [[0.1, sky], [0.3, far], [0.7, mid], [1.0, road]] };
    },

    // a flat West Texas bank car park under a big sky (generic): a low bank building at left with a blank sign, a highway
    // beyond on the horizon, parked cars. o.lights 0..1 = red/blue police lights far down the highway
    or44_lot(ctx, o = {}) {
      const t = ctx.t, li = clamp(o.lights || 0, 0, 1);
      let sky = `<defs><linearGradient id="orlsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f8f9c"/><stop offset="0.75" stop-color="#e2cfa8"/><stop offset="1" stop-color="#e9c48a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#orlsk)"/>` + wash(700, 760, 600, 200, '#ffe2a8', 0.3);
      let far = `<rect x="-300" y="860" width="${W + 600}" height="60" fill="#a89a74"/><path d="M-300 880 L${W + 300} 868" stroke="#5a5650" stroke-width="12"/>`;
      for (let i = 0; i < 6; i++) far += `<rect x="${-200 + i * 260}" y="${840 - (i % 2) * 12}" width="${60 + (i % 3) * 30}" height="${30 + (i % 2) * 12}" fill="#8c8466" opacity="0.7"/>`;
      if (li > 0) { const ph = Math.sin(t * 12) > 0; far += wash(880, 862, 70, 30, ph ? '#d8453a' : '#4a6ad8', 0.7 * li) + wash(880, 862, 160, 60, ph ? '#d8453a' : '#4a6ad8', 0.25 * li) + `<rect x="860" y="852" width="40" height="16" rx="4" fill="#2a2a2a" opacity="${f1(li)}"/>`; }
      // the bank: a low tan building with a blank sign and a drive-up canopy
      let mid = `<rect x="-300" y="560" width="620" height="340" fill="#cdb894" stroke="${INK}" stroke-width="5"/><rect x="-300" y="540" width="660" height="40" fill="#8a6e50" stroke="${INK}" stroke-width="4"/>` +
        `<rect x="-80" y="600" width="300" height="80" fill="#efe6d2" stroke="${INK}" stroke-width="4"/>` + [0, 1].map(i => `<rect x="-50" y="${622 + i * 28}" width="${220 - i * 70}" height="12" fill="#b9ab8e"/>`).join('') +
        `<rect x="-260" y="720" width="160" height="180" fill="#3a3a36"/><rect x="0" y="730" width="260" height="110" fill="#7a8a8c" opacity="0.7"/>`;
      mid += `<rect x="1000" y="380" width="14" height="520" fill="#4a4a46"/><rect x="940" y="380" width="140" height="70" rx="6" fill="#d8cdb6" stroke="${INK}" stroke-width="4"/>`;
      // the car park
      let lot = `<rect x="-300" y="900" width="${W + 600}" height="${H}" fill="#8e877a"/>`;
      for (let i = 0; i < 6; i++) lot += `<path d="M${-200 + i * 240} 940 L${-260 + i * 260} 1200" stroke="#efe6d2" stroke-width="7" opacity="0.7"/>`;
      lot += sedan(-60, 1010, 0.42, '#7a8890') + sedan(560, 1000, 0.4, '#a89a84', { flip: -1 });
      return { light: { dir: -1, rim: '#ffe6b4', key: '#fff0d2' }, layers: [[0.05, sky], [0.25, far], [0.5, mid], [0.8, lot]] };
    },

    // a prison corridor (generic): painted block walls, a run of closed cell doors with small windows, caged lights
    or44_block(ctx, o = {}) {
      const t = ctx.t, r = R(4404);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#8d8a7c"/><rect x="-300" y="-300" width="${W + 600}" height="680" fill="#9d9a8a"/>`;
      for (let yy = 380; yy < 1240; yy += 64) for (let xx = -300 + ((yy / 64) % 2) * 100; xx < W + 300; xx += 200) back += `<rect x="${xx}" y="${yy}" width="196" height="60" fill="none" stroke="#7c796c" stroke-width="3"/>`;
      // the far end: a barred gate
      back += `<rect x="440" y="520" width="200" height="680" fill="#3e3e38"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${452 + i * 42}" y="520" width="8" height="680" fill="#6a6a60"/>`).join('') + wash(540, 760, 120, 260, '#f2ecd2', 0.25);
      let doors = '';
      [[-160, 0], [150, 1], [760, 2], [1060, 3]].forEach(([x, i]) => { doors += `<rect x="${x}" y="560" width="200" height="640" fill="#5c6a6a" stroke="${INK}" stroke-width="5"/><rect x="${x + 60}" y="640" width="80" height="110" fill="#1a1e20" stroke="${INK}" stroke-width="3"/><rect x="${x + 150}" y="880" width="30" height="12" fill="#3a4040"/>`; });
      let lights = '';
      [[200, 180], [540, 240], [880, 180]].forEach(([lx, ly], i) => { const fl = 0.86 + 0.14 * Math.sin(t * (i === 1 ? 9 : 1.4) + i); lights += `<rect x="${lx - 50}" y="${ly}" width="100" height="26" rx="8" fill="#f4f0dc" opacity="${f1(0.9 * fl)}"/>` + wash(lx, ly + 90, 280, 200, '#f4ecd2', f1(0.18 * fl)); });
      let floor = `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="#6a665a"/><rect x="-300" y="1200" width="${W + 600}" height="10" fill="#4e4b42"/>`;
      for (let i = 0; i < 6; i++) floor += `<ellipse cx="${f1(-100 + r() * 1300)}" cy="${f1(1300 + r() * 500)}" rx="${f1(80 + r() * 140)}" ry="${f1(8 + r() * 12)}" fill="#7a766a" opacity="0.6"/>`;
      return { light: { dir: 1, rim: '#f4ecd2', key: '#f4f0dc' }, layers: [[0.1, back], [0.3, lights], [0.55, doors], [1.0, floor]] };
    }
  });

  // the hero framing in the first and last shots (the loop): the envelope big and centred on the counter top
  const HERO = { x: 540, y: 1000, s: 1.0 };

  E.registerScenes({
    // 1 - hook (frame 1): the envelope big and centred on the counter; his silhouetted arm already sliding it towards the
    //     teller (right), the camera already pushing in; the teller looks down at it. The headline is burned in at the top
    //     until ~3 s, so overlays stay out of y 280-560 until then.
    or44_hook(ctx) {
      const t = ctx.t, T = ctx.T, bank = WT(ctx, 0, 5, 1.5), first = WT(ctx, 1, 5, 3.1);
      const ex = tt => lerp(440, 520, ease.out(seg(tt, 0, 1.6)));
      return E.cine.shot(ctx, {
        set: 'or44_bank', setOpts: { cy: 1100 }, grade: 'warm', dof: true, haze: 0.5,
        cam: { from: { x: 0, y: 20, z: 1.03 }, to: { x: 0, y: 40, z: 1.12 }, settle: true },
        shafts: { x: 160, n: 3, op: 0.12, w: 80 },
        figures: [
          { id: 'or44_teller', x: 880, y: 1560, scale: 0.86, dir: -1, turn: 0.5, pose: 'examine', expr: 'focused', depth: 0.9, gaze: [-0.6, 0.6],
            keys: [{ at: bank, expr: 'realise', dur: 0.4 }, { at: first, pose: 'hand_to_face', expr: 'shocked', dur: 0.5 }] },
          { id: 'or44_rountree', x: 90, y: 1900, scale: 1.12, dir: 1, turn: 0.35, pose: 'present', silhouette: 'warm', hat: HAT, depth: 1.0,
            keys: [{ at: 1.7, pose: 'stand', dur: 0.6 }, { at: first, pose: 'hands_together', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.01, accent: true, svg: tt => envelope(ex(tt), HERO.y, HERO.s * 0.92, tt, { glow: 0.7 + 0.3 * Math.sin(tt * 3), rot: -5 }) }
        ],
        tag: LIKE
      });
    },

    // 2 - where: the map fly-in over North America; the USA draws itself in; the pin lands on Abilene, Texas
    or44_map(ctx) {
      const T = ctx.T, why = WT(ctx, 0, 1, 0.4), n91 = WT(ctx, 0, 6, 1.5);
      return E.cine.shot(ctx, {
        set: 'mapflight', grade: 'none', haze: 0,
        setOpts: { geo: 'north_america', from: { center: [-97, 39], span: 58 }, to: { center: [-99.4, 32.6], span: 6.5 }, t0: 0.0, t1: T - 0.4,
          country: 'United States of America', country_at: 0.05, draw: true, tilt: true,
          pin: { ll: [-99.73, 32.45], label: 'ABILENE, TEXAS', at: 1.3, dx: 36, dy: 76, anchor: 'start', fs: 50 },
          labels: [{ ll: [-100, 40], text: 'USA', at: 0.2, fs: 48 }, { ll: [-102, 26.5], text: 'MEXICO', at: 0.4, fs: 40 }] },
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 0, z: 1.04 } },
        overlays: [{ type: 'label', at: n91 + 0.2, x: 60, y: 440, text: 'AUGUST 2003 · AGE 91', fs: 40, sub: 'Born December 1911' }],
        tag: 'ILLUSTRATION · MAP, NATURAL EARTH DATA'
      });
    },

    // 3 - the grudge: a loan office; a generic loan officer stamps a file; his silhouette stands across the desk, head
    //     bowed, then turns away (left to right) on 'even'
    or44_grudge(ctx) {
      const t = ctx.t, T = ctx.T, bl = WT(ctx, 0, 1, 0.2), bk = WT(ctx, 0, 6, 1.3), ev = WT(ctx, 1, 4, 3.1);
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'warm', haze: 0.6,
        cam: { from: { x: -30, y: 20, z: 1.0 }, to: { x: 20, y: 30, z: 1.08 } },
        figures: [
          { id: 'or44_banker', x: 760, y: 1500, scale: 0.92, dir: -1, turn: 0.45, pose: 'sit_read', expr: 'stern', depth: 0.98,
            keys: [{ at: bk - 0.3, pose: 'present', expr: 'stern', gaze: [-0.8, 0.1], dur: 0.4 }, { at: ev - 0.4, pose: 'arms_crossed', dur: 0.5 }] },
          { id: 'or44_rountree', x: 250, y: 1660, scale: 1.02, dir: 1, turn: 0.4, pose: 'stand_tense', silhouette: 'warm', hat: HAT, depth: 1.04,
            keys: [{ at: bk, pose: 'bowed', dur: 0.5 }, { at: ev - 0.2, pose: 'hands_together', headTurn: 0.4, dur: 0.6 }] }
        ],
        props: [
          // a plain folder on the desk; a stamp mark appears on 'bankruptcy' (no lettering)
          { depth: 1.07, svg: tt => `<g transform="translate(560 1205) rotate(-4)"><rect x="-150" y="-30" width="300" height="40" rx="4" fill="#d8c8a0" stroke="${INK}" stroke-width="4"/>` +
              (tt > bk ? `<rect x="40" y="-24" width="90" height="26" rx="4" fill="none" stroke="#7a3a2a" stroke-width="5" opacity="${f1(0.8 * seg(tt, bk, bk + 0.2))}"/>` : '') + `</g>` }
        ],
        overlays: [
          { type: 'card', at: bl, x: 60, y: 430, w: 900, rows: [{ text: 'HIS OWN ACCOUNT (2001 INTERVIEW):', fs: 30 }, { text: 'A CORPUS CHRISTI BANK FORCED', fs: 34, at: bk - 0.4 }, { text: 'HIM INTO BANKRUPTCY', fs: 34, at: bk }] }
        ],
        tag: LIKE
      });
    },

    // 4 - robberies 1 and 2: one slow pan along a sunny street as his silhouette walks left to right from the first bank
    //     (Biloxi) to the second (Pensacola); on 'prison' he stops, hands behind his back
    or44_first(ctx) {
      const t = ctx.t, T = ctx.T, bx = WT(ctx, 0, 1, 0.3), pr = WT(ctx, 0, 2, 0.9), pn = WT(ctx, 1, 1, 2.5), pz = WT(ctx, 1, 5, 4.2);
      const wk = { at: 0.1, dur: Math.max(1.2, pz - 0.3), cadence: 4.4, stride: 16, from: 60, to: 1060 };
      return E.cine.shot(ctx, {
        set: 'or44_gulf', grade: 'warm', haze: 0.5,
        cam: { from: { x: -300, y: 40, z: 1.0 }, to: { x: 430, y: 40, z: 1.0 } },
        figures: [
          { id: 'or44_rountree', x: 60, y: 1440, scale: 0.78, dir: 1, turn: 0.45, pose: 'walk', silhouette: 'warm', hat: HAT, depth: 1.0, walk: wk,
            keys: [{ at: pz - 0.25, pose: 'stand', dur: 0.3 }, { at: pz + 0.1, pose: 'hands_behind', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'label', at: bx - 0.1, x: 60, y: 440, text: '1 · BILOXI, MISSISSIPPI · 1998', fs: 38, sub: 'Probation, a fine, told to leave the state', until: pn - 0.3 },
          { type: 'label', at: pn - 0.05, x: 60, y: 440, text: '2 · PENSACOLA, FLORIDA · 1999', fs: 38, sub: 'Three years in prison · out in 2002' }
        ],
        tag: LIKE
      });
    },

    // 5 - robbery 3 (the bank in Abilene): over his shoulder, the teller reads the envelope (rack focus onto it on
    //     'envelope'); she asks twice if he is joking; the fun fact card
    or44_envelope(ctx) {
      const t = ctx.t, T = ctx.T, ab = WT(ctx, 0, 1, 0.3), hd = WT(ctx, 0, 3, 1.2), en = WT(ctx, 0, 7, 2.1), rb = WT(ctx, 0, 9, 2.8), l2 = LS(ctx, 1, 3.9), tw = WT(ctx, 1, 2, 4.4);
      const ex = tt => lerp(380, 600, ease.inOut(seg(tt, hd - 0.2, en + 0.4)));
      return E.cine.shot(ctx, {
        set: 'or44_bank', setOpts: { cy: 1180 }, grade: 'warm', dof: true, haze: 0.6,
        cam: { from: { x: -20, y: 30, z: 1.0 }, to: { x: 10, y: 50, z: 1.1 }, settle: true },
        shafts: { x: 140, n: 3, op: 0.14, w: 90 },
        rack: { at: en - 0.2, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'or44_teller', x: 740, y: 1600, scale: 0.92, dir: -1, turn: 0.45, pose: 'stand', expr: 'neutral', depth: 0.9,
            keys: [{ at: en, pose: 'read', expr: 'focused', gaze: [-0.5, 0.6], dur: 0.5 }, { at: l2, pose: 'examine', expr: 'realise', dur: 0.4 }, { at: tw + 0.3, pose: 'hands_together', expr: 'worried', dur: 0.5 }] },
          { id: 'or44_rountree', x: 150, y: 1960, scale: 1.16, dir: 1, turn: 0.3, pose: 'stand', silhouette: 'warm', hat: HAT, depth: 1.0,
            keys: [{ at: hd - 0.2, pose: 'present', dur: 0.5 }, { at: rb + 0.4, pose: 'stand', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.01, accent: true, svg: tt => envelope(ex(tt), 1110, 0.62, tt, { glow: 0.8, rot: -4 }) },
          { depth: 1.0, svg: tt => tt > tw + 0.4 ? plainEnv(860, 1120, 0.5 * ease.out(seg(tt, tw + 0.4, tw + 0.9)) + 0.001) : '' }
        ],
        overlays: [
          { type: 'label', at: ab - 0.1, x: 60, y: 440, text: '3 · ABILENE, TEXAS · 2003', fs: 40, sub: 'He left with about $2,000' },
          { type: 'funfact', at: l2 - 0.1, y: 600, rows: [{ text: 'THE TELLER ASKED HIM TWICE' }, { text: 'IF HE WAS JOKING.' }] }
        ],
        tag: LIKE
      });
    },

    // 6 - the getaway (the only handheld shot): his car pulls out of the car park left to right; a customer in the
    //     foreground writes the plate on a slip; police lights far down the highway; the single impact + shake on 'stopped'
    or44_plate(ctx) {
      const t = ctx.t, T = ctx.T, wit = WT(ctx, 0, 1, 0.2), pl = WT(ctx, 0, 4, 1.2), of = WT(ctx, 1, 0, 2.0), st = WT(ctx, 1, 1, 2.5), mi = WT(ctx, 1, 4, 3.2);
      const cx = tt => lerp(-240, 1300, ease.in(seg(tt, 0.1, pl + 0.6)));
      return E.cine.shot(ctx, {
        set: 'or44_lot', setOpts: { lights: seg(t, of - 0.2, of + 0.4) }, grade: 'warm', haze: 0.6,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 50, z: 1.08 }, handheld: 0.12 },
        shake: [{ at: st, amp: 3 }],
        figures: [
          { id: 'or44_witness', x: 800, y: 1640, scale: 0.98, dir: -1, turn: 0.45, pose: 'stand_tense', expr: 'focused', depth: 1.02, gaze: [-0.9, -0.1],
            keys: [{ at: wit, pose: 'point', expr: 'determined', gaze: [0.6, -0.2], dur: 0.4 }, { at: pl - 0.2, pose: 'read', expr: 'focused', dur: 0.4 }, { at: st + 0.2, pose: 'read', expr: 'relieved', dur: 0.5 }] },
          { id: 'or44_teller', x: 160, y: 1180, scale: 0.6, dir: 1, turn: 0.5, pose: 'stand_tense', expr: 'worried', depth: 0.82,
            keys: [{ at: wit + 0.2, pose: 'point', gaze: [0.9, 0], dur: 0.4 }, { at: of, pose: 'hand_to_face', dur: 0.5 }] }
        ],
        props: [{ depth: 0.9, svg: tt => sedan(cx(tt), 1240, 0.62, '#6e5a46') }],
        overlays: [
          { type: 'impact', at: st, x: 880, y: 860 },
          { type: 'label', at: st + 0.1, x: 60, y: 440, text: 'STOPPED ABOUT 20 MILES AWAY', fs: 38, sub: 'About 30 minutes after the robbery' }
        ],
        tag: LIKE
      });
    },

    // 7 - the LESSON (save trigger): a kitchen table; an older man looks over a pile of bills; a younger relative sits down
    //     beside him; the checklist card with the SAVE ribbon (captions off)
    or44_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 4, 1.3);
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'warm', haze: 0.6, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'or44_grandad', x: 330, y: 1480, scale: 0.84, dir: 1, turn: 0.5, pose: 'sit_read', expr: 'worried', depth: 1.0,
            keys: [{ at: sv, pose: 'hand_to_face', expr: 'sad', dur: 0.6 }, { at: sv + 1.0, pose: 'sit', expr: 'relieved', gaze: [0.8, 0], dur: 0.6 }] },
          { id: 'or44_grandkid', x: 760, y: 1480, scale: 0.84, dir: -1, turn: 0.5, pose: 'sit', expr: 'focused', depth: 1.0, gaze: [-0.8, 0.2],
            keys: [{ at: 0.6, pose: 'present', expr: 'worried', dur: 0.6 }, { at: sv + 0.8, pose: 'hands_together', expr: 'relieved', dur: 0.6 }] }
        ],
        props: [{ depth: 1.07, svg: `<g transform="translate(470 1172)">${[0, 1, 2, 3].map(i => `<rect x="${-120 + i * 18}" y="${-14 - i * 7}" width="170" height="16" rx="2" fill="${i % 2 ? '#efe6d2' : '#e2d6bc'}" stroke="${INK}" stroke-width="3" transform="rotate(${i * 4 - 6})"/>`).join('')}</g>` }],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 430, rows: [{ text: 'BILLS SUDDENLY UNPAID', fs: 42 }, { text: 'ODD, LARGE WITHDRAWALS', fs: 42 }, { text: "A NEW 'HELPER' WITH MONEY", fs: 42 }, { text: 'WA Dept. of Financial Institutions · GA Bankers Assn.', fs: 24, colour: '#c8b89e' }] }
        ],
        tag: TAG
      });
    },

    // 8 - the statistic: a prison corridor; an older prisoner walks slowly with an officer; the counter 1x -> 4x with the
    //     source credit row beneath it
    or44_stat(ctx) {
      const t = ctx.t, T = ctx.T, f5 = WT(ctx, 0, 2, 1.3), qd = WT(ctx, 0, 6, 2.8);
      const W0 = { at: 0.1, dur: Math.max(1.5, T - 0.4), cadence: 3.6, stride: 12 };
      return E.cine.shot(ctx, {
        set: 'or44_block', grade: 'none', haze: 0.6,
        cam: { from: { x: 0, y: 20, z: 1.0 }, to: { x: 0, y: 40, z: 1.08 } },
        figures: [
          { id: 'or44_inmate', x: 300, y: 1700, scale: 0.76, dir: 1, turn: 0.45, pose: 'walk', expr: 'blank', depth: 1.0, walk: { ...W0, from: 300, to: 560 },
            keys: [{ at: qd + 0.3, pose: 'stand', expr: 'sad', dur: 0.5 }] },
          { id: 'or44_officer', x: 80, y: 1730, scale: 0.78, dir: 1, turn: 0.45, pose: 'walk', expr: 'neutral', depth: 1.01, walk: { ...W0, from: 80, to: 330 },
            keys: [{ at: qd + 0.4, pose: 'stand', expr: 'focused', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'counter', at: f5 - 0.2, dur: 1.6, from: 1, to: 4, suffix: '×', label: 'PRISONERS AGED 55+', y: 600, fs: 170 },
          { type: 'label', at: f5, x: 120, y: 770, text: 'IN US PRISONS · 2000 TO 2022', fs: 34, sub: 'Source: ACLU & UT Austin LBJ School, 2025' }
        ],
        tag: TAG
      });
    },

    // 9 - the outcome on the hero object in the first frame's framing (the loop): the envelope centred on the counter; the
    //     sentence card sits BELOW the burned-in end question (which covers y ~290-690 over the last 3.6 s)
    or44_end(ctx) {
      const t = ctx.t, T = ctx.T, th = WT(ctx, 0, 0, 0.1), tw = WT(ctx, 0, 5, 1.8), di = WT(ctx, 1, 1, 3.4);
      return E.cine.shot(ctx, {
        set: 'or44_bank', setOpts: { cy: 1100 }, grade: 'warm', dof: true, haze: 0.5,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 0, y: 40, z: 1.1 }, settle: true },
        shafts: { x: 160, n: 3, op: 0.1, w: 80 },
        figures: [
          { id: 'or44_teller', x: 820, y: 1560, scale: 0.86, dir: -1, turn: 0.5, pose: 'stand', expr: 'neutral', depth: 0.9,
            keys: [{ at: tw, pose: 'hands_together', expr: 'sad', dur: 0.6 }, { at: di, pose: 'bowed', expr: 'sad', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.01, accent: true, svg: tt => envelope(HERO.x, HERO.y, HERO.s * 0.92, tt, { glow: 0.8 + 0.2 * Math.sin(tt * 3), rot: -5 }) }
        ],
        overlays: [
          { type: 'card', at: th + 0.05, until: T - 3.75, x: 60, y: 430, w: 960, rows: [{ text: 'JAN 2004 · AGED 92 · 151 MONTHS', fs: 34 }] }
        ],
        tag: LIKE
      });
    }
  });
})();
