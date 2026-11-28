const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});const errs=[];
await p.addInitScript(()=>{document.addEventListener('securitypolicyviolation',e=>{(window.__csp=window.__csp||[]).push(e.violatedDirective+' '+e.blockedURI)})});
p.on('pageerror',e=>errs.push(e.message));const req=[];p.on('request',r=>{if(/quiz/.test(r.url()))req.push(r.url().replace('http://localhost:8095',''))});
await p.goto('http://localhost:8095/play.html');await p.waitForTimeout(1500);
await p.locator('.pg-games [data-mode="quiz"]').click();await p.waitForTimeout(400);await p.locator('.st-skip').first().click();await p.waitForTimeout(300);
if(await p.locator('.tp-chip.mix[aria-pressed=false]').count())await p.locator('.tp-chip.mix').click();await p.locator('.st-go').click();await p.waitForTimeout(2000);
for(let i=0;i<10;i++){await p.locator('#play-app .ans').first().click();await p.waitForTimeout(100);await p.locator('.st-next').click();await p.waitForTimeout(100);}
await p.keyboard.press('Escape');await p.waitForTimeout(300);
await p.locator('.pg-games [data-mode="word"]').click();await p.waitForTimeout(1500);await p.keyboard.press('Escape');
await p.locator('.pg-games [data-mode="blitz"]').click();await p.waitForTimeout(1500);await p.keyboard.press('Escape');
console.log('requests',req.join(' '));console.log('csp',JSON.stringify(await p.evaluate(()=>window.__csp||[])),'errs',JSON.stringify(errs));await b.close();})();
