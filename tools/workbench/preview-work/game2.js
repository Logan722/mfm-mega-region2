const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const [w,h,t] of [[1536,860,'d'],[390,844,'m']]){
 const ctx=await b.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('http://localhost:8093/play.html',{waitUntil:'load'});await p.waitForTimeout(2500);
 await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'});
 await p.screenshot({path:`cmp/p2-hero-${t}.png`});
 await p.evaluate(()=>document.querySelectorAll('body *').forEach(x=>{if(x.closest('#play-app'))return;const ps=getComputedStyle(x).position;if(ps==='fixed'||ps==='sticky')x.style.visibility='hidden'}));
 for (const [sel,n] of [['.pg-games','games'],['.pg-how','how'],['.pg-board','board']]){const el=p.locator(sel);await el.scrollIntoViewIfNeeded();await p.waitForTimeout(400);await el.screenshot({path:`cmp/p2-${n}-${t}.png`});}
 const ow=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 await p.evaluate(()=>{document.querySelectorAll('body *').forEach(x=>x.style.visibility='');window.scrollTo(0,0)});
 await p.locator('.pg-ctas [data-mode="daily"]').click();await p.waitForTimeout(500);
 await p.screenshot({path:`cmp/p2-who-${t}.png`});
 await p.fill('.st-form input[name=nick]','Grace Ade');await p.selectOption('.st-form select',{index:3});await p.click('.st-form .pg-btn');await p.waitForTimeout(1600);
 await p.screenshot({path:`cmp/p2-q-${t}.png`});
 for(let i=0;i<5;i++){const sel=i===1?'#play-app .ans:not([data-oi="0"])':'#play-app .ans[data-oi="0"]';await p.locator(sel).first().click();await p.waitForTimeout(i===0?350:300);
   if(i===0)await p.screenshot({path:`cmp/p2-right-${t}.png`});
   if(i===1)await p.screenshot({path:`cmp/p2-wrong-${t}.png`});
   if(i===2){await p.waitForTimeout(10)}
   await p.locator('.st-next').click();await p.waitForTimeout(i===2?1200:400);
   if(i===2)await p.screenshot({path:`cmp/p2-combo-${t}.png`});}
 await p.waitForTimeout(1600);await p.screenshot({path:`cmp/p2-results-${t}.png`});
 const resFull=await p.evaluate(()=>document.getElementById('play-app').scrollHeight);
 await p.locator('.st-board').click();await p.waitForTimeout(1200);await p.screenshot({path:`cmp/p2-afterboard-${t}.png`});
 console.log(t,'overflow',ow,'resultsH',resFull,'errs',JSON.stringify(errs));await ctx.close();}
await b.close();})();
