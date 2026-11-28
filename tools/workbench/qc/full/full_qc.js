const { chromium } = require('playwright');const fs=require('fs'),path=require('path');
const ROOT='/home/claude/mfm-mega-region2', BASE='http://localhost:8095';
const redirects=fs.readFileSync(ROOT+'/_redirects','utf8').split('\n').map(l=>l.trim().split(/\s+/)).filter(a=>a[0]&&a[0][0]==='/');
const redirected=p=>redirects.some(r=>r[0]===p&&/^30/.test(r[2]||''));
const exists=(u)=>{let p=decodeURI(u.split('#')[0].split('?')[0]);if(!p||p==='/')return true;if(redirects.some(r=>r[0]===p||r[0]===p.replace(/\/$/,'')))return true;const f=path.join(ROOT,p);if(fs.existsSync(f)&&fs.statSync(f).isFile())return true;if(fs.existsSync(f+'.html'))return true;if(fs.existsSync(path.join(f,'index.html')))return true;return false;};
const top=fs.readdirSync(ROOT).filter(f=>f.endsWith('.html')&&!['_template.html','404.html'].includes(f)).map(f=>f.replace(/\.html$/,''));
const sub=[];for(const d of ['messages','events','branches','newsletter','reach-out'])for(const f of fs.readdirSync(path.join(ROOT,d)).filter(f=>f.endsWith('.html')))sub.push(d+'/'+f.replace(/\.html$/,''));
const all=[...top,...sub].filter(p=>!redirected('/'+p));
const deep=[...top.filter(p=>!redirected('/'+p)),'messages/'+fs.readdirSync(ROOT+'/messages')[0].replace('.html',''),sub.find(s=>s.startsWith('events/')&&!redirected('/'+s)),'branches/mfm-tampa','newsletter/index'].filter(Boolean);
const mode=process.argv[2]||'sweep';
const VPS=mode==='deep'?[[1440,900,0],[1024,768,0],[390,844,1],[360,740,1]]:[[1440,900,0],[390,844,1]];
const list=mode==='deep'?deep:all;
(async()=>{const b=await chromium.launch();const jobs=[];for(const v of VPS)for(const pg of list)jobs.push([v,pg]);
let fails=[],done=0;
async function run([v,pg]){const [w,h,mob]=v;const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:!!mob,hasTouch:!!mob});const p=await ctx.newPage();const errs=[],bad=[];
  await p.addInitScript(()=>{document.addEventListener('securitypolicyviolation',e=>{(window.__csp=window.__csp||[]).push(e.violatedDirective+' '+e.blockedURI)})});
  p.on('pageerror',e=>errs.push(e.message.slice(0,160)));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push(m.text().slice(0,160))});
  p.on('response',r=>{const u=r.url();if(r.status()>=400&&u.startsWith(BASE)&&!/\.netlify\/functions\/(live-status|latest-video|video-search|newsletter-issues|subscribe)/.test(u))bad.push(r.status()+' '+u.replace(BASE,''))});
  try{await p.goto(`${BASE}/${pg}.html`,{waitUntil:'load',timeout:30000});}catch(e){errs.push('goto '+e.message.slice(0,80));}
  await p.waitForTimeout(mode==='deep'?1500:600);
  await p.evaluate(async(d)=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,d));}},mode==='deep'?80:25);await p.waitForTimeout(mode==='deep'?900:400);
  const info=await p.evaluate(()=>{const W=innerWidth;const off=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();if(!r.width||r.right<=W+1)return false;let a=e.parentElement;while(a){const cs=getComputedStyle(a);if(/(auto|scroll|hidden|clip)/.test(cs.overflowX))return false;a=a.parentElement;}return true;}).slice(0,3).map(e=>e.tagName+'.'+(e.className||'').toString().slice(0,30));
    return {ov:document.documentElement.scrollWidth-W,off,csp:window.__csp||[],imgs:[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.offsetParent&&i.loading!=='lazy').map(i=>i.getAttribute('src')),
    lazyBroken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.offsetParent&&i.loading==='lazy'&&i.getBoundingClientRect().top<innerHeight*3).map(i=>i.getAttribute('src')),
    links:[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')).filter(h=>h.startsWith('/')&&!h.startsWith('//')),
    h1:document.querySelectorAll('h1').length,title:document.title}});
  const dead=[...new Set(info.links)].filter(l=>!exists(l));
  const prob={};if(info.ov>0)prob.overflow=info.ov+' '+info.off.join(',');if(errs.length)prob.js=errs.slice(0,2);if(info.csp.length)prob.csp=info.csp.slice(0,2);if(info.imgs.length)prob.img=info.imgs.slice(0,2);if(bad.length)prob.req=bad.slice(0,3);if(dead.length)prob.dead=dead.slice(0,4);if(info.h1!==1)prob.h1=info.h1;if(!info.title)prob.title='missing';
  if(Object.keys(prob).length)fails.push([w,pg,prob]);
  await ctx.close();done++;}
const N=6;let i=0;await Promise.all(Array.from({length:N},async()=>{while(i<jobs.length){const j=jobs[i++];await run(j);}}));
console.log(mode,'pages',list.length,'checks',jobs.length,'problems',fails.length);for(const f of fails)console.log(JSON.stringify(f));await b.close();})();
