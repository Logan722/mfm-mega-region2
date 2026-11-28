const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
async function shot(u,out,sel){await p.goto('http://localhost:8093/'+u);await p.waitForTimeout(1400);
 await p.evaluate(()=>{document.querySelectorAll('.dz-pick,.pv-menu,[class*="nl-"]').forEach(e=>{if(e.classList.contains('dz-pick')||e.classList.contains('pv-menu')||getComputedStyle(e).position==='fixed')e.remove()})});
 if(sel){const l=p.locator(sel).first();await l.scrollIntoViewIfNeeded();await p.waitForTimeout(300);await l.screenshot({path:out});}else await p.screenshot({path:out,fullPage:true});}
for(let i=1;i<=5;i++){await shot('testimonies-'+i+'.html','S-t'+i+'.png');await shot('reach-out-'+i+'.html'+(i==2||i==5?'#prayer':''),'S-r'+i+'.png');}
await shot('index.html','S-media.png','section.media-band');await shot('index.html','S-tsa.png','section.tsa');await shot('index.html','S-foot.png','footer');
await b.close();})();
