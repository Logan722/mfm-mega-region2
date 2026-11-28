const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const [w,h,t] of [[1536,860,'d'],[390,844,'m']]){
 const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:t==='m'?2:1});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8093/play.html',{waitUntil:'load'});await p.waitForTimeout(1500);
 await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelectorAll('body *').forEach(x=>{const ps=getComputedStyle(x).position;if(ps==='fixed'||ps==='sticky')x.style.visibility='hidden'})});
 for(const c of ['all','quick','bible','ministry','together']){await p.locator(`[data-gcat="${c}"]`).click();await p.waitForTimeout(800);const el=p.locator('.pg-games');await el.scrollIntoViewIfNeeded();await el.screenshot({path:`cmp/c-${c}-${t}.png`});
  const ow=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(ow>0)console.log('overflow',t,c,ow);}
 await p.locator('[data-gcat="all"]').click();
 await p.evaluate(()=>document.querySelectorAll('body *').forEach(x=>x.style.visibility=''));
 for(const pk of ['mfm','go-books']){await p.locator(`.pg-games [data-pack="${pk}"]`).click();await p.waitForTimeout(600);
  if(await p.locator('.st-skip').count()) {await p.locator('.st-skip').first().click();await p.waitForTimeout(900);}
  const qs=[];for(let i=0;i<10;i++){qs.push(await p.locator('#play-app .st-question').textContent());await p.locator('#play-app .ans').first().click();await p.waitForTimeout(150);if(i===0)await p.screenshot({path:`cmp/c-${pk}-${t}.png`});await p.locator('.st-next').click();await p.waitForTimeout(150);}
  console.log(t,pk,new Set(qs).size,qs[0].slice(0,80));await p.waitForTimeout(500);await p.locator('.st-x').click();await p.waitForTimeout(400);}
 console.log(t,'errs',JSON.stringify(errs));await ctx.close();}
await b.close();})();
