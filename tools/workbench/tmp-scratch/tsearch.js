const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:8095/testimonies.html',{waitUntil:'load'});await p.waitForTimeout(1200);
const vis=()=>p.evaluate(()=>[...document.querySelectorAll('.dz .tc')].filter(x=>x.offsetParent).length);
console.log('all',await vis());
for(const w of ['launch','baby','healing','zzzz']){await p.fill('input[type=search]',w);await p.waitForTimeout(400);console.log(w,await vis());}
await b.close();})();
