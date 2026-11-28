const { chromium } = require('playwright');const fs=require('fs');
const AXE=fs.readFileSync(__dirname+'/node_modules/axe-core/axe.min.js','utf8');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
for(const pg of process.argv.slice(2)){await p.goto('http://localhost:8095/'+pg);await p.waitForTimeout(2000);await p.addScriptTag({content:AXE});
const r=await p.evaluate(async()=>{const res=await axe.run(document,{runOnly:['wcag2a','wcag2aa']});return res.violations.flatMap(v=>v.nodes.map(n=>v.id+' | '+n.target.join(' ')+' | '+(n.any[0]&&n.any[0].message||'').slice(0,110)))});
console.log('##',pg);r.forEach(x=>console.log('  ',x));}
await b.close();})();
