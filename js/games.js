/* Play & Grow — the ten games (Dawn, 2026-11-27).
   Bible Quiz and Word of the Day live in play2.js; this file adds the other eight, the solo/team choice,
   pass-the-phone team play and the Game of the Week. Content: /js/games/*.json (built by qgen/gen_games.py
   from three KJV texts that must agree). */
(function () {
  var X = window.PG; if (!X) return;
  var esc = X.esc, ls = X.ls, fmt = X.fmt;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var D = {};
  function load(n) { if (D[n]) return Promise.resolve(D[n]); return fetch('/js/games/' + n + '.json', { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw r; return r.json(); }).then(function (d) { D[n] = d; return d; }); }
  function rnd(seed) { return X.rng(String(seed)); }
  function shuffle(a, r) { return X.shuffle(a, r || Math.random); }
  function S() { return X.get(); }
  function today() { return X.ctToday(); }
  var timers = [];
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function every(fn, ms) { var t = setInterval(fn, ms); timers.push(t); return t; }
  function clearAll() { timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); timers = []; }
  X.closers.push(clearAll);

  /* ---------------------------------------------------------------- the ten games */
  var ICON = window.GOTW.ICON;
  var G = window.GOTW.G;
  var HOW = {
    bquiz: ['Choose a way to play: Daily 10, a fresh quiz (Easy, Normal or Challenge), the 60-second speed round, kids questions or a team battle.', 'Answer before the timer runs out. Faster answers earn bonus points.', 'Every answer shows its scripture or source, so you learn as you play.'],
    word: ['Type a 5-letter Bible word and press Enter.', 'Green means the right letter in the right place; yellow means the letter is in the word but somewhere else.', 'You have six tries. Then read the verse the word comes from.'],
    connect: ['16 words hide 4 groups of 4, like four of Jacob\u2019s sons or four mountains.', 'Tap four words you think belong together, then press Submit.', 'Find all four groups. Four wrong guesses and the game ends. Yellow is the easiest group, purple the hardest.'],
    wheel: ['Swipe across the letters to spell a word, or tap them one by one and press Enter.', 'Every word is a word from the Bible. Fill all the spaces to clear the wheel.', 'Stuck? Shuffle the letters or use a hint (it costs 10 points). Extra words earn bonus points.'],
    dverse: ['Read today\u2019s verse.', 'Choose the book and the chapter you think it is from, then press Guess.', 'Each guess tells you to go earlier or later in the Bible, or higher or lower in chapter. After two misses you get a hint. Find it in 5 tries.'],
    whoami: ['Read the first two clues about a Bible person.', 'Tap the name you think it is. Not sure? Take another clue.', 'The fewer clues you need, the more points: 500 with two clues, down to 200. A wrong guess shows the next clue.'],
    build: ['A verse is cut into pieces.', 'Tap the pieces in the right order to build the verse.', 'The faster you build it, and the fewer wrong taps, the more points.'],
    imposter: ['Choose the number of players and pass the phone round. Each player looks at their card alone.', 'Everyone sees the same Bible word except one player: the imposter.', 'Take turns giving a one-word clue, then vote on who the imposter is. If the imposter is caught, they can still win by guessing the word.'],
    charades: ['Split into teams. One player holds the phone on their forehead, screen facing their team.', 'The team acts out or describes the word without saying it. Tap Got it or Pass.', 'Get as many as you can before time runs out. Most words wins.'],
    pairs: ['Tap two cards to turn them over.', 'If the animals match, the pair stays open. If not, they turn back.', 'Find every pair in as few moves as you can. In teams, a match means you go again.']
  };
  X.HOW = HOW;
  function howItems(id) { return '<ol class="gx-how">' + (HOW[id] || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>'; }
  function howList(id) { var seen = (ls('mfm-how') || {})[id]; var seen2 = seen; seen = ls('mfm-how') || {}; seen[id] = 1; ls('mfm-how', seen); return '<details class="gx-hd"' + (seen2 ? '' : ' open') + '><summary>How to play</summary>' + howItems(id) + '</details>'; }
  function helpBtn(id) { return '<button type="button" class="gx-help" data-help="' + id + '" aria-label="How to play ' + esc(G[id].name) + '">?<span>How to play</span></button>'; }
  function showHelp(id) {
    var st = document.getElementById('play-app'); if (!st || st.querySelector('.gx-howbox')) return;
    var box = document.createElement('div'); box.className = 'gx-howbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'How to play ' + G[id].name);
    box.innerHTML = '<div class="gx-howcard"><div class="gx-ico c-' + id + '">' + ICON[id] + '</div><p class="st-k">How to play</p><h2 class="st-h">' + esc(G[id].name) + '</h2>' + howItems(id) + '<button type="button" class="pg-btn gold wide gx-howok">Got it</button></div>';
    st.appendChild(box); var ok = box.querySelector('.gx-howok'); setTimeout(function () { try { ok.focus(); } catch (e) {} }, 30);
    function shut() { box.remove(); } ok.addEventListener('click', shut); box.addEventListener('click', function (e) { if (e.target === box) shut(); });
  }
  function firstHelp(id) { var seen = ls('mfm-how') || {}; if (!seen[id]) setTimeout(function () { showHelp(id); }, 250); }
  document.addEventListener('click', function (e) { var w = e.target.closest && e.target.closest('[data-mode="word"]'); if (w && !(ls('mfm-how') || {}).word) { var tries = 0, iv = setInterval(function () { if (document.querySelector('#play-app .wd-row')) { clearInterval(iv); showHelp('word'); } else if (++tries > 40) clearInterval(iv); }, 150); } });
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('#play-app [data-help]'); if (b) showHelp(b.getAttribute('data-help')); });
  document.addEventListener('keydown', function (e) { if (e.key !== 'Escape') return; var hb = document.querySelector('#play-app .gx-howbox'); if (hb) { e.stopImmediatePropagation(); e.preventDefault(); hb.remove(); } }, true);
  X.GAMES = G; X.ICON = ICON;
  X.gameOf = function (m) { return { daily: 'bquiz', quiz: 'bquiz', kids: 'bquiz', blitz: 'bquiz' }[m] || m; };

  /* ---------------------------------------------------------------- Game of the Week */
  /* weeks 1-8: each scorable game gets one turn; after that the server picks from play stats (see leaderboard.mjs) */
  X.gotwId = function () { window.GOTW.server = X.serverGotw || null; return window.GOTW.id(); };
  X.paintGotw = function () {
    var id = X.gotwId(), g = G[id];
    document.querySelectorAll('[data-gotw-name]').forEach(function (e) { e.textContent = g.name; });
    document.querySelectorAll('[data-gotw-line]').forEach(function (e) { e.textContent = g.line; });
    document.querySelectorAll('[data-gotw-art]').forEach(function (e) { e.innerHTML = ICON[id]; e.className = 'pg-art gw-art c-' + id; });
    document.querySelectorAll('[data-gotw-play]').forEach(function (b) { b.setAttribute('data-mode', id); });
    document.querySelectorAll('.pg-games .pg-tile').forEach(function (t) { var on = t.getAttribute('data-game') === id; t.classList.toggle('is-gotw', on); var tag = t.querySelector('.gw-tag'); if (tag) tag.hidden = !on; });
  };
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-gotw-play]'); if (b && !b.hasAttribute('data-mode')) X.start(X.gotwId()); });
  document.querySelectorAll('[data-ico]').forEach(function (e) { e.innerHTML = ICON[e.getAttribute('data-ico')] || ''; });
  X.paintGotw();

  /* ---------------------------------------------------------------- shared screens */
  function setS(o) { o.ext = true; o.pts = o.pts || 0; X.set(o); }
  function frame(html, extra) { X.frame(html, extra); }
  function bind(sel, fn) { var el = document.querySelector('#play-app ' + sel); if (el) el.addEventListener('click', fn); return el; }
  function bindAll(sel, fn) { document.querySelectorAll('#play-app ' + sel).forEach(function (el) { el.addEventListener('click', function (e) { fn(el, e); }); }); }
  function topPts() { var b = document.querySelector('#play-app .st-pts b'); if (b && S()) b.textContent = fmt(S().pts); }
  function msg(t, cls) { var m = document.querySelector('#play-app .gx-msg'); if (!m) return; m.textContent = t; m.className = 'gx-msg show' + (cls ? ' ' + cls : ''); clearTimeout(m._t); m._t = setTimeout(function () { m.className = 'gx-msg'; }, 1600); }
  function shake(el) { if (!el || reduce) return; el.classList.remove('gx-shake'); void el.offsetWidth; el.classList.add('gx-shake'); }
  function popAt(el, text) { if (!el || reduce) return; var r = el.getBoundingClientRect(), p = document.createElement('span'); p.className = 'st-pop'; p.textContent = text; p.style.left = (r.left + r.width / 2) + 'px'; p.style.top = (r.top) + 'px'; document.getElementById('play-app').appendChild(p); setTimeout(function () { p.remove(); }, 1100); }
  function withPlayer(go) { if (!X.player()) X.showWho(go); else go(); }
  function ensureOpen() { X.open(); }

  /* solo or teams */
  function chooser(id, solo, team, soloLabel) {
    var g = G[id]; ensureOpen(); setS({ title: g.name });
    frame('<div class="st-card gx-choose"><div class="gx-ico c-' + id + '">' + ICON[id] + '</div><p class="st-k">' + (X.gotwId() === id ? 'Game of the Week' : 'Play &amp; Grow') + '</p><h2 class="st-h">' + esc(g.name) + '</h2><p class="st-fine">' + esc(g.line) + '</p>' + '' + howList(id) +
      '<div class="gx-modes"><button type="button" class="gx-mode" data-m="solo"><b>' + (soloLabel || 'Play solo') + '</b><small>' + (g.lb ? 'Your score counts for your branch' + (X.gotwId() === id ? ' this week' : ' when this is the Game of the Week') : 'Just you') + '</small></button>' +
      '<button type="button" class="gx-mode team" data-m="team"><b>Play as teams</b><small>2 to 4 teams pass the phone or play on the TV</small></button></div></div>');
    bind('[data-m=solo]', function () { withPlayer(solo); });
    bind('[data-m=team]', function () { teamSetup(id, team); });
    var seen = ls('mfm-how') || {}; seen[id] = 1; ls('mfm-how', seen);
  }

  /* ---------------------------------------------------------------- team play (pass the phone) */
  function teamSetup(id, round, opts) {
    opts = opts || {}; ensureOpen(); var g = G[id], last = ls('mfm-team2') || { n: 2, names: X.TEAM_NAMES.slice(), per: 2 };
    setS({ title: g.name + ' · Teams' });
    var pers = opts.pers || [1, 2, 3];
    frame('<div class="st-card st-team"><p class="st-k">Team play</p><h2 class="st-h">' + esc(g.name) + '</h2><p class="st-fine">' + (opts.note || 'Teams take turns. Pass the phone, or put it on the TV.') + '</p><form class="st-form" autocomplete="off">' +
      '<fieldset class="tm-n"><legend>How many teams?</legend>' + [2, 3, 4].map(function (k) { return '<label><input type="radio" name="n" value="' + k + '"' + (last.n === k ? ' checked' : '') + '><span>' + k + '</span></label>'; }).join('') + '</fieldset>' +
      '<div class="tm-names">' + [0, 1, 2, 3].map(function (k) { return '<label class="tm-name" style="--tc:' + X.TEAM_COL[k] + '"' + (k >= last.n ? ' hidden' : '') + '><i></i><input name="t' + k + '" maxlength="18" value="' + esc(last.names[k] || X.TEAM_NAMES[k]) + '" aria-label="Team ' + (k + 1) + ' name"></label>'; }).join('') + '</div>' +
      (opts.extra || '') +
      '<fieldset class="tm-n"><legend>' + (opts.perLabel || 'Turns per team') + '</legend>' + pers.map(function (k) { return '<label><input type="radio" name="per" value="' + k + '"' + ((pers.indexOf(last.per) >= 0 ? last.per : pers[1] || pers[0]) === k ? ' checked' : '') + '><span>' + k + '</span></label>'; }).join('') + '</fieldset>' +
      '<button class="pg-btn gold wide xl" type="submit">Start</button></form></div>');
    var f = document.querySelector('#play-app form');
    f.querySelectorAll('input[name=n]').forEach(function (r) { r.addEventListener('change', function () { document.querySelectorAll('#play-app .tm-name').forEach(function (l, k) { l.hidden = k >= +r.value; }); }); });
    if (opts.bind) opts.bind(f);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = +f.querySelector('input[name=n]:checked').value, per = +f.querySelector('input[name=per]:checked').value;
      var names = [0, 1, 2, 3].map(function (k) { return (f['t' + k].value.trim() || X.TEAM_NAMES[k]).slice(0, 18); });
      ls('mfm-team2', { n: n, names: names, per: per });
      var T = { id: id, per: per, turn: 0, opt: opts.read ? opts.read(f) : null, teams: names.slice(0, n).map(function (nm, k) { return { name: nm, col: X.TEAM_COL[k], pts: 0, ok: 0 }; }) };
      if (opts.custom) { opts.custom(T); return; }
      teamNext(T, round);
    });
  }
  function teamBar(T, cur) { return '<div class="tm-bar">' + T.teams.map(function (t, k) { return '<span class="tm-chip' + (k === cur ? ' on' : '') + '" style="--tc:' + t.col + '"><b>' + esc(t.name) + '</b>' + fmt(t.pts) + '</span>'; }).join('') + '</div>'; }
  function teamNext(T, round) {
    if (T.turn >= T.teams.length * T.per) { teamEnd(T, round); return; }
    var k = T.turn % T.teams.length, t = T.teams[k], r = Math.floor(T.turn / T.teams.length) + 1;
    setS({ title: G[T.id].name + ' · Teams', pts: t.pts });
    frame(teamBar(T, k) + '<div class="st-card tm-pass" style="--tc:' + t.col + '"><p class="st-k">Turn ' + r + ' of ' + T.per + '</p><span class="tm-flag" aria-hidden="true"></span><h2 class="st-h">' + esc(t.name) + ', you&rsquo;re up!</h2><p class="st-fine">Pass the phone to ' + esc(t.name) + '. Everyone else, no helping!</p><button type="button" class="pg-btn gold wide xl" data-focus>We&rsquo;re ready</button></div>', 'team');
    bind('.tm-pass .pg-btn', function () {
      round({ team: t, T: T, done: function (pts, ok, note) {
        t.pts += Math.max(0, Math.round(pts || 0)); if (ok) t.ok++; T.turn++;
        var nx = T.turn < T.teams.length * T.per ? T.teams[T.turn % T.teams.length] : null;
        setS({ title: G[T.id].name + ' · Teams', pts: t.pts });
        frame(teamBar(T, -1) + '<div class="st-card gx-between" style="--tc:' + t.col + '"><p class="st-k">' + esc(t.name) + '</p><h2 class="st-h">+' + fmt(Math.round(pts || 0)) + ' points</h2>' + (note ? '<div class="gx-note">' + note + '</div>' : '') +
          '<button type="button" class="pg-btn gold wide xl" data-focus>' + (nx ? 'Next: ' + esc(nx.name) : 'See who won') + '</button></div>', 'team');
        bind('.gx-between .pg-btn', function () { teamNext(T, round); });
      } });
    });
  }
  function teamEnd(T, again) {
    var t = T.teams.slice().sort(function (a, b) { return b.pts - a.pts; }), tie = t[1] && t[0].pts === t[1].pts, top = t[0].pts || 1, g = G[T.id];
    setS({ title: g.name + ' · Teams', pts: t[0].pts });
    var share = 'MFM Play & Grow — ' + g.name + ' (teams)\n' + t.map(function (x, k) { return (k + 1) + '. ' + x.name + ' — ' + fmt(x.pts) + ' pts'; }).join('\n') + '\nPlay with your family: ' + X.SITE + '?play=' + T.id;
    frame('<div class="st-confetti" aria-hidden="true"></div><div class="st-card st-res tm-res"><p class="st-k">' + esc(g.name) + '</p><div class="tm-crown" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 8l4.5 3.5L12 5l4.5 6.5L21 8l-2 10H5Z"/></svg></div><h2 class="st-rank">' + (tie ? 'It&rsquo;s a tie!' : esc(t[0].name) + ' wins!') + '</h2>' +
      '<div class="tm-board">' + t.map(function (x, k) { return '<div class="tm-row" style="--tc:' + x.col + ';--w:' + Math.max(6, Math.round(x.pts / top * 100)) + '%"><b>' + (k + 1) + '</b><span>' + esc(x.name) + '</span><i></i><em>' + fmt(x.pts) + '</em></div>'; }).join('') + '</div>' +
      '<div class="st-acts"><a class="pg-btn green" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(share) + '">Share the result</a><button type="button" class="pg-btn light gx-again">Rematch</button></div><div class="st-acts two"><button type="button" class="pg-btn ghost gx-more">Play another game</button></div></div>', 'done');
    X.confetti();
    bind('.gx-again', function () { T.turn = 0; T.teams.forEach(function (x) { x.pts = 0; x.ok = 0; }); if (T.custom) T.custom(T); else teamNext(T, again); });
    bind('.gx-more', function () { X.close(); X.scrollToId('games'); });
  }

  /* solo results (every game counts on the weekly board; the Game of the Week counts double) */
  function result(o) {
    var s = S(), p = X.player() || {}, id = o.id, g = G[id];
    s.phase = 'r';
    if (o.lb) { s.lb = o.lb; s.added = false; X.addScore(); }
    var isG = X.gotwId() === id;
    var lb = !o.lb ? '' : p.guest ? '<div class="st-lb"><b>Want your points on the leaderboard?</b><button type="button" class="pg-btn light gx-join">Add my name and branch</button></div>'
      : '<div class="st-lb"><span class="st-mini big">' + esc(X.initials(p.nick)) + '</span><span><b>+' + fmt(s.pts) + ' pts for ' + esc(X.placeOf(p)) + '</b><small>' + (isG ? 'Game of the Week: counts double. Adding&hellip;' : 'Adding to this week&rsquo;s leaderboard&hellip;') + '</small></span></div>';
    var link = X.SITE + '?play=' + id;
    var share = 'MFM Play & Grow — ' + (o.shareTitle || g.name) + ': ' + o.shareLine + (o.grid ? '\n' + o.grid : '') + '\n' + (o.daily ? 'Same puzzle for everyone today. ' : '') + 'Can you beat me? ' + link;
    frame('<div class="st-confetti" aria-hidden="true"></div><div class="st-card st-res gx-res"><p class="st-k">' + esc(o.k || g.name) + '</p>' +
      '<div class="gx-big">' + o.big + '</div><h2 class="st-rank">' + esc(o.rank) + '</h2><p class="st-msg">' + esc(o.msg) + '</p>' + (o.extra || '') +
      '<div class="st-tally"><div><b>' + fmt(s.pts) + '</b><small>points</small></div>' + (o.tally || '') + '</div>' + lb +
      '<div class="st-acts"><a class="pg-btn green" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(share) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"/></svg>Challenge a friend</a>' + (o.againLabel ? '<button type="button" class="pg-btn light gx-again">' + o.againLabel + '</button>' : '') + '</div>' +
      (o.daily ? '<p class="st-fine">A new puzzle every day at midnight Central time.</p>' : '') +
      '<div class="st-acts two"><button type="button" class="pg-btn ghost gx-more">Play another game</button><button type="button" class="pg-btn ghost gx-board">See the leaderboard</button></div></div>', 'done');
    if (o.win) X.confetti();
    if (o.again) bind('.gx-again', o.again);
    bind('.gx-more', function () { X.close(); X.scrollToId('games'); });
    bind('.gx-board', function () { X.close(); X.scrollToId('leaderboard'); });
    bind('.gx-join', function () { var keep = S(); X.showWho(function () { X.set(keep); keep.added = false; result(o); }, true); });
  }
  function loadFail() { frame('<div class="st-card st-load"><p>Sorry &mdash; the game didn&rsquo;t load. Check your connection and try again.</p></div>'); }
  function loadingCard() { ensureOpen(); setS({ title: 'Play & Grow' }); frame('<div class="st-card st-load"><span class="st-spin" aria-hidden="true"></span><p>Getting the game ready&hellip;</p></div>'); }
  function seenPick(key, total, n, r) {
    var seen = ls(key) || [], set = {}; seen.forEach(function (i) { set[i] = 1; });
    var all = []; for (var i = 0; i < total; i++) all.push(i);
    var un = shuffle(all.filter(function (i) { return !set[i]; }), r);
    if (un.length < n) { seen = []; un = un.concat(shuffle(all.filter(function (i) { return set[i]; }), r)); }
    var pick = un.slice(0, n); ls(key, seen.concat(pick).slice(-Math.max(n, total - n)));
    return pick;
  }

  /* ================================================================ Bible Quiz (hub for the quiz modes in play2.js) */
  X.games.bquiz = function () {
    ensureOpen(); setS({ title: 'Quiz' });
    var M = [['daily', 'Today&rsquo;s Daily 10', 'Same 10 questions for everyone today'], ['quiz', 'A fresh quiz', '10 new questions from everything. Choose Easy, Normal or Challenge'], ['blitz', '60-second speed round', 'True or false, as many as you can'], ['kids', 'Kids questions', 'Easier questions, more time'], ['team', 'Team battle', '2 to 4 teams on one phone or TV']];
    frame('<div class="st-card gx-choose"><div class="gx-ico c-bquiz">' + ICON.bquiz + '</div><p class="st-k">' + (X.gotwId() === 'bquiz' ? 'Game of the Week' : 'Play &amp; Grow') + '</p><h2 class="st-h">Quiz</h2><p class="st-fine">Every answer shows its scripture or source.</p>' + howList('bquiz') + '<div class="gx-modes">' +
      M.map(function (m) { return '<button type="button" class="gx-mode' + (m[0] === 'team' ? ' team' : '') + '" data-q="' + m[0] + '"><b>' + m[1] + '</b><small>' + m[2] + '</small></button>'; }).join('') + '</div></div>');
    bindAll('[data-q]', function (b) { X.set(null); X.start(b.getAttribute('data-q')); });
  };

  /* ================================================================ Bible Connections */
  var CN_COL = ['', 'l1', 'l2', 'l3', 'l4'], CN_EMO = ['', '🟨', '🟩', '🟦', '🟪'];
  X.games.connect = function () { chooser('connect', function () { cnStart(null); }, function (o) { cnStart(o); }, 'Play today&rsquo;s puzzle'); };
  function cnStart(team, practice) {
    loadingCard();
    load('connect').then(function (d) {
      var day = today(), daily = !team && !practice, idx = daily ? (X.dayNo(day) - 1) % d.p.length : Math.floor(Math.random() * d.p.length), P = d.p[idx];
      var key = 'mfm-cn2-' + day, sv = daily ? ls(key) : null, r = rnd('cn' + day + idx);
      var words = []; P.forEach(function (g, gi) { g[1].forEach(function (w) { words.push({ w: w, g: gi }); }); });
      setS({ title: daily ? 'Connections · #' + X.dayNo(day) : practice ? 'Connections practice' : 'Connections', today: day, practice: !!practice, d: d, P: P, words: shuffle(words, r), found: sv ? sv.found : [], miss: sv ? sv.miss : 0, hist: sv ? sv.hist : [], tried: sv ? sv.tried || [] : [], sel: [], team: team, daily: daily, key: key, n: 4 });
      var s = S(); s.pts = cnPts(s);
      if (sv && sv.done) cnEnd(true); else cnFrame();
    }, loadFail);
  }
  function cnPts(s) { return s.found.length * 150 + (s.found.length === 4 ? (4 - s.miss) * 50 : 0); }
  function cnFrame() {
    var s = S(), d = s.d; s.phase = 'cn';
    var rows = s.found.map(function (gi) { var g = s.P[gi], c = d.cats[g[0]]; return '<div class="cn-found ' + CN_COL[gi + 1] + '"><b>' + esc(c.n) + '</b><span>' + g[1].map(esc).join(', ') + '</span><a href="' + esc(c.u) + '" target="_blank" rel="noopener">' + esc(c.r) + '</a></div>'; }).join('');
    var left = s.words.filter(function (x) { return s.found.indexOf(x.g) < 0; });
    frame((s.team ? teamBar(s.team.T, s.team.T.turn % s.team.T.teams.length) : '') + '<div class="st-card cn">' + helpBtn('connect') + '<p class="st-k">Find four groups of four</p>' + rows +
      '<div class="cn-grid">' + left.map(function (x) { var on = s.sel.indexOf(x.w) >= 0; return '<button type="button" class="cn-w' + (on ? ' on' : '') + (x.w.length > 9 ? ' long' : '') + '" aria-pressed="' + on + '" data-w="' + esc(x.w) + '">' + esc(x.w) + '</button>'; }).join('') + '</div>' +
      '<p class="cn-miss">Mistakes left: ' + [0, 1, 2, 3].map(function (k) { return '<i class="' + (k < 4 - s.miss ? 'on' : '') + '"></i>'; }).join('') + '</p><p class="gx-msg" aria-live="polite"></p>' +
      '<div class="gx-row"><button type="button" class="pg-btn ghost cn-shuf">Shuffle</button><button type="button" class="pg-btn ghost cn-clear"' + (s.sel.length ? '' : ' disabled') + '>Deselect</button><button type="button" class="pg-btn gold cn-go"' + (s.sel.length === 4 ? '' : ' disabled') + '>Submit</button></div></div>', s.team ? 'team' : '');
    fitWords();
    bindAll('.cn-w', function (b) { var w = b.getAttribute('data-w'), i = s.sel.indexOf(w); if (i >= 0) s.sel.splice(i, 1); else if (s.sel.length < 4) s.sel.push(w); cnFrame(); });
    bind('.cn-shuf', function () { s.words = shuffle(s.words); cnFrame(); });
    bind('.cn-clear', function () { s.sel = []; cnFrame(); });
    bind('.cn-go', cnSubmit);
  }
  function fitWords() {
    document.querySelectorAll('#play-app .cn-w').forEach(function (b) { b.style.fontSize = ''; var fs = parseFloat(getComputedStyle(b).fontSize), n = 0; while (b.scrollWidth > b.clientWidth + 1 && fs > 8 && n++ < 20) { fs -= 0.5; b.style.fontSize = fs + 'px'; } });
  }
  function cnSubmit() {
    var s = S(), sig = s.sel.slice().sort().join('|');
    if (s.tried.indexOf(sig) >= 0) { msg('You already tried that one'); return; }
    s.tried.push(sig);
    var gs = s.sel.map(function (w) { return s.words.filter(function (x) { return x.w === w; })[0].g; });
    s.hist.push(gs.map(function (g) { return g + 1; }));
    var cnt = {}; gs.forEach(function (g) { cnt[g] = (cnt[g] || 0) + 1; }); var mx = Math.max.apply(null, Object.keys(cnt).map(function (k) { return cnt[k]; }));
    if (mx === 4) { s.found.push(gs[0]); s.sel = []; s.pts = cnPts(s); topPts(); }
    else { s.miss++; shake(document.querySelector('#play-app .cn-grid')); }
    if (s.daily) ls(s.key, { found: s.found, miss: s.miss, hist: s.hist, tried: s.tried, done: s.found.length === 4 || s.miss >= 4 });
    if (s.found.length === 4 || s.miss >= 4) { later(function () { cnEnd(false); }, reduce ? 0 : 700); return; }
    cnFrame();
    if (mx === 3) msg('One away…'); else if (mx !== 4) msg('Not a group');
  }
  function cnEnd(again) {
    var s = S(), won = s.found.length === 4, d = s.d;
    s.score = s.found.length; s.pts = cnPts(s);
    var all = s.P.map(function (g, gi) { var c = d.cats[g[0]]; return '<div class="cn-found ' + CN_COL[gi + 1] + (s.found.indexOf(gi) < 0 ? ' missed' : '') + '"><b>' + esc(c.n) + '</b><span>' + g[1].map(esc).join(', ') + '</span><a href="' + esc(c.u) + '" target="_blank" rel="noopener">' + esc(c.r) + (/biblegateway/.test(c.u) ? ' (KJV)' : '') + '</a></div>'; }).join('');
    var grid = s.hist.map(function (r) { return r.map(function (l) { return CN_EMO[l]; }).join(''); }).join('\n');
    if (s.team) { s.team.done(s.pts, won, '<div class="cn-all">' + all + '</div>'); return; }
    result({ id: 'connect', k: s.title, lb: again || s.practice ? null : 'connect', daily: !s.practice, win: won, big: '<span class="gx-num">' + s.found.length + '<small>/4</small></span><span class="gx-cap">groups found</span>', rank: won ? (s.miss === 0 ? 'Perfect!' : 'Well done!') : 'So close!', msg: won ? 'You found every group' + (s.miss ? ' with ' + s.miss + (s.miss === 1 ? ' mistake.' : ' mistakes.') : ' with no mistakes.') : 'Here are the four groups.',
      extra: '<div class="cn-all">' + all + '</div>', tally: '<div><b>' + s.miss + '</b><small>mistakes</small></div>', shareLine: s.found.length + '/4', grid: grid, shareTitle: s.title, againLabel: 'Play a practice puzzle', again: function () { cnStart(null, true); } });
  }

  /* ================================================================ Bible Word Connect */
  X.games.wheel = function () { chooser('wheel', function () { whStart(null); }, function (o) { whStart(o); }, 'Play today&rsquo;s 3 wheels'); };
  function whStart(team, practice) {
    loadingCard();
    load('wheel').then(function (d) {
      var day = today(), base = (X.dayNo(day) - 1) * 3, list; d = d.filter(function (w) { return w.k.length <= 6; });   /* Nov 27: shorter words */
      if (team || practice) list = [d[Math.floor(Math.random() * d.length)]];
      else list = [0, 1, 2].map(function (j) { return d[(base + j) % d.length]; });
      setS({ title: team ? 'Word Connect' : practice ? 'Word Connect practice' : 'Word Connect · #' + X.dayNo(day), today: day, list: list, w: 0, team: team, practice: !!practice, totalT: 0, foundT: 0, bonusN: 0, hints: 0 });
      whLevel();
    }, loadFail);
  }
  function whLevel() {
    var s = S(), P = s.list[s.w];
    s.P = P; s.found = []; s.bonus = []; s.cur = []; s.letters = shuffle(P.k.split('')); s.revealed = {}; s.phase = 'wh';
    whFrame();
  }
  function whFrame() {
    var s = S(), P = s.P, n = s.letters.length, R = 38;
    var slots = P.t.map(function (w) { var f = s.found.indexOf(w) >= 0, rv = s.revealed[w] || 0; return '<div class="wh-slot' + (f ? ' f' : '') + '">' + w.split('').map(function (L, i) { return '<span>' + (f || i < rv ? L : '') + '</span>'; }).join('') + '</div>'; }).join('');
    var letters = s.letters.map(function (L, i) { var a = (i / n) * 2 * Math.PI - Math.PI / 2; return '<button type="button" class="wh-l" data-i="' + i + '" style="left:' + (50 + R * Math.cos(a)).toFixed(1) + '%;top:' + (50 + R * Math.sin(a)).toFixed(1) + '%">' + L + '</button>'; }).join('');
    frame((s.team ? teamBar(s.team.T, s.team.T.turn % s.team.T.teams.length) : '') + '<div class="st-card wh">' + helpBtn('wheel') + '<p class="st-k">' + (s.list.length > 1 ? 'Wheel ' + (s.w + 1) + ' of ' + s.list.length : 'Make Bible words') + ' &middot; ' + s.found.length + '/' + P.t.length + ' found' + (s.bonus.length ? ' &middot; ' + s.bonus.length + ' bonus' : '') + '</p>' +
      '<div class="wh-slots">' + slots + '</div><div class="wh-cur" aria-live="polite">' + (s.cur.map(function (i) { return s.letters[i]; }).join('') || '<small>Swipe or tap the letters</small>') + '</div>' +
      '<div class="wh-wheel" aria-label="Letter wheel">' + letters + '<svg class="wh-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points=""/></svg></div><p class="gx-msg" aria-live="polite"></p>' +
      '<div class="gx-row"><button type="button" class="pg-btn ghost wh-shuf">Shuffle</button><button type="button" class="pg-btn ghost wh-hint">Hint</button><button type="button" class="pg-btn ghost wh-del">Clear</button><button type="button" class="pg-btn gold wh-go">Enter</button></div>' +
      '<button type="button" class="st-skip wh-skip">' + (s.list.length > 1 && s.w < s.list.length - 1 ? 'Skip to the next wheel' : 'Finish') + '</button></div>', s.team ? 'team' : '');
    var wheel = document.querySelector('#play-app .wh-wheel'), drag = false, moved = false;
    function line() { var pl = wheel.querySelector('polyline'); pl.setAttribute('points', s.cur.map(function (i) { var b = wheel.querySelector('[data-i="' + i + '"]'); return parseFloat(b.style.left) + ',' + parseFloat(b.style.top); }).join(' ')); wheel.querySelectorAll('.wh-l').forEach(function (b) { b.classList.toggle('on', s.cur.indexOf(+b.dataset.i) >= 0); }); var c = document.querySelector('#play-app .wh-cur'); c.innerHTML = s.cur.map(function (i) { return s.letters[i]; }).join('') || '<small>Swipe or tap the letters</small>'; }
    function add(i) { if (s.cur.indexOf(i) >= 0) { if (s.cur.length > 1 && s.cur[s.cur.length - 2] === i) { s.cur.pop(); line(); } return; } s.cur.push(i); line(); }
    wheel.addEventListener('pointerdown', function (e) { var b = e.target.closest('.wh-l'); if (!b) return; e.preventDefault(); drag = true; moved = false; add(+b.dataset.i); });
    wheel.addEventListener('pointermove', function (e) { if (!drag) return; var el = document.elementFromPoint(e.clientX, e.clientY), b = el && el.closest && el.closest('.wh-l'); if (b && s.cur[s.cur.length - 1] !== +b.dataset.i) { moved = true; add(+b.dataset.i); } });
    function up() { if (!drag) return; drag = false; if (moved && s.cur.length >= 3) whSubmit(); else if (moved) { s.cur = []; line(); } }
    wheel.addEventListener('pointerup', up); wheel.addEventListener('pointercancel', up); wheel.addEventListener('pointerleave', function () { if (drag && moved) up(); });
    bind('.wh-shuf', function () { var w = s.cur.map(function (i) { return s.letters[i]; }); s.letters = shuffle(s.letters); s.cur = []; whFrame(); });
    bind('.wh-del', function () { s.cur = []; line(); });
    bind('.wh-go', function () { if (s.cur.length >= 3) whSubmit(); else msg('Use at least 3 letters'); });
    bind('.wh-hint', function () { var w = s.P.t.filter(function (x) { return s.found.indexOf(x) < 0; })[0]; if (!w) return; var rv = s.revealed[w] || 0; if (rv >= w.length - 1) { msg('No more hints for that word'); return; } s.revealed[w] = rv + 1; s.hints++; s.pts = Math.max(0, s.pts - 10); whFrame(); });
    bind('.wh-skip', function () { whNext(); });
  }
  function whSubmit() {
    var s = S(), w = s.cur.map(function (i) { return s.letters[i]; }).join(''), el = document.querySelector('#play-app .wh-cur');
    s.cur = [];
    if (s.P.t.indexOf(w) >= 0) { if (s.found.indexOf(w) >= 0) { whFrame(); msg('Already found'); return; } s.found.push(w); s.pts += w.length * 20; s.foundT++; whFrame(); popAt(document.querySelector('#play-app .wh-cur'), '+' + (w.length * 20)); topPts(); if (s.found.length === s.P.t.length) later(whNext, reduce ? 0 : 700); return; }
    if (s.P.b.indexOf(w) >= 0) { if (s.bonus.indexOf(w) >= 0) { whFrame(); msg('Already found'); return; } s.bonus.push(w); if (s.bonusN < 10) { s.pts += 10; s.bonusN++; } whFrame(); msg('Bonus word: ' + w + ' +10', 'good'); topPts(); return; }
    whFrame(); shake(document.querySelector('#play-app .wh-cur')); msg('Not in the list');
  }
  function whNext() {
    var s = S(); s.totalT += s.P.t.length; s.done = s.done || []; s.done.push({ P: s.P, found: s.found.length });
    if (s.team) { s.team.done(s.pts, s.found.length === s.P.t.length, whVerse(s.P)); return; }
    if (s.w < s.list.length - 1) { s.w++; whLevel(); return; }
    s.score = s.foundT; s.n = s.totalT;
    var all = s.done.every(function (x) { return x.found === x.P.t.length; });
    result({ id: 'wheel', k: s.title, lb: s.practice ? null : 'wheel', daily: !s.practice, win: all, big: '<span class="gx-num">' + s.foundT + '<small>/' + s.totalT + '</small></span><span class="gx-cap">words found</span>', rank: all ? 'Every word!' : s.foundT >= s.totalT * .7 ? 'Well done!' : 'Good effort!', msg: all ? 'You cleared every wheel.' : 'Here are the verses behind today’s words.',
      extra: s.done.map(function (x) { return whVerse(x.P); }).join(''), tally: '<div><b>' + s.bonus.length + '</b><small>bonus words</small></div>', shareLine: s.foundT + '/' + s.totalT + ' words', againLabel: 'Play another wheel', again: function () { whStart(null, true); } });
  }
  function whVerse(P) { var t = esc(P.v[1]).replace(new RegExp('\\b(' + P.k + ')\\b', 'i'), '<mark>$1</mark>'); return '<blockquote class="wd-verse gx-v">&ldquo;' + t + '&rdquo;<cite>' + esc(P.v[0]) + ' (KJV)</cite></blockquote>'; }
  X.key = function (e) {
    var s = S(); if (!s) return;
    if (s.phase === 'wh' && /^[a-z]$/i.test(e.key)) { var L = e.key.toUpperCase(), i = s.letters.findIndex(function (x, k) { return x === L && s.cur.indexOf(k) < 0; }); if (i >= 0) { s.cur.push(i); var b = document.querySelector('#play-app .wh-l[data-i="' + i + '"]'); if (b) b.classList.add('on'); var c = document.querySelector('#play-app .wh-cur'); if (c) c.textContent = s.cur.map(function (k) { return s.letters[k]; }).join(''); } }
    else if (s.phase === 'wh' && e.key === 'Enter') { e.preventDefault(); if (s.cur.length >= 3) whSubmit(); }
    else if (s.phase === 'wh' && e.key === 'Backspace') { s.cur.pop(); whFrame(); }
    else if (s.phase === 'wa' && /^[1-8]$/.test(e.key)) { var o = document.querySelectorAll('#play-app .wa-o')[+e.key - 1]; if (o && !o.disabled) o.click(); }
  };

  /* ================================================================ Daily Verse */
  X.games.dverse = function () { chooser('dverse', function () { dvStart(null); }, function (o) { dvStart(o); }, 'Play today&rsquo;s verse'); };
  var BOOK_ALIAS = { 'Psalms': 'Psalms' };
  function dvStart(team, practice) {
    loadingCard();
    load('dverse').then(function (d) {
      var day = today(), daily = !team && !practice, idx = daily ? (X.dayNo(day) - 1) % d.verses.length : Math.floor(Math.random() * d.verses.length), v = d.verses[idx];
      var key = 'mfm-dv-' + day, sv = daily ? ls(key) : null;
      setS({ title: daily ? 'Daily Verse · #' + X.dayNo(day) : 'Daily Verse', today: day, d: d, v: v, g: sv ? sv.g : [], done: sv ? sv.done : 0, team: team, daily: daily, key: key, n: 1, b: sv && sv.b != null ? sv.b : -1 });
      if (S().done) dvEnd(true); else dvFrame();
    }, loadFail);
  }
  function dvPart(b) {
    var P = [[5, 'the books of Moses (Genesis to Deuteronomy)'], [17, 'the history books (Joshua to Esther)'], [22, 'the poetry books (Job to Song of Solomon)'], [27, 'the major prophets (Isaiah to Daniel)'], [39, 'the minor prophets (Hosea to Malachi)'],
             [43, 'the Gospels (Matthew to John)'], [44, 'Acts'], [57, 'Paul&rsquo;s letters (Romans to Philemon)'], [65, 'the letters from Hebrews to Jude'], [66, 'Revelation']];
    for (var i = 0; i < P.length; i++) if (b < P[i][0]) return P[i][1];
    return 'the Bible';
  }
  function dvFrame() {
    var s = S(), d = s.d, B = d.books; s.phase = 'dv';
    var rows = s.g.map(function (g) { var bk = g[0] === s.v[1], ch = bk && g[1] === s.v[2];
      var bt = bk ? '<span class="dv-ok">' + esc(B[g[0]]) + '</span>' : '<span class="dv-no">' + esc(B[g[0]]) + ' <em>' + (g[0] < s.v[1] ? 'Later in the Bible &darr;' : 'Earlier in the Bible &uarr;') + '</em></span>';
      var ct = !bk ? '<span class="dv-na">' + g[1] + '</span>' : ch ? '<span class="dv-ok">' + g[1] + '</span>' : '<span class="dv-no">' + g[1] + ' <em>' + (g[1] < s.v[2] ? 'Higher &uarr;' : 'Lower &darr;') + '</em></span>';
      return '<div class="dv-row">' + bt + ct + '</div>'; }).join('');
    var bookOpts = function (from, to, lab) { var o = '<optgroup label="' + lab + '">'; for (var i = from; i < to; i++) o += '<option value="' + i + '"' + (i === s.b ? ' selected' : '') + '>' + esc(B[i]) + '</option>'; return o + '</optgroup>'; };
    var cur = s.b >= 0 ? s.b : 0, known = s.g.some(function (g) { return g[0] === s.v[1]; });
    if (known) cur = s.v[1];
    frame((s.team ? teamBar(s.team.T, s.team.T.turn % s.team.T.teams.length) : '') + '<div class="st-card dv">' + helpBtn('dverse') + '<p class="st-k">Where is this verse? &middot; Try ' + (s.g.length + 1) + ' of 5</p><blockquote class="dv-v">&ldquo;' + esc(s.v[3]) + '&rdquo;</blockquote>' +
      (s.g.length >= 2 && !s.g.some(function (g) { return g[0] === s.v[1]; }) ? '<p class="dv-hint"><b>Hint:</b> it&rsquo;s in ' + dvPart(s.v[1]) + '.</p>' : '') + (rows ? '<div class="dv-rows"><div class="dv-head"><span>Book</span><span>Chapter</span></div>' + rows + '</div>' : '') +
      '<form class="dv-form" autocomplete="off"><label>Book<select name="b">' + bookOpts(0, 39, 'Old Testament') + bookOpts(39, 66, 'New Testament') + '</select></label><label>Chapter<select name="c"></select></label><button class="pg-btn gold" type="submit">Guess</button></form><p class="gx-msg" aria-live="polite"></p></div>', s.team ? 'team' : '');
    var f = document.querySelector('#play-app .dv-form');
    f.b.value = String(cur);
    function fillC() { var n = d.chapters[+f.b.value], o = ''; for (var i = 1; i <= n; i++) o += '<option>' + i + '</option>'; f.c.innerHTML = o; }
    fillC(); f.b.addEventListener('change', function () { s.b = +f.b.value; fillC(); });
    f.addEventListener('submit', function (e) { e.preventDefault(); var g = [+f.b.value, +f.c.value]; if (s.g.some(function (x) { return x[0] === g[0] && x[1] === g[1]; })) { msg('You already tried that'); return; } s.b = g[0]; s.g.push(g); var win = g[0] === s.v[1] && g[1] === s.v[2]; if (win) s.done = 1; else if (s.g.length >= 5) s.done = 2; if (s.daily) ls(s.key, { g: s.g, done: s.done, b: s.b }); if (s.done) { dvFrame(); later(function () { dvEnd(false); }, reduce ? 0 : 600); } else dvFrame(); });
  }
  function dvEnd(again) {
    var s = S(), won = s.done === 1, t = s.g.length, bookFound = s.g.some(function (g) { return g[0] === s.v[1]; });
    s.score = won ? 1 : 0; s.pts = won ? [600, 500, 400, 300, 200][t - 1] : bookFound ? 100 : 0;
    var grid = s.g.map(function (g) { var bk = g[0] === s.v[1]; return (bk ? '🟩' : '🟨') + (bk && g[1] === s.v[2] ? '🟩' : '⬜'); }).join(' ');
    var verse = '<blockquote class="wd-verse gx-v">&ldquo;' + esc(s.v[3]) + '&rdquo;<cite><a target="_blank" rel="noopener" href="https://www.biblegateway.com/passage/?search=' + encodeURIComponent(s.v[0]) + '&version=KJV">' + esc(s.v[0]) + ' (KJV) &rarr;</a></cite></blockquote>';
    if (s.team) { s.team.done(s.pts, won, verse); return; }
    result({ id: 'dverse', k: s.title, lb: again || !s.daily ? null : 'dverse', daily: s.daily, win: won, big: '<span class="gx-ref">' + esc(s.v[0]) + '</span>', rank: won ? ['Glory!', 'Amazing!', 'Excellent!', 'Well done!', 'Phew!'][t - 1] : 'Next time!', msg: won ? 'You found it in ' + t + (t === 1 ? ' try.' : ' tries.') : bookFound ? 'You found the book. The chapter was ' + s.v[2] + '.' : 'Here is where it is.',
      extra: verse, tally: '<div><b>' + t + '/5</b><small>tries</small></div>', shareLine: (won ? t : 'X') + '/5', grid: grid, shareTitle: s.title, againLabel: 'Practice another verse', again: function () { dvStart(null, true); } });
  }

  /* ================================================================ Who Am I? */
  X.games.whoami = function () { chooser('whoami', function () { waStart(null); }, function (o) { waStart(o); }, 'Play 5 people'); };
  function waStart(team) {
    loadingCard();
    load('whoami').then(function (d) {
      var r = Math.random, pick = seenPick('mfm-wa-seen', d.length, team ? 1 : 5, r);
      setS({ title: 'Who Am I?', today: today(), d: d, list: pick, i: 0, team: team, right: 0, n: pick.length, marks: [] });
      waNext();
    }, loadFail);
  }
  function waNext() {
    var s = S(), p = s.d[s.list[s.i]], others = shuffle(s.d.filter(function (x) { return x.n !== p.n; })).slice(0, 7).map(function (x) { return x.n; });
    s.p = p; s.shown = Math.min(2, p.c.length); s.opts = shuffle(others.concat([p.n])); s.wrong = []; s.over = false; s.phase = 'wa';
    waFrame();
  }
  function waStake(s) { return Math.max(0, 700 - s.shown * 100); }   /* two clues to start = 500 */
  function waFrame() {
    var s = S(), p = s.p;
    frame((s.team ? teamBar(s.team.T, s.team.T.turn % s.team.T.teams.length) : '') + '<div class="st-card wa">' + helpBtn('whoami') + '<p class="st-k">' + (s.list.length > 1 ? 'Person ' + (s.i + 1) + ' of ' + s.list.length : 'Who am I?') + (s.over ? '' : ' &middot; worth <b>' + waStake(s) + '</b>') + '</p>' +
      '<ol class="wa-clues">' + p.c.slice(0, s.shown).map(function (c, k) { return '<li class="' + (k === s.shown - 1 && !s.over ? 'new' : '') + '"><span>' + esc(c[0]) + '</span>' + (s.over ? '<a href="' + esc(c[2]) + '" target="_blank" rel="noopener">' + esc(c[1]) + '</a>' : '') + '</li>'; }).join('') + '</ol>' +
      (s.over ? '<div class="wa-ans ' + (s.got ? 'ok' : 'no') + '"><b>' + (s.got ? 'Yes! ' : 'It was ') + esc(p.n) + '</b>' + (s.got ? '<span>+' + s.gain + '</span>' : '') + '</div>' + (s.over && !s.got ? '<ol class="wa-clues rest">' + p.c.slice(s.shown).map(function (c) { return '<li><span>' + esc(c[0]) + '</span><a href="' + esc(c[2]) + '" target="_blank" rel="noopener">' + esc(c[1]) + '</a></li>'; }).join('') + '</ol>' : '') : '') +
      '<div class="wa-opts">' + s.opts.map(function (o) { var bad = s.wrong.indexOf(o) >= 0, good = s.over && o === p.n; return '<button type="button" class="wa-o' + (bad ? ' bad' : '') + (good ? ' good' : '') + '" data-o="' + esc(o) + '"' + (bad || s.over ? ' disabled' : '') + '>' + esc(o) + '</button>'; }).join('') + '</div><p class="gx-msg" aria-live="polite"></p>' +
      (s.over ? '<button type="button" class="pg-btn gold wide wa-next" data-focus>' + (s.i < s.list.length - 1 ? 'Next person' : 'See my score') + '</button>' : '<button type="button" class="pg-btn ghost wa-more"' + (s.shown >= p.c.length ? ' disabled' : '') + '>Next clue (&minus;100)</button>') + '</div>', s.team ? 'team' : '');
    bindAll('.wa-o', function (b) { waGuess(b.getAttribute('data-o')); });
    bind('.wa-more', function () { if (s.shown < p.c.length) { s.shown++; waFrame(); } });
    bind('.wa-next', function () { if (s.team) { s.team.done(s.pts, s.got, '<p class="gx-note-t">It was ' + esc(p.n) + '.</p>'); return; } if (s.i < s.list.length - 1) { s.i++; waNext(); } else waEnd(); });
  }
  function waGuess(o) {
    var s = S();
    if (o === s.p.n) { s.got = true; s.gain = waStake(s); s.pts += s.gain; s.right++; s.marks.push(1); s.over = true; topPts(); waFrame(); return; }
    s.wrong.push(o);
    if (s.shown >= s.p.c.length) { s.got = false; s.gain = 0; s.over = true; s.marks.push(0); waFrame(); return; }
    s.shown++; waFrame(); msg('Not ' + o + '. Here is another clue.');
  }
  function waEnd() {
    var s = S(); s.score = s.right; s.n = s.list.length;
    result({ id: 'whoami', lb: 'whoami', win: s.right >= 4, big: '<span class="gx-num">' + s.right + '<small>/' + s.n + '</small></span><span class="gx-cap">people guessed</span>', rank: s.right === s.n ? 'Bible detective!' : s.right >= 3 ? 'Well done!' : 'Keep reading!', msg: 'Every clue links to its scripture, so you can read the whole story.',
      tally: '', shareLine: s.right + '/' + s.n + ' (' + fmt(s.pts) + ' pts)', againLabel: 'Play again', again: function () { waStart(null); } });
  }

  /* ================================================================ Verse Builder */
  X.games.build = function () { chooser('build', function () { vbStart(null); }, function (o) { vbStart(o); }, 'Build 5 verses'); };
  function vbStart(team) {
    loadingCard();
    load('build').then(function (d) {
      var pick = seenPick('mfm-vb-seen', d.length, team ? 1 : 5, Math.random);
      setS({ title: 'Verse Builder', today: today(), d: d, list: pick, i: 0, team: team, n: pick.length, score: 0, miss: 0 });
      vbNext();
    }, loadFail);
  }
  function vbNext() {
    var s = S(), v = s.d[s.list[s.i]]; s.v = v; s.at = 0; s.mist = 0; s.t0 = Date.now(); s.order = shuffle(v[1].map(function (x, k) { return k; })); s.phase = 'vb';
    if (s.order.every(function (k, i) { return k === i; }) && s.order.length > 1) s.order.reverse();
    vbFrame();
    clearAll(); every(function () { var t = document.querySelector('#play-app .vb-t'); if (t) t.textContent = Math.floor((Date.now() - s.t0) / 1000) + 's'; }, 500);
  }
  function vbFrame(gain) {
    var s = S(), v = s.v;
    frame((s.team ? teamBar(s.team.T, s.team.T.turn % s.team.T.teams.length) : '') + '<div class="st-card vb">' + helpBtn('build') + '<p class="st-k">' + (s.list.length > 1 ? 'Verse ' + (s.i + 1) + ' of ' + s.list.length : 'Build the verse') + ' &middot; <span class="vb-t">' + Math.floor((Date.now() - s.t0) / 1000) + 's</span></p><h2 class="st-h vb-ref">' + esc(v[0]) + '</h2>' +
      '<div class="vb-built">' + (s.at ? v[1].slice(0, s.at).map(function (c) { return '<span>' + esc(c) + '</span>'; }).join(' ') : '<small>Tap the pieces in order</small>') + '</div>' +
      '<div class="vb-pool">' + s.order.map(function (k) { return k < s.at ? '' : '<button type="button" class="vb-p" data-k="' + k + '">' + esc(v[1][k]) + '</button>'; }).join('') + '</div><p class="gx-msg" aria-live="polite"></p>' +
      (s.at >= v[1].length ? '<div class="wa-ans ok"><b>Built!</b><span>+' + gain + '</span></div><button type="button" class="pg-btn gold wide vb-next" data-focus>' + (s.i < s.list.length - 1 ? 'Next verse' : s.team ? 'Done' : 'See my score') + '</button>' : '') + '</div>', s.team ? 'team' : '');
    bindAll('.vb-p', function (b) {
      var k = +b.getAttribute('data-k');
      if (k === s.at) { s.at++; if (s.at >= v[1].length) { clearAll(); var secs = (Date.now() - s.t0) / 1000, g = Math.round(Math.max(100, 500 - secs * 10 - s.mist * 40)); s.pts += g; s.score++; s.miss += s.mist; topPts(); vbFrame(g); } else vbFrame(); }
      else { s.mist++; shake(b); msg('Not that one yet'); }
    });
    bind('.vb-next', function () { if (s.team) { s.team.done(s.pts, true, '<blockquote class="wd-verse gx-v">&ldquo;' + esc(v[1].join(' ')) + '&rdquo;<cite>' + esc(v[0]) + ' (KJV)</cite></blockquote>'); return; } if (s.i < s.list.length - 1) { s.i++; vbNext(); } else vbEnd(); });
  }
  function vbEnd() {
    var s = S();
    result({ id: 'build', lb: 'build', win: s.miss <= 2, big: '<span class="gx-num">' + s.score + '<small>/' + s.n + '</small></span><span class="gx-cap">verses built</span>', rank: s.miss === 0 ? 'Flawless!' : s.miss <= 3 ? 'Well done!' : 'Keep practising!', msg: s.miss ? s.miss + (s.miss === 1 ? ' piece' : ' pieces') + ' out of order. Faster and cleaner means more points.' : 'No mistakes at all.',
      tally: '<div><b>' + s.miss + '</b><small>mistakes</small></div>', shareLine: fmt(s.pts) + ' pts', againLabel: 'Play again', again: function () { vbStart(null); } });
  }

  /* ================================================================ Noah's Pairs */
  var ANIMALS = [['🦁', 'Lion'], ['🐘', 'Elephant'], ['🦒', 'Giraffe'], ['🐑', 'Sheep'], ['🐫', 'Camel'], ['🐢', 'Tortoise'], ['🐇', 'Rabbit'], ['🐻', 'Bear'], ['🦓', 'Zebra'], ['🐒', 'Monkey'], ['🐄', 'Cow'], ['🐎', 'Horse'], ['🐓', 'Rooster'], ['🕊️', 'Dove'], ['🦊', 'Fox'], ['🐐', 'Goat']];
  X.games.pairs = function () {
    ensureOpen(); setS({ title: 'Noah’s Pairs' });
    frame('<div class="st-card gx-choose"><div class="gx-ico c-pairs">' + ICON.pairs + '</div><p class="st-k">' + (X.gotwId() === 'pairs' ? 'Game of the Week' : 'For children, fun for everyone') + '</p><h2 class="st-h">Noah&rsquo;s Pairs</h2><p class="st-fine">&ldquo;There went in two and two unto Noah into the ark.&rdquo; Genesis 7:9</p>' + howList('pairs') +
      '<div class="gx-modes three"><button type="button" class="gx-mode" data-lv="6"><b>Easy</b><small>6 pairs</small></button><button type="button" class="gx-mode" data-lv="8"><b>Medium</b><small>8 pairs</small></button><button type="button" class="gx-mode" data-lv="10"><b>Hard</b><small>10 pairs</small></button></div>' +
      '<button type="button" class="gx-mode team wide" data-m="team"><b>Play as teams</b><small>Take turns on one board. Find a pair and go again.</small></button></div>');
    bindAll('[data-lv]', function (b) { var n = +b.getAttribute('data-lv'); withPlayer(function () { prStart(n, null); }); });
    bind('[data-m=team]', function () { teamSetup('pairs', null, { perLabel: 'Board size (pairs)', pers: [6, 8, 10], note: 'Teams take turns turning over two cards. Find a pair and you go again.', custom: function (T) { T.custom = function (TT) { prStart(TT.per, TT); }; prStart(T.per, T); } }); });
  };
  function prStart(n, T) {
    var deck = shuffle(ANIMALS).slice(0, n), cards = shuffle(deck.concat(deck).map(function (a, i) { return { a: a, id: i }; }));
    load('pairs').then(null, function () { return null; });
    setS({ title: 'Noah’s Pairs', today: today(), cards: cards, open: [], got: {}, moves: 0, pairs: n, n: n, T: T, cur: 0, lock: false, phase: 'pr' });
    if (T) T.teams.forEach(function (t) { t.pts = 0; t.ok = 0; });
    prFrame();
  }
  function prFrame() {
    var s = S(), n = s.pairs, cols = n <= 6 ? 4 : n <= 8 ? 4 : 5;
    var T = s.T;
    frame((T ? teamBar(T, s.cur) : '') + '<div class="st-card pr">' + helpBtn('pairs') + '<p class="st-k">' + (T ? esc(T.teams[s.cur].name) + '&rsquo;s turn' : 'Find the pairs') + ' &middot; ' + Object.keys(s.got).length + '/' + n + ' pairs &middot; ' + s.moves + ' moves</p>' +
      '<div class="pr-grid" style="--cols:' + cols + '">' + s.cards.map(function (c, i) { var up = s.open.indexOf(i) >= 0 || s.got[c.a[1]]; return '<button type="button" class="pr-c' + (up ? ' up' : '') + (s.got[c.a[1]] ? ' got' : '') + '" data-i="' + i + '" aria-label="' + (up ? c.a[1] : 'Card ' + (i + 1)) + '"' + (s.got[c.a[1]] ? ' disabled' : '') + '><span class="pr-f">' + c.a[0] + '<small>' + c.a[1] + '</small></span><span class="pr-b" aria-hidden="true"></span></button>'; }).join('') + '</div></div>', T ? 'team' : '');
    bindAll('.pr-c', function (b) { prFlip(+b.getAttribute('data-i')); });
  }
  function prFlip(i) {
    var s = S(); if (s.lock || s.open.indexOf(i) >= 0 || s.got[s.cards[i].a[1]]) return;
    s.open.push(i); prFrame();
    if (s.open.length < 2) return;
    s.moves++; var a = s.cards[s.open[0]], b = s.cards[s.open[1]];
    if (a.a[1] === b.a[1]) {
      s.got[a.a[1]] = 1; s.open = [];
      if (s.T) { s.T.teams[s.cur].pts += 100; s.T.teams[s.cur].ok++; }
      prFrame();
      if (Object.keys(s.got).length === s.pairs) later(prEnd, reduce ? 0 : 600);
    } else { s.lock = true; later(function () { s.open = []; s.lock = false; if (s.T) s.cur = (s.cur + 1) % s.T.teams.length; prFrame(); }, 900); }
  }
  function prEnd() {
    var s = S(), n = s.pairs;
    if (s.T) { teamEnd(s.T, null); return; }
    s.pts = Math.max(n * 30, n * 100 - Math.max(0, s.moves - n) * 10); s.score = n;
    var stars = s.moves <= n * 1.5 ? 3 : s.moves <= n * 2.2 ? 2 : 1, v = D.pairs && D.pairs[0];
    result({ id: 'pairs', lb: 'pairs', win: true, big: '<span class="gx-stars">' + [1, 2, 3].map(function (k) { return '<i class="' + (k <= stars ? 'on' : '') + '">★</i>'; }).join('') + '</span>', rank: stars === 3 ? 'Super memory!' : stars === 2 ? 'Well done!' : 'You did it!', msg: 'All ' + n + ' pairs are safe in the ark, in ' + s.moves + ' moves.',
      extra: v ? '<blockquote class="wd-verse gx-v">&ldquo;' + esc(v[1]) + '&rdquo;<cite>' + esc(v[0]) + ' (KJV)</cite></blockquote>' : '', tally: '<div><b>' + s.moves + '</b><small>moves</small></div>', shareLine: n + ' pairs in ' + s.moves + ' moves', againLabel: 'Play again', again: function () { prStart(n, null); } });
  }

  /* ================================================================ Bible Imposter (group game, no leaderboard) */
  function catChips(sel) { return '<fieldset class="tm-n gx-cats"><legend>Words from</legend>' + ['Mix', 'People', 'Places', 'Things', 'Stories', 'MFM'].map(function (c) { return '<label><input type="radio" name="cat" value="' + c + '"' + (sel === c ? ' checked' : '') + '><span>' + c + '</span></label>'; }).join('') + '</fieldset>'; }
  function wordsFor(d, cat) { if (cat === 'Mix') return [].concat(d.People, d.Places, d.Things, d.Stories, d.MFM || []); return d[cat] || []; }
  X.games.imposter = function () {
    ensureOpen(); var last = ls('mfm-imp') || { n: 4, cat: 'Mix', hint: true };
    setS({ title: 'Imposter' });
    frame('<div class="st-card st-team imp"><div class="gx-ico c-imposter">' + ICON.imposter + '</div><p class="st-k">A group game &middot; one phone</p><h2 class="st-h">Imposter</h2>' + howList('imposter') +
      '<form class="st-form" autocomplete="off"><fieldset class="tm-n"><legend>How many players?</legend><div class="gx-step"><button type="button" data-d="-1" aria-label="Fewer players">&minus;</button><b class="imp-n">' + last.n + '</b><button type="button" data-d="1" aria-label="More players">+</button></div></fieldset>' + catChips(last.cat) +
      '<label class="gx-check"><input type="checkbox" name="hint"' + (last.hint ? ' checked' : '') + '> Tell the imposter the category</label><button class="pg-btn gold wide xl" type="submit">Deal the cards</button></form></div>');
    var n = last.n, f = document.querySelector('#play-app form');
    bindAll('.gx-step button', function (b) { n = Math.min(12, Math.max(3, n + +b.getAttribute('data-d'))); document.querySelector('#play-app .imp-n').textContent = n; });
    f.addEventListener('submit', function (e) {
      e.preventDefault(); var cat = f.querySelector('input[name=cat]:checked').value, hint = f.hint.checked; ls('mfm-imp', { n: n, cat: cat, hint: hint });
      load('words').then(function (d) {
        var used = ls('mfm-imp-used') || [], pool = wordsFor(d, cat).filter(function (w) { return used.indexOf(w) < 0; }); if (!pool.length) { used = []; pool = wordsFor(d, cat); }
        var word = pool[Math.floor(Math.random() * pool.length)]; ls('mfm-imp-used', used.concat([word]).slice(-60));
        var realCat = cat === 'Mix' ? ['People', 'Places', 'Things', 'Stories', 'MFM'].filter(function (c) { return (d[c] || []).indexOf(word) >= 0; })[0] : cat;
        impDeal({ n: n, word: word, cat: realCat, hint: hint, imp: Math.floor(Math.random() * n), first: Math.floor(Math.random() * n), i: 0 });
      }, loadFail);
    });
  };
  function impDeal(G1) {
    if (G1.i >= G1.n) { impTalk(G1); return; }
    frame('<div class="st-card tm-pass imp-pass">' + helpBtn('imposter') + '<p class="st-k">Card ' + (G1.i + 1) + ' of ' + G1.n + '</p><h2 class="st-h">Player ' + (G1.i + 1) + '</h2><p class="st-fine">Pass the phone to player ' + (G1.i + 1) + '. Don&rsquo;t let anyone else see.</p><button type="button" class="pg-btn gold wide xl imp-see" data-focus>Show my card</button></div>');
    bind('.imp-see', function () {
      var me = G1.i === G1.imp;
      frame('<div class="st-card imp-card ' + (me ? 'is-imp' : '') + '"><p class="st-k">Player ' + (G1.i + 1) + '</p>' + (me ? '<h2 class="st-h">You are the imposter</h2><p class="st-fine">Blend in. Listen to the clues and work out the word.' + (G1.hint ? ' The word is from <b>' + esc(G1.cat) + '</b>.' : '') + '</p>' : '<p class="st-fine">The secret word is</p><h2 class="st-h imp-w">' + esc(G1.word) + '</h2><p class="st-fine">' + esc(G1.cat) + '</p>') +
        '<button type="button" class="pg-btn light wide xl imp-hide" data-focus>Hide and pass on</button></div>');
      bind('.imp-hide', function () { G1.i++; impDeal(G1); });
    });
  }
  function impTalk(G1) {
    frame('<div class="st-card imp-talk"><p class="st-k">Everyone has seen their card</p><h2 class="st-h">Give your clues</h2><ol class="gx-steps"><li>Start with <b>Player ' + (G1.first + 1) + '</b> and go round the circle.</li><li>Each player says <b>one word</b> about the secret word. Not too obvious!</li><li>Go round twice if you like, then <b>vote</b>: who is the imposter?</li></ol><button type="button" class="pg-btn gold wide xl imp-rev" data-focus>Reveal the imposter</button></div>');
    bind('.imp-rev', function () {
      frame('<div class="st-confetti" aria-hidden="true"></div><div class="st-card st-res imp-end"><p class="st-k">The imposter was</p><h2 class="st-rank">Player ' + (G1.imp + 1) + '</h2><p class="st-msg">The word was <b>' + esc(G1.word) + '</b>.</p><p class="st-fine">If the group caught the imposter, they can still win by guessing the word.</p>' +
        '<div class="st-acts"><button type="button" class="pg-btn gold imp-again">Play again</button><button type="button" class="pg-btn light imp-set">Change players or words</button></div><div class="st-acts two"><button type="button" class="pg-btn ghost gx-more">Play another game</button></div></div>', 'done');
      X.confetti();
      bind('.imp-again', function () { var last = ls('mfm-imp'); load('words').then(function (d) { var used = ls('mfm-imp-used') || [], pool = wordsFor(d, last.cat).filter(function (w) { return used.indexOf(w) < 0; }); if (!pool.length) { used = []; pool = wordsFor(d, last.cat); } var word = pool[Math.floor(Math.random() * pool.length)]; ls('mfm-imp-used', used.concat([word]).slice(-60)); var realCat = last.cat === 'Mix' ? ['People', 'Places', 'Things', 'Stories', 'MFM'].filter(function (c) { return (d[c] || []).indexOf(word) >= 0; })[0] : last.cat; impDeal({ n: G1.n, word: word, cat: realCat, hint: G1.hint, imp: Math.floor(Math.random() * G1.n), first: Math.floor(Math.random() * G1.n), i: 0 }); }); });
      bind('.imp-set', X.games.imposter);
      bind('.gx-more', function () { X.close(); X.scrollToId('games'); });
    });
  }

  /* ================================================================ Bible Charades (teams, no leaderboard) */
  X.games.charades = function () {
    var last = ls('mfm-cha') || { cat: 'Mix', secs: 60 };
    teamSetup('charades', null, { perLabel: 'Turns per team', pers: [1, 2, 3], note: '</p>' + howList('charades') + '<p class="st-fine">',
      extra: catChips(last.cat) + '<fieldset class="tm-n"><legend>Seconds per turn</legend>' + [45, 60, 90].map(function (k) { return '<label><input type="radio" name="secs" value="' + k + '"' + (last.secs === k ? ' checked' : '') + '><span>' + k + '</span></label>'; }).join('') + '</fieldset>',
      read: function (f) { var o = { cat: f.querySelector('input[name=cat]:checked').value, secs: +f.querySelector('input[name=secs]:checked').value }; ls('mfm-cha', o); return o; },
      custom: function (T) { load('words').then(function (d) { T.deck = shuffle(wordsFor(d, T.opt.cat)); T.custom = function (TT) { TT.deck = shuffle(TT.deck); chTurn(TT); }; chTurn(T); }, loadFail); } });
  };
  function chTurn(T) {
    if (T.turn >= T.teams.length * T.per) { teamEnd(T, null); return; }
    var k = T.turn % T.teams.length, t = T.teams[k];
    setS({ title: 'Charades', pts: t.pts });
    frame(teamBar(T, k) + '<div class="st-card tm-pass" style="--tc:' + t.col + '"><p class="st-k">Turn ' + (Math.floor(T.turn / T.teams.length) + 1) + ' of ' + T.per + ' &middot; ' + T.opt.secs + ' seconds</p><span class="tm-flag" aria-hidden="true"></span><h2 class="st-h">' + esc(t.name) + '</h2><p class="st-fine">Choose who will guess. They hold the phone to their forehead, screen facing the team. The team taps <b>Got it</b> or <b>Pass</b>.</p><button type="button" class="pg-btn gold wide xl" data-focus>Start</button></div>', 'team');
    bind('.tm-pass .pg-btn', function () {
      var n = 3; frame('<div class="st-card ch-count"><b>' + n + '</b></div>', 'team ch-on');
      var iv = every(function () { n--; if (n > 0) { var b = document.querySelector('#play-app .ch-count b'); if (b) b.textContent = n; } else { clearInterval(iv); chPlay(T, t); } }, reduce ? 300 : 800);
    });
  }
  function chPlay(T, t) {
    var got = [], pass = [], end = Date.now() + T.opt.secs * 1000;
    function word() { if (!T.deck.length) T.deck = shuffle(got.concat(pass)); return T.deck.shift(); }
    var w = word();
    function paint() {
      var left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      frame('<div class="st-card ch">' + helpBtn('charades') + '<div class="ch-time" style="--p:' + (left / T.opt.secs * 100).toFixed(1) + '%"><b>' + left + '</b></div><h2 class="ch-w">' + esc(w) + '</h2><div class="ch-btns"><button type="button" class="ch-pass">Pass</button><button type="button" class="ch-got">Got it</button></div><p class="ch-tally">' + got.length + ' got &middot; ' + pass.length + ' passed</p></div>', 'team ch-on');
      bind('.ch-got', function () { got.push(w); w = word(); paint(); });
      bind('.ch-pass', function () { pass.push(w); w = word(); paint(); });
    }
    paint();
    clearAll(); every(function () { var left = Math.max(0, Math.ceil((end - Date.now()) / 1000)), b = document.querySelector('#play-app .ch-time'); if (b) { b.style.setProperty('--p', (left / T.opt.secs * 100).toFixed(1) + '%'); b.querySelector('b').textContent = left; } if (left <= 0) { clearAll(); chDone(T, t, got, pass); } }, 250);
  }
  function chDone(T, t, got, pass) {
    t.pts += got.length * 100; t.ok += got.length; T.turn++;
    var nx = T.turn < T.teams.length * T.per ? T.teams[T.turn % T.teams.length] : null;
    frame(teamBar(T, -1) + '<div class="st-card gx-between" style="--tc:' + t.col + '"><p class="st-k">Time! &middot; ' + esc(t.name) + '</p><h2 class="st-h">' + got.length + ' got it</h2>' +
      '<div class="ch-list">' + got.map(function (x) { return '<span class="ok">' + esc(x) + '</span>'; }).join('') + pass.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' +
      '<button type="button" class="pg-btn gold wide xl" data-focus>' + (nx ? 'Next: ' + esc(nx.name) : 'See who won') + '</button></div>', 'team');
    bind('.gx-between .pg-btn', function () { chTurn(T); });
  }

  /* team rounds for the scorable games */
  var ROUND = { connect: function (o) { cnStart(o); }, wheel: function (o) { whStart(o); }, dverse: function (o) { dvStart(o); }, whoami: function (o) { waStart(o); }, build: function (o) { vbStart(o); } };
  var _teamSetup = teamSetup;
  teamSetup = function (id, round, opts) { _teamSetup(id, round || ROUND[id], opts); };
})();
