const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const shots = [];
  const c = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await c.newPage();
  const go = async (pg, sel, n, pad = 40) => { await p.goto('http://localhost:8097/' + pg + '.html', { waitUntil: 'load' }); await p.waitForTimeout(1500); const el = await p.$(sel); if (!el) { console.log('miss', n); return; } await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(500); const bb = await el.boundingBox(); await p.screenshot({ path: `/home/claude/qc/gold/b-${n}.png`, clip: { x: Math.max(0, bb.x - pad), y: Math.max(0, bb.y - pad), width: Math.min(1440, bb.width + pad * 2), height: bb.height + pad * 2 } }); shots.push(n); };
  await go('index', '.hero-actions', 'hero', 60);
  await go('index', '.site-nav .nav-inner', 'nav', 10);
  await go('index', '.evx-actions', 'events', 60);
  await go('index', '.tp-gw .foot', 'today', 40);
  await go('women', '.wf .btn:not(.dark):not(.ghost)', 'women', 50);
  await go('events/couples-night', '.btn--primary', 'event', 60);
  await go('newsletter/index', '.btn-gold', 'news', 120);
  await go('about', '.a5 .lead .mo', 'about', 80);
  console.log(shots.join(','));
  await b.close();
})();
