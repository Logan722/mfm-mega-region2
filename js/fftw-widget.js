/* Fire for the Week — Floating widget + popup + sparkles
 * Self-contained: injects CSS, HTML, and event handlers. Loads on every page.
 * MFM Mega Region 2 USA */
(function() {
  if (window.__fftwWidgetInit) return;
  window.__fftwWidgetInit = true;

  var CSS = [
    '.fftw-float{position:fixed;right:24px;bottom:24px;z-index:9999;width:58px;height:58px;border-radius:50%;background:radial-gradient(circle at 50% 55%,#142240 55%,#0b1627 100%);border:2px solid #c9952c;display:flex;align-items:center;justify-content:center;cursor:pointer;text-decoration:none;box-shadow:0 0 0 1px rgba(201,149,44,.2),0 8px 24px rgba(0,0,0,.4),0 0 32px rgba(232,93,38,.5),0 0 60px rgba(201,149,44,.25);transition:transform .2s ease,box-shadow .2s ease;animation:fftwGlow 2.4s ease-in-out infinite}',
    '.fftw-float:hover{transform:translateY(-3px) scale(1.06);box-shadow:0 0 0 2px #c9952c,0 12px 32px rgba(0,0,0,.5),0 0 46px rgba(232,93,38,.75),0 0 80px rgba(201,149,44,.4)}',
    '.fftw-float svg{width:34px;height:42px;display:block;overflow:visible}',
    '.fftw-float::after{content:"Fire for the Week";position:absolute;right:68px;top:50%;transform:translateY(-50%);background:#142240;color:#f0e6d0;font-family:"Fraunces",Georgia,serif;font-size:12px;font-weight:500;padding:7px 12px;border-radius:4px;white-space:nowrap;border:1px solid #c9952c;opacity:0;pointer-events:none;transition:opacity .18s ease;letter-spacing:.04em}',
    '.fftw-float:hover::after{opacity:1}',
    '.fftw-float .flame-outer{transform-origin:50% 90%;transform-box:fill-box;animation:fftwFlameOuter 1.1s ease-in-out infinite}',
    '@keyframes fftwFlameOuter{0%,100%{transform:scale(1,1) skewX(0)}30%{transform:scale(1.04,1.08) skewX(-3deg)}60%{transform:scale(.96,.94) skewX(2deg)}}',
    '@keyframes fftwGlow{0%,100%{box-shadow:0 0 0 1px rgba(201,149,44,.2),0 8px 24px rgba(0,0,0,.4),0 0 32px rgba(232,93,38,.5),0 0 60px rgba(201,149,44,.25)}50%{box-shadow:0 0 0 1px rgba(201,149,44,.35),0 8px 24px rgba(0,0,0,.4),0 0 44px rgba(232,93,38,.8),0 0 82px rgba(201,149,44,.4)}}',
    /* Sparkles */
    '.fftw-sparkles{position:fixed;right:24px;bottom:24px;z-index:9998;width:58px;height:58px;pointer-events:none}',
    '.fftw-sparkles span{position:absolute;width:4px;height:4px;border-radius:50%;background:radial-gradient(circle,#fff 0%,#ffe066 45%,#ff9a3c 80%,transparent 100%);box-shadow:0 0 6px #ffc247,0 0 12px rgba(255,180,60,.5);opacity:0;animation:fftwSparkle 2.6s ease-out infinite}',
    '.fftw-sparkles span:nth-child(1){left:20%;top:60%;width:3px;height:3px;animation-delay:0s;animation-duration:2.2s}',
    '.fftw-sparkles span:nth-child(2){left:70%;top:70%;width:5px;height:5px;animation-delay:.3s;animation-duration:2.8s}',
    '.fftw-sparkles span:nth-child(3){left:90%;top:55%;width:4px;height:4px;animation-delay:.6s;animation-duration:2.4s}',
    '.fftw-sparkles span:nth-child(4){left:10%;top:40%;width:3px;height:3px;animation-delay:.9s;animation-duration:3.0s}',
    '.fftw-sparkles span:nth-child(5){left:85%;top:30%;width:4px;height:4px;animation-delay:1.2s;animation-duration:2.3s}',
    '.fftw-sparkles span:nth-child(6){left:50%;top:95%;width:5px;height:5px;animation-delay:1.5s;animation-duration:2.7s}',
    '.fftw-sparkles span:nth-child(7){left:5%;top:65%;width:3px;height:3px;animation-delay:1.8s;animation-duration:2.5s}',
    '.fftw-sparkles span:nth-child(8){left:95%;top:80%;width:4px;height:4px;animation-delay:2.1s;animation-duration:2.6s}',
    '@keyframes fftwSparkle{0%{opacity:0;transform:translateY(0) scale(.6)}10%{opacity:1;transform:translateY(-4px) scale(1)}70%{opacity:.9;transform:translateY(-28px) scale(.9)}100%{opacity:0;transform:translateY(-48px) scale(.3)}}',
    '@media (max-width:560px){.fftw-float,.fftw-sparkles{right:16px;bottom:16px;width:50px;height:50px}.fftw-float svg{width:30px;height:38px}}',
    /* Popup overlay */
    '.fftw-overlay{position:fixed;inset:0;z-index:10000;background:rgba(5,10,24,.75);display:none;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(6px);animation:fftwFadeIn .2s ease}',
    '.fftw-overlay.open{display:flex}',
    '@keyframes fftwFadeIn{from{opacity:0}to{opacity:1}}',
    '.fftw-modal{background:#fff;border-radius:10px;width:100%;max-width:440px;overflow:hidden;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 0 1px #c9952c;animation:fftwSlideUp .3s cubic-bezier(.2,.9,.3,1.3)}',
    '@keyframes fftwSlideUp{from{transform:translateY(20px) scale(.96);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}',
    '.fftw-modal-head{background:#142240;padding:32px 28px 28px;text-align:center;position:relative;border-bottom:2px solid #c9952c}',
    '.fftw-modal-head .flame-wrap{width:60px;height:60px;margin:0 auto 10px;border-radius:50%;background:radial-gradient(circle at 50% 55%,#1a2a4a 55%,#0b1627 100%);border:1.5px solid #c9952c;display:flex;align-items:center;justify-content:center;box-shadow:0 0 24px rgba(232,93,38,.6),0 0 48px rgba(201,149,44,.3)}',
    '.fftw-modal-head .flame-wrap svg{width:30px;height:36px;overflow:visible}',
    '.fftw-modal-head .eye{color:#c9952c;font-family:"Fraunces",Georgia,serif;font-weight:700;font-size:10px;letter-spacing:.32em;text-transform:uppercase;margin-bottom:8px}',
    '.fftw-modal-head h3{color:#f0e6d0;font-family:"Fraunces",Georgia,serif;font-weight:500;font-size:26px;line-height:1.15;margin:8px 0 0}',
    '.fftw-modal-body{padding:24px 28px}',
    '.fftw-modal-body .scripture{background:#f8f6f1;border-left:3px solid #c9952c;padding:14px 16px;margin-bottom:20px;border-radius:0 4px 4px 0}',
    '.fftw-modal-body .scripture p{font-family:"Fraunces",Georgia,serif;font-style:italic;color:#142240;font-size:14.5px;line-height:1.55;margin:0 0 6px}',
    '.fftw-modal-body .scripture .ref{color:#c9952c;font-family:"Fraunces",Georgia,serif;font-weight:700;font-size:10px;letter-spacing:.2em}',
    '.fftw-modal-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}',
    '.fftw-modal-actions .btn{text-align:center;padding:14px 10px;font-size:12px;border-radius:3px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;cursor:pointer;border:0;font-family:inherit}',
    '.fftw-modal-actions .btn-primary{background:#e85d26;color:#fff}',
    '.fftw-modal-actions .btn-navy{background:#142240;color:#fff}',
    '.fftw-modal-form{display:none;grid-template-columns:1fr auto;gap:8px;padding:14px;background:#f8f6f1;border:1px solid #e0d9c4;border-radius:6px;margin-bottom:14px;align-items:center}',
    '.fftw-modal-form.show{display:grid}',
    '.fftw-modal-form input{padding:10px 12px;border:1px solid #c9a876;border-radius:3px;font-size:14px;font-family:inherit;background:#fff;color:#3a3f4a}',
    '.fftw-modal-form button{padding:10px 16px;background:#e85d26;color:#fff;border:0;border-radius:3px;font-weight:700;font-size:12px;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;font-family:inherit}',
    '.fftw-modal-form .foot{grid-column:1 / -1;font-size:11px;color:#8a8f98;text-align:center;margin-top:4px;font-style:italic}',
    '.fftw-modal-footer{text-align:center;padding-top:16px;border-top:1px solid #e8e4da;margin-top:12px}',
    '.fftw-modal-footer a{color:#c9952c;font-size:13px;font-weight:600;text-decoration:none}',
    '.fftw-modal-footer a:hover{text-decoration:underline}',
    '.fftw-modal-close{position:absolute;top:14px;right:14px;z-index:10;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.15);color:#f0e6d0;border:1px solid rgba(201,149,44,.4);display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;line-height:1;transition:background .15s}',
    '.fftw-modal-close:hover{background:rgba(255,255,255,.25)}',
  ].join('');

  var FLAME_SVG = '<svg viewBox="0 0 48 60" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="__fo" cx="50%" cy="80%" r="70%"><stop offset="0%" stop-color="#ff5a1f" stop-opacity=".95"/><stop offset="60%" stop-color="#e85d26" stop-opacity=".85"/><stop offset="100%" stop-color="#8c2d14" stop-opacity=".2"/></radialGradient></defs><path class="flame-outer" fill="url(#__fo)" d="M24 56 C 10 52, 4 40, 10 28 C 14 19, 24 14, 20 2 C 30 8, 38 18, 40 30 C 42 44, 36 52, 24 56 Z"/></svg>';

  var FLAME_SVG2 = FLAME_SVG.replace(/__fo/g, '__fo2');

  // Fetch this week's theme from a config file; fall back to defaults
  var THEME = { title: 'Fire for the Harvest', scripture: '"Then shall the earth yield her increase; and God, even our own God, shall bless us."', ref: 'PSALM 67:6' };
  try {
    fetch('/data/fftw-current.json', {cache: 'no-store'})
      .then(function(r){ if(r.ok) return r.json(); })
      .then(function(d){ if(d && d.title){ THEME = d; var mt = document.getElementById('fftwModalTitle'); if(mt) mt.textContent = d.title; var sp = document.getElementById('fftwModalScripture'); if(sp) sp.textContent = d.scripture; var rf = document.getElementById('fftwModalRef'); if(rf) rf.textContent = d.ref; } })
      .catch(function(){ });
  } catch(e) {}

  function inject() {
    var style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);

    var sparks = document.createElement('div'); sparks.className = 'fftw-sparkles';
    sparks.setAttribute('aria-hidden', 'true');
    for (var i=0;i<8;i++) sparks.appendChild(document.createElement('span'));
    document.body.appendChild(sparks);

    var btn = document.createElement('a');
    btn.href = '#'; btn.className = 'fftw-float'; btn.title = 'Fire for the Week'; btn.setAttribute('aria-label','Open Fire for the Week');
    btn.innerHTML = FLAME_SVG;
    btn.addEventListener('click', function(e){ e.preventDefault(); openModal(); });
    document.body.appendChild(btn);

    var overlay = document.createElement('div'); overlay.className='fftw-overlay'; overlay.id='fftwOverlay';
    overlay.innerHTML = [
      '<div class="fftw-modal" role="dialog">',
      '<button class="fftw-modal-close" aria-label="Close">×</button>',
      '<div class="fftw-modal-head"><div class="flame-wrap">' + FLAME_SVG2 + '</div>',
      '<div class="eye">FIRE FOR THE WEEK</div>',
      '<h3 id="fftwModalTitle">' + THEME.title + '</h3></div>',
      '<div class="fftw-modal-body">',
      '<div class="scripture"><p id="fftwModalScripture">' + THEME.scripture + '</p><div class="ref" id="fftwModalRef">' + THEME.ref + '</div></div>',
      '<div class="fftw-modal-actions">',
      '<a class="btn btn-primary" href="/files/fire-for-the-week.pdf" download>📄 Download PDF</a>',
      '<a class="btn btn-navy" href="#" id="fftwToggleSignup">📧 Get it weekly</a>',
      '</div>',
      '<form id="fftwModalForm" class="fftw-modal-form" action="/.netlify/functions/fftw-subscribe" method="POST">',
      '<input type="email" name="email" placeholder="Your email address" required>',
      '<button type="submit">Subscribe</button>',
      '<div class="foot">A new set of prayer points every Monday. Unsubscribe any time.</div>',
      '</form>',
      '<div class="fftw-modal-footer"><a href="/fire-for-the-week">Read all 33 prayer points →</a></div>',
      '</div>',
      '</div>'
    ].join('');
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e){ if(e.target === overlay) closeModal(); });
    overlay.querySelector('.fftw-modal-close').addEventListener('click', closeModal);
    overlay.querySelector('#fftwToggleSignup').addEventListener('click', function(e){ e.preventDefault(); overlay.querySelector('#fftwModalForm').classList.toggle('show'); });
    overlay.querySelector('#fftwModalForm').addEventListener('submit', function(e){
      e.preventDefault();
      var form = e.target;
      var data = { email: form.email.value, source: 'fftw-popup' };
      fetch('/.netlify/functions/fftw-subscribe', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) })
        .then(function(r){ if(r.ok){ form.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#c9952c;font-family:Fraunces,Georgia,serif;font-size:14px;">✓ You\'re in. Check your inbox.</div>'; } else { form.querySelector('.foot').style.color='#e85d26'; form.querySelector('.foot').textContent='Something went wrong — try again.'; } });
    });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });
  }

  function openModal() { var o = document.getElementById('fftwOverlay'); if(o){ o.classList.add('open'); document.body.style.overflow='hidden'; } }
  function closeModal() { var o = document.getElementById('fftwOverlay'); if(o){ o.classList.remove('open'); var f = o.querySelector('#fftwModalForm'); if(f) f.classList.remove('show'); document.body.style.overflow=''; } }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', inject); } else { inject(); }
})();
