// Homepage gallery design options — mockups injected into the local homepage, screenshotted. Not deployed.
const {chromium}=require('playwright');
const G='/img/gallery/';
const A=[
 {t:'Nashville 2026',k:'Nashville, TN · Dedication & Crusade',n:36,href:'/gallery-nashville-2026',img:G+'nashville-deliverance-crusade-2026/the-praise-rises-800.jpg',
  sub:'A new house set apart and a crusade of fire — the General Overseer dedicates MFM Nashville.',
  thumbs:[G+'nashville-deliverance-crusade-2026/a-holy-greeting-800.jpg',G+'nashville-deliverance-crusade-2026/joy-unspeakable-800.jpg',G+'nashville-dedication-2026/the-plaque-800.jpg']},
 {t:'Rekindling the Altar',k:'Houston, TX · Women Foundation Retreat',n:69,href:'/gallery-women-retreat-2026',img:G+'women-retreat-2026/retreat-02-800.jpg'},
 {t:'Regional Prayer Conference',k:'Houston, TX · Gen218 Singles',n:39,href:'/gallery-gen218-prayer-conference-2026',img:G+'gen218-prayer-conference-2026/gen-03-800.jpg'},
 {t:'North Carolina 2026',k:'Burlington, NC · Consecration & Crusade',n:22,href:'/gallery-north-carolina-2026',img:G+'north-carolina-2026/ministers-rejoice-800.jpg'},
 {t:'Florida 2026',k:'Tampa, FL · Deliverance Crusade',n:44,href:'/gallery-florida',img:G+'florida-crusade/hands-stretched-800.jpg'},
];
const arrow='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const head=(ey,h,p)=>`<div class="section-head"><div><p class="eyebrow">${ey}</p><h2>${h}</h2></div><p>${p}</p></div>`;
const card=a=>`<a class="ga-card" href="${a.href}"><span class="ga-img"><img src="${a.img}" alt=""></span><span class="ga-body"><small>${a.k}</small><strong>${a.t}</strong><em>${a.n} photos · See the photos ${arrow}</em></span></a>`;
const allBtn='<div class="ga-all"><a class="button" href="/gallery">View all albums '+arrow+'</a></div>';

const CSS_BASE=`.ga-card{display:flex;flex-direction:column;background:#fff;border:1px solid #e8e1d2;border-radius:14px;overflow:hidden;text-decoration:none;color:#142240;box-shadow:0 10px 30px rgba(20,34,64,.07);transition:transform .2s,box-shadow .2s}
.ga-card:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(20,34,64,.14)}
.ga-img{display:block;aspect-ratio:4/3;overflow:hidden;background:#142240}.ga-img img{width:100%;height:100%;object-fit:cover;display:block}
.ga-body{display:flex;flex-direction:column;gap:6px;padding:18px 20px 20px;text-align:left}
.ga-body small{font:600 11px/1.3 'Inter Tight',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#b8551f}
.ga-body strong{font:600 23px/1.15 Fraunces,serif;color:#142240}
.ga-body em{font:600 14px/1.3 'Inter Tight',sans-serif;font-style:normal;color:#9a7322;display:inline-flex;gap:6px;align-items:center;margin-top:4px}
.ga-all{display:flex;justify-content:center;margin-top:34px}
.ga-all .button{display:inline-flex;gap:8px;align-items:center;background:#142240;color:#fff;padding:15px 26px;border-radius:4px;font:700 14px 'Inter Tight',sans-serif;letter-spacing:.06em;text-transform:uppercase;text-decoration:none}`;

const OPT={
// A — keep mosaic, add 3 newest albums underneath
A:{name:'A — Mosaic + newest albums',
 html:(orig)=>orig.replace('</div></section>','</div><div class="ga-sub"><span>Latest albums</span></div><div class="ga-row">'+A.slice(0,3).map(card).join('')+'</div>'+allBtn+'</section>'),
 css:CSS_BASE+`.ga-sub{display:flex;align-items:center;gap:16px;margin:46px 0 20px;font:600 12px 'Inter Tight',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#142240}.ga-sub:before,.ga-sub:after{content:"";flex:1;height:1px;background:#e1d8c4}
.ga-row{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
@media(max-width:700px){.ga-row{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:14px;margin:0 -16px;padding:0 16px 8px}.ga-row .ga-card{flex:0 0 78%;scroll-snap-align:start}.ga-body strong{font-size:20px}}`},

// B — featured latest album + strip of the rest (replaces the mosaic)
B:{name:'B — Featured latest album',
 html:()=>`<section class="section wrap">${head('Life across the region','Worship. Prayer. The Word.','Real moments from across the region — worship, prayer, deliverance and the Word.')}
 <div class="gb-feat"><a class="gb-big" href="${A[0].href}"><img src="${A[0].img}" alt=""><span class="gb-tag">Latest album</span></a>
 <div class="gb-txt"><small>${A[0].k}</small><h3>${A[0].t}</h3><p>${A[0].sub}</p><div class="gb-th">${A[0].thumbs.map(s=>`<img src="${s}" alt="">`).join('')}<span>+${A[0].n-3}</span></div>
 <div class="gb-btns"><a class="button" href="${A[0].href}">See the photos ${arrow}</a><a class="gb-link" href="/gallery">All albums</a></div></div></div>
 <div class="gb-more">${A.slice(1).map(a=>`<a href="${a.href}"><img src="${a.img}" alt=""><span><strong>${a.t}</strong><small>${a.n} photos</small></span></a>`).join('')}</div></section>`,
 css:CSS_BASE+`.gb-feat{display:grid;grid-template-columns:1.35fr 1fr;gap:44px;align-items:center}
.gb-big{position:relative;display:block;border-radius:16px;overflow:hidden;aspect-ratio:16/11;box-shadow:0 24px 60px rgba(20,34,64,.18)}.gb-big img{width:100%;height:100%;object-fit:cover}
.gb-tag{position:absolute;left:18px;top:18px;background:#c9952c;color:#142240;font:700 11px 'Inter Tight',sans-serif;letter-spacing:.14em;text-transform:uppercase;padding:7px 11px;border-radius:3px}
.gb-txt{text-align:left}.gb-txt small{font:600 12px 'Inter Tight',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#b8551f}
.gb-txt h3{font:600 clamp(34px,3.4vw,48px)/1.05 Fraunces,serif;color:#142240;margin:10px 0 14px}.gb-txt p{font:17px/1.6 'Inter Tight',sans-serif;color:#4a5670;margin:0 0 22px}
.gb-th{display:flex;gap:10px;margin-bottom:26px}.gb-th img,.gb-th span{width:84px;height:84px;border-radius:10px;object-fit:cover}.gb-th span{display:grid;place-items:center;background:#142240;color:#e8b84a;font:600 20px Fraunces,serif}
.gb-btns{display:flex;gap:22px;align-items:center}.gb-btns .button{display:inline-flex;gap:8px;align-items:center;background:#142240;color:#fff;padding:15px 24px;border-radius:4px;font:700 14px 'Inter Tight',sans-serif;letter-spacing:.06em;text-transform:uppercase;text-decoration:none}
.gb-link{font:600 15px 'Inter Tight',sans-serif;color:#9a7322;text-decoration:underline;text-underline-offset:4px}
.gb-more{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:40px}
.gb-more a{display:flex;gap:14px;align-items:center;background:#fff;border:1px solid #e8e1d2;border-radius:12px;padding:10px;text-decoration:none}
.gb-more img{width:72px;height:72px;border-radius:8px;object-fit:cover;flex:none}.gb-more span{display:flex;flex-direction:column;text-align:left;gap:3px}
.gb-more strong{font:600 16px/1.2 Fraunces,serif;color:#142240}.gb-more small{font:13px 'Inter Tight',sans-serif;color:#7a8499}
@media(max-width:900px){.gb-feat{grid-template-columns:1fr;gap:26px}.gb-txt{text-align:center}.gb-th,.gb-btns{justify-content:center}.gb-more{grid-template-columns:1fr 1fr;gap:12px}}
@media(max-width:560px){.gb-th img,.gb-th span{width:64px;height:64px}.gb-more{grid-template-columns:1fr}.gb-btns{flex-direction:column;gap:14px}}`},

// C — navy cinematic filmstrip of all albums (replaces the mosaic)
C:{name:'C — Navy filmstrip',
 html:()=>`<section class="gc"><div class="gc-shaft"></div><div class="wrap"><div class="gc-head"><div><p class="gc-ey">Ministry Moments</p><h2>Where Heaven Came Down</h2><p>Photos from crusades, dedications, conferences and retreats across the region.</p></div><a class="gc-all" href="/gallery">View all albums ${arrow}</a></div>
 <div class="gc-strip">${A.map((a,i)=>`<a class="gc-card${i==0?' gc-new':''}" href="${a.href}"><img src="${a.img}" alt="">${i==0?'<span class="gc-badge">New</span>':''}<span class="gc-cap"><small>${a.k}</small><strong>${a.t}</strong><em>${a.n} photos</em></span></a>`).join('')}</div></div></section>`,
 css:CSS_BASE+`.gc{position:relative;background:#142240;color:#fff;padding:96px 0 100px;overflow:hidden}
.gc-shaft{position:absolute;inset:-20% auto auto 55%;width:60%;height:140%;background:radial-gradient(ellipse at top,rgba(232,184,74,.22),transparent 60%);transform:rotate(18deg);pointer-events:none}
.gc:after{content:"";position:absolute;inset:0;opacity:.07;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E");pointer-events:none}
.gc .wrap{position:relative;z-index:1}.gc-head{display:flex;flex-direction:column;align-items:center;text-align:center;gap:22px;margin-bottom:44px}.gc-head p{margin:0 auto!important}
.gc .gc-ey{font:600 12px 'Inter Tight',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#e8b84a!important;margin:0 0 12px}
.gc h2{font:600 clamp(36px,4vw,56px)/1.05 Fraunces,serif;color:#fff;margin:0 0 12px}.gc-head p{font:17px/1.6 'Inter Tight',sans-serif;color:#c6cde0;margin:0;max-width:52ch}
.gc-all{flex:none;display:inline-flex;gap:8px;align-items:center;border:1px solid #c9952c;color:#e8b84a;padding:14px 22px;border-radius:4px;font:700 13px 'Inter Tight',sans-serif;letter-spacing:.08em;text-transform:uppercase;text-decoration:none}
.gc-strip{display:grid;grid-auto-flow:column;grid-auto-columns:calc((100% - 72px)/4);gap:24px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:10px}
.gc-card{position:relative;aspect-ratio:4/5;border-radius:14px;overflow:hidden;scroll-snap-align:start;text-decoration:none;box-shadow:0 20px 50px rgba(0,0,0,.4)}
.gc-card img{width:100%;height:100%;object-fit:cover;transition:transform .5s}.gc-card:hover img{transform:scale(1.05)}
.gc-card:after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 35%,rgba(10,18,38,.85) 62%,rgba(10,18,38,.98))}
.gc-cap{position:absolute;left:20px;right:20px;bottom:20px;z-index:1;display:flex;flex-direction:column;gap:5px;text-align:left}
.gc-cap small{font:600 10.5px 'Inter Tight',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#e8b84a}.gc-cap strong{font:600 24px/1.1 Fraunces,serif;color:#fff}.gc-cap em{font:14px 'Inter Tight',sans-serif;font-style:normal;color:#c6cde0}
.gc-badge{position:absolute;top:16px;left:16px;z-index:1;background:#e85d26;color:#fff;font:700 11px 'Inter Tight',sans-serif;letter-spacing:.14em;text-transform:uppercase;padding:6px 10px;border-radius:3px}
@media(max-width:800px){.gc{padding:64px 0 70px}.gc-head{flex-direction:column;align-items:center;text-align:center}.gc-head p{margin:0 auto}.gc-strip{grid-auto-columns:72%;margin:0 -16px;padding:0 16px 10px}}`},

// D — photo wall with album tabs (replaces the mosaic)
D:{name:'D — Photo wall with album tabs',
 html:()=>{const ph=[A[0].img,A[0].thumbs[0],A[0].thumbs[1],G+'nashville-deliverance-crusade-2026/hands-lifted-800.jpg',G+'nashville-deliverance-crusade-2026/leading-the-worship-800.jpg',A[0].thumbs[2],G+'nashville-dedication-2026/the-word-goes-forth-800.jpg',G+'nashville-deliverance-crusade-2026/ministering-in-dance-800.jpg'];
  return `<section class="section wrap">${head('Life across the region','Worship. Prayer. The Word.','Real moments from across the region — worship, prayer, deliverance and the Word.')}
  <div class="gd-tabs" role="tablist">${A.map((a,i)=>`<button class="${i==0?'on':''}">${a.t}</button>`).join('')}</div>
  <div class="gd-wall">${ph.map((s,i)=>`<a href="${A[0].href}" class="gd-${i}"><img src="${s}" alt=""></a>`).join('')}</div>
  <div class="gd-foot"><span><strong>${A[0].t}</strong> · ${A[0].k} · ${A[0].n} photos</span><a class="button" href="${A[0].href}">Open this album ${arrow}</a></div></section>`},
 css:CSS_BASE+`.gd-tabs{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:0 0 28px}
.gd-tabs button{font:600 14px 'Inter Tight',sans-serif;padding:11px 18px;border-radius:999px;border:1px solid #d9cfba;background:#fff;color:#142240;cursor:pointer}.gd-tabs button.on{background:#142240;color:#fff;border-color:#142240}
.gd-wall{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:190px;gap:12px}.gd-wall a{display:block;border-radius:10px;overflow:hidden}.gd-wall img{width:100%;height:100%;object-fit:cover;transition:transform .4s}.gd-wall a:hover img{transform:scale(1.05)}
.gd-0{grid-column:span 2;grid-row:span 2}.gd-3{grid-row:span 2}
.gd-foot{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-top:24px;font:15px 'Inter Tight',sans-serif;color:#4a5670}.gd-foot strong{font:600 18px Fraunces,serif;color:#142240}
.gd-foot .button{display:inline-flex;gap:8px;align-items:center;background:#142240;color:#fff;padding:14px 22px;border-radius:4px;font:700 13px 'Inter Tight',sans-serif;letter-spacing:.06em;text-transform:uppercase;text-decoration:none}
@media(max-width:700px){.gd-tabs{flex-wrap:nowrap;overflow-x:auto;justify-content:flex-start;margin:0 -16px 20px;padding:0 16px}.gd-tabs button{flex:none}.gd-wall{grid-template-columns:1fr 1fr;grid-auto-rows:130px;gap:8px}.gd-wall a:nth-child(n+7){display:none}.gd-0{grid-column:span 2}.gd-foot{flex-direction:column;text-align:center}}`},
};

(async()=>{
 const b=await chromium.launch();
 for(const [id,o] of Object.entries(OPT)){
  for(const [vw,tag] of [[1440,'desktop'],[390,'phone']]){
   const ctx=await b.newContext({viewport:{width:vw,height:900},deviceScaleFactor:vw<500?2:1});
   const p=await ctx.newPage();
   await p.route(/newsletter-popup/,r=>r.abort());
   await p.goto('http://localhost:8090/index.html',{waitUntil:'load'});
   const orig=await p.evaluate(()=>[...document.querySelectorAll('section')].find(s=>s.innerText.includes('Worship. Prayer. The Word.')).outerHTML);
   const out=o.html(orig);
   await p.evaluate(([out,css])=>{
     const sec=[...document.querySelectorAll('section')].find(s=>s.innerText.includes('Worship. Prayer. The Word.'));
     const tmp=document.createElement('div'); tmp.innerHTML=out; const n=tmp.firstElementChild; n.id='gal-opt'; sec.replaceWith(n);
     const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
   },[out,o.css]);
   await p.evaluate(()=>{document.querySelectorAll('#gal-opt img').forEach(i=>{i.loading='eager'})});
   await p.addStyleTag({content:'.site-nav,header,.live-strip,.skip-link,a[href="#content"]{display:none!important}'});
   const el=await p.$('#gal-opt'); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(1800);
   await p.evaluate(()=>Promise.all([...document.querySelectorAll('#gal-opt img')].map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r}))));
   await p.waitForTimeout(400);
   const bb=await el.boundingBox(); const sy=await p.evaluate(()=>scrollY);
   await p.screenshot({path:`/home/claude/galopts/option-${id}-${tag}.png`,fullPage:true,clip:{x:0,y:bb.y+sy,width:vw,height:bb.height}});
   const w=await p.evaluate(()=>document.documentElement.scrollWidth); if(w>vw) console.log('OVERFLOW',id,tag,w);
   await ctx.close();
  }
  console.log('done',o.name);
 }
 await b.close();
})();
