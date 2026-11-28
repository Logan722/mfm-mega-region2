import { handle, gotw, playStats, weekOf, lpOf, FULL } from '../../../../netlify/functions/leaderboard.mjs';
const mem = new Map();
const store = { async get(k) { const v = mem.get(k); return v === undefined ? null : JSON.parse(v); }, async setJSON(k, v) { mem.set(k, JSON.stringify(v)); }, async list({ prefix }) { return { blobs: [...mem.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })) }; } };
let pass = 0, fail = 0; const ok = (n, c, x) => { if (c) pass++; else { fail++; console.log('FAIL', n, x || ''); } };
let ipn = 0; const post = async (b) => { const r = await handle(new Request('http://localhost/', { method: 'POST', headers: { origin: 'https://mfmmegaregion2usa.org', 'content-type': 'application/json' }, body: JSON.stringify(b) }), store, '9.9.9.' + (ipn++ % 200)); return [r.status, await r.json()]; };
const get = async () => { const r = await handle(new Request('http://localhost/', { method: 'GET' }), store); return r.json(); };
const wk = weekOf(); mem.set('gotw/'+wk, JSON.stringify({g:'whoami'})); const g = await gotw(store, wk);
// pick two non-featured games and the featured one
const A = { dev: 'abcdefghijkl1001', nick: 'Grace', branch: 'MFM Dallas', place: 'MFM Dallas' };
const Bp = { dev: 'abcdefghijkl1002', nick: 'Tunde', branch: 'MFM Tampa', place: 'MFM Tampa' };
ok('conversion: 1500/2000 quiz = 75', lpOf('quiz', 1500) === 75);
ok('conversion: 450/600 dverse = 75', lpOf('dverse', 450) === 75);
ok('conversion: blitz over full marks capped at 100', lpOf('blitz', 8000) === 100);
ok('story conversion', lpOf('story~joseph-1', 300) === 50);
const ptsFor = { connect: [600, 3, 4], whoami: [1500, 4, 5], dverse: [450, 1, 1], wheel: [1300, 12, 16], word: [200, 1, 1], build: [1250, 3, 5], pairs: [500, 5, 6], bquiz: null };
// A plays connect + whoami + daily quiz
let [s, d] = await post({ ...A, mode: 'connect', pts: 600, score: 3, n: 4 }); ok('connect ok', s === 200 && d.counted, JSON.stringify(d));
const mc = g === 'connect' ? 2 : 1; ok('connect adds 75 (x2 if featured)', d.added === 75 * mc, d.added);
ok('standing returned', d.me && d.me.rankAll === 1 && d.me.rankGame === 1 && d.me.top.length === 1 && d.me.top[0].me, JSON.stringify(d.me));
[s, d] = await post({ ...A, mode: 'whoami', pts: 1500, score: 4, n: 5 }); ok('whoami adds 60', d.added === 60 * (g === 'whoami' ? 2 : 1), d.added);
[s, d] = await post({ ...A, mode: 'daily', pts: 1200, score: 8, n: 10 }); ok('daily adds 80', d.added === 80 * (g === 'bquiz' ? 2 : 1), d.added);
// same game family later the same day: quiz mode with lower converted score adds nothing, higher adds the difference
[s, d] = await post({ ...A, mode: 'quiz', pts: 1000, score: 6, n: 10 }); ok('quiz lower than daily: stored, adds 0', s === 200 && d.added === 0, JSON.stringify(d));
[s, d] = await post({ ...A, mode: 'kids', pts: 1350, score: 9, n: 10 }); ok('kids 90 > daily 80: adds 10', d.added === 10 * (g === 'bquiz' ? 2 : 1), d.added);
// first-play-only games
[s, d] = await post({ ...A, mode: 'dverse', pts: 450, score: 1, n: 1 }); const dv = d.added;
[s, d] = await post({ ...A, mode: 'dverse', pts: 600, score: 1, n: 1 }); ok('dverse replay not counted', !d.counted && d.added === 0);
// story chapters
[s, d] = await post({ ...A, mode: 'story', ch: 'joseph-1', pts: 500, score: 4, n: 5 }); ok('story ok', s === 200 && d.counted && d.game === 'story', JSON.stringify(d));
ok('story adds 83', d.added === 83 * (g === 'story' ? 2 : 1), d.added);
[s, d] = await post({ ...A, mode: 'story', ch: 'joseph-1', pts: 400, score: 3, n: 5 }); ok('story replay lower not counted', !d.counted);
[s, d] = await post({ ...A, mode: 'story', ch: 'joseph-1', pts: 600, score: 5, n: 5 }); ok('story replay higher adds diff 17', d.counted && d.added === 17 * (g === 'story' ? 2 : 1), d.added);
[s, d] = await post({ ...A, mode: 'story', ch: 'nope-9', pts: 100, score: 1, n: 5 }); ok('unknown chapter refused', s === 400);
[s, d] = await post({ ...A, mode: 'story', ch: 'joseph-1', pts: 700, score: 5, n: 5 }); ok('story over cap refused', s === 400);
// B
[s, d] = await post({ ...Bp, mode: 'connect', pts: 800, score: 4, n: 4 }); ok('B connect rank 1 in connect', d.me.rankGame === 1 && d.me.nGame === 2, JSON.stringify(d.me));
// board
const v = await get();
const expA = (75 * mc) + (60 * (g === 'whoami' ? 2 : 1)) + (90 * (g === 'bquiz' ? 2 : 1)) + dv + (100 * (g === 'story' ? 2 : 1));
const pA = v.players.find((p) => p.name === 'Grace'); ok('A total = sum of converted points', pA && pA.pts === expA, (pA && pA.pts) + ' vs ' + expA);
ok('branches ranked on board points', v.branches.length === 2 && v.branches.find((b) => b.name === 'MFM Dallas').pts === expA);
ok('per-game: connect real points', v.games.connect.players[0].name === 'Tunde' && v.games.connect.players[0].pts === 800 && v.games.connect.players[1].pts === 600, JSON.stringify(v.games.connect));
ok('per-game: bquiz real points summed over modes', v.games.bquiz.players[0].pts === 1200 + 1000 + 1350, JSON.stringify(v.games.bquiz.players));
ok('per-game: story', v.games.story.players[0].pts === 600);
ok('no private branch field leaked', !('branch' in v.players[0]) && !('branch' in v.games.connect.players[0]));
// rebuild from source gives the same totals
mem.delete(`agg/${wk}`); const v2 = await get(); ok('rebuild matches', JSON.stringify(v2.players) === JSON.stringify(v.players), JSON.stringify(v2.players) + ' / ' + JSON.stringify(v.players));
// old-format board is rebuilt
mem.set(`agg/${wk}`, JSON.stringify({ week: wk, gotw: g, players: { x: { h: 'x', nick: 'Old', pts: 999 } }, built: Date.now() })); const v3 = await get(); ok('old board format rebuilt', !v3.players.find((p) => p.name === 'Old'));
console.log(`${pass}/${pass + fail} passed (gotw=${g})`);
