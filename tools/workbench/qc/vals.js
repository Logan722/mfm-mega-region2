const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await c.newPage();
await p.goto('http://localhost:8093/about.html');await p.waitForTimeout(1800);
await p.evaluate(()=>{document.querySelectorAll('.skip-link').forEach(e=>e.remove());document.querySelectorAll('#siteNav,[data-mfm-header],.site-nav').forEach(e=>e.style.visibility='hidden');document.querySelectorAll('[class*="nl-"]').forEach(e=>{if(getComputedStyle(e).position==='fixed')e.remove()})});
const info=await p.evaluate(()=>{const g=document.querySelector('.values-grid');const s=g.closest('section');const r=s.getBoundingClientRect();return {top:r.top+scrollY,h:r.height,gh:g.getBoundingClientRect().height,kids:g.children.length,disp:getComputedStyle(g).display}});console.log(info);
await p.screenshot({path:'/home/claude/qc/K-values.png',fullPage:true,clip:{x:0,y:info.top,width:390,height:Math.min(info.h,1100)}});await b.close();})();
