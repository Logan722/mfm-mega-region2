/* MFM Mega Region 2 — Play & Grow (quiz engine). PRIVATE PREVIEW build.
   - Daily quiz is the same for everyone each day (seeded by the date in Central Time).
   - "Who's playing?" step before the first question: name + branch (or "Other / visiting" + typed place),
     or "Just play" without the leaderboard. Remembered on this device.
   - Leaderboard in this preview = sample scores + this device's own scores.
     Production: Netlify Function + Netlify Blobs (server-checked, one score per device per day, weekly reset). */
(function () {
  'use strict';
  var root = document.getElementById('play-app');
  if (!root) return;
  var BANK = null, state = null;
  var OTHER = 'Other / visiting';
  var BRANCHES = ["MFM USA Prayer City","MFM Rehoboth","MFM Revival Chapel","MFM Houston 2","MFM Houston 3 — City of Refuge","MFM Houston 5 — New Glory","MFM 7 North Houston","MFM Greater Grace","MFM Northwest Houston","MFM Dallas","MFM House of His Glory","MFM Arlington","MFM Arlington — Matlock","MFM Grand Prairie","MFM Irving","MFM Mansfield","MFM The Lord Has Spoken","MFM San Antonio","MFM Pearland — Shadow of God","MFM Sugar Land","MFM Huntsville","MFM Tampa","MFM Broward","MFM Miami — Mount Zion","MFM Orlando — Citadel of Solution","MFM Tallahassee","MFM Revival Center","MFM Riverdale","MFM Citadel of Signs & Wonders","MFM Georgia Oasis of Grace","MFM Revival & Solution Center","MFM Tulsa","MFM Nashville","MFM Mega Region 2 Youth Church", OTHER];

  function ls(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ctToday() { var d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function dayNo(today) { var a = Date.parse(BANK.launch + 'T00:00:00Z'), b = Date.parse(today + 'T00:00:00Z'); return Math.max(1, Math.floor((b - a) / 864e5) + 1); }
  function rng(seed) { var h = 2166136261; for (var i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); } return function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1e6) / 1e6; }; }
  function shuffle(arr, r) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(pack, n, r, level) { return shuffle(BANK.questions.filter(function (q) { return (!pack || q.pack === pack) && (!level || q.level === level); }), r).slice(0, n); }
  function player() { return ls('mfm-quiz-me'); }
  function placeOf(p) { return p.branch === OTHER ? (p.other || 'Visiting') : p.branch; }
  function scrollTop() { var t = document.getElementById('play-top'); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  function dailySet(today) {
    var r = rng('daily-' + today);
    return [].concat(pick('bible', 1, r), pick('verse', 1, r), pick('mfm', 1, r), pick(r() < .5 ? 'oni-books' : 'go-books', 1, r), pick('messages', 1, r));
  }

  /* ---------- Who's playing? ---------- */
  function showWho(next, addOnly) {
    var me = player() || {};
    root.innerHTML = '<div class="qz-card qz-who" id="play-top"><p class="qz-pack">Before you start</p><h2 class="qz-q">Who&rsquo;s playing?</h2>' +
      '<form class="qz-whof" autocomplete="off" novalidate>' +
      '<label>Your name or nickname<input name="nick" maxlength="20" required value="' + esc(me.guest ? '' : me.nick || '') + '" placeholder="e.g. Grace"></label>' +
      '<label>Your branch<select name="branch" required><option value="">Choose your branch</option>' +
      BRANCHES.map(function (b) { return '<option' + (me.branch === b ? ' selected' : '') + '>' + esc(b) + '</option>'; }).join('') + '</select></label>' +
      '<label class="qz-other"' + (me.branch === OTHER ? '' : ' hidden') + '>Where are you joining from?<input name="other" maxlength="40" value="' + esc(me.other || '') + '" placeholder="Your church, city or country"></label>' +
      '<p class="qz-err" hidden>Please add your name and choose a branch (or &ldquo;Other / visiting&rdquo;).</p>' +
      '<button class="qz-btn" type="submit">' + (addOnly ? 'Add my score' : 'Start playing &rarr;') + '</button>' +
      (addOnly ? '' : '<button class="qz-skip" type="button">Just play &mdash; don&rsquo;t add me to the leaderboard</button>') +
      '<p class="qz-fine">Only your name and branch are shown on the leaderboard. No email, no account.</p></form></div>';
    var f = root.querySelector('form'), oth = root.querySelector('.qz-other');
    f.branch.addEventListener('change', function () { oth.hidden = f.branch.value !== OTHER; if (!oth.hidden) f.other.focus(); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var nick = f.nick.value.trim().slice(0, 20), br = f.branch.value, other = f.other.value.trim().slice(0, 40);
      if (!nick || !br || (br === OTHER && !other)) { root.querySelector('.qz-err').hidden = false; return; }
      ls('mfm-quiz-me', { nick: nick, branch: br, other: br === OTHER ? other : '', guest: false });
      next();
    });
    var sk = root.querySelector('.qz-skip');
    if (sk) sk.addEventListener('click', function () { ls('mfm-quiz-me', { guest: true }); next(); });
    scrollTop();
  }

  function start(mode, pack) {
    var go = function () { begin(mode, pack); };
    if (!player()) showWho(go); else go();
  }

  function begin(mode, pack) {
    var today = ctToday(), r = rng(mode + pack + today + (mode === 'daily' ? '' : Math.random()));
    var qs = mode === 'daily' ? dailySet(today) : mode === 'kids' ? pick(null, 5, r, 'kids') : pick(pack, 5, r);
    state = { mode: mode, pack: pack, today: today, qs: qs.map(function (q) { return { q: q, order: shuffle(q.options.map(function (o, i) { return i; }), r) }; }), i: 0, score: 0, marks: [] };
    root.classList.toggle('kids', mode === 'kids');
    showQ(); scrollTop();
  }

  function title() { if (state.mode === 'daily') return 'Daily Quiz #' + dayNo(state.today); if (state.mode === 'kids') return 'Kids Quiz'; return BANK.packs[state.pack].label; }
  function whoLine() { var p = player(); if (!p) return ''; return '<p class="qz-me">' + (p.guest ? 'Playing as a guest' : 'Playing as <b>' + esc(p.nick) + '</b> &middot; ' + esc(placeOf(p))) + ' &middot; <button type="button" class="qz-change">change</button></p>'; }

  function showQ() {
    var it = state.qs[state.i], q = it.q;
    var dots = state.qs.map(function (x, k) { return '<i class="' + (k < state.i ? (state.marks[k] ? 'ok' : 'no') : k === state.i ? 'now' : '') + '"></i>'; }).join('');
    root.innerHTML = '<div class="qz-card" id="play-top"><div class="qz-head"><span class="qz-title">' + esc(title()) + '</span><span class="qz-dots">' + dots + '</span></div>' + whoLine() +
      '<p class="qz-pack">' + esc(BANK.packs[q.pack].label) + '</p><h2 class="qz-q">' + esc(q.q) + '</h2><div class="qz-opts">' +
      it.order.map(function (oi, k) { return '<button type="button" class="qz-opt" data-oi="' + oi + '"><b>' + 'ABCD'[k] + '</b><span>' + esc(q.options[oi]) + '</span></button>'; }).join('') +
      '</div><div class="qz-after" hidden></div></div>';
    root.querySelectorAll('.qz-opt').forEach(function (b) { b.addEventListener('click', answer); });
    bindChange();
  }

  function bindChange() { var c = root.querySelector('.qz-change'); if (c) c.addEventListener('click', function () { var s = state, i = s.i; showWho(function () { state = s; state.i = i; showQ(); }); }); }

  function answer(e) {
    var it = state.qs[state.i], q = it.q, oi = +e.currentTarget.dataset.oi, ok = oi === q.answer;
    state.marks[state.i] = ok; if (ok) state.score++;
    root.querySelectorAll('.qz-opt').forEach(function (b) { b.disabled = true; var v = +b.dataset.oi; if (v === q.answer) b.classList.add('right'); else if (v === oi) b.classList.add('wrong'); });
    var after = root.querySelector('.qz-after'); after.hidden = false;
    var src = q.source ? '<a class="qz-src" href="' + esc(q.source.url) + '"' + (/^https?:/.test(q.source.url) ? ' target="_blank" rel="noopener"' : '') + '>Source: ' + esc(q.source.label) + ' &rarr;</a>' : '';
    after.innerHTML = '<p class="qz-verdict ' + (ok ? 'ok' : 'no') + '">' + (ok ? 'Correct! 🔥' : 'Not quite.') + '</p><p class="qz-explain">' + esc(q.explain) + '</p>' + src +
      '<button type="button" class="qz-next">' + (state.i < state.qs.length - 1 ? 'Next question &rarr;' : 'See my score &rarr;') + '</button>';
    after.querySelector('.qz-next').addEventListener('click', function () { state.i++; if (state.i < state.qs.length) showQ(); else results(); });
  }

  function addScore() {
    var p = player(); if (!p || p.guest || state.added) return;
    var mine = ls('mfm-quiz-local') || [];
    mine.push({ nick: p.nick, branch: p.branch === OTHER ? 'Visitors & friends' : p.branch, place: placeOf(p), score: state.score, n: state.qs.length, day: state.today });
    ls('mfm-quiz-local', mine); state.added = true; renderBoard();
  }

  function results() {
    var n = state.qs.length, line = state.marks.map(function (m) { return m ? '🔥' : '⬜'; }).join('');
    var streak = ls('mfm-quiz-streak') || { last: null, n: 0 };
    if (state.mode === 'daily' && streak.last !== state.today) {
      var y = new Date(Date.parse(state.today + 'T12:00:00Z') - 864e5).toISOString().slice(0, 10);
      streak.n = streak.last === y ? streak.n + 1 : 1; streak.last = state.today; ls('mfm-quiz-streak', streak);
    }
    addScore();
    var p = player() || {};
    var share = 'MFM ' + title() + ': ' + state.score + '/' + n + '\n' + line + '\nCan you beat me? https://mfmmegaregion2usa.org/play';
    var lbLine = p.guest
      ? '<div class="qz-lb"><p class="qz-lb-h">Want your score on the leaderboard?</p><button type="button" class="qz-btn qz-join">Add my name and branch</button></div>'
      : '<div class="qz-lb"><p class="qz-lb-h">Added to the leaderboard ✓</p><p class="qz-fine" style="margin:0">' + esc(p.nick) + ' &middot; ' + esc(placeOf(p)) + ' &middot; <a href="#leaderboard">see the board</a></p></div>';
    root.innerHTML = '<div class="qz-card qz-res" id="play-top"><p class="qz-pack">' + esc(title()) + '</p><div class="qz-score">' + state.score + '<small>/' + n + '</small></div><p class="qz-line">' + line + '</p>' +
      '<p class="qz-msg">' + (state.score === n ? 'Perfect score! The fire of God is in you.' : state.score >= 3 ? 'Well done! Come back tomorrow for a new quiz.' : 'Keep going &mdash; &ldquo;Study to shew thyself approved unto God&rdquo; (2 Timothy 2:15).') + '</p>' +
      (state.mode === 'daily' ? '<p class="qz-streak">🔥 ' + streak.n + '-day streak</p>' : '') +
      '<div class="qz-share"><a class="qz-btn wa" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(share) + '">Share on WhatsApp</a><button type="button" class="qz-btn ghost qz-copy">Copy my score</button></div>' + lbLine +
      '<div class="qz-again"><button type="button" class="qz-btn ghost" data-mode="pack" data-pack="bible">Play the Bible pack</button><button type="button" class="qz-btn ghost" data-mode="pack" data-pack="mfm">Play MFM Family</button></div>' +
      '<div class="nl-inline" data-preview><p class="nl-inline-h">Get a new quiz pack every Monday</p><p class="nl-inline-p">With the week&rsquo;s prayer points and declarations &mdash; and the MFM Mega Region 2 newsletter.</p><form><input type="text" placeholder="First name" aria-label="First name"><input type="email" placeholder="Email address" aria-label="Email address"><button type="submit">Subscribe</button></form><p class="nl-inline-ok" hidden></p></div></div>';
    root.querySelector('.qz-copy').addEventListener('click', function (e) { try { navigator.clipboard.writeText(share).then(function () { e.target.textContent = 'Copied ✓'; }, function () {}); } catch (x) {} });
    var j = root.querySelector('.qz-join');
    if (j) j.addEventListener('click', function () { var s = state; showWho(function () { state = s; addScore(); results(); }, true); });
    bindStarts(root); bindNl(root); scrollTop();
  }

  /* ---------- Leaderboard (preview: sample + this device's scores) ---------- */
  var SAMPLE_BR = [["MFM USA Prayer City", 412], ["MFM Revival Chapel", 377], ["MFM Dallas", 351], ["MFM Tampa", 318], ["MFM Mega Region 2 Youth Church", 296], ["MFM Riverdale", 251], ["MFM The Lord Has Spoken", 238], ["Visitors & friends", 120]];
  var SAMPLE_PL = [["Grace", "MFM Revival Chapel", 35], ["Tobi", "MFM Mega Region 2 Youth Church", 34], ["Esther", "MFM USA Prayer City", 33], ["Daniel", "MFM Dallas", 31], ["Ruth", "London, UK", 30], ["Samuel", "MFM Riverdale", 28]];
  function renderBoard() {
    var el = document.getElementById('lb-body'); if (!el) return;
    var tab = el.dataset.tab || 'branches', mine = ls('mfm-quiz-local') || [];
    if (tab === 'branches') {
      var m = {}; SAMPLE_BR.forEach(function (x) { m[x[0]] = x[1]; }); mine.forEach(function (s) { m[s.branch] = (m[s.branch] || 0) + s.score; });
      el.innerHTML = Object.keys(m).map(function (k) { return [k, m[k]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 8)
        .map(function (r, i) { return '<li><b class="lb-rank r' + (i + 1) + '">' + (i + 1) + '</b><span class="lb-name">' + esc(r[0]) + '</span><span class="lb-pts">' + r[1] + ' pts</span></li>'; }).join('');
    } else {
      var p = SAMPLE_PL.map(function (x) { return x.slice(); }), tot = {};
      mine.forEach(function (s) { var k = s.nick + '|' + (s.place || s.branch); tot[k] = (tot[k] || 0) + s.score; });
      Object.keys(tot).forEach(function (k) { var a = k.split('|'); p.push([a[0] + ' (you)', a[1], tot[k]]); });
      p.sort(function (a, b) { return b[2] - a[2]; });
      el.innerHTML = p.slice(0, 8).map(function (r, i) { return '<li><b class="lb-rank r' + (i + 1) + '">' + (i + 1) + '</b><span class="lb-name">' + esc(r[0]) + '<small>' + esc(r[1]) + '</small></span><span class="lb-pts">' + r[2] + ' pts</span></li>'; }).join('');
    }
  }
  document.querySelectorAll('.lb-tab').forEach(function (t) { t.addEventListener('click', function () { document.querySelectorAll('.lb-tab').forEach(function (x) { x.classList.toggle('on', x === t); x.setAttribute('aria-selected', x === t); }); document.getElementById('lb-body').dataset.tab = t.dataset.tab; renderBoard(); }); });

  function bindStarts(scope) { scope.querySelectorAll('[data-mode]').forEach(function (b) { b.addEventListener('click', function () { start(b.dataset.mode, b.dataset.pack || null); }); }); }
  function bindNl(scope) { scope.querySelectorAll('.nl-inline[data-preview] form').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); var o = f.parentNode.querySelector('.nl-inline-ok'); o.hidden = false; o.textContent = 'Preview only — sign-up is not sent from this preview.'; }); }); }

  fetch('/js/quiz-bank.json').then(function (r) { return r.json(); }).then(function (b) {
    BANK = b;
    var n = document.getElementById('qz-dayno'); if (n) n.textContent = '#' + dayNo(ctToday());
    var st = ls('mfm-quiz-streak'), se = document.getElementById('qz-mystreak'); if (se && st && st.n) se.textContent = '🔥 Your streak: ' + st.n + (st.n === 1 ? ' day' : ' days');
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = BANK.questions.filter(function (q) { return q.pack === el.dataset.count; }).length + ' questions'; });
    bindStarts(document); bindNl(document); renderBoard();
  });
})();
