/* Site-wide widgets: floating social hub, Prayer Points / Watch Live nav,
   "We're Live" banner, and PWA service-worker registration. */
(function () {
  var CHANNEL = 'https://whatsapp.com/channel/0029VaO63PADJ6H057Ikrl3G';
  var PRAYER  = 'https://www.mountainoffire.org/resources/prayer-points';

  /* ── Floating social hub (tap the trigger to fan out our channels) ── */
  var SHARE_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81a3 3 0 1 0-3-3c0 .24.04.47.09.7L8.04 9.81A3 3 0 1 0 6 15c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65a2.92 2.92 0 1 0 2.92-2.92z"/></svg>';
  var X_SVG     = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  var NETS = [
    { net: 'youtube',   name: 'YouTube',          href: 'https://youtube.com/@mfmmegaregion2usa',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>' },
    { net: 'instagram', name: 'Instagram',        href: 'https://www.instagram.com/mfmmegaregion2usa',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.17.4.37 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.17-1 .37-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2m0 1.98c-3.14 0-3.5 0-4.75.07-.9.04-1.4.2-1.7.32-.43.17-.74.37-1.06.7-.32.32-.52.63-.7 1.06-.12.3-.28.8-.32 1.7C3.4 8.5 3.4 8.86 3.4 12s0 3.5.07 4.75c.04.9.2 1.4.32 1.7.17.43.37.74.7 1.06.32.32.63.52 1.06.7.3.12.8.28 1.7.32 1.25.06 1.6.07 4.75.07s3.5 0 4.75-.07c.9-.04 1.4-.2 1.7-.32.43-.17.74-.37 1.06-.7.32-.32.52-.63.7-1.06.12-.3.28-.8.32-1.7.06-1.25.07-1.6.07-4.75s0-3.5-.07-4.75c-.04-.9-.2-1.4-.32-1.7-.17-.43-.37-.74-.7-1.06-.32-.32-.63-.52-1.06-.7-.3-.12-.8-.28-1.7-.32-1.25-.06-1.6-.07-4.75-.07M12 6.87A5.13 5.13 0 1 0 12 17.13 5.13 5.13 0 0 0 12 6.87m0 8.46A3.33 3.33 0 1 1 12 8.67a3.33 3.33 0 0 1 0 6.66m6.53-8.68a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0"/></svg>' },
    { net: 'facebook',  name: 'Facebook',         href: 'https://www.facebook.com/share/1Dc7HJMPVs/',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8.2h2.76l.41-3.2h-3.17V7.55c0-.93.26-1.56 1.59-1.56h1.69V3.13c-.29-.04-1.3-.13-2.47-.13-2.44 0-4.11 1.49-4.11 4.23v2.36H7.42v3.2h2.77V21z"/></svg>' },
    { net: 'whatsapp',  name: 'WhatsApp Channel', href: CHANNEL,
      svg: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 .3C7.3.3.3 7.3.3 16c0 2.8.7 5.5 2.1 7.9L.2 31.7l8-2.1a15.6 15.6 0 007.8 2c8.7 0 15.7-7 15.7-15.7S24.7.3 16 .3zm0 28.6c-2.5 0-4.9-.7-7-1.9l-.5-.3-4.7 1.2 1.3-4.6-.3-.5a12.8 12.8 0 01-2-6.8C2.8 8.7 8.7 2.9 16 2.9c7.2 0 13.1 5.9 13.1 13.1S23.2 28.9 16 28.9zm7.2-9.8c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2s-1 1.3-1.3 1.5c-.2.2-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.6.1-.2 0-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.7-.6-.6-.9-.6h-.7c-.2 0-.6.1-1 .5-.3.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.2 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.1-.3-.2-.7-.4z"/></svg>' }
  ];

  var hub = document.createElement('div');
  hub.className = 'social-hub';
  hub.id = 'socialHub';
  var itemsHTML = '';
  for (var i = 0; i < NETS.length; i++) {
    var n = NETS[i];
    itemsHTML += '<a class="social-item" data-net="' + n.net + '" href="' + n.href +
      '" target="_blank" rel="noopener" aria-label="' + n.name + '">' +
      '<span class="si-label">' + n.name + '</span>' +
      '<span class="si-ico">' + n.svg + '</span></a>';
  }
  hub.innerHTML = itemsHTML +
    '<button type="button" class="social-fab" aria-label="Connect with us" aria-expanded="false" aria-controls="socialHub">' +
    '<span class="fab-ico fab-open">' + SHARE_SVG + '</span>' +
    '<span class="fab-ico fab-close">' + X_SVG + '</span></button>';
  document.body.appendChild(hub);

  var fab = hub.querySelector('.social-fab');
  function setOpen(open) {
    hub.classList.toggle('open', open);
    fab.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  fab.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!hub.classList.contains('open'));
  });
  document.addEventListener('click', function (e) {
    if (!hub.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) setOpen(false);
  });
  var links = hub.querySelectorAll('.social-item');
  for (var j = 0; j < links.length; j++) {
    links[j].addEventListener('click', function () { setOpen(false); });
  }

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
