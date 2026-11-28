const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:2});const p=await c.newPage();await p.goto('http://localhost:8093/index.html');await p.waitForTimeout(1800);
await p.evaluate(()=>{document.querySelectorAll('.skip-link').forEach(e=>e.remove());document.querySelectorAll('#siteNav,[data-mfm-header]').forEach(e=>e.style.visibility='hidden');document.querySelectorAll('[class*="nl-"]').forEach(e=>{if(getComputedStyle(e).position==='fixed')e.remove()})});
const s=p.locator('.ev2-head');await s.scrollIntoViewIfNeeded();await s.screenshot({path:'/home/claude/qc/P-ev2.jpg',type:'jpeg',quality:80});
console.log(await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth));await b.close();})();
