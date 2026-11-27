/* Women Foundation page: leader profile pop-ups (phone tiles). */
(function () {
  var last = null;
  function open(d) {
    if (!d || !d.showModal) return;
    last = document.activeElement; d.showModal();
    requestAnimationFrame(function () { d.classList.add('on'); });
  }
  function close(d) {
    d.classList.remove('on');
    setTimeout(function () { if (d.open) d.close(); if (last && last.focus) last.focus(); }, 220);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-ld-open]');
    if (b) { e.preventDefault(); open(document.getElementById(b.getAttribute('data-ld-open'))); return; }
    var x = e.target.closest('[data-ld-close]');
    if (x) { close(x.closest('dialog')); return; }
    if (e.target.matches && e.target.matches('dialog.wf-ld')) close(e.target);
  });
  document.addEventListener('cancel', function (e) {
    if (e.target.matches && e.target.matches('dialog.wf-ld')) { e.preventDefault(); close(e.target); }
  }, true);
})();
