/* Homepage full-bleed video hero (owner-locked scope, Oct 2026). Homepage only.
   - Poster first; the video is attached only when motion is allowed (never under
     prefers-reduced-motion or Save-Data / 2G), so phones never download the desktop file
     and vice versa (one source chosen per device).
   - Visible Pause/Play button with an accurate accessible name; pauses when the tab is hidden
     or the hero scrolls away, resumes only if the visitor has not paused it.
   - Autoplay blocked or video failure: the poster + copy remain a complete first screen.
   - No JS: the <picture> poster, headline and actions work on their own. */
(function () {
  var hero = document.querySelector('[data-home-hero]');
  if (!hero) return;
  var v = hero.querySelector('video.home-hero-video');
  var btn = hero.querySelector('[data-hero-toggle]');
  if (!v || !btn) return;

  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
  var lowData = !!conn.saveData || /(^|slow-)2g$/.test(conn.effectiveType || '');
  var label = btn.querySelector('.hm-label');
  var userPaused = false, inView = true, attached = false, failed = false;

  function autoAllowed() { return !reduce.matches && !lowData; }
  function chooseSrc() {
    return (window.matchMedia && window.matchMedia('(max-width: 600px)').matches) ? v.getAttribute('data-src-mobile') : v.getAttribute('data-src-desktop');
  }
  function setState(playing) {
    btn.hidden = false;
    btn.classList.toggle('is-paused', !playing);
    btn.setAttribute('aria-label', playing ? 'Pause background video' : 'Play background video');
    if (label) label.textContent = playing ? 'Pause' : 'Play';
  }
  function fail() {
    failed = true;
    hero.classList.remove('is-playing');
    v.hidden = true;
    btn.hidden = true;
  }
  function attach() {
    if (attached) return;
    attached = true;
    v.addEventListener('error', fail);
    v.src = chooseSrc();
  }
  function play() {
    if (failed) return;
    attach();
    var p;
    try { p = v.play(); } catch (e) { p = null; }
    if (p && typeof p.then === 'function') {
      p.then(null, function () { hero.classList.remove('is-playing'); if (!failed) setState(false); });
    }
  }

  v.addEventListener('playing', function () { hero.classList.add('is-playing'); setState(true); });
  v.addEventListener('pause', function () { if (!failed) setState(false); });

  btn.addEventListener('click', function () {
    if (v.paused) { userPaused = false; play(); }
    else { userPaused = true; v.pause(); }
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (!v.paused) v.pause(); }
    else if (attached && !userPaused && inView && autoAllowed()) play();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (!attached) return;
      if (!inView) { if (!v.paused) v.pause(); }
      else if (!userPaused && !document.hidden && autoAllowed()) play();
    }, { threshold: 0.15 }).observe(hero);
  }

  if (autoAllowed()) play();
  else setState(false); /* reduced motion / data saver: stable poster; visitor may start the video */
})();
