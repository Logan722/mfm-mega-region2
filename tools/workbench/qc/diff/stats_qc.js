const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.addInitScript(() => { localStorage.setItem('mfm-quiz-me', JSON.stringify({ nick: 'Stats', branch: 'MFM Dallas', other: '', guest: false })); localStorage.setItem('mfm-how', JSON.stringify({ bquiz: 1 })); });
  await p.goto('http://localhost:8096/play.html', { waitUntil: 'load' }); await p.waitForTimeout(1200);
  await p.evaluate(() => PG.start('daily')); await p.waitForSelector('#play-app .st-question');
  for (let i = 0; i < 10; i++) { const a = await p.evaluate(() => { const s = PG.get(); const q = s.qs[s.i].q; return s.i % 3 ? q.answer : (q.answer + 1) % 4; }); await p.click(`#play-app .ans[data-oi="${a}"]`); await p.waitForTimeout(150); await p.click('#play-app .st-next'); await p.waitForTimeout(150); }
  await p.waitForTimeout(1500);
  const wk = await p.evaluate(() => fetch('/.netlify/functions/leaderboard').then(r => r.json()).then(d => d.week));
  const st = await p.evaluate(w => fetch('/.netlify/functions/leaderboard?stats=' + w).then(r => r.json()), wk);
  const ids = Object.keys(st.q); console.log('plays', st.plays, 'questions', ids.length, 'right', ids.filter(i => st.q[i][1]).length, JSON.stringify(st.q).slice(0, 160));
  const bad = await p.evaluate(() => fetch('/.netlify/functions/leaderboard', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ dev: 'abcdefghijklmnop12', nick: 'Bad', branch: 'MFM Dallas', place: 'MFM Dallas', mode: 'daily', pts: 100, score: 1, n: 10, q: '<script>1' }) }).then(r => r.json()));
  console.log('bad q ignored, score still ok:', bad.ok);
  await b.close(); })();
