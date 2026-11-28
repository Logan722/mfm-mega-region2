const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();for(const [w,h,t] of [[1440,900,'desktop'],[1024,768,'tablet'],[390,844,'phone'],[360,780,'small']]){const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8093/index.html');await p.waitForTimeout(1500);
await p.evaluate(()=>{document.querySelectorAll('.pv-menu,.skip-link').forEach(e=>e.remove());document.querySelectorAll('#siteNav,[data-mfm-header]').forEach(e=>e.style.display='none');document.querySelectorAll('[class*="nl-"]').forEach(e=>{if(getComputedStyle(e).position==='fixed')e.remove()})});
const r=await p.evaluate(()=>[...document.querySelectorAll('.tsa h3,.tsa .tsa-feat .tsa-k')].map(h=>{const cs=getComputedStyle(h);return h.textContent.slice(0,22)+' '+cs.fontSize+' lines:'+Math.round(h.getBoundingClientRect().height/(parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.2))}));
const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
const l=p.locator('section.tsa');await l.scrollIntoViewIfNeeded();await l.screenshot({path:`/mnt/user-data/outputs/home-testimonies-${t}.jpg`,type:'jpeg',quality:86});console.log(t,'ov',ov,r,errs);await p.close();}await b.close();})();
