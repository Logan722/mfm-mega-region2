const { chromium } = require('playwright');
const B=process.env.B||'http://localhost:8091';const ext=process.env.B?'':'.html';
(async()=>{const b=await chromium.launch();
for (const [w,h,tag] of [[1440,900,'d'],[390,844,'m']]){
 const ctx=await b.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(B+'/preview-home'+ext,{waitUntil:'load'});await p.waitForTimeout(1500);
 await p.evaluate(()=>{document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')});
 await p.waitForTimeout(2500);
 await p.evaluate(()=>{const x=document.querySelector('.mfm-pop-backdrop');if(x)x.remove();document.documentElement.style.overflow='';document.body.style.overflow='';});
 for (const [sel,n] of [['.today','today'],['#new-here','prepared'],['.dark-section','events'],['.location-call','church'],['.htesti','testi'],['.site-footer','footer']]){
   const el=p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(500); await el.screenshot({path:`v3-${n}-${tag}.png`});}
 const ow=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(ow>1)errs.push('overflow '+ow);
 await p.fill('#cs-q','Tampa');await p.press('#cs-q','Enter');await p.waitForTimeout(1500);
 console.log(tag,'search ->',p.url(), (await p.textContent('#locCount').catch(()=>'')).trim());
 console.log(tag,'errors',JSON.stringify(errs));await ctx.close();}
await b.close();})();
