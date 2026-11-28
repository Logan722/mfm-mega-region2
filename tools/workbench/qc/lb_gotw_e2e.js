const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); let pass = 0, fail = 0; const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + n + (x ? ' — ' + x : '')); };
  const mk = async (w, h) => { const c = await b.newContext({ viewport: { width: w, height: h } }); const p = await c.newPage(); p.errs = []; p.on('pageerror', e => p.errs.push(e.message)); await p.goto('http://localhost:8096/play.html'); await p.waitForTimeout(1500); return p; };
  const A = await mk(1440, 900), B = await mk(390, 844);
  const g = await A.$eval('.gw [data-gotw-name]', e => e.textContent); ok('gotw from server', g === 'Connections', g);
  await B.$eval('#leaderboard', e => e.scrollIntoView()); await B.waitForTimeout(800);
  ok('board empty at start', !!(await B.$('#pg-boardview .lb-empty')));
  // A plays the game of the week
  await A.click('.gw [data-gotw-play]'); await A.waitForTimeout(400); await A.click('#play-app [data-m=solo]'); await A.waitForTimeout(300);
  await A.fill('#play-app input[name=nick]', 'Laptop Grace'); await A.selectOption('#play-app select[name=branch]', 'MFM Dallas'); await A.click('#play-app .st-who button[type=submit]');
  await A.waitForSelector('#play-app .cn-grid');
  for (let gi = 0; gi < 4; gi++) { const s = await A.evaluate(() => window.PG.get()); for (const w of s.P[gi][1]) await A.click(`#play-app .cn-w[data-w="${w}"]`); await A.click('#play-app .cn-go'); await A.waitForTimeout(200); }
  await A.waitForSelector('#play-app .gx-res'); await A.waitForTimeout(1500);
  const note = await A.$eval('#play-app .st-lb small', e => e.textContent); ok('A: added to board', /Added/.test(note), note);
  // B sees it without reloading
  let seen = false; const t0 = Date.now();
  while (Date.now() - t0 < 30000) { if (await B.$('#pg-boardview .lv4-card')) { seen = true; break; } await B.waitForTimeout(1000); }
  ok('B sees the score live', seen, ((Date.now() - t0) / 1000).toFixed(1) + ' s');
  const txt = seen ? await B.$eval('#pg-boardview .lv4-card', e => e.textContent) : ''; ok('B board shows Dallas 800', /MFM Dallas/.test(txt) && /800/.test(txt), txt.replace(/\s+/g, ' ').slice(0, 80));
  // A plays another game (not featured): saved, not counted
  await A.keyboard.press('Escape'); await A.waitForTimeout(400);
  await A.$eval('.gt[data-game=pairs] .pg-btn', e => e.scrollIntoView({ block: 'center' })); await A.click('.gt[data-game=pairs] .pg-btn'); await A.click('#play-app [data-lv="6"]'); await A.waitForSelector('#play-app .pr-grid');
  let s = await A.evaluate(() => window.PG.get()); const by = {}; s.cards.forEach((c, i) => (by[c.a[1]] = by[c.a[1]] || []).push(i));
  for (const n of Object.keys(by)) { await A.click(`#play-app .pr-c[data-i="${by[n][0]}"]`); await A.click(`#play-app .pr-c[data-i="${by[n][1]}"]`); await A.waitForTimeout(120); }
  await A.waitForSelector('#play-app .gx-res'); await A.waitForTimeout(1500);
  const n2 = await A.$eval('#play-app .st-lb small', e => e.textContent); ok('pairs: saved, not this week', /Game of the Week|leaderboard game/.test(n2), n2);
  const dump = await (await fetch('http://localhost:8096/__dump')).json(); ok('pairs play stored for stats', dump.some(k => /\/pairs$/.test(k)), dump.filter(k => k.startsWith('s/')).join(', '));
  ok('no JS errors', !A.errs.length && !B.errs.length, A.errs.concat(B.errs).join(' | '));
  console.log(`${pass}/${pass + fail} passed`); await b.close();
})();
