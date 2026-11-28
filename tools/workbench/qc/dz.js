const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const files=process.argv.slice(2);
for(const f of files){for(const [w,h,t] of [[1440,900,'d'],[390,844,'m']]){const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8093/'+f);await p.waitForTimeout(1500);
await p.evaluate(()=>document.querySelectorAll('[class*="nl-"]').forEach(e=>{if(getComputedStyle(e).position==='fixed')e.remove()}));
const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
await p.screenshot({path:`dz-${f.replace(/[.#]/g,'_')}-${t}.png`,fullPage:true});console.log(f,t,'ov',ov,errs.slice(0,2));await p.close();}}
await b.close();})();
