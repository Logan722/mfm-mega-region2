/* Play & Grow — Bible Stories (Dawn, 2026-11-27): a library of animated Bible storybooks.
   Two shelves (Dawn, 2026-11-27): Bible Characters (well-known and hidden heroes together) and Great Events (one-chapter stories). On phones each shelf is a two-row swipe carousel. Each character has chapters that play in
   order. Only released stories are listed (Dawn, 2026-11-28); the waiting list lives in tools/bank/storylines/storylines.json; each chapter is its own page under /stories/. Progress is kept on this device (localStorage "mfm-story"). */
(function () {
  var X = window.PG; if (!X) return;
  var esc = X.esc, ls = X.ls;
  var ICO = {
    coat: '<path d="M22 14h20l8 10-6 4v26H20V28l-6-4z" fill="#c8312b"/><path d="M26 14v40M32 14v40M38 14v40" stroke="#e9a826" stroke-width="5"/><path d="M22 14h20l8 10-6 4v26H20V28l-6-4z" fill="none" stroke="#2b1a10" stroke-width="3" stroke-linejoin="round"/>',
    staff: '<path d="M30 56V18c0-8 12-8 12 0" fill="none" stroke="#2b1a10" stroke-width="9" stroke-linecap="round"/><path d="M30 56V18c0-8 12-8 12 0" fill="none" stroke="#a0703c" stroke-width="4" stroke-linecap="round"/><path d="M12 46c8-4 14 4 20 0s12-4 20 0" fill="none" stroke="#2f6fd0" stroke-width="4" stroke-linecap="round"/>',
    sling: '<circle cx="40" cy="40" r="9" fill="#9a8f80" stroke="#2b1a10" stroke-width="3"/><path d="M14 14c4 14 12 22 22 24M14 14c10 4 18 12 22 24" fill="none" stroke="#7a5230" stroke-width="4" stroke-linecap="round"/>',
    lion: '<circle cx="32" cy="32" r="18" fill="#e9a826" stroke="#2b1a10" stroke-width="3"/><circle cx="32" cy="34" r="11" fill="#f6d08a" stroke="#2b1a10" stroke-width="2.5"/><circle cx="28" cy="32" r="1.8" fill="#2b1a10"/><circle cx="36" cy="32" r="1.8" fill="#2b1a10"/><path d="M29 38q3 3 6 0" fill="none" stroke="#2b1a10" stroke-width="2"/>',
    fire: '<path d="M32 8c4 10 14 14 14 28a14 14 0 0 1-28 0c0-8 6-12 8-20 2 6 6 8 6 8s0-8 0-16z" fill="#ff8a2a" stroke="#2b1a10" stroke-width="3" stroke-linejoin="round"/><path d="M32 30c3 5 6 7 6 12a6 6 0 0 1-12 0c0-4 4-6 6-12z" fill="#ffd23f"/>',
    crown: '<path d="M12 44l4-24 10 12 6-16 6 16 10-12 4 24z" fill="#e9a826" stroke="#2b1a10" stroke-width="3" stroke-linejoin="round"/><rect x="12" y="44" width="40" height="8" rx="2" fill="#c8312b" stroke="#2b1a10" stroke-width="3"/>',
    pray: '<path d="M30 54V30l-8-12c-2-3 2-6 4-3l8 10M34 54V30l8-12c2-3-2-6-4-3l-8 10" fill="#d9a06a" stroke="#2b1a10" stroke-width="3" stroke-linejoin="round"/><path d="M32 6v6M22 10l3 5M42 10l-3 5" stroke="#e9a826" stroke-width="3" stroke-linecap="round"/>',
    rope: '<rect x="14" y="30" width="36" height="26" rx="4" fill="#3a2614" stroke="#2b1a10" stroke-width="3"/><path d="M32 6v30" stroke="#a0703c" stroke-width="5" stroke-linecap="round"/><circle cx="32" cy="40" r="5" fill="#d9a06a" stroke="#2b1a10" stroke-width="2.5"/>',
    cave: '<path d="M6 54c4-26 16-40 26-40s22 14 26 40z" fill="#9a8f80" stroke="#2b1a10" stroke-width="3"/><path d="M20 54c2-12 6-20 12-20s10 8 12 20z" fill="#2b1a10"/>',
    mount: '<path d="M4 54l20-34 10 14 8-10 18 30z" fill="#7f9a45" stroke="#2b1a10" stroke-width="3" stroke-linejoin="round"/><path d="M24 20l5 8-5-2-5 2z" fill="#fff"/>',
    water: '<path d="M32 10c8 12 14 20 14 28a14 14 0 0 1-28 0c0-8 6-16 14-28z" fill="#6cc3f0" stroke="#2b1a10" stroke-width="3"/><path d="M26 38a6 6 0 0 0 6 6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
    star: '<circle cx="32" cy="30" r="20" fill="#fff1b8" opacity=".55"/><path d="M32 6l5 17 17 5-17 5-5 17-5-17-17-5 17-5z" fill="#ffe27a" stroke="#2b1a10" stroke-width="3" stroke-linejoin="round"/><path d="M14 56h36" stroke="#2b1a10" stroke-width="3" stroke-linecap="round"/>',
    ark: '<path d="M6 36h52l-8 16H14z" fill="#a0703c" stroke="#2b1a10" stroke-width="3" stroke-linejoin="round"/><rect x="18" y="22" width="28" height="14" fill="#d9a06a" stroke="#2b1a10" stroke-width="3"/><path d="M4 58c6-4 10 4 16 0s10-4 16 0 10 4 16 0 8-2 8-2" fill="none" stroke="#6cc3f0" stroke-width="4" stroke-linecap="round"/>',
    wall: '<path d="M8 54V22h12v-8h8v8h8v-8h8v8h12v32z" fill="#c9a46e" stroke="#2b1a10" stroke-width="3" stroke-linejoin="round"/><path d="M8 34h48M8 44h48M20 22v12M32 34v10M44 22v12" stroke="#2b1a10" stroke-width="2"/><path d="M40 6l4 6h-8z" fill="#e9a826"/>',
    tomb: '<path d="M6 56c2-24 14-40 26-40s24 16 26 40z" fill="#9a8f80" stroke="#2b1a10" stroke-width="3"/><path d="M22 56c0-12 4-20 10-20s10 8 10 20z" fill="#fff1b8" stroke="#2b1a10" stroke-width="3"/><circle cx="52" cy="46" r="10" fill="#7d7466" stroke="#2b1a10" stroke-width="3"/>',
    hands: '<path d="M18 56V24M46 56V24" stroke="#2b1a10" stroke-width="9" stroke-linecap="round"/><path d="M18 56V24M46 56V24" stroke="#d9a06a" stroke-width="5" stroke-linecap="round"/><path d="M8 60h48" stroke="#9a8f80" stroke-width="6" stroke-linecap="round"/><circle cx="32" cy="16" r="8" fill="#ffd23f" stroke="#2b1a10" stroke-width="3"/>'
  };
  var SHELVES = [
    { id: 'characters', title: 'Bible Characters', line: 'Well-known heroes and hidden ones. Choose a character and walk inside their story.', items: [
      { id: 'joseph', name: 'Joseph', ref: 'Genesis 37–50', tag: 'The dreamer', ico: 'coat', col: '#7a3fa0', chapters: [
        { id: 'joseph-1', title: 'The Coat and the Pit', ref: 'Genesis 37', ready: 1, added: '2026-11-30' },
        { id: 'joseph-2', title: 'Potiphar’s House', ref: 'Genesis 39', ready: 1, added: '2026-11-30' },
        { id: 'joseph-3', title: 'The Prison and the Palace', ref: 'Genesis 40–41', ready: 1, added: '2026-11-30' }], more: 1 }] },
    { id: 'events', title: 'Great Events', line: 'The great moments of the Bible, each one a story you can play in one go.', items: [
      { id: 'christmas', name: 'The First Christmas', ref: 'Luke 1–2 · Matthew 1–2', tag: 'A Saviour is born', ico: 'star', col: '#2f4f8f', chapters: [
        { id: 'christmas-1', title: 'A Saviour Is Born', ref: 'Luke 1–2 · Matthew 1–2', ready: 1, added: '2026-11-30' }] }] }
  ];
  var MAX = 600;
  function prog() { return ls('mfm-story') || {}; }
  function stars(c) { var p = prog()[c]; if (!p || !p.done) return 0; return p.best >= 550 ? 3 : p.best >= 400 ? 2 : 1; }
  function starRow(n) { var h = ''; for (var i = 0; i < 3; i++) h += '<svg viewBox="0 0 24 24" class="' + (i < n ? 'on' : '') + '" aria-hidden="true"><path d="M12 2l3 6.6 7 .7-5.3 4.7 1.6 7L12 17.3 5.7 21l1.6-7L2 9.3l7-.7z"/></svg>'; return '<span class="sb-stars" aria-label="' + n + ' of 3 stars">' + h + '</span>'; }
  function href(ch) { return (/\.html$/.test(location.pathname) || location.protocol === 'file:' ? 'stories/' + ch + '.html' : '/stories/' + ch); }
  function ico(it) { return '<span class="sb-ico" style="--c:' + it.col + '"><svg viewBox="0 0 64 64" aria-hidden="true">' + ICO[it.ico] + '</svg></span>'; }
  // Releases (Dawn, 2026-11-28): only released stories are on the shelves, never greyed "coming soon" cards.
  // Each Monday's new characters/events/chapters carry added:'YYYY-MM-DD' (that Monday) and show "New this week"
  // from 9:00 AM CT that Monday for seven days. Earlier releases stay on the shelf for good.
  function relAt(d) { return Date.parse(d + 'T15:00:00Z'); } // 9:00 AM CST
  function isNew(c) { if (!c || !c.added) return false; var t = relAt(c.added), n = Date.now(); return n >= t - 36e5 && n < t + 7 * 864e5; }
  function live(it) { return (it.chapters || []).filter(function (c) { return c.ready; }); }
  var NEWTAG = '<span class="sb-new"><i aria-hidden="true"></i>New this week</span>';
  function card(it) {
    var chs = live(it), ready = chs.length;
    var got = chs.reduce(function (s, c) { return s + stars(c.id); }, 0);
    var nw = chs.some(isNew);
    return '<button type="button" class="sb-card' + (nw ? ' is-new' : '') + '" data-story="' + it.id + '">' + (nw ? NEWTAG : '') + ico(it) +
      '<b>' + esc(it.name) + '</b><small>' + esc(it.tag) + ' &middot; ' + esc(it.ref) + '</small>' +
      '<span class="sb-meta">' + ready + (ready === 1 ? ' chapter' : ' chapters') + (got ? ' &middot; ' + got + ' &#9733;' : '') + '</span>' +
      (it.more ? '<span class="sb-more">More chapters coming</span>' : '') + '</button>';
  }
  // Wide screens show each shelf as one row that scrolls sideways (so the library fits on one screen as it grows);
  // arrow buttons appear only when a shelf has more cards than fit.
  function shelfArrows(root) {
    root.querySelectorAll('.sb-shelf').forEach(function (sh) {
      var g = sh.querySelector('.sb-grid'); if (!g) return;
      var wrap = document.createElement('div'); wrap.className = 'sb-row'; g.parentNode.insertBefore(wrap, g); wrap.appendChild(g);
      var mk = function (dir, label) { var b = document.createElement('button'); b.type = 'button'; b.className = 'sb-arr ' + dir; b.setAttribute('aria-label', label);
        b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (dir === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7') + '"/></svg>';
        b.addEventListener('click', function () { g.scrollBy({ left: (dir === 'prev' ? -1 : 1) * Math.max(200, g.clientWidth * .8), behavior: 'smooth' }); }); wrap.appendChild(b); return b; };
      var pv = mk('prev', 'Show earlier ' + (sh.querySelector('h3') || {}).textContent), nx = mk('next', 'Show more ' + (sh.querySelector('h3') || {}).textContent);
      var upd = function () { var over = g.scrollWidth - g.clientWidth > 4; wrap.classList.toggle('over', over); sh.classList.toggle('sb-over', over); pv.disabled = g.scrollLeft < 4; nx.disabled = g.scrollLeft > g.scrollWidth - g.clientWidth - 4; };
      g.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
    });
  }
  function library() {
    X.set({ mode: 'story', pts: 0, phase: 'lib' }); X.open();
    X.frame('<div class="st-card sb"><p class="st-k">Play &amp; Grow</p><h2 class="st-h">Bible Stories</h2><p class="st-sub">Choose a character or a great event and play it as an animated storybook. Questions follow what happened in the Bible; right or wrong, the story keeps going. Every chapter counts on the leaderboard.</p>' +
      SHELVES.map(function (sh) { var its = sh.items.filter(function (i) { return live(i).length; }); if (!its.length) return '';
        return '<section class="sb-shelf"><h3>' + esc(sh.title) + '</h3><p>' + esc(sh.line) + '</p><div class="sb-grid' + (its.length > 4 ? ' two' : '') + '">' + its.map(card).join('') + '</div><p class="sb-swipe" aria-hidden="true">Swipe to see more &rarr;</p></section>'; }).join('') + '</div>', 'sb-stage');
    var st = document.getElementById('play-app');
    shelfArrows(st);
    st.querySelectorAll('[data-story]').forEach(function (b) { b.addEventListener('click', function () { var it = find(b.getAttribute('data-story')); var cs = it && live(it); if (!cs || !cs.length) return; if (cs.length === 1 && !it.more) { location.href = href(cs[0].id); return; } chapters(it); }); });
  }
  function find(id) { var r = null; SHELVES.forEach(function (s) { s.items.forEach(function (i) { if (i.id === id) r = i; }); }); return r; }
  function chapters(it) {
    var p = prog(), open = true, chs = live(it);
    X.frame('<div class="st-card sb">' + '<button type="button" class="sb-back">&larr; All stories</button>' + ico(it) + '<h2 class="st-h">' + esc(it.name) + '</h2><p class="st-sub">' + esc(it.tag) + ' &middot; ' + esc(it.ref) + '</p><ol class="sb-chs">' +
      chs.map(function (c, k) {
        var can = open, done = p[c.id] && p[c.id].done; if (!done) open = false;
        return '<li class="' + (can ? '' : 'next') + '"><span class="sb-n">' + (k + 1) + '</span><span class="sb-t"><b>' + esc(c.title) + (isNew(c) ? ' <span class="sb-new sm">New</span>' : '') + '</b><small>' + esc(c.ref) + (done ? ' &middot; best ' + p[c.id].best + ' of ' + MAX : '') + '</small></span>' +
          (can ? starRow(stars(c.id)) + '<a class="pg-btn light" href="' + href(c.id) + '">' + (done ? 'Play again' : 'Play') + '</a>' : '<span class="sb-after">Play chapter ' + k + ' first</span>') + '</li>';
      }).join('') + '</ol>' + (it.more ? '<p class="sb-more-l">More chapters of ' + esc(it.name) + '’s story are coming.</p>' : '') + '</div>', 'sb-stage');
    document.querySelector('#play-app .sb-back').addEventListener('click', library);
  }
  X.games.story = function () { library(); };
  X.STORIES = SHELVES;
})();
