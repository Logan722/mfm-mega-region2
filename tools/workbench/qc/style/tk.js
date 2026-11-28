const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();for(const w of [1440,390]){const p=await b.newPage({viewport:{width:w,height:900}});await p.goto('http://localhost:8097/events.html');await p.waitForTimeout(800);
console.log(w,JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.event-card-actions .ticket')].map(e=>{const s=getComputedStyle(e);return e.textContent.trim()+' '+s.color+' on '+s.backgroundColor}))));
await p.evaluate(()=>[...document.querySelectorAll('.event-card')].find(c=>/Command the Year 2027/.test(c.textContent)&&!/Ministers/.test(c.textContent)).scrollIntoView({block:'center'}));await p.waitForTimeout(1800);await p.screenshot({path:'/home/claude/qc/style/evcard-'+w+'.png'})}await b.close()})();
