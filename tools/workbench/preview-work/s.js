const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('http://localhost:8091/preview-home.html');await p.waitForTimeout(500);
await p.fill('#cs-q','Tampa');await p.press('#cs-q','Enter');await p.waitForTimeout(1500);
console.log(p.url(), (await p.textContent('#locCount').catch(()=>'')).trim());await b.close();})();
