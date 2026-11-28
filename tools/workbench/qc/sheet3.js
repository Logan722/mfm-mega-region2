const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
async function shot(p,u,out,sel){await p.goto('http://localhost:8093/'+u);await p.waitForTimeout(1400);
 await p.evaluate(()=>{document.querySelectorAll('.pv-menu,.skip-link').forEach(e=>e.remove());document.querySelectorAll('[class*="nl-"]').forEach(e=>{if(getComputedStyle(e).position==='fixed')e.remove()})});
 if(sel){await p.evaluate(()=>document.querySelectorAll('#siteNav,[data-mfm-header]').forEach(e=>e.style.display='none'));const l=p.locator(sel).first();await l.scrollIntoViewIfNeeded();await p.waitForTimeout(300);await l.screenshot({path:out,type:'jpeg',quality:86});}else await p.screenshot({path:out,fullPage:true,type:'jpeg',quality:84});}
for(const [w,h,t] of [[1440,900,'desktop'],[390,844,'phone']]){const p=await b.newPage({viewport:{width:w,height:h}});
 await shot(p,'testimonies.html','/mnt/user-data/outputs/testimonies-page-'+t+'.jpg');
 await shot(p,'testimonies-full.html','/home/claude/qc/tfull-'+t+'.jpg');
 await shot(p,'index.html','/mnt/user-data/outputs/home-testimonies-'+t+'.jpg','section.tsa');await p.close();}
await b.close();})();
