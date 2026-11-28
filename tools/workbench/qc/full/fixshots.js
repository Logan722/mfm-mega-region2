const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const shots=[['about',1440,'.site-nav'],['gallery',1440,'.gl-album.cream .gl-head'],['index',1440,'.media-band-grid'],['subscribe',1440,'.sub-card'],['privacy',1440,'.legal-body p[style]'],['about',390,'.scripture-band']];
for(const [pg,w,sel] of shots){const c=await b.newContext({viewport:{width:w,height:900},isMobile:w<500});const p=await c.newPage();await p.goto('http://localhost:8095/'+pg+'.html',{waitUntil:'load'});await p.waitForTimeout(1200);
 if(sel==='.site-nav'){await p.evaluate(()=>scrollTo(0,600));await p.waitForTimeout(500);}
 const el=p.locator(sel).first();await el.scrollIntoViewIfNeeded();await p.waitForTimeout(400);
 if(sel==='.legal-body p[style]'){await p.locator('.legal-body .contact-card').first().screenshot({path:`full/fx-${pg}-${w}a.png`});}
 await el.screenshot({path:`full/fx-${pg}-${w}-${sel.replace(/[^a-z]/g,'')}.png`});await c.close();}
await b.close();})();
