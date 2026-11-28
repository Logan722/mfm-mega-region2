const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const jobs=[['live.html','#lvGrid','live'],['about.html','.values-grid','values'],['ministries.html','section.ministry-grid','ministries'],['index.html','section.home-gallery','albums']];
for(const [u,sel,k] of jobs){const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('http://localhost:8093/'+u);await p.waitForTimeout(1800);
 await p.evaluate(()=>{document.querySelectorAll('.skip-link').forEach(e=>e.remove());document.querySelectorAll('#siteNav,[data-mfm-header],.site-nav').forEach(e=>e.style.visibility='hidden');document.querySelectorAll('[class*="nl-"]').forEach(e=>{if(getComputedStyle(e).position==='fixed')e.remove()});document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')});
 await p.waitForTimeout(800);const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 const el=p.locator(sel).first();await el.scrollIntoViewIfNeeded();await p.waitForTimeout(400);await el.screenshot({path:`/home/claude/qc/K-${k}.png`});console.log(k,'ov',ov,errs.slice(0,2));await p.close();}
await b.close();})();
