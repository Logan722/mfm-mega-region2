/* MFM Mega Region 2 — Play & Grow (quiz engine). PREVIEW build.
   Daily quiz is the same for everyone each day (seeded by date, CT).
   Leaderboard in this preview is local + sample data; production = Netlify Function + Netlify Blobs. */
(function () {
  'use strict';
  var root = document.getElementById('play-app');
  if (!root) return;
  var BANK = null, state = null;
  var BRANCHES = ["MFM USA Prayer City","MFM Rehoboth","MFM Revival Chapel","MFM Houston 2","MFM Houston 3 — City of Refuge","MFM Houston 5 — New Glory","MFM 7 North Houston","MFM Greater Grace","MFM Northwest Houston","MFM Dallas","MFM House of His Glory","MFM Arlington","MFM Arlington — Matlock","MFM Grand Prairie","MFM Irving","MFM Mansfield","MFM The Lord Has Spoken","MFM San Antonio","MFM Pearland — Shadow of God","MFM Sugar Land","MFM Huntsville","MFM Tampa","MFM Broward","MFM Miami — Mount Zion","MFM Orlando — Citadel of Solution","MFM Tallahassee","MFM Revival Center","MFM Riverdale","MFM Citadel of Signs & Wonders","MFM Georgia Oasis of Grace","MFM Revival & Solution Center","MFM Tulsa","MFM Nashville","MFM Mega Region 2 Youth Church","Visiting / other"];

  function ls(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ctToday() { var d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function dayNo(today) { var a = Date.parse(BANK.launch + 'T00:00:00Z'), b = Date.parse(today + 'T00:00:00Z'); return Math.max(1, Math.floor((b - a) / 864e5) + 1); }
  function rng(seed) { var h = 2166136261; for (var i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); } return function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1e6) / 1e6; }; }
  function shuffle(arr, r) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(pack, n, r, level) { return shuffle(BANK.questions.filter(function (q) { return (!pack || q.pack === pack) && (!level || q.level === level); }), r).slice(0, n); }

  function dailySet(today) {
    var r = rng('daily-' + today), set = [];
    set = set.concat(pick('bible', 1, r), pick('verse', 1, r), pick('mfm', 1, r), pick(r() < .5 ? 'oni-books' : 'go-books', 1, r), pick('messages', 1, r));
    return set;
  }

  function start(mode, pack) {
    var today = ctToday(), r = rng(mode + pack + today + (mode === 'daily' ? '' : Math.random()));
    var qs = mode === 'daily' ? dailySet(today) : mode === 'kids' ? pick(null, 5, r, 'kids') : pick(pack, 5, r);
    state = { mode: mode, pack: pack, today: today, qs: qs.map(function (q) { var order = shuffle(q.options.map(function (o, i) { return i; }), r); return { q: q, order: order }; }), i: 0, score: 0, marks: [] };
    root.classList.toggle('kids', mode === 'kids');
    showQ();
    var top = document.getElementById('play-top'); if (top) top.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function title() { if (state.mode === 'daily') return 'Daily Quiz #' + dayNo(state.today); if (state.mode === 'kids') return 'Kids Quiz'; return BANK.packs[state.pack].label; }

  function showQ() {
    var it = state.qs[state.i], q = it.q;
    var dots = state.qs.map(function (x, k) { return '<i class="' + (k < state.i ? (state.marks[k] ? 'ok' : 'no') : k === state.i ? 'now' : '') + '"></i>'; }).join('');
    root.innerHTML = '<div class="qz-card" id="play-top"><div class="qz-head"><span class="qz-title">' + esc(title()) + '</span><span class="qz-dots">' + dots + '</span></div>' +
      '<p class="qz-pack">' + esc(BANK.packs[q.pack].label) + '</p><h2 class="qz-q">' + esc(q.q) + '</h2><div class="qz-opts">' +
      it.order.map(function (oi, k) { return '<button type="button" class="qz-opt" data-oi="' + oi + '"><b>' + 'ABCD'[k] + '</b><span>' + esc(q.options[oi]) + '</span></button>'; }).join('') +
      '</div><div class="qz-after" hidden></div></div>';
    root.querySelectorAll('.qz-opt').forEach(function (b) { b.addEventListener('click', answer); });
  }

  function answer(e) {
    var it = state.qs[state.i], q = it.q, oi = +e.currentTarget.dataset.oi, ok = oi === q.answer;
    state.marks[state.i] = ok; if (ok) state.score++;
    root.querySelectorAll('.qz-opt').forEach(function (b) { b.disabled = true; var v = +b.dataset.oi; if (v === q.answer) b.classList.add('right'); else if (v === oi) b.classList.add('wrong'); });
    var after = root.querySelector('.qz-after'); after.hidden = false;
    var src = q.source ? '<a class="qz-src" href="' + esc(q.source.url) + '"' + (/^https?:/.test(q.source.url) ? ' target="_blank" rel="noopener"' : '') + '>Source: ' + esc(q.source.label) + ' →</a>' : '';
    after.innerHTML = '<p class="qz-verdict ' + (ok ? 'ok' : 'no') + '">' + (ok ? 'Correct! 🔥' : 'Not quite.') + '</p><p class="qz-explain">' + esc(q.explain) + '</p>' + src +
      '<button type="button" class="qz-next">' + (state.i < state.qs.length - 1 ? 'Next question →' : 'See my score →') + '</button>';
    after.querySelector('.qz-next').addEventListener('click', function () { state.i++; if (state.i < state.qs.length) showQ(); else results(); });
  }

  function results() {
    var n = state.qs.length, line = state.marks.map(function (m) { return m ? '🔥' : '⬜'; }).join('');
    var streak = ls('mfm-quiz-streak') || { last: null, n: 0 };
    if (state.mode === 'daily' && streak.last !== state.today) {
      var y = new Date(Date.parse(state.today + 'T12:00:00Z') - 864e5).toISOString().slice(0, 10);
      streak.n = streak.last === y ? streak.n + 1 : 1; streak.last = state.today; ls('mfm-quiz-streak', streak);
    }
    var share = 'MFM ' + title() + ': ' + state.score + '/' + n + '\n' + line + '\nCan you beat me? https://mfmmegaregion2usa.org/play';
    var me = ls('mfm-quiz-me') || {};
    root.innerHTML = '<div class="qz-card qz-res" id="play-top"><p class="qz-pack">' + esc(title()) + '</p><div class="qz-score">' + state.score + '<small>/' + n + '</small></div><p class="qz-line">' + line + '</p>' +
      '<p class="qz-msg">' + (state.score === n ? 'Perfect score! The fire of God is in you.' : state.score >= 3 ? 'Well done! Come back tomorrow for a new quiz.' : 'Keep going — “Study to shew thyself approved unto God” (2 Timothy 2:15).') + '</p>' +
      (state.mode === 'daily' ? '<p class="qz-streak">🔥 ' + streak.n + '-day streak</p>' : '') +
      '<div class="qz-share"><a class="qz-btn wa" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(share) + '">Share on WhatsApp</a><button type="button" class="qz-btn ghost qz-copy">Copy my score</button></div>' +
      '<form class="qz-lb" autocomplete="off"><p class="qz-lb-h">Add your score to the leaderboard</p><div class="qz-lb-row"><input name="nick" maxlength="20" placeholder="First name or nickname" value="' + esc(me.nick || '') + '" required><select name="branch" required><option value="">Your branch</option>' +
      BRANCHES.map(function (b) { return '<option' + (me.branch === b ? ' selected' : '') + '>' + esc(b) + '</option>'; }).join('') + '</select><button class="qz-btn" type="submit">Add my score</button></div><p class="qz-fine">Only your nickname, branch and score are shown. No email needed.</p></form>' +
      '<div class="qz-again"><button type="button" class="qz-btn ghost" data-mode="pack" data-pack="bible">Play the Bible pack</button><button type="button" class="qz-btn ghost" data-mode="pack" data-pack="mfm">Play MFM Family</button></div>' +
      '<div class="nl-inline" data-preview><p class="nl-inline-h">Get a new quiz pack every Monday</p><p class="nl-inline-p">Plus the week’s prayer points and declarations, free in your inbox.</p><form><input type="text" placeholder="First name"><input type="email" placeholder="Email address"><button type="submit">Subscribe</button></form><p class="nl-inline-ok" hidden>Preview only — sign-up is not sent from this preview.</p></div></div>';
    root.querySelector('.qz-copy').addEventListener('click', function (e) { try { navigator.clipboard.writeText(share); e.target.textContent = 'Copied ✓'; } catch (x) {} });
    root.querySelector('.qz-lb').addEventListener('submit', function (e) {
      e.preventDefault(); var f = e.target, nick = f.nick.value.trim().slice(0, 20), br = f.branch.value; if (!nick || !br) return;
      ls('mfm-quiz-me', { nick: nick, branch: br });
      var mine = ls('mfm-quiz-local') || []; mine.push({ nick: nick, branch: br, score: state.score, n: n, day: state.today }); ls('mfm-quiz-local', mine);
      f.innerHTML = '<p class="qz-lb-h">Added ✓ — see the leaderboard below.</p>'; renderBoard();
      var lb = document.getElementById('leaderboard'); if (lb) lb.scrollIntoView({ behavior: 'smooth' });
    });
    bindStarts(root); bindNl(root);
  }

  /* ---------- Leaderboard (preview: sample + your local scores) ---------- */
  var SAMPLE_BR = [["MFM USA Prayer City", 412], ["MFM Revival Chapel", 377], ["MFM Dallas", 351], ["MFM Tampa", 318], ["MFM Mega Region 2 Youth Church", 296], ["MFM Riverdale", 251], ["MFM The Lord Has Spoken", 238], ["MFM Nashville", 204]];
  var SAMPLE_PL = [["Grace", "MFM Revival Chapel", 35], ["Tobi", "MFM Mega Region 2 Youth Church", 34], ["Esther", "MFM USA Prayer City", 33], ["Daniel", "MFM Dallas", 31], ["Ruth", "MFM Tampa", 30], ["Samuel", "MFM Riverdale", 28]];
  function renderBoard() {
    var el = document.getElementById('lb-body'); if (!el) return;
    var tab = el.dataset.tab || 'branches', mine = ls('mfm-quiz-local') || [];
    var rows;
    if (tab === 'branches') {
      var m = {}; SAMPLE_BR.forEach(function (x) { m[x[0]] = x[1]; }); mine.forEach(function (s) { m[s.branch] = (m[s.branch] || 0) + s.score; });
      rows = Object.keys(m).map(function (k) { return [k, m[k]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 8);
      el.innerHTML = rows.map(function (r, i) { return '<li><b class="lb-rank r' + (i + 1) + '">' + (i + 1) + '</b><span class="lb-name">' + esc(r[0]) + '</span><span class="lb-pts">' + r[1] + ' pts</span></li>'; }).join('');
    } else {
      var p = SAMPLE_PL.map(function (x) { return x.slice(); }); var tot = {}; mine.forEach(function (s) { var k = s.nick + '|' + s.branch; tot[k] = (tot[k] || 0) + s.score; });
      Object.keys(tot).forEach(function (k) { var a = k.split('|'); p.push([a[0] + ' (you)', a[1], tot[k]]); });
      p.sort(function (a, b) { return b[2] - a[2]; });
      el.innerHTML = p.slice(0, 8).map(function (r, i) { return '<li><b class="lb-rank r' + (i + 1) + '">' + (i + 1) + '</b><span class="lb-name">' + esc(r[0]) + '<small>' + esc(r[1]) + '</small></span><span class="lb-pts">' + r[2] + ' pts</span></li>'; }).join('');
    }
  }
  document.querySelectorAll('.lb-tab').forEach(function (t) { t.addEventListener('click', function () { document.querySelectorAll('.lb-tab').forEach(function (x) { x.classList.toggle('on', x === t); x.setAttribute('aria-selected', x === t); }); document.getElementById('lb-body').dataset.tab = t.dataset.tab; renderBoard(); }); });

  function bindStarts(scope) { scope.querySelectorAll('[data-mode]').forEach(function (b) { b.addEventListener('click', function () { start(b.dataset.mode, b.dataset.pack || null); }); }); }
  function bindNl(scope) { scope.querySelectorAll('.nl-inline[data-preview] form').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); f.parentNode.querySelector('.nl-inline-ok').hidden = false; }); }); }

  fetch('/js/quiz-bank.json').then(function (r) { return r.json(); }).then(function (b) {
    BANK = b;
    var today = ctToday(), n = document.getElementById('qz-dayno'); if (n) n.textContent = '#' + dayNo(today);
    var st = ls('mfm-quiz-streak'), se = document.getElementById('qz-mystreak'); if (se && st && st.n) se.textContent = '🔥 Your streak: ' + st.n + (st.n === 1 ? ' day' : ' days');
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = BANK.questions.filter(function (q) { return q.pack === el.dataset.count; }).length + ' questions'; });
    bindStarts(document); bindNl(document); renderBoard();
  });
})();
