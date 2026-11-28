const { chromium } = require('playwright');
// AT=<ISO time> runs this check as if it were that moment (e.g. after the Play & Grow launch lock opens)
const __ctx = async (br, o) => { const c = await br.newContext(o); if (process.env.AT) await c.clock.install({ time: new Date(process.env.AT) }); return c; };

const OUTDIR=process.env.OUT||require('fs').mkdtempSync(require('path').join(require('os').tmpdir(),'story-shots-'));
const [CH,IDS,OUT]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const p=await (await __ctx(b, {viewport:{width:1400,height:900}})).newPage();
await p.goto(`file://${process.env.MFM_REPO||require("path").resolve(__dirname,"../../../..")}/stories/${CH}.html`);await p.waitForTimeout(500);
await p.evaluate(([ids,YY,SS])=>{document.getElementById('title').style.display='none';const svg=document.getElementById('svg');svg.setAttribute('viewBox','0 0 1280 720');
 const L=ids.split(',');let h=document.querySelector('#svg defs').outerHTML+'<rect width="1280" height="720" fill="#cfe8f5"/>';
 L.forEach((id,i)=>{const x=120+i*(1040/Math.max(1,L.length-1));h+=person(id,{x,y:YY,s:SS,f:i%2?-1:1,k:1,expr:'neutral',pose:'stand'})});
 svg.innerHTML=h;svg.style.opacity=1;},[IDS,+(process.env.Y||1450),+(process.env.S||3)]);
for(const e of ['neutral','smile','happy','sad','surprised','angry','jealous']){await p.evaluate(e=>document.querySelectorAll('.p').forEach(x=>x.dataset.expr=e),e);await p.waitForTimeout(150);await p.locator('.box').screenshot({path:OUTDIR+'/'+`${OUT}-${e}.png`})}
await b.close()})();
