const { chromium } = require('playwright');
const PAGES = ['events/couples-night','branches/mfm-arlington','messages/a-battle-cry-for-deliverance','gallery-florida','thanks','reach-out/prayer','index','about','women','gen218','media','live','ministries','play','testimonies','reach-out','events','branches','gallery','privacy','subscribe','newsletter/index'];
(async () => {
  const b = await chromium.launch(); const out = {};
  for (const w of [1440, 390]) {
    const c = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 500 }); const p = await c.newPage();
    for (const pg of PAGES) {
      await p.goto('http://localhost:8097/' + pg + '.html', { waitUntil: 'load' }).catch(()=>{}); await p.waitForTimeout(700);
      const r = await p.evaluate(() => {
        const rgb = s => (s.match(/[\d.]+/g) || []).map(Number);
        const hex = a => '#' + a.slice(0, 3).map(x => (x | 0).toString(16).padStart(2, '0')).join('');
        const lum = a => { const c = a.slice(0, 3).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
        const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
        const isGold = a => { const [r, g, bb] = a; return r > 90 && r > g && g > bb && (r - bb) > 60 && (g - bb) > 25; };
        const bgOf = el => { for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); const a = rgb(s.backgroundColor); if (s.backgroundImage !== 'none' && !/gradient/.test(s.backgroundImage)) return null; if (a.length && (a.length < 4 || a[3] > .5)) return a; if (/gradient/.test(s.backgroundImage)) { const m = s.backgroundImage.match(/rgba?\([^)]+\)|#[0-9a-f]{6}/i); if (m) return rgb(m[0]); } } return [255, 255, 255]; };
        const res = [];
        document.querySelectorAll('body *').forEach(el => {
          if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') return;
          const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()); if (!own) return;
          const s = getComputedStyle(el), fg = rgb(s.color), bg = bgOf(el); if (!bg) return;
          const big = parseFloat(s.fontSize) >= 24 || (parseFloat(s.fontSize) >= 18.66 && +s.fontWeight >= 700);
          const ratio = cr(fg, bg), need = big ? 3 : 4.5;
          const goldText = isGold(fg), goldBg = isGold(bg);
          if ((goldText || goldBg) && ratio < need) res.push([goldText ? 'gold text' : 'text on gold', hex(fg), hex(bg), ratio.toFixed(1), (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : el.tagName), el.textContent.trim().slice(0, 30)]);
        });
        return res;
      });
      for (const x of r) { const k = pg + ' | ' + x.slice(0, 5).join(' | '); (out[k] = out[k] || { w: [], t: x[5] }).w.push(w); }
    }
    await c.close();
  }
  const keys = Object.keys(out); console.log('problems', keys.length);
  keys.forEach(k => console.log(k, '|', out[k].t, '|', [...new Set(out[k].w)].join('/')));
  await b.close();
})();
