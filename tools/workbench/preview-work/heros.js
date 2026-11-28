const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const [w,h,t] of [[1536,860,'d'],[390,844,'m']]){const p=await (await b.newContext({viewport:{width:w,height:h}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8093/play.html',{waitUntil:'load'});await p.waitForTimeout(2200);
for(let i=1;i<=5;i++){await p.evaluate(n=>document.querySelector(`[data-hpick="${n}"]`).click(),i);await p.waitForTimeout(500);await p.screenshot({path:`cmp/hero${i}-${t}.png`});}
await p.mouse.wheel(0,1800);await p.waitForTimeout(700);await p.screenshot({path:`cmp/scrolled-nav-${t}.png`,clip:{x:0,y:0,width:w,height:140}});
console.log(t,'navcls',await p.evaluate(()=>document.documentElement.className),'ow',await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth),'errs',JSON.stringify(errs));}
await b.close();})();
