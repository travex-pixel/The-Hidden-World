/* Case File 27 (cinematic, 40-second cut): Bernie Madoff, the biggest Ponzi scheme in history, ended by a confession to his sons.
   CLOSED: pleaded guilty to 11 felonies on 12 March 2009; sentenced to 150 years on 29 June 2009; died in prison on 14 April 2021.
   Structure (short40 + the Case File 25 rules): a burned-in hook headline (contradiction + object) over the HERO OBJECT, a
   generic account statement (our own typed design: no firm name, no logo, illustrative figures) with an impossibly steady line
   of monthly gains, big and centred in the first frame and again in the last (the video loops); a stakes number by 0:10 (about
   $65 billion on the statements vs about $17.5 billion principal lost); reveals every 4-6 s (the smooth gains, no trades, the
   whistle-blower, the inspector general, the confession, the arrest); the outcome in one line; a callback on the statement; a
   burned-in end question (episode.end_title) over the last 3.2 s. No nextcase card.
   Content rules:
   - Madoff appears only as an illustrated representation (characters/figures/md27_madoff.json): a generic white-haired man
     in a dark suit, no photo reference, never with cash or any victim; every shot he is in is tagged 'ILLUSTRATION · NOT A
     LIKENESS'. Harry Markopolos likewise (md27_markopolos).
   - His sons are drawn ONLY as anonymous rim-lit silhouettes (silhouette: 'cool'), never with faces, never at the arrest or in
     court; they are not named on screen. Their later deaths are not mentioned anywhere.
   - No victim or investor is named or shown. No real document is imitated: the statement is our own typed design; the memo
     and the report are blank or illegible; every card is the series' own typed graphic. No dialogue is invented; "one big
     lie" is on a 'WORDING AS REPORTED' card.
   New environments (E.registerSets): md27_office (a generic Manhattan corner office, skyline window; o.night),
   md27_regulator (a generic regulator's office, 2000s: cubicles, file boxes, a meeting table), md27_apartment (a generic
   Manhattan apartment; o.view 'living' at night or 'hall', the front door in the morning). Plus the shared office_day and
   courtroom (modern).
   Timing: actions are keyed to the narrator's word timings (WT), so they land on the spoken word. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120d0b';
  const TYPE = "font-family=\"Courier Prime\"";
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC PLACES AND PEOPLE';
  const LIKENESS = 'ILLUSTRATION · NOT A LIKENESS';
  const YEL = '#ffd23f', RED = '#8e1f18', MUTE = '#6b665c', GRN = '#1d8a4a';

  // ---------- THE HERO: a generic monthly account statement (our own typed design; no firm, no logo, illustrative figures):
  // a navy header band, a 12-month column of small positive returns, and a balance chart whose line climbs almost perfectly
  // straight. Centre (x, y); 900 x 620 at s = 1.
  // o.draw 0..1 draws the chart line; o.glow 0..1 lights the page; o.mark 0..1 highlights the returns column;
  // o.hollow 0..1 empties it: the figures fade to dashes and the line goes grey and dashed ("nothing behind them").
  const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const RETS = ['+1.1%', '+0.9%', '+1.2%', '+1.0%', '+0.8%', '+1.3%', '+1.0%', '+0.9%', '+1.1%', '+1.2%', '+0.8%', '+1.0%'];
  function statement(x, y, s, t, o = {}) {
    const draw = o.draw ?? 1, hol = o.hollow || 0, m = o.mark || 0, k = o.glow || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-440" y="-290" width="900" height="620" fill="#000" opacity="0.35" filter="url(#cineSoft)"/>`;
    g += `<rect x="-450" y="-310" width="900" height="620" rx="6" fill="#f6f3ea" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="-450" y="-310" width="900" height="78" rx="6" fill="#1f3a5a"/><rect x="-450" y="-250" width="900" height="18" fill="#1f3a5a"/>`;
    g += `<text x="-420" y="-256" ${TYPE} font-weight="700" font-size="44" fill="#f6f3ea">ACCOUNT STATEMENT</text><text x="420" y="-258" text-anchor="end" ${TYPE} font-weight="700" font-size="26" fill="#bcd0e6">MONTHLY</text>`;
    g += `<text x="-420" y="-196" ${TYPE} font-weight="700" font-size="22" fill="#4a4a4a">CLIENT</text><rect x="-320" y="-214" width="200" height="22" fill="#1a1a1a"/><text x="-60" y="-196" ${TYPE} font-weight="700" font-size="22" fill="#4a4a4a">12 MONTHS</text>`;
    g += `<path d="M-430 -178 L430 -178" stroke="#1f3a5a" stroke-width="3"/>`;
    // the returns column
    if (m > 0) g += `<rect x="-300" y="-170" width="140" height="${12 * 34 + 8}" fill="${YEL}" opacity="${f1(0.6 * m)}"/>`;
    MONTHS.forEach((mo, i) => {
      const yy = -142 + i * 34;
      g += `<text x="-420" y="${yy}" ${TYPE} font-weight="700" font-size="24" fill="#3a3a3a">${mo}</text>`;
      if (hol < 1) g += `<text x="-290" y="${yy}" ${TYPE} font-weight="700" font-size="26" fill="${GRN}" opacity="${f1(1 - hol)}">${RETS[i]}</text>`;
      if (hol > 0) g += `<text x="-290" y="${yy}" ${TYPE} font-weight="700" font-size="26" fill="#9a958a" opacity="${f1(hol)}">  ---</text>`;
      g += `<path d="M-430 ${yy + 10} L-150 ${yy + 10}" stroke="#d9d3c4" stroke-width="1.5"/>`;
    });
    // the balance chart: axes, grid and an almost ruler-straight climb
    const CX0 = -110, CX1 = 420, CY0 = 250, CY1 = -150;
    g += `<rect x="${CX0}" y="${CY1}" width="${CX1 - CX0}" height="${CY0 - CY1}" fill="#fbfaf5" stroke="#bdb6a4" stroke-width="2"/>`;
    for (let i = 1; i < 5; i++) g += `<path d="M${CX0} ${CY1 + i * 80} L${CX1} ${CY1 + i * 80}" stroke="#e2dccd" stroke-width="2"/>`;
    g += `<text x="${CX0 + 14}" y="${CY1 + 34}" ${TYPE} font-weight="700" font-size="24" fill="#4a4a4a">BALANCE</text>`;
    const pts = RETS.map((r_, i) => [CX0 + 30 + i * ((CX1 - CX0 - 60) / 11), CY0 - 40 - i * 26 - (i % 2 ? 4 : 0)]);
    const d = 'M' + pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join(' L');
    const len = 560;
    const lineCol = hol > 0.5 ? '#9a958a' : GRN;
    g += `<path d="${d}" fill="none" stroke="${lineCol}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${hol > 0.5 ? '14 16' : `${f1(len * draw)} ${len}`}"/>`;
    pts.forEach((p, i) => { if (i / 11 <= draw + 0.001) g += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="8" fill="${hol > 0.5 ? '#f6f3ea' : lineCol}" stroke="${lineCol}" stroke-width="3"/>`; });
    g += `<path d="M${CX0} ${CY0} L${CX1} ${CY0}" stroke="#4a4a4a" stroke-width="3"/><path d="M${CX0} ${CY0} L${CX0} ${CY1}" stroke="#4a4a4a" stroke-width="3"/>`;
    g += `<text x="0" y="292" text-anchor="middle" ${TYPE} font-size="18" fill="#7a756a">OUR OWN DESIGN · ILLUSTRATIVE FIGURES · NOT A REAL STATEMENT</text>`;
    if (k > 0) g += `<rect x="-466" y="-326" width="932" height="652" rx="14" fill="none" stroke="${YEL}" stroke-width="10" opacity="${f1(k * (0.75 + 0.25 * Math.sin(t * 7)))}"/>` + wash(0, 0, 520, 360, '#fff1b0', f1(0.22 * k));
    return g + '</g>';
  }
  // a generic Manhattan skyline inside a window rect (towers with lit or pale windows; nothing recognisable)
  function skyline(X, Y, Wd, Hh, night, seed) {
    const r = R(seed);
    let s = `<rect x="${X}" y="${Y}" width="${Wd}" height="${Hh}" fill="${night ? '#0b1430' : '#b9cde2'}"/>` + wash(X + Wd / 2, Y + Hh * 0.8, Wd * 0.7, Hh * 0.4, night ? '#3a4a8a' : '#f2efe4', night ? 0.35 : 0.4);
    for (let layer = 0; layer < 2; layer++) {
      let x = X - 40;
      while (x < X + Wd) {
        const w = 70 + r() * 110, h = (layer ? 0.35 : 0.55) * Hh + r() * Hh * (layer ? 0.35 : 0.4), top = Y + Hh - h;
        const col = night ? (layer ? '#141a2c' : '#1c2338') : (layer ? '#7a889c' : '#9aa6b6');
        s += `<rect x="${f1(x)}" y="${f1(top)}" width="${f1(w)}" height="${f1(h)}" fill="${col}"/>`;
        if (r() < 0.25) s += `<rect x="${f1(x + w * 0.35)}" y="${f1(top - 40)}" width="${f1(w * 0.3)}" height="40" fill="${col}"/>`;
        for (let yy = top + 14; yy < Y + Hh - 10; yy += 26) for (let xx = x + 10; xx < x + w - 12; xx += 20) if (r() < (night ? 0.38 : 0.5)) s += `<rect x="${f1(xx)}" y="${f1(yy)}" width="9" height="13" fill="${night ? (r() < 0.8 ? '#ffd98a' : '#cfe0ff') : '#dfe8f2'}" opacity="${night ? 0.85 : 0.55}"/>`;
        x += w + 6 + r() * 20;
      }
    }
    return s;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a Manhattan corner office (generic): a floor-to-ceiling window onto the skyline, walnut panelling, an abstract
    // print, a low cabinet; the executive chair (o.chair) behind the desk; the desk in the foreground (depth 1.04) is
    // where the hero statement lies; o.desk = false drops it. o.night switches the skyline and the light.
    md27_office(ctx, o = {}) {
      const t = ctx.t, night = !!o.night;
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="${night ? '#2a1e18' : '#5a4232'}"/>`;
      for (let i = -3; i < 14; i++) wall += `<rect x="${i * 120}" y="-300" width="112" height="1340" fill="${night ? '#33251c' : '#6a4e3a'}" stroke="${INK}" stroke-width="3" opacity="0.8"/>`;
      // the window: three tall panes with mullions
      const WX = 120, WY = 110, WW = 840, WH = 860;
      wall += `<defs><clipPath id="md27win"><rect x="${WX}" y="${WY}" width="${WW}" height="${WH}"/></clipPath></defs><g clip-path="url(#md27win)">${skyline(WX, WY, WW, WH, night, 2727)}</g>`;
      wall += `<rect x="${WX - 16}" y="${WY - 16}" width="${WW + 32}" height="${WH + 32}" fill="none" stroke="#1a1a1e" stroke-width="22"/>` + [1, 2].map(i => `<rect x="${WX + i * WW / 3 - 7}" y="${WY}" width="14" height="${WH}" fill="#1a1a1e"/>`).join('') + `<rect x="${WX}" y="${WY + WH * 0.62}" width="${WW}" height="10" fill="#1a1a1e"/>`;
      wall += night ? wash(540, 520, 520, 460, '#5a6ab0', 0.12) : wash(540, 520, 560, 480, '#fff6dc', 0.18);
      // an abstract print on the right panel (shapes only), a low cabinet with a plant on the left
      wall += `<rect x="1000" y="300" width="200" height="260" fill="#e8e2d4" stroke="#1a1a1e" stroke-width="10"/><circle cx="1070" cy="400" r="48" fill="#b8402a" opacity="0.85"/><rect x="1100" y="430" width="70" height="100" fill="#2a4a7a" opacity="0.85"/>`;
      wall += `<rect x="-200" y="860" width="300" height="180" fill="#3a2a20" stroke="${INK}" stroke-width="5"/><path d="M-40 860 Q-60 760 -20 700 M-40 860 Q-10 770 30 720 M-40 860 Q-90 790 -110 740" stroke="#2f5a3a" stroke-width="16" fill="none" stroke-linecap="round"/><rect x="-80" y="820" width="80" height="44" fill="#5a4a3a" stroke="${INK}" stroke-width="3"/>`;
      let floor = `<rect x="-300" y="1036" width="${W + 600}" height="${H}" fill="${night ? '#1e1a1a' : '#4a3e3a'}"/>`;
      floor += `<rect x="-300" y="1030" width="${W + 600}" height="10" fill="#120e0c"/>`;
      const layers = [[0.3, wall], [1.0, floor]];
      if (o.chair !== false) {
        // a high-backed leather chair behind the desk (behind the figures' plane)
        layers.push([0.97, `<g transform="translate(${o.chairX ?? 540} 1200)"><rect x="-150" y="-470" width="300" height="420" rx="40" fill="#1a1416" stroke="${INK}" stroke-width="6"/><rect x="-120" y="-440" width="240" height="360" rx="30" fill="#241c1e"/>${[0, 1, 2].map(i => `<path d="M-110 ${-380 + i * 110} L110 ${-380 + i * 110}" stroke="#120e0e" stroke-width="5"/>`).join('')}<rect x="-170" y="-80" width="340" height="60" rx="20" fill="#1a1416" stroke="${INK}" stroke-width="5"/></g>`]);
      }
      if (o.desk !== false) {
        const lamp = night ? 1 : 0.4;
        let desk = `<rect x="-300" y="1150" width="${W + 600}" height="40" fill="#5a3a26" stroke="${INK}" stroke-width="6"/><rect x="-300" y="1188" width="${W + 600}" height="${H}" fill="#3a2418" stroke="${INK}" stroke-width="5"/>`;
        for (let i = 0; i < 8; i++) desk += `<path d="M${-200 + i * 190} 1196 L${-200 + i * 190} 1700" stroke="#000" stroke-opacity="0.2" stroke-width="3"/>`;
        // a modern desk lamp (left), a desk phone and a pen (right)
        desk += `<g transform="translate(70 1150)"><ellipse cx="0" cy="-6" rx="60" ry="12" fill="#1a1a1e"/><path d="M0 -10 L40 -230 L130 -260" stroke="#1a1a1e" stroke-width="12" fill="none"/><path d="M100 -290 L200 -250 L160 -210 L80 -250 Z" fill="#2a2a2e" stroke="${INK}" stroke-width="4"/></g>` + wash(200, 1160, 300, 130, '#ffe6a8', f1(0.3 * lamp));
        desk += `<g transform="translate(1010 1150)"><rect x="-90" y="-60" width="180" height="60" rx="10" fill="#1e1e22" stroke="${INK}" stroke-width="4"/><rect x="-80" y="-96" width="160" height="40" rx="18" fill="#2a2a30" stroke="${INK}" stroke-width="4"/>${[0, 1, 2].map(i => `<rect x="${-60 + i * 44}" y="-44" width="30" height="16" rx="3" fill="#4a4a52"/>`).join('')}</g>`;
        layers.push([1.04, desk]);
      }
      return { light: night ? { dir: -1, rim: '#9fb0ff', key: '#ffe0b0' } : { dir: 1, rim: '#fff6dc', key: '#fff0d8' }, layers };
    },

    // a federal regulator's office in the 2000s (generic, no seal, no name): fluorescent ceiling, a window with blinds onto
    // a grey day, cubicle partitions with box monitors, stacks of file boxes; a meeting table in the foreground (depth 1.04)
    md27_regulator(ctx, o = {}) {
      const t = ctx.t, r = R(2728);
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#cfc6b0"/><rect x="-300" y="-300" width="${W + 600}" height="380" fill="#e4e0d6"/>`;
      for (let i = -2; i < 6; i++) wall += `<rect x="${i * 300}" y="10" width="220" height="34" rx="4" fill="#fbfbf2" opacity="${f1(0.85 + 0.1 * Math.sin(t * 40 + i))}"/>`;
      wall += `<rect x="-300" y="76" width="${W + 600}" height="8" fill="#a89e88"/>`;
      // window with blinds on the left
      wall += `<rect x="-120" y="200" width="420" height="560" fill="#c4ccd2" stroke="#6a6458" stroke-width="12"/>`;
      for (let i = 0; i < 19; i++) wall += `<rect x="-114" y="${208 + i * 29}" width="408" height="16" fill="#9aa2a8"/>`;
      // a cork board with pinned blank sheets, a wall clock
      wall += `<rect x="420" y="250" width="320" height="220" fill="#a8845a" stroke="#5a4a32" stroke-width="8"/>` + [[440, 270], [540, 290], [640, 266], [470, 370], [600, 380]].map(([x, y]) => `<rect x="${x}" y="${y}" width="80" height="70" fill="#f4f0e4" transform="rotate(${f1(-4 + r() * 8)} ${x + 40} ${y + 35})"/><circle cx="${x + 40}" cy="${y + 6}" r="5" fill="#c0302a"/>`).join('');
      wall += `<g transform="translate(900 300)"><circle r="56" fill="#f4f0e4" stroke="#2a2a2a" stroke-width="7"/><path d="M0 0 L0 -34" stroke="#1a1a1a" stroke-width="6" transform="rotate(${f1(110 + t * 2)})"/><path d="M0 0 L0 -44" stroke="#1a1a1a" stroke-width="4" transform="rotate(${f1(t * 30)})"/></g>`;
      // stacks of file boxes on the right
      const box = (x, y, w, h) => `<g transform="translate(${x} ${y})"><rect width="${w}" height="${h}" fill="#e8dfc8" stroke="#7a6e58" stroke-width="4"/><rect y="0" width="${w}" height="${f1(h * 0.2)}" fill="#d6ccb2" stroke="#7a6e58" stroke-width="3"/><rect x="${f1(w * 0.3)}" y="${f1(h * 0.45)}" width="${f1(w * 0.4)}" height="${f1(h * 0.2)}" fill="#fbfbf4" stroke="#7a6e58" stroke-width="2"/></g>`;
      wall += box(980, 900, 240, 150) + box(1000, 750, 220, 150) + box(990, 600, 230, 150) + box(1220, 900, 200, 150);
      // cubicle partitions with box monitors
      let mid = `<rect x="-300" y="880" width="1260" height="200" fill="#6a7a8a" stroke="#3a4450" stroke-width="5"/><rect x="-300" y="872" width="1260" height="14" fill="#4a5462"/>`;
      [[-120, 900], [260, 900], [640, 900]].forEach(([x]) => { mid += `<rect x="${x}" y="772" width="150" height="110" rx="8" fill="#d8d4c8" stroke="${INK}" stroke-width="4"/><rect x="${x + 14}" y="784" width="122" height="80" fill="#2a4a5a"/><rect x="${x + 50}" y="870" width="50" height="12" fill="#b8b4a8"/>`; });
      let floor = `<rect x="-300" y="1070" width="${W + 600}" height="${H}" fill="#7a7468"/>`;
      for (let i = 0; i < 10; i++) floor += `<line x1="-300" y1="${1100 + i * 60}" x2="${W + 300}" y2="${1100 + i * 60}" stroke="#000" stroke-opacity="0.12" stroke-width="3"/>`;
      const layers = [[0.3, wall], [0.6, mid], [1.0, floor]];
      if (o.table !== false) {
        let tb = `<rect x="-300" y="1290" width="${W + 600}" height="36" fill="#8a7a62" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1324" width="${W + 600}" height="${H}" fill="#5a4e40" stroke="${INK}" stroke-width="5"/>`;
        tb += `<g transform="translate(860 1290)">${[0, 1, 2, 3].map(i => `<rect x="${-110 + (i % 2) * 6}" y="${-14 - i * 12}" width="220" height="12" fill="${i % 2 ? '#f4f0e4' : '#e8e2d2'}" stroke="${INK}" stroke-width="2"/>`).join('')}</g><g transform="translate(240 1290)"><rect x="-40" y="-56" width="80" height="56" rx="6" fill="#f4f0e4" stroke="${INK}" stroke-width="3"/><path d="M40 -44 Q66 -30 40 -14" stroke="${INK}" stroke-width="5" fill="none"/></g>`;
        layers.push([1.04, tb]);
      }
      return { light: { dir: -1, rim: '#f4f6ff', key: '#f4f0e4' }, layers, dust: true };
    },

    // a Manhattan apartment (generic). o.view 'living': night; tall windows onto lit towers, curtains, bookcases, a floor
    // lamp, a sofa and an armchair; 'hall': the front door in the morning, a marble floor, a console table, pale daylight.
    // o.open 0..1 swings the front door open.
    md27_apartment(ctx, o = {}) {
      const t = ctx.t, hall = o.view === 'hall';
      if (hall) {
        let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#d9d2c2"/>`;
        wall += `<rect x="-300" y="1000" width="${W + 600}" height="40" fill="#bfb6a2"/>`;
        for (let i = -2; i < 12; i++) wall += `<rect x="${i * 160 + 20}" y="620" width="120" height="360" fill="none" stroke="#bfb6a2" stroke-width="5"/>`;
        // the door: frame, the opening (corridor light behind), the leaf swinging open
        const DX = 280, DY = 360, DW = 340, DH = 680, op = clamp(o.open || 0, 0, 1);
        wall += `<rect x="${DX - 30}" y="${DY - 30}" width="${DW + 60}" height="${DH + 30}" fill="#efe9dc" stroke="#8a806c" stroke-width="6"/><rect x="${DX}" y="${DY}" width="${DW}" height="${DH}" fill="#e8e4da"/>` + wash(DX + DW / 2, DY + DH / 2, 200, 340, '#ffffff', 0.4);
        wall += `<rect x="${DX + 60}" y="${DY + 40}" width="${DW - 120}" height="${DH - 40}" fill="#c8c2b4"/><path d="M${DX + 60} ${DY + DH} L${DX + DW - 60} ${DY + DH}" stroke="#8a806c" stroke-width="4"/>`;
        const lw = f1(DW * (1 - 0.82 * ease.inOut(op)));
        let leaf = `<rect x="${DX}" y="${DY}" width="${lw}" height="${DH}" fill="#3a2418" stroke="${INK}" stroke-width="5"/>`;
        if (lw > 120) leaf += `<rect x="${DX + 26}" y="${DY + 40}" width="${f1(lw - 52)}" height="260" fill="none" stroke="#2a180e" stroke-width="5"/><rect x="${DX + 26}" y="${DY + 360}" width="${f1(lw - 52)}" height="280" fill="none" stroke="#2a180e" stroke-width="5"/><circle cx="${f1(DX + lw - 34)}" cy="${DY + 350}" r="13" fill="#c9a356" stroke="${INK}" stroke-width="3"/>`;
        wall += leaf;
        // a console table with a vase, a mirror, a wall sconce; morning light through a side window (right)
        wall += `<rect x="780" y="300" width="240" height="320" rx="120" fill="#c9d4dc" stroke="#a8925a" stroke-width="12"/><rect x="740" y="760" width="320" height="24" fill="#4a3426" stroke="${INK}" stroke-width="4"/><path d="M760 784 L770 1000 M1040 784 L1030 1000" stroke="#4a3426" stroke-width="12"/><path d="M880 760 Q860 700 880 660 L920 660 Q940 700 920 760 Z" fill="#e8e4f0" stroke="${INK}" stroke-width="3"/><path d="M900 660 Q880 600 860 580 M900 660 Q920 590 950 575 M900 660 Q900 600 905 560" stroke="#3a6a42" stroke-width="5" fill="none"/>`;
        wall += `<path d="M1180 -300 L1380 -300 L1380 ${H} L1180 ${H}" fill="#fff8e6" opacity="0.5"/>` + wash(1100, 700, 500, 700, '#fff3d6', 0.3);
        let floor = `<rect x="-300" y="1040" width="${W + 600}" height="${H}" fill="#e4e0d8"/>`;
        for (let i = 0; i < 9; i++) for (let j = -3; j < 14; j++) if ((i + j) % 2) floor += `<rect x="${j * 120 + (i % 2) * 0}" y="${1040 + i * 110}" width="120" height="110" fill="#3a3a40" opacity="0.85"/>`;
        floor += wash(540, 1300, 700, 260, '#fff6e0', 0.2);
        return { light: { dir: 1, rim: '#fff3d6', key: '#fff6e6' }, layers: [[0.35, wall], [1.0, floor]] };
      }
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#24302a"/>`;
      wall += `<rect x="-300" y="960" width="${W + 600}" height="80" fill="#1c2620"/><rect x="-300" y="956" width="${W + 600}" height="8" fill="#c9b88a" opacity="0.4"/>`;
      // two tall windows onto the night towers, with curtains
      [[60, 140], [640, 140]].forEach(([x, y], k) => {
        wall += `<defs><clipPath id="md27aw${k}"><rect x="${x}" y="${y}" width="380" height="700"/></clipPath></defs><g clip-path="url(#md27aw${k})">${skyline(x, y, 380, 700, true, 2730 + k)}</g>`;
        wall += `<rect x="${x - 10}" y="${y - 10}" width="400" height="720" fill="none" stroke="#e8e0cc" stroke-width="16"/><path d="M${x + 190} ${y} L${x + 190} ${y + 700} M${x} ${y + 350} L${x + 380} ${y + 350}" stroke="#e8e0cc" stroke-width="10"/>`;
        wall += `<path d="M${x - 60} ${y - 40} Q${x - 20} ${y + 400} ${x - 70} ${y + 860} L${x + 30} ${y + 860} Q${x + 50} ${y + 400} ${x + 40} ${y - 40} Z" fill="#5a2a2a" stroke="${INK}" stroke-width="4"/><path d="M${x + 340} ${y - 40} Q${x + 330} ${y + 400} ${x + 350} ${y + 860} L${x + 450} ${y + 860} Q${x + 400} ${y + 400} ${x + 440} ${y - 40} Z" fill="#5a2a2a" stroke="${INK}" stroke-width="4"/>`;
      });
      wall += `<rect x="-300" y="80" width="${W + 600}" height="30" fill="#e8e0cc" opacity="0.5"/>`;
      // a floor lamp (warm), a side table
      const lamp = 0.92 + 0.06 * Math.sin(t * 3.1);
      let mid = `<path d="M1150 1240 L1150 560" stroke="#2a2420" stroke-width="10"/><path d="M1080 560 L1220 560 L1190 470 L1110 470 Z" fill="#e8d8b0" stroke="${INK}" stroke-width="4"/>` + wash(1150, 600, 420, 520, '#ffd990', f1(0.32 * lamp)) + wash(540, 1000, 700, 400, '#ffd990', 0.12);
      let floor = `<rect x="-300" y="1036" width="${W + 600}" height="${H}" fill="#3a2a22"/><ellipse cx="540" cy="1420" rx="760" ry="260" fill="#6a2e2a" opacity="0.75"/><ellipse cx="540" cy="1420" rx="680" ry="220" fill="none" stroke="#c9a356" stroke-width="6" opacity="0.5"/>`;
      // sofa behind the figures (depth 0.97), armchair in front left (depth 1.06)
      const sofa = `<g transform="translate(560 1250)"><rect x="-420" y="-250" width="840" height="170" rx="40" fill="#4a5a52" stroke="${INK}" stroke-width="6"/><rect x="-460" y="-120" width="920" height="150" rx="30" fill="#3e4c46" stroke="${INK}" stroke-width="6"/><rect x="-480" y="-200" width="80" height="230" rx="30" fill="#4a5a52" stroke="${INK}" stroke-width="6"/><rect x="400" y="-200" width="80" height="230" rx="30" fill="#4a5a52" stroke="${INK}" stroke-width="6"/></g>`;
      const layers = [[0.3, wall], [0.6, mid], [0.95, floor], [0.97, sofa]];
      return { light: { dir: 1, rim: '#ffd990', key: '#ffe0b0' }, layers };
    }
  });

  E.registerScenes({
    // 1 - hook: Madoff's office at night; the statement big and centred on the desk from the first frame (the headline burns
    //     over y 380-720 until ~3.2 s, so nothing of ours sits there before that). Madoff stands behind the desk; at
    //     "warned" he turns from the window; at "confessed" he lowers his head.
    md27_hook(ctx) {
      const t = ctx.t, warned = WT(ctx, 0, 3, 1.0), mad = WT(ctx, 0, 6, 1.8), l1 = LS(ctx, 1, 3.3), conf = WT(ctx, 1, 4, 4.1), sons = WT(ctx, 1, 8, 5.1);
      const SP = { x: 500, y: 1010, s: 0.82 };
      return E.cine.shot(ctx, {
        set: 'md27_office', setOpts: { night: true, chairX: 900 }, grade: 'night',
        cam: { from: { x: 0, y: 20, z: 1.0 }, to: { x: 0, y: 40, z: 1.07 }, handheld: 1.0 },
        shake: [{ at: conf, amp: 4 }],
        figures: [
          { id: 'md27_madoff', x: 960, y: 1500, scale: 0.86, dir: -1, turn: 0.45, pose: 'hands_behind', expr: 'blank', gaze: [0.6, -0.1], keys: [{ at: warned - 0.1, pose: 'stand', expr: 'stern', gaze: [-0.6, 0.2], dur: 0.5 }, { at: mad, pose: 'arms_crossed', dur: 0.5 }, { at: conf - 0.1, pose: 'bowed', expr: 'worried', gaze: [-0.3, 0.8], dur: 0.6 }, { at: sons + 0.2, pose: 'hand_to_face', dur: 0.6 }] }
        ],
        props: [{ depth: 1.05, svg: tt => statement(SP.x, SP.y, SP.s, tt, { draw: 1, glow: seg(tt, mad - 0.1, mad + 0.4) * (1 - seg(tt, l1, l1 + 0.6)) }) }],
        overlays: [
          { type: 'label', at: 3.3, x: 60, y: 432, text: 'MANHATTAN · 2008', fs: 36, sub: 'A generic office' }
        ],
        tag: LIKENESS
      });
    },

    // 2 - the stakes: the same office by day, wide; Madoff at his desk signs off a stack of statements; one typed card gives
    //     the $65 billion on the statements and the ~$17.5 billion principal actually lost (the trustee's figure)
    md27_stakes(ctx) {
      const t = ctx.t, stm = WT(ctx, 0, 2, 0.8), amt = WT(ctx, 0, 5, 1.8), bil = WT(ctx, 0, 6, 2.4), l1 = LS(ctx, 1, 3.8), fake = WT(ctx, 1, 4, 4.5);
      return E.cine.shot(ctx, {
        set: 'md27_office', setOpts: { night: false, chairX: 760 }, grade: 'cold',
        cam: { from: { x: 30, y: 60, z: 1.0 }, to: { x: -20, y: 40, z: 1.06 }, handheld: 0.8 },
        figures: [
          { id: 'md27_madoff', x: 760, y: 1500, scale: 0.8, dir: -1, turn: 0.4, pose: 'sit_read', noChair: true, propOverride: 'paper', expr: 'focused', gaze: [-0.4, 0.7], keys: [{ at: stm - 0.2, pose: 'present', expr: 'neutral', gaze: [-0.6, 0.1], dur: 0.5 }, { at: bil, pose: 'sit', expr: 'blank', dur: 0.5 }, { at: fake - 0.1, pose: 'sit_read', expr: 'stern', dur: 0.5 }] }
        ],
        props: [{ depth: 1.05, svg: tt => `<g transform="translate(300 1150)">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<rect x="${-150 + (i % 3) * 4}" y="${-20 - i * 14 - Math.round(16 * seg(tt, stm + i * 0.08, stm + 0.3 + i * 0.08))}" width="300" height="14" fill="${i % 2 ? '#f6f3ea' : '#e8e2d2'}" stroke="${INK}" stroke-width="2"/>`).join('')}<rect x="-150" y="${-200 - Math.round(16 * seg(tt, stm + 0.8, stm + 1.1))}" width="300" height="24" fill="#1f3a5a" stroke="${INK}" stroke-width="2"/></g>` }],
        overlays: [
          { type: 'card', at: stm - 0.2, x: 40, y: 390, w: 900, rows: [{ text: 'ON CLIENT STATEMENTS', fs: 28, colour: MUTE }, { text: 'ABOUT $65 BILLION', fs: 64, colour: RED, at: amt - 0.05 }, { text: 'PRINCIPAL LOST: ABOUT $17.5 BILLION (TRUSTEE)', fs: 27, at: l1 - 0.1 }, { text: 'THE REST: GAINS THAT NEVER EXISTED', fs: 28, colour: RED, at: fake - 0.05 }] }
        ],
        tag: LIKENESS
      });
    },

    // 3 - reveal: the statement close on the desk at night; the balance line draws itself, month after month, almost
    //     perfectly straight; then the returns column is highlighted and the typed verdict lands: no trades behind them
    md27_smooth(ctx) {
      const t = ctx.t, smooth = WT(ctx, 0, 3, 0.8), month = WT(ctx, 0, 4, 1.4), l1 = LS(ctx, 1, 2.7), trades = WT(ctx, 1, 2, 3.0), never = WT(ctx, 1, 6, 3.9);
      const SP = { x: 450, y: 990, s: 0.9 };
      return E.cine.shot(ctx, {
        set: 'md27_office', setOpts: { night: true, chair: false }, grade: 'night',
        cam: { keys: [{ at: 0, x: 0, y: 30, z: 1.04 }, { at: never - 0.5, x: 0, y: 50, z: 1.14, dur: 1.0 }], handheld: 0.8 },
        shake: [{ at: never, amp: 5 }],
        figures: [
          { id: 'md27_madoff', x: 1000, y: 1660, scale: 1.2, dir: -1, turn: 0.3, pose: 'sit', noChair: true, expr: 'neutral', gaze: [-0.5, 0.6], keys: [{ at: smooth - 0.2, pose: 'sit_read', expr: 'focused', dur: 0.5 }, { at: l1, pose: 'sit', expr: 'blank', gaze: [-0.8, 0.0], dur: 0.5 }, { at: never - 0.1, pose: 'hands_together', expr: 'stern', dur: 0.4 }] }
        ],
        props: [{ depth: 1.05, svg: tt => statement(SP.x, SP.y, SP.s, tt, { draw: clamp(0.1 + 0.9 * seg(tt, 0.3, month + 0.6), 0, 1), mark: seg(tt, trades - 0.2, trades + 0.3) }) }],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.1, x: 60, y: 432, text: 'SMOOTH GAINS, MONTH AFTER MONTH', fs: 38, sub: 'Steady, small, almost never a loss' },
          { type: 'stamp', at: never - 0.05, x: 470, y: 990, text: 'NO REAL TRADES', scale: 1.7, rot: -8 },
          { type: 'card', at: trades - 0.1, x: 40, y: 390, w: 940, rows: [{ text: 'INVESTIGATORS: THE TRADES SHOWN', fs: 34, colour: RED }, { text: 'ON THE STATEMENTS WERE NEVER MADE', fs: 34, colour: RED }] }
        ],
        tag: LIKENESS
      });
    },

    // 4 - the whistle-blower: a regulator's office; Markopolos walks in and hands over a thick memo; the official reads,
    //     then sets it aside
    md27_warning(ctx) {
      const t = ctx.t, yr = WT(ctx, 0, 1, 0.6), harry = WT(ctx, 0, 2, 1.5), kept = WT(ctx, 0, 4, 2.6), warn = WT(ctx, 0, 5, 2.8), sec = WT(ctx, 0, 7, 3.2);
      return E.cine.shot(ctx, {
        set: 'md27_regulator', grade: 'cold',
        cam: { from: { x: -30, y: 0, z: 1.0 }, to: { x: 30, y: -10, z: 1.08 }, handheld: 1.1 },
        figures: [
          { id: 'md27_markopolos', x: 380, y: 1620, scale: 0.84, dir: 1, turn: 0.5, pose: 'walk', expr: 'determined', propOverride: 'folder', walk: { from: 40, to: 380, at: 0.05, dur: Math.max(0.6, yr + 0.3), cadence: 6.0 }, keys: [{ at: harry - 0.2, pose: 'present', dur: 0.5 }, { at: kept, pose: 'point', expr: 'worried', dur: 0.4 }, { at: sec, pose: 'stand_tense', expr: 'stern', dur: 0.4 }] },
          { id: 'official', x: 780, y: 1590, scale: 0.82, dir: -1, turn: 0.45, pose: 'sit', noChair: true, expr: 'neutral', keys: [{ at: harry, pose: 'sit_read', expr: 'focused', dur: 0.5 }, { at: warn, pose: 'sit', expr: 'neutral', gaze: [-0.8, 0.1], dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: harry - 0.1, x: 60, y: 432, text: 'A REGULATOR’S OFFICE · 2000', fs: 38, sub: 'Generic; not the real office' },
          { type: 'card', at: harry - 0.1, x: 40, y: 390, w: 960, rows: [{ text: 'HARRY MARKOPOLOS · FINANCIAL ANALYST', fs: 32 }, { text: 'WARNED THE SEC FROM 2000', fs: 40, colour: RED, at: kept - 0.1 }, { text: '2005 MEMO, AS TITLED: “THE WORLD’S', fs: 26, colour: MUTE, at: kept + 0.1 }, { text: 'LARGEST HEDGE FUND IS A FRAUD”', fs: 26, colour: MUTE, at: kept + 0.4 }] }
        ],
        tag: LIKENESS
      });
    },

    // 5 - the inspector general's finding: a generic investigator at a desk reads a thick (blank) report and marks it;
    //     the typed card states the findings, attributed
    md27_watchdog(ctx) {
      const t = ctx.t, secs = WT(ctx, 0, 1, 0.6), wd = WT(ctx, 0, 3, 1.5), said = WT(ctx, 0, 5, 2.4), missed = WT(ctx, 0, 7, 2.7), flags = WT(ctx, 0, 10, 3.2);
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'cold',
        cam: { from: { x: 40, y: -20, z: 1.04 }, to: { x: 90, y: -40, z: 1.12 }, handheld: 0.9 },
        figures: [
          { id: 'examiner', x: 640, y: 1640, scale: 0.98, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', propOverride: 'folder', keys: [{ at: wd - 0.2, pose: 'examine', dur: 0.5 }, { at: missed - 0.1, pose: 'point', expr: 'realise', dur: 0.4 }, { at: flags + 0.3, pose: 'stand', expr: 'determined', dur: 0.5 }] }
        ],
        props: [{ depth: 1.07, svg: tt => `<g transform="translate(260 1210)">${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${-130 + (i % 2) * 5}" y="${-14 - i * 14}" width="260" height="14" fill="${i % 2 ? '#f4f0e4' : '#e6e0cf'}" stroke="${INK}" stroke-width="2"/>`).join('')}<rect x="-130" y="-110" width="260" height="22" fill="#5a1e1a" stroke="${INK}" stroke-width="2"/>${[0, 1, 2].map(i => `<rect x="${60 + i * 22}" y="${-126}" width="14" height="34" fill="#e5372b" opacity="${f1(seg(tt, missed + i * 0.15, missed + 0.2 + i * 0.15))}"/>`).join('')}</g>` }],
        overlays: [
          { type: 'label', at: 0.1, until: wd - 0.1, x: 60, y: 432, text: 'SEC INSPECTOR GENERAL · 2009', fs: 38, sub: 'The agency’s own watchdog' },
          { type: 'card', at: wd - 0.05, x: 40, y: 390, w: 960, rows: [{ text: 'THE 2009 REPORT FOUND THE SEC', fs: 30, colour: MUTE }, { text: 'MISSED NUMEROUS RED FLAGS', fs: 44, colour: RED, at: missed - 0.15 }, { text: 'AND NEVER RAN A THOROUGH INVESTIGATION', fs: 26, at: missed + 0.3 }, { text: 'IT FOUND NO IMPROPER TIES TO MADOFF', fs: 22, colour: MUTE, at: flags + 0.1 }] }
        ],
        tag: TAG
      });
    },

    // 6 - THE HOW: the apartment at night; Madoff in the middle of the room, his two sons as anonymous silhouettes facing
    //     him (no faces); at "one big lie" a typed card, marked as reported wording
    md27_confession(ctx) {
      const t = ctx.t, dec = WT(ctx, 0, 1, 0.6), told = WT(ctx, 0, 4, 2.4), sons = WT(ctx, 0, 6, 2.8), bus = WT(ctx, 0, 8, 3.2), one = WT(ctx, 0, 10, 3.7), lie = WT(ctx, 0, 12, 4.1);
      return E.cine.shot(ctx, {
        set: 'md27_apartment', setOpts: { view: 'living' }, grade: 'night',
        cam: { from: { x: 0, y: 30, z: 1.02 }, to: { x: 20, y: 50, z: 1.12 }, handheld: 1.3 },
        shake: [{ at: lie, amp: 5 }],
        figures: [
          { id: 'md27_son_a', x: 200, y: 1620, scale: 0.9, dir: 1, turn: 0.35, pose: 'stand', silhouette: 'cool', keys: [{ at: told, pose: 'stand_tense', dur: 0.4 }, { at: lie, pose: 'hand_to_face', dur: 0.5 }] },
          { id: 'md27_son_b', x: 400, y: 1660, scale: 0.92, dir: 1, turn: 0.35, pose: 'hands_together', silhouette: 'cool', keys: [{ at: sons, pose: 'stand_tense', dur: 0.4 }, { at: lie + 0.15, pose: 'arms_crossed', dur: 0.5 }] },
          { id: 'md27_madoff', x: 820, y: 1580, scale: 0.9, dir: -1, turn: 0.4, pose: 'stand', expr: 'blank', gaze: [-0.5, 0.2], keys: [{ at: dec, pose: 'hands_together', expr: 'worried', dur: 0.5 }, { at: bus, pose: 'stand', expr: 'sad', gaze: [-0.6, 0.1], dur: 0.5 }, { at: one - 0.1, pose: 'bowed', expr: 'sad', gaze: [-0.2, 0.9], dur: 0.6 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: bus - 0.1, x: 60, y: 432, text: 'HIS APARTMENT · DECEMBER 2008', fs: 36, sub: 'Generic room · his sons as silhouettes' },
          { type: 'card', at: one - 0.1, x: 80, y: 390, w: 800, rows: [{ text: '“ONE BIG LIE”', fs: 66, colour: RED }, { text: 'WORDING AS REPORTED · 10 DEC 2008', fs: 26, colour: MUTE, at: one }] }
        ],
        tag: LIKENESS
      });
    },

    // 7 - the sons report him (typed card; they are not shown again); the next morning FBI agents arrive at the door and
    //     Madoff meets them
    md27_arrest(ctx) {
      const t = ctx.t, law = WT(ctx, 0, 2, 0.6), rep = WT(ctx, 0, 5, 1.5), l1 = LS(ctx, 1, 2.7), fbi = WT(ctx, 1, 1, 2.8), arr = WT(ctx, 1, 2, 3.6), morn = WT(ctx, 1, 6, 4.4);
      return E.cine.shot(ctx, {
        set: 'md27_apartment', setOpts: { view: 'hall', open: seg(t, fbi - 0.6, fbi + 0.1) }, grade: 'dawn',
        cam: { from: { x: 20, y: 0, z: 1.0 }, to: { x: -30, y: 10, z: 1.1 }, handheld: 1.4 },
        shake: [{ at: arr, amp: 5 }],
        figures: [
          { id: 'md27_madoff', x: 780, y: 1580, scale: 0.92, dir: -1, turn: 0.45, pose: 'walk', expr: 'blank', walk: { from: 1060, to: 780, at: 0.1, dur: Math.max(0.8, rep - 0.2), cadence: 5.6 }, keys: [{ at: rep, pose: 'stand', dur: 0.4 }, { at: fbi, pose: 'stand_tense', expr: 'worried', gaze: [-0.8, 0.0], dur: 0.4 }, { at: arr, pose: 'hands_together', expr: 'blank', dur: 0.5 }, { at: morn, pose: 'bowed', dur: 0.6 }] },
          { id: 'agent_a', x: 470, y: 1600, scale: 0.94, dir: 1, turn: 0.5, pose: 'walk', expr: 'determined', show: [fbi - 0.3], walk: { from: 300, to: 470, at: fbi - 0.2, dur: 0.9, cadence: 6.0 }, keys: [{ at: arr, pose: 'stand_tense', dur: 0.4 }, { at: morn, pose: 'stand', dur: 0.4 }] },
          { id: 'agent_b', x: 300, y: 1560, scale: 0.88, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', show: [fbi], walk: { from: 160, to: 300, at: fbi + 0.1, dur: 0.9, cadence: 6.0 }, keys: [{ at: arr + 0.4, pose: 'stand_tense', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'card', at: 0.1, until: l1 - 0.1, x: 40, y: 390, w: 900, rows: [{ text: 'HIS SONS REPORTED HIM', fs: 44, colour: RED, at: rep - 0.3 }, { text: 'THROUGH THEIR LAWYERS, WITHIN HOURS', fs: 28, colour: MUTE, at: law - 0.1 }] },
          { type: 'card', at: fbi - 0.1, x: 40, y: 390, w: 900, rows: [{ text: 'FBI ARREST · THE NEXT MORNING', fs: 40, colour: RED }, { text: 'AT HIS MANHATTAN HOME · DEC 2008', fs: 28, colour: MUTE, at: arr }] }
        ],
        tag: LIKENESS
      });
    },

    // 8 - the outcome: a modern federal courtroom; the plea (11 felonies, March 2009) and the sentence (150 years, June
    //     2009); his death in prison and the trustee's recoveries are typed rows, not narration
    md27_outcome(ctx) {
      const t = ctx.t, pled = WT(ctx, 0, 1, 0.7), gui = WT(ctx, 0, 2, 1.0), n150 = WT(ctx, 0, 5, 2.1), yrs = WT(ctx, 0, 6, 2.8);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.1 }, handheld: 0.6 },
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, depth: 0.33, keys: [{ at: pled - 0.35, pose: 'gavel', dur: 0.3 }, { at: pled + 0.1, pose: 'sit', dur: 0.2 }, { at: n150 - 0.4, pose: 'gavel', dur: 0.3 }, { at: n150, pose: 'sit', dur: 0.3 }] },
          { id: 'md27_madoff', x: 900, y: 1760, scale: 0.95, dir: -1, turn: 0.2, pose: 'stand', outfit: 'court', expr: 'blank', keys: [{ at: gui, pose: 'hands_together', expr: 'sad', dur: 0.4 }, { at: n150, pose: 'stand_tense', expr: 'worried', dur: 0.4 }, { at: yrs, pose: 'bowed', dur: 0.6 }] },
          { id: 'agent_b', x: 170, y: 1560, scale: 0.8, dir: 1, turn: 0.4, pose: 'stand', expr: 'focused', keys: [{ at: gui, pose: 'stand_tense', dur: 0.5 }, { at: yrs, pose: 'stand', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'card', at: pled - 0.1, x: 30, y: 880, w: 710, rows: [{ text: 'GUILTY PLEA · 11 FELONIES', fs: 30, colour: RED }, { text: '150 YEARS · JUNE 2009', fs: 40, at: n150 - 0.05 }, { text: 'DIED IN PRISON · APRIL 2021', fs: 28, at: n150 + 0.4 }, { text: 'TRUSTEE: OVER $14 BILLION RECOVERED', fs: 22, colour: MUTE, at: yrs }] }
        ],
        tag: LIKENESS
      });
    },

    // 9 - callback on the hero object: the office at night as in the first frame, the statement alone on the desk, the chair
    //     empty; at "Nothing" the returns fade to dashes and the line goes grey. The engine burns the end question over the
    //     last 3.2 s at y 520, so no label or card of ours sits in y 380-720; the last frame loops to the first.
    md27_end(ctx) {
      const st = WT(ctx, 0, 0, 0.3), paper = WT(ctx, 0, 3, 1.3), noth = WT(ctx, 0, 4, 1.8);
      const SP = { x: 500, y: 1010, s: 0.82 };
      return E.cine.shot(ctx, {
        set: 'md27_office', setOpts: { night: true, chairX: 900 }, grade: 'night',
        cam: { from: { x: 0, y: 40, z: 1.07 }, to: { x: 0, y: 20, z: 1.0 }, handheld: 0.6 },
        figures: [],
        props: [{ depth: 1.05, svg: tt => statement(SP.x, SP.y, SP.s, tt, { draw: 1, glow: 0.8 * seg(tt, st - 0.2, st + 0.3) * (1 - seg(tt, noth - 0.2, noth + 0.3)), hollow: seg(tt, noth - 0.1, noth + 0.6) * (1 - seg(tt, noth + 1.6, noth + 2.2)) }) }],
        overlays: [],   // nothing of ours: the engine burns the end question over the last 3.2 s
        tag: TAG
      });
    }
  });
})();
