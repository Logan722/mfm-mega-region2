const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();for(let n=1;n<=2;n++){for(const [w,h] of [[1440,900],[390,844]]){const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8093/testimonies-'+n+'.html');await p.waitForTimeout(800);
const vis=()=>p.evaluate(()=>[...document.querySelectorAll('[data-it]')].filter(x=>!x.hidden).length);
const a=await vis();
await p.locator('[data-cat-btn="Youth"]').first().click();await p.waitForTimeout(200);const hl=await vis();
await p.locator('[data-cat-btn="all"]').first().click();
const m=p.locator('[data-more]');let more=null;if(await m.count()&&await m.isVisible()){await m.click();await p.waitForTimeout(200);more=await vis();}
const qi=p.locator('[data-q-in]').first();let q=null;if(await qi.count()&&await qi.isVisible()){await qi.fill('generation');await p.waitForTimeout(200);q=await vis();await qi.fill('');}
await p.locator('[data-read]').first().click();await p.waitForTimeout(200);const md=await p.evaluate(()=>document.getElementById('dzModal').classList.contains('open'));await p.keyboard.press('Escape');
console.log(n,w,{start:a,healing:hl,more,search:q,modal:md,errs});await p.close();}}await b.close();})();
