const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8096/play.html';
(async () => {
  const b = await chromium.launch(); let pass = 0, fail = 0; const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + n + (x !== undefined ? ' — ' + x : '')); };
  for (const [w, h, tag] of [[1440, 900, 'd'], [390, 844, 'm']]) {
    const c = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 500 }); const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(() => { localStorage.setItem('mfm-quiz-me', JSON.stringify({ nick: 'Tester', branch: 'MFM Dallas', other: '', guest: false })); localStorage.setItem('mfm-how', JSON.stringify({ bquiz: 1, connect: 1, whoami: 1, dverse: 1, wheel: 1 })); localStorage.setItem('mfm-wd-seen', '1'); });
    await p.goto(BASE, { waitUntil: 'load' }); await p.waitForTimeout(1500);
    const lv = () => p.evaluate(() => (PG.get().qs || []).map(x => x.q.level || x.q.lv));
    const close = async () => { for (let i = 0; i < 4; i++) { if (!(await p.evaluate(() => !document.querySelector('#play-app').hidden))) break; await p.keyboard.press('Escape'); await p.waitForTimeout(300); } };
    const W = tag + ' ';
    // Quiz: level screen
    await p.evaluate(() => PG.start('bquiz')); await p.waitForSelector('#play-app [data-q=quiz]'); await p.click('#play-app [data-q=quiz]');
    await p.waitForSelector('#play-app .lv-opt', { timeout: 5000 }).catch(() => {});
    const n = await p.$$eval('#play-app .lv-opt', e => e.length); ok(W + 'quiz asks how hard', n === 3, n);
    const ov = await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1 && [...document.querySelectorAll('#play-app .lv-opt')].every(e => e.getBoundingClientRect().right <= innerWidth + 1)); ok(W + 'level screen fits', ov);
    if (tag === 'm') await p.screenshot({ path: '/home/claude/qc/diff/lv-m.png' }); else await p.screenshot({ path: '/home/claude/qc/diff/lv-d.png' });
    const res = {};
    for (const k of ['easy', 'normal', 'challenge']) {
      if (k !== 'easy') { await p.evaluate(() => PG.start('quiz')); await p.waitForSelector('#play-app .lv-opt'); }
      await p.click(`#play-app [data-lv=${k}]`); await p.waitForSelector('#play-app .st-question', { timeout: 8000 });
      const L = await lv(); res[k] = L;
      const t = await p.$eval('#play-app .st-title, #play-app .st-top, #play-app', e => e.innerText.slice(0, 80));
      // answer right on question 1
      const ans = await p.evaluate(() => { const s = PG.get(); return s.qs[0].q.answer; });
      await p.click(`#play-app .ans[data-oi="${ans}"]`); await p.waitForTimeout(300);
      const gain = await p.evaluate(() => PG.get().pts); const base = { easy: 100, normal: 125, challenge: 150 }[k];
      ok(W + k + ' points', gain >= base && gain <= base + 50, gain);
      const rank = L.map(x => ({ easy: 0, medium: 1, hard: 2 })[x]);
      ok(W + k + ' easy to hard order', rank.every((v, i) => i === 0 || v >= rank[i - 1]), L.join(','));
      await close();
    }
    const cnt = (L, x) => L.filter(v => v === x).length;
    ok(W + 'easy = mostly easy', cnt(res.easy, 'easy') >= 7, JSON.stringify([cnt(res.easy, 'easy'), cnt(res.easy, 'medium'), cnt(res.easy, 'hard')]));
    ok(W + 'normal ~6/3/1', cnt(res.normal, 'easy') >= 5 && cnt(res.normal, 'hard') <= 2, JSON.stringify([cnt(res.normal, 'easy'), cnt(res.normal, 'medium'), cnt(res.normal, 'hard')]));
    ok(W + 'challenge = mostly hard', cnt(res.challenge, 'hard') >= 5, JSON.stringify([cnt(res.challenge, 'easy'), cnt(res.challenge, 'medium'), cnt(res.challenge, 'hard')]));
    ok(W + 'remembers last choice', await p.evaluate(() => JSON.parse(localStorage.getItem('mfm-quiz-diff'))) === 'challenge');
    // Daily 10
    await p.evaluate(() => PG.start('daily')); await p.waitForSelector('#play-app .st-question', { timeout: 8000 });
    const D = await lv(); ok(W + 'daily 10 levels', D.length === 10 && cnt(D, 'easy') >= 5 && cnt(D, 'hard') <= 1, D.join(',')); await close();
    // Team battle
    await p.evaluate(() => PG.start('team')); await p.waitForSelector('#play-app .tm-lv');
    ok(W + 'team: how hard', (await p.$$eval('#play-app .tm-lv input', e => e.length)) === 3);
    await p.click('#play-app .tm-lv label:nth-of-type(1)'); await p.click('#play-app .st-team button[type=submit]'); await p.waitForSelector('#play-app .tm-pass .pg-btn', { timeout: 8000 });
    const T = await lv(); ok(W + 'team easy questions', cnt(T, 'easy') >= T.length * .6, T.join(',')); await close();
    // Blitz ramp
    await p.evaluate(() => PG.start('blitz')); await p.waitForSelector('#play-app .bz-s', { timeout: 8000 });
    const B = await p.evaluate(() => PG.get().list.slice(0, 15).map(x => x.lv)); ok(W + 'blitz starts easy', cnt(B.slice(0, 10), 'hard') === 0 && cnt(B.slice(0, 10), 'easy') >= 7, B.join(',')); await close();
    // Connections
    await p.evaluate(() => PG.start('connect')); await p.waitForTimeout(600); const sb = await p.$('#play-app [data-m=solo]'); if (sb) await sb.click(); await p.waitForSelector('#play-app .cn-grid', { timeout: 8000 });
    const CL = await p.evaluate(() => { const s = PG.get(); return s.P.map(g => s.d.cats[g[0]].l); }); ok(W + 'connections 1,2,2,3', CL.join() === '1,2,2,3', CL.join());
    await close();
    // Who Am I
    await p.evaluate(() => PG.start('whoami')); await p.waitForTimeout(600); const sw = await p.$('#play-app [data-m=solo]'); if (sw) await sw.click(); await p.waitForSelector('#play-app .wa-clues li', { timeout: 8000 });
    const wc = await p.$$eval('#play-app .wa-clues li', e => e.length), worth = await p.$eval('#play-app .st-k b', e => e.textContent); ok(W + 'who am I: 2 clues, worth 500', wc === 2 && worth === '500', wc + ' / ' + worth); await close();
    // Daily Verse hint
    await p.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith('mfm-dv-')) localStorage.removeItem(k); PG.start('dverse'); }); await p.waitForTimeout(600); const sd = await p.$('#play-app [data-m=solo]'); if (sd) await sd.click(); await p.waitForSelector('#play-app .dv-form', { timeout: 8000 });
    for (let i = 0; i < 2; i++) { await p.evaluate((i) => { const s = PG.get(), f = document.querySelector('#play-app .dv-form'); const wrong = (s.v[1] + 20 + i * 7) % 66; f.b.value = String(wrong); f.b.dispatchEvent(new Event('change')); f.c.value = '1'; f.requestSubmit(); }, i); await p.waitForTimeout(400); }
    const hint = await p.$eval('#play-app .dv-hint', e => e.textContent).catch(() => ''); ok(W + 'daily verse hint after 2 misses', /Hint: it.s in/.test(hint), hint); await close();
    // Word Connect
    await p.evaluate(() => PG.start('wheel')); await p.waitForTimeout(600); const sx = await p.$('#play-app [data-m=solo]'); if (sx) await sx.click(); await p.waitForTimeout(1500);
    const K = await p.evaluate(() => (PG.get().list || []).map(w => w.k.length)); ok(W + 'word connect ≤6 letters', K.length === 3 && K.every(x => x <= 6), K.join(',')); await close();
    ok(W + 'no JS errors', errs.length === 0, errs.join(' | '));
    await c.close();
  }
  // server: a 10/10 Challenge quiz at 200 a question is accepted, 201 is refused
  const post = async (pts, score) => (await fetch(BASE.replace('/play.html', '') + '/.netlify/functions/leaderboard', { method: 'POST', headers: { 'content-type': 'application/json', origin: BASE.replace('/play.html', '') }, body: JSON.stringify({ nick: 'Api', branch: 'MFM Dallas', place: 'MFM Dallas', score, pts, n: 10, day: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' }), mode: 'quiz', game: 'bquiz', dev: 'apitestdevice' + Math.random().toString(36).slice(2, 8) }) })).json();
  const a = await post(2000, 10), z = await post(2001, 10); ok('server accepts 2000-pt challenge', a.ok === true, JSON.stringify(a).slice(0, 90)); ok('server refuses 2001', z.ok === false, JSON.stringify(z).slice(0, 90));
  console.log(pass + '/' + (pass + fail) + ' passed'); await b.close();
})();
