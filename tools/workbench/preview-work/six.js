const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const [w,h,t] of [[1536,860,'d'],[390,844,'m']]){
 const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:t==='m'?2:1});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8093/play.html',{waitUntil:'load'});await p.waitForTimeout(1500);
 await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelectorAll('body *').forEach(x=>{const ps=getComputedStyle(x).position;if(ps==='fixed'||ps==='sticky')x.dataset.hid=1,x.style.visibility='hidden'})});
 const el=p.locator('.pg-games');await el.scrollIntoViewIfNeeded();await p.waitForTimeout(700);await el.screenshot({path:`cmp/six-${t}.png`});
 console.log(t,'overflow',await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth));
 await p.evaluate(()=>{document.querySelectorAll('[data-hid]').forEach(x=>x.style.visibility='')});
 // quiz: single topic MFM
 await p.locator('.pg-games [data-mode="quiz"]').click();await p.waitForTimeout(500);
 if(await p.locator('.st-skip').count()){await p.locator('.st-skip').first().click();await p.waitForTimeout(500);}
 await p.screenshot({path:`cmp/six-quizsetup-${t}.png`});
 await p.locator('.tp-chip.mix').click(); await p.locator('.tp-chip[data-tk="mfm"]').click(); await p.locator('.tp-chip[data-tk="go"]').click();
 await p.locator('.st-go').click();await p.waitForTimeout(1200);
 const packs=[];for(let i=0;i<10;i++){packs.push(await p.locator('#play-app .st-pack').textContent());if(i===0)await p.screenshot({path:`cmp/six-quizq-${t}.png`});await p.locator('#play-app .ans').first().click();await p.waitForTimeout(120);await p.locator('.st-next').click();await p.waitForTimeout(120);}
 console.log(t,'quiz mfm+go packs',packs.join(','));await p.waitForTimeout(500);await p.locator('.st-x').click();await p.waitForTimeout(300);
 // quiz mix
 await p.locator('.pg-games [data-mode="quiz"]').click();await p.waitForTimeout(400);await p.locator('.tp-chip.mix').click();await p.locator('.st-go').click();await p.waitForTimeout(1500);
 const p2=[];for(let i=0;i<10;i++){p2.push(await p.locator('#play-app .st-pack').textContent());await p.locator('#play-app .ans').first().click();await p.waitForTimeout(120);await p.locator('.st-next').click();await p.waitForTimeout(120);}
 console.log(t,'quiz mix packs',p2.join(','));await p.waitForTimeout(500);await p.locator('.st-x').click();await p.waitForTimeout(300);
 // team
 await p.locator('.pg-games [data-mode="team"]').click();await p.waitForTimeout(500);await p.screenshot({path:`cmp/six-teamsetup-${t}.png`});
 await p.locator('.st-team label:has(input[name=per][value="3"])').click();await p.click('.st-team .pg-btn.xl');await p.waitForTimeout(1500);
 const p3=[];for(let i=0;i<6;i++){await p.locator('.tm-pass .pg-btn').click();await p.waitForTimeout(200);p3.push(await p.locator('#play-app .st-pack').textContent());await p.locator('#play-app .ans').first().click();await p.waitForTimeout(150);await p.locator('.st-next').click();await p.waitForTimeout(200);}
 console.log(t,'team packs',p3.join(','));await p.waitForTimeout(800);await p.locator('.st-x').click();await p.waitForTimeout(300);
 // blitz: find a statement with an answer line
 await p.locator('.pg-games [data-mode="blitz"]').click();await p.waitForTimeout(1500);
 for(let i=0;i<25;i++){ if(await p.locator('.bz-a').count()){await p.screenshot({path:`cmp/six-blitz-${t}.png`});break;} await p.keyboard.press('t');await p.waitForTimeout(100);}
 console.log(t,'errs',JSON.stringify(errs));await ctx.close();}
await b.close();})();
