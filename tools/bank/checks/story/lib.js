const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1280,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8095/play');await p.evaluate(()=>localStorage.setItem('mfm-story',JSON.stringify({'joseph-1':{done:1,best:560},'joseph-2':{done:1,best:420}})));await p.reload();await p.waitForTimeout(1200);
await p.locator('[data-mode="story"]').first().click();await p.waitForTimeout(600);await p.locator('[data-story="joseph"]').click();await p.waitForTimeout(500);
const links=await p.$$eval('.sb a.pg-btn, [class*=sb] a.pg-btn',a=>a.map(x=>x.getAttribute('href')+' '+x.textContent));console.log(links);
await p.screenshot({path:require('os').tmpdir()+'/'+'lib.png'});
for(const ch of ['joseph-2','joseph-3']){const r=await p.evaluate(async ch=>{const d=new Date();const day=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago'}).format(d);const res=await fetch('/.netlify/functions/leaderboard',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dev:'qcdev'+ch.slice(-1)+'xxxxxxxxxxxxxx',nick:'QC'+ch.slice(-1),branch:'MFM Dallas',place:'MFM Dallas',mode:'story',ch,pts:500,score:4,n:5,day})});return res.status+' '+(await res.text()).slice(0,200)},ch);console.log(ch,r)}
const page=await (await b.newContext()).newPage();await page.goto('http://localhost:8095/stories/joseph-2');console.log('title',await page.title());
console.log('errs',errs);await b.close()})();
