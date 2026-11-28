const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for(const [w,h,t] of [[390,844,'phone'],[360,780,'small']]){const c=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await c.newPage();
 for(const v of ['a','b','c']){await p.goto('http://localhost:8093/index.html#mv-'+v);await p.reload();await p.waitForTimeout(1600);
  await p.evaluate(()=>{document.querySelectorAll('.skip-link').forEach(e=>e.remove());document.querySelectorAll('#siteNav,[data-mfm-header]').forEach(e=>e.style.visibility='hidden');document.querySelectorAll('[class*="nl-"]').forEach(e=>{if(getComputedStyle(e).position==='fixed')e.remove()})});
  const s=p.locator('section.tsa');await s.scrollIntoViewIfNeeded();await p.waitForTimeout(300);await s.screenshot({path:`/home/claude/qc/P-tsa-${v}-${t}.jpg`,type:'jpeg',quality:85});
  if(v=='a'){const mb=p.locator('section.media-band');await mb.scrollIntoViewIfNeeded();await p.waitForTimeout(300);const bb=await mb.boundingBox();console.log('media box',bb);await mb.screenshot({path:`/home/claude/qc/P-media-${t}.jpg`,type:'jpeg',quality:85});}
  console.log(t,v,await p.evaluate(()=>[...document.querySelectorAll('.tsa h3')].map(h=>getComputedStyle(h).fontSize+' '+getComputedStyle(h).whiteSpace+' '+(h.scrollWidth>h.clientWidth+1?'OVER':'ok'))));}
 await c.close();}
await b.close();})();
