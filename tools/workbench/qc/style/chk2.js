const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8093/ministries.html');await p.waitForTimeout(1200);
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('main > *, body > section')].slice(0,6).map(e=>{const s=getComputedStyle(e);const r=e.getBoundingClientRect();return [e.tagName,e.className,Math.round(r.top+scrollY),Math.round(r.height),s.paddingTop,s.paddingBottom,s.marginTop,s.marginBottom]}))));
await p.goto('http://localhost:8093/index.html');await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(()=>{const e=[...document.querySelectorAll('*')].find(x=>x.textContent.trim()==='Latest album');let c=e;for(let i=0;i<3;i++)c=c.parentElement;return [c.outerHTML.slice(0,900)]})));
await b.close();})();
