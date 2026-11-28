const { chromium } = require('playwright');
const PAGES = ['index','about','women','gen218','media','live','ministries','play','testimonies','reach-out','privacy','subscribe'];
(async () => {
  const b = await chromium.launch();
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const c = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, deviceScaleFactor: 1 }); const p = await c.newPage();
    for (const pg of PAGES) {
      await p.goto('http://localhost:8093/' + pg + '.html', { waitUntil: 'load' }).catch(() => {}); await p.waitForTimeout(1200);
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } scrollTo(0, 0); });
      await p.addStyleTag({ content: '.mfm-pop,.mfm-pop-overlay,[class*=newsletter-pop]{display:none!important}' });
      await p.waitForTimeout(500);
      await p.screenshot({ path: `/home/claude/qc/style/${pg}-${w}.png`, fullPage: true });
    }
    await c.close();
  }
  await b.close();
})();
