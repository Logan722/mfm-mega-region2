const { chromium } = require('playwright');
(async () => { const b = await chromium.launch();
for (const [w,h] of [[1440,900],[390,844]]) { const p = await (await b.newContext({ viewport: { width: w, height: h }, isMobile: w<500 })).newPage();
await p.goto('http://localhost:8093/ministries.html', { waitUntil: 'load' }); await p.waitForTimeout(1200);
console.log(w, await p.evaluate(() => { const h2 = [...document.querySelectorAll('h2')][0]; const intro = h2.parentElement; const r1 = intro.getBoundingClientRect(); const nxt = document.querySelector('.ministry-tabs, [role=tablist], .ministry-card, .min-card, article'); const r2 = nxt ? nxt.getBoundingClientRect() : null; return [intro.className, Math.round(r1.bottom), nxt && nxt.className, r2 && Math.round(r2.top), r2 && Math.round(r2.top - r1.bottom)]; })); }
await b.close(); })();
