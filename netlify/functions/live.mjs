// netlify/functions/live.mjs — Play & Grow LIVE ROOMS (Dawn, 2026-11-27)
//
// A live room is Kahoot-style: one person opens a room and picks a game; everyone else joins on their OWN phone
// (code, QR or link), from the same hall or from another city. Teams are optional; the first person to start a team
// names it (the captain). Everyone gets the same question at the same moment; faster right answers score more.
// Questions are OURS: the server picks them from the site's own checked question bank (js/quiz/*.json and
// js/games/whoami.json). The host only chooses the game, the level and how many; nobody can type or send questions.
// Live rooms do not count on the weekly leaderboard (a room can be opened alone and replayed).
//
//   GET  /.netlify/functions/live?r=CODE&p=PID     → the room as this player sees it right now
//   POST /.netlify/functions/live   { act, ... }   → create | join | start | restart | end | answer
//
// Storage: Netlify Blobs store "play-live". Every write is its own key, so players never overwrite each other:
//   r/<CODE>/m                                   room (questions, settings, host token, timing)
//   r/<CODE>/p/<pid>~<joinedMs>~<name>~<team>    a player (name and team base64url; joinedMs from room creation)
//   r/<CODE>/a/<gen>/<q>/<pid>~<choice>~<ms>     an answer (ms from room creation)
// One GET = one read + one list. The timeline is worked out from those keys: a question ends when its time runs out
// or when everyone who was in the room at its start has answered, then the answer is shown for REVEAL_MS.
import { getStore } from '@netlify/blobs';

const CH = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const Q_MS = { quiz: 20000, whoami: 30000 };
export const REVEAL_MS = 8000, LEAD_MS = 4000;
const MAX_PLAYERS = 80, MAX_Q = 15, MAX_TEAMS = 6, TTL = 8 * 3600e3;
const b64 = (s) => Buffer.from(String(s), 'utf8').toString('base64url');
const unb = (s) => { try { return Buffer.from(s, 'base64url').toString('utf8'); } catch (e) { return ''; } };
const clean = (s, n) => String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, n);
const rnd = (n, ch) => { const a = new Uint8Array(n); crypto.getRandomValues(a); let s = ''; for (const v of a) s += ch[v % ch.length]; return s; };
const json = (o, st = 200) => new Response(JSON.stringify(o), { status: st, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const okPid = (p) => /^[a-z0-9]{12,32}$/.test(String(p || ''));
const okCode = (c) => new RegExp('^[' + CH + ']{5}$').test(String(c || ''));

/* ---------- our question bank ---------- */
const BANKS = {};
async function bankFile(path, load) { if (!BANKS[path]) BANKS[path] = load(path).catch((e) => { delete BANKS[path]; throw e; }); return BANKS[path]; }
const shuffle = (a) => { a = a.slice(); const r = new Uint32Array(a.length); crypto.getRandomValues(r); for (let i = a.length - 1; i > 0; i--) { const j = r[i] % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const LEVELS = { easy: ['easy'], normal: ['easy', 'medium', 'medium'], hard: ['medium', 'hard', 'hard'] };
export async function pickQs(game, n, level, load) {
  n = [5, 10, 15].includes(+n) ? +n : 10;
  if (game === 'whoami') {
    const d = await bankFile('/js/games/whoami.json', load);
    const people = d.filter((p) => p && p.n && Array.isArray(p.c) && p.c.length >= 3);
    return shuffle(people).slice(0, n).map((p) => {
      const o = shuffle([p.n, ...shuffle(people.filter((x) => x.n !== p.n)).slice(0, 3).map((x) => x.n)]), cl = p.c.slice(0, 5);
      return { q: 'Who am I?', o, a: o.indexOf(p.n), c: cl.map((c) => c[0]), x: 'Clues from ' + cl.map((c) => c[1]).join('; ') + ' (KJV).' };
    });
  }
  let pool;
  if (level === 'kids') pool = await bankFile('/js/quiz/kids.json', load);
  else {
    const lv = LEVELS[level] || LEVELS.normal, all = await Promise.all(['bible', 'who', 'verse'].map((p) => bankFile('/js/quiz/' + p + '.json', load)));
    pool = all.flat().filter((q) => lv.includes(q.level));
  }
  return shuffle(pool.filter((q) => q && q.q && Array.isArray(q.options) && q.options.length >= 2 && q.options.length <= 4)).slice(0, n).map((q) => {
    const ord = shuffle(q.options.map((_, i) => i));
    return { q: q.q, o: ord.map((i) => q.options[i]), a: ord.indexOf(q.answer), x: q.explain || '' };
  });
}

function cleanQs(qs, game) {
  if (!Array.isArray(qs) || !qs.length || qs.length > MAX_Q) return null;
  const out = [];
  for (const q of qs) {
    const o = Array.isArray(q && q.o) ? q.o.map((x) => clean(x, 120)).filter(Boolean) : [];
    const a = +q.a;
    if (o.length < 2 || o.length > 4 || !(a >= 0 && a < o.length) || a !== Math.floor(a)) return null;
    const item = { q: clean(q.q, 400), o, a, x: clean(q.x, 300) };
    if (game === 'whoami') { item.c = (Array.isArray(q.c) ? q.c : []).map((x) => clean(x, 220)).filter(Boolean).slice(0, 6); if (!item.c.length) return null; }
    else if (!item.q) return null;
    out.push(item);
  }
  return out;
}

export function parse(keys, code) {
  const R = 'r/' + code + '/', players = new Map(), answers = [];
  for (const k of keys) {
    if (!k.startsWith(R)) continue;
    const rest = k.slice(R.length);
    if (rest.startsWith('p/')) {
      const [pid, j, n, t, tv] = rest.slice(2).split('~');
      const prev = players.get(pid), joined = +j || 0;
      if (!prev || joined > prev.joined) players.set(pid, { pid, joined, name: unb(n || ''), team: unb(t || ''), tv: tv === 'tv', key: k });
    } else if (rest.startsWith('a/')) {
      const [gen, q, tail] = rest.slice(2).split('/');
      if (!tail) continue;
      const [pid, c, ms] = tail.split('~');
      answers.push({ gen: +gen, q: +q, pid, c: +c, ms: +ms });
    }
  }
  return { players: [...players.values()], answers };
}

// timeline for the current game: [{start,end,revEnd}] in ms from room creation; first answer per player per question counts
export function timeline(m, players, answers) {
  const dur = Q_MS[m.game] || Q_MS.quiz, out = [];
  if (m.startAt == null) return out;
  const first = new Map();
  for (const a of answers) {
    if (a.gen !== m.gen) continue;
    const k = a.q + '|' + a.pid, p = first.get(k);
    if (!p || a.ms < p.ms) first.set(k, a);
  }
  let t = m.startAt;
  for (let i = 0; i < m.qs.length; i++) {
    const start = t, elig = players.filter((p) => p.joined <= start && !p.tv);
    let end = start + dur;
    const got = [];
    for (const p of elig) { const a = first.get(i + '|' + p.pid); if (a && a.ms >= start && a.ms <= start + dur) got.push(a); }
    if (elig.length && got.length >= elig.length) end = Math.min(end, Math.max(...got.map((a) => a.ms)) + 600);
    out.push({ start, end, revEnd: end + REVEAL_MS });
    t = end + REVEAL_MS;
  }
  out.first = first;
  return out;
}

export const points = (ok, msIn, dur) => (ok ? 500 + Math.round(500 * Math.max(0, 1 - msIn / dur)) : 0);

export function scores(m, players, tl) {
  const dur = Q_MS[m.game] || Q_MS.quiz, sc = new Map(players.map((p) => [p.pid, { total: 0, right: 0, last: null }]));
  tl.forEach((w, i) => {
    for (const p of players) {
      const a = tl.first.get(i + '|' + p.pid), s = sc.get(p.pid);
      if (!a || a.ms < w.start || a.ms > w.end) continue;
      const ok = a.c === m.qs[i].a, pts = points(ok, a.ms - w.start, dur);
      s.total += pts; if (ok) s.right++; s.byQ = s.byQ || {}; s.byQ[i] = { c: a.c, ok, pts };
    }
  });
  return sc;
}

export function view(m, keys, now, pid) {
  const { players, answers } = parse(keys, m.code);
  const tl = timeline(m, players, answers), sc = scores(m, players, tl), rel = now - m.created;
  let phase = 'lobby', qi = -1, w = null;
  if (m.ended) phase = 'ended';
  else if (m.startAt != null) {
    if (rel < m.startAt) phase = 'count';
    else { phase = 'final'; for (let i = 0; i < tl.length; i++) if (rel < tl[i].revEnd) { qi = i; w = tl[i]; phase = rel < tl[i].end ? 'q' : 'reveal'; break; } }
    if (phase === 'final') qi = m.qs.length - 1;
  }
  const list = players.filter((p) => !p.tv).map((p) => ({ name: p.name, team: p.team, score: sc.get(p.pid).total, right: sc.get(p.pid).right, me: p.pid === pid, pid: p.pid }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  let rank = 0, prev = null;
  list.forEach((p, i) => { if (p.score !== prev) { rank = i + 1; prev = p.score; } p.rank = rank; });
  const teams = [];
  if (m.teams) {
    const g = new Map();
    for (const p of list) { if (!p.team) continue; const t = g.get(p.team) || { name: p.team, n: 0, sum: 0 }; t.n++; t.sum += p.score; g.set(p.team, t); }
    for (const t of g.values()) teams.push({ name: t.name, n: t.n, score: Math.round(t.sum / t.n) });
    teams.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  }
  const meP = players.find((p) => p.pid === pid), mine = meP ? sc.get(pid) : null;
  const o = { ok: true, now, code: m.code, game: m.game, level: m.level || '', teams: !!m.teams, gen: m.gen, phase, qi, n: m.qs.length, dur: Q_MS[m.game] || Q_MS.quiz, reveal: REVEAL_MS,
    hostName: m.hostName || '', players: list.map(({ pid: _p, ...r }) => r), teamList: teams, nPlayers: list.length };
  if (m.startAt != null) o.startIn = m.startAt - rel;
  if (w) { o.qStart = w.start - rel; o.qEnd = w.end - rel; o.revEnd = w.revEnd - rel; }
  if (phase === 'q' || phase === 'reveal') {
    const Q = m.qs[qi];
    o.q = { q: Q.q, o: Q.o, c: Q.c || null };
    const elig = players.filter((p) => p.joined <= w.start && !p.tv);
    o.answered = elig.filter((p) => { const a = tl.first.get(qi + '|' + p.pid); return a && a.ms >= w.start && a.ms <= w.end; }).length;
    o.eligible = elig.length;
    if (phase === 'reveal') {
      o.q.a = Q.a; o.q.x = Q.x;
      o.dist = Q.o.map(() => 0);
      for (const p of elig) { const a = tl.first.get(qi + '|' + p.pid); if (a && a.ms >= w.start && a.ms <= w.end && o.dist[a.c] != null) o.dist[a.c]++; }
    }
  }
  if (phase === 'final' && m.qs.length) o.lastA = { a: m.qs[m.qs.length - 1].a };
  if (meP) {
    const r = list.find((p) => p.me);
    o.me = { name: meP.name, team: meP.team, tv: !!meP.tv, score: mine.total, right: mine.right, rank: r ? r.rank : null };
    if (qi >= 0 && mine.byQ && mine.byQ[qi]) o.me.ans = (phase === 'q') ? { c: mine.byQ[qi].c } : mine.byQ[qi];
  }
  return o;
}

async function keysOf(store, code) { const r = await store.list({ prefix: 'r/' + code + '/' }); return (r.blobs || []).map((b) => b.key); }

export async function handle(req, store, opt = {}) {
  const load = opt.load || ((path) => fetch(new URL(path, req.url)).then((r) => { if (!r.ok) throw new Error('bank ' + r.status); return r.json(); }));
  const now = Date.now();
  if (req.method === 'GET') {
    const u = new URL(req.url), code = String(u.searchParams.get('r') || '').toUpperCase(), pid = u.searchParams.get('p') || '';
    if (!okCode(code)) return json({ ok: false, reason: 'code' }, 400);
    const m = await store.get('r/' + code + '/m', { type: 'json' });
    if (!m || now - m.created > TTL) return json({ ok: false, reason: 'gone' }, 404);
    return json(view(m, await keysOf(store, code), now, okPid(pid) ? pid : ''));
  }
  if (req.method !== 'POST') return json({ ok: false }, 405);
  let b; try { b = await req.json(); } catch (e) { return json({ ok: false, reason: 'body' }, 400); }
  const act = b.act;
  if (act === 'create') {
    const game = b.game === 'whoami' ? 'whoami' : 'quiz';
    let qs = null; try { qs = cleanQs(await pickQs(game, b.n, b.level, load), game); } catch (e) { qs = null; }
    if (!qs) return json({ ok: false, reason: 'questions' }, 503);
    let code = '';
    for (let i = 0; i < 6; i++) { code = rnd(5, CH); if (!(await store.get('r/' + code + '/m', { type: 'json' }))) break; }
    const host = rnd(24, 'abcdefghijklmnopqrstuvwxyz0123456789');
    const m = { code, host, game, level: game === 'quiz' ? (LEVELS[b.level] || b.level === 'kids' ? b.level : 'normal') : '', teams: !!b.teams, qs, gen: 1, startAt: null, created: now, hostName: clean(b.hostName, 20) };
    await store.setJSON('r/' + code + '/m', m);
    return json({ ok: true, code, host });
  }
  const code = String(b.code || '').toUpperCase();
  if (!okCode(code)) return json({ ok: false, reason: 'code' }, 400);
  const mk = 'r/' + code + '/m', m = await store.get(mk, { type: 'json' });
  if (!m || now - m.created > TTL || m.ended) return json({ ok: false, reason: 'gone' }, 404);
  const rel = now - m.created, isHost = b.host && b.host === m.host;
  if (act === 'join') {
    if (!okPid(b.pid)) return json({ ok: false, reason: 'pid' }, 400);
    const name = clean(b.name, 20), tv = !!b.tv && isHost;
    if (!name && !tv) return json({ ok: false, reason: 'name' }, 400);
    const keys = await keysOf(store, code), { players } = parse(keys, code);
    const others = players.filter((p) => p.pid !== b.pid);
    if (others.length >= MAX_PLAYERS) return json({ ok: false, reason: 'full' }, 409);
    let team = '';
    if (m.teams && !tv) {
      team = clean(b.team, 20);
      if (!team) return json({ ok: false, reason: 'team' }, 400);
      const names = new Map(others.filter((p) => p.team).map((p) => [p.team.toLowerCase(), p.team]));
      if (names.has(team.toLowerCase())) team = names.get(team.toLowerCase());
      else if (names.size >= MAX_TEAMS) return json({ ok: false, reason: 'teams' }, 409);
    }
    if (!tv && others.some((p) => p.name.toLowerCase() === name.toLowerCase())) return json({ ok: false, reason: 'taken' }, 409);
    for (const p of players.filter((p) => p.pid === b.pid)) await store.delete(p.key);
    const key = 'r/' + code + '/p/' + b.pid + '~' + rel + '~' + b64(tv ? '' : name) + '~' + b64(team) + (tv ? '~tv' : '');
    await store.setJSON(key, 1);
    return json({ ok: true, name, team });
  }
  if (act === 'answer') {
    if (!okPid(b.pid)) return json({ ok: false, reason: 'pid' }, 400);
    const keys = await keysOf(store, code), { players, answers } = parse(keys, code), tl = timeline(m, players, answers);
    const qi = +b.q, w = tl[qi], c = +b.c;
    if (!w || rel < w.start || rel > w.end) return json({ ok: false, reason: 'closed' });
    if (!players.some((p) => p.pid === b.pid)) return json({ ok: false, reason: 'notin' }, 403);
    if (!(c >= 0 && c < m.qs[qi].o.length)) return json({ ok: false, reason: 'choice' }, 400);
    if (tl.first.get(qi + '|' + b.pid)) return json({ ok: true, again: true });
    await store.setJSON('r/' + code + '/a/' + m.gen + '/' + qi + '/' + b.pid + '~' + c + '~' + rel, 1);
    return json({ ok: true });
  }
  if (!isHost) return json({ ok: false, reason: 'host' }, 403);
  if (act === 'start') {
    if (m.startAt == null) { m.startAt = rel + LEAD_MS; await store.setJSON(mk, m); }
    return json({ ok: true });
  }
  if (act === 'restart') {
    const game = b.game === 'whoami' ? 'whoami' : 'quiz';
    let qs = null; try { qs = cleanQs(await pickQs(game, b.n, b.level, load), game); } catch (e) { qs = null; }
    if (!qs) return json({ ok: false, reason: 'questions' }, 503);
    Object.assign(m, { game, level: game === 'quiz' ? (LEVELS[b.level] || b.level === 'kids' ? b.level : 'normal') : '', qs, gen: (m.gen || 1) + 1, startAt: null });
    await store.setJSON(mk, m);
    return json({ ok: true });
  }
  if (act === 'end') { m.ended = true; await store.setJSON(mk, m); return json({ ok: true }); }
  return json({ ok: false, reason: 'act' }, 400);
}

export default async (req) => handle(req, getStore({ name: 'play-live', consistency: 'strong' }));
