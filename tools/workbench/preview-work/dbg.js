const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1536,height:860}})).newPage();
await p.goto('http://localhost:8093/play.html',{waitUntil:'load'});await p.waitForTimeout(2000);
console.log(JSON.stringify(await p.evaluate(()=>{const l=document.querySelector('.pg-list'),li=l.querySelector('li'),bar=li.querySelector('.lb-bar'),i=bar.querySelector('i');const c=e=>getComputedStyle(e);
return {list:[c(l).marginLeft,c(l).width,c(l).display],li:[c(li).display,c(li).gridTemplateColumns],bar:[bar.getBoundingClientRect().width,c(bar).display],i:[i.getBoundingClientRect().width,c(i).display],em:[document.querySelector('.pg-emblem svg').getBoundingClientRect().width]}})));await b.close();})();
