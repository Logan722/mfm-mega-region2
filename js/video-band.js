/* Looping "video band" sections on About and Branches (audit C-06 / C-08 / C-09).
   - Plays only while on screen and the tab is visible; never autoplays under
     prefers-reduced-motion or Save-Data (the still image stays).
   - Picks ONE source per device (phone portrait encode <= 600px, else desktop).
   - Visible Pause/Play button (>=44px) with an accurate accessible name; a visitor's
     pause is respected until they press Play again.
   - Video failure: hidden, button removed, still image remains. */
(function () {
  var bands = document.querySelectorAll('.video-band');
  if (!bands.length) return;
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var conn = navigator.connection || {};
  var lowData = !!conn.saveData || /(^|slow-)2g$/.test(conn.effectiveType || '');
  function autoOK() { return !reduce.matches && !lowData; }

  [].forEach.call(bands, function (band) {
    var v = band.querySelector('video.video-band-video');
    var btn = band.querySelector('[data-band-toggle]');
    if (!v) return;
    var attached = false, failed = false, userPaused = false, inView = false;
    var label = btn && btn.querySelector('.hm-label');
    function setState(playing) {
      if (!btn) return;
      btn.hidden = false;
      btn.classList.toggle('is-paused', !playing);
      btn.setAttribute('aria-label', playing ? 'Pause background video' : 'Play background video');
      if (label) label.textContent = playing ? 'Pause' : 'Play';
    }
    function fail() { failed = true; band.classList.remove('is-playing'); v.hidden = true; if (btn) btn.hidden = true; }
    function attach() {
      if (attached) return; attached = true;
      v.addEventListener('error', fail);
      var mob = window.matchMedia && window.matchMedia('(max-width: 600px)').matches;
      v.src = (mob && v.getAttribute('data-src-mobile')) || v.getAttribute('data-src-desktop');
    }
    function play() {
      if (failed) return; attach();
      var p; try { p = v.play(); } catch (e) { p = null; }
      if (p && p.then) p.then(null, function () { band.classList.remove('is-playing'); if (!failed) setState(false); });
    }
    v.addEventListener('playing', function () { band.classList.add('is-playing'); setState(true); });
    v.addEventListener('pause', function () { if (!failed) setState(false); });
    if (btn) btn.addEventListener('click', function () {
      if (v.paused) { userPaused = false; play(); } else { userPaused = true; v.pause(); }
    });
    function sync() {
      if (failed) return;
      var go = inView && !document.hidden && !userPaused && autoOK();
      if (go) play(); else if (attached && !v.paused) v.pause();
    }
    document.addEventListener('visibilitychange', sync);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { inView = es[0].isIntersecting; sync(); }, { threshold: 0.25 }).observe(band);
    } else { inView = true; sync(); }
    if (!autoOK()) setState(false);
  });
})();
