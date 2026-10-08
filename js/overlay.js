/* MFM Mega Region 2 — single overlay owner (audit B-12, B-10, C-04).
   One modal layer at a time for the newsletter dialog, the event details modal and the
   Gallery lightbox:
     - focus moves into the dialog and is trapped (Tab / Shift+Tab)
     - Escape closes the top dialog
     - background is inert and page scroll is locked while open
     - focus returns to the element that opened it
   API:  MFMOverlay.open(rootEl, {dialog, initialFocus, onRequestClose})
         MFMOverlay.close(rootEl)      MFMOverlay.isOpen()      MFMOverlay.current()
   Pages: index.html, events.html, gallery.html (loaded before the scripts that use it). */
(function () {
  if (window.MFMOverlay) return;
  var stack = [];
  var FOCUSABLE = 'a[href],area[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),iframe,[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';

  function visible(el) { return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) && getComputedStyle(el).visibility !== 'hidden'; }
  function focusables(root) { return [].filter.call(root.querySelectorAll(FOCUSABLE), function (el) { return visible(el) && !el.closest('[hidden]') && !el.closest('[inert]'); }); }

  function setInert(root, on) {
    [].forEach.call(document.body.children, function (el) {
      if (el === root || el.contains(root) || el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
      if (on) {
        if (el.hasAttribute('inert')) return;
        el.setAttribute('inert', ''); el.setAttribute('data-mfm-inert', '');
        if (!el.hasAttribute('aria-hidden')) { el.setAttribute('aria-hidden', 'true'); el.setAttribute('data-mfm-ah', ''); }
      } else if (el.hasAttribute('data-mfm-inert')) {
        el.removeAttribute('inert'); el.removeAttribute('data-mfm-inert');
        if (el.hasAttribute('data-mfm-ah')) { el.removeAttribute('aria-hidden'); el.removeAttribute('data-mfm-ah'); }
      }
    });
  }
  var savedOverflow = null, savedPad = null;
  function lockScroll(on) {
    var b = document.body;
    if (on && savedOverflow === null) {
      var sw = window.innerWidth - document.documentElement.clientWidth;
      savedOverflow = b.style.overflow; savedPad = b.style.paddingRight;
      b.style.overflow = 'hidden'; if (sw > 0) b.style.paddingRight = sw + 'px';
    } else if (!on && savedOverflow !== null) {
      b.style.overflow = savedOverflow; b.style.paddingRight = savedPad; savedOverflow = savedPad = null;
    }
  }

  function onKey(e) {
    var top = stack[stack.length - 1]; if (!top) return;
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault(); e.stopPropagation();
      if (top.opts.onRequestClose) top.opts.onRequestClose(); else close(top.root);
      return;
    }
    if (e.key !== 'Tab') return;
    var dlg = top.opts.dialog || top.root, f = focusables(dlg);
    if (!f.length) { e.preventDefault(); dlg.focus(); return; }
    var first = f[0], last = f[f.length - 1], a = document.activeElement;
    if (e.shiftKey && (a === first || !dlg.contains(a))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (a === last || !dlg.contains(a))) { e.preventDefault(); first.focus(); }
  }
  function onFocusIn(e) {
    var top = stack[stack.length - 1]; if (!top) return;
    var dlg = top.opts.dialog || top.root;
    if (!dlg.contains(e.target)) { var f = focusables(dlg); (f[0] || dlg).focus(); }
  }

  function open(root, opts) {
    opts = opts || {};
    if (stack.some(function (s) { return s.root === root; })) return;
    var entry = { root: root, opts: opts, opener: opts.returnFocus || document.activeElement };
    if (!stack.length) {
      document.addEventListener('keydown', onKey, true);
      document.addEventListener('focusin', onFocusIn, true);
      lockScroll(true);
      document.documentElement.classList.add('mfm-overlay-open');
    }
    setInert(root, false); setInert(root, true);
    stack.push(entry);
    var dlg = opts.dialog || root;
    if (!dlg.hasAttribute('tabindex')) dlg.setAttribute('tabindex', '-1');
    setTimeout(function () {
      var target = (typeof opts.initialFocus === 'string' ? dlg.querySelector(opts.initialFocus) : opts.initialFocus) || focusables(dlg)[0] || dlg;
      try { target.focus({ preventScroll: true }); } catch (e) { target.focus(); }
    }, 30);
  }

  function close(root) {
    var i = -1;
    for (var k = 0; k < stack.length; k++) if (stack[k].root === root) i = k;
    if (i < 0) return;
    var entry = stack.splice(i, 1)[0];
    setInert(root, false);
    if (stack.length) { setInert(stack[stack.length - 1].root, true); }
    else {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('focusin', onFocusIn, true);
      lockScroll(false);
      document.documentElement.classList.remove('mfm-overlay-open');
    }
    var o = entry.opener;
    if (o && o.focus && document.contains(o)) { try { o.focus({ preventScroll: true }); } catch (e) { o.focus(); } }
  }

  /* Anything else that behaves like a layer (mobile drawer, menus) counts as "busy". */
  function busy() {
    if (stack.length) return true;
    var b = document.body;
    if (b.classList.contains('drawer-open') || b.classList.contains('mfm-menu-open')) return true;
    var m = document.querySelector('.event-modal-backdrop:not([hidden]), [aria-modal="true"]:not([hidden])');
    if (m && getComputedStyle(m).display !== 'none' && visible(m)) return true;
    return false;
  }

  window.MFMOverlay = {
    open: open, close: close, busy: busy,
    isOpen: function () { return stack.length > 0; },
    current: function () { return stack.length ? stack[stack.length - 1].root : null; }
  };
})();
