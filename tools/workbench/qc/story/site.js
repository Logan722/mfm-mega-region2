const { chromium } = require('playwright');
const W=+process.env.W||1280,H=+process.env.H||900,tag=process.env.T||'s';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:W,height:H},isMobile:W<500,hasTouch:W<500});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push(m.text())});
let n=0;const shot=async(nm,loc)=>{await (loc||p).screenshot({path:`${tag}-${String(++n).padStart(2,'0')}-${nm}.png`})};
await p.goto('http://localhost:8095/play');await p.waitForTimeout(1500);
await p.locator('#leaderboard').scrollIntoViewIfNeeded();await p.waitForTimeout(500);await shot('board',p.locator('#leaderboard'));
await p.locator('[data-mode="story"]').first().click();await p.waitForTimeout(800);await shot('library');
await p.locator('[data-story="joseph"]').click();await p.waitForTimeout(500);await shot('chapters');
await p.locator('#play-app a.pg-btn').first().click();await p.waitForLoadState('load');await p.waitForTimeout(800);console.log('url',p.url());
await p.click('#start');
const RIGHT=['He told his brothers','The sun, the moon and eleven stars','Reuben','Nothing. It was empty','Twenty pieces'];let qn=0,t0=Date.now(),tq=0;
while(Date.now()-t0<220000){await p.waitForTimeout(300);
 const st=await p.evaluate(()=>({q:document.getElementById('q').classList.contains('on'),ans:!!document.querySelector('#q button[disabled]'),act:document.getElementById('act').classList.contains('on')?document.getElementById('act').textContent:'',end:document.getElementById('end').classList.contains('on')}));
 if(st.end)break;
 if(st.q&&!st.ans){qn++;const btns=p.locator('#q .opts button');const texts=await btns.allTextContents();let idx=texts.findIndex(x=>RIGHT.includes(x));if(qn===2)idx=(idx+1)%texts.length;await btns.nth(idx).click();tq=Date.now();
   // measure auto-continue time without tapping
   if(qn<=2){await p.waitForFunction(()=>!document.getElementById('q').classList.contains('on'),null,{timeout:15000});console.log('q'+qn,'feedback ms',Date.now()-tq)} continue}
 if(st.act.includes('walk')){const bb=await p.locator('#act').boundingBox();await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.waitForTimeout(3500);await p.mouse.up();continue}
 if(st.act.includes('Pray')){await p.click('#act');continue}
 await p.mouse.click(W/2,H*0.3);
}
await p.waitForTimeout(700);await shot('end-form',p.locator('.box'));
await p.fill('#wn','Dawn');await p.selectOption('#wb','MFM Dallas');await p.click('#who button[type=submit]');await p.waitForTimeout(1500);await shot('end-rank',p.locator('.box'));
const prog=await p.evaluate(()=>localStorage.getItem('mfm-story'));console.log('progress',prog);
await p.goto('http://localhost:8095/play');await p.waitForTimeout(1500);await p.locator('#leaderboard').scrollIntoViewIfNeeded();await p.waitForTimeout(800);await shot('board-after',p.locator('#leaderboard'));
await p.click('[data-gt="story"]');await p.waitForTimeout(400);await shot('board-story',p.locator('#leaderboard'));
await p.locator('[data-mode="story"]').first().click();await p.waitForTimeout(600);await p.locator('[data-story="joseph"]').click();await p.waitForTimeout(400);await shot('chapters-after');
console.log('errors',JSON.stringify(errs));await b.close()})();
