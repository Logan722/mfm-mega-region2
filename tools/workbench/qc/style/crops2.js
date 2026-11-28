const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage();
await p.goto('http://localhost:8093/index.html', { waitUntil: 'load' }); await p.waitForTimeout(1200);
for (const [n, sel, pad] of [['btn5', '.home-gallery a:has-text("See the photos")', 24], ['eb6', '.tp-gw', 0]]) {
  const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(2500); const bb = await el.boundingBox();
  const clip = n === 'eb6' ? { x: bb.x, y: bb.y, width: bb.width, height: Math.min(bb.height, 260) } : { x: bb.x - pad, y: bb.y - pad, width: bb.width + pad * 2, height: bb.height + pad * 2 };
  await p.screenshot({ path: '/home/claude/style-report/img/' + n + '.jpg', quality: 80, clip }); }
await b.close(); })();
