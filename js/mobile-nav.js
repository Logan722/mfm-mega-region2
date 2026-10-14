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
  ['/watch','Watch Live','Join our services online',false],
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

/* "Live now" (owner request, Oct 14 2026): when Mega Region 2 or Pastor Olumide Oni is streaming on YouTube,
   every page shows a small "Live now" card (bottom-left; dismissible for that stream), and the Watch page
   shows the live player at the top. Data: /.netlify/functions/live-status (CDN-cached for 60 s). */
(function(){try{
  if(!window.fetch||!document.querySelector)return;
  var path=location.pathname.replace(/\.html$/,'').replace(/\/$/,'')||'/';
  var onWatch=path==='/watch';
  function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function dismissed(id){try{return sessionStorage.getItem('mfm-live-x')===id;}catch(e){return false;}}
  function remember(id){try{sessionStorage.setItem('mfm-live-x',id);}catch(e){}}
  var css=document.createElement('style');
  css.textContent='.mfm-live{position:fixed;left:20px;bottom:20px;z-index:90;width:340px;max-width:calc(100vw - 32px);background:#142240;color:#fff;border-left:4px solid #e0ad45;box-shadow:0 18px 50px rgba(0,0,0,.35);padding:16px 44px 16px 18px;font-family:"Inter Tight",system-ui,sans-serif}'+
   '.mfm-live b.lv{display:inline-flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.16em;font-weight:800;color:#ff6b57;text-transform:uppercase}'+
   '.mfm-live b.lv i{width:9px;height:9px;border-radius:50%;background:#ff3b30;box-shadow:0 0 0 0 rgba(255,59,48,.6);animation:mfmLivePulse 1.6s infinite}'+
   '.mfm-live small{display:block;margin:8px 0 2px;color:#e0ad45;font-size:12px;font-weight:700}'+
   '.mfm-live p{margin:0 0 12px;font-size:14px;line-height:1.4;color:#e8ebf1;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}'+
   '.mfm-live a.go{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;background:#e0ad45;color:#0b1322;font-weight:800;font-size:13px;letter-spacing:.08em;text-transform:uppercase;text-decoration:none}'+
   '.mfm-live a.go:hover{background:#c9952c}.mfm-live a.go:focus-visible,.mfm-live .x:focus-visible{outline:3px solid #f0c760;outline-offset:2px}'+
   '.mfm-live .x{position:absolute;top:6px;right:6px;width:36px;height:36px;border:0;background:transparent;color:#c9d0dc;font-size:22px;line-height:1;cursor:pointer}'+
   '.mfm-live .x:hover{color:#fff}'+
   '@keyframes mfmLivePulse{0%{box-shadow:0 0 0 0 rgba(255,59,48,.6)}70%{box-shadow:0 0 0 9px rgba(255,59,48,0)}100%{box-shadow:0 0 0 0 rgba(255,59,48,0)}}'+
   '@media(prefers-reduced-motion:reduce){.mfm-live b.lv i{animation:none}}'+
   '@media(max-width:600px){.mfm-live{left:12px;right:12px;bottom:12px;width:auto}}'+
   '.watch-live-now{background:#0b1322;color:#fff;padding:clamp(40px,6vw,72px) 0}.watch-live-now .eyebrow{color:#ff6b57}'+
   '.watch-live-now h2{font-family:var(--serif,Fraunces,serif);font-size:clamp(28px,3.4vw,46px);line-height:1.1;margin:10px 0 6px;color:#fff}'+
   '.watch-live-now .who{color:#e0ad45;font-weight:700;margin:0 0 24px}.watch-live-now .frame{position:relative;aspect-ratio:16/9;background:#000;max-width:1100px}'+
   '.watch-live-now iframe{position:absolute;inset:0;width:100%;height:100%;border:0}.watch-live-now .more{margin-top:18px}.watch-live-now .more a{color:#e0ad45;font-weight:700}'+
   '.watch-live-now+.watch-live-now{padding-top:0}';
  function card(s){
    if(onWatch||dismissed(s.id)||document.querySelector('.mfm-live'))return;
    var d=document.createElement('aside');d.className='mfm-live';d.setAttribute('aria-label','Live now');
    d.innerHTML='<b class="lv"><i aria-hidden="true"></i>Live now</b><small>'+esc(s.name)+'</small><p>'+esc(s.title)+'</p>'+
      '<a class="go" href="/watch#live">Watch now</a><button type="button" class="x" aria-label="Close live notice">&times;</button>';
    d.querySelector('.x').addEventListener('click',function(){remember(s.id);d.parentNode.removeChild(d);});
    document.body.appendChild(d);
  }
  function watchSection(list){
    if(!onWatch||document.querySelector('.watch-live-now'))return;
    var main=document.querySelector('main');if(!main)return;
    var html='';
    list.forEach(function(s,i){
      html+='<section class="watch-live-now"'+(i===0?' id="live"':'')+' aria-label="Live now"><div class="wrap"><span class="eyebrow">&#9679; Live now</span>'+
        '<h2>'+esc(s.title)+'</h2><p class="who">'+esc(s.name)+'</p>'+
        '<div class="frame"><iframe src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(s.id)+'?rel=0&amp;modestbranding=1" title="'+esc(s.title)+' (live)" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe></div>'+
        '<p class="more"><a href="'+esc(s.url)+'" target="_blank" rel="noopener">Watch on YouTube (chat and comments) &rarr;</a></p></div></section>';
    });
    var hero=main.querySelector('.page-hero');
    var box=document.createElement('div');box.innerHTML=html;
    var ref=hero?hero.nextSibling:main.firstChild;
    while(box.firstChild)main.insertBefore(box.firstChild,ref);
    if(location.hash==='#live'){var t=document.getElementById('live');if(t)t.scrollIntoView();}
  }
  function check(){
    fetch('/.netlify/functions/live-status',{credentials:'omit'}).then(function(r){return r.ok?r.json():null;}).then(function(j){
      var list=(j&&j.ok&&j.live)||[];
      if(!list.length){var old=document.querySelector('.mfm-live');if(old)old.parentNode.removeChild(old);return;}
      if(!css.parentNode)document.head.appendChild(css);
      card(list[0]);watchSection(list);
    }).catch(function(){});
  }
  function start(){check();setInterval(function(){if(!document.hidden)check();},180000);}
  if(document.readyState==='complete')setTimeout(start,800);else window.addEventListener('load',function(){setTimeout(start,800);});
}catch(e){}})();
