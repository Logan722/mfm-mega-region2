const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const base=process.argv[2];const tag=process.argv[3];
for(const [w,h] of [[1440,900],[820,1180],[390,844]]){const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:w<500?2:1});const p=await ctx.newPage();
await p.route(/newsletter-popup/,r=>r.abort());const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(base+'?x='+Date.now(),{waitUntil:'load'});await p.addStyleTag({content:'.site-nav,header,.live-strip,.skip-link{display:none!important}'});
const el=await p.$('.home-gallery');await el.scrollIntoViewIfNeeded();await p.evaluate(()=>document.querySelectorAll('.home-gallery img').forEach(i=>i.loading='eager'));
await p.evaluate(()=>Promise.all([...document.querySelectorAll('.home-gallery img')].map(i=>i.complete&&i.naturalWidth?1:new Promise(r=>{i.onload=i.onerror=r}))));await p.waitForTimeout(600);
const bb=await el.boundingBox();const sy=await p.evaluate(()=>scrollY);
await p.screenshot({path:`final/${tag}-${w}.png`,fullPage:true,clip:{x:0,y:bb.y+sy,width:w,height:bb.height}});
const info=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,broken:[...document.querySelectorAll('.home-gallery img')].filter(i=>!i.naturalWidth).map(i=>i.src),links:[...document.querySelectorAll('.home-gallery a')].map(a=>a.getAttribute('href'))}));
console.log(w,JSON.stringify(info),errs.join('|'));await ctx.close();}
await b.close();})();
