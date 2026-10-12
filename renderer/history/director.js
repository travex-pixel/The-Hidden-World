/* THE HIDDEN WORLD — history mode director. Implements the renderer contract used by pipeline/render.mjs:
   HW.setup(episode, timeline, seed, visual, art, cast), HW.frame(t) -> scene index, HW.ready().

   Scenes (narration units) are grouped into sequences: consecutive scenes on the same set share one
   continuous camera, one set of actors and one clock, so the world never "resets" between scenes.
   Time anchors in episode data may be seconds from scene start (number), a fraction of the scene ("p0.4"),
   seconds before its end ("end-1.5") or a spoken line ({"line": 2, "off": 0.3}). */
(function (root) {
  const X = root.HX; const { W, H, clamp, lerp, seg, ease, smoother, rgba, mulberry32, hashStr } = X;
  const SETS = X.SETS || (X.SETS = {});

  const HW = {
    state: null,
    async setup(ep, timeline, seed, visual, art, cast, fps) {
      const cv = document.getElementById('c'); const scale = cv.width / W;
      const st = this.state = { ep, timeline, seed, fps: fps || 30, cast: cast || {}, total: timeline[timeline.length - 1].end, cv, g: cv.getContext('2d'), scale, built: {} };
      st.tmp = { bloom: X.P.canvas(W / 8, H / 8), prev: X.P.canvas(cv.width, cv.height) };
      X.P.paper(seed);
      // sequences
      const seqs = []; timeline.forEach((s, i) => {
        const sc = ep.scenes[i]; const set = sc.set; const last = seqs[seqs.length - 1];
        if (last && last.set === set && !sc.new_shot) { last.scenes.push(i); last.end = s.end; } else seqs.push({ set, start: s.start, end: s.end, scenes: [i] });
      });
      st.seqs = seqs;
      for (const q of seqs) await this.buildSeq(q);
    },
    // resolve a time anchor within scene i to sequence-local seconds
    at(q, i, a) {
      const s = this.state.timeline[i]; const T = s.end - s.start; const base = s.start - q.start;
      if (a === undefined || a === null) return base;
      if (typeof a === 'number') return base + a;
      if (typeof a === 'string' && a[0] === 'p') return base + parseFloat(a.slice(1)) * T;
      if (typeof a === 'string' && a.startsWith('end')) return base + T + parseFloat(a.slice(3) || '0');
      if (typeof a === 'object' && a.line !== undefined) { const l = (s.lines || [])[a.line]; return (l ? l.start - q.start : base) + (a.off || 0); }
      return base;
    },
    async buildSeq(q) {
      const st = this.state; const ep = st.ep;
      const def = SETS[q.set]; if (!def) throw new Error('unknown set "' + q.set + '" (register it in renderer/history/sets)');
      if (!st.built[q.set]) st.built[q.set] = def.build(mulberry32(hashStr(q.set) ^ st.seed), st.seed);
      q.world = st.built[q.set];
      const camKeys = [], follow = [], shakes = [], actors = {}; q.props = [];
      for (const i of q.scenes) {
        const sc = ep.scenes[i]; const shot = sc.shot || {};
        for (const k of (shot.camera || [])) camKeys.push({ ...k, t: this.at(q, i, k.t) });
        if (shot.preset) { const p = shot.preset; const a = this.at(q, i, p.t ?? 0), b = this.at(q, i, p.to ?? 'end'); X.PRESETS[p.name](a, b - a, p).forEach(k => camKeys.push(k)); }
        for (const f of (shot.follow || [])) follow.push({ ...f, t: this.at(q, i, f.t) });
        for (const s of (shot.shake || [])) shakes.push({ ...s, t: this.at(q, i, s.t) });
        for (const pr of (sc.props || [])) q.props.push({ ...pr, from: pr.from !== undefined ? this.at(q, i, pr.from) : -1e9, to: pr.to !== undefined ? this.at(q, i, pr.to) : 1e9, scene: i });
        for (const a of (sc.actors || [])) {
          const acts = (a.acts || []).map(ac => { const t = this.at(q, i, ac.t); const o = { ...ac, t }; if (ac.until !== undefined) o.dur = Math.max(0.3, this.at(q, i, ac.until) - t); return o; });
          if (actors[a.id]) actors[a.id].acts.push(...acts); else actors[a.id] = { ...a, acts };
        }
      }
      camKeys.sort((a, b) => a.t - b.t);
      q.actors = Object.values(actors).map(a => {
        if (a.kind) return { ...a, path: (a.path || []).map(p => ({ ...p })) , _animal: true };
        const spec = st.cast[a.char] || {}; const A = X.Rig.compileActor({ ...a, spec, seed: hashStr(a.id) % 1000 }); return A;
      });
      // animal paths use sequence time too
      for (const a of q.actors) if (a._animal) { const src = this.findActorScenes(q, a.id); a.path = a.path.map(p => ({ ...p, t: this.at(q, src, p.t) })); }
      q.camera = new X.Camera({ keys: camKeys, follow, shakes, drift: q.world.drift ?? 1, seed: hashStr(q.set) % 97, stiffness: q.world.stiffness }, (id, t) => this.actorPos(q, id, t));
      q.light = q.world.light || [-0.8, -0.6];
    },
    // named beat from scene data ("beats": {"cut": 3.2}) -> sequence time (first scene that defines it)
    beat(q, name, def = 0) { for (const i of q.scenes) { const b = (this.state.ep.scenes[i].beats || {})[name]; if (b !== undefined) return this.at(q, i, b); } return def; },
    findActorScenes(q, id) { for (const i of q.scenes) if ((this.state.ep.scenes[i].actors || []).some(a => a.id === id)) return i; return q.scenes[0]; },
    actorPos(q, id, t) {
      const a = q.actors.find(x => x.id === id); if (!a) return { x: 0, y: 0 };
      const z = a.z || 1; let x;
      if (a._animal) x = this.animalAt(a, t).x; else x = X.Rig.walkAt(a, t).x;
      // convert rest px at depth z to camera pan units (acting-plane world coordinates)
      const y = (a.y ?? q.world.groundY(z)) - (a.h || 420) * 0.55;
      return { x: (x - W / 2) * z, y: (y - H / 2) * z };
    },
    animalAt(a, t) {
      const p = a.path; if (!p.length) return { x: a.x, walking: false, facing: a.facing || 1 };
      if (t <= p[0].t) return { x: p[0].x ?? a.x, walking: false, facing: a.facing || 1 };
      for (let i = 1; i < p.length; i++) if (t < p[i].t) { const u = ease.inOut((t - p[i - 1].t) / (p[i].t - p[i - 1].t)); const x0 = p[i - 1].x, x1 = p[i].x; return { x: lerp(x0, x1, u), walking: Math.abs(x1 - x0) > 1, facing: Math.sign(x1 - x0) || a.facing || 1 }; }
      return { x: p[p.length - 1].x, walking: false, facing: p[p.length - 1].facing || a.facing || 1 };
    },
    mouth(who, t) {
      // mouth openness from the line's loudness envelope; for lines with vowel data (engine v3) also the mouth's
      // roundness and a phrase-level emphasis (louder than the line's average) that lifts the brows
      let v = 0, r = 0, e = 0, rich = false;
      const at = (arr, k) => { const i0 = Math.floor(k), fr = k - i0; const a = arr[i0] || 0, b = arr[i0 + 1] || 0; return a + (b - a) * fr; };
      for (const s of this.state.timeline) for (const l of (s.lines || [])) if (l.who === who && l.env && t >= l.start - 0.3 && t < l.end + 0.3) {
        const k = (t - l.start) * 30;
        if (t >= l.start && t < l.end) { v = Math.max(v, at(l.env, k)); if (l.rnd) r = at(l.rnd, k); }
        if (l.rnd) {
          rich = true; l._mean = l._mean ?? (l.env.reduce((p, q) => p + q, 0) / Math.max(1, l.env.length));
          let acc = 0, nn = 0; for (let j = Math.max(0, Math.floor(k - 8)); j <= Math.min(l.env.length - 1, Math.floor(k + 2)); j++) { acc += l.env[j]; nn++; }
          e = Math.max(e, clamp(((nn ? acc / nn : 0) - l._mean) * 2.5, 0, 1));
        }
      }
      return rich ? { open: Math.min(1, v), round: r, emph: e } : Math.min(1, v);
    },
    // ---------------------------------------------------------------- composition
    drawSeq(g, qi, tq) {
      const st = this.state; const q = st.seqs[qi]; const wd = q.world; const cam = q.camera.at(tq); const proj = X.projector(cam);
      const tAbs = q.start + tq;
      const items = [];
      for (const L of wd.layers) items.push({ z: L.z, o: L.o ?? 0, draw: () => g.drawImage(L.canvas, L.x0, L.y0, L.w, L.h) });
      for (const d of (wd.dynamic || [])) items.push({ z: d.z, o: d.o ?? 0.5, draw: () => d.draw(g, tq, tAbs, this, q) });
      for (const pr of q.props) {
        if (tq < pr.from || tq > pr.to) continue; const fn = X.WORLD_PROPS && X.WORLD_PROPS[pr.type]; if (!fn) throw new Error('unknown world prop ' + pr.type);
        const fadeA = Math.min(1, (tq - pr.from) / 0.35, (pr.to - tq) / 0.35);   // props fade in and out rather than pop
        items.push({ z: pr.z || 1, o: pr.o ?? 0.8, draw: () => { const gy = pr.y ?? wd.groundY(pr.z || 1); g.save(); if (fadeA < 1) g.globalAlpha *= Math.max(0, fadeA); g.translate(pr.x, gy); fn(g, tq, pr, this, q); g.restore(); } });
      }
      for (const a of q.actors) {
        const z = a.z || 1;
        if (a.hide && a.hide.some(([s, e]) => tq >= this.at(q, q.scenes[0], 0) + s && tq < e)) continue;
        items.push({ z, o: a.o ?? 1, draw: () => this.drawActor(g, q, a, tq, tAbs) });
      }
      items.sort((p, r) => (r.z - p.z) || (p.o - r.o));
      const base = st.scale;
      g.save(); g.setTransform(base, 0, 0, base, 0, 0);
      g.fillStyle = wd.bg || '#e8dcc4'; g.fillRect(0, 0, W, H);
      if (cam.roll) { g.translate(W / 2, H / 2); g.rotate(cam.roll * Math.PI / 180); g.translate(-W / 2, -H / 2); }
      const M = g.getTransform();
      for (const it of items) {
        // a layer the camera is dollying through fades out instead of filling the lens
        const d = it.z * X.D0 - cam.dolly; if (d < 160) continue; const fade = clamp((d - 160) / 180, 0, 1);
        const p = proj(it.z); g.setTransform(M); g.transform(p.s, 0, 0, p.s, p.ox, p.oy);
        if (fade < 1) { g.globalAlpha = fade; it.draw(); g.globalAlpha = 1; } else it.draw();
      }
      g.restore();
      return cam;
    },
    drawActor(g, q, a, tq, tAbs) {
      const wd = q.world; const z = a.z || 1; const gy = a.y ?? wd.groundY(z);
      if (a._animal) {
        const s = this.animalAt(a, tq); g.save(); g.translate(s.x, gy); g.scale((a.h || 120) / 120 / z, (a.h || 120) / 120 / z);
        X.Rig[a.kind](g, tq, { ...a, walking: s.walking, facing: s.facing, peck: a.peck && !s.walking }); g.restore(); return;
      }
      const stt = X.Rig.evaluate(a, tq, (who, tt) => this.mouth(who, tt + q.start));
      // h is the character's true height at the acting plane; further away (z > 1) it is drawn smaller
      g.save(); g.translate(stt.x, gy); const k = (a.h || 420) / z / 1000; g.scale(k, k);
      const lw = clamp(6.5, 2.2 / (k * 1), 7.5);
      this.drawStyled(g, a, stt, q.light, { lw, propDraw: (gg, prop, l) => (wd.props && wd.props[prop] ? wd.props[prop](gg, tq, l) : X.PROPS[prop] && X.PROPS[prop](gg, tq, l)) });
      g.restore();
      if (wd.afterActor) wd.afterActor(g, a, stt, tq, gy);
    },
    // draw a rigged character in the episode's style. Watercolour: render the figure on its own layer, then add
    // pigment granulation, lifted-pigment blotches and a soft colour bleed past the edges, and composite it back.
    drawStyled(g, A, stt, light, opts) {
      const style = this.state.ep.character_style || 'anime';
      if (style !== 'watercolour') return X.Rig.drawCharacter(g, A, stt, light, opts);
      const M = g.getTransform(); const scale = Math.hypot(M.a, M.b);
      const cv = this.state.cv; const corners = [[-1150, -1300], [1150, -1300], [-1150, 200], [1150, 200]].map(([x, y]) => [M.a * x + M.c * y + M.e, M.b * x + M.d * y + M.f]);
      let x0 = Math.floor(Math.max(0, Math.min(...corners.map(c => c[0])))), y0 = Math.floor(Math.max(0, Math.min(...corners.map(c => c[1]))));
      let x1 = Math.ceil(Math.min(cv.width, Math.max(...corners.map(c => c[0])))), y1 = Math.ceil(Math.min(cv.height, Math.max(...corners.map(c => c[1]))));
      if (x1 - x0 < 2 || y1 - y0 < 2) return;
      const P = this.state.tmp; if (!P.char || P.char.width < x1 - x0 || P.char.height < y1 - y0) { P.char = X.P.canvas(Math.max(x1 - x0, P.char ? P.char.width : 0), Math.max(y1 - y0, P.char ? P.char.height : 0)); P.charB = X.P.canvas(P.char.width, P.char.height); }
      const off = P.char, og = off.getContext('2d', { willReadFrequently: true }); og.setTransform(1, 0, 0, 1, 0, 0); og.clearRect(0, 0, x1 - x0, y1 - y0);
      og.setTransform(M.a, M.b, M.c, M.d, M.e - x0, M.f - y0);
      const heightPx = 1000 * scale; const softPx = heightPx < 520 ? 0 : clamp(heightPx * 0.004, 0.5, 3.5);   // no soft-shadow blur on distant figures
      this.state.lightOff = [x0, y0];   // props drawn on this layer (a torch) record their glow in frame coordinates
      X.Rig.drawCharacter(og, A, stt, light, { ...opts, style: 'watercolour', softPx, lw: opts.lw, v3: (this.state.ep.engine_version || 2) >= 3 });
      this.state.lightOff = null;
      og.setTransform(1, 0, 0, 1, 0, 0);
      const w = x1 - x0, h = y1 - y0; const T = X.P.wcTextures(this.state.seed);
      const v3 = (this.state.ep.engine_version || 2) >= 3;   // v3: crisper figures (less bleed and mottling, contour, sharpening)
      og.save(); og.globalCompositeOperation = 'source-atop';
      og.globalAlpha = v3 ? 0.36 : 0.5; og.fillStyle = og.createPattern(T.dark, 'repeat'); og.fillRect(0, 0, w, h);
      og.globalAlpha = v3 ? 0.3 : 0.45; og.fillStyle = og.createPattern(T.light, 'repeat'); og.fillRect(0, 0, w, h);
      og.restore();
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
      const bleed = clamp(heightPx * (v3 ? 0.004 : 0.006), 1, v3 ? 3.5 : 5);
      g.globalAlpha = v3 ? 0.2 : 0.32; g.filter = `blur(${bleed.toFixed(1)}px)`; g.drawImage(off, 0, 0, w, h, x0, y0, w, h); g.filter = 'none'; g.globalAlpha = 1;
      if (v3) {
        // a thin warm contour so the figure separates from the painted background: the figure's silhouette,
        // tinted, drawn at four small offsets underneath it
        const sil = P.charB, sg = sil.getContext('2d'); sg.setTransform(1, 0, 0, 1, 0, 0); sg.globalCompositeOperation = 'copy'; sg.drawImage(off, 0, 0, w, h, 0, 0, w, h);
        sg.globalCompositeOperation = 'source-in'; sg.fillStyle = 'rgba(52,30,18,0.42)'; sg.fillRect(0, 0, w, h); sg.globalCompositeOperation = 'source-over';
        const cw = clamp(heightPx * 0.0011, 0.6, 1.6);
        for (const [dx, dy] of [[cw, 0], [-cw, 0], [0, cw], [0, -cw]]) g.drawImage(sil, 0, 0, w, h, x0 + dx, y0 + dy, w, h);
        if (heightPx > 260) X.P.sharpen(og, w, h, 0.4);   // crisper lines and features on the figure's own layer
      }
      g.drawImage(off, 0, 0, w, h, x0, y0, w, h);
      g.restore();
    },
    // ---------------------------------------------------------------- overlays (screen space)
    subtitle(g, t) {
      const st = this.state; if (st.ep.subtitles === false) return;
      let line = null, who = null;
      for (const s of st.timeline) for (const l of (s.lines || [])) if (t >= l.start - 0.05 && t <= l.end + 0.25) { line = l; who = l.who; }
      if (!line) return;
      const fade = clamp(Math.min((t - line.start + 0.05) / 0.15, (line.end + 0.25 - t) / 0.15), 0, 1);
      const words = line.text.split(' '); const rows = []; let cur = '';
      g.font = '600 42px Nunito';
      if (g.measureText(line.text).width <= 1300) rows.push(line.text);
      else {   // two balanced rows instead of a long row and an orphan
        let best = null; for (let k = 1; k < words.length; k++) { const a = words.slice(0, k).join(' '), b = words.slice(k).join(' '); const m = Math.max(g.measureText(a).width, g.measureText(b).width); if (!best || m < best.m) best = { m, a, b }; }
        rows.push(best.a, best.b);
      }
      const lh = 54, y0 = H - 70 - (rows.length - 1) * lh;
      const ch = st.cast[who] || {}; const named = who && who !== 'narrator' && who !== 'narrator_history';
      g.save(); g.globalAlpha = fade; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
      const wmax = Math.max(...rows.map(r => g.measureText(r).width));
      g.fillStyle = 'rgba(20,12,8,0.42)'; const bx = W / 2 - wmax / 2 - 28, by = y0 - 46 - (named ? 34 : 0); g.beginPath(); g.roundRect(bx, by, wmax + 56, rows.length * lh + 26 + (named ? 34 : 0), 14); g.fill();
      if (named) { g.font = '800 26px Nunito'; g.fillStyle = (ch.signature || {}).colour || '#f2c46b'; g.fillText((ch.name || who).toUpperCase(), W / 2, y0 - 38); g.font = '600 42px Nunito'; }
      rows.forEach((r, i) => { g.lineWidth = 6; g.strokeStyle = 'rgba(20,12,8,0.55)'; g.strokeText(r, W / 2, y0 + i * lh); g.fillStyle = '#fff8ec'; g.fillText(r, W / 2, y0 + i * lh); });
      g.restore();
    },
    badges(g, i, tl) {
      const sc = this.state.ep.scenes[i]; const s = this.state.timeline[i];
      const KIND = { documented: ['DOCUMENTED', '#2f6f5e'], reconstruction: ['RECONSTRUCTION', '#7a5a2e'], dramatised: ['DRAMATISED', '#6c3f6e'], disputed: ['DISPUTED', '#a3452e'], estimate: ['ESTIMATE', '#3d5f86'] };
      let y = 60;
      for (const b of (sc.badges || [])) {
        const a = this.at({ start: s.start }, i, b.at ?? 0), e = a + (b.dur ?? 4); const tt = tl;
        if (tt < a || tt > e) continue; const k = clamp(Math.min((tt - a) / 0.35, (e - tt) / 0.35), 0, 1); const [lab, col] = KIND[b.kind] || KIND.documented;
        g.save(); g.globalAlpha = k; g.translate(lerp(-30, 0, ease.out3(k)), 0);
        g.font = '800 22px Nunito'; const w1 = g.measureText(lab).width; g.font = '600 26px Nunito'; const w2 = b.text ? g.measureText(b.text).width : 0;
        g.fillStyle = 'rgba(250,243,228,0.92)'; g.beginPath(); g.roundRect(56, y, w1 + w2 + 74, 48, 24); g.fill(); g.strokeStyle = col; g.lineWidth = 2.5; g.stroke();
        g.fillStyle = col; g.beginPath(); g.roundRect(56, y, w1 + 40, 48, 24); g.fill();
        g.fillStyle = '#fff8ec'; g.font = '800 22px Nunito'; g.fillText(lab, 76, y + 32); g.fillStyle = '#2a1d14'; g.font = '600 26px Nunito'; if (b.text) g.fillText(b.text, 76 + w1 + 34, y + 33);
        g.restore(); y += 62;
      }
    },
    cards(g, i, tl) {
      const sc = this.state.ep.scenes[i]; const s = this.state.timeline[i];
      for (const c of (sc.cards || [])) {
        const a = this.at({ start: s.start }, i, c.at ?? 0), e = a + (c.dur ?? 3.5); if (tl < a || tl > e) continue;
        const k = clamp(Math.min((tl - a) / 0.6, (e - tl) / 0.6), 0, 1); const u = (tl - a) / (e - a);
        g.save(); g.globalAlpha = ease.inOut(k); g.textAlign = c.align || 'left';
        if (c.kind === 'title') {
          const y = c.y ?? H * 0.42; g.textAlign = 'center';
          const band = g.createLinearGradient(0, y - 160, 0, y + 110); band.addColorStop(0, 'rgba(18,10,6,0)'); band.addColorStop(0.5, 'rgba(18,10,6,0.5)'); band.addColorStop(1, 'rgba(18,10,6,0)'); g.fillStyle = band; g.fillRect(0, y - 160, W, 270);
          g.font = '600 italic 34px Fraunces'; g.fillStyle = '#fff3dc'; g.shadowColor = 'rgba(20,10,4,0.7)'; g.shadowBlur = 18; g.fillText(c.sub || '', W / 2, y - 70);
          g.font = '800 92px Fraunces'; g.letterSpacing = '2px'; g.fillText(c.title, W / 2, y + 20 + (1 - ease.out3(k)) * 20);
          g.fillStyle = '#e9b860'; g.fillRect(W / 2 - 160 * ease.out3(k), y + 52, 320 * ease.out3(k), 4);
        } else if (c.kind === 'location') {
          const x = 96, y = c.y ?? H - 320; g.shadowColor = 'rgba(20,10,4,0.75)'; g.shadowBlur = 16;
          g.font = '800 64px Fraunces'; g.fillStyle = '#fff3dc'; g.fillText(c.title, x + (1 - ease.out3(k)) * -20, y);
          g.font = '600 italic 32px Fraunces'; g.fillStyle = '#f0d9a8'; g.fillText(c.sub || '', x, y + 50);
          g.fillStyle = '#e9b860'; g.fillRect(x, y + 70, 260 * ease.out3(Math.min(1, u * 3)), 3);
        } else if (c.kind === 'fact') {
          const x = c.x ?? W - 640, y = c.y ?? 130, w = 560; g.font = '600 32px Nunito'; const lines = []; let cur = '';
          for (const wd of c.title.split(' ')) { const tr = (cur ? cur + ' ' : '') + wd; if (g.measureText(tr).width > w - 60 && cur) { lines.push(cur); cur = wd; } else cur = tr; } lines.push(cur);
          const h = 70 + lines.length * 42; const yy = y + (1 - ease.out3(k)) * 20;
          g.fillStyle = 'rgba(250,243,228,0.94)'; g.beginPath(); g.roundRect(x, yy, w, h, 18); g.fill(); g.strokeStyle = '#7a5a2e'; g.lineWidth = 3; g.stroke();
          g.fillStyle = '#7a5a2e'; g.font = '800 22px Nunito'; g.fillText((c.sub || 'DID YOU KNOW').toUpperCase(), x + 30, yy + 42);
          g.fillStyle = '#2a1d14'; g.font = '600 32px Nunito'; lines.forEach((l, j) => g.fillText(l, x + 30, yy + 84 + j * 42));
        } else if (c.kind === 'next') {
          g.textAlign = 'center'; g.shadowColor = 'rgba(20,10,4,0.8)'; g.shadowBlur = 20;
          g.font = '800 30px Nunito'; g.fillStyle = '#e9b860'; g.fillText('NEXT TIME', W / 2, H * 0.36);
          g.font = '800 76px Fraunces'; g.fillStyle = '#fff3dc'; g.fillText(c.title, W / 2, H * 0.36 + 90);
        }
        g.restore();
      }
    },
    // ---------------------------------------------------------------- frame
    frame(t) {
      const st = this.state; const tl = st.timeline; const g = st.g;
      let i = tl.findIndex(s => t < s.end); if (i < 0) i = tl.length - 1;
      const qi = st.seqs.findIndex(q => t < q.end) < 0 ? st.seqs.length - 1 : st.seqs.findIndex(q => t < q.end); const q = st.seqs[qi];
      const sc = st.ep.scenes[q.scenes[0]]; const tq = t - q.start;
      const nSub = this.subframes(qi, tq);
      st.lights = []; st.lightW = 1 / Math.max(1, nSub);   // glows recorded while drawing, added back after the grade
      if (nSub <= 1) this.drawSeq(g, qi, tq);
      else {   // motion blur: average sub-frames across a 180° shutter (only when the image moves fast)
        const sub = st.tmp.sub || (st.tmp.sub = X.P.canvas(st.cv.width, st.cv.height)); const sg = sub.getContext('2d');
        for (let j = 0; j < nSub; j++) {
          const tj = tq + (j / (nSub - 1) - 0.5) * 0.5 / (st.fps || 30);
          if (j === 0) this.drawSeq(g, qi, tj); else { this.drawSeq(sg, qi, tj); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1 / (j + 1); g.drawImage(sub, 0, 0); g.restore(); }
        }
      }
      // sequence transitions (screen space): dissolve from the previous sequence, light bloom or dip
      const TR = sc.transition_dur ?? 0.8;
      if (qi > 0 && tq < TR) {
        const p = tq / TR; const kind = sc.transition;
        if (kind === 'dissolve' || kind === 'light' || kind === 'match') {
          const pv = st.tmp.prev; const pg = pv.getContext('2d'); this.drawSeq(pg, qi - 1, (q.start - st.seqs[qi - 1].start) + tq);
          if (kind === 'light') { /* the previous shot burns out to warm white, the new one emerges from it */ }
          g.save(); g.globalAlpha = 1 - smoother(p); g.drawImage(pv, 0, 0); g.restore();
        }
      }
      g.save(); g.setTransform(st.scale, 0, 0, st.scale, 0, 0);
      // per-scene finishing (bloom, grade, exposure flashes from the set or the scene)
      const wd = q.world; const fin = { ...(wd.finish || {}), seed: st.seed };
      const flash = this.flashAt(t); if (flash) fin.exposure = flash;
      X.FX.finish(g, st.cv, t, fin, st.tmp);
      this.drawLights(g);
      if (sc.transition === 'dip' && qi > 0 && tq < TR) { g.fillStyle = rgba('#120a06', 1 - smoother(tq / TR)); g.fillRect(0, 0, W, H); }
      // fade in from black at the very start, out at the end
      const fi = 1 - seg(t, 0, 0.6), fo = seg(t, st.total - 1.2, st.total - 0.05); if (fi > 0 || fo > 0) { g.fillStyle = rgba('#0e0805', Math.max(fi, fo)); g.fillRect(0, 0, W, H); }
      const lt = t - tl[i].start;
      if (!this.clean) { this.cards(g, i, lt); this.badges(g, i, lt); this.subtitle(g, t); }
      g.restore();
      return i;
    },
    // light sources (fires, torches, candles) record where they are on screen while the world is drawn; after the
    // night/interior grade darkens the frame, their glow is added back so flames stay bright against the dark
    light(g, x, y, r, colour, alpha) {
      const st = this.state; if (!st.lights) return; const m = g.getTransform(), sc = st.scale, o = st.lightOff || [0, 0];
      st.lights.push({ x: (m.a * x + m.c * y + m.e + o[0]) / sc, y: (m.b * x + m.d * y + m.f + o[1]) / sc, r: r * Math.hypot(m.a, m.b) / sc, colour, alpha: alpha * g.globalAlpha * st.lightW });
    },
    drawLights(g) {
      const st = this.state; if (!st.lights || !st.lights.length) return;
      g.save(); g.globalCompositeOperation = 'screen';
      for (const L of st.lights) {
        if (L.x < -L.r || L.x > W + L.r || L.y < -L.r || L.y > H + L.r) continue;
        const gr = g.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.r); gr.addColorStop(0, rgba(L.colour, L.alpha)); gr.addColorStop(0.35, rgba(L.colour, L.alpha * 0.45)); gr.addColorStop(1, rgba(L.colour, 0));
        g.fillStyle = gr; g.fillRect(L.x - L.r, L.y - L.r, L.r * 2, L.r * 2);
      }
      g.restore();
    },
    // how many motion-blur sub-frames this frame needs: a pure function of t (camera speed in screen pixels)
    subframes(qi, tq) {
      const st = this.state; if (st.ep.motion_blur === false) return 1;
      const q = st.seqs[qi]; const dt = 0.5 / (st.fps || 30);
      const a = q.camera.at(Math.max(0, tq - dt / 2)), b = q.camera.at(tq + dt / 2);
      const ka = 1000 / Math.max(200, 1000 - a.dolly), kb = 1000 / Math.max(200, 1000 - b.dolly);
      const px = Math.hypot(b.x * kb - a.x * ka, b.y * kb - a.y * ka) + Math.abs(kb - ka) * 900 + Math.abs(b.roll - a.roll) * 18;
      return px > 9 ? 3 : px > 3.5 ? 2 : 1;
    },
    // exposure flashes: the "light" transition burns to white across a cut; scenes may add flashes
    flashAt(t) {
      const st = this.state; let e = 0;
      for (let qi = 1; qi < st.seqs.length; qi++) { const q = st.seqs[qi]; const sc = st.ep.scenes[q.scenes[0]]; if (sc.transition !== 'light') continue; const d = t - q.start; const TR = sc.transition_dur ?? 0.8; if (d > -TR && d < TR * 1.4) e = Math.max(e, d < 0 ? smoother(1 + d / TR) * 0.92 : (1 - smoother(d / (TR * 1.4))) * 0.92); }
      st.ep.scenes.forEach((sc, i) => (sc.flashes || []).forEach(f => { const a = st.timeline[i].start + this.at({ start: st.timeline[i].start }, i, f.at) - (this.at({ start: st.timeline[i].start }, i, 0)); const d = t - a; if (d >= 0 && d < (f.dur ?? 0.5)) e = Math.max(e, (f.amount ?? 0.5) * (1 - d / (f.dur ?? 0.5))); }));
      return e;
    },
    async ready() { await new Promise(r => requestAnimationFrame(() => r())); },
    // diagnostics for automated QA: the exact camera at time t (no drawing)
    cameraAt(t) { const st = this.state; let qi = st.seqs.findIndex(q => t < q.end); if (qi < 0) qi = st.seqs.length - 1; const q = st.seqs[qi]; return { seq: qi, ...q.camera.at(t - q.start) }; },
    // diagnostics for automated QA: actor skeleton facts at time t (bone lengths, feet)
    probe(t) {
      const st = this.state; const qi = Math.max(0, st.seqs.findIndex(q => t < q.end)); const q = st.seqs[qi]; const tq = t - q.start;
      return q.actors.filter(a => !a._animal).map(a => { const s = X.Rig.evaluate(a, tq, () => 0); const w = X.Rig.walkAt(a, tq);
        // drawn: where the feet actually land on screen (rest px), i.e. hip + local offset × scale — what a viewer sees
        const drawn = [s.x + s.fN * a.K * s.facing, s.x + s.fF * a.K * s.facing];
        return { id: a.id, char: a.char, h: a.h, x: s.x, hip: s.hip, feet: w.feet, drawn, lift: [s.liftN, s.liftF], facing: s.facing, squash: s.squash, walking: !!(w.walking || w.settled) }; });
    }
  };
  X.PROPS = X.PROPS || {};
  root.HW = HW;
})(window);
