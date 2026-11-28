const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/story-test/index.html');
for(const s of ['A','B','C']){await p.click(`#tabs button[data-s=${s}]`);await p.waitForTimeout(800);
 for(const [i,w] of [[1,2600],[4,3400],[5,3400]]){/* advance */}
 await p.waitForTimeout(2600);await p.locator('.stagebox').screenshot({path:`st-${s}-1.png`});
 await p.click('#next');await p.click('#next');await p.waitForTimeout(1900);await p.click('#next');await p.waitForTimeout(700);await p.locator('.stagebox').screenshot({path:`st-${s}-3.png`});
 await p.click('#next');await p.waitForTimeout(1200);await p.locator('.stagebox').screenshot({path:`st-${s}-4.png`});
}
console.log('errors',errs);await b.close()})();
