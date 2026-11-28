const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for(const [w,h,t] of [[1440,900,'d'],[390,844,'m']]){const c=await b.newContext({viewport:{width:w,height:h}});const p=await c.newPage();
await p.goto('http://localhost:8095/reach-out.html?subject=prayer');await p.waitForTimeout(1500);
await p.evaluate(()=>document.querySelectorAll('[class*="nl-"]').forEach(e=>{if(getComputedStyle(e).position==='fixed')e.remove()}));
await p.screenshot({path:`live-ro-${t}.png`});
console.log(t, await p.locator('#reach-out h2').first().innerText(),'|',await p.evaluate(()=>{const s=document.querySelector('#reach-out select');return s.options[s.selectedIndex].text}));await c.close();}
await b.close();})();
