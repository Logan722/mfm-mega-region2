const { chromium } = require('playwright'); const fs = require('fs');
const PAGES = ['index','about','women','gen218','media','live','ministries','play','testimonies','reach-out','privacy','subscribe'];
(async () => {
  const b = await chromium.launch(); const all = [];
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const c = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 500 }); const p = await c.newPage();
    for (const pg of PAGES) {
      await p.goto('http://localhost:8093/' + pg + '.html', { waitUntil: 'load' }).catch(() => {}); await p.waitForTimeout(1200);
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); });
      const r = await p.evaluate(() => {
        const out = [];
        const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2 && getComputedStyle(e).visibility !== 'hidden'; };
        const txt = e => (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40);
        const sec = e => { const s = e.closest('section,header,footer,main>div,[class*=hero]'); return s ? (s.tagName.toLowerCase() + '.' + (s.className || '').toString().split(' ')[0]) : ''; };
        // buttons: links/buttons that look like buttons (padding + background or border)
        document.querySelectorAll('a,button').forEach(e => {
          if (!vis(e) || e.closest('#play-app')) return; const s = getComputedStyle(e), r = e.getBoundingClientRect();
          const bg = s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.backgroundImage !== 'none', bd = parseFloat(s.borderTopWidth) > 0 || /inset/.test(s.boxShadow);
          if ((bg || bd) && r.height >= 28 && r.height <= 80 && txt(e) && r.width < 520)
            out.push({ k: 'button', sec: sec(e), t: txt(e), h: Math.round(r.height), rad: s.borderTopLeftRadius, fs: s.fontSize, fw: s.fontWeight, tt: s.textTransform, ls: s.letterSpacing, ff: s.fontFamily.split(',')[0], bg: s.backgroundColor, col: s.color });
        });
        document.querySelectorAll('h1,h2,h3').forEach(e => { if (!vis(e) || e.closest('#play-app')) return; const s = getComputedStyle(e); out.push({ k: e.tagName.toLowerCase(), sec: sec(e), t: txt(e), fs: s.fontSize, fw: s.fontWeight, ff: s.fontFamily.split(',')[0], ta: s.textAlign, col: s.color, lh: s.lineHeight }); });
        // eyebrows: small uppercase letter-spaced text
        document.querySelectorAll('p,span,div,small,b').forEach(e => { if (!vis(e) || e.closest('#play-app') || e.children.length > 1) return; const s = getComputedStyle(e); if (s.textTransform === 'uppercase' && parseFloat(s.letterSpacing) > 1 && parseFloat(s.fontSize) <= 14 && txt(e).length > 3) out.push({ k: 'eyebrow', sec: sec(e), t: txt(e), fs: s.fontSize, fw: s.fontWeight, ls: s.letterSpacing, col: s.color, ta: s.textAlign, ff: s.fontFamily.split(',')[0] }); });
        // body paragraphs
        document.querySelectorAll('p').forEach(e => { if (!vis(e) || e.closest('#play-app,footer')) return; const s = getComputedStyle(e); if (txt(e).length > 60) out.push({ k: 'p', sec: sec(e), t: txt(e), fs: s.fontSize, lh: s.lineHeight, col: s.color, ta: s.textAlign, ff: s.fontFamily.split(',')[0], mw: Math.round(e.getBoundingClientRect().width) }); });
        // cards: boxes with radius + (shadow or border or bg) and sizable
        document.querySelectorAll('article,li,div,a').forEach(e => { if (!vis(e) || e.closest('#play-app')) return; const s = getComputedStyle(e), r = e.getBoundingClientRect(); if (r.width > 180 && r.height > 120 && r.width < 900 && parseFloat(s.borderTopLeftRadius) >= 0 && (s.boxShadow !== 'none' || parseFloat(s.borderTopWidth) > 0) && s.backgroundColor !== 'rgba(0, 0, 0, 0)') out.push({ k: 'card', sec: sec(e), t: (e.className || '').toString().split(' ')[0], rad: s.borderTopLeftRadius, sh: s.boxShadow.slice(0, 40), bd: s.borderTopWidth + ' ' + s.borderTopColor, bg: s.backgroundColor }); });
        // sections: vertical padding
        document.querySelectorAll('main section, body > section, main > div').forEach(e => { if (!vis(e)) return; const s = getComputedStyle(e); out.push({ k: 'section', sec: sec(e), t: (e.className || '').toString().split(' ')[0], pt: s.paddingTop, pb: s.paddingBottom, bg: s.backgroundColor }); });
        return out;
      });
      r.forEach(x => { x.pg = pg; x.w = w; }); all.push(...r);
    }
    await c.close();
  }
  fs.writeFileSync('/home/claude/qc/style/inv.json', JSON.stringify(all)); console.log(all.length); await b.close();
})();
