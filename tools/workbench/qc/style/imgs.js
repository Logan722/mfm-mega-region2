const { chromium } = require('playwright');
(async () => { const b = await chromium.launch();
for (const u of ['http://localhost:8093/index.html','https://mfmmegaregion2usa.org/']) {
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true })).newPage();
await p.goto(u, { waitUntil: 'load' }); await p.waitForTimeout(1500);
for (const sel of ['.location-call img, .loc-map img, [class*=map] img', '.home-gallery img']) {
  const els = await p.$$(sel); let out = [];
  for (const e of els.slice(0, 4)) { await e.scrollIntoViewIfNeeded(); await p.waitForTimeout(700); out.push(await e.evaluate(i => [i.getAttribute('src') || i.currentSrc, i.naturalWidth, Math.round(i.getBoundingClientRect().height)])); }
  console.log(u.slice(0, 30), sel.slice(0, 20), JSON.stringify(out).slice(0, 400));
} }
await b.close(); })();
