/* Home Depot, Aisle by Aisle: interactions and charts */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasD3 = typeof window.d3 !== "undefined";

  /* ------------------------------------------------------------------ data */
  const CHAPTERS = [
    ["Intro", 43], ["Bernie Marcus’s early career", 332], ["Ken Langone & Handy Dan", 958],
    ["Bernie & Arthur fired", 1988], ["Ross Perot almost buys Home Depot", 2635],
    ["Pat Farrah & HomeCo", 3080], ["First stores & early model", 3903],
    ["Goes public & expands", 4456], ["The operating system", 5075],
    ["Arthur Blank takes CEO", 6361], ["The Bob Nardelli era", 6967],
    ["Nardelli’s downfall", 7929], ["Frank Blake’s turnaround", 8664],
    ["E-commerce & distribution", 9750], ["Home Depot today", 10797],
    ["The paradox of specialness", 11524], ["7 Powers", 11778],
    ["Quintessence", 11957], ["Carve-outs + outro", 12387]
  ];
  const TOTAL = 12900;

  // Net sales, $B, by fiscal year (rounded, Home Depot annual reports)
  const REV = {
    1979: 0.007, 1980: 0.022, 1981: 0.051, 1982: 0.118, 1983: 0.256, 1984: 0.433, 1985: 0.701,
    1986: 1.011, 1987: 1.454, 1988: 2.000, 1989: 2.759, 1990: 3.815, 1991: 5.137, 1992: 7.148,
    1993: 9.239, 1994: 12.48, 1995: 15.47, 1996: 19.54, 1997: 24.16, 1998: 30.22, 1999: 38.43,
    2000: 45.74, 2001: 53.55, 2002: 58.25, 2003: 64.82, 2004: 73.09, 2005: 81.51, 2006: 90.84,
    2007: 77.35, 2008: 71.29, 2009: 66.18, 2010: 68.00, 2011: 70.40, 2012: 74.75, 2013: 78.81,
    2014: 83.18, 2015: 88.52, 2016: 94.60, 2017: 100.9, 2018: 108.2, 2019: 110.2, 2020: 132.1,
    2021: 151.2, 2022: 157.4, 2023: 152.7, 2024: 159.5, 2025: 164.7
  };
  const STORES = {
    1990: 145, 1991: 174, 1992: 214, 1993: 264, 1994: 340, 1995: 423, 1996: 512, 1997: 624,
    1998: 761, 1999: 930, 2000: 1134, 2001: 1333, 2002: 1532, 2003: 1707, 2004: 1890,
    2005: 2042, 2006: 2147, 2007: 2234, 2008: 2274, 2009: 2244, 2010: 2248, 2011: 2252,
    2012: 2256, 2013: 2263, 2014: 2269, 2015: 2274, 2016: 2278, 2017: 2284, 2018: 2287,
    2019: 2291, 2020: 2296, 2021: 2317, 2022: 2322, 2023: 2335, 2024: 2347
  };
  const ERAS = [
    { name: "Marcus", from: 1979, to: 1997 },
    { name: "Blank", from: 1997, to: 2000.9 },
    { name: "Nardelli", from: 2000.9, to: 2007 },
    { name: "Blake", from: 2007, to: 2014.85 },
    { name: "Menear", from: 2014.85, to: 2022.2 },
    { name: "Decker", from: 2022.2, to: 2026.8 }
  ];
  const ceoFor = (y) => (ERAS.find((e) => y + 0.5 >= e.from && y + 0.5 < e.to) || ERAS[ERAS.length - 1]).name;

  /* --------------------------------------------------------------- helpers */
  const fmt = (n) => {
    if (n >= 1e6) return "$" + (n / 1e6).toFixed(n >= 1e7 ? 1 : 2) + "M";
    if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
    return "$" + Math.round(n).toLocaleString();
  };
  const hms = (s) => {
    s = Math.max(0, Math.round(s));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    return [h, m, x].map((v) => String(v).padStart(2, "0")).join(":");
  };
  function responsive(el, draw) {
    let last = 0;
    const run = () => { const w = el.clientWidth; if (w && Math.abs(w - last) > 2) { last = w; draw(w); } };
    if ("ResizeObserver" in window) new ResizeObserver(run).observe(el);
    else window.addEventListener("resize", run);
    run();
  }
  function tipFor(wrap) {
    let t = wrap.querySelector(".tip");
    if (!t) { t = document.createElement("div"); t.className = "tip"; wrap.appendChild(t); }
    return {
      show(html, x, y) { t.innerHTML = html; t.style.left = x + "px"; t.style.top = y + "px"; t.style.opacity = 1;
        const r = t.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
        if (r.left < wr.left) t.style.left = (x + (wr.left - r.left)) + "px";
        if (r.right > wr.right) t.style.left = (x - (r.right - wr.right)) + "px"; },
      hide() { t.style.opacity = 0; }
    };
  }

  /* ------------------------------------------------------------ scrubber */
  const scrub = $("#scrub"), track = $("#track"), fill = $("#track-fill"), head = $("#track-head");
  const sections = $$(".aisle");
  CHAPTERS.forEach(([name, t], i) => {
    const b = document.createElement("button");
    b.className = "tick"; b.type = "button"; b.style.left = (t / TOTAL * 100) + "%";
    b.title = `${String(i + 1).padStart(2, "0")} · ${name} · ${hms(t)}`;
    b.setAttribute("aria-label", `Go to aisle ${i + 1}: ${name}`);
    b.addEventListener("click", (e) => { e.stopPropagation(); sections[i].scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); });
    track.appendChild(b);
  });
  track.addEventListener("click", (e) => {
    const r = track.getBoundingClientRect(); const t = (e.clientX - r.left) / r.width * TOTAL;
    let i = 0; CHAPTERS.forEach(([, s], k) => { if (t >= s) i = k; });
    sections[i].scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  });
  const ticks = $$(".tick", track);
  let raf = 0;
  function onScroll() {
    raf = 0;
    const y = window.scrollY + window.innerHeight * 0.35;
    const heroEnd = $(".hero").offsetTop + $(".hero").offsetHeight * 0.6;
    scrub.classList.toggle("on", window.scrollY > heroEnd - window.innerHeight * 0.35);
    let i = 0;
    sections.forEach((s, k) => { if (y >= s.offsetTop) i = k; });
    const s = sections[i], next = sections[i + 1];
    const start = s.offsetTop, end = next ? next.offsetTop : (s.offsetTop + s.offsetHeight);
    const f = Math.min(1, Math.max(0, (y - start) / Math.max(1, end - start)));
    const t0 = CHAPTERS[i][1], t1 = i + 1 < CHAPTERS.length ? CHAPTERS[i + 1][1] : TOTAL;
    const t = y < sections[0].offsetTop ? 0 : t0 + (t1 - t0) * f;
    $("#scrub-now").textContent = hms(t);
    $("#scrub-chip").textContent = i === 18 ? "Checkout" : "Aisle " + String(i + 1).padStart(2, "0");
    $("#scrub-title").textContent = CHAPTERS[i][0];
    const p = (t / TOTAL * 100) + "%";
    fill.style.width = p; head.style.left = p;
    ticks.forEach((tk, k) => tk.classList.toggle("past", CHAPTERS[k][1] <= t));
  }
  window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(onScroll); }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ----------------------------------------------------- lessons / cart */
  const tags = $$(".tag");
  const read = new Set();
  tags.forEach((t, i) => { t.id = t.id || "lesson-" + (i + 1); });
  $("#cart-t").textContent = tags.length;
  function updateCart() { $("#cart-n").textContent = read.size; renderReceipt(); }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { const i = tags.indexOf(e.target); if (!read.has(i)) { read.add(i); e.target.classList.add("read"); updateCart(); } }
    }), { threshold: 0.6 });
    tags.forEach((t) => io.observe(t));
  }
  function renderReceipt() {
    const r = $("#receipt"); if (!r) return;
    const lines = tags.map((t, i) => {
      const done = read.has(i);
      return `<a class="line${done ? "" : " unread"}" href="#${t.id}"><span class="chk">${done ? "✓" : "·"} ${String(i + 1).padStart(2, "0")}</span><span>${t.dataset.lesson.toUpperCase()}</span><span>A${String(t.dataset.aisle).padStart(2, "0")}</span></a>`;
    }).join("");
    r.innerHTML = `
      <div class="c"><div class="big">HOME DEPOT<br>AISLE BY AISLE</div>
      <div>ACQUIRED · FALL 2026 · EP 2</div><div>RELEASED 09/14/2026 · RUN 3:35:00</div></div>
      <hr>
      <div style="display:grid;grid-template-columns:3.4em 1fr auto;gap:8px;font-weight:600"><span>#</span><span>LESSON</span><span>AISLE</span></div>
      ${lines}
      <hr>
      <div class="tot"><span>LESSONS IN CART</span><span>${read.size} / ${tags.length}</span></div>
      <div class="tot"><span>$1,000 · IPO 09/22/1981</span><span>$1,000.00</span></div>
      <div class="tot"><span>VALUE WITH DIVIDENDS · 2026</span><span>≈$17,000,000</span></div>
      <div class="tot" style="color:#2b5b8a"><span>SAME $1,000 IN S&amp;P 500</span><span>≈$170,000</span></div>
      <hr>
      <div class="c">COMPOUNDED ≈24.2% A YEAR FOR 45 YEARS</div>
      <div class="bc" aria-hidden="true"></div>
      <div class="c">THANKS FOR WALKING THE AISLES</div>`;
  }
  renderReceipt();

  /* ------------------------------------------- 1. compounding chart */
  (function compound() {
    const svgEl = $("#compound-svg"); if (!svgEl || !hasD3) return;
    const wrap = svgEl.parentNode; const tip = tipFor(wrap);
    const T0 = 1981.72, YRS = 45;
    const hd = (t) => 1000 * Math.pow(17000, (t - T0) / YRS);
    const sp = (t) => 1000 * Math.pow(170, (t - T0) / YRS);
    let scale = "lin", year = 2026, W = 900;
    function draw(w) {
      W = w || W;
      const H = Math.max(260, Math.min(420, W * 0.46));
      const m = { t: 30, r: W < 560 ? 64 : 92, b: 30, l: W < 560 ? 44 : 56 };
      const svg = d3.select(svgEl).attr("viewBox", `0 0 ${W} ${H}`).attr("width", W).attr("height", H);
      svg.selectAll("*").remove();
      const x = d3.scaleLinear().domain([T0, 2026.72]).range([m.l, W - m.r]);
      const y = scale === "log" ? d3.scaleLog().domain([700, 2.5e7]).range([H - m.b, m.t])
                                : d3.scaleLinear().domain([0, 1.8e7]).range([H - m.b, m.t]);
      ERAS.forEach((e, i) => {
        const a = Math.max(e.from, T0), b = Math.min(e.to, 2026.72);
        svg.append("rect").attr("class", "era-band" + (i % 2 ? " alt" : "")).attr("x", x(a)).attr("y", m.t - 18).attr("width", Math.max(0, x(b) - x(a))).attr("height", H - m.b - m.t + 18);
        if (x(b) - x(a) > 34) svg.append("text").attr("class", "era-lbl").attr("x", x(a) + 5).attr("y", m.t - 6).text(e.name);
      });
      const yt = scale === "log" ? [1e3, 1e4, 1e5, 1e6, 1e7] : [0, 5e6, 1e7, 1.5e7];
      svg.append("g").attr("class", "grid").selectAll("line").data(yt).join("line")
        .attr("x1", m.l).attr("x2", W - m.r).attr("y1", (d) => y(Math.max(d, 700))).attr("y2", (d) => y(Math.max(d, 700)));
      svg.append("g").attr("class", "ax").attr("transform", `translate(${m.l},0)`)
        .call(d3.axisLeft(y).tickValues(yt).tickSize(0).tickPadding(8).tickFormat((d) => d === 0 ? "$0" : d >= 1e6 ? "$" + d / 1e6 + "M" : d >= 1e3 ? "$" + d / 1e3 + "K" : "$" + d));
      svg.append("g").attr("class", "ax").attr("transform", `translate(0,${H - m.b})`)
        .call(d3.axisBottom(x).tickValues(W < 560 ? [1985, 1995, 2005, 2015, 2025] : d3.range(1985, 2030, 5)).tickFormat(d3.format("d")).tickSize(4));
      const ts = d3.range(T0, 2026.73, 0.25);
      const line = (f) => d3.line().x((t) => x(t)).y((t) => y(f(t)));
      const tEnd = Math.min(2026.72, year + 0.72);
      const shown = ts.filter((t) => t <= tEnd);
      svg.append("path").attr("class", "l-sp").attr("d", line(sp)(ts)).attr("opacity", .25);
      svg.append("path").attr("class", "l-hd").attr("d", line(hd)(ts)).attr("opacity", .25);
      svg.append("path").attr("class", "l-sp").attr("d", line(sp)(shown));
      svg.append("path").attr("class", "l-hd").attr("d", line(hd)(shown));
      svg.append("line").attr("class", "ph").attr("x1", x(tEnd)).attr("x2", x(tEnd)).attr("y1", m.t).attr("y2", H - m.b);
      svg.append("circle").attr("class", "dot-sp").attr("r", 5).attr("cx", x(tEnd)).attr("cy", y(sp(tEnd)));
      svg.append("circle").attr("class", "dot-hd").attr("r", 6).attr("cx", x(tEnd)).attr("cy", y(hd(tEnd)));
      const lx = W - m.r + 8;
      const yh = y(hd(2026.72)), ys = y(sp(2026.72));
      svg.append("text").attr("class", "end-lbl o").attr("x", lx).attr("y", yh + 5).text(W < 560 ? "HD" : "Home Depot");
      svg.append("text").attr("class", "end-lbl b").attr("x", lx).attr("y", Math.min(H - m.b, Math.max(ys + 5, yh + 26))).text(W < 560 ? "S&P" : "S&P 500");
      // hover
      svg.append("rect").attr("x", m.l).attr("y", m.t).attr("width", W - m.l - m.r).attr("height", H - m.t - m.b).attr("fill", "transparent")
        .on("mousemove touchstart", (ev) => {
          const [px] = d3.pointer(ev.touches ? ev.touches[0] : ev, svgEl);
          const t = Math.max(T0, Math.min(2026.72, x.invert(px)));
          tip.show(`<b>${Math.floor(t)}</b> · ${ceoFor(Math.floor(t))} era<br>Home Depot ${fmt(hd(t))} · S&amp;P ${fmt(sp(t))}`, px, y(hd(t)));
        })
        .on("mouseleave touchend", () => tip.hide());
    }
    function setYear(v) {
      year = +v; const t = Math.min(2026.72, year + 0.72);
      $("#r-yr").textContent = year; $("#r-hd").textContent = fmt(hd(t)); $("#r-sp").textContent = fmt(sp(t));
      $("#r-dbl").textContent = Math.max(0, Math.log2(hd(t) / 1000)).toFixed(1);
      draw();
    }
    $("#yr").addEventListener("input", (e) => setYear(e.target.value));
    $$("#fig-compound [data-scale]").forEach((b) => b.addEventListener("click", () => {
      scale = b.dataset.scale; $$("#fig-compound [data-scale]").forEach((o) => o.setAttribute("aria-pressed", o === b)); draw();
    }));
    responsive(wrap, draw);
    setYear(2026);
  })();

  /* ------------------------------------------- 2. ownership donut */
  (function own() {
    const svgEl = $("#own-svg"); if (!svgEl || !hasD3) return;
    const css = getComputedStyle(document.documentElement);
    const C = (v) => css.getPropertyValue(v).trim();
    const DEALS = {
      perot: { parts: [["Ross Perot", 70, "--blueprint"], ["Bernie, Arthur & team", 30, "--apron"]],
        text: "<p style='margin:0 0 8px'><b>$2 million for 70%.</b> Perot would have controlled the board and, as the Cadillac suggested, the details.</p><p style='margin:0'>By the hosts’ estimate, that stake would be worth about <b>$223 billion</b> today.</p>" },
      real: { parts: [["≈40 outside investors", 50, "--blueprint"], ["Management", 45, "--apron"], ["Ken Langone", 5, "--gold"]],
        text: "<p style='margin:0 0 8px'><b>The same $2 million from about 40 investors</b>, in one account of the terms. Management kept nearly half and its independence.</p><p style='margin:0'>Bernie and Arthur ran the company their way for the next two decades.</p>" }
    };
    const svg = d3.select(svgEl); const g = svg.append("g").attr("transform", "translate(150,150)");
    const arc = d3.arc().innerRadius(72).outerRadius(132).cornerRadius(2).padAngle(0.012);
    const pie = d3.pie().sort(null).value((d) => d[1]);
    let cur = null;
    function show(k) {
      const d = DEALS[k];
      const arcs = g.selectAll("path").data(pie(d.parts), (p, i) => i);
      arcs.join(
        (en) => en.append("path").attr("d", arc).each(function (p) { this._c = p; }),
        (up) => up, (ex) => ex.remove()
      ).attr("fill", (p) => C(p.data[2]))
        .transition().duration(reduce ? 0 : 700).attrTween("d", function (p) {
          const i = d3.interpolate(this._c || { startAngle: 0, endAngle: 0 }, p); this._c = i(1); return (t) => arc(i(t));
        });
      g.selectAll("text.c").data([0]).join("text").attr("class", "c").attr("text-anchor", "middle").attr("dy", "-0.1em")
        .style("font-family", "var(--f-display)").style("font-size", "34px").style("fill", "var(--ink)").text(k === "perot" ? "70%" : "95%");
      g.selectAll("text.s").data([0]).join("text").attr("class", "s lbl").attr("text-anchor", "middle").attr("dy", "1.5em")
        .text(k === "perot" ? "to Perot" : "kept off Perot’s desk");
      $("#own-legend").innerHTML = d.parts.map((p) => `<div style="display:flex;gap:10px;align-items:center;font-family:var(--f-sign);font-weight:800;letter-spacing:.04em;text-transform:uppercase;font-size:15px;margin-bottom:6px"><span style="width:14px;height:14px;border-radius:2px;background:${C(p[2])}"></span>${p[0]} · ${p[1]}%</div>`).join("") + `<div style="font-size:17px;margin-top:12px">${d.text}</div>`;
      cur = k;
    }
    $$("#fig-own [data-deal]").forEach((b) => b.addEventListener("click", () => {
      $$("#fig-own [data-deal]").forEach((o) => o.setAttribute("aria-pressed", o === b)); show(b.dataset.deal);
    }));
    show("perot");
  })();

  /* ------------------------------------------- 3. revenue bars */
  function revChart(el, opt) {
    if (!el || !hasD3) return;
    const tip = tipFor(el);
    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.setAttribute("role", "img"); svgEl.setAttribute("aria-label", opt.label);
    el.appendChild(svgEl);
    const years = d3.range(opt.from, opt.to + 1);
    responsive(el, (W) => {
      const H = Math.max(240, Math.min(380, W * 0.42));
      const m = { t: 18, r: 12, b: 28, l: W < 560 ? 40 : 48 };
      const svg = d3.select(svgEl).attr("viewBox", `0 0 ${W} ${H}`).attr("width", W).attr("height", H);
      svg.selectAll("*").remove();
      const x = d3.scaleBand().domain(years).range([m.l, W - m.r]).padding(years.length > 30 ? 0.18 : 0.24);
      const ymax = d3.max(years, (yr) => REV[yr]) * 1.12;
      const y = d3.scaleLinear().domain([0, ymax]).nice().range([H - m.b, m.t]);
      svg.append("g").attr("class", "grid").selectAll("line").data(y.ticks(4)).join("line")
        .attr("x1", m.l).attr("x2", W - m.r).attr("y1", y).attr("y2", y);
      svg.append("g").attr("class", "ax").attr("transform", `translate(${m.l},0)`)
        .call(d3.axisLeft(y).ticks(4).tickSize(0).tickPadding(8).tickFormat((d) => "$" + d + "B"));
      const every = Math.ceil(years.length / (W < 560 ? 5 : 10));
      svg.append("g").attr("class", "ax").attr("transform", `translate(0,${H - m.b})`)
        .call(d3.axisBottom(x).tickValues(years.filter((yr, i) => (yr % 5 === 0) || (years.length < 12 && i % every === 0))).tickFormat(d3.format("d")).tickSize(3));
      const hi = (yr) => opt.hi && yr >= opt.hi[0] && yr <= opt.hi[1];
      svg.append("g").selectAll("rect").data(years).join("rect")
        .attr("class", (yr) => "bar" + (hi(yr) ? " hi" : ""))
        .attr("x", (yr) => x(yr)).attr("width", x.bandwidth())
        .attr("y", (yr) => y(REV[yr])).attr("height", (yr) => y(0) - y(REV[yr])).attr("rx", 1)
        .on("mouseenter touchstart", function (ev, yr) {
          d3.select(this).classed("hov", true);
          const st = STORES[yr] ? ` · ${STORES[yr].toLocaleString()} stores` : "";
          const v = REV[yr] < 1 ? "$" + Math.round(REV[yr] * 1000) + "M" : "$" + REV[yr].toFixed(REV[yr] < 10 ? 2 : 1) + "B";
          tip.show(`<b>FY${yr}</b> · ${v}${st}<br>${ceoFor(yr)} era${yr === 2007 ? " · HD Supply sold" : ""}`, x(yr) + x.bandwidth() / 2, y(REV[yr]));
        })
        .on("mouseleave touchend", function () { d3.select(this).classed("hov", false); tip.hide(); });
      (opt.ann || []).forEach((a) => {
        if (W < 520 && a.wide) return;
        const cx = x(a.year) + x.bandwidth() / 2, cy = y(REV[a.year]);
        const ty = Math.max(m.t + 10, cy - (a.dy || 40));
        const anchor = a.anchor || (cx > W * 0.6 ? "end" : "start");
        svg.append("line").attr("class", "ann-line").attr("x1", cx).attr("x2", cx).attr("y1", cy - 4).attr("y2", ty + 4);
        svg.append("text").attr("class", "ann").attr("x", cx + (anchor === "end" ? -4 : 4)).attr("y", ty).attr("text-anchor", anchor).text(a.text);
      });
    });
  }
  revChart($("#rev-early"), { from: 1979, to: 1997, label: "Home Depot net sales 1979 to 1997",
    ann: [{ year: 1981, text: "IPO, Sept. 1981", dy: 70 }, { year: 1984, text: "Bowater stumble", dy: 50 },
      { year: 1986, text: "Passes $1B", dy: 90 }, { year: 1989, text: "Passes Lowe’s", dy: 100, wide: true }, { year: 1997, text: "Blank becomes CEO", dy: 20 }] });
  revChart($("#rev-all"), { from: 1979, to: 2025, hi: [2019, 2021], label: "Home Depot net sales 1979 to 2025, pandemic years highlighted",
    ann: [{ year: 2006, text: "Nardelli’s peak", dy: 26, wide: true }, { year: 2009, text: "Housing crash", dy: 36, wide: true }, { year: 2021, text: "$151B", dy: 18, anchor: "end" }] });

  /* ------------------------------------------- 4. margin stack */
  (function margin() {
    const box = $("#stack"); if (!box) return;
    const COST = 55, TRAD = 0.45;
    const tradPrice = COST / (1 - TRAD);
    function render(mPct) {
      const m = mPct / 100, price = COST / (1 - m), gp = price - COST;
      const maxP = Math.max(tradPrice, price);
      box.innerHTML = [
        ["Traditional store", "45% margin, via distributors", tradPrice, "trad"],
        ["Warehouse", `${mPct}% margin, bought direct`, price, "hd"]
      ].map(([who, sub, p, cls]) => `
        <div class="stack-row"><div class="who">${who}<small>${sub}</small></div>
        <div class="stack-line"><div class="stack-bar" style="width:${(p / maxP * 82).toFixed(1)}%">
          <div class="c" style="width:${(COST / p * 100).toFixed(1)}%">Cost $55</div>
          <div class="m ${cls}" style="width:${((p - COST) / p * 100).toFixed(1)}%">+$${(p - COST).toFixed(2)}</div>
        </div><span class="price tnum">$${p.toFixed(2)}</span></div></div>`).join("");
      $("#mg-v").textContent = mPct + "%";
      $("#m-price").textContent = "$" + price.toFixed(2);
      $("#m-save").textContent = Math.round((1 - price / tradPrice) * 100) + "%";
      $("#m-gp").textContent = "$" + gp.toFixed(2);
      $("#m-vol").textContent = ((tradPrice - COST) / gp).toFixed(1) + "×";
    }
    $("#mg").addEventListener("input", (e) => render(+e.target.value));
    render(30);
  })();

  /* ------------------------------------------- 5. flywheel */
  (function fly() {
    const svgEl = $("#fly-svg"); if (!svgEl) return;
    const NODES = [
      ["Lower prices", "Bought direct, priced at about 30% gross margin instead of 45%, with one price for everyone. The lowest price in town is the reason to drive past the neighborhood hardware store."],
      ["More shoppers", "Homeowners and contractors come for price and stay for the advice of ex-tradespeople. Word of mouth did the marketing in the early years."],
      ["More volume", "Each giant store moves far more goods than a neighborhood hardware store, and every new store makes the company’s orders bigger."],
      ["Better costs", "Huge orders earn better terms from manufacturers and the best makers for house brands. Rent, staff and systems are spread over more sales."],
      ["Reinvest", "Instead of keeping the savings as profit, pass them back as lower prices, more associates and more selection. Then the wheel turns again."]
    ];
    const NS = "http://www.w3.org/2000/svg";
    const cx = 200, cy = 200, R = 140;
    svgEl.innerHTML = `<defs><marker id="fw-arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--apron)"/></marker></defs>
      <g class="fw-spin"><circle class="fw-ring" cx="${cx}" cy="${cy}" r="${R}"/></g>
      <text x="${cx}" y="${cy - 6}" text-anchor="middle" style="font-family:var(--f-display);font-size:26px;fill:var(--ink)">Volume</text>
      <text x="${cx}" y="${cy + 18}" text-anchor="middle" class="lbl">is the product</text>`;
    // arrows between nodes
    NODES.forEach((n, i) => {
      const a0 = -Math.PI / 2 + i * 2 * Math.PI / NODES.length + 0.36, a1 = a0 + 2 * Math.PI / NODES.length - 0.72;
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", `M ${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)} A ${R} ${R} 0 0 1 ${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)}`);
      p.setAttribute("fill", "none"); p.setAttribute("stroke", "var(--apron)"); p.setAttribute("stroke-width", "2.5"); p.setAttribute("marker-end", "url(#fw-arr)");
      svgEl.appendChild(p);
    });
    const det = $("#fly-detail");
    const nodes = NODES.map((n, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / NODES.length;
      const g = document.createElementNS(NS, "g"); g.setAttribute("class", "fw-node"); g.setAttribute("tabindex", "0"); g.setAttribute("role", "button");
      g.setAttribute("aria-label", n[0]);
      const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      const words = n[0].split(" ");
      g.innerHTML = `<circle cx="${x}" cy="${y}" r="44"/>` + words.map((w, k) => `<text x="${x}" y="${y + 5 + (k - (words.length - 1) / 2) * 16}" text-anchor="middle">${w}</text>`).join("");
      const act = () => { nodes.forEach((o) => o.classList.remove("on")); g.classList.add("on");
        det.innerHTML = `<span class="k">Step ${i + 1} of ${NODES.length} · ${n[0]}</span><p>${n[1]}</p>`; };
      g.addEventListener("click", act); g.addEventListener("mouseenter", act);
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } });
      svgEl.appendChild(g); return g;
    });
    nodes[0].dispatchEvent(new Event("click"));
  })();

  /* ------------------------------------------- 6. pyramid */
  (function pyr() {
    const svgEl = $("#pyr-svg"); if (!svgEl) return;
    // Wide band on top = customers; apex at bottom = CEO.
    const L = [
      ["Customers", "var(--apron)", 0, 70, ""],
      ["Store associates", "color-mix(in srgb, var(--apron) 72%, var(--ink))", 70, 140, ""],
      ["Managers & support", "color-mix(in srgb, var(--apron) 42%, var(--ink))", 140, 210, ""],
      ["CEO", "var(--ink)", 210, 300, ""]
    ];
    const top = 20, h = 300, half = 180, cx = 200;
    const wAt = (y) => half * (1 - y / h);
    let s = `<g class="flipper">`;
    L.forEach(([name, col, y0, y1]) => {
      const a = wAt(y0), b = wAt(y1);
      s += `<path class="lvl" fill="${col}" d="M ${cx - a} ${top + y0} L ${cx + a} ${top + y0} L ${cx + b} ${top + y1} L ${cx - b} ${top + y1} Z"/>`;
      const ty = top + (y0 + y1) / 2 + (name === "CEO" ? -10 : 6);
      s += `<text class="t" x="${cx}" y="${ty}" ${name === "CEO" ? 'style="font-size:13px"' : ""}>${name}</text>`;
    });
    s += `</g>`;
    svgEl.innerHTML = s;
    const btn = $("#pyr-btn"), txt = $("#pyr-text");
    btn.addEventListener("click", () => {
      const conv = svgEl.classList.toggle("conventional");
      btn.setAttribute("aria-pressed", conv);
      btn.textContent = conv ? "Flip it back" : "Show the conventional chart";
      txt.textContent = conv
        ? "The conventional chart: the CEO on top, layers of management in the middle, and customers at the bottom, reached only after every decision has passed through the hierarchy."
        : "Customers at the top, the associates who serve them next, and every layer of management beneath, down to the CEO. Authority flows up toward the people closest to the customer.";
    });
  })();

  /* ------------------------------------------- 7. slope chart */
  (function slope() {
    const svgEl = $("#slope-svg"); if (!svgEl || !hasD3) return;
    const css = getComputedStyle(document.documentElement);
    const ROWS = [
      ["Revenue", 199, "--apron", "$45.7B → $90.8B"],
      ["Stores", 189, "--apron", "1,134 → 2,147"],
      ["Associates per store", 85, "--ink-2", "≈200 → ≈170"],
      ["Home Depot share price", 89, "--bad", "≈$45 → ≈$40"],
      ["Lowe’s share price", 273, "--blueprint", "+173%"]
    ];
    const wrap = svgEl.parentNode;
    responsive(wrap, (W) => {
      const H = Math.max(300, Math.min(440, W * 0.5));
      const narrow = W < 620;
      const m = { t: 34, b: 24, l: narrow ? 64 : 230, r: narrow ? 110 : 250 };
      const svg = d3.select(svgEl).attr("viewBox", `0 0 ${W} ${H}`).attr("width", W).attr("height", H);
      svg.selectAll("*").remove();
      const y = d3.scaleLinear().domain([60, 290]).range([H - m.b, m.t]);
      const x0 = m.l, x1 = W - m.r;
      svg.append("text").attr("class", "era-lbl").attr("x", x0).attr("y", 14).attr("text-anchor", "middle").text("FY2000");
      svg.append("text").attr("class", "era-lbl").attr("x", x1).attr("y", 14).attr("text-anchor", "middle").text("FY2006");
      svg.append("line").attr("x1", x0).attr("x2", x1).attr("y1", y(100)).attr("y2", y(100)).attr("stroke", "var(--rule)").attr("stroke-dasharray", "3 3");
      svg.append("line").attr("x1", x0).attr("x2", x0).attr("y1", m.t - 8).attr("y2", H - m.b).attr("stroke", "var(--rule)");
      svg.append("line").attr("x1", x1).attr("x2", x1).attr("y1", m.t - 8).attr("y2", H - m.b).attr("stroke", "var(--rule)");
      svg.append("text").attr("class", "lbl").attr("x", x0 - 10).attr("y", y(100) + 4).attr("text-anchor", "end").text(narrow ? "100" : "All start at 100");
      // label de-collision on the right
      const pos = ROWS.map((r) => ({ r, y: y(r[1]) })).sort((a, b) => a.y - b.y);
      for (let i = 1; i < pos.length; i++) if (pos[i].y - pos[i - 1].y < 40) pos[i].y = pos[i - 1].y + 40;
      const rows = svg.append("g").selectAll("g").data(ROWS).join("g").attr("class", "slope-row");
      rows.append("line").attr("x1", x0).attr("y1", y(100)).attr("x2", x1).attr("y2", (r) => y(r[1])).attr("stroke", (r) => css.getPropertyValue(r[2]).trim());
      rows.append("circle").attr("cx", x1).attr("cy", (r) => y(r[1])).attr("r", 5).attr("fill", (r) => css.getPropertyValue(r[2]).trim());
      rows.append("circle").attr("cx", x0).attr("cy", y(100)).attr("r", 4).attr("fill", "var(--ink-2)");
      rows.each(function (r) {
        const ly = pos.find((p) => p.r === r).y;
        const g = d3.select(this);
        g.append("text").attr("x", x1 + 12).attr("y", ly - 2).style("font-family", "var(--f-sign)").style("font-weight", 800).style("font-size", narrow ? "13px" : "15px")
          .style("letter-spacing", ".04em").style("text-transform", "uppercase").style("fill", css.getPropertyValue(r[2]).trim()).text((narrow ? "" : r[0] + " ") + r[1]);
        g.append("text").attr("x", x1 + 12).attr("y", ly + 14).attr("class", "lbl").text(narrow ? r[0] : r[3]);
      });
      rows.on("mouseenter", function () { rows.classed("dim", true); d3.select(this).classed("dim", false); })
          .on("mouseleave", () => rows.classed("dim", false));
    });
  })();

  /* ------------------------------------------- 8. stores line */
  (function stores() {
    const el = $("#stores-chart"); if (!el || !hasD3) return;
    const tip = tipFor(el);
    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.setAttribute("role", "img"); svgEl.setAttribute("aria-label", "Home Depot store count 1990 to 2024, flat during the Blake years");
    el.appendChild(svgEl);
    const yrs = Object.keys(STORES).map(Number);
    responsive(el, (W) => {
      const H = Math.max(240, Math.min(360, W * 0.4));
      const m = { t: 22, r: 16, b: 28, l: 48 };
      const svg = d3.select(svgEl).attr("viewBox", `0 0 ${W} ${H}`).attr("width", W).attr("height", H);
      svg.selectAll("*").remove();
      const x = d3.scaleLinear().domain([1990, 2024]).range([m.l, W - m.r]);
      const y = d3.scaleLinear().domain([0, 2500]).range([H - m.b, m.t]);
      [["Nardelli", 2000.9, 2007, false], ["Blake", 2007, 2014.85, true]].forEach(([n, a, b, hi]) => {
        svg.append("rect").attr("x", x(a)).attr("width", x(b) - x(a)).attr("y", m.t).attr("height", H - m.t - m.b)
          .attr("fill", hi ? "var(--apron)" : "var(--ink)").attr("opacity", hi ? 0.12 : 0.05);
        svg.append("text").attr("class", "era-lbl").attr("x", x(a) + 5).attr("y", m.t + 14).text(n);
      });
      svg.append("g").attr("class", "grid").selectAll("line").data([500, 1000, 1500, 2000, 2500]).join("line").attr("x1", m.l).attr("x2", W - m.r).attr("y1", y).attr("y2", y);
      svg.append("g").attr("class", "ax").attr("transform", `translate(${m.l},0)`).call(d3.axisLeft(y).tickValues([0, 1000, 2000]).tickSize(0).tickPadding(8).tickFormat(d3.format(",")));
      svg.append("g").attr("class", "ax").attr("transform", `translate(0,${H - m.b})`).call(d3.axisBottom(x).tickValues(W < 560 ? [1990, 2000, 2010, 2020] : d3.range(1990, 2025, 5)).tickFormat(d3.format("d")).tickSize(3));
      const area = d3.area().x((d) => x(d)).y0(y(0)).y1((d) => y(STORES[d])).curve(d3.curveMonotoneX);
      svg.append("path").attr("d", area(yrs)).attr("fill", "var(--apron)").attr("opacity", 0.12);
      svg.append("path").attr("d", d3.line().x((d) => x(d)).y((d) => y(STORES[d])).curve(d3.curveMonotoneX)(yrs)).attr("fill", "none").attr("stroke", "var(--apron)").attr("stroke-width", 2.5);
      const pts = [[2000, "1,134"], [2006, "2,147"], [2014, "2,269"]];
      pts.forEach(([yr, t]) => {
        svg.append("circle").attr("cx", x(yr)).attr("cy", y(STORES[yr])).attr("r", 4.5).attr("fill", "var(--apron)").attr("stroke", "var(--paper-2)").attr("stroke-width", 2);
        svg.append("text").attr("class", "ann").attr("x", x(yr)).attr("y", y(STORES[yr]) + (yr === 2000 ? -12 : 22)).attr("text-anchor", yr === 2000 ? "end" : "middle").text(t);
      });
      if (W > 520) svg.append("text").attr("class", "ann").attr("x", x(2010.9)).attr("y", y(STORES[2010]) - 30).attr("text-anchor", "middle").text("+35 stores in 7 years");
      svg.append("rect").attr("x", m.l).attr("y", m.t).attr("width", W - m.l - m.r).attr("height", H - m.t - m.b).attr("fill", "transparent")
        .on("mousemove touchstart", (ev) => {
          const [px] = d3.pointer(ev.touches ? ev.touches[0] : ev, svgEl);
          const yr = Math.round(Math.max(1990, Math.min(2024, x.invert(px))));
          tip.show(`<b>FY${yr}</b> · ${STORES[yr].toLocaleString()} stores · ${ceoFor(yr)}`, x(yr), y(STORES[yr]));
        }).on("mouseleave touchend", () => tip.hide());
    });
  })();

  /* ------------------------------------------- 9. housing age */
  (function housing() {
    const el = $("#housing-chart"); if (!el || !hasD3) return;
    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.setAttribute("role", "img"); svgEl.setAttribute("aria-label", "Median age of US homes: about 23 years from 1940 to 1980, 25 in 1990, 30 in 2000, about 40 in 2022");
    el.appendChild(svgEl);
    const P = [[1940, 23], [1980, 23], [1990, 25], [2000, 30], [2022, 40]];
    responsive(el, (W) => {
      const H = Math.max(220, Math.min(300, W * 0.62));
      const m = { t: 24, r: 22, b: 28, l: 34 };
      const svg = d3.select(svgEl).attr("viewBox", `0 0 ${W} ${H}`).attr("width", W).attr("height", H);
      svg.selectAll("*").remove();
      const x = d3.scaleLinear().domain([1940, 2024]).range([m.l, W - m.r]);
      const y = d3.scaleLinear().domain([0, 45]).range([H - m.b, m.t]);
      svg.append("g").attr("class", "grid").selectAll("line").data([10, 20, 30, 40]).join("line").attr("x1", m.l).attr("x2", W - m.r).attr("y1", y).attr("y2", y);
      svg.append("g").attr("class", "ax").attr("transform", `translate(${m.l},0)`).call(d3.axisLeft(y).tickValues([0, 20, 40]).tickSize(0).tickPadding(6));
      svg.append("g").attr("class", "ax").attr("transform", `translate(0,${H - m.b})`).call(d3.axisBottom(x).tickValues([1940, 1960, 1980, 2000, 2020]).tickFormat(d3.format("d")).tickSize(3));
      svg.append("path").attr("d", d3.area().x((d) => x(d[0])).y0(y(0)).y1((d) => y(d[1]))(P)).attr("fill", "var(--blueprint)").attr("opacity", 0.12);
      svg.append("path").attr("d", d3.line().x((d) => x(d[0])).y((d) => y(d[1]))(P.slice(0, 4))).attr("fill", "none").attr("stroke", "var(--blueprint)").attr("stroke-width", 2.5);
      svg.append("path").attr("d", d3.line().x((d) => x(d[0])).y((d) => y(d[1]))(P.slice(3))).attr("fill", "none").attr("stroke", "var(--blueprint)").attr("stroke-width", 2.5).attr("stroke-dasharray", "5 4");
      P.slice(2).forEach(([yr, v]) => {
        svg.append("circle").attr("cx", x(yr)).attr("cy", y(v)).attr("r", 4.5).attr("fill", "var(--blueprint)").attr("stroke", "var(--paper-2)").attr("stroke-width", 2);
        svg.append("text").attr("class", "lbl").attr("x", x(yr)).attr("y", y(v) - 10).attr("text-anchor", yr === 2022 ? "end" : "middle").text(yr === 2022 ? "≈40 today" : v);
      });
      svg.append("text").attr("class", "ann").attr("x", x(1960)).attr("y", y(23) - 10).attr("text-anchor", "middle").text("≈23 years, 1940–1980");
    });
  })();

  /* ------------------------------------------- 10. kept or changed */
  (function game() {
    const box = $("#cards"); if (!box) return;
    const CARDS = [
      ["Vendors ship straight to every store; no distribution centers", "changed", "Changed, and rightly. Blake centralized replenishment through rapid deployment centers, and Menear built the network out further. The hosts: Home Depot today “would be toast without them.”"],
      ["Former tradespeople in orange aprons giving real advice", "kept", "Kept, after a near miss. Nardelli replaced many of them with cheaper part-timers and service suffered. Blake reinvested in associates. The episode treats the labor model as the advantage competitors could not copy."],
      ["Opening new stores as the main engine of growth", "changed", "Changed. The store count roughly doubled under Nardelli, then Blake effectively froze it and redirected cash into productivity, the supply chain and buybacks."],
      ["The inverted pyramid: customers and associates above the CEO", "kept", "Kept, and restored. Blake made it the center of his turnaround; headquarters is still called the Store Support Center."],
      ["Nine regional buying offices with local autonomy", "changed", "Changed. Nardelli folded them into one, and centralized buying stayed. It underpins the scale economies the hosts call Home Depot’s biggest power."],
      ["One price for everyone, no special deals for contractors", "changed", "Mostly changed. With pros now about half of sales, Home Depot built programs for them, including volume pricing on large orders, and bought SRS and GMS to serve them on job sites."],
      ["Founder-era informality, including after-hours partying in the stores", "changed", "Changed. Charming at 50 stores, untenable at 2,000. It was one of the early cracks the hosts flag in the late 1990s."]
    ];
    let score = 0, answered = 0;
    CARDS.forEach(([q, truth, why], i) => {
      const c = document.createElement("div"); c.className = "card";
      c.innerHTML = `<div class="q"><small>Quirk ${i + 1}</small>${q}</div>
        <div class="act"><button type="button" data-v="kept">Kept</button><button type="button" data-v="changed">Changed</button></div>`;
      $$("button", c).forEach((b) => b.addEventListener("click", () => {
        const ok = b.dataset.v === truth; answered++; if (ok) score++;
        $(".act", c).innerHTML = `<span class="pill">${truth === "kept" ? "Kept" : "Changed"}</span>`;
        const a = document.createElement("div"); a.className = "ans";
        a.innerHTML = `<span class="verdict ${ok ? "y" : "n"}">${ok ? "You called it." : "Not quite."}</span>${why}`;
        c.appendChild(a);
        $("#score").textContent = answered === CARDS.length
          ? `${score} of ${CARDS.length}. ${score >= 6 ? "You would have made a fine Home Depot CEO." : score >= 4 ? "Better than Nardelli." : "The paradox is real: it’s hard to tell from the inside."}`
          : `${answered} of ${CARDS.length} answered`;
      }));
      box.appendChild(c);
    });
  })();

  /* ------------------------------------------- 11. 7 powers */
  (function powers() {
    const box = $("#powers"); if (!box) return;
    const P = [
      ["Scale economies", 3, "strong", "Per-unit costs fall as volume grows.", "“The biggest one,” per Ben: the lowest supplier prices and the best manufacturers for house brands, at nearly twice Lowe’s revenue."],
      ["Switching costs", 2, "mid", "Leaving costs the customer more than staying.", "Real for pros who have built Home Depot into how they run their businesses. Store-brand tool batteries add a little lock-in."],
      ["Branding", 2, "mid", "Customers pay or prefer for the name alone.", "Matters mostly with pros and serious do-it-yourselfers."],
      ["Counter-positioning", 0, "na", "A new model incumbents can’t copy without hurting themselves.", "Not argued in the episode materials we could verify."],
      ["Process power", 0, "na", "Embedded ways of working that take years to replicate.", "Not argued as a power in what we could verify, though the labor model discussion in Aisle 9 comes close."],
      ["Network economies", 0, "na", "Each new customer makes the product better for the others.", "Not argued."],
      ["Cornered resource", 0, "na", "Exclusive access to something valuable.", "Not argued."]
    ];
    box.innerHTML = P.map(([n, s, cls, df, vd]) => `<div class="power ${cls}"><div class="nm">${n}</div>
      <div class="meter" aria-label="${cls === "na" ? "not argued" : s + " of 3"}">${[1, 2, 3].map((k) => `<i class="${k <= s ? "on" : ""}"></i>`).join("")}</div>
      <div class="df">${df}</div><div class="vd">${vd}</div></div>`).join("");
  })();

  /* ------------------------------------------- 12. equation */
  (function eq() {
    const box = $("#eq"); if (!box) return;
    const T = [
      ["Old American houses", "A giant, owner-occupied, wood-framed housing stock whose median age climbed from about 23 years to about 40. Demand that grows every year on its own. Aisle 18."],
      ["Warehouse prices", "Sol Price’s model applied to hardware: buy direct, 25,000 items, a 30% margin instead of 45%, savings handed back. Aisles 2, 7 and 9."],
      ["People who know", "Ex-tradespeople, no commissions, the washer instead of the faucet, and the inverted pyramid. The part competitors could not copy. Aisle 9."],
      ["Scale", "Nearly twice Lowe’s revenue, the best supplier terms and house brands. The power the hosts rank first. Aisle 17."],
      ["The Pro", "About half of sales, a customer who buys every week, now served on job sites through SRS and GMS. Aisle 15."],
      ["Capital discipline", "Blake’s pause on store growth, the HD Supply sale, and buying back about 30% of the shares at $30 to $50. Aisle 13."]
    ];
    const det = $("#eq-detail");
    box.innerHTML = T.map((t, i) => `<button type="button" class="term" data-i="${i}" aria-pressed="false">${t[0]}</button>${i < T.length - 1 ? '<span class="op">×</span>' : ""}`).join("") + `<span class="op">=</span><span class="res">45 years of compounding</span>`;
    const btns = $$(".term", box);
    btns.forEach((b) => b.addEventListener("click", () => {
      btns.forEach((o) => o.setAttribute("aria-pressed", o === b));
      const t = T[+b.dataset.i]; det.innerHTML = `<span class="k">${t[0]}</span>${t[1]}`;
    }));
    btns[0].click();
  })();

  /* ------------------------------------------- credits */
  (function credits() {
    const ul = $("#credits"); if (!ul) return;
    const C = window.CREDITS || [];
    ul.innerHTML = C.map((c) => `<li><b>${c.use}</b>: ${c.desc}. ${c.who ? c.who + ", " : ""}${c.lic}. <a href="${c.url}" target="_blank" rel="noopener">Source</a>.</li>`).join("");
  })();
})();
