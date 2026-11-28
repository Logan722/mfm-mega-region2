const { chromium } = require('playwright');
const W=+process.env.W||1280,H=+process.env.H||900,tag=process.env.T||'d';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:W,height:H},isMobile:W<500,hasTouch:W<500});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file:///home/claude/mfm-mega-region2/stories/joseph-1.html');await p.waitForTimeout(600);
const box=p.locator('.box');let n=0;const shot=async(name)=>{await box.screenshot({path:`${tag}-${String(++n).padStart(2,'0')}-${name}.png`})};
await shot('title');await p.click('#start');
let qn=0,t0=Date.now(),lastShot=0;
while(Date.now()-t0<+(process.env.MAX||240000)){
 await p.waitForTimeout(350);
 const st=await p.evaluate(()=>({q:document.getElementById('q').classList.contains('on'),ans:!!document.querySelector('#q button[disabled]'),act:document.getElementById('act').classList.contains('on')?document.getElementById('act').textContent:'',end:document.getElementById('end').classList.contains('on'),cap:document.getElementById('cap').classList.contains('on')?document.getElementById('cap').textContent.slice(0,30):'',bub:document.getElementById('bub').classList.contains('on')?document.getElementById('bub').textContent.slice(0,30):''}));
 if(st.end){await p.waitForTimeout(800);await shot('end');await p.click('[data-r="1"]');await p.waitForTimeout(400);await shot('end-prayer');await p.click('#amen');await p.waitForTimeout(300);await shot('end-ch2');break}
 if(st.q&&!st.ans){qn++;await shot('q'+qn);const right=await p.evaluate(()=>{return 0});
   const btns=p.locator('#q .opts button');const k=await btns.count();
   // answer wrong on q2, right otherwise: find right by trying known answers
   const texts=await btns.allTextContents();const RIGHT=['He told his brothers','The sun, the moon and eleven stars','Reuben','Nothing. It was empty','Twenty pieces'];
   let idx=texts.findIndex(x=>RIGHT.includes(x));if(qn===2)idx=(idx+1)%k;await btns.nth(idx).click();await p.waitForTimeout(700);await shot('q'+qn+'-fb');await p.waitForTimeout(1500);await p.mouse.click(W/2,60);continue}
 if(st.act.includes('walk')){await shot('walk-start');const a=p.locator('#act');const bb=await a.boundingBox();await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.waitForTimeout(3500);await shot('walk-mid');await p.mouse.up();await p.waitForTimeout(400);continue}
 if(st.act.includes('Pray')){await shot('pray-btn');await p.click('#act');await p.waitForTimeout(1500);await shot('pray-beam');continue}
 if((st.cap||st.bub)&&Date.now()-lastShot>2500){lastShot=Date.now();await shot((st.bub?'say':'nar'));}
 if(st.cap||st.bub){await p.waitForTimeout(900);await p.mouse.click(W/2,60)}
}
console.log('questions',qn,'errors',JSON.stringify(errs),'secs',Math.round((Date.now()-t0)/1000));await b.close()})();
