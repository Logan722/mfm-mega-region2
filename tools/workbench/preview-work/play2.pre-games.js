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
  var PACK_CLASS = { bible: 'c-bible', verse: 'c-verse', mfm: 'c-mfm', 'go-books': 'c-go', 'oni-books': 'c-oni', messages: 'c-msg', who: 'c-who', kids: 'c-kids', blitz: 'c-blitz' };
  var ROUND = 10, LAZY = { bible: 1, verse: 1, who: 1, kids: 1, 'oni-books': 1, blitz: 1 }, PREFIX = { B: 'bible', V: 'verse', W: 'who', K: 'kids', O: 'oni-books', Z: 'blitz' }, loaded = {}, WORDS = null, CH = null;
  var SITE = 'https://mfmmegaregion2usa.org/play';
  /* topics = question banks you can mix (Dawn, Nov 26: Who Said It? and Fill the Verse are mixed into the Bible) */
  var TOPICS = [{ k: 'bible', label: 'The Bible', packs: ['bible', 'verse', 'who'] }, { k: 'oni', label: 'Pastor Oni\u2019s Books', packs: ['oni-books'] }, { k: 'go', label: 'The G.O.\u2019s Books', packs: ['go-books'] }, { k: 'mfm', label: 'MFM Family', packs: ['mfm'] }, { k: 'msg', label: 'Our Messages', packs: ['messages'] }];
  var ALLT = TOPICS.map(function (t) { return t.k; });
  function topicPacks(keys) { var o = []; TOPICS.forEach(function (t) { if (keys.indexOf(t.k) >= 0) o = o.concat(t.packs); }); return o; }
  function mixQs(keys, n, r) {
    var lists = TOPICS.filter(function (t) { return keys.indexOf(t.k) >= 0; }).map(function (t) {
      var per = t.packs.map(function (p) { return fresh(p, n, r); }), out = [];
      for (var i = 0; out.length < n && i < n * t.packs.length; i++) { var l = per[i % per.length], q = l[Math.floor(i / per.length)]; if (q) out.push(q); }
      return out;
    });
    var qs = []; for (var j = 0; qs.length < n && j < n * lists.length; j++) { var q2 = lists[j % lists.length][Math.floor(j / lists.length)]; if (q2) qs.push(q2); }
    return shuffle(qs, r);
  }
  function topicChips(sel) {
    return '<fieldset class="tp"><legend>Questions from</legend><div class="tp-chips"><button type="button" class="tp-chip mix" data-tk="all" aria-pressed="' + (sel.length === ALLT.length) + '">Mix it up</button>' +
      TOPICS.map(function (t) { return '<button type="button" class="tp-chip" data-tk="' + t.k + '" aria-pressed="' + (sel.indexOf(t.k) >= 0) + '">' + esc(t.label) + '</button>'; }).join('') + '</div></fieldset>';
  }
  function bindChips(box) {
    var sel = function () { return [].slice.call(box.querySelectorAll('.tp-chip:not(.mix)[aria-pressed=true]')).map(function (b) { return b.getAttribute('data-tk'); }); };
    var sync = function () { box.querySelector('.tp-chip.mix').setAttribute('aria-pressed', sel().length === ALLT.length ? 'true' : 'false'); };
    box.querySelectorAll('.tp-chip').forEach(function (b) { b.addEventListener('click', function () {
      if (b.classList.contains('mix')) { var on = b.getAttribute('aria-pressed') !== 'true'; box.querySelectorAll('.tp-chip').forEach(function (c) { c.setAttribute('aria-pressed', on ? 'true' : 'false'); }); }
      else { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); sync(); }
    }); });
    return sel;
  }
  function topicName(keys) { if (keys.length === ALLT.length) return 'Mix it up'; if (keys.length === 1) return TOPICS.filter(function (t) { return t.k === keys[0]; })[0].label; return 'Your mix'; }
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
  /* lazy packs: the big banks load only when a game needs them */
  function need(packs) {
    return Promise.all(packs.filter(function (p) { return LAZY[p] && !loaded[p]; }).map(function (p) {
      return fetch('/js/quiz/' + p + '.json' + qv(p)).then(function (r) { return r.json(); }).then(function (a) { if (loaded[p]) return; loaded[p] = 1; BANK.questions = BANK.questions.filter(function (q) { return q.pack !== p; }).concat(a); });
    }));
  }
  /* /js/* is cached for a year, so every pack URL carries its content hash from the (always revalidated) core bank */
  function qv(p) { return BANK && BANK.lazy && BANK.lazy[p] ? '?v=' + BANK.lazy[p] : ''; }
  function needWords() { return WORDS ? Promise.resolve() : fetch('/js/quiz/words.json' + qv('words')).then(function (r) { return r.json(); }).then(function (w) { WORDS = w; WORDS.set = {}; w.valid.forEach(function (x) { WORDS.set[x] = 1; }); }); }
  /* replay = fresh questions: what you've seen is remembered per pack until the whole pack has been played */
  function seenMap() { return ls('mfm-quiz-seen') || {}; }
  function fresh(pack, n, r) {
    var all = BANK.questions.filter(function (q) { return q.pack === pack; }), sm = seenMap(), seen = {};
    (sm[pack] || []).forEach(function (id) { seen[id] = 1; });
    var un = shuffle(all.filter(function (q) { return !seen[q.id]; }), r);
    if (pack === 'messages') { un.sort(function (a, b) { return (b.date || '') < (a.date || '') ? -1 : (b.date || '') > (a.date || '') ? 1 : 0; }); un = shuffle(un.slice(0, n * 2), r).concat(un.slice(n * 2)); }  /* newest messages first */
    if (un.length < n) { sm[pack] = []; ls('mfm-quiz-seen', sm); un = un.concat(shuffle(all.filter(function (q) { return seen[q.id]; }), r)); }
    return un.slice(0, n);
  }
  function markSeen(qs) { var sm = seenMap(); qs.forEach(function (q) { (sm[q.pack] = sm[q.pack] || []).push(q.id); }); ls('mfm-quiz-seen', sm); }
  function byIds(ids) { var m = {}; BANK.questions.forEach(function (q) { m[q.id] = q; }); return ids.map(function (i) { return m[i]; }).filter(Boolean); }
  function packsOfIds(ids) { var o = {}; ids.forEach(function (i) { var p = PREFIX[i.split('-')[0]]; if (p && i.indexOf('-') > 0) o[p] = 1; }); return Object.keys(o); }
  function player() { return ls('mfm-quiz-me'); }
  function placeOf(p) { return p.branch === OTHER ? (p.other || 'Visiting') : p.branch; }
  function initials(n) { n = (n || '').trim(); if (!n) return '?'; var w = n.split(/\s+/); return (w[0][0] + (w[1] ? w[1][0] : '')).toUpperCase(); }
  function pad(n) { return ('0' + n).slice(-2); }
  function fmt(n) { return Number(n).toLocaleString('en-US'); }
  function dailySet(today) { var r = rng('daily-' + today); return [].concat(pick('bible', 3, r), pick('verse', 2, r), pick('who', 2, r), pick('mfm', 1, r), pick(r() < .65 ? 'oni-books' : 'go-books', 1, r), pick('messages', 1, r)); }
  function titleOf() { if (S.mode === 'daily') return 'Daily 10 · Day ' + dayNo(S.today); if (S.mode === 'kids') return 'Kids Mode'; if (S.mode === 'blitz') return '60-second Blitz'; if (S.mode === 'word') return S.practice ? 'Word practice' : 'Word of the Day · Day ' + dayNo(S.today); if (S.mode === 'team') return 'Team Battle'; if (S.mode === 'quiz') return 'Quiz \u00b7 ' + (S.topics ? topicName(S.topics) : 'Challenge'); return BANK.packs[S.pack] ? BANK.packs[S.pack].label : 'Play & Grow'; }

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
    if (S && S.phase === 'bz') { if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 't') blitzAnswer(true); if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'f') blitzAnswer(false); }
    if (S && S.phase === 'wd') { if (e.key === 'Enter') wordKey('ENTER'); else if (e.key === 'Backspace') wordKey('DEL'); else if (/^[a-z]$/i.test(e.key)) wordKey(e.key.toUpperCase()); }
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

  function start(mode, pack, ch) {
    if (!BANK) return;
    if (mode === 'team') { teamSetup(); return; }
    if (mode === 'quiz' && !ch) { var go2 = function () { quizSetup(); }; if (!player()) showWho(go2); else go2(); return; }
    var go = function () { (mode === 'blitz' ? beginBlitz : mode === 'word' ? beginWord : begin)(mode, pack, ch); };
    if (!player()) showWho(go); else go();
  }
  function loading() { open(); S = null; frame('<div class="st-card st-load"><span class="st-spin" aria-hidden="true"></span><p>Getting your questions ready&hellip;</p></div>'); }

  function begin(mode, pack, ch) {
    var today = ctToday(), packs = ch && ch.ids ? packsOfIds(ch.ids) : mode === 'daily' ? ['bible', 'verse', 'who', 'oni-books'] : mode === 'kids' ? ['kids'] : mode === 'quiz' ? topicPacks(pack) : [pack];
    loading();
    need(packs).then(function () {
      var r = rng(mode + pack + today + Math.random()), qs;
      if (ch && ch.ids) qs = byIds(ch.ids);
      else if (mode === 'daily') qs = dailySet(today);
      else if (mode === 'quiz') { qs = mixQs(pack, ROUND, r); markSeen(qs); }
      else { qs = fresh(mode === 'kids' ? 'kids' : pack, ROUND, r); markSeen(qs); }
      S = { mode: mode, pack: mode === 'quiz' ? 'quiz' : pack, topics: mode === 'quiz' && !ch ? pack : null, today: today, ch: ch || null, qs: qs.map(function (q) { return { q: q, order: shuffle(q.options.map(function (o, i) { return i; }), r) }; }),
            i: 0, score: 0, pts: 0, combo: 0, best: 0, marks: [], T: mode === 'kids' ? 30 : 20 };
      showQ();
    }, function () { frame('<div class="st-card st-load"><p>Sorry &mdash; the questions didn&rsquo;t load. Check your connection and try again.</p></div>'); });
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
      '<div class="st-card st-q"><div class="st-row"><span class="st-qn">Question ' + (S.i + 1) + ' of ' + S.qs.length + '</span><span class="st-pack ' + (PACK_CLASS[/^(verse|who)$/.test(q.pack) ? 'bible' : q.pack] || '') + '">' + esc(BANK.packs[/^(verse|who)$/.test(q.pack) ? 'bible' : q.pack].label) + '</span>' +
      '<span class="st-timer" role="timer" aria-label="Time left"><svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="26" class="bg"/><circle cx="30" cy="30" r="26" class="fg" style="stroke-dasharray:' + C + ';stroke-dashoffset:0"/></svg><b>' + S.T + '</b></span></div>' +
      (S.combo >= 2 ? '<p class="st-combo"><svg viewBox="0 0 24 24" aria-hidden="true">' + SHAPES[0] + '</svg>' + S.combo + ' in a row!</p>' : '') +
      (S.mode === 'team' ? teamBar() : '') + '<h2 class="st-question">' + esc(q.q) + '</h2>' + (S.mode === 'team' ? '' : whoLine()) +
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
    if (S.mode === 'team') { var tm = S.teams[S.i % S.teams.length]; tm.pts += gain; if (ok) tm.ok++; }
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
    nb.addEventListener('click', function () { S.i++; if (S.i < S.qs.length) { if (S.mode === 'team') passTo(); else showQ(); } else if (S.mode === 'team') teamResults(); else results(); });
    setTimeout(function () { try { nb.focus({ preventScroll: true }); } catch (e) {} }, 50);
  }

  function pop(el, text) {
    if (reduce) return;
    var r = el.getBoundingClientRect(), p = document.createElement('span');
    p.className = 'st-pop'; p.setAttribute('aria-hidden', 'true'); p.textContent = text; p.style.left = (r.left + r.width / 2) + 'px'; p.style.top = (r.top + 6) + 'px';
    stage.appendChild(p); setTimeout(function () { p.remove(); }, 1100);
  }

  /* ---------- results ---------- */
  function rank(sc, n) { var f = sc / n; return f === 1 ? ['Pillar of Fire', 'A perfect score. The fire of God is in you!'] : f >= .8 ? ['Burning Bush', 'Excellent! You know your Word.'] : f >= .6 ? ['Rising Flame', 'Well done! Come back tomorrow and climb higher.'] : f >= .4 ? ['Spark', 'Good start. Every day you play, you grow.'] : ['Kindling', '“Study to shew thyself approved unto God.” — 2 Timothy 2:15']; }

  /* ---------- real leaderboard (Netlify Function + Blobs) ---------- */
  var LB_URL = '/.netlify/functions/leaderboard', LB = null, LB_OK = false, LB_LIVE = false, myH = ls('mfm-quiz-h');
  function devId() { var d = ls('mfm-quiz-dev'); if (!d) { d = ''; for (var i = 0; i < 20; i++) d += 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]; ls('mfm-quiz-dev', d); } return d; }
  function lbMode() { if (S.mode === 'team' || (S.mode === 'word' && S.practice)) return null; return { daily: 'daily', word: 'word', quiz: 'quiz', kids: 'kids', blitz: 'blitz', pack: 'quiz' }[S.mode] || null; }
  function addScore() {
    var p = player(); if (!p || p.guest || S.added) return;
    var mode = lbMode(); if (!mode) return;
    S.added = true;
    var rec = { nick: p.nick, branch: p.branch === OTHER ? 'Visitors & friends' : p.branch, place: placeOf(p), score: S.score, pts: S.pts, n: S.qs ? S.qs.length : S.marks.length, day: S.today, mode: mode };
    var mine = ls('mfm-quiz-local') || []; mine.push(rec); ls('mfm-quiz-local', mine.slice(-60));   /* this device's history (also the preview fallback) */
    var body = { dev: devId(), nick: p.nick, branch: p.branch, place: placeOf(p), mode: mode, pts: S.pts, score: S.score, n: rec.n, day: S.today };
    fetch(LB_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (d) { LB_LIVE = true; if (d && d.h) { myH = d.h; ls('mfm-quiz-h', d.h); } lbNote(d && d.ok ? (d.counted ? 'Added to this week\u2019s leaderboard' : 'Not added: ' + d.reason) : 'Could not add your score this time'); loadBoard(true); })
      .catch(function () { lbNote(LB_LIVE ? 'Could not reach the leaderboard. Check your connection.' : 'Preview: saved on this device only'); renderBoard(); });
  }
  function lbNote(t) { var el = stage.querySelector('.st-lb small'); if (el) el.textContent = t; }
  function loadBoard(fresh) {
    return fetch(LB_URL + (fresh ? '?fresh=' + Date.now() : ''), { cache: 'no-store' }).then(function (r) { if (!r.ok) throw r; return r.json(); })
      .then(function (d) { LB = d; LB_OK = true; LB_LIVE = true; renderBoard(); })
      .catch(function () { LB_OK = false; renderBoard(); });
  }
  /* poll while the leaderboard is on screen and the tab is visible: updates as people play */
  var lbVisible = false, lbTimer = null;
  function lbPoll() { clearTimeout(lbTimer); if (document.hidden || !lbVisible) return; loadBoard().then(function () { lbTimer = setTimeout(lbPoll, 20000); }); }
  (function () { var el = document.getElementById('leaderboard'); if (!el || !window.IntersectionObserver) return; new IntersectionObserver(function (es) { lbVisible = es[0].isIntersecting; if (lbVisible) lbPoll(); else clearTimeout(lbTimer); }, { rootMargin: '200px' }).observe(el); document.addEventListener('visibilitychange', function () { if (!document.hidden) lbPoll(); }); })();

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
    var link = challengeLink({ c: S.mode === 'daily' ? 'daily' : S.mode === 'kids' ? 'kids' : S.mode === 'quiz' ? 'quiz' : S.pack, q: S.qs.map(function (x) { return x.q.id; }).join(','), s: S.score, p: S.pts, t: n });
    var share = 'MFM Play & Grow — ' + titleOf() + ': ' + S.score + '/' + n + ' (' + fmt(S.pts) + ' pts)\n' + line + '\nI challenge you to beat me — same questions: ' + link;
    var lb = p.guest
      ? '<div class="st-lb"><b>Want your points on the leaderboard?</b><button type="button" class="pg-btn light st-join">Add my name and branch</button></div>'
      : '<div class="st-lb"><span class="st-mini big">' + esc(initials(p.nick)) + '</span><span><b>+' + fmt(S.pts) + ' pts for ' + esc(placeOf(p)) + '</b><small>Adding to this week&rsquo;s leaderboard&hellip;</small></span></div>';
    frame('<div class="st-confetti" aria-hidden="true"></div><div class="st-card st-res">' +
      '<p class="st-k">' + esc(titleOf()) + '</p>' +
      '<div class="st-ring"><svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="70" class="bg"/><circle cx="80" cy="80" r="70" class="fg" style="stroke-dasharray:' + C + ';stroke-dashoffset:' + C + '" data-to="' + (C * (1 - S.score / n)).toFixed(2) + '"/></svg><div><b>' + S.score + '<small>/' + n + '</small></b><span>correct</span></div></div>' +
      '<h2 class="st-rank">' + esc(rk[0]) + '</h2><p class="st-msg">' + esc(rk[1]) + '</p>' + versus(S.score, S.pts, n) +
      '<div class="st-marks">' + S.marks.map(function (m, k) { return '<span class="' + (m ? 'ok' : 'no') + '" style="--d:' + (k * 90) + 'ms"><svg viewBox="0 0 24 24" aria-hidden="true">' + (m ? SHAPES[0] : '<path d="M7 7l10 10M17 7 7 17"/>') + '</svg></span>'; }).join('') + '</div>' +
      '<div class="st-tally"><div><b>' + fmt(S.pts) + '</b><small>points</small></div><div><b>' + S.best + '</b><small>best combo</small></div>' + (S.mode === 'daily' ? '<div><b>' + streak.n + '</b><small>day streak</small></div>' : '') + '</div>' + lb +
      '<div class="st-acts"><a class="pg-btn green" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(share) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"/></svg>' + (S.ch ? 'Challenge them back' : 'Challenge a friend') + '</a><button type="button" class="pg-btn light st-copy">Copy challenge link</button></div>' + previewTry(link) +
      '<div class="st-acts two"><button type="button" class="pg-btn ghost st-more">Play another game</button><button type="button" class="pg-btn ghost st-board">See the leaderboard</button></div></div>', 'done');
    var fg = stage.querySelector('.st-ring .fg'); setTimeout(function () { if (fg) fg.style.strokeDashoffset = fg.getAttribute('data-to'); }, 120);
    if (S.score >= Math.ceil(n * .6)) confetti();
    stage.querySelector('.st-copy').addEventListener('click', function (e) { var b = e.currentTarget; try { navigator.clipboard.writeText(share).then(function () { b.textContent = 'Copied!'; }, function () { b.textContent = 'Copy not allowed here'; }); } catch (x) { b.textContent = 'Copy not allowed here'; } });
    stage.querySelector('.st-more').addEventListener('click', function () { close(); scrollToId('games'); });
    stage.querySelector('.st-board').addEventListener('click', function () { close(); scrollToId('leaderboard'); });
    var j = stage.querySelector('.st-join'); if (j) j.addEventListener('click', function () { var keep = S; showWho(function () { S = keep; S.added = false; addScore(); results(); }, true); });
  }
  /* ---------- challenge a friend (no server: the link carries the questions) ---------- */
  function challengeLink(o) {
    var p = player() || {}; o.n = p.guest ? '' : (p.nick || '');
    return SITE + '?' + Object.keys(o).filter(function (k) { return o[k] !== '' && o[k] != null; }).map(function (k) { return k + '=' + encodeURIComponent(o[k]); }).join('&');
  }
  function readChallenge(str) {
    var m = {}; (str || '').replace(/^[?#]/, '').split('&').forEach(function (kv) { var i = kv.indexOf('='); if (i > 0) m[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1).replace(/\+/g, ' ')); });
    if (!m.c) return null;
    return { c: m.c, ids: m.q ? m.q.split(',').slice(0, 20) : null, seed: m.seed || '', d: m.d || '', n: (m.n || 'A friend').slice(0, 20), s: +m.s || 0, p: +m.p || 0, t: +m.t || 0, g: m.g || '' };
  }
  function gameName(c) { return c === 'quiz' ? 'Quiz' : c === 'daily' ? 'Daily 10' : c === 'kids' ? 'Kids Mode' : c === 'blitz' ? '60-second Blitz' : c === 'word' ? 'Word of the Day' : (BANK.packs[c] ? BANK.packs[c].label : 'Play & Grow'); }
  function challengeIntro(ch) {
    open(); S = null;
    var what = ch.c === 'word' ? (ch.g && ch.g !== 'X' ? 'got it in ' + ch.g + '/6' : 'played today&rsquo;s word') : ch.c === 'blitz' ? ch.s + ' right in 60 seconds' : ch.s + '/' + (ch.t || 10) + ' &middot; ' + fmt(ch.p) + ' pts';
    frame('<div class="st-card st-chal"><div class="st-vsbadge" aria-hidden="true">VS</div><p class="st-k">You&rsquo;ve been challenged</p><h2 class="st-h">' + esc(ch.n) + ' challenged you!</h2>' +
      '<p class="st-chal-game">' + esc(gameName(ch.c)) + '</p><p class="st-chal-score"><b>' + esc(ch.n) + '</b> ' + what + '</p>' +
      '<p class="st-fine">' + (ch.ids || ch.seed ? 'You get the exact same questions. ' : '') + 'Can you beat them?</p>' +
      '<button type="button" class="pg-btn gold wide xl st-accept" data-focus>Accept the challenge</button><button type="button" class="st-skip st-nope">Not now</button></div>');
    stage.querySelector('.st-accept').addEventListener('click', function () { start(ch.c === 'daily' || ch.c === 'kids' || ch.c === 'blitz' || ch.c === 'word' || ch.c === 'quiz' ? ch.c : 'pack', ch.c, ch); });
    stage.querySelector('.st-nope').addEventListener('click', close);
  }
  function versus(score, pts, n) {
    if (!S || !S.ch) return '';
    var c = S.ch, me = S.mode === 'blitz' ? score : pts, them = S.mode === 'blitz' ? c.s : c.p;
    var res = me > them ? 'You win!' : me < them ? esc(c.n) + ' wins this time' : 'It&rsquo;s a tie!';
    var fmtS = function (sc, p) { return S.mode === 'blitz' ? sc + ' right' : sc + '/' + n + ' &middot; ' + fmt(p); };
    return '<div class="st-versus ' + (me > them ? 'win' : me < them ? 'lose' : 'tie') + '"><div><small>You</small><b>' + fmtS(score, pts) + '</b></div><span>VS</span><div><small>' + esc(c.n) + '</small><b>' + fmtS(c.s, c.p) + '</b></div><p>' + res + '</p></div>';
  }
  function previewTry(link) { return '<p class="st-fine st-trylink" data-preview>Preview: <button type="button" class="st-skip" data-try="' + esc(link) + '">open this challenge here</button> to see what your friend gets.</p>'; }
  stage.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('[data-try]'); if (!t) return; var ch = readChallenge(t.getAttribute('data-try').split('?')[1]); if (ch) { if (ch.n === (player() || {}).nick) ch.n = ch.n + ' (you)'; challengeIntro(ch); } });

  /* ---------- Quiz: mix it up, or choose topics ---------- */
  function quizSetup() {
    open(); S = null; var last = ls('mfm-quiz-topics') || ALLT.slice();
    frame('<div class="st-card st-quiz"><p class="st-k">Quiz</p><h2 class="st-h">What do you want to play?</h2><p class="st-fine">Ten questions. Pick one topic, a few, or mix them all.</p>' + topicChips(last) +
      '<p class="st-err" hidden>Pick at least one topic.</p><button type="button" class="pg-btn gold wide xl st-go" data-focus>Start the quiz</button></div>');
    var sel = bindChips(stage.querySelector('.tp'));
    stage.querySelector('.st-go').addEventListener('click', function () { var k = sel(); if (!k.length) { stage.querySelector('.st-err').hidden = false; return; } ls('mfm-quiz-topics', k); begin('quiz', k); });
  }

  /* ---------- 60-second Blitz: true or false against the clock ---------- */
  function beginBlitz(mode, pack, ch) {
    loading();
    need(['blitz']).then(function () {
      var all = BANK.questions.filter(function (q) { return q.pack === 'blitz'; }), seed = ch && ch.seed ? ch.seed : Math.random().toString(36).slice(2, 9);
      var r = rng('blitz-' + seed), list = ch && ch.seed ? shuffle(all, r) : fresh('blitz', all.length, r);
      S = { mode: 'blitz', pack: 'blitz', today: ctToday(), ch: ch || null, seed: seed, list: list, i: 0, score: 0, pts: 0, combo: 0, best: 0, marks: [], miss: [], T: 60, end: Date.now() + 60000 };
      blitzFrame(); blitzTick();
    });
  }
  function blitzFrame() {
    frame('<div class="bz-clock"><i style="--p:1"></i><b>60</b></div><div class="st-card bz-card"><p class="bz-k">True or false?</p><p class="bz-s" aria-live="polite"></p>' +
      '<div class="bz-btns"><button type="button" class="bz-t" data-v="1"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>True</button><button type="button" class="bz-f" data-v="0"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17"/></svg>False</button></div>' +
      '<p class="bz-meta"><span><b class="bz-n">0</b> right</span><span class="bz-combo"></span></p><p class="st-fine">Keys: T / &larr; for true, F / &rarr; for false</p></div>', 'blitz');
    stage.querySelectorAll('.bz-btns button').forEach(function (b) { b.addEventListener('click', function () { blitzAnswer(b.dataset.v === '1'); }); });
    blitzShow();
  }
  function blitzShow() { S.phase = 'bz'; var it = S.list[S.i % S.list.length], el = stage.querySelector('.bz-s'); el.innerHTML = '<span>' + esc(it.s) + (it.a ? '<span class="bz-a">' + esc(it.a) + '</span>' : '') + '</span>'; el.classList.remove('in'); void el.offsetWidth; el.classList.add('in'); }
  function blitzAnswer(v) {
    if (!S || S.phase !== 'bz') return;
    var it = S.list[S.i % S.list.length], ok = v === it.t, card = stage.querySelector('.bz-card');
    S.marks.push(ok);
    if (ok) { S.score++; S.combo++; S.best = Math.max(S.best, S.combo); S.pts += 100 + Math.min(50, (S.combo - 1) * 10); } else { S.combo = 0; S.miss.push(it); }
    card.classList.remove('good', 'bad'); void card.offsetWidth; card.classList.add(ok ? 'good' : 'bad');
    stage.querySelector('.bz-n').textContent = S.score; stage.querySelector('.st-pts b').textContent = fmt(S.pts);
    stage.querySelector('.bz-combo').textContent = S.combo >= 3 ? S.combo + ' in a row!' : '';
    S.i++; blitzShow();
  }
  function blitzTick() {
    stopTimer();
    timer = setInterval(function () {
      if (!S || S.mode !== 'blitz') { stopTimer(); return; }
      var left = Math.max(0, S.end - Date.now()), cl = stage.querySelector('.bz-clock');
      if (cl) { cl.querySelector('b').textContent = Math.ceil(left / 1000); cl.querySelector('i').style.setProperty('--p', (left / 60000).toFixed(3)); cl.classList.toggle('low', left < 10000); }
      if (left <= 0) { stopTimer(); blitzEnd(); }
    }, 100);
  }
  function blitzEnd() {
    S.phase = 'r'; markSeen(S.list.slice(0, S.i)); addScore();
    var n = S.marks.length, acc = n ? Math.round(S.score / n * 100) : 0;
    var link = challengeLink({ c: 'blitz', seed: S.seed, s: S.score, p: S.pts }), share = 'MFM Play & Grow — 60-second Blitz: ' + S.score + ' right (' + acc + '%)\nI challenge you to beat me — same statements: ' + link;
    frame('<div class="st-confetti" aria-hidden="true"></div><div class="st-card st-res"><p class="st-k">60-second Blitz</p><div class="bz-big"><b>' + S.score + '</b><span>right in 60 seconds</span></div>' + versus(S.score, S.pts, n) +
      '<div class="st-tally"><div><b>' + fmt(S.pts) + '</b><small>points</small></div><div><b>' + acc + '%</b><small>accuracy</small></div><div><b>' + S.best + '</b><small>best streak</small></div></div>' +
      (S.miss.length ? '<div class="bz-review"><p class="st-k">Learn from the ones you missed</p>' + S.miss.slice(0, 5).map(function (m) { return '<div class="bz-miss"><p>' + esc(m.s) + (m.a ? ' &mdash; ' + esc(m.a) : '') + '</p><b>' + (m.t ? 'True' : 'False') + '</b> &mdash; ' + esc(m.explain) + (m.source ? ' <a target="_blank" rel="noopener" href="' + esc(m.source.url) + '">Source &rarr;</a>' : '') + '</div>'; }).join('') + '</div>' : '') +
      '<div class="st-acts"><a class="pg-btn green" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(share) + '">' + (S.ch ? 'Challenge them back' : 'Challenge a friend') + '</a><button type="button" class="pg-btn light st-again">Play again</button></div>' + previewTry(link) +
      '<div class="st-acts two"><button type="button" class="pg-btn ghost st-more">Play another game</button><button type="button" class="pg-btn ghost st-board">See the leaderboard</button></div></div>', 'done');
    if (S.score >= 15) confetti();
    stage.querySelector('.st-again').addEventListener('click', function () { beginBlitz('blitz'); });
    stage.querySelector('.st-more').addEventListener('click', function () { close(); scrollToId('games'); });
    stage.querySelector('.st-board').addEventListener('click', function () { close(); scrollToId('leaderboard'); });
  }

  /* ---------- Word of the Day: guess the Bible word in six tries ---------- */
  function beginWord(mode, pack, ch, practice) {
    loading();
    needWords().then(function () {
      var today = ch && ch.d ? ch.d : ctToday(), idx = practice ? Math.floor(Math.random() * WORDS.words.length) : (dayNo(today) - 1) % WORDS.words.length, w = WORDS.words[idx];
      var key = 'mfm-word-' + today, saved = practice ? null : ls(key);
      S = { mode: 'word', pack: 'word', today: today, practice: !!practice, ch: ch || null, w: w, word: w.w, rows: saved ? saved.rows : [], cur: '', done: saved ? saved.done : 0, pts: 0, key: key, score: 0, marks: [] };
      wordFrame(); if (S.done) wordEnd(true);
    });
  }
  function scoreRow(g, w) {
    var res = ['x', 'x', 'x', 'x', 'x'], left = {};
    for (var i = 0; i < 5; i++) { if (g[i] === w[i]) res[i] = 'g'; else left[w[i]] = (left[w[i]] || 0) + 1; }
    for (i = 0; i < 5; i++) if (res[i] !== 'g' && left[g[i]]) { res[i] = 'y'; left[g[i]]--; }
    return res;
  }
  function wordFrame() {
    S.phase = 'wd';
    var rows = '', kb = {}, i, j;
    S.rows.forEach(function (g) { scoreRow(g, S.word).forEach(function (c, k) { var L = g[k], o = kb[L]; if (c === 'g' || (c === 'y' && o !== 'g') || !o) kb[L] = c; }); });
    for (i = 0; i < 6; i++) {
      var g = S.rows[i] || (i === S.rows.length ? S.cur : ''), sc = S.rows[i] ? scoreRow(S.rows[i], S.word) : null;
      rows += '<div class="wd-row' + (i === S.rows.length && !S.done ? ' cur' : '') + '">';
      for (j = 0; j < 5; j++) rows += '<span class="wd-c' + (sc ? ' ' + sc[j] : g[j] ? ' f' : '') + '" style="--d:' + (j * 120) + 'ms">' + (g[j] || '') + '</span>';
      rows += '</div>';
    }
    var keys = ['QWERTYUIOP', 'ASDFGHJKL', '+ZXCVBNM-'].map(function (r) { return '<div class="wd-kr">' + r.split('').map(function (k) { return k === '+' ? '<button type="button" class="wd-k wide" data-k="ENTER">Enter</button>' : k === '-' ? '<button type="button" class="wd-k wide" data-k="DEL" aria-label="Delete">&#9003;</button>' : '<button type="button" class="wd-k ' + (kb[k] || '') + '" data-k="' + k + '">' + k + '</button>'; }).join('') + '</div>'; }).join('');
    frame('<div class="wd"><p class="wd-help">Guess the 5-letter Bible word. <span class="wd-key"><i class="g"></i>right spot <i class="y"></i>in the word <i class="x"></i>not in it</span></p><div class="wd-grid" aria-live="polite">' + rows + '</div><p class="wd-msg" role="status"></p><div class="wd-kb">' + keys + '</div></div>', 'word');
    stage.querySelectorAll('.wd-k').forEach(function (b) { b.addEventListener('click', function () { wordKey(b.dataset.k); }); });
  }
  function wordKey(k) {
    if (!S || S.phase !== 'wd' || S.done) return;
    if (k === 'DEL') S.cur = S.cur.slice(0, -1);
    else if (k === 'ENTER') {
      if (S.cur.length < 5) return wordMsg('Not enough letters');
      if (!WORDS.set[S.cur.toLowerCase()]) { var row = stage.querySelector('.wd-row.cur'); if (row) { row.classList.remove('shake'); void row.offsetWidth; row.classList.add('shake'); } return wordMsg('Not in the word list'); }
      S.rows.push(S.cur); S.cur = '';
      if (S.rows[S.rows.length - 1] === S.word) S.done = 1; else if (S.rows.length >= 6) S.done = 2;
      if (!S.practice) ls(S.key, { rows: S.rows, done: S.done });
      wordFrame();
      if (S.done) setTimeout(function () { wordEnd(); }, reduce ? 0 : 900);
      return;
    } else if (S.cur.length < 5) S.cur += k;
    var cur = stage.querySelectorAll('.wd-row.cur .wd-c'); cur.forEach(function (c, i) { c.textContent = S.cur[i] || ''; c.classList.toggle('f', !!S.cur[i]); });
  }
  function wordMsg(t) { var m = stage.querySelector('.wd-msg'); if (m) { m.textContent = t; m.classList.remove('show'); void m.offsetWidth; m.classList.add('show'); } }
  function wordEnd(again) {
    S.phase = 'r'; var won = S.done === 1, g = S.rows.length, w = S.w;
    S.score = won ? 1 : 0; S.pts = won ? 100 + (6 - g) * 60 : 0; S.marks = [won];
    if (!again && !S.practice) addScore();
    var grid = S.rows.map(function (r) { return scoreRow(r, S.word).map(function (c) { return c === 'g' ? '🟩' : c === 'y' ? '🟨' : '⬛'; }).join(''); }).join('\n');
    var link = challengeLink({ c: 'word', d: S.today, g: won ? g : 'X' }), share = 'MFM Play & Grow — Word of the Day #' + dayNo(S.today) + ' ' + (won ? g : 'X') + '/6\n' + grid + '\nCan you get it? ' + link;
    var verse = esc(w.text).replace(new RegExp('\\b(' + w.w + ')\\b', 'i'), '<mark>$1</mark>');
    frame('<div class="st-confetti" aria-hidden="true"></div><div class="st-card st-res wd-end"><p class="st-k">' + esc(titleOf()) + '</p><div class="wd-answer">' + w.w.split('').map(function (L, i) { return '<span style="--d:' + (i * 90) + 'ms">' + L + '</span>'; }).join('') + '</div>' +
      '<h2 class="st-rank">' + (won ? ['Glory!', 'Amazing!', 'Excellent!', 'Well done!', 'Good!', 'Phew!'][g - 1] : 'Next time!') + '</h2><p class="st-msg">' + (won ? 'You found it in ' + g + (g === 1 ? ' try.' : ' tries.') : 'The word was ' + w.w + '.') + '</p>' +
      (S.ch && S.ch.g ? '<div class="st-versus tie"><div><small>You</small><b>' + (won ? g : 'X') + '/6</b></div><span>VS</span><div><small>' + esc(S.ch.n) + '</small><b>' + esc(S.ch.g) + '/6</b></div></div>' : '') +
      '<blockquote class="wd-verse">&ldquo;' + verse + '&rdquo;<cite><a target="_blank" rel="noopener" href="' + esc(w.url) + '">' + esc(w.ref) + ' (KJV) &rarr;</a></cite></blockquote>' +
      '<div class="st-acts"><a class="pg-btn green" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(share) + '">Challenge a friend</a><button type="button" class="pg-btn light st-prac">Practice another word</button></div>' + (S.practice ? '' : previewTry(link)) +
      '<p class="st-fine">A new word every day at midnight Central time.' + (again ? '' : '') + '</p><div class="st-acts two"><button type="button" class="pg-btn ghost st-more">Play another game</button><button type="button" class="pg-btn ghost st-board">See the leaderboard</button></div></div>', 'done');
    if (won) confetti();
    stage.querySelector('.st-prac').addEventListener('click', function () { beginWord('word', null, null, true); });
    stage.querySelector('.st-more').addEventListener('click', function () { close(); scrollToId('games'); });
    stage.querySelector('.st-board').addEventListener('click', function () { close(); scrollToId('leaderboard'); });
  }

  /* ---------- Team Battle: 2–4 teams, one phone or TV ---------- */
  var TEAM_NAMES = ['Team Fire', 'Team Glory', 'Team Grace', 'Team Zion'], TEAM_COL = ['#e2511f', '#2c63d6', '#1f9d63', '#8a5cc7'];
  function teamSetup() {
    open(); S = null; var last = ls('mfm-team') || { n: 2, names: TEAM_NAMES.slice(), game: 'mix', per: 5 };
    frame('<div class="st-card st-team"><p class="st-k">Play together</p><h2 class="st-h">Team Battle</h2><p class="st-fine">Pass the phone, or put it on the TV. Teams take turns answering.</p><form class="st-form" autocomplete="off">' +
      '<fieldset class="tm-n"><legend>How many teams?</legend>' + [2, 3, 4].map(function (k) { return '<label><input type="radio" name="n" value="' + k + '"' + (last.n === k ? ' checked' : '') + '><span>' + k + '</span></label>'; }).join('') + '</fieldset>' +
      '<div class="tm-names">' + [0, 1, 2, 3].map(function (k) { return '<label class="tm-name" style="--tc:' + TEAM_COL[k] + '"' + (k >= last.n ? ' hidden' : '') + '><i></i><input name="t' + k + '" maxlength="18" value="' + esc(last.names[k] || TEAM_NAMES[k]) + '" aria-label="Team ' + (k + 1) + ' name"></label>'; }).join('') + '</div>' +
      topicChips(last.topics || ['bible', 'oni', 'go', 'mfm']) + '<p class="st-err" hidden>Pick at least one topic.</p>' +
      '<fieldset class="tm-n"><legend>Questions per team</legend>' + [3, 5, 10].map(function (k) { return '<label><input type="radio" name="per" value="' + k + '"' + (last.per === k ? ' checked' : '') + '><span>' + k + '</span></label>'; }).join('') + '</fieldset>' +
      '<button class="pg-btn gold wide xl" type="submit">Start the battle</button></form></div>');
    var f = stage.querySelector('form'), tsel = bindChips(stage.querySelector('.tp'));
    f.querySelectorAll('input[name=n]').forEach(function (r) { r.addEventListener('change', function () { stage.querySelectorAll('.tm-name').forEach(function (l, k) { l.hidden = k >= +r.value; }); }); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = +f.querySelector('input[name=n]:checked').value, per = +f.querySelector('input[name=per]:checked').value, topics = tsel(); if (!topics.length) { stage.querySelector('.st-team .st-err').hidden = false; return; }
      var names = [0, 1, 2, 3].map(function (k) { return (f['t' + k].value.trim() || TEAM_NAMES[k]).slice(0, 18); });
      ls('mfm-team', { n: n, names: names, topics: topics, per: per });
      var packs = topicPacks(topics);
      loading();
      need(packs).then(function () {
        var r = rng('team' + Math.random()), total = n * per, qs = [];
        qs = mixQs(topics, total, r);
        markSeen(qs);
        S = { mode: 'team', pack: 'team', today: ctToday(), qs: qs.map(function (q) { return { q: q, order: shuffle(q.options.map(function (o, i) { return i; }), r) }; }), i: 0, score: 0, pts: 0, combo: 0, best: 0, marks: [], T: 25,
              teams: names.slice(0, n).map(function (nm, k) { return { name: nm, col: TEAM_COL[k], pts: 0, ok: 0 }; }) };
        passTo();
      });
    });
  }
  function teamBar() { var cur = S.i % S.teams.length; return '<div class="tm-bar">' + S.teams.map(function (t, k) { return '<span class="tm-chip' + (k === cur ? ' on' : '') + '" style="--tc:' + t.col + '"><b>' + esc(t.name) + '</b>' + fmt(t.pts) + '</span>'; }).join('') + '</div>'; }
  function passTo() {
    S.phase = 'pass'; var t = S.teams[S.i % S.teams.length], round = Math.floor(S.i / S.teams.length) + 1, rounds = S.qs.length / S.teams.length;
    frame(teamBar() + '<div class="st-card tm-pass" style="--tc:' + t.col + '"><p class="st-k">Round ' + round + ' of ' + rounds + '</p><span class="tm-flag" aria-hidden="true"></span><h2 class="st-h">' + esc(t.name) + ', you&rsquo;re up!</h2><p class="st-fine">Pass the phone to ' + esc(t.name) + '. Everyone else, no helping!</p><button type="button" class="pg-btn gold wide xl" data-focus>We&rsquo;re ready</button></div>', 'team');
    stage.querySelector('.tm-pass .pg-btn').addEventListener('click', showQ);
  }
  function teamResults() {
    S.phase = 'r'; var t = S.teams.slice().sort(function (a, b) { return b.pts - a.pts; }), tie = t[1] && t[0].pts === t[1].pts, top = t[0].pts || 1;
    var share = 'MFM Play & Grow — Team Battle\n' + t.map(function (x, k) { return (k + 1) + '. ' + x.name + ' — ' + fmt(x.pts) + ' pts'; }).join('\n') + '\nPlay with your family: ' + SITE;
    frame('<div class="st-confetti" aria-hidden="true"></div><div class="st-card st-res tm-res"><p class="st-k">Team Battle</p><div class="tm-crown" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 8l4.5 3.5L12 5l4.5 6.5L21 8l-2 10H5Z"/></svg></div><h2 class="st-rank">' + (tie ? 'It&rsquo;s a tie!' : esc(t[0].name) + ' wins!') + '</h2>' +
      '<div class="tm-board">' + t.map(function (x, k) { return '<div class="tm-row" style="--tc:' + x.col + ';--w:' + Math.max(6, Math.round(x.pts / top * 100)) + '%"><b>' + (k + 1) + '</b><span>' + esc(x.name) + '<small>' + x.ok + ' right</small></span><i></i><em>' + fmt(x.pts) + '</em></div>'; }).join('') + '</div>' +
      '<div class="st-acts"><a class="pg-btn green" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(share) + '">Share the result</a><button type="button" class="pg-btn light st-again">Rematch</button></div><div class="st-acts two"><button type="button" class="pg-btn ghost st-more">Play another game</button></div></div>', 'done');
    confetti();
    stage.querySelector('.st-again').addEventListener('click', teamSetup);
    stage.querySelector('.st-more').addEventListener('click', function () { close(); scrollToId('games'); });
  }

  function scrollToId(id) { var el = document.getElementById(id); if (el) setTimeout(function () { el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }, 240); }

  function confetti() {
    if (reduce) return; var box = stage.querySelector('.st-confetti'); if (!box) return;
    var cols = ['#e0ad45', '#ff8a3d', '#e2451d', '#2c63d6', '#1f9d63', '#fff3d6'], h = '';
    for (var i = 0; i < 70; i++) h += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;background:' + cols[i % cols.length] + ';--r:' + Math.round(Math.random() * 720 - 360) + 'deg;--x:' + Math.round(Math.random() * 120 - 60) + 'px;animation-delay:' + (Math.random() * .6).toFixed(2) + 's;animation-duration:' + (2.2 + Math.random() * 1.6).toFixed(2) + 's;width:' + (6 + Math.round(Math.random() * 6)) + 'px"></i>';
    box.innerHTML = h;
  }

  /* ---------- hub: leaderboard, stats, countdowns ---------- */
  function rows(tab) {
    if (LB_OK && LB) {
      if (tab === 'branches') return LB.branches.map(function (b) { return { name: b.name, sub: b.players + (b.players === 1 ? ' player' : ' players'), pts: b.pts }; });
      return LB.players.map(function (x) { return { name: x.name + (myH && x.h === myH ? ' (you)' : ''), sub: x.sub, pts: x.pts, me: !!(myH && x.h === myH) }; });
    }
    /* no server (private preview / offline): only this device's own scores, this week */
    var wk = mondayCT(), mine = (ls('mfm-quiz-local') || []).filter(function (s) { return s.day >= wk; });
    if (tab === 'branches') { var m = {}; mine.forEach(function (s) { m[s.branch] = (m[s.branch] || 0) + (s.pts || 0); }); return Object.keys(m).map(function (k) { return { name: k, sub: '', pts: m[k] }; }).sort(function (a, b) { return b.pts - a.pts; }); }
    var tot = {}; mine.forEach(function (s) { var k = s.nick + '|' + s.place; tot[k] = (tot[k] || 0) + (s.pts || 0); });
    return Object.keys(tot).map(function (k) { var a = k.split('|'); return { name: a[0] + ' (you)', sub: a[1], pts: tot[k], me: true }; });
  }
  function mondayCT() { var p = ctParts(), dow = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }[p.weekday]; return new Date(Date.parse(p.year + '-' + p.month + '-' + p.day + 'T12:00:00Z') - dow * 864e5).toISOString().slice(0, 10); }
  function emptyBoard() {
    return '<div class="lb-empty"><span class="lb-empty-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 4h10v4a5 5 0 0 1-10 0zM5 5H3v1.5A3.5 3.5 0 0 0 6.6 10M19 5h2v1.5A3.5 3.5 0 0 1 17.4 10M10 13h4v3h-4zM8 16h8l1 4H7z"/></svg></span>' +
      '<h3>No scores yet this week</h3><p>Be the first to put your branch on the board. Scores appear here as people play.</p><button type="button" class="pg-btn gold" data-mode="daily">Play today&rsquo;s Daily 10</button></div>';
  }
  /* five preview designs for the leaderboard (picker: Leaderboard 1–5) */
  var BV = 4, TAB = 'branches';  /* Dawn chose design 4, medal cards (Nov 26) */
  var CHURCH = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v3M10.5 4.5h3M5 21v-8l7-5 7 5v8Z"/></svg>';
  function trend(name) { var h = 0; for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0; var v = Math.abs(h) % 5; return v === 0 ? 0 : v < 3 ? v : -(v - 2); }
  function trendTag(x) { var t = trend(x.name); return t > 0 ? '<span class="tr up" title="Up ' + t + ' this week">&#9650; ' + t + '</span>' : t < 0 ? '<span class="tr dn" title="Down ' + (-t) + ' this week">&#9660; ' + (-t) + '</span>' : '<span class="tr eq">&ndash;</span>'; }
  function av(x) { return TAB === 'branches' ? CHURCH : esc(initials(x.name)); }
  function sub(x) { return x.sub ? '<small>' + esc(x.sub) + '</small>' : ''; }
  var VIEWS = {
    1: function (r, top) {  /* podium + list */
      var pod = [1, 0, 2].map(function (i) { var x = r[i]; if (!x) return ''; return '<div class="pod p' + (i + 1) + (x.me ? ' me' : '') + '"><span class="pod-av">' + av(x) + '</span><b class="pod-n">' + esc(x.name) + '</b>' + sub(x) + '<span class="pod-pts">' + fmt(x.pts) + ' pts</span><span class="pod-block"><i>' + (i + 1) + '</i></span></div>'; }).join('');
      var list = r.slice(3).map(function (x, k) { return '<li' + (x.me ? ' class="me"' : '') + '><b class="lb-rank">' + (k + 4) + '</b><span class="lb-name">' + esc(x.name) + sub(x) + '</span><span class="lb-bar"><i style="width:' + Math.max(6, Math.round(x.pts / top * 100)) + '%"></i></span><span class="lb-pts">' + fmt(x.pts) + '</span></li>'; }).join('');
      return '<div class="pg-podium">' + pod + '</div><ol class="pg-list">' + list + '</ol>';
    },
    2: function (r) {  /* stadium scoreboard */
      return '<div class="lv2"><div class="lv2-head"><span class="lv2-live"><i></i>Live</span><b>This week&rsquo;s scoreboard</b><span>Resets in <b data-reset>&nbsp;</b></span></div>' +
        '<div class="lv2-cols"><span>#</span><span>' + (TAB === 'branches' ? 'Branch' : 'Player') + '</span><span>Move</span><span>Points</span></div>' +
        r.map(function (x, k) { return '<div class="lv2-row' + (k < 3 ? ' top t' + (k + 1) : '') + (x.me ? ' me' : '') + '"><span class="lv2-rank">' + pad(k + 1) + '</span><span class="lv2-name">' + esc(x.name) + sub(x) + '</span>' + trendTag(x) + '<span class="lv2-pts">' + fmt(x.pts) + '</span></div>'; }).join('') + '</div>';
    },
    3: function (r, top) {  /* race track */
      return '<div class="lv3"><div class="lv3-finish" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 4h10v4a5 5 0 0 1-10 0zM5 5H3v1.5A3.5 3.5 0 0 0 6.6 10M19 5h2v1.5A3.5 3.5 0 0 1 17.4 10M10 13h4v3h-4zM8 16h8l1 4H7z"/></svg><span>Finish</span></div>' +
        r.slice(0, 8).map(function (x, k) { var pc = Math.max(8, Math.round(x.pts / top * 100)); return '<div class="lv3-lane' + (x.me ? ' me' : '') + '"><span class="lv3-label"><b>' + (k + 1) + '</b>' + esc(x.name) + '</span><span class="lv3-track"><span class="lv3-run" style="--p:' + pc + '%;--d:' + (k * 90) + 'ms"><i>' + av(x) + '</i></span></span><span class="lv3-pts">' + fmt(x.pts) + '</span></div>'; }).join('') + '</div>';
    },
    4: function (r) {  /* trading cards */
      var medals = ['Gold', 'Silver', 'Bronze'];
      return '<div class="lv4-top">' + r.slice(0, 3).map(function (x, k) { return '<article class="lv4-card m' + (k + 1) + (x.me ? ' me' : '') + '"><span class="lv4-medal">' + (k + 1) + '</span><span class="lv4-av">' + av(x) + '</span><b>' + esc(x.name) + '</b>' + sub(x) + '<span class="lv4-pts">' + fmt(x.pts) + '<small>pts</small></span><span class="lv4-tag">' + medals[k] + ' this week</span></article>'; }).join('') + '</div>' +
        '<div class="lv4-rest">' + r.slice(3).map(function (x, k) { return '<div class="lv4-mini' + (x.me ? ' me' : '') + '"><b>' + (k + 4) + '</b><span>' + esc(x.name) + sub(x) + '</span><em>' + fmt(x.pts) + '</em></div>'; }).join('') + '</div>';
    },
    5: function (r, top) {  /* fire meter */
      return '<div class="lv5">' + r.slice(0, 7).map(function (x, k) { var pc = Math.max(10, Math.round(x.pts / top * 100)); return '<div class="lv5-col' + (k === 0 ? ' lead' : '') + (x.me ? ' me' : '') + '"><span class="lv5-pts">' + fmt(x.pts) + '</span><span class="lv5-bar"><span class="lv5-fill" style="--h:' + pc + '%;--d:' + (k * 80) + 'ms"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c3.6 3.3 6 6.5 6 10.3a6 6 0 0 1-12 0c0-2.7 1.5-4.8 3-6.3.1 1.8 1 3 2.1 3.3C10.3 7.1 11 4.6 12 2.5Z"/></svg></span></span><b class="lv5-rank">' + (k + 1) + '</b><span class="lv5-name">' + esc(x.name.replace(/^MFM /, '')) + '</span></div>'; }).join('') + '</div>' +
        (r.length > 7 ? '<p class="lv5-more">' + r.slice(7).map(function (x, k) { return '<span>' + (k + 8) + '. ' + esc(x.name) + ' &middot; ' + fmt(x.pts) + '</span>'; }).join('') + '</p>' : '');
    }
  };
  function renderBoard() {
    var el = document.getElementById('pg-boardview'); if (!el) return;
    var r = rows(TAB), top = r[0] ? r[0].pts : 1;
    el.setAttribute('data-v', BV); el.innerHTML = r.length ? VIEWS[BV](r, top) : emptyBoard();
    var live = document.getElementById('pg-live'); if (live) live.innerHTML = LB_OK ? '<i></i>Live &middot; ' + LB.totals.players + (LB.totals.players === 1 ? ' player' : ' players') + ' this week &middot; updates as people play' : '<i></i>Preview: shows this device&rsquo;s scores until the site is live';
    document.querySelectorAll('[data-lpick]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lpick') == BV ? 'true' : 'false'); });
    var br = rows('branches'); document.querySelectorAll('[data-topbranch]').forEach(function (x) { x.textContent = br[0] ? br[0].name : 'Be the first'; });
    document.querySelectorAll('[data-heropodium]').forEach(function (hp) {
      hp.innerHTML = !br.length ? '<p class="hp-empty">Be the first branch on the board this week</p>' : [1, 0, 2].map(function (i) { var x = br[i]; return x ? '<div class="hp p' + (i + 1) + '"><b>' + esc(x.name.replace(/^MFM /, '')) + '</b><span>' + fmt(x.pts) + ' pts</span><i>' + (i + 1) + '</i></div>' : ''; }).join('');
    });
    tick();
  }
  document.querySelectorAll('[data-lpick]').forEach(function (b) { b.addEventListener('click', function () { BV = +b.getAttribute('data-lpick'); renderBoard(); }); });
  document.querySelectorAll('.lb-tab').forEach(function (t) { t.addEventListener('click', function () { document.querySelectorAll('.lb-tab').forEach(function (x) { x.classList.toggle('on', x === t); x.setAttribute('aria-selected', x === t ? 'true' : 'false'); }); TAB = t.dataset.tab; renderBoard(); }); });

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
  var lq = /board-(\d)/.exec(location.hash || ''); if (lq) BV = +lq[1];
  /* pick-your-game styles (preview picker 1–6, also #games-N) */
  var gsec = document.querySelector('.pg-games');
  function gstyle(n) { if (!gsec) return; gsec.setAttribute('data-gs', n); document.querySelectorAll('[data-gpick]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-gpick') == n ? 'true' : 'false'); }); if (n != 4 && n != 2) gcat('all'); }
  function gcat(c) { document.querySelectorAll('[data-gcat]').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-gcat') === c ? 'true' : 'false'); }); document.querySelectorAll('.pg-games .pg-tile').forEach(function (t) { t.hidden = c !== 'all' && t.getAttribute('data-cat') !== c; }); if (gsec) gsec.classList.toggle('gs-filtered', c !== 'all'); }
  document.querySelectorAll('[data-gpick]').forEach(function (b) { b.addEventListener('click', function () { gstyle(+b.getAttribute('data-gpick')); }); });
  document.querySelectorAll('[data-gcat]').forEach(function (b) { b.addEventListener('click', function () { gcat(b.getAttribute('data-gcat')); }); });
  document.querySelectorAll('.gs-arrow').forEach(function (b) { b.addEventListener('click', function () { var g = document.querySelector('.pg-games .pg-grid'); g.scrollBy({ left: (b.classList.contains('next') ? 1 : -1) * 300, behavior: reduce ? 'auto' : 'smooth' }); }); });
  var gq = /games-(\d)/.exec(location.hash || ''); if (gq) gstyle(+gq[1]);  /* Dawn chose style 2, Spotlight (Nov 26) */
  embers(); embers2(); tick(); setInterval(tick, 1000);
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-mode]'); if (b && !stage.contains(b)) start(b.dataset.mode, b.dataset.pack || null); });
  bindNl(document);
  fetch('/js/quiz-bank.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (b) {
    BANK = b;
    var dn = dayNo(ctToday()), dt = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/Chicago' });
    document.querySelectorAll('[data-dayline]').forEach(function (x) { x.textContent = x.classList.contains('hv3-date') ? new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Chicago' }) : 'Day #' + dn + ' · ' + dt; });
    document.querySelectorAll('[data-dayno]').forEach(function (x) { x.textContent = '#' + dn; });
        refreshHub(); loadBoard();
    var ch = readChallenge(location.search) || readChallenge(location.hash.indexOf('c=') >= 0 ? location.hash : '');
    if (ch) challengeIntro(ch);
  });
})();
