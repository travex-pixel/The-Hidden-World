// storyforge QA: load a rendered site in headless Chromium and check it.
// usage: node qa.js <siteDir> <outDir> [--shots "#sel1,#sel2"] [--widths 1280,400] [--schemes light,dark]
// Prints a JSON report on stdout. Exit code 1 when a blocking problem is found.
const path = require("path");
const fs = require("fs");

function loadPlaywright() {
  const tries = [process.env.PLAYWRIGHT_MODULE, "playwright", "/opt/node22/lib/node_modules/playwright",
    path.join(__dirname, "..", "..", "..", "node_modules", "playwright")].filter(Boolean);
  for (const t of tries) { try { return require(t); } catch (e) { /* next */ } }
  throw new Error("playwright not found: npm i playwright (or set PLAYWRIGHT_MODULE)");
}

(async () => {
  const args = process.argv.slice(2);
  const site = path.resolve(args[0]), out = path.resolve(args[1] || path.join(site, "..", "qa"));
  const opt = (k, d) => { const i = args.indexOf("--" + k); return i >= 0 ? args[i + 1] : d; };
  const widths = opt("widths", "1280,400").split(",").map(Number);
  const schemes = opt("schemes", "light,dark").split(",");
  const shots = opt("shots", ".hero,.sec:nth-of-type(3),#sf-checkout").split(",").filter(Boolean);
  fs.mkdirSync(out, { recursive: true });

  const { chromium } = loadPlaywright();
  const exe = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].find((p) => fs.existsSync(p));
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const html = fs.readFileSync(path.join(site, "index.html"), "utf8");
  const standalone = /^\s*<!doctype/i.test(html);
  const wrapped = standalone ? html : `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>${html}</body></html>`;
  const preview = path.join(site, "_qa_preview.html");
  fs.writeFileSync(preview, wrapped);
  const d3Local = path.join(__dirname, "vendor", "d3-7.8.5.min.js");

  const report = { site, runs: [], problems: [], warnings: [] };
  for (const scheme of schemes) for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: scheme });
    const errors = [];
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
    page.on("requestfailed", (r) => { if (!r.url().includes("fonts.g")) errors.push("requestfailed: " + r.url()); });
    // the published page loads d3 from cdnjs; QA serves the identical vendored file so it also runs offline
    await page.route("https://cdnjs.cloudflare.com/**", (r) => r.fulfill({ path: d3Local, contentType: "application/javascript" }));
    await page.goto("file://" + preview, { waitUntil: "load" });
    await page.waitForTimeout(1200);
    const m = await page.evaluate(() => {
      const imgs = Array.from(document.images);
      const sections = document.querySelectorAll(".sec[data-i]").length;
      const figs = Array.from(document.querySelectorAll(".fig[data-kind]"));
      const emptyFigs = figs.filter((f) => !f.querySelector(".sf-mount").children.length).map((f) => f.id);
      const failedFigs = figs.filter((f) => /could not be drawn|unavailable/.test(f.textContent)).map((f) => f.id);
      const wideEls = Array.from(document.querySelectorAll("body *")).filter((el) => {
        const r = el.getBoundingClientRect(); return r.width > 0 && r.right > window.innerWidth + 1 && !el.closest("[style*='overflow']") && getComputedStyle(el).position !== "fixed";
      }).slice(0, 5).map((el) => el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""));
      return {
        scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, height: document.body.scrollHeight,
        brokenImages: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute("src")),
        images: imgs.length, sections, figures: figs.length, emptyFigs, failedFigs, wideEls,
        tags: document.querySelectorAll(".tag").length, title: document.title,
      };
    });
    const run = Object.assign({ scheme, width, errors }, m);
    report.runs.push(run);
    if (m.scrollWidth > m.innerWidth + 1) report.problems.push(`${scheme} ${width}px: page scrolls sideways (${m.scrollWidth}px) ${m.wideEls.join(", ")}`);
    if (m.brokenImages.length) report.problems.push(`${scheme} ${width}px: broken images ${m.brokenImages.join(", ")}`);
    if (m.emptyFigs.length || m.failedFigs.length) report.problems.push(`${scheme} ${width}px: interactive figures failed ${[...m.emptyFigs, ...m.failedFigs].join(", ")}`);
    errors.forEach((e) => report.problems.push(`${scheme} ${width}px: ${e}`));
    // screenshots
    await page.screenshot({ path: path.join(out, `${scheme}-${width}-top.png`) });
    for (const sel of shots) {
      const ok = await page.evaluate((s) => { const el = document.querySelector(s); if (!el) return false; document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70); return true; }, sel);
      if (!ok) { report.warnings.push(`selector not found: ${sel}`); continue; }
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(out, `${scheme}-${width}-${sel.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "")}.png`) });
    }
    await page.close();
  }
  await browser.close();
  fs.unlinkSync(preview);
  report.problems = Array.from(new Set(report.problems));
  report.ok = report.problems.length === 0;
  fs.writeFileSync(path.join(out, "qa.json"), JSON.stringify(report, null, 1));
  console.log(JSON.stringify({ ok: report.ok, problems: report.problems, warnings: report.warnings, runs: report.runs.map((r) => ({ scheme: r.scheme, width: r.width, sections: r.sections, figures: r.figures, images: r.images, tags: r.tags })) }, null, 1));
  process.exit(report.ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(2); });
