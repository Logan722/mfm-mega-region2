const { chromium } = require('playwright');
const B='https://deploy-preview-2--mfmmegaregion2usa.netlify.app';
(async()=>{const b=await chromium.launch();
for (const [w,h,tag] of [[1440,900,'d'],[390,844,'m']]){
 const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:tag==='m'?2:1});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto(B+'/play',{waitUntil:'load'});await p.waitForTimeout(800);
 await p.screenshot({path:`/home/claude/preview-work/live-play-hero-${tag}.png`});
 await p.click('.play-today [data-mode=daily]');await p.waitForTimeout(500);
 const card=p.locator('#play-app .qz-card');
 // answer: first wrong-ish? click first option then screenshot feedback
 await p.locator('.qz-opt').first().click();await p.waitForTimeout(200);await card.screenshot({path:`/home/claude/preview-work/live-quiz-q-${tag}.png`});
 for(let i=0;i<4;i++){await p.click('.qz-next');await p.waitForTimeout(150);await p.locator('.qz-opt').nth(i%2).click();await p.waitForTimeout(100);}
 await p.click('.qz-next');await p.waitForTimeout(300);
 await p.fill('.qz-lb input[name=nick]','Dawn');await p.selectOption('.qz-lb select','MFM Dallas');await p.click('.qz-lb button');await p.waitForTimeout(600);
 await p.locator('#play-app .qz-card').screenshot({path:`/home/claude/preview-work/live-quiz-result-${tag}.png`});
 await p.locator('#leaderboard').screenshot({path:`/home/claude/preview-work/live-leaderboard-${tag}.png`});
 await p.goto(B+'/play');await p.waitForTimeout(500);
 await p.screenshot({path:`/home/claude/preview-work/live-play-full-${tag}.png`,fullPage:true});
 for (const [u,n] of [['/','home'],['/events','events'],['/messages/healing-and-deliverance-hour-11-24-2026','message'],['/testimonies','testimonies']]){
  await p.goto(B+u,{waitUntil:'load'});await p.waitForTimeout(1200);
  await p.evaluate(()=>{const x=document.querySelector('.mfm-pop-backdrop,.mfm-pop');if(x)x.remove();});
  await p.screenshot({path:`/home/claude/preview-work/live-${n}-full-${tag}.png`,fullPage:true});
  const ow=await p.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth); if(ow>1) errs.push(n+' overflow '+ow);
 }
 const t=await (await ctx.newPage()).goto(B+'/');
 console.log(tag,'errors:',JSON.stringify(errs));await ctx.close();}
await b.close();})();
