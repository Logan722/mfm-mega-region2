const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const out={};
for (const [tag,vw,mob] of [['d',1440,false],['m',390,true],['s',360,true]]){
const c=await b.newContext({viewport:{width:vw,height:mob?844:900},isMobile:mob,hasTouch:mob});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8093/media.html',{waitUntil:'networkidle'});
await p.addStyleTag({content:'.site-header{position:absolute!important}'});
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=350){scrollTo(0,y);await new Promise(r=>setTimeout(r,100));}scrollTo(0,0);});await p.waitForTimeout(800);
const r={errs};
r.selVis=await p.evaluate(()=>!!document.querySelector('.filter-selects').offsetParent);
await p.screenshot({path:`wf/mf-${tag}.png`,fullPage:true});
if(mob){ await p.screenshot({path:`wf/mf-${tag}-closed.png`});
 await p.click('.mf-toggle');await p.waitForTimeout(400);r.openVis=await p.evaluate(()=>!!document.querySelector('.filter-selects').offsetParent);
 await p.selectOption('#mProgram',{index:2});await p.waitForTimeout(300);r.badge=await p.textContent('.mf-toggle b');
 await p.screenshot({path:`wf/mf-${tag}-open.png`});
 await p.click('.mf-toggle');await p.waitForTimeout(300);r.closedAgain=await p.evaluate(()=>!document.querySelector('.filter-selects').offsetParent);r.badgeVisible=await p.evaluate(()=>!document.querySelector('.mf-toggle b').hidden);
 r.count=await p.textContent('#mCount');
 await p.screenshot({path:`wf/mf-${tag}-filtered.png`});}
r.sw=await p.evaluate(()=>document.documentElement.scrollWidth);
out[tag]=r;await c.close();}
console.log(JSON.stringify(out));await b.close();})();
