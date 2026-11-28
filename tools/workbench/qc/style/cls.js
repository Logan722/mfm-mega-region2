const { chromium } = require('playwright'); const fs = require('fs');
const PAGES = ['index','about','women','gen218','media','live','ministries','play','testimonies','reach-out','privacy','subscribe'];
(async () => {
  const b = await chromium.launch(); const out = {};
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const c = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 500 }); const p = await c.newPage();
    for (const pg of PAGES) {
      await p.goto('http://localhost:8093/' + pg + '.html', { waitUntil: 'load' }).catch(() => {}); await p.waitForTimeout(1000);
      const r = await p.evaluate(() => {
        const rgb = s => (s.match(/[\d.]+/g) || []).map(Number);
        const ctx = e => { for (let x = e; x; x = x.parentElement) { const s = getComputedStyle(x); const a = rgb(s.backgroundColor); if (a.length && (a.length < 4 || a[3] > .5)) return (a[0] * .3 + a[1] * .59 + a[2] * .11) < 128 ? 'dark' : 'light'; if (s.backgroundImage !== 'none' && !/gradient/.test(s.backgroundImage)) return 'dark'; } return 'light'; };
        const path = e => { const cl = (e.className && typeof e.className === 'string') ? e.className.trim().split(/\s+/).slice(0, 2).join('.') : ''; const par = e.parentElement; const pc = par && par.className && typeof par.className === 'string' ? par.className.trim().split(/\s+/)[0] : (par ? par.tagName.toLowerCase() : ''); return (pc ? '.' + pc + ' > ' : '') + e.tagName.toLowerCase() + (cl ? '.' + cl : ''); };
        const res = [];
        const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
        document.querySelectorAll('a,button').forEach(e => { if (!vis(e) || e.closest('#play-app')) return; const s = getComputedStyle(e), r = e.getBoundingClientRect(); const bg = s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.backgroundImage !== 'none', bd = parseFloat(s.borderTopWidth) > 0 || /inset/.test(s.boxShadow); const t = (e.innerText || '').trim(); if ((bg || bd) && r.height >= 28 && r.height <= 80 && t && r.width < 520 && !/skip to/i.test(t)) res.push(['B', path(e), ctx(e), s.borderTopLeftRadius, Math.round(r.height), t.slice(0, 22)]); });
        document.querySelectorAll('p,span,div,small,b,h6,h5,h4,a,cite,em').forEach(e => { if (!vis(e) || e.closest('#play-app') || e.children.length > 1) return; const s = getComputedStyle(e); const t = (e.innerText || '').trim(); if (s.textTransform === 'uppercase' && parseFloat(s.letterSpacing) > 0.8 && parseFloat(s.fontSize) <= 14 && t.length > 2 && !e.closest('a.button,.btn,button')) res.push(['L', path(e), ctx(e), s.fontSize, s.color, t.slice(0, 22)]); });
        return res;
      });
      r.forEach(x => { const k = x[0] + ' ' + x[1] + ' [' + x[2] + ']'; (out[k] = out[k] || { n: 0, pg: new Set(), ex: x.slice(3) }).n++; out[k].pg.add(pg + (w < 500 ? '/m' : '')); });
    }
    await c.close();
  }
  const rows = Object.entries(out).sort(); fs.writeFileSync('/home/claude/qc/style/cls.txt', rows.map(([k, v]) => `${k} | ${v.ex.join(' | ')} | ${[...v.pg].slice(0, 5).join(',')}`).join('\n'));
  console.log(rows.length); await b.close();
})();
