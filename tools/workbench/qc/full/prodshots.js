const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const pg of ['women','gen218','media']) for (const [tag,vw,mob] of [['d',1440,false],['m',390,true]]){
 const c=await b.newContext({viewport:{width:vw,height:mob?844:900},isMobile:mob,hasTouch:mob});const p=await c.newPage();
 await p.goto('https://mfmmegaregion2usa.org/'+pg,{waitUntil:'load'});await p.waitForTimeout(1500);
 await p.addStyleTag({content:'.site-header{position:absolute!important}'});
 await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=350){scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}scrollTo(0,0);});await p.waitForTimeout(1200);
 await p.screenshot({path:`full/p-${pg}-${tag}.png`,fullPage:true});await c.close();}
await b.close();})();
