const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
async function shot(p,u,out,sel){await p.goto('http://localhost:8093/'+u);await p.waitForTimeout(1400);
 await p.evaluate(()=>{document.querySelectorAll('.dz-pick,.pv-menu').forEach(e=>e.remove());document.querySelectorAll('[class*="nl-"]').forEach(e=>{if(getComputedStyle(e).position==='fixed')e.remove()})});
 if(sel){const l=p.locator(sel).first();await l.scrollIntoViewIfNeeded();await p.waitForTimeout(300);await l.screenshot({path:out});}else await p.screenshot({path:out,fullPage:true});}
for(const [w,h,t] of [[1440,900,'d'],[390,844,'m']]){const p=await b.newPage({viewport:{width:w,height:h}});
 for(let i=1;i<=5;i++)await shot(p,'testimonies-'+i+'.html','N-t'+i+'-'+t+'.png');
 await shot(p,'reach-out.html#prayer','N-ro-'+t+'.png');await shot(p,'index.html','N-tsa-'+t+'.png','section.tsa');await p.close();}
await b.close();})();
