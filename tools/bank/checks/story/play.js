const { chromium } = require('playwright');
const OUTDIR=process.env.OUT||require('fs').mkdtempSync(require('path').join(require('os').tmpdir(),'story-shots-'));
const W=+process.env.W||1280,H=+process.env.H||900,tag=process.env.T||'d',CH=process.env.CH||'joseph-2';
const RIGHT={
 'joseph-1':['He told his brothers','The sun, the moon and eleven stars','Reuben','Nothing. It was empty','Twenty pieces'],
 'joseph-2':['Potiphar, captain of the guard','The LORD blessed it for Joseph’s sake','He refused, because it would be sin against God','He put him into the prison','All the prisoners in the prison'],
 'christmas-1':['JESUS','Because he would save his people from their sins','In a manger','A babe wrapped in swaddling clothes, lying in a manger','In a house, with Mary his mother'],
 'joseph-3':['“Do not interpretations belong to God?”','The birds','No. He forgot him for two full years','“It is not in me: God shall give Pharaoh an answer of peace.”','Seven years of famine']}[CH];
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:W,height:H},isMobile:W<500,hasTouch:W<500});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,300)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto(`file://${process.env.MFM_REPO||require("path").resolve(__dirname,"../../../..")}/stories/${CH}.html`);await p.waitForTimeout(600);
const box=p.locator('.box');let n=0;const shot=async(name)=>{await box.screenshot({path:OUTDIR+'/'+`${tag}-${String(++n).padStart(2,'0')}-${name}.png`})};
await shot('title');await p.click('#start');
let qn=0,t0=Date.now(),lastShot=0,miss=[];
while(Date.now()-t0<+(process.env.MAX||300000)){
 await p.waitForTimeout(350);
 const st=await p.evaluate(()=>({q:document.getElementById('q').classList.contains('on'),ans:!!document.querySelector('#q button[disabled]'),act:document.getElementById('act').classList.contains('on')?document.getElementById('act').textContent:'',end:document.getElementById('end').classList.contains('on'),cap:document.getElementById('cap').classList.contains('on')?document.getElementById('cap').textContent.slice(0,30):'',bub:document.getElementById('bub').classList.contains('on')?document.getElementById('bub').textContent.slice(0,30):'',tap:document.querySelectorAll('.tapme').length}));
 if(st.end){await p.waitForTimeout(800);await shot('end');await p.click('[data-r="1"]');await p.waitForTimeout(400);await shot('end-prayer');await p.click('#amen');await p.waitForTimeout(300);await shot('end-next');break}
 if(st.q&&!st.ans){qn++;await shot('q'+qn);
   const btns=p.locator('#q .opts button');const k=await btns.count();const texts=await btns.allTextContents();
   let idx=texts.findIndex(x=>RIGHT.includes(x));if(idx<0){miss.push(texts.join('|'));idx=0}if(qn===2)idx=(idx+1)%k;await btns.nth(idx).click();await p.waitForTimeout(700);await shot('q'+qn+'-fb');await p.waitForTimeout(1500);await p.mouse.click(W/2,60);continue}
 if(st.tap){await shot('tap');await p.waitForTimeout(1200);const els=p.locator('.tapme');const k=await els.count();if(k){await els.first().click({force:true});await p.waitForTimeout(700);if(k===3)await shot('tap-mid')}continue}
 if(st.act.includes('walk')){await shot('walk-start');const a=p.locator('#act');const bb=await a.boundingBox();await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.waitForTimeout(3500);await shot('walk-mid');await p.mouse.up();await p.waitForTimeout(400);continue}
 if(st.act){await shot('act');await p.click('#act');await p.waitForTimeout(1300);await shot('act-after');continue}
 if((st.cap||st.bub)&&Date.now()-lastShot>2500){lastShot=Date.now();await shot((st.bub?'say':'nar'));}
 if(st.cap||st.bub){await p.waitForTimeout(900);await p.mouse.click(W/2,60)}
}
const fin=await p.evaluate(()=>document.querySelector('#end .score')?.textContent||'');
console.log(CH,'questions',qn,'final',fin,'miss',JSON.stringify(miss),'errors',JSON.stringify(errs),'secs',Math.round((Date.now()-t0)/1000));await b.close()})();
