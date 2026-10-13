/* Case File 39 ("Danger Zones" on the upgraded engine): the Baiyin serial killings, Gansu and Inner Mongolia, China,
   1988-2002, and Gao Chengyong (convicted 2018, executed 2019).
   Structure: a burned-in object-first headline over the HERO OBJECT (a DNA swab tube glowing in a test-tube rack on a
   night lab bench, big and centred in the first frame and again in the last, so the video loops); the map fly-in (Asia
   view to Gansu, China highlighted, a pin on Baiyin, a marker on Baotou); the evidence with no match; the cold years
   (count-up to 28 YEARS); the irony (a small grocery shop at night); THE HOW at ~55 % (the uncle's swab at a police
   counter; music drop; impact) and the Y-chromosome near-match on the lab screen (fun fact; FAMILY stamp); the arrest at
   the shop (impact, police lights); the verdict (impact) with an unnamed memorial row; the lesson card; the callback; a
   burned-in YES/NO end question.
   Look: episode.look = 'vivid' with varied bright grades (neon, tokyo, cold, night, warm, sepia); every shot has a
   continuous eased camera move plus handheld 0.3-0.6; a rotating DNA helix, scanning traces, flickering tubes, dust.
   Content rules:
   - Gao (by39_gao) is ONLY an anonymous rim-lit silhouette (NOT A LIKENESS); never near a victim or any crime.
   - The uncle (by39_uncle) is never named and is ONLY a silhouette. Gao's wife is never shown.
   - Victims are never named, drawn or described; no violence, method, weapon or injury anywhere.
   - Generic drawings only: the shop sign is a blank red board, the station and lab carry no insignia, crest, logo or
     lettering; the only text is our own typed cards and the generic trace labels on the lab screen.
   New environments (E.registerSets): by39_bench (a DNA lab at night: teal glass wall, glowing reagent shelves, a wall
   screen that can show two Y-chromosome traces lining up, a white epoxy bench), by39_shop (a small grocery shop on a
   northwest-China town street at night: dusky sky, bare hills and a chimney stack, a lit doorway and window with
   shelves, fruit crates, a blank red sign board; o.police tints the facade red/blue), by39_station (a police station
   front counter: mint-green walls, a fluorescent panel, a window with blinds, a plain wall clock, a counter).
   Plus the engine's mapflight, lab, task_force and courtroom (modern). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#0d0f12';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · ANONYMOUS FIGURES';
  const GAO = 'ILLUSTRATION · NOT A LIKENESS';
  const YEL = '#ffd23f', RED = '#8e1f18', MUTE = '#6b665c', HL = '#ff3b5c', TEAL = '#3ee8ff';

  // ---------- a rotating DNA double helix (hologram), centred on x, from y0 (bottom) up h px; k 0..1 = opacity
  function helix(x, y0, h, t, k, col = TEAL) {
    if (k <= 0) return ''; let a = '', b = '', rungs = ''; const n = 40;
    for (let i = 0; i <= n; i++) {
      const u = i / n, y = y0 - u * h, ph = u * Math.PI * 4 + t * 2.2, w = 70 * (0.6 + 0.4 * u);
      const xa = x + Math.sin(ph) * w, xb = x + Math.sin(ph + Math.PI) * w;
      a += (i ? 'L' : 'M') + f1(xa) + ' ' + f1(y); b += (i ? 'L' : 'M') + f1(xb) + ' ' + f1(y);
      if (i % 2 === 0) rungs += `<line x1="${f1(xa)}" y1="${f1(y)}" x2="${f1(xb)}" y2="${f1(y)}" stroke="${i % 4 ? '#ff5ac8' : YEL}" stroke-width="5" opacity="${f1(0.35 + 0.4 * Math.abs(Math.cos(ph)))}"/>`;
    }
    return `<g opacity="${f1(k)}">${wash(x, y0 - h / 2, 160, h * 0.6, col, 0.22)}${rungs}<path d="${a}" stroke="${col}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="${b}" stroke="#ff5ac8" stroke-width="8" fill="none" stroke-linecap="round"/></g>`;
  }

  // ---------- THE HERO: a lab test-tube rack (white steel) holding four small coloured tubes and, in the centre, a tall
  // clear DNA swab tube: red screw cap, a white stick with a cotton tip inside, a blank label with generic bars. Base
  // centre (x, y) sits on the bench; ~760 wide x ~640 tall at s = 1. o.glow 0..1 = yellow dashed outline; o.light 0..1 =
  // the tube's teal inner glow; o.helix 0..1 = the hologram helix rising above it; o.lift 0..1 lifts the centre tube.
  function rack(x, y, s, t, o = {}) {
    const k = o.glow || 0, li = o.light ?? 0.6, lift = (o.lift || 0) * 120;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="6" rx="420" ry="30" fill="#000" opacity="0.45"/>`;
    if (k > 0) { const kk = k * (0.8 + 0.2 * Math.sin(t * 7)); g += wash(0, -320, 520, 420, YEL, f1(0.42 * kk)) + `<ellipse cx="0" cy="-330" rx="${f1(300 + 20 * Math.sin(t * 5))}" ry="${f1(400 + 16 * Math.sin(t * 5))}" fill="none" stroke="${YEL}" stroke-width="8" stroke-dasharray="26 18" opacity="${f1(0.85 * kk)}"/>`; }
    g += wash(0, -300, 260, 360, TEAL, f1(0.25 * li));
    // the rack's back legs and base plate
    g += `<rect x="-380" y="-24" width="760" height="24" rx="8" fill="#dfe6ec" stroke="${INK}" stroke-width="5"/><rect x="-370" y="-250" width="18" height="230" fill="#aab4bc" stroke="${INK}" stroke-width="3"/><rect x="352" y="-250" width="18" height="230" fill="#aab4bc" stroke="${INK}" stroke-width="3"/>`;
    // small tubes (behind the top plate's front edge): coloured liquids with a meniscus and a shine
    const small = (cx, col, lv, cap) => `<rect x="${cx - 34}" y="-330" width="68" height="300" rx="34" fill="#e8f6ff" fill-opacity="0.22" stroke="#d8eef8" stroke-width="4"/>` +
      `<path d="M${cx - 30} ${-30 - lv} L${cx + 30} ${-30 - lv} L${cx + 30} -64 A30 30 0 0 1 ${cx - 30} -64 Z" fill="${col}" opacity="0.85"/><ellipse cx="${cx}" cy="${-30 - lv}" rx="30" ry="7" fill="#ffffff" opacity="0.35"/>` +
      `<rect x="${cx - 38}" y="-356" width="76" height="34" rx="6" fill="${cap}" stroke="${INK}" stroke-width="4"/><path d="M${cx - 20} -310 L${cx - 20} -80" stroke="#ffffff" stroke-width="6" opacity="0.45" stroke-linecap="round"/>`;
    g += small(-280, '#4a8cff', 150 + 6 * Math.sin(t * 2), '#2a5ad0') + small(-160, '#ff4fa8', 110, '#c02a7a') + small(160, '#3ee07a', 170, '#1e9a50') + small(280, '#ffb347', 120, '#d07a1a');
    // the centre swab tube (taller, lifts on o.lift)
    const ty = -lift, fl = 0.85 + 0.15 * Math.sin(t * 9) * Math.sin(t * 3.3);
    g += `<g transform="translate(0 ${f1(ty)})">` + wash(0, -340, 120, 300, TEAL, f1(0.5 * li * fl));
    g += `<rect x="-58" y="-600" width="116" height="590" rx="58" fill="#dff8ff" fill-opacity="${f1(0.18 + 0.12 * li)}" stroke="#e8fbff" stroke-width="6"/>`;
    g += `<path d="M-8 -560 L-8 -140" stroke="#f4efe2" stroke-width="16" stroke-linecap="round"/><path d="M-8 -560 L-8 -140" stroke="#c8bfa8" stroke-width="4" opacity="0.6"/>`;
    g += `<ellipse cx="-8" cy="-104" rx="30" ry="52" fill="#ffffff" stroke="#cfd8de" stroke-width="4"/><ellipse cx="-16" cy="-118" rx="10" ry="22" fill="#ffffff" opacity="0.9"/>`;
    g += `<rect x="-60" y="-420" width="120" height="130" rx="6" fill="#f6f6f2" stroke="#9aa4ac" stroke-width="3"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `<rect x="${-46 + i * 8}" y="-406" width="${i % 3 ? 3 : 5}" height="56" fill="#2a2e34"/>`).join('') +
      `<rect x="-46" y="-336" width="92" height="8" fill="#b8c0c6"/><rect x="-46" y="-318" width="60" height="8" fill="#b8c0c6"/>`;
    g += `<path d="M-48 -560 L-48 -60" stroke="#ffffff" stroke-width="10" opacity="0.5" stroke-linecap="round"/><path d="M40 -540 L40 -120" stroke="#ffffff" stroke-width="5" opacity="0.3" stroke-linecap="round"/>`;
    g += `<rect x="-70" y="-660" width="140" height="70" rx="12" fill="#e5372b" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${-58 + i * 26}" y="-652" width="10" height="54" rx="4" fill="#ff7a6a" opacity="0.7"/>`).join('');
    g += `</g>`;
    // the top plate (front), with holes the tubes pass through, and the front legs
    g += `<rect x="-390" y="-240" width="780" height="44" rx="10" fill="#eef3f6" stroke="${INK}" stroke-width="6"/>` + [-280, -160, 0, 160, 280].map(cx => `<ellipse cx="${cx}" cy="-218" rx="${cx ? 40 : 64}" ry="10" fill="#9aa4ac" opacity="0.6"/>`).join('');
    g += `<rect x="-372" y="-200" width="22" height="180" fill="#cfd8de" stroke="${INK}" stroke-width="4"/><rect x="350" y="-200" width="22" height="180" fill="#cfd8de" stroke="${INK}" stroke-width="4"/>`;
    if (o.helix > 0) g += helix(0, -700 - lift, 420, t, o.helix);
    return g + '</g>';
  }

  // the bench screen's two Y-chromosome traces: top = the crime-scene profile, bottom = the relative's; m 0..1 slides the
  // bottom peaks onto the top ones (a near match: one peak stays a little off); scan 0..1 = the scanning line
  function traces(x, y, w, h, t, m, scan) {
    const r = R(3907); const P = [0.08, 0.17, 0.29, 0.36, 0.48, 0.57, 0.66, 0.78, 0.87, 0.94];
    const off = P.map(() => (r() - 0.5) * 0.12); const hgt = P.map(() => 0.45 + r() * 0.5); const hb = P.map((_, i) => hgt[i] * (0.8 + r() * 0.3));
    const tr = (yy, hh, pos, amp, col) => { let d = `M${x + 20} ${yy}`; const n = 220;
      for (let i = 0; i <= n; i++) { const u = i / n; let v = 0; pos.forEach((p, j) => { v += amp[j] * Math.exp(-Math.pow((u - p) / 0.012, 2)); }); v += 0.03 * Math.sin(u * 90 + t * 3); d += ` L${f1(x + 20 + u * (w - 40))} ${f1(yy - v * hh)}`; }
      return `<path d="${d}" stroke="${col}" stroke-width="5" fill="none" stroke-linejoin="round"/>`; };
    const bot = P.map((p, i) => p + off[i] * (1 - m) + (i === 6 ? 0.012 * m : 0));
    let g = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#04131c" stroke="#2a4a5a" stroke-width="6"/>`;
    for (let i = 1; i < 8; i++) g += `<line x1="${x + (w * i) / 8}" y1="${y + 10}" x2="${x + (w * i) / 8}" y2="${y + h - 10}" stroke="#1d3a48" stroke-width="2"/>`;
    g += `<text x="${x + 24}" y="${y + 44}" font-family="Nunito" font-weight="800" font-size="30" fill="${TEAL}" letter-spacing="3">SCENE DNA · Y</text>`;
    g += `<text x="${x + 24}" y="${y + h / 2 + 44}" font-family="Nunito" font-weight="800" font-size="30" fill="#ff7ad8" letter-spacing="3">RELATIVE · Y</text>`;
    g += tr(y + h / 2 - 16, h / 2 - 70, P, hgt, TEAL) + tr(y + h - 16, h / 2 - 70, bot, hb, '#ff7ad8');
    if (m > 0.7) P.forEach((p, i) => { const q = clamp((m - 0.7) / 0.3, 0, 1); g += `<rect x="${f1(x + 20 + p * (w - 40) - 12)}" y="${y + 56}" width="24" height="${h - 72}" fill="${YEL}" opacity="${f1(0.18 * q)}"/>`; });
    if (scan > 0 && scan < 1) { const sx = x + 20 + scan * (w - 40); g += `<line x1="${f1(sx)}" y1="${y + 8}" x2="${f1(sx)}" y2="${y + h - 8}" stroke="#ffffff" stroke-width="4" opacity="0.8"/>` + wash(sx, y + h / 2, 40, h / 2, '#ffffff', 0.25); }
    return g;
  }

  // a generic peaked-cap-free police light bar glow for the shop street (screen-space red/blue wash on the facade)
  function strobe(t, k) {
    if (k <= 0) return ''; const a = Math.max(0, Math.sin(t * 10)), b = Math.max(0, Math.sin(t * 10 + Math.PI));
    return wash(200, 1000, 520, 500, '#ff2a3a', f1(0.35 * k * a)) + wash(880, 1000, 520, 500, '#2a6aff', f1(0.35 * k * b));
  }

  // cabinet fronts below a bench top at y0 (drawers with pulls, a glossy floor), for the lab-style shots
  function cabinets(y0, c1 = '#183640', c2 = '#1e4450') {
    let g = '';
    for (let i = 0; i < 6; i++) { const cx = -220 + i * 290; g += `<rect x="${cx}" y="${y0 + 30}" width="270" height="260" rx="10" fill="${c1}" stroke="#0a1418" stroke-width="5"/><rect x="${cx + 12}" y="${y0 + 42}" width="246" height="100" rx="6" fill="${c2}"/><rect x="${cx + 95}" y="${y0 + 82}" width="80" height="14" rx="7" fill="#c8d6dc"/><rect x="${cx + 95}" y="${y0 + 210}" width="80" height="14" rx="7" fill="#c8d6dc"/>`; }
    return g + `<rect x="-300" y="${y0 + 300}" width="${W + 600}" height="${H}" fill="#0a1216"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${-200 + i * 320}" y="${y0 + 320}" width="180" height="8" fill="${TEAL}" opacity="0.12"/>`).join('');
  }
  // generic evidence on a bench top at y: a sealed plain evidence bag, a fingerprint card, a small sample box
  function evidence(y) {
    let g = `<g transform="translate(120 ${y}) rotate(-4)"><rect x="-80" y="-10" width="160" height="200" rx="6" fill="#e8f0f4" fill-opacity="0.55" stroke="#b8c8d0" stroke-width="4"/><rect x="-80" y="-10" width="160" height="26" fill="#e5372b" opacity="0.85"/><rect x="-50" y="40" width="100" height="110" fill="#c8b89a" opacity="0.6"/></g>`;
    g += `<g transform="translate(560 ${y + 40}) rotate(3)"><rect x="-110" y="-20" width="220" height="130" fill="#f4f0e4" stroke="#0d0f12" stroke-width="4"/>` + [0, 1, 2, 3].map(i => `<g transform="translate(${-80 + i * 52} 30)">${[0, 1, 2, 3, 4].map(j => `<ellipse cx="0" cy="0" rx="${5 + j * 4}" ry="${7 + j * 5}" fill="none" stroke="#3a3a46" stroke-width="2"/>`).join('')}</g>`).join('') + `</g>`;
    g += `<g transform="translate(940 ${y + 30})"><rect x="-90" y="-10" width="180" height="90" rx="8" fill="#3a8aff" stroke="#0d0f12" stroke-width="4"/><rect x="-80" y="-24" width="160" height="22" rx="6" fill="#2a5ad0" stroke="#0d0f12" stroke-width="3"/></g>`;
    return g;
  }

  // foreground archive boxes and a folder stack for the cold-case room (plain, no lettering)
  function boxes() {
    let g = '';
    [[-60, 1560, -3], [170, 1600, 2], [760, 1590, -2], [990, 1560, 3]].forEach(([x, y, a], i) => {
      g += `<g transform="rotate(${a} ${x} ${y})"><rect x="${x - 120}" y="${y}" width="240" height="220" fill="${i % 2 ? '#b08a5a' : '#c49a64'}" stroke="${INK}" stroke-width="6"/><rect x="${x - 128}" y="${y - 24}" width="256" height="40" fill="#d4ae78" stroke="${INK}" stroke-width="5"/><rect x="${x - 40}" y="${y + 60}" width="80" height="30" rx="12" fill="#5a4026"/><rect x="${x - 90}" y="${y + 130}" width="180" height="56" fill="#f4f0e4" stroke="${INK}" stroke-width="3"/></g>`; });
    g += `<g transform="translate(470 1560) rotate(-5)">` + [0, 1, 2, 3].map(i => `<rect x="${-130 + i * 6}" y="${-i * 26}" width="260" height="24" fill="${['#d8c08a', '#8aa0c8', '#c8a07a', '#e0d0a0'][i]}" stroke="${INK}" stroke-width="3"/>`).join('') + `</g>`;
    return g + `<rect x="-300" y="1800" width="${W + 600}" height="${H}" fill="#120e0c" opacity="0.7"/>`;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a DNA lab at night (generic): teal-black glass wall, ceiling strip lights, shelves of glowing reagent bottles, a
    // wall screen (o.screen 0..1 shows the two traces; o.match 0..1, o.scan 0..1), a white epoxy bench in front.
    by39_bench(ctx, o = {}) {
      const t = ctx.t, r = R(3901), scr = o.screen || 0;
      let back = `<defs><linearGradient id="bybg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03141c"/><stop offset="0.6" stop-color="#0a3442"/><stop offset="1" stop-color="#0e4656"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#bybg)"/>`;
      for (let x = -300; x < W + 300; x += 240) back += `<rect x="${x}" y="120" width="8" height="1300" fill="#1e5868" opacity="0.6"/>`;
      back += [0, 1, 2].map(i => `<rect x="${-200 + i * 520}" y="80" width="380" height="20" rx="8" fill="#e8fbff" opacity="0.85"/>` + wash(-10 + i * 520, 110, 300, 90, '#bff4ff', 0.3)).join('');
      // shelves with glowing bottles (left and right), a sequencer box
      let shelves = '';
      [[-160, 260], [-160, 470], [760, 260], [760, 470]].forEach(([sx, sy], j) => {
        shelves += `<rect x="${sx}" y="${sy}" width="${j < 2 ? 520 : 600}" height="14" fill="#2a6a7a"/>`;
        for (let i = 0; i < 6; i++) { const bx = sx + 30 + i * 80, bh = 70 + r() * 70, col = ['#3ee8ff', '#ff5ac8', '#9dff6a', '#ffd23f', '#7a8bff'][(i + j) % 5];
          shelves += `<rect x="${f1(bx)}" y="${f1(sy - bh)}" width="44" height="${f1(bh)}" rx="10" fill="${col}" opacity="${f1(0.45 + 0.2 * Math.sin(t * 1.7 + i + j))}" stroke="#bff4ff" stroke-width="2"/>`; }
      });
      shelves += `<rect x="-120" y="720" width="380" height="300" rx="16" fill="#16323e" stroke="#2a5a6a" stroke-width="5"/><rect x="-90" y="760" width="220" height="60" rx="8" fill="#06202a"/><rect x="-80" y="772" width="${f1(80 + 100 * ((t * 0.4) % 1))}" height="36" rx="4" fill="#3ee07a" opacity="0.8"/>` +
        [0, 1, 2].map(i => `<circle cx="${180 + i * 0}" cy="${790 + i * 60}" r="12" fill="${['#3ee07a', '#ffd23f', '#ff3b5c'][i]}" opacity="${f1(0.5 + 0.5 * Math.max(0, Math.sin(t * 3 + i * 2)))}"/>`).join('');
      // the wall screen (right): idle noise or the two traces
      let screen = `<rect x="330" y="640" width="720" height="460" rx="20" fill="#0b1a22" stroke="#3a6a7a" stroke-width="8"/>`;
      if (scr > 0) screen += `<g opacity="${f1(scr)}">${traces(350, 660, 680, 420, t, o.match || 0, o.scan || 0)}</g>`;
      else { for (let i = 0; i < 5; i++) screen += `<rect x="370" y="${690 + i * 76}" width="${f1(300 + 260 * Math.abs(Math.sin(t * 0.7 + i)))}" height="26" rx="6" fill="${TEAL}" opacity="0.28"/>`; }
      screen += wash(690, 870, 420, 300, TEAL, 0.12 + 0.1 * scr);
      // the bench: white epoxy top and a dark front, a pipette, a notebook, reflections
      let bench = `<rect x="-300" y="1360" width="${W + 600}" height="62" fill="#eef4f6" stroke="${INK}" stroke-width="6"/><rect x="-300" y="1422" width="${W + 600}" height="${H}" fill="#12262e"/>` +
        `<rect x="-300" y="1360" width="${W + 600}" height="14" fill="#ffffff" opacity="0.7"/>` + wash(540, 1390, 520, 50, TEAL, 0.25);
      bench += `<g transform="translate(110 1366) rotate(-8)"><rect x="-20" y="-200" width="40" height="190" rx="14" fill="#f4f6f8" stroke="${INK}" stroke-width="4"/><rect x="-10" y="-220" width="20" height="30" fill="#3a8aff"/><path d="M0 -10 L0 30" stroke="#d8dee2" stroke-width="8"/></g>`;
      bench += `<g transform="translate(930 1368) rotate(6)"><rect x="-90" y="-20" width="180" height="24" fill="#ffd23f" stroke="${INK}" stroke-width="4"/><rect x="-84" y="-30" width="168" height="12" fill="#f4efe2" stroke="${INK}" stroke-width="3"/></g>`;
      // cabinet fronts under the bench: drawers with chrome pulls, a teal under-glow strip, a glossy floor
      bench += `<rect x="-300" y="1422" width="${W + 600}" height="16" fill="${TEAL}" opacity="0.35"/>` + wash(540, 1440, 700, 50, TEAL, 0.3);
      for (let i = 0; i < 6; i++) { const cx = -220 + i * 290; bench += `<rect x="${cx}" y="1460" width="270" height="250" rx="10" fill="#183640" stroke="#0a1a20" stroke-width="5"/><rect x="${cx + 12}" y="1472" width="246" height="100" rx="6" fill="#1e4450"/><rect x="${cx + 95}" y="1512" width="80" height="14" rx="7" fill="#c8d6dc"/><rect x="${cx + 95}" y="1630" width="80" height="14" rx="7" fill="#c8d6dc"/>`; }
      bench += `<rect x="-300" y="1720" width="${W + 600}" height="${H}" fill="#0a161c"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${-200 + i * 320}" y="1740" width="180" height="8" fill="${TEAL}" opacity="0.15"/>`).join('') + wash(540, 1780, 600, 80, '#ff5ac8', 0.12);
      return { light: { dir: 1, rim: '#7ff0ff', key: '#d8fbff' }, layers: [[0.1, back], [0.35, shelves], [0.5, screen], [1.04, bench]], dust: true };
    },

    // a small grocery shop on a northwest-China town street at night (generic): dusky violet-orange sky, bare brown hills
    // and a distant chimney stack, a row of low brick buildings; the shop: a lit doorway and window with shelves of
    // colourful goods, a hanging bulb, a half-raised roller shutter, fruit crates, a BLANK red sign board; a pavement and
    // street. o.police 0..1 = red/blue strobe on the facade; o.dark deepens the sky.
    by39_shop(ctx, o = {}) {
      const t = ctx.t, r = R(3902), dk = o.dark || 0;
      let sky = `<defs><linearGradient id="bysk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dk > 0.5 ? '#07061a' : '#120c2e'}"/><stop offset="0.45" stop-color="#3a2060"/><stop offset="0.78" stop-color="#b04a6a"/><stop offset="1" stop-color="#ff9a5a"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#bysk)"/>`;
      for (let i = 0; i < 30; i++) sky += `<circle cx="${f1(-200 + r() * 1500)}" cy="${f1(-150 + r() * 460)}" r="${f1(1.2 + r() * 1.8)}" fill="#fff" opacity="${f1(0.3 + 0.3 * Math.sin(t * (1 + r() * 2) + i))}"/>`;
      let hills = `<path d="M-300 640 L-120 520 L60 590 L260 470 L470 560 L640 480 L860 570 L1040 500 L1380 600 L1380 760 L-300 760 Z" fill="#4a2a4a"/><path d="M-300 700 L0 620 L300 680 L620 610 L900 690 L1380 640 L1380 800 L-300 800 Z" fill="#3a2240"/>`;
      hills += `<rect x="960" y="430" width="40" height="300" fill="#2a1a34"/>` + [0, 1, 2, 3].map(i => { const ph = (t * 0.1 + i * 0.25) % 1; return `<circle cx="${f1(980 + ph * 80)}" cy="${f1(420 - ph * 220)}" r="${f1(18 + ph * 60)}" fill="#c8a0c0" opacity="${f1(0.26 * (1 - ph))}"/>`; }).join('');
      // neighbouring low buildings with a few lit windows
      let row = '';
      [[-300, 600, 330], [960, 640, 440]].forEach(([x, y, w], j) => { row += `<rect x="${x}" y="${y}" width="${w}" height="${1320 - y}" fill="${j ? '#3a2a3a' : '#33263a'}" stroke="${INK}" stroke-width="4"/>`;
        for (let i = 0; i < 4; i++) row += `<rect x="${x + 40 + (i % 2) * 140}" y="${y + 60 + Math.floor(i / 2) * 180}" width="90" height="110" fill="#ffd98a" opacity="${f1(i === 1 || i === 2 ? 0.55 + 0.1 * Math.sin(t + i + j) : 0.12)}"/>`; });
      // the shop facade: brick, a blank red sign board, the lit doorway and window
      let shop = `<rect x="30" y="560" width="930" height="760" fill="#8a4a3a" stroke="${INK}" stroke-width="6"/>`;
      for (let yy = 580; yy < 1320; yy += 34) for (let xx = 30 + ((yy / 34) % 2 ? 0 : 30); xx < 960; xx += 60) shop += `<rect x="${xx}" y="${yy}" width="56" height="30" fill="#9a5644" opacity="${f1(0.4 + 0.3 * ((xx * 7 + yy) % 5) / 5)}"/>`;
      shop += `<rect x="20" y="540" width="950" height="30" fill="#5a3a30" stroke="${INK}" stroke-width="5"/>`;
      shop += `<rect x="80" y="596" width="830" height="110" rx="6" fill="#d8262e" stroke="${INK}" stroke-width="6"/><rect x="96" y="610" width="798" height="82" rx="4" fill="none" stroke="#ffd23f" stroke-width="4" opacity="0.8"/>` + wash(495, 650, 460, 90, '#ff4a4a', 0.35);
      // window (left): shelves of goods
      shop += `<rect x="90" y="760" width="330" height="400" fill="#ffcf7a" stroke="${INK}" stroke-width="7"/>` + wash(255, 960, 220, 220, '#fff0b0', 0.5);
      for (let s = 0; s < 3; s++) { const yy = 860 + s * 110; shop += `<rect x="96" y="${yy}" width="318" height="10" fill="#6a4a2a"/>`;
        for (let i = 0; i < 6; i++) shop += `<rect x="${104 + i * 52}" y="${yy - 70 + (i % 2) * 14}" width="42" height="${70 - (i % 2) * 14}" rx="4" fill="${['#e5372b', '#3a8aff', '#ffd23f', '#3ee07a', '#ff7ad8', '#ff9a3a'][(i + s) % 6]}" stroke="${INK}" stroke-width="2"/>`; }
      shop += `<path d="M110 780 L200 1140" stroke="#ffffff" stroke-width="10" opacity="0.18"/>`;
      // doorway (centre-right): warm interior, back shelves, a glowing drinks fridge, a counter, a hanging bulb
      shop += `<rect x="470" y="720" width="300" height="600" fill="#ffb04a" stroke="${INK}" stroke-width="8"/>` + wash(620, 980, 260, 340, '#fff0b0', 0.55);
      for (let s = 0; s < 4; s++) { const yy = 820 + s * 100; shop += `<rect x="480" y="${yy}" width="140" height="8" fill="#6a4a2a"/>`;
        for (let i = 0; i < 3; i++) shop += `<rect x="${486 + i * 44}" y="${yy - 56}" width="36" height="56" rx="4" fill="${['#3a8aff', '#e5372b', '#ffd23f', '#3ee07a'][(i + s) % 4]}" opacity="0.9"/>`; }
      shop += `<rect x="640" y="760" width="120" height="420" rx="8" fill="#bfeaff" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3].map(i => `<rect x="650" y="${780 + i * 96}" width="100" height="80" fill="#e8fbff" opacity="0.6"/>`).join('') + wash(700, 960, 90, 220, '#bff4ff', 0.4);
      shop += `<path d="M560 720 L560 760" stroke="#2a1a10" stroke-width="4"/><circle cx="560" cy="774" r="16" fill="#fff6c8"/>` + wash(560, 780, 120, 100, '#fff6c8', f1(0.5 + 0.08 * Math.sin(t * 13)));
      // half-raised roller shutter over the doorway and the window
      shop += `<rect x="460" y="712" width="320" height="34" fill="#9aa0a8" stroke="${INK}" stroke-width="5"/><rect x="80" y="742" width="350" height="26" fill="#9aa0a8" stroke="${INK}" stroke-width="4"/>`;
      // right window (dim) and a plain air-con box
      shop += `<rect x="810" y="780" width="120" height="260" fill="#ffd98a" opacity="0.6" stroke="${INK}" stroke-width="5"/><rect x="820" y="1080" width="110" height="80" rx="6" fill="#d8dce0" stroke="${INK}" stroke-width="4"/>`;
      if (o.police > 0) shop += strobe(t, o.police);
      // pavement, kerb, street, crates of fruit outside the window
      let ground = `<rect x="-300" y="1320" width="${W + 600}" height="120" fill="#5a4a50"/><rect x="-300" y="1440" width="${W + 600}" height="18" fill="#8a7a80"/><rect x="-300" y="1458" width="${W + 600}" height="${H}" fill="#1e1a24"/>` + wash(600, 1380, 420, 80, '#ffb04a', 0.35);
      [[120, '#ff9a3a'], [240, '#e5372b'], [360, '#ffd23f']].forEach(([cx, col], i) => { ground += `<rect x="${cx - 56}" y="${1262 - (i % 2) * 6}" width="112" height="70" fill="#a8743a" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2, 3].map(j => `<circle cx="${cx - 36 + j * 24}" cy="${1258 - (i % 2) * 6}" r="14" fill="${col}" stroke="${INK}" stroke-width="2"/>`).join(''); });
      // road dashes in perspective, a parked bicycle on the pavement (left), a streetlamp with a halo (right)
      for (let i = 0; i < 6; i++) ground += `<rect x="${-260 + i * 260}" y="${1640 + (i % 2) * 6}" width="160" height="18" rx="4" fill="#e8dcc0" opacity="0.4"/>`;
      ground += `<g transform="translate(860 1440)" stroke="#1a1416" stroke-width="9" fill="none"><circle cx="-70" cy="-62" r="62"/><circle cx="90" cy="-62" r="62"/><path d="M-70 -62 L-10 -150 L70 -150 L90 -62 M-10 -150 L10 -62 L70 -150 M-24 -170 L6 -170 M60 -176 L86 -186"/></g>`;
      ground += `<rect x="1010" y="700" width="16" height="760" fill="#1a1416"/><path d="M1018 700 Q 1018 660 960 660" stroke="#1a1416" stroke-width="12" fill="none"/><ellipse cx="950" cy="672" rx="40" ry="14" fill="#fff4d0"/>` + wash(950, 720, 220, 200, '#ffe0b0', 0.35) + wash(950, 1460, 260, 60, '#ffe0b0', 0.25);
      for (let i = 0; i < 8; i++) { const px = -200 + r() * 1500, py = 1500 + r() * 400; ground += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(60 + r() * 100)}" ry="8" fill="${o.police > 0 ? '#ff6a8a' : '#ffb98a'}" opacity="${f1(0.1 + 0.08 * Math.sin(t * 3 + i))}"/>`; }
      return { light: { dir: -1, rim: o.police > 0.3 ? '#ff7aa0' : '#ffc890', key: '#ffe0b0' }, layers: [[0.05, sky], [0.15, hills], [0.4, row], [0.6, shop], [1.0, ground]] };
    },

    // a police station front counter (generic): mint-green walls over a darker dado, a fluorescent ceiling panel, a window
    // with blinds onto the night, a plain wall clock, a pin board of blank notices, a grey counter across the foreground.
    by39_station(ctx, o = {}) {
      const t = ctx.t;
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#9ed2c0"/><rect x="-300" y="900" width="${W + 600}" height="600" fill="#4e8a7a"/><rect x="-300" y="890" width="${W + 600}" height="16" fill="#e8f4ee"/>`;
      wall += `<rect x="-100" y="60" width="1280" height="40" rx="10" fill="#f4fff8"/>` + wash(540, 120, 700, 160, '#f4fff8', f1(0.4 + 0.04 * Math.sin(t * 37)));
      // the window with blinds (left) onto a violet night
      wall += `<rect x="-40" y="260" width="420" height="520" fill="#2a1a5a" stroke="${INK}" stroke-width="8"/>` + wash(170, 520, 200, 240, '#7a5aff', 0.3) + [...Array(13)].map((_, i) => `<rect x="-36" y="${270 + i * 40}" width="412" height="20" fill="#d8e8e0" opacity="0.75"/>`).join('');
      // pin board of blank notices, the clock
      wall += `<rect x="560" y="300" width="380" height="300" fill="#b08a5a" stroke="${INK}" stroke-width="6"/>` + [[590, 330, -3], [720, 320, 4], [830, 350, -2], [610, 460, 2], [760, 450, -4]].map(([x, y, a]) => `<g transform="rotate(${a} ${x + 50} ${y + 60})"><rect x="${x}" y="${y}" width="100" height="120" fill="#f4f0e4" stroke="${INK}" stroke-width="2"/><rect x="${x + 12}" y="${y + 18}" width="76" height="8" fill="#b8b2a4"/><rect x="${x + 12}" y="${y + 36}" width="56" height="8" fill="#b8b2a4"/><circle cx="${x + 50}" cy="${y + 6}" r="6" fill="#e5372b"/></g>`).join('');
      const mn = 40 + (t * 0.5) % 1; const rad = a => a * Math.PI / 180;
      wall += `<circle cx="1000" cy="200" r="54" fill="#f4f0e4" stroke="${INK}" stroke-width="7"/><line x1="1000" y1="200" x2="${f1(1000 + Math.sin(rad(9 * 30 + mn * 0.5)) * 26)}" y2="${f1(200 - Math.cos(rad(9 * 30 + mn * 0.5)) * 26)}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><line x1="1000" y1="200" x2="${f1(1000 + Math.sin(rad(mn * 6)) * 40)}" y2="${f1(200 - Math.cos(rad(mn * 6)) * 40)}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
      // the counter (foreground)
      const counter = `<rect x="-300" y="1330" width="${W + 600}" height="50" fill="#c8ccd0" stroke="${INK}" stroke-width="6"/><rect x="-300" y="1380" width="${W + 600}" height="${H}" fill="#6a7278"/>` +
        [0, 1, 2, 3, 4, 5].map(i => `<rect x="${-200 + i * 260}" y="1400" width="220" height="400" fill="#5a6268" stroke="${INK}" stroke-width="3"/>`).join('') + `<rect x="-300" y="1330" width="${W + 600}" height="10" fill="#ffffff" opacity="0.6"/>`;
      return { light: { dir: 1, rim: '#d8fff0', key: '#f4fff8' }, layers: [[0.2, wall], [1.0, ''], [1.05, counter]] };
    }
  });

  // map projection helper mirroring the engine's mapflight maths (for a marker drawn as a prop at depth 0)
  function mapXY(ctx, o, ll) {
    const t0 = o.t0 ?? 0, t1 = o.t1 ?? ctx.T; const p = ease.inOut(clamp((ctx.t - t0) / Math.max(0.01, t1 - t0), 0, 1)); const A = o.from, B = o.to;
    const span = Math.exp(lerp(Math.log(A.span), Math.log(B.span), p)), lon0 = lerp(A.center[0], B.center[0], p), lat0 = lerp(A.center[1], B.center[1], p);
    const k = W / span, cl = Math.cos(lat0 * Math.PI / 180), cy = H * (o.cy ?? 0.44);
    return [W / 2 + (ll[0] - lon0) * cl * k, cy - (ll[1] - lat0) * k];
  }

  // the hero rack's framing in the first and the last shot (the loop): big and centred on the bench
  const HERO = { x: 560, y: 1400, s: 0.88 };
  const SCI = { id: 'by39_sci', x: 110, y: 1720, scale: 0.9, dir: 1, turn: 0.5, pose: 'stand', expr: 'focused', depth: 1.0 };

  E.registerScenes({
    // 1 - hook: the glowing swab tube in the rack, a DNA helix rising; the scientist beside it reacts. The headline is
    //     burned in by the engine (until ~3.2 s); nothing else sits in y 380-720 before then.
    by39_hook(ctx) {
      const t = ctx.t, yrs = WT(ctx, 0, 2, 1.3), kil = WT(ctx, 0, 4, 1.9), fnd = WT(ctx, 0, 10, 3.5), l1 = LS(ctx, 1, 4.4), unc = WT(ctx, 1, 1, 4.6), dna = WT(ctx, 1, 2, 4.8), gave = WT(ctx, 1, 6, 5.6);
      const sci = { ...SCI, keys: [{ at: kil, pose: 'stand_tense', expr: 'worried', gaze: [0.8, -0.2], dur: 0.4 }, { at: fnd, pose: 'hands_together', expr: 'sad', dur: 0.5 }, { at: unc, pose: 'examine', expr: 'realise', gaze: [0.9, -0.3], dur: 0.4 }, { at: gave, pose: 'point', expr: 'determined', gaze: [0.9, -0.4], dur: 0.4 }] };
      return E.cine.shot(ctx, {
        set: 'by39_bench', grade: 'neon',
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 10, y: 30, z: 1.08 }, handheld: 0.4 },
        shake: [{ at: dna, amp: 3 }],
        figures: [sci],
        props: [{ depth: 1.06, svg: tt => rack(HERO.x, HERO.y, HERO.s, tt + (ctx.sceneStart || 0), { light: 0.6 + 0.4 * seg(tt, l1, dna), glow: 0.85 * seg(tt, dna - 0.1, dna + 0.3) * (1 - seg(tt, gave + 0.6, gave + 1.2)), helix: 0.35 + 0.65 * seg(tt, unc - 0.2, dna + 0.3), lift: 0.3 * ease.inOut(seg(tt, dna - 0.2, dna + 0.6)) }) }],
        overlays: [
          { type: 'impact', at: dna, x: 540, y: 1000, colour: TEAL }
        ],
        tag: 'ILLUSTRATION · NOT A PHOTOGRAPH'
      });
    },

    // 2 - where: the map fly-in, Asia to Gansu; China glows; the pin lands on Baiyin; a marker and label on Baotou
    by39_map(ctx) {
      const T = ctx.T, by = WT(ctx, 0, 7, 2.4), bt = WT(ctx, 0, 9, 2.9), y88 = WT(ctx, 0, 11, 3.6);
      const mo = { geo: 'asia', from: { center: [104, 33], span: 64 }, to: { center: [106, 37.5], span: 22 }, t0: 0.05, t1: Math.max(by + 0.3, 2.6),
        country: 'China', hl: HL, country_at: 0.35, pin: { ll: [104.17, 36.55], label: 'BAIYIN, GANSU', at: by - 0.15, dx: 36, dy: 70, fs: 50 },
        labels: [{ ll: [101, 33], text: 'CHINA', at: 0.2, fs: 56 }, { ll: [137.5, 37.5], text: 'JAPAN', at: 0.3, fs: 34 }, { ll: [110, 44], text: 'INNER MONGOLIA', at: 1.4, fs: 32 }] };
      const marker = tt => { const q = seg(tt, bt - 0.15, bt + 0.3); if (q <= 0) return ''; const [x, y] = mapXY({ ...ctx, t: tt }, mo, [109.84, 40.65]);
        let g = ''; for (let i = 0; i < 2; i++) { const ph = ((tt * 0.9 + i / 2) % 1); g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(14 + ph * 80)}" fill="none" stroke="${YEL}" stroke-width="${f1(5 * (1 - ph))}" opacity="${f1(q * (1 - ph))}"/>`; }
        return g + `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(13 * ease.back(q))}" fill="${YEL}" stroke="#fff" stroke-width="4"/><text x="${f1(x + 30)}" y="${f1(y + 14)}" font-family="Nunito" font-weight="800" font-size="46" fill="#fff" stroke="#06122a" stroke-width="9" paint-order="stroke" opacity="${f1(q)}">BAOTOU</text>`; };
      return E.cine.shot(ctx, {
        set: 'mapflight', grade: 'tokyo', setOpts: mo,
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 0, z: 1.03 }, handheld: 0.3 },
        props: [{ depth: 0, svg: marker }],
        overlays: [{ type: 'label', at: y88 - 0.1, x: 60, y: 432, text: '1988 – 2002', fs: 50, sub: 'Gansu and Inner Mongolia' }],
        tag: 'ILLUSTRATION · MAP, NATURAL EARTH DATA'
      });
    },

    // 3 - the stakes: the old evidence lab; DNA and fingerprints on the bench, a search bar that finds nobody
    by39_lab(ctx) {
      const t = ctx.t, dna = WT(ctx, 0, 4, 0.8), fp = WT(ctx, 0, 6, 1.3), but = WT(ctx, 0, 7, 2.2), nob = WT(ctx, 0, 10, 2.8), fil = WT(ctx, 0, 12, 3.4);
      const mon = tt => { const p = seg(tt, but - 0.3, nob); let g = `<g transform="translate(350 720)"><rect x="-10" y="-10" width="460" height="330" rx="14" fill="#1a2228" stroke="${INK}" stroke-width="6"/><rect x="10" y="10" width="420" height="290" fill="#06141a"/>`;
        // a generic fingerprint whorl
        for (let i = 0; i < 9; i++) g += `<ellipse cx="120" cy="150" rx="${18 + i * 11}" ry="${26 + i * 13}" fill="none" stroke="${TEAL}" stroke-width="4" opacity="0.7" stroke-dasharray="${30 + i * 6} 10"/>`;
        g += `<rect x="240" y="120" width="170" height="26" rx="6" fill="#163038"/><rect x="240" y="120" width="${f1(170 * p)}" height="26" rx="6" fill="${p >= 1 ? '#ff3b5c' : '#3ee07a'}"/>`;
        for (let i = 0; i < 4; i++) g += `<rect x="240" y="${170 + i * 28}" width="${f1(60 + ((i * 47 + Math.floor(tt * 8)) % 110))}" height="12" fill="${TEAL}" opacity="0.35"/>`;
        return g + `</g>`; };
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 800 }, grade: 'cold',
        cam: { from: { x: -30, y: 20, z: 1.02 }, to: { x: 30, y: 50, z: 1.14 }, handheld: 0.45 },
        shake: [{ at: nob, amp: 4 }],
        figures: [
          { id: 'by39_det_a', x: 190, y: 1600, scale: 0.9, dir: 1, turn: 0.5, pose: 'read', expr: 'focused',
            keys: [{ at: fp, pose: 'present', expr: 'determined', gaze: [0.8, -0.2], dur: 0.4 }, { at: nob, pose: 'hand_to_face', expr: 'worried', dur: 0.4 }, { at: fil + 0.2, pose: 'arms_crossed', expr: 'stern', dur: 0.5 }] },
          { id: 'by39_sci', x: 930, y: 1580, scale: 0.86, dir: -1, turn: 0.45, pose: 'examine', expr: 'focused',
            keys: [{ at: dna, pose: 'examine', expr: 'focused', gaze: [0.6, 0.6], dur: 0.3 }, { at: but, pose: 'stand', expr: 'neutral', gaze: [0.9, -0.3], dur: 0.4 }, { at: nob + 0.1, pose: 'stand_tense', expr: 'sad', dur: 0.4 }] }
        ],
        props: [{ depth: 0.6, svg: mon }, { depth: 1.08, svg: () => cabinets(1290, '#20282e', '#2c363e') + evidence(1222) }],
        overlays: [
          { type: 'card', at: dna - 0.15, x: 60, y: 390, w: 700, rows: [{ text: 'DNA FROM THE SCENES', fs: 38, colour: RED }, { text: 'FINGERPRINTS', fs: 38, colour: RED, at: fp - 0.1 }, { text: 'NO NAME ON FILE', fs: 30, colour: MUTE, at: fil - 0.1 }] },
          { type: 'stamp', at: nob, x: 570, y: 880, text: 'NO MATCH', scale: 1.5, colour: '#e5372b' }
        ],
        tag: TAG
      });
    },

    // 4 - cold: the task-force room at night; the killings stop; the count-up to 28 YEARS without a name; COLD CASE stamp
    by39_cold(ctx) {
      const t = ctx.t, y02 = WT(ctx, 0, 1, 0.6), stp = WT(ctx, 0, 4, 2.1), trl = WT(ctx, 0, 7, 2.8), cold = WT(ctx, 0, 9, 3.2);
      const typing = (from, to, step = 0.22) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? 'sit_type_b' : 'sit_type', dur: step * 0.8 }); return k; };
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'night',
        cam: { from: { x: 30, y: -10, z: 1.0 }, to: { x: -30, y: -30, z: 1.1 }, handheld: 0.4 },
        shake: [{ at: cold, amp: 4 }],
        figures: [
          { id: 'by39_det_b', x: 330, y: 1660, scale: 0.94, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', keys: [...typing(0.05, stp), { at: stp, pose: 'sit_slumped', expr: 'sad', dur: 0.5 }] },
          { id: 'by39_det_a', x: 820, y: 1640, scale: 0.98, dir: -1, turn: 0.55, pose: 'stand', expr: 'focused',
            keys: [{ at: y02, pose: 'point_up', expr: 'determined', gaze: [0.7, -0.6], dur: 0.4 }, { at: trl, pose: 'arms_crossed', expr: 'stern', dur: 0.45 }, { at: cold + 0.2, pose: 'bowed', expr: 'sad', dur: 0.6 }] }
        ],
        props: [{ depth: 1.12, svg: () => boxes() }],
        overlays: [
          { type: 'counter', at: y02 - 0.1, dur: 2.6, from: 0, to: 28, suffix: ' YEARS', label: 'WITHOUT A NAME', y: 600, fs: 130, colour: '#5fd4ff' },
          { type: 'stamp', at: cold, x: 560, y: 1060, text: 'COLD CASE', scale: 1.5, colour: '#e5372b' },
          { type: 'impact', at: cold, x: 560, y: 1060, colour: '#5fd4ff' }
        ],
        tag: TAG
      });
    },

    // 5 - the irony: the small grocery shop at night, warm and ordinary; the silhouette stacks the shelves in the doorway
    by39_shop(ctx) {
      const t = ctx.t, y16 = WT(ctx, 0, 1, 0.4), run = WT(ctx, 0, 4, 1.9), gro = WT(ctx, 0, 7, 2.5), shop = WT(ctx, 0, 8, 3.0), wife = WT(ctx, 0, 11, 3.5);
      return E.cine.shot(ctx, {
        set: 'by39_shop', grade: 'warm',
        cam: { keys: [{ at: 0, x: -40, y: 60, z: 1.0 }, { at: 0.2, x: 30, y: 90, z: 1.14, dur: Math.max(1, ctx.T - 0.2) }], handheld: 0.4 },
        figures: [
          { id: 'by39_gao', x: 590, y: 1320, scale: 0.58, dir: -1, turn: 0.4, pose: 'examine', silhouette: 'warm', depth: 0.62,
            keys: [{ at: run, pose: 'present', gaze: [-0.8, -0.3], dur: 0.45 }, { at: shop, pose: 'stand', dur: 0.4 }, { at: wife + 0.2, pose: 'hands_behind', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: y16 - 0.1, x: 60, y: 432, text: 'BAIYIN · 2016', fs: 48, sub: 'A small grocery shop' },
          { type: 'callout', at: gro, until: ctx.T - 0.2, target: [600, 1080], r: 110, label: [620, 820], w: 400, text: 'IN PLAIN SIGHT', fs: 34, colour: YEL, depth: 0.6 }
        ],
        tag: GAO
      });
    },

    // 6 - THE HOW, part 1: the police station counter; the uncle (silhouette) gives a cheek swab; the swab tube glows. Drop.
    by39_uncle(ctx) {
      const t = ctx.t, unc = WT(ctx, 0, 2, 0.6), arr = WT(ctx, 0, 4, 1.0), min = WT(ctx, 0, 7, 1.7), gave = WT(ctx, 0, 10, 2.9), dna = WT(ctx, 0, 11, 3.2), smp = WT(ctx, 0, 13, 3.6) + 0.15;
      const tube = tt => { const q = ease.out(seg(tt, gave - 0.2, dna + 0.2)); const x = lerp(760, 560, q), y = lerp(1180, 1330, q);
        return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(lerp(-30, 0, q))})">` + wash(0, -100, 90, 160, TEAL, f1(0.2 + 0.5 * seg(tt, dna - 0.1, smp))) +
          `<rect x="-22" y="-230" width="44" height="226" rx="22" fill="#dff8ff" fill-opacity="0.3" stroke="#e8fbff" stroke-width="4"/><path d="M-3 -210 L-3 -60" stroke="#f4efe2" stroke-width="7"/><ellipse cx="-3" cy="-42" rx="12" ry="22" fill="#fff"/>` +
          `<rect x="-24" y="-158" width="48" height="50" rx="3" fill="#f6f6f2"/><rect x="-28" y="-256" width="56" height="30" rx="6" fill="#e5372b" stroke="${INK}" stroke-width="4"/></g>`; };
      return E.cine.shot(ctx, {
        set: 'by39_station', grade: 'tokyo',
        cam: { from: { x: -30, y: 40, z: 1.02 }, to: { x: 30, y: 70, z: 1.16 }, handheld: 0.5 },
        shake: [{ at: smp, amp: 5 }],
        figures: [
          { id: 'by39_uncle', x: 290, y: 1620, scale: 0.9, dir: 1, turn: 0.45, pose: 'stand', silhouette: 'cool',
            keys: [{ at: arr, pose: 'hands_together', dur: 0.4 }, { at: min, pose: 'bowed', dur: 0.5 }, { at: gave - 0.1, pose: 'stand', gaze: [0.9, 0.2], dur: 0.35 }] },
          { id: 'by39_officer', x: 820, y: 1640, scale: 0.94, dir: -1, turn: 0.45, pose: 'stand', expr: 'neutral',
            keys: [{ at: unc, pose: 'read', expr: 'focused', dur: 0.4 }, { at: gave - 0.3, pose: 'present', expr: 'focused', gaze: [-0.8, 0.3], dur: 0.35 }, { at: smp + 0.3, pose: 'point', expr: 'determined', gaze: [-0.6, 0.5], dur: 0.4 }] }
        ],
        props: [{ depth: 1.06, svg: tube }],
        overlays: [
          { type: 'card', at: arr - 0.1, x: 60, y: 390, w: 720, rows: [{ text: 'HIS UNCLE · A MINOR CRIME', fs: 36, colour: RED }, { text: 'HE GAVE A DNA SAMPLE', fs: 34, at: gave - 0.1 }] },
          { type: 'impact', at: smp, x: 560, y: 1200, colour: TEAL }
        ],
        tag: TAG
      });
    },

    // 7 - THE HOW, part 2: the lab screen slides the relative's Y-chromosome trace onto the scene trace (a near match);
    //     the fun fact pops; FAMILY stamp on the second line
    by39_match(ctx) {
      const t = ctx.t, yy = WT(ctx, 0, 1, 0.4), mk = WT(ctx, 0, 3, 1.1), cl = WT(ctx, 0, 5, 1.7), l1 = LS(ctx, 1, 3.3), fam = WT(ctx, 1, 4, 4.1);
      return E.cine.shot(ctx, {
        set: 'by39_bench', setOpts: { screen: seg(t, 0.0, 0.4), match: ease.inOut(seg(t, yy, cl + 0.5)), scan: seg(t, 0.2, l1) }, grade: 'cold',
        cam: { from: { x: 40, y: 30, z: 1.04 }, to: { x: 60, y: 60, z: 1.14 }, handheld: 0.4 },
        shake: [{ at: fam, amp: 5 }],
        figures: [
          { id: 'by39_sci', x: 170, y: 1720, scale: 0.92, dir: 1, turn: 0.5, pose: 'stand', expr: 'focused',
            keys: [{ at: mk, pose: 'point', expr: 'focused', gaze: [0.9, -0.5], dur: 0.4 }, { at: cl + 0.3, pose: 'stand_tense', expr: 'realise', dur: 0.35 }, { at: fam, pose: 'hand_to_face', expr: 'shocked', dur: 0.3 }] },
          { id: 'by39_det_b', x: 960, y: 1740, scale: 0.94, dir: -1, turn: 0.5, pose: 'arms_crossed', expr: 'focused',
            keys: [{ at: cl, pose: 'stand', expr: 'realise', gaze: [-0.6, -0.4], dur: 0.35 }, { at: fam + 0.1, pose: 'point', expr: 'determined', gaze: [-0.8, -0.3], dur: 0.4 }] }
        ],
        props: [{ depth: 1.06, svg: tt => rack(560, 1400, 0.42, tt + (ctx.sceneStart || 0), { light: 0.9 }) }],
        overlays: [
          { type: 'funfact', at: cl - 0.1, y: 384, fs: 38, rows: [{ text: 'Y-CHROMOSOME DNA PASSES' }, { text: 'FROM FATHER TO SON' }, { text: 'ALMOST UNCHANGED.', colour: YEL }] },
          { type: 'stamp', at: fam, x: 600, y: 930, text: 'FAMILY', scale: 1.6, colour: '#e5372b' },
          { type: 'impact', at: fam, x: 600, y: 930, colour: YEL }
        ],
        tag: TAG
      });
    },

    // 8 - the arrest at the shop at night: police lights wash the facade; two officers walk in; the silhouette steps out,
    //     hands behind his back; impact on "arrested"
    by39_arrest(ctx) {
      const t = ctx.t, aug = WT(ctx, 0, 1, 0.2), pol = WT(ctx, 0, 3, 1.9), arr = WT(ctx, 0, 4, 2.3), gao = WT(ctx, 0, 5, 2.7), shop = WT(ctx, 0, 9, 4.0);
      return E.cine.shot(ctx, {
        set: 'by39_shop', setOpts: { police: seg(t, 0.1, 0.6), dark: 0.6 }, grade: 'cold',
        cam: { from: { x: 30, y: 80, z: 1.12 }, to: { x: -20, y: 60, z: 1.02 }, handheld: 0.6 },
        shake: [{ at: arr, amp: 6 }],
        police: 0.35,
        figures: [
          { id: 'by39_gao', x: 610, y: 1330, scale: 0.6, dir: -1, turn: 0.35, pose: 'stand', silhouette: 'cool', depth: 0.62,
            keys: [{ at: pol, pose: 'stand_tense', dur: 0.3 }, { at: arr, pose: 'hands_behind', dur: 0.4 }, { at: shop, pose: 'bowed', dur: 0.6 }] },
          { id: 'by39_officer', x: -160, y: 1760, scale: 0.98, dir: 1, turn: 0.5, pose: 'walk', expr: 'determined', walk: { from: -160, to: 230, at: 0.1, dur: Math.max(0.8, pol), cadence: 7 },
            keys: [{ at: pol + 0.1, pose: 'stand_tense', expr: 'determined', dur: 0.3 }, { at: arr, pose: 'point', expr: 'stern', gaze: [0.9, -0.4], dur: 0.35 }] },
          { id: 'by39_det_a', x: 1240, y: 1780, scale: 1.0, dir: -1, turn: 0.5, pose: 'walk', expr: 'stern', walk: { from: 1240, to: 900, at: 0.3, dur: Math.max(0.8, pol), cadence: 7 },
            keys: [{ at: pol + 0.3, pose: 'stand', expr: 'stern', dur: 0.3 }, { at: gao, pose: 'present', expr: 'determined', gaze: [-0.9, -0.4], dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: aug - 0.1, x: 60, y: 432, text: 'AUGUST 2016', fs: 50, sub: 'Almost 28 years after the first killing' },
          { type: 'stamp', at: arr, x: 560, y: 1150, text: 'ARRESTED', scale: 1.5, colour: '#e5372b' },
          { type: 'impact', at: arr, x: 560, y: 900, colour: HL }
        ],
        tag: GAO
      });
    },

    // 9 - the verdict: a modern court; the judge brings the gavel down; the silhouette in the dock bows; the card types
    //     the sentence, the execution date and one unnamed memorial row
    by39_verdict(ctx) {
      const t = ctx.t, sen = WT(ctx, 0, 2, 0.4), dth = WT(ctx, 0, 4, 0.9), y18 = WT(ctx, 0, 6, 1.4), exe = WT(ctx, 0, 8, 2.6), y19 = WT(ctx, 0, 10, 3.3);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: true }, grade: 'sepia',
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 50, y: 20, z: 1.1 }, handheld: 0.35 },
        shake: [{ at: sen, amp: 5 }],
        figures: [
          { id: 'by39_judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', expr: 'stern', noChair: true, depth: 0.33,
            keys: [{ at: sen - 0.4, pose: 'gavel', dur: 0.3 }, { at: sen + 0.05, pose: 'sit', dur: 0.15 }, { at: y18 + 0.3, pose: 'read', expr: 'stern', dur: 0.5 }] },
          { id: 'by39_gao', x: 760, y: 1210, scale: 0.62, dir: -1, turn: 0.3, pose: 'stand', silhouette: 'cool',
            keys: [{ at: sen, pose: 'stand_tense', dur: 0.3 }, { at: dth + 0.2, pose: 'bowed', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'impact', at: sen, x: 540, y: 700, colour: YEL },
          { type: 'card', at: sen - 0.1, x: 50, y: 880, w: 620, rows: [{ text: 'MARCH 2018', fs: 28, colour: MUTE }, { text: 'SENTENCED TO DEATH', fs: 40, colour: RED, at: dth - 0.1 }, { text: 'EXECUTED · JANUARY 2019', fs: 32, at: exe - 0.1 }, { text: 'IN MEMORY OF 11 WOMEN AND GIRLS', fs: 25, colour: MUTE, at: exe + 0.3 }] }
        ],
        tag: GAO
      });
    },

    // 10 - the lesson card, then the callback on the hero rack in the first frame's framing; the end question is burned in
    //      over the last 3.2 s, so the lesson card has faded by then; the last frame loops to the first.
    by39_end(ctx) {
      const t = ctx.t, T = ctx.T, les = WT(ctx, 0, 1, 0.2), dna = WT(ctx, 0, 3, 0.8), l1 = LS(ctx, 1, 3.0), unc = WT(ctx, 1, 1, 3.2), hunt = WT(ctx, 1, 9, 4.9);
      const sci = { ...SCI, keys: [{ at: dna, pose: 'present', expr: 'focused', gaze: [0.9, -0.3], dur: 0.4 }, { at: l1, pose: 'examine', expr: 'focused', gaze: [0.9, -0.3], dur: 0.5 }, { at: hunt, pose: 'stand', expr: 'neutral', gaze: [0.8, -0.2], dur: 0.6 }] };
      return E.cine.shot(ctx, {
        set: 'by39_bench', grade: 'neon',
        cam: { from: { x: 10, y: 30, z: 1.08 }, to: { x: 0, y: 0, z: 1.0 }, handheld: 0.4 },
        figures: [sci],
        props: [{ depth: 1.06, svg: tt => rack(HERO.x, HERO.y, HERO.s, tt + (ctx.sceneStart || 0), { light: 1, glow: 0.85 * seg(tt, unc - 0.1, unc + 0.3) * (1 - seg(tt, hunt + 0.4, hunt + 1.0)), helix: 0.35 + 0.4 * seg(tt, l1, unc + 0.4) * (1 - seg(tt, hunt, hunt + 1.0)) }) }],
        overlays: [
          { type: 'lesson', at: les - 0.15, until: T - 4.0, y: 400, rows: [{ text: "YOUR DNA ISN'T ONLY YOURS.", fs: 48 }, { text: 'ONE SAMPLE CAN POINT POLICE', fs: 36 }, { text: 'TO A WHOLE MALE FAMILY LINE.', fs: 36 }] }
        ],
        tag: 'ILLUSTRATION · NOT A PHOTOGRAPH'
      });
    }
  });
})();
