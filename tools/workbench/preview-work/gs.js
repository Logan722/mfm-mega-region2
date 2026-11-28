const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const [w,h,t] of [[1536,860,'d'],[390,844,'m']]){
 const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:t==='m'?2:1});const p=await ctx.newPage();
 await p.goto('http://localhost:8093/play.html',{waitUntil:'load'});await p.waitForTimeout(1500);
 await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelectorAll('body *').forEach(x=>{const ps=getComputedStyle(x).position;if(ps==='fixed'||ps==='sticky')x.style.visibility='hidden'})});
 for(let g=1;g<=6;g++){await p.locator(`[data-gpick="${g}"]`).click();await p.waitForTimeout(900);const el=p.locator('.pg-games');await el.scrollIntoViewIfNeeded();await el.screenshot({path:`cmp/gs${g}-${t}.png`});
  const ow=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(ow>0)console.log('overflow',t,g,ow);}
 await ctx.close();}
await b.close();})();
