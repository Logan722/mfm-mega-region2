const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const [w,h,t] of [[1536,900,'d'],[390,844,'m']]){const p=await (await b.newContext({viewport:{width:w,height:h}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('https://mfmmegaregion2usa.org/preview-play',{waitUntil:'load'});await p.waitForTimeout(2000);
await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelectorAll('body *').forEach(x=>{const ps=getComputedStyle(x).position;if(ps==='fixed'||ps==='sticky')x.style.visibility='hidden'})});
for(let i=1;i<=5;i++){await p.evaluate(n=>document.querySelector(`[data-lpick="${n}"]`).click(),i);const el=p.locator('.pg-board');await el.scrollIntoViewIfNeeded();await p.waitForTimeout(1600);await el.screenshot({path:`cmp/live-board${i}-${t}.png`});}
console.log(t,'ow',await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth),'errs',JSON.stringify(errs));}
await b.close();})();
