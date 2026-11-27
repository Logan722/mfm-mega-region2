/* Phone layouts (Dawn, Nov 26 2026): swipe cards with dots for the value cards and the homepage albums,
   tabs for the Ministries page. Computers keep their normal layout. */
(function () {
  var mq = window.matchMedia('(max-width: 760px)');
  function swipe(sel) {
    [].forEach.call(document.querySelectorAll(sel), function (g) {
      if (g.getAttribute('data-sw')) return; g.setAttribute('data-sw', '1');
      if (window.matchMedia && matchMedia('(max-width: 760px)').matches) { g.tabIndex = 0; g.setAttribute('role', 'region'); g.setAttribute('aria-label', 'Swipe for more'); }
      var cards = [].slice.call(g.children), dots = document.createElement('div');
      if (cards.length < 2) return;
      dots.className = 'sw-dots';
      cards.forEach(function (c, i) {
        var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Item ' + (i + 1) + ' of ' + cards.length);
        b.addEventListener('click', function () { g.scrollTo({ left: c.offsetLeft - g.offsetLeft, behavior: 'smooth' }); });
        dots.appendChild(b);
      });
      g.parentNode.insertBefore(dots, g.nextSibling);
      function on() {
        var mid = g.scrollLeft + g.clientWidth / 2, best = 0, bd = 1e9;
        cards.forEach(function (c, i) { var d = Math.abs(c.offsetLeft - g.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = i; } });
        [].forEach.call(dots.children, function (b, i) { b.classList.toggle('on', i === best); });
      }
      g.addEventListener('scroll', function () { window.requestAnimationFrame(on); }, { passive: true });
      on();
    });
  }
  function tabs() {
    var g = document.querySelector('.ministry-grid'); if (!g || g.getAttribute('data-tabs')) return;
    g.setAttribute('data-tabs', '1');
    var arts = [].slice.call(g.children).filter(function (a) { return a.querySelector('h2'); });
    var bar = document.createElement('div'); bar.className = 'mtabs'; bar.setAttribute('role', 'tablist');
    arts.forEach(function (a, i) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab');
      b.textContent = a.querySelector('h2').textContent.replace(/ Foundation| Singles/, '');
      b.addEventListener('click', function () { show(i); });
      bar.appendChild(b);
    });
    g.insertBefore(bar, g.firstChild);
    function show(k) {
      arts.forEach(function (a, i) { a.classList.toggle('mt-off', i !== k); });
      [].forEach.call(bar.children, function (b, i) { b.classList.toggle('on', i === k); b.setAttribute('aria-selected', i === k ? 'true' : 'false'); });
    }
    show(0);
  }
  swipe('.values-grid, .hg-more');
  tabs();
  if (mq.addEventListener) mq.addEventListener('change', function () {});
})();
