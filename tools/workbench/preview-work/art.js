const { chromium } = require('playwright');
const B=process.env.B||'http://localhost:8093';
(async()=>{const b=await chromium.launch();
for (const [w,h,tag] of [[1536,730,'d'],[390,844,'m']]){
 const ctx=await b.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();const errs=[];const bad=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url())});
 await p.goto(B+'/index.html',{waitUntil:'load'});await p.waitForTimeout(1500);
 await p.evaluate(()=>{document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');document.documentElement.style.scrollBehavior='auto'});
 await p.waitForTimeout(3000);
 const dot0=await p.evaluate(()=>[...document.querySelectorAll('.sp-dots button')].findIndex(b=>b.classList.contains('active')));
 await p.evaluate(()=>{const x=document.querySelector('.mfm-pop-backdrop');if(x)x.remove();document.documentElement.style.overflow='';document.body.style.overflow='';document.querySelectorAll('body *').forEach(x=>{const ps=getComputedStyle(x).position;if(ps==='fixed'||ps==='sticky')x.style.visibility='hidden'})});
 for (const [sel,n] of [['.home-hero','hero'],['.today','today'],['#new-here','visit'],['.ev2','events'],['.location-call','church'],['.home-gallery','gallery'],['.media-band','watch'],['.tsa','testi'],['.site-footer','footer']]){
   const el=p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(500); await el.screenshot({path:`cmp/art-${n}-${tag}.png`});}
 await p.waitForTimeout(6500);
 const dot1=await p.evaluate(()=>[...document.querySelectorAll('.sp-dots button')].findIndex(b=>b.classList.contains('active')));
 const info=await p.evaluate(()=>({ow:document.documentElement.scrollWidth-innerWidth,h2:(()=>{const e=document.querySelector('#new-here h2');return [e.textContent,e.getClientRects().length,Math.round(e.getBoundingClientRect().height)]})(), imgsBroken:[...document.querySelectorAll('img')].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src')).slice(0,8)}));
 console.log(tag,'autoplay',dot0,'->',dot1,JSON.stringify(info));
 console.log(tag,'errors',JSON.stringify(errs),'bad',JSON.stringify(bad.filter(u=>!u.includes('netlify/functions')).slice(0,10)));await ctx.close();}
await b.close();})();
