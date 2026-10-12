/* Case File 25 (cinematic, 40-second cut): Al Capone, brought down by paperwork (the 1931 federal tax case).
   CLOSED: convicted on five tax counts on 17 October 1931, sentenced on 24 October 1931 to 11 years, a $50,000 fine and
   costs; Atlanta, then Alcatraz (1934); released 16 November 1939; died 25 January 1947.
   Structure (short40 + the Case File 25 rules): a burned-in hook headline (contradiction + object) over the HERO OBJECT, a
   generic open accounting ledger, big and centred in the first frame and again in the last (the video loops); a stakes
   number by 0:10 (Public Enemy No. 1; the prosecution's $215,000 tax figure); fast clue beats (never filed, the storage
   room, the bookkeeper, the lawyer's letter); the HOW ("Al" in the ledger) at about 60%; the outcome in one line; a
   callback on the ledger; a burned-in end question (episode.end_title) over the last 3.2 s. No nextcase card.
   Content rules:
   - Capone appears only as an illustrated representation (characters/figures/ac25_capone.json): a generic heavy-set man
     in an overcoat and plain fedora, no scar, no photo reference, never with a weapon, alcohol or cash, never posed
     heroically; every shot he is in is tagged 'ILLUSTRATION · NOT A LIKENESS'. Frank Wilson likewise (ac25_wilson).
   - No violence, no victims, no St Valentine's Day massacre, no speakeasy drinking: the backroom is a counting room
     (table, lamp, cash box, adding machine), the street is a generic 1920s Chicago street under an elevated railway.
   - No real document is imitated: the ledger's entries are illegible marks; the lawyer's letter is a blank sheet; the
     "Al" reveal is our own typed callout; every card is the series' own typed graphic. No dialogue is invented.
   New environments (E.registerSets): ac25_backroom (a 1920s counting room with a window onto the night street and the
   'L'), ac25_street (a Chicago street at night under an elevated railway, generic period cars), ac25_treasury (a 1930
   federal office; o.view 'office' or 'storage', a records room of boxes). Plus the shared courtroom (1930s, warm).
   Timing: actions are keyed to the narrator's word timings (WT), so they land on the spoken word. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC PLACES AND PEOPLE';
  const LIKENESS = 'ILLUSTRATION · NOT A LIKENESS';
  const YEL = '#ffd23f', RED = '#8e1f18', MUTE = '#6b665c';
  const panel = (x, y, w, h, op = 0.6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#000" opacity="${op}"/>`;
  const FED = { style: 'fedora', color: '#3a3632', band: '#1a1816' };   // a per-shot fedora for the generic agents

  // ---------- THE HERO: a generic open accounting ledger seen from above: leather boards, a red cloth spine, cream pages
  // ruled in blue with red money columns, and rows of ILLEGIBLE marks (never a real entry). Centre (x, y); ~1000 x 660 at s = 1.
  // o.glow 0..1 lights the whole book; o.mark 0..1 highlights one row on the right page (the "Al" row); o.pen lays a pen on it.
  function ledger(x, y, s, t, o = {}) {
    const r = R(2525);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="300" rx="520" ry="60" fill="#000" opacity="0.4"/>`;
    // boards and spine
    g += `<path d="M-500 -322 L-14 -300 L-14 322 L-500 300 Z" fill="#3e2416" stroke="${INK}" stroke-width="6"/><path d="M500 -322 L14 -300 L14 322 L500 300 Z" fill="#3e2416" stroke="${INK}" stroke-width="6"/>`;
    g += `<rect x="-26" y="-318" width="52" height="640" rx="10" fill="#7a1e1a" stroke="${INK}" stroke-width="5"/><path d="M-6 -300 L-6 300" stroke="#5a1410" stroke-width="4"/>`;
    g += `<path d="M-500 -322 L-500 300" stroke="#8a6a4a" stroke-width="3" opacity="0.6"/><path d="M500 -322 L500 300" stroke="#8a6a4a" stroke-width="3" opacity="0.6"/>`;
    // page stacks (the thickness) and the two open pages, slightly bowed toward the spine
    [-1, 1].forEach(d => { for (let i = 0; i < 5; i++) g += `<path d="M${d * 30} ${-286 + i * 3} L${d * 476} ${-304 + i * 3} L${d * 476} ${296 - i * 3} L${d * 30} ${282 - i * 3} Z" fill="${i % 2 ? '#e6dcc2' : '#f0e8d2'}" stroke="#c9bd9e" stroke-width="1.5"/>`; });
    g += `<path d="M-30 -282 Q-250 -300 -470 -300 L-470 288 Q-250 290 -30 280 Z" fill="#f1e9d4" stroke="#c9bd9e" stroke-width="2"/><path d="M30 -282 Q250 -300 470 -300 L470 288 Q250 290 30 280 Z" fill="#f4edd9" stroke="#c9bd9e" stroke-width="2"/>`;
    g += `<path d="M-30 -282 L-30 280" stroke="#000" stroke-width="18" opacity="0.08"/><path d="M30 -282 L30 280" stroke="#000" stroke-width="18" opacity="0.08"/>`;
    // ruling: blue lines, red column rules, a double head rule
    for (let i = 0; i < 17; i++) { const yy = -236 + i * 30; g += `<path d="M-460 ${yy} L-40 ${yy} M40 ${yy} L460 ${yy}" stroke="#8aa4c4" stroke-width="2" opacity="0.55"/>`; }
    g += `<path d="M-460 -252 L-40 -252 M-460 -246 L-40 -246 M40 -252 L460 -252 M40 -246 L460 -246" stroke="#b8302a" stroke-width="2" opacity="0.7"/>`;
    [-300, -150, -90, 180, 330, 390].forEach(xx => { g += `<path d="M${xx} -270 L${xx} 270" stroke="#b8302a" stroke-width="2" opacity="0.6"/>`; });
    // the "Al" row highlight (our own mark, under the illegible entries)
    const m = o.mark || 0;
    if (m > 0) g += `<rect x="44" y="${-236 + 7 * 30 + 4}" width="412" height="26" fill="${YEL}" opacity="${f1(0.75 * m)}"/>`;
    // illegible entries: pen-coloured bars of random widths in the name and amount columns (never real words or numbers)
    for (let i = 0; i < 16; i++) {
      const yy = -236 + i * 30 + 10;
      if (r() < 0.9) g += `<rect x="-440" y="${yy}" width="${f1(60 + r() * 70)}" height="9" rx="3" fill="#2a2e46" opacity="0.8"/>`;
      g += `<rect x="-140" y="${yy}" width="${f1(30 + r() * 16)}" height="9" rx="3" fill="#2a2e46" opacity="0.75"/><rect x="-80" y="${yy}" width="${f1(24 + r() * 12)}" height="9" rx="3" fill="#2a2e46" opacity="0.75"/>`;
      if (r() < 0.9) g += `<rect x="60" y="${yy}" width="${f1(50 + r() * 60)}" height="9" rx="3" fill="#2a2e46" opacity="0.8"/>`;
      g += `<rect x="196" y="${yy}" width="${f1(70 + r() * 50)}" height="9" rx="3" fill="#2a2e46" opacity="0.75"/><rect x="340" y="${yy}" width="${f1(36 + r() * 10)}" height="9" rx="3" fill="#2a2e46" opacity="0.75"/><rect x="400" y="${yy}" width="${f1(28 + r() * 20)}" height="9" rx="3" fill="#2a2e46" opacity="0.75"/>`;
    }
    g += `<path d="M196 262 L450 262" stroke="#2a2e46" stroke-width="3"/><path d="M-80 262 L-40 262" stroke="#2a2e46" stroke-width="3"/>`;
    // a ribbon marker, a page corner curl
    g += `<path d="M300 -300 L312 -300 L318 320 L304 320 Z" fill="#8e1f18" opacity="0.85"/>`;
    g += `<path d="M470 288 L420 288 Q450 262 470 240 Z" fill="#e3d9bf" stroke="#c9bd9e" stroke-width="2"/>`;
    if (o.pen) g += `<g transform="translate(-200 150) rotate(-18)"><rect x="-150" y="-9" width="300" height="18" rx="9" fill="#1a1a22" stroke="${INK}" stroke-width="3"/><path d="M150 -4 L186 0 L150 4 Z" fill="#c9a356" stroke="${INK}" stroke-width="2"/><rect x="60" y="-9" width="14" height="18" fill="#c9a356"/></g>`;
    const k = o.glow || 0;
    if (k > 0) g += `<rect x="-520" y="-342" width="1040" height="684" rx="20" fill="none" stroke="${YEL}" stroke-width="10" opacity="${f1(k * (0.75 + 0.25 * Math.sin(t * 7)))}"/>` + wash(0, 0, 560, 360, '#fff1b0', f1(0.28 * k));
    return g + '</g>';
  }
  // a stack of boxes seen in the records room (brown card, string, a plain label strip)
  const box = (x, y, w, h, col = '#9a7a52') => `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="${w}" height="${h}" fill="${col}" stroke="${INK}" stroke-width="4"/><rect x="0" y="0" width="${w}" height="${f1(h * 0.18)}" fill="#000" opacity="0.18"/><rect x="${f1(w * 0.3)}" y="${f1(h * 0.4)}" width="${f1(w * 0.4)}" height="${f1(h * 0.22)}" fill="#e8dfc4" stroke="#8a7a5a" stroke-width="2"/><path d="M${f1(w * 0.5)} 0 L${f1(w * 0.5)} ${h}" stroke="#5a4a32" stroke-width="3" opacity="0.6"/></g>`;
  // a generic 1920s car in profile (tall body, running boards, spoked wheels); bottom centre (x, y); ~700 long at k = 1
  const oldCar = (x, y, k, fl = 1, col = '#1c1c20') => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k * fl)} ${sc(k)})"><ellipse cx="0" cy="4" rx="360" ry="18" fill="#000" opacity="0.4"/>` +
    `<path d="M-330 -40 L-330 -110 Q-320 -130 -290 -132 L-180 -136 L-150 -230 Q-140 -250 -110 -250 L130 -250 Q160 -250 170 -230 L190 -140 L300 -132 Q336 -126 340 -96 L340 -40 Z" fill="${col}" stroke="${INK}" stroke-width="6"/>` +
    `<path d="M-120 -236 L-20 -236 L-20 -150 L-150 -150 Z M0 -236 L120 -236 L140 -150 L0 -150 Z" fill="#2a3a4a" opacity="0.9"/><rect x="-380" y="-60" width="760" height="18" rx="6" fill="#2a2a2e" stroke="${INK}" stroke-width="4"/>` +
    `<circle cx="320" cy="-118" r="22" fill="#fff6d0" stroke="${INK}" stroke-width="4"/><circle cx="-250" cy="-6" r="62" fill="#111" stroke="${INK}" stroke-width="5"/><circle cx="240" cy="-6" r="62" fill="#111" stroke="${INK}" stroke-width="5"/>` +
    [-250, 240].map(cx => [0, 30, 60, 90, 120, 150].map(a => `<path d="M${cx} -6 l ${f1(44 * Math.cos(a * Math.PI / 180))} ${f1(44 * Math.sin(a * Math.PI / 180))} M${cx} -6 l ${f1(-44 * Math.cos(a * Math.PI / 180))} ${f1(-44 * Math.sin(a * Math.PI / 180))}" stroke="#c9ced6" stroke-width="3"/>`).join('')).join('') + `</g>`;

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a 1920s counting room behind a Cicero or Chicago business: brick walls, a hanging lamp, a window onto the night
    // street with the elevated railway, a shelf of ledgers, a door. The table in the foreground (depth 1.04) is where
    // the hero ledger lies; o.table = false drops it.
    ac25_backroom(ctx, o = {}) {
      const t = ctx.t, r = R(251), lamp = 0.92 + 0.08 * Math.sin(t * 9.1) * Math.sin(t * 2.3);
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#3a241c"/>`;
      for (let yy = -40; yy < 1260; yy += 44) { wall += `<path d="M-300 ${yy} L${W + 300} ${yy}" stroke="#241410" stroke-width="4"/>`; for (let xx = -300 + ((yy / 44) % 2) * 60; xx < W + 300; xx += 120) wall += `<path d="M${xx} ${yy} L${xx} ${yy + 44}" stroke="#241410" stroke-width="4"/>`; if (r() < 0.5) wall += `<rect x="${f1(-280 + r() * 1600)}" y="${yy + 4}" width="56" height="36" fill="#4a2e22" opacity="0.6"/>`; }
      // a pipe along the top, the door on the left, the shelf of ledgers
      wall += `<rect x="-300" y="60" width="${W + 600}" height="22" fill="#4a4440" stroke="${INK}" stroke-width="3"/>`;
      wall += `<rect x="-120" y="360" width="300" height="900" fill="#2a1c14" stroke="${INK}" stroke-width="6"/><rect x="-96" y="384" width="252" height="380" fill="none" stroke="#4a3426" stroke-width="5"/><rect x="-96" y="800" width="252" height="420" fill="none" stroke="#4a3426" stroke-width="5"/><circle cx="150" cy="820" r="12" fill="#c9a356"/>`;
      wall += `<rect x="260" y="300" width="360" height="22" fill="#5a3a24" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2, 3, 4, 5].map(i => `<rect x="${280 + i * 54}" y="${180 + (i % 3) * 8}" width="44" height="${120 - (i % 3) * 8}" fill="${['#5a2a22', '#2a3a4a', '#4a3a2a'][i % 3]}" stroke="${INK}" stroke-width="3"/><rect x="${290 + i * 54}" y="${200 + (i % 3) * 8}" width="24" height="6" fill="#c9a356" opacity="0.7"/>`).join('');
      // the window onto the night street: a building across the road, the elevated track with a train's lit windows
      const WX = 700, WY = 240, WW = 420, WH = 470;
      let win = `<defs><clipPath id="acbwin"><rect x="${WX}" y="${WY}" width="${WW}" height="${WH}"/></clipPath></defs><g clip-path="url(#acbwin)"><rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" fill="#0f1526"/>`;
      win += `<rect x="${WX}" y="${WY + 150}" width="${WW}" height="${WH}" fill="#241c20"/>` + [0, 1, 2, 3].map(i => [0, 1, 2].map(j => `<rect x="${WX + 40 + i * 100}" y="${WY + 190 + j * 90}" width="46" height="60" fill="${(i + j) % 3 ? '#f2c66a' : '#2a2430'}" opacity="0.85"/>`).join('')).join('');
      win += `<rect x="${WX - 20}" y="${WY + 92}" width="${WW + 40}" height="34" fill="#1a1a1e"/>` + [0, 1, 2].map(i => `<rect x="${WX + 30 + i * 160}" y="${WY + 126}" width="18" height="400" fill="#1a1a1e"/>`).join('');
      const tx = ((t * 180) % (WW + 700)) - 350;
      win += `<g transform="translate(${f1(WX + tx)} ${WY + 40})"><rect x="0" y="0" width="330" height="54" rx="6" fill="#3a3630" stroke="${INK}" stroke-width="3"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${14 + i * 44}" y="12" width="30" height="26" fill="#ffd98a" opacity="0.9"/>`).join('')}</g>`;
      win += `</g><rect x="${WX - 14}" y="${WY - 14}" width="${WW + 28}" height="${WH + 28}" fill="none" stroke="#5a4a3a" stroke-width="18"/><path d="M${WX + WW / 2} ${WY} L${WX + WW / 2} ${WY + WH} M${WX} ${WY + WH / 2} L${WX + WW} ${WY + WH / 2}" stroke="#5a4a3a" stroke-width="10"/>`;
      win += wash(WX + WW / 2, WY + WH / 2, 300, 300, '#8ab0ff', 0.08);
      // the hanging lamp: cord, green shade, a warm cone onto the table
      let lampL = `<path d="M540 -300 L540 420" stroke="#1a1a1a" stroke-width="5"/><path d="M460 500 L620 500 L580 420 L500 420 Z" fill="#2e5a3a" stroke="${INK}" stroke-width="5"/><ellipse cx="540" cy="500" rx="80" ry="12" fill="#fff6d0" opacity="${f1(0.95 * lamp)}"/>`;
      lampL += `<path d="M470 506 L-100 1240 L1180 1240 L610 506 Z" fill="#ffe4a0" opacity="${f1(0.1 * lamp)}"/>` + wash(540, 980, 560, 360, '#ffd990', f1(0.3 * lamp));
      let floor = `<rect x="-300" y="1236" width="${W + 600}" height="${H}" fill="#2c2018"/>`;
      for (let i = 0; i < 12; i++) floor += `<line x1="-300" y1="${1260 + i * 60}" x2="${W + 300}" y2="${1260 + i * 60}" stroke="#000" stroke-opacity="0.2" stroke-width="3"/>`;
      const layers = [[0.3, wall + win], [0.55, lampL], [1.0, ''], [1.0, floor]];
      if (o.table !== false) {
        let table = `<rect x="-300" y="1000" width="${W + 600}" height="44" fill="#6a4a30" stroke="${INK}" stroke-width="6"/><rect x="-300" y="1040" width="${W + 600}" height="${H}" fill="#3e2a1c" stroke="${INK}" stroke-width="5"/>`;
        for (let i = 0; i < 8; i++) table += `<path d="M${-200 + i * 190} 1044 L${-200 + i * 190} 1600" stroke="#000" stroke-opacity="0.2" stroke-width="3"/>`;
        // a cash box (closed) and a hand-crank adding machine: counting-room props, no cash or bottles
        table += `<g transform="translate(120 1000)"><rect x="-90" y="-80" width="180" height="80" rx="6" fill="#3a4a3a" stroke="${INK}" stroke-width="5"/><rect x="-90" y="-80" width="180" height="16" fill="#2a3a2a"/><rect x="-16" y="-50" width="32" height="20" rx="4" fill="#c9a356" stroke="${INK}" stroke-width="3"/></g>`;
        table += `<g transform="translate(960 1000)"><rect x="-110" y="-120" width="200" height="120" rx="8" fill="#2a2a2e" stroke="${INK}" stroke-width="5"/>${[0, 1, 2, 3].map(rr => [0, 1, 2, 3, 4].map(c => `<circle cx="${-84 + c * 30}" cy="${-96 + rr * 24}" r="8" fill="#e8e2d6" stroke="${INK}" stroke-width="2"/>`).join('')).join('')}<rect x="-100" y="-146" width="150" height="26" rx="4" fill="#e8e2d6" stroke="${INK}" stroke-width="3"/><path d="M90 -100 L130 -140" stroke="#5a5a60" stroke-width="10" stroke-linecap="round"/><circle cx="132" cy="-144" r="12" fill="#1a1a1e" stroke="${INK}" stroke-width="3"/></g>`;
        layers.push([1.04, table]);
      }
      return { light: { dir: -1, rim: '#ffe0a0', key: '#ffd990' }, layers };
    },

    // a Chicago street at night, 1920s-30s: brick blocks with lit windows and fire escapes, the elevated railway on
    // steel columns, streetlamps, generic period cars, wet asphalt (nothing names a real street or business)
    ac25_street(ctx, o = {}) {
      const t = ctx.t, r = R(252);
      let sky = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#0c1020"/>` + wash(540, 700, 900, 500, '#3a3050', 0.5);
      // far block across the street: facades, windows, fire escapes
      let far = '';
      [[-300, 180, 520, '#3a2622'], [220, 120, 440, '#4a3028'], [660, 220, 480, '#352420'], [1140, 160, 400, '#402a26']].forEach(([x, y, w, col]) => {
        far += `<rect x="${x}" y="${y}" width="${w}" height="${1160 - y}" fill="${col}" stroke="${INK}" stroke-width="5"/><rect x="${x}" y="${y}" width="${w}" height="26" fill="#2a1c18"/>`;
        for (let yy = y + 70; yy < 1100; yy += 120) for (let xx = x + 40; xx < x + w - 60; xx += 110) far += `<rect x="${xx}" y="${yy}" width="56" height="78" fill="${r() < 0.45 ? '#f2c66a' : '#1a1a24'}" opacity="0.9" stroke="${INK}" stroke-width="3"/>`;
        far += `<g opacity="0.8">${[0, 1, 2].map(i => `<rect x="${x + w / 2 - 70}" y="${y + 170 + i * 240}" width="140" height="6" fill="#1a1a1e"/><path d="M${x + w / 2 - 70} ${y + 176 + i * 240} L${x + w / 2 - 60} ${y + 400 + i * 240} M${x + w / 2 + 70} ${y + 176 + i * 240} L${x + w / 2 + 60} ${y + 400 + i * 240}" stroke="#1a1a1e" stroke-width="5"/>`).join('')}</g>`;
      });
      far += `<rect x="-300" y="1150" width="${W + 600}" height="40" fill="#5a5a5a"/>`;
      // the elevated railway: a girder across the frame, columns to the kerb, a train crossing with lit windows
      let el = `<rect x="-300" y="560" width="${W + 600}" height="70" fill="#1a1a1e" stroke="${INK}" stroke-width="5"/><path d="M-300 596 L${W + 300} 596" stroke="#3a3a40" stroke-width="6"/>`;
      for (let x = -200; x < W + 300; x += 90) el += `<path d="M${x} 566 L${x + 45} 624 M${x + 45} 566 L${x + 90} 624" stroke="#3a3a40" stroke-width="4"/>`;
      [-40, 400, 860, 1300].forEach(x => { el += `<rect x="${x - 22}" y="630" width="44" height="540" fill="#1e1e24" stroke="${INK}" stroke-width="5"/><path d="M${x - 70} 630 L${x + 70} 630 L${x + 26} 700 L${x - 26} 700 Z" fill="#2a2a30" stroke="${INK}" stroke-width="4"/>`; });
      const tx = ((t * 260) % 2600) - 1300;
      el += `<g transform="translate(${f1(tx)} 470)"><rect x="0" y="0" width="900" height="90" rx="10" fill="#4a3a2a" stroke="${INK}" stroke-width="5"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `<rect x="${30 + i * 72}" y="18" width="46" height="40" fill="#ffd98a" opacity="0.9"/>`).join('')}<rect x="0" y="80" width="900" height="12" fill="#1a1a1e"/></g>`;
      el += wash(f1(tx + 450), 520, 500, 90, '#ffd98a', 0.18);
      // streetlamps and parked period cars at the kerb
      let mid = '';
      [[160, 0.9], [980, 0.9]].forEach(([x, k]) => { mid += `<path d="M${x} 1180 L${x} 760 Q${x} 720 ${x + 40} 720" stroke="#1a1a1e" stroke-width="12" fill="none"/><circle cx="${x + 46}" cy="724" r="22" fill="#fff6d0"/>` + wash(x + 46, 760, 220, 300, '#ffe6a8', 0.22 * k); });
      mid += oldCar(360, 1210, 0.62, 1, '#1a1a20') + oldCar(1160, 1214, 0.66, -1, '#2a2226');
      // the street: wet asphalt with lamp reflections; the kerb
      let street = `<rect x="-300" y="1190" width="${W + 600}" height="${H}" fill="#1c1c22"/><rect x="-300" y="1186" width="${W + 600}" height="12" fill="#4a4a50"/>`;
      [206, 1026].forEach(x => { street += `<path d="M${x - 40} 1200 L${x + 40} 1200 L${x + 90} 1700 L${x - 90} 1700 Z" fill="#ffe6a8" opacity="0.12"/>`; });
      for (let i = 0; i < 40; i++) street += `<ellipse cx="${f1(-200 + r() * 1500)}" cy="${f1(1240 + r() * 600)}" rx="${f1(40 + r() * 120)}" ry="${f1(4 + r() * 8)}" fill="#8ab0ff" opacity="0.08"/>`;
      let fg = `<rect x="-300" y="1800" width="${W + 600}" height="200" fill="#0a0a0c" opacity="0.5"/>`;
      return { light: { dir: 1, rim: '#ffd98a', key: '#ffe6a8' }, layers: [[0.05, sky], [0.2, far], [0.32, el], [0.6, mid], [0.98, street], [1.3, fg]] };
    },

    // a 1930 federal office in Chicago (generic): o.view 'office' = tall windows with blinds, filing cabinets, a wall
    // clock, a desk in the foreground with a green-shade lamp and files (o.desk = false drops it); o.view 'storage' =
    // a records room: shelves of string-tied boxes under a bare bulb, a crate in the foreground for the ledger.
    ac25_treasury(ctx, o = {}) {
      const t = ctx.t, r = R(253), storage = o.view === 'storage';
      if (storage) {
        const bulb = 0.9 + 0.1 * Math.sin(t * 23) * Math.sin(t * 1.7);
        let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#2a241c"/>`;
        for (let yy = -40; yy < 1260; yy += 40) wall += `<path d="M-300 ${yy} L${W + 300} ${yy}" stroke="#1c1812" stroke-width="3"/>`;
        // back shelving with boxes
        [340, 600, 860].forEach(y => { wall += `<rect x="-300" y="${y}" width="${W + 600}" height="18" fill="#4a3a26" stroke="${INK}" stroke-width="3"/>`; let x = -260; while (x < W + 200) { const w = 120 + r() * 80, h = 120 + r() * 90; wall += box(x, y - h, w, h, r() < 0.5 ? '#8a6a46' : '#9a7a52'); x += w + 14 + r() * 30; } });
        wall += `<path d="M540 -300 L540 300" stroke="#1a1a1a" stroke-width="4"/><circle cx="540" cy="318" r="26" fill="#fff6c8" opacity="${f1(bulb)}"/><path d="M510 290 L570 290 L560 310 L520 310 Z" fill="#3a3a3a"/>`;
        wall += wash(540, 560, 700, 520, '#ffe6a8', f1(0.3 * bulb)) + wash(540, 330, 160, 120, '#fff6c8', f1(0.6 * bulb));
        let floor = `<rect x="-300" y="1236" width="${W + 600}" height="${H}" fill="#3a3024"/>`;
        for (let i = 0; i < 10; i++) floor += `<line x1="-300" y1="${1270 + i * 64}" x2="${W + 300}" y2="${1270 + i * 64}" stroke="#000" stroke-opacity="0.2" stroke-width="3"/>`;
        // side stacks of boxes at the figures' plane, and the foreground crate the ledger lies on
        const side = box(-200, 1000, 300, 236, '#8a6a46') + box(-180, 790, 260, 210, '#9a7a52') + box(1020, 1040, 320, 196, '#8a6a46') + box(1060, 860, 260, 180, '#9a7a52');
        const layers = [[0.4, wall], [1.0, floor], [1.0, side]];
        if (o.crate !== false) layers.push([1.04, `<rect x="140" y="1060" width="800" height="40" fill="#7a5a3a" stroke="${INK}" stroke-width="5"/><rect x="150" y="1100" width="780" height="${H}" fill="#4a3824" stroke="${INK}" stroke-width="5"/><path d="M160 1180 L920 1180 M160 1300 L920 1300" stroke="#000" stroke-opacity="0.25" stroke-width="4"/>`]);
        return { light: { dir: -1, rim: '#ffe6a8', key: '#ffe0a0' }, layers, dust: true };
      }
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#b8a98c"/><rect x="-300" y="780" width="${W + 600}" height="460" fill="#6a5238"/><rect x="-300" y="770" width="${W + 600}" height="16" fill="#3a2c1c"/>`;
      for (let i = -3; i < 14; i++) wall += `<rect x="${i * 110}" y="800" width="96" height="420" fill="none" stroke="#3a2c1c" stroke-width="4" opacity="0.6"/>`;
      // two tall windows with blinds, light through the slats
      [[80, 120], [660, 120]].forEach(([x, y]) => {
        wall += `<rect x="${x}" y="${y}" width="340" height="580" fill="#cfe0ea" stroke="#3a2c1c" stroke-width="14"/>`;
        for (let i = 0; i < 20; i++) wall += `<rect x="${x + 6}" y="${y + 10 + i * 28}" width="328" height="14" fill="#8a9aa6"/>`;
        wall += wash(x + 170, 500, 260, 420, '#fff6dc', 0.12);
      });
      // a wall clock and a plain framed plaque (no seal, no text)
      wall += `<g transform="translate(540 260)"><circle r="64" fill="#f4f0e4" stroke="#2a2a2a" stroke-width="8"/><path d="M0 0 L0 -40" stroke="#1a1a1a" stroke-width="6" transform="rotate(${f1(-50 + t * 2)})"/><path d="M0 0 L0 -50" stroke="#1a1a1a" stroke-width="4" transform="rotate(${f1(t * 24)})"/><circle r="5" fill="#1a1a1a"/></g>`;
      wall += `<rect x="470" y="400" width="140" height="180" fill="#e8dfc4" stroke="#3a2c1c" stroke-width="8"/>`;
      // filing cabinets on the left and right, a hat stand
      const cab = (x, y) => `<g transform="translate(${x} ${y})"><rect x="0" y="-560" width="220" height="560" fill="#5a6a4a" stroke="${INK}" stroke-width="6"/>${[0, 1, 2, 3].map(i => `<rect x="18" y="${-540 + i * 136}" width="184" height="118" fill="#4a5a3c" stroke="${INK}" stroke-width="4"/><rect x="80" y="${-492 + i * 136}" width="60" height="14" rx="4" fill="#c9a356"/>`).join('')}</g>`;
      wall += cab(-140, 1236) + cab(1000, 1236);
      wall += `<path d="M1300 1236 L1300 560" stroke="#3a2c1c" stroke-width="12"/><path d="M1300 560 L1260 600 M1300 560 L1340 600 M1300 600 L1270 640" stroke="#3a2c1c" stroke-width="8" fill="none"/><ellipse cx="1266" cy="596" rx="46" ry="12" fill="#3a3632" stroke="${INK}" stroke-width="3"/><path d="M1240 596 Q1266 540 1292 596 Z" fill="#3a3632" stroke="${INK}" stroke-width="3"/>`;
      let floor = `<rect x="-300" y="1236" width="${W + 600}" height="${H}" fill="#4a3a2a"/>`;
      for (let i = 0; i < 10; i++) floor += `<line x1="-300" y1="${1270 + i * 64}" x2="${W + 300}" y2="${1270 + i * 64}" stroke="#000" stroke-opacity="0.2" stroke-width="3"/>`;
      const layers = [[0.3, wall], [1.0, floor]];
      if (o.desk !== false) {
        const dx = o.deskX ?? 0;
        let desk = `<rect x="${-300 + dx}" y="1150" width="${W + 600}" height="40" fill="#6a4a30" stroke="${INK}" stroke-width="6"/><rect x="${-300 + dx}" y="1188" width="${W + 600}" height="${H}" fill="#4a3220" stroke="${INK}" stroke-width="5"/>`;
        desk += `<g transform="translate(${160 + dx} 1150)"><path d="M-60 0 L-30 -200 L30 -200 L60 0 Z" fill="#2a2a2e" stroke="${INK}" stroke-width="4"/><path d="M-120 -200 L120 -200 L90 -270 L-90 -270 Z" fill="#2e5a3a" stroke="${INK}" stroke-width="5"/><rect x="-116" y="-204" width="232" height="10" fill="#fff6d0" opacity="0.9"/></g>` + wash(160 + dx, 1080, 300, 200, '#ffe6a8', 0.28);
        desk += `<g transform="translate(${900 + dx} 1150)">${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${-120 + (i % 2) * 6}" y="${-18 - i * 16}" width="240" height="16" fill="${i % 2 ? '#e8dfc4' : '#d9cfb0'}" stroke="${INK}" stroke-width="2"/>`).join('')}</g>`;
        desk += `<g transform="translate(${1180 + dx} 1150)"><rect x="-40" y="-16" width="80" height="16" rx="4" fill="#1a1a1e" stroke="${INK}" stroke-width="3"/><rect x="-8" y="-150" width="16" height="140" fill="#1a1a1e"/><path d="M-36 -160 Q0 -200 36 -160 Z" fill="#1a1a1e" stroke="${INK}" stroke-width="3"/><circle cx="0" cy="-150" r="14" fill="#1a1a1e"/></g>`;
        layers.push([1.04, desk]);
      }
      return { light: { dir: 1, rim: '#fff0d0', key: '#ffe8c0' }, layers, dust: true };
    }
  });

  E.registerScenes({
    // 1 - hook: the counting room; the ledger big and centred on the table from the first frame (the headline burns over
    //     y 380-720 until ~3.2 s, so nothing of ours sits there before that). Capone stands over the table, arms crossed;
    //     at "ledger" the book lights up and he looks down at it.
    ac25_hook(ctx) {
      const t = ctx.t, under = WT(ctx, 0, 3, 1.2), l1 = LS(ctx, 1, 2.6), away = WT(ctx, 1, 3, 3.3), led = WT(ctx, 1, 7, 4.4);
      const LP = { x: 540, y: 1040, s: 0.72 };
      return E.cine.shot(ctx, {
        set: 'ac25_backroom', grade: 'warm',
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 0, y: 50, z: 1.07 }, handheld: 1.0 },
        shake: [{ at: led, amp: 4 }],
        figures: [
          { id: 'ac25_capone', x: 800, y: 1500, scale: 0.88, dir: -1, turn: 0.5, pose: 'stand', expr: 'stern', gaze: [-0.6, 0.1], keys: [{ at: under - 0.2, pose: 'arms_crossed', dur: 0.5 }, { at: away, pose: 'stand', expr: 'worried', gaze: [-0.3, 0.8], dur: 0.5 }, { at: led, pose: 'bowed', dur: 0.6 }] },
          { id: 'ac25_bookkeeper', x: 300, y: 1470, scale: 0.86, dir: 1, turn: 0.45, pose: 'sit_read', noChair: true, expr: 'focused', gaze: [0.5, 0.6], keys: [{ at: l1, pose: 'sit', gaze: [0.6, 0.4], dur: 0.5 }, { at: led, expr: 'worried', gaze: [0.2, 0.8], dur: 0.4 }] }
        ],
        props: [{ depth: 1.05, svg: tt => ledger(LP.x, LP.y, LP.s, tt, { pen: true, glow: seg(tt, led - 0.15, led + 0.35) }) }],
        overlays: [
          { type: 'label', at: 3.3, until: led - 0.3, x: 60, y: 770, text: 'CHICAGO · 1930', fs: 36, sub: 'A counting room (generic)' },
          { type: 'callout', at: led - 0.05, target: [LP.x + 200 * LP.s, LP.y - 120 * LP.s], depth: 1.05, r: 60, label: [600, 772], w: 420, text: 'A LEDGER', colour: YEL }
        ],
        tag: LIKENESS
      });
    },

    // 2 - the stakes: the night street under the 'L'; Capone walks with two silhouettes; the Crime Commission's list
    //     (Public Enemy No. 1, April 1930) and the prosecution's figure ($215,080 in tax) as one typed card
    ac25_enemy(ctx) {
      const t = ctx.t, named = WT(ctx, 0, 3, 0.9), pe = WT(ctx, 0, 5, 1.7), one = WT(ctx, 0, 8, 2.5), l1 = LS(ctx, 1, 3.6), owed = WT(ctx, 1, 3, 4.3), amt = WT(ctx, 1, 4, 4.6);
      return E.cine.shot(ctx, {
        set: 'ac25_street', grade: 'night', rain: { n: 110, op: 0.3 },
        cam: { from: { x: 30, y: 40, z: 1.0 }, to: { x: -30, y: 20, z: 1.08 }, handheld: 1.3 },
        figures: [
          { id: 'ac25_capone', x: 760, y: 1500, scale: 0.62, dir: -1, turn: 0.5, pose: 'walk', expr: 'stern', walk: { from: 1180, to: 760, at: 0.05, dur: Math.max(0.8, pe - 0.2), cadence: 5.8 }, keys: [{ at: pe, pose: 'stand', dur: 0.4 }, { at: one, pose: 'hands_behind', expr: 'stern', dur: 0.5 }, { at: owed, pose: 'stand_tense', expr: 'worried', dur: 0.5 }] },
          { id: 'ac25_hood', x: 1000, y: 1530, scale: 0.66, dir: -1, turn: 0.5, pose: 'walk', silhouette: 'cool', walk: { from: 1420, to: 1000, at: 0.1, dur: Math.max(0.8, pe - 0.1), cadence: 5.6 }, keys: [{ at: pe + 0.1, pose: 'stand', dur: 0.4 }] },
          { id: 'gb7_suit', x: 520, y: 1560, scale: 0.68, dir: -1, turn: 0.45, pose: 'walk', silhouette: 'warm', walk: { from: 920, to: 520, at: 0.0, dur: Math.max(0.8, pe - 0.3), cadence: 5.9 }, keys: [{ at: pe, pose: 'stand', dur: 0.4 }, { at: l1, pose: 'hands_together', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'card', at: named - 0.2, x: 40, y: 390, w: 720, rows: [{ text: 'CHICAGO CRIME COMMISSION · APRIL 1930', fs: 26, colour: MUTE }, { text: 'PUBLIC ENEMY No. 1', fs: 54, colour: RED, at: pe - 0.05 }, { text: 'PROSECUTORS, 1931: UNPAID TAX', fs: 26, colour: MUTE, at: owed - 0.1 }, { text: '$215,080', fs: 60, colour: RED, at: amt - 0.05 }] }
        ],
        tag: LIKENESS
      });
    },

    // 3 - the federal office: Wilson at his desk under the lamp with Capone's (empty) file; never filed; he stands and
    //     points at the cabinets: follow the money
    ac25_wilson(ctx) {
      const t = ctx.t, never = WT(ctx, 0, 2, 0.5), ret = WT(ctx, 0, 6, 1.6), l1 = LS(ctx, 1, 2.3), wil = WT(ctx, 1, 2, 3.1), money = WT(ctx, 1, 5, 4.2);
      return E.cine.shot(ctx, {
        set: 'ac25_treasury', setOpts: { view: 'office' }, grade: 'sepia',
        cam: { from: { x: -20, y: 0, z: 1.02 }, to: { x: 30, y: -30, z: 1.12 }, handheld: 0.9 },
        figures: [
          { id: 'ac25_wilson', x: 560, y: 1560, scale: 0.9, dir: 1, turn: 0.45, pose: 'sit_read', noChair: true, expr: 'focused', gaze: [0.5, 0.6], keys: [{ at: never, pose: 'sit', expr: 'stern', gaze: [0.6, 0.2], dur: 0.5 }, { at: ret + 0.1, pose: 'sit_read', dur: 0.5 }, { at: wil - 0.3, pose: 'stand', expr: 'determined', dur: 0.5 }, { at: money - 0.1, pose: 'point', dur: 0.4 }] },
          { id: 'agent_a', x: 1080, y: 1740, scale: 0.92, dir: -1, turn: 0.5, pose: 'stand', expr: 'focused', hat: FED, keys: [{ at: never + 0.2, pose: 'read', dur: 0.5 }, { at: money, pose: 'stand_tense', expr: 'determined', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.1, x: 60, y: 432, text: 'HE NEVER FILED A TAX RETURN', fs: 40, sub: 'Treasury Intelligence Unit · 1930' },
          { type: 'card', at: wil - 0.15, x: 40, y: 390, w: 760, rows: [{ text: 'SPECIAL AGENT FRANK J. WILSON', fs: 36 }, { text: 'TREASURY · ILLUSTRATION, NOT A LIKENESS', fs: 24, colour: MUTE, at: wil + 0.2 }] }
        ],
        tag: LIKENESS
      });
    },

    // 4 - the records room: Wilson pulls a box; the ledger on the crate lights up: seized in a 1926 raid, Cicero
    ac25_storage(ctx) {
      const t = ctx.t, found = WT(ctx, 0, 1, 0.5), led = WT(ctx, 0, 3, 1.0), seized = WT(ctx, 0, 4, 1.4), raid = WT(ctx, 0, 8, 2.2), cic = WT(ctx, 0, 11, 2.9);
      const LP = { x: 540, y: 1100, s: 0.74 };
      return E.cine.shot(ctx, {
        set: 'ac25_treasury', setOpts: { view: 'storage' }, grade: 'sepia',
        cam: { keys: [{ at: 0, x: 20, y: 0, z: 1.0 }, { at: found - 0.3, x: 0, y: 40, z: 1.12, dur: 1.2 }], handheld: 1.4 },
        shake: [{ at: led, amp: 4 }],
        figures: [
          { id: 'ac25_wilson', x: 700, y: 1600, scale: 0.9, dir: -1, turn: 0.5, pose: 'examine', expr: 'focused', gaze: [-0.5, 0.6], keys: [{ at: found - 0.3, pose: 'point', expr: 'realise', gaze: [-0.4, 0.8], dur: 0.4 }, { at: seized, pose: 'read', expr: 'focused', dur: 0.5 }, { at: cic, pose: 'stand', expr: 'determined', dur: 0.4 }] },
          { id: 'analyst', x: 240, y: 1540, scale: 0.9, dir: 1, turn: 0.5, pose: 'stand', expr: 'focused', keys: [{ at: 0.1, pose: 'examine', dur: 0.5 }, { at: led, pose: 'point', expr: 'realise', dur: 0.4 }, { at: raid, pose: 'stand', dur: 0.4 }] }
        ],
        props: [{ depth: 1.05, svg: tt => ledger(LP.x, LP.y, LP.s, tt, { glow: seg(tt, led - 0.15, led + 0.4) * (1 - 0.4 * seg(tt, raid, raid + 0.5)) }) }],
        overlays: [
          { type: 'label', at: 0.1, until: seized - 0.2, x: 60, y: 432, text: 'FEDERAL RECORDS ROOM · 1930', fs: 38, sub: 'Old seizures in storage' },
          { type: 'callout', at: seized, target: [LP.x + 240 * LP.s, LP.y - 200 * LP.s], depth: 1.05, r: 80, label: [420, 640], w: 600, h: 104, text: 'SEIZED IN A 1926 RAID', sub: 'a Cicero gambling house', colour: YEL },
          { type: 'card', at: cic - 0.2, x: 60, y: 390, w: 620, rows: [{ text: 'CICERO, ILLINOIS', fs: 44, colour: RED }] }
        ],
        tag: LIKENESS
      });
    },

    // 5 - the bookkeeper: back in the counting room, he writes in the ledger (the handwriting); the agents walk in and
    //     find him; at "testified" he stands
    ac25_bookkeeper(ctx) {
      const t = ctx.t, hand = WT(ctx, 0, 1, 0.3), led = WT(ctx, 0, 2, 0.8), book = WT(ctx, 0, 6, 1.9), l1 = LS(ctx, 1, 2.8), test = WT(ctx, 1, 1, 3.1);
      const LP = { x: 390, y: 1080, s: 0.55 };
      return E.cine.shot(ctx, {
        set: 'ac25_backroom', grade: 'warm',
        cam: { from: { x: 40, y: 20, z: 1.06 }, to: { x: -20, y: 0, z: 1.0 }, handheld: 1.2 },
        figures: [
          { id: 'ac25_bookkeeper', x: 600, y: 1480, scale: 0.86, dir: -1, turn: 0.45, pose: 'sit_read', noChair: true, expr: 'focused', gaze: [-0.4, 0.7], keys: [{ at: led, pose: 'sit', gaze: [0.5, 0.6], dur: 0.4 }, { at: book - 0.2, pose: 'sit', expr: 'shocked', gaze: [0.9, 0.1], dur: 0.4 }, { at: test - 0.2, pose: 'stand', expr: 'worried', dur: 0.6 }] },
          { id: 'ac25_wilson', x: 1000, y: 1600, scale: 0.92, dir: -1, turn: 0.5, pose: 'walk', expr: 'focused', show: [led - 0.2], walk: { from: 1400, to: 1000, at: led, dur: Math.max(0.7, book - led), cadence: 6.0 }, keys: [{ at: book, pose: 'point', expr: 'determined', dur: 0.4 }, { at: test, pose: 'stand', dur: 0.4 }] },
          { id: 'agent_a', x: 1240, y: 1640, scale: 0.9, dir: -1, turn: 0.5, pose: 'walk', expr: 'focused', hat: FED, show: [led + 0.1], walk: { from: 1600, to: 1240, at: led + 0.2, dur: Math.max(0.7, book - led), cadence: 6.0 }, keys: [{ at: book + 0.1, pose: 'stand', dur: 0.4 }] }
        ],
        props: [{ depth: 1.05, svg: tt => ledger(LP.x, LP.y, LP.s, tt, { pen: true, glow: 0.7 * seg(tt, hand - 0.1, hand + 0.3) * (1 - seg(tt, led + 0.6, led + 1.0)) }) }],
        overlays: [
          { type: 'label', at: 0.1, until: book - 0.3, x: 60, y: 432, text: 'THE HANDWRITING', fs: 40, sub: 'Matched to the gambling house bookkeeper' },
          { type: 'card', at: book - 0.1, x: 40, y: 390, w: 760, rows: [{ text: 'THE BOOKKEEPER: FOUND', fs: 40, colour: RED }, { text: 'TESTIFIED FOR THE PROSECUTION · 1931', fs: 28, colour: MUTE, at: test - 0.05 }] }
        ],
        tag: LIKENESS
      });
    },

    // 6 - the lawyer's letter: in the federal office, Capone's tax lawyer hands Wilson a sheet (blank: no real letter is
    //     imitated); the card says what it conceded
    ac25_letter(ctx) {
      const t = ctx.t, law = WT(ctx, 0, 2, 0.6), wrote = WT(ctx, 0, 4, 1.2), tax = WT(ctx, 0, 7, 2.1), conc = WT(ctx, 0, 8, 2.6), inc = WT(ctx, 0, 9, 3.0);
      return E.cine.shot(ctx, {
        set: 'ac25_treasury', setOpts: { view: 'office', deskX: -200 }, grade: 'sepia',
        cam: { from: { x: 20, y: 10, z: 1.0 }, to: { x: -30, y: -10, z: 1.1 }, handheld: 1.0 },
        figures: [
          { id: 'ac25_lawyer', x: 340, y: 1700, scale: 0.94, dir: 1, turn: 0.5, pose: 'stand', expr: 'neutral', propOverride: 'paper', walk: { from: 60, to: 340, at: 0.05, dur: Math.max(0.6, law - 0.1), cadence: 6.0 }, keys: [{ at: law, pose: 'read', dur: 0.4 }, { at: wrote, pose: 'present', dur: 0.5 }, { at: inc, pose: 'hands_together', expr: 'worried', dur: 0.5 }] },
          { id: 'ac25_wilson', x: 860, y: 1700, scale: 0.94, dir: -1, turn: 0.5, pose: 'stand', expr: 'focused', keys: [{ at: tax - 0.2, pose: 'read', expr: 'focused', gaze: [-0.4, 0.6], dur: 0.5 }, { at: conc, pose: 'stand_tense', expr: 'realise', gaze: [-0.8, 0.1], dur: 0.4 }] },
          { id: 'agent_a', x: 1180, y: 1720, scale: 0.9, dir: -1, turn: 0.5, pose: 'stand', expr: 'focused', hat: FED, keys: [{ at: conc, pose: 'arms_crossed', expr: 'determined', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: tax - 0.2, x: 60, y: 432, text: 'A LETTER FROM HIS OWN LAWYER', fs: 38, sub: '1930 · to the Treasury' },
          { type: 'card', at: tax - 0.1, x: 40, y: 390, w: 900, rows: [{ text: 'THE LAWYER’S LETTER CONCEDED INCOME', fs: 34, colour: RED }, { text: 'ADMITTED AT TRIAL OVER OBJECTION · 1931', fs: 26, colour: MUTE, at: inc }] }
        ],
        tag: LIKENESS
      });
    },

    // 7 - THE HOW: the ledger, close, on Wilson's desk; its profit shares are split by name, and one row is highlighted
    //     with our own typed callout: "AL"
    ac25_reveal(ctx) {
      const t = ctx.t, split = WT(ctx, 0, 2, 0.5), name = WT(ctx, 0, 7, 2.0), l1 = LS(ctx, 1, 2.8), al = WT(ctx, 1, 5, 4.0);
      const LP = { x: 540, y: 1010, s: 0.98 };
      return E.cine.shot(ctx, {
        set: 'ac25_treasury', setOpts: { view: 'office' }, grade: 'sepia',
        cam: { keys: [{ at: 0, x: 0, y: 60, z: 1.08 }, { at: al - 0.5, x: 0, y: 90, z: 1.22, dur: 1.0 }], handheld: 0.8 },
        shake: [{ at: al, amp: 6 }],
        figures: [
          { id: 'ac25_wilson', x: 540, y: 1620, scale: 1.2, dir: 1, turn: 0.1, pose: 'sit', noChair: true, propOverride: null, expr: 'focused', gaze: [0.1, 0.9], keys: [{ at: split, pose: 'sit_read', gaze: [0.2, 0.9], dur: 0.5 }, { at: name - 0.2, pose: 'point', expr: 'focused', gaze: [0.1, 0.9], dur: 0.4 }, { at: al - 0.1, expr: 'realise', gaze: [0.3, 0.4], dur: 0.3 }] }
        ],
        props: [{ depth: 1.05, svg: tt => ledger(LP.x, LP.y, LP.s, tt, { mark: seg(tt, al - 0.25, al + 0.1), glow: 0.5 * seg(tt, al - 0.2, al + 0.3) }) }],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.1, x: 60, y: 432, text: 'PROFITS SPLIT BY NAME', fs: 40, sub: 'The gambling house ledger, 1924-26' },
          { type: 'callout', at: al - 0.05, target: [LP.x + 250 * LP.s, LP.y + (-236 + 7 * 30 + 17) * LP.s], depth: 1.05, r: 44, label: [300, 560], w: 480, h: 104, text: 'ONE NAME IN IT: “AL”', sub: 'our own mark; entries not reproduced', colour: YEL, fs: 34 }
        ],
        tag: TAG
      });
    },

    // 8 - the outcome: a 1930s federal courtroom; guilty on five counts (17 Oct 1931), 11 years (24 Oct), Atlanta then
    //     Alcatraz. The judge's jury-panel swap and the Ness caveat are typed rows, not narration.
    ac25_verdict(ctx) {
      const t = ctx.t, guilty = WT(ctx, 0, 0, 0.2), five = WT(ctx, 0, 2, 0.8), l1 = LS(ctx, 1, 2.0), yrs = WT(ctx, 1, 1, 2.3), alc = WT(ctx, 1, 3, 3.3), end = ctx.T;
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { dock: false }, grade: 'sepia', cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.1 }, handheld: 0.6 },
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, depth: 0.33, keys: [{ at: guilty - 0.35, pose: 'gavel', dur: 0.3 }, { at: guilty + 0.1, pose: 'sit', dur: 0.2 }, { at: l1, pose: 'sit_read', dur: 0.5 }] },
          { id: 'ac25_capone', x: 860, y: 1760, scale: 0.95, dir: -1, turn: 0.2, pose: 'stand', outfit: 'court', hat: null, expr: 'blank', keys: [{ at: guilty, pose: 'hands_together', expr: 'stern', dur: 0.4 }, { at: yrs, pose: 'stand_tense', expr: 'worried', dur: 0.5 }, { at: alc, pose: 'bowed', dur: 0.6 }] },
          { id: 'ac25_wilson', x: 170, y: 1560, scale: 0.8, dir: 1, turn: 0.4, pose: 'stand', expr: 'neutral', keys: [{ at: five, pose: 'hands_together', dur: 0.5 }, { at: alc, pose: 'stand', expr: 'neutral', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: five + 0.2, x: 60, y: 432, text: 'FEDERAL COURT, CHICAGO · 17 OCT 1931', fs: 34, sub: 'The judge swapped the whole jury panel on day one' },
          { type: 'card', at: five - 0.05, x: 40, y: 920, w: 700, rows: [{ text: 'GUILTY · FIVE TAX COUNTS', fs: 36, colour: RED }, { text: '11 YEARS · $50,000 FINE + COSTS', fs: 32, at: yrs - 0.05 }, { text: 'ATLANTA, THEN ALCATRAZ (1934)', fs: 30, at: alc - 0.05 }, { text: 'THE TAX CASE DID IT, NOT NESS’S SQUAD', fs: 22, colour: MUTE, at: alc + 0.5 }] }
        ],
        tag: LIKENESS
      });
    },

    // 9 - callback on the hero object: the counting room as in the first frame, the ledger alone under the lamp, the
    //     cash box shut; Capone has gone (the bookkeeper stands, then leaves). The engine burns the end question over
    //     the last 3.2 s at y 520, so no label or card of ours sits in y 380-720 then; the last frame loops to the first.
    ac25_end(ctx) {
      const led = WT(ctx, 0, 1, 0.3), down = WT(ctx, 0, 5, 1.6);
      const LP = { x: 540, y: 1040, s: 0.72 };
      return E.cine.shot(ctx, {
        set: 'ac25_backroom', grade: 'warm',
        cam: { from: { x: 0, y: 50, z: 1.07 }, to: { x: 0, y: 30, z: 1.0 }, handheld: 0.6 },
        figures: [
          { id: 'ac25_bookkeeper', x: 300, y: 1470, scale: 0.86, dir: 1, turn: 0.45, pose: 'sit', noChair: true, expr: 'neutral', gaze: [0.5, 0.6], keys: [{ at: down - 0.2, pose: 'stand', expr: 'neutral', dur: 0.6 }, { at: down + 0.6, pose: 'hands_behind', dur: 0.5 }], show: [0, down + 1.3] }
        ],
        props: [{ depth: 1.05, svg: tt => ledger(LP.x, LP.y, LP.s, tt, { pen: true, glow: 0.8 * seg(tt, led - 0.2, led + 0.3) * (1 - seg(tt, down + 0.8, down + 1.4)) }) }],
        overlays: [],   // nothing of ours: the engine burns the end question over the last 3.2 s
        tag: TAG
      });
    }
  });
})();
