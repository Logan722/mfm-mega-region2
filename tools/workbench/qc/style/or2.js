const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
for(const pg of ['index','ministries','events','live','reach-out','branches','play','testimonies']){await p.goto('http://localhost:8097/'+pg+'.html');await p.waitForTimeout(400);
console.log(pg,JSON.stringify(await p.evaluate(()=>{const o=[];document.querySelectorAll('a,button').forEach(e=>{if(!e.offsetParent)return;const a=(getComputedStyle(e).backgroundColor.match(/[\d.]+/g)||[]).map(Number);if(a[0]>150&&a[1]<110&&a[2]<70&&(a.length<4||a[3]>.5))o.push(e.className+'|'+e.parentElement.className+'|'+e.textContent.trim().slice(0,18))});
const s=[...document.querySelectorAll('a,button')].find(e=>/Share your testimony/.test(e.textContent)&&e.offsetParent);if(s)o.push('SHARE:'+s.className+'|'+s.parentElement.className+'|'+s.parentElement.parentElement.className);return o})))}await b.close()})();
