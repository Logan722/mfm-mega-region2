const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:1000}});
await p.goto('https://mfmmegaregion2usa.org/events?x='+Date.now(),{waitUntil:'load'});await p.waitForTimeout(2500);
const cards=p.locator('.event-card, article').filter({hasText:'Resurgence Center'});console.log('cards',await cards.count());
const c=cards.first();await c.scrollIntoViewIfNeeded();await c.screenshot({path:'rpn-card.png'});console.log((await c.innerText()).replace(/\s+/g,' '));await b.close();})();
