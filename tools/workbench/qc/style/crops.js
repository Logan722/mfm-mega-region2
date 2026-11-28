const { chromium } = require('playwright');
const T = [
 ['btn1','index','.hero-actions a.button',0,24],['btn2','index','a:text-is("Plan Your Visit")',0,24],['btn3','index','.evx-actions a.button',0,24],['btn4','index','.tp-gw .foot a.ek-btn',0,24],
 ['btn5','index','.home-gallery a:has-text("See the photos")',0,24],['btn6','ministries','a:has-text("Explore Women")',0,24],['btn7','index','a:has-text("Share Your Testimony")',0,24],['btn8','live','a:has-text("Open live channel")',0,24],
 ['btn9','media','a:has-text("See all our videos")',0,24],['btn10','about','.a5 .lead .mo',0,24],
 ['h2a','index','h2:has-text("Come prepared")',0,30],['h2b','about','h2:has-text("Mega Region 2 USA.")',0,30],['h2c','ministries','h2:has-text("Distinct ministries")',0,30],['h2d','index','h2:has-text("God is still doing")',0,30],['h2e','women','h2:has-text("Led in prayer")',0,30],
 ['eb1','index','p:has-text("Your first visit"), span:has-text("Your first visit")',0,16],['eb2','index','.evx-head p, p:has-text("Upcoming gatherings")',0,16],['eb3','about','p:has-text("At a glance"), span:has-text("At a glance")',0,16],['eb4','about','p:has-text("Global leadership"), span:has-text("Global leadership")',0,16],['eb5','index','p:has-text("Testimonies"):not(:has(*))',0,16],['eb6','index','.tp-gw .k',0,16],
 ['gap-min','ministries','main',0,0],
];
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage(); let cur = '';
for (const [n, pg, sel, i, pad] of T) {
  if (cur !== pg) { await p.goto('http://localhost:8093/' + pg + '.html', { waitUntil: 'load' }); await p.waitForTimeout(1300); cur = pg; }
  try {
    const el = p.locator(sel).nth(i); await el.scrollIntoViewIfNeeded({ timeout: 4000 }); await p.waitForTimeout(500); const bb = await el.boundingBox();
    if (n === 'gap-min') { const y = await p.evaluate(() => { const h = [...document.querySelectorAll('h2')][0]; return h.getBoundingClientRect().top + scrollY; }); await p.evaluate(y => scrollTo(0, y - 120), y); await p.waitForTimeout(400); await p.screenshot({ path: '/home/claude/style-report/img/' + n + '.jpg', quality: 70, clip: { x: 0, y: 0, width: 1440, height: 760 } }); }
    else await p.screenshot({ path: '/home/claude/style-report/img/' + n + '.jpg', quality: 80, clip: { x: Math.max(0, bb.x - pad), y: Math.max(0, bb.y - pad), width: bb.width + pad * 2, height: bb.height + pad * 2 } });
    console.log('ok', n);
  } catch (e) { console.log('miss', n, e.message.slice(0, 60)); }
}
const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 })).newPage();
await m.goto('http://localhost:8093/ministries.html', { waitUntil: 'load' }); await m.waitForTimeout(1200);
const y = await m.evaluate(() => { const h = [...document.querySelectorAll('h2')][0]; return h.getBoundingClientRect().top + scrollY; }); await m.evaluate(y => scrollTo(0, y - 40), y); await m.waitForTimeout(400);
await m.screenshot({ path: '/home/claude/style-report/img/gap-min-m.jpg', quality: 70 }); console.log('ok gap-m');
const s = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage(); await s.goto('http://localhost:8093/privacy.html', { waitUntil: 'load' }); await s.waitForTimeout(800); await s.screenshot({ path: '/home/claude/style-report/img/privacy-hero.jpg', quality: 70, clip: { x: 0, y: 0, width: 1440, height: 380 } });
await s.goto('http://localhost:8093/subscribe.html', { waitUntil: 'load' }); await s.waitForTimeout(800); await s.screenshot({ path: '/home/claude/style-report/img/subscribe-hero.jpg', quality: 70, clip: { x: 0, y: 0, width: 1440, height: 430 } });
await s.goto('http://localhost:8093/live.html', { waitUntil: 'load' }); await s.waitForTimeout(1000); const c = s.locator('h3:has-text("Healing & Deliverance Hour")').first(); await c.scrollIntoViewIfNeeded(); const cb = await c.boundingBox(); await s.screenshot({ path: '/home/claude/style-report/img/live-dates.jpg', quality: 75, clip: { x: 100, y: cb.y - 260, width: 1240, height: 420 } });
await s.goto('http://localhost:8093/ministries.html', { waitUntil: 'load' }); await s.waitForTimeout(1000); const g = s.locator('h3:has-text("Gen218"), h2:has-text("Gen218 Singles")').first(); await g.scrollIntoViewIfNeeded(); await s.waitForTimeout(500); const gb = await g.boundingBox(); await s.screenshot({ path: '/home/claude/style-report/img/min-gen218.jpg', quality: 70, clip: { x: 100, y: Math.max(0, gb.y - 220), width: 1240, height: 560 } });
console.log('done'); await b.close(); })();
