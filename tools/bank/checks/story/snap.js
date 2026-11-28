const { chromium } = require('playwright');
// AT=<ISO time> runs this check as if it were that moment (e.g. after the Play & Grow launch lock opens)
const __ctx = async (br, o) => { const c = await br.newContext(o); if (process.env.AT) await c.clock.install({ time: new Date(process.env.AT) }); return c; };

const OUTDIR=process.env.OUT||require('fs').mkdtempSync(require('path').join(require('os').tmpdir(),'story-shots-'));
const [CH,SC,MS,OUT]=process.argv.slice(2);const W=+process.env.W||1280,H=+process.env.H||900;
(async()=>{const b=await chromium.launch();const p=await (await __ctx(b, {viewport:{width:W,height:H}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(`file://${process.env.MFM_REPO||require("path").resolve(__dirname,"../../../..")}/stories/${CH}.html#scene-${SC}`);
for(const t of MS.split(',')){await p.waitForTimeout(+t);await p.locator('.box').screenshot({path:OUTDIR+'/'+`${OUT}-${t}.png`})}
console.log(errs.join('\n'));await b.close()})();
