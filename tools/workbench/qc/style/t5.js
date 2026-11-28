const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8097/women.html');await p.waitForTimeout(400);
console.log(await p.evaluate(()=>{const e=[...document.querySelectorAll('small,span,p')].find(x=>x.textContent.trim()==='Women Foundation'&&x.offsetParent&&getComputedStyle(x).color==='rgb(20, 34, 64)');let o=[];for(let x=e;x&&o.length<5;x=x.parentElement)o.push(x.tagName+'.'+x.className+' '+getComputedStyle(x).backgroundColor);return o.join('\n')}));
await p.goto('http://localhost:8097/index.html');await p.waitForTimeout(400);
console.log(await p.evaluate(()=>{const e=[...document.querySelectorAll('.tsa-k')].find(x=>/Featured/.test(x.textContent));let o=[];for(let x=e;x&&o.length<4;x=x.parentElement)o.push(x.tagName+'.'+x.className+' '+getComputedStyle(x).backgroundColor);return o.join('\n')}));await b.close()})();
