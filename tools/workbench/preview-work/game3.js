const { chromium } = require('playwright');
const fs=require('fs');
(async()=>{const b=await chromium.launch();
const words=JSON.parse(fs.readFileSync('/home/claude/artifact-home/js/quiz/words.json')).words;
for (const [w,h,t] of [[1536,860,'d'],[390,844,'m']]){
 const ctx=await b.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('http://localhost:8093/play.html',{waitUntil:'load'});await p.waitForTimeout(2000);
 await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelectorAll('body *').forEach(x=>{if(x.closest('#play-app'))return;const ps=getComputedStyle(x).position;if(ps==='fixed'||ps==='sticky')x.dataset.hid=1,x.style.visibility='hidden'})});
 for(let g=1;g<=6;g++){await p.locator(`[data-gpick="${g}"]`).click();await p.waitForTimeout(900);const el=p.locator('.pg-games');await el.scrollIntoViewIfNeeded();await el.screenshot({path:`cmp/gs${g}-${t}.png`});
   const ow=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(ow>0)console.log('overflow style',g,ow);}
 await p.locator('[data-gcat="together"]').click().catch(()=>{});
 await p.locator('[data-gpick="1"]').click();
 await p.evaluate(()=>{document.querySelectorAll('[data-hid]').forEach(x=>x.style.visibility='');window.scrollTo(0,0)});
 // daily 10
 await p.locator('.pg-ctas [data-mode="daily"]').click();await p.waitForTimeout(400);
 await p.fill('.st-form input[name=nick]','Grace');await p.selectOption('.st-form select',{index:3});await p.click('.st-form .pg-btn');await p.waitForTimeout(1500);
 const nq=await p.locator('#play-app .st-qn').textContent();console.log(t,'daily',nq);
 for(let i=0;i<10;i++){await p.locator('#play-app .ans').first().click();await p.waitForTimeout(250);if(i===4&&t==='m')await p.screenshot({path:`cmp/n-q-${t}.png`});await p.locator('.st-next').click();await p.waitForTimeout(250);}
 await p.waitForTimeout(1400);await p.screenshot({path:`cmp/n-results-${t}.png`});
 // challenge flow (preview button)
 await p.locator('[data-try]').click();await p.waitForTimeout(500);await p.screenshot({path:`cmp/n-chal-${t}.png`});
 await p.locator('.st-accept').click();await p.waitForTimeout(1200);
 const sameQ=await p.locator('#play-app .st-question').textContent();
 for(let i=0;i<10;i++){await p.locator('#play-app .ans').nth(1).click();await p.waitForTimeout(200);await p.locator('.st-next').click();await p.waitForTimeout(200);}
 await p.waitForTimeout(1300);await p.screenshot({path:`cmp/n-versus-${t}.png`});
 await p.locator('.st-x').click();await p.waitForTimeout(400);
 // who pack twice: different questions?
 const firstQs=[];
 for(let r=0;r<2;r++){await p.locator('.pg-games [data-pack="who"]').click();await p.waitForTimeout(1300);
  if(r===0)await p.screenshot({path:`cmp/n-who-${t}.png`});
  for(let i=0;i<10;i++){firstQs.push(await p.locator('#play-app .st-question').textContent());await p.locator('#play-app .ans').first().click();await p.waitForTimeout(150);await p.locator('.st-next').click();await p.waitForTimeout(150);}
  await p.waitForTimeout(600);await p.locator('.st-x').click();await p.waitForTimeout(400);}
 console.log(t,'who unique of 20:',new Set(firstQs).size);
 // word of the day
 await p.locator('.pg-games [data-mode="word"]').click();await p.waitForTimeout(1500);
 const day=await p.evaluate(()=>{const a=Date.parse('2026-12-01T00:00:00Z');const p={};new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).forEach(x=>p[x.type]=x.value);const b=Date.parse(p.year+'-'+p.month+'-'+p.day+'T00:00:00Z');return Math.max(1,Math.floor((b-a)/864e5)+1)});
 const ans=words[(day-1)%words.length].w;
 await p.keyboard.type('GRACE');await p.keyboard.press('Enter');await p.waitForTimeout(900);
 await p.keyboard.type('ZZZZZ');await p.keyboard.press('Enter');await p.waitForTimeout(400);
 await p.screenshot({path:`cmp/n-word-${t}.png`});
 for(let i=0;i<5;i++)await p.keyboard.press('Backspace');
 await p.keyboard.type(ans);await p.keyboard.press('Enter');await p.waitForTimeout(2200);
 await p.screenshot({path:`cmp/n-wordend-${t}.png`});
 await p.locator('.st-x').click();await p.waitForTimeout(400);
 // team battle
 await p.locator('.pg-games [data-mode="team"]').click();await p.waitForTimeout(500);
 await p.locator('.tm-n label:has(input[value="3"])').first().click();await p.waitForTimeout(200);
 await p.screenshot({path:`cmp/n-teamsetup-${t}.png`});
 await p.locator('.st-team label:has(input[name=per][value="3"])').click();
 await p.click('.st-team .pg-btn');await p.waitForTimeout(1500);
 await p.screenshot({path:`cmp/n-teampass-${t}.png`});
 for(let i=0;i<9;i++){await p.locator('.tm-pass .pg-btn').click();await p.waitForTimeout(250);if(i===1)await p.screenshot({path:`cmp/n-teamq-${t}.png`});await p.locator('#play-app .ans').nth(i%3).click();await p.waitForTimeout(200);await p.locator('.st-next').click();await p.waitForTimeout(250);}
 await p.waitForTimeout(1200);await p.screenshot({path:`cmp/n-teamres-${t}.png`});
 await p.locator('.st-x').click();await p.waitForTimeout(400);
 // blitz (60 s)
 await p.locator('.pg-games [data-mode="blitz"]').click();await p.waitForTimeout(1500);
 for(let i=0;i<12;i++){await p.keyboard.press(i%3?'t':'f');await p.waitForTimeout(120);}
 await p.screenshot({path:`cmp/n-blitz-${t}.png`});
 await p.waitForTimeout(t==='d'?58000:58000);await p.waitForTimeout(1500);await p.screenshot({path:`cmp/n-blitzend-${t}.png`});
 console.log(t,'sameQ',sameQ.slice(0,40),'errs',JSON.stringify(errs));await ctx.close();}
await b.close();})();
