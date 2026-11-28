const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for(const [w,h,t] of [[390,844,'phone'],[360,780,'small']]){const c=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8093/index.html');await p.waitForTimeout(1600);
 await p.evaluate(()=>{document.querySelectorAll('.skip-link').forEach(e=>e.remove());document.querySelectorAll('[class*="nl-"]').forEach(e=>{if(getComputedStyle(e).position==='fixed')e.remove()})});
 const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 const hide=()=>p.evaluate(()=>document.querySelectorAll('#siteNav,[data-mfm-header]').forEach(e=>e.style.visibility='hidden'));
 await hide();
 const mb=p.locator('section.media-band');await mb.scrollIntoViewIfNeeded();await mb.screenshot({path:`/home/claude/qc/P-media-${t}.jpg`,type:'jpeg',quality:85});
 const wg=await p.evaluate(()=>{const h=document.getElementById('rf-latest-title');return h.textContent+' '+getComputedStyle(h).fontSize+' cls='+h.className});
 for(const v of ['a','b','c']){await p.evaluate(v=>{document.querySelector('.tsa').setAttribute('data-mv',v);window.dispatchEvent(new Event('resize'))},v);await p.waitForTimeout(400);
  const s=p.locator('section.tsa');await s.scrollIntoViewIfNeeded();await s.screenshot({path:`/home/claude/qc/P-tsa-${v}-${t}.jpg`,type:'jpeg',quality:85});}
 await p.evaluate(()=>{document.querySelector('.tsa').setAttribute('data-mv','a')});
 const f=p.locator('footer');await f.scrollIntoViewIfNeeded();await f.screenshot({path:`/home/claude/qc/P-foot-${t}.jpg`,type:'jpeg',quality:85});
 await p.evaluate(()=>document.querySelectorAll('#siteNav,[data-mfm-header]').forEach(e=>e.style.visibility=''));
 await p.screenshot({path:`/home/claude/qc/P-home-full-${t}.jpg`,type:'jpeg',quality:70,fullPage:true});
 console.log(t,'ov',ov,wg,errs);
 for(const pg of ['play.html','testimonies.html','reach-out.html#prayer']){await p.goto('http://localhost:8093/'+pg);await p.waitForTimeout(1500);await p.evaluate(()=>document.querySelectorAll('[class*="nl-"]').forEach(e=>{if(getComputedStyle(e).position==='fixed')e.remove()}));
  console.log(pg,'ov',await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth));await p.screenshot({path:`/home/claude/qc/P-${pg.split('.')[0]}-${t}.jpg`,type:'jpeg',quality:70,fullPage:true});}
 await c.close();}
await b.close();})();
