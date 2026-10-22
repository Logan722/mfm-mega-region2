/* Newsletter pages header (owner request, Oct 21 2026): every newsletter page gets a way back.
   Fills <header class="site-header" data-nav> on /newsletter and on each /newsletter/issue-N page:
     - logo + "Mega Region 2 USA"  -> the website homepage (/)
     - on an issue page: "All issues" -> /newsletter, and "Home" -> /
     - on /newsletter itself: "Back to the website" -> /
   The issue pages are archived emails, so the header is a small, self-contained bar (no site CSS needed). */
(function(){try{
  var h=document.querySelector('header[data-nav]');if(!h||h.getAttribute('data-nav-done'))return;
  h.setAttribute('data-nav-done','1');
  var path=location.pathname.replace(/\/+$/,'').replace(/\.html$/,'');
  var onHub=/\/newsletter(\/index)?$/.test(path);
  var arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></svg>';
  var css=document.createElement('style');
  css.textContent='.nl-bar{position:sticky;top:0;z-index:60;background:#142240;border-bottom:1px solid rgba(201,149,44,.35);font-family:"Inter Tight",Inter,-apple-system,Helvetica,Arial,sans-serif}'+
    '.nl-bar-in{max-width:1180px;margin:0 auto;height:64px;padding:0 20px;display:flex;align-items:center;justify-content:space-between;gap:16px}'+
    '.nl-brand{display:flex;align-items:center;gap:10px;color:#f0e6d0;text-decoration:none;min-width:0}'+
    '.nl-brand img{width:38px;height:38px;flex:none}.nl-brand b{font-family:Georgia,Fraunces,serif;font-weight:400;font-size:17px;white-space:nowrap}'+
    '.nl-brand small{display:block;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#c9952c;margin-top:1px}'+
    '.nl-links{display:flex;align-items:center;gap:8px;flex:none}'+
    '.nl-links a{display:inline-flex;align-items:center;gap:7px;min-height:40px;padding:0 14px;color:#f0e6d0;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:.04em;border:1px solid transparent;border-radius:2px}'+
    '.nl-links a.pri{border-color:rgba(201,149,44,.6);color:#e0ad45}.nl-links a:hover{background:rgba(255,255,255,.06)}'+
    '.nl-links a:focus-visible,.nl-brand:focus-visible{outline:3px solid #f0c760;outline-offset:2px}'+
    '.nl-links svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}'+
    '@media(max-width:560px){.nl-brand b{font-size:15px}.nl-brand small{display:none}.nl-links a{padding:0 10px;font-size:12px}.nl-links a.home{display:none}}';
  document.head.appendChild(css);
  h.className+=' nl-bar';
  h.innerHTML='<div class="nl-bar-in"><a class="nl-brand" href="/" aria-label="MFM Mega Region 2 USA home"><img src="/img/logo.png" alt="" width="38" height="38"><span><b>Mega Region 2 USA</b><small>The Newsletter</small></span></a>'+
    '<nav class="nl-links" aria-label="Newsletter">'+
    (onHub?'<a class="pri" href="/">'+arrow+'Back to the website</a>'
          :'<a class="pri" href="/newsletter">'+arrow+'All issues</a><a class="home" href="/">Home</a>')+
    '</nav></div>';
}catch(e){}})();

/* Newsletter pages footer (owner request, Oct 22 2026): the website's own footer (Explore / Ministries / Connect,
   copyright line), with the ministry logo + name replaced by the newsletter sign-up: First name, Email, Subscribe.
   The separate "Never miss an issue" block above it is hidden, since the footer now carries the sign-up.
   On /subscribe (the page is itself the sign-up form) the footer keeps the logo + name instead. */
(function(){try{
  var f=document.querySelector('footer[data-footer]');if(!f||f.getAttribute('data-footer-done'))return;
  f.setAttribute('data-footer-done','1');
  var onSub=/\/subscribe(\.html)?\/?$/.test(location.pathname);
  var css=document.createElement('style');
  css.textContent='footer.nl-foot{background:#0b1328;color:#fff;font-family:"Inter Tight",Inter,-apple-system,Helvetica,Arial,sans-serif;padding:0 0 max(18px,env(safe-area-inset-bottom));margin:0;border-top:0;text-align:left}'+
    '.nl-foot *{box-sizing:border-box}'+
    '.nl-foot .fg{display:grid;grid-template-columns:1.7fr repeat(3,.7fr);gap:55px;max-width:1288px;margin:0 auto;padding:72px 24px}'+
    '.nl-foot .fg>div.col{display:flex;flex-direction:column;gap:9px;font-size:12px;color:#9ba9bd}'+
    '.nl-foot .fg>div.col b{color:#f0c760;text-transform:uppercase;letter-spacing:.14em;font-size:9px;margin-bottom:8px}'+
    '.nl-foot a{color:inherit;text-decoration:none;transition:color .15s}.nl-foot .fg a:hover{color:#fff}'+
    '.nl-foot .id{display:grid;grid-template-columns:64px 1fr;gap:14px;align-content:start}.nl-foot .id img{width:64px;height:64px;object-fit:contain}'+
    '.nl-foot .id strong{font-family:Fraunces,Georgia,serif;font-size:20px;color:#fff;font-weight:500;display:block}'+
    '.nl-foot .id p{font-size:9px;color:#8493aa;text-transform:uppercase;letter-spacing:.12em;margin:4px 0 0}'+
    '.nl-foot .su h3{font-family:Fraunces,Georgia,serif;font-weight:400;font-size:24px;line-height:1.2;color:#fff;margin:0 0 6px}'+
    '.nl-foot .su>p{font-size:13px;line-height:1.55;color:#9ba9bd;margin:0 0 18px;max-width:440px}'+
    '.nl-foot .su form{display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:480px}'+
    '.nl-foot .su label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}'+
    '.nl-foot .su input{width:100%;min-height:46px;padding:0 14px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#fff;font:inherit;font-size:14px;border-radius:2px}'+
    '.nl-foot .su input::placeholder{color:#8493aa}.nl-foot .su input:focus{outline:2px solid #c9952c;outline-offset:1px;border-color:#c9952c}'+
    '.nl-foot .su button{grid-column:1/-1;min-height:46px;border:0;background:#c9952c;color:#0b1322;font:inherit;font-weight:800;font-size:12px;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;border-radius:2px}'+
    '.nl-foot .su button:hover{background:#e0ad45}.nl-foot .su button:disabled{opacity:.7;cursor:default}.nl-foot .su button:focus-visible{outline:3px solid #f0c760;outline-offset:2px}'+
    '.nl-foot .su .msg{grid-column:1/-1;font-size:12.5px;line-height:1.45;margin:2px 0 0;min-height:1em}.nl-foot .su .msg.ok{color:#9be2b0}.nl-foot .su .msg.err{color:#ffb4a6}'+
    '.nl-foot .su small{display:block;font-size:11px;color:#718099;margin-top:10px}'+
    '.nl-foot .fb{border-top:1px solid #ffffff17;padding:18px 24px;display:flex;justify-content:space-between;gap:12px;color:#718099;font-size:10px;max-width:1288px;margin:0 auto}'+
    '@media(max-width:900px){.nl-foot .fg{grid-template-columns:1fr 1fr;gap:30px;padding:52px 22px}.nl-foot .fg>.first{grid-column:1/-1}}'+
    '@media(max-width:560px){.nl-foot .fg{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:30px 20px}.nl-foot .fg>div.col:last-child{grid-column:1/-1}.nl-foot .fg>div.col a{min-height:32px;display:flex;align-items:center}'+
      '.nl-foot .su form{grid-template-columns:1fr}.nl-foot .fb{flex-direction:column;text-align:center}}'+
    '@media(max-width:560px){body:has(.mag-share-float) footer.nl-foot{padding-bottom:96px}}'+
    (onSub?'':'.mag-sub,.hub-sub{display:none!important}');
  document.head.appendChild(css);
  var first=onSub
    ?'<div class="first id"><img src="/img/logo.png" alt="" width="64" height="64"><div><strong>MFM Mega Region 2 USA</strong><p>Prayer &middot; Deliverance &middot; The Word</p></div></div>'
    :'<div class="first su"><h3>Never miss an issue.</h3><p>Join the newsletter &mdash; sermons, prayer points and what&rsquo;s next from our region, about twice a month.</p>'+
      '<form novalidate><label for="nlf-name">First name</label><input id="nlf-name" type="text" name="firstName" autocomplete="given-name" placeholder="First name">'+
      '<label for="nlf-email">Email address</label><input id="nlf-email" type="email" name="email" autocomplete="email" required placeholder="Email address">'+
      '<button type="submit">Subscribe</button><p class="msg" role="status" aria-live="polite"></p></form>'+
      '<small>No spam. One-click unsubscribe in every issue.</small></div>';
  f.className+=' nl-foot';
  f.innerHTML='<div class="fg">'+first+
    '<div class="col"><b>Explore</b><a href="/about">About</a><a href="/branches">Find a Church</a><a href="/ministries">Ministries</a><a href="/events">Events</a></div>'+
    '<div class="col"><b>Ministries</b><a href="/women">Women Foundation</a><a href="/gen218">Gen218 Singles</a><a href="https://www.mfmmegaregion2yc.org/" target="_blank" rel="noopener">Youth Church</a><a href="/live">Watch</a></div>'+
    '<div class="col"><b>Connect</b><a href="/#new-here">New Here?</a><a href="/?subject=prayer#reach-out">Prayer Request</a><a href="/?subject=general#reach-out">Reach Out to Us</a><a href="/links">Contact &amp; Social</a><a href="/privacy">Privacy</a></div>'+
    '</div><div class="fb"><span>&copy; 2026 MFM Mega Region 2 USA</span><span>Prayer &middot; Deliverance &middot; The Word</span></div>';
  var form=f.querySelector('form');if(!form)return;
  var msg=form.querySelector('.msg'),btn=form.querySelector('button');
  form.addEventListener('submit',function(e){
    e.preventDefault();msg.className='msg';msg.textContent='';
    var email=form.email.value.trim(),fn=form.firstName.value.trim();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){msg.textContent='Please enter a valid email address.';msg.className='msg err';form.email.focus();return;}
    btn.disabled=true;btn.textContent='Subscribing…';
    fetch('/.netlify/functions/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email,firstName:fn,source:'newsletter-footer'})})
      .then(function(r){return r.json().catch(function(){return {};}).then(function(d){return {s:r.status,b:d};});})
      .then(function(res){
        if(res.s>=200&&res.s<300){msg.textContent='Welcome! Check your inbox for a note from newsletter@mfmmegaregion2usa.org.';msg.className='msg ok';form.reset();}
        else{msg.textContent=(res.b&&res.b.error)?res.b.error:'Something went wrong. Please try again.';msg.className='msg err';}
      })
      .catch(function(){msg.textContent='Network error. Please check your connection and try again.';msg.className='msg err';})
      .then(function(){btn.disabled=false;btn.textContent='Subscribe';});
  });
}catch(e){}})();
