const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for(const [w,h,t] of [[1440,900,'d'],[390,844,'m']]){
 const c=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});const p=await c.newPage();
 await p.goto('http://localhost:8095/index.html');await p.waitForTimeout(2500);
 await p.evaluate(()=>{try{localStorage.setItem('mfm-nl-dismissed',Date.now())}catch(e){}; const m=document.querySelector('.nl-pop,.nlp,[data-nl-pop]');if(m)m.remove();});
 const s=p.locator('section.today');await s.scrollIntoViewIfNeeded();await p.waitForTimeout(600);
 await p.evaluate(()=>document.querySelectorAll('[class*="nl-"],[id*="nl-"]').forEach(e=>{if(getComputedStyle(e).position==='fixed')e.remove()}));
 await s.screenshot({path:`live-today-${t}.png`});
 console.log(t,'today:',(await p.locator('[data-today-word] .k').innerText()),'|',(await p.locator('[data-today-word] cite').innerText()));
 const mb=p.locator('section.media-band');await mb.scrollIntoViewIfNeeded();await mb.screenshot({path:`live-media-${t}.png`});
 for(const pg of ['testimonies','reach-out?subject=testimony','play']){await p.goto('http://localhost:8095/'+pg.replace('?','.html?').replace(/^(testimonies|play)$/,'$1.html'));await p.waitForTimeout(1800);
  await p.evaluate(()=>document.querySelectorAll('[class*="nl-"]').forEach(e=>{if(getComputedStyle(e).position==='fixed')e.remove()}));
  await p.screenshot({path:`live-${pg.split('?')[0]}-${t}.png`,fullPage:pg!=='play'});}
 await c.close();}
await b.close();})();
