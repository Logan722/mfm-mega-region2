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

/* Short footer on the newsletter pages (Oct 21 2026): ministry logo + name. The "Never miss an issue" sign-up
   block sits right above it on these pages, so together they match the short footer on the rest of the site. */
(function(){try{
  var f=document.querySelector('footer[data-footer]');if(!f||f.getAttribute('data-footer-done'))return;
  f.setAttribute('data-footer-done','1');
  var css=document.createElement('style');
  css.textContent='.nl-foot{background:#0b1328;color:#fff;font-family:"Inter Tight",Inter,-apple-system,Helvetica,Arial,sans-serif;padding:0 20px max(14px,env(safe-area-inset-bottom))}'+
    '.nl-foot-in{max-width:1180px;margin:0 auto;padding:28px 0 18px;display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap;border-top:1px solid rgba(255,255,255,.08)}'+
    '.nl-foot-id{display:flex;align-items:center;gap:12px}.nl-foot-id img{width:48px;height:48px}'+
    '.nl-foot-id strong{display:block;font-family:Georgia,Fraunces,serif;font-weight:400;font-size:18px;color:#fff}'+
    '.nl-foot-id small{display:block;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#8493aa;margin-top:3px}'+
    '.nl-foot-meta{font-size:11px;color:#718099}.nl-foot-meta a{color:inherit;text-decoration:none;margin-left:14px}.nl-foot-meta a:hover{color:#fff}'+
    '@media(max-width:560px){.nl-foot-in{flex-direction:column;text-align:center}.nl-foot-meta a{margin-left:10px}}'+
    'body:has(.mag-share-float) .nl-foot{padding-bottom:96px}';
  document.head.appendChild(css);
  f.className+=' nl-foot';
  f.innerHTML='<div class="nl-foot-in"><div class="nl-foot-id"><img src="/img/logo.png" alt="" width="48" height="48"><div><strong>MFM Mega Region 2 USA</strong><small>Prayer &middot; Deliverance &middot; The Word</small></div></div>'+
    '<div class="nl-foot-meta">&copy; 2026 MFM Mega Region 2 USA<a href="/privacy">Privacy</a></div></div>';
}catch(e){}})();
