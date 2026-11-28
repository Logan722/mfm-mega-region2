const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},isMobile:true});const p=await c.newPage();
await p.goto('http://localhost:8093/index.html#mv-b');await p.reload();await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>{const l=document.querySelector('.tsa-list'),s=document.querySelector('.tsa-small'),h=s.querySelector('h3'),pp=s.querySelector('p');const W=e=>Math.round(e.getBoundingClientRect().width);
return {mv:document.querySelector('.tsa').getAttribute('data-mv'),cols:getComputedStyle(l).gridTemplateColumns,list:W(l),tile:W(s),h3:W(h)+' sw'+h.scrollWidth+' ws:'+getComputedStyle(h).whiteSpace+' fs:'+getComputedStyle(h).fontSize+' style:'+h.getAttribute('style'),p:W(pp)+' sw'+pp.scrollWidth+' ws:'+getComputedStyle(pp).whiteSpace,inner:s.firstElementChild.tagName+':'+W(s.firstElementChild)}}));await b.close();})();
