const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const res={};
  for (const [tag, vw, mob] of [['d',1440,false],['t',820,true],['m',390,true],['s',360,true]]) {
    const ctx = await b.newContext({ viewport:{width:vw,height:mob?844:900}, isMobile:mob, hasTouch:mob });
    const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
    await p.goto('http://localhost:8093/women.html',{waitUntil:'networkidle'});
    await p.addStyleTag({content:'.site-header{position:absolute!important}'});
    await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=350){scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}scrollTo(0,0);});
    await p.waitForTimeout(1000);
    res[tag]=await p.evaluate(()=>{const W=document.documentElement.clientWidth;
      const left=[...document.querySelectorAll('main h1,main h2,main h3,main p')].filter(e=>e.offsetParent&&['left','start'].includes(getComputedStyle(e).textAlign)).map(e=>e.textContent.trim().slice(0,30));
      return {sw:document.documentElement.scrollWidth,W,h:document.body.scrollHeight,left:left.slice(0,5),broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth&&i.offsetParent).map(i=>i.src),dots:document.querySelectorAll('.only-m .sw-dots button').length}});
    res[tag].errs=errs;
    await p.screenshot({path:`/home/claude/qc/wf/f-${tag}.png`,fullPage:true});
    if (tag==='m'||tag==='d') {
      if(tag==='m'){ await p.locator('.only-m button.lead').first().click(); await p.waitForTimeout(600);
        await p.screenshot({path:`/home/claude/qc/wf/f-${tag}-pop.png`});
        res[tag].dialog=await p.evaluate(()=>{const d=document.querySelector('dialog[open]');return d?{w:d.getBoundingClientRect().width,h:d.getBoundingClientRect().height,fs:document.activeElement.className}:null});
        await p.keyboard.press('Escape'); await p.waitForTimeout(500);
        res[tag].afterEsc=await p.evaluate(()=>!!document.querySelector('dialog[open]'));
        await p.locator('.only-m button.lead').nth(1).click(); await p.waitForTimeout(600);
        await p.screenshot({path:`/home/claude/qc/wf/f-${tag}-pop2.png`});
        await p.mouse.click(10,10); await p.waitForTimeout(500);
        res[tag].afterBackdrop=await p.evaluate(()=>!!document.querySelector('dialog[open]'));
        // swipe pillars
        await p.locator('.only-m .pils').scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
        const bx=await p.locator('.only-m .pils').boundingBox();
        await p.screenshot({path:`/home/claude/qc/wf/f-m-pils.png`,clip:{x:0,y:bx.y-10,width:390,height:bx.height+20}});
      }
    }
    await ctx.close();
  }
  console.log(JSON.stringify(res,null,1)); await b.close();
})();
