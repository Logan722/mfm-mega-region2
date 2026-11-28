const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const [w,h,tag] of [[1536,730,'d'],[390,844,'m']]){
 for (const [url,who,secs] of [['https://mfm-homepage-refinement-preview.damibabe906.chatgpt.site/','ref',[['#events','events'],['.testimony-a','testi']]],['https://mfmmegaregion2usa.org/preview-home','ours',[['.ev2','events'],['.tsa','testi'],['.today','today']]]]){
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});const p=await ctx.newPage();
  await p.goto(url,{waitUntil:'load'});await p.waitForTimeout(2000);
  await p.evaluate(()=>{document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');document.documentElement.style.scrollBehavior='auto'});
  await p.waitForTimeout(5000);
  await p.evaluate(()=>{document.querySelectorAll('.mfm-pop-backdrop,[class*=popup],.popup,.preview-ribbon,.pv-banner').forEach(x=>{if(getComputedStyle(x).position==='fixed')x.remove()});document.documentElement.style.overflow='';document.body.style.overflow='';
    const st=document.createElement('style');st.textContent='header,.site-header,.nav,[class*=nav-wrap]{position:absolute!important} .skip-link{display:none!important}';document.head.appendChild(st);});
  for (const [sel,n] of secs){const el=p.locator(sel).first();await el.scrollIntoViewIfNeeded();await p.waitForTimeout(700);
    await p.evaluate(()=>{document.querySelectorAll('[role=dialog],.popup-backdrop,.popup-overlay').forEach(x=>x.remove());document.querySelectorAll('body *').forEach(x=>{const ps=getComputedStyle(x).position;if(ps==='fixed'||ps==='sticky')x.style.visibility='hidden'})});
    await el.screenshot({path:`cmp/${who}-${n}-${tag}.png`});}
  await ctx.close();}}
await b.close();})();
