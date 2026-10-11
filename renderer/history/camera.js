/* THE HIDDEN WORLD — history mode 2.5D camera.
   World model: every element (painted layer, character, particle) lives at a depth z (1 = the acting plane,
   >1 further away, <1 foreground) and is authored in "rest-screen" pixels: where it appears when the camera
   is at rest. The camera has a pan (x, y in acting-plane pixels), a dolly (physical move towards the scene,
   which gives true parallax: near things grow faster than far things), a lens zoom (uniform), and a roll.
   Follow-camera uses a critically damped spring integrated at a fixed step from the start of the sequence,
   so it is deterministic and identical whichever frame is rendered first. */
(function (root) {
  const X = root.HX; const { W, H, clamp, lerp, track, fbm1 } = X;
  const D0 = 1000; // camera-to-acting-plane distance at rest, in rest pixels

  function projector(cam) {
    return function (z) {
      const d = Math.max(60, z * D0 - cam.dolly);
      const k = D0 / d * cam.zoom;            // screen px per world unit at this depth
      const s = z * k;                         // screen px per rest px at this depth
      // rest px (u,v) -> world (u-W/2)*z -> screen W/2 + (world - camX*?)*k
      return { s, ox: W / 2 - (W / 2) * s - cam.x * k, oy: H / 2 - (H / 2) * s - cam.y * k, k };
    };
  }

  // camera keys: [{t, x, y, dolly, zoom, roll, ease}] — any field may be omitted (held from previous key)
  function fillKeys(keys) {
    const out = []; let prev = { x: 0, y: 0, dolly: 0, zoom: 1, roll: 0 };
    for (const k of keys) { const v = { ...prev }; for (const f of ['x', 'y', 'dolly', 'zoom', 'roll']) if (k[f] !== undefined) v[f] = k[f]; out.push({ t: k.t, ease: k.ease, v }); prev = v; }
    return out;
  }
  function keyed(keys, t) {
    if (!keys.length) return { x: 0, y: 0, dolly: 0, zoom: 1, roll: 0 };
    const r = {};
    for (const f of ['x', 'y', 'dolly', 'zoom', 'roll']) r[f] = track(keys.map(k => ({ t: k.t, v: k.v[f], ease: k.ease })), t, keys[0].v[f]);
    return r;
  }

  class Camera {
    // seq: {keys, follow:[{t, w, actor, dx, dy, ease}], shakes:[{t, dur, amp}], drift}
    constructor(seq, targetFn) {
      this.keys = fillKeys(seq.keys || []); this.follow = seq.follow || []; this.shakes = seq.shakes || []; this.drift = seq.drift ?? 1; this.targetFn = targetFn;
      this.spring = { t: -1, x: 0, y: 0, vx: 0, vy: 0 }; this.stiff = seq.stiffness ?? 2.6; this.seed = seq.seed || 1;
    }
    followWeight(t) { return this.follow.length ? track(this.follow.map(f => ({ t: f.t, v: f.w, ease: f.ease })), t, 0) : 0; }
    axesAt(t) { let f = this.follow[0]; for (const k of this.follow) if (k.t <= t) f = k; return f.axes || 'xy'; }
    followTarget(t) {
      let f = this.follow[0]; for (const k of this.follow) if (k.t <= t) f = k;
      const p = this.targetFn(f.actor, t); return { x: p.x + (f.dx || 0), y: p.y + (f.dy || 0) };
    }
    springAt(t) {
      const dt = 1 / 120; let s = this.spring;
      if (s.t < 0 || t < s.t - 1e-9) { const p = this.followTarget(0); s = this.spring = { t: 0, x: p.x, y: p.y, vx: 0, vy: 0 }; }
      const w = this.stiff * 2 * Math.PI / 2;
      while (s.t + dt <= t + 1e-9) {
        const p = this.followTarget(s.t);
        const ax = w * w * (p.x - s.x) - 2 * w * s.vx, ay = w * w * (p.y - s.y) - 2 * w * s.vy;
        s.vx += ax * dt; s.vy += ay * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.t += dt;
      }
      return s;
    }
    at(t) {
      const c = keyed(this.keys, t);
      const w = this.followWeight(t);
      if (w > 0) { const s = this.springAt(t); const ax = this.axesAt(t); if (ax.includes('x')) c.x = lerp(c.x, s.x, w); if (ax.includes('y')) c.y = lerp(c.y, s.y, w); }
      // breathing camera: very small, slow drift so a held frame never looks frozen
      const d = this.drift; c.x += fbm1(t * 0.23, this.seed) * 6 * d; c.y += fbm1(t * 0.19, this.seed + 7) * 4 * d; c.roll += fbm1(t * 0.15, this.seed + 3) * 0.12 * d;
      // impact shake: trauma decays quadratically; noise frequency high but amplitude small
      for (const sh of this.shakes) {
        const u = (t - sh.t) / sh.dur; if (u < 0 || u > 1) continue; const tr = (1 - u) * (1 - u) * sh.amp;
        c.x += fbm1(t * 18, this.seed + 11) * 26 * tr; c.y += fbm1(t * 17, this.seed + 13) * 18 * tr; c.roll += fbm1(t * 15, this.seed + 17) * 0.8 * tr;
      }
      return c;
    }
  }

  // reusable presets: produce key lists relative to a start time and duration (scene authors may use these
  // instead of raw keys). All moves ease in and out; none exceed ~1.5x so painted layers stay sharp.
  const PRESETS = {
    establish: (a, T, o = {}) => [{ t: a, x: o.x ?? 0, y: (o.y ?? 0) - 40, dolly: 0 }, { t: a + T, x: (o.x ?? 0) + (o.dx ?? 60), y: o.y ?? 0, dolly: o.dolly ?? 180, ease: 'inOut' }],
    pushIn: (a, T, o = {}) => [{ t: a, x: o.x ?? 0, y: o.y ?? 0, dolly: o.from ?? 0 }, { t: a + T, x: o.x2 ?? o.x ?? 0, y: o.y2 ?? o.y ?? 0, dolly: o.to ?? 260, ease: 'inOut' }],
    pullOut: (a, T, o = {}) => [{ t: a, x: o.x ?? 0, y: o.y ?? 0, dolly: o.from ?? 260 }, { t: a + T, x: o.x2 ?? o.x ?? 0, y: o.y2 ?? o.y ?? 0, dolly: o.to ?? 0, ease: 'inOut' }],
    truck: (a, T, o = {}) => [{ t: a, x: o.from ?? 0, y: o.y ?? 0, dolly: o.dolly ?? 0 }, { t: a + T, x: o.to ?? 400, y: o.y ?? 0, dolly: o.dolly ?? 0, ease: 'inOut' }],
    crane: (a, T, o = {}) => [{ t: a, x: o.x ?? 0, y: o.from ?? 0, dolly: o.dolly ?? 0 }, { t: a + T, x: o.x ?? 0, y: o.to ?? -300, dolly: o.dolly2 ?? o.dolly ?? 0, ease: 'inOut' }]
  };

  root.HX = Object.assign(root.HX, { Camera, projector, PRESETS, D0 });
})(window);
