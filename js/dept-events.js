/*! MFM Mega Region 2 — department programs renderer.
   Any element with [data-dept-events="<ministry>"] is filled with cards for the
   upcoming events tagged with that ministry in window.MFM_EVENTS (past events auto-hide).
   Cards link through to events.html#<anchor> for full details, gallery, and share. */
(function () {
  function ready(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    var containers = document.querySelectorAll('[data-dept-events]');
    if (!containers.length) return;
    var events = Array.isArray(window.MFM_EVENTS) ? window.MFM_EVENTS : [];

    var today = new Date(); today.setHours(0,0,0,0);
    function parseYMD(s){ if(!s) return null; var p=String(s).split('-'); if(p.length!==3) return null; var d=new Date(+p[0],+p[1]-1,+p[2]); d.setHours(0,0,0,0); return d; }
    function esc(s){ var d=document.createElement('div'); d.textContent=(s==null?'':s); return d.innerHTML; }
    function attr(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/"/g,'&quot;'); }
    var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    function dstr(d){ return MON[d.getMonth()]+' '+d.getDate(); }
    function dateRangeShort(s,e){ if(s.getTime()===e.getTime()) return dstr(s)+', '+s.getFullYear(); return dstr(s)+' – '+dstr(e)+', '+e.getFullYear(); }
    function whenStr(ev,s,e){ var base=ev.dateDisplay||dateRangeShort(s,e); var t=ev.time||''; var showT=t && /\d/.test(t) && /(am|pm|:)/i.test(t) && base.indexOf(t)===-1; return base+(showT?' · '+t:''); }
    function status(s,e){ var sd=Math.round((s-today)/86400000), ed=Math.round((e-today)/86400000); var multi=e.getTime()!==s.getTime(); if(sd<=0&&ed>=0) return multi?{label:'Ongoing',key:'ongoing'}:{label:'Happening Today',key:'now'}; if(sd>7) return {label:'Upcoming',key:'upcoming'}; return {label:'This Week',key:'week'}; }
    function ticketLabel(link){ return /(eventbrite|tickets)/i.test(link)?'Get Tickets':((link.indexOf('register')>-1||link.indexOf('iyc')>-1)?'Register':'Learn More'); }
    function calUrl(ev){ function ymd(x){ return (x||'').replace(/-/g,''); } var start=ymd(ev.date); var base=ev.endDate||ev.date; var d=new Date(base+'T00:00:00'); d.setDate(d.getDate()+1); var end=''+d.getFullYear()+('0'+(d.getMonth()+1)).slice(-2)+('0'+d.getDate()).slice(-2); var details=(ev.description||'')+(ev.time?'\n\nTime: '+ev.time:''); return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(ev.title)+'&dates='+start+'/'+end+'&details='+encodeURIComponent(details)+'&location='+encodeURIComponent(ev.venue||''); }

    var IC = {
      date:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
      pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
      person:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 22a8 8 0 0 1 16 0"/></svg>',
      tix:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/></svg>',
      share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
      stack:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'
    };

    var toast=document.createElement('div'); toast.className='evt-toast'; document.body.appendChild(toast); var toastT;
    function showToast(m){ toast.textContent=m; toast.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(function(){ toast.classList.remove('show'); },2200); }
    function shareUrl(ev){ return ev.anchor ? (location.origin+'/share/'+ev.anchor+'.html') : (location.origin+'/events.html'); }
    function shareEvent(ev){
      var s=parseYMD(ev.date), e=parseYMD(ev.endDate||ev.date)||s, url=shareUrl(ev);
      var msg='🔥 You’re invited — '+ev.title+'\n'
            +'🗓 '+whenStr(ev,s,e)+'\n'
            +(ev.venue?'📍 '+ev.venue+'\n':'')
            +(ev.ministering?'Ministering: '+ev.ministering+'\n':(ev.host?'Host: '+ev.host+'\n':''))
            +'\nFor more information, click the link below.\n'
            +'Please share with friends and family! 🙏\n'
            +url;
      if(navigator.share){ navigator.share({title:ev.title, text:msg}).catch(function(){}); }
      else if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(msg).then(function(){ showToast('Message copied ✓'); }).catch(function(){ showToast('Copy failed'); }); }
      else showToast(url);
    }
    function galleryLen(ev){ return (ev.images && ev.images.length) ? ev.images.length : 1; }

    function cardHTML(ev, idx){
      var s=parseYMD(ev.date), e=parseYMD(ev.endDate||ev.date)||s, st=status(s,e);
      var href='events.html#'+(ev.anchor||''), gl=galleryLen(ev);
      var facts='<div class="evt-fact date">'+IC.date+esc(whenStr(ev,s,e))+'</div>';
      if(ev.venue) facts+='<div class="evt-fact">'+IC.pin+esc(ev.venue)+'</div>';
      if(ev.ministering) facts+='<div class="evt-fact">'+IC.person+'Ministering: '+esc(ev.ministering)+'</div>';
      else if(ev.host) facts+='<div class="evt-fact">'+IC.person+'Host: '+esc(ev.host)+'</div>';
      var acts='';
      if(ev.link){ var ext=/^https?:/i.test(ev.link); acts+='<a class="evt-btn tix" href="'+attr(ev.link)+'"'+(ext?' target="_blank" rel="noopener"':'')+'>'+IC.tix+ticketLabel(ev.link)+'</a>'; }
      acts+='<a class="evt-btn cal" href="'+attr(calUrl(ev))+'" target="_blank" rel="noopener">'+IC.date+'Calendar</a>';
      acts+='<button type="button" class="evt-btn share" aria-label="Share this program" data-share="'+idx+'">'+IC.share+'</button>';
      return '<div class="evt-card">'
        +'<div class="evt-head">'
          +'<a class="evt-thumb" href="'+href+'" title="View details">'
            +'<img src="'+attr(ev.image)+'" alt="'+attr(ev.alt||ev.title)+'" loading="lazy">'
            +(gl>1?'<span class="evt-gbadge">'+IC.stack+gl+'</span>':'')
            +'<span class="vf">View details</span>'
          +'</a>'
          +'<div class="evt-htext"><span class="evt-chip '+st.key+'">'+esc(st.label)+'</span><h4><a href="'+href+'">'+esc(ev.title)+'</a></h4></div>'
        +'</div>'
        +'<div class="evt-facts">'+facts+'</div>'
        +(ev.description?'<div class="evt-desc">'+esc(ev.description)+'</div>':'')
        +'<div class="evt-acts">'+acts+'</div>'
      +'</div>';
    }

    containers.forEach(function (container) {
      var ministry=container.getAttribute('data-dept-events');
      var list=events.map(function(ev){ var s=parseYMD(ev.date); if(!s) return null; var e=parseYMD(ev.endDate)||s; if(e<today) return null; if(ev.ministry!==ministry) return null; return {ev:ev,s:s}; }).filter(Boolean);
      list.sort(function(a,b){ return a.s-b.s; });
      if(!list.length){
        container.classList.remove('dept-events');
        container.innerHTML='<div class="dept-empty"><p>No upcoming programs are scheduled right now — please check back soon.</p><a href="events.html">See all events &rarr;</a></div>';
        return;
      }
      var flat=list.map(function(it){ return it.ev; });
      container.innerHTML=flat.map(function(ev,i){ return cardHTML(ev,i); }).join('');
      container.addEventListener('click',function(e){ var sh=e.target.closest('[data-share]'); if(sh){ e.preventDefault(); shareEvent(flat[parseInt(sh.getAttribute('data-share'),10)]); } });
    });
  });
})();
