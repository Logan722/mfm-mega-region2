const { chromium } = require('playwright');const fs=require('fs'),path=require('path');
const ROOT='/home/claude/mfm-mega-region2';
const redirects=fs.readFileSync(ROOT+'/_redirects','utf8').split('\n').map(l=>l.trim().split(/\s+/)).filter(a=>a[0]&&a[0][0]==='/');
const exists=(u)=>{let p=u.split('#')[0].split('?')[0];if(!p||p==='/')return true;if(redirects.some(r=>r[0]===p||r[0]===p.replace(/\/$/,'')))return true;const f=path.join(ROOT,p);if(fs.existsSync(f)&&fs.statSync(f).isFile())return true;if(fs.existsSync(f+'.html'))return true;if(fs.existsSync(path.join(f,'index.html')))return true;return false;};
const pages=['index','play','testimonies','reach-out','reach-out/prayer','reach-out/testimony','reach-out/contact','about','branches/mfm-tampa'];
(async()=>{const b=await chromium.launch();let fails=0;
for(const [w,h,t] of [[1440,900,'desktop'],[390,844,'phone']]){
 for(const pg of pages){const ctx=await b.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();const errs=[],csp=[],bad=[];
  await p.addInitScript(()=>{document.addEventListener('securitypolicyviolation',e=>{(window.__csp=window.__csp||[]).push(e.violatedDirective+' '+e.blockedURI)})});
  p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push(m.text().slice(0,160))});p.on('response',r=>{if(r.status()>=400)console.log('   (expected on local server only)',r.status(),r.url().replace('http://localhost:8095',''))});
  p.on('response',r=>{const u=r.url();if(r.status()>=400&&u.startsWith('http://localhost')&&!/\.netlify\/functions/.test(u))bad.push(r.status()+' '+u.replace('http://localhost:8095',''))});
  await p.goto(`http://localhost:8095/${pg}.html`,{waitUntil:'load'});await p.waitForTimeout(2500);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}});await p.waitForTimeout(800);
  const info=await p.evaluate(()=>({ov:document.documentElement.scrollWidth-innerWidth,csp:window.__csp||[],imgs:[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.offsetParent).map(i=>i.getAttribute('src')),links:[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')).filter(h=>h.startsWith('/')&&!h.startsWith('//'))}));
  const dead=[...new Set(info.links)].filter(l=>!exists(l));
  const res=[info.ov<=0,!errs.length,!info.csp.length,!info.imgs.length,!bad.length,!dead.length];
  const okAll=res.every(Boolean);if(!okAll)fails++;
  console.log((okAll?'PASS':'FAIL'),t,pg,JSON.stringify({overflow:info.ov,jsErrors:errs.slice(0,3),csp:info.csp.slice(0,3),brokenImgs:info.imgs.slice(0,3),failedRequests:bad.slice(0,4),deadLinks:dead.slice(0,6),links:new Set(info.links).size}));
  await ctx.close();}}
console.log('FAILS',fails);await b.close();})();
