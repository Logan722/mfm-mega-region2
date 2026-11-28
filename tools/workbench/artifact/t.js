const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const [w,h,tag] of [[1280,860,'d'],[390,844,'m']]){
const p=await (await b.newContext({viewport:{width:w,height:h}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/artifact/index.html#play');await p.waitForTimeout(1200);
await p.screenshot({path:`a-play-${tag}.png`});
await p.click('.play-today [data-mode=daily]');await p.waitForTimeout(300);
for(let i=0;i<5;i++){await p.locator('.qz-opt').first().click();await p.waitForTimeout(80);await p.click('.qz-next');await p.waitForTimeout(120);}
const sc=await p.textContent('.qz-score');
for(const v of ['home','message','events','testimonies','how']){await p.evaluate(v=>location.hash=v,v);await p.waitForTimeout(300);await p.screenshot({path:`a-${v}-${tag}.png`,fullPage:tag==='d'&&v==='home'});
 const ow=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(ow>1)errs.push(v+' overflow '+ow);}
console.log(tag,'score',sc,'errors',JSON.stringify(errs));}
await b.close();})();
