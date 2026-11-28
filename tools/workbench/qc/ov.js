const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
await p.goto('http://localhost:8093/play.html');await p.waitForTimeout(1200);
await p.locator('.pg-ctas [data-mode="daily"]').click();await p.waitForTimeout(400);
await p.fill('.st-form input[name=nick]','QC Tester');await p.selectOption('.st-form select','Other / visiting');await p.fill('.st-form input[name=other]','London, UK');await p.click('.st-form .pg-btn');await p.waitForTimeout(1500);
for(let i=0;i<10;i++){await p.locator('#play-app .ans').first().click();await p.waitForTimeout(100);await p.locator('.st-next').click();await p.waitForTimeout(100);}
await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const s=document.getElementById('play-app');const W=innerWidth;return {sw:s.scrollWidth,dw:document.documentElement.scrollWidth,W,wide:[...s.querySelectorAll('*')].filter(e=>{const b=e.getBoundingClientRect();return b.right>W+1||b.left<-1}).slice(0,8).map(e=>e.className+' '+Math.round(e.getBoundingClientRect().left)+'..'+Math.round(e.getBoundingClientRect().right))}});
console.log(JSON.stringify(r));await p.screenshot({path:'ov.png',fullPage:false});await b.close();})();
