/* MFM Mega Region 2 — Play & Grow v2 (game stage). PRIVATE PREVIEW build.
   Same rules as v1: the Daily 5 is the same for everyone each day (seeded by the Central Time date);
   "Who's playing?" (name + branch, or Other / visiting + typed place, or Just play) before the first game.
   New: full-screen game stage, 20 s timer (30 s Kids), speed bonus points, combos, results with rank + confetti,
   podium leaderboard. Preview leaderboard = sample scores + this device's own scores.
   Production: Netlify Function + Netlify Blobs (server-checked, one Daily 5 score per device per day, weekly reset). */
(function () {
  'use strict';
  var stage = document.getElementById('play-app');
  if (!stage) return;
  var BANK = null, S = null, timer = null, lastFocus = null;
  var OTHER = 'Other / visiting';
  var BRANCHES = ["MFM USA Prayer City","MFM Rehoboth","MFM Revival Chapel","MFM Houston 2","MFM Houston 3 — City of Refuge","MFM Houston 5 — New Glory","MFM 7 North Houston","MFM Greater Grace","MFM Northwest Houston","MFM Dallas","MFM House of His Glory","MFM Arlington","MFM Arlington — Matlock","MFM Grand Prairie","MFM Irving","MFM Mansfield","MFM The Lord Has Spoken","MFM San Antonio","MFM Pearland — Shadow of God","MFM Sugar Land","MFM Huntsville","MFM Tampa","MFM Broward","MFM Miami — Mount Zion","MFM Orlando — Citadel of Solution","MFM Tallahassee","MFM Revival Center","MFM Riverdale","MFM Citadel of Signs & Wonders","MFM Georgia Oasis of Grace","MFM Revival & Solution Center","MFM Tulsa","MFM Nashville","MFM Mega Region 2 Youth Church", OTHER];
  var PACK_CLASS = { bible: 'c-bible', verse: 'c-verse', mfm: 'c-mfm', 'go-books': 'c-go', 'oni-books': 'c-oni', messages: 'c-msg' };
  var SHAPES = [
    '<path d="M12 2.5c3.6 3.3 6 6.5 6 10.3a6 6 0 0 1-12 0c0-2.7 1.5-4.8 3-6.3.1 1.8 1 3 2.1 3.3C10.3 7.1 11 4.6 12 2.5Z"/>',   /* flame */
    '<path d="M3 8l4.5 3.5L12 5l4.5 6.5L21 8l-2 10H5Z"/>',                                                                     /* crown */
    '<path d="M12 3l9 9-9 9-9-9Z"/>',                                                                                          /* diamond */
    '<path d="m12 2.8 2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.7l-5.6 3.1 1.3-6.2L3 9.3l6.3-.7Z"/>'                                  /* star */
  ];
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ls(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ctParts() { var p = {}; new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'short', hour12: false }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; }); return p; }
  function ctToday() { var p = ctParts(); return p.year + '-' + p.month + '-' + p.day; }
  function dayNo(today) { var a = Date.parse(BANK.launch + 'T00:00:00Z'), b = Date.parse(today + 'T00:00:00Z'); return Math.max(1, Math.floor((b - a) / 864e5) + 1); }
  function rng(seed) { var h = 2166136261; for (var i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); } return function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1e6) / 1e6; }; }
  function shuffle(arr, r) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(pack, n, r, level) { return shuffle(BANK.questions.filter(function (q) { return (!pack || q.pack === pack) && (!level || q.level === level); }), r).slice(0, n); }
  function player() { return ls('mfm-quiz-me'); }
  function placeOf(p) { return p.branch === OTHER ? (p.other || 'Visiting') : p.branch; }
  function initials(n) { n = (n || '').trim(); if (!n) return '?'; var w = n.split(/\s+/); return (w[0][0] + (w[1] ? w[1][0] : '')).toUpperCase(); }
  function pad(n) { return ('0' + n).slice(-2); }
  function fmt(n) { return Number(n).toLocaleString('en-US'); }
  function dailySet(today) { var r = rng('daily-' + today); return [].concat(pick('bible', 1, r), pick('verse', 1, r), pick('mfm', 1, r), pick(r() < .5 ? 'oni-books' : 'go-books', 1, r), pick('messages', 1, r)); }
  function titleOf() { if (S.mode === 'daily') return 'Daily 5 · Day ' + dayNo(S.today); if (S.mode === 'kids') return 'Kids Mode'; return BANK.packs[S.pack].label; }

  /* ---------- stage open / close ---------- */
  function open() {
    if (stage.hidden) { lastFocus = document.activeElement; stage.hidden = false; document.documentElement.classList.add('pg-lock'); requestAnimationFrame(function () { stage.classList.add('on'); }); }
  }
  function close() {
    stopTimer(); stage.classList.remove('on'); document.documentElement.classList.remove('pg-lock');
    setTimeout(function () { stage.hidden = true; stage.innerHTML = ''; }, reduce ? 0 : 220);
    if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) {}
    refreshHub();
  }
  function frame(inner, extra) {
    var top = '<div class="st-top"><button type="button" class="st-x" aria-label="Close the game"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="st-name">' + (S ? esc(titleOf()) : 'Play &amp; Grow') + '</div><div class="st-pts"><b>' + (S ? fmt(S.pts) : 0) + '</b><small>pts</small></div></div>';
    stage.className = 'pg-stage on' + (S && S.mode === 'kids' ? ' kids' : '') + (extra ? ' ' + extra : '');
    stage.innerHTML = '<div class="st-glow" aria-hidden="true"></div>' + top + '<div class="st-body">' + inner + '</div>';
    stage.scrollTop = 0;
    stage.querySelector('.st-x').addEventListener('click', close);
    var f = stage.querySelector('[data-focus]') || stage.querySelector('button:not(.st-x), input, select');
    if (f) setTimeout(function () { try { f.focus({ preventScroll: true }); } catch (e) {} }, 60);
  }
  document.addEventListener('keydown', function (e) {
    if (stage.hidden) return;
    if (e.key === 'Escape') { close(); return; }
    if (S && S.phase === 'q' && /^[1-4]$/.test(e.key)) { var b = stage.querySelectorAll('.ans')[+e.key - 1]; if (b && !b.disabled) b.click(); }
  });

  /* ---------- Who's playing? ---------- */
  function showWho(next, addOnly) {
    var me = player() || {};
    open(); S = S && addOnly ? S : null;
    frame('<div class="st-card st-who"><div class="st-avatar" aria-hidden="true">' + esc(initials(me.guest ? '' : me.nick)) + '</div>' +
      '<p class="st-k">Before you start</p><h2 class="st-h">Who&rsquo;s playing?</h2>' +
      '<form class="st-form" autocomplete="off" novalidate>' +
      '<label>Your name or nickname<input name="nick" maxlength="20" required value="' + esc(me.guest ? '' : me.nick || '') + '" placeholder="e.g. Grace" data-focus></label>' +
      '<label>Your branch<select name="branch" required><option value="">Choose your branch</option>' +
      BRANCHES.map(function (b) { return '<option' + (me.branch === b ? ' selected' : '') + '>' + esc(b) + '</option>'; }).join('') + '</select></label>' +
      '<label class="st-other"' + (me.branch === OTHER ? '' : ' hidden') + '>Where are you joining from?<input name="other" maxlength="40" value="' + esc(me.other || '') + '" placeholder="Your church, city or country"></label>' +
      '<p class="st-err" hidden>Add your name and choose a branch (or &ldquo;Other / visiting&rdquo;).</p>' +
      '<button class="pg-btn gold wide" type="submit">' + (addOnly ? 'Add my score' : 'Let&rsquo;s play') + '</button>' +
      (addOnly ? '' : '<button class="st-skip" type="button">Just play &mdash; don&rsquo;t add me to the leaderboard</button>') +
      '<p class="st-fine">Only your name and branch appear on the leaderboard. No email, no account.</p></form></div>');
    var f = stage.querySelector('form'), oth = stage.querySelector('.st-other'), av = stage.querySelector('.st-avatar');
    f.nick.addEventListener('input', function () { av.textContent = initials(f.nick.value); });
    f.branch.addEventListener('change', function () { oth.hidden = f.branch.value !== OTHER; if (!oth.hidden) f.other.focus(); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var nick = f.nick.value.trim().slice(0, 20), br = f.branch.value, other = f.other.value.trim().slice(0, 40);
      if (!nick || !br || (br === OTHER && !other)) { stage.querySelector('.st-err').hidden = false; return; }
      ls('mfm-quiz-me', { nick: nick, branch: br, other: br === OTHER ? other : '', guest: false });
      next();
    });
    var sk = stage.querySelector('.st-skip');
    if (sk) sk.addEventListener('click', function () { ls('mfm-quiz-me', { guest: true }); next(); });
  }

  function start(mode, pack) { if (!BANK) return; var go = function () { begin(mode, pack); }; if (!player()) showWho(go); else go(); }

  function begin(mode, pack) {
    var today = ctToday(), r = rng(mode + pack + today + (mode === 'daily' ? '' : Math.random()));
    var qs = mode === 'daily' ? dailySet(today) : mode === 'kids' ? pick(null, 999, r, 'kids') : pick(pack, 999, r);
    S = { mode: mode, pack: pack, today: today, qs: qs.map(function (q) { return { q: q, order: shuffle(q.options.map(function (o, i) { return i; }), r) }; }),
          i: 0, score: 0, pts: 0, combo: 0, best: 0, marks: [], T: mode === 'kids' ? 30 : 20 };
    open(); showQ();
  }

  /* ---------- question ---------- */
  function progress() {
    return '<div class="st-prog" aria-hidden="true" style="grid-template-columns:repeat(' + S.qs.length + ',1fr)">' + S.qs.map(function (x, k) { return '<i class="' + (k < S.i ? (S.marks[k] ? 'ok' : 'no') : k === S.i ? 'now' : '') + '"></i>'; }).join('') + '</div>';
  }
  function whoLine() { var p = player(); if (!p) return ''; return '<p class="st-me">' + (p.guest ? 'Playing as a guest' : '<span class="st-mini">' + esc(initials(p.nick)) + '</span><b>' + esc(p.nick) + '</b> &middot; ' + esc(placeOf(p))) + ' &middot; <button type="button" class="st-change">change</button></p>'; }

  function showQ() {
    var it = S.qs[S.i], q = it.q; S.phase = 'q';
    var C = 2 * Math.PI * 26;
    frame(progress() +
      '<div class="st-card st-q"><div class="st-row"><span class="st-qn">Question ' + (S.i + 1) + ' of ' + S.qs.length + '</span><span class="st-pack ' + (PACK_CLASS[q.pack] || '') + '">' + esc(BANK.packs[q.pack].label) + '</span>' +
      '<span class="st-timer" role="timer" aria-label="Time left"><svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="26" class="bg"/><circle cx="30" cy="30" r="26" class="fg" style="stroke-dasharray:' + C + ';stroke-dashoffset:0"/></svg><b>' + S.T + '</b></span></div>' +
      (S.combo >= 2 ? '<p class="st-combo"><svg viewBox="0 0 24 24" aria-hidden="true">' + SHAPES[0] + '</svg>' + S.combo + ' in a row!</p>' : '') +
      '<h2 class="st-question">' + esc(q.q) + '</h2>' + whoLine() +
      '<div class="st-answers">' + it.order.map(function (oi, k) {
        return '<button type="button" class="ans a' + k + '" data-oi="' + oi + '"><span class="sh"><svg viewBox="0 0 24 24" aria-hidden="true">' + SHAPES[k] + '</svg></span><span class="tx">' + esc(q.options[oi]) + '</span><span class="ky" aria-hidden="true">' + (k + 1) + '</span></button>';
      }).join('') + '</div></div><div class="st-sheet" hidden></div>');
    stage.querySelectorAll('.ans').forEach(function (b) { b.addEventListener('click', function () { answer(+b.dataset.oi, b); }); });
    var c = stage.querySelector('.st-change'); if (c) c.addEventListener('click', function () { var keep = S; stopTimer(); showWho(function () { S = keep; showQ(); }); });
    startTimer(C);
  }

  function startTimer(C) {
    stopTimer(); var t0 = Date.now(), T = S.T * 1000, ring = stage.querySelector('.st-timer .fg'), num = stage.querySelector('.st-timer b'), wrap = stage.querySelector('.st-timer');
    S.t0 = t0;
    timer = setInterval(function () {
      var left = Math.max(0, T - (Date.now() - t0));
      if (ring) ring.style.strokeDashoffset = (C * (1 - left / T)).toFixed(2);
      if (num) num.textContent = Math.ceil(left / 1000);
      if (wrap) wrap.classList.toggle('low', left <= 5000);
      if (left <= 0) { stopTimer(); answer(-1, null); }
    }, 100);
  }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

  function answer(oi, btn) {
    if (S.phase !== 'q') return; S.phase = 'a'; stopTimer();
    var it = S.qs[S.i], q = it.q, ok = oi === q.answer, left = Math.max(0, S.T * 1000 - (Date.now() - S.t0));
    var gain = ok ? 100 + Math.round(50 * left / (S.T * 1000)) : 0;
    S.marks[S.i] = ok; if (ok) { S.score++; S.combo++; S.best = Math.max(S.best, S.combo); } else S.combo = 0; S.pts += gain;
    stage.querySelectorAll('.ans').forEach(function (b) { b.disabled = true; var v = +b.dataset.oi; if (v === q.answer) b.classList.add('right'); else if (v === oi) b.classList.add('wrong'); else b.classList.add('dim'); });
    var pts = stage.querySelector('.st-pts b'); if (pts) { pts.textContent = fmt(S.pts); if (ok) { pts.parentNode.classList.remove('bump'); void pts.offsetWidth; pts.parentNode.classList.add('bump'); } }
    if (ok && btn) pop(btn, '+' + gain);
    if (!ok && btn) btn.classList.add('shake');
    var sheet = stage.querySelector('.st-sheet'); sheet.hidden = false;
    var src = q.source ? '<a class="st-src" href="' + esc(q.source.url) + '"' + (/^https?:/.test(q.source.url) ? ' target="_blank" rel="noopener"' : '') + '>Source: ' + esc(q.source.label) + ' &rarr;</a>' : '';
    var last = S.i >= S.qs.length - 1;
    sheet.className = 'st-sheet ' + (ok ? 'ok' : 'no');
    sheet.innerHTML = '<div class="st-verdict"><span class="vi" aria-hidden="true">' + (ok ? '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7 7 17"/></svg>') + '</span><div><b>' +
      (ok ? (S.combo >= 3 ? 'On fire! ' : 'Correct! ') + '+' + gain + ' pts' : oi === -1 ? 'Time&rsquo;s up!' : 'Not quite.') + '</b>' +
      '<p>' + esc(q.explain) + '</p>' + src + '</div></div><button type="button" class="pg-btn ' + (ok ? 'gold' : 'light') + ' wide st-next" data-focus>' + (last ? 'See my score' : 'Next question') + '</button>';
    var nb = sheet.querySelector('.st-next');
    nb.addEventListener('click', function () { S.i++; if (S.i < S.qs.length) showQ(); else results(); });
    setTimeout(function () { try { nb.focus({ preventScroll: true }); } catch (e) {} }, 50);
  }

  function pop(el, text) {
    if (reduce) return;
    var r = el.getBoundingClientRect(), p = document.createElement('span');
    p.className = 'st-pop'; p.textContent = text; p.style.left = (r.left + r.width / 2) + 'px'; p.style.top = (r.top + 6) + 'px';
    stage.appendChild(p); setTimeout(function () { p.remove(); }, 1100);
  }

  /* ---------- results ---------- */
  function rank(sc, n) { var f = sc / n; return f === 1 ? ['Pillar of Fire', 'A perfect score. The fire of God is in you!'] : f >= .8 ? ['Burning Bush', 'Excellent! You know your Word.'] : f >= .6 ? ['Rising Flame', 'Well done! Come back tomorrow and climb higher.'] : f >= .4 ? ['Spark', 'Good start. Every day you play, you grow.'] : ['Kindling', '“Study to shew thyself approved unto God.” — 2 Timothy 2:15']; }

  function addScore() {
    var p = player(); if (!p || p.guest || S.added) return;
    var mine = ls('mfm-quiz-local') || [];
    mine.push({ nick: p.nick, branch: p.branch === OTHER ? 'Visitors & friends' : p.branch, place: placeOf(p), score: S.score, pts: S.pts, n: S.qs.length, day: S.today, mode: S.mode });
    ls('mfm-quiz-local', mine); S.added = true;
  }

  function results() {
    S.phase = 'r';
    var n = S.qs.length, rk = rank(S.score, n), C = 2 * Math.PI * 70;
    var streak = ls('mfm-quiz-streak') || { last: null, n: 0 };
    if (S.mode === 'daily' && streak.last !== S.today) {
      var y = new Date(Date.parse(S.today + 'T12:00:00Z') - 864e5).toISOString().slice(0, 10);
      streak.n = streak.last === y ? streak.n + 1 : 1; streak.last = S.today; ls('mfm-quiz-streak', streak);
    }
    var best = ls('mfm-pg-best'); if (!best || best.day !== S.today || S.pts > best.pts) ls('mfm-pg-best', { day: S.today, pts: Math.max(S.pts, best && best.day === S.today ? best.pts : 0) });
    addScore();
    var p = player() || {};
    var line = S.marks.map(function (m) { return m ? '🔥' : '⬜'; }).join('');
    var share = 'MFM Play & Grow — ' + titleOf() + ': ' + S.score + '/' + n + ' (' + fmt(S.pts) + ' pts)\n' + line + '\nCan you beat me? https://mfmmegaregion2usa.org/play';
    var lb = p.guest
      ? '<div class="st-lb"><b>Want your points on the leaderboard?</b><button type="button" class="pg-btn light st-join">Add my name and branch</button></div>'
      : '<div class="st-lb"><span class="st-mini big">' + esc(initials(p.nick)) + '</span><span><b>+' + fmt(S.pts) + ' pts for ' + esc(placeOf(p)) + '</b><small>Added to this week&rsquo;s leaderboard</small></span></div>';
    frame('<div class="st-confetti" aria-hidden="true"></div><div class="st-card st-res">' +
      '<p class="st-k">' + esc(titleOf()) + '</p>' +
      '<div class="st-ring"><svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="70" class="bg"/><circle cx="80" cy="80" r="70" class="fg" style="stroke-dasharray:' + C + ';stroke-dashoffset:' + C + '" data-to="' + (C * (1 - S.score / n)).toFixed(2) + '"/></svg><div><b>' + S.score + '<small>/' + n + '</small></b><span>correct</span></div></div>' +
      '<h2 class="st-rank">' + esc(rk[0]) + '</h2><p class="st-msg">' + esc(rk[1]) + '</p>' +
      '<div class="st-marks">' + S.marks.map(function (m, k) { return '<span class="' + (m ? 'ok' : 'no') + '" style="--d:' + (k * 90) + 'ms"><svg viewBox="0 0 24 24" aria-hidden="true">' + (m ? SHAPES[0] : '<path d="M7 7l10 10M17 7 7 17"/>') + '</svg></span>'; }).join('') + '</div>' +
      '<div class="st-tally"><div><b>' + fmt(S.pts) + '</b><small>points</small></div><div><b>' + S.best + '</b><small>best combo</small></div>' + (S.mode === 'daily' ? '<div><b>' + streak.n + '</b><small>day streak</small></div>' : '') + '</div>' + lb +
      '<div class="st-acts"><a class="pg-btn green" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(share) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"/></svg>Challenge on WhatsApp</a><button type="button" class="pg-btn light st-copy">Copy my score</button></div>' +
      '<div class="st-acts two"><button type="button" class="pg-btn ghost st-more">Play another game</button><button type="button" class="pg-btn ghost st-board">See the leaderboard</button></div></div>', 'done');
    var fg = stage.querySelector('.st-ring .fg'); setTimeout(function () { if (fg) fg.style.strokeDashoffset = fg.getAttribute('data-to'); }, 120);
    if (S.score >= Math.ceil(n * .6)) confetti();
    stage.querySelector('.st-copy').addEventListener('click', function (e) { var b = e.currentTarget; try { navigator.clipboard.writeText(share).then(function () { b.textContent = 'Copied!'; }, function () { b.textContent = 'Copy not allowed here'; }); } catch (x) { b.textContent = 'Copy not allowed here'; } });
    stage.querySelector('.st-more').addEventListener('click', function () { close(); scrollToId('pg-games-h'); });
    stage.querySelector('.st-board').addEventListener('click', function () { close(); scrollToId('leaderboard'); });
    var j = stage.querySelector('.st-join'); if (j) j.addEventListener('click', function () { var keep = S; showWho(function () { S = keep; S.added = false; addScore(); results(); }, true); });
  }
  function scrollToId(id) { var el = document.getElementById(id); if (el) setTimeout(function () { el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }, 240); }

  function confetti() {
    if (reduce) return; var box = stage.querySelector('.st-confetti'); if (!box) return;
    var cols = ['#e0ad45', '#ff8a3d', '#e2451d', '#2c63d6', '#1f9d63', '#fff3d6'], h = '';
    for (var i = 0; i < 70; i++) h += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;background:' + cols[i % cols.length] + ';--r:' + Math.round(Math.random() * 720 - 360) + 'deg;--x:' + Math.round(Math.random() * 120 - 60) + 'px;animation-delay:' + (Math.random() * .6).toFixed(2) + 's;animation-duration:' + (2.2 + Math.random() * 1.6).toFixed(2) + 's;width:' + (6 + Math.round(Math.random() * 6)) + 'px"></i>';
    box.innerHTML = h;
  }

  /* ---------- hub: leaderboard, stats, countdowns ---------- */
  var SAMPLE_BR = [["MFM USA Prayer City", 18420], ["MFM Revival Chapel", 16980], ["MFM Dallas", 15210], ["MFM Tampa", 13870], ["MFM Mega Region 2 Youth Church", 12440], ["MFM Riverdale", 10960], ["MFM The Lord Has Spoken", 9870], ["Visitors & friends", 4210]];
  var SAMPLE_PL = [["Grace", "MFM Revival Chapel", 1420], ["Tobi", "MFM Mega Region 2 Youth Church", 1385], ["Esther", "MFM USA Prayer City", 1340], ["Daniel", "MFM Dallas", 1290], ["Ruth", "London, UK", 1240], ["Samuel", "MFM Riverdale", 1180], ["Joy", "MFM Tampa", 1120], ["Peter", "MFM Nashville", 1050]];
  function rows(tab) {
    var mine = ls('mfm-quiz-local') || [];
    if (tab === 'branches') {
      var m = {}; SAMPLE_BR.forEach(function (x) { m[x[0]] = x[1]; }); mine.forEach(function (s) { m[s.branch] = (m[s.branch] || 0) + (s.pts != null ? s.pts : s.score * 100); });
      return Object.keys(m).map(function (k) { return { name: k, sub: '', pts: m[k] }; }).sort(function (a, b) { return b.pts - a.pts; }).slice(0, 10);
    }
    var p = SAMPLE_PL.map(function (x) { return { name: x[0], sub: x[1], pts: x[2] }; }), tot = {};
    mine.forEach(function (s) { var k = s.nick + '|' + (s.place || s.branch); tot[k] = (tot[k] || 0) + (s.pts != null ? s.pts : s.score * 100); });
    Object.keys(tot).forEach(function (k) { var a = k.split('|'); p.push({ name: a[0] + ' (you)', sub: a[1], pts: tot[k], me: true }); });
    return p.sort(function (a, b) { return b.pts - a.pts; }).slice(0, 10);
  }
  function renderBoard() {
    var list = document.getElementById('lb-body'), pod = document.getElementById('pg-podium'); if (!list || !pod) return;
    var tab = list.dataset.tab || 'branches', r = rows(tab), top = r[0] ? r[0].pts : 1;
    var order = [1, 0, 2];
    pod.innerHTML = order.map(function (i) { var x = r[i]; if (!x) return ''; return '<div class="pod p' + (i + 1) + (x.me ? ' me' : '') + '"><span class="pod-av">' + (tab === 'branches' ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v3M10.5 4.5h3M5 21v-8l7-5 7 5v8Z"/></svg>' : esc(initials(x.name))) + '</span><b class="pod-n">' + esc(x.name) + '</b>' + (x.sub ? '<small>' + esc(x.sub) + '</small>' : '') + '<span class="pod-pts">' + fmt(x.pts) + ' pts</span><span class="pod-block"><i>' + (i + 1) + '</i></span></div>'; }).join('');
    list.innerHTML = r.slice(3).map(function (x, k) { return '<li' + (x.me ? ' class="me"' : '') + '><b class="lb-rank">' + (k + 4) + '</b><span class="lb-name">' + esc(x.name) + (x.sub ? '<small>' + esc(x.sub) + '</small>' : '') + '</span><span class="lb-bar"><i style="width:' + Math.max(6, Math.round(x.pts / top * 100)) + '%"></i></span><span class="lb-pts">' + fmt(x.pts) + '</span></li>'; }).join('');
    var br = rows('branches'); document.querySelectorAll('[data-topbranch]').forEach(function (x) { x.textContent = br[0].name; });
    document.querySelectorAll('[data-heropodium]').forEach(function (hp) {
      hp.innerHTML = [1, 0, 2].map(function (i) { var x = br[i]; return x ? '<div class="hp p' + (i + 1) + '"><b>' + esc(x.name.replace(/^MFM /, '')) + '</b><span>' + fmt(x.pts) + ' pts</span><i>' + (i + 1) + '</i></div>' : ''; }).join('');
    });
  }
  document.querySelectorAll('.lb-tab').forEach(function (t) { t.addEventListener('click', function () { document.querySelectorAll('.lb-tab').forEach(function (x) { x.classList.toggle('on', x === t); x.setAttribute('aria-selected', x === t ? 'true' : 'false'); }); document.getElementById('lb-body').dataset.tab = t.dataset.tab; renderBoard(); }); });

  function tick() {
    var p = ctParts(), h = +p.hour % 24, secs = 86400 - (h * 3600 + (+p.minute) * 60 + (+p.second));
    var cd = pad(Math.floor(secs / 3600)) + ':' + pad(Math.floor(secs % 3600 / 60)) + ':' + pad(secs % 60);
    document.querySelectorAll('[data-countdown]').forEach(function (c) { c.textContent = cd; });
    var dow = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }[p.weekday], daysLeft = 6 - dow;
    var rt = daysLeft + 'd ' + Math.floor(secs / 3600) + 'h';
    var rs = document.getElementById('pg-reset'); if (rs) rs.textContent = rt;
    document.querySelectorAll('[data-reset]').forEach(function (x) { x.textContent = rt; });
  }
  function refreshHub() {
    var st = ls('mfm-quiz-streak'), n = st && st.n ? st.n : 0;
    document.querySelectorAll('[data-streak]').forEach(function (x) { x.textContent = n + (n === 1 ? ' day' : ' days'); });
    document.querySelectorAll('[data-streak-line]').forEach(function (x) { x.textContent = n ? n + '-day streak — keep the fire burning' : 'start your streak today'; });
    var b = ls('mfm-pg-best'); document.querySelectorAll('[data-best]').forEach(function (x) { x.textContent = b && b.day === ctToday() ? fmt(b.pts) + ' pts' : '—'; });
    renderBoard();
  }
  function embers() {
    var e = document.querySelector('.pg-embers'); if (!e || reduce) return; var h = '';
    for (var i = 0; i < 26; i++) h += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;--d:' + (6 + Math.random() * 8).toFixed(1) + 's;--delay:-' + (Math.random() * 12).toFixed(1) + 's;--s:' + (2 + Math.random() * 4).toFixed(1) + 'px;--x:' + Math.round(Math.random() * 80 - 40) + 'px"></i>';
    e.innerHTML = h;
  }
  function bindNl(scope) { scope.querySelectorAll('.nl-inline[data-preview] form').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); var o = f.parentNode.querySelector('.nl-inline-ok'); o.hidden = false; o.textContent = 'Preview only — sign-up is not sent from this preview.'; }); }); }

  function embers2() { document.querySelectorAll('.pg-embers').forEach(function (e) { if (e.innerHTML || reduce) return; var h = ''; for (var i = 0; i < 26; i++) h += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;--d:' + (6 + Math.random() * 8).toFixed(1) + 's;--delay:-' + (Math.random() * 12).toFixed(1) + 's;--s:' + (2 + Math.random() * 4).toFixed(1) + 'px;--x:' + Math.round(Math.random() * 80 - 40) + 'px"></i>'; e.innerHTML = h; }); }
  function hero(n) { document.querySelectorAll('[data-hero]').forEach(function (h) { h.hidden = h.getAttribute('data-hero') != n; }); document.querySelectorAll('[data-hpick]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-hpick') == n ? 'true' : 'false'); }); }
  document.querySelectorAll('[data-hpick]').forEach(function (b) { b.addEventListener('click', function () { hero(+b.getAttribute('data-hpick')); }); });
  var hq = /hero-(\d)/.exec(location.hash || ''), first = document.querySelector('[data-hero]'); if (hq) hero(+hq[1]); else if (first) hero(+first.getAttribute('data-hero'));
  embers(); embers2(); tick(); setInterval(tick, 1000);
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-mode]'); if (b && !stage.contains(b)) start(b.dataset.mode, b.dataset.pack || null); });
  bindNl(document);
  fetch('/js/quiz-bank.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (b) {
    BANK = b;
    var dn = dayNo(ctToday()), dt = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/Chicago' });
    document.querySelectorAll('[data-dayline]').forEach(function (x) { x.textContent = x.classList.contains('hv3-date') ? new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Chicago' }) : 'Day #' + dn + ' · ' + dt; });
    document.querySelectorAll('[data-dayno]').forEach(function (x) { x.textContent = '#' + dn; });
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = BANK.questions.filter(function (q) { return q.pack === el.dataset.count; }).length + ' questions'; });
    refreshHub();
  });
})();
