/* Site-wide widgets: WhatsApp channel button, Prayer Points / Watch Live nav,
   "We're Live" banner, and PWA service-worker registration. */
(function () {
  var CHANNEL = 'https://whatsapp.com/channel/0029VaO63PADJ6H057Ikrl3G';
  var PRAYER  = 'https://www.mountainoffire.org/resources/prayer-points';

  /* Floating WhatsApp Channel button */
  var wa = document.createElement('a');
  wa.href = CHANNEL; wa.target = '_blank'; wa.rel = 'noopener';
  wa.className = 'wa-float';
  wa.setAttribute('aria-label', 'Join our WhatsApp Channel');
  wa.innerHTML = '<svg viewBox="0 0 32 32" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M16 .3C7.3.3.3 7.3.3 16c0 2.8.7 5.5 2.1 7.9L.2 31.7l8-2.1a15.6 15.6 0 007.8 2c8.7 0 15.7-7 15.7-15.7S24.7.3 16 .3zm0 28.6c-2.5 0-4.9-.7-7-1.9l-.5-.3-4.7 1.2 1.3-4.6-.3-.5a12.8 12.8 0 01-2-6.8C2.8 8.7 8.7 2.9 16 2.9c7.2 0 13.1 5.9 13.1 13.1S23.2 28.9 16 28.9zm7.2-9.8c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2s-1 1.3-1.3 1.5c-.2.2-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.6.1-.2 0-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.7-.6-.6-.9-.6h-.7c-.2 0-.6.1-1 .5-.3.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.2 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.1-.3-.2-.7-.4z"/></svg><span class="wa-float-label">WhatsApp Channel</span>';
  document.body.appendChild(wa);

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
