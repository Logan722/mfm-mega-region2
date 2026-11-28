const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8093/testimonies.html');await p.waitForTimeout(1200);
console.log(await p.evaluate(()=>({btns:[...document.querySelectorAll('[data-cat-btn]')].map(b=>b.textContent+'|'+b.hidden),vis:[...document.querySelectorAll('[data-it]')].filter(x=>!x.hidden).length,cnt:document.querySelector('[data-count]')?.textContent,scripts:[...document.scripts].map(s=>s.src).filter(Boolean)})),errs);await b.close();})();
