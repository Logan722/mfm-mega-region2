const { chromium } = require('playwright');
const fs=require('fs');
const root='/home/claude/mfm-mega-region2';
let pages=['index','about','women','gen218','media','live','ministries','play','testimonies','reach-out','reach-out/prayer','events','branches','gallery','privacy','subscribe','newsletter/index','thanks','gallery-florida','youth','new-here','contact'];
for (const d of ['events','branches','messages']) { const f=fs.readdirSync(root+'/'+d).filter(x=>x.endsWith('.html')).slice(0,2); pages.push(...f.map(x=>d+'/'+x.replace('.html',''))); }
pages=pages.filter(p=>fs.existsSync(root+'/'+p+'.html'));
(async()=>{const b=await chromium.launch();
for (const w of [1440,390]){const c=await b.newContext({viewport:{width:w,height:900},isMobile:w<500});const p=await c.newPage();
for(const pg of pages){await p.goto('http://localhost:8097/'+pg+'.html',{waitUntil:'load'}).catch(()=>{});await p.waitForTimeout(500);
const r=await p.evaluate(()=>{const rgb=s=>(s.match(/[\d.]+/g)||[]).map(Number);const L=a=>{const c=a.slice(0,3).map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const sel='.eyebrow, span.k, p.k, .ev2-k, .tsa-k, .legal-eyebrow, .sub-eyebrow, .ek-eyebrow, .tc .tag, .message-card small, .lv-badge, .hb-k, .cd-lab, .hg-k, .hg-tag, .video-frame > span, .evx-flyer > span';
const out=[];document.querySelectorAll(sel).forEach(el=>{if(!el.offsetParent||!el.textContent.trim())return;const fg=rgb(getComputedStyle(el).color);let bg=null,img=false;
for(let e=el;e;e=e.parentElement){const s=getComputedStyle(e);if(s.backgroundImage!=='none'&&!/gradient/.test(s.backgroundImage)){img=true;break}const a=rgb(s.backgroundColor);if(a.length&&(a.length<4||a[3]>.5)){bg=a;break}
 const sib=e.parentElement&&[...e.parentElement.children].find(x=>x!==e&&/^(IMG|PICTURE|VIDEO)$/.test(x.tagName));if(sib&&getComputedStyle(e).position!=='static'){img=true;break}}
const lf=L(fg);let bad=false,why='';if(img){if(lf<.25){bad=true;why='dark on photo'}}else{bg=bg||[255,255,255];const lb=L(bg);const cr=(Math.max(lf,lb)+.05)/(Math.min(lf,lb)+.05);if(cr<4.5){bad=true;why='ratio '+cr.toFixed(1)}}
if(bad)out.push([why,el.className,el.textContent.trim().slice(0,30),getComputedStyle(el).color])});return out});
r.forEach(x=>console.log(w,pg,'|',x.join(' | ')));}
await c.close();}await b.close();})();
