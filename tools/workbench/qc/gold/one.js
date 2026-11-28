const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto('http://localhost:8097/about.html', { waitUntil: 'load' }); await p.waitForTimeout(1000);
console.log(await p.evaluate(() => { const out = []; document.querySelectorAll('body *').forEach(e => { const t = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(''); if (/^0[123]$/.test(t)) { const s = getComputedStyle(e); let bg = '', x = e; while (x) { const c = getComputedStyle(x); if (c.backgroundImage !== 'none' || c.backgroundColor !== 'rgba(0, 0, 0, 0)') { bg = c.backgroundColor + ' ' + c.backgroundImage.slice(0, 80) + ' @' + (x.className || x.tagName); break; } x = x.parentElement; } out.push([e.tagName, e.className, s.color, s.fontSize, s.backgroundClip, s.webkitTextFillColor, bg]); } }); return out; }));
await b.close(); })();
