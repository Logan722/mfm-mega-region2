const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const R=[];const ok=(c,n,x='')=>{console.log((c?'PASS':'FAIL')+' | '+n+(x?' | '+x:''));R.push(c)};
const mk=async(w,h)=>{const c=await b.newContext({viewport:{width:w,height:h}});const p=await c.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));await p.goto('http://localhost:8095/play.html');await p.waitForTimeout(1500);return p;};
const A=await mk(1440,900), B=await mk(390,844);
// both look at the board: empty
for(const p of [A,B]){await p.evaluate(()=>document.getElementById('leaderboard').scrollIntoView());await p.waitForTimeout(1200);}
ok(await A.locator('.lb-empty').count()===1,'empty board says "No scores yet this week"');
ok((await A.locator('#pg-live').textContent()).includes('0 players'),'live line shows 0 players');
await A.locator('#leaderboard').screenshot({path:'lb-empty-d.png'});await B.locator('#leaderboard').screenshot({path:'lb-empty-m.png'});
// A plays Daily 10
await A.evaluate(()=>scrollTo(0,0));await A.locator('.pg-ctas [data-mode="daily"]').click();await A.waitForTimeout(400);
await A.fill('.st-form input[name=nick]','Grace');await A.selectOption('.st-form select','MFM Dallas');await A.click('.st-form .pg-btn');await A.waitForTimeout(1500);
for(let i=0;i<10;i++){await A.locator('#play-app .ans').first().click();await A.waitForTimeout(100);await A.locator('.st-next').click();await A.waitForTimeout(100);}
await A.waitForTimeout(1800);
ok((await A.locator('.st-lb small').textContent()).includes('Added'),'A: results say "Added to this week\'s leaderboard"',await A.locator('.st-lb small').textContent());
await A.locator('.st-board').click();await A.waitForTimeout(1500);
ok((await A.locator('#pg-boardview').textContent()).includes('MFM Dallas'),'A: board shows MFM Dallas right away');
await A.locator('.lb-tab[data-tab="players"]').click();await A.waitForTimeout(500);
ok((await A.locator('#pg-boardview').textContent()).includes('Grace (you)'),'A: players tab marks "Grace (you)"');
// B (phone) sees it without reloading (poll ≤ 20 s)
const t0=Date.now();let seen=false;while(Date.now()-t0<26000){if((await B.locator('#pg-boardview').textContent()).includes('MFM Dallas')){seen=true;break;}await B.waitForTimeout(1000);}
ok(seen,'B (another phone) sees A\'s score without reloading',Math.round((Date.now()-t0)/1000)+' s');
await B.locator('#leaderboard').screenshot({path:'lb-one-m.png'});
// B plays as visitor, A sees B
await B.evaluate(()=>scrollTo(0,0));await B.locator('.pg-games [data-mode="quiz"]').click();await B.waitForTimeout(400);
await B.fill('.st-form input[name=nick]','Tobi');await B.selectOption('.st-form select','Other / visiting');await B.fill('.st-form input[name=other]','London, UK');await B.click('.st-form .pg-btn');await B.waitForTimeout(500);
await B.locator('.st-go').click();await B.waitForTimeout(1500);
for(let i=0;i<10;i++){await B.locator('#play-app .ans').nth(1).click();await B.waitForTimeout(100);await B.locator('.st-next').click();await B.waitForTimeout(100);}
await B.waitForTimeout(1500);await B.locator('.st-board').click();await B.waitForTimeout(1200);
await A.locator('.lb-tab[data-tab="branches"]').click();
const t1=Date.now();seen=false;while(Date.now()-t1<26000){if((await A.locator('#pg-boardview').textContent()).includes('Visitors & friends')){seen=true;break;}await A.waitForTimeout(1000);}
ok(seen,'A sees B (visitor) appear',Math.round((Date.now()-t1)/1000)+' s');
await A.locator('#leaderboard').screenshot({path:'lb-two-d.png'});
// A plays Daily again → not counted again
await A.evaluate(()=>scrollTo(0,0));await A.locator('.pg-ctas [data-mode="daily"]').click();await A.waitForTimeout(1500);
for(let i=0;i<10;i++){await A.locator('#play-app .ans').first().click();await A.waitForTimeout(90);await A.locator('.st-next').click();await A.waitForTimeout(90);}
await A.waitForTimeout(1800);ok((await A.locator('.st-lb small').textContent()).includes('first play of the day'),'A: replaying the Daily 10 does not count twice',await A.locator('.st-lb small').textContent());
ok(!A.errs.length&&!B.errs.length,'no JavaScript errors',A.errs.concat(B.errs).join(' | '));
console.log('TOTAL',R.length,'PASS',R.filter(Boolean).length);await b.close();})();
