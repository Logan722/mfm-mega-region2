/* Homepage "Today in the region": the day's declaration from the Weekly Scheduler's WhatsApp Channel feed
   (data/declarations.json, made by tools/declarations_feed.py from the weekly manual ZIP).
   Today's entry (Central Time) if there is one, otherwise the latest Declaration of the Week. */
(function () {
  var card = document.querySelector('[data-today-word]');
  if (!card || !window.fetch) return;
  function ctDate() {
    try {
      var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
      var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
      return o.year + '-' + o.month + '-' + o.day;
    } catch (e) { return new Date().toISOString().slice(0, 10); }
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pick(days, today) {
    if (days[today]) return { d: days[today], today: true };
    var keys = Object.keys(days).filter(function (k) { return k <= today && days[k].kind === 'weekly'; }).sort();
    return keys.length ? { d: days[keys[keys.length - 1]], today: false } : null;
  }
  fetch('/data/declarations.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : Promise.reject(); }).then(function (feed) {
    var hit = pick((feed && feed.days) || {}, ctDate());
    if (!hit) return;
    var d = hit.d, weekly = d.kind === 'weekly';
    var label = weekly ? 'Declaration of the week' : 'Today’s declaration';
    var body = weekly
      ? '<p class="tp-decl"><b>' + esc(d.title) + '</b> ' + esc(d.text) + '</p>'
      : '<ul>' + (d.lines || []).map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>';
    var share = '*' + (weekly ? 'Declaration of the week' : 'Today\'s declaration') + '*\n\n"' + d.verse + '" (' + d.ref + ')\n\n' +
      (weekly ? d.title + '\n' + d.text : (d.lines || []).map(function (l, i) { return (i + 1) + '. ' + l; }).join('\n')) +
      '\n\nMFM Mega Region 2 USA | https://mfmmegaregion2usa.org';
    card.innerHTML = '<span class="k">' + label + '</span><blockquote>“' + esc(d.verse) + '”<cite>' + esc(d.ref) + '</cite></blockquote>' + body +
      '<div class="foot"><a class="ek-btn ghost" href="https://wa.me/?text=' + encodeURIComponent(share) + '" target="_blank" rel="noopener">Share on WhatsApp</a></div>';
  }).catch(function () {});
})();
/* Watch & grow: keep the message title on one line (shrinks to fit, never below 28px on computers / 20px on phones;
   a title too long even then wraps at its normal size) */
(function () {
  var h = document.getElementById('rf-latest-title');
  if (!h) return;
  var busy = false;
  function fit() {
    if (busy) return; busy = true;
    h.style.fontSize = ''; h.classList.remove('one-line');
    var floor = window.innerWidth >= 901 ? 28 : 20;
    {
      h.classList.add('one-line'); h.style.textAlign = 'left';   /* measure left-aligned: centred overflow is not counted */
      var size = parseFloat(getComputedStyle(h).fontSize);
      while (h.scrollWidth > h.clientWidth + 1 && size > floor) { size -= 1; h.style.fontSize = size + 'px'; }
      var over = h.scrollWidth > h.clientWidth + 1; h.style.textAlign = '';
      if (over) { h.style.fontSize = ''; h.classList.remove('one-line'); }
    }
    busy = false;
  }
  var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fit, 120); });
  if (window.MutationObserver) new MutationObserver(function () { if (!busy) fit(); }).observe(h, { childList: true, characterData: true, subtree: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  fit();
})();
/* Homepage testimonies: each card title on one line where it can be (shrinks to fit, never below 20px) */
(function () {
  var els = [].slice.call(document.querySelectorAll('.tsa .tsa-feat h3, .tsa .tsa-small h3, .tsa .tsa-feat .tsa-k'));
  if (!els.length) return;
  function fit() {
    els.forEach(function (h) {
      h.style.removeProperty('font-size'); h.style.whiteSpace = '';
      var base = parseFloat(getComputedStyle(h).fontSize), size = base, floor = Math.min(base, h.classList.contains('tsa-k') ? 9.5 : 18);
      h.style.whiteSpace = 'nowrap'; h.style.textAlign = 'left';   /* measure left-aligned: centred overflow is not counted */
      while (h.scrollWidth > h.clientWidth + 1 && size > floor) { size -= 0.5; h.style.setProperty('font-size', size + 'px', 'important'); }
      var over = h.scrollWidth > h.clientWidth + 1; h.style.textAlign = '';
      if (over) { h.style.removeProperty('font-size'); h.style.whiteSpace = ''; }
    });
  }
  var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fit, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  fit();
})();
/* Homepage testimonies, phone version A: swipe cards with dots */
(function () {
  var sec = document.querySelector('.tsa'), g = sec && sec.querySelector('.tsa-grid');
  if (!g) return;
  var cards = [].slice.call(g.querySelectorAll('.tsa-feat, .tsa-small')), dots = document.createElement('div');
  dots.className = 'tsa-dots'; dots.setAttribute('aria-label', 'Testimonies');
  cards.forEach(function (c, i) {
    var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Testimony ' + (i + 1));
    b.addEventListener('click', function () { g.scrollTo({ left: c.offsetLeft - 18, behavior: 'smooth' }); });
    dots.appendChild(b);
  });
  g.parentNode.insertBefore(dots, g.nextSibling);
  function on() {
    if (sec.getAttribute('data-mv') !== 'a' || getComputedStyle(g).display !== 'flex') { dots.hidden = true; return; }
    dots.hidden = false;
    var mid = g.scrollLeft + g.clientWidth / 2, best = 0, bd = 1e9;
    cards.forEach(function (c, i) { var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = i; } });
    [].forEach.call(dots.children, function (b, i) { b.classList.toggle('on', i === best); });
  }
  g.addEventListener('scroll', function () { window.requestAnimationFrame(on); }, { passive: true });
  window.addEventListener('resize', on); on();
})();
/* Today in the region on phones: the declaration and Game of the Week cards swipe side by side; dots show which one is in view */
(function () {
  var g = document.querySelector('.today .today-panel'); if (!g) return;
  var n = g.children.length; if (n < 2) return;
  var d = document.createElement('div'); d.className = 'td-dots'; d.setAttribute('aria-hidden', 'true'); d.innerHTML = new Array(n + 1).join('<i></i>');
  g.parentNode.insertBefore(d, g.nextSibling);
  function upd() { var max = g.scrollWidth - g.clientWidth, k = max > 0 ? Math.round(g.scrollLeft / max * (n - 1)) : 0; Array.prototype.forEach.call(d.children, function (x, i) { x.className = i === k ? 'on' : ''; }); }
  g.addEventListener('scroll', function () { window.requestAnimationFrame(upd); }, { passive: true }); upd();
})();
