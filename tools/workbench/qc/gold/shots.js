const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await c.newPage();
  const S = [['index', 0, 'home'], ['events/couples-night', 300, 'event'], ['branches/mfm-arlington', 200, 'branch'], ['newsletter/index', 250, 'news'], ['gallery', 600, 'gallery'], ['about', 900, 'about']];
  for (const [pg, y, n] of S) { await p.goto('http://localhost:8097/' + pg + '.html', { waitUntil: 'load' }); await p.waitForTimeout(1500); await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(500); await p.screenshot({ path: '/home/claude/qc/gold/' + n + '.png' }); }
  await b.close();
})();
