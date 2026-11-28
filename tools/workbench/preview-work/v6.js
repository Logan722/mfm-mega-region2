const { chromium } = require('playwright');
const B='http://localhost:8093';
(async()=>{const b=await chromium.launch();
async function open(w,h){const ctx=await b.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();await p.route('**/newsletter-popup-preview.js',r=>r.abort());const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(B+'/index.html',{waitUntil:'load'});await p.waitForTimeout(1500);
 await p.evaluate(()=>{const x=document.querySelector('.mfm-pop-backdrop');if(x)x.remove();document.documentElement.style.overflow='';document.body.style.overflow='';document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');document.documentElement.style.scrollBehavior='auto'});
 await p.waitForTimeout(1500);return {ctx,p,errs};}
// hero designs, desktop
{const {ctx,p,errs}=await open(1536,730);
 for(let d=1;d<=5;d++){await p.click(`[data-pick="${d}"]`);await p.waitForTimeout(400);await p.screenshot({path:`cmp/hero-d${d}.png`});}
 const info=await p.evaluate(()=>{const r=e=>e?e.getBoundingClientRect():null;const pl=r(document.querySelector('.hb-play')),bx=r(document.querySelector('.hbox'));return {play:pl&&[pl.left|0,pl.top|0,pl.width|0],playHidden:document.querySelector('.hb-play').hidden,box:bx&&[bx.left|0,bx.top|0,bx.width|0,bx.height|0]}});
 console.log('desk',JSON.stringify(info),'errs',JSON.stringify(errs));
 await p.click('[data-pick="2"]');
 await p.evaluate(()=>document.querySelectorAll('body *').forEach(x=>{const ps=getComputedStyle(x).position;if(ps==='fixed'||ps==='sticky')x.style.visibility='hidden'}));
 for (const [sel,n] of [['.today','today'],['#new-here','visit'],['.media-band','watch'],['.site-footer','footer']]){const el=p.locator(sel).first();await el.scrollIntoViewIfNeeded();await p.waitForTimeout(400);await el.screenshot({path:`cmp/v6-${n}-d.png`});}
 await ctx.close();}
{const {ctx,p}=await open(1024,768);await p.click('[data-pick="2"]');await p.waitForTimeout(300);await p.screenshot({path:'cmp/hero-tablet.png'});await ctx.close();}
{const {ctx,p,errs}=await open(390,844);await p.screenshot({path:'cmp/hero-m.png'});
 await p.evaluate(()=>document.querySelectorAll('body *').forEach(x=>{const ps=getComputedStyle(x).position;if(ps==='fixed'||ps==='sticky')x.style.visibility='hidden'}));
 for (const [sel,n] of [['.today','today'],['#new-here','visit'],['.location-call','church'],['.media-band','watch'],['.site-footer','footer']]){const el=p.locator(sel).first();await el.scrollIntoViewIfNeeded();await p.waitForTimeout(400);await el.screenshot({path:`cmp/v6-${n}-m.png`});}
 const ow=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);console.log('mobile ow',ow,'errs',JSON.stringify(errs));await ctx.close();}
await b.close();})();
