const { chromium } = require('playwright');
const B='http://localhost:8095';const R=[];const ok=(n,c,x)=>R.push([c?'PASS':'FAIL',n,x||'']);
(async()=>{const b=await chromium.launch();
const ctxOf=async(mob)=>b.newContext(mob?{viewport:{width:390,height:844},isMobile:true,hasTouch:true}:{viewport:{width:1440,height:900}});
let c,p,errs;
async function open(url,mob){c=await ctxOf(mob);p=await c.newPage();errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto(B+url,{waitUntil:'load'});await p.waitForTimeout(1200);}
// Women: phone pastor pop-up
await open('/women.html',true);
await p.locator('.only-m button.lead').first().click();await p.waitForTimeout(500);
ok('women phone: tap pastor opens profile',await p.evaluate(()=>!!document.querySelector('dialog.wf-ld[open]')));
ok('women phone: profile shows full details',await p.evaluate(()=>{const d=document.querySelector('dialog[open]');return d&&d.querySelectorAll('.bd p').length>=2&&!!d.querySelector('.leader-socials a')}));
await p.keyboard.press('Escape');await p.waitForTimeout(400);ok('women phone: Esc closes',await p.evaluate(()=>!document.querySelector('dialog[open]')));
ok('women phone: focus back on tile',await p.evaluate(()=>document.activeElement&&document.activeElement.matches('button.lead')));
ok('women phone: pillars swipe with 3 dots',await p.evaluate(()=>document.querySelectorAll('.only-m .sw-dots button').length===3));
ok('women: no JS errors (phone)',!errs.length,errs.join('|'));await c.close();
await open('/women.html',false);
ok('women desktop: cinematic leaders visible, bento hidden',await p.evaluate(()=>!!document.querySelector('.only-d .w1-lead').offsetParent&&!document.querySelector('.only-m').offsetParent));
ok('women desktop: 6 messages in screening room',await p.evaluate(()=>document.querySelectorAll('.cine .message-card').length===6));
ok('women: no JS errors (desktop)',!errs.length,errs.join('|'));await c.close();
// Gen218
await open('/gen218.html',true);
ok('gen218 phone: values swipe (3 dots)',await p.evaluate(()=>document.querySelectorAll('.valt .sw-dots button').length===3));
ok('gen218 phone: conference video present',await p.evaluate(()=>!!document.querySelector('.gen-moments .yt-lite')));
await p.locator('.gen-moments .yt-lite').click();await p.waitForTimeout(800);
ok('gen218: tapping video loads the player',await p.evaluate(()=>!!document.querySelector('.gen-moments iframe')));
ok('gen218: no JS errors',!errs.length,errs.join('|'));await c.close();
// Media
await open('/media.html',true);
ok('media phone: filters folded at start',await p.evaluate(()=>!document.querySelector('.filter-selects').offsetParent));
await p.click('.mf-toggle');await p.waitForTimeout(300);
ok('media phone: Filters opens drop-down',await p.evaluate(()=>!!document.querySelector('.filter-selects').offsetParent));
await p.locator('.quick-filter-row button[data-topic="Deliverance"]').click();await p.waitForTimeout(500);
const cnt=await p.textContent('#mCount');ok('media phone: topic filter works',/Showing \d+ message/.test(cnt),cnt);
await p.click('.mf-toggle');await p.waitForTimeout(300);
ok('media phone: badge shows 1 filter on',(await p.textContent('.mf-toggle b'))==='1');
await p.click('.mf-toggle');await p.click('#mClear');await p.waitForTimeout(400);
ok('media phone: Clear resets to latest 9',await p.evaluate(()=>[...document.querySelectorAll('#mGrid .message-card')].filter(c=>c.offsetParent).length===9));
ok('media: no livestream cards (40 videos)',await p.evaluate(()=>document.querySelectorAll('#mGrid .message-card').length===40));
ok('media: deleted videos gone',await p.evaluate(()=>!document.querySelector('[data-yt="GfjeCUgrrlY"],[data-yt="qaWwifZRJ6M"]')));
ok('media: no Start searching button',await p.evaluate(()=>!/Start searching/.test(document.body.textContent)));
ok('media: no JS errors',!errs.length,errs.join('|'));await c.close();
await open('/media.html?topic=Prayer',false);
ok('media desktop: URL filter (?topic=Prayer) applied',await p.evaluate(()=>document.getElementById('mTopic').value==='Prayer'));
ok('media desktop: filters always visible, no toggle',await p.evaluate(()=>!!document.querySelector('.filter-selects').offsetParent&&!document.querySelector('.mf-toggle').offsetParent));
await c.close();
// Testimonies
await open('/testimonies.html',false);
ok('testimonies: 3 real testimonies',await p.evaluate(()=>document.querySelectorAll('.dz [data-cat], .dz .tc').length>=3));
await p.fill('input[type=search]','baby');await p.waitForTimeout(400);
ok('testimonies: search narrows',await p.evaluate(()=>[...document.querySelectorAll('.dz .tc')].filter(x=>x.offsetParent).length>=1));
ok('testimonies: no JS errors',!errs.length,errs.join('|'));await c.close();
// Reach out subjects
for(const [u,want] of [['/reach-out/prayer','Request prayer'],['/reach-out/testimony','Share your testimony'],['/reach-out/contact','Contact us']]){await open(u+'.html',true);const h=await p.textContent('#reach-out h1');ok('reach-out '+u+' heading',new RegExp(want,'i').test(h),h);
 ok('reach-out '+u+' form is the real Netlify form',await p.evaluate(()=>{const f=document.getElementById('reachForm');return !!f&&f.getAttribute('name')==='reach-out'&&f.hasAttribute('data-netlify')}));await c.close();}
// Homepage
await open('/index.html',true);
ok('home phone: testimonies swipe dots',await p.evaluate(()=>{const d=document.querySelector('.tsa-dots');return !!d&&!d.hidden}));
ok('home phone: Today card has a declaration',await p.evaluate(()=>(document.querySelector('.tp-decl, .today, #today')||document.body).textContent.length>40));
ok('home: no JS errors',!errs.length,errs.join('|'));await c.close();
await open('/ministries.html',true);
ok('ministries phone: tabs',await p.evaluate(()=>document.querySelectorAll('.mtabs button').length>=3));
const t2=await p.locator('.mtabs button').nth(1);await t2.click();await p.waitForTimeout(300);
ok('ministries phone: tab switches',await p.evaluate(()=>document.querySelectorAll('.ministry-grid>article:not(.mt-off)').length===1));await c.close();
await open('/live.html',true);ok('live phone: two-across tiles',await p.evaluate(()=>getComputedStyle(document.getElementById('lvGrid')).gridTemplateColumns.split(' ').length===2));await c.close();
// footer
await open('/about.html',false);ok('footer: logo hidden, Obadiah verse',await p.evaluate(()=>{const i=document.querySelector('.site-footer .footer-identity img');return (!i||!i.offsetParent)&&/Obadiah/i.test(document.querySelector('.site-footer').textContent)}));await c.close();
for(const r of R)console.log(r.join('  '));console.log('FAILS',R.filter(r=>r[0]==='FAIL').length,'of',R.length);await b.close();})();
