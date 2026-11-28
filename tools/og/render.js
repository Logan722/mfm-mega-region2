// Draws the 1200x630 link-preview pictures (img/og/<img>.jpg) from tools/og/cards.json (made by tools/og/pages.py).
// Usage: node tools/og/render.js [cards.json] [--only=id,id] [--missing]   (needs Playwright + Chromium)
// Story chapters: node tools/og/render.js --stories=http://localhost:8095  (scene picture under the chapter title)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../..'), OUT = path.join(ROOT, 'img/og');
const args = process.argv.slice(2), opt = k => (args.find(a => a.startsWith('--' + k + '=')) || '').split('=').slice(1).join('=');
const file = args.find(a => !a.startsWith('--')) || path.join(__dirname, 'cards.json');
const only = opt('only') ? opt('only').split(',') : null, missing = args.includes('--missing'), base = opt('stories');
(async () => {
  const b = await chromium.launch();
  if (!base) {
    const cards = JSON.parse(fs.readFileSync(file, 'utf8')).filter(c => (!only || only.includes(c.img)) && (!missing || !fs.existsSync(path.join(OUT, c.img + '.jpg'))));
    const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
    await p.goto('file://' + path.join(__dirname, 'card.html')); await p.evaluate(() => document.fonts.ready);
    for (const c of cards) {
      await p.evaluate(c => window.paint(c), c);
      await p.evaluate(() => Promise.all([document.fonts.ready, ...[...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))]));
      if (c.photo) await p.evaluate(src => new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = src; }), c.photo.startsWith('..') ? new URL(c.photo, 'file://' + path.join(__dirname, 'card.html')).href : c.photo);
      await p.waitForTimeout(120);
      const f = path.join(OUT, c.img + '.jpg'); fs.mkdirSync(path.dirname(f), { recursive: true });
      await p.screenshot({ path: f, type: 'jpeg', quality: 84 }); console.log(c.img, Math.round(fs.statSync(f).size / 1024) + 'KB');
    }
  } else {
    // Bible Stories: the chapter's own opening scene, with its title in a navy band
    const ids = fs.readdirSync(path.join(ROOT, 'stories')).filter(f => f.endsWith('.html')).map(f => f.slice(0, -5)).filter(id => !only || only.includes('story-' + id));
    const cx = await b.newContext({ viewport: { width: 1920, height: 1080 } }); await cx.clock.install({ time: new Date('2027-01-04T16:00:00Z') });
    const p = await cx.newPage();
    for (const id of ids) {
      await p.goto(base + '/stories/' + id, { waitUntil: 'load' }); await p.waitForTimeout(1800);
      const meta = await p.evaluate(() => ({ t: (document.querySelector('meta[property="og:title"]') || {}).content || document.title }));
      await p.evaluate(() => { ['title', 'dots', 'prog'].forEach(i => { const t = document.getElementById(i); if (t) t.style.visibility = 'hidden'; }); });
      await p.waitForTimeout(300);
      const shot = await p.locator('#stage').screenshot({ type: 'png' });
      const q = await b.newPage({ viewport: { width: 1200, height: 630 } });
      const parts = meta.t.split(': '), head = parts.length > 1 ? parts.slice(1).join(': ') : meta.t, kick = parts.length > 1 ? parts[0] : 'Bible Stories';
      await q.setContent(`<!DOCTYPE html><html><head><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Inter+Tight:wght@700;800&display=block" rel="stylesheet"><style>
        *{margin:0;box-sizing:border-box}body{width:1200px;height:630px;overflow:hidden;position:relative;background:#142240;font-family:'Inter Tight',sans-serif}
        .s{position:absolute;inset:0;background:url(data:image/png;base64,${shot.toString('base64')}) center 38%/cover}
        .g{position:absolute;left:0;right:0;bottom:0;height:300px;background:linear-gradient(180deg,rgba(20,34,64,0),rgba(20,34,64,.92) 46%,#142240)}
        .t{position:absolute;left:60px;right:60px;bottom:52px;text-align:center;color:#fff}
        .k{font:800 17px/1 'Inter Tight';letter-spacing:.22em;text-transform:uppercase;color:#d9a948;margin-bottom:12px}
        h1{font:600 64px/1.04 Fraunces,Georgia,serif;letter-spacing:-.01em;text-wrap:balance;text-shadow:0 4px 18px rgba(0,0,0,.45)}
        .bar{position:absolute;left:0;right:0;bottom:0;height:8px;background:linear-gradient(90deg,#c9952c,#e85d26,#c9952c)}
        .pill{position:absolute;top:28px;left:50%;transform:translateX(-50%);font:800 15px/1 'Inter Tight';letter-spacing:.16em;text-transform:uppercase;color:#fff;background:#142240;border-radius:99px;padding:10px 18px;box-shadow:0 8px 20px -8px rgba(0,0,0,.6)}
        .pill i{display:inline-block;width:8px;height:8px;border-radius:50%;background:#c9952c;margin-right:9px;vertical-align:1px}
        </style></head><body><div class="s"></div><div class="g"></div><div class="pill"><i></i>Play &amp; Grow · Bible Stories</div><div class="t"><div class="k">${kick}</div><h1>${head}</h1></div><div class="bar"></div></body></html>`);
      await q.evaluate(() => document.fonts.ready); await q.waitForTimeout(150);
      const f = path.join(OUT, 'story-' + id + '.jpg'); await q.screenshot({ path: f, type: 'jpeg', quality: 84 }); await q.close();
      console.log('story-' + id, Math.round(fs.statSync(f).size / 1024) + 'KB');
    }
  }
  await b.close();
})();
