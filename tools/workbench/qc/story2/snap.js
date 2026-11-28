const { chromium } = require('playwright');
const [CH,SC,MS,OUT]=process.argv.slice(2);const W=+process.env.W||1280,H=+process.env.H||900;
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:W,height:H}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(`file:///home/claude/mfm-mega-region2/stories/${CH}.html#scene-${SC}`);
for(const t of MS.split(',')){await p.waitForTimeout(+t);await p.locator('.box').screenshot({path:`${OUT}-${t}.png`})}
console.log(errs.join('\n'));await b.close()})();
