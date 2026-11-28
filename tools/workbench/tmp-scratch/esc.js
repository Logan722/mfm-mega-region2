const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:8093/about.html',{waitUntil:'networkidle'});
await p.click('[data-ld-open="ab-ld-2"]');await p.waitForTimeout(300);
await p.keyboard.press('Escape');await p.waitForTimeout(300);
console.log(await p.evaluate(()=>({open:document.getElementById('ab-ld-2').open, ae:document.activeElement.outerHTML.slice(0,80)})));
await p.click('[data-ld-open="ab-ld-0"]');await p.waitForTimeout(300);await p.click('#ab-ld-0 [data-ld-close]');await p.waitForTimeout(300);
console.log(await p.evaluate(()=>({open:document.getElementById('ab-ld-0').open, ae:document.activeElement.outerHTML.slice(0,80)})));
await b.close();})();
