const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();p.on('response',r=>{if(r.status()>=400)console.log(r.status(),r.url())});
await p.goto('http://localhost:8093/play.html');await p.waitForTimeout(2500);await b.close();})();
