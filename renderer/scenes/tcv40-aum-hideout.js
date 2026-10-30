/* Case File 40 ("Danger Zones" on the upgraded engine): the Tokyo subway sarin attack (20 March 1995) and the arrest of
   Aum Shinrikyo's leader, Shoko Asahara, found on 16 May 1995 in a tiny secret space inside a building ("Satian 6") of the
   cult's compound near Mount Fuji, after officers broke through a ceiling and a wall.
   Structure: a burned-in object-first headline over the HERO OBJECT (a narrow concealed wall panel with a small vent cover,
   in a dim compound corridor, lit by a police flashlight; big and centred in the first frame and again in the last, so the
   video loops); the map fly-in (Asia to Tokyo, Japan highlighted, a pin on Tokyo); the toll on a card at a closed subway
   entrance (no victims, no chemical); the cult (a tiny silhouette under Mount Fuji); the raids with caged canaries (the fun
   fact); the count-up of days (0 -> 57); THE HOW at ~60 % (the ceiling and the wall come away; impact; music drop); the
   irony (a cutaway of the cramped space between floors, the beam on a hunched silhouette; ARRESTED); the verdict (impact);
   the lesson card; the memorial line; the callback; a burned-in YES/NO end question.
   Look: episode.look = 'vivid' with grades that differ from Case File 36: night (blue-black + warm torch), cold map, neon
   red/blue station, dawn Fuji, jungle (gas-mask green) raid, warm incident room, neon wall break, tokyo violet cutaway,
   sepia court. Every shot has an eased camera move (cam.keys or from/to) plus handheld 0.3-0.6; flickering tubes, dust in
   the beams, drifting mist, pulsing beacons.
   Content rules:
   - The attack, the chemical, victims and injuries are NEVER shown. The station is a taped-off entrance with masked
     responders standing by; nobody is hurt on screen.
   - Shoko Asahara (convicted, executed) is ONLY a small anonymous rim-lit silhouette (ah40_guru), never posed heroically,
     never with followers, no cult symbol, text or belief anywhere. Tag: 'ILLUSTRATION · NOT A LIKENESS'.
   - Generic drawings only: no police insignia, no station signage or line logos (the sign box carries a plain coloured
     disc), no lettering on vehicles, no real building replicas.
   New environments (E.registerSets): ah40_hall (a dim corridor inside a compound building: plywood wall, conduit, a
   flickering tube, a ceiling hatch), ah40_cell (a cutaway: a room below, a broken ceiling, the cramped space between floors),
   ah40_compound (windowless white sheds in a field under Mount Fuji; o.grey for the raid morning, o.buses), ah40_station (a
   taped-off subway entrance at street level on a spring morning, red beacons). Plus the engine's mapflight, task_force and
   courtroom. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const YEL = '#ffd23f', RED = '#8e1f18', MUTE = '#6b665c', HL = '#ff3b5c', TORCH = '#fff2c4';
  const rad = a => a * Math.PI / 180;
  const pt = (x, y, ang, len, fx = 1) => [x + Math.sin(rad(ang)) * len * fx, y + Math.cos(rad(ang)) * len];

  // ---------- headgear drawn over a figure's head, following the figure rig's skeleton maths (hip -> shoulders -> neck ->
  // head) for the figure spec f at time t. kind: 'riot' (navy dome helmet, clear visor raised, face visible), 'mask' (a
  // full-face gas mask, no face visible) or 'riotmask' (both).
  function headgear(f, t, kind) {
    const st = E.fig.stateAt(f, t), P = st.P; const sp = E.state.cast[f.id] || {}; const dir = f.dir || 1;
    const s = (st.scale || 1) * (sp.height || 1); const turn = clamp(st.turn, 0, 1), FX = lerp(0.38, 1, turn);
    let x = st.x, y = st.y, bob = 0; let walking = false;
    if (f.walk) { const w = f.walk, u = clamp((t - w.at) / w.dur, 0, 1); x = lerp(w.from, w.to, u); walking = u > 0 && u < 1; if (walking) bob = -Math.abs(Math.sin((t - w.at) * (w.cadence || 6.2))) * 8; }
    let vis = 1; if (f.show) { vis = clamp((t - f.show[0]) / 0.3, 0, 1) * (f.show[1] !== undefined ? clamp((f.show[1] - t) / 0.3, 0, 1) : 1); if (vis <= 0) return ''; }
    const lean = P.lean + (walking ? 4 : 0), hipH = P.sit ? 440 : (P.kneel ? 310 : 470);
    const sh = pt(0, -hipH + bob, 180 - lean, 280, FX); const neck = pt(sh[0], sh[1], 180 - lean * 1.2, 34, FX); const hp = pt(neck[0], neck[1], 180 - lean * 1.4, 84, FX);
    const tilt = P.tilt, T = clamp((st.headTurn ?? 0) + turn, 0, 1), vx = 30 * T;
    let g = `<g opacity="${f1(vis)}" transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * dir)} ${sc(s)})"><g transform="translate(${f1(hp[0])} ${f1(hp[1] + 4)}) rotate(${f1(tilt)}) scale(1.08)">`;
    if (kind === 'mask' || kind === 'riotmask') {
      g += `<path d="M-60 -30 L-70 -10 M-62 10 L-72 26" stroke="#1a1c1e" stroke-width="9" fill="none"/>`;
      g += `<path d="M${f1(-52 + vx * 0.5)} -54 C${f1(-20 + vx)} -70 ${f1(52 + vx * 0.7)} -66 ${f1(64 + vx * 0.4)} -40 L${f1(68 + vx * 0.3)} 18 C${f1(58 + vx * 0.4)} 50 ${f1(30 + vx)} 64 ${f1(4 + vx)} 62 C${f1(-28 + vx * 0.6)} 60 -50 42 -56 10 Z" fill="#2c3032" stroke="${INK}" stroke-width="5"/>`;
      [[-16, -20], [30, -20]].forEach(([ex, ey], i) => { const xx = ex + vx * (i ? 0.7 : 1.1); g += `<circle cx="${f1(xx)}" cy="${ey}" r="17" fill="#1a2a30" stroke="#8a9296" stroke-width="5"/><path d="M${f1(xx - 8)} ${ey - 6} Q ${f1(xx)} ${ey - 12} ${f1(xx + 7)} ${ey - 6}" stroke="#cfe8ff" stroke-width="4" fill="none" opacity="0.8"/>`; });
      const cx = 8 + vx * 1.5; g += `<path d="M${f1(cx - 18)} 30 L${f1(cx + 18 + vx * 0.6)} 30 L${f1(cx + 24 + vx * 0.8)} 66 L${f1(cx - 14 + vx * 0.4)} 66 Z" fill="#3e4446" stroke="${INK}" stroke-width="4"/>` + [40, 50, 58].map(yy => `<path d="M${f1(cx - 12 + vx * 0.4)} ${yy} L${f1(cx + 18 + vx * 0.7)} ${yy}" stroke="#6a7276" stroke-width="3"/>`).join('');
    }
    if (kind === 'riot' || kind === 'riotmask') {
      g += `<path d="M-72 -22 C-76 -88 -38 -114 2 -114 C46 -114 80 -88 74 -22 Z" fill="#1c2a4a" stroke="${INK}" stroke-width="5"/>`;
      g += `<path d="M-48 -92 C-20 -110 30 -110 52 -96" stroke="#5a78b0" stroke-width="7" fill="none" opacity="0.7"/>`;
      g += `<rect x="-76" y="-32" width="152" height="14" rx="6" fill="#141e36" stroke="${INK}" stroke-width="3"/>`;
      g += `<path d="M-58 -96 Q 4 -134 68 -96 L64 -80 Q 4 -116 -54 -80 Z" fill="#bfe3ff" opacity="0.45" stroke="#e8f6ff" stroke-width="3"/>`;
      if (T > 0.3) g += `<path d="M${f1(-70 + vx * 0.2)} -24 L${f1(-80 + vx * 0.2)} 40 L${f1(-44)} 52 L-40 -20 Z" fill="#1a2644" stroke="${INK}" stroke-width="4"/>`;
    }
    return g + '</g></g>';
  }

  // a small canary cage (generic): top-ring hanging from (x, y); a yellow bird that hops
  function cage(x, y, t, k = 1) {
    if (k <= 0) return ''; const hop = Math.max(0, Math.sin(t * 5.3)) * 6;
    let g = `<g opacity="${f1(k)}" transform="translate(${f1(x)} ${f1(y)})"><circle cx="0" cy="-6" r="8" fill="none" stroke="#c8a24a" stroke-width="4"/>`;
    g += `<path d="M-40 70 L-40 20 Q-40 0 0 0 Q40 0 40 20 L40 70 Z" fill="#000" opacity="0.18"/>` + [-30, -15, 0, 15, 30].map(xx => `<path d="M${xx} ${xx === 0 ? 0 : 6} L${xx} 70" stroke="#d8b25a" stroke-width="3"/>`).join('');
    g += `<path d="M-40 70 L-40 20 Q-40 0 0 0 Q40 0 40 20 L40 70" stroke="#d8b25a" stroke-width="4" fill="none"/><rect x="-46" y="68" width="92" height="10" rx="3" fill="#a8822e" stroke="${INK}" stroke-width="2"/>`;
    g += `<g transform="translate(0 ${f1(-hop)})"><ellipse cx="0" cy="54" rx="15" ry="11" fill="#ffd21f" stroke="${INK}" stroke-width="2.5"/><circle cx="10" cy="44" r="8" fill="#ffd21f" stroke="${INK}" stroke-width="2.5"/><path d="M17 44 L24 46 L17 48 Z" fill="#ff9a1f"/><circle cx="12" cy="42" r="1.8" fill="${INK}"/><path d="M-14 54 L-24 60" stroke="#e8b81a" stroke-width="5"/></g>`;
    return g + '</g>';
  }

  // ---------- THE HERO: a narrow concealed wall panel (generic): a pale plywood panel ~380 x 960 at s = 1, bottom centre at
  // (x, y), screw heads, a small louvred vent cover near the top, a hairline seam. o.beam 0..1 = the flashlight hotspot on it
  // (o.bx, o.by offset the hotspot); o.glow 0..1 = pulsing yellow outline; o.crack 0..1 = cracks/splinters along the seam;
  // o.open 0..1 = the panel comes away (tilts out and drops left) revealing a black cavity with dust in the beam.
  function panel(x, y, s, t, o = {}) {
    const w = 380, h = 800, lift = 150, op = clamp(o.open || 0, 0, 1), k = o.glow || 0, bm = o.beam || 0, cr = o.crack || 0, aj = o.ajar ?? 0;
    const top = -h - lift, bot = -lift, cy = (top + bot) / 2;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    // the cavity behind the panel (only when it comes away)
    if (op > 0) {
      g += `<rect x="${-w / 2}" y="${top}" width="${w}" height="${h}" fill="#050405"/>` + wash(20, cy, 160, 300, '#ffcf8a', f1(0.25 * op * Math.max(0.4, bm)));
      g += `<path d="M${-w / 2} ${top} L${-w / 2 + 60} ${top + 60} L${w / 2 - 60} ${top + 60} L${w / 2} ${top} M${-w / 2 + 60} ${top + 60} L${-w / 2 + 60} ${bot - 60} L${w / 2 - 60} ${bot - 60} L${w / 2 - 60} ${top + 60} M${-w / 2 + 60} ${bot - 60} L${-w / 2} ${bot} M${w / 2 - 60} ${bot - 60} L${w / 2} ${bot}" stroke="#4a3e30" stroke-width="4" fill="none" opacity="${f1(0.9 * op)}"/>`;
      const r = R(4071); for (let i = 0; i < 24; i++) { const ph = (t * (0.08 + r() * 0.08) + r()) % 1; g += `<circle cx="${f1(-w / 2 + 30 + r() * (w - 60))}" cy="${f1(top + 40 + ((r() * h + ph * 300) % (h - 80)))}" r="${f1(1.5 + r() * 2.5)}" fill="#ffe8b0" opacity="${f1(op * (0.3 + 0.5 * Math.sin(ph * Math.PI)))}"/>`; }
    }
    // the ajar sliver: a dark wedge down the right edge (something behind the wall)
    if (aj > 0 && op <= 0) { const fl = 0.8 + 0.2 * Math.sin(t * 2.3); g += `<path d="M${w / 2 - 2} ${top} L${f1(w / 2 + 24 * aj)} ${top + 14} L${f1(w / 2 + 24 * aj)} ${bot - 14} L${w / 2 - 2} ${bot} Z" fill="#120804"/><path d="M${f1(w / 2 + 4)} ${top + 30} L${f1(w / 2 + 4)} ${bot - 30}" stroke="#ffb45a" stroke-width="5" opacity="${f1(0.85 * aj * fl)}"/>` + wash(w / 2 + 14, cy, 70, 380, '#ff9a3a', f1(0.45 * aj * fl)); }
    // the panel: the same boards as the wall, flush, a hairline gap all round, screw heads, a louvred vent cover
    const ang = -24 * ease.inOut(op), dx = -300 * ease.in(op), dy = 120 * ease.in(op), pop = 1 - 0.6 * seg(op, 0.7, 1);
    g += `<g opacity="${f1(pop)}" transform="translate(${f1(dx)} ${f1(dy)}) rotate(${f1(ang)} ${-w / 2} ${bot})">`;
    g += `<rect x="${-w / 2 - 5}" y="${top - 5}" width="${w + 10}" height="${h + 10}" fill="#0a0806"/><rect x="${-w / 2}" y="${top}" width="${w}" height="${h}" fill="#7c6e5c"/>`;
    g += `<rect x="${-w / 2}" y="${top}" width="${f1(w * 0.33)}" height="${h}" fill="#74685a"/><path d="M${f1(-w / 2 + w * 0.33)} ${top} L${f1(-w / 2 + w * 0.33)} ${bot}" stroke="#3e352c" stroke-width="5"/>`;
    for (let i = 0; i < 6; i++) g += `<path d="M${-w / 2 + 30 + i * 62} ${top + 10} C${-w / 2 + 40 + i * 62} ${top + h * 0.4} ${-w / 2 + 20 + i * 62} ${top + h * 0.7} ${-w / 2 + 34 + i * 62} ${bot - 10}" stroke="#5e5242" stroke-width="3" fill="none" opacity="0.5"/>`;
    [[-w / 2 + 22, top + 22], [w / 2 - 22, top + 22], [-w / 2 + 22, bot - 22], [w / 2 - 22, bot - 22]].forEach(([sx, sy]) => { g += `<circle cx="${sx}" cy="${sy}" r="9" fill="#a8a294" stroke="${INK}" stroke-width="3"/><path d="M${sx - 6} ${sy} L${sx + 6} ${sy}" stroke="${INK}" stroke-width="2"/>`; });
    g += `<rect x="-100" y="${top + 70}" width="200" height="120" rx="6" fill="#a8a69c" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M-86 ${top + 90 + i * 20} L86 ${top + 90 + i * 20}" stroke="#3a3830" stroke-width="7"/>`).join('');
    if (bm > 0) { const bx = o.bx || 0, by = o.by || 0; g += wash(bx, cy + 40 + by, 240, 300, TORCH, f1(0.6 * bm)) + `<ellipse cx="${bx}" cy="${cy + 40 + by}" rx="150" ry="190" fill="#fffbe8" opacity="${f1(0.2 * bm)}"/>`; }
    if (cr > 0) { const L = 560 * cr; g += `<path d="M${w / 2 - 6} ${top + 40} L${w / 2 - 30} ${f1(top + 40 + L * 0.3)} L${w / 2 - 12} ${f1(top + 40 + L * 0.55)} L${w / 2 - 40} ${f1(top + 40 + L)}" stroke="${INK}" stroke-width="5" fill="none"/><path d="M${w / 2 - 30} ${f1(top + 40 + L * 0.3)} L${w / 2 - 80} ${f1(top + 60 + L * 0.35)}" stroke="${INK}" stroke-width="3" fill="none"/>`; }
    g += `</g>`;
    if (k > 0) { const kk = k * (0.8 + 0.2 * Math.sin(t * 7)); g += `<rect x="${-w / 2 - 30}" y="${top - 30}" width="${w + 60}" height="${h + 60}" rx="10" fill="none" stroke="${YEL}" stroke-width="8" stroke-dasharray="26 18" opacity="${f1(0.85 * kk)}"/>` + wash(0, cy, 320, 480, YEL, f1(0.14 * kk)); }
    return g + '</g>';
  }

  // falling chips and dust from a broken ceiling or wall at (x, y), k 0..1 since the break
  function debris(x, y, k, t, seed = 41, spread = 220) {
    if (k <= 0 || k >= 1) return ''; const r = R(seed); let g = '';
    for (let i = 0; i < 26; i++) { const vx = (r() - 0.5) * spread * 2, vy = 60 + r() * 220, sz = 4 + r() * 12, q = k * 1.6; const xx = x + vx * q, yy = y + vy * q + 900 * q * q;
      g += `<rect x="${f1(xx)}" y="${f1(yy)}" width="${f1(sz)}" height="${f1(sz * 0.7)}" fill="${i % 3 ? '#cbbd98' : '#8a8070'}" transform="rotate(${f1(r() * 180 + k * 400)} ${f1(xx)} ${f1(yy)})" opacity="${f1(1 - k)}"/>`; }
    return g + wash(x, y + 120, 260, 180, '#e8dcc0', f1(0.4 * (1 - k)));
  }

  // a flashlight beam as a separate prop (screen-world space): from (x0, y0) to a target (x1, y1), soft cone
  function beam(x0, y0, x1, y1, k, wdt = 0.24) {
    if (k <= 0) return ''; const a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0) * 1.15;
    const p1 = [x0 + Math.cos(a - wdt) * L, y0 + Math.sin(a - wdt) * L], p2 = [x0 + Math.cos(a + wdt) * L, y0 + Math.sin(a + wdt) * L];
    const id = 'ahb' + Math.round(x0 + y0 * 3 + x1 * 7);
    return `<defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f1(x0)}" y1="${f1(y0)}" x2="${f1(x1)}" y2="${f1(y1)}"><stop offset="0" stop-color="${TORCH}" stop-opacity="${f1(0.55 * k)}"/><stop offset="1" stop-color="${TORCH}" stop-opacity="${f1(0.12 * k)}"/></linearGradient></defs>` +
      `<path d="M${f1(x0)} ${f1(y0)} L${f1(p1[0])} ${f1(p1[1])} L${f1(p2[0])} ${f1(p2[1])} Z" fill="url(#${id})" style="mix-blend-mode:screen"/>` + wash(x1, y1, 150, 120, TORCH, f1(0.5 * k));
  }
  // dust motes drifting in a beam area
  function motes(cx, cy, rx, ry, t, n = 40, op = 0.6, seed = 4077) {
    const r = R(seed); let g = '';
    for (let i = 0; i < n; i++) { const ph = (t * (0.05 + r() * 0.06) + r()) % 1; const x = cx + (r() - 0.5) * 2 * rx + Math.sin(t * 0.7 + i) * 12, y = cy + (r() - 0.5) * 2 * ry - ph * 80;
      g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.4 + r() * 2.4)}" fill="#fff4d6" opacity="${f1(op * Math.sin(ph * Math.PI))}"/>`; }
    return g;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a dim corridor inside a compound building (generic): a long plywood/board wall with seams and stains, a conduit and
    // a cable tray, a ceiling with a fluorescent tube (flickers) and a square ceiling hatch (o.hatch 0..1 = broken open), a
    // dark doorway at the left, a bare concrete floor. o.lit 0..1 = how much the tube lights the wall.
    ah40_hall(ctx, o = {}) {
      const t = ctx.t, tg = t + (ctx.sceneStart || 0), r = R(4001), lit = o.lit ?? 0.5, hz = clamp(o.hatch || 0, 0, 1);
      const fl = lit * (Math.sin(tg * 37) > 0.93 ? 0.35 : 1) * (0.85 + 0.15 * Math.sin(tg * 3.1));
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#0c0b10"/>`;
      // ceiling (y < 330): boards, a cable tray, the tube, the hatch
      let ceil = `<defs><linearGradient id="ahc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16141a"/><stop offset="1" stop-color="#2a2622"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="630" fill="url(#ahc)"/>`;
      for (let x = -300; x < W + 300; x += 180) ceil += `<path d="M${x} -300 L${x + 40} 330" stroke="#0e0c10" stroke-width="4" opacity="0.6"/>`;
      ceil += `<rect x="-300" y="300" width="${W + 600}" height="30" fill="#3a342c" stroke="${INK}" stroke-width="4"/>`;
      ceil += `<rect x="-300" y="210" width="${W + 600}" height="18" fill="#4a4a50" stroke="${INK}" stroke-width="3"/>` + [...Array(14)].map((_, i) => `<rect x="${-280 + i * 130}" y="196" width="10" height="46" fill="#3a3a40"/>`).join('');
      ceil += `<rect x="120" y="236" width="420" height="26" rx="12" fill="${fl > 0.4 ? '#f4fbff' : '#8a9aa4'}" stroke="${INK}" stroke-width="4"/>` + wash(330, 250, 380, 90, '#d8f0ff', f1(0.5 * fl));
      // the hatch (square, generic), broken open: the board hangs down, a black hole above
      const hx = 840, hy = 120;
      ceil += `<rect x="${hx - 110}" y="${hy}" width="220" height="150" fill="${hz > 0 ? '#040305' : '#3a342c'}" stroke="${INK}" stroke-width="5"/>`;
      if (hz > 0) ceil += `<path d="M${hx - 110} ${hy + 150} L${f1(hx - 110 + 220 * Math.cos(rad(70 * hz)))} ${f1(hy + 150 + 220 * Math.sin(rad(70 * hz)))}" stroke="#c8b894" stroke-width="22" stroke-linecap="square"/>` +
        `<path d="M${hx - 110} ${hy} L${hx - 80} ${hy + 30} L${hx - 40} ${hy + 6} L${hx} ${hy + 40} L${hx + 50} ${hy + 10} L${hx + 110} ${hy + 30}" stroke="#c8b894" stroke-width="5" fill="none"/>`;
      else ceil += `<path d="M${hx - 100} ${hy + 10} L${hx + 100} ${hy + 140} M${hx + 100} ${hy + 10} L${hx - 100} ${hy + 140}" stroke="#2a2620" stroke-width="3" opacity="0.5"/>`;
      // the wall: boards, seams, stains, a conduit with boxes, a dark doorway at the left
      let wall = `<rect x="-300" y="330" width="${W + 600}" height="1220" fill="#6e6252"/>`;
      for (let x = -300; x < W + 300; x += 240) wall += `<rect x="${x}" y="330" width="236" height="1220" fill="${(x / 240) % 2 ? '#74685a' : '#6a5e50'}"/><path d="M${x} 330 L${x} 1550" stroke="#3e352c" stroke-width="5"/>`;
      for (let i = 0; i < 12; i++) { const x = -250 + r() * 1500, ww = 30 + r() * 90; wall += `<path d="M${f1(x)} 340 L${f1(x + ww)} 340 L${f1(x + ww * 0.7)} ${f1(600 + r() * 500)} L${f1(x + ww * 0.25)} ${f1(520 + r() * 300)} Z" fill="#3e3428" opacity="0.28"/>`; }
      wall += `<rect x="-300" y="400" width="${W + 600}" height="20" fill="#5a5a62" stroke="${INK}" stroke-width="3"/>` + [140, 980].map(x => `<rect x="${x - 30}" y="384" width="60" height="52" rx="4" fill="#4a4a52" stroke="${INK}" stroke-width="3"/>`).join('');
      wall += `<rect x="-260" y="560" width="300" height="990" fill="#060507" stroke="${INK}" stroke-width="8"/><rect x="-270" y="550" width="320" height="22" fill="#3a3028"/>`;
      wall += `<rect x="-300" y="1470" width="${W + 600}" height="70" fill="#3a3128" stroke="${INK}" stroke-width="4"/>`;
      wall += wash(540, 600, 700, 300, '#d8f0ff', f1(0.18 * fl)) + `<rect x="-300" y="330" width="${W + 600}" height="1220" fill="#000" opacity="${f1(0.42 - 0.2 * fl)}"/>`;
      // floor
      let floor = `<defs><linearGradient id="ahf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3530"/><stop offset="1" stop-color="#121014"/></linearGradient></defs><rect x="-300" y="1540" width="${W + 600}" height="${H}" fill="url(#ahf)"/><rect x="-300" y="1536" width="${W + 600}" height="14" fill="#2a2420"/>`;
      for (let i = 0; i < 8; i++) floor += `<path d="M${-200 + i * 220} 1550 L${-500 + i * 300} ${H + 100}" stroke="#2a2622" stroke-width="3" opacity="0.6"/>`;
      return { light: { dir: 1, rim: '#ffe6b0', key: '#cfe6ff' }, layers: [[0.05, back], [0.6, ceil], [0.95, wall], [1.0, floor]] };
    },

    // a cutaway of the hidden space (generic, diagrammatic): a dark room below with a ceiling light, its ceiling broken
    // open at the right; above it the cramped space between floors (y 600-960), boarded, with the upper floor's slab above.
    // o.open 0..1 = the hole in the ceiling; o.reveal 0..1 = the space is lit by the beams.
    ah40_cell(ctx, o = {}) {
      const t = ctx.t, r = R(4002), op = clamp(o.open ?? 1, 0, 1), rv = clamp(o.reveal ?? 0, 0, 1);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#0a0812"/>`;
      // the upper room (dark), the slab above the space
      let upper = `<rect x="-300" y="-300" width="${W + 600}" height="830" fill="#1a1622"/>` + [...Array(8)].map((_, i) => `<rect x="${-260 + i * 200}" y="80" width="12" height="450" fill="#120f18"/>`).join('');
      upper += `<rect x="-300" y="530" width="${W + 600}" height="70" fill="#4a4652" stroke="${INK}" stroke-width="6"/>` + [...Array(10)].map((_, i) => `<path d="M${-280 + i * 170} 540 l40 50" stroke="#2a2830" stroke-width="4"/>`).join('');
      // the cramped space: boarded sides, dark, lit by the beams when revealed
      let mid = `<rect x="-300" y="600" width="${W + 600}" height="360" fill="#0c0a0e"/><rect x="80" y="600" width="760" height="360" fill="#241c16"/>`;
      mid += wash(470, 790, 380, 160, '#ffcf8a', f1(0.35 * rv)) + `<rect x="80" y="600" width="760" height="360" fill="#3a2c20" opacity="${f1(0.5 * rv)}"/>`;
      for (let x = 80; x < 840; x += 95) mid += `<path d="M${x} 600 L${x} 960" stroke="#120e0a" stroke-width="4" opacity="0.8"/>`;
      mid += `<rect x="60" y="600" width="24" height="360" fill="#5a4a38" stroke="${INK}" stroke-width="4"/><rect x="836" y="600" width="24" height="360" fill="#5a4a38" stroke="${INK}" stroke-width="4"/>`;
      // a bare bulb, off, and a cable
      mid += `<path d="M300 600 L300 650" stroke="#2a2420" stroke-width="4"/><circle cx="300" cy="662" r="14" fill="#5a5448" stroke="${INK}" stroke-width="3"/>`;
      // the room below: its ceiling slab (with the broken hole at the right), wall, a bed edge, a door
      let low = `<rect x="-300" y="960" width="${W + 600}" height="70" fill="#5a5560" stroke="${INK}" stroke-width="6"/>`;
      if (op > 0) { const hw = 240 * op; low += `<path d="M${f1(760 - hw / 2)} 960 L${f1(760 - hw / 2 + 30)} 1000 L${f1(760 - hw / 4)} 1030 L${f1(760 + hw / 4)} 1022 L${f1(760 + hw / 2 - 20)} 1032 L${f1(760 + hw / 2)} 960 Z" fill="#0c0a0e" stroke="#c8bca0" stroke-width="4"/>`; }
      low += `<rect x="-300" y="1030" width="${W + 600}" height="560" fill="#3a3a52"/>` + wash(300, 1100, 400, 140, '#bfd8ff', 0.18);
      low += `<rect x="-200" y="1250" width="480" height="300" fill="#4a4660" stroke="${INK}" stroke-width="5"/><rect x="-200" y="1230" width="480" height="40" rx="12" fill="#d8d0e0" opacity="0.7"/>`;
      low += `<rect x="900" y="1100" width="220" height="450" fill="#1a1824" stroke="${INK}" stroke-width="6"/>`;
      let floor = `<rect x="-300" y="1580" width="${W + 600}" height="${H}" fill="#18161e"/><rect x="-300" y="1576" width="${W + 600}" height="12" fill="#2a2834"/>`;
      // cutaway edge marks (diagram cue: a white dashed outline around the hidden space)
      const k = seg(t, 0.2, 0.9);
      let mark = `<rect x="70" y="596" width="780" height="368" fill="none" stroke="#ffffff" stroke-width="4" stroke-dasharray="18 12" opacity="${f1(0.5 * k)}"/>`;
      void r;
      return { light: { dir: 1, rim: '#ffd8a0', key: '#ffe0b0' }, layers: [[0.05, back], [0.4, upper], [0.5, mid], [0.52, mark], [0.9, low], [1.0, floor]] };
    },

    // the compound in a field under Mount Fuji (generic): a big snow-capped cone, dark foothills, windowless white sheds with
    // low dark roofs, pipes and small vents, a wire fence, a field. o.grey = a cold grey raid morning (else dawn pink/orange);
    // o.buses 0..1 = plain dark-blue police buses (no lettering) parked in the field.
    ah40_compound(ctx, o = {}) {
      const t = ctx.t, r = R(4003), g0 = o.grey ? 1 : 0, fx = o.fx || 0;
      const s0 = g0 ? '#5a6a7a' : '#2a2a6a', s1 = g0 ? '#a8b4bc' : '#c25a8a', s2 = g0 ? '#d8dcd8' : '#ffb070';
      let sky = `<defs><linearGradient id="acs${g0}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s0}"/><stop offset="0.55" stop-color="${s1}"/><stop offset="1" stop-color="${s2}"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#acs${g0})"/>`;
      if (!g0) sky += wash(820, 760, 420, 200, '#ffd090', 0.5);
      for (let i = 0; i < 5; i++) { const cx = ((i * 330 + t * 14) % 1700) - 300, cy = 200 + i * 60; sky += `<ellipse cx="${f1(cx)}" cy="${cy}" rx="${200 + i * 30}" ry="34" fill="${g0 ? '#e8ecef' : '#ffc0d8'}" opacity="0.28"/>`; }
      // Mount Fuji: a broad cone, a jagged snow cap, faint gullies
      let fuji = `<path d="M-260 960 C 60 820 330 560 450 420 Q 540 380 630 420 C 750 560 1020 820 1340 960 Z" fill="${g0 ? '#4a5a6e' : '#4a3a7a'}"/>`;
      fuji += `<path d="M450 420 Q 540 380 630 420 C 670 470 700 505 730 540 L700 530 L680 560 L650 520 L620 560 L590 515 L560 565 L530 512 L500 560 L470 520 L440 548 L410 530 L380 540 C 400 505 420 470 450 420 Z" fill="#f4f6fa"/>`;
      for (let i = 0; i < 9; i++) { const x = 400 + i * 30; fuji += `<path d="M${x} 560 Q ${x - 40 + i * 10} 700 ${x - 120 + i * 30} 900" stroke="#ffffff" stroke-width="3" opacity="0.15" fill="none"/>`; }
      fuji += wash(540, 440, 160, 60, '#ffffff', 0.3);
      let hills = `<path d="M-300 960 C -100 900 100 920 300 900 C 500 880 700 930 900 900 C 1100 880 1300 910 1400 900 L1400 1100 L-300 1100 Z" fill="${g0 ? '#2e3e38' : '#2a2a40'}"/>`;
      for (let i = 0; i < 40; i++) { const x = -300 + i * 44 + r() * 20, hh = 30 + r() * 40; hills += `<path d="M${f1(x)} ${f1(930 - hh + r() * 20)} l16 ${f1(hh)} l-32 0 Z" fill="${g0 ? '#22302a' : '#20203a'}"/>`; }
      // the sheds: windowless white boxes, dark low roofs, pipes, vents (generic)
      let sheds = `<rect x="-300" y="1040" width="${W + 600}" height="${H}" fill="${g0 ? '#5a6a4a' : '#6a5a4a'}"/>`;
      const B = [[-180, 1000, 420, 210], [260, 960, 380, 250], [660, 990, 520, 220]];
      B.forEach(([x, y, w, h], i) => { sheds += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#e8e6de" stroke="${INK}" stroke-width="6"/><path d="M${x - 14} ${y} L${x + w / 2} ${y - 40} L${x + w + 14} ${y} Z" fill="#3a3a44" stroke="${INK}" stroke-width="5"/>`;
        sheds += `<rect x="${x}" y="${y + h - 30}" width="${w}" height="30" fill="#c8c4b8"/>` + [0, 1, 2].map(j => `<rect x="${x + 40 + j * (w / 3)}" y="${y + 20}" width="40" height="22" fill="#9a9a96" stroke="${INK}" stroke-width="2"/>`).join('');
        sheds += `<path d="M${x + w - 50} ${y - 20} L${x + w - 50} ${y - 90} L${x + w - 10} ${y - 90}" stroke="#7a7a80" stroke-width="12" fill="none"/>`;
        if (i === 1) sheds += `<rect x="${x + 150}" y="${y + h - 150}" width="80" height="150" fill="#1a1820" stroke="${INK}" stroke-width="5"/>` + wash(x + 190, y + h - 70, 60, 90, '#ffcf8a', 0.25);
      });
      // the wire fence
      let fence = '';
      for (let x = -300; x < W + 300; x += 120) fence += `<rect x="${x}" y="1180" width="10" height="150" fill="#3a3a40"/>`;
      fence += `<path d="M-300 1196 L${W + 300} 1196 M-300 1240 L${W + 300} 1240 M-300 1290 L${W + 300} 1290" stroke="#5a5a62" stroke-width="3"/>`;
      for (let x = -300; x < W + 300; x += 30) fence += `<path d="M${x} 1196 L${x + 30} 1290 M${x + 30} 1196 L${x} 1290" stroke="#6a6a72" stroke-width="1.5" opacity="0.6"/>`;
      // police buses (plain, dark blue, mesh windows, no lettering)
      let buses = '';
      if (o.buses) [[-120, 1170, 0.9], [980, 1150, 0.8]].forEach(([x, y, s]) => { buses += `<g opacity="${f1(o.buses)}" transform="translate(${x} ${y}) scale(${s})"><rect x="-200" y="-150" width="400" height="140" rx="16" fill="#1e2a4a" stroke="${INK}" stroke-width="6"/><rect x="-180" y="-130" width="360" height="50" fill="#0e1424"/>` +
        [...Array(9)].map((_, i) => `<path d="M${-180 + i * 45} -130 L${-180 + i * 45} -80" stroke="#4a5a7a" stroke-width="3"/>`).join('') + `<circle cx="-120" cy="-6" r="30" fill="#0e0e12"/><circle cx="120" cy="-6" r="30" fill="#0e0e12"/></g>`; });
      let ground = `<rect x="-300" y="1330" width="${W + 600}" height="${H}" fill="${g0 ? '#4a5a3a' : '#5a4a3a'}"/>` + wash(540, 1400, 700, 120, g0 ? '#c8d0c0' : '#ffb070', 0.22);
      for (let i = 0; i < 60; i++) { const x = -300 + r() * 1700, y = 1340 + r() * 600; ground += `<path d="M${f1(x)} ${f1(y)} l6 -24 l6 24" stroke="${g0 ? '#6a7a4a' : '#8a6a4a'}" stroke-width="3" fill="none" opacity="0.7"/>`; }
      fuji = `<g transform="translate(${fx} 0)">${fuji}</g>`;
      return { light: { dir: 1, rim: g0 ? '#d8e8ff' : '#ffb0c8', key: g0 ? '#e0e8f0' : '#ffd0b0' }, layers: [[0.05, sky], [0.12, fuji], [0.25, hills], [0.45, sheds], [0.55, buses], [0.7, fence], [1.0, ground]], fog: !!g0 };
    },

    // a taped-off subway entrance at street level on a spring morning (generic): office towers, a glass canopy over a stair
    // going down, a sign box with a plain coloured disc (no lettering), a half-lowered shutter, striped tape (no text), cones,
    // red beacons on a generic white emergency van. o.beacon 0..1.
    ah40_station(ctx, o = {}) {
      const t = ctx.t, r = R(4004), bc = o.beacon ?? 1;
      let sky = `<defs><linearGradient id="ass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a8ac8"/><stop offset="1" stop-color="#d8e8f4"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#ass)"/>`;
      let towers = '';
      [[-260, 330, 300], [60, 280, 260], [340, 360, 220], [580, 250, 300], [900, 320, 360]].forEach(([x, y, w]) => { towers += `<rect x="${x}" y="${y}" width="${w}" height="${1100 - y}" fill="#6a7a94" stroke="#4a5a74" stroke-width="4"/>`;
        for (let yy = y + 30; yy < 1060; yy += 46) for (let xx = x + 20; xx < x + w - 30; xx += 44) towers += `<rect x="${xx}" y="${yy}" width="28" height="26" fill="${r() > 0.75 ? '#ffe8a8' : '#9ab4d4'}" opacity="0.7"/>`; });
      // the van (generic white emergency van, red stripe, no lettering) with beacons
      const pulse = bc * Math.max(0, Math.sin(t * 9)), pulse2 = bc * Math.max(0, Math.sin(t * 9 + 2.4));
      let van = `<g transform="translate(940 1150)"><rect x="-230" y="-230" width="460" height="210" rx="20" fill="#eef0f2" stroke="${INK}" stroke-width="6"/><rect x="-230" y="-110" width="460" height="24" fill="#d22a2a"/><rect x="-200" y="-210" width="150" height="70" rx="8" fill="#6a8aa8"/><circle cx="-150" cy="-14" r="40" fill="#141418"/><circle cx="150" cy="-14" r="40" fill="#141418"/>` +
        `<rect x="-60" y="-262" width="120" height="30" rx="10" fill="#c82a2a" stroke="${INK}" stroke-width="4"/></g>` + wash(910, 878, 140, 90, '#ff2a3a', f1(0.7 * pulse)) + wash(970, 878, 140, 90, '#ff4a2a', f1(0.6 * pulse2));
      // the entrance: canopy, sign box (plain disc), the stair down, the shutter half lowered, handrails
      let ent = `<rect x="-300" y="1100" width="${W + 600}" height="${H}" fill="#7a7a80"/>`;
      ent += `<rect x="80" y="560" width="620" height="40" fill="#c8d4dc" stroke="${INK}" stroke-width="5" opacity="0.95"/><path d="M90 600 L90 1160 M690 600 L690 1160" stroke="#4a5058" stroke-width="16"/>`;
      ent += `<rect x="100" y="600" width="580" height="300" fill="#a8c8e0" opacity="0.25"/>`;
      ent += `<rect x="220" y="470" width="340" height="90" rx="8" fill="#f4f6f8" stroke="${INK}" stroke-width="5"/><circle cx="270" cy="515" r="30" fill="#2a8adf" stroke="${INK}" stroke-width="3"/><rect x="320" y="500" width="210" height="14" rx="6" fill="#c8ccd2"/><rect x="320" y="524" width="150" height="10" rx="5" fill="#d8dce0"/>`;
      ent += `<path d="M110 1160 L670 1160 L620 900 L160 900 Z" fill="#141418"/>` + [...Array(8)].map((_, i) => `<path d="M${f1(160 - i * 6)} ${f1(900 + i * 33)} L${f1(620 + i * 6)} ${f1(900 + i * 33)}" stroke="#3a3a42" stroke-width="5"/>`).join('');
      ent += `<rect x="150" y="660" width="480" height="240" fill="#8a9098" stroke="${INK}" stroke-width="5"/>` + [...Array(10)].map((_, i) => `<path d="M150 ${684 + i * 22} L630 ${684 + i * 22}" stroke="#6a7078" stroke-width="4"/>`).join('');
      ent += `<path d="M120 900 L120 1160 M660 900 L660 1160" stroke="#c8ccd2" stroke-width="10"/>`;
      // striped tape (yellow/black, no text) across the stair, cones
      let tape = `<path d="M-60 1060 Q 390 1100 840 1040" stroke="#ffd21f" stroke-width="26" fill="none"/>`;
      for (let i = 0; i < 18; i++) { const u = i / 18, x = lerp(-60, 840, u), y = lerp(1060, 1040, u) + Math.sin(u * Math.PI) * 30; tape += `<path d="M${f1(x)} ${f1(y - 12)} l20 24" stroke="#141414" stroke-width="10"/>`; }
      [[40, 1180], [760, 1170]].forEach(([x, y]) => { tape += `<path d="M${x - 30} ${y} L${x} ${y - 90} L${x + 30} ${y} Z" fill="#ff7a1a" stroke="${INK}" stroke-width="4"/><rect x="${x - 18}" y="${y - 52}" width="36" height="12" fill="#f4f4f4"/>`; });
      let ground = `<rect x="-300" y="1180" width="${W + 600}" height="${H}" fill="#5a5a62"/><rect x="-300" y="1176" width="${W + 600}" height="12" fill="#8a8a92"/>` + wash(700, 1240, 600, 100, '#ff3a4a', f1(0.18 * pulse));
      for (let i = 0; i < 10; i++) ground += `<rect x="${-300 + i * 180}" y="1300" width="120" height="16" fill="#e8e8ec" opacity="0.5"/>`;
      return { light: { dir: -1, rim: '#ff8a9a', key: '#e8f0ff' }, layers: [[0.05, sky], [0.2, towers], [0.55, van], [0.7, ent], [0.8, tape], [1.0, ground]] };
    }
  });

  // the hero panel's framing in the first and the last shot (the loop): big and centred in the corridor wall
  const HERO = { x: 600, y: 1600, s: 0.95 };
  const COP = { id: 'ah40_riot_a', x: 220, y: 1720, scale: 0.8, dir: 1, turn: 0.55, pose: 'torch', expr: 'focused', depth: 1.02, propOpts: { aim: 116, beamLen: 620 } };

  E.registerScenes({
    // 1 - hook: the concealed panel in the dim corridor, the officer's flashlight on it, the outline pulsing. The headline
    //     is burned in by the engine (until ~3.2 s); nothing of ours sits in y 380-720 before then.
    ah40_hook(ctx) {
      const t = ctx.t, safe = WT(ctx, 0, 5, 0.9), l1 = LS(ctx, 1, 2.9), sub = WT(ctx, 1, 3, 3.6), crime = WT(ctx, 1, 6, 4.2);
      const cop = { ...COP, keys: [{ at: safe, pose: 'torch', expr: 'determined', dur: 0.4 }, { at: sub - 0.1, pose: 'torch_low', expr: 'focused', dur: 0.45 }, { at: crime + 0.3, pose: 'torch', dur: 0.5 }] };
      return E.cine.shot(ctx, {
        set: 'ah40_hall', setOpts: { lit: 0.35 }, grade: 'night',
        cam: { keys: [{ x: 0, y: 40, z: 1.0 }, { at: 0.2, x: 20, y: 70, z: 1.08, dur: 2.6 }, { at: l1, x: 30, y: 90, z: 1.13, dur: 2.2 }], handheld: 0.4 },
        shake: [{ at: sub, amp: 3 }],
        figures: [cop],
        props: [{ depth: 1.02, svg: tt => headgear(cop, tt, 'riot') },
          { depth: 0.95, svg: tt => panel(HERO.x, HERO.y, HERO.s, tt, { ajar: 1, beam: 0.6 + 0.4 * seg(tt, 0.2, 0.8), bx: 40 * Math.sin(tt * 1.3), by: 30 * Math.sin(tt * 0.9), glow: 0.85 * seg(tt, sub - 0.15, sub + 0.25) * (1 - seg(tt, crime + 0.6, crime + 1.2)) }) },
          { depth: 1.0, svg: tt => motes(560, 1000, 300, 300, tt + (ctx.sceneStart || 0), 36, 0.6) }],
        overlays: [{ type: 'impact', at: sub, x: 600, y: 1080, colour: HL }],
        tag: TAG
      });
    },

    // 2 - where: the map fly-in, Asia to central Tokyo; Japan glows; the pin lands on Tokyo
    ah40_map(ctx) {
      const T = ctx.T, mar = WT(ctx, 0, 2, 0.4), rush = WT(ctx, 0, 4, 1.2), tok = WT(ctx, 0, 7, 2.0);
      return E.cine.shot(ctx, {
        set: 'mapflight', grade: 'cold',
        setOpts: { geo: 'asia', from: { center: [118, 30], span: 66 }, to: { center: [139.7, 35.7], span: 3.4 }, t0: 0.05, t1: Math.max(tok + 0.4, T - 0.45),
          country: 'Japan', hl: HL, country_at: 0.3, pin: { ll: [139.767, 35.681], label: 'TOKYO', at: tok - 0.2, dx: -40, dy: -60, anchor: 'end', fs: 60 },
          labels: [{ ll: [104, 34], text: 'CHINA', at: 0.2, fs: 44 }, { ll: [127.8, 36.4], text: 'KOREA', at: 0.3, fs: 34 }, { ll: [141.6, 39.8], text: 'JAPAN', at: 0.5, fs: 48 }] },
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: -10, z: 1.05 }, handheld: 0.3 },
        overlays: [{ type: 'label', at: mar - 0.1, x: 60, y: 432, text: '20 MARCH 1995', fs: 46, sub: 'Monday · morning rush hour' }],
        tag: 'ILLUSTRATION · MAP, NATURAL EARTH DATA'
      });
    },

    // 3 - the stakes: a taped-off subway entrance; two responders in gas masks at the tape, one waves people back; the toll
    //     card (no victims, no chemical, no attack)
    ah40_toll(ctx) {
      const t = ctx.t, cult = WT(ctx, 0, 0, 0.1), sar = WT(ctx, 0, 3, 1.0), tr = WT(ctx, 0, 6, 1.8), l1 = LS(ctx, 1, 2.6), d14 = WT(ctx, 1, 0, 2.7), died = WT(ctx, 1, 2, 3.2), th = WT(ctx, 1, 3, 3.6);
      const ra = { id: 'ah40_responder', x: 300, y: 1720, scale: 0.92, dir: 1, turn: 0.45, pose: 'stand', expr: 'neutral', depth: 1.02,
        keys: [{ at: cult, pose: 'present', dur: 0.4 }, { at: sar, pose: 'point', gaze: [0.7, -0.1], dur: 0.35 }, { at: d14, pose: 'stand_tense', dur: 0.4 }, { at: th, pose: 'bowed', dur: 0.6 }] };
      const rb = { id: 'ah40_responder', x: 820, y: 1660, scale: 0.8, dir: -1, turn: 0.5, pose: 'stand_tense', expr: 'neutral', depth: 1.01,
        keys: [{ at: tr - 0.1, pose: 'examine', dur: 0.4 }, { at: died, pose: 'hands_together', dur: 0.5 }] };
      return E.cine.shot(ctx, {
        set: 'ah40_station', setOpts: { beacon: 1 }, grade: 'neon', police: 0.25,
        cam: { keys: [{ x: -40, y: 20, z: 1.0 }, { at: 0.1, x: 0, y: 30, z: 1.06, dur: 2.2 }, { at: l1, x: 30, y: 50, z: 1.12, dur: 2.0 }], handheld: 0.5 },
        figures: [rb, ra],
        props: [{ depth: 1.02, svg: tt => headgear(ra, tt, 'mask') }, { depth: 1.01, svg: tt => headgear(rb, tt, 'mask') }],
        overlays: [
          { type: 'card', at: d14 - 0.15, x: 60, y: 400, w: 760, rows: [{ text: '14 PEOPLE KILLED', fs: 50, colour: RED }, { text: 'THOUSANDS INJURED', fs: 40, at: died - 0.1 }, { text: '(THE 14TH VICTIM DIED IN 2020)', fs: 26, colour: MUTE, at: th }] }
        ],
        tag: TAG
      });
    },

    // 4 - the cult: the compound's white sheds under Mount Fuji at dawn; an inspector watches from the fence; the leader is
    //     a tiny silhouette in a shed doorway (no symbol, no followers, no gesture of worship)
    ah40_cult(ctx) {
      const t = ctx.t, cult = WT(ctx, 0, 1, 0.2), aum = WT(ctx, 0, 3, 0.6), led = WT(ctx, 0, 5, 1.4), asa = WT(ctx, 0, 8, 2.1);
      return E.cine.shot(ctx, {
        set: 'ah40_compound', setOpts: { fx: 230 }, grade: 'dawn',
        cam: { from: { x: 30, y: -40, z: 1.0 }, to: { x: -20, y: 0, z: 1.1 }, handheld: 0.35 },
        figures: [
          { id: 'ah40_guru', x: 448, y: 1208, scale: 0.18, dir: 1, turn: 0.1, pose: 'stand', silhouette: 'warm', depth: 0.45, show: [led - 0.3],
            keys: [{ at: asa, pose: 'stand_tense', dur: 0.4 }] },
          { id: 'ah40_inspector', x: 880, y: 1940, scale: 1.26, dir: -1, turn: 0.6, pose: 'stand', expr: 'focused', depth: 1.02, gaze: [-0.6, -0.4],
            keys: [{ at: aum, pose: 'examine', expr: 'focused', dur: 0.45 }, { at: asa - 0.1, pose: 'point', expr: 'stern', gaze: [-0.9, -0.5], dur: 0.4 }] }
        ],
        overlays: [
          { type: 'card', at: aum - 0.15, x: 40, y: 400, w: 580, rows: [{ text: 'AUM SHINRIKYO', fs: 48, colour: RED }, { text: 'LEADER: SHOKO ASAHARA', fs: 30, at: led - 0.1 }] },
          { type: 'callout', at: asa + 0.1, target: [448, 1130], r: 70, label: [40, 720], w: 520, text: 'ILLUSTRATION, NOT A LIKENESS', fs: 24, colour: HL }
        ],
        tag: LIKE
      });
    },

    // 5 - the raids: riot police in helmets and gas masks march past the fence toward the sheds on a grey morning; the
    //     lead officer carries a canary in a cage. The fun fact pops.
    ah40_raid(ctx) {
      const t = ctx.t, pol = WT(ctx, 0, 0, 0.1), rd = WT(ctx, 0, 1, 0.4), fuji = WT(ctx, 0, 6, 2.0), l1 = LS(ctx, 1, 2.6), can = WT(ctx, 1, 2, 3.2), gas = WT(ctx, 1, 6, 4.0);
      const walkDur = Math.max(2.5, ctx.T - 0.2);
      const a = { id: 'ah40_riot_a', x: 520, y: 1720, scale: 0.96, dir: 1, turn: 0.5, pose: 'walk', expr: 'determined', depth: 1.02, walk: { from: 160, to: 640, at: 0.0, dur: walkDur, cadence: 6.4 },
        keys: [{ at: can - 0.2, pose: 'present', dur: 0.35 }, { at: gas + 0.3, pose: 'walk', dur: 0.3 }] };
      const b = { id: 'ah40_riot_b', x: 300, y: 1640, scale: 0.84, dir: 1, turn: 0.5, pose: 'walk', expr: 'determined', depth: 1.01, walk: { from: -120, to: 330, at: 0.1, dur: walkDur, cadence: 6.2 },
        keys: [{ at: fuji, pose: 'point', gaze: [0.8, -0.4], dur: 0.35 }, { at: fuji + 0.8, pose: 'walk', dur: 0.3 }] };
      const c = { id: 'ah40_riot_a', x: 0, y: 1600, scale: 0.74, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', depth: 1.0, walk: { from: -360, to: 60, at: 0.2, dur: walkDur, cadence: 6.0 } };
      const cageAt = tt => { const st = E.fig.stateAt(a, tt); const u = clamp((tt - a.walk.at) / a.walk.dur, 0, 1); const x = lerp(a.walk.from, a.walk.to, u); const lift = seg(tt, can - 0.2, can + 0.15) * (1 - seg(tt, gas + 0.3, gas + 0.6)); void st; return [x + 120 + 60 * lift, a.y - 520 - 120 * lift]; };
      return E.cine.shot(ctx, {
        set: 'ah40_compound', setOpts: { grey: 1, buses: 1 }, grade: 'jungle',
        cam: { keys: [{ x: -60, y: 60, z: 1.04 }, { at: 0.1, x: 0, y: 60, z: 1.08, dur: 2.4 }, { at: l1, x: 50, y: 40, z: 1.14, dur: 2.0 }], handheld: 0.5 },
        shake: [{ at: rd, amp: 3 }],
        figures: [c, b, a],
        props: [{ depth: 1.0, svg: tt => headgear(c, tt, 'riotmask') }, { depth: 1.01, svg: tt => headgear(b, tt, 'riotmask') }, { depth: 1.02, svg: tt => headgear(a, tt, 'riotmask') },
          { depth: 1.02, svg: tt => { const [x, y] = cageAt(tt); return cage(x, y, tt + (ctx.sceneStart || 0)); } }],
        overlays: [
          { type: 'label', at: rd - 0.1, until: l1 + 0.1, x: 60, y: 432, text: 'KAMIKUISHIKI · NEAR MOUNT FUJI', fs: 38, sub: 'The cult compound · 1995' },
          { type: 'funfact', at: can - 0.1, y: 400, rows: [{ text: 'POLICE CARRIED CANARIES' }, { text: 'IN CAGES AS GAS DETECTORS.', colour: YEL }, { text: 'TIME · MACLEAN\'S, 1995', fs: 26, colour: '#bdb6a8' }] }
        ],
        tag: TAG
      });
    },

    // 6 - the wait: the incident room at night; the inspector at the board, an officer at a desk; the count-up 0 -> 57 days
    ah40_days(ctx) {
      const t = ctx.t, asa = WT(ctx, 0, 0, 0.1), fnd = WT(ctx, 0, 2, 0.6), n57 = WT(ctx, 0, 3, 1.2), att = WT(ctx, 0, 5, 2.0), pol = WT(ctx, 0, 6, 2.3), back = WT(ctx, 0, 8, 3.0);
      const typing = (from, to, step = 0.22) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? 'sit_type_b' : 'sit_type', dur: step * 0.8 }); return k; };
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'warm', dust: true,
        cam: { from: { x: -30, y: -10, z: 1.0 }, to: { x: 30, y: -30, z: 1.1 }, handheld: 0.4 },
        figures: [
          { id: 'ah40_inspector', x: 800, y: 1920, scale: 1.26, dir: -1, turn: 0.55, pose: 'arms_crossed', expr: 'stern',
            keys: [{ at: fnd, pose: 'hand_to_face', expr: 'worried', dur: 0.4 }, { at: n57, pose: 'point', expr: 'determined', gaze: [0.9, -0.5], headTurn: 0.3, dur: 0.4 }, { at: back, pose: 'present', expr: 'determined', dur: 0.4 }] },
          { id: 'ah40_riot_b', x: 330, y: 1680, scale: 0.94, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', keys: [...typing(0.05, n57), { at: n57, pose: 'sit_read', dur: 0.4 }, { at: pol, pose: 'stand_tense', expr: 'determined', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'counter', at: n57 - 0.1, dur: 1.3, from: 0, to: 57, suffix: ' DAYS', label: 'AFTER THE ATTACK', y: 590, fs: 140, colour: '#ffb347' },
          { type: 'label', at: att, x: 60, y: 1230, text: '16 MAY 1995 · BEFORE DAWN', fs: 40 }
        ],
        tag: TAG
      });
    },

    // 7 - THE HOW: back in the corridor (now lit), two officers; the ceiling hatch breaks open on "ceiling", the panel comes
    //     away on "wall"; the beam finds the hidden space behind it. Music drop.
    ah40_wall(ctx) {
      const t = ctx.t, bld = WT(ctx, 0, 2, 0.4), off = WT(ctx, 0, 3, 0.8), brk = WT(ctx, 0, 4, 1.2), ceil = WT(ctx, 0, 7, 1.8), wall = WT(ctx, 0, 10, 2.6),
        l1 = LS(ctx, 1, 3.3), tiny = WT(ctx, 1, 4, 3.9), room = WT(ctx, 1, 6, 4.4);
      const a = { id: 'ah40_riot_a', x: 1010, y: 1760, scale: 0.98, dir: -1, turn: 0.5, pose: 'stand_tense', expr: 'determined', depth: 1.03,
        keys: [{ at: brk - 0.2, pose: 'point_up', gaze: [-0.4, -0.9], dur: 0.35 }, { at: wall - 0.25, pose: 'present', dur: 0.3 }, { at: l1, pose: 'torch', expr: 'shocked', dur: 0.4 }] };
      const b = { id: 'ah40_riot_b', x: 170, y: 1720, scale: 0.9, dir: 1, turn: 0.5, pose: 'torch', expr: 'focused', depth: 1.02, propOpts: { aim: 108, beamLen: 600 },
        keys: [{ at: off, pose: 'torch_low', dur: 0.4 }, { at: wall, pose: 'stand_tense', expr: 'shocked', dur: 0.25 }, { at: tiny - 0.2, pose: 'torch', expr: 'realise', dur: 0.4 }] };
      return E.cine.shot(ctx, {
        set: 'ah40_hall', setOpts: { lit: 0.8, hatch: seg(t, ceil - 0.05, ceil + 0.3) }, grade: 'neon',
        cam: { keys: [{ x: 0, y: -40, z: 1.0 }, { at: ceil - 0.3, x: 40, y: -80, z: 1.04, dur: 0.6 }, { at: wall - 0.1, x: 0, y: 60, z: 1.08, dur: 0.6 }, { at: l1, x: 20, y: 90, z: 1.2, dur: 1.4 }], handheld: 0.6 },
        shake: [{ at: ceil, amp: 6 }, { at: wall, amp: 8 }],
        figures: [b, a],
        props: [{ depth: 1.03, svg: tt => headgear(a, tt, 'riot') }, { depth: 1.02, svg: tt => headgear(b, tt, 'riot') },
          { depth: 0.95, svg: tt => panel(HERO.x, HERO.y, HERO.s, tt, { beam: 0.5 + 0.5 * seg(tt, l1 - 0.2, l1 + 0.3), crack: seg(tt, brk, wall), open: ease.out(seg(tt, wall - 0.05, wall + 0.6)), glow: 0.8 * seg(tt, tiny - 0.2, tiny + 0.2) }) },
          { depth: 0.6, svg: tt => debris(840, 270, seg(tt, ceil, ceil + 1.1), tt, 41, 160) },
          { depth: 0.96, svg: tt => debris(700, 900, seg(tt, wall, wall + 1.0), tt, 43, 260) },
          { depth: 1.0, svg: tt => motes(600, 1060, 220, 360, tt + (ctx.sceneStart || 0), 40, 0.8 * seg(tt, l1 - 0.3, l1 + 0.4)) }],
        overlays: [
          { type: 'label', at: bld - 0.1, until: wall + 0.2, x: 60, y: 432, text: 'SATIAN 6 · 16 MAY 1995', fs: 42, sub: 'A building searched before' },
          { type: 'impact', at: wall, x: 600, y: 1000, colour: YEL },
          { type: 'callout', at: tiny, target: [600, 990], r: 120, label: [380, 470], w: 560, text: 'A HIDDEN SPACE', fs: 40, colour: HL }
        ],
        tag: TAG
      });
    },

    // 8 - the irony: the cutaway. The room below, its ceiling broken open; two officers shine flashlights up into the
    //     cramped space between floors, where a hunched silhouette sits. ARRESTED stamp. The size on an attributed card.
    ah40_inside(ctx) {
      const t = ctx.t, T = ctx.T, hid = WT(ctx, 0, 0, 0.1), ins = WT(ctx, 0, 1, 0.4), asa = WT(ctx, 0, 3, 1.0), lead = WT(ctx, 0, 5, 1.7), th = WT(ctx, 0, 7, 2.3);
      const rv = tt => seg(tt, 0.1, ins + 0.3);
      const a = { id: 'ah40_riot_a', x: 760, y: 1700, scale: 0.86, dir: -1, turn: 0.5, pose: 'torch', expr: 'focused', depth: 1.02, propOpts: { aim: 156, beamLen: 620 },
        keys: [{ at: asa, pose: 'torch', expr: 'shocked', dur: 0.3 }, { at: th + 0.2, pose: 'point_up', expr: 'determined', dur: 0.4 }] };
      const b = { id: 'ah40_inspector', x: 1000, y: 1740, scale: 0.92, dir: -1, turn: 0.55, pose: 'stand_tense', expr: 'focused', depth: 1.03,
        keys: [{ at: ins, pose: 'examine', expr: 'realise', gaze: [-0.6, -0.8], dur: 0.4 }, { at: lead, pose: 'arms_crossed', expr: 'stern', dur: 0.45 }] };
      return E.cine.shot(ctx, {
        set: 'ah40_cell', setOpts: { open: 1, reveal: rv(t) }, grade: 'tokyo',
        cam: { keys: [{ x: 60, y: 80, z: 1.12 }, { at: 0.1, x: -60, y: -40, z: 1.0, dur: Math.max(1.2, asa + 0.2) }, { at: th, x: -50, y: -50, z: 1.12, dur: 1.0 }], handheld: 0.4 },
        shake: [{ at: asa, amp: 4 }],
        figures: [
          { id: 'ah40_guru', x: 470, y: 958, scale: 0.4, dir: 1, turn: 0.2, pose: 'sit_slumped', silhouette: 'cool', depth: 0.5,
            keys: [{ at: asa, pose: 'sit', dur: 0.4 }, { at: th + 0.3, pose: 'sit_slumped', dur: 0.6 }] },
          a, b
        ],
        props: [{ depth: 1.02, svg: tt => headgear(a, tt, 'riot') },
          { depth: 0.9, svg: tt => beam(1180, 1200, 420, 800, 0.8 * rv(tt), 0.16) },
          { depth: 0.55, svg: tt => motes(470, 780, 330, 140, tt + (ctx.sceneStart || 0), 30, 0.7 * rv(tt)) }],
        overlays: [
          { type: 'card', at: ins + 0.1, x: 60, y: 390, w: 900, rows: [{ text: 'BETWEEN FLOORS · ABOUT THE SIZE OF A COFFIN', fs: 30, colour: RED }, { text: '(MACLEAN\'S, 1995)', fs: 24, colour: MUTE, at: ins + 0.5 }] },
          { type: 'impact', at: asa, x: 470, y: 820, colour: HL },
          { type: 'stamp', at: th + 0.15, x: 330, y: 1160, text: 'ARRESTED', scale: 1.5, colour: '#e5372b' }
        ],
        tag: LIKE
      });
    },

    // 9 - justice: a modern courtroom; the judge at the bench; the silhouette stands in the well; the gavel on "death";
    //     impact on "executed"
    ah40_verdict(ctx) {
      const t = ctx.t, sen = WT(ctx, 0, 2, 0.4), dth = WT(ctx, 0, 5, 1.1), y04 = WT(ctx, 0, 7, 1.5), l1 = LS(ctx, 1, 2.4), y18 = WT(ctx, 1, 2, 2.7), exe = WT(ctx, 1, 5, 3.4);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'sepia',
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.1 }, handheld: 0.4 },
        shake: [{ at: exe, amp: 5 }],
        figures: [
          { id: 'ah40_judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', expr: 'stern', noChair: true, depth: 0.33,
            keys: [{ at: dth - 0.3, pose: 'gavel', dur: 0.3 }, { at: dth + 0.15, pose: 'sit', dur: 0.15 }, { at: l1, pose: 'sit_read', dur: 0.5 }] },
          { id: 'ah40_guru', x: 860, y: 1760, scale: 0.8, dir: -1, turn: 0.1, pose: 'stand', silhouette: 'cool',
            keys: [{ at: sen, pose: 'stand_tense', dur: 0.4 }, { at: exe, pose: 'bowed', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'card', at: sen - 0.1, x: 40, y: 900, w: 640, rows: [{ text: 'SENTENCED TO DEATH · 2004', fs: 32, colour: RED, at: dth - 0.1 }, { text: 'EXECUTED · JULY 2018', fs: 32, at: y18 - 0.1 }, { text: '12 FORMER MEMBERS ALSO EXECUTED', fs: 24, colour: MUTE, at: exe + 0.2 }] },
          { type: 'impact', at: exe, x: 540, y: 600, colour: HL }
        ],
        tag: LIKE
      });
    },

    // 10 - the lesson card, then the memorial line and the callback on the hero panel in the first frame's framing; the end
    //      question is burned in over the last 3.2 s, so the lesson card has faded by then; the last frame loops to the first.
    ah40_end(ctx) {
      const t = ctx.t, T = ctx.T, les = WT(ctx, 0, 1, 0.2), gas = WT(ctx, 0, 4, 0.9), air = WT(ctx, 0, 9, 1.9), l1 = LS(ctx, 1, 3.0), rem = WT(ctx, 1, 0, 3.1);
      const cop = { ...COP, keys: [{ at: gas, pose: 'torch_low', expr: 'focused', dur: 0.4 }, { at: air, pose: 'torch', expr: 'determined', dur: 0.4 }, { at: rem, pose: 'torch', expr: 'sad', dur: 0.6 }] };
      return E.cine.shot(ctx, {
        set: 'ah40_hall', setOpts: { lit: 0.35 }, grade: 'night',
        cam: { keys: [{ x: 30, y: 90, z: 1.13 }, { at: 0.1, x: 20, y: 70, z: 1.08, dur: Math.max(1.0, l1 - 0.2) }, { at: l1, x: 0, y: 40, z: 1.0, dur: Math.max(1.0, T - l1 - 0.3) }], handheld: 0.4 },
        figures: [cop],
        props: [{ depth: 1.02, svg: tt => headgear(cop, tt, 'riot') },
          { depth: 0.95, svg: tt => panel(HERO.x, HERO.y, HERO.s, tt, { ajar: 1, beam: 1, bx: 40 * Math.sin(tt * 1.3), by: 30 * Math.sin(tt * 0.9), glow: 0.85 * seg(tt, rem - 0.2, rem + 0.3) }) },
          { depth: 1.0, svg: tt => motes(560, 1000, 300, 300, tt + (ctx.sceneStart || 0), 36, 0.6) }],
        overlays: [
          { type: 'lesson', at: les - 0.15, until: T - 3.75, y: 400, rows: [{ text: 'IN A CHEMICAL INCIDENT:', fs: 46 }, { text: 'GET OUT TO FRESH AIR.', fs: 40, colour: '#3ee07a' }, { text: 'TAKE OFF OUTER CLOTHING.', fs: 36 }, { text: 'CALL FOR HELP.', fs: 36 }] }
        ],
        tag: TAG
      });
    }
  });
})();
