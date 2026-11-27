// netlify/functions/leaderboard.mjs — Play & Grow weekly leaderboard (real scores, no sample data)
//
//   GET  /.netlify/functions/leaderboard          → this week's board (top branches + top players)
//   POST /.netlify/functions/leaderboard          → add a finished game's score
//        body: { dev, nick, branch, place, mode, pts, score, n, day }
//
// Storage: Netlify Blobs store "play-leaderboard".
//   s/<week>/<dev>/<day>/<mode>   one score per device, per day, per game type (source of truth)
//   agg/<week>                    the board as shown (updated on every score, rebuilt from s/… every 5 min)
// The week starts Monday 00:00 Central Time, so the board resets on its own every Monday.
//
// Game of the Week (Dawn, 2026-11-27): only the featured game's scores count on the weekly board. Every finished
// scorable game is still stored, so the play stats can pick later weeks' games. Weeks 1-8 give each scorable game one
// turn (ORDER); from week 9 the game with the most players coming back on 2+ days over the last two weeks is chosen
// (a game can be featured at most 2 weeks in a row). The pick is saved in gotw/<week> so it never changes mid-week.
//
// Rules (checked here, not in the browser):
//   - Daily 10 and Word of the Day: only the first play of the day counts.
//   - Quiz, Kids and Blitz: the best score of the day per game type counts.
//   - Team Battle never counts (one phone, several people).
//   - Points are capped per game type, names are cleaned, branches must be on the list
//     ("Other / visiting" counts as "Visitors & friends"), 40 scores per hour per connection.
import { getStore } from '@netlify/blobs';

export const BRANCHES = ["MFM USA Prayer City","MFM Rehoboth","MFM Revival Chapel","MFM Houston 2","MFM Houston 3 — City of Refuge","MFM Houston 5 — New Glory","MFM 7 North Houston","MFM Greater Grace","MFM Northwest Houston","MFM Dallas","MFM House of His Glory","MFM Arlington","MFM Arlington — Matlock","MFM Grand Prairie","MFM Irving","MFM Mansfield","MFM The Lord Has Spoken","MFM San Antonio","MFM Pearland — Shadow of God","MFM Sugar Land","MFM Huntsville","MFM Tampa","MFM Broward","MFM Miami — Mount Zion","MFM Orlando — Citadel of Solution","MFM Tallahassee","MFM Revival Center","MFM Riverdale","MFM Citadel of Signs & Wonders","MFM Georgia Oasis of Grace","MFM Revival & Solution Center","MFM Tulsa","MFM Nashville","MFM Mega Region 2 Youth Church"];
export const VISITORS = 'Visitors & friends';
const CAP = { daily: 1500, word: 400, quiz: 2000, kids: 1500, blitz: 9000, connect: 800, wheel: 2600, dverse: 600, whoami: 2500, build: 2500, pairs: 1000 };
const FIRST_ONLY = { daily: 1, word: 1, connect: 1, dverse: 1, wheel: 1 };
// most points one right answer / found item can earn (word and dverse are one-puzzle games, checked by CAP only)
const PER = { daily: 150, quiz: 200, kids: 150, blitz: 150, connect: 200, wheel: 150, whoami: 500, build: 500, pairs: 100 };
const EXTRA = { wheel: 100 };   // bonus words
export const GAME = (m) => ({ daily: 'bquiz', quiz: 'bquiz', kids: 'bquiz', blitz: 'bquiz' }[m] || m);
export const ORDER = ['connect', 'wheel', 'bquiz', 'dverse', 'word', 'whoami', 'build', 'pairs'];
export const ROT_START = '2026-11-23';   // the Monday the rotation starts (week 1); set to the go-live week
// scores saved before the Game of the Week went live (Nov 27, 2026) keep counting for that first week, whatever the game
export const CUTOVER = Date.parse('2026-11-27T08:30:00Z');
const BAD = /(https?:|www\.|\.(com|net|org)\b|\b(fuck\w*|shit\w*|bitch\w*|nigg\w*|porn\w*|pussy|asshole|bastard|satan\w*|sex\w*)\b)/i;
const ORIGINS = ['https://mfmmegaregion2usa.org', 'https://www.mfmmegaregion2usa.org', 'https://mfmmegaregion2usa.netlify.app'];

function ct(d = new Date()) {
  const p = {}; new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }).formatToParts(d).forEach((x) => { p[x.type] = x.value; });
  return { day: `${p.year}-${p.month}-${p.day}`, dow: { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }[p.weekday] };
}
export function weekOf(d = new Date()) {
  const { day, dow } = ct(d); const t = Date.parse(day + 'T12:00:00Z') - dow * 864e5;
  return new Date(t).toISOString().slice(0, 10);   // the Monday (CT) that starts this week
}
function clean(s, max) { return String(s == null ? '' : s).replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max); }
async function hashId(dev) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('mfm-play:' + dev));
  return [...new Uint8Array(b)].slice(0, 5).map((x) => x.toString(16).padStart(2, '0')).join('');
}
function weekIndex(week) { return Math.max(0, Math.round((Date.parse(week) - Date.parse(ROT_START)) / (7 * 864e5))); }
function prevWeek(week, n = 1) { return new Date(Date.parse(week) - n * 7 * 864e5).toISOString().slice(0, 10); }
export async function playStats(store, week) {
  const per = {};   // game -> device -> set of days
  const { blobs } = await store.list({ prefix: `s/${week}/` });
  for (const b of blobs) {
    const [, , h, day, mode] = b.key.split('/'); const g = GAME(mode);
    ((per[g] = per[g] || {})[h] = per[g][h] || new Set()).add(day);
  }
  const out = {};
  for (const g of Object.keys(per)) { const devs = Object.values(per[g]); out[g] = { players: devs.length, returning: devs.filter((d) => d.size >= 2).length }; }
  return out;
}
export async function gotw(store, week) {
  const saved = await store.get(`gotw/${week}`, { type: 'json' });
  if (saved && saved.g) return saved.g;
  const i = weekIndex(week); let g;
  if (i < ORDER.length) g = ORDER[i];
  else {
    const a = await playStats(store, prevWeek(week)), b = await playStats(store, prevWeek(week, 2));
    const last = await store.get(`gotw/${prevWeek(week)}`, { type: 'json' }), last2 = await store.get(`gotw/${prevWeek(week, 2)}`, { type: 'json' });
    const blocked = last && last2 && last.g === last2.g ? last.g : null;
    const score = (x) => ((a[x] || {}).returning || 0) * 3 + ((b[x] || {}).returning || 0) * 2 + ((a[x] || {}).players || 0) + ((b[x] || {}).players || 0) * 0.5;
    const cands = ORDER.filter((x) => x !== blocked);
    g = cands.reduce((best, x) => (score(x) > score(best) ? x : best), cands[i % cands.length]);
  }
  await store.setJSON(`gotw/${week}`, { g, at: Date.now() });
  return g;
}
function emptyBoard(week, g) { return { week, gotw: g, players: {}, updated: Date.now(), built: 0 }; }
function view(agg) {
  const players = Object.values(agg.players);
  const br = {};
  players.forEach((p) => { const b = br[p.branch] || (br[p.branch] = { name: p.branch, pts: 0, players: 0 }); b.pts += p.pts; b.players += 1; });
  const top = (a) => a.sort((x, y) => y.pts - x.pts || x.name.localeCompare(y.name)).slice(0, 10);
  let nextMon = Date.parse(agg.week + 'T06:00:00Z') + 7 * 864e5;   // Monday 00:00 CT = 06:00 UTC (CST) or 05:00 UTC (CDT)
  if (new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', hour: 'numeric', hour12: false }).format(new Date(nextMon)) === '1') nextMon -= 3600e3;
  return {
    week: agg.week, gotw: agg.gotw, resetsAt: new Date(nextMon).toISOString(), updated: agg.updated,
    totals: { players: players.length, branches: Object.keys(br).length, pts: players.reduce((s, p) => s + p.pts, 0) },
    branches: top(Object.values(br)),
    players: top(players.map((p) => ({ name: p.nick, sub: p.place, pts: p.pts, h: p.h }))),
  };
}
async function rebuild(store, week) {
  const g = await gotw(store, week);
  const agg = emptyBoard(week, g);
  const { blobs } = await store.list({ prefix: `s/${week}/` });
  for (const b of blobs) {
    const s = await store.get(b.key, { type: 'json' }); if (!s || (GAME(s.mode) !== g && !(s.ts && s.ts < CUTOVER))) continue;
    const p = agg.players[s.h] || (agg.players[s.h] = { h: s.h, nick: s.nick, branch: s.branch, place: s.place, pts: 0 });
    p.pts += s.pts; p.nick = s.nick; p.branch = s.branch; p.place = s.place;
  }
  agg.built = Date.now(); agg.updated = Date.now();
  await store.setJSON(`agg/${week}`, agg);
  return agg;
}
async function board(store, week) {
  const agg = await store.get(`agg/${week}`, { type: 'json' });
  if (!agg || !agg.gotw || Date.now() - (agg.built || 0) > 5 * 60e3) return rebuild(store, week);
  return agg;
}
function json(body, status, origin, cache) {
  const h = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache || 'no-store' };
  if (origin && ORIGINS.includes(origin)) { h['Access-Control-Allow-Origin'] = origin; h['Vary'] = 'Origin'; }
  return new Response(JSON.stringify(body), { status, headers: h });
}

export async function handle(req, store, ip = '') {
  const origin = req.headers.get('origin') || '';
  const week = weekOf();
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: { 'Access-Control-Allow-Origin': ORIGINS.includes(origin) ? origin : ORIGINS[0], 'Access-Control-Allow-Methods': 'GET, POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  if (req.method === 'GET') {
    const agg = await board(store, week);
    // short CDN cache: everyone polling at once costs one function run every 10 s
    return json(view(agg), 200, origin, 'public, max-age=0, s-maxage=10, stale-while-revalidate=20');
  }
  if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405, origin);
  if (origin && !ORIGINS.includes(origin) && !/^http:\/\/localhost(:\d+)?$/.test(origin)) return json({ ok: false, error: 'origin' }, 403, origin);
  let b; try { b = await req.json(); } catch (e) { return json({ ok: false, error: 'json' }, 400, origin); }
  const mode = clean(b.mode, 10), dev = clean(b.dev, 40), nick = clean(b.nick, 20), day = ct().day;
  let branch = clean(b.branch, 60), place = clean(b.place, 40);
  const pts = Math.round(Number(b.pts)), score = Math.round(Number(b.score)), n = Math.round(Number(b.n));
  if (!(mode in CAP)) return json({ ok: false, error: 'mode' }, 400, origin);
  if (!/^[a-z0-9]{12,40}$/i.test(dev)) return json({ ok: false, error: 'device' }, 400, origin);
  if (!nick || BAD.test(nick) || BAD.test(place)) return json({ ok: false, error: 'name' }, 400, origin);
  if (!Number.isFinite(pts) || pts < 0 || pts > CAP[mode]) return json({ ok: false, error: 'points' }, 400, origin);
  if (mode !== 'blitz' && mode !== 'word' && (!(n > 0 && n <= 30) || score < 0 || score > n)) return json({ ok: false, error: 'score' }, 400, origin);
  if (PER[mode] && pts > Math.max(0, score) * PER[mode] + (EXTRA[mode] || 0)) return json({ ok: false, error: 'score' }, 400, origin);   // points per right answer are capped
  if (branch === 'Other / visiting' || branch === VISITORS) { branch = VISITORS; if (!place) place = 'Visiting'; }
  else if (!BRANCHES.includes(branch)) return json({ ok: false, error: 'branch' }, 400, origin);
  else place = branch;
  // rate limit: 40 scores per hour per connection
  const hour = new Date().toISOString().slice(0, 13), rk = `rl/${hour}/${(await hashId(ip || 'none')).slice(0, 8)}`;
  const rl = (await store.get(rk, { type: 'json' })) || { c: 0 };
  if (rl.c >= 40) return json({ ok: false, error: 'slow down' }, 429, origin);
  await store.setJSON(rk, { c: rl.c + 1 });
  const h = await hashId(dev), key = `s/${week}/${h}/${day}/${mode}`;
  const prev = await store.get(key, { type: 'json' });
  let counted = false, featured = false;
  if (!prev || (!FIRST_ONLY[mode] && pts > prev.pts)) {
    const rec = { h, nick, branch, place, mode, pts, day, ts: Date.now() };
    const agg = await board(store, week);   // read (or rebuild) the board BEFORE adding this score, so it is never counted twice
    await store.setJSON(key, rec);          // stored for every game: the play stats use it
    featured = GAME(mode) === agg.gotw;
    if (featured) {
    const p = agg.players[h] || (agg.players[h] = { h, nick, branch, place, pts: 0 });
    p.pts += pts - (prev ? prev.pts : 0); p.nick = nick; p.branch = branch; p.place = place;
    agg.updated = Date.now();
    await store.setJSON(`agg/${week}`, agg);
    counted = true;
    }
  }
  const reason = counted ? '' : prev && !featured && (FIRST_ONLY[mode] || pts <= prev.pts) ? (FIRST_ONLY[mode] ? 'first play of the day already counted' : 'your best today is higher') : !featured ? 'only the Game of the Week counts this week' : (FIRST_ONLY[mode] ? 'first play of the day already counted' : 'your best today is higher');
  return json({ ok: true, counted, reason, h }, 200, origin);
}

export default async (req, context) => {
  const store = getStore({ name: 'play-leaderboard', consistency: 'strong' });
  try { return await handle(req, store, (context && context.ip) || req.headers.get('x-nf-client-connection-ip') || ''); }
  catch (e) { return json({ ok: false, error: 'server' }, 500, req.headers.get('origin') || ''); }
};
