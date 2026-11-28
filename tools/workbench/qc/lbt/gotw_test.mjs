import { handle, gotw, playStats, ORDER, weekOf } from '/home/claude/mfm-mega-region2/netlify/functions/leaderboard.mjs';
const mem = new Map();
const store = { async get(k) { const v = mem.get(k); return v === undefined ? null : JSON.parse(v); }, async setJSON(k, v) { mem.set(k, JSON.stringify(v)); }, async list({ prefix }) { return { blobs: [...mem.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })) }; } };
let pass = 0, fail = 0; const ok = (n, c, x) => { if (c) pass++; else { fail++; console.log('FAIL', n, x || ''); } };
const post = async (b, ip = '1.1.1.1') => { const r = await handle(new Request('http://localhost/', { method: 'POST', headers: { origin: 'https://mfmmegaregion2usa.org', 'content-type': 'application/json' }, body: JSON.stringify(b) }), store, ip); return [r.status, await r.json()]; };
const get = async () => { const r = await handle(new Request('http://localhost/', { method: 'GET' }), store); return r.json(); };
const wk = weekOf();
// rotation
ok('week 1 = connect', await gotw(store, '2026-11-23') === 'connect');
ok('week 2 = wheel', await gotw(store, '2026-11-30') === 'wheel');
ok('week 8 = pairs', await gotw(store, '2027-01-11') === 'pairs');
ok('week 9 = story', await gotw(store, '2027-01-18') === 'story');
ok('saved pick sticks', JSON.parse(mem.get('gotw/2026-11-30')).g === 'wheel');
const g = await gotw(store, wk);
const B = { dev: 'abcdefghijkl0001', nick: 'Grace', branch: 'MFM Dallas', place: 'MFM Dallas', day: '' };
// featured game counts
let [s, d] = await post({ ...B, mode: 'connect', pts: 800, score: 4, n: 4 });
ok('connect accepted', s === 200 && d.ok, JSON.stringify(d));
ok('connect counted', d.counted, JSON.stringify(d));
// not featured -> stored, not counted
[s, d] = await post({ ...B, mode: 'whoami', pts: 2400, score: 5, n: 5 });
ok('whoami counted too', s === 200 && d.ok && d.counted, JSON.stringify(d));
// caps / per-answer rules
[s, d] = await post({ ...B, dev: 'abcdefghijkl0002', mode: 'whoami', pts: 2600, score: 5, n: 5 }); ok('whoami over cap refused', s === 400);
[s, d] = await post({ ...B, dev: 'abcdefghijkl0003', mode: 'build', pts: 1200, score: 2, n: 5 }); ok('build >500 per verse refused', s === 400);
[s, d] = await post({ ...B, dev: 'abcdefghijkl0004', mode: 'wheel', pts: 1220, score: 16, n: 16 }); ok('wheel ok', s === 200, JSON.stringify(d));
[s, d] = await post({ ...B, dev: 'abcdefghijkl0005', mode: 'wheel', pts: 500, score: 2, n: 16 }); ok('wheel per-word cap refused', s === 400);
[s, d] = await post({ ...B, dev: 'abcdefghijkl0006', mode: 'dverse', pts: 600, score: 1, n: 1 }); ok('dverse ok', s === 200);
[s, d] = await post({ ...B, dev: 'abcdefghijkl0006', mode: 'dverse', pts: 500, score: 1, n: 1 }); ok('dverse second play not counted', s === 200 && !d.counted);
[s, d] = await post({ ...B, dev: 'abcdefghijkl0007', mode: 'pairs', pts: 600, score: 6, n: 6 }); ok('pairs ok', s === 200);
[s, d] = await post({ ...B, dev: 'abcdefghijkl0008', mode: 'pairs', pts: 700, score: 6, n: 6 }); ok('pairs >100/pair refused', s === 400);
[s, d] = await post({ ...B, dev: 'abcdefghijkl0009', mode: 'imposter', pts: 10, score: 1, n: 1 }); ok('imposter refused (no leaderboard)', s === 400);
[s, d] = await post({ ...B, dev: 'abcdefghijkl0010', mode: 'daily', pts: 1400, score: 10, n: 10 }); ok('daily (bquiz) ok', s === 200 && d.counted);
// board only has the featured game
const v = await get();
ok('board has gotw', v.gotw === g, v.gotw);
ok('board counts all games now', v.totals.players >= 5, JSON.stringify(v.totals));
// stats see all games
const st = await playStats(store, wk);
ok('stats include non-featured games', st.whoami && st.whoami.players === 1 && st.wheel && st.pairs, JSON.stringify(st));
// stats-based pick after week 8: make 'build' the most returned game two weeks back
const w9 = '2027-01-25', w8 = '2027-01-18', w7 = '2027-01-11';
for (const [h, days] of [['aa', ['2027-01-11', '2027-01-12']], ['bb', ['2027-01-12', '2027-01-14']], ['cc', ['2027-01-13']]]) for (const dd of days.map(x=>x.replace('2027-01-1','2027-01-2'))) mem.set(`s/${w8}/${h}/${dd}/build`, JSON.stringify({ h, mode: 'build', pts: 100 }));
mem.set(`s/${w8}/dd/2027-01-21/connect`, JSON.stringify({ h: 'dd', mode: 'connect', pts: 100 }));
ok('week 10 picks the most-returned game', await gotw(store, w9) === 'build', JSON.parse(mem.get('gotw/' + w9)).g);
// a game can't be featured 3 weeks running
mem.set('gotw/2027-02-01', JSON.stringify({ g: 'build' })); mem.set('gotw/2027-01-25', JSON.stringify({ g: 'build' }));
for (const [h, days] of [['aa', ['2027-02-01', '2027-02-02']]]) for (const dd of days) mem.set(`s/2027-02-01/${h}/${dd}/build`, JSON.stringify({ h, mode: 'build', pts: 100 }));
const w11 = await gotw(store, '2027-02-08'); ok('no 3rd week in a row', w11 !== 'build', w11);
console.log(`${pass}/${pass + fail} passed`);
