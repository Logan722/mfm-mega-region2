/* Site-wide widgets: Prayer Points / Watch Live nav,
   "We're Live" banner, and PWA service-worker registration. */
(function () {
  var CHANNEL = 'https://whatsapp.com/channel/0029VaO63PADJ6H057Ikrl3G';
  var PRAYER  = 'https://www.mountainoffire.org/resources/prayer-points';

  /* (Floating social hub removed Oct 2026 — audit B-01 / GOV-008.) */

  /* Prayer Points + Watch Live in the Programs dropdown and drawer */
  var prog = document.querySelector('.nav-dropdown-menu');
  if (prog) {
    var w = document.createElement('a');
    w.href = 'watch.html';
    w.innerHTML = '<div class="nav-dd-label">Watch Live<span>Join our services online</span></div>';
    prog.appendChild(w);
    var a = document.createElement('a');
    a.href = PRAYER; a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = '<div class="nav-dd-label">Prayer Points<span>Daily prayer points from MFM</span></div>';
    prog.appendChild(a);
  }
  var drawer = document.querySelector('.drawer-nav');
  if (drawer) {
    var dw = document.createElement('a'); dw.href = 'watch.html'; dw.textContent = 'Watch Live'; drawer.appendChild(dw);
    var dp = document.createElement('a'); dp.href = PRAYER; dp.target = '_blank'; dp.rel = 'noopener'; dp.textContent = 'Prayer Points'; drawer.appendChild(dp);
  }

  /* ── Fix: always close the mobile drawer when a drawer link is tapped ──
     Without this, tapping a link that opens in a new tab (e.g. Prayer Points)
     or points to the current page leaves the drawer + overlay open and the page
     scroll-locked (body.drawer-open) — which reads as a "frozen" menu/page. */
  function forceCloseDrawer() {
    var dr = document.getElementById('drawer');
    var ov = document.getElementById('drawerOverlay');
    var ham = document.getElementById('navHamburger');
    if (dr) dr.classList.remove('open');
    if (ov) ov.classList.remove('open');
    if (ham) { ham.classList.remove('open'); ham.setAttribute('aria-expanded', 'false'); }
    document.body.classList.remove('drawer-open');
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('#drawer a, .drawer-nav a')) forceCloseDrawer();
  });
  /* Defensive: never leave the page scroll-locked after a back/forward restore */
  window.addEventListener('pageshow', forceCloseDrawer);

  /* "We're Live" banner during online service windows (Central Time) */
  try {
    var ct = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }));
    var day = ct.getDay(), mins = ct.getHours() * 60 + ct.getMinutes();
    var live = (day === 2 && mins >= 1140 && mins <= 1230) ||  /* Tue 7:00-8:30 PM */
               (day === 4 && mins >= 1080 && mins <= 1170);    /* Thu 6:00-7:30 PM */
    if (live && !/watch\.html$/.test(location.pathname)) {
      var lb = document.createElement('a');
      lb.href = 'watch.html'; lb.className = 'live-banner';
      lb.innerHTML = '<span class="live-dot"></span> We are LIVE now — Watch the service &rarr;';
      document.body.appendChild(lb);
      document.body.classList.add('has-live-banner');
    }
  } catch (e) {}

  /* PWA service worker */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });
  }
})();
