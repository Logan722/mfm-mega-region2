const { chromium } = require('playwright');
const pages=['index','about','events','media','live','branches','ministries','women','gen218','gallery','play','messages/the-problem-that-keeps-coming-back-ends-here','branches/mfm-tampa','links'];
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},isMobile:true});const p=await c.newPage();
for(const pg of pages){try{await p.goto('http://localhost:8095/'+pg+'.html',{waitUntil:'load'});await p.waitForTimeout(1500);}catch(e){console.log(pg,'ERR');continue;}
const r=await p.evaluate(()=>{const out=[];document.querySelectorAll('main *').forEach(el=>{const kids=[...el.children].filter(k=>k.offsetParent&&k.getBoundingClientRect().height>120&&k.getBoundingClientRect().width>250);if(kids.length<3)return;
 const xs=new Set(kids.map(k=>Math.round(k.getBoundingClientRect().left)));if(xs.size!==1)return;
 const sec=el.closest('section');const h=sec&&sec.querySelector('h2');const tot=kids.reduce((a,k)=>a+k.getBoundingClientRect().height,0);
 out.push((el.className||el.tagName).toString().slice(0,40)+' | '+kids.length+' cards | '+Math.round(tot)+'px | '+(h?h.textContent.trim().slice(0,40):''));});
 return [...new Set(out)];});
console.log('== '+pg);r.forEach(x=>console.log('  '+x));}
await b.close();})();
