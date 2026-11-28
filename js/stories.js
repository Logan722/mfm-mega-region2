/* Play & Grow — Bible Stories (Dawn, 2026-11-27): a library of animated Bible storybooks.
   Two shelves: Heroes of Faith (well-known) and Hidden Heroes (less-known). Each character has chapters that play in
   order; each chapter is its own page under /stories/. Progress is kept on this device (localStorage "mfm-story"). */
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
    hands: '<path d="M18 56V24M46 56V24" stroke="#2b1a10" stroke-width="9" stroke-linecap="round"/><path d="M18 56V24M46 56V24" stroke="#d9a06a" stroke-width="5" stroke-linecap="round"/><path d="M8 60h48" stroke="#9a8f80" stroke-width="6" stroke-linecap="round"/><circle cx="32" cy="16" r="8" fill="#ffd23f" stroke="#2b1a10" stroke-width="3"/>'
  };
  var SHELVES = [
    { id: 'heroes', title: 'Heroes of Faith', line: 'The stories everyone knows, told so you can walk inside them.', items: [
      { id: 'joseph', name: 'Joseph', ref: 'Genesis 37–50', tag: 'The dreamer', ico: 'coat', col: '#7a3fa0', chapters: [
        { id: 'joseph-1', title: 'The Coat and the Pit', ref: 'Genesis 37', ready: 1 },
        { id: 'joseph-2', title: 'Potiphar’s House', ref: 'Genesis 39', ready: 1 },
        { id: 'joseph-3', title: 'The Prison and the Palace', ref: 'Genesis 40–41', ready: 1 }] },
      { id: 'moses', name: 'Moses', ref: 'Exodus', tag: 'Let my people go', ico: 'staff', col: '#2f6fd0' },
      { id: 'david', name: 'David', ref: '1 Samuel 16–17', tag: 'The shepherd boy', ico: 'sling', col: '#2e9b57' },
      { id: 'daniel', name: 'Daniel', ref: 'Daniel 1–6', tag: 'Faithful in Babylon', ico: 'lion', col: '#c48a1f' },
      { id: 'elijah', name: 'Elijah', ref: '1 Kings 17–18', tag: 'Fire on Mount Carmel', ico: 'fire', col: '#e2511f' },
      { id: 'esther', name: 'Esther', ref: 'Esther', tag: 'For such a time as this', ico: 'crown', col: '#d6336c' }] },
    { id: 'hidden', title: 'Hidden Heroes', line: 'Less-known men and women of the Bible whose faith changed everything.', items: [
      { id: 'jabez', name: 'Jabez', ref: '1 Chronicles 4:9–10', tag: 'The prayer God granted', ico: 'pray', col: '#c9952c' },
      { id: 'ebedmelech', name: 'Ebed-melech', ref: 'Jeremiah 38', tag: 'Out of the pit', ico: 'rope', col: '#11908f' },
      { id: 'obadiah', name: 'Obadiah', ref: '1 Kings 18', tag: 'A hundred prophets hidden', ico: 'cave', col: '#44557a' },
      { id: 'caleb', name: 'Caleb', ref: 'Joshua 14', tag: 'Strong at eighty-five', ico: 'mount', col: '#3fa34d' },
      { id: 'maid', name: 'Naaman’s servant girl', ref: '2 Kings 5', tag: 'One word of faith', ico: 'water', col: '#2c63d6' },
      { id: 'hur', name: 'Hur', ref: 'Exodus 17', tag: 'Holding up the hands', ico: 'hands', col: '#8a5cc7' }] }
  ];
  var MAX = 600;
  function prog() { return ls('mfm-story') || {}; }
  function stars(c) { var p = prog()[c]; if (!p || !p.done) return 0; return p.best >= 550 ? 3 : p.best >= 400 ? 2 : 1; }
  function starRow(n) { var h = ''; for (var i = 0; i < 3; i++) h += '<svg viewBox="0 0 24 24" class="' + (i < n ? 'on' : '') + '" aria-hidden="true"><path d="M12 2l3 6.6 7 .7-5.3 4.7 1.6 7L12 17.3 5.7 21l1.6-7L2 9.3l7-.7z"/></svg>'; return '<span class="sb-stars" aria-label="' + n + ' of 3 stars">' + h + '</span>'; }
  function href(ch) { return (/\.html$/.test(location.pathname) || location.protocol === 'file:' ? 'stories/' + ch + '.html' : '/stories/' + ch); }
  function ico(it) { return '<span class="sb-ico" style="--c:' + it.col + '"><svg viewBox="0 0 64 64" aria-hidden="true">' + ICO[it.ico] + '</svg></span>'; }
  function card(it) {
    var chs = it.chapters || [], ready = chs.filter(function (c) { return c.ready; }).length;
    var got = chs.reduce(function (s, c) { return s + stars(c.id); }, 0);
    return '<button type="button" class="sb-card' + (ready ? '' : ' soon') + '" data-story="' + it.id + '"' + (ready ? '' : ' aria-disabled="true"') + '>' + ico(it) +
      '<b>' + esc(it.name) + '</b><small>' + esc(it.tag) + ' &middot; ' + esc(it.ref) + '</small>' +
      (ready ? '<span class="sb-meta">' + ready + (ready === 1 ? ' chapter' : ' chapters') + (chs.length > ready ? ' &middot; more coming' : '') + (got ? ' &middot; ' + got + ' &#9733;' : '') + '</span>' : '<span class="sb-soon">Coming soon</span>') + '</button>';
  }
  function library() {
    X.set({ mode: 'story', pts: 0, phase: 'lib' }); X.open();
    X.frame('<div class="st-card sb"><p class="st-k">Play &amp; Grow</p><h2 class="st-h">Bible Stories</h2><p class="st-sub">Choose a character and play their story as an animated storybook. Questions follow what happened in the Bible; right or wrong, the story keeps going. Every chapter counts on the leaderboard.</p>' +
      SHELVES.map(function (sh) { return '<section class="sb-shelf"><h3>' + esc(sh.title) + '</h3><p>' + esc(sh.line) + '</p><div class="sb-grid">' + sh.items.map(card).join('') + '</div></section>'; }).join('') + '</div>', 'sb-stage');
    var st = document.getElementById('play-app');
    st.querySelectorAll('[data-story]').forEach(function (b) { b.addEventListener('click', function () { var it = find(b.getAttribute('data-story')); if (it && it.chapters) chapters(it); }); });
  }
  function find(id) { var r = null; SHELVES.forEach(function (s) { s.items.forEach(function (i) { if (i.id === id) r = i; }); }); return r; }
  function chapters(it) {
    var p = prog(), open = true;
    X.frame('<div class="st-card sb">' + '<button type="button" class="sb-back">&larr; All stories</button>' + ico(it) + '<h2 class="st-h">' + esc(it.name) + '</h2><p class="st-sub">' + esc(it.tag) + ' &middot; ' + esc(it.ref) + '</p><ol class="sb-chs">' +
      it.chapters.map(function (c, k) {
        var can = c.ready && open, done = p[c.id] && p[c.id].done; if (!done) open = false;
        return '<li class="' + (can ? '' : 'locked') + '"><span class="sb-n">' + (k + 1) + '</span><span class="sb-t"><b>' + esc(c.title) + '</b><small>' + esc(c.ref) + (done ? ' &middot; best ' + p[c.id].best + ' of ' + MAX : '') + '</small></span>' +
          (can ? starRow(stars(c.id)) + '<a class="pg-btn light" href="' + href(c.id) + '">' + (done ? 'Play again' : 'Play') + '</a>' : '<span class="sb-soon">' + (c.ready ? 'Finish chapter ' + k + ' first' : 'Coming soon') + '</span>') + '</li>';
      }).join('') + '</ol></div>', 'sb-stage');
    document.querySelector('#play-app .sb-back').addEventListener('click', library);
  }
  X.games.story = function () { library(); };
  X.STORIES = SHELVES;
})();
