const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
for (const f of ['women.html','women-1.html']){
await p.goto('http://localhost:8093/'+f,{waitUntil:'networkidle'});
console.log(f, await p.evaluate(()=>{const s=document.querySelector('.ministry-feed');if(!s)return 'none';const cs=getComputedStyle(s);return [cs.display,s.getBoundingClientRect().height,s.hidden,s.outerHTML.slice(0,300)];}));}
await b.close();})();
