/* Game of the Week + game names, shared by /play (js/games.js) and the homepage card (Dawn, 2026-11-27) */
(function () {
  var ICON = {
    bquiz: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="22" class="w"/><path d="M25 25a7 7 0 1 1 10 6.3c-2 1-3 2.4-3 4.7v1" class="s3"/><circle cx="32" cy="44" r="2.6" class="d"/><circle cx="50" cy="14" r="5" class="f"/></svg>',
    word: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="14" width="14" height="14" rx="3" class="w"/><rect x="25" y="14" width="14" height="14" rx="3" class="f"/><rect x="42" y="14" width="14" height="14" rx="3" class="w"/><rect x="8" y="34" width="14" height="14" rx="3" class="o"/><rect x="25" y="34" width="14" height="14" rx="3" class="w"/><rect x="42" y="34" width="14" height="14" rx="3" class="f"/></svg>',
    connect: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="8" width="22" height="10" rx="3" class="f"/><rect x="34" y="8" width="22" height="10" rx="3" class="f"/><rect x="8" y="22" width="22" height="10" rx="3" class="w"/><rect x="34" y="22" width="22" height="10" rx="3" class="w2"/><rect x="8" y="36" width="22" height="10" rx="3" class="w2"/><rect x="34" y="36" width="22" height="10" rx="3" class="w"/><rect x="8" y="50" width="48" height="8" rx="3" class="o"/></svg>',
    wheel: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="34" r="22" class="w"/><circle cx="32" cy="18" r="6" class="f"/><circle cx="47" cy="29" r="6" class="f"/><circle cx="42" cy="47" r="6" class="d"/><circle cx="22" cy="47" r="6" class="d"/><circle cx="17" cy="29" r="6" class="f"/><path d="M32 18 47 29 42 47" class="s2"/></svg>',
    dverse: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 14c8-3 16-2 22 3 6-5 14-6 22-3v36c-8-3-16-2-22 3-6-5-14-6-22-3Z" class="w"/><path d="M32 17v36" class="s2"/><circle cx="46" cy="44" r="9" class="f"/><path d="M46 39v5l3 2" class="s2"/></svg>',
    whoami: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="24" r="12" class="w"/><path d="M12 56c0-11 9-18 20-18s20 7 20 18Z" class="w"/><path d="M28 21a4 4 0 1 1 5.7 3.6c-1 .5-1.7 1.3-1.7 2.4" class="s3"/><circle cx="32" cy="31" r="1.8" class="d"/><circle cx="50" cy="12" r="5" class="f"/></svg>',
    build: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="10" width="30" height="11" rx="3" class="w"/><rect x="26" y="26" width="30" height="11" rx="3" class="f"/><rect x="8" y="42" width="22" height="11" rx="3" class="w2"/><rect x="34" y="42" width="22" height="11" rx="3" class="o"/></svg>',
    imposter: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="18" cy="26" r="8" class="w"/><circle cx="46" cy="26" r="8" class="w"/><circle cx="32" cy="20" r="9" class="f"/><path d="M4 54c0-9 6-15 14-15s14 6 14 15ZM32 54c0-9 6-15 14-15s14 6 14 15Z" class="w"/><path d="M18 56c0-10 6-17 14-17s14 7 14 17Z" class="f"/><path d="M28 19h8" class="s2"/></svg>',
    charades: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="16" y="6" width="32" height="20" rx="4" class="f"/><circle cx="32" cy="38" r="10" class="w"/><path d="M14 60c0-9 8-14 18-14s18 5 18 14Z" class="w"/><path d="M8 30l6 4M56 30l-6 4" class="s"/></svg>',
    pairs: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M6 40h52l-6 12H12Z" class="w"/><path d="M14 40V26h36v14" class="w2"/><path d="M22 26l10-10 10 10" class="f"/><circle cx="24" cy="33" r="3" class="d"/><circle cx="40" cy="33" r="3" class="d"/></svg>'
  };
  var G = {
    bquiz: { name: 'Quiz', line: 'Daily 10, a fresh quiz, a 60-second speed round, kids questions or a team battle. Questions from the Bible, MFM and our pastors\u2019 books.', badges: ['Daily', 'Solo', 'Teams'], lb: 1 },
    word: { name: 'Word of the Day', line: 'Guess the Bible word in six tries, then read the verse it comes from.', badges: ['Daily', 'Solo'], lb: 1 },
    connect: { name: 'Connections', line: '16 words, 4 hidden groups from the Bible and the ministry. Find them with 4 mistakes or fewer.', badges: ['Daily', 'Solo', 'Teams'], lb: 1, team: 1 },
    wheel: { name: 'Word Connect', line: 'Swipe the letters to make words and unlock a verse.', badges: ['Daily', 'Solo', 'Teams'], lb: 1, team: 1 },
    dverse: { name: 'Daily Verse', line: 'Read today’s verse and find where it is: the book, then the chapter, in 5 tries.', badges: ['Daily', 'Solo', 'Teams'], lb: 1, team: 1 },
    whoami: { name: 'Who Am I?', line: 'Clues about a Bible person, one at a time. The fewer you need, the more you score.', badges: ['Solo', 'Teams'], lb: 1, team: 1 },
    build: { name: 'Verse Builder', line: 'A verse in pieces. Put it back in order against the clock.', badges: ['Solo', 'Teams'], lb: 1, team: 1 },
    imposter: { name: 'Imposter', line: 'Everyone sees the same secret word except one. Give clues, then find the imposter.', badges: ['Group', '3+ players'], group: 1 },
    charades: { name: 'Charades', line: 'Phone on your forehead. Your team acts it out. Guess as many as you can in 60 seconds.', badges: ['Group', 'Teams'], group: 1 },
    pairs: { name: 'Noah’s Pairs', line: 'Find the animals two by two. Made for children, fun for everyone.', badges: ['Kids', 'Solo', 'Teams'], lb: 1, team: 1 }
  };
  var COL = { bquiz: ['#2c63d6', '#1d46a6'], word: ['#1f9d63', '#127046'], connect: ['#8a5cc7', '#5c3797'], wheel: ['#e2511f', '#a3330e'], dverse: ['#c48a1f', '#86590f'], whoami: ['#11908f', '#0a5e5d'], build: ['#d6336c', '#9a1d4a'], imposter: ['#44557a', '#232d46'], charades: ['#ff8a3d', '#c9501a'], pairs: ['#3fa34d', '#246f30'] };
  /* weeks 1-8: each scorable game gets one turn; after that the server picks from play stats (netlify/functions/leaderboard.mjs uses the same ORDER and ROT_START) */
  var ORDER = ['connect', 'wheel', 'bquiz', 'dverse', 'word', 'whoami', 'build', 'pairs'], ROT_START = '2026-11-23';
  function ct() { var p = {}; new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; }); return p; }
  function monday() { var p = ct(), dow = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }[p.weekday]; return new Date(Date.parse(p.year + '-' + p.month + '-' + p.day + 'T12:00:00Z') - dow * 864e5).toISOString().slice(0, 10); }
  function left() { var p = ct(), dow = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }[p.weekday], h = 24 - (+p.hour % 24) - (+p.minute > 0 ? 1 : 0); var d = 6 - dow; if (h >= 24) { h -= 24; d++; } return d > 0 ? d + 'd ' + h + 'h' : h + 'h'; }
  var W = window.GOTW = { ICON: ICON, G: G, COL: COL, ORDER: ORDER, ROT_START: ROT_START, server: null, monday: monday, left: left,
    id: function () { if (W.server && G[W.server]) return W.server; var i = Math.max(0, Math.round((Date.parse(monday()) - Date.parse(ROT_START)) / (7 * 864e5))); return ORDER[i % ORDER.length]; },
    href: function (id) { return (/\.html$/.test(location.pathname) || location.protocol === 'file:' ? 'play.html' : '/play') + '?play=' + id; } };
  /* homepage card */
  function paint() {
    var card = document.querySelector('[data-gw-card]'); if (!card) return;
    var id = W.id(), g = G[id], c = COL[id];
    card.querySelectorAll('[data-gw-name]').forEach(function (e) { e.textContent = g.name; });
    card.querySelectorAll('[data-gw-line]').forEach(function (e) { e.textContent = g.line; });
    card.querySelectorAll('[data-gw-left]').forEach(function (e) { e.textContent = left(); });
    card.querySelectorAll('[data-gw-ico]').forEach(function (e) { e.innerHTML = ICON[id]; e.style.setProperty('--c', c[0]); e.style.setProperty('--c2', c[1]); });
    card.querySelectorAll('[data-gw-play]').forEach(function (a) { a.setAttribute('href', W.href(id)); });
  }
  W.paint = paint;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paint); else paint();
})();
