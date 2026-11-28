const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});p.on('pageerror',e=>console.log(e.stack));
await p.goto('file:///home/claude/story-test/joseph-1.html');await p.waitForTimeout(500);await p.click('#start');await p.waitForTimeout(9000);await b.close()})();
