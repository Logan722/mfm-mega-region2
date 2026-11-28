const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8093/play.html');await p.waitForTimeout(1200);
await p.locator('[data-mode="story"]').first().click();await p.waitForTimeout(600);await p.locator('[data-story="joseph"]').click();await p.waitForTimeout(400);
const h=await p.locator('#play-app a.pg-btn').first().getAttribute('href');console.log('chapter href',h);
await p.locator('#play-app a.pg-btn').first().click();await p.waitForLoadState('load');await p.waitForTimeout(600);console.log('url',p.url(),'back',await p.getAttribute('#backl','href'));
await p.click('#start');await p.waitForTimeout(3000);await p.screenshot({path:'art-story.png'});
console.log('errors',JSON.stringify(errs));await b.close()})();
