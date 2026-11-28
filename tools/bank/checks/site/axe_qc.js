const { chromium } = require('playwright');const fs=require('fs');
const AXE=fs.readFileSync(__dirname+'/node_modules/axe-core/axe.min.js','utf8');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
const scan=async(name,ctx)=>{await p.addScriptTag({content:AXE});const r=await p.evaluate(async(c)=>{const res=await axe.run(c?document.querySelector(c):document,{runOnly:['wcag2a','wcag2aa']});return res.violations.map(v=>({id:v.id,impact:v.impact,n:v.nodes.length,ex:v.nodes.slice(0,2).map(n=>n.target.join(' ')+' :: '+(n.failureSummary||'').split('\n')[1])}))},ctx);console.log('##',name,r.length?'':'— no WCAG A/AA problems');for(const v of r)console.log('  ',v.impact,v.id,v.n,JSON.stringify(v.ex));};
await p.goto('http://localhost:8095/play.html');await p.waitForTimeout(2000);await scan('Play & Grow page');
await p.locator('.pg-games [data-mode="quiz"]').click();await p.waitForTimeout(500);await scan("Who's playing",'#play-app');
await p.locator('.st-skip').first().click();await p.waitForTimeout(500);await scan('Quiz setup','#play-app');
await p.locator('.st-go').click();await p.waitForTimeout(1500);await scan('Question','#play-app');
await p.locator('#play-app .ans').first().click();await p.waitForTimeout(400);await scan('Answer sheet','#play-app');
await p.keyboard.press('Escape');await p.waitForTimeout(400);
await p.locator('.pg-games [data-mode="blitz"]').click();await p.waitForTimeout(1500);await scan('Blitz','#play-app');await p.keyboard.press('Escape');await p.waitForTimeout(400);
await p.locator('.pg-games [data-mode="word"]').click();await p.waitForTimeout(1500);await scan('Word','#play-app');await p.keyboard.press('Escape');await p.waitForTimeout(400);
await p.locator('.pg-games [data-mode="team"]').click();await p.waitForTimeout(600);await scan('Team setup','#play-app');await p.keyboard.press('Escape');await p.waitForTimeout(400);
for(const pg of ['index','testimonies','reach-out']){await p.goto('http://localhost:8095/'+pg+'.html');await p.waitForTimeout(2000);await scan(pg);}
await b.close();})();
