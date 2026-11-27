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
/* Watch & grow: keep the message title on one line on computers (shrinks to fit, never below 28px; a title
   too long even then wraps to two lines at its normal size) */
(function () {
  var h = document.getElementById('rf-latest-title');
  if (!h) return;
  var busy = false;
  function fit() {
    if (busy) return; busy = true;
    h.style.fontSize = ''; h.classList.remove('one-line');
    if (window.innerWidth >= 901) {
      h.classList.add('one-line');
      var size = parseFloat(getComputedStyle(h).fontSize);
      while (h.scrollWidth > h.clientWidth + 1 && size > 28) { size -= 1; h.style.fontSize = size + 'px'; }
      if (h.scrollWidth > h.clientWidth + 1) { h.style.fontSize = ''; h.classList.remove('one-line'); }
    }
    busy = false;
  }
  var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fit, 120); });
  if (window.MutationObserver) new MutationObserver(function () { if (!busy) fit(); }).observe(h, { childList: true, characterData: true, subtree: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  fit();
})();
