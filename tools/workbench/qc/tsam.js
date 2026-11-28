const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});await p.goto('http://localhost:8093/index.html');await p.waitForTimeout(1200);
await p.evaluate(()=>{document.querySelectorAll('.pv-menu,.skip-link,#siteNav,[data-mfm-header]').forEach(e=>e.style.display='none');document.querySelectorAll('[class*="nl-"]').forEach(e=>{if(getComputedStyle(e).position==='fixed')e.remove()})});
const l=p.locator('section.tsa');await l.scrollIntoViewIfNeeded();await l.screenshot({path:'/mnt/user-data/outputs/home-testimonies-phone.jpg',type:'jpeg',quality:86});await b.close();})();
