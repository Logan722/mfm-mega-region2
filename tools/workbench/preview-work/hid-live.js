const { chromium } = require('playwright');
const B='https://mfmmegaregion2usa.org';
(async()=>{const b=await chromium.launch();
for (const [w,h,tag] of [[1440,900,'d'],[390,844,'m']]){
 const ctx=await b.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(B+'/preview-home',{waitUntil:'load'});await p.waitForTimeout(5500);
 const pop=await p.locator('.mfm-pop-card').isVisible().catch(()=>false);
 if(pop){await p.locator('.mfm-pop-card').screenshot({path:`live-h-pop-${tag}.png`});await p.click('.mfm-pop-close');}
 await p.waitForTimeout(400);
 await p.screenshot({path:`live-h-home-full-${tag}.png`,fullPage:true});
 const order=await p.evaluate(()=>[...document.querySelectorAll('main > section, body > section, section')].filter(s=>!s.parentElement.closest('section')).map(s=>(s.querySelector('h2,h1')||{}).textContent||s.className).map(t=>t.trim().slice(0,40)));
 console.log(tag,'popup',pop,'sections',JSON.stringify(order));
 // play flow
 await p.goto(B+'/preview-play');await p.waitForTimeout(800);
 await p.click('.play-today [data-mode=daily]');await p.waitForTimeout(300);
 await p.locator('#play-app .qz-card').screenshot({path:`live-h-who-${tag}.png`});
 await p.fill('input[name=nick]','Dawn');await p.selectOption('select[name=branch]','Other / visiting');await p.fill('input[name=other]','Lagos, Nigeria');
 await p.locator('#play-app .qz-card').screenshot({path:`live-h-who-other-${tag}.png`});
 await p.click('.qz-whof .qz-btn');await p.waitForTimeout(300);
 for(let i=0;i<5;i++){await p.locator('.qz-opt').first().click();await p.waitForTimeout(80);await p.click('.qz-next');await p.waitForTimeout(150);}
 await p.locator('#play-app .qz-card').screenshot({path:`live-h-res-${tag}.png`});
 await p.click('.lb-tab[data-tab=players]');await p.waitForTimeout(200);
 const lb=await p.textContent('#lb-body'); console.log(tag,'lb has you:',lb.includes('Dawn (you)'), lb.includes('Lagos'));
 await p.screenshot({path:`live-h-play-full-${tag}.png`,fullPage:true});
 await p.goto(B+'/preview-reach-out?subject=testimony');await p.waitForTimeout(600);
 console.log(tag,'subject:',await p.$eval('#reachForm select',s=>s.value));
 await p.screenshot({path:`live-h-reach-${tag}.png`,fullPage:true});
 await p.goto(B+'/preview-testimonies');await p.waitForTimeout(500);await p.screenshot({path:`live-h-testi-${tag}.png`,fullPage:true});
 await p.goto(B+'/preview-message');await p.waitForTimeout(800);await p.screenshot({path:`live-h-msg-${tag}.png`,fullPage:true});
 for(const u of ['/preview-home','/preview-play','/preview-reach-out','/preview-testimonies','/preview-message']){await p.goto(B+u);await p.waitForTimeout(400);const ow=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(ow>1)errs.push(u+' overflow '+ow);}
 console.log(tag,'errors',JSON.stringify(errs));await ctx.close();}
await b.close();})();
