const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8095/play.html';
const OUT = process.env.OUT || require('path').join(require('os').tmpdir(),'games-qc');
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const res = [];
  for (const [tag, vw, vh, mob] of [['d', 1440, 900, false], ['m', 390, 844, true]]) {
    const ctx = await b.newContext({ viewport: { width: vw, height: vh }, isMobile: mob, hasTouch: mob });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/leaderboard|live-status|about:blank|Failed to load resource/.test(m.text())) errs.push('console: ' + m.text()); });
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.waitForTimeout(800);
    const ok = (name, cond, extra) => res.push({ tag, name, ok: !!cond, extra: extra || '' });
    const over = async () => p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const stageOver = async () => p.evaluate(() => { const s = document.getElementById('play-app'); const W = s.clientWidth; let bad = []; s.querySelectorAll('*').forEach(e => { const r = e.getBoundingClientRect(); if (r.width && r.right > W + 2 && !e.closest('.st-confetti')) bad.push(e.className || e.tagName); }); return bad.slice(0, 4); });
    const shot = async (n) => p.screenshot({ path: `${OUT}/${tag}-${n}.png` });
    // page
    const tiles = await p.$$eval('.gg .gt', a => a.length); ok('11 tiles', tiles === 11, tiles);
    const gname = await p.$eval('.gw [data-gotw-name]', e => e.textContent); ok('gotw painted', gname && gname !== 'Game of the Week', gname);
    ok('page no overflow', (await over()) <= 0);
    await p.$eval('#games', e => e.scrollIntoView()); await p.waitForTimeout(400); await p.screenshot({ path: `${OUT}/${tag}-page-games.png`, fullPage: false });
    const close = async () => { for (let k = 0; k < 3; k++) { if (await p.evaluate(() => document.getElementById('play-app').hidden)) break; await p.keyboard.press('Escape'); await p.waitForTimeout(350); } };
    const S = () => p.evaluate(() => window.PG.get());
    const play = async (id) => { await p.$eval(`.gt[data-game="${id}"] .pg-btn`, b => b.scrollIntoView({ block: 'center' })); await p.click(`.gt[data-game="${id}"] .pg-btn`); await p.waitForTimeout(400); };
    const who = async () => { if (await p.$('#play-app .st-who')) { await p.fill('#play-app input[name=nick]', 'Grace QC'); await p.selectOption('#play-app select[name=branch]', { index: 1 }); await p.click('#play-app .st-who button[type=submit]'); await p.waitForTimeout(500); } };
    const cards = async (n) => { const r = await p.evaluate(() => { const c = document.querySelector('#play-app .st-card'); if (!c) return null; const s = document.getElementById('play-app').getBoundingClientRect(); const r = c.getBoundingClientRect(); return { w: r.width, l: r.left, right: s.width - r.right }; }); return r; };

    // Bible Connections solo
    await play('connect'); await shot('connect-choose'); await p.click('#play-app [data-m=solo]'); await p.waitForTimeout(300); await who(); await p.waitForSelector('#play-app .cn-grid', { timeout: 8000 });
    await shot('connect-1');
    let s = await S();
    for (let gi = 0; gi < 4; gi++) {
      s = await S(); const words = s.P[gi][1];
      for (const w of words) await p.click(`#play-app .cn-w[data-w="${w}"]`);
      await p.click('#play-app .cn-go'); await p.waitForTimeout(250);
      if (gi === 1) await shot('connect-2');
    }
    await p.waitForSelector('#play-app .gx-res', { timeout: 5000 }); await shot('connect-result');
    s = await S(); ok('connect result 4/4', s.found.length === 4 && s.pts === 800, s.pts);
    ok('connect stage fits', (await stageOver()).length === 0, (await stageOver()).join(','));
    await close();

    // Word Connect solo (3 wheels) by keyboard
    await play('wheel'); await p.click('#play-app [data-m=solo]'); await p.waitForSelector('#play-app .wh-wheel', { timeout: 8000 }); await shot('wheel-1');
    for (let w = 0; w < 3; w++) {
      s = await S();
      for (const word of s.P.t) { await p.keyboard.type(word.toLowerCase()); await p.keyboard.press('Enter'); await p.waitForTimeout(120); }
      await p.waitForTimeout(900);
    }
    await p.waitForSelector('#play-app .gx-res', { timeout: 5000 }); s = await S(); ok('wheel all words', s.foundT === s.totalT, s.foundT + '/' + s.totalT); await shot('wheel-result'); await close();
    // swipe test on one wheel (practice via team-free path): open wheel solo again shows today's (already played isn't locked for wheel) -> just test drag on first word
    await play('wheel'); await p.click('#play-app [data-m=solo]'); await p.waitForSelector('#play-app .wh-wheel');
    s = await S(); const target = s.P.t[0]; const used = [];
    const pts = [];
    for (const L of target) { const i = s.letters.findIndex((x, k) => x === L && !used.includes(k)); used.push(i); const bb = await p.$eval(`#play-app .wh-l[data-i="${i}"]`, e => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }); pts.push(bb); }
    await p.mouse.move(pts[0][0], pts[0][1]); await p.mouse.down(); for (const q of pts.slice(1)) await p.mouse.move(q[0], q[1], { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(300);
    s = await S(); ok('wheel swipe finds word', s.found.indexOf(target) >= 0, target); await close();

    // Daily Verse solo: one wrong guess then right
    await play('dverse'); await p.click('#play-app [data-m=solo]'); await p.waitForSelector('#play-app .dv-form', { timeout: 8000 });
    s = await S(); const wrongB = s.v[1] === 0 ? 1 : 0;
    await p.selectOption('#play-app select[name=b]', String(wrongB)); await p.click('#play-app .dv-form button'); await p.waitForTimeout(300); await shot('dverse-1');
    await p.selectOption('#play-app select[name=b]', String(s.v[1])); await p.selectOption('#play-app select[name=c]', String(s.v[2])); await p.click('#play-app .dv-form button');
    await p.waitForSelector('#play-app .gx-res', { timeout: 5000 }); s = await S(); ok('dverse 2 tries = 500', s.pts === 500, s.pts); await shot('dverse-result'); await close();

    // Who Am I? solo: get first after 1 clue, second after a wrong guess, rest straight
    await play('whoami'); await p.click('#play-app [data-m=solo]'); await p.waitForSelector('#play-app .wa-opts', { timeout: 8000 }); await shot('whoami-1');
    for (let i = 0; i < 5; i++) {
      s = await S();
      if (i === 1) { const wrong = s.opts.find(o => o !== s.p.n); await p.click(`#play-app .wa-o[data-o="${wrong}"]`); await p.waitForTimeout(200); }
      await p.click(`#play-app .wa-o[data-o="${(await S()).p.n}"]`); await p.waitForTimeout(200); if (i === 0) await shot('whoami-2');
      await p.click('#play-app .wa-next'); await p.waitForTimeout(250);
    }
    await p.waitForSelector('#play-app .gx-res'); s = await S(); ok('whoami 5/5 2400', s.right === 5 && s.pts === 2400, s.pts); await shot('whoami-result'); await close();

    // Verse Builder solo: one mistake on verse 1
    await play('build'); await p.click('#play-app [data-m=solo]'); await p.waitForSelector('#play-app .vb-pool', { timeout: 8000 }); await shot('build-1');
    for (let i = 0; i < 5; i++) {
      s = await S(); const n = s.v[1].length;
      if (i === 0) { await p.click(`#play-app .vb-p[data-k="${n - 1}"]`); await p.waitForTimeout(100); }
      for (let k = 0; k < n; k++) { await p.click(`#play-app .vb-p[data-k="${k}"]`); await p.waitForTimeout(40); if (i === 0 && k === 1) await shot('build-2'); }
      await p.click('#play-app .vb-next'); await p.waitForTimeout(200);
    }
    await p.waitForSelector('#play-app .gx-res'); s = await S(); ok('build 5 verses', s.score === 5 && s.miss === 1, s.pts); await shot('build-result'); await close();

    // Noah's Pairs solo easy, perfect
    await play('pairs'); await shot('pairs-choose'); await p.click('#play-app [data-lv="6"]'); await p.waitForSelector('#play-app .pr-grid', { timeout: 8000 }); await shot('pairs-1');
    s = await S(); const byName = {}; s.cards.forEach((c, i) => (byName[c.a[1]] = byName[c.a[1]] || []).push(i));
    let first = true;
    for (const nm of Object.keys(byName)) { await p.click(`#play-app .pr-c[data-i="${byName[nm][0]}"]`); await p.waitForTimeout(80); await p.click(`#play-app .pr-c[data-i="${byName[nm][1]}"]`); await p.waitForTimeout(150); if (first) { await shot('pairs-2'); first = false; } }
    await p.waitForSelector('#play-app .gx-res', { timeout: 5000 }); s = await S(); ok('pairs 600', s.pts === 600 && s.moves === 6, s.pts + ' ' + s.moves); await shot('pairs-result'); await close();

    // Imposter: 3 players
    await play('imposter'); await p.waitForSelector('#play-app .imp'); await p.click('#play-app .gx-step button[data-d="-1"]'); await shot('imposter-setup');
    await p.click('#play-app .imp button[type=submit]'); await p.waitForSelector('#play-app .imp-see', { timeout: 8000 });
    let seenImp = 0, seenWord = 0;
    for (let i = 0; i < 3; i++) { await p.click('#play-app .imp-see'); await p.waitForTimeout(150); if (await p.$('#play-app .imp-card.is-imp')) { seenImp++; if (i < 3) await shot('imposter-imp'); } else { seenWord++; await shot('imposter-word'); } await p.click('#play-app .imp-hide'); await p.waitForTimeout(150); }
    ok('imposter one imposter', seenImp === 1 && seenWord === 2, seenImp + '/' + seenWord);
    await shot('imposter-talk'); await p.click('#play-app .imp-rev'); await p.waitForTimeout(200); await shot('imposter-end'); await close();

    // Team play: Connections, 2 teams x 1 turn
    await play('connect'); await p.click('#play-app [data-m=team]'); await p.waitForSelector('#play-app .st-team'); await shot('team-setup');
    await p.click('#play-app input[name=per][value="1"]', { force: true }); await p.click('#play-app .st-team button[type=submit]');
    for (let t = 0; t < 2; t++) {
      await p.waitForSelector('#play-app .tm-pass'); if (t === 0) await shot('team-pass'); await p.click('#play-app .tm-pass .pg-btn');
      await p.waitForSelector('#play-app .cn-grid', { timeout: 8000 }); if (t === 0) await shot('team-connect');
      for (let gi = 0; gi < (t === 0 ? 4 : 2); gi++) { s = await S(); for (const w of s.P[gi][1]) await p.click(`#play-app .cn-w[data-w="${w}"]`); await p.click('#play-app .cn-go'); await p.waitForTimeout(150); }
      if (t === 1) { for (let m = 0; m < 4; m++) { s = await S(); const left = s.words.filter(x => s.found.indexOf(x.g) < 0); const pick = [left[m % left.length], ...left.filter(x => x.g !== left[m % left.length].g).slice(m % 2, (m % 2) + 3)]; const cl = await p.$('#play-app .cn-clear:not([disabled])'); if (cl) await cl.click(); for (const x of pick) await p.click(`#play-app .cn-w[data-w="${x.w}"]`); await p.click('#play-app .cn-go'); await p.waitForTimeout(150); if (!(await p.$('#play-app .cn-go'))) break; } }
      await p.waitForSelector('#play-app .gx-between', { timeout: 6000 }); if (t === 0) await shot('team-between'); await p.click('#play-app .gx-between .pg-btn');
    }
    await p.waitForSelector('#play-app .tm-res', { timeout: 5000 }); await shot('team-result');
    const win = await p.$eval('#play-app .tm-res .st-rank', e => e.textContent); ok('team result', /wins/.test(win), win); await close();

    // Bible Quiz hub -> Daily 10 opens
    await play('bquiz'); await shot('bquiz-hub'); await p.click('#play-app [data-q=daily]'); await p.waitForSelector('#play-app .st-question', { timeout: 8000 }); ok('bquiz daily opens', true); await shot('bquiz-daily'); await close();
    // Word of the Day opens
    await play('word'); await p.waitForSelector('#play-app .wd-row', { timeout: 8000 }); ok('word opens', true); await close();

    // Charades (desktop only: waits for a 45 s turn)
    if (tag === 'd') {
      await play('charades'); await p.waitForSelector('#play-app .st-team'); await p.click('#play-app input[name=per][value="1"]', { force: true }); await p.click('#play-app input[name=secs][value="45"]', { force: true }); await shot('charades-setup');
      await p.click('#play-app .st-team button[type=submit]'); await p.waitForSelector('#play-app .tm-pass'); await p.click('#play-app .tm-pass .pg-btn');
      await p.waitForSelector('#play-app .ch-got', { timeout: 6000 }); await shot('charades-play');
      for (let i = 0; i < 3; i++) { await p.click('#play-app .ch-got'); await p.waitForTimeout(150); } await p.click('#play-app .ch-pass');
      await p.waitForSelector('#play-app .gx-between', { timeout: 50000 }); await shot('charades-between');
      const g = await p.$eval('#play-app .gx-between .st-h', e => e.textContent); ok('charades 3 got', /^3/.test(g), g); await close();
    }
    // local leaderboard shows only the game of the week
    const rows = await p.$$eval('#pg-boardview .lv4-card, #pg-boardview .lv4-mini', a => a.length); ok('board renders', rows >= 1, rows);
    await p.$eval('#leaderboard', e => e.scrollIntoView()); await p.waitForTimeout(300); await shot('board');
    ok('no JS errors', errs.length === 0, errs.slice(0, 3).join(' | '));
    await ctx.close();
  }
  await b.close();
  const bad = res.filter(r => !r.ok);
  res.forEach(r => console.log((r.ok ? 'PASS ' : 'FAIL ') + r.tag + ' ' + r.name + (r.extra !== '' ? ' — ' + r.extra : '')));
  console.log(`${res.length - bad.length}/${res.length} passed`);
})();
