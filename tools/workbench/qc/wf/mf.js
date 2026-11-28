const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const n of [1,2,3,4,5]) for (const [vw,mob] of [[1440,false],[390,true]]){
const c=await b.newContext({viewport:{width:vw,height:900},isMobile:mob});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(`http://localhost:8093/media.html`,{waitUntil:'networkidle'});
const vis=()=>p.evaluate(()=>[...document.querySelectorAll('#mGrid .message-card')].filter(c=>c.offsetParent).length);
const a=await vis();
await p.locator('.quick-filter-row button[data-topic="Deliverance"]').click();await p.waitForTimeout(500);const bb=await vis();const cnt=await p.textContent('#mCount');
await p.locator('#mClear').click();await p.fill('#mQ','olukoya');await p.waitForTimeout(700);const cc=await vis();
const sw=await p.evaluate(()=>document.documentElement.scrollWidth);
console.log(n,vw,'latest',a,'deliv',bb,JSON.stringify(cnt),'search',cc,'sw',sw,errs.join('|'));await c.close();}
await b.close();})();
