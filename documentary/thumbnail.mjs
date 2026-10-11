// Export the thumbnail concepts as 1280x720 PNGs.
// usage: node documentary/thumbnail.mjs <outdir> [concept ...]   (default: verdict policy alibi)
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const [outDir, ...names] = process.argv.slice(2);
const concepts = names.length ? names : ['verdict', 'policy', 'alibi'];
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-gpu'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
page.on('pageerror', e => { console.error('[page error]', e.message); process.exitCode = 1; });
await page.goto(pathToFileURL(resolve(here, 'renderer/thumb.html')).href);
await page.evaluate(() => document.fonts.ready);
for (const c of concepts) {
  const url = await page.evaluate(n => window.renderThumb(n), c);
  const f = join(outDir, `thumbnail-${c}.png`);
  writeFileSync(f, Buffer.from(url.split(',')[1], 'base64'));
  console.log(`[thumb] ${f}`);
}
await browser.close();
