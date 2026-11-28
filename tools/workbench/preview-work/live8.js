const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const u of ['preview-home','preview-play']) for (const [w,h] of [[1536,860],[390,844]]){const p=await (await b.newContext({viewport:{width:w,height:h}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('https://mfmmegaregion2usa.org/'+u,{waitUntil:'load'});await p.waitForTimeout(2500);
const info=await p.evaluate(()=>({ow:document.documentElement.scrollWidth-innerWidth,hbox:!!document.querySelector('.hbox'),hero2:!!document.querySelector('.hv2'),ev2:!!document.querySelector('.ev2')}));
if(u==='preview-play'&&w>1000)await p.screenshot({path:'cmp/live8-play-d.png'});
console.log(u,w,JSON.stringify(info),JSON.stringify(errs));}
await b.close();})();
