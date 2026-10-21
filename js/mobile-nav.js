(() => {
  const header = document.querySelector('[data-mfm-header]');
  const toggle = document.querySelector('[data-mfm-menu-toggle]');
  const menu = document.querySelector('[data-mfm-mobile-menu]');
  const desktopQuery = window.matchMedia('(min-width: 53.126rem)');

  if (!header || !toggle || !menu) return;

  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  let returnFocus = null;

  function getMenuFocusables() {
    return [...menu.querySelectorAll(focusableSelector)].filter(element => {
      return !element.closest('[hidden]');
    });
  }

  function openMenu() {
    returnFocus = document.activeElement;
    menu.hidden = false;
    menu.inert = false;
    document.body.classList.add('mfm-menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    requestAnimationFrame(() => getMenuFocusables()[0]?.focus());
  }

  function closeMenu({ restoreFocus = true } = {}) {
    document.body.classList.remove('mfm-menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    menu.inert = true;
    menu.hidden = true;

    if (restoreFocus && returnFocus instanceof HTMLElement) {
      returnFocus.focus();
    }
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  menu.addEventListener('click', event => {
    const groupToggle = event.target.closest('[data-mfm-group-toggle]');

    if (groupToggle) {
      const controlledId = groupToggle.getAttribute('aria-controls');
      const controlledPanel = document.getElementById(controlledId);
      const willOpen = groupToggle.getAttribute('aria-expanded') !== 'true';

      menu.querySelectorAll('[data-mfm-group-toggle]').forEach(button => {
        const panel = document.getElementById(button.getAttribute('aria-controls'));
        button.setAttribute('aria-expanded', 'false');
        button.querySelector('.mfm-group-mark').textContent = '+';
        if (panel) panel.hidden = true;
      });

      groupToggle.setAttribute('aria-expanded', String(willOpen));
      groupToggle.querySelector('.mfm-group-mark').textContent = willOpen ? '−' : '+';
      if (controlledPanel) controlledPanel.hidden = !willOpen;
      return;
    }

    if (event.target.closest('[data-mfm-menu-link]')) {
      closeMenu({ restoreFocus: false });
    }
  });

  document.addEventListener('keydown', event => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusables = getMenuFocusables();
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  desktopQuery.addEventListener('change', event => {
    if (event.matches) closeMenu({ restoreFocus: false });
  });

  // Mark internal links that match the current route.
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  menu.querySelectorAll('a[href^="/"]').forEach(link => {
    const linkUrl = new URL(link.href, window.location.origin);
    if (linkUrl.hash) return;
    const linkPath = linkUrl.pathname.replace(/\/$/, '') || '/';
    if (linkPath === currentPath) link.setAttribute('aria-current', 'page');
  });

  menu.inert = true;
})();

/* Desktop dropdown aria-expanded sync (§8) */
(function(){document.querySelectorAll('.nav-dropdown').forEach(function(dd){var t=dd.querySelector('.nav-dropdown-toggle');if(!t)return;t.setAttribute('aria-expanded',dd.classList.contains('open')?'true':'false');try{new MutationObserver(function(){t.setAttribute('aria-expanded',dd.classList.contains('open')?'true':'false');}).observe(dd,{attributes:true,attributeFilter:['class']});}catch(e){}});})();

/* Unify the Media & Events dropdown on every page (single source) */
(function(){try{
 var items=[['/media','Media','Sermons, worship & teachings',false],
  ['/gallery','Gallery','Photos from across the region',false],
  ['/events','Events','Weekly programs & special services',false],
  ['/live','Watch Live','Join our services online',false],
  ['https://www.mountainoffire.org/resources/prayer-points','Prayer Points','Daily prayer points from MFM',true]];
 var dds=document.querySelectorAll('.nav-dropdown');
 for(var k=0;k<dds.length;k++){var dd=dds[k],t=dd.querySelector('.nav-dropdown-toggle');
  if(!t||!/media/i.test(t.textContent))continue;
  var menu=dd.querySelector('.nav-dropdown-menu');if(!menu)continue;
  var html='';for(var j=0;j<items.length;j++){var it=items[j];
   html+='<a href="'+it[0]+'"'+(it[3]?' target="_blank" rel="noopener"':'')+'>'
    +'<div class="nav-dd-label">'+it[1]+'<span>'+it[2]+'</span></div></a>';}
  menu.innerHTML=html;}
}catch(e){}})();

/* Add Gallery to the mobile drawer Gather & Watch group */
(function(){try{var g=document.getElementById('mfm-gather-menu');if(g&&!/\/gallery/.test(g.innerHTML)){var a=document.createElement('a');a.href='/gallery';a.setAttribute('data-mfm-menu-link','');a.innerHTML='<span><strong>Gallery</strong><small>Moments from across the region</small></span><span aria-hidden="true">&rarr;</span>';g.appendChild(a);}}catch(e){}})();

/* (Floating social hub removed Oct 2026 — audit B-01 / GOV-008. Contextual minister icons and the /links tiles remain.) */

/* "Live now" (owner request, Oct 14 2026): when Mega Region 2 or Pastor Olumide Oni is streaming on YouTube —
   - Home: a "Live now" section appears right under the hero (click-to-play player + "Watch on YouTube"), and the
     hero's "Coming up next" box becomes "Live now · Watch now"; both are undone automatically when the stream ends.
   - Live page (/live): the live player sits at the top and the status bar says "Live now".
   - Every other page: a small "Live now" card bottom-left (dismissible for that stream).
   Data: /.netlify/functions/live-status (CDN-cached 60 s). Re-checked every minute while the page is visible. */
(function(){try{
  if(!window.fetch||!document.querySelector)return;
  var path=location.pathname.replace(/\.html$/,'').replace(/\/$/,'')||'/';
  var onLive=path==='/live'||path==='/watch', onHome=path==='/'||path==='/index';
  function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function dismissed(id){try{return sessionStorage.getItem('mfm-live-x')===id;}catch(e){return false;}}
  function remember(id){try{sessionStorage.setItem('mfm-live-x',id);}catch(e){}}
  var css=document.createElement('style');
  css.textContent='.mfm-live{position:fixed;left:20px;bottom:20px;z-index:90;width:340px;max-width:calc(100vw - 32px);background:#142240;color:#fff;border-left:4px solid #e0ad45;box-shadow:0 18px 50px rgba(0,0,0,.35);padding:16px 44px 16px 18px;font-family:"Inter Tight",system-ui,sans-serif}'+
   '.mfm-live b.lv,.watch-live-now .lv{display:inline-flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.16em;font-weight:800;color:#ff6b57;text-transform:uppercase}'+
   '.mfm-live b.lv i,.watch-live-now .lv i,.service-dock.is-live>span i{width:9px;height:9px;border-radius:50%;background:#ff3b30;animation:mfmLivePulse 1.6s infinite}'+
   '.mfm-live small{display:block;margin:8px 0 2px;color:#e0ad45;font-size:12px;font-weight:700}'+
   '.mfm-live p{margin:0 0 12px;font-size:14px;line-height:1.4;color:#e8ebf1;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}'+
   '.mfm-live a.go{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;background:#e0ad45;color:#0b1322;font-weight:800;font-size:13px;letter-spacing:.08em;text-transform:uppercase;text-decoration:none}'+
   '.mfm-live a.go:hover{background:#c9952c}.mfm-live a.go:focus-visible,.mfm-live .x:focus-visible,.watch-live-now button:focus-visible{outline:3px solid #f0c760;outline-offset:2px}'+
   '.mfm-live .x{position:absolute;top:6px;right:6px;width:36px;height:36px;border:0;background:transparent;color:#c9d0dc;font-size:22px;line-height:1;cursor:pointer}.mfm-live .x:hover{color:#fff}'+
   '@keyframes mfmLivePulse{0%{box-shadow:0 0 0 0 rgba(255,59,48,.6)}70%{box-shadow:0 0 0 9px rgba(255,59,48,0)}100%{box-shadow:0 0 0 0 rgba(255,59,48,0)}}'+
   '@media(prefers-reduced-motion:reduce){.mfm-live b.lv i,.watch-live-now .lv i,.service-dock.is-live>span i{animation:none}}'+
   '@media(max-width:600px){.mfm-live{left:12px;right:12px;bottom:12px;width:auto}}'+
   '.watch-live-now{background:#0b1322;color:#fff;padding:clamp(40px,6vw,72px) 0}'+
   '.watch-live-now h2{font-family:var(--serif,Fraunces,serif);font-size:clamp(28px,3.4vw,46px);line-height:1.1;margin:12px 0 6px;color:#fff}'+
   '.watch-live-now .who{color:#e0ad45;font-weight:700;margin:0 0 24px}.watch-live-now .frame{position:relative;aspect-ratio:16/9;background:#000;max-width:1100px}'+
   '.watch-live-now iframe,.watch-live-now .frame button{position:absolute;inset:0;width:100%;height:100%;border:0}'+
   '.watch-live-now .frame button{padding:0;cursor:pointer;background:#000}.watch-live-now .frame button img{width:100%;height:100%;object-fit:cover;opacity:.85}'+
   '.watch-live-now .frame button b{position:absolute;left:50%;top:50%;width:84px;height:84px;margin:-42px 0 0 -42px;border-radius:50%;background:#e0ad45;color:#0b1322;display:grid;place-items:center;box-shadow:0 12px 40px rgba(0,0,0,.5)}'+
   '.watch-live-now .frame button b svg{width:34px;height:34px;margin-left:5px}.watch-live-now .frame button:hover b{background:#f0c760}'+
   '.watch-live-now .more{margin-top:18px}.watch-live-now .more a{color:#e0ad45;font-weight:700}'+
   '.watch-live-now+.watch-live-now{padding-top:0}'+
   '.service-dock.is-live{border-top:4px solid #ff3b30}.service-dock.is-live>span{color:#d4381f}'+
   '.mfm-live-strip{position:fixed;bottom:0;left:0;right:0;z-index:101;height:calc(44px + env(safe-area-inset-bottom,0px));padding-bottom:env(safe-area-inset-bottom,0px)!important;display:flex;align-items:center;justify-content:center;gap:14px;padding:0 16px;background:#b3261e;color:#fff;text-decoration:none;font-size:14px;line-height:1;white-space:nowrap;overflow:hidden;box-shadow:0 -6px 24px rgba(0,0,0,.28)}'+
   '.mfm-live-strip b{display:inline-flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.16em;font-weight:800;text-transform:uppercase;flex:none}'+
   '.mfm-live-strip b i{width:9px;height:9px;border-radius:50%;background:#fff;animation:mfmLivePulse 1.6s infinite}'+
   '.mfm-live-strip .t{overflow:hidden;text-overflow:ellipsis;min-width:0;font-weight:600}'+
   '.mfm-live-strip .go{flex:none;font-weight:800;color:#ffe6a6;text-decoration:underline;text-underline-offset:3px}'+
   '.mfm-live-strip:hover{background:#9c1f18}.mfm-live-strip:hover .go{color:#fff}.mfm-live-strip:focus-visible{outline:3px solid #f0c760;outline-offset:-3px}'+
   'a.mfm-live-strip,a.mfm-live-strip:visited,a.mfm-live-strip b,a.mfm-live-strip .t{color:#fff!important;text-decoration:none!important}a.mfm-live-strip .go{color:#ffe6a6!important;text-decoration:underline!important}a.mfm-live-strip:hover .go{color:#fff!important}'+
   'html.has-live-strip .live-banner{display:none!important}'+
   'html.has-live-strip body{padding-bottom:calc(44px + env(safe-area-inset-bottom,0px))}'+
   'html.has-live-strip .home-hero .service-dock{margin-bottom:44px}'+
   'html.has-live-strip body.drawer-open .mfm-live-strip,html.has-live-strip body.mfm-menu-open .mfm-live-strip{display:none}'+
   '@media(max-width:600px){.mfm-live-strip{gap:10px;font-size:13px;padding:0 12px}.mfm-live-strip .go{font-size:12px}}'+
   '@media(max-width:420px){.mfm-live-strip .t{display:none}}'+
   '@media(prefers-reduced-motion:reduce){.mfm-live-strip b i{animation:none}}';
  var shownIds='',dockHTML=null,barHTML=null;
  function card(s){
    if(onLive||onHome||dismissed(s.id)||document.querySelector('.mfm-live'))return;
    var d=document.createElement('aside');d.className='mfm-live';d.setAttribute('aria-label','Live now');
    d.innerHTML='<b class="lv"><i aria-hidden="true"></i>Live now</b><small>'+esc(s.name)+'</small><p>'+esc(s.title)+'</p>'+
      '<a class="go" href="/live">Watch now</a><button type="button" class="x" aria-label="Close live notice">&times;</button>';
    d.querySelector('.x').addEventListener('click',function(){remember(s.id);d.parentNode.removeChild(d);});
    document.body.appendChild(d);
  }
  function sections(list){
    var html='';
    list.forEach(function(s,i){
      html+='<section class="watch-live-now"'+(i===0?' id="live-now"':'')+' aria-label="Live now: '+esc(s.name)+'"><div class="wrap"><span class="lv"><i aria-hidden="true"></i>Live now</span>'+
        '<h2>'+esc(s.title)+'</h2><p class="who">'+esc(s.name)+'</p>'+
        '<div class="frame"><button type="button" data-live-yt="'+esc(s.id)+'" aria-label="Play the live stream: '+esc(s.title)+'"><img src="https://i.ytimg.com/vi/'+encodeURIComponent(s.id)+'/hqdefault_live.jpg" alt="" loading="lazy" onerror="this.onerror=null;this.src=\'https://i.ytimg.com/vi/'+encodeURIComponent(s.id)+'/hqdefault.jpg\'"><b aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></b></button></div>'+
        '<p class="more"><a href="'+esc(s.url)+'" target="_blank" rel="noopener">Watch on YouTube (chat and comments) &rarr;</a></p></div></section>';
    });
    return html;
  }
  function placeSections(list){
    var anchor=onHome?document.querySelector('.home-hero'):(onLive?document.querySelector('main .page-hero'):null);
    if(!anchor||!anchor.parentNode)return;
    var box=document.createElement('div');box.innerHTML=sections(list);
    var ref=anchor.nextSibling;
    while(box.firstChild)anchor.parentNode.insertBefore(box.firstChild,ref);
  }
  /* Live strip (Oct 20 2026): while Mega Region 2 is live, a strip across the bottom of every page links straight
     to the Mega Region 2 stream on YouTube (moved from the top at Dawn's request). */
  function strip(s){
    var a=document.createElement('a');a.className='mfm-live-strip';a.href=s.url;a.target='_blank';a.rel='noopener';
    a.setAttribute('aria-label','Live now on MFM Mega Region 2 USA: '+s.title+'. Watch the live stream on YouTube');
    a.innerHTML='<b><i aria-hidden="true"></i>Live now</b><span class="t">'+esc(s.title)+'</span><span class="go">Watch on YouTube &rarr;</span>';
    document.body.appendChild(a);
    document.documentElement.classList.add('has-live-strip');
  }
  function clearAll(){
    var st=document.querySelector('.mfm-live-strip');if(st)st.parentNode.removeChild(st);
    document.documentElement.classList.remove('has-live-strip');
    [].forEach.call(document.querySelectorAll('.watch-live-now'),function(n){n.parentNode.removeChild(n);});
    var old=document.querySelector('.mfm-live');if(old)old.parentNode.removeChild(old);
    var dk=document.querySelector('.home-hero .service-dock');if(dk&&dockHTML!==null){dk.innerHTML=dockHTML;dk.classList.remove('is-live');}
    var bar=document.querySelector('.broadcast-status .wrap');if(bar&&barHTML!==null)bar.innerHTML=barHTML;
    shownIds='';
  }
  function show(list){
    var ids=list.map(function(s){return s.id;}).join(',');if(ids===shownIds)return;
    clearAll();shownIds=ids;
    if(!css.parentNode)document.head.appendChild(css);
    if(onHome||onLive)placeSections(list);
    if(onHome){var dk=document.querySelector('.home-hero .service-dock');
      if(dk){if(dockHTML===null)dockHTML=dk.innerHTML;dk.classList.add('is-live');
        dk.innerHTML='<span><i></i> Live now</span><b>'+esc(list[0].name)+'</b><small>'+esc(list[0].title)+'</small><a href="#live-now">Watch now <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg></a>';}}
    if(onLive){var bar=document.querySelector('.broadcast-status .wrap');
      if(bar){if(barHTML===null)barHTML=bar.innerHTML;
        bar.innerHTML='<span id="bStatus" class="live"><i></i>Live now</span><b id="bTitle">'+esc(list[0].name)+'</b><small id="bDetail">'+esc(list[0].title)+'</small><a id="bLink" href="#live-now">Watch now</a>';}
      if(location.hash==='#live'||location.hash==='#live-now'){var t=document.getElementById('live-now');if(t)t.scrollIntoView();}}
    var mr=list.filter(function(s){return s.key==='mfm';})[0];
    if(mr)strip(mr);else card(list[0]);       /* the strip replaces the corner card while Mega Region 2 is live */
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('button[data-live-yt]');if(!b)return;
    var f=document.createElement('iframe');
    f.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(b.getAttribute('data-live-yt'))+'?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    f.title=(b.getAttribute('aria-label')||'Live stream').replace(/^Play the live stream: /,'')+' (live)';
    f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;
    b.parentNode.replaceChild(f,b);
  });
  function check(){
    fetch('/.netlify/functions/live-status',{credentials:'omit'}).then(function(r){return r.ok?r.json():null;}).then(function(j){
      if(!j||!j.ok)return;                      /* a failed check changes nothing */
      var list=j.live||[];
      /* same-name rule (Oct 20 2026): a stream on Pastor Oni's channel with the same name as a Mega Region 2
         stream is the same service simulcast, so only the Mega Region 2 one is shown */
      var nm=function(t){return String(t||'').toLowerCase().replace(/^\W*live\W+/,'').replace(/[^a-z0-9]+/g,'');};
      var mfm=list.filter(function(s){return s.key==='mfm';});
      list=list.filter(function(s){return s.key==='mfm'||!mfm.some(function(m){return nm(m.title)&&nm(m.title)===nm(s.title);});});
      if(!list.length){if(shownIds)clearAll();return;}
      show(list);
    }).catch(function(){});
  }
  function start(){check();setInterval(function(){if(!document.hidden)check();},60000);}
  if(document.readyState==='complete')setTimeout(start,800);else window.addEventListener('load',function(){setTimeout(start,800);});
}catch(e){}})();

/* Homepage menu-bar behaviour on every page (owner request, Oct 20 2026): when a page opens with a dark banner
   right under the menu bar, the bar is see-through while the page is at the top and turns solid on scroll.
   The homepage keeps its own version (js/home-hero.js). Pages without such a banner keep the solid bar. */
(function(){try{
  var root=document.documentElement;
  if(document.querySelector('.home-hero'))return;
  var nav=document.querySelector('.site-nav'),main=document.querySelector('main');if(!nav||!main)return;
  var f=main.firstElementChild;while(f&&(f.hidden||getComputedStyle(f).display==='none'||/^(SCRIPT|STYLE|LINK)$/.test(f.tagName)))f=f.nextElementSibling;
  if(!f)return;
  var r=f.getBoundingClientRect(),n=nav.getBoundingClientRect();
  if(r.top>1||r.bottom<n.bottom+120)return;                       /* the banner must sit behind the bar */
  function dark(el){var c=getComputedStyle(el),m=(c.backgroundColor||'').match(/rgba?\(([^)]+)\)/);
    if(m){var v=m[1].split(',').map(parseFloat);if(v.length<4||v[3]>0.5){var L=(0.2126*v[0]+0.7152*v[1]+0.0722*v[2])/255;return L<0.35;}}
    return /gradient|url\(/.test(c.backgroundImage||'')||!!el.querySelector(':scope > img, :scope > picture, :scope > video, :scope > .page-hero-shade');}
  if(!dark(f))return;
  root.classList.add('nav-over-hero');
  function sync(){root.classList.toggle('nav-top',(window.pageYOffset||document.documentElement.scrollTop||0)<24);}
  sync();window.addEventListener('scroll',sync,{passive:true});
}catch(e){}})();
