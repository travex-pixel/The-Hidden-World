/* Case File 52 (premium look, EPISODES 48+ rules): Evaldas Rimasauskas got Google and Facebook to wire over $100 million
   (2013-2015) by registering a company in Latvia with the same name as their real Taiwanese hardware supplier and emailing
   their staff fake invoices.
   Structure: frame 1 = the HERO OBJECT (a laptop with an invoice email open: a big INVOICE heading and an amber PAY NOW
   button) on a finance desk, a clerk's hands already typing and the camera already pushing in; PAID stamps land on 'paid';
   his silhouette at a laptop in a dim room at night (who? how?); the real supplier's server line (Taiwan); back at a finance
   desk, an invoice email 'from' the supplier lands and the WIRED chip ticks (the fun fact: forged executives' signatures);
   THE REVEAL in a Riga old-town street at dawn: a door plaque with the same company name (music drop; the one impact and the
   one shake); the LESSON checklist for the viewer at a kitchen table (captions off); the IC3 statistic counter in an
   operations room; the outcome and the irony on the hero object in the first frame's framing with the burned-in end card.
   Smoothness: cuts and dissolves, one push (the reveal), one zoom (the end); one slow camera move per shot; settle only on
   the hero dolly-ins (s01, s04, s08); no handheld (there is no chase).
   Look: episode.look = 'premium', palette shadow #0f2630 / mid #c8b89e / accent #e2a13b. The ONLY strongly coloured object
   is the invoice's PAY NOW button and glow (prop marked accent: true).
   Content rules: Rimasauskas appears ONLY as a faceless rim-lit silhouette (NOT A LIKENESS). Everyone else is a generic
   figure. Google, Facebook and Quanta Computer appear only as plain typed text (no logo, no brand artwork, no product
   design); the email and invoice are our own generic drawings with placeholder bars. Places are generic illustrations.
   New environments (E.registerSets): fi52_office (a bright open-plan finance office by day), fi52_flat (a modest room at
   night), fi52_factory (a server assembly hall), fi52_riga (an old-town street at dawn with a door plaque). Plus the
   engine's kitchen_night and task_force. */
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
  const ACC = '#e2a13b';
  const STAMP = '#9a3a2c';
  const typing = (from, to, a = 'sit_type', b = 'sit_type_b', step = 0.24) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? b : a, dur: step * 0.8 }); return k; };
  const txt = (x, y, s, fs, col, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${o.anchor || 'start'}" font-family="${o.font || 'Nunito'}" font-weight="${o.weight || 800}" font-size="${fs}" fill="${col}"${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.op !== undefined ? ` opacity="${f1(o.op)}"` : ''}>${s}</text>`;

  // ---------- THE HERO: a generic laptop seen from the front, its screen showing an email client with an invoice open.
  // Bottom centre (x, y); ~600 x 440 at s = 1. o.paid 0..1 = a PAID stamp lands on the invoice; o.paid2 0..1 = a second one;
  // o.bank 0..1 = the BANK row outlined in the accent; o.arrive 0..1 = the invoice slides in (a new email); o.glow 0..1 = the
  // accent glow under the PAY NOW button. No logo anywhere; the sender is plain text.
  function invoiceLaptop(x, y, s, t, o = {}) {
    const gl = o.glow ?? 0.8, ar = o.arrive ?? 1;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="8" rx="340" ry="26" fill="#000" opacity="0.4"/>`;
    // base and keyboard
    g += `<path d="M-310 0 L310 0 L270 -72 L-270 -72 Z" fill="#3a3d44" stroke="${INK}" stroke-width="5"/>`;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) g += `<rect x="${f1(-226 + c * 32 + r * 4)}" y="${f1(-60 + r * 13)}" width="22" height="9" rx="2" fill="#23252b"/>`;
    g += `<rect x="-62" y="-16" width="124" height="12" rx="3" fill="#2a2c32"/>`;
    // lid and screen
    g += `<rect x="-290" y="-440" width="580" height="370" rx="12" fill="#2a2c32" stroke="${INK}" stroke-width="6"/>`;
    g += `<rect x="-270" y="-420" width="540" height="332" fill="#e9ecef"/>`;
    g += wash(0, -260, 420, 260, '#ffffff', 0.25);
    // the mail client: a dark top bar, an inbox column, the open message
    g += `<rect x="-270" y="-420" width="540" height="30" fill="#2c3440"/>` + [0, 1, 2].map(i => `<circle cx="${-252 + i * 16}" cy="-405" r="5" fill="#7a8694"/>`).join('');
    g += `<rect x="-270" y="-390" width="130" height="302" fill="#d6dade"/>`;
    for (let i = 0; i < 6; i++) g += `<rect x="-262" y="${-382 + i * 48}" width="114" height="40" rx="4" fill="${i === 0 ? '#f6e6c8' : '#e4e7ea'}"/><rect x="-254" y="${-372 + i * 48}" width="${70 - (i % 3) * 12}" height="8" rx="3" fill="#5a6470"/><rect x="-254" y="${-358 + i * 48}" width="${90 - (i % 2) * 20}" height="6" rx="3" fill="#9aa2aa"/>`;
    // the open message (slides up as it arrives)
    const dy = (1 - ease.out(ar)) * 60, op = ar;
    g += `<g transform="translate(0 ${f1(dy)})" opacity="${f1(op)}">`;
    g += `<rect x="-132" y="-384" width="394" height="290" fill="#fbfaf6"/>`;
    g += txt(-120, -360, 'From: Quanta Computer', 17, '#3a4450', { weight: 700 }) + `<rect x="-120" y="-352" width="250" height="2" fill="#c8ccd0"/>`;
    g += txt(-120, -306, 'INVOICE', 50, '#1d1712', { font: 'Fraunces', weight: 700, ls: 2 });
    g += `<rect x="96" y="-338" width="140" height="10" rx="3" fill="#9aa2aa"/><rect x="126" y="-320" width="110" height="10" rx="3" fill="#9aa2aa"/>`;
    for (let i = 0; i < 3; i++) g += `<rect x="-120" y="${-282 + i * 22}" width="${220 - i * 40}" height="9" rx="3" fill="#a8adb2"/><rect x="170" y="${-282 + i * 22}" width="66" height="9" rx="3" fill="#7a8088"/>`;
    // the bank row
    g += txt(-120, -198, 'BANK ACCOUNT', 16, '#3a4450', { weight: 800, ls: 1 }) + `<rect x="10" y="-210" width="226" height="12" rx="3" fill="#6a7078"/>`;
    if (o.bank > 0) g += `<rect x="-128" y="-224" width="372" height="38" rx="6" fill="none" stroke="${ACC}" stroke-width="5" opacity="${f1(o.bank * (0.8 + 0.2 * Math.sin(t * 6)))}"/>`;
    g += `<rect x="-120" y="-176" width="356" height="2" fill="#c8ccd0"/>` + txt(-120, -148, 'TOTAL', 22, '#1d1712') + `<rect x="-36" y="-164" width="120" height="16" rx="3" fill="#2a2420"/>`;
    // the PAY NOW button (the accent object)
    if (gl > 0) g += wash(176, -150, 120, 50, ACC, f1(0.35 * gl));
    g += `<rect x="112" y="-176" width="132" height="44" rx="10" fill="${ACC}" stroke="#6a4a18" stroke-width="3"/>` + txt(178, -146, 'PAY NOW', 22, '#1d1712', { anchor: 'middle' });
    // PAID stamps
    const stamp = (k, sx, sy, rot) => k > 0 ? `<g opacity="${f1(Math.min(1, k * 1.4) * 0.85)}" transform="translate(${sx} ${sy}) rotate(${rot}) scale(${f1(1 + 0.5 * (1 - ease.out(k)))})"><rect x="-96" y="-34" width="192" height="68" rx="8" fill="none" stroke="${STAMP}" stroke-width="7"/>${txt(0, 18, 'PAID', 50, STAMP, { anchor: 'middle', ls: 6 })}</g>` : '';
    g += stamp(o.paid || 0, 60, -250, -12) + stamp(o.paid2 || 0, -10, -170, 8);
    g += `</g>`;
    return g + '</g>';
  }
  // a generic laptop seen from behind (its lid to camera, the screen's glow over the top edge); bottom centre (x, y)
  function laptopBack(x, y, s, t, o = {}) {
    const gl = o.glow ?? 0.9;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="6" rx="300" ry="22" fill="#000" opacity="0.45"/>`;
    g += `<path d="M-280 0 L280 0 L240 -40 L-240 -40 Z" fill="#24262c" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-250 -40 L250 -40 L270 -380 L-270 -380 Z" fill="#3a3d44" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-220 -70 L220 -70 L236 -350 L-236 -350 Z" fill="#5a5e68" opacity="0.18"/>`;
    if (gl > 0) g += wash(0, -400, 340, 120, '#9fd0ff', f1(0.32 * gl)) + `<path d="M-270 -380 L270 -380" stroke="#cfe8ff" stroke-width="5" opacity="${f1(0.9 * gl)}"/>`;
    return g + '</g>';
  }
  // a phone held flat, screen up-ish (a bill with a PAY button), centre (x, y)
  function phone(x, y, s, rot = -8) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${sc(s)})"><rect x="-60" y="-110" width="120" height="220" rx="16" fill="#1a1c20" stroke="${INK}" stroke-width="4"/><rect x="-50" y="-96" width="100" height="192" rx="6" fill="#e9ecef"/>` +
      `<rect x="-40" y="-84" width="60" height="10" rx="3" fill="#3a4450"/>` + [0, 1, 2].map(i => `<rect x="-40" y="${-60 + i * 18}" width="${80 - i * 16}" height="8" rx="3" fill="#a8adb2"/>`).join('') +
      `<rect x="-36" y="40" width="72" height="26" rx="6" fill="#c9a060"/></g>`;
  }
  // a server: a flat black chassis with LED dots; centre-left (x, y), w x h
  const server = (x, y, w, h, t, i) => { let g = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#1e2126" stroke="#0c0d10" stroke-width="3"/><rect x="${x + 8}" y="${y + 6}" width="${w * 0.5}" height="${h - 12}" fill="#2a2e34"/>`;
    for (let k = 0; k < 3; k++) { const on = Math.sin(t * (3 + k) + i * 1.7 + k) > -0.2; g += `<circle cx="${f1(x + w - 18 - k * 14)}" cy="${f1(y + h / 2)}" r="4" fill="${k === 0 ? '#7ac08a' : '#8ab0d0'}" opacity="${on ? 0.95 : 0.25}"/>`; }
    return g; };

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a bright open-plan finance office by day: a wall of tall windows (trees and low buildings outside), a glass partition,
    // a back row of desks with monitors, a plant; a pale desk in the foreground (depth 1.06; top at o.dy, default 1240)
    fi52_office(ctx, o = {}) {
      const t = ctx.t, r = R(5201), dy = o.dy ?? 1240;
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#c9ccc8"/>`;
      // windows
      back += `<rect x="-300" y="60" width="${W + 600}" height="660" fill="#dfe8ea"/>`;
      back += `<rect x="-300" y="430" width="${W + 600}" height="290" fill="#b9c7b8"/>`;
      for (let i = 0; i < 12; i++) back += `<ellipse cx="${f1(-260 + i * 140 + r() * 40)}" cy="${f1(470 + r() * 50)}" rx="${f1(70 + r() * 40)}" ry="${f1(60 + r() * 30)}" fill="${r() < 0.5 ? '#8ea58a' : '#7e967c'}" opacity="0.8"/>`;
      for (let i = 0; i < 5; i++) back += `<rect x="${f1(-200 + i * 300)}" y="${f1(380 + (i % 2) * 30)}" width="${f1(180 + (i % 3) * 30)}" height="${f1(140 - (i % 2) * 30)}" fill="#d4d6d2" opacity="0.8"/>`;
      back += wash(540, 300, 700, 300, '#ffffff', 0.4);
      for (let i = 0; i < 7; i++) back += `<rect x="${-300 + i * 260}" y="60" width="16" height="660" fill="#8a9094"/>`;
      back += `<rect x="-300" y="50" width="${W + 600}" height="20" fill="#8a9094"/><rect x="-300" y="712" width="${W + 600}" height="16" fill="#8a9094"/>`;
      // a back row of desks with monitors and a plant
      let mid = `<rect x="-300" y="860" width="${W + 600}" height="40" fill="#e6e2da" stroke="#9a968e" stroke-width="3"/><rect x="-300" y="900" width="${W + 600}" height="160" fill="#b4b0a8"/>`;
      for (let i = 0; i < 6; i++) { const mx = -220 + i * 260; mid += `<rect x="${mx}" y="760" width="150" height="96" rx="6" fill="#2a2e34" stroke="#1a1c20" stroke-width="3"/><rect x="${mx + 8}" y="768" width="134" height="80" fill="#5a6a7a" opacity="0.8"/><rect x="${mx + 66}" y="856" width="18" height="10" fill="#2a2e34"/>`; }
      mid += `<g transform="translate(980 860)"><rect x="-40" y="-60" width="80" height="60" fill="#d8d0c0" stroke="#8a8478" stroke-width="3"/>${[...Array(7)].map((_, i) => `<ellipse cx="${-40 + i * 13}" cy="${-90 - (i % 3) * 30}" rx="16" ry="44" fill="#6e8a66" transform="rotate(${(i - 3) * 14} ${-40 + i * 13} -60)"/>`).join('')}</g>`;
      // a glass partition
      mid += `<rect x="-300" y="560" width="${W + 600}" height="300" fill="#eef4f4" opacity="0.12"/><rect x="-300" y="556" width="${W + 600}" height="6" fill="#a8b0b2" opacity="0.6"/>`;
      let floor = `<rect x="-300" y="1060" width="${W + 600}" height="${H}" fill="#8e8a82"/>`;
      for (let i = 0; i < 5; i++) floor += `<rect x="-300" y="${1100 + i * 90}" width="${W + 600}" height="3" fill="#7a766e" opacity="0.6"/>`;
      // the foreground desk
      let desk = `<rect x="-300" y="${dy}" width="${W + 600}" height="44" fill="#e8e2d6" stroke="${INK}" stroke-width="4"/><rect x="-300" y="${dy + 44}" width="${W + 600}" height="${H}" fill="#7a746a"/>`;
      desk += `<path d="M-300 ${dy + 4} L${W + 300} ${dy + 4}" stroke="#fffaf0" stroke-width="3" opacity="0.7"/>`;
      if (o.mug !== false) desk += `<g transform="translate(940 ${dy})"><rect x="-30" y="-64" width="60" height="64" rx="8" fill="#d8d4cc" stroke="${INK}" stroke-width="4"/><path d="M30 -48 q26 10 0 34" stroke="#d8d4cc" stroke-width="9" fill="none"/></g>`;
      desk += `<g transform="translate(110 ${dy}) rotate(-4)"><rect x="-90" y="-16" width="180" height="16" fill="#f2efe6" stroke="${INK}" stroke-width="3"/><rect x="-84" y="-28" width="170" height="12" fill="#ebe6da" stroke="${INK}" stroke-width="3"/></g>`;
      return { light: { dir: -1, rim: '#ffffff', key: '#f4f2ea' }, layers: [[0.1, back], [0.45, mid], [0.8, floor], [1.0, ''], [1.06, desk]] };
    },

    // a modest room at night: a window with city lights and a little snow on the sill, a radiator, a shelf, a desk (depth
    // 1.06) with a small warm lamp; the main light is the laptop's screen
    fi52_flat(ctx, o = {}) {
      const t = ctx.t, r = R(5202);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#141820"/><rect x="-300" y="-300" width="${W + 600}" height="1500" fill="#1a2028"/>`;
      back += `<rect x="-140" y="220" width="560" height="680" fill="#0b1626" stroke="#2a303a" stroke-width="14"/>`;
      for (let i = 0; i < 80; i++) back += `<rect x="${f1(-120 + r() * 520)}" y="${f1(440 + r() * 440)}" width="${f1(5 + r() * 9)}" height="${f1(5 + r() * 11)}" fill="${r() < 0.75 ? '#ffd98a' : '#9fc4e8'}" opacity="${f1(0.35 + 0.5 * r())}"/>`;
      back += `<path d="M140 220 L140 900 M-140 560 L420 560" stroke="#2a303a" stroke-width="10"/><rect x="-170" y="900" width="620" height="22" fill="#e8ecf0" opacity="0.7"/>`;
      back += `<rect x="-120" y="960" width="500" height="140" rx="10" fill="#3a3e46"/>` + [...Array(9)].map((_, i) => `<rect x="${-100 + i * 54}" y="972" width="30" height="116" rx="6" fill="#4a4e56"/>`).join('');
      back += `<rect x="620" y="320" width="380" height="16" fill="#2c3038"/><rect x="650" y="250" width="40" height="70" fill="#3a3530"/><rect x="700" y="270" width="30" height="50" fill="#4a3a30"/><rect x="760" y="230" width="120" height="90" fill="#2a2e36"/>`;
      let floor = `<rect x="-300" y="1140" width="${W + 600}" height="${H}" fill="#101318"/>`;
      let desk = `<rect x="-300" y="1170" width="${W + 600}" height="64" rx="4" fill="#3a2f28" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1234" width="${W + 600}" height="40" fill="#241d18"/><rect x="100" y="1274" width="36" height="700" fill="#1a1512"/><rect x="920" y="1274" width="36" height="700" fill="#1a1512"/>`;
      desk += `<g transform="translate(1000 1170)"><path d="M0 0 L0 -200 L-70 -250" stroke="#20242a" stroke-width="12" fill="none"/><path d="M-120 -270 L-30 -270 L-46 -224 L-104 -224 Z" fill="#2a2420" stroke="${INK}" stroke-width="4"/></g>` + wash(930, 1120, 200, 90, '#ffcf8a', 0.25);
      return { light: { dir: -1, rim: '#9fd0ff', key: '#9fd0ff' }, layers: [[0.3, back], [0.95, floor], [1.0, ''], [1.06, desk]] };
    },

    // a clean server assembly hall (generic): tall windows high on the back wall, rows of server racks with blinking LEDs,
    // a gantry of long lights, a workbench (depth 0.95) with an open chassis; muted walkway lines on the floor
    fi52_factory(ctx, o = {}) {
      const t = ctx.t;
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#b8bcbc"/>`;
      for (let i = 0; i < 6; i++) back += `<rect x="${-260 + i * 280}" y="40" width="200" height="300" fill="#e8eeee" stroke="#8a9090" stroke-width="8"/>`;
      back += wash(540, 200, 800, 200, '#ffffff', 0.35);
      for (let i = 0; i < 4; i++) back += `<rect x="-300" y="${380 + i * 6}" width="${W + 600}" height="3" fill="#8a9090"/>`;
      // racks
      let racks = '';
      for (let k = 0; k < 6; k++) { const rx = -280 + k * 260; racks += `<rect x="${rx}" y="420" width="200" height="560" fill="#2a2e34" stroke="#121418" stroke-width="5"/>`; for (let j = 0; j < 12; j++) racks += server(rx + 10, 432 + j * 44, 180, 38, t, k * 12 + j); }
      // the light gantry
      let lights = `<rect x="-300" y="360" width="${W + 600}" height="14" fill="#6a7070"/>`;
      for (let i = 0; i < 5; i++) lights += `<rect x="${-200 + i * 320}" y="374" width="200" height="12" rx="4" fill="#f6f8f4"/>` + wash(-100 + i * 320, 430, 200, 90, '#ffffff', 0.18);
      let floor = `<rect x="-300" y="980" width="${W + 600}" height="${H}" fill="#9a9c98"/><rect x="-300" y="1040" width="${W + 600}" height="10" fill="#c8a860" opacity="0.5"/><rect x="-300" y="1500" width="${W + 600}" height="10" fill="#c8a860" opacity="0.5"/>`;
      for (let i = 0; i < 8; i++) floor += `<path d="M${-260 + i * 200} 1060 L${-500 + i * 300} 1940" stroke="#8a8c88" stroke-width="3" opacity="0.6"/>`;
      // the workbench with an open chassis (foreground)
      let bench = `<rect x="-300" y="1250" width="${W + 600}" height="36" fill="#c8ccd0" stroke="${INK}" stroke-width="4"/><rect x="-300" y="1286" width="${W + 600}" height="${H}" fill="#5a5e62"/>`;
      bench += `<g transform="translate(560 1250)"><rect x="-210" y="-60" width="420" height="60" rx="4" fill="#2a2e34" stroke="${INK}" stroke-width="4"/>${[0, 1, 2, 3].map(i => `<rect x="${-190 + i * 96}" y="-48" width="80" height="36" fill="#3e6a4e" stroke="#1a2a20" stroke-width="2"/>`).join('')}<rect x="120" y="-54" width="70" height="44" fill="#6a7078"/></g>`;
      return { light: { dir: -1, rim: '#ffffff', key: '#f4f6f2' }, layers: [[0.1, back], [0.3, lights], [0.5, racks], [0.8, floor], [1.0, ''], [1.06, bench]] };
    },

    // an old-town street at dawn (generic, Baltic): narrow tall gabled facades in muted pastels, a cobbled street, a street
    // lamp, and a dark wooden door (centre right) with a brass plaque engraved in plain text 'QUANTA COMPUTER'. o.plaque 0..1
    // = the plaque's warm glint
    fi52_riga(ctx, o = {}) {
      const t = ctx.t, r = R(5203), pq = o.plaque || 0;
      let sky = `<defs><linearGradient id="fi52sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a7488"/><stop offset="0.7" stop-color="#d8c4a8"/><stop offset="1" stop-color="#e8c896"/></linearGradient></defs><rect x="-500" y="-300" width="${W + 1000}" height="${H + 600}" fill="url(#fi52sky)"/>` + wash(800, 420, 500, 200, '#ffe2b0', 0.3);
      // far spire and roofs
      let far = `<path d="M180 640 L210 300 L240 640 Z" fill="#6a7a84"/><rect x="170" y="560" width="80" height="200" fill="#6a7a84"/>`;
      for (let i = 0; i < 8; i++) far += `<path d="M${-400 + i * 230} 760 L${-320 + i * 230} 640 L${-240 + i * 230} 760 Z" fill="#7a8890" opacity="0.8"/>`;
      // the facades
      const cols = ['#cdb48a', '#a9b49a', '#c9a49a', '#ddd2bc', '#b8a48a', '#a6b0b4'];
      let row = '';
      for (let i = 0; i < 6; i++) { const fx = -420 + i * 300, fw = 290, top = 520 + (i % 2) * 50, col = cols[i];
        row += `<path d="M${fx} 1300 L${fx} ${top + 120} L${fx + fw / 2} ${top} L${fx + fw} ${top + 120} L${fx + fw} 1300 Z" fill="${col}" stroke="${INK}" stroke-width="5"/>`;
        for (let j = 0; j < 3; j++) for (let k = 0; k < 2; k++) row += `<rect x="${fx + 50 + k * 120}" y="${top + 170 + j * 150}" width="70" height="100" fill="#3a4450" stroke="${INK}" stroke-width="4"/><path d="M${fx + 85 + k * 120} ${top + 170 + j * 150} L${fx + 85 + k * 120} ${top + 270 + j * 150}" stroke="#d8d0c0" stroke-width="3"/>`;
        row += `<rect x="${fx + fw / 2 - 30}" y="${top + 60}" width="60" height="50" rx="25" fill="#3a4450" stroke="${INK}" stroke-width="3"/>`; }
      // the door with the plaque (on the facade at x 480-770)
      row += `<rect x="560" y="1060" width="150" height="240" rx="70" fill="#4a3426" stroke="${INK}" stroke-width="6"/><path d="M635 1070 L635 1300" stroke="#2a1e16" stroke-width="5"/><circle cx="660" cy="1190" r="6" fill="#c8a860"/>`;
      row += `<rect x="728" y="1040" width="260" height="120" rx="8" fill="#b8955a" stroke="#5a4426" stroke-width="6"/><rect x="740" y="1052" width="236" height="96" rx="4" fill="none" stroke="#7a5e34" stroke-width="3"/>` + wash(858, 1100, 170, 90, '#ffe2a8', f1(0.15 + 0.35 * pq)) +
        txt(858, 1096, 'QUANTA', 40, '#3a2a16', { anchor: 'middle', font: 'Fraunces', weight: 700, ls: 4 }) + txt(858, 1136, 'COMPUTER', 32, '#3a2a16', { anchor: 'middle', font: 'Fraunces', weight: 700, ls: 4 });
      // the street
      let street = `<rect x="-500" y="1300" width="${W + 1000}" height="${H}" fill="#7a746a"/><rect x="-500" y="1300" width="${W + 1000}" height="30" fill="#9a948a"/>`;
      for (let i = 0; i < 90; i++) street += `<ellipse cx="${f1(-480 + r() * (W + 960))}" cy="${f1(1350 + r() * 560)}" rx="${f1(18 + r() * 10)}" ry="${f1(8 + r() * 4)}" fill="#68625a" opacity="0.7"/>`;
      street += `<rect x="-60" y="760" width="14" height="560" fill="#2a2a2a"/><path d="M-90 760 L-16 760 L-30 700 L-76 700 Z" fill="#2a2a2a"/>` + wash(-53, 740, 60, 40, '#ffe2a8', f1(0.4 - 0.3 * seg(t, 0, 4)));
      return { light: { dir: 1, rim: '#ffe6c4', key: '#f4e8d4' }, layers: [[0.1, sky], [0.25, far], [0.7, row], [1.0, street]] };
    }
  });

  // the hero framing in the first and last shots (the loop): the invoice laptop big and centred on the desk
  const HERO = { x: 420, y: 1250, s: 1.2 };

  E.registerScenes({
    // 1 - hook (frame 1): the invoice laptop big and centred; a clerk at its right, already typing, the camera already
    //     pushing in; on 'paid.' a PAID stamp lands and the PAY button pulses; on 'Facebook paid' a second one. The headline
    //     is burned in at the top until ~3 s, so overlays stay out of y 280-560 until then.
    fi52_hook(ctx) {
      const t = ctx.t, T = ctx.T, pd = WT(ctx, 0, 6, 2.1), fb = WT(ctx, 1, 2, 3.7), m = WT(ctx, 1, 4, 4.4);
      return E.cine.shot(ctx, {
        set: 'fi52_office', setOpts: { dy: 1240, mug: false }, grade: 'none', dof: true, haze: 0.5,
        cam: { from: { x: 0, y: 40, z: 1.02 }, to: { x: -10, y: 70, z: 1.12 }, settle: true },
        figures: [
          { id: 'fi52_clerk', x: 905, y: 1700, scale: 1.0, dir: -1, turn: 0.6, pose: 'sit_type', expr: 'focused', depth: 0.98, gaze: [-0.7, 0.5],
            keys: [...typing(0.0, pd - 0.3), { at: pd - 0.2, pose: 'sit', expr: 'neutral', dur: 0.3 }, ...typing(pd + 0.6, fb - 0.2), { at: fb, pose: 'sit_read', expr: 'neutral', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.07, accent: true, svg: tt => invoiceLaptop(HERO.x, HERO.y, HERO.s, tt, { paid: seg(tt, pd, pd + 0.25), paid2: seg(tt, fb, fb + 0.25), glow: 0.7 + 0.3 * Math.sin(tt * 4) }) }
        ],
        overlays: [
          { type: 'label', at: m + 0.1, x: 60, y: 470, text: 'TWO TECH GIANTS · 2013-2015', fs: 38, sub: 'Over $100 million wired' }
        ],
        tag: TAG
      });
    },

    // 2 - who: a dim room at night; his silhouette at a laptop seen from behind, typing; on 'how' he stops
    fi52_who(ctx) {
      const t = ctx.t, T = ctx.T, lt = WT(ctx, 0, 4, 1.0), how = WT(ctx, 1, 1, 2.3);
      return E.cine.shot(ctx, {
        set: 'fi52_flat', grade: 'night', haze: 0.4,
        cam: { from: { x: 30, y: 40, z: 1.04 }, to: { x: 0, y: 50, z: 1.1 } },
        figures: [
          { id: 'fi52_rimasauskas', x: 700, y: 1640, scale: 0.98, dir: -1, turn: 0.55, pose: 'sit_type', expr: 'neutral', silhouette: 'cool', depth: 1.0, gaze: [-0.6, 0.4],
            keys: [...typing(0.05, how - 0.1), { at: how, pose: 'sit', dur: 0.4 }] }
        ],
        props: [{ depth: 1.07, svg: tt => laptopBack(380, 1180, 0.8, tt, { glow: 0.95 }) }],
        overlays: [
          { type: 'label', at: lt - 0.2, x: 60, y: 440, text: 'EVALDAS RIMASAUSKAS', fs: 44, sub: 'Lithuania · arrested there in 2017' }
        ],
        tag: LIKE
      });
    },

    // 3 - the real supplier: a server assembly hall; a technician slides a server into place; the plain-text card
    fi52_supplier(ctx) {
      const t = ctx.t, T = ctx.T, re = WT(ctx, 0, 5, 1.2), tw = WT(ctx, 0, 9, 2.4);
      return E.cine.shot(ctx, {
        set: 'fi52_factory', grade: 'cold', haze: 0.6,
        cam: { from: { x: -60, y: 30, z: 1.0 }, to: { x: 40, y: 30, z: 1.04 } },
        shafts: { x: 300, n: 3, op: 0.1, w: 70 },
        figures: [
          { id: 'fi52_worker', x: 250, y: 1640, scale: 0.9, dir: 1, turn: 0.45, pose: 'examine', expr: 'focused', depth: 1.0, gaze: [0.6, 0.5],
            keys: [{ at: 0.6, pose: 'present', dur: 0.5 }, { at: re, pose: 'examine', dur: 0.5 }, { at: tw, pose: 'point', gaze: [0.8, 0.0], dur: 0.4 }] },
          { id: 'fi52_worker2', x: 860, y: 1560, scale: 0.78, dir: -1, turn: 0.5, pose: 'read', expr: 'focused', depth: 0.9,
            keys: [{ at: re + 0.3, pose: 'hands_together', expr: 'neutral', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: re - 0.2, x: 60, y: 440, text: 'QUANTA COMPUTER · TAIWAN', fs: 42, sub: 'A real hardware supplier to both' }
        ],
        tag: TAG
      });
    },

    // 4 - the emails: a finance desk; a new invoice email 'from' Quanta Computer slides in (rack focus onto it); on 'money'
    //     the BANK row is outlined; the WIRED chip ticks at the top; the fun fact card
    fi52_invoice(ctx) {
      const t = ctx.t, T = ctx.T, em = WT(ctx, 0, 1, 0.2), inv = WT(ctx, 0, 5, 1.2), l2 = LS(ctx, 1, 2.9), mo = WT(ctx, 1, 2, 3.2);
      return E.cine.shot(ctx, {
        set: 'fi52_office', setOpts: { dy: 1300 }, grade: 'none', dof: true, haze: 0.6,
        cam: { from: { x: 20, y: 60, z: 1.04 }, to: { x: 0, y: 90, z: 1.14 }, settle: true },
        rack: { at: em - 0.1, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'fi52_clerk2', x: 130, y: 1720, scale: 1.0, dir: 1, turn: 0.4, pose: 'sit_read', expr: 'neutral', depth: 0.98, glasses: true, gaze: [0.7, 0.5],
            keys: [...typing(em, inv - 0.2), { at: inv, pose: 'sit_read', expr: 'focused', dur: 0.4 }, { at: mo + 0.4, pose: 'sit', expr: 'neutral', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.07, accent: true, svg: tt => invoiceLaptop(600, 1310, 1.12, tt, { arrive: seg(tt, em, inv), bank: seg(tt, mo - 0.1, mo + 0.3), glow: 0.6 + 0.3 * Math.sin(tt * 4) }) }
        ],
        overlays: [
          { type: 'funfact', at: l2 - 0.1, y: 430, rows: [{ text: 'HE FORGED SIGNATURES OF' }, { text: 'THEIR OWN EXECUTIVES.' }] }
        ],
        tag: TAG
      });
    },

    // 5 - THE REVEAL: an old-town street at dawn in Latvia; his silhouette walks left to right and stops at the door; the
    //     camera drifts in on the brass plaque engraved with the SAME name (plain text); the one impact and the one shake
    fi52_samename(ctx) {
      const t = ctx.t, T = ctx.T, lv = WT(ctx, 0, 1, 0.2), co = WT(ctx, 0, 5, 1.4), sm = WT(ctx, 0, 8, 2.3);
      const wk = { at: 0.1, dur: Math.max(1.2, co - 0.1), cadence: 4.0, stride: 14, from: 60, to: 470 };
      return E.cine.shot(ctx, {
        set: 'fi52_riga', setOpts: { plaque: seg(t, sm - 0.3, sm + 0.3) }, grade: 'dawn', haze: 0.5,
        cam: { keys: [{ at: 0, x: -20, y: 40, z: 1.0 }, { at: 0.3, x: 150, y: 150, z: 1.22, dur: Math.max(1.5, sm - 0.2) }] },
        shake: [{ at: sm + 0.2, amp: 3 }],
        figures: [
          { id: 'fi52_rimasauskas', x: 60, y: 1560, scale: 0.86, dir: 1, turn: 0.45, pose: 'walk', expr: 'neutral', silhouette: 'warm', depth: 0.98, walk: wk,
            keys: [{ at: co, pose: 'stand', dur: 0.4 }, { at: sm + 0.1, pose: 'hands_behind', headTurn: 0.4, dur: 0.6 }] }
        ],
        overlays: [
          { type: 'label', at: lv, until: sm - 0.1, x: 60, y: 440, text: 'LATVIA', fs: 44, sub: 'He registered a company here' },
          { type: 'impact', at: sm + 0.2, x: 860, y: 1000 },
          { type: 'label', at: sm + 0.25, x: 60, y: 440, text: 'SAME NAME AS THE SUPPLIER', fs: 40, sub: 'Bank accounts in Latvia and Cyprus' }
        ],
        tag: LIKE
      });
    },

    // 6 - the LESSON (save trigger, for the viewer): a kitchen table at night; a young man checks a bill on his phone, the
    //     laptop beside him; the checklist card with the SAVE ribbon (captions off)
    fi52_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 5, 1.4);
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'warm', haze: 0.5, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'fi52_mate', x: 520, y: 1640, scale: 0.92, dir: 1, turn: 0.75, pose: 'sit_read', expr: 'focused', depth: 1.0, gaze: [0.3, 0.8],
            keys: [{ at: sv, pose: 'sit', expr: 'realise', gaze: [0.0, 0.0], dur: 0.5 }, { at: sv + 1.0, pose: 'sit_read', expr: 'determined', gaze: [0.3, 0.8], dur: 0.5 }] }
        ],
        props: [{ depth: 1.07, svg: tt => phone(700, 1160, 0.7, -14) }],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 430, rows: [{ text: 'CALL A NUMBER YOU KNOW', fs: 44 }, { text: 'CHECK THE EXACT ADDRESS', fs: 44 }, { text: 'URGENT? NEW BANK? STOP.', fs: 44 }, { text: 'FBI · Action Fraud (UK police)', fs: 24, colour: '#c8b89e' }] }
        ],
        tag: TAG
      });
    },

    // 7 - the statistic: an operations room; an analyst at the evidence wall turns to camera; the counter $0 -> $3,046,598,558
    //     with the source credit beneath it
    fi52_stat(ctx) {
      const t = ctx.t, T = ctx.T, sc_ = WT(ctx, 0, 3, 0.9), b3 = WT(ctx, 0, 6, 1.7);
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'cold', haze: 0.5,
        cam: { from: { x: 0, y: 20, z: 1.0 }, to: { x: 0, y: 40, z: 1.07 } },
        figures: [
          { id: 'fi52_analyst', x: 760, y: 1700, scale: 0.92, dir: -1, turn: 0.45, pose: 'examine', expr: 'focused', depth: 1.0, gaze: [-0.4, -0.6],
            keys: [{ at: sc_, pose: 'point_up', dur: 0.5 }, { at: b3 + 0.4, pose: 'arms_crossed', expr: 'stern', gaze: [-0.2, 0.1], dur: 0.6 }] }
        ],
        overlays: [
          { type: 'counter', at: sc_ - 0.2, dur: 1.8, from: 0, to: 3046598558, prefix: '$', label: 'LOST TO EMAIL SCAMS', y: 640, fs: 104 },
          { type: 'label', at: sc_ + 0.3, x: 120, y: 820, text: 'REPORTED LOSSES · 2025', fs: 34, sub: 'Source: FBI IC3 annual report' }
        ],
        tag: TAG
      });
    },

    // 8 - the outcome on the hero object in the first frame's framing (the loop); the clerk closes the invoice; the burned-in
    //     end card covers y ~290-690 over the last 3.6 s, so no overlay sits there
    fi52_end(ctx) {
      const t = ctx.t, T = ctx.T, fv = WT(ctx, 0, 2, 0.4), wp = WT(ctx, 1, 1, 2.2);
      return E.cine.shot(ctx, {
        set: 'fi52_office', setOpts: { dy: 1240, mug: false }, grade: 'none', dof: true, haze: 0.5,
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: -10, y: 70, z: 1.1 }, settle: true },
        figures: [
          { id: 'fi52_clerk', x: 905, y: 1700, scale: 1.0, dir: -1, turn: 0.6, pose: 'sit_read', expr: 'neutral', depth: 0.98, gaze: [-0.7, 0.5],
            keys: [{ at: fv, pose: 'hand_to_face', expr: 'realise', dur: 0.5 }, { at: wp, pose: 'sit', expr: 'sad', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.07, accent: true, svg: tt => invoiceLaptop(HERO.x, HERO.y, HERO.s, tt, { paid: 1, paid2: 1, glow: 0.8 + 0.2 * Math.sin(tt * 3) }) }
        ],
        tag: TAG
      });
    }
  });
})();
