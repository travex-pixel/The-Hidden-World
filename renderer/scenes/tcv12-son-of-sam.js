/* Case File 12 (cinematic): Son of Sam - how a parking ticket caught New York's most feared killer (1976-77).
   CLOSED: guilty plea (8 May 1978) and sentence (12 June 1978).
   Content rules:
   - Berkowitz is alive: he appears ONLY as an anonymous rim-lit silhouette (characters/figures/ss12_berk.json), only
     walking to his car, being arrested and standing in court; those shots carry 'ILLUSTRATION · NOT A LIKENESS'.
   - The shootings, the victims, any weapon and any crime scene are never depicted. The Brooklyn street is a generic
     illustration, tagged as not the crime scene. Victims and survivors are not named.
   - The witness is a generic, unnamed silhouette with her dog. Police are generic 1970s figures with no badges, patches
     or logos.
   - The letters are never quoted or shown: the envelopes are plain and blank.
   - HERO OBJECT: the parking ticket is the series' own generic design (no agency name, seal or real form layout). It fills
     the first frame and the last frame, so the video loops.
   New environments (E.registerSets): ss12_street, ss12_precinct, ss12_yonkers.
   Timing: actions are keyed to the narrator's word timings (WT). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const TYPE = "font-family=\"Courier Prime\"";
  const NUN = "font-family=\"Nunito\" font-weight=\"800\"";
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const shade = (c, k) => E.fig.shade(c, k);
  const LIKENESS = 'ILLUSTRATION · NOT A LIKENESS';
  const STREET_TAG = 'ILLUSTRATION · GENERIC STREET, NOT THE CRIME SCENE';
  const CREAM = '#e6d9b0';

  // ---------- the hero object: a generic parking ticket (our own design, no agency name, seal or real form layout)
  // centred at (cx, cy); 640 x 380 at sc = 1
  function ticketCard(cx, cy, sc, rot = 0, op = 1) {
    const w = 640, h = 380, x0 = -w / 2, y0 = -h / 2;
    let g = `<g opacity="${f1(op)}" transform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(rot)}) scale(${(Math.max(0.001, sc)).toFixed(4)})">`;
    g += `<rect x="${x0 + 16}" y="${y0 + 22}" width="${w}" height="${h}" rx="12" fill="#000" opacity="0.5"/>`;
    g += `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="12" fill="#f3ecd6" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M${x0} ${y0 + 12} Q${x0} ${y0} ${x0 + 12} ${y0} L${-x0 - 12} ${y0} Q${-x0} ${y0} ${-x0} ${y0 + 12} L${-x0} -96 L${x0} -96 Z" fill="#e0a92a" stroke="${INK}" stroke-width="6"/>`;
    g += `<text x="0" y="-122" text-anchor="middle" ${NUN} font-size="60" letter-spacing="3" fill="#1a1510">PARKING TICKET</text>`;
    g += `<line x1="196" y1="-96" x2="196" y2="${-y0}" stroke="#8a8270" stroke-width="4" stroke-dasharray="10 9"/>`;
    g += `<text x="-292" y="-56" ${TYPE} font-weight="700" font-size="24" fill="#6b665c">VIOLATION</text>`;
    g += `<text x="-294" y="6" ${NUN} font-size="58" fill="#b3261e">FIRE HYDRANT</text>`;
    g += `<text x="-292" y="54" ${TYPE} font-weight="700" font-size="24" fill="#6b665c">PLACE · DATE</text>`;
    g += `<text x="-292" y="96" ${TYPE} font-weight="700" font-size="34" fill="#1a1915">BROOKLYN · 31 JULY 1977</text>`;
    g += `<path d="M-290 146 q 18 -20 36 0 t 36 0 t 36 0 t 36 0 M-130 150 q 14 -16 28 0 t 28 0 t 28 0 L-10 150" stroke="#2a3a8a" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    for (let i = 0; i < 9; i++) g += `<rect x="${222 + i * 9}" y="-70" width="${i % 3 ? 4 : 7}" height="120" fill="#3a352c"/>`;
    g += `<rect x="216" y="74" width="84" height="70" rx="6" fill="none" stroke="#8a8270" stroke-width="4"/><path d="M226 120 l18 -26 l14 18 l16 -22" stroke="#2a3a8a" stroke-width="5" fill="none"/>`;
    return g + '</g>';
  }
  // a small ticket tucked under a wiper (world space, local to the car)
  const wiperTicket = k => `<g opacity="${f1(k)}" transform="translate(318 -482) rotate(-40)"><rect x="-52" y="-74" width="104" height="132" rx="4" fill="#f3ecd6" stroke="#000" stroke-width="5"/><rect x="-52" y="-74" width="104" height="30" fill="#e0a92a" stroke="#000" stroke-width="4"/><path d="M-36 -10 L36 -10 M-36 12 L24 12 M-36 34 L30 34" stroke="#6b665c" stroke-width="5"/></g>`;

  // ---------- generic props
  // a generic 1970s full-size sedan, side view, front to the right (flip: front to the left); ground at y; 2330 x 630 at s = 1
  function car70(x, y, s, col = '#2a2e38', o = {}) {
    const fl = o.flip ? -1 : 1, dk = shade(col, 0.6), lt = shade(col, 1.18);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * fl * 1000) / 1000} ${f1(s * 1000) / 1000})"><ellipse cx="0" cy="8" rx="1260" ry="44" fill="#000" opacity="0.5"/>`;
    g += `<path d="M-1165 -160 L-1165 -350 Q-1158 -405 -1100 -412 L-715 -420 L-575 -606 Q-556 -628 -515 -630 L70 -630 Q118 -628 142 -606 L392 -432 L1095 -418 Q1158 -410 1165 -352 L1165 -160 Q1160 -128 1120 -124 L-1120 -124 Q-1160 -128 -1165 -160 Z" fill="${col}" stroke="#000" stroke-width="9"/>`;
    g += `<path d="M-1165 -262 L1165 -262 L1165 -160 Q1160 -128 1120 -124 L-1120 -124 Q-1160 -128 -1165 -160 Z" fill="${dk}" opacity="0.6"/>`;
    g += `<path d="M-540 -600 L-172 -600 L-172 -444 L-690 -444 Z M-142 -600 L96 -600 L345 -444 L-142 -444 Z" fill="#10141c"/>`;
    g += `<path d="M-470 -592 L-400 -592 L-540 -452 L-610 -452 Z M40 -592 L90 -592 L220 -452 L170 -452 Z" fill="#cfe0ff" opacity="0.13"/>`;
    g += `<path d="M-1150 -330 L1150 -330" stroke="#d9dde2" stroke-width="8" opacity="0.75"/><path d="M-1100 -412 L-715 -420 M392 -432 L1095 -418" stroke="${lt}" stroke-width="6" opacity="0.6"/>`;
    g += `<path d="M-160 -444 L-160 -140 M386 -432 L386 -140" stroke="#000" stroke-width="5" opacity="0.6"/><rect x="-320" y="-398" width="70" height="12" rx="5" fill="#c9ced4"/><rect x="230" y="-398" width="70" height="12" rx="5" fill="#c9ced4"/>`;
    for (const wx of [-740, 760]) g += `<path d="M${wx - 152} -124 A152 152 0 0 1 ${wx + 152} -124 Z" fill="#06070a"/><circle cx="${wx}" cy="-112" r="112" fill="#0d0d10" stroke="#000" stroke-width="6"/><circle cx="${wx}" cy="-112" r="58" fill="#a9b0b8" stroke="#000" stroke-width="5"/><circle cx="${wx}" cy="-112" r="18" fill="#5a6068"/>`;
    g += `<rect x="1128" y="-302" width="64" height="100" rx="18" fill="#c9ced4" stroke="#000" stroke-width="6"/><rect x="-1192" y="-302" width="64" height="100" rx="18" fill="#c9ced4" stroke="#000" stroke-width="6"/>`;
    g += `<rect x="1146" y="-386" width="22" height="58" rx="6" fill="#f4eccc"/><rect x="-1170" y="-386" width="22" height="66" fill="#b3261e"/>`;
    g += `<path d="M386 -440 L262 -530" stroke="#0a0a0c" stroke-width="8" stroke-linecap="round"/>`;
    if (o.ticket) g += wiperTicket(o.ticket);
    if (o.dim) g += `<path d="M-1165 -630 L1165 -630 L1165 0 L-1165 0 Z" fill="#05060a" opacity="0.35"/>`;
    return g + '</g>';
  }
  // a generic street fire hydrant; base at (x, y); ~420 tall at s = 1 (matches a figure at scale 1)
  function hydrant(x, y, s) {
    const b = '#b9c0c6', cap = '#c8312b';
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})"><ellipse cx="0" cy="6" rx="120" ry="20" fill="#000" opacity="0.5"/>` +
      `<rect x="-80" y="-48" width="160" height="48" rx="8" fill="${shade(b, 0.7)}" stroke="#000" stroke-width="6"/>` +
      `<rect x="-112" y="-236" width="224" height="56" rx="10" fill="${b}" stroke="#000" stroke-width="6"/><rect x="-128" y="-244" width="24" height="72" rx="6" fill="${cap}" stroke="#000" stroke-width="5"/><rect x="104" y="-244" width="24" height="72" rx="6" fill="${cap}" stroke="#000" stroke-width="5"/>` +
      `<rect x="-60" y="-304" width="120" height="260" rx="14" fill="${b}" stroke="#000" stroke-width="6"/><rect x="-52" y="-296" width="34" height="244" rx="10" fill="#fff" opacity="0.2"/>` +
      `<circle cx="0" cy="-196" r="36" fill="${cap}" stroke="#000" stroke-width="6"/><rect x="-72" y="-322" width="144" height="28" rx="8" fill="${cap}" stroke="#000" stroke-width="6"/>` +
      `<path d="M-58 -322 Q -58 -396 0 -400 Q 58 -396 58 -322 Z" fill="${cap}" stroke="#000" stroke-width="6"/><rect x="-15" y="-428" width="30" height="32" rx="4" fill="${shade(cap, 0.7)}" stroke="#000" stroke-width="5"/></g>`;
  }
  // a walking dog (dark silhouette); feet at (x, y); dir 1 = facing right
  function dog(x, y, s, t, dir = 1, walking = true) {
    const ph = walking ? t * 10 : 0, bob = walking ? -Math.abs(Math.sin(ph)) * 6 : 0;
    const leg = (x0, a) => { const an = (walking ? Math.sin(ph + a) * 26 : 0) * Math.PI / 180; return `<path d="M${x0} -150 L${f1(x0 + Math.sin(an) * 150)} ${f1(-150 + Math.cos(an) * 150)}" stroke="#16120f" stroke-width="20" stroke-linecap="round"/>`; };
    return `<g transform="translate(${f1(x)} ${f1(y + bob)}) scale(${f1(dir * s * 1000) / 1000} ${f1(s * 1000) / 1000})"><ellipse cx="0" cy="${f1(4 - bob)}" rx="140" ry="16" fill="#000" opacity="0.45"/>` +
      leg(-70, 0) + leg(70, Math.PI) + leg(-56, Math.PI) + leg(84, 0) +
      `<ellipse cx="6" cy="-178" rx="112" ry="48" fill="#1c1814" stroke="#000" stroke-width="5"/><path d="M84 -196 L128 -262" stroke="#1c1814" stroke-width="40" stroke-linecap="round"/>` +
      `<ellipse cx="146" cy="-272" rx="46" ry="34" fill="#1c1814" stroke="#000" stroke-width="5"/><path d="M176 -276 L214 -262 L180 -250 Z" fill="#1c1814"/><path d="M126 -296 L118 -340 L146 -302 Z" fill="#0e0b09"/>` +
      `<path d="M-100 -190 Q -150 -236 ${f1(-160 + 10 * Math.sin(t * 14))} -268" stroke="#1c1814" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M110 -230 L120 -214" stroke="#c8312b" stroke-width="10"/></g>`;
  }
  const envelope = (x, y, s, rot) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})"><rect x="-150" y="-95" width="300" height="190" rx="6" fill="#ece4d0" stroke="${INK}" stroke-width="5"/><path d="M-150 -95 L0 15 L150 -95" stroke="#a89c84" stroke-width="5" fill="none"/><rect x="60" y="-80" width="60" height="44" fill="none" stroke="#a89c84" stroke-width="3"/></g>`;
  const tag = (x, y, text, fs = 30) => `<g><rect x="${f1(x - text.length * fs * 0.32 - 18)}" y="${y - fs - 6}" width="${f1(text.length * fs * 0.64 + 36)}" height="${fs + 22}" rx="6" fill="#0b0b0d" opacity="0.88" stroke="#ffd23f" stroke-width="3"/><text x="${x}" y="${y + 4}" text-anchor="middle" ${TYPE} font-weight="700" font-size="${fs}" fill="#f4efe4">${text}</text></g>`;
  const typing = (from, to, a = 'sit_type', b = 'sit_type_b', step = 0.24) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? b : a, dur: step * 0.8 }); return k; };
  function typewriter(x, y, s) {
    let g = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-130 0 L-110 -70 L110 -70 L130 0 Z" fill="#2a3a34" stroke="${INK}" stroke-width="5"/><rect x="-120" y="-96" width="240" height="30" rx="10" fill="#1e2a26" stroke="${INK}" stroke-width="5"/><rect x="-70" y="-170" width="140" height="80" fill="#efe9da" stroke="${INK}" stroke-width="4"/>`;
    for (let rr = 0; rr < 3; rr++) for (let c = 0; c < 8; c++) g += `<circle cx="${-84 + c * 24 + rr * 6}" cy="${-50 + rr * 16}" r="7" fill="#c9c2b0"/>`;
    return g + '</g>';
  }
  const phone = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-60 0 L-46 -56 L46 -56 L60 0 Z" fill="#141414" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-30" r="22" fill="#2a2a2a" stroke="#555" stroke-width="3"/><path d="M-66 -70 Q 0 -96 66 -70 L60 -56 Q 0 -78 -60 -56 Z" fill="#141414" stroke="${INK}" stroke-width="4"/></g>`;
  function ticketPile(x, y, s, n = 7) { let g = `<g transform="translate(${x} ${y}) scale(${s})">`; for (let i = 0; i < n; i++) g += `<g transform="translate(${(i * 37) % 23 - 11} ${-i * 9}) rotate(${((i * 53) % 13) - 6})"><rect x="-80" y="-50" width="160" height="96" rx="4" fill="#f3ecd6" stroke="${INK}" stroke-width="4"/><rect x="-80" y="-50" width="160" height="22" fill="#e0a92a"/></g>`; return g + '</g>'; }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a 1977 Brooklyn residential street on a hazy summer night: brick row houses with stoops, trees, sodium lamps,
    // parked 1970s cars on both kerbs, our sidewalk with an optional fire hydrant, a cream sedan (o.car) and a lamp post.
    ss12_street(ctx, o = {}) {
      const t = ctx.t, r = R(1201), hz = o.haze ?? 0.8;
      const sky = `<defs><linearGradient id="ss12sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07080f"/><stop offset="0.55" stop-color="#1e1626"/><stop offset="1" stop-color="#5e3c30"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#ss12sky)"/>` + wash(540, 640, 900, 320, '#ff9a5a', f1(0.18 * hz));
      let far = '';
      [[-300, 520, 180], [-120, 600, 140], [20, 470, 120], [140, 560, 200], [340, 420, 90], [430, 540, 160], [590, 500, 120], [710, 590, 220], [930, 450, 110], [1040, 560, 260]].forEach(([x, top, w]) => {
        far += `<rect x="${x}" y="${top}" width="${w}" height="${900 - top}" fill="#140f18"/>`;
        for (let yy = top + 20; yy < 880; yy += 34) for (let xx = x + 10; xx < x + w - 14; xx += 26) if (r() < 0.16) far += `<rect x="${xx}" y="${yy}" width="10" height="14" fill="#ffd38a" opacity="${f1(0.25 + 0.4 * r())}"/>`;
      });
      let rowh = ''; const bricks = ['#3a2420', '#432a22', '#35221e', '#3e2822', '#462c24'];
      for (let i = 0; i < 7; i++) {
        const x = -320 + i * 250, top = 610 + (i % 3) * 26, w = 250;
        rowh += `<rect x="${x}" y="${top}" width="${w}" height="${1262 - top}" fill="${bricks[i % 5]}" stroke="${INK}" stroke-width="4"/><rect x="${x - 6}" y="${top - 20}" width="${w + 12}" height="26" fill="#24160f" stroke="${INK}" stroke-width="3"/>`;
        for (let fl = 0; fl < 3; fl++) for (let k = 0; k < 3; k++) {
          const wx = x + 26 + k * 74, wy = top + 40 + fl * 140, lit = r() < 0.42;
          rowh += `<rect x="${wx}" y="${wy}" width="48" height="92" fill="${lit ? '#ffcf86' : '#0e0d14'}" opacity="${lit ? f1(0.5 + 0.35 * r()) : 0.9}" stroke="#1a100c" stroke-width="4"/>` + (lit ? `<rect x="${wx}" y="${wy}" width="48" height="28" fill="#b9804a" opacity="0.55"/>` : '');
        }
        rowh += `<path d="M${x + 150} 1262 L${x + 150} 1160 L${x + 232} 1160 L${x + 232} 1262 Z" fill="#2a1a16" stroke="${INK}" stroke-width="3"/>` + [0, 1, 2, 3].map(k => `<line x1="${x + 150}" y1="${1180 + k * 22}" x2="${x + 232}" y2="${1180 + k * 22}" stroke="#4a3228" stroke-width="3"/>`).join('') + `<rect x="${x + 162}" y="1040" width="58" height="120" fill="#120c0a" stroke="${INK}" stroke-width="3"/>`;
      }
      const lampAcross = x => `<path d="M${x} 1262 L${x} 730" stroke="#0a0908" stroke-width="10"/><path d="M${x} 734 Q ${x + 30} 700 ${x + 80} 710" stroke="#0a0908" stroke-width="8" fill="none"/><ellipse cx="${x + 86}" cy="716" rx="22" ry="9" fill="#ffd08a"/>` + wash(x + 86, 730, 150, 100, '#ffb35a', 0.5) + `<path d="M${x + 70} 722 L${x - 70} 1262 L${x + 250} 1262 L${x + 102} 722 Z" fill="#ffb35a" opacity="0.07"/>`;
      rowh += lampAcross(70) + lampAcross(760);
      const tree = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 0 L0 -250" stroke="#0c0a08" stroke-width="22"/>` + [[-80, -320, 150], [60, -350, 140], [0, -420, 130], [-20, -290, 120]].map(([cx, cy, rr]) => `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="#0f1410" opacity="0.95"/>`).join('') + '</g>';
      const trees = [-140, 360, 1220].map((x, i) => tree(x, 1268, 0.9 + 0.12 * (i % 2))).join('');
      let farCars = `<rect x="-300" y="1262" width="${W + 600}" height="18" fill="#2a2a2e"/>`;
      [[-150, '#2a3a4a'], [520, '#4a2a2a'], [1180, '#2e3a2e']].forEach(([x, c]) => { farCars += car70(x, 1312, 0.27, c, { flip: true, dim: true }); });
      let road = `<rect x="-300" y="1300" width="${W + 600}" height="190" fill="#121218"/>`;
      [[150, '#ffb35a'], [840, '#ffb35a']].forEach(([x, c]) => { road += `<rect x="${x - 30}" y="1310" width="60" height="170" fill="${c}" opacity="0.1"/>`; });
      road += `<ellipse cx="520" cy="1410" rx="70" ry="14" fill="#08080c" stroke="#2a2a30" stroke-width="3"/>`;
      let near = `<rect x="-300" y="1478" width="${W + 600}" height="24" fill="#4a4a50"/><rect x="-300" y="1502" width="${W + 600}" height="${H}" fill="#26262c"/>`;
      for (let i = -3; i < 14; i++) near += `<line x1="${i * 130}" y1="1502" x2="${i * 175 - 260}" y2="${H + 200}" stroke="#16161a" stroke-width="3"/>`;
      near += [1600, 1760].map(y => `<line x1="-300" y1="${y}" x2="${W + 300}" y2="${y}" stroke="#16161a" stroke-width="3"/>`).join('');
      (o.cars || []).forEach(cc => { near += car70(cc.x, 1494, cc.s ?? 0.62, cc.col ?? '#2a2e38', { flip: cc.flip }); });
      if (o.car) near += car70(o.car.x, 1494, o.car.s ?? 0.62, o.car.col ?? CREAM, { ticket: o.car.ticket || 0, flip: o.car.flip });
      if (o.hydrant) near += hydrant(o.hydrant.x, o.hydrant.y, o.hydrant.s);
      if (o.lampX !== undefined) { const lx = o.lampX; near += wash(lx + 120, 1560, 360, 110, '#ffb35a', 0.22) + `<path d="M${lx} 1580 L${lx} 380" stroke="#0a0908" stroke-width="20"/><path d="M${lx} 392 Q ${lx + 50} 330 ${lx + 140} 344" stroke="#0a0908" stroke-width="13" fill="none"/><path d="M${lx + 104} 344 L${lx + 178} 344 L${lx + 162} 364 L${lx + 120} 364 Z" fill="#0a0908"/>` + wash(lx + 141, 372, 130, 70, '#ffd08a', 0.6) + `<path d="M${lx + 120} 364 L${lx - 140} 1580 L${lx + 420} 1580 L${lx + 162} 364 Z" fill="#ffc27a" opacity="0.05"/>`; }
      const haze = `<g opacity="${f1(hz)}">` + [0, 1, 2].map(i => `<ellipse cx="${f1(((t * 14 + i * 520) % 1700) - 300)}" cy="${1060 + i * 90}" rx="540" ry="80" fill="#ffb98a" filter="url(#cineSoft)" opacity="0.14"/>`).join('') + `</g>`;
      const moths = o.lampX !== undefined ? [0, 1, 2, 3].map(i => `<circle cx="${f1(o.lampX + 141 + 50 * Math.sin(t * (2.3 + i) + i * 2))}" cy="${f1(390 + 30 * Math.cos(t * (3.1 + i * 0.7) + i))}" r="3" fill="#fff0c8" opacity="0.7"/>`).join('') : '';
      const layers = [[0.05, sky], [0.14, far], [0.3, rowh], [0.36, trees], [0.5, farCars], [0.62, road], [0.8, haze], [1.0, near + moths]];
      return { light: { dir: -1, rim: '#ffb35a', key: '#ffc27a' }, layers };
    },

    // a 1970s precinct squad room at night: two-tone walls, fluorescent tubes, venetian blinds, a wall of pigeon-hole
    // ticket files (generic cards, illegible) and a desk with a typewriter, a phone and an optional pile of tickets.
    // o.interview = a darker interview corner (one hanging lamp, blinds shadow, no filing wall); o.slot = [col, row] glows.
    ss12_precinct(ctx, o = {}) {
      const t = ctx.t, r = R(1301), iv = !!o.interview;
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="${iv ? '#2e2e26' : '#a69e84'}"/><rect x="-300" y="820" width="${W + 600}" height="${H}" fill="${iv ? '#1e281c' : '#3e5446'}"/><rect x="-300" y="810" width="${W + 600}" height="16" fill="#26342a"/>`;
      back += `<rect x="-220" y="200" width="380" height="440" fill="#0b1224" stroke="${INK}" stroke-width="12"/>`;
      for (let i = 0; i < 70; i++) back += `<rect x="${f1(-210 + r() * 360)}" y="${f1(420 + r() * 200)}" width="6" height="8" fill="#ffd38a" opacity="${f1(0.3 + 0.5 * r())}"/>`;
      for (let i = 0; i < 15; i++) back += `<rect x="-220" y="${206 + i * 29}" width="380" height="15" fill="${iv ? '#3a3a30' : '#9a927a'}" opacity="0.92"/>`;
      if (!iv) {
        back += `<g transform="translate(300 300)"><circle r="56" fill="#efe9da" stroke="${INK}" stroke-width="8"/><path d="M0 0 L0 -36 M0 0 L26 12" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></g>`;
        back += `<rect x="1080" y="300" width="300" height="300" fill="#7a5a3a" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2, 3].map(i => `<rect x="${1100 + (i % 2) * 130}" y="${320 + Math.floor(i / 2) * 130}" width="100" height="110" fill="#e9e3d4" transform="rotate(${(i % 3) - 1} ${1150 + (i % 2) * 130} ${375 + Math.floor(i / 2) * 130})"/>`).join('');
      } else {
        for (let i = 0; i < 9; i++) back += `<path d="M300 ${200 + i * 70} L1400 ${380 + i * 70} L1400 ${405 + i * 70} L300 ${225 + i * 70} Z" fill="#000" opacity="0.18"/>`;
      }
      const flick = 0.85 + 0.15 * (Math.sin(t * 41) > 0.97 ? -1 : 0);
      const tubes = iv ? `<path d="M540 -300 L540 360" stroke="#0a0a0a" stroke-width="6"/><path d="M440 360 L640 360 L590 300 L490 300 Z" fill="#2a2a24" stroke="${INK}" stroke-width="5"/><path d="M440 360 L640 360 L1000 1300 L80 1300 Z" fill="#fff2cc" opacity="0.09"/>` + wash(540, 1200, 460, 120, '#fff2cc', 0.28)
        : [140, 760].map(x => `<rect x="${x}" y="40" width="340" height="26" rx="8" fill="#eef4e0" opacity="${f1(flick)}"/>` + wash(x + 170, 80, 320, 110, '#eef4e0', f1(0.35 * flick))).join('');
      let wall = '';
      if (!iv && o.wall !== false) {
        wall += `<rect x="400" y="230" width="660" height="980" fill="#5a4630" stroke="${INK}" stroke-width="8"/><rect x="560" y="246" width="340" height="40" rx="4" fill="#c9a356" stroke="${INK}" stroke-width="4"/><text x="730" y="276" text-anchor="middle" ${TYPE} font-weight="700" font-size="24" fill="#2a1e10">PARKING TICKETS</text>`;
        const [sc, sr] = o.slot || [-1, -1], gk = o.glow || 0;
        for (let rr = 0; rr < 11; rr++) for (let c = 0; c < 9; c++) {
          const x = 422 + c * 70, y = 304 + rr * 80, hit = c === sc && rr === sr;
          wall += `<rect x="${x}" y="${y}" width="62" height="72" fill="#1e160e" stroke="#3a2c1c" stroke-width="3"/>`;
          const n = 1 + ((c * 7 + rr * 3) % 3);
          for (let k = 0; k < n; k++) wall += `<rect x="${x + 6 + k * 6}" y="${y + 18 - k * 4}" width="44" height="50" fill="${hit ? '#fff4cf' : '#e9e0c6'}" opacity="${hit ? 1 : 0.85}" stroke="#8a7a5a" stroke-width="2"/><rect x="${x + 6 + k * 6}" y="${y + 18 - k * 4}" width="44" height="9" fill="#e0a92a" opacity="0.9"/>`;
          if (hit && gk > 0) wall += `<rect x="${x - 4}" y="${y - 4}" width="70" height="80" fill="none" stroke="#ffd23f" stroke-width="6" opacity="${f1(gk)}"/>` + wash(x + 31, y + 36, 80, 80, '#ffd23f', f1(0.4 * gk));
        }
      }
      let desk = `<rect x="-300" y="1206" width="${W + 600}" height="40" fill="#5a4632" stroke="${INK}" stroke-width="6"/><rect x="-300" y="1246" width="${W + 600}" height="${H}" fill="#2a2018"/>`;
      if (!iv) desk += typewriter(o.typeX ?? 860, 1206, 0.9) + phone(o.phoneX ?? 150, 1206);
      if (o.stack) desk += ticketPile(o.stackX ?? 560, 1196, 0.9, 9);
      if (iv) desk += `<rect x="330" y="1180" width="150" height="16" fill="#efe9da" transform="rotate(-6 400 1188)" stroke="${INK}" stroke-width="3"/><circle cx="740" cy="1194" r="26" fill="#3a3a3a" stroke="${INK}" stroke-width="4"/>`;
      return { light: { dir: 1, rim: iv ? '#fff2cc' : '#e8f0d8', key: '#fff2cc' }, layers: [[0.2, back + tubes], [0.45, wall], [1.0, ''], [1.08, desk]], dust: true };
    },

    // Yonkers at dusk / night: a hillside of lights, two brick apartment blocks with an entrance canopy, parked 1970s
    // cars on the kerb, a lamp post that comes on as it gets dark. o.dusk 0 (orange dusk) .. 1 (night); o.car = the cream car.
    ss12_yonkers(ctx, o = {}) {
      const t = ctx.t, dk = clamp(o.dusk ?? 0.3, 0, 1), r = R(1401);
      const sky = `<defs><linearGradient id="ss12ysky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1c3a"/><stop offset="0.6" stop-color="#6a4866"/><stop offset="1" stop-color="#f0a070"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#ss12ysky)"/><rect x="-300" y="-300" width="${W + 600}" height="1500" fill="#06081a" opacity="${f1(0.15 + 0.7 * dk)}"/>` +
        wash(820, 760, 520, 200, '#ff9a5a', f1(0.35 * (1 - dk)));
      let hills = `<path d="M-300 820 Q 0 690 300 760 T 900 700 T 1400 760 L1400 1000 L-300 1000 Z" fill="#141226"/>`;
      for (let i = 0; i < 80; i++) hills += `<circle cx="${f1(-250 + r() * 1600)}" cy="${f1(740 + r() * 230)}" r="${f1(1.2 + r() * 1.8)}" fill="#ffd9a0" opacity="${f1((0.2 + 0.5 * r()) * (0.4 + 0.6 * dk))}"/>`;
      let blocks = '';
      [[-160, 400, 620, '#5a3428'], [560, 320, 680, '#4e3024']].forEach(([x, top, w, c], bi) => {
        blocks += `<rect x="${x}" y="${top}" width="${w}" height="${1262 - top}" fill="${c}" stroke="${INK}" stroke-width="5"/><rect x="${x - 8}" y="${top - 18}" width="${w + 16}" height="24" fill="#2a1a14" stroke="${INK}" stroke-width="3"/>`;
        for (let yy = top + 40; yy < 1110; yy += 96) for (let xx = x + 36; xx < x + w - 60; xx += 92) { const lit = r() < 0.15 + 0.55 * dk; blocks += `<rect x="${xx}" y="${yy}" width="54" height="62" fill="${lit ? '#ffd38a' : '#141420'}" opacity="${lit ? f1(0.5 + 0.4 * r()) : 0.85}" stroke="#20120c" stroke-width="4"/>`; }
        if (bi === 1) for (let k = 0; k < 7; k++) blocks += `<path d="M${x + w - 150} ${top + 90 + k * 96} L${x + w - 40} ${top + 90 + k * 96} M${x + w - 140} ${top + 90 + k * 96} L${x + w - 60} ${top + 186 + k * 96}" stroke="#141010" stroke-width="5" fill="none"/>`;
      });
      blocks += `<rect x="40" y="1110" width="260" height="34" fill="#2a1e1a" stroke="${INK}" stroke-width="4"/><rect x="110" y="1144" width="120" height="118" fill="#ffd38a" opacity="${f1(0.35 + 0.4 * dk)}" stroke="${INK}" stroke-width="5"/>` + wash(170, 1200, 180, 90, '#ffd38a', f1(0.2 + 0.25 * dk));
      let farCars = `<rect x="-300" y="1262" width="${W + 600}" height="18" fill="#2a2a2e"/>`;
      [[-60, '#2a3442'], [700, '#3a2a2a']].forEach(([x, c]) => { farCars += car70(x, 1312, 0.27, c, { flip: true, dim: true }); });
      const road = `<rect x="-300" y="1300" width="${W + 600}" height="190" fill="${dk > 0.5 ? '#111117' : '#2a2630'}"/>` + wash(540, 1390, 700, 70, '#ffb98a', f1(0.12 * (1 - dk)));
      let near = `<rect x="-300" y="1478" width="${W + 600}" height="24" fill="#4e4c52"/><rect x="-300" y="1502" width="${W + 600}" height="${H}" fill="#2a2a30"/>`;
      for (let i = -3; i < 14; i++) near += `<line x1="${i * 130}" y1="1502" x2="${i * 175 - 260}" y2="${H + 200}" stroke="#18181c" stroke-width="3"/>`;
      (o.cars || []).forEach(cc => { near += car70(cc.x, 1494, cc.s ?? 0.62, cc.col ?? '#2a2e38', { flip: cc.flip }); });
      if (o.car) near += car70(o.car.x, 1494, o.car.s ?? 0.62, o.car.col ?? CREAM, { flip: o.car.flip });
      const lx = o.lampX ?? 980, on = clamp((dk - 0.2) / 0.3, 0, 1);
      near += `<path d="M${lx} 1580 L${lx} 420" stroke="#0a0908" stroke-width="20"/><path d="M${lx} 432 Q ${lx - 50} 370 ${lx - 140} 384" stroke="#0a0908" stroke-width="13" fill="none"/><path d="M${lx - 104} 384 L${lx - 178} 384 L${lx - 162} 404 L${lx - 120} 404 Z" fill="#0a0908"/>` +
        (on > 0 ? wash(lx - 141, 410, 130, 70, '#ffd08a', f1(0.6 * on)) + `<path d="M${lx - 120} 404 L${lx + 140} 1580 L${lx - 420} 1580 L${lx - 162} 404 Z" fill="#ffc27a" opacity="${f1(0.06 * on)}"/>` + wash(lx - 140, 1580, 360, 100, '#ffb35a', f1(0.22 * on)) : '');
      return { light: dk > 0.5 ? { dir: -1, rim: '#cfe0ff', key: '#ffd08a' } : { dir: 1, rim: '#ffb07a', key: '#ffc89a' }, layers: [[0.05, sky], [0.16, hills], [0.32, blocks], [0.5, farCars], [0.64, road], [1.0, near]] };
    }
  });

  // ---------- shots
  E.registerScenes({
    // 1 - hook: the hero ticket fills the first frame; on "parked" it flies onto the windshield of a car by a hydrant
    ss12_hook(ctx) {
      const t = ctx.t, fear = WT(ctx, 0, 9, 2.3), l2 = LS(ctx, 1, 4.06), prk = WT(ctx, 1, 2, 4.4), hyd = WT(ctx, 1, 6, 5.1);
      const CAR = { x: 100, s: 0.62 }, land = prk + 0.6;
      const WS = [CAR.x + 318 * CAR.s, 1494 - 482 * CAR.s];   // the wiper-ticket point (world, depth 1)
      const hero = (tt, c) => {
        if (tt > land + 0.05) return '';
        const u = ease.inOut(seg(tt, prk - 0.05, land)), [px, py] = E.cine.project(c, 1, WS[0], WS[1]);
        const dim = 0.5 * (1 - u), wob = 1 + 0.01 * Math.sin(tt * 3);
        return `<rect x="0" y="0" width="${W}" height="${H}" fill="#05060a" opacity="${f1(dim)}"/>` + ticketCard(lerp(540, px, u), lerp(960, py, u), lerp(1.2 * wob, 0.16, u), lerp(-3, -40, u));
      };
      return E.cine.shot(ctx, {
        set: 'ss12_street', setOpts: { car: { x: CAR.x, s: CAR.s, ticket: seg(t, land - 0.05, land + 0.1) }, hydrant: { x: 930, y: 1560, s: 0.62 }, lampX: 780, haze: 0.9 }, grade: 'night',
        cam: { keys: [{ at: 0, x: 0, y: 0, z: 1.0 }, { at: l2 - 0.3, x: 40, y: 120, z: 1.12, dur: 1.2 }], handheld: 2 },
        figures: [{ id: 'ss12_officer', x: 560, y: 1650, scale: 0.86, dir: -1, turn: 0.55, pose: 'read', expr: 'focused', gaze: [0.4, 0.6],
          keys: [{ at: fear, gaze: [0.6, 0.2], dur: 0.3 }, { at: prk + 0.1, pose: 'present', expr: 'neutral', gaze: [0.8, -0.1], dur: 0.45 }, { at: hyd - 0.1, pose: 'stand', headTurn: 0.6, gaze: [-0.6, 0.4], expr: 'stern', dur: 0.5 }] }],
        overlays: [
          { type: 'svg', at: -0.1, dur: 0.05, svg: hero },
          { type: 'label', at: land + 0.1, x: 60, y: 430, text: 'BROOKLYN · 31 JULY 1977', fs: 40, sub: 'The night of his last attack' },
          { type: 'callout', at: hyd - 0.1, target: [930, 1560 - 230 * 0.62], depth: 1, r: 70, label: [600, 780], w: 400, text: 'FIRE HYDRANT', colour: '#ffd23f' }
        ],
        tag: STREET_TAG
      });
    },

    // 2 - the toll, in summary only: a New Yorker at her kitchen table at night (no victim, no scene)
    ss12_fear(ctx) {
      const six = WT(ctx, 0, 0, 0.35), kil = WT(ctx, 0, 3, 1.1), sev = WT(ctx, 0, 4, 1.45);
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'warm', cam: { from: { x: -20, y: 10, z: 1.04 }, to: { x: 30, y: 30, z: 1.12 }, handheld: 1 },
        figures: [{ id: 'ss12_resident', x: 420, y: 1700, scale: 1.02, dir: 1, turn: 0.45, pose: 'sit_read', propOverride: 'newspaper', expr: 'focused', gaze: [0.5, 0.6],
          keys: [{ at: six - 0.1, expr: 'worried', dur: 0.4 }, { at: kil, pose: 'sit', gaze: [-0.7, -0.3], headTurn: -0.25, dur: 0.6 }, { at: sev + 0.2, expr: 'sad', gaze: [-0.3, 0.5], dur: 0.5 }] }],
        overlays: [{ type: 'card', at: six - 0.15, x: 80, y: 390, w: 920, rows: [{ text: 'NEW YORK CITY · JULY 1976 - JULY 1977', fs: 28, colour: '#6b665c' }, { text: '6 KILLED', fs: 60, colour: '#8e1f18', at: kil - 0.1 }, { text: '7 WOUNDED', fs: 46, at: sev - 0.05 }] }],
        tag: 'ILLUSTRATION · NOT A PHOTOGRAPH'
      });
    },

    // 3 - the letters (plain, blank envelopes; never quoted) and the name he gave himself
    ss12_letters(ctx) {
      const t = ctx.t, lt = WT(ctx, 0, 2, 0.6), pol = WT(ctx, 0, 4, 1.05), prs = WT(ctx, 0, 7, 1.7), l2 = LS(ctx, 1, 2.82), son = WT(ctx, 1, 4, 3.7);
      const env = () => {
        const a = ease.back(seg(t, pol - 0.15, pol + 0.3)), b = ease.back(seg(t, prs - 0.15, prs + 0.3)); let s = '';
        if (a > 0) s += `<g transform="translate(300 620) scale(${f1(a * 100) / 100}) translate(-300 -620)">${envelope(300, 600, 1.0, -6)}${tag(300, 760, 'TO POLICE')}</g>`;
        if (b > 0) s += `<g transform="translate(780 620) scale(${f1(b * 100) / 100}) translate(-780 -620)">${envelope(780, 600, 1.0, 5)}${tag(780, 760, 'TO THE PRESS')}</g>`;
        return s;
      };
      return E.cine.shot(ctx, {
        set: 'press_hall', grade: 'cold', cam: { from: { x: -20, y: 10, z: 1.08 }, to: { x: 30, y: 30, z: 1.0 }, handheld: 2 },
        figures: [{ id: 'press_operator', x: 860, y: 1640, scale: 0.72, dir: -1, turn: 0.45, pose: 'examine', expr: 'focused', gaze: [0.5, 0.5],
          walk: { from: 1180, to: 860, at: 0.0, dur: lt + 0.2, cadence: 6.4 }, keys: [{ at: lt + 0.25, pose: 'examine', dur: 0.3 }, { at: l2 - 0.2, pose: 'read_newspaper', expr: 'worried', gaze: [0.3, 0.5], dur: 0.6 }] }],
        overlays: [
          { type: 'label', at: 0.1, until: l2 - 0.2, x: 60, y: 420, text: 'APRIL - MAY 1977', fs: 40, sub: 'Letters to police and to a newspaper columnist' },
          { type: 'svg', at: 0, until: l2 - 0.15, svg: env },
          { type: 'card', at: l2 - 0.05, x: 80, y: 430, w: 920, rows: [{ text: 'HE CALLED HIMSELF', fs: 32, colour: '#6b665c' }, { text: "'SON OF SAM'", fs: 74, colour: '#8e1f18', at: son - 0.15 }] }
        ],
        tag: 'ILLUSTRATION · LETTERS NOT SHOWN'
      });
    },

    // 4 - FUN FACT: the "demon dog" story, which he later admitted was a hoax (detectives read his later statement)
    ss12_demon(ctx) {
      const clm = WT(ctx, 0, 2, 0.7), dg = WT(ctx, 0, 8, 2.4), l2 = LS(ctx, 1, 4.65), adm = WT(ctx, 1, 2, 5.0), hx = WT(ctx, 1, 6, 5.9);
      return E.cine.shot(ctx, {
        set: 'ss12_precinct', setOpts: { interview: true }, grade: 'cold',
        cam: { keys: [{ at: 0, x: -30, y: -40, z: 1.08 }, { at: l2 - 0.3, x: 20, y: -60, z: 1.16, dur: 1.2 }], handheld: 1.5 },
        figures: [
          { id: 'detective', x: 300, y: 1960, scale: 1.26, dir: 1, turn: 0.45, pose: 'read', expr: 'focused', gaze: [0.4, 0.7],
            keys: [{ at: clm, expr: 'stern', dur: 0.4 }, { at: dg, gaze: [0.9, -0.1], headTurn: 0.1, dur: 0.3 }, { at: adm - 0.1, pose: 'stand', expr: 'determined', gaze: [0.8, 0], dur: 0.5 }] },
          { id: 'agent_a', x: 860, y: 1990, scale: 1.22, dir: -1, turn: 0.45, pose: 'arms_crossed', expr: 'stern', gaze: [0.5, 0.2],
            keys: [{ at: dg + 0.2, pose: 'hand_to_face', expr: 'focused', dur: 0.5 }, { at: hx - 0.1, pose: 'arms_crossed', expr: 'determined', gaze: [0.8, 0], dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: clm - 0.2, until: l2 - 0.2, x: 60, y: 420, text: 'AFTER HIS ARREST, HE CLAIMED...', fs: 38, sub: 'A story, not a motive' },
          { type: 'funfact', at: adm - 0.12, y: 410, w: 920, fs: 42, rows: [{ text: 'He later admitted the' }, { text: "'demon dog' story" }, { text: 'was a hoax.', colour: '#ffd23f' }] },
          { type: 'stamp', at: hx - 0.05, x: 540, y: 860, text: 'HOAX', scale: 1.4, colour: '#e5372b' }
        ],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURES'
      });
    },

    // 5 - 31 July 1977, Brooklyn: the quiet street, wide (never the scene); a woman walks her dog under the lamps
    ss12_last(ctx) {
      const t = ctx.t, last = WT(ctx, 0, 4, 2.6), bk = WT(ctx, 0, 7, 3.4);
      const wk = { from: -120, to: 520, at: 0.2, dur: 4.2 };
      const wx = tt => lerp(wk.from, wk.to, clamp((tt - wk.at) / wk.dur, 0, 1));
      return E.cine.shot(ctx, {
        set: 'ss12_street', setOpts: { car: { x: 1150, s: 0.5 }, cars: [{ x: -480, s: 0.5, col: '#2a3240' }], hydrant: { x: 1500, y: 1560, s: 0.5 }, lampX: 120, haze: 1 }, grade: 'night',
        cam: { from: { x: 0, y: -60, z: 1.0 }, to: { x: 60, y: 0, z: 1.08 }, handheld: 1.2 },
        figures: [{ id: 'ss12_witness', x: wk.from, y: 1700, scale: 0.6, dir: 1, turn: 0.55, pose: 'stand', silhouette: 'warm', walk: { ...wk, cadence: 5.2 }, keys: [{ at: last, headTurn: -0.3, dur: 0.6 }, { at: bk + 0.3, headTurn: 0, dur: 0.6 }] }],
        props: [{ depth: 1.0, svg: tt => { const x = wx(tt), dx = x + 170, walking = tt > wk.at && tt < wk.at + wk.dur; return `<path d="M${f1(x + 40)} ${f1(1700 - 260)} Q ${f1(x + 110)} ${f1(1700 - 150)} ${f1(dx + 50)} ${f1(1700 - 125)}" stroke="#0e0b09" stroke-width="4" fill="none"/>` + dog(dx, 1700, 0.42, tt, 1, walking); } }],
        overlays: [{ type: 'label', at: 0.15, x: 60, y: 420, text: 'BROOKLYN · 31 JULY 1977', fs: 42, sub: 'His last attack. Generic street, not the scene' }],
        tag: STREET_TAG
      });
    },

    // 6 - the witness walks her dog past an officer ticketing a cream sedan parked by a hydrant
    ss12_witness(ctx) {
      const t = ctx.t, saw = WT(ctx, 0, 4, 1.5), tk = WT(ctx, 0, 6, 2.0), l2 = LS(ctx, 1, 3.81), hyd = WT(ctx, 1, 6, 4.9);
      const CAR = { x: 60, s: 0.62 }, wk = { from: -260, to: 330, at: 0.0, dur: saw + 0.1 };
      const wx = tt => lerp(wk.from, wk.to, clamp((tt - wk.at) / wk.dur, 0, 1));
      return E.cine.shot(ctx, {
        set: 'ss12_street', setOpts: { car: { x: CAR.x, s: CAR.s, ticket: seg(t, tk + 0.4, tk + 0.6) }, hydrant: { x: 880, y: 1556, s: 0.62 }, lampX: 1000, haze: 0.8 }, grade: 'night',
        cam: { keys: [{ at: 0, x: -40, y: 40, z: 1.04 }, { at: l2 - 0.3, x: 120, y: 120, z: 1.14, dur: 1.2 }], handheld: 2.5 },
        figures: [
          { id: 'ss12_officer', x: 520, y: 1640, scale: 0.84, dir: -1, turn: 0.5, pose: 'read', expr: 'focused', gaze: [0.5, 0.6],
            keys: [{ at: tk - 0.2, pose: 'present', gaze: [0.8, -0.1], dur: 0.45 }, { at: tk + 0.8, pose: 'read', dur: 0.4 }, { at: hyd - 0.2, headTurn: 0.6, gaze: [-0.6, 0.3], dur: 0.5 }] },
          { id: 'ss12_witness', x: wk.from, y: 1820, scale: 0.92, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'warm', walk: { ...wk, cadence: 5.2 },
            keys: [{ at: saw, headTurn: -0.35, pose: 'stand_tense', dur: 0.4 }, { at: hyd - 0.3, pose: 'hand_to_face', dur: 0.5 }] }
        ],
        props: [{ depth: 1.01, svg: tt => { const x = wx(tt), dx = x + 230, walking = tt > wk.at && tt < wk.at + wk.dur; return `<path d="M${f1(x + 60)} ${f1(1820 - 380)} Q ${f1(x + 160)} ${f1(1820 - 220)} ${f1(dx + 70)} ${f1(1820 - 190)}" stroke="#0e0b09" stroke-width="5" fill="none"/>` + dog(dx, 1820, 0.75, tt, 1, walking); } }],
        overlays: [
          { type: 'label', at: 0.15, until: l2 - 0.2, x: 60, y: 420, text: 'A WOMAN WALKING HER DOG', fs: 40, sub: 'A local witness (not named here)' },
          { type: 'callout', at: hyd - 0.1, target: [880, 1556 - 230 * 0.62], depth: 1, r: 70, label: [600, 770], w: 400, text: 'FIRE HYDRANT', colour: '#ffd23f' }
        ],
        tag: STREET_TAG
      });
    },

    // 7 - the witness tells detectives; then the stack: every ticket written there that night
    ss12_tickets(ctx) {
      const t = ctx.t, told = WT(ctx, 0, 3, 0.9), l2 = LS(ctx, 1, 2.55), chk = WT(ctx, 1, 1, 2.7), ev = WT(ctx, 1, 2, 3.0), nt = WT(ctx, 1, 7, 4.3);
      const fan = () => {
        const k = seg(t, ev - 0.1, ev + 0.4); if (k <= 0) return ''; let s = '';
        for (let i = 0; i < 5; i++) { const q = ease.back(seg(t, ev - 0.1 + i * 0.12, ev + 0.3 + i * 0.12)); if (q <= 0) continue; s += ticketCard(300 + i * 120, 600 + Math.abs(i - 2) * 26, 0.42 * q, (i - 2) * 9); }
        return s;
      };
      return E.cine.shot(ctx, {
        set: 'ss12_precinct', setOpts: { stack: true, stackX: 600, slot: [5, 6], glow: seg(t, nt - 0.2, nt + 0.3) }, grade: 'cold',
        cam: { keys: [{ at: 0, x: -60, y: 0, z: 1.06 }, { at: l2 - 0.3, x: 60, y: -30, z: 1.12, dur: 1.2 }], handheld: 1.5 },
        figures: [
          { id: 'ss12_witness', x: 170, y: 1730, scale: 0.94, dir: 1, turn: 0.45, pose: 'stand', silhouette: 'warm', show: [-1, l2 + 0.4],
            keys: [{ at: told - 0.2, pose: 'point', dur: 0.4 }, { at: told + 0.6, pose: 'hand_to_face', dur: 0.5 }] },
          { id: 'analyst', x: 520, y: 1760, scale: 0.98, dir: -1, turn: 0.45, pose: 'sit_type', expr: 'focused', gaze: [-0.6, -0.1],
            keys: [...typing(0.2, l2 - 0.2), { at: l2 - 0.1, pose: 'sit_read', expr: 'focused', gaze: [0.2, 0.6], dur: 0.5 }] },
          { id: 'detective', x: 900, y: 1740, scale: 1.0, dir: -1, turn: 0.75, pose: 'stand', expr: 'determined', gaze: [0.3, -0.4],
            keys: [{ at: chk - 0.2, pose: 'point_up', expr: 'focused', gaze: [0.2, -0.8], dur: 0.45 }, { at: nt - 0.2, pose: 'read', gaze: [0.4, 0.6], dur: 0.45 }] }
        ],
        overlays: [
          { type: 'label', at: 0.15, until: l2 - 0.2, x: 60, y: 420, text: 'DAYS LATER', fs: 44, sub: 'She told detectives what she saw' },
          { type: 'svg', at: 0, svg: fan },
          { type: 'label', at: nt - 0.1, x: 60, y: 420, text: 'EVERY TICKET FROM THAT NIGHT', fs: 36 }
        ],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURES'
      });
    },

    // 8 - one ticket, one car, one address: registered in Yonkers
    ss12_car(ctx) {
      const t = ctx.t, one = WT(ctx, 0, 0, 0.3), car = WT(ctx, 0, 4, 0.9), yk = WT(ctx, 0, 7, 1.8);
      const tk = () => { const k = ease.back(seg(t, one - 0.1, one + 0.35)); return k > 0 ? ticketCard(290, 560, 0.62 * k, -6) : ''; };
      return E.cine.shot(ctx, {
        set: 'ss12_precinct', setOpts: { wall: true, slot: [5, 6], glow: 1, typeX: 940 }, grade: 'cold',
        cam: { from: { x: 40, y: -60, z: 1.08 }, to: { x: 80, y: -80, z: 1.16 }, handheld: 1 },
        figures: [{ id: 'analyst', x: 640, y: 1980, scale: 1.24, dir: -1, turn: 0.4, pose: 'sit_read', expr: 'focused', gaze: [0.4, 0.6],
          keys: [{ at: car, gaze: [0.3, 0.7], dur: 0.3 }, { at: yk - 0.1, pose: 'sit', expr: 'realise', gaze: [-0.6, -0.2], headTurn: -0.2, dur: 0.45 }] }],
        overlays: [
          { type: 'svg', at: 0, svg: tk },
          { type: 'card', at: car - 0.15, x: 500, y: 430, w: 540, h: 250, rows: [{ text: 'ITS CAR WAS', fs: 28, colour: '#6b665c' }, { text: 'REGISTERED IN', fs: 34 }, { text: 'YONKERS, N.Y.', fs: 50, colour: '#8e1f18', at: yk - 0.1 }] }
        ],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURE'
      });
    },

    // 9 - 10 August 1977, Yonkers at dusk: detectives wait by the cream car
    ss12_stakeout(ctx) {
      const aug = WT(ctx, 0, 1, 0.5), wt = WT(ctx, 0, 4, 1.75), car = WT(ctx, 0, 7, 2.35);
      return E.cine.shot(ctx, {
        set: 'ss12_yonkers', setOpts: { dusk: 0.35, car: { x: 560, s: 0.6 }, cars: [{ x: -900, s: 0.6, col: '#2e3440' }], lampX: 1020 }, grade: 'dawn',
        cam: { from: { x: -40, y: 30, z: 1.02 }, to: { x: 30, y: 10, z: 1.1 }, handheld: 2.5 },
        figures: [
          { id: 'detective', x: -200, y: 1700, scale: 0.8, dir: 1, turn: 0.5, pose: 'stand', expr: 'determined', walk: { from: -200, to: 200, at: 0.1, dur: 1.4, cadence: 6.2 },
            keys: [{ at: wt, pose: 'arms_crossed', expr: 'focused', dur: 0.5 }] },
          { id: 'agent_a', x: -420, y: 1720, scale: 0.82, dir: 1, turn: 0.5, pose: 'stand', expr: 'focused', walk: { from: -420, to: 20, at: 0.3, dur: 1.4, cadence: 6.2 },
            keys: [{ at: car - 0.2, pose: 'point', gaze: [0.8, -0.2], dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: aug - 0.1, x: 60, y: 420, text: 'YONKERS · 10 AUGUST 1977', fs: 40, sub: 'Detectives wait by the car' },
          { type: 'callout', at: car - 0.1, target: [560, 1494 - 300], depth: 1, r: 80, label: [560, 760], w: 440, text: 'THE TICKETED CAR', colour: '#ffd23f' }
        ],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURES'
      });
    },

    // 10 - the arrest at the car (anonymous silhouette, no weapon shown)
    ss12_arrest(ctx) {
      const t = ctx.t, own = WT(ctx, 0, 2, 0.5), out = WT(ctx, 0, 4, 1.1), arr = WT(ctx, 0, 6, 1.45), him = WT(ctx, 0, 7, 1.85);
      return E.cine.shot(ctx, {
        set: 'ss12_yonkers', setOpts: { dusk: 0.95, car: { x: 420, s: 0.6 }, lampX: 1020 }, grade: 'night', police: t > arr - 0.1 ? 0.3 * seg(t, arr - 0.1, arr + 0.4) : 0,
        cam: { from: { x: 40, y: 20, z: 1.02 }, to: { x: -20, y: 40, z: 1.12 }, handheld: 4 },
        figures: [
          { id: 'ss12_berk', x: 1160, y: 1660, scale: 0.8, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'cool', walk: { from: 1160, to: 760, at: 0.0, dur: arr - 0.1, cadence: 6 },
            keys: [{ at: arr, pose: 'stand_tense', dur: 0.3 }, { at: him, pose: 'hands_behind', dur: 0.45 }] },
          { id: 'detective', x: -260, y: 1700, scale: 0.82, dir: 1, turn: 0.5, pose: 'stand', expr: 'determined', walk: { from: -260, to: 470, at: out - 0.6, dur: 1.0, cadence: 7 }, keys: [{ at: arr + 0.1, pose: 'present', dur: 0.35 }] },
          { id: 'agent_a', x: 1400, y: 1720, scale: 0.84, dir: -1, turn: 0.5, pose: 'stand', expr: 'stern', walk: { from: 1400, to: 1000, at: own, dur: 1.2, cadence: 7 }, keys: [{ at: him, pose: 'stand_tense', dur: 0.3 }] }
        ],
        overlays: [{ type: 'label', at: arr - 0.1, x: 60, y: 420, text: 'ARRESTED · 10 AUGUST 1977', fs: 40, sub: 'Outside his apartment building' }],
        tag: LIKENESS
      });
    },

    // 11 - the payoff: the name on the evidence wall
    ss12_name(ctx) {
      const t = ctx.t, son = WT(ctx, 0, 1, 0.6), dav = WT(ctx, 0, 5, 1.37), age = WT(ctx, 0, 8, 2.6), pst = WT(ctx, 0, 9, 4.1);
      const pin = () => { const k = seg(t, son - 0.1, son + 0.3); if (k <= 0) return ''; return `<g opacity="${f1(k)}" transform="rotate(-3 700 330)"><rect x="590" y="250" width="220" height="150" fill="#ebe3cf" stroke="#b9ad90" stroke-width="3"/><text x="700" y="318" text-anchor="middle" ${TYPE} font-weight="700" font-size="26" fill="#8e1f18">SON OF SAM</text><text x="700" y="356" text-anchor="middle" ${TYPE} font-weight="700" font-size="20" fill="#1a1915">IDENTIFIED</text><circle cx="700" cy="262" r="10" fill="#c8312b"/></g>`; };
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'cold',
        cam: { keys: [{ at: 0, x: 20, y: -40, z: 1.04 }, { at: dav - 0.2, x: 40, y: -70, z: 1.14, dur: 1.4 }], handheld: 1 },
        figures: [
          { id: 'analyst', x: 200, y: 1560, scale: 0.9, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', keys: [...typing(0.1, dav - 0.2), { at: dav - 0.1, pose: 'sit', expr: 'realise', gaze: [0.7, -0.3], dur: 0.4 }] },
          { id: 'detective', x: 780, y: 1720, scale: 1.0, dir: -1, turn: 0.6, pose: 'stand', expr: 'determined', gaze: [0.3, -0.6],
            keys: [{ at: son - 0.4, pose: 'point_up', dur: 0.4 }, { at: dav + 0.3, pose: 'stand', expr: 'focused', headTurn: -0.3, gaze: [0.6, 0], dur: 0.5 }, { at: pst, pose: 'arms_crossed', dur: 0.5 }] }
        ],
        props: [{ depth: 0.45, svg: pin }],
        overlays: [{ type: 'card', at: dav - 0.25, x: 80, y: 430, w: 920, rows: [{ text: 'THE SON OF SAM WAS', fs: 30, colour: '#6b665c' }, { text: 'DAVID BERKOWITZ', fs: 64, colour: '#8e1f18', at: dav - 0.15 }, { text: 'AGE 24 · POSTAL WORKER · YONKERS', fs: 32, at: age }] }],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURES'
      });
    },

    // 12 - the guilty plea (May 1978) and the sentence (June 1978); he is still in prison
    ss12_plea(ctx) {
      const pl = WT(ctx, 0, 3, 1.6), gu = WT(ctx, 0, 4, 2.0), six = WT(ctx, 0, 7, 2.7), l2 = LS(ctx, 1, 4.1), life = WT(ctx, 1, 3, 5.1);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { dock: { x: 640, y: 1900, s: 1.05 }, table: false }, grade: 'warm',
        cam: { from: { x: 0, y: 20, z: 1.0 }, to: { x: 30, y: 50, z: 1.08 } },
        figures: [
          { id: 'judge', x: 540, y: 790, scale: 0.5, dir: 1, turn: 0.05, pose: 'sit', noChair: true, expr: 'stern', depth: 0.34,
            keys: [{ at: gu, pose: 'sit_read', dur: 0.5 }, { at: life - 0.4, pose: 'gavel', dur: 0.35 }, { at: life + 0.05, pose: 'sit', dur: 0.12 }] },
          { id: 'ss12_berk', x: 640, y: 1900, scale: 1.05, dir: -1, turn: 0.3, pose: 'stand', silhouette: 'cool',
            keys: [{ at: pl - 0.3, pose: 'hands_together', dur: 0.5 }, { at: life + 0.2, pose: 'bowed', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'card', at: 0.2, until: l2 - 0.15, x: 80, y: 390, w: 920, rows: [{ text: '8 MAY 1978', fs: 28, colour: '#6b665c' }, { text: 'PLEADED GUILTY', fs: 56, colour: '#8e1f18', at: gu - 0.1 }, { text: 'TO ALL SIX MURDERS', fs: 40, at: six - 0.1 }] },
          { type: 'card', at: l2 - 0.05, x: 80, y: 390, w: 920, rows: [{ text: 'SENTENCED · 12 JUNE 1978', fs: 28, colour: '#6b665c' }, { text: '25 YEARS TO LIFE', fs: 56, colour: '#8e1f18', at: l2 + 0.1 }, { text: 'FOR EACH MURDER', fs: 38, at: life - 0.1 }, { text: 'STILL IN PRISON · SKIPPED HIS 2026 PAROLE HEARING', fs: 22, colour: '#6b665c', at: life + 0.5 }] }
        ],
        tag: LIKENESS
      });
    },

    // 13 - FUN FACT: the "Son of Sam law", and the 1991 Supreme Court ruling that struck that version down
    ss12_law(ctx) {
      const pas = WT(ctx, 0, 2, 0.65), law = WT(ctx, 0, 7, 1.8), l2 = LS(ctx, 1, 4.69), stk = WT(ctx, 1, 5, 6.9);
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'cold', cam: { from: { x: 0, y: 0, z: 1.04 }, to: { x: 40, y: 20, z: 1.1 } },
        figures: [
          { id: 'official', x: 760, y: 1840, scale: 1.0, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', gaze: [0.4, 0.6],
            keys: [{ at: pas - 0.1, pose: 'present', expr: 'determined', gaze: [0.8, -0.1], dur: 0.5 }, { at: law + 0.8, pose: 'read', dur: 0.5 }, { at: stk - 0.1, pose: 'stand', expr: 'realise', gaze: [-0.4, -0.2], dur: 0.4 }] },
          { id: 'analyst', x: 250, y: 1880, scale: 0.98, dir: 1, turn: 0.5, pose: 'sit_type', expr: 'focused', keys: [...typing(0.2, l2), { at: l2, pose: 'sit_read', dur: 0.4 }, { at: stk, pose: 'sit', expr: 'realise', gaze: [0.6, -0.3], dur: 0.4 }] }
        ],
        overlays: [
          { type: 'funfact', at: pas - 0.12, until: l2 - 0.1, y: 400, w: 920, fs: 40, rows: [{ text: "New York passed a 'Son of" }, { text: "Sam law' against criminals" }, { text: 'profiting from their stories.', colour: '#ffd23f' }] },
          { type: 'card', at: l2 + 0.05, x: 80, y: 400, w: 920, rows: [{ text: '1991 · US SUPREME COURT', fs: 30, colour: '#6b665c' }, { text: 'STRUCK IT DOWN', fs: 60, colour: '#8e1f18', at: stk - 0.1 }, { text: 'A REVISED LAW FOLLOWED', fs: 30, at: stk + 0.5 }] }
        ],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURES'
      });
    },

    // 14 - callback on the hero object (the same ticket, same place as the first frame), then the next case
    ss12_end(ctx) {
      const t = ctx.t, tk = WT(ctx, 0, 8, 2.3), l2 = LS(ctx, 1, 3.58);
      const hero = () => { const k = ease.out(seg(t, 0.05, 0.6)); const wob = 1 + 0.01 * Math.sin(t * 3); return `<rect x="0" y="0" width="${W}" height="${H}" fill="#05060a" opacity="${f1(0.5 * k)}"/>` + ticketCard(540, lerp(1010, 960, k), lerp(0.9, 1.2, k) * wob, -3, k); };
      return E.cine.shot(ctx, {
        set: 'ss12_street', setOpts: { car: { x: 240, s: 0.62, ticket: 1 }, hydrant: { x: 1060, y: 1560, s: 0.62 }, lampX: 820, haze: 1 }, grade: 'night',
        cam: { from: { x: -40, y: 100, z: 1.18 }, to: { x: 0, y: 60, z: 1.06 }, handheld: 1 },
        overlays: [
          { type: 'svg', at: -0.1, dur: 0.05, svg: hero },
          { type: 'label', at: 0.2, until: l2 - 0.2, x: 60, y: 420, text: 'IN MEMORY OF THE SIX PEOPLE KILLED', fs: 32, sub: 'and for the seven who were wounded' },
          { type: 'nextcase', at: l2 - 0.1, y: 380, rows: [{ text: 'A gang of pensioners' }, { text: 'robbed a London vault', colour: '#ffd23f' }], sub: 'FOLLOW FOR THE NEXT CASE' }
        ],
        tag: 'ILLUSTRATION · NOT A PHOTOGRAPH'
      });
    }
  });
})();
