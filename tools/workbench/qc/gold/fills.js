const { chromium } = require('playwright');
const PAGES = ['index','about','women','gen218','media','live','ministries','play','testimonies','reach-out','reach-out/prayer','events','events/couples-night','branches','branches/mfm-arlington','messages/a-battle-cry-for-deliverance','gallery','gallery-florida','privacy','subscribe','newsletter/index','thanks','404'];
(async () => {
  const b = await chromium.launch(); const out = {};
  for (const w of [1440, 390]) {
    const c = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 500 }); const p = await c.newPage();
    for (const pg of PAGES) {
      await p.goto('http://localhost:8097/' + pg + '.html', { waitUntil: 'load' }).catch(() => {}); await p.waitForTimeout(800);
      if (w < 500) { await p.evaluate(() => { const t = document.querySelector('.mobile-menu-toggle,.nav-toggle,[aria-controls*=drawer],[aria-label*=menu i]'); if (t) t.click(); }); await p.waitForTimeout(400); }
      const r = await p.evaluate(() => {
        const rgb = s => (s.match(/[\d.]+/g) || []).map(Number);
        const isGold = a => a.length >= 3 && Math.abs(a[0] - 201) < 12 && Math.abs(a[1] - 149) < 12 && Math.abs(a[2] - 44) < 14 && (a.length < 4 || a[3] > .6);
        const fillOf = el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const s = getComputedStyle(e); const a = rgb(s.backgroundColor); if (a.length && (a.length < 4 || a[3] > .6)) return [e, a]; if (/gradient/.test(s.backgroundImage) && /201, 149, 44|#c9952c/i.test(s.backgroundImage)) return [e, [201, 149, 44]]; } return [null, null]; };
        const res = [];
        document.querySelectorAll('body *').forEach(el => {
          if (!el.getClientRects().length) return;
          const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()); if (!own) return;
          const [box, bg] = fillOf(el); if (!box || !isGold(bg)) return;
          let ctx = box.parentElement, cb = null; while (ctx) { const a = rgb(getComputedStyle(ctx).backgroundColor); if (a.length && (a.length < 4 || a[3] > .5)) { cb = a; break; } ctx = ctx.parentElement; }
          const lum = cb ? (cb[0] * .3 + cb[1] * .59 + cb[2] * .11) : 255;
          const cls = (box.tagName.toLowerCase() + (box.className && typeof box.className === 'string' ? '.' + box.className.trim().split(/\s+/).join('.') : '')).slice(0, 70);
          res.push([cls, lum < 128 ? 'dark' : 'light', el.textContent.trim().slice(0, 24)]);
        });
        return res;
      });
      for (const x of r) { const k = x[0] + ' | ' + x[1]; (out[k] = out[k] || { pages: new Set(), t: x[2] }).pages.add(pg + '@' + w); }
    }
    await c.close();
  }
  for (const [k, v] of Object.entries(out)) console.log(k, '|', v.t, '|', [...v.pages].slice(0, 4).join(' '), v.pages.size > 4 ? '+' + (v.pages.size - 4) : '');
  await b.close();
})();
