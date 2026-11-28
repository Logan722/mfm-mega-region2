const { chromium } = require('playwright');
const B=process.env.B||'http://localhost:8091';const ext=process.env.B?'':'.html';
(async()=>{const b=await chromium.launch();
for (const [w,h,tag] of [[1536,730,'d'],[390,844,'m']]){
 const ctx=await b.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto(B+'/preview-home'+ext,{waitUntil:'load'});await p.waitForTimeout(1500);
 await p.evaluate(()=>{document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')});
 await p.waitForTimeout(2500);
 await p.evaluate(()=>{const x=document.querySelector('.mfm-pop-backdrop');if(x)x.remove();document.documentElement.style.overflow='';document.body.style.overflow='';});
 for (const [sel,n] of [['.today','today'],['.ev2','events'],['.tsa','testi']]){
   const el=p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(600); await el.screenshot({path:`v4-${n}-${tag}.png`});}
 const info=await p.evaluate(()=>({ow:document.documentElement.scrollWidth-innerWidth, qp:!!document.querySelector('.quick-paths'), cd:document.querySelector('.evx-cd')&&document.querySelector('.evx-cd').textContent.slice(0,40), slides:document.querySelectorAll('.sp-dots button').length, order:[...document.querySelectorAll('body section')].map(s=>s.className.split(' ')[0]).join(' > ')}));
 console.log(tag,JSON.stringify(info));
 console.log(tag,'errors',JSON.stringify(errs));await ctx.close();}
await b.close();})();
