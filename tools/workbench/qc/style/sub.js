const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto('http://localhost:8093/subscribe.html', { waitUntil: 'load' }); await p.waitForTimeout(1000);
console.log(await p.evaluate(() => { const e = document.querySelector('#sub-submit'); const s = getComputedStyle(e); return [s.color, s.backgroundColor, s.fontSize, s.webkitTextFillColor, s.opacity, s.textIndent, e.innerText, s.visibility, s.fontFamily]; }));
console.log(await p.evaluate(() => { const f = document.querySelector('footer blockquote, footer .footer-verse, footer [class*=verse]'); if (!f) return 'no'; const s = getComputedStyle(f); const r = f.getBoundingClientRect(); return [f.className, r.width, s.width, s.maxWidth, f.parentElement.className, getComputedStyle(f.parentElement).display, getComputedStyle(f.parentElement).gridTemplateColumns]; }));
await b.close(); })();
