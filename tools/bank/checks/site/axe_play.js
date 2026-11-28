const { chromium } = require('playwright');const fs=require('fs');
const AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js',{paths:[__dirname,process.env.NODE_PATH||'']}),'utf8');
(async()=>{const b=await chromium.launch();
for(const [w,h,mob] of [[1440,900,false],[390,844,true]]){const c=await b.newContext({viewport:{width:w,height:h},isMobile:mob});const p=await c.newPage();
 await p.goto('http://localhost:8095/play',{waitUntil:'load'});await p.waitForTimeout(1200);await p.addScriptTag({content:AXE});
 const run=async(tag)=>{const r=await p.evaluate(async()=>{const res=await axe.run(document,{runOnly:['wcag2a','wcag2aa']});return res.violations.map(v=>({id:v.id,n:v.nodes.length,ex:v.nodes.slice(0,4).map(n=>n.target.join(' ')+' '+(n.failureSummary||'').slice(0,120))}))});console.log(w,tag,r.length?JSON.stringify(r):'clean')};
 await run('page');
 await p.click('#live [data-live="join"]');await p.waitForTimeout(600);await run('live-home');
 await p.evaluate(()=>document.querySelector('[data-lv="host"]').click());await p.waitForTimeout(600);await run('live-setup');
 await c.close();}
await b.close();})();
