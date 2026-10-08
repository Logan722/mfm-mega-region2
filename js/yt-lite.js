/* Click-to-load YouTube (audit C-10): nothing from YouTube loads until the visitor presses Play.
   Markup: <a class="yt-lite" href="https://www.youtube.com/watch?v=ID" data-yt="ID" data-title="…">thumbnail…</a>
   No JS: the link simply opens the video on YouTube. */
(function () {
  function play(a, e) {
    var id = a.getAttribute('data-yt'); if (!/^[\w-]{11}$/.test(id || '')) return;
    if (e) e.preventDefault();
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    f.title = a.getAttribute('data-title') || 'Video';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    f.allowFullscreen = true;
    f.className = 'yt-lite-frame';
    a.parentNode.replaceChild(f, a);
    try { f.focus(); } catch (_) {}
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a.yt-lite[data-yt]');
    if (a) play(a, e);
  });
})();
