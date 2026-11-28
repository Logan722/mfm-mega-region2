const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:8093/ministries.html');await p.waitForTimeout(1000);
console.log(JSON.stringify(await p.evaluate(()=>{const s=document.querySelectorAll('section')[1];const l=s.querySelector('.container,div');return [getComputedStyle(s).paddingBottom,[...s.querySelectorAll('*')].map(e=>[e.tagName,e.className,getComputedStyle(e).marginBottom,getComputedStyle(e).paddingBottom]).slice(0,8), getComputedStyle(document.querySelectorAll('section')[2]).paddingTop, getComputedStyle(document.querySelectorAll('section')[2].firstElementChild).marginTop]})));
await p.goto('http://localhost:8093/reach-out.html');await p.waitForTimeout(1000);
console.log(JSON.stringify(await p.evaluate(()=>{const e=[...document.querySelectorAll('*')].find(x=>x.childNodes.length&&x.textContent.trim().toLowerCase()==='reach out to us');let a=[];for(let c=e;c&&a.length<5;c=c.parentElement)a.push([c.tagName,c.className,getComputedStyle(c).color]);return a})));
await b.close();})();
