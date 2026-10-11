// Profile photo for THE HIDDEN WORLD: Case Files. usage: node series/true-crime/brand/make_profile.mjs
// Renders square PNGs (1080x1080) designed to survive Instagram/YouTube's circular crop.
import { chromium } from 'playwright';
import { writeFileSync, unlinkSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const font = f => pathToFileURL(resolve(here, '../../../assets/fonts', f)).href;

// fingerprint-like ridges (original geometric drawing), clipped inside the lens
function ridges() {
  let s = '';
  for (let i = 0; i < 9; i++) {
    const r = 22 + i * 24, gap = (i * 53) % 360;
    s += `<circle cx="0" cy="12" r="${r}" fill="none" stroke="#e7ae4f" stroke-width="11" stroke-linecap="round"
      stroke-dasharray="${(2 * Math.PI * r * 0.82).toFixed(1)} ${(2 * Math.PI * r * 0.18).toFixed(1)}" transform="rotate(${gap} 0 12)" opacity="${(0.98 - i * 0.04).toFixed(2)}"/>`;
  }
  return s;
}
function svg(withText) {
  const lensX = withText ? 500 : 480, lensY = withText ? 420 : 480, lensR = withText ? 235 : 270;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <defs>
    <radialGradient id="bg" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#1d2430"/><stop offset="1" stop-color="#07090d"/></radialGradient>
    <radialGradient id="glass" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#2b3a48"/><stop offset="1" stop-color="#0c1219"/></radialGradient>
    <clipPath id="lens"><circle cx="0" cy="0" r="${lensR - 26}"/></clipPath>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.10"/></feComponentTransfer></filter>
  </defs>
  <rect width="1080" height="1080" fill="url(#bg)"/>
  <rect width="1080" height="1080" filter="url(#grain)"/>
  <g transform="translate(${lensX} ${lensY}) rotate(45)">
    <rect x="${lensR - 10}" y="-30" width="70" height="60" fill="#8f949c"/>
    <rect x="${lensR + 54}" y="-46" width="${withText ? 170 : 190}" height="92" rx="30" fill="#d23a2e"/>
    <rect x="${lensR + 54}" y="-46" width="${withText ? 170 : 190}" height="30" rx="15" fill="#ffffff" opacity="0.12"/>
  </g>
  <g transform="translate(${lensX} ${lensY})">
    <circle r="${lensR}" fill="url(#glass)"/>
    <g clip-path="url(#lens)" transform="scale(${(lensR / 300).toFixed(3)})">${ridges()}</g>
    <circle r="${lensR - 13}" fill="none" stroke="#e7ae4f" stroke-width="26"/>
    <path d="M ${-lensR * 0.55} ${-lensR * 0.62} A ${lensR * 0.8} ${lensR * 0.8} 0 0 1 ${lensR * 0.2} ${-lensR * 0.83}" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="12" stroke-linecap="round"/>
  </g>
  ${withText ? `<text x="540" y="890" text-anchor="middle" font-family="CP" font-weight="700" font-size="104" letter-spacing="10" fill="#f4efe4">CASE FILES</text>
  <text x="540" y="958" text-anchor="middle" font-family="CP" font-weight="700" font-size="40" letter-spacing="9" fill="#e7ae4f">TRUE CRIME</text>` : ''}
</svg>`;
}
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
for (const [name, withText] of [['profile_icon.png', false], ['profile_text.png', true]]) {
  const html = resolve(here, '_tmp_profile.html');
  writeFileSync(html, `<!doctype html><style>@font-face{font-family:CP;font-weight:700;src:url('${font('CourierPrime-Bold.ttf')}')}html,body{margin:0;background:#000}</style>${svg(withText)}`);
  await page.goto(pathToFileURL(html).href);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(here, name), clip: { x: 0, y: 0, width: 1080, height: 1080 } });
  console.log('wrote', name);
}
await browser.close();
unlinkSync(resolve(here, '_tmp_profile.html'));
