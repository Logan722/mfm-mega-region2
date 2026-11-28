// Full game QC: every mode, desktop + phone. Prints PASS/FAIL lines.
const { chromium } = require('playwright');
const fs=require('fs');
const words=JSON.parse(fs.readFileSync('/home/claude/artifact-home/js/quiz/words.json')).words;
const R=[];const ok=(c,n,extra='')=>{R.push([c?'PASS':'FAIL',n,extra]);console.log((c?'PASS':'FAIL')+' | '+n+(extra?' | '+extra:''));};
(async()=>{const b=await chromium.launch();
for (const [w,h,t] of [[1440,900,'desktop'],[390,844,'phone']]){
 const ctx=await b.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();const errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push(m.text())});
 p.on('response',r=>{if(r.status()>=400&&!/live-status/.test(r.url()))errs.push(r.status()+' '+r.url())});
 await p.goto('http://localhost:8096/play.html',{waitUntil:'load'});await p.waitForTimeout(1500);
 const T=(n)=>t+' · '+n;
 const ov=async()=>await p.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.getElementById('play-app').scrollWidth)-innerWidth);
 const centred=async()=>await p.evaluate(()=>{const s=document.getElementById('play-app');if(s.scrollHeight>innerHeight+2)return true;const top=s.querySelector('.st-top').getBoundingClientRect().bottom;const kids=[...s.querySelector('.st-body').children].filter(x=>!x.hidden&&x.getBoundingClientRect().height>0);const a=Math.min(...kids.map(k=>k.getBoundingClientRect().top)),z=Math.max(...kids.map(k=>k.getBoundingClientRect().bottom));return Math.abs((a-top)-(innerHeight-z))<=12});
 const qtext=async()=>(await p.locator('#play-app .st-question').textContent()).trim();
 const answerAll=async(n,pick=0,collect)=>{for(let i=0;i<n;i++){if(collect)collect.push(await qtext());await p.locator('#play-app .ans').nth(pick).click();await p.waitForTimeout(110);await p.locator('.st-next').click();await p.waitForTimeout(110);}};
 ok(await p.locator('.pg-games .pg-tile').count()===6,T('six game tiles'));
 ok(await ov()<=0,T('page has no sideways scroll'));
 // Daily 10 + who's playing (branch Other needs a place)
 await p.evaluate(()=>window.PG.start('daily'));await p.waitForTimeout(400);
 ok(await centred(),T("Who's playing is centred"));
 await p.fill('.st-form input[name=nick]','QC Tester');await p.selectOption('.st-form select','Other / visiting');await p.click('.st-form .pg-btn');await p.waitForTimeout(200);
 ok(await p.locator('.st-err').isVisible(),T('"Other / visiting" asks for a place'));
 await p.fill('.st-form input[name=other]','London, UK');await p.click('.st-form .pg-btn');await p.waitForTimeout(1500);
 ok((await p.locator('#play-app .st-qn').textContent()).includes('of 10'),T('Daily has 10 questions'));
 ok(await centred(),T('question screen centred'));
 const d1=[];
 // keyboard answers 1-4
 await p.keyboard.press('2');await p.waitForTimeout(200);ok(await p.locator('.st-sheet').isVisible(),T('keyboard key answers'));
 await p.locator('.st-next').click();await p.waitForTimeout(150);
 await answerAll(9,0);await p.waitForTimeout(1300);
 ok(await p.locator('.st-res').count()===1,T('Daily results screen'));
 ok((await p.locator('.st-lb').textContent()).includes('London, UK'),T('score credited to the player'));
 const link=await p.locator('[data-try]').getAttribute('data-try');ok(/\?c=daily&q=/.test(link),T('Daily challenge link carries the questions'));
 ok(await ov()<=0,T('results: no sideways scroll'));
 // Daily is the same on replay
 await p.locator('.st-x').click();await p.waitForTimeout(300);
 await p.evaluate(()=>window.PG.start('daily'));await p.waitForTimeout(1500);const dA=await qtext();
 await p.locator('.st-x').click();await p.waitForTimeout(300);
 await p.reload();await p.waitForTimeout(1500);await p.evaluate(()=>window.PG.start('daily'));await p.waitForTimeout(1500);const dB=await qtext();
 ok(dA===dB,T('Daily is the same for everyone (same first question after reload)'));
 await p.locator('.st-x').click();await p.waitForTimeout(300);
 // Leaderboard shows the player
 const lb=await p.locator('#pg-boardview').textContent();ok(lb.includes('Visitors & friends')||lb.length>50,T('leaderboard renders'));
 // Quiz: three Bible rounds, no repeats
 const seen=[];
 for(let r=0;r<3;r++){await p.evaluate(()=>window.PG.start('quiz'));await p.waitForTimeout(400);
   if(r===0){ok(await centred(),T('Quiz setup centred'));await p.locator('.tp-chip.mix').click();await p.locator('.st-go').click();await p.waitForTimeout(200);ok(await p.locator('.st-quiz .st-err').isVisible(),T('Quiz asks for at least one topic'));await p.locator('.tp-chip[data-tk="bible"]').click();}
   await p.locator('.st-go').click();await p.waitForTimeout(1300);await answerAll(10,1,seen);await p.waitForTimeout(700);await p.locator('.st-x').click();await p.waitForTimeout(300);}
 ok(new Set(seen).size===30,T('3 Bible rounds = 30 different questions'),new Set(seen).size+'/30');
 // Quiz remembers topics; mix covers all 5
 await p.evaluate(()=>window.PG.start('quiz'));await p.waitForTimeout(400);
 ok(await p.locator('.tp-chip[data-tk="bible"][aria-pressed=true]').count()===1&&await p.locator('.tp-chip[data-tk="mfm"][aria-pressed=false]').count()===1,T('Quiz remembers the last topics'));
 await p.locator('.tp-chip.mix').click();await p.locator('.st-go').click();await p.waitForTimeout(1500);
 const pk=[];for(let i=0;i<10;i++){pk.push(await p.locator('#play-app .st-pack').textContent());await p.locator('#play-app .ans').first().click();await p.waitForTimeout(110);await p.locator('.st-next').click();await p.waitForTimeout(110);}
 ok(new Set(pk).size===5,T('Mix it up covers all 5 topics'),[...new Set(pk)].join('/'));
 await p.waitForTimeout(800);
 // Quiz challenge round-trip
 const ql=await p.locator('[data-try]').getAttribute('data-try');await p.locator('[data-try]').click();await p.waitForTimeout(400);
 ok(await p.locator('.st-chal').count()===1,T('challenge screen opens'));
 await p.locator('.st-accept').click();await p.waitForTimeout(1500);const cq=[];await answerAll(10,0,cq);await p.waitForTimeout(1300);
 ok(await p.locator('.st-versus').count()===1,T('challenge shows You vs friend'));ok(await ov()<=0,T('challenge results: no sideways scroll'));
 const qids=decodeURIComponent(ql.split('q=')[1].split('&')[0]).split(',');ok(qids.length===10,T('challenge link has 10 question ids'));
 await p.locator('.st-x').click();await p.waitForTimeout(300);
 // Timer runs out
 await p.evaluate(()=>window.PG.start('quiz'));await p.waitForTimeout(400);await p.locator('.st-go').click();await p.waitForTimeout(1200);
 await p.waitForTimeout(21500);ok((await p.locator('.st-sheet').textContent()).includes('Time'),T("timer runs out → \"Time's up\""));
 await p.keyboard.press('Escape');await p.waitForTimeout(400);ok(await p.locator('#play-app').isHidden(),T('Escape closes the game'));
 // Kids: 30 s, 10 questions
 await p.evaluate(()=>window.PG.start('kids'));await p.waitForTimeout(1500);
 ok((await p.locator('#play-app .st-timer b').textContent()).trim()>='29',T('Kids timer is 30 s'));ok((await p.locator('#play-app .st-qn').textContent()).includes('of 10'),T('Kids has 10 questions'));
 await answerAll(10,0);await p.waitForTimeout(1200);ok(await p.locator('.st-res').count()===1,T('Kids results'));ok(await ov()<=0,T('Kids results: no sideways scroll'));await p.locator('.st-x').click();await p.waitForTimeout(300);
 // Word: invalid, lose path via practice, win daily, persistence
 await p.locator('.pg-games [data-mode="word"]').click();await p.waitForTimeout(1500);
 ok(await centred(),T('Word screen centred'));
 await p.keyboard.type('ZQXJK');await p.keyboard.press('Enter');await p.waitForTimeout(300);ok((await p.locator('.wd-msg').textContent()).includes('Not in the word list'),T('Word rejects made-up words'));
 for(let i=0;i<5;i++)await p.keyboard.press('Backspace');
 const day=await p.evaluate(()=>{const a=Date.parse('2026-12-01T00:00:00Z');const q={};new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).forEach(x=>q[x.type]=x.value);return Math.max(1,Math.floor((Date.parse(q.year+'-'+q.month+'-'+q.day+'T00:00:00Z')-a)/864e5)+1)});
 const ans=words[(day-1)%words.length].w;
 await p.keyboard.type('GRACE');await p.keyboard.press('Enter');await p.waitForTimeout(700);
 if(ans!=='GRACE'){await p.keyboard.type(ans);await p.keyboard.press('Enter');}await p.waitForTimeout(2200);
 ok((await p.locator('.wd-answer').textContent())===ans,T('Word win shows the word'));ok(await p.locator('.wd-verse mark').count()===1,T('Word shows its verse with the word highlighted'));ok(await ov()<=0,T('Word results: no sideways scroll'));
 await p.locator('.st-x').click();await p.waitForTimeout(300);await p.locator('.pg-games [data-mode="word"]').click();await p.waitForTimeout(1500);
 ok(await p.locator('.wd-end').count()===1,T('Word of the Day stays solved after reopening'));
 await p.locator('.st-prac').click();await p.waitForTimeout(1200);
 for(const g of ['GRACE','MERCY','FAITH','PEACE','HOUSE','LIGHT']){await p.keyboard.type(g);await p.keyboard.press('Enter');await p.waitForTimeout(250);}
 await p.waitForTimeout(1500);ok(await p.locator('.wd-end').count()===1,T('Word practice: 6 tries then shows the answer'));
 await p.locator('.st-x').click();await p.waitForTimeout(300);
 // Team battle 3 teams x 3
 await p.evaluate(()=>window.PG.start('team'));await p.waitForTimeout(500);
 await p.locator('.tm-n label:has(input[value="3"])').first().click();await p.locator('.st-team label:has(input[name=per][value="3"])').click();
 if(await p.locator('.st-team .tp-chip.mix[aria-pressed=false]').count()) await p.locator('.st-team .tp-chip.mix').click();
 await p.click('.st-team .pg-btn.xl');await p.waitForTimeout(1500);
 for(let i=0;i<9;i++){await p.locator('.tm-pass .pg-btn').click();await p.waitForTimeout(150);await p.locator('#play-app .ans').nth(i%2).click();await p.waitForTimeout(120);await p.locator('.st-next').click();await p.waitForTimeout(150);}
 await p.waitForTimeout(1200);ok(await p.locator('.tm-row').count()===3,T('Team Battle: 3 teams on the scoreboard'));ok(await ov()<=0,T('Team results: no sideways scroll'));
 await p.locator('.st-x').click();await p.waitForTimeout(300);
 // Blitz full 60s
 await p.evaluate(()=>window.PG.start('blitz'));await p.waitForTimeout(1500);
 ok(await centred(),T('Blitz centred'));
 let n=0;const end=Date.now()+61500;while(Date.now()<end && await p.locator('.bz-card').count()){await p.keyboard.press(n%2?'t':'f');n++;await p.waitForTimeout(220);}
 await p.waitForTimeout(1500);ok(await p.locator('.bz-big').count()===1,T('Blitz ends after 60 s with a score'),n+' answers');
 ok(await p.locator('.bz-miss').count()>0,T('Blitz shows the ones you missed'));ok(await ov()<=0,T('Blitz results: no sideways scroll'));
 const bl=await p.locator('[data-try]').getAttribute('data-try');ok(/c=blitz&seed=/.test(bl),T('Blitz challenge link'));
 await p.locator('.st-x').click();await p.waitForTimeout(300);
 ok(errs.length===0,T('no JavaScript or loading errors'),errs.slice(0,3).join(' | '));
 await ctx.close();}
await b.close();
console.log('TOTAL',R.length,'PASS',R.filter(r=>r[0]==='PASS').length);
})();
