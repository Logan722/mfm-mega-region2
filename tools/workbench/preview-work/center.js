const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const [w,h,t] of [[1536,860,'d'],[390,844,'m']]){
 const ctx=await b.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8093/play.html',{waitUntil:'load'});await p.waitForTimeout(1200);
 const gap=async(n)=>{const g=await p.evaluate(()=>{const s=document.getElementById('play-app');const top=s.querySelector('.st-top').getBoundingClientRect().bottom;const kids=[...s.querySelector('.st-body').children].filter(x=>!x.hidden&&x.getBoundingClientRect().height>0);const a=Math.min(...kids.map(k=>k.getBoundingClientRect().top)),z=Math.max(...kids.map(k=>k.getBoundingClientRect().bottom));return {above:Math.round(a-top),below:Math.round(innerHeight-z),sh:s.scrollHeight>innerHeight+2}});console.log(t,n,JSON.stringify(g));await p.screenshot({path:`cmp/ctr-${n}-${t}.png`});};
 await p.locator('.pg-games [data-mode="quiz"]').click();await p.waitForTimeout(500);await gap('who');
 await p.locator('.st-skip').first().click();await p.waitForTimeout(500);await gap('quizsetup');
 await p.locator('.st-go').click();await p.waitForTimeout(1400);await gap('question');
 await p.locator('#play-app .ans').first().click();await p.waitForTimeout(400);await gap('answer');
 for(let i=0;i<10;i++){await p.locator('.st-next').click();await p.waitForTimeout(150);if(i<9){await p.locator('#play-app .ans').first().click();await p.waitForTimeout(120);}}
 await p.waitForTimeout(1200);await gap('results');
 await p.locator('[data-try]').click();await p.waitForTimeout(400);await gap('challenge');
 await p.locator('.st-x').click();await p.waitForTimeout(300);
 await p.locator('.pg-games [data-mode="blitz"]').click();await p.waitForTimeout(1500);await gap('blitz');
 await p.locator('.st-x').click();await p.waitForTimeout(300);
 await p.locator('.pg-games [data-mode="word"]').click();await p.waitForTimeout(1500);await gap('word');
 await p.locator('.st-x').click();await p.waitForTimeout(300);
 await p.locator('.pg-games [data-mode="team"]').click();await p.waitForTimeout(500);await gap('teamsetup');
 await p.click('.st-team .pg-btn.xl');await p.waitForTimeout(1500);await gap('teampass');
 console.log(t,'errs',JSON.stringify(errs));await ctx.close();}
await b.close();})();
