const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();for(const [w,h,n] of [[1440,900,'gd'],[390,844,'gm']]){const p=await (await b.newContext({viewport:{width:w,height:h},isMobile:w<500,hasTouch:w<500})).newPage();await p.goto('http://localhost:8095/play');await p.waitForTimeout(1000);
await p.evaluate(()=>{const b=document.querySelector('[data-game="connect"] button, [data-game="connect"] [data-mode]');b&&b.click()});await p.waitForTimeout(1200);await p.screenshot({path:n+'-connect.png'});
await p.evaluate(()=>document.querySelector('.st-x')&&document.querySelector('.st-x').click());await p.waitForTimeout(500);
await p.evaluate(()=>{const b=document.querySelector('[data-game="bquiz"] button, [data-game="bquiz"] [data-mode]');b&&b.click()});await p.waitForTimeout(1200);await p.screenshot({path:n+'-quiz.png'});}
await b.close()})();
