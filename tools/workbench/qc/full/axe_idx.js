const { chromium } = require('playwright');const fs=require('fs');
const AXE=fs.readFileSync('/home/claude/qc/node_modules/axe-core/axe.min.js','utf8');
const pages=['index'];
(async()=>{const b=await chromium.launch();
for(const [w,h,mob] of [[1440,900,false],[390,844,true]])for(const pg of pages){const c=await b.newContext({viewport:{width:w,height:h},isMobile:mob});const p=await c.newPage();
 await p.goto('http://localhost:8095/'+pg+'.html',{waitUntil:'load'});await p.waitForTimeout(1200);
 await p.addScriptTag({content:AXE});
 const r=await p.evaluate(async()=>{const res=await axe.run(document,{runOnly:['wcag2a','wcag2aa']});return res.violations.map(v=>({id:v.id,impact:v.impact,n:v.nodes.length,ex:v.nodes.map(n=>n.target.join(' ').slice(0,80))}))});
 console.log(w,pg,r.length?JSON.stringify(r):'clean');await c.close();}
await b.close();})();
