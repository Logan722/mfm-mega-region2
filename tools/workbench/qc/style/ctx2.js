const { chromium } = require('playwright');
const fs=require('fs');const root='/home/claude/mfm-mega-region2';
let pages=['index','about','women','gen218','media','live','ministries','play','testimonies','reach-out','events','branches','gallery','privacy','subscribe','newsletter/index','reach-out/prayer','thanks','youth','new-here','gallery-florida','contact'];
for (const d of ['events','branches','messages']) { const f=fs.readdirSync(root+'/'+d).filter(x=>x.endsWith('.html')).slice(0,2); pages.push(...f.map(x=>d+'/'+x.replace('.html',''))); }
pages=pages.filter(p=>fs.existsSync(root+'/'+p+'.html'));
(async()=>{const b=await chromium.launch();for(const w of [1440,390]){const c=await b.newContext({viewport:{width:w,height:900},isMobile:w<500});const p=await c.newPage();
for(const pg of pages){await p.goto('http://localhost:8097/'+pg+'.html').catch(()=>{});await p.waitForTimeout(400);
const r=await p.evaluate(()=>{const rgb=s=>(s.match(/[\d.]+/g)||[]).map(Number);const L=a=>{const c=a.slice(0,3).map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4});return .2126*c[0]+.7152*c[1]+.0722*c[2]};const cr=(a,b)=>{const x=L(a),y=L(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const out=[];let orange=0;document.querySelectorAll('a,button').forEach(e=>{if(!e.offsetParent)return;const s=getComputedStyle(e);const bg=rgb(s.backgroundColor);if(bg.length===4&&bg[3]<.5)return;
if(bg[0]>150&&bg[1]<110&&bg[2]<70)orange++;
let pb=null;for(let x=e.parentElement;x;x=x.parentElement){const t=getComputedStyle(x);if(t.backgroundImage!=='none'&&!/gradient/.test(t.backgroundImage)){pb='img';break}if(/gradient/.test(t.backgroundImage)){const m=t.backgroundImage.match(/rgba?\([^)]+\)/);if(m){pb=rgb(m[0]);break}}const a=rgb(t.backgroundColor);if(a.length&&(a.length<4||a[3]>.5)){pb=a;break}}
const isW=bg[0]>240&&bg[1]>240,isN=bg[0]===20&&bg[1]===34;if(!isW&&!isN)return;
const dark=pb==='img'||(pb&&L(pb)<.2)||(!pb&&e.closest('.nav-links,.home-hero'));
if((dark&&isN)||(!dark&&isW&&pb&&pb!=='img'&&cr(bg,pb)<1.6))out.push((dark?'DARK ':'LIGHT ')+(isW?'white ':'navy ')+e.className+' "'+e.textContent.trim().slice(0,22)+'"')});return [orange,out]});
if(r[0]||r[1].length)console.log(w,pg,'orange-btns',r[0],JSON.stringify(r[1]))}await c.close()}await b.close()})();
