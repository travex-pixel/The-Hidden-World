/* Case File 50 (premium look, engagement + shares + smoothness + hooks + 48+ rules): Eddie Tipton, the information security
   director of the Multi-State Lottery Association (Iowa), rigged the random number generator code so that it produced
   predictable numbers on three days a year; his brother and a friend claimed prizes in five states (2005-2011). A Hot Lotto
   ticket bought in Des Moines in December 2010 hit the jackpot but nobody came forward; lawyers tried to claim it for a trust
   tied to Belize; the lottery refused; the store camera had filmed the buyer, and co-workers recognised his VOICE.
   Structure: frame 1 = the HERO OBJECT (a generic printed lottery ticket, the accent) sliding across a gas-station counter
   from the clerk's hand towards the buyer's silhouetted hand, the camera already pushing in; the claim counter (brother and
   friend as silhouettes; the five states); the gas-station forecourt at night (the jackpot board; nobody claims it); the
   law office (the Belize claim; REFUSED); the video room (the store footage on a monitor; a co-worker hears the voice: the
   single impact and shake, the fun fact); the forecourt again (a young player; the odds counter); the LESSON at a kitchen
   table (a "you won" text on a phone; captions off); the outcome on the hero ticket in the first frame's framing with the
   burned-in end question.
   Smoothness: cuts and dissolves, one push (into the reveal), one zoom (the end); one slow camera move per shot; settle
   only on the three hero dolly-ins (hook, reveal, end); one shake and one impact in the whole video. No map.
   Look: episode.look = 'premium', one palette (shadow #10222c, mid #c6bba6, accent #e2a13b). The ONLY strongly coloured
   object is the ticket (prop marked accent: true).
   Content rules: Eddie Tipton, his brother and his friend appear ONLY as faceless rim-lit silhouettes (NOT A LIKENESS).
   Everyone else is a generic figure. No logo, ticket design or artwork of any real lottery, game, store or company: the
   ticket is our own generic slip with blank number circles, the store and pumps carry no brand.
   New environments (E.registerSets): lc50_store (a gas-station shop at night: coolers, shelves, a window onto the pumps,
   the counter with a generic lottery terminal), lc50_forecourt (the pumps under a lit canopy at night, the shop behind, a
   blank jackpot board), lc50_claims (a lottery prize-claim lobby: counter, glass screen, blank plaques), lc50_video (a dim
   video room: a wall of monitors, one big screen with grainy store footage and a voice waveform). Plus the engine's
   office_day and kitchen_night. */
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
  const CAP = { style: 'cap', color: '#2a2e32', band: '#1a1c1e' };

  // ---------- THE HERO: a generic printed lottery ticket (our own design: no game name, logo or artwork); centre (x, y),
  // ~560 x 300 at s = 1. o.lit 0..1 lights the six number circles one by one; o.glow = a warm wash under it; o.rot degrees.
  function ticket(x, y, s, t, o = {}) {
    const gl = o.glow ?? 0.7, rot = o.rot ?? -4, lit = clamp(o.lit || 0, 0, 1);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    g += `<ellipse cx="12" cy="26" rx="320" ry="180" fill="#000" opacity="0.35" filter="url(#cineSoft)"/>`;
    if (gl > 0) g += wash(0, 0, 380, 230, ACC, f1(0.2 * gl));
    // the slip: off-white paper with a scalloped (perforated) top edge
    let edge = 'M-280 -150'; for (let i = 0; i < 14; i++) edge += ` q20 -14 40 0`;
    g += `<path d="${edge} L280 150 L-280 150 Z" fill="#f2ead8" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    // the accent band with a generic word (no real game's name or artwork)
    g += `<rect x="-262" y="-128" width="524" height="70" rx="8" fill="${ACC}" stroke="${INK}" stroke-width="4"/>` +
      `<text x="0" y="-80" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="46" letter-spacing="10" fill="#1d1712">LOTTO</text>`;
    // six number circles (blank: the real numbers are not shown) that light up one by one
    for (let i = 0; i < 6; i++) {
      const cx = -205 + i * 82, on = clamp(lit * 6 - i, 0, 1);
      g += `<circle cx="${cx}" cy="-4" r="32" fill="${on > 0 ? ACC : '#e6dcc6'}" fill-opacity="${f1(0.25 + 0.75 * on)}" stroke="${INK}" stroke-width="4"/>`;
      if (on > 0) g += wash(cx, -4, 60, 60, '#fff2cc', f1(0.35 * on));
      g += `<path d="M${cx - 12} -4 L${cx + 12} -4" stroke="#1d1712" stroke-width="5" stroke-linecap="round" opacity="0.7"/>`;
    }
    // printed lines and a barcode
    g += `<text x="-250" y="64" font-family="Nunito" font-weight="800" font-size="26" letter-spacing="3" fill="#3a3228">DRAW · DEC 29 2010</text>`;
    g += [0, 1].map(i => `<rect x="-250" y="${84 + i * 18}" width="${300 - i * 120}" height="8" fill="#b5a88e"/>`).join('');
    let bc = ''; const r = R(5011); for (let i = 0; i < 26; i++) { const w = 2 + Math.floor(r() * 3); bc += `<rect x="${110 + i * 6}" y="52" width="${w}" height="70" fill="#1d1712"/>`; }
    return g + bc + '</g>';
  }

  // a generic fuel pump (no brand); bottom centre (x, y), k = scale
  const pump = (x, y, k) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><rect x="-70" y="-300" width="140" height="300" rx="10" fill="#c9c2b2" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="-50" y="-270" width="100" height="70" rx="6" fill="#1e2a2e" stroke="${INK}" stroke-width="3"/><rect x="-40" y="-260" width="80" height="20" fill="#7ab0a0" opacity="0.6"/>` +
    `<rect x="-50" y="-180" width="100" height="90" rx="6" fill="#8a8476"/><path d="M70 -200 Q110 -190 100 -120 L96 -60" stroke="#1a1a1a" stroke-width="8" fill="none"/><rect x="88" y="-70" width="20" height="40" rx="4" fill="#2a2a2a"/>` +
    `<rect x="-90" y="0" width="180" height="22" fill="#8a8476" stroke="${INK}" stroke-width="3"/></g>`;

  // a phone in the hand (generic): a "YOU WON" text bubble; centre-top (x, y), k = scale
  function phone(x, y, k, t, o = {}) {
    const PW = 300, PH = 600, msg = clamp(o.msg || 0, 0, 1);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot ?? -6)}) scale(${sc(k)})">`;
    g += wash(0, PH / 2, 300, 380, '#9fc0d8', 0.2);
    g += `<rect x="${-PW / 2 + 10}" y="16" width="${PW}" height="${PH}" rx="44" fill="#000" opacity="0.5"/><rect x="${-PW / 2}" y="0" width="${PW}" height="${PH}" rx="44" fill="#1a1c22" stroke="#4a4e58" stroke-width="5"/>`;
    g += `<rect x="${-PW / 2 + 14}" y="14" width="${PW - 28}" height="${PH - 28}" rx="34" fill="#0e1218"/>`;
    // the message bubble (our own text; no real sender, number or link)
    const by = 120 + 30 * (1 - ease.out(msg));
    g += `<g opacity="${f1(msg)}"><rect x="-122" y="${f1(by)}" width="230" height="190" rx="22" fill="#e8e4da"/>` +
      `<text x="-104" y="${f1(by + 44)}" font-family="Nunito" font-weight="800" font-size="28" fill="#1a1a1a">YOU WON</text>` +
      `<text x="-104" y="${f1(by + 80)}" font-family="Nunito" font-weight="800" font-size="28" fill="#1a1a1a">$1,000,000!</text>` +
      `<text x="-104" y="${f1(by + 118)}" font-family="Nunito" font-weight="700" font-size="22" fill="#4a4a4a">Pay a $99 fee</text>` +
      `<text x="-104" y="${f1(by + 148)}" font-family="Nunito" font-weight="700" font-size="22" fill="#4a4a4a">to claim it now</text></g>`;
    return g + '</g>';
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a gas-station shop at night (generic): a dark window onto the lit pumps at left, glowing coolers and shelves of
    // unlabelled goods, strip lights, and the counter in front (top at o.cy) with a generic lottery terminal (no brand)
    lc50_store(ctx, o = {}) {
      const t = ctx.t, r = R(5001), cy = o.cy ?? 1100;
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#3a4246"/><rect x="-300" y="-300" width="${W + 600}" height="520" fill="#2e363a"/>`;
      // the window (left): night forecourt, a canopy light and a pump
      back += `<rect x="-260" y="260" width="520" height="560" fill="#0e1a24" stroke="#20282c" stroke-width="14"/>` +
        `<rect x="-250" y="300" width="500" height="40" fill="#d8d2c0" opacity="0.8"/>` + wash(0, 330, 260, 80, '#fff2d0', 0.4) +
        `<g opacity="0.75">${pump(-60, 760, 0.62)}${pump(170, 760, 0.62)}</g><rect x="-250" y="760" width="500" height="60" fill="#1a2228"/>` +
        `<path d="M0 260 L0 820" stroke="#20282c" stroke-width="10"/>` + wash(0, 560, 260, 300, '#9fc0d8', 0.08);
      // coolers (right): glass doors glowing
      let coolers = '';
      for (let i = 0; i < 4; i++) { const x = 330 + i * 200; coolers += `<rect x="${x}" y="240" width="190" height="600" fill="#d8eef0" opacity="0.22" stroke="#20282c" stroke-width="10"/>`;
        for (let rr = 0; rr < 4; rr++) for (let j = 0; j < 5; j++) coolers += `<rect x="${f1(x + 16 + j * 34)}" y="${300 + rr * 140}" width="26" height="${60 + (j % 2) * 16}" rx="5" fill="${['#7a8a6a', '#8a6a5a', '#5a6a7a', '#9a8a6a'][(i + rr + j) % 4]}" opacity="0.85"/>`;
        coolers += wash(x + 95, 540, 120, 300, '#e8f6f8', 0.18); }
      // strip lights
      let lights = ''; [140, 560, 980].forEach((lx, i) => { const fl = 0.9 + 0.1 * Math.sin(t * (i === 2 ? 7 : 1.3) + i); lights += `<rect x="${lx - 120}" y="150" width="240" height="18" rx="6" fill="#f6f6ea" opacity="${f1(0.9 * fl)}"/>` + wash(lx, 220, 320, 160, '#f2f6ea', f1(0.12 * fl)); });
      // low shelves in the middle distance
      let shelves = '';
      for (let i = 0; i < 9; i++) { const x = -260 + i * 170; shelves += `<rect x="${x}" y="820" width="150" height="140" fill="#4a4e50" stroke="#20282c" stroke-width="4"/>`;
        for (let j = 0; j < 4; j++) shelves += `<rect x="${f1(x + 8 + j * 36)}" y="${f1(836 + r() * 20)}" width="30" height="${f1(40 + r() * 30)}" rx="3" fill="${['#8a7a5e', '#6a7a6e', '#7a5e56', '#5e6a7a'][Math.floor(r() * 4)]}"/>`; }
      // the counter: a pale top, a dark front; a generic lottery terminal with a small screen, a receipt printer
      let front = `<path d="M-300 ${cy - 60} L${W + 300} ${cy - 60} L${W + 300} ${cy} L-300 ${cy} Z" fill="#c9c0ae" stroke="${INK}" stroke-width="5"/><path d="M-300 ${cy - 56} L${W + 300} ${cy - 56}" stroke="#ece6d8" stroke-width="4"/>`;
      front += `<rect x="-300" y="${cy}" width="${W + 600}" height="${H}" fill="#2a2e30" stroke="${INK}" stroke-width="5"/>`;
      for (let i = 0; i < 7; i++) front += `<rect x="${-260 + i * 230}" y="${cy + 40}" width="190" height="300" fill="#32383a" stroke="#1e2224" stroke-width="4"/>`;
      if (o.terminal !== false) front += `<g transform="translate(${o.tx ?? 930} ${cy - 60})"><rect x="-90" y="-170" width="180" height="170" rx="12" fill="#3a3e40" stroke="${INK}" stroke-width="5"/><rect x="-70" y="-150" width="140" height="80" rx="6" fill="#1a2a2e"/><rect x="-60" y="-140" width="${f1(60 + 40 * (0.5 + 0.5 * Math.sin(t * 2)))}" height="10" fill="#7ab0a0" opacity="0.7"/><rect x="-60" y="-50" width="120" height="16" rx="4" fill="#1e1e1e"/></g>`;
      front += wash(540, cy - 30, 520, 90, '#f6f2e0', 0.12);
      let floor = `<rect x="-300" y="960" width="${W + 600}" height="${H}" fill="#5a5a54"/>`;
      for (let i = 0; i < 8; i++) floor += `<path d="M-300 ${1000 + i * i * 22} L${W + 300} ${1000 + i * i * 22}" stroke="#4a4a44" stroke-width="3" opacity="0.6"/>`;
      return { light: { dir: 1, rim: '#e8f2f0', key: '#f6f2e0' }, layers: [[0.1, back], [0.22, coolers], [0.3, lights], [0.55, shelves], [0.75, floor], [0.96, front]] };
    },

    // the gas-station forecourt at night (generic): a lit canopy over two pumps, the glowing shop behind, a tall blank
    // board on a pole at the right; o.board 0..1 types the jackpot figure onto it; o.text = the board text
    lc50_forecourt(ctx, o = {}) {
      const t = ctx.t, r = R(5002), bd = clamp(o.board || 0, 0, 1), HZ = 1000;
      let sky = `<defs><linearGradient id="lcfsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1420"/><stop offset="1" stop-color="#22303a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#lcfsk)"/>`;
      for (let i = 0; i < 30; i++) sky += `<circle cx="${f1(-200 + r() * 1500)}" cy="${f1(-100 + r() * 500)}" r="${f1(1 + r() * 2)}" fill="#fff" opacity="${f1(0.2 + 0.3 * r())}"/>`;
      // the shop behind: a low lit box with big windows (no sign text)
      let shop = `<rect x="-200" y="${HZ - 360}" width="1480" height="380" fill="#4a4e50" stroke="${INK}" stroke-width="5"/><rect x="-200" y="${HZ - 390}" width="1480" height="40" fill="#2e3234"/>`;
      for (let i = 0; i < 5; i++) shop += `<rect x="${-150 + i * 280}" y="${HZ - 300}" width="230" height="250" fill="#f0ead2" opacity="0.55" stroke="${INK}" stroke-width="4"/>`;
      shop += wash(540, HZ - 180, 700, 200, '#fff2d0', 0.22) + `<rect x="420" y="${HZ - 300}" width="200" height="320" fill="#f6f0da" opacity="0.7" stroke="${INK}" stroke-width="5"/>`;
      // the board (right): a pole and a dark panel; our own lettering
      let board = `<rect x="889" y="460" width="22" height="${HZ - 460}" fill="#2a2e30"/><rect x="750" y="230" width="300" height="240" rx="10" fill="#141a1e" stroke="#3a4044" stroke-width="8"/>`;
      if (bd > 0) { const txt = o.text || ''; const n = Math.ceil(txt.length * bd);
        board += `<text x="900" y="300" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" letter-spacing="4" fill="#d8d2c0" opacity="${f1(Math.min(1, bd * 3))}">JACKPOT</text>` +
          `<text x="900" y="400" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="66" fill="${ACC}">${txt.slice(0, n)}</text>` + wash(900, 360, 220, 140, ACC, f1(0.18 * bd)); }
      // the canopy with its lights, two pumps on an island
      let canopy = `<rect x="-300" y="300" width="1000" height="90" fill="#d8d2c4" stroke="${INK}" stroke-width="6"/><rect x="-300" y="390" width="1000" height="18" fill="#9a9488"/>`;
      for (let i = 0; i < 4; i++) canopy += `<rect x="${-200 + i * 240}" y="404" width="120" height="14" rx="6" fill="#fffbe8"/>` + wash(-140 + i * 240, 600, 180, 260, '#fff6dc', 0.1);
      canopy += `<rect x="60" y="408" width="26" height="${HZ + 120 - 408}" fill="#b8b2a4" stroke="${INK}" stroke-width="3"/><rect x="640" y="408" width="26" height="${HZ + 120 - 408}" fill="#b8b2a4" stroke="${INK}" stroke-width="3"/>`;
      let ground = `<rect x="-300" y="${HZ}" width="${W + 600}" height="${H}" fill="#3a3c3e"/>` + wash(400, HZ + 260, 700, 300, '#fff6dc', 0.14);
      ground += `<rect x="40" y="${HZ + 100}" width="760" height="40" rx="8" fill="#8a867a" stroke="${INK}" stroke-width="4"/>` + pump(250, HZ + 104, 0.8) + pump(600, HZ + 104, 0.8);
      for (let i = 0; i < 5; i++) ground += `<path d="M${-200 + i * 320} ${HZ + 300} L${-260 + i * 380} ${H + 100}" stroke="#d8d0a8" stroke-width="6" opacity="0.25"/>`;
      return { light: { dir: -1, rim: '#fff2d6', key: '#fff6dc' }, layers: [[0.05, sky], [0.3, shop], [0.4, board], [0.7, canopy], [0.85, ground]] };
    },

    // a lottery prize-claim lobby (generic): pale walls, blank framed plaques, a long counter with a glass screen; no
    // logo, game name or real lottery's branding
    lc50_claims(ctx, o = {}) {
      const t = ctx.t, cy = o.cy ?? 1180;
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#b8b4a6"/><rect x="-300" y="-300" width="${W + 600}" height="560" fill="#c6c2b4"/><rect x="-300" y="260" width="${W + 600}" height="14" fill="#9a9688"/>`;
      // blank framed plaques (oversized-cheque shapes with no text)
      [[-120, 380], [300, 340], [720, 380]].forEach(([x, y], i) => { back += `<rect x="${x}" y="${y}" width="360" height="180" rx="8" fill="#ece6d4" stroke="#5a5448" stroke-width="10"/><rect x="${x + 30}" y="${y + 40}" width="${180 - i * 20}" height="16" fill="#c2b89e"/><rect x="${x + 30}" y="${y + 80}" width="290" height="10" fill="#d4ccb4"/><rect x="${x + 220}" y="${y + 120}" width="110" height="34" rx="4" fill="${ACC}" opacity="0.35"/>`; });
      back += wash(540, 460, 700, 260, '#fff6e0', 0.18);
      // the back wall's lower panel and a door
      let mid = `<rect x="-300" y="620" width="${W + 600}" height="500" fill="#8e8a7c"/><rect x="880" y="640" width="220" height="480" fill="#5a564c" stroke="${INK}" stroke-width="5"/><circle cx="1080" cy="900" r="8" fill="#c8c0a8"/>`;
      let floor = `<rect x="-300" y="1120" width="${W + 600}" height="${H}" fill="#6a665c"/>`;
      // the counter with a glass screen and a pass-through slot
      let front = `<path d="M-300 ${cy - 60} L${W + 300} ${cy - 60} L${W + 300} ${cy} L-300 ${cy} Z" fill="#d6d0c0" stroke="${INK}" stroke-width="5"/><rect x="-300" y="${cy}" width="${W + 600}" height="${H}" fill="#6e6a5e" stroke="${INK}" stroke-width="5"/>`;
      for (let i = 0; i < 7; i++) front += `<rect x="${-260 + i * 230}" y="${cy + 40}" width="190" height="300" fill="#7a766a" stroke="#4e4a40" stroke-width="4"/>`;
      front += `<rect x="-300" y="${cy - 400}" width="${W + 600}" height="340" fill="#dfe8ea" opacity="0.07"/><path d="M-300 ${cy - 400} L${W + 300} ${cy - 400}" stroke="#9a9688" stroke-width="5" opacity="0.6"/><rect x="420" y="${cy - 110}" width="240" height="50" fill="#1e1e1c" opacity="0.4"/>`;
      return { light: { dir: 1, rim: '#fff2d6', key: '#fff6e6' }, layers: [[0.1, back], [0.4, mid], [0.75, floor], [0.96, front]] };
    },

    // a dim video room (generic): a wall of small monitors and one big screen showing grainy, monochrome store footage
    // (a counter, a silhouette in a cap); o.wave 0..1 shows an audio waveform under it (the voice); a desk in front
    lc50_video(ctx, o = {}) {
      const t = ctx.t, r = R(5004), wv = clamp(o.wave || 0, 0, 1);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#141a1e"/>`;
      // small monitors
      for (let rr = 0; rr < 3; rr++) for (let i = 0; i < 7; i++) { const x = -260 + i * 220, y = 180 + rr * 200; if (rr < 3 && i > 1 && i < 6 && rr > 0) continue;
        back += `<rect x="${x}" y="${y}" width="190" height="150" rx="6" fill="#1e2a2e" stroke="#2e3a3e" stroke-width="6"/><rect x="${x + 10}" y="${y + 10}" width="170" height="130" fill="#3a4a4a" opacity="${f1(0.4 + 0.2 * Math.sin(t * 3 + i + rr))}"/>`; }
      // the big screen: grainy store footage (counter, shelves, a silhouette with a cap at the counter)
      const bx = 200, by = 360, bw = 680, bh = 460;
      let big = `<rect x="${bx - 16}" y="${by - 16}" width="${bw + 32}" height="${bh + 32}" rx="10" fill="#0a0e10" stroke="#3a4448" stroke-width="6"/>`;
      big += `<defs><clipPath id="lcvid"><rect x="${bx}" y="${by}" width="${bw}" height="${bh}"/></clipPath></defs><g clip-path="url(#lcvid)"><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#6e7a76"/>`;
      big += `<rect x="${bx}" y="${by}" width="${bw}" height="160" fill="#8a9690"/>` + [0, 1, 2, 3].map(i => `<rect x="${bx + 30 + i * 160}" y="${by + 40}" width="130" height="110" fill="#5e6a66"/>`).join('');
      big += `<rect x="${bx}" y="${by + 330}" width="${bw}" height="130" fill="#4a5450"/>`;
      // the silhouette in the footage (generic; faceless)
      const sx = bx + 260 + 6 * Math.sin(t * 0.8);
      big += `<g fill="#1a2020"><ellipse cx="${f1(sx)}" cy="${by + 180}" rx="40" ry="46"/><path d="M${f1(sx - 52)} ${by + 160} Q${f1(sx)} ${by + 118} ${f1(sx + 58)} ${by + 156} L${f1(sx + 92)} ${by + 164} L${f1(sx + 40)} ${by + 172} Z"/><path d="M${f1(sx - 90)} ${by + 340} Q${f1(sx - 90)} ${by + 230} ${f1(sx)} ${by + 224} Q${f1(sx + 90)} ${by + 230} ${f1(sx + 90)} ${by + 340} Z"/></g>`;
      // scanlines and grain
      for (let yy = by; yy < by + bh; yy += 8) big += `<rect x="${bx}" y="${yy}" width="${bw}" height="2" fill="#000" opacity="0.12"/>`;
      for (let i = 0; i < 40; i++) big += `<rect x="${f1(bx + r() * bw)}" y="${f1(by + ((r() * bh + t * 400 * (i % 3 + 1)) % bh))}" width="${f1(2 + r() * 6)}" height="2" fill="#fff" opacity="${f1(0.15 + 0.2 * r())}"/>`;
      big += `<text x="${bx + 20}" y="${by + 40}" font-family="Nunito" font-weight="800" font-size="24" fill="#f2f2e8" opacity="0.8">CAM 2 · 12/23/2010</text></g>`;
      // the voice waveform under the footage
      if (wv > 0) { let bars = ''; for (let i = 0; i < 40; i++) { const hh = 8 + 60 * Math.abs(Math.sin(i * 0.7 + t * 9) * Math.sin(i * 0.23 + t * 3)) * wv; bars += `<rect x="${bx + 20 + i * 16}" y="${f1(by + bh + 70 - hh / 2)}" width="9" height="${f1(hh)}" rx="4" fill="${ACC}" opacity="${f1(0.85 * wv)}"/>`; }
        big += `<rect x="${bx}" y="${by + bh + 24}" width="${bw}" height="92" rx="10" fill="#0a0e10" opacity="${f1(0.9 * wv)}"/>` + bars; }
      big += wash(bx + bw / 2, by + bh / 2, 520, 380, '#cfe0dc', 0.12);
      let desk = `<rect x="-300" y="1200" width="${W + 600}" height="60" fill="#2a2e30" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1260" width="${W + 600}" height="${H}" fill="#1a1e20"/>`;
      desk += `<rect x="120" y="1150" width="260" height="50" rx="6" fill="#22282a" stroke="${INK}" stroke-width="3"/><rect x="760" y="1170" width="120" height="30" rx="6" fill="#22282a"/>`;
      return { light: { dir: 1, rim: '#cfe0dc', key: '#dfe8e4' }, layers: [[0.1, back], [0.45, big], [1.06, desk]] };
    }
  });

  // the hero framing in the first and last shots (the loop): the ticket big and centred on the counter top
  const HERO = { x: 540, y: 1000, s: 1.0 };

  E.registerScenes({
    // 1 - hook (frame 1): the ticket slides across the counter from the clerk (right) towards the buyer's silhouetted hand
    //     (left), the camera already pushing in; on 'secret code' its six number circles light one by one. The headline is
    //     burned in at the top until ~3 s, so our overlays stay out of y 280-720 until then.
    lc50_hook(ctx) {
      const t = ctx.t, T = ctx.T, rg = WT(ctx, 0, 5, 1.6), sec = WT(ctx, 1, 1, 2.8), cd = WT(ctx, 1, 2, 3.2), pr = WT(ctx, 1, 8, 4.4);
      const tx = tt => lerp(640, 520, ease.out(seg(tt, 0, 1.8)));
      return E.cine.shot(ctx, {
        set: 'lc50_store', setOpts: { cy: 1100, tx: 960 }, grade: 'cold', dof: true, haze: 0.45,
        cam: { from: { x: 0, y: 20, z: 1.03 }, to: { x: 0, y: 40, z: 1.12 }, settle: true },
        figures: [
          { id: 'lc50_clerk', x: 860, y: 1560, scale: 0.86, dir: -1, turn: 0.5, pose: 'present', expr: 'neutral', depth: 0.9, gaze: [-0.6, 0.6],
            keys: [{ at: 1.6, pose: 'stand', dur: 0.6 }, { at: pr, pose: 'hands_together', expr: 'focused', dur: 0.6 }] },
          { id: 'lc50_tipton', x: 110, y: 1900, scale: 1.12, dir: 1, turn: 0.35, pose: 'present', silhouette: 'cool', hat: CAP, depth: 1.0,
            keys: [{ at: rg, pose: 'stand', dur: 0.6 }, { at: cd, pose: 'hands_together', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.01, accent: true, svg: tt => ticket(tx(tt), HERO.y, HERO.s * 0.9, tt, { glow: 0.7 + 0.3 * Math.sin(tt * 3), rot: -4, lit: seg(tt, sec, pr + 0.3) }) }
        ],
        overlays: [
          { type: 'label', at: cd, x: 60, y: 450, text: 'PROSECUTORS SAID: A USB STICK', fs: 38, sub: 'Draw camera set to 1 sec a minute' }
        ],
        tag: LIKE
      });
    },

    // 2 - the crew: a prize-claim counter; a generic official hands a prize envelope across to the brother's silhouette;
    //     the friend's silhouette walks in behind (left to right); the five states card, then the 'Texas judge' label
    lc50_crew(ctx) {
      const t = ctx.t, T = ctx.T, br = WT(ctx, 0, 1, 0.5), fr = WT(ctx, 0, 4, 1.0), fv = WT(ctx, 0, 8, 2.0), l2 = LS(ctx, 1, 3.5), jd = WT(ctx, 1, 5, 4.6);
      return E.cine.shot(ctx, {
        set: 'lc50_claims', setOpts: { cy: 1180 }, grade: 'warm', haze: 0.5,
        cam: { from: { x: -30, y: 20, z: 1.0 }, to: { x: 20, y: 30, z: 1.07 } },
        figures: [
          { id: 'lc50_official', x: 800, y: 1560, scale: 0.86, dir: -1, turn: 0.45, pose: 'stand', expr: 'neutral', depth: 0.9,
            keys: [{ at: br, pose: 'present', expr: 'relieved', gaze: [-0.8, 0.2], dur: 0.5 }, { at: fv + 0.4, pose: 'hands_together', dur: 0.5 }] },
          { id: 'lc50_friend', x: 40, y: 1700, scale: 0.9, dir: 1, turn: 0.4, pose: 'walk', silhouette: 'cool', depth: 0.96, walk: { at: 0.1, dur: Math.max(1.0, fr + 0.6), cadence: 4.0, stride: 14, from: -40, to: 110 },
            keys: [{ at: fr + 0.7, pose: 'stand', dur: 0.4 }, { at: jd - 0.2, pose: 'arms_crossed', dur: 0.5 }] },
          { id: 'lc50_brother', x: 430, y: 1880, scale: 1.08, dir: 1, turn: 0.35, pose: 'stand', silhouette: 'cool', depth: 1.0,
            keys: [{ at: br + 0.2, pose: 'present', dur: 0.5 }, { at: fv, pose: 'hands_together', dur: 0.5 }, { at: l2 + 0.3, pose: 'stand', headTurn: -0.3, dur: 0.6 }] }
        ],
        props: [
          // the prize envelope passes from the official's hand to the brother's
          { depth: 0.99, svg: tt => { const k = ease.inOut(seg(tt, br, br + 1.2)); const x = lerp(700, 470, k), y = 1110 - 30 * Math.sin(Math.PI * k);
            return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(-6)"><rect x="-90" y="-50" width="180" height="100" rx="6" fill="#efe6d2" stroke="${INK}" stroke-width="4"/><path d="M-90 -50 L0 6 L90 -50" fill="none" stroke="#b9ab8e" stroke-width="4"/></g>`; } }
        ],
        overlays: [
          { type: 'label', at: fv - 0.1, x: 60, y: 450, text: 'CO · WI · OK · KS · IA', fs: 44, sub: 'Five states, 2005 to 2011', until: l2 },
          { type: 'label', at: l2 + 0.25, x: 60, y: 450, text: 'HIS BROTHER: A TEXAS', fs: 40, sub: 'justice of the peace', typeDur: 0.5 }
        ],
        tag: LIKE
      });
    },

    // 3 - the Iowa ticket: the forecourt at night; the jackpot board types $16.5 MILLION; the clerk steps out of the shop
    //     and looks round on 'nobody' (nobody comes)
    lc50_unclaimed(ctx) {
      const t = ctx.t, T = ctx.T, io = WT(ctx, 0, 2, 0.7), d16 = WT(ctx, 0, 6, 1.6), jp = WT(ctx, 0, 8, 2.9), nb = WT(ctx, 1, 1, 4.3);
      return E.cine.shot(ctx, {
        set: 'lc50_forecourt', setOpts: { board: seg(t, d16 - 0.1, d16 + 0.9), text: '$16.5M' }, grade: 'night', haze: 0.6,
        cam: { from: { x: 30, y: 30, z: 1.06 }, to: { x: -20, y: 20, z: 1.0 } },
        smoke: { y: 1300, op: 0.12 },
        figures: [
          { id: 'lc50_clerk', x: 520, y: 1330, scale: 0.7, dir: 1, turn: 0.5, pose: 'stand', expr: 'neutral', depth: 0.82,
            keys: [{ at: jp, pose: 'examine', expr: 'focused', gaze: [0.8, -0.1], dur: 0.5 }, { at: nb, pose: 'hands_together', expr: 'worried', headTurn: -0.5, gaze: [-0.8, 0], dur: 0.6 }] }
        ],
        overlays: [
          { type: 'label', at: io - 0.1, x: 60, y: 1180, text: 'DES MOINES, IOWA · DEC 2010', fs: 38, sub: 'Bought at a gas station · drawn Dec 29' }
        ],
        tag: TAG
      });
    },

    // 4 - the Belize claim: a law office; a generic lawyer at the desk slides a claim folder across; a generic lottery
    //     official reads it and folds his arms on 'refused' (the REFUSED stamp); the open loop 'Who bought it?'
    lc50_belize(ctx) {
      const t = ctx.t, T = ctx.T, lw = WT(ctx, 0, 0, 0.3), bz = WT(ctx, 0, 8, 2.0), l2 = LS(ctx, 1, 3.2), rf = WT(ctx, 1, 2, 3.6), wh = WT(ctx, 1, 3, 4.3);
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'warm', haze: 0.55,
        cam: { from: { x: 20, y: 20, z: 1.0 }, to: { x: -20, y: 30, z: 1.07 } },
        figures: [
          { id: 'lc50_lawyer', x: 300, y: 1500, scale: 0.92, dir: 1, turn: 0.45, pose: 'sit_type', expr: 'focused', depth: 0.98,
            keys: [{ at: lw + 0.2, pose: 'present', expr: 'determined', gaze: [0.8, 0.1], dur: 0.5 }, { at: rf + 0.3, pose: 'hand_to_face', expr: 'worried', dur: 0.5 }] },
          { id: 'lc50_official', x: 800, y: 1640, scale: 1.0, dir: -1, turn: 0.4, pose: 'stand', expr: 'neutral', depth: 1.04,
            keys: [{ at: bz - 0.3, pose: 'read', expr: 'focused', dur: 0.5 }, { at: rf - 0.2, pose: 'arms_crossed', expr: 'stern', dur: 0.5 }, { at: wh, headTurn: 0.4, expr: 'focused', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.07, svg: tt => { const k = ease.inOut(seg(tt, lw + 0.2, lw + 1.2)); return `<g transform="translate(${f1(lerp(420, 620, k))} 1205) rotate(-4)"><rect x="-150" y="-30" width="300" height="40" rx="4" fill="#d8c8a0" stroke="${INK}" stroke-width="4"/><rect x="-120" y="-22" width="140" height="8" fill="#a89a7a"/></g>`; } }
        ],
        overlays: [
          { type: 'label', at: lw, x: 60, y: 450, text: 'DEC 2011 · HOURS LEFT', fs: 40, sub: 'A claim for a trust tied to Belize' },
          { type: 'stamp', at: rf, x: 560, y: 1120, text: 'REFUSED', rot: -8, scale: 1.4 }
        ],
        tag: TAG
      });
    },

    // 5 - THE REVEAL (push in; music drop; the single impact and shake): the video room; the store footage on the big
    //     screen; a co-worker leans in, the waveform rises on her line, and she recognises the voice (rack focus); the fun
    //     fact card
    lc50_voice(ctx) {
      const t = ctx.t, T = ctx.T, cm = WT(ctx, 0, 3, 1.1), l2 = LS(ctx, 1, 3.0), vc = WT(ctx, 1, 3, 4.0), ed = WT(ctx, 1, 6, 4.7);
      return E.cine.shot(ctx, {
        set: 'lc50_video', setOpts: { wave: seg(t, l2 - 0.4, l2 + 0.3) }, grade: 'cold', haze: 0.4,
        cam: { from: { x: 0, y: 20, z: 1.0 }, to: { x: 10, y: 40, z: 1.1 }, settle: true },
        rack: { at: vc - 0.2, dur: 0.7, from: 'bg' },
        shake: [{ at: vc, amp: 3 }],
        figures: [
          { id: 'lc50_coworker', x: 900, y: 1900, scale: 1.26, dir: -1, turn: 0.35, pose: 'stand', expr: 'focused', depth: 1.02, gaze: [-0.6, -0.4],
            keys: [{ at: cm, pose: 'examine', expr: 'focused', dur: 0.5 }, { at: vc - 0.1, pose: 'hand_to_face', expr: 'shocked', dur: 0.4 }, { at: ed + 0.2, pose: 'point', expr: 'realise', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'impact', at: vc, x: 540, y: 600 },
          { type: 'funfact', at: ed - 0.1, y: 1000, rows: [{ text: 'CO-WORKERS KNEW HIS VOICE,' }, { text: 'NOT HIS FACE.' }] }
        ],
        tag: TAG
      });
    },

    // 6 - the statistic: a young player under the canopy checks his ticket (generic); the counter 1 IN 292,201,338 with
    //     the source credit row
    lc50_odds(ctx) {
      const t = ctx.t, T = ctx.T, od = WT(ctx, 0, 2, 0.9), n292 = WT(ctx, 0, 5, 1.9);
      return E.cine.shot(ctx, {
        set: 'lc50_forecourt', setOpts: { board: 0 }, grade: 'night', haze: 0.5,
        cam: { from: { x: -20, y: 30, z: 1.04 }, to: { x: 20, y: 30, z: 1.1 } },
        figures: [
          { id: 'lc50_player', x: 580, y: 1860, scale: 0.9, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', depth: 1.0,
            keys: [{ at: n292, pose: 'hand_to_face', expr: 'shocked', dur: 0.5 }, { at: n292 + 1.0, pose: 'read', expr: 'sad', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'counter', at: od - 0.1, dur: 1.6, from: 1000000, to: 292201338, prefix: '1 IN ', label: 'POWERBALL JACKPOT ODDS', y: 600, fs: 104 },
          { type: 'label', at: od + 0.3, x: 150, y: 780, text: 'SOURCE: POWERBALL PRIZE CHART', fs: 30, sub: 'Rigged draws needed no luck' }
        ],
        tag: TAG
      });
    },

    // 7 - the LESSON (save trigger, for the viewer): a young man at a kitchen table reads a "you won" text on his phone;
    //     the checklist card with the SAVE ribbon (captions off)
    lc50_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 5, 1.2);
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'night', haze: 0.55, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'lc50_player', x: 300, y: 1480, scale: 0.86, dir: 1, turn: 0.5, pose: 'sit_read', expr: 'focused', depth: 1.0,
            keys: [{ at: 0.7, expr: 'realise', dur: 0.4 }, { at: sv, pose: 'arms_crossed', expr: 'determined', dur: 0.6 }] }
        ],
        props: [{ depth: 1.08, svg: tt => phone(700, 1020, 0.8, tt, { msg: seg(tt, 0.2, 0.6), rot: -8 }) }],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 430, rows: [{ text: 'NEVER PAY TO GET A PRIZE', fs: 42 }, { text: 'NO ENTRY? THEN NO WIN', fs: 42 }, { text: 'NO GIFT CARDS OR WIRES', fs: 42 }, { text: 'Source: FTC consumer advice', fs: 24, colour: '#c6bba6' }] }
        ],
        tag: TAG
      });
    },

    // 8 - the outcome on the hero ticket in the first frame's framing (the loop): the ticket centred on the counter, the
    //     clerk behind; the sentence label sits BELOW the burned-in end question (which covers y ~290-690 over the last 3.6 s)
    lc50_end(ctx) {
      const t = ctx.t, T = ctx.T, jd = WT(ctx, 0, 1, 0.3), gr = WT(ctx, 0, 3, 0.9), yr = WT(ctx, 0, 7, 1.8);
      return E.cine.shot(ctx, {
        set: 'lc50_store', setOpts: { cy: 1100, tx: 960 }, grade: 'cold', dof: true, haze: 0.45,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 0, y: 40, z: 1.1 }, settle: true },
        figures: [
          { id: 'lc50_clerk', x: 860, y: 1560, scale: 0.86, dir: -1, turn: 0.5, pose: 'stand', expr: 'neutral', depth: 0.9, gaze: [-0.6, 0.6],
            keys: [{ at: gr, pose: 'hands_together', expr: 'focused', dur: 0.6 }, { at: yr + 0.2, pose: 'arms_crossed', expr: 'stern', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.01, accent: true, svg: tt => ticket(HERO.x, HERO.y, HERO.s * 0.9, tt, { glow: 0.8 + 0.2 * Math.sin(tt * 3), rot: -4, lit: 1 }) }
        ],
        overlays: [
          { type: 'label', at: jd, x: 60, y: 780, text: 'AUG 2017 · UP TO 25 YEARS', fs: 38, sub: 'Pleaded guilty in June 2017' }
        ],
        tag: LIKE
      });
    }
  });
})();
