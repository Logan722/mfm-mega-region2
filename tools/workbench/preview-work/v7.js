const { chromium } = require('playwright');
const B='http://localhost:8093';
(async()=>{const b=await chromium.launch();
async function open(w,h){const ctx=await b.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();await p.route('**/newsletter-popup-preview.js',r=>r.abort());const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(B+'/index.html',{waitUntil:'load'});await p.waitForTimeout(2500);
 await p.evaluate(()=>{document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');document.documentElement.style.scrollBehavior='auto'});await p.waitForTimeout(800);return {ctx,p,errs};}
{const {ctx,p,errs}=await open(1536,730);await p.screenshot({path:'cmp/v7-hero-d.png'});
 console.log('picker',await p.locator('.hb-pick').count(),'design',await p.getAttribute('[data-hbox]','data-d'));
 await p.evaluate(()=>document.querySelectorAll('body *').forEach(x=>{const ps=getComputedStyle(x).position;if(ps==='fixed'||ps==='sticky')x.style.visibility='hidden'}));
 const f=p.locator('.site-footer');await f.scrollIntoViewIfNeeded();await p.waitForTimeout(300);await f.screenshot({path:'cmp/v7-footer-d.png'});console.log('desk errs',JSON.stringify(errs));await ctx.close();}
{const {ctx,p,errs}=await open(390,844);
 await p.evaluate(()=>document.querySelectorAll('body *').forEach(x=>{const ps=getComputedStyle(x).position;if(ps==='fixed'||ps==='sticky')x.style.visibility='hidden'}));
 const h=await p.evaluate(()=>{const e=document.querySelector('.ev2-head h2');return [e.scrollWidth,e.clientWidth,getComputedStyle(e).fontSize]});console.log('h2',JSON.stringify(h));
 const ev=p.locator('.ev2');await ev.scrollIntoViewIfNeeded();
 for(let i=0;i<8;i++){await p.waitForTimeout(700);const r=await p.evaluate(()=>{const h=document.querySelector('.evx-copy h3');const a=[...document.querySelectorAll('.evx-actions a')].map(x=>x.textContent.trim());const lh=parseFloat(getComputedStyle(h).lineHeight);return [h.textContent,Math.round(h.offsetHeight/lh),a]});console.log(i+1,JSON.stringify(r));
   await p.locator('.evx-copy').screenshot({path:`cmp/v7-slide${i+1}-m.png`});await p.evaluate(()=>document.querySelector('.sp-next').click());await p.waitForTimeout(600);}
 const hd=p.locator('.ev2-head');await hd.screenshot({path:'cmp/v7-evhead-m.png'});
 const f=p.locator('.site-footer');await f.scrollIntoViewIfNeeded();await f.screenshot({path:'cmp/v7-footer-m.png'});
 console.log('m errs',JSON.stringify(errs),'ow',await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth));await ctx.close();}
await b.close();})();
