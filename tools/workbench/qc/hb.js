const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();for(const [w,h,t] of [[1440,900,'d'],[390,844,'m']]){const c=await b.newContext({viewport:{width:w,height:h}});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8095/index.html');await p.waitForTimeout(2000);
console.log(t,await p.locator('[data-hbox]').innerText(),errs);await p.locator('section.home-hero').screenshot({path:'live-hero-'+t+'.png'});await c.close();}await b.close();})();
