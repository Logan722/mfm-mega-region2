const { chromium } = require('playwright');
const B='http://localhost:8095';
(async()=>{const b=await chromium.launch();const errs=[];
const mk=async(w,h,tag)=>{const c=await b.newContext({viewport:{width:w,height:h},isMobile:w<500,hasTouch:w<500});const p=await c.newPage();p.on('pageerror',e=>errs.push(tag+': '+e.message));p.on('response',r=>{if(r.status()>=400)errs.push(tag+' '+r.status()+' '+r.url())});return p};
const host=await mk(1280,900,'host');let n=0;const shot=async(p,name)=>{await p.screenshot({path:require('os').tmpdir()+'/'+`${String(++n).padStart(2,'0')}-${name}.png`})};
await host.goto(B+'/play');await host.waitForTimeout(800);await host.locator('#live').scrollIntoViewIfNeeded();await host.locator('#live').screenshot({path:'00-section.png'});
await host.click('#live [data-live="host"]');await host.waitForTimeout(500);await shot(host,'setup');
await host.check('input[name=n][value="5"]',{force:true});await host.check('input[name=teams][value="1"]',{force:true});await host.check('input[name=tv][value="1"]',{force:true});await host.waitForTimeout(200);await shot(host,'setup-filled');
await host.click('.lr-setup button[type=submit]');await host.waitForSelector('.lr-code',{timeout:8000});await host.waitForTimeout(1200);await shot(host,'lobby-empty');
const code=(await host.textContent('.lr-code')).trim();console.log('code',code);
const P=[];const names=[['Ann','Lions',true],['Ben','Lions',false],['Cy','Eagles',true]];
for(const [nm,tm,newT] of names){const p=await mk(390,844,nm);await p.goto(B+'/play?room='+code);await p.waitForSelector('.lr-jf',{timeout:8000});await p.fill('.lr-jf input[name=name]',nm);
 if(newT){await p.check('.lr-jf .lr-opt.new input',{force:true});await p.fill('.lr-jf input[name=tname]',tm)}else{await p.check(`.lr-jf input[name=team][value="${tm}"]`,{force:true})}
 if(nm==='Ann')await shot(p,'join-ann');if(nm==='Ben')await shot(p,'join-ben-teamlist');
 await p.click('.lr-jf button[type=submit]');await p.waitForTimeout(900);P.push(p)}
await shot(P[0],'player-lobby');await host.waitForTimeout(2500);await shot(host,'host-lobby-3');
await host.click('[data-lv="start"]');await host.waitForTimeout(1500);await shot(host,'host-count');await shot(P[1],'player-count');
for(let q=0;q<5;q++){
 await host.waitForSelector('.lr-ans .ans',{timeout:15000});await host.waitForTimeout(600);if(q<2)await shot(host,'host-q'+q);
 for(const [i,p] of P.entries()){await p.waitForSelector('.lr-ans .ans:not([disabled])',{timeout:10000});if(q===0&&i===0)await shot(p,'player-q0');const k=await p.locator('.lr-ans .ans').count();await p.locator('.lr-ans .ans').nth((i+q)%k).click();await p.waitForTimeout(300+i*400);if(q===0&&i===0)await shot(p,'player-locked')}
 await host.waitForSelector('.lr-verdict, .lr-board',{timeout:25000});await host.waitForTimeout(900);if(q<2){await shot(host,'host-reveal'+q);await shot(P[0],'player-reveal'+q)}
}
await host.waitForSelector('.lr-podium',{timeout:30000});await host.waitForTimeout(800);await shot(host,'host-final');await P[0].waitForSelector('.lr-podium',{timeout:10000});await shot(P[0],'player-final');
const res=await P.map(async p=>p.textContent('.lr-board li.me em'));console.log('scores',await Promise.all(res));
// play again with who am i
await host.click('[data-lv="again"]');await host.waitForSelector('.lr-setup');await host.check('input[name=game][value="whoami"]',{force:true});await host.check('input[name=n][value="5"]',{force:true});await host.click('.lr-setup button[type=submit]');
await host.waitForSelector('.lr-code',{timeout:8000});await host.waitForTimeout(1500);console.log('again lobby players',await host.textContent('[data-lv="n"]'));
await host.click('[data-lv="start"]');await host.waitForSelector('.lr-clues',{timeout:15000});await host.waitForTimeout(13000);await shot(host,'host-whoami-clues');
await P[2].waitForSelector('.lr-clues');await shot(P[2],'player-whoami');
await host.evaluate(()=>{});await host.goto(B+'/play');
console.log('errors',JSON.stringify(errs));await b.close()})();
