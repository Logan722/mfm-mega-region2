const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
for(const pg of ['index','about','women','gen218','media','testimonies']){await p.goto('http://localhost:8097/'+pg+'.html');await p.waitForTimeout(400);
const r=await p.evaluate(()=>{const isO=s=>{const a=(s.match(/[\d.]+/g)||[]).map(Number);const[r,g,b]=a;return a.length&&r>150&&g<110&&b<70&&(a.length<4||a[3]>.5)};let btn=0,fill=0,txt=0;
document.querySelectorAll('body *').forEach(e=>{if(!e.offsetParent)return;const s=getComputedStyle(e);if(isO(s.backgroundColor)||/gradient/.test(s.backgroundImage)&&/rgb\((19|2[0-4]\d),\s?(\d|[1-9]\d|10\d),/.test(s.backgroundImage)){if(e.matches('a,button'))btn++;else if(e.offsetWidth>200)fill++}else if(isO(s.color)&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))txt++});return {btn,fill,txt}});
console.log(pg,JSON.stringify(r))}await b.close()})();
