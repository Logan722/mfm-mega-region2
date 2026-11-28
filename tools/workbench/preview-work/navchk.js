const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const [w,h,t] of [[1536,800,'d'],[390,844,'m']]){const p=await (await b.newContext({viewport:{width:w,height:h}})).newPage();
for (const pg of ['play.html','index.html']){
await p.route('**/newsletter-popup-preview.js',r=>r.abort());
await p.goto('http://localhost:8093/'+pg,{waitUntil:'load'});await p.waitForTimeout(1500);
await p.mouse.wheel(0,1600);await p.waitForTimeout(800);
const info=await p.evaluate(()=>{const n=document.querySelector('#siteNav,.site-nav');const c=getComputedStyle(n);return {cls:document.documentElement.className,bg:c.backgroundColor,bgi:c.backgroundImage.slice(0,60),pos:c.position,top:n.getBoundingClientRect().top,y:scrollY}});
console.log(t,pg,JSON.stringify(info));await p.screenshot({path:`cmp/nav-${pg}-${t}.png`,clip:{x:0,y:0,width:w,height:120}});}
}
await b.close();})();
