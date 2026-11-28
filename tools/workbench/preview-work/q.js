const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1536,height:860}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8093/play.html',{waitUntil:'load'});await p.waitForTimeout(2000);
console.log(JSON.stringify(await p.evaluate(()=>({heroes:[...document.querySelectorAll('[data-hero]')].map(h=>h.getAttribute('data-hero')+(h.hidden?'h':'v')),meta:document.querySelectorAll('.pg-meta').length,pick:document.querySelectorAll('.hv-pick').length}))));
await p.evaluate(()=>localStorage.setItem('mfm-quiz-me',JSON.stringify({guest:true})));
await p.evaluate(()=>document.querySelector('[data-pack="bible"]').click());await p.waitForTimeout(600);
console.log('bible pack questions:',await p.evaluate(()=>document.querySelectorAll('.st-prog i').length), await p.textContent('.st-qn'));
await p.screenshot({path:'cmp/v8-hero-d.png'});
console.log('errs',JSON.stringify(errs));await b.close();})();
