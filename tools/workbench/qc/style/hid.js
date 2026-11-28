// find buttons that our pill rule forced visible: hidden attr or display:none in a sheet w/o style system
const { chromium } = require('playwright');
const pages=['index','about','women','gen218','media','live','ministries','play','testimonies','reach-out','events','branches','gallery','privacy','subscribe','newsletter/index','reach-out/prayer','thanks'];
(async()=>{const b=await chromium.launch();for(const w of [1440,390]){const c=await b.newContext({viewport:{width:w,height:900},isMobile:w<500});const p=await c.newPage();
for(const pg of pages){await p.goto('http://localhost:8097/'+pg+'.html').catch(()=>{});await p.waitForTimeout(400);
const r=await p.evaluate(()=>{const sel='.btn, a.button, button.button, .ek-btn, .nav-links a.nav-cta, .drawer-nav a.drawer-cta, .ev2-all a, .foot-reach .btns a, .btns > a, .cs-form button, .hg-btn, .media-more a, .filter-selects button, .tsa-btn, .tsa-more, .sub-form button, .nl-links a, .mf-toggle, .thanks-btn, .btn--primary, .btn--secondary, .btn--fire, .prayer-form button, .nl-form button, .nl-inline button';
// disable style-system by testing each element with the stylesheet rules removed is hard; instead flag hidden-attr visible
return [...document.querySelectorAll(sel)].filter(e=>e.hidden&&getComputedStyle(e).display!=='none').map(e=>e.className+':'+e.textContent.trim().slice(0,20))});
if(r.length)console.log(w,pg,r)}await c.close()}await b.close()})();
