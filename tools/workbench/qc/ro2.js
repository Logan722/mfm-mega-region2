const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
for(const u of ['reach-out/prayer','reach-out/testimony','reach-out/contact','reach-out/contact?branch=MFM%20Tampa','reach-out']){await p.goto('http://localhost:8095/'+u.replace(/^([^?]+)/,'$1.html'));await p.waitForTimeout(800);
console.log(u,'|',await p.locator('#reach-out h2').first().innerText(),'|',await p.evaluate(()=>{const s=document.querySelector('#reach-out select');return s.options[s.selectedIndex].text+' | '+document.querySelector('#reach-out textarea').value}));}
await b.close();})();
