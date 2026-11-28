const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const [w,h,t] of [[1536,820,'d'],[390,844,'m']]){
 const ctx=await b.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8093/play.html',{waitUntil:'load'});await p.waitForTimeout(2000);
 await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelectorAll('body *').forEach(x=>{const ps=getComputedStyle(x).position;if(ps==='fixed'||ps==='sticky')x.style.visibility='hidden'})});
 await p.screenshot({path:`cmp/g-1-top-${t}.png`});
 await p.evaluate(()=>document.querySelector('[data-mode="daily"]').click());await p.waitForTimeout(600);
 const app=p.locator('#play-top');await app.scrollIntoViewIfNeeded();await app.screenshot({path:`cmp/g-2-who-${t}.png`});
 await p.fill('input[name=nick]','Grace');await p.selectOption('select[name=branch]',{index:3});await p.click('.qz-whof .qz-btn');await p.waitForTimeout(600);
 await p.locator('#play-top').screenshot({path:`cmp/g-3-question-${t}.png`});
 for(let i=0;i<5;i++){await p.locator(i===1?'.qz-opt:not([data-oi="0"])':'.qz-opt[data-oi="0"]').first().click();await p.waitForTimeout(400);
   if(i===0)await p.locator('#play-top').screenshot({path:`cmp/g-4-answer-${t}.png`});
   const nb=p.locator('.qz-next').first();if(await nb.count())await nb.click();await p.waitForTimeout(400);}
 await p.waitForTimeout(600);await p.locator('#play-top').screenshot({path:`cmp/g-5-results-${t}.png`});
 const lb=p.locator('#leaderboard');await lb.scrollIntoViewIfNeeded();await p.waitForTimeout(400);await lb.screenshot({path:`cmp/g-6-leaderboard-${t}.png`});
 await p.screenshot({path:`cmp/g-full-${t}.png`,fullPage:true});
 console.log(t,'errs',JSON.stringify(errs));await ctx.close();}
await b.close();})();
