/* Case File 23 (cinematic, 40-second "Caught by..." cut): Ramon Abbas, "Hushpuppi", and his own Instagram.
   CLOSED: pleaded guilty (April 2021) to one count of conspiracy to engage in money laundering; sentenced in November 2022
   to 135 months and $1,732,841 in restitution; serving the sentence (status verified 12 Oct 2026).
   Structure (short40): a burned-in hook headline over the HERO OBJECT, a phone held in a hand showing a GENERIC luxury feed
   (a business jet, a supercar), big and centred in the first frame and again in the last (the video loops); fast clue
   beats (the jet-set posing, the plea, the account records, the Snapchat contact, the passport photos); the HOW at ~60%;
   the raid and hand-over; the outcome in one line; a callback on the phone.
   Content rules:
   - The victims (companies and individuals) are never shown or named. No co-conspirator, officer or official is named.
     Separate allegations are omitted; narration states only what he pleaded guilty to.
   - Abbas appears ONLY as an anonymous rim-lit silhouette (characters/figures/hp23_abbas.json): no face, no likeness,
     never one of his own photographs or his booking photo, never posed heroically. Every shot he is in is tagged
     'ILLUSTRATION · NOT A LIKENESS'.
   - Everything is generic: the feed has no app logo, interface or real username; the jet has no registration, airline or
     maker's marks; the supercar has no badge; the police officers carry no insignia and no weapon; the apartment tower,
     skyline and offices are not replicas. The email address and phone number are masked. Every card is our own typed graphic.
   New environments (E.registerSets): hp23_penthouse (a high-rise apartment at night over a generic skyline; 'window' and
   'desk' views), hp23_jet (a private-jet cabin at sunset), hp23_corridor (a residential tower corridor at night).
   Timing: actions are keyed to the narrator's word timings (WT), so they land on the spoken word. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · ANONYMOUS FIGURES';
  const LIKENESS = 'ILLUSTRATION · NOT A LIKENESS';
  const GENERIC = 'ILLUSTRATION · GENERIC PHONE, JET AND CAR';
  const YEL = '#ffd23f';
  const typing = (from, to, a = 'sit_type', b = 'sit_type_b', step = 0.24) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? b : a, dur: step * 0.8 }); return k; };

  // ---------- generic vehicles (no badges, logos, registrations or makers' marks)
  // a generic business jet in profile (nose to the right); bottom of the wheels at (x, y); ~620 long at k = 1. o.stair = airstair down.
  function jet(x, y, k, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><ellipse cx="0" cy="4" rx="300" ry="14" fill="#000" opacity="0.35"/>`;
    g += `<path d="M-250 -150 L-300 -300 L-262 -300 L-200 -170 Z" fill="#e8ecf0" stroke="${INK}" stroke-width="5"/><path d="M-320 -300 L-220 -300 L-226 -286 L-316 -288 Z" fill="#e8ecf0" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-290 -120 Q-280 -168 -200 -172 L210 -172 Q290 -168 318 -120 Q290 -84 220 -78 L-200 -78 Q-270 -84 -290 -120 Z" fill="#f2f4f6" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-286 -108 L300 -108" stroke="#2a3a5a" stroke-width="7"/><path d="M240 -150 L290 -142 L300 -128 L246 -132 Z" fill="#1a2232"/>`;
    for (let i = 0; i < 7; i++) g += `<ellipse cx="${-120 + i * 46}" cy="-136" rx="12" ry="15" fill="#1a2232"/>`;
    g += `<rect x="-246" y="-196" width="120" height="46" rx="23" fill="#dfe3e8" stroke="${INK}" stroke-width="5"/><rect x="-244" y="-186" width="14" height="26" fill="#3a3f46"/>`;
    g += `<path d="M-60 -92 L110 -92 L40 -40 L-80 -42 Z" fill="#d4d9de" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-40 -78 L-40 -20 M200 -80 L200 -20" stroke="#3a3f46" stroke-width="7"/><circle cx="-40" cy="-14" r="14" fill="#141414"/><circle cx="200" cy="-14" r="12" fill="#141414"/>`;
    if (o.stair) g += `<path d="M150 -88 L200 -88 L246 0 L196 0 Z" fill="#cfd4d8" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2, 3].map(i => `<path d="M${160 + i * 12} ${-66 + i * 20} L${206 + i * 12} ${-66 + i * 20}" stroke="#7a8086" stroke-width="3"/>`).join('');
    return g + '</g>';
  }
  // a generic low two-door supercar in profile (nose to the right); bottom of the wheels at (x, y); ~540 long at k = 1. No badge.
  function supercar(x, y, k, col = '#d8261e', o = {}) {
    const fl = o.flip || 1;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k * fl)} ${sc(k)})"><ellipse cx="0" cy="6" rx="280" ry="16" fill="#000" opacity="0.45"/>`;
    g += `<path d="M-268 -40 L-270 -92 Q-262 -112 -230 -116 L-120 -124 Q-60 -176 20 -178 Q90 -176 150 -136 L262 -104 Q284 -96 282 -64 L276 -40 Z" fill="${col}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-100 -126 Q-50 -166 16 -168 Q76 -166 128 -136 Z" fill="#141a24"/><path d="M-20 -164 L-36 -128" stroke="${col}" stroke-width="8"/>`;
    g += `<path d="M-250 -88 L250 -78" stroke="#000" stroke-opacity="0.25" stroke-width="6"/><path d="M-150 -96 L-90 -96 L-110 -76 L-150 -76 Z" fill="#000" opacity="0.4"/>`;
    g += `<rect x="-272" y="-104" width="22" height="12" rx="4" fill="#ff5a3a"/><path d="M262 -100 L280 -92 L276 -84 L258 -88 Z" fill="#fff6d0"/>`;
    [-170, 172].forEach(cx => { g += `<path d="M${cx - 66} -40 A66 66 0 0 1 ${cx + 66} -40 Z" fill="#0a0a0c"/><circle cx="${cx}" cy="-30" r="52" fill="#0b0b0d" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-30" r="32" fill="#9aa2aa" stroke="${INK}" stroke-width="3"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${cx} -30 L${f1(cx + 30 * Math.cos(i * 1.2566))} ${f1(-30 + 30 * Math.sin(i * 1.2566))}" stroke="#3a3f46" stroke-width="5"/>`).join(''); });
    return g + '</g>';
  }

  // ---------- THE HERO: a phone in a hand, showing a GENERIC luxury feed (no app logo, no username, no real photo).
  // Centre (x, y); ~440 x 880 at s = 1. o.scroll scrolls the feed (px); o.ring 0..1 outlines the account header;
  // o.like 0..1 fills the heart; o.hand false drops the hand.
  function post(bx, by, kind, t, like) {
    let g = '';
    if (kind === 'jet') {
      g += `<defs><linearGradient id="hp23pj" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3a6a"/><stop offset="0.65" stop-color="#ff9a5a"/><stop offset="1" stop-color="#ffcf8a"/></linearGradient></defs>`;
      g += `<rect x="${bx}" y="${by}" width="400" height="360" fill="url(#hp23pj)"/><circle cx="${bx + 300}" cy="${by + 210}" r="34" fill="#fff0c0" opacity="0.9"/><rect x="${bx}" y="${by + 270}" width="400" height="90" fill="#2a2a30"/><path d="M${bx} ${by + 300} L${bx + 400} ${by + 300}" stroke="#e8e2c8" stroke-width="3" stroke-dasharray="26 22" opacity="0.6"/>`;
      g += jet(bx + 200, by + 290, 0.56, { stair: true });
    } else {
      g += `<rect x="${bx}" y="${by}" width="400" height="360" fill="#120c22"/>`;
      const r = R(kind === 'car' ? 7 : 9);
      for (let i = 0; i < 9; i++) g += `<rect x="${f1(bx + 10 + i * 44)}" y="${f1(by + 40 + r() * 120)}" width="30" height="${f1(220 - r() * 80)}" fill="#1e1838"/>`;
      for (let i = 0; i < 26; i++) g += `<circle cx="${f1(bx + 10 + r() * 380)}" cy="${f1(by + 50 + r() * 170)}" r="${f1(3 + r() * 9)}" fill="${['#ffcf6a', '#ff7ab0', '#7ad0ff'][i % 3]}" opacity="${f1(0.25 + 0.4 * r())}"/>`;
      g += `<rect x="${bx}" y="${by + 280}" width="400" height="80" fill="#1a1a22"/>` + wash(bx + 200, by + 300, 200, 30, '#ff5a8a', 0.25);
      g += supercar(bx + 200, by + 304, 0.62, kind === 'car' ? '#d8261e' : '#f0b81e');
    }
    // under the picture: a heart, a speech bubble, an arrow, and grey bars (no text)
    const ly = by + 392, lk = like || 0;
    g += `<path d="M${bx + 30} ${ly} c -16 -16 -40 0 -22 18 l 22 20 l 22 -20 c 18 -18 -6 -34 -22 -18 Z" fill="${lk > 0 ? '#ff3a5a' : 'none'}" fill-opacity="${f1(lk)}" stroke="#f4f4f4" stroke-width="5"/>`;
    g += `<path d="M${bx + 80} ${ly - 8} a 20 18 0 1 1 6 22 l -12 6 l 4 -12 Z" fill="none" stroke="#f4f4f4" stroke-width="5"/><path d="M${bx + 130} ${ly - 12} L${bx + 170} ${ly} L${bx + 130} ${ly + 14} L${bx + 140} ${ly} Z" fill="none" stroke="#f4f4f4" stroke-width="5"/>`;
    g += `<rect x="${bx + 8}" y="${ly + 34}" width="180" height="12" rx="6" fill="#8a8e96"/><rect x="${bx + 8}" y="${ly + 56}" width="300" height="10" rx="5" fill="#55585e"/>`;
    return g;
  }
  function phoneHero(x, y, s, t, o = {}) {
    const scroll = o.scroll || 0, ring = o.ring || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">` + wash(0, 0, 420, 600, '#9ab8ff', 0.16) + `<rect x="-206" y="-426" width="440" height="880" rx="60" fill="#000" opacity="0.4"/>`;
    g += `<rect x="-220" y="-440" width="440" height="880" rx="60" fill="#16181c" stroke="${INK}" stroke-width="8"/><rect x="-214" y="-434" width="428" height="868" rx="56" fill="none" stroke="#5a5e66" stroke-width="4"/>`;
    g += `<defs><clipPath id="hp23scr"><rect x="-200" y="-414" width="400" height="828" rx="42"/></clipPath></defs><g clip-path="url(#hp23scr)"><rect x="-200" y="-414" width="400" height="828" fill="#0c0d10"/>`;
    // the feed: posts repeat every 500 px
    const P = 500, off = scroll % P;
    for (let i = -1; i < 3; i++) { const by = -300 + i * P - off; g += post(-200, by, ['jet', 'car', 'jet2'][((i + Math.floor(scroll / P)) % 3 + 3) % 3], t, i === 0 ? o.like : 0); }
    // the account header (fixed): a profile circle and grey bars - no username, no logo
    g += `<rect x="-200" y="-414" width="400" height="114" fill="#0c0d10"/><rect x="-200" y="-414" width="400" height="34" fill="#0c0d10"/><rect x="-60" y="-404" width="120" height="22" rx="11" fill="#000"/>`;
    g += `<circle cx="-146" cy="-344" r="34" fill="none" stroke="#e8b84a" stroke-width="6"/><circle cx="-146" cy="-344" r="26" fill="#2a2e36"/><path d="M-166 -324 Q-146 -350 -126 -324 Z M-146 -366 m -11 0 a 11 12 0 1 0 22 0 a 11 12 0 1 0 -22 0" fill="#0c0d10"/>`;
    g += `<rect x="-98" y="-362" width="150" height="16" rx="8" fill="#e4e6ea"/><rect x="-98" y="-336" width="100" height="12" rx="6" fill="#7a7e86"/><circle cx="74" cy="-354" r="12" fill="#4a90ff"/><path d="M68 -354 L73 -348 L81 -360" stroke="#fff" stroke-width="3" fill="none"/>`;
    g += [150, 164, 178].map(xx => `<circle cx="${xx}" cy="-344" r="4" fill="#d0d2d6"/>`).join('') + `<path d="M-200 -300 L200 -300" stroke="#2a2c30" stroke-width="3"/>`;
    if (ring > 0) g += `<rect x="-192" y="-394" width="384" height="90" rx="16" fill="none" stroke="${YEL}" stroke-width="7" opacity="${f1(ring * (0.75 + 0.25 * Math.sin(t * 7)))}"/>`;
    g += `<rect x="-200" y="-414" width="400" height="828" fill="url(#hp23glare)" opacity="0.5"/></g>`;
    g += `<defs><linearGradient id="hp23glare" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.16"/><stop offset="0.4" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
    // the hand (from below): palm and thumb on the left edge, fingertips round the right edge
    if (o.hand !== false) {
      const sk = '#7a5238', sh = '#5a3a26';
      g += `<path d="M-250 470 Q-268 300 -236 170 Q-226 130 -198 150 Q-170 180 -176 290 L-150 440 Z" fill="${sk}" stroke="${INK}" stroke-width="6"/>`;
      g += `<path d="M-200 1120 L-250 420 Q-120 360 60 380 Q200 400 236 470 L190 1120 Z" fill="${sk}" stroke="${INK}" stroke-width="6"/><path d="M-200 470 Q-60 430 120 460" stroke="${sh}" stroke-width="6" fill="none" opacity="0.6"/>`;
      [[150, 26], [250, 24], [340, 22]].forEach(([yy, r_]) => { g += `<rect x="196" y="${yy - r_}" width="68" height="${r_ * 2 + 8}" rx="${r_}" fill="${sk}" stroke="${INK}" stroke-width="5"/>`; });
      g += `<rect x="-232" y="90" width="52" height="92" rx="24" fill="${sk}" stroke="${INK}" stroke-width="5" transform="rotate(16 -206 136)"/>`;
    }
    return g + '</g>';
  }
  // a laptop on a desk (screen with grey email-like rows, no text); bottom centre (x, y); o.dir -1 faces left
  function laptop(x, y, s, t, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * (o.dir || 1))} ${sc(s)})"><path d="M-170 0 L170 0 L150 -16 L-150 -16 Z" fill="#9aa0a8" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-140 -16 L-160 -230 L150 -230 L140 -16 Z" fill="#2a2e36" stroke="${INK}" stroke-width="5"/><path d="M-130 -30 L-146 -216 L136 -216 L128 -30 Z" fill="#cfe2ff"/>`;
    for (let i = 0; i < 6; i++) { const yy = -200 + i * 28, hot = o.hot && i === Math.floor(t * 3) % 6; g += `<rect x="-128" y="${yy}" width="${f1(232 - (i % 3) * 30)}" height="18" fill="${hot ? '#ffd23f' : '#8aa0c0'}" opacity="0.85"/><rect x="-134" y="${yy + 2}" width="12" height="12" fill="#5a6a8a"/>`; }
    return g + '</g>' + wash(x, y - 120 * s, 260 * s, 160 * s, '#bcd4ff', 0.18);
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  // a generic skyline at night (towers with lit windows, one tall spire tower; not a replica of any real building)
  function skyline(t, HZ, seed) {
    const r = R(seed);
    let s = `<defs><linearGradient id="hp23sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070a1c"/><stop offset="0.7" stop-color="#1e1a3e"/><stop offset="1" stop-color="#5a3a5a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#hp23sky)"/>`;
    for (let i = 0; i < 40; i++) s += `<circle cx="${f1(-280 + r() * 1640)}" cy="${f1(40 + r() * 400)}" r="${f1(1 + r() * 1.6)}" fill="#fff" opacity="${f1(0.3 + 0.5 * r())}"/>`;
    let far = '';
    for (let i = 0; i < 18; i++) { const x = -300 + i * 96 + r() * 30, w = 60 + r() * 50, h = 160 + r() * 360; far += `<rect x="${f1(x)}" y="${f1(HZ - h)}" width="${f1(w)}" height="${f1(h)}" fill="#141632"/>`; for (let k = 0; k < 10; k++) far += `<rect x="${f1(x + 6 + r() * (w - 16))}" y="${f1(HZ - h + 10 + r() * (h - 20))}" width="6" height="8" fill="#ffd98a" opacity="${f1(0.3 + 0.5 * r())}"/>`; }
    // a tall tapering spire tower (generic)
    far += `<path d="M700 ${HZ} L716 ${HZ - 420} L728 ${HZ - 640} L738 ${HZ - 760} L742 ${HZ - 860} L746 ${HZ - 760} L756 ${HZ - 640} L768 ${HZ - 420} L784 ${HZ} Z" fill="#1c1e40"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${724 + (i % 2) * 18}" y="${HZ - 120 - i * 70}" width="6" height="10" fill="#ffe6aa" opacity="0.7"/>`).join('') + `<circle cx="742" cy="${HZ - 866}" r="5" fill="#ff4a4a" opacity="${f1(0.5 + 0.5 * Math.sin(t * 3))}"/>`;
    let near = '';
    for (let i = 0; i < 9; i++) { const x = -300 + i * 190 + r() * 40, w = 120 + r() * 60, h = 120 + r() * 220; near += `<rect x="${f1(x)}" y="${f1(HZ + 40 - h)}" width="${f1(w)}" height="${f1(h + 200)}" fill="#0c0e22"/>`; for (let k = 0; k < 14; k++) near += `<rect x="${f1(x + 8 + r() * (w - 20))}" y="${f1(HZ + 40 - h + 10 + r() * h)}" width="8" height="10" fill="${r() < 0.2 ? '#9ad0ff' : '#ffcf6a'}" opacity="${f1(0.4 + 0.5 * r())}"/>`; }
    // a highway of moving headlights low in the view
    for (let i = 0; i < 14; i++) { const u = ((t * 0.08 + i / 14) % 1); near += `<circle cx="${f1(-300 + u * 1700)}" cy="${HZ + 120 + (i % 2) * 10}" r="4" fill="${i % 2 ? '#ff5a4a' : '#fff2c8'}" opacity="0.85"/>`; }
    return { sky: s, far, near };
  }

  E.registerSets({
    // a high-rise apartment at night over a generic skyline: floor-to-ceiling glass with mullions, a dark glossy floor
    // reflecting the city, a low sofa and a floor lamp. o.view 'desk' adds a foreground desk with two laptops.
    hp23_penthouse(ctx, o = {}) {
      const t = ctx.t, HZ = 900, sk = skyline(t, HZ, 231);
      let glass = `<rect x="-300" y="-300" width="${W + 600}" height="150" fill="#0a0a12"/>`;
      for (let x = -280; x < W + 300; x += 270) glass += `<rect x="${x}" y="-150" width="18" height="1380" fill="#0e0f18" stroke="#2a2c3a" stroke-width="2"/>`;
      glass += `<rect x="-300" y="1160" width="${W + 600}" height="30" fill="#0e0f18"/>` + `<path d="M-300 -150 L${W + 300} -150" stroke="#3a3c50" stroke-width="4"/>` + wash(540, 600, 700, 300, '#c8a0ff', 0.06);
      let room = `<rect x="-300" y="1190" width="${W + 600}" height="${H}" fill="#121218"/>`;
      for (let i = 0; i < 12; i++) room += `<rect x="${f1(-280 + i * 130)}" y="1200" width="10" height="${f1(120 + (i % 3) * 60)}" fill="${i % 2 ? '#ffcf6a' : '#9ad0ff'}" opacity="0.12"/>`;
      room += `<path d="M-300 1420 L${W + 300} 1420" stroke="#000" stroke-opacity="0.3" stroke-width="3"/>`;
      // floor lamp (left) and a low sofa (right), in silhouette against the glass
      room += `<g transform="translate(70 1260)"><path d="M0 0 L0 -420" stroke="#2a2a30" stroke-width="10"/><path d="M-60 -420 L60 -420 L40 -500 L-40 -500 Z" fill="#e8d8b0" stroke="${INK}" stroke-width="4"/></g>` + wash(70, 800, 200, 220, '#ffd59a', 0.3);
      room += `<g transform="translate(1000 1270)"><rect x="-260" y="-150" width="520" height="110" rx="20" fill="#2a2630" stroke="${INK}" stroke-width="5"/><rect x="-280" y="-60" width="560" height="70" rx="16" fill="#34303a" stroke="${INK}" stroke-width="5"/></g>`;
      const layers = [[0.04, sk.sky], [0.1, sk.far], [0.2, sk.near], [0.5, glass], [1.0, room]];
      if (o.view === 'desk') {
        const desk = `<rect x="-300" y="1330" width="${W + 600}" height="36" fill="#2c2620" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1364" width="${W + 600}" height="${H}" fill="#1a1612" stroke="${INK}" stroke-width="5"/>` +
          laptop(330, 1334, 0.9, t, { hot: true }) + laptop(760, 1334, 0.8, t, { dir: -1 }) + `<rect x="520" y="1316" width="70" height="16" rx="4" fill="#0c0c0e" stroke="#4a4a50" stroke-width="2"/>`;
        layers.push([1.05, desk]);
      }
      return { light: { dir: 1, rim: '#c8b4ff', key: '#ffd59a' }, layers, dust: false };
    },

    // a private-jet cabin at sunset (generic; no airline, maker or registration): cream leather, wood veneer ledge, oval
    // windows with clouds sliding by, a curved ceiling with a lit cove; o.seat [x, y, s] draws a club seat for a figure
    hp23_jet(ctx, o = {}) {
      const t = ctx.t, r = R(17);
      let wall = `<defs><linearGradient id="hp23js" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a6a"/><stop offset="0.6" stop-color="#ff9a6a"/><stop offset="1" stop-color="#ffd0a0"/></linearGradient></defs>`;
      wall += `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#e6dccb"/><path d="M-300 -300 L${W + 300} -300 L${W + 300} 300 Q540 200 -300 300 Z" fill="#f2ebde"/><path d="M-300 300 Q540 200 ${W + 300} 300" stroke="#ffe2b0" stroke-width="10" opacity="0.8" fill="none"/>`;
      for (let i = 0; i < 5; i++) {
        const x = -60 + i * 300, y = 640;
        wall += `<ellipse cx="${x}" cy="${y}" rx="96" ry="138" fill="#cfc4b0" stroke="${INK}" stroke-width="5"/><defs><clipPath id="hp23w${i}"><ellipse cx="${x}" cy="${y}" rx="76" ry="116"/></clipPath></defs><g clip-path="url(#hp23w${i})"><rect x="${x - 80}" y="${y - 120}" width="160" height="240" fill="url(#hp23js)"/>`;
        const cx = ((r() * 300 + t * 220) % 340) - 170;
        wall += `<ellipse cx="${f1(x - cx)}" cy="${y + 50}" rx="80" ry="18" fill="#ffe6d0" opacity="0.65"/><ellipse cx="${f1(x - cx + 150)}" cy="${y + 80}" rx="60" ry="12" fill="#ffe6d0" opacity="0.5"/></g>`;
        wall += wash(x, y, 160, 200, '#ffb070', 0.18);
      }
      wall += `<rect x="-300" y="900" width="${W + 600}" height="60" fill="#6a4a2e" stroke="${INK}" stroke-width="5"/><rect x="-300" y="900" width="${W + 600}" height="12" fill="#a07a50"/><rect x="-300" y="960" width="${W + 600}" height="300" fill="#d8ccb6"/>`;
      const floor = `<rect x="-300" y="1240" width="${W + 600}" height="${H}" fill="#5a4e44"/>` + [0, 1, 2, 3].map(i => `<rect x="-300" y="${1270 + i * 80}" width="${W + 600}" height="6" fill="#6a5e52" opacity="0.6"/>`).join('');
      const layers = [[0.3, wall], [0.97, floor]];
      if (o.seat) layers.push([0.985, clubSeat(...o.seat)]);
      if (o.table) layers.push([1.04, `<g><rect x="${o.table[0] - 170}" y="${o.table[1]}" width="340" height="26" rx="10" fill="#7a5434" stroke="${INK}" stroke-width="5"/><rect x="${o.table[0] - 14}" y="${o.table[1] + 26}" width="28" height="400" fill="#4a3424"/><path d="M${o.table[0] + 60} ${o.table[1]} l 8 -60 l 30 0 l 8 60 Z" fill="#e8f0f4" opacity="0.7" stroke="${INK}" stroke-width="3"/></g>`]);
      return { light: { dir: 1, rim: '#ffc890', key: '#ffe2b0' }, layers };
    },

    // a residential tower corridor at night (generic): pale stone walls, sconces, downlights, a row of apartment doors;
    // o.door = {x, open 0..1}: the near door, which swings open onto a warm-lit flat
    hp23_corridor(ctx, o = {}) {
      const t = ctx.t, d = o.door || { x: 820, open: 0 }, op = clamp(d.open, 0, 1);
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#cbbfa8"/><rect x="-300" y="-300" width="${W + 600}" height="460" fill="#ece4d4"/>`;
      for (let x = -300; x < W + 300; x += 180) wall += `<path d="M${x} 160 L${x} 1240" stroke="#b0a48c" stroke-width="3"/>`;
      [100, 460, 1060].forEach(x => { wall += `<circle cx="${x}" cy="130" r="18" fill="#fff6dc"/>` + wash(x, 220, 160, 140, '#fff0c8', 0.35); });
      // far doors (closed)
      [[-120, 0.8], [300, 0.85]].forEach(([x]) => { wall += `<rect x="${x}" y="560" width="220" height="680" fill="#5a4030" stroke="${INK}" stroke-width="6"/><circle cx="${x + 190}" cy="900" r="10" fill="#c8a860"/><rect x="${x + 80}" y="500" width="60" height="30" rx="4" fill="#a0947e"/>`; });
      [180, 620].forEach(x => { wall += `<rect x="${x - 16}" y="470" width="32" height="56" rx="8" fill="#f8e8c0" stroke="${INK}" stroke-width="3"/>` + wash(x, 500, 120, 160, '#ffe0a0', 0.4); });
      // the near door: a warm interior behind it; the leaf swings open (narrows)
      const dx = d.x, dw = 260;
      let door = `<rect x="${dx - 14}" y="500" width="${dw + 28}" height="754" fill="#3a2a20" stroke="${INK}" stroke-width="6"/><rect x="${dx}" y="514" width="${dw}" height="726" fill="#ffd9a0"/>` + wash(dx + dw / 2, 900, 220, 380, '#fff0c8', 0.5);
      door += `<rect x="${dx}" y="1060" width="${dw}" height="180" fill="#c8a070" opacity="0.5"/>`;
      const lw = dw * (1 - 0.82 * ease.inOut(op));
      door += `<rect x="${dx}" y="514" width="${f1(lw)}" height="726" fill="#5e4230" stroke="${INK}" stroke-width="5"/><circle cx="${f1(dx + lw - 24)}" cy="900" r="10" fill="#c8a860"/>`;
      if (op > 0.05) door += `<path d="M${dx + dw} 1240 L${dx + dw + 200} 1700 L${dx - 60} 1700 L${dx} 1240 Z" fill="#ffd9a0" opacity="${f1(0.18 * op)}"/>`;
      let floor = `<rect x="-300" y="1240" width="${W + 600}" height="${H}" fill="#8a7a66"/><rect x="-300" y="1240" width="${W + 600}" height="10" fill="#5a4c3c"/>`;
      floor += `<path d="M200 1250 L880 1250 L1300 ${H + 300} L-200 ${H + 300} Z" fill="#6a2a2a" opacity="0.6"/>`;
      return { light: { dir: 1, rim: '#ffe6b0', key: '#fff0c8' }, layers: [[0.4, wall], [0.6, door], [1.0, floor]] };
    }
  });
  // a cream leather club seat (front-ish three-quarter view); bottom centre (x, y), seat cushion top at y - 440 s
  function clubSeat(x, y, s) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="-64" rx="300" ry="26" fill="#000" opacity="0.3"/>` +
      `<path d="M-230 -1000 Q-240 -1080 -150 -1090 L150 -1090 Q240 -1080 230 -1000 L240 -470 L-240 -470 Z" fill="#efe4cf" stroke="${INK}" stroke-width="7"/>` +
      `<path d="M-200 -980 L200 -980 M-205 -760 L205 -760" stroke="#c8b898" stroke-width="5"/>` +
      `<path d="M-300 -560 L-230 -560 L-230 -70 L-300 -70 Z M300 -560 L230 -560 L230 -70 L300 -70 Z" fill="#e2d6be" stroke="${INK}" stroke-width="6"/>` +
      `<path d="M-250 -470 L250 -470 L260 -380 L-260 -380 Z" fill="#f4ead6" stroke="${INK}" stroke-width="6"/><rect x="-250" y="-380" width="500" height="310" fill="#d4c6aa" stroke="${INK}" stroke-width="6"/></g>`;
  }

  E.registerScenes({
    // 1 - hook: the phone, big and centred from the first frame (the headline is burned in by the engine until ~3.2 s, so
    //     nothing of ours sits in y 380-720 before that). The feed scrolls; behind the glass he poses (silhouette).
    hp23_hook(ctx) {
      const t = ctx.t, posed = WT(ctx, 0, 1, 0.4), jets = WT(ctx, 0, 3, 0.9), ig = WT(ctx, 0, 8, 2.4), l1 = LS(ctx, 1, 3.0), acc = WT(ctx, 1, 2, 3.5), idn = WT(ctx, 1, 6, 4.4);
      const scroll = tt => 500 * ease.inOut(seg(tt, jets - 0.2, jets + 0.6)) + 500 * ease.inOut(seg(tt, ig - 0.4, ig + 0.4));
      return E.cine.shot(ctx, {
        set: 'hp23_penthouse', setOpts: { view: 'window' }, grade: 'night',
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: -20, z: 1.06 }, handheld: 1.2 },
        shake: [{ at: idn, amp: 4 }],
        figures: [{ id: 'hp23_abbas', x: 900, y: 1250, scale: 0.5, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'cool', depth: 0.98,
          walk: { from: 1200, to: 900, at: 0.0, dur: Math.max(0.6, posed), cadence: 6.0 }, keys: [{ at: posed + 0.1, pose: 'present', dur: 0.4 }, { at: ig, pose: 'arms_crossed', dur: 0.4 }, { at: idn, pose: 'stand_tense', dur: 0.3 }] }],
        props: [{ depth: 1.15, svg: tt => phoneHero(500, 1010, 0.9, tt, { scroll: scroll(tt), like: seg(tt, posed, posed + 0.3), ring: seg(tt, acc - 0.2, acc + 0.2) }) }],
        overlays: [
          { type: 'callout', at: acc - 0.05, target: [500, 1010 - 349 * 0.9], depth: 1.15, r: 70, label: [60, 520], w: 470, text: 'HIS OWN ACCOUNT', colour: YEL }
        ],
        tag: LIKENESS
      });
    },

    // 2 - the jet-set posing, in a private-jet cabin at sunset (generic): he sits in a club seat and holds his phone up
    hp23_jet(ctx) {
      const t = ctx.t, hp = WT(ctx, 0, 2, 0.9), two = WT(ctx, 0, 5, 1.8), fol = WT(ctx, 0, 7, 2.4);
      const FS = 0.86, FY = 1760, seat = [470, FY, FS];
      const flash = tt => { const k = Math.max(seg(tt, hp, hp + 0.06) * (1 - seg(tt, hp + 0.06, hp + 0.3)), seg(tt, fol, fol + 0.06) * (1 - seg(tt, fol + 0.06, fol + 0.3))); return k > 0 ? `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#fff" opacity="${f1(0.35 * k)}"/>` : ''; };
      return E.cine.shot(ctx, {
        set: 'hp23_jet', setOpts: { seat, table: [880, 1440] }, grade: 'warm',
        cam: { from: { x: -30, y: 0, z: 1.02 }, to: { x: 30, y: -20, z: 1.1 }, handheld: 0.8 },
        figures: [{ id: 'hp23_abbas', x: 470, y: FY, scale: FS, dir: 1, turn: 0.3, pose: 'sit', noChair: true, silhouette: 'warm', depth: 0.99,
          keys: [{ at: 0.2, pose: 'sit_slumped', dur: 0.4 }, { at: hp - 0.15, pose: 'sit_read', gaze: [0.5, -0.2], dur: 0.3 }, { at: two, pose: 'sit', dur: 0.4 }, { at: fol - 0.15, pose: 'sit_read', dur: 0.3 }] }],
        props: [{ depth: 1.2, svg: flash }],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'RAMON ABBAS, "HUSHPUPPI"', fs: 40, sub: 'Instagram influencer' },
          { type: 'card', at: hp, x: 540, y: 640, w: 480, rows: [{ text: 'FOLLOWERS', fs: 28, colour: '#6b665c' }, { text: '2 MILLION+', fs: 56, colour: '#8e1f18', at: two - 0.3 }, { text: 'BBC: about 2.5 million', fs: 22, colour: '#6b665c', at: fol - 0.2 }] }
        ],
        tag: LIKENESS
      });
    },

    // 3 - what he admitted: at a desk in the apartment, laptops of emails; a typed card summarises the fraud type
    hp23_scam(ctx) {
      const t = ctx.t, adm = WT(ctx, 0, 2, 0.6), lau = WT(ctx, 0, 5, 1.6), sc_ = WT(ctx, 0, 9, 2.8);
      return E.cine.shot(ctx, {
        set: 'hp23_penthouse', setOpts: { view: 'desk' }, grade: 'night',
        cam: { from: { x: 30, y: -20, z: 1.0 }, to: { x: -30, y: -40, z: 1.08 }, handheld: 1.4 },
        figures: [{ id: 'hp23_abbas', x: 560, y: 1800, scale: 0.8, dir: 1, turn: 0.15, pose: 'sit_type', silhouette: 'cool', depth: 1.0,
          keys: [...typing(0.05, adm - 0.1), { at: adm, pose: 'sit', dur: 0.3 }, ...typing(adm + 0.4, sc_ - 0.1).map(k => ({ ...k })), { at: sc_, pose: 'sit_slumped', dur: 0.5 }] }],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'HIS GUILTY PLEA · 2021', fs: 40, sub: 'What he admitted in a US court' },
          { type: 'card', at: lau - 0.15, x: 80, y: 600, w: 920, rows: [{ text: 'CONSPIRACY TO LAUNDER MONEY', fs: 40, colour: '#8e1f18' }, { text: 'from business email compromise', fs: 30 }, { text: 'and other online fraud schemes', fs: 30, at: sc_ - 0.2 }] }
        ],
        tag: LIKENESS
      });
    },

    // 4 - the records: FBI agents in the task-force room; a typed card lists what the account records gave (masked)
    hp23_records(ctx) {
      const t = ctx.t, got = WT(ctx, 0, 1, 0.3), rec = WT(ctx, 0, 4, 1.2), em = WT(ctx, 0, 6, 1.8), ph = WT(ctx, 0, 9, 2.4);
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: {}, grade: 'cold', dust: true,
        cam: { from: { x: 20, y: -30, z: 1.04 }, to: { x: -20, y: -50, z: 1.1 }, handheld: 1.0 },
        figures: [
          { id: 'analyst', x: 230, y: 1580, scale: 0.95, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', keys: [...typing(0.05, rec - 0.1), { at: rec, pose: 'sit_read', expr: 'focused', dur: 0.4 }, { at: ph, pose: 'present', expr: 'realise', dur: 0.4 }] },
          { id: 'agent_a', x: 840, y: 1700, scale: 0.98, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', keys: [{ at: got, pose: 'read', expr: 'focused', dur: 0.3 }, { at: em, pose: 'point', expr: 'determined', dur: 0.4 }, { at: ph + 0.4, pose: 'arms_crossed', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'card', at: rec - 0.2, x: 120, y: 400, w: 840, rows: [{ text: 'ACCOUNT RECORDS (PER FBI AFFIDAVIT)', fs: 28, colour: '#6b665c' }, { text: 'EMAIL  ••••••••@•••••', fs: 40, at: em - 0.1 }, { text: 'PHONE  +••• •• ••• ••••', fs: 40, at: ph - 0.1 }, { text: 'masked here', fs: 22, colour: '#6b665c', at: ph + 0.2 }] }
        ],
        tag: TAG
      });
    },

    // 5 - THE HOW: the clue chain on a desk-side board - a contact saved as "HUSH", then a post photo matched to a passport photo
    hp23_reveal(ctx) {
      const t = ctx.t, snap = WT(ctx, 0, 3, 0.6), sav = WT(ctx, 0, 8, 2.0), hush = WT(ctx, 0, 10, 2.5), l1 = LS(ctx, 1, 3.2), pp = WT(ctx, 1, 5, 4.0);
      const pair = tt => {
        const k = seg(tt, l1 - 0.05, l1 + 0.3); if (k <= 0) return '';
        const head = (cx, cy) => `<ellipse cx="${cx}" cy="${cy - 30}" rx="62" ry="74" fill="#2a2e36"/><path d="M${cx - 120} ${cy + 140} Q${cx - 110} ${cy + 40} ${cx} ${cy + 40} Q${cx + 110} ${cy + 40} ${cx + 120} ${cy + 140} Z" fill="#2a2e36"/>`;
        const box = (x, lab, extra) => `<rect x="${x}" y="560" width="300" height="300" rx="12" fill="#e8e2d2" stroke="${INK}" stroke-width="5"/><defs><clipPath id="hp23c${x}"><rect x="${x + 10}" y="570" width="280" height="280"/></clipPath></defs><g clip-path="url(#hp23c${x})"><rect x="${x + 10}" y="570" width="280" height="280" fill="${extra}"/>${head(x + 150, 730)}</g><text x="${x + 150}" y="900" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" fill="#f4efe4">${lab}</text>`;
        const m = seg(tt, pp - 0.1, pp + 0.2);
        return `<g opacity="${f1(k)}" transform="translate(0 -70)"><rect x="110" y="520" width="860" height="420" rx="16" fill="#000" opacity="0.6"/>${box(150, 'A POSTED PHOTO', '#ffb07a')}${box(630, 'PASSPORT PHOTO', '#c8d4e0')}` +
          `<path d="M470 710 L610 710" stroke="${YEL}" stroke-width="8" stroke-dasharray="14 10" opacity="${f1(m)}"/><circle cx="540" cy="710" r="${f1(36 * m)}" fill="${YEL}"/><path d="M522 712 L536 726 L560 696" stroke="#111" stroke-width="7" fill="none" opacity="${f1(m)}"/></g>`;
      };
      return E.cine.shot(ctx, {
        set: 'office_day', setOpts: {}, grade: 'cold',
        cam: { keys: [{ at: 0, x: -20, y: 0, z: 1.02 }, { at: l1 - 0.3, x: 30, y: -30, z: 1.1, dur: 1.0 }], handheld: 1.6 },
        shake: [{ at: hush, amp: 4 }],
        figures: [
          { id: 'agent_b', x: 260, y: 1720, scale: 0.9, dir: 1, turn: 0.45, pose: 'read', expr: 'focused', keys: [{ at: snap, pose: 'examine', expr: 'focused', dur: 0.4 }, { at: hush - 0.1, pose: 'point', expr: 'realise', dur: 0.3 }, { at: pp, pose: 'hand_to_face', expr: 'determined', dur: 0.4 }] },
          { id: 'agent_a', x: 840, y: 1740, scale: 0.92, dir: -1, turn: 0.45, pose: 'arms_crossed', expr: 'focused', keys: [{ at: sav, pose: 'stand', expr: 'realise', dur: 0.3 }, { at: pp + 0.1, pose: 'point', expr: 'determined', dur: 0.35 }] }
        ],
        overlays: [
          { type: 'card', at: snap - 0.1, until: l1 - 0.1, x: 120, y: 420, w: 840, rows: [{ text: 'SNAPCHAT ACCOUNT: SAME EMAIL', fs: 32, colour: '#6b665c' }, { text: "SAVED IN AN ACCOMPLICE'S PHONE AS", fs: 30, at: snap + 0.5 }, { text: '"HUSH"', fs: 72, colour: '#8e1f18', at: hush - 0.25 }] },
          { type: 'svg', at: l1 - 0.05, svg: pair },
          { type: 'stamp', at: pp + 0.25, x: 540, y: 410, text: 'MATCH', scale: 1.1, colour: '#c8312b' }
        ],
        tag: TAG
      });
    },

    // 6 - the raid (June 2020): two officers (no insignia, no weapons) at his apartment door at night; the door opens; he is
    //     led out (silhouette). Fun fact: Dubai Police called the operation 'Fox Hunt 2'.
    hp23_raid(ctx) {
      const t = ctx.t, dub = WT(ctx, 0, 3, 0.9), rd = WT(ctx, 0, 5, 1.6), apt = WT(ctx, 0, 7, 2.2), hd = WT(ctx, 0, 9, 2.8), fbi = WT(ctx, 0, 13, 3.8), end = ctx.T;
      const open = tt => seg(tt, rd - 0.1, rd + 0.4);
      return E.cine.shot(ctx, {
        set: 'hp23_corridor', setOpts: { door: { x: 760, open: open(t) } }, grade: 'night', police: 0.2 * seg(t, rd - 0.2, rd + 0.4),
        cam: { from: { x: -40, y: 0, z: 1.0 }, to: { x: 30, y: -20, z: 1.08 }, handheld: 2.4 },
        shake: [{ at: rd, amp: 6 }],
        figures: [
          { id: 'hp23_officer', x: 200, y: 1560, scale: 0.72, dir: 1, turn: 0.5, pose: 'stand', expr: 'stern', walk: { from: -200, to: 420, at: 0.0, dur: Math.max(0.6, rd - 0.1), cadence: 6.6 }, keys: [{ at: rd - 0.05, pose: 'point', expr: 'determined', dur: 0.3 }, { at: hd, pose: 'present', dur: 0.4 }] },
          { id: 'hp23_officer', x: 60, y: 1660, scale: 0.8, dir: 1, turn: 0.45, pose: 'stand', expr: 'focused', hat: { style: 'cap', color: '#2a3040', band: '#3a4252' }, walk: { from: -360, to: 200, at: 0.15, dur: Math.max(0.6, rd), cadence: 6.4 }, keys: [{ at: apt, pose: 'torch', expr: 'stern', dur: 0.3 }, { at: fbi, pose: 'hands_behind', dur: 0.4 }] },
          { id: 'hp23_abbas', x: 890, y: 1252, scale: 0.6, dir: -1, turn: 0.4, pose: 'stand', silhouette: 'cool', depth: 0.62, show: [rd + 0.2],
            keys: [{ at: rd + 0.25, pose: 'stand_tense', dur: 0.2 }, { at: hd, pose: 'hands_behind', dur: 0.4 }, { at: fbi, pose: 'bowed', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'funfact', at: WT(ctx, 0, 0, 0.05) - 0.05, until: hd - 0.15, y: 390, w: 920, fs: 40, rows: [{ text: 'Dubai Police called it' }, { text: 'OPERATION "FOX HUNT 2"', colour: YEL }] },
          { type: 'card', at: hd - 0.05, x: 80, y: 400, w: 920, rows: [{ text: 'POLICE SAID THEY SEIZED CASH AND 13 LUXURY CARS', fs: 26, colour: '#6b665c' }, { text: 'HANDED TO THE FBI', fs: 54, colour: '#8e1f18', at: hd + 0.1 }, { text: 'Flown to the US · July 2020', fs: 26, at: fbi - 0.3 }] }
        ],
        tag: LIKENESS
      });
    },

    // 7 - the outcome: guilty plea (April 2021), 135 months (November 2022), restitution; a federal courtroom (generic)
    hp23_verdict(ctx) {
      const pg = WT(ctx, 0, 2, 0.4), l1 = LS(ctx, 1, 2.4), el = WT(ctx, 1, 4, 3.0);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.1 }, handheld: 0.6 },
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.33, keys: [{ at: pg - 0.4, pose: 'gavel', dur: 0.3 }, { at: pg + 0.05, pose: 'sit', dur: 0.15 }, { at: l1, pose: 'sit_read', dur: 0.5 }] },
          { id: 'hp23_abbas', x: 840, y: 1770, scale: 0.95, dir: -1, turn: 0.15, pose: 'stand', silhouette: 'cool', keys: [{ at: pg, pose: 'hands_together', dur: 0.4 }, { at: el, pose: 'bowed', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'card', at: 0.15, x: 40, y: 860, w: 640, rows: [{ text: 'LOS ANGELES · FEDERAL COURT', fs: 24, colour: '#6b665c' }, { text: 'PLEADED GUILTY · 2021', fs: 34, colour: '#8e1f18', at: pg - 0.05 }, { text: '135 MONTHS · NOV 2022', fs: 34, at: l1 - 0.4 }, { text: '+ $1.7M RESTITUTION', fs: 26, colour: '#6b665c', at: el - 0.2 }] }
        ],
        tag: LIKENESS
      });
    },

    // 8 - callback on the hero object (same framing as the first frame); the account header lights up on "reading";
    //     then a compact follow card above the phone. The last frame loops back to the first.
    hp23_end(ctx) {
      const t = ctx.t, pub = WT(ctx, 0, 3, 0.8), l1 = LS(ctx, 1, 1.6), rd = WT(ctx, 1, 2, 2.2), end = ctx.T;
      return E.cine.shot(ctx, {
        set: 'hp23_penthouse', setOpts: { view: 'window' }, grade: 'night',
        cam: { from: { x: 0, y: -20, z: 1.06 }, to: { x: 0, y: 0, z: 1.0 }, handheld: 0.6 },
        props: [{ depth: 1.15, svg: tt => phoneHero(500, 1010, 0.9, tt, { scroll: 500 * ease.inOut(seg(tt, 0.1, 0.9)) + 1000 * ease.inOut(seg(tt, end - 1.4, end - 0.3)), like: seg(tt, pub - 0.1, pub + 0.2) * (1 - seg(tt, end - 1.6, end - 0.8)), ring: 0.9 * seg(tt, rd - 0.2, rd + 0.2) * (1 - seg(tt, end - 1.6, end - 0.6)) }) }],
        overlays: [
          { type: 'label', at: l1 - 0.05, until: end - 1.65, x: 60, y: 432, text: 'INVESTIGATORS WERE READING', fs: 40, sub: 'Per the FBI affidavit' },
          { type: 'nextcase', at: end - 1.55, y: 380, w: 900, rows: [{ text: "MORE 'CAUGHT BY…' CASES", fs: 44 }], sub: 'FOLLOW' }
        ],
        tag: GENERIC
      });
    }
  });
})();
