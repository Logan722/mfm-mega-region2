const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1280,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8095/play');await p.waitForTimeout(1200);
await p.locator('[data-mode="story"]').first().click();await p.waitForTimeout(700);await p.locator('#play-app').screenshot({path:require('os').tmpdir()+'/'+'lib-events.png'});
await p.locator('[data-story="christmas"]').click();await p.waitForTimeout(1500);console.log('url',p.url(),await p.title());
const r=await p.evaluate(async()=>{const day=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago'}).format(new Date());const res=await fetch('/.netlify/functions/leaderboard',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dev:'qcxmasxxxxxxxxxxxxxx',nick:'QCX',branch:'MFM Dallas',place:'MFM Dallas',mode:'story',ch:'christmas-1',pts:500,score:4,n:5,day})});return res.status+' '+(await res.text()).slice(0,120)});console.log(r);
console.log('errs',errs);await b.close()})();
