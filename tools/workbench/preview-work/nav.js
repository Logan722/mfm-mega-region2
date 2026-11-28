const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const w of [1024,1280,1440,1536,1920]){const p=await (await b.newContext({viewport:{width:w,height:800}})).newPage();await p.route('**/newsletter-popup-preview.js',r=>r.abort());
await p.goto('http://localhost:8093/index.html',{waitUntil:'load'});await p.waitForTimeout(1200);
console.log(w,JSON.stringify(await p.evaluate(()=>{const r=s=>{const e=document.querySelector(s);if(!e)return null;const x=e.getBoundingClientRect();return [Math.round(x.left),Math.round(x.right)]};
 const logo=document.querySelector('.site-nav .nav-logo, .site-nav a.brand, .site-nav a:first-child');const nav=document.querySelector('#siteNav,.site-nav');const inner=nav&&nav.firstElementChild;
 return {logo:logo&&[logo.className,r('.site-nav .nav-logo')||r('.site-nav a')],cta:r('.site-nav .nav-cta'),inner:inner&&[inner.className,getComputedStyle(inner).paddingLeft,getComputedStyle(inner).maxWidth],box:r('.hbox'),play:r('.hb-play')}})));}
await b.close();})();
