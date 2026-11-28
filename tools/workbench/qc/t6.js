const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();for(const [w,h] of [[1440,900],[390,844]]){const p=await b.newPage({viewport:{width:w,height:h}});
await p.goto('http://localhost:8093/testimonies.html');await p.waitForTimeout(1000);
const r=await p.evaluate(async()=>{document.querySelector('[data-cat-btn="Youth"]').click();await new Promise(r=>setTimeout(r,100));const a=[...document.querySelectorAll('[data-it]')].filter(x=>!x.hidden).length;
const i=document.querySelector('[data-q-in]');i.value='generation';i.dispatchEvent(new Event('input'));await new Promise(r=>setTimeout(r,100));const b2=[...document.querySelectorAll('[data-it]')].filter(x=>!x.hidden).length;
document.querySelector('[data-read]').click();const m=document.getElementById('dzModal').classList.contains('open');return {youth:a,search:b2,modal:m,share:getComputedStyle(document.querySelector('.n5-share')).display}});
console.log(w,r);await p.close();}await b.close();})();
