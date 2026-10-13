/* Case File 38 ("Danger Zones" on the upgraded engine): Myanmar's scam cities (Myawaddy, KK Park, Shwe Kokko).
   ONGOING: nobody is accused on screen; workers are victims, drawn as generic figures of several nationalities.
   Structure: a burned-in object-first headline over the HERO OBJECT (a smartphone with a friendly "wrong number" chat,
   big and centred in the first frame and again in the last, so the video loops); the map fly-in (Asia to the
   Myanmar-Thailand border, Myanmar highlighted, a pin on Myawaddy, KK Park and Shwe Kokko labelled); the stakes count-up
   (UN: at least 120,000 people); the lure (a fake job offer, the compound gate shuts); the scam floor (text, befriend,
   crypto); THE HOW at ~55 % (pig butchering: a fake trading app shows profits, then the withdrawal fails; impact); the FBI
   count-up ($5.8 billion, 2024); the crackdown (the power goes out, the gate opens, people walk free); the raid (towers
   blown into dust, people cross toward Thailand; impact; fun fact: Starlink kits; status card); the lesson card and the
   callback on the phone; a burned-in YES/NO end question.
   Look: episode.look = 'vivid' with varied bright grades (neon, tokyo, jungle, cold, warm, night, dawn); every shot has a
   continuous eased camera move plus handheld 0.3-0.6; flickering monitors, sweeping floodlights, dust, ripples, pings.
   Content rules:
   - No real faces; generic figures only (sc38_*). No weapons, no violence, no guards drawn; the demolition shows empty
     towers collapsing into dust. No individual or group is named on screen except as attributed, typed facts.
   - The phone, the chat and the "trading app" are our own generic designs: no app, brand or platform logo.
   New environments (E.registerSets): sc38_flat (a city apartment at night: a wide window on a neon skyline, a sofa, a
   lamp), sc38_compound (a walled scam compound in green hills: concrete towers with lit windows, a wall with razor wire,
   a steel gate, a watchtower, sweeping floodlights; o.blackout, o.gate, o.demolish, o.river, o.fence), sc38_floor (the
   scam floor: fluorescent tubes, barred windows, racks of phones, rows of glowing desks). Plus the engine's mapflight,
   kitchen_night and task_force. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1, esc } = E;
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const YEL = '#ffd23f', RED = '#8e1f18', MUTE = '#6b665c', HL = '#ff3b5c', GRN = '#27d07a', BLU = '#3aa0ff';
  const FONT = 'font-family="Nunito" font-weight="800"';

  // ---------- THE HERO: a generic modern smartphone (no logo, no brand), centre-x x, top y, ~440 x 880 at s = 1.
  // o.msgs = [{lines:[..], side:'in'|'out', at, col}] chat bubbles that pop in at local time `at`; o.glow 0..1 = neon
  // halo; o.ping = time of a notification ring; o.app = a function (t) returning the screen's SVG instead of the chat
  // (drawn in the screen's own 400 x 840 coordinates); o.tilt degrees.
  function phone(x, y, s, t, o = {}) {
    const PW = 440, PH = 880, k = o.glow || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.tilt || 0)} 0 ${PH / 2}) scale(${sc(s)})">`;
    g += wash(0, PH / 2, 420, 560, o.halo || '#ff4fd8', f1(0.22 + 0.25 * k)) + wash(0, PH / 2 + 60, 300, 420, '#3aa0ff', f1(0.18 + 0.15 * k));
    if (k > 0) g += `<rect x="${-PW / 2 - 26}" y="-26" width="${PW + 52}" height="${PH + 52}" rx="86" fill="none" stroke="${YEL}" stroke-width="8" stroke-dasharray="26 16" opacity="${f1(0.85 * k * (0.8 + 0.2 * Math.sin(t * 7)))}"/>`;
    g += `<rect x="${-PW / 2 + 12}" y="22" width="${PW}" height="${PH}" rx="64" fill="#000" opacity="0.55"/>`;
    g += `<rect x="${-PW / 2}" y="0" width="${PW}" height="${PH}" rx="64" fill="#1a1c24" stroke="#5a5e6c" stroke-width="5"/><rect x="${-PW / 2 + 6}" y="6" width="${PW - 12}" height="${PH - 12}" rx="58" fill="#07080c"/>`;
    g += `<rect x="${PW / 2 - 2}" y="180" width="8" height="90" rx="4" fill="#3a3e4a"/><rect x="${-PW / 2 - 6}" y="160" width="8" height="60" rx="4" fill="#3a3e4a"/><rect x="${-PW / 2 - 6}" y="240" width="8" height="60" rx="4" fill="#3a3e4a"/>`;
    // the screen (clipped), 400 x 840 from (-200, 20)
    const cid = 'sc38scr' + Math.round(x + y * 3 + s * 100);
    g += `<defs><clipPath id="${cid}"><rect x="-200" y="20" width="400" height="840" rx="46"/></clipPath><linearGradient id="${cid}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151a2e"/><stop offset="1" stop-color="#0c0f1c"/></linearGradient></defs>`;
    g += `<g clip-path="url(#${cid})"><rect x="-200" y="20" width="400" height="840" fill="url(#${cid}g)"/>`;
    if (o.app) g += `<g transform="translate(-200 20)">${o.app(t)}</g>`;
    else {
      // status bar and chat header (generic: an unknown number, no app branding)
      g += `<text x="-160" y="62" ${FONT} font-size="22" fill="#cfd6e6">9:41</text><rect x="120" y="46" width="44" height="20" rx="5" fill="none" stroke="#cfd6e6" stroke-width="3"/><rect x="124" y="50" width="30" height="12" rx="2" fill="#cfd6e6"/>`;
      g += `<rect x="-200" y="80" width="400" height="104" fill="#1c2238"/><circle cx="-130" cy="132" r="32" fill="#4a5470"/><text x="-130" y="144" text-anchor="middle" ${FONT} font-size="34" fill="#e8ecf6">?</text>`;
      g += `<text x="-84" y="126" ${FONT} font-size="28" fill="#ffffff">Unknown number</text><text x="-84" y="160" font-family="Nunito" font-size="20" fill="#9aa4c0">Text message · now</text>`;
      let yy = 220;
      for (const m of o.msgs || []) {
        const q = ease.back(seg(t, m.at ?? 0, (m.at ?? 0) + 0.35)); if (q <= 0) { continue; }
        const fs = m.fs || 30, lh = fs * 1.25, bw = Math.min(364, Math.max(...m.lines.map(l => l.length)) * fs * 0.54 + 62), bh = m.lines.length * lh + 30;
        const bx = m.side === 'out' ? 180 - bw : -180, col = m.col || (m.side === 'out' ? '#2f7bff' : '#2c3246');
        const cx = m.side === 'out' ? bx + bw : bx, cyy = yy;
        g += `<g transform="translate(${f1(cx)} ${f1(cyy)}) scale(${sc(Math.max(0.001, q))}) translate(${f1(-cx)} ${f1(-cyy)})">`;
        if (m.hot) g += `<rect x="${f1(bx - 8)}" y="${f1(yy - 8)}" width="${f1(bw + 16)}" height="${f1(bh + 16)}" rx="34" fill="none" stroke="${m.hot}" stroke-width="6" opacity="${f1(0.6 + 0.4 * Math.sin(t * 8))}"/>`;
        g += `<rect x="${f1(bx)}" y="${f1(yy)}" width="${f1(bw)}" height="${f1(bh)}" rx="28" fill="${col}"/>`;
        m.lines.forEach((l, i) => { g += `<text x="${f1(bx + 22)}" y="${f1(yy + 16 + lh * (i + 0.8))}" ${FONT} font-size="${fs}" fill="#ffffff">${esc(l)}</text>`; });
        g += '</g>';
        yy += bh + 26;
      }
      // the input bar
      g += `<rect x="-180" y="776" width="300" height="56" rx="28" fill="#1c2238" stroke="#3a4260" stroke-width="2"/><text x="-156" y="812" font-family="Nunito" font-size="22" fill="#6a7494">Text message</text><circle cx="156" cy="804" r="28" fill="#2f7bff"/><path d="M144 804 L170 804 M160 794 L170 804 L160 814" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    }
    g += `<path d="M-200 20 L-40 20 L-200 420 Z" fill="#ffffff" opacity="0.04"/></g>`;
    g += `<rect x="-60" y="30" width="120" height="30" rx="15" fill="#000"/>`;   // camera notch
    if (o.ping !== undefined) { const ph = seg(t, o.ping, o.ping + 0.8); if (ph > 0 && ph < 1) for (let i = 0; i < 2; i++) { const p2 = clamp(ph * 1.3 - i * 0.3, 0, 1); g += `<rect x="${f1(-PW / 2 - p2 * 90)}" y="${f1(-p2 * 90)}" width="${f1(PW + p2 * 180)}" height="${f1(PH + p2 * 180)}" rx="${f1(64 + p2 * 60)}" fill="none" stroke="#ff4fd8" stroke-width="${f1(8 * (1 - p2))}" opacity="${f1(1 - p2)}"/>`; } }
    return g + '</g>';
  }
  // the hero chat (same in the first and the last frame): a friendly "wrong number" opener
  const HERO_MSGS = [{ lines: ['Hi, is this Anna? 😊'], side: 'in', at: -1, fs: 32 }, { lines: ["Oh sorry, wrong number!", 'You seem nice though 🙂'], side: 'in', at: -1, fs: 28 }];

  // the fake "trading app" screen (generic, no brand): a balance that climbs, a green chart, a WITHDRAW button; at
  // `fail` the button is pressed and a red WITHDRAWAL FAILED panel slides up. Coordinates: 400 x 840.
  function fakeApp(t, a) {
    const up = ease.inOut(seg(t, a.rise0, a.rise1)), bal = Math.round(lerp(12480, 48920, up));
    let g = `<rect width="400" height="840" fill="#0b1220"/><text x="30" y="52" ${FONT} font-size="22" fill="#cfd6e6">9:41</text>`;
    g += `<rect x="20" y="80" width="360" height="70" rx="16" fill="#131c30"/><circle cx="58" cy="115" r="20" fill="${GRN}"/><path d="M48 122 L56 112 L62 118 L70 106" stroke="#0b1220" stroke-width="4" fill="none"/><text x="92" y="126" ${FONT} font-size="28" fill="#ffffff">My portfolio</text>`;
    g += `<text x="30" y="210" font-family="Nunito" font-size="24" fill="#8a96b4">Balance (USD)</text><text x="30" y="270" ${FONT} font-size="54" fill="#ffffff">$${bal.toLocaleString('en-US')}</text>`;
    g += `<rect x="30" y="292" width="150" height="40" rx="20" fill="${GRN}" opacity="0.2"/><text x="48" y="320" ${FONT} font-size="24" fill="${GRN}">▲ +${Math.round(lerp(4, 292, up))}%</text>`;
    // the chart: a jagged line that climbs with the balance
    const r = R(3806); let d = '', area = ''; const n = 22;
    for (let i = 0; i <= n; i++) { const u = i / n; if (u > 0.25 + 0.75 * up) break; const yv = 640 - (u * u * 230 + (r() - 0.5) * 30 + u * 40) * (0.4 + 0.6 * up); const xv = 20 + u * 360; d += (i ? 'L' : 'M') + f1(xv) + ' ' + f1(yv); }
    area = d + ' L' + f1(20 + Math.min(1, 0.25 + 0.75 * up) * 360) + ' 680 L20 680 Z';
    g += [440, 520, 600, 680].map(yy => `<line x1="20" y1="${yy}" x2="380" y2="${yy}" stroke="#1e2a44" stroke-width="2"/>`).join('');
    g += `<path d="${area}" fill="${GRN}" opacity="0.16"/><path d="${d}" stroke="${GRN}" stroke-width="6" fill="none" stroke-linejoin="round"/>`;
    // the WITHDRAW button, pressed at `fail`
    const pr = seg(t, a.fail - 0.15, a.fail), fl = ease.out(seg(t, a.fail, a.fail + 0.35));
    g += `<g transform="translate(200 750) scale(${sc(1 - 0.08 * Math.sin(pr * Math.PI))}) translate(-200 -750)"><rect x="30" y="712" width="340" height="76" rx="38" fill="${BLU}"/><text x="200" y="762" text-anchor="middle" ${FONT} font-size="32" fill="#fff">WITHDRAW</text></g>`;
    if (fl > 0) g += `<g transform="translate(0 ${f1((1 - fl) * 420)})"><rect x="0" y="420" width="400" height="420" fill="#2a0a12" opacity="0.96"/><rect x="0" y="420" width="400" height="8" fill="${HL}"/>` +
      `<circle cx="200" cy="520" r="50" fill="${HL}"/><path d="M178 498 L222 542 M222 498 L178 542" stroke="#fff" stroke-width="10" stroke-linecap="round"/>` +
      `<text x="200" y="626" text-anchor="middle" ${FONT} font-size="34" fill="#ffffff">WITHDRAWAL</text><text x="200" y="668" text-anchor="middle" ${FONT} font-size="34" fill="#ffffff">FAILED</text>` +
      `<text x="200" y="720" text-anchor="middle" font-family="Nunito" font-size="22" fill="#ffb0bc">Account under review</text></g>`;
    return g;
  }

  // a chain-link fence across the frame (foreground), top at y0, with a barbed top wire
  function fence(y0, t, op = 1) {
    let g = `<g opacity="${f1(op)}">`;
    for (let x = -300; x < W + 300; x += 46) g += `<path d="M${x} ${y0} L${x + 230} ${H + 200} M${x + 230} ${y0} L${x} ${H + 200}" stroke="#9aa6b4" stroke-width="3" opacity="0.5"/>`;
    for (let x = -300; x < W + 300; x += 300) g += `<rect x="${x}" y="${y0 - 60}" width="18" height="${H}" fill="#3a4250"/>`;
    g += `<rect x="-300" y="${y0 - 6}" width="${W + 600}" height="10" fill="#5a6270"/>`;
    for (let x = -300; x < W + 300; x += 40) g += `<path d="M${x} ${y0 - 40} l14 -12 l14 12 l-14 12 z" fill="none" stroke="#b4bcc8" stroke-width="3"/>`;
    return g + '</g>';
  }
  // dust clouds (demolition): billows at (x, y), k 0..1
  function dust(x, y, k, t, seed = 11, col = '#d8c0a0') {
    if (k <= 0) return ''; const r = R(seed); let soft = '', crisp = '';
    for (let i = 0; i < 22; i++) { const ph = ((t * (0.12 + r() * 0.08) + r()) % 1), dx = (r() - 0.5) * 700 * (0.4 + ph), up = 30 + ph * 520 * (0.5 + r() * 0.6), rr = (80 + ph * 200 + r() * 50) * Math.min(1, k * 1.4);
      const op = k * (1 - ph * 0.7); soft += `<circle cx="${f1(x + dx)}" cy="${f1(y - up)}" r="${f1(rr * 1.2)}" fill="${col}" opacity="${f1(0.3 * op)}"/>`; crisp += `<circle cx="${f1(x + dx)}" cy="${f1(y - up)}" r="${f1(rr * 0.7)}" fill="${col}" opacity="${f1(0.12 * op)}"/>`; }
    return `<g filter="url(#cineSoft)">${soft}</g>${crisp}`;
  }
  // a backpack prop drawn behind a walking figure's shoulder (follows a walk spec)
  function walkerX(f, t) { const w = f.walk; if (!w) return f.x; const u = clamp((t - w.at) / w.dur, 0, 1); return lerp(w.from, w.to, u); }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a city apartment at night (generic, anywhere in the US/UK): a wide window on a neon skyline with bokeh, a sofa, a
    // floor lamp, a plant; the room is lit pink/blue by the city and the phone.
    sc38_flat(ctx, o = {}) {
      const t = ctx.t, r = R(3801);
      let sky = `<defs><linearGradient id="scfsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0626"/><stop offset="0.6" stop-color="#3a1260"/><stop offset="1" stop-color="#c2348a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#scfsky)"/>`;
      for (let i = 0; i < 14; i++) { const x = -260 + i * 120 + r() * 40, w = 80 + r() * 70, h = 260 + r() * 520; sky += `<rect x="${f1(x)}" y="${f1(1020 - h)}" width="${f1(w)}" height="${f1(h + 40)}" fill="${i % 2 ? '#160c30' : '#1e1040'}"/>`;
        for (let j = 0; j < 14; j++) { const wx = x + 10 + r() * (w - 24), wy = 1020 - h + 20 + r() * (h - 40); sky += `<rect x="${f1(wx)}" y="${f1(wy)}" width="10" height="14" fill="${r() > 0.5 ? '#ffd98a' : '#7ad8ff'}" opacity="${f1(0.4 + 0.4 * Math.sin(t * (0.5 + r()) + i + j))}"/>`; } }
      for (let i = 0; i < 18; i++) { const bx = r() * W, by = 300 + r() * 700, br = 20 + r() * 50; sky += `<circle cx="${f1(bx)}" cy="${f1(by)}" r="${f1(br)}" fill="${['#ff4fd8', '#3aa0ff', '#ffb050'][i % 3]}" opacity="${f1(0.12 + 0.06 * Math.sin(t * 1.4 + i))}"/>`; }
      // the room: walls around a wide window, mullions, a sill
      let room = `<path d="M-300 -300 L${W + 300} -300 L${W + 300} 1200 L-300 1200 Z M40 180 L1040 180 L1040 1040 L40 1040 Z" fill="#1a1230" fill-rule="evenodd"/>`;
      room += `<rect x="40" y="180" width="1000" height="860" fill="none" stroke="#2e2448" stroke-width="22"/><path d="M540 180 L540 1040 M40 610 L1040 610" stroke="#2e2448" stroke-width="14"/><rect x="10" y="1030" width="1060" height="34" fill="#3a2e58"/>`;
      room += wash(540, 600, 520, 420, '#ff4fd8', 0.12);
      // floor, a rug
      let floor = `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="#140e24"/><rect x="-300" y="1196" width="${W + 600}" height="10" fill="#2e2448"/><ellipse cx="540" cy="1560" rx="620" ry="120" fill="#2a1a40" opacity="0.8"/>` + wash(540, 1400, 600, 200, '#ff4fd8', 0.12);
      // the floor lamp (right) and a plant (left)
      let lamp = `<rect x="976" y="760" width="10" height="680" fill="#0c0a14"/><path d="M920 760 L1040 760 L1010 680 L950 680 Z" fill="#f0c890" stroke="${INK}" stroke-width="4"/>` + wash(980, 760, 200, 160, '#ffcf8a', 0.35);
      lamp += `<path d="M60 1440 L140 1440 L130 1340 L70 1340 Z" fill="#3a2a20"/>` + [0, 1, 2, 3, 4, 5].map(i => `<path d="M100 1340 Q ${f1(40 + i * 18)} ${1200 - i * 20} ${f1(10 + i * 34)} ${1150 - (i % 3) * 30}" stroke="#1e5a3a" stroke-width="14" fill="none" stroke-linecap="round"/>`).join('');
      return { light: { dir: 1, rim: '#ff7ad8', key: '#c8b8ff' }, layers: [[0.08, sky], [0.45, room], [0.85, floor], [0.9, lamp]] };
    },

    // a walled scam compound in green hills at dusk (generic): concrete towers with grids of lit windows, a long wall with
    // razor wire, a steel gate in the middle, a watchtower (no weapon), floodlights sweeping. o.blackout 0..1 = power cut
    // (windows and lights go dark, stars come out); o.gate 0..1 = gate open; o.demolish 0..1 = two towers collapse into
    // dust; o.river = a river and bank in the foreground; o.sky = 'dusk' | 'night' | 'dawn'.
    sc38_compound(ctx, o = {}) {
      const t = ctx.t, r = R(3802), bo = o.blackout || 0, dm = o.demolish || 0, gt = o.gate || 0;
      const skyc = { dusk: ['#1a1a5a', '#a2307a', '#ff9a4a'], night: ['#050818', '#141a40', '#2a2a5a'], dawn: ['#2a3a7a', '#e2708a', '#ffcf7a'] }[o.sky || 'dusk'];
      let sky = `<defs><linearGradient id="sccsky${o.sky || 'dusk'}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${skyc[0]}"/><stop offset="0.55" stop-color="${skyc[1]}"/><stop offset="1" stop-color="${skyc[2]}"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#sccsky${o.sky || 'dusk'})"/>`;
      sky += E.cine.stars(t, 50, 3803, -200, 600).replace(/opacity="([0-9.]+)"/g, (m, v) => `opacity="${f1(v * (0.3 + 0.7 * bo + (o.sky === 'night' ? 0.5 : 0)))}"`);
      // jungle hills, layered
      let hills = '';
      [['#1e4a3a', 640, 0.0], ['#173a2e', 720, 1.7], ['#0f2a22', 800, 3.1]].forEach(([c, y0, ph]) => { let d = `M-300 ${y0 + 400}`; for (let x = -300; x <= W + 300; x += 60) d += ` L${x} ${f1(y0 + 60 * Math.sin(x * 0.006 + ph) + 30 * Math.sin(x * 0.017 + ph * 2))}`; hills += `<path d="${d} L${W + 300} ${y0 + 400} Z" fill="${c}"/>`; });
      for (let i = 0; i < 30; i++) { const x = -260 + r() * 1600, y = 760 + r() * 120; hills += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(22 + r() * 30)}" fill="#0c2a1e"/>`; }
      // the towers behind the wall: concrete blocks, grids of windows lit blue/white (monitors) and warm
      const towers = [[-40, 230, 520], [210, 250, 300], [470, 210, 420], [690, 260, 250], [960, 240, 470]];
      let bld = '';
      towers.forEach(([x, w, top], i) => {
        const fall = (i === 1 || i === 3) ? ease.in(seg(dm, i === 1 ? 0 : 0.15, i === 1 ? 0.75 : 0.95)) : 0; if (fall >= 1) return;
        const dy = fall * (940 - top); const id = 'scct' + i;
        bld += `<defs><clipPath id="${id}"><rect x="${x - 40}" y="-400" width="${w + 80}" height="1340"/></clipPath></defs><g clip-path="url(#${id})"><g transform="translate(${f1((r() - 0.5) * 8 * fall)} ${f1(dy)})">`;
        bld += `<rect x="${x}" y="${top}" width="${w}" height="${960 - top}" fill="${i % 2 ? '#6a6a7a' : '#7a7888'}" stroke="${INK}" stroke-width="5"/><rect x="${x}" y="${top}" width="${w}" height="16" fill="#9a98aa"/>`;
        for (let yy = top + 40; yy < 920; yy += 52) for (let xx = x + 18; xx < x + w - 30; xx += 44) {
          const lit = r(); const on = (lit > 0.18 ? 1 : 0) * (1 - bo) * (lit < 0.9 ? (0.75 + 0.25 * Math.sin(t * (2 + lit * 6) + xx * 0.1 + yy)) : 1);
          bld += `<rect x="${xx}" y="${yy}" width="28" height="32" fill="#1a1e2c"/>` + (on > 0.02 ? `<rect x="${xx}" y="${yy}" width="28" height="32" fill="${lit > 0.6 ? '#bfe6ff' : (lit > 0.35 ? '#6ab8ff' : '#ffd98a')}" opacity="${f1(on * 0.9)}"/>` : '');
        }
        bld += `</g></g>`;
        if (bo < 0.9) bld += wash(x + w / 2, top + 200, w * 0.8, 260, '#6ab8ff', f1(0.12 * (1 - bo) * (1 - fall)));
      });
      // the dust of the demolition rises from behind the wall
      if (dm > 0) bld += dust(330, 960, Math.min(1, dm * 1.6) * (1 - seg(dm, 0.9, 1) * 0.3), t, 3804) + dust(820, 960, Math.min(1, Math.max(0, dm - 0.15) * 1.6), t, 3805, '#cdb6a0');
      // the wall with razor wire, the gate (two leaves slide apart), the watchtower, floodlights
      let wall = `<rect x="-300" y="900" width="${W + 600}" height="190" fill="#8a8494"/><rect x="-300" y="890" width="${W + 600}" height="20" fill="#a8a2b2" stroke="${INK}" stroke-width="3"/>`;
      for (let x = -300; x < W + 300; x += 160) wall += `<path d="M${x} 910 L${x} 1090" stroke="#6a6474" stroke-width="3"/>` + `<rect x="${x + 30}" y="960" width="${40 + (x * 7 % 30)}" height="${50 + (x * 3 % 50)}" fill="#5a5464" opacity="0.25"/>`;
      for (let x = -300; x < W + 300; x += 36) wall += `<ellipse cx="${x}" cy="872" rx="22" ry="20" fill="none" stroke="#c8ccd6" stroke-width="3"/>`;
      wall += [-300, 0, 300, 600, 900, 1200].map(x => `<rect x="${x}" y="840" width="8" height="54" fill="#4a4e5a"/>`).join('');
      const gw = 110 * gt;
      wall += `<rect x="430" y="900" width="220" height="190" fill="#1a1622"/>` + (bo < 1 ? wash(540, 1000, 120, 90, '#ffd98a', f1(0.3 * (1 - bo) * gt)) : '');
      wall += `<rect x="${f1(430 - gw)}" y="905" width="110" height="185" fill="#4a5262" stroke="${INK}" stroke-width="5"/><rect x="${f1(540 + gw)}" y="905" width="110" height="185" fill="#4a5262" stroke="${INK}" stroke-width="5"/>`;
      for (let i = 0; i < 5; i++) wall += `<path d="M${f1(440 - gw + i * 22)} 910 L${f1(440 - gw + i * 22)} 1084 M${f1(550 + gw + i * 22)} 910 L${f1(550 + gw + i * 22)} 1084" stroke="#2e3440" stroke-width="5"/>`;
      // the watchtower (right), a floodlight on top; beams sweep while the power is on
      let tower = `<path d="M1150 1090 L1180 640 L1260 640 L1290 1090" stroke="#2a2a36" stroke-width="12" fill="none"/><path d="M1160 950 L1280 820 M1280 950 L1160 820" stroke="#2a2a36" stroke-width="6"/><rect x="1140" y="580" width="160" height="70" fill="#3a3a48" stroke="${INK}" stroke-width="5"/><path d="M1130 580 L1310 580 L1220 530 Z" fill="#2a2a36"/>`;
      if (bo < 1) { const a = Math.sin(t * 0.7) * 26 - 150, a2 = Math.sin(t * 0.55 + 2) * 24 - 30; [[1160, 610, a], [-80, 700, a2]].forEach(([lx, ly, ang]) => { const rr = ang * Math.PI / 180; tower += `<path d="M${lx} ${ly} L${f1(lx + Math.cos(rr - 0.1) * 1500)} ${f1(ly + Math.sin(rr - 0.1) * 1500 + 700)} L${f1(lx + Math.cos(rr + 0.1) * 1500)} ${f1(ly + Math.sin(rr + 0.1) * 1500 + 700)} Z" fill="#fff6d0" opacity="${f1(0.1 * (1 - bo))}"/>`; }); tower += `<circle cx="1160" cy="610" r="16" fill="#fff6d0" opacity="${f1(1 - bo)}"/>` + wash(1160, 610, 80, 60, '#fff6d0', f1(0.5 * (1 - bo))); }
      // the ground: a dirt road out of the gate; or a river (Thailand side is off to the right)
      let ground = `<rect x="-300" y="1090" width="${W + 600}" height="${H}" fill="#3a2e2a"/><path d="M430 1090 L650 1090 L1000 ${H} L80 ${H} Z" fill="#5a4636" opacity="0.8"/>` + wash(540, 1150, 500, 80, '#ffb070', 0.18 * (1 - bo));
      for (let i = 0; i < 26; i++) { const px = -200 + r() * 1500, py = 1110 + r() * 800; ground += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(10 + r() * 30)}" ry="${f1(4 + r() * 6)}" fill="#2a201c" opacity="0.6"/>`; }
      if (o.river) {
        ground += `<path d="M-300 1300 Q 300 1270 ${W + 300} 1320 L${W + 300} ${H} L-300 ${H} Z" fill="#2a5a6a"/><path d="M-300 1300 Q 300 1270 ${W + 300} 1320" stroke="#c8b090" stroke-width="16" fill="none"/>` + wash(540, 1500, 700, 200, '#ffb070', 0.25);
        for (let i = 0; i < 18; i++) { const px = -200 + r() * 1500, py = 1360 + r() * 520, ph = (t * 0.6 + r()) % 1; ground += `<path d="M${f1(px - 60 - ph * 40)} ${f1(py)} Q ${f1(px)} ${f1(py - 8)} ${f1(px + 60 + ph * 40)} ${f1(py)}" stroke="#bfe6ff" stroke-width="3" fill="none" opacity="${f1(0.4 * (1 - ph))}"/>`; }
      }
      const layers = [[0.05, sky], [0.2, hills], [0.4, bld], [0.5, wall], [0.55, tower], [1.0, ground]];
      if (o.fence) layers.push([1.15, fence(o.fenceY || 1180, t, o.fence)]);
      return { light: { dir: -1, rim: bo > 0.5 ? '#8aa0ff' : '#ffb0d0', key: '#ffd8e0' }, layers };
    },

    // the scam floor (generic): an open-plan room at night, fluorescent tubes in perspective, barred windows, a back wall of
    // racks holding rows of phones (screens glowing), rows of desks with monitors receding.
    sc38_floor(ctx, o = {}) {
      const t = ctx.t, r = R(3807);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#141a2a"/><path d="M-300 -300 L${W + 300} -300 L${W - 100} 360 L100 360 Z" fill="#1c2236"/>`;
      for (let i = 0; i < 4; i++) { const yy = -120 + i * 120, ww = 520 - i * 80; back += `<rect x="${540 - ww / 2 - 260 + i * 60}" y="${yy}" width="${ww * 0.7}" height="14" rx="7" fill="#e8f4ff" opacity="${f1(0.85 + 0.15 * Math.sin(t * 40 + i))}"/><rect x="${540 + 260 - i * 60 - ww * 0.7}" y="${yy}" width="${ww * 0.7}" height="14" rx="7" fill="#e8f4ff" opacity="0.9"/>`; }
      back += wash(540, 200, 700, 260, '#bfe6ff', 0.18);
      // the back wall: barred windows (night outside), racks of phones
      let wall = `<rect x="-300" y="360" width="${W + 600}" height="540" fill="#2a3048"/>`;
      [[-80, 400], [880, 400]].forEach(([x, y]) => { wall += `<rect x="${x}" y="${y}" width="260" height="220" fill="#0a0c1c" stroke="${INK}" stroke-width="6"/>` + [1, 2, 3, 4, 5].map(i => `<rect x="${x + i * 43 - 4}" y="${y}" width="8" height="220" fill="#5a6070"/>`).join('') + E.cine.stars(t, 6, 3808 + x, y + 20, y + 120).replace(/<circle cx="([0-9.-]+)"/g, (m, v) => `<circle cx="${f1(x + 20 + (Math.abs(parseFloat(v)) % 220))}"`); });
      wall += `<rect x="220" y="400" width="640" height="440" fill="#1a1e2e" stroke="${INK}" stroke-width="6"/>`;
      for (let row = 0; row < 6; row++) for (let c = 0; c < 14; c++) { const x = 240 + c * 44, y = 416 + row * 70, k = r(); wall += `<rect x="${x}" y="${y}" width="32" height="56" rx="5" fill="#0a0c14"/><rect x="${x + 3}" y="${y + 4}" width="26" height="46" rx="3" fill="${k > 0.5 ? '#6ab8ff' : (k > 0.2 ? '#bfe6ff' : '#ff6ab8')}" opacity="${f1(0.45 + 0.4 * Math.max(0, Math.sin(t * (1 + k * 3) + row + c)))}"/>`; }
      wall += wash(540, 620, 360, 260, '#6ab8ff', 0.2);
      // rows of desks receding (mid-ground), each with glowing monitors and dark seated shapes (no faces)
      let rows = '';
      [[880, 0.5], [960, 0.62], [1060, 0.78]].forEach(([y, s], j) => {
        rows += `<rect x="-300" y="${y}" width="${W + 600}" height="${f1(26 * s)}" fill="#4a5068"/>`;
        for (let x = -220 + j * 40; x < W + 200; x += 220 * s) { rows += `<rect x="${f1(x)}" y="${f1(y - 110 * s)}" width="${f1(150 * s)}" height="${f1(96 * s)}" rx="6" fill="#0a0c14"/><rect x="${f1(x + 8 * s)}" y="${f1(y - 102 * s)}" width="${f1(134 * s)}" height="${f1(80 * s)}" fill="#6ab8ff" opacity="${f1(0.6 + 0.3 * Math.sin(t * 3 + x))}"/><rect x="${f1(x + 60 * s)}" y="${f1(y - 14 * s)}" width="${f1(30 * s)}" height="${f1(14 * s)}" fill="#2a2e3a"/>`;
          if ((Math.round(x) + j) % 3 !== 0) rows += `<ellipse cx="${f1(x + 75 * s)}" cy="${f1(y - 120 * s)}" rx="${f1(30 * s)}" ry="${f1(36 * s)}" fill="#0c0e18"/><path d="M${f1(x + 20 * s)} ${f1(y + 4)} Q ${f1(x + 75 * s)} ${f1(y - 120 * s)} ${f1(x + 130 * s)} ${f1(y + 4)} Z" fill="#0c0e18"/>`; }
      });
      let floor = `<rect x="-300" y="1100" width="${W + 600}" height="${H}" fill="#1a1e2c"/>` + [0, 1, 2, 3, 4, 5].map(i => `<path d="M${-300 + i * 340} 1100 L${-900 + i * 620} ${H}" stroke="#2a3044" stroke-width="3"/>`).join('') + wash(540, 1200, 700, 160, '#6ab8ff', 0.16);
      return { light: { dir: 1, rim: '#8ad0ff', key: '#d8ecff' }, layers: [[0.1, back], [0.3, wall], [0.6, rows], [1.0, floor]] };
    }
  });

  // the hero phone's framing in the first and the last shot (the loop): big and centred
  const HERO = { x: 540, y: 660, s: 0.86 };
  const VIEWER = { id: 'sc38_viewer', x: 190, y: 1500, scale: 0.62, dir: 1, turn: 0.55, pose: 'stand', expr: 'focused', gaze: [0.8, -0.1], depth: 0.97 };
  // a foreground desk (the scam floor) at y with monitors, drawn over the seated figures' legs
  const desk = (y, t) => { let g = `<rect x="-300" y="${y}" width="${W + 600}" height="40" fill="#5a6078" stroke="${INK}" stroke-width="4"/><rect x="-300" y="${y + 40}" width="${W + 600}" height="400" fill="#2a2e40"/>`;
    [80, 470, 860].forEach((x, i) => { g += `<rect x="${x}" y="${y - 250}" width="250" height="170" rx="10" fill="#0a0c14" stroke="${INK}" stroke-width="5"/><rect x="${x + 12}" y="${y - 238}" width="226" height="140" fill="#2a5aa0"/>` +
      [0, 1, 2, 3].map(j => `<rect x="${x + 26}" y="${y - 224 + j * 30}" width="${f1(110 + 80 * Math.abs(Math.sin(t * 2 + i + j)))}" height="16" rx="8" fill="${j % 2 ? '#bfe6ff' : '#ffffff'}" opacity="0.8"/>`).join('') +
      `<rect x="${x + 110}" y="${y - 80}" width="30" height="80" fill="#2a2e3a"/><rect x="${x + 150}" y="${y - 30}" width="40" height="28" rx="4" fill="#0a0c14"/><rect x="${x + 154}" y="${y - 26}" width="32" height="20" rx="3" fill="#ff6ab8" opacity="${f1(0.5 + 0.5 * Math.sin(t * 5 + i))}"/>`; });
    return g; };

  E.registerScenes({
    // 1 - hook: the hero phone in a night apartment, a friendly "wrong number" chat on screen; a young man reads on the sofa
    //     behind. The headline is burned in by the engine (until ~3.2 s); nothing else sits in y 380-720 before then.
    sc38_hook(ctx) {
      const t = ctx.t, my = WT(ctx, 0, 4, 0.8), crime = WT(ctx, 0, 11, 2.7), l1 = LS(ctx, 1, 3.8), tx = WT(ctx, 1, 5, 4.8), you = WT(ctx, 1, 6, 5.1);
      const v = { ...VIEWER, keys: [{ at: crime, pose: 'stand_tense', expr: 'worried', dur: 0.4 }, { at: tx, pose: 'hand_to_face', expr: 'shocked', gaze: [0.7, -0.2], dur: 0.4 }] };
      return E.cine.shot(ctx, {
        set: 'sc38_flat', grade: 'neon',
        cam: { from: { x: 0, y: 20, z: 1.0 }, to: { x: 10, y: 50, z: 1.08 }, handheld: 0.4 },
        shake: [{ at: tx, amp: 3 }],
        figures: [v],
        props: [{ depth: 0.96, svg: () => `<path d="M-120 1300 L520 1300 L520 1500 L-120 1500 Z" fill="#3a2a5a" stroke="${INK}" stroke-width="5"/><rect x="-120" y="1140" width="640" height="170" rx="30" fill="#4a3870" stroke="${INK}" stroke-width="5"/><rect x="-120" y="1290" width="660" height="70" rx="20" fill="#5a4684" stroke="${INK}" stroke-width="5"/>` },
          { depth: 1.05, svg: tt => phone(HERO.x, HERO.y, HERO.s, tt, { msgs: HERO_MSGS, glow: 0.85 * seg(tt, tx - 0.1, tx + 0.3) * (1 - seg(tt, you + 0.6, you + 1.2)), ping: l1 + 0.6 }) }],
        overlays: [{ type: 'impact', at: tx, x: 540, y: 1000, colour: HL }],
        tag: TAG
      });
    },

    // 2 - where: the map fly-in, Asia to the Myanmar-Thailand border; Myanmar glows; the pin lands on Myawaddy
    sc38_map(ctx) {
      const T = ctx.T, cmp = WT(ctx, 0, 1, 0.3), mya = WT(ctx, 0, 4, 1.1), th = WT(ctx, 0, 7, 2.2);
      return E.cine.shot(ctx, {
        set: 'mapflight', grade: 'tokyo',
        setOpts: { geo: 'asia', from: { center: [104, 24], span: 56 }, to: { center: [98.35, 16.75], span: 3.2 }, t0: 0.05, t1: Math.max(mya + 0.3, T - 0.6),
          country: 'Myanmar', hl: HL, country_at: 0.3, pin: { ll: [98.51, 16.69], label: 'MYAWADDY', at: mya - 0.1, dx: 40, dy: 16, anchor: 'start', fs: 50 },
          labels: [{ ll: [96.0, 21.5], text: 'MYANMAR', at: 0.3, fs: 48 }, { ll: [101.0, 15.6], text: 'THAILAND', at: 0.5, fs: 48 }, { ll: [104, 34], text: 'CHINA', at: 0.15, fs: 44 },
            { ll: [98.1, 16.98], text: 'SHWE KOKKO', at: mya + 0.3, fs: 38 }, { ll: [98.2, 16.42], text: 'KK PARK', at: mya + 0.5, fs: 38 }] },
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 0, z: 1.04 }, handheld: 0.3 },
        overlays: [{ type: 'label', at: cmp, x: 60, y: 432, text: 'MYANMAR–THAILAND BORDER', fs: 42, sub: 'Scam compounds near Myawaddy' }],
        tag: 'ILLUSTRATION · MAP, NATURAL EARTH DATA'
      });
    },

    // 3 - the stakes: the compound at dusk behind a chain-link fence; three workers in the yard; the count-up to 120,000
    sc38_count(ctx) {
      const t = ctx.t, un = WT(ctx, 0, 1, 0.1), n120 = WT(ctx, 0, 6, 1.3), ppl = WT(ctx, 0, 7, 2.3), tr = WT(ctx, 0, 10, 2.9);
      return E.cine.shot(ctx, {
        set: 'sc38_compound', setOpts: { sky: 'dusk', fence: 1, fenceY: 1200 }, grade: 'jungle',
        cam: { from: { x: -30, y: 10, z: 1.0 }, to: { x: 30, y: 40, z: 1.1 }, handheld: 0.4 },
        shake: [{ at: tr, amp: 3 }],
        figures: [
          { id: 'sc38_worker_a', x: 330, y: 1560, scale: 0.66, dir: 1, turn: 0.4, pose: 'bowed', expr: 'sad', depth: 1.0,
            keys: [{ at: n120, pose: 'stand', expr: 'worried', gaze: [0.3, -0.6], dur: 0.5 }, { at: tr, pose: 'hands_together', expr: 'sad', dur: 0.5 }] },
          { id: 'sc38_worker_b', x: 600, y: 1520, scale: 0.6, dir: -1, turn: 0.45, pose: 'stand', expr: 'worried', depth: 1.0,
            keys: [{ at: ppl, pose: 'hand_to_face', expr: 'distraught', dur: 0.45 }] },
          { id: 'sc38_worker_c', x: 820, y: 1580, scale: 0.68, dir: -1, turn: 0.5, pose: 'arms_crossed', expr: 'sad', depth: 1.0,
            keys: [{ at: un, pose: 'stand_tense', expr: 'worried', gaze: [0.2, -0.5], dur: 0.45 }, { at: tr, pose: 'bowed', expr: 'sad', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'counter', at: n120 - 0.1, dur: 1.4, from: 0, to: 120000, prefix: '', label: 'PEOPLE MAY BE TRAPPED · U.N. 2023', y: 600, fs: 140, colour: '#5fffa0' },
          { type: 'impact', at: n120 + 1.3, x: 540, y: 540, colour: YEL }
        ],
        tag: TAG
      });
    },

    // 4 - the lure: a young man with a backpack walks to the lit gate at night, reading a job offer on his phone; he goes
    //     in and the gate slides shut behind him
    sc38_lure(ctx) {
      const t = ctx.t, lu = WT(ctx, 0, 2, 0.4), fk = WT(ctx, 0, 4, 0.8), ads = WT(ctx, 0, 6, 1.5), tr = WT(ctx, 0, 8, 2.1), ins = WT(ctx, 0, 9, 2.5);
      const wk = { id: 'sc38_worker_a', x: 120, y: 1560, scale: 0.72, dir: 1, turn: 0.5, pose: 'read', expr: 'relieved', depth: 1.0,
        walk: { from: 120, to: 520, at: ads - 0.6, dur: Math.max(0.8, tr - ads + 0.5), cadence: 6 }, show: [-1, tr + 0.5],
        keys: [{ at: ads - 0.65, pose: 'walk', expr: 'neutral', dur: 0.3 }] };
      const gate = tt => 1 - ease.inOut(seg(tt, tr + 0.1, ins + 0.5));
      return E.cine.shot(ctx, {
        set: 'sc38_compound', setOpts: { sky: 'night', gate: gate(t) }, grade: 'night',
        cam: { from: { x: -60, y: 60, z: 1.08 }, to: { x: 10, y: 80, z: 1.2 }, handheld: 0.45 },
        shake: [{ at: ins, amp: 4 }],
        figures: [wk],
        props: [{ depth: 0.99, svg: tt => { const x = walkerX(wk, tt) - 16; const vis = 1 - seg(tt, tr + 0.2, tr + 0.5); return vis > 0 ? `<g opacity="${f1(vis)}"><rect x="${f1(x - 90)}" y="${f1(1560 - 0.72 * 700)}" width="70" height="120" rx="20" fill="#3a5a8a" stroke="${INK}" stroke-width="4"/></g>` : ''; } }],
        overlays: [
          { type: 'card', at: fk - 0.1, x: 60, y: 390, w: 800, rows: [{ text: 'THE BAIT: A FAKE JOB OFFER', fs: 38, colour: RED }, { text: 'THEN TRAFFICKED AND HELD', fs: 32, at: tr - 0.1 }, { text: 'THE U.N. CALLS THEM VICTIMS', fs: 26, colour: MUTE, at: ins + 0.1 }] },
          { type: 'stamp', at: ins, x: 540, y: 960, text: 'TRAPPED', scale: 1.4, colour: '#e5372b' }
        ],
        tag: TAG
      });
    },

    // 5 - the work: the scam floor; three workers type at a desk of monitors in the foreground; the script in three steps
    sc38_floor(ctx) {
      const t = ctx.t, job = WT(ctx, 0, 1, 0.2), tx = WT(ctx, 0, 2, 0.7), act = WT(ctx, 0, 4, 1.7), cr = WT(ctx, 0, 6, 2.4), cry = WT(ctx, 0, 8, 2.9);
      const typing = (from, to, step = 0.2, ph = 0) => { const k = []; let i = ph; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? 'sit_type_b' : 'sit_type', dur: step * 0.8 }); return k; };
      const steps = [['1  TEXT A STRANGER', tx], ['2  ACT FRIENDLY', act], ['3  TALK CRYPTO', cr]];
      const stepsSvg = tt => { let g = ''; steps.forEach(([s, at], i) => { const q = ease.back(seg(tt, at - 0.05, at + 0.3)); if (q <= 0) return; const y = 420 + i * 110, x = 80 + i * 60, hot = i === 2;
        g += `<g transform="translate(${x} ${y}) scale(${sc(Math.max(0.001, q))})"><rect x="0" y="0" width="${s.length * 30 + 60}" height="84" rx="42" fill="${hot ? '#ff3b5c' : '#2f7bff'}" stroke="#0b0b0d" stroke-width="4"/><path d="M40 84 L30 110 L70 84 Z" fill="${hot ? '#ff3b5c' : '#2f7bff'}"/><text x="30" y="56" ${FONT} font-size="40" fill="#fff">${esc(s)}</text></g>`; }); return g; };
      return E.cine.shot(ctx, {
        set: 'sc38_floor', grade: 'cold',
        cam: { from: { x: 30, y: 0, z: 1.0 }, to: { x: -30, y: 30, z: 1.1 }, handheld: 0.4 },
        shake: [{ at: cry, amp: 3 }],
        figures: [
          { id: 'sc38_worker_b', x: 230, y: 1620, scale: 0.78, dir: 1, turn: 0.6, pose: 'sit_type', expr: 'blank', depth: 1.0, keys: [...typing(0.05, cr), { at: cr, pose: 'sit_slumped', expr: 'sad', dur: 0.4 }] },
          { id: 'sc38_worker_a', x: 600, y: 1620, scale: 0.78, dir: 1, turn: 0.6, pose: 'sit_type', expr: 'blank', depth: 1.0, keys: typing(0.1, T(ctx), 0.24, 1) },
          { id: 'sc38_worker_c', x: 960, y: 1620, scale: 0.8, dir: -1, turn: 0.6, pose: 'sit_type', expr: 'blank', depth: 1.0, keys: [...typing(0.0, act), { at: act, pose: 'sit_slumped', expr: 'sad', dur: 0.5 }] }
        ],
        props: [{ depth: 1.02, svg: tt => desk(1400, tt) }],
        overlays: [{ type: 'svg', at: tx - 0.1, svg: tt => stepsSvg(tt) }],
        tag: TAG
      });
    },

    // 6 - THE HOW: pig butchering. A woman at her kitchen table; the fake trading app (foreground) climbs, then the
    //     withdrawal fails (impact). Music drop.
    sc38_app(ctx) {
      const t = ctx.t, pig = WT(ctx, 0, 2, 0.4), l1 = LS(ctx, 1, 1.6), pro = WT(ctx, 1, 1, 1.9), fk2 = WT(ctx, 1, 4, 2.5), app = WT(ctx, 1, 5, 2.8), cash = WT(ctx, 1, 10, 3.6), out = WT(ctx, 1, 11, 3.9);
      const a = { rise0: l1 - 0.3, rise1: app + 0.2, fail: cash };
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'warm',
        cam: { keys: [{ at: 0, x: -20, y: 20, z: 1.0 }, { at: 0.1, x: 20, y: 40, z: 1.06, dur: Math.max(0.5, cash - 0.2) }, { at: cash, x: 40, y: 70, z: 1.14, dur: 0.6 }], handheld: 0.5 },
        shake: [{ at: cash + 0.1, amp: 7 }],
        figures: [{ id: 'sc38_victim', x: 250, y: 1640, scale: 0.86, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'relieved', depth: 1.0,
          keys: [{ at: pro, pose: 'sit_type_b', expr: 'relieved', dur: 0.3 }, { at: app, pose: 'sit_type', expr: 'focused', dur: 0.3 }, { at: cash + 0.05, pose: 'hand_to_face', expr: 'shocked', dur: 0.3 }, { at: out + 0.4, pose: 'sit_slumped', expr: 'distraught', dur: 0.5 }] }],
        props: [{ depth: 1.0, svg: () => `<rect x="-300" y="1330" width="1000" height="40" fill="#6a4a30" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1370" width="1000" height="500" fill="#3a2818"/><rect x="380" y="1300" width="40" height="34" rx="4" fill="#e8e0d0" stroke="${INK}" stroke-width="3"/>` },
          { depth: 1.08, svg: tt => phone(790, 600, 0.82, tt, { app: st => fakeApp(st, a), halo: '#27d07a', tilt: 4, glow: 0.8 * seg(tt, fk2 - 0.1, fk2 + 0.3) * (1 - seg(tt, cash - 0.2, cash)) }) }],
        overlays: [
          { type: 'card', at: pig - 0.15, until: cash - 0.4, x: 40, y: 390, w: 560, rows: [{ text: '"PIG BUTCHERING"', fs: 40, colour: RED }, { text: 'ROMANCE + INVESTMENT', fs: 28, at: pig + 0.4 }, { text: 'SCAM (FBI)', fs: 28, at: pig + 0.5 }] },
          { type: 'stamp', at: fk2, until: cash - 0.2, x: 300, y: 1000, text: 'FAKE', scale: 1.3, colour: '#e5372b' },
          { type: 'impact', at: cash + 0.05, x: 790, y: 1000, colour: HL }
        ],
        tag: TAG
      });
    },

    // 7 - the scale in America: a cyber-crime unit; an analyst types, an agent points at the wall; the $5.8 billion count-up
    sc38_fbi(ctx) {
      const t = ctx.t, am = WT(ctx, 0, 0, 0.1), los = WT(ctx, 0, 2, 0.9), n58 = WT(ctx, 0, 3, 1.2), bil = WT(ctx, 0, 4, 1.9), cr = WT(ctx, 0, 6, 2.8), yr = WT(ctx, 0, 10, 4.4);
      const typing = (from, to, step = 0.22) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? 'sit_type_b' : 'sit_type', dur: step * 0.8 }); return k; };
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'night', dust: true,
        cam: { from: { x: 30, y: -10, z: 1.0 }, to: { x: -30, y: -30, z: 1.1 }, handheld: 0.4 },
        shake: [{ at: bil, amp: 4 }],
        figures: [
          { id: 'agent_b', x: 800, y: 1640, scale: 0.98, dir: -1, turn: 0.55, pose: 'stand', expr: 'focused',
            keys: [{ at: n58, pose: 'point', expr: 'determined', gaze: [0.9, -0.5], headTurn: 0.3, dur: 0.4 }, { at: cr + 0.3, pose: 'arms_crossed', expr: 'stern', dur: 0.45 }] },
          { id: 'analyst', x: 380, y: 1660, scale: 0.94, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', keys: [...typing(0.05, los), { at: los, pose: 'sit_read', expr: 'shocked', dur: 0.4 }, ...typing(cr, yr)] }
        ],
        overlays: [
          { type: 'counter', at: n58 - 0.1, until: cr - 0.3, dur: 1.4, from: 0, to: 5800000000, prefix: '$', label: 'U.S. CRYPTO INVESTMENT FRAUD, 2024', y: 560, fs: 112, colour: '#5fd4ff' },
          { type: 'card', at: cr, x: 60, y: 420, w: 760, rows: [{ text: 'SOURCE: FBI IC3 REPORT, 2024', fs: 30, colour: RED }, { text: "MUCH OF IT 'PIG BUTCHERING'", fs: 30, at: cr + 0.5 }] },
          { type: 'impact', at: bil, x: 540, y: 520, colour: YEL }
        ],
        tag: 'ILLUSTRATION · GENERIC INVESTIGATORS'
      });
    },

    // 8 - the crackdown: the compound at night; on "power" the windows and floodlights die; the gate opens and people
    //     walk out, free
    sc38_cutoff(ctx) {
      const t = ctx.t, y25 = WT(ctx, 0, 1, 0.2), th = WT(ctx, 0, 2, 1.2), pw = WT(ctx, 0, 4, 1.8), ths = WT(ctx, 0, 9, 2.9), fr = WT(ctx, 0, 11, 3.5);
      const bo = seg(t, pw - 0.05, pw + 0.25), gate = ease.inOut(seg(t, ths - 0.5, ths + 0.3));
      const walker = (id, from, to, at, sc_, y) => ({ id, x: from, y, scale: sc_, dir: 1, turn: 0.5, pose: 'walk', expr: 'relieved', depth: 1.0, show: [at - 0.1], walk: { from, to, at, dur: 2.4, cadence: 6 } });
      return E.cine.shot(ctx, {
        set: 'sc38_compound', setOpts: { sky: 'night', blackout: bo, gate }, grade: 'night',
        cam: { from: { x: 30, y: 30, z: 1.04 }, to: { x: -20, y: 60, z: 1.12 }, handheld: 0.4 },
        shake: [{ at: pw, amp: 5 }],
        figures: [
          { id: 'sc38_worker_c', x: 900, y: 1660, scale: 0.84, dir: -1, turn: 0.5, pose: 'stand_tense', expr: 'worried', depth: 1.0,
            keys: [{ at: pw + 0.1, pose: 'hand_to_face', expr: 'shocked', gaze: [0.2, -0.6], dur: 0.35 }, { at: fr, pose: 'point', expr: 'relieved', gaze: [-0.8, -0.2], dur: 0.4 }] },
          walker('sc38_worker_b', 500, 760, ths - 0.1, 0.62, 1420),
          walker('sc38_worker_a', 470, 640, ths + 0.3, 0.58, 1380)
        ],
        overlays: [
          { type: 'card', at: y25 - 0.1, x: 60, y: 390, w: 860, rows: [{ text: 'FEB 2025: THAILAND CUTS POWER,', fs: 32, colour: RED }, { text: 'FUEL AND INTERNET TO THE HUBS', fs: 32, colour: RED }, { text: '~7,000 FREED (BORDER GUARD FIGURE)', fs: 28, at: ths - 0.1 }, { text: 'MAY 2025: U.S. SANCTIONS A LOCAL MILITIA, WHICH DENIES IT', fs: 20, colour: MUTE, at: fr }] },
          { type: 'impact', at: pw, x: 540, y: 700, colour: '#7a6bff' }
        ],
        tag: TAG
      });
    },

    // 9 - the raid: dawn; two towers of KK Park collapse into dust behind the wall; people cross the river toward Thailand
    //     (off right); the fun fact; the status card
    sc38_raid(ctx) {
      const t = ctx.t, T = ctx.T, my = WT(ctx, 0, 1, 0.3), ar = WT(ctx, 0, 2, 0.8), rd = WT(ctx, 0, 3, 1.1), kk = WT(ctx, 0, 4, 1.4), bl = WT(ctx, 0, 7, 2.5), bu = WT(ctx, 0, 9, 2.8);
      const dm = seg(t, bl - 0.15, bl + 1.3);
      return E.cine.shot(ctx, {
        set: 'sc38_compound', setOpts: { sky: 'dawn', demolish: dm, river: true }, grade: 'dawn',
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 30, y: 50, z: 1.1 }, handheld: 0.55 },
        shake: [{ at: bl, amp: 9 }, { at: bl + 0.6, amp: 4 }],
        figures: [
          { id: 'sc38_worker_a', x: 160, y: 1700, scale: 0.8, dir: 1, turn: 0.5, pose: 'walk', expr: 'worried', depth: 1.0, walk: { from: 160, to: 760, at: 0.0, dur: T, cadence: 5.5 } },
          { id: 'sc38_worker_b', x: -60, y: 1640, scale: 0.72, dir: 1, turn: 0.5, pose: 'walk', expr: 'worried', depth: 1.0, walk: { from: -60, to: 480, at: 0.2, dur: T, cadence: 5.5 },
            keys: [{ at: bl + 0.1, pose: 'hand_to_face', expr: 'shocked', dur: 0.3 }, { at: bl + 0.6, pose: 'walk', expr: 'worried', dur: 0.3 }] },
          { id: 'sc38_worker_c', x: 900, y: 1780, scale: 0.9, dir: -1, turn: 0.5, pose: 'stand', expr: 'worried', depth: 1.0,
            keys: [{ at: rd, pose: 'stand_tense', expr: 'worried', gaze: [-0.8, -0.4], dur: 0.35 }, { at: bl + 0.05, pose: 'hand_to_face', expr: 'shocked', gaze: [-0.8, -0.5], dur: 0.3 }] }
        ],
        overlays: [
          { type: 'label', at: my, until: bu + 0.5, x: 60, y: 1215, text: 'OCT 2025 · ARMY RAIDS KK PARK', fs: 40, sub: '1,500+ cross into Thailand (AP)' },
          { type: 'impact', at: bl, x: 420, y: 760, colour: HL },
          { type: 'funfact', at: kk + 0.2, y: 400, rows: [{ text: 'THE COMPOUNDS RAN ON SMUGGLED', fs: 38 }, { text: 'SATELLITE INTERNET: SPACEX SAID', fs: 38 }, { text: 'IT CUT OFF 2,500+ STARLINK KITS.', fs: 38, colour: YEL }] },
          { type: 'label', at: bu + 0.95, x: 60, y: 1215, text: 'STATUS, OCT 2026: RAIDS GO ON', fs: 34, colour: '#ffffff', sub: 'U.N.: the networks are spreading' }
        ],
        tag: TAG
      });
    },

    // 10 - the lesson card, then the callback on the hero phone in the first frame's framing; the end question is burned in
    //      over the last 3.2 s, so the lesson card has faded by then; the last frame loops to the first.
    sc38_end(ctx) {
      const t = ctx.t, T = ctx.T, les = WT(ctx, 0, 1, 0.2), str = WT(ctx, 0, 3, 0.8), cry = WT(ctx, 0, 10, 2.8), scam = WT(ctx, 0, 13, 3.6), l1 = LS(ctx, 1, 4.7), wr = WT(ctx, 1, 5, 5.6), num = WT(ctx, 1, 6, 5.9);
      const v = { ...VIEWER, keys: [{ at: str, pose: 'stand_tense', expr: 'focused', dur: 0.4 }, { at: scam, pose: 'arms_crossed', expr: 'stern', dur: 0.4 }, { at: wr, pose: 'stand', expr: 'determined', dur: 0.5 }] };
      const msgs = [...HERO_MSGS, { lines: ['My uncle trades crypto.', 'Want me to show you? 📈'], side: 'in', at: cry - 0.1, fs: 28, hot: HL }];
      return E.cine.shot(ctx, {
        set: 'sc38_flat', grade: 'tokyo',
        cam: { from: { x: 10, y: 50, z: 1.08 }, to: { x: 0, y: 20, z: 1.0 }, handheld: 0.4 },
        figures: [v],
        props: [{ depth: 0.96, svg: () => `<path d="M-120 1300 L520 1300 L520 1500 L-120 1500 Z" fill="#3a2a5a" stroke="${INK}" stroke-width="5"/><rect x="-120" y="1140" width="640" height="170" rx="30" fill="#4a3870" stroke="${INK}" stroke-width="5"/><rect x="-120" y="1290" width="660" height="70" rx="20" fill="#5a4684" stroke="${INK}" stroke-width="5"/>` },
          { depth: 1.05, svg: tt => phone(HERO.x, HERO.y, HERO.s, tt, { msgs: tt < T - 3.4 ? msgs : HERO_MSGS, ping: cry - 0.1, glow: 0.85 * seg(tt, wr - 0.1, wr + 0.3) * (1 - seg(tt, num + 0.6, num + 1.2)) }) }],
        overlays: [
          { type: 'lesson', at: les - 0.15, until: T - 3.75, y: 400, rows: [{ text: 'TEXTS BY MISTAKE + GETS FRIENDLY', fs: 38 }, { text: '+ TALKS CRYPTO = A SCAM.', fs: 38 }, { text: 'NEVER MOVE MONEY TO AN APP', fs: 34, colour: '#9dffb0' }, { text: 'OR SITE THEY SUGGEST. (FBI)', fs: 34, colour: '#9dffb0' }] },
          { type: 'stamp', at: scam, until: T - 3.6, x: 540, y: 1180, text: 'SCAM', scale: 1.3, colour: '#e5372b' }
        ],
        tag: TAG
      });
    }
  });
  function T(ctx) { return ctx.T; }
})();
