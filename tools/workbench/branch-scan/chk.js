const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const base=process.argv[2];
const p=await b.newPage({viewport:{width:1440,height:900}});await p.route(/newsletter-popup/,r=>r.abort());
await p.goto(base+'/events'+(base.includes('localhost')?'.html':'')+'?x='+Date.now(),{waitUntil:'networkidle'});
await p.addStyleTag({content:'.site-nav,header,.live-strip,.skip-link{display:none!important}'});
const cards=await p.$$('.event-card');const want=[];for(const c of cards){const t=await c.innerText();if(/Riverdale|Bring Your Problems/.test(t))want.push(c)}
console.log('cards',want.length);
for(const [i,c] of want.entries()){await c.scrollIntoViewIfNeeded();await p.waitForTimeout(600);await c.screenshot({path:`card-${i}.png`});console.log((await c.innerText()).replace(/\s+/g,' '))}
const t=want.find(async c=>1);
await p.evaluate(()=>{const c=[...document.querySelectorAll('.event-card')].find(c=>/Bring Your Problems/.test(c.innerText));c.querySelector('.event-card-image').click()});await p.waitForTimeout(800);
console.log('POPUP:',(await p.innerText('#evtModal')).replace(/\s+/g,' ').slice(0,500));
await p.screenshot({path:'tampa-popup.png'});
const errs=[];for(const s of ['mfm-nashville','mfm-houston-3-city-of-refuge','mfm-usa-prayer-city','mfm-mansfield','mfm-orlando-citadel-of-solution']){const q=await b.newPage({viewport:{width:1440,height:900}});q.on('pageerror',e=>errs.push(s+': '+e.message));await q.goto(base+'/branches/'+s+(base.includes('localhost')?'.html':'')+'?x='+Date.now(),{waitUntil:'networkidle'});const info=await q.evaluate(()=>({sub:document.querySelector('.bp-sub')?.innerText,rows:[...document.querySelectorAll('.bp-row')].map(r=>r.innerText.replace(/\s+/g,' ')).join(' | '),soc:[...document.querySelectorAll('.bp-soc-row a')].map(a=>a.dataset.net+'='+a.href)}));console.log(s,JSON.stringify(info));if(s=='mfm-nashville'){await q.waitForTimeout(1500);await q.screenshot({path:'nashville-branch.png'})}await q.close()}
console.log('errors',errs);await b.close()})();
