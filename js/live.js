/* Play & Grow — LIVE ROOM (Dawn, 2026-11-27).
   Solo = you alone. Team = one shared phone or the church TV, teams take turns.
   Live room = everyone on their OWN phone, anywhere (the same hall with the questions on the TV, or different cities).
   One person opens a room and picks the game; others join with the code, the QR or the link. Teams are optional:
   the first person to start a team names it (the captain). Everyone gets the same question at the same moment and
   faster right answers score more. Every question comes from our own checked question bank (the server picks them;
   the host only chooses the game, the level and how many). Live room games do not count on the weekly leaderboard.
   Server: /.netlify/functions/live (see netlify/functions/live.mjs). */
(function () {
  var X = window.PG; if (!X) return;
  var esc = X.esc, ls = X.ls, API = '/.netlify/functions/live';
  var SH = ['<path d="M12 2.5c3.6 3.3 6 6.5 6 10.3a6 6 0 0 1-12 0c0-2.7 1.5-4.8 3-6.3.1 1.8 1 3 2.1 3.3C10.3 7.1 11 4.6 12 2.5Z"/>',
    '<path d="M3 8l4.5 3.5L12 5l4.5 6.5L21 8l-2 10H5Z"/>', '<path d="M12 3l9 9-9 9-9-9Z"/>',
    '<path d="m12 2.8 2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.7l-5.6 3.1 1.3-6.2L3 9.3l6.3-.7Z"/>'];
  var GAMES = {
    quiz: { name: 'Live Bible Quiz', line: 'The same question for everyone at the same moment. Faster right answers score more.' },
    whoami: { name: 'Who Am I? Live', line: 'Clues about a Bible person appear one at a time. Answer early for more points.' }
  };
  var LEVELS = [['easy', 'Easy'], ['normal', 'Normal'], ['hard', 'Challenge'], ['kids', 'Kids']];
  var L = null;           // the room this device is in

  function rid(n) { var s = '', a = 'abcdefghijklmnopqrstuvwxyz0123456789'; var r = new Uint8Array(n); (window.crypto || window.msCrypto).getRandomValues(r); for (var i = 0; i < n; i++) s += a[r[i] % 36]; return s; }
  function myPid() { var p = ls('mfm-live-pid'); if (!p || !/^[a-z0-9]{16}$/.test(p)) { p = rid(16); ls('mfm-live-pid', p); } return p; }
  function nick() { var m = ls('mfm-quiz-me'); return (m && m.nick) || ls('mfm-live-name') || ''; }
  function post(b) { return fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }).then(function (r) { return r.json().catch(function () { return { ok: false, reason: 'net' }; }); }); }
  function getState() { return fetch(API + '?r=' + L.code + '&p=' + L.pid, { cache: 'no-store' }).then(function (r) { return r.json(); }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function link(code) { return location.href.split('#')[0].split('?')[0] + '?room=' + code; }
  function frame(html, cls) { X.set({ mode: 'live', pts: L && L.score || 0, phase: 'live', ext: 1, title: 'Live room' }); X.frame('<div class="st-card lr ' + (cls || '') + '">' + html + '</div>', 'lr-stage' + (L && L.role === 'host' && L.tv ? ' lr-tvh' : '')); }
  function stop() { if (L && L.t) clearTimeout(L.t); if (L && L.raf) cancelAnimationFrame(L.raf); if (L) L.dead = 1; }
  X.closers.push(function () { stop(); L = null; });
  function msg(reason) {
    return { gone: 'That room has closed or the code is not right.', code: 'Room codes are 5 letters, like K7MPQ.', name: 'Please type your name.', team: 'Please choose a team or start one.', taken: 'Someone in this room already has that name. Try another.', full: 'This room is full.', teams: 'This room already has 6 teams. Please join one of them.', net: 'We could not reach the room. Check your connection and try again.', questions: 'We could not load the questions. Please try again.' }[reason] || 'Something went wrong. Please try again.';
  }

  /* ---------- home ---------- */
  function home(code) {
    stop(); L = null; X.open();
    frame('<p class="st-k">Live room</p><h2 class="st-h">Play together, live</h2>' +
      '<p class="st-sub">Everyone plays on their own phone: in the church hall with the questions on the TV, or in different cities. Open a room, share the code, and everyone gets the same question at the same moment.</p>' +
      '<div class="lr-two"><div class="lr-box"><h3>Open a room</h3><p>Choose the game, then share the code, the QR or the link.</p><button type="button" class="pg-btn gold wide" data-lv="host" data-focus>Open a room</button></div>' +
      '<form class="lr-box" data-lv="join"><h3>Join a room</h3><label class="lr-f">Room code<input name="code" maxlength="5" autocomplete="off" autocapitalize="characters" spellcheck="false" value="' + esc(code || '') + '" placeholder="K7MPQ" required></label><button type="submit" class="pg-btn light wide">Join</button><p class="lr-err" role="alert"></p></form></div>' +
      '<p class="st-fine">Live room games do not count on the weekly leaderboard.</p>');
    var st = document.getElementById('play-app');
    st.querySelector('[data-lv="host"]').addEventListener('click', function () { setup(); });
    var f = st.querySelector('form[data-lv="join"]');
    f.addEventListener('submit', function (e) { e.preventDefault(); var c = f.code.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, ''); if (c.length !== 5) { f.querySelector('.lr-err').textContent = msg('code'); return; } joinScreen(c); });
  }

  /* ---------- host: choose the game ---------- */
  function setup(again) {
    var prev = (again && L && L.cfg) || ls('mfm-live-cfg') || { game: 'quiz', n: 10, level: 'normal', teams: false, tv: false };
    var opt = function (name, val, label, on, sub) { return '<label class="lr-opt"><input type="radio" name="' + name + '" value="' + val + '"' + (on ? ' checked' : '') + '><span><b>' + label + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</span></label>'; };
    frame('<p class="st-k">' + (again ? 'Same room, new game' : 'Open a live room') + '</p><h2 class="st-h">Choose the game</h2><form class="lr-setup">' +
      '<fieldset><legend>Game</legend><div class="lr-opts two">' + Object.keys(GAMES).map(function (g) { return opt('game', g, GAMES[g].name, prev.game === g, GAMES[g].line); }).join('') + '</div></fieldset>' +
      '<fieldset><legend>Questions</legend><div class="lr-opts seg">' + [5, 10, 15].map(function (n) { return opt('n', n, n, +prev.n === n); }).join('') + '</div></fieldset>' +
      '<fieldset class="lr-lv"><legend>Level</legend><div class="lr-opts seg">' + LEVELS.map(function (l) { return opt('level', l[0], l[1], prev.level === l[0]); }).join('') + '</div></fieldset>' +
      (again ? '' : '<fieldset><legend>Teams</legend><div class="lr-opts two">' + opt('teams', '0', 'Everyone for themselves', !prev.teams) + opt('teams', '1', 'Play in teams', !!prev.teams, 'The first person in a team names it') + '</div></fieldset>' +
      '<fieldset><legend>This screen</legend><div class="lr-opts two">' + opt('tv', '0', 'I’m playing too', !prev.tv) + opt('tv', '1', 'Just for showing', !!prev.tv, 'For a TV or projector. This screen shows the questions and the scores') + '</div></fieldset>' +
      '<label class="lr-f lr-nm">Your name<input name="name" maxlength="20" autocomplete="nickname" value="' + esc(nick()) + '"></label>') +
      '<button type="submit" class="pg-btn gold wide xl">' + (again ? 'Start the new game' : 'Open the room') + '</button><p class="lr-err" role="alert"></p></form>');
    var f = document.querySelector('#play-app .lr-setup');
    function sync() { var g = f.game.value; f.querySelector('.lr-lv').hidden = g !== 'quiz'; var nm = f.querySelector('.lr-nm'); if (nm) nm.hidden = f.tv.value === '1'; }
    f.addEventListener('change', sync); sync();
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var cfg = { game: f.game.value, n: +f.n.value, level: f.level.value, teams: again ? prev.teams : f.teams.value === '1', tv: again ? prev.tv : f.tv.value === '1' };
      var name = again ? (L && L.name) : (f.name ? f.name.value.trim().slice(0, 20) : '');
      if (!cfg.tv && !again && !name) { f.querySelector('.lr-err').textContent = msg('name'); return; }
      var btn = f.querySelector('button[type=submit]'); btn.disabled = true;
      ls('mfm-live-cfg', cfg); if (name) ls('mfm-live-name', name);
      /* the questions come from our own question bank, chosen on the server; the host only picks game, level and how many */
      Promise.resolve().then(function () {
        if (again) return post({ act: 'restart', code: L.code, host: L.host, game: cfg.game, n: cfg.n, level: cfg.level }).then(function (r) { if (!r.ok) throw r; L.cfg = cfg; L.key = ''; tick(); });
        return post({ act: 'create', game: cfg.game, n: cfg.n, level: cfg.level, teams: cfg.teams, hostName: name }).then(function (r) {
          if (!r.ok) throw r;
          stop(); L = { code: r.code, host: r.host, pid: myPid(), role: 'host', tv: cfg.tv, name: name, cfg: cfg, key: '' };
          ls('mfm-live-host', { code: r.code, host: r.host, at: Date.now() });
          if (cfg.tv) return post({ act: 'join', code: L.code, pid: L.pid, tv: true, host: L.host }).then(function () { tick(); });
          if (cfg.teams) return joinScreen(r.code, true);
          return post({ act: 'join', code: L.code, pid: L.pid, name: name }).then(function (j) { if (!j.ok) throw j; tick(); });
        });
      }).catch(function (r) { btn.disabled = false; f.querySelector('.lr-err').textContent = msg(r && r.reason || 'questions'); });
    });
  }

  /* ---------- join ---------- */
  function joinScreen(code, asHost) {
    if (!asHost) { stop(); L = { code: code, pid: myPid(), role: 'player', key: '' }; }
    X.open();
    getState().then(function (d) {
      if (!d.ok) { home(code); var e = document.querySelector('#play-app .lr-err'); if (e) e.textContent = msg(d.reason); return; }
      var teamsHtml = '';
      if (d.teams) {
        teamsHtml = '<fieldset><legend>Choose your team</legend><div class="lr-opts teams">' + d.teamList.map(function (t, i) { return '<label class="lr-opt"><input type="radio" name="team" value="' + esc(t.name) + '"' + (i === 0 ? '' : '') + '><span><b>' + esc(t.name) + '</b><small>' + t.n + (t.n === 1 ? ' player' : ' players') + '</small></span></label>'; }).join('') +
          (d.teamList.length < 6 ? '<label class="lr-opt new"><input type="radio" name="team" value=""' + (d.teamList.length ? '' : ' checked') + '><span><b>Start a new team</b><small>You’ll be the captain and choose the name</small></span></label>' : '') + '</div>' +
          '<label class="lr-f lr-tn"' + (d.teamList.length ? ' hidden' : '') + '>Team name<input name="tname" maxlength="20" placeholder="e.g. The Fire Starters"></label></fieldset>';
      }
      frame('<p class="st-k">Room ' + esc(code) + '</p><h2 class="st-h">' + (asHost ? 'Your team' : 'Join ' + esc(d.hostName ? d.hostName + '’s room' : 'the room')) + '</h2><p class="st-sub">' + esc(GAMES[d.game] ? GAMES[d.game].name : 'Live game') + ' &middot; ' + d.n + ' questions &middot; ' + d.nPlayers + (d.nPlayers === 1 ? ' player' : ' players') + ' in</p>' +
        '<form class="lr-setup lr-jf">' + (asHost ? '' : '<label class="lr-f">Your name<input name="name" maxlength="20" autocomplete="nickname" value="' + esc(nick()) + '" required></label>') + teamsHtml +
        '<button type="submit" class="pg-btn gold wide xl">' + (asHost ? 'Continue' : 'Join the room') + '</button><p class="lr-err" role="alert"></p></form>');
      var f = document.querySelector('#play-app .lr-jf');
      if (d.teams) f.addEventListener('change', function () { var r = f.querySelector('input[name=team]:checked'); f.querySelector('.lr-tn').hidden = !(r && r.value === ''); });
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = asHost ? L.name : f.name.value.trim().slice(0, 20), team = '';
        if (!name) { f.querySelector('.lr-err').textContent = msg('name'); return; }
        if (d.teams) { var r = f.querySelector('input[name=team]:checked'); team = r ? (r.value || (f.tname.value || '').trim()) : ''; if (!team) { f.querySelector('.lr-err').textContent = msg('team'); return; } }
        var btn = f.querySelector('button[type=submit]'); btn.disabled = true;
        post({ act: 'join', code: code, pid: L.pid, name: name, team: team }).then(function (r) {
          if (!r.ok) { btn.disabled = false; f.querySelector('.lr-err').textContent = msg(r.reason); return; }
          L.name = r.name; L.team = r.team; ls('mfm-live-name', r.name); tick();
        });
      });
    }).catch(function () { home(code); var e = document.querySelector('#play-app .lr-err'); if (e) e.textContent = msg('net'); });
  }

  /* ---------- the live loop ---------- */
  function tick() {
    if (!L || L.dead) return;
    var me = L;
    getState().then(function (d) {
      if (me !== L || L.dead) return;
      d.got = Date.now(); L.d = d; render(d);
      var wait = d.phase === 'lobby' ? 2000 : d.phase === 'final' ? 3000 : d.phase === 'ended' ? 0 : 900;
      if (wait) L.t = setTimeout(tick, wait);
    }).catch(function () { if (me === L && !L.dead) L.t = setTimeout(tick, 2500); });
  }
  function isTv() { return L.role === 'host' && L.tv; }
  function render(d) {
    var key = d.gen + ':' + d.phase + ':' + d.qi;
    if (d.me) { L.score = d.me.score; var b = document.querySelector('#play-app .st-pts b'); if (b) b.textContent = X.fmt(d.me.score); }
    if (key === L.key) { update(d); return; }
    L.key = key; L.answered = null;
    ({ lobby: lobby, count: count, q: question, reveal: reveal, final: final, ended: ended })[d.phase](d);
    update(d);
  }
  function people(d, max) {
    var list = d.players.slice(0, max || 60);
    if (d.teams) {
      var g = {}; d.players.forEach(function (p) { (g[p.team || '—'] = g[p.team || '—'] || []).push(p); });
      return '<div class="lr-teams">' + Object.keys(g).map(function (t) { return '<div class="lr-team"><b>' + esc(t) + '</b><span>' + g[t].map(function (p) { return '<i class="' + (p.me ? 'me' : '') + '">' + esc(p.name) + '</i>'; }).join('') + '</span></div>'; }).join('') + '</div>';
    }
    return '<div class="lr-names">' + list.map(function (p) { return '<i class="' + (p.me ? 'me' : '') + '">' + esc(p.name) + '</i>'; }).join('') + '</div>';
  }
  function lobby(d) {
    if (L.role === 'host') {
      var url = link(d.code);
      frame('<p class="st-k">' + esc(GAMES[d.game].name) + ' &middot; ' + d.n + ' questions</p><h2 class="st-h">Join at the Play page</h2>' +
        '<div class="lr-lobby"><div class="lr-qr" aria-hidden="true"></div><div class="lr-codebox"><small>Room code</small><b class="lr-code">' + esc(d.code) + '</b><p class="lr-url">' + esc(url.replace(/^https?:\/\//, '')) + '</p>' +
        '<div class="st-acts"><button type="button" class="pg-btn light" data-lv="copy">Copy the link</button>' + (navigator.share ? '<button type="button" class="pg-btn light" data-lv="share">Share</button>' : '') + '</div></div></div>' +
        '<h3 class="lr-h3"><span data-lv="n">' + d.nPlayers + '</span> in the room</h3><div data-lv="list">' + people(d) + '</div>' +
        '<div class="st-acts"><button type="button" class="pg-btn gold xl" data-lv="start"' + (d.nPlayers ? '' : ' disabled') + '>Start the game</button><button type="button" class="pg-btn ghost" data-lv="end">Close the room</button></div>' +
        '<p class="st-fine">Anyone with the code can join, from anywhere. People can still join after the game starts.</p>', 'host');
      qr(document.querySelector('#play-app .lr-qr'), url);
      var st = document.getElementById('play-app');
      st.querySelector('[data-lv="copy"]').addEventListener('click', function (e) { var b = e.currentTarget; (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () { b.textContent = 'Link copied'; }, function () { b.textContent = url; }); });
      var sh = st.querySelector('[data-lv="share"]'); if (sh) sh.addEventListener('click', function () { navigator.share({ title: 'Play live with me', text: 'Join my MFM Play & Grow live room: code ' + d.code, url: url }).catch(function () {}); });
      st.querySelector('[data-lv="start"]').addEventListener('click', function (e) { e.currentTarget.disabled = true; post({ act: 'start', code: L.code, host: L.host }).then(function () { L.key = ''; clearTimeout(L.t); tick(); }); });
      st.querySelector('[data-lv="end"]').addEventListener('click', closeRoom);
    } else {
      frame('<p class="st-k">Room ' + esc(d.code) + '</p><h2 class="st-h">You’re in!</h2><p class="st-sub"><b>' + esc(d.me ? d.me.name : '') + '</b>' + (d.me && d.me.team ? ' &middot; team <b>' + esc(d.me.team) + '</b>' : '') + '. Waiting for ' + esc(d.hostName || 'the host') + ' to start ' + esc(GAMES[d.game].name) + '.</p>' +
        '<div class="lr-wait" aria-hidden="true"><i></i><i></i><i></i></div><h3 class="lr-h3"><span data-lv="n">' + d.nPlayers + '</span> in the room</h3><div data-lv="list">' + people(d) + '</div>');
    }
  }
  function count(d) {
    frame('<p class="st-k">' + esc(GAMES[d.game].name) + '</p><h2 class="st-h">Get ready</h2><div class="lr-count" data-lv="cd">3</div><p class="st-sub">' + d.n + ' questions. Faster right answers score more.</p>', 'count');
  }
  function bar() { return '<div class="lr-bar"><i data-lv="bar"></i></div>'; }
  function opts(d, picked, rev) {
    return '<div class="lr-ans' + (d.q.o.length === 2 ? ' two' : '') + '">' + d.q.o.map(function (t, k) {
      var cls = 'ans a' + k;
      if (rev) cls += k === d.q.a ? ' right' : (picked === k ? ' wrong' : ' dim');
      else if (picked != null) cls += picked === k ? ' picked' : ' dim';
      return '<button type="button" class="' + cls + '" data-c="' + k + '"' + (rev || picked != null || isTv() ? ' disabled' : '') + '><span class="sh"><svg viewBox="0 0 24 24" aria-hidden="true">' + SH[k] + '</svg></span><span class="tx">' + esc(t) + '</span>' + (rev && d.dist ? '<span class="lr-cnt">' + d.dist[k] + '</span>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function clues(d) { return d.q.c ? '<ol class="lr-clues" data-lv="clues">' + d.q.c.map(function (c, i) { return '<li' + (i ? ' hidden' : '') + '>' + esc(c) + '</li>'; }).join('') + '</ol>' : ''; }
  function question(d) {
    var picked = d.me && d.me.ans ? d.me.ans.c : null;
    frame('<div class="lr-top"><span>Question ' + (d.qi + 1) + ' of ' + d.n + '</span><span data-lv="ansd"></span></div>' + bar() +
      '<h2 class="lr-q">' + esc(d.q.q) + '</h2>' + clues(d) + opts(d, picked) +
      '<p class="lr-note" data-lv="note">' + (isTv() ? 'Answer on your phone' : picked != null ? 'Locked in. Waiting for the others…' : '') + '</p>', isTv() ? 'tv' : '');
    if (isTv()) return;
    document.querySelectorAll('#play-app .lr-ans .ans').forEach(function (b) {
      b.addEventListener('click', function () {
        var c = +b.dataset.c, qi = d.qi;
        document.querySelectorAll('#play-app .lr-ans .ans').forEach(function (x) { x.disabled = true; x.classList.add(+x.dataset.c === c ? 'picked' : 'dim'); });
        var n = document.querySelector('#play-app [data-lv="note"]'); n.textContent = 'Locked in. Waiting for the others…';
        post({ act: 'answer', code: L.code, pid: L.pid, q: qi, c: c }).then(function (r) { if (!r.ok && r.reason === 'closed') n.textContent = 'Time was up for that one.'; });
      });
    });
  }
  function board(d, n) {
    var top = d.players.slice(0, n || 5), me = d.players.filter(function (p) { return p.me; })[0];
    var row = function (p) { return '<li class="' + (p.me ? 'me' : '') + '"><b>' + p.rank + '</b><span>' + esc(p.name) + (p.team ? '<small>' + esc(p.team) + '</small>' : '') + '</span><em>' + X.fmt(p.score) + '</em></li>'; };
    var h = '<ol class="lr-board">' + top.map(row).join('') + (me && top.indexOf(me) < 0 ? '<li class="gap">···</li>' + row(me) : '') + '</ol>';
    if (d.teams && d.teamList.length) h += '<h3 class="lr-h3">Teams</h3><ol class="lr-board tm">' + d.teamList.map(function (t, i) { return '<li class="' + (d.me && d.me.team === t.name ? 'me' : '') + '"><b>' + (i + 1) + '</b><span>' + esc(t.name) + '<small>' + t.n + (t.n === 1 ? ' player' : ' players') + '</small></span><em>' + X.fmt(t.score) + '</em></li>'; }).join('') + '</ol><p class="st-fine">A team’s score is its players’ average, so small teams can win too.</p>';
    return h;
  }
  function reveal(d) {
    var mine = d.me && d.me.ans, picked = mine ? mine.c : null, verdict = '';
    if (!isTv() && d.me) verdict = '<div class="lr-verdict ' + (mine && mine.ok ? 'ok' : 'no') + '"><b>' + (mine ? (mine.ok ? '+' + X.fmt(mine.pts) : 'Not this time') : 'No answer') + '</b><span>' + (d.me.rank ? 'You’re ' + ord(d.me.rank) + ' of ' + d.nPlayers : '') + '</span></div>';
    frame('<div class="lr-top"><span>Question ' + (d.qi + 1) + ' of ' + d.n + '</span><span>' + d.answered + ' of ' + d.eligible + ' answered</span></div>' +
      '<h2 class="lr-q sm">' + esc(d.q.q) + '</h2>' + (d.q.c ? '<p class="lr-x">' + esc(d.q.o[d.q.a]) + '</p>' : '') + opts(d, picked, true) + verdict + (d.q.x ? '<p class="lr-x">' + esc(d.q.x) + '</p>' : '') +
      '<h3 class="lr-h3">' + (d.qi + 1 < d.n ? 'Standings' : 'Final standings') + '</h3>' + board(d, isTv() ? 8 : 5), isTv() ? 'tv' : '');
  }
  function ord(n) { var s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
  function final(d) {
    var p = d.players, pod = [p[1], p[0], p[2]].map(function (x, i) { return x ? '<div class="lr-pod p' + [2, 1, 3][i] + '"><b>' + esc(x.name) + '</b><span>' + X.fmt(x.score) + '</span><i>' + x.rank + '</i></div>' : '<div class="lr-pod empty"></div>'; }).join('');
    var tw = d.teams && d.teamList.length ? '<p class="lr-win">Winning team: <b>' + esc(d.teamList[0].name) + '</b></p>' : '';
    frame('<p class="st-k">' + esc(GAMES[d.game].name) + ' &middot; game over</p><h2 class="st-h">' + (d.me && d.me.rank === 1 ? 'You won!' : 'Well played!') + '</h2>' + tw +
      '<div class="lr-podium">' + pod + '</div>' + board(d, 10) +
      (L.role === 'host' ? '<div class="st-acts"><button type="button" class="pg-btn gold xl" data-lv="again">Play again with the same people</button><button type="button" class="pg-btn ghost" data-lv="end">Close the room</button></div>'
        : '<p class="st-sub">If ' + esc(d.hostName || 'the host') + ' starts another game, it will appear here.</p>'), 'final');
    var st = document.getElementById('play-app');
    var a = st.querySelector('[data-lv="again"]'); if (a) a.addEventListener('click', function () { clearTimeout(L.t); setup(true); L.key = 'setup'; });
    var e = st.querySelector('[data-lv="end"]'); if (e) e.addEventListener('click', closeRoom);
  }
  function ended() { stop(); frame('<p class="st-k">Live room</p><h2 class="st-h">This room has closed</h2><p class="st-sub">Thanks for playing!</p><div class="st-acts"><button type="button" class="pg-btn gold" data-lv="home">Back to live rooms</button></div>'); document.querySelector('#play-app [data-lv="home"]').addEventListener('click', function () { home(); }); }
  function closeRoom() { if (!L) return; var l = L; post({ act: 'end', code: l.code, host: l.host }).then(function () { if (L === l) { L.key = ''; clearTimeout(L.t); tick(); } }); }
  function update(d) {
    var st = document.getElementById('play-app'); if (!st) return;
    if (d.phase === 'lobby') {
      var n = st.querySelector('[data-lv="n"]'); if (n) n.textContent = d.nPlayers;
      var l = st.querySelector('[data-lv="list"]'); if (l) { var h = people(d); if (l.innerHTML !== h) l.innerHTML = h; }
      var s = st.querySelector('[data-lv="start"]'); if (s && !s.dataset.busy) s.disabled = !d.nPlayers;
    }
    if (d.phase === 'q') { var a = st.querySelector('[data-lv="ansd"]'); if (a) a.textContent = d.answered + ' of ' + d.eligible + ' answered'; }
    if (L.raf) cancelAnimationFrame(L.raf);
    var loop = function () {
      if (!L || L.d !== d) return;
      var el = Date.now() - d.got;
      if (d.phase === 'count') { var c = st.querySelector('[data-lv="cd"]'); if (c) c.textContent = Math.max(1, Math.ceil((d.startIn - el) / 1000)); }
      if (d.phase === 'q') {
        var left = d.qEnd - el, b = st.querySelector('[data-lv="bar"]');
        if (b) b.style.width = Math.max(0, Math.min(100, left / d.dur * 100)) + '%';
        var cl = st.querySelectorAll('[data-lv="clues"] li');
        if (cl.length) { var since = d.dur - (d.qEnd - d.qStart) + (el - d.qStart); var shown = Math.min(cl.length, 1 + Math.floor((el - d.qStart) / (d.dur / cl.length))); cl.forEach(function (li, i) { li.hidden = i >= shown; }); }
      }
      L.raf = requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- QR (vendored qrcode-generator, MIT) ---------- */
  function qr(box, url) {
    if (!box) return;
    var draw = function () { try { var q = window.qrcode(0, 'M'); q.addData(url); q.make(); box.innerHTML = q.createSvgTag({ cellSize: 6, margin: 2, scalable: true }); } catch (e) { box.hidden = true; } };
    if (window.qrcode) return draw();
    var s = document.createElement('script'); s.src = '/js/vendor/qrcode.js'; s.onload = draw; s.onerror = function () { box.hidden = true; }; document.head.appendChild(s);
  }

  X.live = { home: home, join: joinScreen };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-live]'); if (!b) return;
    e.preventDefault(); if (b.dataset.live === 'host') { home(); setup(); } else home();
  });
  var m = /[?&]room=([A-Za-z0-9]{5})\b/.exec(location.search);
  if (m) setTimeout(function () { joinScreen(m[1].toUpperCase()); }, 300);
})();
