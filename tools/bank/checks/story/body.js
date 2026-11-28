const { chromium } = require('playwright');
// AT=<ISO time> runs this check as if it were that moment (e.g. after the Play & Grow launch lock opens)
const __ctx = async (br, o) => { const c = await br.newContext(o); if (process.env.AT) await c.clock.install({ time: new Date(process.env.AT) }); return c; };

const [CH,SPEC,OUT]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const p=await (await __ctx(b, {viewport:{width:1400,height:900}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(`file://${process.env.MFM_REPO||require("path").resolve(__dirname,"../../../..")}/stories/${CH}.html`);await p.waitForTimeout(500);
await p.evaluate((spec)=>{document.getElementById('title').style.display='none';const svg=document.getElementById('svg');svg.setAttribute('viewBox','0 0 1280 720');
 const L=spec.split(',').map(s=>s.split(':'));let h=document.querySelector('#svg defs').outerHTML+'<rect width="1280" height="720" fill="#cfe8f5"/><rect y="640" width="1280" height="80" fill="#e8d8b4"/>';
 L.forEach(([id,pose,f],i)=>{const x=110+i*(1060/Math.max(1,L.length-1));h+=person(id,{x,y:660,s:1.3,f:+(f||1),k:1,expr:'smile',pose:pose||'stand'})});
 svg.innerHTML=h;svg.style.opacity=1;},SPEC);
await p.waitForTimeout(300);await p.locator('.box').screenshot({path:OUT+'.png'});console.log(errs.join('\n'));await b.close()})();
