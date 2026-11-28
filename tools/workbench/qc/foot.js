const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const url=process.argv[2]||'index.html',tag=process.argv[3]||'cur';for(const [w,h,t] of [[1440,900,'d'],[390,844,'m']]){const p=await b.newPage({viewport:{width:w,height:h}});await p.goto('http://localhost:8095/'+url);await p.waitForTimeout(1000);
await p.evaluate(()=>document.querySelectorAll('[class*="nl-"]').forEach(e=>{if(getComputedStyle(e).position==='fixed')e.remove()}));
await p.locator('footer').screenshot({path:`foot-${tag}-${t}.png`});await p.close();}await b.close();})();
