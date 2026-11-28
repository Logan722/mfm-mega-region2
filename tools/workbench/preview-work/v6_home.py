# v6 (Nov 26 16:05) — runs inside make_hidden.py on the preview homepage string `s`
import re as _re

# 1) Hero: the big "Coming up next" card -> a smaller box bottom-left (5 designs to choose from)
#    + Pause/Play button bottom-right (home-hero.js already drives [data-hero-toggle]).
HB = ('<div class="hbox" data-hbox data-d="3" hidden></div>'
      '<button type="button" class="hb-play" data-hero-toggle hidden aria-label="Pause background video">'
      '<svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>'
      '<svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>'
      '<span class="hm-label sr-only">Pause</span></button>'
      )
s, n = _re.subn(r'<div class="service-dock">.*?</a></div>', HB, s, count=1, flags=_re.S)
assert n == 1, 'service-dock not found'

HB_JS = r'''<script>/* preview: "Coming up next" box designs 1-5 */
(function(){var hero=document.querySelector('[data-home-hero]'),box=hero&&hero.querySelector('[data-hbox]');if(!box||!window.MFM_EVENTS||!window.MFM_EVT)return;
var U=window.MFM_EVT,list=U.upcoming(window.MFM_EVENTS,new Date());if(!list.length)return;var e=list[0],s=U.start(e);
function esc(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
var tz=e.tz||'America/Chicago',timed=!!e.start;
var day=s.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',timeZone:tz});
var tm=timed?s.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',timeZone:tz,timeZoneName:'short'}):'';
var when=day+(tm?' · '+tm:''),href=e.page||'/events',title=e.title.split(' — ')[0];
var A='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
var K='<span class="hb-k"><i></i>Coming up next</span>';
var T={
 1:'<a class="hb1" href="'+esc(href)+'">'+K+'<b>'+esc(title)+'</b><span class="hb-w">'+esc(when)+'</span>'+A+'</a>',
 2:'<div class="hb2">'+K+'<b>'+esc(title)+'</b><span class="hb-w">'+esc(when)+'</span><a href="'+esc(href)+'">See details '+A+'</a></div>',
 3:'<div class="hb3"><div>'+K+'<b>'+esc(title)+'</b></div><div class="hb-cd" data-ts="'+s.getTime()+'"></div><a href="'+esc(href)+'" aria-label="See details">'+A+'</a></div>',
 4:'<a class="hb4" href="'+esc(href)+'">'+(e.image?'<img src="'+esc(e.image)+'" alt="" width="64" height="64">':'')+'<span>'+K+'<b>'+esc(title)+'</b><span class="hb-w">'+esc(when)+'</span></span>'+A+'</a>',
 5:'<div class="hb5">'+K+'<b>'+esc(title)+'</b><span class="hb-w">'+esc(when)+'</span><a href="'+esc(href)+'">See details '+A+'</a></div>'};
function pad(n){return('0'+n).slice(-2);}
function tick(){var c=box.querySelector('.hb-cd');if(!c)return;var d=+c.getAttribute('data-ts')-Date.now();if(d<=0){c.innerHTML='<span class="hb-now">Happening now</span>';return;}var x=Math.floor(d/1000),dd=Math.floor(x/86400),h=Math.floor(x%86400/3600),m=Math.floor(x%3600/60),sc=x%60;
 c.innerHTML=(dd?'<span><b>'+dd+'</b>d</span>':'')+'<span><b>'+pad(h)+'</b>h</span><span><b>'+pad(m)+'</b>m</span>'+(dd?'':'<span><b>'+pad(sc)+'</b>s</span>');}
var pick=hero.querySelectorAll('[data-pick]');
function show(n){n=T[n]?n:1;box.setAttribute('data-d',n);box.innerHTML=T[n];box.hidden=false;tick();for(var i=0;i<pick.length;i++)pick[i].setAttribute('aria-pressed',pick[i].getAttribute('data-pick')==n?'true':'false');}
for(var i=0;i<pick.length;i++)pick[i].addEventListener('click',function(){show(+this.getAttribute('data-pick'));});
show(3);setInterval(tick,1000);})();</script>'''
s = s.replace('</body>', HB_JS + '\n</body>', 1)

# 2) Today in the region: eyebrow centred; heading left + short text right on one row
s, n = _re.subn(r'<div class="today-head"><span class="ek-eyebrow">Today in the region</span>(<h2 id="today-h">.*?</h2>)(<p>.*?</p>)(<span class="pv-note"[^>]*>.*?</span>)</div>',
                r'<div class="today-head th2"><span class="ek-eyebrow">Today in the region</span><div class="th2-row">\1<div class="th2-r">\2\3</div></div></div>', s, count=1, flags=_re.S)
assert n == 1, 'today head not found'

# 3) Watch & grow: two buttons side by side (short labels on phones)
s, n = _re.subn(r'<a class="button" href="/preview-message#prayer-points"[^>]*>Prayer points from this message</a>(<a class="button light" href="/media">)Watch latest video(<svg.*?</svg></a>)',
                r'<div class="wg-btns"><a class="button wg-pp" href="/preview-message#prayer-points"><span class="lg">Prayer points from this message</span><span class="sm">Prayer points</span></a>\1<span class="lg">Watch latest video</span><span class="sm">Watch latest</span>\2</div>', s, count=1, flags=_re.S)
assert n == 1, 'watch & grow buttons not found'

