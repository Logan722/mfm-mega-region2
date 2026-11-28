const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8093/play.html');await p.waitForTimeout(1500);
for(const pk of ['messages','mfm','go-books']){await p.locator(`.pg-games [data-pack="${pk}"]`).click();await p.waitForTimeout(700);
 if(await p.locator('.st-skip').count()){await p.locator('.st-skip').first().click();await p.waitForTimeout(900);}
 const qs=[];for(let i=0;i<10;i++){qs.push(await p.locator('#play-app .st-question').textContent());await p.locator('#play-app .ans').first().click();await p.waitForTimeout(120);if(pk==='messages'&&i===0)await p.screenshot({path:'cmp/c-msg-m.png'});await p.locator('.st-next').click();await p.waitForTimeout(120);}
 console.log(pk,new Set(qs).size,'|',qs.slice(0,3).map(x=>x.slice(0,70)).join(' || '));await p.waitForTimeout(400);await p.locator('.st-x').click();await p.waitForTimeout(300);}
console.log('errs',JSON.stringify(errs));await b.close();})();
