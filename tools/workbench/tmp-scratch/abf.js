const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const out=[];
for (const [tag,vw,mob] of [['d',1440,false],['t',820,false],['m',390,true],['s',360,true]]){
 const ctx=await b.newContext({viewport:{width:vw,height:mob?844:900},isMobile:mob,hasTouch:mob});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8093/about.html',{waitUntil:'networkidle'});
 await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=350){scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}scrollTo(0,0);});
 await p.waitForTimeout(800);
 const info=await p.evaluate(()=>{const W=document.documentElement.clientWidth;const sw=document.documentElement.scrollWidth;
  const left=[];document.querySelectorAll('main h1,main h2,main h3,main p').forEach(e=>{const cs=getComputedStyle(e);if((cs.textAlign==='left'||cs.textAlign==='start')&&e.offsetParent)left.push(e.textContent.trim().slice(0,30))});
  return {sw,W,broken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src),left:left.slice(0,6),h1:document.querySelectorAll('h1').length}});
 await p.addStyleTag({content:'.site-header,header.site-header{position:absolute!important}'});
 await p.screenshot({path:`/home/claude/qc/wf/abf-${tag}.png`,fullPage:true});
 // pop-up test
 await p.click('[data-ld-open="ab-ld-2"]');await p.waitForTimeout(300);
 const open=await p.evaluate(()=>document.getElementById('ab-ld-2').open);
 await p.screenshot({path:`/home/claude/qc/wf/abf-${tag}-pop.png`});
 await p.keyboard.press('Escape');await p.waitForTimeout(200);
 const closed=await p.evaluate(()=>!document.getElementById('ab-ld-2').open && document.activeElement.getAttribute('data-ld-open'));
 out.push({tag,...info,open,closed,errs});await ctx.close();}
console.log(JSON.stringify(out));await b.close();})();
