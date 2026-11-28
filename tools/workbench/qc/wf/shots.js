const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const out = [];
  for (const n of [1,2,3,4,5]) {
    for (const [tag, vw, mob] of [['d',1440,false],['m',390,true]]) {
      const ctx = await b.newContext({ viewport:{width:vw,height:mob?844:900}, deviceScaleFactor:1, isMobile:mob, hasTouch:mob });
      const p = await ctx.newPage();
      const errs=[]; p.on('pageerror',e=>errs.push(e.message));
      await p.goto(`http://localhost:8093/media-${n}.html`, {waitUntil:'networkidle'});
      await p.addStyleTag({content:'.dz-pick{display:none!important}.site-header,header.site-header{position:absolute!important}'});
      // trigger lazy images
      await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=350){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,140));}window.scrollTo(0,0);});
      await p.waitForTimeout(1200);
      const info = await p.evaluate(()=>{
        const W=document.documentElement.clientWidth, over=[];
        document.querySelectorAll('main *').forEach(e=>{const r=e.getBoundingClientRect(); if(r.width&&r.right>W+1) over.push(e.tagName+'.'+e.className);});
        const left=[]; document.querySelectorAll('main h1,main h2,main h3,main p').forEach(e=>{const cs=getComputedStyle(e); if(cs.textAlign==='left'||cs.textAlign==='start') left.push(e.tagName+':'+e.textContent.trim().slice(0,30));});
        const broken=[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src'));
        return {h:document.body.scrollHeight, over:over.slice(0,5), left:left.slice(0,8), broken};
      });
      await p.screenshot({path:`/home/claude/qc/wf/md${n}-${tag}.png`, fullPage:true});
      out.push({n,tag,...info,errs});
      await ctx.close();
    }
  }
  console.log(JSON.stringify(out,null,1));
  await b.close();
})();
