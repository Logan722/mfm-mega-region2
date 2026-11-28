const { chromium } = require('playwright');
const games=['connect','bquiz','wheel','imposter','whoami','pairs','story'];
(async()=>{const b=await chromium.launch();for(const [w,h,n] of [[1440,900,'gd'],[390,844,'gm']]){const p=await (await b.newContext({viewport:{width:w,height:h},isMobile:w<500,hasTouch:w<500})).newPage();await p.goto('http://localhost:8095/play');await p.waitForTimeout(1000);
for(const g of games){await p.evaluate(g=>{const b=document.querySelector(`[data-game="${g}"] button, [data-game="${g}"] [data-mode]`);b&&b.click()},g);await p.waitForTimeout(1100);await p.screenshot({path:`${n}-${g}.png`});await p.evaluate(()=>document.querySelector('.st-x')&&document.querySelector('.st-x').click());await p.waitForTimeout(500)}
// a quiz question
await p.evaluate(()=>{localStorage.setItem('mfm-quiz-me',JSON.stringify({nick:'QC',branch:'MFM Dallas',guest:false}))});await p.evaluate(()=>window.PG.start('quiz'));await p.waitForTimeout(1500);await p.screenshot({path:`${n}-zq.png`});
const lv=await p.$('[data-lv],.lv-opt');if(lv){await lv.click().catch(()=>{});await p.waitForTimeout(1500);await p.screenshot({path:`${n}-zq2.png`})}
}
await b.close()})();
