const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});const bad=[];p.on('response',r=>{if(r.status()>=400&&!/live-status|latest-video/.test(r.url()))bad.push(r.status()+' '+r.url())});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8093/play.html');await p.waitForTimeout(1500);
await p.evaluate(()=>document.getElementById('leaderboard').scrollIntoView());await p.waitForTimeout(800);
console.log('empty:',await p.locator('.lb-empty').count(),'|',await p.locator('#pg-live').innerText());
await p.evaluate(()=>scrollTo(0,0));await p.locator('.pg-ctas [data-mode="daily"]').click();await p.waitForTimeout(400);
await p.fill('.st-form input[name=nick]','Dawn');await p.selectOption('.st-form select','MFM Dallas');await p.click('.st-form .pg-btn');await p.waitForTimeout(1500);
for(let i=0;i<10;i++){await p.locator('#play-app .ans').first().click();await p.waitForTimeout(90);await p.locator('.st-next').click();await p.waitForTimeout(90);}
await p.waitForTimeout(1500);console.log('note:',await p.locator('.st-lb small').innerText());
await p.locator('.st-board').click();await p.waitForTimeout(1200);console.log('board:',(await p.locator('#pg-boardview').innerText()).replace(/\s+/g,' ').slice(0,80));
await p.goto('http://localhost:8093/index.html');await p.waitForTimeout(2500);console.log('home chip:',await p.locator('[data-home-top]').innerText());
console.log('bad',JSON.stringify(bad),'errs',JSON.stringify(errs));await b.close();})();
