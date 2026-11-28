const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for(const [w,h,t] of [[1440,900,'d'],[390,844,'m']]){const p=await b.newPage({viewport:{width:w,height:h}});
await p.goto('http://localhost:8095/index.html');const t0=Date.now();
await p.waitForSelector('.mfm-pop-backdrop.is-open',{timeout:15000});const appear=Date.now()-t0;
const o1=await p.evaluate(()=>getComputedStyle(document.querySelector('.mfm-pop-card')).opacity);
await p.waitForTimeout(150);await p.screenshot({path:`pop-mid-${t}.png`});
await p.waitForTimeout(900);const o2=await p.evaluate(()=>getComputedStyle(document.querySelector('.mfm-pop-card')).opacity);await p.screenshot({path:`pop-${t}.png`});
const txt=await p.locator('.mfm-pop-card').innerText();
console.log(t,'appeared after',appear,'ms; card opacity at start',o1,'→ after 1s',o2,'| text:',txt.replace(/\s+/g,' ').slice(0,160));
await p.fill('.mfm-pop-card input[name="FIRSTNAME"]','Test');await p.fill('.mfm-pop-card input[type="email"]','test@example.com');await p.locator('.mfm-pop-card button[type=submit], .mfm-pop-btn').first().click();await p.waitForTimeout(800);
console.log(t,'submit →',(await p.locator('.mfm-pop-status').innerText().catch(()=>'')).slice(0,80));
await p.close();}
const p=await b.newPage();for(const sub of ['prayer','testimony','general']){await p.goto('http://localhost:8095/reach-out.html#'+sub);await p.waitForTimeout(600);console.log('reach-out',sub,'→',await p.locator('#reach-out h2').first().innerText(),'|',await p.evaluate(()=>{const s=document.querySelector('#reach-out select');return s?s.options[s.selectedIndex].text:''}));}
await b.close();})();
