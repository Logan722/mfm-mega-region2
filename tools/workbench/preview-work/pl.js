const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1280,height:800}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('https://mfmmegaregion2usa.org/preview-play',{waitUntil:'load'});await p.waitForTimeout(2500);
const t=await p.evaluate(()=>document.body.innerText);console.log('quiz words:',(t.match(/\bquiz\w*/gi)||[]).join(','));console.log('has Play & Grow · Day?', /Day \d|Today’s Play & Grow/.test(t));console.log('errors',JSON.stringify(errs));await b.close();})();
