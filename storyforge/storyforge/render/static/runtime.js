/* storyforge runtime: scrubber, collector, and every interactive block, driven by #sf-data. */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const DATA = JSON.parse($("#sf-data").textContent);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasD3 = typeof window.d3 !== "undefined";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const TONE = { accent: "--accent", accent2: "--accent2", ink: "--ink2", muted: "--muted", good: "--good", bad: "--bad" };
  const cssVar = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const tone = (t) => cssVar(TONE[t] || "--accent");
  const toneText = (t) => (t === "accent" ? "var(--accent-ink)" : `var(${TONE[t] || "--accent-ink"})`);

  /* ------------------------------------------------------------ helpers */
  function fmtNum(v, f) {
    f = f || { prefix: "", suffix: "", decimals: 0 };
    if (v == null || !isFinite(v)) return "–";
    const neg = v < 0; const a = Math.abs(v);
    const s = a.toLocaleString("en-US", { minimumFractionDigits: f.decimals || 0, maximumFractionDigits: f.decimals || 0 });
    return (neg ? "−" : "") + (f.prefix || "") + s + (f.suffix || "");
  }
  function money(n, prefix) {
    prefix = prefix == null ? "$" : prefix;
    if (n >= 1e12) return prefix + (n / 1e12).toFixed(n >= 1e13 ? 0 : 1) + "T";
    if (n >= 1e9) return prefix + (n / 1e9).toFixed(n >= 1e10 ? 0 : 1) + "B";
    if (n >= 1e6) return prefix + (n / 1e6).toFixed(n >= 1e7 ? 1 : 2) + "M";
    if (n >= 1e3) return prefix + Math.round(n / 1e3) + "K";
    return prefix + Math.round(n).toLocaleString();
  }
  const hms = (s) => { s = Math.max(0, Math.round(s)); return [Math.floor(s / 3600), Math.floor(s % 3600 / 60), s % 60].map((v) => String(v).padStart(2, "0")).join(":"); };
  function responsive(el, draw) {
    let last = 0;
    const run = () => { const w = el.clientWidth; if (w && Math.abs(w - last) > 2) { last = w; draw(w); } };
    if ("ResizeObserver" in window) new ResizeObserver(run).observe(el); else window.addEventListener("resize", run);
    run();
    return () => { last = 0; run(); };
  }
  function tipFor(wrap) {
    let t = wrap.querySelector(".tip");
    if (!t) { t = document.createElement("div"); t.className = "tip"; wrap.appendChild(t); }
    return {
      show(h, x, y) {
        t.innerHTML = h; t.style.left = x + "px"; t.style.top = y + "px"; t.style.opacity = 1;
        const r = t.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
        if (r.left < wr.left) t.style.left = (x + (wr.left - r.left)) + "px";
        if (r.right > wr.right) t.style.left = (x - (r.right - wr.right)) + "px";
      },
      hide() { t.style.opacity = 0; }
    };
  }
  function svgIn(mount, label) {
    const wrap = document.createElement("div"); wrap.className = "chart-wrap"; mount.appendChild(wrap);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("role", "img"); svg.setAttribute("aria-label", label || "chart"); wrap.appendChild(svg);
    return { wrap, svg };
  }
  const tickEvery = (vals, W) => { const max = W < 560 ? 5 : 10; const n = Math.ceil(vals.length / max); return vals.filter((v, i) => i % n === 0); };

  /* --------------------------------------------- safe expression evaluator */
  function compile(expr) {
    const toks = expr.match(/\d+(\.\d+)?|[A-Za-z_]\w*|[-+*/^(),]/g) || [];
    let i = 0;
    const peek = () => toks[i], take = () => toks[i++];
    const FN = { min: Math.min, max: Math.max, abs: Math.abs, round: Math.round };
    function prim(env) {
      const t = take();
      if (t === "(") { const v = add(env); take(); return v; }
      if (t === "-") return -prim(env);
      if (/^\d/.test(t)) return parseFloat(t);
      if (FN[t]) { take(); const args = [add(env)]; while (peek() === ",") { take(); args.push(add(env)); } take(); return FN[t](...args); }
      if (t in env) return env[t];
      throw new Error("unknown " + t);
    }
    function pow(env) { let v = prim(env); while (peek() === "^") { take(); v = Math.pow(v, prim(env)); } return v; }
    function mul(env) { let v = pow(env); while (peek() === "*" || peek() === "/") { const o = take(); const r = pow(env); v = o === "*" ? v * r : v / r; } return v; }
    function add(env) { let v = mul(env); while (peek() === "+" || peek() === "-") { const o = take(); const r = mul(env); v = o === "+" ? v + r : v - r; } return v; }
    return (env) => { i = 0; try { return add(env); } catch (e) { return NaN; } };
  }

  /* ------------------------------------------------------------ scrubber */
  const scrub = $("#sf-scrub"), track = $("#sf-track"), fill = $("#sf-fill"), headEl = $("#sf-head");
  const secs = $$(".sec[data-i]");
  const SEC = DATA.sections;
  const total = DATA.timed ? DATA.duration : 1;
  const posOf = (i) => DATA.timed ? SEC[i].t / total : i / Math.max(1, SEC.length);
  SEC.forEach((s, i) => {
    const b = document.createElement("button");
    b.className = "tick"; b.type = "button"; b.style.left = (posOf(i) * 100) + "%";
    b.title = `${String(i + 1).padStart(2, "0")} · ${s.label}${DATA.timed ? " · " + hms(s.t) : ""}`;
    b.setAttribute("aria-label", `Go to ${DATA.noun} ${i + 1}: ${s.label}`);
    b.addEventListener("click", (e) => { e.stopPropagation(); secs[i].scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); });
    track.appendChild(b);
  });
  track.addEventListener("click", (e) => {
    const r = track.getBoundingClientRect(); const f = (e.clientX - r.left) / r.width;
    let i = 0; SEC.forEach((s, k) => { if (f >= posOf(k)) i = k; });
    secs[i].scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  });
  const ticks = $$(".tick", track);
  let raf = 0;
  function onScroll() {
    raf = 0;
    if (!secs.length) return;
    const y = window.scrollY + window.innerHeight * 0.35;
    const hero = $(".hero");
    scrub.classList.toggle("on", window.scrollY > hero.offsetTop + hero.offsetHeight * 0.6 - window.innerHeight * 0.35);
    let i = 0; secs.forEach((s, k) => { if (y >= s.offsetTop) i = k; });
    const s = secs[i], next = secs[i + 1] || $("#sf-checkout");
    const end = next ? next.offsetTop : s.offsetTop + s.offsetHeight;
    const f = Math.min(1, Math.max(0, (y - s.offsetTop) / Math.max(1, end - s.offsetTop)));
    const p0 = posOf(i), p1 = i + 1 < SEC.length ? posOf(i + 1) : 1;
    const p = y < secs[0].offsetTop ? 0 : p0 + (p1 - p0) * f;
    $("#sf-now").textContent = DATA.timed ? hms(p * total) : Math.round(p * 100) + "%";
    $("#sf-chip").textContent = DATA.noun + " " + String(i + 1).padStart(2, "0");
    $("#sf-stitle").textContent = SEC[i].label;
    fill.style.width = (p * 100) + "%"; headEl.style.left = (p * 100) + "%";
    ticks.forEach((tk, k) => tk.classList.toggle("past", posOf(k) <= p + 1e-9));
  }
  window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(onScroll); }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ------------------------------------------------------------ collector */
  const tags = $$(".tag");
  const read = new Set();
  function renderCollector() {
    const box = $("#sf-collector"); if (!box) return;
    const C = DATA.collectorSpec || {};
    const lines = tags.map((t, i) => {
      const done = read.has(i);
      return `<a class="line${done ? "" : " unread"}" href="#${t.id}"><span class="chk">${done ? "✓" : "·"} ${String(i + 1).padStart(2, "0")}</span><span>${esc(DATA.collector === "receipt" ? t.dataset.title.toUpperCase() : t.dataset.title)}</span>${DATA.collector === "receipt" ? `<span>${esc(t.dataset.sec)}</span>` : ""}</a>`;
    }).join("");
    const totals = (C.totals || []).map((x) => `<div class="tot"><span>${esc(x.label)}</span><span>${esc(x.value)}</span></div>`).join("");
    if (DATA.collector === "receipt") {
      box.innerHTML = `<div class="c"><div class="big">${(C.title_lines || []).map(esc).join("<br>")}</div>${(C.subtitle_lines || []).map((l) => `<div>${esc(l)}</div>`).join("")}</div><hr>
        <div class="line" style="font-weight:600"><span>#</span><span>${esc(DATA.collectionNoun.toUpperCase())}</span><span>${esc(DATA.noun.slice(0, 1).toUpperCase())}</span></div>${lines}<hr>
        <div class="tot"><span>${esc(DATA.collectionNoun.toUpperCase())} IN CART</span><span>${read.size} / ${tags.length}</span></div>${totals}<hr>
        ${(C.footer || []).map((l) => `<div class="c">${esc(l)}</div>`).join("")}<div class="bc" aria-hidden="true"></div>`;
    } else {
      box.innerHTML = `<h4>${(C.title_lines || []).map(esc).join(" ")}</h4><div class="sub">${(C.subtitle_lines || []).map(esc).join(" · ")}</div>${lines}
        <div class="tot"><span>${esc(DATA.collectionNoun)} noted</span><span>${read.size} / ${tags.length}</span></div>${totals}${(C.footer || []).map((l) => `<p class="note" style="margin-top:10px">${esc(l)}</p>`).join("")}`;
    }
    $("#sf-cart-n").textContent = read.size;
  }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { const i = tags.indexOf(e.target); if (!read.has(i)) { read.add(i); e.target.classList.add("read"); renderCollector(); } }
    }), { threshold: 0.6 });
    tags.forEach((t) => io.observe(t));
  }
  renderCollector();

  /* ------------------------------------------------------------ blocks */
  const R = {};

  R.bars = (mount, b) => {
    const { wrap, svg } = svgIn(mount, b.title); const tip = tipFor(wrap);
    const pts = b.points, hi = new Set(b.highlight || []);
    responsive(wrap, (W) => {
      const H = Math.max(240, Math.min(380, W * 0.42)), m = { t: 18, r: 12, b: 28, l: W < 560 ? 44 : 56 };
      const s = d3.select(svg).attr("viewBox", `0 0 ${W} ${H}`).attr("width", W).attr("height", H); s.selectAll("*").remove();
      const x = d3.scaleBand().domain(pts.map((p) => p.x)).range([m.l, W - m.r]).padding(pts.length > 30 ? 0.18 : 0.24);
      const y = d3.scaleLinear().domain([Math.min(0, d3.min(pts, (p) => p.y)), d3.max(pts, (p) => p.y) * 1.12]).nice().range([H - m.b, m.t]);
      s.append("g").attr("class", "grid").selectAll("line").data(y.ticks(4)).join("line").attr("x1", m.l).attr("x2", W - m.r).attr("y1", y).attr("y2", y);
      s.append("g").attr("class", "ax").attr("transform", `translate(${m.l},0)`).call(d3.axisLeft(y).ticks(4).tickSize(0).tickPadding(8).tickFormat((d) => fmtNum(d, Object.assign({}, b.format, { decimals: 0 }))));
      s.append("g").attr("class", "ax").attr("transform", `translate(0,${H - m.b})`).call(d3.axisBottom(x).tickValues(tickEvery(pts.map((p) => p.x), W)).tickSize(3));
      s.append("g").selectAll("rect").data(pts).join("rect").attr("class", (p) => "bar" + (hi.has(p.x) ? " hi" : ""))
        .attr("x", (p) => x(p.x)).attr("width", x.bandwidth()).attr("y", (p) => y(Math.max(0, p.y))).attr("height", (p) => Math.abs(y(p.y) - y(0))).attr("rx", 1)
        .on("mouseenter touchstart", function (ev, p) { d3.select(this).classed("hov", true); tip.show(`<b>${esc(p.x)}</b> · ${fmtNum(p.y, b.format)}`, x(p.x) + x.bandwidth() / 2, y(p.y)); })
        .on("mouseleave touchend", function () { d3.select(this).classed("hov", false); tip.hide(); });
      (b.annotations || []).forEach((a, k) => {
        const p = pts.find((q) => q.x === a.x); if (!p || (W < 520 && k % 2)) return;
        const cx = x(p.x) + x.bandwidth() / 2, cy = y(p.y), ty = Math.max(m.t + 10, cy - 24 - (k % 3) * 22);
        const anchor = cx > W * 0.6 ? "end" : "start";
        s.append("line").attr("class", "ann-line").attr("x1", cx).attr("x2", cx).attr("y1", cy - 4).attr("y2", ty + 4);
        s.append("text").attr("class", "ann").attr("x", cx + (anchor === "end" ? -4 : 4)).attr("y", ty).attr("text-anchor", anchor).text(a.text);
      });
    });
  };

  R.lines = (mount, b) => {
    const { wrap, svg } = svgIn(mount, b.title); const tip = tipFor(wrap);
    if (b.series.length > 1) mount.insertAdjacentHTML("afterbegin", `<div class="controls">${b.series.map((s) => `<span class="legend-row"><i style="background:${tone(s.tone)}"></i>${esc(s.label)}</span>`).join("")}</div>`);
    const all = b.series.flatMap((s) => s.points);
    responsive(wrap, (W) => {
      const H = Math.max(240, Math.min(380, W * 0.42)), m = { t: 22, r: 16, b: 28, l: W < 560 ? 44 : 56 };
      const s = d3.select(svg).attr("viewBox", `0 0 ${W} ${H}`).attr("width", W).attr("height", H); s.selectAll("*").remove();
      const x = d3.scaleLinear().domain(d3.extent(all, (p) => p.x)).range([m.l, W - m.r]);
      const y = d3.scaleLinear().domain([Math.min(0, d3.min(all, (p) => p.y)), d3.max(all, (p) => p.y) * 1.1]).nice().range([H - m.b, m.t]);
      (b.bands || []).forEach((bd, i) => {
        const a = Math.max(bd.from, x.domain()[0]), z = Math.min(bd.to, x.domain()[1]); if (z <= a) return;
        s.append("rect").attr("class", "band" + (i % 2 ? " alt" : "")).attr("x", x(a)).attr("width", x(z) - x(a)).attr("y", m.t).attr("height", H - m.t - m.b);
        if (x(z) - x(a) > 40) s.append("text").attr("class", "band-lbl").attr("x", x(a) + 5).attr("y", m.t + 14).text(bd.label);
      });
      s.append("g").attr("class", "grid").selectAll("line").data(y.ticks(4)).join("line").attr("x1", m.l).attr("x2", W - m.r).attr("y1", y).attr("y2", y);
      s.append("g").attr("class", "ax").attr("transform", `translate(${m.l},0)`).call(d3.axisLeft(y).ticks(4).tickSize(0).tickPadding(8).tickFormat((d) => fmtNum(d, Object.assign({}, b.format, { decimals: 0 }))));
      s.append("g").attr("class", "ax").attr("transform", `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(W < 560 ? 4 : 8).tickFormat(d3.format("d")).tickSize(3));
      b.series.forEach((ser) => {
        const c = tone(ser.tone), pts = ser.points.slice().sort((p, q) => p.x - q.x);
        if (b.area) s.append("path").attr("d", d3.area().x((p) => x(p.x)).y0(y(Math.max(0, y.domain()[0]))).y1((p) => y(p.y)).curve(d3.curveMonotoneX)(pts)).attr("fill", c).attr("opacity", 0.12);
        s.append("path").attr("d", d3.line().x((p) => x(p.x)).y((p) => y(p.y)).curve(d3.curveMonotoneX)(pts)).attr("fill", "none").attr("stroke", c).attr("stroke-width", 2.5);
        s.append("circle").attr("cx", x(pts[pts.length - 1].x)).attr("cy", y(pts[pts.length - 1].y)).attr("r", 4.5).attr("fill", c).attr("stroke", "var(--paper2)").attr("stroke-width", 2);
      });
      (b.annotations || []).forEach((a, k) => {
        const ser = b.series[0].points; const p = ser.reduce((best, q) => Math.abs(q.x - a.x) < Math.abs(best.x - a.x) ? q : best, ser[0]);
        if (W < 520 && k % 2) return;
        s.append("text").attr("class", "ann").attr("x", x(p.x)).attr("y", y(p.y) - 12 - (k % 2) * 16).attr("text-anchor", x(p.x) > W * 0.7 ? "end" : "middle").text(a.text);
      });
      s.append("rect").attr("x", m.l).attr("y", m.t).attr("width", W - m.l - m.r).attr("height", H - m.t - m.b).attr("fill", "transparent")
        .on("mousemove touchstart", (ev) => {
          const [px] = d3.pointer(ev.touches ? ev.touches[0] : ev, svg); const xv = x.invert(px);
          const rows = b.series.map((ser) => { const p = ser.points.reduce((best, q) => Math.abs(q.x - xv) < Math.abs(best.x - xv) ? q : best, ser.points[0]); return [ser, p]; });
          tip.show(`<b>${rows[0][1].x}</b> · ` + rows.map(([ser, p]) => `${b.series.length > 1 ? esc(ser.label) + " " : ""}${fmtNum(p.y, b.format)}`).join(" · "), x(rows[0][1].x), y(rows[0][1].y));
        }).on("mouseleave touchend", () => tip.hide());
    });
  };

  R.slope = (mount, b) => {
    const { wrap, svg } = svgIn(mount, b.title);
    responsive(wrap, (W) => {
      const H = Math.max(300, Math.min(440, W * 0.5)), narrow = W < 620;
      const m = { t: 34, b: 24, l: narrow ? 64 : Math.min(230, W * 0.22), r: narrow ? 120 : 250 };
      const s = d3.select(svg).attr("viewBox", `0 0 ${W} ${H}`).attr("width", W).attr("height", H); s.selectAll("*").remove();
      const vals = b.rows.flatMap((r) => [r.start, r.end]);
      const lo = d3.min(vals), hi = d3.max(vals), pad = (hi - lo) * 0.08 || 1;
      const y = d3.scaleLinear().domain([lo - pad, hi + pad]).range([H - m.b, m.t]);
      const x0 = m.l, x1 = W - m.r;
      s.append("text").attr("class", "band-lbl").attr("x", x0).attr("y", 14).attr("text-anchor", "middle").text(b.start_label);
      s.append("text").attr("class", "band-lbl").attr("x", x1).attr("y", 14).attr("text-anchor", "middle").text(b.end_label);
      [x0, x1].forEach((xx) => s.append("line").attr("x1", xx).attr("x2", xx).attr("y1", m.t - 8).attr("y2", H - m.b).attr("stroke", "var(--rule)"));
      const place = (key) => { const pos = b.rows.map((r) => ({ r, y: y(r[key]) })).sort((a, c) => a.y - c.y); for (let i = 1; i < pos.length; i++) if (pos[i].y - pos[i - 1].y < 40) pos[i].y = pos[i - 1].y + 40; return pos; };
      const posR = place("end"), posL = place("start");
      const rows = s.append("g").selectAll("g").data(b.rows).join("g").style("transition", "opacity .2s");
      rows.append("line").attr("x1", x0).attr("y1", (r) => y(r.start)).attr("x2", x1).attr("y2", (r) => y(r.end)).attr("stroke", (r) => tone(r.tone)).attr("stroke-width", 2.5);
      rows.append("circle").attr("cx", x1).attr("cy", (r) => y(r.end)).attr("r", 5).attr("fill", (r) => tone(r.tone));
      rows.append("circle").attr("cx", x0).attr("cy", (r) => y(r.start)).attr("r", 4).attr("fill", (r) => tone(r.tone));
      const same = new Set(b.rows.map((r) => r.start)).size === 1;
      if (same) s.append("text").attr("class", "lbl").attr("x", x0 - 10).attr("y", y(b.rows[0].start) + 4).attr("text-anchor", "end").text(narrow ? b.rows[0].start : "All start at " + b.rows[0].start);
      rows.each(function (r) {
        const g = d3.select(this), ly = posR.find((p) => p.r === r).y;
        g.append("text").attr("x", x1 + 12).attr("y", ly - 2).style("font-family", "var(--f-label)").style("font-weight", 800).style("font-size", narrow ? "13px" : "15px")
          .style("letter-spacing", ".04em").style("text-transform", "uppercase").style("fill", tone(r.tone)).text((narrow ? "" : r.label + " ") + r.end);
        g.append("text").attr("x", x1 + 12).attr("y", ly + 14).attr("class", "lbl").text(narrow ? r.label : r.detail);
        if (!same) { const lyL = posL.find((p) => p.r === r).y; g.append("text").attr("class", "lbl").attr("x", x0 - 10).attr("y", lyL + 4).attr("text-anchor", "end").text(r.start); }
      });
      rows.on("mouseenter", function () { rows.style("opacity", 0.25); d3.select(this).style("opacity", 1); }).on("mouseleave", () => rows.style("opacity", 1));
    });
  };

  R.growth = (mount, b) => {
    const T0 = b.start_year, T1 = b.end_year, YRS = T1 - T0, P = b.prefix || "";
    const f1 = (t) => b.start_value * Math.pow(b.end_value / b.start_value, (t - T0) / YRS);
    const f2 = b.compare_end_value ? (t) => b.start_value * Math.pow(b.compare_end_value / b.start_value, (t - T0) / YRS) : null;
    const cagr = (v) => (Math.pow(v / b.start_value, 1 / YRS) - 1) * 100;
    mount.innerHTML = `<div class="controls"><div class="seg" role="group" aria-label="Scale"><button type="button" data-scale="lin" aria-pressed="true">Linear</button><button type="button" data-scale="log" aria-pressed="false">Log scale</button></div></div>`;
    const { wrap, svg } = svgIn(mount, b.title); const tip = tipFor(wrap);
    mount.insertAdjacentHTML("beforeend", `<div class="slider-row"><label for="${b.dom_id}-yr">${Math.round(T0)}</label><input id="${b.dom_id}-yr" type="range" min="${Math.ceil(T0)}" max="${Math.floor(T1)}" step="1" value="${Math.floor(T1)}"><span>${Math.floor(T1)}</span></div>
      <div class="readout"><div><div class="k">Year</div><div class="v r-yr"></div></div><div><div class="k">${esc(b.label)}</div><div class="v r-a" style="color:var(--accent-ink)"></div></div>${f2 ? `<div><div class="k">${esc(b.compare_label)}</div><div class="v r-b" style="color:var(--accent2)"></div></div>` : ""}<div><div class="k">Doublings so far</div><div class="v r-d"></div></div></div>
      <p class="note">Constant-rate paths between the two endpoints: ${esc(b.label)} ≈${cagr(b.end_value).toFixed(1)}% a year${f2 ? `, ${esc(b.compare_label)} ≈${cagr(b.compare_end_value).toFixed(1)}%` : ""}. Real paths are bumpier.</p>`);
    let scale = "lin", year = Math.floor(T1), redraw;
    const draw = (W) => {
      const H = Math.max(260, Math.min(420, W * 0.46)), m = { t: 30, r: W < 560 ? 70 : 110, b: 30, l: W < 560 ? 44 : 56 };
      const s = d3.select(svg).attr("viewBox", `0 0 ${W} ${H}`).attr("width", W).attr("height", H); s.selectAll("*").remove();
      const x = d3.scaleLinear().domain([T0, T1]).range([m.l, W - m.r]);
      const top = Math.max(b.end_value, b.compare_end_value || 0);
      const y = scale === "log" ? d3.scaleLog().domain([b.start_value * 0.7, top * 1.4]).range([H - m.b, m.t]) : d3.scaleLinear().domain([0, top * 1.06]).nice().range([H - m.b, m.t]);
      (b.bands || []).forEach((e, i) => {
        const a = Math.max(e.from, T0), z = Math.min(e.to, T1); if (z <= a) return;
        s.append("rect").attr("class", "band" + (i % 2 ? " alt" : "")).attr("x", x(a)).attr("y", m.t - 18).attr("width", x(z) - x(a)).attr("height", H - m.b - m.t + 18);
        if (x(z) - x(a) > 34) s.append("text").attr("class", "band-lbl").attr("x", x(a) + 5).attr("y", m.t - 6).text(e.label);
      });
      const yt = scale === "log" ? y.ticks(5).filter((d) => Math.log10(d) % 1 === 0) : y.ticks(4);
      s.append("g").attr("class", "grid").selectAll("line").data(yt).join("line").attr("x1", m.l).attr("x2", W - m.r).attr("y1", y).attr("y2", y);
      s.append("g").attr("class", "ax").attr("transform", `translate(${m.l},0)`).call(d3.axisLeft(y).tickValues(yt).tickSize(0).tickPadding(8).tickFormat((d) => money(d, P)));
      s.append("g").attr("class", "ax").attr("transform", `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(W < 560 ? 4 : 8).tickFormat(d3.format("d")).tickSize(4));
      const ts = d3.range(T0, T1 + 1e-9, Math.max(0.1, YRS / 200)), tEnd = Math.min(T1, year + (T0 % 1));
      const line = (f) => d3.line().x((t) => x(t)).y((t) => y(f(t)));
      const shown = ts.filter((t) => t <= tEnd);
      [[f2, "--accent2", 2.5], [f1, "--accent", 3]].forEach(([f, c, w]) => {
        if (!f) return;
        s.append("path").attr("d", line(f)(ts)).attr("fill", "none").attr("stroke", `var(${c})`).attr("stroke-width", w).attr("opacity", 0.25);
        s.append("path").attr("d", line(f)(shown)).attr("fill", "none").attr("stroke", `var(${c})`).attr("stroke-width", w);
        s.append("circle").attr("cx", x(tEnd)).attr("cy", y(f(tEnd))).attr("r", 5.5).attr("fill", `var(${c})`).attr("stroke", "var(--paper2)").attr("stroke-width", 2);
      });
      s.append("line").attr("class", "ph").attr("x1", x(tEnd)).attr("x2", x(tEnd)).attr("y1", m.t).attr("y2", H - m.b);
      const ya = y(f1(T1)), yb = f2 ? y(f2(T1)) : null;
      s.append("text").attr("class", "end-lbl").attr("x", W - m.r + 8).attr("y", ya + 5).style("fill", "var(--accent-ink)").text(W < 560 ? "" : b.label);
      if (f2) s.append("text").attr("class", "end-lbl").attr("x", W - m.r + 8).attr("y", Math.min(H - m.b, Math.max(yb + 5, ya + 26))).style("fill", "var(--accent2)").text(W < 560 ? "" : b.compare_label);
      s.append("rect").attr("x", m.l).attr("y", m.t).attr("width", W - m.l - m.r).attr("height", H - m.t - m.b).attr("fill", "transparent")
        .on("mousemove touchstart", (ev) => {
          const [px] = d3.pointer(ev.touches ? ev.touches[0] : ev, svg); const t = Math.max(T0, Math.min(T1, x.invert(px)));
          tip.show(`<b>${Math.floor(t)}</b> · ${esc(b.label)} ${money(f1(t), P)}${f2 ? ` · ${esc(b.compare_label)} ${money(f2(t), P)}` : ""}`, px, y(f1(t)));
        }).on("mouseleave touchend", () => tip.hide());
    };
    function setYear(v) {
      year = +v; const t = Math.min(T1, year + (T0 % 1));
      $(".r-yr", mount).textContent = year; $(".r-a", mount).textContent = money(f1(t), P);
      if (f2) $(".r-b", mount).textContent = money(f2(t), P);
      $(".r-d", mount).textContent = Math.max(0, Math.log2(f1(t) / b.start_value)).toFixed(1);
      if (redraw) redraw();
    }
    redraw = responsive(wrap, draw);
    $("input", mount).addEventListener("input", (e) => setYear(e.target.value));
    $$("[data-scale]", mount).forEach((btn) => btn.addEventListener("click", () => { scale = btn.dataset.scale; $$("[data-scale]", mount).forEach((o) => o.setAttribute("aria-pressed", o === btn)); redraw(); }));
    setYear(year);
  };

  R.scenarios = (mount, b) => {
    mount.innerHTML = `<div class="controls"><div class="seg" role="group" aria-label="Scenario">${b.scenarios.map((sc, i) => `<button type="button" data-i="${i}" aria-pressed="${i === 0}">${esc(sc.label)}</button>`).join("")}</div></div>
      <div class="two-up"><svg viewBox="0 0 300 300" role="img" aria-label="${esc(b.title)}"></svg><div class="legend"></div></div>`;
    const svg = d3.select($("svg", mount)); const g = svg.append("g").attr("transform", "translate(150,150)");
    const arc = d3.arc().innerRadius(72).outerRadius(132).cornerRadius(2).padAngle(0.012), pie = d3.pie().sort(null).value((d) => d.value);
    const show = (i) => {
      const sc = b.scenarios[i];
      g.selectAll("path").data(pie(sc.parts), (p, k) => k).join((en) => en.append("path").each(function () { this._c = { startAngle: 0, endAngle: 0 }; }), (u) => u, (ex) => ex.remove())
        .attr("fill", (p) => tone(p.data.tone))
        .transition().duration(reduce ? 0 : 700).attrTween("d", function (p) { const it = d3.interpolate(this._c, p); this._c = it(1); return (t) => arc(it(t)); });
      g.selectAll("text.c").data([0]).join("text").attr("class", "c").attr("text-anchor", "middle").attr("dy", "-0.1em").style("font-family", "var(--f-display)").style("font-size", "34px").style("fill", "var(--ink)").text(sc.center);
      g.selectAll("text.s").data([0]).join("text").attr("class", "s lbl").attr("text-anchor", "middle").attr("dy", "1.5em").text(sc.center_sub);
      $(".legend", mount).innerHTML = sc.parts.map((p) => `<div class="legend-row"><i style="background:${tone(p.tone)}"></i>${esc(p.label)} · ${p.value}%</div>`).join("") + `<p style="font-size:17px;margin-top:12px">${esc(sc.text)}</p>`;
    };
    $$("[data-i]", mount).forEach((btn) => btn.addEventListener("click", () => { $$("[data-i]", mount).forEach((o) => o.setAttribute("aria-pressed", o === btn)); show(+btn.dataset.i); }));
    show(0);
  };

  R.calculator = (mount, b) => {
    const env = {}; b.inputs.forEach((i) => (env[i.id] = i.value));
    const outs = b.outputs.map((o) => Object.assign({ fn: compile(o.expr) }, o));
    const bars = b.bars.map((bar) => Object.assign({}, bar, { segs: bar.segments.map((s) => Object.assign({ fn: compile(s.expr) }, s)) }));
    mount.innerHTML = b.inputs.map((i) => `<div class="slider-row"><label for="${b.dom_id}-${i.id}">${esc(i.label)}</label><input id="${b.dom_id}-${i.id}" data-id="${i.id}" type="range" min="${i.min}" max="${i.max}" step="${i.step}" value="${i.value}"><span class="tnum" data-v="${i.id}"></span></div>`).join("")
      + `<div class="stack"></div><div class="readout">${outs.map((o, k) => `<div><div class="k">${esc(o.label)}</div><div class="v" data-o="${k}" style="color:${toneText(o.tone)}"></div></div>`).join("")}</div>`;
    const render = () => {
      b.inputs.forEach((i) => ($(`[data-v="${i.id}"]`, mount).textContent = env[i.id] + (i.unit || "")));
      outs.forEach((o, k) => ($(`[data-o="${k}"]`, mount).textContent = fmtNum(o.fn(env), o.format)));
      const totals = bars.map((bar) => bar.segs.reduce((a, s) => a + Math.max(0, s.fn(env)), 0)), maxT = Math.max(...totals, 1e-9);
      $(".stack", mount).innerHTML = bars.map((bar, k) => `<div class="stack-row"><div class="who">${esc(bar.label)}<small>${esc(bar.sub)}</small></div><div class="stack-line"><div class="stack-bar" style="width:${(totals[k] / maxT * 82).toFixed(1)}%">${bar.segs.map((s) => { const v = Math.max(0, s.fn(env)); return `<div style="width:${(v / (totals[k] || 1) * 100).toFixed(1)}%;background:${s.tone === "muted" ? "color-mix(in srgb, var(--ink2) 22%, var(--paper))" : tone(s.tone)};color:${s.tone === "muted" ? "var(--ink)" : s.tone === "accent" ? "var(--on-accent)" : "var(--paper)"}">${esc(s.label)}</div>`; }).join("")}</div></div></div>`).join("");
    };
    $$("input", mount).forEach((inp) => inp.addEventListener("input", () => { env[inp.dataset.id] = +inp.value; render(); }));
    render();
  };

  R.cycle = (mount, b) => {
    const NS = "http://www.w3.org/2000/svg", n = b.steps.length, cx = 200, cy = 200, Rr = 140;
    mount.innerHTML = `<div class="two-up"><svg viewBox="0 0 400 400" role="img" aria-label="${esc(b.title)}"></svg><div class="fw-detail" aria-live="polite"></div></div>`;
    const svg = $("svg", mount), det = $(".fw-detail", mount);
    svg.innerHTML = `<defs><marker id="${b.dom_id}-arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--accent)"/></marker></defs>
      <text x="${cx}" y="${cy - 6}" text-anchor="middle" style="font-family:var(--f-display);font-size:26px;fill:var(--ink)">${esc(b.center)}</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" class="lbl">${esc(b.center_sub)}</text>`;
    b.steps.forEach((st, i) => {
      const a0 = -Math.PI / 2 + i * 2 * Math.PI / n + 0.36, a1 = a0 + 2 * Math.PI / n - 0.72;
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", `M ${cx + Rr * Math.cos(a0)} ${cy + Rr * Math.sin(a0)} A ${Rr} ${Rr} 0 0 1 ${cx + Rr * Math.cos(a1)} ${cy + Rr * Math.sin(a1)}`);
      p.setAttribute("fill", "none"); p.setAttribute("stroke", "var(--accent)"); p.setAttribute("stroke-width", "2.5"); p.setAttribute("marker-end", `url(#${b.dom_id}-arr)`);
      svg.appendChild(p);
    });
    const nodes = b.steps.map((st, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / n, x = cx + Rr * Math.cos(a), y = cy + Rr * Math.sin(a);
      const g = document.createElementNS(NS, "g"); g.setAttribute("class", "fw-node"); g.setAttribute("tabindex", "0"); g.setAttribute("role", "button"); g.setAttribute("aria-label", st.label);
      const words = st.label.split(" "), lines = []; words.forEach((w) => { const l = lines[lines.length - 1]; if (l && (l + " " + w).length <= 10) lines[lines.length - 1] = l + " " + w; else lines.push(w); });
      g.innerHTML = `<circle cx="${x}" cy="${y}" r="46"/>` + lines.map((w, k) => `<text x="${x}" y="${y + 5 + (k - (lines.length - 1) / 2) * 15}" text-anchor="middle">${esc(w)}</text>`).join("");
      const act = () => { nodes.forEach((o) => o.classList.remove("on")); g.classList.add("on"); det.innerHTML = `<span class="k">Step ${i + 1} of ${n} · ${esc(st.label)}</span><p>${esc(st.text)}</p>`; };
      g.addEventListener("click", act); g.addEventListener("mouseenter", act); g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } });
      svg.appendChild(g); return g;
    });
    nodes[0].dispatchEvent(new Event("click"));
  };

  R.layers = (mount, b) => {
    const n = b.layers.length, top = 20, h = 300, half = 180, cx = 200, wAt = (y) => half * (1 - y / h);
    const step = h / n;
    let s = `<g class="flipper">`;
    const key = [];  // labels too long for their band are numbered in the band and listed under the pyramid
    b.layers.forEach((L, i) => {
      const y0 = i * step, y1 = (i + 1) * step, a = wAt(y0), z = wAt(y1);
      const fill = i === n - 1 ? "var(--ink)" : `color-mix(in srgb, var(--accent) ${Math.round(100 - i * (60 / Math.max(1, n - 2)))}%, var(--ink))`;
      s += `<path class="lvl" fill="${fill}" d="M ${cx - a} ${top + y0} L ${cx + a} ${top + y0} L ${cx + z} ${top + y1} L ${cx - z} ${top + y1} Z"/>`;
      const fs = Math.max(11, Math.min(15, (a + z) / Math.max(6, L.label.length) * 1.4));
      const fits = L.label.length * fs * 0.62 <= 2 * Math.min(a, z) - 16;
      if (!fits) key.push(L.label);
      const label = fits ? L.label : String(key.length), size = fits ? fs : 16;
      s += `<text class="t" x="${cx}" y="${top + (y0 + y1) / 2 + (i === n - 1 ? -10 : 6)}" style="font-size:${size.toFixed(0)}px;fill:${i === 0 ? "var(--on-accent)" : "var(--paper)"}">${esc(label)}</text>`;
    });
    s += `</g>`;
    const legend = key.length ? `<ol class="pyr-key">${key.map((t, i) => `<li><b>${i + 1}</b>${esc(t)}</li>`).join("")}</ol>` : "";
    mount.innerHTML = `<div class="two-up"><div><svg class="pyr" viewBox="0 0 400 340" role="img" aria-label="${esc(b.title)}">${s}</svg>${legend}</div><div><p class="lt" style="font-size:18px;margin:0 0 14px">${esc(b.text)}</p><button type="button" class="btn o" aria-pressed="false">${esc(b.button)}</button></div></div>`;
    const svg = $("svg", mount), btn = $("button", mount), txt = $(".lt", mount);
    btn.addEventListener("click", () => {
      const f = svg.classList.toggle("flipped"); btn.setAttribute("aria-pressed", f);
      btn.textContent = f ? b.flipped_button : b.button; txt.textContent = f ? b.flipped_text : b.text;
    });
  };

  R.sorter = (mount, b) => {
    mount.innerHTML = `<div class="cards"></div><div class="score" aria-live="polite"></div>`;
    let score = 0, done = 0;
    b.items.forEach((it, i) => {
      const c = document.createElement("div"); c.className = "card";
      c.innerHTML = `<div class="q"><small>${i + 1} of ${b.items.length}</small>${esc(it.text)}</div><div class="act">${b.options.map((o) => `<button type="button">${esc(o)}</button>`).join("")}</div>`;
      $$("button", c).forEach((btn) => btn.addEventListener("click", () => {
        const ok = btn.textContent === it.answer; done++; if (ok) score++;
        $(".act", c).innerHTML = `<span class="pill">${esc(it.answer)}</span>`;
        c.insertAdjacentHTML("beforeend", `<div class="ans"><span class="verdict" style="color:var(${ok ? "--good" : "--bad"})">${ok ? "You called it." : "Not quite."}</span>${esc(it.explanation)}</div>`);
        $(".score", mount).textContent = done === b.items.length ? `${score} of ${b.items.length} right.` : `${done} of ${b.items.length} answered`;
      }));
      $(".cards", mount).appendChild(c);
    });
  };

  R.equation = (mount, b) => {
    mount.innerHTML = `<div class="eq" role="group" aria-label="${esc(b.title || "equation")}">${b.terms.map((t, i) => `<button type="button" class="term" aria-pressed="false" data-i="${i}">${esc(t.label)}</button>${i < b.terms.length - 1 ? '<span class="op">×</span>' : ""}`).join("")}<span class="op">=</span><span class="res">${esc(b.result)}</span></div><div class="eq-detail" aria-live="polite"></div>`;
    const btns = $$(".term", mount);
    btns.forEach((btn) => btn.addEventListener("click", () => {
      btns.forEach((o) => o.setAttribute("aria-pressed", o === btn)); const t = b.terms[+btn.dataset.i];
      $(".eq-detail", mount).innerHTML = `<span class="k">${esc(t.label)}</span>${esc(t.text)}`;
    }));
    if (btns[0]) btns[0].click();
  };

  $$(".fig[data-kind]").forEach((el) => {
    const b = DATA.blocks[el.id], kind = el.dataset.kind, mount = $(".sf-mount", el);
    if (!b || !R[kind]) return;
    const needsD3 = ["bars", "lines", "slope", "growth", "scenarios"].includes(kind);
    mount.innerHTML = "";
    if (needsD3 && !hasD3) { mount.innerHTML = `<p class="note">Chart unavailable: the charting library did not load.</p>`; return; }
    try { R[kind](mount, b); } catch (e) { mount.innerHTML = `<p class="note">This figure could not be drawn.</p>`; console.error(kind, e); }
  });
})();
