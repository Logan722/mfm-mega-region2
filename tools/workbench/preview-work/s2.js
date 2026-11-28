const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('https://mfmmegaregion2usa.org/preview-home');await p.waitForTimeout(800);
await p.fill('#cs-q','Tampa');await p.press('#cs-q','Enter');await p.waitForTimeout(2500);
console.log(p.url(), (await p.textContent('#locCount')).trim());
await p.goto('https://mfmmegaregion2usa.org/branches?q=75081');await p.waitForTimeout(2000);console.log((await p.textContent('#locCount')).trim());
console.log('errors',JSON.stringify(errs));await b.close();})();
