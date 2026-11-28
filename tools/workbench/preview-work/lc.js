const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.goto('http://localhost:8093/index.html',{waitUntil:'load'});await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(()=>{const r=e=>{const x=e.getBoundingClientRect();return [Math.round(x.left),Math.round(x.right)]};const s=document.querySelector('.location-call');return {sec:r(s),kids:[...s.querySelectorAll('div,p,form,h2')].map(e=>e.tagName+'.'+e.className+':'+r(e)).slice(0,10),pad:getComputedStyle(s).padding, w:getComputedStyle(s).width}})));
await p.locator('.location-call').scrollIntoViewIfNeeded();await p.screenshot({path:'cmp/lc-m.png'});await b.close();})();
