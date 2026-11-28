const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
const res={};
for(const pg of ['index','about','women','gen218','media','live','ministries','testimonies','reach-out','events','branches','gallery','subscribe','newsletter/index']){await p.goto('http://localhost:8097/'+pg+'.html');await p.waitForTimeout(400);
const r=await p.evaluate(()=>{const o=[];document.querySelectorAll('body *').forEach(e=>{if(!e.offsetParent)return;const s=getComputedStyle(e);
if(/rgb\(201, 149, 44\) 0px 0px 0px 2px inset/.test(s.boxShadow)&&e.matches('a,button'))o.push('RING '+e.className+' "'+e.textContent.trim().slice(0,20)+'"');
const a=(s.color.match(/[\d.]+/g)||[]).map(Number);if(a[0]>150&&a[1]<110&&a[2]<70&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&parseFloat(s.fontSize)<16)o.push('ORANGE '+e.tagName+'.'+e.className+' <'+e.parentElement.className+' < '+e.parentElement.parentElement.className+'> '+e.textContent.trim().slice(0,20))});return [...new Set(o)]});
r.forEach(x=>(res[x]=res[x]||[]).push(pg))}
Object.entries(res).forEach(([k,v])=>console.log(k,'|',v.join(',')));await b.close()})();
