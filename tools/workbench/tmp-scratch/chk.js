const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8093/testimonies.html');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>[...document.querySelectorAll('.tsa-feat *')].slice(0,6).map(e=>{const s=getComputedStyle(e);return [e.className,e.tagName,e.textContent.trim().slice(0,30),s.color,s.fontSize,s.backgroundColor]}));
console.log(JSON.stringify(r,null,1));await b.close();})();
