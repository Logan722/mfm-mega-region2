const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();let bad=0;
for(const w of [1440,390]){const c=await b.newContext({viewport:{width:w,height:900},isMobile:w<500});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
for(const pg of ['/','/events','/events/command-the-year-2027','/events/ministers-conference-2027','/play','/play?play=quiz','/media','/live','/about','/women','/gen218','/ministries','/testimonies','/reach-out','/subscribe','/branches','/gallery','/privacy','/newsletter']){errs.length=0;
const r=await p.goto('https://mfmmegaregion2usa.org'+pg,{waitUntil:'load'}).catch(e=>null);await p.waitForTimeout(900);
const broken=await p.evaluate(()=>[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.offsetParent&&!/tile.openstreetmap/.test(i.src)).map(i=>i.src.split('/').pop()));
if(!r||r.status()>=400||errs.length||broken.length){bad++;console.log(w,pg,r&&r.status(),errs.slice(0,2),broken.slice(0,3))}}
await c.close()}
const lb=await (await fetch('https://mfmmegaregion2usa.org/.netlify/functions/leaderboard')).text();console.log('leaderboard',lb.slice(0,120));
console.log('problems',bad);await b.close()})();
