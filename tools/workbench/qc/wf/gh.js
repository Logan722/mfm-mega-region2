const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},isMobile:true});const p=await c.newPage();
await p.goto('http://localhost:8093/gen218.html',{waitUntil:'networkidle'});
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.gm-more .message-card')].map(e=>{const d=e.querySelector(':scope>div');const cs=getComputedStyle(e);return [Math.round(e.getBoundingClientRect().height),Math.round(d.getBoundingClientRect().height),cs.minHeight,cs.display,getComputedStyle(e.parentElement).alignItems]}))));await b.close();})();
