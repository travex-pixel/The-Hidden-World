/* Case File 49 (premium look, engagement + shares + smoothness + hooks + 48+ rules): the July 2020 Twitter hack. Graham
   Ivan Clark, 17, of Tampa, Florida, with others, phoned Twitter staff posing as tech support, took their logins through a
   look-alike page, reached Twitter's internal admin tools and hijacked high-profile accounts (Obama, Musk, Gates, Apple...)
   to post a "send Bitcoin, I will double it" scam that took in over $100,000 in one day.
   Structure: frame 1 = the HERO OBJECT (a phone showing a generic "verified" post) big and centred, a silhouetted hand
   already scrolling it and his silhouette at the desk behind, the camera already pushing in; the call (an open-plan office
   at night: a staffer takes a call and types her password into a fake login page); his room again (the admin panel; 130
   accounts targeted; then the scam post on his monitor); the office again (the money, the single impact and shake; the fun
   fact: Twitter froze every verified account); the map to Tampa (after 15 s; the arrest); the statistic counter in an
   investigators' office; the LESSON for the viewer (a young man at a bus shelter securing his phone; captions off); the
   outcome back on the hero phone in the first frame's framing with the burned-in end question.
   Smoothness (owner, 44+): mostly cuts and dissolves, one push, one zoom (the end); one slow camera move per shot; settle
   only on the three hero dolly-ins; one shake and one impact in the whole video; no handheld (no chase).
   Look: episode.look = 'premium', a cool night palette (shadow #101a26, mid #b4bcc4, accent #52c4b4). The ONLY strongly
   coloured object is the phone's post (tick, wallet line, glow: props marked accent: true).
   Content rules: Clark was a minor at the time: ONLY a faceless rim-lit silhouette (NOT A LIKENESS), nothing about his life
   now. No real tweet, screenshot, logo, bird, badge or app interface: a generic social app, a plain tick, grey placeholder
   name bars; the post wording is our own paraphrase. Everyone else is a generic figure; no company or agency insignia.
   New environments (E.registerSets): tt49_room (a teenager's bedroom at night: a desk, a big monitor, a window onto palms
   and city lights), tt49_office (an open-plan tech office at night: rows of desks and screens, a skyline beyond, a front
   desk with a monitor and a desk phone), tt49_street (a city street at night: shopfronts, a bus shelter, streetlights,
   wet road). Plus the engine's mapflight and task_force. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#0b0f14';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#52c4b4';
  const NUN = 'font-family="Nunito" font-weight="800"';

  // ---------- THE HERO: a phone with a generic social app showing one "verified" post (our own wording, a paraphrase of
  // the scam; no real tweet, logo or badge). Centre (x, y), ~380 x 760 at s = 1. o.k 0..1 = how much of the post text is
  // typed in; o.glow 0..1 = a soft accent wash behind it; o.rot degrees; o.hand = a silhouetted hand holding it (thumb
  // scrolling with time); o.paused 0..1 = a "posting paused" bar slides over the post (the fun fact).
  const POST = ['Send me Bitcoin.', 'I will send you', 'double back.'];
  function phone(x, y, s, t, o = {}) {
    const k = o.k ?? 1, gl = o.glow ?? 0.7, rot = o.rot ?? 0, scroll = o.scroll ?? 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    g += `<ellipse cx="18" cy="40" rx="240" ry="420" fill="#000" opacity="0.4" filter="url(#cineSoft)"/>`;
    if (gl > 0) g += wash(0, 0, 330, 520, ACC, f1(0.16 * gl));
    if (o.hand) g += `<path d="M-236 60 C-262 260 -240 480 -170 640 L-120 760 L110 760 L150 600 C176 460 196 320 206 140 Z" fill="#06080b" stroke="#3e5262" stroke-width="3"/>`;   // the palm and wrist (behind)
    g += `<rect x="-190" y="-380" width="380" height="760" rx="56" fill="#0c0f13" stroke="${INK}" stroke-width="6"/>`;
    g += `<rect x="-184" y="-374" width="368" height="748" rx="52" fill="none" stroke="#5a6670" stroke-width="3" opacity="0.7"/>`;
    g += `<defs><clipPath id="tt49scr"><rect x="-172" y="-360" width="344" height="720" rx="40"/></clipPath></defs>`;
    g += `<g clip-path="url(#tt49scr)"><rect x="-172" y="-360" width="344" height="720" fill="#0f1a22"/>`;
    // status bar and a plain app header (no logo: three bars and a round profile dot)
    g += `<rect x="-150" y="-338" width="46" height="10" rx="5" fill="#c9d2d8" opacity="0.7"/><rect x="104" y="-338" width="46" height="10" rx="5" fill="#c9d2d8" opacity="0.7"/>`;
    g += `<circle cx="-136" cy="-290" r="16" fill="#3a4a56"/><rect x="-20" y="-298" width="40" height="16" rx="8" fill="#2c3a44"/><path d="M118 -298 h30 M118 -290 h30 M118 -282 h30" stroke="#6a7a86" stroke-width="4"/>`;
    g += `<rect x="-172" y="-262" width="344" height="2" fill="#2a3842"/>`;
    g += `<g transform="translate(0 ${f1(-scroll)})">`;
    // the post: avatar, placeholder name bar, a plain tick in a circle (accent), a handle bar
    g += `<circle cx="-126" cy="-214" r="32" fill="#5e6e7a"/><circle cx="-126" cy="-224" r="12" fill="#8a9aa6"/><path d="M-148 -194 q22 -22 44 0" fill="#8a9aa6"/>`;
    g += `<rect x="-80" y="-236" width="140" height="20" rx="10" fill="#dfe6ea"/>`;
    g += `<circle cx="84" cy="-226" r="15" fill="${ACC}"/><path d="M76 -226 l6 6 l11 -12" stroke="#0b1a1a" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    g += `<rect x="-80" y="-206" width="100" height="14" rx="7" fill="#6e7c86"/>`;
    // the post text, typed in
    const total = POST.join('').length; let used = 0;
    POST.forEach((ln, i) => { const n = clamp(Math.round(total * k) - used, 0, ln.length); used += ln.length; if (n > 0) g += `<text x="-150" y="${-128 + i * 46}" ${NUN} font-size="34" fill="#f2f5f7">${E.esc(ln.slice(0, n))}</text>`; });
    // the wallet line (accent) and generic reaction icons with placeholder counts
    const kw = seg(k, 0.85, 1);
    if (kw > 0) g += `<g opacity="${f1(kw)}"><rect x="-150" y="20" width="300" height="56" rx="14" fill="#14262a" stroke="${ACC}" stroke-width="3"/><text x="-130" y="58" font-family="Nunito" font-weight="700" font-size="25" fill="${ACC}" letter-spacing="1">bc1q •••• •••• ••••</text></g>`;
    g += `<g stroke="#7d8a94" stroke-width="4" fill="none"><path d="M-140 118 h30 v20 h-18 l-8 8 v-8 h-4 Z"/><path d="M-50 112 l10 -8 l10 8 M-40 104 v26 M-14 136 l-10 8 l-10 -8 M-24 144 v-26"/><path d="M60 140 c-24 -16 -24 -34 -10 -36 c6 0 10 6 10 6 c0 0 4 -6 10 -6 c14 2 14 20 -10 36 Z"/></g>`;
    g += `<rect x="-100" y="118" width="34" height="12" rx="6" fill="#4a5862"/><rect x="0" y="118" width="34" height="12" rx="6" fill="#4a5862"/><rect x="80" y="118" width="40" height="12" rx="6" fill="#4a5862"/>`;
    g += `<rect x="-172" y="170" width="344" height="2" fill="#2a3842"/>`;
    // a second post below (all placeholders)
    g += `<circle cx="-126" cy="226" r="28" fill="#3e4c56"/><rect x="-82" y="208" width="120" height="16" rx="8" fill="#56646e"/><rect x="-82" y="236" width="80" height="12" rx="6" fill="#3e4c56"/>` +
      [0, 1, 2].map(i => `<rect x="-150" y="${280 + i * 32}" width="${290 - i * 60}" height="16" rx="8" fill="#33414b"/>`).join('');
    g += `</g>`;
    if (o.paused > 0) { const q = ease.out(clamp(o.paused, 0, 1)); g += `<g transform="translate(0 ${f1(lerp(-460, 0, q))})"><rect x="-172" y="-262" width="344" height="110" fill="#0b1418" opacity="0.94"/><rect x="-172" y="-154" width="344" height="3" fill="${ACC}"/><text x="0" y="-198" text-anchor="middle" ${NUN} font-size="30" fill="#f2f5f7" letter-spacing="2">POSTING PAUSED</text></g>`; }
    g += `<rect x="-172" y="-360" width="344" height="720" fill="url(#tt49glare)" opacity="0.5"/></g>`;
    g += `<defs><linearGradient id="tt49glare" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="0.4" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs>`;
    if (o.hand) {   // a silhouetted left hand: the fingertips curl round the right edge, the thumb rests on the screen's
      // lower left and moves slightly (scrolling); the palm itself is drawn behind the phone (handBack below)
      const th = 8 * Math.sin(t * 2.2), HC = '#06080b', HS = '#3e5262';
      [[-10, 40], [74, 42], [158, 40], [238, 34]].forEach(([fy, fl]) => { g += `<rect x="178" y="${f1(fy)}" width="${fl}" height="60" rx="28" fill="${HC}" stroke="${HS}" stroke-width="3"/>`; });
      g += `<path d="M-200 470 C-214 400 -206 ${f1(330 + th)} -170 ${f1(286 + th)} C-146 ${f1(258 + th)} -104 ${f1(262 + th)} -100 ${f1(296 + th)} C-98 ${f1(330 + th)} -128 370 -150 430 Z" fill="${HC}" stroke="${HS}" stroke-width="3"/>`;
    }
    return g + '</g>';
  }

  // a monitor on a stand; centre top-left (x, y) with size w x h; content = an svg string drawn in screen space (0..w, 0..h)
  function monitor(x, y, w, h, content, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)})">`;
    g += wash(w / 2, h / 2, w * 0.8, h * 0.9, o.glowCol || '#cfe6ff', o.glowOp ?? 0.12);
    g += `<rect x="${w / 2 - 18}" y="${h}" width="36" height="${o.stand ?? 70}" fill="#1a2026"/><rect x="${w / 2 - 90}" y="${h + (o.stand ?? 70) - 12}" width="180" height="14" rx="6" fill="#1a2026"/>`;
    g += `<rect x="-14" y="-14" width="${w + 28}" height="${h + 28}" rx="10" fill="#0d1116" stroke="${INK}" stroke-width="5"/>`;
    const cid = `tt49m${Math.round(x)}_${Math.round(y)}_${Math.round(w)}`;
    g += `<defs><clipPath id="${cid}"><rect x="0" y="0" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${cid})"><rect width="${w}" height="${h}" fill="#101c26"/>${content}</g>`;
    return g + '</g>';
  }
  // screen contents (generic): a feed of placeholder posts, an admin panel (rows ticking to TARGETED), a fake login page
  const feedScreen = (w, h, t) => { let s = ''; const off = (t * 40) % 140; for (let i = -1; i < Math.ceil(h / 140) + 1; i++) { const yy = i * 140 - off + 20; s += `<circle cx="50" cy="${f1(yy + 30)}" r="24" fill="#4a5a66"/><rect x="90" y="${f1(yy + 14)}" width="${w * 0.4}" height="14" rx="7" fill="#c9d2d8"/><rect x="90" y="${f1(yy + 44)}" width="${w * 0.7}" height="12" rx="6" fill="#4a5862"/><rect x="90" y="${f1(yy + 68)}" width="${w * 0.55}" height="12" rx="6" fill="#4a5862"/>`; } return s; };
  function adminScreen(w, h, k) {
    let s = `<rect width="${w}" height="56" fill="#1a2a36"/><text x="24" y="38" ${NUN} font-size="26" fill="#dfe6ea" letter-spacing="2">ACCOUNT TOOLS</text><rect x="${w - 190}" y="16" width="166" height="26" rx="13" fill="#2a3a46"/>`;
    s += `<rect y="56" width="120" height="${h - 56}" fill="#14222c"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="20" y="${84 + i * 46}" width="${80 - (i % 2) * 20}" height="14" rx="7" fill="#3e4e5a"/>`).join('');
    const n = 7, rh = (h - 76) / n;
    for (let i = 0; i < n; i++) { const yy = 66 + i * rh, on = k * n > i, q = clamp(k * n - i, 0, 1);
      s += `<rect x="134" y="${f1(yy)}" width="${w - 148}" height="${f1(rh - 8)}" rx="6" fill="${on ? '#1e3236' : '#16242e'}"/><circle cx="${f1(160)}" cy="${f1(yy + rh / 2 - 4)}" r="${f1(rh * 0.28)}" fill="#5e6e7a"/><rect x="190" y="${f1(yy + rh / 2 - 12)}" width="${f1(w * 0.3)}" height="14" rx="7" fill="#c9d2d8"/>`;
      if (on) s += `<g opacity="${f1(q)}"><rect x="${w - 214}" y="${f1(yy + rh / 2 - 20)}" width="190" height="32" rx="16" fill="none" stroke="${ACC}" stroke-width="3"/><text x="${w - 119}" y="${f1(yy + rh / 2 + 5)}" text-anchor="middle" ${NUN} font-size="20" fill="${ACC}" letter-spacing="1">TARGETED</text></g>`; }
    return s;
  }
  // the scam post, big on a monitor (generic: placeholder name bar, a plain tick, our own paraphrase); k = typed fraction
  function postScreen(w, h, k) {
    let s = `<rect width="${w}" height="${h}" fill="#0f1a22"/><rect width="${w}" height="50" fill="#14222c"/><circle cx="34" cy="25" r="12" fill="#3a4a56"/>`;
    s += `<circle cx="90" cy="120" r="44" fill="#5e6e7a"/><rect x="152" y="88" width="210" height="26" rx="13" fill="#dfe6ea"/><circle cx="392" cy="101" r="19" fill="${ACC}"/><path d="M382 101 l7 7 l14 -15" stroke="#0b1a1a" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="152" y="128" width="140" height="18" rx="9" fill="#6e7c86"/>`;
    const L = ['Send me Bitcoin. I will', 'send you double back.']; const tot = L.join('').length; let used = 0;
    L.forEach((ln, i) => { const n = clamp(Math.round(tot * k) - used, 0, ln.length); used += ln.length; if (n > 0) s += `<text x="46" y="${222 + i * 56}" ${NUN} font-size="44" fill="#f2f5f7">${E.esc(ln.slice(0, n))}</text>`; });
    const kw = seg(k, 0.85, 1); if (kw > 0) s += `<g opacity="${f1(kw)}"><rect x="46" y="320" width="${w - 92}" height="64" rx="16" fill="#14262a" stroke="${ACC}" stroke-width="3"/><text x="72" y="362" font-family="Nunito" font-weight="700" font-size="30" fill="${ACC}" letter-spacing="1">bc1q •••• •••• •••• ••••</text></g>`;
    return s;
  }
  function loginScreen(w, h, k, t) {
    const cx = w / 2; let s = `<rect width="${w}" height="${h}" fill="#e8ecef"/><rect width="${w}" height="40" fill="#cfd6db"/><rect x="16" y="12" width="${w * 0.6}" height="16" rx="8" fill="#f6f8f9"/>`;
    s += `<rect x="${cx - 150}" y="70" width="300" height="${h - 100}" rx="12" fill="#ffffff" stroke="#c4ccd2" stroke-width="2"/>`;
    s += `<g transform="translate(${cx} 112)"><rect x="-16" y="-6" width="32" height="26" rx="4" fill="#5a6a76"/><path d="M-10 -6 v-8 a10 10 0 0 1 20 0 v8" stroke="#5a6a76" stroke-width="5" fill="none"/></g>`;
    s += `<text x="${cx}" y="164" text-anchor="middle" ${NUN} font-size="22" fill="#2a3640" letter-spacing="2">SIGN IN</text>`;
    s += `<rect x="${cx - 120}" y="186" width="240" height="36" rx="6" fill="#f2f4f6" stroke="#b8c2ca" stroke-width="2"/><rect x="${cx - 108}" y="198" width="${f1(130 * clamp(k * 2, 0, 1))}" height="12" rx="6" fill="#6a7a86"/>`;
    s += `<rect x="${cx - 120}" y="236" width="240" height="36" rx="6" fill="#f2f4f6" stroke="#b8c2ca" stroke-width="2"/>`;
    const dots = Math.floor(10 * clamp(k * 2 - 1, 0, 1)); for (let i = 0; i < dots; i++) s += `<circle cx="${cx - 104 + i * 20}" cy="254" r="6" fill="#2a3640"/>`;
    if (dots > 0 && dots < 10 && Math.sin(t * 12) > 0) s += `<rect x="${cx - 96 + dots * 20}" y="244" width="3" height="20" fill="#2a3640"/>`;
    s += `<rect x="${cx - 120}" y="${h - 76}" width="240" height="34" rx="17" fill="#5a6a76"/>`;
    return s;
  }
  // a desk phone with a line light; o.ring 0..1 = ringing (light blinks, small sound arcs)
  function deskPhone(x, y, s, t, ring = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M-90 0 L-70 -70 L70 -70 L90 0 Z" fill="#1c2228" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-84 -76 C-84 -104 84 -104 84 -76 L60 -66 L-60 -66 Z" fill="#262e36" stroke="${INK}" stroke-width="4"/>`;
    g += [0, 1, 2].map(r => [0, 1, 2].map(c => `<rect x="${-30 + c * 22}" y="${-56 + r * 16}" width="16" height="10" rx="2" fill="#4a5662"/>`).join('')).join('');
    const on = ring > 0 && Math.sin(t * 14) > 0; g += `<circle cx="56" cy="-40" r="7" fill="${on ? '#f2f5f7' : '#3a444e'}"/>`;
    if (ring > 0) for (let i = 0; i < 3; i++) { const q = ((t * 1.6 + i / 3) % 1); g += `<path d="M${f1(100 + q * 50)} ${f1(-110 - q * 30)} q${f1(20 + q * 10)} 30 0 ${f1(60 + q * 20)}" stroke="#dfe6ea" stroke-width="4" fill="none" opacity="${f1(ring * (1 - q) * 0.7)}"/>`; }
    return g + '</g>';
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a teenager's bedroom at night: a dark blue wall, a window onto palms and city lights (right), a shelf, a desk across
    // the front with a big monitor. o.screen = 'feed' | 'admin'; o.k = the admin rows; o.mon = {x, y, w, h} overrides the
    // monitor placement (the close-up on the admin panel).
    tt49_room(ctx, o = {}) {
      const t = ctx.t, r = R(4901);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#18222e"/><rect x="-300" y="1040" width="${W + 600}" height="400" fill="#141c26"/>`;
      // the window (night sky, palm silhouettes, distant lights)
      back += `<rect x="640" y="160" width="420" height="560" fill="#0c1626" stroke="#2a3644" stroke-width="12"/>`;
      back += `<defs><clipPath id="tt49win"><rect x="640" y="160" width="420" height="560"/></clipPath></defs><g clip-path="url(#tt49win)">`;
      back += `<rect x="640" y="160" width="420" height="560" fill="#13243a"/>` + wash(860, 640, 300, 120, '#e8c89a', 0.18);
      for (let i = 0; i < 30; i++) back += `<rect x="${f1(650 + r() * 400)}" y="${f1(560 + r() * 140)}" width="5" height="5" fill="#f0d8a8" opacity="${f1(0.4 + 0.5 * r())}"/>`;
      back += `<path d="M700 720 Q714 560 744 470" stroke="#070b10" stroke-width="14" fill="none"/>` + [0, 1, 2, 3, 4, 5].map(i => { const a = -Math.PI + i * 0.62 + 0.1 * Math.sin(t * 0.8); return `<path d="M744 470 Q${f1(744 + Math.cos(a) * 60)} ${f1(470 + Math.sin(a) * 50 - 20)} ${f1(744 + Math.cos(a) * 120)} ${f1(470 + Math.sin(a) * 40 + 40)}" stroke="#070b10" stroke-width="12" fill="none" stroke-linecap="round"/>`; }).join('');
      back += `</g><path d="M850 160 L850 720 M640 440 L1060 440" stroke="#2a3644" stroke-width="10"/>`;
      // a shelf with plain boxes and a blank poster
      back += `<rect x="-120" y="300" width="420" height="16" fill="#2c3846"/>` + [0, 1, 2, 3].map(i => `<rect x="${-100 + i * 92}" y="${236 - (i % 2) * 20}" width="70" height="${64 + (i % 2) * 20}" fill="#2a3440" stroke="${INK}" stroke-width="3"/>`).join('');
      back += `<rect x="330" y="200" width="200" height="270" fill="#26303c" stroke="#33404e" stroke-width="6"/><circle cx="430" cy="300" r="56" fill="none" stroke="#3e4c5a" stroke-width="8"/>`;
      // the desk and the monitor
      const m = o.mon || { x: 620, y: 700, w: 400, h: 250 };
      const content = o.screen === 'admin' ? adminScreen(m.w, m.h, o.k ?? 0) : o.screen === 'post' ? postScreen(m.w, m.h, o.k ?? 1) : feedScreen(m.w, m.h, t);
      let mid = monitor(m.x, m.y, m.w, m.h, content, { stand: o.mon ? 120 : 80, glowOp: 0.16 });
      let front = `<rect x="-300" y="1150" width="${W + 600}" height="34" fill="#2a3440" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1184" width="${W + 600}" height="${H}" fill="#121a22"/>`;
      front += `<rect x="-300" y="1184" width="${W + 600}" height="10" fill="#0a1016" opacity="0.8"/>` + wash(m.x + m.w / 2, 1160, m.w * 0.8, 70, '#cfe6ff', 0.14);
      front += `<g transform="translate(${f1(m.x + m.w / 2 - 150)} 1140)"><rect x="0" y="-12" width="300" height="20" rx="6" fill="#1a222a" stroke="${INK}" stroke-width="3"/>` + [...Array(12)].map((_, i) => `<rect x="${10 + i * 24}" y="-8" width="18" height="6" rx="2" fill="#2e3a46"/>`).join('') + `</g>`;
      return { light: { dir: 1, rim: '#9fc6ff', key: '#cfe6ff' }, layers: [[0.12, back], [0.6, mid], [1.06, front]] };
    },

    // an open-plan tech office at night: a skyline through tall windows, ceiling light strips, rows of desks with glowing
    // screens; a front desk (o.front !== false) with a monitor and a desk phone. o.screen = 'login' | 'paused' | 'feed';
    // o.k = the login progress; o.ring 0..1 = the desk phone ringing; o.alert 0..1 = every far screen turns to a warning bar
    tt49_office(ctx, o = {}) {
      const t = ctx.t, r = R(4902), al = clamp(o.alert || 0, 0, 1);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#141e2a"/>`;
      back += `<rect x="-300" y="180" width="${W + 600}" height="560" fill="#0d1828"/>`;
      for (let i = 0; i < 16; i++) { const bx = -300 + i * 110 + r() * 30, bh = 120 + r() * 300; back += `<rect x="${f1(bx)}" y="${f1(740 - bh)}" width="${f1(80 + r() * 40)}" height="${f1(bh)}" fill="#18263a"/>`; for (let j = 0; j < 8; j++) back += `<rect x="${f1(bx + 8 + r() * 60)}" y="${f1(740 - bh + 10 + r() * (bh - 20))}" width="6" height="6" fill="#e8d4a8" opacity="${f1(0.3 + 0.5 * r())}"/>`; }
      for (let i = 0; i < 7; i++) back += `<rect x="${-300 + i * 260}" y="180" width="14" height="560" fill="#24303e"/>`;
      back += `<rect x="-300" y="60" width="${W + 600}" height="120" fill="#1a2532"/>` + [0, 1, 2].map(i => `<rect x="${-100 + i * 460}" y="140" width="300" height="12" rx="6" fill="#e8eef2" opacity="0.8"/>` + wash(50 + i * 460, 160, 260, 60, '#e8eef2', 0.12)).join('');
      let rows = `<rect x="-300" y="740" width="${W + 600}" height="${H}" fill="#1a2430"/>`;
      for (let rr = 0; rr < 2; rr++) { const yy = 860 + rr * 150, sz = 0.8 + rr * 0.25;
        rows += `<rect x="-300" y="${yy}" width="${W + 600}" height="${f1(18 * sz)}" fill="#2a3644" stroke="${INK}" stroke-width="3"/>`;
        for (let i = 0; i < 6; i++) { const mx = -240 + i * 270 + rr * 120, mw = 110 * sz, mh = 70 * sz;
          rows += `<rect x="${f1(mx)}" y="${f1(yy - mh - 16)}" width="${f1(mw)}" height="${f1(mh)}" rx="4" fill="${al > 0 && (i + rr) % 2 === 0 ? '#3a2a2c' : '#1e3040'}" stroke="${INK}" stroke-width="3"/>` + wash(mx + mw / 2, yy - mh / 2, mw, mh, al > 0 ? '#f0a090' : '#cfe6ff', f1(0.08 + 0.1 * al * (0.5 + 0.5 * Math.sin(t * 6 + i))));
          if (al > 0) rows += `<rect x="${f1(mx + 10)}" y="${f1(yy - mh / 2 - 22)}" width="${f1(mw - 20)}" height="10" rx="5" fill="#e8a090" opacity="${f1(0.7 * al)}"/>`; } }
      let front = '';
      if (o.front !== false) {
        const cy = o.cy ?? 1250;
        const m = { x: o.monX ?? 140, y: cy - 330, w: 400, h: 250 };
        const content = o.screen === 'login' ? loginScreen(m.w, m.h, o.k ?? 0, t) : o.screen === 'paused'
          ? `<rect width="${m.w}" height="${m.h}" fill="#101c26"/>${feedScreen(m.w, m.h, 0)}<rect width="${m.w}" height="${m.h}" fill="#101c26" opacity="${f1(0.7 * (o.k ?? 1))}"/><rect x="40" y="${m.h / 2 - 30}" width="${m.w - 80}" height="60" rx="10" fill="#0b1418" stroke="${ACC}" stroke-width="3" opacity="${f1(o.k ?? 1)}"/><text x="${m.w / 2}" y="${m.h / 2 + 10}" text-anchor="middle" ${NUN} font-size="26" fill="#f2f5f7" letter-spacing="2" opacity="${f1(o.k ?? 1)}">VERIFIED: PAUSED</text>`
          : feedScreen(m.w, m.h, t);
        front += monitor(m.x, m.y, m.w, m.h, content, { stand: 60, glowOp: 0.18 });
        front += `<rect x="-300" y="${cy}" width="${W + 600}" height="34" fill="#c8ccd0" stroke="${INK}" stroke-width="5"/><rect x="-300" y="${cy + 34}" width="${W + 600}" height="${H}" fill="#2a323a"/>`;
        front += `<rect x="-300" y="${cy + 34}" width="${W + 600}" height="12" fill="#1a2026"/>` + wash(m.x + m.w / 2, cy, 420, 60, '#cfe6ff', 0.12);
        if (o.phone !== false) front += deskPhone(o.phoneX ?? 860, cy, 1.0, t, o.ring || 0);
        front += `<g transform="translate(${f1(m.x + 60)} ${cy - 8})"><rect x="0" y="-10" width="260" height="16" rx="5" fill="#1a222a"/></g><rect x="${(o.phoneX ?? 860) - 260}" y="${cy - 18}" width="70" height="12" rx="4" fill="#e8e2d2" transform="rotate(-6 ${(o.phoneX ?? 860) - 225} ${cy - 12})"/>`;
      }
      return { light: { dir: -1, rim: '#9fc6ff', key: '#dfeaf2' }, layers: [[0.1, back], [0.4, rows], [1.06, front]] };
    },

    // a city street at night (generic): dark facades with lit windows, a shopfront with a blank lit sign, a bus shelter,
    // streetlights, a wet road with reflections and passing headlights
    tt49_street(ctx, o = {}) {
      const t = ctx.t, r = R(4903);
      let sky = `<defs><linearGradient id="tt49sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1220"/><stop offset="1" stop-color="#22324a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#tt49sk)"/>`;
      let far = '';
      for (let i = 0; i < 9; i++) { const bx = -300 + i * 190, bh = 500 + r() * 500; far += `<rect x="${f1(bx)}" y="${f1(1100 - bh)}" width="180" height="${f1(bh)}" fill="${i % 2 ? '#141e2c' : '#18243a'}" stroke="#0a0f16" stroke-width="3"/>`;
        for (let j = 0; j < 10; j++) far += `<rect x="${f1(bx + 14 + (j % 4) * 40)}" y="${f1(1100 - bh + 30 + Math.floor(j / 4) * 70 + r() * 20)}" width="22" height="30" fill="#e8d0a0" opacity="${f1(r() < 0.5 ? 0.12 : 0.55)}"/>`; }
      let mid = `<rect x="-300" y="860" width="760" height="260" fill="#202a36" stroke="${INK}" stroke-width="5"/><rect x="-260" y="880" width="680" height="60" rx="6" fill="#d8dfe4" opacity="0.85"/>` + wash(80, 910, 360, 80, '#f2f5f7', 0.18) +
        `<rect x="-260" y="960" width="680" height="160" fill="#2c3a48" opacity="0.9"/>` + wash(80, 1040, 340, 90, '#f0d8a8', 0.2);
      // the bus shelter (right)
      mid += `<g transform="translate(720 1120)"><rect x="0" y="-330" width="12" height="330" fill="#3a4652"/><rect x="330" y="-330" width="12" height="330" fill="#3a4652"/><rect x="-10" y="-344" width="362" height="22" fill="#2c3640" stroke="${INK}" stroke-width="3"/><rect x="12" y="-322" width="318" height="300" fill="#a8c4d4" opacity="0.12"/><rect x="200" y="-300" width="120" height="200" fill="#e8eef2" opacity="0.5"/>` + wash(260, -200, 120, 140, '#e8eef2', 0.2) + `</g>`;
      // streetlights
      [[-120, 1120], [560, 1120]].forEach(([lx, ly]) => { mid += `<rect x="${lx}" y="${ly - 520}" width="12" height="520" fill="#2a323a"/><path d="M${lx + 6} ${ly - 520} q60 -20 90 0" stroke="#2a323a" stroke-width="10" fill="none"/><ellipse cx="${lx + 96}" cy="${ly - 512}" rx="22" ry="8" fill="#f6e2b0"/>` + wash(lx + 96, ly - 400, 200, 300, '#f6e2b0', 0.12); });
      let road = `<rect x="-300" y="1120" width="${W + 600}" height="70" fill="#3a424a"/><rect x="-300" y="1190" width="${W + 600}" height="${H}" fill="#1a2028"/>`;
      for (let i = 0; i < 8; i++) road += `<rect x="${-260 + i * 200}" y="1330" width="110" height="10" fill="#d8d0b8" opacity="0.35"/>`;
      road += wash(0, 1260, 200, 140, '#f6e2b0', 0.08) + wash(660, 1260, 200, 140, '#f6e2b0', 0.08);
      const cx = ((t * 260) % 2200) - 600; road += `<g opacity="0.8">${wash(cx, 1230, 60, 14, '#fff4dc', 0.5)}${wash(cx + 120, 1230, 60, 14, '#fff4dc', 0.5)}${wash(cx + 60, 1300, 140, 60, '#fff4dc', 0.1)}</g>`;
      return { light: { dir: -1, rim: '#9fc6ff', key: '#f6e2b0' }, layers: [[0.08, sky], [0.3, far], [0.65, mid], [1.0, road]] };
    }
  });

  // the hero framing in the first and last shots (the loop): the phone big and centred, held from the lower right
  const HERO = { x: 540, y: 960, s: 0.92 };

  E.registerScenes({
    // 1 - hook (frame 1): the phone big and centred, the hand already scrolling, the post already typed; his silhouette at
    //     the desk behind (left) typing; the camera already pushing in. The headline is burned in at the top until ~3 s.
    tt49_hook(ctx) {
      const t = ctx.t, T = ctx.T, hj = WT(ctx, 0, 3, 0.8), l2 = LS(ctx, 1, 2.6);
      return E.cine.shot(ctx, {
        set: 'tt49_room', grade: 'night', dof: true, haze: 0.4,
        cam: { from: { x: 0, y: 20, z: 1.03 }, to: { x: 0, y: 40, z: 1.12 }, settle: true },
        figures: [
          { id: 'tt49_clark', x: 210, y: 1500, scale: 0.86, dir: 1, turn: 0.35, pose: 'sit_type', silhouette: 'cool', depth: 0.9,
            keys: [{ at: hj, pose: 'sit_type_b', dur: 0.4 }, { at: l2 + 0.2, pose: 'sit_type', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.08, accent: true, svg: tt => phone(HERO.x, HERO.y, HERO.s, tt, { k: 1, glow: 0.7 + 0.3 * Math.sin(tt * 3), rot: -3, hand: true, scroll: 0 }) }
        ],
        overlays: [
          { type: 'label', at: Math.max(3.2, l2 + 0.4), x: 60, y: 440, text: 'JULY 15, 2020', fs: 38, sub: 'Also hit: Joe Biden, Jeff Bezos, Kanye West' }
        ],
        tag: LIKE
      });
    },

    // 2 - the call: an open-plan office at night; the desk phone rings; a staffer answers (leans in), then types her
    //     password into a look-alike login page on the front monitor (the dots fill on 'typed')
    tt49_call(ctx) {
      const t = ctx.t, T = ctx.T, ph = WT(ctx, 0, 2, 0.6), ts = WT(ctx, 0, 6, 1.6), l2 = LS(ctx, 1, 2.6), ty = WT(ctx, 1, 1, 2.8), fk = WT(ctx, 1, 5, 3.6);
      return E.cine.shot(ctx, {
        set: 'tt49_office', setOpts: { screen: t > l2 - 0.4 ? 'login' : 'feed', k: seg(t, ty - 0.1, fk + 0.2), ring: 1 - seg(t, ph + 0.2, ph + 0.5), cy: 1250, monX: 120, phoneX: 870 },
        grade: 'night', haze: 0.5,
        cam: { from: { x: 20, y: 30, z: 1.0 }, to: { x: -20, y: 40, z: 1.07 } },
        figures: [
          { id: 'tt49_staffer', x: 660, y: 1560, scale: 0.9, dir: -1, turn: 0.45, pose: 'sit_type', expr: 'focused', depth: 1.0, gaze: [0.4, 0.4],
            keys: [{ at: ph, pose: 'hand_to_face', expr: 'neutral', gaze: [0.6, 0.1], dur: 0.4 }, { at: ts, expr: 'relieved', dur: 0.4 }, { at: ty - 0.2, pose: 'sit_type_b', expr: 'focused', gaze: [-0.8, 0.2], dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: ph + 0.1, until: l2 - 0.2, x: 60, y: 440, text: 'POSING AS THE IT HELP DESK', fs: 40, sub: 'As reported: Twitter and NY regulators' },
          { type: 'label', at: fk - 0.1, x: 60, y: 440, text: 'A LOOK-ALIKE LOGIN PAGE', fs: 40, sub: 'NY regulator\'s report, Oct 2020' }
        ],
        tag: TAG
      });
    },

    // 3 - inside: back in his room, over his shoulder; the big monitor shows a generic admin panel; rows tick to TARGETED
    //     (the ACCOUNTS chip jumps to 130 on '130'); on line 2 the monitor flips to the scam post, typing in as it is spoken
    tt49_tools(ctx) {
      const t = ctx.t, T = ctx.T, tg = WT(ctx, 0, 2, 0.8), n = WT(ctx, 0, 3, 1.2), l2 = LS(ctx, 1, 2.6), sd = WT(ctx, 1, 2, 3.3), db = WT(ctx, 1, 5, 4.3);
      const post = t > l2 - 0.15;
      return E.cine.shot(ctx, {
        set: 'tt49_room', setOpts: { screen: post ? 'post' : 'admin', k: post ? seg(t, sd - 0.2, db + 0.5) : seg(t, tg - 0.2, n + 1.0), mon: { x: 170, y: 520, w: 760, h: 470 } },
        grade: 'night', haze: 0.4,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 20, y: 30, z: 1.07 } },
        figures: [
          { id: 'tt49_clark', x: 120, y: 1780, scale: 1.1, dir: 1, turn: 0.2, pose: 'sit_type', silhouette: 'cool', depth: 1.02,
            keys: [{ at: tg, pose: 'sit_type_b', dur: 0.4 }, { at: n + 0.4, pose: 'sit', dur: 0.5 }, { at: l2, pose: 'sit_type', dur: 0.4 }, { at: db, pose: 'sit', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: n + 0.1, until: l2 - 0.2, x: 60, y: 440, text: '130 ACCOUNTS TARGETED', fs: 40, sub: 'Tweets went out from 45 of them' },
          { type: 'label', at: l2 + 0.3, x: 60, y: 440, text: 'SEND $1,000, GET $2,000 BACK', fs: 38, sub: 'The offer, as reported (paraphrased)' }
        ],
        tag: LIKE
      });
    },

    // 4 - the biggest reveal (music drop, the single impact + shake; a push from his room): the office again; the far screens flash warnings; an
    //     engineer stands, shocked; the front monitor shows the verified feed paused on line 2 (the fun fact card)
    tt49_money(ctx) {
      const t = ctx.t, T = ctx.T, od = WT(ctx, 0, 1, 0.3), mn = WT(ctx, 0, 6, 1.8), l2 = LS(ctx, 1, 2.9), sl = WT(ctx, 1, 3, 3.4);
      return E.cine.shot(ctx, {
        set: 'tt49_office', setOpts: { screen: t > sl - 0.1 ? 'paused' : 'feed', k: seg(t, sl - 0.1, sl + 0.5), alert: seg(t, mn - 0.3, mn + 0.3), cy: 1270, monX: 560, phone: false },
        grade: 'night', haze: 0.5,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 0, y: 40, z: 1.1 }, settle: true },
        shake: [{ at: mn, amp: 3 }],
        figures: [
          { id: 'tt49_engineer', x: 330, y: 1640, scale: 0.92, dir: 1, turn: 0.4, pose: 'sit_type', expr: 'focused', depth: 1.0, gaze: [0.6, 0.2],
            keys: [{ at: mn, pose: 'stand_tense', expr: 'shocked', dur: 0.4 }, { at: sl, pose: 'point', expr: 'determined', gaze: [0.9, 0.1], dur: 0.5 }] },
          { id: 'tt49_staffer', x: 880, y: 1600, scale: 0.84, dir: -1, turn: 0.45, pose: 'stand', expr: 'worried', depth: 0.94,
            keys: [{ at: mn + 0.1, pose: 'hand_to_face', expr: 'shocked', dur: 0.4 }, { at: sl + 0.4, pose: 'arms_crossed', expr: 'worried', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'impact', at: mn, x: 540, y: 760 },
          { type: 'label', at: mn + 0.05, until: l2 - 0.2, x: 60, y: 440, text: '$100,000+ IN BITCOIN', fs: 46, sub: 'In one day (prosecutors)' },
          { type: 'funfact', at: sl - 0.1, y: 440, rows: [{ text: 'TWITTER BRIEFLY BLOCKED' }, { text: 'EVERY VERIFIED ACCOUNT' }, { text: 'FROM TWEETING.' }] }
        ],
        tag: TAG
      });
    },

    // 5 - the arrest: the map; the USA draws itself in, the camera flies to Florida; the pin lands on Tampa
    tt49_map(ctx) {
      const T = ctx.T, dy = WT(ctx, 0, 2, 0.5), ar = WT(ctx, 0, 5, 1.4), tp = WT(ctx, 0, 8, 2.2);
      return E.cine.shot(ctx, {
        set: 'mapflight', grade: 'none', haze: 0,
        setOpts: { geo: 'north_america', from: { center: [-95, 37.5], span: 46 }, to: { center: [-82.2, 28.2], span: 7.5 }, t0: 0.0, t1: T - 0.4,
          country: 'United States of America', country_at: 0.05, draw: true, tilt: true,
          pin: { ll: [-82.46, 27.95], label: 'TAMPA, FLORIDA', at: tp - 0.3, dx: -40, dy: 80, anchor: 'end', fs: 50 },
          labels: [{ ll: [-100, 40], text: 'USA', at: 0.2, fs: 48 }] },
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 0, z: 1.04 } },
        overlays: [{ type: 'label', at: ar, x: 60, y: 440, text: 'JULY 31, 2020 · ARRESTED', fs: 40, sub: 'Charged as an adult: 30 felonies' }],
        tag: 'ILLUSTRATION · MAP, NATURAL EARTH DATA'
      });
    },

    // 6 - the statistic: an investigators' office; an investigator at the evidence wall; the counter $0 -> $68M with the
    //     source credit row beneath it
    tt49_stat(ctx) {
      const t = ctx.t, T = ctx.T, sw = WT(ctx, 0, 1, 0.4), m = WT(ctx, 0, 4, 1.5);
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'cold', haze: 0.5,
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 20, z: 1.07 } },
        figures: [
          { id: 'tt49_agent', x: 800, y: 1900, scale: 1.0, dir: -1, turn: 0.4, pose: 'arms_crossed', expr: 'focused', gaze: [0.5, -0.6], depth: 1.1,
            keys: [{ at: m, pose: 'point_up', gaze: [0.7, -0.8], dur: 0.45 }, { at: m + 1.2, pose: 'stand', expr: 'stern', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'counter', at: sw - 0.1, dur: 1.6, from: 0, to: 68, prefix: '$', suffix: 'M', label: 'LOST TO SIM SWAPS · 2021', y: 640, fs: 170 },
          { type: 'label', at: m, x: 120, y: 810, text: '1,611 COMPLAINTS IN ONE YEAR', fs: 34, sub: 'Source: FBI IC3, Feb 2022' }
        ],
        tag: TAG
      });
    },

    // 7 - the LESSON (save trigger, for the viewer): a young man at a night bus shelter locks down his phone; the
    //     checklist card with the SAVE ribbon (captions off)
    tt49_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 4, 1.2);
      return E.cine.shot(ctx, {
        set: 'tt49_street', grade: 'night', haze: 0.6, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'tt49_viewer', x: 820, y: 1560, scale: 0.86, dir: -1, turn: 0.45, pose: 'hands_together', expr: 'focused', depth: 0.9, gaze: [-0.2, 0.7],
            keys: [{ at: sv, expr: 'determined', dur: 0.5 }, { at: sv + 1.2, pose: 'stand', expr: 'relieved', gaze: [-0.6, 0], dur: 0.6 }] },
          { id: 'tt49_commuter', x: 140, y: 1440, scale: 0.66, dir: 1, turn: 0.45, pose: 'walk', expr: 'neutral', depth: 0.66, walk: { at: 0.1, dur: T - 0.2, cadence: 4.0, stride: 12, from: 140, to: 320 } }
        ],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 430, rows: [{ text: 'USE AN AUTHENTICATOR APP', fs: 42 }, { text: 'SET A CARRIER ACCOUNT PIN', fs: 42 }, { text: 'NEVER GIVE A CALLER A CODE', fs: 42 }, { text: 'FTC · FBI IC3 · CISA guidance', fs: 24, colour: '#b4bcc4' }] }
        ],
        tag: TAG
      });
    },

    // 8 - the outcome on the hero phone in the first frame's framing (the loop): the post still on screen; his silhouette at
    //     the desk; the plea card sits BELOW the burned-in end question (which covers y ~290-690 over the last 3.6 s)
    tt49_end(ctx) {
      const t = ctx.t, T = ctx.T, ch = WT(ctx, 0, 0, 0.1), pl = WT(ctx, 0, 6, 1.6), no = WT(ctx, 1, 0, 3.6);
      return E.cine.shot(ctx, {
        set: 'tt49_room', grade: 'night', dof: true, haze: 0.4,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 0, y: 40, z: 1.1 }, settle: true },
        figures: [
          { id: 'tt49_clark', x: 210, y: 1500, scale: 0.86, dir: 1, turn: 0.35, pose: 'sit', silhouette: 'cool', depth: 0.9,
            keys: [{ at: pl, pose: 'bowed', dur: 0.6 }, { at: no, pose: 'hands_together', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.08, accent: true, svg: tt => phone(HERO.x, HERO.y, HERO.s, tt, { k: 1, glow: 0.8 + 0.2 * Math.sin(tt * 3), rot: -3, hand: true }) }
        ],
        overlays: [
          { type: 'card', at: ch + 0.05, until: T - 3.75, x: 60, y: 430, w: 960, rows: [{ text: 'MARCH 2021 · YOUTHFUL OFFENDER', fs: 34 }, { text: '3 YEARS + 3 YEARS PROBATION', fs: 34, at: pl }] }
        ],
        tag: LIKE
      });
    }
  });
})();
