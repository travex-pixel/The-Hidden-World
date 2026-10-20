/* Case File 89 (premium look, ENGINE V7: the impossible frame 0, the object-first headline, the 28-second cut; v6 structure
   promise -> proof -> escalate -> callback, the loop): WHERE THEY HID IT, 4.
   HEADLINE: March 2009, Barcelona El Prat: police say a 66-year-old Chilean passenger from Santiago wore a leg cast made of
   compressed cocaine (about 1 kg), with more in six resealed beer cans and the legs of two folding stools (about 5 kg in
   all); officers sprayed the cast with a reagent that turns bright blue on cocaine; X-rays showed his leg really was
   broken (the callback). Accused only: a silhouette, never named.
   CASE 2: August 2018, Mercamadrid: about 67 kg of cocaine in hollowed-out pineapples from Costa Rica (about a kilo each,
   waxed shut to hide the smell); seven arrested. CASE 3 (best last): June 2009, Progreso, Yucatan: routine X-rays of two
   containers from Costa Rica; the navy cut open more than 20 frozen sharks packed with slabs of cocaine (893 kg, AP).
   Structure: frame 0 = THE IMPOSSIBLE PICTURE: a plaster leg cast on a steel customs bench, a third of the frame wide,
   upper-middle, cracked open by gloved hands with a chisel, white powder pouring from the crack onto the bench, a bright
   blue reagent stain on the plaster, crutches leaning at the bench's end; the crack widens and the camera pushes in from
   0.0 s; the officer behind the bench, the passenger (silhouette) seated at the left. Then the gotcha (close on the
   bench: the spray, the blue bloom), case 2 (the market: the crown lifts off a pineapple on white cylinders; closer: the
   inspector holds the halved fruit up, the 67 KG counter), case 3 (the port: the open container and the sharks on a
   pallet; closer: the X-ray callout, the belly cut open on the slabs: the music drop) and the callback on frame 1's room
   (the X-ray monitor glows with the fracture, the crack closes back, the camera eases back to frame 1's start) with the
   end card.
   Smoothness: cuts and dissolves, one push (into case 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact. Screen direction: officers enter from the right in the headline case, the inspector from the left
   in case 2, the navy inspector from the right in case 3.
   Look: episode.look = 'premium', one cool muted palette (shadow #102028, mid #b8b4a6, accent #e2a13b). The one saturated
   thing in the muted frames is the evidence: the blue reagent stain on the white cast (frame 0 and the gotcha), the
   cocaine cylinders in the pineapple, the slabs in the shark.
   Content rules: the sign reads only CUSTOMS in plain type (no force name, crest or flag); the X-ray monitor shows a
   generic bone image; uniforms carry no insignia. The passenger is a dark silhouette tagged NOT A LIKENESS and never
   named; nobody is drawn as a suspect in cases 2 and 3. No weapon, no force, no victim; the sharks are frozen cargo.
   New environments (E.registerSets): cc89_customs (an airport customs inspection room; view 'wide' or 'close'),
   cc89_bench (the same room framed on the bench), cc89_market (a wholesale fruit market hall at night), cc89_port (a container
   port quay at dusk; view 'wide' or 'close') and cc89_pallet (the quay framed on the sharks' pallet). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#0e1218';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · NOT A LIKENESS';
  const GEN = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#e2a13b';
  const BLUE = '#2f7fe6';
  const TYPE = 'font-family="Nunito" font-weight="800"';
  const flashAt = (tt, a) => (tt >= a && tt < a + 0.45 ? Math.pow(1 - (tt - a) / 0.45, 2) : 0);

  // ---------- small props
  // a plastic-wrapped slab of cocaine (front face): top-left (x, y), size (w, h); a tape band and a shine
  function brick(x, y, w, h, o = {}) {
    const col = o.col || '#e8dcc0';
    let g = `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(Math.min(6, w * 0.06))}" fill="${col}" stroke="${INK}" stroke-width="${o.sw || 3}"/>`;
    g += `<rect x="${f1(x + w * 0.36)}" y="${f1(y)}" width="${f1(w * 0.26)}" height="${f1(h)}" fill="#b89a5a" opacity="0.8"/>`;
    g += `<rect x="${f1(x + w * 0.06)}" y="${f1(y + h * 0.1)}" width="${f1(w * 0.88)}" height="${f1(h * 0.18)}" fill="#fff" opacity="0.35"/>`;
    return g;
  }
  // a white powder stream from (x, y) falling h px onto a heap; k 0..1 the amount; t animates the grains
  function powder(x, y, h, k, t, seed) {
    if (k <= 0) return '';
    const r = R(seed); let g = '';
    const n = Math.round(44 * k);
    for (let i = 0; i < n; i++) { const ph = r(), sp = 0.7 + r() * 0.6, dx = (r() - 0.5) * 30 * k; const u = (ph + t * sp) % 1; g += `<circle cx="${f1(x + dx + Math.sin(t * 3 + i) * 3)}" cy="${f1(y + u * h)}" r="${f1(5 + r() * 6)}" fill="#f7f3ea" opacity="${f1(0.95 * (1 - u * 0.25))}"/>`; }
    g += `<path d="M${f1(x - 12 * k)} ${f1(y)} Q${f1(x)} ${f1(y + h * 0.5)} ${f1(x - 5)} ${f1(y + h)} L${f1(x + 7)} ${f1(y + h)} Q${f1(x + 5)} ${f1(y + h * 0.5)} ${f1(x + 12 * k)} ${f1(y)} Z" fill="#f7f3ea" opacity="${f1(0.6 * k)}"/>`;
    const hw = 60 + 120 * k, hh = 16 + 34 * k;
    g += `<ellipse cx="${f1(x)}" cy="${f1(y + h)}" rx="${f1(hw)}" ry="${f1(hh)}" fill="#f4efe4" stroke="${INK}" stroke-width="3"/><ellipse cx="${f1(x - hw * 0.2)}" cy="${f1(y + h - hh * 0.3)}" rx="${f1(hw * 0.4)}" ry="${f1(hh * 0.35)}" fill="#fff" opacity="0.5"/>`;
    return g;
  }
  // THE HERO: a plaster leg cast lying on its side (the shin tube left to right, the foot turning down at the right),
  // drawn in a local frame about 640 x 300 with its top-left at (0, 0) and scaled by s. o.open 0..1 the crack (0.3 = a hairline
  // at frame 0), o.stain 0..1 the blue reagent bloom, o.t for the grains, o.heap 0..1 the powder (defaults to open)
  function castSvg(o = {}) {
    const open = clamp(o.open ?? 1, 0, 1), st = clamp(o.stain ?? 1, 0, 1), t = o.t || 0, heap = clamp(o.heap ?? open, 0, 1);
    let g = `<ellipse cx="360" cy="330" rx="380" ry="30" fill="#000" opacity="0.4"/>`;
    // the shin tube (knee end at the left, open, with the cotton padding showing)
    g += `<path d="M34 96 Q0 170 36 246 L470 258 Q520 258 556 230 L556 96 Q526 62 476 62 L76 54 Q36 62 34 96 Z" fill="#e8e4da" stroke="${INK}" stroke-width="6"/>`;
    g += `<ellipse cx="38" cy="152" rx="22" ry="96" fill="#cfc9bd" stroke="${INK}" stroke-width="5"/><ellipse cx="38" cy="152" rx="12" ry="76" fill="#8a8478"/>`;
    for (let i = 0; i < 5; i++) g += `<ellipse cx="${f1(40 + Math.sin(i * 2.1) * 8)}" cy="${f1(80 + i * 36)}" rx="14" ry="12" fill="#f2eee6" opacity="0.9"/>`;
    // the foot: heel at the top right, a flat sole, the toe opening at the bottom right
    g += `<path d="M470 100 L640 108 Q708 116 712 184 L712 262 Q712 304 672 306 L520 306 Q470 306 470 262 Z" fill="#e4e0d6" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M556 128 L556 258" stroke="${INK}" stroke-width="3" opacity="0.45"/><path d="M520 306 L712 300" stroke="${INK}" stroke-width="5" opacity="0.5"/>`;
    g += `<ellipse cx="710" cy="228" rx="14" ry="44" fill="#4a3a2e" stroke="${INK}" stroke-width="4"/><ellipse cx="712" cy="228" rx="7" ry="30" fill="#2a2018"/>`;
    // plaster wraps and shading
    for (let i = 0; i < 7; i++) g += `<path d="M${90 + i * 62} 60 Q${80 + i * 62} 156 ${94 + i * 62} 254" fill="none" stroke="#cfcabe" stroke-width="5" opacity="0.9"/>`;
    for (let i = 0; i < 3; i++) g += `<path d="M${500 + i * 60} ${112 + i * 2} Q${486 + i * 60} 210 ${506 + i * 60} 302" fill="none" stroke="#cfcabe" stroke-width="5" opacity="0.8"/>`;
    g += `<path d="M44 196 Q290 232 540 228 L540 246 Q290 254 48 236 Z" fill="#b9b4a8" opacity="0.5"/><path d="M480 250 Q600 268 704 258 L704 276 Q600 286 480 268 Z" fill="#b9b4a8" opacity="0.5"/>`;
    g += `<path d="M70 66 Q300 54 520 72" fill="none" stroke="#fff" stroke-width="10" opacity="0.5"/>`;
    // the blue reagent stain (the one saturated thing): a patch on the shin, left of the crack
    if (st > 0) {
      g += `<g opacity="${f1(0.92 * st)}"><ellipse cx="210" cy="150" rx="${f1(44 + 56 * st)}" ry="${f1(34 + 36 * st)}" fill="${BLUE}" opacity="0.55"/><ellipse cx="202" cy="146" rx="${f1(32 + 40 * st)}" ry="${f1(24 + 26 * st)}" fill="${BLUE}" opacity="0.82"/><ellipse cx="258" cy="190" rx="${f1(12 + 16 * st)}" ry="${f1(9 + 11 * st)}" fill="${BLUE}" opacity="0.75"/><ellipse cx="150" cy="112" rx="${f1(9 + 11 * st)}" ry="${f1(7 + 8 * st)}" fill="${BLUE}" opacity="0.7"/><ellipse cx="198" cy="140" rx="20" ry="12" fill="#8fc3ff" opacity="${f1(0.45 * st)}"/></g>`;
    }
    // the crack across the shin: a jagged dark split that widens with `open`, cream powder packed inside
    const w = 4 + 54 * open;
    const cx0 = 380;
    g += `<path d="M${f1(cx0 - w * 0.5)} 60 L${f1(cx0 + 10 - w * 0.6)} 116 L${f1(cx0 - 14 - w * 0.4)} 166 L${f1(cx0 + 6 - w * 0.5)} 211 L${f1(cx0 - 4 - w * 0.2)} 257 L${f1(cx0 + 2 + w * 0.3)} 257 L${f1(cx0 + 14 + w * 0.5)} 206 L${f1(cx0 - 2 + w * 0.45)} 164 L${f1(cx0 + 18 + w * 0.6)} 114 L${f1(cx0 + 6 + w * 0.5)} 60 Z" fill="#1a1612" stroke="${INK}" stroke-width="4"/>`;
    if (open > 0.15) g += `<path d="M${f1(cx0 + 4 - w * 0.4)} 86 L${f1(cx0 - 8 - w * 0.25)} 166 L${f1(cx0 + 2 - w * 0.1)} 246 L${f1(cx0 + 6 + w * 0.15)} 246 L${f1(cx0 + 2 + w * 0.3)} 164 L${f1(cx0 + 10 + w * 0.42)} 88 Z" fill="#f6f1e6" opacity="${f1(seg(open, 0.15, 0.5))}"/>`;
    // chips of plaster on the bench
    g += `<g opacity="${f1(seg(open, 0.3, 0.8))}"><path d="M290 318 L320 312 L316 330 Z" fill="#e8e4da" stroke="${INK}" stroke-width="3"/><path d="M452 322 L488 318 L474 336 Z" fill="#e8e4da" stroke="${INK}" stroke-width="3"/><path d="M216 330 L242 326 L236 340 Z" fill="#e8e4da" stroke="${INK}" stroke-width="3"/></g>`;
    // the powder pouring from the foot of the crack onto the bench below (the cast sits on a low block, so the stream shows)
    g += `<rect x="150" y="246" width="260" height="70" rx="8" fill="#6a727c" stroke="${INK}" stroke-width="4"/><rect x="150" y="246" width="260" height="12" fill="#aab2ba" opacity="0.6"/>`;
    if (heap > 0) g += `<ellipse cx="${cx0}" cy="290" rx="${f1(90 * heap)}" ry="${f1(70 * heap)}" fill="#fff" opacity="${f1(0.18 * heap)}"/>`;
    g += powder(cx0, 257, 76, heap, t, 8901);
    return g;
  }
  // the gloved hands with the chisel and mallet, coming in from the right over the cast's crack; local frame: the chisel tip
  // at (0, 0); o.tap the mallet phase (t), o.k 0..1 how far in they are
  function handsSvg(o = {}) {
    const t = o.tap || 0, k = o.k ?? 1;
    const tap = Math.max(0, Math.sin(t * 9)) * 18 * (o.amp ?? 1);
    let g = '';
    // the chisel: a steel blade angled down-left into the crack, the handle up-right
    g += `<g transform="rotate(-38)"><rect x="-10" y="-150" width="20" height="150" fill="#9aa3ad" stroke="${INK}" stroke-width="4"/><path d="M-10 0 L10 0 L2 14 L-2 14 Z" fill="#cfd6dc" stroke="${INK}" stroke-width="3"/><rect x="-18" y="-290" width="36" height="150" rx="10" fill="#3a3e46" stroke="${INK}" stroke-width="4"/><rect x="-24" y="-300" width="48" height="20" rx="6" fill="#5a606a" stroke="${INK}" stroke-width="4"/></g>`;
    // the lower hand (pale glove) gripping the chisel handle, the sleeve going off right
    g += `<g transform="translate(118 -150)"><path d="M70 40 L300 90 L300 200 L60 150 Z" fill="#1c2a3c" stroke="${INK}" stroke-width="5"/><ellipse cx="34" cy="76" rx="66" ry="54" fill="#e6e6e2" stroke="${INK}" stroke-width="5"/><path d="M-18 48 Q-40 90 -8 114 M4 40 Q-20 92 10 118 M26 40 Q10 96 34 118" fill="none" stroke="${INK}" stroke-width="4" opacity="0.6"/><path d="M-10 46 Q-56 70 -36 112" fill="none" stroke="#e6e6e2" stroke-width="22" stroke-linecap="round"/><path d="M-10 46 Q-56 70 -36 112" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round" opacity="0.6"/></g>`;
    // the mallet above, tapping (the upper hand, sleeve off right)
    g += `<g transform="translate(${f1(236 - tap * 0.4)} ${f1(-300 + tap)}) rotate(-20)"><rect x="-14" y="-10" width="28" height="200" rx="8" fill="#8a6a44" stroke="${INK}" stroke-width="4"/><rect x="-80" y="-80" width="160" height="80" rx="18" fill="#3a3028" stroke="${INK}" stroke-width="5"/><rect x="-70" y="-70" width="140" height="22" rx="8" fill="#fff" opacity="0.1"/></g>`;
    g += `<g transform="translate(${f1(300 - tap * 0.3)} ${f1(-170 + tap * 0.9)})"><path d="M60 -20 L320 -70 L330 60 L70 90 Z" fill="#1c2a3c" stroke="${INK}" stroke-width="5"/><ellipse cx="30" cy="30" rx="64" ry="52" fill="#e6e6e2" stroke="${INK}" stroke-width="5"/><path d="M-16 4 Q-36 44 -6 70 M6 -2 Q-12 48 18 74" fill="none" stroke="${INK}" stroke-width="4" opacity="0.6"/></g>`;
    return `<g opacity="${f1(k)}">${g}</g>`;
  }
  // a small reagent spray bottle, local frame: nozzle at (0, 0) pointing left; o.mist 0..1 the spray cloud
  function sprayer(o = {}) {
    const m = clamp(o.mist || 0, 0, 1);
    let g = `<rect x="10" y="-20" width="110" height="200" rx="18" fill="#dfe6ee" stroke="${INK}" stroke-width="5"/><rect x="30" y="20" width="70" height="120" rx="8" fill="#9fb8d0" opacity="0.6"/><path d="M-20 -30 L50 -40 L60 -8 L-4 2 Z" fill="#8a97a8" stroke="${INK}" stroke-width="4"/><path d="M18 -8 L34 30 L50 24 L40 -8 Z" fill="#5a6a7a" stroke="${INK}" stroke-width="3"/>`;
    if (m > 0) { let c = ''; const r = R(8902); for (let i = 0; i < 18; i++) { const a = -0.5 + r() * 1.0, d = 40 + r() * 220 * m; c += `<circle cx="${f1(-20 - Math.cos(a) * d)}" cy="${f1(-16 + Math.sin(a) * d * 0.6)}" r="${f1(6 + r() * 14)}" fill="#cfe4ff" opacity="${f1(0.35 * m * (1 - d / 300))}"/>`; } g += c; }
    return g;
  }
  // a pineapple: centre of the body (x, y), body height h; o.open 0..1 lifts the crown and top off on white cylinders;
  // o.half draws the fruit cut lengthways with the cylinders showing (held up)
  function pineapple(x, y, h, o = {}) {
    const w = h * 0.62, open = clamp(o.open || 0, 0, 1);
    let g = '';
    const body = (dx, dy, cut) => {
      let b = `<ellipse cx="${f1(x + dx)}" cy="${f1(y + dy)}" rx="${f1(w / 2)}" ry="${f1(h / 2)}" fill="#c9a04a" stroke="${INK}" stroke-width="5"/>`;
      for (let i = -3; i <= 3; i++) b += `<path d="M${f1(x + dx - w * 0.5)} ${f1(y + dy + i * h * 0.13 - h * 0.1)} Q${f1(x + dx)} ${f1(y + dy + i * h * 0.13 + h * 0.1)} ${f1(x + dx + w * 0.5)} ${f1(y + dy + i * h * 0.13 - h * 0.1)}" fill="none" stroke="#8a6a2a" stroke-width="3" opacity="0.7"/>`;
      for (let i = -3; i <= 3; i++) b += `<path d="M${f1(x + dx - w * 0.5)} ${f1(y + dy + i * h * 0.13 + h * 0.1)} Q${f1(x + dx)} ${f1(y + dy + i * h * 0.13 - h * 0.1)} ${f1(x + dx + w * 0.5)} ${f1(y + dy + i * h * 0.13 + h * 0.1)}" fill="none" stroke="#8a6a2a" stroke-width="3" opacity="0.7"/>`;
      b += `<ellipse cx="${f1(x + dx - w * 0.2)}" cy="${f1(y + dy - h * 0.2)}" rx="${f1(w * 0.14)}" ry="${f1(h * 0.2)}" fill="#fff" opacity="0.18"/>`;
      return b;
    };
    const crown = (dx, dy) => { let c = ''; for (let i = -3; i <= 3; i++) c += `<path d="M${f1(x + dx + i * w * 0.08)} ${f1(y + dy - h * 0.44)} Q${f1(x + dx + i * w * 0.3)} ${f1(y + dy - h * 0.8)} ${f1(x + dx + i * w * 0.42)} ${f1(y + dy - h * 1.05)} Q${f1(x + dx + i * w * 0.2)} ${f1(y + dy - h * 0.72)} ${f1(x + dx + i * w * 0.02)} ${f1(y + dy - h * 0.46)} Z" fill="#3f7a3a" stroke="${INK}" stroke-width="4"/>`; return c; };
    if (o.half) {
      // the fruit cut lengthways: the skin halves apart, the cylinders standing in the hollow
      g += `<g transform="rotate(-8 ${f1(x)} ${f1(y)})">` + body(-w * 0.62, 0) + `</g>`;
      g += `<ellipse cx="${f1(x - w * 0.62)}" cy="${f1(y)}" rx="${f1(w * 0.36)}" ry="${f1(h * 0.42)}" fill="#f0d070" stroke="${INK}" stroke-width="4"/><ellipse cx="${f1(x - w * 0.62)}" cy="${f1(y)}" rx="${f1(w * 0.26)}" ry="${f1(h * 0.34)}" fill="#3a2a16"/>`;
      g += crown(-w * 0.62, 0);
      for (let i = 0; i < 3; i++) g += `<g transform="rotate(${-6 + i * 5} ${f1(x - w * 0.62)} ${f1(y)})">` + brick(x - w * 0.62 - w * 0.12 + (i - 1) * w * 0.1, y - h * 0.3 + i * h * 0.06, w * 0.22, h * 0.56, { col: '#f2ecdc', sw: 3 }) + `</g>`;
      return g;
    }
    g += body(0, 0);
    if (open > 0) {
      // the hollow and the cylinders, revealed as the top lifts
      const lift = ease.out(open) * h * 0.55;
      g += `<ellipse cx="${f1(x)}" cy="${f1(y - h * 0.1)}" rx="${f1(w * 0.36)}" ry="${f1(h * 0.14)}" fill="#3a2a16" stroke="${INK}" stroke-width="3" opacity="${f1(seg(open, 0, 0.3))}"/>`;
      for (let i = 0; i < 3; i++) g += `<g opacity="${f1(seg(open, 0.1, 0.6))}">` + brick(x - w * 0.3 + i * w * 0.22, y - h * 0.46 + lift * 0.3 - h * 0.08 * (1 - open), w * 0.18, h * 0.42, { col: '#f2ecdc', sw: 3 }) + `</g>`;
      g += `<g transform="translate(${f1(-lift * 0.25)} ${f1(-lift)}) rotate(${f1(-14 * open)} ${f1(x)} ${f1(y - h * 0.4)})"><path d="M${f1(x - w * 0.46)} ${f1(y - h * 0.16)} Q${f1(x)} ${f1(y - h * 0.62)} ${f1(x + w * 0.46)} ${f1(y - h * 0.16)} Q${f1(x)} ${f1(y - h * 0.02)} ${f1(x - w * 0.46)} ${f1(y - h * 0.16)} Z" fill="#c9a04a" stroke="${INK}" stroke-width="5"/>${crown(0, 0)}</g>`;
    } else g += crown(0, 0);
    return g;
  }
  // a frozen shark carcass on its side, nose to the left: centre (x, y), length L; o.open 0..1 the belly slit on the slabs
  function shark(x, y, L, o = {}) {
    const open = clamp(o.open || 0, 0, 1), hgt = L * 0.26;
    let g = `<ellipse cx="${f1(x)}" cy="${f1(y + hgt * 0.7)}" rx="${f1(L * 0.5)}" ry="${f1(hgt * 0.25)}" fill="#000" opacity="0.35"/>`;
    g += `<path d="M${f1(x - L * 0.5)} ${f1(y)} Q${f1(x - L * 0.2)} ${f1(y - hgt)} ${f1(x + L * 0.2)} ${f1(y - hgt * 0.7)} L${f1(x + L * 0.42)} ${f1(y - hgt * 0.3)} L${f1(x + L * 0.5)} ${f1(y - hgt * 0.9)} L${f1(x + L * 0.52)} ${f1(y + hgt * 0.2)} L${f1(x + L * 0.42)} ${f1(y + hgt * 0.1)} Q${f1(x + L * 0.1)} ${f1(y + hgt * 0.7)} ${f1(x - L * 0.2)} ${f1(y + hgt * 0.55)} Q${f1(x - L * 0.42)} ${f1(y + hgt * 0.3)} ${f1(x - L * 0.5)} ${f1(y)} Z" fill="#6f8290" stroke="${INK}" stroke-width="6"/>`;
    // the pale belly, the dorsal fin, the pectoral fin, the eye and the gills
    g += `<path d="M${f1(x - L * 0.42)} ${f1(y + hgt * 0.12)} Q${f1(x - L * 0.1)} ${f1(y + hgt * 0.62)} ${f1(x + L * 0.3)} ${f1(y + hgt * 0.1)} Q${f1(x - L * 0.05)} ${f1(y + hgt * 0.3)} ${f1(x - L * 0.42)} ${f1(y + hgt * 0.12)} Z" fill="#d9e2e6"/>`;
    g += `<path d="M${f1(x - L * 0.12)} ${f1(y - hgt * 0.85)} L${f1(x - L * 0.02)} ${f1(y - hgt * 1.5)} L${f1(x + L * 0.12)} ${f1(y - hgt * 0.72)} Z" fill="#5f727f" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M${f1(x - L * 0.2)} ${f1(y + hgt * 0.2)} L${f1(x - L * 0.1)} ${f1(y + hgt * 0.95)} L${f1(x + L * 0.02)} ${f1(y + hgt * 0.3)} Z" fill="#5f727f" stroke="${INK}" stroke-width="5"/>`;
    g += `<circle cx="${f1(x - L * 0.38)}" cy="${f1(y - hgt * 0.22)}" r="${f1(L * 0.02)}" fill="#0e1218"/>`;
    for (let i = 0; i < 4; i++) g += `<path d="M${f1(x - L * 0.3 + i * L * 0.03)} ${f1(y - hgt * 0.3)} Q${f1(x - L * 0.31 + i * L * 0.03)} ${f1(y)} ${f1(x - L * 0.3 + i * L * 0.03)} ${f1(y + hgt * 0.25)}" fill="none" stroke="${INK}" stroke-width="3" opacity="0.6"/>`;
    // frost
    g += `<path d="M${f1(x - L * 0.44)} ${f1(y - hgt * 0.1)} Q${f1(x)} ${f1(y - hgt * 0.75)} ${f1(x + L * 0.3)} ${f1(y - hgt * 0.5)}" fill="none" stroke="#fff" stroke-width="${f1(L * 0.02)}" opacity="0.35"/>`;
    if (open > 0) {
      // the belly slit opening on the slabs
      const sw = L * 0.11 * open;
      g += `<path d="M${f1(x - L * 0.3)} ${f1(y + hgt * 0.32)} Q${f1(x - L * 0.05)} ${f1(y + hgt * 0.32 - sw)} ${f1(x + L * 0.2)} ${f1(y + hgt * 0.2)} Q${f1(x - L * 0.05)} ${f1(y + hgt * 0.32 + sw * 0.8)} ${f1(x - L * 0.3)} ${f1(y + hgt * 0.32)} Z" fill="#1a1416" stroke="${INK}" stroke-width="4"/>`;
      const k = seg(open, 0.25, 1);
      if (k > 0) g += `<g opacity="${f1(k)}" clip-path="url(#cc89slit)">` + brick(x - L * 0.26, y + hgt * 0.14, L * 0.13, L * 0.07, { col: '#f2ecdc' }) + brick(x - L * 0.12, y + hgt * 0.1, L * 0.13, L * 0.07, { col: '#e8dcc0' }) + brick(x + L * 0.02, y + hgt * 0.14, L * 0.12, L * 0.065, { col: '#f2ecdc' }) + `</g>`;
    }
    return g;
  }

  // the hero figures (the same in the hook and the end scene: the loop) and the camera it loops on
  const OFFICER = { id: 'cc89_officer', x: 1000, y: 1150, scale: 0.5, dir: -1, turn: 0.4, pose: 'read', expr: 'focused', depth: 0.98, hat: { style: 'cap', color: '#1a2230' } };
  const MULE = { id: 'cc89_mule', x: 200, y: 1150, scale: 0.46, dir: 1, turn: 0.35, pose: 'sit', silhouette: 'cool', noChair: true, depth: 0.97 };
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 0, y: -16, z: 1.09 };
  // the cast on the wide bench: top-left of its local frame and scale (640 x 300 local -> ~730 px wide: a third of the frame and more)
  const CAST_W = { x: 250, y: 600, s: 1.14 };
  const OPEN0 = 0.3;   // the crack at frame 0 (a hairline that is already splitting)

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // an airport customs inspection room: a night apron through a window strip, a plain CUSTOMS sign, an X-ray scanner
    // with its monitor at the left (o.xray 0..1 lights the bone image), a chair at the left, a long steel bench across the
    // foreground (in front of the figures) with two crutches leaning at its right end. o.view 'wide' | 'close'
    cc89_customs(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), close = o.view === 'close', xr = clamp(o.xray ?? 0.35, 0, 1);
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1800" fill="#2a3842"/><rect x="-400" y="-300" width="${W + 800}" height="520" fill="#223038"/>`;
      // the window strip: night apron, distant lights, a tail fin
      wall += `<rect x="-400" y="230" width="${W + 800}" height="330" fill="#0c1726" stroke="${INK}" stroke-width="8"/>`;
      wall += `<path d="M700 560 L760 340 L840 340 L900 560 Z" fill="#162434"/>` + [120, 300, 420, 980, 1100, 1180].map((x, i) => `<circle cx="${x}" cy="${480 + (i % 3) * 14}" r="${5 + (i % 2) * 3}" fill="${i % 3 === 1 ? '#ffb050' : '#9fd0ff'}" opacity="${f1(0.6 + 0.4 * Math.sin(t * 2 + i))}"/>`).join('');
      for (let i = 0; i < 5; i++) wall += `<rect x="${-100 + i * 330}" y="230" width="14" height="330" fill="#3a4a56"/>`;
      // the plain sign
      wall += `<rect x="330" y="590" width="620" height="90" rx="8" fill="#1a2630" stroke="${INK}" stroke-width="5"/><text x="640" y="654" text-anchor="middle" ${TYPE} font-size="54" letter-spacing="10" fill="#d8dce4" opacity="0.9">CUSTOMS</text>`;
      wall += `<rect x="-400" y="1180" width="${W + 800}" height="30" fill="#1e2a32"/>`;
      // the X-ray scanner at the left with its monitor: a bone image glowing (xr)
      let mid = `<rect x="-200" y="760" width="440" height="420" rx="10" fill="#4a525c" stroke="${INK}" stroke-width="6"/><rect x="-200" y="900" width="440" height="60" fill="#2a3038"/><rect x="-60" y="800" width="130" height="90" rx="8" fill="#1a2028" stroke="${INK}" stroke-width="4"/>`;
      mid += `<rect x="20" y="640" width="260" height="190" rx="10" fill="#2a3040" stroke="${INK}" stroke-width="6"/><rect x="34" y="654" width="232" height="162" fill="#0f1a28"/>`;
      mid += `<g opacity="${f1(0.35 + 0.65 * xr)}"><path d="M70 680 L90 800" stroke="#9fd0ff" stroke-width="18" stroke-linecap="round" opacity="0.8"/><path d="M110 676 L128 800" stroke="#9fd0ff" stroke-width="12" stroke-linecap="round" opacity="0.7"/><path d="M80 736 L104 748" stroke="#ffffff" stroke-width="5" opacity="${f1(0.9 * xr)}"/><path d="M118 742 L134 732" stroke="#ffffff" stroke-width="5" opacity="${f1(0.9 * xr)}"/></g>` + wash(150, 740, 260, 200, '#9fd0ff', f1(0.08 + 0.18 * xr));
      // the chair at the left (the passenger sits on it; figure drawn with noChair)
      mid += `<rect x="90" y="1040" width="170" height="24" rx="6" fill="#3a3e46" stroke="${INK}" stroke-width="4"/><rect x="104" y="1064" width="16" height="130" fill="#2c3038"/><rect x="230" y="1064" width="16" height="130" fill="#2c3038"/><rect x="100" y="880" width="18" height="170" fill="#3a3e46" stroke="${INK}" stroke-width="3"/>`;
      let floor = `<rect x="-400" y="1190" width="${W + 800}" height="${H}" fill="#363c44"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M-400 ${1260 + i * 110} L${W + 400} ${1260 + i * 110}" stroke="#2c3238" stroke-width="3"/>`).join('') + `<rect x="-400" y="1330" width="${W + 800}" height="18" fill="#c9a84a" opacity="0.35"/>`;
      // the bench in the foreground: top surface (a lit slab), front face, legs; the crutches at its right end
      const by = close ? 1120 : 960, bh = close ? 190 : 150;
      let bench = `<path d="M-200 ${by} L${W + 200} ${by} L${W + 240} ${by + 70} L-240 ${by + 70} Z" fill="#8c949c" stroke="${INK}" stroke-width="6"/><rect x="-240" y="${by + 70}" width="${W + 480}" height="${bh}" fill="#5a626c" stroke="${INK}" stroke-width="6"/><rect x="-240" y="${by + 70}" width="${W + 480}" height="16" fill="#aab2ba" opacity="0.6"/>`;
      bench += `<rect x="120" y="${by + 70 + bh}" width="40" height="260" fill="#3a3e46"/><rect x="940" y="${by + 70 + bh}" width="40" height="260" fill="#3a3e46"/>`;
      bench += wash(560, by + 10, 520, 120, '#fff3d8', 0.14);
      if (!close) {
        // two aluminium crutches leaning against the bench's left end, by the passenger's chair
        bench += `<g transform="translate(70 ${by})"><path d="M0 -600 L-22 60" stroke="#aab4bc" stroke-width="16" stroke-linecap="round"/><path d="M0 -600 L-22 60" stroke="${INK}" stroke-width="3" opacity="0.4"/><rect x="-50" y="-640" width="100" height="36" rx="16" fill="#2a3038" stroke="${INK}" stroke-width="4"/><path d="M-34 -380 L26 -380" stroke="#2a3038" stroke-width="12"/><circle cx="-24" cy="66" r="10" fill="#1a1e24"/></g>`;
        bench += `<g transform="translate(130 ${by + 10})"><path d="M0 -560 L16 60" stroke="#aab4bc" stroke-width="16" stroke-linecap="round"/><path d="M0 -560 L16 60" stroke="${INK}" stroke-width="3" opacity="0.4"/><rect x="-46" y="-600" width="100" height="36" rx="16" fill="#2a3038" stroke="${INK}" stroke-width="4"/><path d="M-22 -350 L32 -350" stroke="#2a3038" stroke-width="12"/><circle cx="18" cy="66" r="10" fill="#1a1e24"/></g>`;
      }
      // an inspection lamp cone over the bench
      let lamp = `<rect x="610" y="-300" width="14" height="${close ? 420 : 380}" fill="#2a3038"/><path d="M540 ${close ? 120 : 80} L700 ${close ? 120 : 80} L730 ${close ? 170 : 130} L510 ${close ? 170 : 130} Z" fill="#3a4048" stroke="${INK}" stroke-width="5"/><ellipse cx="620" cy="${close ? 170 : 130}" rx="110" ry="14" fill="#ffe9bd" opacity="0.9"/>` + wash(620, (close ? 170 : 130) + 420, 520, 700, '#ffd9a0', 0.09);
      return { light: { dir: -1, rim: '#9fd0ff', key: '#e8e0d0' }, layers: [[0.3, wall], [0.6, mid], [0.62, lamp], [0.9, floor], [1.03, bench]] };
    },

    // a wholesale fruit market hall at night: roof trusses and hanging lamps, a bay door open to the night at the back,
    // stacked boxes of pineapples at both sides, a forklift silhouette, a pallet in the foreground (the fruit drawn in the shot)
    cc89_market(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="1800" fill="#2e2a26"/>`;
      back += `<rect x="330" y="140" width="620" height="760" fill="#0b1220" stroke="${INK}" stroke-width="8"/>` + E.cine.stars(t, 20, 8911, 160, 500);
      back += `<rect x="330" y="760" width="620" height="140" fill="#1a2230"/><path d="M330 900 L950 900" stroke="#3a4450" stroke-width="6"/>`;
      for (let i = 0; i < 6; i++) back += `<path d="M${-300 + i * 300} -300 L${-100 + i * 300} 120 L${100 + i * 300} -300" fill="none" stroke="#3e3832" stroke-width="12"/>`;
      back += `<rect x="-400" y="110" width="${W + 800}" height="30" fill="#3e3832"/>`;
      [200, 640, 1080].forEach(x => { back += `<path d="M${x} 140 L${x} 300" stroke="#3a3632" stroke-width="8"/><path d="M${x - 70} 300 L${x + 70} 300 L${x + 50} 340 L${x - 50} 340 Z" fill="#4a4036" stroke="${INK}" stroke-width="4"/><ellipse cx="${x}" cy="340" rx="48" ry="8" fill="#ffe0a0"/>` + wash(x, 640, 300, 420, '#ffd090', 0.07); });
      // stacked boxes of pineapples at both sides
      const boxes = (x0, rows, cols, dir) => { let b = ''; for (let r_ = 0; r_ < rows; r_++) for (let c = 0; c < cols; c++) { const x = x0 + c * 210 * dir, y = 1120 - r_ * 180; b += `<rect x="${x}" y="${y - 150}" width="200" height="150" rx="6" fill="#8a6a44" stroke="${INK}" stroke-width="5"/><rect x="${x + 14}" y="${y - 136}" width="172" height="40" fill="#6a4e30"/>`; for (let k = 0; k < 3; k++) b += `<ellipse cx="${x + 46 + k * 54}" cy="${y - 70}" rx="22" ry="40" fill="#b8903e" stroke="${INK}" stroke-width="3"/><path d="M${x + 46 + k * 54} ${y - 110} L${x + 38 + k * 54} ${y - 136} M${x + 46 + k * 54} ${y - 110} L${x + 56 + k * 54} ${y - 138}" stroke="#3f7a3a" stroke-width="5"/>`; } return b; };
      let mid = boxes(-160, 3, 2, 1) + boxes(1040, 3, 2, 1);
      // a forklift silhouette at the right, back
      mid += `<g transform="translate(1150 1040)" opacity="0.8"><rect x="-120" y="-200" width="200" height="160" rx="12" fill="#2a2420" stroke="${INK}" stroke-width="5"/><rect x="-60" y="-330" width="100" height="140" fill="none" stroke="#2a2420" stroke-width="14"/><rect x="-170" y="-420" width="20" height="420" fill="#2a2420"/><circle cx="-80" cy="-10" r="40" fill="#1a1612" stroke="${INK}" stroke-width="4"/><circle cx="60" cy="-10" r="40" fill="#1a1612" stroke="${INK}" stroke-width="4"/></g>`;
      let floor = `<rect x="-400" y="1120" width="${W + 800}" height="${H}" fill="#2a2622"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M-400 ${1180 + i * 120} L${W + 400} ${1180 + i * 120}" stroke="#221e1a" stroke-width="3"/>`).join('');
      // the pallet in the foreground
      floor += `<g transform="translate(540 1300)"><rect x="-330" y="0" width="660" height="26" fill="#9a7a4e" stroke="${INK}" stroke-width="4"/><rect x="-310" y="26" width="60" height="40" fill="#7a5e3a" stroke="${INK}" stroke-width="3"/><rect x="-30" y="26" width="60" height="40" fill="#7a5e3a" stroke="${INK}" stroke-width="3"/><rect x="250" y="26" width="60" height="40" fill="#7a5e3a" stroke="${INK}" stroke-width="3"/><rect x="-330" y="66" width="660" height="22" fill="#9a7a4e" stroke="${INK}" stroke-width="4"/></g>`;
      return { light: { dir: 1, rim: '#ffd090', key: '#e8dcc8' }, layers: [[0.25, back], [0.6, mid], [0.9, floor]] };
    },

    // a container port quay at dusk: a violet sky, the sea, a container ship's side behind, a stack of containers with one
    // open (doors swung, frost inside), a quay with bollards; a pallet in the foreground (the sharks drawn in the shot).
    // o.view 'wide' | 'close'
    cc89_port(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), close = o.view === 'close';
      let sky = `<defs><linearGradient id="cc89sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1c3a"/><stop offset="1" stop-color="#6a4a5a"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1000" fill="url(#cc89sk)"/>` + E.cine.stars(t, 30, 8921, -200, 300);
      sky += `<rect x="-400" y="640" width="${W + 800}" height="200" fill="#2a3a52"/>` + [0, 1, 2, 3].map(i => `<path d="M-400 ${680 + i * 40} Q${300 + i * 200} ${670 + i * 40} ${W + 400} ${690 + i * 40}" fill="none" stroke="#3e5272" stroke-width="4" opacity="0.6"/>`).join('');
      // the ship's side, back left
      sky += `<path d="M-400 420 L620 420 L640 640 L-400 660 Z" fill="#2a2e38" stroke="${INK}" stroke-width="6"/><rect x="-400" y="300" width="700" height="120" fill="#3a3e48" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${-360 + i * 140}" y="330" width="60" height="40" fill="#ffd9a0" opacity="0.7"/>`).join('');
      for (let i = 0; i < 6; i++) sky += `<rect x="${-380 + i * 170}" y="${430 + (i % 2) * 90}" width="160" height="85" fill="${['#6a3a30', '#2e5a6a', '#6a6040'][i % 3]}" stroke="${INK}" stroke-width="4"/>`;
      // the container stack with the open one
      let mid = '';
      const cont = (x, y, w, h, col, open) => { let c = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}" stroke="${INK}" stroke-width="6"/>`; for (let i = 1; i < 10; i++) c += `<path d="M${x + i * w / 10} ${y} L${x + i * w / 10} ${y + h}" stroke="${INK}" stroke-width="2" opacity="0.35"/>`; if (open) { c += `<rect x="${x + w * 0.3}" y="${y + 20}" width="${w * 0.4}" height="${h - 20}" fill="#0a1016"/><path d="M${x + w * 0.3} ${y + 20} L${x + w * 0.12} ${y - 30} L${x + w * 0.12} ${y + h + 10} L${x + w * 0.3} ${y + h} Z" fill="${col}" stroke="${INK}" stroke-width="5"/><path d="M${x + w * 0.7} ${y + 20} L${x + w * 0.88} ${y - 30} L${x + w * 0.88} ${y + h + 10} L${x + w * 0.7} ${y + h} Z" fill="${col}" stroke="${INK}" stroke-width="5"/>` + wash(x + w * 0.5, y + h * 0.5, w * 0.5, h * 0.6, '#cfe4ff', 0.12); } return c; };
      mid += cont(560, 500, 640, 300, '#8a3a30', false) + cont(1140, 500, 640, 300, '#2e5a6a', false);
      mid += cont(500, 800, 720, 340, '#6a7a86', true);
      mid += `<rect x="-400" y="1140" width="${W + 800}" height="60" fill="#4a4e56" stroke="${INK}" stroke-width="5"/>`;
      [60, 1120].forEach(x => { mid += `<rect x="${x - 30}" y="1060" width="60" height="90" rx="14" fill="#2a2e34" stroke="${INK}" stroke-width="5"/>`; });
      let quay = `<rect x="-400" y="1200" width="${W + 800}" height="${H}" fill="#3e4248"/>` + [0, 1, 2, 3].map(i => `<path d="M-400 ${1300 + i * 140} L${W + 400} ${1300 + i * 140}" stroke="#34383e" stroke-width="3"/>`).join('');
      quay += `<path d="M-400 1240 L${W + 400} 1240" stroke="#c9a84a" stroke-width="10" opacity="0.4"/>`;
      // the pallet in the foreground
      const py = close ? 1360 : 1300;
      quay += `<g transform="translate(560 ${py})"><rect x="-380" y="0" width="760" height="26" fill="#9a7a4e" stroke="${INK}" stroke-width="4"/><rect x="-360" y="26" width="60" height="40" fill="#7a5e3a" stroke="${INK}" stroke-width="3"/><rect x="-30" y="26" width="60" height="40" fill="#7a5e3a" stroke="${INK}" stroke-width="3"/><rect x="300" y="26" width="60" height="40" fill="#7a5e3a" stroke="${INK}" stroke-width="3"/><rect x="-380" y="66" width="760" height="22" fill="#9a7a4e" stroke="${INK}" stroke-width="4"/></g>`;
      return { light: { dir: 1, rim: '#ffb0c0', key: '#e8dcd0' }, layers: [[0.1, sky], [0.5, mid], [0.9, quay]] };
    },

    // the close framings as sets of their own: the inspection bench (the customs room framed on the bench) and the quay's
    // pallet (the port framed on the sharks)
    cc89_bench(ctx, o = {}) { return E.sets.cc89_customs(ctx, { ...o, view: 'close' }); },
    cc89_pallet(ctx, o = {}) { return E.sets.cc89_port(ctx, { ...o, view: 'close' }); }
  });

  // the cast on the wide bench (hook and end: the loop); open = the crack, stain = the blue bloom (full from frame 0)
  const castWide = (open, tt) => `<g transform="translate(${CAST_W.x} ${CAST_W.y}) scale(${CAST_W.s})">${castSvg({ open, stain: 0.55, t: tt })}</g>`;
  const handsWide = (tt, k, amp = 1) => `<g transform="translate(${f1(CAST_W.x + 380 * CAST_W.s)} ${f1(CAST_W.y + 70 * CAST_W.s)}) scale(${CAST_W.s})">${handsSvg({ tap: tt, k, amp })}</g>`;

  E.registerScenes({
    // 1 - HOOK (frame 0, the impossible picture): the customs room; the cast on the bench fills the upper-middle of the
    //     frame, its crack splitting from a hairline from 0.0 s, powder pouring, the gloved hands tapping the chisel, the
    //     blue stain already on the plaster; the camera already pushing in; the officer with his clipboard looks up on
    //     line 2; the passenger (silhouette) sits at the left with his hand to his face
    cc89_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.5), cn = WT(ctx, 1, 4, 3.4);
      const open = OPEN0 + (1 - OPEN0) * ease.inOut(seg(t, 0.0, 1.0));
      return E.cine.shot(ctx, {
        set: 'cc89_customs', setOpts: { view: 'wide', xray: 0.35 }, grade: 'cold', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [
          { ...OFFICER, keys: [{ at: 0.1, headTurn: -0.2, dur: 0.5 }, { at: l2 + 0.05, pose: 'examine', expr: 'stern', headTurn: 0.2, dur: 0.4 }, { at: cn + 0.2, pose: 'point', expr: 'stern', headTurn: 0.1, dur: 0.4 }] },
          { ...MULE, keys: [{ at: 0.2, pose: 'hand_to_face', headTurn: 0.2, dur: 0.5 }, { at: l2 + 0.3, pose: 'sit', headTurn: -0.3, dur: 0.4 }] }
        ],
        props: [
          { depth: 1.05, accent: true, svg: tt => castWide(open, tt) },
          { depth: 1.06, svg: tt => handsWide(tt, 1) }
        ],
        overlays: [
          { type: 'callout', at: Math.max(3.05, l2 + 0.25), target: [CAST_W.x + 380 * CAST_W.s, CAST_W.y + 160 * CAST_W.s], label: [1060, 1262], anchor: 'end', w: 520, fs: 30, text: 'COMPRESSED COCAINE', sub: 'Police say · the cast itself, about 1 kg', r: 64, depth: 1.05 },
          { type: 'label', at: Math.max(3.05, cn + 0.1), x: 60, y: 560, text: 'EL PRAT, BARCELONA · MARCH 2009', fs: 26 }
        ],
        tag: TAG
      });
    },

    // 2 - THE GOTCHA: close on the bench; the officer leans in with the spray bottle on "spray" (the mist); on "blue" the
    //     stain blooms across the plaster (the single impact) and he straightens up; the arrested label
    cc89_spray(ctx) {
      const t = ctx.t, sp = WT(ctx, 0, 1, 0.5), cs = WT(ctx, 0, 4, 1.4), bl = WT(ctx, 0, 7, 2.3);
      const mist = seg(t, sp, sp + 0.25) * (1 - seg(t, sp + 0.9, sp + 1.6));
      const stain = ease.out(seg(t, bl - 0.05, bl + 0.6));
      const flash = flashAt(t, bl);
      const CX = 60, CY = 760, CS = 1.5;   // the cast, bigger, on the close bench
      return E.cine.shot(ctx, {
        set: 'cc89_bench', setOpts: { xray: 0.35 }, grade: 'cold', haze: 0.25, dof: true,
        cam: { from: { x: 0, y: 30, z: 1.08 }, to: { x: -10, y: 40, z: 1.2 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'cc89_officer', x: 1010, y: 1960, scale: 1.15, dir: -1, turn: 0.45, pose: 'present', expr: 'focused', depth: 0.98, hat: { style: 'cap', color: '#1a2230' },
            keys: [{ at: sp - 0.2, pose: 'examine', expr: 'focused', headTurn: 0.2, dur: 0.35 }, { at: cs, pose: 'examine', expr: 'stern', headTurn: 0.3, dur: 0.3 }, { at: bl, pose: 'present', expr: 'shocked', headTurn: 0.1, dur: 0.3 }, { at: bl + 0.7, pose: 'point', expr: 'stern', dur: 0.35 }] }
        ],
        props: [
          // the cast with a faint stain before the spray, blooming on "blue"; a hairline crack only (not yet opened)
          { depth: 1.05, accent: true, svg: tt => `<g transform="translate(${CX} ${CY}) scale(${CS})">${castSvg({ open: 0.08, stain: 0.08 + 0.92 * stain, heap: 0, t: tt })}</g>` + wash(360, 960, 420, 260, '#8fc3ff', f1(0.35 * flash + 0.12 * stain)) },
          // the spray bottle in the officer's hand, over the cast from the right, from "spray"
          { depth: 1.06, svg: tt => { const k = seg(tt, sp - 0.35, sp); if (k <= 0) return ''; const x = 760 - 120 * ease.out(k), y = 760 + 10 * Math.sin(tt * 2); return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(-12)">${sprayer({ mist })}</g><path d="M${f1(x + 90)} ${f1(y + 40)} L${f1(x + 420)} ${f1(y + 180)} L${f1(x + 440)} ${f1(y + 330)} L${f1(x + 120)} ${f1(y + 200)} Z" fill="#1c2a3c" stroke="${INK}" stroke-width="5"/><ellipse cx="${f1(x + 110)}" cy="${f1(y + 120)}" rx="60" ry="50" fill="#e6e6e2" stroke="${INK}" stroke-width="5"/>`; } }
        ],
        overlays: [
          { type: 'impact', at: bl, x: 400, y: 960 },
          { type: 'callout', at: bl + 0.25, target: [CX + 190 * CS, CY + 150 * CS], label: [1040, 620], anchor: 'end', w: 460, text: 'TURNED BRIGHT BLUE', sub: 'A cocaine reagent spray (police)', r: 90, depth: 1.05 },
          { type: 'label', at: 0.3, x: 60, y: 1250, text: 'ARRESTED · EL PRAT · MARCH 2009 · POLICE SAY', fs: 28, sub: 'No court outcome found · as of Oct 2026' }
        ],
        tag: GEN
      });
    },

    // 3 - REHOOK + CASE 2: the market hall; the inspector walks in from the left to the pallet; on "Hollowed" she lifts the
    //     crown and top off the centre pineapple: white cylinders inside; the wax fun fact
    cc89_pine(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 1.5), ho = WT(ctx, 1, 1, 2.2), ff = WT(ctx, 1, 3, 2.9);
      const open = ease.out(seg(t, ho, ho + 0.7));
      return E.cine.shot(ctx, {
        set: 'cc89_market', grade: 'warm', haze: 0.3,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 20, y: 30, z: 1.07 } },
        figures: [
          { id: 'cc89_inspector', x: 300, y: 1620, scale: 0.8, dir: 1, turn: 0.45, pose: 'stand_tense', expr: 'focused', depth: 1.0,
            walk: { at: 0.0, dur: Math.max(0.9, l2 - 0.3), cadence: 3.6, stride: 14, from: -60, to: 300 },
            keys: [{ at: l2, pose: 'examine', expr: 'focused', headTurn: 0.3, dur: 0.4 }, { at: ho, pose: 'point', expr: 'realise', headTurn: 0.3, dur: 0.3 }, { at: ff + 0.4, pose: 'present', expr: 'stern', headTurn: 0.2, dur: 0.4 }] }
        ],
        props: [
          // the pineapples on the pallet: the big centre one opens on "Hollowed"
          { depth: 1.02, accent: true, svg: tt => pineapple(420, 1210, 190, {}) + pineapple(760, 1200, 180, {}) + pineapple(600, 1180, 240, { open }) + (open > 0.4 ? wash(600, 1120, 260, 200, '#fff3d8', f1(0.12 * open)) : '') }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'MERCAMADRID, MADRID · AUG 2018', fs: 34, sub: 'Shipped from Costa Rica via Setubal, Portugal' },
          { type: 'funfact', at: ff + 0.1, x: 40, w: 760, y: 700, fs: 38, rows: [{ text: 'EACH PINEAPPLE: ABOUT A KILO' }, { text: 'SEALED WITH WAX' }, { text: 'TO HIDE THE SMELL' }, { text: 'Spanish National Police, via AFP, Aug 2018', fs: 26 }] }
        ],
        tag: GEN
      });
    },

    // 4 - CASE 2's GOTCHA: closer on the pallet; the inspector lifts the halved pineapple on "Seized" and holds it up to the
    //     lamp; the 67 KG counter on "67"; on "arrested" she turns to the hall; the seven-arrested label
    cc89_cut(ctx) {
      const t = ctx.t, sz = WT(ctx, 0, 0, 0.3), mk = WT(ctx, 0, 3, 1.2), sx = WT(ctx, 0, 4, 1.7), ar = WT(ctx, 0, 7, 3.0);
      const lift = ease.out(seg(t, sz, sz + 0.6));
      return E.cine.shot(ctx, {
        set: 'cc89_market', grade: 'warm', haze: 0.25, dof: true,
        cam: { from: { x: 10, y: 60, z: 1.08 }, to: { x: -10, y: 70, z: 1.14 } },
        figures: [
          { id: 'cc89_inspector', x: 760, y: 1760, scale: 0.92, dir: -1, turn: 0.4, pose: 'examine', expr: 'focused', depth: 1.0,
            keys: [{ at: sz, pose: 'present', expr: 'determined', headTurn: 0.2, dur: 0.4 }, { at: mk, pose: 'present', expr: 'stern', headTurn: 0.4, dur: 0.3 }, { at: sx, pose: 'point', expr: 'stern', headTurn: 0.1, dur: 0.35 }, { at: ar, pose: 'stand_tense', expr: 'determined', headTurn: -0.4, dur: 0.4 }] }
        ],
        props: [
          // the halved pineapple held up (it rises with "Seized") and two whole ones on the pallet
          { depth: 1.02, accent: true, svg: tt => pineapple(330, 1240, 210, {}) + pineapple(900, 1250, 190, {}) + `<g transform="translate(0 ${f1(-170 * lift)})">${pineapple(600, 1150, 260, { half: true })}</g>` + wash(520, 1000 - 170 * lift, 300, 260, '#fff3d8', 0.12) }
        ],
        overlays: [
          { type: 'counter', at: sx - 0.05, dur: 0.9, from: 0, to: 67, prefix: '', suffix: ' KG', label: 'COCAINE IN PINEAPPLES · MADRID', y: 540, fs: 120 },
          { type: 'label', at: ar + 0.1, x: 60, y: 1250, text: 'SEVEN ARRESTED · 3 MADRID, 4 BARCELONA', fs: 28, sub: 'Spanish National Police, Aug 2018 · accused, not tried' }
        ],
        tag: GEN
      });
    },

    // 5 - REHOOK + CASE 3: the port at dusk; the open container; three frozen sharks on the pallet; the navy inspector walks
    //     in from the right and on "sharks" crouches to the biggest one
    cc89_dock(ctx) {
      const t = ctx.t, mx = WT(ctx, 0, 1, 0.5), sh = WT(ctx, 0, 3, 1.5);
      return E.cine.shot(ctx, {
        set: 'cc89_port', setOpts: { view: 'wide' }, grade: 'dawn', haze: 0.35,
        cam: { from: { x: 20, y: 10, z: 1.0 }, to: { x: -10, y: 20, z: 1.08 } },
        figures: [
          { id: 'cc89_sailor', x: 900, y: 1560, scale: 0.78, dir: -1, turn: 0.45, pose: 'stand_tense', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#1a2230' },
            walk: { at: 0.0, dur: Math.max(0.8, sh - 0.4), cadence: 3.6, stride: 14, from: 1260, to: 900 },
            keys: [{ at: mx, headTurn: 0.3, dur: 0.3 }, { at: sh, pose: 'kneel', expr: 'focused', headTurn: 0.3, dur: 0.4 }, { at: sh + 0.8, pose: 'kneel', expr: 'stern', headTurn: 0.1, dur: 0.3 }] }
        ],
        props: [
          { depth: 1.02, accent: true, svg: tt => shark(380, 1240, 420, {}) + shark(760, 1200, 360, {}) + shark(560, 1120, 620, {}) }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'PROGRESO, YUCATAN · JUNE 2009', fs: 34, sub: 'Two containers from Costa Rica, Mexican navy' }
        ],
        tag: GEN
      });
    },

    // 6 - THE BIGGEST GOTCHA (the music drop): close on the pallet; the X-ray callout on "X-rays"; on "caught" the belly is
    //     cut open on the slabs; the inspector kneels over it and lifts a slab on "ton"; the 893 KG label
    cc89_shark(ctx) {
      const t = ctx.t, xr = WT(ctx, 0, 1, 0.4), ca = WT(ctx, 0, 2, 0.9), tn = WT(ctx, 0, 6, 2.2);
      const open = ease.out(seg(t, ca, ca + 0.6));
      return E.cine.shot(ctx, {
        set: 'cc89_pallet', grade: 'dawn', haze: 0.25, dof: true,
        cam: { from: { x: -10, y: 70, z: 1.08 }, to: { x: 10, y: 80, z: 1.14 } },
        figures: [
          { id: 'cc89_sailor', x: 880, y: 1700, scale: 0.95, dir: -1, turn: 0.45, pose: 'kneel', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#1a2230' },
            keys: [{ at: xr, pose: 'examine', expr: 'focused', headTurn: 0.3, dur: 0.3 }, { at: ca, pose: 'kneel', expr: 'shocked', headTurn: 0.2, dur: 0.3 }, { at: tn, pose: 'present', expr: 'stern', headTurn: 0.1, dur: 0.4 }] }
        ],
        props: [
          { depth: 1.02, accent: true, svg: tt => `<defs><clipPath id="cc89slit"><path d="M200 1218 Q470 1150 640 1210 Q470 1310 200 1218 Z"/></clipPath></defs>` + shark(470, 1180, 880, { open }) + (open > 0.3 ? wash(430, 1240, 320, 160, '#fff3d8', f1(0.12 * open)) : '') + (tn < t ? `<g transform="translate(${f1(700)} ${f1(1180 - 120 * ease.out(seg(t, tn, tn + 0.4)))}) rotate(-12)">${brick(0, 0, 120, 64, { col: '#f2ecdc' })}</g>` : '') }
        ],
        overlays: [
          { type: 'callout', at: xr, until: ca + 1.2, target: [700, 1040], label: [1040, 640], anchor: 'end', w: 440, text: 'FLAGGED BY X-RAY', sub: 'Routine container scan (navy, AP)', r: 60, depth: 1.02 },
          { type: 'label', at: tn - 0.2, x: 60, y: 1250, text: '893 KG IN 870 PACKAGES · PROSECUTORS (AP)', fs: 28, sub: 'Reuters: "more than a ton" · more than 20 sharks' }
        ],
        tag: GEN
      });
    },

    // 7 - THE CALLBACK (the loop): frame 1's customs room, the same figures; on "broken" the X-ray monitor glows with the
    //     fracture and the officer glances at it; the crack closes back to frame 1's hairline and the camera eases back to
    //     frame 1's start, so the last frame equals the first
    cc89_end(ctx) {
      const t = ctx.t, T = ctx.T, br = WT(ctx, 0, 4, 1.2);
      const back = T - 0.55;
      const open = 1 - (1 - OPEN0) * ease.inOut(seg(t, 0.1, Math.max(0.9, back - 0.1)));
      const xr = 0.35 + 0.65 * seg(t, br - 0.1, br + 0.2) * (1 - seg(t, Math.min(br + 0.5, back - 0.35), back));
      return E.cine.shot(ctx, {
        set: 'cc89_customs', setOpts: { view: 'wide', xray: xr }, grade: 'cold', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [
          { ...OFFICER, keys: [{ at: 0.3, pose: 'examine', headTurn: 0.3, dur: 0.4 }, { at: Math.max(1.0, back - 0.4), pose: 'read', expr: 'focused', headTurn: 0, dur: 0.4 }] },
          { ...MULE, keys: [{ at: 0.25, headTurn: -0.3, dur: 0.4 }, { at: Math.max(1.0, back - 0.4), pose: 'sit', headTurn: 0, dur: 0.4 }] }
        ],
        props: [
          { depth: 1.05, accent: true, svg: tt => castWide(open, tt) },
          { depth: 1.06, svg: tt => handsWide(tt, 1, 1 - seg(tt, back - 0.5, back)) }
        ],
        overlays: [],
        tag: TAG
      });
    }
  });
})();
