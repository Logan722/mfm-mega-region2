const { chromium } = require('playwright');
const fs=require('fs');const root='/home/claude/mfm-mega-region2';
let pages=['index','about','women','gen218','media','live','ministries','play','testimonies','reach-out','events','branches','gallery','privacy','subscribe','newsletter/index','reach-out/prayer','thanks','youth','new-here','gallery-florida'];
for (const d of ['events','branches','messages']) { const f=fs.readdirSync(root+'/'+d).filter(x=>x.endsWith('.html')).slice(0,2); pages.push(...f.map(x=>d+'/'+x.replace('.html',''))); }
pages=pages.filter(p=>fs.existsSync(root+'/'+p+'.html'));
(async()=>{const b=await chromium.launch();for(const w of [1440,390]){const c=await b.newContext({viewport:{width:w,height:900},isMobile:w<500});const p=await c.newPage();
for(const pg of pages){await p.goto('http://localhost:8097/'+pg+'.html').catch(()=>{});await p.waitForTimeout(400);
const r=await p.evaluate(()=>{const sel='.btn, a.button, button.button, .ek-btn, .nav-links a.nav-cta, .drawer-nav a.drawer-cta, .ev2-all a, .foot-reach .btns a, .btns > a, .cs-form button, .hg-btn, .media-more a, .filter-selects button, .tsa-btn, .tsa-more, .sub-form button, .nl-links a, .mf-toggle, .thanks-btn, .btn--primary, .btn--secondary, .btn--fire, .prayer-form button, .nl-form button, .nl-inline button';
const els=[...document.querySelectorAll(sel)].filter(e=>getComputedStyle(e).display!=='none');const none=[];
for(const s of document.styleSheets){let rs;try{rs=s.cssRules}catch(x){continue}const walk=l=>{for(const r of l){if(r.media&&!matchMedia(r.media.mediaText).matches)continue;if(r.cssRules&&!r.selectorText)walk(r.cssRules);else if(r.selectorText&&r.style&&r.style.display==='none')none.push(r.selectorText)}};walk(rs)}
const out=[];for(const e of els){for(const s of none){try{if(e.matches(s)){out.push(e.className+' "'+e.textContent.trim().slice(0,18)+'" <- '+s.slice(0,80));break}}catch(x){}}}return out});
if(r.length)console.log(w,pg,JSON.stringify(r))}await c.close()}await b.close()})();
