const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8093/index.html');await p.waitForTimeout(1000);
await p.evaluate(()=>document.querySelector('.hg-big').scrollIntoView());await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(()=>{const i=document.querySelector('.hg-big img');const s=getComputedStyle(i);const r=i.getBoundingClientRect();return [i.currentSrc,i.complete,i.naturalWidth,r.width,r.height,s.opacity,s.display,s.position,getComputedStyle(i.parentElement).height]})));
await b.close();})();
