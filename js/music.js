/* Play & Grow background music (Dawn, Nov 28 2026): soft piano under every game and Bible Story,
   ON by default with a mute button in the game's top bar; each person's choice is remembered ("mfm-music").
   Browsers only allow sound after a tap, so it starts on the tap that opens a game or starts a story.
   Original music: audio/play/soft-piano.mp3 (tools/music/make_tracks.py). */
(function () {
  var KEY = 'mfm-music', SRC = (/\.html$/.test(location.pathname) || location.protocol === 'file:' ? (/\/stories\//.test(location.pathname) ? '../' : '') + 'audio/play/' : '/audio/play/') + 'soft-piano.mp3';
  var VOL = 0.3, a = null, fadeT = null, on = true, isStory = !!document.getElementById('title') && !!document.getElementById('start'), started = false;
  try { on = localStorage.getItem(KEY) !== 'off'; } catch (e) {}
  function audio() { if (!a) { a = new Audio(SRC); a.loop = true; a.preload = 'auto'; a.volume = 0; } return a; }
  function fade(to, ms, done) {
    clearInterval(fadeT); var x = audio(), from = x.volume, t0 = Date.now();
    fadeT = setInterval(function () { var k = Math.min(1, (Date.now() - t0) / ms); x.volume = Math.max(0, Math.min(1, from + (to - from) * k)); if (k >= 1) { clearInterval(fadeT); if (done) done(); } }, 40);
  }
  function active() {
    if (document.hidden || window.PG_LOCKED) return false;
    if (isStory) return started;
    var st = document.getElementById('play-app'); return !!(st && st.classList.contains('on'));
  }
  function sync() {
    if (on && active()) { var x = audio(); if (x.paused) { var p = x.play(); if (p && p.catch) p.catch(function () {}); } fade(VOL, 1400); }
    else if (a && !a.paused) fade(0, 450, function () { if (!(on && active())) a.pause(); });
    paint();
  }
  var IC_ON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" fill="none"/></svg>',
      IC_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6" fill="none"/></svg>';
  function btn() {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'mu-btn';
    b.addEventListener('click', function (e) { e.stopPropagation(); on = !on; try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (er) {} sync(); });
    return b;
  }
  function paint() {
    document.querySelectorAll('.mu-btn').forEach(function (b) {
      b.innerHTML = on ? IC_ON : IC_OFF; b.setAttribute('aria-pressed', on ? 'false' : 'true');
      b.setAttribute('aria-label', on ? 'Mute the music' : 'Turn the music on'); b.title = on ? 'Music on (tap to mute)' : 'Music off (tap to play)';
      b.classList.toggle('off', !on);
    });
  }
  function place() {
    if (isStory) {
      var top = document.querySelector('.top'), pts = document.getElementById('pts');
      if (top && pts && !top.querySelector('.mu-btn')) { var w = document.createElement('div'); w.className = 'mu-wrap'; pts.parentNode.insertBefore(w, pts); w.appendChild(btn()); w.appendChild(pts); paint(); }
      return;
    }
    var t = document.querySelector('#play-app .st-top');
    if (t && !t.querySelector('.mu-btn')) { var p = t.querySelector('.st-pts'); if (p) { t.insertBefore(btn(), p); paint(); } }
  }
  var st = document.getElementById('play-app');
  if (st && window.MutationObserver) new MutationObserver(function () { place(); sync(); }).observe(st, { childList: true, attributes: true, attributeFilter: ['class'] });
  if (isStory) {
    var s = document.getElementById('start'); if (s) s.addEventListener('click', function () { started = true; sync(); });
    var r = document.getElementById('restart'); if (r) r.addEventListener('click', function () { started = true; sync(); });
  }
  // a game opened from a link (no tap yet): start on the first tap anywhere
  document.addEventListener('pointerdown', function () { if (on && active() && a && a.paused) sync(); else if (on && active() && !a) sync(); }, true);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', function () { if (a) a.pause(); });
  function boot() { place(); sync(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
