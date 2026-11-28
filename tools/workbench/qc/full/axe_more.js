const { chromium } = require('playwright');const fs=require('fs');
const AXE=fs.readFileSync('/home/claude/qc/node_modules/axe-core/axe.min.js','utf8');
const pages=['events/command-the-year-2027','events/ministers-conference-2027','events/austin-end-of-year-vigil','branches/mfm-tampa','branches/mfm-usa-prayer-city','messages/the-problem-that-keeps-coming-back-ends-here','gallery-nashville-2026','gallery-florida','newsletter/index','newsletter/issue-5','reach-out/prayer','reach-out/testimony','thanks','links','give','404'];
(async()=>{const b=await chromium.launch();
for(const [w,h,mob] of [[1440,900,false],[390,844,true]])for(const pg of pages){const c=await b.newContext({viewport:{width:w,height:h},isMobile:mob});const p=await c.newPage();
 await p.goto('http://localhost:8095/'+pg+'.html',{waitUntil:'load'});await p.waitForTimeout(1200);
 await p.addScriptTag({content:AXE});
 const r=await p.evaluate(async()=>{const res=await axe.run(document,{runOnly:['wcag2a','wcag2aa']});return res.violations.map(v=>({id:v.id,impact:v.impact,n:v.nodes.length,ex:v.nodes.slice(0,2).map(n=>n.target.join(' ').slice(0,80))}))});
 console.log(w,pg,r.length?JSON.stringify(r):'clean');await c.close();}
await b.close();})();
