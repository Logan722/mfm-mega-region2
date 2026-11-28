const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const [vw,mob] of [[1440,false],[390,true]]){
const c=await b.newContext({viewport:{width:vw,height:900},isMobile:mob});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8093/media.html',{waitUntil:'networkidle'});
const vis=()=>p.evaluate(()=>[...document.querySelectorAll('#mGrid .message-card')].filter(c=>c.offsetParent).length);
const a=await vis(); const total=await p.evaluate(()=>document.querySelectorAll('#mGrid .message-card').length);
if(mob) await p.click('.mf-toggle');
await p.locator('.quick-filter-row button[data-topic="Deliverance"]').click();await p.waitForTimeout(500);const bb=await vis();
const pls=await p.evaluate(()=>document.querySelectorAll('#mPlaylist option').length-1);
const broken=await p.evaluate(()=>[...document.images].filter(i=>i.complete&&!i.naturalWidth&&i.offsetParent).length);
console.log(vw,'total',total,'latest',a,'deliverance',bb,'playlists',pls,'broken',broken,errs.join('|'));await c.close();}
await b.close();})();
