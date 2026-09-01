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


/* Floating social hub (restored, self-injecting) */
(function(){
 if(document.querySelector('.social-hub'))return;
 var css=".social-hub{position:fixed;right:max(20px,env(safe-area-inset-right));bottom:max(22px,env(safe-area-inset-bottom));z-index:130;display:grid;justify-items:end;gap:10px}"
 +".social-hub>button{width:56px;height:56px;border:0;border-radius:50%;background:#b3471b;color:#fff;display:grid;place-items:center;box-shadow:0 14px 35px #0812265c;cursor:pointer;position:relative}"
 +".social-hub>button svg{width:22px;height:22px}"
 +".social-hub>button:before{content:'';position:absolute;inset:-7px;border:1px solid #b3471b80;border-radius:50%;animation:socialPulse 2s ease-out infinite}"
 +".social-hub.open>button:before{animation:none}"
 +".social-hub-links{display:none;gap:8px}.social-hub.open .social-hub-links{display:grid}"
 +".social-hub-links a{display:flex;align-items:center;justify-content:flex-end;gap:9px}"
 +".social-hub-links a b{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:#c9952c;color:#142240;box-shadow:0 7px 22px #08122645}"
 +".social-hub-links a b svg{width:20px;height:20px}"
 +".social-hub-links a span{background:#0b1328;color:#fff;padding:7px 10px;font-size:11px;font-weight:700;border-radius:4px;box-shadow:0 7px 22px #08122633}"
 +"@media(max-width:600px){.social-hub>button{width:52px;height:52px}.social-hub-links a span{display:none}}"
 +"@media(prefers-reduced-motion:reduce){.social-hub>button:before{animation:none}}"
 +"@keyframes socialPulse{0%{transform:scale(1);opacity:.6}70%{transform:scale(1.4);opacity:0}100%{opacity:0}}";
 var s=document.createElement('style');s.textContent=css;document.head.appendChild(s);
 var YT='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.5 15.6V8.4l6.3 3.6z"/></svg>';
 var IG='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.2.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z"/></svg>';
 var FB='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-1.9.9-1.9 1.9V12h3.3l-.6 3.5h-2.7v8.4A12 12 0 0 0 24 12z"/></svg>';
 var WA='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>';
 var SHARE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.5-4.4M8.2 13.2l7.5 4.4"/></svg>';
 var hub=document.createElement('div');hub.className='social-hub';
 hub.innerHTML='<div class="social-hub-links" id="socialHubLinks">'
  +'<a class="youtube" href="https://www.youtube.com/@mfmmegaregion2usa" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><span>YouTube</span><b>'+YT+'</b></a>'
  +'<a class="instagram" href="https://www.instagram.com/mfmmegaregion2usa/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><span>Instagram</span><b>'+IG+'</b></a>'
  +'<a class="facebook" href="https://www.facebook.com/profile.php?id=61556716678081" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><span>Facebook</span><b>'+FB+'</b></a>'
  +'<a class="whatsapp" href="https://www.whatsapp.com/channel/0029VaO63PADJ6H057Ikrl3G" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Channel"><span>WhatsApp</span><b>'+WA+'</b></a>'
  +'</div><button type="button" aria-label="Open ministry social links" aria-expanded="false" aria-controls="socialHubLinks">'+SHARE+'</button>';
 document.body.appendChild(hub);
 var btn=hub.querySelector('button');
 function setOpen(o){hub.classList.toggle('open',o);btn.setAttribute('aria-expanded',o?'true':'false');btn.setAttribute('aria-label',o?'Close ministry social links':'Open ministry social links');}
 btn.addEventListener('click',function(e){e.stopPropagation();setOpen(!hub.classList.contains('open'));});
 document.addEventListener('click',function(e){if(!hub.contains(e.target))setOpen(false);});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&hub.classList.contains('open')){setOpen(false);btn.focus();}});
})();
