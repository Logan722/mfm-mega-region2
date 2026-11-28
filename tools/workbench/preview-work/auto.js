const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1536,height:730}})).newPage();
await p.goto('http://localhost:8093/index.html',{waitUntil:'load'});await p.waitForTimeout(1000);
await p.locator('.ev2').scrollIntoViewIfNeeded();await p.mouse.move(700,400);
const a=[];for(let i=0;i<4;i++){a.push(await p.evaluate(()=>document.querySelector('.evx-k').textContent));await p.waitForTimeout(6200);}
console.log(a.join(' | '));await b.close();})();
