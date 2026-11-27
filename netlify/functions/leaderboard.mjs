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
// Rules (checked here, not in the browser):
//   - Daily 10 and Word of the Day: only the first play of the day counts.
//   - Quiz, Kids and Blitz: the best score of the day per game type counts.
//   - Team Battle never counts (one phone, several people).
//   - Points are capped per game type, names are cleaned, branches must be on the list
//     ("Other / visiting" counts as "Visitors & friends"), 40 scores per hour per connection.
import { getStore } from '@netlify/blobs';

export const BRANCHES = ["MFM USA Prayer City","MFM Rehoboth","MFM Revival Chapel","MFM Houston 2","MFM Houston 3 — City of Refuge","MFM Houston 5 — New Glory","MFM 7 North Houston","MFM Greater Grace","MFM Northwest Houston","MFM Dallas","MFM House of His Glory","MFM Arlington","MFM Arlington — Matlock","MFM Grand Prairie","MFM Irving","MFM Mansfield","MFM The Lord Has Spoken","MFM San Antonio","MFM Pearland — Shadow of God","MFM Sugar Land","MFM Huntsville","MFM Tampa","MFM Broward","MFM Miami — Mount Zion","MFM Orlando — Citadel of Solution","MFM Tallahassee","MFM Revival Center","MFM Riverdale","MFM Citadel of Signs & Wonders","MFM Georgia Oasis of Grace","MFM Revival & Solution Center","MFM Tulsa","MFM Nashville","MFM Mega Region 2 Youth Church"];
export const VISITORS = 'Visitors & friends';
const CAP = { daily: 1500, word: 400, quiz: 1500, kids: 1500, blitz: 9000 };
const FIRST_ONLY = { daily: 1, word: 1 };
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
function emptyBoard(week) { return { week, players: {}, updated: Date.now(), built: 0 }; }
function view(agg) {
  const players = Object.values(agg.players);
  const br = {};
  players.forEach((p) => { const b = br[p.branch] || (br[p.branch] = { name: p.branch, pts: 0, players: 0 }); b.pts += p.pts; b.players += 1; });
  const top = (a) => a.sort((x, y) => y.pts - x.pts || x.name.localeCompare(y.name)).slice(0, 10);
  let nextMon = Date.parse(agg.week + 'T06:00:00Z') + 7 * 864e5;   // Monday 00:00 CT = 06:00 UTC (CST) or 05:00 UTC (CDT)
  if (new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', hour: 'numeric', hour12: false }).format(new Date(nextMon)) === '1') nextMon -= 3600e3;
  return {
    week: agg.week, resetsAt: new Date(nextMon).toISOString(), updated: agg.updated,
    totals: { players: players.length, branches: Object.keys(br).length, pts: players.reduce((s, p) => s + p.pts, 0) },
    branches: top(Object.values(br)),
    players: top(players.map((p) => ({ name: p.nick, sub: p.place, pts: p.pts, h: p.h }))),
  };
}
async function rebuild(store, week) {
  const agg = emptyBoard(week);
  const { blobs } = await store.list({ prefix: `s/${week}/` });
  for (const b of blobs) {
    const s = await store.get(b.key, { type: 'json' }); if (!s) continue;
    const p = agg.players[s.h] || (agg.players[s.h] = { h: s.h, nick: s.nick, branch: s.branch, place: s.place, pts: 0 });
    p.pts += s.pts; p.nick = s.nick; p.branch = s.branch; p.place = s.place;
  }
  agg.built = Date.now(); agg.updated = Date.now();
  await store.setJSON(`agg/${week}`, agg);
  return agg;
}
async function board(store, week) {
  const agg = await store.get(`agg/${week}`, { type: 'json' });
  if (!agg || Date.now() - (agg.built || 0) > 5 * 60e3) return rebuild(store, week);
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
  if (mode !== 'blitz' && mode !== 'word' && (!(n > 0 && n <= 20) || score < 0 || score > n)) return json({ ok: false, error: 'score' }, 400, origin);
  if (mode !== 'word' && pts > Math.max(0, score) * 150) return json({ ok: false, error: 'score' }, 400, origin);   // at most 150 points per right answer
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
  let counted = false;
  if (!prev || (!FIRST_ONLY[mode] && pts > prev.pts)) {
    const rec = { h, nick, branch, place, mode, pts, day, ts: Date.now() };
    const agg = await board(store, week);   // read (or rebuild) the board BEFORE adding this score, so it is never counted twice
    await store.setJSON(key, rec);
    const p = agg.players[h] || (agg.players[h] = { h, nick, branch, place, pts: 0 });
    p.pts += pts - (prev ? prev.pts : 0); p.nick = nick; p.branch = branch; p.place = place;
    agg.updated = Date.now();
    await store.setJSON(`agg/${week}`, agg);
    counted = true;
  }
  return json({ ok: true, counted, reason: counted ? '' : (FIRST_ONLY[mode] ? 'first play of the day already counted' : 'your best today is higher'), h }, 200, origin);
}

export default async (req, context) => {
  const store = getStore({ name: 'play-leaderboard', consistency: 'strong' });
  try { return await handle(req, store, (context && context.ip) || req.headers.get('x-nf-client-connection-ip') || ''); }
  catch (e) { return json({ ok: false, error: 'server' }, 500, req.headers.get('origin') || ''); }
};
