// js/newsletter-popup.js
//
// MFM Mega Region 2 — Newsletter subscribe popup.
// Self-contained. Add to any page with one line:
//   <script src="/js/newsletter-popup.js" defer></script>
//
// Behavior:
//   * Center modal, Royal Flame styling (navy card, gold accent, fire glow)
//   * Fires 2.5 seconds after DOMContentLoaded
//   * Never shows again once the visitor subscribes (localStorage)
//   * Suppressed for 14 days after dismiss (X / Esc / backdrop click)
//   * POSTs to /.netlify/functions/subscribe (idempotent — duplicates safe)
//   * Success / error inline states, no page reload
//
// Everything (CSS + HTML + JS) is injected at runtime — no HTML markup to
// copy into pages.

(function () {
  'use strict';

  var CONFIG = {
    endpoint: '/.netlify/functions/subscribe',
    delayMs: 2500,
    dismissSuppressDays: 14,
    subscribedFlag: 'mfm-newsletter-subscribed',
    dismissedFlag: 'mfm-newsletter-dismissed-until',
  };

  // ---------- Guardrails ----------
  function shouldShow() {
    try {
      if (localStorage.getItem(CONFIG.subscribedFlag) === '1') return false;
      var until = parseInt(localStorage.getItem(CONFIG.dismissedFlag) || '0', 10);
      if (until && Date.now() < until) return false;
    } catch (e) { /* localStorage disabled — still show */ }
    // Skip on very small viewports where a modal is more annoying than useful.
    // (Comment out this line to always show on mobile.)
    // if (window.innerWidth < 380) return false;
    return true;
  }

  function markSubscribed() {
    try { localStorage.setItem(CONFIG.subscribedFlag, '1'); } catch (e) {}
  }

  function markDismissed() {
    try {
      var until = Date.now() + CONFIG.dismissSuppressDays * 24 * 60 * 60 * 1000;
      localStorage.setItem(CONFIG.dismissedFlag, String(until));
    } catch (e) {}
  }

  // ---------- Styles ----------
  var css = [
    '.mfm-pop-backdrop{position:fixed;inset:0;background:rgba(9,15,30,0.72);',
    'z-index:99998;opacity:0;transition:opacity .25s ease;',
    'display:flex;align-items:center;justify-content:center;padding:20px;',
    '-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);}',
    '.mfm-pop-backdrop.is-open{opacity:1;}',
    '.mfm-pop-card{position:relative;max-width:440px;width:100%;',
    'background:#142240;border:1px solid rgba(201,149,44,0.35);border-radius:12px;',
    'padding:36px 32px 28px;box-shadow:0 20px 60px rgba(0,0,0,0.55);',
    'transform:scale(0.94);transition:transform .3s cubic-bezier(.2,.9,.3,1);',
    'font-family:"Inter Tight",-apple-system,BlinkMacSystemFont,sans-serif;',
    'color:#f0e6d0;overflow:hidden;}',
    '.mfm-pop-backdrop.is-open .mfm-pop-card{transform:scale(1);}',
    '.mfm-pop-card::before{content:"";position:absolute;inset:0;',
    'background:radial-gradient(ellipse at 25% 0%,rgba(201,149,44,0.20) 0%,transparent 60%),',
    'radial-gradient(ellipse at 75% 100%,rgba(232,93,38,0.16) 0%,transparent 55%);',
    'pointer-events:none;}',
    '.mfm-pop-card>*{position:relative;z-index:1;}',
    '.mfm-pop-close{position:absolute;top:10px;right:12px;width:32px;height:32px;',
    'display:flex;align-items:center;justify-content:center;background:transparent;',
    'border:0;color:#6a7a96;cursor:pointer;border-radius:50%;',
    'transition:background .15s,color .15s;font-size:20px;line-height:1;z-index:2;}',
    '.mfm-pop-close:hover{background:rgba(255,255,255,0.06);color:#c9952c;}',
    '.mfm-pop-emblem{width:56px;height:56px;border-radius:50%;background:#c9952c;',
    'margin:0 auto 12px;display:flex;align-items:center;justify-content:center;',
    'color:#142240;font-family:Georgia,serif;font-weight:700;font-size:24px;}',
    '.mfm-pop-eyebrow{text-align:center;font-size:.72rem;font-weight:500;',
    'letter-spacing:.28em;text-transform:uppercase;color:#c9952c;margin:0 0 10px;}',
    '.mfm-pop-title{text-align:center;font-family:"Fraunces",Georgia,serif;',
    'font-weight:400;font-size:1.6rem;line-height:1.2;color:#f0e6d0;margin:0 0 8px;}',
    '.mfm-pop-lede{text-align:center;font-size:.94rem;line-height:1.55;',
    'color:#8899b8;margin:0 0 20px;}',
    '.mfm-pop-form{display:flex;flex-direction:column;gap:10px;}',
    '.mfm-pop-input{width:100%;padding:12px 14px;background:rgba(255,255,255,0.06);',
    'color:#fff;font-size:1rem;font-family:inherit;',
    'border:1px solid rgba(201,149,44,0.30);border-radius:6px;outline:none;',
    'transition:border-color .15s,background .15s;box-sizing:border-box;}',
    '.mfm-pop-input:focus{border-color:#c9952c;background:rgba(255,255,255,0.10);}',
    '.mfm-pop-input::placeholder{color:#6a7a96;}',
    '.mfm-pop-btn{margin-top:4px;padding:13px 22px;background:#c9952c;color:#142240;',
    'border:0;border-radius:6px;font-family:inherit;font-weight:600;font-size:.95rem;',
    'letter-spacing:.06em;text-transform:uppercase;cursor:pointer;',
    'transition:background .15s,transform .1s;}',
    '.mfm-pop-btn:hover{background:#d4a853;}',
    '.mfm-pop-btn:active{transform:translateY(1px);}',
    '.mfm-pop-btn[disabled]{opacity:.55;cursor:wait;}',
    '.mfm-pop-fine{text-align:center;font-size:.75rem;color:#6a7a96;',
    'margin:14px 0 0;line-height:1.5;}',
    '.mfm-pop-fine a{color:#c9952c;text-decoration:underline;text-underline-offset:2px;}',
    '.mfm-pop-status{margin-top:12px;padding:10px 12px;border-radius:6px;',
    'font-size:.88rem;text-align:center;}',
    '.mfm-pop-status.is-ok{background:rgba(76,175,80,0.14);color:#b6e6ba;',
    'border:1px solid rgba(76,175,80,0.30);}',
    '.mfm-pop-status.is-err{background:rgba(232,93,38,0.14);color:#ffb99a;',
    'border:1px solid rgba(232,93,38,0.30);}',
    '.mfm-pop-success{text-align:center;padding:8px 0;}',
    '.mfm-pop-success .mfm-pop-title{margin-top:8px;}',
    '.mfm-pop-hp{position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;}',
    '@media (max-width:480px){.mfm-pop-card{padding:28px 22px 22px;}',
    '.mfm-pop-title{font-size:1.4rem;}}',
  ].join('');

  // ---------- HTML ----------
  var html = [
    '<div class="mfm-pop-card" role="dialog" aria-modal="true" aria-labelledby="mfm-pop-title">',
    '<button type="button" class="mfm-pop-close" aria-label="Close">&times;</button>',
    '<div class="mfm-pop-form-wrap">',
    '<div class="mfm-pop-emblem" aria-hidden="true">M</div>',
    '<div class="mfm-pop-eyebrow">Stay Connected</div>',
    '<h2 id="mfm-pop-title" class="mfm-pop-title">The Fire, once a month.</h2>',
    '<p class="mfm-pop-lede">Prayer points, sermons, and the next crusade near you.</p>',
    '<form class="mfm-pop-form" novalidate>',
    '<input class="mfm-pop-input" name="FIRSTNAME" type="text" placeholder="First name" autocomplete="given-name" required />',
    '<input class="mfm-pop-input" name="EMAIL" type="email" placeholder="Email address" autocomplete="email" required />',
    '<input class="mfm-pop-hp" type="text" name="hp_website" tabindex="-1" autocomplete="off" />',
    '<button type="submit" class="mfm-pop-btn">Subscribe</button>',
    '<div class="mfm-pop-status" role="status" aria-live="polite" hidden></div>',
    '<p class="mfm-pop-fine">No spam. Unsubscribe anytime. See our <a href="/privacy.html">Privacy Policy</a>.</p>',
    '</form>',
    '</div>',
    '<div class="mfm-pop-success" hidden>',
    '<div class="mfm-pop-emblem" aria-hidden="true">&#128293;</div>',
    '<div class="mfm-pop-eyebrow">You\'re in</div>',
    '<h2 class="mfm-pop-title">The fire is lit.</h2>',
    '<p class="mfm-pop-lede">Check your inbox &mdash; the first note is on its way. This popup won\'t bother you again.</p>',
    '</div>',
    '</div>',
  ].join('');

  // ---------- Runtime ----------
  function init() {
    if (!shouldShow()) return;

    // Inject CSS
    var style = document.createElement('style');
    style.id = 'mfm-pop-styles';
    style.textContent = css;
    document.head.appendChild(style);

    // Inject HTML
    var backdrop = document.createElement('div');
    backdrop.className = 'mfm-pop-backdrop';
    backdrop.innerHTML = html;
    document.body.appendChild(backdrop);

    var card = backdrop.querySelector('.mfm-pop-card');
    var closeBtn = backdrop.querySelector('.mfm-pop-close');
    var form = backdrop.querySelector('.mfm-pop-form');
    var formWrap = backdrop.querySelector('.mfm-pop-form-wrap');
    var successView = backdrop.querySelector('.mfm-pop-success');
    var status = backdrop.querySelector('.mfm-pop-status');
    var submitBtn = backdrop.querySelector('.mfm-pop-btn');

    function close(dismiss) {
      backdrop.classList.remove('is-open');
      setTimeout(function () {
        if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
      }, 260);
      if (dismiss) markDismissed();
      document.removeEventListener('keydown', onKey);
    }

    function onKey(e) {
      if (e.key === 'Escape') close(true);
    }

    closeBtn.addEventListener('click', function () { close(true); });
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) close(true);
    });
    card.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('keydown', onKey);

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = form.querySelector('input[name="EMAIL"]').value.trim();
      var firstName = form.querySelector('input[name="FIRSTNAME"]').value.trim();
      var hp = form.querySelector('input[name="hp_website"]').value;

      if (hp) return; // silently drop bots

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        showStatus('is-err', 'Please enter a valid email address.');
        return;
      }

      submitBtn.disabled = true;
      var originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      status.hidden = true;

      fetch(CONFIG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          EMAIL: email,
          FIRSTNAME: firstName,
          source: 'popup:' + (location.pathname || '/'),
        }),
      })
        .then(function (r) { return r.json().then(function (d) { return { status: r.status, body: d }; }); })
        .then(function (res) {
          if (res.body && res.body.ok) {
            markSubscribed();
            formWrap.hidden = true;
            successView.hidden = false;
            setTimeout(function () { close(false); }, 4500);
          } else {
            showStatus('is-err',
              (res.body && res.body.error === 'invalid_email')
                ? 'Please enter a valid email address.'
                : 'Something went wrong. Please try again in a moment.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
        })
        .catch(function () {
          showStatus('is-err', 'Network error. Please try again.');
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        });
    });

    function showStatus(cls, msg) {
      status.className = 'mfm-pop-status ' + cls;
      status.textContent = msg;
      status.hidden = false;
    }

    // Open with a small delay so the hero renders first.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { backdrop.classList.add('is-open'); });
    });
  }

  function schedule() {
    setTimeout(init, CONFIG.delayMs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
})();
