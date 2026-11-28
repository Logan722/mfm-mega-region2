/* Play & Grow launch lock (Dawn, Nov 28 2026).
   /play and every Bible Stories page stay behind a glowing lock + countdown until LAUNCH,
   then open by themselves (no deploy needed). Loaded without defer, before the game scripts,
   so shared links (?play=, ?room=, challenges, #scene-N) cannot open a game behind the lock.
   After launch this file does nothing and can be removed in a later batch. */
(function () {
  var LAUNCH = Date.parse('2026-11-30T15:00:00Z'); // Monday Nov 30 2026, 9:00 AM US Central
  window.PG_LAUNCH = LAUNCH;
  var off = 0, now = function () { return Date.now() + off; };
  if (now() >= LAUNCH) return;
  window.PG_LOCKED = true;
  // Drop anything in the address that would open a game, a room or a scene
  try { if (location.search || location.hash) history.replaceState(null, '', location.pathname); } catch (e) {}

  var css = '' +
    'html.pgl-on,html.pgl-on body{overflow:hidden!important}' +
    '.pgl{position:fixed;left:0;right:0;bottom:0;top:var(--pgl-top,0px);z-index:90;display:grid;place-items:center;overflow:auto;padding:28px 20px;' +
      'background:radial-gradient(55% 45% at 50% 38%,rgba(232,93,38,.30),rgba(232,93,38,0) 70%),radial-gradient(70% 55% at 50% 100%,rgba(201,149,44,.22),rgba(201,149,44,0) 70%),rgba(7,13,29,.74);' +
      '-webkit-backdrop-filter:blur(16px) saturate(1.15);backdrop-filter:blur(16px) saturate(1.15);color:#fff;font-family:"Inter Tight",system-ui,sans-serif;text-align:center}' +
    '.pgl-in{position:relative;width:min(100%,680px);display:flex;flex-direction:column;align-items:center;gap:14px}' +
    '.pgl-lock{position:relative;width:132px;height:132px;display:grid;place-items:center;margin-bottom:4px}' +
    '.pgl-lock::before,.pgl-lock::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid rgba(201,149,44,.55);animation:pglRing 2.6s ease-out infinite}' +
    '.pgl-lock::after{animation-delay:1.3s}' +
    '.pgl-lock svg{position:relative;width:96px;height:112px;filter:drop-shadow(0 0 18px rgba(232,93,38,.65)) drop-shadow(0 10px 0 rgba(0,0,0,.35));animation:pglBob 3.2s ease-in-out infinite}' +
    '.pgl-lock .sh{transform-origin:50% 100%;animation:pglShackle 3.2s ease-in-out infinite}' +
    '.pgl-lock .fl{transform-origin:50% 90%;transform-box:fill-box;animation:pglFlame 1.1s ease-in-out infinite}' +
    '.pgl-k{margin:0;font:800 12px/1 "Inter Tight",sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#e9c36b}' +
    '.pgl h2{margin:0;font:900 clamp(32px,6vw,58px)/1.02 Fraunces,Georgia,serif;letter-spacing:-.01em;background:linear-gradient(180deg,#fff 30%,#ffe3a3 100%);-webkit-background-clip:text;background-clip:text;color:transparent;text-wrap:balance}' +
    '.pgl p.pgl-sub{margin:0;max-width:560px;color:#d6deec;font-size:clamp(15px,2.2vw,18px);line-height:1.55;text-wrap:balance}' +
    '.pgl-cd{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(8px,2vw,14px);width:min(100%,560px);margin:10px 0 2px}' +
    '.pgl-cd div{position:relative;padding:clamp(12px,2.4vw,20px) 4px clamp(10px,2vw,16px);border-radius:20px;background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.04));border:1px solid rgba(255,255,255,.18);box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 18px 40px rgba(0,0,0,.35)}' +
    '.pgl-cd b{display:block;font:900 clamp(34px,8vw,64px)/1 "Inter Tight",sans-serif;font-variant-numeric:tabular-nums;color:#ffd36b;text-shadow:0 0 24px rgba(232,93,38,.55)}' +
    '.pgl-cd b.tick{animation:pglTick .35s ease-out}' +
    '.pgl-cd small{display:block;margin-top:8px;font:800 11px/1 "Inter Tight",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#aab6cc}' +
    '.pgl-when{margin:2px 0 0;font:700 15px/1.4 "Inter Tight",sans-serif;color:#fff}' +
    '.pgl-acts{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:8px}' +
    '.pgl-acts a{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:50px;padding:0 22px;border-radius:999px;font:800 15px "Inter Tight",sans-serif;text-decoration:none}' +
    '.pgl-acts .a1{background:#fff;color:#142240;box-shadow:0 5px 0 #b9c3d6}' +
    '.pgl-acts .a2{background:transparent;color:#fff;box-shadow:inset 0 0 0 2px rgba(255,255,255,.7)}' +
    '.pgl-acts a:focus-visible{outline:3px solid #e9c36b;outline-offset:3px}' +
    '.pgl-acts svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}' +
    '.pgl-emb{position:absolute;inset:0;overflow:hidden;pointer-events:none}' +
    '.pgl-emb i{position:absolute;bottom:-10px;width:5px;height:5px;border-radius:50%;background:radial-gradient(circle,#fff 0,#ffd36b 45%,#e85d26 80%,transparent 100%);opacity:0;animation:pglEmber 6s linear infinite}' +
    '.pgl-done h2{animation:pglPop .6s ease-out}' +
    '.pgl-sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
    '@keyframes pglRing{0%{transform:scale(.7);opacity:.9}100%{transform:scale(1.6);opacity:0}}' +
    '@keyframes pglBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}' +
    '@keyframes pglShackle{0%,80%,100%{transform:translateY(0)}86%{transform:translateY(-5px)}92%{transform:translateY(0)}}' +
    '@keyframes pglFlame{0%,100%{transform:scale(1,1)}50%{transform:scale(1.08,1.14)}}' +
    '@keyframes pglTick{0%{transform:translateY(-6px);opacity:.4}100%{transform:none;opacity:1}}' +
    '@keyframes pglEmber{0%{transform:translateY(0) scale(.6);opacity:0}10%{opacity:1}100%{transform:translateY(-105vh) scale(.2);opacity:0}}' +
    '@keyframes pglPop{0%{transform:scale(.8)}60%{transform:scale(1.08)}100%{transform:none}}' +
    '@media (max-width:600px){.pgl{padding:20px 16px}.pgl-lock{width:104px;height:104px}.pgl-lock svg{width:76px;height:90px}.pgl-cd div{border-radius:16px}.pgl-acts a{min-height:46px;padding:0 18px;font-size:14px}}' +
    '@media (prefers-reduced-motion:reduce){.pgl *,.pgl *::before,.pgl *::after,.pgl-lock::before,.pgl-lock::after{animation:none!important}}';

  var LOCK = '<svg viewBox="0 0 96 112" aria-hidden="true"><defs>' +
    '<linearGradient id="pglG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe3a3"/><stop offset=".5" stop-color="#e3b04b"/><stop offset="1" stop-color="#a8761c"/></linearGradient>' +
    '<radialGradient id="pglF" cx="50%" cy="80%" r="70%"><stop offset="0" stop-color="#fff1b8"/><stop offset=".45" stop-color="#ff9a3c"/><stop offset="1" stop-color="#e85d26"/></radialGradient></defs>' +
    '<path class="sh" d="M26 50V34a22 22 0 0 1 44 0v16" fill="none" stroke="url(#pglG)" stroke-width="10" stroke-linecap="round"/>' +
    '<rect x="10" y="46" width="76" height="60" rx="16" fill="url(#pglG)" stroke="#7a5212" stroke-width="2"/>' +
    '<rect x="16" y="52" width="64" height="48" rx="11" fill="#142240"/>' +
    '<path class="fl" d="M48 94c-8-1-12-7-10-14 2-5 7-8 6-15 6 3 12 9 13 16 1 8-3 13-9 13z" fill="url(#pglF)"/></svg>';

  var gcal = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('Play & Grow opens — MFM Mega Region 2 USA') +
    '&dates=20261130T150000Z/20261130T160000Z&details=' + encodeURIComponent('11 games, animated Bible Stories, a live room and the weekly branch leaderboard. https://mfmmegaregion2usa.org/play') +
    '&location=' + encodeURIComponent('https://mfmmegaregion2usa.org/play');
  var wa = 'https://wa.me/?text=' + encodeURIComponent('Something big is coming from MFM Mega Region 2: Play & Grow opens Monday, November 30 at 9:00 AM Central. 11 Bible games, animated Bible Stories and a live room to play with friends anywhere. https://mfmmegaregion2usa.org/play');
  var story = /\/stories\//.test(location.pathname);

  function build() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var hd = document.querySelector('.site-header, .site-nav, [data-mfm-header]');
    if (hd) { var r = hd.getBoundingClientRect(); document.documentElement.style.setProperty('--pgl-top', Math.max(0, Math.round(r.bottom)) + 'px'); }
    var box = document.createElement('section'); box.className = 'pgl'; box.setAttribute('aria-labelledby', 'pgl-h');
    var emb = ''; for (var i = 0; i < 18; i++) emb += '<i style="left:' + ((i * 53) % 100) + '%;animation-delay:' + (i * 0.37).toFixed(2) + 's;animation-duration:' + (5 + (i % 5)).toFixed(1) + 's"></i>';
    box.innerHTML = '<div class="pgl-emb" aria-hidden="true">' + emb + '</div><div class="pgl-in">' +
      '<div class="pgl-lock">' + LOCK + '</div>' +
      '<p class="pgl-k">Play &amp; Grow &middot; ' + (story ? 'Bible Stories' : 'coming Monday') + '</p>' +
      '<h2 id="pgl-h">Something big is coming</h2>' +
      '<p class="pgl-sub">Eleven Bible games, animated Bible Stories, a live room to play with friends anywhere, and a weekly branch leaderboard. Everything unlocks on Monday.</p>' +
      '<div class="pgl-cd" aria-hidden="true"><div><b data-u="d">00</b><small>Days</small></div><div><b data-u="h">00</b><small>Hours</small></div><div><b data-u="m">00</b><small>Minutes</small></div><div><b data-u="s">00</b><small>Seconds</small></div></div>' +
      '<p class="pgl-when">Opens Monday, November 30 at 9:00 AM Central</p>' +
      '<p class="pgl-sr" aria-live="polite" data-sr></p>' +
      '<div class="pgl-acts"><a class="a1" target="_blank" rel="noopener" href="' + gcal + '"><svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>Add to my calendar</a>' +
      '<a class="a2" target="_blank" rel="noopener" href="' + wa + '"><svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"/></svg>Tell a friend</a>' +
      (story ? '<a class="a2" href="/">Back to the home page</a>' : '') + '</div></div>';
    document.body.appendChild(box);
    document.documentElement.classList.add('pgl-on');
    // Nothing behind the lock can be clicked or reached with the keyboard
    var behind = document.querySelectorAll('main, body > section.band, #play-app, .pg-stage');
    Array.prototype.forEach.call(behind, function (el) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); });
    var U = {}; Array.prototype.forEach.call(box.querySelectorAll('[data-u]'), function (b) { U[b.getAttribute('data-u')] = b; });
    var sr = box.querySelector('[data-sr]'), lastMin = -1;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function set(k, v) { var t = pad(v); if (U[k].textContent !== t) { U[k].textContent = t; U[k].classList.remove('tick'); void U[k].offsetWidth; U[k].classList.add('tick'); } }
    function tick() {
      var ms = LAUNCH - now();
      if (ms <= 0) { open(); return; }
      var s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
      set('d', d); set('h', h); set('m', m); set('s', s % 60);
      if (m !== lastMin) { lastMin = m; sr.textContent = 'Opens in ' + d + ' days, ' + h + ' hours and ' + m + ' minutes.'; }
      setTimeout(tick, 1000 - (now() % 1000) + 5);
    }
    function open() {
      box.classList.add('pgl-done'); box.querySelector('h2').textContent = 'It’s open!';
      ['d', 'h', 'm', 's'].forEach(function (k) { U[k].textContent = '00'; });
      setTimeout(function () { location.reload(); }, 1600);
    }
    tick();
    // Use the server's clock if the device clock is off
    try {
      fetch('/', { method: 'HEAD', cache: 'no-store' }).then(function (r) { var d = Date.parse(r.headers.get('date')); if (d) { off = d - Date.now(); } }).catch(function () {});
    } catch (e) {}
  }
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
