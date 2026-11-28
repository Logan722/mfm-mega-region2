// Preview-only phone layouts injected into the real pages, then screenshotted. Nothing here touches the website.
const { chromium } = require('playwright');
const BASE='http://localhost:8095/';
const CSS={
swipe:(s)=>`${s}{display:flex!important;overflow-x:auto!important;scroll-snap-type:x mandatory;gap:12px!important;margin-left:0!important;margin-right:0!important;padding:2px 0 6px!important;scrollbar-width:none;grid-template-columns:none!important;max-width:100%!important;width:100%!important;box-sizing:border-box}
${s}>*{flex:0 0 84%!important;max-width:84%!important;scroll-snap-align:center;margin:0!important}
.pv-dots{display:flex;justify-content:center;gap:8px;margin:14px 0 0}.pv-dots i{width:9px;height:9px;border-radius:50%;background:#cdc6bc}.pv-dots i:first-child{width:26px;border-radius:5px;background:#c9952c}`,
tiles:(s)=>`${s}{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:10px!important}
${s}>*{min-width:0}${s} h3,${s} h4,${s} strong{font-size:15px!important;line-height:1.25!important}${s} p{font-size:12.5px!important}${s} [class*=div] i,${s}>* div>div{display:none}`,
rows:(s,img)=>`${s}{display:flex!important;flex-direction:column;gap:0!important;background:#fff;border:1px solid #e8e4da;border-radius:14px;overflow:hidden}
${s}>*{display:grid!important;grid-template-columns:118px minmax(0,1fr)!important;gap:12px!important;align-items:center;padding:10px!important;border:0!important;border-bottom:1px solid #eee8dc!important;border-radius:0!important;box-shadow:none!important;margin:0!important;background:#fff!important}
${s}>*:last-child{border-bottom:0!important}${s} ${img}{width:118px!important;height:auto!important;aspect-ratio:16/9;object-fit:cover;border-radius:8px}
${s}>*>a:first-child{width:118px!important;height:auto!important;aspect-ratio:16/9;position:relative;border-radius:8px;overflow:hidden;display:block;align-self:center}${s}>*>a:first-child img{width:100%!important;height:100%!important;object-fit:cover;aspect-ratio:auto!important}${s}>*>a:first-child span{transform:scale(.6)}
${s} h3,${s} h4{font-size:15px!important;line-height:1.3!important;margin:2px 0!important;text-align:left}${s} small{font-size:10.5px!important}${s} p{font-size:12px!important;margin:0!important}
${s}>*>div{text-align:left!important;padding:0!important}${s}>*>div>div{display:none!important}`,
};
async function sheet(b,url,secSel,opts,out,setup){
 const shots=[];
 for(const o of opts){const c=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await c.newPage();
  await p.goto(BASE+url,{waitUntil:'load'});await p.waitForTimeout(1500);
  await p.evaluate(()=>{document.querySelectorAll('.skip-link').forEach(e=>e.remove());document.querySelectorAll('#siteNav,[data-mfm-header],.site-nav').forEach(e=>e.style.visibility='hidden');document.querySelectorAll('[class*="nl-"]').forEach(e=>{if(getComputedStyle(e).position==='fixed')e.remove()});document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')});
  if(o.css)await p.addStyleTag({content:o.css});
  if(o.js)await p.evaluate(o.js);
  await p.waitForTimeout(900);
  const el=p.locator(secSel).first();await el.scrollIntoViewIfNeeded();await p.waitForTimeout(500);
  const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(ov>0)console.log('OVERFLOW',out,o.k,ov);const f=`/home/claude/mobilepat/${out}-${o.k}.png`;await el.screenshot({path:f});shots.push([o.label,f]);await c.close();}
 return shots;
}
const dots=(sel)=>`(()=>{const g=document.querySelector('${sel}');const d=document.createElement('div');d.className='pv-dots';d.innerHTML='<i></i>'.repeat(Math.min(g.children.length,9));g.after(d);})()`;
const showMore=(sel,n)=>`(()=>{const g=document.querySelector('${sel}');[...g.children].forEach((c,i)=>{if(i>=${n})c.style.display='none'});const b=document.createElement('div');b.style.cssText='text-align:center;margin:16px 0 0';b.innerHTML='<button style="min-height:46px;padding:0 24px;border-radius:100px;border:1.5px solid #142240;background:#fff;font:700 14px Inter Tight,sans-serif;color:#142240">Show '+(g.children.length-${n})+' more</button>';g.after(b);})()`;
(async()=>{const b=await chromium.launch();const fs=require('fs');const all=fs.existsSync('/home/claude/mobilepat/shots.json')?JSON.parse(fs.readFileSync('/home/claude/mobilepat/shots.json')):{};const ONLY=process.argv.slice(2);const want=k=>!ONLY.length||ONLY.includes(k);
// 1 messages (Live)
const MG='#lvGrid';
if(want('live'))all.live=await sheet(b,'live.html','section:has(#lvGrid)',[
 {k:'now',label:'Now (stacked)'},
 {k:'rows',label:'Compact rows + Show more',css:CSS.rows(MG,'img'),js:showMore(MG,4)},
 {k:'swipe',label:'Swipe cards',css:CSS.swipe(MG),js:dots(MG)},
 {k:'tiles',label:'Two-across tiles',css:CSS.tiles(MG)+`${MG} .message-card>div>p,${MG} .message-card>div>div{display:none!important}`,js:showMore(MG,6)}],'live');
// 2 women messages
const WM='.ministry-feed .message-grid, section .message-grid';
if(want('women'))all.women=await sheet(b,'women.html','section:has(.message-grid)',[
 {k:'now',label:'Now (stacked)'},
 {k:'swipe',label:'Swipe cards',css:CSS.swipe('.message-grid'),js:dots('.message-grid')},
 {k:'rows',label:'Compact rows',css:CSS.rows('.message-grid','img')}],'women');
// 3 related messages
const RM='.msg-related';
if(want('related'))all.related=await sheet(b,'messages/the-problem-that-keeps-coming-back-ends-here.html','.msg-related',[
 {k:'now',label:'Now (stacked)'},
 {k:'rows',label:'Compact rows',css:CSS.rows(RM,'img')+`${RM} .msg-rc{grid-template-columns:118px minmax(0,1fr)!important}${RM} .rc-b{padding:0!important;text-align:left}`},
 {k:'swipe',label:'Swipe cards',css:CSS.swipe(RM),js:dots(RM)}],'related');
// 4 values
const VG='.values-grid';
const acc=`(()=>{document.querySelectorAll('.values-grid>article').forEach((a,i)=>{const p=a.querySelector('p'),h=a.querySelector('h3');a.style.cssText='padding:16px 18px;cursor:pointer;text-align:center';h.insertAdjacentHTML('beforeend',' <span style="color:#c9952c;font-family:Inter Tight">'+(i===0?'\\u2212':'+')+'</span>');if(i>0)p.style.display='none';});})()`;
if(want('values'))all.values=await sheet(b,'women.html','section:has(.values-grid)',[
 {k:'now',label:'Now (stacked)'},
 {k:'acc',label:'Tap to open',css:`${VG}{gap:8px!important}${VG}>article b{display:none}${VG}>article h3{margin:0!important;font-size:20px!important}${VG}>article p{margin:8px 0 0!important}`,js:acc},
 {k:'swipe',label:'Swipe cards',css:CSS.swipe(VG),js:dots(VG)}],'values');
// 5 ministries
const MI='.ministry-grid';
const tabs=`(()=>{const g=document.querySelector('.ministry-grid');const arts=[...g.children];const bar=document.createElement('div');bar.style.cssText='display:flex;gap:6px;justify-content:center;margin:0 0 16px;flex-wrap:nowrap';
arts.forEach((a,i)=>{const t=a.querySelector('h2').textContent.replace(' Foundation','').replace(' Singles','');bar.insertAdjacentHTML('beforeend','<button style="flex:1;min-height:42px;border-radius:100px;font:700 13.5px Inter Tight,sans-serif;border:1.5px solid '+(i?'#d9d1c2':'#142240')+';background:'+(i?'#fff':'#142240')+';color:'+(i?'#142240':'#fff')+'">'+t+'</button>');if(i)a.style.display='none';});g.prepend(bar);})()`;
if(want('ministries'))all.ministries=await sheet(b,'ministries.html','section.ministry-grid',[
 {k:'now',label:'Now (stacked)'},
 {k:'tabs',label:'Tabs',js:tabs},
 {k:'swipe',label:'Swipe cards',css:CSS.swipe(MI),js:dots(MI)}],'ministries');
// 6 home albums
const HM='.hg-more';
if(want('albums'))all.albums=await sheet(b,'index.html','section.home-gallery',[
 {k:'now',label:'Now (compact rows)'},
 {k:'tiles',label:'Two-across tiles',css:`${HM}{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important}${HM}>a{display:flex!important;flex-direction:column!important;align-items:center;text-align:center;gap:8px;padding:0 0 12px!important}${HM}>a picture,${HM}>a img{width:100%!important;height:auto!important;aspect-ratio:4/3;object-fit:cover;border-radius:10px 10px 0 0}${HM} strong{font-size:15px!important}${HM} small{font-size:11.5px!important}`},
 {k:'swipe',label:'Swipe cards',css:CSS.swipe(HM)+`${HM}>a{display:flex!important;flex-direction:column!important;align-items:center;text-align:center;gap:10px;padding:0 0 14px!important}${HM}>a picture,${HM}>a img{width:100%!important;height:auto!important;aspect-ratio:16/10;object-fit:cover}`,js:dots(HM)}],'albums');
require('fs').writeFileSync('/home/claude/mobilepat/shots.json',JSON.stringify(all));await b.close();})();
